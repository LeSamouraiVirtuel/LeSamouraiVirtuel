// Rend la carte de campagne d'essai (essais/xp/rendu-carte.html) → essais/pack2/carte_*.webp + carte.json (branche seulement)
const {chromium} = require('playwright'), fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'essais', 'pack2'); fs.mkdirSync(OUT, {recursive: true});
(async () => { const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  const p = await b.newPage({viewport: {width: 1300, height: 900}}); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/essais/xp/rendu-carte.html'); await p.waitForFunction(() => window.__out, null, {timeout: 900000});
  const out = await p.evaluate(() => window.__out), json = {};
  for (const [k, v] of Object.entries(out)){ const f = 'carte_' + k + '.webp'; fs.writeFileSync(path.join(OUT, f), Buffer.from(v.url.split(',')[1], 'base64')); json[k] = {f, ax: v.ax, ay: v.ay, w: v.w, h: v.h}; }
  fs.writeFileSync(path.join(OUT, 'carte.json'), JSON.stringify(json));
  await p.screenshot({path: path.join(__dirname, 'tests', 'out', 'essais-carte-rendu.png'), fullPage: true}); console.log(JSON.stringify(json).slice(0, 400)); await b.close(); })();
