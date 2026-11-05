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
  paper:  {name: 'Papier cadeau', ic: 'present_A_red'},
  ginger: {name: 'Bonhomme en pain d’épices', ic: 'gingerbread-man', toy: true},
  choco:  {name: 'Chocolat chaud', ic: 'hot_chocolate_decorated', toy: true},
  wagon:  {name: 'Wagon de cadeaux', ic: 'train_tender_presents_A', toy: true},
  wreath: {name: 'Couronne de l’Avent', ic: 'wreath-decorated', toy: true},
  ball:   {name: 'Boule de Noël', ic: 'present_sphere_A_red', toy: true},
  lamp:   {name: 'Lanterne magique', ic: 'lantern_decorated', toy: true},
  minitree: {name: 'Petit sapin', ic: 'christmas_tree_decorated', toy: true},
  snowball: {name: 'Lance-boules de neige', ic: 'snowball_pile', toy: true},
  gbhouse: {name: 'Maison en pain d’épices', ic: 'gingerbread_house_decorated', toy: true},
  bigsled: {name: 'Grand traîneau', ic: 'sled-long', toy: true},
  // outils pour dégager la forêt (lettres, train, mini-jeux, tâches)
  axe:    {name: 'Hache', ic: 'Wood_Log_A', mat: true},
  saw:    {name: 'Scie', ic: 'Wood_Planks_Stack_Small', mat: true},
  // matériaux rares, sans plafond : ils se farment à la Grotte aux cristaux et avec les expéditions des rennes,
  // et les gros niveaux de bâtiment les exigent (comme l'élixir noir de Clash of Clans ou les minerais de DoA)
  ice:    {name: 'Cristal de glace', ic: 'Gems_Chest', mat: true, rare: true},
  gold:   {name: "Lingot d'or polaire", ic: 'Gold_Bars_Stack_Small', mat: true, rare: true},
};
export const RARE = ['ice', 'gold'];
export const RES = ['coins', 'wood', 'cookies', 'fabric'];

// jouets : coût, temps de fabrication (s), XP, valeur, niveau joueur requis
export const TOYS = {
  train: {cost: {wood: 30}, time: 30, xp: 4, value: 40, lvl: 1},
  box:   {cost: {cookies: 30}, time: 45, xp: 5, value: 50, lvl: 1},
  sled:  {cost: {wood: 60}, time: 90, xp: 8, value: 80, lvl: 3},
  plush: {cost: {fabric: 25}, time: 120, xp: 10, value: 100, lvl: 4},
  nut:   {cost: {wood: 50, fabric: 25}, time: 240, xp: 16, value: 170, lvl: 6},
  cane:  {cost: {cookies: 60, wood: 30}, time: 200, xp: 14, value: 150, lvl: 7},
  sock:  {cost: {fabric: 45, cookies: 40}, time: 360, xp: 22, value: 260, lvl: 9},
  bell:  {cost: {wood: 120, fabric: 60, coins: 300}, time: 600, xp: 40, value: 520, lvl: 12},
  ginger:  {cost: {cookies: 90, fabric: 20}, time: 420, xp: 13, value: 320, lvl: 14},
  choco:   {cost: {cookies: 120, coins: 200}, time: 480, xp: 15, value: 380, lvl: 16},
  wagon:   {cost: {wood: 160, fabric: 60}, time: 720, xp: 22, value: 560, lvl: 18},
  wreath:  {cost: {wood: 90, fabric: 90, ice: 2}, time: 900, xp: 26, value: 680, lvl: 21},
  ball:    {cost: {fabric: 120, coins: 400, ice: 3}, time: 1080, xp: 30, value: 800, lvl: 24},
  lamp:    {cost: {wood: 200, coins: 600, ice: 4}, time: 1500, xp: 37, value: 1000, lvl: 27},
  minitree:{cost: {wood: 260, fabric: 120, ice: 5}, time: 1800, xp: 44, value: 1250, lvl: 31},
  snowball:{cost: {wood: 300, cookies: 200, gold: 1}, time: 2400, xp: 55, value: 1600, lvl: 35},
  gbhouse: {cost: {cookies: 500, wood: 250, gold: 2}, time: 3000, xp: 70, value: 2100, lvl: 40},
  bigsled: {cost: {wood: 600, fabric: 300, gold: 3, ice: 8}, time: 3600, xp: 90, value: 2800, lvl: 45},
  // pas un jouet : sert à emballer les jouets d'une lettre (+50 % de pièces et d'XP)
  paper: {cost: {wood: 20, cookies: 15}, time: 60, xp: 2, value: 0, lvl: 3, wrap: true},
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
  icewell:  {name: 'Puits de cristaux', kind: 'prod', res: 'ice', rate: 3, w: 3, h: 3, unique: true, cost: {coins: 2500, wood: 1500, cookies: 600}, time: 120, hq: 7,
             desc: 'Les lutins remontent des cristaux de glace du fond du puits, tout doucement mais sans s’arrêter.'},
  foundry:  {name: 'Fonderie d’or polaire', kind: 'prod', res: 'gold', rate: .5, w: 3, h: 3, unique: true, cost: {coins: 9000, wood: 5000, cookies: 2000, ice: 40}, time: 300, hq: 11,
             desc: 'Le minerai des aurores fondu en lingots d’or polaire. Rare, précieux, indispensable aux grands chantiers.'},
  mine:     {name: 'Grotte aux cristaux', kind: 'mine', w: 3, h: 3, unique: true, cost: {coins: 900, wood: 700, cookies: 250}, time: 60, hq: 5,
             desc: 'Creuse la glace étage par étage : cristaux, lingots et colis perdus t’attendent. Plus on descend, plus c’est riche.'},
  library:  {name: 'Bibliothèque des lutins', kind: 'lab', w: 3, h: 3, unique: true, cost: {coins: 3000, wood: 2000, cookies: 800, ice: 15}, time: 180, hq: 6,
             desc: 'Les lutins savants y cherchent des secrets : chaque recherche donne un bonus pour toujours.'},
  theater:  {name: 'Théâtre de marionnettes', kind: 'fun', w: 3, h: 3, unique: true, cost: {coins: 600, wood: 400, fabric: 100}, time: 60, hq: 5,
             desc: 'Des spectacles pour les lutins : le bonheur augmente toute la production.'},
  tree:     {name: 'Sapin décoré', kind: 'deco', w: 1, h: 1, cost: {coins: 40}, joy: 2, hq: 1, desc: '+2 bonheur'},
  lantern:  {name: 'Lampadaire', kind: 'deco', w: 1, h: 1, cost: {coins: 30, wood: 10}, joy: 1, hq: 1, desc: '+1 bonheur'},
  bench:    {name: 'Banc', kind: 'deco', w: 1, h: 1, cost: {coins: 50, wood: 30}, joy: 2, hq: 2, desc: '+2 bonheur'},
  snowman:  {name: 'Bonhomme de neige', kind: 'deco', w: 1, h: 1, cost: {coins: 80, cookies: 20}, joy: 3, hq: 2, desc: '+3 bonheur'},
  candy:    {name: "Sucre d'orge géant", kind: 'deco', w: 1, h: 1, cost: {coins: 120, cookies: 40}, joy: 4, hq: 3, desc: '+4 bonheur'},
  gifts:    {name: 'Pile de cadeaux', kind: 'deco', w: 1, h: 1, cost: {coins: 150, fabric: 20}, joy: 5, hq: 4, desc: '+5 bonheur'},
  reindeer: {name: 'Renne', kind: 'deco', w: 1, h: 1, cost: {coins: 300, cookies: 80}, joy: 8, hq: 5, desc: '+8 bonheur'},
  lampdd:   {name: "Lanterne de fête", kind: 'deco', w: 1, h: 1, cost: {coins: 180, wood: 40}, joy: 4, hq: 3, desc: '+4 bonheur'},
  snowman2d: {name: "Bonhomme au chapeau", kind: 'deco', w: 1, h: 1, cost: {coins: 220, cookies: 60}, joy: 5, hq: 4, desc: '+5 bonheur'},
  wreathdd: {name: "Couronne de porte", kind: 'deco', w: 1, h: 1, cost: {coins: 200, fabric: 40}, joy: 5, hq: 4, desc: '+5 bonheur'},
  chocod:   {name: "Stand de chocolat chaud", kind: 'deco', w: 1, h: 1, cost: {coins: 350, cookies: 120}, joy: 7, hq: 5, desc: '+7 bonheur'},
  gingerd:  {name: "Couple en pain d’épices", kind: 'deco', w: 1, h: 1, cost: {coins: 420, cookies: 160}, joy: 8, hq: 6, desc: '+8 bonheur'},
  xtreed:   {name: "Grand sapin illuminé", kind: 'deco', w: 1, h: 1, cost: {coins: 600, wood: 200}, joy: 10, hq: 7, desc: '+10 bonheur'},
  present3d: {name: "Cadeaux géants", kind: 'deco', w: 1, h: 1, cost: {coins: 700, fabric: 150}, joy: 11, hq: 8, desc: '+11 bonheur'},
  nutdd:    {name: "Garde casse-noisette", kind: 'deco', w: 1, h: 1, cost: {coins: 900, wood: 250}, joy: 13, hq: 9, desc: '+13 bonheur'},
  bellgd:   {name: "Cloche dorée", kind: 'deco', w: 1, h: 1, cost: {coins: 1200, ice: 4}, joy: 15, hq: 10, desc: '+15 bonheur'},
  trainsetd: {name: "Petit train du village", kind: 'deco', w: 1, h: 1, cost: {coins: 1600, wood: 400, ice: 6}, joy: 18, hq: 12, desc: '+18 bonheur'},
  gbhoused: {name: "Maison en pain d’épices", kind: 'deco', w: 1, h: 1, cost: {coins: 2200, cookies: 600, ice: 8}, joy: 22, hq: 14, desc: '+22 bonheur'},
  mistled:  {name: "Gui porte-bonheur", kind: 'deco', w: 1, h: 1, cost: {coins: 2800, gold: 2}, joy: 26, hq: 16, desc: '+26 bonheur'},
  sleddd:   {name: "Traîneau d’honneur", kind: 'deco', w: 1, h: 1, cost: {coins: 3600, wood: 800, gold: 3}, joy: 32, hq: 18, desc: '+32 bonheur'},
  path:     {name: 'Allée pavée', kind: 'path', w: 1, h: 1, cost: {coins: 5}, hq: 1, desc: 'Relie tes bâtiments.'},
};
export const CATS = [['prod', 'Production'], ['town', 'Village'], ['deco', 'Déco']];
export const catOf = b => b.kind === 'prod' ? 'prod' : b.kind === 'deco' || b.kind === 'path' ? 'deco' : 'town';
export const isUpgradable = b => !['deco', 'path'].includes(b.kind);

