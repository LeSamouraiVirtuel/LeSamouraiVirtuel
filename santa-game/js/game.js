// Règles du jeu : ressources, bâtiments, jouets, lettres, missions, calendrier, niveaux. Aucune dépendance 3D.
import {HQ_ID, NZ} from './world.js';

/* =====================================================================
   DONNÉES
   ===================================================================== */
export const RES = {
  coins:   {name: 'Pièces'},
  wood:    {name: 'Bois'},
  cookies: {name: 'Biscuits'},
  fabric:  {name: 'Tissu'},
};
export const TYPES = {
  hq:      {name: 'Maison du Père Noël', desc: "Le cœur du village. Son niveau limite celui des autres bâtiments et agrandit le stock.", cost: {coins: 150, wood: 120, cookies: 25}, time: 10},
  sawmill: {name: 'Scierie', prod: 'wood', rate: 30, desc: "Les lutins débitent les vieux sapins en belles planches.", cost: {coins: 60, wood: 30}, time: 5, pl: 1},
  post:    {name: 'Bureau des lettres', prod: 'coins', rate: 40, desc: "Les lettres des enfants arrivent ici, souvent avec une petite pièce pour le village.", cost: {coins: 30, wood: 50}, time: 6, pl: 1},
  bakery:  {name: 'Four à biscuits', prod: 'cookies', rate: 20, desc: "Des biscuits au gingembre tout chauds, pour les jouets et les gros chantiers.", cost: {coins: 80, wood: 60}, time: 6, pl: 1},
  workshop:{name: 'Atelier des lutins', craft: 'toy', desc: "Fabrique les jouets demandés dans les lettres. Chaque niveau ajoute une place dans la file et accélère les lutins.", cost: {coins: 150, wood: 120, cookies: 30}, time: 8, pl: 2},
  mill:    {name: 'Filature', prod: 'fabric', rate: 12, desc: "La laine des moutons du Pôle devient du tissu pour les peluches et les chaussettes.", cost: {coins: 200, wood: 160, cookies: 40}, time: 10, pl: 3},
  stable:  {name: 'Écurie des rennes', unique: true, desc: "Débloque la tournée en traîneau. Chaque niveau augmente les gains de la tournée et le nombre de tickets de jeu.", cost: {coins: 300, wood: 250, cookies: 100}, time: 12, pl: 4},
  storage: {name: 'Entrepôt', desc: "Agrandit le stock maximum de toutes les ressources.", cost: {coins: 120, wood: 150}, time: 8, pl: 5},
  wrap:    {name: "Salle d'emballage", craft: 'wrap', desc: "Emballe les jouets dans du papier cadeau. Chaque cadeau sort avec une rareté : commun, rare, épique ou légendaire. Plus la salle est haute, meilleures sont les chances.", cost: {coins: 400, wood: 300, fabric: 60}, time: 15, pl: 4},
};
export const BUILDABLE = ['sawmill', 'post', 'bakery', 'workshop', 'mill', 'wrap', 'stable', 'storage'];

export const TOYS = {
  train: {name: 'Petit train', model: 'train_locomotive', cost: {wood: 8}, time: 45, xp: 4, value: 30, pl: 2},
  box:   {name: 'Boîte de biscuits', model: 'plate_decorated_A', cost: {cookies: 10}, time: 70, xp: 5, value: 36, pl: 2},
  sled:  {name: 'Luge', model: 'sled', cost: {wood: 14}, time: 120, xp: 8, value: 60, pl: 3},
  plush: {name: 'Bonhomme en peluche', model: 'snowman', cost: {fabric: 6}, time: 150, xp: 9, value: 70, pl: 3},
  nut:   {name: 'Casse-noisette', model: 'nutcracker', cost: {wood: 8, fabric: 5}, time: 240, xp: 14, value: 120, pl: 5},
  cane:  {name: "Sucre d'orge géant", model: 'candycane_large', cost: {cookies: 12, wood: 6}, time: 200, xp: 12, value: 100, pl: 7},
  sock:  {name: 'Chaussette garnie', model: 'sock-red-cane', cost: {fabric: 10, cookies: 8}, time: 360, xp: 20, value: 180, pl: 9},
  bell:  {name: 'Cloche dorée', model: 'bell_decorated', cost: {wood: 20, fabric: 12, coins: 150}, time: 600, xp: 35, value: 350, pl: 12},
};

