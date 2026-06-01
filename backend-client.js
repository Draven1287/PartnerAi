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

    const response = await fetch(`${base}/api/minutes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    return response.json();
  }

  window.LearningAIBackend = { submitMinutes };
})();
