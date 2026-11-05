// DÉFENSE DU VILLAGE — la bataille contre les trolls du Krampus.
// Les trolls descendent trois chemins vers la palissade du village. Touche-les pour lancer des boules de neige.
// Chaque type a son comportement (rapide, bouclier, lanceur, yéti), le chef ou le Krampus arrive en dernier.
// Coups réussis à la suite = charge des pouvoirs : Avalanche (touche tout le monde) et Grand Gel (tout s'arrête 3 s).
import {drawTroll, drawKrampus} from './villains.js';

const INK = '#141a33';
const TYPES = {
  troll:   {hp: 2, sp: .075, dmg: 14, pts: 1},
  runner:  {hp: 1, sp: .14,  dmg: 8,  pts: 1},
  shield:  {hp: 4, sp: .06,  dmg: 16, pts: 2},
  thrower: {hp: 2, sp: .07,  dmg: 10, pts: 2, stopAt: .42},
  yeti:    {hp: 9, sp: .04,  dmg: 40, pts: 4},
  chief:   {hp: 18, sp: .035, dmg: 45, pts: 8, boss: 1},
  krampus: {hp: 30, sp: 0,   dmg: 0,  pts: 12, boss: 1},
};

/** Composition d'un camp : plus on avance, plus il y a de types dangereux. */
export function waveFor(c){
  const i = c.i, list = [], n = c.n, mix = [['troll', 10], ['runner', i >= 2 ? 6 : 0], ['shield', i >= 4 ? 4 : 0], ['thrower', i >= 6 ? 4 : 0], ['yeti', i >= 12 ? 2 : 0]];
  const tot = mix.reduce((a, [, w]) => a + w, 0);
  for (let k = 0; k < n; k++){ let r = Math.random() * tot; for (const [t, w] of mix){ r -= w; if (r < 0){ list.push(t); break; } } }
  if (c.boss) list.push(c.ch >= 2 && c.ch % 2 === 0 ? 'krampus' : 'chief');
  return list;
}