export const MAX_LV = 25, BUILDERS = 2;
export const RANKS = ['Lutin apprenti', 'Lutin confirmé', 'Chef des lutins', 'Maître jouetier', 'Gardien des rennes', "Héraut de l'hiver", 'Seigneur des neiges', 'Prince du Pôle', 'Presque Père Noël', 'Père Noël'];
export const rankOf = pl => pl < 28 ? RANKS[Math.min(8, Math.floor((pl - 1) / 3))] : `Père Noël${pl >= 31 ? ' ' + '★'.repeat(Math.min(5, Math.floor((pl - 28) / 3))) : ''}`;
export const looksOf = pl => Math.min(10, 1 + Math.floor((pl - 1) / 3));
export const ZONES = [
  {pl: 1, name: 'Le Camp du bas'},
  {pl: 3, name: 'Les Pentes enneigées'},
  {pl: 6, name: 'La Forêt des sapins'},
  {pl: 10, name: 'Le Lac gelé'},
  {pl: 15, name: 'Les Crêtes du Nord'},
  {pl: 21, name: 'Le Sommet du Pôle'},
].slice(0, NZ);
export const KIDS = ['Léa', 'Hugo', 'Inès', 'Noah', 'Jade', 'Lucas', 'Chloé', 'Adam', 'Manon', 'Gabriel', 'Lina', 'Louis', 'Emma', 'Nathan', 'Zoé', 'Sacha', 'Alice', 'Rayan', 'Mia', 'Tom', 'Yasmine', 'Malo', 'Rose', 'Ethan'];

/* ---------------- formules ---------------- */
export const rate = (t, lv) => Math.round(TYPES[t].rate * Math.pow(1.35, lv - 1));
export const bufCap = (t, lv) => rate(t, lv) * 4;
const r5 = n => n < 1000 ? Math.max(5, Math.round(n / 5) * 5) : Math.round(n / 50) * 50;
export const costOf = (t, lv) => { const c = {}, m = Math.pow(1.6, lv - 1); for (const k in TYPES[t].cost) c[k] = r5(TYPES[t].cost[k] * m); return c; };
export const timeOf = (t, lv) => Math.min(86400, Math.round(TYPES[t].time * Math.pow(1.5, lv - 1)));
export const storageBonus = lv => Math.round(800 * Math.pow(1.6, lv - 1));
export const hqCap = lv => Math.round(600 * Math.pow(1.5, lv - 1));
export const hqNeed = lv => Math.max(1, 2 * (lv - 1));            // niveau joueur requis pour la Maison niv. lv
export const xpNeed = L => Math.round(40 * Math.pow(L, 1.7));
export const buildXp = lv => Math.round(10 * Math.pow(lv, 1.35));
export const slotsOf = lv => Math.min(8, 2 + Math.floor(lv / 3));
export const craftSpeed = lv => 1 + .07 * (lv - 1);
export const ticketMax = st => 3 + Math.floor(st / 4);
export const TICKET_MS = 15 * 60 * 1000;
export const sleighMult = st => 1 + .25 * (st - 1);

/* =====================================================================
   ÉTAT & SAUVEGARDE
   ===================================================================== */
