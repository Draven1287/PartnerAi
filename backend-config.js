// Public, non-secret backend URL.
// Local V2 preview uses the dev backend so signup/questionnaire can be tested
// while the production Coolify API is unreachable.
(function configureLearningAiBackend() {
  const localHosts = new Set(['127.0.0.1', 'localhost']);
  window.LEARNING_AI_BACKEND_URL = localHosts.has(window.location.hostname)
    ? 'http://127.0.0.1:8787'
    : 'https://api.learningai4you.com';
})();
