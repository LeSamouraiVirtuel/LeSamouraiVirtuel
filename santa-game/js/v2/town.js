// Règles V3 « Village à ressources » : chaque bâtiment a une utilité, et chaque niveau change des chiffres visibles
// (inspiré de Dragons of Atlantis pour l'économie et de Bid Master pour l'utilité de chaque lieu). Voir PLAN-V3.md.
// Aucune dépendance graphique.
//
// Boucle : les bâtiments de production remplissent leur petit stock (environ 1 h) → on touche la bulle pour récolter
// → les ressources servent à améliorer les bâtiments et à fabriquer les jouets des lettres d'enfants
// → les lettres rapportent pièces, XP, étoiles et outils → la Maison du Père Noël débloque la suite.

/* ===================== RESSOURCES, JOUETS, MATÉRIAUX ===================== */
// ic : modèle 3D de l'icône ; res : ressource de base (plafonnée par l'entrepôt)
export const ITEMS = {
  coins:  {name: 'Pièces', ic: 'Money_Coins_Stack_Medium', res: true},
  wood:   {name: 'Bois', ic: 'Wood_Planks_Stack_Medium', res: true},
  cookies:{name: 'Biscuits', ic: 'cookie', res: true},
  fabric: {name: 'Tissu', ic: 'Textiles_Stack_Large_Colored', res: true},
  // jouets fabriqués à l'Atelier (demandés dans les lettres)
  train:  {name: 'Petit train', ic: 'train_locomotive', toy: true},
  box:    {name: 'Boîte de biscuits', ic: 'plate_decorated_A', toy: true},
  sled:   {name: 'Luge', ic: 'sled', toy: true},
  plush:  {name: 'Bonhomme en peluche', ic: 'snowman', toy: true},
  nut:    {name: 'Casse-noisette', ic: 'nutcracker', toy: true},
  cane:   {name: "Sucre d'orge géant", ic: 'candycane_large', toy: true},
  sock:   {name: 'Chaussette garnie', ic: 'sock-red-cane', toy: true},
  bell:   {name: 'Cloche dorée', ic: 'bell_decorated', toy: true},
  // outils pour dégager la forêt (lettres, train, mini-jeux, tâches)
  axe:    {name: 'Hache', ic: 'Wood_Log_A', mat: true},
  saw:    {name: 'Scie', ic: 'Wood_Planks_Stack_Small', mat: true},
};
export const RES = ['coins', 'wood', 'cookies', 'fabric'];

// jouets : coût, temps de fabrication (s), XP, valeur, niveau joueur requis
export const TOYS = {
  train: {cost: {wood: 30}, time: 30, xp: 4, value: 40, lvl: 1},
  box:   {cost: {cookies: 30}, time: 45, xp: 5, value: 50, lvl: 2},
  sled:  {cost: {wood: 60}, time: 90, xp: 8, value: 80, lvl: 3},
  plush: {cost: {fabric: 25}, time: 120, xp: 10, value: 100, lvl: 4},
  nut:   {cost: {wood: 50, fabric: 25}, time: 240, xp: 16, value: 170, lvl: 6},
  cane:  {cost: {cookies: 60, wood: 30}, time: 200, xp: 14, value: 150, lvl: 7},
  sock:  {cost: {fabric: 45, cookies: 40}, time: 360, xp: 22, value: 260, lvl: 9},
  bell:  {cost: {wood: 120, fabric: 60, coins: 300}, time: 600, xp: 40, value: 520, lvl: 12},
};

