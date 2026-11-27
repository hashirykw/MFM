/* Live dioramas, frameless: every element with data-model="…" becomes a window onto its own 3D
   scene, all drawn by ONE transparent renderer on a fixed canvas over the page (so any number of
   models cost one WebGL context). Drag to turn any of them; they turn slowly on their own; lighting
   follows the theme. The still render inside the element shows until its model is ready. */
import * as THREE from '/assets/folio/js/three.module.min.js';
import { makeScene } from './stage3d.js';

const hosts = [...document.querySelectorAll('[data-model]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDark = () => document.documentElement.dataset.theme === 'dark';
if (hosts.length) { try { boot(); } catch (e) { console.warn(e); } }

function boot() {
  const canvas = document.createElement('canvas');
  canvas.className = 'm3d-canvas'; canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .96;
  renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
  const size = () => renderer.setSize(innerWidth, innerHeight, false);
  size(); addEventListener('resize', size);

  const views = [];
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target._v || (e.isIntersecting ? make(e.target) : null);
    if (v) v.vis = e.isIntersecting;
  }), { rootMargin: '250px' });
  hosts.forEach(h => io.observe(h));

  function make(host) {
    const st = makeScene(THREE, renderer, host.dataset.model, { dark: isDark() });
    const v = { host, st, vis: true, target: +(host.dataset.turn || 0), cur: +(host.dataset.turn || 0), drag: false, moved: 0, lastX: 0, idle: 0, fill: +(host.dataset.fill || .9), ready: false };
    host._v = v; views.push(v);
    host.classList.add('m3d-live');
    host.addEventListener('pointerdown', e => { if (e.button) return; v.drag = true; v.moved = 0; v.lastX = e.clientX; host.setPointerCapture(e.pointerId); host.classList.add('grab'); });
    host.addEventListener('pointermove', e => { if (!v.drag) return; const dx = e.clientX - v.lastX; v.moved += Math.abs(dx); v.target += dx * .009; v.lastX = e.clientX; v.idle = 0; });
    const up = () => { v.drag = false; host.classList.remove('grab'); };
    host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
    // a drag is not a click (the folio plates open a closer view on a tap)
    (host.closest('button,a') || host).addEventListener('click', e => { if (v.moved > 6) { e.preventDefault(); e.stopPropagation(); v.moved = 0; } }, true);
    return v;
  }
  new MutationObserver(() => views.forEach(v => v.st.theme(isDark()))).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  (function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
    const H = innerHeight, W = innerWidth;
    for (const v of views) {
      if (!v.vis) continue;
      const r = v.host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W || r.width < 2) continue;
      v.idle += 1 / 60; if (!v.drag && !reduced && v.idle > 1.6) v.target += .0024;
      v.cur += (v.target - v.cur) * .085; v.st.root.rotation.y = v.cur;
      v.st.frame(r.width, r.height, v.fill);
      renderer.setViewport(r.left, H - r.bottom, r.width, r.height);
      renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
      renderer.render(v.st.scene, v.st.cam);
      if (!v.ready) { v.ready = true; v.host.classList.add('ready'); }
    }
  })();
}
