// ShadowVPN docs — shared scripts

// Custom cursor (skip on touch)
(function () {
  if (matchMedia('(hover: none)').matches) return;
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .doc-section, .card-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
})();

// Reveal on scroll
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// Current year in footer
(function () {
  const y = document.querySelectorAll('[data-year]');
  y.forEach(el => el.textContent = new Date().getFullYear());
})();
