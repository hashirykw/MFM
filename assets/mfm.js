/* MFM v2 · additions that run before the engine boots.
   The flow: card groups sit on a curve, the middle card facing you and the others turning
   inward and stepping back (the glass-carousel reference). Prev / next, dots, swipe, arrow keys;
   a side card clicked slides to the centre. */
(function () {
  'use strict';
  var CH = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };
  document.querySelectorAll('.acc-grid,.cw-track').forEach(function (g) {
    var cards = Array.prototype.filter.call(g.children, function (c) { return c.classList.contains('card'); });
    if (cards.length < 2) return;
    if (g.hasAttribute('data-rail')) { g.dataset.railWas = g.getAttribute('data-rail'); g.removeAttribute('data-rail'); }
    g.classList.add('v2-flow', g.classList.contains('cw-track') ? 'v2-flow-words' : 'v2-flow-courses');
    /* the curve is always whole: no scroll fade on its cards (rotated cards can miss the reveal) */
    cards.forEach(function (c) { c.removeAttribute('data-rv'); c.classList.remove('rv-wait'); });
    g.setAttribute('role', 'region'); g.setAttribute('aria-roledescription', 'carousel');
    var n = cards.length, act = g.classList.contains('cw-track') ? 2 : 0;
    var title = function (c) { var h = c.querySelector('h3,b'); return h ? h.textContent.trim() : ''; };
    var ctl = document.createElement('div'); ctl.className = 'v2-flow-ctl';
    ctl.innerHTML = '<button type="button" class="v2-flow-b" data-d="-1" aria-label="Previous">' + CH(-1) + '</button>' +
      '<span class="v2-flow-now"><em class="v2-fn" aria-hidden="true"></em><span class="v2-ft"><b aria-live="polite"></b></span></span>' +
      '<button type="button" class="v2-flow-b" data-d="1" aria-label="Next">' + CH(1) + '</button>';
    var dots = document.createElement('div'); dots.className = 'v2-flow-dots';
    dots.innerHTML = cards.map(function (c, i) { return '<button type="button" aria-label="' + title(c).replace(/"/g, '') + '"></button>'; }).join('');
    g.after(ctl); ctl.querySelector('.v2-ft').appendChild(dots);
    var pad = function (v) { return (v < 10 ? '0' : '') + v; }, last = -1;
    function set(k) {
      act = (k + n) % n;
      cards.forEach(function (c, i) {
        var d = i - act;
        /* wrap so the curve stays balanced on both sides */
        if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        c.style.setProperty('--d', d); c.style.setProperty('--ad', Math.abs(d)); c.style.zIndex = 20 - Math.abs(d);
        c.classList.toggle('is-c', d === 0); c.classList.toggle('is-far', Math.abs(d) > 2);
        c.setAttribute('aria-hidden', Math.abs(d) > 2 ? 'true' : 'false');
        c.tabIndex = d === 0 ? 0 : -1;
      });
      var sb = cards[act].querySelector('.acc-sub'), tb = ctl.querySelector('.v2-ft b');
      tb.textContent = title(cards[act]); if (sb) { var sm = document.createElement('small'); sm.textContent = sb.textContent.trim().replace(/^Cambridge /i, ''); tb.appendChild(sm); }
      var fn = ctl.querySelector('.v2-fn'); fn.innerHTML = pad(act + 1) + '<small>/' + pad(n) + '</small>';
      if (last !== -1 && last !== act && fn.animate) { var up = (act > last) !== (Math.abs(act - last) > 1); fn.animate([{ transform: 'translateY(' + (up ? 8 : -8) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' }); ctl.querySelector('.v2-ft b').animate([{ opacity: 0, transform: 'translateX(' + (up ? 10 : -10) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' }); }
      last = act;
      Array.prototype.forEach.call(dots.children, function (b, i) { b.classList.toggle('on', i === act); });
    }
    cards.forEach(function (c, i) {
      c.addEventListener('click', function (e) { if (!c.classList.contains('is-c')) { e.preventDefault(); e.stopImmediatePropagation(); set(i); } }, true);
    });
    ctl.addEventListener('click', function (e) { var b = e.target.closest('[data-d]'); if (b) set(act + +b.dataset.d); });
    dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(Array.prototype.indexOf.call(dots.children, b)); });
    g.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { set(act + 1); cards[act].focus({ preventScroll: true }); } if (e.key === 'ArrowLeft') { set(act - 1); cards[act].focus({ preventScroll: true }); } });
    /* drag: the curve turns with the finger (or mouse) and settles on the nearest card */
    var gapPx = function () { var c = cards[act]; return (c.offsetWidth || 260) * (g.classList.contains('v2-flow-words') ? .7 : .62); };
    var x0 = null, y0 = 0, frac = 0, moved = false, lock = null, base = act;
    function place(f) {
      cards.forEach(function (c, i) {
        var d = i - base - f; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
        c.style.setProperty('--d', d.toFixed(3)); c.style.setProperty('--ad', Math.abs(d).toFixed(3)); c.style.zIndex = 20 - Math.round(Math.abs(d));
        c.classList.toggle('is-far', Math.abs(d) > 2.4);
      });
    }
    g.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('a,button,input,select,textarea')) return;
      x0 = e.clientX; y0 = e.clientY; frac = 0; moved = false; lock = null; base = act;
    });
    g.addEventListener('pointermove', function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (lock == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (lock === 'x') { g.classList.add('dragging'); try { g.setPointerCapture(e.pointerId); } catch (er) { } } }
      if (lock !== 'x') return;
      e.preventDefault(); moved = true;
      frac = -dx / gapPx(); place(frac);
    });
    var end = function () {
      if (x0 == null) return; x0 = null; g.classList.remove('dragging');
      if (lock === 'x') set(Math.round(base + frac)); lock = null;
    };
    g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end); g.addEventListener('lostpointercapture', end);
    g.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopImmediatePropagation(); moved = false; } }, true);
    /* trackpads: a sideways two-finger swipe turns it too */
    var wacc = 0, wt = 0;
    g.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); wacc += e.deltaX; clearTimeout(wt); wt = setTimeout(function () { wacc = 0; }, 180);
      if (Math.abs(wacc) > 60) { set(act + (wacc > 0 ? 1 : -1)); wacc = 0; }
    }, { passive: false });
    set(act);
    /* the curve is as tall as its tallest card, so nothing is cut off and the controls never slide under a card */
    var fit = function () { g.style.removeProperty('--ch'); var base = parseFloat(getComputedStyle(cards[0]).height) || 0, need = 0; cards.forEach(function (c) { need = Math.max(need, c.scrollHeight); }); if (need > base + 1) g.style.setProperty('--ch', Math.ceil(need) + 'px'); };
    fit(); if (document.fonts) document.fonts.ready.then(fit); addEventListener('load', fit); var fz = 0; addEventListener('resize', function () { clearTimeout(fz); fz = setTimeout(fit, 150); });
    /* it revolves on its own while in view; a hover, a touch, a drag or keyboard focus pauses it */
    var RMq = matchMedia('(prefers-reduced-motion: reduce)').matches, vis = false, hold = false, tmr = 0;
    var tick = function () { clearTimeout(tmr); if (RMq) return; tmr = setTimeout(function () { if (vis && !hold && !document.hidden) set(act + 1); tick(); }, 3800); };
    ['pointerenter', 'focusin', 'pointerdown'].forEach(function (ev) { g.addEventListener(ev, function () { hold = true; }); ctl.addEventListener(ev, function () { hold = true; }); });
    ['pointerleave', 'focusout'].forEach(function (ev) { g.addEventListener(ev, function () { hold = false; tick(); }); ctl.addEventListener(ev, function () { hold = false; tick(); }); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) tick(); }, { threshold: .45 }).observe(g);
  });
})();
/* themed dropdowns: every native <select> gets a glass list in the site's style (the select stays underneath for forms and scripts) */
(function () {
  'use strict';
  var CHEV = '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>';
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function closeAll(except) { document.querySelectorAll('.xsel.open').forEach(function (x) { if (x !== except) x._close(); }); }
  function enhance(sel) {
    if (sel._x || sel.multiple || sel.size > 1) return;
    var wrap = document.createElement('div'); wrap.className = 'xsel';
    sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'xsel-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    var lb = sel.id && document.querySelector('label[for="' + sel.id + '"]');
    if (lb) { lb.id = lb.id || sel.id + '-lb'; btn.setAttribute('aria-labelledby', lb.id); lb.addEventListener('click', function (e) { e.preventDefault(); btn.focus(); }); }
    var list = document.createElement('ul'); list.className = 'xsel-list'; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
    wrap.appendChild(btn); wrap.appendChild(list);
    var act = -1;
    function sync() {
      var o = sel.options[sel.selectedIndex];
      btn.innerHTML = '<span class="' + (!o || o.value === '' ? 'ph' : '') + '">' + esc(o ? o.textContent : '') + '</span>' + CHEV;
      btn.disabled = sel.disabled;
    }
    function build() {
      list.innerHTML = Array.prototype.map.call(sel.options, function (o, i) {
        return '<li role="option" data-i="' + i + '" aria-selected="' + (i === sel.selectedIndex ? 'true' : 'false') + '"' + (o.disabled ? ' aria-disabled="true"' : '') + '><span>' + esc(o.textContent) + '</span></li>';
      }).join('');
    }
    function mark() { Array.prototype.forEach.call(list.children, function (li, i) { li.classList.toggle('act', i === act); }); var c = list.children[act]; if (c) c.scrollIntoView({ block: 'nearest' }); }
    function open() {
      closeAll(wrap); build();
      var r = btn.getBoundingClientRect(); wrap.classList.toggle('up', innerHeight - r.bottom < 260 && r.top > 300);
      wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); act = Math.max(0, sel.selectedIndex); mark();
    }
    function close(focus) { if (!wrap.classList.contains('open')) return; wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus({ preventScroll: true }); }
    wrap._close = close;
    function pick(i) { var o = sel.options[i]; if (!o || o.disabled) return; sel.selectedIndex = i; sync(); sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(true); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); wrap.classList.contains('open') ? close() : open(); });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) { e.stopPropagation(); pick(+li.dataset.i); } });
    btn.addEventListener('keydown', function (e) {
      var isOpen = wrap.classList.contains('open');
      if (!isOpen && ['ArrowDown', 'ArrowUp', 'Enter', ' '].indexOf(e.key) > -1) { e.preventDefault(); open(); return; }
      if (!isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); act = Math.min(act + 1, sel.options.length - 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); act = Math.max(act - 1, 0); mark(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(act); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
      else if (e.key === 'Tab') close();
    });
    sel.addEventListener('change', sync);
    new MutationObserver(function () { sync(); if (wrap.classList.contains('open')) build(); }).observe(sel, { childList: true, subtree: true, attributes: true });
    /* scripts that set .value directly do not fire change: keep the label honest */
    var d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (d && d.set) Object.defineProperty(sel, 'value', { get: function () { return d.get.call(sel); }, set: function (v) { d.set.call(sel, v); sync(); }, configurable: true });
    sel._x = { sync: sync };
    sync();
  }
  function all(root) { (root || document).querySelectorAll('select').forEach(enhance); }
  document.addEventListener('click', function () { closeAll(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  var run = function () { all(); new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType !== 1) return; if (n.tagName === 'SELECT') enhance(n); else if (n.querySelectorAll) all(n); }); }); }).observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

