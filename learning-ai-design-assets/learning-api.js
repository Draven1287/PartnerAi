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
      lesson_locked: 'Complete the previous lesson before saving this one.'
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
      if (!row?.lessonId || !row.completedAt) continue;
      completed[row.lessonId] = { completedAt: row.completedAt };
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
    updateProfile: profile => request('/api/v2/profile', { method: 'PUT', body: profile }),
    deleteAccount: () => request('/api/v2/account', { method: 'DELETE', body: { confirmation: 'DELETE' } })
  };
})();
