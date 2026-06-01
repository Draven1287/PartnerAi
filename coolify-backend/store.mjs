import { mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function createStore(dbFile) {
  let db;

  async function init() {
    await mkdir(dirname(dbFile), { recursive: true });
    db = new DatabaseSync(dbFile);
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        disabled INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_active_at TEXT
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS assessments (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        payload TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS lesson_progress (
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id TEXT NOT NULL,
        current_step INTEGER NOT NULL DEFAULT 0,
        completed_at TEXT,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (user_id, lesson_id)
      );
      CREATE TABLE IF NOT EXISTS interactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id TEXT NOT NULL,
        step_index INTEGER NOT NULL,
        step_kind TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS toolkit_cards (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        card_type TEXT NOT NULL,
        lesson_id TEXT,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS minute_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        name_key TEXT NOT NULL,
        minutes INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  function now() {
    return new Date().toISOString();
  }

  function userPublic(row) {
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      disabled: Boolean(row.disabled),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastActiveAt: row.last_active_at || ''
    };
  }

  function createUser({ email, passwordHash, displayName }) {
    const at = now();
    const user = {
      id: randomUUID(),
      email,
      password_hash: passwordHash,
      display_name: displayName,
      created_at: at,
      updated_at: at,
      last_active_at: at
    };
    db.prepare(`
      INSERT INTO users (id, email, password_hash, display_name, created_at, updated_at, last_active_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(user.id, user.email, user.password_hash, user.display_name, user.created_at, user.updated_at, user.last_active_at);
    return userPublic(user);
  }

  function findUserByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null;
  }

  function findUserById(id) {
    return userPublic(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
  }

  function touchUser(id) {
    db.prepare('UPDATE users SET last_active_at = ?, updated_at = ? WHERE id = ?').run(now(), now(), id);
  }

  function createSession(userId, token, expiresAt) {
    db.prepare('INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
      .run(token, userId, now(), expiresAt);
  }

  function deleteSession(token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }

  function userForSession(token) {
    if (!token) return null;
    const row = db.prepare(`
      SELECT users.* FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ? AND sessions.expires_at > ?
    `).get(token, now());
    if (!row || row.disabled) return null;
    touchUser(row.id);
    return userPublic(row);
  }

  function saveAssessment(userId, payload) {
    db.prepare(`
      INSERT INTO assessments (user_id, payload, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
    `).run(userId, JSON.stringify(payload || {}), now());
    touchUser(userId);
  }

  function saveProgress(userId, { lessonId, currentStep = 0, completed = false }) {
    const completedAt = completed ? now() : null;
    db.prepare(`
      INSERT INTO lesson_progress (user_id, lesson_id, current_step, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        current_step = max(lesson_progress.current_step, excluded.current_step),
        completed_at = COALESCE(lesson_progress.completed_at, excluded.completed_at),
        updated_at = excluded.updated_at
    `).run(userId, lessonId, Number(currentStep) || 0, completedAt, now());
    touchUser(userId);
  }

  function saveInteraction(userId, { lessonId, stepIndex = 0, stepKind = '', payload = {} }) {
    db.prepare(`
      INSERT INTO interactions (id, user_id, lesson_id, step_index, step_kind, payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), userId, lessonId, Number(stepIndex) || 0, stepKind, JSON.stringify(payload || {}), now());
    touchUser(userId);
  }

  function saveToolkit(userId, { cardType, lessonId = '', payload = {} }) {
    const cardId = randomUUID();
    const at = now();
    db.prepare(`
      INSERT INTO toolkit_cards (id, user_id, card_type, lesson_id, payload, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(cardId, userId, cardType, lessonId, JSON.stringify(payload || {}), at, at);
    touchUser(userId);
    return cardId;
  }

  function addMinutes({ userId = null, name, nameKey, minutes }) {
    db.prepare(`
      INSERT INTO minute_entries (id, user_id, name, name_key, minutes, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), userId, name, nameKey, Math.round(Number(minutes)), now());
    if (userId) touchUser(userId);
  }

  function stateForUser(userId) {
    const user = findUserById(userId);
    const assessment = db.prepare('SELECT payload, updated_at FROM assessments WHERE user_id = ?').get(userId);
    const progressRows = db.prepare('SELECT lesson_id, current_step, completed_at, updated_at FROM lesson_progress WHERE user_id = ?').all(userId);
    const toolkitRows = db.prepare('SELECT id, card_type, lesson_id, payload, created_at, updated_at FROM toolkit_cards WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
    const minuteRow = db.prepare('SELECT COALESCE(sum(minutes), 0) AS total_minutes, count(*) AS entries FROM minute_entries WHERE user_id = ?').get(userId);
    return {
      user,
      assessment: assessment ? { ...JSON.parse(assessment.payload), updatedAt: assessment.updated_at } : null,
      progress: progressRows.map(row => ({
        lessonId: row.lesson_id,
        currentStep: row.current_step,
        completedAt: row.completed_at || '',
        updatedAt: row.updated_at
      })),
      toolkit: toolkitRows.map(row => ({
        id: row.id,
        cardType: row.card_type,
        lessonId: row.lesson_id,
        payload: JSON.parse(row.payload),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      minutes: {
        totalMinutes: Number(minuteRow?.total_minutes || 0),
        entries: Number(minuteRow?.entries || 0)
      }
    };
  }

  function leaderboard() {
    return db.prepare(`
      SELECT name, name_key AS nameKey, sum(minutes) AS totalMinutes, count(*) AS entries, max(created_at) AS lastSubmittedAt
      FROM minute_entries
      GROUP BY name_key
      ORDER BY totalMinutes DESC, name ASC
    `).all();
  }

  function adminLearners() {
    return db.prepare(`
      SELECT
        users.id,
        users.email,
        users.display_name AS displayName,
        users.disabled,
        users.created_at AS createdAt,
        users.last_active_at AS lastActiveAt,
        COALESCE(sum(minute_entries.minutes), 0) AS totalMinutes,
        count(DISTINCT lesson_progress.lesson_id) AS startedLessons,
        count(DISTINCT CASE WHEN lesson_progress.completed_at IS NOT NULL THEN lesson_progress.lesson_id END) AS completedLessons,
        count(DISTINCT interactions.id) AS interactions,
        count(DISTINCT toolkit_cards.id) AS toolkitCards
      FROM users
      LEFT JOIN minute_entries ON minute_entries.user_id = users.id
      LEFT JOIN lesson_progress ON lesson_progress.user_id = users.id
      LEFT JOIN interactions ON interactions.user_id = users.id
      LEFT JOIN toolkit_cards ON toolkit_cards.user_id = users.id
      GROUP BY users.id
      ORDER BY users.last_active_at DESC
    `).all().map(row => ({ ...row, disabled: Boolean(row.disabled) }));
  }

  function adminLearner(id) {
    const user = findUserById(id);
    return user ? stateForUser(id) : null;
  }

  function lessonAnalytics() {
    return db.prepare(`
      SELECT
        lesson_id AS lessonId,
        count(DISTINCT user_id) AS learnersStarted,
        count(DISTINCT CASE WHEN completed_at IS NOT NULL THEN user_id END) AS learnersCompleted,
        max(updated_at) AS lastActivityAt
      FROM lesson_progress
      GROUP BY lesson_id
      ORDER BY lesson_id
    `).all();
  }

  function accountAction({ userId, action, displayName }) {
    if (action === 'disable') db.prepare('UPDATE users SET disabled = 1, updated_at = ? WHERE id = ?').run(now(), userId);
    if (action === 'enable') db.prepare('UPDATE users SET disabled = 0, updated_at = ? WHERE id = ?').run(now(), userId);
    if (action === 'rename') db.prepare('UPDATE users SET display_name = ?, updated_at = ? WHERE id = ?').run(displayName, now(), userId);
    if (action === 'delete') db.prepare('DELETE FROM users WHERE id = ?').run(userId);
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