/* ===================== BÂTIMENTS ===================== */
// kind : hq | prod | house | storage | craft | orders | stable | fun | deco | path
// cost : coût du niveau 1 (×1,6 par niveau) ; time : secondes du niveau 1 (×1,55) ; hq : niveau de Maison requis
export const BUILDINGS = {
  santa:    {name: 'Maison du Père Noël', kind: 'hq', w: 4, h: 4, unique: true, max: 25, cost: {coins: 120, wood: 150}, time: 20,
             desc: 'Le cœur du village. Son niveau fixe le niveau maximum des autres bâtiments et débloque de nouveaux bâtiments.'},
  sawmill:  {name: 'Scierie', kind: 'prod', res: 'wood', rate: 1440, w: 3, h: 3, cost: {coins: 40, wood: 20}, time: 8, hq: 1,
             desc: 'Les lutins débitent les vieux sapins en planches.'},
  letters:  {name: 'Bureau des lettres', kind: 'prod', res: 'coins', rate: 900, w: 3, h: 3, cost: {coins: 30, wood: 40}, time: 8, hq: 1,
             desc: 'Les lettres des enfants arrivent ici, souvent avec une pièce pour le village.'},
  bakery:   {name: 'Four à biscuits', kind: 'prod', res: 'cookies', rate: 840, w: 3, h: 3, cost: {coins: 60, wood: 60}, time: 10, hq: 1,
             desc: 'Des biscuits au gingembre tout chauds : les lutins en ont besoin pour les gros chantiers.'},
  mill:     {name: 'Filature', kind: 'prod', res: 'fabric', rate: 450, w: 3, h: 3, cost: {coins: 250, wood: 200, cookies: 60}, time: 30, hq: 3,
             desc: 'La laine des moutons du Pôle devient du tissu pour les peluches et les chaussettes.'},
  cabin:    {name: 'Chalet des lutins', kind: 'house', w: 2, h: 2, cost: {coins: 50, wood: 60}, time: 6, hq: 1,
             desc: 'Loge des lutins : ce sont les ouvriers des bâtiments de production.'},
  storage:  {name: 'Entrepôt', kind: 'storage', w: 3, h: 3, cost: {coins: 100, wood: 120}, time: 15, hq: 2,
             desc: 'Agrandit le stock maximum de bois, de biscuits et de tissu.'},
  workshop: {name: 'Atelier des jouets', kind: 'craft', w: 3, h: 3, unique: true, cost: {coins: 150, wood: 150, cookies: 40}, time: 20, hq: 2,
             desc: 'Fabrique les jouets demandés dans les lettres des enfants.'},
  orders:   {name: 'Bureau du traîneau', kind: 'orders', w: 3, h: 3, unique: true, cost: {coins: 80, wood: 80}, time: 10, hq: 1,
             desc: 'Les enfants y déposent leurs commandes de jouets. Livre-les pour gagner pièces, XP et étoiles.'},
  stable:   {name: 'Écurie des rennes', kind: 'stable', w: 3, h: 3, unique: true, cost: {coins: 400, wood: 350, cookies: 120}, time: 40, hq: 4,
             desc: 'Les rennes s’entraînent pour la Tournée de Noël (mini-jeu).'},
  theater:  {name: 'Théâtre de marionnettes', kind: 'fun', w: 3, h: 3, unique: true, cost: {coins: 600, wood: 400, fabric: 100}, time: 60, hq: 5,
             desc: 'Des spectacles pour les lutins : le bonheur augmente toute la production.'},
  tree:     {name: 'Sapin décoré', kind: 'deco', w: 1, h: 1, cost: {coins: 40}, joy: 2, hq: 1, desc: '+2 bonheur'},
  lantern:  {name: 'Lampadaire', kind: 'deco', w: 1, h: 1, cost: {coins: 30, wood: 10}, joy: 1, hq: 1, desc: '+1 bonheur'},
  bench:    {name: 'Banc', kind: 'deco', w: 1, h: 1, cost: {coins: 50, wood: 30}, joy: 2, hq: 2, desc: '+2 bonheur'},
  snowman:  {name: 'Bonhomme de neige', kind: 'deco', w: 1, h: 1, cost: {coins: 80, cookies: 20}, joy: 3, hq: 2, desc: '+3 bonheur'},
  candy:    {name: "Sucre d'orge géant", kind: 'deco', w: 1, h: 1, cost: {coins: 120, cookies: 40}, joy: 4, hq: 3, desc: '+4 bonheur'},
  gifts:    {name: 'Pile de cadeaux', kind: 'deco', w: 1, h: 1, cost: {coins: 150, fabric: 20}, joy: 5, hq: 4, desc: '+5 bonheur'},
  reindeer: {name: 'Renne', kind: 'deco', w: 1, h: 1, cost: {coins: 300, cookies: 80}, joy: 8, hq: 5, desc: '+8 bonheur'},
  path:     {name: 'Allée pavée', kind: 'path', w: 1, h: 1, cost: {coins: 5}, hq: 1, desc: 'Relie tes bâtiments.'},
};
export const CATS = [['prod', 'Production'], ['town', 'Village'], ['deco', 'Déco']];
export const catOf = b => b.kind === 'prod' ? 'prod' : b.kind === 'deco' || b.kind === 'path' ? 'deco' : 'town';
export const isUpgradable = b => !['deco', 'path'].includes(b.kind);

