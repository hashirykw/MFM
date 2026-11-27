/* Shared camera framing + scenes for the dioramas. makeScene() builds one model's scene for a given
   renderer (the page shares one renderer for all of them); makeStage() is the one-renderer version
   the plate renders use. */
import { kit, MODELS, light, studio } from './models3d.js';
import { aim } from './orbit3d.js';

const envCache = new WeakMap();
function envFor(THREE, renderer, dark) {
  let c = envCache.get(renderer); if (!c) envCache.set(renderer, c = {});
  return c[dark ? 'd' : 'l'] || (c[dark ? 'd' : 'l'] = studio(THREE, renderer, dark));
}

/* The dioramas are built from hundreds of small parts that never move on their own, so once built
   every opaque part sharing a material is welded into one mesh: a model drops from ~200–700 draw
   calls to a few dozen, which is what makes it appear quickly and turn smoothly on a phone. */
function flatten(THREE, group) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), m = new THREE.Matrix4(), nm = new THREE.Matrix3();
  const buckets = new Map(), drop = [];
  group.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || Array.isArray(o.material) || o.material.transparent || o.userData.keep) return;
    const g = o.geometry, a = g.attributes;
    if (!a.position || !a.normal || g.morphAttributes.position) return;
    const k = o.material.uuid + (o.castShadow ? 'c' : '') + (o.receiveShadow ? 'r' : '');
    (buckets.get(k) || buckets.set(k, []).get(k)).push(o);
  });
  for (const list of buckets.values()) {
    if (list.length < 2) continue;
    let n = 0;
    const parts = list.map(o => { const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry; n += g.attributes.position.count; return [o, g]; });
    const P = new Float32Array(n * 3), N = new Float32Array(n * 3), U = new Float32Array(n * 2); let off = 0;
    const v = new THREE.Vector3();
    for (const [o, g] of parts) {
      m.multiplyMatrices(inv, o.matrixWorld); nm.getNormalMatrix(m);
      const p = g.attributes.position, q = g.attributes.normal, uv = g.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(m); P.set([v.x, v.y, v.z], (off + i) * 3);
        v.fromBufferAttribute(q, i).applyMatrix3(nm).normalize(); N.set([v.x, v.y, v.z], (off + i) * 3);
        if (uv) { U[(off + i) * 2] = uv.getX(i); U[(off + i) * 2 + 1] = uv.getY(i); }
      }
      off += p.count; if (g !== o.geometry) g.dispose(); drop.push(o);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(U, 2));
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, list[0].material); mesh.castShadow = list[0].castShadow; mesh.receiveShadow = list[0].receiveShadow;
    group.add(mesh);
  }
  for (const o of drop) { o.parent && o.parent.remove(o); }
}

export function makeScene(THREE, renderer, name, { dark = false, shadowCatcher = true } = {}) {
  const scene = new THREE.Scene();
  const K = kit(THREE), built = MODELS[name](K);
  flatten(THREE, built.group);
  const root = new THREE.Group(); root.add(built.group); scene.add(root);
  const L = light(THREE, scene, dark);
  if (shadowCatcher) {
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: dark ? .4 : .18 }));
    sc.rotation.x = -Math.PI / 2; sc.position.y = -2.07; sc.receiveShadow = true; scene.add(sc);
  }
  const cam = new THREE.PerspectiveCamera(built.cam.fov, 1, .1, 400);
  const box = new THREE.Box3().setFromObject(built.group), sphere = box.getBoundingSphere(new THREE.Sphere());
  const dir = new THREE.Vector3(...built.cam.pos).sub(new THREE.Vector3(...built.cam.look)).normalize();
  const c = sphere.center.clone(); c.y = (box.min.y + box.max.y) / 2 - .4;
  function frame(w, h, fill = .94, pitch = 0) {
    cam.aspect = w / h;
    const vf = THREE.MathUtils.degToRad(cam.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const d = sphere.radius / Math.sin(Math.min(vf, hf) / 2) * fill;
    aim(THREE, cam, c, dir, d, pitch);
  }
  function theme(isDark) {
    scene.environment = envFor(THREE, renderer, !!isDark);
    L.hemi.color.set(isDark ? 0xd6d2c6 : 0xfff4e2); L.hemi.groundColor.set(isDark ? 0x10261a : 0x52705c); L.hemi.intensity = isDark ? .4 : .55;
    L.sun.color.set(isDark ? 0xffeedc : 0xffe7c0); L.sun.intensity = isDark ? 1.45 : 2.2;
    L.fill.color.set(isDark ? 0xffc77a : 0xdfeee6); L.fill.intensity = isDark ? .6 : .5;
    K.mat.lamp.emissiveIntensity = isDark ? 2 : .25; K.mat.archLit.emissiveIntensity = isDark ? .55 : 0;
  }
  theme(dark);
  return { scene, cam, root, built, frame, theme };
}

export function makeStage(THREE, canvas, name, { dark = false, alpha = true, shadowCatcher = true, pixelRatio = 1 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, preserveDrawingBuffer: !!canvas.dataset.capture });
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .96;
  const st = makeScene(THREE, renderer, name, { dark, shadowCatcher });
  return { renderer, ...st, frame: (w, h, fill) => { renderer.setSize(w, h, false); st.frame(w, h, fill); }, render: () => renderer.render(st.scene, st.cam) };
}
