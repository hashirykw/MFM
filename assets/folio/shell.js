/* Sir Fazil Maniya · the folio shell, shared by every page:
   theme switch (paper / ink), contents menu, top bar, reveals and counters. No libraries. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* ---------- back / forward: land where you were, never at the top ---------- */
(() => {
  const K = 'fp-scroll:' + location.pathname + location.search;
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  const save = () => { try { sessionStorage.setItem(K, String(Math.round(scrollY))); } catch (e) {} };
  addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href]'); if (a) save(); }, true);
  let nav = 'navigate';
  try { nav = (performance.getEntriesByType('navigation')[0] || {}).type || 'navigate'; } catch (e) {}
  if (nav !== 'back_forward' && nav !== 'reload') return;
  let y = 0; try { y = +sessionStorage.getItem(K) || 0; } catch (e) {}
  if (!y) return;
  const to = () => { if (Math.abs(scrollY - y) > 2 && document.documentElement.scrollHeight - innerHeight >= y - 2) scrollTo({ top: y, behavior: 'instant' }); };
  to(); requestAnimationFrame(to);
  addEventListener('DOMContentLoaded', to); addEventListener('load', () => { to(); setTimeout(to, 120); setTimeout(to, 450); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(to);
  let stop = false; const quit = () => { stop = true; };
  ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, quit, { once: true, passive: true }));
  const t0 = performance.now();
  (function hold() { if (stop || performance.now() - t0 > 1600) return; to(); requestAnimationFrame(hold); })();
})();

$$('[data-year],#yr').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- theme (paper / ink, circular reveal from the switch) ---------- */
(() => {
  const btn = $('#themeBtn'); if (!btn) return;
  const cur = () => root.dataset.theme === 'dark' ? 'dark' : 'light';
  const metaC = $$('meta[name="theme-color"]');
  const sync = () => { const d = cur() === 'dark'; btn.setAttribute('aria-checked', String(d)); btn.setAttribute('aria-label', d ? 'Switch to the paper theme' : 'Switch to the ink theme'); metaC.forEach(m => m.setAttribute('content', d ? '#0c1311' : '#fafaf8')); };
  sync();
  btn.addEventListener('click', () => {
    const next = cur() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      if (window.RA && RA.theme) RA.theme(next);
      else { root.dataset.theme = next; try { localStorage.setItem('ra-theme', JSON.stringify(next)); } catch (e) {} }
      sync(); document.dispatchEvent(new CustomEvent('hma:theme'));
    };
    btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin');
    if (reduced || !document.startViewTransition) return apply();
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(apply);
    t.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  });
})();

/* ---------- contents menu ---------- */
(() => {
  const body = document.body, btn = $('#menuBtn'), menu = $('#menu'), scrim = $('#menuScrim'), more = $('#moreBtn');
  if (!btn || !menu) return;
  let last = null;
  const isOpen = () => body.classList.contains('menu-open');
  function open() {
    last = document.activeElement; body.classList.add('menu-open'); menu.setAttribute('aria-hidden', 'false');
    [btn, more].forEach(b => b && b.setAttribute('aria-expanded', 'true'));
    setTimeout(() => { const f = $('.mi.here', menu) || $('.mi', menu); f && f.focus({ preventScroll: true }); }, 380);
  }
  function close(focus = true) {
    if (!isOpen()) return; body.classList.remove('menu-open'); menu.setAttribute('aria-hidden', 'true');
    [btn, more].forEach(b => b && b.setAttribute('aria-expanded', 'false'));
    if (focus && last && last.focus) last.focus({ preventScroll: true });
  }
  btn.addEventListener('click', () => isOpen() ? close() : open());
  more && more.addEventListener('click', () => isOpen() ? close() : open());
  scrim && scrim.addEventListener('click', () => close());
  menu.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const u = new URL(a.href, location.href);
    const same = u.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') === location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (same && u.hash) { e.preventDefault(); close(false); const t = document.getElementById(u.hash.slice(1)); setTimeout(() => t && t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }), 260); }
    else if (same) { e.preventDefault(); close(); }
    else close(false);
  });
  $$('[data-open-menu]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
  addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { const f = [btn, ...$$('a,button', menu)].filter(x => x.offsetParent !== null); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
})();

/* ---------- top bar: solid after the first scroll, steps aside going down ---------- */
(() => {
  const top = $('#top'); if (!top) return;
  let lastY = scrollY;
  const upd = () => {
    const y = scrollY;
    top.classList.toggle('solid', y > 30);
    if (!document.body.classList.contains('menu-open')) top.classList.toggle('hide', y > 400 && y > lastY + 4);
    if (y < lastY - 4) top.classList.remove('hide');
    document.documentElement.classList.toggle('top-away', top.classList.contains('hide'));
    lastY = y;
  };
  addEventListener('scroll', upd, { passive: true }); upd();
})();

/* ---------- notes cart button: shows once something is in the cart ---------- */
(() => {
  const n = $('.top-cart [data-cart-n]'); if (!n) return;
  const b = n.closest('.top-cart');
  const sync = () => b.classList.toggle('has', !!(n.textContent || '').trim() && n.textContent.trim() !== '0');
  sync(); new MutationObserver(sync).observe(n, { childList: true, characterData: true, subtree: true });
})();

/* ---------- reveals (frames and images only; text is never hidden) + counters ---------- */
const revIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.rv-img').forEach(el => revIO.observe(el));
const cntIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || reduced) return; cntIO.unobserve(e.target);
  const el = e.target, to = +el.dataset.count, t0 = performance.now();
  const tick = now => { const p = Math.min(1, (now - t0) / 1500), v = Math.round(to * (1 - Math.pow(1 - p, 4))); el.textContent = v.toLocaleString('en-US'); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .6 });
$$('[data-count]').forEach(el => { if (!el.closest('[data-cnt-legacy]')) cntIO.observe(el); });
})();

/* ---------- 3D tilt: cards lean towards the pointer (laptops only) ---------- */
(() => {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const SEL = '.fp-panel,.salah-panel,.course,.plate-mat,.tl-u,.mfm-card,.form-card,.fp-plate-mat,.sheet';
  let el = null;
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest(SEL);
    if (el && el !== c) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.classList.remove('tilt'); }
    el = c; if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.classList.add('tilt'); c.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg'); c.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
  }, { passive: true });
})();
