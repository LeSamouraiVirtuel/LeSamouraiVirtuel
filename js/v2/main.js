// Le Village du Pôle V2 — « Township de Noël » en 2D isométrique.
// Les modèles 3D sont pré-rendus en images au chargement (bake.js) ; le jeu ne dessine ensuite que des images
// sur un canvas 2D : fluide et net sur téléphone.
import * as THREE from 'three';
import {loadAssets, prop, tint, character, elfLook} from '../assets.js';
import {buildModel, cabin, plotBase} from '../buildings.js';
import {bake, bakeIcon, TW, free, disposeBaker} from './bake.js';
import {createTuto} from '../tuto.js';
import * as T from './town.js';
import {fieldModel, pickIcon, coinsModel, pathTile, giftPile} from './models.js';

const {ITEMS, CROPS, BUILDINGS} = T;
const $ = s => document.querySelector(s);
const BASE = new URL('../../assets/', import.meta.url).href;
const DPR = Math.min(devicePixelRatio || 1, 3);
const ZOOM0 = 1.1;                                   // zoom par défaut : les images y sont affichées pixel pour pixel
const BD = Math.min(DPR * ZOOM0, 3);                // densité du pré-rendu des bâtiments
const TH = TW / 2;

/* =====================================================================
   CHARGEMENT
   ===================================================================== */
const TIPS = ['Astuce : glisse le doigt sur plusieurs champs pour tout récolter d’un coup.', 'Astuce : les commandes du traîneau rapportent beaucoup d’XP.', 'Astuce : les usines travaillent pendant que tu fais autre chose.', 'Astuce : agrandis ta grange avec des planches, des clous et de la peinture.', 'Astuce : les maisons apportent des habitants, nécessaires pour les usines.'];
let tipI = Math.floor(Math.random() * TIPS.length);
const tip = () => { const e = $('#tip'); if (e) e.textContent = TIPS[tipI++ % TIPS.length]; };
tip(); const tipTimer = setInterval(tip, 2600);
const bar = p => { $('#loadbar i').style.width = Math.round(p * 100) + '%'; };
// Cache des images pré-rendues (IndexedDB) : dès la 2e ouverture, le village s'affiche en 1 à 2 secondes.
const CACHE_V = `spr-4:${DPR}:${BD}`;   // à changer quand les modèles ou le rendu changent
const idb = () => new Promise((ok, ko) => { const r = indexedDB.open('vdp-sprites', 1); r.onupgradeneeded = () => r.result.createObjectStore('c'); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
async function cacheGet(){
  try { const db = await idb(); const v = await new Promise((ok, ko) => { const q = db.transaction('c').objectStore('c').get(CACHE_V); q.onsuccess = () => ok(q.result); q.onerror = () => ko(q.error); });
    if (!v) return null;
    const keys = Object.keys(v.spr);
    const bm = await Promise.all(keys.map(k => createImageBitmap(new Blob([v.spr[k].buf], {type: 'image/png'}))));
    keys.forEach((k, i) => { v.spr[k].canvas = bm[i]; delete v.spr[k].buf; });
    return v; } catch(e){ return null; }
}
let cacheAbort = false;
async function cachePut(){
  try { const spr = {};
    for (const [k, o] of Object.entries(SPR)){ const blob = await new Promise(r => o.canvas.toBlob(r)); if (!blob) return; spr[k] = {buf: await blob.arrayBuffer(), ax: o.ax, ay: o.ay, w: o.w, h: o.h}; }
    if (cacheAbort) return;
    const db = await idb(); if (cacheAbort) return; const tx = db.transaction('c', 'readwrite'); const st = tx.objectStore('c'); st.clear(); st.put({spr, urls: {ICON, thumbs, elfPortrait, buildIcon}}, CACHE_V);
  } catch(e){}
}
// garde-fou : si le stockage ne répond pas (certains navigateurs), on n'attend pas plus de 5 s
const within = (pr, ms) => Promise.race([pr, new Promise(r => setTimeout(() => r(null), ms))]);
const cached = await within(cacheGet(), 5000);
if (!cached){ await loadAssets(BASE, p => bar(p * .55)); $('#loadtxt').textContent = 'Préparation du village…'; await new Promise(r => setTimeout(r, 30)); }

/* =====================================================================
   PRÉ-RENDU DES SPRITES
   ===================================================================== */
const SPR = {}, ICON = {};
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
const thumbs = {}; let elfPortrait = '', buildIcon = '';
if (cached){
  Object.assign(SPR, cached.spr); Object.assign(ICON, cached.urls.ICON); Object.assign(thumbs, cached.urls.thumbs);
  elfPortrait = cached.urls.elfPortrait; buildIcon = cached.urls.buildIcon;
} else {
  const jobs = [];
  for (const type of Object.keys(BUILDINGS)) if (BUILDINGS[type].kind !== 'field') jobs.push(['b:' + type, () => modelFor(type)]);
  jobs.push(['f:empty', () => field(null)], ['b:path2', () => pathTile(2)], ['b:path3', () => pathTile(3)], ['b:wildtree', () => deco('wildtree')], ['b:wildtree2', () => deco('wildtree2')]);
  for (const c of Object.keys(CROPS)) for (const st of [0, 1]) jobs.push([`f:${c}:${st}`, () => field(c, st)]);
  for (const n of [1, 2, 3, 4]) jobs.push(['site:' + n, () => site(n)]);
  jobs.push(['forest:0', () => forest(7)], ['forest:1', () => forest(31)], ['forest:2', () => forest(77)]);
  for (let v = 0; v < 3; v++) jobs.push(['elf:' + v, () => { const c = character('elf', elfLook(v)); c.root.scale.setScalar(.38); c.mixer.update(.5); return c.root; }]);
  for (let i = 0; i < jobs.length; i++){
    const [k, fn] = jobs[i];
    SPR[k] = bake(fn(), {density: k.startsWith('forest') ? Math.min(DPR, 2) : BD});
    bar(.55 + .35 * (i + 1) / jobs.length);
    if (i % 4 === 3) await new Promise(r => setTimeout(r, 0));
  }
  const url = c => { const u = c.toDataURL(); free(c); return u; };
  const iconURL = (obj, size = 56) => url(bakeIcon(obj, size, DPR));
  for (const [k, it] of Object.entries(ITEMS)) ICON[k] = iconURL(pickIcon(k, it.ic));
  ICON.coins = iconURL(coinsModel());
  ICON.xp = null;
  elfPortrait = (() => { const c = character('elf', elfLook(1)); c.mixer.update(.6); return url(bakeIcon(c.root, 112, DPR)); })();
  for (const type of Object.keys(BUILDINGS)) thumbs[type] = url(bakeIcon(type === 'field' ? field('wheat', 1) : modelFor(type), 96, DPR));
  buildIcon = url(bakeIcon(prop('Wood_Planks_Stack_Medium'), 96, DPR));
  disposeBaker();
  $('#loadtxt').textContent = 'Finalisation…';
  // les images partent dans la mémoire graphique (ImageBitmap) : les canvas sont libérés
  await within(cachePut(), 8000); cacheAbort = true;
  if (window.createImageBitmap) for (const [k, o] of Object.entries(SPR)){ try { const bm = await createImageBitmap(o.canvas); free(o.canvas); o.canvas = bm; } catch(e){} }
}
clearInterval(tipTimer);
bar(1);
$('#h-coins img').src = ICON.coins;
$('#i-orders').src = thumbs.orders; $('#i-daily').src = thumbs.gifts; $('#i-barn').src = thumbs.barn; $('#i-build').src = buildIcon;

/* =====================================================================
   ÉTAT, SON
   ===================================================================== */
const saved = T.loadTown();
let S = saved || T.newTown();
if (!saved) S.orders[0] = {kid: 'Léa', items: {wheat: 3}, coins: 30, xp: 12};
const save = () => T.saveTown(S);
let actx = null;
function tone(f, d = .12, type = 'sine', v = .06, when = 0){
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch(e){}
}
const sfx = {tap: () => tone(740, .06, 'sine', .04), pop: () => tone(880, .08, 'triangle', .05), collect: () => { tone(988, .1, 'triangle', .05); tone(1319, .14, 'triangle', .05, .06); }, err: () => tone(160, .16, 'sawtooth', .02), level: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .28, 'triangle', .06, i * .08)), build: () => { tone(330, .1, 'square', .03); tone(523, .2, 'triangle', .05, .1); }};

