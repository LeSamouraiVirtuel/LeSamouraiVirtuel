// Règles V2 « Township de Noël » : cultures, animaux, usines à recettes, commandes du traîneau,
// grange, maisons et population, agrandissements, niveaux. Aucune dépendance graphique.
//
// Rythme visé : 2 à 3 h de jeu sans attendre. Minuteurs très courts au début (le blé pousse en 20 s),
// toujours plusieurs choses à faire en parallèle, une montée de niveau toutes les 3 à 6 min au début.

/* ===================== OBJETS (cultures, produits, matériaux) ===================== */
// ic : modèle 3D utilisé pour l'icône ; v : valeur de base en pièces ; xp : XP à la récolte/fabrication
export const ITEMS = {
  wheat:   {name: 'Blé', ic: 'crops_wheatStageB', v: 2, xp: 1},
  carrot:  {name: 'Carottes', ic: 'carrot', v: 4, xp: 1},
  corn:    {name: 'Maïs', ic: 'corn', v: 6, xp: 2},
  beet:    {name: 'Betterave sucrière', ic: 'crop_turnip', v: 8, xp: 2},
  pumpkin: {name: 'Citrouille', ic: 'pumpkin', v: 12, xp: 3},
  berry:   {name: 'Fraises', ic: 'strawberry', v: 15, xp: 3},
  egg:     {name: 'Œufs', ic: 'egg', v: 8, xp: 2},
  milk:    {name: 'Lait', ic: 'carton', v: 14, xp: 3},
  wool:    {name: 'Laine', ic: 'Textiles_Stack_Large_Colored', v: 20, xp: 4},
  bread:   {name: 'Pain', ic: 'bread', v: 9, xp: 2},
  cookie:  {name: 'Biscuits', ic: 'cookie', v: 22, xp: 4},
  ginger:  {name: "Pain d'épices", ic: 'ginger-bread', v: 45, xp: 7},
  cream:   {name: 'Crème', ic: 'whipped-cream', v: 24, xp: 4},
  cheese:  {name: 'Fromage', ic: 'cheese', v: 40, xp: 6},
  pudding: {name: 'Flan', ic: 'pudding', v: 60, xp: 8},
  sugar:   {name: 'Sucre', ic: 'bag', v: 20, xp: 3},
  cane:    {name: "Sucre d'orge", ic: 'candycane_small', v: 55, xp: 7},
  cupcake: {name: 'Cupcake', ic: 'cupcake', v: 50, xp: 7},
  cake:    {name: 'Bûche de Noël', ic: 'cake', v: 110, xp: 12},
  donut:   {name: 'Beignet', ic: 'donut', v: 70, xp: 9},
  pie:     {name: 'Tarte à la citrouille', ic: 'waffle', v: 80, xp: 10},
  scarf:   {name: 'Écharpe', ic: 'Textiles_Stack_Large_Colored', v: 70, xp: 9},
  teddy:   {name: 'Ours en peluche', ic: 'snowman', v: 120, xp: 14},
  sock:    {name: 'Chaussette garnie', ic: 'sock-red-cane', v: 150, xp: 16},
  // matériaux (gagnés en récoltant, en livrant et au train) : agrandir la grange et la ville
  plank:   {name: 'Planche', ic: 'Wood_Planks_Stack_Small', mat: true},
  nail:    {name: 'Clou', ic: 'Parts_Cog', mat: true},
  paint:   {name: 'Peinture', ic: 'Food_Barrel_Empty', mat: true},
  axe:     {name: 'Hache', ic: 'Wood_Log_A', mat: true},
  saw:     {name: 'Scie', ic: 'Wood_Planks_Stack_Small', mat: true},
};

