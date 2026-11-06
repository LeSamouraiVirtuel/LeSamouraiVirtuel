// Le Village du Pôle V2 — « Township de Noël » en 2D isométrique.
// Toutes les images (bâtiments, champs, icônes) sont pré-rendues une fois pour toutes depuis les modèles 3D
// (tools/export-pack.mjs → assets/pack/). Le téléphone ne fait que télécharger des images et les poser sur un
// canvas 2D : chargement rapide, fluide, net, et aucune 3D à calculer sur l'appareil.
import {createTuto} from '../tuto.js';
import {openMinigame, GAMES} from '../minigames.js';
import {openBattle, portrait3d} from '../battle3d.js';
import {portrait as villainPortrait} from '../villains.js';
import * as ACC from '../account.js';
import * as T from './town.js';
import * as M from './meta.js';

const {ITEMS, TOYS, BUILDINGS} = T;
const tierOf = lv => lv >= 12 ? 3 : lv >= 5 ? 2 : 1;   // apparence du bâtiment selon son niveau
const $ = s => document.querySelector(s);
const ROOT = new URL('../../', import.meta.url).href;
const Q = new URLSearchParams(location.search);
const EXPORT = Q.has('export');                       // mode « fabrication du pack » (outil hors ligne)
const DPR = EXPORT ? 3 : Math.min(devicePixelRatio || 1, 2);     // ×2 suffit à l'œil et divise par 2,25 le travail du dessin sur iPhone (×3)
const ZOOM0 = 1.1;                                   // densité des images (le zoom par défaut est plus bas : village plus vaste)
const CAM0 = .78;                                   // zoom par défaut : les images y sont affichées pixel pour pixel
const BD = Math.min(DPR * ZOOM0, 3);                // densité des images des bâtiments
const TW = 64, TH = TW / 2;

/* =====================================================================
   CHARGEMENT
   ===================================================================== */
const TIPS = [
  'Touche une ressource en haut de l’écran pour savoir à quoi elle sert et où en trouver.',
  'Glisse le doigt sur plusieurs bâtiments prêts pour tout récolter d’un coup.',
  'Les lettres des enfants rapportent le plus d’expérience : livre-les souvent !',
  'La Maison du Père Noël fixe le niveau maximum de tous les bâtiments.',
  'Un gardien récolte tout seul, même quand tu ne joues pas.',
  'Moins de 3 minutes de chantier ? C’est gratuit : touche « Terminer ».',
  'La Grotte aux cristaux est plus riche à chaque étage : trouve l’escalier !',
  'Plus les rennes vont loin, plus les colis rares sont fréquents.',
  'Les illuminations du village donnent +1 % de production par niveau, pour toujours.',
  'Les étoiles d’or sont rares : garde-les pour un bâtisseur de plus.',
]
let tipI = Math.floor(Math.random() * TIPS.length);
const tip = () => { const e = $('#tip'); if (e) e.textContent = TIPS[tipI++ % TIPS.length]; };
tip(); const tipTimer = setInterval(tip, 3200);
const bar = p => { const i = $('#loadbar i'); if (i) i.style.width = Math.max(3, Math.round(p * 100)) + '%'; };
const SPR = {}, ICON = {}, thumbs = {}, SPRURL = {};
let portrait = '', buildIcon = '';