/* ---------- chiffres par niveau (tout ce que l'amélioration change) ---------- */
const R5 = n => n < 100 ? Math.round(n) : Math.round(n / 5) * 5;
export const rate = (type, lv) => R5(BUILDINGS[type].rate * Math.pow(1.35, lv - 1));        // par heure
export const buffer = (type, lv) => R5(rate(type, lv) * (lv < 3 ? .5 : lv < 6 ? 2 : lv < 9 ? 6 : 12));   // stock interne : 30 min → 2 h → 6 h → une nuit
export const workers = (type, lv) => BUILDINGS[type].kind === 'prod' ? 2 * lv : 0;
export const housing = lv => 6 + 4 * (lv - 1);                                             // lutins par chalet
export const storageAdd = lv => R5(300 * Math.pow(1.5, lv - 1));                           // stock en plus par entrepôt
export const hqStock = lv => R5(1000 * Math.pow(1.45, lv - 1));
export const craftSlots = lv => Math.min(8, 2 + Math.floor(lv / 2));
export const craftSpeed = lv => 1 + .08 * (lv - 1);
export const orderSlots = lv => Math.min(9, 3 + Math.floor(lv / 2));
export const orderBonus = lv => 1 + .1 * (lv - 1);
export const ticketsMax = lv => 3 + Math.floor(lv / 3);
export const gameBonus = lv => 1 + .25 * (lv - 1);
export const theaterJoy = lv => 8 * lv;
export function upCost(type, lv){        // coût pour passer au niveau lv (lv = 1 : construction)
  const b = BUILDINGS[type], c = {}, m = Math.pow(1.6, Math.min(lv, 15) - 1) * Math.pow(1.28, Math.max(0, lv - 15));   // au-delà de 15 : +28 %/niveau
  for (const [k, v] of Object.entries(b.cost)) c[k] = R5(v * m);
  if (b.kind === 'hq' && lv >= 2) c.cookies = R5(70 * m / 1.6);
  if (isUpgradable(b) && lv >= 3 && !c.cookies) c.cookies = R5((b.cost.wood || 50) * .4 * m);   // les gros chantiers nourrissent les lutins
  return c;
}
// Durée des chantiers : secondes → minutes → heures → jours, comme l'Hôtel de ville de Clash of Clans ou la Forteresse de DoA.
// Maison du Père Noël : niv. 2 = 10 s … niv. 15 = 5 jours. Les autres bâtiments suivent le palier de la Maison, plafonnés à 3 jours.
const H = 3600, D = 86400;
export const HQ_TIME = [0, 0, 10, 120, 20 * 60, H, 2 * H, 4 * H, 8 * H, 12 * H, D, 1.5 * D, 2 * D, 3 * D, 4 * D, 5 * D, 5.5 * D, 6 * D, 6 * D, 6.5 * D, 6.5 * D, 7 * D, 7 * D, 7 * D, 7 * D, 7 * D];
export function upTime(type, lv){
  const b = BUILDINGS[type];
  if (b.kind === 'hq') return lv <= 1 ? 0 : HQ_TIME[Math.min(lv, HQ_TIME.length - 1)];
  if (!b.time) return 0;
  const t = lv <= 1 ? b.time : Math.max(b.time, HQ_TIME[Math.min(lv, HQ_TIME.length - 1)] * .45);
  return Math.round(Math.min(3 * D, t));
}
export const buildXp = lv => Math.round(6 * Math.pow(lv, 1.4));
export const freeFinish = 3 * 60 * 1000;     // moins de 3 min restantes : « Terminer » est gratuit (comme DoA / Clash)
export const BUILDERS = 2;                   // équipes de lutins bâtisseurs (chantiers en même temps)

/** Ce que chaque niveau donne, sous forme de lignes affichables {label, now, next}. */
export function stats(s, o, lv = o.lv){
  const b = BUILDINGS[o.type], L = (label, f, unit = '') => ({label, now: lv ? f(lv) + unit : '—', next: f(lv + 1) + unit});
  switch (b.kind){
    case 'prod': return [L(`${ITEMS[b.res].name} par heure`, l => fmtN(rate(o.type, l))), L('Stock du bâtiment', l => fmtN(buffer(o.type, l))), L('Lutins employés', l => workers(o.type, l))];
    case 'house': return [L('Lutins logés', housing)];
    case 'storage': return [L('Stock en plus (bois, biscuits, tissu)', l => '+' + fmtN(storageAdd(l)))];
    case 'craft': return [L('Places dans la file', craftSlots), L('Vitesse des lutins', l => '×' + craftSpeed(l).toFixed(2))];
    case 'orders': return [L('Lettres en même temps', orderSlots), L('Récompenses', l => '+' + Math.round((orderBonus(l) - 1) * 100) + ' %')];
    case 'stable': return [L('Tickets de jeu', ticketsMax), L('Gains de la Tournée', l => '×' + gameBonus(l).toFixed(2))];
    case 'fun': return [L('Bonheur', l => '+' + theaterJoy(l))];
    case 'hq': return [L('Niveau max des bâtiments', l => l + 1), L('Stock de base', l => fmtN(hqStock(l))), L('Bâtiments débloqués', l => unlockCount(l))];
  }
  return [];
}
const fmtN = n => n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n);
const unlockCount = l => Object.values(BUILDINGS).filter(b => (b.hq || 1) <= l && b.kind !== 'path').length;
export const unlocksAtHq = L => Object.values(BUILDINGS).filter(b => b.hq === L && L > 1).map(b => b.name);

