// Le Village du Pôle — boucle principale, scène, personnages, interactions et interface.
import * as THREE from 'three';
import {loadAssets, prop, character, santaLook, elfLook} from './assets.js';
import {createWorld, groundY, plotPos, ALL_PLOTS, HQ_ID, zoneZ, zoneY, LANE_X, NZ, radialTexture, blobTexture} from './world.js';
import {createPost} from './post.js';
import {buildModel, scaffold, constructionSite} from './buildings.js';
import {openMinigame, GAMES} from './minigames.js';
import {createNet} from './net.js';
import {installFeatures} from './features.js';
import {plotBase} from './buildings.js';
import * as G from './game.js';

const $ = s => document.querySelector(s);
const BASE = new URL('../assets/', import.meta.url).href;
const {TYPES, RES, TOYS, RARITY, SKINS} = G;

/* =====================================================================
   RENDU
   ===================================================================== */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: false, powerPreference: 'high-performance'});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
const camera = new THREE.PerspectiveCamera(32, 1, .5, 280);
let QUALITY = (() => { try { return localStorage.getItem('vdp-quality') || 'auto'; } catch(e){ return 'auto'; } })();

await loadAssets(BASE, p => { $('#loadbar i').style.width = Math.round(p * 100) + '%'; });
$('#loading').hidden = true; $('#play').hidden = false;

const world = createWorld(renderer);
const scene = world.scene;
const post = createPost(renderer, scene, camera);
const blobMat = new THREE.MeshBasicMaterial({map: blobTexture(), transparent: true, depthWrite: false});
const blobGeo = new THREE.PlaneGeometry(5.2, 5.2).rotateX(-Math.PI / 2);

/* =====================================================================
   ÉTAT
   ===================================================================== */
const saved = G.loadState();
let state = saved || G.newState();
const R = G.rules(() => state);
const net = createNet(() => state);
const skinOf = cat => SKINS[cat][state.skins[cat]] || null;

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
function coinStack(){
  const g = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({color: '#ffc531', metalness: .55, roughness: .3});
  const rim = new THREE.MeshStandardMaterial({color: '#e09a12', metalness: .5, roughness: .35});
  const face = new THREE.CylinderGeometry(.5, .5, .14, 32), edge = new THREE.TorusGeometry(.5, .05, 8, 32);
  const coin = () => { const c = new THREE.Group(); c.add(new THREE.Mesh(face, gold)); const e = new THREE.Mesh(edge, rim); e.rotation.x = Math.PI / 2; c.add(e); return c; };
  [[0, 0, 0], [.08, .15, -.05], [-.05, .3, .04]].forEach(([x, y, z]) => { const c = coin(); c.position.set(x, y, z); g.add(c); });
  const top = coin(); const st = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .03, 5), rim); st.position.y = .08; top.add(st);
  top.position.set(.35, .35, .35); top.rotation.set(1.1, 0, -.3); g.add(top);
  return g;
}
const letterGeo = new THREE.BoxGeometry(.9, .6, .05);
function envelope(){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(letterGeo, new THREE.MeshStandardMaterial({color: '#fffaf0', roughness: .7})));
  const flap = new THREE.Mesh(new THREE.ConeGeometry(.52, .3, 4, 1), new THREE.MeshStandardMaterial({color: '#f1e6cf', roughness: .7}));
  flap.rotation.set(Math.PI / 2, Math.PI / 4, 0); flap.scale.set(1, 1, .06); flap.position.set(0, .12, .04); g.add(flap);
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .04, 16), new THREE.MeshStandardMaterial({color: '#e0243a', roughness: .4}));
  seal.rotation.x = Math.PI / 2; seal.position.z = .06; g.add(seal);
  g.rotation.set(-.25, .4, .15);
  return g;
}
function goldSnowman(){
  const s = prop('snowman_A');
  const m = new THREE.MeshStandardMaterial({color: '#ffcf3a', metalness: .6, roughness: .3});
  s.traverse(o => { if (o.isMesh) o.material = m; });
  return s;
}
function charIcon(kind, look, opts = {}){
  const c = character(kind, look, opts); c.mixer.update(.6);
  return renderIcon(c.root, {size: 160, yaw: .25, pitch: .15, pad: 1.05});
}
const ICON = {
  coins: renderIcon(coinStack(), {pitch: .5, yaw: .3}),
  wood: renderIcon(prop('Wood_Log_Stack'), {pitch: .5}),
  cookies: renderIcon(prop('cookie'), {pitch: .9}),
  fabric: renderIcon(prop('Textiles_Stack_Large_Colored'), {pitch: .5}),
  sleigh: renderIcon((() => { const g = new THREE.Group(); g.add(prop('sled-long', {s: 1.2})); g.add(prop('present_A_red', {s: .45, y: .3, z: -.2})); g.add(prop('present_B_green', {s: .35, y: .3, z: .3, ry: .5})); g.add(prop('reindeer', {z: 1.4, s: .9})); return g; })(), {size: 200, yaw: 1.1, pitch: .35}),
  letter: renderIcon(envelope(), {pitch: .2, yaw: 0, pad: 1.1}),
  games: renderIcon((() => { const g = new THREE.Group(); g.add(prop('snowball_pile', {s: .8})); g.add(prop('snowman_B', {s: .45, x: .7, z: -.3})); return g; })(), {pitch: .45}),
  missions: renderIcon(prop('Gems_Chest'), {pitch: .45}),
  advent: renderIcon(prop('present_sphere_A_red'), {pitch: .35}),
  gift: renderIcon(prop('present_A_red'), {pitch: .45}),
  deer: renderIcon(prop('reindeer'), {yaw: .5, pitch: .2}),
  gold: renderIcon(goldSnowman(), {pitch: .2, yaw: .2}),
  elf: charIcon('elf', elfLook(1)),
};
for (const [k, T] of Object.entries(TOYS)) ICON['toy_' + k] = renderIcon(prop(T.model), {pitch: .45, yaw: .7});
function starMesh(){
  const sh = new THREE.Shape(); for (let i = 0; i < 10; i++){ const r = i % 2 ? .42 : 1, a = i * Math.PI / 5 + Math.PI / 2; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, {depth: .3, bevelEnabled: true, bevelSize: .08, bevelThickness: .1, bevelSegments: 2}), new THREE.MeshStandardMaterial({color: '#ffd23f', emissive: '#ff9d00', emissiveIntensity: .25, metalness: .1, roughness: .35}));
  m.rotation.y = -.35; return m;
}
function trophy(){
  const g = new THREE.Group(), gold = new THREE.MeshStandardMaterial({color: '#ffc531', metalness: .6, roughness: .3});
  const pts = [[0, 0], [.45, 0], [.45, .08], [.12, .2], [.1, .55], [.25, .65], [.5, 1.2], [.52, 1.3], [0, 1.3]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 24), gold));
  for (const sx of [-1, 1]){ const h = new THREE.Mesh(new THREE.TorusGeometry(.22, .05, 8, 16, Math.PI), gold); h.position.set(sx * .5, 1.0, 0); h.rotation.z = sx > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(h); }
  return g;
}
const presentsPile = () => { const g = new THREE.Group(); [['present_A_red', 0, 0], ['present_D_blue', .5, -.2], ['present_C_yellow', -.45, -.1], ['present_B_green', .1, -.5]].forEach(([n, x, z], i) => g.add(prop(n, {x, z, s: .55, ry: i}))); return g; };
Object.assign(ICON, {
  event: renderIcon(prop('bell_decorated'), {pitch: .25}),
  trophy: renderIcon(trophy(), {pitch: .15, yaw: 0}),
  guild: renderIcon(prop('banner-red', {s: 1}), {yaw: 1.2, pitch: .1}),
  shop: renderIcon(starMesh(), {pitch: .1, yaw: 0}),
  login: renderIcon(prop('wreath'), {pitch: .1, yaw: 0}),
  hotte: renderIcon(presentsPile(), {pitch: .45}),
  paper_kraft: renderIcon(prop('present-a-cube'), {pitch: .45}),
  paper_ribbon: renderIcon(prop('present-b-round'), {pitch: .45}),
  paper_gold: renderIcon(prop('present_C_yellow'), {pitch: .45}),
  em_star: null, em_deer: ICON.deer, em_tree: renderIcon(prop('tree-decorated-snow'), {pitch: .2}), em_gift: ICON.gift, em_bell: null,
  em_cookie: ICON.cookies, em_gear: renderIcon(prop('Parts_Cog'), {pitch: .6}), em_leaf: renderIcon(prop('mistletoe_A'), {pitch: .3}),
});
ICON.em_star = ICON.shop; ICON.em_bell = ICON.event;
RARITY.forEach((r, i) => { ICON['present' + i] = renderIcon(prop(r.present), {pitch: .45}); });
const skinIcons = new Map();
function skinIcon(cat, k){
  const key = cat + k; if (skinIcons.has(key)) return skinIcons.get(key);
  const sk = SKINS[cat][k]; let url;
  if (cat === 'santa'){ const c = character('santa', santaLook(k === 'classic' ? 10 : 9, k === 'classic' ? null : sk), {hat: true}); c.mixer.update(.6); url = renderIcon(c.root, {size: 160, yaw: .3, pitch: .12, pad: 1.05}); }
  else if (cat === 'elves'){ const g = new THREE.Group(); sk.hoods.slice(0, 2).forEach((_, i) => { const c = character('elf', elfLook(i, sk)); c.mixer.update(.6 + i * .3); c.root.position.x = (i - .5) * 1.4 * (sk.hoods.length > 1 ? 1 : 0); g.add(c.root); }); url = renderIcon(g, {size: 160, yaw: .2, pitch: .12, pad: 1.05}); }
  else { const g = new THREE.Group(); g.add(plotBase(k === 'classic' ? 2 : 1, k === 'classic' ? null : sk)); g.add(prop('present_A_red', {y: .34, s: .9})); url = renderIcon(g, {size: 160, pitch: .55}); }
  skinIcons.set(key, url); return url;
}
const thumbCache = new Map();
function thumb(type, lv){
  const k = type + lv + state.skins.bases; if (thumbCache.has(k)) return thumbCache.get(k);
  const m = buildModel(type, lv, skinOf('bases')); m.anim.forEach(a => a(2, .1));
  const url = renderIcon(m.group, {size: 220, yaw: .55, pitch: .5, pad: 1.05});
  thumbCache.set(k, url); return url;
}
function portrait(lv){
  const c = character('santa', santaLook(lv, skinOf('santa')), {hat: lv >= 6}); c.mixer.update(.6);
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
const pickables = [], views = {};
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
const zoneOf = id => +id.split('-')[0];
function syncPlot(id){
  const v = views[id], p = state.plots[id];
  v.marker.visible = !p && R.zoneOpen(zoneOf(id));
  const sig = p ? `${p.type}:${p.lv}:${p.upEnd ? 1 : 0}:${state.skins.bases}` : '';
  if (sig === v.sig) return;
  const prevLv = v.lv;
  v.sig = sig; v.holder.clear(); v.anim = []; v.smoke = []; v.inner = null;
  if (!p){ v.lv = 0; return; }
  if (p.lv > 0){ const m = buildModel(p.type, p.lv, skinOf('bases')); v.holder.add(m.group); v.inner = m.group; v.anim = m.anim; v.smoke = m.smoke; v.top = m.top; }
  else { const c = constructionSite(skinOf('bases')); v.holder.add(c); v.inner = c; v.top = 2.4; }
  if (p.upEnd) v.holder.add(scaffold(Math.max(2.2, v.top - .4)));
  const blob = new THREE.Mesh(blobGeo, blobMat); blob.position.y = .02; blob.renderOrder = 1; blob.userData.noAO = true; v.holder.add(blob);
  if (p.lv > prevLv && v.ready){ v.pop = 0; burst(v.holder.position.clone().add(new THREE.Vector3(0, 1.6, 0)), 34); }
  v.lv = p.lv; v.ready = true;
}

/* ---------- particules ---------- */
const smokeTex = radialTexture('rgba(255,255,255,.95)', 'rgba(235,240,250,0)');
const smokePool = Array.from({length: 50}, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({map: smokeTex, transparent: true, depthWrite: false, opacity: 0})); s.visible = false; scene.add(s); return {s, life: 0, vx: 0}; });
function puff(p){ const o = smokePool.find(o => o.life <= 0); if (!o) return; o.life = 1; o.s.position.copy(p); o.s.visible = true; o.vx = .15 + Math.random() * .2; }
const starTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.translate(32, 32); x.fillStyle = '#ffd84a'; x.beginPath(); for (let i = 0; i < 10; i++){ const r = i % 2 ? 11 : 28, a = i * Math.PI / 5 - Math.PI / 2; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.shadowColor = '#fff6c0'; x.shadowBlur = 8; x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const sparks = Array.from({length: 80}, (_, i) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({map: i % 4 ? starTex : smokeTex, transparent: true, depthWrite: false, color: i % 4 ? '#ffffff' : '#fff2b0'})); s.visible = false; scene.add(s); return {s, life: 0, v: new THREE.Vector3()}; });
function burst(p, n = 24){ let k = 0; for (const o of sparks){ if (o.life > 0) continue; o.life = 1; o.s.visible = true; o.s.position.copy(p); o.v.set((Math.random() - .5) * 7, 4 + Math.random() * 5, (Math.random() - .5) * 7); o.s.scale.setScalar(.3 + Math.random() * .3); if (++k >= n) break; } }