/* course cards: the card shows the syllabus; the details open in the site's pop-up */
(function () {
  'use strict';
  document.querySelectorAll('.acc.card').forEach(function (c) {
    var open = function (e) {
      if (e && e.target.closest('a')) return;
      if (c.closest('.v2-flow') && !c.classList.contains('is-c')) return; /* side cards first slide to the centre */
      if (!window.RA || !RA.modal) return;
      var img = c.querySelector('.acc-ph img'), ok = img && img.complete && img.naturalWidth;
      var tag = c.querySelector('.acc-h .tag'), h = c.querySelector('.acc-h h3'), sub = c.querySelector('.acc-sub'), code = c.querySelector('.code');
      var body = c.querySelector('.acc-t'), link = c.querySelector('.acc-f a.link');
      RA.modal('<div class="acc-pop">' + (ok ? '<figure class="acc-pop-ph"><img src="' + img.getAttribute('src') + '" alt=""></figure>' : '') +
        '<div class="acc-pop-h"><div>' + (tag ? '<span class="tag">' + tag.textContent + '</span>' : '') + '<h2 id="mTitle">' + (h ? h.textContent : '') + '</h2>' + (sub ? '<p class="acc-sub">' + sub.innerHTML + '</p>' : '') + '</div>' + (code ? '<b class="acc-pop-code">' + code.textContent + '</b>' : '') + '</div>' +
        (body ? '<div class="acc-t">' + body.innerHTML + '</div>' : '') +
        (link ? '<a class="btn btn-pri" href="' + link.getAttribute('href') + '">Full course page</a>' : '') + '</div>');
    };
    c.setAttribute('tabindex', '0'); c.setAttribute('role', 'button');
    c.setAttribute('aria-label', ((c.querySelector('.acc-sub') || c).textContent || '').trim() + ': view details');
    c.addEventListener('click', open);
    c.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === c) { e.preventDefault(); open(); } });
  });
})();
/* forms: smoked glass panels floating over matte silver shapes (the reference login forms) */
(function () {
  'use strict';
  document.querySelectorAll('#regForm,#eForm,#paForm,#loginForm,#verifyForm,#rvForm').forEach(function (f, n) {
    if (f.closest('.v2-stage')) return;
    var st = document.createElement('div'); st.className = 'v2-stage v2-stage-' + (n % 3);
    f.parentNode.insertBefore(st, f);
    st.innerHTML = '<span class="v2-orb v2-orb-a" aria-hidden="true"></span><span class="v2-orb v2-orb-b" aria-hidden="true"></span><span class="v2-orb v2-orb-c" aria-hidden="true"></span>';
    st.appendChild(f); f.classList.add('v2-form');
    /* keep the form's own reveal on the stage */
    if (f.hasAttribute('data-rv')) { st.setAttribute('data-rv', f.getAttribute('data-rv')); f.removeAttribute('data-rv'); f.classList.add('in'); }
  });
})();

