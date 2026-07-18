// Public, non-secret backend URL.
// Local V2 preview uses the dev backend so signup/questionnaire can be tested
// while the production Coolify API is unreachable.
(function configureLearningAiBackend() {
  const localHosts = new Set(['127.0.0.1', 'localhost']);
  const isLocal = localHosts.has(window.location.hostname);
  // The ?api= override is a dev tool. Never honor it on the live domain:
  // a crafted link could otherwise silently redirect visitors' backend
  // traffic (and stored override) to an attacker-controlled server.
  if (isLocal) {
    const defaultLocalBackend = 'http://127.0.0.1:8787';
    const params = new URLSearchParams(window.location.search);
    const explicitUrl = params.get('api');
    if (explicitUrl) localStorage.setItem('learningai-backend-url', explicitUrl);
    const savedUrl = localStorage.getItem('learningai-backend-url');
    if (savedUrl) {
      window.LEARNING_AI_BACKEND_URL = savedUrl;
      return;
    }
    window.LEARNING_AI_BACKEND_URL = window.location.port === '8788'
      ? 'http://127.0.0.1:8788'
      : defaultLocalBackend;
    return;
  }
  // Production uses the frontend's same-origin /api proxy. That keeps learner
  // sessions first-party and reaches the API over Railway's private network.
  window.LEARNING_AI_BACKEND_URL = window.location.origin;
})();
