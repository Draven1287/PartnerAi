import assert from 'node:assert/strict';
import { createServer } from './server.mjs';

if (!process.env.DATABASE_URL) {
  console.log('Skipping integration tests: DATABASE_URL is not set. Run with Coolify/Postgres env for full backend tests.');
  process.exit(0);
}

process.env.SESSION_SECRET ||= 'local-test-session-secret-that-is-long-enough';
process.env.ADMIN_EMAIL ||= 'admin@example.com';
process.env.ADMIN_PASSWORD ||= 'learning-ai-admin-pass';
process.env.CORS_ORIGINS ||= 'http://127.0.0.1:8123';

const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return { response, headers: response.headers, body: await response.json().catch(() => ({})) };
}

function cookieHeader(setCookie) {
  return String(setCookie || '').split(';')[0];
}

try {
  const health = await request('/health');
  assert.equal(health.response.status, 200);
  assert.equal(health.body.dbStatus, 'ok');

  const signup = await request('/api/auth/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { email: `test-${Date.now()}@example.com`, password: 'learning-ai-pass', displayName: 'Aarav' }
  });
  assert.equal(signup.response.status, 201);
  const learnerCookie = cookieHeader(signup.headers.get('set-cookie'));
  assert.ok(signup.body.csrfToken);

  const blocked = await request('/api/v2/progress', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: learnerCookie },
    body: { lessonId: 'chapter-1', currentStep: 1 }
  });
  assert.equal(blocked.response.status, 403);

  const progress = await request('/api/v2/progress', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': signup.body.csrfToken },
    body: { lessonId: 'chapter-1', currentStep: 1, completed: true }
  });
  assert.equal(progress.response.status, 200);

  const state = await request('/api/v2/state', { headers: { cookie: learnerCookie } });
  assert.equal(state.response.status, 200);
  assert.equal(state.body.state.progress[0].lessonId, 'chapter-1');

  const adminLogin = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
  });
  assert.equal(adminLogin.response.status, 200);
  const adminCookie = cookieHeader(adminLogin.headers.get('set-cookie'));

  const learners = await request('/api/admin/learners', { headers: { cookie: adminCookie } });
  assert.equal(learners.response.status, 200);
  assert.ok(Array.isArray(learners.body.learners));

  console.log('Postgres backend integration checks passed');
} finally {
  await new Promise(resolve => server.close(resolve));
}