/* method cards: each one rises from below and settles onto the one before, building a pile (scroll-driven, smooth) */
(function () {
  'use strict';
  function build() {
    if (!window.gsap || !window.ScrollTrigger) return;
    var mm = gsap.matchMedia();
    document.querySelectorAll('.proc[data-stack],.ap-g[data-stack]').forEach(function (list) {
      mm.add('(min-width: 640px) and (prefers-reduced-motion: no-preference)', function () {
        var cards = Array.prototype.slice.call(list.children);
        var n = cards.length; if (n < 2) return;
        list.classList.add('v2-pile');
        /* the pile runs its own motion: take the cards out of the fade-in-on-scroll */
        cards.forEach(function (c) { c.removeAttribute('data-rv'); c.classList.remove('rv-wait'); c.classList.add('in'); });
        var STEP = 24, H = 0;
        cards.forEach(function (c) { c.style.height = ''; H = Math.max(H, c.offsetHeight); });
        cards.forEach(function (c, i) { c.style.height = H + 'px'; c.style.top = (i * STEP) + 'px'; c.style.zIndex = i + 1; });
        list.style.height = (H + (n - 1) * STEP) + 'px'; list.style.setProperty('--pile-h', (H + (n - 1) * STEP) + 'px');
        /* moved with the separate translate / scale properties, which the old stack rules (transform:none !important) cannot block */
        gsap.set(cards, { '--py': '0px', '--ps': 1, '--po': 1 });
        gsap.set(cards.slice(1), { '--py': function () { return Math.round(innerHeight * .9) + 'px'; }, '--po': 0 });
        /* a tall track with the pile stuck inside it: the browser holds it still (no pin jitter) */
        var track = document.createElement('div'); track.className = 'v2-pile-track';
        list.parentNode.insertBefore(track, list); track.appendChild(list);
        var LEN = function () { return Math.round((n - 1) * innerHeight * .38); };
        var sizeTrack = function () { track.style.height = (list.offsetHeight + LEN()) + 'px'; };
        sizeTrack();
        var tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
          trigger: track, start: function () { return 'top ' + (parseFloat(getComputedStyle(list).top) || 100) + 'px'; },
          end: function () { return '+=' + LEN(); }, scrub: .4, invalidateOnRefresh: true, onRefreshInit: sizeTrack } });
        cards.forEach(function (c, i) {
          if (!i) return;
          tl.to(c, { '--py': '0px', '--po': 1, duration: 1, ease: 'power2.out' }, i - 1)
            .to(cards.slice(0, i), { '--ps': function (k) { return 1 - (i - k) * .035; }, duration: 1, ease: 'power2.out' }, i - 1);
        });
        return function () {
          if (track.parentNode) { track.parentNode.insertBefore(list, track); track.remove(); }
          list.classList.remove('v2-pile'); list.style.height = '';
          cards.forEach(function (c) { c.style.height = ''; c.style.top = ''; c.style.zIndex = ''; });
          cards.forEach(function (c) { c.style.removeProperty('--py'); c.style.removeProperty('--ps'); c.style.removeProperty('--po'); });
        };
      });
    });
    ScrollTrigger.refresh();
  }
  if (document.readyState === 'complete') setTimeout(build, 0); else addEventListener('load', function () { setTimeout(build, 0); }, { once: true });
})();
/* where he teaches: centres with their logos (or a lettered tile), the about page's school wall and journey chart, all from config.js */
(function () {
  'use strict';
  var C = window.RA_CONFIG || {}, list = C.campuses || [];
  var esc = function (t) { return String(t == null ? '' : t).replace(/[<&"]/g, function (c) { return c === '<' ? '&lt;' : c === '&' ? '&amp;' : '&quot;'; }); };
  var norm = function (c) { return typeof c === 'string' ? { n: c } : (c || {}); };
  var mono = function (n) { var w = String(n).replace(/[’'`]s\b/g, '').split(/[\s·()\-]+/).filter(function (x) { return x && !/^(the|of|and|&)$/i.test(x); }); return ((w[0] || '?')[0] + (w[1] ? w[1][0] : '')).toUpperCase(); };
  var logo = function (c) {
    var L = c.logo ? [].concat(c.logo) : [];
    return L.length ? '<span class="lg' + (L.length > 1 ? ' lg-2' : '') + '">' + L.map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async">'; }).join('') + '</span>'
      : '<span class="lg lg-m" aria-hidden="true">' + esc(mono(c.n)) + '</span>';
  };
  var item = function (c, tag) { c = norm(c); return '<' + tag + ' class="aff-i">' + logo(c) + '<span class="aff-t"><b>' + esc(c.n) + '</b>' + (c.a ? '<small>' + esc(c.a) + '</small>' : '') + '</span></' + tag + '>'; };
  document.querySelectorAll('.pl-aff[data-aff]').forEach(function (ul, i) {
    var cs = (list[i] && list[i].centres) || [];
    ul.innerHTML = cs.length ? cs.map(function (c) { return item(c, 'li'); }).join('') : '<li class="tbc">Centre list · to be confirmed</li>';
  });
  var GROUPS = { evening: (list[0] || {}).centres, online: (list[1] || {}).centres, morning: C.morning, previously: C.previously };
  document.querySelectorAll('[data-aff-group]').forEach(function (ul) {
    var cs = GROUPS[ul.getAttribute('data-aff-group')] || [];
    if (!cs.length) { var sec = ul.closest('.sw-g'); if (sec) sec.hidden = true; return; }
    ul.innerHTML = cs.map(function (c) { return item(c, 'li'); }).join('');
  });

  /* the journey: students each session, one emerald bar per year, a tooltip on each, a table for screen readers */
  var host = document.getElementById('jrChart'), J = C.JOURNEY || [];
  if (host && J.length) {
    var max = 1200, top = Math.max.apply(null, J.map(function (r) { return r[2]; }));
    while (max < top) max += 400;
    var lab = {}; J.forEach(function (r, i) { if (i === 0 || r[2] !== J[i - 1][2]) lab[i] = 1; });
    var spans = []; J.forEach(function (r, i) { if (!r[1]) return; var l = spans[spans.length - 1]; if (l && l.w === r[1] && l.e === i - 1) l.e = i; else spans.push({ w: r[1], s: i, e: i }); });
    host.style.setProperty('--n', J.length);
    host.innerHTML = '<div class="jr-grid" aria-hidden="true">' + [max, max * 2 / 3, max / 3].map(function (v) { return '<i style="--y:' + (v / max * 100) + '%"><span>' + Math.round(v).toLocaleString('en') + '</span></i>'; }).join('') + '</div>' +
      '<div class="jr-plot">' + J.map(function (r, i) {
        return '<button type="button" class="jr-b" style="--k:' + i + ';--h:' + (r[2] / max * 100).toFixed(2) + '%" data-i="' + i + '" aria-label="' + esc(r[0] + ': ' + r[2].toLocaleString('en') + ' students' + (r[1] ? ', ' + r[1] : '')) + '">' +
          (lab[i] ? '<span class="jr-v">' + r[2].toLocaleString('en') + '</span>' : '') + '<i></i><span class="jr-y"><span class="jr-yf">' + esc('’' + r[0].slice(2)) + '</span><span class="jr-ys">' + esc('’' + r[0].slice(2, 4)) + '</span></span></button>';
      }).join('') + '</div>' +
      '<div class="jr-band" aria-hidden="true">' + spans.map(function (sp) { var sh = sp.w.split(/\s+/).length > 1 ? sp.w.split(/\s+/).map(function (w) { return w[0]; }).join('').toUpperCase() : sp.w; return '<span style="grid-column:' + (sp.s + 1) + '/' + (sp.e + 2) + '"><b class="jr-bf">' + esc(sp.w) + '</b><b class="jr-bs">' + esc(sh) + '</b></span>'; }).join('') + '</div>' +
      '<div class="jr-tip" role="status" hidden></div>';
    var tip = host.querySelector('.jr-tip');
    var show = function (b) {
      var r = J[+b.dataset.i], hb = host.getBoundingClientRect(), bb = b.querySelector('i').getBoundingClientRect();
      tip.innerHTML = '<small>' + esc(r[0]) + '</small><b>' + r[2].toLocaleString('en') + ' students</b>' + (r[1] ? '<em>' + esc(r[1]) + '</em>' : '');
      tip.hidden = false; tip.style.left = Math.min(Math.max(bb.left + bb.width / 2 - hb.left, 70), hb.width - 70) + 'px'; tip.style.top = (bb.top - hb.top) + 'px';
      host.querySelectorAll('.jr-b').forEach(function (x) { x.classList.toggle('on', x === b); });
    };
    var hide = function () { tip.hidden = true; host.querySelectorAll('.jr-b.on').forEach(function (x) { x.classList.remove('on'); }); };
    host.addEventListener('pointerover', function (e) { var b = e.target.closest('.jr-b'); if (b) show(b); });
    host.addEventListener('pointerleave', hide);
    host.addEventListener('focusin', function (e) { var b = e.target.closest('.jr-b'); if (b) show(b); });
    host.addEventListener('focusout', hide);
    var tb = document.getElementById('jrTable');
    if (tb) tb.innerHTML = J.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1] || '—') + '</td><td>' + r[2].toLocaleString('en') + '</td></tr>'; }).join('');
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.classList.add('jr-wait');
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { host.classList.remove('jr-wait'); io.disconnect(); } }, { threshold: .25 }); io.observe(host);
    }
  }
})();
/* curved ribbons: the words flow along the curve, a little faster while you scroll (after the Sir Suhail Aziz ribbon) */
(function () {
  'use strict';
  var tps = Array.prototype.slice.call(document.querySelectorAll('textPath[data-ribbon]'));
  if (!tps.length) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, items = [];
  function setup() {
    items = tps.map(function (tp) {
      var chunk = tp.getAttribute('data-chunk'), path = document.getElementById((tp.getAttribute('href') || '').slice(1));
      var plen = path && path.getTotalLength ? path.getTotalLength() : 1900;
      tp.textContent = chunk; var clen = tp.getComputedTextLength() || 800;
      var n = Math.ceil((plen + clen) / clen) + 1; tp.textContent = new Array(n + 1).join(chunk);
      return { tp: tp, clen: clen, dir: +tp.getAttribute('data-ribbon') || 1, off: Math.random() * clen, svg: tp.ownerSVGElement, vis: false };
    });
  }
  /* phones see the middle of the curve at a larger scale; laptops see all of it */
  var svgs = document.querySelectorAll('.v2-ribbon svg');
  function frame_() { var m = innerWidth <= 760; svgs.forEach(function (sv) { sv.setAttribute('viewBox', m ? '340 15 760 220' : '0 25 1440 200'); }); }
  frame_(); var rz = 0; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(frame_, 150); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    setup();
    var lastY = scrollY, vel = 0, t0 = performance.now(), sign = 1, running = false;
    function start() { if (running || !items.some(function (it) { return it.vis; })) return; running = true; t0 = performance.now(); lastY = scrollY; requestAnimationFrame(frame); }
    function frame(t) {
      if (!items.some(function (it) { return it.vis; }) || document.hidden) { running = false; return; }
      requestAnimationFrame(frame);
      var dt = Math.min(.05, (t - t0) / 1000); t0 = t;
      var dy = scrollY - lastY; lastY = scrollY; vel += (dy - vel) * .1;
      if (Math.abs(vel) > .6) sign = vel > 0 ? 1 : -1;
      items.forEach(function (it) {
        if (!it.vis) return;
        var sp = RM ? 0 : 40 + Math.min(520, Math.abs(vel) * 12);
        it.off = (((it.off + it.dir * sign * sp * dt) % it.clen) + it.clen) % it.clen;
        it.tp.setAttribute('startOffset', (-it.off).toFixed(1));
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { items.forEach(function (it) { if (it.svg === en.target) it.vis = en.isIntersecting; }); }); start(); });
      items.forEach(function (it) { io.observe(it.svg); });
    } else items.forEach(function (it) { it.vis = true; });
    document.addEventListener('visibilitychange', start); start();
  });
})();
/* sliders: fill the track up to the thumb */
(function () {
  'use strict';
  function fill(r) { var a = +r.min || 0, b = +r.max || 100, v = +r.value; r.style.setProperty('--fill', ((v - a) / (b - a) * 100).toFixed(1) + '%'); }
  function all() { document.querySelectorAll('input[type=range]').forEach(fill); }
  document.addEventListener('input', function (e) { if (e.target.matches && e.target.matches('input[type=range]')) fill(e.target); });
  document.addEventListener('click', function () { setTimeout(all, 30); });
  if (document.readyState === 'complete') all(); else addEventListener('load', function () { setTimeout(all, 50); });
})();
/* forms: real 3D shapes behind the glass — a matte silver torus, a sphere and a knot that turn slowly and lean with the pointer */
(function () {
  'use strict';
  var stages = Array.prototype.slice.call(document.querySelectorAll('.v2-stage'));
  if (!stages.length) return;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function need3() {
    return new Promise(function (res) {
      if (window.THREE) return res(window.THREE);
      var t = setInterval(function () { if (window.THREE) { clearInterval(t); res(window.THREE); } }, 300);
      setTimeout(function () { if (window.THREE) return; var sc = document.createElement('script'); sc.src = 'vendor/three.min.js'; sc.async = true; document.head.appendChild(sc); }, 4000);
    });
  }
  /* a matte silver matcap, drawn once: soft light from the top-left, no hard shine */
  function matcap(THREE) {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d');
    var g = x.createRadialGradient(92, 78, 8, 128, 128, 128);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.16, '#eef0f1'); g.addColorStop(.42, '#c7ccd0'); g.addColorStop(.7, '#8c9398'); g.addColorStop(.9, '#5c6266'); g.addColorStop(1, '#3f4447');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    var r = x.createRadialGradient(170, 196, 4, 170, 196, 70); r.addColorStop(0, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = r; x.fillRect(0, 0, 256, 256);
    var t = new THREE.CanvasTexture(c); return t;
  }
  function build(THREE, st, k) {
    var cv = document.createElement('canvas'); cv.className = 'v2-3d'; cv.setAttribute('aria-hidden', 'true');
    st.insertBefore(cv, st.firstChild); st.classList.add('has-3d');
    var R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: 'low-power' });
    R.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    var S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 100); cam.position.z = 12;
    var mat = new THREE.MeshMatcapMaterial({ matcap: matcap(THREE) });
    var torus = new THREE.Mesh(new THREE.TorusGeometry(1.25, .42, 48, 120), mat);
    var ball = new THREE.Mesh(new THREE.SphereGeometry(.95, 64, 48), mat);
    var knot = new THREE.Mesh(new THREE.TorusKnotGeometry(.5, .17, 160, 24, 2, 3), mat);
    var small = new THREE.Mesh(new THREE.SphereGeometry(.38, 48, 32), mat);
    var G = new THREE.Group(); G.add(torus, ball, knot, small); S.add(G);
    if (window.ResizeObserver) new ResizeObserver(function () { layout(); R.render(S, cam); }).observe(st);
    var ring2 = new THREE.Mesh(new THREE.TorusGeometry(.62, .09, 24, 90), mat); G.add(ring2);
    var flip = k % 2 ? -1 : 1, phone = false;
    /* every shape is placed round the form's corners and sized so it always sits whole inside the canvas: nothing is ever cut by an edge */
    var parts = [
      { m: torus, r: 1.67, fx: -.92, fy: -.94, z: -.6 },
      { m: ball, r: .95, fx: .96, fy: .9, z: -.5 },
      { m: knot, r: .9, fx: 1, fy: -.62, z: .2 },
      { m: small, r: .38, fx: -1.02, fy: .62, z: .3 },
      { m: ring2, r: .71, fx: .28, fy: 1.04, z: -.6 }
    ];
    function layout() {
      var w = cv.clientWidth || 1, h = cv.clientHeight || 1; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      phone = innerWidth <= 760;
      var hh = Math.tan(cam.fov * Math.PI / 360) * cam.position.z, hw = hh * cam.aspect;
      /* the form fills the middle of the canvas: its half-size in world units */
      var sw = st.offsetWidth || w, sh = st.offsetHeight || h, fw = hw * sw / w, fh = hh * sh / h;
      parts.forEach(function (p) {
        var x = p.fx * fw * flip * (phone ? .8 : 1), y = p.fy * fh * (phone && p.fy > 0 ? .84 : 1);
        var room = Math.min(hw - Math.abs(x), hh - Math.abs(y)) * .92;
        var sc = Math.max(.25, Math.min(phone ? .72 : 1, room / p.r));
        p.m.position.set(x, y, p.z); p.m.scale.setScalar(sc); p.base = { x: x, y: y };
      });
    }
    layout(); addEventListener('resize', layout);
    var px = 0, py = 0, tx = 0, ty = 0, vis = false, t0 = performance.now();
    st.addEventListener('pointermove', function (e) { var r = st.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5); ty = ((e.clientY - r.top) / r.height - .5); });
    st.addEventListener('pointerleave', function () { tx = ty = 0; });
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) requestAnimationFrame(loop); }, { rootMargin: '100px' }).observe(st);
    function loop(now) {
      if (!vis || document.hidden) return; requestAnimationFrame(loop);
      var t = (now - t0) / 1000, sp = RM ? 0 : 1;
      px += (tx - px) * .06; py += (ty - py) * .06;
      /* always turning: the ring rolls, the knot spins, the spheres drift, a small ring orbits */
      torus.rotation.set(1.05 + Math.sin(t * .45) * .35 * sp, t * .55 * sp, .35 + t * .12 * sp);
      knot.rotation.set(t * .7 * sp, t * .45 * sp, t * .2 * sp);
      ring2.rotation.set(t * .9 * sp, .6 + t * .5 * sp, 0);
      ball.position.y = parts[1].base.y + Math.sin(t * .8) * .14 * sp;
      small.position.set(parts[3].base.x + Math.cos(t * .7) * .16 * sp, parts[3].base.y + Math.sin(t * .9) * .12 * sp, .3);
      ring2.position.y = parts[4].base.y + Math.sin(t * .6 + 1) * .1 * sp;
      G.rotation.set(py * .25, px * .35, 0);
      G.position.set(px * .3, -py * .25, 0);
      R.render(S, cam);
    }
    R.render(S, cam);
  }
  need3().then(function (THREE) { stages.forEach(function (st, k) { try { build(THREE, st, k); } catch (e) { console.warn('[MFM] 3D shapes off:', e); } }); });
})();

