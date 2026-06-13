/* Learning AI backend bridge.
   This file is intentionally inert until window.LEARNING_AI_BACKEND_URL is set. */
(function initLearningAIBackendBridge() {
  function backendUrl() {
    return String(window.LEARNING_AI_BACKEND_URL || '').replace(/\/$/, '');
  }

  async function submitMinutes({ name, minutes, consent = false } = {}) {
    const base = backendUrl();
    if (!base) return { ok: false, skipped: true, error: 'backend_not_configured' };

    const payload = {
      name,
      minutes,
      consent
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${base}/api/minutes`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
      const body = await response.json().catch(() => ({}));
      return { ...body, ok: response.ok && body.ok !== false };
    } catch (error) {
      return { ok: false, error: error.name === 'AbortError' ? 'request_timeout' : 'network_error' };
    } finally {
      clearTimeout(timeout);
    }
  }

  window.LearningAIBackend = { submitMinutes };
})();
