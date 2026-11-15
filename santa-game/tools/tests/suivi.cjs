// Suivi invisible + tableau de bord de Sora, de bout en bout sur l'ÉMULATEUR Firebase (règles du fichier firebase/firestore.rules).
require('./emu.cjs');
// Lancer d'abord : firebase emulators:start (auth 9099, firestore 8080) avec ces règles.
// 1) un joueur (iPhone 13) arrive par un lien partagé, crée un compte e-mail, accepte le suivi, joue (écrans, achat simulé, étoiles, niveau)
// 2) Sora (PC) ouvre le tableau de bord avec son compte Google : il voit le joueur, sa fiche, ses sessions et actions
// 3) un autre compte Google : accès refusé ; le joueur ne voit rien de tout ça dans le jeu
const {webkit, chromium, devices} = require('playwright');
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const emu = () => { localStorage.setItem('vdp-emu', '1'); };
(async () => {
  const wk = await webkit.launch(), cr = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined});
  const mail = `joueur-${Date.now()}@example.com`;
  const c1 = await wk.newContext({...devices['iPhone 13']}); await c1.addInitScript(emu); await c1.addInitScript(require('./conditions.cjs'), true);
  const p = await c1.newPage(); p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  await p.goto('http://localhost:8765/?ref=lien-partage'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000});
  await p.waitForSelector('#welcome [data-w=mail]', {timeout: 20000}); await p.click('#welcome [data-w=mail]'); await p.waitForSelector('#accmail');
  await p.fill('#accname', 'Lutin Test'); await p.fill('#accmail', mail); await p.fill('#accpass', 'Essai-123456'); await p.click('[data-a=accsignup]');
  await p.waitForFunction(() => __v2.S.welcomeGot, null, {timeout: 20000}).catch(() => {});
  ok(await p.evaluate(() => !!__v2.S.welcomeGot), 'compte créé (émulateur), bonus reçu');
  await p.evaluate(() => document.querySelector('#sheet [data-a=close]')?.click()); await p.waitForTimeout(1500);
  // le bonus ne doit pas recouvrir l'intro : on vérifie, puis on passe l'intro et le tutoriel
  ok(!(await p.evaluate(() => document.body.classList.contains('cine') && !document.querySelector('#modal').hidden)), 'le bonus ne s\'affiche pas par-dessus l\'intro');
  for (let i = 0; i < 6; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(800); }
  // l'accord d'analyse a été donné dans la fenêtre « Conditions et confidentialité » : plus de question ensuite
  for (let i = 0; i < 12; i++){ await p.evaluate(() => { const m = document.querySelector('#modal'); if (m.hidden) return; const b = m.querySelector('button, [data-m]'); if (b) b.click(); }); await p.waitForTimeout(700); }
  ok(await p.evaluate(() => __v2.S.legal?.analyse === true), 'accord d\'analyse enregistré (date, version, choix)');
  // jouer : écrans, achat simulé, étoiles (remplir les tickets), niveau
  for (const n of ['shop', 'games', 'profile', 'fish']) { await p.evaluate(n => __v2.openPanel(n), n); await p.waitForTimeout(400); }
  await p.evaluate(() => { __v2.S.games.tickets = 0; __v2.openPanel('games'); }); await p.waitForTimeout(500);
  const st0 = await p.evaluate(() => __v2.S.stars);
  await p.click('#sheet [data-a=buytix]').catch(e => log.push('pas de bouton tickets ' + e.message.slice(0, 80))); await p.waitForTimeout(1500);
  await p.evaluate(() => __v2.openPanel('shop')); await p.waitForTimeout(600);
  const k = await p.evaluate(() => document.querySelector('#sheet [data-a=iap]')?.dataset.k); log.push('   achat simulé : ' + k);
  await p.click('#sheet [data-a=iap]').catch(e => log.push('   pas de bouton d\'achat')); await p.waitForTimeout(800);
  if (await p.$('#modal:not([hidden]) [data-m]')) await p.evaluate(() => [...document.querySelectorAll('#modal [data-m]')].find(b => /buy|ok|yes|pay/.test(b.dataset.m))?.click());
  await p.waitForTimeout(1500); log.push('   euros dans la sauvegarde : ' + await p.evaluate(() => __v2.S.log?.agg?.eur));
  await p.evaluate(() => { __v2.S.lvl = 5; }); await p.waitForTimeout(2500);
  // texte visible dans le jeu : aucun chrono, classement, euros dépensés ni temps gagné
  await p.evaluate(() => __v2.openPanel('profile')); await p.waitForTimeout(500);
  const txt = await p.evaluate(() => document.body.innerText);
  ok(!/chrono|classement|dépensé|temps gagné|tableau de bord|tdb-7q4x/i.test(txt), 'rien du suivi n\'apparaît dans le jeu');
  ok(/Aider à améliorer le jeu/i.test(txt), 'réglage « Aider à améliorer le jeu » dans le profil');
  log.push(`   étoiles : ${st0} → ${await p.evaluate(() => __v2.S.stars)}`);
  log.push('   attente de l\'envoi (65 s)…'); await p.waitForTimeout(65000);
  // Sora
  const c2 = await cr.newContext({viewport: {width: 1500, height: 950}}); await c2.addInitScript(emu);
  const d = await c2.newPage(); d.on('pageerror', e => log.push('PAGEERR tdb ' + e.message));
  await d.goto('http://localhost:8765/tdb-7q4x.html'); await d.waitForFunction(() => window.__emuLogin, null, {timeout: 20000});
  await d.evaluate(() => __emuLogin('better.ask.yannis@gmail.com')); await d.waitForSelector('#players tr.p', {timeout: 20000}).catch(() => {});
  await d.waitForTimeout(1500); await d.screenshot({path: 'out/tdb-accueil.png', fullPage: true});
  const row = await d.evaluate(m => [...document.querySelectorAll('#players tr.p')].map(r => r.innerText).find(t => t.includes(m)) || '', mail);
  ok(!!row, 'Sora voit le joueur : ' + row.replace(/\s+/g, ' ').slice(0, 220));
  await d.click(`#players tr.p:has-text("${mail}")`); await d.waitForTimeout(3000);
  const f = await d.evaluate(() => document.querySelector('#fin').innerText);
  await d.screenshot({path: 'out/tdb-fiche.png', fullPage: true});
  ok(/iOS/.test(f) && /iPhone/.test(f), 'fiche : appareil (iOS, iPhone)');
  ok(/lien-partage/.test(f), 'fiche : provenance (lien partagé)');
  ok(/Pack|pêche|7,99/i.test(f), 'fiche : achat simulé dans l\'ordre');
  ok(/Lutin Test/.test(f) && /e-mail/.test(f), 'fiche : identité (nom, type de compte)');
  ok(/IP/.test(f), 'fiche : IP et lieu ' + (f.match(/Lieu\n?([^\n]+)/)?.[1] || '(service de géolocalisation injoignable ici)'));
  await d.click('#sess details summary').catch(() => {}); await d.waitForTimeout(500);
  const sess = await d.evaluate(() => document.querySelector('#sess').innerText);
  ok(/Écran/.test(sess) && /Étoiles/.test(sess) && /Achat/.test(sess) && /Niveau/.test(sess), 'session : écrans, étoiles, achat, niveau enregistrés');
  log.push('   session : ' + sess.split('\n')[0].slice(0, 200)); log.push('   actions : ' + [...new Set(sess.split('\n').slice(1).map(l => l.split(' · ')[1]?.split(' ')[0]))].join(', '));
  await d.screenshot({path: 'out/tdb-session.png', fullPage: true});
  // autre compte Google
  const c3 = await cr.newContext(); await c3.addInitScript(emu); const o = await c3.newPage();
  await o.goto('http://localhost:8765/tdb-7q4x.html'); await o.waitForFunction(() => window.__emuLogin, null, {timeout: 20000});
  await o.evaluate(() => __emuLogin('un-autre@gmail.com')); await o.waitForTimeout(4000);
  ok(/Accès refusé/.test(await o.evaluate(() => document.body.innerText)), 'autre compte Google : accès refusé');
  // le joueur ne peut pas lire la fiche d'un autre joueur
  const other = await p.evaluate(async () => { const A = await import('/js/account.js'); const {F, db} = A.fs(); try { await F.getDocs(F.collection(db, 'track')); return 'LU'; } catch(e){ return e.code; } });
  ok(other !== 'LU', 'le joueur ne peut pas lister les autres joueurs (' + other + ')');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON'); await wk.close(); await cr.close(); })();
