// Anti-triche côté appareil : horloge avancée de 2 jours → le jeu se cale sur l'heure du serveur ; valeurs impossibles corrigées et notées.
const {webkit, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => { const b = await webkit.launch();
  const c = await b.newContext({...devices['iPhone SE']}); await c.addInitScript(require('./invite.cjs'));
  // horloge de l'appareil avancée de 2 jours
  await c.addInitScript(() => { const r = Date.now; Date.now = () => r() + 2 * 864e5; });
  const p = await c.newPage(); p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(4000);
  const skew = await p.evaluate(() => Math.round((Date.now() - performance.timeOrigin - performance.now()) / 60e3));
  ok(Math.abs(skew) < 3, `horloge avancée de 2 jours → le jeu reprend l'heure du serveur (écart restant ${skew} min)`);
  await p.waitForTimeout(5500);
  ok(await p.evaluate(() => (__v2.S.flags || {}).horloge >= 1), 'alerte « horloge » notée en silence pour le tableau de bord');
  // valeurs impossibles
  await p.evaluate(() => { const S = __v2.S; S.stars = -50; S.coins = 'abc'; localStorage.setItem('village-du-pole-v5', JSON.stringify(S)); });
  await p.reload(); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  const v = await p.evaluate(() => ({stars: __v2.S.stars, coins: __v2.S.coins, f: __v2.S.flags}));
  ok(v.stars === 0 && v.coins === 0 && v.f.valeur >= 1, `valeurs impossibles corrigées (étoiles ${v.stars}, pièces ${v.coins}) et notées`);
  // 50 000 étoiles et Maison niv. 20 mises à la main dans un village tout neuf, bâtiments au-delà du plafond
  await p.evaluate(() => { const S = __v2.S; S.stars = 50000; S.objs.find(o => o.type === 'santa').lv = 20; S.objs.find(o => o.type === 'sawmill').lv = 40; S.flagT = {}; localStorage.setItem('village-du-pole-v5', JSON.stringify(S)); });
  await p.reload(); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  const f2 = await p.evaluate(() => __v2.S.flags);
  ok(f2.etoiles >= 1 && f2.maison_niveau >= 1 && f2.maison_trop_vite >= 1 && f2.batiment_niveau >= 1, 'village modifié : étoiles, Maison et bâtiments signalés ' + JSON.stringify(f2));
  await p.evaluate(() => { const S = __v2.S; S.stars = 2500000; S.flagT = {}; localStorage.setItem('village-du-pole-v5', JSON.stringify(S)); });
  await p.reload(); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  const st = await p.evaluate(() => __v2.S.stars); ok(st < 20000, `2,5 M d'étoiles → ramenées à ${st}`);
  // new Date() suit l'heure corrigée
  const dd = await p.evaluate(() => Math.abs(new Date().getTime() - Date.now())); ok(dd < 1000, `new Date() suit l'heure corrigée (écart ${dd} ms)`);
  ok(await p.evaluate(() => !document.body.innerText.match(/triche|anomalie|alerte/i)), 'rien n\'est affiché au joueur');
  // hors ligne : horloge avancée de 3 jours, sans réseau → les chantiers ne se terminent pas
  const c2 = await b.newContext({...devices['iPhone SE']}); await c2.addInitScript(require('./invite.cjs'));
  const q = await c2.newPage(); await q.goto('http://localhost:8765/'); await q.waitForFunction(() => window.__v2, null, {timeout: 600000}); await q.waitForTimeout(2500);
  await q.evaluate(() => { const S = __v2.S, o = S.objs.find(o => o.type === 'sawmill'); o.up = Date.now() + 864e5; o.upTo = o.lv + 1; o.utotal = 864e5; localStorage.setItem('village-du-pole-v5', JSON.stringify(S)); localStorage.setItem('vdp-trust', String(Date.now())); });
  await c2.route('**/version.json*', r => r.abort()); await c2.addInitScript(() => { const r = Date.now; Date.now = () => r() + 3 * 864e5; });
  await q.reload(); await q.waitForFunction(() => window.__v2, null, {timeout: 600000}); await q.waitForTimeout(2500);
  ok(await q.evaluate(() => !!__v2.S.objs.find(o => o.type === 'sawmill').up), 'hors ligne, horloge avancée de 3 jours : le chantier n\'est pas terminé');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await b.close(); })();
