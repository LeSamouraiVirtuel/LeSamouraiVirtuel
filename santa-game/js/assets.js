// Chargement des modèles 3D (packs CC0 Kenney + KayKit), clonage, recoloration des personnages.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
const A = {props: {}, chars: {}, clips: {}};

export async function loadAssets(base, onProgress){
  const files = ['props', 'santa', 'elf', 'anims', 'farm'];
  const done = new Array(files.length).fill(0);
  const tick = (i, v) => { done[i] = v; onProgress?.(done.reduce((a, b) => a + b) / files.length); };
  const res = await Promise.all(files.map(async (f, i) => {
    try {
      return await loader.loadAsync(`${base}${f}.glb`, e => { if (e.total) tick(i, e.loaded / e.total); });
    } catch (err) {
      // Hébergements qui ne servent pas les .glb : même fichier, encodé en base64 dans un module JS.
      const m = await import(`${base}${f}.js`);
      const bin = Uint8Array.from(atob(m.default), c => c.charCodeAt(0));
      const g = await loader.parseAsync(bin.buffer, base); tick(i, 1); return g;
    }
  }));
  const [props, santa, elf, anims, farm] = res;
  props.scene.traverse(o => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; tuneMaterial(o.material); }
  });
  for (const child of [...props.scene.children]) A.props[child.name] = child;
  farm.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; tuneMaterial(o.material); } });
  // GLTFLoader renomme « corn » en « corn_1 » quand un enfant porte déjà ce nom : on retire le suffixe
  for (const child of [...farm.scene.children]){ const n = child.name.replace(/_\d+$/, ''); A.props[A.props[n] ? child.name : n] = child; }
  for (const [k, g] of [['santa', santa], ['elf', elf]]) {
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false; tuneMaterial(o.material); } });
    A.chars[k] = g.scene;
  }
  for (const c of anims.animations) A.clips[c.name] = c;
}

// Liseré de lumière chaude sur les contours (effet « rim light ») : détache les volumes du fond.
export function addRim(m, strength = .38, color = '#fff0d0'){
  if (!m || m.userData.rim) return;
  m.userData.rim = true;
  const col = new THREE.Color(color);
  m.onBeforeCompile = sh => {
    sh.uniforms.rimColor = {value: col}; sh.uniforms.rimStrength = {value: strength};
    sh.fragmentShader = 'uniform vec3 rimColor; uniform float rimStrength;\n' + sh.fragmentShader.replace('#include <dithering_fragment>',
      `float rimF = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 2.6);
       gl_FragColor.rgb += rimColor * rimF * rimStrength * (0.6 + 0.4 * gl_FragColor.g);
       #include <dithering_fragment>`);
  };
  m.customProgramCacheKey = () => 'rim' + strength;
}
function tuneMaterial(m){
  if (!m || m.userData.tuned) return;
  m.userData.tuned = true;
  addRim(m);
  if ('roughness' in m) { m.roughness = Math.max(.55, m.roughness ?? 1); m.metalness = Math.min(.15, m.metalness ?? 0); }
  if (m.map) m.map.anisotropy = 8;
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
    if (!tintedMats.has(k)){ const m = o.material.clone(); m.map = hueShiftTexture(o.material.map, hue, sat); m.userData.rim = false; addRim(m); tintedMats.set(k, m); }
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
    o.material = o.material.clone(); o.material.map = texCache.get(k); o.material.userData.rim = false; addRim(o.material);
  });
}
const mix = (a, b, t) => '#' + new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString();

/** Le Père Noël évolue avec le niveau de la Maison (1 → 10). */
export function santaLook(lv, skin = null){
  const t = Math.min(1, (lv - 1) / 4);             // manteau vert → rouge (niv 1 → 5)
  const b = Math.max(0, Math.min(1, (lv - 4) / 5)); // barbe rousse → blanche (niv 4 → 9)
  const coat = mix('#2f9e5b', '#e0243a', t), coatD = mix('#1d6b3b', '#9c1426', t);
  let beard = mix('#ff8a2a', '#ffffff', b), beardD = mix('#b34a12', '#cfd8e6', b);
  let [c1, c2] = [coat, coatD];
  if (skin?.coat) [c1, c2] = skin.coat;
  if (skin?.beard) [beard, beardD] = skin.beard;
  return [
    [1, beard, beardD], [7, mix(beard, '#ffffff', .3), beardD],
    [8, c1, c2], [16, c1, c2], [11, c1, c2],
    [19, '#3a2c2a', '#1b1414'], [20, '#2a2222', '#141010'],
    [15, '#2b2224', '#140f10'], [23, '#ffffff', '#d9e2ee'],
  ];
}
export function elfLook(v, skin = null){
  const hoods = skin?.hoods || [['#3fbf6a', '#1c7a40'], ['#ef3b4f', '#a3162a'], ['#ffd34a', '#d8901c'], ['#4fb8ff', '#1f6fc0']];
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

/* ------------------------------------------------------------------ */
/* Fusion des pièces statiques : un chalet passe de ~40 objets à 1-2. */
/* C'est ce qui rend le village fluide sur téléphone.                 */
/* ------------------------------------------------------------------ */
const ATTRS = ['position', 'normal', 'uv'];
function toFloat(geo, matrix){
  const g = new THREE.BufferGeometry(), n = geo.attributes.position.count;
  for (const name of ATTRS){
    const a = geo.attributes[name]; if (!a) continue;
    const size = a.itemSize, arr = new Float32Array(n * size);
    for (let i = 0; i < n; i++) for (let c = 0; c < size; c++) arr[i * size + c] = a.getComponent(i, c);
    g.setAttribute(name, new THREE.BufferAttribute(arr, size));
  }
  if (geo.index) g.setIndex(Array.from(geo.index.array));
  g.applyMatrix4(matrix);
  return g;
}
export function mergeStatic(group){
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const byMat = new Map();
  group.traverse(o => {
    if (!o.isMesh || o.isSkinnedMesh || Array.isArray(o.material)) return;
    const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld);
    if (!byMat.has(o.material)) byMat.set(o.material, []);
    byMat.get(o.material).push(toFloat(o.geometry, m));
  });
  const out = new THREE.Group();
  for (const [mat, geos] of byMat){
    const has = k => geos.every(g => g.attributes[k]);
    for (const g of geos) for (const k of ATTRS) if (!has(k)) g.deleteAttribute(k);
    const mg = mergeGeometries(geos, false); if (!mg) continue;
    const mesh = new THREE.Mesh(mg, mat); mesh.castShadow = true; mesh.receiveShadow = true; out.add(mesh);
  }
  return out;
}
