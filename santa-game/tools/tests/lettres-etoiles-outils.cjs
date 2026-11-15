const {webkit, devices} = require('playwright');
(async () => { const b = await webkit.launch(); const log = [];
  for (const dev of ['iPhone SE', 'iPhone 13']){ const tag = dev.replace(' ', ''); const p = await (await b.newContext({...devices[dev], deviceScaleFactor: 1})).newPage();
  p.on('pageerror', e => log.push(tag + ' PAGEERR ' + e.message));
  await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(2000);
  await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); }); await p.waitForTimeout(600); await p.evaluate(() => document.querySelector('.tskip')?.click()); await p.waitForTimeout(800);
  await p.evaluate(() => { const S = __v2.S; S.lvl = 12; S.stars = 900; S.wood = 9e4; S.coins = 9e4; S.objs.find(o => o.type === 'santa').lv = 8; S.objs.push({id: 'w1', type: 'workshop', x: 27, y: 25, lv: 3, t: 0, q: []}); S.inv.train = 0; S.orders[0] = {items: {train: 2}, kid: 'Léa', coins: 50, xp: 5, msg: 'Un train !'}; });
  // 1 taille
  await p.evaluate(() => __v2.openPanel('profile')); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('[data-a=uisize][data-k="1.14"]')?.click()); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('#veil').click()); await p.waitForTimeout(500); await p.screenshot({path: `out/${tag}-big.png`});
  await p.evaluate(() => __v2.openPanel('profile')); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('[data-a=uisize][data-k="1"]')?.click()); await p.evaluate(() => document.querySelector('#veil').click());
  // 3 confirmation étoiles
  await p.evaluate(() => __v2.openPanel('shop', 'skins')); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('[data-a=skinbuy][data-c=house][data-k=ginger]').click()); await p.waitForTimeout(500);
  await p.screenshot({path: `out/${tag}-confirm.png`}); const before = await p.evaluate(() => __v2.S.stars);
  await p.evaluate(() => document.querySelector('#modal [data-m=yes]').click()); await p.waitForTimeout(500);
  log.push(tag + ` étoiles ${before} → ${await p.evaluate(() => __v2.S.stars)} maison ${await p.evaluate(() => __v2.S.skins.house)}`);
  // 5 loupe
  await p.evaluate(() => __v2.openPanel('orders')); await p.waitForTimeout(500); await p.screenshot({path: `out/${tag}-order.png`});
  await p.evaluate(() => document.querySelector('[data-a=findtoy]').click()); await p.waitForTimeout(600); await p.screenshot({path: `out/${tag}-craft.png`});
  await p.evaluate(() => document.querySelector('[data-a=backorder]').click()); await p.waitForTimeout(400); log.push(tag + ' retour lettre : ' + await p.evaluate(() => !!document.querySelector('[data-a=deliver]')));
  // 6 établi
  await p.evaluate(() => __v2.openPanel('bld', __v2.S.objs.find(o => o.type === 'sawmill'))); await p.waitForTimeout(500);
  const a0 = await p.evaluate(() => __v2.S.inv.axe || 0); await p.evaluate(() => document.querySelector('[data-a=mktool][data-k=axe]').click()); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-a=mktool]')?.scrollIntoView()); await p.evaluate(() => document.querySelector('.jobs:last-of-type')?.scrollIntoView()); await p.screenshot({path: `out/${tag}-tools.png`});
  log.push(tag + ` haches ${a0} → ${await p.evaluate(() => __v2.S.inv.axe)}`);
  }
  console.log(log.join('\n')); await b.close(); })();
