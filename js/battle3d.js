// DÉFENSE DU VILLAGE, en 3D : tu incarnes Pépin, un petit lutin, devant la palissade du village.
// Joystick : on se déplace. Quand on s'arrête, Pépin lance tout seul des boules de neige sur le monstre le plus proche
// (comme Archero) : il faut donc bouger pour esquiver, et s'arrêter pour tirer.
// Monstres 3D animés (Quaternius, CC0) : trolls, petits yétis, grands yétis, chef troll, Krampus des Glaces.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const BASE = new URL('../assets/', import.meta.url).href;
const loader = new GLTFLoader();
const cache = {};
const load = f => cache[f] ||= new Promise((ok, ko) => loader.load(BASE + f, ok, undefined, ko));

// type : fichier, taille (m), points de vie, vitesse, dégâts sur la palissade, comportement
const FOES = {
  troll:   {f: 'battle/troll.glb',   h: 2.1, hp: 4,  sp: 1.4, dmg: 12, run: 'Walk'},
  runner:  {f: 'battle/runner.glb',  h: 1.1, hp: 2,  sp: 2.8, dmg: 6,  run: 'Walk', hit: 'HitRecieve'},
  thrower: {f: 'battle/troll.glb',   h: 1.8, hp: 3,  sp: .9,  dmg: 10, run: 'Walk', stop: 9, tint: 0x9a7a5a},
  yeti:    {f: 'battle/yeti.glb',    h: 2.7, hp: 10, sp: .7,  dmg: 35, run: 'Walk'},
  chief:   {f: 'battle/chief.glb',   h: 2.6, hp: 24, sp: .6,  dmg: 40, run: 'Walk', boss: 1},
  krampus: {f: 'battle/krampus.glb', h: 3.2, hp: 40, sp: 0,   dmg: 0,  run: 'Walk', boss: 1, stop: 12},
};
export function waveFor(c){
  const i = c.i, list = [], mix = [['troll', 10], ['runner', i >= 2 ? 6 : 0], ['thrower', i >= 3 ? 4 : 0], ['yeti', i >= 10 ? 2 : 0]], tot = mix.reduce((a, [, w]) => a + w, 0);
  for (let k = 0; k < c.n; k++){ let r = Math.random() * tot; for (const [t, w] of mix){ r -= w; if (r < 0){ list.push(t); break; } } }
  if (c.boss) list.push(c.ch >= 2 && c.ch % 2 === 0 ? 'krampus' : 'chief');
  return list;
}