/* =====================================================================
   PERSONNAGES
   ===================================================================== */
function randomSpot(){
  const k = Math.floor(Math.random() * R.openZones());
  return new THREE.Vector3((Math.random() - .5) * 14.5, 0, zoneZ(k) + (Math.random() - .5) * .7);
}
function route(from, to){
  const pts = [];
  if (Math.abs(from.z - to.z) > 1.2){
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
        let da = Math.atan2(dx, dz) - this.root.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); this.root.rotation.y += da * Math.min(1, dt * 10);
        this.ch.play('Walking_A');
      }
    } else this.wait -= dt;
    pos.y += (groundY(pos.x, pos.z) - pos.y) * Math.min(1, dt * 14);
  }
}
let santa = null;
function makeSanta(){
  const lv = G.looksOf(state.pl);
  const pos = santa ? santa.root.position.clone() : plotPos(HQ_ID).add(new THREE.Vector3(1.2, 0, 2.3));
  if (santa) scene.remove(santa.root);
  santa = new Walker(character('santa', santaLook(lv, skinOf('santa')), {hat: lv >= 6}), .6 + lv * .012, 1.1);
  santa.root.position.copy(pos); santa.lv = lv + state.skins.santa;
  $('#avatar img').src = portrait(lv);
}
const elves = [];
function syncElves(){
  const want = Math.min(9, 2 + Object.values(state.plots).filter(p => p.lv > 0).length);
  while (elves.length < want){
    const e = new Walker(character('elf', elfLook(elves.length, skinOf('elves'))), .42, 1.5 + Math.random() * .5);
    const s = randomSpot(); e.root.position.set(s.x, groundY(s.x, s.z), s.z); elves.push(e);
  }
}
function updateCharacters(dt){
  const sites = Object.keys(state.plots).filter(id => state.plots[id].upEnd);
  for (const e of elves) if (e.site && !sites.includes(e.site)){ e.site = null; e.wait = 0; e.task = null; }
  for (const id of sites){
    if (elves.some(e => e.site === id)) continue;
    const free = elves.find(e => !e.site); if (!free) break;
    free.site = id; const p = plotPos(id); free.goTo(new THREE.Vector3(p.x + .9, 0, p.z + 2.15), 'work');
  }
  for (const e of elves){
    if (!e.site && !e.path.length && e.wait <= 0) e.goTo(randomSpot());
    e.update(dt);
    if (e.site && !e.path.length){ const p = plotPos(e.site); e.root.rotation.y = Math.atan2(p.x - e.root.position.x, p.z - e.root.position.z); }
  }
  if (santa){
    if (santa.lv !== G.looksOf(state.pl) + state.skins.santa) makeSanta();
    if (!santa.path.length && santa.wait <= 0){
      const h = plotPos(HQ_ID);
      santa.goTo(Math.random() < .6 ? new THREE.Vector3(h.x + (Math.random() - .5) * 5, 0, h.z + 2.75 + (Math.random() - .5) * .5) : randomSpot(), 'face');
    }
    santa.update(dt);
  }
}

