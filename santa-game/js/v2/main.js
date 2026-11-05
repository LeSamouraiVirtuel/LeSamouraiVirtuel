// Le Village du Pôle V2 — « Township de Noël » en 2D isométrique.
// Toutes les images (bâtiments, champs, icônes) sont pré-rendues une fois pour toutes depuis les modèles 3D
// (tools/export-pack.mjs → assets/pack/). Le téléphone ne fait que télécharger des images et les poser sur un
// canvas 2D : chargement rapide, fluide, net, et aucune 3D à calculer sur l'appareil.
import {createTuto} from '../tuto.js';
import {openMinigame, GAMES} from '../minigames.js';
import * as T from './town.js';

const {ITEMS, TOYS, BUILDINGS} = T;
const tierOf = lv => lv >= 12 ? 3 : lv >= 5 ? 2 : 1;   // apparence du bâtiment selon son niveau
const $ = s => document.querySelector(s);
const ROOT = new URL('../../', import.meta.url).href;
const Q = new URLSearchParams(location.search);
const EXPORT = Q.has('export');                       // mode « fabrication du pack » (outil hors ligne)
const DPR = EXPORT ? 3 : Math.min(devicePixelRatio || 1, 3);
const ZOOM0 = 1.1;                                   // densité des images (le zoom par défaut est plus bas : village plus vaste)
const CAM0 = .78;                                   // zoom par défaut : les images y sont affichées pixel pour pixel
const BD = Math.min(DPR * ZOOM0, 3);                // densité des images des bâtiments
const TW = 64, TH = TW / 2;

/* =====================================================================
   CHARGEMENT
   ===================================================================== */
const TIPS = ['Glisse le doigt sur plusieurs champs pour tout récolter d’un coup.', 'Les commandes du traîneau rapportent beaucoup d’XP.', 'Les usines travaillent pendant que tu fais autre chose.', 'Agrandis ta grange avec des planches, des clous et de la peinture.', 'Les maisons apportent des habitants, nécessaires pour les usines.', 'Reviens chaque jour pour ton cadeau du jour !'];
let tipI = Math.floor(Math.random() * TIPS.length);
const tip = () => { const e = $('#tip'); if (e) e.textContent = TIPS[tipI++ % TIPS.length]; };
tip(); const tipTimer = setInterval(tip, 3200);
const bar = p => { const i = $('#loadbar i'); if (i) i.style.width = Math.max(3, Math.round(p * 100)) + '%'; };
const SPR = {}, ICON = {}, thumbs = {};
let portrait = '', buildIcon = '';

/** Charge le pack pré-rendu : un JSON + des images WebP. Renvoie false s'il manque. */
async function loadPack(){
  const r = await fetch(ROOT + 'assets/pack/pack.json', {cache: 'no-cache'}).catch(() => null);
  if (!r || !r.ok) return false;
  const P = await r.json(), dir = ROOT + 'assets/pack/', q = '?v=' + P.v;
  const keys = Object.keys(P.spr); let done = 0;
  const img = src => new Promise((ok, ko) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = ko; i.src = src; });
  await Promise.all(keys.map(async k => { const m = P.spr[k]; SPR[k] = {canvas: await img(dir + m.f + q), ax: m.ax, ay: m.ay, w: m.w, h: m.h}; bar(.05 + .9 * ++done / keys.length); }));
  for (const [k, f] of Object.entries(P.icon)) ICON[k] = dir + f + q;
  for (const [k, f] of Object.entries(P.thumb)) thumbs[k] = dir + f + q;
  portrait = dir + P.portrait + q; buildIcon = dir + P.buildIcon + q;
  return true;
}
const packed = !EXPORT && await loadPack().catch(() => false);
if (!packed){
  // secours (ou fabrication du pack) : pré-rendu sur l'appareil à partir des modèles 3D
  $('#loadtxt').textContent = 'Préparation du village…';
  const {bakeAll} = await import('./baker.js');
  const out = await bakeAll({DPR, BD, bar, base: ROOT + 'assets/', extras: EXPORT});
  const url = c => c.toDataURL('image/png');
  Object.assign(SPR, out.SPR);
  for (const [k, c] of Object.entries(out.ICON)) ICON[k] = url(c);
  for (const [k, c] of Object.entries(out.thumbs)) thumbs[k] = url(c);
  portrait = url(out.portrait); buildIcon = url(out.buildIcon);
  if (EXPORT){ window.__export = out; throw new Error('export prêt'); }
}
clearInterval(tipTimer);
bar(1);
$('#h-coins img').src = ICON.coins; $('#h-avatar').src = portrait; $('#i-village').src = thumbs.santa; $('#i-tgames').src = ICON.mg_sleigh;
for (const im of document.querySelectorAll('.resimg')) im.src = ICON[im.dataset.r];
$('#i-orders').src = thumbs.orders; $('#i-daily').src = thumbs.gifts; $('#i-album').src = ICON.train; $('#i-advent').src = ICON.bell; $('#i-games').src = ICON.mg_sleigh; $('#i-parcels').src = thumbs.gifts; $('#i-barn').src = thumbs.storage; $('#i-build').src = buildIcon;
const elfPortrait = portrait;

/* =====================================================================
   ÉTAT, SON
   ===================================================================== */
const saved = T.loadTown();
let S = saved || T.newTown();
const save = () => T.saveTown(S);
let actx = null;
function tone(f, d = .12, type = 'sine', v = .06, when = 0){
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch(e){}
}
const sfx = {tap: () => tone(740, .06, 'sine', .04), pop: () => tone(880, .08, 'triangle', .05), collect: () => { tone(988, .1, 'triangle', .05); tone(1319, .14, 'triangle', .05, .06); }, err: () => tone(160, .16, 'sawtooth', .02), level: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .28, 'triangle', .06, i * .08)), build: () => { tone(330, .1, 'square', .03); tone(523, .2, 'triangle', .05, .1); }};

/* =====================================================================
   CAMÉRA & CANVAS
   ===================================================================== */
const cv = $('#c'), ctx = cv.getContext('2d');
let W = 0, H = 0;
const cam = {x: 0, y: 0, z: 1};
function resize(){ W = innerWidth; H = innerHeight; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
addEventListener('resize', resize); resize();
const iso = (tx, ty) => ({x: (tx - ty) * TW / 2, y: (tx + ty) * TH / 2});
const toScreen = (tx, ty) => { const p = iso(tx, ty); return {x: (p.x - cam.x) * cam.z + W / 2, y: (p.y - cam.y) * cam.z + H / 2}; };
function toTile(sx, sy){ const wx = (sx - W / 2) / cam.z + cam.x, wy = (sy - H / 2) / cam.z + cam.y; return {x: wy / TH + wx / TW, y: wy / TH - wx / TW}; }
function centerOn(tx, ty){ const p = iso(tx, ty); cam.x = p.x; cam.y = p.y; }
const startZoom = () => W < 600 ? CAM0 : Math.min(1.2, CAM0 * W / 600);
cam.z = startZoom(); centerOn(20, 20);

// sol : texture de neige, motif répété
const PAT = Math.round(320 * DPR);   // motif de neige, généré directement en pixels de l'écran
const snowPat = (() => {
  const c = document.createElement('canvas'); c.width = c.height = PAT; const x = c.getContext('2d'), k = DPR;
  const g = x.createLinearGradient(0, 0, PAT, PAT); g.addColorStop(0, '#f3f7fd'); g.addColorStop(.5, '#e9f0fa'); g.addColorStop(1, '#f3f7fd');
  x.fillStyle = g; x.fillRect(0, 0, PAT, PAT);
  const wrap = f => { for (const dx of [-PAT, 0, PAT]) for (const dy of [-PAT, 0, PAT]){ x.save(); x.translate(dx, dy); f(); x.restore(); } };
  const R = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 70; i++){ const px = R(0, PAT), py = R(0, PAT), rx = R(14, 46) * k, ry = R(5, 14) * k, c1 = `rgba(${R(140, 175) | 0},${R(170, 200) | 0},236,${R(.06, .14)})`;
    wrap(() => { const gr = x.createRadialGradient(px, py, 0, px, py, rx); gr.addColorStop(0, c1); gr.addColorStop(1, 'rgba(160,190,236,0)'); x.fillStyle = gr; x.beginPath(); x.ellipse(px, py, rx, ry, 0, 0, 7); x.fill(); }); }
  for (let i = 0; i < 40; i++){ const px = R(0, PAT), py = R(0, PAT), w = R(20, 60) * k;
    wrap(() => { x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.5 * k; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + w / 2, py - 4 * k, px + w, py); x.stroke();
      x.strokeStyle = 'rgba(150,175,220,.18)'; x.beginPath(); x.moveTo(px, py + 2 * k); x.quadraticCurveTo(px + w / 2, py - 2 * k, px + w, py + 2 * k); x.stroke(); }); }
  for (let i = 0; i < 260; i++){ x.fillStyle = `rgba(255,255,255,${R(.6, 1)})`; const r = R(.5, 1.3) * k; x.beginPath(); x.arc(R(0, PAT), R(0, PAT), r, 0, 7); x.fill(); }
  for (let i = 0; i < 30; i++){ x.fillStyle = 'rgba(190,225,255,.9)'; x.fillRect(R(0, PAT), R(0, PAT), 1.2 * k, 1.2 * k); }
  return ctx.createPattern(c, 'repeat');
})();

/* =====================================================================
   RÈGLES APPLIQUÉES (actions du joueur)
   ===================================================================== */
const B = o => BUILDINGS[o.type];
const now = () => Date.now();
const haveOf = k => T.RES.includes(k) || k === 'stars' ? S[k] || 0 : S.inv[k] || 0;
function spriteKey(o){
  if (o.build) return 'site:' + Math.min(4, B(o).w);
  if (o.type === 'path') return ['b:path', 'b:path2', 'b:path3'][(o.x * 7 + o.y * 13) % 3];
  if (o.wild) return (o.x + o.y) % 3 ? 'b:wildtree' : 'b:wildtree2';
  if (T.isUpgradable(B(o))) return `b:${o.type}:${tierOf(o.lv || 1)}`;
  return 'b:' + o.type;
}
const findType = type => S.objs.find(o => o.type === type && !o.build);
function gainXp(n, from){
  const up = T.addXp(S, n);
  if (from) fly('xp', n, from);
  if (up){ for (let L = S.lvl - up + 1; L <= S.lvl; L++) lvQueue.push(L); if (!lvShowing) setTimeout(nextLevelUp, 500); }
  if (S.xpChests > 0) setTimeout(openXpChests, up ? 1800 : 400);
}
/** Coffres de la barre d'XP (tiers de niveau franchis) : petit gain immédiat, qui vole depuis la barre. */
function openXpChests(){
  const n = S.xpChests || 0; if (!n) return; S.xpChests = 0;
  for (let i = 0; i < n; i++) setTimeout(() => { giveReward(T.xpChestReward(S), $('#xpbar')); toast('🎁 Coffre de la barre d\'XP !'); }, i * 700);
}
/** Toucher un bâtiment de production : on récolte ce qu'il a accumulé. */
const ripe = o => B(o).kind === 'prod' && T.stored(S, o) >= Math.max(1, T.buffer(o.type, o.lv) * .08);   // bulle visible
function collectBld(o){
  if (!ripe(o)) return false;
  const b = B(o), got = T.collect(S, o);
  if (got === -1){ toastOnce(`Stock de ${ITEMS[b.res].name.toLowerCase()} plein : construis ou améliore un Entrepôt`); return true; }
  if (!got) return false;
  T.track(S, 'collect:' + b.res, got); fxHarvest(o, b.res, got); gainXp(T.collectXp(o), null);
  sfx.collect(); tutoEv('collect:' + o.type); save(); return true;
}
/* ---------- Atelier : file de fabrication des jouets ---------- */
function workshopOf(){ return findType('workshop'); }
function craftDone(o){ return (o.q || []).filter(j => j.end <= now()); }
function collectToys(o, at){
  const done = craftDone(o); if (!done.length) return false;
  for (const j of done){ T.give(S, j.item); gainXp(TOYS[j.item].xp, null); T.track(S, 'make:' + j.item); }
  o.q = o.q.filter(j => j.end > now());
  fxHarvest(o, done[0].item, done.length); sfx.collect(); tutoEv('toys'); save(); return true;
}
function queueToy(o, k){
  const t = TOYS[k];
  if (S.lvl < t.lvl){ sfx.err(); return toast(`Niveau ${t.lvl} requis`); }
  o.q = o.q || [];
  if (o.q.length >= T.craftSlots(o.lv)){ sfx.err(); return toast("La file de l'atelier est pleine"); }
  if (!T.has(S, t.cost)){ sfx.err(); return toast('Ressources insuffisantes'); }
  T.take(S, t.cost);
  const start = Math.max(now(), o.q.length ? o.q[o.q.length - 1].end : 0);
  o.q.push({item: k, end: start + t.time / T.craftSpeed(o.lv) * 1000}); sfx.pop(); tutoEv('craft'); save(); renderPanel();
}
/* ---------- lettres des enfants ---------- */
function bureau(){ return findType('orders'); }
function deliver(i, el){
  const od = S.orders[i]; if (!od?.items) return;
  if (!T.has(S, od.items)){ sfx.err(); toast('Il te manque des jouets : fabrique-les à l’Atelier'); return; }
  const pay = Math.round(od.coins * T.albumBonus(S));
  T.take(S, od.items); S.coins += pay; fly('coins', pay, el); gainXp(od.xp, el);
  for (const [k, q] of Object.entries(od.items)) T.track(S, 'deliver:' + k, q);
  if (od.mat){ T.give(S, od.mat); setTimeout(() => fly(od.mat, 1, el), 300); }
  if (od.stars){ S.stars += od.stars; }
  T.track(S, 'orders'); S.orders[i] = {wait: now() + 15000}; sfx.level(); tutoEv('deliver'); save(); renderPanel();
  if (tuto.active()) setTimeout(closePanel, 900);
}
function refreshOrders(){
  const bu = bureau(); if (!bu) return;
  const n = T.orderSlots(bu.lv);
  while (S.orders.length < n) S.orders.push({wait: now() + S.orders.length * 4000});
  for (let i = 0; i < S.orders.length; i++){ const o = S.orders[i]; if (o?.wait && now() >= o.wait) S.orders[i] = T.makeOrder(S, bu.lv); }
}
/* ---------- chantiers : construction et amélioration ---------- */
function startUpgrade(o, el){
  const why = T.upBlock(S, o); if (why){ sfx.err(); return toast(why); }
  const lv = o.lv + 1;
  // on récolte d'abord ce qui attend dans le bâtiment (sinon ce serait perdu)
  if (B(o).kind === 'prod') collectBld(o);
  T.take(S, T.upCost(o.type, lv));
  const ms = T.upTime(o.type, lv) * 1000; o.up = now() + ms; o.utotal = ms; o.upTo = lv;
  sfx.build(); tutoEv('upgrade'); save(); closePanel();
}
function finishWorks(){
  for (const o of S.objs){
    if (o.build && now() >= o.build){ delete o.build; o.t = now(); fxPoof(o); if (panel === 'site' && panelArg === o) closePanel(); gainXp(T.buildXp(1) + 2, null); sfx.level(); toast(`${B(o).name} construit !`); tutoEv('built'); save(); }
    if (o.up && now() >= o.up){ o.lv = o.upTo; delete o.up; delete o.upTo; o.t = now(); fxPoof(o); if (panel === 'site' && panelArg === o) closePanel(); gainXp(T.buildXp(o.lv), null); sfx.level(); toast(`${B(o).name} : niveau ${o.lv} !`); tutoEv('upgraded'); save(); }
  }
}
const workEnd = o => o.build || o.up || 0;
function speedCost(o){ return T.speedStars(workEnd(o) - now()); }

