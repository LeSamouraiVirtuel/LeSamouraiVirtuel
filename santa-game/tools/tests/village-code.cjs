// Le code du village test éditeur niveau 20 se charge avec la fonction du jeu (Profil → Changer d'appareil sans compte → Charger ce code)
const {webkit, devices} = require('playwright'), fs = require('fs');
(async () => { const code = fs.readFileSync(__dirname + '/../editeur/village-test-niveau20.txt', 'utf8').trim();
  const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => { console.log('question :', d.message()); d.accept(); });
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1200);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(500); }
  await p.evaluate(() => __v2.openPanel('profile')); await p.waitForTimeout(400); await p.click('#sheet [data-a=savepanel]'); await p.waitForTimeout(500);
  await p.fill('#sheet textarea:not([readonly])', code); await p.screenshot({path: 'out/village-code.png'});
  await Promise.all([p.waitForNavigation({timeout: 30000}).catch(() => {}), p.click('#sheet [data-a=saveload]')]);
  await p.evaluate(() => document.querySelector('#modal:not([hidden]) [data-m=ok], #modal:not([hidden]) [data-m=yes]')?.click()).catch(() => {});
  await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(3000);
  const r = await p.evaluate(() => ({lvl: __v2.S.lvl, maison: __v2.T.hqLv(__v2.S), test: __v2.S.testEditeur, nom: __v2.S.name, poissons: Object.keys(__v2.S.fish || {}).length, camps: __v2.S.camps?.at, flags: __v2.S.flags}));
  console.log(JSON.stringify(r), 'erreurs :', errs.length ? errs : 'aucune'); await p.screenshot({path: 'out/village-code-charge.png'}); await b.close(); })();
