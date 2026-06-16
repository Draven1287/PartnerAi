import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const gatedKinds = new Set(['classify', 'promptRepair', 'biasSpot', 'agentDesign', 'workflowChain', 'watch']);
const learnerActionKinds = new Set([...gatedKinds, 'toolkitSave']);
const results = [];

function file(path) {
  return new URL(path, root);
}

function read(path) {
  return readFileSync(file(path), 'utf8');
}

function record(level, name, detail) {
  results.push({ level, name, detail });
  const label = level.toUpperCase();
  console.log(`${label} ${name}${detail ? ` - ${detail}` : ''}`);
}

function pass(name, detail = '') {
  record('pass', name, detail);
}

function warn(name, detail = '') {
  record('warn', name, detail);
}

function fail(name, detail = '') {
  record('fail', name, detail);
}

function assertFile(path) {
  if (existsSync(file(path))) pass(`file:${path}`);
  else fail(`file:${path}`, 'missing');
}

function loadLessons() {
  const sourcePath = 'v2/lessons.js';
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read(sourcePath), context, { filename: sourcePath, timeout: 1000 });
  return Array.isArray(context.window.LESSONS) ? context.window.LESSONS : [];
}

function firstExitIndex(lesson) {
  const index = (lesson.steps || []).findIndex(step => step.kind === 'exitCheck');
  return index >= 0 ? index : Number.POSITIVE_INFINITY;
}

function checkLessonContent(lessons) {
  if (lessons.length === 30) pass('lesson-count', '30 lessons present');
  else fail('lesson-count', `${lessons.length} lessons present; expected 30`);

  const ids = new Set();
  for (const lesson of lessons) {
    if (ids.has(lesson.id)) fail('lesson-ids', `duplicate ${lesson.id}`);
    ids.add(lesson.id);
  }

  const stubs = lessons.filter(lesson => lesson.stub);
  if (stubs.length === 0) pass('lesson-stubs', 'no stub lessons');
  else fail('lesson-stubs', `${stubs.length} stubs: ${stubs.map(lesson => lesson.id).join(', ')}`);

  const authored = lessons.filter(lesson => !lesson.stub);
  for (const lesson of authored) {
    const steps = Array.isArray(lesson.steps) ? lesson.steps : [];
    const exitIndex = firstExitIndex(lesson);
    const preExitActions = steps
      .slice(0, exitIndex)
      .filter(step => learnerActionKinds.has(step.kind));

    if (steps.length >= 5) pass(`${lesson.id}:step-count`, `${steps.length} steps`);
    else fail(`${lesson.id}:step-count`, `${steps.length} steps; expected at least 5`);

    if (Number.isFinite(exitIndex)) pass(`${lesson.id}:exit-check`);
    else fail(`${lesson.id}:exit-check`, 'missing exitCheck');

    if (preExitActions.length >= 2) pass(`${lesson.id}:pre-exit-actions`, `${preExitActions.length} learner actions`);
    else fail(`${lesson.id}:pre-exit-actions`, `${preExitActions.length} learner actions; expected at least 2 before exitCheck`);

    if (steps.some(step => step.kind === 'toolkitSave')) pass(`${lesson.id}:toolkit`, 'optional save/note prompt');
    else warn(`${lesson.id}:toolkit`, 'no optional toolkitSave step');
  }
}

function checkBackendSurface() {
  const server = read('coolify-backend/server.mjs');
  const db = read('coolify-backend/db.mjs');
  const v2Api = read('v2/v2-api.js');
  const index = read('v2/index.html');
  const config = read('backend-config.js');

  const requiredServerSnippets = [
    "url.pathname === '/api/auth/signup'",
    "url.pathname === '/api/auth/login'",
    "url.pathname === '/api/v2/curriculum'",
    "url.pathname === '/api/v2/progress'",
    "url.pathname === '/api/v2/quiz-answer'",
    "url.pathname === '/api/v2/activity-complete'",
    "url.pathname === '/api/v2/dashboard'",
    "url.pathname === '/api/v2/feedback-request'",
    "url.pathname === '/api/v2/project-review'",
    "url.pathname === '/api/v2/tutor-sessions'",
    "url.pathname === '/api/v2/insights'",
    "url.pathname === '/api/admin/curriculum'",
    "url.pathname === '/api/admin/ai-requests'",
    "url.pathname === '/api/admin/export.csv'",
    "url.pathname === '/api/admin/assessment-export.csv'",
    'csrf_required'
  ];

  for (const snippet of requiredServerSnippets) {
    if (server.includes(snippet)) pass(`backend-route:${snippet}`);
    else fail(`backend-route:${snippet}`, 'missing');
  }

  const requiredTables = [
    'CREATE TABLE IF NOT EXISTS users',
    'CREATE TABLE IF NOT EXISTS sessions',
    'CREATE TABLE IF NOT EXISTS curriculum_tracks',
    'CREATE TABLE IF NOT EXISTS curriculum_levels',
    'CREATE TABLE IF NOT EXISTS curriculum_modules',
    'CREATE TABLE IF NOT EXISTS lessons',
    'CREATE TABLE IF NOT EXISTS lesson_steps',
    'CREATE TABLE IF NOT EXISTS lesson_progress',
    'CREATE TABLE IF NOT EXISTS quiz_submissions',
    'CREATE TABLE IF NOT EXISTS activity_completions',
    'CREATE TABLE IF NOT EXISTS ai_feedback_requests',
    'CREATE TABLE IF NOT EXISTS project_reviews',
    'CREATE TABLE IF NOT EXISTS tutor_sessions',
    'CREATE TABLE IF NOT EXISTS tutor_messages',
    'CREATE TABLE IF NOT EXISTS progress_insights',
    'CREATE TABLE IF NOT EXISTS audit_events'
  ];

  for (const snippet of requiredTables) {
    if (db.includes(snippet)) pass(`db-table:${snippet.replace('CREATE TABLE IF NOT EXISTS ', '')}`);
    else fail(`db-table:${snippet}`, 'missing');
  }

  if (v2Api.includes('x-csrf-token')) pass('frontend-csrf-bridge');
  else fail('frontend-csrf-bridge', 'v2/v2-api.js must send x-csrf-token on writes');

  if (index.includes('index, follow') && !index.includes('noindex, nofollow')) pass('v2-public-indexing');
  else fail('v2-public-indexing', 'V2 should be indexable now that it replaces V1 online');

  if (config.includes('https://api.learningai4you.com')) pass('production-api-config');
  else fail('production-api-config', 'backend-config.js must point production to api.learningai4you.com');
}

function main() {
  console.log('Learning AI V2 launch readiness audit');
  assertFile('coolify-backend/server.mjs');
  assertFile('coolify-backend/db.mjs');
  assertFile('coolify-backend/docker-compose.yml');
  assertFile('v2/lessons.js');
  assertFile('v2/v2-api.js');
  assertFile('backend-config.js');

  checkBackendSurface();
  checkLessonContent(loadLessons());

  const failures = results.filter(result => result.level === 'fail').length;
  const warnings = results.filter(result => result.level === 'warn').length;
  console.log(`Summary: ${failures} failure(s), ${warnings} warning(s).`);
  if (failures) {
    console.log('Live API reachability is not checked here. Run: node tools/verify-live-backend.mjs');
    process.exit(1);
  }
}

main();
