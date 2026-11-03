// Pré-rendu (« bake ») des modèles 3D en images 2D isométriques, une seule fois au chargement.
// Ensuite le jeu ne dessine que des images : c'est ce qui le rend fluide sur téléphone, comme Township.
//
// Projection isométrique 2:1 : caméra orthographique tournée de 45°, plongée de 30°.
// Une case de la grille = 1 unité 3D. À zoom 1, une case fait TW px de large et TW/2 de haut.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export const TW = 64;                         // largeur d'une case à zoom 1 (px CSS)
export const PPU = TW / Math.SQRT2;            // px CSS par unité 3D horizontale
const ELEV = Math.PI / 6, YAW = Math.PI / 4;  // 30° de plongée, 45° de rotation

let R = null, scene, cam, sun, ground, hemi;
const DIR = new THREE.Vector3(Math.cos(ELEV) * Math.sin(YAW), Math.sin(ELEV), Math.cos(ELEV) * Math.cos(YAW));

function setup(density){
  R = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
  R.setPixelRatio(1);
  R.outputColorSpace = THREE.SRGBColorSpace;
  R.toneMapping = THREE.NeutralToneMapping; R.toneMappingExposure = 1.08;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .35;
  hemi = new THREE.HemisphereLight('#dfeaff', '#7d8fb8', .9); scene.add(hemi);
  // soleil chaud venant de la gauche, un peu derrière : ombres vers le bas à droite, comme Township
  sun = new THREE.DirectionalLight('#fff1dc', 2.6);
  sun.position.set(-6, 10, 2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -.0005; sun.shadow.normalBias = .02; sun.shadow.radius = 5;
  scene.add(sun, sun.target);
  // sol invisible qui ne garde que l'ombre portée
  ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({color: '#20305a', opacity: .28}));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  cam.position.copy(DIR).multiplyScalar(30); cam.lookAt(0, 0, 0);
  R.__density = density;
}

/**
 * Rend un objet 3D en image. Renvoie {canvas, ax, ay, w, h} :
 * (ax, ay) est la position, dans l'image, du point au sol (0,0,0) de l'objet, en px CSS.
 * opts.shadow : ombre portée au sol (défaut oui) ; opts.scale : facteur de résolution.
 */
export function bake(obj, {density = 2, shadow = true, pad = .15} = {}){
  if (!R) setup(density);
  const holder = new THREE.Group(); holder.add(obj); scene.add(holder);
  obj.traverse(o => { if (o.isMesh){ o.castShadow = shadow; o.receiveShadow = true; } });
  ground.visible = shadow;
  holder.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(holder);
  if (box.isEmpty()) box.set(new THREE.Vector3(-.5, 0, -.5), new THREE.Vector3(.5, 1, .5));
  if (shadow){ // l'ombre s'étend vers la droite : on agrandit la boîte au sol
    const h = box.max.y; box.expandByPoint(new THREE.Vector3(box.max.x + h * .7, 0, box.max.z + h * .25));
  }
  box.expandByScalar(pad);
  // coins de la boîte projetés dans le repère caméra
  cam.updateMatrixWorld(true);
  const inv = cam.matrixWorldInverse, pts = [];
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).applyMatrix4(inv));
  const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x)), minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
  cam.left = minX; cam.right = maxX; cam.top = maxY; cam.bottom = minY; cam.updateProjectionMatrix();
  const pxPerUnit = PPU * density;
  const w = Math.max(2, Math.ceil((maxX - minX) * pxPerUnit)), h = Math.max(2, Math.ceil((maxY - minY) * pxPerUnit));
  // ombre : le soleil suit l'objet
  sun.target.position.copy(box.getCenter(new THREE.Vector3())); sun.position.copy(sun.target.position).add(new THREE.Vector3(-6, 10, 2));
  const ext = Math.max(box.max.x - box.min.x, box.max.z - box.min.z, box.max.y) + 2;
  Object.assign(sun.shadow.camera, {left: -ext, right: ext, top: ext, bottom: -ext, near: .1, far: 40}); sun.shadow.camera.updateProjectionMatrix();
  R.setSize(w, h, false);
  R.render(scene, cam);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(R.domElement, 0, 0);
  // position du point (0,0,0) dans l'image
  const o = new THREE.Vector3(0, 0, 0).applyMatrix4(inv);
  const ax = (o.x - minX) / (maxX - minX) * w / density, ay = (maxY - o.y) / (maxY - minY) * h / density;
  scene.remove(holder);
  return {canvas: c, ax, ay, w: w / density, h: h / density};
}

/** Rend une icône (sans ombre au sol), cadrée, de taille fixe en px CSS. */
export function bakeIcon(obj, size = 64, density = 2){
  const s = bake(obj, {density, shadow: false, pad: .05});
  const c = document.createElement('canvas'); c.width = c.height = size * density;
  const k = Math.min(size / s.w, size / s.h) * .92;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
  x.drawImage(s.canvas, (size - s.w * k) / 2 * density, (size - s.h * k) / 2 * density, s.w * k * density, s.h * k * density);
  return c;
}

export function disposeBaker(){ if (R){ R.dispose(); R = null; } }
