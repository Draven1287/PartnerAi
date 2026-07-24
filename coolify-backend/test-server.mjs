import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
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
  const feedbackRequests = [];
  const projectReviews = [];
  const tutorSessions = [];
  const tutorMessages = [];
  const toolkit = [];
  const assessments = new Map();
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
    async updateUserProfile({ userId, displayName }) {
      const row = users.get(userId);
      if (!row || row.deleted_at) return null;
      const previousDisplayName = row.display_name || '';
      row.display_name = displayName;
      if (previousDisplayName !== displayName) {
        audits.push({
          eventName: 'profile_name_change',
          targetUserId: userId,
          payload: { previousDisplayName, displayName, source: 'learner' },
          createdAt: new Date().toISOString()
        });
      }
      return publicUser(row);
    },
    async deleteUserAccount(userId) {
      const row = users.get(userId);
      if (!row) return false;

      usersByEmail.delete(row.email);
      users.delete(userId);
      assessments.delete(userId);

      for (const [tokenHash, session] of sessions) {
        if (session.user_id === userId) sessions.delete(tokenHash);
      }
      for (const [tokenHash, token] of resetTokens) {
        if (token.userId === userId) resetTokens.delete(tokenHash);
      }

      for (const rows of [
        progress,
        quizSubmissions,
        activityCompletions,
        feedbackRequests,
        projectReviews,
        tutorSessions,
        tutorMessages,
        toolkit,
        audits
      ]) {
        for (let index = rows.length - 1; index >= 0; index -= 1) {
          const item = rows[index];
          if (item.userId === userId || item.targetUserId === userId) rows.splice(index, 1);
        }
      }

      return true;
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
      if (kind === 'learner') {
        const user = users.get(session.user_id);
        return user && !user.disabled && !user.deleted_at ? { session, user: publicUser(user) } : null;
      }
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
        toolkit: toolkit.filter(row => row.userId === userId).map(row => ({
          id: row.id,
          lessonId: row.lessonId,
          cardType: row.cardType,
          payload: row.payload,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt || row.createdAt
        })),
        minutes: { totalMinutes: 0, entries: 0 }
      };
    },
    async curriculum({ includeDrafts = true } = {}) {
      const visibleLessons = includeDrafts ? lessons : lessons.filter(lesson => lesson.status === 'published');
      return {
        version: 'test',
        tracks: [{ id: 'core-ai-literacy', title: 'Core AI Literacy', description: '', sortOrder: 1, status: 'published', modules: ['orientation'] }],
        levels: [{ id: 'foundation', title: 'Foundation', description: '', sortOrder: 1, status: 'published', lessons: visibleLessons.map(lesson => lesson.id) }],
        modules: [{ id: 'orientation', title: 'Orientation', trackId: 'core-ai-literacy', sortOrder: 1, status: 'published', lessons: visibleLessons }],
        lessons: visibleLessons
      };
    },
    async curriculumLesson(lessonId, { includeDrafts = true } = {}) {
      return lessons.find(lesson => lesson.id === lessonId && (includeDrafts || lesson.status === 'published')) || null;
    },
    async accessForUser() {
      const published = lessons.filter(lesson => lesson.status === 'published');
      return {
        model: 'learn-first-permanent-core',
        enforcementEnabled: false,
        accessMode: 'preview',
        coreOwned: false,
        continuumActive: false,
        freeLessonIds: published.filter(lesson => [1, 7, 11, 16, 21, 26, 31, 36, 41, 46].includes(Number(lesson.num))).map(lesson => lesson.id),
        allowedLessonIds: published.map(lesson => lesson.id),
        entitlements: [],
        promises: { coreIsPermanent: true, subscriptionRequiredForCore: false, cancellingContinuumRemovesCore: false, lessonsContainSalesGates: false }
      };
    },
    async adminCreateLesson({ lesson }) {
      const requestedNum = Number(lesson.num);
      const num = lesson.num != null && Number.isInteger(requestedNum) ? requestedNum : Math.max(...lessons.map(row => Number(row.num) || 0), 0) + 1;
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
      return [...users.values()].map(row => {
        const nameChanges = audits.filter(audit => audit.targetUserId === row.id && ['profile_name_change', 'account_rename'].includes(audit.eventName));
        return {
          id: row.id,
          email: row.email,
          displayName: row.display_name,
          totalMinutes: 0,
          visitCount: 0,
          activeDays: 0,
          completionPercent: 0,
          currentLesson: '',
          lastActiveAt: '',
          toolkitCards: 0,
          savedNoteCount: 0,
          nameChangeCount: nameChanges.length,
          lastNameChangedAt: nameChanges[0]?.createdAt || ''
        };
      });
    },
    async adminVisitAnalytics() {
      return {
        visitsByDay: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(label => ({ label, count: 0 })),
        visitsByWeek: [['8w', 0], ['7w', 0], ['6w', 0], ['5w', 0], ['4w', 0], ['3w', 0], ['2w', 0], ['Now', 0]].map(([label, count]) => ({ label, count })),
        returnBuckets: { daily: 0, weekly2: 0, weekly: 0, once: 0 },
        avgGapDays: 0,
        returnedWithin7: 0
      };
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
    async adminAssessmentAnalytics() {
      const attempts = [];
      const responses = [];
      for (const [userId, assessment] of assessments.entries()) {
        const user = users.get(userId);
        if (!user || user.deleted_at) continue;
        const attemptId = `${userId}-assessment`;
        attempts.push({
          id: attemptId,
          userId,
          email: user.email,
          displayName: user.display_name,
          completedAt: assessment.completedAt || '',
          scorePercent: assessment.scorePercent ?? assessment.score ?? null,
          level: assessment.level || assessment.route || '',
          ageRange: assessment.ageRange || 'unknown'
        });
        for (const response of Array.isArray(assessment.responses) ? assessment.responses : []) {
          responses.push({
            attemptId,
            userId,
            email: user.email,
            displayName: user.display_name,
            completedAt: assessment.completedAt || '',
            scorePercent: assessment.scorePercent ?? assessment.score ?? null,
            level: assessment.level || assessment.route || '',
            ageRange: assessment.ageRange || 'unknown',
            questionKey: response.key || response.questionKey || '',
            category: response.category || '',
            selectedValue: response.value || response.selectedValue || '',
            selectedLabel: response.label || response.selectedLabel || '',
            score: response.score ?? null,
            freeText: response.freeText || ''
          });
        }
      }
      return { attempts, responses };
    },
    async exportAssessmentResponses() {
      const rows = [];
      for (const [userId, assessment] of assessments.entries()) {
        const user = users.get(userId);
        if (!user || user.deleted_at) continue;
        for (const response of Array.isArray(assessment.responses) ? assessment.responses : []) {
          rows.push({
            email: user.email,
            displayName: user.display_name,
            ageRange: assessment.ageRange || 'unknown',
            level: assessment.level || assessment.route || '',
            scorePercent: assessment.scorePercent ?? assessment.score ?? null,
            category: response.category || '',
            questionKey: response.key || response.questionKey || '',
            selectedValue: response.value || response.selectedValue || '',
            selectedLabel: response.label || response.selectedLabel || '',
            score: response.score ?? null,
            freeText: response.freeText || '',
            completedAt: assessment.completedAt || ''
          });
        }
      }
      return rows;
    },
    async saveAssessment(userId, assessment) {
      assessments.set(userId, { ...assessment, completedAt: assessment.completedAt || new Date().toISOString() });
    },
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
    async saveToolkit(userId, { id = '', lessonId = '', cardType = 'Toolkit card', payload = {} }) {
      const cardId = id || randomUUID();
      const existing = toolkit.find(row => row.userId === userId && row.id === cardId);
      if (existing) {
        existing.lessonId = lessonId;
        existing.cardType = cardType;
        existing.payload = payload;
        existing.updatedAt = new Date().toISOString();
        return existing.id;
      }
      toolkit.unshift({
        userId,
        id: cardId,
        lessonId,
        cardType,
        payload,
        createdAt: new Date().toISOString()
      });
      return cardId;
    },
    async archiveToolkit(userId, id) {
      const index = toolkit.findIndex(row => row.userId === userId && row.id === id);
      if (index < 0) return false;
      toolkit.splice(index, 1);
      return true;
    },
    async addMinutes() {},
    async recordVisit() {},
    async importLocal() {},
    async dashboardForUser(userId) {
      const userProgress = progress.filter(row => row.userId === userId);
      const completedLessons = userProgress.filter(row => row.completedAt).length;
      const publishedLessons = lessons.filter(lesson => lesson.status === 'published');
      return {
        user: publicUser(users.get(userId)),
        currentLesson: userProgress[0]?.lessonId || 'chapter-1',
        currentStep: userProgress[0]?.currentStep || 0,
        nextLesson: publishedLessons.find(lesson => !userProgress.some(row => row.lessonId === lesson.id && row.completedAt)) || null,
        completedLessons,
        totalLessons: publishedLessons.length,
        completionPercent: publishedLessons.length ? Math.round((completedLessons / publishedLessons.length) * 100) : 0,
        minutes: { totalMinutes: 0, entries: 0 },
        toolkitCount: toolkit.filter(row => row.userId === userId).length,
        quizSubmissions: quizSubmissions.filter(row => row.userId === userId).length,
        incorrectQuizSubmissions: quizSubmissions.filter(row => row.userId === userId && row.correct === false).length,
        completedActivities: activityCompletions.filter(row => row.userId === userId).length,
        modules: [{ id: 'orientation', title: 'Orientation', completedLessons, totalLessons: publishedLessons.length }]
      };
    },
    async createFeedbackRequest(userId, request = {}) {
      const row = { id: randomUUID(), userId, requestType: request.requestType || 'feedback', status: 'queued', createdAt: new Date().toISOString() };
      feedbackRequests.push(row);
      return { id: row.id, status: row.status, createdAt: row.createdAt };
    },
    async createProjectReview(userId, review = {}) {
      const row = { id: randomUUID(), userId, title: review.title || 'Untitled project', status: 'queued', createdAt: new Date().toISOString() };
      projectReviews.push(row);
      return { id: row.id, status: row.status, createdAt: row.createdAt };
    },
    async createTutorSession(userId, session = {}) {
      const row = { id: randomUUID(), userId, topic: session.topic || 'AI learning help', status: 'open', updatedAt: new Date().toISOString() };
      tutorSessions.push(row);
      return { id: row.id, topic: row.topic, status: row.status, createdAt: row.updatedAt };
    },
    async addTutorMessage(userId, message = {}) {
      const session = tutorSessions.find(row => row.id === message.sessionId && row.userId === userId);
      if (!session) return null;
      const row = { id: randomUUID(), sessionId: session.id, userId, content: message.content || '', createdAt: new Date().toISOString() };
      tutorMessages.push(row);
      session.updatedAt = row.createdAt;
      return { id: row.id, createdAt: row.createdAt };
    },
    async progressInsights() { return []; },
    async adminAiRequests() {
      function decorate(row) {
        const user = users.get(row.userId);
        return { ...row, email: user?.email || '', displayName: user?.display_name || '' };
      }
      return {
        feedbackRequests: feedbackRequests.map(decorate),
        projectReviews: projectReviews.map(decorate),
        tutorSessions: tutorSessions.map(decorate)
      };
    },
    async accountAction({ userId, action, displayName, newPassword }) {
      const row = users.get(userId);
      if (!row) return;
      if (action === 'disable') row.disabled = true;
      if (action === 'enable') row.disabled = false;
      const previousDisplayName = row.display_name || '';
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
      audits.push({
        eventName: `account_${action}`,
        targetUserId: userId,
        payload: action === 'rename' ? { previousDisplayName, displayName, source: 'admin' } : {},
        createdAt: new Date().toISOString()
      });
    },
    async adminLearner(id) {
      const user = users.get(id);
      if (!user) return null;
      const nameChanges = audits.filter(audit => audit.targetUserId === id && ['profile_name_change', 'account_rename'].includes(audit.eventName))
        .map(audit => ({
          eventName: audit.eventName,
          source: audit.payload?.source || (audit.eventName === 'account_rename' ? 'admin' : 'learner'),
          previousDisplayName: audit.payload?.previousDisplayName || '',
          displayName: audit.payload?.displayName || '',
          changedAt: audit.createdAt || ''
        }));
      return {
        user: publicUser(user),
        assessment: null,
        learnerState: null,
        progress: progress.filter(row => row.userId === id).map(row => ({ lessonId: row.lessonId, currentStep: row.currentStep, completedAt: row.completedAt, updatedAt: new Date().toISOString() })),
        toolkit: [],
        minutes: { totalMinutes: 0, entries: 0 },
        visits: [],
        interactions: [],
        nameChangeStats: {
          count: nameChanges.length,
          learnerCount: nameChanges.filter(row => row.source === 'learner').length,
          adminCount: nameChanges.filter(row => row.source === 'admin').length,
          lastChangedAt: nameChanges[0]?.changedAt || '',
          recent: nameChanges
        }
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
    const text = await response.text();
    let body = {};
    try {
      body = JSON.parse(text);
    } catch {}
    return { response, headers: response.headers, body, text };
  }

  return { server, request };
}

function cookieHeader(setCookie) {
  return String(setCookie || '').split(';')[0];
}

function postgresTestConnectionString() {
  const connectionString = process.env.LEARNING_AI_TEST_DATABASE_URL || process.env.TEST_DATABASE_URL || '';
  if (!connectionString) return '';

  if (process.env.ALLOW_POSTGRES_TEST_WRITES !== 'true') {
    throw new Error('Postgres route tests write data. Set ALLOW_POSTGRES_TEST_WRITES=true and use a dedicated test database.');
  }

  let parsed;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error('LEARNING_AI_TEST_DATABASE_URL must be a valid Postgres connection URL.');
  }

  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, '')).toLowerCase();
  if (!databaseName.includes('test')) {
    throw new Error(`Refusing to run Postgres route tests against database "${databaseName}". Use a dedicated database with "test" in its name.`);
  }

  return connectionString;
}

