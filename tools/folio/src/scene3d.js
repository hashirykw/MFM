/* Live dioramas, frameless: every element with data-model="…" becomes a window onto its own 3D
   scene, all drawn by ONE transparent renderer on a fixed canvas over the page (so any number of
   models cost one WebGL context). Drag to turn any of them a full 360° either way (orbit3d.js); they turn slowly on their own; lighting
   follows the theme. The still render inside the element shows until its model is ready. */
import * as THREE from '/assets/folio/js/three.module.min.js';
import { makeScene } from './stage3d.js';
import { orbit } from './orbit3d.js';

const hosts = [...document.querySelectorAll('[data-model]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDark = () => document.documentElement.dataset.theme === 'dark';
if (hosts.length) { try { boot(); } catch (e) { console.warn(e); } }

function boot() {
  const canvas = document.createElement('canvas');
  canvas.className = 'm3d-canvas'; canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .96;
  renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
  const size = () => renderer.setSize(innerWidth, innerHeight, false);
  size(); addEventListener('resize', size);

  const views = [];
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target._v || (e.isIntersecting ? make(e.target) : null);
    if (v) v.vis = e.isIntersecting;
  }), { rootMargin: '600px' });
  hosts.forEach(h => io.observe(h));

  function make(host) {
    const st = makeScene(THREE, renderer, host.dataset.model, { dark: isDark() });
    const turn = +(host.dataset.turn || 0);
    const v = { host, st, vis: true, o: orbit(host, { yaw: turn, auto: reduced ? 0 : .0024 }), fill: +(host.dataset.fill || .9), ready: false };
    host._v = v; views.push(v);
    host.classList.add('m3d-live');
    // compile its shaders now, while it is still off screen, so its first frame is instant
    try { st.frame(400, 300, v.fill); renderer.compileAsync(st.scene, st.cam).catch(() => {}); } catch (e) {}
    return v;
  }
  // build every model in the browser's quiet moments, nearest first, before it is scrolled to
  const idle = cb => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 900 }) : setTimeout(cb, 120));
  const queue = hosts.slice().sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top));
  (function warm() { const h = queue.shift(); if (!h) return; if (!h._v) { const v = make(h); const r = h.getBoundingClientRect(); v.vis = r.bottom > -250 && r.top < innerHeight + 250; } idle(warm); })();
  new MutationObserver(() => views.forEach(v => v.st.theme(isDark()))).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  let last = performance.now();
  (function frame(now) {
    requestAnimationFrame(frame);
    now = now || performance.now(); const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (document.hidden) return;
    renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
    const H = innerHeight, W = innerWidth;
    for (const v of views) {
      if (!v.vis) continue;
      const r = v.host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width < 2) continue;
      v.o.step(dt); v.st.root.rotation.y = v.o.yaw;
      v.st.frame(r.width, r.height, v.fill, v.o.pitch);
      renderer.setViewport(r.left, H - r.bottom, r.width, r.height);
      renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
      renderer.render(v.st.scene, v.st.cam);
      if (!v.ready) { v.ready = true; v.host.classList.add('ready'); }
    }
  })();
}
