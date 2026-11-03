// Modèles procéduraux de la V2 : champs (terre labourée + cultures bien lisibles) et icônes d'objets
// qui n'existent pas dans les packs (gerbe de blé, hache, scie, clous, pot de peinture, pièces).
// Couleurs franches et saturées, comme Township : on doit reconnaître une culture mûre d'un coup d'œil.
import * as THREE from 'three';
import {prop} from '../assets.js';

const mats = {};
const M = (c, o = {}) => mats[c + JSON.stringify(o)] ||= new THREE.MeshStandardMaterial({color: c, roughness: .75, metalness: 0, ...o});
const mesh = (geo, c, o) => new THREE.Mesh(geo, M(c, o));
function rnd(seed){ let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

/** Terre labourée de 2×2 cases : planche de terre bombée avec 4 sillons. */
function soil(){
  const g = new THREE.Group();
  const base = mesh(new THREE.BoxGeometry(1.86, .14, 1.86), '#6b3d1f'); base.position.y = .07; g.add(base);
  const rim = mesh(new THREE.BoxGeometry(1.96, .08, 1.96), '#8a5a33'); rim.position.y = .04; g.add(rim);
  const ridge = new THREE.CapsuleGeometry(.13, 1.5, 4, 10); ridge.rotateZ(Math.PI / 2);
  for (let i = 0; i < 4; i++){ const r = mesh(ridge, i % 2 ? '#8b532b' : '#94592f'); r.scale.set(1, .55, 1); r.position.set(0, .16, -.69 + i * .46); g.add(r); }
  return g;
}

// une touffe par position de sillon : 4 rangs × 4 plants
const SPOTS = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) SPOTS.push([-.66 + c * .44, -.69 + r * .46]);

function sprout(g, x, z, s = 1, c = '#5fcf3a'){
  const leaf = new THREE.ConeGeometry(.05 * s, .22 * s, 5);
  for (let k = 0; k < 3; k++){ const l = mesh(leaf, c); l.position.set(x + Math.cos(k * 2.1) * .04 * s, .26 + .08 * s, z + Math.sin(k * 2.1) * .04 * s); l.rotation.set(Math.sin(k * 2.1) * .5, 0, -Math.cos(k * 2.1) * .5); g.add(l); }
}
const PLANT = {
  wheat(g, x, z, R){
    for (let k = 0; k < 5; k++){
      const a = k / 5 * 6.28 + R(), r = k ? .07 : 0, h = .34 + R() * .1, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r;
      const st = mesh(new THREE.CylinderGeometry(.012, .016, h, 4), '#d9a526'); st.position.set(px, .2 + h / 2, pz); st.rotation.set(Math.sin(a) * .2, 0, -Math.cos(a) * .2); g.add(st);
      const ear = mesh(new THREE.CapsuleGeometry(.035, .1, 3, 6), '#ffd23c', {roughness: .55}); ear.position.set(px + Math.cos(a) * h * .2, .22 + h, pz + Math.sin(a) * h * .2); ear.rotation.copy(st.rotation); g.add(ear);
    }
  },
  carrot(g, x, z){
    const top = mesh(new THREE.CylinderGeometry(.09, .07, .12, 10), '#ff7a12', {roughness: .5}); top.position.set(x, .28, z); g.add(top);
    sprout(g, x, z + .02, 1.1, '#3fbf2a'); for (const l of g.children.slice(-3)) l.position.y += .1;
  },
  corn(g, x, z, R){
    const h = .62 + R() * .1;
    const st = mesh(new THREE.CylinderGeometry(.025, .035, h, 6), '#4caf32'); st.position.set(x, .2 + h / 2, z); g.add(st);
    for (let k = 0; k < 3; k++){ const l = mesh(new THREE.ConeGeometry(.04, .32, 4), '#5cc83a'); l.position.set(x, .3 + k * .15, z); l.rotation.set(0, k * 2.1, .9); l.translateY(.12); g.add(l); }
    const ear = mesh(new THREE.CapsuleGeometry(.045, .13, 3, 8), '#ffd43a', {roughness: .5}); ear.position.set(x + .05, .2 + h * .6, z); ear.rotation.z = -.35; g.add(ear);
  },
  beet(g, x, z){
    const b = mesh(new THREE.SphereGeometry(.09, 12, 10), '#b0245e', {roughness: .5}); b.scale.y = .85; b.position.set(x, .24, z); g.add(b);
    sprout(g, x, z, 1.4, '#4cbf3a');
  },
  pumpkin(g, x, z, R){
    if ((Math.round(x * 10) + Math.round(z * 10)) % 2) { sprout(g, x, z, 1.4, '#3fa82c'); return; }
    const p = mesh(new THREE.SphereGeometry(.15, 14, 10), '#ff8f1f', {roughness: .5}); p.scale.set(1.15, .8, 1.15); p.position.set(x, .3, z); g.add(p);
    const st = mesh(new THREE.CylinderGeometry(.02, .025, .08, 5), '#4a7a22'); st.position.set(x, .43, z); g.add(st);
    const lf = mesh(new THREE.SphereGeometry(.09, 8, 6), '#3fa82c'); lf.scale.y = .3; lf.position.set(x - .12, .25, z + .1); g.add(lf);
  },
  berry(g, x, z, R){
    const bush = mesh(new THREE.IcosahedronGeometry(.15, 1), '#3cae3a', {flatShading: true}); bush.scale.y = .7; bush.position.set(x, .3, z); g.add(bush);
    for (let k = 0; k < 4; k++){ const b = mesh(new THREE.SphereGeometry(.045, 8, 6), '#ff2440', {roughness: .3}); b.rotation.x = Math.PI; const a = k * 1.6 + R(); b.scale.setScalar(1.4); b.position.set(x + Math.cos(a) * .1, .36 + R() * .06, z + Math.sin(a) * .1); g.add(b); }
  },
};
const SPROUT_COLOR = {wheat: '#7fd04a', carrot: '#5cc83a', corn: '#5cc83a', beet: '#5cc83a', pumpkin: '#4cb83a', berry: '#4cb83a'};