/* register: what the login opens, on a turning ring of glass cards. It turns by itself, stops while you
   point at it or read it, and follows a drag or swipe; the arrows and dots step it too. */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.rp').forEach(function (rp) {
    var stage = rp.querySelector('.rp-stage'), ring = rp.querySelector('.rp-ring');
    var cards = Array.prototype.slice.call(ring.children), n = cards.length, step = 360 / n;
    var dots = rp.querySelector('.rp-dots');
    dots.innerHTML = cards.map(function () { return '<i></i>'; }).join('');
    var ang = 0, R = 0, hold = false, seen = false, timer = 0;
    function rel(i) { var r = ((i * step + ang) % 360 + 360) % 360; return r > 180 ? r - 360 : r; }
    function paint() {
      ring.style.transform = 'translateZ(' + (-R) + 'px) rotateY(' + ang.toFixed(2) + 'deg)';
      var now = ((Math.round(-ang / step) % n) + n) % n;
      cards.forEach(function (c, i) {
        var a = Math.abs(rel(i)); c.style.setProperty('--far', (a / 180).toFixed(3));
        c.classList.toggle('on', i === now); c.setAttribute('aria-hidden', i === now ? 'false' : 'true');
      });
      Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i === now); });
    }
    function size() {
      var w = cards[0].offsetWidth || 280;
      R = Math.round(w / 2 / Math.tan(Math.PI / n)) + 14;
      cards.forEach(function (c, i) { c.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + R + 'px)'; });
      stage.style.setProperty('--R', R + 'px'); paint();
    }
    function go(d) { ang = Math.round((ang - d * step) / step) * step; paint(); }
    function to(i) { var t = -i * step; while (t - ang > 180) t -= 360; while (ang - t > 180) t += 360; ang = t; paint(); }
    function tick() { clearTimeout(timer); timer = setTimeout(function () { if (!hold && seen && !document.hidden && !RM) go(1); tick(); }, 3200); }
    rp.addEventListener('click', function (e) { var b = e.target.closest('[data-d]'); if (b) { go(+b.dataset.d); tick(); } });
    dots.addEventListener('click', function (e) { var i = Array.prototype.indexOf.call(dots.children, e.target); if (i > -1) { to(i); tick(); } });
    rp.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(1); tick(); } if (e.key === 'ArrowLeft') { go(-1); tick(); } });
    rp.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hold = true; });
    rp.addEventListener('pointerleave', function () { hold = false; });
    rp.addEventListener('focusin', function () { hold = true; });
    rp.addEventListener('focusout', function () { hold = false; });
    /* drag or swipe: the ring follows the finger, then settles on the nearest card */
    var x0 = null, y0 = 0, a0 = 0, lock = null;
    stage.addEventListener('pointerdown', function (e) { if (e.button) return; x0 = e.clientX; y0 = e.clientY; a0 = ang; lock = null; });
    stage.addEventListener('pointermove', function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (lock == null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (lock === 'x') { rp.classList.add('drag'); try { stage.setPointerCapture(e.pointerId); } catch (er) { } } }
      if (lock !== 'x') return;
      e.preventDefault(); ang = a0 + dx * (step / (cards[0].offsetWidth * .8)); paint();
    });
    var end = function () { if (x0 == null) return; x0 = null; if (lock === 'x') { rp.classList.remove('drag'); ang = Math.round(ang / step) * step; paint(); tick(); } lock = null; };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end); stage.addEventListener('lostpointercapture', end);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: .35 }).observe(rp); else seen = true;
    if (window.ResizeObserver) new ResizeObserver(size).observe(stage); else addEventListener('resize', size);
    size(); tick();
  });
})();

