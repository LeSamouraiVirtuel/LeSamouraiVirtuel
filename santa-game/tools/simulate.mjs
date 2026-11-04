// Joueur simulé « actif » : il revient toutes les 30 s, récolte, améliore/construit ce qui est le moins cher, fabrique et livre.
const T = await import('../js/v2/town.js');
let now = Date.UTC(2026, 10, 10, 10);
const realNow = Date.now; Date.now = () => now;
const s = T.newTown(); s.tuto = 99;
const B = o => T.BUILDINGS[o.type];
const log = []; let lastLvl = 1, idle = 0;
const spot = (() => { let i = 0; return () => { i++; return {x: 2 + (i % 8) * 4, y: 2 + Math.floor(i / 8) * 4}; }; })();
for (let t = 0; t <= 3 * 3600; t += 30){
  now = Date.UTC(2026, 10, 10, 10) + t * 1000;
  let acted = false;
  for (const o of s.objs){
    if (o.build && now >= o.build){ delete o.build; o.t = now; T.addXp(s, T.buildXp(1) + 2); }
    if (o.up && now >= o.up){ o.lv = o.upTo; delete o.up; o.t = now; T.addXp(s, T.buildXp(o.lv)); }
    if (B(o).kind === 'prod'){ const g = T.collect(s, o); if (g > 0){ T.track(s, 'collect:' + B(o).res, g); T.addXp(s, Math.max(1, Math.round(g / 60))); acted = true; } }
  }
  // fin gratuite sous 3 min
  for (const o of s.objs){ const e = o.build || o.up; if (e && e - now <= T.freeFinish){ if (o.build) o.build = now; else o.up = now; } }
  // lettres : bureau
  const bu = s.objs.find(o => o.type === 'orders');
  const n = T.orderSlots(bu.lv); while (s.orders.length < n) s.orders.push(T.makeOrder(s, bu.lv));
  for (let i = 0; i < s.orders.length; i++){ const od = s.orders[i]; if (od.items && T.has(s, od.items)){ T.take(s, od.items); s.coins += Math.round(od.coins * T.albumBonus(s)); T.addXp(s, od.xp); for (const [k, q] of Object.entries(od.items)) T.track(s, 'deliver:' + k, q); if (od.mat) T.give(s, od.mat); if (od.stars) s.stars += od.stars; T.track(s, 'orders'); s.orders[i] = T.makeOrder(s, bu.lv); acted = true; } }
  // atelier : fabrique ce que demandent les lettres
  const ws = s.objs.find(o => o.type === 'workshop' && !o.build);
  if (ws){ ws.q ||= []; for (const j of ws.q.filter(j => j.end <= now)){ T.give(s, j.item); T.addXp(s, T.TOYS[j.item].xp); T.track(s, 'make:' + j.item); } ws.q = ws.q.filter(j => j.end > now);
    for (const od of s.orders) for (const [k, q] of Object.entries(od.items || {})){ const have = (s.inv[k] || 0) + ws.q.filter(j => j.item === k).length; if (have < q && ws.q.length < T.craftSlots(ws.lv) && T.has(s, T.TOYS[k].cost)){ T.take(s, T.TOYS[k].cost); const st = Math.max(now, ws.q.length ? ws.q[ws.q.length - 1].end : 0); ws.q.push({item: k, end: st + T.TOYS[k].time / T.craftSpeed(ws.lv) * 1000}); acted = true; } } }
  // constructions et améliorations (la Maison d'abord quand c'est possible)
  const opts = [];
  for (const type of Object.keys(T.BUILDINGS)){ const b = T.BUILDINGS[type]; if (b.kind === 'path' || b.kind === 'deco') continue; if (!T.buildBlock(s, type)) opts.push(['build', type]); }
  for (const o of s.objs) if (T.isUpgradable(B(o)) && !o.wild && !T.upBlock(s, o)) opts.push(['up', o]);
  opts.sort((a, b) => (a[0] === 'up' && a[1].type === 'santa' ? -1 : 0) - (b[0] === 'up' && b[1].type === 'santa' ? -1 : 0));
  for (const [kind, x] of opts.slice(0, 2)){
    if (kind === 'build' && !T.buildBlock(s, x)){ T.take(s, T.upCost(x, 1)); const p = spot(); const o = {id: 'x' + t + x, type: x, x: p.x, y: p.y, lv: 1, t: now}; const ms = T.upTime(x, 1) * 1000; if (ms){ o.build = now + ms; } if (T.BUILDINGS[x].kind === 'craft') o.q = []; s.objs.push(o); acted = true; }
    if (kind === 'up' && !T.upBlock(s, x)){ T.take(s, T.upCost(x.type, x.lv + 1)); x.up = now + T.upTime(x.type, x.lv + 1) * 1000; x.upTo = x.lv + 1; acted = true; }
  }
  // décorations quand on a des pièces en trop
  if (s.coins > 2000 && !T.buildBlock(s, 'tree')){ T.take(s, T.upCost('tree', 1)); const p = spot(); s.objs.push({id: 'd' + t, type: 'tree', x: p.x, y: p.y}); }
  // tâches
  for (let k = 0; k < 3; k++){ const r = T.questClaim(s); if (!r) break; for (const [rk, rn] of Object.entries(r)){ if (rk === 'xp') T.addXp(s, rn); else T.give(s, rk, rn); } }
  if (!acted) idle += 30;
  if (s.lvl !== lastLvl || t % 1800 === 0){ log.push(`${String(Math.floor(t / 60)).padStart(3)} min · niv ${s.lvl} · maison ${T.hqLv(s)} · tâche ${s.quest.i} · pièces ${s.coins} bois ${s.wood} biscuits ${s.cookies} tissu ${s.fabric} · bâtiments ${s.objs.filter(o => !o.free && !o.wild && T.isUpgradable(B(o))).map(o => o.type + o.lv).join(' ')}`); lastLvl = s.lvl; }
}
console.log(log.join('\n')); console.log('temps sans rien à faire :', Math.round(idle / 60), 'min sur 180');
Date.now = realNow;