/* =====================================================================
   CAMÉRA & CANVAS
   ===================================================================== */
const cv = $('#c'), ctx = cv.getContext('2d');
let W = 0, H = 0;
const cam = {x: 0, y: 0, z: 1};
function resize(){ W = innerWidth; H = innerHeight; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
addEventListener('resize', resize); resize();
const iso = (tx, ty) => ({x: (tx - ty) * TW / 2, y: (tx + ty) * TH / 2});
const toScreen = (tx, ty) => { const p = iso(tx, ty); return {x: (p.x - cam.x) * cam.z + W / 2, y: (p.y - cam.y) * cam.z + H / 2}; };
function toTile(sx, sy){ const wx = (sx - W / 2) / cam.z + cam.x, wy = (sy - H / 2) / cam.z + cam.y; return {x: wy / TH + wx / TW, y: wy / TH - wx / TW}; }
function centerOn(tx, ty){ const p = iso(tx, ty); cam.x = p.x; cam.y = p.y; }
const startZoom = () => W < 600 ? ZOOM0 : Math.min(1.5, ZOOM0 * W / 600);
cam.z = startZoom(); centerOn(20, 20);

// sol : texture de neige, motif répété
const PAT = Math.round(320 * DPR);   // motif de neige, généré directement en pixels de l'écran
const snowPat = (() => {
  const c = document.createElement('canvas'); c.width = c.height = PAT; const x = c.getContext('2d'), k = DPR;
  const g = x.createLinearGradient(0, 0, PAT, PAT); g.addColorStop(0, '#f3f7fd'); g.addColorStop(.5, '#e9f0fa'); g.addColorStop(1, '#f3f7fd');
  x.fillStyle = g; x.fillRect(0, 0, PAT, PAT);
  const wrap = f => { for (const dx of [-PAT, 0, PAT]) for (const dy of [-PAT, 0, PAT]){ x.save(); x.translate(dx, dy); f(); x.restore(); } };
  const R = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 70; i++){ const px = R(0, PAT), py = R(0, PAT), rx = R(14, 46) * k, ry = R(5, 14) * k, c1 = `rgba(${R(140, 175) | 0},${R(170, 200) | 0},236,${R(.06, .14)})`;
    wrap(() => { const gr = x.createRadialGradient(px, py, 0, px, py, rx); gr.addColorStop(0, c1); gr.addColorStop(1, 'rgba(160,190,236,0)'); x.fillStyle = gr; x.beginPath(); x.ellipse(px, py, rx, ry, 0, 0, 7); x.fill(); }); }
  for (let i = 0; i < 40; i++){ const px = R(0, PAT), py = R(0, PAT), w = R(20, 60) * k;
    wrap(() => { x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.5 * k; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + w / 2, py - 4 * k, px + w, py); x.stroke();
      x.strokeStyle = 'rgba(150,175,220,.18)'; x.beginPath(); x.moveTo(px, py + 2 * k); x.quadraticCurveTo(px + w / 2, py - 2 * k, px + w, py + 2 * k); x.stroke(); }); }
  for (let i = 0; i < 260; i++){ x.fillStyle = `rgba(255,255,255,${R(.6, 1)})`; const r = R(.5, 1.3) * k; x.beginPath(); x.arc(R(0, PAT), R(0, PAT), r, 0, 7); x.fill(); }
  for (let i = 0; i < 30; i++){ x.fillStyle = 'rgba(190,225,255,.9)'; x.fillRect(R(0, PAT), R(0, PAT), 1.2 * k, 1.2 * k); }
  return ctx.createPattern(c, 'repeat');
})();

/* =====================================================================
   RÈGLES APPLIQUÉES (actions du joueur)
   ===================================================================== */
const B = o => BUILDINGS[o.type];
const now = () => Date.now();
function cropStage(o){ if (!o.crop) return null; return now() >= o.ready ? 1 : 0; }
function spriteKey(o){
  if (o.build) return 'site:' + Math.min(4, B(o).w);
  if (B(o).kind === 'field') return o.crop ? `f:${o.crop}:${cropStage(o)}` : 'f:empty';
  if (o.type === 'path') return ['b:path', 'b:path2', 'b:path3'][(o.x * 7 + o.y * 13) % 3];
  if (o.wild) return (o.x + o.y) % 3 ? 'b:wildtree' : 'b:wildtree2';
  return 'b:' + o.type;
}
function gainXp(n, from){
  const up = T.addXp(S, n);
  if (from) fly('xp', n, from);
  if (up) setTimeout(levelUp, 500);
}
function harvest(o, at){
  if (!o.crop || now() < o.ready) return false;
  if (T.barnFull(S, 2)){ toastOnce('La grange est pleine ! Livre des commandes ou agrandis-la.'); return false; }
  const k = o.crop; o.crop = null; T.give(S, k, 2); S.stats.harvest++; T.track(S, 'harvest:' + k);
  fly(k, 2, at); gainXp(ITEMS[k].xp, null);
  if (Math.random() < T.dropChance){ const m = T.DROPS[Math.floor(Math.random() * (S.lvl >= 3 ? 5 : 3))]; T.give(S, m); setTimeout(() => fly(m, 1, at), 250); }
  sfx.collect(); tutoEv('harvest'); return true;
}
function plant(o, crop, at){
  if (o.crop || o.build) return false;
  const c = CROPS[crop];
  if (S.coins < c.cost){ toastOnce('Pas assez de pièces'); return false; }
  S.coins -= c.cost; o.crop = crop; o.ready = now() + c.time * 1000; T.track(S, 'plant:' + crop); sfx.pop(); tutoEv('plant'); return true;
}
function penTap(o, at){
  const b = B(o);
  if (o.ready && now() >= o.ready){ // récolte des produits
    if (T.barnFull(S, b.slots)){ toast('La grange est pleine !'); return; }
    T.give(S, b.prod, b.slots); T.track(S, 'collect:' + b.prod, b.slots); o.ready = 0; fly(b.prod, b.slots, at); gainXp(ITEMS[b.prod].xp * b.slots, at); sfx.collect(); tutoEv('collectPen'); return;
  }
  if (o.ready){ toast(`${b.name} : encore ${fmtTime((o.ready - now()) / 1000)}`); return; }
  if ((S.inv[b.feed] || 0) < b.slots){ sfx.err(); toast(`Il faut ${b.slots} ${ITEMS[b.feed].name.toLowerCase()} pour nourrir les animaux`); return; }
  T.take(S, {[b.feed]: b.slots}); o.ready = now() + b.ptime * 1000; sfx.pop(); toast(`Animaux nourris ! Prêt dans ${fmtTime(b.ptime)}`); tutoEv('feed');
}
function factoryCollect(o, at){
  const done = (o.q || []).filter(j => j.end <= now());
  if (!done.length) return false;
  const got = new Set();
  for (const j of done){ if (T.barnFull(S)){ toastOnce('La grange est pleine !'); break; } T.give(S, j.item); got.add(j); gainXp(ITEMS[j.item].xp, null); fly(j.item, 1, at); S.stats.made++; T.track(S, 'make:' + j.item); }
  o.q = o.q.filter(j => !got.has(j));
  if (got.size){ sfx.collect(); tutoEv('collectFactory'); }
  return true;
}
function queueRecipe(o, item){
  const r = B(o).recipes[item];
  if (S.lvl < r.lvl){ sfx.err(); toast(`Niveau ${r.lvl} requis`); return; }
  o.q = o.q || [];
  if (o.q.length >= (o.slots || 3)){ sfx.err(); toast('File pleine'); return; }
  if (!T.has(S, r.in)){ sfx.err(); toast('Il manque des ingrédients'); return; }
  T.take(S, r.in);
  const start = Math.max(now(), o.q.length ? o.q[o.q.length - 1].end : 0);
  o.q.push({item, end: start + r.time * 1000}); sfx.pop(); tutoEv('queue'); renderPanel();
}
function deliver(i, el){
  const od = S.orders[i]; if (!od?.items) return;
  if (!T.has(S, od.items)){ sfx.err(); toast('Il te manque des produits'); return; }
  T.take(S, od.items); S.coins += od.coins; fly('coins', od.coins, el); gainXp(od.xp, el);
  if (od.mat){ T.give(S, od.mat); setTimeout(() => fly(od.mat, 1, el), 300); }
  S.stats.orders++; T.track(S, 'orders'); S.orders[i] = {wait: now() + 12000}; sfx.level(); tutoEv('deliver'); save(); renderPanel();
}
function refreshOrders(){
  for (let i = 0; i < 9; i++){ const o = S.orders[i]; if (o?.wait && now() >= o.wait) S.orders[i] = T.makeOrder(S, i); }
}
function finishBuilds(){
  for (const o of S.objs) if (o.build && now() >= o.build){ delete o.build; gainXp(Math.max(5, Math.round(T.buildCost(S, o.type) / 12)), null); sfx.level(); toast(`${B(o).name} construit !`); tutoEv('built'); }
}

