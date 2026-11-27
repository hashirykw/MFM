/* MFM · classical sound, the sound switch and the cookie bar (Nov 2026).
   Sounds are made in the browser (no audio files): plucked harp strings (Karplus-Strong) in
   D major pentatonic, soft bells for the theme switch, all through a small hall reverb.
   One switch in the top bar turns them off and the choice is remembered ('ra-sound').
   Loaded before the page engine so the inner pages' own sound calls come here too. */
(function () {
  'use strict';
  const doc = document, root = doc.documentElement;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ sound engine */
  const S = (function () {
    let ctx = null, bus = null, dry = null, wet = null, on = store.get('ra-sound', true) !== false;
    const cache = new Map();
    function ensure() {
      if (!on) return null;
      if (!ctx) {
        try {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
          bus = ctx.createGain(); bus.gain.value = .32;
          const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6800; lp.Q.value = .2;
          const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = .004; comp.release.value = .2;
          dry = ctx.createGain(); dry.gain.value = .82; wet = ctx.createGain(); wet.gain.value = .34;
          const verb = ctx.createConvolver(); verb.buffer = hall(2.4);
          bus.connect(lp); lp.connect(dry); lp.connect(verb); verb.connect(wet); dry.connect(comp); wet.connect(comp); comp.connect(ctx.destination);
        } catch (e) { ctx = null; return null; }
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function hall(sec) {           // a soft stereo hall: decaying noise, darker as it fades
      const rate = ctx.sampleRate, len = Math.floor(rate * sec), b = ctx.createBuffer(2, len, rate);
      for (let ch = 0; ch < 2; ch++) {
        const d = b.getChannelData(ch); let lp = 0;
        for (let i = 0; i < len; i++) { const t = i / len, k = .55 - .45 * t; lp = lp + k * ((Math.random() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - t, 2.6) * (i < rate * .012 ? i / (rate * .012) : 1); }
      }
      return b;
    }
    function string(freq, bright) {   // Karplus-Strong pluck, cached per pitch
      const key = freq.toFixed(1) + (bright ? 'b' : '');
      if (cache.has(key)) return cache.get(key);
      const rate = ctx.sampleRate, len = Math.floor(rate * 2.2), b = ctx.createBuffer(1, len, rate), d = b.getChannelData(0);
      const N = Math.max(2, Math.round(rate / freq)), ring = new Float32Array(N);
      for (let i = 0; i < N; i++) ring[i] = (Math.random() * 2 - 1) * (bright ? 1 : .8);
      let p = 0, prev = 0; const damp = bright ? .996 : .9935;
      for (let i = 0; i < len; i++) {
        const cur = ring[p], next = ring[(p + 1) % N], v = damp * .5 * (cur + next);
        ring[p] = v; d[i] = cur * .9 + prev * .1; prev = cur; p = (p + 1) % N;
      }
      // body: a gentle attack so it reads as a harp, not a click
      for (let i = 0; i < 64; i++) d[i] *= i / 64;
      cache.set(key, b); return b;
    }
    function pluck(freq, vol, when, pan, bright) {
      const c = ensure(); if (!c) return;
      const t = c.currentTime + (when || 0), s = c.createBufferSource(), g = c.createGain();
      s.buffer = string(freq, bright); g.gain.value = vol == null ? .5 : vol;
      let out = g;
      if (c.createStereoPanner) { const pn = c.createStereoPanner(); pn.pan.value = pan || 0; g.connect(pn); out = pn; }
      s.connect(g); out.connect(bus); s.start(t);
    }
    function bell(freq, vol, when, len) {     // a soft tuned bell (fundamental + inharmonic partials)
      const c = ensure(); if (!c) return;
      const t = c.currentTime + (when || 0), g = c.createGain(), L = len || 1.6;
      [[1, 1], [2.76, .34], [5.4, .12], [.5, .2]].forEach(([m, a]) => {
        const o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.value = freq * m;
        og.gain.setValueAtTime(a, t); og.gain.exponentialRampToValueAtTime(.0001, t + L / (m > 1 ? m * .7 : 1));
        o.connect(og); og.connect(g); o.start(t); o.stop(t + L + .05);
      });
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .12, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + L);
      g.connect(bus);
    }
    function swish(vol, when) {               // a page turning
      const c = ensure(); if (!c) return;
      const t = c.currentTime + (when || 0), len = Math.floor(c.sampleRate * .32), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) { const x = i / len; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * x) * (1 - x * .5); }
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = b; f.type = 'bandpass'; f.Q.value = .7; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(3200, t + .3);
      g.gain.value = vol || .1; s.connect(f); f.connect(g); g.connect(bus); s.start(t);
    }
    // D major pentatonic over two octaves
    const P = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880, 987.77, 1174.66];
    let step = 0, lastAt = 0;
    const api = {
      get on() { return on; },
      set(v) { on = !!v; store.set('ra-sound', on); if (on) { ensure(); api.chime(); } paint(); },
      unlock() { if (on) ensure(); },
      tap(el) {
        const now = performance.now(); if (now - lastAt < 45) return; lastAt = now;
        const big = el && el.matches && el.matches('.btn,.btn-x,.top-cta,[class*="btn"]');
        step = (step + 1 + (Math.random() * 2 | 0)) % 6;
        const f = P[(big ? 3 : 4) + step % 5];
        pluck(f, big ? .5 : .32, 0, (Math.random() - .5) * .4, big);
        if (big) pluck(f * 1.5, .14, .03, .15);
      },
      tick() {},
      click() { api.tap({ matches: () => true }); },
      soft() { pluck(P[2], .3); },
      open() { [0, 2, 4, 7].forEach((n, i) => pluck(P[n], .34 - i * .04, i * .055, -.3 + i * .2, true)); swish(.05, 0); },
      close() { [7, 4, 2].forEach((n, i) => pluck(P[n], .3 - i * .05, i * .05, .3 - i * .2)); },
      chime() { bell(P[5], .1, 0, 1.8); bell(P[8], .07, .09, 1.6); },
      light() { bell(P[8], .09, 0, 1.6); bell(P[10], .06, .1, 1.4); pluck(P[5], .22, .02); },
      dark() { bell(P[0] * 2, .1, 0, 2.2); bell(P[3], .06, .12, 2); pluck(P[0], .26, .02); },
      coin() { [5, 7, 9].forEach((n, i) => pluck(P[n], .3, i * .07, 0, true)); },
      ok() { [0, 2, 4, 5].forEach((n, i) => pluck(P[n + 3], .3, i * .08, 0, true)); bell(P[8], .05, .32, 1.6); },
      err() { pluck(220, .4, 0); pluck(207.65, .32, .1); },
      stamp() { pluck(146.83, .5, 0, 0, true); swish(.06, 0); },
      whoosh() { swish(.1, 0); },
      alarm() { [0, .3, .6].forEach(w => bell(P[8], .1, w, .9)); },
      page() { swish(.08, 0); }
    };
    return api;
  })();
  window.MFMSound = S;

  /* ------------------------------------------------------------ where sounds happen */
  addEventListener('pointerdown', () => S.unlock(), { once: true, capture: true });
  doc.addEventListener('click', e => {
    const t = e.target.closest('a,button,summary,[role="button"],[role="tab"],label.seg,.mi,.chip-btn');
    if (!t || t.closest('[data-nosnd]') || t.id === 'menuBtn' || t.id === 'themeBtn' || t.classList.contains('snd-btn')) return;
    if (t.matches('summary') || t.closest('details')) { S.soft(); return; }
    S.tap(t);
  }, true);
  // menu open / close: a harp run up, a run down
  let menuOpen = doc.body && doc.body.classList.contains('menu-open');
  const watch = () => new MutationObserver(() => {
    const o = doc.body.classList.contains('menu-open'); if (o === menuOpen) return; menuOpen = o; o ? S.open() : S.close();
  }).observe(doc.body, { attributes: true, attributeFilter: ['class'] });
  // theme: a bright bell into Paper, a low one into Ink
  let theme = root.dataset.theme;
  new MutationObserver(() => { const t = root.dataset.theme; if (t === theme) return; theme = t; t === 'dark' ? S.dark() : S.light(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  /* ------------------------------------------------------------ the sound switch (top bar) */
  const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.4L12.2 5.6v12.8L7.4 14.5H4z" class="sp"/><path class="w1" d="M15.4 9.4a3.6 3.6 0 0 1 0 5.2"/><path class="w2" d="M17.9 6.9a7.2 7.2 0 0 1 0 10.2"/><path class="x" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
  let btn = null;
  function paint() {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(S.on)); btn.classList.toggle('off', !S.on);
    btn.setAttribute('aria-label', S.on ? 'Sound effects on. Turn them off' : 'Sound effects off. Turn them on');
    btn.title = S.on ? 'Sound on' : 'Sound off';
  }
  function mountSwitch() {
    const bar = doc.querySelector('.top .top-r'); if (!bar || bar.querySelector('.snd-btn')) return;
    btn = doc.createElement('button'); btn.type = 'button'; btn.className = 'snd-btn'; btn.innerHTML = ICON_ON;
    const anchor = bar.querySelector('#themeBtn') || bar.querySelector('#menuBtn');
    bar.insertBefore(btn, anchor); paint();
    btn.addEventListener('click', () => { S.set(!S.on); toast(S.on ? 'Sound effects on' : 'Sound effects off'); });
  }

  /* ------------------------------------------------------------ toast (themed, shared) */
  function toast(msg) {
    let box = doc.querySelector('.lx-toasts');
    if (!box) { box = doc.createElement('div'); box.className = 'lx-toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); doc.body.appendChild(box); }
    const t = doc.createElement('div'); t.className = 'lx-toast'; t.textContent = msg; box.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 450); }, 1700);
  }

  /* ------------------------------------------------------------ cookie bar */
  function cookieBar() {
    if (store.get('mfm-cookies', null)) return;
    const bar = doc.createElement('section');
    bar.className = 'lx-cookie'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Cookies and storage');
    bar.innerHTML =
      '<span class="lx-cookie-seal" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 3l4.2 6.8 7.8-1.9-1.9 7.8L37 20l-6.8 4.2 1.9 7.8-7.8-1.9L20 37l-4.2-6.8-7.8 1.9 1.9-7.8L3 20l6.8-4.2-1.9-7.8 7.8 1.9z"/><circle cx="20" cy="20" r="6.2"/></svg></span>' +
      '<div class="lx-cookie-t"><b>No tracking, no ad cookies.</b><p>This site only remembers your theme, the sound setting and your notes cart on this device, so the next visit opens the way you left it.</p></div>' +
      '<div class="lx-cookie-a"><button type="button" class="btn btn--sm btn--gold" data-ck="ok">Okay</button><button type="button" class="btn btn--sm btn--line" data-ck="min">Sound off</button></div>';
    doc.body.appendChild(bar);
    setTimeout(() => bar.classList.add('in'), 900);
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-ck]'); if (!b) return;
      if (b.dataset.ck === 'min' && S.on) S.set(false);
      store.set('mfm-cookies', { at: Date.now() });
      bar.classList.remove('in'); setTimeout(() => bar.remove(), 600);
    });
  }

  function start() { watch(); mountSwitch(); cookieBar(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})();