/* ===================== NIVEAU DU JOUEUR ===================== */
// Courbe tirée des références (Township, Hay Day, Clash of Clans, DoA ; voir research/PROGRESSION.md) :
// rafale au début (niv. 2 en ~1 min, niv. 5 en ~10 min), niv. 10 en fin de jour 1, 20 en une semaine, 30 en ~3 semaines,
// 60 en ~5 mois. Le temps par niveau est multiplié par ~1 000 entre le niveau 2 et le niveau 60.
const XP_START = [10, 25, 45, 75, 120, 180, 260];
export const xpNeed = L => L <= XP_START.length ? XP_START[L - 1] : Math.round(2.2 * Math.pow(L, 2.5) * Math.pow(Math.max(1, L / 40), 1.2) / 50) * 50;   // au-delà de 40 : encore plus long
export const unlocksAt = L => Object.entries(TOYS).filter(([k, t]) => t.lvl === L && L > 1).map(([k]) => ITEMS[k].name);
// Coffres de la barre d'XP : à partir du niveau 8, les niveaux deviennent longs ; chaque tiers de barre franchi
// donne un petit coffre (objectif à court terme, comme les coffres de la barre de niveau des jeux de référence).
export const XP_CHEST_FROM = 8;
const marks = s => s.lvl < XP_CHEST_FROM ? 0 : (s.lvl - XP_CHEST_FROM) * 2 + Math.min(2, Math.floor(s.xp / xpNeed(s.lvl) * 3));
export function addXp(s, n){
  const before = marks(s); s.xp += n; let up = 0;
  while (s.xp >= xpNeed(s.lvl)){ s.xp -= xpNeed(s.lvl); s.lvl++; up++; }
  const chests = marks(s) - before;
  if (chests > 0) s.xpChests = (s.xpChests || 0) + chests;
  return up;
}
export const xpChestReward = s => { const res = ['wood', 'cookies', 'fabric'][Math.floor(Math.random() * 3)], m = Math.pow(s.lvl, 1.6); return {coins: R5(15 * m), [res]: R5(4 * m)}; };

/* ===================== CARTE ===================== */
export const MAP = 44;
export const CHUNK = 11;
export const START_CHUNKS = ['1,1', '2,1', '1,2', '2,2'];
export const chunkCost = n => ({coins: R5(800 * Math.pow(1.8, n)), wood: R5(400 * Math.pow(1.8, n)), axe: 1 + n, saw: 1 + Math.floor(n / 2)});

/* ===================== ÉTAT ===================== */
const KEY = 'village-du-pole-v5';
let uid = 1;
const nid = () => 'o' + (uid++) + Math.random().toString(36).slice(2, 5);
const overlap = (s, type, x, y) => { const b = BUILDINGS[type]; return s.objs.some(o => { const ob = BUILDINGS[o.type]; return x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y; }); };

export function newTown(){
  const t = Date.now();
  const s = {
    v: 5, coins: 200, wood: 120, cookies: 0, fabric: 0, stars: 15, xp: 0, lvl: 1,
    inv: {}, objs: [], chunks: [...START_CHUNKS], orders: [], tuto: 0, t,
    cnt: {}, quest: {i: 0, base: {}}, daily: {last: '', streak: 0}, games: null, decorated: 1,
  };
  const add = (type, x, y, extra = {}) => { if (!overlap(s, type, x, y)) s.objs.push({id: nid(), type, x, y, lv: 1, t: t - 20 * 60e3, ...extra}); };
  add('santa', 19, 18);
  add('sawmill', 13, 15);
  add('letters', 25, 15);
  add('orders', 15, 25);
  add('cabin', 20, 24); add('cabin', 22, 24);
  decorate(s); clearLots(s);
  s.orders = [];
  return s;
}
export function decorate(s){
  const add = (type, x, y, extra = {}) => { if (!overlap(s, type, x, y)) s.objs.push({id: nid(), type, x, y, free: 1, ...extra}); };
  for (let x = 12; x <= 31; x++) add('path', x, 22);
  for (let y = 14; y <= 21; y++) add('path', 23, y);
  for (let y = 14; y <= 21; y++) add('path', 17, y);
  for (let y = 23; y <= 29; y++) add('path', 19, y);
  for (let x = 14; x <= 29; x++) add('path', x, 29);
  for (let y = 23; y <= 28; y++) add('path', 24, y);
  for (let x = 24; x <= 28; x++) add('path', x, 18);
  for (const [t, x, y] of [['lantern', 18, 21], ['lantern', 22, 23], ['lantern', 16, 23], ['lantern', 25, 21], ['lantern', 18, 28], ['lantern', 25, 28], ['lantern', 29, 23],
    ['bench', 21, 23], ['bench', 16, 21], ['gifts', 18, 17], ['gifts', 23, 23], ['reindeer', 18, 26], ['reindeer', 20, 28], ['snowman', 28, 20], ['snowman', 13, 23], ['candy', 22, 17], ['candy', 18, 23]]) add(t, x, y);
  let r = 11; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 140; i++){
    const edge = rnd() < .7, x = edge ? (rnd() < .5 ? 11 + Math.floor(rnd() * 2) : 31 + Math.floor(rnd() * 2)) : 11 + Math.floor(rnd() * 22), y = edge && rnd() < .5 ? 11 + Math.floor(rnd() * 22) : (rnd() < .5 ? 11 + Math.floor(rnd() * 3) : 30 + Math.floor(rnd() * 3));
    add('tree', edge && rnd() < .5 ? x : 11 + Math.floor(rnd() * 22), y, {wild: 1});
  }
}
// les terrains réservés restent dégagés (pas de sapin sauvage dessus)
export function clearLots(s){ s.objs = s.objs.filter(o => !(o.wild && LOTS.some(l => { const b = BUILDINGS[l.type]; return o.x >= l.x - 0 && o.x < l.x + b.w && o.y >= l.y && o.y < l.y + b.h; }))); }
export function loadTown(){
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 5){
      for (const k of [...RES, 'stars', 'xp']) s[k] = +s[k] || 0;
      clearLots(s);
      s.cnt ||= {}; s.quest ||= {i: 0, base: {}}; s.daily ||= {last: '', streak: 0}; s.inv ||= {};
      return s;
    }
  } catch(e){}
  return null;
}
export function saveTown(s){ s.t = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){} }
export function clearTown(){ try { localStorage.removeItem(KEY); } catch(e){} }

