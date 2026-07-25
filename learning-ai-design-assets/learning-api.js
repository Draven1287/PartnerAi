(() => {
  const API_KEY = 'learningai-api-origin';
  const isLoopback = hostname => ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(String(hostname || '').toLowerCase());
  const allowedOrigin = candidate => {
    try {
      const parsed = new URL(String(candidate || ''), location.href);
      if (parsed.origin === location.origin) return parsed.origin;
      if (isLoopback(location.hostname) && isLoopback(parsed.hostname) && /^https?:$/.test(parsed.protocol)) return parsed.origin;
    } catch {}
    return '';
  };
  const fromQuery = new URLSearchParams(location.search).get('api');
  const queryOrigin = allowedOrigin(fromQuery);
  if (queryOrigin) localStorage.setItem(API_KEY, queryOrigin);
  else if (fromQuery) localStorage.removeItem(API_KEY);
  const storedOrigin = allowedOrigin(localStorage.getItem(API_KEY));
  const base = queryOrigin || storedOrigin || location.origin;
  const csrfKey = `learningai-csrf:${base}`;
  let csrfToken = sessionStorage.getItem(csrfKey) || '';

  const rememberCsrf = data => {
    if (!data?.csrfToken) return;
    csrfToken = data.csrfToken;
    sessionStorage.setItem(csrfKey, csrfToken);
  };

  async function fetchJson(path, { method = 'GET', body, timeoutMs = 9000 } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${base}${path}`, {
        method,
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'content-type': 'application/json',
          ...(method !== 'GET' && csrfToken ? { 'x-csrf-token': csrfToken } : {})
        },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      rememberCsrf(data);
      return { ...data, ok: response.ok && data.ok !== false, status: response.status };
    } catch (error) {
      return {
        ok: false,
        error: error?.name === 'AbortError' ? 'request_timeout' : 'network_error',
        status: 0
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async function refreshSession() {
    return fetchJson('/api/auth/me', { timeoutMs: 6000 });
  }

  async function request(path, options = {}) {
    const method = String(options.method || 'GET').toUpperCase();
    const needsCsrf = !['GET', 'HEAD'].includes(method)
      && ![
        '/api/auth/signup',
        '/api/auth/login',
        '/api/auth/logout',
        '/api/auth/password-reset/request',
        '/api/auth/password-reset/confirm'
      ].includes(path);
    if (needsCsrf && !csrfToken) await refreshSession();
    let result = await fetchJson(path, { ...options, method });
    if (needsCsrf && result.status === 403 && result.error === 'csrf_required') {
      const session = await refreshSession();
      if (session.ok && csrfToken) result = await fetchJson(path, { ...options, method });
    }
    return result;
  }

  const MINUTE_QUEUE_KEY = 'learningai-minute-sync-queue';
  const readMinuteQueue = () => {
    try {
      const value = JSON.parse(localStorage.getItem(MINUTE_QUEUE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };
  async function flushMinuteQueue() {
    const pending = readMinuteQueue();
    if (!pending.length) return { ok: true, pending: 0 };
    const remaining = [];
    for (const entry of pending) {
      const result = await request('/api/v2/minutes', { method: 'POST', body: entry });
      if (!result.ok) remaining.push(entry);
    }
    localStorage.setItem(MINUTE_QUEUE_KEY, JSON.stringify(remaining.slice(-50)));
    return { ok: remaining.length === 0, pending: remaining.length };
  }
  async function queueMinutes(entry) {
    if (!entry?.clientSessionId || !Number.isFinite(Number(entry.minutes))) return { ok: false, error: 'invalid_minutes' };
    const queue = readMinuteQueue();
    if (!queue.some(item => item.clientSessionId === entry.clientSessionId)) queue.push(entry);
    localStorage.setItem(MINUTE_QUEUE_KEY, JSON.stringify(queue.slice(-50)));
    return flushMinuteQueue();
  }

  const friendlyError = result => {
    const messages = {
      email_exists: 'That email already has an account. Choose Sign in instead.',
      invalid_login: 'That email and password do not match.',
      invalid_email: 'Enter a valid email address.',
      invalid_password: 'Use at least 10 characters for your password.',
      invalid_reset_token: 'This reset link is invalid or has expired. Request a new one.',
      invalid_display_name: 'Add the name you want LearningAI to use.',
      csrf_required: 'Your secure session expired. Reload this page and try again.',
      rate_limited: 'Too many attempts. Wait a few minutes and try again.',
      request_timeout: 'The LearningAI service took too long to respond. Try again.',
      network_error: 'The LearningAI service is unavailable right now. Your lesson remains on this device.',
      unauthorized: 'Sign in again before continuing.',
      lesson_locked: 'Complete the previous lesson before saving this one.',
      // A real outage answers with one of these, not with network_error. Without
      // them every service failure fell through to the generic message, which
      // reads as "this button is broken" rather than "come back shortly".
      api_proxy_not_configured: 'LearningAI cannot reach its account service right now. Your work is safe on this device — try again in a few minutes.',
      api_proxy_unavailable: 'LearningAI cannot reach its account service right now. Your work is safe on this device — try again in a few minutes.',
      db_not_ready: 'LearningAI is still starting up. Your work is safe on this device — try again in a minute.',
      server_error: 'Something went wrong on the LearningAI service. Your work is safe on this device — try again shortly.',
      password_reset_unavailable: 'Password reset by email is not available yet. Email learningai4youprojects@duck.com and we will restore your access.',
      origin_not_allowed: 'This page was opened from an address LearningAI does not recognise. Go to learningai4you.com directly.'
    };
    return messages[result?.error] || 'Something went wrong. Your lesson remains safely on this device.';
  };

  function hydrateLocalState(state) {
    if (!state || typeof state !== 'object') return false;
    const user = state.user || {};
    if (user.id || user.email) {
      localStorage.setItem('learningai-prototype-account', JSON.stringify({
        id: user.id || '',
        email: user.email || '',
        displayName: user.displayName || user.display_name || 'Learner',
        mode: 'postgres',
        createdAt: user.createdAt || user.created_at || ''
      }));
    }
    const completed = {};
    for (const row of Array.isArray(state.progress) ? state.progress : []) {
      if (!row?.lessonId) continue;
      if (row.completedAt) completed[row.lessonId] = { completedAt: row.completedAt };
      const draftKey = `learningai-lesson-draft:${row.lessonId}`;
      try {
        const draft = JSON.parse(localStorage.getItem(draftKey) || '{}');
        const serverStep = Math.max(0, Number(row.currentStep) || 0);
        if (!row.completedAt && serverStep > (Number(draft.index) || 0)) {
          localStorage.setItem(draftKey, JSON.stringify({
            ...draft,
            index: serverStep,
            steps: draft.steps || {},
            restoredFromAccountAt: new Date().toISOString()
          }));
        }
      } catch {}
    }
    localStorage.setItem('learningai-progress', JSON.stringify({ completed, savedAt: new Date().toISOString() }));
    if (completed['chapter-1']) {
      localStorage.setItem('learningai-first-lesson-complete', JSON.stringify({
        lessonId: 'chapter-1',
        completedAt: completed['chapter-1'].completedAt
      }));
      localStorage.removeItem('learningai-first-lesson-pending');
    }
    if (state.assessment) {
      localStorage.setItem('learningai-diagnostic-prototype', JSON.stringify(state.assessment));
      if (state.assessment.ageRange) localStorage.setItem('learningai-age-range-prototype', state.assessment.ageRange);
      localStorage.setItem('learningai-site-unlocked', 'true');
    } else {
      localStorage.removeItem('learningai-site-unlocked');
    }
    if (Array.isArray(state.toolkit)) {
      let localCards = [];
      try {
        const stored = JSON.parse(localStorage.getItem('learningai-toolkit') || '[]');
        localCards = Array.isArray(stored) ? stored : [];
      } catch {}
      const serverCards = state.toolkit.map(card => {
        const fields = card.payload?.fields || card.payload || {};
        const body = typeof fields?.body === 'string'
          ? fields.body
          : Array.isArray(fields)
          ? fields.map(item => `${item.label || item.key || 'Note'}: ${item.value || ''}`).join('\n')
          : Object.entries(fields).map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`).join('\n');
        return {
          id: String(card.id),
          type: card.cardType || 'Lesson note',
          title: card.title || card.cardType || 'Saved note',
          body,
          lessonId: card.lessonId || '',
          createdAt: card.createdAt || card.updatedAt || new Date().toISOString(),
          synced: true
        };
      });
      const merged = new Map(localCards.map(card => [String(card.id), card]));
      serverCards.forEach(card => merged.set(String(card.id), { ...merged.get(String(card.id)), ...card }));
      localStorage.setItem('learningai-toolkit', JSON.stringify([...merged.values()].slice(0, 100)));
    }
    const serverMinutes = Math.max(0, Number(state.minutes?.totalMinutes) || 0);
    if (serverMinutes) {
      try {
        const key = 'learningai-learning-rhythm-v1';
        const rhythm = JSON.parse(localStorage.getItem(key) || '{}');
        const serverSeconds = serverMinutes * 60;
        const localSeconds = Math.max(0, Number(rhythm.totalSeconds) || 0);
        const serverIsNewer = serverSeconds >= localSeconds && !rhythm.running;
        localStorage.setItem(key, JSON.stringify({
          ...rhythm,
          totalSeconds: Math.max(localSeconds, serverSeconds),
          lastSessionTotalSeconds: serverIsNewer
            ? Math.max(Number(rhythm.lastSessionTotalSeconds) || 0, serverSeconds)
            : rhythm.lastSessionTotalSeconds,
          serverTotalMinutes: serverMinutes,
          restoredFromAccountAt: new Date().toISOString()
        }));
      } catch {}
    }
    return true;
  }

  window.LearningAIAPI = {
    base,
    friendlyError,
    health: () => request('/api/health', { timeoutMs: 5000 }),
    signup: data => request('/api/auth/signup', { method: 'POST', body: data }),
    login: data => request('/api/auth/login', { method: 'POST', body: data }),
    requestPasswordReset: email => request('/api/auth/password-reset/request', { method: 'POST', body: { email } }),
    confirmPasswordReset: (token, password) => request('/api/auth/password-reset/confirm', { method: 'POST', body: { token, password } }),
    me: () => request('/api/auth/me'),
    state: () => request('/api/v2/state'),
    hydrateLocalState,
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    saveProgress: progress => request('/api/v2/progress', { method: 'POST', body: progress }),
    saveAssessment: assessment => request('/api/v2/assessment', { method: 'PUT', body: { assessment } }),
    saveToolkit: card => request('/api/v2/toolkit', { method: 'POST', body: card }),
    deleteToolkit: id => request(`/api/v2/toolkit/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    saveMinutes: entry => request('/api/v2/minutes', { method: 'POST', body: entry }),
    queueMinutes,
    flushMinuteQueue,
    recordVisit: visit => request('/api/v2/visit', { method: 'POST', body: visit }),
    updateProfile: profile => request('/api/v2/profile', { method: 'PUT', body: profile }),
    deleteAccount: () => request('/api/v2/account', { method: 'DELETE', body: { confirmation: 'DELETE' } })
  };
})();
