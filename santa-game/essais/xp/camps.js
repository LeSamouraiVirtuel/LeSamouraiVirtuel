// ESSAI — Carte de campagne des trolls : une vraie scène rendue avec les modèles du jeu (essais/pack2/carte_*.webp,
// fabriquée par tools/essais-carte.cjs avec bake.js), les camps posés selon la VRAIE progression du joueur,
// feux animés, camp actuel qui pulse, étoiles gagnées, fiche du camp et « Attaquer » qui lance la vraie bataille.
import {CAMPS, iso} from './carte3d-pos.js';
const E = () => window.__ess;
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
export async function openCamps(){
  const {S, T} = E(), C = T.campState(S), region = Math.floor(Math.min(C.at, 39) / 10), first = region * 10;
  const J = await (await fetch('pack2/carte.json', {cache: 'no-store'})).json(), IMG = {};
  for (const [k, v] of Object.entries(J)) IMG[k] = {...v, img: await load('pack2/' + v.f)};
  const ov = document.createElement('div'); ov.className = 'xpov';
  ov.innerHTML = `<header><h2>${T.CHAPTERS_CAMP[region]}</h2><span class="cprog">Région ${region + 1} · <b>${Math.max(0, C.at - first)}</b> / 10 camps repris · ${C.at} au total</span><button data-x="close">Fermer</button></header><canvas></canvas>`;
  document.body.appendChild(ov);
  const cv = ov.querySelector('canvas'), x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  let W, H, k = 1, ox = 0, oy = 0, raf = 0, sel = null, t0 = performance.now();
  const fond = IMG.fond;
  const fit = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    k = Math.max(W / (fond.w * .7), H / (fond.h * .72)); ox = W / 2 - (fond.w / 2) * k; oy = H / 2 - (fond.h * .52) * k; };
  fit(); addEventListener('resize', fit);
  const pos = i => { const [wx, wz] = CAMPS[i]; const [px, py] = iso(fond.ax, fond.ay, wx, wz); return [ox + px * k, oy + py * k]; };
  const stateOf = i => { const g = first + i, boss = i === 9; return g < C.at ? (boss ? 'chefrepris' : 'repris') : (boss ? 'chef' : 'troll'); };
  function draw(){
    raf = requestAnimationFrame(draw); const t = (performance.now() - t0) / 1000;
    x.fillStyle = '#e8f0fb'; x.fillRect(0, 0, W, H);
    x.drawImage(fond.img, ox, oy, fond.w * k, fond.h * k);
    // camps, du fond vers l'avant
    const order = CAMPS.map((c, i) => i).sort((a, b) => (CAMPS[a][0] + CAMPS[a][1]) - (CAMPS[b][0] + CAMPS[b][1]));
    for (const i of order){ const st = stateOf(i), sp = IMG[st], [px, py] = pos(i), g = first + i, cur = g === C.at;
      if (cur){ const pr = 46 * k * 3 + Math.sin(t * 4) * 8; x.save(); x.globalAlpha = .45; x.fillStyle = '#b25cff'; x.beginPath(); x.ellipse(px, py, pr, pr * .5, 0, 0, 7); x.fill(); x.restore(); }
      const s = k * 1.15; x.drawImage(sp.img, px - sp.ax * s, py - sp.ay * s, sp.w * s, sp.h * s);
      // lueur du feu (camps encore occupés)
      if (!st.includes('repris') || st === 'chefrepris'){ const [fx, fy] = [px + (.55 - .45) * 32 * s, py + (.55 + .45) * 16 * s - 14 * s]; x.save(); x.globalCompositeOperation = 'lighter';
        const r = (16 + Math.sin(t * 9 + i) * 3) * s, gr = x.createRadialGradient(fx, fy, 0, fx, fy, r); gr.addColorStop(0, 'rgba(255,190,80,.75)'); gr.addColorStop(1, 'rgba(255,120,30,0)'); x.fillStyle = gr; x.beginPath(); x.arc(fx, fy, r, 0, 7); x.fill(); x.restore(); }
      // étiquette
      const lab = st.includes('repris') ? '★'.repeat(C.st[g] || 0) + '☆'.repeat(3 - (C.st[g] || 0)) : cur ? 'À ATTAQUER' : `${T.camp(g).n} trolls`;
      x.font = `700 ${Math.round(12 * Math.min(1.4, k * 1.6))}px Fredoka, sans-serif`; x.textAlign = 'center'; const tw = x.measureText(lab).width + 14, ly = py + 26 * s;
      x.fillStyle = st.includes('repris') ? 'rgba(20,80,40,.85)' : cur ? 'rgba(120,40,190,.92)' : 'rgba(40,20,60,.75)'; x.beginPath(); x.roundRect(px - tw / 2, ly - 11, tw, 20, 9); x.fill();
      x.fillStyle = st.includes('repris') ? '#ffd34a' : '#fff'; x.fillText(lab, px, ly + 4);
      if (sel === i){ x.strokeStyle = '#ffd34a'; x.lineWidth = 3; x.beginPath(); x.ellipse(px, py, 60 * s, 30 * s, 0, 0, 7); x.stroke(); } }
    // neige qui tombe
    x.fillStyle = 'rgba(255,255,255,.85)'; for (let n = 0; n < 70; n++){ const fx = (n * 137.5 + t * 14 * (1 + n % 3)) % W, fy = (n * 91.3 + t * 40 * (1 + n % 2)) % H; x.beginPath(); x.arc(fx, fy, 1 + n % 3, 0, 7); x.fill(); }
  }
  draw();
  cv.addEventListener('click', e => { const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    let best = null, bd = 1e9; CAMPS.forEach((c, i) => { const [cx, cy] = pos(i), d = Math.hypot(cx - px, (cy - 20 * k) - py); if (d < bd){ bd = d; best = i; } });
    if (best != null && bd < 90 * Math.max(.6, k)) card(best); });
  function card(i){
    sel = i; ov.querySelector('.xcard')?.remove(); const g = first + i, c = T.camp(g), done = g < C.at, cur = g === C.at;
    const el = document.createElement('div'); el.className = 'xcard';
    el.innerHTML = `<h3>${c.name}</h3><p>${done ? `✅ Repris · ${'★'.repeat(C.st[g] || 0)}` : cur ? '🟣 Prochain camp à attaquer' : '🔒 Encore aux mains des trolls'}</p>
      <p>Force : <b>${c.n} trolls</b>${c.boss ? ` et leur <b>chef</b> (${c.bossHp} points de vie)` : ''}</p>
      <p>Attaque : ${Object.entries(T.campCost(g)).map(([k2, v]) => `${v} ${k2 === 'cookies' ? 'biscuits' : k2}`).join(', ')}</p>
      <div class="row">${cur || done ? `<button class="xbtn g" data-x="go">${done ? 'Rejouer' : 'Attaquer'}</button>` : ''}<button class="xbtn b" data-x="nope">Fermer</button></div>`;
    ov.appendChild(el);
    el.addEventListener('click', ev => { const b = ev.target.closest('[data-x]'); if (!b) return; if (b.dataset.x === 'nope'){ el.remove(); sel = null; return; } close(); E().campGo(g); });
  }
  const close = () => { cancelAnimationFrame(raf); ov.remove(); removeEventListener('resize', fit); };
  ov.querySelector('[data-x=close]').onclick = close;
}
