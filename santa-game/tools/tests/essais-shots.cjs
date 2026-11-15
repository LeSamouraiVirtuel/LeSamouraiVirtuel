// Captures de la page d'essais (copie du jeu) : AVANT / APRÈS, crépuscule et nuit, iPhone SE et PC.
const {webkit, chromium, devices} = require('playwright');
(async () => { const errs = [];
  for (const [dev, br, opt] of [['pc', chromium, {viewport: {width: 1440, height: 900}}], ['se', webkit, {...devices['iPhone SE']}]]){
    const b = await br.launch(br === chromium ? {executablePath: process.env.CHROMIUM_PATH} : {}); const p = await (await b.newContext(opt)).newPage();
    p.on('pageerror', e => errs.push(dev + ' ' + e.message));
    await p.goto('http://localhost:8765/essais/'); await p.waitForFunction(() => window.__ess && window.__v2, null, {timeout: 600000}); await p.waitForTimeout(2500);
    for (let i = 0; i < 6; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); document.querySelector('#modal:not([hidden]) [data-m]')?.click(); }); await p.waitForTimeout(400); }
    await p.evaluate(() => { __v2.cam.z = .85; __v2.centerOn(19, 19); });
    for (const [h, tag] of [[17.5, 'crepuscule'], [22, 'nuit']]){
      await p.evaluate(h => { const r = document.getElementById('xphour'); r.value = h; r.dispatchEvent(new Event('input', {bubbles: true})); }, h);
      for (const m of ['avant', 'apres']){ await p.click(`#xpbar [data-x=${m}]`); await p.waitForTimeout(2600); await p.screenshot({path: `out/essai-${dev}-${tag}-${m}.png`}); } }
    await b.close(); }
  console.log('erreurs :', errs.length ? errs.join(' | ') : 'aucune'); })();
