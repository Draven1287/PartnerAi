import assert from 'node:assert/strict';
import { createServer, hashPassword } from './server.mjs';

process.env.SESSION_SECRET ||= 'local-test-session-secret-that-is-long-enough';
process.env.ADMIN_EMAIL ||= 'admin@example.com';
process.env.ADMIN_PASSWORD ||= 'learning-ai-admin-pass';
process.env.CORS_ORIGINS ||= 'http://127.0.0.1:8123,http://127.0.0.1:8787';
process.env.ALLOW_DEV_RESET_TOKEN_RETURN ||= 'true';

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    disabled: Boolean(row.disabled)
  };
}

function createFakeDb() {
  const users = new Map();
  const usersByEmail = new Map();
  const sessions = new Map();
  const resetTokens = new Map();
  const progress = [];
  const quizSubmissions = [];
  const activityCompletions = [];
  const audits = [];
  const lessons = [{
    id: 'chapter-1',
    num: 1,
    arc: 'Orientation',
    title: 'Why AI matters',
    moduleId: 'orientation',
    levelId: 'foundation',
    coreQuestion: 'Why should I care about AI?',
    blurb: 'A starter lesson.',
    status: 'published',
    stub: false,
    sortOrder: 1,
    minutes: 8,
    resources: [],
    steps: [{ stepId: 'chapter-1-step-1', stepIndex: 0, kind: 'reveal', gated: false, title: 'Start', payload: { title: 'Start', body: 'Begin.' } }]
  }];
  const admin = {
    id: 'admin-1',
    email: process.env.ADMIN_EMAIL,
    password_hash: '',
    disabled: false
  };

  return {
    async init() {
      admin.password_hash = await hashPassword(process.env.ADMIN_PASSWORD);
    },
    async health() {
      return { dbStatus: 'ok', migrationVersion: 5 };
    },
    async createUser({ email, passwordHash, displayName }) {
      const row = { id: `user-${users.size + 1}`, email, password_hash: passwordHash, display_name: displayName, disabled: false };
      users.set(row.id, row);
      usersByEmail.set(email, row);
      return publicUser(row);
    },
    async findUserByEmail(email) {
      return usersByEmail.get(email) || null;
    },
    async findUserById(id) {
      const row = users.get(id);
      return row ? publicUser(row) : null;
    },
    async findAdminByEmail(email) {
      return email === admin.email ? admin : null;
    },
    async findAdminById(id) {
      return id === admin.id ? { id: admin.id, email: admin.email, role: 'admin', disabled: false } : null;
    },
    async createSession({ kind, userId = null, adminUserId = null, tokenHash, csrfTokenHash, expiresAt }) {
      sessions.set(tokenHash, {
        kind,
        user_id: userId,
        admin_user_id: adminUserId,
        token_hash: tokenHash,
        csrf_token_hash: csrfTokenHash,
        expires_at: expiresAt
      });
    },
    async createPasswordResetToken({ email, tokenHash, expiresAt }) {
      const user = usersByEmail.get(email);
      if (!user || user.disabled) return null;
      for (const token of resetTokens.values()) {
        if (token.userId === user.id && !token.usedAt) token.usedAt = new Date().toISOString();
      }
      resetTokens.set(tokenHash, { userId: user.id, expiresAt, usedAt: '' });
      return { userId: user.id };
    },
    async confirmPasswordReset({ tokenHash, passwordHash }) {
      const token = resetTokens.get(tokenHash);
      if (!token || token.usedAt || new Date(token.expiresAt).getTime() <= Date.now()) return false;
      const user = users.get(token.userId);
      if (!user || user.disabled || user.deleted_at) return false;
      user.password_hash = passwordHash;
      token.usedAt = new Date().toISOString();
      [...sessions.values()].filter(session => session.user_id === user.id).forEach(session => sessions.delete(session.token_hash));
      return true;
    },
    async deleteSession(tokenHash) {
      sessions.delete(tokenHash);
    },
    async rotateCsrf(tokenHash, csrfTokenHash) {
      const session = sessions.get(tokenHash);
      if (session) session.csrf_token_hash = csrfTokenHash;
    },
    async sessionForToken(kind, tokenHash) {
      const session = sessions.get(tokenHash);
      if (!session || session.kind !== kind) return null;
      if (kind === 'learner') return { session, user: publicUser(users.get(session.user_id)) };
      return { session, admin: { id: admin.id, email: admin.email, role: 'admin', disabled: false } };
    },
    async saveProgress(userId, { lessonId, currentStep = 0, completed = false }) {
      const existing = progress.find(row => row.userId === userId && row.lessonId === lessonId);
      if (existing) {
        existing.currentStep = Math.max(existing.currentStep, Number(currentStep) || 0);
        existing.completedAt ||= completed ? new Date().toISOString() : '';
        return;
      }
      progress.push({ userId, lessonId, currentStep: Number(currentStep) || 0, completedAt: completed ? new Date().toISOString() : '' });
    },
    async stateForUser(userId) {
      return {
        user: publicUser(users.get(userId)),
        assessment: null,
        learnerState: null,
        progress: progress.filter(row => row.userId === userId).map(row => ({ lessonId: row.lessonId, currentStep: row.currentStep, completedAt: row.completedAt, updatedAt: new Date().toISOString() })),
        toolkit: [],
        minutes: { totalMinutes: 0, entries: 0 }
      };
    },
    async curriculum() {
      return {
        version: 'test',
        tracks: [{ id: 'core-ai-literacy', title: 'Core AI Literacy', description: '', sortOrder: 1, status: 'published', modules: ['orientation'] }],
        levels: [{ id: 'foundation', title: 'Foundation', description: '', sortOrder: 1, status: 'published', lessons: ['chapter-1'] }],
        modules: [{ id: 'orientation', title: 'Orientation', trackId: 'core-ai-literacy', sortOrder: 1, status: 'published', lessons }],
        lessons
      };
    },
    async curriculumLesson(lessonId) {
      return lessons.find(lesson => lesson.id === lessonId) || null;
    },
    async adminCreateLesson({ lesson }) {
      const num = Number.isInteger(Number(lesson.num)) ? Number(lesson.num) : Math.max(...lessons.map(row => Number(row.num) || 0), 0) + 1;
      const lessonId = lesson.id || `chapter-${num}`;
      if (lessons.some(row => row.id === lessonId || Number(row.num) === num)) return null;
      const created = {
        id: lessonId,
        num,
        arc: lesson.arc || 'Draft',
        title: lesson.title || 'Untitled lesson',
        moduleId: 'draft',
        levelId: lesson.levelId || 'foundation',
        coreQuestion: lesson.coreQuestion || '',
        blurb: lesson.blurb || '',
        status: lesson.status || 'draft',
        stub: true,
        sortOrder: num,
        minutes: lesson.minutes || 8,
        resources: [],
        steps: []
      };
      lessons.push(created);
      return created;
    },
    async adminUpdateLesson({ lessonId, patch }) {
      const lesson = lessons.find(row => row.id === lessonId);
      if (!lesson) return null;
      Object.assign(lesson, patch);
      if (patch.levelId) lesson.levelId = patch.levelId;
      return lesson;
    },
    async adminReplaceLessonSteps({ lessonId, steps }) {
      const lesson = lessons.find(row => row.id === lessonId);
      if (!lesson) return null;
      lesson.steps = steps.map((step, index) => ({ ...step, stepIndex: index }));
      return lesson;
    },
    async adminPublishCurriculum({ lessonId = null }) {
      lessons.filter(lesson => !lessonId || lesson.id === lessonId).forEach(lesson => { lesson.status = 'published'; lesson.stub = false; });
      return { version: 'test', lessonCount: lessonId ? 1 : lessons.length };
    },
    async adminLearners() {
      return [...users.values()].map(row => ({ id: row.id, email: row.email, displayName: row.display_name, totalMinutes: 0, visitCount: 0, completionPercent: 0, currentLesson: '', lastActiveAt: '' }));
    },
    async lessonAnalytics() {
      return lessons.map(lesson => {
        const lessonQuizzes = quizSubmissions.filter(row => row.lessonId === lesson.id);
        const incorrect = lessonQuizzes.filter(row => row.correct === false);
        return {
          lessonId: lesson.id,
          num: lesson.num,
          arc: lesson.arc,
          title: lesson.title,
          learnersStarted: progress.filter(row => row.lessonId === lesson.id).length,
          learnersCompleted: progress.filter(row => row.lessonId === lesson.id && row.completedAt).length,
          interactions: lessonQuizzes.length,
          incorrectAnswers: incorrect.length,
          difficultSteps: incorrect.length ? [{ stepIndex: incorrect[0].stepIndex, kind: 'quiz', attempts: lessonQuizzes.length, incorrect: incorrect.length, incorrectRate: Math.round((incorrect.length / lessonQuizzes.length) * 100) }] : [],
          lastActivityAt: ''
        };
      });
    },
    async audit(event) {
      audits.push(event);
    },
    async leaderboard() {
      return [];
    },
    async exportLearners() {
      return this.adminLearners();
    },
    async saveAssessment() {},
    async saveInteraction() {},
    async saveQuizAnswer(userId, { lessonId, stepIndex = 0, quizKey = '', answer = {}, correct = null, feedback = '' }) {
      quizSubmissions.push({ userId, lessonId, stepIndex, quizKey, answer, correct, feedback });
    },
    async completeActivity(userId, { lessonId, stepIndex = 0, activityKind = 'activity', activityKey = '', payload = {} }) {
      const existing = activityCompletions.find(row => row.userId === userId && row.lessonId === lessonId && row.stepIndex === stepIndex && row.activityKind === activityKind);
      if (existing) {
        existing.activityKey = activityKey;
        existing.payload = payload;
        return;
      }
      activityCompletions.push({ userId, lessonId, stepIndex, activityKind, activityKey, payload });
    },
    async saveToolkit() {},
    async addMinutes() {},
    async recordVisit() {},
    async importLocal() {},
    async dashboardForUser(userId) {
      const userProgress = progress.filter(row => row.userId === userId);
      const completedLessons = userProgress.filter(row => row.completedAt).length;
      return {
        user: publicUser(users.get(userId)),
        currentLesson: userProgress[0]?.lessonId || 'chapter-1',
        currentStep: userProgress[0]?.currentStep || 0,
        nextLesson: lessons.find(lesson => !userProgress.some(row => row.lessonId === lesson.id && row.completedAt)) || null,
        completedLessons,
        totalLessons: lessons.length,
        completionPercent: lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0,
        minutes: { totalMinutes: 0, entries: 0 },
        toolkitCount: 0,
        quizSubmissions: quizSubmissions.filter(row => row.userId === userId).length,
        incorrectQuizSubmissions: quizSubmissions.filter(row => row.userId === userId && row.correct === false).length,
        completedActivities: activityCompletions.filter(row => row.userId === userId).length,
        modules: [{ id: 'orientation', title: 'Orientation', completedLessons, totalLessons: lessons.length }]
      };
    },
    async createFeedbackRequest() { return { id: 'feedback-1', status: 'queued' }; },
    async createProjectReview() { return { id: 'project-1', status: 'queued' }; },
    async createTutorSession() { return { id: 'session-1', status: 'open' }; },
    async addTutorMessage() { return { id: 'message-1' }; },
    async progressInsights() { return []; },
    async adminAiRequests() { return { feedbackRequests: [], projectReviews: [], tutorSessions: [] }; },
    async accountAction({ userId, action, displayName, newPassword }) {
      const row = users.get(userId);
      if (!row) return;
      if (action === 'disable') row.disabled = true;
      if (action === 'enable') row.disabled = false;
      if (action === 'rename') row.display_name = displayName;
      if (action === 'resetPassword') {
        row.password_hash = await hashPassword(newPassword);
        [...sessions.values()].filter(session => session.user_id === userId).forEach(session => sessions.delete(session.token_hash));
      }
      if (action === 'delete') {
        usersByEmail.delete(row.email);
        row.disabled = true;
        row.deleted_at = new Date().toISOString();
        row.email = `${row.id}-deleted@deleted.local`;
      }
      audits.push({ eventName: `account_${action}`, targetUserId: userId });
    },
    async adminLearner(id) {
      const user = users.get(id);
      if (!user) return null;
      return {
        user: publicUser(user),
        assessment: null,
        learnerState: null,
        progress: progress.filter(row => row.userId === id).map(row => ({ lessonId: row.lessonId, currentStep: row.currentStep, completedAt: row.completedAt, updatedAt: new Date().toISOString() })),
        toolkit: [],
        minutes: { totalMinutes: 0, entries: 0 },
        visits: [],
        interactions: []
      };
    }
  };
}

