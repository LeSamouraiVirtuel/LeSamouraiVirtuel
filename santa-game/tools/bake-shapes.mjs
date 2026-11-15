// Remplace seulement les images des 4 bâtiments dont la silhouette a changé.
// Le reste du pack n'est pas régénéré. Usage : le jeu sert déjà sur http://127.0.0.1:8765
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const packPath = path.join(root, 'assets/pack/pack.json');
const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));
const chrome = process.env.CHROME || '/usr/bin/google-chrome';
const b = await chromium.launch({executablePath: chrome, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
const p = await b.newPage();
p.on('pageerror', e => console.log('PAGEERR', e.message));
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto('http://127.0.0.1:8765/tools/bake-shapes.html', {waitUntil: 'domcontentloaded'});
await p.waitForFunction(() => window.__shapes || window.__shapesErr, null, {timeout: 180000});
const err = await p.evaluate(() => window.__shapesErr || '');
if (err){ console.error(err); process.exit(1); }
const shapes = await p.evaluate(() => window.__shapes);
for (const [k, s] of Object.entries(shapes)){
  const prev = pack.spr[k]; if (!prev){ console.error('clé absente', k); process.exit(1); }
  fs.writeFileSync(path.join(root, 'assets/pack', prev.f), Buffer.from(s.png.split(',')[1], 'base64'));
  pack.spr[k] = {f: prev.f, ax: +s.ax.toFixed(2), ay: +s.ay.toFixed(2), w: +s.w.toFixed(2), h: +s.h.toFixed(2)};
  console.log(k, prev.f, pack.spr[k].w, '×', pack.spr[k].h);
}
pack.v = Date.now().toString(36);
fs.writeFileSync(packPath, JSON.stringify(pack));
console.log('pack.v', pack.v);
await b.close();
