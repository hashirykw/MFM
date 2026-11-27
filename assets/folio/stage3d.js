/* Shared camera framing + renderer for the dioramas (used by the plate renders and the live scenes). */
import { kit, MODELS, light, studio } from './models3d.js';

export function makeStage(THREE, canvas, name, { dark = false, alpha = true, shadowCatcher = true, pixelRatio = 1 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, preserveDrawingBuffer: !!canvas.dataset.capture });
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .96;
  const scene = new THREE.Scene();
  const K = kit(THREE), built = MODELS[name](K);
  const root = new THREE.Group(); root.add(built.group); scene.add(root);
  const L = light(THREE, scene, dark);
  const envs = {}; const setEnv = d => { scene.environment = envs[d] || (envs[d] = studio(THREE, renderer, d)); }; setEnv(!!dark);
  if (shadowCatcher) {
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: dark ? .45 : .2 }));
    sc.rotation.x = -Math.PI / 2; sc.position.y = -2.07; sc.receiveShadow = true; scene.add(sc);
  }
  const cam = new THREE.PerspectiveCamera(built.cam.fov, 1, .1, 400);
  const box = new THREE.Box3().setFromObject(built.group), sphere = box.getBoundingSphere(new THREE.Sphere());
  const dir = new THREE.Vector3(...built.cam.pos).sub(new THREE.Vector3(...built.cam.look)).normalize();
  function frame(w, h, fill = .94) {
    renderer.setSize(w, h, false); cam.aspect = w / h;
    const vf = THREE.MathUtils.degToRad(cam.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const d = sphere.radius / Math.sin(Math.min(vf, hf) / 2) * fill;
    const c = sphere.center.clone(); c.y = (box.min.y + box.max.y) / 2 - .4;
    cam.position.copy(c).addScaledVector(dir, d); cam.lookAt(c); cam.updateProjectionMatrix();
  }
  function theme(isDark) {
    setEnv(!!isDark);
    L.hemi.color.set(isDark ? 0xd6d2c6 : 0xfff4e2); L.hemi.groundColor.set(isDark ? 0x10261a : 0x52705c); L.hemi.intensity = isDark ? .4 : .55;
    L.sun.color.set(isDark ? 0xffeedc : 0xffe7c0); L.sun.intensity = isDark ? 1.45 : 2.2;
    L.fill.color.set(isDark ? 0xffc77a : 0xdfeee6); L.fill.intensity = isDark ? .6 : .5;
    K.mat.lamp.emissiveIntensity = isDark ? 2 : .25; K.mat.archLit.emissiveIntensity = isDark ? .55 : 0;
  }
  theme(dark);
  return { renderer, scene, cam, root, built, frame, theme, render: () => renderer.render(scene, cam) };
}