async function runDbFailureChecks() {
  const failingDb = {
    async init() {
      throw new Error('intentional_test_db_failure');
    }
  };
  const { server, request } = await runServer(failingDb);
  try {
    const minutes = await request('/api/minutes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { name: 'No Json Fallback', minutes: 12, consent: true }
    });
    assert.equal(minutes.response.status, 503);
    assert.equal(minutes.body.error, 'db_not_ready');
    assert.equal(minutes.body.ok, false);
    assert.equal(minutes.body.fallback, undefined);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

async function runRouteChecks(db, label) {
  const { server, request } = await runServer(db);
  try {
    const health = await request('/health');
    assert.equal(health.response.status, 200);
    assert.equal(health.body.dbStatus, 'ok');
    const apiHealth = await request('/api/health');
    assert.equal(apiHealth.response.status, 200);
    assert.equal(apiHealth.body.dbStatus, 'ok');

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
    let learnerCsrf = state.body.csrfToken;
    assert.ok(learnerCsrf);

    const secondSignup = await request('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: `second-${Date.now()}@example.com`, password: 'learning-ai-pass', displayName: 'Second Learner' }
    });
    assert.equal(secondSignup.response.status, 201);
    const secondCookie = cookieHeader(secondSignup.headers.get('set-cookie'));
    const secondInitialState = await request('/api/v2/state', { headers: { cookie: secondCookie } });
    assert.equal(secondInitialState.response.status, 200);
    assert.deepEqual(secondInitialState.body.state.progress, []);
    const secondProgress = await request('/api/v2/progress', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: secondCookie, 'x-csrf-token': secondInitialState.body.csrfToken },
      body: { lessonId: 'chapter-1', currentStep: 1, completed: true }
    });
    assert.equal(secondProgress.response.status, 200);
    const firstStateAfterSecondWrite = await request('/api/v2/state', { headers: { cookie: learnerCookie } });
    const secondStateAfterWrite = await request('/api/v2/state', { headers: { cookie: secondCookie } });
    assert.deepEqual(firstStateAfterSecondWrite.body.state.progress.map(row => row.lessonId), ['chapter-1']);
    assert.deepEqual(secondStateAfterWrite.body.state.progress.map(row => row.lessonId), ['chapter-1']);
    learnerCsrf = firstStateAfterSecondWrite.body.csrfToken;

    const profileBlocked = await request('/api/v2/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: learnerCookie },
      body: { displayName: 'No Csrf Learner' }
    });
    assert.equal(profileBlocked.response.status, 403);

    const profileInvalid = await request('/api/v2/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { displayName: '' }
    });
    assert.equal(profileInvalid.response.status, 400);

    const profileUpdate = await request('/api/v2/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { displayName: 'Updated Learner' }
    });
    assert.equal(profileUpdate.response.status, 200);
    assert.equal(profileUpdate.body.user.displayName, 'Updated Learner');

    const meAfterProfile = await request('/api/auth/me', { headers: { cookie: learnerCookie } });
    assert.equal(meAfterProfile.response.status, 200);
    assert.equal(meAfterProfile.body.user.displayName, 'Updated Learner');
    learnerCsrf = meAfterProfile.body.csrfToken;

    const stateAfterProfile = await request('/api/v2/state', { headers: { cookie: learnerCookie } });
    assert.equal(stateAfterProfile.response.status, 200);
    assert.equal(stateAfterProfile.body.state.user.displayName, 'Updated Learner');
    learnerCsrf = stateAfterProfile.body.csrfToken;

    const curriculum = await request('/api/v2/curriculum', { headers: { cookie: learnerCookie } });
    assert.equal(curriculum.response.status, 200);
    assert.equal(curriculum.body.curriculum.tracks[0].id, 'core-ai-literacy');
    const access = await request('/api/v2/access', { headers: { cookie: learnerCookie } });
    assert.equal(access.response.status, 200);
    assert.equal(access.body.access.model, 'learn-first-permanent-core');
    assert.equal(access.body.access.promises.subscriptionRequiredForCore, false);

    const assessment = await request('/api/v2/assessment', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: {
        ageRange: '14-17',
        scorePercent: 72,
        level: 'foundation',
        responses: [
          {
            category: 'focus-area',
            questionKey: 'definition',
            selectedValue: 'teaching',
            selectedLabel: 'Teaching',
            score: 2,
            freeText: 'I want lessons to connect to school.'
          }
        ]
      }
    });
    assert.equal(assessment.response.status, 200);

    const toolkitCardId = `qa-card-${Date.now()}`;
    const toolkitSave = await request('/api/v2/toolkit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: {
        id: toolkitCardId,
        lessonId: 'chapter-1',
        cardType: 'Agency rule',
        payload: { fields: { rule: 'Verify before trusting fluent answers.' } }
      }
    });
    assert.equal(toolkitSave.response.status, 201);
    assert.equal(toolkitSave.body.id, toolkitCardId);

    const stateWithToolkit = await request('/api/v2/state', { headers: { cookie: learnerCookie } });
    assert.equal(stateWithToolkit.response.status, 200);
    assert.equal(stateWithToolkit.body.state.toolkit.some(card => card.id === toolkitCardId), true);
    learnerCsrf = stateWithToolkit.body.csrfToken;

    const toolkitDeleteBlocked = await request(`/api/v2/toolkit/${encodeURIComponent(toolkitCardId)}`, {
      method: 'DELETE',
      headers: { cookie: learnerCookie }
    });
    assert.equal(toolkitDeleteBlocked.response.status, 403);

    const toolkitDelete = await request(`/api/v2/toolkit/${encodeURIComponent(toolkitCardId)}`, {
      method: 'DELETE',
      headers: { cookie: learnerCookie, 'x-csrf-token': learnerCsrf }
    });
    assert.equal(toolkitDelete.response.status, 200);

    const toolkitDeleteMissing = await request(`/api/v2/toolkit/${encodeURIComponent(toolkitCardId)}`, {
      method: 'DELETE',
      headers: { cookie: learnerCookie, 'x-csrf-token': learnerCsrf }
    });
    assert.equal(toolkitDeleteMissing.response.status, 404);

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

    const feedbackBlocked = await request('/api/v2/feedback-request', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie },
      body: { lessonId: 'chapter-1', stepIndex: 0, requestType: 'prompt-feedback', prompt: { text: 'Check my prompt.' } }
    });
    assert.equal(feedbackBlocked.response.status, 403);

    const feedbackRequest = await request('/api/v2/feedback-request', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { lessonId: 'chapter-1', stepIndex: 0, requestType: 'prompt-feedback', prompt: { text: 'Check my prompt.' } }
    });
    assert.equal(feedbackRequest.response.status, 201);
    assert.equal(feedbackRequest.body.request.status, 'queued');

    const projectReview = await request('/api/v2/project-review', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { title: 'Prompt repair project', artifact: { summary: 'A learner project draft.' } }
    });
    assert.equal(projectReview.response.status, 201);
    assert.equal(projectReview.body.review.status, 'queued');

    const tutorSession = await request('/api/v2/tutor-sessions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { lessonId: 'chapter-1', topic: 'Help me understand verification.' }
    });
    assert.equal(tutorSession.response.status, 201);
    assert.match(tutorSession.body.session.id, /^[0-9a-f-]{36}$/i);

    const tutorMessageBlocked = await request(`/api/v2/tutor-sessions/${encodeURIComponent(tutorSession.body.session.id)}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie },
      body: { content: 'What should I check first?' }
    });
    assert.equal(tutorMessageBlocked.response.status, 403);

    const tutorMessage = await request(`/api/v2/tutor-sessions/${encodeURIComponent(tutorSession.body.session.id)}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: learnerCookie, 'x-csrf-token': learnerCsrf },
      body: { content: 'What should I check first?' }
    });
    assert.equal(tutorMessage.response.status, 201);
    assert.match(tutorMessage.body.message.id, /^[0-9a-f-]{36}$/i);

    const insights = await request('/api/v2/insights', { headers: { cookie: learnerCookie } });
    assert.equal(insights.response.status, 200);
    assert.ok(Array.isArray(insights.body.insights));

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

    const adminLogoutBlocked = await request('/api/admin/logout', {
      method: 'POST',
      headers: { cookie: adminCookie }
    });
    assert.equal(adminLogoutBlocked.response.status, 403);

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

    const overview = await request('/api/admin/overview', { headers: { cookie: adminCookie } });
    assert.equal(overview.response.status, 200);
    assert.equal(overview.body.ok, true);
    assert.equal(overview.body.learners[0].email, signup.body.user.email);
    assert.ok(Array.isArray(overview.body.questions.definition));
    assert.equal(overview.body.questions.definition[2], 1);
    assert.ok(Array.isArray(overview.body.visitsByDay));
    assert.equal(overview.body.returnBuckets.once, 0);

    const exportBlocked = await request('/api/admin/export.csv', {
      method: 'POST',
      headers: { cookie: adminCookie }
    });
    assert.equal(exportBlocked.response.status, 403);

    const exportCsv = await request('/api/admin/export.csv', {
      method: 'POST',
      headers: { cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken }
    });
    assert.equal(exportCsv.response.status, 200);
    assert.match(exportCsv.headers.get('content-type') || '', /text\/csv/);
    assert.match(exportCsv.text, /^email,displayName,totalMinutes,visitCount,currentLesson,completionPercent,lastActiveAt,savedCardCount,savedNoteCount,nameChangeCount,lastNameChangedAt/);
    assert.ok(exportCsv.text.includes(signup.body.user.email));

    const assessmentExportBlocked = await request('/api/admin/assessment-export.csv', {
      method: 'POST',
      headers: { cookie: adminCookie }
    });
    assert.equal(assessmentExportBlocked.response.status, 403);

    const assessmentExportCsv = await request('/api/admin/assessment-export.csv', {
      method: 'POST',
      headers: { cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken }
    });
    assert.equal(assessmentExportCsv.response.status, 200);
    assert.match(assessmentExportCsv.headers.get('content-type') || '', /text\/csv/);
    assert.match(assessmentExportCsv.text, /^email,displayName,ageRange,level,scorePercent,category,questionKey,selectedValue,selectedLabel,score,freeText,completedAt/);
    assert.ok(assessmentExportCsv.text.includes(signup.body.user.email));
    assert.ok(assessmentExportCsv.text.includes('"Teaching"'));

    const lessonAnalytics = await request('/api/admin/lesson-analytics', { headers: { cookie: adminCookie } });
    assert.equal(lessonAnalytics.response.status, 200);
    assert.equal(lessonAnalytics.body.lessons[0].difficultSteps[0].incorrect, 1);

    const aiRequests = await request('/api/admin/ai-requests', { headers: { cookie: adminCookie } });
    assert.equal(aiRequests.response.status, 200);
    assert.equal(aiRequests.body.ai.feedbackRequests.length, 1);
    assert.equal(aiRequests.body.ai.projectReviews.length, 1);
    assert.equal(aiRequests.body.ai.tutorSessions.length, 1);
    assert.equal(aiRequests.body.ai.feedbackRequests[0].email, signup.body.user.email);

    const learnerDetail = await request(`/api/admin/learner/${encodeURIComponent(learnerId)}`, { headers: { cookie: adminCookie } });
    assert.equal(learnerDetail.response.status, 200);
    assert.equal(learnerDetail.body.learner.user.email, signup.body.user.email);
    assert.equal(learnerDetail.body.learner.user.displayName, 'Updated Learner');
    assert.equal(learnerDetail.body.learner.nameChangeStats.count, 1);
    assert.equal(learnerDetail.body.learner.nameChangeStats.learnerCount, 1);

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

    const learnerDetailAfterRename = await request(`/api/admin/learner/${encodeURIComponent(learnerId)}`, { headers: { cookie: adminCookie } });
    assert.equal(learnerDetailAfterRename.response.status, 200);
    assert.equal(learnerDetailAfterRename.body.learner.user.displayName, 'Renamed Learner');
    assert.equal(learnerDetailAfterRename.body.learner.nameChangeStats.count, 2);
    assert.equal(learnerDetailAfterRename.body.learner.nameChangeStats.adminCount, 1);

    const reset = await request('/api/admin/account-action', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { userId: learnerId, action: 'resetPassword', newPassword: 'new-learning-pass' }
    });
    assert.equal(reset.response.status, 200);

    const loginAfterAdminReset = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: signup.body.user.email, password: 'new-learning-pass' }
    });
    assert.equal(loginAfterAdminReset.response.status, 200);
    const adminResetLearnerCookie = cookieHeader(loginAfterAdminReset.headers.get('set-cookie'));

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
      body: { title: 'New Admin Lesson', arc: 'Admin Draft', status: 'draft', levelId: 'builder' }
    });
    assert.equal(createdLesson.response.status, 201);
    assert.match(createdLesson.body.lesson.id, /^chapter-\d+$/);
    assert.equal(createdLesson.body.lesson.title, 'New Admin Lesson');
    assert.equal(createdLesson.body.lesson.levelId, 'builder');
    const createdLessonId = createdLesson.body.lesson.id;

    const duplicateLesson = await request('/api/admin/curriculum/lessons', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { title: 'Duplicate Admin Lesson', arc: 'Admin Draft', id: createdLessonId, status: 'draft', levelId: 'builder' }
    });
    assert.equal(duplicateLesson.response.status, 409);
    assert.equal(duplicateLesson.body.error, 'lesson_exists');

    const adminCurriculumAfterCreate = await request('/api/admin/curriculum', { headers: { cookie: adminCookie } });
    assert.equal(adminCurriculumAfterCreate.response.status, 200);
    assert.ok(adminCurriculumAfterCreate.body.curriculum.lessons.some(lesson => lesson.id === createdLessonId));

    const learnerCurriculumAfterCreate = await request('/api/v2/curriculum', { headers: { cookie: adminResetLearnerCookie } });
    assert.equal(learnerCurriculumAfterCreate.response.status, 200);
    assert.ok(!learnerCurriculumAfterCreate.body.curriculum.lessons.some(lesson => lesson.id === createdLessonId));

    const hiddenDraftLesson = await request(`/api/v2/lessons/${encodeURIComponent(createdLessonId)}`, { headers: { cookie: adminResetLearnerCookie } });
    assert.equal(hiddenDraftLesson.response.status, 404);

    const disabled = await request('/api/admin/account-action', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { userId: learnerId, action: 'disable' }
    });
    assert.equal(disabled.response.status, 200);

    const disabledLogin = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: signup.body.user.email, password: 'new-learning-pass' }
    });
    assert.equal(disabledLogin.response.status, 401);

    const disabledSession = await request('/api/v2/state', { headers: { cookie: adminResetLearnerCookie } });
    assert.equal(disabledSession.response.status, 401);

    const enabled = await request('/api/admin/account-action', {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken },
      body: { userId: learnerId, action: 'enable' }
    });
    assert.equal(enabled.response.status, 200);

    const loginAfterEnable = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: signup.body.user.email, password: 'new-learning-pass' }
    });
    assert.equal(loginAfterEnable.response.status, 200);

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

    const deleteEmail = `delete-${Date.now()}@example.com`;
    const deleteSignup = await request('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: deleteEmail, password: 'delete-learning-pass', displayName: 'Delete Me' }
    });
    assert.equal(deleteSignup.response.status, 201);
    const deleteCookie = cookieHeader(deleteSignup.headers.get('set-cookie'));

    const deleteBlocked = await request('/api/v2/account', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', cookie: deleteCookie },
      body: { confirmation: 'DELETE' }
    });
    assert.equal(deleteBlocked.response.status, 403);

    const deleteUnconfirmed = await request('/api/v2/account', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', cookie: deleteCookie, 'x-csrf-token': deleteSignup.body.csrfToken },
      body: { confirmation: 'delete' }
    });
    assert.equal(deleteUnconfirmed.response.status, 400);
    assert.equal(deleteUnconfirmed.body.error, 'confirmation_required');

    const deleteAccount = await request('/api/v2/account', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', cookie: deleteCookie, 'x-csrf-token': deleteSignup.body.csrfToken },
      body: { confirmation: 'DELETE' }
    });
    assert.equal(deleteAccount.response.status, 200);
    const deletedSession = await request('/api/auth/me', { headers: { cookie: deleteCookie } });
    assert.equal(deletedSession.response.status, 401);
    const deletedLogin = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: deleteEmail, password: 'delete-learning-pass' }
    });
    assert.equal(deletedLogin.response.status, 401);
    const reuseDeletedEmail = await request('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { email: deleteEmail, password: 'new-delete-learning-pass', displayName: 'Fresh Account' }
    });
    assert.equal(reuseDeletedEmail.response.status, 201);

    const adminLogout = await request('/api/admin/logout', {
      method: 'POST',
      headers: { cookie: adminCookie, 'x-csrf-token': adminLogin.body.csrfToken }
    });
    assert.equal(adminLogout.response.status, 200);
    const adminAfterLogout = await request('/api/admin/me', { headers: { cookie: adminCookie } });
    assert.equal(adminAfterLogout.response.status, 401);

    console.log(`${label} backend route checks passed`);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

await runRouteChecks(createFakeDb(), 'Fake DB');
await runDbFailureChecks();

const testDatabaseUrl = postgresTestConnectionString();
if (testDatabaseUrl) {
  const { createDb } = await import('./db.mjs');
  await runRouteChecks(createDb({ connectionString: testDatabaseUrl }), 'Postgres');
} else {
  if (process.env.DATABASE_URL) {
    console.log('Postgres integration skipped: DATABASE_URL is ignored for safety. Use LEARNING_AI_TEST_DATABASE_URL for route tests.');
  } else {
    console.log('Postgres integration skipped: set LEARNING_AI_TEST_DATABASE_URL to a dedicated test database URL.');
  }
}