/* photo slots: until the real photos are added, each slot shows the matching artwork, faded softly into its card
   (no hatching, no "Photo 5" labels). When a photo file exists it simply shows instead. */
(function () {
  'use strict';
  var ART = { 'course-2058': 'art-book.svg', 'course-0493': 'art-star.svg', 'recorded-course': 'art-lanterns.svg', 'in-class': 'art-arches.svg',
    'online-class': 'art-domes.svg', 'badr-lesson': 'art-domes.svg', 'marked-answer': 'art-book.svg', 'crash-course': 'art-lanterns.svg' };
  function dress(ph, img) {
    if (ph.classList.contains('ph-art')) return;
    var src = (img && img.getAttribute('src')) || '', key = (src.split('/').pop() || '').replace(/\.\w+$/, '');
    ph.style.setProperty('--art', 'url("' + new URL(ART[key] || 'art-star.svg', location.href).href + '")');
    ph.classList.add('ph-x', 'ph-art');
  }
  function check(img) {
    var ph = img.closest('.ph'); if (!ph) return;
    if (ph.classList.contains('ph-x') || (img.complete && !img.naturalWidth && img.getAttribute('src'))) dress(ph, img);
    img.addEventListener('error', function () { dress(ph, img); }, { once: true });
  }
  function run() { document.querySelectorAll('.ph img').forEach(check); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  addEventListener('load', run, { once: true });
})();

/* v3.2 — brand emblem: Sir Fazil's round logo in the hero/about badges and the profile card
   (the engine already swaps every .seal when RA_CONFIG.logo is set). */
(function () {
  var C = window.RA_CONFIG || {};
  if (!C.logo) return;
  function run() {
    var img = '<img src="' + C.logo + '" alt="" decoding="async">';
    document.querySelectorAll('.hb-sa,.pf-end').forEach(function (el) {
      el.classList.add('has-logo');
      if (el.classList.contains('pf-end')) { var b = el.querySelector('b'); if (b) b.outerHTML = img; }
      else el.innerHTML = img;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
