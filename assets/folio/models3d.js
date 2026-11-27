/* MFM · six syllabus dioramas built in code (Three.js r187), in the same hand as the hero masjid:
   kaaba · hira · quran · badr · mihrab · nabawi. Each sits on a round plinth with a matte gold band.
   Used two ways: rendered once to the folio plates (tools/folio/render), and live on the page
   (scene3d.js) where they can be turned. No figures of people anywhere. */

export function kit(THREE) {
  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .7, metalness: 0, envMapIntensity: .55, ...o });
  const F = (c, o = {}) => M(c, { flatShading: true, roughness: .95, envMapIntensity: .28, ...o });
  const mat = {
    marble: M(0xf3efe7, { roughness: .38 }), marble2: M(0xe4ddd0, { roughness: .42 }), marble3: M(0xd6cebf, { roughness: .45 }), sand: M(0xd6b989, { envMapIntensity: .35 }), sandDk: M(0xb38d5c, { envMapIntensity: .35 }), sandLt: M(0xe2cba2, { envMapIntensity: .35 }),
    rock: F(0x9a7a5c), rock2: F(0x806349), rockDk: F(0x5f4a3a), soil: F(0x6d5544),
    kiswa: M(0x141615, { roughness: .95 }), gold: M(0xc9a24f, { metalness: .75, roughness: .42 }), goldDk: M(0xa9853c, { metalness: .7, roughness: .48 }),
    green: M(0x195739, { roughness: .6 }), greenDk: M(0x0b462b, { roughness: .7 }), greenDome: M(0x2f7a4f, { roughness: .32, metalness: .15 }),
    silver: M(0xc8ccd0, { metalness: .8, roughness: .32 }), arch: M(0x1d2a24), archLit: M(0x2a2418, { emissive: 0xffb54a, emissiveIntensity: 0 }),
    wood: M(0x6c4529), wood2: M(0x8a5a33), woodLt: M(0xa8774a), page: M(0xfbf6e8, { flatShading: false }), cover: M(0x195739, { roughness: .55 }),
    rug: M(0x7a2a26), rug2: M(0x195739), water: M(0x5e9f9a, { roughness: .18, metalness: .1 }),
    grass: M(0x93ad72), leaf: F(0x4f7d45), leaf2: F(0x66924f), trunk: F(0x87603e), date: M(0xa0672f),
    lamp: M(0xffe2a0, { emissive: 0xffc35a, emissiveIntensity: .25 }), glass: new THREE.MeshStandardMaterial({ color: 0xdfe9e4, roughness: .1, metalness: 0, transparent: true, opacity: .45 }),
    white: M(0xf7f5f0), canopy: M(0xf6f3ec, { side: THREE.DoubleSide })
  };
  const add = (p, geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
  const box = (p, w, h, d, m, x, y, z) => add(p, new THREE.BoxGeometry(w, h, d), m, x, y, z);
  /* a box with softly rounded edges (reads as stone and cloth, not card) */
  function rboxGeo(w, h, d, r = .06) {
    r = Math.min(r, w / 2 - .001, h / 2 - .001);
    const s = new THREE.Shape(), x = -w / 2 + r, y = -h / 2 + r, W = w - 2 * r, H = h - 2 * r;
    s.moveTo(x, y - r); s.lineTo(x + W, y - r); s.quadraticCurveTo(x + W + r, y - r, x + W + r, y); s.lineTo(x + W + r, y + H);
    s.quadraticCurveTo(x + W + r, y + H + r, x + W, y + H + r); s.lineTo(x, y + H + r); s.quadraticCurveTo(x - r, y + H + r, x - r, y + H); s.lineTo(x - r, y); s.quadraticCurveTo(x - r, y - r, x, y - r);
    const g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r * .999, bevelSegments: 3, curveSegments: 4 });
    g.translate(0, 0, -(d - 2 * r) / 2); return g;
  }
  const rbox = (p, w, h, d, m, x, y, z, r) => add(p, rboxGeo(w, h, d, r), m, x, y, z);
  const cyl = (p, rt, rb, h, m, x, y, z, seg = 16) => add(p, new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z);
  function archShape(w, h) {
    const s = new THREE.Shape(), r = w / 2, sh = h - w * .78;
    s.moveTo(-r, 0); s.lineTo(-r, sh); s.quadraticCurveTo(-r, sh + w * .55, 0, h); s.quadraticCurveTo(r, sh + w * .55, r, sh); s.lineTo(r, 0); s.lineTo(-r, 0);
    return s;
  }
  const archGeo = (w, h, d = .12) => new THREE.ExtrudeGeometry(archShape(w, h), { depth: d, bevelEnabled: false, curveSegments: 12 });
  function domeGeo(r, h, seg = 24, onion = true) {
    const prof = onion ? [[1, 0], [1.1, .14], [1.16, .3], [1.08, .46], [.86, .62], [.55, .77], [.27, .89], [.09, .97], [.02, 1]]
                       : [[1, 0], [1, .12], [.97, .34], [.88, .56], [.7, .76], [.44, .9], [.16, .98], [.02, 1]];
    const curve = new THREE.SplineCurve(prof.map(([x, y]) => new THREE.Vector2(x * r, y * h)));
    const pts = curve.getPoints(30); pts.push(new THREE.Vector2(.001, h));
    return new THREE.LatheGeometry(pts, seg);
  }
  function finial(p, x, y, z, s = 1) {
    cyl(p, .05 * s, .09 * s, .7 * s, mat.gold, x, y + .35 * s, z, 8);
    add(p, new THREE.SphereGeometry(.13 * s, 12, 8), mat.gold, x, y + .55 * s, z);
    const c = add(p, new THREE.TorusGeometry(.19 * s, .045 * s, 6, 20, Math.PI * 1.35), mat.gold, x, y + .95 * s, z); c.rotation.z = Math.PI * .82;
    return c;
  }
  function palm(p, x, z, s = 1) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); p.add(g);
    for (let i = 0; i < 6; i++) { const t = cyl(g, .15 - i * .011, .17 - i * .011, .55, mat.trunk, Math.sin(i * .5) * .08, .28 + i * .52, 0, 6); t.rotation.z = .04 * i; }
    for (let k = 0; k < 12; k++) {
      const f = add(g, new THREE.ConeGeometry(.24, 2.2, 6, 4), k % 2 ? mat.leaf : mat.leaf2, 0, 3.25, 0);
      f.geometry.translate(0, 1.1, 0); f.scale.set(1, 1, .2); f.rotation.set(1.75 + (k % 3) * .2, k / 12 * Math.PI * 2, 0, 'YXZ');
    }
    for (let k = 0; k < 5; k++) add(g, new THREE.SphereGeometry(.09, 6, 5), mat.date, Math.sin(k * 1.3) * .2, 3.0, Math.cos(k * 1.3) * .2);
    return g;
  }
  function rand(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function tex(w, h, draw) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }
  /* the plinth every diorama stands on */
  function plinth(p, r, topMat) {
    add(p, new THREE.CylinderGeometry(r, r, .5, 128), topMat, 0, -.25, 0).castShadow = false;
    const bead = add(p, new THREE.TorusGeometry(r + .02, .05, 8, 160), mat.gold, 0, -.02, 0); bead.rotation.x = Math.PI / 2;
    add(p, new THREE.CylinderGeometry(r + .06, r + .06, .16, 128), mat.gold, 0, -.58, 0);
    const band = tex(2048, 128, (x, w, h) => { x.fillStyle = '#0b462b'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(201,162,79,.85)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 22); x.lineTo(w, 22); x.moveTo(0, h - 22); x.lineTo(w, h - 22); x.stroke(); x.fillStyle = 'rgba(201,162,79,.85)'; for (let i = 16; i < w; i += 64) { x.beginPath(); x.moveTo(i, h / 2 - 9); x.lineTo(i + 9, h / 2); x.lineTo(i, h / 2 + 9); x.lineTo(i - 9, h / 2); x.closePath(); x.fill(); } x.lineWidth = 1.5; x.strokeStyle = 'rgba(201,162,79,.45)'; for (let i = 48; i < w; i += 64) { x.beginPath(); x.moveTo(i - 14, h / 2); x.lineTo(i + 14, h / 2); x.stroke(); } });
    band.wrapS = THREE.RepeatWrapping; band.repeat.set(Math.round(r / 2), 1);
    add(p, new THREE.CylinderGeometry(r + .02, r - .5, 1.4, 128, 1, true), new THREE.MeshStandardMaterial({ map: band, roughness: .55, envMapIntensity: .5 }), 0, -1.36, 0);
    add(p, new THREE.CircleGeometry(r - .5, 96), mat.greenDk, 0, -2.06, 0).rotation.x = Math.PI / 2;
    const foot = add(p, new THREE.TorusGeometry(r - .48, .06, 8, 160), mat.gold, 0, -2.04, 0); foot.rotation.x = Math.PI / 2;
  }
  /* soft contact shadow under a building (fakes ambient occlusion where it meets the ground) */
  let aoTex = null;
  function ao(p, x, z, w, d, k = .5, y = .012) {
    aoTex = aoTex || tex(256, 256, (c, W) => { const gr = c.createRadialGradient(W / 2, W / 2, W * .18, W / 2, W / 2, W / 2); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, W, W); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: aoTex, transparent: true, opacity: k, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.renderOrder = 1; p.add(m); return m;
  }
  function cypress(p, x, z, h = 2) {
    cyl(p, .05, .07, .35, mat.trunk, x, .18, z, 6);
    for (let i = 0; i < 4; i++) { const r = .36 - i * .07, c = add(p, new THREE.ConeGeometry(r, h * .42, 10), i % 2 ? mat.leaf : mat.leaf2, x, .35 + h * (.2 + i * .2), z); }
  }
  function olive(p, x, z, s = 1) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); p.add(g);
    const t = cyl(g, .07, .13, .7, mat.trunk, 0, .35, 0, 7); t.rotation.z = .12;
    const om = new THREE.MeshStandardMaterial({ color: 0x80946a, roughness: .9, flatShading: true });
    for (const [dx, dy, dz, r] of [[0, 1.05, 0, .55], [.4, .95, .2, .4], [-.35, .98, -.2, .42], [.1, 1.3, -.15, .38]]) add(g, new THREE.IcosahedronGeometry(r, 1), om, dx, dy, dz).scale.set(1.15, .8, 1.15);
    return g;
  }
  /* a ring of pointed arches on columns (a riwaq), used round the Haram and the plazas */
  function arcade(p, r, n, h, opts = {}) {
    const g = new THREE.Group(); p.add(g); const a0 = opts.from || 0, a1 = opts.to || Math.PI * 2;
    for (let k = 0; k < n; k++) {
      const a = a0 + (a1 - a0) * (k + .5) / n, x = Math.cos(a) * r, z = Math.sin(a) * r;
      cyl(g, .11, .13, h, mat.marble2, x, h / 2, z, 12);
      cyl(g, .19, .14, .16, mat.gold, x, h + .02, z, 12);
      const w = 2 * Math.PI * r / n * ((a1 - a0) / (Math.PI * 2));
      const ar = add(g, archGeo(w * .82, .9, .14), mat.marble, Math.cos(a + (a1 - a0) / n / 2) * r, h + .05, Math.sin(a + (a1 - a0) / n / 2) * r);
      ar.lookAt(0, h + .05, 0); ar.rotateY(Math.PI);
    }
    const ring = add(g, new THREE.TorusGeometry(r, .16, 6, 96, a1 - a0), mat.marble2, 0, h + 1.0, 0); ring.rotation.x = Math.PI / 2; ring.rotation.z = a0;
    return g;
  }
  return { THREE, mat, M, F, add, box, rbox, rboxGeo, cyl, archGeo, archShape, domeGeo, finial, palm, rand, tex, plinth, arcade, ao, cypress, olive };
}

