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
  document.querySelectorAll('a, button, .doc-section, .card-link, .quick-card, .plan-card, .info-card, .trouble-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
})();

// Reveal on scroll
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// Current year in footer
(function () {
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

// Documentation search
(function () {
  const input = document.getElementById('docs-search');
  if (!input) return;
  const sections = [...document.querySelectorAll('.searchable')];
  const hero = document.getElementById('start');
  const noResults = document.getElementById('no-results');
  const status = document.getElementById('search-status');

  const normalize = value => value.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').trim();

  function runSearch() {
    const q = normalize(input.value);
    if (!q) {
      sections.forEach(section => section.classList.remove('search-hidden'));
      if (hero) hero.classList.remove('search-hidden');
      if (noResults) noResults.hidden = true;
      if (status) status.textContent = '';
      return;
    }

    if (hero) hero.classList.remove('search-hidden');
    let matches = 0;
    sections.forEach(section => {
      const haystack = normalize((section.dataset.searchTitle || '') + ' ' + section.textContent);
      const ok = haystack.includes(q);
      section.classList.toggle('search-hidden', !ok);
      if (ok) matches++;
    });
    if (noResults) noResults.hidden = matches !== 0;
    if (status) status.textContent = matches ? `Найдено разделов: ${matches}` : 'Совпадений не найдено';
  }

  input.addEventListener('input', runSearch);
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      input.focus();
    }
    if (e.key === 'Escape' && document.activeElement === input) {
      input.value = '';
      runSearch();
      input.blur();
    }
  });
})();

// Sidebar active state + mobile drawer
(function () {
  const sidebar = document.querySelector('.docs-sidebar');
  if (!sidebar) return;
  const links = [...document.querySelectorAll('.sidebar-link[href^="#"]')];
  const toggle = document.querySelector('.sidebar-toggle');
  const backdrop = document.querySelector('.sidebar-backdrop');

  function closeDrawer() {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', open);
      if (backdrop) backdrop.classList.toggle('show', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  links.forEach(link => link.addEventListener('click', closeDrawer));

  const targets = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + visible.target.id));
  }, { rootMargin: '-18% 0px -65% 0px', threshold: [0, .1, .5] });
  targets.forEach(target => observer.observe(target));
})();
