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
function epreuve(lv){
  const ov = document.createElement('div'); ov.className = 'xpov';
  ov.innerHTML = `<header><h2>Le traîneau des lanternes</h2><span id="tinfo"></span></header><canvas></canvas>`;
  document.body.appendChild(ov);
  const cv = ov.querySelector('canvas'), x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), info = ov.querySelector('#tinfo');
  let W, H; const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }; size();
  const sl = {x: W / 2, w: 86}, items = [], snow = Array.from({length: 90}, () => ({x: Math.random(), y: Math.random(), z: Math.random()}));
  let caught = 0, hearts = 3, time = 30, spawn = 0, last = performance.now(), over = false, raf = 0, flash = 0;
  const GOAL = 15;
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); sl.x = e.clientX - r.left; });
  cv.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); sl.x = e.clientX - r.left; });
  function loop(now){
    raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; if (over) return;
    time -= dt; spawn -= dt;
    if (spawn <= 0){ spawn = .45 + Math.random() * .35; const bad = Math.random() < .3; items.push({x: 30 + Math.random() * (W - 60), y: -20, v: (bad ? 210 : 160) + Math.random() * 90 + (30 - time) * 4, bad}); }
    // dessin
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0d1238'); g.addColorStop(1, '#30407e'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter'; for (let k = 0; k < 2; k++){ x.beginPath(); for (let px = 0; px <= W; px += 16){ const py = 60 + k * 30 + Math.sin(px * .01 + now / 2000 + k) * 16; px ? x.lineTo(px, py) : x.moveTo(px, py); } x.lineTo(W, 0); x.lineTo(0, 0); x.fillStyle = k ? 'rgba(160,110,255,.18)' : 'rgba(90,255,180,.2)'; x.fill(); }
    x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff';
    for (const f of snow){ f.y += dt * (.05 + f.z * .08); if (f.y > 1) f.y = 0; x.globalAlpha = .5 + f.z * .5; x.beginPath(); x.arc(f.x * W, f.y * H, 1 + f.z * 2, 0, 7); x.fill(); } x.globalAlpha = 1;
    // village silhouette
    x.fillStyle = '#0a0d26'; x.beginPath(); x.moveTo(0, H); for (let i = 0; i <= 10; i++){ const hx = i * W / 10; x.lineTo(hx, H - 60 - (i % 3) * 18); x.lineTo(hx + W / 20, H - 90 - (i % 2) * 20); } x.lineTo(W, H); x.fill();
    for (let i = items.length - 1; i >= 0; i--){ const it = items[i]; it.y += it.v * dt;
      if (it.y > H - 92 && it.y < H - 60 && Math.abs(it.x - sl.x) < sl.w / 2 + 12){ items.splice(i, 1);
        if (it.bad){ hearts--; flash = .4; E().sfx?.err?.(); } else { caught++; E().sfx?.collect?.(); } continue; }
      if (it.y > H + 20){ items.splice(i, 1); continue; }
      if (it.bad){ x.fillStyle = '#9b4dff'; x.strokeStyle = '#2a0a4a'; x.lineWidth = 3; x.beginPath(); x.arc(it.x, it.y, 13, 0, 7); x.fill(); x.stroke(); }
      else { x.globalCompositeOperation = 'lighter'; x.fillStyle = 'rgba(255,200,90,.35)'; x.beginPath(); x.arc(it.x, it.y, 24, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over';
        x.fillStyle = '#ffcf4a'; x.strokeStyle = '#6b3a05'; x.lineWidth = 2.5; x.beginPath(); x.roundRect(it.x - 9, it.y - 12, 18, 24, 5); x.fill(); x.stroke(); } }
    // traîneau
    const sy = H - 76; x.fillStyle = '#c8202f'; x.strokeStyle = '#2a0a0a'; x.lineWidth = 3; x.beginPath(); x.roundRect(sl.x - sl.w / 2, sy - 22, sl.w, 30, 10); x.fill(); x.stroke();
    x.strokeStyle = '#ffd34a'; x.lineWidth = 4; x.beginPath(); x.moveTo(sl.x - sl.w / 2 - 8, sy + 14); x.lineTo(sl.x + sl.w / 2 + 6, sy + 14); x.quadraticCurveTo(sl.x + sl.w / 2 + 18, sy + 14, sl.x + sl.w / 2 + 16, sy + 2); x.stroke();
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
      if (b.dataset.x === 'ok'){ const {S, bravo, centerOn, toScreen, T} = E(); (S.xpLore ||= {}).lanternes = Date.now();
        const h = S.objs.find(o => o.type === 'santa'); if (h){ centerOn(h.x + 2, h.y + 2); let n = 0; const fw = setInterval(() => { const c = toScreen(h.x + 2, h.y + 2); window.__fx?.burst(c.x + (Math.random() - .5) * 160, c.y - 120 - Math.random() * 80, ['#ffd34a', '#ff7a8a', '#7dffb0', '#9bb8ff']); if (++n > 12) clearInterval(fw); }, 220); }
        bravo({stars: 5 * stars, coins: 4000 * stars, xp: 200}, '« La nuit des lanternes » ajoutée au livre des légendes', `MAISON NIV. ${lv} !`); } });
  }
}