/* ------------------------------------------------------------------ the Ka'ba in the mataf */
function minaretK(K, p, x, z, h, s = 1) {         // a slender Haram minaret: square base, balconies, crescent
  const { THREE, mat, add, box, cyl, domeGeo, finial } = K, m = new THREE.Group(); m.position.set(x, 0, z); m.scale.setScalar(s); p.add(m);
  K.rbox(m, 1.3, 2.4, 1.3, mat.marble2, 0, 1.2, 0, .06);
  for (const y of [.6, 1.7]) { const r = add(m, new THREE.TorusGeometry(.66, .04, 6, 4), mat.gold, 0, y, 0); r.rotation.x = Math.PI / 2; r.rotation.z = Math.PI / 4; }
  cyl(m, .46, .56, h, mat.marble, 0, 2.4 + h / 2, 0, 16);
  for (const f of [.38, .7]) {
    const y = 2.4 + h * f;
    cyl(m, .86, .56, .34, mat.marble2, 0, y, 0, 24); cyl(m, .9, .9, .06, mat.gold, 0, y + .2, 0, 24);
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; cyl(m, .02, .02, .32, mat.marble3, Math.cos(a) * .84, y + .4, Math.sin(a) * .84, 4); }
    const rail = add(m, new THREE.TorusGeometry(.84, .025, 6, 32), mat.gold, 0, y + .56, 0); rail.rotation.x = Math.PI / 2;
  }
  cyl(m, .4, .44, 1.2, mat.marble, 0, 2.4 + h + .6, 0, 16);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const w = add(m, K.archGeo(.16, .55, .04), mat.arch, Math.sin(a) * .41, 2.4 + h + .25, Math.cos(a) * .41); w.rotation.y = a; }
  add(m, new THREE.ConeGeometry(.44, 1.9, 16), mat.marble2, 0, 2.4 + h + 2.15, 0);
  finial(m, 0, 2.4 + h + 3.0, 0, .75);
  return m;
}
function kaaba(K) {
  const { THREE, mat, add, box, rbox, cyl, tex, plinth, arcade } = K, g = new THREE.Group();
  const floor = tex(2048, 2048, (x, w) => {
    x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, w, w);
    const c = w / 2;
    x.fillStyle = '#e7e1d5'; x.beginPath(); x.arc(c, c, 420, 0, Math.PI * 2); x.fill();
    x.strokeStyle = 'rgba(150,138,118,.3)'; x.lineWidth = 3;
    for (let r = 240; r < 1500; r += 70) { x.beginPath(); x.arc(c, c, r, 0, Math.PI * 2); x.stroke(); }
    x.strokeStyle = 'rgba(150,138,118,.16)'; x.lineWidth = 2;
    for (let a = 0; a < 120; a++) { const t = a / 120 * Math.PI * 2; x.beginPath(); x.moveTo(c + Math.cos(t) * 240, c + Math.sin(t) * 240); x.lineTo(c + Math.cos(t) * 1500, c + Math.sin(t) * 1500); x.stroke(); }
    x.strokeStyle = 'rgba(201,162,79,.55)'; x.lineWidth = 6; x.beginPath(); x.arc(c, c, 1360, 0, Math.PI * 2); x.stroke();
  });
  plinth(g, 11, new THREE.MeshStandardMaterial({ map: floor, roughness: .32, envMapIntensity: .8 }));
  // the kiswa: woven black cloth with faint jacquard, the gold hizam band, the gold qanadeel panels below it
  const cloth = tex(1024, 1280, (x, w, h) => {
    x.fillStyle = '#121413'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(255,255,255,.035)'; x.lineWidth = 2;
    for (let i = 0; i < w; i += 64) for (let j = 0; j < h; j += 64) { x.beginPath(); x.moveTo(i + 32, j + 8); x.lineTo(i + 56, j + 32); x.lineTo(i + 32, j + 56); x.lineTo(i + 8, j + 32); x.closePath(); x.stroke(); }
    x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 3; for (let i = 128; i < w; i += 170) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); }
    const by = h * .19, bh = h * .09;
    const gold = (a = 1) => `rgba(206,166,82,${a})`;
    x.fillStyle = '#181a19'; x.fillRect(0, by - 10, w, bh + 20);
    x.strokeStyle = gold(); x.lineWidth = 4; x.strokeRect(-6, by, w + 12, bh); x.lineWidth = 2; x.strokeRect(-6, by + 8, w + 12, bh - 16);
    x.lineWidth = 5; x.lineCap = 'round'; x.lineJoin = 'round';
    for (let i = 0; i < 46; i++) {          // abstract strokes in the rhythm of thuluth (not real text)
      const cx = 14 + i * 22, base = by + bh * .7, top = by + bh * .22;
      x.beginPath(); x.moveTo(cx, base); x.bezierCurveTo(cx + 3, top + 10, cx + 10, top, cx + 14, top + 18);
      if (i % 2) { x.moveTo(cx - 6, base); x.quadraticCurveTo(cx + 4, base + 6, cx + 18, base - 2); }
      if (i % 4 === 1) { x.moveTo(cx + 7, top + 2); x.lineTo(cx + 7, base - 6); }
      x.stroke();
    }
    for (let i = 0; i < 5; i++) {           // qanadeel: arched gold panels
      const px = w * (.1 + i * .2), py = by + bh + 70, pw = 70, ph = 120;
      x.fillStyle = gold(.95); x.beginPath(); x.moveTo(px - pw / 2, py + ph); x.lineTo(px - pw / 2, py + 30); x.quadraticCurveTo(px - pw / 2, py, px, py - 12); x.quadraticCurveTo(px + pw / 2, py, px + pw / 2, py + 30); x.lineTo(px + pw / 2, py + ph); x.closePath(); x.fill();
      x.fillStyle = '#141615'; x.fillRect(px - pw / 2 + 9, py + 28, pw - 18, ph - 38);
      x.strokeStyle = gold(); x.lineWidth = 3; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(px - 20, py + 46 + k * 18); x.quadraticCurveTo(px, py + 38 + k * 18, px + 20, py + 46 + k * 18); x.stroke(); }
    }
  });
  const kMat = new THREE.MeshStandardMaterial({ map: cloth, roughness: .9, envMapIntensity: .35 });
  const topMat = new THREE.MeshStandardMaterial({ color: 0x151716, roughness: .95 });
  const W = 4.4, H = 5.2, D = 5.0;
  const body = add(g, new THREE.BoxGeometry(W, H, D), [kMat, kMat, topMat, topMat, kMat, kMat], 0, H / 2 + .34, 0);
  rbox(g, W + .06, .12, D + .06, topMat, 0, H + .37, 0, .04);
  // shadharwan: the sloping marble base, with its bronze rings
  rbox(g, W + .7, .34, D + .7, mat.marble2, 0, .17, 0, .1);
  for (let k = 0; k < 10; k++) { const t = (k + .5) / 10; for (const [px, pz, ry] of [[-W / 2 + W * t, D / 2 + .3, 0], [-W / 2 + W * t, -D / 2 - .3, 0]]) { const r = add(g, new THREE.TorusGeometry(.06, .018, 6, 12), mat.goldDk, px, .3, pz); r.rotation.y = ry; } }
  // the door: raised, gold, panelled and studded
  const door = new THREE.Group(); door.position.set(W * .16, 0, D / 2 + .01); g.add(door);
  rbox(door, 1.15, 2.15, .1, mat.gold, 0, 2.95, .02, .03);
  for (const s of [-1, 1]) rbox(door, .46, 1.85, .05, mat.goldDk, s * .26, 2.95, .08, .02);
  for (let r = 0; r < 6; r++) for (const s of [-1, 1]) add(door, new THREE.SphereGeometry(.035, 8, 6), mat.gold, s * .26, 2.2 + r * .3, .12);
  add(door, K.archGeo(.9, .45, .04), mat.gold, 0, 3.92, .08);
  rbox(door, 1.4, .1, .36, mat.marble3, 0, 1.84, .12, .03);
  // the mizab: the gold rain spout over the Hijr
  const mz = box(g, .26, .18, 1.1, mat.gold, 0, H + .2, -D / 2 - .45); mz.rotation.x = -.08;
  // the Black Stone in its silver frame, at the eastern corner
  const bs = add(g, new THREE.TorusGeometry(.2, .07, 10, 28), mat.silver, W / 2 + .02, 1.6, D / 2 + .02); bs.rotation.y = Math.PI / 4; bs.scale.set(1, 1.3, 1);
  add(g, new THREE.SphereGeometry(.15, 14, 10), new THREE.MeshStandardMaterial({ color: 0x1a1412, roughness: .35 }), W / 2 + .02, 1.6, D / 2 + .02).scale.set(1, 1.2, .6);
  // the Hijr Isma'il: a low marble wall in a half circle, with its own marble floor
  const hs = new THREE.Shape(); hs.absarc(0, 0, 3.0, 0, Math.PI, false); hs.lineTo(-2.72, 0); hs.absarc(0, 0, 2.72, Math.PI, 0, true); hs.lineTo(3.0, 0);
  const hatim = add(g, new THREE.ExtrudeGeometry(hs, { depth: .72, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 3, curveSegments: 64 }), mat.marble, 0, .02, -D / 2 - .05);
  hatim.rotation.x = -Math.PI / 2;
  const hf = add(g, new THREE.CircleGeometry(2.72, 64, 0, Math.PI), mat.marble2, 0, .05, -D / 2 - .05); hf.rotation.x = -Math.PI / 2; hf.rotation.z = Math.PI; hf.castShadow = false;
  // Maqam Ibrahim: gold lattice and crystal under a small dome
  const mq = new THREE.Group(); mq.position.set(W * .1, 0, D / 2 + 3.1); g.add(mq);
  cyl(mq, .62, .7, .34, mat.marble2, 0, .17, 0, 32);
  cyl(mq, .44, .44, 1.15, mat.glass, 0, .92, 0, 32);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; cyl(mq, .025, .025, 1.15, mat.gold, Math.cos(a) * .45, .92, Math.sin(a) * .45, 6); }
  for (const y of [.4, .92, 1.45]) { const r = add(mq, new THREE.TorusGeometry(.46, .03, 8, 40), mat.gold, 0, y, 0); r.rotation.x = Math.PI / 2; }
  add(mq, K.domeGeo(.5, .75, 32, false), mat.gold, 0, 1.5, 0);
  K.finial(mq, 0, 2.2, 0, .45);
  // lanterns on posts round the mataf
  for (let k = 0; k < 16; k++) {
    const a = k / 16 * Math.PI * 2 + .1, r = 8.3, x = Math.cos(a) * r, z = Math.sin(a) * r;
    cyl(g, .12, .16, .3, mat.marble3, x, .15, z, 12);
    cyl(g, .04, .06, 2.4, mat.gold, x, 1.5, z, 8);
    cyl(g, .16, .12, .3, mat.gold, x, 2.75, z, 8);
    cyl(g, .13, .13, .32, mat.lamp, x, 3.0, z, 8);
    add(g, new THREE.ConeGeometry(.2, .26, 8), mat.gold, x, 3.3, z);
  }
  // the Haram behind: a curved arcade, two minarets
  arcade(g, 10.2, 22, 1.9, { from: Math.PI * .78, to: Math.PI * 1.72 });
  minaretK(K, g, Math.cos(Math.PI * .85) * 10.2, Math.sin(Math.PI * .85) * 10.2, 7.2, .9);
  minaretK(K, g, Math.cos(Math.PI * 1.65) * 10.2, Math.sin(Math.PI * 1.65) * 10.2, 7.2, .9);
  // Zamzam: a small marble kiosk with a green dome
  rbox(g, 1.3, .95, .95, mat.marble2, 6.4, .48, -4.6, .06);
  add(g, K.domeGeo(.55, .75, 24, false), mat.green, 6.4, .95, -4.6);
  K.ao(g, 0, 0, 9, 9.6, .55); K.ao(g, W * .1, D / 2 + 3.1, 2, 2, .4); K.ao(g, 0, -D / 2 - 1.5, 6.6, 3.6, .25);
  // lamps on the Hijr wall
  for (let k = 0; k < 5; k++) { const a = Math.PI * (k + .5) / 5, x = Math.cos(a) * 2.86, z = -D / 2 - .05 - Math.sin(a) * 2.86; cyl(g, .025, .03, .5, mat.gold, x, .98, z, 6); add(g, new THREE.SphereGeometry(.08, 10, 8), mat.lamp, x, 1.27, z); }
  // the clock tower beyond the Haram (Abraj al-Bait), far behind and in scale with the arcade
  const ct = new THREE.Group(); ct.position.set(-5.4, 0, -10.4); g.add(ct);
  K.rbox(ct, 2.6, 6, 2.6, mat.marble2, 0, 3, 0, .08);
  K.rbox(ct, 2.1, 4.5, 2.1, mat.marble, 0, 8.2, 0, .06);
  for (const r2 of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) { const cf = new THREE.Group(); cf.rotation.y = r2; ct.add(cf); add(cf, new THREE.CircleGeometry(.78, 48), new THREE.MeshStandardMaterial({ color: 0xf7f3e8, emissive: 0xfff1c8, emissiveIntensity: .25 }), 0, 9.0, 1.06); const rim = add(cf, new THREE.TorusGeometry(.8, .06, 8, 48), mat.green, 0, 9.0, 1.07); for (const [hx, hy, hr] of [[0, .3, 0], [.2, -.05, .9]]) { const h2 = box(cf, .05, .5, .02, mat.greenDk, 0, 9.0 + hy, 1.1); h2.rotation.z = hr; } }
  add(ct, K.domeGeo(.95, 1.6, 32, false), mat.green, 0, 10.45, 0);
  cyl(ct, .08, .14, 2.2, mat.gold, 0, 13.1, 0, 12); K.finial(ct, 0, 14.0, 0, 1.0);
  for (const sx of [-1.8, 1.8]) K.rbox(ct, 1.4, 4.4, 1.6, mat.marble3, sx, 2.2, .2, .06);
  return { group: g, cam: { pos: [15, 11.5, 17], look: [0, 2.2, 0], fov: 30 }, spin: true };
}

