// Bâtiments : chaque bâtiment est un petit diorama assemblé à partir des modèles du pack.
// L'apparence change par palier (niv. 1-3, 4-6, 7-10) et chaque niveau ajoute une décoration.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {prop, tint, addRim, mergeStatic} from './assets.js';
import {cobbleTexture} from './world.js';

const HALF_PI = Math.PI / 2;
export const tierOf = lv => lv >= 12 ? 3 : lv >= 5 ? 2 : 1;

/* ------------------------------------------------------------------ */
/* Chalet modulaire (Kenney Holiday Kit). Faîtage dans l'axe z,        */
/* largeur 2 cases, longueur `len` cases.                              */
/* ------------------------------------------------------------------ */
export function cabin({len = 2, front = ['cabin-window-a', 'door'], back = ['cabin-wall', 'cabin-wall'], sides = null, chimney = 0, lights = true} = {}){
  const g = new THREE.Group();
  const w = 2;
  const cx = i => i - (w - 1) / 2, cz = j => j - (len - 1) / 2;
  const put = (name, x, z, ry, y = 0) => { const p = prop(name, {x, y, z, ry}); g.add(p); return p; };
  const wall = (name, x, z, ry) => {
    if (name === 'door'){ put('cabin-doorway', x, z, ry); put('cabin-door-rotate', x, z, ry); }
    else put(name, x, z, ry);
  };
  front.forEach((n, i) => wall(n, cx(i), cz(len - 1), 0));
  back.forEach((n, i) => wall(n, cx(w - 1 - i), cz(0), Math.PI));
  for (let j = 0; j < len; j++){
    const sn = sides ? sides[j % sides.length] : 'cabin-wall';
    wall(sn, cx(w - 1), cz(len - 1 - j), HALF_PI);
    wall(sn, cx(0), cz(j), -HALF_PI);
  }
  put('cabin-corner', cx(0), cz(len - 1), 0);
  put('cabin-corner', cx(w - 1), cz(len - 1), HALF_PI);
  put('cabin-corner', cx(w - 1), cz(0), Math.PI);
  put('cabin-corner', cx(0), cz(0), -HALF_PI);
  put('cabin-wall-roof', cx(1), cz(len - 1), 0, 1);
  put('cabin-wall-roof', cx(0), cz(len - 1), 0, 1).scale.x = -1;
  put('cabin-wall-roof', cx(0), cz(0), Math.PI, 1);
  put('cabin-wall-roof', cx(1), cz(0), Math.PI, 1).scale.x = -1;
  for (let j = 0; j < len; j++){
    put(chimney && j === chimney - 1 ? 'cabin-roof-snow-chimney' : 'cabin-roof-snow', .5, cz(j), 0, 1);
    put('cabin-roof-snow', -.5, cz(j), Math.PI, 1);
  }
  if (lights) for (let i = 0; i < w; i++) g.add(prop('lights-colored', {x: cx(i), y: .98, z: cz(len - 1) + .74}));
  const merged = mergeStatic(g);
  merged.userData.chimney = chimney ? new THREE.Vector3(.98, 2.42, cz(chimney - 1)) : null;
  return merged;
}

