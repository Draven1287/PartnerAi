import http from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createStore } from './store.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const ADMIN_TOKEN = String(process.env.ADMIN_TOKEN || '').trim();
const DATA_FILE = process.env.DATA_FILE || join(__dirname, 'data', 'minutes.json');
const DB_FILE = process.env.DB_FILE || join(__dirname, 'data', 'learning-ai.sqlite');
const SESSION_DAYS = 30;
const scrypt = promisify(scryptCallback);
const DEFAULT_ORIGINS = [
  'https://learningai4you.com',
  'https://www.learningai4you.com',
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

if (process.env.NODE_ENV === 'production' && !ADMIN_TOKEN) {
  throw new Error('ADMIN_TOKEN is required in production');
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

function isSafeName(name) {
  if (name.length < 1 || name.length > 40) return false;
  if (/https?:\/\//i.test(name) || /www\./i.test(name)) return false;
  return !/[\u0000-\u001f<>]/.test(name);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isSafeEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
}

function isSafePassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 200;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url');
  const hash = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${Buffer.from(hash).toString('base64url')}`;
}

async function verifyPassword(password, stored) {
  const [scheme, salt, hash] = String(stored || '').split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await scrypt(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
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

function sessionCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure; SameSite=None' : '; SameSite=Lax';
  return `lai_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${SESSION_DAYS * 24 * 60 * 60}${secure}`;
}

function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure; SameSite=None' : '; SameSite=Lax';
  return `lai_session=; Path=/; HttpOnly; Max-Age=0${secure}`;
}

function expiresAt() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
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
    'access-control-allow-headers': 'content-type,x-admin-token',
    'access-control-allow-credentials': 'true',
    'vary': 'Origin',
    'cache-control': 'no-store'
  };
  if (origin) headers['access-control-allow-origin'] = origin;
  if (options.cookie) headers['set-cookie'] = options.cookie;
  res.writeHead(status, {
    ...headers
  });
  res.end(JSON.stringify(data));
}

function sendHtml(res, status, html) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(html);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 64_000) {
        reject(new Error('request_too_large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function isAdmin(req, url, adminToken = ADMIN_TOKEN) {
  if (!adminToken) return true;
  const token = req.headers['x-admin-token'] || url.searchParams.get('token');
  return token === adminToken;
}

function summarize(rows) {
  const totals = new Map();

  for (const row of rows) {
    const key = row.nameKey || nameKey(row.name);
    const current = totals.get(key) || {
      name: row.name,
      nameKey: key,
      totalMinutes: 0,
      entries: 0,
      lastSubmittedAt: ''
    };

    current.totalMinutes += Number(row.minutes || 0);
    current.entries += 1;
    current.lastSubmittedAt = !current.lastSubmittedAt || row.createdAt > current.lastSubmittedAt
      ? row.createdAt
      : current.lastSubmittedAt;
    totals.set(key, current);
  }

  return [...totals.values()]
    .sort((a, b) => {
      if (b.totalMinutes !== a.totalMinutes) return b.totalMinutes - a.totalMinutes;
      return a.name.localeCompare(b.name);
    });
}

function mergeLeaderboards(...lists) {
  const merged = new Map();
  lists.flat().forEach(row => {
    if (!row) return;
    const key = row.nameKey || nameKey(row.name);
    const current = merged.get(key) || {
      name: row.name,
      nameKey: key,
      totalMinutes: 0,
      entries: 0,
      lastSubmittedAt: ''
    };
    current.totalMinutes += Number(row.totalMinutes || 0);
    current.entries += Number(row.entries || 0);
    current.lastSubmittedAt = !current.lastSubmittedAt || row.lastSubmittedAt > current.lastSubmittedAt
      ? row.lastSubmittedAt
      : current.lastSubmittedAt;
    merged.set(key, current);
  });
  return [...merged.values()].sort((a, b) => {
    if (b.totalMinutes !== a.totalMinutes) return b.totalMinutes - a.totalMinutes;
    return a.name.localeCompare(b.name);
  });
}

function adminHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Learning AI Admin · Minutes</title>
  <style>
    :root {
      --bg: #f7f9fc;
      --surface: #ffffff;
      --surface-2: #eef4f8;
      --border: #dbe3ea;
      --text: #121826;
      --text-dim: #4b5870;
      --text-faint: #7a869a;
      --accent: #2563eb;
      --accent-dim: #1d4ed8;
      --accent-soft: rgba(37, 99, 235, 0.09);
      --good: #0f8a66;
      --on-accent: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Inter", system-ui, "Segoe UI", Roboto, sans-serif;
      font-size: 17px;
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .admin-shell { display: grid; grid-template-columns: 230px minmax(0, 1fr); min-height: 100vh; }
    .sidebar {
      background: var(--surface);
      border-right: 1px solid var(--border);
      padding: 22px 18px;
    }
    .brand { font-weight: 700; margin-bottom: 22px; }
    .nav-group { margin: 22px 0; }
    .nav-label {
      color: var(--text-faint);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .nav-item {
      display: block;
      border-radius: 8px;
      color: var(--text-dim);
      padding: 8px 10px;
      text-decoration: none;
    }
    .nav-item.active, .nav-item:hover { background: var(--accent-soft); color: var(--accent); }
    main { padding: 28px; }
    .topbar {
      align-items: center;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 500; letter-spacing: -.03em; line-height: 1.2; margin: 0; }
    .muted { color: var(--text-dim); margin: 4px 0 0; }
    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: 0 24px 70px rgba(18, 24, 38, 0.08);
      margin-bottom: 1rem;
      padding: clamp(1.2rem, 3vw, 1.7rem);
    }
    .status-strip {
      background: var(--accent-soft);
      border: 1px solid var(--border);
      border-left: 3px solid var(--accent);
      border-radius: 8px;
      color: var(--text-dim);
      font-size: 0.95rem;
      margin: 0 0 1.5rem;
      padding: 0.95rem 1.1rem;
    }
    .status-strip strong { color: var(--text); }
    .controls {
      display: grid;
      grid-template-columns: 1fr 170px auto;
      gap: 10px;
      margin-bottom: 16px;
    }
    input, select, button {
      border: 1px solid var(--border);
      border-radius: 7px;
      color: var(--text);
      font: inherit;
      padding: 10px 11px;
    }
    button { background: var(--accent); border-color: var(--accent); border-radius: 8px; color: var(--on-accent); cursor: pointer; font-weight: 500; }
    button:hover { background: var(--accent-dim); border-color: var(--accent-dim); }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid var(--border); padding: 11px 10px; text-align: left; }
    th { color: var(--text-faint); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; }
    .rank { color: var(--accent); font-weight: 700; width: 58px; }
    .minutes { font-weight: 700; }
    .pill {
      background: var(--surface-2);
      border-radius: 999px;
      color: var(--text-dim);
      display: inline-block;
      font-size: 12px;
      padding: 3px 8px;
    }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
    .metric strong { display: block; font-size: 24px; line-height: 1.1; }
    .metric span { color: var(--text-dim); font-size: 13px; }
    .section-title { align-items: center; display: flex; justify-content: space-between; margin-bottom: 10px; }
    .section-title h2 { font-size: 18px; margin: 0; }
    .login-panel {
      margin: 12vh auto 0;
      max-width: 520px;
    }
    .login-panel h1 { font-size: clamp(2rem, 5vw, 3rem); }
    .login-form { display: grid; gap: 12px; margin-top: 18px; }
    .remember-row { align-items: center; color: var(--text-dim); display: flex; gap: 8px; }
    .remember-row input { height: 16px; width: 16px; }
    .error { color: #b42318; margin-top: 10px; min-height: 1.4em; }
    .hidden { display: none !important; }
    .link-button {
      background: transparent;
      border: 0;
      color: var(--text-dim);
      padding: 0;
      text-align: left;
      text-decoration: underline;
    }
    .link-button:hover { background: transparent; color: var(--accent); }
    @media (max-width: 820px) {
      .admin-shell { grid-template-columns: 1fr; }
      .sidebar { border-bottom: 1px solid var(--border); border-right: 0; }
      .controls, .summary-grid { grid-template-columns: 1fr; }
      main { padding: 18px; }
    }
  </style>
</head>
<body>
  <section class="panel login-panel hidden" id="login-panel">
    <h1>Learning AI Admin</h1>
    <p class="muted">Enter the private admin token to view learner minutes.</p>
    <form class="login-form" id="login-form">
      <input id="token-input" type="password" autocomplete="current-password" placeholder="Admin token" required>
      <label class="remember-row"><input id="remember-token" type="checkbox" checked> Remember this browser</label>
      <button type="submit">Open admin</button>
    </form>
    <p class="error" id="login-error"></p>
  </section>
  <div class="admin-shell hidden" id="admin-shell">
    <aside class="sidebar">
      <div class="brand">Learning AI Admin</div>
      <div class="nav-group">
        <div class="nav-label">Dashboard</div>
        <a class="nav-item" href="#summary">Overview</a>
        <a class="nav-item active" href="#learners">Learners</a>
        <a class="nav-item" href="#learners">Minutes</a>
        <a class="nav-item" href="#accounts">Accounts</a>
        <a class="nav-item" href="#analytics">Lessons</a>
      </div>
      <div class="nav-group">
        <div class="nav-label">Admin</div>
        <button class="link-button" id="logout" type="button">Forget token</button>
      </div>
    </aside>
    <main>
      <div class="topbar">
        <div>
          <h1>Learner Time</h1>
          <p class="muted">Names and minutes come from the V1 frontend. This backend only sorts and reviews learner time.</p>
        </div>
      </div>
      <div class="status-strip"><strong>Read-only admin view.</strong> Learners enter their name and time on the public V1 site. This page does not create learner records.</div>
      <div class="summary-grid" id="summary">
        <div class="panel metric"><strong id="total-learners">0</strong><span>Learners</span></div>
        <div class="panel metric"><strong id="total-minutes">0</strong><span>Total minutes</span></div>
        <div class="panel metric"><strong id="total-saves">0</strong><span>Minute saves</span></div>
      </div>
      <section class="panel" id="learners">
        <div class="section-title"><h2>Learners</h2></div>
        <div class="controls">
          <input id="search" type="search" placeholder="Search by name">
          <select id="sort">
            <option value="minutes">Minutes high to low</option>
            <option value="recent">Recently active</option>
            <option value="name">Name A-Z</option>
          </select>
          <button id="refresh" type="button">Refresh</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Total minutes</th>
              <th>Minute saves</th>
              <th>Last saved</th>
            </tr>
          </thead>
          <tbody id="rows"></tbody>
        </table>
      </section>
      <section class="panel" id="accounts">
        <div class="section-title"><h2>V2 accounts</h2></div>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Minutes</th>
              <th>Lessons</th>
              <th>Interactions</th>
              <th>Toolkit</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody id="account-rows"></tbody>
        </table>
      </section>
      <section class="panel" id="analytics">
        <div class="section-title"><h2>Lesson analytics</h2></div>
        <table>
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Started</th>
              <th>Completed</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody id="lesson-rows"></tbody>
        </table>
      </section>
    </main>
  </div>
  <script>
    const tokenKey = 'learningai-admin-token';
    const queryToken = new URLSearchParams(location.search).get('token') || '';
    let token = queryToken || localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey) || '';
    let shouldRememberToken = Boolean(queryToken || localStorage.getItem(tokenKey));
    let leaderboard = [];
    let accounts = [];
    let lessons = [];

    if (queryToken) {
      history.replaceState(null, '', location.pathname + location.hash);
    }

    function saveToken(value) {
      sessionStorage.setItem(tokenKey, value);
      if (shouldRememberToken) localStorage.setItem(tokenKey, value);
      if (!shouldRememberToken) localStorage.removeItem(tokenKey);
    }

    function forgetToken() {
      localStorage.removeItem(tokenKey);
      sessionStorage.removeItem(tokenKey);
    }

    function text(value) {
      return value == null ? '' : String(value);
    }

    function formatDate(value) {
      if (!value) return 'Never';
      return new Date(value).toLocaleString();
    }

    function render() {
      const q = search.value.trim().toLowerCase();
      let rows = leaderboard.filter(row => {
        if (q && !row.name.toLowerCase().includes(q)) return false;
        return true;
      });
      if (sort.value === 'recent') rows = rows.sort((a, b) => text(b.lastSubmittedAt).localeCompare(text(a.lastSubmittedAt)));
      if (sort.value === 'name') rows = rows.sort((a, b) => a.name.localeCompare(b.name));
      if (sort.value === 'minutes') rows = rows.sort((a, b) => b.totalMinutes - a.totalMinutes || a.name.localeCompare(b.name));

      document.getElementById('total-learners').textContent = leaderboard.length;
      document.getElementById('total-minutes').textContent = leaderboard.reduce((sum, row) => sum + row.totalMinutes, 0);
      document.getElementById('total-saves').textContent = leaderboard.reduce((sum, row) => sum + row.entries, 0);

      const tbody = document.getElementById('rows');
      tbody.replaceChildren(...rows.map((row, index) => {
        const tr = document.createElement('tr');
        [String(index + 1), row.name, String(row.totalMinutes), String(row.entries), formatDate(row.lastSubmittedAt)].forEach((value, col) => {
          const td = document.createElement('td');
          td.textContent = value;
          if (col === 0) td.className = 'rank';
          if (col === 2) td.className = 'minutes';
          tr.appendChild(td);
        });
        return tr;
      }));

      document.getElementById('account-rows').replaceChildren(...accounts.map(row => {
        const tr = document.createElement('tr');
        [
          row.email,
          row.displayName,
          String(row.totalMinutes || 0),
          String(row.completedLessons || 0) + ' / 30',
          String(row.interactions || 0),
          String(row.toolkitCards || 0),
          formatDate(row.lastActiveAt)
        ].forEach(value => {
          const td = document.createElement('td');
          td.textContent = value;
          tr.appendChild(td);
        });
        return tr;
      }));

      document.getElementById('lesson-rows').replaceChildren(...lessons.map(row => {
        const tr = document.createElement('tr');
        [row.lessonId, String(row.learnersStarted || 0), String(row.learnersCompleted || 0), formatDate(row.lastActivityAt)].forEach(value => {
          const td = document.createElement('td');
          td.textContent = value;
          tr.appendChild(td);
        });
        return tr;
      }));
    }

    function showLogin(message = '') {
      document.getElementById('admin-shell').classList.add('hidden');
      document.getElementById('login-panel').classList.remove('hidden');
      document.getElementById('login-error').textContent = message;
      document.getElementById('token-input').focus();
    }

    function showAdmin() {
      document.getElementById('login-panel').classList.add('hidden');
      document.getElementById('admin-shell').classList.remove('hidden');
    }

    async function load() {
      if (!token) {
        showLogin();
        return;
      }
      const headers = token ? { 'x-admin-token': token } : {};
      const res = await fetch('/api/admin/leaderboard', { headers });
      if (res.status === 401) {
        forgetToken();
        token = '';
        showLogin('That token did not work.');
        return;
      }
      if (!res.ok) throw new Error('Could not load leaderboard');
      const data = await res.json();
      leaderboard = data.leaderboard || [];
      const learnersRes = await fetch('/api/admin/learners', { headers });
      if (learnersRes.ok) accounts = (await learnersRes.json()).learners || [];
      const analyticsRes = await fetch('/api/admin/lesson-analytics', { headers });
      if (analyticsRes.ok) lessons = (await analyticsRes.json()).lessons || [];
      saveToken(token);
      showAdmin();
      render();
    }

    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    document.getElementById('refresh').addEventListener('click', load);
    document.getElementById('logout').addEventListener('click', () => {
      forgetToken();
      token = '';
      showLogin();
    });
    document.getElementById('login-form').addEventListener('submit', event => {
      event.preventDefault();
      token = document.getElementById('token-input').value.trim();
      shouldRememberToken = document.getElementById('remember-token').checked;
      if (!token) return showLogin('Enter the admin token.');
      load().catch(error => showLogin(error.message));
    });
    [search, sort].forEach(input => input.addEventListener('input', render));
    load().catch(error => showLogin(error.message));
  </script>
</body>
</html>`;
}

async function handleMinutesPost(req, res, dataFile = DATA_FILE) {
  const raw = await readBody(req);
  let body;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    return sendJson(res, 400, { ok: false, error: 'invalid_json' });
  }

  if (body.consent !== true) {
    return sendJson(res, 400, { ok: false, error: 'consent_required' });
  }

  const name = normalizeName(body.name);
  const minutes = Number(body.minutes);

  if (!isSafeName(name)) {
    return sendJson(res, 400, { ok: false, error: 'invalid_name' });
  }
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 300) {
    return sendJson(res, 400, { ok: false, error: 'invalid_minutes' });
  }

  const row = {
    id: randomUUID(),
    name,
    nameKey: nameKey(name),
    minutes: Math.round(minutes),
    createdAt: nowIso()
  };

  const rows = await readRows(dataFile);
  rows.push(row);
  await writeRows(rows, dataFile);

  return sendJson(res, 201, { ok: true });
}

