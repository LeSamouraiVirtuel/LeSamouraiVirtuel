// Course plus dure : défi de la Maison (niv. 14+) affiché et bloquant, jouets consommés ; plafond de 24 h d'accélération par jour.
const {webkit, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => { const b = await webkit.launch(); const p = await (await b.newContext({...devices['iPhone SE']})).newPage();
  p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/?freins=1'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); }
  await p.evaluate(() => { const S = __v2.S, h = S.objs.find(o => o.type === 'santa'); h.lv = 13; S.lvl = 40; Object.assign(S, {coins: 9e7, wood: 9e6, cookies: 9e6, fabric: 9e6, stars: 99999}); S.inv.ice = 9e4; S.inv.gold = 9e4; __v2.openPanel('bld', h); });
  await p.waitForTimeout(600); await p.screenshot({path: 'out/course-defi.png', fullPage: false});
  const txt = await p.evaluate(() => document.querySelector('#sheet').innerText);
  ok(/Défi de la Maison niv\. 14/i.test(txt) && /jouets fabriqués/i.test(txt) && /points d'aventure/i.test(txt) && /Pêcher/i.test(txt) && /camp de trolls/i.test(txt) && /expédition/i.test(txt) && /lettres/i.test(txt) && /il en manque/i.test(txt), 'défi niv. 14 affiché : jouets + points d\'aventure par 4 chemins, ce qui manque');
  await p.evaluate(() => { const h = __v2.S.objs.find(o => o.type === 'santa'); document.querySelector('#sheet [data-a=upgrade]')?.click(); });
  await p.waitForTimeout(500);
  await p.waitForTimeout(700); await p.screenshot({path: 'out/course-defi-scroll.png'});
  ok(await p.evaluate(() => !__v2.S.objs.find(o => o.type === 'santa').up), 'sans le défi, la Maison ne s\'améliore pas (même avec 99 999 étoiles)');
  await p.evaluate(() => { const S = __v2.S; S.inv.bell = 1; S.inv.ginger = 2; S.cnt.orders = 30; S.cnt.exp = 4; __v2.openPanel('bld', S.objs.find(o => o.type === 'santa')); });
  await p.waitForTimeout(500); await p.screenshot({path: 'out/course-defi-ok.png'});
  await p.evaluate(() => document.querySelector('#sheet [data-a=upgrade]')?.click()); await p.waitForTimeout(800);
  const st = await p.evaluate(() => ({up: !!__v2.S.objs.find(o => o.type === 'santa').up, bell: __v2.S.inv.bell, ginger: __v2.S.inv.ginger}));
  ok(st.up && st.bell === 1 && st.ginger === 0, `défi rempli SANS pêche ni combat (lettres + expéditions) → chantier lancé, 2 jouets consommés, les moins chers d'abord (cloches ${st.bell}, pain d'épices ${st.ginger})`);
  // plafond : 23 h 30 déjà accélérées aujourd'hui, le chantier de 4 jours ne peut pas être accéléré
  await p.evaluate(() => { __v2.S.spd = {d: new Date().toDateString(), sec: 23.5 * 3600}; __v2.openPanel('site', __v2.S.objs.find(o => o.type === 'santa')); }); await p.waitForTimeout(500);
  const s0 = await p.evaluate(() => __v2.S.stars);
  await p.evaluate(() => document.querySelector('#sheet [data-a=speed]')?.click()); await p.waitForTimeout(600);
  const toastT = await p.evaluate(() => document.querySelector('#toast')?.textContent || '');
  ok(await p.evaluate(() => __v2.S.stars) === s0 && /aujourd'hui|demain/.test(toastT), `plafond du jour : accélération refusée (« ${toastT} »)`);
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await b.close(); })();
