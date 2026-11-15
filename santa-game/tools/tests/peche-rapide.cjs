const {webkit, devices} = require('playwright');
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage(); const log = [];
  p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); } await p.waitForTimeout(600);
  await p.evaluate(() => { __v2.S.cookies = 9000; __v2.S.stars = 300; __v2.openPanel('fish'); }); await p.waitForTimeout(600); await p.screenshot({path: 'out/peche-fiche.png'});
  await p.click('[data-a=fishcast]'); await p.waitForTimeout(500);
  await p.waitForFunction(() => window.__fish?.st?.ph === 'bite', null, {timeout: 15000}); await p.mouse.click(160, 300); await p.waitForTimeout(200); await p.screenshot({path: 'out/peche-combat.png'});
  // robot : garde la tension dans le vert
  for (let i = 0; i < 200; i++){ const st = await p.evaluate(() => { const s = __fish.st; return s && {ph: s.ph, tau: s.tau, c: s.center}; }); if (!st || st.ph !== 'fight') break; await p.evaluate(h => { __fish.hold = h; }, st.tau < st.c); await p.waitForTimeout(50); }
  await p.waitForTimeout(1200); await p.screenshot({path: 'out/peche-fin.png'});
  log.push('fin : ' + await p.evaluate(() => document.querySelector('.fx-res:not([hidden])')?.innerText.replace(/\n+/g, ' | ').slice(0, 160)));
  console.log(log.join('\n')); await b.close(); })();