/* ---------- chiffres par niveau (tout ce que l'amélioration change) ---------- */
const R5 = n => n < 100 ? Math.round(n) : Math.round(n / 5) * 5;
export const rate = (type, lv) => { const v = BUILDINGS[type].rate * Math.pow(1.25, lv - 1); return v < 10 ? Math.round(v * 10) / 10 : R5(v); };        // par heure
export const buffer = (type, lv) => RARE.includes(BUILDINGS[type].res) ? Math.max(1, Math.floor(rate(type, lv) * 12)) : R5(rate(type, lv) * (lv < 3 ? .5 : lv < 6 ? 2 : lv < 9 ? 6 : 12));   // stock interne : 30 min → 2 h → 6 h → une nuit
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
  for (const [k, v] of Object.entries(b.cost)) c[k] = R5(v * m * (k === 'coins' && isUpgradable(b) ? 1 + Math.pow(lv / 6, 2) : 1));   // les pièces deviennent le nerf des gros chantiers
  if (b.kind === 'hq' && lv >= 2) c.cookies = R5(70 * m / 1.6);
  if (isUpgradable(b) && lv >= 3 && !c.cookies) c.cookies = R5((b.cost.wood || 50) * .4 * m);   // les gros chantiers nourrissent les lutins
  const big = b.kind === 'hq' ? 3 : 1;
  if (isUpgradable(b) && lv >= 6) c.ice = Math.round(big * 4 * Math.pow(1.38, lv - 6));        // niv. 6+ : cristaux de glace
  if (isUpgradable(b) && lv >= 11) c.gold = Math.round(big * 2 * Math.pow(1.38, lv - 11));     // niv. 11+ : lingots d'or polaire
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
  const t = lv <= 1 ? b.time : Math.max(b.time, HQ_TIME[Math.min(lv, HQ_TIME.length - 1)] * (b.kind === 'house' || b.kind === 'storage' ? .12 : .25));   // les petits bâtiments vont plus vite
  return Math.round(Math.min(3 * D, t));
}
export const buildXp = lv => Math.round(6 * Math.pow(lv, 1.4));
export const freeFinish = 3 * 60 * 1000;     // moins de 3 min restantes : « Terminer » est gratuit (comme DoA / Clash)
export const BUILDERS = 2;                   // équipes de lutins bâtisseurs au départ (chantiers en même temps)
// Bâtisseurs en plus, comme les cabanes d'ouvriers de Clash of Clans : ils s'achètent en étoiles d'or.
export const BUILDER_PRICE = [250, 500, 1000];
export const builders = s => BUILDERS + (s.extraBuilders || 0);

/** Ce que chaque niveau donne, sous forme de lignes affichables {label, now, next}. */
export function stats(s, o, lv = o.lv){
  const b = BUILDINGS[o.type], L = (label, f, unit = '') => ({label, now: lv ? f(lv) + unit : '—', next: f(lv + 1) + unit});
  switch (b.kind){
    case 'prod': return [L(`${ITEMS[b.res].name} par heure`, l => fmtN(rate(o.type, l))), L('Stock du bâtiment', l => fmtN(buffer(o.type, l))), L('Lutins employés', l => workers(o.type, l))];
    case 'house': return [L('Lutins logés', housing)];
    case 'storage': return [L('Stock en plus (bois, biscuits, tissu)', l => '+' + fmtN(storageAdd(l)))];
    case 'craft': return [L('Places dans la file', craftSlots), L('Vitesse des lutins', l => '×' + craftSpeed(l).toFixed(2))];
    case 'orders': return [L('Lettres en même temps', orderSlots), L('Récompenses', l => '+' + Math.round((orderBonus(l) - 1) * 100) + ' %')];
    case 'stable': return [L('Expéditions en même temps', expSlots), L('Destinations', l => EXP_DEST.filter(d => d.lv <= l).length), L('Tickets de jeu', ticketsMax)];
    case 'fun': return [L('Bonheur', l => '+' + theaterJoy(l))];
    case 'lab': return [L('Niveau max des recherches', l => Math.min(RS_MAX, l * 2)), L('Domaines de recherche', l => RESEARCH.filter(r => r.lib <= l).length)];
    case 'mine': return [L('Pioches au maximum', minePicks), L('Une pioche toutes les', l => minePickMin(l) + ' min'), L('Trouvailles', l => '+' + Math.round((mineMult(l) - 1) * 100) + ' %')];
    case 'hq': return [L('Niveau max des bâtiments', l => l + 1), L('Stock de base', l => fmtN(hqStock(l))), L('Bâtiments débloqués', l => unlockCount(l))];
  }
  return [];
}
const fmtN = n => n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n).replace('.', ',');
const unlockCount = l => Object.values(BUILDINGS).filter(b => (b.hq || 1) <= l && b.kind !== 'path').length;
export const unlocksAtHq = L => Object.values(BUILDINGS).filter(b => b.hq === L && L > 1).map(b => b.name);