/* =====================================================================
   RENDU
   ===================================================================== */
const flakes = Array.from({length: 70}, () => ({x: Math.random(), y: Math.random(), s: .5 + Math.random(), v: .3 + Math.random() * .5}));
let ghost = null;          // placement en cours {type, x, y, move?: obj}
let selObj = null;
function objScreenRect(o){
  const spr = SPR[spriteKey(o)], b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2);
  return {left: c.x - spr.ax * cam.z, top: c.y - spr.ay * cam.z, width: spr.w * cam.z, height: spr.h * cam.z, cx: c.x, cy: c.y};
}
function fits(type, x, y, ignore){
  const b = BUILDINGS[type];
  for (let i = 0; i < b.w; i++) for (let j = 0; j < b.h; j++){
    const tx = x + i, ty = y + j;
    if (tx < 0 || ty < 0 || tx >= T.MAP || ty >= T.MAP) return false;
    if (!S.chunks.includes(`${Math.floor(tx / T.CHUNK)},${Math.floor(ty / T.CHUNK)}`)) return false;
  }
  for (const o of S.objs){ if (o === ignore) continue; const ob = B(o); if (x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y) return false; }
  return true;
}
function diamond(x, y, w, h, fill, stroke){
  const a = toScreen(x, y), b = toScreen(x + w, y), c = toScreen(x + w, y + h), d = toScreen(x, y + h);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
  if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}
function drawSprite(key, cx, cy, alpha = 1){
  const s = SPR[key]; if (!s) return;
  // positions alignées sur les pixels de l'écran : pas de flou de rééchantillonnage
  const x = Math.round((cx - s.ax * cam.z) * DPR) / DPR, y = Math.round((cy - s.ay * cam.z) * DPR) / DPR, w = s.w * cam.z, h = s.h * cam.z;
  if (x > W || y > H || x + w < 0 || y + h < 0) return; // hors écran
  ctx.globalAlpha = alpha;
  ctx.drawImage(s.canvas, x, y, w, h);
  ctx.globalAlpha = 1;
}
const bubbleImgs = {};
const img = url => { if (!bubbleImgs[url]){ const i = new Image(); i.src = url; bubbleImgs[url] = i; } return bubbleImgs[url]; };
function bubble(cx, cy, key, label){
  const r = 22 * Math.min(1.2, Math.max(.8, cam.z));
  ctx.save(); ctx.translate(cx, cy - r - 6 + Math.sin(performance.now() / 300) * 3);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(-r, -r, r * 2, r * 2, r * .45); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, r - 1); ctx.lineTo(0, r + 8); ctx.lineTo(6, r - 1); ctx.fill(); ctx.stroke();
  ctx.fillRect(-6, r - 4, 12, 4);
  const im = img(ICON[key] || ICON.coins); if (im.complete) ctx.drawImage(im, -r * .8, -r * .8, r * 1.6, r * 1.6);
  if (label){ ctx.font = '400 14px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a0e'; ctx.strokeText(label, r * .7, r * .9); ctx.fillStyle = '#fff'; ctx.fillText(label, r * .7, r * .9); }
  ctx.restore();
}
function timerPill(cx, cy, text, prog){
  ctx.save(); ctx.translate(cx, cy);
  ctx.font = '400 13px "Lilita One", sans-serif'; const w = Math.max(64, ctx.measureText(text).width + 20);
  ctx.fillStyle = '#fff6da'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-w / 2, -26, w, 26, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-w / 2 + 6, -9, w - 12, 5); ctx.fillStyle = '#4cc85a'; ctx.fillRect(-w / 2 + 6, -9, (w - 12) * Math.max(0, Math.min(1, prog)), 5);
  ctx.fillStyle = '#6b3f1e'; ctx.textAlign = 'center'; ctx.fillText(text, 0, -12);
  ctx.restore();
}
function draw(){
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.imageSmoothingQuality = 'high';
  // sol
  // sol : motif en pixels réels (transformation identité), qui suit la caméra
  { const o0 = toScreen(0, 0), ox = Math.round(o0.x * DPR) % PAT, oy = Math.round(o0.y * DPR) % PAT; ctx.save(); ctx.setTransform(1, 0, 0, 1, ox, oy); ctx.fillStyle = snowPat; ctx.fillRect(-ox - PAT, -oy - PAT, cv.width + PAT * 2, cv.height + PAT * 2); ctx.restore(); }
  // terrain ouvert : léger liseré pour marquer la limite
  for (const k of S.chunks){ const [cx, cy] = k.split(',').map(Number); diamond(cx * T.CHUNK, cy * T.CHUNK, T.CHUNK, T.CHUNK, 'rgba(255,255,255,.35)', null); }
  // forêts : zones verrouillées + bordure de carte
  const items = [];
  const n = T.MAP / T.CHUNK;
  for (let cx = -1; cx <= n; cx++) for (let cy = -1; cy <= n; cy++){
    if (S.chunks.includes(`${cx},${cy}`)) continue;
    items.push({d: (cx + cy + 1) * T.CHUNK, f: () => { const c = toScreen((cx + .5) * T.CHUNK, (cy + .5) * T.CHUNK); drawSprite('forest:' + Math.abs((cx * 7 + cy * 3) % 3), c.x, c.y); if (cx >= 0 && cy >= 0 && cx < n && cy < n && isNextToOpen(cx, cy)) sign(c.x, c.y, cx, cy); }});
  }
  // allées : posées au sol, avant tout le reste
  for (const o of S.objs) if (o.type === 'path' && ghost?.move !== o) drawObj(o);
  for (const o of S.objs){
    const b = B(o);
    if (ghost?.move === o || o.type === 'path') continue;
    items.push({d: o.x + o.y + (b.w + b.h) / 2, f: () => drawObj(o)});
  }
  for (const e of elves) items.push({d: e.x + e.y, f: () => drawElf(e)});
  if (ghost){ const b = BUILDINGS[ghost.type]; items.push({d: ghost.x + ghost.y + (b.w + b.h) / 2 + .01, f: () => { const ok = fits(ghost.type, ghost.x, ghost.y, ghost.move); diamond(ghost.x, ghost.y, b.w, b.h, ok ? 'rgba(80,220,100,.35)' : 'rgba(255,60,60,.35)', ok ? '#2fae48' : '#d81f33'); const c = toScreen(ghost.x + b.w / 2, ghost.y + b.h / 2); drawSprite(ghost.move ? spriteKey(ghost.move) : 'b:' + ghost.type, c.x, c.y, .85); }}); }
  items.sort((a, b) => a.d - b.d);
  for (const it of items) it.f();
  // noms des bâtiments, puis indicateurs au-dessus
  for (const o of S.objs) plate(o);
  for (const o of S.objs) drawHint(o);
  // neige qui tombe
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const f of flakes){ ctx.beginPath(); ctx.arc(f.x * W, f.y * H, f.s * 1.6, 0, 7); ctx.fill(); }
  // vignette : bords légèrement assombris, le regard va au centre
  ctx.drawImage(vignette(), 0, 0, W, H);
}
let vig = null, vigW = 0, vigH = 0;
function vignette(){ // calculée une fois en petite taille, puis étirée (dégradé doux : aucun flou visible)
  if (vigW !== W || vigH !== H){ vigW = W; vigH = H; vig = document.createElement('canvas'); vig.width = 128; vig.height = Math.round(128 * H / W); const x = vig.getContext('2d'), w = vig.width, h = vig.height;
    const g = x.createRadialGradient(w / 2, h * .45, Math.min(w, h) * .35, w / 2, h * .45, Math.hypot(w, h) * .62); g.addColorStop(0, 'rgba(20,30,70,0)'); g.addColorStop(1, 'rgba(20,30,70,.28)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  return vig;
}
const PLATE = new Set(['factory', 'pen', 'orders', 'barn', 'hq', 'town']);
function plate(o){
  const b = B(o); if (!PLATE.has(b.kind) || cam.z < .7 || o.build) return;
  const p = toScreen(o.x + b.w, o.y + b.h);
  if (p.x < -100 || p.x > W + 100 || p.y < -40 || p.y > H + 40) return;
  const label = b.name;
  ctx.save(); ctx.translate(p.x, p.y - 12);
  ctx.font = '400 13px "Lilita One", sans-serif'; const w = ctx.measureText(label).width + 18;
  ctx.fillStyle = 'rgba(28,24,40,.78)'; ctx.beginPath(); ctx.roundRect(-w / 2, -11, w, 22, 6); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 1);
  ctx.restore();
}
const isOpen = (cx, cy) => S.chunks.includes(`${cx},${cy}`);
const isNextToOpen = (cx, cy) => isOpen(cx - 1, cy) || isOpen(cx + 1, cy) || isOpen(cx, cy - 1) || isOpen(cx, cy + 1);
function sign(x, y, cx, cy){
  ctx.save(); ctx.translate(x, y - 10);
  ctx.fillStyle = '#c98a4b'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(-30, -22, 60, 30, 8); ctx.fill(); ctx.stroke();
  ctx.font = '400 15px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeText('À VENDRE', 0, -2); ctx.fillStyle = '#fff'; ctx.fillText('À VENDRE', 0, -2);
  ctx.restore();
}
function drawObj(o){
  const b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2);
  if (selObj === o) diamond(o.x, o.y, b.w, b.h, 'rgba(255,214,90,.35)', '#ffc83a');
  drawSprite(spriteKey(o), c.x, c.y);
}
function drawHint(o){
  const b = B(o); if (ghost?.move === o) return;
  const r = objScreenRect(o), top = r.top + 10;
  if (r.cx < -60 || r.cx > W + 60 || top < -60 || r.cy > H + 80) return;
  if (o.build){ const total = (o.btotal || 1); timerPill(r.cx, top, fmtTime((o.build - now()) / 1000), 1 - (o.build - now()) / total); return; }
  if (b.kind === 'pen'){ if (o.ready && now() >= o.ready) bubble(r.cx, top, b.prod); else if (!o.ready) bubble(r.cx, top, b.feed, '?'); else timerPill(r.cx, top, fmtTime((o.ready - now()) / 1000), 1 - (o.ready - now()) / (b.ptime * 1000)); }
  if (b.kind === 'factory' && o.q?.length){ const d = o.q.filter(j => j.end <= now()); if (d.length) bubble(r.cx, top, d[0].item, d.length > 1 ? 'x' + d.length : ''); else { const j = o.q[0]; timerPill(r.cx, top, fmtTime((j.end - now()) / 1000), 1 - (j.end - now()) / (B(o).recipes[j.item].time * 1000)); } }
  if (b.kind === 'orders'){ const ok = S.orders.some(od => od.items && T.has(S, od.items)); if (ok) bubble(r.cx, top, 'coins', '!'); }
}

