// ESSAIS — Carte de campagne des trolls en VRAIE 3D, rendue par le pipeline du jeu (bake.js) :
// un fond (neige, montagnes, sapins, chemin) et des camps (troll / repris / forteresse du chef) posés dessus en 2D,
// pour que la carte suive la vraie progression du joueur. Monde : 1 unité = 1 case du jeu.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {prop, tint, character, elfLook} from '../js/assets.js';

// chemin des 10 camps d'une région (de devant/bas vers le fond/haut de l'écran)
export const CAMPS = [[12.75, 11.0], [8.38, 13.62], [4.0, 11.88], [3.12, 6.62], [7.5, 4.0], [11.88, 0.5], [7.5, -3.88], [1.38, -4.75], [-3.0, -0.38], [-5.62, -7.38]];
const loader = new GLTFLoader(); const MODELS = {};
export async function loadTrolls(base){
  for (const k of ['troll', 'chief', 'runner']) MODELS[k] = await loader.loadAsync(`${base}battle/${k}.glb`);
}
function foe(kind, h){
  const src = MODELS[kind]; const o = SkeletonUtils.clone(src.scene);
  const box = new THREE.Box3().setFromObject(o), s = h / Math.max(.01, box.max.y - box.min.y); o.scale.setScalar(s);
  if (src.animations?.length){ const mx = new THREE.AnimationMixer(o); const clip = src.animations.find(a => /idle/i.test(a.name)) || src.animations[0]; mx.clipAction(clip).play(); mx.update(.4); }
  o.traverse(m => { if (m.isMesh){ m.castShadow = true; m.frustumCulled = false; } }); return o;
}
const purple = o => tint(o, .78, 1.15);
function campfire(lit = true, s = 1){
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++){ const l = prop('Wood_Log_A', {s: .32 * s, ry: i * 2.1}); l.position.y = .05; g.add(l); }
  for (let i = 0; i < 7; i++){ const a = i / 7 * Math.PI * 2; g.add(prop('rocks-small', {x: Math.cos(a) * .32 * s, z: Math.sin(a) * .32 * s, s: .25 * s})); }
  if (lit){
    const f1 = new THREE.Mesh(new THREE.ConeGeometry(.2 * s, .55 * s, 7), new THREE.MeshStandardMaterial({color: '#ff7a1a', emissive: '#ff5a00', emissiveIntensity: 2.2}));
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(.11 * s, .38 * s, 6), new THREE.MeshStandardMaterial({color: '#ffe26a', emissive: '#ffd34a', emissiveIntensity: 2.6}));
    f1.position.y = .3 * s; f2.position.y = .26 * s; g.add(f1, f2);
  }
  return g;
}
function totem(){
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++){ const l = prop('Wood_Log_A', {s: .5}); l.rotation.z = Math.PI / 2; l.position.y = .25 + i * .42; g.add(l); }
  const head = prop('rocks-medium', {s: .45}); head.position.y = 1.35; g.add(head);
  const b = purple(prop('banner-green', {s: .8})); b.position.set(.25, 0, 0); g.add(b);
  return g;
}
/** un camp : 'troll' (violet, occupé), 'repris' (drapeau du Père Noël, lutins), 'chef' / 'chefrepris' (forteresse) */
export function camp(state){
  const g = new THREE.Group(), boss = state.startsWith('chef'), taken = state === 'repris' || state === 'chefrepris';
  const tent = taken ? prop('stall-red', {s: boss ? 1.25 : .95}) : purple(prop('stall-green', {s: boss ? 1.25 : .95})); tent.position.set(-.35, 0, -.4); g.add(tent);
  if (boss){ const t2 = taken ? prop('stall-green', {s: .8}) : purple(prop('stall-green', {s: .8})); t2.position.set(.8, 0, -.7); t2.rotation.y = -.6; g.add(t2);
    for (const [x, z, ry] of [[-1.4, .6, Math.PI / 2], [-1.4, -.6, Math.PI / 2], [1.5, .2, Math.PI / 2], [-.6, 1.4, 0], [.6, 1.4, 0]]) g.add(prop('fence', {x, z, ry, s: .85})); }
  g.add(campfire(!taken || boss, boss ? 1.3 : 1).translateX(.55).translateZ(.45));
  if (!taken){
    g.add(totem().translateX(-1.0).translateZ(.55));
    const t = foe(boss ? 'chief' : 'troll', boss ? 1.6 : 1.05); t.position.set(.25, 0, .95); t.rotation.y = .7; g.add(t);
    if (boss){ const t2 = foe('troll', 1.0); t2.position.set(1.15, 0, .55); t2.rotation.y = .2; g.add(t2); }
    g.add(prop('snowball_pile', {x: -.9, z: -.1, s: .5}));
  } else {
    const flag = prop('banner-red', {x: -1.0, z: .55, s: 1.0}); g.add(flag);
    for (let v = 0; v < (boss ? 3 : 2); v++){ const c = character('elf', elfLook(v)); c.root.scale.setScalar(.38); c.mixer.update(.3 + v * .4); c.root.position.set(.1 + v * .5, 0, .95 + (v % 2) * .25); c.root.rotation.y = .6; g.add(c.root); }
    g.add(prop('present_A_red', {x: -.55, z: 1.0, s: .45}), prop('present_C_yellow', {x: -.25, z: 1.25, s: .4}));
  }
  return g;
}
/** le fond : neige, collines, montagnes au fond, sapins, chemin de pierre entre les camps */
export function terrain(){
  const g = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), new THREE.MeshStandardMaterial({color: '#eef4fc', roughness: .95}));
  ground.rotation.x = -Math.PI / 2; ground.position.set(4, -.02, 4); ground.receiveShadow = true; g.add(ground);
  // chemin de pierres plates, bien visible, bordé de lanternes
  for (let i = 0; i < CAMPS.length - 1; i++){ const [x0, z0] = CAMPS[i], [x1, z1] = CAMPS[i + 1], n = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / .38);
    for (let k = 0; k <= n; k++){ const t = k / n; g.add(prop('floor-stone', {x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, s: .62, ry: (k * 1.3) % 6})); }
    g.add(prop('lantern', {x: (x0 + x1) / 2 + .6, z: (z0 + z1) / 2 + .2, s: .5})); }
  // montagnes au fond : rochers larges et bas, recouverts de neige
  for (const [x, z, s, r] of [[-8, -9, 2.8, 0], [-3.5, -10.5, 3.2, 1.1], [1.5, -11, 2.8, 2], [6.5, -10, 3.0, .4], [11, -8.5, 2.6, 1.7], [-11, -4.5, 2.6, 2.6], [-11.5, 1.5, 2.4, 1.5]]){
    const m = prop('rocks-large', {x, z, s, ry: r}); m.scale.y *= .6; g.add(m); g.add(prop('snow-pile', {x: x + .3, z: z + .9, s: s * 1.3})); g.add(prop('snow-pile', {x: x - .8, z: z + .2, s: s}));
  }
  // forêt dense tout autour (cadre), quelques sapins à l'intérieur
  let r = 7; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const near = (x, z, d = 2.1) => CAMPS.some(([cx, cz]) => Math.hypot(cx - x, cz - z) < d);
  const onPath = (x, z) => { for (let i = 0; i < CAMPS.length - 1; i++){ const [x0, z0] = CAMPS[i], [x1, z1] = CAMPS[i + 1], dx = x1 - x0, dz = z1 - z0, t = Math.max(0, Math.min(1, ((x - x0) * dx + (z - z0) * dz) / (dx * dx + dz * dz))); if (Math.hypot(x - x0 - dx * t, z - z0 - dz * t) < .9) return true; } return false; };
  for (let i = 0; i < 420; i++){ const x = -13 + rnd() * 34, z = -10 + rnd() * 30, edge = x < -6 || x > 15 || z > 15 || z < -6;
    if (near(x, z) || onPath(x, z) || (!edge && rnd() < .7)) continue;
    g.add(prop(['tree-snow-a', 'tree-snow-b', 'tree-snow-c'][i % 3], {x, z, s: .8 + rnd() * .8, ry: rnd() * 6})); }
  for (let i = 0; i < 18; i++){ const x = -7 + rnd() * 22, z = -6 + rnd() * 21; if (!near(x, z) && !onPath(x, z)) g.add(prop(i % 3 ? 'snow-pile' : 'rocks-medium', {x, z, s: .7 + rnd() * .8})); }
  return g;
}
/** position à l'écran (px CSS du rendu) d'un point au sol, depuis l'origine (ax, ay) d'une image rendue */
export const iso = (ax, ay, x, z) => [ax + (x - z) * 32, ay + (x + z) * 16];