/* ===================== NIVEAU DU JOUEUR ===================== */
// Courbe tirée des références (Township, Hay Day, Clash of Clans, DoA ; voir research/PROGRESSION.md) :
// rafale au début (niv. 2 en ~1 min, niv. 5 en ~10 min), niv. 10 en fin de jour 1, 20 en une semaine, 30 en ~3 semaines,
// 60 en ~5 mois. Le temps par niveau est multiplié par ~1 000 entre le niveau 2 et le niveau 60.
const XP_START = [10, 25, 45, 75, 120, 180, 260];
export const xpNeed = L => L <= XP_START.length ? XP_START[L - 1] : Math.round(2.2 * Math.pow(L, 2.5) * Math.pow(Math.max(1, L / 18), 1.1) / 50) * 50;   // au-delà de 18 : de plus en plus long
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
    v: 5, coins: 200, wood: 120, cookies: 0, fabric: 0, stars: 20, xp: 0, lvl: 1,
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
export const prodMult = s => workRatio(s) * (1 + joyBonus(s) + lightsBonus(s) + showBonus(s));
export const cap = (s, r) => r === 'coins' ? Infinity : Math.round((hqStock(hqLv(s)) + s.objs.reduce((a, o) => a + (o.type === 'storage' && built(o) ? storageAdd(o.lv) : 0), 0)) * (1 + rsBonus(s, 'store')));
/** Ce qu'un bâtiment de production a accumulé (plafonné à son stock interne). */
export function stored(s, o, now = Date.now()){
  const b = BUILDINGS[o.type]; if (b.kind !== 'prod' || !built(o) || o.up) return 0;
  return Math.min(o.keeper ? keeperBuffer(o) : buffer(o.type, o.lv), Math.floor(rate(o.type, o.lv) * prodMult(s) * keeperMult(o) * zoneProd(s, b.res) * (now - o.t) / 3.6e6));
}
export function collect(s, o, now = Date.now()){
  const b = BUILDINGS[o.type], n = stored(s, o, now); if (!n) return 0;
  // matériaux rares (cristaux, lingots) : vont dans l'inventaire, sans plafond
  if (RARE.includes(b.res)){ s.inv[b.res] = (s.inv[b.res] || 0) + n; o.t = now; return n; }
  const room = Math.max(0, cap(s, b.res) - (s[b.res] || 0)), got = Math.min(n, room);
  if (!got) return -1;                                   // stock plein
  s[b.res] += got;
  // ce qui n'a pas pu rentrer reste dans le bâtiment
  const left = n - got; o.t = now - Math.round(left / (rate(o.type, o.lv) * prodMult(s) * keeperMult(o) * zoneProd(s, b.res)) * 3.6e6);
  return got;
}
export const maxOf = (s, type) => {
  const b = BUILDINGS[type], H = hqLv(s);
  if (b.unique || b.kind === 'hq') return 1;
  if (b.kind === 'house') return Math.min(12, 2 + Math.floor(H / 2));
  if (b.kind === 'prod') return Math.min(4, 1 + Math.floor(H / 5));
  if (b.kind === 'storage') return Math.min(4, 1 + Math.floor(H / 6));
  if (b.kind === 'path') return Infinity;
  return 99;
};
export const has = (s, req) => Object.entries(req).every(([k, n]) => (RES.includes(k) || k === 'stars' ? s[k] || 0 : s.inv[k] || 0) >= n);
export const take = (s, req) => { for (const [k, n] of Object.entries(req)){ if (RES.includes(k) || k === 'stars') s[k] -= n; else s.inv[k] = (s.inv[k] || 0) - n; } };
export function give(s, k, n = 1){ if (RES.includes(k) || k === 'stars') s[k] = (s[k] || 0) + n; else s.inv[k] = (s.inv[k] || 0) + n; }
export const busyBuilders = (s, now = Date.now()) => s.objs.filter(o => (o.build && o.build > now) || (o.up && o.up > now)).length;
export function buildBlock(s, type){
  const b = BUILDINGS[type];
  if ((b.hq || 1) > hqLv(s) && !(s.tokens?.[type] > 0)) return `Maison du Père Noël niv. ${b.hq}`;
  if (countOf(s, type) >= maxOf(s, type)) return b.unique ? 'Déjà construit' : 'Maximum atteint : améliore la Maison du Père Noël';
  if (isUpgradable(b) && busyBuilders(s) >= builders(s)) return 'Tous les bâtisseurs sont occupés';
  if (!(s.tokens?.[type] > 0) && !has(s, upCost(type, 1))) return 'Ressources insuffisantes';
  return null;
}
export function upBlock(s, o){
  const b = BUILDINGS[o.type];
  if (o.build || o.up) return 'Déjà en travaux';
  if (b.kind === 'hq'){ if (o.lv >= b.max) return 'Niveau maximum'; }
  else if (o.lv >= maxLv(s)) return `Améliore d'abord la Maison du Père Noël (niv. ${o.lv})`;
  if (busyBuilders(s) >= builders(s)) return 'Tous les bâtisseurs sont occupés';
  if (!has(s, upCost(o.type, o.lv + 1))) return 'Ressources insuffisantes';
  return null;
}

/* ===================== LETTRES DES ENFANTS (commandes) ===================== */
const KIDS = ['Léa', 'Hugo', 'Inès', 'Noah', 'Jade', 'Lucas', 'Chloé', 'Adam', 'Manon', 'Gabriel', 'Lina', 'Louis', 'Emma', 'Nathan', 'Zoé', 'Sacha', 'Alice', 'Rayan', 'Mia', 'Tom'];
const CITIES = ['Lyon', 'Lille', 'Brest', 'Nice', 'Paris', 'Nantes', 'Annecy', 'Bordeaux', 'Colmar', 'Marseille', 'Rennes', 'Dijon', 'Québec', 'Bruxelles', 'Genève', 'Toulouse'];
const HELLO = ['Cher Père Noël,', 'Coucou Père Noël !', 'Bonjour Père Noël,', 'Père Noël chéri,'];
const WISHES = ['pour jouer avec ma petite sœur.', 'parce que j’ai été très sage cette année !', 'pour le montrer à mes copains.', 'pour jouer avec Papi.', 'pour mettre sous le sapin.', 'pour ma chambre toute neuve.', 'et un câlin pour les rennes !', 'pour jouer dans la neige.'];
const ARTICLE = {train: 'un', box: 'une', sled: 'une', plush: 'un', nut: 'un', cane: 'un', sock: 'une', bell: 'une', ginger: 'un', choco: 'un', wagon: 'un', wreath: 'une', ball: 'une', lamp: 'une', minitree: 'un', snowball: 'un', gbhouse: 'une', bigsled: 'un'};
export const TOY_KEYS = Object.keys(TOYS).filter(k => !TOYS[k].wrap);
export const toysAvailable = s => TOY_KEYS.filter(k => TOYS[k].lvl <= s.lvl);
export function makeOrder(s, bureauLv = 1){
  const av = toysAvailable(s), n = av.length > 1 && Math.random() < .4 ? 2 : 1, items = {};
  for (const k of [...av].sort(() => Math.random() - .5).slice(0, n)) items[k] = 1 + Math.floor(Math.random() * Math.min(3, 1 + s.lvl / 3));
  const value = Object.entries(items).reduce((a, [k, q]) => a + TOYS[k].value * q, 0), xp = Object.entries(items).reduce((a, [k, q]) => a + TOYS[k].xp * q, 0);
  const m = orderBonus(bureauLv);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const used = new Set((s.orders || []).map(o => o?.kid)), kid = pick(KIDS.filter(k => !used.has(k)).length ? KIDS.filter(k => !used.has(k)) : KIDS);
  const first = Object.keys(items)[0], why = pick(WISHES);
  const o = {kid, age: 4 + Math.floor(Math.random() * 7), city: pick(CITIES), msg: `${pick(HELLO)} je voudrais ${ARTICLE[first] || 'un'} ${ITEMS[first].name.toLowerCase()} ${why}`, items, coins: Math.round(value * 1.3 * m * (1 + zoneB(s, 'letters'))), xp: Math.round(xp * 1.6 * m * (1 + s.lvl * .12))};
  const r = Math.random();
  if (r < .2) o.mat = Math.random() < .6 ? 'axe' : 'saw'; else if (r < .23) o.stars = 1;   // étoiles d'or : rares
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
  {t: 'Construis la Grotte aux cristaux', k: 'have:mine', n: 1, r: {coins: 600, xp: 40}},
  {t: 'Creuse 10 cases dans la grotte', k: 'dig', n: 10, r: {ice: 8, xp: 30}},
  {t: 'Envoie les rennes en expédition', k: 'exp', n: 1, r: {cookies: 300, xp: 30}},
  {t: 'Ouvre 3 colis mystère', k: 'parcel', n: 3, r: {coins: 800, stars: 2, xp: 40}},
  {t: 'Allume les illuminations du village', k: 'lights', n: 1, r: {coins: 1000, xp: 40}},
  {t: "Descends à l'étage 5 de la grotte", k: 'floor', n: 4, r: {ice: 20, xp: 50}},
  {t: "Améliore la Maison du Père Noël au niveau 6", k: 'level:santa', n: 6, r: {coins: 1500, stars: 4, xp: 80}},
  {t: "Lance 3 commandes spéciales dans les ateliers", k: 'job', n: 3, r: {coins: 600, xp: 50}},
  {t: "Emballe 5 jouets avec du papier cadeau", k: 'wrap', n: 5, r: {fabric: 200, xp: 50}},
  {t: "Fais affaire avec 2 visiteurs", k: 'visitor', n: 2, r: {coins: 800, stars: 2, xp: 60}},
  {t: "Améliore l'Écurie des rennes au niveau 4", k: 'level:stable', n: 4, r: {cookies: 600, xp: 70}},
  {t: "Nourris les rennes 2 fois", k: 'deer', n: 2, r: {coins: 700, xp: 50}},
  {t: "Envoie 5 expéditions", k: 'exp', n: 5, r: {ice: 15, xp: 70}},
  {t: "Ouvre 8 colis mystère", k: 'parcel', n: 8, r: {coins: 1200, stars: 3, xp: 80}},
  {t: "Améliore la Grotte aux cristaux au niveau 4", k: 'level:mine', n: 4, r: {coins: 1500, xp: 80}},
  {t: "Creuse 60 cases dans la grotte", k: 'dig', n: 60, r: {ice: 25, xp: 90}},
  {t: "Descends de 10 étages", k: 'floor', n: 10, r: {gold: 3, stars: 3, xp: 100}},
  {t: "Monte 2 spectacles au Théâtre", k: 'show', n: 2, r: {coins: 1500, xp: 90}},
  {t: "Atteins 80 de bonheur", k: 'joy', n: 80, r: {coins: 2000, stars: 3, xp: 100}},
  {t: "Allume les illuminations au niveau 5", k: 'lights', n: 5, r: {ice: 20, xp: 100}},
  {t: "Les lutins donnent 3 coups de main", k: 'help', n: 3, r: {cookies: 1200, xp: 80}},
  {t: "Améliore l'Entrepôt au niveau 5", k: 'level:storage', n: 5, r: {coins: 2500, xp: 110}},
  {t: "Livre 3 grandes commandes du Nord", k: 'bulk', n: 3, r: {gold: 3, xp: 120}},
  {t: "Améliore la Maison du Père Noël au niveau 8", k: 'level:santa', n: 8, r: {coins: 4000, stars: 5, xp: 150}},
  {t: "Livre 30 lettres", k: 'orders', n: 30, r: {coins: 3000, stars: 3, xp: 150}},
  {t: "Atteins le niveau 16", k: 'lvl', n: 16, r: {coins: 3000, xp: 120}},
  {t: "Fabrique 5 bonshommes en pain d'épices", k: 'make:ginger', n: 5, r: {cookies: 1500, xp: 140}},
  {t: "Améliore l'Atelier des jouets au niveau 8", k: 'level:workshop', n: 8, r: {coins: 5000, stars: 4, xp: 160}},
  {t: "Fabrique 3 wagons de cadeaux", k: 'make:wagon', n: 3, r: {fabric: 800, gold: 2, xp: 160}},
  {t: "Améliore la Maison du Père Noël au niveau 10", k: 'level:santa', n: 10, r: {coins: 8000, stars: 8, xp: 250}},
  {t: "Livre 60 lettres", k: 'orders', n: 60, r: {coins: 6000, stars: 4, xp: 220}},
  {t: "Allume les illuminations au niveau 15", k: 'lights', n: 15, r: {gold: 6, xp: 220}},
  {t: "Atteins le niveau 25", k: 'lvl', n: 25, r: {stars: 15, gold: 5, xp: 300}},
];
const GEN = [['orders', 'Livre %n lettres', 5], ['dig', 'Creuse %n cases à la grotte', 15], ['make', 'Fabrique %n jouets', 6], ['exp', 'Envoie %n expéditions', 2], ['collect:wood', 'Récolte %n bois', 1500], ['parcel', 'Ouvre %n colis', 3], ['collect:cookies', 'Récolte %n biscuits', 1000]];
export function questAt(s, i){
  if (i < QUESTS.length) return QUESTS[i];
  const j = i - QUESTS.length, g = GEN[j % GEN.length], n = Math.round(g[2] * (1 + Math.floor(j / GEN.length) * .5));
  return {t: g[1].replace('%n', n), k: g[0], n, r: {coins: 100 + s.lvl * 40, xp: 15 + s.lvl * 5, stars: j % 3 === 2 ? 2 : 0}};
}
// crochet appelé à chaque action comptée (missions, événement…)
let trackHook = null;
export const setTrackHook = f => { trackHook = f; };
export function track(s, key, n = 1){
  trackHook?.(s, key, n);
  s.cnt[key] = (s.cnt[key] || 0) + n;
  const base = key.split(':')[0]; if (base !== key) s.cnt[base] = (s.cnt[base] || 0) + n;
}
function questValue(s, q, i){
  const [kind, what] = q.k.split(':');
  if (kind === 'lvl') return s.lvl;
  if (kind === 'joy') return joy(s);
  if (kind === 'lights') return lightsLv(s);
  if (kind === 'level') return Math.max(0, ...s.objs.filter(o => o.type === what && built(o)).map(o => o.lv || 0));
  if (kind === 'have') return s.objs.filter(o => o.type === what && built(o) && !o.free).length + (what === 'cabin' ? s.objs.filter(o => o.type === 'cabin' && o.free).length : 0);
  if (kind === 'expand') return s.chunks.length - START_CHUNKS.length;
  const total = s.cnt[q.k] || 0;
  return i >= 28 ? total - (s.quest.base[q.k] || 0) : total;   // à partir du chapitre 8 : seules les actions faites depuis le début de la tâche comptent
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
export const keeperHq = 2;
// Un gardien continue de produire pendant l'absence du joueur : 12 h au ★1, +3 h par étoile (★5 = 24 h)
export const keeperHours = o => 12 + 3 * Math.max(0, (o.keeper || 1) - 1);
export const keeperBuffer = o => Math.max(buffer(o.type, o.lv), R5(rate(o.type, o.lv) * keeperMult(o) * keeperHours(o)));     // la Maison du Père Noël niveau 2 débloque les gardiens
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
  {type: 'mine', x: 12, y: 12},
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
  {from: 22, title: 'Les trésors du Grand Nord', story: "Sous la neige dorment des cristaux et des lingots d'or polaire. Creuse la grotte, envoie les rennes au loin : les grands chantiers en auront besoin."},
  {from: 28, title: 'Le secret de Mère Noël', who: 'Mère Noël', story: "« Un bon Père Noël soigne chaque cadeau, mon chéri. » Mère Noël t'apprend l'art du papier cadeau, et des visiteurs frappent à la porte."},
  {from: 32, title: 'Les rennes du Grand Nord', who: 'Dame Rennes', story: "Rodolphe a le nez qui brille d'impatience ! Les rennes veulent voyager loin, et ils ont besoin d'être bien nourris."},
  {from: 36, title: 'Au fond de la grotte', who: 'Pic le mineur', story: "Pic le mineur a entendu un écho bizarre tout au fond de la grotte. Plus on descend, plus les cristaux brillent…"},
  {from: 39, title: 'Le grand spectacle', who: 'Monsieur Fil', story: "Monsieur Fil prépare la plus belle saison de marionnettes du Pôle. Tout le village doit briller pour l'occasion !"},
  {from: 43, title: 'La grande commande', who: 'Gros Ours', story: "Le Grand Nord tout entier passe commande. Gros Ours a besoin d'un entrepôt immense et de lutins bien organisés."},
  {from: 47, title: 'Les jouets de luxe', who: 'Maître Rouage', story: "Maître Rouage a dessiné des jouets jamais vus : pain d'épices, wagons de cadeaux… Les enfants vont adorer !"},
  {from: 51, title: 'La nuit de Noël approche', who: 'Le vieux Père Noël', story: "Le vieux Père Noël revient voir son village. « Tu es prêt pour la grande nuit, mon ami ? » Montre-lui ce dont tu es capable !"},
];
export const chapterOf = i => { let c = 0; for (let k = 0; k < CHAPTERS.length; k++) if (i >= CHAPTERS[k].from) c = k; return i >= QUESTS.length ? CHAPTERS.length : c; };

