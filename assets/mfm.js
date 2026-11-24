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