/* ---------- lutins qui se promènent ---------- */
const elfSprites = [0, 1, 2].map(v => SPR['elf:' + v]);
const elves = Array.from({length: 9}, (_, i) => ({x: 13 + i * 2, y: 22, tx: 13 + i * 2, ty: 22, v: i % 3, wait: Math.random() * 3}));
function moveElves(dt){
  for (const e of elves){
    const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy);
    if (d < .05){ e.wait -= dt; if (e.wait <= 0){ // les lutins marchent le long des allées, d'une dalle voisine à l'autre
        const here = S.objs.filter(o => o.type === 'path' && Math.abs(o.x + .5 - e.x) + Math.abs(o.y + .5 - e.y) <= 1.6 && !(Math.abs(o.x + .5 - e.x) < .1 && Math.abs(o.y + .5 - e.y) < .1));
        const all = here.length ? here : S.objs.filter(o => o.type === 'path');
        if (all.length){ const t = all[Math.floor(Math.random() * all.length)]; e.tx = t.x + .5; e.ty = t.y + .5; e.wait = Math.random() < .15 ? 1 + Math.random() * 3 : 0; } } }
    else { const st = Math.min(d, dt * .9); e.x += dx / d * st; e.y += dy / d * st; }
    e.walk = d >= .05;
  }
}
function drawElf(e){ const c = toScreen(e.x, e.y), s = elfSprites[e.v]; const bob = e.walk ? Math.abs(Math.sin(performance.now() / 120)) * 3 : 0; ctx.save(); if (e.tx - e.x > 0 === e.ty - e.y < 0){ ctx.translate(c.x, 0); ctx.scale(-1, 1); ctx.translate(-c.x, 0); } ctx.drawImage(s.canvas, c.x - s.ax * cam.z, c.y - s.ay * cam.z - bob, s.w * cam.z, s.h * cam.z); ctx.restore(); }

/* =====================================================================
   TOUCHER : déplacer la vue, glisser pour récolter/planter, placer
   ===================================================================== */