export const CROPS = {
  wheat:   {time: 20, cost: 0, lvl: 1, stages: ['crops_wheatStageA', 'crops_wheatStageB']},
  carrot:  {time: 60, cost: 1, lvl: 2, stages: ['crops_leafsStageA', 'crop_carrot']},
  corn:    {time: 120, cost: 2, lvl: 3, stages: ['crops_cornStageB', 'crops_cornStageD']},
  beet:    {time: 240, cost: 3, lvl: 5, stages: ['crops_leafsStageA', 'crop_turnip']},
  pumpkin: {time: 480, cost: 5, lvl: 7, stages: ['crops_leafsStageB', 'crop_pumpkin']},
  berry:   {time: 720, cost: 6, lvl: 9, stages: ['crops_leafsStageB', 'crops_leafsStageB']},
};

/* ===================== BÂTIMENTS ===================== */
// kind : field | pen | factory | house | town | orders | barn | deco ; w,h : emprise en cases
export const BUILDINGS = {
  field:    {name: 'Champ', kind: 'field', w: 2, h: 2, cost: 15, lvl: 1, time: 0, costStep: 8, cat: 'farm', desc: 'Plante et récolte des cultures.'},
  henhouse: {name: 'Poulailler', kind: 'pen', w: 3, h: 3, cost: 60, lvl: 1, time: 5, cat: 'farm', animal: 'animal-chick', feed: 'wheat', prod: 'egg', ptime: 40, slots: 3, desc: 'Les poules mangent du blé et pondent des œufs.'},
  cowshed:  {name: 'Étable', kind: 'pen', w: 3, h: 3, cost: 250, lvl: 3, time: 15, cat: 'farm', animal: 'animal-cow', feed: 'corn', prod: 'milk', ptime: 90, slots: 3, desc: 'Les vaches mangent du maïs et donnent du lait.'},
  bunny:    {name: 'Clapier des lapins angora', kind: 'pen', w: 3, h: 3, cost: 700, lvl: 6, time: 30, cat: 'farm', animal: 'animal-bunny', feed: 'carrot', prod: 'wool', ptime: 150, slots: 3, desc: 'Les lapins angora mangent des carottes et donnent de la laine.'},
  bakery:   {name: 'Boulangerie', kind: 'factory', w: 3, h: 3, cost: 120, lvl: 2, time: 10, cat: 'factory', pop: 0, desc: 'Pain, biscuits et pain d’épices.', recipes: {
    bread: {in: {wheat: 3}, time: 30, lvl: 2}, cookie: {in: {wheat: 2, egg: 1}, time: 75, lvl: 2}, ginger: {in: {wheat: 2, sugar: 1, egg: 1}, time: 180, lvl: 5}}},
  dairy:    {name: 'Laiterie', kind: 'factory', w: 3, h: 3, cost: 400, lvl: 4, time: 25, cat: 'factory', pop: 20, desc: 'Crème, fromage et flan.', recipes: {
    cream: {in: {milk: 1}, time: 60, lvl: 4}, cheese: {in: {milk: 2}, time: 150, lvl: 4}, pudding: {in: {milk: 1, sugar: 1, egg: 1}, time: 240, lvl: 6}}},
  sugarmill:{name: 'Sucrerie', kind: 'factory', w: 3, h: 3, cost: 650, lvl: 5, time: 35, cat: 'factory', pop: 30, desc: "Sucre et sucres d'orge.", recipes: {
    sugar: {in: {beet: 1}, time: 60, lvl: 5}, cane: {in: {sugar: 1, berry: 1}, time: 210, lvl: 9}}},
  pastry:   {name: 'Pâtisserie', kind: 'factory', w: 3, h: 3, cost: 1200, lvl: 7, time: 60, cat: 'factory', pop: 45, desc: 'Cupcakes, beignets, tartes et bûches de Noël.', recipes: {
    cupcake: {in: {wheat: 2, egg: 1, sugar: 1}, time: 150, lvl: 7}, pie: {in: {pumpkin: 1, wheat: 2, egg: 1}, time: 240, lvl: 8}, donut: {in: {wheat: 2, sugar: 1, cream: 1}, time: 270, lvl: 8}, cake: {in: {wheat: 2, milk: 1, egg: 2, sugar: 1}, time: 420, lvl: 10}}},
  toyshop:  {name: 'Atelier de jouets', kind: 'factory', w: 3, h: 3, cost: 2000, lvl: 9, time: 90, cat: 'factory', pop: 60, desc: 'Écharpes, ours en peluche et chaussettes garnies.', recipes: {
    scarf: {in: {wool: 2}, time: 240, lvl: 9}, teddy: {in: {wool: 2, cream: 1}, time: 360, lvl: 9}, sock: {in: {wool: 1, cane: 1, cookie: 1}, time: 480, lvl: 11}}},
  cabin:    {name: 'Chalet de lutin', kind: 'house', w: 2, h: 2, cost: 40, costStep: 30, lvl: 1, time: 5, cat: 'house', pop: 8, desc: '+8 habitants.'},
  bighouse: {name: 'Grande maison', kind: 'house', w: 3, h: 3, cost: 450, costStep: 150, lvl: 6, time: 30, cat: 'house', pop: 20, desc: '+20 habitants.'},
  grocery:  {name: 'Épicerie du village', kind: 'town', w: 3, h: 3, cost: 150, lvl: 2, time: 15, cat: 'town', cap: 30, desc: '+30 places de population.'},
  school:   {name: 'École des lutins', kind: 'town', w: 3, h: 3, cost: 600, lvl: 5, time: 40, cat: 'town', cap: 50, desc: '+50 places de population.'},
  postoffice:{name: 'Poste', kind: 'town', w: 3, h: 3, cost: 1500, lvl: 8, time: 60, cat: 'town', cap: 80, desc: '+80 places de population.'},
  tree:     {name: 'Sapin décoré', kind: 'deco', w: 1, h: 1, cost: 30, lvl: 1, cat: 'deco', desc: '+2 XP'},
  lantern:  {name: 'Lampadaire', kind: 'deco', w: 1, h: 1, cost: 20, lvl: 2, cat: 'deco', desc: '+1 XP'},
  snowman:  {name: 'Bonhomme de neige', kind: 'deco', w: 1, h: 1, cost: 60, lvl: 3, cat: 'deco', desc: '+3 XP'},
  path:     {name: 'Allée pavée', kind: 'path', w: 1, h: 1, cost: 5, lvl: 1, cat: 'deco', desc: 'Relie tes bâtiments.'},
  bench:    {name: 'Banc', kind: 'deco', w: 1, h: 1, cost: 40, lvl: 2, cat: 'deco', desc: '+2 XP'},
  gifts:    {name: 'Pile de cadeaux', kind: 'deco', w: 1, h: 1, cost: 80, lvl: 3, cat: 'deco', desc: '+4 XP'},
  candy:    {name: "Sucre d'orge géant", kind: 'deco', w: 1, h: 1, cost: 50, lvl: 4, cat: 'deco', desc: '+3 XP'},
  reindeer: {name: 'Renne', kind: 'deco', w: 1, h: 1, cost: 150, lvl: 5, cat: 'deco', desc: '+6 XP'},
  // bâtiments uniques déjà présents au départ
  orders:   {name: 'Bureau du traîneau', kind: 'orders', w: 3, h: 3, unique: true, desc: 'Les enfants passent commande : livre-les pour gagner pièces et XP.'},
  barn:     {name: 'Grange', kind: 'barn', w: 3, h: 3, unique: true, desc: 'Stocke tes récoltes et tes produits.'},
  santa:    {name: 'Maison du Père Noël', kind: 'hq', w: 4, h: 4, unique: true, desc: 'Le cœur du village.'},
};
export const CATS = [['farm', 'Ferme'], ['factory', 'Usines'], ['house', 'Maisons'], ['town', 'Village'], ['deco', 'Déco']];