const SAVE_KEY = 'village-du-pole-v3';
export function newState(){
  return {
    v: 3, res: {coins: 300, wood: 180, cookies: 40, fabric: 0}, stars: 10, xp: 0, pl: 1,
    plots: {
      [HQ_ID]: {type: 'hq', lv: 1, buf: 0},
      '0-0-0': {type: 'sawmill', lv: 1, buf: 25},
      '0-0-2': {type: 'post', lv: 1, buf: 40},
    },
    toys: {}, letters: [], tickets: 3, ticketT: Date.now(),
    tuto: 0, quest: 0, stats: {wood: 0, crafted: 0, letters: 0, games: 0, builds: 0, coins: 0, advent: 0, sleigh: 0, snow: 0},
    daily: null, advent: {count: 0, last: ''}, best: {sleigh: 0, snow: 0}, t: Date.now(),
    ...extraState(),
  };
}
export function loadState(){
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.v === 3) return withDefaults(s);
    const old = JSON.parse(localStorage.getItem('village-du-pole-v2'));
    if (old && old.v === 2){
      const n = newState();
      n.plots = old.plots; for (const p of Object.values(n.plots)) if (p.type === 'workshop'){ p.queue = []; p.done = []; }
      n.res = {coins: old.res.coins + (old.res.gifts || 0) * 5, wood: old.res.wood, cookies: old.res.cookies, fabric: 0};
      n.stars = 10 + Math.floor((old.stars || 0) / 20); n.pl = Math.max(1, 2 * (old.plots[HQ_ID].lv - 1)); n.quest = 0;
      return withDefaults(n);
    }
  } catch(e){}
  return null;
}
/** Complète une sauvegarde avec les champs ajoutés au fil des versions. */
export function withDefaults(s){
  const d = extraState();
  for (const k in d) if (s[k] === undefined) s[k] = d[k];
  for (const k in d.event) if (s.event[k] === undefined) s.event[k] = d.event[k];
  for (const k in d.login) if (s.login[k] === undefined) s.login[k] = d.login[k];
  return s;
}
function extraState(){
  return {
    pseudo: 'Lutin' + Math.floor(1000 + Math.random() * 9000),
    skins: {santa: 'classic', elves: 'classic', bases: 'classic'}, owned: ['santa:classic', 'elves:classic', 'bases:classic'],
    gifts: {}, album: {}, albumClaimed: {},
    login: {last: '', streak: 0, best: 0, total: 0, cycle: 0, claimed: '', lost: 0},
    event: {day: '', pts: 0, claimed: [], claimedP: [], energy: ENERGY_MAX, energyT: Date.now(), board: null},
    pass: 0, purchases: {}, guild: null, week: {key: '', xp: 0, tour: 0}, guildClaims: {},
  };
}
export function saveState(s){ s.t = Date.now(); try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch(e){} }
export function clearSave(){ try { localStorage.removeItem(SAVE_KEY); localStorage.removeItem('village-du-pole-v2'); } catch(e){} }
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

/* =====================================================================
   RÈGLES (liées à l'état courant)
   ===================================================================== */
