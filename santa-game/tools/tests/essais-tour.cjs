const {webkit, chromium, devices} = require('playwright');
(async () => { const errs = [];
  for (const [dev, br, opt] of [['pc', chromium, {viewport: {width: 1440, height: 900}}], ['se', webkit, {...devices['iPhone SE']}]]){
    const b = await br.launch(br === chromium ? {executablePath: process.env.CHROMIUM_PATH} : {}); const p = await (await b.newContext(opt)).newPage();
    p.on('pageerror', e => errs.push(dev + ' ' + e.message));
    await p.goto('http://localhost:8765/essais/'); await p.waitForFunction(() => window.__ess, null, {timeout: 600000}); await p.waitForTimeout(2500);
    await p.screenshot({path: `out/et-${dev}-0.png`});
    if (dev === 'se') await p.click('#xpbar [data-x=tog]');
    await p.click('#xpbar [data-x=camps]'); await p.waitForTimeout(1500); await p.screenshot({path: `out/et-${dev}-camps.png`});
    // toucher le camp actuel (le plus proche du centre-bas visible) : on clique sur le marqueur « TOI »
    const box = await p.evaluate(() => { const c = document.querySelector('.xpov canvas').getBoundingClientRect(); return [c.left + c.width / 2, c.top + c.height * .6]; });
    await p.waitForTimeout(1500); for (let dy = -200; dy <= 200 && !(await p.$('.xcard')); dy += 40) for (let dx = -300; dx <= 300 && !(await p.$('.xcard')); dx += 60) await p.mouse.click(box[0] + dx, box[1] + dy);
    await p.waitForTimeout(400); await p.screenshot({path: `out/et-${dev}-campcard.png`});
    await p.click('.xpov header [data-x=close]'); await p.waitForTimeout(400);
    await p.click('#xpbar [data-x=trans]'); await p.waitForTimeout(2500); await p.screenshot({path: `out/et-${dev}-cine.png`});
    for (let i = 0; i < 8 && await p.evaluate(() => document.body.classList.contains('cine')); i++){ await p.mouse.click(200, 300); await p.waitForTimeout(900); }
    await p.waitForTimeout(2500); await p.mouse.move(400, 500); await p.waitForTimeout(2500); await p.screenshot({path: `out/et-${dev}-epreuve.png`});
    await p.evaluate(() => document.querySelector('.xpov')?.remove());
    await p.click('#xpbar [data-x=lore]').catch(async () => { await p.click('#xpbar [data-x=tog]'); await p.click('#xpbar [data-x=lore]'); }); await p.waitForTimeout(600); await p.screenshot({path: `out/et-${dev}-lore.png`});
    await b.close(); }
  console.log('erreurs :', errs.length ? errs.join(' | ') : 'aucune'); })();
