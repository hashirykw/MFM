/* The prayer corner: a janamaz in 3D, floating and turning slowly. Drag to turn it.
   Built in code with Three.js r187 (local file); starts only when the section comes near. */
import * as THREE from '/assets/folio/js/three.module.min.js';

const stage = document.getElementById('salahStage');
const canvas = document.getElementById('salahCanvas');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (stage && canvas) {
  const io = new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); try { init(); } catch (e) { console.warn(e); } } }, { rootMargin: '300px' });
  io.observe(stage);
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, .1, 100); camera.position.set(0, 6.2, 9.6); camera.lookAt(0, 0, 0);
  const hemi = new THREE.HemisphereLight(0xfff4de, 0x2f5a4c, 1.25); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe6bd, 2.4); sun.position.set(4, 9, 6); scene.add(sun);
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

  const rugT = tex(512, 900, (x, w, h) => {
    x.fillStyle = '#8e2f2a'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#0f5a42'; x.fillRect(26, 26, w - 52, h - 52);
    x.strokeStyle = '#e2b04a'; x.lineWidth = 6; x.strokeRect(40, 40, w - 80, h - 80); x.lineWidth = 2; x.strokeRect(54, 54, w - 108, h - 108);
    // border chevrons
    x.fillStyle = '#e2b04a'; for (let y = 70; y < h - 70; y += 34) { x.beginPath(); x.moveTo(12, y); x.lineTo(22, y + 10); x.lineTo(12, y + 20); x.fill(); x.beginPath(); x.moveTo(w - 12, y); x.lineTo(w - 22, y + 10); x.lineTo(w - 12, y + 20); x.fill(); }
    // the mihrab arch at the head of the mat
    const ax = w / 2, top = 96, ah = 460, aw = 300; x.fillStyle = '#0b3d2e'; x.beginPath(); x.moveTo(ax - aw / 2, top + ah); x.lineTo(ax - aw / 2, top + 170); x.quadraticCurveTo(ax - aw / 2, top + 30, ax, top); x.quadraticCurveTo(ax + aw / 2, top + 30, ax + aw / 2, top + 170); x.lineTo(ax + aw / 2, top + ah); x.closePath(); x.fill();
    x.strokeStyle = '#e2b04a'; x.lineWidth = 5; x.stroke();
    // hanging lamp and a small dome inside the arch
    x.strokeStyle = '#e2b04a'; x.lineWidth = 2; x.beginPath(); x.moveTo(ax, top + 30); x.lineTo(ax, top + 140); x.stroke(); x.fillStyle = '#e2b04a'; x.beginPath(); x.arc(ax, top + 156, 16, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(226,176,74,.55)'; x.beginPath(); x.arc(ax, top + 380, 62, Math.PI, 0); x.fill(); x.fillRect(ax - 70, top + 380, 140, 70);
    // eight-point stars over the field
    const star = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? r * .55 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); };
    x.fillStyle = 'rgba(226,176,74,.75)'; [[150, 640], [362, 640], [256, 740], [150, 820], [362, 820]].forEach(([a, b]) => star(a, b, 26));
  });

  /* the mat: a soft, slightly rippled cloth with a thin edge and fringes at both ends */
  const W = 2.3, L = 4.05, geo = new THREE.PlaneGeometry(W, L, 24, 48);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); pos.setY(i, Math.sin(z * 1.6 + .4) * .05 + Math.sin(x * 2.3) * .025 + (z > L / 2 - .5 ? (z - (L / 2 - .5)) * .28 : 0)); }
  geo.computeVertexNormals();
  const mat = new THREE.Group(); scene.add(mat);
  const top = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: rugT, roughness: .92, side: THREE.FrontSide })); mat.add(top);
  const under = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x5e1f1b, roughness: 1, side: THREE.BackSide })); under.position.y = -.025; mat.add(under);
  const fr = new THREE.MeshStandardMaterial({ color: 0xf1e6cf, roughness: .9 });
  for (const s of [-1, 1]) for (let i = 0; i < 16; i++) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(.03, .012, .22), fr);
    const x = -W / 2 + .1 + i * (W - .2) / 15, z = s * (L / 2 + .1);
    f.position.set(x, (s > 0 ? .28 * .5 : 0) + Math.sin(z * 1.6 + .4) * .05, z); f.rotation.y = (Math.random() - .5) * .25; mat.add(f);
  }
  /* a tasbih resting on the mat */
  const beads = new THREE.Group(); beads.position.set(.62, .07, 1.1); mat.add(beads);
  const bm = new THREE.MeshStandardMaterial({ color: 0xe2b04a, metalness: .6, roughness: .3 });
  for (let i = 0; i < 33; i++) { const a = i / 33 * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(.04, 10, 8), bm); b.position.set(Math.cos(a) * .3, 0, Math.sin(a) * .2); beads.add(b); }
  /* a soft shadow under it */
  const sh = tex(256, 256, (x, w) => { const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(5,31,32,.35)'); g.addColorStop(1, 'rgba(5,31,32,0)'); x.fillStyle = g; x.fillRect(0, 0, w, w); });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 5.6), new THREE.MeshBasicMaterial({ map: sh, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.55; scene.add(shadow);

  mat.rotation.set(0, -.5, 0);
  let target = -.5, cur = -.5, drag = false, lastX = 0, idle = 0;
  canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', e => { if (!drag) return; target += (e.clientX - lastX) * .01; lastX = e.clientX; idle = 0; });
  const up = () => { drag = false; canvas.style.cursor = 'grab'; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  function size() { const r = stage.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height); renderer.setSize(w, h, false); camera.aspect = w / h; const k = w / h < 1 ? 1.25 : 1; camera.position.set(0, 5.3 * k, 8.1 * k); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); }
  size(); new ResizeObserver(size).observe(stage);
  const theme = () => { const d = document.documentElement.dataset.theme === 'dark'; hemi.intensity = d ? .75 : 1.25; sun.intensity = d ? 1.6 : 2.4; };
  theme(); document.addEventListener('hma:theme', theme);
  let vis = true; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(stage);
  const t0 = performance.now();
  (function frame() {
    requestAnimationFrame(frame); if (!vis || document.hidden) return;
    const t = (performance.now() - t0) / 1000; idle += 1 / 60;
    if (!drag && !reduced && idle > 2) target += .0025;
    cur += (target - cur) * .08; mat.rotation.y = cur;
    mat.position.y = reduced ? 0 : Math.sin(t * 1.1) * .08; mat.rotation.x = reduced ? 0 : Math.sin(t * .8) * .03;
    shadow.scale.setScalar(1 - mat.position.y * .4);
    renderer.render(scene, camera);
  })();
  stage.classList.add('ready');
}