const ptrs = new Map(); let drag = null;
function objAt(sx, sy){
  const t = toTile(sx, sy);
  // d'abord l'emprise au sol, puis la silhouette des bâtiments (du plus proche au plus lointain)
  let best = null;
  for (const o of S.objs){ const b = B(o); if (t.x >= o.x && t.x < o.x + b.w && t.y >= o.y && t.y < o.y + b.h){ if (!best || o.x + o.y > best.x + best.y) best = o; } }
  if (best) return best;
  const sorted = [...S.objs].sort((a, b) => (b.x + b.y) - (a.x + a.y));
  for (const o of sorted){ if (B(o).kind === 'field' || B(o).kind === 'deco') continue; const r = objScreenRect(o); if (sx > r.left + r.width * .2 && sx < r.left + r.width * .8 && sy > r.top + r.height * .1 && sy < r.cy) return o; }
  return null;
}
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
  if (ptrs.size === 2){ const [a, b] = [...ptrs.values()]; drag = {mode: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y), z0: cam.z}; return; }
  const o = objAt(e.clientX, e.clientY);
  drag = {mode: 'pan', sx: e.clientX, sy: e.clientY, moved: 0, obj: o};
  if (ghost){ const t = toTile(e.clientX, e.clientY), b = BUILDINGS[ghost.type]; if (t.x >= ghost.x - .5 && t.x <= ghost.x + b.w + .5 && t.y >= ghost.y - .5 && t.y <= ghost.y + b.h + .5) drag.mode = 'ghost'; return; }
  if (seedTool){ drag.mode = 'plant'; if (o && B(o).kind === 'field') plant(o, seedTool, {x: e.clientX, y: e.clientY}); return; }
  if (o && B(o).kind === 'field' && o.crop && now() >= o.ready){ drag.mode = 'harvest'; harvest(o, {x: e.clientX, y: e.clientY}); }
});
addEventListener('pointermove', e => {
  const p = ptrs.get(e.pointerId); if (!p || !drag) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (drag.mode === 'pinch' && ptrs.size === 2){ const [a, b] = [...ptrs.values()]; cam.z = Math.max(.55, Math.min(1.7, drag.z0 * Math.hypot(a.x - b.x, a.y - b.y) / drag.d0)); return; }
  drag.moved += Math.abs(dx) + Math.abs(dy);
  if (drag.mode === 'pan'){ cam.x -= dx / cam.z; cam.y -= dy / cam.z; clampCam(); return; }
  if (drag.mode === 'ghost'){ const t = toTile(e.clientX, e.clientY), b = BUILDINGS[ghost.type]; ghost.x = Math.round(t.x - b.w / 2); ghost.y = Math.round(t.y - b.h / 2); updateGhostUI(); return; }
  const o = objAt(e.clientX, e.clientY);
  if (o && B(o).kind === 'field'){ if (drag.mode === 'harvest') harvest(o, {x: e.clientX, y: e.clientY}); if (drag.mode === 'plant') plant(o, seedTool, {x: e.clientX, y: e.clientY}); }
});
const endPtr = e => {
  ptrs.delete(e.pointerId); if (!drag || ptrs.size) return;
  const d = drag; drag = null;
  if (d.mode === 'plant'){ if (S.objs.some(o => o.crop && o.ready > now())) tutoEv('planted'); if (d.fromSeed && d.moved < 10) return; if (d.moved > 10 || !d.obj || B(d.obj).kind !== 'field') closeSeeds(); return; }
  if (d.mode === 'pan' && d.moved < 10 && e.type === 'pointerup') tap(d.obj, {x: e.clientX, y: e.clientY});
};
addEventListener('pointerup', endPtr); addEventListener('pointercancel', endPtr);
cv.addEventListener('wheel', e => { e.preventDefault(); cam.z = Math.max(.55, Math.min(1.7, cam.z * (1 - e.deltaY * .001))); }, {passive: false});
function clampCam(){ const c = iso(T.MAP / 2, T.MAP / 2), r = T.MAP * TW * .45; cam.x = Math.max(c.x - r, Math.min(c.x + r, cam.x)); cam.y = Math.max(c.y - r * .5 - 200, Math.min(c.y + r * .5 + 200, cam.y)); }

function tap(o, at){
  sfx.tap();
  if (!o){
    const t = toTile(at.x, at.y), cx = Math.floor(t.x / T.CHUNK), cy = Math.floor(t.y / T.CHUNK);
    if (cx >= 0 && cy >= 0 && cx < T.MAP / T.CHUNK && cy < T.MAP / T.CHUNK && !isOpen(cx, cy) && isNextToOpen(cx, cy)) return openPanel('expand', {cx, cy});
    selObj = null; closePanel(); return;
  }
  selObj = o;
  const b = B(o);
  if (o.build) return openPanel('site', o);
  if (b.kind === 'field'){ if (!o.crop) openSeeds(o); else if (now() < o.ready) toast(`${ITEMS[o.crop].name} : prêt dans ${fmtTime((o.ready - now()) / 1000)}`); return; }
  if (b.kind === 'pen') return penTap(o, at);
  if (b.kind === 'factory'){ if (factoryCollect(o, at)) return; return openPanel('factory', o); }
  if (b.kind === 'orders') return openPanel('orders');
  if (b.kind === 'barn') return openPanel('barn');
  openPanel('info', o);
}

/* =====================================================================
   INTERFACE
   ===================================================================== */