/* ===================== RÈGLES ===================== */
export const maxLv = s => hqLv(s) + 1;          // les autres bâtiments montent jusqu'au niveau de la Maison + 1
export const hqLv = s => s.objs.find(o => o.type === 'santa')?.lv || 1;
export const built = o => !o.build;                     // un bâtiment en construction ne sert pas encore
export const countOf = (s, type) => s.objs.filter(o => o.type === type && !o.wild).length;
export const lutins = s => s.objs.reduce((a, o) => a + (BUILDINGS[o.type].kind === 'house' && built(o) ? housing(o.lv) : 0), 0);
export const employed = s => s.objs.reduce((a, o) => a + (built(o) ? workers(o.type, o.lv || 0) : 0), 0);
export const workRatio = s => { const e = employed(s); return e ? Math.min(1, lutins(s) / e) : 1; };
export const joy = s => s.objs.reduce((a, o) => a + (BUILDINGS[o.type].kind === 'deco' && !o.wild && !o.free ? BUILDINGS[o.type].joy || 0 : BUILDINGS[o.type].kind === 'fun' && built(o) ? theaterJoy(o.lv) : 0), 0);
export const joyBonus = s => joy(s) / 100;              // +1 % de production par point de bonheur
export const prodMult = s => workRatio(s) * (1 + joyBonus(s));
export const cap = (s, r) => r === 'coins' ? Infinity : hqStock(hqLv(s)) + s.objs.reduce((a, o) => a + (o.type === 'storage' && built(o) ? storageAdd(o.lv) : 0), 0);
/** Ce qu'un bâtiment de production a accumulé (plafonné à son stock interne). */
export function stored(s, o, now = Date.now()){
  const b = BUILDINGS[o.type]; if (b.kind !== 'prod' || !built(o) || o.up) return 0;
  return Math.min(buffer(o.type, o.lv), Math.floor(rate(o.type, o.lv) * prodMult(s) * keeperMult(o) * (now - o.t) / 3.6e6));
}
export function collect(s, o, now = Date.now()){
  const b = BUILDINGS[o.type], n = stored(s, o, now); if (!n) return 0;
  const room = Math.max(0, cap(s, b.res) - (s[b.res] || 0)), got = Math.min(n, room);
  if (!got) return -1;                                   // stock plein
  s[b.res] += got;
  // ce qui n'a pas pu rentrer reste dans le bâtiment
  const left = n - got; o.t = now - Math.round(left / (rate(o.type, o.lv) * prodMult(s) * keeperMult(o)) * 3.6e6);
  return got;
}
export const maxOf = (s, type) => {
  const b = BUILDINGS[type], H = hqLv(s);
  if (b.unique || b.kind === 'hq') return 1;
  if (b.kind === 'house') return 2 + H;
  if (b.kind === 'prod') return 1 + Math.floor(H / 4);
  if (b.kind === 'storage') return 1 + Math.floor(H / 5);
  if (b.kind === 'path') return Infinity;
  return 99;
};
export const has = (s, req) => Object.entries(req).every(([k, n]) => (RES.includes(k) || k === 'stars' ? s[k] || 0 : s.inv[k] || 0) >= n);
export const take = (s, req) => { for (const [k, n] of Object.entries(req)){ if (RES.includes(k) || k === 'stars') s[k] -= n; else s.inv[k] = (s.inv[k] || 0) - n; } };
export function give(s, k, n = 1){ if (RES.includes(k) || k === 'stars') s[k] = (s[k] || 0) + n; else s.inv[k] = (s.inv[k] || 0) + n; }
export const busyBuilders = (s, now = Date.now()) => s.objs.filter(o => (o.build && o.build > now) || (o.up && o.up > now)).length;
export function buildBlock(s, type){
  const b = BUILDINGS[type];
  if ((b.hq || 1) > hqLv(s)) return `Maison du Père Noël niv. ${b.hq}`;
  if (countOf(s, type) >= maxOf(s, type)) return b.unique ? 'Déjà construit' : 'Maximum atteint : améliore la Maison du Père Noël';
  if (isUpgradable(b) && busyBuilders(s) >= BUILDERS) return 'Tous les bâtisseurs sont occupés';
  if (!has(s, upCost(type, 1))) return 'Ressources insuffisantes';
  return null;
}
export function upBlock(s, o){
  const b = BUILDINGS[o.type];
  if (o.build || o.up) return 'Déjà en travaux';
  if (b.kind === 'hq'){ if (o.lv >= b.max) return 'Niveau maximum'; }
  else if (o.lv >= maxLv(s)) return `Améliore d'abord la Maison du Père Noël (niv. ${o.lv})`;
  if (busyBuilders(s) >= BUILDERS) return 'Tous les bâtisseurs sont occupés';
  if (!has(s, upCost(o.type, o.lv + 1))) return 'Ressources insuffisantes';
  return null;
}

