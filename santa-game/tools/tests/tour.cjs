// Tour de tous les écrans (iPhone SE) avec un village avancé : une capture par écran, à regarder une par une.
const {webkit, devices} = require('playwright');
const PANELS = ['shop', 'shop:chests', 'shop:skins', 'missions', 'pass', 'event', 'market', 'orders', 'build', 'stock', 'games', 'fish', 'pet', 'camp', 'lab', 'train', 'auction', 'museum', 'album', 'advent', 'lights', 'mine', 'todo', 'lore', 'profile', 'account'];
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(2000);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); }
  await p.evaluate(() => { const S = __v2.S; S.lvl = 30; S.coins = 5e5; S.wood = 5e5; S.cookies = 2e5; S.stars = 900; S.objs.find(o => o.type === 'santa').lv = 18; S.pet = {lv: 22, xp: 0, pat: 0};
    const add = (type, x, y) => S.objs.push({id: 'a' + type, type, x, y, lv: 5, t: Date.now() - 9e6, q: []});
    S.objs = S.objs.filter(o => !o.wild); add('workshop', 27, 24); add('stable', 12, 25); add('storage', 26, 11); add('mine', 9, 13); add('library', 31, 26); add('station', 31, 13); add('bakery', 9, 19); });
  await p.screenshot({path: 'out/tour-village.png'});
  for (const pn of PANELS){ const [n, a] = pn.split(':');
    await p.evaluate(([n, a]) => { try { __v2.openPanel(n, a); } catch(e){} }, [n, a]); await p.waitForTimeout(500);
    await p.screenshot({path: `out/tour-${pn.replace(':', '_')}.png`}); }
  console.log('écrans :', PANELS.length, '· erreurs :', errs.length ? errs : 'aucune'); await b.close(); })();
