/* Learning AI backend bridge — v2.
 * Extends the original backend-client.js (which only had submitMinutes).
 * Stays inert until window.LEARNING_AI_BACKEND_URL is set (by backend-config.js).
 * Every call uses credentials:'include' so the session cookie travels cross-site
 * (site -> api). See BACKEND.md for the matching CORS/cookie requirements.
 */
(function initLearningAIBackend() {
  function base() {
    return String(window.LEARNING_AI_BACKEND_URL || '').replace(/\/$/, '');
  }

  async function call(path, { method = 'GET', body } = {}) {
    const root = base();
    if (!root) return { ok: false, skipped: true, error: 'backend_not_configured' };
    try {
      const res = await fetch(`${root}${path}`, {
        method,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        credentials: 'include',           // REQUIRED — sends/receives the session cookie
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, ...data };
    } catch (err) {
      // network/CORS failure — caller should fall back to localStorage
      return { ok: false, error: 'network_error', detail: String(err) };
    }
  }

  const API = {
    // health / diagnostics
    health: () => call('/api/health'),

    // auth
    signup: (email, password, displayName) => call('/api/auth/signup', { method: 'POST', body: { email, password, displayName } }),
    login: (email, password) => call('/api/auth/login', { method: 'POST', body: { email, password } }),
    logout: () => call('/api/auth/logout', { method: 'POST' }),
    me: () => call('/api/me'),

    // diagnostic — answers is { definition:3, capability:2, ... } using option RANK (0-3)
    saveDiagnostic: ({ answers, score, level, ageRange }) =>
      call('/api/diagnostic', { method: 'POST', body: { answers, score, level, ageRange } }),

    // progress (mosaic fill = completed.length)
    getProgress: () => call('/api/progress'),
    saveProgress: ({ currentLesson, completed }) =>
      call('/api/progress', { method: 'POST', body: { currentLesson, completed } }),

    // engagement — call once per app open; debounce client-side (~30 min)
    logVisit: (() => {
      const KEY = 'learningai-last-visit-ping';
      return function logVisit() {
        const now = Date.now();
        const last = Number(localStorage.getItem(KEY) || 0);
        if (now - last < 30 * 60 * 1000) return Promise.resolve({ ok: true, skipped: true });
        localStorage.setItem(KEY, String(now));
        return call('/api/visit', { method: 'POST' });
      };
    })(),

    // notes (toolkit)
    getNotes: () => call('/api/notes'),
    saveNote: ({ lesson, cardType, fields }) =>
      call('/api/notes', { method: 'POST', body: { lesson, cardType, fields } }),

    // admin (Backend Console)
    adminOverview: () => call('/api/admin/overview'),

    // existing
    submitMinutes: ({ name, minutes, consent = false } = {}) =>
      call('/api/minutes', { method: 'POST', body: { name, minutes, consent } }),
  };

  window.LearningAIBackend = API;
})();
