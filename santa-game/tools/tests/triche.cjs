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
  ok(await p.evaluate(() => !document.body.innerText.match(/triche|anomalie|alerte/i)), 'rien n\'est affiché au joueur');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await b.close(); })();