/* =====================================================================
   SIMULATION & ÉCONOMIE
   ===================================================================== */
let offline = false;
const fmt = n => { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n); };
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); if (s >= 172800) return `${Math.floor(s / 86400)} j ${Math.floor(s % 86400 / 3600)} h`; const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60; return h ? `${h}h ${String(m).padStart(2, '0')}m` : m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`; };

function track(kind, n = 1){
  state.stats[kind] = (state.stats[kind] || 0) + n;
  const d = R.ensureDaily();
  for (const m of d.list) if (m.k === kind && !m.claimed) m.p = Math.min(m.n, m.p + n);
  F.onTrack(kind, n);
}
function gainXp(n){
  if (!n) return;
  state.xp += Math.round(n); F.week().xp += Math.round(n); net.push();
  let up = false;
  while (state.xp >= G.xpNeed(state.pl)){ state.xp -= G.xpNeed(state.pl); state.pl++; up = true; }
  if (up && !offline) levelUp();
}
function gain(rw, el){
  const cap = R.storeCap();
  for (const k in rw){
    if (k in RES){ state.res[k] = Math.min(Math.max(cap, state.res[k]), state.res[k] + rw[k]); if (k === 'coins') track('coins', rw[k]); }
    else if (k === 'stars') state.stars += rw[k];
    else if (k === 'xp') gainXp(rw[k]);
    else if (k === 'tickets') state.tickets += rw[k];
    else if (k === 'skin'){ if (!state.owned.includes(rw[k])) state.owned.push(rw[k]); }
    else if (k === 'pass') state.pass = Math.max(Date.now(), state.pass || 0) + rw[k] * 86400000;
    if (el && !offline && (k in RES || k === 'stars' || k === 'xp')) flyIcons(k, rw[k], el);
  }
}
function pay(c){ for (const k in c){ if (k === 'stars') state.stars -= c[k]; else state.res[k] -= c[k]; } }

function simulate(dt, now){
  for (const id in state.plots){
    const p = state.plots[id];
    if (p.upEnd && now >= p.upEnd){
      p.lv = p.upTo; delete p.upEnd; delete p.upTo;
      gainXp(G.buildXp(p.lv));
      if (!offline){ sfx.level(); celebrate(id, p); }
    }
    const T = TYPES[p.type];
    if (T.prod && p.lv > 0 && !p.upEnd) p.buf = Math.min(G.bufCap(p.type, p.lv), (p.buf || 0) + G.rate(p.type, p.lv) / 60 * dt);
    if (T.craft){
      p.queue = p.queue || []; p.done = p.done || [];
      while (p.queue.length && p.queue[0].end <= now){ const q = p.queue.shift(); p.done.push(T.craft === 'toy' ? q.toy : {toy: q.toy, r: q.r}); }
    }
  }
  F.tickEnergy(now);
  // tickets de jeu
  const tm = R.tMax();
  if (state.tickets >= tm) state.ticketT = now;
  else while (state.tickets < tm && now - state.ticketT >= G.TICKET_MS){ state.tickets++; state.ticketT += G.TICKET_MS; }
  // lettres
  const slots = R.letterSlots();
  if (R.pl() >= 2) while (state.letters.length < slots) state.letters.push({...R.makeLetter(), wait: offline ? 0 : now + 1000});
}

function collect(id, el){
  const p = state.plots[id], T = TYPES[p.type];
  if (T.craft === 'wrap'){
    if (!p.done?.length) return false;
    const items = p.done.map(it => { const k = G.giftKey(it.toy, it.r); const isNew = !state.album[k]; state.gifts[k] = (state.gifts[k] || 0) + 1; state.album[k] = true; return {...it, isNew}; });
    p.done = []; track('wrapped', items.length); gainXp(items.length * 6); F.reveal(items); save();
    return true;
  }
  if (T.craft){
    if (!p.done?.length) return false;
    const got = {}; for (const k of p.done){ state.toys[k] = (state.toys[k] || 0) + 1; got[k] = (got[k] || 0) + 1; }
    const xp = p.done.reduce((a, k) => a + TOYS[k].xp, 0);
    track('crafted', p.done.length); p.done = [];
    sfx.collect(); for (const k in got) flyToy(k, got[k], el); gainXp(xp); flyIcons('xp', xp, el);
    return true;
  }
  if (!T.prod) return false;
  const have = Math.floor(p.buf || 0); if (have < 1) return false;
  const take = Math.min(have, Math.max(0, R.storeCap() - state.res[T.prod]));
  if (take <= 0){ sfx.err(); toast('Stock plein ! Améliore la Maison ou construis un Entrepôt.'); return true; }
  state.res[T.prod] += take; p.buf -= take;
  if (T.prod === 'wood') track('wood', take);
  if (T.prod === 'coins') track('coins', take);
  const xp = Math.max(1, Math.round(take / 12));
  sfx.collect(); flyIcons(T.prod, take, el); gainXp(xp);
  return true;
}
function upgrade(id){
  const why = R.upgradeBlock(id); if (why){ sfx.err(); toast(why); return; }
  const p = state.plots[id], to = p.lv + 1;
  pay(G.costOf(p.type, to)); collect(id); p.upTo = to; p.upEnd = Date.now() + G.timeOf(p.type, to) * 1000; track('builds'); sfx.build(); save();
}
function build(id, t){
  const why = R.buildBlock(t); if (why){ sfx.err(); toast(why); return; }
  pay(G.costOf(t, 1)); state.plots[id] = {type: t, lv: 0, buf: 0, upTo: 1, upEnd: Date.now() + G.timeOf(t, 1) * 1000};
  if (TYPES[t].craft){ state.plots[id].queue = []; state.plots[id].done = []; }
  track('builds'); sfx.build(); save(); renderSheet();
}
const speedStars = left => Math.max(1, Math.ceil(left / 1000 / 120));
function speedUp(id){
  const p = state.plots[id]; if (!p.upEnd) return;
  const c = speedStars(p.upEnd - Date.now());
  if (state.stars < c){ sfx.err(); toast("Pas assez d'étoiles. Gagne-en avec les lettres, les mini-jeux et le calendrier."); return; }
  state.stars -= c; p.upEnd = Date.now();
}
function craft(id, toy){
  const p = state.plots[id], T = TOYS[toy];
  if (!R.toyUnlocked(toy)){ sfx.err(); toast(`Niveau joueur ${T.pl} requis`); return; }
  if (p.upEnd && p.lv === 0) return;
  const busy = p.queue.length + p.done.length;
  if (busy >= G.slotsOf(p.lv)){ sfx.err(); toast("File pleine : récupère les jouets ou améliore l'Atelier"); return; }
  if (!R.canAfford(T.cost)){ sfx.err(); toast('Ressources insuffisantes'); return; }
  pay(T.cost);
  const start = Math.max(Date.now(), p.queue.length ? p.queue[p.queue.length - 1].end : 0);
  p.queue.push({toy, start, end: start + T.time * 1000 / G.craftSpeed(p.lv)});
  sfx.tap(); save();
}
function answerLetter(i, el){
  const L = state.letters[i]; if (!L || L.wait > Date.now()) return;
  if (!R.canFill(L)){ sfx.err(); toast("Il manque des jouets : fabrique-les à l'Atelier"); return; }
  for (const [k, q] of L.lines) state.toys[k] -= q;
  const rw = {coins: L.coins, xp: L.xp}; if (L.stars) rw.stars = L.stars;
  gain(rw, el); track('letters'); sfx.bells();
  state.letters[i] = {...R.makeLetter(), wait: Date.now() + 20000};
  save();
}
function skipLetter(i){ state.letters[i] = {...R.makeLetter(), wait: Date.now() + 90000}; sfx.tap(); }
function save(){ G.saveState(state); }

/* =====================================================================
   INTERFACE
   ===================================================================== */
const ic = k => k === 'stars' ? '<i class="i star"></i>' : k === 'xp' ? '<i class="i xp">XP</i>' : k === 'tickets' ? '<i class="i ticket"></i>' : `<img class="i" src="${ICON[k]}" alt="">`;
const chips = c => Object.keys(c).map(k => `<span class="chip ${k in RES && state.res[k] < c[k] ? 'bad' : ''}">${ic(k)}${fmt(c[k])}</span>`).join('');
const rwChips = rw => Object.keys(rw).filter(k => rw[k] && k !== 'skin' && k !== 'pass').map(k => `<span class="chip">${ic(k)}${fmt(rw[k])}</span>`).join('');

function modal(html, onAction, cls = ''){
  const m = $('#modal'); m.className = cls; m.querySelector('.mcard').innerHTML = html; m.hidden = false;
  const close = () => { m.hidden = true; m.onclick = null; };
  m.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b){ if (e.target === m) close(); return; }
    const a = b.dataset.m; let keep;
    if (a !== 'close' && onAction) keep = onAction(a, b);
    if (keep !== 'keep') close();
  };
}
function applySkins(){
  thumbCache.clear(); for (const id of ALL_PLOTS) syncPlot(id);
  makeSanta(); for (const e of elves) scene.remove(e.root); elves.length = 0; syncElves();
}
const F = installFeatures({
  get state(){ return state; }, R, ICON, ic, chips, rwChips, fmt, fmtTime, net,
  gain, pay, save, toast, sfx, track, playGame, modal, skinIcon, applySkins,
  openPanel: n => openPanel(n), portraitNow: () => portrait(G.looksOf(state.pl)), sel: () => sel,
  rerender: () => { sheetHtml = ''; renderSheet(); },
});
net.onChange(() => { if (['ranking', 'guild', 'hotte'].includes(sel)){ sheetHtml = ''; renderSheet(); } });

$('#res').innerHTML = Object.keys(RES).map(k => `<div class="res" id="r-${k}"><img src="${ICON[k]}" alt="${RES[k].name}"><b class="num">0</b><span class="cap"><i></i></span></div>`).join('');
for (const [id, k] of [['d-letters', 'letter'], ['d-games', 'games'], ['d-hotte', 'hotte'], ['d-guild', 'guild'], ['d-shop', 'shop'], ['d-missions', 'missions'], ['d-advent', 'advent'], ['s-login', 'login'], ['s-event', 'event'], ['s-rank', 'trophy']]) $(`#${id} img`).src = ICON[k];
$('#s-wardrobe img').src = skinIcon('santa', 'royal');
$('#stars').addEventListener('click', () => { sfx.tap(); openPanel('shop'); });
$('#avatar').addEventListener('click', () => { sfx.tap(); openPanel('profile'); });