export function openDefense(ctx){
  const C = ctx.camp, root = document.createElement('div'); root.id = 'mg'; root.className = 'mg-def';
  root.innerHTML = `<canvas></canvas>
    <div class="mg-hud"><div class="mg-pill"><small>Trolls</small><b class="d-left">0</b></div><div class="mg-pill wide"><small>Palissade</small><span class="d-hp"><i></i></span></div><button class="mg-quit" aria-label="Quitter"></button></div>
    <div class="d-pow"><button data-p="ava"><span class="pi">🌨</span><small>Avalanche</small><i></i></button><button data-p="gel"><span class="pi">❄</span><small>Grand Gel</small><i></i></button>${ctx.pet ? '<button data-p="pet"><span class="pi">🦌</span><small>Flocon</small><i></i></button>' : ''}</div>
    <div class="mg-card"><small>Campagne des Trolls</small><h2>${C.name}</h2><p>Les trolls du Krampus descendent vers le village ! <b>Touche-les</b> pour lancer des boules de neige. Enchaîne les coups pour charger tes pouvoirs.${C.boss ? ' <b>Un chef les accompagne…</b>' : ''}</p><span class="mg-best">${C.n} trolls${C.boss ? ' + le chef' : ''}</span><button class="btn green mg-go">Défendre le village !</button></div>`;
  document.body.appendChild(root);
  const cv = root.querySelector('canvas'), x = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  let W, H, bg = null;
  const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; bg = null; };
  resize(); addEventListener('resize', resize);

  // perspective : u = position le long du chemin (0 = horizon, 1 = palissade), lane = -1, 0, 1
  const horizon = () => H * .27, gateY = () => H * .80;
  const P = (lane, u) => { const y = horizon() + (gateY() - horizon()) * Math.pow(u, 1.25), spread = W * (.06 + .30 * u); return {x: W / 2 + lane * spread, y, s: .38 + .82 * u}; };

  const queue = waveFor(C), foes = [], balls = [], shots = [], fx = [], floats = [];
  const total = queue.length; let killed = 0, spawnT = 1.2, hp = 100, combo = 0, charge = {ava: 0, gel: 0, pet: 0}, freeze = 0, state = 'intro', T = 0, last = performance.now(), raf = 0, shake = 0;
  const NEED = {ava: 12, gel: 8, pet: 10};
  const float = (txt, fx_, fy, col = '#fff', big) => floats.push({txt, x: fx_, y: fy, t: 0, col, big});

  function spawn(){
    const kind = queue.shift(); const def = TYPES[kind], lanes = [-1, 0, 1].filter(l => !foes.some(f => f.lane === l && f.u < .15));
    const lane = def.boss ? 0 : lanes.length ? lanes[Math.floor(Math.random() * lanes.length)] : Math.floor(Math.random() * 3) - 1;
    const scale = 1 + Math.floor(C.i / 10) * .25;
    foes.push({kind, lane, u: 0, hp: Math.round(def.hp * (def.boss ? 1 + C.ch * .4 : scale)), max: Math.round(def.hp * (def.boss ? 1 + C.ch * .4 : scale)), sp: def.sp * (1 + C.i * .012), t: Math.random() * 6, hurt: 0, atk: 0, cd: 2 + Math.random() * 2, shield: kind === 'shield' ? 2 : 0, tele: 0});
    if (def.boss){ float(kind === 'krampus' ? 'Le Krampus en personne !' : 'Le chef du camp arrive !', W / 2, H * .35, '#ffd84a', 1); ctx.sfx.err(); shake = .5; }
  }
  function hit(f, dmg, from){
    if (f.shield > 0 && from !== 'power'){ f.shield--; f.hurt = .15; float(f.shield ? 'Bouclier !' : 'Bouclier brisé !', P(f.lane, f.u).x, P(f.lane, f.u).y - 120 * P(f.lane, f.u).s, '#bfe6ff'); ctx.sfx.tap(); return; }
    f.hp -= dmg; f.hurt = .2; if (f.kind === 'krampus' && f.hp > 0 && Math.random() < .35){ f.tele = .45; }
    if (f.hp <= 0){ const q = P(f.lane, f.u); killed++; fx.push({k: 'poof', x: q.x, y: q.y - 50 * q.s, s: q.s, t: 0}); float('+' + TYPES[f.kind].pts, q.x, q.y - 120 * q.s, '#ffd84a'); ctx.sfx.collect(); foes.splice(foes.indexOf(f), 1); }
  }
  function tap(px, py){
    if (state !== 'play') return;
    // une boule de neige ennemie en vol ? on peut la contrer
    for (const s of shots){ if (!s.dead && Math.hypot(px - s.x, py - s.y) < 34){ s.dead = true; float('Paré !', s.x, s.y, '#bfe6ff'); fx.push({k: 'splat', x: s.x, y: s.y, t: 0, s: 1}); combo++; addCharge(1); ctx.sfx.tap(); return; } }
    let best = null, bd = 1e9;
    for (const f of foes){ const q = P(f.lane, f.u), sz = (TYPES[f.kind].boss ? 150 : 110) * q.s; const dx = px - q.x, dy = py - (q.y - sz * .5);
      if (Math.abs(dx) < sz * .55 && Math.abs(dy) < sz * .6){ const d = Math.hypot(dx, dy); if (d < bd){ bd = d; best = f; } } }
    balls.push({x0: W / 2, y0: H + 10, x1: px, y1: py, t: 0, f: best});
    if (!best){ combo = 0; ctx.sfx.tap(); }
  }
  function addCharge(n){ for (const k in charge) charge[k] = Math.min(NEED[k], charge[k] + n); }
  function power(k){
    if (state !== 'play' || charge[k] < NEED[k]) return; charge[k] = 0; ctx.sfx.level();
    if (k === 'ava'){ shake = .6; fx.push({k: 'ava', t: 0}); for (const f of [...foes]) hit(f, 3, 'power'); float('AVALANCHE !', W / 2, H * .4, '#fff', 1); }
    if (k === 'gel'){ freeze = 3.2; float('GRAND GEL !', W / 2, H * .4, '#bfe6ff', 1); }
    if (k === 'pet'){ const lane = foes.length ? foes.reduce((a, f) => f.u > a.u ? f : a).lane : 0; fx.push({k: 'deer', lane, t: 0}); for (const f of [...foes]) if (f.lane === lane) hit(f, 6, 'power'); float('Flocon charge !', W / 2, H * .4, '#ffd84a', 1); }
  }

  function finish(win){
    if (state === 'end') return; state = 'end';
    const stars = !win ? 0 : hp >= 67 ? 3 : hp >= 34 ? 2 : 1;
    const res = ctx.result({win, hearts: stars, score: killed}), card = root.querySelector('.mg-card');
    card.innerHTML = `<small>${C.name}</small><h2>${win ? 'Village sauvé !' : 'La palissade a cédé…'}</h2>${win ? `<div class="mg-stars">${[1, 2, 3].map(k => `<i class="${k <= stars ? 'on' : ''}">★</i>`).join('')}</div>` : `<p>${killed} / ${total} trolls repoussés. Améliore tes bâtiments et Flocon, puis reviens !</p>`}
      <div class="costs mg-rw">${ctx.chipsHtml(res.rw)}</div><button class="btn green mg-claim">${win ? 'Récupérer' : 'Retour'}</button>`;
    card.hidden = false; card.querySelector('.mg-claim').onclick = e => { ctx.grant(res.rw, e.currentTarget); ctx.sfx.level(); setTimeout(close, 400); };
  }
  function close(){ cancelAnimationFrame(raf); removeEventListener('resize', resize); root.remove(); ctx.onClose?.(); }
  let quitArmed = 0;
  root.querySelector('.mg-quit').onclick = () => { if (state === 'play' && performance.now() - quitArmed > 2500){ quitArmed = performance.now(); float('Touche encore pour fuir', W / 2, H * .5, '#ffd84a'); return; } close(); };
  root.querySelector('.mg-go').onclick = () => { root.querySelector('.mg-card').hidden = true; state = 'play'; ctx.sfx.tap(); };
  cv.addEventListener('pointerdown', e => tap(e.clientX, e.clientY));
  root.querySelector('.d-pow').addEventListener('pointerdown', e => { const b = e.target.closest('[data-p]'); if (b){ e.stopPropagation(); power(b.dataset.p); } });

  function update(dt){
    T += dt; shake = Math.max(0, shake - dt); freeze = Math.max(0, freeze - dt);
    if (state === 'play'){
      spawnT -= dt; if (queue.length && spawnT <= 0 && (!TYPES[queue[0]].boss || foes.length < 2)){ spawn(); spawnT = Math.max(.55, 1.7 - C.i * .03) * (.7 + Math.random() * .6); }
      for (const f of [...foes]){
        f.t += dt; f.hurt = Math.max(0, f.hurt - dt); f.atk = Math.max(0, f.atk - dt * 3); if (f.tele > 0){ f.tele -= dt; if (f.tele <= 0) f.lane = [-1, 0, 1].filter(l => l !== f.lane)[Math.floor(Math.random() * 2)]; continue; }
        if (freeze) continue;
        const def = TYPES[f.kind];
        if (f.kind === 'krampus'){ f.u = Math.min(.35, f.u + dt * .08); f.cd -= dt; if (f.cd <= 0 && f.u >= .3){ f.cd = Math.max(1.1, 2.6 - C.ch * .15); f.atk = 1; for (const l of [-1, 0, 1]) if (Math.random() < .7){ const q = P(l, .35); shots.push({x: q.x, y: q.y - 60 * q.s, lane: l, u: .35, ice: 1}); } } continue; }
        if (def.stopAt && f.u >= def.stopAt){ f.cd -= dt; if (f.cd <= 0){ f.cd = 2.6; f.atk = 1; const q = P(f.lane, f.u); shots.push({x: q.x + 30 * q.s, y: q.y - 100 * q.s, lane: f.lane, u: f.u}); } continue; }
        f.u += f.sp * dt;
        if (f.u >= 1){ hp -= def.dmg; shake = .4; combo = 0; ctx.sfx.err(); float('-' + def.dmg, W / 2 + f.lane * W * .3, gateY() - 20, '#ff8a9a'); foes.splice(foes.indexOf(f), 1); killed++;
          if (hp <= 0){ hp = 0; finish(false); } }
      }
      for (const s of shots){ if (s.dead || freeze) continue; s.u += dt * (s.ice ? .5 : .55); const q = P(s.lane, s.u); s.x += (q.x - s.x) * Math.min(1, dt * 6); s.y = q.y - 60 * q.s;
        if (s.u >= 1){ s.dead = true; const d = s.ice ? 12 : 8; hp -= d; shake = .3; float('-' + d, s.x, gateY() - 20, '#ff8a9a'); ctx.sfx.err(); if (hp <= 0){ hp = 0; finish(false); } } }
      for (let i = shots.length - 1; i >= 0; i--) if (shots[i].dead) shots.splice(i, 1);
      if (!queue.length && !foes.length && state === 'play') setTimeout(() => finish(true), 600), state = 'won';
    }
    for (const b of balls){ b.t += dt * 4.5; if (b.t >= 1 && !b.done){ b.done = true; fx.push({k: 'splat', x: b.x1, y: b.y1, t: 0, s: 1});
      if (b.f && foes.includes(b.f)){ combo++; addCharge(1); const q = P(b.f.lane, b.f.u); if (combo > 1 && combo % 5 === 0) float(`Combo ×${combo} !`, q.x, q.y - 160 * q.s, '#ffd84a'); hit(b.f, 1); } } }
    for (let i = balls.length - 1; i >= 0; i--) if (balls[i].t > 1.1) balls.splice(i, 1);
    for (const e of fx) e.t += dt; for (let i = fx.length - 1; i >= 0; i--) if (fx[i].t > (fx[i].k === 'ava' ? 1.2 : fx[i].k === 'deer' ? 1 : .5)) fx.splice(i, 1);
    for (const f of floats) f.t += dt; for (let i = floats.length - 1; i >= 0; i--) if (floats[i].t > 1.1) floats.splice(i, 1);
  }

  function background(){
    const c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr; const b = c.getContext('2d'); b.scale(dpr, dpr);
    const hz = horizon();
    b.fillStyle = (() => { const g = b.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#0b1636'); g.addColorStop(.6, '#2a3f7a'); g.addColorStop(1, '#7a8fc8'); return g; })(); b.fillRect(0, 0, W, hz + 2);
    // aurore
    for (let i = 0; i < 3; i++){ const g = b.createLinearGradient(0, hz * .2, 0, hz * .8); g.addColorStop(0, 'rgba(80,255,180,0)'); g.addColorStop(.5, `rgba(${i ? 140 : 80},${i ? 120 : 255},${i ? 255 : 180},.18)`); g.addColorStop(1, 'rgba(80,255,180,0)');
      b.fillStyle = g; b.beginPath(); b.moveTo(0, hz * (.3 + i * .1)); for (let k = 0; k <= 10; k++) b.lineTo(W * k / 10, hz * (.3 + i * .1) + Math.sin(k * 1.3 + i) * 18); b.lineTo(W, hz * .8); b.lineTo(0, hz * .8); b.fill(); }
    for (let i = 0; i < 60; i++){ b.fillStyle = `rgba(255,255,255,${.3 + Math.random() * .6})`; b.fillRect(Math.random() * W, Math.random() * hz * .7, 1.5, 1.5); }
    // montagnes et repaire du Krampus au loin
    b.fillStyle = '#5d6fa8'; b.beginPath(); b.moveTo(0, hz); for (let k = 0; k <= 8; k++) b.lineTo(W * k / 8, hz - 30 - ((k * 37) % 50)); b.lineTo(W, hz); b.fill();
    b.fillStyle = '#3d4a80'; b.beginPath(); b.moveTo(W * .38, hz); b.lineTo(W * .5, hz - 70); b.lineTo(W * .62, hz); b.fill();
    b.fillStyle = '#9fd0ff'; b.beginPath(); b.moveTo(W * .47, hz - 52); b.lineTo(W * .5, hz - 70); b.lineTo(W * .53, hz - 52); b.fill();
    // champ de neige
    const g2 = b.createLinearGradient(0, hz, 0, H); g2.addColorStop(0, '#c9d8f0'); g2.addColorStop(1, '#f4f8ff'); b.fillStyle = g2; b.fillRect(0, hz, W, H - hz);
    // chemins
    for (const l of [-1, 0, 1]){ b.beginPath(); for (let k = 0; k <= 20; k++){ const q = P(l, k / 20); b.lineTo(q.x - 46 * q.s, q.y); } for (let k = 20; k >= 0; k--){ const q = P(l, k / 20); b.lineTo(q.x + 46 * q.s, q.y); } b.closePath(); b.fillStyle = 'rgba(150,170,205,.35)'; b.fill(); }
    // sapins sur les côtés
    for (let i = 0; i < 16; i++){ const u = (i % 8) / 8 + .05, side = i < 8 ? -1 : 1, q = P(side * 1.9, u), s = q.s * 70;
      b.fillStyle = '#2f6e5a'; b.beginPath(); b.moveTo(q.x - s * .45, q.y); b.lineTo(q.x, q.y - s * 1.3); b.lineTo(q.x + s * .45, q.y); b.fill(); b.fillStyle = '#fff'; b.beginPath(); b.moveTo(q.x - s * .2, q.y - s * .75); b.lineTo(q.x, q.y - s * 1.3); b.lineTo(q.x + s * .2, q.y - s * .75); b.fill(); }
    // palissade du village
    const gy = gateY(); b.fillStyle = '#8a5a30'; for (let px = -10; px < W + 20; px += 26){ b.beginPath(); b.moveTo(px, gy + 70); b.lineTo(px, gy + 8); b.lineTo(px + 11, gy - 4); b.lineTo(px + 22, gy + 8); b.lineTo(px + 22, gy + 70); b.closePath(); b.fill(); b.strokeStyle = INK; b.lineWidth = 2.5; b.stroke(); b.fillStyle = '#fff'; b.fillRect(px + 3, gy + 6, 16, 4); b.fillStyle = '#8a5a30'; }
    b.fillStyle = '#6b4220'; b.fillRect(0, gy + 26, W, 9); b.fillRect(0, gy + 50, W, 9);
    return c;
  }

  function draw(){
    if (!bg) bg = background();
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.save(); if (shake) x.translate((Math.random() - .5) * 14 * shake, (Math.random() - .5) * 6 * shake);
    x.drawImage(bg, 0, 0, W, H);
    // ennemis (du plus loin au plus proche)
    for (const f of [...foes].sort((a, b) => a.u - b.u)){
      const q = P(f.lane, f.u); x.save(); x.translate(q.x, q.y); if (f.tele > 0) x.globalAlpha = Math.abs(Math.sin(f.tele * 20));
      if (f.kind === 'krampus'){ x.scale(q.s * 1.15, q.s * 1.15); x.translate(-100, -196); drawKrampus(x, T, f.atk > .3 ? 1 : 0); }
      else { x.scale(q.s, q.s); drawTroll(x, f.kind, f.t, {walk: !freeze, hurt: f.hurt > 0, atk: f.atk}); if (freeze){ x.fillStyle = 'rgba(170,220,255,.45)'; x.beginPath(); x.roundRect(-44, -140, 88, 142, 18); x.fill(); } }
      x.restore();
      if (f.max > 1){ const w = (TYPES[f.kind].boss ? 120 : 56) * q.s, top = q.y - (f.kind === 'krampus' ? 230 : f.kind === 'yeti' ? 175 : 150) * q.s; x.fillStyle = INK; x.fillRect(q.x - w / 2 - 2, top - 2, w + 4, 9); x.fillStyle = TYPES[f.kind].boss ? '#ffb020' : '#ff5a5a'; x.fillRect(q.x - w / 2, top, w * f.hp / f.max, 5);
        if (f.shield) { x.fillStyle = '#bfe6ff'; for (let k = 0; k < f.shield; k++){ x.beginPath(); x.arc(q.x - w / 2 + 6 + k * 10, top - 8, 4, 0, 7); x.fill(); } } }
      if (TYPES[f.kind].stopAt && f.u >= TYPES[f.kind].stopAt && f.cd < .6){ x.fillStyle = '#ff3b3b'; x.font = '400 26px "Lilita One", sans-serif'; x.textAlign = 'center'; x.fillText('!', q.x + 34 * q.s, q.y - 140 * q.s); }
    }
    // tirs ennemis (on peut les toucher)
    for (const s of shots){ const r = s.ice ? 14 : 12; x.save(); x.translate(s.x, s.y); if (s.ice){ x.rotate(T * 6); x.beginPath(); x.moveTo(0, -r * 1.4); x.lineTo(r * .6, 0); x.lineTo(0, r * 1.4); x.lineTo(-r * .6, 0); x.closePath(); x.fillStyle = '#9fe0ff'; } else { x.beginPath(); x.arc(0, 0, r, 0, 7); x.fillStyle = '#fff'; }
      x.fill(); x.lineWidth = 2.5; x.strokeStyle = '#c01030'; x.stroke(); x.restore(); }
    // nos boules de neige
    for (const b of balls){ if (b.t > 1) continue; const t = b.t, bx = b.x0 + (b.x1 - b.x0) * t, by = b.y0 + (b.y1 - b.y0) * t - Math.sin(t * Math.PI) * 90; x.beginPath(); x.arc(bx, by, 13 * (1 - t * .45), 0, 7); x.fillStyle = '#fff'; x.fill(); x.lineWidth = 2.5; x.strokeStyle = INK; x.stroke(); }
    for (const e of fx){
      if (e.k === 'splat' || e.k === 'poof'){ const n = e.k === 'poof' ? 10 : 7, R = (e.k === 'poof' ? 30 : 12) + e.t * (e.k === 'poof' ? 120 : 70); x.globalAlpha = 1 - e.t * 2; x.fillStyle = '#fff'; for (let k = 0; k < n; k++){ const a = k / n * 6.28; x.beginPath(); x.arc(e.x + Math.cos(a) * R, e.y + Math.sin(a) * R * .7, Math.max(1, 7 - e.t * 10), 0, 7); x.fill(); } x.globalAlpha = 1; }
      if (e.k === 'ava'){ x.globalAlpha = Math.max(0, 1 - e.t); x.fillStyle = '#fff'; for (let k = 0; k < 40; k++){ const px = (k * 97) % W, py = (e.t * 900 + k * 53) % H; x.beginPath(); x.arc(px, py, 10 + (k % 5) * 3, 0, 7); x.fill(); } x.globalAlpha = 1; }
      if (e.k === 'deer'){ const q = P(e.lane, 1 - e.t); x.font = `${60 * q.s + 20}px serif`; x.textAlign = 'center'; x.fillText('🦌', q.x, q.y); }
    }
    if (freeze){ x.fillStyle = `rgba(160,210,255,${Math.min(.25, freeze * .1)})`; x.fillRect(0, 0, W, H); }
    x.textAlign = 'center'; x.textBaseline = 'middle';
    for (const f of floats){ x.globalAlpha = Math.max(0, 1 - f.t); x.font = `400 ${f.big ? 34 : 24}px "Lilita One", sans-serif`; x.lineWidth = 6; x.strokeStyle = INK; x.lineJoin = 'round'; x.strokeText(f.txt, f.x, f.y - f.t * 50); x.fillStyle = f.col; x.fillText(f.txt, f.x, f.y - f.t * 50); }
    x.globalAlpha = 1; x.restore();
    root.querySelector('.d-left').textContent = `${killed}/${total}`;
    root.querySelector('.d-hp i').style.width = hp + '%'; root.querySelector('.d-hp').classList.toggle('low', hp < 34);
    for (const b of root.querySelectorAll('[data-p]')){ const k = b.dataset.p, r = charge[k] / NEED[k]; b.querySelector('i').style.height = (r * 100) + '%'; b.classList.toggle('ready', r >= 1); }
  }
  function loop(now){ raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; update(state === 'play' || state === 'won' ? dt : 0); draw(); }
  raf = requestAnimationFrame(loop);
}
