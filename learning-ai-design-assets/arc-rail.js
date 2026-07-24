(() => {
  const rail = document.querySelector('.arc-rail');
  if (!rail) return;
  const scrollBehavior = () => matchMedia('(prefers-reduced-motion:reduce)').matches || document.documentElement.dataset.motion === 'reduced' || document.documentElement.dataset.motion === 'none' ? 'auto' : 'smooth';
  let drag = null;
  rail.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('a,button')) return;
    drag = { id:event.pointerId, x:event.clientX, left:rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.classList.add('is-dragging');
  });
  rail.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    rail.scrollLeft = drag.left - (event.clientX - drag.x);
  });
  const finish = event => {
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    rail.classList.remove('is-dragging');
  };
  rail.addEventListener('pointerup', finish);
  rail.addEventListener('pointercancel', finish);
  rail.addEventListener('keydown', event => {
    const small = Math.max(120, Math.round(rail.clientWidth * .45));
    const large = Math.max(240, Math.round(rail.clientWidth * .82));
    const moves = { ArrowLeft:-small, ArrowRight:small, PageUp:-large, PageDown:large };
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      rail.scrollTo({ left:event.key === 'Home' ? 0 : rail.scrollWidth, behavior:scrollBehavior() });
    } else if (event.key in moves) {
      event.preventDefault();
      rail.scrollBy({ left:moves[event.key], behavior:scrollBehavior() });
    }
  });
})();
