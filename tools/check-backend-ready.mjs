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

assertExists('Referenceable Content.md');
assertExists('coolify-backend/server.mjs');
assertExists('coolify-backend/db.mjs');
assertExists('coolify-backend/Dockerfile');
assertExists('coolify-backend/docker-compose.yml');
assertExists('coolify-backend/test-server.mjs');
assertExists('backend-config.js');
assertExists('backend-client.js');
assertExists('v2/v2-api.js');
assertExists('v2/mona-lisa-progress.png');

assertIncludes('coolify-backend/docker-compose.yml', 'learning-ai-postgres:');
assertIncludes('coolify-backend/docker-compose.yml', 'POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'SESSION_SECRET: ${SESSION_SECRET:?SESSION_SECRET is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'ADMIN_EMAIL: ${ADMIN_EMAIL:?ADMIN_EMAIL is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'https://api.learningai4you.com');
assertIncludes('coolify-backend/docker-compose.yml', '/health');
assertIncludes('coolify-backend/docker-compose.yml', 'expose:');
assertIncludes('coolify-backend/Dockerfile', 'COPY server.mjs db.mjs ./');
assertIncludes('coolify-backend/package.json', '"pg"');
assertIncludes('coolify-backend/package.json', '"bcryptjs"');

assertIncludes('coolify-backend/server.mjs', "url.pathname === '/health'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/login'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/import-local'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/visit'");
assertIncludes('coolify-backend/server.mjs', 'csrf_required');
assertIncludes('coolify-backend/server.mjs', 'handleV1Minutes');
assertNotIncludes('coolify-backend/server.mjs', 'ADMIN_TOKEN is required in production');
assertNotIncludes('coolify-backend/server.mjs', 'localStorage.setItem(tokenKey');
assertNotIncludes('coolify-backend/server.mjs', 'api/admin/agents');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS users');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS audit_events');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS legacy_imports');
assertIncludes('coolify-backend/db.mjs', 'ADMIN_BOOTSTRAP_UPDATE');

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
assertNotIncludes('v2/v2-api.js', 'ADMIN_TOKEN');
assertIncludes('v2/v2-api.js', 'x-csrf-token');
assertIncludes('v2/app.js', 'workflowChain');
assertIncludes('v2/app.js', 'learningai-v2-imported');
assertIncludes('v2/lessons.js', "id: 'chapter-25'");
assertIncludes('v2/index.html', 'noindex, nofollow');
assertNotIncludes('v2/index.html', '../assessment.html');

const publicHtml = ['index.html', 'my-path.html', 'course.html', 'assessment.html'];
for (const path of publicHtml) {
  assertNotIncludes(path, 'api/admin/leaderboard');
  assertNotIncludes(path, 'api/admin/agents');
  assertNotIncludes(path, 'v2/index.html');
}

run('node', ['--check', 'coolify-backend/server.mjs']);
run('node', ['--check', 'coolify-backend/db.mjs']);
run('node', ['--check', 'coolify-backend/test-server.mjs']);
run('node', ['--check', 'script.js']);
run('node', ['--check', 'backend-client.js']);
run('node', ['--check', 'v2/app.js']);
run('node', ['--check', 'v2/v2-api.js']);
const hasBackendDeps = existsSync(file('coolify-backend/node_modules/bcryptjs')) && existsSync(file('coolify-backend/node_modules/pg'));
const hasDbEnv = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_PASSWORD);
if (hasBackendDeps && hasDbEnv) {
  run('node', ['test-server.mjs'], { cwd: 'coolify-backend' });
  console.log('Backend readiness checks passed');
} else {
  console.log('Static readiness checks passed');
  console.log('Backend integration test skipped: install dependencies and set DATABASE_URL or POSTGRES_PASSWORD to exercise auth, CSRF, and Postgres persistence.');
}