const fmt = n => { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n); };
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60; return h ? `${h}h ${String(m).padStart(2, '0')}` : m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`; };
const icon = k => `<img class="i" src="${ICON[k]}" alt="">`;
let toastT;
function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
let lastToast = 0; const toastOnce = m => { if (now() - lastToast > 1500){ lastToast = now(); toast(m); sfx.err(); } };
function fly(k, n, from){
  const target = k === 'coins' ? $('#h-coins') : k === 'xp' ? $('#xpbar') : $('#b-barn');
  const r0 = from?.getBoundingClientRect ? from.getBoundingClientRect() : {left: (from?.x ?? W / 2) - 10, top: (from?.y ?? H / 2) - 10, width: 20, height: 20};
  const tr = target.getBoundingClientRect();
  const cnt = Math.min(5, Math.max(1, Math.round(Math.log2(n + 1))));
  for (let i = 0; i < cnt; i++){
    const d = document.createElement(k === 'xp' ? 'i' : 'img'); if (k !== 'xp') d.src = ICON[k]; d.className = 'fly' + (k === 'xp' ? ' xp' : ''); document.body.appendChild(d);
    const x0 = r0.left + r0.width / 2 - 18 + (Math.random() - .5) * 30, y0 = r0.top + r0.height / 2 - 18;
    d.style.transform = `translate(${x0}px,${y0}px) scale(.5)`;
    setTimeout(() => { d.style.transform = `translate(${x0}px,${y0 - 40}px) scale(1)`; }, 16);
    setTimeout(() => { d.style.transition = 'transform .5s cubic-bezier(.6,-0.2,.7,1), opacity .5s'; d.style.transform = `translate(${tr.left + tr.width / 2 - 18}px,${tr.top}px) scale(.6)`; }, 250 + i * 60);
    setTimeout(() => { d.remove(); target.classList.remove('pulse'); void target.offsetWidth; target.classList.add('pulse'); }, 780 + i * 60);
  }
  if (k !== 'xp'){ const t = document.createElement('div'); t.className = 'plusnum'; t.textContent = '+' + fmt(n); document.body.appendChild(t); t.style.left = (r0.left + r0.width / 2) + 'px'; t.style.top = r0.top + 'px'; setTimeout(() => t.remove(), 1000); }
}
function hud(){
  $('#h-lvl').textContent = S.lvl;
  $('#xpbar i').style.width = Math.min(100, S.xp / T.xpNeed(S.lvl) * 100) + '%';
  $('#xpbar b').textContent = `${fmt(S.xp)} / ${fmt(T.xpNeed(S.lvl))}`;
  $('#h-coins b').textContent = fmt(S.coins);
  $('#h-stars b').textContent = fmt(S.stars);
  $('#h-pop').textContent = `${T.pop(S)} / ${T.popCap(S)}`;
  $('#b-barn small').textContent = `${T.barnUsed(S)}/${T.barnCap(S)}`;
  $('#b-barn').classList.toggle('full', T.barnUsed(S) >= T.barnCap(S));
  const ready = S.orders.filter(od => od.items && T.has(S, od.items)).length;
  const bd = $('#b-orders .badge'); bd.textContent = ready; bd.hidden = !ready;
  $('#b-daily .badge').hidden = !T.dailyReady(S);
  renderQuest();
}

/* ---------- graines (plateau qui apparaît quand on touche un champ vide) ---------- */
let seedTool = null;
function openSeeds(o){
  const el = $('#seeds');
  el.innerHTML = Object.entries(CROPS).map(([k, c]) => { const lock = S.lvl < c.lvl;
    return `<button class="seed ${lock ? 'locked' : ''}" data-crop="${k}" ${lock ? 'disabled' : ''}><img src="${ICON[k]}" alt="" draggable="false"><b>${lock ? 'Niv. ' + c.lvl : fmtTime(c.time)}</b>${c.cost && !lock ? `<small>${icon('coins')}${c.cost}</small>` : ''}</button>`; }).join('');
  el.hidden = false; seedTool = null; document.body.classList.add('seeding');
  el.querySelectorAll('.seed').forEach(b => b.addEventListener('pointerdown', ev => { selectSeed(b.dataset.crop); plant(o, b.dataset.crop, {x: ev.clientX, y: ev.clientY}); ptrs.set(ev.pointerId, {x: ev.clientX, y: ev.clientY}); drag = {mode: 'plant', moved: 0, obj: o, fromSeed: true}; }));
  $('#seedhint').hidden = false; tutoEv('seeds');
}
function selectSeed(k){ seedTool = k; document.querySelectorAll('.seed').forEach(b => b.classList.toggle('on', b.dataset.crop === k)); $('#seedhint').textContent = `Glisse sur les champs vides pour planter : ${ITEMS[k].name.toLowerCase()}`; }
function closeSeeds(){ document.body.classList.remove('seeding'); seedTool = null; $('#seeds').hidden = true; $('#seedhint').hidden = true; $('#seedhint').textContent = 'Choisis une graine, puis glisse sur les champs'; }

/* ---------- panneaux ---------- */
let panel = null, panelArg = null, panelHtml = '';
function openPanel(name, arg){ closeSeeds(); panel = name; panelArg = arg; panelHtml = ''; document.body.classList.add('sheet-open'); renderPanel(); tutoEv('open:' + name); }
function closePanel(){ const was = panel; panel = null; panelHtml = ''; document.body.classList.remove('sheet-open'); selObj = null; if (was) tutoEv('close'); }
const hd = (small, title) => `<div class="hd"><div class="tt"><small>${small}</small><h2>${title}</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>`;
const need = req => Object.entries(req).map(([k, n]) => `<span class="need ${(S.inv[k] || 0) >= n ? 'have' : ''}"><img src="${ICON[k]}" alt=""><b>${S.inv[k] || 0}/${n}</b></span>`).join('');
function renderPanel(){
  if (!panel) return;
  let h = '';
  if (panel === 'orders'){
    h = hd('Commandes des enfants', 'Bureau du traîneau') + `<div class="orders">${S.orders.map((od, i) => od.items ? `<div class="order ${T.has(S, od.items) ? 'ok' : ''}"><small>${od.kid}</small><div class="lines">${need(od.items)}</div>
      <div class="rw"><span>${icon('coins')}${od.coins}</span><span><i class="i xp">XP</i>${od.xp}</span>${od.mat ? `<span><img class="i" src="${ICON[od.mat]}" alt="">1</span>` : ''}</div>
      <div class="ob"><button class="btn green sm" data-a="deliver" data-i="${i}" ${T.has(S, od.items) ? '' : 'disabled'}>Livrer</button><button class="mini" data-a="trash" data-i="${i}" aria-label="Remplacer">✕</button></div></div>`
      : `<div class="order wait"><small>Nouvelle commande</small><b data-until="${od.wait}"></b></div>`).join('')}</div>`;
  }
  else if (panel === 'factory'){
    const o = panelArg, b = B(o), q = o.q || [];
    const slots = Array.from({length: o.slots || 3}, (_, i) => q[i] ? `<div class="slot ${q[i].end <= now() ? 'ready' : i === 0 || q[i - 1].end <= now() ? 'run' : ''}"><img src="${ICON[q[i].item]}" alt="">${q[i].end > now() && (i === 0 || q[i - 1].end <= now()) ? `<small data-until="${q[i].end}"></small>` : ''}</div>` : '<div class="slot empty"></div>').join('');
    h = hd('Usine', b.name) + `<p>${b.desc}</p><h3>File de production</h3><div class="slots">${slots}</div>
      ${q.some(j => j.end <= now()) ? '<button class="btn gold wide" data-a="fcollect">Récupérer</button>' : ''}
      <h3>Recettes</h3><div class="recipes">${Object.entries(b.recipes).map(([k, r]) => { const lock = S.lvl < r.lvl;
        return `<button class="recipe ${lock ? 'locked' : ''} ${!lock && T.has(S, r.in) ? 'ok' : ''}" data-a="queue" data-k="${k}"><img src="${ICON[k]}" alt=""><b>${ITEMS[k].name}</b>
        ${lock ? `<span class="why">Niveau ${r.lvl}</span>` : `<span class="lines">${need(r.in)}</span><span class="meta">${fmtTime(r.time)} · ${icon('coins')}${ITEMS[k].v}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'barn'){
    const up = T.barnUpCost(S), list = Object.entries(S.inv).filter(([k, n]) => n > 0);
    h = hd(`Grange · ${T.barnUsed(S)} / ${T.barnCap(S)}`, 'Grange') + `<h3>Récoltes et produits</h3><div class="stock">${list.filter(([k]) => !ITEMS[k].mat).map(([k, n]) => `<div class="st"><img src="${ICON[k]}" alt=""><b>${n}</b><small>${ITEMS[k].name}</small></div>`).join('') || '<p class="meta">Vide</p>'}</div>
      <h3>Matériaux</h3><div class="stock">${Object.keys(ITEMS).filter(k => ITEMS[k].mat).map(k => `<div class="st"><img src="${ICON[k]}" alt=""><b>${S.inv[k] || 0}</b><small>${ITEMS[k].name}</small></div>`).join('')}</div>
      <h3>Agrandir la grange (+25 places)</h3><div class="lines">${need(up)}</div><button class="btn green wide" data-a="barnup" ${T.has(S, up) ? '' : 'disabled'}>Agrandir</button>
      <p class="meta">Les matériaux tombent parfois en récoltant et en livrant les commandes.</p>`;
  }
  else if (panel === 'build'){
    const cat = panelArg || 'farm';
    h = hd('Construire', 'Construire') + `<div class="tabs">${T.CATS.map(([k, l]) => `<button class="${k === cat ? 'on' : ''}" data-a="cat" data-k="${k}">${l}</button>`).join('')}</div>
      <div class="grid">${Object.entries(BUILDINGS).filter(([k, b]) => b.cat === cat).map(([k, b]) => { const why = T.buildBlock(S, k), hard = why && why !== 'Pas assez de pièces';
        return `<button class="card ${hard ? 'locked' : ''}" data-a="place" data-k="${k}"><img src="${thumbs[k]}" alt=""><b>${b.name}</b><span class="meta">${b.desc}</span>${hard ? `<span class="why">${why}</span>` : `<span class="costs"><span class="chip ${S.coins < T.buildCost(S, k) ? 'bad' : ''}">${icon('coins')}${fmt(T.buildCost(S, k))}</span>${b.time ? `<span class="chip time">${fmtTime(b.time)}</span>` : ''}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'expand'){
    const {cx, cy} = panelArg, n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n);
    const ok = S.coins >= c.coins && (S.inv.axe || 0) >= c.axe && (S.inv.saw || 0) >= c.saw;
    h = hd('Agrandir le village', 'Nouveau terrain') + `<p>Dégage cette forêt pour agrandir ton village de 121 cases.</p><div class="lines">${need({axe: c.axe, saw: c.saw})}<span class="need ${S.coins >= c.coins ? 'have' : ''}"><img src="${ICON.coins}" alt=""><b>${fmt(c.coins)}</b></span></div>
      <button class="btn green wide" data-a="expand" ${ok ? '' : 'disabled'}>Agrandir</button><p class="meta">Les haches et les scies s'obtiennent en récoltant et en livrant les commandes du traîneau.</p>`;
  }
  else if (panel === 'site'){
    const o = panelArg, left = Math.max(0, (o.build - now()) / 1000), st = Math.max(1, Math.ceil(left / 60));
    h = hd('Chantier', B(o).name) + `<div class="work"><div class="bar"><i style="width:${Math.min(100, (1 - left * 1000 / (o.btotal || 1)) * 100)}%"></i></div><span>Encore <b data-until="${o.build}"></b></span></div>
      <div class="acts"><button class="btn gold" data-a="speed">Terminer · <i class="i star"></i>${st}</button></div>`;
  }
  else if (panel === 'info'){
    const o = panelArg, b = B(o);
    h = hd(b.kind === 'house' ? `+${b.pop} habitants` : b.kind === 'town' ? `+${b.cap} places` : '', o.wild ? 'Sapin enneigé' : b.name) + `<p>${o.wild ? 'Un sapin de la forêt. Coupe-le pour faire de la place.' : b.desc}</p><div class="acts">${o.wild ? '' : '<button class="btn blue" data-a="move">Déplacer</button>'}${b.kind === 'deco' || b.kind === 'path' ? `<button class="btn red" data-a="sell">${o.wild ? 'Couper' : 'Vendre'}</button>` : ''}</div>`;
  }
  if (h !== panelHtml){ panelHtml = h; $('#sheet').innerHTML = h; }
  for (const n of $('#sheet').querySelectorAll('[data-until]')) n.textContent = fmtTime((+n.dataset.until - now()) / 1000);
}
$('#sheet').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'close') return closePanel();
  if (a === 'deliver') return deliver(+b.dataset.i, b);
  if (a === 'trash'){ S.orders[+b.dataset.i] = {wait: now() + 20000}; sfx.tap(); return renderPanel(); }
  if (a === 'queue') return queueRecipe(panelArg, b.dataset.k);
  if (a === 'fcollect'){ factoryCollect(panelArg, b); return renderPanel(); }
  if (a === 'barnup'){ const up = T.barnUpCost(S); if (!T.has(S, up)) return; T.take(S, up); S.barnLvl++; T.track(S, 'barnup'); sfx.level(); toast(`Grange agrandie : ${T.barnCap(S)} places`); return renderPanel(); }
  if (a === 'cat'){ panelArg = b.dataset.k; sfx.tap(); return renderPanel(); }
  if (a === 'place') return startPlace(b.dataset.k);
  if (a === 'expand'){ const {cx, cy} = panelArg, n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n); S.coins -= c.coins; T.take(S, {axe: c.axe, saw: c.saw}); S.chunks.push(`${cx},${cy}`); T.track(S, 'expand'); gainXp(30 + n * 20, b); sfx.level(); toast('Nouveau terrain !'); closePanel(); save(); return; }
  if (a === 'speed'){ const o = panelArg, st = Math.max(1, Math.ceil((o.build - now()) / 60000)); if (S.stars < st){ sfx.err(); return toast("Pas assez d'étoiles"); } S.stars -= st; o.build = now(); closePanel(); tutoEv('speed'); return; }
  if (a === 'move'){ const o = panelArg; closePanel(); ghost = {type: o.type, x: o.x, y: o.y, move: o}; showGhostUI(); return; }
  if (a === 'sell'){ const o = panelArg; S.objs = S.objs.filter(x => x !== o); if (!o.wild) S.coins += Math.round(BUILDINGS[o.type].cost / 2); else gainXp(1, null); closePanel(); return; }
});