async function requireUser(req, res, store) {
  const token = parseCookies(req).lai_session;
  const user = store.userForSession(token);
  if (!user) {
    sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
    return null;
  }
  return user;
}

async function handleSignup(req, res, store) {
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const displayName = normalizeName(body.displayName || email.split('@')[0]);

  if (!isSafeEmail(email)) return sendJson(res, 400, { ok: false, error: 'invalid_email' }, { req });
  if (!isSafePassword(password)) return sendJson(res, 400, { ok: false, error: 'invalid_password' }, { req });
  if (!isSafeName(displayName)) return sendJson(res, 400, { ok: false, error: 'invalid_display_name' }, { req });
  if (store.findUserByEmail(email)) return sendJson(res, 409, { ok: false, error: 'email_exists' }, { req });

  const user = store.createUser({ email, passwordHash: await hashPassword(password), displayName });
  const token = randomBytes(32).toString('base64url');
  store.createSession(user.id, token, expiresAt());
  return sendJson(res, 201, { ok: true, user }, { req, cookie: sessionCookie(token) });
}

async function handleLogin(req, res, store) {
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const email = normalizeEmail(body.email);
  const userRow = store.findUserByEmail(email);
  if (!userRow || userRow.disabled || !(await verifyPassword(String(body.password || ''), userRow.password_hash))) {
    return sendJson(res, 401, { ok: false, error: 'invalid_login' }, { req });
  }
  const user = store.findUserById(userRow.id);
  const token = randomBytes(32).toString('base64url');
  store.createSession(user.id, token, expiresAt());
  return sendJson(res, 200, { ok: true, user }, { req, cookie: sessionCookie(token) });
}

