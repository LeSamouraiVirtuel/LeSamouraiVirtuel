// Le Village du Pôle — boucle principale, scène, personnages, interactions et interface.
import * as THREE from 'three';
import {loadAssets, prop, character, santaLook, elfLook} from './assets.js';
import {createWorld, groundY, plotPos, ALL_PLOTS, HQ_ID, PLAZA_ID, zoneZ, zoneY, ZD, LANE_X, radialTexture} from './world.js';
import {buildModel, scaffold, constructionSite, BASE_Y} from './buildings.js';
import * as G from './game.js';

const $ = s => document.querySelector(s);
const BASE = new URL('../assets/', import.meta.url).href;

/* =====================================================================
   RENDU
   ===================================================================== */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
const camera = new THREE.PerspectiveCamera(32, 1, .5, 260);

await loadAssets(BASE, p => { $('#loadbar i').style.width = Math.round(p * 100) + '%'; });
$('#loading').hidden = true; $('#play').hidden = false;

const world = createWorld(renderer);
const scene = world.scene;

/* =====================================================================
   ÉTAT
   ===================================================================== */
const saved = G.loadState();
let state = saved || G.newState();
const R = G.rules(() => state);
const {TYPES, RES} = G;

/* =====================================================================
   ICÔNES 3D (rendues une fois à partir des vrais modèles)
   ===================================================================== */
const iconR = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
iconR.setPixelRatio(1); iconR.toneMapping = THREE.NeutralToneMapping; iconR.toneMappingExposure = 1.05;
const iconScene = new THREE.Scene();
iconScene.environment = scene.environment; iconScene.environmentIntensity = .7;
iconScene.add(new THREE.HemisphereLight('#ffffff', '#b8c8e8', 1.2));
const iconSun = new THREE.DirectionalLight('#ffffff', 2.2); iconSun.position.set(3, 5, 4); iconScene.add(iconSun);
const iconCam = new THREE.PerspectiveCamera(30, 1, .05, 100);
function renderIcon(obj, {size = 128, yaw = .6, pitch = .45, pad = 1.15, focusY = null, dist = null} = {}){
  iconR.setSize(size, size);
  const holder = new THREE.Group(); holder.add(obj); iconScene.add(holder);
  holder.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(holder), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
  if (focusY != null) c.y = focusY;
  const r = dist ?? Math.max(sz.x, sz.y, sz.z) * pad / (2 * Math.tan(THREE.MathUtils.degToRad(15)));
  iconCam.position.set(c.x + Math.sin(yaw) * Math.cos(pitch) * r, c.y + Math.sin(pitch) * r, c.z + Math.cos(yaw) * Math.cos(pitch) * r);
  iconCam.lookAt(c);
  iconR.render(iconScene, iconCam);
  const url = iconR.domElement.toDataURL('image/png');
  iconScene.remove(holder);
  return url;
}
const ICON = {
  coins: renderIcon(coinStack(), {pitch: .5, yaw: .3}),
  wood: renderIcon(prop('Wood_Log_Stack'), {pitch: .5}),
  cookies: renderIcon(prop('cookie'), {pitch: .9}),
  gifts: renderIcon(prop('present_A_red'), {pitch: .45}),
  sleigh: renderIcon((() => { const g = new THREE.Group(); g.add(prop('sled-long', {s: 1.2})); g.add(prop('present_A_red', {s: .45, y: .3, z: -.2})); g.add(prop('present_B_green', {s: .35, y: .3, z: .3, ry: .5})); g.add(prop('reindeer', {z: 1.4, s: .9})); return g; })(), {size: 160, yaw: 1.1, pitch: .35}),
  build: renderIcon(prop('Wood_Planks_Stack_Medium'), {pitch: .6}),
};
function coinStack(){
  const g = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({color: '#ffc531', metalness: .55, roughness: .3});
  const rim = new THREE.MeshStandardMaterial({color: '#e09a12', metalness: .5, roughness: .35});
  const face = new THREE.CylinderGeometry(.5, .5, .14, 32), edge = new THREE.TorusGeometry(.5, .05, 8, 32);
  [[0, 0, 0, 0], [.08, .15, -.05, .2], [-.05, .3, .04, -.15]].forEach(([x, y, z, r]) => {
    const c = new THREE.Group(); c.add(new THREE.Mesh(face, gold)); const e = new THREE.Mesh(edge, rim); e.rotation.x = Math.PI / 2; c.add(e);
    c.position.set(x, y, z); c.rotation.z = r * .3; g.add(c);
  });
  const top = new THREE.Group(); top.add(new THREE.Mesh(face, gold)); const e = new THREE.Mesh(edge, rim); e.rotation.x = Math.PI / 2; top.add(e);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .03, 5), rim); st.position.y = .08; top.add(st);
  top.position.set(.35, .35, .35); top.rotation.set(1.1, 0, -.3); g.add(top);
  return g;
}
const thumbCache = new Map();
function thumb(type, lv){
  const k = type + lv; if (thumbCache.has(k)) return thumbCache.get(k);
  const m = buildModel(type, lv); m.anim.forEach(a => a(2, .1));
  const url = renderIcon(m.group, {size: 220, yaw: .55, pitch: .5, pad: 1.05});
  thumbCache.set(k, url); return url;
}
function portrait(lv){
  const c = character('santa', santaLook(lv), {hat: lv >= 6}); c.mixer.update(.6);
  return renderIcon(c.root, {size: 128, yaw: .25, pitch: .1, focusY: 1.75, dist: 2.6});
}

