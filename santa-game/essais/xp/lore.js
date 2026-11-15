// ESSAI — Bible du lore : le monde, les personnages, l'histoire en actes liée aux niveaux de la Maison et aux saisons,
// et les événements qui la font évoluer dans le temps. Les actes déjà atteints par le village sont déverrouillés.
const E = () => window.__ess;
const ACTES = [
  {m: 1, t: 'Acte I — La passation', s: 'Hiver, 1re semaine', d: "Après 300 Noëls, le vieux Père Noël confie son village à un jeune successeur : toi. La scierie grince, le four est froid, et les lutins doutent. Le Krampus des Glaces, ancien Gardien de l'Hiver oublié de tous, jure d'éteindre l'Étoile du Nord."},
  {m: 6, t: "Acte II — L'atelier se réveille", s: 'Avent', d: "Les lettres des enfants affluent. L'Atelier rouvre, les jouets reprennent vie. Mère Noël enseigne l'art du papier cadeau, et Flocon, un renneau tout blanc, naît à l'Écurie le soir de la première neige."},
  {m: 10, t: 'Acte III — Les trolls descendent', s: 'Mi-décembre', d: "Les trolls du Krampus volent les cadeaux et dressent leurs camps violets dans la montagne. Chaque camp repris rallume une lanterne sur la carte du Grand Nord. Leur chef, Grognon le Grand, garde le col."},
  {m: 14, t: 'Acte IV — La nuit des lanternes', s: 'Solstice', d: "La nuit la plus longue : les trolls éteignent toutes les lanternes du village. Le nouveau Père Noël prend le traîneau pour les rallumer une à une. C'est la première fois que le vieux Père Noël l'appelle « Père Noël » sans « petit »."},
  {m: 18, t: "Acte V — Le cœur de l'Étoile", s: '24 décembre', d: "L'Étoile du Nord faiblit. Sa lumière dort dans les cristaux de la grotte et les lingots d'or polaire. Le Krampus tente un dernier assaut sous les aurores. S'il est vaincu… il n'est pas détruit : on découvre qu'il voulait seulement qu'on se souvienne de lui."},
  {m: 22, t: 'Acte VI — Le Gardien retrouvé', s: 'Nouvel An et après', d: "Le Krampus redevient Gardien de l'Hiver, à condition que chaque saison lui laisse sa place. Le monde s'agrandit : nouveaux territoires, nouvelles légendes, et chaque année une nouvelle « nuit » à défendre."},
];
const PERSOS = [
  ['Le vieux Père Noël', "Mentor bourru et tendre, genoux qui grincent, blagues de 300 ans. Il vieillit au fil des actes et apparaît de moins en moins… jusqu'à son dernier « Ho ho ho » à l'Acte V."],
  ['Toi, le nouveau Père Noël', "Le joueur. Chaque niveau de la Maison est une étape de ta légende ; les lutins t'appellent d'abord « le petit », puis « chef », puis « Père Noël »."],
  ['Les lutins', "Pic le mineur, Monsieur Fil le marionnettiste, Maître Rouage l'inventeur, Mademoiselle Plume la bibliothécaire, Gros Ours le docker. Chacun a son chapitre et ses répliques."],
  ['Flocon', "Le renneau magique. Il grandit en 6 stades et finit par guider le traîneau la nuit de Noël. Son humeur dépend de tes soins."],
  ['Les trolls', "Pas méchants mais affamés et rancuniers : le Krampus leur a promis tous les biscuits du Pôle. On peut en « convertir » certains (événements)."],
  ['Le Krampus des Glaces', "Ancien Gardien de l'Hiver, oublié quand les enfants n'ont plus attendu que Noël. Antagoniste tragique : il évolue avec l'histoire."],
];
const EVTS = [
  ['Chaque saison (4 semaines)', "Un nouvel acte « de saison » : décor, quête de chapitre, boss de camp, récompenses de pass liées au récit."],
  ['Chaque semaine', "Un événement court qui fait avancer une intrigue secondaire (la tempête de neige, la fuite des rennes, la fête des lutins)."],
  ['Chaque niveau de la Maison', "Une transition jouable unique (comme « La nuit des lanternes ») avec cinématique dans le village et page du livre des légendes."],
  ['Dates réelles', "Avent (1er–24 décembre), solstice, Noël, Nouvel An, Chandeleur : le village change d'aspect et le récit en tient compte."],
  ['Carte des trolls', "Chaque région reprise change le monde : la neige redevient blanche, des lutins reviennent, un personnage rejoint le village."],
];
export function openLore(){
  const {S, T} = E(), hq = T.hqLv(S);
  const ov = document.createElement('div'); ov.className = 'xpov';
  ov.innerHTML = `<header><h2>Bible du lore (essai)</h2><button data-x="close">Fermer</button></header><div class="lorebox">
    <h3>Le monde</h3><p>Le Pôle Nord vit grâce à l'<b>Étoile du Nord</b>, dont la lumière fait marcher la magie de Noël. Elle faiblit quand on oublie l'esprit de Noël. Autour du village : la forêt des Murmures, le Lac Gelé, la Grotte aux cristaux, et la montagne des trolls, violette sous les aurores.</p>
    <h3>Les personnages</h3>${PERSOS.map(([n, d]) => `<div class="act"><b>${n}</b><br>${d}</div>`).join('')}
    <h3>L'histoire en actes</h3><p><small>Les actes avancent avec les niveaux de la Maison (ton village : Maison niv. ${hq}) et avec les saisons.</small></p>
    ${ACTES.map(a => `<div class="act ${hq >= a.m || (a.m === 14 && S.xpLore?.lanternes) ? '' : 'lock'}"><b>${a.t}</b> <small>· Maison niv. ${a.m} · ${a.s}</small><br>${hq >= a.m || (a.m === 14 && S.xpLore?.lanternes) ? a.d : '🔒 Se débloque au niveau ' + a.m + ' de la Maison.'}</div>`).join('')}
    <h3>Ce qui fait évoluer l'histoire</h3>${EVTS.map(([n, d]) => `<div class="act"><b>${n}</b><br>${d}</div>`).join('')}</div>`;
  document.body.appendChild(ov);
  ov.querySelector('[data-x=close]').onclick = () => ov.remove();
}
