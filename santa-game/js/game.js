// Règles du jeu : ressources, bâtiments, coûts, quêtes, sauvegarde. Aucune dépendance 3D.
import {HQ_ID} from './world.js';

export const RES = {
  coins:   {name: 'Pièces'},
  wood:    {name: 'Bois'},
  cookies: {name: 'Biscuits'},
  gifts:   {name: 'Cadeaux'},
};
export const TYPES = {
  hq:      {name: 'Maison du Père Noël', desc: "Le cœur du village. Son niveau limite celui des autres bâtiments, agrandit le stock et débloque les terrains plus haut sur la montagne.", cost: {coins: 150, wood: 120, cookies: 25}, time: 10},
  sawmill: {name: 'Scierie', prod: 'wood', rate: 30, desc: "Les lutins débitent les vieux sapins en belles planches.", cost: {coins: 60, wood: 30}, time: 5, hq: 1},
  post:    {name: 'Bureau des lettres', prod: 'coins', rate: 40, desc: "Les lettres des enfants arrivent ici, souvent avec une petite pièce pour le village.", cost: {coins: 30, wood: 50}, time: 6, hq: 1},
  bakery:  {name: 'Four à biscuits', prod: 'cookies', rate: 20, desc: "Des biscuits au gingembre tout chauds. Indispensables pour les gros chantiers.", cost: {coins: 80, wood: 60}, time: 6, hq: 1},
  workshop:{name: 'Atelier des lutins', prod: 'gifts', rate: 10, desc: "On y fabrique les jouets et on emballe les cadeaux. Le petit train les emmène au traîneau.", cost: {coins: 150, wood: 120, cookies: 30}, time: 8, hq: 2},
  storage: {name: 'Entrepôt', desc: "Agrandit le stock maximum de toutes les ressources.", cost: {coins: 120, wood: 150}, time: 8, hq: 2},
  stable:  {name: 'Écurie des rennes', unique: true, desc: "Les rennes tirent le traîneau. Chaque niveau ajoute de la place pour les cadeaux d'une tournée.", cost: {coins: 300, wood: 250, cookies: 100}, time: 12, hq: 3},
};
export const BUILDABLE = ['sawmill', 'post', 'bakery', 'workshop', 'storage', 'stable'];
export const MAX_LV = 10, BUILDERS = 2;
export const RANKS = ['Lutin apprenti', 'Lutin confirmé', 'Chef des lutins', 'Maître jouetier', 'Gardien des rennes', "Héraut de l'hiver", 'Seigneur des neiges', 'Prince du Pôle', 'Presque Père Noël', 'Père Noël'];
export const ZONES = [
  {hq: 1, name: 'Le Camp du bas'},
  {hq: 2, name: 'Les Pentes enneigées'},
  {hq: 4, name: 'La Forêt des sapins'},
  {hq: 6, name: 'Le Sommet du Pôle'},
];
export const DELIVERY_MS = 20000;

export const rate = (t, lv) => Math.round(TYPES[t].rate * Math.pow(1.45, lv - 1));
export const bufCap = (t, lv) => rate(t, lv) * 3;
const r5 = n => Math.max(5, Math.round(n / 5) * 5);
export const costOf = (t, lv) => { const c = {}, m = Math.pow(1.65, lv - 1); for (const k in TYPES[t].cost) c[k] = r5(TYPES[t].cost[k] * m); return c; };
export const timeOf = (t, lv) => Math.round(TYPES[t].time * Math.pow(1.55, lv - 1));
export const sleighCapOf = lv => lv > 0 ? 20 + 15 * (lv - 1) : 0;
export const storageBonus = lv => Math.round(600 * Math.pow(1.6, lv - 1));

/* ---------------- état ---------------- */
const SAVE_KEY = 'village-du-pole-v2';
export function newState(){
  return {
    v: 2, res: {coins: 250, wood: 150, cookies: 20, gifts: 0}, stars: 0,
    plots: {
      [HQ_ID]: {type: 'hq', lv: 1, buf: 0},
      '0-0-0': {type: 'sawmill', lv: 1, buf: 25},
      '0-0-2': {type: 'post', lv: 1, buf: 40},
    },
    quest: 0, stats: {wood: 0, gifts: 0, delivered: 0, trips: 0}, delivery: null, t: Date.now(),
  };
}
export function loadState(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.v === 2) return s; } catch(e){} return null; }
export function saveState(s){ s.t = Date.now(); try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch(e){} }
export function clearSave(){ try { localStorage.removeItem(SAVE_KEY); } catch(e){} }

