// Pêche sur glace, version active : touches trompeuses, « ÇA MORD ! » à ferrer, puis combat avec une jauge de tension
// à garder dans la zone verte (maintenir / relâcher, ou tapoter). Les poissons rares sont plus nerveux.
// Trop forcer casse la ligne, trop relâcher laisse filer le poisson. Une prise sans jamais sortir du vert est « parfaite ».
const INK = '#1d2547';
const NERV = [.55, .8, 1.1, 1.45], GREEN = [.34, .28, .22, .17], WIN = [1.2, .95, .75, .6];
const RNAME = ['Commun', 'Rare', 'Épique', 'Légendaire'], RCOL = ['#8fa3b8', '#3b8cff', '#a347ff', '#ff8a1c'];

/**
 * ctx : {roll(): poisson, rod: niveau de canne, nets(): filets en stock, useNet(): bool, onCatch(f, {perfect, combo}): html des gains,
 *        onMiss(f, why): html d'une offre éventuelle, canRecast(): bool, recast(): bool, sfx, tone, fishSvg(c, size), onClose()}
 */
export function openFishing(ctx){
  const root = document.createElement('div'); root.id = 'mg'; root.className = 'mg-fish';
  root.innerHTML = `<canvas></canvas><button class="mg-quit" aria-label="Quitter"></button>
    <div class="fx-hint">Attends que ça morde…</div><button class="fx-net" hidden>Lancer le filet</button>
    <div class="mg-card fx-res" hidden></div>`;
  document.body.appendChild(root);
  const cv = root.querySelector('canvas'), x = cv.getContext('2d'), hint = root.querySelector('.fx-hint'), netBtn = root.querySelector('.fx-net'), card = root.querySelector('.fx-res');
  const dpr = Math.min(2, devicePixelRatio || 1); let W, H;
  const resize = () => { W = root.clientWidth || innerWidth; H = root.clientHeight || innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  const vib = p => { try { navigator.vibrate?.(p); } catch(e){} };
  let st, raf = 0, last = performance.now(), T = 0, hold = false, combo = 0, closed = false;
  const say = (t, c = '#fff') => { hint.textContent = t; hint.style.color = c; };

  function cast(){
    const f = ctx.roll(); if (!f) return close();
    st = {ph: 'wait', f, t: 0, bite: 1.6 + Math.random() * 3.6, nib: [], dip: 0, tau: .45, p: .18, slack: 0, strain: 0, dir: 1, dirT: 0, pull: 0,
      center: .55, perfect: true, net: false, fishA: Math.random() * 6, msg: '', grace: 1, nibT: -9, flash: 0};
    const n = Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) st.nib.push(.5 + Math.random() * (st.bite - .8));
    card.hidden = true; netBtn.hidden = true; say('Attends le gros plouf et le «\u00a0!\u00a0». Les petites touches sont des pièges.');
    ctx.tone?.(330, .15, 'sine', .04);
  }
  function down(){
    if (!st || closed) return;
    if (st.ph === 'wait'){
      if (st.t < .6) return;                                  // le doigt qui vient de lancer : ignoré
      if (st.grace > 0){ st.grace--; st.bite += .6; say(st.t - st.nibT < .7 ? 'Pas encore ! C’était une petite touche. Attends le «\u00a0!\u00a0»' : 'Pas encore ! Attends le «\u00a0!\u00a0»', '#ffb36b'); ctx.tone?.(240, .12, 'triangle', .04); vib(15); return; }
      st.ph = 'miss'; say('Trop tôt ! Le poisson a eu peur.', '#ff9aa8'); ctx.sfx.err(); end(false, 'early'); return; }
    if (st.ph === 'bite'){ st.ph = 'fight'; st.t = 0; ctx.sfx.collect(); vib(40); say('MAINTIENS pour remonter, RELÂCHE quand ça tire trop !', '#ffd84a'); netBtn.hidden = !(ctx.nets() > 0); return; }
    if (st.ph === 'fight') hold = true;
  }
  const up = () => { hold = false; };
  root.addEventListener('pointerdown', e => { if (e.target.closest('button, .fx-res')) return; e.preventDefault(); down(); });
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  const key = e => { if (e.code === 'Space'){ e.preventDefault(); if (e.type === 'keydown'){ if (!e.repeat) down(); } else up(); } if (e.key === 'Escape' && e.type === 'keydown') close(); };
  addEventListener('keydown', key); addEventListener('keyup', key);
  netBtn.addEventListener('click', e => { e.stopPropagation(); if (st?.ph === 'fight' && !st.net && ctx.useNet()){ st.net = true; netBtn.hidden = true; say('Filet lancé : le poisson ne peut plus s’échapper !', '#7dffb0'); ctx.sfx.pop(); } });
  root.querySelector('.mg-quit').addEventListener('click', close);

  function end(ok, why){
    st.ph = 'done'; netBtn.hidden = true; hold = false;
    setTimeout(() => {
      if (closed) return;
      let html;
      if (ok){ combo = st.perfect ? combo + 1 : 0; html = ctx.onCatch(st.f, {perfect: st.perfect, combo});
        card.innerHTML = `<small>${RNAME[st.f.r]}${st.perfect ? ' · <b style="color:#ffd84a">PRISE PARFAITE' + (combo > 1 ? ' ×' + combo : '') + '</b>' : ''}</small><div class="fx-fish">${ctx.fishSvg(st.f.c, 120)}</div><h2 style="color:${RCOL[st.f.r]}">${st.f.name}</h2><p>${st.f.size} cm</p>${html || ''}`;
      } else { combo = 0; html = ctx.onMiss(st.f, why);
        card.innerHTML = `<small>${why === 'break' ? 'Ligne cassée' : why === 'early' ? 'Trop tôt' : why === 'late' ? 'Trop tard' : 'Il a filé'}</small><h2>${why === 'break' ? 'Tu as trop forcé !' : why === 'early' ? 'Le poisson a eu peur' : why === 'late' ? 'Il fallait ferrer plus vite' : 'Le poisson s’est échappé'}</h2>${st.f && why !== 'early' ? `<p>C'était un poisson <b style="color:${RCOL[st.f.r]}">${RNAME[st.f.r].toLowerCase()}</b>…</p>` : ''}${html || ''}`; }
      card.innerHTML += `<div class="acts">${ctx.canRecast() ? '<button class="btn green" data-x="again">Relancer</button>' : ''}<button class="btn blue" data-x="close">Terminer</button></div>`;
      card.hidden = false;
    }, ok ? 500 : 700);
  }
  card.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; if (b.dataset.x === 'close') return close();
    if (b.dataset.x.startsWith('buy:')){ if (!b.dataset.sure){ b.dataset.sure = 1; b.classList.add('sure'); b.innerHTML = 'Confirmer · ' + b.dataset.price + ' ⭐'; return; } const m = ctx.buy(b.dataset.x.slice(4)); b.outerHTML = `<span class="fx-ok">${m}</span>`; return; } if (ctx.recast()) cast(); else close(); });

  function step(dt){
    if (!st) return; st.t += dt;
    const r = st.f.r, nerv = NERV[r], gw = GREEN[r] + ctx.rod * .012;
    if (st.ph === 'wait'){
      st.dip = Math.max(0, st.dip - dt * 3);
      while (st.nib.length && st.t >= st.nib[0]){ st.nib.shift(); st.dip = .25; st.nibT = st.t; ctx.tone?.(300, .04, 'sine', .02); }
      if (st.t >= st.bite){ st.ph = 'bite'; st.t = 0; st.dip = 1; st.flash = 1; say('ÇA MORD ! Touche vite !', '#ffd84a'); ctx.tone?.(880, .12, 'square', .05); ctx.tone?.(660, .12, 'square', .05, .08); vib([60, 40, 60]); }
    } else if (st.ph === 'bite'){
      st.dip = .8 + Math.sin(T * 30) * .2;
      if (st.t > WIN[r] + ctx.rod * .05){ st.ph = 'miss'; say('Trop tard…', '#ff9aa8'); ctx.sfx.err(); end(false, 'late'); }
    } else if (st.ph === 'fight'){
      // le poisson change de direction ; quand il fuit, il tire sur la ligne (plus fort et plus souvent s'il est rare)
      st.dirT -= dt; if (st.dirT <= 0){ st.dir = Math.random() < .55 ? 1 : -1; st.dirT = (.5 + Math.random() * 1.6) / nerv; if (st.dir > 0) vib(25); }
      st.pull += ((st.dir > 0 ? nerv * (.55 + .45 * Math.sin(T * 7 + st.fishA)) : -.2) - st.pull) * Math.min(1, dt * 4);
      st.center = .55 + Math.sin(T * (.6 + r * .25)) * (.04 + r * .03);       // la zone verte bouge un peu (davantage pour les rares)
      st.tau += ((hold ? .95 : -.85) + st.pull * .55) * dt;
      st.tau = Math.max(0, Math.min(1, st.tau));
      const lo = st.center - gw / 2, hi = st.center + gw / 2, inG = st.tau >= lo && st.tau <= hi;
      if (!inG && st.t > 1) st.perfect = false;
      if (inG){ st.p += (.2 - r * .025) * dt; st.slack = 0; st.strain = 0; }
      else if (st.tau < lo){ st.p -= .06 * dt; st.slack += dt; st.strain = 0; }
      else { st.p += .07 * dt; st.strain += st.tau > .95 ? dt : 0; st.slack = 0; }
      if (hold && T % .12 < dt) ctx.tone?.(220 + st.tau * 300, .03, 'triangle', .015);
      if (st.net){ st.tau = Math.min(st.tau, .93); st.slack = 0; }
      if (st.strain > .35){ st.ph = 'miss'; ctx.tone?.(140, .25, 'sawtooth', .05); vib(200); say('CRAC ! Ligne cassée.', '#ff9aa8'); end(false, 'break'); }
      else if (st.slack > 2.2){ st.ph = 'miss'; ctx.sfx.err(); say('Trop de mou : il a filé…', '#ff9aa8'); end(false, 'escape'); }
      else if (st.p >= 1){ st.ph = 'won'; ctx.sfx.level?.(); vib([30, 30, 30, 30, 80]); say(st.perfect ? 'PRISE PARFAITE !' : 'Attrapé !', '#7dffb0'); end(true); }
      st.p = Math.max(0, st.p);
    }
  }
  function draw(){
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#bfe0ff'); g.addColorStop(.35, '#eaf5ff'); g.addColorStop(1, '#cfe3f7'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    // fissures de la glace
    x.strokeStyle = 'rgba(120,160,210,.35)'; x.lineWidth = 2; for (let i = 0; i < 7; i++){ x.beginPath(); const a = i * .9, cx = W / 2, cy = H * .5; x.moveTo(cx + Math.cos(a) * 90, cy + Math.sin(a) * 40); x.lineTo(cx + Math.cos(a) * 260, cy + Math.sin(a) * 140 + (i % 2) * 20); x.stroke(); }
    const cx = W / 2, cy = H * .5, rw = Math.min(W * .32, 140), rh = rw * .45;
    // ombre du poisson sous la glace pendant le combat
    if (st && (st.ph === 'fight' || st.ph === 'won')){ const a = T * (1.2 + st.f.r * .4) * st.dir + st.fishA, fx = cx + Math.cos(a) * rw * 1.7, fy = cy + Math.sin(a) * rh * 2.2;
      x.save(); x.globalAlpha = .35; x.fillStyle = '#1d3a6a'; x.translate(fx, fy); x.rotate(a + Math.PI / 2 * st.dir); x.beginPath(); x.ellipse(0, 0, 34 + st.f.r * 8, 12 + st.f.r * 3, 0, 0, 7); x.fill(); x.beginPath(); x.moveTo(-34 - st.f.r * 8, 0); x.lineTo(-50 - st.f.r * 8, -12); x.lineTo(-50 - st.f.r * 8, 12); x.fill(); x.restore();
      x.strokeStyle = 'rgba(30,40,60,.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx, cy); x.lineTo(fx, fy); x.stroke(); }
    // le trou
    x.fillStyle = '#16365e'; x.beginPath(); x.ellipse(cx, cy, rw, rh, 0, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.stroke();
    x.fillStyle = 'rgba(80,140,210,.35)'; x.beginPath(); x.ellipse(cx - rw * .2, cy - rh * .3, rw * .5, rh * .25, 0, 0, 7); x.fill();
    // ligne et bouchon
    const dip = st ? (st.ph === 'bite' ? 22 : st.dip * 14) + (st.ph === 'fight' ? 10 + st.tau * 8 : 0) : 0, by = cy + dip;
    x.strokeStyle = '#2a2a2a'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx + 40, 0); x.quadraticCurveTo(cx + 20, cy * .5, cx, by - 14); x.stroke();
    x.fillStyle = '#e8323f'; x.beginPath(); x.arc(cx, by - 8, 9, Math.PI, 0); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, by - 8, 9, 0, Math.PI); x.fill(); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(cx, by - 8, 9, 0, 7); x.stroke();
    if (st && st.ph === 'wait' && st.dip > .05){ x.strokeStyle = 'rgba(200,210,225,.8)'; x.lineWidth = 1.5; x.beginPath(); x.ellipse(cx, by, 16 + (1 - st.dip / .25) * 14, 5 + (1 - st.dip / .25) * 4, 0, 0, 7); x.stroke(); }
    if (st && st.ph === 'wait' && st.t - st.nibT < .8){ x.font = '700 14px system-ui, sans-serif'; x.textAlign = 'center'; x.fillStyle = 'rgba(70,90,120,.85)'; x.fillText('petite touche…', cx, by + rh + 18); }
    if (st && st.ph === 'bite'){
      // GROS PLOUF : éclaboussures, anneaux jaunes, gros « ! » au-dessus du bouchon
      x.strokeStyle = 'rgba(255,216,74,.95)'; x.lineWidth = 4; for (let k = 1; k <= 3; k++){ const g2 = (T * 2.2 + k / 3) % 1; x.globalAlpha = 1 - g2; x.beginPath(); x.ellipse(cx, by, 18 + g2 * rw * .9, 6 + g2 * rh * .9, 0, 0, 7); x.stroke(); } x.globalAlpha = 1;
      x.fillStyle = '#fff'; for (let k = 0; k < 7; k++){ const a = k / 7 * Math.PI + Math.PI, d = 18 + (T * 60 % 18); x.beginPath(); x.arc(cx + Math.cos(a) * d * 1.4, by - 6 + Math.sin(a) * d * .9, 3, 0, 7); x.fill(); }
      const s2 = 1 + Math.sin(T * 18) * .08; x.save(); x.translate(cx, by - 58); x.scale(s2, s2);
      x.fillStyle = '#ffd84a'; x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.arc(0, 0, 26, 0, 7); x.fill(); x.stroke();
      x.fillStyle = INK; x.font = '900 34px system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('!', 0, 2); x.restore(); x.textBaseline = 'alphabetic';
    }
    if (st && st.flash > 0){ x.fillStyle = `rgba(255,236,150,${st.flash * .45})`; x.fillRect(0, 0, W, H); st.flash = Math.max(0, st.flash - .06); }
    // jauges du combat
    if (st && st.ph === 'fight'){
      const r = st.f.r, gw = GREEN[r] + ctx.rod * .012, bw = Math.min(W - 48, 380), bx = (W - bw) / 2, byy = H * .78, bh = 26;
      x.fillStyle = 'rgba(29,37,71,.85)'; x.beginPath(); x.roundRect(bx - 4, byy - 4, bw + 8, bh + 8, 14); x.fill();
      const gr = x.createLinearGradient(bx, 0, bx + bw, 0); gr.addColorStop(0, '#5aa8ff'); gr.addColorStop(.8, '#ffd34a'); gr.addColorStop(1, '#ff4a4a'); x.fillStyle = gr; x.beginPath(); x.roundRect(bx, byy, bw, bh, 10); x.fill();
      x.fillStyle = 'rgba(70,220,110,.9)'; x.fillRect(bx + bw * (st.center - gw / 2), byy, bw * gw, bh);
      x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 3; const mx = bx + bw * st.tau; x.beginPath(); x.moveTo(mx, byy - 8); x.lineTo(mx - 8, byy - 18); x.lineTo(mx + 8, byy - 18); x.closePath(); x.fill(); x.stroke(); x.fillRect(mx - 2, byy, 4, bh);
      x.font = '700 12px system-ui'; x.textAlign = 'left'; x.fillStyle = '#fff'; x.fillText('Tension', bx, byy - 10);
      // progression (anneau autour du trou)
      x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 8; x.beginPath(); x.ellipse(cx, cy, rw + 16, rh + 16, 0, 0, 7); x.stroke();
      x.strokeStyle = st.perfect ? '#ffd34a' : '#7dffb0'; x.beginPath(); x.ellipse(cx, cy, rw + 16, rh + 16, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * st.p); x.stroke();
      if (st.dir > 0 && st.pull > .6){ x.font = '400 22px "Lilita One", sans-serif'; x.textAlign = 'center'; x.lineWidth = 5; x.strokeStyle = INK; x.fillStyle = '#ff9a5a'; x.strokeText('IL TIRE !', cx, cy - rh - 40); x.fillText('IL TIRE !', cx, cy - rh - 40); }
      if (st.net){ x.font = '700 13px system-ui'; x.fillStyle = '#1d6b3b'; x.textAlign = 'center'; x.fillText('Filet : prise assurée', cx, byy + bh + 22); }
    }
  }
  function loop(now){ raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt; step(dt); draw(); }
  function close(){ if (closed) return; closed = true; cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); removeEventListener('keydown', key); removeEventListener('keyup', key); root.remove(); ctx.onClose?.(); }
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) window.__fish = {get st(){ return st; }, set hold(v){ hold = v; }, down, close};
  cast(); raf = requestAnimationFrame(loop);
}
