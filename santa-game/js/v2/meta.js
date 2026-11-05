// Systèmes « autour » du village, comme dans Township, Hay Day, Clash of Clans et Bid Master :
// boutique complète, missions du jour, Pass de Noël, succès, marché du village, profil.
// Aucune dépendance graphique : tout se teste avec le simulateur.
import * as T from './town.js';

const R5 = n => n < 100 ? Math.round(n) : Math.round(n / 5) * 5;
const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const seeded = seed => { let r = 0; for (const c of seed) r = (r * 31 + c.charCodeAt(0)) % 233280; return () => (r = (r * 9301 + 49297) % 233280) / 233280; };

/* ===================== BOUTIQUE ===================== */
// Prix en étoiles d'or d'une quantité de ressource (barème de Clash of Clans : plus on achète, moins c'est cher à l'unité).
export function priceStars(k, n){
  if (n <= 0) return 0;
  if (k === 'ice') return Math.ceil(n * 1.5);
  if (k === 'gold') return Math.ceil(n * 6);
  if (k === 'axe' || k === 'saw') return n * 15;
  return Math.max(1, Math.ceil(Math.pow(n, .7) / 4));
}
// Paquets de ressources : 10 %, 50 % ou de quoi remplir le stock
export function resPacks(s, k){
  if (k === 'coins'){ const ref = T.hqStock(T.hqLv(s)) * 2; return [[.1, 'Une bourse'], [.5, 'Un sac'], [1, 'Un coffre']].map(([f, name]) => ({name, n: R5(ref * f)})).map(p => ({...p, stars: priceStars('coins', p.n)})); }
  if (k === 'ice' || k === 'gold'){ const base = k === 'ice' ? [10, 50, 200] : [3, 15, 60]; return base.map((n, i) => ({name: ['Une poignée', 'Un sac', 'Une caisse'][i], n, stars: priceStars(k, n)})); }
  const cap = T.cap(s, k), room = Math.max(0, cap - (s[k] || 0));
  return [[.1, '10 % du stock'], [.5, '50 % du stock'], [1, 'Remplir le stock']].map(([f, name]) => { const n = f === 1 ? room : Math.min(room, R5(cap * f)); return {name, n, stars: priceStars(k, n)}; });
}
// Achats intégrés (argent réel). En version web, l'achat est simulé (gratuit) pour tester le parcours ;
// la version App Store passera par Apple.
export const IAP = {
  starter: {name: 'Pack du nouveau Père Noël', price: '4,99 €', once: true, tag: '-80 %', give: {stars: 500, coins: 5000, wood: 3000, cookies: 2000, ice: 30, axe: 2, saw: 2}},
  p1: {name: 'Poignée d’étoiles', price: '1,99 €', give: {stars: 80}},
  p2: {name: 'Sac d’étoiles', price: '9,99 €', tag: 'Populaire', give: {stars: 500}},
  p3: {name: 'Hotte d’étoiles', price: '19,99 €', give: {stars: 1200}},
  p4: {name: 'Traîneau d’étoiles', price: '39,99 €', give: {stars: 2500}},
  p5: {name: 'Étable d’étoiles', price: '99,99 €', tag: 'Meilleure offre', give: {stars: 6500}},
  pass: {name: 'Pass de Noël Or', price: '9,99 €', once: true, give: {}},
};
// Coffres en étoiles : rareté garantie (pas de tirage caché : on sait ce qu'on achète)
export const CHESTS = [{r: 1, stars: 40}, {r: 2, stars: 120}, {r: 3, stars: 350}];
// Offres du jour : 3 offres tirées chaque jour (comme la boutique quotidienne de Clash Royale), une seule fois chacune
export function dailyDeals(s, t = Date.now()){
  const day = dayKey(t), rnd = seeded(day + (s.name || '')), L = s.lvl, m = 1 + L * .25;
  const pool = [
    {k: 'wood', name: 'Charrette de bois', give: {wood: R5(900 * m)}, cost: {stars: Math.max(4, priceStars('wood', R5(900 * m)) - 4)}},
    {k: 'cookies', name: 'Fournée de biscuits', give: {cookies: R5(700 * m)}, cost: {stars: Math.max(4, priceStars('cookies', R5(700 * m)) - 4)}},
    {k: 'coinsdeal', name: 'Cassette du Père Noël', give: {coins: R5(1500 * m)}, cost: {stars: Math.max(5, priceStars('coins', R5(1500 * m)) - 5)}},
    {k: 'icedeal', name: 'Sac de cristaux', give: {ice: 8 + Math.round(L / 2)}, cost: {coins: R5(400 * m)}},
    {k: 'golddeal', name: 'Lingot d’or polaire', give: {gold: 2 + Math.floor(L / 8)}, cost: {coins: R5(1500 * m)}},
    {k: 'tools', name: 'Caisse à outils', give: {axe: 1, saw: 1}, cost: {coins: R5(800 * m)}},
    {k: 'parcel', name: 'Colis rare', give: {parcel: 1}, cost: {stars: 30}},
  ];
  const out = []; while (out.length < 3 && pool.length) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  s.deals ||= {}; if (s.deals.day !== day) s.deals = {day, bought: {}};
  return out.map(d => ({...d, done: !!s.deals.bought[d.k]}));
}

