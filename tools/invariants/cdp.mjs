/* A minimal Chrome DevTools Protocol driver.

   No dependency: Node 22 ships a global WebSocket, and Chrome is already on
   this machine. The harness needs a real browser because every invariant it
   checks is about what the browser *does* — which redirect wins, which
   storage write lands, which CSS rule outranks which. None of that is legible
   from the source text, which is exactly why reading the code missed it.

   Launch Chrome once, drive one tab, reuse it for every case. */
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);

function findChrome() {
  const found = CHROME_CANDIDATES.find(path => existsSync(path));
  if (!found) throw new Error(`No Chrome found. Set CHROME_PATH. Tried:\n  ${CHROME_CANDIDATES.join('\n  ')}`);
  return found;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function launchBrowser() {
  const binary = findChrome();
  const profile = mkdtempSync(join(tmpdir(), 'learningai-invariants-'));
  const child = spawn(binary, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-features=Translate,MediaRouter,OptimizationHints,CalculateNativeWinOcclusion',
    '--window-size=1280,900',
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk.toString(); });

  const portFile = join(profile, 'DevToolsActivePort');
  let endpoint = '';
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (existsSync(portFile)) {
      const [port, path] = readFileSync(portFile, 'utf8').split('\n');
      if (port && path) { endpoint = `ws://127.0.0.1:${port.trim()}${path.trim()}`; break; }
    }
    if (child.exitCode !== null) throw new Error(`Chrome exited with ${child.exitCode}.\n${stderr}`);
    await sleep(50);
  }
  if (!endpoint) throw new Error(`Chrome never published a debugging port.\n${stderr}`);

  const browser = await connect(endpoint);
  browser.close = async () => {
    try { await browser.send('Browser.close'); } catch {}
    try { child.kill('SIGKILL'); } catch {}
    await sleep(120);
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  };
  return browser;
}

function connect(endpoint) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(endpoint);
    const pending = new Map();
    const listeners = new Set();
    let nextId = 1;

    socket.addEventListener('message', event => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.id !== undefined) {
        const entry = pending.get(message.id);
        if (!entry) return;
        pending.delete(message.id);
        if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message}`));
        else entry.resolve(message.result);
        return;
      }
      for (const listener of [...listeners]) listener(message);
    });
    socket.addEventListener('error', () => reject(new Error(`Could not reach ${endpoint}`)));
    socket.addEventListener('close', () => {
      for (const entry of pending.values()) entry.reject(new Error('DevTools socket closed'));
      pending.clear();
    });
    socket.addEventListener('open', () => {
      const send = (method, params = {}, sessionId) => new Promise((ok, no) => {
        const id = nextId++;
        pending.set(id, { resolve: ok, reject: no, method });
        socket.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
        setTimeout(() => {
          if (!pending.has(id)) return;
          pending.delete(id);
          no(new Error(`${method} timed out after 30s`));
        }, 30_000);
      });
      resolve({
        send,
        on: listener => { listeners.add(listener); return () => listeners.delete(listener); },
        newPage: () => openPage({ send, on: listener => { listeners.add(listener); return () => listeners.delete(listener); } })
      });
    });
  });
}

async function openPage(browser) {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });

  const state = {
    navigations: 0,
    consoleErrors: [],
    pageErrors: [],
    requests: []
  };

  browser.on(message => {
    if (message.sessionId !== sessionId) return;
    const { method, params } = message;
    if (method === 'Page.frameNavigated' && !params.frame.parentId) state.navigations += 1;
    if (method === 'Runtime.exceptionThrown') {
      const d = params.exceptionDetails;
      state.pageErrors.push(d.exception?.description || d.text || 'exception');
    }
    if (method === 'Runtime.consoleAPICalled' && (params.type === 'error' || params.type === 'assert')) {
      state.consoleErrors.push(params.args.map(a => a.description ?? a.value ?? a.type).join(' '));
    }
    if (method === 'Log.entryAdded' && params.entry.level === 'error') {
      // The URL matters: a 503 from the API the harness is not running is the
      // harness's doing, and only the URL says so.
      state.consoleErrors.push(`${params.entry.source}: ${params.entry.text} <${params.entry.url || ''}>`);
    }
    if (method === 'Network.requestWillBeSent') {
      state.requests.push({ url: params.request.url, type: params.type });
    }
  });

  const send = (method, params) => browser.send(method, params, sessionId);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Network.enable');

  const page = {
    state,
    send,
    resetLog() {
      state.navigations = 0;
      state.consoleErrors = [];
      state.pageErrors = [];
      state.requests = [];
    },
    async evaluate(expression) {
      const result = await send('Runtime.evaluate', {
        expression: `(() => { ${expression} })()`,
        returnByValue: true,
        awaitPromise: true
      });
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      }
      return result.result.value;
    },
    /* Runs before any of the page's own scripts, on every navigation. The
       only way to watch what a page does to itself as it does it. */
    async beforeEachLoad(source) {
      const { identifier } = await send('Page.addScriptToEvaluateOnNewDocument', { source });
      return () => send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    },
    async viewport(width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: 1, mobile: false
      });
    },
    /* Navigate, then wait for every redirect to settle.

       "Settled" means location.href stopped changing. That is the only
       definition that catches a chain (guard sends you to A, A's guard sends
       you to B) and a loop (A to B to A ...), and both were real. Returns the
       address the visitor actually ends up looking at, plus the hop count. */
    async goto(url, { budget = 6_000 } = {}) {
      page.resetLog();
      await send('Page.navigate', { url });
      return page.settle({ budget });
    },
    /* Wait where we are until location.href stops changing. Used after a
       click as well as after a navigation — "where does finishing the free
       lesson take me" is the same question as "where does opening it take
       me", and it had the same bug. */
    async settle({ budget = 6_000, from = 1 } = {}) {
      let href = '';
      let stable = 0;
      const deadline = Date.now() + budget;
      while (Date.now() < deadline) {
        await sleep(70);
        let now;
        try { now = await page.evaluate('return location.href'); } catch { continue; }
        if (now === href) { stable += 1; if (stable >= 4) break; }
        else { href = now; stable = 0; }
      }
      // A loop never stabilises; the hop counter is what names it.
      return { url: href, hops: Math.max(0, state.navigations - from), settled: stable >= 4 };
    },
    async close() {
      try { await browser.send('Target.closeTarget', { targetId }); } catch {}
    }
  };
  return page;
}
