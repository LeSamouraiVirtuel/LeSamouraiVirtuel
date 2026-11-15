// ESSAI — Vue du territoire troll : la montagne, les camps (repris / à attaquer / encore violets), leur force,
// et la progression du joueur. Toucher un camp : sa fiche ; « Attaquer » lance la VRAIE bataille du jeu.
const E = () => window.__ess;
export function openCamps(){
  const {S, T} = E(), C = T.campState(S), total = 40;
  const ov = document.createElement('div'); ov.className = 'xpov';
  ov.innerHTML = `<header><h2>Territoire des trolls</h2><span id="cprog"></span><button data-x="close">Fermer</button></header><canvas></canvas>`;
  document.body.appendChild(ov);
  const cv = ov.querySelector('canvas'), x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  ov.querySelector('#cprog').innerHTML = `<b>${C.at}</b> / ${total} camps repris`;
  let W = 0, H = 0, MAPH = 0, scroll = 0, t0 = performance.now(), sel = null, raf = 0;
  const nodes = [];
  const layout = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    MAPH = Math.max(H * 3.2, total * 90); nodes.length = 0;
    for (let i = 0; i < total; i++){ const k = i / (total - 1); nodes.push({i, x: W / 2 + Math.sin(k * 11) * W * .28 + Math.sin(k * 29) * W * .05, y: MAPH - 90 - k * (MAPH - 200)}); }
    scroll = Math.max(0, Math.min(MAPH - H, nodes[Math.min(C.at, total - 1)].y - H * .6)); };
  layout(); addEventListener('resize', layout);
  const mtn = Array.from({length: 4}, (_, l) => Array.from({length: 14}, (_, j) => Math.random()));
  function draw(){
    raf = requestAnimationFrame(draw); const t = (performance.now() - t0) / 1000;
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#120f35'); g.addColorStop(.5, '#2b2063'); g.addColorStop(1, '#3b5a8f'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    // aurores
    x.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++){ x.beginPath(); for (let px = 0; px <= W; px += 14){ const py = 40 + k * 26 + Math.sin(px * .008 + t * .4 + k) * 18; px ? x.lineTo(px, py) : x.moveTo(px, py); } x.lineTo(W, 0); x.lineTo(0, 0); x.closePath();
      x.fillStyle = ['rgba(90,255,180,.18)', 'rgba(140,120,255,.16)', 'rgba(230,110,255,.12)'][k]; x.fill(); }
    x.globalCompositeOperation = 'source-over';
    // montagnes en couches (parallaxe)
    mtn.forEach((m, l) => { const off = -scroll * (.15 + l * .12), base = H * (.35 + l * .17) + off * .2; x.beginPath(); x.moveTo(0, H);
      m.forEach((v, j) => x.lineTo(j / (m.length - 1) * W, base - v * 120 + (j % 2) * 30)); x.lineTo(W, H); x.closePath();
      x.fillStyle = ['#2c2a5e', '#3a3f7c', '#556aa8', '#dfe8f7'][l]; x.globalAlpha = l === 3 ? .25 : .9; x.fill(); x.globalAlpha = 1; });
    x.save(); x.translate(0, -scroll);
    // chemin
    x.lineWidth = 10; x.lineCap = 'round'; x.strokeStyle = 'rgba(255,255,255,.18)'; x.beginPath(); nodes.forEach((n, i) => i ? x.lineTo(n.x, n.y) : x.moveTo(n.x, n.y)); x.stroke();
    x.lineWidth = 6; x.strokeStyle = '#ffd34a'; x.setLineDash([2, 12]); x.beginPath(); nodes.slice(0, C.at + 1).forEach((n, i) => i ? x.lineTo(n.x, n.y) : x.moveTo(n.x, n.y)); x.stroke(); x.setLineDash([]);
    // régions
    for (let r = 0; r < total / 10; r++){ const n = nodes[r * 10]; x.font = '400 16px "Lilita One", sans-serif'; x.fillStyle = 'rgba(255,255,255,.75)'; x.textAlign = 'left'; x.fillText(T.CHAPTERS_CAMP[r % T.CHAPTERS_CAMP.length], 14, n.y + 6); }
    // camps
    for (const n of nodes){ const c = T.camp(n.i), done = n.i < C.at, cur = n.i === C.at, r = c.boss ? 26 : 17;
      if (n.y - scroll < -60 || n.y - scroll > H + 60) continue;
      if (cur){ const pr = r + 10 + Math.sin(t * 4) * 5; x.fillStyle = 'rgba(190,90,255,.35)'; x.beginPath(); x.arc(n.x, n.y, pr, 0, 7); x.fill(); }
      // camp : tente / forteresse
      x.fillStyle = done ? '#3fbf6a' : cur ? '#b25cff' : '#5a3a8a'; x.strokeStyle = '#120a20'; x.lineWidth = 3;
      x.beginPath(); if (c.boss){ x.moveTo(n.x - r, n.y + r * .6); x.lineTo(n.x - r, n.y - r * .3); x.lineTo(n.x - r * .5, n.y - r * .3); x.lineTo(n.x - r * .5, n.y - r * .7); x.lineTo(n.x + r * .5, n.y - r * .7); x.lineTo(n.x + r * .5, n.y - r * .3); x.lineTo(n.x + r, n.y - r * .3); x.lineTo(n.x + r, n.y + r * .6); }
      else { x.moveTo(n.x - r, n.y + r * .6); x.lineTo(n.x, n.y - r); x.lineTo(n.x + r, n.y + r * .6); } x.closePath(); x.fill(); x.stroke();
      if (done){ x.strokeStyle = '#fff'; x.lineWidth = 2; x.beginPath(); x.moveTo(n.x + 4, n.y - r - 2); x.lineTo(n.x + 4, n.y - r - 22); x.stroke(); x.fillStyle = '#e8323f'; x.beginPath(); x.moveTo(n.x + 4, n.y - r - 22); x.lineTo(n.x + 20, n.y - r - 16); x.lineTo(n.x + 4, n.y - r - 10); x.fill();
        const st = C.st[n.i] || 0; x.font = '14px sans-serif'; x.textAlign = 'center'; x.fillStyle = '#ffd34a'; x.fillText('★'.repeat(st) + '☆'.repeat(3 - st), n.x, n.y + r + 16); }
      else { x.font = '700 12px Fredoka, sans-serif'; x.textAlign = 'center'; x.fillStyle = cur ? '#fff' : 'rgba(255,255,255,.7)'; x.fillText(`${c.n} trolls${c.boss ? ' + chef' : ''}`, n.x, n.y + r + 15); }
      if (sel === n.i){ x.strokeStyle = '#ffd34a'; x.lineWidth = 3; x.beginPath(); x.arc(n.x, n.y, r + 14, 0, 7); x.stroke(); } }
    // le Père Noël sur la carte
    { const n = nodes[Math.min(C.at, total - 1)], by = n.y + 8 + Math.sin(t * 3) * 4; x.fillStyle = '#e8323f'; x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath(); x.arc(n.x - 34, by, 13, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#fff'; x.beginPath(); x.arc(n.x - 34, by + 7, 8, 0, Math.PI); x.fill(); x.font = '700 11px Fredoka'; x.textAlign = 'center'; x.fillStyle = '#ffd34a'; x.fillText('TOI', n.x - 34, by - 18); }
    x.restore();
  }
  draw();
  let dragY = null, moved = 0;
  cv.addEventListener('pointerdown', e => { dragY = e.clientY; moved = 0; });
  addEventListener('pointermove', e => { if (dragY == null) return; const d = e.clientY - dragY; moved += Math.abs(d); dragY = e.clientY; scroll = Math.max(0, Math.min(MAPH - H, scroll - d)); });
  addEventListener('pointerup', e => { if (dragY == null) return; dragY = null; if (moved > 8) return;
    const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top + scroll;
    const n = nodes.find(n => Math.hypot(n.x - px, n.y - py) < 34); if (n) card(n.i); });
  function card(i){
    sel = i; ov.querySelector('.xcard')?.remove(); const c = T.camp(i), done = i < C.at, cur = i === C.at;
    const el = document.createElement('div'); el.className = 'xcard';
    el.innerHTML = `<h3>${c.name}</h3><p>${done ? `✅ Repris · ${'★'.repeat(C.st[i] || 0)}` : cur ? '🟣 Prochain camp à attaquer' : '🔒 Encore aux mains des trolls'}</p>
      <p>Force : <b>${c.n} trolls</b>${c.boss ? ` et leur <b>chef</b> (${c.bossHp} points de vie)` : ''} · attaque ${c.atk.toFixed(1)}</p>
      <p>Coût de l'attaque : ${Object.entries(T.campCost(i)).map(([k, v]) => `${v} ${k === 'cookies' ? 'biscuits' : k}`).join(', ')}</p>
      <div class="row">${cur || done ? `<button class="xbtn g" data-x="go">${done ? 'Rejouer' : 'Attaquer'}</button>` : ''}<button class="xbtn b" data-x="nope">Fermer</button></div>`;
    ov.appendChild(el);
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-x]'); if (!b) return; if (b.dataset.x === 'nope'){ el.remove(); sel = null; return; }
      close(); E().campGo(i); });
  }
  const close = () => { cancelAnimationFrame(raf); ov.remove(); removeEventListener('resize', layout); };
  ov.querySelector('[data-x=close]').onclick = close;
}