function renderHud(){
  const cap = R.storeCap();
  for (const k in RES){ const el = $('#r-' + k); el.querySelector('b').textContent = fmt(state.res[k]); el.querySelector('i').style.width = Math.min(100, state.res[k] / cap * 100) + '%'; el.classList.toggle('full', state.res[k] >= cap); }
  $('#rankname').textContent = G.rankOf(state.pl);
  $('#avatar .lv').textContent = state.pl;
  $('#xpbar i').style.width = Math.min(100, state.xp / G.xpNeed(state.pl) * 100) + '%';
  $('#xpbar b').textContent = `${fmt(state.xp)} / ${fmt(G.xpNeed(state.pl))}`;
  $('#builders').textContent = `${R.busyBuilders()}/${R.builders()}`;
  $('#stars b').textContent = fmt(state.stars);
  // dock
  const now = Date.now();
  const ready = state.letters.filter(L => L.wait <= now && R.canFill(L)).length;
  badge('#d-letters', ready || '', R.pl() < 2);
  badge('#d-games', state.tickets || '', R.pl() < 2);
  const d = R.ensureDaily(); const mReady = d.list.filter(m => m.p >= m.n && !m.claimed).length + (d.list.every(m => m.claimed) && !d.bonus ? 1 : 0);
  badge('#d-missions', mReady || '');
  badge('#d-advent', R.adventReady() ? '!' : '');
  badge('#s-login', F.loginReady() ? '!' : '');
  $('#s-login small').textContent = state.login.streak;
  const e = F.ev(); badge('#s-event', e.energy || '', R.pl() < 2);
  const gifts = Object.values(state.gifts).reduce((a, b) => a + b, 0); badge('#d-hotte', gifts || '');
  const g = F.myGuild(); const wk = G.weekKey(); const tc = g ? G.TOUR_TIERS.filter((t, i) => (g.tour || 0) >= t && !(state.guildClaims[wk] || []).includes(i)).length : 0;
  badge('#d-guild', tc || '', R.pl() < G.GUILD_PL);
  badge('#d-shop', state.purchases.starter ? '' : '!');
  // objectif
  const q = R.quest(), qe = $('#quest');
  const done = q.ok(state);
  qe.classList.toggle('done', done);
  $('#qnum').textContent = q.num;
  $('#qtext').textContent = q.t;
  $('#qbtn').hidden = !done;
  $('#qbtn span').innerHTML = Object.keys(q.rw).map(k => `${ic(k)}${fmt(q.rw[k])}`).join(' ');
  if (q.prog && !done){ const [a, b] = q.prog(state); $('#qprog').hidden = false; $('#qprog i').style.width = Math.min(100, a / b * 100) + '%'; } else $('#qprog').hidden = true;
}
function badge(sel, v, locked = false){ const el = $(sel); el.querySelector('.badge').textContent = v; el.querySelector('.badge').hidden = v === '' || locked; el.classList.toggle('locked', locked); }
$('#quest').addEventListener('click', () => {
  const q = R.quest();
  if (q.ok(state)){ gain(q.rw, $('#qbtn')); if (q.goal) state.goal.done = true; else state.quest++; sfx.level(); save(); }
  else { sfx.tap(); toast(q.t); }
});
for (const [id, panel, need] of [['d-letters', 'letters', 2], ['d-games', 'games', 2], ['d-hotte', 'hotte', 1], ['d-guild', 'guild', G.GUILD_PL], ['d-shop', 'shop', 1], ['d-missions', 'missions', 1], ['d-advent', 'advent', 1], ['s-login', 'login', 1], ['s-event', 'event', 2], ['s-rank', 'ranking', 1], ['s-wardrobe', 'wardrobe', 1]])
  $('#' + id).addEventListener('click', () => { if (R.pl() < need){ sfx.err(); toast(`Débloqué au niveau joueur ${need}`); return; } sfx.tap(); openPanel(panel); });
$('#sound').addEventListener('click', () => { soundOn = !soundOn; $('#sound').classList.toggle('muted', !soundOn); });

