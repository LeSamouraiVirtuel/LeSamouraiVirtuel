// Rend les bâtiments d'essai (essais/xp/rendu.html) avec Chromium + WebGL logiciel, comme tools/export-pack.mjs,
// et enregistre les images dans essais/pack2/ + pack2.json. Rien n'est publié : tout reste dans la branche.
const {chromium} = require('playwright'), fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'essais', 'pack2'); fs.mkdirSync(OUT, {recursive: true});
(async () => { const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const p = await b.newPage({viewport: {width: 1100, height: 900}}); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('CON', m.text()));
  await p.goto('http://localhost:8765/essais/xp/rendu.html' + (process.argv[2] ? '?only=' + process.argv[2] : '')); await p.waitForFunction(() => window.__out, null, {timeout: 900000});
  const out = await p.evaluate(() => window.__out), json = fs.existsSync(path.join(OUT, 'pack2.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'pack2.json'))) : {};
  for (const [k, v] of Object.entries(out)){ const f = 'e_' + k.replace(/[:@]/g, '_') + '.webp'; fs.writeFileSync(path.join(OUT, f), Buffer.from(v.url.split(',')[1], 'base64')); json[k] = {f, ax: v.ax, ay: v.ay, w: v.w, h: v.h}; }
  fs.writeFileSync(path.join(OUT, 'pack2.json'), JSON.stringify(json));
  await p.screenshot({path: path.join(__dirname, 'tests', 'out', 'essais-batiments.png'), fullPage: true}); console.log('images :', Object.keys(out).length); await b.close(); })();