/** Charge le pack pré-rendu : un JSON + des images WebP. Renvoie false s'il manque. */
async function loadPack(){
  const r = await fetch(ROOT + 'assets/pack/pack.json', {cache: 'no-cache'}).catch(() => null);
  if (!r || !r.ok) return false;
  const P = await r.json(), dir = ROOT + 'assets/pack/', q = '?v=' + P.v;
  const keys = Object.keys(P.spr); let done = 0;
  const img = src => new Promise((ok, ko) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = ko; i.src = src; });
  // Mémoire des iPhone : on ne charge tout de suite que ce qui sert partout (sol, forêts, lutins, chantiers, allées, décor)
  // et les bâtiments du village ; le reste se charge la première fois qu'il apparaît à l'écran.
  let saved0 = null; try { saved0 = JSON.parse(localStorage.getItem('village-du-pole-v5')); } catch(e){}
  const used = new Set((saved0?.objs || []).map(o => o.type));
  for (const k of keys) SPRURL[k] = dir + P.spr[k].f + q;
  const eager = k => !k.includes('@') && (!k.startsWith('b:') || used.has(k.slice(2).split(':')[0]) || /^b:(santa|sawmill|letters|orders|cabin|path|wildtree|tree|lantern|bench|gifts|reindeer|snowman|candy)/.test(k));
  // Décodage en ImageBitmap (blob → createImageBitmap) : l'image est décodée une fois en pleine résolution et
  // n'est plus gérée par le cache d'images de Safari, qui « sous-échantillonne » les grandes images sur iPhone (flou).
  const bitmap = async src => { const r = await fetch(src); if (!r.ok) throw new Error('image ' + src); const bl = await r.blob();
    if (window.createImageBitmap){ try { return await createImageBitmap(bl); } catch(e){} }
    const i = await img(URL.createObjectURL(bl)); return i; };
  window.__sprInfo = {};
  const lazy = (k, m) => { let c = null, busy = false; SPR[k] = {ax: m.ax, ay: m.ay, w: m.w, h: m.h, get canvas(){ if (!c && !busy){ busy = true; bitmap(dir + m.f + q).then(b => { c = b; __sprInfo[k] = b.width + 'x' + b.height; }).catch(() => { busy = false; }); } return c || {complete: false}; }}; };
  const now0 = keys.filter(eager);
  for (const k of keys) if (!eager(k)) lazy(k, P.spr[k]);
  await Promise.all(now0.map(async k => { const m = P.spr[k], b = await bitmap(dir + m.f + q); __sprInfo[k] = (b.width || b.naturalWidth) + 'x' + (b.height || b.naturalHeight);
    SPR[k] = {canvas: b, ax: m.ax, ay: m.ay, w: m.w, h: m.h}; bar(.05 + .9 * ++done / now0.length); }));
  for (const [k, f] of Object.entries(P.icon)) ICON[k] = dir + f + q;
  for (const [k, f] of Object.entries(P.thumb)) thumbs[k] = dir + f + q;
  portrait = dir + P.portrait + q; buildIcon = dir + P.buildIcon + q;
  return true;
}
const packed = !EXPORT && await loadPack().catch(() => false);
if (!packed){
  // secours (ou fabrication du pack) : pré-rendu sur l'appareil à partir des modèles 3D
  $('#loadtxt').textContent = 'Préparation du village…';
  const {bakeAll, bakeWalk, bakePets, bakeSkins} = await import('./baker.js');
  if (Q.get('export') === 'skins'){ const r = await bakeSkins({DPR, BD, base: ROOT + 'assets/', only: Q.get('only') || ''}); window.__export = {SPR: r.SPR, ICON: {}, thumbs: r.thumbs}; throw new Error('export prêt'); }
  if (Q.get('export') === 'pet'){ window.__export = {SPR: {}, ICON: await bakePets({DPR, base: ROOT + 'assets/'}), thumbs: {}}; throw new Error('export prêt'); }
  if (Q.get('export') === 'walk'){ window.__export = {SPR: await bakeWalk({BD, base: ROOT + 'assets/'}), ICON: {}, thumbs: {}}; throw new Error('export prêt'); }
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
const svgU = x => 'data:image/svg+xml,' + encodeURIComponent(x);
const SVGI = {
  shop: svgU(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M12 24h40l-4 30H16z" fill="#e5383b" stroke="#2e202c" stroke-width="3" stroke-linejoin="round"/><path d="M22 24c0-12 20-12 20 0" fill="none" stroke="#2e202c" stroke-width="4"/><path d="M32 30l3 6.5 7 .8-5.2 4.8 1.5 7L32 45.5l-6.3 3.6 1.5-7-5.2-4.8 7-.8z" fill="#ffd34a" stroke="#7a4a05" stroke-width="2" stroke-linejoin="round"/></svg>`),
  missions: svgU(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="14" y="10" width="36" height="46" rx="5" fill="#fff6e6" stroke="#2e202c" stroke-width="3"/><rect x="24" y="6" width="16" height="9" rx="3" fill="#b5652c" stroke="#2e202c" stroke-width="3"/><path d="M20 26l4 4 7-8M20 40l4 4 7-8" fill="none" stroke="#2f9e44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 28h9M36 42h9" stroke="#2e202c" stroke-width="3" stroke-linecap="round"/></svg>`),
  pass: svgU(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8 20h48v8a5 5 0 0 0 0 10v8H8v-8a5 5 0 0 0 0-10z" fill="#ffd34a" stroke="#2e202c" stroke-width="3" stroke-linejoin="round"/><path d="M22 18l4-8 6 6 6-6 4 8" fill="#e5383b" stroke="#2e202c" stroke-width="3" stroke-linejoin="round"/><path d="M32 25l2.6 5.4 5.9.7-4.4 4 1.2 5.8L32 38l-5.3 2.9 1.2-5.8-4.4-4 5.9-.7z" fill="#e5383b" stroke="#2e202c" stroke-width="1.6"/></svg>`),
};
ICON.paper = svgU(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g stroke="#2e202c" stroke-width="3" stroke-linejoin="round"><path d="M10 20l34-10 10 34-34 10z" fill="#e5383b"/><path d="M27 15l10 34" stroke="#ffd34a" stroke-width="6"/><path d="M27 15l10 34" fill="none"/><path d="M16 37l34-10" stroke="#ffd34a" stroke-width="6"/></g><path d="M18 24l4 1M40 18l3 2M44 40l2 3M22 46l3-1" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="34" cy="31" r="6" fill="#ffd34a" stroke="#2e202c" stroke-width="3"/></svg>`);
ICON.ice = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g stroke="#1d2b4a" stroke-width="3" stroke-linejoin="round"><path d="M20 52 12 30l8-16 8 16z" fill="#7fd3ff"/><path d="M44 54 34 26l10-20 10 20z" fill="#a9e6ff"/><path d="M32 58 24 34l8-14 8 14z" fill="#4fb4f5"/></g><path d="M40 12l-4 10M18 20l-3 7" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><ellipse cx="32" cy="58" rx="22" ry="3" fill="#1d2b4a" opacity=".25"/></svg>`);
ICON.cookies = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="33" r="26" fill="#2e202c"/><circle cx="32" cy="31" r="23" fill="#c8793a"/><circle cx="32" cy="31" r="23" fill="none" stroke="#e9a35f" stroke-width="3" stroke-dasharray="4 5"/><circle cx="32" cy="31" r="18" fill="#b5652c"/><circle cx="25" cy="26" r="3.2" fill="#fff6e8"/><circle cx="39" cy="25" r="3.2" fill="#fff6e8"/><circle cx="33" cy="35" r="3.2" fill="#ff4d6a"/><circle cx="24" cy="38" r="2.6" fill="#7ad36b"/><circle cx="41" cy="38" r="2.6" fill="#fff6e8"/><path d="M14 22a20 20 0 0 1 14-12" stroke="#fff" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`);
$('#h-coins img').src = ICON.coins; $('#h-avatar').src = portrait; $('#i-village').src = thumbs.santa;
for (const im of document.querySelectorAll('.resimg')) im.src = ICON[im.dataset.r];
$('#i-orders').src = thumbs.orders; $('#i-daily').src = thumbs.gifts; $('#i-album').src = ICON.train; $('#i-advent').src = ICON.bell; $('#i-games').src = ICON.mg_sleigh; $('#i-parcels').src = thumbs.gifts; ICON.parcel = thumbs.gifts; $('#i-shop').src = SVGI.shop; $('#i-missions').src = SVGI.missions; $('#i-pass').src = SVGI.pass; $('#i-market').src = thumbs.letters; $('#i-barn').src = thumbs.storage; $('#i-build').src = buildIcon;
const elfPortrait = portrait;

/* =====================================================================
   ÉTAT, SON
   ===================================================================== */
T.setTrackHook((s, key, n) => { const add = M.eventOnTrack(s, key, n); if (add && typeof evPing === 'function') evPing(add); });
const saved = T.loadTown();
let S = saved || T.newTown();
let saveLock = false;
const save = () => { if (!saveLock) T.saveTown(S); };
let actx = null;
function tone(f, d = .12, type = 'sine', v = .06, when = 0){
  if (S.mute) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch(e){}
}
// Musique d'ambiance : « Jingle Bells » (domaine public), boîte à musique douce, en boucle. Réglage « Musique » dans le profil.
const SONG = 'E4 E4 E2 E4 E4 E2 E4 G4 C4 D4 E1 F4 F4 F4 F4 F4 E4 E4 E4 E4 D4 D4 E4 D2 G2 E4 E4 E2 E4 E4 E2 E4 G4 C4 D4 E1 F4 F4 F4 F4 F4 E4 E4 E4 G4 G4 F4 D4 C1 R2'.split(' ');
const NOTE = {C: 523.25, D: 587.33, E: 659.25, F: 698.46, G: 783.99, A: 880, B: 987.77};
let musicOn = false, musicT = 0;
function music(){
  if (musicOn || S.mute || S.noMusic) return; musicOn = true;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ return; }
  const beat = .26; let t = actx.currentTime + .3;
  const play = () => {
    if (!musicOn) return;
    for (const n of SONG){ const d = beat * 4 / +n.slice(1); if (n[0] !== 'R'){ const f = NOTE[n[0]] / 2;
      for (const [m, v] of [[1, .035], [2, .012]]){ const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = f * m; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d * 1.6); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d * 1.7); } }
      t += d; }
    musicT = setTimeout(play, (t - actx.currentTime - 1) * 1000);
  };
  play();
}
function musicStop(){ musicOn = false; clearTimeout(musicT); }
addEventListener('pointerdown', () => { if (actx?.state === 'suspended') actx.resume(); music(); });
const sfx = {tap: () => tone(740, .06, 'sine', .04), pop: () => tone(880, .08, 'triangle', .05), collect: () => { tone(988, .1, 'triangle', .05); tone(1319, .14, 'triangle', .05, .06); }, err: () => tone(160, .16, 'sawtooth', .02), level: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .28, 'triangle', .06, i * .08)), build: () => { tone(330, .1, 'square', .03); tone(523, .2, 'triangle', .05, .1); }};

/* =====================================================================
   CAMÉRA & CANVAS
   ===================================================================== */
const cv = $('#c'), ctx = cv.getContext('2d');
let W = 0, H = 0;
const cam = {x: 0, y: 0, z: 1};
// Plein écran sur l'écran d'accueil (iPhone) : la vraie taille arrive parfois après le lancement ; on prend la plus grande
// des mesures fiables et on remesure plusieurs fois, sinon une bande claire apparaît en bas ou en haut.
const STANDALONE = navigator.standalone || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
if (STANDALONE) document.documentElement.classList.add('standalone');
function resize(){
  const de = document.documentElement;
  W = Math.max(innerWidth, de.clientWidth); H = Math.max(innerHeight, de.clientHeight, STANDALONE ? Math.round(visualViewport?.height || 0) : 0);
  if (STANDALONE && screen.height && Math.abs(screen.height - H) < 120 && innerWidth === screen.width) H = Math.max(H, screen.height);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
}
addEventListener('resize', resize); addEventListener('orientationchange', () => setTimeout(resize, 250)); visualViewport?.addEventListener('resize', resize);
resize(); for (const ms of [100, 400, 1200]) setTimeout(resize, ms);
// iPhone : quand l'app revient du fond (ou se relance depuis l'écran d'accueil), iOS peut vider la mémoire du dessin ;
// l'image affichée devient alors floue ou « bave ». On recrée la surface de dessin à chaque retour.
const rebuild = () => { cv.width = 1; cv.height = 1; resize(); };
addEventListener('pageshow', rebuild); addEventListener('focus', rebuild);
document.addEventListener('visibilitychange', () => { if (!document.hidden){ rebuild(); setTimeout(rebuild, 300); } });
cv.addEventListener('contextlost', e => e.preventDefault()); cv.addEventListener('contextrestored', rebuild);
const iso = (tx, ty) => ({x: (tx - ty) * TW / 2, y: (tx + ty) * TH / 2});
const toScreen = (tx, ty) => { const p = iso(tx, ty); return {x: (p.x - cam.x) * cam.z + W / 2, y: (p.y - cam.y) * cam.z + H / 2}; };
function toTile(sx, sy){ const wx = (sx - W / 2) / cam.z + cam.x, wy = (sy - H / 2) / cam.z + cam.y; return {x: wy / TH + wx / TW, y: wy / TH - wx / TW}; }
function centerOn(tx, ty){ const p = iso(tx, ty); cam.x = p.x; cam.y = p.y; glide = null; }
/* Caméra qui glisse (comme Township) : accélère, voyage, puis ralentit en arrivant. Durée selon la distance. */
let glide = null, tutoHold = 0;
function panTo(tx, ty, opt = {}){
  const p = iso(tx, ty), dx = p.x - cam.x, dy = p.y - cam.y, dist = Math.hypot(dx, dy) * cam.z;
  if (dist < 4){ opt.done?.(); return 0; }
  const ms = opt.ms ?? Math.max(650, Math.min(1700, 550 + dist * 1.4));
  glide = {x0: cam.x, y0: cam.y, x1: p.x, y1: p.y, z0: cam.z, z1: opt.zoom ?? cam.z, t0: performance.now(), ms, done: opt.done};
  return ms;
}
function glideStep(){
  if (!glide) return; const g = glide, u = Math.min(1, (performance.now() - g.t0) / g.ms);
  const e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;         // lent au départ, rapide, puis tout doux à l'arrivée
  const dip = g.z0 === g.z1 && g.ms > 700 ? Math.sin(u * Math.PI) * .06 : 0;      // petit recul de la caméra pendant les longs trajets
  cam.x = g.x0 + (g.x1 - g.x0) * e; cam.y = g.y0 + (g.y1 - g.y0) * e; cam.z = g.z0 + (g.z1 - g.z0) * e - dip * g.z0;
  if (u >= 1){ cam.z = g.z1; glide = null; g.done?.(); }
}
const startZoom = () => W < 600 ? CAM0 : Math.min(1.2, CAM0 * W / 600);
cam.z = startZoom(); centerOn(20, 20);

// sol : texture de neige, motif répété
const PAT = Math.round(320 * DPR);   // motif de neige, généré directement en pixels de l'écran
let snowCv = null;
let snowPat = (() => {
  const c = snowCv = document.createElement('canvas'); c.width = c.height = PAT; const x = c.getContext('2d'), k = DPR;
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
// iPhone : la texture d'un motif tiré d'un canevas peut être « recyclée » par Safari et afficher n'importe quoi
// (le village en grand et flou). On la fige en ImageBitmap, et on peut basculer sur un sol uni.
let plainGround = false; try { plainGround = localStorage.getItem('vdp-plain') === '1'; } catch(e){}
if (window.createImageBitmap) createImageBitmap(snowCv).then(b => { snowPat = ctx.createPattern(b, 'repeat'); snowCv.width = snowCv.height = 1; }).catch(() => {});

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
  if (o.type === 'santa'){ const k = `b:santa:${tierOf(o.lv || 1)}`, sk = M.skinState(S).house, kk = k + '@' + sk; if (sk !== 'classic' && SPR[kk] && SPR[kk].canvas && SPR[kk].canvas.complete !== false) return kk; return k; }
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
  // combo : récoltes enchaînées (moins de 4 s d'écart) → +5 % par palier, jusqu'à +25 %
  const t = performance.now(); combo.n = t - combo.t < 4000 ? Math.min(6, combo.n + 1) : 1; combo.t = t;
  let bonus = 0;
  if (combo.n > 1){ bonus = T.RARE.includes(b.res) ? 0 : Math.min(T.cap(S, b.res) - S[b.res], Math.round(got * .05 * (combo.n - 1))); if (bonus > 0) S[b.res] += bonus; else bonus = 0;
    const c = toScreen(o.x + b.w / 2, o.y + b.h / 2); FX.push({k: 'combo', txt: `Combo ×${combo.n}`, x: Math.min(W - 160, Math.max(160, c.x)), y: Math.max(170, c.y - 150 * cam.z), t: 0, d: 1.2}); }
  T.track(S, 'collect:' + b.res, got + bonus); fxHarvest(o, b.res, got + bonus); gainXp(T.collectXp(o), null);
  sfx.collect(); if (combo.n > 1) tone(660 + combo.n * 110, .12, 'triangle', .05, .05); tutoEv('collect:' + o.type); save(); return true;
}
const combo = {n: 0, t: 0};
/* ---------- Atelier : file de fabrication des jouets ---------- */
let fromOrder = false, wantToy = '';
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
  if (!T.has(S, t.cost)){ sfx.err(); return showMissing(t.cost, `Fabriquer : ${ITEMS[k].name}`, () => queueToy(o, k)); }
  T.take(S, t.cost);
  const start = Math.max(now(), o.q.length ? o.q[o.q.length - 1].end : 0);
  o.q.push({item: k, end: start + t.time / (T.craftSpeed(o.lv) * (1 + T.rsBonus(S, 'craft'))) * 1000}); sfx.pop(); tutoEv('craft'); save(); renderPanel();
}
// jouets qui manquent pour toutes les lettres (stock + file d'attente déduits)
function lettersNeed(o){
  const need = {}, have = k => (S.inv[k] || 0) + (o.q || []).filter(j => j.item === k).length;
  for (const od of S.orders) for (const [k, q] of Object.entries(od.items || {})) need[k] = (need[k] || 0) + q;
  const list = []; for (const [k, q] of Object.entries(need)) for (let i = have(k); i < q; i++) list.push(k);
  return list;
}
function autoQueue(o){
  let n = 0, poor = null;
  for (const k of lettersNeed(o)){ if ((o.q || []).length >= T.craftSlots(o.lv)) break; if (!T.has(S, TOYS[k].cost)){ poor ||= k; continue; } T.take(S, TOYS[k].cost); o.q ||= []; const start = Math.max(now(), o.q.length ? o.q[o.q.length - 1].end : 0); o.q.push({item: k, end: start + TOYS[k].time / T.craftSpeed(o.lv) * 1000}); n++; }
  if (n){ sfx.pop(); toast(`${n} jouet${n > 1 ? 's' : ''} ajouté${n > 1 ? 's' : ''} à la file`); save(); }
  else if (poor){ sfx.err(); return showMissing(TOYS[poor].cost, `Fabriquer : ${ITEMS[poor].name}`, () => autoQueue(o)); }
  else toast((o.q || []).length >= T.craftSlots(o.lv) ? "La file de l'atelier est pleine" : 'Toutes les lettres ont leurs jouets !');
  renderPanel();
}
/* ---------- lettres des enfants ---------- */
function bureau(){ return findType('orders'); }
const wrapOk = od => S.wrapOn && (S.inv.paper || 0) >= T.wrapNeed(od);
function deliver(i, el){
  const od = S.orders[i]; if (!od?.items) return;
  if (!T.has(S, od.items)){ sfx.err(); toast('Il te manque des jouets : fabrique-les à l’Atelier'); return; }
  // emballée : il faut 1 papier cadeau par jouet de la lettre
  const need = T.wrapNeed(od), wrap = S.wrapOn && (S.inv.paper || 0) >= need, m = wrap ? T.WRAP_BONUS : 1;
  if (wrap){ S.inv.paper -= need; T.track(S, 'wrap', need); if (Math.random() < T.WRAP_STAR){ S.stars += 1; setTimeout(() => { fly('stars', 1, el); toast('Un enfant ravi t’offre une étoile d’or !'); }, 400); } }
  const pay = Math.round(od.coins * T.albumBonus(S) * m);
  T.take(S, od.items); S.coins += pay; fly('coins', pay, el); gainXp(Math.round(od.xp * m), el);
  for (const [k, q] of Object.entries(od.items || {})) T.track(S, 'deliver:' + k, q);
  if (od.mat){ T.give(S, od.mat); setTimeout(() => fly(od.mat, 1, el), 300); }
  if (od.stars){ S.stars += od.stars; }
  T.track(S, 'orders'); M.passAdd(S, 5); S.orders[i] = {wait: now() + 15000}; sfx.level(); tutoEv('deliver'); save(); renderPanel();
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
  const why = T.upBlock(S, o); if (why){ sfx.err(); return why === 'Ressources insuffisantes' ? showMissing(T.upCost(o.type, o.lv + 1), `${B(o).name} niveau ${o.lv + 1}`, () => startUpgrade(o)) : toast(why); }
  const lv = o.lv + 1;
  // on récolte d'abord ce qui attend dans le bâtiment (sinon ce serait perdu)
  if (B(o).kind === 'prod') collectBld(o);
  T.take(S, T.upCost(o.type, lv));
  // pendant le tutoriel, le chantier dure 2 min : le temps de lire et de découvrir « Terminer gratuitement »
  const ms = Math.max(T.upTime(o.type, lv) * 1000 * (1 - T.rsBonus(S, 'plan')), tuto.active() && S.tuto <= 6 ? 120e3 : 0); o.up = now() + ms; o.utotal = ms; o.upTo = lv;
  T.track(S, 'upgrade'); sfx.build(); tutoEv('upgrade'); save(); closePanel();
}
function finishWorks(){
  for (const o of S.objs){
    if (o.build && now() >= o.build){ delete o.build; o.t = now(); fxPoof(o); if (panel === 'site' && panelArg === o) closePanel(); gainXp(T.buildXp(1) + 2, null); sfx.level(); toast(`${B(o).name} construit !`); tutoEv('built'); save(); }
    if (o.up && now() >= o.up){ o.lv = o.upTo; delete o.up; delete o.upTo; o.t = now(); fxPoof(o); if (panel === 'site' && panelArg === o) closePanel(); gainXp(T.buildXp(o.lv), null); sfx.level(); upBanner(o); tutoEv('upgraded'); save(); }
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
  const big = !['deco', 'path'].includes(b.kind);
  for (const o of S.objs){ if (o === ignore) continue; const ob = B(o); if (x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y && !(big && clearable(o))) return false; }
  return T.spotFree(S, type, x, y, ignore);
}
// un bâtiment peut se poser sur une allée, un sapin sauvage ou une déco : ils sont rangés automatiquement (déco achetée remboursée)
const clearable = o => o.wild || ['deco', 'path'].includes(B(o).kind);
const under = (type, x, y, ignore) => { const b = BUILDINGS[type]; return S.objs.filter(o => o !== ignore && clearable(o) && (() => { const ob = B(o); return x < o.x + ob.w && x + b.w > o.x && y < o.y + ob.h && y + b.h > o.y; })()); };
const refund = o => o.wild || o.free ? 0 : Math.round((BUILDINGS[o.type].cost?.coins || 0) / 2);
function clearUnder(type, x, y, ignore){
  if (['deco', 'path'].includes(BUILDINGS[type].kind)) return;
  const L = under(type, x, y, ignore); if (!L.length) return;
  const c = L.reduce((a, o) => a + refund(o), 0); S.objs = S.objs.filter(o => !L.includes(o)); if (c) S.coins += c;
  toast(`${L.length} élément${L.length > 1 ? 's' : ''} du décor rangé${L.length > 1 ? 's' : ''}${c ? ` (+${c} pièces)` : ''}`);
}
// ambiance d'une zone ouverte : teinte du sol et motif propre (lac gelé, cristaux, aurore…)
function isoBlob(tx, ty, r, fill){
  const c = toScreen(tx, ty), z = cam.z; ctx.beginPath(); ctx.ellipse(c.x, c.y, r * TW / Math.SQRT2 * z, r * TH / Math.SQRT2 * z, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
function zoneGround(cx, cy, z){
  const X = cx * T.CHUNK, Y = cy * T.CHUNK, C = T.CHUNK, tm = performance.now() / 1000;
  let r = (cx * 31 + cy * 17) * 9301 % 233280; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  ctx.save(); diamond(X, Y, C, C, null, null); ctx.clip();
  ctx.globalAlpha = .16; diamond(X, Y, C, C, z.tint, null);
  ctx.globalAlpha = .22; for (let i = 0; i < 7; i++) isoBlob(X + 1.5 + rnd() * (C - 3), Y + 1.5 + rnd() * (C - 3), .8 + rnd() * .9, z.tint);
  ctx.globalAlpha = 1;
  if (z.feat === 'lake'){
    const lx = X + 5.5, ly = Y + 5.5;
    isoBlob(lx, ly, 3.1, 'rgba(255,255,255,.9)'); isoBlob(lx, ly, 2.8, '#9fd6f5'); isoBlob(lx - .4, ly - .4, 2.1, '#c4e8fb');
    { const h = toScreen(lx + .6, ly + .6), z = cam.z; ctx.fillStyle = '#1f4a7a'; ctx.beginPath(); ctx.ellipse(h.x, h.y, 14 * z, 7 * z, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * z; ctx.stroke();
      if (z > .5){ ctx.font = `600 ${Math.round(12 * Math.min(1.3, z))}px Fredoka, sans-serif`; const tw = ctx.measureText('Pêche').width + 14; ctx.fillStyle = 'rgba(18,22,44,.8)'; ctx.beginPath(); ctx.roundRect(h.x - tw / 2, h.y + 10 * z, tw, 18, 6); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Pêche', h.x, h.y + 10 * z + 9); ctx.textBaseline = 'alphabetic'; } }
    ctx.globalAlpha = .7; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * cam.z; for (let i = 0; i < 3; i++){ const a = toScreen(lx - 1.6 + i * .9, ly - .3 - i * .5), b = toScreen(lx - .9 + i * .9, ly - 1 - i * .5); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } ctx.globalAlpha = 1;
  } else if (z.feat === 'gems' || z.feat === 'aurora' || z.feat === 'candy'){
    for (let i = 0; i < 12; i++){
      const p = toScreen(X + .5 + rnd() * (C - 1), Y + .5 + rnd() * (C - 1)), tw = .5 + .5 * Math.sin(tm * 2 + i * 1.7), sz = (2.5 + 2.5 * tw) * cam.z;
      ctx.globalAlpha = z.feat === 'candy' ? .55 : .35 + .55 * tw; ctx.fillStyle = z.feat === 'candy' ? (i % 2 ? '#ff5d8f' : '#fff') : '#fff';
      ctx.beginPath(); ctx.moveTo(p.x, p.y - sz * 1.6); ctx.lineTo(p.x + sz * .6, p.y); ctx.lineTo(p.x, p.y + sz * 1.6); ctx.lineTo(p.x - sz * .6, p.y); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (z.feat === 'aurora'){
    const c = toScreen(X + C / 2, Y + C / 2), w = C * TW * cam.z * .55, g = ctx.createLinearGradient(c.x - w, 0, c.x + w, 0);
    g.addColorStop(0, 'rgba(63,224,160,0)'); g.addColorStop(.35 + .1 * Math.sin(tm * .7), 'rgba(63,224,160,.28)'); g.addColorStop(.7, 'rgba(160,110,255,.22)'); g.addColorStop(1, 'rgba(160,110,255,0)');
    ctx.fillStyle = g; diamond(X, Y, C, C, null, null); ctx.fill();
  }
  ctx.restore();
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
  const cv0 = s.canvas; if (cv0.complete === false || cv0.naturalWidth === 0) return;
  ctx.drawImage(cv0, x, y, w, h);
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
  // repart toujours d'un état propre : une erreur dans l'image précédente ne doit jamais laisser une transparence,
  // un mode de fusion ou une découpe (c'est ce qui brouillait et faisait « bouger » tout le fond)
  for (let i = 0; i < 24; i++) ctx.restore();
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#e9eef7'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.imageSmoothingQuality = 'medium';
  // sol
  // sol : motif en pixels réels (transformation identité), qui suit la caméra
  if (plainGround){ ctx.fillStyle = '#eef3fa'; ctx.fillRect(0, 0, W, H); } else { const o0 = toScreen(0, 0), ox = Math.round(o0.x * DPR) % PAT, oy = Math.round(o0.y * DPR) % PAT; ctx.save(); ctx.setTransform(1, 0, 0, 1, ox, oy); ctx.fillStyle = snowPat; ctx.fillRect(-ox - PAT, -oy - PAT, cv.width + PAT * 2, cv.height + PAT * 2); ctx.restore(); }
  // terrain ouvert : léger liseré pour marquer la limite
  for (const k of S.chunks){ const [cx, cy] = k.split(',').map(Number); const z = T.zoneOf(cx, cy); if (z) zoneGround(cx, cy, z); diamond(cx * T.CHUNK, cy * T.CHUNK, T.CHUNK, T.CHUNK, 'rgba(255,255,255,.35)', null); }
  // forêts : zones verrouillées + bordure de carte
  const items = [];
  const n = T.MAP / T.CHUNK;
  for (let cx = -1; cx <= n; cx++) for (let cy = -1; cy <= n; cy++){
    if (S.chunks.includes(`${cx},${cy}`)) continue;
    items.push({d: (cx + cy + 1) * T.CHUNK, f: () => { const c = toScreen((cx + .5) * T.CHUNK, (cy + .5) * T.CHUNK); drawSprite('forest:' + Math.abs((cx * 7 + cy * 3) % 3), c.x, c.y); if (cx >= 0 && cy >= 0 && cx < n && cy < n && isNextToOpen(cx, cy) && !document.body.classList.contains('cine')) sign(c.x, c.y, cx, cy); }});
  }
  // allées : posées au sol, avant tout le reste
  for (const o of S.objs) if (o.type === 'path' && ghost?.move !== o) drawObj(o);
  for (const o of S.objs){
    const b = B(o);
    if (ghost?.move === o || o.type === 'path') continue;
    items.push({d: o.x + o.y + (b.w + b.h) / 2, f: () => drawObj(o)});
  }
  // terrains réservés : le futur bâtiment en transparence, avec ce qu'il faut pour le débloquer
  // terrains réservés : plus affichés sur la carte (ils encombraient) ; le menu Construire propose toujours une bonne place
  for (const e of elves) items.push({d: e.x + e.y, f: () => drawElf(e)});
  if (S.visitor){ const h = S.objs.find(o => o.type === 'santa'); if (h){ const vx = h.x + 5.3, vy = h.y + 1.6; items.push({d: vx + vy, f: () => drawVisitor(vx, vy)}); } }
  if (ghost){ const b = BUILDINGS[ghost.type]; items.push({d: ghost.x + ghost.y + (b.w + b.h) / 2 + .01, f: () => { const ok = fits(ghost.type, ghost.x, ghost.y, ghost.move); diamond(ghost.x, ghost.y, b.w, b.h, ok ? 'rgba(80,220,100,.35)' : 'rgba(255,60,60,.35)', ok ? '#2fae48' : '#d81f33'); const c = toScreen(ghost.x + b.w / 2, ghost.y + b.h / 2); drawSprite(ghost.move ? spriteKey(ghost.move) : T.isUpgradable(b) ? `b:${ghost.type}:1` : 'b:' + ghost.type, c.x, c.y, .85); }}); }
  items.sort((a, b) => a.d - b.d);
  for (const it of items) it.f();
  drawDrop();
  ambiance();
  // noms des bâtiments, puis indicateurs au-dessus
  labels = []; labelZones = [...document.querySelectorAll('#quest2, #sideR > button:not([hidden]), #sideL2 > button:not([hidden])')].map(e => e.getBoundingClientRect()).filter(r => r.width).map(r => ({left: r.left - 8, right: r.right + 8, top: r.top - 6, bottom: r.bottom + 16}));
  const inCine = document.body.classList.contains('cine');
  if (!inCine){ for (const o of S.objs) plate(o);
  bangs = 0; for (const o of [...S.objs].sort((a, b) => (B(b).kind === 'hq') - (B(a).kind === 'hq'))) drawHint(o); }
  drawSleigh();
  // neige qui tombe
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const f of flakes){ ctx.beginPath(); ctx.arc(f.x * W, f.y * H, f.s * 1.6, 0, 7); ctx.fill(); }
  // vignette : bords légèrement assombris, le regard va au centre
  ctx.drawImage(vignette(), 0, 0, W, H);
  drawFx(fxDt);
}
// Ambiance selon l'heure réelle : jour, crépuscule (16-18 h) rose orangé, nuit (18-7 h) bleu nuit,
// avec les lampadaires et les fenêtres qui s'allument (comme les soirées d'hiver de Township). ?heure=21 pour tester.
// grands écrans (tablette, PC) : interface à taille de téléphone agrandie, fenêtres centrées (voir body.wide dans index.html)
let uiSize = 1; try { uiSize = +localStorage.getItem('vdp-uisize') || 1; } catch(e){}
function applyWide(){
  const w = innerWidth, h = innerHeight, wide = w >= 700, us = !wide && w < 380 ? Math.min(uiSize, 1.04) : uiSize, z = (wide ? Math.max(.62, Math.min(1.6, w / 700, h / 760)) : 1) * us, r = document.documentElement.style;
  r.setProperty('--uis', us);
  document.body.classList.toggle('short', wide && h < 560);
  document.body.classList.toggle('wide', wide); r.setProperty('--uiz', z.toFixed(3)); r.setProperty('--sheeth', Math.round(Math.min(h / z - 36, 880)) + 'px'); r.setProperty('--hudw', Math.round(Math.min(w / z - 120, 720)) + 'px');
}
applyWide(); addEventListener('resize', applyWide);
const HOUR_FORCE = +new URLSearchParams(location.search).get('heure') || null;
function nightLevel(){
  const d = new Date(), h = HOUR_FORCE ?? d.getHours() + d.getMinutes() / 60;
  if (h >= 7.5 && h < 16) return {n: 0, dusk: 0};
  if (h >= 16 && h < 17.5) return {n: (h - 16) / 1.5 * .5, dusk: 1 - Math.abs(h - 16.75) / .75};
  if (h >= 17.5 && h < 18.5) return {n: .5 + (h - 17.5) * .5, dusk: .3};
  if (h >= 6 && h < 7.5) return {n: 1 - (h - 6) / 1.5, dusk: .4};
  return {n: 1, dusk: 0};
}
const WARM = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,214,140,.9)'); g.addColorStop(.4, 'rgba(255,170,70,.35)'); g.addColorStop(1, 'rgba(255,150,50,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c; })();
// où sont les fenêtres sur l'image de chaque bâtiment (fractions largeur, hauteur) — mesuré sur les rendus
const WINDOWS = {santa: [[.27, .55], [.47, .6], [.73, .5]], cabin: [[.32, .58], [.6, .62]], workshop: [[.35, .6], [.65, .55]], letters: [[.45, .6]], bakery: [[.42, .62]], mill: [[.4, .6]], orders: [[.45, .6]], stable: [[.4, .6]], storage: [[.45, .62]], theater: [[.45, .55]]};
function ambiance(){
  const {n, dusk} = nightLevel(); if (n <= 0 && dusk <= 0) return;
  ctx.save();
  if (dusk > 0){ ctx.globalAlpha = dusk * .1; ctx.fillStyle = '#ff9a6c'; ctx.fillRect(0, 0, W, H); }
  if (n > 0){ ctx.globalAlpha = n * .07; ctx.fillStyle = '#3a4a9a'; ctx.fillRect(0, 0, W, H); }   // à peine bleuté : le jeu reste lumineux même le soir   // nuit douce : le village garde ses couleurs
  if (n > .3){
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, (n - .3) / .4);
    for (const o of S.objs){
      if (o.wild) continue;
      if (o.type === 'lantern'){ const c = toScreen(o.x + .5, o.y + .5), r = 34 * cam.z; ctx.drawImage(WARM, c.x - r, c.y - 34 * cam.z - r, r * 2, r * 2); ctx.drawImage(WARM, c.x - r * 1.6, c.y - r * .8, r * 3.2, r * 1.6); continue; }
      const win = WINDOWS[o.type]; if (!win || o.build) continue;
      const rc = objScreenRect(o); if (rc.cx < -80 || rc.cx > W + 80 || rc.top > H || rc.top + rc.height < 0) continue;
      const r = 16 * cam.z;
      for (const [fx, fy] of win){ const x = rc.left + rc.width * fx, y = rc.top + rc.height * fy, f = .85 + Math.sin(performance.now() / 700 + x) * .15; ctx.drawImage(WARM, x - r * f, y - r * f, r * 2 * f, r * 2 * f); }
    }
  }
  ctx.restore();
}
let fxDt = 0;
let vig = null, vigW = 0, vigH = 0;
function vignette(){ // calculée une fois en petite taille, puis étirée (dégradé doux : aucun flou visible)
  if (vigW !== W || vigH !== H){ vigW = W; vigH = H; vig = document.createElement('canvas'); vig.width = 128; vig.height = Math.round(128 * H / W); const x = vig.getContext('2d'), w = vig.width, h = vig.height;
    const g = x.createRadialGradient(w / 2, h * .45, Math.min(w, h) * .35, w / 2, h * .45, Math.hypot(w, h) * .62); g.addColorStop(0, 'rgba(20,30,70,0)'); g.addColorStop(1, 'rgba(60,80,140,.1)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  return vig;
}
// Étiquettes : jamais coupées au bord de l'écran, jamais sous la barre du haut, les boutons de droite ou la barre du bas,
// et jamais l'une sur l'autre (la première posée gagne : bâtiments d'abord, terrains réservés ensuite).
let labels = [], labelZones = [], bangs = 0;
function labelSpot(x, y, w, h){
  x = Math.round(Math.min(W - w / 2 - 6, Math.max(w / 2 + 6, x))); y = Math.round(y);
  const L = x - w / 2, R = x + w / 2, T_ = y - h / 2, Bm = y + h / 2;
  if (T_ < 120 || Bm > H - 170) return null;
  for (const z of labelZones) if (L < z.right && R > z.left && T_ < z.bottom && Bm > z.top) return null;
  for (const r of labels) if (L < r.R + 4 && R > r.L - 4 && T_ < r.B + 3 && Bm > r.T - 3) return null;
  labels.push({L, R, T: T_, B: Bm}); return {x, y};
}
const PLATE = new Set(['hq', 'prod', 'storage', 'craft', 'orders', 'stable', 'fun']);
function plate(o){
  const b = B(o); if (!PLATE.has(b.kind) || cam.z < .5 || o.build) return;
  const p = toScreen(o.x + b.w, o.y + b.h);
  if (p.x < -100 || p.x > W + 100 || p.y < -40 || p.y > H + 40) return;
  // étiquette discrète au pied du bâtiment : pastille de niveau dorée + nom en police fine (comme Bid Master)
  const label = b.name, lv = String(o.lv || 1);
  ctx.font = '600 11px Fredoka, sans-serif'; const tw = ctx.measureText(label).width, w = tw + 30, h = 18;
  const at = labelSpot(p.x, p.y - 10, w, h); if (!at) return;
  ctx.save(); ctx.translate(at.x, at.y);
  ctx.fillStyle = 'rgba(18,22,44,.78)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 5); ctx.fill();
  ctx.fillStyle = '#ffc93a'; ctx.beginPath(); ctx.arc(-w / 2 + 10, 0, 7, 0, 7); ctx.fill(); ctx.strokeStyle = '#7a4a05'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#3a2208'; ctx.font = '400 9.5px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(lv, -w / 2 + 10, .5);
  ctx.fillStyle = '#fff'; ctx.font = '600 11px Fredoka, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(label, -w / 2 + 21, .5);
  ctx.restore();
}
function drawLot(l){
  const b = BUILDINGS[l.type], c = toScreen(l.x + b.w / 2, l.y + b.h / 2), ok = (b.hq || 1) <= T.hqLv(S);
  diamond(l.x, l.y, b.w, b.h, ok ? 'rgba(90,200,110,.18)' : 'rgba(40,50,90,.16)', ok ? 'rgba(60,170,80,.7)' : 'rgba(255,255,255,.55)');
  // poteau et panneau en bois au centre du terrain (plus de bâtiment fantôme en transparence)
  { const z = Math.min(1.2, Math.max(.7, cam.z)); ctx.save(); ctx.translate(c.x, c.y); ctx.scale(z, z);
    ctx.fillStyle = '#6b4220'; ctx.fillRect(-2.5, -26, 5, 28); ctx.strokeStyle = '#2e202c'; ctx.lineWidth = 2; ctx.strokeRect(-2.5, -26, 5, 28);
    ctx.fillStyle = ok ? '#e9b65f' : '#b9a58a'; ctx.beginPath(); ctx.roundRect(-17, -44, 34, 22, 4); ctx.fill(); ctx.stroke();
    if (ok){ ctx.fillStyle = '#2f9e44'; ctx.fillRect(-7, -35.5, 14, 4.5); ctx.fillRect(-2.25, -40.5, 4.5, 14.5); }
    else { ctx.strokeStyle = '#5a3a10'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(0, -36, 4, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#5a3a10'; ctx.fillRect(-6, -36, 12, 9); }
    ctx.restore(); }
}
/** Étiquette d'un terrain réservé (dessinée avec les autres étiquettes, après les bâtiments). */
function lotLabel(l){
  if (tuto.active() || cam.z < .7) return;
  const b = BUILDINGS[l.type], ok = (b.hq || 1) <= T.hqLv(S); if (!ok) return;        // terrain verrouillé : le panneau au cadenas suffit
  const p = toScreen(l.x + b.w, l.y + b.h), label = ok ? `${b.name} · à construire` : `${b.name} · Maison niv. ${b.hq}`;
  ctx.font = '600 11px Fredoka, sans-serif'; const lw = ctx.measureText(label).width + 30;
  const at = labelSpot(p.x, p.y - 10, lw, 18); if (!at) return;
  ctx.save(); ctx.translate(at.x, at.y);
  ctx.font = '600 11px Fredoka, sans-serif'; const w = ctx.measureText(label).width + 30, h = 18;
  ctx.fillStyle = ok ? 'rgba(20,110,40,.85)' : 'rgba(18,22,44,.78)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 5); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, -w / 2 + 21, .5);
  // cadenas (verrouillé) ou « + » (constructible)
  ctx.translate(-w / 2 + 10, 0);
  if (ok){ ctx.fillStyle = '#7dff8a'; ctx.fillRect(-4.5, -1.2, 9, 2.4); ctx.fillRect(-1.2, -4.5, 2.4, 9); }
  else { ctx.strokeStyle = '#ffd34a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, -2, 3, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#ffd34a'; ctx.fillRect(-4.5, -1.5, 9, 6.5); }
  ctx.restore();
}
function lotAt(sx, sy){ return null; const t = toTile(sx, sy); return T.lotsShown(S).find(l => { const b = BUILDINGS[l.type]; return t.x >= l.x && t.x < l.x + b.w && t.y >= l.y && t.y < l.y + b.h; }); }
const isOpen = (cx, cy) => S.chunks.includes(`${cx},${cy}`);
const isNextToOpen = (cx, cy) => isOpen(cx - 1, cy) || isOpen(cx + 1, cy) || isOpen(cx, cy - 1) || isOpen(cx, cy + 1);
function sign(x, y, cx, cy){
  ctx.save(); ctx.translate(x, y - 10);
  ctx.fillStyle = '#c98a4b'; ctx.strokeStyle = '#2a1a0e'; ctx.lineWidth = 2.5;
  { const sw = T.zoneLock(S, cx, cy) ? 76 : 60; ctx.beginPath(); ctx.roundRect(-sw / 2, -22, sw, 30, 8); ctx.fill(); ctx.stroke(); }
  { const zn = T.zoneName(cx, cy); ctx.font = '600 11px Fredoka, sans-serif'; const zw = ctx.measureText(zn).width + 14; ctx.fillStyle = 'rgba(18,22,44,.8)'; ctx.beginPath(); ctx.roundRect(-zw / 2, 12, zw, 17, 5); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(zn, 0, 21); ctx.textBaseline = 'alphabetic'; }
  ctx.font = '400 15px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 4; { const lk = T.zoneLock(S, cx, cy), tx = lk ? `NIV. ${lk}` : 'À VENDRE'; ctx.strokeText(tx, 0, -2); ctx.fillStyle = lk ? '#ffd34a' : '#fff'; ctx.fillText(tx, 0, -2); }
  ctx.restore();
}
// échafaudage en bois devant un bâtiment en cours d'amélioration (comme Township)
function scaffold(o){
  const b = B(o), c = toScreen(o.x + b.w, o.y + b.h * .5), z = cam.z, half = b.w * 9 * z, L = c.x - half, R = c.x + half, B0 = c.y + 4 * z, T0 = B0 - b.w * 15 * z;
  ctx.save(); ctx.lineCap = 'round';
  const pole = (x1, y1, x2, y2, w) => { ctx.lineWidth = w + 3 * z; ctx.strokeStyle = '#2e202c'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.lineWidth = w; ctx.strokeStyle = '#c98a4a'; ctx.stroke(); };
  for (const x of [L, (L + R) / 2, R]) pole(x, B0, x, T0, 3.5 * z);
  for (const y of [T0 + (B0 - T0) * .25, T0 + (B0 - T0) * .65]){ pole(L - 4 * z, y, R + 4 * z, y, 5 * z); }
  pole(L, B0, (L + R) / 2, T0 + (B0 - T0) * .25, 3 * z);
  // petite grue : mât + flèche + crochet qui se balance
  const cx = R + 6 * z, top = T0 - 22 * z, sw = Math.sin(performance.now() / 500) * 4 * z;
  pole(cx, B0, cx, top, 3.5 * z); pole(cx + 6 * z, top, cx - (R - L) * .45, top + 4 * z, 3 * z);
  ctx.lineWidth = 1.5 * z; ctx.strokeStyle = '#2e202c'; const hx = cx - (R - L) * .3 + sw; ctx.beginPath(); ctx.moveTo(cx - (R - L) * .3, top + 5 * z); ctx.lineTo(hx, top + 22 * z); ctx.stroke();
  ctx.fillStyle = '#ffd34a'; ctx.strokeStyle = '#2e202c'; ctx.lineWidth = 2 * z; ctx.beginPath(); ctx.rect(hx - 5 * z, top + 22 * z, 10 * z, 7 * z); ctx.fill(); ctx.stroke();
  ctx.restore();
}
const bounceAt = new WeakMap();   // instant du rebond : jamais sauvegardé (performance.now() repart de 0 à chaque lancement)
function drawObj(o){
  const b = B(o), c = toScreen(o.x + b.w / 2, o.y + b.h / 2);
  if (selObj === o) diamond(o.x, o.y, b.w, b.h, 'rgba(255,214,90,.35)', '#ffc83a');
  // rebond quand on le touche (écrasé puis étiré, comme Township), petit balancement quand il travaille
  const t = performance.now(), age = (t - (bounceAt.get(o) || -1e9)) / 1000;
  let sx = 1, sy = 1;
  if (age >= 0 && age < .45){ const k = Math.sin(age / .45 * Math.PI * 2.5) * (1 - age / .45); sx = 1 + k * .07; sy = 1 - k * .09; }
  else if (o.job || (B(o).kind === 'craft' && (o.q || []).some(j => j.end > now()))){ const k = Math.sin(t / 260 + o.x) * .012; sx = 1 - k; sy = 1 + k; }
  if (sx !== 1 || sy !== 1){ ctx.save(); ctx.translate(c.x, c.y); ctx.scale(sx, sy); ctx.translate(-c.x, -c.y); drawSprite(spriteKey(o), c.x, c.y); ctx.restore(); }
  else drawSprite(spriteKey(o), c.x, c.y);
  if (o.up && !o.build) scaffold(o);
  else if (GLOWS[o.type] && cam.z > .4 && working(o)) bldGlow(o);
  // chantier : étincelles des marteaux
  if ((o.build || o.up) && Math.random() < .08){ const r = objScreenRect(o); FX.push({k: 'spark', x: r.cx + (Math.random() - .5) * r.width * .4, y: r.top + r.height * .45, vx: (Math.random() - .5) * 120, vy: -120 - Math.random() * 80, t: 0, d: .6}); }
}
function drawHint(o){
  const b = B(o); if (ghost?.move === o || o.wild) return;
  const r = objScreenRect(o), top = r.top + 10;
  if (r.cx < -60 || r.cx > W + 60 || top < -60 || r.cy > H + 80) return;
  const w = workEnd(o);
  if (w){ const total = o.build ? o.btotal : o.utotal; timerPill(r.cx, top, (speedCost(o) ? '' : '✓ ') + fmtTime((w - now()) / 1000), 1 - (w - now()) / (total || 1)); return; }
  if (o.job && o.job.end <= now()) return bubble(r.cx, top, B(o).res, '★');
  if (b.kind === 'hq' && T.sackReady(S) && S.lvl >= 2 && !tuto.active()) return bubble(r.cx, top, 'parcel', '!');
  if (b.kind === 'prod' && o.keeper){ if (keeperFull.has(o)) bubble(r.cx, top, b.res, 'PLEIN'); }
  else if (b.kind === 'prod'){ const n = T.stored(S, o), buf = T.buffer(o.type, o.lv); if (ripe(o)) bubble(r.cx, top, b.res, n >= buf ? 'MAX' : ''); }
  if (b.kind === 'craft'){ const d = craftDone(o); if (d.length) bubble(r.cx, top, d[0].item, d.length > 1 ? 'x' + d.length : ''); else if (o.q?.length){ const j = o.q[0]; timerPill(r.cx, top, fmtTime((j.end - now()) / 1000), 1 - (j.end - now()) / (TOYS[j.item].time / T.craftSpeed(o.lv) * 1000)); } }
  if (b.kind === 'orders'){ const ok = S.orders.some(od => od.items && T.has(S, od.items)); if (ok) return bubble(r.cx, top, 'coins', '!'); }
  if (b.kind === 'mine'){ const st = T.mineState(S); if (st && st.M.picks >= st.max) return bubble(r.cx, top, 'ice', String(st.M.picks)); }
  if (b.kind === 'stable'){ const run = S.exps || []; if (run.length >= T.expSlots(o.lv)){ const e = run.reduce((a, x) => x.end < a.end ? x : a); const d = T.EXP_DEST.find(d => d.k === e.k); return timerPill(r.cx, top, fmtTime((e.end - now()) / 1000), 1 - (e.end - now()) / d.time); } if (!T.expBlock(S, 'forest')) return bubble(r.cx, top, 'gold', '!'); }
  if (T.isUpgradable(b) && b.kind !== 'house' && b.kind !== 'storage' && bangs < 3 && !ripe(o) && !(b.kind === 'craft' && craftDone(o).length) && !T.upBlock(S, o)){ bangs++; bang(r.cx + r.width * .22, top + 6); }
}
/** « ! » rouge : ce bâtiment peut être amélioré maintenant (comme les « ! » de Bid Master). */
function bang(x, y){
  // jamais sur une étiquette : on remonte le « ! » au-dessus
  for (let n = 0; n < 4 && labels.some(r => x + 14 > r.L && x - 14 < r.R && y + 14 > r.T && y - 14 < r.B); n++) y -= 24;
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
  const near = FX.filter(f => f.k === 'txt' && f.t < f.d * .8 && Math.abs(f.x - (c.x - 16)) < 70 && Math.abs(f.y0 - (c.y - 28 * cam.z)) < 60).length;
  FX.push({k: 'txt', txt: '+' + fmt(n), x: c.x - 16, y: c.y - 28 * cam.z - near * 30, y0: c.y - 28 * cam.z, t: 0, d: 1.2, col: '#fff', icon: ICON[k]});
  
}
// bâtiment terminé : nuage de poussière + étincelles
// bannière « niveau supérieur » : ce que l'amélioration a changé, en clair (Dragons of Atlantis)
function upBanner(o){
  const rows = T.stats(S, o, o.lv - 1).slice(0, 2), b = $('#upban') || Object.assign(document.createElement('div'), {id: 'upban'});
  if (!b.parentNode) document.body.appendChild(b);
  b.innerHTML = `<img src="${thumbs[o.type + ':' + tierOf(o.lv)] || thumbs[o.type]}" alt=""><div><b>${B(o).name} · niveau ${o.lv}</b>${rows.map(r => `<span>${r.label} : <s>${r.now}</s> → <em>${r.next}</em></span>`).join('')}</div>`;
  const show = () => { if (!$('#modal').hidden) return setTimeout(show, 400); b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); clearTimeout(upBanner.t); upBanner.t = setTimeout(() => b.classList.remove('on'), 3600); }; show();
  const c = toScreen(o.x + B(o).w / 2, o.y + B(o).h / 2);
  for (let i = 0; i < 18; i++){ const a = Math.random() * Math.PI * 2, v = 160 + Math.random() * 200; FX.push({k: 'spark', x: c.x, y: c.y - 40, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 160, t: 0, d: 1.1}); }
}
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
      else { ctx.strokeText(f.txt, f.x, y); ctx.fillStyle = f.col; ctx.fillText(f.txt, f.x, y); if (f.icon){ const im = img(f.icon); if (im.complete){ const tw = ctx.measureText(f.txt).width; ctx.drawImage(im, f.x + tw / 2 + 2, y - 13, 26, 26); } } }
    } else if (f.k === 'combo'){
      const sc = u < .2 ? .6 + u * 3 : 1.2 - (u - .2) * .25; ctx.globalAlpha = u > .75 ? (1 - u) / .25 : 1;
      ctx.save(); ctx.translate(f.x, f.y - 30 * u); ctx.scale(sc, sc); ctx.font = '400 30px "Lilita One", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 7; ctx.strokeStyle = '#7a1a10'; ctx.strokeText(f.txt, 0, 0); ctx.fillStyle = '#ffd34a'; ctx.fillText(f.txt, 0, 0); ctx.restore();
    } else if (f.k === 'smoke'){
      f.x += f.vx * dt; f.y += f.vy * dt; f.vx += 4 * dt; const R = f.r * (1 + u * 1.6); ctx.globalAlpha = Math.min(1, u * 6) * (1 - u * u); const g = ctx.createRadialGradient(f.x - R * .3, f.y - R * .3, R * .1, f.x, f.y, R); g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(.55, 'rgba(240,244,250,.5)'); g.addColorStop(1, 'rgba(230,236,246,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, R, 0, 7); ctx.fill();
    } else if (f.k === 'puff'){
      f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = (1 - u) * .85; ctx.fillStyle = '#fbf6ee'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + u * 1.3), 0, 7); ctx.fill();
    } else if (f.k === 'chip'){                        // copeaux de la scierie, braises de la fonderie, paillettes…
      f.vy += (f.g ?? 300) * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.a = (f.a || 0) + dt * 8; ctx.globalAlpha = 1 - u * u; ctx.fillStyle = f.c;
      if (f.glow){ ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(GLOW, f.x - f.r * 2.5, f.y - f.r * 2.5, f.r * 5, f.r * 5); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = u < .5 ? '#ffd24a' : '#ff7a1a'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * .55, 0, 7); ctx.fill(); }
      else { ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a); ctx.fillRect(-f.r, -f.r * .5, f.r * 2, f.r); ctx.restore(); }
    } else if (f.k === 'twinkle'){                     // étoile à 4 branches qui monte (cristaux, atelier, bibliothèque)
      f.x += f.vx * dt; f.y += f.vy * dt; const sc = Math.sin(u * Math.PI) * f.r; ctx.globalAlpha = Math.sin(u * Math.PI); ctx.fillStyle = f.c;
      ctx.beginPath(); ctx.moveTo(f.x, f.y - sc * 1.8); ctx.lineTo(f.x + sc * .45, f.y); ctx.lineTo(f.x, f.y + sc * 1.8); ctx.lineTo(f.x - sc * .45, f.y); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(f.x - sc * 1.8, f.y); ctx.lineTo(f.x, f.y + sc * .45); ctx.lineTo(f.x + sc * 1.8, f.y); ctx.lineTo(f.x, f.y - sc * .45); ctx.closePath(); ctx.fill();
    } else if (f.k === 'env' || f.k === 'page' || f.k === 'note'){   // enveloppes du Bureau, pages de la Bibliothèque, notes du Théâtre
      f.x += (f.vx + Math.sin(u * 9 + f.ph) * 14) * dt; f.y += f.vy * dt; const z = cam.z; ctx.globalAlpha = Math.min(1, u * 5) * (1 - u);
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(Math.sin(u * 7 + f.ph) * .4); ctx.lineWidth = 1.4 * z; ctx.strokeStyle = '#5a3a1e';
      if (f.k === 'env'){ ctx.fillStyle = '#fffaf0'; ctx.fillRect(-7 * z, -5 * z, 14 * z, 10 * z); ctx.strokeRect(-7 * z, -5 * z, 14 * z, 10 * z); ctx.beginPath(); ctx.moveTo(-7 * z, -5 * z); ctx.lineTo(0, 1 * z); ctx.lineTo(7 * z, -5 * z); ctx.stroke(); ctx.fillStyle = '#d33'; ctx.beginPath(); ctx.arc(0, 1 * z, 1.8 * z, 0, 7); ctx.fill(); }
      else if (f.k === 'page'){ ctx.fillStyle = '#fff8e0'; ctx.fillRect(-5 * z, -6 * z, 10 * z, 12 * z); ctx.strokeRect(-5 * z, -6 * z, 10 * z, 12 * z); ctx.fillStyle = '#c9b48a'; for (let l = 0; l < 3; l++) ctx.fillRect(-3 * z, (-3 + l * 3) * z, 6 * z, .9 * z); }
      else { ctx.fillStyle = f.c; ctx.beginPath(); ctx.ellipse(-2 * z, 4 * z, 3.4 * z, 2.6 * z, -.4, 0, 7); ctx.fill(); ctx.fillRect(1 * z, -7 * z, 1.6 * z, 11 * z); ctx.fillRect(1 * z, -7 * z, 5 * z, 2 * z); }
      ctx.restore();
    } else if (f.k === 'spark'){
      f.vy += 420 * dt; f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = 1 - u; ctx.drawImage(GLOW, f.x - 12, f.y - 12, 24, 24);
    }
    ctx.globalAlpha = 1;
    if (u >= 1) FX.splice(i, 1);
  }
}

/* ---------- lutins qui se promènent ---------- */
const elfSprites = [0, 1, 2].map(v => SPR['elf:' + v]);
const elves = Array.from({length: 9}, (_, i) => ({x: 13 + i * 2, y: 22, tx: 13 + i * 2, ty: 22, v: i % 3, wait: Math.random() * 3, carry: ['wood', null, 'cookies', 'coins', null, 'fabric', 'wood', null, 'train'][i]}));
// les lutins choisissent une destination au bout des allées et y vont par le plus court chemin (recherche en largeur),
// s'arrêtent un moment, puis repartent : on voit un vrai va-et-vient, plus de zigzag case par case
let pathKey = '', pathSet = null;
function paths(){ const L = S.objs.filter(o => o.type === 'path'), k = L.length + ':' + (L[0]?.x || 0); if (k !== pathKey){ pathKey = k; pathSet = new Map(L.map(o => [o.x + ',' + o.y, o])); } return pathSet; }
function route(fx, fy){
  const P = paths(); if (!P.size) return null;
  const start = `${Math.floor(fx)},${Math.floor(fy)}`; if (!P.has(start)) { const L = [...P.values()]; const n = L.reduce((m, o) => Math.hypot(o.x + .5 - fx, o.y + .5 - fy) < Math.hypot(m.x + .5 - fx, m.y + .5 - fy) ? o : m, L[0]); return [[n.x + .5, n.y + .5]]; }
  const prev = new Map([[start, null]]), q = [start], far = [];
  while (q.length){ const c = q.shift(); far.push(c); const [x, y] = c.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){ const n = `${x + dx},${y + dy}`; if (P.has(n) && !prev.has(n)){ prev.set(n, c); q.push(n); } } }
  const pool = far.slice(Math.floor(far.length * .35)); const goal = pool[Math.floor(Math.random() * pool.length)] || start;
  const out = []; for (let c = goal; c && c !== start; c = prev.get(c)){ const [x, y] = c.split(',').map(Number); out.unshift([x + .5, y + .5]); }
  return out;
}
function moveElves(dt){
  for (const e of elves){
    if (!e.route?.length){ e.walk = false; e.wait -= dt; if (e.wait <= 0){ e.route = route(e.x, e.y) || []; e.wait = 1.5 + Math.random() * 4; } continue; }
    const [tx, ty] = e.route[0], dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy);
    if (d < .02){ e.route.shift(); continue; }
    const st = Math.min(d, dt * .85); e.x += dx / d * st; e.y += dy / d * st; e.phase = (e.phase || 0) + st;
    if (Math.abs(dx) > .01 || Math.abs(dy) > .01) e.dir = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 0 : 2) : (dy > 0 ? 1 : 3);
    e.walk = true;
  }
}
// le visiteur : un lutin habillé autrement, avec une bulle de ce qu'il demande ; on le touche pour lui répondre
let visitorRect = null;
function drawVisitor(x, y){
  const c = toScreen(x, y), s = elfSprites[(S.visitor.who.length) % elfSprites.length], z = cam.z * 1.15, bob = Math.sin(performance.now() / 300) * 2;
  // halo doré au sol : on repère tout de suite le visiteur
  ctx.save(); ctx.globalAlpha = .55 + Math.sin(performance.now() / 250) * .2; ctx.fillStyle = '#ffd34a'; ctx.beginPath(); ctx.ellipse(c.x, c.y, 22 * cam.z, 11 * cam.z, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.drawImage(s.canvas, c.x - s.ax * z, c.y - s.ay * z + bob, s.w * z, s.h * z);
  const k = Object.keys(S.visitor.want)[0], top = c.y - 44 * z;
  bubble(c.x, top, k, '?');
  visitorRect = {left: c.x - 36, right: c.x + 36, top: top - 64, bottom: c.y + 10};
}
const ready = k => { const x = SPR[k]; return x && x.canvas && x.canvas.complete !== false ? x : null; };
function drawElf(e){ const c = toScreen(e.x, e.y), ot = M.skinState(S).elves, suf = ot === 'classic' ? '' : '@' + ot; let s = (suf && ready(`elf:${e.v}${suf}`)) || elfSprites[e.v], bob = 0;
  if (e.walk){ const kf = `elfw:${e.v}:${e.dir || 0}:${Math.floor(e.phase * 9) % 8}`, f = (suf && ready(kf + suf)) || SPR[kf]; if (f && f.canvas && f.canvas.complete !== false) s = f; else bob = Math.abs(Math.sin(performance.now() / 120)) * 3; }
  ctx.drawImage(s.canvas, c.x - s.ax * cam.z, c.y - s.ay * cam.z - bob, s.w * cam.z, s.h * cam.z);
  // certains lutins portent une caisse au-dessus de la tête quand ils marchent
  if (e.carry && e.walk && ICON[e.carry]){ const im = img(ICON[e.carry]); if (im.complete){ const z = 22 * Math.max(.7, cam.z); ctx.drawImage(im, c.x - z / 2, c.y - 29 * cam.z - bob - z * .8, z, z); } } }

/* =====================================================================
   TOUCHER : déplacer la vue, glisser pour récolter/planter, placer
   ===================================================================== */
const ptrs = new Map(); let drag = null;
// Toucher précis : on teste la vraie silhouette dessinée (pixels opaques de l'image), du plus proche au plus lointain.
// Les allées et les sapins sauvages passent en dernier : ils ne « volent » plus le toucher d'un bâtiment.
const MASKS = {};
function maskOf(key){
  if (MASKS[key] !== undefined) return MASKS[key];
  const s = SPR[key], im = s && s.canvas; if (!im || im.complete === false || !(im.width || im.naturalWidth)){ return null; }
  const w = Math.max(1, Math.round(s.w / 4)), h = Math.max(1, Math.round(s.h / 4)), c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(im, 0, 0, w, h);
  let d = null; try { d = x.getImageData(0, 0, w, h).data; } catch(e){}
  return MASKS[key] = d ? {w, h, d} : false;
}
function hitSprite(o, sx, sy, pad = 0){
  const r = objScreenRect(o); if (sx < r.left - pad || sx > r.left + r.width + pad || sy < r.top - pad || sy > r.top + r.height + pad) return false;
  const m = maskOf(spriteKey(o)); if (!m) return sx > r.left + r.width * .15 && sx < r.left + r.width * .85 && sy > r.top + r.height * .1;
  // on regarde un petit voisinage (le doigt n'est pas un pixel)
  for (const [dx, dy] of [[0, 0], [-8, 0], [8, 0], [0, -8], [0, 8]]){
    const u = Math.floor((sx + dx - r.left) / r.width * m.w), v = Math.floor((sy + dy - r.top) / r.height * m.h);
    if (u >= 0 && v >= 0 && u < m.w && v < m.h && m.d[(v * m.w + u) * 4 + 3] > 60) return true; }
  return false;
}
function objAt(sx, sy){
  const order = [...S.objs].sort((a, b) => (b.x + b.y + B(b).w) - (a.x + a.y + B(a).w));
  const main = o => !o.wild && B(o).kind !== 'path';
  for (const o of order) if (main(o) && hitSprite(o, sx, sy)) return o;        // le plus en avant sous le doigt (déco devant un bâtiment comprise)
  const t = toTile(sx, sy);
  for (const o of order){ const b = B(o); if (main(o) && t.x >= o.x && t.x < o.x + b.w && t.y >= o.y && t.y < o.y + b.h) return o; }
  for (const o of order) if (o.wild && hitSprite(o, sx, sy)) return o;                                  // sapins sauvages
  for (const o of order) if (B(o).kind === 'path' && Math.floor(t.x) === o.x && Math.floor(t.y) === o.y) return o;   // allées
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
  if (drag.mode === 'pan'){ glide = null; cam.x -= dx / cam.z; cam.y -= dy / cam.z; clampCam(); return; }
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

/* ---------- cadeaux tombés du traîneau : à ramasser sur la carte ---------- */
let dropRect = null, sleighT = -1e9, sleighTo = null;
// le traîneau traverse le ciel (2,6 s) ; il lâche le cadeau au-dessus de l'allée choisie
function drawSleigh(){
  const u = (performance.now() - sleighT) / 2600; if (u < 0 || u > 1 || !sleighTo) return;
  const c = toScreen(sleighTo.x, sleighTo.y), x = -120 + (W + 240) * u, y = Math.max(260, c.y - 240) - Math.sin(u * Math.PI) * 50;
  const im = img(ICON.mg_sleigh); if (!im.complete) return;
  for (let j = 1; j <= 10; j++){ const r = 16 - j; ctx.globalAlpha = .75 - j * .06; ctx.drawImage(GLOW, x - 70 - j * 20 - r, y + 18 - r, r * 2 + 10, r * 2 + 10); }
  ctx.globalAlpha = 1; ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.drawImage(im, -85, -62, 170, 124); ctx.restore();
}
function dropTick(){
  const t = now();
  if (S.drop && S.drop.until < t) S.drop = null;
  if (S.drop || tuto.active() || S.lvl < 2) return;
  S.dropNext ||= t + 3 * 60e3; if (t < S.dropNext) return;
  const paths = S.objs.filter(o => o.type === 'path'); if (!paths.length) return;
  const p = paths[Math.floor(Math.random() * paths.length)];
  S.drop = {x: p.x + .5, y: p.y + .5, until: t + 4 * 60e3, born: t + 1600}; sleighT = performance.now(); sleighTo = {x: p.x + .5, y: p.y + .5}; S.dropNext = t + (6 + Math.random() * 6) * 60e3;
}
function drawDrop(){
  dropRect = null; const d = S.drop; if (!d || now() < d.born) return;
  const c = toScreen(d.x, d.y), age = (now() - d.born) / 1000, fall = Math.max(0, 1 - age / .8), z = Math.max(.75, cam.z);
  const y = c.y - 26 * z - fall * 260 + Math.sin(performance.now() / 300) * 3, r = 30 * z;
  const pu = 1.5 + Math.sin(performance.now() / 180) * .25; ctx.drawImage(GLOW, c.x - r * pu, y - r * pu, r * pu * 2, r * pu * 2); ctx.drawImage(GLOW, c.x - r * pu, y - r * pu, r * pu * 2, r * pu * 2);
  ctx.save(); ctx.globalAlpha = .9; ctx.strokeStyle = '#ffd34a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(c.x, c.y, 26 * z * pu / 1.5, 13 * z * pu / 1.5, 0, 0, 7); ctx.stroke(); ctx.restore();
  const im = img(thumbs.gifts); if (im.complete) ctx.drawImage(im, c.x - r, y - r, r * 2, r * 2);
  dropRect = {left: c.x - r, right: c.x + r, top: y - r, bottom: y + r + 10};
}
function pickDrop(){
  const L = S.lvl, r = Math.random(), m = 1 + L * .3;
  const give = r < .05 ? {stars: 1} : r < .2 ? {ice: 2 + Math.floor(L / 4)} : r < .35 ? {[Math.random() < .5 ? 'axe' : 'saw']: 1} : r < .7 ? {coins: Math.round(120 * m)} : {[['wood', 'cookies'][Math.floor(Math.random() * 2)]]: Math.round(150 * m)};
  const at = toScreen(S.drop.x, S.drop.y); S.drop = null; T.track(S, 'drop'); sfx.collect();
  giveReward(give, {x: at.x, y: at.y - 30}); toast('Un cadeau tombé du traîneau !'); save();
}
function tap(o, at){
  if (S.drop && dropRect && at.x > dropRect.left - 10 && at.x < dropRect.right + 10 && at.y > dropRect.top - 10 && at.y < dropRect.bottom) return pickDrop();
  if (o) bounceAt.set(o, performance.now());
  if (S.visitor && visitorRect && at.x > visitorRect.left && at.x < visitorRect.right && at.y > visitorRect.top && at.y < visitorRect.bottom) return openVisitor();
  sfx.tap();
  if (!o || o.wild){
    const l = lotAt(at.x, at.y);
    if (l){ const why = T.buildBlock(S, l.type); if (why){ sfx.err(); return toast(`${BUILDINGS[l.type].name} : ${why}`); } return startPlace(l.type, l); }
  }
  if (!o){
    const t = toTile(at.x, at.y), cx = Math.floor(t.x / T.CHUNK), cy = Math.floor(t.y / T.CHUNK);
    if (cx >= 0 && cy >= 0 && cx < T.MAP / T.CHUNK && cy < T.MAP / T.CHUNK && !isOpen(cx, cy) && isNextToOpen(cx, cy)) return openPanel('expand', {cx, cy});
    { const z = isOpen(cx, cy) && T.zoneOf(cx, cy); if (z && z.feat === 'lake' && Math.hypot(t.x - (cx * T.CHUNK + 5.5), t.y - (cy * T.CHUNK + 5.5)) < 3.2) return openPanel('fish'); }
    selObj = null; closePanel(); return;
  }
  selObj = o;
  const b = B(o);
  if (workEnd(o)) return openPanel('site', o);
  if (b.kind === 'prod'){ if (o.job && o.job.end <= now()) return openPanel('bld', o); if (!collectBld(o)) openPanel('bld', o); return; }
  // d'abord la fiche du bâtiment (ce qu'il fait, son niveau), puis un bouton pour entrer dans son activité
  if (b.kind === 'craft'){ if (!collectToys(o, at)) openPanel('bld', o); return; }
  if (T.isUpgradable(b)) return openPanel('bld', o);
  openPanel('info', o);
}

/* =====================================================================
   INTERFACE
   ===================================================================== */
// barre du haut : 4 caractères au plus (999, 9,5k, 40k, 1,2M) pour que tout tienne sur un iPhone
const fmtS = n => { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(n < 1e7 ? 1 : 0).replace('.', ',') + 'M' : n >= 1e4 ? Math.floor(n / 1e3) + 'k' : n >= 1e3 ? (Math.floor(n / 100) / 10).toFixed(1).replace('.', ',') + 'k' : String(n); };
const fmt = n => { n = Math.floor(n); return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1).replace('.', ',') + 'k' : String(n); };
const fmtR = n => n < 10 && n % 1 ? String(Math.round(n * 10) / 10).replace('.', ',') : fmt(n);
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
  $('#xpbar b').textContent = `XP ${fmt(S.xp)} / ${fmt(T.xpNeed(S.lvl))}`;
  $('#h-coins b').textContent = fmtS(S.coins);
  $('#h-stars b').textContent = fmtS(S.stars);
  for (const r of ['wood', 'cookies', 'fabric']){
    const e = $('#h-' + r), c = T.cap(S, r);
    e.hidden = r === 'fabric' && !S.fabric && !S.objs.some(o => o.type === 'mill');
    e.querySelector('b').textContent = fmtS(S[r]); e.querySelector('.cap i').style.width = Math.min(100, S[r] / c * 100) + '%'; e.classList.toggle('full', S[r] >= c);
  }
  const L = T.lutins(S), E = T.employed(S);
  $('#h-pop').textContent = `${Math.min(E, L)} / ${L}`; $('#h-pop').classList.toggle('bad', E > L);
  $('#h-joy').textContent = `+${Math.round(T.joyBonus(S) * 100)} %`;
  $('#h-title').textContent = M.titleOf(S.lvl);
  { const e = $('#h-joy'), sb = T.showBonus(S); e.textContent = `+${Math.round((T.joyBonus(S) + T.lightsBonus(S) + sb) * 100)} %`; e.classList.toggle('boost', sb > 0); }
  const toys = Object.entries(S.inv).filter(([k, n]) => ITEMS[k]?.toy && n > 0).reduce((a, [, n]) => a + n, 0);
  $('#b-barn small').textContent = toys;
  const ready = S.orders.filter(od => od.items && T.has(S, od.items)).length;
  const bd = $('#b-orders .badge'); bd.textContent = ready; bd.hidden = !ready;
  { const Ms = M.missions(S), n = Ms.list.filter(m => !m.done && m.v >= m.n).length + M.MISSION_CHESTS.filter((p, i) => Ms.pts >= p && !Ms.chests.includes(i)).length + M.achClaimable(S), e = $('#b-missions .badge'); e.textContent = n; e.hidden = !n; }
  { const P = M.pass(S); let n = 0; for (let t = 1; t <= P.tier; t++){ if (!P.free[t]) n++; if (P.premium && !P.gold[t]) n++; } const e = $('#b-pass .badge'); e.textContent = n; e.hidden = !n; }
  { const e = $('#b-shop .badge'); e.hidden = !!S.iap?.starter && M.dailyDeals(S).every(d => d.done); }
  $('#b-market').hidden = T.hqLv(S) < M.MARKET_HQ;
  { const n = tuto.active() ? 0 : todoList().length, e = $('#b-village .badge'); if (e){ e.textContent = n; e.hidden = !n; } }
  { const e = $('#b-event'); e.hidden = S.lvl < 3; const n = M.eventClaimable(S); e.querySelector('.badge').textContent = n; e.querySelector('.badge').hidden = !n; }
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
function openPanel(name, arg){ if (name !== 'craft'){ fromOrder = false; wantToy = ''; } closeSeeds(); panel = name; panelArg = arg; panelHtml = ''; document.body.classList.add('sheet-open'); renderPanel(); tutoEv('open:' + name); }
function closePanel(){ const was = panel; panel = null; panelHtml = ''; document.body.classList.remove('sheet-open'); selObj = null; if (was) tutoEv('close'); }
const hd = (small, title) => `<div class="hd"><div class="tt"><small>${small}</small><h2>${title}</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>`;
const need = req => Object.entries(req || {}).map(([k, n]) => `<span class="need ${haveOf(k) >= n ? 'have' : ''}"><img src="${ICON[k]}" alt=""><b>${fmt(haveOf(k))}/${fmt(n)}</b></span>`).join('');
const costChips = req => Object.entries(req || {}).map(([k, n]) => `<span class="chip ${haveOf(k) < n ? 'bad' : ''}">${k === 'stars' ? '<i class="i star"></i>' : icon(k)}${fmt(n)}</span>`).join('');
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
        <div class="letter"><p>${od.msg || 'Cher Père Noël, voici ma liste !'}</p><i>— ${od.kid}${od.age ? `, ${od.age} ans, ${od.city}` : ''}</i></div>
        <div class="odh"><small>Récompense${wrapOk(od) ? ' · emballée' : ''}</small><span class="rw"><span>${icon('coins')}${Math.round(od.coins * (wrapOk(od) ? T.WRAP_BONUS : 1))}</span><span><i class="i xp">XP</i>${Math.round(od.xp * (wrapOk(od) ? T.WRAP_BONUS : 1))}</span>${od.mat ? `<span><img class="i" src="${ICON[od.mat]}" alt="">1</span>` : ''}${od.stars ? `<span><i class="i star"></i>${od.stars}</span>` : ''}</span></div>
        <div class="big">${Object.entries(od.items || {}).map(([k, n]) => { const h = S.inv[k] || 0; return `<div class="bi ${h >= n ? 'have' : ''}"><img src="${ICON[k]}" alt="">${h >= n ? '<i class="ck"></i>' : `<button class="loupe" data-a="findtoy" data-k="${k}" aria-label="Où le fabriquer ?">🔍</button>`}<b>${Math.min(h, n)}/${n}</b>${h > n ? `<small class="inst">${h} en stock</small>` : ''}</div>`; }).join('')}</div>
        ${S.lvl >= TOYS.paper.lvl ? `<button class="wrapbtn ${S.wrapOn ? 'on' : ''}" data-a="wrap"><img src="${ICON.paper}" alt=""><span><b>Emballer · ${T.wrapNeed(od)} papier${T.wrapNeed(od) > 1 ? 's' : ''} cadeau</b><small>${S.inv.paper || 0} en stock · +50 % pièces et XP, parfois une étoile</small></span><i class="tog"></i></button>` : ''}
        <div class="oacts"><button class="trash" data-a="trash" data-i="${selOrder}" aria-label="Remplacer cette commande"></button><button class="btn green" data-a="deliver" data-i="${selOrder}" ${T.has(S, od.items) ? '' : 'disabled'}>Livrer</button></div>
      </div>` : '<p class="meta">De nouvelles commandes arrivent…</p>';
    h = hd('Lettres des enfants', 'Bureau du traîneau') + (workshopOf() ? `<p class="help">Fabrique les jouets à l’<b>Atelier des jouets</b>, puis reviens ici pour les livrer. <button class="lnk" data-a="gocraft">Aller à l’atelier ›</button></p>` : '<p class="help">Les jouets se fabriquent à l’<b>Atelier des jouets</b>, qui se débloque avec la <b>Maison du Père Noël niv. 2</b>.</p>') + detail + `<div class="otiles">${tiles}</div>`;
  }
  else if (panel === 'craft'){
    const o = panelArg, q = o.q || [], n = T.craftSlots(o.lv);
    const slots = Array.from({length: n}, (_, i) => q[i] ? `<div class="slot ${q[i].end <= now() ? 'ready' : i === 0 || q[i - 1].end <= now() ? 'run' : ''}"><img src="${ICON[q[i].item]}" alt="">${q[i].end > now() && (i === 0 || q[i - 1].end <= now()) ? `<small data-until="${q[i].end}"></small>` : ''}</div>` : '<div class="slot empty"></div>').join('');
    h = hd(`Niveau ${o.lv} · vitesse ×${T.craftSpeed(o.lv).toFixed(2)}`, 'Atelier des jouets') + (fromOrder ? `<button class="btn blue wide backord" data-a="backorder">‹ Retour à la lettre</button>` : '') + `<p class="help">Touche un jouet pour le mettre dans la file. Les jouets marqués <b>Demandé</b> sont attendus dans les lettres.</p><h3>File de fabrication (${q.length}/${n})</h3><div class="slots">${slots}</div>
      ${craftDone(o).length ? '<button class="btn gold wide" data-a="toys">Récupérer les jouets</button>' : ''}${lettersNeed(o).length ? `<button class="btn green wide" data-a="autoq">Fabriquer pour les lettres (${lettersNeed(o).length})</button>` : ''}
      <h3>Jouets</h3><div class="recipes">${Object.entries(TOYS).map(([k, t]) => { const lock = S.lvl < t.lvl, wanted = S.orders.some(od => od.items?.[k]);
        return `<button class="recipe ${lock ? 'locked' : ''} ${!lock && T.has(S, t.cost) ? 'ok' : ''} ${wantToy === k ? 'want' : ''}" data-a="queue" data-k="${k}">${wanted && !lock ? '<span class="wanted">Demandé</span>' : ''}<img src="${ICON[k]}" alt=""><b>${ITEMS[k].name}</b>
        ${lock ? `<span class="why">Niveau ${t.lvl}</span>` : `<span class="costs">${costChips(t.cost)}</span><span class="meta">${fmtTime(t.time / T.craftSpeed(o.lv))} · en stock : ${S.inv[k] || 0}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'games'){
    const g = tickets();
    h = hd('', 'Mini-jeux') + `<div class="tix"><span>${'<i class="tk"></i>'.repeat(g.tickets)}${'<i class="tk off"></i>'.repeat(TMAX - g.tickets)}</span><small>${g.tickets < TMAX ? `+1 ticket dans <b data-until="${g.t + TEVERY}"></b>` : 'Tickets au maximum'}</small></div>
      ${campCard()}<div class="games">${[['sleigh', ICON.mg_sleigh], ['snow', thumbs.gifts || ICON.mg_gift]].map(([k, ic]) => `<button class="gcard" data-a="play" data-k="${k}"><img src="${ic}" alt=""><b>${GAMES[k].name}</b><span class="meta">Record : ${S.games.best[k] || 0}</span><span class="btn green sm">Jouer</span></button>`).join('')}</div>
      <p class="meta">Gagne des pièces, de l'XP, des étoiles et des matériaux !</p>`;
  }
  else if (panel === 'fish'){
    const F = S.fish || {}, got = T.FISH.filter(f => F[f.k]).length, c = T.baitCost(S);
    h = hd(`Carnet : ${got} / ${T.FISH.length} espèces`, 'Pêche sur glace') + `<div class="fishhole ${fishSt.mode}" data-a="fishtap"><div class="ice"></div><div class="hole"><span class="bob"></span></div>
        <div class="fmsg">${fishSt.msg || 'Lance ta ligne dans le trou !'}</div>${fishSt.got ? `<div class="fgot">${fishSvg(fishSt.got.c, 70)}<b>${fishSt.got.name}</b><small>${fishSt.got.size} cm · ${T.RARITY[fishSt.got.r].name}${fishSt.first ? ' · <em>Nouvelle espèce !</em>' : fishSt.rec ? ' · <em>Record !</em>' : ''}</small></div>` : ''}</div>
      ${fishSt.mode === 'wait' || fishSt.mode === 'bite' ? `<button class="btn red wide big" data-a="fishtap">${fishSt.mode === 'bite' ? 'FERRER !' : 'Attendre… (touche quand ça mord)'}</button>` : `<button class="btn green wide" data-a="fishcast"><span class="costs">${costChips(c)}</span>Lancer la ligne</button>`}
      <h3>Carnet de pêche</h3><div class="fishbook">${T.FISH.map(f => { const x = F[f.k]; return `<div class="fb ${x ? '' : 'no'}" style="--rc:${T.RARITY[f.r].c}">${fishSvg(x ? f.c : '#c9bda4', 40)}<b>${x ? f.name : '???'}</b><small>${x ? `${x.n} pêché${x.n > 1 ? 's' : ''} · ${x.best} cm` : T.RARITY[f.r].name}</small></div>`; }).join('')}</div>`;
  }
  else if (panel === 'pet'){
    const p = T.petState(S);
    if (!p) h = hd('', 'Flocon, le renne magique') + '<p class="help">Construis l’Écurie des rennes : Flocon viendra y vivre.</p>';
    else { const st = T.PET_STAGES[T.petStage(p.lv)], nx = T.PET_STAGES[T.petStage(p.lv) + 1], need = T.petNeed(p.lv), pat = T.petCanPat(S), hh = T.petHearts(S);
      h = hd(`${st[1]} · niveau ${p.lv}`, 'Flocon, le renne magique') + `<div class="petbox stage${T.petStage(p.lv)}"><div class="petimg"><img src="${petImg()}" alt="" style="--sz:${Math.min(1, .55 + p.lv * .03)}"></div>
        <div class="xpbar2"><i style="width:${p.xp / need * 100}%"></i><em>${fmt(p.xp)} / ${fmt(need)}</em></div>${nx ? `<small class="meta">Au niveau ${nx[0]}, Flocon devient « ${nx[1]} »</small>` : ''}</div>
        <div class="petbon"><div><b>+${Math.round(T.petProd(S) * 100)} %</b><small>sur toute la production</small></div><div><b>+${hh} cœur${hh > 1 ? 's' : ''}</b><small>dans la Campagne${hh < 2 ? ` (niv. ${p.lv < 5 ? 5 : 12})` : ''}</small></div></div>
        <button class="btn ${pat ? 'gold' : 'blue'} wide" data-a="petpat" ${pat ? '' : 'disabled'}>${pat ? 'Caresser Flocon (petit cadeau)' : `Flocon se repose · <b data-until="${p.pat + T.PET_PAT}"></b>`}</button>
        <h3>Le nourrir</h3><div class="petfood">${T.petFoods(S).map(f => `<button class="pf ${f.k === 'fav' ? 'fav' : ''}" data-a="petfeed" data-k="${f.k}">${f.k === 'fav' ? `<span class="tag">Préféré du jour</span>` : ''}<span class="costs">${costChips(f.cost)}</span><b>+${fmt(f.xp)} XP</b></button>`).join('')}</div>
        <h3>Évolution</h3><div class="petevo">${T.PET_STAGES.map(([l, n], k) => `<div class="pe ${p.lv >= l ? 'on' : ''} ${T.petStage(p.lv) === k ? 'cur' : ''}"><img src="${petImg(k)}" alt=""><b>${n}</b><small>${p.lv >= l ? (T.petStage(p.lv) === k ? 'Maintenant' : '✓') : `Niv. ${l}`}</small></div>`).join('')}</div>
        <h3>Apparence</h3><div class="petskins">${M.PET_SKIN_LIST.map(d => { const own = M.hasSkin(S, d.k), wear = M.skinState(S).pet === d.k;
          return `<div class="ps ${wear ? 'wear' : ''} ${own ? '' : 'lockd'}"><img src="${petImg(undefined, d.k)}" alt=""><b>${d.name}</b>${wear ? '<span class="tagw">Porté</span>' : own ? `<button class="btn blue sm" data-a="skinwear" data-k="${d.k}">Porter</button>` : d.event ? `<small class="ev">❄ Événement</small>` : `<button class="btn gold sm" data-a="skinbuy" data-k="${d.k}"><i class="i star"></i>${d.stars}</button>`}</div>`; }).join('')}</div>
        <p class="meta">Les skins Doré et Aurore se gagnent dans la boutique de l’événement de la semaine.</p>`; }
  }
  else if (panel === 'lore'){
    const ch = T.chapterOf(S.quest.i);
    const BEST = [
      ['krampus', 'Krampus des Glaces', "Autrefois Gardien de l'Hiver et ami du premier Père Noël. Il s'est senti oublié quand les enfants n'ont plus attendu que Noël. Il a arraché des éclats à l'Étoile du Nord pour qu'elle s'éteigne et que l'hiver ne finisse plus.", 0],
      ['chief', 'Grognard, chef des trolls', "Chef des trolls des neiges. Il sert le Krampus contre des cristaux volés. Brutal, gourmand, et terriblement rancunier.", 4],
      ['baron', 'Baron Glaçon', "Bonhomme de neige animé par la magie du Krampus. Devenu marchand, il revend au plus offrant les cadeaux perdus du Pôle.", 14],
      ['troll', 'Troll des neiges', "Le soldat de base. Deux boules de neige suffisent… s'il ne t'atteint pas avant.", 0],
      ['runner', 'Troll coureur', "Petit et très rapide. Vise-le en premier.", 2],
      ['shield', 'Troll au bouclier', "Son bouclier de glace encaisse deux coups. L'Avalanche le brise d'un coup.", 4],
      ['thrower', 'Troll lanceur', "S'arrête à mi-chemin et lance des boules de neige sur la palissade. Touche ses boules en vol pour les parer.", 6],
      ['yeti', 'Yéti', "Énorme et lent. S'il atteint la palissade, elle tremble jusqu'aux fondations.", 12],
    ];
    const LORE = [
      [0, "L'Étoile du Nord", "Forgée il y a mille hivers par le premier Père Noël et les lutins, elle fait voler les rennes et porte les vœux des enfants jusqu'au Pôle."],
      [2, 'Le Gardien de l\'Hiver', "Avant d'être le Krampus, il veillait sur les neiges. Il dansait avec le premier Père Noël sous les aurores. Puis on l'a oublié."],
      [6, 'Les éclats de glace', "Les cristaux de la Grotte sont des éclats de l'Étoile, cachés sous la glace par le Krampus. Chaque cristal remonté lui rend un peu de lumière."],
      [13, 'La Citadelle de Glace', "Tout au nord, derrière les Pics du Krampus. Le dernier éclat de l'Étoile y bat comme un cœur."],
      [16, 'Le renne né de la lumière', "Flocon est né la nuit où le premier cristal est remonté. Le grimoire de Mademoiselle Plume dit que lui seul peut atteindre la Citadelle."],
    ];
    h = hd(`Chapitre ${Math.min(ch + 1, T.CHAPTERS.length)} · ${BEST.filter(b => ch >= b[3]).length} / ${BEST.length} fiches`, 'Légendes du Grand Nord') + `<h3>Les ennemis</h3><div class="best">${BEST.map(([k, n, d, at]) => ch >= at ? `<div class="bst"><img src="${vp(k)}" alt=""><div><b>${n}</b><small>${d}</small></div></div>` : `<div class="bst bst-lock"><span>?</span><div><b>???</b><small>Chapitre ${at + 1}</small></div></div>`).join('')}</div>
      <h3>Les légendes</h3><div class="mlist">${LORE.map(([at, t, d]) => ch >= at ? `<div class="mis lore"><div><b>${t}</b><small>${d}</small></div></div>` : `<div class="mis lore lore-lock"><div><b>Page déchirée</b><small>Chapitre ${at + 1}</small></div></div>`).join('')}</div>
      <h3>Revoir les cinématiques</h3><div class="replays">${T.CHAPTERS.slice(0, ch + 1).map((c, k) => `<button class="btn blue sm" data-a="replay" data-i="${k}">${k + 1}. ${c.title}</button>`).join('')}</div>`;
  }
  else if (panel === 'camp'){
    const C = T.campState(S), from = Math.max(0, Math.floor(C.at / 10) * 10 - 10), list = Array.from({length: Math.min(C.at + 1, from + 20) - from}, (_, j) => T.camp(from + j)).reverse();
    const tot = Object.values(C.st).reduce((a, b) => a + b, 0);
    h = hd(`${C.at} camp${C.at > 1 ? 's' : ''} vaincu${C.at > 1 ? 's' : ''} · ${tot} ★`, 'Campagne des Trolls') + `<button class="btn gold wide" data-a="lore" style="margin:0 0 12px">Légendes du Grand Nord</button><p class="help">Les trolls des neiges volent les cadeaux ! Attaque leurs camps un par un. Chaque attaque coûte le goûter des lutins (biscuits). Protège la palissade : plus elle reste solide, plus tu gagnes d'étoiles.</p>
      <div class="camps">${list.map(c => { const st = C.st[c.i] || 0, cur = c.i === C.at, lk = c.i > C.at, cost = T.campCost(c.i);
        return `<div class="campc ${c.boss ? 'boss' : ''} ${cur ? 'cur' : ''} ${st ? 'won' : ''}"><div class="cn"><b>${c.name}</b><small>${c.n} trolls${c.boss ? ' + le chef' : ''}${c.hp > 1 ? ` · ${c.hp} coups chacun` : ''}</small><span class="cst">${[1, 2, 3].map(k => `<i class="${k <= st ? 'on' : ''}">★</i>`).join('')}</span></div>
          <div class="ca"><span class="costs">${rewardChips(T.campLoot(S, c.i, 3, !st))}</span><button class="btn ${cur ? 'red' : 'blue'} sm" data-a="campgo" data-i="${c.i}" ${lk ? 'disabled' : ''}><span class="costs">${costChips(cost)}</span>${cur ? 'Attaquer' : 'Rejouer'}</button></div></div>`; }).join('')}</div>`;
  }
  else if (panel === 'account'){
    const u = ACC.current(), pv = ACC.providers();
    if (!ACC.ready()) h = hd('', 'Mon compte') + '<p class="help">La connexion (Google ou e-mail) arrive très bientôt. En attendant, ton village est gardé sur ce téléphone : ne supprime pas l\'app.</p>';
    else if (!u) h = hd('Garde ton village pour toujours', 'Mon compte') + `<p class="help">Connecte-toi : ton village est sauvegardé en ligne et tu le retrouves sur n'importe quel téléphone.</p>
      <button class="btn wide gbtn" data-a="accgoogle"><span class="g">G</span>Continuer avec Google</button>
      <h3>Ou avec ton e-mail</h3><div class="accform"><input id="accname" placeholder="Ton prénom (pour créer un compte)" autocomplete="nickname"><input id="accmail" type="email" placeholder="E-mail" autocomplete="email"><input id="accpass" type="password" placeholder="Mot de passe (6 caractères min.)" autocomplete="current-password"></div>
      <div class="savebtns"><button class="btn green" data-a="acclogin">Se connecter</button><button class="btn blue" data-a="accsignup">Créer un compte</button></div>
      <button class="lnk" data-a="accreset">Mot de passe oublié ?</button>`;
    else h = hd(u.email || '', 'Mon compte') + `<div class="mis"><div><b>${u.displayName || 'Père Noël'}</b><small>Connecté · village sauvegardé en ligne ${S.cloudT ? '· dernière sauvegarde ' + new Date(S.cloudT).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : ''}</small></div></div>
      <h3>Moyens de connexion</h3><div class="mlist"><div class="mis"><b>Google</b>${pv.includes('google.com') ? '<span class="meta">relié ✓</span>' : '<button class="btn blue sm" data-a="acclinkg">Relier</button>'}</div>
      <div class="mis"><b>E-mail et mot de passe</b>${pv.includes('password') ? '<span class="meta">relié ✓</span>' : '<button class="btn blue sm" data-a="acclinkm">Relier</button>'}</div></div>
      ${pv.includes('password') ? '' : '<div class="accform"><input id="accmail" type="email" placeholder="E-mail à relier"><input id="accpass" type="password" placeholder="Mot de passe"></div>'}
      <button class="btn green wide" data-a="accsave">Sauvegarder maintenant</button><button class="btn red wide" data-a="acclogout">Se déconnecter</button>`;
  }
  else if (panel === 'save'){
    h = hd('Ton village voyage avec toi', 'Sauvegarde') + (S.lvl < 9 && !S.restored ? `<div class="restorebox"><b>Tu as perdu ta partie ?</b><small>Réinstaller l'app sur l'écran d'accueil efface sa mémoire. On peut te rendre ton village tel qu'il était (niveau 9, Maison niveau 14, tes ressources et tes étoiles).</small><button class="btn gold wide" data-a="restoreold">Récupérer mon village</button></div>` : '') + `<p class="help">Ton village est gardé sur ce téléphone. Pour le retrouver ailleurs (nouveau téléphone, autre navigateur), copie ton <b>code de sauvegarde</b> ou enregistre le <b>fichier</b>, puis charge-le sur l'autre appareil.</p>
      <h3>Emporter mon village</h3><div class="savebtns"><button class="btn green" data-a="savecopy">Copier mon code</button><button class="btn blue" data-a="savefile">Enregistrer un fichier</button></div>
      <textarea id="savecode" readonly placeholder="Ton code apparaîtra ici">${saveCodeTxt}</textarea>
      <h3>Charger un village</h3><textarea id="loadcode" placeholder="Colle ici un code de sauvegarde"></textarea>
      <div class="savebtns"><button class="btn gold" data-a="saveload">Charger ce code</button><label class="btn blue">Ouvrir un fichier<input type="file" id="loadfile" accept=".json,.txt,application/json,text/plain" hidden></label></div>
      <p class="meta">Attention : charger un village remplace celui de ce téléphone.</p>`;
  }
  else if (panel === 'museum'){
    const R = S.relics || {}, done = T.RELIC_SETS.filter(st => T.relicSetDone(S, st)).length, got = T.RELICS.filter(x => R[x.k]).length;
    S.relicClaim ||= {};
    h = hd(`${got} / ${T.RELICS.length} trouvailles · production +${Math.round(T.museumProd(S) * 100)} %`, 'Musée des trouvailles') + `<p class="help">Des objets rares se cachent dans les lots de la Salle des ventes, les colis mystère, les chefs trolls et les poissons légendaires. Chaque collection complète : une récompense et <b>+2 % de production</b> pour toujours.</p>`
      + T.RELIC_SETS.map(st => { const ok = T.relicSetDone(S, st), cl = S.relicClaim[st.k];
        return `<div class="rset ${ok ? 'done' : ''}"><div class="rsh"><b>${st.name}</b><small>${st.items.filter(([k]) => R[k]).length} / 5</small></div><div class="relics">${st.items.map(([k, name, ico, r]) => { const n = R[k] || 0;
          return `<div class="relic ${n ? '' : 'no'}" style="--rc:${T.RARITY[r].c}"><span class="ri">${n ? ico : '?'}</span><small>${n ? name : T.RARITY[r].name}</small>${n > 1 ? `<em class="cnt">×${n}</em><button class="dup" data-a="relicsell" data-k="${k}">Vendre ${icon('coins')}${fmt(T.relicSell(T.RELICS.find(x => x.k === k)).coins)}</button>` : ''}</div>`; }).join('')}</div>
          ${ok && !cl ? `<button class="btn gold wide" data-a="relicclaim" data-k="${st.k}">Collection complète ! Récupérer</button>` : ok ? '<p class="meta ok">Collection exposée · +2 % de production</p>' : `<div class="costs rsrw">${rewardChips(T.relicSetReward(st))}<span class="meta">+2 % de production</span></div>`}</div>`; }).join('');
  }
  else if (panel === 'album'){
    const claim = T.albumClaimable(S);
    h = hd(`${T.albumTotal(S)} / ${T.TOY_KEYS.length * 3} étoiles · lettres +${Math.round((T.albumBonus(S) - 1) * 100)} %`, 'Album des jouets') + museumEntry() + `<div class="museumentry" role="button" data-a="lore"><span>📜</span><div><b>Légendes du Grand Nord</b><small>L'histoire, les ennemis, les cinématiques</small></div><span class="btn blue sm">Lire</span></div><p class="meta">Chaque jouet livré aux enfants remplit l'album. Chaque étoile augmente pour toujours ce que paient les lettres.</p>
      ${claim.length ? `<button class="btn gold wide" data-a="albumclaim">Récupérer ${claim.length} récompense${claim.length > 1 ? 's' : ''}</button>` : ''}
      <div class="album">${T.TOY_KEYS.map(k => { const n = S.cnt['deliver:' + k] || 0, st = T.albumStars(S, k), next = T.ALBUM_STEPS[st], lock = S.lvl < TOYS[k].lvl;
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
      h = hd(`Étage ${M.floor} · record ${M.best || M.floor}`, 'Grotte aux cristaux') + `<div class="minebar"><span class="picks"><i class="pk"></i><b>${M.picks} / ${max}</b></span><small>${next ? `+1 pioche dans <b data-until="${next}"></b>` : 'Pioches au maximum'}</small>${M.picks < max ? `<button class="btn gold sm" data-a="refill">Remplir <i class="i star"></i>${T.PICK_REFILL}</button>` : ''}</div>
        <div class="mgrid f${Math.min(5, Math.ceil(M.floor / 10))}">${M.cells.map((c, i) => c.open ? `<div class="mc open k-${c.k}">${cellIcon(c)}</div>` : `<button class="mc" data-a="dig" data-i="${i}" aria-label="Creuser"></button>`).join('')}</div>
        ${M.stairs ? `<button class="btn green wide" data-a="down">Descendre à l'étage ${M.floor + 1}</button>` : '<p class="meta">Chaque case coûte une pioche. Trouve l’<b>escalier</b> pour descendre : plus profond, plus de cristaux, de lingots et de colis rares.</p>'}
        <div class="acts"><button class="btn blue sm" data-a="bldinfo">Améliorer la grotte (niv. ${o.lv})</button></div>`;
    }
  }
  else if (panel === 'exp'){
    const o = panelArg, slots = T.expSlots(o.lv), run = S.exps || [];
    const runs = run.map((e, i) => { const d = T.EXP_DEST.find(d => d.k === e.k), st = T.speedStars(e.end - now());
      return `<div class="erun"><b>${d.name}</b><div class="work"><div class="bar"><i data-end="${e.end}" data-total="${e.end - e.start}"></i></div><span>Retour dans <b data-until="${e.end}"></b></span></div><button class="btn gold sm" data-a="expspeed" data-i="${i}">${st ? `<i class="i star"></i>${st}` : 'Rentrer'}</button></div>`; }).join('');
    const fed = T.deerFedNow(S, now()), hearts = T.deerHearts(S);
    h = hd(`Écurie niv. ${o.lv} · ${run.length} équipe${run.length > 1 ? 's' : ''} en route sur ${slots}`, 'Expéditions des rennes') + petEntry() + `<div class="deer"><img src="${ICON.mg_deer}" alt=""><div><b>Les rennes ${fed ? 'sont rassasiés' : 'ont faim'}</b><span class="hearts">${'❤'.repeat(hearts)}<em>${'❤'.repeat(10 - hearts)}</em></span><small>${fed ? `Expéditions ${Math.round((1 - T.deerSpeed(S, now())) * 100)} % plus rapides encore <b data-until="${S.deer.until}"></b>` : 'Nourris-les : expéditions plus rapides pendant 8 h, et un cœur d’affection en plus.'}</small></div>${fed ? '' : `<button class="btn green sm" data-a="deerfeed"><span class="costs">${costChips(T.deerCost(S))}</span>Nourrir</button>`}</div>` + (runs ? `<h3>En route</h3>${runs}` : '') + `<h3>Destinations</h3><div class="dests">${T.EXP_DEST.map(d => { const why = T.expBlock(S, d.k), lock = d.lv > o.lv;
      return `<div class="dest ${lock ? 'locked' : ''}"><div class="dt"><b>${d.name}</b><small>${fmtTime(d.time * T.deerSpeed(S, now()) / 1000)} · ${d.n} colis</small></div><div class="odds">${d.odds.map((p, r) => p ? `<i style="flex:${p};background:${T.RARITY[r].c}" title="${T.RARITY[r].name} ${p} %"></i>` : '').join('')}</div><div class="oddl">${d.odds.map((p, r) => p ? `<span style="color:${T.RARITY[r].c}">${T.RARITY[r].name} ${p} %</span>` : '').join('')}</div>
        ${lock ? `<span class="why">Écurie niv. ${d.lv}</span>` : `<div class="acts"><span class="costs">${costChips(T.expCost(S, d))}</span><button class="btn green sm" data-a="expgo" data-k="${d.k}" ${why && why !== 'Pas assez de biscuits pour les rennes' ? 'disabled' : ''}>Partir</button></div>`}</div>`; }).join('')}</div>
      <p class="meta">Les rennes rapportent des <b>colis mystère</b> : plus la destination est lointaine, plus les colis rares sont fréquents.</p>
      <div class="acts wrap2"><button class="btn blue sm" data-a="games">Mini-jeux</button><button class="btn blue sm" data-a="bldinfo">Fiche de l'écurie</button></div>`;
  }
  else if (panel === 'shop'){
    const tab = panelArg || 'offers', tabs = [['offers', 'Offres'], ['skins', 'Skins'], ['stars', 'Étoiles'], ['res', '<span class="tl">Ressources</span><span class="ts">Ress.</span>'], ['chests', 'Coffres']];
    h = hd(`Tu as ${fmt(S.stars)} étoiles d'or`, 'Boutique') + `<div class="tabs">${tabs.map(([k, l]) => `<button class="${k === tab ? 'on' : ''}" data-a="stab" data-k="${k}">${l}</button>`).join('')}</div>`;
    if (tab === 'offers'){
      const st = M.IAP.starter, deals = M.dailyDeals(S), P = M.pass(S);
      h += packCard(M.featuredPack().k, true) + `${S.iap?.starter ? '' : `<div class="offer big"><span class="ptag">${st.tag}</span><div><b>${st.name}</b><small>Une seule fois</small><span class="costs">${rewardChips(st.give)}</span></div><button class="btn green" data-a="iap" data-k="starter">${st.price}</button></div>`}
        ${P.premium ? '' : `<div class="offer gold"><div><b>Pass de Noël Or</b><small>Saison ${P.n} · ${M.SEASONS[(P.n - 1) % M.SEASONS.length]}</small><span class="meta">Double récompense à chaque palier : étoiles, lingots, colis légendaires.</span></div><button class="btn green" data-a="iap" data-k="pass">${M.IAP.pass.price}</button></div>`}
        <h3>Offres du jour <small class="meta">· nouvelles offres dans <b data-until="${new Date(new Date().setHours(24, 0, 0, 0)).getTime()}"></b></small></h3>
        <div class="deals">${deals.map(d => `<div class="deal ${d.done ? 'done' : ''}"><b>${d.name}</b><span class="costs">${rewardChips(d.give)}</span>${d.done ? '<span class="meta">Acheté ✓</span>' : `<button class="btn ${d.cost.stars ? 'gold' : 'blue'} sm" data-a="deal" data-k="${d.k}">${d.cost.stars ? `<i class="i star"></i>${d.cost.stars}` : `${icon('coins')}${fmt(d.cost.coins)}`}</button>`}</div>`).join('')}</div>
        <h3>Bâtisseurs</h3><div class="builders">${T.BUILDER_PRICE.map((p, i) => { const own = (S.extraBuilders || 0) > i, can = (S.extraBuilders || 0) === i;
          return `<div class="bcard ${own ? 'own' : ''}"><img src="${elfImg()}" alt=""><b>Bâtisseur ${i + 3}</b>${own ? '<span class="meta">Engagé</span>' : `<button class="btn ${can ? 'gold' : 'blue'} sm" data-a="builder" ${can ? '' : 'disabled'}><i class="i star"></i>${p}</button>`}</div>`; }).join('')}</div>`;
    }
    if (tab === 'skins') h += `<p class="help">Change le look de ton village. Les apparences des packs exclusifs ne s'obtiennent nulle part ailleurs.</p>
      ${[['house', 'Maison du Père Noël'], ['elves', 'Tenues des lutins'], ['pet', 'Flocon le renne']].map(([cat, t]) => `<h3>${t}</h3><div class="skingrid">${M.SKIN_LISTS[cat].map(d => skinCard(cat, d)).join('')}</div>`).join('')}
      <h3>Packs exclusifs</h3>${Object.keys(M.PACKS).map(k => packCard(k)).join('')}`;
    if (tab === 'stars') h += `<p class="help">Les étoiles d'or terminent un chantier tout de suite, engagent des bâtisseurs, achètent des ressources et des coffres.</p><div class="packs">${['p1', 'p2', 'p3', 'p4', 'p5'].map(k => { const p = M.IAP[k]; return `<button class="pack" data-a="iap" data-k="${k}">${p.tag ? `<span class="ptag">${p.tag}</span>` : ''}<i class="i star"></i><b>${fmt(p.give.stars)}</b><small>${p.name}</small><span class="btn green sm">${p.price}</span></button>`; }).join('')}</div>`;
    if (tab === 'res') h += `<p class="help">Il te manque quelque chose ? Achète-le en étoiles d'or. Plus le paquet est gros, moins c'est cher à l'unité.</p>${['wood', 'cookies', 'fabric', 'coins', 'ice', 'gold'].map(k => `<div class="rshop"><div class="rsh">${resImg(k)}<b>${RINFO[k].name}</b><small>${qty(k)}</small></div><div class="rpacks">${M.resPacks(S, k).map((p, i) => `<button class="rpack" data-a="rbuy" data-k="${k}" data-i="${i}" ${p.n ? '' : 'disabled'}><small>${p.name}</small><b>${p.n ? '+' + fmt(p.n) : 'Stock plein'}</b>${p.n ? `<span><i class="i star"></i>${p.stars}</span>` : ''}</button>`).join('')}</div></div>`).join('')}`;
    if (tab === 'chests') h += `<p class="help">Rareté garantie : tu sais exactement quel colis tu achètes. Son contenu est tiré à l'ouverture.</p><div class="chests">${M.CHESTS.map(c => `<div class="chest"><div class="pbig r${c.r}" style="--rc:${T.RARITY[c.r].c}"></div><b style="color:${T.RARITY[c.r].c}">Colis ${T.RARITY[c.r].name.toLowerCase()}</b><small>${['', 'Pièces, ressources, cristaux', 'Cristaux, lingots, parfois une étoile', 'Lingots, cristaux et étoiles'][c.r]}</small><button class="btn gold sm" data-a="chest" data-k="${c.r}"><i class="i star"></i>${c.stars}</button></div>`).join('')}</div>`;
    h += `<p class="meta">Version de test : les achats en euros sont simulés et gratuits. Dans la version App Store, le paiement passera par Apple.</p>`;
  }
  else if (panel === 'event'){
    const E = M.eventState(S), top = M.EV_STEPS[M.EV_STEPS.length - 1], next = M.EV_STEPS.find(p => p > E.pts);
    const left = E.end - now(), dd = Math.floor(left / 864e5), hh = Math.floor(left % 864e5 / 36e5);
    h = hd(`Événement de la semaine · fin dans ${dd ? `${dd} j ${hh} h` : fmtTime(left / 1000)}`, `${E.icon} ${E.name}`) + `<p class="help">${E.story}</p>
      <div class="evtop"><span class="evpts">❄ ${fmt(E.pts)}</span><div><div class="bar"><i style="width:${Math.min(100, E.pts / top * 100)}%"></i></div><small>${next ? `${fmt(next - E.pts)} flocons avant la prochaine récompense` : 'Toutes les récompenses sont débloquées !'}</small></div></div>
      <div class="mlist">${M.EV_STEPS.map((p, i) => { const ok = E.pts >= p, got = E.got[i];
        return `<div class="mis ${got ? 'done' : ''}"><div><b>Palier ${i + 1} · ❄ ${fmt(p)}</b><span class="costs">${rewardChips(M.eventReward(S, i))}</span></div>${got ? '<span class="ok">✓</span>' : ok ? `<button class="btn green sm" data-a="evclaim" data-i="${i}">Prendre</button>` : `<span class="pts">${Math.round(E.pts / p * 100)} %</span>`}</div>`; }).join('')}</div>
      <h3>Boutique de l'événement <small class="meta">· ❄ ${fmt(M.evSpendable(S))} à dépenser</small></h3>
      <div class="deals">${M.EV_SHOP.map(it => `<div class="deal"><b>${it.name}</b>${it.skin ? `<img class="evimg" src="${petImg(3, it.skin)}" alt="">${M.hasSkin(S, it.skin) ? '<small class="meta">déjà à toi</small>' : '<small class="meta">pelage pour Flocon</small>'}` : it.deco ? `<img class="evimg" src="${thumbs[it.deco]}" alt=""><small class="meta">à poser gratuitement</small>` : `<span class="costs">${rewardChips(it.give)}</span>`}<button class="btn blue sm" data-a="evbuy" data-k="${it.k}" ${M.evSpendable(S) >= it.price ? '' : 'disabled'}>❄ ${it.price}</button></div>`).join('')}</div>
      <p class="meta">Dépenser des flocons ne fait pas reculer les paliers.</p>
      <p class="meta">Les flocons tombent à chaque action : récolter, livrer une lettre (10), envoyer une expédition (8), un visiteur (12), une amélioration (6)… Un nouvel événement commence chaque lundi.</p>`;
  }
  else if (panel === 'todo'){
    const L = todoList();
    h = hd(L.length ? `${L.length} chose${L.length > 1 ? 's' : ''} à faire` : 'Tout est en ordre', 'Mon village') + (L.length ? `<div class="mlist">${L.map((x, i) => `<div class="mis todo"><img src="${x.icon}" alt=""><div><b>${x.text}</b></div><button class="btn green sm" data-a="todo" data-i="${i}">Y aller</button></div>`).join('')}</div>` : '<p class="help">Rien n’attend pour l’instant : tes lutins travaillent. Reviens dans un moment !</p>') + upcomingBox() + `<div class="mis remind"><div><b>Rappels sur ton téléphone</b><small>${S.notif ? 'Activés : je te préviens quand quelque chose est prêt.' : 'Sois prévenu quand un chantier finit ou qu’un atelier est plein.'}</small></div><button class="btn ${S.notif ? 'blue' : 'green'} sm" data-a="notif">${S.notif ? 'Couper' : 'Activer'}</button></div>` + '<p class="meta">Touche encore « Village » pour revenir à la Maison du Père Noël.</p>';
  }
  else if (panel === 'missions'){
    const tab = panelArg || 'day';
    h = hd(tab === 'day' ? 'Nouvelles missions chaque jour' : `${M.achClaimable(S)} récompense${M.achClaimable(S) > 1 ? 's' : ''} à prendre`, tab === 'day' ? 'Missions du jour' : 'Succès') + `<div class="tabs"><button class="${tab === 'day' ? 'on' : ''}" data-a="mtab" data-k="day">Missions du jour</button><button class="${tab === 'ach' ? 'on' : ''}" data-a="mtab" data-k="ach">Succès</button></div>`;
    if (tab === 'day'){
      const Ms = M.missions(S), top = M.MISSION_CHESTS[2];
      h += `<div class="mprog"><i style="width:${Math.min(100, Ms.pts / top * 100)}%"></i></div><div class="mchests">${M.MISSION_CHESTS.map((n, i) => `<button class="mch ${Ms.chests.includes(i) ? 'got' : Ms.pts >= n ? 'can' : ''}" data-a="mchest" data-i="${i}"><i class="pbox" style="--rc:${['#3b8cff', '#a347ff', '#ff8a1c'][i]}"></i><small>${Ms.chests.includes(i) ? 'Ouvert ✓' : `${n} points`}</small></button>`).join('')}</div>
        <p class="meta">${Ms.pts} points · chaque point fait aussi avancer le Pass de Noël.</p>
        <div class="mlist">${Ms.list.map((m, i) => `<div class="mis ${m.done ? 'done' : ''}"><div><b>${m.t}</b><div class="bar"><i style="width:${m.v / m.n * 100}%"></i></div><small>${fmt(m.v)} / ${fmt(m.n)}</small></div>${m.done ? '<span class="ok">✓</span>' : m.v >= m.n ? `<button class="btn green sm" data-a="mclaim" data-i="${i}">+${m.pts} pts</button>` : `<span class="pts">${m.pts} pts</span>`}</div>`).join('')}</div>`;
    } else {
      h += `<p class="help">Les succès sont la grande source d'étoiles d'or gratuites : chaque palier en donne.</p><div class="mlist">${M.ACH.map(a => { const st = M.achState(S, a), v = M.achValue(S, a);
        return `<div class="mis ${st.claimed >= 3 ? 'done' : ''}"><div><b>${a.name} <i class="kst">${'★'.repeat(st.claimed)}${'☆'.repeat(3 - st.claimed)}</i></b><small>${a.d} : ${fmt(v)} / ${fmt(st.next)}</small><div class="bar"><i style="width:${Math.min(100, v / st.next * 100)}%"></i></div></div>${st.claimed >= 3 ? '<span class="ok">✓</span>' : st.can ? `<button class="btn gold sm" data-a="aclaim" data-k="${a.k}"><i class="i star"></i>${M.achStars[st.claimed]}</button>` : `<span class="pts"><i class="i star"></i>${M.achStars[st.claimed]}</span>`}</div>`; }).join('')}</div>`;
    }
  }
  else if (panel === 'pass'){
    const P = M.pass(S), into = P.xp % M.PASS_STEP;
    h = hd(`Saison ${P.n} · encore ${Math.max(1, Math.ceil((P.end - now()) / 864e5))} jours`, `Pass de Noël · ${M.SEASONS[(P.n - 1) % M.SEASONS.length]}`) + `<div class="ptop"><span class="ptier">${P.tier}</span><div><div class="bar"><i style="width:${P.tier >= M.PASS_TIERS ? 100 : into}%"></i></div><small>${P.tier >= M.PASS_TIERS ? 'Pass terminé !' : `${into} / ${M.PASS_STEP} points vers le palier ${P.tier + 1}`}</small></div>${P.premium ? '<span class="gtag">Or ✓</span>' : `<button class="btn gold sm" data-a="iap" data-k="pass">Or · ${M.IAP.pass.price}</button>`}</div>
      <p class="meta">Les points viennent des missions du jour et des lettres livrées (5 par lettre).</p>
      <div class="ptrack"><div class="phead"><span>Palier</span><span>Gratuit</span><span>Or</span></div>${Array.from({length: M.PASS_TIERS}, (_, i) => i + 1).map(t => { const ok = t <= P.tier, f = P.free[t], g = P.gold[t];
        return `<div class="prow ${ok ? 'ok' : ''}"><span class="pn">${t}</span><button class="pr ${f ? 'got' : ok ? 'can' : ''}" data-a="pclaim" data-k="${t}" data-g="0">${rewardChips(M.passReward(S, t, false))}${f ? '<i class="ck"></i>' : ''}</button><button class="pr gold ${g ? 'got' : ok && P.premium ? 'can' : ''} ${P.premium ? '' : 'lock'}" data-a="pclaim" data-k="${t}" data-g="1">${rewardChips(M.passReward(S, t, true))}${g ? '<i class="ck"></i>' : ''}</button></div>`; }).join('')}</div>`;
  }
  else if (panel === 'market'){
    if (T.hqLv(S) < M.MARKET_HQ){ h = hd('', 'Marché du village') + `<p class="help">Le marché ouvre avec la <b>Maison du Père Noël niv. ${M.MARKET_HQ}</b>. Tu pourras y revendre ton surplus et acheter au marchand ambulant.</p>`; }
    else {
      const mer = M.merchant(S), toys = T.TOY_KEYS.filter(k => S.inv[k] > 0);
      const An = M.auction(S).lots.length;
      h = hd('Revends ton surplus, achète au marchand', 'Marché du village') + `<div class="aucentry"><img src="${thumbs.gifts}" alt=""><div><b>Salle des ventes</b><small>${An ? `${An} lot${An > 1 ? 's' : ''} perdu${An > 1 ? 's' : ''} à gagner contre des rivaux` : 'Nouveaux lots bientôt'}</small></div><button class="btn gold sm" data-a="auction">Enchérir</button></div><h3>Le marchand ambulant <small class="meta">· aujourd'hui il est <b>${mer.mood}</b></small></h3>
        <div class="deals">${mer.offers.map(o => `<div class="deal ${o.left <= 0 ? 'done' : ''}"><b>${Object.entries(o.give || {}).map(([k, n]) => { const nm = (RINFO[k]?.name || ITEMS[k]?.name || k).toLowerCase(); return `${fmt(n)} ${n > 1 ? nm : nm.replace(/^(\S+)s\b/, '$1')}`; }).join(', ')}</b><span class="costs">${rewardChips(o.give)}</span><small class="meta">encore ${Math.max(0, o.left)} aujourd'hui</small>${o.left > 0 ? `<button class="btn blue sm" data-a="mbuy" data-k="${o.k}">${icon('coins')}${fmt(o.cost.coins)}</button>` : '<span class="meta">Épuisé</span>'}</div>`).join('')}</div>
        <h3>Vendre des ressources</h3><div class="mlist">${Object.entries(M.SELL_RATE).map(([k, r0]) => { const r = Math.round(r0 * (1 + T.zoneB(S, 'sell')) * 100) / 100, n = Math.floor((S[k] || 0) * .25);
          return `<div class="mis"><div><b>${RINFO[k].name}</b><small>${fmt(S[k] || 0)} en stock · 1 ${RINFO[k].name.toLowerCase().replace(/s$/, '')} = ${String(r).replace('.', ',')} pièce${r > 1 ? 's' : ''}</small></div><button class="btn green sm" data-a="sell" data-k="${k}" ${n >= 10 ? '' : 'disabled'}>Vendre ${fmt(n)} → ${icon('coins')}${fmt(Math.floor(n * r))}</button></div>`; }).join('')}</div>
        <h3>Vendre des jouets</h3><div class="mlist">${toys.length ? toys.map(k => `<div class="mis"><div><b>${ITEMS[k].name}</b><small>${S.inv[k]} en stock · gardés pour les lettres ?</small></div><button class="btn green sm" data-a="selltoy" data-k="${k}">Vendre 1 → ${icon('coins')}${M.sellToy(k)}</button></div>`).join('') : '<p class="meta">Aucun jouet en stock.</p>'}</div>`;
    }
  }
  else if (panel === 'train'){
    const st = T.trainState(S), o = st?.o;
    if (!st) h = hd('', 'Gare du Pôle') + '<p class="help">Construis la Gare du Pôle pour recevoir le train.</p>';
    else if (st.away){ const tr = st.tr, sp = T.speedStars(tr.back - now());
      h = hd(`Gare niv. ${o.lv} · ${T.trainWagons(o.lv)} wagons`, 'Gare du Pôle') + `<div class="trainaway"><img src="${thumbs.station || ICON.mg_sleigh}" alt=""><b>Le train est en voyage</b><div class="work"><div class="bar"><i data-end="${tr.back}" data-total="${tr.back - (tr.start || tr.back - 3600e3)}"></i></div><span>Retour dans <b data-until="${tr.back}"></b></span></div>
        <button class="btn ${sp ? 'gold' : 'green'}" data-a="tspeed">${sp ? `Faire revenir <i class="i star"></i>${sp}` : 'Faire revenir gratuitement'}</button></div>`; }
    else { const W = st.tr.wag, n = W.filter(w => w.done).length;
      h = hd(`Gare niv. ${o.lv} · ${n} / ${W.length} wagons chargés`, 'Le train est à quai') + `<p class="help">Charge les wagons : chacun donne sa récompense tout de suite. Si le train part <b>plein</b>, bonus en plus !</p>
        <div class="wagons">${W.map((w, i) => { const [k, q] = Object.entries(w.want || {x: 0})[0], hv = haveOf(k);
          return `<div class="wagon ${w.done ? 'done' : ''}"><div class="wt">${resImg(k)}<b>${fmt(q)}</b><small>${w.done ? 'Chargé' : `${fmt(Math.min(hv, q))} / ${fmt(q)}`}</small></div><div class="costs">${rewardChips(w.rw)}</div>${w.done ? '<span class="ok">✓</span>' : `<button class="btn ${hv >= q ? 'green' : 'blue'} sm" data-a="tload" data-i="${i}">${hv >= q ? 'Charger' : 'Où trouver ?'}</button>`}</div>`; }).join('')}</div>
        <div class="tbonus"><span>Bonus train complet</span><span class="costs">${rewardChips(T.trainBonus(S))}</span></div>
        <button class="btn ${n === W.length ? 'green' : 'blue'} wide" data-a="tsend">${n === W.length ? 'Faire partir le train plein !' : `Faire partir le train (${n} / ${W.length})`}</button>`; }
    if (o) h += '<button class="btn blue wide" data-a="bldinfo" style="margin-top:8px">Améliorer la Gare</button>';
  }
  else if (panel === 'lab'){
    const o = panelArg && panelArg.type === 'library' ? panelArg : S.objs.find(x => x.type === 'library'), R = S.rsRun, cap = T.rsCap(S), Lb = T.libLv(S);
    const run = R ? T.RESEARCH.find(x => x.k === R.k) : null, st = R ? T.speedStars(R.end - now()) : 0;
    h = hd(`Bibliothèque niv. ${o?.lv || 0} · recherches jusqu'au niveau ${cap}`, 'Recherches') + `<p class="help">Une recherche à la fois. Chaque niveau donne un <b>bonus pour toujours</b> à tout le village.</p>`
      + (run ? `<h3>En cours</h3><div class="jobrun rsrun"><b>${run.name} · niveau ${R.lv}</b><div class="work"><div class="bar"><i data-end="${R.end}" data-total="${R.end - R.start}"></i></div><span>Encore <b data-until="${R.end}"></b></span></div><button class="btn ${st ? 'gold' : 'green'} sm" data-a="rsspeed">${st ? `Terminer <i class="i star"></i>${st}` : 'Terminer gratuitement'}</button></div>` : '')
      + `<h3>Domaines</h3><div class="rslist">${T.RESEARCH.map(r => { const lv = T.rsLv(S, r.k), n = lv + 1, lock = r.lib > Lb, why = T.rsBlock(S, r.k), c = T.rsCost(S, r.k, n), pc = x => Math.round(x * r.p * 100);
        return `<div class="rs ${lock ? 'locked' : ''} ${R && R.k === r.k ? 'on' : ''}"><div class="rsi">${r.icon in ICON ? `<img src="${ICON[r.icon]}" alt="">` : thumbs[r.icon] ? `<img src="${thumbs[r.icon]}" alt="">` : `<img src="${buildIcon}" alt="">`}<em>${lv}</em></div>
          <div class="rsb"><b>${r.name}</b><small>${lv ? `Actuel : ${r.txt(pc(lv))}` : 'Pas encore cherché'}</small>${lv < T.RS_MAX && !lock ? `<small class="nx">Niveau ${n} : ${r.txt(pc(n))}</small>` : ''}
          ${lock ? `<span class="why">Bibliothèque niv. ${r.lib}</span>` : lv >= T.RS_MAX ? '<span class="meta">Niveau maximum</span>' : `<span class="costs">${costChips(c)}<span class="chip time">${fmtTime(T.rsTime(r.k, n))}</span></span>`}</div>
          ${lock || lv >= T.RS_MAX ? '' : `<button class="btn green sm" data-a="rsgo" data-k="${r.k}" ${why ? 'disabled' : ''}>${n > cap ? `Biblio. ${Math.ceil(n / 2)}` : 'Chercher'}</button>`}</div>`; }).join('')}</div>`
      + (o ? '<button class="btn blue wide" data-a="bldinfo">Améliorer la Bibliothèque</button>' : '');
  }
  else if (panel === 'auction'){
    const A = M.auction(S);
    h = hd(`${A.lots.length} lot${A.lots.length > 1 ? 's' : ''} à vendre`, 'Salle des ventes') + `<p class="help">Des rivaux veulent les mêmes lots. Tu ne vois qu'une partie du contenu : l'estimation peut mentir ! Paie l'entrée, surenchéris, puis découvre ce que tu as gagné.</p>
      <div class="lots">${A.lots.map((l, i) => lotCard(l, i)).join('') || '<p class="meta">Tous les lots sont partis.</p>'}</div>${A.next ? `<p class="meta">Nouveau lot dans <b data-until="${A.next}"></b></p>` : ''}
      <button class="btn gold wide" data-a="aucrefill">Faire venir 3 nouveaux lots <i class="i star"></i>${M.AUC_REFILL}</button>`;
  }
  else if (panel === 'profile'){
    const st = [['Lettres livrées', S.cnt.orders || 0], ['Jouets fabriqués', S.cnt.make || 0], ['Améliorations', S.cnt.upgrade || 0], ['Colis ouverts', S.cnt.parcel || 0], ['Record de la grotte', 'étage ' + (S.mine?.best || 0)], ['Illuminations', 'niv. ' + T.lightsLv(S)], ['Camps de trolls vaincus', (S.camps?.at || 0)], ['Flocon, le renne magique', S.pet ? 'niv. ' + S.pet.lv : '—'], ['Espèces pêchées', Object.keys(S.fish || {}).length + ' / ' + T.FISH.length], ['Trouvailles du musée', T.RELICS.filter(x => (S.relics || {})[x.k]).length + ' / ' + T.RELICS.length], ['Succès', M.ACH.reduce((a, x) => a + (S.ach?.[x.k] || 0), 0) + ' / ' + M.ACH.length * 3 + ' ★']];
    h = hd(M.titleOf(S.lvl), S.name || 'Mon village') + `<div class="prof"><img src="${portrait}" alt=""><div><b>Niveau ${S.lvl}</b><small>Maison du Père Noël niv. ${T.hqLv(S)}</small><button class="btn blue sm" data-a="rename">Renommer le village</button></div></div>
      <div class="mlist">${st.map(([l, v]) => `<div class="mis"><b>${l}</b><span class="pts">${typeof v === 'number' ? fmt(v) : v}</span></div>`).join('')}</div>
      <h3>Réglages</h3><div class="mlist"><div class="mis"><b>Sons</b><button class="btn ${S.mute ? 'blue' : 'green'} sm" data-a="mute">${S.mute ? 'Coupés' : 'Activés'}</button></div>
      <div class="mis"><b>Musique</b><button class="btn ${S.noMusic || S.mute ? 'blue' : 'green'} sm" data-a="music">${S.noMusic || S.mute ? 'Coupée' : 'Activée'}</button></div>
      <div class="mis"><div><b>Taille de l'interface</b><small>Boutons et textes plus petits ou plus grands</small></div><span class="segs">${[[.88, 'Petite'], [1, 'Normale'], [1.14, 'Grande']].map(([v, l]) => `<button class="btn ${uiSize === v ? 'green' : 'blue'} sm" data-a="uisize" data-k="${v}">${l}</button>`).join('')}</span></div>
      <div class="mis"><b>Rappels</b><button class="btn ${S.notif ? 'green' : 'blue'} sm" data-a="notif">${S.notif ? 'Activés' : 'Coupés'}</button></div>
      <div class="mis"><div><b>Mon compte</b><small>${ACC.current() ? 'Connecté : ' + (ACC.current().email || '') : 'Google ou e-mail : ton village en sécurité'}</small></div><button class="btn green sm" data-a="account">${ACC.current() ? 'Gérer' : 'Se connecter'}</button></div>
      <div class="mis"><div><b>Sauvegarde</b><small>Pour retrouver ton village sur un autre téléphone</small></div><button class="btn blue sm" data-a="savepanel">Ouvrir</button></div>
      ${(() => { let e = null; try { e = localStorage.getItem('vdp-lasterr'); } catch(_){} return e ? `<div class="mis"><div><b>Dernier souci d'affichage</b><small style="word-break:break-all">${e.slice(0, 160).replace(/</g, '&lt;')}</small></div></div>` : ''; })()}
      <div class="mis"><b>Version du jeu</b><span class="meta">${GAME_V}</span></div>
      <div class="mis"><div><b>Diagnostic d'affichage</b><small>Si l'écran est flou : touche, puis envoie une capture</small></div><button class="btn blue sm" data-a="diag">Voir</button></div>
      <div class="mis"><b>Revoir le tutoriel</b><button class="btn blue sm" data-a="retuto">Relancer</button></div>
      <div class="mis"><b>Recommencer à zéro</b><button class="btn red sm" data-a="reset">Effacer</button></div></div>`;
  }
  else if (panel === 'lights'){
    const n = T.lightsLv(S), c = T.lightsCost(n), why = T.lightsBlock(S);
    h = hd(`Niveau ${n} · production +${n} %`, 'Illuminations du village') + `<div class="garland">${Array.from({length: 14}, (_, i) => `<i class="${i < Math.min(14, n) ? 'on' : ''}"></i>`).join('')}</div>
      <p class="meta">Ni bâtisseur ni attente : chaque niveau allume de nouvelles guirlandes et donne <b>+1 % de production</b> à tout le village, pour toujours. Le prix monte à chaque niveau.</p>
      <h3>Niveau ${n} → ${n + 1}</h3><div class="costs">${costChips(c)}</div>
      <div class="acts"><button class="btn green" data-a="lights" ${why && why !== 'Ressources insuffisantes' ? 'disabled' : ''}>Allumer</button></div>${why ? `<p class="note">${why}</p>` : ''}`;
  }
  else if (panel === 'stock'){
    h = hd('Ressources, jouets et outils', 'Stock') + `<p class="help">Touche une ligne pour tout savoir sur une ressource. Il te manque quelque chose ? <button class="lnk" data-a="goshop">Boutique ›</button></p>
      <h3>D'où viennent tes ressources ?</h3><div class="rguide">${GUIDE.map(([k, src, use]) => `<div class="rg" data-a="rinfo" data-k="${k}">${resImg(k)}<div><b>${RINFO[k].name} <em>${qty(k)}</em></b><small><span class="from">${src.map(t => thumbs[t] ? `<img src="${thumbs[t]}" alt="">${BUILDINGS[t].name}` : t).join(' · ')}</span></small><small class="use">→ ${use}</small></div></div>`).join('')}</div><h3>Ressources</h3><div class="stock">${T.RES.map(r => `<div class="st" data-a="rinfo" data-k="${r}"><img src="${ICON[r]}" alt=""><b>${fmt(S[r])}</b><small>${r === 'coins' ? ITEMS[r].name : `${ITEMS[r].name} · max ${fmt(T.cap(S, r))}`}</small></div>`).join('')}</div>
      <h3>Jouets</h3><div class="stock">${Object.keys(TOYS).filter(k => S.inv[k] > 0).map(k => `<div class="st"><img src="${ICON[k]}" alt=""><b>${S.inv[k]}</b><small>${ITEMS[k].name}</small></div>`).join('') || '<p class="meta">Aucun jouet : fabrique-les à l’Atelier des jouets.</p>'}</div>
      <h3>Matériaux rares</h3><div class="stock">${T.RARE.map(k => `<div class="st" data-a="rinfo" data-k="${k}"><img src="${ICON[k]}" alt=""><b>${fmt(S.inv[k] || 0)}</b><small>${ITEMS[k].name}</small></div>`).join('')}</div>
      <h3>Outils</h3><div class="stock">${['axe', 'saw'].map(k => `<div class="st"><img src="${ICON[k]}" alt=""><b>${S.inv[k] || 0}</b><small>${ITEMS[k].name}</small></div>`).join('')}</div>
      <p class="meta">Le stock maximum dépend de la Maison du Père Noël et des Entrepôts. Haches et scies : lettres, cadeau du jour, mini-jeux. Cristaux et lingots : Grotte aux cristaux et colis des rennes.</p>`;
  }
  else if (panel === 'build'){
    const cat = panelArg || 'prod';
    const list = Object.entries(BUILDINGS).filter(([k, b]) => T.catOf(b) === cat && !b.max);
    h = hd(`Bâtisseurs ${T.builders(S) - T.busyBuilders(S)} / ${T.builders(S)} libres`, 'Construire') + `<div class="tabs">${T.CATS.map(([k, l]) => `<button class="${k === cat ? 'on' : ''}" data-a="cat" data-k="${k}">${l}</button>`).join('')}</div>
      <div class="grid">${list.map(([k, b]) => { const why = T.buildBlock(S, k), hard = why && why !== 'Ressources insuffisantes', c = T.upCost(k, 1), n = T.countOf(S, k), m = T.maxOf(S, k);
        const role = b.kind === 'prod' ? `+${fmtR(T.rate(k, 1))} ${ITEMS[b.res].name.toLowerCase()}/h` : b.kind === 'house' ? `+${T.housing(1)} lutins` : b.kind === 'storage' ? `+${fmt(T.storageAdd(1))} de stock` : b.kind === 'deco' ? `+${b.joy} bonheur` : b.desc.split('.')[0];
        const want = !hard && (T.questProgress(S).q.k === 'have:' + k) && !T.questProgress(S).done;
        return `<button class="card ${hard ? 'locked' : ''} ${want ? 'qwant' : ''}" data-a="place" data-k="${k}">${want ? '<span class="wanted">Tâche</span>' : ''}<img src="${thumbs[k]}" alt=""><b>${b.name}</b><span class="meta">${role}</span>${m < 99 ? `<span class="meta">${n} / ${m}</span>` : ''}${hard ? `<span class="why">${why}</span>` : S.tokens?.[k] > 0 ? `<span class="costs"><span class="chip free">Gratuit ×${S.tokens[k]}</span>` : `<span class="costs">${costChips(c)}${T.upTime(k, 1) ? `<span class="chip time">${fmtTime(T.upTime(k, 1))}</span>` : ''}</span>`}</button>`; }).join('')}</div>`;
  }
  else if (panel === 'expand'){
    const {cx, cy} = panelArg, n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n);
    const z = T.zoneOf(cx, cy), lock = T.zoneLock(S, cx, cy);
    h = hd('Nouvelle zone à explorer', T.zoneName(cx, cy)) + (z ? `<div class="zonecard" style="--zt:${z.tint}"><p>${z.txt}</p><div class="zb"><span>Bonus de la zone</span><b>${T.zoneBonusText(z.b)}</b></div><div class="zb"><span>Cadeau d'arrivée</span><span class="costs">${rewardChips(z.gift)}</span></div></div>` : '') + `<p class="meta">Dégage la forêt pour agrandir ton village de 121 cases.</p><div class="lines">${need(c)}</div>
      ${lock ? `<button class="btn wide" disabled>Niveau ${lock} requis</button>` : `<button class="btn green wide" data-a="expand" ${T.has(S, c) ? '' : 'disabled'}>Agrandir</button>`}${toolBox(c, n)}`;
  }
  else if (panel === 'site'){
    const o = panelArg, end = workEnd(o), total = o.build ? o.btotal : o.utotal, left = Math.max(0, end - now()), st = speedCost(o);
    h = hd(o.build ? 'Construction' : `Amélioration vers le niveau ${o.upTo}`, B(o).name) + `<div class="work"><div class="bar"><i data-end="${end}" data-total="${total || 1}"></i></div><span>Encore <b data-until="${end}"></b></span></div>
      <div class="acts">${st ? `<button class="btn gold" data-a="speed">Terminer <i class="i star"></i>${st}</button>` : '<button class="btn green" data-a="speed">Terminer gratuitement</button>'}</div>
      <p class="meta">Moins de 3 minutes restantes : c'est gratuit.</p>`;
  }
  else if (panel === 'bld'){
    // fiche d'un bâtiment, comme Dragons of Atlantis : ce qu'il fait, ce que change le prochain niveau, le coût
    const o = panelArg, b = B(o), max = b.kind === 'hq' ? b.max : T.maxLv(S), next = o.lv + 1, c = T.upCost(o.type, next), why = T.upBlock(S, o);
    const t0 = tierOf(o.lv), t1 = tierOf(next), hs = o.type === 'santa' && M.skinState(S).house !== 'classic' ? '@' + M.skinState(S).house : '', th = k => thumbs[k + hs] || thumbs[k], img0 = th(t0 > 1 ? o.type + ':' + t0 : o.type), img1 = th(t1 > 1 ? o.type + ':' + t1 : o.type);
    const rows = T.stats(S, o).map(r => `<div class="srow"><span>${r.label}</span><b>${r.now}</b>${o.lv < max ? `<i class="arrow"></i><em>${r.next}</em>` : ''}</div>`).join('');
    let extra = '';
    if (b.kind === 'prod'){ const n = T.stored(S, o), buf = T.buffer(o.type, o.lv); extra = `<div class="work"><div class="bar"><i style="width:${n / buf * 100}%"></i></div><span>${fmt(n)} / ${fmt(buf)} ${ITEMS[b.res].name.toLowerCase()} dans le bâtiment${T.workRatio(S) < 1 ? ' · <b class="bad">pas assez de lutins !</b>' : ''}</span></div>${ripe(o) ? '<button class="btn gold wide" data-a="collect">Récolter</button>' : ''}`; }
    if (T.JOBS[o.type]) extra += jobsBox(o);
    if (o.type === 'sawmill') extra += toolsBox(o);
    if (b.kind === 'fun') extra += showsBox(o);
    if (b.kind === 'storage'){ const ready = T.bulkReady(o, now());
      extra += `<h3>Grande commande du Nord <small class="meta">· une toutes les 6 h</small></h3>` + (ready ? `<div class="jobs">${T.bulkOffers(S, o).map(of => { const ok = T.has(S, of.want);
        return `<div class="job"><div class="jt"><b>${RINFO[of.k].name} pour le Grand Nord</b></div><div class="jr"><span class="costs">${rewardChips(of.give)}</span></div><button class="btn ${ok ? 'green' : 'blue'} sm" data-a="bulk" data-k="${of.k}"><span class="costs">${costChips(of.want)}</span>Livrer</button></div>`; }).join('')}</div>` : `<p class="meta">Gros Ours prépare la prochaine commande : <b data-until="${o.bulkAt}"></b></p>`); }
    if (b.kind === 'house'){ const busy = S.objs.filter(x => (x.build && x.build > now()) || (x.up && x.up > now())).length, ready = T.helpReady(o, now());
      extra += `<h3>Coup de main des lutins</h3><div class="job"><div class="jt"><b>Accélérer tous les chantiers</b><span class="boostp">-${Math.round((T.HELP_CUT + .02 * (o.lv - 1)) * 100)} %</span></div><div class="jr"><small class="meta">${busy ? `${busy} chantier${busy > 1 ? 's' : ''} en cours` : 'Aucun chantier en cours'} · une fois toutes les 2 h par chalet</small></div>${ready ? `<button class="btn ${busy ? 'green' : 'blue'} sm" data-a="help" ${busy ? '' : 'disabled'}><span class="costs">${costChips(T.helpCost(o))}</span>Aider</button>` : `<span class="meta">Repos : <b data-until="${o.helpAt}"></b></span>`}</div>`; }
    if (b.kind === 'stable') extra = `${petEntry()}<div class="acts"><button class="btn green" data-a="goexp">Expéditions</button><button class="btn blue" data-a="games">Mini-jeux</button></div>`;
    if (b.kind === 'craft') extra = '<button class="btn green wide" data-a="gocraft">Fabriquer des jouets</button>';
    if (b.kind === 'orders') extra = '<button class="btn green wide" data-a="goorders">Voir les lettres à livrer</button>';
    if (b.kind === 'mine') extra = '<button class="btn green wide" data-a="gomine">Creuser</button>';
    if (b.kind === 'train') extra = '<button class="btn green wide" data-a="gotrain">Voir le train</button>';
    if (b.kind === 'lab') extra = '<button class="btn green wide" data-a="golab">Recherches</button>';
    if (b.kind === 'hq'){ const nu = T.unlocksAtHq(next); extra = (nu.length ? `<p class="meta">Au niveau ${next} : ${nu.join(', ')}</p>` : '') + `<button class="btn blue wide" data-a="shopskins">🎨 Changer l'apparence de la Maison</button>` + `<button class="btn gold wide" data-a="golights">Illuminations du village · niv. ${T.lightsLv(S)}</button>` + (T.sackReady(S) ? '<button class="btn green wide sackbtn" data-a="sack">🎅 La hotte du Père Noël est pleine !</button>' : `<p class="meta">Prochaine hotte du Père Noël dans <b data-until="${S.sackAt}"></b></p>`); }
    const K = KEEPER[o.type] || KEEPER.cabin, said = keeperLine(o);
    h = hd(`Niveau ${o.lv}${b.kind === 'hq' ? '' : ` / ${max}`}`, b.name) + `<div class="scene sc-${b.kind}"><img class="bimg" src="${img0}" alt=""><img class="keeper" src="${K.img()}" alt="">${o.lv < max && t1 !== t0 ? `<div class="nextlook"><img src="${img1}" alt=""><small>Au niv. ${next}</small></div>` : ''}</div><div class="say2"><b>${K.name}</b><span>${said}</span></div>
      ${extra}${b.kind === 'prod' ? keeperBox(o) : ''}<h3>${o.lv < max ? `Niveau ${o.lv} → ${next}` : 'Niveau actuel'}</h3><div class="stats">${rows}</div>
      ${o.lv < (b.kind === 'hq' ? b.max : 99) ? `${why ? `<p class="note">${whyHelp(o, why)}</p>` : ''}<div class="acts sticky foot"><div class="fcost"><small>Coût</small><span class="costs">${costChips(c)}<span class="chip time">${fmtTime(T.upTime(o.type, next))}</span></span></div><div class="fbtns"><button class="btn green" data-a="upgrade" ${why && why !== 'Ressources insuffisantes' ? 'disabled' : ''}>Améliorer</button><button class="btn blue sm" data-a="move">Déplacer</button></div></div>` : ''}`;
  }
  else if (panel === 'info'){
    const o = panelArg, b = B(o);
    h = hd(b.kind === 'deco' && !o.wild ? `+${b.joy} bonheur` : '', o.wild ? 'Sapin enneigé' : b.name) + `<p>${o.wild ? 'Un sapin de la forêt. Coupe-le pour faire de la place.' : b.kind === 'path' ? 'Une allée du village. Retire-la pour libérer la place.' : b.desc.startsWith('+') ? 'Une décoration rend les lutins plus heureux. Tu peux la déplacer ou la retirer pour faire de la place (un bâtiment posé dessus la range tout seul).' : b.desc}</p><div class="acts">${o.wild ? '' : '<button class="btn blue" data-a="move">Déplacer</button>'}<button class="btn red" data-a="sellobj">${o.wild ? 'Couper' : refund(o) ? `Vendre +${refund(o)} 🪙` : 'Retirer'}</button></div>`;
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
  // dépense d'étoiles d'or à partir de 20 : on demande d'abord (les achats par erreur sont la plainte n°1 des jeux étudiés)
  if (b.querySelector('.i.star') && !b.dataset.ok && !b.disabled){ const n = parseInt((b.textContent.match(/\d[\d\s]*/) || ['0'])[0].replace(/\s/g, ''), 10);
    if (n >= 20 && S.stars >= n){ e.stopImmediatePropagation(); return confirmStars(n, b); } }
  delete b.dataset.ok;
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
  if (a === 'autoq') return autoQueue(panelArg);
  if (a === 'deerfeed'){ const why = T.deerFeed(S, now()); if (why){ sfx.err(); return why === 'Ressources insuffisantes' ? showMissing(T.deerCost(S), 'Nourrir les rennes', null) : toast(why); } T.track(S, 'deer'); sfx.level(); toast(`Miam ! Les rennes t’adorent (${T.deerHearts(S)} ❤)`); save(); panelHtml = ''; return renderPanel(); }
  if (a === 'todo'){ const x = todoList()[+b.dataset.i]; if (x) todoGo(x.go); return; }
  if (a === 'bulk'){ const o = panelArg, r = T.bulkDo(S, o, b.dataset.k, now()); if (typeof r === 'string'){ sfx.err(); return r === 'Ressources insuffisantes' ? showMissing(T.bulkOffers(S, o).find(x => x.k === b.dataset.k).want, 'Grande commande du Nord', null) : toast(r); } T.track(S, 'bulk'); closePanel(); return bravo(r, 'Grande commande du Nord'); }
  if (a === 'help'){ const o = panelArg, why = T.helpGive(S, o, now()); if (why){ sfx.err(); return why === 'Ressources insuffisantes' ? showMissing(T.helpCost(o), 'Coup de main des lutins', null) : toast(why); } T.track(S, 'help'); sfx.build(); toast('Les lutins accourent : chantiers accélérés !'); for (const x of S.objs) if ((x.build || x.up) > now()) bounceAt.set(x, performance.now()); save(); panelHtml = ''; return renderPanel(); }
  if (a === 'sack'){ closePanel(); return openSack(); }
  if (a === 'evbuy'){ const r = M.evBuy(S, b.dataset.k); if (typeof r === 'string'){ sfx.err(); return toast(r); } if (r.skin){ save(); sfx.level(); toast(r.cat === 'elves' ? 'Nouvelle tenue pour les lutins !' : 'Nouveau skin pour Flocon !'); return r.cat === 'elves' ? openPanel('shop', 'skins') : openPanel('pet'); } save(); if (r.deco){ sfx.level(); toast(`${BUILDINGS[r.deco].name} : à poser gratuitement`); return startPlace(r.deco); } closePanel(); return bravo(r.give, 'Boutique de l’événement'); }
  if (a === 'showgo'){ const o = panelArg, sh = T.SHOWS.find(x => x.k === b.dataset.k), why = T.showStart(S, sh.k, now()); if (why){ sfx.err(); return why === 'Ressources insuffisantes' ? showMissing(T.showCost(sh, o.lv), sh.name, null) : toast(why); } T.track(S, 'show'); sfx.level(); toast(`Lever de rideau ! Production +${Math.round(S.show.pct * 100)} %`); save(); panelHtml = ''; return renderPanel(); }
  if (a === 'evclaim'){ const i = +b.dataset.i, E = M.eventState(S); if (E.pts < M.EV_STEPS[i] || E.got[i]) return; S.ev.got[i] = 1; closePanel(); return bravo(M.eventReward(S, i), `${E.name} · palier ${i + 1}`); }
  if (a === 'wrap'){ S.wrapOn = !S.wrapOn; if (S.wrapOn && !(S.inv.paper > 0)) toast('Fabrique du papier cadeau à l’Atelier des jouets'); sfx.tap(); save(); return renderPanel(); }
  if (a === 'jobgo'){ const o = panelArg, j = T.JOBS[o.type].find(x => x.k === b.dataset.k), why = T.jobStart(S, o, b.dataset.k, now()); if (why){ sfx.err(); return why === 'Ressources insuffisantes' ? showMissing(T.jobPlan(S, o, j).cost, j.name, null) : toast(why); } sfx.build(); T.track(S, 'job'); toast(`Les lutins s'y mettent : ${j.name}`); save(); panelHtml = ''; return renderPanel(); }
  if (a === 'jobget'){ const o = panelArg, r = T.jobCollect(S, o, now()); if (r){ T.track(S, 'jobdone'); gainXp(4 + o.lv, null); closePanel(); bravo(r, T.JOBS[o.type].length ? 'Commande spéciale terminée' : ''); } return; }
  if (a === 'jobspeed'){ const o = panelArg, st = T.speedStars(o.job.end - now()); if (S.stars < st){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop', 'stars'); } S.stars -= st; o.job.end = now(); save(); panelHtml = ''; return renderPanel(); }
  if (a === 'stab'){ panelArg = b.dataset.k; sfx.tap(); return renderPanel(); }
  if (a === 'mtab'){ panelArg = b.dataset.k; sfx.tap(); return renderPanel(); }
  if (a === 'iap') return buyIap(b.dataset.k);
  if (a === 'deal'){ const d = M.dailyDeals(S).find(x => x.k === b.dataset.k); if (!d || d.done) return; if (!T.has(S, d.cost)){ sfx.err(); return d.cost.stars ? (toast("Pas assez d'étoiles d'or"), openPanel('shop', 'stars')) : toast('Pas assez de pièces'); } T.take(S, d.cost); S.deals.bought[d.k] = 1; save(); return bravo(d.give, d.name); }
  if (a === 'rbuy'){ const k = b.dataset.k, p = M.resPacks(S, k)[+b.dataset.i]; if (!p?.n) return; if (S.stars < p.stars){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop', 'stars'); } S.stars -= p.stars; giveReward({[k]: p.n}, b); return renderPanel(); }
  if (a === 'chest'){ const c = M.CHESTS.find(x => x.r === +b.dataset.k); if (S.stars < c.stars){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop', 'stars'); } S.stars -= c.stars; (S.parcels ||= []).unshift(c.r); save(); closePanel(); return openParcel(); }
  if (a === 'mclaim'){ const n = M.missionClaim(S, +b.dataset.i); if (n){ sfx.level(); toast(`+${n} points de mission et de Pass !`); save(); } return renderPanel(); }
  if (a === 'mchest'){ const i = +b.dataset.i, Ms = M.missions(S); if (Ms.chests.includes(i) || Ms.pts < M.MISSION_CHESTS[i]){ sfx.err(); return toast(Ms.chests.includes(i) ? 'Déjà ouvert' : `Il faut ${M.MISSION_CHESTS[i]} points`); } Ms.chests.push(i); closePanel(); return bravo(M.missionChest(S, i), 'Coffre des missions'); }
  if (a === 'aclaim'){ const r = M.achClaim(S, M.ACH.find(x => x.k === b.dataset.k)); if (r){ closePanel(); return bravo(r, 'Succès débloqué'); } return; }
  if (a === 'pclaim'){ const t = +b.dataset.k, g = b.dataset.g === '1', P = M.pass(S); if (g && !P.premium){ sfx.err(); return buyIap('pass'); } const r = M.passClaim(S, t, g); if (!r){ sfx.err(); return toast(t > P.tier ? `Palier ${t} pas encore atteint` : 'Déjà récupéré'); } closePanel(); return bravo(r, `Pass de Noël · palier ${t}`); }
  if (a === 'mbuy'){ const o = M.merchant(S).offers.find(x => x.k === b.dataset.k); if (!o || o.left <= 0) return; if (!T.has(S, o.cost)){ sfx.err(); return showMissing(o.cost, 'Marchand ambulant', null); } T.take(S, o.cost); S.merchant.bought[o.k] = (S.merchant.bought[o.k] || 0) + 1; giveReward(o.give, b); return renderPanel(); }
  if (a === 'sell'){ const k = b.dataset.k, n = Math.floor((S[k] || 0) * .25), c = Math.floor(n * M.SELL_RATE[k] * (1 + T.zoneB(S, 'sell'))); if (n < 10) return; S[k] -= n; S.coins += c; fly('coins', c, b); T.track(S, 'sell'); sfx.collect(); save(); return renderPanel(); }
  if (a === 'selltoy'){ const k = b.dataset.k; if (!(S.inv[k] > 0)) return; S.inv[k]--; const c = M.sellToy(k); S.coins += c; fly('coins', c, b); T.track(S, 'sell'); sfx.collect(); save(); return renderPanel(); }
  if (a === 'rename'){ const n = prompt('Nom de ton village :', S.name || ''); if (n != null){ S.name = n.trim().slice(0, 24); save(); } return renderPanel(); }
  if (a === 'notif') return toggleNotif();
  if (a === 'diag'){ closePanel(); return setTimeout(showDiag, 300); }
  if (a === 'auction') return openPanel('auction');
  if (a === 'aucgo') return aucOpen(+b.dataset.i);
  if (a === 'aucpeek'){ const l = M.auction(S).lots[+b.dataset.i]; if (S.stars < M.AUC_PEEK){ sfx.err(); return openPanel('shop'); } if (l && M.aucPeek(S, l)){ sfx.tap(); save(); } return renderPanel(); }
  if (a === 'aucrefill'){ if (!M.aucRefill(S)){ sfx.err(); return openPanel('shop'); } sfx.level(); save(); return renderPanel(); }
  if (a === 'mute'){ S.mute = !S.mute; if (S.mute) musicStop(); else music(); save(); return renderPanel(); }
  if (a === 'music'){ S.noMusic = !(S.noMusic || S.mute); if (S.mute && !S.noMusic) S.mute = false; if (S.noMusic) musicStop(); else music(); save(); return renderPanel(); }
  if (a === 'retuto'){ S.tuto = 0; save(); closePanel(); return tuto.start(); }
  if (a === 'reset'){ if (confirm('Effacer ton village et tout recommencer ?')){ saveLock = true; T.clearTown(); location.reload(); } return; }
  if (a === 'rinfo') return resInfo(b.dataset.k);
  if (a === 'goshop') return openPanel('shop', 'res');
  if (a === 'gocraft'){ const w = workshopOf(); return w ? goTo('workshop') : null; }
  if (a === 'gomine') return openPanel('mine', panelArg);
  if (a === 'buytools'){ const n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n), miss = toolMissing(c), cnt = miss.reduce((x, [, m]) => x + m, 0), pay = b.dataset.p === 'stars' ? {stars: cnt * 5} : {coins: cnt * toolCoins(n)};
    if (!T.has(S, pay)){ sfx.err(); return showMissing(pay, 'Haches et scies', null); } T.take(S, pay); for (const [k, m] of miss) T.give(S, k, m); sfx.collect(); toast('Outils achetés : tu peux agrandir !'); save(); return renderPanel(); }
  if (a === 'gocraft') return openPanel('craft', panelArg);
  if (a === 'goorders') return openPanel('orders');
  if (a === 'golab') return openPanel('lab', panelArg);
  if (a === 'gotrain') return openPanel('train', panelArg);
  if (a === 'camp') return openPanel('camp');
  if (a === 'lore') return openPanel('lore');
  if (a === 'replay'){ closePanel(); return setTimeout(() => chapterCine(+b.dataset.i), 250); }
  if (a === 'pet') return openPanel('pet');
  if (a === 'skinwear'){ M.skinState(S)[b.dataset.c || 'pet'] = b.dataset.k; sfx.pop(); save(); toast('Nouvelle apparence !'); return renderPanel(); }
  if (a === 'pack') return buyPack(b.dataset.k);
  if (a === 'mktool'){ const o = panelArg, k = b.dataset.k, c = toolCost(o, k); if (now() - (o.toolT || 0) < TOOL_CD) return; if (!T.has(S, c)){ sfx.err(); return showMissing(c, ITEMS[k].name, null); } T.take(S, c); T.give(S, k, 1); o.toolT = now(); sfx.collect(); fly(k, 1, b); toast(`${ITEMS[k].name} fabriquée !`); save(); return renderPanel(); }
  if (a === 'findtoy'){ const w = workshopOf(); if (!w){ sfx.err(); return toast("Construis d'abord l'Atelier des jouets"); } fromOrder = true; wantToy = b.dataset.k; return openPanel('craft', w); }
  if (a === 'backorder'){ fromOrder = false; wantToy = ''; return openPanel('orders'); }
  if (a === 'uisize'){ uiSize = +b.dataset.k; try { localStorage.setItem('vdp-uisize', uiSize); } catch(e){} applyWide(); sfx.pop(); return renderPanel(); }
  if (a === 'shopskins') return openPanel('shop', 'skins');
  if (a === 'skinbuy'){ const r = M.buySkin(S, b.dataset.k, b.dataset.c || 'pet'); if (typeof r === 'string'){ sfx.err(); return toast(r); } if (r){ sfx.err(); return showMissing(r, 'Skin de Flocon', null); } sfx.level(); toast({house: 'La Maison change de style !', elves: 'Nouvelle tenue pour les lutins !'}[b.dataset.c] || 'Flocon a un nouveau pelage !'); save(); return renderPanel(); }
  if (a === 'fishcast') return fishCast();
  if (a === 'museum') return openPanel('museum');
  if (a === 'savepanel') return openPanel('save');
  if (a === 'account') return openPanel('account');
  if (a.startsWith('acc')) return accAction(a);
  if (a === 'restoreold'){ if (!confirm('Récupérer ton village (niveau 9, Maison niveau 14) ? La partie actuelle sera remplacée.')) return; saveLock = true; T.replaceTown(oldVillage()); location.reload(); return; }
  if (a === 'savecopy') return saveCopy();
  if (a === 'savefile') return saveFile();
  if (a === 'saveload') return saveLoad($('#loadcode')?.value);
  if (a === 'relicsell'){ const it = T.RELICS.find(x => x.k === b.dataset.k); if (!it || (S.relics[it.k] || 0) < 2) return; S.relics[it.k]--; giveReward(T.relicSell(it), b); sfx.collect(); save(); return renderPanel(); }
  if (a === 'relicclaim'){ const st = T.RELIC_SETS.find(x => x.k === b.dataset.k); if (!st || !T.relicSetDone(S, st) || S.relicClaim[st.k]) return; S.relicClaim[st.k] = 1; save(); bravo(T.relicSetReward(st), st.name, 'COLLECTION !'); return renderPanel(); }
  if (a === 'fishtap') return fishTap();
  if (a === 'petfeed'){ const r = T.petFeed(S, b.dataset.k); if (r.why){ sfx.err(); return r.cost ? showMissing(r.cost, 'Nourrir Flocon', null) : toastOnce(r.why); } sfx.collect(); petUp(r.up, b); save(); return renderPanel(); }
  if (a === 'petpat'){ const r = T.petPat(S); if (!r) return; T.track(S, 'petpat'); sfx.pop(); giveReward(r.gift, b); petUp(r.up, b); toast('Flocon est tout content !'); save(); return renderPanel(); }
  if (a === 'campgo') return campGo(+b.dataset.i);
  if (a === 'tload'){ const i = +b.dataset.i, w = S.train?.wag[i], why = T.trainLoad(S, i); if (why){ sfx.err(); if (w && !T.has(S, w.want)) return showMissing(w.want, 'Charger le wagon', () => { if (!T.trainLoad(S, i)){ giveReward(w.rw, $('#h-coins')); T.track(S, 'train'); save(); } renderPanel(); }); return toastOnce(why); } sfx.collect(); giveReward(w.rw, b); T.track(S, 'train'); save(); return renderPanel(); }
  if (a === 'tsend'){ const bon = T.trainSend(S); if (!bon) return; sfx.level(); if (Object.keys(bon).length) bravo(bon, 'Le train est parti plein !', 'TRAIN COMPLET'); else toast('Le train est parti. Il revient bientôt avec de nouveaux wagons.'); save(); return renderPanel(); }
  if (a === 'tspeed'){ const tr = S.train; if (!tr || tr.back <= now()) return; const st = T.speedStars(tr.back - now()); if (S.stars < st){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop'); } S.stars -= st; tr.back = now(); sfx.level(); save(); return renderPanel(); }
  if (a === 'rsgo'){ const why = T.rsStart(S, b.dataset.k); if (why){ sfx.err(); return toastOnce(why); } sfx.build(); T.track(S, 'research'); save(); return renderPanel(); }
  if (a === 'rsspeed'){ const R = S.rsRun; if (!R) return; const st = T.speedStars(R.end - now()); if (S.stars < st){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop'); } S.stars -= st; R.end = now(); rsCheck(); return renderPanel(); }
  if (a === 'golights') return openPanel('lights');
  if (a === 'bldinfo'){ const o = panel === 'mine' ? T.mineState(S)?.o : panel === 'lab' ? S.objs.find(x => x.type === 'library') : panel === 'train' ? S.objs.find(x => x.type === 'station') : panelArg; return o && openPanel('bld', o); }
  if (a === 'dig') return digCell(+b.dataset.i, b);
  if (a === 'down'){ if (T.mineDown(S)){ sfx.level(); toast(`Étage ${S.mine.floor} !`); T.track(S, 'floor'); save(); } return renderPanel(); }
  if (a === 'refill'){ const st = T.mineState(S); if (!st) return; if (S.stars < T.PICK_REFILL){ sfx.err(); return openPanel('shop'); } S.stars -= T.PICK_REFILL; st.M.picks = st.max; st.M.t = now(); sfx.level(); save(); return renderPanel(); }
  if (a === 'expgo'){ const why = T.expStart(S, b.dataset.k, now()); if (why){ sfx.err(); return toast(why); } sfx.level(); T.track(S, 'exp'); toast('Les rennes sont partis !'); save(); return renderPanel(); }
  if (a === 'expspeed'){ const e = (S.exps || [])[+b.dataset.i]; if (!e) return; const st = T.speedStars(e.end - now()); if (S.stars < st){ sfx.err(); return openPanel('shop'); } S.stars -= st; e.end = now(); checkExps(); return renderPanel(); }
  if (a === 'builder'){ const n = S.extraBuilders || 0, p = T.BUILDER_PRICE[n]; if (p == null) return; if (S.stars < p){ sfx.err(); return toast(`Il faut ${p} étoiles d'or`); } S.stars -= p; S.extraBuilders = n + 1; sfx.level(); toast(`Bâtisseur ${n + 3} engagé !`); save(); return renderPanel(); }
  if (a === 'lights'){ const why = T.lightsUp(S); if (why){ sfx.err(); return toast(why); } sfx.level(); gainXp(2, b); T.track(S, 'lights'); toast(`Illuminations niv. ${S.lights} : production +${S.lights} %`); save(); return renderPanel(); }
  if (a === 'cat'){ panelArg = b.dataset.k; sfx.tap(); return renderPanel(); }
  if (a === 'place') return startPlace(b.dataset.k);
  if (a === 'expand'){ const {cx, cy} = panelArg, n = S.chunks.length - T.START_CHUNKS.length, c = T.chunkCost(n); if (!T.has(S, c) || T.zoneLock(S, cx, cy)) return; T.take(S, c); const z = T.openZone(S, cx, cy); T.track(S, 'expand'); gainXp(30 + n * 20, b); sfx.level(); closePanel(); save(); if (z) zoneWelcome(z, T.zoneName(cx, cy)); else toast('Nouveau terrain !'); return; }
  if (a === 'speed'){ const o = panelArg; if (!workEnd(o)) return closePanel(); const st = speedCost(o); if (S.stars < st){ sfx.err(); toast("Pas assez d'étoiles d'or"); return openPanel('shop'); } S.stars -= st; if (o.build) o.build = now(); else o.up = now(); closePanel(); tutoEv('speed'); return; }
  if (a === 'move'){ const o = panelArg; closePanel(); ghost = {type: o.type, x: o.x, y: o.y, move: o}; showGhostUI(); return; }
  if (a === 'sellobj'){ const o = panelArg; S.objs = S.objs.filter(x => x !== o); if (o.wild) gainXp(1, null); else S.coins += refund(o); sfx.collect(); toast(o.wild ? 'Sapin coupé' : refund(o) ? `Vendu +${refund(o)} pièces` : 'Retiré'); selObj = null; closePanel(); save(); return; }
});

/* ---------- placement d'un nouveau bâtiment ---------- */
function startPlace(type, lot){
  const why = T.buildBlock(S, type); if (why){ sfx.err(); return why === 'Ressources insuffisantes' ? showMissing(T.upCost(type, 1), `Construire : ${BUILDINGS[type].name}`, () => startPlace(type, lot)) : toast(why); }
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
  if (ghost.move){ clearUnder(ghost.type, ghost.x, ghost.y, ghost.move); ghost.move.x = ghost.x; ghost.move.y = ghost.y; }
  else {
    const b = BUILDINGS[ghost.type], tok = S.tokens?.[ghost.type] > 0, cost = tok ? {} : T.upCost(ghost.type, 1), why = T.buildBlock(S, ghost.type);
    if (why){ sfx.err(); return toast(why); }
    T.take(S, cost); if (tok) S.tokens[ghost.type]--; clearUnder(ghost.type, ghost.x, ghost.y);
    const o = {id: 'o' + now() + Math.random().toString(36).slice(2, 5), type: ghost.type, x: ghost.x, y: ghost.y, lv: 1, t: now()};
    const ms = T.upTime(ghost.type, 1) * 1000 * (1 - T.rsBonus(S, 'plan')); if (ms){ o.build = now() + ms; o.btotal = ms; }
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
$('#b-orders').addEventListener('click', () => { sfx.tap(); const o = S.objs.find(o => o.type === 'orders'); if (o) panTo(o.x + 1.5, o.y + 1.5); openPanel('orders'); });
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
  icewell:  {name: 'Lutine Givre', img: elfImg},
  foundry:  {name: 'Forgeron Braise', img: elfImg},
  library:  {name: 'Mademoiselle Plume', img: elfImg},
  station:  {name: 'Chef de gare Sifflet', img: elfImg},
};
function keeperLine(o){
  const b = B(o), L = o.lv, N = L + 1, f = fmt;
  switch (b.kind){
    case 'prod': return T.workRatio(S) < 1 ? `Il me manque des lutins ! Construis un chalet, sinon je produis moins.` : `Je fais <b>${fmtR(T.rate(o.type, L))} ${ITEMS[b.res].name.toLowerCase()}/h</b>. Améliore-moi et j'en ferai <b>${fmtR(T.rate(o.type, N))}</b> !`;
    case 'house': return `Je loge <b>${T.housing(L)} lutins</b>. Ce sont eux qui font tourner les ateliers.`;
    case 'storage': return T.bulkReady(o, now()) ? `Une <b>grande commande du Nord</b> attend ! Livre une grosse quantité et je te paie bien.` : `Je garde <b>+${f(T.storageAdd(L))}</b> de bois, biscuits et tissu. Sans moi, ce qui dépasse est perdu !`;
    case 'craft': return `Je fabrique les jouets des lettres, <b>${T.craftSlots(L)} à la fois</b>. Plus je monte, plus je vais vite.`;
    case 'orders': return `Les enfants m'envoient leurs lettres. J'en garde <b>${T.orderSlots(L)}</b> et je paie <b>+${Math.round((T.orderBonus(L) - 1) * 100)} %</b>.`;
    case 'stable': return `Mes rennes partent en expédition : <b>${T.expSlots(L)} équipe${T.expSlots(L) > 1 ? 's' : ''}</b> en même temps, <b>${T.EXP_DEST.filter(d => d.lv <= L).length} destination${T.EXP_DEST.filter(d => d.lv <= L).length > 1 ? 's' : ''}</b>. Elles reviennent avec des colis mystère !`;
    case 'train': return `Mon train emporte <b>${T.trainWagons(L)} wagons</b> par voyage. Remplis-les tous avant le départ pour un bonus !`;
    case 'lab': return `Je cherche des secrets pour tout le village. Mes recherches vont jusqu'au <b>niveau ${Math.min(T.RS_MAX, L * 2)}</b> : améliore-moi pour aller plus loin !`;
    case 'mine': return `J'ai <b>${T.minePicks(L)} pioches</b>, une de plus toutes les <b>${T.minePickMin(L)} min</b>. Plus on descend, plus c'est riche !`;
    case 'fun': return `Mes spectacles donnent <b>+${T.theaterJoy(L)} bonheur</b> : toute la production augmente.`;
    case 'hq': return `Ma maison fixe le niveau de tout le village : jusqu'au <b>niveau ${L + 1}</b>. Améliore-la pour débloquer de nouveaux bâtiments !`;
  }
  return b.desc;
}

function showsBox(o){
  const on = S.show && S.show.end > now() ? T.SHOWS.find(x => x.k === S.show.k) : null;
  if (on) return `<h3>À l'affiche</h3><div class="jobrun"><b>${on.name} · production +${Math.round(S.show.pct * 100)} %</b><div class="work"><div class="bar"><i data-end="${S.show.end}" data-total="${S.show.end - S.show.start}"></i></div><span>Encore <b data-until="${S.show.end}"></b></span></div></div>`;
  return `<h3>Monter un spectacle <small class="meta">· toute la production du village augmente</small></h3><div class="jobs">${T.SHOWS.map(sh => { const c = T.showCost(sh, o.lv), ok = T.has(S, c);
    return `<div class="job"><div class="jt"><b>${sh.name}</b><span class="chip time">${fmtTime(sh.time / 1000)}</span></div><div class="jr"><span class="boostp">+${Math.round(T.showPct(sh, o.lv) * 100)} % de production</span></div><button class="btn ${ok ? 'green' : 'blue'} sm" data-a="showgo" data-k="${sh.k}"><span class="costs">${costChips(c)}</span>Jouer</button></div>`; }).join('')}</div>`;
}
function jobsBox(o){
  if (o.job){ const j = T.JOBS[o.type].find(x => x.k === o.job.k), done = o.job.end <= now(), st = T.speedStars(o.job.end - now());
    return `<h3>Commande spéciale</h3><div class="jobrun"><b>${j.name}</b>${done ? '<button class="btn gold wide" data-a="jobget">Récupérer</button>' : `<div class="work"><div class="bar"><i data-end="${o.job.end}" data-total="${o.job.end - o.job.start}"></i></div><span>Prêt dans <b data-until="${o.job.end}"></b></span></div><button class="btn gold sm" data-a="jobspeed">${st ? `Finir <i class="i star"></i>${st}` : 'Finir'}</button>`}</div>`; }
  return `<h3>Commandes spéciales <small class="meta">· choisis selon ton temps</small></h3><div class="jobs">${T.JOBS[o.type].map(j => { const p = T.jobPlan(S, o, j), ok = T.has(S, p.cost);
    return `<div class="job"><div class="jt"><b>${j.name}</b><span class="chip time">${fmtTime(p.time / 1000)}</span></div><div class="jr"><span class="costs">${rewardChips(p.give)}</span><small class="meta">${Math.round(j.bonus[0] * 100)} % de chance : ${resImg(j.bonus[1])}</small>${Object.entries(p.give).some(([k, n]) => T.RES.includes(k) && k !== 'coins' && n > T.cap(S, k) - S[k]) ? '<small class="bad">Dépasse ton stock : construis un Entrepôt</small>' : ''}</div><button class="btn ${ok ? 'green' : 'blue'} sm" data-a="jobgo" data-k="${j.k}"><span class="costs">${costChips(p.cost)}</span>Lancer</button></div>`; }).join('')}</div>`;
}
function keeperBox(o){
  const k = o.keeper || 0, why = T.keeperBlock(S, o), stars = '★'.repeat(k) + '☆'.repeat(T.KEEPER_MAX - k);
  if (T.hqLv(S) < T.keeperHq) return `<div class="kbox klock"><b>Gardien</b><span>Se débloque avec la Maison du Père Noël niv. ${T.keeperHq} : il récoltera tout seul pour toi.</span></div>`;
  return `<div class="kbox"><div><b>${k ? `Gardien engagé <i class="kst">${stars}</i>` : 'Engager le gardien'}</b><span>${k ? `Récolte automatique, même absent : <b>${T.keeperHours(o)} h</b> · production <b>+${Math.round((T.keeperMult(o) - 1) * 100)} %</b>${k < T.KEEPER_MAX ? ` → <b>+${Math.round(k * 10)} %</b>` : ''}` : `Il récoltera tout seul dans le stock du village, même quand tu ne joues pas (jusqu'à ${T.keeperHours({keeper: 1})} h d'absence).`}</span></div>
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
  const give = {}; for (const [k, n] of Object.entries(r || {})) if (k !== 'picks' && k !== 'parcel') give[k] = n;
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
    setTimeout(() => { list.shift(); const rw = T.parcelReward(S, r); T.track(S, 'parcel'); save(); if (Math.random() < [.04, .08, .15, .35][r]) relicFound(r); bravo(rw, `Colis ${R.name.toLowerCase()}`, r === 3 ? 'LÉGENDAIRE !' : r === 2 ? 'ÉPIQUE !' : 'BRAVO !'); }, 650); };
}
$('#b-parcels').addEventListener('click', () => openParcel());
for (const id of ['#h-stars', '#h-coins']) $(id).querySelector('.plus')?.addEventListener('click', e => { e.stopPropagation(); sfx.tap(); openPanel('shop', 'stars'); });
for (const [id, k] of [['#h-wood', 'wood'], ['#h-cookies', 'cookies'], ['#h-fabric', 'fabric'], ['#h-coins', 'coins'], ['#h-stars', 'stars'], ['#xpbar', 'xp'], ['#h-pop', 'pop'], ['#h-joy', 'joy']])
  $(id)?.addEventListener('click', () => { sfx.tap(); resInfo(k); });

/* ---------- ressources expliquées : nom, utilité, où en trouver, bouton « Y aller » ---------- */
const RINFO = {
  coins:   {name: 'Pièces', use: 'Construire, améliorer, engager les gardiens, dégager de nouveaux terrains.', from: 'Le Bureau des lettres en produit. Les lettres livrées, la grotte et les colis en rapportent beaucoup.', go: 'letters'},
  wood:    {name: 'Bois', use: 'Construire et améliorer, fabriquer les jouets en bois (train, luge…).', from: 'La Scierie : touche sa bulle pour récolter.', go: 'sawmill'},
  cookies: {name: 'Biscuits', use: 'Nourrir les lutins sur les gros chantiers et les rennes en expédition, fabriquer les boîtes de biscuits.', from: 'Le Four à biscuits : touche sa bulle pour récolter.', go: 'bakery'},
  fabric:  {name: 'Tissu', use: 'Fabriquer les peluches et les chaussettes, construire le Théâtre.', from: 'La Filature (Maison du Père Noël niv. 3).', go: 'mill'},
  stars:   {name: "Étoiles d'or", use: 'La monnaie rare : terminer un chantier tout de suite, remplir les pioches, engager un bâtisseur de plus.', from: 'Montées de niveau, tâches, album, colis légendaires, calendrier de l’Avent… ou la boutique.', go: 'shop'},
  ice:     {name: 'Cristaux de glace', use: 'Améliorer les bâtiments à partir du niveau 6.', from: 'Le Puits de cristaux, la Grotte aux cristaux, les colis rares des rennes, la Salle des ventes.', go: 'mine'},
  gold:    {name: "Lingots d'or polaire", use: 'Améliorer les bâtiments à partir du niveau 11.', from: 'La Fonderie d’or polaire, la Grotte (étage 3 et plus), les colis épiques ou légendaires, la Campagne des Trolls.', go: 'mine'},
  axe:     {name: 'Haches', use: 'Dégager un nouveau terrain dans la forêt.', from: 'Lettres des enfants, cadeau du jour, mini-jeux, colis.', go: 'orders'},
  saw:     {name: 'Scies', use: 'Dégager un nouveau terrain dans la forêt.', from: 'Lettres des enfants, cadeau du jour, mini-jeux, colis.', go: 'orders'},
  xp:      {name: 'Expérience', use: 'Remplir la barre fait monter de niveau : nouveaux jouets, nouvelles lettres, coffres de la barre.', from: 'Livrer les lettres (le plus), fabriquer des jouets, finir des chantiers, récolter.', go: 'orders'},
  pop:     {name: 'Lutins', use: 'Les bâtiments de production emploient des lutins (au travail / logés). S’il en manque, la production baisse.', from: 'Construis ou améliore des Chalets des lutins.', go: 'cabin'},
  joy:     {name: 'Bonheur', use: 'Chaque point de bonheur donne +1 % de production à tout le village.', from: 'Les décorations et le Théâtre de marionnettes.', go: 'build:deco'},
};
// Guide du Stock : chaque ressource, qui la produit, à quoi elle sert (une ligne chacune)
const GUIDE = [
  ['wood', ['sawmill'], 'construire, améliorer, jouets en bois'],
  ['cookies', ['bakery'], 'gros chantiers, rennes, boîtes de biscuits'],
  ['fabric', ['mill'], 'peluches, chaussettes, théâtre'],
  ['coins', ['letters', 'orders'], 'tout acheter et améliorer'],
  ['ice', ['icewell', 'mine', 'stable'], 'bâtiments à partir du niveau 6'],
  ['gold', ['foundry', 'mine', 'stable'], 'bâtiments à partir du niveau 11'],
  ['stars', ['Succès, Pass, niveaux, boutique'], 'accélérer, bâtisseurs, achats'],
];
const qty = k => k === 'xp' ? `${fmt(S.xp)} / ${fmt(T.xpNeed(S.lvl))}` : k === 'pop' ? `${T.employed(S)} au travail / ${T.lutins(S)} logés` : k === 'joy' ? `${T.joy(S)} points · +${T.joy(S)} %` : T.RES.includes(k) && k !== 'coins' ? `${fmt(S[k])} / ${fmt(T.cap(S, k))} (stock max)` : fmt(haveOf(k));
const resImg = k => k === 'stars' ? '<i class="i star"></i>' : k === 'xp' ? '<i class="i xp">XP</i>' : k === 'pop' ? '<i class="i pop"></i>' : k === 'joy' ? '<i class="i joy"></i>' : `<img src="${ICON[k]}" alt="">`;
function resInfo(k){
  const I = RINFO[k]; if (!I) return;
  const m = $('#modal'); m.className = 'glow rinfo';
  m.querySelector('.mcard').innerHTML = `<div class="rhead">${resImg(k)}<div><h2 class="stroke">${I.name}</h2><b class="rq">${qty(k)}</b></div></div>
    <div class="rrow"><small>À quoi ça sert</small><p>${I.use}</p></div><div class="rrow"><small>Où en trouver</small><p>${I.from}</p></div>
    <div class="acts">${I.go ? `<button class="btn green" data-m="go">${I.go === 'shop' ? 'Boutique' : 'Y aller'}</button>` : ''}<button class="btn blue" data-m="ok">OK</button></div>`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; m.hidden = true; if (b.dataset.m === 'go') goTo(I.go); };
}
/** Emmène le joueur là où l'on obtient une ressource (le bâtiment s'il existe, sinon la page Construire). */
function goTo(where){
  closePanel();
  if (where === 'shop' || where === 'orders') return openPanel(where);
  if (where.startsWith('build:')) return openPanel('build', where.slice(6));
  const o = S.objs.find(x => x.type === where && !x.wild && !x.free) || S.objs.find(x => x.type === where);
  const b = BUILDINGS[where];
  if (!o){ toast(`Construis d'abord : ${b.name}`); return openPanel('build', T.catOf(b)); }
  const ms = panTo(o.x + b.w / 2, o.y + b.h / 2);
  setTimeout(() => { if (workEnd(o)) return openPanel('site', o); if (b.kind === 'mine') return openPanel('mine', o); if (b.kind === 'lab') return openPanel('lab', o); if (b.kind === 'train') return openPanel('train', o); if (b.kind === 'stable') return openPanel('exp', o); if (b.kind === 'craft') return openPanel('craft', o); if (b.kind === 'prod' && collectBld(o)) return; openPanel('bld', o); }, ms + 80);
}
/** Ce qui manque pour une action : combien, où le trouver, et la possibilité de compléter en étoiles d'or. */
function showMissing(req, what, retry){
  const lack = Object.entries(req || {}).map(([k, n]) => [k, n - haveOf(k)]).filter(([, d]) => d > 0);
  if (!lack.length) return retry?.();
  const st = T.missingStars(S, Object.fromEntries(lack.map(([k]) => [k, req[k]]))), m = $('#modal'); m.className = 'glow rinfo';
  m.querySelector('.mcard').innerHTML = `<small>${what}</small><h2 class="stroke">Il te manque…</h2>
    <div class="lacks">${lack.map(([k, d]) => `<div class="lack">${resImg(k)}<div><b>${fmt(d)} ${(RINFO[k]?.name || ITEMS[k]?.name || k).toLowerCase()}</b><small>${RINFO[k]?.from || ''}</small></div>${RINFO[k]?.go ? `<button class="btn green sm" data-m="go" data-k="${RINFO[k].go}">Y aller</button>` : ''}</div>`).join('')}</div>
    <div class="acts">${isFinite(st) ? `<button class="btn gold" data-m="buy">Compléter <i class="i star"></i>${st}</button>` : ''}<button class="btn blue" data-m="ok">Plus tard</button></div>`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return;
    if (b.dataset.m === 'go'){ m.hidden = true; return goTo(b.dataset.k); }
    if (b.dataset.m === 'buy'){ if (S.stars < st){ m.hidden = true; toast("Pas assez d'étoiles d'or"); return openPanel('shop'); } S.stars -= st; for (const [k, d] of lack) T.give(S, k, d); m.hidden = true; sfx.level(); save(); return retry?.(); }
    m.hidden = true; };
}
function whyHelp(o, why){
  if (why !== 'Ressources insuffisantes') return why;
  const c = T.upCost(o.type, o.lv + 1), lack = Object.entries(c).filter(([k, n]) => haveOf(k) < n).map(([k, n]) => `${fmt(n - haveOf(k))} ${(RINFO[k]?.name || k).toLowerCase()}`);
  return `Il manque ${lack.join(', ')}. Touche <b>Améliorer</b> pour savoir où en trouver.`;
}

/* ---------- achats intégrés (simulés dans la version web) ---------- */
function skinImg(cat, k){
  if (cat === 'pet') return petImg(3, k);
  if (cat === 'house') return k === 'classic' ? thumbs.santa : thumbs['santa@' + k] || thumbs.santa;
  return k === 'classic' ? SPRURL['elf:0'] || elfImg() : SPRURL['elf:0@' + k] || elfImg();
}
function skinCard(cat, d){
  const own = M.hasSkin(S, d.k, cat), wear = M.skinState(S)[cat] === d.k;
  const act = wear ? '<span class="tagw">Porté</span>' : own ? `<button class="btn blue sm" data-a="skinwear" data-c="${cat}" data-k="${d.k}">Porter</button>`
    : d.event ? '<small class="ev">❄ Événement</small>' : d.pack ? `<button class="btn green sm" data-a="pack" data-k="${d.pack}">Pack ${M.PACKS[d.pack].price}</button>`
    : `<button class="btn gold sm" data-a="skinbuy" data-c="${cat}" data-k="${d.k}"><i class="i star"></i>${d.stars}</button>`;
  return `<div class="ps ${wear ? 'wear' : ''} ${cat === 'elves' ? 'elf' : ''}">${d.pack && !own ? '<span class="excl">Exclusif</span>' : ''}<img src="${skinImg(cat, d.k)}" alt=""><b>${d.name}</b>${act}</div>`;
}
function packCard(k, featured = false){
  const P = M.PACKS[k], owned = M.packOwned(S, k), F = M.featuredPack();
  if (featured && owned) return '';
  return `<div class="xpack ${featured ? 'feat' : ''}"><span class="ptag">${featured ? 'Cette semaine' : P.tag}</span><div class="xpimgs">${P.skins.map(([c, s2]) => `<img src="${skinImg(c, s2)}" alt="">`).join('')}</div>
    <div class="xpinfo"><b>${P.name}</b><small>${P.skins.map(([c, s2]) => M.SKIN_LISTS[c].find(x => x.k === s2).name).join(' · ')}</small><span class="costs">${rewardChips(P.give)}</span>${featured ? `<small class="meta">Disponible encore <b data-until="${F.end}"></b></small>` : ''}</div>
    ${owned ? '<span class="tagw">Acheté ✓</span>' : `<button class="btn green" data-a="pack" data-k="${k}">${P.price}</button>`}</div>`;
}
function buyPack(k){
  const P = M.PACKS[k]; if (!P || M.packOwned(S, k)){ sfx.err(); return toast('Déjà à toi'); }
  const m = $('#modal'); m.className = 'glow rinfo';
  m.querySelector('.mcard').innerHTML = `<small>Pack exclusif</small><h2 class="stroke">${P.name}</h2><div class="xpimgs big">${P.skins.map(([c, s2]) => `<img src="${skinImg(c, s2)}" alt="">`).join('')}</div><div class="costs" style="justify-content:center">${rewardChips(P.give)}</div>
    <div class="rrow"><small>Version de test</small><p>Ici l'achat est <b>simulé et gratuit</b>. Dans la version App Store, le paiement de <b>${P.price}</b> passera par Apple.</p></div>
    <div class="acts"><button class="btn green" data-m="buy">Acheter · ${P.price}</button><button class="btn blue" data-m="ok">Annuler</button></div>`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; m.hidden = true; if (b.dataset.m !== 'buy') return;
    S.iap ||= {}; S.iap[k] = (S.iap[k] || 0) + 1; for (const [c, s2] of P.skins) M.ownSkin(S, c, s2); closePanel(); save(); bravo(P.give, P.name + ' : apparences débloquées', 'MERCI !'); };
}
function buyIap(k){
  const p = M.IAP[k]; if (!p) return; S.iap ||= {};
  if (p.once && S.iap[k]){ sfx.err(); return toast('Déjà acheté'); }
  const m = $('#modal'); m.className = 'glow rinfo';
  m.querySelector('.mcard').innerHTML = `<small>Achat intégré</small><h2 class="stroke">${p.name}</h2>${Object.keys(p.give).length ? `<div class="costs" style="justify-content:center">${rewardChips(p.give)}</div>` : '<p>Débloque la colonne Or du Pass de Noël pour toute la saison, y compris les paliers déjà atteints.</p>'}
    <div class="rrow"><small>Version de test</small><p>Ici l'achat est <b>simulé et gratuit</b>, pour tester le parcours. Dans la version App Store, le paiement de <b>${p.price}</b> passera par Apple.</p></div>
    <div class="acts"><button class="btn green" data-m="buy">Acheter · ${p.price}</button><button class="btn blue" data-m="ok">Annuler</button></div>`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; m.hidden = true; if (b.dataset.m !== 'buy') return;
    S.iap[k] = (S.iap[k] || 0) + 1; closePanel();
    if (k === 'pass'){ M.pass(S).premium = true; save(); sfx.level(); toast('Pass de Noël Or activé !'); return openPanel('pass'); }
    save(); bravo(p.give, p.name, 'MERCI !'); };
}
$('#b-shop').addEventListener('click', () => { sfx.tap(); openPanel('shop'); });
$('#b-missions').addEventListener('click', () => { sfx.tap(); openPanel('missions', 'day'); });
$('#b-pass').addEventListener('click', () => { sfx.tap(); openPanel('pass'); });
$('#b-event').addEventListener('click', () => { sfx.tap(); openPanel('event'); });
// petit « +❄ » discret près du bouton de l'événement quand on gagne des flocons
let evAcc = 0, evT = 0;
function evPing(n){ evAcc += n; clearTimeout(evT); evT = setTimeout(() => { const b = $('#b-event'); if (!b || b.hidden || !evAcc) return; const r = b.getBoundingClientRect(), t = document.createElement('div'); t.className = 'evping'; t.textContent = '+' + evAcc + ' ❄'; t.style.left = (r.right + 4) + 'px'; t.style.top = (r.top + r.height * .55) + 'px'; document.body.appendChild(t); setTimeout(() => t.remove(), 1300); evAcc = 0; }, 250); }
$('#b-market').addEventListener('click', () => { sfx.tap(); openPanel('market'); });
document.querySelector('#hud2 .me')?.addEventListener('click', () => { sfx.tap(); openPanel('profile'); });

/* ---------- la hotte du Père Noël : 3 cartes retournées, on en choisit une ---------- */
function openSack(){
  if (!T.sackReady(S)) return toast('La hotte se remplit… reviens plus tard');
  const cards = T.sackCards(S), m = $('#modal'); m.className = 'glow sack';
  m.querySelector('.mcard').innerHTML = `<small>Toutes les 4 heures</small><h2 class="stroke">La hotte du Père Noël</h2><p>Choisis une carte !</p>
    <div class="cards3">${cards.map((c, i) => `<button class="card3" data-m="pick" data-i="${i}"><span class="back">🎁</span><span class="front">${rewardChips(c)}</span></button>`).join('')}</div>`;
  m.hidden = false; sfx.pop();
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b || m.dataset.done) return; m.dataset.done = 1;
    const i = +b.dataset.i; T.sackTake(S, now()); T.track(S, 'sack');
    m.querySelectorAll('.card3').forEach((c, j) => setTimeout(() => c.classList.add('flip', j === i ? 'mine' : 'other'), j === i ? 0 : 500));
    sfx.level(); save();
    setTimeout(() => { delete m.dataset.done; bravo(cards[i], 'La hotte du Père Noël'); }, 1700); };
}
/* ---------- visiteurs ---------- */
function openVisitor(){
  const v = S.visitor; if (!v) return; const ok = T.has(S, v.want), m = $('#modal'); m.className = 'glow rinfo';
  m.querySelector('.mcard').innerHTML = `<small>Un visiteur au village</small><h2 class="stroke">${v.who}</h2><div class="storyrow"><img src="${elfImg()}" alt=""><p>« ${v.say} »</p></div>
    <div class="rrow"><small>Il demande</small><div class="costs">${costChips(v.want)}</div></div><div class="rrow"><small>Il donne en échange</small><div class="costs">${rewardChips(v.give)}</div></div>
    <p class="meta">Il repart dans <b>${fmtTime((v.until - now()) / 1000)}</b>.</p>
    <div class="acts"><button class="btn green" data-m="yes">${ok ? 'Échanger' : 'Il me manque…'}</button><button class="btn red" data-m="no">Refuser</button></div>`;
  m.hidden = false; sfx.tap();
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return;
    if (b.dataset.m === 'yes'){ const r = T.visitorAnswer(S, true); if (r === 'missing'){ m.hidden = true; return showMissing(v.want, `Pour ${v.who}`, () => openVisitor()); } T.track(S, 'visitor'); M.passAdd(S, 10); save(); return bravo(r, `${v.who} est ravi !`); }
    m.hidden = true; T.visitorAnswer(S, false); toast(`${v.who} repart. Un autre visiteur viendra bientôt.`); save(); };
}

/* ---------- écran « Bravo ! » (récompenses en grand, puis elles volent vers les compteurs) ---------- */
let pendingStory = -1;
function story(i){ return chapterCine(i); }
function storyOld(i){
  const c = T.CHAPTERS[i], m = $('#modal'); m.className = 'glow';
  m.querySelector('.mcard').innerHTML = `<small>Chapitre ${i + 1}</small><h2 class="stroke">${c.title}</h2><div class="storyrow"><img src="${c.who && c.who !== 'Le vieux Père Noël' ? elfImg() : portrait}" alt=""><p>${c.who ? `<b class="who">${c.who}</b>` : ''}${c.story}</p></div><button class="btn green" data-m="ok">C'est parti !</button>`;
  m.hidden = false; m.onclick = e => { if (e.target.closest('[data-m]')) m.hidden = true; };
}
function zoneWelcome(z, name){
  const m = $('#modal'); m.className = 'glow';
  m.querySelector('.mcard').innerHTML = `<small>Nouvelle zone</small><h2 class="stroke">${name}</h2><div class="storyrow"><img src="${elfImg()}" alt=""><p>${z.txt}</p></div><div class="zonecard" style="--zt:${z.tint}"><div class="zb"><span>Bonus de la zone, pour toujours</span><b>${T.zoneBonusText(z.b)}</b></div></div><button class="btn green" data-m="ok">Ouvrir le cadeau</button>`;
  m.hidden = false; m.onclick = e => { if (!e.target.closest('[data-m]')) return; m.hidden = true; setTimeout(() => bravo(z.gift, "Cadeau d'arrivée", 'BIENVENUE !'), 250); };
}
function confirmStars(n, btn){
  const m = $('#modal'); m.className = 'glow rinfo';
  m.querySelector('.mcard').innerHTML = `<small>Étoiles d'or</small><h2 class="stroke">Dépenser ${n} <i class="i star"></i> ?</h2><p>Il t'en restera ${fmt(S.stars - n)}.</p><div class="acts"><button class="btn gold" data-m="yes">Oui, dépenser</button><button class="btn blue" data-m="no">Annuler</button></div>`;
  m.hidden = false;
  m.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return; m.hidden = true; if (b.dataset.m !== 'yes') return; let t = btn; if (!t.isConnected){ const sel = '[data-a="' + btn.dataset.a + '"]' + (btn.dataset.k ? '[data-k="' + btn.dataset.k + '"]' : '') + (btn.dataset.c ? '[data-c="' + btn.dataset.c + '"]' : '') + (btn.dataset.p ? '[data-p="' + btn.dataset.p + '"]' : ''); t = $('#sheet').querySelector(sel); }
    if (t){ t.dataset.ok = '1'; t.click(); } };
}
// une seule fenêtre à la fois : les suivantes attendent leur tour (au démarrage : retour d'absence, succès, histoire…)
const modalQ = [];
function modalBusy(){ return !$('#modal').hidden || document.body.classList.contains('cine') || !!$('#intro'); }
setInterval(() => { if (modalQ.length && !modalBusy()) modalQ.shift()(); }, 450);
function bravo(r, sub = 'Tu as gagné', title = 'BRAVO !'){
  if (modalBusy()) return void modalQ.push(() => bravo(r, sub, title));
  const m = $('#modal'); m.className = 'cere bravo';
  const cards = Object.entries(r || {}).filter(([, n]) => n).map(([k, n]) => `<div class="rcard r-${k}">${k === 'xp' ? '<i class="i xp">XP</i>' : k === 'stars' ? '<i class="i star"></i>' : `<img src="${ICON[k]}" alt="">`}<b>${fmt(n)}</b></div>`).join('');
  m.querySelector('.mcard').innerHTML = `<div class="rays"></div><h2${title.length > 9 ? ' class="long"' : ''}>${title}</h2><small>${sub}</small><div class="rcards ${Object.values(r).filter(Boolean).length > 4 ? 'many' : ''}">${cards}</div><button class="okc" data-m="ok" aria-label="OK"></button>`;
  m.hidden = false; sfx.level();
  m.onclick = e => { if (!e.target.closest('[data-m]')) return; m.hidden = true; giveReward(r, m.querySelector('.rcards') || $('#quest2')); if (pendingStory >= 0){ const k = pendingStory; pendingStory = -1; setTimeout(() => story(k), 900); } };
}

/* ---------- tâche en cours (carte en bas à gauche) ---------- */
let questHtml = '';
function rewardChips(r){ return Object.entries(r || {}).filter(([, n]) => n).map(([k, n]) => `<span class="chip">${k === 'xp' ? '<i class="i xp">XP</i>' : k === 'stars' ? '<i class="i star"></i>' : icon(k)}${fmt(n)}</span>`).join(''); }
function renderQuest(){
  const {q, v, done} = T.questProgress(S);
  const ch = T.chapterOf(S.quest.i), ct = T.CHAPTERS[ch];
  const h = `<span class="tag">${ct ? `Chapitre ${ch + 1}` : 'Tâche'}</span>${ct ? `<small class="chap">${ct.title}</small>` : ''}<b>${q.t}</b><span class="qbar"><i style="width:${v / q.n * 100}%"></i><em>${v} / ${q.n}</em></span><span class="costs">${done ? '<span class="claim">Récupérer</span>' : rewardChips(q.r)}</span>`;
  if (h !== questHtml){ questHtml = h; $('#quest2').innerHTML = h; $('#quest2').classList.toggle('done', done); }
}
function giveReward(r, el){
  for (const [k, n] of Object.entries(r || {})){
    if (!n || k === 'xp') continue;
    if (k === 'stars'){ S.stars += n; continue; }
    if (k === 'parcel'){ S.parcels ||= []; for (let j = 0; j < n; j++) S.parcels.push(1); continue; }
    const room = T.RES.includes(k) ? Math.max(0, T.cap(S, k) - S[k]) : Infinity, g = Math.min(n, room);
    if (g){ T.give(S, k, g); fly(k, g, el); }
  }
  if (r.xp) gainXp(r.xp, el);
  sfx.collect(); save();
}
$('#quest2').addEventListener('click', e => {
  const el = $('#quest2'), r = T.questClaim(S);
  if (r){ const before = T.chapterOf(S.quest.i - 1), after = T.chapterOf(S.quest.i); bravo(r, 'Tâche terminée'); if (after !== before && T.CHAPTERS[after]) pendingStory = after; questHtml = ''; renderQuest(); }
  else { sfx.tap(); const {q} = T.questProgress(S); questGo(q); }
});
/** Emmène vers ce que demande la tâche (comme les boutons « Aller » de Township). */
function questGo(q){
  const [kind, what] = q.k.split(':'), has = t => S.objs.some(o => o.type === t && !o.wild);
  if (kind === 'have'){ if (has(what) && what !== 'cabin') return goTo(what); return openPanel('build', T.catOf(BUILDINGS[what])); }
  if (kind === 'level') return has(what) ? goTo(what) : openPanel('build', T.catOf(BUILDINGS[what]));
  if (kind === 'collect') return goTo({wood: 'sawmill', cookies: 'bakery', fabric: 'mill', coins: 'letters'}[what] || 'sawmill');
  if (kind === 'make') return has('workshop') ? goTo('workshop') : openPanel('build', 'town');
  if (kind === 'orders') return openPanel('orders');
  if (kind === 'joy') return openPanel('build', 'deco');
  if (kind === 'games') return openPanel('games');
  if (kind === 'dig' || kind === 'floor') return has('mine') ? goTo('mine') : openPanel('build', 'town');
  if (kind === 'exp') return has('stable') ? goTo('stable') : openPanel('build', 'town');
  if (kind === 'parcel') return openParcel();
  if (kind === 'lights') return openPanel('lights');
  if (kind === 'auction' || kind === 'auctionwin') return T.hqLv(S) >= M.MARKET_HQ ? openPanel('auction') : openPanel('market');
  if (kind === 'relic') return openPanel('museum');
  if (kind === 'research') return has('library') ? openPanel('lab') : openPanel('build', 'town');
  if (kind === 'train') return has('station') ? openPanel('train') : openPanel('build', 'town');
  if (kind === 'petpat' || kind === 'petlv') return T.petState(S) ? openPanel('pet') : openPanel('build', 'town');
  if (kind === 'fish') return T.canFish(S) ? openPanel('fish') : toast('Ouvre le Lac Gelé (forêt à dégager) pour pêcher.');
  if (kind === 'camp' || kind === 'campat') return openPanel('camp');
}
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
$('#b-village').addEventListener('click', () => { sfx.tap(); if (panel === 'todo'){ closePanel(); const o = S.objs.find(o => o.type === 'santa'); if (o) panTo(o.x + 2, o.y + 2, {zoom: startZoom()}); return; } openPanel('todo'); });
function rsCheck(){ const R = T.rsTick(S); if (!R) return; const r = T.RESEARCH.find(x => x.k === R.k); toast(`Recherche terminée : ${r.name} niveau ${R.lv} !`); sfx.level(); save(); if (panel === 'lab') renderPanel(); }

/* ---------- retour dans l'app : on repart sur une image neuve ----------
   Après un verrouillage ou un passage en arrière-plan, Safari (iPhone) peut rendre la surface de dessin floue.
   Le village est déjà sauvegardé à la sortie : au retour on recharge proprement (aucune perte), comme le font les jeux mobiles. */
let bgAt = 0;
const inBattle = () => !!document.getElementById('mg') || document.body.classList.contains('cine');
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ bgAt = Date.now(); save(); try { sessionStorage.setItem('vdp-cam', JSON.stringify({x: cam.x, y: cam.y, z: cam.z})); } catch(e){} return; }
  if (bgAt && Date.now() - bgAt > 2500 && !inBattle()){ saveLock = true; location.reload(); }
});
addEventListener('pageshow', e => { if (e.persisted && !inBattle()){ saveLock = true; location.reload(); } });
try { const c = JSON.parse(sessionStorage.getItem('vdp-cam') || 'null'); if (c){ sessionStorage.removeItem('vdp-cam'); Object.assign(cam, c); } } catch(e){}
/* ---------- mise à jour automatique : l'app de l'écran d'accueil garde parfois l'ancienne version ---------- */
const GAME_V = 77;
async function checkUpdate(){
  try { const r = await fetch('version.json?t=' + Date.now(), {cache: 'no-store'}); const j = await r.json();
    if (j.v > GAME_V){ const k = 'vdp-upd-' + j.v; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, 1); save();
      toast('Mise à jour du jeu…');
      if ('caches' in window) for (const c of await caches.keys()) await caches.delete(c);
      const reg = await navigator.serviceWorker?.getRegistration(); await reg?.update().catch(() => {});
      setTimeout(() => location.replace(location.pathname + '?v=' + j.v), 600); } } catch(e){}
}
setTimeout(checkUpdate, 2500);
/* ---------- diagnostic d'affichage (pour trouver un bug qu'on ne voit que sur un téléphone précis) ---------- */
function diagText(){
  const L = [], vv = window.visualViewport, mem = performance.memory;
  L.push(`v${GAME_V} · ${navigator.userAgent.replace(/^Mozilla\/5\.0 /, '').slice(0, 90)}`);
  L.push(`écran ${screen.width}×${screen.height} · fenêtre ${innerWidth}×${innerHeight} · vv ${vv ? Math.round(vv.width) + '×' + Math.round(vv.height) : '-'} · DPR ${devicePixelRatio} (jeu ${DPR}) · appli ${STANDALONE ? 'oui' : 'non'}`);
  L.push(`canevas ${cv.width}×${cv.height} affiché ${cv.style.width}×${cv.style.height} · caméra z ${cam.z.toFixed(2)}`);
  let nS = 0, nOk = 0, nBad = 0; for (const k in SPR){ nS++; const c = SPR[k]._c || null; } 
  for (const k in SPR){ const d = Object.getOwnPropertyDescriptor(SPR[k], 'canvas'); if (d && d.get) continue; const c = SPR[k].canvas; if (c && (c.width || c.naturalWidth)) nOk++; else nBad++; }
  L.push(`images ${nS} · prêtes ${nOk} · vides ${nBad}`);
  L.push('tailles : ' + Object.entries(window.__sprInfo || {}).filter(([k]) => /santa|sawmill|forest|cabin/.test(k)).map(([k, v]) => k.replace('b:', '') + '=' + v).join(' '));
  const top = []; for (const e of document.body.querySelectorAll('body > *')){ const cs = getComputedStyle(e); if (cs.display === 'none' || e.hidden || e.id === 'diag') continue; const r = e.getBoundingClientRect(); if (r.width < 40 || r.height < 40) continue;
    top.push(`${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').slice(0, 2).join('.') : ''} ${Math.round(r.width)}×${Math.round(r.height)} op${(+cs.opacity).toFixed(2)} z${cs.zIndex}${cs.filter !== 'none' ? ' F' : ''}`); }
  L.push('grandes images : ' + ((window.__big || []).join(' | ') || 'aucune'));
  L.push('calques : ' + top.join(' | '));
  L.push(`modal ${$('#modal').hidden ? 'caché' : 'VISIBLE ' + $('#modal').className} · cine ${$('#cine') ? ($('#cine').hidden ? 'caché' : 'VISIBLE') : 'absent'} · intro ${$('#intro') ? 'PRÉSENTE' : 'absente'} · tuto ${tuto.active() ? S.tuto : 'fini'}`);
  let e = null; try { e = localStorage.getItem('vdp-lasterr'); } catch(_){}
  L.push('erreur : ' + (e || 'aucune'));
  return L.join('\n');
}
function showDiag(){
  let d = $('#diag'); if (!d){ d = document.createElement('div'); d.id = 'diag'; document.body.appendChild(d); }
  d.innerHTML = `<pre>${diagText().replace(/</g, '&lt;')}</pre><div><button class="btn green sm" data-d="fix">Réparer l'affichage</button> <button class="btn blue sm" data-d="plain">${plainGround ? 'Sol texturé' : 'Sol simple'}</button> <button class="btn blue sm" data-d="close">Fermer</button></div>`;
  d.onclick = ev => { const b = ev.target.closest('[data-d]'); if (!b) return; if (b.dataset.d === 'plain'){ plainGround = !plainGround; try { localStorage.setItem('vdp-plain', plainGround ? '1' : '0'); } catch(_){} toast(plainGround ? 'Sol simple activé' : 'Sol texturé'); d.remove(); return; }
    if (b.dataset.d === 'fix'){ try { localStorage.setItem('vdp-lasterr', 'réparation demandée · ' + diagText().split('\n').slice(3, 5).join(' / ')); } catch(_){} save(); saveLock = true; location.reload(); return; } d.remove(); };
}
// garde-fou au démarrage : rien ne doit rester par-dessus le village une fois le jeu lancé
setTimeout(() => { const i = $('#intro'); if (i){ i.remove(); try { localStorage.setItem('vdp-lasterr', 'intro restée affichée'); } catch(_){} } }, 6000);

/* ---------- salle des ventes (enchères contre des rivaux, comme Bid Master) ---------- */
const lotItems = l => `<div class="lis">${l.items.map((it, j) => l.seen.includes(j) ? `<span class="li">${resImg(it.k)}<b>${fmt(it.n)}</b></span>` : '<span class="li hid">?</span>').join('')}</div>`;
function lotCard(l, i){
  const R = T.RARITY[l.r], hid = l.items.length - l.seen.length;
  return `<div class="lot" style="--rc:${R.c}"><div class="lt"><span class="rar">${R.name}</span><b>${l.name}</b></div>${lotItems(l)}
    <div class="est">Estimation : <b>${fmt(Math.round(l.est * .7 / 50) * 50)} à ${fmt(Math.round(l.est * 1.6 / 50) * 50)}</b> pièces</div><div class="lf"><button class="btn blue sm" data-a="aucpeek" data-i="${i}" ${hid ? '' : 'disabled'}>Jumelles <i class="i star"></i>${M.AUC_PEEK}</button><button class="btn green sm" data-a="aucgo" data-i="${i}"><span class="costs">${costChips({coins: l.fee})}</span>Entrer</button></div></div>`;
}
let auc = null;
function aucOpen(i){
  const l = M.auction(S).lots[i]; if (!l) return;
  if (S.coins < l.fee){ toastOnce('Pas assez de pièces pour entrer'); return; }
  S.coins -= l.fee; S.auc.lots.splice(i, 1); T.track(S, 'auction'); save(); closePanel();
  auc = {l, price: Math.max(10, Math.round(l.est * .25 / 5) * 5), lead: -1, riv: M.aucRivals(l), cd: 3, said: 'Les enchères sont ouvertes !'};
  const m = $('#modal'); m.className = 'glow aucm'; m.hidden = false; aucDraw();
  m.onclick = e => { const b = e.target.closest('[data-b]'); if (!b || !auc) return; const k = +b.dataset.b;
    if (k === 0){ auc.quit = true; let g = 0; while (auc.cd > 0 && g++ < 300){ if (M.aucRivalTurn(auc)) auc.cd = 3; else auc.cd--; } return aucEnd(); }
    const np = auc.price + M.aucStep(auc.price) * k; if (S.coins < np){ toastOnce('Pas assez de pièces'); return; }
    auc.price = np; auc.lead = -2; auc.cd = 3; auc.said = 'Tu prends la main !'; sfx.tap(); aucDraw(); };
  clearInterval(aucOpen.t); aucOpen.t = setInterval(aucTick, 1200);
}
function aucTick(){
  if (!auc || auc.done) return;
  const r = M.aucRivalTurn(auc);
  if (r){ auc.cd = 3; auc.said = `${r.n} : ${fmt(auc.price)} !`; sfx.collect?.(); }
  else if (auc.lead === -1){ auc.cd--; auc.said = 'Personne ?'; }
  else { auc.cd--; auc.said = ['Adjugé !', 'Deux fois…', 'Une fois…'][auc.cd] || auc.said; }
  if (auc.cd <= 0) return aucEnd();
  aucDraw();
}
function aucDraw(){
  const a = auc, m = $('#modal'), lead = a.lead === -2 ? 'Toi' : a.lead >= 0 ? a.riv[a.lead].n : '—', st = M.aucStep(a.price), R = T.RARITY[a.l.r];
  m.querySelector('.mcard').innerHTML = `<small style="color:${R.c}">${R.name} · Salle des ventes</small><h2 class="stroke">${a.l.name}</h2>${lotItems(a.l)}
    <div class="arena">${a.riv.map((r, i) => `<span class="rv ${r.out ? 'out' : ''} ${a.lead === i ? 'lead' : ''}" style="--c:${r.c}"><i></i>${r.n}${r.out ? ' · abandonne' : ''}</span>`).join('')}<span class="rv you ${a.lead === -2 ? 'lead' : ''}" style="--c:#2f9e44"><i></i>Toi</span></div>
    <div class="bidnow"><span>Enchère actuelle · <b>${lead}</b></span><strong>${icon('coins')}${fmt(a.price)}</strong></div>
    <div class="gavel cd${a.cd}">${a.said}</div><div class="cdbar"><div style="width:${a.cd / 3 * 100}%"></div></div>
    <div class="bbtns"><button class="btn green" data-b="1" ${a.lead === -2 || S.coins < a.price + st ? 'disabled' : ''}>+${fmt(st)}</button><button class="btn gold" data-b="3" ${a.lead === -2 || S.coins < a.price + st * 3 ? 'disabled' : ''}>+${fmt(st * 3)}</button><button class="btn red" data-b="0" ${a.lead === -2 ? 'disabled' : ''}>Abandonner</button></div>
    <small class="meta">Tes pièces : ${fmt(S.coins)}</small>`;
}
function aucEnd(){
  const a = auc; if (!a || a.done) return; a.done = true; clearInterval(aucOpen.t);
  const val = Math.round(M.lotValue(S, a.l.items) / 5) * 5, m = $('#modal'), won = a.lead === -2, all = {...a.l, seen: a.l.items.map((_, j) => j)};
  if (won){ S.coins -= a.price; T.track(S, 'auctionwin'); save(); if (Math.random() < .3 + a.l.r * .15) relicFound(a.l.r); }
  const diff = val - a.price - a.l.fee;
  m.className = 'glow aucm';
  m.querySelector('.mcard').innerHTML = won
    ? `<small>Adjugé pour ${fmt(a.price)} pièces !</small><h2 class="stroke">${diff >= 0 ? 'Bonne affaire !' : 'Aïe, trop cher…'}</h2>${lotItems(all)}<div class="bidnow"><span>Valeur du lot</span><strong>${icon('coins')}${fmt(val)}</strong></div><p class="deal ${diff >= 0 ? 'up' : 'down'}">${diff >= 0 ? '+' : '−'}${fmt(Math.abs(diff))} par rapport à ce que tu as payé</p><button class="btn green" data-m="ok">Récupérer</button>`
    : `<small>${a.lead >= 0 ? `Adjugé à ${a.riv[a.lead].n} pour ${fmt(a.price)}` : 'Personne n’a enchéri'}</small><h2 class="stroke">${a.quit ? 'Tu as abandonné' : 'Raté !'}</h2>${lotItems(all)}<div class="bidnow"><span>Le lot valait</span><strong>${icon('coins')}${fmt(val)}</strong></div><p class="deal ${val > a.price ? 'down' : 'up'}">${val > a.price ? 'Dommage, c’était une bonne affaire.' : 'Bien vu : il ne valait pas ce prix.'}</p><button class="btn blue" data-m="ok">Continuer</button>`;
  if (won) sfx.level(); else sfx.err();
  m.onclick = e => { if (!e.target.closest('[data-m]')) return; m.hidden = true; const give = {}; if (won) for (const it of a.l.items) give[it.k] = (give[it.k] || 0) + it.n; auc = null; if (won) giveReward(give, $('#h-coins')); save(); openPanel('auction'); };
}

/* ---------- rappels : notifications du navigateur quand le jeu passe en arrière-plan ---------- */
function upcomingBox(){
  const t = now(), seen = new Set(), U = T.upcoming(S, t).filter(e => !seen.has(e.txt) && seen.add(e.txt)).slice(0, 4);
  return U.length ? `<h3>Bientôt prêt</h3><div class="mlist soon">${U.map(e => `<div class="mis"><div><b>${e.txt}</b></div><span class="chip time">dans <b data-until="${e.at}"></b></span></div>`).join('')}</div>` : '';
}
const canNotify = () => 'Notification' in window && Notification.permission === 'granted';
function notify(body){
  const opt = {body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'vdp-' + body.length, lang: 'fr'};
  if (navigator.serviceWorker?.controller) navigator.serviceWorker.ready.then(r => r.showNotification('Le Village du Pôle', opt)).catch(() => {});
  else try { new Notification('Le Village du Pôle', opt); } catch(e){}
}
let remindT = [], hiddenAt = 0;
function clearReminders(){ remindT.forEach(clearTimeout); remindT = []; }
function armReminders(){
  clearReminders(); if (!S.notif || !canNotify()) return;
  const t = now(), seen = new Set();
  for (const e of T.upcoming(S, t)){
    if (e.at - t > 864e5 || remindT.length >= 8) break;
    if (seen.has(e.txt)) continue; seen.add(e.txt);
    remindT.push(setTimeout(() => notify(e.txt), e.at - t));
  }
}
function toggleNotif(){
  if (S.notif){ S.notif = 0; clearReminders(); save(); return renderPanel(); }
  if (!('Notification' in window)) return toast('Sur iPhone, ajoute d’abord le jeu à l’écran d’accueil (Partager → Sur l’écran d’accueil).');
  Notification.requestPermission().then(p => {
    S.notif = p === 'granted' ? 1 : 0;
    if (S.notif){ notify('Rappels activés : je te préviendrai quand ton village aura besoin de toi.'); sfx.level(); }
    else toast('Rappels refusés : tu peux les autoriser dans les réglages du navigateur.');
    save(); if (panel) renderPanel();
  });
}
addEventListener('visibilitychange', () => {
  if (document.hidden){ hiddenAt = now(); armReminders(); return; }
  clearReminders();
  if (hiddenAt && now() - hiddenAt > 3 * 60e3 && !tuto.active()){ const n = todoList().length; if (n) setTimeout(() => { toast(`Bon retour ! ${n} chose${n > 1 ? 's' : ''} t’attend${n > 1 ? 'ent' : ''} au village`); $('#b-village')?.classList.add('ping'); setTimeout(() => $('#b-village')?.classList.remove('ping'), 4000); }, 600); }
  hiddenAt = 0;
});
/** Tout ce qui est prêt maintenant, avec où aller (comme les notifications de Township). */
function todoList(){
  const L = [], t = now(), find = type => S.objs.find(o => o.type === type && !o.build && !o.wild && !o.free);
  const add = (icon, text, go) => L.push({icon, text, go});
  if (T.dailyReady(S)) add(thumbs.gifts, 'Le cadeau du jour t’attend', 'daily');
  if (S.lvl >= 2 && T.sackReady(S)) add(ICON.parcel, 'La hotte du Père Noël est pleine', 'sack');
  if (S.visitor) add(elfImg(), `${S.visitor.who} attend au village`, 'visitor');
  if (S.drop) add(thumbs.gifts, 'Un cadeau est tombé du traîneau', 'drop');
  { const Q = T.questProgress(S); if (Q.done) add(ICON.coins, `Tâche terminée : ${Q.q.t}`, 'quest'); }
  for (const o of S.objs){ if (o.job && o.job.end <= t) add(ICON[B(o).res], `${B(o).name} : commande spéciale prête`, {o}); }
  { const ws = find('workshop'); if (ws && craftDone(ws).length) add(ICON[craftDone(ws)[0].item], 'Des jouets sont prêts à l’Atelier', {o: ws}); }
  { const n = S.orders.filter(od => od.items && T.has(S, od.items)).length; if (n) add(thumbs.orders, `${n} lettre${n > 1 ? 's' : ''} prête${n > 1 ? 's' : ''} à livrer`, 'orders'); }
  { const st = T.mineState(S); if (st && st.M.picks >= st.max) add(ICON.ice, 'Pioches pleines à la Grotte', {o: st.o}); }
  { const sb = find('stable'); if (sb && (S.exps || []).length < T.expSlots(sb.lv)) add(ICON.gold, 'Des rennes attendent une expédition', {o: sb}); }
  if ((S.parcels || []).length) add(thumbs.gifts, `${S.parcels.length} colis mystère à ouvrir`, 'parcels');
  { const sto = find('storage'); if (sto && T.bulkReady(sto, t)) add(thumbs.storage, 'Grande commande du Nord disponible', {o: sto}); }
  { const th = find('theater'); if (th && !(S.show && S.show.end > t)) add(thumbs.theater, 'Le Théâtre peut monter un spectacle', {o: th}); }
  { const busy = S.objs.some(x => (x.build || x.up) > t), ch = S.objs.find(o => o.type === 'cabin' && !o.build && T.helpReady(o, t)); if (busy && ch) add(thumbs.cabin, 'Les lutins peuvent aider les chantiers', {o: ch}); }
  { const free = T.builders(S) - T.busyBuilders(S, t); if (free > 0) add(buildIcon, `${free} bâtisseur${free > 1 ? 's' : ''} libre${free > 1 ? 's' : ''}`, 'build'); }
  { const Ms = M.missions(S), n = Ms.list.filter(m => !m.done && m.v >= m.n).length + M.achClaimable(S); if (n) add(SVGI.missions, `${n} mission${n > 1 ? 's' : ''} ou succès à récupérer`, 'missions'); }
  { const ts = T.trainState(S); if (ts && !ts.away && ts.tr.wag.some(w => !w.done && T.has(S, w.want))) add(thumbs.station || buildIcon, 'Le train attend : des wagons à charger', {o: ts.o}); else if (ts && !ts.away && ts.tr.wag.every(w => w.done)) add(thumbs.station || buildIcon, 'Le train est plein : fais-le partir !', {o: ts.o}); }
  { const st = T.RELIC_SETS.find(st => T.relicSetDone(S, st) && !(S.relicClaim || {})[st.k]); if (st) add(thumbs.gifts, `Musée : collection « ${st.name} » complète !`, 'museum'); }
  { const lb = S.objs.find(o => o.type === 'library' && !o.build); if (lb && !S.rsRun && T.RESEARCH.some(r => !T.rsBlock(S, r.k))) add(thumbs.library || buildIcon, 'La Bibliothèque peut lancer une recherche', {o: lb}); }
  if (T.hqLv(S) >= M.MARKET_HQ && M.auction(S).lots.length >= M.AUC_LOTS) add(thumbs.gifts, 'Salle des ventes : de nouveaux lots à saisir', 'auction');
  if (T.canFish(S) && !S.fish) add(ICON.ice, 'Le Lac Gelé est ouvert : va pêcher !', 'fish');
  if (S.pet && T.petCanPat(S)) add(ICON.mg_deer, 'Flocon veut un câlin', 'pet');
  if (S.lvl >= 3 && M.eventClaimable(S)) add(ICON.ice, 'Récompense d’événement à prendre', 'event');
  return L;
}
function todoGo(g){
  closePanel();
  if (g === 'daily') return openDaily(); if (g === 'sack') return openSack(); if (g === 'visitor') return openVisitor();
  if (g === 'drop'){ panTo(S.drop.x, S.drop.y); return; } if (g === 'quest') return $('#quest2').click();
  if (g === 'parcels') return openParcel(); if (g === 'build') return openPanel('build', 'prod');
  if (g === 'missions') return openPanel('missions', 'day'); if (g === 'auction') return openPanel('auction'); if (g === 'pet') return openPanel('pet'); if (g === 'fish') return openPanel('fish'); if (g === 'museum') return openPanel('museum'); if (g === 'orders' || g === 'event') return openPanel(g);
  if (g.o && g.o.type === 'library') return openPanel('lab', g.o);
  if (g.o && g.o.type === 'station') return openPanel('train', g.o);
  if (g.o) return goTo(g.o.type === 'cabin' ? 'cabin' : g.o.type);
}

/* ---------- mini-jeux (Tournée de Noël, Tour de cadeaux) ---------- */
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
    sfx: {...sfx, bells: sfx.level, whoosh: sfx.pop, splat: sfx.pop}, tone, best: kk => S.games.best[kk] || 0, setBest: (kk, v) => { S.games.best[kk] = v; save(); },
    chipsHtml: rewardChips, reward: gameReward,
    grant: (rw, el) => { giveReward(rw, el); T.track(S, 'games'); },
    onScore: () => {}, onClose: () => { document.body.classList.remove('in-game'); },
  });
}