/* ------------------------------------------------------------------ */
/* Socle du terrain : bois (palier 1), pierre (2), pierre + or (3)     */
/* ------------------------------------------------------------------ */
const baseGeo = new RoundedBoxGeometry(3.6, .2, 3.6, 3, .1);
const rimGeo = new RoundedBoxGeometry(3.92, .34, 3.92, 3, .1);
// socles : neige tassée bordée de pavés (palier 1), de pierres grises (2), de pierres et d'or (3)
const stoneTex = (() => { const t = cobbleTexture(); t.repeat.set(4, .5); return t; })();
const greyStone = (() => { const t = cobbleTexture(); t.repeat.set(4, .5); return t; })();
const snowTop = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#eef3fb'; x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 260; i++){ x.fillStyle = `rgba(${150 + Math.random() * 40},${170 + Math.random() * 40},220,${Math.random() * .18})`; x.beginPath(); x.ellipse(Math.random() * 128, Math.random() * 128, 2 + Math.random() * 8, 1 + Math.random() * 4, Math.random() * 3, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const BASE_MATS = {
  1: [new THREE.MeshStandardMaterial({map: snowTop, color: '#ffffff', roughness: .9}), new THREE.MeshStandardMaterial({map: stoneTex, color: '#ffe9cc', roughness: .85})],
  2: [new THREE.MeshStandardMaterial({map: snowTop, color: '#f4f7ff', roughness: .9}), new THREE.MeshStandardMaterial({map: greyStone, color: '#c9d3e6', roughness: .85})],
  3: [new THREE.MeshStandardMaterial({map: snowTop, color: '#ffffff', roughness: .9}), new THREE.MeshStandardMaterial({color: '#f2b632', roughness: .35, metalness: .45})],
};
for (const pair of Object.values(BASE_MATS)) pair.forEach(m => addRim(m, .3));
export function plotBase(tier, skin = null){
  const g = new THREE.Group();
  let [top, rim] = BASE_MATS[tier];
  if (skin?.top){
    if (!skinMats.has(skin.top)){ const pair = [new THREE.MeshStandardMaterial({color: skin.top, roughness: .6}), new THREE.MeshStandardMaterial({color: skin.rim, roughness: .4, metalness: skin.rim === '#f2b632' ? .4 : 0})]; pair.forEach(m => addRim(m, .3)); skinMats.set(skin.top, pair); }
    [top, rim] = skinMats.get(skin.top);
  }
  // Plus de socle : une fine dalle de neige tassée au ras du sol, juste pour poser le bâtiment (retour joueur).
  // Le bâtiment reste à la même hauteur relative ; l'ensemble est descendu de PLATE_DROP au moment du rendu.
  // plus de socle blanc : le bâtiment est posé directement dans la neige (son ombre suffit à l'ancrer)
  return g;
}
export const BASE_Y = .34;
export const PLATE_DROP = .32;      // de combien on descend un bâtiment pour que son ancien socle soit sous le sol
const padGeo = new RoundedBoxGeometry(3.7, .03, 3.7, 2, .015);
const padMat = new THREE.MeshStandardMaterial({color: '#e9eef8', roughness: .95});

/* ------------------------------------------------------------------ */
/* Décorations ajoutées niveau par niveau (coins du socle)             */
/* ------------------------------------------------------------------ */
const SPOTS = [[1.45, 1.45], [-1.45, 1.45], [1.45, -1.3], [-1.45, -1.3], [0, 1.55], [1.5, .1], [-1.5, .1]];
const DECOS = [
  ['present_A_red', .42], ['lantern', .55], ['present_B_green', .4], ['candycane_large', .2], ['snowman', .45],
  ['present_C_yellow', .4], ['tree-decorated-snow', .45], ['lantern_decorated', .2], ['present_sphere_A_red', .45], ['nutcracker', .7],
];

/* ------------------------------------------------------------------ */
/* Modèles par type                                                    */
/* ------------------------------------------------------------------ */
function presents(g, list, s = .42){
  const names = ['present_A_red', 'present_B_green', 'present_C_yellow', 'present_D_blue', 'present_E_white', 'present_sphere_A_red'];
  list.forEach(([x, z, k = 0, ry = 0, sc = 1]) => g.add(prop(names[k % names.length], {x, z, ry, s: s * sc})));
}
const letterGeo = new THREE.BoxGeometry(.26, .17, .02);
const letterMat = new THREE.MeshStandardMaterial({color: '#fffaf0', roughness: .7});
const sealMat = new THREE.MeshStandardMaterial({color: '#e0243a', roughness: .5});
const sealGeo = new THREE.CylinderGeometry(.04, .04, .025, 10);

// teinte des boiseries par type : [teinte HSL, saturation]
const TRIM = {hq: [.985, 1.25], post: [.6, 1.1], workshop: [.13, 1.3], stable: [.08, 1], sawmill: [null], mill: [.8, 1.1], wrap: [.9, 1.2]};

