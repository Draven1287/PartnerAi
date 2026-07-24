import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const port = 20_000 + (process.pid % 20_000);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['frontend-server.mjs'], {
  cwd: root,
  env: { ...process.env, PORT: String(port), CANONICAL_HOST: '' },
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForServer() {
  let output = '';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Frontend did not start.\n${output}`)), 8_000);
    const onData = chunk => {
      output += chunk.toString();
      if (!output.includes('Learning AI frontend listening')) return;
      clearTimeout(timer);
      resolve();
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', chunk => { output += chunk.toString(); });
    server.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(`Frontend exited early with ${code}.\n${output}`));
    });
  });
}

async function status(path) {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
  await response.arrayBuffer();
  return response.status;
}

try {
  await waitForServer();
  for (const path of [
    '/',
    '/about.html',
    '/projects.html',
    '/learning-ai-design-assets/theme.css',
    '/v2/',
    '/v3/',
    '/styles.css',
    '/privacy.html',
    '/robots.txt'
  ]) {
    assert.equal(await status(path), 200, `${path} must remain publicly available`);
  }
  const accessPage = await readFile(new URL('../learning-ai-design-assets/access.html', import.meta.url), 'utf8');
  assert.match(accessPage, /id="showPassword" type="button"/, 'password visibility control must be a touch-safe button');
  assert.match(accessPage, /aria-controls="accountPassword" aria-pressed="false"/, 'password visibility control must expose accessible state');
  assert.match(accessPage, /password\.type=willShow\?'text':'password'/, 'password visibility button must toggle the input type');
  assert.match(accessPage, /showPassword\.textContent=willShow\?'Hide password':'Show password'/, 'password visibility button must explain its current action');
  for (const path of [
    '/HANDOFF.md',
    '/DESIGN-MIGRATION-PLAN.md',
    '/design.md',
    '/coolify-backend/server.mjs',
    '/docs/anything.html',
    '/reviews/anything.html',
    '/lessons/README.md',
    '/learning-ai-design-assets/reviewer-seed.json',
    '/package-lock.json',
    '/railway.toml'
  ]) {
    assert.equal(await status(path), 404, `${path} must not be publicly served`);
  }
  console.log('Frontend public-surface checks passed');
} finally {
  server.kill('SIGTERM');
}