/* ---------- village perdu : reconstruit d'après les captures du joueur (5 nov.) ---------- */
function oldVillage(){
  const s = T.newTown(), t = Date.now(), set = (type, lv) => { const o = s.objs.find(o => o.type === type); if (o) o.lv = lv; return o; };
  Object.assign(s, {lvl: 9, xp: 534, coins: 215000, wood: 900, cookies: 420, fabric: 41000, stars: 4400, tuto: 99, introSeen: 1, restored: 1, spaced: 0});
  set('santa', 14); set('sawmill', 2);
  s.objs.push({id: 'r-bakery', type: 'bakery', x: 13, y: 19, lv: 1, t}, {id: 'r-mine', type: 'mine', x: 12, y: 12, lv: 1, t, build: t + 118 * 3600e3, btotal: 120 * 3600e3});
  for (const [x, y] of [[17, 22], [26, 24]]) s.objs.push({id: 'r-cabin' + x, type: 'cabin', x, y, lv: 1, t});
  s.quest = {i: 5, base: {}}; s.cnt = {upgrade: 14, collect: 40};
  T.spaceOut(s); return s;
}
/* ---------- comptes (Firebase) ---------- */
const accVal = id => ($('#' + id)?.value || '').trim();
async function accAction(a){
  try {
    if (a === 'accgoogle') await ACC.signInGoogle();
    if (a === 'acclogin') await ACC.signInEmail(accVal('accmail'), $('#accpass')?.value || '');
    if (a === 'accsignup') await ACC.signUpEmail(accVal('accmail'), $('#accpass')?.value || '', accVal('accname'));
    if (a === 'accreset'){ await ACC.resetPassword(accVal('accmail')); return toast('E-mail envoyé pour changer ton mot de passe.'); }
    if (a === 'acclinkg'){ await ACC.linkGoogle(); toast('Google relié !'); }
    if (a === 'acclinkm'){ await ACC.linkEmail(accVal('accmail'), $('#accpass')?.value || ''); toast('E-mail relié !'); }
    if (a === 'accsave'){ await cloudPush(true); }
    if (a === 'acclogout'){ await cloudPush(); await ACC.signOut(); toast('Déconnecté.'); }
    renderPanel();
  } catch(e){ sfx.err(); toast(ACC.friendlyError(e)); }
}
async function cloudPush(say){ if (!ACC.current()) return; try { S.cloudT = Date.now(); await ACC.cloudSave(S); if (say) toast('Village sauvegardé en ligne ✓'); } catch(e){ if (say) toast(ACC.friendlyError(e)); } }
if (ACC.ready()){
  ACC.init().then(() => ACC.onChange(async u => {
    if (!u) return; const c = await ACC.cloudLoad().catch(() => null);
    if (c?.save){ const cs = JSON.parse(c.save); if ((cs.lvl || 0) > (S.lvl || 0) || ((cs.lvl || 0) === S.lvl && c.t > (S.t || 0) + 60e3)){
        if (confirm(`Un village plus avancé est enregistré sur ton compte (niveau ${cs.lvl}). Le charger ?`)){ saveLock = true; T.replaceTown(cs); location.reload(); return; } } }
    cloudPush(); toast(`Bonjour ${u.displayName || ''} ! Ton village est sauvegardé en ligne.`); if (panel) renderPanel();
  })).catch(() => {});
  setInterval(() => cloudPush(), 60e3); document.addEventListener('visibilitychange', () => { if (document.hidden) cloudPush(); });
}
/* ---------- sauvegarde transférable ---------- */
let saveCodeTxt = '';
async function saveCopy(){
  save(); saveCodeTxt = await T.exportCode(S); renderPanel();
  try { await navigator.clipboard.writeText(saveCodeTxt); toast('Code copié ! Garde-le précieusement.'); }
  catch(e){ const ta = $('#savecode'); if (ta){ ta.focus(); ta.select(); } toast('Sélectionne le code et copie-le.'); }
}
async function saveFile(){
  save(); const code = await T.exportCode(S), d = new Date(), name = `village-du-pole-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.txt`;
  const blob = new Blob([code], {type: 'text/plain'});
  try { if (navigator.canShare && navigator.canShare({files: [new File([blob], name)]})) { await navigator.share({files: [new File([blob], name, {type: 'text/plain'})], title: 'Sauvegarde du Village du Pôle'}); return; } } catch(e){ if (e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Fichier enregistré.');
}
async function saveLoad(code){
  let s2; try { s2 = await T.importCode(code); } catch(e){ sfx.err(); return toast(e.message || 'Code invalide.'); }
  if (!confirm(`Charger ce village (niveau ${s2.lvl}) ? Celui de ce téléphone sera remplacé.`)) return;
  saveLock = true; T.replaceTown(s2); location.reload();
}
/* ---------- musée des trouvailles ---------- */
function museumEntry(){ const n = T.RELICS.filter(x => (S.relics || {})[x.k]).length; return `<div class="museumentry" role="button" data-a="museum"><span>🏛️</span><div><b>Musée des trouvailles</b><small>${n} / ${T.RELICS.length} objets rares · production +${Math.round(T.museumProd(S) * 100)} %</small></div><span class="btn blue sm">Visiter</span></div>`; }
function relicFound(rar){
  const it = T.relicDrop(S, rar); T.track(S, 'relic'); save();
  setTimeout(() => { toast(`Trouvaille pour le musée : ${it.ico} ${it.name} !`); sfx.level(); }, 1200);
  return it;
}
/* ---------- pêche sur glace ---------- */
const fishSt = {mode: 'idle', msg: '', got: null, t: 0};
const fishSvg = (c, w) => `<svg viewBox="0 0 64 36" width="${w}" height="${w * .56}"><path d="M8 18 C18 2 44 2 52 18 C44 34 18 34 8 18 Z" fill="${c}" stroke="#2a1a0e" stroke-width="2.5"/><path d="M50 18 L63 6 L60 18 L63 30 Z" fill="${c}" stroke="#2a1a0e" stroke-width="2.5" stroke-linejoin="round"/><circle cx="20" cy="15" r="3" fill="#2a1a0e"/><path d="M28 10 Q32 18 28 26" stroke="#2a1a0e" stroke-width="2" fill="none" opacity=".5"/></svg>`;
function fishCast(){
  if (!T.canFish(S)) return toast('Ouvre le Lac Gelé pour pêcher.');
  const c = T.baitCost(S); if (!T.has(S, c)){ sfx.err(); return showMissing(c, 'Appât pour la pêche', fishCast); }
  T.take(S, c); sfx.pop(); clearTimeout(fishSt.t);
  Object.assign(fishSt, {mode: 'wait', msg: 'Chut… on attend que ça morde.', got: null});
  const f = T.fishRoll(S), wait = 1500 + Math.random() * 3500;
  fishSt.t = setTimeout(() => { Object.assign(fishSt, {mode: 'bite', msg: 'ÇA MORD !', fish: f}); sfx.collect(); if (panel === 'fish') renderPanel();
    fishSt.t = setTimeout(() => { Object.assign(fishSt, {mode: 'idle', msg: 'Trop tard… le poisson s’est échappé.'}); sfx.err(); if (panel === 'fish') renderPanel(); }, T.FISH_WIN[f.r] * 1000); }, wait);
  renderPanel(); save();
}
function fishTap(){
  if (fishSt.mode === 'wait'){ clearTimeout(fishSt.t); Object.assign(fishSt, {mode: 'idle', msg: 'Trop tôt ! Le poisson a eu peur.'}); sfx.err(); return renderPanel(); }
  if (fishSt.mode !== 'bite') return;
  clearTimeout(fishSt.t); const f = fishSt.fish, r = T.fishCatch(S, f);
  Object.assign(fishSt, {mode: 'idle', msg: 'Bien ferré !', got: f, first: r.first, rec: r.rec});
  sfx.level(); if (f.r >= 2 && Math.random() < (f.r === 3 ? .5 : .12)) relicFound(f.r); giveReward(r.rw, $('#sheet .fishhole')); if (r.rw.xp) gainXp(r.rw.xp, null); T.track(S, 'fish'); save(); renderPanel();
}
/* ---------- Flocon, le renne magique ---------- */
const petImg = (st = T.petStage(S.pet?.lv || 1), sk = M.skinState(S).pet) => ICON[`pet_${st}_${sk}`] || ICON.mg_deer;
// haches et scies qui manquent pour agrandir : on peut les acheter tout de suite (pièces ou étoiles), ou les gagner en jouant
const toolMissing = c => ['axe', 'saw'].map(k => [k, Math.max(0, (c[k] || 0) - (S.inv[k] || 0))]).filter(([, m]) => m > 0);
const toolCoins = n => 300 + 120 * n;
function toolBox(c, n){
  const miss = toolMissing(c); if (!miss.length) return '';
  const cnt = miss.reduce((a, [, m]) => a + m, 0), coins = cnt * toolCoins(n), stars = cnt * 5;
  return `<div class="toolbox"><b>Il te manque ${miss.map(([k, m]) => `${m} ${ITEMS[k].name.toLowerCase()}${m > 1 ? 's' : ''}`).join(' et ')}</b>
    <div class="acts"><button class="btn green" data-a="buytools" data-p="coins" ${S.coins >= coins ? '' : 'disabled'}><span class="costs">${costChips({coins})}</span>Acheter</button><button class="btn gold" data-a="buytools" data-p="stars"><i class="i star"></i>${stars}</button></div>
    <small class="meta">On en gagne aussi : cadeau du jour, lettres livrées, mini-jeux, caresser Flocon.</small></div>`;
}
// la Scierie fabrique une hache ou une scie toutes les 3 h (source régulière d'outils d'agrandissement)
const TOOL_CD = 3 * 3600e3, toolCost = (o, k) => ({wood: R5(250 * (1 + (S.chunks.length - T.START_CHUNKS.length) * .4)) * (k === 'saw' ? 2 : 1), coins: 100 * o.lv});
const R5 = n => Math.round(n / 5) * 5;
function toolsBox(o){
  const ready = now() - (o.toolT || 0) >= TOOL_CD;
  return `<h3>Établi à outils <small class="meta">· une fois toutes les 3 h</small></h3><div class="jobs">${['axe', 'saw'].map(k => `<div class="job"><div class="jt"><img class="i" src="${ICON[k]}" alt=""><b>${ITEMS[k].name}</b><small class="meta">tu en as ${S.inv[k] || 0}</small></div>
    ${ready ? `<button class="btn ${T.has(S, toolCost(o, k)) ? 'green' : 'blue'} sm" data-a="mktool" data-k="${k}"><span class="costs">${costChips(toolCost(o, k))}</span>Fabriquer</button>` : `<span class="meta">Prêt dans <b data-until="${(o.toolT || 0) + TOOL_CD}"></b></span>`}</div>`).join('')}</div>`;
}
function petEntry(){
  const p = T.petState(S); if (!p) return '';
  return `<div class="petentry" role="button" data-a="pet"><img src="${petImg()}" alt=""><div><b>Flocon · niveau ${p.lv}</b><small>${T.PET_STAGES[T.petStage(p.lv)][1]} · +${Math.round(T.petProd(S) * 100)} % de production</small></div><span class="btn gold sm">${T.petCanPat(S) ? 'Caresser' : 'Voir'}</span></div>`;
}
function petUp(up, el){
  if (!up) return; const p = S.pet, st = T.PET_STAGES[T.petStage(p.lv)];
  sfx.level(); toast(T.PET_STAGES.some(([l]) => l === p.lv) ? `Flocon grandit : ${st[1]} !` : `Flocon passe niveau ${p.lv} !`);
}
/* ---------- campagne contre les trolls ---------- */
function campCard(){
  if (S.lvl < T.CAMP_LVL) return `<div class="campentry camp-lock"><b>Campagne des Trolls</b><small>Niveau ${T.CAMP_LVL} requis</small></div>`;
  const C = T.campState(S), c = T.camp(C.at);
  return `<div class="campentry" role="button" data-a="camp"><span class="ti">⚔</span><div><b>Campagne des Trolls</b><small>Prochain : ${c.name}</small></div><span class="btn red sm">Attaquer</span></div>`;
}
function campGo(i){
  const C = T.campState(S); if (i > C.at) return; const cost = T.campCost(i), c = T.camp(i);
  if (!T.has(S, cost)){ sfx.err(); return showMissing(cost, `Attaquer : ${c.name}`, () => campGo(i)); }
  T.take(S, cost); save(); closePanel(); document.body.classList.add('in-game');
  openBattle({
    pet: (S.pet?.lv || 0) >= 5, extraHearts: T.petHearts(S), camp: c, icons: {}, sfx: {...sfx, bells: sfx.level, whoosh: sfx.pop, splat: sfx.pop}, tone, best: () => 0, setBest: () => {},
    chipsHtml: rewardChips, reward: () => ({}),
    result: ({win, hearts}) => { if (!win) return {stars: 0, rw: {xp: 5}}; const first = !C.st[i], stars = Math.max(1, hearts), rw = T.campLoot(S, i, stars, first);
      if (first && c.boss) relicFound(Math.min(3, 1 + c.ch)); C.st[i] = Math.max(C.st[i] || 0, stars); if (i === C.at) C.at++; T.track(S, 'camp'); save(); return {stars, rw}; },
    grant: (rw, el) => { giveReward(rw, el); if (rw.xp) gainXp(rw.xp, el); },
    onClose: () => { document.body.classList.remove('in-game'); openPanel('camp'); },
  });
}


/* =====================================================================
   CINÉMATIQUES (bandes noires, caméra qui survole le village, dialogues)
   La trame : le vieux Père Noël prend sa retraite, et le Krampus des Glaces veut voler l'Étoile du Nord,
   le cœur magique de Noël. Chaque chapitre rallume une partie de sa lumière.
   ===================================================================== */
const KRAMPUS = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M24 34 C10 18 12 6 20 2 C20 14 28 22 36 28Z M76 34 C90 18 88 6 80 2 C80 14 72 22 64 28Z" fill="#e8e0d0" stroke="#1d2547" stroke-width="3"/><ellipse cx="50" cy="56" rx="30" ry="34" fill="#5a3a8a" stroke="#1d2547" stroke-width="3.5"/><ellipse cx="50" cy="74" rx="18" ry="13" fill="#efe6ff"/><circle cx="38" cy="50" r="7" fill="#ffe24a" stroke="#1d2547" stroke-width="2.5"/><circle cx="62" cy="50" r="7" fill="#ffe24a" stroke="#1d2547" stroke-width="2.5"/><circle cx="39" cy="51" r="3" fill="#1d2547"/><circle cx="61" cy="51" r="3" fill="#1d2547"/><path d="M28 40 L44 44 M72 40 L56 44" stroke="#1d2547" stroke-width="4" stroke-linecap="round"/><path d="M38 70 Q50 80 62 70" stroke="#1d2547" stroke-width="3" fill="#7a1a2a"/><path d="M43 71 L45 76 L47 72 M53 72 L55 76 L57 71" fill="#fff"/></svg>`);
const VP = {}; const vp = k => VP[k] ||= villainPortrait(k);
// portraits en 3D (modèles animés des monstres) dès qu'ils sont prêts ; dessin en attendant
setTimeout(() => { for (const k of ['krampus', 'chief', 'troll', 'runner', 'yeti']) portrait3d(k).then(u => { if (u) VP[k] = u; }); }, 4000);
const WHO = {
  'Le vieux Père Noël': () => portrait, 'Mère Noël': elfImg, 'Krampus des Glaces': () => vp('krampus'), 'Baron Glaçon': () => vp('baron'), 'Grognard, chef des trolls': () => vp('chief'), 'Narrateur': null,
};
const CINE_AT = ['sawmill', 'workshop', 'cabin', 'mill', 'stable', 'theater', 'mine', 'santa', 'stable', 'mine', 'theater', 'storage', 'workshop', 'santa', 'santa', 'library', 'stable', 'santa'];
// répliques en plus de l'histoire du chapitre : la trame du Krampus et de l'Étoile du Nord
const VILLAINS = new Set(['Krampus des Glaces', 'Baron Glaçon', 'Grognard, chef des trolls']);
// La trame : l'Étoile du Nord, forgée par le premier Père Noël, fait voler les rennes et porte les vœux des enfants.
// Le Krampus des Glaces, ancien gardien de l'Hiver, en a volé des éclats (les cristaux de glace) pour l'éteindre.
const CINE_MORE = {
  0: [{who: 'Le vieux Père Noël', say: "Là-haut, l'Étoile du Nord. Le premier Père Noël l'a forgée avec les lutins, il y a mille hivers. C'est elle qui fait voler le traîneau… et qui entend les vœux des enfants."},
      {who: 'Le vieux Père Noël', say: "Elle faiblit depuis des années. Chaque atelier qui se rallume lui rend un peu de lumière. Au travail !"}],
  1: [{who: 'Mère Noël', say: "Les premières lettres ! Regarde : quand un enfant écrit, l'Étoile scintille un tout petit peu plus fort."},
      {who: 'Krampus des Glaces', say: "Des lettres, des jouets… Tant de bruit pour une seule nuit. L'hiver, lui, dure toute l'année. Personne n'écrit à l'Hiver.", at: [14, 12]}],
  2: [{who: 'Le vieux Père Noël', say: "Ce Krampus… autrefois, on l'appelait le Gardien de l'Hiver. Il était mon ami. Puis les enfants n'ont plus attendu que Noël, et il s'est senti oublié."}],
  3: [{who: 'Krampus des Glaces', say: "De la laine, des peluches… Ridicule ! J'ai déjà volé trois éclats de ton Étoile. Quand j'aurai le dernier, l'hiver ne finira plus jamais."}],
  4: [{who: 'Dame Rennes', say: "Les rennes sentent le froid du Krampus arriver. Bien nourris, ils voleront plus haut que ses tempêtes."},
      {who: 'Grognard, chef des trolls', say: "GRAOU ! Le maître Krampus paie en cristaux. Nous prendre cadeaux, nous prendre biscuits, nous prendre TOUT !", at: [30, 14]}],
  5: [{who: 'Mère Noël', say: "Un village heureux brille plus fort. Le Krampus déteste les rires : ils réchauffent l'Étoile."}],
  6: [{who: 'Pic le mineur', say: "Ces cristaux bleus sous la glace… ce ne sont pas des pierres. Ce sont des éclats de l'Étoile du Nord ! Le Krampus les a cachés ici."},
      {who: 'Krampus des Glaces', say: "Rends-moi ces éclats, petit voleur ! Ils sont à MOI, je les ai arrachés au ciel moi-même…"},
      {who: 'Le vieux Père Noël', say: "Chaque cristal que tu remontes rend un peu de lumière à l'Étoile. Creuse, mon ami, creuse !"}],
  7: [{who: 'Mère Noël', say: "Un cadeau bien emballé garde la chaleur de celui qui l'offre. C'est un secret que le Krampus n'a jamais compris."}],
  8: [{who: 'Dame Rennes', say: "Au Phare du Nord, les rennes ont vu des traces de trolls. Ils préparent quelque chose, tout au bout de la banquise."}],
  9: [{who: 'Krampus des Glaces', say: "Plus vous creusez, plus mes trolls se réveillent. Grognard ! Va leur rendre une petite visite."},
      {who: 'Grognard, chef des trolls', say: "Avec plaisir, maître. Hé hé… GRAOU !", at: [30, 14]}],
  10: [{who: 'Monsieur Fil', say: "Ce soir, je joue « Le Gardien de l'Hiver » : l'histoire d'un esprit qui voulait qu'on l'aime autant que Noël. Les lutins pleurent à chaque fois."}],
  11: [{who: 'Gros Ours', say: "Tout le Grand Nord commande chez nous maintenant. Plus on livre de cadeaux, plus l'Étoile brille. Le Krampus doit enrager !"}],
  12: [{who: 'Maître Rouage', say: "J'ai fondu un éclat de l'Étoile dans ce train-jouet. Écoute… il ronronne comme un chat. La magie revient !"}],
  13: [{who: 'Le vieux Père Noël', say: "L'Étoile brille plus fort que jamais. Mais il manque encore le cœur : le dernier éclat, celui que le Krampus garde dans sa Citadelle."},
       {who: 'Krampus des Glaces', say: "Tu veux mon éclat ? Viens le chercher. Mais d'abord, il faudra passer mon armée… et mon cousin le Baron."}],
  14: [{who: 'Baron Glaçon', say: "Mes hommages ! Tes cadeaux perdus ? Je les vends au plus offrant, très cher ami. Les affaires sont les affaires."},
       {who: 'Krampus des Glaces', say: "Le Baron fera ruisseler tes pièces jusqu'à moi. Chaque enchère perdue me rend plus fort !"}],
  15: [{who: 'Mademoiselle Plume', say: "J'ai trouvé un vieux grimoire : « Seul un renne né de la lumière peut atteindre la Citadelle de Glace. » Un renne né de la lumière… ?"}],
  16: [{who: 'Dame Rennes', say: "Ce faon tout blanc… il est né la nuit où tu as remonté ton premier cristal. Flocon est né de la lumière de l'Étoile !"},
       {who: 'Le vieux Père Noël', say: "Le grimoire disait vrai. Fais-le grandir : un jour, il t'emmènera jusqu'à la Citadelle."}],
  17: [{who: 'Krampus des Glaces', say: "Assez joué ! Mes trolls marchent sur ton village. Défends ta palissade, si tu peux !"},
       {who: 'Le vieux Père Noël', say: "Courage. Une boule de neige lancée avec le cœur vaut mieux qu'une armée."},
       {who: 'Narrateur', say: "Et au loin, dans la Citadelle de Glace, le dernier éclat de l'Étoile attend… À suivre."}],
};
const INTRO = [
  {who: 'Narrateur', say: "Pôle Nord. La plus longue nuit de l'année approche, et le village du Père Noël dort sous la neige…", at: [22, 22], zoom: .55},
  {who: 'Le vieux Père Noël', say: "Ho ho ho… Après 300 Noëls, mes genoux grincent plus que mon traîneau. Il est temps de passer la main.", at: 'santa', zoom: 1},
  {who: 'Krampus des Glaces', say: "Un nouveau Père Noël ? Hé hé… Parfait. Cette année, l'Étoile du Nord s'éteindra, et Noël sera à MOI !", villain: 1, at: [14, 12], zoom: .7},
  {who: 'Le vieux Père Noël', say: "Ne l'écoute pas. Le village croit en toi. Rallumons l'Étoile ensemble : je te montre tout !", at: 'santa', zoom: 1},
];
function cineFocus(at){ if (!at) return null; if (Array.isArray(at)) return at; const o = S.objs.find(x => x.type === at && !x.wild); if (!o) return null; const b = B(o); return [o.x + b.w / 2, o.y + b.h / 2]; }
function cinema(lines, onEnd, title){
  closePanel(); let el = $('#cine');
  if (!el){ el = document.createElement('div'); el.id = 'cine'; el.innerHTML = '<div class="cbar t"></div><div class="cbar b"></div><div class="ctitle"></div><div class="ccap"><img alt=""><div class="cwho"></div><p></p><span class="cnext">Toucher pour continuer ▾</span></div><button class="cskip">Passer ›</button>'; document.body.appendChild(el); }
  const cap = el.querySelector('.ccap'), p = cap.querySelector('p'); let i = -1, typing = 0, full = '', z0 = cam.z;
  document.body.classList.add('cine'); el.hidden = false; requestAnimationFrame(() => el.classList.add('on'));
  const t = el.querySelector('.ctitle'); t.innerHTML = title || ''; t.classList.toggle('show', !!title);
  const type = txt => { clearInterval(typing); full = txt; let n = 0; p.textContent = ''; typing = setInterval(() => { n += 2; p.textContent = full.slice(0, n); if (n >= full.length){ clearInterval(typing); typing = 0; } }, 22); };
  const end = () => { clearInterval(typing); el.classList.remove('on'); document.body.classList.remove('cine'); setTimeout(() => { el.hidden = true; }, 450); el.onclick = null; panTo(...(cineFocus('santa') || [22, 22]), {zoom: z0}); onEnd?.(); };
  const next = () => {
    i++; if (i >= lines.length) return end();
    const L = lines[i], f = cineFocus(L.at), img = L.who === 'Narrateur' ? null : WHO[L.who] ? WHO[L.who]() : elfImg();
    cap.classList.remove('show'); const vil = L.villain || VILLAINS.has(L.who); cap.classList.toggle('villain', vil); cap.classList.toggle('narr', !img);
    if (vil) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
    const ms = f ? panTo(f[0], f[1], {zoom: L.zoom || Math.max(.85, Math.min(1.15, cam.z))}) : 0;
    setTimeout(() => { if (img) cap.querySelector('img').src = img; cap.querySelector('img').hidden = !img; cap.querySelector('.cwho').textContent = L.who === 'Narrateur' ? '' : L.who; cap.classList.add('show'); type(L.say); if (i === 0 && title) setTimeout(() => t.classList.remove('show'), 1800); }, Math.min(ms, 900) + 150);
  };
  el.onclick = e => { if (e.target.closest('.cskip')){ sfx.tap(); return end(); } if (typing){ clearInterval(typing); typing = 0; p.textContent = full; return; } if (cap.classList.contains('show')){ sfx.tap(); next(); } };
  next();
}
function chapterCine(i){
  const c = T.CHAPTERS[i]; if (!c) return;
  const who = c.who || 'Le vieux Père Noël', at = CINE_AT[i] || 'santa';
  cinema([{who, say: c.story, at}, ...(CINE_MORE[i] || []).map((l, k) => ({...l, at: l.at || (VILLAINS.has(l.who) ? [14 + k * 6, 12] : 'santa')}))], null, `<small>Chapitre ${i + 1}</small>${c.title}`);
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
const rectOf = pred => () => { if (panel) return null; const o = S.objs.find(pred); if (!o) return null; const r = objScreenRect(o), b = B(o);
  // cadre ajusté au bâtiment : largeur de son terrain (losange), du haut du toit jusqu'à la pointe basse du terrain
  const L = toScreen(o.x, o.y + b.h), R = toScreen(o.x + b.w, o.y), Bt = toScreen(o.x + b.w, o.y + b.h), top = r.top + r.height * .12;
  return {left: L.x + 4, top, width: R.x - L.x - 8, height: Bt.y - top - 2}; };
const STEPS = [
  {say: "Bienvenue chez toi, <b>nouveau Père Noël</b> ! Pour rallumer l'Étoile du Nord, il faut d'abord remettre le village en marche.", tap: true},
  {say: "Les enfants comptent sur nous. Un village qui tourne bien, c'est des jouets à l'heure ! Je te montre tout, c'est promis.", tap: true},
  {say: "La scierie a travaillé toute la nuit. <b>Touche-la</b> pour récolter le bois !", target: rectOf(o => o.type === 'sawmill'), wait: 'collect:sawmill', focus: [14.5, 16.5], reward: {coins: 20}, praise: 'Premier bois récolté !'},
  {say: "Et voilà les pièces des enfants au Bureau des lettres. <b>Récolte-les !</b>", target: rectOf(o => o.type === 'letters'), wait: 'collect:letters', focus: [26.5, 16.5], reward: {wood: 20}, praise: 'Joli magot !'},
  {say: "Chaque bâtiment a sa fiche. <b>Touche la scierie</b> pour voir ce qu'elle sait faire.", target: rectOf(o => o.type === 'sawmill'), wait: 'open:bld', focus: [14.5, 16.5]},
  {say: "Plus elle monte de niveau, plus elle produit. <b>Touche « Améliorer » !</b>", target: () => document.querySelector('[data-a="upgrade"]'), wait: 'upgrade', skipIf: s => s.objs.some(o => o.type === 'sawmill' && (o.lv >= 2 || o.up)), reward: {coins: 30}, praise: 'Les lutins se mettent au travail !'},
  {say: "Les lutins bâtissent… Moins de 3 minutes, c'est gratuit ! <b>Touche le chantier.</b>", target: rectOf(o => o.type === 'sawmill'), wait: 'open:site', skipIf: s => !s.objs.some(o => o.type === 'sawmill' && o.up) || panel === 'site'},
  {say: "<b>Termine gratuitement !</b>", target: () => document.querySelector('[data-a="speed"]'), wait: 'speed', skipIf: s => !s.objs.some(o => o.type === 'sawmill' && o.up), reward: {stars: 2}, praise: 'Scierie niveau 2 !'},
  {say: "Les lutins adorent les biscuits : ils en ont besoin pour les gros chantiers. <b>Touche Construire.</b>", target: () => document.querySelector('#b-build'), wait: 'open:build'},
  {say: "Choisis le <b>Four à biscuits</b>.", target: () => document.querySelector('[data-a="place"][data-k="bakery"]'), wait: 'placing'},
  {say: "Je l'ai mis sur son terrain. Touche <b>✓</b> pour lancer le chantier !", target: () => document.querySelector('#pb-ok'), wait: 'placed', reward: {coins: 50}, praise: 'Ton premier bâtiment !'},
  {say: "Bravo, Père Noël ! Suis les <b>tâches</b> en bas à gauche : elles t'emmènent toujours au bon endroit. Le Pôle Nord est entre tes mains !", tap: true, end: true},
]
const tuto = createTuto({getState: () => S, save, sfx, portrait: elfPortrait, steps: STEPS, name: 'Père Noël', focusPlot: ([x, y]) => { tutoHold = performance.now() + 550; setTimeout(() => panTo(x, y), 550); }, moving: () => !!glide || performance.now() < tutoHold,
  onReward: (r, praise) => { tutoPraise(r, praise); }, onEnd: () => setTimeout(() => bravo({coins: 300, stars: 10, axe: 1}, 'Tutoriel terminé : le village est à toi !', 'BRAVO !'), 500)});
// petite carte « Bien joué ! » avec la récompense, puis les gains volent vers les compteurs
function tutoPraise(r, praise){
  const c = document.createElement('div'); c.className = 'tpraise' + ($('#tuto .tbox')?.classList.contains('up') ? ' low' : '');
  c.innerHTML = `<b>${praise || 'Bien joué !'}</b><span class="costs">${rewardChips(r)}</span>`; document.body.appendChild(c);
  sfx.level(); setTimeout(() => { giveReward(r, c); }, 500); setTimeout(() => c.remove(), 1700);
}
function tutoEv(n){ tuto.event(n); }

/* =====================================================================
   BOUCLE
   ===================================================================== */
let last = performance.now(), hudT = 0, saveT = 0, panelT = 0;
function frame(t){
  requestAnimationFrame(frame);
  // horloge de l'image : jamais négative (le 1er horodatage peut précéder la fin du chargement)
  const dt = Math.max(0, Math.min(.05, (t - last) / 1000)); last = Math.max(last, t);
  try { step(t, dt); } catch(e){ if (!frame.err){ frame.err = 1; console.error('frame', e && e.stack); window.showErr?.(e && e.message); try { localStorage.setItem('vdp-lasterr', new Date().toISOString() + ' ' + (e && e.stack || e)); } catch(_){} } }
}
let autoT = 0;
/** Les gardiens récoltent tout seuls (en silence, avec un petit effet si le bâtiment est à l'écran). */
// Toutes les 3 s (vraie horloge) : les gardiens rangent la production dans le stock. Si le stock est plein,
// ils le disent (bulle « Stock plein » sur le bâtiment) et gardent tout dans leur réserve jusqu'à ce qu'il y ait de la place.
const keeperFull = new Set();
function autoCollect(quiet){
  const got = {};
  for (const o of S.objs){
    if (!o.keeper || B(o).kind !== 'prod' || !built(o) || o.up) continue;
    const k = B(o).res, n = T.stored(S, o); if (n < 1) { keeperFull.delete(o); continue; }
    const g = T.collect(S, o);
    if (g === -1){ if (!keeperFull.has(o) && !quiet) toastOnce(`${(KEEPER[o.type] || KEEPER.cabin).name} attend : stock de ${ITEMS[k].name.toLowerCase()} plein`); keeperFull.add(o); continue; }
    keeperFull.delete(o);
    if (g > 0){ T.track(S, 'collect:' + k, g); got[k] = (got[k] || 0) + g; if (!quiet){ const c = toScreen(o.x + 1.5, o.y + 1.5); if (c.x > 0 && c.x < W && c.y > 0 && c.y < H) fxHarvest(o, k, g); } if (T.stored(S, o) > 0 && T.cap(S, k) <= S[k]) keeperFull.add(o); }
  }
  return got;
}
const built = o => !o.build;
/* ---------- village vivant : fumée des bâtiments qui travaillent (Township / Hay Day) ---------- */
const working = o => { const b = B(o); if (o.build || o.up || o.wild || o.free) return false;
  if (b.kind === 'prod') return !!o.job || T.stored(S, o) < (o.keeper ? T.keeperBuffer(o) : T.buffer(o.type, o.lv));
  if (b.kind === 'craft') return (o.q || []).some(j => j.end > now());
  if (b.kind === 'lab') return !!S.rsRun; if (b.kind === 'train') return !!(S.train && S.train.back > now()); return b.kind === 'hq' || b.kind === 'house' || b.kind === 'mine' || b.kind === 'orders' || b.kind === 'storage'; };
let smokeT = 0;
// position de la cheminée sur l'image du bâtiment (mesurée sur les rendus)
// sommet de chaque cheminée, mesuré sur les images (type → [apparence 1, 2, 3], null = pas de cheminée)
const CHIMNEY = {
  santa: [[.57, .15], [.59, .12], [.56, .11]], cabin: [[.51, .15], [.6, .15], [.6, .15]], workshop: [[.52, .16], [.56, .13], [.56, .13]],
  bakery: [[.51, .24], [.56, .21], [.49, .22]], mill: [null, [.5, .15], [.55, .12]], letters: [null, [.49, .17], [.54, .14]],
  orders: [null, [.51, .16], [.56, .13]], storage: [[.46, .22], [.51, .14], null],
};
/* ---------- animations propres à chaque bâtiment (Township / Hay Day) ---------- */
// lueurs : four du boulanger, forge de la fonderie, fenêtres de la bibliothèque (position relative à l'image, couleur, taille)
const GLOWS = {bakery: [.5, .66, '255,140,40', .2], foundry: [.42, .62, '255,110,20', .32], library: [.47, .55, '255,220,120', .16], icewell: [.5, .55, '120,220,255', .2]};
function bldGlow(o){
  const g = GLOWS[o.type], r = objScreenRect(o), t = performance.now() / 1000, fl = .75 + .25 * Math.sin(t * 7 + o.x) * Math.sin(t * 3.1 + o.y), R = r.width * g[3] * (.9 + .15 * fl);
  const x = r.left + r.width * g[0], y = r.top + r.height * g[1], gr = ctx.createRadialGradient(x, y, 0, x, y, R);
  gr.addColorStop(0, `rgba(${g[2]},${.7 * fl})`); gr.addColorStop(1, `rgba(${g[2]},0)`);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = gr; ctx.fillRect(x - R, y - R, R * 2, R * 2); ctx.restore();
}
let bfxT = 0;
function bldFx(dt){
  bfxT -= dt; if (bfxT > 0 || cam.z < .45) return; bfxT = .18;
  if (FX.length > 160) return;
  const z = cam.z, rnd = (a, b) => a + Math.random() * (b - a);
  for (const o of S.objs){
    if (o.wild || o.free || o.build || o.up) continue;
    const ty = o.type, b = B(o); if (!['sawmill', 'letters', 'mill', 'icewell', 'foundry', 'library', 'workshop', 'theater', 'mine'].includes(ty)) continue;
    const show = ty === 'theater' && S.show && S.show.end > now();
    if (ty === 'theater' ? !show : !working(o)) continue;
    const r = objScreenRect(o); if (r.cx < -60 || r.cx > W + 60 || r.top < -100 || r.top > H + 40) continue;
    const X = (a) => r.left + r.width * a, Y = (a) => r.top + r.height * a;
    if (ty === 'sawmill' && Math.random() < .7) FX.push({k: 'chip', x: X(rnd(.35, .6)), y: Y(.58), vx: rnd(-50, 50) * z, vy: rnd(-110, -60) * z, r: rnd(1.6, 2.8) * z, c: Math.random() < .5 ? '#c98a4b' : '#e8c48a', t: 0, d: .9});
    else if (ty === 'foundry' && Math.random() < .8) FX.push({k: 'chip', glow: 1, x: X(rnd(.38, .5)), y: Y(.5), vx: rnd(-25, 25) * z, vy: rnd(-90, -50) * z, g: -10, r: rnd(2.6, 4.2) * z, t: 0, d: 1.3});
    else if (ty === 'letters' && Math.random() < .14) FX.push({k: 'env', x: X(rnd(.4, .6)), y: Y(.35), vx: rnd(-6, 6), vy: -26 * z, ph: Math.random() * 6, t: 0, d: 2.6});
    else if (ty === 'library' && Math.random() < .16) FX.push({k: 'page', x: X(rnd(.35, .6)), y: Y(.38), vx: rnd(-6, 6), vy: -22 * z, ph: Math.random() * 6, t: 0, d: 2.8});
    else if (ty === 'theater' && Math.random() < .3) FX.push({k: 'note', x: X(rnd(.35, .65)), y: Y(.4), vx: rnd(-8, 8), vy: -30 * z, ph: Math.random() * 6, c: ['#d33', '#2a7de1', '#1f8a3a', '#8a3ad3'][Math.floor(Math.random() * 4)], t: 0, d: 2.2});
    else if ((ty === 'icewell' || ty === 'mine') && Math.random() < .5) FX.push({k: 'twinkle', x: X(rnd(.3, .7)), y: Y(rnd(.45, .7)), vx: 0, vy: -14 * z, r: rnd(2.4, 4) * z, c: '#e8f8ff', t: 0, d: 1.1});
    else if (ty === 'workshop' && Math.random() < .45) FX.push({k: 'twinkle', x: X(rnd(.3, .7)), y: Y(rnd(.35, .6)), vx: 0, vy: -12 * z, r: rnd(2.4, 4) * z, c: '#ffe27a', t: 0, d: 1});
    else if (ty === 'mill' && Math.random() < .35) FX.push({k: 'chip', x: X(rnd(.35, .65)), y: Y(.55), vx: rnd(-20, 20) * z, vy: rnd(-40, -20) * z, g: -6, r: rnd(1.4, 2.2) * z, c: ['#e05a7a', '#4a9de0', '#f2c94c', '#6fcf97'][Math.floor(Math.random() * 4)], t: 0, d: 1.6});
  }
}
function smoke(dt){
  smokeT -= dt; if (smokeT > 0 || cam.z < .45) return; smokeT = .22;
  if (FX.filter(f => f.k === 'smoke').length > 40) return;
  for (const o of S.objs){
    if (!CHIMNEY[o.type] || Math.random() > .55 || !working(o)) continue;
    const r = objScreenRect(o); if (r.cx < -50 || r.cx > W + 50 || r.top < -80 || r.top > H) continue;
    const at = CHIMNEY[o.type]?.[tierOf(o.lv || 1) - 1]; if (!at) continue; const x = r.left + r.width * at[0], y = r.top + r.height * (at[1] + .03);
    FX.push({k: 'smoke', x: x + (Math.random() - .5) * 6, y, vx: 6 + Math.random() * 8, vy: -16 - Math.random() * 10, r: (9 + Math.random() * 5) * cam.z, t: 0, d: 2.4 + Math.random()});
  }
}
const PROF = /[?&]prof/.test(location.search) ? (window.__prof = {}) : null;
const pt = (k, f) => { if (!PROF) return f(); const a = performance.now(); const r = f(); const e = PROF[k] ||= {n: 0, t: 0, max: 0}, d = performance.now() - a; e.n++; e.t += d; e.max = Math.max(e.max, d); return r; };
// sonde : une image sur 90, on note tout dessin d'image qui couvre une grande partie de l'écran (pour trouver le flou)
window.__big = []; let probeN = 0;
const rawDraw = CanvasRenderingContext2D.prototype.drawImage;
function probe(on){
  if (!on){ ctx.drawImage = rawDraw; return; }
  ctx.drawImage = function(im, ...a){ const dw = a.length >= 4 ? a[a.length - 2] : (im.width || 0), dh = a.length >= 4 ? a[a.length - 1] : (im.height || 0);
    if (dw * dh > W * H * .35){ const st = (new Error().stack || '').split('\n').slice(1, 4).map(l => (l.match(/(\w+)@|at (\w+)/) || [])[1] || l.trim().slice(0, 30)).join('<');
      const rec = `${Math.round(dw)}x${Math.round(dh)} a${ctx.globalAlpha.toFixed(2)} ${ctx.globalCompositeOperation} src${im.width || im.naturalWidth}x${im.height || im.naturalHeight} ${st}`; if (!__big.includes(rec)){ __big.push(rec); if (__big.length > 12) __big.shift(); } }
    return rawDraw.call(this, im, ...a); };
}
function step(t, dt){
  step1(t, dt);
}
function step1(t, dt){
  if (PROF) return pt('step', () => step0(t, dt));
  step0(t, dt);
}
function step0(t, dt){
  glideStep(); smoke(dt); bldFx(dt);
  if (performance.now() >= autoT){ autoT = performance.now() + 3000; autoCollect(); checkExps(); dropTick(); rsCheck(); if (!tuto.active()){ const had = !!S.visitor; T.visitorTick(S, now()); if (!had && S.visitor){ toast(`${S.visitor.who} arrive au village !`); sfx.pop(); } } }
  fxDt = dt;
  pt('logic', () => { refreshOrders(); finishWorks(); moveElves(dt); });
  for (const f of flakes){ f.y += f.v * dt * .12; f.x += Math.sin(t / 1000 + f.s * 7) * dt * .01; if (f.y > 1) { f.y = 0; f.x = Math.random(); } }
  pt('draw', draw);
  hudT -= dt; if (hudT <= 0){ hudT = .2; pt('hud', hud); }
  panelT -= dt; if (panel && panelT <= 0 && !sheetHeld()){ panelT = .3; pt('panel', renderPanel); }
  saveT -= dt; if (saveT <= 0){ saveT = 4; save(); }
}
requestAnimationFrame(frame);
addEventListener('visibilitychange', () => { if (document.hidden) save(); });
addEventListener('pointerdown', () => sfx.tap(), {once: true});
// entrée directe dans le village (pas de menu titre)
// Pendant ton absence : les gardiens ont travaillé (comme l'écran de retour de Clash of Clans / Township)
function welcomeBack(){
  const away = now() - (saved?.t || now()); const got = autoCollect(true);
  if (!Object.keys(got).length || away < 5 * 60e3 || tuto.active()) return;
  const h = Math.floor(away / 36e5), m = Math.round(away % 36e5 / 6e4);
  bravo(got, `Pendant ton absence (${h ? h + ' h ' : ''}${m} min), tes gardiens ont récolté`, 'BON RETOUR !');
}
setTimeout(welcomeBack, 1400);
setTimeout(() => { $('#intro').classList.add('hide'); document.body.classList.add('playing'); setTimeout(() => $('#intro').remove(), 700); if (tuto.active()){ const BACK = {5: 4, 7: 6, 9: 8, 10: 8}; if (BACK[S.tuto]) S.tuto = BACK[S.tuto]; if (!S.tuto && !S.introSeen) setTimeout(() => cinema(INTRO, () => { S.introSeen = 1; save(); setTimeout(() => tuto.start(), 500); }, 'Le Village du Pôle'), 600); else setTimeout(() => tuto.start(), 700); } }, 400);
if ('serviceWorker' in navigator && location.protocol === 'https:' && !/claude\.ai|claudeusercontent/.test(location.host)) navigator.serviceWorker.register('sw.js').catch(() => {});
window.__v2 = {get S(){ return S; }, fits, startPlace: (t, x, y) => { ghost = {type: t, x, y}; showGhostUI(); }, get glide(){ return glide; }, get hold(){ return tutoHold - performance.now(); }, reminders: () => { armReminders(); const n = remindT.length; clearReminders(); return n; }, notify, cam, SPR, openPanel, tuto, screen: toScreen, centerOn, ICON, hud, gainXp, T, ripe, autoCollect, get autoT(){ return autoT; }};
// sauvegarde : ouvrir un fichier
document.addEventListener('change', e => { if (e.target.id !== 'loadfile' || !e.target.files?.[0]) return; e.target.files[0].text().then(saveLoad); });
window.__pan = (x, y) => panTo(x, y);
