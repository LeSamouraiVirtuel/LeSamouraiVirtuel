// Comptes, parcours complet sans Google : vieux village (format 5, sans compte) → création de compte e-mail (le village est gardé)
const EMU = require('./emu.cjs');
// → autre appareil : connexion, reprise du village → suppression du compte (compte + document + village local).
const {webkit, devices} = require('playwright');
const KEY = require('fs').readFileSync(__dirname + '/../../js/firebase-config.js', 'utf8').match(/apiKey: '([^']+)'/)[1];
const mail = `vdp-test-${Date.now()}@example.com`, pass = 'Essai-' + Math.random().toString(36).slice(2, 10);
const api = (path, body) => fetch(`${EMU.AU}${path}?key=${KEY}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then(r => r.json());
(async () => { const b = await webkit.launch(); const log = [];
  const ctx = async () => (await b.newContext({...devices['iPhone 13']})).newPage();
  const boot = async p => { p.on('pageerror', e => { if (!/access control|firestore/.test(e.message)) log.push('PAGEERR ' + e.message); }); await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
    for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(700); } };
  // appareil A : un vieux village au format 5 (sans numéro de format, sans compte)
  // on fabrique le vieux village dans un premier onglet, puis on l'injecte AVANT le démarrage du jeu dans un appareil neuf
  const A0 = await ctx(); await boot(A0);
  const old = await A0.evaluate(() => { const S = JSON.parse(JSON.stringify(__v2.S)); delete S.fmt; delete S.created; delete S.play; delete S.log; S.lvl = 9; S.coins = 4242; S.tuto = 99; S.introSeen = 1; return JSON.stringify(S); });
  await A0.close();
  const cA = await b.newContext({...devices['iPhone 13']}); await cA.addInitScript(v => { if (!sessionStorage.getItem('inj')){ sessionStorage.setItem('inj', 1); localStorage.setItem('village-du-pole-v5', v); } }, old);
  const A = await cA.newPage(); await boot(A);
  log.push(`vieux village converti : format ${await A.evaluate(() => __v2.S.fmt)}, niveau ${await A.evaluate(() => __v2.S.lvl)}, pièces ${await A.evaluate(() => __v2.S.coins)}, création ${await A.evaluate(() => !!__v2.S.created)}`);
  await A.evaluate(() => __v2.openPanel('account')); await A.waitForTimeout(400);
  await A.fill('#accname', 'Testeur'); await A.fill('#accmail', mail); await A.fill('#accpass', pass); await A.click('[data-a=accsignup]');
  await A.waitForFunction(() => /Connecté/.test(document.querySelector('#sheet')?.innerText || ''), null, {timeout: 20000}).catch(() => {}); await A.waitForTimeout(3500);
  log.push('A : compte créé, ' + await A.evaluate(() => document.querySelector('#toast')?.textContent));
  // appareil B
  const B = await ctx(); await boot(B);
  await B.evaluate(() => __v2.openPanel('account')); await B.waitForTimeout(400);
  await B.fill('#accmail', mail); await B.fill('#accpass', pass); await B.click('[data-a=acclogin]');
  await B.waitForSelector('#modal:not([hidden]) [data-m=cloud]', {timeout: 20000}).catch(() => log.push('B : pas de choix de village'));
  await Promise.all([B.waitForNavigation({timeout: 30000}).catch(() => {}), B.click('#modal [data-m=cloud]').catch(() => {})]);
  await B.waitForFunction(() => window.__v2, null, {timeout: 600000}); await B.waitForTimeout(3500);
  log.push(`B : village repris niveau ${await B.evaluate(() => __v2.S.lvl)}, pièces ${await B.evaluate(() => __v2.S.coins)}`);
  // suppression depuis B
  await B.evaluate(() => __v2.openPanel('account')); await B.waitForTimeout(800);
  await B.click('[data-a=accdelete]'); await B.waitForSelector('#delword', {timeout: 8000});
  await B.fill('#delpass', pass); await B.fill('#delword', 'supprimer'); await B.screenshot({path: 'out/compte-suppr.png'});
  await Promise.all([B.waitForNavigation({timeout: 30000}).catch(() => {}), B.click('#modal [data-m=del]')]);
  await B.waitForFunction(() => window.__v2, null, {timeout: 600000}); await B.waitForTimeout(1500);
  const again = await api('accounts:signInWithPassword', {email: mail, password: pass, returnSecureToken: true});
  log.push(`suppression : village local neuf (niveau ${await B.evaluate(() => __v2.S.lvl)}), compte ${again.error ? 'introuvable ✓ (' + again.error.message + ')' : 'ENCORE LÀ ✗'}`);
  if (!again.error){ await api('accounts:delete', {idToken: again.idToken}); }
  console.log(log.join('\n')); await b.close(); })();