/* ------------------------------------------------------------------ Jabal al-Nur and the cave of Hira */
function hira(K) {
  const { THREE, mat, add, box, cyl, rand, plinth } = K, g = new THREE.Group();
  plinth(g, 9, mat.sand);
  const R = rand(610);
  function peak(r, h, x, z, m, seed, seg = 9) {
    const geo = new THREE.ConeGeometry(r, h, seg, 6, false); const pos = geo.attributes.position, rr = rand(seed);
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i); const t = (y + h / 2) / h; if (t > .97) continue;
      const k = (1 - t) * .55 + .1; pos.setX(i, pos.getX(i) * (1 + (rr() - .5) * k)); pos.setZ(i, pos.getZ(i) * (1 + (rr() - .5) * k)); pos.setY(i, y + (rr() - .5) * h * .05);
    }
    geo.computeVertexNormals();
    const col = [], c0 = new THREE.Color(m.color);
    for (let i = 0; i < pos.count; i++) { const t = (pos.getY(i) + h / 2) / h, band = .5 + .5 * Math.sin(pos.getY(i) * 3.1 + rr() * .6); const c = c0.clone().offsetHSL(0, -.02 + rr() * .03, (band - .5) * .08 + (t - .5) * .06 + (rr() - .5) * .05); col.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const vm = m.clone(); vm.color.set(0xffffff); vm.vertexColors = true;
    return add(g, geo.toNonIndexed ? geo : geo, vm, x, h / 2, z);
  }
  peak(5.2, 9.6, 0, -1, mat.rock, 1, 14);          // the mountain of light
  peak(3.4, 5.2, -4.2, 1.4, mat.rock2, 2);
  peak(3.2, 4.2, 4.4, .8, mat.rock2, 3);
  peak(2.4, 2.6, 2.6, 4.2, mat.rockDk, 4, 7);
  peak(2.0, 2.2, -2.9, 4.6, mat.rock, 5, 7);
  // the cave: two great slabs leaning together near the summit, a dark mouth between them
  const cave = new THREE.Group(); cave.position.set(.7, 6.9, .9); cave.rotation.y = .35; g.add(cave);
  add(cave, new THREE.SphereGeometry(.62, 10, 8), new THREE.MeshStandardMaterial({ color: 0x15110e, roughness: 1 }), 0, 0, .25).scale.set(1, 1.2, .45);
  const s1 = box(cave, 1.9, .5, 1.4, mat.rockDk, -.3, .85, .1); s1.rotation.set(.1, .2, -.35);
  const s2 = box(cave, 1.3, .45, 1.2, mat.rock2, .85, .5, .2); s2.rotation.set(-.15, -.3, .5);
  box(cave, .9, .3, .7, mat.rock, -1, -.45, .45).rotation.z = .3;
  // the path up: worn steps zig-zagging over the slope
  for (let i = 0; i < 36; i++) {
    const t = i / 36, y = .25 + t * 6.3, ang = .5 + Math.sin(t * 9) * .34, rad = 5.2 * (1 - y / 9.6) + .55;
    const st = box(g, .5, .12, .32, mat.sandLt, Math.sin(ang) * rad, y, -1 + Math.cos(ang) * rad);
    st.rotation.y = ang + Math.PI / 2;
  }
  // boulders, scrub and the dawn
  for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, r = 6 + R() * 2.4; add(g, new THREE.DodecahedronGeometry(.2 + R() * .35, 0), R() > .5 ? mat.rock : mat.rockDk, Math.cos(a) * r, .12, Math.sin(a) * r).rotation.set(R() * 3, R() * 3, 0); }
  for (let i = 0; i < 12; i++) { const a = R() * Math.PI * 2, r = 6.2 + R() * 2; add(g, new THREE.IcosahedronGeometry(.28 + R() * .2, 0), mat.leaf, Math.cos(a) * r, .22, Math.sin(a) * r); }
  const glow = K.tex(256, 256, (x, w) => { const gr = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,236,180,1)'); gr.addColorStop(.28, 'rgba(240,200,110,.95)'); gr.addColorStop(.34, 'rgba(240,200,110,.35)'); gr.addColorStop(1, 'rgba(240,200,110,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, w); });
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, transparent: true, depthWrite: false })); sun.position.set(-5.4, 10.2, -6.5); sun.scale.set(5.5, 5.5, 1); g.add(sun);
  // stones edging the path, scree below the cave, a small ledge where the cave opens
  for (let i = 0; i < 70; i++) { const t = i / 70, y = .3 + t * 6.2, ang = .5 + Math.sin(t * 9) * .34 + (i % 2 ? .1 : -.1), rad = 5.2 * (1 - y / 9.6) + .6; add(g, new THREE.DodecahedronGeometry(.08 + R() * .06, 0), mat.rockDk, Math.sin(ang) * rad, y + .08, -1 + Math.cos(ang) * rad); }
  for (let i = 0; i < 24; i++) { const a = .2 + R() * 1.2, y = 5.6 + R() * 1.2, rad = 5.2 * (1 - y / 9.6) + .3; add(g, new THREE.DodecahedronGeometry(.12 + R() * .18, 0), R() > .5 ? mat.rock2 : mat.rockDk, Math.sin(a) * rad, y, -1 + Math.cos(a) * rad).rotation.set(R() * 3, R() * 3, 0); }
  K.ao(g, 0, -1, 12, 12, .35);
  const nur = K.tex(128, 128, (x, w) => { const gr = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,240,200,.95)'); gr.addColorStop(.4, 'rgba(255,214,140,.45)'); gr.addColorStop(1, 'rgba(255,214,140,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, w); });
  const light = new THREE.Sprite(new THREE.SpriteMaterial({ map: nur, transparent: true, depthWrite: false })); light.position.set(.85, 7.05, 1.35); light.scale.set(1.4, 1.4, 1); g.add(light);
  for (let i = 0; i < 18; i++) { const t = i / 18, y = .3 + t * 6.0, ang = .5 + Math.sin(t * 9) * .34 + .16, rad = 5.2 * (1 - y / 9.6) + .72; cyl(g, .025, .03, .34, mat.wood, Math.sin(ang) * rad, y + .17, -1 + Math.cos(ang) * rad, 5); }
  // a small shaded rest stop at the foot of the path
  const rest = new THREE.Group(); rest.position.set(4.6, 0, 4.4); rest.rotation.y = -.6; g.add(rest);
  for (const [x, z] of [[-.6, -.4], [.6, -.4], [-.6, .4], [.6, .4]]) cyl(rest, .04, .05, 1.1, mat.wood, x, .55, z, 6);
  box(rest, 1.5, .06, 1.1, mat.sandLt, 0, 1.12, 0); box(rest, 1.1, .2, .3, mat.wood2, 0, .2, 0);
  return { group: g, cam: { pos: [14, 9, 18], look: [0, 4, 0], fov: 32 }, spin: true, sun };
}

