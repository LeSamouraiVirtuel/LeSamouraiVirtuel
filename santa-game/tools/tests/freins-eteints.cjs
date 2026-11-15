// Interrupteurs : défis de la Maison ALLUMÉS (remplis ici), plafond d'accélérations ÉTEINT : on accélère autant qu'on veut.
const {webkit, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); }
  ok(errs.length === 0, 'le jeu démarre sans erreur');
  await p.evaluate(() => { const S = __v2.S, h = S.objs.find(o => o.type === 'santa'); h.lv = 15; S.lvl = 40; Object.assign(S, {coins: 9e8, wood: 9e7, cookies: 9e7, fabric: 9e7, stars: 99999}); S.inv.ice = 9e5; S.inv.gold = 9e5; S.spd = {d: new Date().toDateString(), sec: 30 * 3600}; for (const k of ['bell', 'ginger', 'choco', 'wagon', 'wreath', 'ball']) S.inv[k] = 30; S.cnt.orders = 9000; S.cnt.exp = 900; S.chIntro = 1; __v2.openPanel('bld', h); });
  await p.waitForTimeout(600); const txt = await p.evaluate(() => document.querySelector('#sheet').innerText);
  ok(/Défi de la Maison/i.test(txt), 'défi de la Maison affiché (interrupteur allumé)');
  for (let k = 0; k < 3; k++){
    await p.evaluate(() => { __v2.S.objs.forEach(o => { delete o.up; }); __v2.openPanel('bld', __v2.S.objs.find(o => o.type === 'santa')); document.querySelector('#sheet [data-a=upgrade]')?.click(); }); await p.waitForTimeout(700);
    const up = await p.evaluate(() => !!__v2.S.objs.find(o => o.type === 'santa').up); ok(up, `Maison niv. ${15 + k} → ${16 + k} : chantier lancé (défi rempli)`);
    const s0 = await p.evaluate(() => __v2.S.stars);
    await p.evaluate(() => __v2.openPanel('site', __v2.S.objs.find(o => o.type === 'santa'))); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('#sheet [data-a=speed]')?.click()); await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelector('#modal:not([hidden]) [data-m=ok], #modal:not([hidden]) .btn.gold, #modal:not([hidden]) .btn.green')?.click()); await p.waitForTimeout(800);
    const s1 = await p.evaluate(() => __v2.S.stars); ok(s1 < s0, `accélération n°${k + 1} acceptée (déjà 30 h accélérées aujourd'hui) : ${s0 - s1} étoiles`);
    await p.evaluate(() => { for (const o of __v2.S.objs) if (o.up && o.up <= Date.now() + 5e3){ o.lv = o.upTo; delete o.up; } }); await p.waitForTimeout(300);
  }
  ok(errs.length === 0, 'aucune erreur pendant le test ' + errs.join(' | '));
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await b.close(); })();
