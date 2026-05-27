const fs = require('fs');
const http = require('http');
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = Number(process.env.PORT) || 8080;
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const SESSION_FILE = path.join(DATA_DIR, 'sessions.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const STATE = {
  sessions: {}
};

function safeReadJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch (_e) {
    return fallback;
  }
}

function safeWriteJson(filePath, payload) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
    return true;
  } catch (_e) {
    return false;
  }
}

function loadState() {
  const stored = safeReadJson(SESSION_FILE, { sessions: {} });
  STATE.sessions = stored.sessions || {};
}

function persistState() {
  safeWriteJson(SESSION_FILE, { sessions: STATE.sessions });
}

function parseBody(req) {
  return new Promise((resolve) => {
    let payload = '';
    req.on('data', (chunk) => {
      payload += chunk;
    });
    req.on('end', () => {
      if (!payload) return resolve({});
      try {
        resolve(JSON.parse(payload));
      } catch (_e) {
        resolve({});
      }
    });
  });
}

function json(res, data, status = 200) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store'
  });
  res.end(payload);
}

function createSession(data = {}) {
  const now = Date.now();
  const sessionId = `v2-${randomUUID().replace(/-/g, '').slice(0, 20)}`;
  const name = String(data.name || 'Guest').trim().slice(0, 60) || 'Guest';
  STATE.sessions[sessionId] = {
    id: sessionId,
    name,
    route: data.route || '/',
    createdAt: now,
    lastActiveAt: now,
    endedAt: null,
    totalSeconds: 0,
    lastElapsedMs: 0,
    localOnly: false
  };
  persistState();
  return STATE.sessions[sessionId];
}

function endSession(data = {}) {
  const { sessionId } = data;
  const session = STATE.sessions[sessionId];
  if (!session || session.endedAt) return null;

  const now = Date.now();
  const elapsedMs = Number.isFinite(data.elapsedMs) ? Math.max(0, data.elapsedMs) : 0;
  if (elapsedMs > session.lastElapsedMs) {
    session.totalSeconds += Math.max(0, Math.round((elapsedMs - session.lastElapsedMs) / 1000));
    session.lastElapsedMs = elapsedMs;
  }
  session.endedAt = now;
  session.lastActiveAt = now;
  if (data.route) session.route = data.route;
  persistState();
  return session;
}

function heartbeatSession(data = {}) {
  const { sessionId } = data;
  const session = STATE.sessions[sessionId];
  if (!session || session.endedAt) return null;

  const now = Date.now();
  const elapsedMs = Number.isFinite(data.elapsedMs) ? Math.max(0, data.elapsedMs) : 0;
  if (elapsedMs > session.lastElapsedMs) {
    session.totalSeconds += Math.max(0, Math.round((elapsedMs - session.lastElapsedMs) / 1000));
    session.lastElapsedMs = elapsedMs;
  }
  session.lastActiveAt = now;
  session.route = data.route || session.route || '/v2-prototype/index.html';
  if (data.name) session.name = String(data.name).slice(0, 60);
  if (data.route) session.route = data.route;
  persistState();
  return session;
}

function activeSessions(windowMs = 120000) {
  const now = Date.now();
  const activeWindow = Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 120000;
  const active = [];
  let total = 0;

  Object.values(STATE.sessions).forEach((session) => {
    const delta = now - (session.lastActiveAt || session.createdAt);
    const isActive = !session.endedAt && delta <= activeWindow;
    if (isActive) {
      active.push({
        id: session.id,
        name: session.name,
        route: session.route || '/v2-prototype/index.html',
        totalSeconds: Number(session.totalSeconds || 0),
        lastActiveAt: new Date(session.lastActiveAt).toISOString()
      });
    }
    total += Number(session.totalSeconds || 0);
  });

  return { active, totalTimeMs: total * 1000, windowMs: activeWindow };
}

function sendStaticFile(reqPath, res) {
  const normalized = decodeURIComponent(reqPath.split('?')[0]);
  let relPath = normalized.startsWith('/v2-prototype/') ? normalized.slice(1) : normalized.slice(1);
  if (!relPath) relPath = 'v2-prototype/index.html';
  const resolved = path.join(PROJECT_ROOT, relPath);

  if (!resolved.startsWith(path.join(PROJECT_ROOT, ''))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  let filePath = resolved;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const fallbackIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(fallbackIndex)) {
      filePath = fallbackIndex;
    }
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  sendFile(filePath, res);
}

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const stream = fs.createReadStream(filePath);

  stream.on('error', () => {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Unable to read file');
  });

  stream.on('open', () => {
    const headers = {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
  });

  stream.pipe(res);
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.url.startsWith('/api/session/start') && req.method === 'POST') {
    const body = await parseBody(req);
    const session = createSession(body);
    json(res, { ok: true, sessionId: session.id, startedAt: session.createdAt });
    return;
  }

  if (req.url.startsWith('/api/session/heartbeat') && req.method === 'POST') {
    const body = await parseBody(req);
    const session = heartbeatSession(body);
    if (!session) {
      json(res, { ok: false, error: 'session_not_found' }, 404);
      return;
    }
    json(res, { ok: true, sessionId: session.id, totalSeconds: session.totalSeconds });
    return;
  }

  if (req.url.startsWith('/api/session/end') && req.method === 'POST') {
    const body = await parseBody(req);
    const session = endSession(body);
    if (!session) {
      json(res, { ok: false, error: 'session_not_found' }, 404);
      return;
    }
    json(res, { ok: true, sessionId: session.id, totalSeconds: session.totalSeconds });
    return;
  }

  if (req.url.startsWith('/api/sessions/active') && req.method === 'GET') {
    const windowMs = Number(url.searchParams.get('windowMs')) || 120000;
    json(res, activeSessions(windowMs));
    return;
  }

  if (req.url === '/api/health') {
    json(res, { ok: true, service: 'v2-session-server' });
    return;
  }

  sendStaticFile(url.pathname, res);
}

loadState();
const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  });
});

server.listen(PORT, () => {
  console.log(`Learning AI V2 server on http://127.0.0.1:${PORT}`);
  console.log(`Serving static from ${PROJECT_ROOT}`);
  console.log('Session state file:', SESSION_FILE);
});