export function rules(getState){
  const S = () => getState();
  const hqLv = () => S().plots[HQ_ID].lv;
  const zoneOpen = k => hqLv() >= ZONES[k].hq;
  const openZones = () => ZONES.filter(z => hqLv() >= z.hq).length;
  const plotsOf = t => Object.values(S().plots).filter(p => p.type === t);
  const bestLv = t => plotsOf(t).reduce((m, p) => Math.max(m, p.lv), 0);
  const maxCount = t => TYPES[t].unique ? 1 : t === 'storage' ? 1 + Math.floor(hqLv() / 4) : 1 + Math.floor(hqLv() / 2);
  const busyBuilders = () => Object.values(S().plots).filter(p => p.upEnd).length;
  const storeCap = () => { let c = 500 + 300 * (hqLv() - 1); for (const p of plotsOf('storage')) if (p.lv > 0) c += storageBonus(p.lv); return c; };
  const sleighCap = () => sleighCapOf(bestLv('stable'));
  const canAfford = c => Object.keys(c).every(k => S().res[k] >= c[k]);
  const fitsStore = c => Object.keys(c).every(k => c[k] <= storeCap());
  const ready = p => TYPES[p.type].prod && p.lv > 0 && !p.upEnd && (p.buf || 0) >= Math.max(1, rate(p.type, p.lv) * .2);

  function upgradeBlock(id){
    const p = S().plots[id], to = p.lv + 1;
    if (p.upEnd) return 'Chantier en cours';
    if (to > MAX_LV) return 'Niveau maximum atteint';
    if (p.type !== 'hq' && to > hqLv()) return `Améliore d'abord la Maison au niveau ${to}`;
    const c = costOf(p.type, to);
    if (!fitsStore(c)) return 'Stock trop petit : améliore la Maison ou un Entrepôt';
    if (busyBuilders() >= BUILDERS) return `Tes ${BUILDERS} lutins bâtisseurs sont occupés`;
    if (!canAfford(c)) return 'Ressources insuffisantes';
    return null;
  }
  function buildBlock(t){
    const T = TYPES[t];
    if (hqLv() < T.hq) return `Maison niveau ${T.hq} requise`;
    if (plotsOf(t).length >= maxCount(t)) return T.unique ? 'Déjà construit' : `Maximum ${maxCount(t)} pour l'instant`;
    if (busyBuilders() >= BUILDERS) return 'Lutins bâtisseurs occupés';
    if (!canAfford(costOf(t, 1))) return 'Ressources insuffisantes';
    return null;
  }
  const QUESTS = [
    {t: 'Touche la bulle au-dessus de la Scierie pour récolter du bois', ok: s => s.stats.wood > 0, rw: {coins: 50}},
    {t: 'Construis un Four à biscuits sur un terrain libre', ok: () => bestLv('bakery') >= 1, rw: {coins: 80, wood: 40}},
    {t: 'Améliore la Maison du Père Noël au niveau 2', ok: () => hqLv() >= 2, rw: {coins: 120, wood: 80}},
    {t: "Construis l'Atelier des lutins", ok: () => bestLv('workshop') >= 1, rw: {cookies: 60}},
    {t: 'Améliore la Scierie au niveau 2', ok: () => bestLv('sawmill') >= 2, rw: {coins: 100}},
    {t: "Emballe 30 cadeaux à l'Atelier", ok: s => s.stats.gifts >= 30, prog: s => [s.stats.gifts, 30], rw: {coins: 200}},
    {t: 'Améliore la Maison au niveau 3', ok: () => hqLv() >= 3, rw: {coins: 250, wood: 200}},
    {t: "Construis l'Écurie des rennes", ok: () => bestLv('stable') >= 1, rw: {gifts: 20}},
    {t: 'Lance une tournée en traîneau', ok: s => s.stats.trips >= 1, rw: {coins: 300}},
    {t: 'Maison niveau 4 : débloque la Forêt des sapins', ok: () => hqLv() >= 4, rw: {coins: 500, wood: 400}},
    {t: 'Livre 150 cadeaux aux enfants', ok: s => s.stats.delivered >= 150, prog: s => [s.stats.delivered, 150], rw: {coins: 600, cookies: 200}},
    {t: 'Maison niveau 6 : débloque le Sommet du Pôle', ok: () => hqLv() >= 6, rw: {coins: 1500, wood: 1200}},
    {t: 'Maison niveau 10 : deviens le Père Noël !', ok: () => hqLv() >= 10, rw: {coins: 5000}},
  ];
  return {hqLv, zoneOpen, openZones, plotsOf, bestLv, maxCount, busyBuilders, storeCap, sleighCap, canAfford, fitsStore, ready, upgradeBlock, buildBlock, QUESTS};
}
