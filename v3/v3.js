(function enhanceLearningAIV3() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const routeWash = document.querySelector('.v3-route-wash');
  const shell = document.querySelector('.v3-shell-nav');
  const skipLink = document.querySelector('.v3-skip');
  const app = document.getElementById('app');
  let lastView = null;

  function isReduced() {
    return reduceMotion.matches || document.body.dataset.motion === 'reduced';
  }

  function updateScrollEvidence() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.max(0, Math.min(1, window.scrollY / max));
    shell?.style.setProperty('--v3-scroll', String(ratio));
  }

  function markViewEntry() {
    const view = document.querySelector('#app > .view');
    if (!view || view === lastView) return;
    lastView = view;
    if (isReduced()) return;
    view.classList.add('v3-entering');
    window.setTimeout(() => view.classList.remove('v3-entering'), 700);
  }

  function announceRouteMotion() {
    if (!routeWash || isReduced()) return;
    routeWash.classList.remove('is-moving');
    void routeWash.offsetWidth;
    routeWash.classList.add('is-moving');
  }

  const observer = new MutationObserver(markViewEntry);
  if (app) observer.observe(app, { childList: true });

  skipLink?.addEventListener('click', event => {
    event.preventDefault();
    if (!app) return;
    window.setTimeout(() => {
      app.focus({ preventScroll: true });
      app.scrollIntoView({ block: 'start' });
    }, 0);
  });

  window.addEventListener('hashchange', announceRouteMotion);
  window.addEventListener('scroll', updateScrollEvidence, { passive: true });
  window.addEventListener('resize', updateScrollEvidence, { passive: true });
  reduceMotion.addEventListener?.('change', () => {
    if (isReduced()) {
      routeWash?.classList.remove('is-moving');
      document.querySelectorAll('.v3-entering').forEach(view => view.classList.remove('v3-entering'));
    }
  });
  markViewEntry();
  updateScrollEvidence();
})();