async function runServer(db) {
  const server = createServer({ db });
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

  return { server, request };
}

function cookieHeader(setCookie) {
  return String(setCookie || '').split(';')[0];
}

async function runRouteChecks(db, label) {
  const { server, request } = await runServer(db);
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
    const learnerCsrf = state.body.csrfToken;
    assert.ok(learnerCsrf);

    const curriculum = await request('/api/v2/curriculum', { headers: { cookie: learnerCookie } });
    assert.equal(curriculum.response.status, 200);
    assert.equal(curriculum.body.curriculum.tracks[0].id, 'core-ai-literacy');

    const quizBlocked = await request('/api/v2/quiz-answer', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie },
      body: { lessonId: 'chapter-1', stepIndex: 0, answer: { selected: 'A' }, correct: true }
    });
    assert.equal(quizBlocked.response.status, 403);

    const quiz = await request('/api/v2/quiz-answer', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { lessonId: 'chapter-1', stepIndex: 0, quizKey: 'exit-check', answer: { selected: 'A' }, correct: true, feedback: 'Good' }
    });
    assert.equal(quiz.response.status, 201);

    const activity = await request('/api/v2/activity-complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { lessonId: 'chapter-1', stepIndex: 0, activityKind: 'classify', activityKey: 'sort-it', payload: { completed: true } }
    });
    assert.equal(activity.response.status, 201);

    const dashboard = await request('/api/v2/dashboard', { headers: { cookie: learnerCookie } });
    assert.equal(dashboard.response.status, 200);
    assert.equal(dashboard.body.dashboard.quizSubmissions, 1);
    assert.equal(dashboard.body.dashboard.completedActivities, 1);

    const wrongQuiz = await request('/api/v2/quiz-answer', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { lessonId: 'chapter-1', stepIndex: 0, quizKey: 'exit-check', answer: { selected: 'B' }, correct: false, feedback: 'Try again' }
    });
    assert.equal(wrongQuiz.response.status, 201);

    const resetRequest = await request('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: signup.body.user.email }
    });
    assert.equal(resetRequest.response.status, 200);
    assert.ok(resetRequest.body.resetToken);

    const resetConfirm = await request('/api/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { token: resetRequest.body.resetToken, password: 'reset-learning-pass' }
    });
    assert.equal(resetConfirm.response.status, 200);

    const loginAfterReset = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: signup.body.user.email, password: 'reset-learning-pass' }
    });
    assert.equal(loginAfterReset.response.status, 200);

    const adminLogin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://127.0.0.1:8787' },
      body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
    });
    assert.equal(adminLogin.response.status, 200);
    const adminCookie = cookieHeader(adminLogin.headers.get('set-cookie'));

    const blockedAdminOrigin = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
      body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
    });
    assert.equal(blockedAdminOrigin.response.status, 403);
    assert.equal(blockedAdminOrigin.body.error, 'origin_not_allowed');

    const learners = await request('/api/admin/learners', { headers: { cookie: adminCookie } });
    assert.equal(learners.response.status, 200);
    assert.ok(Array.isArray(learners.body.learners));
    const learnerId = learners.body.learners[0].id;

    const lessonAnalytics = await request('/api/admin/lesson-analytics', { headers: { cookie: adminCookie } });
    assert.equal(lessonAnalytics.response.status, 200);
    assert.equal(lessonAnalytics.body.lessons[0].difficultSteps[0].incorrect, 1);

    const learnerDetail = await request(`/api/admin/learner/${encodeURIComponent(learnerId)}`, { headers: { cookie: adminCookie } });
    assert.equal(learnerDetail.response.status, 200);
    assert.equal(learnerDetail.body.learner.user.email, signup.body.user.email);

    const renameBlocked = await request('/api/admin/account-action', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie },
      body: { userId: learnerId, action: 'rename', displayName: 'Renamed Learner' }
    });
    assert.equal(renameBlocked.response.status, 403);

    const renamed = await request('/api/admin/account-action', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { userId: learnerId, action: 'rename', displayName: 'Renamed Learner' }
    });
    assert.equal(renamed.response.status, 200);

    const reset = await request('/api/admin/account-action', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { userId: learnerId, action: 'resetPassword', newPassword: 'new-learning-pass' }
    });
    assert.equal(reset.response.status, 200);

    const adminCurriculum = await request('/api/admin/curriculum', { headers: { cookie: adminCookie } });
    assert.equal(adminCurriculum.response.status, 200);
    assert.equal(adminCurriculum.body.curriculum.levels[0].id, 'foundation');

    const createBlocked = await request('/api/admin/curriculum/lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie },
      body: { title: 'New Admin Lesson', arc: 'Admin Draft', num: 31 }
    });
    assert.equal(createBlocked.response.status, 403);

    const createdLesson = await request('/api/admin/curriculum/lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { title: 'New Admin Lesson', arc: 'Admin Draft', num: 31, status: 'draft', levelId: 'builder' }
    });
    assert.equal(createdLesson.response.status, 201);
    assert.equal(createdLesson.body.lesson.id, 'chapter-31');
    assert.equal(createdLesson.body.lesson.title, 'New Admin Lesson');
    assert.equal(createdLesson.body.lesson.levelId, 'builder');

    const duplicateLesson = await request('/api/admin/curriculum/lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { title: 'Duplicate Admin Lesson', arc: 'Admin Draft', num: 31 }
    });
    assert.equal(duplicateLesson.response.status, 409);
    assert.equal(duplicateLesson.body.error, 'lesson_exists');

    const editBlocked = await request('/api/admin/curriculum/lessons/chapter-1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: adminCookie },
      body: { title: 'Edited without CSRF' }
    });
    assert.equal(editBlocked.response.status, 403);

    const edited = await request('/api/admin/curriculum/lessons/chapter-1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { title: 'Edited title', levelId: 'explorer' }
    });
    assert.equal(edited.response.status, 200);
    assert.equal(edited.body.lesson.title, 'Edited title');
    assert.equal(edited.body.lesson.levelId, 'explorer');

    console.log(`${label} backend route checks passed`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

await runRouteChecks(createFakeDb(), 'Fake DB');

if (process.env.DATABASE_URL) {
  const { createDb } = await import('./db.mjs');
  await runRouteChecks(createDb(), 'Postgres');
} else {
  console.log('Postgres integration skipped: DATABASE_URL is not set.');
}
