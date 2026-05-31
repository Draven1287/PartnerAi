import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url);

function file(path) {
  return new URL(path, root);
}

function read(path) {
  return readFileSync(file(path), 'utf8');
}

function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: options.cwd ? file(options.cwd) : root,
    stdio: 'pipe'
  });
}

function assertExists(path) {
  assert.equal(existsSync(file(path)), true, `${path} is missing`);
}

function assertIncludes(path, text) {
  assert.ok(read(path).includes(text), `${path} must include ${text}`);
}

function assertNotIncludes(path, text) {
  assert.ok(!read(path).includes(text), `${path} must not include ${text}`);
}

assertExists('coolify-backend/server.mjs');
assertExists('coolify-backend/Dockerfile');
assertExists('coolify-backend/docker-compose.yml');
assertExists('coolify-backend/test-server.mjs');
assertExists('backend-config.js');
assertExists('backend-client.js');

assertIncludes('coolify-backend/docker-compose.yml', 'ADMIN_TOKEN: ${ADMIN_TOKEN:?ADMIN_TOKEN is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'learning-ai-minutes-data:/app/data');
assertIncludes('coolify-backend/docker-compose.yml', '/health');
assertIncludes('coolify-backend/docker-compose.yml', 'expose:');
assertIncludes('coolify-backend/Dockerfile', 'DATA_FILE=/app/data/minutes.json');
assertNotIncludes('coolify-backend/server.mjs', 'manual-form');
assertNotIncludes('coolify-backend/server.mjs', 'ALLOWED_AGENTS');
assertNotIncludes('coolify-backend/server.mjs', 'agent-filter');
assertNotIncludes('coolify-backend/server.mjs', 'api/admin/agents');
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/health'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/leaderboard'");
assertIncludes('coolify-backend/server.mjs', 'ADMIN_TOKEN is required in production');
assertIncludes('coolify-backend/server.mjs', 'Read-only admin view');
assertIncludes('coolify-backend/server.mjs', 'total-saves');
assertIncludes('coolify-backend/server.mjs', '<th>Minute saves</th>');
assertIncludes('coolify-backend/server.mjs', '<th>Last saved</th>');

const backendConfig = read('backend-config.js');
assert.match(
  backendConfig,
  /window\.LEARNING_AI_BACKEND_URL\s*=\s*'(?:|https:\/\/[^']+)';/,
  'backend-config.js must be blank or an https backend URL'
);
assertNotIncludes('backend-config.js', 'ADMIN_TOKEN');
assertNotIncludes('backend-config.js', 'API_KEY');
assertNotIncludes('backend-client.js', 'ADMIN_TOKEN');
assertNotIncludes('backend-client.js', 'API_KEY');

const publicHtml = ['index.html', 'my-path.html', 'course.html', 'assessment.html'];
for (const path of publicHtml) {
  assertNotIncludes(path, 'leaderboard');
  assertNotIncludes(path, 'api/admin/leaderboard');
  assertNotIncludes(path, 'api/admin/agents');
}

assertIncludes('my-path.html', 'private-progress-panel');
assertIncludes('my-path.html', 'This logs your name and minutes to the private Learning AI backend');
assertIncludes('my-path.html', 'private-progress-total');
assertNotIncludes('my-path.html', 'private-progress-consent');
assertNotIncludes('my-path.html', 'name="agent"');
assertNotIncludes('my-path.html', '<option>Mentor</option>');
assertNotIncludes('my-path.html', '<option>Coach</option>');
assertNotIncludes('backend-client.js', 'agent');
assertNotIncludes('backend-client.js', 'browserId');
assertNotIncludes('backend-client.js', 'sourcePage');
assertIncludes('script.js', 'learningai-private-minutes');
assertIncludes('script.js', 'progressStorageKey');
assertIncludes('script.js', 'consent: true');
assertNotIncludes('coolify-backend/server.mjs', 'browserIdHash');
assertNotIncludes('coolify-backend/server.mjs', 'sourcePage');
assertIncludes('script.js', 'initPrivateProgressSync');

run('node', ['--check', 'coolify-backend/server.mjs']);
run('node', ['--check', 'coolify-backend/test-server.mjs']);
run('node', ['--check', 'script.js']);
run('node', ['--check', 'backend-client.js']);
run('node', ['test-server.mjs'], { cwd: 'coolify-backend' });

console.log('Backend readiness checks passed');
