// Règles Firestore (firebase/firestore.rules) testées sur l'ÉMULATEUR contre les vraies sauvegardes de chaque version du jeu.
require('./emu.cjs');
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
const google = async email => { const r = await (await fetch(AU + 'accounts:signInWithIdp?key=x', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({postBody: `id_token=${encodeURIComponent(JSON.stringify({sub: 'g' + email, email, email_verified: true}))}&providerId=google.com`, requestUri: 'http://localhost', returnSecureToken: true})})).json(); return {uid: r.localId, tok: r.idToken, raw: r}; };
const claimAdmin = async u => { const r = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/village-du-pole/accounts:update', {method: 'POST', headers: {Authorization: 'Bearer owner', 'Content-Type': 'application/json'}, body: JSON.stringify({localId: u.uid, customAttributes: JSON.stringify({admin: true})})}); return r.status; };
const commit = (u, writes) => fetch(FS.replace(/documents\/$/, 'documents:commit'), {method: 'POST', headers: {Authorization: 'Bearer ' + u.tok, 'Content-Type': 'application/json'}, body: JSON.stringify({writes})}).then(r => r.status);
const serverTime = (u, name, fieldPath) => commit(u, [{transform: {document: `projects/village-du-pole/databases/(default)/documents/${name}`, fieldTransforms: [{fieldPath, setToServerValue: 'REQUEST_TIME'}]}}]);
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
  ok(await put(a, 'users/' + a.uid, {...base, lvl: 120}) === 200, 'niveau 120 (plafond réaliste) accepté');
  ok(await put(a, 'users/' + a.uid, {...base, lvl: 151}) === 403, 'niveau 151 refusé (l’ancien plafond 100000 est fermé)');
  ok(await put(a, 'users/' + a.uid, {...base, lvl: 100000}) === 403, 'niveau 100000 refusé');
  ok(await put(a, 'users/' + a.uid, {...base, t: Date.now() + 864e5}) === 403, 'heure de sauvegarde dans le futur refusée');
  ok(await put(a, 'users/' + a.uid, {...base, zz: 'x'}) === 403, 'champ inconnu refusé');
  ok(await put(a, 'users/' + a.uid, {...base, welcome: false}) === 403, 'bonus de bienvenue : impossible de repasser à faux');
  const {welcome, ...sans} = base; ok(await put(a, 'users/' + a.uid, sans) === 200, 'ancien jeu (v80-v82) resté ouvert, sauvegarde sans « welcome » après le bonus : acceptée');
  ok(await put(a, 'users/' + a.uid, base) === 200, 'puis le nouveau jeu remet « welcome » : accepté');
  ok(await put(b, 'users/' + a.uid, base) === 403, 'écrire le village d\'un autre : refusé');
  ok(await get(b, 'users/' + a.uid) === 403, 'lire le village d\'un autre : refusé');
  ok(await get(b, 'track/' + a.uid) === 403, 'lire le suivi d\'un autre : refusé');
  ok(await put(a, 'track/' + a.uid, {email: 'a@x', derniere: Date.now(), analyse: true, legal: {v: '2026-11-15'}, appareil: {os: 'iOS'}, jours: {'2026-11-15': 1}}) === 200, 'le joueur écrit sa fiche de suivi');
  ok(await put(a, `track/${a.uid}/s/s1`, {debut: Date.now(), fin: Date.now(), duree: 3, jeu: 3, ev: [{t: 1, k: 'ecran'}]}) === 200, 'le joueur écrit sa session');
  ok(await put(a, `track/${a.uid}/secu/1`, {t: Date.now(), ip: '1.2.3.4'}) === 200, 'journal de sécurité : écriture');
  ok(await put(a, `track/${a.uid}/secu/1`, {t: Date.now(), ip: '9.9.9.9'}) === 403, 'journal de sécurité : modification refusée');
  ok(await put(a, `track/${a.uid}/secu/2`, {t: Date.now(), ip: '1.2.3.4', ville: 'x'}) === 403, 'journal de sécurité : champ en plus refusé');
  ok(await put(a, 'purchases/' + a.uid, {pack: 'x'}) === 403, 'un joueur ne peut pas s\'attribuer un achat');
  // course : l'heure officielle est celle du serveur, un temps choisi par le joueur est refusé
  ok(await serverTime(a, 'track/' + a.uid, 'vu') === 200, 'le serveur note la première fois qu’il voit le joueur');
  const summitNow = await commit(a, [{update: {name: `projects/village-du-pole/databases/(default)/documents/track/${a.uid}`, fields: {course: {mapValue: {fields: {sommet: {mapValue: {fields: {eur: {doubleValue: 0}, achats: {integerValue: '0'}, niv: {integerValue: '25'}, jeu: {integerValue: '0'}}}}}}}}}, updateMask: {fieldPaths: ['course.sommet.eur', 'course.sommet.achats', 'course.sommet.niv', 'course.sommet.jeu']}, updateTransforms: [{fieldPath: 'course.sommet.t', setToServerValue: 'REQUEST_TIME'}]}]);
  ok(summitNow === 403, 'sommet dans la foulée refusé (temps impossible)');
  ok(await put(a, 'track/' + a.uid, {course: {sommet: {t: Date.now() - 864e5, eur: 0, achats: 0, niv: 25, jeu: 0}}, derniere: Date.now()}) === 403, 'heure de course choisie par le joueur refusée');
  await new Promise(r => setTimeout(r, 6000));
  const niv5 = await commit(a, [{update: {name: `projects/village-du-pole/databases/(default)/documents/track/${a.uid}`, fields: {course: {mapValue: {fields: {niv5: {mapValue: {fields: {eur: {doubleValue: 1.5}, achats: {integerValue: '0'}, niv: {integerValue: '5'}, jeu: {integerValue: '30'}}}}}}}}}, updateMask: {fieldPaths: ['course.niv5.eur', 'course.niv5.achats', 'course.niv5.niv', 'course.niv5.jeu']}, updateTransforms: [{fieldPath: 'course.niv5.t', setToServerValue: 'REQUEST_TIME'}]}]);
  ok(niv5 === 200, 'niveau 5 accepté une fois le délai minimum passé');
  const niv5again = await commit(a, [{update: {name: `projects/village-du-pole/databases/(default)/documents/track/${a.uid}`, fields: {course: {mapValue: {fields: {niv5: {mapValue: {fields: {eur: {doubleValue: 0}, achats: {integerValue: '0'}, niv: {integerValue: '5'}, jeu: {integerValue: '0'}}}}}}}}}, updateMask: {fieldPaths: ['course.niv5.eur', 'course.niv5.achats', 'course.niv5.niv', 'course.niv5.jeu']}, updateTransforms: [{fieldPath: 'course.niv5.t', setToServerValue: 'REQUEST_TIME'}]}]);
  ok(niv5again === 403, 'un jalon déjà accepté ne se réécrit pas');
  const docA = `projects/village-du-pole/databases/(default)/documents/track/${a.uid}`;
  const ficheSeule = await commit(a, [{update: {name: docA, fields: fields({derniere: Date.now(), niveau: 6})}, updateMask: {fieldPaths: ['derniere', 'niveau']}}]);
  ok(ficheSeule === 200, 'mettre à jour la fiche sans toucher à vu ni aux jalons : accepté');
  const sansJalon = await commit(a, [{update: {name: docA, fields: {course: {mapValue: {fields: {}}}}}, updateMask: {fieldPaths: ['course']}}]);
  ok(sansJalon === 403, 'retirer un jalon déjà enregistré : refusé');
  const sansVu = await commit(a, [{update: {name: docA, fields: fields({derniere: Date.now()})}, updateMask: {fieldPaths: ['derniere', 'vu']}}]);
  ok(sansVu === 403, 'retirer vu : refusé');
  // client v94 encore en cache : derniere en nombre, creeLe, jalon dans une écriture à part
  const v94 = await user('v94-' + Date.now() + '@example.com');
  const creeLe = Date.now() - 3 * 864e5;
  const fiche94 = {email: 'v94@example.com', nom: 'Ancien client', fournisseur: 'google.com', compteCree: Date.now() - 10 * 864e5, derniere: Date.now(), analyse: false, village: 'Ancien', creeLe, niveau: 4, maison: 2, eur: 0, achats: 0, inviteAvant: false};
  ok(await put(v94, 'track/' + v94.uid, fiche94) === 200, 'client v94 : création de fiche (derniere en nombre, creeLe, sans vu) acceptée');
  const doc94 = `projects/village-du-pole/databases/(default)/documents/track/${v94.uid}`;
  const flush94 = await commit(v94, [{update: {name: doc94, fields: fields({derniere: Date.now(), niveau: 5, maison: 2, chapitre: 1, eur: 0, achats: 0, etoilesDepensees: 0, tempsGagne: 0, jeuTotal: 12, lvl: 5, village: 'Ancien', creeLe})}, updateMask: {fieldPaths: ['derniere', 'niveau', 'maison', 'chapitre', 'eur', 'achats', 'etoilesDepensees', 'tempsGagne', 'jeuTotal', 'lvl', 'village', 'creeLe']}, updateTransforms: [{fieldPath: 'tempsJeu', increment: {integerValue: '12'}}]}]);
  ok(flush94 === 200, 'client v94 : mise à jour de la fiche sans jalon acceptée');
  const sess94 = await commit(v94, [{update: {name: doc94, fields: fields({appareil: {os: 'Android', osv: '14', model: 'Pixel', br: 'Chrome', sw: 390, sh: 844, dpr: 2, vw: 390, vh: 844, lang: 'fr', tz: 'Europe/Paris', pwa: false, touch: true}, derniere: Date.now()})}, updateMask: {fieldPaths: ['appareil', 'derniere', 'sessions', 'jours.`2026-11-15`']}, updateTransforms: [{fieldPath: 'sessions', increment: {integerValue: '1'}}, {fieldPath: 'jours.`2026-11-15`', increment: {integerValue: '1'}}]}]);
  ok(sess94 === 200, 'client v94 : session (sessions et jours en incrément, derniere en nombre) acceptée');
  const geo94 = await commit(v94, [{update: {name: doc94, fields: fields({geo: {ip: '1.2.3.4', pays: 'France', cc: 'FR', region: 'IDF', ville: 'Paris', fai: 'exemple', src: 'geojs'}, ips: ['1.2.3.4']})}, updateMask: {fieldPaths: ['geo', 'ips']}}]);
  ok(geo94 === 200, 'client v94 : lieu ajouté ensuite sur la fiche accepté');
  const sid94 = await put(v94, `track/${v94.uid}/s/s94`, {debut: Date.now(), fin: Date.now(), duree: 1, jeu: 1, appareil: {os: 'Android', osv: '14', model: 'Pixel', br: 'Chrome', sw: 390, sh: 844, dpr: 2, vw: 390, vh: 844, lang: 'fr', tz: 'Europe/Paris', pwa: false, touch: true}, ev: [{t: 1, k: 'ecran'}], niv: 5});
  ok(sid94 === 200, 'client v94 : document de session avec l’appareil complet accepté');
  const jalon94 = await commit(v94, [{update: {name: doc94, fields: {course: {mapValue: {fields: {niv10: {mapValue: {fields: {t: {integerValue: String(Date.now())}, eur: {doubleValue: 0}, achats: {integerValue: '0'}, niv: {integerValue: '10'}, jeu: {integerValue: '20'}, depuisCreation: {integerValue: '1000'}}}}}}}}}, updateMask: {fieldPaths: ['course']}}]);
  ok(jalon94 === 403, 'client v94 : jalon sans request.time refusé (écriture du jalon seule)');
  const encore94 = await commit(v94, [{update: {name: doc94, fields: fields({derniere: Date.now(), niveau: 6})}, updateMask: {fieldPaths: ['derniere', 'niveau']}}]);
  ok(encore94 === 200, 'client v94 : après le jalon refusé, la fiche s’écrit encore');
  // éditeur : custom claim « admin », plus l'adresse e-mail en clair
  let adm = await google('editeur-essai@example.com');
  ok(await claimAdmin(adm) === 200, 'claim admin posé sur le compte éditeur (émulateur)');
  adm = await google('editeur-essai@example.com');
  const other = await google('quelqu-un@gmail.com');
  const lst = u => fetch(FS + 'users', {headers: {Authorization: 'Bearer ' + u.tok}}).then(r => r.status);
  ok(await lst(adm) === 200 && await get(adm, 'track/' + a.uid) === 200 && await get(adm, `track/${a.uid}/s/s1`) === 200, 'l\'éditeur lit les villages, les fiches et les sessions');
  ok(await cg(adm, 's') === 200 && await cg(adm, 'secu') === 200, 'l\'éditeur cherche dans toutes les sessions et journaux');
  ok(await lst(other) === 403 && await cg(other, 's') === 403, 'un autre compte Google : refusé');
  ok(await put(adm, 'users/' + a.uid, base) === 403, 'l\'éditeur ne peut rien écrire');
  ok(await del(adm, 'users/' + a.uid) === 403 && await del(adm, `track/${a.uid}/secu/1`) === 403, 'l\'éditeur ne peut pas effacer des données récentes');
  const c = await user('c-' + Date.now() + '@example.com'), longAgo = Date.now() - 800 * 864e5;
  await put(c, 'users/' + c.uid, {...base, t: longAgo}); await put(c, 'track/' + c.uid, {derniere: longAgo}); await put(c, `track/${c.uid}/secu/1`, {t: Date.now() - 200 * 864e5, ip: '1.1.1.1'});
  // une session déjà vieille ne peut pas être créée par le joueur (début = maintenant seulement) : on la pose règles ouvertes, comme un document qui a vieilli
  const rulesTxt = fs.readFileSync(__dirname + '/../../firebase/firestore.rules', 'utf8');
  const swap = content => fetch('http://127.0.0.1:8080/emulator/v1/projects/village-du-pole:securityRules', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ignore_errors: true, rules: {files: [{name: 'security.rules', content}]}})});
  await swap("rules_version = '2'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if true; } } }");
  const oldS = Date.now() - 400 * 864e5;
  await put(c, `track/${c.uid}/s/old`, {debut: oldS, fin: oldS + 5000, duree: 5, jeu: 4, ev: []});
  await swap(rulesTxt);
  ok(await del(adm, `track/${c.uid}/secu/1`) === 200, 'nettoyage : journal de sécurité de plus de 6 mois');
  ok(await del(adm, `track/${c.uid}/s/old`) === 200, 'nettoyage : session de plus de 13 mois');
  ok(await del(adm, 'users/' + c.uid) === 200 && await del(adm, 'track/' + c.uid) === 200, 'nettoyage : compte inactif depuis plus de 2 ans');
  ok(await del(a, 'users/' + a.uid) === 200 && await del(a, 'track/' + a.uid) === 200, 'le joueur supprime ses données');
  console.log(log.join('\n')); console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON');
})();
