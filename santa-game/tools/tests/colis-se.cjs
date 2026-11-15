const {webkit, devices} = require('playwright');
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE'], deviceScaleFactor: 1})).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); } await p.waitForTimeout(800);
  await p.evaluate(() => { __v2.S.parcels = [1, 2, 0]; __v2.S.lvl = 12; });
  for (let i = 0; i < 3; i++){
    await p.evaluate(() => document.getElementById('b-parcels').click()); await p.waitForTimeout(500);
    const c0 = await p.evaluate(() => __v2.S.coins);
    await p.evaluate(() => document.querySelector('#modal [data-m=open]').click()); await p.waitForTimeout(1600);
    await p.screenshot({path: `out/parcel-${i}.png`});
    const st = await p.evaluate(() => ({cls: document.querySelector('#modal').className, h2: document.querySelector('#modal h2')?.textContent, left: __v2.S.parcels.length}));
    await p.evaluate(() => document.querySelector('#modal [data-m]')?.click()); await p.waitForTimeout(800);
    console.log(i, JSON.stringify(st), 'pièces', c0, '→', await p.evaluate(() => __v2.S.coins));
  }
  await b.close(); })();
