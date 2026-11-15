// Écran d'accueil + bonus de bienvenue + profil, sur iPhone SE, iPhone 13, Mac (Safari) et PC (Chrome).
// Compte e-mail de test créé puis supprimé. Vérifie : écran visible au 1er lancement, invité → plus d'écran, e-mail → bonus une seule fois,
// rechargement connecté → pas d'écran ni de 2e bonus, autre appareil → pas de 2e bonus.
const {webkit, chromium, devices} = require('playwright');
const KEY = require('fs').readFileSync(__dirname + '/../../js/firebase-config.js', 'utf8').match(/apiKey: '([^']+)'/)[1];
const api = (path, body) => fetch(`https://identitytoolkit.googleapis.com/v1/${path}?key=${KEY}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)}).then(r => r.json());
const OUT = __dirname + '/out/accueil-'; const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const MAC = {viewport: {width: 1440, height: 860}, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15', deviceScaleFactor: 1};
const PC = {viewport: {width: 1600, height: 900}, deviceScaleFactor: 1};
(async () => {
  const wk = await webkit.launch(), cr = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined});
  const boot = async (br, opt, name) => { const p = await (await br.newContext(opt)).newPage(); p.on('pageerror', e => { if (!/access control|firestore|network/i.test(e.message)) log.push(`PAGEERR ${name} ${e.message}`); });
    await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); return p; };
  const over = p => p.evaluate(() => { const c = document.querySelector('#welcome .wcard'); if (!c) return 'absent'; const r = c.getBoundingClientRect(); const bs = [...c.querySelectorAll('button')].filter(b => b.scrollWidth > b.clientWidth + 2).length; return (r.left < 0 || r.right > innerWidth + 1 ? 'déborde ' : '') + (bs ? bs + ' bouton(s) coupés' : '') || 'ok'; });
  // 1) chaque appareil : l'écran apparaît, puis « invité »
  for (const [name, br, opt] of [['se', wk, devices['iPhone SE']], ['i13', wk, devices['iPhone 13']], ['mac', wk, MAC], ['pc', cr, PC]]){
    const p = await boot(br, opt, name);
    const vis = await p.waitForSelector('#welcome .wcard', {timeout: 15000}).then(() => true).catch(() => false);
    ok(vis, `${name} : écran d'accueil affiché`); await p.waitForTimeout(500); await p.screenshot({path: OUT + name + '.png'});
    log.push(`   ${name} mise en page : ${await over(p)} · boutons : ${await p.evaluate(() => [...document.querySelectorAll('#welcome button')].map(b => b.innerText.trim()).join(' | '))}`);
    await p.click('#welcome [data-w=guest]'); await p.waitForTimeout(1200);
    ok(!(await p.$('#welcome')), `${name} : invité → l'écran disparaît`);
    await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); }); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.tskip')?.click()); await p.waitForTimeout(500);
    await p.evaluate(() => __v2.openPanel('profile')); await p.waitForTimeout(700); await p.screenshot({path: OUT + name + '-profil.png'});
    const txt = await p.evaluate(() => document.querySelector('#sheet')?.innerText || '');
    ok(/Mon village/i.test(txt) && /Mon compte/i.test(txt) && /Réglages/i.test(txt) && /Aide/i.test(txt) && /Protéger mon village/i.test(txt), `${name} : profil en 4 parties avec « Protéger mon village »`);
    ok(!/Diag|GAME_V|v\d{2}\b/.test(txt.split('Un problème')[0]), `${name} : rien de technique avant « Un problème ? »`);
    await p.reload(); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(3000);
    ok(!(await p.$('#welcome')), `${name} : invité, au rechargement l'écran ne revient pas`);
    await p.context().close();
  }
  // 2) e-mail depuis l'écran d'accueil (iPhone SE) → bonus
  const mail = `vdp-test-${Date.now()}@example.com`, pass = 'Essai-' + Math.random().toString(36).slice(2, 10);
  const A = await boot(wk, devices['iPhone SE'], 'A'); await A.waitForSelector('#welcome .wcard', {timeout: 15000});
  const st0 = await A.evaluate(() => __v2.S.stars);
  await A.click('#welcome [data-w=mail]'); await A.waitForSelector('#accmail', {timeout: 8000});
  await A.fill('#accname', 'Testeur'); await A.fill('#accmail', mail); await A.fill('#accpass', pass); await A.click('[data-a=accsignup]');
  await A.waitForFunction(() => __v2.S.welcomeGot, null, {timeout: 20000}).catch(() => {}); await A.waitForTimeout(2500);
  await A.screenshot({path: OUT + 'bonus.png'});
  const stA = await A.evaluate(() => __v2.S.stars), skin = await A.evaluate(() => __v2.S.skins?.pet);
  ok(stA - st0 >= 150, `bonus reçu : +${stA - st0} étoiles, pelage ${skin}, ${await A.evaluate(() => (__v2.S.parcels || []).length)} colis`);
  await A.evaluate(() => document.querySelector('#modal:not([hidden]) .btn')?.click()); await A.waitForTimeout(500);
  await A.evaluate(() => typeof closePanel === 'function' ? closePanel() : document.querySelector('#sheet .x')?.click()); await A.waitForTimeout(4000);
  await A.reload(); await A.waitForFunction(() => window.__v2, null, {timeout: 600000}); await A.waitForTimeout(5000);
  ok(!(await A.$('#welcome')), 'connecté : au rechargement, pas d\'écran d\'accueil');
  ok(await A.evaluate(() => __v2.S.stars) === stA, `connecté : pas de 2e bonus au rechargement (${await A.evaluate(() => __v2.S.stars)} étoiles)`);
  await A.waitForTimeout(3000);
  // 3) autre appareil (PC) : connexion → reprise du village, sans 2e bonus
  const B = await boot(cr, PC, 'B'); await B.waitForSelector('#welcome .wcard', {timeout: 15000});
  await B.click('#welcome [data-w=mail]'); await B.waitForSelector('#accmail', {timeout: 8000});
  await B.fill('#accmail', mail); await B.fill('#accpass', pass); await B.click('[data-a=acclogin]');
  const choix = await B.waitForSelector('#modal:not([hidden]) [data-m=cloud]', {timeout: 20000}).then(() => true).catch(() => false);
  if (choix){ await Promise.all([B.waitForNavigation({timeout: 30000}).catch(() => {}), B.click('#modal [data-m=cloud]')]); await B.waitForFunction(() => window.__v2, null, {timeout: 600000}); await B.waitForTimeout(4000); }
  ok(choix, 'autre appareil : choix du village proposé');
  ok(await B.evaluate(() => __v2.S.stars) === stA, `autre appareil : même village, pas de 2e bonus (${await B.evaluate(() => __v2.S.stars)} étoiles)`);
  ok(!(await B.$('#welcome')), 'autre appareil : pas d\'écran d\'accueil après la reprise');
  await B.evaluate(() => __v2.openPanel('profile')); await B.waitForTimeout(700); await B.screenshot({path: OUT + 'pc-profil-connecte.png'});
  // document en ligne
  const r = await api('accounts:signInWithPassword', {email: mail, password: pass, returnSecureToken: true});
  const doc = await (await fetch(`https://firestore.googleapis.com/v1/projects/village-du-pole/databases/(default)/documents/users/${r.localId}`, {headers: {Authorization: 'Bearer ' + r.idToken}})).json();
  log.push(`   document en ligne : welcome=${JSON.stringify(doc.fields?.welcome)} · welcomeGot dans la sauvegarde=${/"welcomeGot":"/.test(doc.fields?.save?.stringValue || '')}`);
  const d = await fetch(`https://firestore.googleapis.com/v1/projects/village-du-pole/databases/(default)/documents/users/${r.localId}`, {method: 'DELETE', headers: {Authorization: 'Bearer ' + r.idToken}});
  const a = await api('accounts:delete', {idToken: r.idToken}); log.push(`   nettoyage : document ${d.status}, compte ${a.error ? 'erreur' : 'ok'}`);
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await wk.close(); await cr.close(); })();
