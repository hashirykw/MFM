/* A gold khatam (eight-point star) medallion in 3D, carrying the MFM seal, at the top of each
   page's mihrab card. Built in code with Three.js r187 (local file); starts after the page is idle. */
import * as THREE from '/assets/folio/js/three.module.min.js';
import { orbit } from './orbit3d.js';

const hosts = [...document.querySelectorAll('.fpp-orb')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const idle = cb => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 300));
if (hosts.length) idle(() => hosts.forEach(h => { try { build(h); } catch (e) { console.warn(e); } }));

function build(host) {
  const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true'); host.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(28, 1, .1, 50); camera.position.set(0, 0, 8.4);
  scene.add(new THREE.HemisphereLight(0xfff4de, 0x0b3d2e, 1.3));
  const key = new THREE.DirectionalLight(0xffe2b0, 3); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fd1b0, 1.6); rim.position.set(-4, -2, -3); scene.add(rim);

  const gold = new THREE.MeshStandardMaterial({ color: 0xe2b04a, metalness: .85, roughness: .28 });
  const goldDk = new THREE.MeshStandardMaterial({ color: 0xb8862b, metalness: .9, roughness: .4 });
  const g = new THREE.Group(); scene.add(g);
  const star = (r1, r2, n = 8) => { const s = new THREE.Shape(); for (let i = 0; i < n * 2; i++) { const a = Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } return s; };
  const ext = (shape, d, m, z) => { const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: .08, bevelSize: .06, bevelSegments: 3, curveSegments: 24 }); geo.center(); const o = new THREE.Mesh(geo, m); o.position.z = z; g.add(o); return o; };
  ext(star(2.1, 1.62), .34, gold, 0);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.42, .07, 12, 64), goldDk); ring.position.z = .26; g.add(ring);
  // the seal on both faces
  const img = new Image(); img.src = '/mfm-logo.webp';
  const tex = new THREE.Texture(img); tex.colorSpace = THREE.SRGBColorSpace; img.onload = () => { tex.needsUpdate = true; };
  const face = new THREE.MeshStandardMaterial({ map: tex, roughness: .55, metalness: .05 });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.3, 48), face); disc.position.z = .3; g.add(disc);
  const back = disc.clone(); back.rotation.y = Math.PI; back.position.z = -.3; g.add(back);

  let px = 0, py = 0, tx = 0, ty = 0;
  canvas.style.pointerEvents = 'auto';
  const o = orbit(canvas, { auto: 0, scroll: true });
  const card = host.closest('.fp-panel') || host;
  card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
  card.addEventListener('pointerleave', () => { tx = ty = 0; });

  const size = () => { const r = host.getBoundingClientRect(), s = Math.max(1, Math.round(Math.min(r.width, r.height))); renderer.setSize(s, s, false); camera.aspect = 1; camera.updateProjectionMatrix(); };
  size(); new ResizeObserver(size).observe(host);
  let vis = true; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(host);
  const t0 = performance.now();
  (function frame() {
    requestAnimationFrame(frame); if (!vis || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    px += (tx - px) * .08; py += (ty - py) * .08;
    o.step();
    g.rotation.y = (reduced ? 0 : Math.sin(t * .7) * .55) + px * .9 + o.yaw;
    g.rotation.x = py * -.6 + (reduced ? 0 : Math.sin(t * .5) * .08) + o.pitch;
    g.rotation.z = reduced ? 0 : t * .05;
    disc.rotation.z = back.rotation.z = -g.rotation.z;
    renderer.render(scene, camera);
  })();
  host.classList.add('ready');
}
