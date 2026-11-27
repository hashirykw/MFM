/* Shared camera framing + scenes for the dioramas. makeScene() builds one model's scene for a given
   renderer (the page shares one renderer for all of them); makeStage() is the one-renderer version
   the plate renders use. */
import { kit, MODELS, light, studio } from './models3d.js';

const envCache = new WeakMap();
function envFor(THREE, renderer, dark) {
  let c = envCache.get(renderer); if (!c) envCache.set(renderer, c = {});
  return c[dark ? 'd' : 'l'] || (c[dark ? 'd' : 'l'] = studio(THREE, renderer, dark));
}

export function makeScene(THREE, renderer, name, { dark = false, shadowCatcher = true } = {}) {
  const scene = new THREE.Scene();
  const K = kit(THREE), built = MODELS[name](K);
  const root = new THREE.Group(); root.add(built.group); scene.add(root);
  const L = light(THREE, scene, dark);
  if (shadowCatcher) {
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: dark ? .4 : .18 }));
    sc.rotation.x = -Math.PI / 2; sc.position.y = -2.07; sc.receiveShadow = true; scene.add(sc);
  }
  const cam = new THREE.PerspectiveCamera(built.cam.fov, 1, .1, 400);
  const box = new THREE.Box3().setFromObject(built.group), sphere = box.getBoundingSphere(new THREE.Sphere());
  const dir = new THREE.Vector3(...built.cam.pos).sub(new THREE.Vector3(...built.cam.look)).normalize();
  function frame(w, h, fill = .94) {
    cam.aspect = w / h;
    const vf = THREE.MathUtils.degToRad(cam.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const d = sphere.radius / Math.sin(Math.min(vf, hf) / 2) * fill;
    const c = sphere.center.clone(); c.y = (box.min.y + box.max.y) / 2 - .4;
    cam.position.copy(c).addScaledVector(dir, d); cam.lookAt(c); cam.updateProjectionMatrix();
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
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .96;
  const st = makeScene(THREE, renderer, name, { dark, shadowCatcher });
  return { renderer, ...st, frame: (w, h, fill) => { renderer.setSize(w, h, false); st.frame(w, h, fill); }, render: () => renderer.render(st.scene, st.cam) };
}