export async function openBattle(ctx){
  const C = ctx.camp, root = document.createElement('div'); root.id = 'mg'; root.className = 'mg-b3';
  root.innerHTML = `<canvas></canvas>
    <div class="mg-hud"><div class="mg-pill"><small>Monstres</small><b class="b-left">0</b></div><div class="mg-pill wide"><small>Palissade</small><span class="d-hp gate"><i></i></span><small class="b-hearts"></small></div><button class="mg-quit" aria-label="Quitter"></button></div>
    <div class="b-hint">Garde le doigt sur l'écran et <b>vise</b> : Pépin tire en rafale !</div><div class="b-wave"></div><div class="b-count"><b>0</b><small>boules en l'air</small></div><div class="b-cards" hidden></div>
    <div class="d-pow b3"><button data-p="ava"><span class="pi">🌨</span><small>Avalanche</small><i></i></button><button data-p="gel"><span class="pi">❄</span><small>Grand Gel</small><i></i></button>${ctx.pet ? '<button data-p="pet"><span class="pi">🦌</span><small>Flocon</small><i></i></button>' : ''}</div>
    <div class="b-load">Les monstres arrivent…</div>
    <div class="mg-card" hidden><small>Campagne des Trolls</small><h2>${C.name}</h2><p>Pépin tient le canon à neige du haut de la tour. <b>Garde le doigt sur l'écran pour viser</b> : il tire en rafale. Fais passer tes boules dans les <b>portails ×2</b> pour les multiplier, et choisis un bonus entre chaque vague !${C.boss ? ' <b>Un chef les accompagne…</b>' : ''}</p><span class="mg-best">${C.n} monstres${C.boss ? ' + le chef' : ''}</span><button class="btn green mg-go">À l'attaque !</button></div>`;
  document.body.appendChild(root);
  const cv = root.querySelector('canvas');
  const R = new THREE.WebGLRenderer({canvas: cv, antialias: true, powerPreference: 'high-performance'});
  R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.25;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#6fb0ff'); scene.fog = new THREE.Fog('#a9c6ea', 30, 70);
  const cam = new THREE.PerspectiveCamera(46, 1, .1, 100); cam.position.set(0, 9.5, 12.8);
  const resize = () => { const w = innerWidth, h = innerHeight; R.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px'; cam.aspect = w / h; cam.fov = w / h < .6 ? 52 : 44; cam.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);

  // lumière d'hiver
  scene.add(new THREE.HemisphereLight('#eaf4ff', '#a8b8dd', 1.5));
  const sun = new THREE.DirectionalLight('#fff1d8', 2.0); sun.position.set(-8, 16, 10); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 50}); scene.add(sun);

  // terrain : champ de neige, chemin, sapins, palissade derrière le héros, montagnes au loin
  const mat = c => new THREE.MeshStandardMaterial({color: c, roughness: .9});
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 80, 30, 40), mat('#f1f5fb')); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  { const p = ground.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * .7) * Math.cos(p.getY(i) * .5) * .12); ground.geometry.computeVertexNormals(); }
  scene.add(ground);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(9, 40), mat('#c9d8ee')); path.rotation.x = -Math.PI / 2; path.position.set(0, .02, -14); path.receiveShadow = true; scene.add(path);
  const tree = (x, z, s) => { const g = new THREE.Group(); const tr = new THREE.Mesh(new THREE.CylinderGeometry(.12 * s, .16 * s, .6 * s, 6), mat('#6b4220')); tr.position.y = .3 * s; g.add(tr);
    for (let k = 0; k < 3; k++){ const c = new THREE.Mesh(new THREE.ConeGeometry((1 - k * .25) * s, 1.1 * s, 8), mat(k % 2 ? '#2f7a5a' : '#2a6e52')); c.position.y = (.9 + k * .55) * s; c.castShadow = true; g.add(c);
      const sn = new THREE.Mesh(new THREE.ConeGeometry((.62 - k * .16) * s, .42 * s, 8), mat('#ffffff')); sn.position.y = (1.27 + k * .55) * s; g.add(sn); }
    g.position.set(x, 0, z); scene.add(g); };
  for (let i = 0; i < 26; i++){ const side = i % 2 ? 1 : -1, z = -30 + (i >> 1) * 2.6; tree(side * (7.5 + (i * 37 % 5) * .6), z, .9 + (i * 13 % 7) * .08); }
  for (let i = 0; i < 6; i++){ const m = new THREE.Mesh(new THREE.ConeGeometry(6 + i % 3 * 2, 9 + i % 2 * 4, 5), mat('#c8d6ee')); m.position.set(-22 + i * 9, 3, -44); scene.add(m);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(2.6, 3.6, 5), mat('#ffffff')); cap.position.set(m.position.x, m.position.y + (m.geometry.parameters.height / 2) - 1.6, -44); scene.add(cap); }
  // palissade du village (ce qu'on défend)
  const GATE_Z = 5.2, gate = new THREE.Group();
  for (let x = -6; x <= 6; x += .7){ const p = new THREE.Mesh(new THREE.CylinderGeometry(.16, .18, 1.7, 6), mat('#8a5a30')); p.position.set(x, .85, GATE_Z); p.castShadow = true; gate.add(p);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.18, .35, 6), mat('#6b4220')); tip.position.set(x, 1.87, GATE_Z); gate.add(tip); const sn = new THREE.Mesh(new THREE.SphereGeometry(.17, 8, 6), mat('#fff')); sn.scale.y = .45; sn.position.set(x, 1.72, GATE_Z); gate.add(sn); }
  for (const y of [.55, 1.25]){ const b = new THREE.Mesh(new THREE.BoxGeometry(12.6, .14, .12), mat('#6b4220')); b.position.set(0, y, GATE_Z - .2); gate.add(b); }
  scene.add(gate);
  for (let z = -16; z <= 2; z += 6) for (const x of [-4.8, 4.8]){ const post = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 1.6, 6), mat('#3a2a1e')); post.position.set(x, .8, z); scene.add(post);
    const l = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 8), new THREE.MeshStandardMaterial({color: '#ffd27a', emissive: '#ffb84a', emissiveIntensity: 1.6})); l.position.set(x, 1.68, z); scene.add(l);
    const cane = new THREE.Mesh(new THREE.TorusGeometry(.18, .05, 6, 12, Math.PI), mat('#e8303a')); cane.position.set(x + (x > 0 ? .5 : -.5), .9, z + 3); scene.add(cane);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .9, 6), mat('#f4f4f4')); st.position.set(x + (x > 0 ? .32 : -.32), .45, z + 3); scene.add(st); }

  // flocons
  const SN = 500, sg = new THREE.BufferGeometry(), sp = new Float32Array(SN * 3); for (let i = 0; i < SN; i++){ sp[i * 3] = (Math.random() - .5) * 30; sp[i * 3 + 1] = Math.random() * 14; sp[i * 3 + 2] = -30 + Math.random() * 40; }
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); const snow = new THREE.Points(sg, new THREE.PointsMaterial({color: '#fff', size: .09, transparent: true, opacity: .85})); scene.add(snow);

  // chargement des modèles
  const queue = waveFor(C), kinds = [...new Set(queue)];
  let heroG, heroA = [], models = {};
  try {
    const [h, a1, a2, ...ms] = await Promise.all([load('elf.glb'), load('battle/hero-anims-a.glb'), load('battle/hero-anims-b.glb'), ...kinds.map(k => load(FOES[k].f))]);
    heroG = h; heroA = [...a1.animations, ...a2.animations]; kinds.forEach((k, i) => models[k] = ms[i]);
  } catch(e){ root.querySelector('.b-load').textContent = 'Impossible de charger les monstres. Vérifie ta connexion.'; console.error(e); return; }
  root.querySelector('.b-load').remove(); root.querySelector('.mg-card').hidden = false;

  const fit = (obj, h) => { const box = new THREE.Box3().setFromObject(obj), s = h / Math.max(.01, box.max.y - box.min.y); obj.scale.setScalar(s); return s; };
  const shadowOn = o => o.traverse(m => { if (m.isMesh){ m.castShadow = true; m.frustumCulled = false; } });

  // le héros : Pépin
  const hero = SkeletonUtils.clone(heroG.scene); fit(hero, 1.35); shadowOn(hero); scene.add(hero); let cannon = null; hero.position.set(0, 1.6, GATE_Z + .5);
  { const tw = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 1.6, 10), mat('#7a5232')); tw.position.set(0, .8, GATE_Z + .5); tw.castShadow = true; scene.add(tw);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, .18, 10), mat('#f4f7fc')); top.position.set(0, 1.62, GATE_Z + .5); scene.add(top);
    const can = new THREE.Mesh(new THREE.CylinderGeometry(.22, .3, 1.1, 12), new THREE.MeshStandardMaterial({color: '#c0283c', roughness: .4, metalness: .3})); can.rotation.x = Math.PI / 2.6; can.position.set(.5, 2.15, GATE_Z + .7); scene.add(can); cannon = can; }
  const hm = new THREE.AnimationMixer(hero), clip = n => heroA.find(a => a.name === n);
  const act = {}; for (const n of ['Idle_A', 'Running_A', 'Throw', 'Hit_A', 'Death_A', 'Interact']) if (clip(n)) act[n] = hm.clipAction(clip(n));
  let heroAnim = null; const play = (n, once) => { const a = act[n]; if (!a || heroAnim === a && !once) return; if (once){ a.reset().setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; } a.reset().fadeIn(.12).play(); heroAnim?.fadeOut(.12); heroAnim = a; };
  play('Idle_A');
  // anneau de visée sous les pieds
  const ring = new THREE.Mesh(new THREE.RingGeometry(.5, .62, 32), new THREE.MeshBasicMaterial({color: '#3fb6ff', transparent: true, opacity: .7})); ring.rotation.x = -Math.PI / 2; ring.position.y = .03; scene.add(ring);

  // monstres
  const total = queue.length, foes = [], balls = [], shots = [], puffs = [];
  let gained = 0, cntEl = null, cntShown = -1, killed = 0, spawnT = 1.2, gateHp = 100, hearts = 3 + (ctx.extraHearts || 0), heartsMax = hearts, invul = 0, cd = 0, combo = 0, freeze = 0, state = 'intro', last = performance.now(), raf = 0, shake = 0;
  const charge = {ava: 0, gel: 0, pet: 0}, NEED = {ava: 18, gel: 12, pet: 14};
  // tir façon jeux d'arcade : rafale tant qu'on vise, portails multiplicateurs, bonus entre les vagues
  const up = {multi: 1, dmg: 1, rate: .34, splash: 1.1, gates: 1};
  const waves = []; { const q = queue.slice(), n = Math.max(1, Math.min(3, Math.ceil(q.length / 6))), per = Math.ceil((q.length - (C.boss ? 1 : 0)) / n);
    for (let w = 0; w < n; w++) waves.push(q.splice(0, w === n - 1 ? q.length : per)); }
  let wave = 0; queue.length = 0; queue.push(...waves[0]);
  const aim = new THREE.Vector3(0, 0, -6); let aiming = false;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), groundP = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const dots = []; for (let i = 0; i < 14; i++){ const d = new THREE.Mesh(new THREE.SphereGeometry(.07, 6, 5), new THREE.MeshBasicMaterial({color: '#ffffff', transparent: true, opacity: .85})); d.visible = false; scene.add(d); dots.push(d); }
  const reticle = new THREE.Mesh(new THREE.RingGeometry(.5, .7, 28), new THREE.MeshBasicMaterial({color: '#ffd23a', transparent: true, opacity: .9})); reticle.rotation.x = -Math.PI / 2; ring.visible = false; reticle.position.y = .05; reticle.visible = false; scene.add(reticle);
  const gates = [];
  function addGate(mult){ if (gates.length >= 4) return; const g = new THREE.Group(), w = 2.4, c = mult >= 10 ? '#ffd23a' : mult >= 5 ? '#b06aff' : mult >= 3 ? '#ff9a2a' : '#3fb6ff';
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.6), new THREE.MeshBasicMaterial({color: c, transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false})); panel.position.y = 1.6; g.add(panel);
    for (const sx of [-w / 2, w / 2]){ const post = new THREE.Mesh(new THREE.BoxGeometry(.14, 2.6, .14), new THREE.MeshStandardMaterial({color: c, emissive: c, emissiveIntensity: .5})); post.position.set(sx, 1.3, 0); g.add(post); }
    const cvs = document.createElement('canvas'); cvs.width = 256; cvs.height = 128; const x = cvs.getContext('2d'); x.font = 'bold 96px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 12; x.strokeStyle = '#141a33'; x.strokeText('×' + mult, 128, 68); x.fillStyle = '#fff'; x.fillText('×' + mult, 128, 68);
    const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(cvs), transparent: true, side: THREE.DoubleSide})); lab.position.set(0, 1.6, .05); lab.scale.setScalar(1.4); lab.renderOrder = 5; lab.material.depthTest = false; g.add(lab);
    g.position.set(0, 0, -3 - gates.length * 2.5); g.userData = {mult, w, ph: Math.random() * 6, sp: .5 + Math.random() * .4}; scene.add(g); gates.push(g); }
  addGate(2); addGate(3);
  const CARDS = [
    ['multi', '🎯', 'Tir double', 'Une boule de plus à chaque tir', () => up.multi++],
    ['dmg', '💥', 'Boules de glace', '+1 dégât par boule', () => up.dmg++],
    ['rate', '⚡', 'Canon rapide', 'Tire 25 % plus vite', () => up.rate *= .75],
    ['splash', '❄', 'Grosse explosion', 'Zone de dégâts plus grande', () => up.splash *= 1.4],
    ['gate', '✨', 'Portail ×5', 'Un portail multiplicateur en plus', () => addGate(5)],
    ['gatebig', '🌟', 'Portail ×10', 'Le plus gros portail : une avalanche de boules !', () => addGate(10)],
    ['heal', '🪵', 'Réparer', '+35 à la palissade', () => gateHp = Math.min(100, gateHp + 35)],
  ];
  function showCards(){
    state = 'pick'; aiming = false; const box = root.querySelector('.b-cards'), pick = CARDS.filter(c => !(c[0].startsWith('gate') && gates.length >= 4) && !(c[0] === 'gatebig' && wave < 1)).sort(() => Math.random() - .5).slice(0, 3);
    box.innerHTML = `<h3>Vague ${wave} repoussée !</h3><p>Choisis un bonus</p><div class="cards">${pick.map(([k, ic, t, d]) => `<button data-c="${k}"><span>${ic}</span><b>${t}</b><small>${d}</small></button>`).join('')}</div>`;
    box.hidden = false; ctx.sfx.level();
    box.onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; CARDS.find(c => c[0] === b.dataset.c)[4](); box.hidden = true; say(b.querySelector('b').textContent + ' !', '#ffd84a');
      queue.push(...waves[wave]); state = 'play'; spawnT = 1; root.querySelector('.b-wave').textContent = `Vague ${wave + 1} / ${waves.length}`; };
  }
  const scaleUp = 1 + Math.floor(C.i / 10) * .3;
  function spawn(){
    const kind = queue.shift(), D = FOES[kind], src = models[kind], o = SkeletonUtils.clone(src.scene); fit(o, D.h); shadowOn(o);
    if (D.tint) o.traverse(m => { if (m.isMesh){ m.material = m.material.clone(); m.material.color = new THREE.Color(D.tint); } });
    const x = D.boss ? 0 : (Math.random() - .5) * 8, z = -17; o.position.set(x, 0, z); scene.add(o);
    const mx = new THREE.AnimationMixer(o), A = n => src.animations.find(a => a.name === n), f = {kind, D, o, mx, hp: Math.round(D.hp * (D.boss ? 1 + C.ch * .35 : scaleUp)), t: Math.random() * 4, atkT: 2 + Math.random() * 2, tele: 0, hitT: 0};
    f.max = f.hp; f.walk = A(D.run) && mx.clipAction(A(D.run)); f.walk?.play(); f.idle = A('Idle') && mx.clipAction(A('Idle'));
    f.hitA = A(D.hit || 'HitReact'); f.punch = A('Punch') || A('Bite_Front') || A('Weapon'); f.death = A('Death');
    // barre de vie au-dessus
    const bar = new THREE.Group(), bg = new THREE.Mesh(new THREE.PlaneGeometry(1, .12), new THREE.MeshBasicMaterial({color: '#141a33', depthTest: false})), fg = new THREE.Mesh(new THREE.PlaneGeometry(.96, .08), new THREE.MeshBasicMaterial({color: D.boss ? '#ffb020' : '#ff4a5a', depthTest: false}));
    fg.position.z = .001; bar.add(bg, fg); bar.renderOrder = 10; bar.visible = f.max > 1; scene.add(bar); f.bar = bar; f.fg = fg;
    foes.push(f);
    if (D.boss){ say(kind === 'krampus' ? 'Le Krampus des Glaces !' : 'Le chef des trolls !', '#ffd84a'); shake = .6; ctx.sfx.err(); }
  }
  function oneShot(f, a){ if (!a) return; const x = f.mx.clipAction(a); x.reset().setLoop(THREE.LoopOnce, 1).fadeIn(.06).play(); }
  function hurt(f, dmg){
    f.hp -= dmg; f.hitT = .18; oneShot(f, f.hitA);
    if (f.kind === 'krampus' && f.hp > 0 && Math.random() < .3) f.tele = .5;
    if (f.hp <= 0){ killed++; addCharge(2); ctx.sfx.collect(); puff(f.o.position, f.D.boss ? 2.4 : 1.2, '#ffffff', 18);
      if (f.death){ f.walk?.stop(); const d = f.mx.clipAction(f.death); d.reset().setLoop(THREE.LoopOnce, 1); d.clampWhenFinished = true; d.play(); }
      f.dead = 1.1; f.bar.visible = false; }
  }
  function puff(p, s, c, n = 10){ for (let i = 0; i < n; i++){ const m = new THREE.Mesh(new THREE.SphereGeometry(.12 * s, 6, 5), new THREE.MeshBasicMaterial({color: c, transparent: true})); m.position.copy(p).add(new THREE.Vector3(0, .8 * s, 0)); m.userData.v = new THREE.Vector3((Math.random() - .5) * 4, Math.random() * 4, (Math.random() - .5) * 4).multiplyScalar(s * .7); m.userData.t = 0; scene.add(m); puffs.push(m); } }
  function shoot(from, to, t0, through){ const b = new THREE.Mesh(ballGeo, ballMat); b.castShadow = true; b.position.copy(from);
    b.userData = {from: from.clone(), to, t: t0 ? 0 : 0, h: 1.4 + from.distanceTo(to) * .14, through: new Set(through || [])}; if (t0){ b.userData.from = from.clone(); b.userData.h *= (1 - t0); } scene.add(b); balls.push(b); if (balls.length > 120) { scene.remove(balls[0]); balls.shift(); } }
  const ballGeo = new THREE.SphereGeometry(.16, 10, 8), ballMat = new THREE.MeshStandardMaterial({color: '#ffffff', roughness: .5, emissive: '#cfe8ff', emissiveIntensity: .25});
  const addCharge = n => { for (const k in charge) charge[k] = Math.min(NEED[k], charge[k] + n); };
  const floats = []; function say(txt, col = '#fff', at){ const d = document.createElement('div'); d.className = 'b-float'; d.textContent = txt; d.style.color = col; root.appendChild(d); floats.push({d, t: 0, at: at?.clone()}); }

  // contrôles : on garde le doigt sur l'écran, le canon vise l'endroit touché (sur le sol) et tire en rafale
  const setAim = e => { ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam); const p = new THREE.Vector3();
    if (ray.ray.intersectPlane(groundP, p)){ aim.set(THREE.MathUtils.clamp(p.x, -6, 6), 0, THREE.MathUtils.clamp(p.z, -17, GATE_Z - 1)); } };
  let sid = null;
  cv.addEventListener('pointerdown', e => { if (state !== 'play') return; sid = e.pointerId; cv.setPointerCapture(sid); aiming = true; setAim(e); root.querySelector('.b-hint')?.remove(); });
  cv.addEventListener('pointermove', e => { if (e.pointerId === sid) setAim(e); });
  const up0 = e => { if (e.pointerId !== sid) return; sid = null; aiming = false; };
  cv.addEventListener('pointerup', up0); cv.addEventListener('pointercancel', up0);
  root.querySelector('.d-pow').addEventListener('pointerdown', e => { const b = e.target.closest('[data-p]'); if (!b) return; e.stopPropagation(); power(b.dataset.p); });
  function power(k){
    if (state !== 'play' || charge[k] < NEED[k]) return; charge[k] = 0; ctx.sfx.level();
    if (k === 'ava'){ shake = .8; say('AVALANCHE !', '#ffffff'); for (const f of foes) if (!f.dead){ hurt(f, 4); puff(f.o.position, 1, '#e8f4ff', 6); } }
    if (k === 'gel'){ freeze = 3.5; say('GRAND GEL !', '#bfe6ff'); for (const f of foes) f.o.traverse(m => { if (m.isMesh && m.material.emissive){ m.material = m.material.clone(); m.material.emissive = new THREE.Color('#3a8ee0'); m.material.emissiveIntensity = .5; f.iced = 1; } }); }
    if (k === 'pet'){ say('Flocon charge !', '#ffd84a'); for (const f of foes) if (!f.dead && Math.abs(f.o.position.x - hero.position.x) < 2.2){ hurt(f, 8); puff(f.o.position, 1.2, '#fff6c0', 10); } }
  }

  const tmp = new THREE.Vector3();
  function update(dt){
    hm.update(dt); for (const f of foes) f.mx.update(freeze && !f.dead ? 0 : dt);
    // flocons
    const p = sg.attributes.position; for (let i = 0; i < SN; i++){ let y = p.getY(i) - dt * 1.2; if (y < 0) y = 14; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(y + i) * dt * .2); } p.needsUpdate = true;
    if (state !== 'play') return;
    freeze = Math.max(0, freeze - dt); invul = Math.max(0, invul - dt); shake = Math.max(0, shake - dt);
    if (!freeze) for (const f of foes) if (f.iced){ f.iced = 0; f.o.traverse(m => { if (m.isMesh && m.material.emissive) m.material.emissiveIntensity = 0; }); }
    // visée : trajectoire en pointillés + cible au sol
    const from = new THREE.Vector3(hero.position.x + .5, 2.2, hero.position.z - .5);
    hero.rotation.y = Math.atan2(aim.x - hero.position.x, aim.z - hero.position.z);
    if (cannon){ cannon.rotation.y = Math.atan2(aim.x - cannon.position.x, aim.z - cannon.position.z) + Math.PI; }
    reticle.visible = aiming; reticle.position.x = aim.x; reticle.position.z = aim.z; reticle.scale.setScalar(up.splash);
    const H = 2 + from.distanceTo(aim) * .18;
    dots.forEach((d, i) => { const t = (i + 1) / (dots.length + 1); d.visible = aiming; d.position.lerpVectors(from, aim, t); d.position.y += Math.sin(t * Math.PI) * H; });
    cd -= dt;
    if (aiming && cd <= 0){ cd = up.rate; play('Throw', true); setTimeout(() => { if (heroAnim === act.Throw) play('Idle_A'); }, 300);
      for (let k = 0; k < up.multi; k++){ const off = (k - (up.multi - 1) / 2) * .9; shoot(from, aim.clone().add(new THREE.Vector3(off, 0, Math.abs(off) * .3)), 0); }
      ctx.sfx.tap(); }
    // boules : arc vers la cible, passage dans les portails = multiplication, explosion à l'arrivée
    gained = 0;
    for (const b of [...balls]){ const u = b.userData; u.t += dt * 1.6; const t = Math.min(1, u.t), prev = b.position.clone();
      b.position.lerpVectors(u.from, u.to, t); b.position.y += Math.sin(t * Math.PI) * u.h;
      for (const g of gates){ if (u.through.has(g)) continue; const gz = g.position.z; if ((prev.z - gz) * (b.position.z - gz) <= 0 && Math.abs(b.position.x - g.position.x) < g.userData.w / 2 && b.position.y < 3){
        u.through.add(g); g.userData.flash = .15; gained += g.userData.mult - 1; if (balls.length > 240){ u.pow = (u.pow || 1) * g.userData.mult; continue; } for (let k = 1; k < g.userData.mult; k++){ const off = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * .8; shoot(b.position.clone(), u.to.clone().add(new THREE.Vector3(off, 0, -.3 * k)), t, u.through); } } }
      if (u.t >= 1){ scene.remove(b); balls.splice(balls.indexOf(b), 1); puff(u.to, .55 * up.splash, '#ffffff', 5);
        let hit = false; for (const f of foes){ if (f.dead) continue; if (Math.hypot(f.o.position.x - u.to.x, f.o.position.z - u.to.z) < .9 * up.splash + f.D.h * .2){ hurt(f, up.dmg * (u.pow || 1)); hit = true; } }
        // une boule peut aussi détruire un tir ennemi
        for (const sh of shots){ if (sh.position.distanceTo(b.position) < 1.2){ sh.userData.t = 9; sh.userData.parried = 1; } }
        if (hit){ combo++; addCharge(1); if (combo % 15 === 0) say(`Combo ×${combo} !`, '#ffd84a'); } } }
    cntEl ||= root.querySelector('.b-count'); if (cntEl && cntShown !== balls.length){ cntShown = balls.length; cntEl.querySelector('b').textContent = balls.length; cntEl.classList.toggle('on', balls.length > 0); if (gained){ cntEl.classList.remove('pop'); void cntEl.offsetWidth; cntEl.classList.add('pop'); } }
    for (const g of gates){ g.userData.ph += dt * g.userData.sp; g.position.x = Math.sin(g.userData.ph) * 3.6; if (g.userData.flash > 0){ g.userData.flash -= dt; g.children[0].material.opacity = .8; } else g.children[0].material.opacity = .35; }
    // apparition
    spawnT -= dt; if (queue.length && spawnT <= 0 && (!FOES[queue[0]].boss || foes.filter(f => !f.dead).length < 3)){ spawn(); spawnT = Math.max(.6, 1.8 - C.i * .03) * (.7 + Math.random() * .6); }
    // monstres
    for (const f of [...foes]){
      const o = f.o, D = f.D; f.hitT = Math.max(0, f.hitT - dt);
      if (f.dead){ f.dead -= dt; o.position.y -= dt * .3; if (f.dead <= 0){ scene.remove(o); scene.remove(f.bar); foes.splice(foes.indexOf(f), 1); } continue; }
      f.bar.position.set(o.position.x, D.h + .35, o.position.z); f.bar.quaternion.copy(cam.quaternion); f.fg.scale.x = Math.max(.001, f.hp / f.max); f.fg.position.x = -(1 - f.hp / f.max) * .48;
      if (freeze) continue;
      if (f.tele > 0){ f.tele -= dt; o.visible = Math.sin(f.tele * 40) > 0; if (f.tele <= 0){ o.visible = true; o.position.x = (Math.random() - .5) * 8; puff(o.position, 1.5, '#a070ff', 10); } continue; }
      if (D.stop && o.position.z >= -D.stop){
        // lanceur / Krampus : s'arrête et tire sur Pépin
        f.walk?.stop(); if (f.idle && !f.idle.isRunning()) f.idle.play();
        o.rotation.y = 0;
        f.atkT -= dt; if (f.atkT <= 0){ f.atkT = f.kind === 'krampus' ? Math.max(1.1, 2.4 - C.ch * .12) : 2.8; oneShot(f, f.punch);
          const n = f.kind === 'krampus' ? 3 : 1; for (let k = 0; k < n; k++){ const aim = new THREE.Vector3(o.position.x + (k - (n - 1) / 2) * 1.6, 0, GATE_Z - .2);
            const s = new THREE.Mesh(f.kind === 'krampus' ? new THREE.OctahedronGeometry(.28) : new THREE.SphereGeometry(.2, 8, 6), new THREE.MeshStandardMaterial({color: f.kind === 'krampus' ? '#8fdcff' : '#f2f2f2', emissive: f.kind === 'krampus' ? '#2a8ee0' : '#000', emissiveIntensity: .6}));
            s.position.copy(o.position).add(new THREE.Vector3(0, D.h * .7, 0)); s.userData = {from: s.position.clone(), to: aim, t: 0, d: f.kind === 'krampus' ? 1.1 : 1.3};
            const mark = new THREE.Mesh(new THREE.RingGeometry(.35, .5, 24), new THREE.MeshBasicMaterial({color: '#ff3b3b', transparent: true, opacity: .8})); mark.rotation.x = -Math.PI / 2; mark.position.set(aim.x, .04, aim.z); scene.add(mark); s.userData.mark = mark;
            scene.add(s); shots.push(s); } }
        continue;
      }
      // marche vers la palissade
      f.t += dt; const sp = D.sp * (1 + C.i * .015); o.position.z += sp * dt; o.position.x += Math.sin(f.t * 1.3) * .2 * dt; o.rotation.y = 0;
      // contact avec le héros : il le repousse et le blesse
      if (o.position.z >= GATE_Z - .6){ gateHp -= D.dmg; shake = .5; say('-' + D.dmg + ' palissade', '#ff8a9a'); ctx.sfx.err(); puff(o.position, 1, '#c9a07a', 8); f.dead = .01; f.bar.visible = false; scene.remove(o); killed++;
        if (gateHp <= 0){ gateHp = 0; finish(false); } }
    }
    // tirs ennemis
    for (const s of [...shots]){ const u = s.userData; u.t += dt / u.d; s.position.lerpVectors(u.from, u.to, Math.min(1, u.t)); s.position.y += Math.sin(Math.min(1, u.t) * Math.PI) * 2.2; s.rotation.x += dt * 8;
      u.mark.material.opacity = .4 + .5 * Math.sin(u.t * 20);
      if (u.t >= 1){ scene.remove(s); scene.remove(u.mark); shots.splice(shots.indexOf(s), 1); puff(s.position.clone().setY(0), .6, '#dff3ff', 6);
        if (!u.parried){ const d = f0dmg(s); gateHp -= d; shake = .3; say('-' + d + ' palissade', '#ff8a9a'); ctx.sfx.err(); if (gateHp <= 0){ gateHp = 0; finish(false); } } else say('Paré !', '#bfe6ff'); } }
    for (const m of [...puffs]){ m.userData.t += dt; m.position.addScaledVector(m.userData.v, dt); m.userData.v.y -= 9 * dt; m.material.opacity = 1 - m.userData.t / .7; if (m.userData.t > .7){ scene.remove(m); puffs.splice(puffs.indexOf(m), 1); } }
    if (!queue.length && !foes.length && state === 'play' && wave < waves.length - 1){ wave++; showCards(); return; }
    if (!queue.length && !foes.length && state === 'play'){ state = 'won'; play('Interact', true); setTimeout(() => finish(true), 900); }
  }
  const f0dmg = s => s.geometry.type === 'OctahedronGeometry' ? 12 : 7;
  function heroHit(){ hearts--; invul = 1.4; combo = 0; shake = .5; ctx.sfx.err(); play('Hit_A', true); setTimeout(() => play('Idle_A'), 500); say('Aïe !', '#ff8a9a');
    if (hearts <= 0){ play('Death_A', true); finish(false); } }

  function finish(win){
    if (state === 'end') return; state = 'end';
    const pct = gateHp / 100, stars = !win ? 0 : pct > .66 ? 3 : pct > .33 ? 2 : 1;
    const res = ctx.result({win, hearts: stars, score: killed}), card = root.querySelector('.mg-card');
    card.innerHTML = `<small>${C.name}</small><h2>${win ? 'Village sauvé !' : 'La palissade a cédé…'}</h2>${win ? `<div class="mg-stars">${[1, 2, 3].map(k => `<i class="${k <= stars ? 'on' : ''}">★</i>`).join('')}</div>` : `<p>${killed} / ${total} monstres repoussés. Améliore ton village et Flocon, puis reviens !</p>`}
      <div class="costs mg-rw">${ctx.chipsHtml(res.rw)}</div><button class="btn green mg-claim">${win ? 'Récupérer' : 'Retour'}</button>`;
    card.hidden = false; card.querySelector('.mg-claim').onclick = e => { ctx.grant(res.rw, e.currentTarget); ctx.sfx.level(); setTimeout(close, 400); };
  }
  function close(){ cancelAnimationFrame(raf); removeEventListener('resize', resize); R.dispose(); root.remove(); ctx.onClose?.(); }
  let quitArmed = 0;
  root.querySelector('.mg-quit').onclick = () => { if (state === 'play' && performance.now() - quitArmed > 2500){ quitArmed = performance.now(); say('Touche encore pour fuir', '#ffd84a'); return; } close(); };
  root.querySelector('.mg-go').onclick = () => { root.querySelector('.mg-card').hidden = true; state = 'play'; root.querySelector('.b-wave').textContent = `Vague 1 / ${waves.length}`; ctx.sfx.tap(); setTimeout(() => root.querySelector('.b-hint')?.remove(), 4500); };

  const camT = new THREE.Vector3();
  function render(){
    // caméra derrière et au-dessus de Pépin, qui le suit en douceur
    camT.set(0, 9.5, GATE_Z + 7.6); cam.position.lerp(camT, .1);
    if (shake) cam.position.add(new THREE.Vector3((Math.random() - .5) * shake * .4, (Math.random() - .5) * shake * .3, 0));
    cam.lookAt(0, 0, -5.5);
    R.render(scene, cam);
    // textes flottants
    for (const f of [...floats]){ f.t += .016; f.d.style.opacity = Math.max(0, 1 - f.t); f.d.style.transform = `translate(-50%, ${-f.t * 50}px)`; if (f.t > 1.1){ f.d.remove(); floats.splice(floats.indexOf(f), 1); } }
    root.querySelector('.b-left').textContent = `${killed}/${total}`;
    root.querySelector('.gate i').style.width = gateHp + '%'; root.querySelector('.gate').classList.toggle('low', gateHp < 34);
    root.querySelector('.b-hearts').textContent = '';
    for (const b of root.querySelectorAll('[data-p]')){ const k = b.dataset.p, r = charge[k] / NEED[k]; b.querySelector('i').style.height = (r * 100) + '%'; b.classList.toggle('ready', r >= 1); }
  }
  function loop(now){ raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; update(dt); render(); }
  raf = requestAnimationFrame(loop);
  window.__b3 = {screen: v => { const p = v.clone().project(cam); return {x: (p.x + 1) / 2 * innerWidth, y: (1 - p.y) / 2 * innerHeight}; }, get balls(){ return balls.length; }, get killed(){ return killed; }, get aim(){ return aim.toArray().map(v => +v.toFixed(1)); }, get state(){ return state; }, get hero(){ return hero; }, get foes(){ return foes; }, power};
}

