/* Learning AI — reference API server (Node + Express + Postgres)
 *
 * Implements the contract in BACKEND.md. Deploy on Coolify behind Cloudflare.
 * This is a faithful, minimal starting point — review auth hardening before
 * production (rate limiting, password rules, email verification, CSRF if you
 * move off SameSite=None tokens).
 *
 *   npm i express pg cors cookie-parser bcryptjs jsonwebtoken
 *   node server.js
 */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const fs = require('node:fs/promises');
const path = require('node:path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';
const ORIGINS = (process.env.ALLOWED_ORIGINS ||
  'https://learningai4you.com,https://www.learningai4you.com,http://127.0.0.1:8123,http://localhost:8123'
).split(',');
const PROD = process.env.NODE_ENV === 'production';

const app = express();
app.use(express.json());
app.use(cookieParser());

// ---- CORS (must echo exact origin + allow credentials; never '*') ----
app.use(cors({
  origin(origin, cb) { cb(null, !origin || ORIGINS.includes(origin)); },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.options('*', cors());

// ---- never cache API responses (so Cloudflare shows cf-cache-status: DYNAMIC on /api/*) ----
app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

// ---- cookie helpers (cross-site requires SameSite=None + Secure) ----
function setSession(res, user) {
  const token = jwt.sign({ uid: user.id, admin: user.is_admin }, SECRET, { expiresIn: '30d' });
  res.cookie('session', token, {
    httpOnly: true,
    secure: PROD,                 // true in production (HTTPS via Cloudflare)
    sameSite: PROD ? 'none' : 'lax',
    domain: PROD ? '.learningai4you.com' : undefined,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}
function auth(req, res, next) {
  try { req.session = jwt.verify(req.cookies.session || '', SECRET); next(); }
  catch { res.status(401).json({ ok: false, error: 'unauthenticated' }); }
}
function adminOnly(req, res, next) {
  if (!req.session?.admin) return res.status(403).json({ ok: false, error: 'forbidden' });
  next();
}
const pub = (u) => ({ id: u.id, email: u.email, displayName: u.display_name, ageRange: u.age_range });

// ---- health (Console diagnostics ping — never cache) ----
app.get('/api/health', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const { rows } = await pool.query("select to_regclass('public.users') as users_table");
    if (!rows[0]?.users_table) return res.status(500).json({ status: 'ok', db: 'schema_missing' });
    res.json({ status: 'ok', db: 'connected' });
  }
  catch { res.status(500).json({ status: 'ok', db: 'down' }); }
});

// ---- auth ----
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, displayName } = req.body || {};
  if (!email || !password || !displayName) return res.status(400).json({ ok: false, error: 'missing_fields' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'bad_email' });
  if (String(password).length < 8) return res.status(400).json({ ok: false, error: 'weak_password' });
  try {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'insert into users(email,password_hash,display_name) values($1,$2,$3) returning *',
      [email.toLowerCase().trim(), hash, displayName.trim()]);
    await pool.query('insert into progress(user_id) values($1) on conflict do nothing', [rows[0].id]);
    setSession(res, rows[0]);
    res.json({ ok: true, user: pub(rows[0]) });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ ok: false, error: 'email_taken' });
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const { rows } = await pool.query('select * from users where email=$1', [(email || '').toLowerCase().trim()]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password || '', u.password_hash)))
    return res.status(401).json({ ok: false, error: 'bad_credentials' });
  setSession(res, u);
  res.json({ ok: true, user: pub(u) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('session', { domain: PROD ? '.learningai4you.com' : undefined });
  res.json({ ok: true });
});

// ---- hydrate on load ----
app.get('/api/me', auth, async (req, res) => {
  const u = (await pool.query('select * from users where id=$1', [req.session.uid])).rows[0];
  if (!u) return res.status(401).json({ ok: false, error: 'unauthenticated' });
  const prog = (await pool.query('select current_lesson, completed from progress where user_id=$1', [u.id])).rows[0];
  const diag = (await pool.query('select level, score, answers from diagnostics where user_id=$1 order by taken_at desc limit 1', [u.id])).rows[0];
  // onboarded = has completed the diagnostic at least once -> frontend skips the questionnaire on sign-in
  res.json({ ok: true, user: pub(u), progress: prog || { current_lesson: 1, completed: [] }, level: diag?.level || null, onboarded: !!diag });
});