/* ===================== ALBUM DES JOUETS (collection, comme le musée de Bid Master) ===================== */
// Chaque jouet livré aux enfants remplit l'album. Paliers ★1/★2/★3 : une récompense, et chaque étoile de l'album
// augmente durablement ce que paient les lettres (+1 % par étoile).
export const ALBUM_STEPS = [3, 12, 40];
export const albumStars = (s, k) => ALBUM_STEPS.filter(n => (s.cnt['deliver:' + k] || 0) >= n).length;
export const albumTotal = s => TOY_KEYS.reduce((a, k) => a + albumStars(s, k), 0);
export const albumBonus = s => 1 + albumTotal(s) * .01;
export const albumReward = (k, star) => ({coins: Math.round(TOYS[k].value * [2, 5, 12][star - 1]), stars: star, xp: TOYS[k].xp * star * 2});
export function albumClaimable(s){
  s.album ||= {};
  const out = [];
  for (const k of TOY_KEYS){ const got = albumStars(s, k), claimed = s.album[k] || 0; for (let st = claimed + 1; st <= got; st++) out.push([k, st]); }
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
/* Chaque zone a son ambiance (teinte du sol, décor offert à l'ouverture), un niveau requis, un cadeau d'arrivée
   et un bonus permanent (comme les régions de Township). Bonus : res (production d'une ressource), all (toute la
   production), exp (durée des expéditions), picks (pioches de la grotte), letters (récompenses des lettres), sell (marché). */
export const ZONES = {
  '1,0': {lvl: 1, tint: '#2f7a4a', feat: 'pines', b: {k: 'res', res: 'wood', p: .1}, gift: {wood: 300, axe: 1}, txt: 'Les vieux sapins chuchotent des secrets de bûcheron.', decor: [['tree', 2, 2], ['tree', 7, 3], ['tree', 4, 7], ['tree', 8, 8], ['lantern', 5, 5]]},
  '0,1': {lvl: 1, tint: '#4aa8e8', feat: 'lake', b: {k: 'res', res: 'ice', p: .2}, gift: {ice: 15, coins: 300}, txt: 'Un grand lac gelé où les lutins patinent.', decor: [['snowman', 2, 8], ['bench', 8, 2], ['lantern', 8, 8]]},
  '2,0': {lvl: 5, tint: '#b8c8e8', feat: 'drifts', b: {k: 'res', res: 'fabric', p: .1}, gift: {fabric: 200, saw: 1}, txt: 'Le vent du col apporte la laine des chèvres des neiges.', decor: [['snowman2d', 3, 3], ['tree', 8, 7], ['tree', 2, 8]]},
  '3,1': {lvl: 5, tint: '#c99a5a', feat: 'hay', b: {k: 'exp', p: .1}, gift: {cookies: 300, coins: 400}, txt: 'Les rennes y broutent le lichen avant les longs voyages.', decor: [['reindeer', 3, 3], ['reindeer', 6, 7], ['reindeer', 8, 3]]},
  '0,2': {lvl: 8, tint: '#ff7fae', feat: 'candy', b: {k: 'res', res: 'cookies', p: .1}, gift: {cookies: 500, stars: 2}, txt: 'Des collines de sucre glace qui sentent la cannelle.', decor: [['candy', 2, 2], ['candy', 8, 3], ['gingerd', 5, 7], ['candy', 3, 8]]},
  '3,2': {lvl: 10, tint: '#7cc25a', feat: 'pines', b: {k: 'res', res: 'coins', p: .1}, gift: {coins: 1200, axe: 1}, txt: 'Le bois où les lutins cachent leurs économies.', decor: [['tree', 2, 3], ['lampdd', 5, 5], ['tree', 8, 2], ['tree', 7, 8]]},
  '1,3': {lvl: 12, tint: '#e8f0ff', feat: 'drifts', b: {k: 'letters', p: .1}, gift: {coins: 1500, stars: 2}, txt: 'Les lettres des enfants atterrissent ici, portées par le vent.', decor: [['gifts', 3, 3], ['present3d', 7, 6], ['lantern', 3, 8]]},
  '2,3': {lvl: 15, tint: '#8a7cff', feat: 'gems', b: {k: 'picks', n: 2}, gift: {ice: 40, gold: 3}, txt: 'Les parois brillent : la Grotte aux cristaux est toute proche.', decor: [['bellgd', 5, 5], ['tree', 2, 8], ['tree', 8, 2]]},
  '3,0': {lvl: 18, tint: '#3fe0a0', feat: 'aurora', b: {k: 'all', p: .03}, gift: {stars: 5, coins: 2500}, txt: 'Sous les aurores, tout le village travaille plus vite.', decor: [['xtreed', 5, 5], ['lampdd', 2, 2], ['lampdd', 8, 8]]},
  '0,3': {lvl: 22, tint: '#2f8fd0', feat: 'lake', b: {k: 'sell', p: .2}, gift: {coins: 4000, gold: 4}, txt: 'Les bateaux des marchands accostent au port gelé.', decor: [['chocod', 3, 3], ['bench', 7, 2], ['lantern', 2, 7]]},
  '3,3': {lvl: 26, tint: '#ffcf4a', feat: 'drifts', b: {k: 'all', p: .05}, gift: {stars: 8, ice: 60}, txt: 'La lumière du phare guide les rennes et réchauffe les ateliers.', decor: [['nutdd', 4, 4], ['lampdd', 7, 7], ['trainsetd', 2, 7]]},
  '0,0': {lvl: 30, tint: '#c9b8ff', feat: 'gems', b: {k: 'res', res: 'gold', p: .25}, gift: {stars: 12, gold: 10}, txt: 'Au sommet, les étoiles tombent en poussière d’or.', decor: [['mistled', 5, 5], ['xtreed', 2, 2], ['xtreed', 8, 8]]},
};
export const zoneOf = (cx, cy) => ZONES[`${cx},${cy}`];
export const zoneLock = (s, cx, cy) => { const z = zoneOf(cx, cy); return z && s.lvl < z.lvl ? z.lvl : 0; };
/** Somme des bonus d'un type sur les zones ouvertes. */
export function zoneB(s, k, res){
  let v = 0;
  for (const key of s.chunks || []){ const z = ZONES[key]; if (!z || z.b.k !== k || (res && z.b.res !== res)) continue; v += z.b.p ?? z.b.n; }
  return v;
}
export const zoneProd = (s, res) => 1 + zoneB(s, 'res', res) + zoneB(s, 'all') + rsBonus(s, RS_RES[res]);
export function zoneBonusText(b){
  const pc = Math.round((b.p || 0) * 100);
  switch (b.k){
    case 'res': return `+${pc} % de ${{wood: 'bois', cookies: 'biscuits', fabric: 'tissu', coins: 'pièces', ice: 'cristaux de glace', gold: 'lingots d’or polaire'}[b.res]} produits`;
    case 'all': return `+${pc} % sur toute la production`;
    case 'exp': return `Expéditions des rennes ${pc} % plus rapides`;
    case 'picks': return `+${b.n} pioches à la Grotte aux cristaux`;
    case 'letters': return `+${pc} % de pièces pour chaque lettre`;
    case 'sell': return `+${pc} % au Marché quand tu vends`;
  }
  return '';
}
/** Ouvre une zone et pose son décor offert (gratuit, sans bonheur). Le cadeau d'arrivée est remis par l'interface. */
export function openZone(s, cx, cy){
  const z = zoneOf(cx, cy); s.chunks.push(`${cx},${cy}`); if (!z) return null;
  for (const [t, dx, dy] of z.decor){ const x = cx * CHUNK + dx, y = cy * CHUNK + dy; if (!overlap(s, t, x, y)) s.objs.push({id: nid(), type: t, x, y, free: 1}); }
  return z;
}

// XP d'une récolte : fixe selon le niveau du bâtiment (sinon l'XP suivrait la production, qui grandit de façon exponentielle)
export const collectXp = o => 1 + Math.floor((o.lv || 1) / 2);


/* ===================== ÉTOILES D'OR (monnaie rare) ===================== */
// Accélérer coûte comme les gemmes de Clash of Clans : 1 min = 1, 1 h = 20, 1 jour = 260, 1 semaine = 1 000.
// Les étoiles se gagnent au compte-gouttes (niveaux, tâches, album, coffres légendaires, calendrier) ou s'achètent.
const SPEED_PTS = [[60, 1], [3600, 20], [86400, 260], [604800, 1000]];
export function speedStars(ms){
  const sec = ms / 1000; if (ms <= freeFinish) return 0;
  let v = SPEED_PTS[SPEED_PTS.length - 1][1] * sec / SPEED_PTS[SPEED_PTS.length - 1][0];
  for (let i = 1; i < SPEED_PTS.length; i++){ const [a, x] = SPEED_PTS[i - 1], [b, y] = SPEED_PTS[i]; if (sec <= b){ v = x + (y - x) * (sec - a) / (b - a); break; } }
  return Math.max(1, Math.ceil(v));
}
// Boutique : les paquets d'étoiles (le paiement sera branché avec la version App Store)
export const SHOP = [
  {k: 'p1', stars: 80, price: '1,99 €'},
  {k: 'p2', stars: 500, price: '9,99 €', tag: 'Populaire'},
  {k: 'p3', stars: 1200, price: '19,99 €'},
  {k: 'p4', stars: 2500, price: '39,99 €'},
  {k: 'p5', stars: 6500, price: '99,99 €', tag: 'Meilleure offre'},
];
// Ce que les étoiles achètent en dehors des chantiers
export const PICK_REFILL = 6;              // remplir les pioches de la grotte
export const missingStars = (s, req) => {  // acheter les ressources qui manquent (comme Clash of Clans)
  let n = 0;
  for (const [k, q] of Object.entries(req)){
    const lack = Math.max(0, q - (RES.includes(k) ? s[k] || 0 : s.inv[k] || 0)); if (!lack) continue;
    n += k === 'gold' ? lack * 6 : k === 'ice' ? lack * 1.5 : k === 'stars' ? Infinity : k === 'axe' || k === 'saw' ? lack * 15 : Math.pow(lack, .7) / 4;
  }
  return Math.ceil(n);
};

/* ===================== COLIS MYSTÈRE (raretés de Bid Master : commun, rare, épique, légendaire) ===================== */
export const RARITY = [
  {name: 'Commun', c: '#8fa3b8'},
  {name: 'Rare', c: '#3b8cff'},
  {name: 'Épique', c: '#a347ff'},
  {name: 'Légendaire', c: '#ff8a1c'},
];
export const rollRarity = odds => { let x = Math.random() * 100; for (let i = 0; i < odds.length; i++){ x -= odds[i]; if (x < 0) return i; } return 0; };
/** Contenu d'un colis : tiré au hasard à l'ouverture, toujours au moins une bonne surprise. */
export function parcelReward(s, r){
  const L = s.lvl, m = 1 + L * .25, res = ['wood', 'cookies', 'fabric'][Math.floor(Math.random() * 3)], rnd = (a, b) => a + Math.random() * (b - a);
  const out = {coins: R5(rnd(50, 90) * m * [1, 2.5, 6, 15][r])};
  out[res] = R5(rnd(30, 60) * m * [1, 2, 4, 9][r]);
  if (r >= 1) out.ice = Math.round(rnd(3, 6) * (1 + L * .12) * [0, .25, .6, 1.6][r]);
  if (r >= 1 && L >= 8) out.gold = Math.round(rnd(1, 2) * (1 + L * .08) * [0, 0, .4, 1.2][r]);
  if (r === 3) out.stars = 1 + Math.floor(Math.random() * 2);
  else if (r === 2 && Math.random() < .08) out.stars = 1;
  if (r >= 1 && Math.random() < .35) out[Math.random() < .6 ? 'axe' : 'saw'] = 1;
  return out;
}

/* ===================== GROTTE AUX CRISTAUX (fouille par étages) ===================== */
// Inspiré de la mine à paliers de Bid Master et de la mine de Township : des pioches qui se rechargent,
// une grille de neige à creuser, des trouvailles au hasard, un escalier pour descendre. Chaque étage est plus riche.
export const MINE_W = 5, MINE_N = 25;
export const minePicks = lv => 6 + Math.floor(lv / 2);
export const minePickMin = lv => Math.max(15, 45 - 2 * lv);
export const mineMult = lv => 1 + .08 * (lv - 1);
export function mineFloor(floor){
  const cells = [];
  for (let i = 0; i < MINE_N; i++){
    const x = Math.random();
    let k = 'rock';
    if (x < .40) k = 'ice'; else if (x < .55) k = 'coins'; else if (x < .61) k = 'res';
    else if (x < .72 && floor >= 3) k = 'gold'; else if (x < .70) k = 'parcel'; else if (x < .73) k = 'pick';
    cells.push({k, open: 0});
  }
  cells[Math.floor(Math.random() * MINE_N)] = {k: 'stairs', open: 0};
  return cells;
}
export function mineState(s, now = Date.now()){
  const o = s.objs.find(o => o.type === 'mine' && built(o)); if (!o) return null;
  s.mine ||= {floor: 1, cells: mineFloor(1), picks: minePicks(o.lv), t: now, best: 1};
  const M = s.mine, max = minePicks(o.lv) + zoneB(s, 'picks'), every = minePickMin(o.lv) * 60e3;
  if (M.picks >= max) M.t = now;
  else { const n = Math.floor((now - M.t) / every); if (n > 0){ M.picks = Math.min(max, M.picks + n); M.t = M.picks >= max ? now : M.t + n * every; } }
  return {o, M, max, next: M.picks >= max ? 0 : M.t + every};
}
/** Creuse une case : renvoie ce qu'on y trouve ({k, r} r = récompense), ou une raison de refus. */
export function mineDig(s, i, now = Date.now()){
  const st = mineState(s, now); if (!st) return {err: 'Construis la Grotte aux cristaux'};
  const {o, M} = st, c = M.cells[i]; if (!c || c.open) return {err: 'Déjà creusé'};
  if (M.picks <= 0) return {err: 'Plus de pioches'};
  M.picks--; c.open = 1;
  const f = M.floor, m = mineMult(o.lv), L = s.lvl, r = {};
  if (c.k === 'ice') r.ice = Math.max(1, Math.round((.6 + .35 * Math.sqrt(f)) * m * (.7 + Math.random() * .6)));
  if (c.k === 'coins') r.coins = R5((40 + L * 18) * (1 + Math.sqrt(f) * .3) * m * (.7 + Math.random() * .6));
  if (c.k === 'res') r[['wood', 'cookies', 'fabric'][Math.floor(Math.random() * 3)]] = R5((30 + L * 12) * (1 + Math.sqrt(f) * .3) * m);
  if (c.k === 'gold') r.gold = Math.max(1, Math.round((.4 + Math.sqrt(f) * .1) * m * (.6 + Math.random() * .8)));
  if (c.k === 'pick') { M.picks += 2; r.picks = 2; }
  if (c.k === 'parcel') { const pr = rollRarity([60, 30, 9, 1]); (s.parcels ||= []).push(pr); r.parcel = pr; }
  if (c.k === 'stairs') M.stairs = 1;
  return {k: c.k, r};
}
export function mineDown(s){
  const M = s.mine; if (!M?.stairs) return false;
  M.floor++; M.best = Math.max(M.best || 1, M.floor); M.cells = mineFloor(M.floor); M.stairs = 0; return true;
}

/* ===================== EXPÉDITIONS DES RENNES (Écurie) ===================== */
// Comme les lieux d'enchères de Bid Master : chaque destination a son coût, sa durée et ses chances de rareté.
// Les rennes reviennent avec des colis mystère qu'on ouvre ensuite.
const H_ = 3600e3;
export const EXP_DEST = [
  {k: 'forest', name: 'Forêt des Murmures', time: 1 * H_, n: 1, odds: [75, 22, 3, 0], lv: 1, food: 40},
  {k: 'pass', name: 'Col du Blizzard', time: 4 * H_, n: 1, odds: [50, 38, 11, 1], lv: 3, food: 140},
  {k: 'aurora', name: 'Aurores Boréales', time: 8 * H_, n: 2, odds: [35, 42, 20, 3], lv: 6, food: 300},
  {k: 'light', name: 'Phare du Nord', time: 12 * H_, n: 2, odds: [20, 42, 31, 7], lv: 10, food: 520},
];
export const expSlots = lv => Math.min(3, 1 + Math.floor(lv / 6));
export const expCost = (s, d) => ({cookies: R5(d.food * (1 + s.lvl * .35))});
export function expBlock(s, k, now = Date.now()){
  const st = s.objs.find(o => o.type === 'stable' && built(o)); if (!st) return "Construis l'Écurie des rennes";
  const d = EXP_DEST.find(d => d.k === k); if (d.lv > st.lv) return `Écurie niv. ${d.lv}`;
  if ((s.exps || []).length >= expSlots(st.lv)) return 'Tous les rennes sont partis';
  if (!has(s, expCost(s, d))) return 'Pas assez de biscuits pour les rennes';
  return null;
}
export function expStart(s, k, now = Date.now()){
  const why = expBlock(s, k, now); if (why) return why;
  const d = EXP_DEST.find(d => d.k === k); take(s, expCost(s, d));
  (s.exps ||= []).push({k, end: now + d.time * deerSpeed(s, now) * (1 - zoneB(s, 'exp')) * (1 - rsBonus(s, 'swift')), start: now}); return null;
}
/** Rentre les expéditions terminées : renvoie les colis rapportés (raretés). */
export function expCollect(s, now = Date.now()){
  const back = [];
  s.exps = (s.exps || []).filter(e => { if (e.end > now) return true; const d = EXP_DEST.find(d => d.k === e.k); for (let i = 0; i < d.n; i++) back.push(rollRarity(d.odds)); return false; });
  if (back.length) (s.parcels ||= []).push(...back);
  return back;
}


/* ===================== ILLUMINATIONS DU VILLAGE (puits de ressources sans fin) ===================== */
// Comme les remparts de Clash of Clans : pas de bâtisseur, pas d'attente, mais un prix qui grimpe à chaque niveau.
// Chaque niveau allume plus de guirlandes et donne +1 % de production à tout le village, pour toujours.
export const lightsLv = s => s.lights || 0;
export const lightsBonus = s => lightsLv(s) * .01;
export const lightsHq = 4;
export function lightsCost(n){
  const g = Math.pow(1.32, n);
  const c = {coins: R5(1500 * g), wood: R5(1200 * g), cookies: R5(700 * g), fabric: R5(400 * g)};
  if (n >= 4) c.ice = Math.round(6 * Math.pow(1.24, n - 4));
  if (n >= 12) c.gold = Math.round(3 * Math.pow(1.22, n - 12));
  return c;
}
export function lightsBlock(s){
  if (hqLv(s) < lightsHq) return `Maison du Père Noël niv. ${lightsHq}`;
  if (!has(s, lightsCost(lightsLv(s)))) return 'Ressources insuffisantes';
  return null;
}
export function lightsUp(s){ const why = lightsBlock(s); if (why) return why; take(s, lightsCost(lightsLv(s))); s.lights = lightsLv(s) + 1; return null; }

/* ===================== COMMANDES SPÉCIALES DES ATELIERS (choix à la Hay Day / Township) ===================== */
// Chaque bâtiment de production propose 3 travaux : court, moyen, long. On choisit selon le temps qu'on a.
// Plus c'est long, plus c'est rentable, et chaque travail a une chance de trouvaille rare.
const MIN = 60e3;
export const JOBS = {
  sawmill: [
    {k: 'kindling', name: 'Petit bois pour les poêles', time: 5 * MIN, cost: {cookies: 10}, give: {wood: .14}, bonus: [.10, 'axe']},
    {k: 'planks', name: 'Planches de sapin poli', time: 60 * MIN, cost: {cookies: 40}, give: {wood: 1.0, coins: .3}, bonus: [.20, 'saw']},
    {k: 'sleigh', name: 'Patins de traîneau', time: 8 * 60 * MIN, cost: {cookies: 160}, give: {wood: 4, coins: .8}, bonus: [.35, 'ice']},
  ],
  letters: [
    {k: 'sort', name: 'Trier le courrier du matin', time: 5 * MIN, cost: {cookies: 10}, give: {coins: .14}, bonus: [.10, 'stars']},
    {k: 'stamps', name: 'Tamponner les enveloppes', time: 60 * MIN, cost: {cookies: 40}, give: {coins: 1.0}, bonus: [.15, 'axe']},
    {k: 'answer', name: 'Répondre aux enfants', time: 8 * 60 * MIN, cost: {cookies: 160}, give: {coins: 4}, bonus: [.30, 'gold']},
  ],
  bakery: [
    {k: 'stars', name: 'Biscuits étoilés', time: 5 * MIN, cost: {wood: 15}, give: {cookies: .14}, bonus: [.10, 'stars']},
    {k: 'loaf', name: 'Pain d’épices géant', time: 60 * MIN, cost: {wood: 60}, give: {cookies: 1.0, coins: .3}, bonus: [.20, 'ice']},
    {k: 'house', name: 'Maison en pain d’épices', time: 8 * 60 * MIN, cost: {wood: 240}, give: {cookies: 4, coins: .8}, bonus: [.35, 'gold']},
  ],
  mill: [
    {k: 'yarn', name: 'Pelotes de laine', time: 5 * MIN, cost: {cookies: 10}, give: {fabric: .14}, bonus: [.10, 'saw']},
    {k: 'scarf', name: 'Écharpes rayées', time: 60 * MIN, cost: {cookies: 40}, give: {fabric: 1.0, coins: .3}, bonus: [.20, 'ice']},
    {k: 'quilt', name: 'Courtepointe du Père Noël', time: 8 * 60 * MIN, cost: {cookies: 160}, give: {fabric: 4, coins: .8}, bonus: [.35, 'gold']},
  ],
};
// Les quantités sont des « heures de production » du bâtiment : elles suivent son niveau.
export function jobPlan(s, o, j){
  const per = rate(o.type, o.lv), give = {}, cost = {};
  for (const [k, h] of Object.entries(j.give)) give[k] = R5(h * (k === BUILDINGS[o.type].res ? per : per * .5));
  for (const [k, n] of Object.entries(j.cost)) cost[k] = R5(n * (1 + (o.lv - 1) * .4));
  return {give, cost, time: j.time};
}
export function jobStart(s, o, k, now = Date.now()){
  const j = (JOBS[o.type] || []).find(j => j.k === k); if (!j) return 'Inconnu';
  if (o.job) return 'Déjà au travail';
  if (o.build || o.up) return 'Bâtiment en travaux';
  const p = jobPlan(s, o, j); if (!has(s, p.cost)) return 'Ressources insuffisantes';
  take(s, p.cost); o.job = {k, end: now + p.time, start: now}; return null;
}
/** Récupère un travail terminé : ressources + trouvaille éventuelle (tirée à la fin, annoncée). */
export function jobCollect(s, o, now = Date.now()){
  if (!o.job || o.job.end > now) return null;
  const j = JOBS[o.type].find(j => j.k === o.job.k), p = jobPlan(s, o, j), r = {...p.give};
  if (Math.random() < j.bonus[0]){ const b = j.bonus[1]; r[b] = (r[b] || 0) + (b === 'ice' ? 3 + Math.floor(o.lv / 2) : b === 'gold' ? 1 + Math.floor(o.lv / 8) : 1); }
  delete o.job; return r;
}

/* ===================== VISITEURS DU VILLAGE (Township) ===================== */
// Un personnage arrive toutes les 12 à 25 min, demande quelque chose et propose une récompense. On accepte ou on refuse.
export const VISITORS = [
  {who: 'Mère Noël', say: 'Il me faudrait de quoi préparer le goûter des lutins…'},
  {who: 'Le bonhomme de neige', say: 'Brrr ! Tu aurais quelque chose pour mon igloo ?'},
  {who: 'Rodolphe', say: 'Mon nez brille, mais mon ventre crie famine !'},
  {who: 'Un ourson polaire', say: 'Je collectionne les jolies choses du village.'},
  {who: 'Le facteur des neiges', say: 'Un enfant a écrit en urgence, peux-tu m’aider ?'},
  {who: 'La fée des glaces', say: 'Un échange ? Je paie toujours en magie.'},
];
export function visitorTick(s, now = Date.now()){
  if (s.visitor && s.visitor.until > now) return s.visitor;
  if (s.visitor && s.visitor.until <= now) s.visitor = null;
  s.visitNext ||= now + 3 * 60e3;
  if (now < s.visitNext || s.lvl < 3) return null;
  const pick = a => a[Math.floor(Math.random() * a.length)], v = pick(VISITORS), L = s.lvl;
  const toys = toysAvailable(s).filter(k => (s.inv[k] || 0) > 0);
  let want;
  if (toys.length && Math.random() < .5){ const k = pick(toys); want = {[k]: 1 + Math.floor(Math.random() * Math.min(3, s.inv[k]))}; }
  else { const k = pick(['wood', 'cookies', 'fabric'].filter(k => k !== 'fabric' || s.objs.some(o => o.type === 'mill'))); want = {[k]: R5((80 + L * 40) * (.8 + Math.random() * .6))}; }
  const value = Object.entries(want).reduce((a, [k, n]) => a + (TOYS[k] ? TOYS[k].value * n : n * .9), 0);
  const give = {coins: R5(value * 1.6), xp: Math.round(6 + value / 25)};
  const r = Math.random(); if (r < .12) give.stars = 1; else if (r < .35 && L >= 5) give.ice = 2 + Math.floor(L / 4); else if (r < .5) give[Math.random() < .5 ? 'axe' : 'saw'] = 1;
  s.visitor = {...v, want, give, until: now + 20 * 60e3};
  s.visitNext = now + (12 + Math.random() * 13) * 60e3;
  return s.visitor;
}
export function visitorAnswer(s, yes){
  const v = s.visitor; if (!v) return null;
  if (yes){ if (!has(s, v.want)) return 'missing'; take(s, v.want); }
  s.visitor = null; return yes ? v.give : {};
}

/* ===================== PAPIER CADEAU ===================== */
// Une lettre emballée paie 50 % de plus (pièces et XP) et a 15 % de chances de donner une étoile d'or.
export const wrapNeed = od => Object.values(od.items || {}).reduce((a, n) => a + n, 0);
export const WRAP_BONUS = 1.5, WRAP_STAR = .15;

/* ===================== SPECTACLES DU THÉÂTRE (boosts temporaires, comme les potions de Clash of Clans) ===================== */
const HR = 3600e3;
export const SHOWS = [
  {k: 'puppets', name: 'Marionnettes du lutin farceur', pct: .15, time: 1 * HR, cost: {cookies: 200, fabric: 60}},
  {k: 'ballet', name: 'Ballet des flocons', pct: .25, time: 4 * HR, cost: {cookies: 600, fabric: 200, coins: 800}},
  {k: 'nutcracker', name: 'Le Grand Casse-Noisette', pct: .40, time: 8 * HR, cost: {cookies: 1500, fabric: 500, ice: 10}},
];
export const showCost = (sh, lv) => Object.fromEntries(Object.entries(sh.cost).map(([k, n]) => [k, k === 'ice' ? n + lv : R5(n * (1 + (lv - 1) * .35))]));
export const showPct = (sh, lv) => sh.pct + .02 * (lv - 1);
export const showBonus = (s, now = Date.now()) => s.show && s.show.end > now ? s.show.pct : 0;
export function showStart(s, k, now = Date.now()){
  const th = s.objs.find(o => o.type === 'theater' && built(o)); if (!th) return 'Construis le Théâtre';
  if (s.show && s.show.end > now) return 'Un spectacle est déjà à l’affiche';
  const sh = SHOWS.find(x => x.k === k), c = showCost(sh, th.lv); if (!has(s, c)) return 'Ressources insuffisantes';
  take(s, c); s.show = {k, pct: showPct(sh, th.lv), end: now + sh.time, start: now}; return null;
}

/* ===================== LA HOTTE DU PÈRE NOËL (tirage d'une carte sur 3, toutes les 4 h) ===================== */
export const SACK_EVERY = 4 * 3600e3;
export const sackReady = (s, now = Date.now()) => now >= (s.sackAt || 0);
export function sackCards(s){
  const L = s.lvl, m = 1 + L * .3, pick = a => a[Math.floor(Math.random() * a.length)];
  const pool = [
    {coins: R5(300 * m)}, {wood: R5(350 * m)}, {cookies: R5(250 * m)}, {coins: R5(600 * m)},
    {ice: 3 + Math.floor(L / 3)}, {axe: 1, saw: 1}, {stars: 2}, {parcel: 1},
  ];
  if (L >= 8) pool.push({gold: 1 + Math.floor(L / 10)});
  const cards = []; while (cards.length < 3) cards.push(pick(pool));
  if (Math.random() < .08) cards[Math.floor(Math.random() * 3)] = {stars: 10};   // le gros lot, rare
  return cards;
}
export const sackTake = (s, now = Date.now()) => { s.sackAt = now + SACK_EVERY; };

/* ===================== COUP DE MAIN DES LUTINS (chalets) ===================== */
// Chaque chalet peut envoyer ses lutins aider les chantiers : -15 % sur tous les chantiers en cours, toutes les 2 h.
export const HELP_EVERY = 2 * 3600e3, HELP_CUT = .15;
export const helpCost = o => ({cookies: R5(40 * Math.pow(1.35, (o.lv || 1) - 1))});
export const helpReady = (o, now = Date.now()) => now >= (o.helpAt || 0);
export function helpGive(s, o, now = Date.now()){
  if (!helpReady(o, now)) return 'Les lutins se reposent';
  const sites = s.objs.filter(x => (x.build && x.build > now) || (x.up && x.up > now));
  if (!sites.length) return 'Aucun chantier en cours';
  if (!has(s, helpCost(o))) return 'Ressources insuffisantes';
  take(s, helpCost(o));
  for (const x of sites){ const k = x.build ? 'build' : 'up'; x[k] = now + Math.round((x[k] - now) * (1 - HELP_CUT - .02 * ((o.lv || 1) - 1))); }
  o.helpAt = now + HELP_EVERY; return null;
}

/* ===================== GRANDE COMMANDE DU NORD (Entrepôt) ===================== */
// Toutes les 6 h, Gros Ours propose 3 grosses commandes ; on en remplit une. Utile pour écouler le surplus.
export const BULK_EVERY = 6 * 3600e3;
export function bulkOffers(s, o){
  const L = s.lvl, lv = o.lv || 1, f = 1 + (lv - 1) * .25, base = n => R5(n * (1 + L * .3));
  const res = ['wood', 'cookies', 'fabric'].filter(k => k !== 'fabric' || s.objs.some(x => x.type === 'mill'));
  return res.map(k => { const n = base(k === 'fabric' ? 250 : 500); return {k, want: {[k]: n}, give: {coins: R5(n * (k === 'fabric' ? 2.2 : 1.1) * f), xp: Math.round(8 + L * 2), ice: 2 + Math.floor(L / 3)}}; });
}
export const bulkReady = (o, now = Date.now()) => now >= (o.bulkAt || 0);
export function bulkDo(s, o, k, now = Date.now()){
  if (!bulkReady(o, now)) return 'Gros Ours prépare la prochaine commande';
  const of = bulkOffers(s, o).find(x => x.k === k); if (!has(s, of.want)) return 'Ressources insuffisantes';
  take(s, of.want); o.bulkAt = now + BULK_EVERY; return of.give;
}

/* ===================== SOINS DES RENNES (Écurie) ===================== */
// Nourrir les rennes : pendant 8 h, les expéditions sont 25 % plus rapides (+2 % par cœur d'affection, 10 cœurs max).
export const DEER_EVERY = 8 * 3600e3;
export const deerHearts = s => Math.min(10, s.deer?.hearts || 0);
export const deerFedNow = (s, now = Date.now()) => (s.deer?.until || 0) > now;
export const deerSpeed = (s, now = Date.now()) => deerFedNow(s, now) ? 1 - .25 - .02 * deerHearts(s) : 1;
export const deerCost = s => ({cookies: R5(80 * (1 + s.lvl * .25))});
export function deerFeed(s, now = Date.now()){
  if (deerFedNow(s, now)) return 'Les rennes n’ont plus faim';
  if (!has(s, deerCost(s))) return 'Ressources insuffisantes';
  take(s, deerCost(s)); s.deer ||= {hearts: 0}; s.deer.until = now + DEER_EVERY; s.deer.hearts = Math.min(10, (s.deer.hearts || 0) + 1);
  return null;
}

/* ===================== RAPPELS (notifications) ===================== */
/** Ce qui deviendra prêt plus tard : chantiers, rennes, ateliers pleins, pioches, jouets. Trié par heure. */
export function upcoming(s, now = Date.now()){
  const L = [], add = (at, txt) => { if (at > now) L.push({at, txt}); };
  for (const o of s.objs){
    const b = BUILDINGS[o.type]; if (o.wild || o.free && b.kind === 'deco') continue;
    if (o.build) add(o.build, `${b.name} : construction terminée !`);
    else if (o.up) add(o.up, `${b.name} : amélioration terminée !`);
    else if (b.kind === 'prod'){ const cap = o.keeper ? keeperBuffer(o) : buffer(o.type, o.lv), r = rate(o.type, o.lv) * prodMult(s) * keeperMult(o) * zoneProd(s, b.res); if (r > 0) add(o.t + cap / r * 3.6e6, `${b.name} : stock plein, viens récolter !`); }
    for (const j of o.q || []) add(j.end, `Des jouets sont prêts à l'Atelier`);
  }
  for (const e of s.exps || []) add(e.end, 'Les rennes rentrent avec des colis mystère !');
  const st = s.objs.find(o => o.type === 'mine' && built(o));
  if (st && s.mine){ const max = minePicks(st.lv) + zoneB(s, 'picks'), every = minePickMin(st.lv) * 60e3; if (s.mine.picks < max) add(s.mine.t + (max - s.mine.picks) * every, 'Les pioches de la Grotte sont pleines'); }
  return L.sort((a, b) => a.at - b.at);
}

/* ===================== BIBLIOTHÈQUE DES LUTINS (recherche, comme le Science Center de DoA ou le Laboratoire de Clash) ===================== */
// Une recherche à la fois. Chaque niveau donne un bonus permanent. Le niveau de la Bibliothèque plafonne le niveau des recherches
// et débloque de nouvelles branches. Les niveaux coûtent de plus en plus (pièces, puis cristaux, puis lingots) et prennent de plus en plus de temps.
export const RESEARCH = [
  {k: 'saw',   name: 'Scies affûtées',        icon: 'wood',    p: .05, lib: 1, txt: p => `+${p} % de bois produit`},
  {k: 'oven',  name: 'Recettes de grand-mère', icon: 'cookies', p: .05, lib: 1, txt: p => `+${p} % de biscuits produits`},
  {k: 'post',  name: 'Tri du courrier',        icon: 'coins',   p: .05, lib: 1, txt: p => `+${p} % de pièces produites`},
  {k: 'loom',  name: 'Métiers à tisser',       icon: 'fabric',  p: .05, lib: 2, txt: p => `+${p} % de tissu produit`},
  {k: 'store', name: 'Rangement malin',        icon: 'storage', p: .04, lib: 2, txt: p => `+${p} % de place dans le stock`},
  {k: 'craft', name: 'Doigts de fée',          icon: 'workshop', p: .04, lib: 3, txt: p => `Jouets fabriqués ${p} % plus vite`},
  {k: 'swift', name: 'Rennes véloces',         icon: 'stable',  p: .04, lib: 3, txt: p => `Expéditions ${p} % plus rapides`},
  {k: 'frost', name: 'Givre éternel',          icon: 'ice',     p: .06, lib: 4, txt: p => `+${p} % de cristaux produits`},
  {k: 'plan',  name: 'Plans d’architecte',     icon: 'build',   p: .03, lib: 5, txt: p => `Chantiers ${p} % plus courts`},
  {k: 'forge', name: 'Forge des aurores',      icon: 'gold',    p: .06, lib: 7, txt: p => `+${p} % de lingots produits`},
];
export const RS_RES = {wood: 'saw', cookies: 'oven', coins: 'post', fabric: 'loom', ice: 'frost', gold: 'forge'};
export const RS_MAX = 20;
export const rsLv = (s, k) => (s.rs && s.rs[k]) || 0;
export const rsBonus = (s, k) => { if (!k) return 0; const r = RESEARCH.find(x => x.k === k); return r ? Math.min(.75, rsLv(s, k) * r.p) : 0; };
export const libLv = s => { const o = s.objs.find(o => o.type === 'library' && built(o)); return o ? o.lv : 0; };
export const rsCap = s => Math.min(RS_MAX, libLv(s) * 2);
export function rsCost(s, k, lv){                      // lv = niveau visé
  const i = RESEARCH.findIndex(x => x.k === k), base = 400 * (1 + i * .25) * Math.pow(1.55, lv - 1), c = {coins: R5(base)};
  if (lv >= 3) c.ice = Math.round(4 * Math.pow(1.4, lv - 3) * (1 + i * .1));
  if (lv >= 7) c.gold = Math.round(1 + Math.pow(1.35, lv - 7));
  return c;
}
export const rsTime = (k, lv) => Math.round(Math.min(5 * 86400, 600 * Math.pow(1.85, lv - 1)));     // 10 min, 18 min, 34 min… jusqu'à 5 jours
export function rsBlock(s, k, now = Date.now()){
  const r = RESEARCH.find(x => x.k === k), L = libLv(s); if (!L) return 'Construis la Bibliothèque des lutins';
  if (r.lib > L) return `Bibliothèque niv. ${r.lib}`;
  if (s.rsRun && s.rsRun.end > now) return 'Une recherche est déjà en cours';
  const n = rsLv(s, k) + 1; if (n > RS_MAX) return 'Niveau maximum';
  if (n > rsCap(s)) return `Bibliothèque niv. ${Math.ceil(n / 2)} requise`;
  if (!has(s, rsCost(s, k, n))) return 'Il manque des ressources';
  return null;
}
export function rsStart(s, k, now = Date.now()){
  const why = rsBlock(s, k, now); if (why) return why;
  const n = rsLv(s, k) + 1; take(s, rsCost(s, k, n)); s.rsRun = {k, lv: n, start: now, end: now + rsTime(k, n) * 1000}; return null;
}
/** Termine la recherche si son temps est écoulé (renvoie la recherche finie). */
export function rsTick(s, now = Date.now()){
  const R = s.rsRun; if (!R || R.end > now) return null;
  s.rs ||= {}; s.rs[R.k] = R.lv; s.rsRun = null; return R;
}
