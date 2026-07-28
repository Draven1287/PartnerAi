/* Serve the site with the real production server.

   frontend-server.mjs is what Railway runs. Using it here means the harness
   sees the real Content-Security-Policy, the real MIME types and the real
   public-surface rules, so "no external resources" is checked against the
   policy that actually ships rather than a convenient stand-in. */
import { spawn } from 'node:child_process';

const root = new URL('../../', import.meta.url);

export async function startSite() {
  const port = 21_000 + (process.pid % 9_000);
  const child = spawn(process.execPath, ['frontend-server.mjs'], {
    cwd: root,
    env: { ...process.env, PORT: String(port), CANONICAL_HOST: '', NODE_ENV: 'test' },
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
    stop: () => { try { child.kill('SIGKILL'); } catch {} }
  };
}