// ---- diagnostic ----
app.post('/api/diagnostic', auth, async (req, res) => {
  const { answers, score, level, ageRange } = req.body || {};
  await pool.query('insert into diagnostics(user_id,answers,score,level) values($1,$2,$3,$4)',
    [req.session.uid, answers || {}, score | 0, level || 'Foundation']);
  if (ageRange) await pool.query('update users set age_range=$1 where id=$2', [ageRange, req.session.uid]);
  res.json({ ok: true });
});

// ---- progress ----
app.get('/api/progress', auth, async (req, res) => {
  const p = (await pool.query('select current_lesson, completed from progress where user_id=$1', [req.session.uid])).rows[0];
  res.json({ ok: true, currentLesson: p?.current_lesson || 1, completed: p?.completed || [] });
});
app.post('/api/progress', auth, async (req, res) => {
  const { currentLesson, completed } = req.body || {};
  await pool.query(
    `insert into progress(user_id,current_lesson,completed,updated_at) values($1,$2,$3,now())
     on conflict(user_id) do update set current_lesson=$2, completed=$3, updated_at=now()`,
    [req.session.uid, currentLesson | 0, JSON.stringify(completed || [])]);
  res.json({ ok: true });
});

// ---- visits (engagement) ----
app.post('/api/visit', auth, async (req, res) => {
  await pool.query('insert into visits(user_id) values($1)', [req.session.uid]);
  res.json({ ok: true });
});

// ---- notes (toolkit) ----
app.get('/api/notes', auth, async (req, res) => {
  const { rows } = await pool.query('select id,lesson,card_type,fields,created_at from notes where user_id=$1 order by created_at desc', [req.session.uid]);
  res.json({ ok: true, notes: rows });
});
app.post('/api/notes', auth, async (req, res) => {
  const { lesson, cardType, fields } = req.body || {};
  await pool.query('insert into notes(user_id,lesson,card_type,fields) values($1,$2,$3,$4)',
    [req.session.uid, lesson | 0, cardType || 'Note', JSON.stringify(fields || [])]);
  res.json({ ok: true });
});

// ---- existing minutes endpoint ----
app.post('/api/minutes', async (req, res) => {
  const { name, minutes, consent } = req.body || {};
  await pool.query('insert into minutes(name,minutes,consent) values($1,$2,$3)', [name || null, minutes | 0, !!consent]);
  res.json({ ok: true });
});

// ---- admin auth (gates the Backend Console; same session cookie, requires is_admin) ----
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  const { rows } = await pool.query('select * from users where email=$1', [(email || '').toLowerCase().trim()]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password || '', u.password_hash)))
    return res.status(401).json({ ok: false, error: 'bad_credentials' });
  if (!u.is_admin) return res.status(403).json({ ok: false, error: 'not_admin' });
  setSession(res, u);
  res.json({ ok: true, user: pub(u) });
});
app.post('/api/admin/logout', (_req, res) => {
  res.clearCookie('session', { domain: PROD ? '.learningai4you.com' : undefined });
  res.json({ ok: true });
});

// ---- admin overview (feeds Backend Console) ----
app.get('/api/admin/overview', auth, adminOnly, async (_req, res) => {
  const total = (await pool.query('select count(*)::int n from users')).rows[0].n;
  const active = (await pool.query("select count(distinct user_id)::int n from visits where started_at > now() - interval '7 days'")).rows[0].n;
  const levels = (await pool.query('select level, count(*)::int n from diagnostics group by level')).rows;
  const learners = (await pool.query(`
    select u.display_name, u.email, u.age_range,
           d.level, d.score,
           coalesce(p.current_lesson,1) current_lesson,
           (select count(*)::int from visits v where v.user_id=u.id) visits,
           (select count(distinct date(started_at))::int from visits v where v.user_id=u.id) active_days,
           (select max(started_at) from visits v where v.user_id=u.id) last_seen
    from users u
    left join progress p on p.user_id=u.id
    left join lateral (select level,score from diagnostics dd where dd.user_id=u.id order by taken_at desc limit 1) d on true
    order by last_seen desc nulls last limit 100`)).rows;
  res.json({ ok: true, total, activeWeek: active, levels, learners });
});

const PORT = process.env.PORT || 8787;

async function ensureSchema() {
  const schemaSql = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schemaSql);
}

ensureSchema()
  .then(() => app.listen(PORT, () => console.log(`Learning AI API on :${PORT}`)))
  .catch((error) => {
    console.error('Failed to initialize database schema', error);
    process.exit(1);
  });