export function rules(getState){
  const S = () => getState();
  const pl = () => S().pl;
  const hqLv = () => S().plots[HQ_ID].lv;
  const zoneOpen = k => pl() >= ZONES[k].pl;
  const openZones = () => ZONES.filter(z => pl() >= z.pl).length;
  const plotsOf = t => Object.values(S().plots).filter(p => p.type === t);
  const bestLv = t => plotsOf(t).reduce((m, p) => Math.max(m, p.lv), 0);
  const maxCount = t => {
    if (TYPES[t].unique) return 1;
    if (t === 'storage') return Math.min(4, 1 + Math.floor(pl() / 10));
    if (t === 'workshop' || t === 'wrap') return pl() >= 15 ? 2 : 1;
    return Math.min(4, 1 + Math.floor(pl() / 6));
  };
  const busyBuilders = () => Object.values(S().plots).filter(p => p.upEnd).length;
  const passOn = () => (S().pass || 0) > Date.now();
  const builders = () => BUILDERS + (passOn() ? 1 : 0);
  const energyMax = () => ENERGY_MAX + (passOn() ? 1 : 0);
  const storeCap = () => { let c = hqCap(hqLv()); for (const p of plotsOf('storage')) if (p.lv > 0) c += storageBonus(p.lv); return c; };
  const canAfford = c => Object.keys(c).every(k => (k === 'stars' ? S().stars : S().res[k] ?? 0) >= c[k]);
  const fitsStore = c => Object.keys(c).every(k => c[k] <= storeCap());
  const ready = p => (TYPES[p.type].prod && p.lv > 0 && !p.upEnd && (p.buf || 0) >= Math.max(1, rate(p.type, p.lv) * .2)) || (TYPES[p.type].craft && p.done?.length > 0);
  const toyUnlocked = k => pl() >= TOYS[k].pl;
  const tMax = () => ticketMax(bestLv('stable'));

  function upgradeBlock(id){
    const p = S().plots[id], to = p.lv + 1;
    if (p.upEnd) return 'Chantier en cours';
    if (to > MAX_LV) return 'Niveau maximum atteint';
    if (p.type === 'hq' && pl() < hqNeed(to)) return `Niveau joueur ${hqNeed(to)} requis`;
    if (p.type !== 'hq' && to > hqLv()) return `Améliore d'abord la Maison au niveau ${to}`;
    const c = costOf(p.type, to);
    if (!fitsStore(c)) return 'Stock trop petit : améliore la Maison ou un Entrepôt';
    if (busyBuilders() >= builders()) return `Tes ${builders()} lutins bâtisseurs sont occupés`;
    if (!canAfford(c)) return 'Ressources insuffisantes';
    return null;
  }
  function buildBlock(t){
    const T = TYPES[t];
    if (pl() < T.pl) return `Niveau joueur ${T.pl} requis`;
    if (plotsOf(t).length >= maxCount(t)) return T.unique ? 'Déjà construit' : `Maximum ${maxCount(t)} pour ton niveau`;
    if (busyBuilders() >= builders()) return 'Lutins bâtisseurs occupés';
    if (!canAfford(costOf(t, 1))) return 'Ressources insuffisantes';
    return null;
  }

  /* ---------- lettres des enfants ---------- */
  const letterSlots = () => Math.min(8, 3 + Math.floor(pl() / 4));
  function makeLetter(){
    const pool = Object.keys(TOYS).filter(toyUnlocked);
    const lines = [], n = 1 + (Math.random() < .55 ? 1 : 0) + (pl() >= 6 && Math.random() < .3 ? 1 : 0);
    for (let i = 0; i < n && pool.length; i++){
      const k = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      lines.push([k, 1 + Math.floor(Math.random() * Math.min(4, 1 + pl() / 6))]);
    }
    const value = lines.reduce((a, [k, q]) => a + TOYS[k].value * q, 0), xp = lines.reduce((a, [k, q]) => a + TOYS[k].xp * q, 0);
    return {id: Math.random().toString(36).slice(2, 8), kid: KIDS[Math.floor(Math.random() * KIDS.length)], lines,
      coins: Math.round(value * 1.3), xp: Math.round(xp * 1.6), stars: Math.random() < .15 ? 1 + Math.floor(Math.random() * 2) : 0, wait: 0};
  }
  const canFill = L => L.lines.every(([k, q]) => (S().toys[k] || 0) >= q);

  /* ---------- missions du jour ---------- */
  const MISSIONS = {
    wood:    {t: n => `Récolte ${n} bois`, n: () => Math.round(150 * Math.pow(1.3, pl() / 2) / 10) * 10},
    craft:   {t: n => `Fabrique ${n} jouets`, n: () => 3 + Math.floor(pl() / 3), min: 2},
    letters: {t: n => `Réponds à ${n} lettres`, n: () => 2 + Math.floor(pl() / 4), min: 2},
    games:   {t: n => `Joue ${n} fois à un mini-jeu`, n: () => 2},
    builds:  {t: n => `Lance ${n} chantier${n > 1 ? 's' : ''}`, n: () => 1 + (pl() >= 8 ? 1 : 0)},
    coins:   {t: n => `Gagne ${n} pièces`, n: () => Math.round(300 * Math.pow(1.3, pl() / 2) / 50) * 50},
  };
  function ensureDaily(){
    const s = S(), d = today();
    if (s.daily && s.daily.day === d) return s.daily;
    const keys = Object.keys(MISSIONS).filter(k => !MISSIONS[k].min || pl() >= MISSIONS[k].min);
    const pick = [];
    while (pick.length < 3 && keys.length) pick.push(keys.splice(Math.floor(Math.random() * keys.length), 1)[0]);
    s.daily = {day: d, bonus: false, list: pick.map(k => ({k, n: MISSIONS[k].n(), p: 0, claimed: false, stars: 3 + Math.floor(Math.random() * 3), xp: 15 + pl() * 4}))};
    return s.daily;
  }

  /* ---------- calendrier de l'Avent ---------- */
  const adventReward = d => {
    const day = (d % 24) + 1, m = Math.pow(1.25, pl() / 2);
    if (day === 24) return {stars: 40, coins: Math.round(2000 * m)};
    if (day % 6 === 0) return {stars: 15};
    if (day % 3 === 0) return {stars: 5, xp: Math.round(30 * m)};
    const k = ['coins', 'wood', 'cookies', 'fabric'][day % 4];
    return {[k]: Math.round((k === 'coins' ? 250 : 120) * m * (1 + day / 12))};
  };
  const adventReady = () => S().advent.last !== today();

  /* ---------- objectifs : tutoriel puis objectifs générés à l'infini ---------- */
  const TUTO = [
    {t: 'Touche la bulle au-dessus de la Scierie pour récolter du bois', ok: s => s.stats.wood > 0, rw: {coins: 50, xp: 20}},
    {t: 'Construis un Four à biscuits sur un terrain libre', ok: () => bestLv('bakery') >= 1, rw: {coins: 80, xp: 25}},
    {t: "Construis l'Atelier des lutins", ok: () => bestLv('workshop') >= 1, rw: {cookies: 40, xp: 30}},
    {t: "Fabrique un Petit train à l'Atelier", ok: s => s.stats.crafted >= 1, rw: {wood: 60, xp: 30}},
    {t: 'Réponds à la lettre d\'un enfant', ok: s => s.stats.letters >= 1, rw: {stars: 5, xp: 40}},
    {t: 'Joue à la Bataille de boules de neige', ok: s => s.stats.snow >= 1, rw: {coins: 150, xp: 40}},
    {t: 'Ouvre la première case du calendrier de l\'Avent', ok: s => s.stats.advent >= 1, rw: {xp: 40}},
    {t: 'Améliore la Maison du Père Noël au niveau 2', ok: () => hqLv() >= 2, rw: {coins: 200, xp: 60}},
    {t: 'Construis la Filature', ok: () => bestLv('mill') >= 1, rw: {fabric: 40, xp: 60}},
    {t: "Construis l'Écurie des rennes", ok: () => bestLv('stable') >= 1, rw: {stars: 10, xp: 80}},
    {t: 'Fais une tournée en traîneau', ok: s => s.stats.sleigh >= 1, rw: {coins: 400, xp: 100}},
  ];
  function quest(){
    const s = S();
    if (s.quest < TUTO.length) return {...TUTO[s.quest], num: `${s.quest + 1}/${TUTO.length}`};
    // objectif généré : améliorer le bâtiment le plus en retard
    if (!s.goal || s.goal.done){
      const cands = Object.entries(s.plots).filter(([, p]) => p.lv > 0 && p.lv < MAX_LV).sort((a, b) => a[1].lv - b[1].lv);
      const [id, p] = cands[Math.floor(Math.random() * Math.min(3, cands.length))] || [];
      const r = Math.random();
      if (id && r < .6) s.goal = {kind: 'up', id, to: p.lv + 1, type: p.type};
      else if (r < .8) s.goal = {kind: 'letters', base: s.stats.letters, n: 3 + Math.floor(pl() / 3)};
      else s.goal = {kind: 'craft', base: s.stats.crafted, n: 5 + Math.floor(pl() / 2)};
      s.goal.done = false;
    }
    const g = s.goal, m = Math.pow(1.3, pl() / 2);
    if (g.kind === 'up') return {t: `Améliore ${TYPES[g.type].name} au niveau ${g.to}`, ok: s => (s.plots[g.id]?.lv || 0) >= g.to, rw: {coins: Math.round(200 * m), xp: Math.round(40 * m)}, num: '∞', goal: true};
    if (g.kind === 'letters') return {t: `Réponds à ${g.n} lettres`, ok: s => s.stats.letters - g.base >= g.n, prog: s => [s.stats.letters - g.base, g.n], rw: {stars: 3, xp: Math.round(50 * m)}, num: '∞', goal: true};
    return {t: `Fabrique ${g.n} jouets`, ok: s => s.stats.crafted - g.base >= g.n, prog: s => [s.stats.crafted - g.base, g.n], rw: {coins: Math.round(250 * m), xp: Math.round(50 * m)}, num: '∞', goal: true};
  }

  return {passOn, builders, energyMax, pl, hqLv, zoneOpen, openZones, plotsOf, bestLv, maxCount, busyBuilders, storeCap, canAfford, fitsStore, ready, toyUnlocked, tMax,
    upgradeBlock, buildBlock, letterSlots, makeLetter, canFill, MISSIONS, ensureDaily, adventReward, adventReady, quest, TUTO};
}


