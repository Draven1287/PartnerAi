import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from './server.mjs';

const tempDir = await mkdtemp(join(tmpdir(), 'learning-ai-minutes-'));
const server = createServer({
  dataFile: join(tempDir, 'minutes.json'),
  dbFile: join(tempDir, 'learning-ai.sqlite'),
  adminToken: 'test-token'
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));

const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return {
    response,
    headers: response.headers,
    body: await response.json().catch(() => ({}))
  };
}

async function submit(body) {
  return request('/api/minutes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body
  });
}

try {
  const adminPage = await fetch(`${baseUrl}/admin`);
  assert.equal(adminPage.status, 200);
  assert.match(await adminPage.text(), /Learning AI Admin/);

  const noConsent = await submit({ name: 'No Consent', minutes: 99, consent: false });
  assert.equal(noConsent.response.status, 400);
  assert.equal(noConsent.body.error, 'consent_required');

  const badName = await submit({ name: 'https://spam.example', minutes: 10, consent: true });
  assert.equal(badName.response.status, 400);
  assert.equal(badName.body.error, 'invalid_name');

  assert.equal((await submit({ name: 'Aarav', minutes: 12, consent: true })).response.status, 201);
  assert.equal((await submit({ name: 'Maya', minutes: 38, consent: true })).response.status, 201);
  assert.equal((await submit({ name: 'Aarav', minutes: 19, consent: true })).response.status, 201);

  const blockedLeaderboard = await request('/api/admin/leaderboard');
  assert.equal(blockedLeaderboard.response.status, 401);

  const leaderboard = await request('/api/admin/leaderboard', {
    headers: { 'x-admin-token': 'test-token' }
  });
  assert.equal(leaderboard.response.status, 200);
  assert.deepEqual(leaderboard.body.leaderboard.map(row => [row.name, row.totalMinutes, row.entries]), [
    ['Maya', 38, 1],
    ['Aarav', 31, 2]
  ]);

  const removedAgentsEndpoint = await request('/api/admin/agents', {
    headers: { 'x-admin-token': 'test-token' }
  });
  assert.equal(removedAgentsEndpoint.response.status, 404);

  const signup = await request('/api/auth/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      email: 'aarav@example.com',
      password: 'learning-ai-pass',
      displayName: 'Aarav'
    }
  });
  assert.equal(signup.response.status, 201);
  assert.equal(signup.body.user.email, 'aarav@example.com');
  const cookie = signup.headers.get('set-cookie').split(';')[0];
  assert.match(cookie, /^lai_session=/);

  const me = await request('/api/auth/me', {
    headers: { cookie }
  });
  assert.equal(me.response.status, 200);
  assert.equal(me.body.user.displayName, 'Aarav');

  const duplicate = await request('/api/auth/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      email: 'aarav@example.com',
      password: 'learning-ai-pass',
      displayName: 'Aarav'
    }
  });
  assert.equal(duplicate.response.status, 409);

  const loginFail = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { email: 'aarav@example.com', password: 'wrong-password' }
  });
  assert.equal(loginFail.response.status, 401);

  assert.equal((await request('/api/v2/state')).response.status, 401);

  assert.equal((await request('/api/v2/assessment', {
    method: 'PUT',
    headers: { 'content-type': 'application/json', cookie },
    body: { assessment: { route: 'Explorer', score: 55 } }
  })).response.status, 200);

  assert.equal((await request('/api/v2/progress', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: { lessonId: 'chapter-1', currentStep: 3, completed: true }
  })).response.status, 200);

  assert.equal((await request('/api/v2/interaction', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: { lessonId: 'chapter-1', stepIndex: 1, stepKind: 'classify', payload: { answer: 'keeps thinking' } }
  })).response.status, 201);

  assert.equal((await request('/api/v2/toolkit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: { cardType: 'Agency rule', lessonId: 'chapter-1', payload: { check: 'one source' } }
  })).response.status, 201);

  assert.equal((await request('/api/v2/minutes', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: { minutes: 7 }
  })).response.status, 201);

  const state = await request('/api/v2/state', {
    headers: { cookie }
  });
  assert.equal(state.response.status, 200);
  assert.equal(state.body.state.assessment.route, 'Explorer');
  assert.equal(state.body.state.progress[0].lessonId, 'chapter-1');
  assert.equal(state.body.state.toolkit[0].cardType, 'Agency rule');
  assert.equal(state.body.state.minutes.totalMinutes, 7);

  const adminLearners = await request('/api/admin/learners', {
    headers: { 'x-admin-token': 'test-token' }
  });
  assert.equal(adminLearners.response.status, 200);
  assert.equal(adminLearners.body.learners[0].email, 'aarav@example.com');
  assert.equal(adminLearners.body.learners[0].completedLessons, 1);

  const lessonAnalytics = await request('/api/admin/lesson-analytics', {
    headers: { 'x-admin-token': 'test-token' }
  });
  assert.equal(lessonAnalytics.response.status, 200);
  assert.equal(lessonAnalytics.body.lessons[0].lessonId, 'chapter-1');

  const logout = await request('/api/auth/logout', {
    method: 'POST',
    headers: { cookie }
  });
  assert.equal(logout.response.status, 200);

  console.log('Local backend behavior checks passed');
} finally {
  await new Promise(resolve => server.close(resolve));
}