/* ===================== MISSIONS DU JOUR ===================== */
// 5 missions par jour, adaptées au niveau et aux bâtiments construits. Les points remplissent 3 coffres et le Pass de Noël.
const has = (s, type) => s.objs.some(o => o.type === type && !o.build);
const MTPL = [
  {k: 'collect:wood', t: n => `Récolte ${n} bois`, n: s => R5(600 * (1 + s.lvl * .35)), pts: 20},
  {k: 'collect:coins', t: n => `Récolte ${n} pièces au Bureau des lettres`, n: s => R5(400 * (1 + s.lvl * .35)), pts: 20},
  {k: 'collect:cookies', t: n => `Récolte ${n} biscuits`, n: s => R5(400 * (1 + s.lvl * .35)), pts: 20, ok: s => has(s, 'bakery')},
  {k: 'orders', t: n => `Livre ${n} lettres d’enfants`, n: s => 2 + Math.floor(s.lvl / 6), pts: 30, ok: s => has(s, 'workshop')},
  {k: 'make', t: n => `Fabrique ${n} jouets`, n: s => 3 + Math.floor(s.lvl / 5), pts: 25, ok: s => has(s, 'workshop')},
  {k: 'upgrade', t: n => `Lance ${n} amélioration${n > 1 ? 's' : ''}`, n: () => 2, pts: 25},
  {k: 'dig', t: n => `Creuse ${n} cases à la grotte`, n: () => 8, pts: 25, ok: s => has(s, 'mine')},
  {k: 'exp', t: n => `Envoie ${n} expédition${n > 1 ? 's' : ''} de rennes`, n: () => 2, pts: 25, ok: s => has(s, 'stable')},
  {k: 'parcel', t: n => `Ouvre ${n} colis mystère`, n: () => 2, pts: 20, ok: s => has(s, 'stable') || has(s, 'mine')},
  {k: 'games', t: n => `Joue ${n} mini-jeu${n > 1 ? 'x' : ''}`, n: () => 1, pts: 15, ok: s => has(s, 'stable')},
  {k: 'sell', t: n => `Vends ${n} fois au marché`, n: () => 2, pts: 15, ok: s => T.hqLv(s) >= MARKET_HQ},
];
export const MISSION_CHESTS = [40, 80, 120];
export function missions(s, t = Date.now()){
  const day = dayKey(t);
  if (!s.missions || s.missions.day !== day){
    const rnd = seeded(day + s.lvl), pool = MTPL.filter(m => !m.ok || m.ok(s)), list = [];
    while (list.length < 5 && pool.length){ const m = pool.splice(Math.floor(rnd() * pool.length), 1)[0]; const n = m.n(s); list.push({k: m.k, t: m.t(n), n, pts: m.pts, base: s.cnt[m.k] || 0, done: 0}); }
    s.missions = {day, list, pts: 0, chests: []};
  }
  for (const m of s.missions.list) m.v = Math.min(m.n, (s.cnt[m.k] || 0) - m.base);
  return s.missions;
}
export const missionChest = (s, i) => { const m = 1 + s.lvl * .3; return [{coins: R5(300 * m), wood: R5(250 * m)}, {coins: R5(600 * m), ice: 4 + Math.round(s.lvl / 3)}, {stars: 3, parcel: 1, coins: R5(900 * m)}][i]; };
/** Valide une mission terminée : renvoie les points gagnés (ils comptent aussi pour le Pass). */
export function missionClaim(s, i){
  const M = missions(s), m = M.list[i]; if (!m || m.done || m.v < m.n) return 0;
  m.done = 1; M.pts += m.pts; passAdd(s, m.pts); return m.pts;
}

/* ===================== PASS DE NOËL (saison de 28 jours) ===================== */
export const PASS_TIERS = 30, PASS_STEP = 100, SEASON_DAYS = 28;
export function pass(s, t = Date.now()){
  if (!s.pass || t > s.pass.start + SEASON_DAYS * 864e5){
    const n = (s.pass?.n || 0) + 1;
    s.pass = {n, start: t, xp: 0, free: {}, gold: {}, premium: false};
  }
  const P = s.pass; P.tier = Math.min(PASS_TIERS, Math.floor(P.xp / PASS_STEP)); P.end = P.start + SEASON_DAYS * 864e5;
  return P;
}
export const SEASONS = ['La Nuit Magique', 'Les Aurores Boréales', 'Le Grand Blizzard', 'Le Bal des Lutins'];
export const passAdd = (s, xp) => { const P = pass(s); P.xp += xp; };
export function passReward(s, tier, gold){
  const m = 1 + s.lvl * .25, big = tier % 5 === 0;
  if (!gold) return big ? {stars: 5, coins: R5(800 * m)} : tier % 2 ? {coins: R5(250 * m)} : {[['wood', 'cookies', 'fabric'][tier % 3]]: R5(250 * m)};
  return big ? (tier === PASS_TIERS ? {stars: 100, gold: 20, parcel: 3} : {stars: 25, parcel: 2}) : tier % 3 === 0 ? {gold: 2 + Math.floor(tier / 10)} : tier % 2 ? {ice: 10 + tier} : {stars: 8};
}
export function passClaim(s, tier, gold){
  const P = pass(s), key = gold ? 'gold' : 'free';
  if (tier > P.tier || P[key][tier] || (gold && !P.premium)) return null;
  P[key][tier] = 1; return passReward(s, tier, gold);
}

