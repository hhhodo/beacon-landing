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