export function buildModel(type, lv, baseSkin = null){
  const T = tierOf(Math.max(1, lv));
  const root = new THREE.Group();
  const g = new THREE.Group(); g.position.y = BASE_Y; root.add(plotBase(T, baseSkin), g);
  const anim = [], smoke = [];
  const add = (name, o = {}) => { const p = prop(name, o); g.add(p); return p; };
  const addCabin = (opts, x = 0, z = 0, ry = 0, s = 1.15) => {
    const c = tint(cabin(opts), TRIM[type]?.[0], TRIM[type]?.[1]); c.position.set(x, 0, z); c.rotation.y = ry; c.scale.setScalar(s); g.add(c);
    if (c.userData.chimney){ const v = c.userData.chimney.clone().multiplyScalar(s).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry); v.x += x; v.z += z; v.y += BASE_Y; smoke.push(v); }
    return c;
  };
  let top = 3;

  if (type === 'hq'){
    if (T === 1){
      addCabin({len: 2, front: ['cabin-window-a', 'door'], chimney: 1}, 0, -.25);
      presents(g, [[.95, 1.3, 0, .3], [1.3, 1.15, 1, -.4, .8]]);
      top = 3.1;
    } else if (T === 2){
      addCabin({len: 3, front: ['cabin-window-b', 'door'], sides: ['cabin-window-a', 'cabin-wall-wreath', 'cabin-window-a'], chimney: 2}, -.25, -.35, 0, 1.12);
      add('tree-decorated-snow', {x: 1.35, z: .9, s: .6});
      presents(g, [[1.05, 1.5, 0], [1.5, 1.45, 2, .5, .8], [-1.3, 1.45, 1]]);
      top = 3.2;
    } else {
      addCabin({len: 3, front: ['cabin-window-large', 'door'], sides: ['cabin-window-a', 'cabin-wall-wreath', 'cabin-window-a'], chimney: 2}, -.55, -.45, 0, 1.18);
      addCabin({len: 2, front: ['cabin-window-b', 'cabin-wall-wreath'], chimney: 0}, 1.15, -.65, -HALF_PI, .8);
      add('christmas_tree', {x: 1.25, z: 1.0, s: .32});
      add('nutcracker', {x: -1.05, z: 1.45, s: .75}); add('nutcracker', {x: .0, z: 1.45, s: .75});
      presents(g, [[1.6, 1.55, 0], [.8, 1.6, 4, .4, .8]]);
      if (lv >= 10){ const st = add('bell_decorated', {x: -.55, z: 1.25, s: .35}); st.position.y = 2.35; st.userData.live = true; anim.push(t => st.rotation.z = Math.sin(t * 2.2) * .25); }
      top = 3.5;
    }
  }
  else if (type === 'sawmill'){
    const wheelName = T === 3 ? 'watermill-wide' : 'watermill';
    if (T === 1){
      add('Wood_Log_Stack', {x: -.6, z: .3, s: .62});
      add('cart', {x: .95, z: .55, s: 1.1, ry: -.5});
      add('Wood_Log_A', {x: 1.0, z: .55, s: .5, ry: 1.1}).position.y = .55;
    } else {
      addCabin({len: T === 3 ? 2 : 1, front: ['cabin-window-c', 'door'], chimney: T === 3 ? 1 : 0, lights: T === 3}, -.55, -.45, 0, 1.1);
      add('Wood_Log_Stack', {x: 1.05, z: 1.0, s: .5});
      add('Wood_Planks_Stack_Large', {x: -1.0, z: 1.3, s: .45});
      if (T === 3) add('Wood_Planks_Stack_Large', {x: .1, z: 1.45, s: .4, ry: .4});
    }
    const wheel = add(wheelName, {x: T === 1 ? .2 : 1.3, z: T === 1 ? -.9 : -.55, s: T === 1 ? .95 : 1.05, ry: T === 1 ? HALF_PI : 0});
    wheel.position.y = .95;
    wheel.userData.live = true; anim.push((t, dt) => wheel.rotation.x += dt * 1.6);
    top = T === 1 ? 2.3 : T === 2 ? 2.9 : 3.1;
  }
  else if (type === 'bakery'){
    if (T === 1){ add('gingerbread_house', {z: -.2, s: 1.75}); add('plate_decorated_A', {x: 1.2, z: 1.2, s: .55}); top = 2.8; }
    else if (T === 2){ add('gingerbread_house_decorated', {z: -.2, s: 1.5}); add('candycane_large', {x: -1.45, z: 1.1, s: .32}); add('hot_chocolate_decorated', {x: 1.35, z: 1.3, s: .9}); top = 3; }
    else {
      add('gingerbread_house_decorated', {x: -.25, z: -.25, s: 1.75});
      add('gingerbread_house', {x: 1.25, z: .95, s: .75, ry: -.6});
      add('candycane_large', {x: -1.55, z: 1.3, s: .34}); add('candycane_large', {x: .55, z: 1.55, s: .26, ry: Math.PI});
      add('gingerbread-man', {x: -.6, z: 1.55, s: 1.3}); add('gingerbread-woman', {x: -.25, z: 1.6, s: 1.3});
      top = 3.4;
    }
    const ck = add('cookie', {x: T === 1 ? -1.1 : 0, z: T === 1 ? 1.1 : 1.4, s: T === 3 ? 1.6 : 1.3});
    ck.rotation.x = -1.1; ck.position.y = .35;
    ck.userData.live = true; anim.push(t => { ck.rotation.z = t * .9; });
    smoke.push(new THREE.Vector3(T === 3 ? .2 : .45, T === 1 ? 2.75 : 2.6, T === 3 ? -.3 : -.15));
  }
  else if (type === 'post'){
    if (T === 1){
      add('stall-red', {z: -.1, s: 1.9});
      add('sock-red-cane', {x: -1.2, z: 1.2, s: 1.2});
      presents(g, [[1.2, 1.1, 3], [.75, 1.35, 0, .5, .7]]);
      top = 2.7;
    } else {
      addCabin({len: T === 3 ? 2 : 1, front: ['cabin-window-c', 'door'], chimney: T === 3 ? 2 : 0}, -.35, -.5, 0, 1.12);
      add('stall-red', {x: 1.2, z: 1.0, s: 1.15, ry: -.4});
      if (T === 3){ add('banner-red', {x: -1.6, z: .9, s: 1.3}); add('lantern', {x: -1.45, z: 1.4, s: .55}); }
      top = T === 3 ? 3.1 : 2.9;
    }
    const n = Math.min(5, 1 + Math.ceil(lv / 2));
    for (let i = 0; i < n; i++){
      const l = new THREE.Group(); l.userData.live = true; const p = new THREE.Mesh(letterGeo, letterMat); const s = new THREE.Mesh(sealGeo, sealMat); s.rotation.x = HALF_PI; s.position.z = .015; l.add(p, s); l.traverse(o => o.castShadow = true); g.add(l);
      const ph = i * (Math.PI * 2 / n);
      anim.push(t => { const a = t * .9 + ph; l.position.set(Math.cos(a) * 1.25, 2.3 + Math.sin(a * 2) * .22, Math.sin(a) * 1.05); l.rotation.set(Math.sin(a * 3) * .4, -a, Math.cos(a * 2) * .3); });
    }
  }
  else if (type === 'workshop'){
    if (T === 1){
      addCabin({len: 1, front: ['cabin-window-a', 'door'], chimney: 0}, -.3, -.5, 0, 1.15);
      presents(g, [[1.1, .9, 0], [1.45, .5, 1, .4, .8], [1.25, 1.35, 2, .2, .9], [-1.3, 1.2, 3]]);
      top = 2.8;
    } else {
      addCabin({len: T === 3 ? 3 : 2, front: ['cabin-window-large', 'door'], sides: ['cabin-window-b'], chimney: 1}, -.45, -.4, 0, T === 3 ? 1.08 : 1.12);
      presents(g, [[1.3, -.9, 0], [1.4, -.4, 4, .3, .8], [-1.35, 1.35, 5]]);
      // petit train de jouets qui fait le tour
      const train = new THREE.Group(); train.userData.live = true; g.add(train);
      const parts = ['train_locomotive', 'train_tender_presents_A', T === 3 ? 'train_tender_presents_B' : null].filter(Boolean);
      const cars = parts.map(n => { const c = prop(n, {s: .62}); train.add(c); return c; });
      const R = 1.5;
      anim.push(t => { cars.forEach((c, i) => { const a = -t * .55 - i * .36; c.position.set(.35 + Math.cos(a) * R, 0, .25 + Math.sin(a) * R * .85); c.rotation.y = -a + Math.PI; }); });
      top = T === 3 ? 3.2 : 3;
    }
  }
  else if (type === 'mill'){
    if (T === 1){
      add('stall-green', {x: -.3, z: -.3, s: 1.9});
      add('Textiles_Stack_Large_Colored', {x: 1.05, z: .9, s: .55});
      add('Food_Basket_A_Berries', {x: -1.2, z: 1.2, s: .6});
      top = 2.7;
    } else {
      addCabin({len: T === 3 ? 2 : 1, front: ['cabin-window-b', 'door'], chimney: T === 3 ? 1 : 0}, -.45, -.5, 0, 1.12);
      add('Textiles_Stack_Large_Colored', {x: 1.2, z: 1.1, s: .5});
      add('stall-green', {x: 1.25, z: -.3, s: 1.1, ry: -HALF_PI});
      if (T === 3) add('Textiles_Stack_Large_Colored', {x: -1.2, z: 1.35, s: .45, ry: 1});
      top = T === 3 ? 3.1 : 2.9;
    }
    const wheel = add('watermill', {x: T === 1 ? -1.2 : -1.55, z: T === 1 ? .1 : .7, s: .55, ry: HALF_PI});
    wheel.position.y = .55;
    wheel.userData.live = true; anim.push((t, dt) => wheel.rotation.x += dt * 3);
  }
  else if (type === 'wrap'){
    if (T === 1){
      add('stall-red', {x: -.35, z: -.35, s: 1.8});
      presents(g, [[1.1, .9, 0], [1.4, .4, 3, .4, .8], [.75, 1.35, 2], [-1.25, 1.2, 1, .3], [-1.0, 1.5, 5, 0, .8]]);
      top = 2.7;
    } else {
      addCabin({len: T === 3 ? 2 : 1, front: ['cabin-window-large', 'door'], chimney: T === 3 ? 1 : 0}, -.45, -.5, 0, 1.12);
      add('stall-red', {x: 1.25, z: -.2, s: 1.1, ry: -HALF_PI});
      presents(g, [[1.15, 1.15, 0], [1.5, .85, 3, .4, .8], [-1.3, 1.3, 1], [-.9, 1.5, 4, .3, .7]]);
      if (T === 3) add('christmas_tree_decorated', {x: 1.35, z: 1.25, s: .22});
      top = T === 3 ? 3.1 : 2.9;
    }
    const bow = add('present_sphere_A_red', {x: 0, z: 1.3, s: .55});
    bow.userData.live = true; anim.push(t => { bow.position.y = .15 + Math.abs(Math.sin(t * 2.4)) * .35; bow.rotation.y = t * 1.5; });
  }
  else if (type === 'storage'){
    add('Containers_Pile_Large', {x: -.75, z: -.55, s: T === 1 ? .7 : .85});
    add('Pallet_Wood_Covered_A', {x: .85, z: -.7, s: .8});
    add('Containers_Crate_Large', {x: .9, z: -.6, s: .45}).position.y = .3;
    add('Food_Barrel_Empty', {x: .95, z: .8, s: .5});
    if (T >= 2){ add('Containers_Pile_Large', {x: .75, z: .75, s: .6, ry: 1.2}); add('Pallet_Wood_Covered_B', {x: -.85, z: .95, s: .7}); add('stall-green', {x: -.75, z: -.55, s: 2.1}); }
    else add('Containers_Crate_Large', {x: -.8, z: .9, s: .5});
    if (T === 3){ add('Gems_Chest', {x: -.9, z: 1.05, s: .5}); add('Gold_Bars_Stack_Small', {x: .1, z: 1.4, s: .6}); add('Money_Pile_Large', {x: .2, z: .2, s: .45}); }
    top = T === 1 ? 2.2 : 3;
  }
  else if (type === 'stable'){
    if (T >= 2) addCabin({len: T === 3 ? 2 : 1, front: ['cabin-overhang-doorway', 'cabin-window-a'], chimney: 0}, -.45, -.65, 0, 1.05);
    for (const [x, z, ry] of [[-1.6, 0, HALF_PI], [-1.6, 1.0, HALF_PI], [1.6, 0, -HALF_PI], [1.6, 1.0, -HALF_PI], [-1.1, 1.6, 0], [1.1, 1.6, 0]]) add('fence', {x, z, ry: ry + HALF_PI, s: 1});
    const n = Math.min(5, 1 + Math.floor(lv / 2));
    const spots = [[.6, .9, -.4], [-.6, 1.05, .5], [1.05, .1, -1.2], [-1.05, .2, 1.1], [0, .25, 3]];
    for (let i = 0; i < n; i++){
      const [x, z, ry] = spots[i];
      const r = add('reindeer', {x, z, ry, s: .62});
      const ph = i * 1.7;
      r.userData.live = true; anim.push(t => { r.rotation.x = Math.max(0, Math.sin(t * 1.3 + ph)) * .12; r.position.y = Math.abs(Math.sin(t * 2.6 + ph)) * .03; });
    }
    add(T === 3 ? 'sled-long' : 'sled', {x: T === 1 ? .5 : 1.2, z: T === 1 ? -.9 : -1.0, ry: .3, s: .9});
    top = T === 1 ? 2 : 2.8;
  }

  // décorations de niveau
  const used = new Set(); let spot = 0;
  for (let i = 0; i < Math.min(lv - 1, DECOS.length); i++){
    if ((i + (type.length)) % 3 === 0) continue; // pas une déco à chaque niveau, pour garder de l'air
    const [name, s] = DECOS[(i + type.length) % DECOS.length];
    if (used.has(name)) continue; used.add(name);
    const [x, z] = SPOTS[spot++ % SPOTS.length];
    g.add(prop(name, {x: x * .98, z: z * .98, s, ry: (i * 1.7) % 6}));
  }

  // fusion des parties fixes (les parties animées marquées userData.live restent séparées)
  const live = [];
  root.updateMatrixWorld(true);
  root.traverse(o => { if (o.userData.live && !live.some(p => isAncestor(p, o))) live.push(o); });
  const holders = live.map(o => { const h = new THREE.Group(); h.matrixAutoUpdate = false; h.matrix.copy(o.parent.matrixWorld); o.removeFromParent(); h.add(o); return h; });
  const merged = mergeStatic(root);
  for (const h of holders) merged.add(h);
  return {group: merged, anim, smoke, top};
}

