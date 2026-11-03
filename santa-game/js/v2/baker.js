// Pré-rendu de toutes les images du jeu à partir des modèles 3D.
// Utilisé (1) hors ligne par tools/export-pack.mjs pour produire assets/pack/ — c'est ce que charge le téléphone ;
// (2) en secours sur l'appareil si le pack n'est pas disponible.
import * as THREE from 'three';
import {loadAssets, prop, tint, character, elfLook, santaLook} from '../assets.js';
import {buildModel, cabin, plotBase} from '../buildings.js';
import {bake, bakeIcon, free, disposeBaker} from './bake.js';
import * as T from './town.js';
import {fieldModel, pickIcon, coinsModel, pathTile, giftPile} from './models.js';
const {ITEMS, CROPS, BUILDINGS} = T;

const scaled = (g, s) => { const w = new THREE.Group(); g.scale.setScalar(s); w.add(g); return w; };
function pen(animal){
  const g = new THREE.Group();
  g.add(scaled(plotBase(1), .8));
  for (let i = 0; i < 3; i++){
    g.add(prop('fence_simple', {x: -1 + i, z: -1, y: .25})); g.add(prop('fence_simple', {x: -1 + i, z: 1, y: .25, ry: Math.PI}));
    g.add(prop('fence_simple', {x: -1, z: -1 + i, y: .25, ry: -Math.PI / 2})); if (i !== 1) g.add(prop('fence_simple', {x: 1, z: -1 + i, y: .25, ry: Math.PI / 2}));
  }
  g.add(prop('Food_Barrel_Empty', {x: .9, z: -.8, y: .3, s: .35}));
  [[-.5, -.35, .4], [.35, .2, -.6], [-.3, .55, 2.4]].forEach(([x, z, r]) => g.add(prop(animal, {x, z, y: .3, s: .34, ry: r})));
  return g;
}
const field = (crop, stage) => fieldModel(crop, stage);
function deco(type){
  switch (type){
    case 'tree': return prop('tree-decorated-snow', {s: .75});
    case 'wildtree': return prop('tree-snow-a', {s: .85});
    case 'wildtree2': return prop('tree-snow-b', {s: .8});
    case 'lantern': return prop('lantern', {s: .7});
    case 'bench': return prop('bench', {s: .75, ry: Math.PI / 4});
    case 'gifts': return giftPile();
    case 'candy': return prop('candycane_large', {s: .4});
    case 'reindeer': return prop('reindeer', {s: .7, ry: .8});
    default: return prop('snowman_A', {s: .32});
  }
}
function house(len, hue){ const c = tint(cabin({len, front: ['cabin-window-a', 'door'], chimney: 1}), hue, 1.1); const g = new THREE.Group(); c.scale.setScalar(.82); g.add(c); return g; }
function modelFor(type){
  const b = BUILDINGS[type], mk = (t, lv, s = .78) => scaled(buildModel(t, lv).group, s);
  switch (type){
    case 'santa': return mk('hq', 12, 1.02);
    case 'orders': { const g = mk('post', 6); g.add(prop('sled-long', {x: 1.1, z: 1.05, s: .8, ry: .6})); return g; }
    case 'barn': return mk('storage', 6);
    case 'bakery': return mk('bakery', 6);
    case 'dairy': { const g = new THREE.Group(); g.add(scaled(plotBase(2), .78)); const c = tint(cabin({len: 2, front: ['cabin-window-b', 'door'], chimney: 1}), .58, 1.1); c.scale.setScalar(.82); c.position.set(-.2, .27, -.2); g.add(c); g.add(prop('carton', {x: 1.1, z: .9, y: .27, s: .9})); g.add(prop('cheese', {x: .6, z: 1.15, y: .27, s: .8})); return g; }
    case 'sugarmill': return mk('sawmill', 6);
    case 'pastry': return mk('bakery', 12);
    case 'toyshop': return mk('workshop', 12);
    case 'cabin': return house(1, [.985, .6, .13, .33][Math.floor(Math.random() * 4)]);
    case 'bighouse': return house(2, .9);
    case 'grocery': return mk('post', 3);
    case 'school': { const g = new THREE.Group(); g.add(scaled(plotBase(2), .78)); const c = tint(cabin({len: 3, front: ['cabin-window-large', 'door'], chimney: 2}), .6, 1.2); c.scale.setScalar(.78); c.position.set(-.1, .27, 0); g.add(c); return g; }
    case 'postoffice': return mk('wrap', 12);
    case 'henhouse': return pen('animal-chick');
    case 'cowshed': return pen('animal-cow');
    case 'bunny': return pen('animal-bunny');
    case 'path': return pathTile(1);
    default: return deco(type);
  }
}
function site(n){ const g = new THREE.Group(); g.add(scaled(plotBase(1), n / 3.6)); g.add(prop('Pallet_Wood', {y: .3, s: .5 * n / 3})); g.add(prop('Wood_Planks_Stack_Small', {x: -.3, z: -.3, y: .3, s: .4 * n / 3})); g.add(prop('Containers_Crate_Large', {x: .5, z: .4, y: .3, s: .25 * n / 3})); return g; }
function forest(seed){
  const g = new THREE.Group(); let r = seed;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const kinds = ['tree-snow-a', 'tree-snow-b', 'tree-snow-c', 'tree'];
  for (let i = 0; i < 34; i++) g.add(prop(kinds[Math.floor(rnd() * 4)], {x: (rnd() - .5) * 10, z: (rnd() - .5) * 10, s: .9 + rnd() * .9, ry: rnd() * 6}));
  for (let i = 0; i < 5; i++) g.add(prop(rnd() < .5 ? 'rocks-medium' : 'snow-pile', {x: (rnd() - .5) * 9, z: (rnd() - .5) * 9, s: .8 + rnd() * .6}));
  return g;
}

