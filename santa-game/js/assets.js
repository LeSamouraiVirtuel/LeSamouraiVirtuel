// Chargement des modèles 3D (packs CC0 Kenney + KayKit), clonage, recoloration des personnages.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
const A = {props: {}, chars: {}, clips: {}};

export async function loadAssets(base, onProgress){
  const files = ['props', 'santa', 'elf', 'anims'];
  const done = new Array(files.length).fill(0);
  const res = await Promise.all(files.map((f, i) => loader.loadAsync(`${base}${f}.glb`, e => {
    if (e.total) { done[i] = e.loaded / e.total; onProgress?.(done.reduce((a, b) => a + b) / files.length); }
  })));
  const [props, santa, elf, anims] = res;
  props.scene.traverse(o => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; tuneMaterial(o.material); }
  });
  for (const child of [...props.scene.children]) A.props[child.name] = child;
  for (const [k, g] of [['santa', santa], ['elf', elf]]) {
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false; tuneMaterial(o.material); } });
    A.chars[k] = g.scene;
  }
  for (const c of anims.animations) A.clips[c.name] = c;
}

function tuneMaterial(m){
  if (!m || m.userData.tuned) return;
  m.userData.tuned = true;
  if ('roughness' in m) { m.roughness = Math.max(.55, m.roughness ?? 1); m.metalness = Math.min(.15, m.metalness ?? 0); }
  if (m.map) m.map.anisotropy = 4;
}

export const hasProp = name => !!A.props[name];

/** Clone d'un modèle du pack, ramené à l'origine. */
export function prop(name, {s = 1, x = 0, y = 0, z = 0, ry = 0} = {}){
  const src = A.props[name];
  if (!src) { console.warn('modèle manquant', name); return new THREE.Group(); }
  const c = src.clone(true);
  c.position.set(x, y, z); c.rotation.set(0, ry, 0); c.scale.setScalar(s);
  c.name = name;
  return c;
}

/** Récupère géométries + matériaux d'un modèle (pour l'instanciation). */
export function propParts(name){
  const src = A.props[name]; const parts = [];
  src.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(src.matrixWorld).invert();
  src.traverse(o => { if (o.isMesh) parts.push({geometry: o.geometry, material: o.material, matrix: new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)}); });
  return parts;
}

/* ---------------- teinte des chalets ---------------- */
// Remplace le vert des boiseries Kenney par une autre teinte (identité de chaque bâtiment).
const hueCache = new Map();
function hueShiftTexture(tex, targetHue, sat = 1){
  const k = tex.uuid + targetHue + sat;
  if (hueCache.has(k)) return hueCache.get(k);
  const img = tex.image, c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height), p = d.data, col = new THREE.Color(), hsl = {};
  for (let i = 0; i < p.length; i += 4){
    col.setRGB(p[i] / 255, p[i + 1] / 255, p[i + 2] / 255); col.getHSL(hsl);
    if (hsl.s > .25 && hsl.h > .3 && hsl.h < .5){ col.setHSL(targetHue, Math.min(1, hsl.s * sat), hsl.l); p[i] = col.r * 255; p[i + 1] = col.g * 255; p[i + 2] = col.b * 255; }
  }
  x.putImageData(d, 0, 0);
  const t = tex.clone(); t.source = new THREE.Source(c); t.needsUpdate = true;
  hueCache.set(k, t); return t;
}
const tintedMats = new Map();
export function tint(root, hue, sat = 1){
  if (hue == null) return root;
  root.traverse(o => {
    if (!o.isMesh || !o.material.map) return;
    const k = o.material.uuid + hue + sat;
    if (!tintedMats.has(k)){ const m = o.material.clone(); m.map = hueShiftTexture(o.material.map, hue, sat); tintedMats.set(k, m); }
    o.material = tintedMats.get(k);
  });
  return root;
}

