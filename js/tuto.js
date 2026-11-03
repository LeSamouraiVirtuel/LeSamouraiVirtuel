// Didacticiel guidé des premières minutes, sur le modèle de Township, Hay Day et Clash of Clans :
// un personnage guide qui parle, une main qui montre où toucher, le reste de l'écran assombri et bloqué,
// une seule action à la fois, moins de 3 minutes.
//
// main.js appelle tutoEvent('collect' | 'quest' | 'open' | 'build' | 'speed' | 'close', donnée) à chaque action du joueur.

const STEPS = [
  {say: "Bienvenue au Pôle Nord ! Le vieux Père Noël prend sa retraite et c'est <b>toi</b> qu'il a choisi pour lui succéder. Je suis Pépin, je vais t'aider à démarrer.", tap: true},
  {say: "La scierie a déjà coupé du bois. <b>Touche la bulle</b> pour le récolter !", target: () => bubble('0-0-0'), wait: 'collect', focus: '0-0-0'},
  {say: "Bravo ! En bas, ton <b>objectif</b> te dit toujours quoi faire. Il est rempli : <b>touche-le</b> pour gagner ta récompense.", target: () => q('#quest'), wait: 'quest'},
  {say: "Il nous faut des biscuits pour motiver les lutins. <b>Touche le +</b> pour construire sur ce terrain.", target: () => plus('0-1-0'), wait: 'open', focus: '0-1-0'},
  {say: "Choisis le <b>Four à biscuits</b>.", target: () => q('[data-a="build"][data-t="bakery"]'), wait: 'build'},
  {say: "Les lutins bâtisseurs sont au travail ! Les chantiers prennent du temps, mais une <b>étoile</b> permet de finir tout de suite. Essaie !", target: () => q('[data-a="speed"]'), wait: 'speed', skipIf: s => !Object.values(s.plots).some(p => p.upEnd)},
  {say: "Et voilà ton four ! <b>Ferme la fenêtre</b> pour retourner au village.", target: () => q('#sheet .x'), wait: 'close'},
  {say: "Tu sais l'essentiel ! Suis tes objectifs, monte de niveau, et tu débloqueras l'atelier de jouets, les lettres des enfants, les mini-jeux, les guildes… Bonne chance, futur Père Noël !", tap: true, end: true},
];

const q = s => document.querySelector(s);
const bubble = id => q(`.bubble[data-id="${id}"]`);
const plus = id => q(`.plus[data-id="${id}"]`);

export function createTuto({getState, save, focusPlot, portrait, sfx, steps = STEPS}){
  const STEPS_ = steps;
  const S = getState;
  const root = document.createElement('div'); root.id = 'tuto'; root.hidden = true;
  root.innerHTML = `<div class="tb t"></div><div class="tb r"></div><div class="tb b"></div><div class="tb l"></div>
    <div class="tring"></div><div class="thand"></div>
    <div class="tbox"><img alt=""><div class="tname">Pépin</div><p></p><span class="tnext">Toucher pour continuer ▾</span></div>`;
  document.body.appendChild(root);
  root.querySelector('.tbox img').src = portrait;
  const [bt, br, bb, bl] = root.querySelectorAll('.tb'), ring = root.querySelector('.tring'), hand = root.querySelector('.thand'), box = root.querySelector('.tbox');
  let step = null, raf = 0;

  const active = () => S().tuto != null && S().tuto < STEPS_.length;
  function show(){
    const i = S().tuto; step = STEPS_[i]; root.hidden = false; document.body.classList.add('tutoring');
    box.querySelector('p').innerHTML = step.say;
    box.querySelector('.tnext').hidden = !step.tap;
    box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop');
    if (step.focus) focusPlot(step.focus);
    cancelAnimationFrame(raf); track();
  }
  // suit la cible (elle bouge avec la caméra et les animations) et place le trou, l'anneau et la main
  function track(){
    raf = requestAnimationFrame(track);
    if (step?.skipIf?.(S()) && !step.skipping){ step.skipping = true; setTimeout(next, 300); }
    const el = step?.target?.();
    // la cible peut être un élément HTML ou un rectangle à l'écran (objet dessiné dans le canvas)
    let r = el && (el.getBoundingClientRect ? el.getBoundingClientRect() : el);
    if (!r || !r.width){
      // pas de cible (dialogue) ou cible pas encore à l'écran : tout est bloqué, pas de main
      for (const b of [bt, br, bb, bl]) Object.assign(b.style, {left: '0px', top: '0px', width: '0px', height: '0px'});
      Object.assign(bt.style, {width: '100%', height: '100%'});
      ring.hidden = hand.hidden = true; return;
    }
    const pad = 8, x = r.left - pad, y = r.top - pad, w = r.width + pad * 2, h = r.height + pad * 2;
    Object.assign(bt.style, {left: '0px', top: '0px', width: '100%', height: Math.max(0, y) + 'px'});
    Object.assign(bb.style, {left: '0px', top: (y + h) + 'px', width: '100%', height: `calc(100% - ${y + h}px)`});
    Object.assign(bl.style, {left: '0px', top: y + 'px', width: Math.max(0, x) + 'px', height: h + 'px'});
    Object.assign(br.style, {left: (x + w) + 'px', top: y + 'px', width: `calc(100% - ${x + w}px)`, height: h + 'px'});
    ring.hidden = hand.hidden = false;
    Object.assign(ring.style, {left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px'});
    Object.assign(hand.style, {left: (r.left + r.width * .62) + 'px', top: (r.top + r.height * .62) + 'px'});
    // la bulle de dialogue se met en haut ou en bas pour ne pas cacher la cible
    const bh = box.offsetHeight || 110, bottomTop = innerHeight - 150 - bh, topBottom = 120 + bh;
    const overlapsBottom = r.bottom > bottomTop - 8, overlapsTop = r.top < topBottom + 8;
    box.classList.toggle('up', overlapsBottom && !overlapsTop);
    box.classList.toggle('low', overlapsBottom && overlapsTop);
  }
  function next(){
    S().tuto++; save(); sfx.tap();
    if (S().tuto >= STEPS_.length){ finish(); return; }
    show();
  }
  function finish(){ S().tuto = STEPS_.length; save(); root.hidden = true; document.body.classList.remove('tutoring'); cancelAnimationFrame(raf); step = null; }
  root.addEventListener('click', e => { if (step?.tap && (e.target.closest('.tbox') || e.target.classList.contains('tb'))){ if (step.end) { finish(); sfx.level(); } else next(); } });

  return {
    start(){ if (active()) show(); },
    active,
    // appelé par le jeu à chaque action : on avance si c'est l'action attendue
    event(name){ if (active() && step && step.wait === name) setTimeout(next, name === 'close' ? 50 : 350); },
    skip: finish,
  };
}
