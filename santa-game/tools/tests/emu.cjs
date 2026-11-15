// Tests de comptes : TOUJOURS sur l'émulateur Firebase local, jamais sur la vraie base des joueurs.
// - chaque page ouverte par Playwright passe le jeu en mode émulateur (localStorage « vdp-emu », actif seulement sur localhost) ;
// - les appels directs (création, nettoyage) visent l'émulateur ;
// - si l'émulateur ne tourne pas, le test s'arrête au lieu de toucher la vraie base.
const pw = require('playwright'), {execSync} = require('child_process');
try { execSync('curl -s -m 2 http://127.0.0.1:9099 >/dev/null && curl -s -m 2 http://127.0.0.1:8080 >/dev/null'); }
catch(e){ console.log('Émulateur Firebase absent : lance « firebase emulators:start » (auth 9099, firestore 8080). Test arrêté, la vraie base n\'est pas touchée.'); process.exit(1); }
for (const bt of [pw.webkit, pw.chromium]){ const launch = bt.launch.bind(bt);
  bt.launch = async (...a) => { const b = await launch(...a); const nc = b.newContext.bind(b);
    b.newContext = async (...o) => { const c = await nc(...o); await c.addInitScript(() => { try { localStorage.setItem('vdp-emu', '1'); } catch(e){} }); return c; }; return b; }; }
module.exports = {AU: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/', FS: 'http://127.0.0.1:8080/v1/projects/village-du-pole/databases/(default)/documents/'};
