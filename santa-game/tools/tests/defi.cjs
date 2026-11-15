// Défis de la Maison clairs : carte permanente sur l'écran principal, « Y aller », fiche détaillée, Maison avec raison du bouton grisé,
// message quand une condition se remplit, explication une seule fois, niveaux déjà atteints gardés. Villages type des vrais joueurs (niv. 18 à 23).
const {webkit, chromium, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const VILLAGES = [
  {nom: 'joueur niv. 18, Maison 13 (défi avant blocage)', lvl: 18, hq: 13, orders: 40, exp: 6},
  {nom: 'joueur niv. 20, Maison 14', lvl: 20, hq: 14, orders: 25, exp: 3},
  {nom: 'joueur niv. 23, Maison 16, ne pêche ni ne combat', lvl: 23, hq: 16, orders: 90, exp: 20},
];
(async () => {
  for (const [dev, br, opt] of [['se', webkit, {...devices['iPhone SE']}], ['pc', chromium, {viewport: {width: 1440, height: 900}}]]){
    const b = await br.launch(br === chromium && process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {});
    for (const [vi, V] of VILLAGES.entries()){
      const c = await b.newContext(opt); await c.addInitScript(require('./invite.cjs')); const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1200);
      for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(500); }
      await p.evaluate(V => { const S = __v2.S; S.lvl = V.lvl; S.objs.find(o => o.type === 'santa').lv = V.hq; S.cnt.orders = V.orders; S.cnt.exp = V.exp; S.fish = {}; S.camps = {at: 0, st: {}};
        Object.assign(S, {coins: 9e7, wood: 9e6, cookies: 9e6, fabric: 9e6}); S.inv.ice = 9e4; S.inv.gold = 9e4; S.objs.push({id: 'ws', type: 'workshop', x: 27, y: 24, lv: 5, t: Date.now() - 9e6, q: []}); delete S.chIntro; }, V);
      // l'explication une seule fois
      const intro = await p.waitForSelector('#modal:not([hidden]) h2', {timeout: 9000}).then(h => h.textContent()).catch(() => '');
      ok(/défis de la Maison/i.test(intro), `${dev} · ${V.nom} : explication « ${intro} » à la prochaine connexion`);
      if (vi === 0) await p.screenshot({path: `out/defi-${dev}-intro.png`});
      await p.evaluate(() => document.querySelector('#modal [data-m=ok]')?.click()); await p.waitForTimeout(1500);
      // carte permanente
      const card = await p.evaluate(() => { const e = document.querySelector('#hqch'); return e && !e.hidden && e.offsetHeight ? e.innerText : ''; });
      ok(/Défi Maison/i.test(card) && /\d+\/\d+/.test(card) && /Y aller/i.test(card), `${dev} · ${V.nom} : carte « Défi de la Maison » visible (${card.replace(/\s+/g, ' ').slice(0, 90)})`);
      const over = await p.evaluate(() => { const a = document.querySelector('#hqch').getBoundingClientRect(), q = document.querySelector('#quest2').getBoundingClientRect(); return a.bottom <= q.top + 2 && a.top >= 0; });
      ok(over, `${dev} · la carte du défi ne chevauche pas la carte de quête`);
      await p.screenshot({path: `out/defi-${dev}-${vi}-ecran.png`});
      // jamais coincé : le jouet demandé est fabricable à son niveau, et les lettres donnent toujours des points
      const spec = await p.evaluate(() => { const h = __v2.S.objs.find(o => o.type === 'santa'); return {min: window.__chSpec?.min}; });
      // fiche détaillée
      await p.click('#hqch'); await p.waitForTimeout(600);
      const det = await p.evaluate(() => document.querySelector('#sheet').innerText);
      const ptsOk = /✓ \d+ points/.test(det); ok((/Atelier des jouets/i.test(det) && /garde ceux de ton stock/i.test(det) || /✓ \d+ jouets/.test(det)) && (ptsOk || /pêche/i.test(det) && /expédition/i.test(det) && /lettres/i.test(det)), `${dev} · fiche du défi : les chemins expliqués${ptsOk ? ' (points déjà réunis)' : ''}`);
      if (vi === 1) await p.screenshot({path: `out/defi-${dev}-fiche.png`});
      // « Y aller » des points → l'écurie / les lettres
      if (await p.$('#sheet [data-a=goorders]')){ await p.evaluate(() => document.querySelector('#sheet [data-a=goorders]').click()); await p.waitForTimeout(500);
        ok(await p.evaluate(() => /Bureau du traîneau/.test(document.querySelector('#sheet')?.innerText || '')), `${dev} · « Y aller » des lettres → Bureau du traîneau`); }
      await p.evaluate(() => document.querySelector('#sheet [data-a=close]')?.click()); await p.waitForTimeout(400);
      // fiche de la Maison : défi en haut, bouton grisé expliqué (sauf Maison 13 : défi pas encore bloquant ? il l'est pour le niveau 14)
      await p.evaluate(() => __v2.openPanel('bld', __v2.S.objs.find(o => o.type === 'santa'))); await p.waitForTimeout(500);
      const bt = await p.evaluate(() => document.querySelector('#sheet').innerText);
      ok(/Défi de la Maison/i.test(bt.slice(0, 400)) && /grisé parce que le défi/i.test(bt), `${dev} · fiche de la Maison : défi en haut + « Améliorer est grisé parce que… »`);
      if (vi === 1) await p.screenshot({path: `out/defi-${dev}-maison.png`});
      await p.evaluate(() => document.querySelector('#sheet [data-a=close]')?.click()); await p.waitForTimeout(300);
      // remplir les conditions : message + carte verte ; puis la Maison s'améliore ; le niveau atteint reste
      await p.evaluate(() => { const S = __v2.S; S.inv.train = 9; S.inv.box = 9; for (const k of ['bell', 'ginger', 'choco', 'wagon', 'nut', 'cane', 'sock', 'sled', 'plush']) S.inv[k] = 4; }); await p.waitForTimeout(1500);
      const t1 = await p.evaluate(() => document.querySelector('#toast')?.textContent || '');
      ok(/jouets réunis|réussi/i.test(t1), `${dev} · message quand une condition se remplit (« ${t1} »)`);
      await p.evaluate(() => { __v2.S.cnt.orders = 2000; }); await p.waitForTimeout(1500);
      const t2 = await p.evaluate(() => document.querySelector('#toast')?.textContent || ''), ready = await p.evaluate(() => document.querySelector('#hqch').classList.contains('ready'));
      ok(/réussi/i.test(t2) && ready, `${dev} · défi prêt : message (« ${t2} ») et carte verte`);
      if (vi === 0) await p.screenshot({path: `out/defi-${dev}-pret.png`});
      const lv0 = await p.evaluate(() => __v2.S.objs.find(o => o.type === 'santa').lv);
      await p.evaluate(() => { __v2.openPanel('bld', __v2.S.objs.find(o => o.type === 'santa')); document.querySelector('#sheet [data-a=upgrade]')?.click(); }); await p.waitForTimeout(700);
      const h1 = await p.evaluate(() => __v2.S.objs.find(o => o.type === 'santa'));
      ok(!!h1.up && h1.lv === lv0, `${dev} · défi rempli → chantier lancé, niveau ${lv0} gardé`);
      ok(!errs.length, `${dev} · aucune erreur ${errs.join(' | ')}`);
      await c.close();
    }
    await b.close();
  }
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); })();