/** Portrait en buste (tête + épaules) : on rend le personnage entier puis on garde le haut. */
function bust(root, size, density){
  const full = bakeIcon(root, size * 1.9, density);
  const c = document.createElement('canvas'); c.width = c.height = size * density;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
  x.drawImage(full, full.width * .22, full.height * .14, full.width * .56, full.width * .56, 0, 0, c.width, c.height);
  free(full); return c;
}
function goldSnowman(){
  const g = prop('snowman_A', {s: .5}); const gold = new THREE.MeshStandardMaterial({color: '#ffcf3a', metalness: .55, roughness: .3, emissive: '#5a3a00', emissiveIntensity: .3});
  g.traverse(o => { if (o.isMesh) o.material = gold; }); return g;
}
function sleighIcon(){ const g = new THREE.Group(); g.add(prop('sled-long', {s: 1.2})); g.add(prop('present_A_red', {s: .45, y: .3, z: -.2})); g.add(prop('present_B_green', {s: .35, y: .3, z: .3, ry: .5})); g.add(prop('reindeer', {z: 1.4, s: .9})); g.rotation.y = .5; return g; }
/** Illustration de l'écran de chargement : la maison du Père Noël, son traîneau, ses rennes et ses lutins. */
function heroScene(){
  const g = new THREE.Group();
  const h = scaled(buildModel('hq', 12).group, 1.15); g.add(h);
  g.add(prop('sled', {x: 2.6, z: 2.2, s: 1.3, ry: .9}), prop('reindeer', {x: 3.6, z: 1.2, s: 1.1, ry: .9}), prop('reindeer', {x: 4.3, z: .3, s: 1.1, ry: .9}));
  g.add(giftPile().translateX(1.4).translateZ(2.9), prop('christmas_tree_decorated', {x: -2.4, z: 1.6, s: .9}), prop('snowman_A', {x: -1.2, z: 2.9, s: .45, ry: .5}));
  for (const [x, z, s] of [[-3.6, -1.5, 1.3], [-3.2, .2, 1.1], [3.4, -2.6, 1.4], [-1.5, -3.2, 1.2], [1.2, -3.4, 1.3]]) g.add(prop('tree-snow-a', {x, z, s}));
  for (let v = 0; v < 3; v++){ const c = character('elf', elfLook(v)); c.root.scale.setScalar(.5); c.mixer.update(.5 + v * .3); c.root.position.set(-.4 + v * .9, 0, 2.6 + (v % 2) * .3); c.root.rotation.y = .6 - v * .3; g.add(c.root); }
  const s = character('santa', santaLook(9), {hat: true}); s.root.scale.setScalar(.62); s.mixer.update(.4); s.root.position.set(.5, 0, 2.2); s.root.rotation.y = .5; g.add(s.root);
  return g;
}

