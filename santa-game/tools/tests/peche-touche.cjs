// Pêche : la vraie touche est lisible. Petite touche → « petite touche… » gris ; toucher trop tôt une 1re fois → avertissement,
// une 2e fois → raté ; vraie touche → gros « ! » + éclaboussures + flash, et ferrer lance le combat.
const {webkit, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage();
  p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); }
  await p.evaluate(() => { __v2.S.cookies = 90000; __v2.S.stars = 300; __v2.openPanel('fish'); }); await p.waitForTimeout(600);
  await p.click('[data-a=fishcast]'); await p.waitForTimeout(200);
  await p.mouse.click(160, 300); await p.waitForTimeout(100);
  ok(await p.evaluate(() => __fish.st.ph) === 'wait', 'le doigt qui vient de lancer est ignoré');
  // forcer une petite touche puis toucher : avertissement
  await p.evaluate(() => { const s = __fish.st; s.t = 1; s.nib = [1.05]; s.bite = 6; }); await p.waitForTimeout(250); await p.screenshot({path: 'out/peche-petite-touche.png'});
  await p.mouse.click(160, 300); await p.waitForTimeout(150);
  const h1 = await p.evaluate(() => document.querySelector('.fx-hint, #mg .hint, [class*=hint]')?.textContent || '');
  ok(await p.evaluate(() => __fish.st.ph) === 'wait' && /Pas encore/.test(h1), '1re touche trop tôt → avertissement « ' + h1.slice(0, 60) + ' »');
  await p.mouse.click(160, 300); await p.waitForTimeout(900);
  ok(['miss', 'done'].includes(await p.evaluate(() => __fish.st.ph)), '2e touche trop tôt → le poisson a peur (la tension reste)');
  await p.waitForSelector('[data-x=again]', {timeout: 5000}); await p.click('[data-x=again]'); await p.waitForTimeout(300);
  await p.evaluate(() => { __fish.st.bite = __fish.st.t + .3; }); await p.waitForFunction(() => __fish.st.ph === 'bite', null, {timeout: 5000}); await p.waitForTimeout(120);
  await p.screenshot({path: 'out/peche-vraie-touche.png'});
  await p.mouse.click(160, 300); await p.waitForTimeout(150);
  ok(await p.evaluate(() => __fish.st.ph) === 'fight', 'vraie touche → ferrer lance le combat');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await b.close(); })();
