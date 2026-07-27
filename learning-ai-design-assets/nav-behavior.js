(function () {
  const navShell = document.querySelector('#navShell') || document.querySelector('.nav-shell');
  if (!navShell) return;

  document.querySelectorAll('nav a').forEach(link => {
    if (link.textContent.trim() === 'Progress') link.href = './progress.html';
  });

  let lastY = window.scrollY;
  let settleTimer = 0;
  const reveal = () => navShell.classList.remove('is-passing');
  const syncSurface = () => {
    const past = window.scrollY > 12;
    navShell.classList.toggle('is-over-content', past);
    /* The glass used to switch from translucent to near-opaque the instant you
       moved 12px, which is what read as a jolt. Publish how far down the page
       we are so the CSS can ease the same change across ~150px instead.

       That easing is motion, even though no transition or animation drives it —
       it is keyed to the scroll position rather than to time, which is why it
       survived two attempts to switch motion off and still looked wrong. Under
       Reduced it is worse than under Standard: theme.css transitions the
       capsule's colours over 120ms, so a value that changes on every scroll
       event is chased rather than followed, and the glass lags behind the page.

       So only Standard gets the continuous value. The other two settings snap
       to the same two end states the threshold already picks, which is what
       "reduced" and "none" should mean. */
    const eased = document.documentElement.dataset.motion === 'standard';
    navShell.style.setProperty('--nav-scroll',
      eased ? String(Math.min(1, Math.max(0, window.scrollY / 150))) : (past ? '1' : '0'));
  };
  const settle = () => {
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => navShell.classList.remove('is-scrolling'), 520);
  };

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;
    reveal();
    syncSurface();
    if (document.documentElement.dataset.motion !== 'none' && Math.abs(delta) > 1 && y > 12) navShell.classList.add('is-scrolling');
    if (y < 12) navShell.classList.remove('is-scrolling');
    settle();
    lastY = y;
  }, {passive: true});

  window.addEventListener('pointermove', event => {
    if (event.clientY < 92) reveal();
  }, {passive: true});
  navShell.addEventListener('focusin', reveal);
  navShell.addEventListener('mouseenter', reveal);
  new MutationObserver(() => {
    if (navShell.classList.contains('is-passing')) reveal();
  }).observe(navShell, {attributes: true, attributeFilter: ['class']});
  syncSurface();
})();
