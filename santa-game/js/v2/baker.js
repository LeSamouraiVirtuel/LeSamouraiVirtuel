// Pré-rendu de toutes les images du jeu à partir des modèles 3D.
// Utilisé (1) hors ligne par tools/export-pack.mjs pour produire assets/pack/ — c'est ce que charge le téléphone ;
// (2) en secours sur l'appareil si le pack n'est pas disponible.
import * as THREE from 'three';
import {loadAssets, prop, tint, character, elfLook, santaLook} from '../assets.js';
import {buildModel, cabin, plotBase} from '../buildings.js';
import {bake, bakeIcon, free, disposeBaker} from './bake.js';
import * as T from './town.js';
import {pickIcon, coinsModel, pathTile, giftPile} from './models.js';
const {ITEMS, BUILDINGS} = T;
const TIER_LV = [0, 1, 5, 12];   // niveau représentatif de chaque apparence (1 → 4, 5 → 11, 12+)

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
function theater(t){
  const g = new THREE.Group(); g.add(scaled(plotBase(t), .78));
  g.add(prop('stall-red', {x: -.2, z: -.25, y: .27, s: .95}));
  if (t >= 2) g.add(prop('stall-green', {x: .9, z: -.7, y: .27, s: .7, ry: -.6}), prop('banner-red', {x: -1.05, z: .8, y: .27, s: .7}), prop('banner-green', {x: 1.05, z: .8, y: .27, s: .7}));
  if (t >= 3) g.add(prop('lights-colored', {x: 0, z: .3, y: 1.4, s: .9}), prop('nutcracker', {x: -.6, z: .9, y: .27, s: .6}), prop('nutcracker', {x: .6, z: .9, y: .27, s: .6}));
  g.add(prop('bench', {x: -.4, z: 1.0, y: .27, s: .6}), prop('bench', {x: .4, z: 1.0, y: .27, s: .6}), prop('lantern', {x: 1.1, z: 1.1, y: .27, s: .55}));
  return g;
}
/** Grotte aux cristaux : rochers enneigés, wagonnet, coffre de gemmes ; plus riche à chaque apparence. */
function cave(t){
  const g = new THREE.Group(); g.add(scaled(plotBase(t), .78));
  g.add(prop('rocks-large', {x: -.25, z: -.45, y: .27, s: 1.25}), prop('rocks-large', {x: .75, z: -.6, y: .27, s: .9, ry: 1.2}), prop('rocks-medium', {x: -1.05, z: .1, y: .27, s: .9}));
  g.add(prop('cart', {x: .55, z: .65, y: .27, s: .7, ry: -.5}), prop('Gems_Chest', {x: -.45, z: .75, y: .27, s: .45, ry: .4}), prop('lantern', {x: 1.1, z: .1, y: .27, s: .55}));
  if (t >= 2) g.add(prop('Gold_Bars_Stack_Small', {x: .55, z: .65, y: .62, s: .35}), prop('lantern', {x: -1.1, z: .95, y: .27, s: .55}), prop('rocks-small', {x: 1.05, z: 1.05, y: .27, s: .9}));
  if (t >= 3) g.add(prop('lights-colored', {x: -.2, z: -.1, y: 1.15, s: .8}), prop('Gems_Chest', {x: -1.0, z: -.75, y: .27, s: .4, ry: -.6}), prop('Gold_Bars_Stack_Small', {x: .05, z: 1.05, y: .27, s: .4}));
  return g;
}
/** Modèle d'un bâtiment pour une apparence t (1, 2, 3). */
function modelFor(type, t = 1){
  const lv = TIER_LV[t], mk = (k, s = .78) => scaled(buildModel(k, lv).group, s);
  switch (type){
    case 'santa': return mk('hq', 1.02);
    case 'sawmill': return mk('sawmill');
    case 'letters': return mk('post');
    case 'bakery': return mk('bakery');
    case 'mill': return mk('mill');
    case 'storage': return mk('storage');
    case 'workshop': return mk('workshop');
    case 'stable': return mk('stable');
    case 'orders': { const g = mk('wrap'); g.add(prop(t >= 3 ? 'sled-long' : 'sled', {x: 1.1, z: 1.05, s: .8, ry: .6})); if (t >= 2) g.add(prop('reindeer', {x: 1.25, z: -.2, s: .55, ry: .6})); return g; }
    case 'theater': return theater(t);
    case 'mine': return cave(t);
    case 'cabin': return t === 1 ? house(1, .985) : t === 2 ? house(2, .33) : (() => { const g = house(2, .6); g.add(prop('tree-decorated-snow', {x: .75, z: .75, s: .35})); return g; })();
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
  for (const [type, b] of Object.entries(BUILDINGS)){
    if (T.isUpgradable(b)) for (const t of [1, 2, 3]) jobs.push([`b:${type}:${t}`, () => modelFor(type, t)]);
    else jobs.push(['b:' + type, () => modelFor(type)]);
  }
  jobs.push(['b:path2', () => pathTile(2)], ['b:path3', () => pathTile(3)], ['b:wildtree', () => deco('wildtree')], ['b:wildtree2', () => deco('wildtree2')]);
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
  for (const [type, b] of Object.entries(BUILDINGS)){
    thumbs[type] = url(bakeIcon(modelFor(type, 1), 96, DPR));
    if (T.isUpgradable(b)) for (const t of [2, 3]) thumbs[type + ':' + t] = url(bakeIcon(modelFor(type, t), 96, DPR));
  }
  const buildIcon = url(bakeIcon(prop('Wood_Planks_Stack_Medium'), 96, DPR));
  const hero = extras ? heroScene() : null;
  const splash = hero ? bake(hero, {density: 2.4, shadow: true}) : null;
  if (hero) models.splash = hero;
  disposeBaker();
  return {SPR, ICON, thumbs, portrait, buildIcon, splash, models};
}