/* =====================================================================
   RENDU
   ===================================================================== */
const flakes = Array.from({length: 70}, () => ({x: Math.random(), y: Math.random(), s: .5 + Math.random(), v: .3 + Math.random() * .5}));
let ghost = null;          // placement en cours {type, x, y, move?: obj}
let selObj = null;
function objScreenRect(o){
  const spr = SPR[spriteKey(o)], b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2);
  return {left: c.x - spr.ax * cam.z, top: c.y - spr.ay * cam.z, width: spr.w * cam.z, height: spr.h * cam.z, cx: c.x, cy: c.y};
}
function fits(type, x, y, ignore){
  const b = BUILDINGS[type];
  for (let i = 0; i < b.w; i++) for (let j = 0; j < b.h; j++){
    const tx = x + i, ty = y + j;
    if (tx < 0 || ty < 0 || tx >= T.MAP || ty >= T.MAP) return false;
    if (!S.chunks.includes(`${Math.floor(tx / T.CHUNK)},${Math.floor(ty / T.CHUNK)}`)) return false;
  }
  for (const o of S.objs){ if (o === ignore) continue; const ob = B(o); if (x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y) return false; }
  return true;
}
function diamond(x, y, w, h, fill, stroke){
  const a = toScreen(x, y), b = toScreen(x + w, y), c = toScreen(x + w, y + h), d = toScreen(x, y + h);
  ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
  if (fill){ ctx.fillStyle = fill; ctx.fill(); } if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}
function drawSprite(key, cx, cy, alpha = 1){
  const s = SPR[key]; if (!s) return;
  // positions alignées sur les pixels de l'écran : pas de flou de rééchantillonnage
  const x = Math.round((cx - s.ax * cam.z) * DPR) / DPR, y = Math.round((cy - s.ay * cam.z) * DPR) / DPR, w = s.w * cam.z, h = s.h * cam.z;
  if (x > W || y > H || x + w < 0 || y + h < 0) return; // hors écran
  ctx.globalAlpha = alpha;
  ctx.drawImage(s.canvas, x, y, w, h);
  ctx.globalAlpha = 1;
}
const bubbleImgs = {};
const img = url => { if (!bubbleImgs[url]){ const i = new Image(); i.src = url; bubbleImgs[url] = i; } return bubbleImgs[url]; };
function bubble(cx, cy, key, label){
  const r = 22 * Math.min(1.2, Math.max(.8, cam.z));
  ctx.save(); ctx.translate(cx, cy - r - 6 + Math.sin(performance.now() / 300) * 3);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(-r, -r, r * 2, r * 2, r * .45); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, r - 1); ctx.lineTo(0, r + 8); ctx.lineTo(6, r - 1); ctx.fill(); ctx.stroke();
  ctx.fillRect(-6, r - 4, 12, 4);
  const im = img(ICON[key] || ICON.coins); if (im.complete) ctx.drawImage(im, -r * .8, -r * .8, r * 1.6, r * 1.6);
  if (label){ ctx.font = '400 14px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = '#2a1a0e'; ctx.strokeText(label, r * .7, r * .9); ctx.fillStyle = '#fff'; ctx.fillText(label, r * .7, r * .9); }
  ctx.restore();
}
function timerPill(cx, cy, text, prog){
  ctx.save(); ctx.translate(cx, cy);
  ctx.font = '400 13px "Lilita One", sans-serif'; const w = Math.max(64, ctx.measureText(text).width + 20);
  ctx.fillStyle = '#fff6da'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-w / 2, -26, w, 26, 9); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-w / 2 + 6, -9, w - 12, 5); ctx.fillStyle = '#4cc85a'; ctx.fillRect(-w / 2 + 6, -9, (w - 12) * Math.max(0, Math.min(1, prog)), 5);
  ctx.fillStyle = '#6b3f1e'; ctx.textAlign = 'center'; ctx.fillText(text, 0, -12);
  ctx.restore();
}
function draw(){
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.imageSmoothingQuality = 'high';
  // sol
  // sol : motif en pixels réels (transformation identité), qui suit la caméra
  { const o0 = toScreen(0, 0), ox = Math.round(o0.x * DPR) % PAT, oy = Math.round(o0.y * DPR) % PAT; ctx.save(); ctx.setTransform(1, 0, 0, 1, ox, oy); ctx.fillStyle = snowPat; ctx.fillRect(-ox - PAT, -oy - PAT, cv.width + PAT * 2, cv.height + PAT * 2); ctx.restore(); }
  // terrain ouvert : léger liseré pour marquer la limite
  for (const k of S.chunks){ const [cx, cy] = k.split(',').map(Number); diamond(cx * T.CHUNK, cy * T.CHUNK, T.CHUNK, T.CHUNK, 'rgba(255,255,255,.35)', null); }
  // forêts : zones verrouillées + bordure de carte
  const items = [];
  const n = T.MAP / T.CHUNK;
  for (let cx = -1; cx <= n; cx++) for (let cy = -1; cy <= n; cy++){
    if (S.chunks.includes(`${cx},${cy}`)) continue;
    items.push({d: (cx + cy + 1) * T.CHUNK, f: () => { const c = toScreen((cx + .5) * T.CHUNK, (cy + .5) * T.CHUNK); drawSprite('forest:' + Math.abs((cx * 7 + cy * 3) % 3), c.x, c.y); if (cx >= 0 && cy >= 0 && cx < n && cy < n && isNextToOpen(cx, cy)) sign(c.x, c.y, cx, cy); }});
  }
  // allées : posées au sol, avant tout le reste
  for (const o of S.objs) if (o.type === 'path' && ghost?.move !== o) drawObj(o);
  for (const o of S.objs){
    const b = B(o);
    if (ghost?.move === o || o.type === 'path') continue;
    items.push({d: o.x + o.y + (b.w + b.h) / 2, f: () => drawObj(o)});
  }
  // terrains réservés : le futur bâtiment en transparence, avec ce qu'il faut pour le débloquer
  for (const l of T.lotsShown(S)){ const b = BUILDINGS[l.type]; items.push({d: l.x + l.y + (b.w + b.h) / 2, f: () => drawLot(l)}); }
  for (const e of elves) items.push({d: e.x + e.y, f: () => drawElf(e)});
  if (ghost){ const b = BUILDINGS[ghost.type]; items.push({d: ghost.x + ghost.y + (b.w + b.h) / 2 + .01, f: () => { const ok = fits(ghost.type, ghost.x, ghost.y, ghost.move); diamond(ghost.x, ghost.y, b.w, b.h, ok ? 'rgba(80,220,100,.35)' : 'rgba(255,60,60,.35)', ok ? '#2fae48' : '#d81f33'); const c = toScreen(ghost.x + b.w / 2, ghost.y + b.h / 2); drawSprite(ghost.move ? spriteKey(ghost.move) : T.isUpgradable(b) ? `b:${ghost.type}:1` : 'b:' + ghost.type, c.x, c.y, .85); }}); }
  items.sort((a, b) => a.d - b.d);
  for (const it of items) it.f();
  // noms des bâtiments, puis indicateurs au-dessus
  for (const o of S.objs) plate(o);
  for (const o of S.objs) drawHint(o);
  // neige qui tombe
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const f of flakes){ ctx.beginPath(); ctx.arc(f.x * W, f.y * H, f.s * 1.6, 0, 7); ctx.fill(); }
  // vignette : bords légèrement assombris, le regard va au centre
  ctx.drawImage(vignette(), 0, 0, W, H);
  drawFx(fxDt);
}
let fxDt = 0;
let vig = null, vigW = 0, vigH = 0;
function vignette(){ // calculée une fois en petite taille, puis étirée (dégradé doux : aucun flou visible)
  if (vigW !== W || vigH !== H){ vigW = W; vigH = H; vig = document.createElement('canvas'); vig.width = 128; vig.height = Math.round(128 * H / W); const x = vig.getContext('2d'), w = vig.width, h = vig.height;
    const g = x.createRadialGradient(w / 2, h * .45, Math.min(w, h) * .35, w / 2, h * .45, Math.hypot(w, h) * .62); g.addColorStop(0, 'rgba(20,30,70,0)'); g.addColorStop(1, 'rgba(20,30,70,.28)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  return vig;
}
const PLATE = new Set(['hq', 'prod', 'storage', 'craft', 'orders', 'stable', 'fun']);
function plate(o){
  const b = B(o); if (!PLATE.has(b.kind) || cam.z < .5 || o.build) return;
  const p = toScreen(o.x + b.w, o.y + b.h);
  if (p.x < -100 || p.x > W + 100 || p.y < -40 || p.y > H + 40) return;
  // étiquette discrète au pied du bâtiment : pastille de niveau dorée + nom en police fine (comme Bid Master)
  const label = b.name, lv = String(o.lv || 1);
  ctx.save(); ctx.translate(Math.round(p.x), Math.round(p.y - 10));
  ctx.font = '600 11px Fredoka, sans-serif'; const tw = ctx.measureText(label).width, w = tw + 30, h = 18;
  ctx.fillStyle = 'rgba(18,22,44,.78)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 5); ctx.fill();
  ctx.fillStyle = '#ffc93a'; ctx.beginPath(); ctx.arc(-w / 2 + 10, 0, 7, 0, 7); ctx.fill(); ctx.strokeStyle = '#7a4a05'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#3a2208'; ctx.font = '400 9.5px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lv, -w / 2 + 10, .5);
  ctx.fillStyle = '#fff'; ctx.font = '600 11px Fredoka, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(label, -w / 2 + 21, .5);
  ctx.restore();
}
function drawLot(l){
  const b = BUILDINGS[l.type], c = toScreen(l.x + b.w / 2, l.y + b.h / 2), ok = (b.hq || 1) <= T.hqLv(S);
  diamond(l.x, l.y, b.w, b.h, ok ? 'rgba(90,200,110,.18)' : 'rgba(40,50,90,.16)', ok ? 'rgba(60,170,80,.7)' : 'rgba(255,255,255,.55)');
  drawSprite(`b:${l.type}:1`, c.x, c.y, ok ? .55 : .32);
  const p = toScreen(l.x + b.w, l.y + b.h), label = ok ? `${b.name} · à construire` : `${b.name} · Maison niv. ${b.hq}`;
  ctx.save(); ctx.translate(Math.round(p.x), Math.round(p.y - 10));
  ctx.font = '600 11px Fredoka, sans-serif'; const w = ctx.measureText(label).width + 30, h = 18;
  ctx.fillStyle = ok ? 'rgba(20,110,40,.85)' : 'rgba(18,22,44,.78)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 5); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, -w / 2 + 21, .5);
  // cadenas (verrouillé) ou « + » (constructible)
  ctx.translate(-w / 2 + 10, 0);
  if (ok){ ctx.fillStyle = '#7dff8a'; ctx.fillRect(-4.5, -1.2, 9, 2.4); ctx.fillRect(-1.2, -4.5, 2.4, 9); }
  else { ctx.strokeStyle = '#ffd34a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, -2, 3, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#ffd34a'; ctx.fillRect(-4.5, -1.5, 9, 6.5); }
  ctx.restore();
}
function lotAt(sx, sy){ const t = toTile(sx, sy); return T.lotsShown(S).find(l => { const b = BUILDINGS[l.type]; return t.x >= l.x && t.x < l.x + b.w && t.y >= l.y && t.y < l.y + b.h; }); }
const isOpen = (cx, cy) => S.chunks.includes(`${cx},${cy}`);
const isNextToOpen = (cx, cy) => isOpen(cx - 1, cy) || isOpen(cx + 1, cy) || isOpen(cx, cy - 1) || isOpen(cx, cy + 1);
function sign(x, y, cx, cy){
  ctx.save(); ctx.translate(x, y - 10);
  ctx.fillStyle = '#c98a4b'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(-30, -22, 60, 30, 8); ctx.fill(); ctx.stroke();
  { const zn = T.zoneName(cx, cy); ctx.font = '600 11px Fredoka, sans-serif'; const zw = ctx.measureText(zn).width + 14; ctx.fillStyle = 'rgba(18,22,44,.8)'; ctx.beginPath(); ctx.roundRect(-zw / 2, 12, zw, 17, 5); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(zn, 0, 21); ctx.textBaseline = 'alphabetic'; }
  ctx.font = '400 15px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeText('À VENDRE', 0, -2); ctx.fillStyle = '#fff'; ctx.fillText('À VENDRE', 0, -2);
  ctx.restore();
}
function drawObj(o){
  const b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2);
  if (selObj === o) diamond(o.x, o.y, b.w, b.h, 'rgba(255,214,90,.35)', '#ffc83a');
  drawSprite(spriteKey(o), c.x, c.y);
}
function drawHint(o){
  const b = B(o); if (ghost?.move === o || o.wild) return;
  const r = objScreenRect(o), top = r.top + 10;
  if (r.cx < -60 || r.cx > W + 60 || top < -60 || r.cy > H + 80) return;
  const w = workEnd(o);
  if (w){ const total = o.build ? o.btotal : o.utotal; timerPill(r.cx, top, (speedCost(o) ? '' : '✓ ') + fmtTime((w - now()) / 1000), 1 - (w - now()) / (total || 1)); return; }
  if (b.kind === 'prod'){ const n = T.stored(S, o), buf = T.buffer(o.type, o.lv); if (ripe(o)) bubble(r.cx, top, b.res, n >= buf ? 'MAX' : ''); }
  if (b.kind === 'craft'){ const d = craftDone(o); if (d.length) bubble(r.cx, top, d[0].item, d.length > 1 ? 'x' + d.length : ''); else if (o.q?.length){ const j = o.q[0]; timerPill(r.cx, top, fmtTime((j.end - now()) / 1000), 1 - (j.end - now()) / (TOYS[j.item].time / T.craftSpeed(o.lv) * 1000)); } }
  if (b.kind === 'orders'){ const ok = S.orders.some(od => od.items && T.has(S, od.items)); if (ok) return bubble(r.cx, top, 'coins', '!'); }
  if (b.kind === 'mine'){ const st = T.mineState(S); if (st && st.M.picks >= st.max) return bubble(r.cx, top, 'ice', String(st.M.picks)); }
  if (b.kind === 'stable'){ const run = S.exps || []; if (run.length >= T.expSlots(o.lv)){ const e = run.reduce((a, x) => x.end < a.end ? x : a); const d = T.EXP_DEST.find(d => d.k === e.k); return timerPill(r.cx, top, fmtTime((e.end - now()) / 1000), 1 - (e.end - now()) / d.time); } if (!T.expBlock(S, 'forest')) return bubble(r.cx, top, 'gold', '!'); }
  if (T.isUpgradable(b) && !ripe(o) && !(b.kind === 'craft' && craftDone(o).length) && !T.upBlock(S, o)) bang(r.cx + r.width * .22, top + 6);
}
/** « ! » rouge : ce bâtiment peut être amélioré maintenant (comme les « ! » de Bid Master). */
function bang(x, y){
  const s = Math.min(1.15, Math.max(.8, cam.z)), k = 1 + Math.sin(performance.now() / 220) * .06;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * k, s * k);
  ctx.fillStyle = '#e8262e'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = '400 15px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', 0, 1);
  ctx.restore();
}