/* ---------- placement d'un nouveau bâtiment ---------- */
function startPlace(type){
  const why = T.buildBlock(S, type); if (why){ sfx.err(); return toast(why); }
  closePanel();
  const t = toTile(W / 2, H / 2), b = BUILDINGS[type];
  ghost = {type, x: Math.round(t.x - b.w / 2), y: Math.round(t.y - b.h / 2)};
  // cherche une place libre près du centre de l'écran
  outer: for (let r = 0; r < 12; r++) for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++){ if (fits(type, ghost.x + dx, ghost.y + dy)){ ghost.x += dx; ghost.y += dy; break outer; } }
  showGhostUI(); tutoEv('placing');
}
function showGhostUI(){ document.body.classList.add('placing'); $('#placebar').hidden = false; updateGhostUI(); }
function updateGhostUI(){ const ok = fits(ghost.type, ghost.x, ghost.y, ghost.move); $('#pb-ok').disabled = !ok; }
$('#pb-ok').addEventListener('click', () => {
  if (!ghost || !fits(ghost.type, ghost.x, ghost.y, ghost.move)) return;
  if (ghost.move){ ghost.move.x = ghost.x; ghost.move.y = ghost.y; }
  else {
    const b = BUILDINGS[ghost.type], cost = T.buildCost(S, ghost.type);
    if (S.coins < cost){ sfx.err(); return toast('Pas assez de pièces'); }
    S.coins -= cost;
    const o = {id: 'o' + now() + Math.random().toString(36).slice(2, 5), type: ghost.type, x: ghost.x, y: ghost.y};
    if (b.time){ o.build = now() + b.time * 1000; o.btotal = b.time * 1000; }
    if (b.kind === 'factory') o.q = [];
    if (b.kind === 'deco') gainXp(b.cost >= 60 ? 3 : b.cost >= 30 ? 2 : 1, null);
    S.objs.push(o); T.track(S, 'build:' + o.type); sfx.build(); tutoEv('placed');
    if (o.type === 'path' && S.coins >= T.buildCost(S, 'path')){ // les allées se posent à la suite, comme les routes de Township
      const nx = ghost.x + (ghost.dir || 1), ny = ghost.y; ghost = {type: 'path', x: fits('path', nx, ny) ? nx : ghost.x, y: ny, dir: ghost.dir}; save(); updateGhostUI(); return; }
  }
  ghost = null; $('#placebar').hidden = true; document.body.classList.remove('placing'); save();
});
$('#pb-no').addEventListener('click', () => { ghost = null; $('#placebar').hidden = true; document.body.classList.remove('placing'); });
$('#b-build').addEventListener('click', () => { sfx.tap(); openPanel('build', 'farm'); });
$('#b-barn').addEventListener('click', () => { sfx.tap(); openPanel('barn'); });
$('#b-orders').addEventListener('click', () => { sfx.tap(); const o = S.objs.find(o => o.type === 'orders'); centerOn(o.x + 1.5, o.y + 1.5); openPanel('orders'); });
$('#veil').addEventListener('click', () => closePanel());

/* ---------- tâche en cours (carte en bas à gauche) ---------- */
let questHtml = '';
function rewardChips(r){ return Object.entries(r).filter(([, n]) => n).map(([k, n]) => `<span class="chip">${k === 'xp' ? '<i class="i xp">XP</i>' : k === 'stars' ? '<i class="i star"></i>' : icon(k)}${fmt(n)}</span>`).join(''); }
function renderQuest(){
  const {q, v, done} = T.questProgress(S);
  const h = `<span class="tag">Tâche</span><b>${q.t}</b><span class="qbar"><i style="width:${v / q.n * 100}%"></i><em>${v} / ${q.n}</em></span><span class="costs">${done ? '<span class="claim">Récupérer</span>' : rewardChips(q.r)}</span>`;
  if (h !== questHtml){ questHtml = h; $('#quest2').innerHTML = h; $('#quest2').classList.toggle('done', done); }
}
function giveReward(r, el){
  if (r.coins){ S.coins += r.coins; fly('coins', r.coins, el); }
  if (r.stars){ S.stars += r.stars; }
  for (const k of Object.keys(r)) if (ITEMS[k]){ T.give(S, k, r[k]); fly(k, r[k], el); }
  if (r.xp) gainXp(r.xp, el);
  sfx.collect(); save();
}
$('#quest2').addEventListener('click', e => {
  const el = $('#quest2'), r = T.questClaim(S);
  if (r){ giveReward(r, el); toast('Tâche terminée !'); questHtml = ''; renderQuest(); }
  else { sfx.tap(); const {q} = T.questProgress(S); toast(q.t); }
});
/* ---------- cadeau du jour (série de 7 jours) ---------- */
function openDaily(){
  const ready = T.dailyReady(S), next = ready ? (S.daily.last === dayKey(now() - 864e5) ? S.daily.streak : 0) % 7 : (S.daily.streak - 1) % 7;
  const m = $('#modal'); m.className = 'glow';
  m.querySelector('.mcard').innerHTML = `<small>Reviens chaque jour !</small><h2 class="stroke">Cadeau du jour</h2>
    <div class="daily">${T.DAILY.map((r, i) => `<div class="dd ${i < next || (!ready && i === next) ? 'got' : ''} ${i === next && ready ? 'today' : ''} ${i === 6 ? 'big' : ''}"><small>Jour ${i + 1}</small><div class="costs">${rewardChips(r)}</div></div>`).join('')}</div>
    ${ready ? '<button class="btn green" data-m="claim">Récupérer</button>' : '<p>Reviens demain pour la suite de ta série !</p><button class="btn blue" data-m="close">OK</button>'}`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; if (b.dataset.m === 'claim'){ const r = T.dailyClaim(S); if (r) giveReward(r, b); } m.hidden = true; };
}
const dayKey = t => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
$('#b-daily').addEventListener('click', () => { sfx.tap(); openDaily(); });

