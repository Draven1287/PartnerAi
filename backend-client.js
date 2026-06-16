/* Learning AI backend bridge.
   This file is intentionally inert until window.LEARNING_AI_BACKEND_URL is set. */
(function initLearningAIBackendBridge() {
  let csrfToken = '';

  function backendUrl() {
    return String(window.LEARNING_AI_BACKEND_URL || '').replace(/\/$/, '');
  }

  async function request(path, { method = 'GET', body } = {}) {
    const base = backendUrl();
    if (!base) return { ok: false, skipped: true, error: 'backend_not_configured' };

    const headers = body ? { 'content-type': 'application/json' } : {};
    if (method !== 'GET' && csrfToken) headers['x-csrf-token'] = csrfToken;

    try {
      const response = await fetch(`${base}${path}`, {
        method,
        headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined
      });
      const result = await response.json().catch(() => ({}));
      if (result.csrfToken) csrfToken = result.csrfToken;
      return { ok: response.ok, status: response.status, ...result };
    } catch (error) {
      return { ok: false, error: 'network_error', detail: String(error) };
    }
  }

  async function submitMinutes({ name, minutes, consent = false } = {}) {
    return request('/api/minutes', { method: 'POST', body: { name, minutes, consent } });
  }

  function adminLogin({ email, password } = {}) {
    return request('/api/admin/login', { method: 'POST', body: { email, password } });
  }

  function adminLogout() {
    return request('/api/admin/logout', { method: 'POST' }).then(result => {
      csrfToken = '';
      return result;
    });
  }

  window.LearningAIBackend = {
    health: () => request('/api/health'),
    adminLogin,
    adminLogout,
    adminMe: () => request('/api/admin/me'),
    adminOverview: () => request('/api/admin/overview'),
    submitMinutes
  };
})();