/* ---------- effets (comme la bande-annonce de Township) ---------- */
// récolte : les produits jaillissent du champ et filent en traînée lumineuse vers la grange ; « +XP » qui monte
const FX = [];
const GLOW = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,250,200,.95)'); g.addColorStop(.35, 'rgba(255,220,90,.55)'); g.addColorStop(1, 'rgba(255,200,60,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c; })();
function fxHarvest(o, k, n){
  const b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2), tr = targetOf(k).getBoundingClientRect();
  const tx = tr.left + tr.width / 2, ty = tr.top + tr.height * .4;
  for (let i = 0; i < 4; i++){ const x0 = c.x + (Math.random() - .5) * 46 * cam.z, y0 = c.y - 8 * cam.z + (Math.random() - .5) * 16;
    FX.push({k: 'item', target: targetOf(k), url: ICON[k], x0, y0, cx: (x0 + tx) / 2 + (Math.random() - .5) * 120, cy: Math.min(y0, ty) - 90 - Math.random() * 80, tx, ty, t: -i * .07, d: .8, last: i === 3}); }
  FX.push({k: 'txt', txt: '+' + n, x: c.x - 16, y: c.y - 28 * cam.z, t: 0, d: 1.1, col: '#fff'});
  
}
// bâtiment terminé : nuage de poussière + étincelles
function fxPoof(o){
  const b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2);
  for (let i = 0; i < 14; i++){ const a = i / 14 * Math.PI * 2; FX.push({k: 'puff', x: c.x + Math.cos(a) * 20 * b.w, y: c.y + Math.sin(a) * 10 * b.w, vx: Math.cos(a) * 40, vy: Math.sin(a) * 20 - 30, r: 14 + Math.random() * 12, t: 0, d: .9}); }
  for (let i = 0; i < 10; i++) FX.push({k: 'spark', x: c.x, y: c.y - 30, vx: (Math.random() - .5) * 260, vy: -120 - Math.random() * 160, t: 0, d: .9});
}
const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
function drawFx(dt){
  for (let i = FX.length - 1; i >= 0; i--){
    const f = FX[i]; f.t += dt; if (f.t < 0) continue;
    const u = Math.min(1, f.t / f.d);
    if (f.k === 'item'){
      const im = img(f.url); if (!im.complete) continue;
      const pos = v => { const e = ease(v), m = 1 - e; return [m * m * f.x0 + 2 * m * e * f.cx + e * e * f.tx, m * m * f.y0 + 2 * m * e * f.cy + e * e * f.ty]; };
      for (let j = 4; j >= 1; j--){ const [x, y] = pos(Math.max(0, u - j * .035)); const r = 22 - j * 3; ctx.globalAlpha = .5 - j * .1; ctx.drawImage(GLOW, x - r, y - r, r * 2, r * 2); }
      const [x, y] = pos(u), sz = 34 * (u < .15 ? .6 + u * 2.6 : 1 - u * .35);
      ctx.globalAlpha = 1; ctx.drawImage(GLOW, x - sz, y - sz, sz * 2, sz * 2); ctx.drawImage(im, x - sz / 2, y - sz / 2, sz, sz);
      if (u >= 1 && f.last){ const e = f.target; e.classList.remove('pulse'); void e.offsetWidth; e.classList.add('pulse'); }
    } else if (f.k === 'txt' || f.k === 'xp'){
      const y = f.y - 46 * ease(u); ctx.globalAlpha = u > .7 ? (1 - u) / .3 : 1;
      ctx.font = '400 22px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 5; ctx.strokeStyle = '#2a1a0e';
      if (f.k === 'xp'){ ctx.fillStyle = '#3aa8ff'; ctx.beginPath(); ctx.arc(f.x - 20, y, 11, 0, 7); ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke(); ctx.lineWidth = 5; ctx.font = '400 10px "Lilita One", sans-serif'; ctx.fillStyle = '#fff'; ctx.fillText('XP', f.x - 20, y + 1); ctx.font = '400 20px "Lilita One", sans-serif'; ctx.strokeText(f.txt, f.x + 6, y); ctx.fillStyle = '#9be3ff'; ctx.fillText(f.txt, f.x + 6, y); }
      else { ctx.strokeText(f.txt, f.x, y); ctx.fillStyle = f.col; ctx.fillText(f.txt, f.x, y); }
    } else if (f.k === 'puff'){
      f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = (1 - u) * .85; ctx.fillStyle = '#fbf6ee'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + u * 1.3), 0, 7); ctx.fill();
    } else if (f.k === 'spark'){
      f.vy += 420 * dt; f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = 1 - u; ctx.drawImage(GLOW, f.x - 12, f.y - 12, 24, 24);
    }
    ctx.globalAlpha = 1;
    if (u >= 1) FX.splice(i, 1);
  }
}

/* ---------- lutins qui se promènent ---------- */
const elfSprites = [0, 1, 2].map(v => SPR['elf:' + v]);
const elves = Array.from({length: 9}, (_, i) => ({x: 13 + i * 2, y: 22, tx: 13 + i * 2, ty: 22, v: i % 3, wait: Math.random() * 3}));
function moveElves(dt){
  for (const e of elves){
    const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy);
    if (d < .05){ e.wait -= dt; if (e.wait <= 0){ // les lutins marchent le long des allées, d'une dalle voisine à l'autre
        const here = S.objs.filter(o => o.type === 'path' && Math.abs(o.x + .5 - e.x) + Math.abs(o.y + .5 - e.y) <= 1.6 && !(Math.abs(o.x + .5 - e.x) < .1 && Math.abs(o.y + .5 - e.y) < .1));
        const all = here.length ? here : S.objs.filter(o => o.type === 'path');
        if (all.length){ const t = all[Math.floor(Math.random() * all.length)]; e.tx = t.x + .5; e.ty = t.y + .5; e.wait = Math.random() < .15 ? 1 + Math.random() * 3 : 0; } } }
    else { const st = Math.min(d, dt * .9); e.x += dx / d * st; e.y += dy / d * st; }
    e.walk = d >= .05;
  }
}
function drawElf(e){ const c = toScreen(e.x, e.y), s = elfSprites[e.v]; const bob = e.walk ? Math.abs(Math.sin(performance.now() / 120)) * 3 : 0; ctx.save(); if (e.tx - e.x > 0 === e.ty - e.y < 0){ ctx.translate(c.x, 0); ctx.scale(-1, 1); ctx.translate(-c.x, 0); } ctx.drawImage(s.canvas, c.x - s.ax * cam.z, c.y - s.ay * cam.z - bob, s.w * cam.z, s.h * cam.z); ctx.restore(); }

/* =====================================================================
   TOUCHER : déplacer la vue, glisser pour récolter/planter, placer
   ===================================================================== */