/* =====================================================================
   SON
   ===================================================================== */
let actx = null, soundOn = true;
function tone(f, d = .12, type = 'sine', v = .07, when = 0){
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02);
  } catch(e){}
}
const sfx = {
  collect: () => { tone(988, .12, 'triangle', .06); tone(1319, .18, 'triangle', .06, .07); },
  build: () => { tone(330, .12, 'square', .03); tone(392, .12, 'square', .03, .1); tone(523, .25, 'triangle', .06, .2); },
  level: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .3, 'triangle', .06, i * .08)),
  err: () => tone(160, .18, 'sawtooth', .025),
  tap: () => tone(740, .06, 'sine', .04),
  bells: () => [1568, 1318, 1568, 1760].forEach((f, i) => tone(f, .5, 'sine', .05, i * .15)),
};

/* =====================================================================
   EMPLACEMENTS & BÂTIMENTS
   ===================================================================== */
const pickables = [];
const views = {};
const markerTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = 'rgba(120,150,200,.16)'; x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 10; x.setLineDash([26, 18]);
  x.beginPath(); x.roundRect(14, 14, 228, 228, 40); x.fill(); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const markerMat = new THREE.MeshBasicMaterial({map: markerTex, transparent: true, depthWrite: false});
const markerGeo = new THREE.PlaneGeometry(3.6, 3.6).rotateX(-Math.PI / 2);
for (const id of ALL_PLOTS){
  const p = plotPos(id);
  const marker = new THREE.Mesh(markerGeo, markerMat); marker.position.set(p.x, p.y + .04, p.z); marker.userData.plot = id; marker.renderOrder = 1;
  scene.add(marker); pickables.push(marker);
  const holder = new THREE.Group(); holder.position.copy(p); holder.userData.plot = id; scene.add(holder); pickables.push(holder);
  views[id] = {marker, holder, sig: '', anim: [], smoke: [], pop: 1, lv: 0, top: 2.5, inner: null};
}
function syncPlot(id){
  const v = views[id], p = state.plots[id];
  const k = +id[0];
  v.marker.visible = !p && R.zoneOpen(k);
  const sig = p ? `${p.type}:${p.lv}:${p.upEnd ? 1 : 0}` : '';
  if (sig === v.sig) return;
  const prevLv = v.lv;
  v.sig = sig; v.holder.clear(); v.anim = []; v.smoke = []; v.inner = null;
  if (!p){ v.lv = 0; return; }
  if (p.lv > 0){ const m = buildModel(p.type, p.lv); v.holder.add(m.group); v.inner = m.group; v.anim = m.anim; v.smoke = m.smoke; v.top = m.top; }
  else { const c = constructionSite(); v.holder.add(c); v.inner = c; v.top = 2.4; }
  if (p.upEnd){ const s = scaffold(Math.max(2.2, v.top - .4)); v.holder.add(s); }
  if (p.lv > prevLv && v.ready){ v.pop = 0; burst(v.holder.position.clone().add(new THREE.Vector3(0, 1.6, 0)), 34); }
  v.lv = p.lv; v.ready = true;
}

/* ---------- particules ---------- */
const smokeTex = radialTexture('rgba(255,255,255,.95)', 'rgba(235,240,250,0)');
const smokePool = Array.from({length: 50}, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({map: smokeTex, transparent: true, depthWrite: false, opacity: 0})); s.visible = false; scene.add(s); return {s, life: 0, vx: 0}; });
function puff(p){ const o = smokePool.find(o => o.life <= 0); if (!o) return; o.life = 1; o.s.position.copy(p); o.s.visible = true; o.vx = .15 + Math.random() * .2; }
const starTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.translate(32, 32); x.fillStyle = '#ffd84a'; x.beginPath(); for (let i = 0; i < 10; i++){ const r = i % 2 ? 11 : 28, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.shadowColor = '#fff6c0'; x.shadowBlur = 8; x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const sparks = Array.from({length: 80}, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({map: i % 4 ? starTex : smokeTex, transparent: true, depthWrite: false, color: i % 4 ? '#ffffff' : '#fff2b0'})); s.visible = false; scene.add(s); return {s, life: 0, v: new THREE.Vector3(), spin: 0}; });
function burst(p, n = 24){ let k = 0; for (const o of sparks){ if (o.life > 0) continue; o.life = 1; o.s.visible = true; o.s.position.copy(p); o.v.set((Math.random() - .5) * 7, 4 + Math.random() * 5, (Math.random() - .5) * 7); o.s.scale.setScalar(.3 + Math.random() * .3); if (++k >= n) break; } }

/* =====================================================================
   PERSONNAGES
   ===================================================================== */
