const {chromium} = require('playwright');
(async () => { const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH}); const p = await (await b.newContext({viewport: {width: 1440, height: 900}})).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/essais/'); await p.waitForFunction(() => window.__ess && window.__v2, null, {timeout: 600000}); await p.waitForTimeout(3500);
  await p.evaluate(() => { const r = document.getElementById('xphour'); r.value = 13; r.dispatchEvent(new Event('input', {bubbles: true})); __v2.cam.z = 1.05; __v2.centerOn(19, 18); });
  for (const m of ['avant', 'apres']){ await p.click(`#xpbar [data-x=${m}]`); await p.waitForTimeout(2500); await p.screenshot({path: `out/essai-bat-${m}.png`}); }
  console.log('erreurs :', errs.length ? errs : 'aucune'); await b.close(); })();
