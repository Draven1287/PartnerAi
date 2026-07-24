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
  const lessonPage = await readFile(new URL('../learning-ai-design-assets/lesson.html', import.meta.url), 'utf8');
  assert.match(lessonPage, /answers are still saved as a draft on this device/, 'failed lesson saves must accurately preserve and describe the local draft');
  assert.match(lessonPage, /lesson is not marked complete until it saves to your account/, 'failed lesson saves must not claim completion');
  assert.doesNotMatch(lessonPage, /lesson is complete on this device, but the account copy did not save/i, 'failed lesson saves must not report a false local completion');
  assert.match(lessonPage, /Saving your place/, 'lesson player must visibly sync intermediate step progress');
  assert.match(lessonPage, /saveToolkit/, 'lesson notes must sync to the account without gating Next');
  const onboardingPage = await readFile(new URL('../learning-ai-design-assets/onboarding.html', import.meta.url), 'utf8');
  assert.match(onboardingPage, /theme\.js\?v=teen-game-4/, 'questionnaire page must load the shared onboarding controller');
  assert.match(accessPage, /Continue to the questions/, 'successful account creation must continue to the questionnaire');
  assert.match(accessPage, /Retry saving Lesson 1/, 'a new account session must retry Lesson 1 without forcing another sign-in');
  const apiClient = await readFile(new URL('../learning-ai-design-assets/learning-api.js', import.meta.url), 'utf8');
  assert.match(apiClient, /queueMinutes/, 'focus minutes must have an offline-safe account sync queue');
  assert.match(apiClient, /saveToolkit/, 'Saved Notes must use the account API');
  assert.match(apiClient, /restoredFromAccountAt/, 'account hydration must restore cross-device learning state');
  const themeController = await readFile(new URL('../learning-ai-design-assets/theme.js', import.meta.url), 'utf8');
  assert.match(themeController, /reviewHost &&/, 'review mode must be restricted to local preview hosts');
  const progressPage = await readFile(new URL('../learning-ai-design-assets/progress.html', import.meta.url), 'utf8');
  assert.match(progressPage, /Continue learning/, 'progress must include an obvious resume action');
  assert.match(progressPage, /document\.createElement\(available\?'a':'article'\)/, 'ready arcs must be actionable while locked arcs remain inert');
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