/* ===================== LETTRES DES ENFANTS (commandes) ===================== */
const KIDS = ['Léa', 'Hugo', 'Inès', 'Noah', 'Jade', 'Lucas', 'Chloé', 'Adam', 'Manon', 'Gabriel', 'Lina', 'Louis', 'Emma', 'Nathan', 'Zoé', 'Sacha', 'Alice', 'Rayan', 'Mia', 'Tom'];
export const toysAvailable = s => Object.keys(TOYS).filter(k => TOYS[k].lvl <= s.lvl);
export function makeOrder(s, bureauLv = 1){
  const av = toysAvailable(s), n = av.length > 1 && Math.random() < .4 ? 2 : 1, items = {};
  for (const k of [...av].sort(() => Math.random() - .5).slice(0, n)) items[k] = 1 + Math.floor(Math.random() * Math.min(3, 1 + s.lvl / 3));
  const value = Object.entries(items).reduce((a, [k, q]) => a + TOYS[k].value * q, 0), xp = Object.entries(items).reduce((a, [k, q]) => a + TOYS[k].xp * q, 0);
  const m = orderBonus(bureauLv);
  const o = {kid: KIDS[Math.floor(Math.random() * KIDS.length)], items, coins: Math.round(value * 1.3 * m), xp: Math.round(xp * 1.6 * m * (1 + s.lvl * .17))};
  const r = Math.random();
  if (r < .2) o.mat = Math.random() < .6 ? 'axe' : 'saw'; else if (r < .32) o.stars = 1;
  return o;
}

/* ===================== TÂCHES (chapitres : un bâtiment à la fois) ===================== */
// k : 'collect:<res>' (quantité récoltée), 'level:<type>' (niveau atteint), 'have:<type>' (nombre construits),
//     'make' / 'orders' / 'games' / 'expand' (compteurs), 'lvl' (niveau joueur), 'joy' (bonheur)
export const QUESTS = [
  {t: 'Récolte le bois de la scierie', k: 'collect:wood', n: 1, r: {coins: 30, xp: 5}},
  {t: 'Améliore la scierie au niveau 2', k: 'level:sawmill', n: 2, r: {coins: 40, xp: 8}},
  {t: 'Construis le Four à biscuits', k: 'have:bakery', n: 1, r: {coins: 50, wood: 40, xp: 8}},
  {t: 'Récolte 50 biscuits', k: 'collect:cookies', n: 50, r: {coins: 60, xp: 8}},
  {t: 'Améliore la Maison du Père Noël au niveau 2', k: 'level:santa', n: 2, r: {coins: 100, stars: 2, xp: 12}},
  {t: "Construis l'Atelier des jouets", k: 'have:workshop', n: 1, r: {coins: 80, xp: 10}},
  {t: 'Fabrique 2 petits trains', k: 'make:train', n: 2, r: {wood: 80, xp: 10}},
  {t: 'Livre 2 lettres au Bureau du traîneau', k: 'orders', n: 2, r: {coins: 120, stars: 1, xp: 12}},
  {t: "Construis l'Entrepôt", k: 'have:storage', n: 1, r: {coins: 100, xp: 12}},
  {t: 'Construis un 3ᵉ chalet de lutins', k: 'have:cabin', n: 3, r: {wood: 120, xp: 12}},
  {t: 'Améliore le Bureau des lettres au niveau 2', k: 'level:letters', n: 2, r: {coins: 150, xp: 15}},
  {t: 'Améliore la Maison du Père Noël au niveau 3', k: 'level:santa', n: 3, r: {coins: 200, stars: 3, xp: 20}},
  {t: 'Construis la Filature', k: 'have:mill', n: 1, r: {coins: 150, xp: 15}},
  {t: 'Fabrique 2 bonhommes en peluche', k: 'make:plush', n: 2, r: {fabric: 40, xp: 15}},
  {t: 'Livre 8 lettres', k: 'orders', n: 8, r: {coins: 300, stars: 2, xp: 25}},
  {t: 'Atteins 20 de bonheur avec des décorations', k: 'joy', n: 20, r: {coins: 200, xp: 15}},
  {t: 'Améliore la Maison du Père Noël au niveau 4', k: 'level:santa', n: 4, r: {coins: 400, stars: 3, xp: 30}},
  {t: "Construis l'Écurie des rennes", k: 'have:stable', n: 1, r: {coins: 300, xp: 25}},
  {t: 'Joue une Tournée de Noël', k: 'games', n: 1, r: {stars: 2, xp: 20}},
  {t: 'Dégage un nouveau terrain', k: 'expand', n: 1, r: {coins: 500, stars: 5, xp: 40}},
  {t: 'Améliore la Maison du Père Noël au niveau 5', k: 'level:santa', n: 5, r: {coins: 600, stars: 4, xp: 40}},
  {t: 'Construis le Théâtre de marionnettes', k: 'have:theater', n: 1, r: {coins: 500, xp: 35}},
];
const GEN = [['orders', 'Livre %n lettres', 5], ['make', 'Fabrique %n jouets', 6], ['collect:wood', 'Récolte %n bois', 1500], ['collect:cookies', 'Récolte %n biscuits', 1000]];
export function questAt(s, i){
  if (i < QUESTS.length) return QUESTS[i];
  const j = i - QUESTS.length, g = GEN[j % GEN.length], n = Math.round(g[2] * (1 + Math.floor(j / GEN.length) * .5));
  return {t: g[1].replace('%n', n), k: g[0], n, r: {coins: 100 + s.lvl * 40, xp: 15 + s.lvl * 5, stars: j % 3 === 2 ? 2 : 0}};
}
export function track(s, key, n = 1){
  s.cnt[key] = (s.cnt[key] || 0) + n;
  const base = key.split(':')[0]; if (base !== key) s.cnt[base] = (s.cnt[base] || 0) + n;
}
function questValue(s, q, i){
  const [kind, what] = q.k.split(':');
  if (kind === 'lvl') return s.lvl;
  if (kind === 'joy') return joy(s);
  if (kind === 'level') return Math.max(0, ...s.objs.filter(o => o.type === what && built(o)).map(o => o.lv || 0));
  if (kind === 'have') return s.objs.filter(o => o.type === what && built(o) && !o.free).length + (what === 'cabin' ? s.objs.filter(o => o.type === 'cabin' && o.free).length : 0);
  if (kind === 'expand') return s.chunks.length - START_CHUNKS.length;
  const total = s.cnt[q.k] || 0;
  return i >= QUESTS.length ? total - (s.quest.base[q.k] || 0) : total;
}
export function questProgress(s){
  const q = questAt(s, s.quest.i), v = questValue(s, q, s.quest.i);
  return {q, v: Math.min(q.n, v), done: v >= q.n};
}
export function questClaim(s){
  const {q, done} = questProgress(s); if (!done) return null;
  s.quest.i++; const nq = questAt(s, s.quest.i); s.quest.base = {[nq.k]: s.cnt[nq.k] || 0};
  return q.r;
}