/* ---------------- personnages ---------------- */
// Palette KayKit : 8 colonnes x 4 lignes de dégradés (128 x 256 px chacune).
function paintPalette(baseTex, edits){
  const img = baseTex.image;
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const cw = img.width / 8, ch = img.height / 4;
  for (const [cell, top, bottom] of edits) {
    const col = cell % 8, row = Math.floor(cell / 8);
    const g = x.createLinearGradient(0, row * ch, 0, (row + 1) * ch);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    x.fillStyle = g; x.fillRect(col * cw, row * ch, cw, ch);
  }
  const t = baseTex.clone(); t.source = new THREE.Source(c); t.needsUpdate = true; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const texCache = new Map();
function recolor(root, key, edits){
  root.traverse(o => {
    if (!o.isMesh) return;
    const base = o.material.map; if (!base) return;
    const k = key + base.uuid;
    if (!texCache.has(k)) texCache.set(k, paintPalette(base, edits));
    o.material = o.material.clone(); o.material.map = texCache.get(k);
  });
}
const mix = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

/** Le Père Noël évolue avec le niveau de la Maison (1 → 10). */
export function santaLook(lv){
  const t = Math.min(1, (lv - 1) / 4);             // manteau vert → rouge (niv 1 → 5)
  const b = Math.max(0, Math.min(1, (lv - 4) / 5)); // barbe rousse → blanche (niv 4 → 9)
  const coat = mix('#2f9e5b', '#e0243a', t), coatD = mix('#1d6b3b', '#9c1426', t);
  const beard = mix('#ff8a2a', '#ffffff', b), beardD = mix('#b34a12', '#cfd8e6', b);
  return [
    [1, beard, beardD], [7, mix(beard, '#ffffff', .3), beardD],
    [8, coat, coatD], [16, coat, coatD], [11, coat, coatD],
    [19, '#3a2c2a', '#1b1414'], [20, '#2a2222', '#141010'],
    [15, '#2b2224', '#140f10'], [23, '#ffffff', '#d9e2ee'],
  ];
}
export function elfLook(v){
  const hoods = [['#3fbf6a', '#1c7a40'], ['#ef3b4f', '#a3162a'], ['#ffd34a', '#d8901c'], ['#4fb8ff', '#1f6fc0']];
  const [a, b] = hoods[v % hoods.length];
  return [[1, a, b], [9, a, b]];
}

function santaHat(){
  const g = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({color: '#e0243a', roughness: .8});
  const white = new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 1});
  const pts = []; for (let i = 0; i <= 10; i++){ const t = i / 10; pts.push(new THREE.Vector2(.42 * (1 - t) ** 1.2 + .02, t * .75)); }
  const cone = new THREE.Mesh(new THREE.LatheGeometry(pts, 18), red); cone.rotation.z = -.35; cone.position.set(.06, .05, 0); g.add(cone);
  const brim = new THREE.Mesh(new THREE.TorusGeometry(.42, .11, 10, 24), white); brim.rotation.x = Math.PI / 2; g.add(brim);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(.13, 14, 10), white); pom.position.set(.32, .68, 0); g.add(pom);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/** Instancie un personnage animé. kind: 'santa' | 'elf'. */
export function character(kind, look, {hat = false} = {}){
  const root = SkeletonUtils.clone(A.chars[kind]);
  recolor(root, kind + JSON.stringify(look), look);
  if (kind === 'santa') root.traverse(o => { if (o.name === 'Engineer_Goggles') o.visible = !hat; });
  if (hat){
    const head = root.getObjectByName('head');
    if (head){ const h = santaHat(); h.position.set(0, .62, -.02); h.scale.setScalar(1.15); head.add(h); }
  }
  const mixer = new THREE.AnimationMixer(root);
  const actions = {};
  for (const [k, clip] of Object.entries(A.clips)) actions[k] = mixer.clipAction(clip);
  let current = null;
  const play = (name, fade = .25) => {
    const a = actions[name]; if (!a || a === current) return;
    a.reset().fadeIn(fade).play(); if (current) current.fadeOut(fade); current = a;
  };
  play('Idle_A', 0);
  return {root, mixer, play, actions};
}
