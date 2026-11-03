// Mini-jeux en 2D (canvas) : « Tournée de Noël » (traîneau) et « Bataille de boules de neige ».
// Les images viennent des rendus des vrais modèles 3D du jeu (ctx.icons).

const INK = '#1d2547';
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });

export const GAMES = {
  sleigh: {name: 'Tournée de Noël', rules: "Touche l'écran pour lâcher un cadeau. Vise les cheminées ! Plusieurs réussites d'affilée font grimper le combo.", time: 40},
  snow:   {name: 'Bataille de boules de neige', rules: "Touche les lutins farceurs qui sortent de la neige. Le bonhomme doré rapporte gros. Ne vise pas les rennes !", time: 30},
};

/**
 * ctx : {icons, reward(kind, score) -> {coins, xp, ...}, grant(rw), chipsHtml(rw), best(kind), setBest(kind, score), sfx}
 */
export async function openMinigame(kind, ctx){
  const G = GAMES[kind];
  const root = document.createElement('div'); root.id = 'mg'; root.className = 'mg-' + kind;
  root.innerHTML = `<canvas></canvas>
    <div class="mg-hud"><div class="mg-pill"><small>Score</small><b class="mg-score">0</b></div><div class="mg-pill"><small>Temps</small><b class="mg-time">${G.time}</b></div><button class="mg-quit" aria-label="Quitter"></button></div>
    <div class="mg-card"><small>Mini-jeu</small><h2>${G.name}</h2><p>${G.rules}</p><span class="mg-best">Record : ${ctx.best(kind)}</span><button class="btn green mg-go">C'est parti !</button></div>`;
  document.body.appendChild(root);
  const cv = root.querySelector('canvas'), x = cv.getContext('2d');
  const dpr = Math.min(2, devicePixelRatio || 1);
  let W, H;
  const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize(); addEventListener('resize', resize);
  const img = {};
  await Promise.all(Object.entries(ctx.icons).map(async ([k, v]) => { img[k] = await load(v); }));

  let state = 'intro', time = G.time, score = 0, raf = 0, last = performance.now(), T = 0;
  const floats = [];
  const float = (txt, fx, fy, color = '#fff') => floats.push({txt, x: fx, y: fy, t: 0, color});
  const game = kind === 'sleigh' ? sleighGame() : snowGame();

  function close(){ cancelAnimationFrame(raf); removeEventListener('resize', resize); root.remove(); ctx.onClose?.(); }
  root.querySelector('.mg-quit').onclick = () => { if (state === 'play' && !confirmQuit()) return; close(); };
  let quitArmed = 0;
  function confirmQuit(){ if (performance.now() - quitArmed < 2500) return true; quitArmed = performance.now(); float('Touche encore pour quitter', W / 2, H * .45, '#ffd84a'); return false; }
  root.querySelector('.mg-go').onclick = () => { root.querySelector('.mg-card').hidden = true; state = 'play'; ctx.sfx.tap(); };
  cv.addEventListener('pointerdown', e => { if (state === 'play') game.tap(e.clientX, e.clientY); });

  function finish(){
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
    if (state === 'play'){ time -= dt; if (time <= 0){ time = 0; finish(); } }
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
    root.querySelector('.mg-score').textContent = score;
    root.querySelector('.mg-time').textContent = Math.ceil(time);
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
    return {
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