/* ===================== CADEAU DU JOUR ===================== */
export const DAILY = [{coins: 100, wood: 80}, {cookies: 80, axe: 1}, {stars: 3}, {coins: 300, fabric: 50}, {wood: 300, saw: 1}, {stars: 5, axe: 1}, {stars: 10, coins: 800, saw: 1}];
const day = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
export const yesterday = () => { const y = new Date(); y.setDate(y.getDate() - 1); return day(y.getTime()); };
export const dailyReady = s => s.daily.last !== day();
export function dailyClaim(s){
  if (!dailyReady(s)) return null;
  s.daily.streak = s.daily.last === yesterday() ? s.daily.streak + 1 : 1;
  s.daily.last = day();
  return DAILY[(s.daily.streak - 1) % 7];
}

/* ===================== GARDIENS (comme les managers de Bid Master, sans tirage au sort) ===================== */
// Chaque bâtiment de production peut engager son gardien : il récolte tout seul dans le stock du village.
// On l'améliore ensuite en étoiles (★1 → ★5) : +10 % de production par étoile.
export const KEEPER_MAX = 5;
export const keeperMult = o => 1 + .1 * Math.max(0, (o.keeper || 0) - 1);
export const keeperCost = (o, next = (o.keeper || 0) + 1) => next === 1 ? {coins: R5(250 * Math.pow(1.4, o.lv - 1)), cookies: 60} : {stars: 2 * (next - 1), cookies: R5(80 * next)};
export const keeperHq = 2;     // la Maison du Père Noël niveau 2 débloque les gardiens
export function keeperBlock(s, o){
  if (BUILDINGS[o.type].kind !== 'prod') return 'Seuls les bâtiments de production ont un gardien';
  if (hqLv(s) < keeperHq) return `Maison du Père Noël niv. ${keeperHq}`;
  if ((o.keeper || 0) >= KEEPER_MAX) return 'Gardien au maximum';
  if (!has(s, keeperCost(o))) return 'Ressources insuffisantes';
  return null;
}

