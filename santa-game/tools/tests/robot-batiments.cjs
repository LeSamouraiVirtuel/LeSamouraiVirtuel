const {webkit, devices} = require('playwright');
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone 13'], deviceScaleFactor: 1})).newPage(); const errs = new Set();
  p.on('pageerror', e => errs.add(e.message + ' @ ' + String(e.stack || '').split('\n').slice(0, 3).join(' | ')));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); }); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.tskip')?.click()); await p.waitForTimeout(500);
  await p.evaluate(() => { const S = __v2.S, T = __v2.T, now = Date.now(); S.lvl = 13; S.tuto = 99; S.coins = 6200; S.wood = 382000; S.cookies = 369000; S.fabric = 384000; S.stars = 9100; S.objs.find(o => o.type === 'santa').lv = 17;
    S.pet = {lv: 45, xp: 769, pat: now - 1e3}; S.skins = {pet: 'gold', house: 'royal', elves: 'royal', own: {classic: 1, gold: 1, 'house:royal': 1, 'elves:royal': 1}};
    for (let cx = 0; cx < 6; cx++) for (let cy = 0; cy < 6; cy++){ const k = cx + ',' + cy; if (!S.chunks.includes(k) && Math.random() < .5) S.chunks.push(k); }
    const add = (type, lv, extra = {}) => { for (let x = 4; x < 60; x++) for (let y = 4; y < 60; y++){ if (__v2.fits(type, x, y)){ S.objs.push({id: 'z' + Math.random(), type, x, y, lv, t: now - 9e6, ...extra}); return; } } };
    add('workshop', 1, {build: now + 17e3, btotal: 20e3, q: []}); add('stable', 3); add('mine', 2); add('storage', 5); add('bakery', 4); add('mill', 3); add('icewell', 2); add('foundry', 1); add('library', 2); add('station', 2); add('theater', 1); add('cabin', 2); add('cabin', 2);
    __v2.cam.z = .9; __v2.centerOn(21, 21); });
  await p.waitForTimeout(3000);
  for (let round = 0; round < 2; round++){
    const pts = await p.evaluate(() => __v2.S.objs.filter(o => !o.wild && o.type !== 'path').map(o => { const B = __v2.T.BUILDINGS[o.type], c = __v2.screen(o.x + B.w / 2, o.y + B.h / 2); return [o.x + B.w / 2, o.y + B.h / 2]; }));
    for (const [x, y] of pts){ await p.evaluate(([x, y]) => __v2.centerOn(x, y), [x, y]); await p.waitForTimeout(150); const c = await p.evaluate(([x, y]) => __v2.screen(x, y), [x, y]); await p.mouse.click(c.x, c.y - 15); await p.waitForTimeout(350);
      // tout bouton d'action visible dans la fiche (sauf achat/vente/déplacement)
      const btns = await p.evaluate(() => [...document.querySelectorAll('#sheet [data-a]')].map(b => b.dataset.a).filter(a => !/sell|move|iap|pack|buy|trash|rename|reset|retuto|account|save|diag/.test(a)).slice(0, 6));
      for (const a of btns){ await p.evaluate(a => document.querySelector(`#sheet [data-a="${a}"]`)?.click(), a); await p.waitForTimeout(200); await p.evaluate(() => { const m = document.querySelector('#modal'); if (m && !m.hidden) m.querySelector('[data-m]')?.click(); }); }
      await p.evaluate(() => document.querySelector('#veil')?.click()); await p.waitForTimeout(100); }
    await p.waitForTimeout(20000);
  }
  for (const id of ['b-daily', 'b-games', 'b-album', 'b-parcels', 'b-advent', 'b-missions', 'b-pass', 'b-event', 'b-market', 'b-orders', 'b-barn', 'b-build', 'b-shop']){ await p.evaluate(id => document.getElementById(id)?.click(), id); await p.waitForTimeout(400); await p.evaluate(() => { const m = document.querySelector('#modal'); if (m && !m.hidden) m.querySelector('[data-m]')?.click(); document.querySelector('#veil')?.click(); }); }
  await p.waitForTimeout(3000);
  console.log([...errs].join('\n') || 'aucune erreur'); await b.close(); })();