/* ---------- montée de niveau ---------- */
function levelUp(){
  const L = S.lvl, news = T.unlocksAt(L);
  sfx.level();
  const m = $('#modal'); m.className = 'cere';
  m.querySelector('.mcard').innerHTML = `<div class="rays"></div><small>Bravo !</small><h2>Niveau ${L} !</h2><div class="glow"><img src="${elfPortrait}" alt=""></div>
    ${news.length ? `<p>Nouveau :</p><div class="costs">${news.map(n => `<span class="chip">${n}</span>`).join('')}</div>` : '<p>Continue comme ça !</p>'}
    <div class="costs"><span class="chip">${icon('coins')}+${20 + L * 10}</span><span class="chip"><i class="i star"></i>+1</span></div>
    <button class="btn green" data-m="close">Continuer</button>`;
  m.hidden = false; S.coins += 20 + L * 10; S.stars += 1;
  m.onclick = e => { if (e.target.closest('[data-m]')) m.hidden = true; };
  save();
}

/* =====================================================================
   DIDACTICIEL (Pépin)
   ===================================================================== */
const firstField = () => S.objs.find(o => o.type === 'field');
const rectOf = (pred, shrink = 0) => () => { const o = S.objs.find(pred); if (!o) return null; const r = objScreenRect(o); const b = B(o); const a = toScreen(o.x, o.y + b.h), c = toScreen(o.x + b.w, o.y); return b.kind === 'field' ? {left: a.x, top: toScreen(o.x, o.y).y - 20, width: c.x - a.x, height: toScreen(o.x + b.w, o.y + b.h).y - toScreen(o.x, o.y).y + 20} : {left: r.left + r.width * .15, top: r.top + r.height * .15, width: r.width * .7, height: r.height * .7}; };
const fieldsRect = () => { const fs = S.objs.filter(o => o.type === 'field').slice(0, 6); if (!fs.length) return null; let l = 1e9, t = 1e9, r = -1e9, b = -1e9; for (const o of fs){ for (const [x, y] of [[o.x, o.y], [o.x + 2, o.y], [o.x, o.y + 2], [o.x + 2, o.y + 2]]){ const p = toScreen(x, y); l = Math.min(l, p.x); r = Math.max(r, p.x); t = Math.min(t, p.y); b = Math.max(b, p.y); } } return {left: l, top: t - 30, width: r - l, height: b - t + 30}; };
const STEPS = [
  {say: "Bienvenue au Pôle Nord ! Le vieux Père Noël prend sa retraite et c'est <b>toi</b> qui reprends son village. Je suis Pépin, je vais t'aider !", tap: true},
  {say: "Le blé est mûr. <b>Pose ton doigt sur un champ et glisse</b> sur les autres pour tout récolter d'un coup !", target: fieldsRect, wait: 'harvest', focus: [15, 17]},
  {say: "Super ! Maintenant <b>touche un champ vide</b> pour replanter.", target: fieldsRect, wait: 'seeds'},
  {say: "Choisis le <b>blé</b>. Ensuite, garde le doigt appuyé et <b>glisse sur les autres champs</b> pour tout planter !", target: () => document.querySelector('#seeds'), wait: 'planted'},
  {say: "Les poules ont faim. <b>Touche le poulailler</b> pour leur donner du blé.", target: rectOf(o => o.type === 'henhouse'), wait: 'feed', focus: [26.5, 16.5]},
  {say: "Les enfants passent commande au <b>Bureau du traîneau</b>. Touche-le !", target: rectOf(o => o.type === 'orders'), wait: 'open:orders', focus: [16.5, 26.5]},
  {say: "Léa veut du blé. <b>Livre sa commande</b> pour gagner des pièces et de l'XP !", target: () => document.querySelector('[data-a="deliver"][data-i="0"]'), wait: 'deliver'},
  {say: "Bravo ! Avec tes pièces, tu peux construire. Ferme cette fenêtre, puis touche <b>Construire</b> en bas à droite.", target: () => document.querySelector('#b-build'), wait: 'open:build'},
  {say: "Ajoute un <b>champ</b> : plus de champs, plus de récoltes !", target: () => document.querySelector('[data-a="place"][data-k="field"]'), wait: 'placing'},
  {say: "Choisis l'endroit en glissant le champ, puis touche <b>✓</b> pour valider.", target: () => document.querySelector('#pb-ok'), wait: 'placed'},
  {say: "Tu as compris l'essentiel ! Récolte, nourris, fabrique, livre… Chaque niveau débloque de nouveaux bâtiments et de nouvelles recettes. À toi de jouer !", tap: true, end: true},
];
const tuto = createTuto({getState: () => S, save, sfx, portrait: elfPortrait, steps: STEPS, focusPlot: ([x, y]) => centerOn(x, y)});
function tutoEv(n){ tuto.event(n); }

/* =====================================================================
   BOUCLE
   ===================================================================== */
let last = performance.now(), hudT = 0, saveT = 0, panelT = 0;
function frame(t){
  requestAnimationFrame(frame);
  // horloge de l'image : jamais négative (le 1er horodatage peut précéder la fin du chargement)
  const dt = Math.max(0, Math.min(.05, (t - last) / 1000)); last = Math.max(last, t);
  try { step(t, dt); } catch(e){ if (!frame.err){ frame.err = 1; console.error('frame', e && e.stack); window.showErr?.(e && e.message); } }
}
function step(t, dt){
  refreshOrders(); finishBuilds(); moveElves(dt);
  for (const f of flakes){ f.y += f.v * dt * .12; f.x += Math.sin(t / 1000 + f.s * 7) * dt * .01; if (f.y > 1) { f.y = 0; f.x = Math.random(); } }
  draw();
  hudT -= dt; if (hudT <= 0){ hudT = .2; hud(); }
  panelT -= dt; if (panel && panelT <= 0){ panelT = .3; renderPanel(); }
  saveT -= dt; if (saveT <= 0){ saveT = 4; save(); }
}
requestAnimationFrame(frame);
addEventListener('visibilitychange', () => { if (document.hidden) save(); });
addEventListener('pointerdown', () => sfx.tap(), {once: true});
// entrée directe dans le village (pas de menu titre)
setTimeout(() => { $('#intro').classList.add('hide'); document.body.classList.add('playing'); setTimeout(() => $('#intro').remove(), 700); if (tuto.active()) setTimeout(() => tuto.start(), 700); }, 400);
if ('serviceWorker' in navigator && location.protocol === 'https:' && !/claude\.ai|claudeusercontent/.test(location.host)) navigator.serviceWorker.register('sw.js').catch(() => {});
window.__v2 = {get S(){ return S; }, cam, SPR, openPanel, tuto, screen: toScreen, centerOn, ICON, hud};