/** Portrait 3D d'un monstre (pour les cinématiques et le bestiaire) : rendu une fois, gardé en mémoire. */
const PORT = {};
export function portrait3d(kind, size = 256){
  return PORT[kind] ||= (async () => {
    const D = FOES[kind]; if (!D) return null;
    const g = await load(D.f), o = SkeletonUtils.clone(g.scene), r = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
    r.setSize(size, size, false); r.outputColorSpace = THREE.SRGBColorSpace;
    const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight('#ffffff', '#8090b0', 1.6)); const l = new THREE.DirectionalLight('#ffffff', 2.2); l.position.set(2, 4, 5); sc.add(l);
    const box = new THREE.Box3().setFromObject(o), h = box.max.y - box.min.y; o.scale.setScalar(2 / h); sc.add(o);
    const mx = new THREE.AnimationMixer(o), id = g.animations.find(a => a.name === 'Idle'); if (id){ mx.clipAction(id).play(); mx.update(.4); }
    const cam = new THREE.PerspectiveCamera(30, 1, .1, 50); cam.position.set(.6, 1.55, 3.4); cam.lookAt(0, 1.25, 0);
    r.render(sc, cam); const url = r.domElement.toDataURL('image/png'); r.dispose(); return url;
  })().catch(() => null);
}
