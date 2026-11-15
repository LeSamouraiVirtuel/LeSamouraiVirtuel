// Règles Firestore (firebase/firestore.rules) testées sur l'ÉMULATEUR contre les vraies sauvegardes de chaque version du jeu.
// Chaque version : son propre town.js (tiré de git) fabrique un village neuf ET un village avancé, envoyé avec les champs
// exacts que cette version écrivait (v80 : sans « fmt » ; v81-v84 : fmt + welcome ; v85 : + legal).
// Lancer d'abord : firebase emulators:start (auth 9099, firestore 8080) avec firebase/firestore.rules.
const {execSync} = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const AU = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/', FS = 'http://127.0.0.1:8080/v1/projects/village-du-pole/databases/(default)/documents/';
const VERS = [['fef17a3', 'v80', 'old'], ['e9654a8', 'v81', 'fmt'], ['5c43ad5', 'v82', 'fmt'], ['3641e8e', 'v83', 'welcome'], ['969e708', 'v84', 'welcome'], ['HEAD-local', 'v85', 'legal']];
const log = []; let bad = 0; const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const val = v => v === null ? {nullValue: null} : typeof v === 'boolean' ? {booleanValue: v} : Number.isInteger(v) ? {integerValue: String(v)} : typeof v === 'number' ? {doubleValue: v}
  : typeof v === 'string' ? {stringValue: v} : Array.isArray(v) ? {arrayValue: {values: v.map(val)}} : {mapValue: {fields: Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, val(x)]))}};