/* =====================================================================
   RARETÉ & CADEAUX
   ===================================================================== */
export const RARITY = [
  {k: 'common', name: 'Commun', color: '#8f9bb3', present: 'present_E_white', mult: 1.5, pts: 1, stars: 0, xp: 1},
  {k: 'rare', name: 'Rare', color: '#3fa2ff', present: 'present_D_blue', mult: 3, pts: 3, stars: 0, xp: 2},
  {k: 'epic', name: 'Épique', color: '#b04dff', present: 'present_A_red', mult: 6, pts: 8, stars: 2, xp: 4},
  {k: 'legend', name: 'Légendaire', color: '#ffb31a', present: 'present_C_yellow', mult: 15, pts: 25, stars: 8, xp: 10},
];
export const PAPERS = {
  kraft:  {name: 'Papier kraft', cost: {coins: 40}, odds: [70, 24, 5, 1], time: 30, pl: 4},
  ribbon: {name: 'Papier à rubans', cost: {cookies: 15, fabric: 6}, odds: [45, 38, 14, 3], time: 60, pl: 6},
  gold:   {name: 'Papier doré', cost: {stars: 3}, odds: [10, 45, 35, 10], time: 60, pl: 4},
};
export function oddsFor(paper, lv){
  const o = [...PAPERS[paper].odds], sh = Math.min(o[0] - 5, Math.min(12, lv - 1));
  o[0] -= sh; o[1] += sh * .5; o[2] += sh * .35; o[3] += sh * .15;
  return o;
}
export function rollRarity(paper, lv){
  const o = oddsFor(paper, lv); let r = Math.random() * o.reduce((a, b) => a + b), i = 0;
  while (r > o[i] && i < 3){ r -= o[i]; i++; }
  return i;
}
export const giftKey = (toy, r) => `${toy}:${r}`;
export const giftPts = (toy, r) => Math.round(TOYS[toy].value / 3 * RARITY[r].pts);
export const giftReward = (toy, r) => ({coins: Math.round(TOYS[toy].value * RARITY[r].mult), xp: Math.round(TOYS[toy].xp * RARITY[r].xp * 2), stars: RARITY[r].stars});

