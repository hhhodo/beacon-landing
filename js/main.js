// BEACON landing — nav scroll state (transparent over hero, solid once scrolled past it)
(function () {
  const navEl = document.querySelector('.nav');
  const heroEl = document.querySelector('.hero');
  if (!navEl || !heroEl) return;

  const setState = () => {
    const scrolled = window.scrollY > heroEl.offsetHeight - navEl.offsetHeight;
    navEl.classList.toggle('is-scrolled', scrolled);
  };

  setState();
  window.addEventListener('scroll', setState, { passive: true });
})();

// Features row: clone the card set once so the marquee's CSS animation (0 to -50%)
// loops seamlessly — the clone makes -50% pixel-identical to the start.
(function () {
  const track = document.querySelector('.peek-track');
  if (!track) return;
  for (const card of Array.from(track.children)) {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    for (const el of clone.querySelectorAll('[id]')) el.removeAttribute('id');
    track.append(clone);
  }
})();

// Features row: allow the card strip to be moved directly with a pointer drag.
(function () {
  const row = document.querySelector('.peek-row');
  const track = row?.querySelector('.peek-track');
  if (!row || !track) return;

  let startX = 0;
  let startScrollLeft = 0;
  let dragging = false;

  row.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startScrollLeft = row.scrollLeft;
    row.setPointerCapture(event.pointerId);
    row.classList.add('is-dragging');
    track.style.animationPlayState = 'paused';
  });

  row.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    event.preventDefault();
    row.scrollLeft = startScrollLeft - (event.clientX - startX);
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    if (row.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
    row.classList.remove('is-dragging');
    track.style.animationPlayState = '';
  };

  row.addEventListener('pointerup', stopDragging);
  row.addEventListener('pointercancel', stopDragging);
})();

// Work section: arrow buttons page the scroll-snap row one card+gap at a time.
(function () {
  const row = document.querySelector('.work-peek');
  const prevBtn = document.querySelector('[data-work-prev]');
  const nextBtn = document.querySelector('[data-work-next]');
  if (!row || !prevBtn || !nextBtn) return;

  const step = () => {
    const card = row.querySelector('.work-card');
    const gap = parseFloat(getComputedStyle(row).columnGap || 0);
    return (card ? card.offsetWidth : row.clientWidth) + gap;
  };

  prevBtn.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
})();

// FAQ: click a question to expand its answer (closes the others).
(function () {
  const items = document.querySelectorAll('.faq__item');
  items.forEach((item) => item.addEventListener('click', () => {
    const open = item.getAttribute('aria-expanded') === 'true';
    items.forEach((i) => i.setAttribute('aria-expanded', 'false'));
    item.setAttribute('aria-expanded', String(!open));
  }));
})();
