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

// Story section: a transparent WebP frame sequence, scrubbed by scroll position —
// each scroll step just draws the matching frame straight onto the canvas (no video
// codec to strip alpha, no async seek to miss), and it also travels between each
// row's empty slot as it scrubs.
(function () {
  const story = document.getElementById('story');
  const icon = document.getElementById('story-icon');
  if (!story || !icon) return;
  const ctx = icon.getContext('2d');

  const FRAME_COUNT = 121;
  const frames = new Array(FRAME_COUNT);
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.src = `assets/images/story-frames/frame-${String(i + 1).padStart(3, '0')}.webp`;
    frames[i] = img;
  }

  const slots = Array.from(story.querySelectorAll('[data-story-slot]'));
  if (!slots.length) return;

  // Anchors are recomputed on every frame instead of once at load — a late web-font
  // swap (Noto Sans KR loads async) reflows the text rows and shifts the slots, and a
  // one-time measurement taken before that swap would silently go stale, leaving the
  // icon parked at the wrong (pre-reflow) coordinates for the rest of the page's life.
  const getAnchors = () => {
    const storyRect = story.getBoundingClientRect();
    return slots.map((slot) => {
      const r = slot.getBoundingClientRect();
      return {
        x: r.left - storyRect.left + r.width / 2 - icon.offsetWidth / 2,
        y: r.top - storyRect.top + r.height / 2 - icon.offsetHeight / 2,
      };
    });
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  let currentFrame = -1;

  const drawFrame = (index) => {
    if (index === currentFrame) return;
    const img = frames[index];
    if (!img.complete) { img.onload = () => drawFrame(index); return; }
    currentFrame = index;
    ctx.clearRect(0, 0, icon.width, icon.height);
    ctx.drawImage(img, 0, 0, icon.width, icon.height);
  };

  const render = () => {
    const anchors = getAnchors();
    // Progress is tied to the first/last slot's own position reaching the viewport
    // center — not the section's outer padded box — so the animation starts exactly
    // when row 1 comes into view (matching where the icon should first appear) and
    // ends when the last row does, instead of starting late/early relative to the
    // section's top/bottom padding.
    const firstCenter = slots[0].getBoundingClientRect().top + slots[0].offsetHeight / 2;
    const lastCenter = slots[slots.length - 1].getBoundingClientRect().top + slots[slots.length - 1].offsetHeight / 2;
    const viewportCenter = window.innerHeight / 2;
    const progress = Math.min(1, Math.max(0,
      (viewportCenter - firstCenter) / (lastCenter - firstCenter)
    ));
    const seg = progress * (anchors.length - 1);
    const i = Math.min(anchors.length - 2, Math.floor(seg));
    const tRaw = seg - i;
    // Dwell zone: the icon sits still (parked exactly on the row) for the first/last
    // 25% of each inter-row scroll span and only actually travels through the middle
    // 50% — plain linear interpolation the whole span meant it started drifting the
    // instant a row passed center, which read as "it's already moving" instead of
    // "it waited here, centered, before moving on."
    const t = Math.min(1, Math.max(0, (tRaw - 0.25) / 0.5));
    const x = lerp(anchors[i].x, anchors[i + 1].x, t);
    const y = lerp(anchors[i].y, anchors[i + 1].y, t);
    icon.style.transform = `translate(${x}px, ${y}px)`;
    drawFrame(Math.round(progress * (FRAME_COUNT - 1)));
  };

  // rAF-throttled: scroll can fire many times per frame, getBoundingClientRect
  // doesn't need to run more often than the screen can actually repaint.
  let ticking = false;
  const update = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { render(); ticking = false; });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
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
