// Comptes : créer un compte e-mail sur l'appareil A (village niveau 7), se connecter sur l'appareil B (village neuf) → reprendre le village du compte.
const EMU = require('./emu.cjs');
// Le compte de test est supprimé à la fin (document Firestore + compte).
const {webkit, devices} = require('playwright');
const KEY = require('fs').readFileSync(__dirname + '/../../js/firebase-config.js', 'utf8').match(/apiKey: '([^']+)'/)[1];
const mail = `vdp-test-${Date.now()}@example.com`, pass = 'Essai-' + Math.random().toString(36).slice(2, 10);
(async () => { const b = await webkit.launch(); const log = [];
  const open = async (lvl) => { const p = await (await b.newContext({...devices['iPhone 13']})).newPage(); p.on('pageerror', e => log.push('PAGEERR ' + e.message));
    await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
    for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(700); }
    if (lvl) await p.evaluate(l => { __v2.S.lvl = l; __v2.S.coins = 12345; }, lvl); return p; };
  // appareil A : création du compte
  const A = await open(7);
  await A.evaluate(() => __v2.openPanel('account')); await A.waitForTimeout(500);
  await A.fill('#accname', 'Testeur'); await A.fill('#accmail', mail); await A.fill('#accpass', pass); await A.click('[data-a=accsignup]');
  await A.waitForFunction(() => /Connecté/.test(document.querySelector('#sheet')?.innerText || ''), null, {timeout: 20000}).catch(() => {});
  await A.waitForTimeout(4000); log.push('A connecté : ' + await A.evaluate(() => /Connecté/.test(document.querySelector('#sheet')?.innerText || '')) + ' · message : ' + await A.evaluate(() => document.querySelector('#toast')?.textContent));
  await A.screenshot({path: 'out/compte-A.png'});
  // appareil B : village neuf, connexion avec le même compte
  const B = await open(0);
  await B.evaluate(() => __v2.openPanel('account')); await B.waitForTimeout(500);
  await B.fill('#accmail', mail); await B.fill('#accpass', pass); await B.click('[data-a=acclogin]');
  await B.waitForSelector('#modal:not([hidden]) [data-m=cloud]', {timeout: 20000}).catch(() => log.push('pas de choix de village'));
  await B.screenshot({path: 'out/compte-B-choix.png'});
  await Promise.all([B.waitForNavigation({timeout: 30000}).catch(() => {}), B.click('#modal [data-m=cloud]').catch(() => {})]);
  await B.waitForFunction(() => window.__v2, null, {timeout: 600000}); await B.waitForTimeout(3000);
  log.push('B après reprise : niveau ' + await B.evaluate(() => __v2.S.lvl) + ', pièces ' + await B.evaluate(() => __v2.S.coins));
  await B.screenshot({path: 'out/compte-B-repris.png'});
  // nettoyage : supprimer le document et le compte de test
  const r = await (await fetch(`${EMU.AU}accounts:signInWithPassword?key=${KEY}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: mail, password: pass, returnSecureToken: true})})).json();
  if (r.idToken){ const d = await fetch(`${EMU.FS}users/${r.localId}`, {method: 'DELETE', headers: {Authorization: 'Bearer ' + r.idToken}});
    const a = await fetch(`${EMU.AU}accounts:delete?key=${KEY}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({idToken: r.idToken})});
    log.push(`nettoyage : document ${d.status}, compte ${a.status}`); } else log.push('nettoyage impossible : ' + JSON.stringify(r).slice(0, 160));
  console.log(log.join('\n')); await b.close(); })();
