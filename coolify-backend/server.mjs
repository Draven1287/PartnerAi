import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import bcrypt from 'bcryptjs';
import { createDb } from './db.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const DATA_FILE = process.env.DATA_FILE || join(__dirname, 'data', 'minutes.json');
const BUILD_SHA = process.env.BUILD_SHA || process.env.COOLIFY_GIT_COMMIT_SHA || 'local';
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const ADMIN_TOKEN = String(process.env.ADMIN_TOKEN || '').trim();
const ALLOW_ADMIN_TOKEN = String(process.env.ALLOW_ADMIN_TOKEN || '').toLowerCase() === 'true';
const SESSION_DAYS = 30;
const ADMIN_SESSION_HOURS = 8;
const DEFAULT_ORIGINS = [
  'https://learningai4you.com',
  'https://www.learningai4you.com',
  'https://api.learningai4you.com',
  'http://127.0.0.1:8123',
  'http://127.0.0.1:8124',
  'http://127.0.0.1:8125',
  'http://127.0.0.1:8126',
  'http://localhost:8123',
  'http://localhost:8124',
  'http://localhost:8125',
  'http://localhost:8126'
];
const ALLOWED_ORIGINS = new Set(String(process.env.CORS_ORIGINS || DEFAULT_ORIGINS.join(',')).split(',').map(origin => origin.trim()).filter(Boolean));
const RATE_LIMITS = new Map();
const scrypt = promisify(scryptCallback);

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
    'access-control-allow-headers': 'content-type,x-csrf-token,x-admin-token',
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
  return bcrypt.compare(password, stored);
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

async function requireAdmin(req, res, db, { csrf = false, url = null } = {}) {
  if (ALLOW_ADMIN_TOKEN && ADMIN_TOKEN && ((req.headers['x-admin-token'] || url?.searchParams.get('token')) === ADMIN_TOKEN)) {
    return { admin: { id: null, email: 'legacy-token-admin' }, legacyToken: true };
  }
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
  const user = await db.createUser({ email, passwordHash: await bcrypt.hash(password, 12), displayName });
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
  await readJsonBody(req);
  return sendJson(res, 200, { ok: true, message: 'If this email exists, an admin can help reset it.' }, { req });
}