/* ------------------------------------------------------------------ an open Qur'an on a carved rehal */
function quran(K) {
  const { THREE, mat, add, box, cyl, tex, plinth } = K, g = new THREE.Group();
  const rug = tex(1024, 1024, (x, w) => {
    x.fillStyle = '#7a2a26'; x.fillRect(0, 0, w, w);
    x.fillStyle = '#195739'; x.beginPath(); x.arc(w / 2, w / 2, w * .42, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#c9a24f'; x.lineWidth = 10; x.beginPath(); x.arc(w / 2, w / 2, w * .44, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 4; x.beginPath(); x.arc(w / 2, w / 2, w * .395, 0, Math.PI * 2); x.stroke();
    x.save(); x.translate(w / 2, w / 2); x.strokeStyle = 'rgba(201,162,79,.55)'; x.lineWidth = 3;
    for (let k = 0; k < 16; k++) { x.rotate(Math.PI / 8); x.beginPath(); x.moveTo(0, 60); x.quadraticCurveTo(60, 200, 0, 330); x.quadraticCurveTo(-60, 200, 0, 60); x.stroke(); }
    for (let k = 0; k < 8; k++) { x.rotate(Math.PI / 4); x.strokeRect(-46, -46, 92, 92); }
    x.restore();
  });
  plinth(g, 7, new THREE.MeshStandardMaterial({ map: rug, roughness: .95 }));
  const st = new THREE.Group(); st.scale.setScalar(1.35); g.add(st);
  // the rehal: two carved boards crossed in an X, each with a pointed-arch window; the open Qur'an
  // rests on the inner faces of the upper arms, spine in the crossing
  const bw = 3.2, bh = 5.6, tilt = .86, cy = bh / 2 * Math.cos(tilt) + .05;
  const board = new THREE.Shape();
  board.moveTo(-bw / 2, -bh / 2); board.lineTo(bw / 2, -bh / 2); board.lineTo(bw / 2, bh / 2 - .5); board.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - .5, bh / 2);
  board.lineTo(-bw / 2 + .5, bh / 2); board.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - .5); board.lineTo(-bw / 2, -bh / 2);
  board.holes.push(new THREE.Path(K.archShape(1.3, 1.9).getPoints(16).map(v => new THREE.Vector2(v.x, v.y - bh / 2 + .45)).reverse()));
  const boardGeo = new THREE.ExtrudeGeometry(board, { depth: .16, bevelEnabled: true, bevelSize: .04, bevelThickness: .04, bevelSegments: 3, curveSegments: 16 });
  boardGeo.translate(0, 0, -.08);
  const grain = (base, line) => { const t = tex(512, 896, (x, w, h) => {
    x.fillStyle = base; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(${line},${.05 + Math.random() * .12})`; x.lineWidth = 1 + Math.random() * 3; x.beginPath(); const x0 = Math.random() * w; x.moveTo(x0, 0); for (let y = 0; y <= h; y += 40) x.lineTo(x0 + Math.sin(y / 90 + i) * 8, y); x.stroke(); }
    x.strokeStyle = 'rgba(206,166,82,.9)'; x.lineWidth = 6; x.strokeRect(26, 26, w - 52, h - 52); x.lineWidth = 2; x.strokeRect(40, 40, w - 80, h - 80);
    x.save(); x.translate(w / 2, h * .2); x.strokeStyle = 'rgba(206,166,82,.85)'; x.lineWidth = 4; for (let k = 0; k < 2; k++) { x.rotate(Math.PI / 4); x.strokeRect(-44, -44, 88, 88); } x.beginPath(); x.arc(0, 0, 16, 0, Math.PI * 2); x.stroke(); x.restore();
  }); t.repeat.set(1 / bw, 1 / bh); t.offset.set(.5, .5); return t; };
  const woodA = new THREE.MeshStandardMaterial({ map: grain('#6c4529', '30,16,6'), roughness: .55, envMapIntensity: .5 });
  const woodB = new THREE.MeshStandardMaterial({ map: grain('#7d5130', '30,16,6'), roughness: .55, envMapIntensity: .5 });
  const pageTex = tex(512, 360, (x, w, h) => {
    x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#c9a24f'; x.lineWidth = 6; x.strokeRect(22, 22, w - 44, h - 44); x.lineWidth = 2; x.strokeRect(32, 32, w - 64, h - 64);
    x.fillStyle = 'rgba(40,36,30,.5)';
    for (let r = 0; r < 9; r++) { let px = w - 50; const y = 58 + r * 30; while (px > 54) { const L = 10 + Math.random() * 40; x.fillRect(px - L, y, L, 3); px -= L + 7 + Math.random() * 5; } }
    x.fillStyle = '#195739'; x.beginPath(); x.arc(w / 2, h - 26, 6, 0, Math.PI * 2); x.fill();
  });
  const pMat = new THREE.MeshStandardMaterial({ map: pageTex, roughness: .9 });
  for (const s of [-1, 1]) {
    const leaf = new THREE.Group(); leaf.position.set(0, cy, 0); leaf.rotation.x = s * tilt; st.add(leaf);
    add(leaf, boardGeo, s > 0 ? woodA : woodB, 0, 0, 0);
    const n = -s;                                   // the inner face of this arm
    const cv = box(leaf, 2.95, 2.25, .06, mat.cover, 0, 1.45, n * .15);
    const blk = box(leaf, 2.8, 2.1, .2, mat.page, 0, 1.45, n * .28);
    const geo = new THREE.PlaneGeometry(2.78, 2.08, 1, 18); const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) { const v = (pos.getY(i) + 1.04) / 2.08; pos.setZ(i, Math.sin(v * Math.PI * .9) * .16); }
    geo.computeVertexNormals();
    const pg = add(leaf, geo, pMat, 0, 1.45, n * .385); if (n < 0) pg.rotation.y = Math.PI;
    box(leaf, 2.8, .04, .2, mat.gold, 0, 2.5, n * .28); box(leaf, .04, 2.1, .2, mat.gold, s * 0 + 1.4, 1.45, n * .28); box(leaf, .04, 2.1, .2, mat.gold, -1.4, 1.45, n * .28);
    for (const cx of [-1.38, 1.38]) for (const cy2 of [.42, 2.48]) box(leaf, .26, .26, .08, mat.gold, cx, cy2, n * .13);
  }
  cyl(st, .05, .05, 3.3, mat.woodLt, 0, cy, 0, 8).rotation.z = Math.PI / 2;   // the hinge pin
  const rib = box(st, .08, .02, 1.9, mat.gold, .35, cy + .45, .9); rib.rotation.x = .5;
  // a fringe round the rug, a tasbih, an incense burner
  for (let k = 0; k < 180; k++) { const a = k / 180 * Math.PI * 2; const f = cyl(g, .015, .015, .34, mat.page, Math.cos(a) * 7.12, -.12, Math.sin(a) * 7.12, 4); f.rotation.z = Math.cos(a) * .5; f.rotation.x = -Math.sin(a) * .5; }
  const beads = new THREE.Group(); beads.position.set(-3.2, .1, -2.6); g.add(beads);
  const beadM = M => new THREE.MeshStandardMaterial({ color: M, roughness: .3, metalness: .1 });
  for (let k = 0; k < 33; k++) { const a = k / 33 * Math.PI * 2; add(beads, new THREE.SphereGeometry(.1, 12, 8), k % 11 === 0 ? mat.gold : beadM(0x1d4f37), Math.cos(a) * 1.05, 0, Math.sin(a) * .8); }
  cyl(beads, .06, .1, .5, mat.gold, 1.4, 0, .2, 10).rotation.z = Math.PI / 2;
  const ib = new THREE.Group(); ib.position.set(3.4, 0, -3.0); g.add(ib);
  cyl(ib, .5, .34, .2, mat.gold, 0, .1, 0, 24); cyl(ib, .18, .22, .5, mat.goldDk, 0, .45, 0, 16); add(ib, K.domeGeo(.55, .6, 24, false), mat.gold, 0, .7, 0);
  cyl(ib, .6, .6, .06, mat.gold, 0, .7, 0, 24); add(ib, new THREE.SphereGeometry(.08, 10, 8), mat.gold, 0, 1.36, 0);
  // a brass oil lamp and a small date-wood box beside it
  const lampG = new THREE.Group(); lampG.position.set(4.2, 0, 2.6); g.add(lampG);
  add(lampG, new THREE.SphereGeometry(.55, 18, 10), mat.gold, 0, .4, 0).scale.set(1.3, .55, .9);
  const sp = cyl(lampG, .05, .14, .8, mat.gold, .8, .5, 0, 10); sp.rotation.z = -1.25;
  add(lampG, new THREE.ConeGeometry(.08, .3, 10), mat.lamp, 1.18, .72, 0);
  const fl = K.tex(128, 128, (x, w) => { const gr = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,230,160,.9)'); gr.addColorStop(1, 'rgba(255,190,90,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, w); });
  const glowS = new THREE.Sprite(new THREE.SpriteMaterial({ map: fl, transparent: true, depthWrite: false })); glowS.position.set(1.18, .9, 0); glowS.scale.set(.9, .9, 1); lampG.add(glowS);
  box(g, 1.4, .6, 1.0, mat.wood2, -4.2, .3, 2.8); box(g, 1.46, .08, 1.06, mat.gold, -4.2, .62, 2.8);
  K.ao(g, 0, 0, 7, 6, .45); K.ao(g, 4.2, 2.6, 2.2, 1.6, .3); K.ao(g, -4.2, 2.8, 2, 1.6, .3);
  // a stack of bound books and a small lantern
  const stk = new THREE.Group(); stk.position.set(-4.4, 0, -1.8); stk.rotation.y = .4; g.add(stk);
  [[0x195739, 0], [0x7a2a26, .32], [0x0b462b, .64]].forEach(([c2, y], i) => { K.rbox(stk, 1.7 - i * .12, .3, 1.2 - i * .08, new THREE.MeshStandardMaterial({ color: c2, roughness: .6 }), (i % 2) * .08, .15 + y, 0, .04); box(stk, 1.6 - i * .12, .22, .02, mat.page, (i % 2) * .08, .15 + y, .6 - i * .04); box(stk, .04, .3, 1.22 - i * .08, mat.gold, -.85 + i * .06 + (i % 2) * .08, .15 + y, 0); });
  const ln = new THREE.Group(); ln.position.set(4.6, 0, -2.2); g.add(ln);
  cyl(ln, .35, .4, .14, mat.gold, 0, .07, 0, 8); cyl(ln, .28, .28, .8, mat.glass, 0, .54, 0, 8);
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; cyl(ln, .018, .018, .8, mat.gold, Math.cos(a) * .29, .54, Math.sin(a) * .29, 4); }
  add(ln, new THREE.ConeGeometry(.38, .4, 8), mat.gold, 0, 1.14, 0); add(ln, new THREE.TorusGeometry(.1, .025, 6, 16), mat.gold, 0, 1.42, 0);
  cyl(ln, .06, .06, .24, mat.lamp, 0, .3, 0, 10);
  return { group: g, cam: { pos: [6, 15, 11], look: [0, 3.4, 0], fov: 30 }, spin: true };
}

/* ------------------------------------------------------------------ the wells of Badr */
function badr(K) {
  const { THREE, mat, add, box, cyl, rand, palm, plinth } = K, g = new THREE.Group();
  plinth(g, 10, mat.sand);
  const R = rand(624);
  // dunes rolling over the plinth
  const dgeo = new THREE.CircleGeometry(9.9, 80, 0); dgeo.rotateX(-Math.PI / 2);
  const dp = dgeo.attributes.position;
  for (let i = 0; i < dp.count; i++) { const x = dp.getX(i), z = dp.getZ(i), r = Math.hypot(x, z); dp.setY(i, Math.max(0, (Math.sin(x * .55) * Math.cos(z * .4) + .6) * .45 * Math.min(1, (9.9 - r) / 3))); }
  dgeo.computeVertexNormals(); const dune = add(g, dgeo, mat.sandLt, 0, .01, 0); dune.castShadow = false;
  // three wells of stone with a wooden frame and a bucket
  const well = (x, z, rot) => {
    const w = new THREE.Group(); w.position.set(x, .2, z); w.rotation.y = rot; g.add(w);
    for (let ring = 0; ring < 3; ring++) for (let k = 0; k < 14; k++) {
      const a = (k + ring * .5) / 14 * Math.PI * 2; const st = box(w, .42, .3, .28, ring % 2 ? mat.marble3 : mat.rock, Math.cos(a) * 1.05, .15 + ring * .3, Math.sin(a) * 1.05); st.rotation.y = -a;
    }
    add(w, new THREE.CylinderGeometry(.86, .86, .05, 24), mat.water, 0, .75, 0);
    for (const s of [-1, 1]) { const p = box(w, .14, 2.3, .14, mat.wood, s * 1.15, 1.15, 0); p.rotation.z = -s * .08; }
    box(w, 2.6, .14, .14, mat.wood2, 0, 2.3, 0);
    const wheel = add(w, new THREE.TorusGeometry(.26, .05, 8, 20), mat.wood2, .3, 2.3, 0); add(w, new THREE.CylinderGeometry(.05, .05, .3, 8), mat.woodLt, .3, 2.3, 0).rotation.x = Math.PI / 2;
    cyl(w, .012, .012, 1.1, mat.woodLt, .56, 1.75, 0, 4);
    cyl(w, .2, .15, .3, mat.wood2, .56, 1.15, 0, 12); add(w, new THREE.TorusGeometry(.2, .02, 6, 16), mat.rockDk, .56, 1.3, 0).rotation.x = Math.PI / 2;
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; add(w, new THREE.DodecahedronGeometry(.16, 0), mat.rock2, Math.cos(a) * 1.5, .05, Math.sin(a) * 1.5); }
  };
  well(-2.4, -.6, .3); well(2.6, -1.8, -.4); well(.6, 3.0, .9);
  // date palms and the low hills that ringed the valley
  [[-6.2, -3.6, 1.05], [-7.1, 1.4, .9], [-5.4, 4.6, .8], [6.6, 2.6, 1], [7.4, -2.2, .85], [4.6, 6.0, .75], [-1.6, -6.6, .8]].forEach(p => palm(g, ...p));
  const hill = (r, h, x, z, m) => { const geo = new THREE.ConeGeometry(r, h, 8, 3); const pos = geo.attributes.position, rr = rand(x * 13 + z); for (let i = 0; i < pos.count; i++) if (pos.getY(i) < h / 2 - .01) { pos.setX(i, pos.getX(i) * (1 + (rr() - .5) * .3)); pos.setZ(i, pos.getZ(i) * (1 + (rr() - .5) * .3)); } geo.computeVertexNormals(); add(g, geo, m, x, h / 2, z); };
  hill(3, 2.6, -4.6, -7, mat.rock2); hill(2.4, 2, 1.6, -7.6, mat.rock); hill(2.6, 2.2, 6.4, -5.8, mat.rockDk);
  for (let i = 0; i < 18; i++) { const a = R() * Math.PI * 2, r = 4 + R() * 5; add(g, new THREE.DodecahedronGeometry(.12 + R() * .2, 0), mat.rock, Math.cos(a) * r, .25, Math.sin(a) * r); }
  // al-'Arish: the palm-frond shelter on its posts, on the rise above the wells
  const ar = new THREE.Group(); ar.position.set(-5.8, 0, -2.2); ar.rotation.y = .5; g.add(ar);
  for (const [x, z] of [[-1, -.8], [1, -.8], [-1, .8], [1, .8]]) cyl(ar, .07, .09, 2.2, mat.trunk, x, 1.1, z, 6);
  for (let k = 0; k < 14; k++) { const f = box(ar, 2.6, .05, .18, k % 2 ? mat.leaf : mat.leaf2, 0, 2.25 + (k % 2) * .03, -.95 + k * .145); f.rotation.z = (k % 3 - 1) * .04; }
  box(ar, 2.3, .06, 1.7, mat.trunk, 0, 2.18, 0);
  // two tents of woven hair cloth
  const tentTex = K.tex(256, 256, (x, w) => { for (let i = 0; i < w; i += 32) { x.fillStyle = i % 64 ? '#3a2c22' : '#e6d8bd'; x.fillRect(i, 0, 32, w); } });
  const tentM = new THREE.MeshStandardMaterial({ map: tentTex, roughness: .95, side: THREE.DoubleSide, envMapIntensity: .3 });
  for (const [x, z, r] of [[5.6, -4.4, .4], [3.4, -5.8, -.3]]) { const t = add(g, new THREE.ConeGeometry(1.5, 1.6, 4, 1, true), tentM, x, .8, z); t.rotation.y = Math.PI / 4 + r; t.scale.set(1.3, 1, .9); cyl(g, .04, .04, 1.9, mat.trunk, x, .95, z, 6); }
  // a water trough by the first well
  box(g, 2.2, .35, .6, mat.rock2, -2.2, .4, 1.4); box(g, 2.0, .05, .4, mat.water, -2.2, .56, 1.4);
  for (const [x, z] of [[-2.4, -.6], [2.6, -1.8], [.6, 3.0]]) K.ao(g, x, z, 3.4, 3.4, .4, .5);
  // the cistern dug by the wells (filled from them before the battle)
  const cs = new THREE.Group(); cs.position.set(1.2, .35, .4); cs.rotation.y = .3; g.add(cs);
  for (const [w, d, x, z] of [[3.4, .3, 0, -.95], [3.4, .3, 0, .95], [.3, 2.2, -1.55, 0], [.3, 2.2, 1.55, 0]]) K.rbox(cs, w, .45, d, mat.rock2, x, .1, z, .06);
  box(cs, 2.9, .06, 1.7, mat.water, 0, .18, 0);
  K.ao(g, 1.2, .4, 4.6, 3.2, .35, .5);
  return { group: g, cam: { pos: [14, 10.5, 16], look: [0, 1.4, 0], fov: 30 }, spin: true };
}

/* ------------------------------------------------------------------ a mihrab, the minbar and the lamps */
function mihrab(K) {
  const { THREE, mat, add, box, cyl, tex, archShape, archGeo, domeGeo, plinth } = K, g = new THREE.Group();
  const floorT = tex(1024, 1024, (x, w) => { x.fillStyle = '#efebe3'; x.fillRect(0, 0, w, w); x.strokeStyle = 'rgba(140,125,100,.25)'; x.lineWidth = 2; for (let i = 0; i <= w; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, w); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); } x.fillStyle = 'rgba(25,87,57,.2)'; for (let i = 0; i < w; i += 128) for (let j = 0; j < w; j += 128) { x.save(); x.translate(i + 64, j + 64); x.rotate(Math.PI / 4); x.fillRect(-12, -12, 24, 24); x.restore(); } });
  plinth(g, 8.5, new THREE.MeshStandardMaterial({ map: floorT, roughness: .3, envMapIntensity: .6 }));
  const tiles = tex(512, 512, (x, w) => {
    x.fillStyle = '#195739'; x.fillRect(0, 0, w, w);
    x.strokeStyle = '#c9a24f'; x.lineWidth = 3;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const cx = 64 + i * 128, cy = 64 + j * 128; x.save(); x.translate(cx, cy);
      for (let k = 0; k < 2; k++) { x.rotate(Math.PI / 4); x.strokeRect(-34, -34, 68, 68); }
      x.beginPath(); x.arc(0, 0, 14, 0, Math.PI * 2); x.stroke(); x.restore();
    }
  });
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping; tiles.repeat.set(1.5, 2.2);
  const tileMat = new THREE.MeshStandardMaterial({ map: tiles, roughness: .5 });
  // the qibla wall
  const wall = new THREE.Group(); wall.position.set(0, 0, -3); g.add(wall);
  const ws = new THREE.Shape(); ws.moveTo(-7, 0); ws.lineTo(7, 0); ws.lineTo(7, 8); ws.lineTo(-7, 8); ws.lineTo(-7, 0);
  const niche = archShape(3.2, 6.2); ws.holes.push(new THREE.Path(niche.getPoints(20).map(v => new THREE.Vector2(v.x, v.y + .3)).reverse()));
  add(wall, new THREE.ExtrudeGeometry(ws, { depth: 1, bevelEnabled: false, curveSegments: 20 }), mat.marble, 0, 0, 0);
  box(wall, 14.2, .4, 1.2, mat.marble2, 0, 8.1, .5);
  for (let x = -6.8; x <= 6.85; x += .7) box(wall, .34, .38, .3, mat.marble2, x, 8.5, .9);
  // the niche: tiled back, a half dome, a gold frame
  box(wall, 3.2, 6.3, .2, tileMat, 0, 3.2, -.55);
  const hd = add(wall, new THREE.SphereGeometry(1.6, 24, 12, 0, Math.PI, 0, Math.PI / 2), tileMat, 0, 4.0, -.45); hd.rotation.x = -Math.PI / 2; hd.rotation.z = Math.PI; hd.scale.set(1, 1, .7);
  // muqarnas: tiers of small gold-edged cells filling the hood of the niche
  for (let row = 0; row < 5; row++) {
    const n = 9 - row * 1.5 | 0, rr = 1.5 - row * .27, y = 4.05 + row * .36;
    for (let k = 0; k < n; k++) {
      const a = Math.PI * (k + .5) / n; const c = add(wall, K.archGeo(.34 - row * .03, .42, .1), row % 2 ? mat.gold : tileMat, Math.cos(a) * rr, y, -.45 + Math.sin(a) * rr * .65);
      c.lookAt(0, y, -2); c.rotateY(Math.PI);
    }
  }
  // a calligraphy band over the arch (abstract gold strokes on green, not real text)
  const cal = tex(1024, 128, (x, w, h) => { x.fillStyle = '#195739'; x.fillRect(0, 0, w, h); x.strokeStyle = '#d0aa58'; x.lineWidth = 6; x.lineCap = 'round'; for (let i = 0; i < 40; i++) { const cx = 16 + i * 25; x.beginPath(); x.moveTo(cx, 96); x.bezierCurveTo(cx + 2, 30, cx + 12, 22, cx + 16, 50); if (i % 2) { x.moveTo(cx - 8, 98); x.quadraticCurveTo(cx + 6, 108, cx + 20, 94); } x.stroke(); } x.strokeStyle = '#d0aa58'; x.lineWidth = 4; x.strokeRect(4, 6, w - 8, h - 12); });
  box(wall, 9.4, .9, .12, new THREE.MeshStandardMaterial({ map: cal, roughness: .5 }), 0, 7.35, 1.06);
  const fr = new THREE.Shape(archShape(4.0, 7.1).getPoints(24)); fr.holes.push(new THREE.Path(archShape(3.4, 6.5).getPoints(24).map(v => new THREE.Vector2(v.x, v.y + .1)).reverse()));
  add(wall, new THREE.ExtrudeGeometry(fr, { depth: .14, bevelEnabled: false, curveSegments: 20 }), mat.gold, 0, .05, 1.0);
  const band = new THREE.Shape(archShape(4.6, 7.7).getPoints(24)); band.holes.push(new THREE.Path(archShape(4.05, 7.15).getPoints(24).map(v => new THREE.Vector2(v.x, v.y)).reverse()));
  add(wall, new THREE.ExtrudeGeometry(band, { depth: .1, bevelEnabled: false, curveSegments: 20 }), mat.green, 0, .02, 1.0);
  for (const s of [-1, 1]) {     // twin columns with gold capitals
    cyl(wall, .2, .22, 4.6, mat.marble3, s * 1.82, 2.6, 1.25, 12);
    cyl(wall, .3, .22, .35, mat.gold, s * 1.82, 5.05, 1.25, 12);
    cyl(wall, .3, .3, .2, mat.gold, s * 1.82, .1, 1.25, 12);
  }
  // panels of tile either side
  for (const s of [-1, 1]) { const p = box(wall, 3.4, 3.2, .06, tileMat, s * 4.6, 3.4, 1.03); }
  // the minbar: steps up to a small domed canopy
  const mb = new THREE.Group(); mb.position.set(4.3, 0, -.6); mb.rotation.y = -Math.PI / 2; g.add(mb);
  for (let i = 0; i < 7; i++) box(mb, 1.3, .42 * (i + 1), .7, i % 2 ? mat.wood2 : mat.wood, 0, .21 * (i + 1), i * .7);
  for (const s of [-1, 1]) { const rail = box(mb, .1, .12, 5.2, mat.gold, s * .68, 2.7, 2.2); rail.rotation.x = -.55; }
  for (const s of [-1, 1]) for (const z of [4.4, 5.3]) cyl(mb, .07, .07, 2.2, mat.wood2, s * .55, 4.05, z, 8);
  add(mb, domeGeo(.75, 1.4, 24), mat.green, 0, 5.15, 4.85); K.finial(mb, 0, 6.5, 4.85, .6);
  const lat = tex(256, 256, (x, w) => { x.clearRect(0, 0, w, w); x.strokeStyle = '#d0aa58'; x.lineWidth = 7; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.save(); x.translate(32 + i * 64, 32 + j * 64); for (let k = 0; k < 2; k++) { x.rotate(Math.PI / 4); x.strokeRect(-18, -18, 36, 36); } x.restore(); } });
  const latM = new THREE.MeshStandardMaterial({ map: lat, transparent: true, alphaTest: .4, side: THREE.DoubleSide, metalness: .6, roughness: .45 });
  for (const sd of [-1, 1]) { const tri = new THREE.Shape(); tri.moveTo(0, 0); tri.lineTo(4.4, 0); tri.lineTo(4.4, 2.9); tri.lineTo(0, 0); const tg = new THREE.ShapeGeometry(tri); const uv = tg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 1.5, uv.getY(i) / 1.5); const t = add(mb, tg, latM, sd * .67, .5, -.3); t.rotation.y = -Math.PI / 2; }
  add(mb, K.archGeo(.6, 1.1, .06), mat.arch, 0, 0, -.38);
  // prayer rugs in a row, and two hanging lamps
  const rugTex = tex(256, 512, (x, w, h) => { x.fillStyle = '#7a2a26'; x.fillRect(0, 0, w, h); x.fillStyle = '#195739'; const s = new Path2D(); s.moveTo(40, h - 40); s.lineTo(40, 170); s.quadraticCurveTo(40, 70, w / 2, 50); s.quadraticCurveTo(w - 40, 70, w - 40, 170); s.lineTo(w - 40, h - 40); s.closePath(); x.fill(s); x.strokeStyle = '#c9a24f'; x.lineWidth = 8; x.strokeRect(14, 14, w - 28, h - 28); x.lineWidth = 3; x.stroke(s); });
  const rugMat = new THREE.MeshStandardMaterial({ map: rugTex, roughness: .95 });
  for (let i = -1; i <= 1; i++) { const r = box(g, 1.6, .04, 3, rugMat, i * 2.1 - .9, .03, 2.4); r.castShadow = false; }
  for (const s of [-1, 1]) {
    const l = new THREE.Group(); l.position.set(s * 3.2, 6.6, -.9); g.add(l);
    cyl(l, .01, .01, 1.6, mat.goldDk, 0, .8, 0, 4);
    add(l, new THREE.SphereGeometry(.36, 16, 10), mat.lamp, 0, -.1, 0).scale.set(1, 1.2, 1);
    add(l, domeGeo(.4, .5, 12, false), mat.gold, 0, .25, 0);
    cyl(l, .4, .2, .2, mat.gold, 0, -.55, 0, 12);
  }
  // a chandelier: a gold ring of lamps on chains
  const ch = new THREE.Group(); ch.position.set(-1.6, 6.2, 1.2); g.add(ch);
  const ring = add(ch, new THREE.TorusGeometry(.9, .05, 8, 40), mat.gold, 0, 0, 0); ring.rotation.x = Math.PI / 2;
  for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; cyl(ch, .1, .07, .24, mat.lamp, Math.cos(a) * .9, .14, Math.sin(a) * .9, 10); }
  for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2; const c = cyl(ch, .008, .008, 2.1, mat.goldDk, Math.cos(a) * .45, 1.0, Math.sin(a) * .45, 4); c.rotation.z = Math.cos(a) * .2; c.rotation.x = -Math.sin(a) * .2; }
  add(ch, new THREE.SphereGeometry(.2, 16, 10), mat.gold, 0, -.15, 0);
  K.ao(g, 0, -2.6, 15, 3, .45); K.ao(g, 4.3, .8, 2.2, 6, .35);
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) {
    const x = sx * (5.6 - k * 0), z = -1.2 + k * 2.4;
    cyl(g, .18, .2, 4.4, mat.marble2, sx * 6.6, 2.2, z, 16); cyl(g, .3, .2, .3, mat.gold, sx * 6.6, 4.5, z, 16); cyl(g, .3, .3, .2, mat.marble3, sx * 6.6, .1, z, 16);
    if (k < 2) { const ar = add(g, archGeo(2.2, 1.3, .3), mat.marble, sx * 6.6, 4.6, z + 1.2); ar.rotation.y = Math.PI / 2; }
  }
  const rh = new THREE.Group(); rh.position.set(-2.6, 0, 1.6); rh.rotation.y = .5; g.add(rh);
  for (const sd of [-1, 1]) { const b2 = box(rh, .7, .9, .05, mat.wood2, 0, .38, 0); b2.rotation.x = sd * .7; }
  for (const sd of [-1, 1]) { const pg2 = box(rh, .62, .03, .4, mat.page, 0, .72, sd * .18); pg2.rotation.x = -sd * .6; }
  return { group: g, cam: { pos: [10.5, 8.5, 17], look: [0, 3.2, -1], fov: 32 }, spin: false };
}

/* ------------------------------------------------------------------ Masjid an-Nabawi, Madina */
function nabawi(K) {
  const { THREE, mat, add, box, cyl, archGeo, domeGeo, finial, palm, tex, plinth } = K, g = new THREE.Group();
  const plaza = tex(1024, 1024, (x, w) => {
    x.fillStyle = '#f1ede4'; x.fillRect(0, 0, w, w);
    x.strokeStyle = 'rgba(140,120,90,.22)'; x.lineWidth = 2;
    for (let i = 0; i < w; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, w); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
    x.fillStyle = 'rgba(25,87,57,.16)';
    for (let i = 32; i < w; i += 128) for (let j = 32; j < w; j += 128) { x.save(); x.translate(i, j); x.rotate(Math.PI / 4); x.fillRect(-10, -10, 20, 20); x.restore(); }
  });
  plinth(g, 12, new THREE.MeshStandardMaterial({ map: plaza, roughness: .6 }));
  const hall = new THREE.Group(); hall.position.set(0, 0, -2.2); g.add(hall);
  const W = 14, D = 9, H = 3.2;
  box(hall, W, H, D, mat.marble, 0, H / 2, 0);
  box(hall, W + .3, .3, D + .3, mat.marble2, 0, H + .15, 0);
  for (let x = -W / 2 + .3; x <= W / 2 - .2; x += .5) box(hall, .2, .3, .14, mat.marble3, x, H + .45, D / 2 + .1);
  // the arcade of the facade
  for (let x = -6.1; x <= 6.15; x += 1.02) {
    if (Math.abs(x) < 1.3) continue;
    add(hall, archGeo(.72, 2.2, .1), mat.archLit, x, .2, D / 2 + .01);
    box(hall, .86, .1, .12, mat.gold, x, 2.55, D / 2 + .06);
  }
  // gold grilles over the arches and a dentil cornice
  for (let x = -6.1; x <= 6.15; x += 1.02) { if (Math.abs(x) < 1.3) continue; K.rbox(hall, .5, .34, .06, mat.gold, x, 2.85, D / 2 + .04, .02); }
  for (let x = -W / 2; x <= W / 2; x += .25) box(hall, .1, .1, .1, mat.marble3, x, H - .12, D / 2 + .06);
  for (const sd of [-1, 1]) for (let z = -3.6; z <= 3.7; z += 1.02) { const a = add(hall, archGeo(.6, 1.9, .08), mat.archLit, sd * (W / 2 + .01), .2, z); a.rotation.y = sd * Math.PI / 2; }
  // the main gate (Bab as-Salam style): a tall portal with a gold frame
  box(hall, 2.6, 4.6, .9, mat.marble2, 0, 2.3, D / 2 + .2);
  add(hall, archGeo(1.5, 3.4, .1), mat.archLit, 0, .2, D / 2 + .66);
  box(hall, 1.9, .1, .1, mat.gold, 0, 3.95, D / 2 + .7); for (const s of [-1, 1]) box(hall, .1, 3.8, .1, mat.gold, s * .95, 2.0, D / 2 + .7);
  // silver domes over the roof in a grid
  for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) {
    if (i === 2 && j === 1) continue;
    cyl(hall, .7, .74, .3, mat.marble2, i * 2.6, H + .45, j * 2.6, 24);
    add(hall, domeGeo(.66, .9, 32, false), mat.silver, i * 2.6, H + .6, j * 2.6);
    K.finial(hall, i * 2.6, H + 1.45, j * 2.6, .35);
  }
  // the Green Dome over the south-east corner, with its drum and finial
  const gd = new THREE.Group(); gd.position.set(5.2, H + .1, 2.6); hall.add(gd);
  cyl(gd, 1.55, 1.65, 1.5, mat.marble, 0, .75, 0, 24);
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; const w = add(gd, archGeo(.32, .8, .06), mat.arch, Math.sin(a) * 1.58, .35, Math.cos(a) * 1.58); w.rotation.y = a; }
  cyl(gd, 1.62, 1.62, .12, mat.gold, 0, 1.52, 0, 24);
  add(gd, domeGeo(1.45, 2.9, 32, false), mat.greenDome, 0, 1.56, 0);
  finial(gd, 0, 4.4, 0, 1.15);
  // minarets: tall, banded, with balconies and a cone cap
  const minaret = (x, z, h) => {
    const m = new THREE.Group(); m.position.set(x, 0, z); g.add(m);
    box(m, 1.4, 2.2, 1.4, mat.marble2, 0, 1.1, 0);
    cyl(m, .5, .62, h, mat.marble, 0, 2.2 + h / 2, 0, 8);
    for (const f of [.42, .75]) {
      const y = 2.2 + h * f;
      cyl(m, .92, .62, .32, mat.marble2, 0, y, 0, 8); cyl(m, .95, .95, .08, mat.gold, 0, y + .2, 0, 8);
      for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; cyl(m, .03, .03, .3, mat.marble3, Math.cos(a) * .88, y + .38, Math.sin(a) * .88, 4); }
    }
    cyl(m, .42, .42, 1.0, mat.marble, 0, 2.2 + h + .5, 0, 8);
    add(m, new THREE.ConeGeometry(.5, 1.6, 8), mat.green, 0, 2.2 + h + 1.8, 0);
    finial(m, 0, 2.2 + h + 2.5, 0, .7);
  };
  minaret(-8.0, 3.6, 8.5); minaret(8.0, 3.6, 8.5); minaret(-7.4, -6.6, 7.2); minaret(7.4, -6.6, 7.2); minaret(3.4, -6.9, 9.4);
  // the great umbrellas of the plaza, open
  const umb = (x, z) => {
    const u = new THREE.Group(); u.position.set(x, 0, z); g.add(u);
    cyl(u, .07, .1, 3.0, mat.marble3, 0, 1.5, 0, 8);
    const c = add(u, new THREE.ConeGeometry(1.7, .9, 4, 1, true), mat.canopy, 0, 3.15, 0); c.rotation.y = Math.PI / 4; c.rotation.x = Math.PI;
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + Math.PI / 4; const rb = cyl(u, .02, .02, 1.75, mat.gold, Math.cos(a) * .6, 3.25, Math.sin(a) * .6, 4); rb.rotation.z = Math.PI / 2; rb.rotation.y = -a; }
  };
  [[-4.6, 5.6], [-1.6, 6.4], [1.6, 6.4], [4.6, 5.6], [-7.4, 7.8], [7.2, 7.8], [-3.1, 8.6], [3.1, 8.6]].forEach(p => umb(...p));
  // a riwaq round the back
  K.arcade(g, 11.2, 26, 1.7, { from: Math.PI * 1.08, to: Math.PI * 1.92 });
  [[-10.2, 1.2, .9], [10.2, 0, .85], [-9.6, -4.2, .8], [9.8, -4.4, .8]].forEach(p => palm(g, ...p));
  K.ao(g, 0, -2.2, 17, 12, .5);
  for (const sx of [-1, 1]) { cyl(hall, .5, .5, .5, mat.marble, sx * .8, 4.85, D / 2 + .2, 16); add(hall, domeGeo(.48, .6, 24, false), mat.silver, sx * .8, 5.1, D / 2 + .2); }
  [[-11, 4.6, .8], [11, 4.2, .75], [-6.4, 10.4, .7], [6.2, 10.6, .7]].forEach(q => palm(g, ...q));
  return { group: g, cam: { pos: [21, 15, 24], look: [0, 3.2, -.8], fov: 30 }, spin: true };
}


/* ------------------------------------------------------------------ Masjid al-Aqsa: the Haram al-Sharif, Jerusalem
   Scale ~1 unit = 5 m. The Dome of the Rock: a regular octagon of 20.6 m sides (circumradius 26.9 m),
   walls ~11.5 m, tiled above a marble dado, four porches on the cardinal faces; a 16-window drum of
   20.4 m and the gold dome, about 35 m to the finial. Al-Qibli mosque to the south with its lead dome. */
function aqsa(K) {
  const { THREE, mat, add, box, rbox, cyl, tex, plinth, archGeo, domeGeo, finial } = K, g = new THREE.Group();
  const stone = tex(1024, 1024, (x, w) => { x.fillStyle = '#e8dfcf'; x.fillRect(0, 0, w, w); x.strokeStyle = 'rgba(150,130,100,.22)'; x.lineWidth = 2; for (let j = 0; j < w; j += 48) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); for (let i = (j / 48 % 2) * 40; i < w; i += 80) { x.beginPath(); x.moveTo(i, j); x.lineTo(i, j + 48); x.stroke(); } } });
  stone.wrapS = stone.wrapT = THREE.RepeatWrapping; stone.repeat.set(3, 3);
  plinth(g, 13, new THREE.MeshStandardMaterial({ map: stone, roughness: .6, envMapIntensity: .4 }));
  const pav = M2 => new THREE.MeshStandardMaterial({ color: M2, roughness: .55, envMapIntensity: .45 });
  // the raised platform of the Dome of the Rock, with steps and the qanatir (arcades) at the top of the stairs
  const PH = .55, plat = new THREE.Group(); plat.position.set(0, 0, 1.6); g.add(plat);
  rbox(plat, 15.5, PH, 13, pav(0xe9e1d2), 0, PH / 2, 0, .06);
  rbox(plat, 15.7, .08, 13.2, mat.marble3, 0, PH + .02, 0, .03);
  for (const [x, z, ry] of [[0, 6.5, 0], [-7.75, 0, Math.PI / 2], [7.75, -2, Math.PI / 2]]) {
    const st = new THREE.Group(); st.position.set(x, 0, z); st.rotation.y = ry; plat.add(st);
    for (let i = 0; i < 4; i++) box(st, 3.2, PH * (i + 1) / 4, .26, mat.marble2, 0, PH * (i + 1) / 8, .9 - i * .26);
    for (let k = 0; k < 4; k++) { const xx = -1.35 + k * .9; cyl(st, .07, .08, 1.25, mat.marble, xx, PH + .62, 0, 10); cyl(st, .12, .09, .09, mat.goldDk, xx, PH + 1.28, 0, 10); }
    for (let k = 0; k < 3; k++) add(st, archGeo(.78, .55, .12), mat.marble, -.9 + k * .9, PH + 1.28, -.06);
    box(st, 3.0, .16, .2, mat.marble2, 0, PH + 1.9, 0);
  }
  // ---- the Dome of the Rock
  const D = new THREE.Group(); D.position.set(0, PH + .04, 1.6); g.add(D);
  const Rc = 5.38, side = 2 * Rc * Math.sin(Math.PI / 8), apo = Rc * Math.cos(Math.PI / 8), WH = 2.3;
  const face = tex(1024, 576, (x, w, h) => {
    const dado = h * .46;
    // upper register: blue and turquoise tiles
    x.fillStyle = '#1f5e93'; x.fillRect(0, 0, w, dado);
    for (let i = 0; i < w; i += 32) for (let j = 0; j < dado; j += 32) { x.fillStyle = ((i + j) / 32) % 2 ? '#2a6fa8' : '#1c568a'; x.fillRect(i + 1, j + 1, 30, 30); x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(i + 16, j + 16, 5, 0, Math.PI * 2); x.fill(); }
    // the calligraphy band under the parapet (abstract strokes, not real text)
    x.fillStyle = '#123f6b'; x.fillRect(0, 10, w, 52); x.strokeStyle = '#f2f0e6'; x.lineWidth = 4; x.lineCap = 'round';
    for (let i = 0; i < 52; i++) { const cx = 10 + i * 19.5; x.beginPath(); x.moveTo(cx, 54); x.bezierCurveTo(cx + 2, 20, cx + 9, 16, cx + 12, 32); if (i % 2) { x.moveTo(cx - 4, 55); x.lineTo(cx + 14, 55); } x.stroke(); }
    x.strokeStyle = '#d6b36a'; x.lineWidth = 3; x.strokeRect(-2, 10, w + 4, 52);
    // seven arched panels, five of them windows with grilles
    const n = 7, pw = w / n;
    for (let k = 0; k < n; k++) {
      const cx = pw * (k + .5), top = 92, bot = dado - 22, aw = pw * .56, win = k % 3 !== 0 || k === 3;
      x.fillStyle = '#e9ddb8'; x.beginPath(); x.moveTo(cx - aw / 2 - 8, bot + 8); x.lineTo(cx - aw / 2 - 8, top + 40); x.quadraticCurveTo(cx - aw / 2 - 8, top - 8, cx, top - 18); x.quadraticCurveTo(cx + aw / 2 + 8, top - 8, cx + aw / 2 + 8, top + 40); x.lineTo(cx + aw / 2 + 8, bot + 8); x.closePath(); x.fill();
      x.fillStyle = win ? '#0d2236' : '#2f79b0'; x.beginPath(); x.moveTo(cx - aw / 2, bot); x.lineTo(cx - aw / 2, top + 40); x.quadraticCurveTo(cx - aw / 2, top, cx, top - 10); x.quadraticCurveTo(cx + aw / 2, top, cx + aw / 2, top + 40); x.lineTo(cx + aw / 2, bot); x.closePath(); x.fill();
      if (win) { x.strokeStyle = 'rgba(214,179,106,.75)'; x.lineWidth = 2; for (let q = top + 20; q < bot; q += 18) { x.beginPath(); x.moveTo(cx - aw / 2, q); x.lineTo(cx + aw / 2, q); x.stroke(); } for (let q = cx - aw / 2 + 12; q < cx + aw / 2; q += 14) { x.beginPath(); x.moveTo(q, top + 6); x.lineTo(q, bot); x.stroke(); } }
    }
    // the marble dado below, with framed panels
    x.fillStyle = '#ece6da'; x.fillRect(0, dado, w, h - dado);
    x.fillStyle = '#d6b36a'; x.fillRect(0, dado - 4, w, 6);
    for (let k = 0; k < 7; k++) { const px = k * pw + 14; x.strokeStyle = 'rgba(120,110,95,.45)'; x.lineWidth = 3; x.strokeRect(px, dado + 26, pw - 28, h - dado - 52); x.strokeStyle = 'rgba(150,140,125,.25)'; x.lineWidth = 1; for (let v = 0; v < 6; v++) { x.beginPath(); x.moveTo(px + Math.random() * pw, dado + 30); x.bezierCurveTo(px + Math.random() * pw, dado + 120, px + Math.random() * pw, dado + 180, px + Math.random() * pw, h - 30); x.stroke(); } }
  });
  const faceMat = new THREE.MeshStandardMaterial({ map: face, roughness: .45, envMapIntensity: .55 });
  for (let k = 0; k < 8; k++) {
    const a = k / 8 * Math.PI * 2 + Math.PI / 8, w = add(D, new THREE.BoxGeometry(side + .02, WH, .22), [mat.marble2, mat.marble2, mat.marble, mat.marble, faceMat, mat.marble2], Math.sin(a) * apo, WH / 2, Math.cos(a) * apo);
    w.rotation.y = a;
    const cap = box(D, side + .06, .16, .32, mat.marble, Math.sin(a) * apo, WH + .08, Math.cos(a) * apo); cap.rotation.y = a;
    for (let m = 0; m < 14; m++) { const t = (m + .5) / 14 - .5, mm = box(D, .12, .14, .1, mat.marble, Math.sin(a) * (apo + .1) + Math.cos(a) * t * side, WH + .23, Math.cos(a) * (apo + .1) - Math.sin(a) * t * side); mm.rotation.y = a; }
  }
  // the four porches on the cardinal faces (north, south, east, west)
  for (let k = 0; k < 4; k++) {
    const a = k / 4 * Math.PI * 2, pr = new THREE.Group(); pr.position.set(Math.sin(a) * (apo + .38), 0, Math.cos(a) * (apo + .38)); pr.rotation.y = a; D.add(pr);
    rbox(pr, 1.55, 1.25, .75, mat.marble, 0, .62, 0, .04);
    add(pr, archGeo(.8, 1.0, .06), new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: .6 }), 0, .02, .36);
    box(pr, 1.62, .1, .82, mat.goldDk, 0, 1.3, 0);
    for (const s2 of [-1, 1]) cyl(pr, .06, .06, 1.2, mat.marble2, s2 * .65, .6, .4, 10);
  }
  // the roof, the drum with 16 windows and its tile band, the gold dome
  add(D, new THREE.CylinderGeometry(Rc * .98, Rc * .98, .14, 8, 1, false, Math.PI / 8), mat.marble3, 0, WH + .1, 0);
  add(D, new THREE.CylinderGeometry(2.4, Rc * .94, .45, 8, 1, false, Math.PI / 8), new THREE.MeshStandardMaterial({ color: 0x9aa1a6, roughness: .5, metalness: .4, envMapIntensity: .7 }), 0, WH + .38, 0);
  const drumT = tex(1024, 256, (x, w, h) => {
    x.fillStyle = '#1f5e93'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 24) for (let j = 0; j < h; j += 24) { x.fillStyle = ((i + j) / 24) % 2 ? '#2a6fa8' : '#1c568a'; x.fillRect(i + 1, j + 1, 22, 22); }
    x.fillStyle = '#123f6b'; x.fillRect(0, 8, w, 40); x.strokeStyle = '#f2f0e6'; x.lineWidth = 3; for (let i = 0; i < 70; i++) { const cx = 6 + i * 14.6; x.beginPath(); x.moveTo(cx, 42); x.bezierCurveTo(cx + 2, 16, cx + 7, 14, cx + 9, 26); x.stroke(); }
    for (let k = 0; k < 16; k++) { const cx = (k + .5) * w / 16, aw = 26, top = 80, bot = 220; x.fillStyle = '#e9ddb8'; x.fillRect(cx - aw / 2 - 5, top - 2, aw + 10, bot - top + 6); x.fillStyle = '#0d2236'; x.beginPath(); x.moveTo(cx - aw / 2, bot); x.lineTo(cx - aw / 2, top + 22); x.quadraticCurveTo(cx - aw / 2, top, cx, top - 8); x.quadraticCurveTo(cx + aw / 2, top, cx + aw / 2, top + 22); x.lineTo(cx + aw / 2, bot); x.fill(); }
  });
  const drumY = WH + .6, DR = 2.04, DH = 1.75;
  add(D, new THREE.CylinderGeometry(DR, DR, DH, 64, 1, true), new THREE.MeshStandardMaterial({ map: drumT, roughness: .45, envMapIntensity: .55 }), 0, drumY + DH / 2, 0);
  add(D, new THREE.CylinderGeometry(DR * .98, DR * .98, DH, 32), mat.marble3, 0, drumY + DH / 2, 0);
  const ring = add(D, new THREE.TorusGeometry(DR + .02, .06, 10, 96), mat.gold, 0, drumY + DH + .02, 0); ring.rotation.x = Math.PI / 2;
  const goldDome = M => new THREE.MeshStandardMaterial({ color: 0xd8ac4c, metalness: .85, roughness: .3, envMapIntensity: 1 });
  const prof = [[1, 0], [1.01, .08], [.99, .3], [.92, .52], [.77, .72], [.53, .88], [.25, .975], [.04, 1]];
  const pts = new THREE.SplineCurve(prof.map(([px, py]) => new THREE.Vector2(px * DR * 1.02, py * 2.25))).getPoints(48); pts.push(new THREE.Vector2(.001, 2.25));
  add(D, new THREE.LatheGeometry(pts, 96), goldDome(), 0, drumY + DH + .04, 0);
  finial(D, 0, drumY + DH + 2.25, 0, .8);
  // the Dome of the Chain: an open eleven-columned kiosk to the east
  const ch = new THREE.Group(); ch.position.set(7.6, PH + .04, -.4); g.add(ch);
  for (let k = 0; k < 11; k++) { const a = k / 11 * Math.PI * 2; cyl(ch, .06, .07, 1.0, mat.marble, Math.cos(a) * .85, .5, Math.sin(a) * .85, 10); }
  for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; cyl(ch, .05, .06, .9, mat.marble2, Math.cos(a) * .42, .45, Math.sin(a) * .42, 10); }
  add(ch, new THREE.CylinderGeometry(.98, .98, .14, 11), mat.marble2, 0, 1.06, 0);
  add(ch, new THREE.CylinderGeometry(.5, .52, .34, 16), faceMat, 0, 1.3, 0);
  add(ch, domeGeo(.52, .55, 32, false), new THREE.MeshStandardMaterial({ color: 0x9aa1a6, metalness: .45, roughness: .45 }), 0, 1.47, 0);
  // ---- al-Qibli mosque to the south: a pillared hall with a gabled nave, a lead dome, a seven-arch porch
  const Q = new THREE.Group(); Q.position.set(-.6, 0, -9.0); Q.scale.setScalar(.72); g.add(Q);
  rbox(Q, 15, 3, 9, pav(0xe6dccb), 0, 1.5, 0, .05);
  for (let x2 = -6.3; x2 <= 6.35; x2 += 1.8) { add(Q, archGeo(.9, 1.7, .08), mat.arch, x2, .5, 4.52); }
  const lead = new THREE.MeshStandardMaterial({ color: 0x8e969c, metalness: .5, roughness: .45, envMapIntensity: .8 });
  const gs = new THREE.Shape(); gs.moveTo(-4.6, 0); gs.lineTo(0, 1.5); gs.lineTo(4.6, 0); gs.lineTo(-4.6, 0);
  const gable = add(Q, new THREE.ExtrudeGeometry(gs, { depth: 15, bevelEnabled: false }), lead, -7.5, 3.0, 0); gable.rotation.y = Math.PI / 2;
  for (let z2 = -3.6; z2 <= 3.7; z2 += 1.2) for (const sx of [-1, 1]) add(Q, archGeo(.6, 1.4, .06), mat.arch, sx * 7.52, .9, z2).rotation.y = sx * Math.PI / 2;
  const porch = new THREE.Group(); porch.position.set(0, 0, 5.4); Q.add(porch);
  rbox(porch, 11.6, 2.6, 1.6, mat.marble, 0, 1.3, 0, .05);
  for (let k = 0; k < 7; k++) add(porch, archGeo(1.15, 1.85, .1), mat.arch, -4.8 + k * 1.6, .1, .78);
  box(porch, 11.8, .18, 1.8, mat.marble2, 0, 2.66, 0);
  for (let k = 0; k < 24; k++) box(porch, .22, .2, .12, mat.marble2, -5.75 + k * .5, 2.85, .86);
  cyl(Q, 1.75, 1.85, 1.0, mat.marble, -.2, 3.4, -2.0, 32);
  add(Q, domeGeo(1.65, 2.2, 64, false), new THREE.MeshStandardMaterial({ color: 0x8e969c, metalness: .55, roughness: .38, envMapIntensity: .9 }), -.2, 3.9, -2.0);
  finial(Q, -.2, 6.1, -2.0, .9);
  // al-Kas, the ablution fountain between them, and trees: cypresses and olives
  const kas = new THREE.Group(); kas.position.set(-1.4, 0, -4.2); g.add(kas);
  cyl(kas, 1.0, 1.1, .3, mat.marble2, 0, .15, 0, 48); cyl(kas, .86, .86, .05, mat.water, 0, .31, 0, 48); cyl(kas, .12, .16, .55, mat.marble, 0, .5, 0, 16);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; box(kas, .18, .2, .18, mat.marble3, Math.cos(a) * 1.4, .1, Math.sin(a) * 1.4); }
  [[-10.4, 2.4, 2.4], [-10.6, 4.4, 2.0], [10.4, 3.6, 2.3], [10.2, 6.0, 1.9], [-8.6, -5.6, 2.2], [8.8, -6.4, 2.4], [5.2, 9.6, 1.8], [-5.6, 9.8, 1.9], [11.2, -.6, 2.1]].forEach(q => K.cypress(g, ...q));
  [[-9.4, -1.2, 1], [9.6, -2.8, .9], [-3.6, 10.6, .85], [3.4, 10.8, .9], [-11.2, -3.4, .8], [7.4, 8.2, .8]].forEach(q => K.olive(g, ...q));
  // square Mamluk minarets: Bab al-Silsila to the west and al-Fakhriyya by al-Qibli
  const sqMin = (x2, z2, h) => {
    const m = new THREE.Group(); m.position.set(x2, 0, z2); g.add(m);
    K.rbox(m, 1.1, h, 1.1, mat.marble2, 0, h / 2, 0, .04);
    for (const y2 of [h * .35, h * .7]) box(m, 1.16, .08, 1.16, mat.marble3, 0, y2, 0);
    for (const r2 of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) { const w2 = add(m, archGeo(.3, .7, .04), mat.arch, Math.sin(r2) * .56, h * .78, Math.cos(r2) * .56); w2.rotation.y = r2; }
    box(m, 1.5, .14, 1.5, mat.marble, 0, h + .07, 0);
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; cyl(m, .02, .02, .3, mat.marble3, Math.cos(a) * .68, h + .29, Math.sin(a) * .68, 4); }
    add(m, new THREE.CylinderGeometry(.42, .44, .9, 8), mat.marble, 0, h + .6, 0);
    add(m, domeGeo(.42, .55, 24, false), lead, 0, h + 1.05, 0); finial(m, 0, h + 1.6, 0, .5);
  };
  sqMin(-11.2, -6.2, 5.8); sqMin(6.8, -10.4, 5.2);
  // the Haram's western wall along the back, crenellated
  for (let k = 0; k < 22; k++) { const a = Math.PI * 1.08 + k / 21 * Math.PI * .84, r2 = 12.3; const wseg = box(g, 1.9, 1.1, .5, pav(0xe2d7c3), Math.cos(a) * r2, .55, Math.sin(a) * r2); wseg.lookAt(0, .55, 0); box(g, .4, .3, .5, pav(0xe2d7c3), Math.cos(a) * r2, 1.25, Math.sin(a) * r2).lookAt(0, 1.25, 0); }
  // gold grilles over the drum windows, contact shadows
  for (let k = 0; k < 16; k++) { const a = (k + .5) / 16 * Math.PI * 2; const gr2 = box(D, .2, .02, .02, mat.gold, Math.sin(a) * (DR + .01), drumY + DH * .62, Math.cos(a) * (DR + .01)); gr2.rotation.y = a; }
  K.ao(g, 0, 1.6, 17, 15, .4); K.ao(g, 0, 1.6, 12, 12, .45, PH + .06); K.ao(g, -.6, -9.0, 13, 10, .45);
  return { group: g, cam: { pos: [15, 11, 19], look: [0, 2.6, -1.5], fov: 30 }, spin: true };
}

export const MODELS = { kaaba, hira, quran, badr, mihrab, nabawi, aqsa };

/* Lights shared by the renders and the live scenes. `dark` gives the Ink theme's warm night. */
export function light(THREE, scene, dark) {
  const hemi = new THREE.HemisphereLight(dark ? 0x9fb2c8 : 0xfff4e2, dark ? 0x0b2416 : 0x52705c, dark ? .65 : 1.15);
  const sun = new THREE.DirectionalLight(dark ? 0xc9d4ff : 0xffe7c0, dark ? 1.25 : 2.5);
  sun.position.set(12, 20, 10); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.radius = 4;
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 }); sun.shadow.bias = -.0005; sun.shadow.normalBias = .02;
  const fill = new THREE.DirectionalLight(dark ? 0xffc77a : 0xdfeee6, dark ? .55 : .5); fill.position.set(-14, 6, -6);
  scene.add(hemi, sun, fill);
  return { hemi, sun, fill };
}

/* A soft studio for reflections: a warm sky dome, a cool floor and three softbox panels, baked
   through PMREM. Gives the matte gold, marble and domes their gentle sheen. */
export function studio(THREE, renderer, dark) {
  const env = new THREE.Scene();
  const geo = new THREE.SphereGeometry(50, 48, 24), col = [], pos = geo.attributes.position;
  const top = new THREE.Color(dark ? 0x4a4436 : 0xfff6e8), mid = new THREE.Color(dark ? 0x1c1d19 : 0xe9ece6), bot = new THREE.Color(dark ? 0x07120c : 0x6f8a78);
  for (let i = 0; i < pos.count; i++) { const t = pos.getY(i) / 50; const c = t > 0 ? mid.clone().lerp(top, t) : mid.clone().lerp(bot, -t); col.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  env.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const panel = (w, h, x, y, z, c, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
  panel(30, 18, 18, 26, 14, dark ? 0xffecd2 : 0xfff1d8, dark ? 1.5 : 3.2);
  panel(20, 12, -24, 10, 8, dark ? 0xffc77a : 0xe8f2ec, dark ? 1.2 : 1.6);
  panel(16, 30, 4, 12, -26, 0xffffff, dark ? .6 : 1.2);
  const pm = new THREE.PMREMGenerator(renderer), tex = pm.fromScene(env, .03).texture; pm.dispose();
  return tex;
}