/** Champ 2×2, centré sur (0,0). crop = null pour un champ vide ; stage 0 = pousse, 1 = mûr. */
export function fieldModel(crop, stage){
  const g = new THREE.Group(); g.add(soil());
  if (!crop) return g;
  const R = rnd(crop.length * 13 + 5);
  for (const [x, z] of SPOTS){
    if (stage) PLANT[crop](g, x + (R() - .5) * .06, z + (R() - .5) * .06, R);
    else sprout(g, x, z, .8 + R() * .3, SPROUT_COLOR[crop]);
  }
  return g;
}

/* ---------- icônes ---------- */
export function wheatSheaf(){
  const g = new THREE.Group();
  for (let k = 0; k < 9; k++){
    const a = k / 9 * 6.28, t = (k % 3 - 1) * .18;
    const st = mesh(new THREE.CylinderGeometry(.025, .025, 1.1, 5), '#e0aa2a'); st.rotation.set(Math.sin(a) * .25, 0, t); st.position.set(Math.cos(a) * .06, .55, Math.sin(a) * .06); g.add(st);
    const ear = mesh(new THREE.CapsuleGeometry(.07, .22, 3, 8), '#ffd23c', {roughness: .5}); ear.rotation.copy(st.rotation); ear.position.set(st.position.x - Math.sin(t) * .6, 1.15, st.position.z + Math.sin(st.rotation.x) * .6); g.add(ear);
  }
  const tie = mesh(new THREE.TorusGeometry(.13, .04, 6, 16), '#d8322e'); tie.rotation.x = Math.PI / 2; tie.position.y = .5; g.add(tie);
  return g;
}
export function axeModel(){
  const g = new THREE.Group();
  const h = mesh(new THREE.CylinderGeometry(.06, .07, 1.3, 8), '#b57837'); h.position.y = .65; g.add(h);
  const head = mesh(new THREE.BoxGeometry(.45, .3, .08), '#b9c4cf', {metalness: .5, roughness: .35}); head.position.set(.2, 1.15, 0); g.add(head);
  const edge = mesh(new THREE.BoxGeometry(.06, .38, .085), '#eef3f7', {metalness: .5, roughness: .25}); edge.position.set(.44, 1.15, 0); g.add(edge);
  g.rotation.z = -.5; return g;
}
export function sawModel(){
  const g = new THREE.Group();
  const blade = new THREE.Shape(); blade.moveTo(0, 0); for (let i = 0; i <= 10; i++) blade.lineTo(i * .12, i % 2 ? -.06 : 0); blade.lineTo(1.2, .32); blade.lineTo(0, .22); blade.lineTo(0, 0);
  const b = mesh(new THREE.ExtrudeGeometry(blade, {depth: .03, bevelEnabled: false}), '#c7d0d8', {metalness: .5, roughness: .3}); g.add(b);
  const hd = mesh(new THREE.BoxGeometry(.32, .36, .1), '#d8452e'); hd.position.set(-.12, .14, .015); g.add(hd);
  g.rotation.z = .35; return g;
}
export function nailModel(){
  const g = new THREE.Group();
  for (let k = 0; k < 3; k++){
    const n = new THREE.Group();
    const sh = mesh(new THREE.CylinderGeometry(.04, .04, .8, 8), '#aab4bf', {metalness: .6, roughness: .3}); sh.position.y = .4; n.add(sh);
    const tip = mesh(new THREE.ConeGeometry(.04, .12, 8), '#aab4bf', {metalness: .6, roughness: .3}); tip.rotation.x = Math.PI; tip.position.y = -.05; n.add(tip);
    const hd = mesh(new THREE.CylinderGeometry(.12, .12, .05, 12), '#c8d0d8', {metalness: .6, roughness: .3}); hd.position.y = .82; n.add(hd);
    n.position.set((k - 1) * .25, 0, k * .1); n.rotation.z = (k - 1) * .35; g.add(n);
  }
  return g;
}
export function paintModel(){
  const g = new THREE.Group();
  const can = mesh(new THREE.CylinderGeometry(.42, .38, .7, 20), '#3a8fe8'); can.position.y = .35; g.add(can);
  const lbl = mesh(new THREE.CylinderGeometry(.425, .425, .28, 20, 1, true), '#ffffff'); lbl.position.y = .35; g.add(lbl);
  const paint = mesh(new THREE.CylinderGeometry(.38, .38, .04, 20), '#ff3b50', {roughness: .3}); paint.position.y = .71; g.add(paint);
  const drip = mesh(new THREE.CapsuleGeometry(.06, .18, 3, 8), '#ff3b50', {roughness: .3}); drip.position.set(.4, .58, .1); g.add(drip);
  const handle = mesh(new THREE.TorusGeometry(.4, .025, 6, 20, Math.PI), '#666'); handle.position.y = .7; g.add(handle);
  return g;
}
export function coinsModel(){
  const g = new THREE.Group();
  const gold = M('#ffc21a', {metalness: .25, roughness: .3, emissive: '#6a4000', emissiveIntensity: .35});
  for (let i = 0; i < 3; i++){ const c = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .16, 32), gold); c.position.set(i * .22 - .22, i * .17, 0); c.rotation.x = .2; g.add(c);
    const r = new THREE.Mesh(new THREE.TorusGeometry(.38, .035, 6, 28), M('#ffe066', {roughness: .3})); r.rotation.x = Math.PI / 2 + .2; r.position.set(c.position.x, c.position.y + .085, .015); g.add(r); }
  return g;
}
export function pickIcon(key, ic){
  switch (key){
    case 'wheat': return wheatSheaf();
    case 'axe': return axeModel();
    case 'saw': return sawModel();
    case 'nail': return nailModel();
    case 'paint': return paintModel();
    case 'beet': { const g = new THREE.Group(); PLANT.beet(g, 0, 0); g.scale.setScalar(3); return g; }
    default: return prop(ic);
  }
}