/* =====================================================================
   COSMÉTIQUES
   ===================================================================== */
export const SKINS = {
  santa: {
    classic: {name: 'Tenue de rang', r: 0, price: 0, desc: 'Évolue avec ton niveau'},
    forest:  {name: 'Sapin', r: 1, price: 120, coat: ['#3fbf6a', '#1c7a40']},
    frost:   {name: 'Givre', r: 1, price: 120, coat: ['#8fd8ff', '#2d7fc4'], beard: ['#ffffff', '#cfe6ff']},
    pyjama:  {name: 'Pyjama douillet', r: 2, price: 0, coat: ['#ff9ec4', '#c9507c'], unlock: 'Série de 7 jours'},
    ginger:  {name: "Pain d'épices", r: 2, price: 300, coat: ['#d08a4e', '#7a4420']},
    night:   {name: 'Nuit étoilée', r: 2, price: 300, coat: ['#5b4bd6', '#241a6b'], beard: ['#ffffff', '#c9c4ff']},
    royal:   {name: 'Velours royal', r: 3, price: 800, coat: ['#b0124a', '#5a0624'], beard: ['#ffffff', '#f2e3c4']},
    gold:    {name: 'Père Noël doré', r: 3, price: 0, coat: ['#ffd84a', '#c98a10'], beard: ['#ffffff', '#fff1c4'], unlock: 'Album complet'},
  },
  elves: {
    classic: {name: 'Multicolores', r: 0, price: 0, hoods: [['#3fbf6a', '#1c7a40'], ['#ef3b4f', '#a3162a'], ['#ffd34a', '#d8901c'], ['#4fb8ff', '#1f6fc0']]},
    frost:   {name: 'Lutins des glaces', r: 1, price: 150, hoods: [['#cfeeff', '#6fb6e8'], ['#8fd8ff', '#2d7fc4']]},
    candy:   {name: "Sucres d'orge", r: 2, price: 250, hoods: [['#ff5a76', '#b0123a'], ['#ffffff', '#ffc2cf']]},
    gold:    {name: 'Garde dorée', r: 3, price: 0, hoods: [['#ffd84a', '#c98a10']], unlock: 'Série de 30 jours'},
  },
  bases: {
    classic: {name: 'Selon le niveau', r: 0, price: 0},
    candy:   {name: "Sucre d'orge", r: 1, price: 150, top: '#fff3f5', rim: '#ff3d5a'},
    ice:     {name: 'Glace', r: 2, price: 250, top: '#dff3ff', rim: '#62b8f0'},
    choco:   {name: 'Chocolat', r: 2, price: 250, top: '#8a5634', rim: '#4e2c18'},
    gold:    {name: 'Or massif', r: 3, price: 600, top: '#fff1c4', rim: '#f2b632'},
  },
};
export const SKIN_CATS = {santa: 'Père Noël', elves: 'Lutins', bases: 'Socles'};

