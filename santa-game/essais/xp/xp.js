// ESSAIS dans le vrai moteur du jeu : bouton AVANT / APRÈS qui bascule en direct.
// APRÈS = éclairage selon l'heure (crépuscule chaud, nuit bleue, fenêtres et lanternes qui rayonnent), ombres douces,
// neige en particules, fumée des cheminées, brillances sur la neige, aurores, traîneau dans le ciel, effets de récolte.
// Rien de tout ça n'est dans le jeu en ligne : c'est une copie de test (essais/), sans compte ni écriture en ligne.
const FX = window.__fx = {on: true, hour: null, t0: performance.now()};
const E = () => window.__ess;
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- interface des essais ---------- */
const bar = document.createElement('div'); bar.id = 'xpbar';
bar.innerHTML = `<button class="xptog" data-x="tog">ESSAIS ▾</button><div class="xpbody"><div class="xprow"><div class="seg"><button data-x="avant">Avant</button><button data-x="apres" class="on">Après</button></div>
  <label class="hr">🕒 <input type="range" min="0" max="24" step=".25" value="17.5" id="xphour"><span id="xphl">17 h 30</span></label></div>
  <div class="xprow"><button data-x="camps">🗺️ Camps trolls</button><button data-x="trans">🏠 Transition</button><button data-x="lore">📜 Lore</button></div></div>`;
if (innerWidth < 560) bar.classList.add('fold');
document.body.appendChild(bar);
const setHour = h => { FX.hour = h; window.__xpHour = h; document.getElementById('xphl').textContent = `${Math.floor(h)} h ${String(Math.round((h % 1) * 60)).padStart(2, '0')}`; };
setHour(17.5);
bar.addEventListener('input', e => { if (e.target.id === 'xphour') setHour(+e.target.value); });
bar.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; const x = b.dataset.x;
  if (x === 'tog'){ bar.classList.toggle('fold'); return; }
  if (x === 'avant' || x === 'apres'){ FX.on = x === 'apres'; bar.querySelectorAll('.seg button').forEach(k => k.classList.toggle('on', k.dataset.x === x)); document.body.classList.toggle('xp-on', FX.on); }
  if (x === 'camps') import('./camps.js').then(m => m.openCamps());
  if (x === 'trans') import('./transition.js').then(m => m.openTransition());
  if (x === 'lore') import('./lore.js').then(m => m.openLore());
});
document.body.classList.add('xp-on');

/* ---------- lumière selon l'heure ---------- */
function light(){
  const h = FX.hour ?? new Date().getHours();
  // 0 = plein jour, 1 = nuit ; « or » = lumière dorée du crépuscule et de l'aube
  const night = h < 6 || h >= 19 ? 1 : h < 8 ? (8 - h) / 2 : h >= 17.5 ? (h - 17.5) / 1.5 : 0;
  const gold = h >= 15 && h < 19 ? 1 - Math.abs(h - 17) / 2 : h >= 6 && h < 9 ? 1 - Math.abs(h - 7.5) / 1.5 : 0;
  return {night: Math.max(0, Math.min(1, night)), gold: Math.max(0, gold)};
}

/* ---------- particules ---------- */
const snow = Array.from({length: 220}, () => ({x: Math.random(), y: Math.random(), z: rnd(.35, 1), s: rnd(0, 6.28)}));
const smoke = [], sparks = [], bursts = [];
const glowCv = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,205,120,1)'); g.addColorStop(.35, 'rgba(255,170,80,.45)'); g.addColorStop(1, 'rgba(255,150,60,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c; })();
const puffCv = (() => { const c = document.createElement('canvas'); c.width = c.height = 48; const x = c.getContext('2d'), g = x.createRadialGradient(24, 24, 0, 24, 24, 24);
  g.addColorStop(0, 'rgba(240,244,250,.85)'); g.addColorStop(.6, 'rgba(225,232,242,.35)'); g.addColorStop(1, 'rgba(220,228,240,0)'); x.fillStyle = g; x.fillRect(0, 0, 48, 48); return c; })();
const CHIMNEY = {santa: [.62, .1], cabin: [.62, .14], bakery: [.55, .12], workshop: [.6, .12], letters: [.5, .2], orders: [.5, .2], mill: [.5, .2], library: [.55, .14], theater: [.55, .18], station: [.55, .2]};
let last = performance.now(), emitT = 0, sleighT = -999;