const laneZ = k => zoneZ(k);
function randomSpot(){
  const k = Math.floor(Math.random() * R.openZones());
  return new THREE.Vector3((Math.random() - .5) * 14.5, 0, laneZ(k) + (Math.random() - .5) * .7);
}
function route(from, to){
  const pts = [];
  const sameLane = Math.abs(from.z - to.z) < 1.2;
  if (!sameLane){
    const vx = Math.abs(from.x - LANE_X) + Math.abs(to.x - LANE_X) < Math.abs(from.x + LANE_X) + Math.abs(to.x + LANE_X) ? LANE_X : -LANE_X;
    pts.push(new THREE.Vector3(vx, 0, from.z), new THREE.Vector3(vx, 0, to.z));
  }
  pts.push(to.clone()); return pts;
}
class Walker {
  constructor(ch, scale, speed){ this.ch = ch; this.root = ch.root; this.root.scale.setScalar(scale); this.speed = speed; this.path = []; this.wait = Math.random() * 2; this.task = null; scene.add(this.root); }
  goTo(p, task = null){ this.path = route(this.root.position, p); this.task = task; }
  update(dt){
    this.ch.mixer.update(dt);
    const pos = this.root.position;
    if (this.path.length){
      const t = this.path[0], dx = t.x - pos.x, dz = t.z - pos.z, d = Math.hypot(dx, dz);
      if (d < .08){ this.path.shift(); if (!this.path.length){ this.ch.play(this.task === 'work' ? 'Interact' : 'Idle_A'); this.wait = this.task === 'work' ? 1e9 : 1.5 + Math.random() * 4; if (this.task === 'face') this.root.rotation.y = 0; } }
      else {
        const st = Math.min(d, this.speed * dt); pos.x += dx / d * st; pos.z += dz / d * st;
        const ang = Math.atan2(dx, dz); let da = ang - this.root.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); this.root.rotation.y += da * Math.min(1, dt * 10);
        this.ch.play('Walking_A');
      }
    } else this.wait -= dt;
    pos.y += (groundY(pos.x, pos.z) - pos.y) * Math.min(1, dt * 14);
  }
}
let santa = null;
function makeSanta(){
  const lv = R.hqLv();
  const pos = santa ? santa.root.position.clone() : plotPos(HQ_ID).add(new THREE.Vector3(1.2, 0, 2.3));
  if (santa) scene.remove(santa.root);
  santa = new Walker(character('santa', santaLook(lv), {hat: lv >= 6}), .6 + lv * .012, 1.1);
  santa.root.position.copy(pos); santa.lv = lv;
  $('#avatar img').src = portrait(lv);
}
const elves = [];
function syncElves(){
  const want = Math.min(8, 2 + Object.values(state.plots).filter(p => p.lv > 0).length);
  while (elves.length < want){
    const e = new Walker(character('elf', elfLook(elves.length)), .42, 1.5 + Math.random() * .5);
    const s = randomSpot(); e.root.position.set(s.x, groundY(s.x, s.z), s.z); elves.push(e);
  }
}
function updateCharacters(dt){
  // un lutin par chantier
  const sites = Object.keys(state.plots).filter(id => state.plots[id].upEnd);
  for (const e of elves) if (e.site && !sites.includes(e.site)){ e.site = null; e.wait = 0; e.task = null; }
  for (const id of sites){
    if (elves.some(e => e.site === id)) continue;
    const free = elves.find(e => !e.site); if (!free) break;
    free.site = id; const p = plotPos(id); free.goTo(new THREE.Vector3(p.x + .9, 0, p.z + (+id[2] === 1 ? 2.1 : 2.15) * (id[2] === '1' ? 1 : 1)), 'work');
  }
  for (const e of elves){
    if (!e.site && !e.path.length && e.wait <= 0) e.goTo(randomSpot());
    e.update(dt);
    if (e.site && !e.path.length){ const p = plotPos(e.site); e.root.rotation.y = Math.atan2(p.x - e.root.position.x, p.z - e.root.position.z); }
  }
  if (santa){
    if (santa.lv !== R.hqLv()) makeSanta();
    if (!santa.path.length && santa.wait <= 0){
      const h = plotPos(HQ_ID); const r = Math.random();
      santa.goTo(r < .6 ? new THREE.Vector3(h.x + (Math.random() - .5) * 5, 0, h.z + 2.75 + (Math.random() - .5) * .5) : randomSpot(), 'face');
    }
    santa.update(dt);
  }
}

/* ---------- traîneau ---------- */
const sleigh = new THREE.Group(); sleigh.visible = false; scene.add(sleigh);
{
  sleigh.add(prop('sled-long', {s: 1.4}));
  sleigh.add(prop('present_A_red', {s: .4, y: .35, z: -.35})); sleigh.add(prop('present_B_green', {s: .32, y: .35, z: -.05, x: .15, ry: .6}));
  const rider = character('santa', santaLook(10), {hat: true}); rider.root.scale.setScalar(.36); rider.root.position.set(0, .3, .25); rider.mixer.update(.3); sleigh.add(rider.root);
  for (let i = 0; i < 2; i++) for (const x of [-.25, .25]){ const r = prop('reindeer', {x, z: 1.6 + i * 1.0, s: .75}); r.name = 'rd'; sleigh.add(r); }
  sleigh.userData.rider = rider;
}

/* =====================================================================
   SIMULATION
   ===================================================================== */