/* ------------------------------------------------------------------ */
/* Chantier : échafaudage, planches, caisses                           */
/* ------------------------------------------------------------------ */
const poleMat = new THREE.MeshStandardMaterial({color: '#d9a066', roughness: .8});
const poleGeo = new THREE.CylinderGeometry(.05, .05, 1, 6);
export function scaffold(h = 2.4){
  const g = new THREE.Group();
  const P = (x, y, z, len, axis) => { const m = new THREE.Mesh(poleGeo, poleMat); m.scale.y = len; m.position.set(x, y, z); if (axis === 'x') m.rotation.z = HALF_PI; if (axis === 'z') m.rotation.x = HALF_PI; m.castShadow = true; g.add(m); };
  const s = 1.45;
  for (const x of [-s, s]) for (const z of [-s, s]) P(x, BASE_Y + h / 2, z, h);
  for (const y of [h * .45, h * .9]) { P(0, BASE_Y + y, s, s * 2, 'x'); P(0, BASE_Y + y, -s, s * 2, 'x'); P(s, BASE_Y + y, 0, s * 2, 'z'); P(-s, BASE_Y + y, 0, s * 2, 'z'); }
  g.add(prop('Wood_Planks_Stack_Medium', {x: 1.05, y: BASE_Y, z: 1.15, s: .45}));
  g.add(prop('Containers_Crate_Large', {x: -1.1, y: BASE_Y, z: 1.15, s: .35}));
  return g;
}
export function constructionSite(skin = null){
  const root = new THREE.Group();
  root.add(plotBase(1, skin));
  const f = prop('Pallet_Wood', {y: BASE_Y, s: .9}); root.add(f);
  root.add(prop('Wood_Planks_Stack_Small', {x: -.4, y: BASE_Y, z: -.3, s: .6}));
  return root;
}


function isAncestor(a, o){ for (let p = o.parent; p; p = p.parent) if (p === a) return true; return false; }
