// ESSAI — Transition de niveau de la Maison (13 → 14) : une cinématique DANS le moteur (caméra, dialogues),
// une mini-épreuve unique « Le traîneau des lanternes », des récompenses et une étape du lore débloquée.
const E = () => window.__ess;
export function openTransition(){
  const {S, cinema} = E();
  const lv = (S.objs.find(o => o.type === 'santa')?.lv || 13) + 1;
  cinema([
    {who: 'Narrateur', say: `La Maison du Père Noël grandit : niveau ${lv} ! Mais cette nuit, les trolls ont éteint les lanternes du village…`, at: 'santa', zoom: .8},
    {who: 'Krampus des Glaces', say: 'Hé hé… sans lumière, tes rennes ne trouveront jamais le chemin. Le Noël de cette année sera tout noir !', villain: 1, at: [14, 12], zoom: .6},
    {who: 'Le vieux Père Noël', say: 'Vite ! Prends le traîneau, attrape les lanternes qui tombent du ciel, et évite les boules de neige violettes des trolls.', at: 'santa', zoom: 1},
  ], () => epreuve(lv), `Maison niveau ${lv}`);
}
const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
let ART = null;
async function art(){
  if (ART) return ART; ART = {};
  const j = await (await fetch('pack2/carte.json', {cache: 'no-store'})).json(), P = await (await fetch('../assets/pack/pack.json')).json();
  for (const k of ['equipe', 'lanterne', 'boule']) ART[k] = {...j[k], img: await loadImg('pack2/' + j[k].f)};
  ART.sky = [];
  for (const k of ['b:wildtree', 'b:cabin:2', 'b:bakery:3', 'b:wildtree2', 'b:santa:3', 'b:cabin:3', 'b:workshop:3', 'b:wildtree', 'b:letters:2', 'b:cabin:2', 'b:wildtree2']){ const m = P.spr[k]; if (m) ART.sky.push({...m, img: await loadImg('../assets/pack/' + m.f)}); }
  return ART;
}
async function epreuve(lv){
  const A = await art();
  const ov = document.createElement('div'); ov.className = 'xpov';
  ov.innerHTML = `<header><h2>Le traîneau des lanternes</h2><span id="tinfo"></span></header><canvas></canvas><p class="xhint">Glisse pour diriger le traîneau</p>`;
  document.body.appendChild(ov);
  const cv = ov.querySelector('canvas'), x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), info = ov.querySelector('#tinfo');
  let W, H; const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }; size();
  const K = Math.min(2.2, Math.max(1.15, Math.min(W / 520, H / 520)));                 // échelle des visuels
  const sl = {x: W / 2, tx: W / 2}, items = [], snow = Array.from({length: 110}, () => ({x: Math.random(), y: Math.random(), z: Math.random()}));
  let caught = 0, hearts = 3, time = 30, spawn = 0, last = performance.now(), over = false, raf = 0, flash = 0, pops = [];
  const GOAL = 15;
  const move = e => { const r = cv.getBoundingClientRect(); sl.tx = e.clientX - r.left; };
  cv.addEventListener('pointermove', move); cv.addEventListener('pointerdown', move);
  const draw = (sp, cx, cy, s = 1) => sp?.img && x.drawImage(sp.img, cx - sp.ax * s, cy - sp.ay * s, sp.w * s, sp.h * s);
  function loop(now){
    raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; const t = now / 1000; if (over) return;
    time -= dt; spawn -= dt; sl.x += (sl.tx - sl.x) * Math.min(1, dt * 10);
    if (spawn <= 0){ spawn = .45 + Math.random() * .35; const bad = Math.random() < .3; items.push({x: 40 + Math.random() * (W - 80), y: -40, v: (bad ? 200 : 150) + Math.random() * 90 + (30 - time) * 4, bad, r: Math.random() * 6}); }
    // ciel de nuit du jeu : dégradé, aurores, étoiles
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b1240'); g.addColorStop(.6, '#25357a'); g.addColorStop(1, '#4a5fa6'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++){ x.beginPath(); for (let px = 0; px <= W; px += 14){ const py = H * (.12 + k * .06) + Math.sin(px * .007 + t * .35 + k * 1.7) * 22 + Math.sin(px * .017 - t * .5) * 8; px ? x.lineTo(px, py) : x.moveTo(px, py); } x.lineTo(W, 0); x.lineTo(0, 0); x.closePath();
      const ag = x.createLinearGradient(0, 0, 0, H * .4); ag.addColorStop(0, 'rgba(0,0,0,0)'); ag.addColorStop(.75, ['rgba(80,255,170,.35)', 'rgba(120,150,255,.3)', 'rgba(220,110,255,.24)'][k]); ag.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = ag; x.fill(); }
    x.globalCompositeOperation = 'source-over';
    // le village endormi en bas (images du jeu), fenêtres chaudes
    const baseY = H - 18; let px = -40;
    for (const sp of A.sky){ const s = .5 * K; draw(sp, px + sp.ax * s, baseY, s); px += sp.w * s * .62; if (px > W + 40) break; }
    x.fillStyle = 'rgba(15,22,60,.45)'; x.fillRect(0, 0, W, H);   // nuit sur le village
    x.fillStyle = '#eef4fc'; x.fillRect(0, H - 22, W, 22);
    // neige
    x.fillStyle = '#fff'; for (const f of snow){ f.y += dt * (.05 + f.z * .08); if (f.y > 1) f.y = 0; x.globalAlpha = .5 + f.z * .5; x.beginPath(); x.arc(f.x * W, f.y * H, 1 + f.z * 2, 0, 7); x.fill(); } x.globalAlpha = 1;
    // lanternes (lumineuses) et boules de neige violettes des trolls
    for (let i = items.length - 1; i >= 0; i--){ const it = items[i]; it.y += it.v * dt;
      const sy = H - 120 * K;
      if (it.y > sy - 30 * K && it.y < sy + 20 * K && Math.abs(it.x - sl.x) < 75 * K){ items.splice(i, 1);
        if (it.bad){ hearts--; flash = .45; E().sfx?.err?.(); } else { caught++; E().sfx?.collect?.(); pops.push({x: it.x, y: it.y, l: 0}); } continue; }
      if (it.y > H + 40){ items.splice(i, 1); continue; }
      if (!it.bad){ const L = A.lanterne, ls = .75 * K, gx = it.x - L.ax * ls + L.w * ls * .62, gy = it.y + 22 * K - L.ay * ls + L.h * ls * .68; x.globalCompositeOperation = 'lighter'; const gl = x.createRadialGradient(gx, gy, 0, gx, gy, 46 * K); gl.addColorStop(0, 'rgba(255,200,90,.6)'); gl.addColorStop(1, 'rgba(255,150,50,0)'); x.fillStyle = gl; x.beginPath(); x.arc(gx, gy, 46 * K, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over';
        x.save(); x.translate(it.x, it.y); x.rotate(Math.sin(t * 3 + it.r) * .25); draw(A.lanterne, 0, 22 * K, .75 * K); x.restore(); }
      else draw(A.boule, it.x, it.y + 14 * K, .8 * K); }
    // étincelles de lanterne attrapée
    for (let i = pops.length - 1; i >= 0; i--){ const p = pops[i]; p.l += dt; if (p.l > .6){ pops.splice(i, 1); continue; } x.globalCompositeOperation = 'lighter'; x.fillStyle = `rgba(255,220,120,${1 - p.l / .6})`; for (let k = 0; k < 8; k++){ const a = k / 8 * 6.28; x.beginPath(); x.arc(p.x + Math.cos(a) * p.l * 90, p.y + Math.sin(a) * p.l * 90, 3, 0, 7); x.fill(); } x.globalCompositeOperation = 'source-over'; }
    // le traîneau du jeu, tiré par les rennes, qui se penche dans les virages
    x.save(); x.translate(sl.x, H - 92 * K + Math.sin(t * 6) * 3); x.rotate(Math.max(-.25, Math.min(.25, (sl.tx - sl.x) * .004))); draw(A.equipe, 0, 0, 1.0 * K); x.restore();
    if (flash > 0){ x.fillStyle = `rgba(155,77,255,${flash})`; x.fillRect(0, 0, W, H); flash -= dt; }
    info.innerHTML = `🏮 <b>${caught}</b> / ${GOAL} &nbsp; ${'❤'.repeat(Math.max(0, hearts))} &nbsp; ⏱ ${Math.max(0, Math.ceil(time))} s`;
    if (caught >= GOAL || hearts <= 0 || time <= 0) finish();
  }
  raf = requestAnimationFrame(loop);
  function finish(){
    over = true; cancelAnimationFrame(raf);
    const ok = caught >= GOAL, stars = ok ? (hearts >= 3 ? 3 : hearts === 2 ? 2 : 1) : 0;
    const el = document.createElement('div'); el.className = 'xcard';
    el.innerHTML = ok ? `<h3>Lanternes rallumées ! ${'★'.repeat(stars)}</h3><p>Le village brille à nouveau, et la Maison passe au niveau ${lv}.</p><p>📜 <b>Lore débloqué :</b> « La nuit des lanternes »</p><div class="row"><button class="xbtn g" data-x="ok">Fêter ça</button></div>`
      : `<h3>Presque !</h3><p>${caught} lanternes sur ${GOAL}. Les trolls ont gagné cette fois… Réessaie !</p><div class="row"><button class="xbtn g" data-x="again">Réessayer</button><button class="xbtn b" data-x="quit">Quitter</button></div>`;
    ov.appendChild(el);
    el.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; ov.remove();
      if (b.dataset.x === 'again') return epreuve(lv);
      if (b.dataset.x === 'ok'){ const {S, bravo, centerOn, toScreen} = E(); (S.xpLore ||= {}).lanternes = Date.now();
        const h = S.objs.find(o => o.type === 'santa'); if (h){ centerOn(h.x + 2, h.y + 2); let n = 0; const fw = setInterval(() => { const c = toScreen(h.x + 2, h.y + 2); window.__fx?.burst(c.x + (Math.random() - .5) * 160, c.y - 120 - Math.random() * 80, ['#ffd34a', '#ff7a8a', '#7dffb0', '#9bb8ff']); if (++n > 12) clearInterval(fw); }, 220); }
        bravo({stars: 5 * stars, coins: 4000 * stars, xp: 200}, '« La nuit des lanternes » ajoutée au livre des légendes', `MAISON NIV. ${lv} !`); } });
  }
}
