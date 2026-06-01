import { hashPassword } from './server.mjs';

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    disabled: Boolean(row.disabled)
  };
}

export function createFakeDb(options = {}) {
  const users = new Map();
  const usersByEmail = new Map();
  const sessions = new Map();
  const resetTokens = new Map();
  const progress = [];
  const quizSubmissions = [];
  const activityCompletions = [];
  const assessments = new Map();
  const toolkit = [];
  const visits = [];
  const interactions = [];
  const audits = [];
  const lessons = Array.isArray(options.lessons) && options.lessons.length ? options.lessons : [{
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
        existing.updatedAt = new Date().toISOString();
        return;
      }
      progress.push({ userId, lessonId, currentStep: Number(currentStep) || 0, completedAt: completed ? new Date().toISOString() : '', updatedAt: new Date().toISOString() });
    },
    async stateForUser(userId) {
      return {
        user: publicUser(users.get(userId)),
        assessment: assessments.get(userId) || null,
        learnerState: null,
        progress: progress.filter(row => row.userId === userId).map(row => ({ lessonId: row.lessonId, currentStep: row.currentStep, completedAt: row.completedAt, updatedAt: row.updatedAt })),
        toolkit: toolkit.filter(row => row.userId === userId).map(row => ({ id: row.id, lessonId: row.lessonId, cardType: row.cardType, payload: row.payload, createdAt: row.createdAt })),
        minutes: { totalMinutes: 0, entries: 0 }
      };
    },
    async curriculum() {
      return {
        version: 'test',
        tracks: [{ id: 'core-ai-literacy', title: 'Core AI Literacy', description: '', sortOrder: 1, status: 'published', modules: ['orientation'] }],
        levels: [{ id: 'foundation', title: 'Foundation', description: '', sortOrder: 1, status: 'published', lessons: lessons.map(lesson => lesson.id) }],
        modules: [{ id: 'orientation', title: 'Orientation', trackId: 'core-ai-literacy', sortOrder: 1, status: 'published', lessons }],
        lessons
      };
    },
    async curriculumLesson(lessonId) {
      return lessons.find(lesson => lesson.id === lessonId) || null;
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
      return [...users.values()].map(row => ({ id: row.id, email: row.email, displayName: row.display_name, totalMinutes: 0, visitCount: visits.filter(visit => visit.userId === row.id).length, completionPercent: 0, currentLesson: '', lastActiveAt: '' }));
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
    async saveAssessment(userId, assessment) {
      assessments.set(userId, assessment);
    },
    async saveInteraction(userId, interaction) {
      interactions.push({ userId, ...interaction, createdAt: new Date().toISOString() });
    },
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
    async saveToolkit(userId, { id, lessonId, cardType, payload }) {
      toolkit.unshift({ userId, id, lessonId, cardType, payload, createdAt: new Date().toISOString() });
    },
    async addMinutes() {},
    async recordVisit(userId, visit) {
      visits.push({ userId, ...visit, createdAt: new Date().toISOString() });
    },
    async importLocal(userId, payload) {
      if (payload?.assessment) assessments.set(userId, payload.assessment);
    },
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
        toolkitCount: toolkit.filter(row => row.userId === userId).length,
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
        assessment: assessments.get(id) || null,
        learnerState: null,
        progress: progress.filter(row => row.userId === id).map(row => ({ lessonId: row.lessonId, currentStep: row.currentStep, completedAt: row.completedAt, updatedAt: row.updatedAt })),
        toolkit: toolkit.filter(row => row.userId === id),
        minutes: { totalMinutes: 0, entries: 0 },
        visits: visits.filter(row => row.userId === id),
        interactions: interactions.filter(row => row.userId === id)
      };
    }
  };
}