const ptrs = new Map(); let drag = null;
function objAt(sx, sy){
  const t = toTile(sx, sy);
  // d'abord l'emprise au sol, puis la silhouette des bâtiments (du plus proche au plus lointain)
  let best = null;
  for (const o of S.objs){ const b = B(o); if (t.x >= o.x && t.x < o.x + b.w && t.y >= o.y && t.y < o.y + b.h){ if (!best || o.x + o.y > best.x + best.y) best = o; } }
  if (best) return best;
  const sorted = [...S.objs].sort((a, b) => (b.x + b.y) - (a.x + a.y));
  for (const o of sorted){ if (B(o).kind === 'deco' || B(o).kind === 'path') continue; const r = objScreenRect(o); if (sx > r.left + r.width * .2 && sx < r.left + r.width * .8 && sy > r.top + r.height * .1 && sy < r.cy) return o; }
  return null;
}
cv.addEventListener('pointerdown', e => {
  cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY});
  if (ptrs.size === 2){ const [a, b] = [...ptrs.values()]; drag = {mode: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y), z0: cam.z}; return; }
  const o = objAt(e.clientX, e.clientY);
  drag = {mode: 'pan', sx: e.clientX, sy: e.clientY, moved: 0, obj: o};
  if (ghost){ const t = toTile(e.clientX, e.clientY), b = BUILDINGS[ghost.type]; if (t.x >= ghost.x - .5 && t.x <= ghost.x + b.w + .5 && t.y >= ghost.y - .5 && t.y <= ghost.y + b.h + .5) drag.mode = 'ghost'; return; }
  // glisser le doigt sur plusieurs bâtiments prêts : on récolte tout d'un coup (comme les champs de Township)
  if (o && ripe(o)){ drag.mode = 'harvest'; drag.done = new Set([o]); collectBld(o); }
});
addEventListener('pointermove', e => {
  const p = ptrs.get(e.pointerId); if (!p || !drag) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (drag.mode === 'pinch' && ptrs.size === 2){ const [a, b] = [...ptrs.values()]; cam.z = Math.max(.45, Math.min(1.5, drag.z0 * Math.hypot(a.x - b.x, a.y - b.y) / drag.d0)); return; }
  drag.moved += Math.abs(dx) + Math.abs(dy);
  if (drag.mode === 'pan'){ cam.x -= dx / cam.z; cam.y -= dy / cam.z; clampCam(); return; }
  if (drag.mode === 'ghost'){ const t = toTile(e.clientX, e.clientY), b = BUILDINGS[ghost.type]; ghost.x = Math.round(t.x - b.w / 2); ghost.y = Math.round(t.y - b.h / 2); updateGhostUI(); return; }
  if (drag.mode === 'harvest'){ const o = objAt(e.clientX, e.clientY); if (o && ripe(o) && !drag.done.has(o)){ drag.done.add(o); collectBld(o); } }
});
const endPtr = e => {
  ptrs.delete(e.pointerId); if (!drag || ptrs.size) return;
  const d = drag; drag = null;
  if (d.mode === 'pan' && d.moved < 10 && e.type === 'pointerup') tap(d.obj, {x: e.clientX, y: e.clientY});
};
addEventListener('pointerup', endPtr); addEventListener('pointercancel', endPtr);
cv.addEventListener('wheel', e => { e.preventDefault(); cam.z = Math.max(.45, Math.min(1.5, cam.z * (1 - e.deltaY * .001))); }, {passive: false});
function clampCam(){ const c = iso(T.MAP / 2, T.MAP / 2), r = T.MAP * TW * .45; cam.x = Math.max(c.x - r, Math.min(c.x + r, cam.x)); cam.y = Math.max(c.y - r * .5 - 200, Math.min(c.y + r * .5 + 200, cam.y)); }

function tap(o, at){
  sfx.tap();
  if (!o || o.wild){
    const l = lotAt(at.x, at.y);
    if (l){ const why = T.buildBlock(S, l.type); if (why){ sfx.err(); return toast(`${BUILDINGS[l.type].name} : ${why}`); } return startPlace(l.type, l); }
  }
  if (!o){
    const t = toTile(at.x, at.y), cx = Math.floor(t.x / T.CHUNK), cy = Math.floor(t.y / T.CHUNK);
    if (cx >= 0 && cy >= 0 && cx < T.MAP / T.CHUNK && cy < T.MAP / T.CHUNK && !isOpen(cx, cy) && isNextToOpen(cx, cy)) return openPanel('expand', {cx, cy});
    selObj = null; closePanel(); return;
  }
  selObj = o;
  const b = B(o);
  if (workEnd(o)) return openPanel('site', o);
  if (b.kind === 'prod'){ if (!collectBld(o)) openPanel('bld', o); return; }
  if (b.kind === 'craft'){ if (!collectToys(o, at)) openPanel('craft', o); return; }
  if (b.kind === 'orders') return openPanel('orders');
  if (b.kind === 'stable') return openPanel('exp', o);
  if (b.kind === 'mine') return openPanel('mine', o);
  if (T.isUpgradable(b)) return openPanel('bld', o);
  openPanel('info', o);
}

/* =====================================================================
   INTERFACE
   ===================================================================== */
