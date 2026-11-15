// Toutes les attentes se passent avec des étoiles : atelier (toute la file), Flocon, établi à outils, grande commande, coup de main.
const {webkit, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1200);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(500); }
  await p.evaluate(() => { const S = __v2.S, t = Date.now(); S.lvl = 25; S.stars = 5000; S.chIntro = 1; Object.assign(S, {coins: 9e6, wood: 9e6, cookies: 9e6, fabric: 9e6});
    S.objs.push({id: 'ws', type: 'workshop', x: 27, y: 24, lv: 3, t: t - 9e6, q: [{item: 'bell', end: t + 600e3}, {item: 'sock', end: t + 1200e3}, {item: 'train', end: t + 1300e3}]});
    S.objs.push({id: 'st', type: 'storage', x: 26, y: 11, lv: 4, t: t - 9e6, bulkAt: t + 5 * 3600e3});
    S.objs.push({id: 'sb', type: 'stable', x: 12, y: 25, lv: 5, t: t - 9e6}); S.pet = {lv: 6, xp: 0, pat: t}; const saw = S.objs.find(o => o.type === 'sawmill'); saw.toolT = t; const cab = S.objs.find(o => o.type === 'cabin'); cab.helpAt = t + 3600e3; });
  const press = async () => { await p.evaluate(() => document.querySelector('#sheet [data-a=skip]')?.click()); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('#modal:not([hidden]) [data-m=ok], #modal:not([hidden]) [data-m=yes], #modal:not([hidden]) .btn.gold, #modal:not([hidden]) .btn.green')?.click()); await p.waitForTimeout(600); };
  const cases = [
    ['atelier : toute la file', () => __v2.openPanel('craft', __v2.S.objs.find(o => o.id === 'ws')), () => __v2.S.objs.find(o => o.id === 'ws').q.every(j => j.end <= Date.now())],
    ['Flocon', () => __v2.openPanel('pet'), () => __v2.S.pet.pat + 4 * 3600e3 <= Date.now()],
    ['établi à outils', () => __v2.openPanel('bld', __v2.S.objs.find(o => o.type === 'sawmill')), () => Date.now() - __v2.S.objs.find(o => o.type === 'sawmill').toolT >= 3 * 3600e3 - 1e3],
    ['grande commande', () => __v2.openPanel('bld', __v2.S.objs.find(o => o.id === 'st')), () => __v2.S.objs.find(o => o.id === 'st').bulkAt <= Date.now()],
    ['coup de main des lutins', () => __v2.openPanel('bld', __v2.S.objs.find(o => o.type === 'cabin')), () => __v2.S.objs.find(o => o.type === 'cabin').helpAt <= Date.now()],
  ];
  for (const [name, open, check] of cases){
    await p.evaluate(open); await p.waitForTimeout(500);
    const has = await p.$('#sheet [data-a=skip]'); if (name.startsWith('atelier')) await p.screenshot({path: 'out/passer-atelier.png'});
    const s0 = await p.evaluate(() => __v2.S.stars); await press();
    const s1 = await p.evaluate(() => __v2.S.stars), done = await p.evaluate(check);
    ok(!!has && done && s1 < s0, `${name} : bouton « Terminer ⭐ » présent, attente passée (${s0 - s1} étoiles)`);
    await p.evaluate(() => document.querySelector('#sheet [data-a=close]')?.click()); await p.waitForTimeout(300);
  }
  ok(!errs.length, 'aucune erreur ' + errs.join(' | '));
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await b.close(); })();