/* ===================== TERRAINS RÉSERVÉS (bâtiments à venir, visibles sur la carte) ===================== */
// Le joueur voit dès le début où iront les grands bâtiments, avec le niveau de Maison requis : envie de progresser.
export const LOTS = [
  {type: 'workshop', x: 26, y: 23},
  {type: 'storage', x: 12, y: 25},
  {type: 'bakery', x: 13, y: 18},
  {type: 'mill', x: 28, y: 13},
  {type: 'stable', x: 20, y: 12},
  {type: 'theater', x: 26, y: 26},
];
export const lotsShown = s => LOTS.filter(l => !s.objs.some(o => o.type === l.type));

/* ===================== CHAPITRES (les tâches racontent l'histoire du village) ===================== */
export const CHAPTERS = [
  {from: 0, title: 'Le nouveau Père Noël', story: "Le vieux Père Noël te confie son village. Les lutins comptent sur toi pour remettre la scierie et le four en marche."},
  {from: 4, title: "L'atelier se réveille", story: "Les premières lettres arrivent ! Il faut un atelier pour fabriquer les jouets des enfants."},
  {from: 8, title: 'Un village qui grandit', story: "Plus de lutins, plus de stock : le village s'organise pour la grande nuit."},
  {from: 12, title: 'Les fils de laine', story: "Les enfants veulent des peluches. La Filature va changer la vie du village."},
  {from: 16, title: 'Les rennes du Nord', story: "Il est temps de préparer la Tournée : l'Écurie des rennes ouvre ses portes."},
  {from: 20, title: 'La fête au village', story: "Un théâtre de marionnettes, et tout le Pôle Nord vient voir ton village !"},
];
export const chapterOf = i => { let c = 0; for (let k = 0; k < CHAPTERS.length; k++) if (i >= CHAPTERS[k].from) c = k; return i >= QUESTS.length ? CHAPTERS.length : c; };

/* ===================== ALBUM DES JOUETS (collection, comme le musée de Bid Master) ===================== */
// Chaque jouet livré aux enfants remplit l'album. Paliers ★1/★2/★3 : une récompense, et chaque étoile de l'album
// augmente durablement ce que paient les lettres (+1 % par étoile).
export const ALBUM_STEPS = [3, 12, 40];
export const albumStars = (s, k) => ALBUM_STEPS.filter(n => (s.cnt['deliver:' + k] || 0) >= n).length;
export const albumTotal = s => Object.keys(TOYS).reduce((a, k) => a + albumStars(s, k), 0);
export const albumBonus = s => 1 + albumTotal(s) * .01;
export const albumReward = (k, star) => ({coins: Math.round(TOYS[k].value * [2, 5, 12][star - 1]), stars: star, xp: TOYS[k].xp * star * 2});
export function albumClaimable(s){
  s.album ||= {};
  const out = [];
  for (const k of Object.keys(TOYS)){ const got = albumStars(s, k), claimed = s.album[k] || 0; for (let st = claimed + 1; st <= got; st++) out.push([k, st]); }
  return out;
}

/* ===================== CALENDRIER DE L'AVENT (1er au 24 décembre) ===================== */
export const ADVENT = Array.from({length: 24}, (_, i) => {
  const d = i + 1;
  if (d === 24) return {stars: 25, coins: 5000, axe: 2, saw: 2};
  if (d % 6 === 0) return {stars: 5 + d / 3, coins: 400 * d / 6};
  if (d % 3 === 0) return {stars: 3, cookies: 150 + 20 * d};
  if (d % 2 === 0) return {coins: 150 + 40 * d, wood: 100 + 20 * d};
  return {coins: 120 + 30 * d, axe: d > 10 ? 1 : 0, saw: d <= 10 ? 0 : 0, fabric: d > 5 ? 40 + 5 * d : 0};
});
export function adventState(s, t = new Date()){
  s.advent ||= {};
  const dec = t.getMonth() === 11, day = dec ? t.getDate() : 0;
  const start = new Date(t.getFullYear(), 11, 1), days = Math.ceil((start - t) / 864e5);
  return {open: dec && day <= 24, today: dec ? Math.min(day, 24) : 0, untilStart: dec ? 0 : days};
}
export const adventCan = (s, d, t) => { const a = adventState(s, t); return a.open && d <= a.today && !s.advent[d]; };

/* ===================== ZONES DU PÔLE NORD (agrandissements nommés) ===================== */
export const ZONE_NAMES = {'0,0': 'Montagne des Étoiles', '1,0': 'Forêt des Murmures', '2,0': 'Col du Blizzard', '3,0': 'Aurores Boréales',
  '0,1': 'Lac Gelé', '3,1': 'Vallée des Rennes', '0,2': 'Collines Sucrées', '3,2': 'Bois aux Lutins',
  '0,3': 'Port des Glaces', '1,3': 'Champs de Neige', '2,3': 'Grotte des Cristaux', '3,3': 'Phare du Nord'};
export const zoneName = (cx, cy) => ZONE_NAMES[`${cx},${cy}`] || 'Terre inconnue';

// XP d'une récolte : fixe selon le niveau du bâtiment (sinon l'XP suivrait la production, qui grandit de façon exponentielle)
export const collectXp = o => 1 + Math.floor((o.lv || 1) / 2);
