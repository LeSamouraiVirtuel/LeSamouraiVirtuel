// Simulation du carnet de pêche : combien de lancers (et d'euros affichés) pour pêcher les 12 espèces, sans et avec achats.
// Usage : node tools/fish-sim.mjs [nombre de joueurs simulés]
globalThis.localStorage = {getItem: () => null, setItem(){}};
const T = await import(new URL('../js/v2/town.js', import.meta.url).href);
const N = +process.argv[2] || 3000;
const EUR_PER_STAR = 9.99 / 500;                  // le « Sac d'étoiles » (500 étoiles pour 9,99 €)
const SKILL = [.9, .82, .72, .62];                // réussite du combat sans filet, selon la rareté (joueur moyen)
function run(buyer){
  const s = {lvl: 15, fish: {}}; const x = T.fishState(s); let casts = 0, stars = 0;
  if (buyer){ for (let l = 1; l <= T.ROD_MAX; l++) stars += T.ROD_COST[l]; x.rod = T.ROD_MAX; }
  let t = 0;                                       // secondes de jeu (≈ 25 s par lancer)
  while (Object.keys(s.fish).length < T.FISH.length && casts < 20000){
    if (buyer){ if (x.bait <= 0){ x.bait = T.FISH_SHOP.bait.casts; stars += T.FISH_SHOP.bait.stars; } if (x.charm <= t * 1000){ x.charm = t * 1000 + 30 * 60e3; stars += T.FISH_SHOP.charm.stars; } }
    const now = t * 1000, realNow = Date.now; Date.now = () => now; const f = T.fishRoll(s); Date.now = realNow;
    casts++; t += 25;
    let ok = Math.random() < SKILL[f.r];
    if (buyer && f.r >= 2 && !ok){ stars += T.FISH_SHOP.net.stars; ok = true; }       // filet seulement sur épique / légendaire
    if (ok) T.fishCatch(s, f);
  }
  return {casts, stars, eur: stars * EUR_PER_STAR};
}
const stat = a => { a.sort((p, q) => p - q); return {moy: Math.round(a.reduce((p, q) => p + q, 0) / a.length), med: a[a.length >> 1], p90: a[Math.floor(a.length * .9)]}; };
for (const buyer of [false, true]){
  const R = Array.from({length: N}, () => run(buyer));
  const c = stat(R.map(r => r.casts)), e = stat(R.map(r => r.eur));
  console.log(`${buyer ? 'AVEC achats (canne niv. 5 + appâts + porte-bonheur + filets sur épique/légendaire)' : 'SANS achat'} : lancers moyenne ${c.moy}, médiane ${c.med}, 9 joueurs sur 10 en moins de ${c.p90}` + (buyer ? ` · dépense moyenne ${e.moy} € affichés (médiane ${e.med} €, 9 sur 10 sous ${e.p90} €)` : ''));
}
const s0 = {lvl: 15}; console.log('chances de base :', T.fishOdds(s0).join(' / '), '% · avec tous les bonus (plafonnées) :', (() => { const s1 = {lvl: 15}; const x = T.fishState(s1); x.rod = 5; x.bait = 5; x.charm = Date.now() + 1e6; return T.fishOdds(s1).join(' / '); })(), '%');