/* ===================== NIVEAUX ===================== */
export const xpNeed = L => Math.round(14 * Math.pow(L, 1.55) + 6 * L);
export const unlocksAt = L => {
  const out = [];
  for (const [k, b] of Object.entries(BUILDINGS)) if (b.lvl === L) out.push(b.name);
  for (const [k, c] of Object.entries(CROPS)) if (c.lvl === L) out.push(ITEMS[k].name);
  for (const b of Object.values(BUILDINGS)) for (const [k, r] of Object.entries(b.recipes || {})) if (r.lvl === L && r.lvl !== b.lvl) out.push(ITEMS[k].name);
  return out;
};

/* ===================== CARTE ===================== */
export const MAP = 44;            // carte de 44 x 44 cases
export const CHUNK = 11;          // agrandissements de 11 x 11 cases
export const START_CHUNKS = ['1,1', '2,1', '1,2', '2,2'];   // centre ouvert au départ (22 x 22)
export const chunkCost = n => ({coins: Math.round(300 * Math.pow(1.7, n)), axe: 1 + n, saw: 1 + Math.floor(n / 2)});

/* ===================== ÉTAT ===================== */
const KEY = 'village-du-pole-v4';
let uid = 1;
const nid = () => 'o' + (uid++) + Math.random().toString(36).slice(2, 5);

