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
    <div class="b-stick"><i></i></div><div class="b-hint">Déplace Pépin · <b>arrête-toi pour lancer</b></div>
    <div class="d-pow b3"><button data-p="ava"><span class="pi">🌨</span><small>Avalanche</small><i></i></button><button data-p="gel"><span class="pi">❄</span><small>Grand Gel</small><i></i></button>${ctx.pet ? '<button data-p="pet"><span class="pi">🦌</span><small>Flocon</small><i></i></button>' : ''}</div>
    <div class="b-load">Les monstres arrivent…</div>
    <div class="mg-card" hidden><small>Campagne des Trolls</small><h2>${C.name}</h2><p>Tu es <b>Pépin</b>, le lutin gardien. Déplace-toi avec ton pouce : quand tu t'arrêtes, tu lances des boules de neige sur le monstre le plus proche. Esquive leurs tirs, protège la palissade !${C.boss ? ' <b>Un chef les accompagne…</b>' : ''}</p><span class="mg-best">${C.n} monstres${C.boss ? ' + le chef' : ''}</span><button class="btn green mg-go">À l'attaque !</button></div>`;
  document.body.appendChild(root);
  const cv = root.querySelector('canvas');
  const R = new THREE.WebGLRenderer({canvas: cv, antialias: true, powerPreference: 'high-performance'});
  R.setPixelRatio(Math.min(2, devicePixelRatio || 1)); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#7fa9e0'); scene.fog = new THREE.Fog('#a9c6ea', 30, 70);
  const cam = new THREE.PerspectiveCamera(46, 1, .1, 100); cam.position.set(0, 4.6, 8.4);
  const resize = () => { const w = innerWidth, h = innerHeight; R.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px'; cam.aspect = w / h; cam.fov = w / h < .6 ? 52 : 44; cam.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);

  // lumière d'hiver
  scene.add(new THREE.HemisphereLight('#d8ecff', '#7d8db5', 1.0));
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
  const hero = SkeletonUtils.clone(heroG.scene); fit(hero, 1.35); shadowOn(hero); scene.add(hero); hero.position.set(0, 0, 2.2);
  const hm = new THREE.AnimationMixer(hero), clip = n => heroA.find(a => a.name === n);
  const act = {}; for (const n of ['Idle_A', 'Running_A', 'Throw', 'Hit_A', 'Death_A', 'Interact']) if (clip(n)) act[n] = hm.clipAction(clip(n));
  let heroAnim = null; const play = (n, once) => { const a = act[n]; if (!a || heroAnim === a && !once) return; if (once){ a.reset().setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; } a.reset().fadeIn(.12).play(); heroAnim?.fadeOut(.12); heroAnim = a; };
  play('Idle_A');
  // anneau de visée sous les pieds
  const ring = new THREE.Mesh(new THREE.RingGeometry(.5, .62, 32), new THREE.MeshBasicMaterial({color: '#3fb6ff', transparent: true, opacity: .7})); ring.rotation.x = -Math.PI / 2; ring.position.y = .03; scene.add(ring);

  // monstres
  const total = queue.length, foes = [], balls = [], shots = [], puffs = [];
  let killed = 0, spawnT = 1.2, gateHp = 100, hearts = 3 + (ctx.extraHearts || 0), heartsMax = hearts, invul = 0, cd = 0, combo = 0, freeze = 0, state = 'intro', last = performance.now(), raf = 0, shake = 0;
  const charge = {ava: 0, gel: 0, pet: 0}, NEED = {ava: 14, gel: 9, pet: 11};
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
  const addCharge = n => { for (const k in charge) charge[k] = Math.min(NEED[k], charge[k] + n); };
  const floats = []; function say(txt, col = '#fff', at){ const d = document.createElement('div'); d.className = 'b-float'; d.textContent = txt; d.style.color = col; root.appendChild(d); floats.push({d, t: 0, at: at?.clone()}); }

  // contrôles : joystick sous le pouce, n'importe où dans la moitié basse
  const stick = root.querySelector('.b-stick'), knob = stick.querySelector('i'); let sx = 0, sy = 0, dx = 0, dy = 0, sid = null;
  cv.addEventListener('pointerdown', e => { if (state !== 'play') return; sid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0; stick.style.left = sx + 'px'; stick.style.top = sy + 'px'; stick.classList.add('on'); cv.setPointerCapture(sid); root.querySelector('.b-hint')?.remove(); });
  cv.addEventListener('pointermove', e => { if (e.pointerId !== sid) return; dx = e.clientX - sx; dy = e.clientY - sy; const l = Math.hypot(dx, dy), m = 46; if (l > m){ dx *= m / l; dy *= m / l; } knob.style.transform = `translate(${dx}px,${dy}px)`; });
  const up = e => { if (e.pointerId !== sid) return; sid = null; dx = dy = 0; knob.style.transform = ''; stick.classList.remove('on'); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
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
    // déplacement du héros
    const moving = Math.hypot(dx, dy) > 8;
    if (moving){ const sp = 6.2 * Math.min(1, Math.hypot(dx, dy) / 46); hero.position.x = THREE.MathUtils.clamp(hero.position.x + dx / 46 * sp * dt, -6, 6); hero.position.z = THREE.MathUtils.clamp(hero.position.z + dy / 46 * sp * dt, -7, 3.4);
      hero.rotation.y = Math.atan2(dx, dy); play('Running_A'); }
    // tir automatique à l'arrêt, sur le monstre vivant le plus proche
    cd -= dt;
    const alive = foes.filter(f => !f.dead && f.o.position.z > -16);
    if (!moving && alive.length){
      const tgt = alive.reduce((a, f) => f.o.position.distanceTo(hero.position) < a.o.position.distanceTo(hero.position) ? f : a);
      hero.rotation.y = Math.atan2(tgt.o.position.x - hero.position.x, tgt.o.position.z - hero.position.z);
      if (cd <= 0){ cd = .5; play('Throw', true); setTimeout(() => { if (heroAnim === act.Throw) play('Idle_A'); }, 420);
        const b = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 8), new THREE.MeshStandardMaterial({color: '#ffffff', roughness: .6})); b.castShadow = true; b.position.copy(hero.position).add(new THREE.Vector3(0, 1.1, 0));
        b.userData = {tgt, t: 0, from: b.position.clone()}; scene.add(b); balls.push(b); ctx.sfx.tap(); }
    } else if (!moving && heroAnim !== act.Throw) play('Idle_A');
    ring.position.x = hero.position.x; ring.position.z = hero.position.z; ring.material.opacity = invul > 0 ? (Math.sin(invul * 30) > 0 ? .9 : .1) : .6;
    // boules du héros
    for (const b of [...balls]){ const u = b.userData; u.t += dt * 2.6; const to = u.tgt.o.position.clone().add(new THREE.Vector3(0, u.tgt.D.h * .55, 0)); b.position.lerpVectors(u.from, to, Math.min(1, u.t)); b.position.y += Math.sin(Math.min(1, u.t) * Math.PI) * 1.2;
      if (u.t >= 1){ scene.remove(b); balls.splice(balls.indexOf(b), 1); if (!u.tgt.dead){ hurt(u.tgt, 1); combo++; addCharge(1); puff(b.position.clone().setY(0), .5, '#ffffff', 5); if (combo % 8 === 0) say(`Combo ×${combo} !`, '#ffd84a'); } } }
    // apparition
    spawnT -= dt; if (queue.length && spawnT <= 0 && (!FOES[queue[0]].boss || alive.length < 3)){ spawn(); spawnT = Math.max(.6, 1.8 - C.i * .03) * (.7 + Math.random() * .6); }
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
        o.rotation.y = Math.atan2(hero.position.x - o.position.x, hero.position.z - o.position.z);
        f.atkT -= dt; if (f.atkT <= 0){ f.atkT = f.kind === 'krampus' ? Math.max(1.1, 2.4 - C.ch * .12) : 2.8; oneShot(f, f.punch);
          const n = f.kind === 'krampus' ? 3 : 1; for (let k = 0; k < n; k++){ const aim = hero.position.clone().add(new THREE.Vector3((k - (n - 1) / 2) * 1.6, 0, 0));
            const s = new THREE.Mesh(f.kind === 'krampus' ? new THREE.OctahedronGeometry(.28) : new THREE.SphereGeometry(.2, 8, 6), new THREE.MeshStandardMaterial({color: f.kind === 'krampus' ? '#8fdcff' : '#f2f2f2', emissive: f.kind === 'krampus' ? '#2a8ee0' : '#000', emissiveIntensity: .6}));
            s.position.copy(o.position).add(new THREE.Vector3(0, D.h * .7, 0)); s.userData = {from: s.position.clone(), to: aim, t: 0, d: f.kind === 'krampus' ? 1.1 : 1.3};
            const mark = new THREE.Mesh(new THREE.RingGeometry(.35, .5, 24), new THREE.MeshBasicMaterial({color: '#ff3b3b', transparent: true, opacity: .8})); mark.rotation.x = -Math.PI / 2; mark.position.set(aim.x, .04, aim.z); scene.add(mark); s.userData.mark = mark;
            scene.add(s); shots.push(s); } }
        continue;
      }
      // marche vers la palissade
      f.t += dt; const sp = D.sp * (1 + C.i * .015); o.position.z += sp * dt; o.position.x += Math.sin(f.t * 1.3) * .2 * dt; o.rotation.y = 0;
      // contact avec le héros : il le repousse et le blesse
      if (o.position.distanceTo(hero.position) < (D.h * .35 + .4) && invul <= 0){ heroHit(); oneShot(f, f.punch); }
      if (o.position.z >= GATE_Z - .6){ gateHp -= D.dmg; shake = .5; say('-' + D.dmg + ' palissade', '#ff8a9a'); ctx.sfx.err(); puff(o.position, 1, '#c9a07a', 8); f.dead = .01; f.bar.visible = false; scene.remove(o); killed++;
        if (gateHp <= 0){ gateHp = 0; finish(false); } }
    }
    // tirs ennemis
    for (const s of [...shots]){ const u = s.userData; u.t += dt / u.d; s.position.lerpVectors(u.from, u.to, Math.min(1, u.t)); s.position.y += Math.sin(Math.min(1, u.t) * Math.PI) * 2.2; s.rotation.x += dt * 8;
      u.mark.material.opacity = .4 + .5 * Math.sin(u.t * 20);
      if (u.t >= 1){ scene.remove(s); scene.remove(u.mark); shots.splice(shots.indexOf(s), 1); puff(s.position.clone().setY(0), .6, '#dff3ff', 6);
        if (tmp.set(u.to.x, 0, u.to.z).distanceTo(hero.position) < .75 && invul <= 0) heroHit(); } }
    for (const m of [...puffs]){ m.userData.t += dt; m.position.addScaledVector(m.userData.v, dt); m.userData.v.y -= 9 * dt; m.material.opacity = 1 - m.userData.t / .7; if (m.userData.t > .7){ scene.remove(m); puffs.splice(puffs.indexOf(m), 1); } }
    if (!queue.length && !foes.length && state === 'play'){ state = 'won'; play('Interact', true); setTimeout(() => finish(true), 900); }
  }
  function heroHit(){ hearts--; invul = 1.4; combo = 0; shake = .5; ctx.sfx.err(); play('Hit_A', true); setTimeout(() => play('Idle_A'), 500); say('Aïe !', '#ff8a9a');
    if (hearts <= 0){ play('Death_A', true); finish(false); } }

  function finish(win){
    if (state === 'end') return; state = 'end';
    const pct = gateHp / 100, stars = !win ? 0 : (hearts === heartsMax && pct > .66) ? 3 : (hearts >= 2 && pct > .33) ? 2 : 1;
    const res = ctx.result({win, hearts: stars, score: killed}), card = root.querySelector('.mg-card');
    card.innerHTML = `<small>${C.name}</small><h2>${win ? 'Village sauvé !' : hearts <= 0 ? 'Pépin est tombé…' : 'La palissade a cédé…'}</h2>${win ? `<div class="mg-stars">${[1, 2, 3].map(k => `<i class="${k <= stars ? 'on' : ''}">★</i>`).join('')}</div>` : `<p>${killed} / ${total} monstres repoussés. Améliore ton village et Flocon, puis reviens !</p>`}
      <div class="costs mg-rw">${ctx.chipsHtml(res.rw)}</div><button class="btn green mg-claim">${win ? 'Récupérer' : 'Retour'}</button>`;
    card.hidden = false; card.querySelector('.mg-claim').onclick = e => { ctx.grant(res.rw, e.currentTarget); ctx.sfx.level(); setTimeout(close, 400); };
  }
  function close(){ cancelAnimationFrame(raf); removeEventListener('resize', resize); R.dispose(); root.remove(); ctx.onClose?.(); }
  let quitArmed = 0;
  root.querySelector('.mg-quit').onclick = () => { if (state === 'play' && performance.now() - quitArmed > 2500){ quitArmed = performance.now(); say('Touche encore pour fuir', '#ffd84a'); return; } close(); };
  root.querySelector('.mg-go').onclick = () => { root.querySelector('.mg-card').hidden = true; state = 'play'; ctx.sfx.tap(); setTimeout(() => root.querySelector('.b-hint')?.remove(), 4500); };

  const camT = new THREE.Vector3();
  function render(){
    // caméra derrière et au-dessus de Pépin, qui le suit en douceur
    camT.set(hero.position.x * .6, 5.4, hero.position.z + 6.8); cam.position.lerp(camT, .08);
    if (shake) cam.position.add(new THREE.Vector3((Math.random() - .5) * shake * .4, (Math.random() - .5) * shake * .3, 0));
    cam.lookAt(hero.position.x * .6, .9, hero.position.z - 4.2);
    R.render(scene, cam);
    // textes flottants
    for (const f of [...floats]){ f.t += .016; f.d.style.opacity = Math.max(0, 1 - f.t); f.d.style.transform = `translate(-50%, ${-f.t * 50}px)`; if (f.t > 1.1){ f.d.remove(); floats.splice(floats.indexOf(f), 1); } }
    root.querySelector('.b-left').textContent = `${killed}/${total}`;
    root.querySelector('.gate i').style.width = gateHp + '%'; root.querySelector('.gate').classList.toggle('low', gateHp < 34);
    root.querySelector('.b-hearts').textContent = '❤'.repeat(Math.max(0, hearts)) + '♡'.repeat(Math.max(0, heartsMax - hearts));
    for (const b of root.querySelectorAll('[data-p]')){ const k = b.dataset.p, r = charge[k] / NEED[k]; b.querySelector('i').style.height = (r * 100) + '%'; b.classList.toggle('ready', r >= 1); }
  }
  function loop(now){ raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; update(dt); render(); }
  raf = requestAnimationFrame(loop);
  window.__b3 = {get state(){ return state; }, get hero(){ return hero; }, get foes(){ return foes; }, power};
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
