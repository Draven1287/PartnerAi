import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer } from './server.mjs';

const tempDir = await mkdtemp(join(tmpdir(), 'learning-ai-minutes-'));
const server = createServer({
  dataFile: join(tempDir, 'minutes.json'),
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

  console.log('Local backend behavior checks passed');
} finally {
  await new Promise(resolve => server.close(resolve));
}