let offline = false;
function simulate(dt, now){
  for (const id in state.plots){
    const p = state.plots[id];
    if (p.upEnd && now >= p.upEnd){
      p.lv = p.upTo; delete p.upEnd; delete p.upTo;
      if (!offline){ sfx.level(); celebrate(id, p); }
    }
    const T = TYPES[p.type];
    if (T.prod && p.lv > 0 && !p.upEnd) p.buf = Math.min(G.bufCap(p.type, p.lv), (p.buf || 0) + G.rate(p.type, p.lv) / 60 * dt);
  }
  if (state.delivery && now >= state.delivery.end){
    const a = state.delivery.amount; state.delivery = null;
    gain({coins: a * 6}); state.stars += a; state.stats.delivered += a;
    if (!offline){ sfx.bells(); toast(`Tournée terminée ! ${a} enfants heureux · +${a * 6} pièces · +${a} étoiles`); }
  }
}
function gain(c){ const cap = R.storeCap(); for (const k in c) state.res[k] = Math.min(Math.max(cap, state.res[k]), state.res[k] + c[k]); }
function pay(c){ for (const k in c) state.res[k] -= c[k]; }
function collect(id, el){
  const p = state.plots[id], T = TYPES[p.type]; if (!T.prod) return false;
  const have = Math.floor(p.buf || 0); if (have < 1) return false;
  const take = Math.min(have, Math.max(0, R.storeCap() - state.res[T.prod]));
  if (take <= 0){ sfx.err(); toast('Stock plein ! Améliore la Maison ou construis un Entrepôt.'); return true; }
  state.res[T.prod] += take; p.buf -= take;
  if (T.prod === 'wood') state.stats.wood += take;
  if (T.prod === 'gifts') state.stats.gifts += take;
  sfx.collect(); flyIcons(T.prod, take, el);
  return true;
}
function upgrade(id){
  const why = R.upgradeBlock(id); if (why){ sfx.err(); toast(why); return; }
  const p = state.plots[id], to = p.lv + 1;
  pay(G.costOf(p.type, to)); collect(id); p.upTo = to; p.upEnd = Date.now() + G.timeOf(p.type, to) * 1000; sfx.build(); save();
}
function build(id, t){
  const why = R.buildBlock(t); if (why){ sfx.err(); toast(why); return; }
  pay(G.costOf(t, 1)); state.plots[id] = {type: t, lv: 0, buf: 0, upTo: 1, upEnd: Date.now() + G.timeOf(t, 1) * 1000};
  sfx.build(); save(); renderSheet();
}
const speedCost = p => Math.max(5, Math.ceil((p.upEnd - Date.now()) / 1000 * 1.5));
function speedUp(id){ const p = state.plots[id]; if (!p.upEnd) return; const c = speedCost(p); if (state.res.coins < c){ sfx.err(); toast('Pas assez de pièces'); return; } state.res.coins -= c; p.upEnd = Date.now(); }
function startDelivery(){
  if (state.delivery){ toast(`Le traîneau revient dans ${fmtTime((state.delivery.end - Date.now()) / 1000)}`); return; }
  if (R.bestLv('stable') < 1){ sfx.err(); toast("Construis l'Écurie des rennes (Maison niveau 3) pour débloquer le traîneau"); return; }
  if (state.res.gifts < 1){ sfx.err(); toast("Pas de cadeaux à livrer : récolte l'Atelier des lutins"); return; }
  const a = Math.min(state.res.gifts, R.sleighCap()); state.res.gifts -= a; state.stats.trips++;
  state.delivery = {amount: a, start: Date.now(), end: Date.now() + G.DELIVERY_MS};
  sfx.bells(); toast(`Le traîneau s'envole avec ${a} cadeaux !`); save();
}
function save(){ G.saveState(state); }

/* =====================================================================
   INTERFACE
   ===================================================================== */