let toastT;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2800); }
function flyTo(src, targetEl, count, fromEl, cls = ''){
  const r0 = fromEl ? fromEl.getBoundingClientRect() : {left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0};
  const target = targetEl.getBoundingClientRect();
  for (let i = 0; i < count; i++){
    const d = document.createElement(src ? 'img' : 'i'); if (src) d.src = src; d.className = 'fly ' + cls; document.body.appendChild(d);
    const x0 = r0.left + r0.width / 2 - 18 + (Math.random() - .5) * 50, y0 = r0.top + r0.height / 2 - 18 + (Math.random() - .5) * 30;
    d.style.transform = `translate(${x0}px,${y0}px) scale(.4)`;
    setTimeout(() => { d.style.transform = `translate(${x0 + (Math.random() - .5) * 40}px,${y0 - 30}px) scale(1)`; }, 16);
    setTimeout(() => { d.style.transition = 'transform .55s cubic-bezier(.6,-0.2,.7,1), opacity .55s'; d.style.transform = `translate(${target.left}px,${target.top}px) scale(.7)`; }, 260 + i * 60);
    setTimeout(() => { d.remove(); targetEl.classList.remove('pulse'); void targetEl.offsetWidth; targetEl.classList.add('pulse'); }, 820 + i * 60);
  }
}
function flyIcons(key, amount, fromEl){
  const n = Math.min(6, 2 + Math.floor(Math.log2(amount + 1) / 2));
  if (key in RES) flyTo(ICON[key], $('#r-' + key), n, fromEl);
  else if (key === 'stars') flyTo(null, $('#stars'), n, fromEl, 'star');
  else if (key === 'xp') flyTo(null, $('#xpbar'), Math.min(3, n), fromEl, 'xp');
  const r0 = fromEl ? fromEl.getBoundingClientRect() : {left: innerWidth / 2, top: innerHeight / 2, width: 0};
  if (key === 'xp') return;
  const t = document.createElement('div'); t.className = 'plusnum'; t.textContent = `+${fmt(amount)}`; document.body.appendChild(t);
  t.style.left = (r0.left + r0.width / 2) + 'px'; t.style.top = r0.top + 'px'; setTimeout(() => t.remove(), 1000);
}
function flyToy(k, n, fromEl){ flyTo(ICON['toy_' + k], $('#d-letters'), Math.min(4, n), fromEl); }

function showBanner(img, small, big){
  const b = $('#banner'); b.querySelector('img').src = img; b.querySelector('small').textContent = small; b.querySelector('b').textContent = big;
  b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
}
function celebrate(id, p){
  showBanner(thumb(p.type, p.lv), TYPES[p.type].name, p.lv === 1 ? 'Construit !' : `Niveau ${p.lv} !`);
  if (sel === id) renderSheet();
}
function levelUp(){
  const L = state.pl; sfx.bells();
  const news = [];
  for (const [k, T] of Object.entries(TYPES)) if (T.pl === L) news.push(T.name);
  for (const [k, T] of Object.entries(TOYS)) if (T.pl === L) news.push(T.name);
  const z = G.ZONES.findIndex(z => z.pl === L); if (z > 0) news.push(G.ZONES[z].name);
  if (G.looksOf(L) !== G.looksOf(L - 1)) news.push('nouveau rang');
  setTimeout(() => showBanner(portrait(G.looksOf(L)), G.rankOf(L), `Niveau ${L} !`), 300);
  if (news.length) setTimeout(() => toast('Débloqué : ' + news.join(', ')), 2500);
  if (z > 0) setTimeout(() => { cam.tz = zoneZ(z) + 4; }, 2600);
  state.tickets = Math.max(state.tickets, R.tMax());
}

