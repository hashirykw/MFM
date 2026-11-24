/* MFM v2 · small additions that run before the engine boots.
   The deck: groups of cards are set one over the next in 3D on laptops (see .v2-deck in mfm.css);
   on phones they stay a swipe rail. */
(function () {
  'use strict';
  var DECKS = ['.acc-grid', '.cw-track'];
  DECKS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (g) {
      var cards = Array.prototype.filter.call(g.children, function (c) { return c.classList.contains('card'); });
      if (cards.length < 2 || cards.length > 6) return;
      g.classList.add('v2-deck', 'v2-deck-' + cards.length);
      cards.forEach(function (c, i) { c.style.setProperty('--i', i); });
    });
  });
})();
(function () {
  'use strict';
  var fit = function () {
    document.querySelectorAll('.v2-deck').forEach(function (g) {
      var n = g.classList.contains('v2-deck-6') ? 1100 : 700;
      var on = innerWidth >= n;
      g.classList.toggle('v2-on', on);
      /* the swipe-rail rules live in a cascade layer with !important, so the deck steps out of them by dropping the attribute */
      if (on && g.hasAttribute('data-rail')) { g.dataset.railWas = g.getAttribute('data-rail'); g.removeAttribute('data-rail'); }
      if (!on && g.dataset.railWas != null && !g.hasAttribute('data-rail')) g.setAttribute('data-rail', g.dataset.railWas);
    });
  };
  fit(); addEventListener('resize', fit, { passive: true });
})();
/* deck: click (or Enter) opens a card flat and dims the rest; outside click or Escape closes */
(function () {
  'use strict';
  document.querySelectorAll('.v2-deck').forEach(function (g) {
    var hint = document.createElement('p'); hint.className = 'v2-deck-hint';
    hint.textContent = g.classList.contains('acc-grid') ? 'Hover a card to lift it · click to open it' : 'Hover a card to lift it · click to read it flat';
    (g.nextElementSibling && g.nextElementSibling.classList.contains('rail-ctl') ? g.nextElementSibling : g).after(hint);
    var close = function () { g.classList.remove('picked'); g.querySelectorAll('.card.on').forEach(function (c) { c.classList.remove('on'); }); };
    g.addEventListener('click', function (e) {
      if (!g.classList.contains('v2-on')) return;
      var c = e.target.closest('.card'); if (!c || c.parentElement !== g) return;
      if (e.target.closest('a,button') && c.classList.contains('on')) return; /* links work once the card is open */
      if (e.target.closest('a') && !c.classList.contains('on')) e.preventDefault();
      var was = c.classList.contains('on'); close();
      if (!was) { c.classList.add('on'); g.classList.add('picked'); }
    });
    g.querySelectorAll(':scope > .card').forEach(function (c) {
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
      c.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === c && g.classList.contains('v2-on')) { e.preventDefault(); c.click(); } });
    });
    document.addEventListener('click', function (e) { if (!g.contains(e.target)) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    /* once the spread has landed, hovers answer at once instead of waiting their stagger */
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setTimeout(function () { g.classList.add('set'); }, 1600); io.disconnect(); } }); io.observe(g); } else g.classList.add('set');
  });
})();