export function newTown(){
  const s = {
    v: 4, coins: 250, stars: 15, xp: 0, lvl: 1, barnLvl: 1,
    inv: {wheat: 6, plank: 1, nail: 1},
    objs: [], chunks: [...START_CHUNKS], orders: [], tuto: 0, t: Date.now(), stats: {orders: 0, harvest: 0, made: 0},
    cnt: {}, quest: {i: 0, base: {}}, daily: {last: '', streak: 0},
  };
  // pose un objet seulement si la place est libre (le décor remplit les trous sans écraser les bâtiments)
  const free = (type, x, y) => { const b = BUILDINGS[type]; return !s.objs.some(o => { const ob = BUILDINGS[o.type]; return x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y; }); };
  const add = (type, x, y, extra = {}) => { if (free(type, x, y)) s.objs.push({id: nid(), type, x, y, ...extra}); };
  add('santa', 19, 18);
  add('orders', 15, 25);
  add('barn', 25, 24);
  for (const [x, y] of [[13, 15], [15, 15], [13, 17], [15, 17], [13, 19], [15, 19]]) add('field', x, y, {crop: 'wheat', ready: Date.now() - 1000});
  add('henhouse', 25, 15, {fed: 0, ready: 0});
  add('cabin', 20, 24); add('cabin', 22, 24);
  decorate(s);
  s.orders = Array.from({length: 9}, (_, i) => i < 4 ? makeOrder(s, i) : {wait: Date.now() + (i - 3) * 8000});
  return s;
}
// allées et décor du village de départ (aussi ajoutés aux anciennes parties qui n'en ont pas)
export function decorate(s){
  const free = (type, x, y) => { const b = BUILDINGS[type]; return !s.objs.some(o => { const ob = BUILDINGS[o.type]; return x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y; }); };
  const add = (type, x, y, extra = {}) => { if (free(type, x, y)) s.objs.push({id: nid(), type, x, y, ...extra}); };
  // allées : une grande rue et des embranchements vers chaque bâtiment
  for (let x = 12; x <= 31; x++) add('path', x, 22);
  for (let y = 14; y <= 21; y++) add('path', 23, y);
  for (let y = 14; y <= 21; y++) add('path', 17, y);
  for (let y = 23; y <= 29; y++) add('path', 19, y);
  for (let x = 14; x <= 29; x++) add('path', x, 29);
  for (let y = 23; y <= 28; y++) add('path', 24, y);
  for (let x = 24; x <= 28; x++) add('path', x, 18);
  // décor de départ : on doit avoir l'impression d'un village vivant dès la première seconde
  for (const [t, x, y] of [['lantern', 18, 21], ['lantern', 22, 23], ['lantern', 16, 23], ['lantern', 25, 21], ['lantern', 18, 28], ['lantern', 25, 28], ['lantern', 29, 23],
    ['bench', 21, 23], ['bench', 16, 21], ['gifts', 18, 17], ['gifts', 23, 23], ['reindeer', 18, 26], ['reindeer', 20, 28], ['snowman', 28, 20], ['snowman', 13, 23], ['candy', 22, 17], ['candy', 18, 23]]) add(t, x, y);
  let r = 11; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 140; i++){ // sapins le long des bords et dans les recoins
    const edge = rnd() < .7, x = edge ? (rnd() < .5 ? 11 + Math.floor(rnd() * 2) : 31 + Math.floor(rnd() * 2)) : 11 + Math.floor(rnd() * 22), y = edge && rnd() < .5 ? 11 + Math.floor(rnd() * 22) : (rnd() < .5 ? 11 + Math.floor(rnd() * 3) : 30 + Math.floor(rnd() * 3));
    add('tree', edge && rnd() < .5 ? x : 11 + Math.floor(rnd() * 22), y, {wild: 1});
  }
}
export function loadTown(){ try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 4){ s.cnt ||= {}; s.quest ||= {i: 0, base: {}}; s.daily ||= {last: '', streak: 0}; if (!s.objs.some(o => o.type === 'path')) decorate(s); return s; } } catch(e){} return null; }
export function saveTown(s){ s.t = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){} }
export function clearTown(){ try { localStorage.removeItem(KEY); } catch(e){} }

