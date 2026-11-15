// Fabrique le « village test éditeur » niveau 20 dans le vrai jeu (local), puis l'exporte avec la fonction du jeu (code VDP2).
// Réaliste : Maison 13 (défi du niveau 14 visible), bâtiments du niveau 6 à 12, 5 espèces pêchées, 8 camps battus, Flocon niv. 12.
// Marqué testEditeur : aucune alerte triche, exclu du classement et des totaux du tableau de bord.
const {chromium} = require('playwright'), fs = require('fs');
(async () => { const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH}); const p = await (await b.newContext({viewport: {width: 1200, height: 800}})).newPage();
  await p.addInitScript(require('../tests/invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(500); }
  const code = await p.evaluate(async () => {
    const S = __v2.S, T = __v2.T, now = Date.now(), D = 864e5;
    Object.assign(S, {name: 'Village test éditeur', testEditeur: true, lvl: 20, xp: 1800, coins: 182000, wood: 64000, cookies: 52000, fabric: 41000, stars: 140, tuto: 99, introSeen: 1,
      created: now - 9 * D, play: 11 * 3600, guest: 0, chIntro: 0});
    S.legal = {v: '2026-11-15', t: now, cgu: true, analyse: false, annee: 1990, mineur: false, seuil: 15, parent: false};
    S.inv = {...S.inv, ice: 120, gold: 30, axe: 4, saw: 3, ginger: 1, train: 3, box: 2};
    S.fixParcel77 = 1;
    S.fish = {cod: {n: 9, best: 52}, herring: {n: 7, best: 31}, perch: {n: 5, best: 28}, salmon: {n: 3, best: 74}, trout: {n: 2, best: 55}};
    S.fishx = {rod: 1, bait: 0, charm: 0, net: 1};
    S.camps = {at: 8, st: {0: 3, 1: 3, 2: 2, 3: 3, 4: 2, 5: 2, 6: 1, 7: 2}};
    S.pet = {lv: 12, xp: 120, pat: now - 5e6};
    S.cnt = {...S.cnt, orders: 260, exp: 18, make: 420, collect: 900, dig: 140, games: 22, parcel: 30, upgrade: 85, fish: 26, camp: 8};
    S.quest = {i: 45, base: {}};
    // terrain ouvert et bâtiments, posés avec la vraie règle de place du jeu
    for (const k of ['0,1', '1,0', '1,1', '1,2', '2,1', '2,2', '0,2', '2,0']) if (!S.chunks.includes(k)) S.chunks.push(k);
    S.objs.find(o => o.type === 'santa').lv = 13;
    for (const o of S.objs) if (!o.wild && T.isUpgradable(T.BUILDINGS[o.type]) && o.type !== 'santa') o.lv = Math.min(12, Math.max(o.lv || 1, 8));
    const add = (type, lv) => { for (let r = 0; r < 40; r++) for (let x = 18 - r; x <= 18 + r; x++) for (let y = 18 - r; y <= 18 + r; y++){ if (x < 1 || y < 1) continue; if (__v2.fits(type, x, y)){ S.objs.push({id: 't' + type + Math.random().toString(36).slice(2, 6), type, x, y, lv, t: now - 3 * D, q: []}); return true; } } return false; };
    const plan = [['workshop', 9], ['stable', 8], ['storage', 8], ['mill', 7], ['mine', 7], ['theater', 5], ['icewell', 5], ['library', 5], ['station', 5], ['cabin', 8], ['cabin', 8], ['cabin', 7], ['sawmill', 9], ['bakery', 8], ['letters', 8], ['storage', 6], ['mill', 6], ['foundry', 3]];
    const have = t => S.objs.filter(o => o.type === t && !o.wild).length;
    for (const [t, lv] of plan){ if (['workshop', 'stable', 'mine', 'theater', 'icewell', 'library', 'station', 'foundry'].includes(t) && have(t)) { S.objs.filter(o => o.type === t).forEach(o => o.lv = lv); continue; } add(t, lv); }
    for (let i = 0; i < 10; i++) add(['tree', 'lantern', 'snowman', 'bench'][i % 4], 1);
    S.mine = undefined; S.flags = {}; S.flagT = {};
    __v2.save?.(); localStorage.setItem('village-du-pole-v5', JSON.stringify(S));
    return await T.exportCode(S);
  });
  fs.writeFileSync(__dirname + '/village-test-niveau20.txt', code + '\n');
  await p.reload(); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(2500);
  await p.evaluate(() => { document.querySelector('#modal:not([hidden]) [data-m=ok]')?.click(); __v2.cam.z = .8; __v2.centerOn(20, 20); }); await p.waitForTimeout(1500);
  await p.screenshot({path: __dirname + '/village20.png'});
  const info = await p.evaluate(() => ({lvl: __v2.S.lvl, maison: __v2.T.hqLv(__v2.S), bat: __v2.S.objs.filter(o => !o.wild && __v2.T.BUILDINGS[o.type].kind !== 'deco' && __v2.T.BUILDINGS[o.type].kind !== 'path').length, flags: __v2.S.flags}));
  console.log('code', code.length, 'caractères ·', JSON.stringify(info)); await b.close(); })();
