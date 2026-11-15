// Le bouton Google ouvre bien la fenêtre Google (sans redirection) sur Safari iPhone, Safari Mac et Chrome PC ;
// dans l'app de l'écran d'accueil d'un iPhone, le bouton est remplacé par une consigne claire.
const {webkit, chromium, devices} = require('playwright');
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
(async () => { const out = [];
  const cases = [['iPhone Safari', webkit, {...devices['iPhone 13']}, false], ['Mac Safari', webkit, {viewport: {width: 1440, height: 900}, userAgent: MAC}, false],
    ['PC Chrome', chromium, {viewport: {width: 1440, height: 900}}, false], ['iPhone app écran d’accueil', webkit, {...devices['iPhone 13']}, true]];
  for (const [name, eng, opt, pwa] of cases){
    const b = await eng.launch(eng === chromium && process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}); const c = await b.newContext(opt);
    if (pwa) await c.addInitScript(() => { Object.defineProperty(navigator, 'standalone', {get: () => true}); });
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => { if (!/access control|firestore/.test(e.message)) errs.push(e.message); });
    await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
    for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); } await p.waitForTimeout(2500);
    await p.evaluate(() => __v2.openPanel('account')); await p.waitForTimeout(600);
    const btn = await p.$('[data-a=accgoogle]');
    if (!btn){ out.push(`${name} : pas de bouton Google · consigne : ${await p.evaluate(() => document.querySelector('.accnote')?.textContent || '(aucune)')}`); }
    else { const [pop] = await Promise.all([p.waitForEvent('popup', {timeout: 10000}).catch(() => null), btn.click()]);
      await p.waitForTimeout(3000); const url = pop ? pop.url() : ''; const nav = p.url();
      out.push(`${name} : fenêtre Google ${pop ? 'OUVERTE → ' + url.replace(/\?.*/, '').slice(0, 70) : 'NON ouverte'} · page du jeu ${/localhost:8765\/?$/.test(nav) ? 'restée en place' : 'partie vers ' + nav.slice(0, 60)} · message : ${await p.evaluate(() => document.querySelector('.accerr')?.textContent || '-')}`); }
    if (errs.length) out.push('  erreurs : ' + errs.join(' | ').slice(0, 200));
    await b.close(); }
  console.log(out.join('\n')); })();