/* ===================== RÈGLES ===================== */
export const barnCap = s => 50 + (s.barnLvl - 1) * 25;
export const barnUsed = s => Object.entries(s.inv).reduce((a, [k, n]) => a + (ITEMS[k]?.mat ? 0 : n), 0);
export const barnUpCost = s => ({plank: 1 + s.barnLvl, nail: 1 + s.barnLvl, paint: s.barnLvl});
export const pop = s => s.objs.reduce((a, o) => a + (BUILDINGS[o.type].kind === 'house' && !o.build ? BUILDINGS[o.type].pop : 0), 0);
export const popCap = s => 40 + s.objs.reduce((a, o) => a + (BUILDINGS[o.type].kind === 'town' && !o.build ? BUILDINGS[o.type].cap : 0), 0);
export const countOf = (s, type) => s.objs.filter(o => o.type === type && !o.wild).length;
export function buildCost(s, type){
  const b = BUILDINGS[type], n = countOf(s, type);
  if (b.kind === 'deco' || b.kind === 'path') return b.cost;
  if (b.kind === 'field') return Math.round(b.cost + n * b.costStep + Math.max(0, n - 10) * 15);
  if (b.costStep) return b.cost + n * b.costStep;
  return Math.round(b.cost * Math.pow(1.6, n));
}
export const maxOf = (s, type) => {
  const b = BUILDINGS[type];
  if (b.kind === 'field') return 6 + s.lvl * 2;
  if (b.kind === 'house') return 2 + Math.floor(s.lvl * 1.5);
  if (b.kind === 'pen') return 1 + Math.floor(s.lvl / 8);
  if (b.kind === 'factory') return 1;
  if (b.kind === 'town') return 1;
  return 99;
};
export function buildBlock(s, type){
  const b = BUILDINGS[type];
  if (s.lvl < b.lvl) return `Niveau ${b.lvl}`;
  if (countOf(s, type) >= maxOf(s, type)) return b.kind === 'field' ? 'Plus de champs à ce niveau' : 'Déjà construit';
  if (b.kind === 'house' && pop(s) + b.pop > popCap(s)) return 'Il faut plus de place : construis un bâtiment du village';
  if (b.pop && pop(s) < b.pop) return `Il faut ${b.pop} habitants`;
  if (s.coins < buildCost(s, type)) return 'Pas assez de pièces';
  return null;
}
export const has = (s, req) => Object.entries(req).every(([k, n]) => (s.inv[k] || 0) >= n);
export const take = (s, req) => { for (const [k, n] of Object.entries(req)) s.inv[k] = (s.inv[k] || 0) - n; };
export function give(s, k, n = 1){ s.inv[k] = (s.inv[k] || 0) + n; }
export const barnFull = (s, n = 1) => barnUsed(s) + n > barnCap(s);

