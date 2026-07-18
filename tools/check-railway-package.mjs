import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const required = [
  '.dockerignore',
  'Dockerfile.frontend',
  'railway.toml',
  'frontend-server.mjs',
  'v3/index.html',
  'v3/v3.css',
  'v3/v3.js',
  'v2/index.html',
  'v2/app.js',
  'v2/lessons.js',
  'v2/v2-api.js',
  'coolify-backend/Dockerfile',
  'coolify-backend/package.json',
  'coolify-backend/package-lock.json',
  'coolify-backend/server.mjs',
  'coolify-backend/db.mjs',
  'coolify-backend/curriculum-seed.json',
  'coolify-backend/railway.toml',
  'lessons/_arcs.mjs',
  ...Array.from({ length: 50 }, (_, index) => `lessons/chapter-${index + 1}.mjs`)
];

function pathFor(path) {
  return new URL(path, root);
}

function read(path) {
  return readFileSync(pathFor(path), 'utf8');
}

for (const path of required) {
  assert.equal(existsSync(pathFor(path)), true, `${path} is missing from the Railway package`);
}

const tracked = new Set(execFileSync('git', ['ls-files', '-z'], {
  cwd: root,
  encoding: 'utf8'
}).split('\0').filter(Boolean));
for (const path of required) {
  assert.equal(tracked.has(path), true, `${path} is not Git-tracked and would be missing from Railway`);
}

const ignoreCheck = spawnSync('git', ['check-ignore', '--no-index', ...required], {
  cwd: root,
  encoding: 'utf8'
});
assert.ok([0, 1].includes(ignoreCheck.status), ignoreCheck.stderr || 'git check-ignore failed');
const ignored = ignoreCheck.stdout.trim();
assert.equal(ignored, '', `Required Railway files must not be ignored:\n${ignored}`);

const dockerignore = read('.dockerignore');
for (const entry of ['.git', 'node_modules', '**/.env', '*.pem', '*.key']) {
  assert.ok(dockerignore.includes(entry), `.dockerignore must exclude ${entry}`);
}

assert.ok(read('Dockerfile.frontend').includes('CMD ["node", "frontend-server.mjs"]'));
assert.ok(read('railway.toml').includes('dockerfilePath = "Dockerfile.frontend"'));
assert.ok(read('railway.toml').includes('healthcheckPath = "/health"'));
assert.ok(read('coolify-backend/railway.toml').includes('dockerfilePath = "Dockerfile"'));
assert.ok(read('coolify-backend/railway.toml').includes('healthcheckPath = "/health"'));

const frontend = read('frontend-server.mjs');
assert.ok(frontend.includes("process.env.API_INTERNAL_URL"), 'Frontend must proxy to the Railway private backend');
assert.ok(frontend.includes("process.env.CANONICAL_HOST"), 'Frontend must support the bare-domain canonical redirect');
assert.ok(frontend.includes("url.pathname === '/api' || url.pathname.startsWith('/api/')"));
assert.ok(frontend.includes("url.pathname === '/'"));
assert.ok(frontend.includes("location: '/v2/'"), 'Initial Railway cutover must preserve V2 at the public root');
assert.ok(frontend.includes('response.writeHead(308'), 'Canonical-host redirect must be permanent and path-preserving');

for (const path of [
  'frontend-server.mjs',
  'v3/v3.js',
  'v2/app.js',
  'v2/lessons.js',
  'v2/v2-api.js',
  'coolify-backend/server.mjs',
  'coolify-backend/db.mjs'
]) {
  execFileSync(process.execPath, ['--check', path], { cwd: root, stdio: 'pipe' });
}

console.log(`Railway release-package checks passed: ${required.length} required files`);
console.log('V2 remains the root route; V3 remains available only at /v3/ until owner approval.');
