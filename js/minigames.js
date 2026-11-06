// Mini-jeux en 2D (canvas) : « Tournée de Noël » (traîneau) et « Bataille de boules de neige ».
// Les images viennent des rendus des vrais modèles 3D du jeu (ctx.icons).

const INK = '#1d2547';
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });

export const GAMES = {
  sleigh: {name: 'Tournée de Noël', rules: "Touche l'écran pour lâcher un cadeau. Vise les cheminées ! Plusieurs réussites d'affilée font grimper le combo.", time: 40},
  troll:  {name: 'Attaque du camp', rules: "Touche les trolls pour leur lancer des boules de neige. Certains en demandent plusieurs ! S'ils restent trop longtemps, ils te bombardent : tu perds un cœur.", time: 45},
  snow:   {name: 'La Tour de cadeaux', rules: "Un cadeau glisse au-dessus du traîneau : <b>touche l'écran pour le lâcher</b>. Ce qui dépasse tombe ! Pose-le pile dessus pour un <b>Parfait</b> : le combo élargit ta tour. Monte jusqu'aux étoiles !", time: 0},
};

/**
 * ctx : {icons, reward(kind, score) -> {coins, xp, ...}, grant(rw), chipsHtml(rw), best(kind), setBest(kind, score), sfx}
 */