/* ===================== SUCCÈS (la grande source gratuite d'étoiles, comme Clash of Clans) ===================== */
export const ACH = [
  {k: 'collect:wood', name: 'Bûcheron du Pôle', d: 'Récolter du bois', tiers: [1000, 25000, 400000]},
  {k: 'collect:cookies', name: 'Pâtissier en chef', d: 'Récolter des biscuits', tiers: [800, 20000, 300000]},
  {k: 'orders', name: 'Facteur des enfants', d: 'Livrer des lettres', tiers: [10, 150, 1500]},
  {k: 'make', name: 'Maître jouetier', d: 'Fabriquer des jouets', tiers: [20, 300, 3000]},
  {k: 'upgrade', name: 'Grand bâtisseur', d: 'Lancer des améliorations', tiers: [10, 100, 600]},
  {k: 'dig', name: 'Mineur des glaces', d: 'Creuser des cases à la grotte', tiers: [50, 600, 6000]},
  {k: 'floor', name: 'Spéléologue', d: 'Descendre des étages de la grotte', tiers: [5, 40, 200]},
  {k: 'exp', name: 'Explorateur du Grand Nord', d: 'Envoyer des expéditions', tiers: [5, 60, 400]},
  {k: 'parcel', name: 'Chasseur de colis', d: 'Ouvrir des colis mystère', tiers: [10, 120, 1000]},
  {k: 'expand', name: 'Pionnier', d: 'Dégager de nouveaux terrains', tiers: [1, 4, 10]},
  {k: 'sell', name: 'Marchand du village', d: 'Vendre au marché', tiers: [10, 100, 1000]},
  {k: 'lvl', name: 'Légende du Pôle', d: 'Atteindre un niveau', tiers: [10, 30, 60]},
];
export const achValue = (s, a) => a.k === 'lvl' ? s.lvl : s.cnt[a.k] || 0;
export const achStars = [5, 15, 40];
export function achState(s, a){
  s.ach ||= {}; const got = a.tiers.filter(n => achValue(s, a) >= n).length, claimed = s.ach[a.k] || 0;
  return {got, claimed, next: a.tiers[Math.min(claimed, 2)], can: got > claimed};
}
export const achClaimable = s => ACH.filter(a => achState(s, a).can).length;
export function achClaim(s, a){
  const st = achState(s, a); if (!st.can) return null;
  s.ach[a.k] = st.claimed + 1; return {stars: achStars[st.claimed], coins: R5(200 * Math.pow(6, st.claimed) * (1 + s.lvl * .1))};
}

/* ===================== MARCHÉ DU VILLAGE (Hay Day : on revend le surplus, un marchand passe chaque jour) ===================== */
export const MARKET_HQ = 3;
export const SELL_RATE = {wood: .5, cookies: .7, fabric: 1.2};
export const sellToy = k => Math.round(T.TOYS[k].value * .6);
/** Le marchand ambulant : 3 offres du jour, son humeur change les prix (comme les clients de Bid Master). */
export function merchant(s, t = Date.now()){
  const day = dayKey(t), rnd = seeded('m' + day);
  s.merchant ||= {}; if (s.merchant.day !== day) s.merchant = {day, bought: {}};
  const mood = rnd(), moodName = mood < .33 ? 'grognon' : mood < .66 ? 'de bonne humeur' : 'très généreux', f = mood < .33 ? 1.3 : mood < .66 ? 1 : .75, L = s.lvl;
  const offers = [
    {k: 'ice', give: {ice: 5 + Math.floor(L / 3)}, cost: {coins: R5((300 + L * 60) * f)}, stock: 3},
    {k: 'gold', give: {gold: 1 + Math.floor(L / 12)}, cost: {coins: R5((1200 + L * 200) * f)}, stock: 2},
    {k: 'fabric', give: {fabric: R5(200 + L * 40)}, cost: {coins: R5((260 + L * 50) * f)}, stock: 3},
    {k: 'tools', give: {[rnd() < .5 ? 'axe' : 'saw']: 1}, cost: {coins: R5((600 + L * 90) * f)}, stock: 2},
  ];
  return {mood: moodName, offers: offers.map(o => ({...o, left: o.stock - (s.merchant.bought[o.k] || 0)}))};
}

/* ===================== TITRES (profil) ===================== */
export const TITLES = [[1, 'Lutin apprenti'], [5, 'Lutin malin'], [10, 'Chef des lutins'], [15, 'Gardien des rennes'], [20, 'Seigneur des neiges'], [30, 'Prince du Pôle'], [45, 'Roi de l’Hiver'], [60, 'Légende de Noël']];
export const titleOf = L => TITLES.filter(([n]) => L >= n).pop()[1];