const fmt = n => { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n); };
const fmtTime = s => { s = Math.max(0, Math.ceil(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60; return h ? `${h}h ${String(m).padStart(2, '0')}` : m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`; };
const icon = k => `<img class="i" src="${ICON[k]}" alt="">`;
let toastT;
function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
let lastToast = 0; const toastOnce = m => { if (now() - lastToast > 1500){ lastToast = now(); toast(m); sfx.err(); } };
const targetOf = k => k === 'xp' ? $('#xpbar') : $({coins: '#h-coins', wood: '#h-wood', cookies: '#h-cookies', fabric: '#h-fabric', stars: '#h-stars'}[k] || '#b-barn');
function fly(k, n, from){
  const target = targetOf(k);
  const r0 = from?.getBoundingClientRect ? from.getBoundingClientRect() : {left: (from?.x ?? W / 2) - 10, top: (from?.y ?? H / 2) - 10, width: 20, height: 20};
  const tr = target.getBoundingClientRect();
  const cnt = k === 'coins' ? Math.min(10, 3 + Math.round(Math.log2(n + 1))) : Math.min(5, Math.max(1, Math.round(Math.log2(n + 1))));
  for (let i = 0; i < cnt; i++){
    const d = document.createElement(k === 'xp' ? 'i' : 'img'); if (k !== 'xp') d.src = ICON[k]; d.className = 'fly' + (k === 'xp' ? ' xp' : ''); document.body.appendChild(d);
    const x0 = r0.left + r0.width / 2 - 18 + (Math.random() - .5) * 30, y0 = r0.top + r0.height / 2 - 18;
    d.style.transform = `translate(${x0}px,${y0}px) scale(.5)`;
    setTimeout(() => { d.style.transform = `translate(${x0}px,${y0 - 40}px) scale(1)`; }, 16);
    setTimeout(() => { d.style.transition = 'transform .5s cubic-bezier(.6,-0.2,.7,1), opacity .5s'; d.style.transform = `translate(${tr.left + tr.width / 2 - 18}px,${tr.top}px) scale(.6)`; }, 250 + i * 60);
    setTimeout(() => { d.remove(); target.classList.remove('pulse'); void target.offsetWidth; target.classList.add('pulse'); }, 780 + i * 60);
  }
  if (k !== 'xp'){ const t = document.createElement('div'); t.className = 'plusnum'; t.textContent = '+' + fmt(n); document.body.appendChild(t); t.style.left = (r0.left + r0.width / 2) + 'px'; t.style.top = r0.top + 'px'; setTimeout(() => t.remove(), 1000); }
}
const TITLES = ['Lutin apprenti', 'Lutin confirmé', 'Chef des lutins', 'Maître jouetier', 'Gardien des rennes', 'Héraut de l’hiver', 'Seigneur des neiges', 'Prince du Pôle', 'Presque Père Noël', 'Père Noël'];
function hud(){
  $('#h-lvl').textContent = S.lvl;
  $('#xpbar i').style.width = Math.min(100, S.xp / T.xpNeed(S.lvl) * 100) + '%';
  $('#xpbar b').textContent = `${fmt(S.xp)} / ${fmt(T.xpNeed(S.lvl))}`;
  $('#h-coins b').textContent = fmt(S.coins);
  $('#h-stars b').textContent = fmt(S.stars);
  for (const r of ['wood', 'cookies', 'fabric']){
    const e = $('#h-' + r), c = T.cap(S, r);
    e.hidden = r === 'fabric' && !S.fabric && !S.objs.some(o => o.type === 'mill');
    e.querySelector('b').textContent = fmt(S[r]); e.querySelector('.cap i').style.width = Math.min(100, S[r] / c * 100) + '%'; e.classList.toggle('full', S[r] >= c);
  }
  const L = T.lutins(S), E = T.employed(S);
  $('#h-pop').textContent = `${Math.min(E, L)} / ${L}`; $('#h-pop').classList.toggle('bad', E > L);
  $('#h-joy').textContent = `+${Math.round(T.joyBonus(S) * 100)} %`;
  $('#h-title').textContent = TITLES[Math.min(TITLES.length - 1, Math.floor((S.lvl - 1) / 2))];
  const toys = Object.entries(S.inv).filter(([k, n]) => ITEMS[k]?.toy && n > 0).reduce((a, [, n]) => a + n, 0);
  $('#b-barn small').textContent = toys;
  const ready = S.orders.filter(od => od.items && T.has(S, od.items)).length;
  const bd = $('#b-orders .badge'); bd.textContent = ready; bd.hidden = !ready;
  { const n = (S.parcels || []).length, e = $('#b-parcels .badge'); e.textContent = n; e.hidden = !n; $('#b-parcels').hidden = !n && !S.exps?.length && !S.mine; }
  $('#b-daily .badge').hidden = !T.dailyReady(S);
  { const n = T.albumClaimable(S).length, e = $('#b-album .badge'); e.textContent = n; e.hidden = !n; }
  { const a = T.adventState(S), e = $('#b-advent .badge'); e.hidden = !(a.open && T.adventCan(S, a.today)); $('#b-advent small').textContent = a.open ? 'Avent' : `J-${a.untilStart}`; }
  { const g = tickets(), bg = $('#b-games .badge'); bg.textContent = g.tickets; bg.hidden = !g.tickets; }
  renderQuest();
}

function closeSeeds(){}

/* ---------- panneaux ---------- */
let panel = null, panelArg = null, panelHtml = '', selOrder = 0;
function openPanel(name, arg){ closeSeeds(); panel = name; panelArg = arg; panelHtml = ''; document.body.classList.add('sheet-open'); renderPanel(); tutoEv('open:' + name); }
function closePanel(){ const was = panel; panel = null; panelHtml = ''; document.body.classList.remove('sheet-open'); selObj = null; if (was) tutoEv('close'); }
const hd = (small, title) => `<div class="hd"><div class="tt"><small>${small}</small><h2>${title}</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>`;
const need = req => Object.entries(req).map(([k, n]) => `<span class="need ${haveOf(k) >= n ? 'have' : ''}"><img src="${ICON[k]}" alt=""><b>${fmt(haveOf(k))}/${fmt(n)}</b></span>`).join('');
const costChips = req => Object.entries(req).map(([k, n]) => `<span class="chip ${haveOf(k) < n ? 'bad' : ''}">${k === 'stars' ? '<i class="i star"></i>' : icon(k)}${fmt(n)}</span>`).join('');
function renderPanel(){
  if (!panel) return;
  let h = '';
  if (panel === 'orders'){
    // comme l'hélicoptère de Township : une grille de petites vignettes + le détail de la commande choisie
    if (!S.orders[selOrder]?.items){ const r = S.orders.findIndex(od => od.items && T.has(S, od.items)); selOrder = r >= 0 ? r : Math.max(0, S.orders.findIndex(od => od.items)); }
    const od = S.orders[selOrder];
    const tiles = S.orders.map((o, i) => o.items
      ? `<button class="ot ${i === selOrder ? 'sel' : ''} ${T.has(S, o.items) ? 'ok' : ''}" data-a="osel" data-i="${i}">${Object.keys(o.items).slice(0, 3).map(k => `<img src="${ICON[k]}" alt="">`).join('')}${T.has(S, o.items) ? '<i class="ck"></i>' : ''}</button>`
      : `<div class="ot wait"><b data-until="${o.wait}"></b></div>`).join('');
    const detail = od?.items ? `<div class="od">
        <div class="odh"><small>Commande de ${od.kid}</small><span class="rw"><span>${icon('coins')}${od.coins}</span><span><i class="i xp">XP</i>${od.xp}</span>${od.mat ? `<span><img class="i" src="${ICON[od.mat]}" alt="">1</span>` : ''}${od.stars ? `<span><i class="i star"></i>${od.stars}</span>` : ''}</span></div>
        <div class="big">${Object.entries(od.items).map(([k, n]) => { const h = S.inv[k] || 0; return `<div class="bi ${h >= n ? 'have' : ''}"><img src="${ICON[k]}" alt="">${h >= n ? '<i class="ck"></i>' : ''}<b>${h}/${n}</b></div>`; }).join('')}</div>
        <div class="oacts"><button class="trash" data-a="trash" data-i="${selOrder}" aria-label="Remplacer cette commande"></button><button class="btn green" data-a="deliver" data-i="${selOrder}" ${T.has(S, od.items) ? '' : 'disabled'}>Livrer</button></div>
      </div>` : '<p class="meta">De nouvelles commandes arrivent…</p>';
    h = hd('Lettres des enfants', 'Bureau du traîneau') + (workshopOf() ? '' : '<p class="meta warn">Les jouets se fabriquent à l’<b>Atelier des jouets</b> (Maison du Père Noël niv. 2).</p>') + detail + `<div class="otiles">${tiles}</div>`;
  }
  else if (panel === 'craft'){
    const o = panelArg, q = o.q || [], n = T.craftSlots(o.lv);
    const slots = Array.from({length: n}, (_, i) => q[i] ? `<div class="slot ${q[i].end <= now() ? 'ready' : i === 0 || q[i - 1].end <= now() ? 'run' : ''}"><img src="${ICON[q[i].item]}" alt="">${q[i].end > now() && (i === 0 || q[i - 1].end <= now()) ? `<small data-until="${q[i].end}"></small>` : ''}</div>` : '<div class="slot empty"></div>').join('');
    h = hd(`Niveau ${o.lv} · vitesse ×${T.craftSpeed(o.lv).toFixed(2)}`, 'Atelier des jouets') + `<h3>File de fabrication (${q.length}/${n})</h3><div class="slots">${slots}</div>
      ${craftDone(o).length ? '<button class="btn gold wide" data-a="toys">Récupérer les jouets</button>' : ''}
      <h3>Jouets</h3><div class="recipes">${Object.entries(TOYS).map(([k, t]) => { const lock = S.lvl < t.lvl, wanted = S.orders.some(od => od.items?.[k]);
        return `<button class="recipe ${lock ? 'locked' : ''} ${!lock && T.has(S, t.cost) ? 'ok' : ''}" data-a="queue" data-k="${k}">${wanted && !lock ? '<span class="wanted">Demandé</span>' : ''}<img src="${ICON[k]}" alt=""><b>${ITEMS[k].name}</b>
        ${lock ? `<span class="why">Niveau ${t.lvl}</span>` : `<span class="costs">${costChips(t.cost)}</span><span class="meta">${fmtTime(t.time / T.craftSpeed(o.lv))} · en stock : ${S.inv[k] || 0}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'games'){
    const g = tickets();
    h = hd('', 'Mini-jeux') + `<div class="tix"><span>${'<i class="tk"></i>'.repeat(g.tickets)}${'<i class="tk off"></i>'.repeat(TMAX - g.tickets)}</span><small>${g.tickets < TMAX ? `+1 ticket dans <b data-until="${g.t + TEVERY}"></b>` : 'Tickets au maximum'}</small></div>
      <div class="games">${[['sleigh', ICON.mg_sleigh], ['snow', ICON.mg_snow]].map(([k, ic]) => `<button class="gcard" data-a="play" data-k="${k}"><img src="${ic}" alt=""><b>${GAMES[k].name}</b><span class="meta">Record : ${S.games.best[k] || 0}</span><span class="btn green sm">Jouer</span></button>`).join('')}</div>
      <p class="meta">Gagne des pièces, de l'XP, des étoiles et des matériaux !</p>`;
  }
  else if (panel === 'album'){
    const claim = T.albumClaimable(S);
    h = hd(`${T.albumTotal(S)} / ${Object.keys(TOYS).length * 3} étoiles · lettres +${Math.round((T.albumBonus(S) - 1) * 100)} %`, 'Album des jouets') + `<p class="meta">Chaque jouet livré aux enfants remplit l'album. Chaque étoile augmente pour toujours ce que paient les lettres.</p>
      ${claim.length ? `<button class="btn gold wide" data-a="albumclaim">Récupérer ${claim.length} récompense${claim.length > 1 ? 's' : ''}</button>` : ''}
      <div class="album">${Object.keys(TOYS).map(k => { const n = S.cnt['deliver:' + k] || 0, st = T.albumStars(S, k), next = T.ALBUM_STEPS[st], lock = S.lvl < TOYS[k].lvl;
        return `<div class="acard ${lock ? 'locked' : ''} s${st}"><img src="${ICON[k]}" alt=""><b>${ITEMS[k].name}</b><span class="ast">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</span><small>${lock ? `Niveau ${TOYS[k].lvl}` : next ? `${n} / ${next} livrés` : `${n} livrés · complet`}</small></div>`; }).join('')}</div>`;
  }
  else if (panel === 'advent'){
    const a = T.adventState(S);
    h = hd(a.open ? `Jour ${a.today} sur 24` : `Ouvre dans ${a.untilStart} jour${a.untilStart > 1 ? 's' : ''}`, "Calendrier de l'Avent") + `<p class="meta">${a.open ? 'Une case à ouvrir chaque jour jusqu’à Noël. Les cases oubliées s’ouvrent aussi, tant que décembre n’est pas fini.' : 'Du 1er au 24 décembre : une surprise par jour, et un énorme cadeau le 24 !'}</p>
      <div class="advent2">${T.ADVENT.map((r, i) => { const d = i + 1, done = S.advent?.[d], can = T.adventCan(S, d);
        return `<button class="door2 ${done ? 'open' : ''} ${can ? 'can' : ''} ${d === 24 ? 'big' : ''}" data-a="advent" data-d="${d}" ${can ? '' : 'disabled'}><b>${d}</b>${done ? '<i class="ck"></i>' : `<span class="mini-r">${rewardChips(r)}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'mine'){
    const st = T.mineState(S);
    if (!st) h = hd('', 'Grotte aux cristaux') + '<p class="meta">La grotte est encore en travaux.</p>';
    else {
      const {o, M, max, next} = st;
      h = hd(`Étage ${M.floor} · record ${M.best || M.floor}`, 'Grotte aux cristaux') + `<div class="minebar"><span class="picks"><i class="pk"></i><b>${M.picks} / ${max}</b></span><small>${next ? `+1 pioche dans <b data-until="${next}"></b>` : 'Pioches au maximum'}</small>${M.picks < max ? `<button class="btn gold sm" data-a="refill">Remplir · <i class="i star"></i>${T.PICK_REFILL}</button>` : ''}</div>
        <div class="mgrid f${Math.min(5, Math.ceil(M.floor / 10))}">${M.cells.map((c, i) => c.open ? `<div class="mc open k-${c.k}">${cellIcon(c)}</div>` : `<button class="mc" data-a="dig" data-i="${i}" aria-label="Creuser"></button>`).join('')}</div>
        ${M.stairs ? `<button class="btn green wide" data-a="down">Descendre à l'étage ${M.floor + 1}</button>` : '<p class="meta">Chaque case coûte une pioche. Trouve l’<b>escalier</b> pour descendre : plus profond, plus de cristaux, de lingots et de colis rares.</p>'}
        <div class="acts"><button class="btn blue sm" data-a="bldinfo">Améliorer la grotte (niv. ${o.lv})</button></div>`;
    }
  }
  else if (panel === 'exp'){
    const o = panelArg, slots = T.expSlots(o.lv), run = S.exps || [];
    const runs = run.map((e, i) => { const d = T.EXP_DEST.find(d => d.k === e.k), st = T.speedStars(e.end - now());
      return `<div class="erun"><b>${d.name}</b><div class="work"><div class="bar"><i data-end="${e.end}" data-total="${e.end - e.start}"></i></div><span>Retour dans <b data-until="${e.end}"></b></span></div><button class="btn gold sm" data-a="expspeed" data-i="${i}">${st ? `<i class="i star"></i>${st}` : 'Rentrer'}</button></div>`; }).join('');
    h = hd(`Écurie niv. ${o.lv} · ${run.length} / ${slots} équipe${slots > 1 ? 's' : ''} partie${run.length > 1 ? 's' : ''}`, 'Expéditions des rennes') + (runs ? `<h3>En route</h3>${runs}` : '') + `<h3>Destinations</h3><div class="dests">${T.EXP_DEST.map(d => { const why = T.expBlock(S, d.k), lock = d.lv > o.lv;
      return `<div class="dest ${lock ? 'locked' : ''}"><div class="dt"><b>${d.name}</b><small>${fmtTime(d.time / 1000)} · ${d.n} colis</small></div><div class="odds">${d.odds.map((p, r) => p ? `<i style="flex:${p};background:${T.RARITY[r].c}" title="${T.RARITY[r].name} ${p} %"></i>` : '').join('')}</div><div class="oddl">${d.odds.map((p, r) => p ? `<span style="color:${T.RARITY[r].c}">${T.RARITY[r].name} ${p} %</span>` : '').join('')}</div>
        ${lock ? `<span class="why">Écurie niv. ${d.lv}</span>` : `<div class="acts"><span class="costs">${costChips(T.expCost(S, d))}</span><button class="btn green sm" data-a="expgo" data-k="${d.k}" ${why && why !== 'Pas assez de biscuits pour les rennes' ? 'disabled' : ''}>Partir</button></div>`}</div>`; }).join('')}</div>
      <p class="meta">Les rennes rapportent des <b>colis mystère</b> : plus la destination est lointaine, plus les colis rares sont fréquents.</p>
      <div class="acts"><button class="btn blue sm" data-a="games">Mini-jeux</button><button class="btn blue sm" data-a="bldinfo">Améliorer l'écurie (niv. ${o.lv})</button></div>`;
  }
  else if (panel === 'shop'){
    h = hd("Étoiles d'or : la monnaie rare", 'Boutique') + `<p class="meta">Les étoiles d'or terminent un chantier tout de suite, remplissent les pioches, ramènent les rennes et engagent des bâtisseurs. On en gagne au compte-gouttes : niveaux, tâches, album, colis légendaires.</p>
      <h3>Bâtisseurs</h3><div class="builders">${T.BUILDER_PRICE.map((p, i) => { const own = (S.extraBuilders || 0) > i, can = (S.extraBuilders || 0) === i;
        return `<div class="bcard ${own ? 'own' : ''}"><img src="${elfImg()}" alt=""><b>Bâtisseur ${i + 3}</b>${own ? '<span class="meta">Engagé</span>' : `<button class="btn ${can ? 'gold' : 'blue'} sm" data-a="builder" ${can ? '' : 'disabled'}><i class="i star"></i>${p}</button>`}</div>`; }).join('')}</div>
      <h3>Paquets d'étoiles</h3><div class="packs">${T.SHOP.map(p => `<button class="pack" data-a="buy" data-k="${p.k}">${p.tag ? `<span class="ptag">${p.tag}</span>` : ''}<i class="i star"></i><b>${fmt(p.stars)}</b><span class="btn green sm">${p.price}</span></button>`).join('')}</div>
      <p class="meta">Le paiement sera activé avec la version App Store.</p>`;
  }
  else if (panel === 'lights'){
    const n = T.lightsLv(S), c = T.lightsCost(n), why = T.lightsBlock(S);
    h = hd(`Niveau ${n} · production +${n} %`, 'Illuminations du village') + `<div class="garland">${Array.from({length: 14}, (_, i) => `<i class="${i < Math.min(14, n) ? 'on' : ''}"></i>`).join('')}</div>
      <p class="meta">Ni bâtisseur ni attente : chaque niveau allume de nouvelles guirlandes et donne <b>+1 % de production</b> à tout le village, pour toujours. Le prix monte à chaque niveau.</p>
      <h3>Niveau ${n} → ${n + 1}</h3><div class="costs">${costChips(c)}</div>
      <div class="acts"><button class="btn green" data-a="lights" ${why && why !== 'Ressources insuffisantes' ? 'disabled' : ''}>Allumer</button></div>${why ? `<p class="note">${why}</p>` : ''}`;
  }
  else if (panel === 'stock'){
    h = hd('Ressources, jouets et outils', 'Stock') + `<h3>Ressources</h3><div class="stock">${T.RES.map(r => `<div class="st"><img src="${ICON[r]}" alt=""><b>${fmt(S[r])}</b><small>${r === 'coins' ? ITEMS[r].name : `${ITEMS[r].name} · max ${fmt(T.cap(S, r))}`}</small></div>`).join('')}</div>
      <h3>Jouets</h3><div class="stock">${Object.keys(TOYS).filter(k => S.inv[k] > 0).map(k => `<div class="st"><img src="${ICON[k]}" alt=""><b>${S.inv[k]}</b><small>${ITEMS[k].name}</small></div>`).join('') || '<p class="meta">Aucun jouet : fabrique-les à l’Atelier des jouets.</p>'}</div>
      <h3>Matériaux rares</h3><div class="stock">${T.RARE.map(k => `<div class="st"><img src="${ICON[k]}" alt=""><b>${fmt(S.inv[k] || 0)}</b><small>${ITEMS[k].name}</small></div>`).join('')}</div>
      <h3>Outils</h3><div class="stock">${['axe', 'saw'].map(k => `<div class="st"><img src="${ICON[k]}" alt=""><b>${S.inv[k] || 0}</b><small>${ITEMS[k].name}</small></div>`).join('')}</div>
      <p class="meta">Le stock maximum dépend de la Maison du Père Noël et des Entrepôts. Haches et scies : lettres, cadeau du jour, mini-jeux. Cristaux et lingots : Grotte aux cristaux et colis des rennes.</p>`;
  }
  else if (panel === 'build'){
    const cat = panelArg || 'prod';
    const list = Object.entries(BUILDINGS).filter(([k, b]) => T.catOf(b) === cat && !b.max);
    h = hd(`Bâtisseurs ${T.builders(S) - T.busyBuilders(S)} / ${T.builders(S)} libres`, 'Construire') + `<div class="tabs">${T.CATS.map(([k, l]) => `<button class="${k === cat ? 'on' : ''}" data-a="cat" data-k="${k}">${l}</button>`).join('')}</div>
      <div class="grid">${list.map(([k, b]) => { const why = T.buildBlock(S, k), hard = why && why !== 'Ressources insuffisantes', c = T.upCost(k, 1), n = T.countOf(S, k), m = T.maxOf(S, k);
        const role = b.kind === 'prod' ? `+${fmt(T.rate(k, 1))} ${ITEMS[b.res].name.toLowerCase()}/h` : b.kind === 'house' ? `+${T.housing(1)} lutins` : b.kind === 'storage' ? `+${fmt(T.storageAdd(1))} de stock` : b.kind === 'deco' ? `+${b.joy} bonheur` : b.desc.split('.')[0];
        return `<button class="card ${hard ? 'locked' : ''}" data-a="place" data-k="${k}"><img src="${thumbs[k]}" alt=""><b>${b.name}</b><span class="meta">${role}</span>${m < 99 ? `<span class="meta">${n} / ${m}</span>` : ''}${hard ? `<span class="why">${why}</span>` : `<span class="costs">${costChips(c)}${T.upTime(k, 1) ? `<span class="chip time">${fmtTime(T.upTime(k, 1))}</span>` : ''}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'expand'){
    const {cx, cy} = panelArg, n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n);
    h = hd('Agrandir le village', T.zoneName(cx, cy)) + `<p>Dégage cette forêt pour agrandir ton village de 121 cases.</p><div class="lines">${need(c)}</div>
      <button class="btn green wide" data-a="expand" ${T.has(S, c) ? '' : 'disabled'}>Agrandir</button><p class="meta">Les haches et les scies s'obtiennent avec les lettres, le cadeau du jour et les mini-jeux.</p>`;
  }
  else if (panel === 'site'){
    const o = panelArg, end = workEnd(o), total = o.build ? o.btotal : o.utotal, left = Math.max(0, end - now()), st = speedCost(o);
    h = hd(o.build ? 'Construction' : `Amélioration vers le niveau ${o.upTo}`, B(o).name) + `<div class="work"><div class="bar"><i data-end="${end}" data-total="${total || 1}"></i></div><span>Encore <b data-until="${end}"></b></span></div>
      <div class="acts">${st ? `<button class="btn gold" data-a="speed">Terminer · <i class="i star"></i>${st}</button>` : '<button class="btn green" data-a="speed">Terminer gratuitement</button>'}</div>
      <p class="meta">Moins de 3 minutes restantes : c'est gratuit.</p>`;
  }
  else if (panel === 'bld'){
    // fiche d'un bâtiment, comme Dragons of Atlantis : ce qu'il fait, ce que change le prochain niveau, le coût
    const o = panelArg, b = B(o), max = b.kind === 'hq' ? b.max : T.maxLv(S), next = o.lv + 1, c = T.upCost(o.type, next), why = T.upBlock(S, o);
    const t0 = tierOf(o.lv), t1 = tierOf(next), img0 = t0 > 1 ? thumbs[o.type + ':' + t0] : thumbs[o.type], img1 = t1 > 1 ? thumbs[o.type + ':' + t1] : thumbs[o.type];
    const rows = T.stats(S, o).map(r => `<div class="srow"><span>${r.label}</span><b>${r.now}</b>${o.lv < max ? `<i class="arrow"></i><em>${r.next}</em>` : ''}</div>`).join('');
    let extra = '';
    if (b.kind === 'prod'){ const n = T.stored(S, o), buf = T.buffer(o.type, o.lv); extra = `<div class="work"><div class="bar"><i style="width:${n / buf * 100}%"></i></div><span>${fmt(n)} / ${fmt(buf)} ${ITEMS[b.res].name.toLowerCase()} dans le bâtiment${T.workRatio(S) < 1 ? ' · <b class="bad">pas assez de lutins !</b>' : ''}</span></div>${ripe(o) ? '<button class="btn gold wide" data-a="collect">Récolter</button>' : ''}`; }
    if (b.kind === 'stable') extra = '<div class="acts"><button class="btn green" data-a="goexp">Expéditions</button><button class="btn blue" data-a="games">Mini-jeux</button></div>';
    if (b.kind === 'mine') extra = '<button class="btn green wide" data-a="gomine">Creuser</button>';
    if (b.kind === 'hq'){ const nu = T.unlocksAtHq(next); extra = (nu.length ? `<p class="meta">Au niveau ${next} : ${nu.join(', ')}</p>` : '') + `<button class="btn gold wide" data-a="golights">Illuminations du village · niv. ${T.lightsLv(S)}</button>`; }
    const K = KEEPER[o.type] || KEEPER.cabin, said = keeperLine(o);
    h = hd(`Niveau ${o.lv}${b.kind === 'hq' ? '' : ` / ${max}`}`, b.name) + `<div class="scene sc-${b.kind}"><img class="bimg" src="${img0}" alt=""><img class="keeper" src="${K.img()}" alt=""><div class="say"><b>${K.name}</b><span>${said}</span></div>${o.lv < max && t1 !== t0 ? `<div class="nextlook"><img src="${img1}" alt=""><small>Niv. ${next}</small></div>` : ''}</div>
      ${extra}${b.kind === 'prod' ? keeperBox(o) : ''}<h3>${o.lv < max ? `Niveau ${o.lv} → ${next}` : 'Niveau actuel'}</h3><div class="stats">${rows}</div>
      ${o.lv < (b.kind === 'hq' ? b.max : 99) ? `<h3>Coût de l'amélioration</h3><div class="costs">${costChips(c)}<span class="chip time">${fmtTime(T.upTime(o.type, next))}</span></div>
      <div class="acts"><button class="btn green" data-a="upgrade" ${why ? 'disabled' : ''}>Améliorer</button><button class="btn blue sm" data-a="move">Déplacer</button></div>${why ? `<p class="note">${why}</p>` : ''}` : ''}`;
  }
  else if (panel === 'info'){
    const o = panelArg, b = B(o);
    h = hd(b.kind === 'deco' && !o.wild ? `+${b.joy} bonheur` : '', o.wild ? 'Sapin enneigé' : b.name) + `<p>${o.wild ? 'Un sapin de la forêt. Coupe-le pour faire de la place.' : b.desc}</p><div class="acts">${o.wild ? '' : '<button class="btn blue" data-a="move">Déplacer</button>'}<button class="btn red" data-a="sell">${o.wild ? 'Couper' : 'Vendre'}</button></div>`;
  }
  if (h !== panelHtml){ panelHtml = h; $('#sheet').innerHTML = h; }
  for (const n of $('#sheet').querySelectorAll('[data-until]')) n.textContent = fmtTime((+n.dataset.until - now()) / 1000);
  // barres qui avancent : mises à jour sur place (redessiner la fenêtre ferait perdre les touchers)
  for (const n of $('#sheet').querySelectorAll('[data-end]')) n.style.width = Math.min(100, Math.max(0, (1 - (+n.dataset.end - now()) / +n.dataset.total) * 100)) + '%';
}
// pendant qu'on touche la fenêtre (et juste après), on ne la redessine pas : sinon le bouton est remplacé sous le doigt
let sheetDown = 0;
$('#sheet').addEventListener('pointerdown', () => { sheetDown = Infinity; });
addEventListener('pointerup', () => { if (sheetDown === Infinity) sheetDown = performance.now() + 250; });
addEventListener('pointercancel', () => { sheetDown = 0; });
const sheetHeld = () => performance.now() < sheetDown;
$('#sheet').addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'close') return closePanel();
  if (a === 'play') return playGame(b.dataset.k);
  if (a === 'deliver') return deliver(+b.dataset.i, b);
  if (a === 'osel'){ selOrder = +b.dataset.i; sfx.tap(); return renderPanel(); }
  if (a === 'trash'){ S.orders[+b.dataset.i] = {wait: now() + 20000}; sfx.tap(); return renderPanel(); }
  if (a === 'queue') return queueToy(panelArg, b.dataset.k);
  if (a === 'toys'){ collectToys(panelArg, b); return renderPanel(); }
  if (a === 'collect'){ collectBld(panelArg); return renderPanel(); }
  if (a === 'albumclaim'){ const all = {}; for (const [k, st] of T.albumClaimable(S)){ S.album[k] = Math.max(S.album[k] || 0, st); for (const [r, n] of Object.entries(T.albumReward(k, st))) all[r] = (all[r] || 0) + n; } closePanel(); return bravo(all, 'Album des jouets'); }
  if (a === 'advent'){ const d = +b.dataset.d; if (!T.adventCan(S, d)) return; S.advent[d] = 1; closePanel(); return bravo(T.ADVENT[d - 1], `Calendrier de l'Avent · jour ${d}`); }
  if (a === 'upgrade') return startUpgrade(panelArg, b);
  if (a === 'keeper'){ const o = panelArg, why = T.keeperBlock(S, o); if (why){ sfx.err(); return toast(why); } if (B(o).kind === 'prod') collectBld(o); T.take(S, T.keeperCost(o)); o.keeper = (o.keeper || 0) + 1; o.t = Math.min(o.t, now()); sfx.level(); toast(o.keeper === 1 ? `${(KEEPER[o.type] || KEEPER.cabin).name} est engagé !` : `Gardien ★${o.keeper} : +${Math.round((T.keeperMult(o) - 1) * 100)} % de production`); T.track(S, 'keeper'); save(); panelHtml = ''; return renderPanel(); }
  if (a === 'games') return openPanel('games');
  if (a === 'goexp') return openPanel('exp', panelArg);
  if (a === 'gomine') return openPanel('mine', panelArg);
  if (a === 'golights') return openPanel('lights');
  if (a === 'bldinfo'){ const o = panel === 'mine' ? T.mineState(S)?.o : panelArg; return o && openPanel('bld', o); }
  if (a === 'dig') return digCell(+b.dataset.i, b);
  if (a === 'down'){ if (T.mineDown(S)){ sfx.level(); toast(`Étage ${S.mine.floor} !`); T.track(S, 'floor'); save(); } return renderPanel(); }
  if (a === 'refill'){ const st = T.mineState(S); if (!st) return; if (S.stars < T.PICK_REFILL){ sfx.err(); return openPanel('shop'); } S.stars -= T.PICK_REFILL; st.M.picks = st.max; st.M.t = now(); sfx.level(); save(); return renderPanel(); }
  if (a === 'expgo'){ const why = T.expStart(S, b.dataset.k, now()); if (why){ sfx.err(); return toast(why); } sfx.level(); T.track(S, 'exp'); toast('Les rennes sont partis !'); save(); return renderPanel(); }
  if (a === 'expspeed'){ const e = (S.exps || [])[+b.dataset.i]; if (!e) return; const st = T.speedStars(e.end - now()); if (S.stars < st){ sfx.err(); return openPanel('shop'); } S.stars -= st; e.end = now(); checkExps(); return renderPanel(); }
  if (a === 'builder'){ const n = S.extraBuilders || 0, p = T.BUILDER_PRICE[n]; if (p == null) return; if (S.stars < p){ sfx.err(); return toast(`Il faut ${p} étoiles d'or`); } S.stars -= p; S.extraBuilders = n + 1; sfx.level(); toast(`Bâtisseur ${n + 3} engagé !`); save(); return renderPanel(); }
  if (a === 'buy'){ sfx.tap(); return toast('Les achats arriveront avec la version App Store'); }
  if (a === 'lights'){ const why = T.lightsUp(S); if (why){ sfx.err(); return toast(why); } sfx.level(); gainXp(2, b); T.track(S, 'lights'); toast(`Illuminations niv. ${S.lights} : production +${S.lights} %`); save(); return renderPanel(); }
  if (a === 'cat'){ panelArg = b.dataset.k; sfx.tap(); return renderPanel(); }
  if (a === 'place') return startPlace(b.dataset.k);
  if (a === 'expand'){ const {cx, cy} = panelArg, n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n); if (!T.has(S, c)) return; T.take(S, c); S.chunks.push(`${cx},${cy}`); T.track(S, 'expand'); gainXp(30 + n * 20, b); sfx.level(); toast('Nouveau terrain !'); closePanel(); save(); return; }
  if (a === 'speed'){ const o = panelArg; if (!workEnd(o)) return closePanel(); const st = speedCost(o); if (S.stars < st){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop'); } S.stars -= st; if (o.build) o.build = now(); else o.up = now(); closePanel(); tutoEv('speed'); return; }
  if (a === 'move'){ const o = panelArg; closePanel(); ghost = {type: o.type, x: o.x, y: o.y, move: o}; showGhostUI(); return; }
  if (a === 'sell'){ const o = panelArg; S.objs = S.objs.filter(x => x !== o); if (o.wild) gainXp(1, null); else if (!o.free) S.coins += Math.round((BUILDINGS[o.type].cost.coins || 0) / 2); closePanel(); save(); return; }
});

/* ---------- placement d'un nouveau bâtiment ---------- */
function startPlace(type, lot){
  const why = T.buildBlock(S, type); if (why){ sfx.err(); return toast(why); }
  closePanel();
  const t = toTile(W / 2, H / 2), b = BUILDINGS[type];
  ghost = {type, x: Math.round(t.x - b.w / 2), y: Math.round(t.y - b.h / 2)};
  if (!lot) lot = T.lotsShown(S).find(l => l.type === type);
  if (lot){ clearWild(lot.type, lot.x, lot.y); ghost.x = lot.x; ghost.y = lot.y; centerOn(lot.x + b.w / 2, lot.y + b.h / 2); showGhostUI(); tutoEv('placing'); return; }
  // cherche une place libre près du centre de l'écran
  outer: for (let r = 0; r < 12; r++) for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++){ if (fits(type, ghost.x + dx, ghost.y + dy)){ ghost.x += dx; ghost.y += dy; break outer; } }
  showGhostUI(); tutoEv('placing');
}
// les sapins sauvages laissent la place quand on construit sur un terrain réservé
function clearWild(type, x, y){ const b = BUILDINGS[type]; S.objs = S.objs.filter(o => !(o.wild && x < o.x + 1 && x + b.w > o.x && y < o.y + 1 && y + b.h > o.y)); }
function showGhostUI(){ document.body.classList.add('placing'); $('#placebar').hidden = false; updateGhostUI(); }
function updateGhostUI(){ const ok = fits(ghost.type, ghost.x, ghost.y, ghost.move); $('#pb-ok').disabled = !ok; }
$('#pb-ok').addEventListener('click', () => {
  if (!ghost || !fits(ghost.type, ghost.x, ghost.y, ghost.move)) return;
  if (ghost.move){ ghost.move.x = ghost.x; ghost.move.y = ghost.y; }
  else {
    const b = BUILDINGS[ghost.type], cost = T.upCost(ghost.type, 1), why = T.buildBlock(S, ghost.type);
    if (why){ sfx.err(); return toast(why); }
    T.take(S, cost);
    const o = {id: 'o' + now() + Math.random().toString(36).slice(2, 5), type: ghost.type, x: ghost.x, y: ghost.y, lv: 1, t: now()};
    const ms = T.upTime(ghost.type, 1) * 1000; if (ms){ o.build = now() + ms; o.btotal = ms; }
    if (b.kind === 'craft') o.q = [];
    if (b.kind === 'deco') gainXp(b.joy, null);
    S.objs.push(o); T.track(S, 'build:' + o.type); sfx.build(); tutoEv('placed');
    if (o.type === 'path' && T.has(S, T.upCost('path', 1))){ // les allées se posent à la suite, comme les routes de Township
      const nx = ghost.x + (ghost.dir || 1), ny = ghost.y; ghost = {type: 'path', x: fits('path', nx, ny) ? nx : ghost.x, y: ny, dir: ghost.dir}; save(); updateGhostUI(); return; }
  }
  ghost = null; $('#placebar').hidden = true; document.body.classList.remove('placing'); save();
});
$('#pb-no').addEventListener('click', () => { ghost = null; $('#placebar').hidden = true; document.body.classList.remove('placing'); });
$('#b-build').addEventListener('click', () => { sfx.tap(); openPanel('build', 'prod'); });
$('#b-barn').addEventListener('click', () => { sfx.tap(); openPanel('stock'); });
$('#b-orders').addEventListener('click', () => { sfx.tap(); const o = S.objs.find(o => o.type === 'orders'); if (o) centerOn(o.x + 1.5, o.y + 1.5); openPanel('orders'); });
$('#veil').addEventListener('click', () => closePanel());

/* ---------- chaque bâtiment a son gardien, qui explique son rôle (comme les managers de Bid Master) ---------- */
const elfImg = () => ICON.mg_elf, santaImg = () => portrait;
const KEEPER = {
  santa:    {name: 'Le vieux Père Noël', img: santaImg},
  sawmill:  {name: 'Sven le bûcheron', img: elfImg},
  letters:  {name: 'Lutine Plume', img: elfImg},
  bakery:   {name: 'Mère Michou', img: elfImg},
  mill:     {name: 'Lutine Bobine', img: elfImg},
  cabin:    {name: 'Lutin Pantoufle', img: elfImg},
  storage:  {name: 'Gros Ours', img: elfImg},
  workshop: {name: 'Maître Rouage', img: elfImg},
  orders:   {name: 'Facteur Grelot', img: elfImg},
  stable:   {name: 'Dame Rennes', img: elfImg},
  theater:  {name: 'Monsieur Fil', img: elfImg},
  mine:     {name: 'Pic le mineur', img: elfImg},
};
function keeperLine(o){
  const b = B(o), L = o.lv, N = L + 1, f = fmt;
  switch (b.kind){
    case 'prod': return T.workRatio(S) < 1 ? `Il me manque des lutins ! Construis un chalet, sinon je produis moins.` : `Je fais <b>${f(T.rate(o.type, L))} ${ITEMS[b.res].name.toLowerCase()}/h</b>. Améliore-moi et j'en ferai <b>${f(T.rate(o.type, N))}</b> !`;
    case 'house': return `Je loge <b>${T.housing(L)} lutins</b>. Ce sont eux qui font tourner les ateliers.`;
    case 'storage': return `Je garde <b>+${f(T.storageAdd(L))}</b> de bois, biscuits et tissu. Sans moi, ce qui dépasse est perdu !`;
    case 'craft': return `Je fabrique les jouets des lettres, <b>${T.craftSlots(L)} à la fois</b>. Plus je monte, plus je vais vite.`;
    case 'orders': return `Les enfants m'envoient leurs lettres. J'en garde <b>${T.orderSlots(L)}</b> et je paie <b>+${Math.round((T.orderBonus(L) - 1) * 100)} %</b>.`;
    case 'stable': return `Mes rennes partent en expédition : <b>${T.expSlots(L)} équipe${T.expSlots(L) > 1 ? 's' : ''}</b> en même temps, <b>${T.EXP_DEST.filter(d => d.lv <= L).length} destination${T.EXP_DEST.filter(d => d.lv <= L).length > 1 ? 's' : ''}</b>. Elles reviennent avec des colis mystère !`;
    case 'mine': return `J'ai <b>${T.minePicks(L)} pioches</b>, une de plus toutes les <b>${T.minePickMin(L)} min</b>. Plus on descend, plus c'est riche !`;
    case 'fun': return `Mes spectacles donnent <b>+${T.theaterJoy(L)} bonheur</b> : toute la production augmente.`;
    case 'hq': return `Ma maison fixe le niveau de tout le village : jusqu'au <b>niveau ${L + 1}</b>. Améliore-la pour débloquer de nouveaux bâtiments !`;
  }
  return b.desc;
}

function keeperBox(o){
  const k = o.keeper || 0, why = T.keeperBlock(S, o), stars = '★'.repeat(k) + '☆'.repeat(T.KEEPER_MAX - k);
  if (T.hqLv(S) < T.keeperHq) return `<div class="kbox klock"><b>Gardien</b><span>Se débloque avec la Maison du Père Noël niv. ${T.keeperHq} : il récoltera tout seul pour toi.</span></div>`;
  return `<div class="kbox"><div><b>${k ? `Gardien engagé <i class="kst">${stars}</i>` : 'Engager le gardien'}</b><span>${k ? `Récolte automatique · production <b>+${Math.round((T.keeperMult(o) - 1) * 100)} %</b>${k < T.KEEPER_MAX ? ` → <b>+${Math.round(k * 10)} %</b>` : ''}` : 'Il récoltera tout seul dans le stock du village, même quand tu ne joues pas.'}</span></div>
    ${k < T.KEEPER_MAX ? `<button class="btn ${k ? 'gold' : 'green'} sm" data-a="keeper" ${why && why !== 'Ressources insuffisantes' ? 'disabled' : ''}>${k ? 'Améliorer' : 'Engager'}<span class="costs">${costChips(T.keeperCost(o))}</span></button>` : ''}</div>`;
}

/* ---------- grotte, expéditions, colis ---------- */
function cellIcon(c){
  if (c.k === 'stairs') return '<i class="stairs"></i>';
  if (c.k === 'parcel') return `<i class="pbox" style="--rc:${T.RARITY[c.r || 0].c}"></i>`;
  if (c.k === 'pick') return '<i class="pk"></i>';
  if (c.k === 'rock') return '';
  return `<img src="${ICON[c.got || c.k] || ICON.coins}" alt="">`;
}
function digCell(i, el){
  const res = T.mineDig(S, i, now());
  if (res.err){ sfx.err(); toast(res.err); if (res.err === 'Plus de pioches') return openPanel('shop'); return; }
  const c = S.mine.cells[i], r = res.r; c.got = Object.keys(r).find(k => k !== 'picks' && k !== 'parcel');
  if (r.parcel != null) c.r = r.parcel;
  T.track(S, 'dig');
  const give = {}; for (const [k, n] of Object.entries(r)) if (k !== 'picks' && k !== 'parcel') give[k] = n;
  if (Object.keys(give).length) giveReward(give, el); else sfx.tap();
  if (res.k === 'stairs') toast("L'escalier ! Tu peux descendre.");
  if (res.k === 'pick') toast('+2 pioches !');
  if (r.parcel != null) toast(`Un colis ${T.RARITY[r.parcel].name.toLowerCase()} !`);
  save(); renderPanel();
}
function checkExps(){
  const back = T.expCollect(S, now()); if (!back.length) return;
  toast(`Les rennes sont rentrés avec ${back.length} colis !`); sfx.level(); save();
}
function openParcel(){
  const list = S.parcels || []; if (!list.length) return toast("Pas de colis : envoie les rennes en expédition ou creuse la grotte");
  const r = list[0], R = T.RARITY[r], m = $('#modal'); m.className = 'glow parcelm';
  m.querySelector('.mcard').innerHTML = `<small>Colis ${1} sur ${list.length}</small><h2 class="stroke" style="color:${R.c}">Colis ${R.name.toLowerCase()}</h2><div class="pbig r${r}" style="--rc:${R.c}"><i></i></div><button class="btn green" data-m="open">Ouvrir</button>`;
  m.hidden = false; sfx.tap();
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; const box = m.querySelector('.pbig'); box.classList.add('shake'); b.disabled = true;
    setTimeout(() => { list.shift(); const rw = T.parcelReward(S, r); T.track(S, 'parcel'); save(); bravo(rw, `Colis ${R.name.toLowerCase()}`, r >= 2 ? (r === 3 ? 'LÉGENDAIRE !' : 'ÉPIQUE !') : null); }, 650); };
}
$('#b-parcels').addEventListener('click', () => openParcel());
for (const id of ['#h-stars', '#h-coins']) $(id).addEventListener('click', () => { sfx.tap(); openPanel('shop'); });

/* ---------- écran « Bravo ! » (récompenses en grand, puis elles volent vers les compteurs) ---------- */
let pendingStory = -1;
function story(i){
  const c = T.CHAPTERS[i], m = $('#modal'); m.className = 'glow';
  m.querySelector('.mcard').innerHTML = `<small>Chapitre ${i + 1}</small><h2 class="stroke">${c.title}</h2><div class="storyrow"><img src="${portrait}" alt=""><p>${c.story}</p></div><button class="btn green" data-m="ok">C'est parti !</button>`;
  m.hidden = false; m.onclick = e => { if (e.target.closest('[data-m]')) m.hidden = true; };
}
function bravo(r, sub = 'Tu as gagné', title = 'BRAVO !'){
  const m = $('#modal'); m.className = 'cere bravo';
  const cards = Object.entries(r).filter(([, n]) => n).map(([k, n]) => `<div class="rcard r-${k}">${k === 'xp' ? '<i class="i xp">XP</i>' : k === 'stars' ? '<i class="i star"></i>' : `<img src="${ICON[k]}" alt="">`}<b>${fmt(n)}</b></div>`).join('');
  m.querySelector('.mcard').innerHTML = `<div class="rays"></div><h2>${title}</h2><small>${sub}</small><div class="rcards">${cards}</div><button class="okc" data-m="ok" aria-label="OK"></button>`;
  m.hidden = false; sfx.level();
  m.onclick = e => { if (!e.target.closest('[data-m]')) return; m.hidden = true; giveReward(r, m.querySelector('.rcards') || $('#quest2')); if (pendingStory >= 0){ const k = pendingStory; pendingStory = -1; setTimeout(() => story(k), 900); } };
}

/* ---------- tâche en cours (carte en bas à gauche) ---------- */
let questHtml = '';
function rewardChips(r){ return Object.entries(r).filter(([, n]) => n).map(([k, n]) => `<span class="chip">${k === 'xp' ? '<i class="i xp">XP</i>' : k === 'stars' ? '<i class="i star"></i>' : icon(k)}${fmt(n)}</span>`).join(''); }
function renderQuest(){
  const {q, v, done} = T.questProgress(S);
  const ch = T.chapterOf(S.quest.i), ct = T.CHAPTERS[ch];
  const h = `<span class="tag">${ct ? `Chapitre ${ch + 1}` : 'Tâche'}</span>${ct ? `<small class="chap">${ct.title}</small>` : ''}<b>${q.t}</b><span class="qbar"><i style="width:${v / q.n * 100}%"></i><em>${v} / ${q.n}</em></span><span class="costs">${done ? '<span class="claim">Récupérer</span>' : rewardChips(q.r)}</span>`;
  if (h !== questHtml){ questHtml = h; $('#quest2').innerHTML = h; $('#quest2').classList.toggle('done', done); }
}
function giveReward(r, el){
  for (const [k, n] of Object.entries(r)){
    if (!n || k === 'xp') continue;
    if (k === 'stars'){ S.stars += n; continue; }
    const room = T.RES.includes(k) ? Math.max(0, T.cap(S, k) - S[k]) : Infinity, g = Math.min(n, room);
    if (g){ T.give(S, k, g); fly(k, g, el); }
  }
  if (r.xp) gainXp(r.xp, el);
  sfx.collect(); save();
}
$('#quest2').addEventListener('click', e => {
  const el = $('#quest2'), r = T.questClaim(S);
  if (r){ const before = T.chapterOf(S.quest.i - 1), after = T.chapterOf(S.quest.i); bravo(r, 'Tâche terminée'); if (after !== before && T.CHAPTERS[after]) pendingStory = after; questHtml = ''; renderQuest(); }
  else { sfx.tap(); const {q} = T.questProgress(S); toast(q.t); }
});
/* ---------- cadeau du jour (série de 7 jours) ---------- */
function openDaily(){
  const ready = T.dailyReady(S), next = ready ? (S.daily.last === T.yesterday() ? S.daily.streak : 0) % 7 : (S.daily.streak - 1) % 7;
  const m = $('#modal'); m.className = 'glow';
  m.querySelector('.mcard').innerHTML = `<small>Reviens chaque jour !</small><h2 class="stroke">Cadeau du jour</h2>
    <div class="daily">${T.DAILY.map((r, i) => `<div class="dd ${i < next || (!ready && i === next) ? 'got' : ''} ${i === next && ready ? 'today' : ''} ${i === 6 ? 'big' : ''}"><small>Jour ${i + 1}</small><div class="costs">${rewardChips(r)}</div></div>`).join('')}</div>
    ${ready ? '<button class="btn green" data-m="claim">Récupérer</button>' : '<p>Reviens demain pour la suite de ta série !</p><button class="btn blue" data-m="close">OK</button>'}`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; if (b.dataset.m === 'claim'){ const r = T.dailyClaim(S); if (r){ bravo(r, `Cadeau du jour · série de ${S.daily.streak} jour${S.daily.streak > 1 ? 's' : ''}`); return; } } m.hidden = true; };
}
const dayKey = t => { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
$('#b-daily').addEventListener('click', () => { sfx.tap(); openDaily(); });
$('#b-games').addEventListener('click', () => { sfx.tap(); openPanel('games'); });
$('#b-album').addEventListener('click', () => { sfx.tap(); openPanel('album'); });
$('#b-advent').addEventListener('click', () => { sfx.tap(); openPanel('advent'); });
$('#b-tgames').addEventListener('click', () => { sfx.tap(); openPanel('games'); });
$('#b-village').addEventListener('click', () => { sfx.tap(); closePanel(); const o = S.objs.find(o => o.type === 'santa'); if (o){ centerOn(o.x + 2, o.y + 2); cam.z = startZoom(); } });

/* ---------- mini-jeux (Tournée de Noël, Bataille de boules de neige) ---------- */
let TMAX = 3; const TEVERY = 15 * 60e3;   // tickets (plus avec l'Écurie), 1 de plus toutes les 15 minutes
function tickets(){
  { const st = findType('stable'); TMAX = st ? T.ticketsMax(st.lv) : 3; }
  S.games ||= {tickets: TMAX, t: now(), best: {}};
  const g = S.games;
  if (g.tickets >= TMAX){ g.t = now(); return g; }
  const n = Math.floor((now() - g.t) / TEVERY);
  if (n > 0){ g.tickets = Math.min(TMAX, g.tickets + n); g.t += n * TEVERY; }
  return g;
}
function gameReward(k, score){
  const st = findType('stable'), m = (1 + S.lvl * .15) * (k === 'sleigh' && st ? T.gameBonus(st.lv) : 1);
  const r = k === 'sleigh' ? {coins: Math.round(score * 2.5 * m), xp: Math.round((6 + score / 5) * m), stars: score >= 160 ? 3 : score >= 80 ? 1 : 0}
                            : {coins: Math.round(score * 6 * m), xp: Math.round((6 + score) * m), stars: score >= 45 ? 2 : score >= 25 ? 1 : 0};
  if (score >= (k === 'sleigh' ? 60 : 20)) r[Math.random() < .6 ? 'axe' : 'saw'] = 1;
  return r;
}
function playGame(k){
  const g = tickets();
  if (g.tickets < 1){ sfx.err(); return toast(`Plus de tickets : le prochain dans ${fmtTime((g.t + TEVERY - now()) / 1000)}`); }
  if (g.tickets === TMAX) g.t = now();
  g.tickets--; save(); closePanel(); document.body.classList.add('in-game');
  openMinigame(k, {
    icons: {sleigh: ICON.mg_sleigh, gift: ICON.mg_gift, elf: ICON.mg_elf, deer: ICON.mg_deer, gold: ICON.mg_gold},
    sfx: {...sfx, bells: sfx.level, whoosh: sfx.pop, splat: sfx.pop}, best: kk => S.games.best[kk] || 0, setBest: (kk, v) => { S.games.best[kk] = v; save(); },
    chipsHtml: rewardChips, reward: gameReward,
    grant: (rw, el) => { giveReward(rw, el); T.track(S, 'games'); },
    onScore: () => {}, onClose: () => { document.body.classList.remove('in-game'); },
  });
}

/* ---------- montée de niveau ---------- */
let lvQueue = [], lvShowing = false;
function nextLevelUp(){ const L = lvQueue.shift(); if (L) levelUp(L); }
function levelUp(L){
  lvShowing = true; const news = T.unlocksAt(L);
  sfx.level();
  const m = $('#modal'); m.className = 'cere';
  m.querySelector('.mcard').innerHTML = `<div class="rays"></div><small>Bravo !</small><h2>Niveau ${L} !</h2><div class="glow"><img src="${elfPortrait}" alt=""></div>
    ${news.length ? `<p>Nouveau :</p><div class="costs">${news.map(n => `<span class="chip">${n}</span>`).join('')}</div>` : '<p>Continue comme ça !</p>'}
    <div class="costs"><span class="chip">${icon('coins')}+${20 + L * 10}</span><span class="chip"><i class="i star"></i>+1</span></div>
    <button class="btn green" data-m="close">Continuer</button>`;
  m.hidden = false; S.coins += 20 + L * 10; S.stars += 1;
  m.onclick = e => { if (e.target.closest('[data-m]')){ m.hidden = true; lvShowing = false; if (lvQueue.length) setTimeout(nextLevelUp, 250); } };
  save();
}

/* =====================================================================
   DIDACTICIEL (Pépin)
   ===================================================================== */
const rectOf = pred => () => { const o = S.objs.find(pred); if (!o) return null; const r = objScreenRect(o); return {left: r.left + r.width * .15, top: r.top + r.height * .15, width: r.width * .7, height: r.height * .7}; };
const STEPS = [
  {say: "Ho ho ho ! Je prends ma retraite… <b>c'est toi le nouveau Père Noël</b> ! Je vais te montrer.", tap: true},
  {say: "La scierie a produit du bois. <b>Touche-la</b> pour le récolter !", target: rectOf(o => o.type === 'sawmill'), wait: 'collect:sawmill', focus: [14.5, 16.5]},
  {say: "Les lettres des enfants arrivent avec des pièces. <b>Récolte le Bureau des lettres.</b>", target: rectOf(o => o.type === 'letters'), wait: 'collect:letters', focus: [26.5, 16.5]},
  {say: "Chaque bâtiment a son rôle. <b>Touche la scierie</b> pour voir sa fiche.", target: rectOf(o => o.type === 'sawmill'), wait: 'open:bld', focus: [14.5, 16.5]},
  {say: "Chaque niveau produit plus de bois. <b>Touche Améliorer !</b>", target: () => document.querySelector('[data-a="upgrade"]'), wait: 'upgrade'},
  {say: "Les lutins travaillent… Sous 3 minutes, c'est gratuit : <b>touche le chantier.</b>", target: rectOf(o => o.type === 'sawmill'), wait: 'open:site'},
  {say: "<b>Termine gratuitement !</b>", target: () => document.querySelector('[data-a="speed"]'), wait: 'speed'},
  {say: "Les lutins ont besoin de biscuits pour les gros chantiers. <b>Touche Construire.</b>", target: () => document.querySelector('#b-build'), wait: 'open:build'},
  {say: "Choisis le <b>Four à biscuits</b>.", target: () => document.querySelector('[data-a="place"][data-k="bakery"]'), wait: 'placing'},
  {say: "Glisse-le où tu veux, puis touche <b>✓</b>.", target: () => document.querySelector('#pb-ok'), wait: 'placed'},
  {say: "Parfait ! Suis les <b>tâches</b> en bas à gauche : chaque bâtiment a son utilité, à toi de faire grandir le village !", tap: true, end: true},
];
const tuto = createTuto({getState: () => S, save, sfx, portrait: elfPortrait, steps: STEPS, name: 'Père Noël', focusPlot: ([x, y]) => centerOn(x, y)});
function tutoEv(n){ tuto.event(n); }

/* =====================================================================
   BOUCLE
   ===================================================================== */
let last = performance.now(), hudT = 0, saveT = 0, panelT = 0;
function frame(t){
  requestAnimationFrame(frame);
  // horloge de l'image : jamais négative (le 1er horodatage peut précéder la fin du chargement)
  const dt = Math.max(0, Math.min(.05, (t - last) / 1000)); last = Math.max(last, t);
  try { step(t, dt); } catch(e){ if (!frame.err){ frame.err = 1; console.error('frame', e && e.stack); window.showErr?.(e && e.message); } }
}
let autoT = 0;
/** Les gardiens récoltent tout seuls (en silence, avec un petit effet si le bâtiment est à l'écran). */
function autoCollect(){
  for (const o of S.objs){ if (!o.keeper || B(o).kind !== 'prod' || !ripe(o)) continue; const k = B(o).res, got = T.collect(S, o); if (got > 0){ T.track(S, 'collect:' + k, got); const c = toScreen(o.x + 1.5, o.y + 1.5); if (c.x > 0 && c.x < W && c.y > 0 && c.y < H) fxHarvest(o, k, got); } }
}
function step(t, dt){
  autoT -= dt; if (autoT <= 0){ autoT = 3; autoCollect(); checkExps(); }
  fxDt = dt;
  refreshOrders(); finishWorks(); moveElves(dt);
  for (const f of flakes){ f.y += f.v * dt * .12; f.x += Math.sin(t / 1000 + f.s * 7) * dt * .01; if (f.y > 1) { f.y = 0; f.x = Math.random(); } }
  draw();
  hudT -= dt; if (hudT <= 0){ hudT = .2; hud(); }
  panelT -= dt; if (panel && panelT <= 0 && !sheetHeld()){ panelT = .3; renderPanel(); }
  saveT -= dt; if (saveT <= 0){ saveT = 4; save(); }
}
requestAnimationFrame(frame);
addEventListener('visibilitychange', () => { if (document.hidden) save(); });
addEventListener('pointerdown', () => sfx.tap(), {once: true});
// entrée directe dans le village (pas de menu titre)
setTimeout(() => { $('#intro').classList.add('hide'); document.body.classList.add('playing'); setTimeout(() => $('#intro').remove(), 700); if (tuto.active()){ const BACK = {4: 3, 6: 5, 8: 7, 9: 7}; if (BACK[S.tuto]) S.tuto = BACK[S.tuto]; setTimeout(() => tuto.start(), 700); } }, 400);
if ('serviceWorker' in navigator && location.protocol === 'https:' && !/claude\.ai|claudeusercontent/.test(location.host)) navigator.serviceWorker.register('sw.js').catch(() => {});
window.__v2 = {get S(){ return S; }, cam, SPR, openPanel, tuto, screen: toScreen, centerOn, ICON, hud, gainXp};