/* =====================================================================
   ÉVÉNEMENT DU JOUR (énergie qui se recharge)
   ===================================================================== */
export const ENERGY_MAX = 5, ENERGY_MS = 20 * 60 * 1000;
export const EVENTS = [
  {k: 'sleigh', name: 'Grande course de traîneaux', desc: 'Chaque partie de la Tournée de Noël rapporte des points d\'événement égaux à ton score.', action: 'Jouer'},
  {k: 'hunt', name: 'Chasse aux cadeaux', desc: 'Ouvre les paquets mystère du tableau. Chaque paquet rapporte une récompense et 40 points.', action: 'Ouvrir'},
  {k: 'snow', name: 'Guerre des boules de neige', desc: 'Chaque partie de Bataille de boules de neige rapporte 4 points par point de score.', action: 'Jouer'},
  {k: 'rush', name: "Rush de l'atelier", desc: "Les jouets fabriqués (+10), les lettres (+50) et les cadeaux livrés (+30) rapportent des points. Une clochette termine tout de suite le jouet en cours (+40).", action: 'Coup de main'},
];
const dayNum = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
export const eventToday = () => EVENTS[dayNum() % EVENTS.length];
export const EVENT_TIERS = [100, 250, 450, 700, 1000, 1400, 1900, 2500];
export function eventRewards(i, pl){
  const m = Math.pow(1.25, pl / 2);
  const free = [{coins: Math.round(300 * m)}, {wood: Math.round(200 * m)}, {stars: 5}, {cookies: Math.round(150 * m), fabric: Math.round(60 * m)}, {tickets: 2}, {stars: 10}, {coins: Math.round(1200 * m)}, {stars: 20}][i];
  const prem = [{stars: 10}, {coins: Math.round(800 * m)}, {stars: 15}, {tickets: 3}, {stars: 25}, {coins: Math.round(2500 * m)}, {stars: 40}, {stars: 80}][i];
  return {free, prem};
}

