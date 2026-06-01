/* Hidden V2 account/progress bridge. Requires ../backend-config.js first. */
(function initLearningAIV2Api() {
  function backendUrl() {
    return String(window.LEARNING_AI_BACKEND_URL || '').replace(/\/$/, '');
  }

  let csrfToken = '';

  async function request(path, options = {}) {
    const base = backendUrl();
    if (!base) return { ok: false, skipped: true, error: 'backend_not_configured' };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 8000);
    try {
      const response = await fetch(`${base}${path}`, {
        method: options.method || 'GET',
        headers: {
          'content-type': 'application/json',
          ...(options.method && options.method !== 'GET' && csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          ...(options.headers || {})
        },
        credentials: 'include',
        signal: controller.signal,
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const body = await response.json().catch(() => ({}));
      if (body.csrfToken) csrfToken = body.csrfToken;
      return { ...body, ok: response.ok && body.ok !== false, status: response.status };
    } catch (error) {
      return { ok: false, error: error.name === 'AbortError' ? 'request_timeout' : 'network_error' };
    } finally {
      clearTimeout(timeout);
    }
  }

  window.LearningAIV2Api = {
    signup(data) {
      return request('/api/auth/signup', { method: 'POST', body: data });
    },
    login(data) {
      return request('/api/auth/login', { method: 'POST', body: data });
    },
    logout() {
      return request('/api/auth/logout', { method: 'POST' });
    },
    me() {
      return request('/api/auth/me');
    },
    state() {
      return request('/api/v2/state');
    },
    importLocal(data) {
      return request('/api/v2/import-local', { method: 'POST', body: data });
    },
    saveAssessment(assessment) {
      return request('/api/v2/assessment', { method: 'PUT', body: { assessment } });
    },
    saveProgress(progress) {
      return request('/api/v2/progress', { method: 'POST', body: progress });
    },
    saveInteraction(interaction) {
      return request('/api/v2/interaction', { method: 'POST', body: interaction });
    },
    saveToolkit(card) {
      return request('/api/v2/toolkit', { method: 'POST', body: card });
    },
    saveMinutes(minutes) {
      return request('/api/v2/minutes', { method: 'POST', body: minutes });
    },
    saveVisit(visit) {
      return request('/api/v2/visit', { method: 'POST', body: visit });
    }
  };
})();
