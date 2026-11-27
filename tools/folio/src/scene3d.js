/* Live dioramas on the page: any <figure class="m3d" data-model="…"> gets its model, turnable by
   drag, turning slowly on its own, lit for the current theme. Starts when scrolled near, pauses
   off screen; the rendered still underneath shows until the model is ready (or if WebGL is off). */
import * as THREE from '/assets/folio/js/three.module.min.js';
import { makeStage } from './stage3d.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDark = () => document.documentElement.dataset.theme === 'dark';
const hosts = [...document.querySelectorAll('.m3d[data-model]')];
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !e.target._m3d) { e.target._m3d = true; try { start(e.target); } catch (err) { console.warn(err); } } }), { rootMargin: '300px' });
hosts.forEach(h => io.observe(h));

function start(host) {
  const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true'); host.prepend(canvas);
  const st = makeStage(THREE, canvas, host.dataset.model, { dark: isDark(), pixelRatio: Math.min(devicePixelRatio, 2) });
  let target = +(host.dataset.turn || 0), cur = target, drag = false, lastX = 0, idle = 0, vis = true;
  st.root.rotation.y = cur;
  const size = () => { const r = host.getBoundingClientRect(); st.frame(Math.max(1, r.width), Math.max(1, r.height), +(host.dataset.fill || .74)); };
  size(); new ResizeObserver(size).observe(host);
  new MutationObserver(() => st.theme(isDark())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(host);
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); host.classList.add('grab'); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; target += (e.clientX - lastX) * .009; lastX = e.clientX; idle = 0; });
  const up = () => { drag = false; host.classList.remove('grab'); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  let first = true;
  (function frame() {
    requestAnimationFrame(frame);
    if (!vis || document.hidden) return;
    idle += 1 / 60; if (!drag && !reduced && idle > 1.5) target += .0022;
    cur += (target - cur) * .08; st.root.rotation.y = cur;
    st.render();
    if (first) { first = false; host.classList.add('ready'); }
  })();
}
