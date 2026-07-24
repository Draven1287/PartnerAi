(() => {
  if (!matchMedia('(min-width: 821px)').matches) return;
  document.querySelectorAll('.dashboard-card[data-draggable]').forEach(card => {
    const handle = card.querySelector('.panel-handle');
    if (!handle) return;
    let point = { x: 0, y: 0 };
    let drag = null;

    const render = () => {
      card.style.setProperty('--panel-x', `${point.x}px`);
      card.style.setProperty('--panel-y', `${point.y}px`);
    };
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, ox: point.x, oy: point.y };
      handle.setPointerCapture(event.pointerId);
      card.classList.add('is-dragging');
      event.preventDefault();
    });
    handle.addEventListener('pointermove', event => {
      if (!drag || drag.id !== event.pointerId) return;
      const rect = card.getBoundingClientRect();
      point.x = clamp(drag.ox + event.clientX - drag.x, -rect.left + 18, innerWidth - rect.right - 18 + point.x);
      point.y = clamp(drag.oy + event.clientY - drag.y, -rect.top + 92, innerHeight - rect.bottom - 22 + point.y);
      render();
    });
    const finish = event => {
      if (!drag || drag.id !== event.pointerId) return;
      drag = null;
      card.classList.remove('is-dragging');
    };
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
    handle.addEventListener('dblclick', () => { point = { x: 0, y: 0 }; render(); });
  });
})();