/* ---------- panneau du bas ---------- */
let sel = null, sheetHtml = '';
function openSheet(id){ sel = id; document.body.classList.add('sheet-open'); sheetHtml = ''; renderSheet(); const p = plotPos(id); cam.tx = p.x * .6; cam.tz = p.z + cam.dist * .2; }
function openPanel(name){ sel = name; sheetHtml = ''; document.body.classList.add('sheet-open'); renderSheet(); $('#sheet').scrollTop = 0; }
function closeSheet(){ sel = null; sheetHtml = ''; document.body.classList.remove('sheet-open'); }
function setSheet(html){ if (html !== sheetHtml){ const st = $('#sheet').scrollTop; sheetHtml = html; $('#sheet').innerHTML = html; $('#sheet').scrollTop = st; } patchSheet(); }
const header = (small, title) => `<div class="hd"><div class="tt"><small>${small}</small><h2>${title}</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>`;
function patchSheet(){
  const el = $('#sheet'), now = Date.now();
  for (const n of el.querySelectorAll('[data-until]')){ const left = +n.dataset.until - now; n.textContent = fmtTime(left / 1000); }
  for (const n of el.querySelectorAll('[data-prog]')){ const [a, b] = n.dataset.prog.split(',').map(Number); n.style.width = Math.max(0, Math.min(100, (now - a) / (b - a) * 100)) + '%'; }
  for (const n of el.querySelectorAll('[data-stars]')) n.textContent = speedStars(+n.dataset.stars - now);
  const p = state.plots[sel];
  if (p){ const b = el.querySelector('[data-live="buf"]'); if (b){ b.textContent = fmt(p.buf || 0); el.querySelector('[data-live="collect"]').disabled = (p.buf || 0) < 1; } }
}
const pips = lv => `<span class="pips">${Array.from({length: 10}, (_, i) => `<i class="${i < Math.ceil(lv * 10 / G.MAX_LV) ? 'on' : ''}"></i>`).join('')}<em>Niv. ${lv}/${G.MAX_LV}</em></span>`;
function statRows(p, to){
  const T = TYPES[p.type], rows = [];
  const row = (label, a, b) => rows.push(`<div class="row"><span>${label}</span><b>${a}${b != null && to <= G.MAX_LV ? ` <em>→ ${b}</em>` : ''}</b></div>`);
  if (T.prod){ row(`Production ${ic(T.prod)}`, `${G.rate(p.type, p.lv)}/min`, `${G.rate(p.type, to)}/min`); row('Réserve', fmt(G.bufCap(p.type, p.lv)), fmt(G.bufCap(p.type, to))); }
  if (T.craft){ row('Places dans la file', G.slotsOf(p.lv), G.slotsOf(to)); row('Vitesse des lutins', `×${G.craftSpeed(p.lv).toFixed(2)}`, `×${G.craftSpeed(to).toFixed(2)}`); }
  if (p.type === 'hq'){ row('Stock max', fmt(G.hqCap(p.lv)), fmt(G.hqCap(to))); if (to <= G.MAX_LV) rows.push(`<div class="row"><span>Niveau joueur requis</span><b>${G.hqNeed(to)}</b></div>`); }
  if (p.type === 'storage') row('Bonus de stock', '+' + fmt(G.storageBonus(p.lv)), '+' + fmt(G.storageBonus(to)));
  if (p.type === 'stable'){ row('Gains de la tournée', `×${G.sleighMult(p.lv).toFixed(2)}`, `×${G.sleighMult(to).toFixed(2)}`); row('Tickets de jeu max', G.ticketMax(p.lv), G.ticketMax(to)); }
  return rows.join('');
}
function workshopHtml(p){
  if (p.lv < 1) return '';
  const now = Date.now(), slots = G.slotsOf(p.lv);
  const cells = [];
  for (const k of p.done) cells.push(`<div class="slot ready"><img src="${ICON['toy_' + k]}" alt=""></div>`);
  p.queue.forEach((q, i) => cells.push(`<div class="slot ${i === 0 ? 'run' : ''}"><img src="${ICON['toy_' + q.toy]}" alt="">${i === 0 ? `<span class="sbar"><i data-prog="${q.start},${q.end}"></i></span><small data-until="${q.end}"></small>` : ''}</div>`));
  while (cells.length < slots) cells.push('<div class="slot empty"></div>');
  const recipes = Object.entries(TOYS).map(([k, T]) => {
    const ok = R.toyUnlocked(k);
    return `<button class="recipe ${ok ? '' : 'locked'}" data-a="craft" data-t="${k}"><img src="${ICON['toy_' + k]}" alt=""><b>${T.name}</b>
      ${ok ? `<span class="costs">${chips(T.cost)}</span><span class="meta">${fmtTime(T.time / G.craftSpeed(p.lv))} · en stock : ${state.toys[k] || 0}</span>` : `<span class="why">Niveau ${T.pl}</span>`}</button>`;
  }).join('');
  return `<h3>File de fabrication</h3><div class="slots">${cells.join('')}</div>
    ${p.done.length ? `<button class="btn gold wide" data-a="collect">Récupérer ${p.done.length} jouet${p.done.length > 1 ? 's' : ''}</button>` : ''}
    <h3>Fabriquer</h3><div class="recipes">${recipes}</div>`;
}
function buildingHtml(id){
  const p = state.plots[id], T = TYPES[p.type], to = p.lv + 1;
  let body;
  if (p.upEnd){
    body = `<div class="work"><div class="bar"><i data-prog="${p.upEnd - G.timeOf(p.type, p.upTo) * 1000},${p.upEnd}"></i></div><span>${p.lv === 0 ? 'Construction' : `Amélioration vers le niveau ${p.upTo}`} · <b data-until="${p.upEnd}"></b></span></div>
    <div class="acts"><button class="btn gold" data-a="speed">Terminer · <i class="i star"></i><b data-stars="${p.upEnd}"></b></button></div>`;
  } else {
    const why = R.upgradeBlock(id), c = to <= G.MAX_LV ? G.costOf(p.type, to) : null;
    body = `${c ? `<div class="costs big">${chips(c)}<span class="chip time">${fmtTime(G.timeOf(p.type, to))}</span></div>` : ''}
    ${why && why !== 'Ressources insuffisantes' && c ? `<div class="note">${why}</div>` : ''}
    <div class="acts">${T.prod ? `<button class="btn gold" data-a="collect" data-live="collect">Récolter ${ic(T.prod)}<b data-live="buf"></b></button>` : ''}
    ${c ? `<button class="btn green" data-a="up" ${why ? 'disabled' : ''}>Améliorer</button>` : '<div class="note ok">Niveau maximum !</div>'}</div>`;
  }
  const next = to <= G.MAX_LV && !p.upEnd;
  return `${header(pips(p.lv), T.name)}
  ${T.craft && p.lv > 0 ? (T.craft === 'toy' ? workshopHtml(p) : F.wrapHtml(p)) + '<h3>Bâtiment</h3>' : ''}
  <div class="preview ${next ? 'two' : ''}"><figure><img src="${thumb(p.type, Math.max(1, p.lv))}" alt=""><figcaption>Niv. ${Math.max(1, p.lv)}</figcaption></figure>
  ${next ? `<span class="arrow"></span><figure class="nx"><img src="${thumb(p.type, to)}" alt=""><figcaption>Niv. ${to}</figcaption></figure>` : ''}</div>
  <p>${T.desc}</p><div class="stats">${statRows(p, to)}</div>${body}`;
}
function buildMenuHtml(){
  return `${header('Terrain libre', 'Construire')}<div class="grid">${G.BUILDABLE.map(t => { const T = TYPES[t], why = R.buildBlock(t), hard = why && !/Ressources/.test(why);
    return `<button class="card ${hard ? 'locked' : ''}" data-a="build" data-t="${t}"><img src="${thumb(t, 1)}" alt=""><b>${T.name}</b>
    <span class="meta">${T.prod ? `${ic(T.prod)} ${G.rate(t, 1)}/min` : T.craft === 'toy' ? 'Fabrique les jouets' : T.craft ? 'Cadeaux et rareté' : t === 'storage' ? 'Stock +' + fmt(G.storageBonus(1)) : 'Tournée en traîneau'}</span>
    ${hard ? `<span class="why">${why}</span>` : `<span class="costs">${chips(G.costOf(t, 1))}</span>`}</button>`; }).join('')}</div>`;
}
function lettersHtml(){
  const now = Date.now();
  const inv = Object.entries(TOYS).filter(([k]) => R.toyUnlocked(k)).map(([k]) => `<span class="chip"><img class="i" src="${ICON['toy_' + k]}" alt="">${state.toys[k] || 0}</span>`).join('');
  const cards = state.letters.map((L, i) => {
    if (L.wait > now) return `<div class="letter wait"><img src="${ICON.letter}" alt=""><span>Nouvelle lettre dans <b data-until="${L.wait}"></b></span></div>`;
    const ok = R.canFill(L);
    return `<div class="letter ${ok ? 'ok' : ''}"><div class="lhd"><b>Cher Père Noël,</b><small>${L.kid}</small></div>
      <div class="lines">${L.lines.map(([k, q]) => `<span class="need ${(state.toys[k] || 0) >= q ? 'have' : ''}"><img src="${ICON['toy_' + k]}" alt=""><b>${state.toys[k] || 0}/${q}</b><small>${TOYS[k].name}</small></span>`).join('')}</div>
      <div class="lft"><span class="costs">${rwChips({coins: L.coins, xp: L.xp, stars: L.stars})}</span>
      <span class="lbtns"><button class="mini" data-a="skip" data-i="${i}" aria-label="Changer de lettre">Changer</button><button class="btn green sm" data-a="answer" data-i="${i}" ${ok ? '' : 'disabled'}>Envoyer</button></span></div></div>`;
  }).join('');
  return `${header('Bureau des lettres', 'Lettres des enfants')}<p>Fabrique les jouets demandés à l'Atelier, puis envoie-les. Chaque lettre rapporte des pièces et de l'expérience, parfois des étoiles.</p>
    <h3>Tes jouets</h3><div class="costs">${inv || '<span class="meta">Aucun jouet pour l\'instant</span>'}</div><div class="letters">${cards}</div>`;
}
function gamesHtml(){
  const tm = R.tMax(), full = state.tickets >= tm;
  const stable = R.bestLv('stable');
  const card = (k, img, locked, why) => `<div class="game ${locked ? 'locked' : ''}"><img src="${img}" alt=""><div><b>${GAMES[k].name}</b><span class="meta">Record : ${state.best[k] || 0}</span>${locked ? `<span class="why">${why}</span>` : ''}</div>
    <button class="btn green sm" data-a="play" data-g="${k}" ${locked ? 'disabled' : ''}>Jouer · <i class="i ticket"></i>1</button></div>`;
  return `${header('Mini-jeux', 'Jeux du village')}
    <div class="tickets"><i class="i ticket big"></i><div><b>${state.tickets} / ${tm} tickets</b><span class="meta">${full ? 'Tickets au maximum' : `+1 ticket dans <b data-until="${state.ticketT + G.TICKET_MS}"></b>`}</span></div>
    <button class="mini" data-a="buyticket">+1 · <i class="i star"></i>5</button></div>
    ${card('snow', ICON.games, false)}
    ${card('sleigh', ICON.sleigh, stable < 1, "Construis l'Écurie des rennes")}
    <p class="meta">L'Écurie des rennes augmente les gains de la tournée et le nombre de tickets.</p>`;
}
function missionsHtml(){
  const d = R.ensureDaily(), all = d.list.every(m => m.claimed);
  const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
  return `${header('Missions du jour', 'Missions')}<p>Nouvelles missions dans <b data-until="${midnight.getTime()}"></b>.</p>
    <div class="missions">${d.list.map((m, i) => `<div class="mission ${m.claimed ? 'claimed' : m.p >= m.n ? 'ready' : ''}"><div><b>${R.MISSIONS[m.k].t(m.n)}</b>
      <span class="mbar"><i style="width:${m.p / m.n * 100}%"></i></span><small>${fmt(m.p)} / ${fmt(m.n)}</small></div>
      ${m.claimed ? '<span class="tick"></span>' : `<button class="btn ${m.p >= m.n ? 'gold' : 'grey'} sm" data-a="mission" data-i="${i}" ${m.p >= m.n ? '' : 'disabled'}>${ic('stars')}${m.stars}</button>`}</div>`).join('')}</div>
    <div class="mission bonus ${all && !d.bonus ? 'ready' : d.bonus ? 'claimed' : ''}"><img src="${ICON.missions}" alt=""><div><b>Coffre du jour</b><small>Termine les 3 missions</small></div>
      ${d.bonus ? '<span class="tick"></span>' : `<button class="btn gold sm" data-a="bonus" ${all ? '' : 'disabled'}>${ic('stars')}15</button>`}</div>`;
}
function adventHtml(){
  const c = state.advent.count, ready = R.adventReady();
  const cells = Array.from({length: 24}, (_, i) => {
    const absolute = Math.floor(c / 24) * 24 + i, opened = absolute < c, today = absolute === c && ready;
    const rw = R.adventReward(absolute);
    return `<button class="door ${opened ? 'open' : ''} ${today ? 'today' : ''} ${i === 23 ? 'big' : ''}" data-a="${today ? 'advent' : ''}"><b>${i + 1}</b>${opened ? '<span class="tick"></span>' : `<span class="dr">${Object.keys(rw).map(k => ic(k)).join('')}</span>`}</button>`;
  }).join('');
  return `${header(`Calendrier n°${Math.floor(c / 24) + 1}`, "Calendrier de l'Avent")}<p>Une case par jour. Plus tu avances, plus les cadeaux sont gros. Après la case 24, un nouveau calendrier commence.</p>
    <div class="advent">${cells}</div>${ready ? '' : '<p class="meta">Reviens demain pour la case suivante.</p>'}`;
}
function renderSheet(){
  if (!sel) return;
  if (sel === 'letters') return setSheet(lettersHtml());
  if (sel === 'games') return setSheet(gamesHtml());
  if (sel === 'missions') return setSheet(missionsHtml());
  if (sel === 'advent') return setSheet(adventHtml());
  if (F.panels[sel]) return setSheet(F.panels[sel]());
  setSheet(state.plots[sel] ? buildingHtml(sel) : buildMenuHtml());
}
$('#sheet').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b || !b.dataset.a) return;
  const a = b.dataset.a;
  if (a === 'close') return closeSheet();
  if (a === 'build') build(sel, b.dataset.t);
  else if (a === 'up') upgrade(sel);
  else if (a === 'collect') collect(sel, b);
  else if (a === 'speed') speedUp(sel);
  else if (a === 'craft') craft(sel, b.dataset.t);
  else if (a === 'answer') answerLetter(+b.dataset.i, b);
  else if (a === 'skip') skipLetter(+b.dataset.i);
  else if (a === 'play') playGame(b.dataset.g);
  else if (a === 'buyticket'){ if (state.stars < 5){ sfx.err(); toast("Pas assez d'étoiles"); } else { state.stars -= 5; state.tickets++; sfx.collect(); } }
  else if (a === 'mission'){ const m = R.ensureDaily().list[+b.dataset.i]; if (m.p >= m.n && !m.claimed){ m.claimed = true; gain({stars: m.stars, xp: m.xp}, b); sfx.level(); } }
  else if (a === 'bonus'){ const d = R.ensureDaily(); if (!d.bonus && d.list.every(m => m.claimed)){ d.bonus = true; gain({stars: 15, xp: 50 + R.pl() * 10}, b); sfx.bells(); } }
  else if (F.actions[a]) F.actions[a](b);
  else if (a === 'advent' && R.adventReady()){ const rw = R.adventReward(state.advent.count); state.advent.count++; state.advent.last = G.today(); track('advent'); gain(rw, b); sfx.bells(); }
  save(); sheetHtml = ''; renderSheet();
});

