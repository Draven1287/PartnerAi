/* Serve the site with the real production server.

   frontend-server.mjs is what Railway runs. Using it here means the harness
   sees the real Content-Security-Policy, the real MIME types and the real
   public-surface rules, so "no external resources" is checked against the
   policy that actually ships rather than a convenient stand-in. */
import { spawn } from 'node:child_process';

const root = new URL('../../', import.meta.url);

/* Optionally run the real backend behind the real frontend proxy.

   Without it /api/* answers 503 and every routing case is decided by
   localStorage alone — which is exactly why a learner signed in on a fresh
   browser was never tested, and why a duplicate localStorage-only guard sat
   in lesson.html until a real learner hit it. */
async function startBackend(port) {
  const child = spawn(process.execPath, ['tools/dev-v2-backend.mjs'], {
    cwd: root,
    env: {
      ...process.env, PORT: String(port), NODE_ENV: 'development',
      CORS_ORIGINS: `http://127.0.0.1:${port - 1},http://localhost:${port - 1}`,
      ADMIN_CORS_ORIGINS: `http://127.0.0.1:${port - 1},http://localhost:${port - 1}`
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let log = '';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Backend did not start.\n${log}`)), 12_000);
    const watch = chunk => {
      log += chunk.toString();
      if (!log.includes('backend on')) return;
      clearTimeout(timer); resolve();
    };
    child.stdout.on('data', watch);
    child.stderr.on('data', chunk => { log += chunk.toString(); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Backend exited with ${code}.\n${log}`)); });
  });
  return child;
}

export async function startSite({ withBackend = false } = {}) {
  const port = 21_000 + (process.pid % 9_000);
  const apiPort = port + 1;
  const api = withBackend ? await startBackend(apiPort) : null;
  const child = spawn(process.execPath, ['frontend-server.mjs'], {
    cwd: root,
    env: {
      ...process.env, PORT: String(port), CANONICAL_HOST: '', NODE_ENV: 'test',
      ...(withBackend ? { API_INTERNAL_URL: `http://127.0.0.1:${apiPort}` } : {})
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let log = '';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Frontend did not start.\n${log}`)), 10_000);
    child.stdout.on('data', chunk => {
      log += chunk.toString();
      if (!log.includes('Learning AI frontend listening')) return;
      clearTimeout(timer);
      resolve();
    });
    child.stderr.on('data', chunk => { log += chunk.toString(); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Frontend exited with ${code}.\n${log}`)); });
  });
  return {
    // 127.0.0.1 is one of theme.js's "preview hosts", where ?review=1 is
    // honoured. Every case here therefore states preview explicitly, through
    // the stored switch, and never leaves ?review=1 on a URL by accident.
    origin: `http://127.0.0.1:${port}`,
    hasBackend: Boolean(api),
    stop: () => {
      try { child.kill('SIGKILL'); } catch {}
      try { api?.kill('SIGKILL'); } catch {}
    }
  };
}