export function addXp(s, n){
  s.xp += n; let up = 0;
  while (s.xp >= xpNeed(s.lvl)){ s.xp -= xpNeed(s.lvl); s.lvl++; up++; }
  return up;
}

/* ===================== COMMANDES DU TRAÎNEAU ===================== */
const KIDS = ['Léa', 'Hugo', 'Inès', 'Noah', 'Jade', 'Lucas', 'Chloé', 'Adam', 'Manon', 'Gabriel', 'Lina', 'Louis', 'Emma', 'Nathan', 'Zoé', 'Sacha', 'Alice', 'Rayan', 'Mia', 'Tom', 'Lutin Bruno', 'Lutine Paillette', 'Mère Noël'];
export function available(s){
  // ce que le joueur sait produire à son niveau
  const out = Object.keys(CROPS).filter(k => CROPS[k].lvl <= s.lvl);
  for (const o of s.objs){
    const b = BUILDINGS[o.type];
    if (b.kind === 'pen' && !out.includes(b.prod)) out.push(b.prod);
    if (b.recipes) for (const [k, r] of Object.entries(b.recipes)) if (r.lvl <= s.lvl && !out.includes(k)) out.push(k);
  }
  return out;
}
export function makeOrder(s, salt = 0){
  const av = available(s), n = 1 + (Math.random() < .45 ? 1 : 0) + (s.lvl >= 4 && Math.random() < .3 ? 1 : 0);
  const pool = [...av].sort(() => Math.random() - .5), items = {};
  for (const k of pool.slice(0, n)){ const v = ITEMS[k].v; items[k] = Math.max(1, Math.round((1 + Math.random() * (2 + s.lvl / 3)) * (v < 10 ? 1.6 : v < 40 ? 1 : .6))); }
  const value = Object.entries(items).reduce((a, [k, q]) => a + ITEMS[k].v * q, 0);
  const xp = Object.entries(items).reduce((a, [k, q]) => a + ITEMS[k].xp * q, 0);
  const o = {kid: KIDS[Math.floor(Math.random() * KIDS.length)], items, coins: Math.round(value * 1.5 + 5), xp: Math.round(xp * 2.2 + 2)};
  if (Math.random() < .25) o.mat = ['plank', 'nail', 'paint', 'axe', 'saw'][Math.floor(Math.random() * (s.lvl >= 3 ? 5 : 3))];
  return o;
}
// une chance d'obtenir un matériau en récoltant (comme les outils de Township)
export const dropChance = .06;
export const DROPS = ['plank', 'nail', 'paint', 'axe', 'saw'];