/* ---------- mini-jeux ---------- */
function playGame(k, opts = {}){
  if (opts.event){ if (!F.spendEnergy()) return; }
  else {
    if (k === 'sleigh' && R.bestLv('stable') < 1){ sfx.err(); toast("Construis l'Écurie des rennes"); return; }
    if (state.tickets < 1){ sfx.err(); toast("Plus de tickets : attends le prochain ou utilise 5 étoiles"); return; }
    state.tickets--; if (state.tickets === R.tMax() - 1) state.ticketT = Date.now();
  }
  closeSheet(); document.body.classList.add('in-game');
  openMinigame(k, {
    icons: {sleigh: ICON.sleigh, gift: ICON.gift, elf: ICON.elf, deer: ICON.deer, gold: ICON.gold},
    sfx, best: g => state.best[g] || 0, setBest: (g, v) => { state.best[g] = v; },
    chipsHtml: rwChips,
    reward: (g, score) => {
      const m = Math.pow(1.25, R.pl() / 2);
      if (g === 'sleigh'){ const mult = G.sleighMult(Math.max(1, R.bestLv('stable'))); return {coins: Math.round(score * 4 * m * mult), xp: Math.round((10 + score / 3) * m), stars: score >= 160 ? 3 : score >= 80 ? 1 : 0}; }
      return {wood: Math.round(score * 6 * m), cookies: Math.round(score * 3 * m), xp: Math.round((8 + score) * m), stars: score >= 45 ? 2 : score >= 25 ? 1 : 0};
    },
    grant: (rw, el) => { gain(rw, el); track('games'); track(k); if (opts.event){ F.eventGameDone(k, lastScore); toast(`+${fmt(k === 'snow' ? lastScore * 4 : lastScore)} points d'événement`); } save(); },
    onScore: sc => { lastScore = sc; },
    onClose: () => { document.body.classList.remove('in-game'); if (opts.event) openPanel('event'); },
  });
}
let lastScore = 0;

