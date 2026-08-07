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