/* ===================== TÂCHES (fil d'objectifs, comme les quêtes de Township) ===================== */
// k : compteur suivi (track) ; 'lvl' = niveau atteint. La récompense arrive à chaque tâche terminée.
export const QUESTS = [
  {t: 'Récolte 6 champs de blé', k: 'harvest:wheat', n: 6, r: {coins: 25, xp: 6}},
  {t: 'Livre 2 commandes du traîneau', k: 'orders', n: 2, r: {coins: 40, xp: 8}},
  {t: 'Ramasse les œufs du poulailler', k: 'collect:egg', n: 3, r: {coins: 30, xp: 6}},
  {t: 'Construis 2 champs', k: 'build:field', n: 2, r: {coins: 40, xp: 8}},
  {t: 'Atteins le niveau 2', k: 'lvl', n: 2, r: {coins: 50, stars: 2}},
  {t: 'Construis la boulangerie', k: 'build:bakery', n: 1, r: {coins: 60, xp: 10}},
  {t: 'Fabrique 3 pains', k: 'make:bread', n: 3, r: {coins: 50, xp: 10}},
  {t: 'Plante 4 champs de carottes', k: 'plant:carrot', n: 4, r: {coins: 40, xp: 8}},
  {t: "Construis l'épicerie du village", k: 'build:grocery', n: 1, r: {coins: 80, stars: 2}},
  {t: 'Construis un chalet de lutin', k: 'build:cabin', n: 1, r: {coins: 60, xp: 10}},
  {t: 'Livre 6 commandes', k: 'orders', n: 6, r: {coins: 120, xp: 20}},
  {t: 'Atteins le niveau 3', k: 'lvl', n: 3, r: {coins: 100, stars: 3}},
  {t: "Construis l'étable", k: 'build:cowshed', n: 1, r: {coins: 100, xp: 15}},
  {t: 'Fabrique 4 biscuits', k: 'make:cookie', n: 4, r: {coins: 90, xp: 15}},
  {t: 'Récolte 10 champs de maïs', k: 'harvest:corn', n: 10, r: {coins: 90, xp: 15}},
  {t: 'Atteins le niveau 4', k: 'lvl', n: 4, r: {coins: 150, stars: 3}},
  {t: 'Construis la laiterie', k: 'build:dairy', n: 1, r: {coins: 150, xp: 20}},
  {t: 'Fabrique 3 crèmes', k: 'make:cream', n: 3, r: {coins: 120, xp: 20}},
  {t: 'Agrandis la grange', k: 'barnup', n: 1, r: {coins: 150, stars: 2}},
  {t: 'Dégage un nouveau terrain', k: 'expand', n: 1, r: {coins: 200, stars: 5}},
];
const GEN = [['orders', 'Livre %n commandes', 5], ['harvest', 'Récolte %n champs', 20], ['make', 'Fabrique %n produits en usine', 8], ['collect', 'Ramasse %n produits des animaux', 12]];
export function questAt(s, i){
  if (i < QUESTS.length) return QUESTS[i];
  const j = i - QUESTS.length, g = GEN[j % GEN.length], n = g[2] + Math.floor(j / GEN.length) * Math.ceil(g[2] / 2);
  return {t: g[1].replace('%n', n), k: g[0], n, r: {coins: 60 + s.lvl * 25, xp: 10 + s.lvl * 4, stars: j % 3 === 2 ? 2 : 0}};
}
export function track(s, key, n = 1){
  s.cnt[key] = (s.cnt[key] || 0) + n;
  const base = key.split(':')[0]; if (base !== key) s.cnt[base] = (s.cnt[base] || 0) + n;
}
export function questProgress(s){
  const q = questAt(s, s.quest.i);
  const v = q.k === 'lvl' ? s.lvl : (s.cnt[q.k] || 0) - (s.quest.base[q.k] || 0);
  return {q, v: Math.min(q.n, v), done: v >= q.n};
}
export function questClaim(s){
  const {q, done} = questProgress(s); if (!done) return null;
  s.quest.i++; const nq = questAt(s, s.quest.i); s.quest.base = {[nq.k]: s.cnt[nq.k] || 0};
  return q.r;
}

/* ===================== CADEAU DU JOUR (série de 7 jours) ===================== */
export const DAILY = [{coins: 50}, {coins: 80, plank: 1}, {stars: 3}, {coins: 150, nail: 1}, {coins: 200, paint: 1}, {stars: 5, axe: 1}, {stars: 10, coins: 300, saw: 1}];
const day = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
export const dailyReady = s => s.daily.last !== day();
export function dailyClaim(s){
  if (!dailyReady(s)) return null;
  const yest = day(Date.now() - 864e5);
  s.daily.streak = s.daily.last === yest ? s.daily.streak + 1 : 1;
  s.daily.last = day();
  return DAILY[(s.daily.streak - 1) % 7];
}
