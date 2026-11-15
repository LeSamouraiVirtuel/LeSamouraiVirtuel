// Partie légale, sur iPhone SE (Safari) et PC (Chrome) :
// fenêtre « Conditions et confidentialité » avant l'écran d'accueil, refus de l'analyse possible (pas de mur),
// mineur : accord parental exigé pour l'analyse et porte parentale avant un achat, chances affichées, pages légales remplies,
// accord redemandé quand les textes changent, rien du suivi visible.
const {webkit, chromium, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const wk = await webkit.launch(), cr = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined});
  for (const [name, br, opt] of [['se', wk, {...devices['iPhone SE']}], ['pc', cr, {viewport: {width: 1500, height: 900}}]]){
    const p = await (await br.newContext(opt)).newPage(); p.on('pageerror', e => log.push(`PAGEERR ${name} ${e.message}`));
    await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000});
    const g = await p.waitForSelector('#legal .lcard', {timeout: 15000}).then(() => true).catch(() => false);
    ok(g && !(await p.$('#welcome')), `${name} : fenêtre des conditions d'abord, avant l'écran d'accueil`);
    await p.waitForTimeout(1500); await p.screenshot({path: `out/legal-${name}.png`});
    const over = await p.evaluate(() => { const c = document.querySelector('#legal .lcard').getBoundingClientRect(); return c.left >= 0 && c.right <= innerWidth + 1; });
    ok(over, `${name} : la fenêtre tient dans l'écran`);
    const btn = await p.evaluate(() => [...document.querySelectorAll('#legal [data-l=oui],#legal [data-l=non]')].map(b => { const r = b.getBoundingClientRect(); return [b.className, Math.round(r.width), Math.round(r.height)].join(' '); }));
    ok(btn[0].split(' ').slice(1).join() === btn[1].split(' ').slice(1).join() && btn[0].split(' ')[0] === btn[1].split(' ')[0] && btn[0].split(' ')[1] === btn[1].split(' ')[1], `${name} : « Refuser » et « Accepter » aussi visibles l'un que l'autre (${btn.join(' / ')})`);
    // sans année : refusé ; mineur : analyse sans parent refusée
    await p.click('#legal [data-l=go]'); ok(/année/.test(await p.innerText('#legal .lerr')), `${name} : il faut choisir l'année de naissance`);
    await p.selectOption('#lyear', String(new Date().getFullYear() - 11)); await p.click('#legal [data-l=oui]'); await p.click('#legal [data-l=go]');
    ok(await p.isVisible('#legal .lpar') && /parent/.test(await p.innerText('#legal .lerr')), `${name} : 11 ans → case « accord d'un parent », analyse refusée sans elle`);
    await p.screenshot({path: `out/legal-${name}-mineur.png`});
    await p.click('#legal [data-l=non]'); await p.click('#legal [data-l=go]'); await p.waitForTimeout(800);
    ok(!(await p.$('#legal')), `${name} : refuser l'analyse n'empêche pas de jouer`);
    const L = await p.evaluate(() => __v2.S.legal);
    ok(L && L.v && L.t && L.analyse === false && L.mineur === true && L.parent === false, `${name} : preuve de l'accord gardée ${JSON.stringify(L)}`);
    ok(!!(await p.waitForSelector('#welcome', {timeout: 15000}).catch(() => null)), `${name} : puis l'écran d'accueil`);
    const links = await p.evaluate(() => [...document.querySelectorAll('#welcome a')].map(a => a.getAttribute('href')).join(' '));
    ok(/cgu\.html/.test(links) && /privacy\.html/.test(links) && /mentions\.html/.test(links), `${name} : liens des 3 pages sur l'écran d'accueil`);
    await p.click('#welcome [data-w=guest]'); await p.waitForTimeout(600);
    await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); }); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.tskip')?.click()); await p.waitForTimeout(500);
    // porte parentale avant un achat en euros
    await p.evaluate(() => __v2.openPanel('shop')); await p.waitForTimeout(500);
    await p.click('#sheet [data-a=iap]'); await p.waitForTimeout(500);
    const pg = await p.evaluate(() => document.querySelector('#modal:not([hidden]) h2')?.textContent || '');
    ok(/parent/i.test(pg), `${name} : mineur sans accord → « Demande à un parent » avant l'achat`);
    await p.screenshot({path: `out/legal-${name}-parent.png`});
    await p.fill('#pg', '1'); await p.click('#modal [data-m=ok]'); await p.waitForTimeout(300);
    ok(!!(await p.$('#modal:not([hidden]) #pg')), `${name} : mauvaise réponse → l'achat ne passe pas`);
    const q = await p.evaluate(() => document.querySelector('#modal p').textContent.match(/(\d+) × (\d+)/).slice(1).map(Number));
    await p.fill('#pg', String(q[0] * q[1])); await p.click('#modal [data-m=ok]'); await p.waitForTimeout(500);
    ok(/Achat intégré/.test(await p.evaluate(() => document.querySelector('#modal:not([hidden]) small')?.textContent || '')), `${name} : bonne réponse d'un adulte → l'écran d'achat s'ouvre`);
    await p.evaluate(() => document.querySelector('#modal [data-m]:not([data-m=buy])')?.click() || (document.querySelector('#modal').hidden = true)); await p.waitForTimeout(300);
    // chances
    for (const [panel, k] of [['shop', 'all'], ['fish', 'peche']]){ await p.evaluate(pn => __v2.openPanel(pn), panel); await p.waitForTimeout(400);
      const has = await p.$(`#sheet [data-a=odds]`); ok(!!has, `${name} : bouton « Chances » dans ${panel}`); }
    await p.evaluate(() => __v2.openPanel('shop')); await p.waitForTimeout(300); await p.click('#sheet [data-a=odds]'); await p.waitForTimeout(400);
    const od = await p.evaluate(() => document.querySelector('#modal .mcard').innerText);
    ok(/Légendaire/i.test(od) && /%/.test(od) && /Grotte/i.test(od) && /Pêche/i.test(od) && /ventes/i.test(od) && /Expéditions/i.test(od), `${name} : toutes les chances affichées (colis, grotte, ventes, expéditions, pêche)`);
    await p.screenshot({path: `out/legal-${name}-chances.png`}); await p.evaluate(() => document.querySelector('#modal [data-m=ok]').click());
    // profil : aide et légal
    await p.evaluate(() => __v2.openPanel('profile')); await p.waitForTimeout(400);
    const t = await p.evaluate(() => document.querySelector('#sheet').innerText);
    ok(/Conditions d'utilisation/i.test(t) && /Mentions légales/i.test(t) && /Chances/i.test(t) && /Mes choix de confidentialité/i.test(t), `${name} : profil → Conditions, Confidentialité, Mentions, Chances, Mes choix`);
    ok(!/chrono|classement|temps gagné|tdb-7q4x/i.test(t), `${name} : rien du suivi dans le profil`);
    // textes changés → accord redemandé
    await p.evaluate(() => { __v2.S.legal.v = '2000-01-01'; __v2.save?.(); localStorage.setItem('village-du-pole-v5', JSON.stringify(__v2.S)); });
    await p.reload(); await p.waitForFunction(() => window.__v2, null, {timeout: 600000});
    const again = await p.waitForSelector('#legal h2', {timeout: 15000}).then(h => h.textContent()).catch(() => '');
    ok(/changé/.test(again), `${name} : textes changés → accord redemandé (« ${again} »)`);
    await p.context().close();
  }
  // pages légales remplies depuis js/legal.js
  const p = await (await cr.newContext()).newPage();
  for (const f of ['cgu', 'privacy', 'mentions']){ await p.goto(`http://localhost:8765/${f}.html`); await p.waitForTimeout(600);
    const t = await p.evaluate(() => document.body.innerText);
    ok(/better\.ask\.yannis@gmail\.com/.test(t) && !/\[adresse|undefined/.test(t) && /\d{4}/.test(t), `${f}.html : contact et version remplis`); await p.screenshot({path: `out/page-${f}.png`, fullPage: true}); }
  await p.goto('http://localhost:8765/privacy.html'); await p.waitForTimeout(600); const pv = await p.evaluate(() => document.body.innerText);
  ok(/6 mois/.test(pv) && /13 mois/.test(pv) && /2 ans/.test(pv) && /Data Privacy Framework/.test(pv) && /eur3/.test(pv), 'confidentialité : durées 6 mois / 13 mois / 2 ans, Data Privacy Framework, eur3');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await wk.close(); await cr.close(); })();