export async function openMinigame(kind, ctx){
  const G = GAMES[kind];
  const root = document.createElement('div'); root.id = 'mg'; root.className = 'mg-' + kind;
  const C = ctx.camp, gname = C ? C.name : G.name, grules = C ? `${G.rules}${C.boss ? ' <b>Le chef du camp est là !</b>' : ''}` : G.rules;
  root.innerHTML = `<canvas></canvas>
    <div class="mg-hud"><div class="mg-pill"><small>${C ? 'Trolls' : 'Score'}</small><b class="mg-score">0</b></div>${C ? `<div class="mg-pill"><small>Cœurs</small><b class="mg-hearts">${'❤'.repeat(C.hearts || 3)}</b></div>` : ''}${C || G.time ? `<div class="mg-pill"><small>Temps</small><b class="mg-time">${G.time}</b></div>` : ''}<button class="mg-quit" aria-label="Quitter"></button></div>
    <div class="mg-card"><small>${C ? 'Campagne' : 'Mini-jeu'}</small><h2>${gname}</h2><p>${grules}</p>${C ? `<span class="mg-best">${C.n} trolls à vaincre${C.boss ? ' + le chef' : ''}</span>` : `<span class="mg-best">Record : ${ctx.best(kind)}</span>`}<button class="btn green mg-go">C'est parti !</button></div>`;
  document.body.appendChild(root);
  const cv = root.querySelector('canvas'), x = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  let W, H;
  const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  const img = {};
  await Promise.all(Object.entries(ctx.icons).map(async ([k, v]) => { img[k] = await load(v); }));

  let state = 'intro', time = C ? C.time : G.time, hearts = C ? C.hearts || 3 : 3, score = 0, raf = 0, last = performance.now(), T = 0;
  const floats = [];
  const float = (txt, fx, fy, color = '#fff') => floats.push({txt, x: fx, y: fy, t: 0, color});
  let endAt = 0; const game = kind === 'sleigh' ? sleighGame() : kind === 'troll' ? trollGame() : stackGame();

  function close(){ cancelAnimationFrame(raf); removeEventListener('resize', resize); root.remove(); ctx.onClose?.(); }
  root.querySelector('.mg-quit').onclick = () => { if (state === 'play' && !confirmQuit()) return; close(); };
  let quitArmed = 0;
  function confirmQuit(){ if (performance.now() - quitArmed < 2500) return true; quitArmed = performance.now(); float('Touche encore pour quitter', W / 2, H * .45, '#ffd84a'); return false; }
  root.querySelector('.mg-go').onclick = () => { root.querySelector('.mg-card').hidden = true; state = 'play'; ctx.sfx.tap(); };
  cv.addEventListener('pointerdown', e => { if (state === 'play') game.tap(e.clientX, e.clientY); });

  function finish(win){
    if (state === 'end') return;
    if (C){
      state = 'end'; const res = ctx.result({win: !!win, hearts, score}), card = root.querySelector('.mg-card');
      card.innerHTML = `<small>${C.name}</small><h2>${win ? 'Camp vaincu !' : 'Repli !'}</h2>${win ? `<div class="mg-stars">${[1, 2, 3].map(k => `<i class="${k <= res.stars ? 'on' : ''}">★</i>`).join('')}</div>` : `<p>${hearts <= 0 ? 'Les trolls t’ont bombardé.' : 'Le temps est écoulé.'} ${score} / ${C.n + (C.boss ? 1 : 0)} trolls vaincus.</p>`}
        <div class="costs mg-rw">${ctx.chipsHtml(res.rw)}</div><button class="btn green mg-claim">${win ? 'Récupérer' : 'Retour'}</button>`;
      card.hidden = false;
      card.querySelector('.mg-claim').onclick = e => { ctx.grant(res.rw, e.currentTarget); ctx.sfx.level(); setTimeout(close, 450); };
      return;
    }
    state = 'end'; ctx.onScore?.(score);
    const rw = ctx.reward(kind, score), best = ctx.best(kind), rec = score > best;
    if (rec) ctx.setBest(kind, score);
    const card = root.querySelector('.mg-card');
    card.innerHTML = `<small>${rec ? 'Nouveau record !' : 'Partie terminée'}</small><h2>${score >= game.great ? 'Bravo !' : score >= game.good ? 'Bien joué !' : 'Pas mal !'}</h2>
      <div class="mg-final">${score}<span>points</span></div><div class="costs mg-rw">${ctx.chipsHtml(rw)}</div>
      <button class="btn green mg-claim">Récupérer</button>`;
    card.hidden = false;
    card.querySelector('.mg-claim').onclick = e => { ctx.grant(rw, e.currentTarget); ctx.sfx.level(); setTimeout(close, 450); };
  }

  function loop(now){
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
    if (state === 'play' && (C || G.time)){ time -= dt; if (time <= 0){ time = 0; finish(); } }
    game.update(state === 'play' ? dt : 0, dt);
    game.draw();
    for (const f of floats){ f.t += dt; }
    for (let i = floats.length - 1; i >= 0; i--) if (floats[i].t > 1) floats.splice(i, 1);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    for (const f of floats){
      x.globalAlpha = Math.max(0, 1 - f.t); x.font = `400 ${26 + (1 - f.t) * 6}px "Lilita One", sans-serif`;
      x.lineWidth = 6; x.strokeStyle = INK; x.lineJoin = 'round'; x.strokeText(f.txt, f.x, f.y - f.t * 50); x.fillStyle = f.color; x.fillText(f.txt, f.x, f.y - f.t * 50);
    }
    x.globalAlpha = 1;
    root.querySelector('.mg-score').textContent = C ? `${score}/${C.n + (C.boss ? 1 : 0)}` : score;
    if (C) root.querySelector('.mg-hearts').textContent = '❤'.repeat(Math.max(0, hearts)) + '♡'.repeat((C.hearts || 3) - Math.max(0, hearts));
    const tm = root.querySelector('.mg-time'); if (tm) tm.textContent = Math.ceil(time);
  }
  raf = requestAnimationFrame(loop);

  /* ================================================================
     TOURNÉE DE NOËL
     ================================================================ */
  function sleighGame(){
    const houses = [], gifts = [], flakes = [], stars = [];
    for (let i = 0; i < 70; i++) stars.push([Math.random(), Math.random() * .55, Math.random() * 6]);
    for (let i = 0; i < 90; i++) flakes.push([Math.random(), Math.random(), .4 + Math.random()]);
    const COLORS = [['#e8506b', '#b82c48'], ['#4fa3e8', '#2f6fb0'], ['#58c27a', '#2f8a50'], ['#f2b84b', '#c98a1c'], ['#a37be0', '#6f4cb0']];
    let scroll = 0, nextX = 0, cool = 0, combo = 0;
    const groundY = () => H * .86;
    function addHouse(){
      const w = 120 + Math.random() * 60, h = 70 + Math.random() * 70, c = COLORS[Math.floor(Math.random() * COLORS.length)];
      const side = Math.random() < .5 ? .3 : .7;
      houses.push({x: nextX, w, h, c, roofH: w * .32, cx: w * side, cw: 40, ch: 30, state: 0, glow: 0});
      nextX += w + 70 + Math.random() * 110;
    }
    nextX = W * .55; while (nextX < W * 3) addHouse();
    const roofY = (hs, rx) => groundY() - hs.h - hs.roofH * (1 - Math.abs(rx - hs.w / 2) / (hs.w / 2));
    const sleighPos = () => ({sx: W * .24, sy: H * .2 + Math.sin(T * 2.2) * 10});
    return {
      good: 80, great: 160,
      tap(){
        if (cool > 0) return; cool = .28;
        const {sx, sy} = sleighPos();
        gifts.push({x: sx + 10, y: sy + 30, vy: 60, rot: 0, done: false}); ctx.sfx.tap();
      },
      update(dt, rdt){
        const speed = 180 + (G.time - time) * 5;
        scroll += speed * dt; cool -= rdt;
        while (nextX - scroll < W * 2) addHouse();
        while (houses.length && houses[0].x + houses[0].w - scroll < -50) houses.shift();
        for (const g of gifts){
          if (g.done){ g.t = (g.t || 0) + rdt; continue; }
          g.vy += 1500 * rdt; g.y += g.vy * rdt; g.rot += rdt * 4;
          for (const hs of houses){
            const hx = hs.x - scroll; if (g.x < hx - 10 || g.x > hx + hs.w + 10) continue;
            const cl = hx + hs.cx - hs.cw / 2, cr = cl + hs.cw, ctop = roofY(hs, hs.cx) - hs.ch;
            if (g.x > cl + 3 && g.x < cr - 3 && g.y >= ctop && g.y - g.vy * rdt < ctop + 4){
              if (hs.state) break;
              combo++; const pts = 10 + Math.min(10, combo - 1) * 2; score += pts; hs.state = 1; hs.glow = 1;
              g.done = true; g.hit = true; float(`+${pts}`, g.x, ctop - 20, combo > 2 ? '#ffd84a' : '#fff');
              if (combo > 2) float(`Combo x${combo}`, W / 2, H * .38, '#ffd84a');
              ctx.sfx.collect(); break;
            }
            const ry = roofY(hs, g.x - hx);
            if (g.x > hx && g.x < hx + hs.w && g.y >= ry){ g.done = true; g.miss = true; g.y = ry; if (combo > 1) float('Raté !', g.x, ry - 20, '#ff9aa8'); combo = 0; break; }
          }
          if (!g.done && g.y > groundY()){ g.done = true; g.miss = true; g.y = groundY(); combo = 0; }
        }
        for (let i = gifts.length - 1; i >= 0; i--) if (gifts[i].done && gifts[i].t > .5) gifts.splice(i, 1);
        for (const hs of houses) hs.glow = Math.max(0, hs.glow - rdt * 1.2);
        for (const f of flakes){ f[1] += rdt * .05 * f[2]; f[0] -= rdt * .03 * f[2]; if (f[1] > 1){ f[1] = 0; } if (f[0] < 0) f[0] = 1; }
      },
      draw(){
        const sky = x.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#1b2350'); sky.addColorStop(.55, '#4c4f9c'); sky.addColorStop(.85, '#e59bb0'); sky.addColorStop(1, '#ffd2b8');
        x.fillStyle = sky; x.fillRect(0, 0, W, H);
        for (const [sx, sy, ph] of stars){ x.globalAlpha = .5 + .5 * Math.sin(T * 2 + ph); x.fillStyle = '#fff'; x.fillRect(sx * W, sy * H, 2, 2); }
        x.globalAlpha = 1;
        x.fillStyle = '#fff6d8'; x.beginPath(); x.arc(W * .8, H * .14, 34, 0, 7); x.fill();
        x.fillStyle = 'rgba(255,246,216,.15)'; x.beginPath(); x.arc(W * .8, H * .14, 60, 0, 7); x.fill();
        // collines lointaines
        for (const [k, col, amp, base] of [[.15, '#7b7fc4', 60, .72], [.35, '#a6a8dc', 40, .8]]){
          x.fillStyle = col; x.beginPath(); x.moveTo(0, H);
          for (let px = 0; px <= W + 20; px += 20){ const wx = px + scroll * k; x.lineTo(px, H * base - Math.sin(wx * .006) * amp - Math.sin(wx * .017) * amp * .4); }
          x.lineTo(W, H); x.fill();
        }
        // maisons
        for (const hs of houses){
          const hx = hs.x - scroll, by = groundY() - hs.h;
          if (hx > W + 20) continue;
          x.lineWidth = 3; x.strokeStyle = INK; x.lineJoin = 'round';
          x.fillStyle = hs.c[0]; x.fillRect(hx, by, hs.w, hs.h); x.strokeRect(hx, by, hs.w, hs.h);
          // fenêtres
          const lit = hs.state ? '#ffe27a' : '#ffd36b';
          for (const wx of [.2, .62]){ x.fillStyle = hs.glow > 0 ? '#fff6c0' : lit; x.fillRect(hx + hs.w * wx, by + hs.h * .25, hs.w * .18, hs.h * .25); x.strokeRect(hx + hs.w * wx, by + hs.h * .25, hs.w * .18, hs.h * .25); }
          x.fillStyle = '#6b3a24'; x.fillRect(hx + hs.w * .42, by + hs.h * .55, hs.w * .16, hs.h * .45); x.strokeRect(hx + hs.w * .42, by + hs.h * .55, hs.w * .16, hs.h * .45);
          // cheminée
          const cl = hx + hs.cx - hs.cw / 2, ctop = roofY(hs, hs.cx) - hs.ch;
          x.fillStyle = '#9b4a3a'; x.fillRect(cl, ctop, hs.cw, hs.ch + 30); x.strokeRect(cl, ctop, hs.cw, hs.ch + 30);
          x.fillStyle = '#2a1a22'; x.fillRect(cl + 5, ctop + 2, hs.cw - 10, 7);
          x.fillStyle = '#ffffff'; x.beginPath(); x.roundRect(cl - 4, ctop - 6, hs.cw + 8, 9, 4); x.fill(); x.stroke();
          if (hs.state){ x.fillStyle = `rgba(255,220,120,${.4 + hs.glow * .6})`; x.beginPath(); x.arc(cl + hs.cw / 2, ctop - 8, 10 + hs.glow * 20, 0, 7); x.fill(); }
          // toit
          x.fillStyle = hs.c[1]; x.beginPath(); x.moveTo(hx - 10, by + 2); x.lineTo(hx + hs.w / 2, by - hs.roofH); x.lineTo(hx + hs.w + 10, by + 2); x.closePath(); x.fill(); x.stroke();
          x.fillStyle = '#fff'; x.beginPath(); x.moveTo(hx + hs.w * .18, by - hs.roofH * .64); x.lineTo(hx + hs.w / 2, by - hs.roofH - 2); x.lineTo(hx + hs.w * .82, by - hs.roofH * .64);
          x.quadraticCurveTo(hx + hs.w * .5, by - hs.roofH * .5, hx + hs.w * .18, by - hs.roofH * .64); x.fill(); x.stroke();
        }
        // sol
        x.fillStyle = '#f2f6ff'; x.fillRect(0, groundY(), W, H); x.strokeStyle = INK; x.beginPath(); x.moveTo(0, groundY()); x.lineTo(W, groundY()); x.stroke();
        // cadeaux
        for (const g of gifts){
          if (g.hit) continue;
          x.save(); x.translate(g.x, g.y); x.rotate(g.miss ? 0 : g.rot); x.globalAlpha = g.miss ? Math.max(0, 1 - (g.t || 0) * 2) : 1;
          if (img.gift) x.drawImage(img.gift, -20, -20, 40, 40); x.restore();
        }
        // traîneau
        const {sx, sy} = sleighPos();
        if (img.sleigh){ x.save(); x.translate(sx, sy); x.rotate(Math.sin(T * 2.2) * .05); x.scale(-1, 1); x.drawImage(img.sleigh, -75, -60, 150, 150); x.restore(); }
        x.fillStyle = '#fff';
        for (const [fx, fy, s] of flakes){ x.globalAlpha = .7; x.beginPath(); x.arc(fx * W, fy * H, 1.2 + s * 1.5, 0, 7); x.fill(); }
        x.globalAlpha = 1;
      },
    };
  }

  /* ================================================================
     BATAILLE DE BOULES DE NEIGE
     ================================================================ */
  /* ================================================================
     CAMPAGNE : ATTAQUE D'UN CAMP DE TROLLS
     ================================================================ */
  function drawTroll(cx, by, sz, t, hurt, boss){
    const body = boss ? '#8a5fb0' : '#6f9fb0', dark = boss ? '#5d3a80' : '#4a7383';
    x.save(); x.translate(cx, by); if (hurt) x.rotate(Math.sin(t * 40) * .08);
    x.lineWidth = 3; x.strokeStyle = INK;
    x.fillStyle = '#efe6d8'; for (const sgn of [-1, 1]){ x.beginPath(); x.moveTo(sgn * sz * .22, -sz * .78); x.quadraticCurveTo(sgn * sz * .42, -sz * 1.08, sgn * sz * .36, -sz * 1.12); x.quadraticCurveTo(sgn * sz * .3, -sz * .92, sgn * sz * .12, -sz * .8); x.fill(); x.stroke(); }
    x.fillStyle = hurt ? '#ff9aa8' : body; x.beginPath(); x.ellipse(0, -sz * .45, sz * .42, sz * .48, 0, 0, 7); x.fill(); x.stroke();
    x.fillStyle = '#fff'; x.beginPath(); x.ellipse(0, -sz * .22, sz * .26, sz * .24, 0, 0, 7); x.fill();
    for (const sgn of [-1, 1]){ x.fillStyle = '#fff'; x.beginPath(); x.arc(sgn * sz * .14, -sz * .6, sz * .09, 0, 7); x.fill(); x.stroke(); x.fillStyle = INK; x.beginPath(); x.arc(sgn * sz * .12, -sz * .59, sz * .045, 0, 7); x.fill();
      x.strokeStyle = dark; x.lineWidth = 4; x.beginPath(); x.moveTo(sgn * sz * .04, -sz * .7); x.lineTo(sgn * sz * .24, -sz * .76); x.stroke(); x.strokeStyle = INK; x.lineWidth = 3; }
    x.fillStyle = '#5a1a1a'; x.beginPath(); x.ellipse(0, -sz * .4, sz * .13, sz * .06, 0, 0, 7); x.fill(); x.fillStyle = '#fff'; x.fillRect(-sz * .08, -sz * .45, sz * .05, sz * .05); x.fillRect(sz * .03, -sz * .45, sz * .05, sz * .05);
    if (boss){ x.fillStyle = '#ffd34a'; x.beginPath(); x.moveTo(-sz * .2, -sz * .88); x.lineTo(-sz * .2, -sz * 1.02); x.lineTo(-sz * .1, -sz * .94); x.lineTo(0, -sz * 1.06); x.lineTo(sz * .1, -sz * .94); x.lineTo(sz * .2, -sz * 1.02); x.lineTo(sz * .2, -sz * .88); x.closePath(); x.fill(); x.stroke(); }
    x.restore();
  }
  function trollGame(){
    const g = snowGame(), mounds = g.mounds, pops = [], balls = [], splats = [], shots = [];
    let spawn = .4, shake = 0, left = C.n, bossOut = false;
    const total = C.n + (C.boss ? 1 : 0);
    return {
      good: 0, great: 0,
      tap(px, py){
        let best = null;
        for (const p of pops){ if (p.dead) continue; const m = mounds[p.m], sz = m.s * (p.boss ? 1.35 : .95) * p.rise; if (Math.abs(px - m.x) < sz * .5 && py < m.y + 6 && py > m.y - sz * 1.15) best = p; }
        balls.push({x0: W / 2, y0: H + 20, x1: px, y1: py, t: 0});
        if (!best){ ctx.sfx.tap(); return; }
        best.hp--; best.hurt = .25; splats.push({x: px, y: py, t: 0});
        if (best.hp <= 0){ best.dead = true; best.deadT = 0; score++; const m = mounds[best.m]; float(best.boss ? 'Chef vaincu !' : 'Ouste !', m.x, m.y - m.s, best.boss ? '#ffd84a' : '#fff'); ctx.sfx.collect(); if (score >= total) setTimeout(() => finish(true), 500); }
        else ctx.sfx.tap();
      },
      update(dt, rdt){
        g.relayout();
        spawn -= dt;
        if (dt > 0 && spawn <= 0){
          spawn = C.every * (.8 + Math.random() * .4);
          const free = mounds.map((_, i) => i).filter(i => !pops.some(p => p.m === i));
          if (left > 0 && free.length){ left--; pops.push({m: free[Math.floor(Math.random() * free.length)], t: 0, rise: 0, hp: C.hp, atk: C.atk * (.85 + Math.random() * .3), hurt: 0}); }
          else if (!left && C.boss && !bossOut && !pops.some(p => p.m === 4)){ bossOut = true; pops.push({m: 4, t: 0, rise: 0, hp: C.bossHp, atk: C.atk * 1.6, boss: true, hurt: 0, max: C.bossHp}); float('Le chef arrive !', W / 2, H * .3, '#ffd84a'); }
        }
        for (const p of pops){
          p.t += dt; p.hurt = Math.max(0, p.hurt - rdt);
          if (p.dead){ p.deadT += rdt; p.rise = Math.max(0, p.rise - rdt * 4); continue; }
          p.rise = Math.min(1, p.t / .25);
          if (dt > 0 && p.t > p.atk){ p.t = .25; const m = mounds[p.m]; shots.push({x0: m.x, y0: m.y - m.s * .6, t: 0}); }
        }
        for (let i = pops.length - 1; i >= 0; i--) if (pops[i].dead && pops[i].deadT > .4) pops.splice(i, 1);
        for (const sh of shots){ sh.t += rdt * 1.6; if (sh.t >= 1 && !sh.hit){ sh.hit = true; hearts--; shake = .4; ctx.sfx.err(); if (hearts <= 0 && state === 'play') finish(false); } }
        for (let i = shots.length - 1; i >= 0; i--) if (shots[i].t > 1.2) shots.splice(i, 1);
        for (const b of balls) b.t += rdt * 6;
        for (let i = balls.length - 1; i >= 0; i--) if (balls[i].t > 1) balls.splice(i, 1);
        for (const sp of splats) sp.t += rdt;
        for (let i = splats.length - 1; i >= 0; i--) if (splats[i].t > .5) splats.splice(i, 1);
        shake = Math.max(0, shake - rdt);
      },
      draw(){
        x.save(); if (shake) x.translate((Math.random() - .5) * 16 * shake, 0);
        g.drawScene((i, m) => { const p = pops.find(p => p.m === i); if (!p || p.rise <= 0) return;
          const sz = m.s * (p.boss ? 1.35 : .95); x.save(); x.beginPath(); x.rect(m.x - sz, m.y - sz * 2, sz * 2, sz * 2); x.clip();
          drawTroll(m.x, m.y + sz * (1 - p.rise) * .9 + m.s * .05, sz, T, p.hurt > 0, p.boss); x.restore();
          if (!p.dead && (p.boss || C.hp > 1)){ const mx = p.max || C.hp, w = sz * .7; x.fillStyle = INK; x.fillRect(m.x - w / 2 - 2, m.y - sz * 1.25 - 2, w + 4, 10); x.fillStyle = '#ff5a5a'; x.fillRect(m.x - w / 2, m.y - sz * 1.25, w * p.hp / mx, 6); }
          if (!p.dead && p.t > p.atk - .5){ x.fillStyle = '#ff3b3b'; x.font = '400 28px "Lilita One", sans-serif'; x.textAlign = 'center'; x.fillText('!', m.x + sz * .45, m.y - sz * .9); } });
        for (const sp of splats){ x.globalAlpha = 1 - sp.t * 2; x.fillStyle = '#fff'; for (let k = 0; k < 7; k++){ const a = k * .9, r = 10 + sp.t * 60; x.beginPath(); x.arc(sp.x + Math.cos(a) * r, sp.y + Math.sin(a) * r, 6 - sp.t * 8, 0, 7); x.fill(); } }
        x.globalAlpha = 1;
        for (const b of balls){ const t = b.t, bx = b.x0 + (b.x1 - b.x0) * t, by = b.y0 + (b.y1 - b.y0) * t - Math.sin(t * Math.PI) * 80; x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.arc(bx, by, 12 * (1 - t * .4), 0, 7); x.fill(); x.stroke(); }
        for (const sh of shots){ const t = Math.min(1, sh.t), r = 10 + t * 70; x.globalAlpha = sh.t > 1 ? Math.max(0, 1 - (sh.t - 1) * 5) : 1; x.fillStyle = '#e8f2ff'; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.arc(sh.x0 + (W / 2 - sh.x0) * t, sh.y0 + (H * .62 - sh.y0) * t, r, 0, 7); x.fill(); x.stroke(); }
        x.globalAlpha = 1; x.restore();
      },
    };
  }

  /* ================================================================
     LA TOUR DE CADEAUX (un doigt : lâcher le cadeau pile sur la tour)
     ================================================================ */
  function stackGame(){
    const PAL = [['#ff5a6e', '#d02c4a', '#ffd34a'], ['#3fb6ff', '#1f7fd0', '#ffffff'], ['#5ad27a', '#2a9a50', '#ff5a6e'], ['#ffc23a', '#e08a10', '#d02c4a'], ['#b07cff', '#7a48d8', '#ffd34a'], ['#ff8fc8', '#e0559a', '#ffffff']];
    const tone = (f, d = .09, v = .05) => ctx.tone?.(f, d, 'triangle', v);
    const BH = () => Math.max(26, Math.min(40, W / 11)), D = () => BH() * .32;          // hauteur d'un cadeau, profondeur du dessus
    const baseY = () => H * .74;
    let tower = [], cur = null, debris = [], sparks = [], rings = [], camY = 0, combo = 0, shake = 0, flash = 0, over = false, dropT = 0;
    const flakes = Array.from({length: 60}, () => [Math.random(), Math.random(), .4 + Math.random()]);
    const stars = Array.from({length: 80}, () => [Math.random(), Math.random(), Math.random() * 6]);
    function reset(){ const w = Math.min(W * .46, 220); tower = [{x: W / 2 - w / 2, w, c: 0, sleigh: 1}]; spawn(); }
    function spawn(){ const top = tower[tower.length - 1], n = tower.length, from = n % 2 ? -1 : 1;
      cur = {x: from < 0 ? top.x - top.w - 24 : top.x + top.w + 24, w: top.w, dir: -from, c: n % PAL.length, sp: Math.min(W * 1.25, W * (.42 + n * .025))}; }
    const yOf = i => baseY() - i * BH();                                                  // bas du cadeau n° i (avant caméra)
    function drop(){
      if (!cur || over) return; const top = tower[tower.length - 1], i = tower.length;
      const l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w), ov = r - l;
      if (ov <= 2){ // raté : le cadeau tombe, fin de partie
        debris.push({x: cur.x, w: cur.w, y: yOf(i - 1), c: cur.c, vy: 0, vx: cur.dir * 60, a: 0, va: cur.dir * 2.5}); cur = null; over = true; shake = .5;
        ctx.sfx.err(); floats.length = 0; float('Raté !', W / 2, H * .4, '#ff9aa8'); endAt = performance.now() + 1100; return; }
      const perfect = Math.abs(cur.x - top.x) < Math.max(5, top.w * .035);
      let nx = l, nw = ov;
      if (perfect){ nx = top.x; nw = top.w; combo++;
        if (combo >= 3){ const g = Math.min(12, Math.min(W * .46, 220) - nw); if (g > 0){ nw += g; nx -= g / 2; } }
        score += 1 + Math.min(combo, 5); flash = 1; rings.push({y: yOf(i - 1), x: nx, w: nw, t: 0});
        for (let k = 0; k < 18; k++) sparks.push({x: nx + Math.random() * nw, y: yOf(i - 1) - BH() / 2, vx: (Math.random() - .5) * 260, vy: -80 - Math.random() * 220, t: 0, c: ['#ffd34a', '#fff', PAL[cur.c][0]][k % 3]});
        float(combo > 1 ? `Parfait ×${combo}` : 'Parfait !', W / 2, yOf(i - 1) + camY - BH() * 1.8, '#ffd84a');
        tone(523 * Math.pow(1.122, Math.min(combo, 12)), .14, .06); tone(784 * Math.pow(1.122, Math.min(combo, 12)), .18, .04);
      } else {
        combo = 0; score += 1; ctx.sfx.pop?.();
        // le morceau qui dépasse tombe en tournant
        if (cur.x < top.x) debris.push({x: cur.x, w: top.x - cur.x, y: yOf(i - 1), c: cur.c, vy: 0, vx: -70, a: 0, va: -2.2});
        if (cur.x + cur.w > top.x + top.w) debris.push({x: top.x + top.w, w: cur.x + cur.w - top.x - top.w, y: yOf(i - 1), c: cur.c, vy: 0, vx: 70, a: 0, va: 2.2});
      }
      tower.push({x: nx, w: nw, c: cur.c, land: 1}); dropT = .12; spawn();
    }
    function gift(px, py, w, h, c, {bow = false, land = 0} = {}){            // cadeau en fausse 3D : face avant + dessus + rubans
      const d = D(), [f, s2, rb] = PAL[c], sq = land * 4;
      x.save(); x.translate(0, sq); const hh = h - sq;
      x.fillStyle = s2; x.fillRect(px, py - hh, w, hh);                                   // face
      x.fillStyle = f; x.fillRect(px, py - hh, w, hh * .82);
      x.fillStyle = 'rgba(255,255,255,.22)'; x.fillRect(px, py - hh, w, 3);
      x.beginPath(); x.moveTo(px, py - hh); x.lineTo(px + d * .9, py - hh - d); x.lineTo(px + w + d * .9, py - hh - d); x.lineTo(px + w, py - hh); x.closePath();
      x.fillStyle = f; x.fill(); x.fillStyle = 'rgba(255,255,255,.35)'; x.fill();                 // dessus clair
      x.beginPath(); x.moveTo(px + w, py - hh); x.lineTo(px + w + d * .9, py - hh - d); x.lineTo(px + w + d * .9, py - d); x.lineTo(px + w, py); x.closePath(); x.fillStyle = s2; x.fill();   // côté
      if (w > 14){ const rw = Math.min(10, w * .16), cx = px + w / 2 - rw / 2;                    // rubans
        x.fillStyle = rb; x.fillRect(cx, py - hh, rw, hh); x.fillRect(px, py - hh * .58, w, Math.min(8, hh * .2));
        x.beginPath(); x.moveTo(cx, py - hh); x.lineTo(cx + d * .9, py - hh - d); x.lineTo(cx + rw + d * .9, py - hh - d); x.lineTo(cx + rw, py - hh); x.fill(); }
      x.lineWidth = 2.5; x.strokeStyle = INK; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(px, py); x.lineTo(px, py - hh); x.lineTo(px + d * .9, py - hh - d); x.lineTo(px + w + d * .9, py - hh - d); x.lineTo(px + w + d * .9, py - d); x.lineTo(px + w, py); x.closePath(); x.stroke();
      x.beginPath(); x.moveTo(px + w, py); x.lineTo(px + w, py - hh); x.lineTo(px, py - hh); x.moveTo(px + w, py - hh); x.lineTo(px + w + d * .9, py - hh - d); x.stroke();
      if (bow){ const bx = px + w / 2 + d * .45, by = py - hh - d * .5; x.fillStyle = rb; x.strokeStyle = INK; x.lineWidth = 2;
        for (const sgn of [-1, 1]){ x.beginPath(); x.ellipse(bx + sgn * 9, by - 6, 9, 6, sgn * .5, 0, 7); x.fill(); x.stroke(); }
        x.beginPath(); x.arc(bx, by - 4, 4, 0, 7); x.fill(); x.stroke(); }
      x.restore();
    }
    function sleigh(px, py, w){ // traîneau rouge qui porte la tour
      x.save(); x.lineWidth = 3; x.strokeStyle = INK; x.lineJoin = 'round';
      x.fillStyle = '#d8333f'; x.beginPath(); x.moveTo(px - 14, py - 34); x.lineTo(px + w + 10, py - 34); x.quadraticCurveTo(px + w + 34, py - 34, px + w + 30, py - 62); x.lineTo(px + w + 44, py - 58); x.quadraticCurveTo(px + w + 50, py - 8, px + w, py - 8); x.lineTo(px - 4, py - 8); x.quadraticCurveTo(px - 22, py - 14, px - 14, py - 34); x.fill(); x.stroke();
      x.fillStyle = '#ffd34a'; x.fillRect(px - 6, py - 26, w + 26, 5); x.strokeRect(px - 6, py - 26, w + 26, 5);
      x.strokeStyle = '#8a5a2a'; x.lineWidth = 5; x.beginPath(); x.moveTo(px - 20, py + 4); x.lineTo(px + w + 28, py + 4); x.quadraticCurveTo(px + w + 50, py + 4, px + w + 48, py - 12); x.stroke();
      x.lineWidth = 3; for (const k of [.15, .7]){ x.beginPath(); x.moveTo(px + w * k, py - 8); x.lineTo(px + w * k, py + 4); x.stroke(); }
      x.restore();
    }
    function sky(h){ // le ciel change en montant : jour, coucher de soleil, aurore, étoiles
      const t = Math.min(1, h / 40), mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
      const stops = [[[110, 180, 250], [200, 230, 255]], [[255, 140, 120], [255, 210, 150]], [[70, 60, 160], [150, 110, 200]], [[14, 20, 60], [40, 50, 120]]];
      const seg = t * 3, i = Math.min(2, Math.floor(seg)), k = seg - i, top = mix(stops[i][0], stops[i + 1][0], k), bot = mix(stops[i][1], stops[i + 1][1], k);
      const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgb(${top})`); g.addColorStop(1, `rgb(${bot})`); x.fillStyle = g; x.fillRect(-30, -30, W + 60, H + 60);
      if (t > .45){ x.globalAlpha = Math.min(1, (t - .45) * 3); for (const [sx, sy, ph] of stars){ x.fillStyle = '#fff'; const r = 1 + Math.sin(T * 3 + ph) * .6; x.beginPath(); x.arc(sx * W, sy * H, Math.max(.3, r), 0, 7); x.fill(); } x.globalAlpha = 1; }
      if (t > .55){ x.globalAlpha = Math.min(.55, (t - .55) * 2); const a = x.createLinearGradient(0, H * .1, W, H * .35); a.addColorStop(0, 'rgba(63,224,160,0)'); a.addColorStop(.5, 'rgba(63,224,160,.8)'); a.addColorStop(1, 'rgba(160,110,255,0)');
        x.fillStyle = a; x.beginPath(); x.moveTo(0, H * .2); for (let k = 0; k <= 10; k++) x.lineTo(k * W / 10, H * (.16 + Math.sin(T * .8 + k * .7) * .04)); for (let k = 10; k >= 0; k--) x.lineTo(k * W / 10, H * (.3 + Math.sin(T * .6 + k * .9) * .04)); x.fill(); x.globalAlpha = 1; }
    }
    reset(); window.__stack = {cur: () => cur, top: () => tower[tower.length - 1], n: () => tower.length};
    return {
      good: 15, great: 30,
      tap(){ drop(); },
      update(dt, rdt){
        if (!tower.length || Math.abs(tower[0].w - Math.min(W * .46, 220)) > 1 && tower.length === 1) reset();
        if (cur && dt > 0){ cur.x += cur.dir * cur.sp * dt; const top = tower[tower.length - 1];
          // il passe entièrement d'un côté à l'autre de la tour : on peut vraiment rater
          if (cur.x > top.x + top.w + 24 && cur.dir > 0) cur.dir = -1; if (cur.x + cur.w < top.x - 24 && cur.dir < 0) cur.dir = 1; }
        const want = Math.max(0, (tower.length - 6) * BH()); camY += (want - camY) * Math.min(1, rdt * 5);
        for (const d of debris){ d.vy += 1400 * rdt; d.y += d.vy * rdt; d.x += d.vx * rdt; d.a += d.va * rdt; }
        debris = debris.filter(d => d.y - camY < H + 200);
        for (const p of sparks){ p.t += rdt; p.vy += 600 * rdt; p.x += p.vx * rdt; p.y += p.vy * rdt; } sparks = sparks.filter(p => p.t < .9);
        for (const r of rings) r.t += rdt; rings = rings.filter(r => r.t < .45);
        for (const b of tower) if (b.land) b.land = Math.max(0, b.land - rdt * 6);
        shake = Math.max(0, shake - rdt); flash = Math.max(0, flash - rdt * 3); dropT = Math.max(0, dropT - rdt);
        if (over && endAt && performance.now() > endAt){ endAt = 0; finish(); }
      },
      draw(){
        const h = tower.length - 1;
        x.save(); if (shake) x.translate((Math.random() - .5) * 18 * shake, (Math.random() - .5) * 10 * shake);
        sky(h);
        x.save(); x.translate(0, camY);
        // collines de neige et sapins au pied de la tour (ils descendent quand on monte)
        const gy = baseY() + 40; x.fillStyle = '#eaf2ff'; x.beginPath(); x.moveTo(-30, gy); for (let k = 0; k <= 8; k++) x.quadraticCurveTo((k - .5) * W / 8, gy - 26 - (k % 3) * 8, k * W / 8, gy); x.lineTo(W + 30, H + 400); x.lineTo(-30, H + 400); x.fill();
        for (let k = 0; k < 7; k++){ const tx = (k + .5) * W / 7 + (k % 2 ? 10 : -10), th = 46 + (k * 31 % 26); if (Math.abs(tx - W / 2) < Math.min(W * .3, 150)) continue;
          x.fillStyle = k % 2 ? '#2f9a62' : '#3cb070'; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.moveTo(tx - 20, gy - 8); x.lineTo(tx, gy - 8 - th); x.lineTo(tx + 20, gy - 8); x.closePath(); x.fill(); x.stroke();
          x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx - 8, gy - 8 - th * .62); x.lineTo(tx, gy - 8 - th); x.lineTo(tx + 8, gy - 8 - th * .62); x.fill(); }
        sleigh(tower[0].x, baseY() + 34, tower[0].w);
        // la tour
        for (let i = 1; i < tower.length; i++){ const b = tower[i], y = yOf(i - 1); if (y + camY < -60 || y + camY - BH() > H + 60) continue; gift(b.x, y, b.w, BH(), b.c, {land: b.land || 0}); }
        for (const r of rings){ const y = yOf(tower.length - 2); x.globalAlpha = 1 - r.t / .45; x.strokeStyle = '#fff'; x.lineWidth = 4; const g = r.t * 70; x.strokeRect(r.x - g, y - BH() - D() - g * .5, r.w + D() + g * 2, BH() + D() + g); x.globalAlpha = 1; }
        // le cadeau qui glisse, et l'ombre de là où il tomberait
        if (cur){ const y = yOf(tower.length - 1), top = tower[tower.length - 1], l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w);
          if (r > l){ x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(l, y - 4, r - l, 4); }
          gift(cur.x, y - 6 - Math.sin(T * 6) * 2, cur.w, BH(), cur.c, {bow: true}); }
        for (const d of debris){ x.save(); x.translate(d.x + d.w / 2, d.y - BH() / 2); x.rotate(d.a); gift(-d.w / 2, BH() / 2, d.w, BH(), d.c); x.restore(); }
        for (const p of sparks){ x.globalAlpha = 1 - p.t / .9; x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, 4, 0, 7); x.fill(); } x.globalAlpha = 1;
        x.restore();
        // neige
        x.fillStyle = 'rgba(255,255,255,.85)'; for (const f of flakes){ f[1] = (f[1] + f[2] * .0015) % 1; x.beginPath(); x.arc(f[0] * W + Math.sin(T + f[2] * 9) * 8, f[1] * H, f[2] * 2, 0, 7); x.fill(); }
        if (flash){ x.globalAlpha = flash * .25; x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
        // hauteur atteinte, en grand derrière la tour
        if (h > 0 && !over){ x.font = `400 ${Math.round(W * .09)}px "Lilita One", sans-serif`; x.textAlign = 'center'; x.lineWidth = 7; x.strokeStyle = INK; x.fillStyle = '#fff'; x.strokeText(h + (h > 1 ? ' étages' : ' étage'), W / 2, H * .2); x.fillText(h + (h > 1 ? ' étages' : ' étage'), W / 2, H * .2); }
        if (h === 0 && state === 'play'){ x.font = '400 22px "Lilita One", sans-serif'; x.textAlign = 'center'; x.lineWidth = 6; x.strokeStyle = INK; x.fillStyle = '#ffd84a'; const tt = 'Touche pour lâcher !'; x.strokeText(tt, W / 2, H * .3 + Math.sin(T * 4) * 4); x.fillText(tt, W / 2, H * .3 + Math.sin(T * 4) * 4); }
        x.restore();
      },
    };
  }
  function snowGame(){
    const mounds = [], pops = [], balls = [], splats = [];
    let spawn = .6, shake = 0;
    const layout = () => {
      mounds.length = 0;
      const top = H * .34, bottom = H * .86, cols = 3, rows = 3;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++){
        const y = top + (bottom - top) * (r + .5) / rows, s = Math.min(W / 3.4, (bottom - top) / 3.2) * (.82 + r * .1);
        mounds.push({x: W * (c + .5) / cols + (r % 2 ? -1 : 1) * W * .03, y, s});
      }
    };
    layout();
    const mound = m => { x.lineWidth = 3; x.strokeStyle = INK;
      const g = x.createLinearGradient(0, m.y - m.s * .2, 0, m.y + m.s * .2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#c6d6f0');
      x.fillStyle = g; x.beginPath(); x.moveTo(m.x - m.s * .56, m.y + m.s * .08); x.bezierCurveTo(m.x - m.s * .5, m.y - m.s * .2, m.x - m.s * .2, m.y - m.s * .26, m.x, m.y - m.s * .2); x.bezierCurveTo(m.x + m.s * .2, m.y - m.s * .28, m.x + m.s * .5, m.y - m.s * .18, m.x + m.s * .56, m.y + m.s * .08); x.quadraticCurveTo(m.x, m.y + m.s * .2, m.x - m.s * .56, m.y + m.s * .08); x.fill(); x.stroke();
      x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(m.x - m.s * .18, m.y - m.s * .12, m.s * .14, m.s * .04, -.2, 0, 7); x.fill(); };
    const scene = each => {
      const sky = x.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#6fa9ee'); sky.addColorStop(.3, '#bcd9fb'); sky.addColorStop(.32, '#f4f8ff'); sky.addColorStop(1, '#dde8f8');
      x.fillStyle = sky; x.fillRect(-20, 0, W + 40, H);
      for (let i = 0; i < 9; i++){ const tx = (i + .5) * W / 9, th = 50 + (i * 37 % 30); x.fillStyle = i % 2 ? '#2f8a5f' : '#3c9c6c'; x.beginPath(); x.moveTo(tx - 22, H * .32); x.lineTo(tx, H * .32 - th); x.lineTo(tx + 22, H * .32); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx - 9, H * .32 - th * .62); x.lineTo(tx, H * .32 - th); x.lineTo(tx + 9, H * .32 - th * .62); x.fill(); }
      for (let i = 0; i < mounds.length; i++){ each(i, mounds[i]); mound(mounds[i]); }
    };
    return {
      mounds, relayout(){ if (mounds.length && Math.abs(mounds[0].x - W / 6) > W * .2) layout(); }, drawScene: scene,
      good: 25, great: 45,
      tap(px, py){
        let best = null;
        for (const p of pops){ if (p.hit) continue; const m = mounds[p.m], h = p.rise * m.s * .9; if (Math.abs(px - m.x) < m.s * .45 && py < m.y + 4 && py > m.y - h - m.s * .1) best = p; }
        balls.push({x0: W / 2, y0: H + 20, x1: px, y1: py, t: 0});
        if (!best){ ctx.sfx.tap(); return; }
        best.hit = true; best.hitT = 0;
        const m = mounds[best.m];
        if (best.k === 'deer'){ score = Math.max(0, score - 3); shake = .3; float('-3 Oups !', m.x, m.y - m.s, '#ff9aa8'); ctx.sfx.err(); }
        else { const pts = best.k === 'gold' ? 5 : 1; score += pts; float(`+${pts}`, m.x, m.y - m.s, best.k === 'gold' ? '#ffd84a' : '#fff'); ctx.sfx.collect(); splats.push({x: px, y: py, t: 0}); }
      },
      update(dt, rdt){
        if (mounds.length && Math.abs(mounds[0].x - W / 6) > W * .2) layout();
        const prog = 1 - time / G.time;
        spawn -= dt;
        if (dt > 0 && spawn <= 0){
          spawn = .85 - prog * .45 + Math.random() * .2;
          const free = mounds.map((_, i) => i).filter(i => !pops.some(p => p.m === i));
          if (free.length){
            const r = Math.random();
            pops.push({m: free[Math.floor(Math.random() * free.length)], k: r < .08 ? 'gold' : r < .32 ? 'deer' : 'elf', t: 0, life: 1.4 - prog * .55, rise: 0, hit: false});
          }
        }
        for (const p of pops){
          p.t += dt;
          if (p.hit){ p.hitT += rdt; p.rise = Math.max(0, p.rise - rdt * 4); }
          else p.rise = p.t < .18 ? p.t / .18 : p.t > p.life - .18 ? Math.max(0, (p.life - p.t) / .18) : 1;
        }
        for (let i = pops.length - 1; i >= 0; i--) if ((!pops[i].hit && pops[i].t > pops[i].life) || (pops[i].hit && pops[i].hitT > .3)) pops.splice(i, 1);
        for (const b of balls) b.t += rdt * 6;
        for (let i = balls.length - 1; i >= 0; i--) if (balls[i].t > 1) balls.splice(i, 1);
        for (const s of splats) s.t += rdt;
        for (let i = splats.length - 1; i >= 0; i--) if (splats[i].t > .5) splats.splice(i, 1);
        shake = Math.max(0, shake - rdt);
      },
      draw(){
        x.save(); if (shake) x.translate((Math.random() - .5) * 14 * shake, 0);
        const sky = x.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#6fa9ee'); sky.addColorStop(.3, '#bcd9fb'); sky.addColorStop(.32, '#f4f8ff'); sky.addColorStop(1, '#dde8f8');
        x.fillStyle = sky; x.fillRect(-20, 0, W + 40, H);
        // sapins au loin
        for (let i = 0; i < 9; i++){ const tx = (i + .5) * W / 9, th = 50 + (i * 37 % 30); x.fillStyle = i % 2 ? '#2f8a5f' : '#3c9c6c'; x.beginPath(); x.moveTo(tx - 22, H * .32); x.lineTo(tx, H * .32 - th); x.lineTo(tx + 22, H * .32); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx - 9, H * .32 - th * .62); x.lineTo(tx, H * .32 - th); x.lineTo(tx + 9, H * .32 - th * .62); x.fill(); }
        for (let i = 0; i < mounds.length; i++){
          const m = mounds[i], p = pops.find(p => p.m === i);
          if (p && p.rise > 0){
            const im = img[p.k]; const h = m.s * .95;
            x.save(); x.beginPath(); x.rect(m.x - m.s, m.y - m.s * 2, m.s * 2, m.s * 2); x.clip();
            if (im){ const yy = m.y - h * p.rise - m.s * .05; x.globalAlpha = p.hit && p.k !== 'deer' ? .6 : 1; x.drawImage(im, m.x - h / 2, yy, h, h); }
            x.restore();
          }
          // butte de neige
          x.lineWidth = 3; x.strokeStyle = INK;
          const g = x.createLinearGradient(0, m.y - m.s * .2, 0, m.y + m.s * .2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#c6d6f0');
          x.fillStyle = g; x.beginPath(); x.moveTo(m.x - m.s * .56, m.y + m.s * .08); x.bezierCurveTo(m.x - m.s * .5, m.y - m.s * .2, m.x - m.s * .2, m.y - m.s * .26, m.x, m.y - m.s * .2); x.bezierCurveTo(m.x + m.s * .2, m.y - m.s * .28, m.x + m.s * .5, m.y - m.s * .18, m.x + m.s * .56, m.y + m.s * .08); x.quadraticCurveTo(m.x, m.y + m.s * .2, m.x - m.s * .56, m.y + m.s * .08); x.fill(); x.stroke();
          x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(m.x - m.s * .18, m.y - m.s * .12, m.s * .14, m.s * .04, -.2, 0, 7); x.fill();
        }
        for (const s of splats){ x.globalAlpha = 1 - s.t * 2; x.fillStyle = '#fff'; for (let k = 0; k < 7; k++){ const a = k * .9, r = 10 + s.t * 60; x.beginPath(); x.arc(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r, 6 - s.t * 8, 0, 7); x.fill(); } }
        x.globalAlpha = 1;
        for (const b of balls){ const t = b.t, bx = b.x0 + (b.x1 - b.x0) * t, by = b.y0 + (b.y1 - b.y0) * t - Math.sin(t * Math.PI) * 80; x.fillStyle = '#fff'; x.strokeStyle = INK; x.lineWidth = 2.5; x.beginPath(); x.arc(bx, by, 12 * (1 - t * .4), 0, 7); x.fill(); x.stroke(); }
        x.restore();
      },
    };
  }
}