async function handleLogout(req, res, store) {
  const token = parseCookies(req).lai_session;
  if (token) store.deleteSession(token);
  return sendJson(res, 200, { ok: true }, { req, cookie: clearSessionCookie() });
}

async function handleV2Minutes(req, res, store, user) {
  const body = await readJsonBody(req);
  if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
  const name = normalizeName(body.name || user.displayName);
  const minutes = Number(body.minutes);
  if (!isSafeName(name)) return sendJson(res, 400, { ok: false, error: 'invalid_name' }, { req });
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 300) return sendJson(res, 400, { ok: false, error: 'invalid_minutes' }, { req });
  store.addMinutes({ userId: user.id, name, nameKey: nameKey(name), minutes });
  return sendJson(res, 201, { ok: true }, { req });
}

async function readJsonBody(req) {
  try {
    return JSON.parse(await readBody(req) || '{}');
  } catch {
    return null;
  }
}

export function createServer({ dataFile = DATA_FILE, dbFile = DB_FILE, adminToken = ADMIN_TOKEN } = {}) {
  const store = createStore(dbFile);
  const storeReady = store.init();
  return http.createServer(async (req, res) => {
    try {
      await storeReady;
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

      if (req.method === 'OPTIONS') {
        return sendJson(res, 204, {}, { req });
      }

      if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(302, { location: '/admin' });
        return res.end();
      }

      if (req.method === 'GET' && url.pathname === '/health') {
        return sendJson(res, 200, { ok: true }, { req });
      }

      if (req.method === 'GET' && url.pathname === '/admin') {
        return sendHtml(res, 200, adminHtml());
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/leaderboard') {
        if (!isAdmin(req, url, adminToken)) return sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
        const legacyRows = summarize(await readRows(dataFile));
        const sqliteRows = store.leaderboard();
        return sendJson(res, 200, { ok: true, leaderboard: mergeLeaderboards(legacyRows, sqliteRows) }, { req });
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/learners') {
        if (!isAdmin(req, url, adminToken)) return sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
        return sendJson(res, 200, { ok: true, learners: store.adminLearners() }, { req });
      }

      if (req.method === 'GET' && url.pathname.startsWith('/api/admin/learner/')) {
        if (!isAdmin(req, url, adminToken)) return sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
        const learner = store.adminLearner(decodeURIComponent(url.pathname.replace('/api/admin/learner/', '')));
        return learner ? sendJson(res, 200, { ok: true, learner }, { req }) : sendJson(res, 404, { ok: false, error: 'not_found' }, { req });
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/lesson-analytics') {
        if (!isAdmin(req, url, adminToken)) return sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
        return sendJson(res, 200, { ok: true, lessons: store.lessonAnalytics() }, { req });
      }

      if (req.method === 'POST' && url.pathname === '/api/admin/account-action') {
        if (!isAdmin(req, url, adminToken)) return sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
        const body = await readJsonBody(req);
        if (!body?.userId || !['disable', 'enable', 'rename', 'delete'].includes(body.action)) return sendJson(res, 400, { ok: false, error: 'invalid_action' }, { req });
        if (body.action === 'rename' && !isSafeName(normalizeName(body.displayName))) return sendJson(res, 400, { ok: false, error: 'invalid_display_name' }, { req });
        store.accountAction({ ...body, displayName: normalizeName(body.displayName) });
        return sendJson(res, 200, { ok: true }, { req });
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/export.csv') {
        if (!isAdmin(req, url, adminToken)) return sendJson(res, 401, { ok: false, error: 'unauthorized' }, { req });
        const rows = store.adminLearners();
        const csv = ['email,displayName,totalMinutes,completedLessons,lastActiveAt', ...rows.map(row => [
          row.email,
          row.displayName,
          row.totalMinutes,
          row.completedLessons,
          row.lastActiveAt || ''
        ].map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))].join('\n');
        res.writeHead(200, {
          'content-type': 'text/csv; charset=utf-8',
          'content-disposition': 'attachment; filename="learning-ai-learners.csv"',
          'cache-control': 'no-store'
        });
        return res.end(csv);
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
        return handleSignup(req, res, store);
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/login') {
        return handleLogin(req, res, store);
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
        return handleLogout(req, res, store);
      }

      if (req.method === 'GET' && url.pathname === '/api/auth/me') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        return sendJson(res, 200, { ok: true, user }, { req });
      }

      if (req.method === 'GET' && url.pathname === '/api/v2/state') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        return sendJson(res, 200, { ok: true, state: store.stateForUser(user.id) }, { req });
      }

      if (req.method === 'PUT' && url.pathname === '/api/v2/assessment') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        const body = await readJsonBody(req);
        if (!body) return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
        store.saveAssessment(user.id, body.assessment || body);
        return sendJson(res, 200, { ok: true }, { req });
      }

      if (req.method === 'POST' && url.pathname === '/api/v2/progress') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        const body = await readJsonBody(req);
        if (!body?.lessonId) return sendJson(res, 400, { ok: false, error: 'invalid_progress' }, { req });
        store.saveProgress(user.id, body);
        return sendJson(res, 200, { ok: true }, { req });
      }

      if (req.method === 'POST' && url.pathname === '/api/v2/interaction') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        const body = await readJsonBody(req);
        if (!body?.lessonId) return sendJson(res, 400, { ok: false, error: 'invalid_interaction' }, { req });
        store.saveInteraction(user.id, body);
        return sendJson(res, 201, { ok: true }, { req });
      }

      if (req.method === 'POST' && url.pathname === '/api/v2/toolkit') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        const body = await readJsonBody(req);
        if (!body?.cardType) return sendJson(res, 400, { ok: false, error: 'invalid_toolkit_card' }, { req });
        const id = store.saveToolkit(user.id, body);
        return sendJson(res, 201, { ok: true, id }, { req });
      }

      if (req.method === 'POST' && url.pathname === '/api/v2/minutes') {
        const user = await requireUser(req, res, store);
        if (!user) return;
        return handleV2Minutes(req, res, store, user);
      }

      if (req.method === 'POST' && url.pathname === '/api/minutes') {
        const token = parseCookies(req).lai_session;
        const user = store.userForSession(token);
        const raw = await readBody(req);
        let body;
        try {
          body = JSON.parse(raw || '{}');
        } catch {
          return sendJson(res, 400, { ok: false, error: 'invalid_json' }, { req });
        }
        if (body.consent !== true) return sendJson(res, 400, { ok: false, error: 'consent_required' }, { req });
        const name = normalizeName(body.name);
        const minutes = Number(body.minutes);
        if (!isSafeName(name)) return sendJson(res, 400, { ok: false, error: 'invalid_name' }, { req });
        if (!Number.isFinite(minutes) || minutes < 1 || minutes > 300) return sendJson(res, 400, { ok: false, error: 'invalid_minutes' }, { req });
        store.addMinutes({ userId: user?.id || null, name, nameKey: nameKey(name), minutes });
        return sendJson(res, 201, { ok: true }, { req });
      }

      return sendJson(res, 404, { ok: false, error: 'not_found' }, { req });
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: error.message || 'server_error' }, { req });
    }
  });
}

export {
  isSafeName,
  nameKey,
  normalizeName,
  summarize
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Learning AI minutes backend: http://127.0.0.1:${PORT}/admin`);
    if (ADMIN_TOKEN) console.log('Admin token protection is enabled.');
  });
}
