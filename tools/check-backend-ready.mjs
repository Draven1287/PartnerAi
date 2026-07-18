import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

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

function assertMatches(path, pattern, message) {
  assert.ok(pattern.test(read(path)), message || `${path} must match ${pattern}`);
}

assertExists('coolify-backend/server.mjs');
assertExists('coolify-backend/db.mjs');
assertExists('coolify-backend/fake-db.mjs');
assertExists('coolify-backend/curriculum-seed.json');
assertExists('coolify-backend/Dockerfile');
assertExists('coolify-backend/package-lock.json');
assertExists('coolify-backend/docker-compose.yml');
assertExists('coolify-backend/test-server.mjs');
assertExists('tools/verify-live-backend.mjs');
assertExists('tools/dev-v2-backend.mjs');
assertExists('tools/check-v2-launch-ready.mjs');
assertExists('tools/sync-curriculum-seed.mjs');
assertExists('backend-config.js');
assertExists('backend-client.js');
assertExists('backend-console.html');
assertExists('v2/v2-api.js');
assertExists('v2/mona-lisa-progress.png');

assertIncludes('coolify-backend/docker-compose.yml', 'learning-ai-postgres:');
assertIncludes('coolify-backend/docker-compose.yml', 'POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'SESSION_SECRET: ${SESSION_SECRET:?SESSION_SECRET is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'ADMIN_EMAIL: ${ADMIN_EMAIL:?ADMIN_EMAIL is required}');
assertIncludes('coolify-backend/docker-compose.yml', 'https://api.learningai4you.com');
assertIncludes('coolify-backend/docker-compose.yml', 'ADMIN_CORS_ORIGINS');
assertIncludes('coolify-backend/docker-compose.yml', '/health');
assertIncludes('coolify-backend/docker-compose.yml', 'expose:');
assertIncludes('coolify-backend/Dockerfile', 'COPY package.json package-lock.json ./');
assertIncludes('coolify-backend/Dockerfile', 'RUN npm ci --omit=dev');
assertIncludes('coolify-backend/Dockerfile', 'COPY server.mjs db.mjs curriculum-seed.json ./');
assertIncludes('coolify-backend/package.json', '"pg"');
assertIncludes('coolify-backend/package.json', '"bcryptjs"');
assertIncludes('coolify-backend/package-lock.json', '"lockfileVersion": 3');
assertIncludes('coolify-backend/package-lock.json', '"node_modules/pg"');
assertIncludes('coolify-backend/package-lock.json', '"node_modules/bcryptjs"');

assertIncludes('coolify-backend/server.mjs', "url.pathname === '/health'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/health'");
assertIncludes('coolify-backend/server.mjs', "await import('./db.mjs')");
assertIncludes('coolify-backend/server.mjs', 'async function hashPassword');
assertNotIncludes('coolify-backend/server.mjs', "import bcrypt from 'bcryptjs'");
assertNotIncludes('coolify-backend/server.mjs', "import { createDb } from './db.mjs'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/login'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/overview'");
assertIncludes('coolify-backend/server.mjs', 'ADMIN_ALLOWED_ORIGINS');
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/auth/password-reset/request'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/auth/password-reset/confirm'");
assertIncludes('coolify-backend/server.mjs', "'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS'");
assertIncludes('coolify-backend/server.mjs', 'createPasswordResetToken');
assertIncludes('coolify-backend/server.mjs', 'confirmPasswordReset');
assertNotIncludes('coolify-backend/server.mjs', 'admin_assisted_reset_only');
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/ai-requests'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/curriculum'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/lesson-analytics'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/admin/curriculum/publish'");
assertIncludes('coolify-backend/server.mjs', "url.pathname.startsWith('/api/admin/curriculum/lessons/')");
assertIncludes('coolify-backend/server.mjs', 'data-view="content"');
assertIncludes('coolify-backend/server.mjs', 'async function renderContentEditor()');
assertIncludes('coolify-backend/server.mjs', 'async function renderLearnerDetail');
assertIncludes('coolify-backend/server.mjs', "action:'resetPassword'");
assertIncludes('coolify-backend/server.mjs', "action:'delete'");
assertIncludes('coolify-backend/server.mjs', "api('/api/admin/curriculum/lessons/' + encodeURIComponent(lesson.id)");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/import-local'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/account'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/dashboard'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/curriculum'");
assertIncludes('coolify-backend/server.mjs', "url.pathname.startsWith('/api/v2/lessons/')");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/quiz-answer'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/activity-complete'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/feedback-request'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/project-review'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/tutor-sessions'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/insights'");
assertIncludes('coolify-backend/server.mjs', "url.pathname === '/api/v2/visit'");
assertIncludes('coolify-backend/server.mjs', "url.pathname.startsWith('/api/v2/toolkit/')");
assertIncludes('coolify-backend/server.mjs', 'csrf_required');
assertIncludes('coolify-backend/server.mjs', 'validateLessonPatch');
assertIncludes('coolify-backend/server.mjs', 'validateSteps');
assertIncludes('coolify-backend/server.mjs', 'validateQuizAnswer');
assertIncludes('coolify-backend/server.mjs', 'validateActivityCompletion');
assertIncludes('coolify-backend/server.mjs', 'validateFeedbackRequest');
assertIncludes('coolify-backend/server.mjs', 'validateProjectReview');
assertIncludes('coolify-backend/server.mjs', 'validateTutorSession');
assertIncludes('coolify-backend/server.mjs', 'Difficult steps');
assertIncludes('coolify-backend/server.mjs', 'handleV1Minutes');
assertNotIncludes('coolify-backend/server.mjs', 'ADMIN_TOKEN is required in production');
assertNotIncludes('coolify-backend/server.mjs', 'ALLOW_ADMIN_TOKEN');
assertNotIncludes('coolify-backend/server.mjs', 'x-admin-token');
assertIncludes('coolify-backend/server.mjs', "error: 'db_not_ready'");
assertNotIncludes('coolify-backend/server.mjs', "fallback: 'legacy_json'");
assertNotIncludes('coolify-backend/.env.example', 'ADMIN_TOKEN');
assertNotIncludes('coolify-backend/docker-compose.yml', 'ADMIN_TOKEN');
assertIncludes('coolify-backend/.env.example', 'IMPORT_LEGACY_JSON_STORE=false');
assertIncludes('coolify-backend/README.md', 'IMPORT_LEGACY_JSON_STORE=false');
assertNotIncludes('coolify-backend/server.mjs', 'localStorage.setItem(tokenKey');
assertNotIncludes('coolify-backend/server.mjs', 'api/admin/agents');
assertIncludes('coolify-backend/server.mjs', "req.method === 'POST' && url.pathname === '/api/admin/export.csv'");
assertIncludes('coolify-backend/server.mjs', "req.method === 'POST' && url.pathname === '/api/admin/assessment-export.csv'");
assertIncludes('coolify-backend/server.mjs', 'learnerCsv(rows)');
assertIncludes('coolify-backend/server.mjs', 'assessmentResponsesCsv(rows)');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS users');
assertIncludes('coolify-backend/db.mjs', 'const MIGRATION_VERSION = 6');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS curriculum_tracks');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS curriculum_levels');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS curriculum_modules');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS quiz_submissions');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS activity_completions');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS ai_feedback_requests');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS project_reviews');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS tutor_sessions');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS progress_insights');
assertIncludes('coolify-backend/db.mjs', 'CURRICULUM_SEED_FILE');
assertIncludes('coolify-backend/db.mjs', 'levelForLessonNum');
assertIncludes('coolify-backend/db.mjs', 'core-ai-literacy');
assertIncludes('coolify-backend/server.mjs', 'LESSON_LEVELS');
assertIncludes('coolify-backend/server.mjs', 'edit-level');
assertIncludes('coolify-backend/db.mjs', 'payload_json jsonb');
assertIncludes('coolify-backend/db.mjs', 'async function curriculum({ includeDrafts = true } = {})');
assertIncludes('coolify-backend/db.mjs', 'visibleLessons = includeDrafts ? lessonRows : lessonRows.filter');
assertIncludes('coolify-backend/server.mjs', 'database.curriculum({ includeDrafts: false })');
assertIncludes('coolify-backend/server.mjs', 'database.curriculumLesson(lessonId, { includeDrafts: false })');
assertIncludes('coolify-backend/db.mjs', 'async function curriculumLesson');
assertIncludes('coolify-backend/db.mjs', 'async function saveQuizAnswer');
assertIncludes('coolify-backend/db.mjs', 'async function completeActivity');
assertIncludes('coolify-backend/db.mjs', 'async function dashboardForUser');
assertIncludes('coolify-backend/db.mjs', 'difficultSteps');
assertIncludes('coolify-backend/db.mjs', 'incorrectRate');
assertIncludes('coolify-backend/db.mjs', 'async function createFeedbackRequest');
assertIncludes('coolify-backend/db.mjs', 'async function createProjectReview');
assertIncludes('coolify-backend/db.mjs', 'async function createTutorSession');
assertIncludes('coolify-backend/db.mjs', 'async function progressInsights');
assertIncludes('coolify-backend/db.mjs', 'async function archiveToolkit');
assertIncludes('coolify-backend/db.mjs', 'async function deleteUserAccount');
assertIncludes('coolify-backend/db.mjs', 'DELETE FROM learning_minutes WHERE user_id = $1');
assertIncludes('coolify-backend/db.mjs', 'DELETE FROM audit_events WHERE target_user_id = $1');
assertIncludes('coolify-backend/db.mjs', 'async function adminAiRequests');
assertIncludes('coolify-backend/db.mjs', 'async function adminVisitAnalytics');
assertIncludes('coolify-backend/db.mjs', 'page_visits_visited_at_idx');
assertIncludes('coolify-backend/db.mjs', 'async function exportAssessmentResponses');
assertIncludes('coolify-backend/db.mjs', 'async function adminUpdateLesson');
assertIncludes('coolify-backend/db.mjs', 'async function adminReplaceLessonSteps');
assertIncludes('coolify-backend/db.mjs', 'async function adminPublishCurriculum');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS audit_events');
assertIncludes('coolify-backend/db.mjs', 'CREATE TABLE IF NOT EXISTS legacy_imports');
assertIncludes('coolify-backend/db.mjs', "process.env.NODE_ENV === 'production' ? 'false' : 'true'");
assertIncludes('coolify-backend/db.mjs', 'async function createPasswordResetToken');
assertIncludes('coolify-backend/db.mjs', 'async function confirmPasswordReset');
assertIncludes('coolify-backend/db.mjs', 'ADMIN_BOOTSTRAP_UPDATE');
assertIncludes('coolify-backend/db.mjs', 'ON CONFLICT (lesson_id, step_index) DO UPDATE SET');
assertIncludes('coolify-backend/db.mjs', 'DELETE FROM lesson_steps WHERE lesson_id = $1 AND step_index >= $2');

