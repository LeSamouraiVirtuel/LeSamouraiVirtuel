// Plafonds, import de sauvegarde, défis de la Maison. Sans navigateur.
import {readFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import * as T from '../../js/v2/town.js';

const log = []; let bad = 0;
const ok = (c, m) => { log.push((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const here = dirname(fileURLToPath(import.meta.url));

const fresh = T.newTown();
const before = JSON.stringify(fresh);
T.sanitizeTown(fresh);
ok(JSON.stringify(fresh) === before, 'un village neuf n’est pas modifié par le plafond');

ok(T.HQ_CHALLENGES_ON === true, 'défis de la Maison allumés');
ok(T.SPEED_CAP_ON === false, 'plafond d’accélérations éteint');
ok(T.speedLeft(fresh) === Infinity, 'sans le plafond, les accélérations ne sont pas comptées');

const s = T.newTown();
s.lvl = 20; s.xp = 1800;
s.objs.find(o => o.type === 'santa').lv = 13;
s.coins = 182000; s.wood = 64000; s.cookies = 52000; s.fabric = 41000; s.stars = 140;
s.inv = {ice: 120, gold: 30, axe: 4, saw: 3, ginger: 1};
const snap = JSON.stringify({coins: s.coins, wood: s.wood, stars: s.stars, hq: T.hqLv(s), lvl: s.lvl, xp: s.xp, inv: s.inv});
T.sanitizeTown(s);
ok(JSON.stringify({coins: s.coins, wood: s.wood, stars: s.stars, hq: T.hqLv(s), lvl: s.lvl, xp: s.xp, inv: s.inv}) === snap, 'le village test éditeur (niveau 20, Maison 13) passe sous les plafonds');

const cheat = T.newTown();
cheat.lvl = 999999; cheat.coins = 1e15; cheat.wood = 1e15; cheat.stars = 2.5e6; cheat.xp = 1e12;
cheat.objs.find(o => o.type === 'santa').lv = 500;
cheat.objs.find(o => o.type === 'sawmill').lv = 80;
cheat.inv = {ice: 1e9, train: 1e9};
const notes = [];
T.sanitizeTown(cheat, (k, d) => notes.push(k));
ok(cheat.lvl === T.LVL_MAX && cheat.lvl <= 120, `niveau ramené à ${cheat.lvl}`);
ok(T.hqLv(cheat) === 25, 'Maison ramenée à 25');
ok(cheat.objs.find(o => o.type === 'sawmill').lv <= T.hqLv(cheat) + 2, `scierie ramenée à ${cheat.objs.find(o => o.type === 'sawmill').lv}`);
ok(cheat.coins < 2e9 && cheat.wood < 2e9 && cheat.stars < 100000 && cheat.stars < 2.5e6, `niveau 120 : pièces ${cheat.coins}, bois ${cheat.wood}, étoiles ${cheat.stars}`);
const baby = T.newTown(); baby.coins = 1e15; baby.wood = 1e15; baby.stars = 2.5e6;
T.sanitizeTown(baby);
ok(baby.lvl === 1 && baby.coins < 500000 && baby.wood < 100000 && baby.stars < 20000, `niveau 1 : pièces ${baby.coins}, bois ${baby.wood}, étoiles ${baby.stars}`);
ok(cheat.inv.ice < 1e6 && cheat.inv.train < 5000, 'stocks d’inventaire plafonnés');
ok(notes.includes('niveau') && notes.includes('pieces') && notes.includes('etoiles_ramenees'), 'les dépassements sont signalés');

const rich = T.newTown();
rich.lvl = 30; rich.iap = {p5: 5, starter: 1};
rich.log = {ev: [['t', 'iap', {k: 'p5'}], ['t', 'iap', {k: 'p5'}], ['t', 'iap', {k: 'p5'}], ['t', 'iap', {k: 'p5'}], ['t', 'iap', {k: 'p5'}], ['t', 'iap', {k: 'starter'}]], agg: {}};
rich.stars = 5 * 6500 + 500 + 100;
rich.coins = 200000;
const starsBefore = rich.stars, coinsBefore = rich.coins;
T.sanitizeTown(rich);
ok(rich.stars === starsBefore && rich.coins === coinsBefore, `les achats de test restent (étoiles ${rich.stars}, pièces ${rich.coins})`);

const sp = T.challengeSpec(s, 14);
ok(sp && sp.n === 2 && sp.pts === 10 && sp.min <= 20, `défi Maison 14 : ${sp && sp.n} jouets niv. ≥ ${sp && sp.min}, ${sp && sp.pts} pts`);
ok(T.hqNeeds(s, 14).length > 0, 'sans jouets ni points, le défi bloque');
s.inv.bell = 2; s.cnt.orders = 200;
ok(T.hqNeeds(s, 14).length === 0, 'jouets de niveau 12 et lettres : le défi est prêt');
ok(T.challengeSpec(s, 13) === null, 'pas de défi avant la Maison 14');
T.setRaceBrakes(true);
ok(T.SPEED_CAP_ON === true && T.HQ_CHALLENGES_ON === true, 'les tests peuvent allumer le plafond sans éteindre les défis');
T.setRaceBrakes(false);
ok(T.SPEED_CAP_ON === false && T.HQ_CHALLENGES_ON === true, 'le plafond se rééteint, les défis restent');

let threw = '';
try { await T.importCode('pas un code'); } catch (e) { threw = e.message; }
ok(/Village du Pôle/.test(threw), `code inconnu refusé : ${threw}`);
try { await T.importCode('{' + '"v":5}'); } catch (e) { threw = e.message; }
ok(/illisible/.test(threw), `fichier incomplet refusé : ${threw}`);

const round = await T.importCode(await T.exportCode(T.newTown()));
ok(round.v === 5 && round.objs.some(o => o.type === 'santa') && !round.sig && !round.importNote, 'un export officiel se recharge tel quel');

const tampered = await T.exportCode(T.newTown());
const body = JSON.parse(Buffer.from(tampered.slice(5), 'base64').toString('utf8').startsWith('{') ? Buffer.from(tampered.slice(5), 'base64').toString('utf8') : '{}');
// VDP2 est compressé : on falsifie un VDP1, plus simple à modifier.
const town = T.newTown(); town.coins = 50;
const code = await (async () => { const json = JSON.stringify({...JSON.parse(JSON.stringify(town)), sig: '000'}); 
  return 'VDP1:' + Buffer.from(json).toString('base64'); })();
try { await T.importCode(code); threw = ''; } catch (e) { threw = e.message; }
ok(/modifié/.test(threw), `somme de contrôle fausse refusée : ${threw}`);

const legacy = T.newTown(); legacy.coins = 1e15; legacy.lvl = 4;
const legacyCode = 'VDP1:' + Buffer.from(JSON.stringify(legacy)).toString('base64');
const loaded = await T.importCode(legacyCode);
ok(loaded.coins < 1e12 && loaded.importNote, `vieux code sans somme : accepté et plafonné (${loaded.coins}) — ${loaded.importNote}`);

const file = readFileSync(join(here, '../editeur/village-test-niveau20.txt'), 'utf8');
const editor = await T.importCode(file);
ok(editor.lvl === 20 && editor.testEditeur && T.hqLv(editor) === 13 && !editor.importNote, `code éditeur niveau 20 chargé (Maison ${T.hqLv(editor)}, pièces ${editor.coins})`);

console.log(log.join('\n'));
console.log(bad ? `ÉCHECS : ${bad}` : 'TOUT EST BON');
process.exit(bad ? 1 : 0);
