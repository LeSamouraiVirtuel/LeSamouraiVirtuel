// Course vers le sommet (Maison du Père Noël niv. 25) : temps MINIMUM pour un joueur qui achète tout (étoiles illimitées),
// avant et après les freins de la v88 (plafond de 24 h d'accélération par jour + défis de fin qui ne s'achètent pas).
// Hypothèses : il joue dès que c'est utile, achète toutes les ressources, accélère tout ce qui est permis.
// Actif (non achetable) : jouets fabriqués à l'atelier, espèces de poissons (≈ 138 lancers avec tous les bonus achetés, tools/fish-sim.mjs),
// camps de trolls (≈ 1,5 min par bataille). Ces activités se font en parallèle des chantiers.
const T = await import(new URL('../js/v2/town.js', import.meta.url).href);
const H = 3600, D = 86400, MAX = T.BUILDINGS.santa.max;
const hm = s => s < H ? Math.round(s / 60) + ' min' : s < D ? (s / H).toFixed(1) + ' h' : (s / D).toFixed(1) + ' jours';
function race({cap, challenges}){
  let t = 0, lv = 1, used = 0, day = 0; const steps = [];
  while (lv < MAX){
    const next = lv + 1; let need = T.upTime('santa', next);
    // défis de fin : jouets (fabrication ~ durée des jouets, en parallèle), poissons et camps (temps actif, en parallèle des chantiers)
    while (need > 0){
      const d = Math.floor(t / D); if (d !== day){ day = d; used = 0; }
      const left = cap ? Math.max(0, T.SPEED_DAY_CAP - used) : Infinity;
      if (left >= need || !cap){ used += need; need = 0; t += 5; break; }       // on accélère le reste
      // sinon : on accélère ce qu'on peut, et on attend la fin de la journée (le chantier avance tout seul)
      need -= left; used += left; const toMidnight = (day + 1) * D - t;
      if (need <= toMidnight){ t += need; need = 0; } else { need -= toMidnight; t += toMidnight; }
    }
    lv = next; if ([10, 15, 20, 25].includes(lv)) steps.push(`Maison ${lv} : ${hm(t)}`);
  }
  // part active (non achetable) des défis, si elle dépasse le temps des chantiers
  let active = 0;
  if (challenges){ // 80 points d'aventure : le plus rapide = 12 espèces (36 pts, ~138 lancers) + 22 camps (44 pts)
    const fishCasts = 138, castSec = 20, camps = 22, battleSec = 90;
    let toys = 0; for (const c of Object.values(T.HQ_CHALLENGE)) toys += c.toy[1] * T.TOYS.bigsled.time;
    active = fishCasts * castSec + camps * battleSec + toys / 8;
    steps.push(`activité obligatoire (≈ ${fishCasts} lancers de pêche + ${camps} batailles, ou des lettres et des expéditions ; ${Object.values(T.HQ_CHALLENGE).reduce((a, c) => a + c.toy[1], 0)} jouets) : ${hm(active)} de jeu, faites pendant les chantiers`); }
  return {t: Math.max(t, active), steps};
}
const before = race({cap: false, challenges: false}), after = race({cap: true, challenges: true});
console.log('Durée totale des chantiers de la Maison (sans accélérer) :', hm(T.HQ_TIME.reduce((a, b) => a + b, 0)));
console.log('AVANT (tout s\'achète, accélérations illimitées) : sommet en', hm(before.t), '·', before.steps.join(' · '));
console.log('APRÈS (24 h d\'accélération par jour, défis de fin) : sommet en', hm(after.t)); for (const s of after.steps) console.log('   ' + s);
