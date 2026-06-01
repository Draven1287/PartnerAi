import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export function createStore(dbFile) {
  let db = emptyDb();

  function emptyDb() {
    return {
      users: [],
      sessions: [],
      assessments: [],
      progress: [],
      interactions: [],
      toolkit: [],
      minutes: []
    };
  }

  async function init() {
    mkdirSync(dirname(dbFile), { recursive: true });
    if (existsSync(dbFile)) {
      try {
        db = { ...emptyDb(), ...JSON.parse(readFileSync(dbFile, 'utf8')) };
      } catch {
        db = emptyDb();
      }
    }
    save();
  }

  function save() {
    writeFileSync(dbFile, JSON.stringify(db, null, 2));
  }

  function now() {
    return new Date().toISOString();
  }

  function userPublic(row) {
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      disabled: Boolean(row.disabled),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lastActiveAt: row.lastActiveAt || ''
    };
  }

  function createUser({ email, passwordHash, displayName }) {
    const at = now();
    const user = {
      id: randomUUID(),
      email,
      passwordHash,
      displayName,
      disabled: false,
      createdAt: at,
      updatedAt: at,
      lastActiveAt: at
    };
    db.users.push(user);
    save();
    return userPublic(user);
  }

  function findUserByEmail(email) {
    return db.users.find(user => user.email === email) || null;
  }

  function findUserById(id) {
    return userPublic(db.users.find(user => user.id === id));
  }

  function touchUser(id) {
    const user = db.users.find(row => row.id === id);
    if (!user) return;
    const at = now();
    user.lastActiveAt = at;
    user.updatedAt = at;
    save();
  }

  function createSession(userId, token, expiresAt) {
    db.sessions.push({ token, userId, createdAt: now(), expiresAt });
    save();
  }

  function deleteSession(token) {
    db.sessions = db.sessions.filter(session => session.token !== token);
    save();
  }

  function userForSession(token) {
    if (!token) return null;
    const at = now();
    db.sessions = db.sessions.filter(session => session.expiresAt > at);
    const session = db.sessions.find(row => row.token === token);
    if (!session) {
      save();
      return null;
    }
    const user = db.users.find(row => row.id === session.userId);
    if (!user || user.disabled) return null;
    touchUser(user.id);
    return userPublic(user);
  }

  function saveAssessment(userId, payload) {
    const at = now();
    const existing = db.assessments.find(row => row.userId === userId);
    if (existing) {
      existing.payload = payload || {};
      existing.updatedAt = at;
    } else {
      db.assessments.push({ userId, payload: payload || {}, updatedAt: at });
    }
    touchUser(userId);
  }

  function saveProgress(userId, { lessonId, currentStep = 0, completed = false }) {
    const at = now();
    const existing = db.progress.find(row => row.userId === userId && row.lessonId === lessonId);
    if (existing) {
      existing.currentStep = Math.max(Number(existing.currentStep || 0), Number(currentStep) || 0);
      if (completed && !existing.completedAt) existing.completedAt = at;
      existing.updatedAt = at;
    } else {
      db.progress.push({
        userId,
        lessonId,
        currentStep: Number(currentStep) || 0,
        completedAt: completed ? at : '',
        updatedAt: at
      });
    }
    touchUser(userId);
  }

  function saveInteraction(userId, { lessonId, stepIndex = 0, stepKind = '', payload = {} }) {
    db.interactions.push({
      id: randomUUID(),
      userId,
      lessonId,
      stepIndex: Number(stepIndex) || 0,
      stepKind,
      payload: payload || {},
      createdAt: now()
    });
    touchUser(userId);
  }

  function saveToolkit(userId, { cardType, lessonId = '', payload = {} }) {
    const at = now();
    const id = randomUUID();
    db.toolkit.push({
      id,
      userId,
      cardType,
      lessonId,
      payload: payload || {},
      createdAt: at,
      updatedAt: at
    });
    touchUser(userId);
    return id;
  }

  function addMinutes({ userId = null, name, nameKey, minutes }) {
    db.minutes.push({
      id: randomUUID(),
      userId,
      name,
      nameKey,
      minutes: Math.round(Number(minutes)),
      createdAt: now()
    });
    if (userId) touchUser(userId);
    else save();
  }

  function stateForUser(userId) {
    const assessment = db.assessments.find(row => row.userId === userId);
    const minutes = db.minutes.filter(row => row.userId === userId);
    return {
      user: findUserById(userId),
      assessment: assessment ? { ...assessment.payload, updatedAt: assessment.updatedAt } : null,
      progress: db.progress.filter(row => row.userId === userId).map(row => ({
        lessonId: row.lessonId,
        currentStep: row.currentStep,
        completedAt: row.completedAt || '',
        updatedAt: row.updatedAt
      })),
      toolkit: db.toolkit.filter(row => row.userId === userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(row => ({
        id: row.id,
        cardType: row.cardType,
        lessonId: row.lessonId,
        payload: row.payload,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      })),
      minutes: {
        totalMinutes: minutes.reduce((sum, row) => sum + Number(row.minutes || 0), 0),
        entries: minutes.length
      }
    };
  }

  function leaderboard() {
    const totals = new Map();
    db.minutes.forEach(row => {
      const current = totals.get(row.nameKey) || {
        name: row.name,
        nameKey: row.nameKey,
        totalMinutes: 0,
        entries: 0,
        lastSubmittedAt: ''
      };
      current.totalMinutes += Number(row.minutes || 0);
      current.entries += 1;
      current.lastSubmittedAt = !current.lastSubmittedAt || row.createdAt > current.lastSubmittedAt ? row.createdAt : current.lastSubmittedAt;
      totals.set(row.nameKey, current);
    });
    return [...totals.values()].sort((a, b) => b.totalMinutes - a.totalMinutes || a.name.localeCompare(b.name));
  }

  function adminLearners() {
    return db.users.map(user => {
      const minutes = db.minutes.filter(row => row.userId === user.id);
      const progress = db.progress.filter(row => row.userId === user.id);
      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        disabled: Boolean(user.disabled),
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt || '',
        totalMinutes: minutes.reduce((sum, row) => sum + Number(row.minutes || 0), 0),
        startedLessons: progress.length,
        completedLessons: progress.filter(row => row.completedAt).length,
        interactions: db.interactions.filter(row => row.userId === user.id).length,
        toolkitCards: db.toolkit.filter(row => row.userId === user.id).length
      };
    }).sort((a, b) => String(b.lastActiveAt).localeCompare(String(a.lastActiveAt)));
  }

  function adminLearner(id) {
    return db.users.some(user => user.id === id) ? stateForUser(id) : null;
  }

  function lessonAnalytics() {
    const byLesson = new Map();
    db.progress.forEach(row => {
      const current = byLesson.get(row.lessonId) || {
        lessonId: row.lessonId,
        started: new Set(),
        completed: new Set(),
        lastActivityAt: ''
      };
      current.started.add(row.userId);
      if (row.completedAt) current.completed.add(row.userId);
      current.lastActivityAt = !current.lastActivityAt || row.updatedAt > current.lastActivityAt ? row.updatedAt : current.lastActivityAt;
      byLesson.set(row.lessonId, current);
    });
    return [...byLesson.values()].map(row => ({
      lessonId: row.lessonId,
      learnersStarted: row.started.size,
      learnersCompleted: row.completed.size,
      lastActivityAt: row.lastActivityAt
    })).sort((a, b) => a.lessonId.localeCompare(b.lessonId));
  }

  function accountAction({ userId, action, displayName }) {
    const user = db.users.find(row => row.id === userId);
    if (!user) return;
    if (action === 'disable') user.disabled = true;
    if (action === 'enable') user.disabled = false;
    if (action === 'rename') user.displayName = displayName;
    if (action === 'delete') {
      db.users = db.users.filter(row => row.id !== userId);
      db.sessions = db.sessions.filter(row => row.userId !== userId);
      db.assessments = db.assessments.filter(row => row.userId !== userId);
      db.progress = db.progress.filter(row => row.userId !== userId);
      db.interactions = db.interactions.filter(row => row.userId !== userId);
      db.toolkit = db.toolkit.filter(row => row.userId !== userId);
      db.minutes.forEach(row => { if (row.userId === userId) row.userId = null; });
      save();
      return;
    }
    user.updatedAt = now();
    save();
  }

  return {
    init,
    createUser,
    findUserByEmail,
    findUserById,
    createSession,
    deleteSession,
    userForSession,
    saveAssessment,
    saveProgress,
    saveInteraction,
    saveToolkit,
    addMinutes,
    stateForUser,
    leaderboard,
    adminLearners,
    adminLearner,
    lessonAnalytics,
    accountAction
  };
}