const fmt = n => { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n); };
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60; return h ? `${h}h ${String(m).padStart(2, '0')}m` : m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`; };
const ic = k => `<img class="i" src="${ICON[k]}" alt="">`;
const chips = c => Object.keys(c).map(k => `<span class="chip ${state.res[k] < c[k] ? 'bad' : ''}">${ic(k)}${fmt(c[k])}</span>`).join('');

$('#res').innerHTML = Object.keys(RES).map(k => `<div class="res" id="r-${k}"><img src="${ICON[k]}" alt="${RES[k].name}"><b class="num">0</b><span class="cap"><i></i></span></div>`).join('');
$('#sleigh img').src = ICON.sleigh;

function renderHud(){
  const cap = R.storeCap();
  for (const k in RES){ const el = $('#r-' + k); el.querySelector('b').textContent = fmt(state.res[k]); el.querySelector('i').style.width = Math.min(100, state.res[k] / cap * 100) + '%'; el.classList.toggle('full', state.res[k] >= cap); }
  $('#rankname').textContent = G.RANKS[R.hqLv() - 1];
  $('#avatar .lv').textContent = R.hqLv();
  $('#builders').textContent = `${R.busyBuilders()}/${G.BUILDERS}`;
  $('#stars b').textContent = fmt(state.stars);
  const stb = R.bestLv('stable'), sl = $('#sleigh');
  sl.classList.toggle('off', !stb || (!state.delivery && state.res.gifts < 1));
  sl.classList.toggle('flying', !!state.delivery);
  $('#sleigh small').textContent = state.delivery ? fmtTime((state.delivery.end - Date.now()) / 1000) : stb ? `${Math.min(state.res.gifts, R.sleighCap())}/${R.sleighCap()}` : 'Niv. 3';
  const q = R.QUESTS[state.quest], qe = $('#quest');
  if (!q){ qe.classList.remove('done'); $('#qtext').textContent = 'Tu es le Père Noël ! Continue à agrandir ton village.'; $('#qprog').hidden = true; $('#qbtn').hidden = true; return; }
  const done = q.ok(state);
  qe.classList.toggle('done', done);
  $('#qnum').textContent = `${state.quest + 1}/${R.QUESTS.length}`;
  $('#qtext').textContent = q.t;
  $('#qbtn').hidden = !done;
  $('#qbtn span').innerHTML = Object.keys(q.rw).map(k => `${ic(k)}${q.rw[k]}`).join(' ');
  if (q.prog && !done){ const [a, b] = q.prog(state); $('#qprog').hidden = false; $('#qprog i').style.width = Math.min(100, a / b * 100) + '%'; } else $('#qprog').hidden = true;
}
$('#quest').addEventListener('click', () => {
  const q = R.QUESTS[state.quest]; if (!q) return;
  if (q.ok(state)){ gain(q.rw); state.quest++; sfx.level(); for (const k in q.rw) flyIcons(k, q.rw[k], $('#qbtn')); save(); }
  else { sfx.tap(); toast(q.t); }
});
$('#sleigh').addEventListener('click', startDelivery);
$('#sound').addEventListener('click', () => { soundOn = !soundOn; $('#sound').classList.toggle('muted', !soundOn); $('#sound').setAttribute('aria-label', soundOn ? 'Couper le son' : 'Activer le son'); });

let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); }
function flyIcons(key, amount, fromEl){
  const r0 = fromEl ? fromEl.getBoundingClientRect() : {left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0};
  const target = $('#r-' + key).getBoundingClientRect();
  const n = Math.min(7, 2 + Math.floor(Math.log2(amount + 1)));
  for (let i = 0; i < n; i++){
    const d = document.createElement('img'); d.src = ICON[key]; d.className = 'fly'; document.body.appendChild(d);
    const x0 = r0.left + r0.width / 2 - 18 + (Math.random() - .5) * 50, y0 = r0.top + r0.height / 2 - 18 + (Math.random() - .5) * 30;
    d.style.transform = `translate(${x0}px,${y0}px) scale(.4)`;
    setTimeout(() => { d.style.transform = `translate(${x0 + (Math.random() - .5) * 40}px,${y0 - 30}px) scale(1)`; }, 16);
    setTimeout(() => { d.style.transition = 'transform .55s cubic-bezier(.6,-0.2,.7,1), opacity .55s'; d.style.transform = `translate(${target.left}px,${target.top}px) scale(.7)`; }, 260 + i * 60);
    setTimeout(() => { d.remove(); const el = $('#r-' + key); el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); }, 820 + i * 60);
  }
  const t = document.createElement('div'); t.className = 'plusnum'; t.textContent = `+${fmt(amount)}`; document.body.appendChild(t);
  t.style.left = (r0.left + r0.width / 2) + 'px'; t.style.top = (r0.top) + 'px';
  setTimeout(() => t.remove(), 1000);
}
function celebrate(id, p){
  const T = TYPES[p.type];
  const b = $('#banner');
  b.querySelector('img').src = thumb(p.type, p.lv);
  b.querySelector('small').textContent = T.name;
  b.querySelector('b').textContent = p.lv === 1 ? 'Construit !' : `Niveau ${p.lv} !`;
  b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
  if (p.type === 'hq'){
    setTimeout(() => toast(`Nouveau rang : ${G.RANKS[p.lv - 1]}`), 1600);
    const k = G.ZONES.findIndex(z => z.hq === p.lv);
    if (k > 0) setTimeout(() => { toast(`Nouveau terrain débloqué : ${G.ZONES[k].name} !`); cam.tz = zoneZ(k) + 3; }, 3200);
  }
  if (sel === id) renderSheet();
}

/* ---------- fiche ---------- */
let sel = null;
function openSheet(id){ sel = id; document.body.classList.add('sheet-open'); renderSheet(); const p = plotPos(id); cam.tx = p.x * .6; cam.tz = p.z + cam.dist * .2; }
function closeSheet(){ sel = null; sheetHtml = ''; document.body.classList.remove('sheet-open'); }
const pips = lv => `<span class="pips">${Array.from({length: G.MAX_LV}, (_, i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</span>`;
function statRows(p, to){
  const T = TYPES[p.type], rows = [];
  const row = (label, a, b) => rows.push(`<div class="row"><span>${label}</span><b>${a}${b != null && to <= G.MAX_LV ? ` <em>→ ${b}</em>` : ''}</b></div>`);
  if (T.prod) { row(`Production ${ic(T.prod)}`, `${G.rate(p.type, p.lv)}/min`, `${G.rate(p.type, to)}/min`); row('Réserve', fmt(G.bufCap(p.type, p.lv)), fmt(G.bufCap(p.type, to))); }
  if (p.type === 'hq'){ row('Stock max', fmt(500 + 300 * (p.lv - 1)), fmt(500 + 300 * (to - 1))); const z = G.ZONES.find(z => z.hq > p.lv); if (z) rows.push(`<div class="row"><span>Prochain terrain</span><b>${z.name} · niv. ${z.hq}</b></div>`); }
  if (p.type === 'storage') row('Bonus de stock', '+' + fmt(G.storageBonus(p.lv)), '+' + fmt(G.storageBonus(to)));
  if (p.type === 'stable') row('Cadeaux par tournée', G.sleighCapOf(p.lv), G.sleighCapOf(to));
  return rows.join('');
}
let sheetHtml = '';
function setSheet(html){ if (html !== sheetHtml){ sheetHtml = html; $('#sheet').innerHTML = html; } patchSheet(); }
function patchSheet(){
  const p = sel && state.plots[sel]; if (!p) return;
  const el = $('#sheet'), q = k => el.querySelector(`[data-live="${k}"]`);
  if (p.upEnd){
    const total = G.timeOf(p.type, p.upTo) * 1000, left = p.upEnd - Date.now();
    q('prog') && (q('prog').style.width = Math.min(100, (1 - left / total) * 100) + '%');
    q('left') && (q('left').textContent = fmtTime(left / 1000));
    q('speed') && (q('speed').textContent = speedCost(p));
  }
  if (q('buf')){ q('buf').textContent = fmt(p.buf || 0); q('collect').disabled = (p.buf || 0) < 1; }
}
function renderSheet(){
  if (!sel) return;
  const p = state.plots[sel];
  if (!p){
    setSheet(`<div class="hd"><div class="tt"><small>Terrain libre</small><h2>Construire</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>
    <div class="grid">${G.BUILDABLE.map(t => { const T = TYPES[t], why = R.buildBlock(t), hard = why && !/Ressources/.test(why);
      return `<button class="card ${hard ? 'locked' : ''}" data-a="build" data-t="${t}"><img src="${thumb(t, 1)}" alt=""><b>${T.name}</b>
      ${T.prod ? `<span class="meta">${ic(T.prod)} ${G.rate(t, 1)}/min</span>` : `<span class="meta">${t === 'storage' ? 'Stock +' + fmt(G.storageBonus(1)) : 'Traîneau'}</span>`}
      ${hard ? `<span class="why">${why}</span>` : `<span class="costs">${chips(G.costOf(t, 1))}</span>`}</button>`; }).join('')}</div>`);
    return;
  }
  const T = TYPES[p.type], to = p.lv + 1;
  let body;
  if (p.upEnd){
    const total = G.timeOf(p.type, p.upTo) * 1000, left = p.upEnd - Date.now();
    body = `<div class="work"><div class="bar"><i data-live="prog"></i></div><span>${p.lv === 0 ? 'Construction' : `Amélioration vers le niveau ${p.upTo}`} · <b data-live="left"></b></span></div>
    <div class="acts"><button class="btn gold" data-a="speed">Terminer · ${ic('coins')}<b data-live="speed"></b></button></div>`;
  } else {
    const why = R.upgradeBlock(sel), c = to <= G.MAX_LV ? G.costOf(p.type, to) : null;
    body = `${c ? `<div class="costs big">${chips(c)}<span class="chip time">${fmtTime(G.timeOf(p.type, to))}</span></div>` : ''}
    ${why && why !== 'Ressources insuffisantes' && c ? `<div class="note">${why}</div>` : ''}
    <div class="acts">${T.prod ? `<button class="btn gold" data-a="collect" data-live="collect">Récolter ${ic(T.prod)}<b data-live="buf"></b></button>` : ''}
    ${c ? `<button class="btn green" data-a="up" ${why ? 'disabled' : ''}>Améliorer</button>` : '<div class="note ok">Niveau maximum !</div>'}</div>`;
  }
  const next = to <= G.MAX_LV && !p.upEnd;
  setSheet(`<div class="hd"><div class="tt"><small>${pips(p.lv)}</small><h2>${T.name}</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>
  <div class="preview ${next ? 'two' : ''}"><figure><img src="${thumb(p.type, Math.max(1, p.lv))}" alt=""><figcaption>Niv. ${Math.max(1, p.lv)}</figcaption></figure>
  ${next ? `<span class="arrow"></span><figure class="nx"><img src="${thumb(p.type, to)}" alt=""><figcaption>Niv. ${to}</figcaption></figure>` : ''}</div>
  <p>${T.desc}</p><div class="stats">${statRows(p, to)}</div>${body}`);
}
$('#sheet').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'close') closeSheet();
  else if (a === 'build') build(sel, b.dataset.t);
  else if (a === 'up') upgrade(sel);
  else if (a === 'collect') collect(sel, b);
  else if (a === 'speed') speedUp(sel);
  renderSheet();
});

/* ---------- bulles au-dessus des bâtiments ---------- */
const ovRoot = $('#ov'), ovs = {};
for (const id of ALL_PLOTS){ const d = document.createElement('div'); d.className = 'ov'; ovRoot.appendChild(d); ovs[id] = {el: d, key: ''}; }
const locks = [];
for (let k = 1; k < 4; k++){ const d = document.createElement('div'); d.className = 'ov lock'; d.innerHTML = `<span class="padlock"></span><b>${G.ZONES[k].name}</b><small>Maison niveau ${G.ZONES[k].hq}</small>`; ovRoot.appendChild(d); locks[k] = d; }
ovRoot.addEventListener('pointerdown', e => {
  const b = e.target.closest('[data-id]'); if (!b) return;
  e.stopPropagation();
  const id = b.dataset.id;
  if (b.classList.contains('bubble')) collect(id, b); else { sfx.tap(); openSheet(id); }
});
function ovKey(id){
  const p = state.plots[id];
  if (!R.zoneOpen(+id[0])) return '';
  if (!p) return 'plus';
  if (p.upEnd) return 'timer';
  if (R.ready(p)) return 'bubble:' + TYPES[p.type].prod + (p.buf >= G.bufCap(p.type, p.lv) - .01 ? ':full' : '');
  return '';
}
const v3 = new THREE.Vector3();
function project(pos){ v3.copy(pos).project(camera); return {x: (v3.x + 1) / 2 * innerWidth, y: (1 - v3.y) / 2 * innerHeight, on: v3.z < 1 && v3.z > -1}; }
let ovTick = 0;
function updateOverlays(dt){
  ovTick -= dt; const refresh = ovTick <= 0; if (refresh) ovTick = .15;
  for (const id of ALL_PLOTS){
    const o = ovs[id], p = state.plots[id];
    if (refresh){
      const k = ovKey(id);
      if (k !== o.key){
        o.key = k;
        if (!k) o.el.innerHTML = '';
        else if (k === 'plus') o.el.innerHTML = `<button class="plus" data-id="${id}" aria-label="Construire"></button>`;
        else if (k === 'timer') o.el.innerHTML = `<div class="timer" data-id="${id}"><span class="hammer"></span><b></b><i><s></s></i></div>`;
        else { const [, res, full] = k.split(':'); o.el.innerHTML = `<button class="bubble ${full ? 'full' : ''}" data-id="${id}"><img src="${ICON[res]}" alt=""><b></b></button>`; }
      }
      if (k === 'timer'){ const total = G.timeOf(p.type, p.upTo) * 1000, left = p.upEnd - Date.now(); o.el.querySelector('b').textContent = fmtTime(left / 1000); o.el.querySelector('s').style.width = Math.min(100, (1 - left / total) * 100) + '%'; }
      else if (k.startsWith('bubble')) o.el.querySelector('b').textContent = fmt(p.buf);
    }
    if (!o.key){ o.el.style.display = 'none'; continue; }
    const base = plotPos(id); base.y += o.key === 'plus' ? .6 : views[id].top + .2;
    const s = project(base);
    o.el.style.display = s.on && s.y > 150 && s.y < innerHeight - 40 ? '' : 'none';
    o.el.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-100%)`;
  }
  for (let k = 1; k < 4; k++){
    const d = locks[k];
    if (R.zoneOpen(k)){ d.style.display = 'none'; continue; }
    const s = project(new THREE.Vector3(0, zoneY(k) + 2, zoneZ(k)));
    d.style.display = s.on && s.y > 140 ? '' : 'none';
    d.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-50%)`;
  }
}

/* =====================================================================
   CAMÉRA & CONTRÔLES
   ===================================================================== */
const cam = {x: 0, z: 4, dist: 42, tx: 0, tz: 4, tdist: 42, yaw: 0, tyaw: 0};
const homeDist = () => innerWidth / innerHeight < .7 ? 38 : 27;
const pointers = new Map(); let dragDist = 0, pinch0 = 0, dist0 = 0, introMode = true;
canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, {x: e.clientX, y: e.clientY}); dragDist = 0; if (pointers.size === 2){ const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = cam.tdist; } });
canvas.addEventListener('pointermove', e => {
  const prev = pointers.get(e.pointerId); if (!prev || introMode) return;
  const dx = e.clientX - prev.x, dy = e.clientY - prev.y; prev.x = e.clientX; prev.y = e.clientY;
  if (pointers.size === 2){ const [a, b] = [...pointers.values()]; cam.tdist = THREE.MathUtils.clamp(dist0 * pinch0 / Math.hypot(a.x - b.x, a.y - b.y), 16, 56); dragDist = 99; return; }
  dragDist += Math.abs(dx) + Math.abs(dy);
  const f = cam.dist / innerHeight * 1.05;
  cam.tx = THREE.MathUtils.clamp(cam.tx - dx * f, -10, 10);
  cam.tz = THREE.MathUtils.clamp(cam.tz - dy * f * 1.5, zoneZ(3) - 4, 9);
  cam.x = cam.tx; cam.z = cam.tz;
});
const endPtr = e => { const had = pointers.delete(e.pointerId); if (had && !pointers.size && dragDist < 10 && e.type === 'pointerup' && !introMode) tap(e.clientX, e.clientY); };
canvas.addEventListener('pointerup', endPtr); canvas.addEventListener('pointercancel', endPtr);
canvas.addEventListener('wheel', e => { e.preventDefault(); cam.tdist = THREE.MathUtils.clamp(cam.tdist * (1 + e.deltaY * .001), 16, 56); }, {passive: false});
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tap(x, y){
  ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  if (santa){ const hit = ray.intersectObject(santa.root, true)[0]; if (hit){ santa.path = []; santa.ch.play('Interact'); santa.wait = 2.5; sfx.bells(); return; } }
  const hit = ray.intersectObjects(pickables, true).find(h => h.object.visible);
  let id = null; for (let o = hit && hit.object; o; o = o.parent) if (o.userData.plot){ id = o.userData.plot; break; }
  if (!id){ closeSheet(); return; }
  const k = +id[0];
  if (!R.zoneOpen(k)){ sfx.err(); toast(`Maison du Père Noël niveau ${G.ZONES[k].hq} requise`); return; }
  const p = state.plots[id];
  if (p && R.ready(p) && sel !== id){ collect(id, ovs[id].el.firstElementChild); return; }
  sfx.tap(); openSheet(id);
}
function resize(){ renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < .7 ? 45 : 32; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

/* =====================================================================
   BOUCLE
   ===================================================================== */
{
  const now = Date.now(), away = Math.min(8 * 3600, (now - (state.t || now)) / 1000);
  offline = true; simulate(away, now); offline = false;
  if (saved && away > 60) setTimeout(() => toast(`Les lutins ont travaillé pendant ton absence (${fmtTime(away)})`), 1500);
}
for (const id of ALL_PLOTS) syncPlot(id);
makeSanta(); syncElves();

const clock = new THREE.Clock(); let last = Date.now(), smokeT = 0, saveT = 0, sheetT = 0, t = 0;
const focus = new THREE.Vector3();
function frame(){
  requestAnimationFrame(frame);
  const now = Date.now(), sdt = Math.min(8 * 3600, (now - last) / 1000); last = now;
  const dt = Math.min(.05, clock.getDelta()); t += dt;
  simulate(sdt, now);
  for (const id of ALL_PLOTS) syncPlot(id);
  syncElves();

  if (introMode){ cam.tyaw = Math.sin(t * .15) * .35; }
  cam.x += (cam.tx - cam.x) * Math.min(1, dt * 6); cam.z += (cam.tz - cam.z) * Math.min(1, dt * 6); cam.dist += (cam.tdist - cam.dist) * Math.min(1, dt * 6); cam.yaw += (cam.tyaw - cam.yaw) * Math.min(1, dt * 3);
  const gy = groundY(0, cam.z - 3) * .9;
  focus.set(cam.x, gy, cam.z - 3);
  camera.position.set(cam.x + Math.sin(cam.yaw) * cam.dist * .62, gy + cam.dist * .82, cam.z - 3 + Math.cos(cam.yaw) * cam.dist * .62);
  camera.lookAt(focus);
  world.update(t, dt, focus, R.openZones());

  smokeT -= dt; const doPuff = smokeT <= 0; if (doPuff) smokeT = .4;
  for (const id of ALL_PLOTS){
    const v = views[id]; if (!v.inner) continue;
    for (const a of v.anim) a(t, dt);
    if (v.pop < 1){ v.pop = Math.min(1, v.pop + dt / .8); const f = 1 - .5 * Math.exp(-5 * v.pop) * Math.cos(12 * v.pop); v.inner.scale.set(1 + (1 - f) * .3, f, 1 + (1 - f) * .3); }
    if (doPuff && v.smoke.length && !state.plots[id]?.upEnd) for (const s of v.smoke) if (Math.random() < .75) puff(v.holder.position.clone().add(s));
  }
  for (const o of smokePool){ if (o.life <= 0) continue; o.life -= dt * .4; o.s.position.y += dt * .8; o.s.position.x += o.vx * dt; o.s.scale.setScalar(.25 + (1 - o.life) * .9); o.s.material.opacity = Math.min(1, o.life * 1.4) * .75; if (o.life <= 0) o.s.visible = false; }
  for (const o of sparks){ if (o.life <= 0) continue; o.life -= dt * .9; o.v.y -= 10 * dt; o.s.position.addScaledVector(o.v, dt); o.s.material.rotation += dt * 6; o.s.material.opacity = Math.min(1, o.life * 2); if (o.life <= 0) o.s.visible = false; }

  updateCharacters(dt);

  if (state.delivery){
    const d = state.delivery, k = (now - d.start) / (d.end - d.start), up = Math.min(1, k * 7, (1 - k) * 7);
    const a = k * Math.PI * 4, hp = plotPos(HQ_ID).add(new THREE.Vector3(2.4, 0, 2.6));
    const px = cam.x + Math.sin(a) * 9, pz = cam.z - 6 + Math.cos(a) * 7;
    sleigh.visible = true;
    sleigh.position.set(THREE.MathUtils.lerp(hp.x, px, up), THREE.MathUtils.lerp(hp.y, gy + 7.5 + Math.sin(a * 3) * .7, up), THREE.MathUtils.lerp(hp.z, pz, up));
    sleigh.rotation.set(0, a + Math.PI, Math.sin(a * 2) * .12 * up);
    sleigh.children.forEach((c, i) => { if (c.name === 'rd') c.position.y = Math.abs(Math.sin(t * 8 + i)) * .12; });
    if (Math.random() < .6) burst(sleigh.position.clone().add(new THREE.Vector3(0, .3, 0)), 1);
  } else sleigh.visible = false;

  renderer.render(scene, camera);
  updateOverlays(dt);
  renderHud();
  sheetT -= dt; if (sel && sheetT <= 0){ sheetT = .25; renderSheet(); }
  saveT -= dt; if (saveT <= 0){ saveT = 5; save(); }
}
frame();
addEventListener('visibilitychange', () => { if (document.hidden) save(); });
addEventListener('pagehide', save);

/* ---------- écran titre ---------- */
if (saved){ $('#play').textContent = 'Continuer'; $('#reset').hidden = false; }
$('#play').addEventListener('click', () => {
  introMode = false; cam.tyaw = 0; cam.tz = 3; cam.tdist = homeDist();
  $('#intro').classList.add('hide'); document.body.classList.add('playing'); sfx.bells();
  setTimeout(() => $('#intro').remove(), 700);
});
let resetArmed = false;
$('#reset').addEventListener('click', () => {
  if (!resetArmed){ resetArmed = true; $('#reset').textContent = 'Toucher encore pour effacer la partie'; return; }
  G.clearSave(); state = G.newState();
  for (const id of ALL_PLOTS){ views[id].sig = 'x'; views[id].ready = false; syncPlot(id); }
  makeSanta(); $('#reset').hidden = true; $('#play').textContent = 'Jouer';
});

// accès debug pour les tests automatisés
window.__game = {get state(){ return state; }, set state(s){ state = s; }, cam, views};
