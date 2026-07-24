#!/usr/bin/env node

import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

if (process.env.ALLOW_LIVE_ACCOUNT_TEST !== 'yes') {
  console.error('Refusing to create a live test account. Set ALLOW_LIVE_ACCOUNT_TEST=yes.');
  process.exit(2);
}

const base = String(process.env.LEARNING_AI_API_ORIGIN || 'https://learningai4you.com').replace(/\/$/, '');
const suffix = `${Date.now()}-${randomBytes(3).toString('hex')}`;
const email = `launch-check-${suffix}@example.com`;
const password = `Launch-check-${randomBytes(12).toString('hex')}!`;
let cookie = '';
let csrfToken = '';
const remainingAccounts = new Map();

async function call(path, { method = 'GET', body, csrf = false } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    redirect: 'manual',
    headers: {
      accept: 'application/json',
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(cookie ? { cookie } : {}),
      ...(csrf && csrfToken ? { 'x-csrf-token': csrfToken } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const setCookie = response.headers.getSetCookie?.()[0] || response.headers.get('set-cookie') || '';
  if (setCookie) cookie = setCookie.split(';', 1)[0];
  const data = await response.json().catch(() => ({}));
  if (data.csrfToken) csrfToken = data.csrfToken;
  return { response, data };
}

function expectOk(result, label, status) {
  assert.equal(result.data.ok, true, `${label}: ${JSON.stringify(result.data)}`);
  if (status) assert.equal(result.response.status, status, `${label} status`);
}

try {
  const health = await call('/api/health');
  expectOk(health, 'health', 200);
  assert.equal(health.data.dbStatus, 'ok', 'production database must be connected');
  assert.ok(Number(health.data.migrationVersion) >= 8, 'production database migration 8 is required');

  const signup = await call('/api/auth/signup', {
    method: 'POST',
    body: { email, password, displayName: 'Launch Check' }
  });
  expectOk(signup, 'signup', 201);
  remainingAccounts.set(email, password);

  expectOk(await call('/api/v2/progress', {
    method: 'POST',
    csrf: true,
    body: { lessonId: 'chapter-1', currentStep: 2, completed: false }
  }), 'partial lesson save', 200);

  expectOk(await call('/api/v2/progress', {
    method: 'POST',
    csrf: true,
    body: { lessonId: 'chapter-1', currentStep: 7, completed: true }
  }), 'lesson completion', 200);

  const keys = ['definition', 'capability', 'limits', 'learning', 'impact', 'systems'];
  expectOk(await call('/api/v2/assessment', {
    method: 'PUT',
    csrf: true,
    body: {
      assessment: {
        ageRange: '16-18',
        responses: keys.map(key => ({
          key,
          category: key,
          value: '2',
          label: 'I can explain this with some help.',
          score: 2
        }))
      }
    }
  }), 'questionnaire save', 200);

  const note = await call('/api/v2/toolkit', {
    method: 'POST',
    csrf: true,
    body: {
      cardType: 'manual-note',
      lessonId: 'chapter-1',
      sourceKey: `launch-note-${suffix}`,
      title: 'Temporary launch check',
      fields: { body: 'This temporary note verifies PostgreSQL persistence.' }
    }
  });
  expectOk(note, 'Saved Notes save', 201);

  const minuteEntry = {
    clientSessionId: `launch-focus-${suffix}`,
    lessonId: 'chapter-1',
    minutes: 7
  };
  expectOk(await call('/api/v2/minutes', { method: 'POST', csrf: true, body: minuteEntry }), 'focus minutes', 201);
  const duplicateMinutes = await call('/api/v2/minutes', { method: 'POST', csrf: true, body: minuteEntry });
  expectOk(duplicateMinutes, 'focus minute retry', 200);
  assert.equal(duplicateMinutes.data.duplicate, true, 'focus retry must be idempotent');

  expectOk(await call('/api/auth/logout', { method: 'POST' }), 'logout', 200);
  cookie = '';
  csrfToken = '';

  const secondEmail = `launch-isolation-${suffix}@example.com`;
  const secondPassword = `Launch-isolation-${randomBytes(12).toString('hex')}!`;
  expectOk(await call('/api/auth/signup', {
    method: 'POST',
    body: { email: secondEmail, password: secondPassword, displayName: 'Isolation Check' }
  }), 'second-account signup', 201);
  remainingAccounts.set(secondEmail, secondPassword);
  const isolated = await call('/api/v2/state');
  expectOk(isolated, 'second-account state', 200);
  assert.equal(isolated.data.state?.progress?.length || 0, 0, 'lesson data leaked between accounts');
  assert.equal(isolated.data.state?.toolkit?.length || 0, 0, 'Saved Notes leaked between accounts');
  assert.equal(Number(isolated.data.state?.minutes?.totalMinutes) || 0, 0, 'focus minutes leaked between accounts');
  expectOk(await call('/api/v2/account', {
    method: 'DELETE',
    csrf: true,
    body: { confirmation: 'DELETE' }
  }), 'second-account cleanup', 200);
  remainingAccounts.delete(secondEmail);
  cookie = '';
  csrfToken = '';

  expectOk(await call('/api/auth/login', { method: 'POST', body: { email, password } }), 'login', 200);
  const restored = await call('/api/v2/state');
  expectOk(restored, 'restored state', 200);
  const state = restored.data.state || {};
  assert.ok(state.progress?.some(row => row.lessonId === 'chapter-1' && row.completedAt), 'lesson completion did not restore');
  assert.equal(state.assessment?.ageRange, '16-18', 'questionnaire did not restore');
  assert.ok(state.toolkit?.some(card => card.title === 'Temporary launch check'), 'Saved Note did not restore');
  assert.equal(Number(state.minutes?.totalMinutes), 7, 'focus minutes must restore exactly once');

  expectOk(await call('/api/v2/account', {
    method: 'DELETE',
    csrf: true,
    body: { confirmation: 'DELETE' }
  }), 'account cleanup', 200);
  remainingAccounts.delete(email);

  console.log(`PASS live PostgreSQL persistence (${base}, migration ${health.data.migrationVersion})`);
} finally {
  const cleanupFailures = [];
  for (const [remainingEmail, remainingPassword] of remainingAccounts) {
    cookie = '';
    csrfToken = '';
    const login = await call('/api/auth/login', {
      method: 'POST',
      body: { email: remainingEmail, password: remainingPassword }
    }).catch(() => null);
    if (!login?.data?.ok) {
      cleanupFailures.push(`${remainingEmail}: could not reacquire session`);
      continue;
    }
    const deleted = await call('/api/v2/account', {
      method: 'DELETE',
      csrf: true,
      body: { confirmation: 'DELETE' }
    }).catch(() => null);
    if (!deleted?.data?.ok) cleanupFailures.push(`${remainingEmail}: account deletion was not confirmed`);
  }
  if (cleanupFailures.length) throw new Error(`Live-test cleanup failed: ${cleanupFailures.join('; ')}`);
}
