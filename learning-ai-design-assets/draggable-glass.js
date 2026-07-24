(() => {
  const STORAGE_KEY = 'learningai-glass-nav-position-v1';
  const shell = document.querySelector('#navShell');
  const glass = shell?.querySelector('.nav-glass');
  if (!shell || !glass) return;

  let position = { x: 0, y: 0 };
  let drag = null;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) position = saved;
  } catch (_) {}

  const draggable = () => matchMedia('(min-width: 821px)').matches;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const bounds = () => ({
    x: Math.max(0, (innerWidth - shell.offsetWidth) / 2 - 10),
    minY: -8,
    maxY: Math.max(0, innerHeight - shell.offsetHeight - 28)
  });
  const normalize = point => {
    const limit = bounds();
    return {
      x: clamp(point.x, -limit.x, limit.x),
      y: clamp(point.y, limit.minY, limit.maxY)
    };
  };
  const render = () => {
    position = normalize(position);
    shell.style.setProperty('--drag-x', `${position.x}px`);
    shell.style.setProperty('--drag-y', `${position.y}px`);
  };
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(position)); } catch (_) {}
  };

  glass.setAttribute('aria-description', 'Drag an empty part of this glass navigation bar to reposition it. Double-click empty glass to reset it.');
  glass.title = 'Drag empty glass to move · Double-click to reset';
  render();

  glass.addEventListener('pointerdown', event => {
    if (!draggable() || event.button !== 0 || event.target.closest('a, button')) return;
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y
    };
    glass.setPointerCapture(event.pointerId);
    shell.classList.add('is-dragging');
    event.preventDefault();
  });

  glass.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    position = normalize({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY
    });
    render();
  });

  const finishDrag = event => {
    if (!drag || drag.id !== event.pointerId) return;
    drag = null;
    shell.classList.remove('is-dragging');
    save();
  };
  glass.addEventListener('pointerup', finishDrag);
  glass.addEventListener('pointercancel', finishDrag);

  glass.addEventListener('dblclick', event => {
    if (!draggable() || event.target.closest('a, button')) return;
    shell.classList.add('is-resetting');
    position = { x: 0, y: 0 };
    render();
    save();
    setTimeout(() => shell.classList.remove('is-resetting'), 430);
  });

  addEventListener('resize', render, { passive: true });
})();
