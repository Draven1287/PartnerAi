import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const DATA_FILE = process.env.DATA_FILE || join(__dirname, 'data', 'minutes.json');
const BUILD_SHA = process.env.BUILD_SHA || process.env.COOLIFY_GIT_COMMIT_SHA || 'local';
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const SESSION_DAYS = 30;
const ADMIN_SESSION_HOURS = 8;
const PASSWORD_RESET_MINUTES = 60;
const DEFAULT_ORIGINS = [
  'https://learningai4you.com',
  'https://www.learningai4you.com',
  'https://api.learningai4you.com',
  'http://127.0.0.1:8787',
  'http://localhost:8787',
  'http://127.0.0.1:8123',
  'http://127.0.0.1:8124',
  'http://127.0.0.1:8125',
  'http://127.0.0.1:8126',
  'http://127.0.0.1:8127',
  'http://localhost:8123',
  'http://localhost:8124',
  'http://localhost:8125',
  'http://localhost:8126',
  'http://localhost:8127'
];
const ALLOWED_ORIGINS = new Set(String(process.env.CORS_ORIGINS || DEFAULT_ORIGINS.join(',')).split(',').map(origin => origin.trim()).filter(Boolean));
const RATE_LIMITS = new Map();
const scrypt = promisify(scryptCallback);
const LESSON_STATUSES = new Set(['draft', 'published', 'locked']);
const LESSON_LEVELS = new Set(['foundation', 'explorer', 'builder']);
const STEP_KINDS = new Set(['coldOpen', 'classify', 'reveal', 'compare', 'promptRepair', 'nextWord', 'tryLive', 'toolkitSave', 'exitCheck', 'verify', 'biasSpot', 'workflowChain', 'agentDesign', 'evalTest']);

if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_PASSWORD) throw new Error('DATABASE_URL or POSTGRES_PASSWORD is required in production');
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is required in production');
  if (!process.env.ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is required in production');
  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) throw new Error('ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is required in production');
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function nameKey(name) {
  return normalizeName(name).toLowerCase();
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isSafeEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
}

function isSafeName(name) {
  if (name.length < 1 || name.length > 40) return false;
  if (/https?:\/\//i.test(name) || /www\./i.test(name)) return false;
  return !/[\u0000-\u001f<>]/.test(name);
}

function isSafePassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 200;
}

function isSafeLessonId(lessonId) {
  return /^chapter-[1-9]\d{0,2}$/.test(String(lessonId || ''));
}

function safeText(value, max) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

function validateLessonPatch(body) {
  if (!body || typeof body !== 'object') return null;
  const patch = {};
  if ('title' in body) {
    patch.title = safeText(body.title, 180);
    if (!patch.title) return null;
  }
  if ('arc' in body) {
    patch.arc = safeText(body.arc, 120);
    if (!patch.arc) return null;
  }
  if ('coreQuestion' in body) patch.coreQuestion = safeText(body.coreQuestion, 240);
  if ('blurb' in body) patch.blurb = safeText(body.blurb, 360);
  if ('status' in body) {
    patch.status = String(body.status || '');
    if (!LESSON_STATUSES.has(patch.status)) return null;
  }
  if ('levelId' in body) {
    patch.levelId = String(body.levelId || '');
    if (!LESSON_LEVELS.has(patch.levelId)) return null;
  }
  if ('sortOrder' in body) {
    patch.sortOrder = Number(body.sortOrder);
    if (!Number.isFinite(patch.sortOrder)) return null;
  }
  if ('minutes' in body) {
    patch.minutes = Number(body.minutes);
    if (!Number.isFinite(patch.minutes) || patch.minutes < 1 || patch.minutes > 60) return null;
  }
  if ('resources' in body) {
    if (!Array.isArray(body.resources)) return null;
    patch.resources = body.resources.slice(0, 20).map(resource => ({
      label: safeText(resource?.label, 160),
      url: String(resource?.url || '').trim().slice(0, 500)
    }));
    if (patch.resources.some(resource => resource.label && !/^https:\/\//i.test(resource.url))) return null;
  }
  return patch;
}

function validateNewLesson(body) {
  const patch = validateLessonPatch(body);
  if (!patch?.title || !patch?.arc) return null;
  const num = Number(body?.num);
  if ('num' in (body || {}) && (!Number.isInteger(num) || num < 1 || num > 999)) return null;
  const lessonId = body?.id ? String(body.id).trim() : '';
  if (lessonId && !isSafeLessonId(lessonId)) return null;
  return {
    ...patch,
    id: lessonId || null,
    num: Number.isInteger(num) ? num : null,
    status: patch.status || 'draft',
    levelId: patch.levelId || (Number.isInteger(num) ? (num >= 25 ? 'builder' : num >= 10 ? 'explorer' : 'foundation') : 'foundation'),
    minutes: Number.isFinite(Number(patch.minutes)) ? patch.minutes : 8,
    coreQuestion: patch.coreQuestion || '',
    blurb: patch.blurb || ''
  };
}

function validateSteps(body) {
  const steps = Array.isArray(body?.steps) ? body.steps : null;
  if (!steps || steps.length > 80) return null;
  return steps.map((step, index) => {
    const kind = String(step?.kind || '');
    if (!STEP_KINDS.has(kind)) return null;
    const payload = step?.payload && typeof step.payload === 'object' && !Array.isArray(step.payload) ? step.payload : {};
    return {
      stepIndex: index,
      stepId: safeText(step.stepId || '', 160),
      kind,
      gated: Boolean(step.gated),
      title: safeText(step.title || payload.title || '', 180),
      sortOrder: Number.isFinite(Number(step.sortOrder)) ? Number(step.sortOrder) : index,
      payload
    };
  });
}

function validateQuizAnswer(body) {
  if (!body || typeof body !== 'object' || !isSafeLessonId(body.lessonId)) return null;
  const stepIndex = Number(body.stepIndex);
  if (!Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 200) return null;
  const answer = body.answer && typeof body.answer === 'object' && !Array.isArray(body.answer) ? body.answer : { value: body.answer ?? null };
  return {
    lessonId: String(body.lessonId),
    stepIndex,
    quizKey: safeText(body.quizKey || '', 120),
    answer,
    correct: typeof body.correct === 'boolean' ? body.correct : null,
    feedback: safeText(body.feedback || '', 1000)
  };
}

function validateActivityCompletion(body) {
  if (!body || typeof body !== 'object' || !isSafeLessonId(body.lessonId)) return null;
  const stepIndex = Number(body.stepIndex);
  if (!Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 200) return null;
  const activityKind = safeText(body.activityKind || 'activity', 80);
  if (!activityKind || /[^a-zA-Z0-9_-]/.test(activityKind)) return null;
  const payload = body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload) ? body.payload : {};
  return {
    lessonId: String(body.lessonId),
    stepIndex,
    activityKind,
    activityKey: safeText(body.activityKey || '', 120),
    payload
  };
}

function validateFeedbackRequest(body) {
  if (!body || typeof body !== 'object') return null;
  const lessonId = body.lessonId ? String(body.lessonId) : null;
  if (lessonId && !isSafeLessonId(lessonId)) return null;
  const stepIndex = body.stepIndex == null ? null : Number(body.stepIndex);
  if (stepIndex != null && (!Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 200)) return null;
  const prompt = body.prompt && typeof body.prompt === 'object' && !Array.isArray(body.prompt) ? body.prompt : { text: safeText(body.prompt || body.text || '', 2000) };
  return {
    lessonId,
    stepIndex,
    requestType: safeText(body.requestType || 'feedback', 80),
    prompt
  };
}

function validateProjectReview(body) {
  if (!body || typeof body !== 'object') return null;
  const title = safeText(body.title || '', 180);
  if (!title) return null;
  const projectUrl = String(body.projectUrl || '').trim().slice(0, 500);
  if (projectUrl && !/^https:\/\//i.test(projectUrl)) return null;
  const artifact = body.artifact && typeof body.artifact === 'object' && !Array.isArray(body.artifact) ? body.artifact : {};
  return { title, projectUrl, artifact };
}

function validateTutorSession(body) {
  if (!body || typeof body !== 'object') return null;
  const lessonId = body.lessonId ? String(body.lessonId) : null;
  if (lessonId && !isSafeLessonId(lessonId)) return null;
  const topic = safeText(body.topic || '', 180);
  if (!topic) return null;
  return { lessonId, topic };
}

function validateTutorMessage(body) {
  if (!body || typeof body !== 'object') return null;
  const content = String(body.content || '').trim().slice(0, 4000);
  if (!content) return null;
  const metadata = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata) ? body.metadata : {};
  return { role: 'learner', content, metadata };
}

function hashToken(token) {
  return createHash('sha256').update(String(process.env.SESSION_SECRET || 'dev-secret')).update(':').update(token).digest('hex');
}

function randomToken() {
  return randomBytes(32).toString('base64url');
}

function expiresAt(days = SESSION_DAYS) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function adminExpiresAt() {
  return new Date(Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000).toISOString();
}

function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '')
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const index = part.indexOf('=');
      return index === -1 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
    }));
}

