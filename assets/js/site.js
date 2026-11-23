(function () {
  var doc = document.documentElement;
  var head = document.querySelector('.site-head');

  /* Header turns solid once the hero starts to leave */
  var sentinel = document.querySelector('[data-head-sentinel]');
  if (head && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      head.classList.toggle('is-solid', !e[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);
  } else if (head) { head.classList.add('is-solid'); }

  /* Mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    var setMenu = function (open) {
      doc.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Solutions index: tabs on desktop, stacked panels on mobile */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sol-tab'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  /* Before and after compare */
  document.querySelectorAll('.compare').forEach(function (c) {
    var r = c.querySelector('input[type=range]');
    if (!r) return;
    var set = function () { c.style.setProperty('--pos', r.value + '%'); };
    r.addEventListener('input', set); set();
  });

  /* Reviews scroller buttons */
  var rv = document.querySelector('.reviews');
  document.querySelectorAll('[data-rev]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!rv) return;
      var card = rv.querySelector('blockquote');
      var step = card ? card.getBoundingClientRect().width + 20 : 400;
      rv.scrollBy({ left: step * (b.getAttribute('data-rev') === 'next' ? 1 : -1), behavior: 'smooth' });
    });
  });

  /* Booking form: opens WhatsApp with the message filled in */
  var form = document.getElementById('book-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        var f = el.closest('.field');
        var bad = !el.value.trim() || (el.type === 'tel' && el.value.replace(/\D/g, '').length < 9);
        f.classList.toggle('invalid', bad);
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;
      var v = function (n) { return (form.elements[n] && form.elements[n].value.trim()) || ''; };
      var msg = 'Hi Jeanné, I would like to book a private consultation.\n\n' +
        'Name: ' + v('name') + '\n' +
        'Phone: ' + v('phone') + '\n' +
        'Interested in: ' + v('interest') +
        (v('message') ? '\n\n' + v('message') : '');
      window.open('https://wa.me/27832406113?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('input', function () { var f = el.closest('.field'); if (f) f.classList.remove('invalid'); });
    });
  }

  /* Reveal on scroll */
  var rev = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    rev.forEach(function (el) { ro.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