const backendConfig = read('backend-config.js');
assertIncludes('backend-config.js', 'window.LEARNING_AI_BACKEND_URL = window.location.origin');
assertNotIncludes('backend-config.js', "window.LEARNING_AI_BACKEND_URL = 'https://api.learningai4you.com'");
assertIncludes('backend-config.js', 'http://127.0.0.1:8787');
assertNotIncludes('backend-config.js', 'ADMIN_TOKEN');
assertNotIncludes('backend-config.js', 'API_KEY');
assertIncludes('backend-client.js', 'adminLogin');
assertIncludes('backend-client.js', 'adminOverview');
assertNotIncludes('backend-client.js', 'ADMIN_TOKEN');
assertNotIncludes('backend-client.js', 'API_KEY');
assertIncludes('backend-console.html', '/api/admin/login');
assertIncludes('backend-console.html', '/api/admin/overview');
assertNotIncludes('backend-console.html', 'ADMIN_TOKEN');
assertNotIncludes('v2/v2-api.js', 'ADMIN_TOKEN');
assertIncludes('v2/v2-api.js', 'x-csrf-token');
assertIncludes('v2/v2-api.js', "dashboard()");
assertIncludes('v2/v2-api.js', "curriculum()");
assertIncludes('v2/v2-api.js', "lesson(lessonId)");
assertIncludes('v2/v2-api.js', "submitQuizAnswer(answer)");
assertIncludes('v2/v2-api.js', "completeActivity(activity)");
assertIncludes('v2/v2-api.js', "requestFeedback(feedbackRequest)");
assertIncludes('v2/v2-api.js', "requestProjectReview(review)");
assertIncludes('v2/v2-api.js', "createTutorSession(session)");
assertIncludes('v2/v2-api.js', "insights()");
assertIncludes('v2/v2-api.js', "deleteToolkit(id)");
assertIncludes('v2/app.js', 'applyCurriculum');
assertIncludes('v2/app.js', 'loadCurriculumFromBackend');
assertIncludes('v2/app.js', 'normalizeCurriculumLesson');
assertIncludes('v2/app.js', 'api.submitQuizAnswer');
assertIncludes('v2/app.js', 'api.completeActivity');
assertIncludes('v2/app.js', "step.kind === 'exitCheck'");
assertIncludes('v2/app.js', 'workflowChain');
assertIncludes('v2/app.js', 'learningai-v2-imported');
assertMatches('v2/lessons.js', /["']id["']\s*:\s*["']chapter-25["']/, 'v2/lessons.js must include chapter-25');
assertIncludes('v2/index.html', 'index, follow');
assertNotIncludes('v2/index.html', 'noindex, nofollow');
assertNotIncludes('v2/index.html', '../assessment.html');

const publicHtml = ['index.html', 'my-path.html', 'course.html', 'assessment.html'];
for (const path of publicHtml) {
  assertNotIncludes(path, 'api/admin/leaderboard');
  assertNotIncludes(path, 'api/admin/agents');
}
assertIncludes('index.html', 'v2/index.html');
assertIncludes('course.html', 'v2/index.html');

run(process.execPath, ['--check', 'coolify-backend/server.mjs']);
run(process.execPath, ['--check', 'coolify-backend/db.mjs']);
run(process.execPath, ['--check', 'coolify-backend/fake-db.mjs']);
run(process.execPath, ['--check', 'coolify-backend/test-server.mjs']);
run(process.execPath, ['--check', 'tools/verify-live-backend.mjs']);
run(process.execPath, ['--check', 'tools/dev-v2-backend.mjs']);
run(process.execPath, ['--check', 'tools/check-v2-launch-ready.mjs']);
run(process.execPath, ['--check', 'tools/sync-curriculum-seed.mjs']);
run(process.execPath, ['--check', 'script.js']);
run(process.execPath, ['--check', 'backend-client.js']);
run(process.execPath, ['--check', 'v2/app.js']);
run(process.execPath, ['--check', 'v2/v2-api.js']);
assertIncludes('coolify-backend/test-server.mjs', 'function createFakeDb()');
assertIncludes('coolify-backend/test-server.mjs', "await runRouteChecks(createFakeDb(), 'Fake DB')");
assertIncludes('coolify-backend/test-server.mjs', 'await runDbFailureChecks()');
assertIncludes('coolify-backend/test-server.mjs', 'db_not_ready');
assertIncludes('coolify-backend/test-server.mjs', '/api/health');
assertIncludes('coolify-backend/test-server.mjs', '/api/auth/password-reset/request');
assertIncludes('coolify-backend/test-server.mjs', '/api/auth/password-reset/confirm');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/quiz-answer');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/activity-complete');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/dashboard');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/toolkit');
assertIncludes('coolify-backend/test-server.mjs', 'archiveToolkit');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/feedback-request');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/project-review');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/tutor-sessions');
assertIncludes('coolify-backend/test-server.mjs', '/api/v2/insights');
assertIncludes('coolify-backend/test-server.mjs', '/api/admin/ai-requests');
assertIncludes('coolify-backend/test-server.mjs', '/api/admin/export.csv');
assertIncludes('coolify-backend/test-server.mjs', '/api/admin/assessment-export.csv');
assertIncludes('coolify-backend/test-server.mjs', 'quizSubmissions');
assertIncludes('coolify-backend/test-server.mjs', 'completedActivities');
assertIncludes('coolify-backend/test-server.mjs', 'difficultSteps');
assertIncludes('coolify-backend/test-server.mjs', "action: 'disable'");
assertIncludes('coolify-backend/test-server.mjs', "action: 'enable'");
assertIncludes('coolify-backend/test-server.mjs', "action: 'rename'");
assertIncludes('coolify-backend/test-server.mjs', "action: 'resetPassword'");
assertIncludes('coolify-backend/test-server.mjs', 'LEARNING_AI_TEST_DATABASE_URL');
assertIncludes('coolify-backend/test-server.mjs', 'ALLOW_POSTGRES_TEST_WRITES');

const runRouteTests = String(process.env.RUN_BACKEND_ROUTE_TESTS || '').toLowerCase() === 'true';
if (runRouteTests) {
  run(process.execPath, ['coolify-backend/test-server.mjs']);
}

console.log('Static readiness checks passed');
if (!runRouteTests) {
  console.log('Backend route test skipped here. Run node coolify-backend/test-server.mjs for fake DB checks, or use LEARNING_AI_TEST_DATABASE_URL with a dedicated test database for Postgres checks.');
}