function cookie(name, value, maxAgeSeconds, { httpOnly = true } = {}) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const sameSite = '; SameSite=Lax';
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}${httpOnly ? '; HttpOnly' : ''}${secure}${sameSite}`;
}

function clearCookie(name) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=; Path=/; Max-Age=0; HttpOnly${secure}; SameSite=Lax`;
}

function htmlEscape(value) {
  return String(value == null ? '' : value).replace(/[&<>"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
}

function corsOrigin(req) {
  const origin = req?.headers?.origin;
  if (!origin) return '';
  return ALLOWED_ORIGINS.has(origin) ? origin : '';
}

function sendJson(res, status, data, options = {}) {
  const origin = corsOrigin(options.req);
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-methods': 'GET,POST,PUT,OPTIONS',
    'access-control-allow-headers': 'content-type,x-csrf-token',
    'access-control-allow-credentials': 'true',
    'vary': 'Origin',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'same-origin'
  };
  if (origin) headers['access-control-allow-origin'] = origin;
  if (options.cookie) headers['set-cookie'] = Array.isArray(options.cookie) ? options.cookie : [options.cookie];
  res.writeHead(status, headers);
  if (status === 204) return res.end();
  return res.end(JSON.stringify(data));
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'same-origin',
    'x-frame-options': 'DENY',
    'content-security-policy': "default-src 'self'; style-src 'unsafe-inline' 'self'; script-src 'unsafe-inline' 'self'; connect-src 'self'"
  });
  res.end(html);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 256_000) {
        reject(new Error('request_too_large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function readJsonBody(req) {
  try {
    return JSON.parse(await readBody(req) || '{}');
  } catch {
    return null;
  }
}

async function verifyPassword(password, stored) {
  if (!stored) return false;
  if (String(stored).startsWith('scrypt:')) {
    const [, salt, hash] = String(stored).split(':');
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, 'base64url');
    const actual = await scrypt(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.compare(password, stored);
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url');
  const hash = await scrypt(String(password), salt, 64);
  return `scrypt:${salt}:${Buffer.from(hash).toString('base64url')}`;
}

function clientIp(req) {
  return String(req.socket.remoteAddress || 'unknown');
}

function rateLimit(req, key, limit, windowMs) {
  const bucketKey = `${key}:${clientIp(req)}`;
  const now = Date.now();
  const bucket = RATE_LIMITS.get(bucketKey) || { count: 0, resetAt: now + windowMs };
  if (bucket.resetAt <= now) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }
  bucket.count += 1;
  RATE_LIMITS.set(bucketKey, bucket);
  if (RATE_LIMITS.size > 5000) {
    for (const [storedKey, storedBucket] of RATE_LIMITS) {
      if (storedBucket.resetAt <= now || RATE_LIMITS.size > 4500) RATE_LIMITS.delete(storedKey);
      if (RATE_LIMITS.size <= 4500) break;
    }
  }
  return bucket.count <= limit;
}

function requireTrustedOrigin(req, res) {
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    sendJson(res, 403, { ok: false, error: 'origin_not_allowed' }, { req });
    return false;
  }
  return true;
}

function csrfOk(req, session) {
  const token = String(req.headers['x-csrf-token'] || '');
  return Boolean(token && session?.csrf_token_hash && hashToken(token) === session.csrf_token_hash);
}

async function readRows(dataFile = DATA_FILE) {
  try {
    const raw = await readFile(dataFile, 'utf8');
    const rows = JSON.parse(raw);
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function writeRows(rows, dataFile = DATA_FILE) {
  await mkdir(dirname(dataFile), { recursive: true });
  await writeFile(dataFile, JSON.stringify(rows, null, 2));
}

function summarize(rows) {
  const totals = new Map();
  for (const row of rows) {
    const key = row.nameKey || nameKey(row.name);
    const current = totals.get(key) || { name: row.name, nameKey: key, totalMinutes: 0, entries: 0, lastSubmittedAt: '' };
    current.totalMinutes += Number(row.minutes || 0);
    current.entries += 1;
    current.lastSubmittedAt = !current.lastSubmittedAt || row.createdAt > current.lastSubmittedAt ? row.createdAt : current.lastSubmittedAt;
    totals.set(key, current);
  }
  return [...totals.values()].sort((a, b) => b.totalMinutes - a.totalMinutes || a.name.localeCompare(b.name));
}

function mergeLeaderboards(...lists) {
  const merged = new Map();
  lists.flat().forEach(row => {
    if (!row) return;
    const key = row.nameKey || nameKey(row.name);
    const current = merged.get(key) || { name: row.name, nameKey: key, totalMinutes: 0, entries: 0, lastSubmittedAt: '' };
    current.totalMinutes += Number(row.totalMinutes || 0);
    current.entries += Number(row.entries || 0);
    current.lastSubmittedAt = !current.lastSubmittedAt || row.lastSubmittedAt > current.lastSubmittedAt ? row.lastSubmittedAt : current.lastSubmittedAt;
    merged.set(key, current);
  });
  return [...merged.values()].sort((a, b) => b.totalMinutes - a.totalMinutes || a.name.localeCompare(b.name));
}

async function requireUser(req, res, db, { csrf = false } = {}) {
  const token = parseCookies(req).lai_session;
  const session = await db.sessionForToken('learner', hashToken(token || ''));
  if (!session) {
    sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
    return null;
  }
  if (csrf && !csrfOk(req, session.session)) {
    sendJson(res, 403, { ok: false, error: 'csrf_required' }, { req });
    return null;
  }
  return session;
}

async function requireAdmin(req, res, db, { csrf = false } = {}) {
  const token = parseCookies(req).lai_admin_session;
  const session = await db.sessionForToken('admin', hashToken(token || ''));
  if (!session) {
    sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
    return null;
  }
  if (csrf && !csrfOk(req, session.session)) {
    sendJson(res, 403, { ok: false, error: 'csrf_required' }, { req });
    return null;
  }
  return session;
}

async function handleSignup(req, res, db) {
  if (!rateLimit(req, 'signup', 10, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const displayName = normalizeName(body.displayName || email.split('@')[0]);
  if (!isSafeEmail(email)) return sendJson(res, 400, { ok: false, error: 'invalid_email' }, { req });
  if (!isSafePassword(password)) return sendJson(res, 400, { ok: false, error: 'invalid_password' }, { req });
  if (!isSafeName(displayName)) return sendJson(res, 400, { ok: false, error: 'invalid_display_name' }, { req });
  if (await db.findUserByEmail(email)) return sendJson(res, 409, { ok: false, error: 'email_exists' }, { req });
  const user = await db.createUser({ email, passwordHash: await hashPassword(password), displayName });
  const sessionToken = randomToken();
  const csrfToken = randomToken();
  await db.createSession({ kind: 'learner', userId: user.id, tokenHash: hashToken(sessionToken), csrfTokenHash: hashToken(csrfToken), expiresAt: expiresAt() });
  return sendJson(res, 201, { ok: true, user, csrfToken }, { req, cookie: cookie('lai_session', sessionToken, SESSION_DAYS * 24 * 60 * 60) });
}

async function handleLogin(req, res, db) {
  if (!rateLimit(req, 'login', 15, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const userRow = await db.findUserByEmail(normalizeEmail(body.email));
  if (!userRow || userRow.disabled || !(await verifyPassword(String(body.password || ''), userRow.password_hash))) {
    return sendJson(res, 401, { ok: false, error: 'invalid_login' }, { req });
  }
  const user = await db.findUserById(userRow.id);
  const sessionToken = randomToken();
  const csrfToken = randomToken();
  await db.createSession({ kind: 'learner', userId: user.id, tokenHash: hashToken(sessionToken), csrfTokenHash: hashToken(csrfToken), expiresAt: expiresAt() });
  return sendJson(res, 200, { ok: true, user, csrfToken }, { req, cookie: cookie('lai_session', sessionToken, SESSION_DAYS * 24 * 60 * 60) });
}

async function handleLogout(req, res, db) {
  const token = parseCookies(req).lai_session;
  if (token) await db.deleteSession(hashToken(token));
  return sendJson(res, 200, { ok: true }, { req, cookie: clearCookie('lai_session') });
}

async function handleAdminLogin(req, res, db) {
  if (!rateLimit(req, 'admin-login', 10, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const adminRow = await db.findAdminByEmail(normalizeEmail(body.email));
  if (!adminRow || adminRow.disabled || !(await verifyPassword(String(body.password || ''), adminRow.password_hash))) {
    return sendJson(res, 401, { ok: false, error: 'invalid_login' }, { req });
  }
  const admin = await db.findAdminById(adminRow.id);
  const sessionToken = randomToken();
  const csrfToken = randomToken();
  await db.createSession({ kind: 'admin', adminUserId: admin.id, tokenHash: hashToken(sessionToken), csrfTokenHash: hashToken(csrfToken), expiresAt: adminExpiresAt() });
  await db.audit({ adminUserId: admin.id, eventName: 'admin_login' });
  return sendJson(res, 200, { ok: true, admin, csrfToken }, { req, cookie: cookie('lai_admin_session', sessionToken, ADMIN_SESSION_HOURS * 60 * 60) });
}

async function handleAdminLogout(req, res, db) {
  const token = parseCookies(req).lai_admin_session;
  if (token) await db.deleteSession(hashToken(token));
  return sendJson(res, 200, { ok: true }, { req, cookie: clearCookie('lai_admin_session') });
}

async function handlePasswordResetRequest(req, res, db) {
  if (!rateLimit(req, 'password-reset-request', 5, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const email = normalizeEmail(body.email);
  const token = randomToken();
  let created = null;
  if (isSafeEmail(email)) {
    created = await db.createPasswordResetToken({
      email,
      tokenHash: hashToken(token),
      expiresAt: minutesFromNow(PASSWORD_RESET_MINUTES)
    });
  }
  const payload = { ok: true, message: 'If this email exists, a password reset can be completed with the provided reset token.' };
  if (created && process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_RESET_TOKEN_RETURN === 'true') payload.resetToken = token;
  return sendJson(res, 200, payload, { req });
}

async function handlePasswordResetConfirm(req, res, db) {
  if (!rateLimit(req, 'password-reset-confirm', 8, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const token = String(body.token || '').trim();
  const password = String(body.password || '');
  if (!/^[A-Za-z0-9_-]{24,200}$/.test(token)) return sendJson(res, 400, { ok: false, error: 'invalid_reset_token' }, { req });
  if (!isSafePassword(password)) return sendJson(res, 400, { ok: false, error: 'invalid_password' }, { req });
  const reset = await db.confirmPasswordReset({ tokenHash: hashToken(token), passwordHash: await hashPassword(password) });
  return reset ? sendJson(res, 200, { ok: true }, { req }) : sendJson(res, 400, { ok: false, error: 'invalid_reset_token' }, { req });
}

async function handleV1Minutes(req, res, db, dataFile, dbReady = true) {
  if (!rateLimit(req, 'minutes', 120, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  if (body.consent !== true) return sendJson(res, 400, { ok: false, error: 'consent_required' }, { req });
  const name = normalizeName(body.name);
  const minutes = Number(body.minutes);
  if (!isSafeName(name)) return sendJson(res, 400, { ok: false, error: 'invalid_name' }, { req });
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 300) return sendJson(res, 400, { ok: false, error: 'invalid_minutes' }, { req });
  if (dbReady) {
    const userSession = await db.sessionForToken('learner', hashToken(parseCookies(req).lai_session || ''));
    await db.addMinutes({ userId: userSession?.user?.id || null, name, nameKey: nameKey(name), minutes, source: 'v1' });
    return sendJson(res, 201, { ok: true }, { req });
  }
  const rows = await readRows(dataFile);
  rows.push({ id: randomUUID(), name, nameKey: nameKey(name), minutes: Math.round(minutes), createdAt: nowIso(), fallback: true });
  await writeRows(rows, dataFile);
  return sendJson(res, 201, { ok: true, fallback: 'legacy_json' }, { req });
}

function csvEscape(value) {
  return `"${String(value == null ? '' : value).replaceAll('"', '""')}"`;
}

function learnerCsv(rows) {
  return ['email,displayName,totalMinutes,visitCount,currentLesson,completionPercent,lastActiveAt', ...rows.map(row => [
    row.email,
    row.displayName,
    row.totalMinutes,
    row.visitCount,
    row.currentLesson,
    row.completionPercent,
    row.lastActiveAt || ''
  ].map(csvEscape).join(','))].join('\n');
}

function adminHtml() {
  const localAdminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const localAdminPassword = process.env.ADMIN_PASSWORD || 'learning-ai-admin-pass';
  const localAdminHint = process.env.NODE_ENV === 'production' ? '' : `
    <p class="notice dev-login"><strong>Local dev login:</strong><br>
      Email: <code>${htmlEscape(localAdminEmail)}</code><br>
      Password: <code>${htmlEscape(localAdminPassword)}</code>
    </p>`;
  const localAdminScript = process.env.NODE_ENV === 'production' ? 'null' : JSON.stringify({
    email: localAdminEmail,
    password: localAdminPassword
  });
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Learning AI Admin</title>
  <style>
    :root { --bg:#f7f9fc; --surface:#fff; --surface-2:#eef4f8; --border:#dbe3ea; --text:#121826; --dim:#4b5870; --faint:#7a869a; --accent:#2563eb; --accent-soft:#e9efff; --good:#0f8a66; --bad:#b42318; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Inter",system-ui,"Segoe UI",sans-serif; font-size:16px; }
    body.admin-dark { --bg:#111827; --surface:#172033; --surface-2:#22304a; --border:#334155; --text:#f8fafc; --dim:#c7d2e3; --faint:#94a3b8; --accent-soft:rgba(96,165,250,.18); }
    body.admin-contrast { --bg:#ffffff; --surface:#ffffff; --surface-2:#f1f5f9; --border:#94a3b8; --text:#020617; --dim:#334155; --faint:#475569; --accent-soft:#dbeafe; }
    body.admin-compact { font-size:14px; }
    .shell { display:grid; grid-template-columns:minmax(220px,260px) minmax(0,1fr); min-height:100vh; }
    aside { background:var(--surface); border-right:1px solid var(--border); padding:28px 22px; min-width:0; }
    main { min-width:0; padding:clamp(20px,4vw,36px); }
    h1 { margin:0 0 4px; font-size:clamp(36px,5vw,56px); letter-spacing:0; line-height:1; overflow-wrap:anywhere; }
    h2 { margin:0 0 18px; font-size:24px; line-height:1.15; overflow-wrap:anywhere; }
    p { color:var(--dim); line-height:1.5; }
    .brand { font-weight:800; font-size:20px; line-height:1.15; margin-bottom:34px; overflow-wrap:anywhere; }
    .nav button { display:block; width:100%; border:0; background:transparent; text-align:left; padding:12px; border-radius:8px; color:var(--dim); font:inherit; cursor:pointer; }
    .nav button.active { color:var(--accent); background:var(--accent-soft); }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:22px; box-shadow:0 12px 34px rgba(18,24,38,.045); margin:22px 0; min-width:0; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; }
    .stat strong { display:block; font-size:32px; }
    input, select, textarea { width:100%; min-width:0; padding:12px 14px; border:1px solid var(--border); border-radius:8px; font:inherit; background:var(--surface); color:var(--text); }
    textarea { min-height:220px; resize:vertical; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:13px; line-height:1.45; }
    button, .btn { border:0; border-radius:8px; padding:12px 16px; background:var(--accent); color:#fff; font-weight:700; cursor:pointer; font:inherit; }
    button.secondary { background:var(--surface-2); color:var(--text); }
    button.danger { background:#b42318; }
    .table-wrap { overflow-x:auto; max-width:100%; }
    table { width:100%; min-width:820px; border-collapse:collapse; }
    th, td { padding:12px; border-bottom:1px solid var(--border); text-align:left; vertical-align:top; }
    th { color:var(--faint); font-size:12px; text-transform:uppercase; letter-spacing:.08em; }
    td { overflow-wrap:anywhere; }
    .cell-title { max-width:260px; }
    .row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
    .row > * { flex:1 1 180px; }
    .row h2 { flex:999 1 280px; }
    .row .pill { flex:0 0 auto; }
    .toolbar { display:grid; grid-template-columns:minmax(220px,1fr) auto; gap:12px; align-items:center; margin-bottom:16px; }
    .table-actions { display:flex; gap:8px; flex-wrap:wrap; }
    .table-actions button { padding:8px 10px; }
    .notice { border-left:4px solid var(--accent); background:var(--accent-soft); padding:12px 14px; border-radius:8px; }
    .dev-login { font-size:14px; }
    code { color:var(--text); font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
    .hidden { display:none !important; }
    .login { max-width:460px; margin:12vh auto; }
    .muted { color:var(--faint); }
    .pill { display:inline-block; background:var(--surface-2); border-radius:999px; padding:4px 10px; color:var(--dim); font-size:13px; white-space:nowrap; }
    .editor-grid { display:grid; grid-template-columns:minmax(260px,360px) minmax(560px,1fr); gap:18px; align-items:start; overflow-x:auto; }
    .lesson-list { max-height:640px; overflow:auto; }
    .lesson-list button { display:block; width:100%; margin:0 0 8px; background:var(--surface); color:var(--text); border:1px solid var(--border); text-align:left; font-weight:600; line-height:1.25; overflow-wrap:anywhere; }
    .lesson-list button.active { border-color:var(--accent); background:var(--accent-soft); color:var(--accent); }
    .form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
    .field-wide { grid-column:1 / -1; }
    label span { display:block; margin:0 0 6px; color:var(--dim); font-size:14px; font-weight:700; }
    .setting-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; }
    .swatches { display:flex; gap:10px; flex-wrap:wrap; margin-top:8px; }
    .swatch { width:38px; height:38px; border-radius:999px; border:3px solid var(--surface); box-shadow:0 0 0 1px var(--border); padding:0; }
    .swatch.active { box-shadow:0 0 0 3px var(--accent-soft), 0 0 0 5px var(--accent); }
    @media (max-width:1200px) { .editor-grid { grid-template-columns:1fr; overflow-x:visible; } }
    @media (max-width:850px) { .shell { grid-template-columns:1fr; } aside { border-right:0; border-bottom:1px solid var(--border); } .toolbar { grid-template-columns:1fr; } main { padding:22px; } h1 { font-size:34px; } }
    @media (max-width:850px) { .form-grid { grid-template-columns:1fr; } .field-wide { grid-column:auto; } }
  </style>
</head>
<body>
  <div id="login" class="login card">
    <h1>Admin Login</h1>
    <p>Use the admin account configured in Coolify. Admin tokens are no longer stored in the browser.</p>
    ${localAdminHint}
    <form id="login-form">
      <p><input name="email" type="email" autocomplete="username" placeholder="Admin email" required></p>
      <p><input name="password" type="password" autocomplete="current-password" placeholder="Password" required></p>
      <button type="submit">Sign in</button>
      <p id="login-message" class="muted"></p>
    </form>
  </div>
  <div id="app" class="shell hidden">
    <aside>
      <div class="brand">Learning AI Admin</div>
      <div class="nav">
        <button data-view="overview" class="active">Overview</button>
        <button data-view="learners">Learners</button>
        <button data-view="assessment">Questionnaire</button>
        <button data-view="lessons">Lessons</button>
        <button data-view="content">Content</button>
        <button data-view="export">Export</button>
        <button data-view="settings">Settings</button>
      </div>
      <p class="muted" id="build-marker"></p>
      <button class="secondary" id="logout">Sign out</button>
    </aside>
    <main>
      <h1 id="title">Overview</h1>
      <p id="subtitle">Server-backed learner progress and admin analytics.</p>
      <section id="content"></section>
    </main>
  </div>
<script>
let csrfToken = '';
let currentView = 'overview';
let selectedContentLessonId = '';
const localDevAdmin = ${localAdminScript};
const ADMIN_SETTINGS_KEY = 'learningai-admin-settings';
const defaultAdminSettings = { theme:'light', accent:'#2563eb', density:'comfortable' };
const app = document.getElementById('app');
const login = document.getElementById('login');
const content = document.getElementById('content');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
function readAdminSettings() {
  try { return { ...defaultAdminSettings, ...JSON.parse(localStorage.getItem(ADMIN_SETTINGS_KEY) || '{}') }; }
  catch (error) { return { ...defaultAdminSettings }; }
}
function saveAdminSettings(settings) {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
  applyAdminSettings(settings);
}
function applyAdminSettings(settings = readAdminSettings()) {
  document.documentElement.style.setProperty('--accent', settings.accent || defaultAdminSettings.accent);
  document.body.classList.toggle('admin-dark', settings.theme === 'dark');
  document.body.classList.toggle('admin-contrast', settings.theme === 'contrast');
  document.body.classList.toggle('admin-compact', settings.density === 'compact');
}
async function api(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) };
  if (method !== 'GET' && csrfToken) headers['x-csrf-token'] = csrfToken;
  const res = await fetch(path, { method, headers, credentials:'include', body: options.body ? JSON.stringify(options.body) : undefined });
  const body = await res.json().catch(() => ({}));
  if (body.csrfToken) csrfToken = body.csrfToken;
  return { status: res.status, ok: res.ok && body.ok !== false, ...body };
}
function esc(value) { return String(value == null ? '' : value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function fmtDate(value) { return value ? new Date(value).toLocaleString() : ''; }
async function boot() {
  const me = await api('/api/admin/me');
  if (me.ok) showApp(me); else showLogin();
}
function fillLocalDevLogin() {
  if (!localDevAdmin) return;
  const form = document.getElementById('login-form');
  form.elements.email.value = localDevAdmin.email;
  form.elements.password.value = localDevAdmin.password;
}
function showLogin() { fillLocalDevLogin(); login.classList.remove('hidden'); app.classList.add('hidden'); }
function showApp(me) { login.classList.add('hidden'); app.classList.remove('hidden'); document.getElementById('build-marker').textContent = 'Build ' + (me.build?.buildSha || 'unknown') + ' / migration ' + (me.build?.migrationVersion || 'unknown'); render(); }
document.getElementById('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const msg = document.getElementById('login-message');
  msg.textContent = 'Signing in...';
  const result = await api('/api/admin/login', { method:'POST', body:data });
  if (!result.ok) { msg.textContent = result.error || 'Could not sign in.'; return; }
  showApp(result);
});
document.getElementById('logout').addEventListener('click', async () => { await api('/api/admin/logout', { method:'POST' }); csrfToken=''; showLogin(); });
document.querySelectorAll('.nav button').forEach(btn => btn.addEventListener('click', () => { currentView = btn.dataset.view; document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b === btn)); render(); }));
async function render() {
  if (currentView === 'overview') return renderOverview();
  if (currentView === 'learners') return renderLearners();
  if (currentView === 'assessment') return renderAssessmentAnalytics();
  if (currentView === 'lessons') return renderLessons();
  if (currentView === 'content') return renderContentEditor();
  if (currentView === 'export') return renderExport();
  if (currentView === 'settings') return renderSettings();
}
async function renderOverview() {
  title.textContent = 'Overview'; subtitle.textContent = 'Account-backed learner progress.';
  const [learners, lessons] = await Promise.all([api('/api/admin/learners'), api('/api/admin/lesson-analytics')]);
  const rows = learners.learners || [];
  const totalMinutes = rows.reduce((s,r)=>s + Number(r.totalMinutes||0),0);
  const active = rows.filter(r=>r.lastActiveAt).length;
  content.innerHTML = '<div class="notice"><strong>Backend-first V2.</strong> Data comes from PostgreSQL. V1 remains public while V2 is hidden.</div>' +
    '<div class="grid">' +
    '<div class="card stat"><strong>'+rows.length+'</strong>Learners</div>' +
    '<div class="card stat"><strong>'+totalMinutes+'</strong>Total minutes</div>' +
    '<div class="card stat"><strong>'+active+'</strong>Active learners</div>' +
    '<div class="card stat"><strong>'+((lessons.lessons||[]).filter(l=>l.learnersCompleted>0).length)+'</strong>Lessons completed</div>' +
    '</div>';
}
async function renderLearners() {
  title.textContent = 'Learners'; subtitle.textContent = 'Server-saved accounts, minutes, progress, and last active time.';
  const result = await api('/api/admin/learners');
  const rows = result.learners || [];
  content.innerHTML = '<div class="card"><div class="toolbar"><input id="search" placeholder="Search learners"><button id="refresh">Refresh</button></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Minutes</th><th>Progress</th><th>Current</th><th>Visits</th><th>Last active</th><th>Actions</th></tr></thead><tbody id="learner-rows"></tbody></table></div></div>';
  const tbody = document.getElementById('learner-rows');
  function draw(filter='') {
    tbody.innerHTML = rows.filter(r => (r.displayName + ' ' + r.email).toLowerCase().includes(filter.toLowerCase())).map(r => '<tr>'+
      '<td>'+esc(r.displayName)+(r.disabled?' <span class="pill">disabled</span>':'')+'</td><td>'+esc(r.email)+'</td><td>'+esc(r.totalMinutes)+'</td><td>'+esc(r.completionPercent)+'%</td><td>'+esc(r.currentLesson || '')+'</td><td>'+esc(r.visitCount)+'</td><td>'+esc(fmtDate(r.lastActiveAt))+'</td><td><div class="table-actions"><button class="secondary" data-detail="'+esc(r.id)+'">Details</button><button class="secondary" data-id="'+esc(r.id)+'" data-action="'+(r.disabled?'enable':'disable')+'">'+(r.disabled?'Enable':'Disable')+'</button></div></td></tr>').join('');
    tbody.querySelectorAll('button[data-detail]').forEach(btn => btn.addEventListener('click', () => renderLearnerDetail(btn.dataset.detail)));
    tbody.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', async () => { await accountAction({ userId:btn.dataset.id, action:btn.dataset.action }); renderLearners(); }));
  }
  document.getElementById('search').addEventListener('input', e => draw(e.target.value));
  document.getElementById('refresh').addEventListener('click', renderLearners);
  draw();
}
async function renderAssessmentAnalytics() {
  title.textContent = 'Questionnaire';
  subtitle.textContent = 'Age ranges, question answers, averages, and audience patterns.';
  const result = await api('/api/admin/assessment-analytics');
  if (!result.ok) {
    content.innerHTML = '<div class="card"><p>Could not load questionnaire analytics.</p></div>';
    return;
  }
  const analytics = result.analytics || {};
  const attempts = analytics.attempts || [];
  const responses = analytics.responses || [];
  const byQuestion = analytics.summaryByQuestion || [];
  const byAnswer = analytics.summaryByAnswer || [];
  const byAge = analytics.summaryByAge || [];
  const avgScore = attempts.length ? Math.round(attempts.reduce((sum,row)=>sum + Number(row.scorePercent || 0), 0) / attempts.length) : 0;
  const commonAge = byAge[0]?.ageRange || 'none yet';
  content.innerHTML =
    '<div class="grid">' +
      '<div class="card stat"><strong>'+esc(attempts.length)+'</strong>Completed questionnaires</div>' +
      '<div class="card stat"><strong>'+esc(avgScore)+'%</strong>Average score</div>' +
      '<div class="card stat"><strong>'+esc(responses.length)+'</strong>Total answers</div>' +
      '<div class="card stat"><strong>'+esc(commonAge)+'</strong>Most common age range</div>' +
    '</div>' +
    '<div class="card"><h2>Average by question</h2><div class="table-wrap"><table><thead><tr><th>Category</th><th>Question</th><th>Answers</th><th>Average score</th><th>Share</th></tr></thead><tbody>' +
      byQuestion.map(row => '<tr><td>'+esc(row.category)+'</td><td>'+esc(row.questionKey)+'</td><td>'+esc(row.responses)+'</td><td>'+esc(row.averageScore == null ? '' : row.averageScore)+'</td><td>'+esc(row.percentage)+'%</td></tr>').join('') +
    '</tbody></table></div></div>' +
    '<div class="card"><h2>Answer choices by age range</h2><div class="table-wrap"><table><thead><tr><th>Age range</th><th>Question</th><th>Answer</th><th>Count</th><th>Average score</th><th>Share</th></tr></thead><tbody>' +
      byAnswer.map(row => '<tr><td>'+esc(row.ageRange)+'</td><td>'+esc(row.questionKey)+'</td><td class="cell-title">'+esc(row.selectedLabel || row.selectedValue)+'</td><td>'+esc(row.responses)+'</td><td>'+esc(row.averageScore == null ? '' : row.averageScore)+'</td><td>'+esc(row.percentage)+'%</td></tr>').join('') +
    '</tbody></table></div></div>' +
    '<div class="card"><h2>Age range averages</h2><div class="table-wrap"><table><thead><tr><th>Age range</th><th>Questionnaires</th><th>Average score</th><th>Share</th></tr></thead><tbody>' +
      byAge.map(row => '<tr><td>'+esc(row.ageRange)+'</td><td>'+esc(row.attempts)+'</td><td>'+esc(row.averageScorePercent == null ? '' : row.averageScorePercent)+'%</td><td>'+esc(row.percentage)+'%</td></tr>').join('') +
    '</tbody></table></div></div>' +
    '<div class="card"><h2>Recent answers</h2><div class="table-wrap"><table><thead><tr><th>Learner</th><th>Age</th><th>Category</th><th>Question</th><th>Answer</th><th>Score</th><th>When</th></tr></thead><tbody>' +
      responses.slice(0, 200).map(row => '<tr><td>'+esc(row.displayName || row.email)+'</td><td>'+esc(row.ageRange)+'</td><td>'+esc(row.category)+'</td><td>'+esc(row.questionKey)+'</td><td class="cell-title">'+esc(row.selectedLabel || row.selectedValue)+'</td><td>'+esc(row.score == null ? '' : row.score)+'</td><td>'+esc(fmtDate(row.completedAt))+'</td></tr>').join('') +
    '</tbody></table></div><p class="muted">Free-text notes are stored but not shown in this summary table by default.</p></div>';
}
async function accountAction(body) {
  return api('/api/admin/account-action', { method:'POST', body });
}
async function renderLearnerDetail(id) {
  title.textContent = 'Learner Detail';
  subtitle.textContent = 'Account support, saved progress, visits, and recent interactions.';
  const result = await api('/api/admin/learner/' + encodeURIComponent(id));
  if (!result.ok || !result.learner) {
    content.innerHTML = '<div class="card"><p>Could not load learner.</p><p><button id="back-learners">Back to learners</button></p></div>';
    document.getElementById('back-learners').addEventListener('click', renderLearners);
    return;
  }
  const learner = result.learner;
  const user = learner.user || {};
  const progress = learner.progress || [];
  const visits = learner.visits || [];
  const interactions = learner.interactions || [];
  const questionnaire = learner.questionnaireResponses || [];
  content.innerHTML =
    '<div class="card">' +
      '<p><button id="back-learners" class="secondary">Back to learners</button></p>' +
      '<h2>'+esc(user.displayName || '')+'</h2>' +
      '<p>'+esc(user.email || '')+(user.disabled?' <span class="pill">disabled</span>':'')+'</p>' +
      '<div class="grid">' +
        '<div class="card stat"><strong>'+esc(learner.minutes?.totalMinutes || 0)+'</strong>Minutes</div>' +
        '<div class="card stat"><strong>'+esc(progress.filter(row=>row.completedAt).length)+'</strong>Completed lessons</div>' +
        '<div class="card stat"><strong>'+esc(learner.toolkit?.length || 0)+'</strong>Toolkit cards</div>' +
        '<div class="card stat"><strong>'+esc(visits.length)+'</strong>Recent visits</div>' +
      '</div>' +
      '<p class="row">' +
        '<button id="rename-user" class="secondary">Rename</button>' +
        '<button id="reset-password" class="secondary">Reset password</button>' +
        '<button id="toggle-disabled" class="secondary">'+(user.disabled?'Enable account':'Disable account')+'</button>' +
        '<button id="delete-user" class="danger">Delete account</button>' +
      '</p>' +
    '</div>' +
    '<div class="card"><h2>Questionnaire Answers</h2><div class="table-wrap"><table><thead><tr><th>Age range</th><th>Category</th><th>Question</th><th>Answer</th><th>Score</th><th>When</th></tr></thead><tbody>'+questionnaire.map(row => '<tr><td>'+esc(row.ageRange)+'</td><td>'+esc(row.category)+'</td><td>'+esc(row.questionKey)+'</td><td class="cell-title">'+esc(row.selectedLabel || row.selectedValue)+'</td><td>'+esc(row.score == null ? '' : row.score)+'</td><td>'+esc(fmtDate(row.completedAt))+'</td></tr>').join('')+'</tbody></table></div></div>' +
    '<div class="card"><h2>Progress</h2><div class="table-wrap"><table><thead><tr><th>Lesson</th><th>Step</th><th>Completed</th><th>Updated</th></tr></thead><tbody>'+progress.map(row => '<tr><td>'+esc(row.lessonId)+'</td><td>'+esc(row.currentStep)+'</td><td>'+esc(fmtDate(row.completedAt))+'</td><td>'+esc(fmtDate(row.updatedAt))+'</td></tr>').join('')+'</tbody></table></div></div>' +
    '<div class="card"><h2>Recent Visits</h2><div class="table-wrap"><table><thead><tr><th>Path</th><th>When</th><th>Seconds</th></tr></thead><tbody>'+visits.map(row => '<tr><td>'+esc(row.path)+'</td><td>'+esc(fmtDate(row.visited_at || row.visitedAt))+'</td><td>'+esc(row.duration_seconds || row.durationSeconds || '')+'</td></tr>').join('')+'</tbody></table></div></div>' +
    '<div class="card"><h2>Recent Interactions</h2><div class="table-wrap"><table><thead><tr><th>Lesson</th><th>Step</th><th>Kind</th><th>Correct</th><th>When</th></tr></thead><tbody>'+interactions.map(row => '<tr><td>'+esc(row.lesson_id || row.lessonId)+'</td><td>'+esc(row.step_index || row.stepIndex)+'</td><td>'+esc(row.interaction_kind || row.interactionKind)+'</td><td>'+esc(row.correct == null ? '' : row.correct)+'</td><td>'+esc(fmtDate(row.answered_at || row.answeredAt))+'</td></tr>').join('')+'</tbody></table></div></div>';
  document.getElementById('back-learners').addEventListener('click', renderLearners);
  document.getElementById('rename-user').addEventListener('click', async () => {
    const displayName = prompt('New display name', user.displayName || '');
    if (!displayName) return;
    const saved = await accountAction({ userId:id, action:'rename', displayName });
    if (saved.ok) renderLearnerDetail(id); else alert(saved.error || 'Could not rename account.');
  });
  document.getElementById('reset-password').addEventListener('click', async () => {
    const newPassword = prompt('Temporary new password, minimum 8 characters');
    if (!newPassword) return;
    const saved = await accountAction({ userId:id, action:'resetPassword', newPassword });
    if (saved.ok) alert('Password reset. Give the learner the temporary password privately.'); else alert(saved.error || 'Could not reset password.');
  });
  document.getElementById('toggle-disabled').addEventListener('click', async () => {
    const saved = await accountAction({ userId:id, action:user.disabled ? 'enable' : 'disable' });
    if (saved.ok) renderLearnerDetail(id); else alert(saved.error || 'Could not update account.');
  });
  document.getElementById('delete-user').addEventListener('click', async () => {
    if (!confirm('Delete this account? This disables login and removes the email from the active account.')) return;
    const saved = await accountAction({ userId:id, action:'delete' });
    if (saved.ok) renderLearners(); else alert(saved.error || 'Could not delete account.');
  });
}
async function renderLessons() {
  title.textContent = 'Lessons'; subtitle.textContent = 'Starts, completions, and difficult steps by lesson.';
  const result = await api('/api/admin/lesson-analytics');
  const rows = result.lessons || [];
  content.innerHTML = '<div class="card"><div class="table-wrap"><table><thead><tr><th>Lesson</th><th>Arc</th><th>Started</th><th>Completed</th><th>Interactions</th><th>Incorrect</th><th>Difficult steps</th><th>Last activity</th></tr></thead><tbody>' + rows.map(r => {
    const difficult = (r.difficultSteps || []).map(step => 'Step '+esc(Number(step.stepIndex) + 1)+' · '+esc(step.kind)+' · '+esc(step.incorrectRate)+'% wrong').join('<br>') || '<span class="muted">None yet</span>';
    return '<tr><td class="cell-title">'+esc(r.num)+'. '+esc(r.title)+'</td><td>'+esc(r.arc)+'</td><td>'+esc(r.learnersStarted)+'</td><td>'+esc(r.learnersCompleted)+'</td><td>'+esc(r.interactions)+'</td><td>'+esc(r.incorrectAnswers)+'</td><td>'+difficult+'</td><td>'+esc(fmtDate(r.lastActivityAt))+'</td></tr>';
  }).join('') + '</tbody></table></div></div>';
}
function stepForEditor(step) {
  return {
    stepId: step.stepId || '',
    kind: step.kind || 'reveal',
    gated: Boolean(step.gated),
    title: step.title || '',
    payload: step.payload || {}
  };
}
async function renderContentEditor() {
  title.textContent = 'Content';
  subtitle.textContent = 'Edit V2 lesson records stored in PostgreSQL. Startup seed data will not overwrite saved edits.';
  const result = await api('/api/admin/curriculum');
  if (!result.ok) {
    content.innerHTML = '<div class="card"><p>Could not load curriculum.</p></div>';
    return;
  }
  const lessons = (result.curriculum?.lessons || []).slice().sort((a,b)=>Number(a.num||0)-Number(b.num||0));
  if (!lessons.length) {
    content.innerHTML = '<div class="card"><p>No lessons found.</p></div>';
    return;
  }
  if (!selectedContentLessonId) selectedContentLessonId = lessons[0].id;
  const lesson = lessons.find(row => row.id === selectedContentLessonId) || lessons[0];
  selectedContentLessonId = lesson.id;
  const lessonButtons = lessons.map(row => '<button data-id="'+esc(row.id)+'" class="'+(row.id===lesson.id?'active':'')+'">'+esc(row.num)+'. '+esc(row.title)+' <span class="pill">'+esc(row.status || (row.stub ? 'locked' : 'published'))+'</span></button>').join('');
  const stepsJson = JSON.stringify((lesson.steps || []).map(stepForEditor), null, 2);
  content.innerHTML =
    '<div class="editor-grid">' +
      '<section class="card lesson-list"><div class="row"><h2>Lessons</h2><button id="new-lesson" class="secondary">New lesson</button></div>'+lessonButtons+'</section>' +
      '<section class="card">' +
        '<div class="row"><h2>'+esc(lesson.num)+'. '+esc(lesson.title)+'</h2><span class="pill">'+esc(lesson.id)+'</span></div>' +
        '<div class="form-grid">' +
          '<label><span>Title</span><input id="edit-title" value="'+esc(lesson.title)+'"></label>' +
          '<label><span>Arc</span><input id="edit-arc" value="'+esc(lesson.arc)+'"></label>' +
          '<label><span>Status</span><select id="edit-status"><option value="draft">draft</option><option value="published">published</option><option value="locked">locked</option></select></label>' +
          '<label><span>Level</span><select id="edit-level"><option value="foundation">foundation</option><option value="explorer">explorer</option><option value="builder">builder</option></select></label>' +
          '<label><span>Minutes</span><input id="edit-minutes" type="number" min="1" max="60" value="'+esc(lesson.minutes || 8)+'"></label>' +
          '<label class="field-wide"><span>Core question</span><input id="edit-core" value="'+esc(lesson.coreQuestion || '')+'"></label>' +
          '<label class="field-wide"><span>Blurb</span><input id="edit-blurb" value="'+esc(lesson.blurb || '')+'"></label>' +
          '<label class="field-wide"><span>Steps JSON</span><textarea id="edit-steps">'+esc(stepsJson)+'</textarea></label>' +
        '</div>' +
        '<p class="row"><button id="save-lesson">Save lesson</button><button id="save-steps" class="secondary">Save steps</button><button id="publish-lesson" class="secondary">Publish lesson</button></p>' +
        '<p id="content-message" class="muted"></p>' +
      '</section>' +
    '</div>';
  document.getElementById('edit-status').value = lesson.status || (lesson.stub ? 'locked' : 'published');
  document.getElementById('edit-level').value = lesson.levelId || 'foundation';
  content.querySelectorAll('.lesson-list button[data-id]').forEach(btn => btn.addEventListener('click', () => {
    selectedContentLessonId = btn.dataset.id;
    renderContentEditor();
  }));
  const msg = document.getElementById('content-message');
  document.getElementById('new-lesson').addEventListener('click', async () => {
    const title = prompt('New lesson title');
    if (!title) return;
    const arc = prompt('Arc/module name', 'Draft') || 'Draft';
    const rawNum = prompt('Lesson number. Leave blank to use the next number.', '');
    const body = { title, arc, status:'draft', levelId:'foundation', minutes:8 };
    if (rawNum.trim()) body.num = Number(rawNum);
    const created = await api('/api/admin/curriculum/lessons', { method:'POST', body });
    if (!created.ok) { alert(created.error || 'Could not create lesson.'); return; }
    selectedContentLessonId = created.lesson.id;
    renderContentEditor();
  });
  document.getElementById('save-lesson').addEventListener('click', async () => {
    msg.textContent = 'Saving lesson...';
    const body = {
      title: document.getElementById('edit-title').value,
      arc: document.getElementById('edit-arc').value,
      status: document.getElementById('edit-status').value,
      levelId: document.getElementById('edit-level').value,
      minutes: Number(document.getElementById('edit-minutes').value),
      coreQuestion: document.getElementById('edit-core').value,
      blurb: document.getElementById('edit-blurb').value
    };
    const saved = await api('/api/admin/curriculum/lessons/' + encodeURIComponent(lesson.id), { method:'PUT', body });
    msg.textContent = saved.ok ? 'Lesson saved.' : (saved.error || 'Could not save lesson.');
    if (saved.ok) renderContentEditor();
  });
  document.getElementById('save-steps').addEventListener('click', async () => {
    msg.textContent = 'Saving steps...';
    let steps;
    try { steps = JSON.parse(document.getElementById('edit-steps').value); }
    catch (error) { msg.textContent = 'Steps JSON is invalid.'; return; }
    if (!Array.isArray(steps)) { msg.textContent = 'Steps JSON must be an array.'; return; }
    const saved = await api('/api/admin/curriculum/lessons/' + encodeURIComponent(lesson.id) + '/steps', { method:'PUT', body:{ steps } });
    msg.textContent = saved.ok ? 'Steps saved.' : (saved.error || 'Could not save steps.');
    if (saved.ok) renderContentEditor();
  });
  document.getElementById('publish-lesson').addEventListener('click', async () => {
    msg.textContent = 'Publishing lesson...';
    const published = await api('/api/admin/curriculum/publish', { method:'POST', body:{ lessonId: lesson.id } });
    msg.textContent = published.ok ? 'Lesson published.' : (published.error || 'Could not publish lesson.');
    if (published.ok) renderContentEditor();
  });
}
function renderExport() {
  title.textContent = 'Export'; subtitle.textContent = 'CSV exports are admin-only and audited.';
  content.innerHTML = '<div class="card"><p>Download learner account and progress summary. Export creates an audit event.</p><p><button id="download-csv">Download CSV</button></p><p id="export-message" class="muted"></p></div>';
  document.getElementById('download-csv').addEventListener('click', async () => {
    const msg = document.getElementById('export-message');
    msg.textContent = 'Preparing export...';
    const headers = {};
    if (csrfToken) headers['x-csrf-token'] = csrfToken;
    const res = await fetch('/api/admin/export.csv', { method:'POST', headers, credentials:'include' });
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      msg.textContent = 'Could not export CSV' + (errorText ? ': ' + errorText.slice(0, 120) : '.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'learning-ai-learners.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 1000);
    msg.textContent = 'CSV downloaded.';
  });
}
function renderSettings() {
  title.textContent = 'Settings';
  subtitle.textContent = 'Personalize this admin view on this browser.';
  const settings = readAdminSettings();
  const accents = [
    ['#2563eb', 'Blue'],
    ['#0891b2', 'Teal'],
    ['#7c3aed', 'Violet'],
    ['#16a34a', 'Green'],
    ['#d97706', 'Amber']
  ];
  content.innerHTML =
    '<div class="card">' +
      '<h2>Admin appearance</h2>' +
      '<div class="setting-grid">' +
        '<label><span>Theme</span><select id="admin-theme"><option value="light">Light</option><option value="dark">Dark</option><option value="contrast">High contrast</option></select></label>' +
        '<label><span>Density</span><select id="admin-density"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label>' +
        '<div><span class="muted">Accent color</span><div class="swatches">' + accents.map(([color, label]) => '<button class="swatch'+(settings.accent === color ? ' active' : '')+'" data-accent="'+esc(color)+'" title="'+esc(label)+'" style="background:'+esc(color)+'"></button>').join('') + '</div></div>' +
      '</div>' +
      '<p class="muted">These settings only change your admin browser view. They do not affect learners or production data.</p>' +
    '</div>' +
    '<div class="card">' +
      '<h2>Backend status</h2>' +
      '<p id="settings-backend">Checking...</p>' +
    '</div>';
  document.getElementById('admin-theme').value = settings.theme;
  document.getElementById('admin-density').value = settings.density;
  document.getElementById('admin-theme').addEventListener('change', event => saveAdminSettings({ ...readAdminSettings(), theme:event.target.value }));
  document.getElementById('admin-density').addEventListener('change', event => saveAdminSettings({ ...readAdminSettings(), density:event.target.value }));
  content.querySelectorAll('.swatch').forEach(button => button.addEventListener('click', () => {
    saveAdminSettings({ ...readAdminSettings(), accent:button.dataset.accent });
    renderSettings();
  }));
  api('/health').then(result => {
    document.getElementById('settings-backend').innerHTML = result.ok
      ? 'Build <code>'+esc(result.buildSha || 'unknown')+'</code> · DB <code>'+esc(result.dbStatus || 'unknown')+'</code> · migration <code>'+esc(result.migrationVersion || 'unknown')+'</code>'
      : 'Could not read backend health.';
  });
}
applyAdminSettings();
boot();
</script>
</body>
</html>`;
}

export function createServer({ db = null, dataFile = DATA_FILE } = {}) {
  let database = db;
  let dbReady = false;
  let dbInitError = null;
  const ready = (async () => {
    if (!database) {
      const { createDb } = await import('./db.mjs');
      database = createDb();
    }
    await database.init();
    dbReady = true;
  })().catch(error => { dbInitError = error; dbReady = false; });
  return http.createServer(async (req, res) => {
    let url;
    try {
      url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      if (req.method === 'OPTIONS') return sendJson(res, 204, {}, { req });
      if (!requireTrustedOrigin(req, res)) return;
      if (req.method === 'POST' && url.pathname === '/api/minutes') {
        await ready.catch(() => {});
        return handleV1Minutes(req, res, database, dataFile, dbReady);
      }
      await ready;

      if (req.method === 'GET' && url.pathname === '/') { res.writeHead(302, { location: '/admin' }); return res.end(); }
      if (req.method === 'GET' && url.pathname === '/health') {
        if (!dbReady) return sendJson(res, 503, { ok: false, buildSha: BUILD_SHA, buildTime: BUILD_TIME, env: process.env.NODE_ENV || 'development', dbStatus: 'error', error: dbInitError?.message || 'db_not_ready' }, { req });
        const health = await database.health();
        return sendJson(res, 200, { ok: true, buildSha: BUILD_SHA, buildTime: BUILD_TIME, env: process.env.NODE_ENV || 'development', ...health }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/admin') return sendHtml(res, 200, adminHtml());

      if (req.method === 'POST' && url.pathname === '/api/auth/signup') return handleSignup(req, res, database);
      if (req.method === 'POST' && url.pathname === '/api/auth/login') return handleLogin(req, res, database);
      if (req.method === 'POST' && url.pathname === '/api/auth/logout') return handleLogout(req, res, database);
      if (req.method === 'GET' && url.pathname === '/api/auth/me') {
        const session = await requireUser(req, res, database);
        if (!session) return;
        const csrfToken = randomToken();
        await database.rotateCsrf(session.session.token_hash, hashToken(csrfToken));
        return sendJson(res, 200, { ok: true, user: session.user, csrfToken }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/auth/password-reset/request') return handlePasswordResetRequest(req, res, database);
      if (req.method === 'POST' && url.pathname === '/api/auth/password-reset/confirm') return handlePasswordResetConfirm(req, res, database);

      if (req.method === 'POST' && url.pathname === '/api/admin/login') return handleAdminLogin(req, res, database);
      if (req.method === 'POST' && url.pathname === '/api/admin/logout') return handleAdminLogout(req, res, database);
      if (req.method === 'GET' && url.pathname === '/api/admin/me') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        const health = await database.health();
        const csrfToken = randomToken();
        await database.rotateCsrf(session.session.token_hash, hashToken(csrfToken));
        return sendJson(res, 200, { ok: true, admin: session.admin, csrfToken, build: { buildSha: BUILD_SHA, buildTime: BUILD_TIME, ...health } }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/leaderboard') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        const legacyRows = process.env.INCLUDE_LEGACY_MINUTES_JSON === 'true' ? summarize(await readRows(dataFile)) : [];
        return sendJson(res, 200, { ok: true, leaderboard: mergeLeaderboards(legacyRows, await database.leaderboard()) }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/learners') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        return sendJson(res, 200, { ok: true, learners: await database.adminLearners() }, { req });
      }
      if (req.method === 'GET' && url.pathname.startsWith('/api/admin/learner/')) {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        const learner = await database.adminLearner(decodeURIComponent(url.pathname.replace('/api/admin/learner/', '')));
        return learner ? sendJson(res, 200, { ok: true, learner }, { req }) : sendJson(res, 404, { ok: false, error: 'not_found' }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/lesson-analytics') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        return sendJson(res, 200, { ok: true, lessons: await database.lessonAnalytics() }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/assessment-analytics') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        return sendJson(res, 200, { ok: true, analytics: await database.adminAssessmentAnalytics() }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/ai-requests') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        return sendJson(res, 200, { ok: true, ai: await database.adminAiRequests() }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/admin/curriculum') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        return sendJson(res, 200, { ok: true, curriculum: await database.curriculum() }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/curriculum/lessons') {
        const session = await requireAdmin(req, res, database, { csrf: true, url });
        if (!session) return;
        const lesson = validateNewLesson(await readJsonBody(req));
        if (!lesson) return sendJson(res, 400, { ok: false, error: 'invalid_new_lesson' }, { req });
        const created = await database.adminCreateLesson({ adminUserId: session.admin.id, lesson });
        if (!created) return sendJson(res, 409, { ok: false, error: 'lesson_exists' }, { req });
        return sendJson(res, 201, { ok: true, lesson: created }, { req });
      }
      if (req.method === 'PUT' && url.pathname.startsWith('/api/admin/curriculum/lessons/') && !url.pathname.endsWith('/steps')) {
        const session = await requireAdmin(req, res, database, { csrf: true, url });
        if (!session) return;
        const lessonId = decodeURIComponent(url.pathname.replace('/api/admin/curriculum/lessons/', ''));
        if (!isSafeLessonId(lessonId)) return sendJson(res, 400, { ok: false, error: 'invalid_lesson_id' }, { req });
        const patch = validateLessonPatch(await readJsonBody(req));
        if (!patch) return sendJson(res, 400, { ok: false, error: 'invalid_lesson_patch' }, { req });
        const lesson = await database.adminUpdateLesson({ adminUserId: session.admin.id, lessonId, patch });
        return lesson ? sendJson(res, 200, { ok: true, lesson }, { req }) : sendJson(res, 404, { ok: false, error: 'lesson_not_found' }, { req });
      }
      if (req.method === 'PUT' && url.pathname.startsWith('/api/admin/curriculum/lessons/') && url.pathname.endsWith('/steps')) {
        const session = await requireAdmin(req, res, database, { csrf: true, url });
        if (!session) return;
        const lessonId = decodeURIComponent(url.pathname.replace('/api/admin/curriculum/lessons/', '').replace('/steps', ''));
        if (!isSafeLessonId(lessonId)) return sendJson(res, 400, { ok: false, error: 'invalid_lesson_id' }, { req });
        const steps = validateSteps(await readJsonBody(req));
        if (!steps || steps.some(step => !step)) return sendJson(res, 400, { ok: false, error: 'invalid_lesson_steps' }, { req });
        const lesson = await database.adminReplaceLessonSteps({ adminUserId: session.admin.id, lessonId, steps });
        return lesson ? sendJson(res, 200, { ok: true, lesson }, { req }) : sendJson(res, 404, { ok: false, error: 'lesson_not_found' }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/curriculum/publish') {
        const session = await requireAdmin(req, res, database, { csrf: true, url });
        if (!session) return;
        const body = await readJsonBody(req);
        const lessonId = body?.lessonId ? String(body.lessonId) : null;
        if (lessonId && !isSafeLessonId(lessonId)) return sendJson(res, 400, { ok: false, error: 'invalid_lesson_id' }, { req });
        return sendJson(res, 200, { ok: true, publish: await database.adminPublishCurriculum({ adminUserId: session.admin.id, lessonId }) }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/account-action') {
        const session = await requireAdmin(req, res, database, { csrf: true, url });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body?.userId || !['disable', 'enable', 'rename', 'delete', 'resetPassword'].includes(body.action)) return sendJson(res, 400, { ok: false, error: 'invalid_action' }, { req });
        if (body.action === 'rename' && !isSafeName(normalizeName(body.displayName))) return sendJson(res, 400, { ok: false, error: 'invalid_display_name' }, { req });
        if (body.action === 'resetPassword' && !isSafePassword(String(body.newPassword || ''))) return sendJson(res, 400, { ok: false, error: 'invalid_password' }, { req });
        await database.accountAction({ adminUserId: session.admin.id, ...body, displayName: normalizeName(body.displayName) });
        return sendJson(res, 200, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/export.csv') {
        const session = await requireAdmin(req, res, database, { csrf: true, url });
        if (!session) return;
        await database.audit({ adminUserId: session.admin.id, eventName: 'export_csv' });
        const rows = await database.exportLearners();
        const csv = learnerCsv(rows);
        res.writeHead(200, { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="learning-ai-learners.csv"', 'cache-control': 'no-store' });
        return res.end(csv);
      }

      if (req.method === 'GET' && url.pathname === '/api/v2/state') {
        const session = await requireUser(req, res, database);
        if (!session) return;
        const csrfToken = randomToken();
        await database.rotateCsrf(session.session.token_hash, hashToken(csrfToken));
        return sendJson(res, 200, { ok: true, state: await database.stateForUser(session.user.id), csrfToken }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/v2/dashboard') {
        const session = await requireUser(req, res, database);
        if (!session) return;
        return sendJson(res, 200, { ok: true, dashboard: await database.dashboardForUser(session.user.id) }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/v2/curriculum') {
        const session = await requireUser(req, res, database);
        if (!session) return;
        return sendJson(res, 200, { ok: true, curriculum: await database.curriculum({ includeDrafts: false }) }, { req });
      }
      if (req.method === 'GET' && url.pathname.startsWith('/api/v2/lessons/')) {
        const session = await requireUser(req, res, database);
        if (!session) return;
        const lessonId = decodeURIComponent(url.pathname.replace('/api/v2/lessons/', ''));
        if (!isSafeLessonId(lessonId)) return sendJson(res, 400, { ok: false, error: 'invalid_lesson_id' }, { req });
        const lesson = await database.curriculumLesson(lessonId, { includeDrafts: false });
        return lesson ? sendJson(res, 200, { ok: true, lesson }, { req }) : sendJson(res, 404, { ok: false, error: 'lesson_not_found' }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/import-local') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
        await database.importLocal(session.user.id, body);
        return sendJson(res, 200, { ok: true }, { req });
      }
      if (req.method === 'PUT' && url.pathname === '/api/v2/assessment') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
        await database.saveAssessment(session.user.id, body.assessment || body);
        return sendJson(res, 200, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/progress') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body?.lessonId || !/^chapter-\d+$/.test(String(body.lessonId))) return sendJson(res, 400, { ok: false, error: 'invalid_progress' }, { req });
        await database.saveProgress(session.user.id, body);
        return sendJson(res, 200, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/interaction') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body?.lessonId || !/^chapter-\d+$/.test(String(body.lessonId))) return sendJson(res, 400, { ok: false, error: 'invalid_interaction' }, { req });
        await database.saveInteraction(session.user.id, body);
        return sendJson(res, 201, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/quiz-answer') {
        if (!rateLimit(req, 'quiz-answer', 180, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const quizAnswer = validateQuizAnswer(await readJsonBody(req));
        if (!quizAnswer) return sendJson(res, 400, { ok: false, error: 'invalid_quiz_answer' }, { req });
        await database.saveQuizAnswer(session.user.id, quizAnswer);
        return sendJson(res, 201, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/activity-complete') {
        if (!rateLimit(req, 'activity-complete', 180, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const activity = validateActivityCompletion(await readJsonBody(req));
        if (!activity) return sendJson(res, 400, { ok: false, error: 'invalid_activity_completion' }, { req });
        await database.completeActivity(session.user.id, activity);
        return sendJson(res, 201, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/feedback-request') {
        if (!rateLimit(req, 'feedback-request', 60, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const request = validateFeedbackRequest(await readJsonBody(req));
        if (!request) return sendJson(res, 400, { ok: false, error: 'invalid_feedback_request' }, { req });
        return sendJson(res, 201, { ok: true, request: await database.createFeedbackRequest(session.user.id, request) }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/project-review') {
        if (!rateLimit(req, 'project-review', 30, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const review = validateProjectReview(await readJsonBody(req));
        if (!review) return sendJson(res, 400, { ok: false, error: 'invalid_project_review' }, { req });
        return sendJson(res, 201, { ok: true, review: await database.createProjectReview(session.user.id, review) }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/tutor-sessions') {
        if (!rateLimit(req, 'tutor-session', 30, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const tutorSession = validateTutorSession(await readJsonBody(req));
        if (!tutorSession) return sendJson(res, 400, { ok: false, error: 'invalid_tutor_session' }, { req });
        return sendJson(res, 201, { ok: true, session: await database.createTutorSession(session.user.id, tutorSession) }, { req });
      }
      if (req.method === 'POST' && url.pathname.startsWith('/api/v2/tutor-sessions/') && url.pathname.endsWith('/messages')) {
        if (!rateLimit(req, 'tutor-message', 120, 15 * 60_000)) return sendJson(res, 429, { ok: false, error: 'rate_limited' }, { req });
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const sessionId = decodeURIComponent(url.pathname.replace('/api/v2/tutor-sessions/', '').replace('/messages', ''));
        if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return sendJson(res, 400, { ok: false, error: 'invalid_tutor_session_id' }, { req });
        const message = validateTutorMessage(await readJsonBody(req));
        if (!message) return sendJson(res, 400, { ok: false, error: 'invalid_tutor_message' }, { req });
        const saved = await database.addTutorMessage(session.user.id, { sessionId, ...message });
        return saved ? sendJson(res, 201, { ok: true, message: saved }, { req }) : sendJson(res, 404, { ok: false, error: 'tutor_session_not_found' }, { req });
      }
      if (req.method === 'GET' && url.pathname === '/api/v2/insights') {
        const session = await requireUser(req, res, database);
        if (!session) return;
        return sendJson(res, 200, { ok: true, insights: await database.progressInsights(session.user.id) }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/toolkit') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body?.cardType) return sendJson(res, 400, { ok: false, error: 'invalid_toolkit_card' }, { req });
        const id = await database.saveToolkit(session.user.id, body);
        return sendJson(res, 201, { ok: true, id }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/minutes') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
        const minutes = Number(body.minutes);
        if (!Number.isFinite(minutes) || minutes < 1 || minutes > 300) return sendJson(res, 400, { ok: false, error: 'invalid_minutes' }, { req });
        await database.addMinutes({ userId: session.user.id, name: session.user.displayName, nameKey: nameKey(session.user.displayName), minutes, lessonId: body.lessonId || null, source: 'v2' });
        return sendJson(res, 201, { ok: true }, { req });
      }
      if (req.method === 'POST' && url.pathname === '/api/v2/visit') {
        const session = await requireUser(req, res, database, { csrf: true });
        if (!session) return;
        const body = await readJsonBody(req);
        if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
        await database.recordVisit(session.user.id, body);
        return sendJson(res, 201, { ok: true }, { req });
      }
      return sendJson(res, 404, { ok: false, error: 'not_found' }, { req });
    } catch (error) {
      const message = process.env.NODE_ENV === 'production' ? 'server_error' : (error.message || 'server_error');
      return sendJson(res, 500, { ok: false, error: message }, { req });
    }
  });
}

export { hashPassword, isSafeName, nameKey, normalizeName, summarize };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Learning AI backend listening on http://127.0.0.1:${PORT}/admin`);
  });
}