/* =====================================================================
   CONNEXION QUOTIDIENNE & SÉRIE
   ===================================================================== */
export function loginReward(day, pl){
  const m = Math.pow(1.25, pl / 2);
  return [{coins: Math.round(300 * m)}, {wood: Math.round(250 * m), cookies: Math.round(120 * m)}, {stars: 5}, {tickets: 2}, {fabric: Math.round(100 * m)}, {coins: Math.round(1000 * m)}, {stars: 25}][day % 7];
}
export const STREAK = {3: {stars: 10}, 7: {stars: 30, skin: 'santa:pyjama'}, 14: {stars: 50}, 30: {stars: 100, skin: 'elves:gold'}, 60: {stars: 150}, 100: {stars: 300}};
export const streakBonus = n => STREAK[n] || (n > 100 && n % 50 === 0 ? {stars: 200} : null);
export const SAVE_STREAK_COST = 20;

/* =====================================================================
   BOUTIQUE (monnaie premium : les étoiles)
   ===================================================================== */
export const PRODUCTS = {
  starter: {name: 'Pack du débutant', price: '2,99 €', once: true, tag: 'Une seule fois', give: {stars: 300, coins: 3000, skin: 'santa:forest'}},
  pass:    {name: 'Pass des Fêtes (30 jours)', price: '7,99 €', give: {pass: 30}, perks: ['Récompenses premium des événements', '1 lutin bâtisseur en plus', '1 clochette d\'énergie en plus']},
  s1: {name: 'Poignée d\'étoiles', price: '0,99 €', give: {stars: 100}},
  s2: {name: 'Sac d\'étoiles', price: '4,99 €', give: {stars: 550}, tag: '+10 %'},
  s3: {name: 'Hotte d\'étoiles', price: '9,99 €', give: {stars: 1200}, tag: '+20 %'},
  s4: {name: 'Traîneau d\'étoiles', price: '19,99 €', give: {stars: 2600}, tag: 'Populaire'},
  s5: {name: 'Montagne d\'étoiles', price: '49,99 €', give: {stars: 7000}, tag: 'Meilleure offre'},
};
export const weekKey = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); const w1 = new Date(d.getFullYear(), 0, 4); return `${d.getFullYear()}-w${1 + Math.round(((d - w1) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7)}`; };
export const TOUR_TIERS = [500, 1500, 3500, 7000, 12000, 20000];
export const tourReward = (i, pl) => { const m = Math.pow(1.25, pl / 2); return [{coins: Math.round(800 * m)}, {stars: 15}, {tickets: 3, coins: Math.round(1500 * m)}, {stars: 40}, {coins: Math.round(5000 * m), stars: 30}, {stars: 120}][i]; };
export const GUILD_PL = 4;
