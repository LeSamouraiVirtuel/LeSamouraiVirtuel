const {chromium: webkit0, devices} = require('playwright'); const webkit = {launch: () => webkit0.launch((process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}))};
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1})).newPage();
  p.on('pageerror', e => console.log('PAGEERR ' + e.message));
  await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); }); await p.waitForTimeout(800); await p.evaluate(() => document.querySelector('.tskip')?.click());
  const ci = +process.argv[2];
  await p.evaluate(ci => { const S = __v2.S; S.cookies = 9000; S.camps = {at: ci, st: {}}; __v2.openPanel('camp'); }, ci); await p.waitForTimeout(400);
  await p.click(`[data-a="campgo"][data-i="${ci}"]`); await p.waitForSelector('.mg-go', {state: 'visible', timeout: 30000}); await p.click('.mg-go'); await p.waitForTimeout(1500);
  // bot : vise le monstre vivant le plus proche (projection écran)
  const t0 = Date.now(); let k = 0, shot = 0;
  while (Date.now() - t0 < 75000){
    if (await p.$('.mg-claim')) break;
    if (await p.$('.b-cards:not([hidden])')){ if (!shot++) await p.screenshot({path: 'out/k-cards.png'}); await p.click('.b-cards [data-c]', {force: true}); await p.waitForTimeout(400); continue; }
    const tgt = await p.evaluate(() => { const f = __b3.foes.filter(f => !f.dead).sort((a, b) => b.o.position.z - a.o.position.z)[0]; if (!f) return null; return __b3.screen(f.o.position); });
    if (tgt){ await p.mouse.move(tgt.x, tgt.y); await p.mouse.down(); await p.waitForTimeout(450); await p.mouse.up(); } else await p.waitForTimeout(300);
    k++; if ([10, 40, 70, 110].includes(k)) await p.screenshot({path: 'out/k-' + k + '.png'});
  }
  await p.waitForTimeout(800); await p.screenshot({path: 'out/k-end.png'});
  console.log(await p.evaluate(() => document.querySelector('.mg-card:not([hidden]) h2')?.textContent + ' ' + __b3.killed));
  await b.close(); })();
