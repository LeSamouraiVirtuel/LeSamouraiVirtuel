const {webkit, devices} = require('playwright');
const D = process.argv[2] || 'out/';
(async () => {
  const b = await webkit.launch();
  const ctx = await b.newContext({...devices['iPhone SE'], deviceScaleFactor: 2});
  const p = await ctx.newPage();
  const log = [];
  p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') log.push('ERR ' + m.text().slice(0, 160)); });
  let i = 0; const shot = async n => { await p.screenshot({path: D + String(i++).padStart(2, '0') + '-' + n + '.png', timeout: 90000}).catch(e => log.push('shot fail ' + n)); };
  await p.goto('http://localhost:8765/');
  await p.waitForFunction(() => window.__v2, null, {timeout: 600000});
  await p.waitForTimeout(1800); await shot('accueil');
  await p.waitForSelector('#cine.on', {timeout: 6000}).catch(() => {}); await p.waitForTimeout(1500); await shot('cine-intro');
  for (let k = 0; k < 3; k++){ await p.evaluate(() => document.querySelector('#cine.on .cskip')?.click()); await p.waitForTimeout(400); }
  await p.waitForTimeout(1600);
  const calm = () => p.waitForFunction(() => !__v2.glide && !(__v2.hold > 0), null, {timeout: 8000}).catch(() => {});
  const step = () => p.evaluate(() => __v2.S.tuto);
  const tl = (x, y) => p.evaluate(([x, y]) => __v2.screen(x, y), [x, y]);
  const tapTile = async (x, y, dy = -20) => { await p.waitForFunction(() => !__v2.glide && !(__v2.hold > 0), null, {timeout: 8000}).catch(() => {}); await p.waitForTimeout(150); const q = await tl(x, y); await p.touchscreen.tap(q.x, q.y + dy); };
  const intro = async () => { for (let k = 0; k < 8 && await p.evaluate(() => __v2.S.tuto) < 2; k++){ const r = await p.evaluate(() => { const b = document.querySelector('#tuto .tbox').getBoundingClientRect(); return {x: b.x + b.width / 2, y: b.y + b.height / 2}; }); await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(500); } };
  await intro(); await p.waitForTimeout(1500); await shot('t1-scierie');
  await tapTile(14.5, 16.5); await p.waitForTimeout(1500); await shot('t2-lettres'); log.push('step ' + await step());
  await tapTile(26.5, 16.5); await p.waitForTimeout(1500); await shot('t3-fiche'); log.push('step ' + await step());
  await tapTile(14.5, 16.5); await p.waitForTimeout(1500); await shot('t4-fiche-scierie'); log.push('step ' + await step());
  const up = await p.waitForSelector('[data-a=upgrade]', {timeout: 8000}).catch(() => null); { const s0 = await step(); for (let tr = 0; tr < 3 && await step() === s0; tr++){ const u2 = await p.waitForSelector('[data-a=upgrade]', {timeout: 8000}).catch(() => null); if (u2) await calm(), await u2.click({timeout: 5000}).catch(() => {}); await p.waitForTimeout(700); } } await p.waitForTimeout(1500); await shot('t5-chantier'); log.push('step ' + await step());
  await tapTile(14.5, 16.5); await p.waitForTimeout(1500); await shot('t6-site'); log.push('step ' + await step());
  const sp = await p.waitForSelector('[data-a=speed]', {timeout: 8000}).catch(() => null); if (sp) await calm(), await sp.tap({timeout: 4000}).catch(() => {}); await p.waitForTimeout(500); await shot('t7-praise'); await p.waitForTimeout(1300); await shot('t7-fini'); log.push('step ' + await step());
  { await shot('t7b-popup'); for (let k = 0; k < 4; k++){ const m = await p.waitForSelector('#modal:not([hidden]) [data-m]', {timeout: 8000}).catch(() => null); if (!m) break; await m.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(600); } }
  await calm(), await (await p.waitForSelector('#b-build', {timeout: 8000})).tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(1300); await shot('t8-construire');
  const bk = await p.waitForSelector('[data-a=place][data-k=bakery]', {timeout: 8000}).catch(() => null); if (bk) await calm(), await bk.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(1300); await shot('t9-placer');
  const ok = await p.waitForSelector('#pb-ok', {timeout: 8000}).catch(() => null); if (ok) await calm(), await ok.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(1500); await shot('t10-fin'); log.push('step ' + await step());
  for (let k = 0; k < 4 && await p.evaluate(() => __v2.tuto.active()); k++){ const r = await p.evaluate(() => { const b = document.querySelector('#tuto .tbox').getBoundingClientRect(); return {x: b.x + b.width / 2, y: b.y + b.height / 2}; }); await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(500); }
  await p.waitForTimeout(800); await shot('fin-bravo'); await (await p.$('#modal [data-m]'))?.tap().catch(() => {}); await p.waitForTimeout(1200); await shot('libre');
  // jeu libre : avancer (maison niv 2, atelier) pour voir les autres écrans
  await p.evaluate(() => { const S = __v2.S; S.coins += 5000; S.wood += 900; S.cookies += 600; });
  await p.evaluate(() => { const s = __v2.S.objs.find(o => o.type === 'santa'); __v2.centerOn(s.x + 2, s.y + 2); });
  await p.waitForTimeout(500); await tapTile(21, 20, -40); await p.waitForTimeout(1300); await shot('fiche-maison');
  const up2 = await p.waitForSelector('[data-a=upgrade]', {timeout: 8000}).catch(() => null); if (up2) await calm(), await up2.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(600);
  await p.evaluate(() => { for (const o of __v2.S.objs) if (o.up) o.up = Date.now(); for (const o of __v2.S.objs) if (o.build) o.build = Date.now(); });
  await p.waitForTimeout(1500); await shot('maison-niv2');
  const closeModal = async () => { for (let k = 0; k < 4; k++){ const m = await p.waitForSelector('#modal:not([hidden]) [data-m]', {timeout: 8000}).catch(() => null); if (!m) break; await m.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(500); } };
  await closeModal();
  await calm(), await (await p.waitForSelector('#b-build', {timeout: 8000})).tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(1000);
  const cat = await p.waitForSelector('[data-a=cat][data-k=town]', {timeout: 8000}).catch(() => null); if (cat) await calm(), await cat.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(900); await shot('construire-village');
  const ws = await p.waitForSelector('[data-a=place][data-k=workshop]', {timeout: 8000}).catch(() => null); if (ws) await calm(), await ws.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(900);
  const ok2 = await p.waitForSelector('#pb-ok', {timeout: 8000}).catch(() => null); if (ok2) await calm(), await ok2.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(500);
  await p.evaluate(() => { for (const o of __v2.S.objs) if (o.build) o.build = Date.now(); });
  await p.waitForTimeout(1500);
  const w = await p.evaluate(() => { const o = __v2.S.objs.find(o => o.type === 'workshop'); if (!o) return null; __v2.centerOn(o.x + 1.5, o.y + 1.5); return [o.x + 1.5, o.y + 1.5]; });
  log.push('workshop ' + JSON.stringify(w));
  await closeModal();
  if (w){ await p.waitForTimeout(500); await tapTile(w[0], w[1], -30); await p.waitForTimeout(1300); await shot('atelier');
    const tr = await p.waitForSelector('[data-a=queue][data-k=train]', {timeout: 8000}).catch(() => null); if (tr){ await tr.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(400); const tr2 = await p.waitForSelector('[data-a=queue][data-k=train]', {timeout: 8000}).catch(() => null); if (tr2) await calm(), await tr2.tap({timeout: 5000}).catch(() => {}); } await p.waitForTimeout(900); await shot('atelier-file'); }
  await closeModal(); const xx = await p.waitForSelector('[data-a=close]', {timeout: 8000}).catch(() => null); if (xx) await calm(), await xx.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(400);
  await (await p.$('#b-orders')).tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(1300); await shot('lettres');
  const x1 = await p.waitForSelector('[data-a=close]', {timeout: 8000}).catch(() => null); if (x1) await calm(), await x1.tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(500);
  await (await p.$('#b-barn')).tap({timeout: 5000}).catch(() => {}); await p.waitForTimeout(1000); await shot('stock');
  log.push(JSON.stringify(await p.evaluate(() => { const S = __v2.S; return {lvl: S.lvl, coins: S.coins, wood: S.wood, cookies: S.cookies, quest: S.quest.i, objs: S.objs.filter(o => !o.free && !o.wild).map(o => o.type + ':' + o.lv)}; })));
  console.log(log.join('\n'));
  await b.close();
})();