async function handlePasswordResetConfirm(req, res) {
  await readJsonBody(req);
  return sendJson(res, 501, { ok: false, error: 'admin_assisted_reset_only' }, { req });
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

function adminHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Learning AI Admin</title>
  <style>
    :root { --bg:#f7f9fc; --surface:#fff; --surface-2:#eef4f8; --border:#dbe3ea; --text:#121826; --dim:#4b5870; --faint:#7a869a; --accent:#2563eb; --good:#0f8a66; --bad:#b42318; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Inter",system-ui,"Segoe UI",sans-serif; font-size:16px; }
    .shell { display:grid; grid-template-columns:240px minmax(0,1fr); min-height:100vh; }
    aside { background:#fff; border-right:1px solid var(--border); padding:28px 22px; }
    main { padding:34px; }
    h1 { margin:0 0 4px; font-size:44px; letter-spacing:0; }
    h2 { margin:0 0 18px; font-size:24px; }
    p { color:var(--dim); line-height:1.5; }
    .brand { font-weight:800; font-size:20px; margin-bottom:34px; }
    .nav button { display:block; width:100%; border:0; background:transparent; text-align:left; padding:12px; border-radius:8px; color:var(--dim); font:inherit; cursor:pointer; }
    .nav button.active { color:var(--accent); background:#e9efff; }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:22px; box-shadow:0 18px 60px rgba(18,24,38,.06); margin:22px 0; }
    .grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; }
    .stat strong { display:block; font-size:32px; }
    input, select { width:100%; padding:12px 14px; border:1px solid var(--border); border-radius:8px; font:inherit; background:#fff; }
    button, .btn { border:0; border-radius:8px; padding:12px 16px; background:var(--accent); color:#fff; font-weight:700; cursor:pointer; font:inherit; }
    button.secondary { background:#eef4f8; color:var(--text); }
    button.danger { background:#b42318; }
    table { width:100%; border-collapse:collapse; }
    th, td { padding:12px; border-bottom:1px solid var(--border); text-align:left; vertical-align:top; }
    th { color:var(--faint); font-size:12px; text-transform:uppercase; letter-spacing:.08em; }
    .row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
    .row > * { flex:1; }
    .notice { border-left:4px solid var(--accent); background:#e9efff; padding:12px 14px; border-radius:8px; }
    .hidden { display:none !important; }
    .login { max-width:460px; margin:12vh auto; }
    .muted { color:var(--faint); }
    .pill { display:inline-block; background:var(--surface-2); border-radius:999px; padding:4px 10px; color:var(--dim); font-size:13px; }
    @media (max-width:850px) { .shell { grid-template-columns:1fr; } aside { border-right:0; border-bottom:1px solid var(--border); } .grid { grid-template-columns:1fr 1fr; } main { padding:22px; } h1 { font-size:34px; } }
  </style>
</head>
<body>
  <div id="login" class="login card">
    <h1>Admin Login</h1>
    <p>Use the admin account configured in Coolify. Admin tokens are no longer stored in the browser.</p>
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
        <button data-view="lessons">Lessons</button>
        <button data-view="export">Export</button>
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
const app = document.getElementById('app');
const login = document.getElementById('login');
const content = document.getElementById('content');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
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
function showLogin() { login.classList.remove('hidden'); app.classList.add('hidden'); }
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
  if (currentView === 'lessons') return renderLessons();
  if (currentView === 'export') return renderExport();
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
  content.innerHTML = '<div class="card"><div class="row"><input id="search" placeholder="Search learners"><button id="refresh">Refresh</button></div><table><thead><tr><th>Name</th><th>Email</th><th>Minutes</th><th>Progress</th><th>Current</th><th>Visits</th><th>Last active</th><th>Actions</th></tr></thead><tbody id="learner-rows"></tbody></table></div>';
  const tbody = document.getElementById('learner-rows');
  function draw(filter='') {
    tbody.innerHTML = rows.filter(r => (r.displayName + ' ' + r.email).toLowerCase().includes(filter.toLowerCase())).map(r => '<tr>'+
      '<td>'+esc(r.displayName)+(r.disabled?' <span class="pill">disabled</span>':'')+'</td><td>'+esc(r.email)+'</td><td>'+esc(r.totalMinutes)+'</td><td>'+esc(r.completionPercent)+'%</td><td>'+esc(r.currentLesson || '')+'</td><td>'+esc(r.visitCount)+'</td><td>'+esc(fmtDate(r.lastActiveAt))+'</td><td><button class="secondary" data-id="'+esc(r.id)+'" data-action="'+(r.disabled?'enable':'disable')+'">'+(r.disabled?'Enable':'Disable')+'</button></td></tr>').join('');
    tbody.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', async () => { await api('/api/admin/account-action', { method:'POST', body:{ userId:btn.dataset.id, action:btn.dataset.action } }); renderLearners(); }));
  }
  document.getElementById('search').addEventListener('input', e => draw(e.target.value));
  document.getElementById('refresh').addEventListener('click', renderLearners);
  draw();
}
async function renderLessons() {
  title.textContent = 'Lessons'; subtitle.textContent = 'Starts, completions, and difficult steps by lesson.';
  const result = await api('/api/admin/lesson-analytics');
  const rows = result.lessons || [];
  content.innerHTML = '<div class="card"><table><thead><tr><th>Lesson</th><th>Arc</th><th>Started</th><th>Completed</th><th>Interactions</th><th>Incorrect</th><th>Last activity</th></tr></thead><tbody>' + rows.map(r => '<tr><td>'+esc(r.num)+'. '+esc(r.title)+'</td><td>'+esc(r.arc)+'</td><td>'+esc(r.learnersStarted)+'</td><td>'+esc(r.learnersCompleted)+'</td><td>'+esc(r.interactions)+'</td><td>'+esc(r.incorrectAnswers)+'</td><td>'+esc(fmtDate(r.lastActivityAt))+'</td></tr>').join('') + '</tbody></table></div>';
}
function renderExport() {
  title.textContent = 'Export'; subtitle.textContent = 'CSV exports are admin-only and audited.';
  content.innerHTML = '<div class="card"><p>Download learner account and progress summary. Export creates an audit event.</p><p><a class="btn" href="/api/admin/export.csv">Download CSV</a></p></div>';
}
boot();
</script>
</body>
</html>`;
}

export function createServer({ db = null, dataFile = DATA_FILE } = {}) {
  const database = db || createDb();
  let dbReady = false;
  let dbInitError = null;
  const ready = database.init().then(() => { dbReady = true; }).catch(error => { dbInitError = error; dbReady = false; });
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
      if (req.method === 'GET' && url.pathname === '/api/admin/export.csv') {
        const session = await requireAdmin(req, res, database, { url });
        if (!session) return;
        await database.audit({ adminUserId: session.admin.id, eventName: 'export_csv' });
        const rows = await database.exportLearners();
        const csv = ['email,displayName,totalMinutes,visitCount,currentLesson,completionPercent,lastActiveAt', ...rows.map(row => [row.email, row.displayName, row.totalMinutes, row.visitCount, row.currentLesson, row.completionPercent, row.lastActiveAt || ''].map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))].join('\n');
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

export { isSafeName, nameKey, normalizeName, summarize };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Learning AI backend listening on http://127.0.0.1:${PORT}/admin`);
  });
}