/** dessiné juste avant les bâtiments : ombres douces au sol */
FX.under = (ctx, W, H) => {
  if (!FX.on || !E()) return; const {S, T, toScreen, cam} = E(), L = light();
  ctx.save(); ctx.globalAlpha = .22 + L.gold * .12 - L.night * .1; ctx.fillStyle = '#1b2a55';
  for (const o of S.objs){ const b = T.BUILDINGS[o.type]; if (!b || b.kind === 'path' || o.wild) continue;
    const c = toScreen(o.x + b.w / 2 + .35, o.y + b.h / 2 + .35), rx = (b.w + b.h) * 15 * cam.z, ry = rx * .42;
    ctx.beginPath(); ctx.ellipse(c.x + rx * .18, c.y + ry * .25, rx, ry, 0, 0, 7); ctx.fill(); }
  ctx.restore();
};

/** dessiné après tout le village : lumière, neige, fumée, brillances, aurores */
FX.over = (ctx, W, H) => {
  const now = performance.now(), dt = Math.min(.05, (now - last) / 1000); last = now;
  if (!FX.on || !E()) return;
  const {S, T, toScreen, cam} = E(), L = light(), t = (now - FX.t0) / 1000;
  ctx.save();
  // étalonnage : crépuscule doré, nuit bleu profond avec vignette
  if (L.gold > 0){ ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(255,186,120,${.34 * L.gold})`; ctx.fillRect(0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(255,120,70,${.28 * L.gold})`); g.addColorStop(.5, `rgba(255,170,100,${.12 * L.gold})`); g.addColorStop(1, 'rgba(255,200,140,0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  if (L.night > 0){ ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(70,90,170,${.45 * L.night})`; ctx.fillRect(0, 0, W, H);
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(10,15,45,${.45 * L.night})`);
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
  // aurores (nuit et crépuscule tardif)
  const au = Math.min(1, Math.max(0, L.night - .2) * 1.6);
  if (au > 0){ ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++){ ctx.beginPath(); const y0 = H * (.16 + k * .07);
      for (let x = 0; x <= W; x += 16){ const y = y0 + Math.sin(x * .006 + t * .35 + k * 1.7) * 22 + Math.sin(x * .017 - t * .5) * 8; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.lineTo(W, 0); ctx.lineTo(0, 0); ctx.closePath();
      const g = ctx.createLinearGradient(0, 0, 0, H * .45); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.75, [`rgba(80,255,170,${.42 * au})`, `rgba(120,150,255,${.34 * au})`, `rgba(220,110,255,${.28 * au})`][k]); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fill(); } }
  // fenêtres, lanternes et Maison qui rayonnent (plus fort que l'actuel, halos doux)
  const lit = Math.max(L.night, L.gold * .55);
  if (lit > .05){ ctx.globalCompositeOperation = 'lighter';
    for (const o of S.objs){ const b = T.BUILDINGS[o.type]; if (!b || o.wild) continue;
      if (o.type === 'lantern' || o.type === 'lamp'){ const c = toScreen(o.x + .5, o.y + .5), r = 70 * cam.z; ctx.globalAlpha = lit * (.75 + Math.sin(t * 3 + o.x) * .08); ctx.drawImage(glowCv, c.x - r, c.y - 40 * cam.z - r, r * 2, r * 2); continue; }
      if (!CHIMNEY[o.type]) continue; const c = toScreen(o.x + b.w / 2, o.y + b.h / 2), r = (b.w + b.h) * 22 * cam.z;
      ctx.globalAlpha = lit * .38; ctx.drawImage(glowCv, c.x - r, c.y - r * .9, r * 2, r * 1.4); } }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  // fumée des cheminées
  emitT -= dt; if (emitT <= 0){ emitT = .12;
    for (const o of S.objs){ const ch = CHIMNEY[o.type]; if (!ch || o.wild || Math.random() > .5) continue; const b = T.BUILDINGS[o.type], spr = E().SPR[`b:${o.type}`];
      const base = toScreen(o.x + b.w / 2, o.y + b.h / 2), hgt = (spr?.h || 120) * (spr ? cam.z * .5 : cam.z);
      smoke.push({x: base.x + (ch[0] - .5) * (b.w + b.h) * 30 * cam.z, y: base.y - hgt * (1 - ch[1]) * .95, vx: rnd(4, 10), vy: rnd(-18, -12), a: .55, s: rnd(8, 12) * cam.z, life: 0}); } }
  for (let i = smoke.length - 1; i >= 0; i--){ const p = smoke[i]; p.life += dt; p.x += (p.vx + Math.sin(t + i) * 3) * dt; p.y += p.vy * dt; p.s += 9 * dt * cam.z; p.a -= dt * .16;
    if (p.a <= 0){ smoke.splice(i, 1); continue; } ctx.globalAlpha = p.a * (1 - L.night * .35); ctx.drawImage(puffCv, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2); }
  if (smoke.length > 600) smoke.splice(0, smoke.length - 600);
  // brillances sur la neige
  if (Math.random() < .5) sparks.push({x: Math.random() * W, y: H * .2 + Math.random() * H * .8, l: 0});
  ctx.fillStyle = '#fff';
  for (let i = sparks.length - 1; i >= 0; i--){ const s = sparks[i]; s.l += dt; const a = Math.sin(s.l / .9 * Math.PI); if (s.l > .9){ sparks.splice(i, 1); continue; }
    ctx.globalAlpha = a * (.6 + L.night * .4); const r = 1.6 + a * 2.2; ctx.beginPath(); ctx.moveTo(s.x - r * 2, s.y); ctx.lineTo(s.x + r * 2, s.y); ctx.moveTo(s.x, s.y - r * 2); ctx.lineTo(s.x, s.y + r * 2); ctx.strokeStyle = '#fff'; ctx.lineWidth = .9; ctx.stroke(); ctx.beginPath(); ctx.arc(s.x, s.y, r * .45, 0, 7); ctx.fill(); }
  // traîneau du Père Noël qui traverse le ciel (soir et nuit)
  if (L.night > .4 && t - sleighT > 22) sleighT = t;
  { const k = (t - sleighT) / 9; if (k >= 0 && k <= 1){ const x = -80 + k * (W + 160), y = H * .14 + Math.sin(k * 6) * 14, img = E().ICON?.mg_sleigh;
      ctx.globalAlpha = .95; if (img && img.complete !== false) ctx.drawImage(img, x - 30, y - 22, 60, 44);
      ctx.globalCompositeOperation = 'lighter'; for (let j = 1; j < 14; j++){ ctx.globalAlpha = (1 - j / 14) * .7; ctx.fillStyle = '#ffe28a'; ctx.beginPath(); ctx.arc(x - j * 9, y + 8 + Math.sin(j + t * 9) * 3, 2.2 - j * .1, 0, 7); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over'; } }
  // effets de récolte et de construction
  for (let i = bursts.length - 1; i >= 0; i--){ const p = bursts[i]; p.l += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; if (p.l > p.max){ bursts.splice(i, 1); continue; }
    ctx.globalAlpha = 1 - p.l / p.max; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
  // neige qui tombe (trois profondeurs)
  ctx.fillStyle = '#fff';
  for (const f of snow){ f.y += dt * (.035 + f.z * .06); f.x += dt * (Math.sin(t * .6 + f.s) * .012 + .004); if (f.y > 1.02){ f.y = -.02; f.x = Math.random(); } if (f.x > 1.02) f.x = -.02;
    ctx.globalAlpha = .55 + f.z * .4; ctx.beginPath(); ctx.arc(f.x * W, f.y * H, .8 + f.z * 2.2, 0, 7); ctx.fill(); }
  ctx.restore();
};
/** gerbe d'étincelles (récolte, construction) aux coordonnées écran */
FX.burst = (x, y, colors = ['#ffe066', '#ffffff', '#7dffb0']) => { if (!FX.on) return; for (let i = 0; i < 26; i++){ const a = rnd(0, 6.28), v = rnd(60, 220); bursts.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, r: rnd(1.5, 3.5), l: 0, max: rnd(.5, 1), c: colors[i % colors.length]}); } };
// toucher le village : petite gerbe (montre l'effet de récolte)
addEventListener('pointerdown', e => { if (e.target.tagName === 'CANVAS' && FX.on) FX.burst(e.clientX, e.clientY); }, true);
