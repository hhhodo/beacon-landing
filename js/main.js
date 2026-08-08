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

// Three distinct rotation behaviors across the scroll (not one formula scaled
// uniformly the whole way) — each third of the section reads differently:
// 1) a flat in-plane spin only, 2) a 3D flip while still spinning the same way,
// 3) rolling back the opposite direction. Values line up at each boundary so
// there's no jump between phases.
// Degrees per phase cut roughly in half (plus the row gap is now 640, so there's
// twice the scroll distance to cover the same rotation) — much calmer/slower.
function rotationForProgress(progress) {
  if (progress < 1 / 3) {
    const t = progress / (1 / 3);
    return { rotateY: 0, rotateZ: t * 150 };
  }
  if (progress < 2 / 3) {
    const t = (progress - 1 / 3) / (1 / 3);
    return { rotateY: t * 150, rotateZ: 150 + t * 150 };
  }
  const t = (progress - 2 / 3) / (1 / 3);
  return { rotateY: 150 - t * 150, rotateZ: 300 - t * 220 };
}

// Story section: one image, moved by scroll position instead of an autoplaying
// loop. It travels between each row's empty slot (linear interpolation) as the
// section scrolls through the viewport, with a scroll-tied rotation that changes
// character (see rotationForProgress) rather than a single repeated motion.
(function () {
  const story = document.getElementById('story');
  const icon = document.getElementById('story-icon');
  if (!story || !icon) return;

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
    const { rotateY, rotateZ } = rotationForProgress(progress);
    icon.style.transform =
      `translate(${x}px, ${y}px) perspective(800px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
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