/**
 * Rend toutes les images. opts : {DPR, BD, bar, base, extras}
 * Renvoie {SPR: {clé: {canvas, ax, ay, w, h}}, ICON: {clé: canvas}, thumbs: {type: canvas}, portrait, buildIcon, splash?}
 */
export async function bakeAll({DPR, BD, bar = () => {}, base, extras = false}){
  await loadAssets(base, p => bar(p * .55));
  const SPR = {}, ICON = {}, thumbs = {}, models = {};
  const jobs = [];
  for (const type of Object.keys(BUILDINGS)) if (BUILDINGS[type].kind !== 'field') jobs.push(['b:' + type, () => modelFor(type)]);
  jobs.push(['f:empty', () => field(null)], ['b:path2', () => pathTile(2)], ['b:path3', () => pathTile(3)], ['b:wildtree', () => deco('wildtree')], ['b:wildtree2', () => deco('wildtree2')]);
  for (const c of Object.keys(CROPS)) for (const st of [0, 1]) jobs.push([`f:${c}:${st}`, () => field(c, st)]);
  for (const n of [1, 2, 3, 4]) jobs.push(['site:' + n, () => site(n)]);
  jobs.push(['forest:0', () => forest(7)], ['forest:1', () => forest(31)], ['forest:2', () => forest(77)]);
  for (let v = 0; v < 3; v++) jobs.push(['elf:' + v, () => { const c = character('elf', elfLook(v)); c.root.scale.setScalar(.38); c.mixer.update(.5); return c.root; }]);
  for (let i = 0; i < jobs.length; i++){
    const [k, fn] = jobs[i];
    const obj = fn(); if (extras) models[k] = obj;
    SPR[k] = bake(obj, {density: k.startsWith('forest') ? Math.min(DPR, 2) : BD});
    bar(.55 + .35 * (i + 1) / jobs.length);
    if (i % 4 === 3) await new Promise(r => setTimeout(r, 0));
  }
  const url = c => c;
  const iconURL = (obj, size = 56) => url(bakeIcon(obj, size, DPR));
  for (const [k, it] of Object.entries(ITEMS)) ICON[k] = iconURL(pickIcon(k, it.ic));
  ICON.coins = iconURL(coinsModel());
  // mini-jeux
  ICON.mg_sleigh = url(bakeIcon(sleighIcon(), 120, DPR)); ICON.mg_gift = iconURL(prop('present_A_red')); ICON.mg_deer = iconURL(prop('reindeer'));
  ICON.mg_gold = iconURL(goldSnowman()); ICON.mg_elf = (() => { const c = character('elf', elfLook(0)); c.mixer.update(.5); return url(bakeIcon(c.root, 80, DPR)); })();
  ICON.mg_snow = iconURL(prop('snowball_pile'));
    const portrait = (() => { const c = character('santa', santaLook(9), {hat: true}); c.mixer.update(.6); return bust(c.root, 128, DPR); })();
  for (const type of Object.keys(BUILDINGS)) thumbs[type] = url(bakeIcon(type === 'field' ? field('wheat', 1) : modelFor(type), 96, DPR));
  const buildIcon = url(bakeIcon(prop('Wood_Planks_Stack_Medium'), 96, DPR));
  const hero = extras ? heroScene() : null;
  const splash = hero ? bake(hero, {density: 2.4, shadow: true}) : null;
  if (hero) models.splash = hero;
  disposeBaker();
  return {SPR, ICON, thumbs, portrait, buildIcon, splash, models};
}