/* ---------- bulles au-dessus des bâtiments ---------- */
const ovRoot = $('#ov'), ovs = {};
for (const id of ALL_PLOTS){ const d = document.createElement('div'); d.className = 'ov'; ovRoot.appendChild(d); ovs[id] = {el: d, key: ''}; }
const locks = [];
for (let k = 1; k < NZ; k++){ const d = document.createElement('div'); d.className = 'ov lock'; d.innerHTML = `<span class="padlock"></span><b>${G.ZONES[k].name}</b><small>Niveau joueur ${G.ZONES[k].pl}</small>`; ovRoot.appendChild(d); locks[k] = d; }
ovRoot.addEventListener('pointerdown', e => {
  const b = e.target.closest('[data-id]'); if (!b) return;
  e.stopPropagation();
  const id = b.dataset.id;
  if (b.classList.contains('bubble')) collect(id, b); else { sfx.tap(); openSheet(id); }
});
function ovKey(id){
  const p = state.plots[id];
  if (!R.zoneOpen(zoneOf(id))) return '';
  if (!p) return 'plus';
  if (p.upEnd) return 'timer';
  if (R.ready(p)){
    if (TYPES[p.type].craft === 'toy') return 'bubble:toy_' + p.done[0] + ':' + p.done.length;
    if (TYPES[p.type].craft) return 'bubble:present' + Math.max(...p.done.map(d => d.r)) + ':' + p.done.length;
    return 'bubble:' + TYPES[p.type].prod + (p.buf >= G.bufCap(p.type, p.lv) - .01 ? ':full' : '');
  }
  if (TYPES[p.type].craft && p.queue?.length) return TYPES[p.type].craft === 'toy' ? 'craft:toy_' + p.queue[0].toy : 'craft:gift';
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
        else if (k.startsWith('craft')) o.el.innerHTML = `<div class="crafting" data-id="${id}"><img src="${ICON[k.split(':')[1]]}" alt=""><i><s></s></i></div>`;
        else { const [, res, full] = k.split(':'); o.el.innerHTML = `<button class="bubble ${full === 'full' ? 'full' : ''}" data-id="${id}"><img src="${ICON[res]}" alt=""><b></b></button>`; }
      }
      if (k === 'timer'){ const total = G.timeOf(p.type, p.upTo) * 1000, left = p.upEnd - Date.now(); o.el.querySelector('b').textContent = fmtTime(left / 1000); o.el.querySelector('s').style.width = Math.min(100, (1 - left / total) * 100) + '%'; }
      else if (k.startsWith('craft')){ const q = p.queue[0]; o.el.querySelector('s').style.width = Math.min(100, (Date.now() - q.start) / (q.end - q.start) * 100) + '%'; }
      else if (k.startsWith('bubble')) o.el.querySelector('b').textContent = TYPES[p.type].craft ? 'x' + p.done.length : fmt(p.buf);
    }
    if (!o.key){ o.el.style.display = 'none'; continue; }
    const base = plotPos(id); base.y += o.key === 'plus' ? .6 : views[id].top + .2;
    const s = project(base);
    o.el.style.display = s.on && s.y > 165 && s.y < innerHeight - 40 ? '' : 'none';
    o.el.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-100%)`;
  }
  for (let k = 1; k < NZ; k++){
    const d = locks[k];
    if (R.zoneOpen(k)){ d.style.display = 'none'; continue; }
    const s = project(new THREE.Vector3(0, zoneY(k) + 2, zoneZ(k)));
    d.style.display = s.on && s.y > 170 ? '' : 'none';
    d.style.transform = `translate3d(${s.x}px,${s.y}px,0) translate(-50%,-50%)`;
  }
}

/* =====================================================================
   CAMÉRA & CONTRÔLES
   ===================================================================== */
const cam = {x: 0, z: 4, dist: 42, tx: 0, tz: 4, tdist: 42, yaw: 0, tyaw: 0};
const homeDist = () => innerWidth / innerHeight < .7 ? 31 : 24;
const pointers = new Map(); let dragDist = 0, pinch0 = 0, dist0 = 0, introMode = true;
canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, {x: e.clientX, y: e.clientY}); dragDist = 0; if (pointers.size === 2){ const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); dist0 = cam.tdist; } });
canvas.addEventListener('pointermove', e => {
  const prev = pointers.get(e.pointerId); if (!prev || introMode) return;
  const dx = e.clientX - prev.x, dy = e.clientY - prev.y; prev.x = e.clientX; prev.y = e.clientY;
  if (pointers.size === 2){ const [a, b] = [...pointers.values()]; cam.tdist = THREE.MathUtils.clamp(dist0 * pinch0 / Math.hypot(a.x - b.x, a.y - b.y), 16, 56); dragDist = 99; return; }
  dragDist += Math.abs(dx) + Math.abs(dy);
  const f = cam.dist / innerHeight * 1.05;
  cam.tx = THREE.MathUtils.clamp(cam.tx - dx * f, -10, 10);
  cam.tz = THREE.MathUtils.clamp(cam.tz - dy * f * 1.5, zoneZ(NZ - 1) - 4, 9);
  cam.x = cam.tx; cam.z = cam.tz;
});
const endPtr = e => { const had = pointers.delete(e.pointerId); if (had && !pointers.size && dragDist < 10 && e.type === 'pointerup' && !introMode) tap(e.clientX, e.clientY); };
canvas.addEventListener('pointerup', endPtr); canvas.addEventListener('pointercancel', endPtr);
canvas.addEventListener('wheel', e => { e.preventDefault(); cam.tdist = THREE.MathUtils.clamp(cam.tdist * (1 + e.deltaY * .001), 16, 56); }, {passive: false});
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
function tap(x, y){
  ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  if (santa && ray.intersectObject(santa.root, true)[0]){ santa.path = []; santa.ch.play('Interact'); santa.wait = 2.5; sfx.bells(); return; }
  const hit = ray.intersectObjects(pickables, true).find(h => h.object.visible);
  let id = null; for (let o = hit && hit.object; o; o = o.parent) if (o.userData.plot){ id = o.userData.plot; break; }
  if (!id){ closeSheet(); return; }
  const k = zoneOf(id);
  if (!R.zoneOpen(k)){ sfx.err(); toast(`Terrain débloqué au niveau joueur ${G.ZONES[k].pl}`); return; }
  const p = state.plots[id];
  if (p && R.ready(p) && sel !== id){ collect(id, ovs[id].el.firstElementChild); return; }
  sfx.tap(); openSheet(id);
}
let level = 'high';
function applyQuality(q){
  level = q;
  const pr = q === 'high' ? Math.min(devicePixelRatio, 1.6) : q === 'medium' ? Math.min(devicePixelRatio, 1.25) : 1;
  renderer.setPixelRatio(pr); renderer.setSize(innerWidth, innerHeight, false);
  renderer.shadowMap.enabled = q !== 'low'; world.sun.shadow.mapSize.setScalar(q === 'high' ? 2048 : 1024); world.sun.shadow.map?.dispose(); world.sun.shadow.map = null;
  post.setQuality(q); post.setSize(innerWidth, innerHeight, pr);
}
function resize(){ camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < .7 ? 40 : 30; camera.updateProjectionMatrix(); applyQuality(level); }
level = QUALITY === 'auto' ? 'high' : QUALITY;
addEventListener('resize', resize); resize();

/* =====================================================================
   BOUCLE
   ===================================================================== */
{
  const now = Date.now(), away = Math.min(8 * 3600, (now - (state.t || now)) / 1000);
  offline = true; simulate(away, now); offline = false;
  if (saved && away > 60) setTimeout(() => toast(`Les lutins ont travaillé pendant ton absence (${fmtTime(away)})`), 1500);
}
R.ensureDaily();
for (const id of ALL_PLOTS) syncPlot(id);
makeSanta(); syncElves();

const clock = new THREE.Clock(); let last = Date.now(), smokeT = 0, saveT = 0, sheetT = 0, t = 0;
const focus = new THREE.Vector3();
function frame(){
  requestAnimationFrame(frame);
  const now = Date.now(), sdt = Math.min(8 * 3600, (now - last) / 1000); last = now;
  const dt = Math.min(.05, clock.getDelta()); t += dt;
  simulate(sdt, now);
  if (document.body.classList.contains('in-game')) return;     // le mini-jeu a l'écran pour lui
  for (const id of ALL_PLOTS) syncPlot(id);
  syncElves();

  if (introMode) cam.tyaw = Math.sin(t * .15) * .35;
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
  post.render(); perf(dt);
  updateOverlays(dt);
  renderHud();
  sheetT -= dt; if (sel && sheetT <= 0){ sheetT = .25; renderSheet(); }
  saveT -= dt; if (saveT <= 0){ saveT = 5; save(); }
}
// qualité automatique : on baisse si le téléphone n'arrive pas à suivre
let perfT = 0, perfN = 0, perfSum = 0;
function perf(dt){
  if (QUALITY !== 'auto' || introMode || level === 'low') return;
  perfT += dt; perfN++; perfSum += dt;
  if (perfT > 4){
    const avg = perfSum / perfN; perfT = perfN = perfSum = 0;
    if (avg > 1 / 30) applyQuality(level === 'high' ? 'medium' : 'low');
  }
}
window.__setQuality = q => { QUALITY = q; try { localStorage.setItem('vdp-quality', q); } catch(e){} applyQuality(q === 'auto' ? 'high' : q); };
frame();
addEventListener('visibilitychange', () => { if (document.hidden) save(); });
addEventListener('pagehide', save);

/* ---------- écran titre ---------- */
if (saved){ $('#play').textContent = 'Continuer'; $('#reset').hidden = false; }
$('#play').addEventListener('click', () => {
  introMode = false; cam.tyaw = 0; cam.tz = 3; cam.tdist = homeDist();
  $('#intro').classList.add('hide'); document.body.classList.add('playing'); sfx.bells();
  setTimeout(() => { if (F.loginReady()) openPanel('login'); }, 1400);
  setTimeout(() => $('#intro').remove(), 700);
});
let resetArmed = false;
$('#reset').addEventListener('click', () => {
  if (!resetArmed){ resetArmed = true; $('#reset').textContent = 'Toucher encore pour effacer la partie'; return; }
  G.clearSave(); state = G.newState(); R.ensureDaily();
  for (const id of ALL_PLOTS){ views[id].sig = 'x'; views[id].ready = false; syncPlot(id); }
  makeSanta(); $('#reset').hidden = true; $('#play').textContent = 'Jouer';
});

// accès pour les tests automatisés
window.__game = {get state(){ return state; }, set state(s){ state = s; }, cam, views, openPanel, playGame, net, F};
