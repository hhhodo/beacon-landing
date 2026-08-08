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

  let anchors = [];
  const measure = () => {
    const storyRect = story.getBoundingClientRect();
    const storyTop = storyRect.top + window.scrollY;
    anchors = slots.map((slot) => {
      const r = slot.getBoundingClientRect();
      return {
        x: r.left + window.scrollX - (storyRect.left + window.scrollX) + r.width / 2 - icon.offsetWidth / 2,
        y: r.top + window.scrollY - storyTop + r.height / 2 - icon.offsetHeight / 2,
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

  const update = () => {
    if (!anchors.length) return;
    const rect = story.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0,
      (window.innerHeight / 2 - rect.top) / rect.height
    ));
    const seg = progress * (anchors.length - 1);
    const i = Math.min(anchors.length - 2, Math.floor(seg));
    const t = seg - i;
    const x = lerp(anchors[i].x, anchors[i + 1].x, t);
    const y = lerp(anchors[i].y, anchors[i + 1].y, t);
    icon.style.transform = `translate(${x}px, ${y}px)`;
    drawFrame(Math.round(progress * (FRAME_COUNT - 1)));
  };

  measure();
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
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