const fields = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));
const user = async email => { const r = await (await fetch(AU + 'accounts:signUp?key=x', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password: 'Essai-123456', returnSecureToken: true})})).json(); return {uid: r.localId, tok: r.idToken}; };
const google = async email => { const r = await (await fetch(AU + 'accounts:signInWithIdp?key=x', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({postBody: `id_token=${encodeURIComponent(JSON.stringify({sub: 'g' + email, email, email_verified: true}))}&providerId=google.com`, requestUri: 'http://localhost', returnSecureToken: true})})).json(); return {uid: r.localId, tok: r.idToken}; };
const put = (u, p, o) => fetch(FS + p, {method: 'PATCH', headers: {Authorization: 'Bearer ' + u.tok, 'Content-Type': 'application/json'}, body: JSON.stringify({fields: fields(o)})}).then(r => r.status);
const get = (u, p) => fetch(FS + p, {headers: {Authorization: 'Bearer ' + u.tok}}).then(r => r.status);
const del = (u, p) => fetch(FS + p, {method: 'DELETE', headers: {Authorization: 'Bearer ' + u.tok}}).then(r => r.status);
const cg = (u, id) => fetch(FS.replace(/documents\/$/, 'documents:runQuery'), {method: 'POST', headers: {Authorization: 'Bearer ' + u.tok, 'Content-Type': 'application/json'}, body: JSON.stringify({structuredQuery: {from: [{collectionId: id, allDescendants: true}]}})}).then(r => r.status);
(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'regles-'));
  for (const [c, n, kind] of VERS){
    const f = path.join(tmp, n + '.mjs');
    fs.writeFileSync(f, c === 'HEAD-local' ? fs.readFileSync(__dirname + '/../../js/v2/town.js') : execSync(`git show ${c}:santa-game/js/v2/town.js`, {cwd: __dirname}));
    const T = await import(f);
    const fresh = T.newTown(), big = T.newTown(); Object.assign(big, {lvl: 34, coins: 9876543, stars: 4400, wood: 90000, name: 'Village très avancé ' + n});
    for (let i = 0; i < 400; i++) (big.parcels ||= []).push(i % 4);
    big.log = {ev: Array.from({length: 1500}, (_, i) => [Date.now() - i * 6e4, i % 7 ? 'star' : 'iap', {what: 'speed', n: 12, eur: 4.99}]), agg: {eur: 99.8, n_buy: 20}};
    for (const [label, st] of [['village neuf', fresh], ['village avancé', big]]){
      const u = await user(`${n}-${label.length}-${Date.now()}@example.com`);
      let d;
      if (kind === 'old') d = {save: JSON.stringify(st), lvl: st.lvl || 1, t: Date.now(), name: 'Joueur ' + n};
      else d = {save: JSON.stringify(st), fmt: st.fmt || 5, lvl: Math.max(1, Math.round(st.lvl || 1)), t: Date.now(), name: ('Joueur ' + n).slice(0, 40)};
      if (kind === 'welcome' || kind === 'legal') d.welcome = true;
      if (kind === 'legal') d.legal = {v: '2026-11-15', t: Date.now(), cgu: true, analyse: false, annee: 2012, mineur: true, seuil: 15, parent: false};
      const s1 = await put(u, 'users/' + u.uid, d), s2 = await put(u, 'users/' + u.uid, {...d, t: Date.now() + 1000});
      ok(s1 === 200 && s2 === 200, `${n} ${label} (${(d.save.length / 1024).toFixed(0)} Ko) : création ${s1}, mise à jour ${s2}`);
    }
  }
  // interdits
  const a = await user('a-' + Date.now() + '@example.com'), b = await user('b-' + Date.now() + '@example.com');
  const base = {save: '{}', fmt: 6, lvl: 1, t: Date.now(), name: 'A', welcome: true};
  await put(a, 'users/' + a.uid, base);
  ok(await put(a, 'users/' + a.uid, {...base, zz: 'x'}) === 403, 'champ inconnu refusé');
  ok(await put(a, 'users/' + a.uid, {...base, welcome: false}) === 403, 'bonus de bienvenue : impossible de repasser à faux');
  ok(await put(b, 'users/' + a.uid, base) === 403, 'écrire le village d\'un autre : refusé');
  ok(await get(b, 'users/' + a.uid) === 403, 'lire le village d\'un autre : refusé');
  ok(await get(b, 'track/' + a.uid) === 403, 'lire le suivi d\'un autre : refusé');
  ok(await put(a, 'track/' + a.uid, {email: 'a@x', derniere: Date.now(), analyse: true, legal: {v: '2026-11-15'}, appareil: {os: 'iOS'}, jours: {'2026-11-15': 1}}) === 200, 'le joueur écrit sa fiche de suivi');
  ok(await put(a, `track/${a.uid}/s/s1`, {debut: Date.now(), fin: Date.now(), duree: 3, jeu: 3, ev: [{t: 1, k: 'ecran'}]}) === 200, 'le joueur écrit sa session');
  ok(await put(a, `track/${a.uid}/secu/1`, {t: Date.now(), ip: '1.2.3.4'}) === 200, 'journal de sécurité : écriture');
  ok(await put(a, `track/${a.uid}/secu/1`, {t: Date.now(), ip: '9.9.9.9'}) === 403, 'journal de sécurité : modification refusée');
  ok(await put(a, `track/${a.uid}/secu/2`, {t: Date.now(), ip: '1.2.3.4', ville: 'x'}) === 403, 'journal de sécurité : champ en plus refusé');
  ok(await put(a, 'purchases/' + a.uid, {pack: 'x'}) === 403, 'un joueur ne peut pas s\'attribuer un achat');
  // éditeur
  const adm = await google('better.ask.yannis@gmail.com'), other = await google('quelqu-un@gmail.com');
  const lst = u => fetch(FS + 'users', {headers: {Authorization: 'Bearer ' + u.tok}}).then(r => r.status);
  ok(await lst(adm) === 200 && await get(adm, 'track/' + a.uid) === 200 && await get(adm, `track/${a.uid}/s/s1`) === 200, 'l\'éditeur lit les villages, les fiches et les sessions');
  ok(await cg(adm, 's') === 200 && await cg(adm, 'secu') === 200, 'l\'éditeur cherche dans toutes les sessions et journaux');
  ok(await lst(other) === 403 && await cg(other, 's') === 403, 'un autre compte Google : refusé');
  ok(await put(adm, 'users/' + a.uid, base) === 403, 'l\'éditeur ne peut rien écrire');
  ok(await del(adm, 'users/' + a.uid) === 403 && await del(adm, `track/${a.uid}/secu/1`) === 403, 'l\'éditeur ne peut pas effacer des données récentes');
  const c = await user('c-' + Date.now() + '@example.com'), longAgo = Date.now() - 800 * 864e5;
  await put(c, 'users/' + c.uid, {...base, t: longAgo}); await put(c, 'track/' + c.uid, {derniere: longAgo}); await put(c, `track/${c.uid}/secu/1`, {t: Date.now() - 200 * 864e5, ip: '1.1.1.1'}); await put(c, `track/${c.uid}/s/old`, {debut: Date.now() - 400 * 864e5});
  ok(await del(adm, `track/${c.uid}/secu/1`) === 200, 'nettoyage : journal de sécurité de plus de 6 mois');
  ok(await del(adm, `track/${c.uid}/s/old`) === 200, 'nettoyage : session de plus de 13 mois');
  ok(await del(adm, 'users/' + c.uid) === 200 && await del(adm, 'track/' + c.uid) === 200, 'nettoyage : compte inactif depuis plus de 2 ans');
  ok(await del(a, 'users/' + a.uid) === 200 && await del(a, 'track/' + a.uid) === 200, 'le joueur supprime ses données');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON');
})();
