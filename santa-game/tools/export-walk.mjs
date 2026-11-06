// Ajoute au pack les images du cycle de marche des lutins (elfw:tenue:direction:image), sans refaire tout le pack.
// Usage : servir santa-game/ sur http://localhost:8765 puis NODE_PATH=$(npm root -g) node tools/export-walk.mjs
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../assets/pack');
const b = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
const p = await b.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1});
p.on('pageerror', e => { if (!/export prêt/.test(e.message)) console.log('PAGEERR', e.message); });
await p.goto('http://localhost:8765/index.html?export=walk');
await p.waitForFunction(() => window.__export, null, {timeout: 1800000});
await p.evaluate(() => {
  const outline = (src, r, color) => { const c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const x = c.getContext('2d');
    for (let a = 0; a < 16; a++){ const t = a / 16 * Math.PI * 2; x.drawImage(src, Math.round(Math.cos(t) * r), Math.round(Math.sin(t) * r)); }
    x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over'; x.drawImage(src, 0, 0); return c; };
  for (const s of Object.values(__export.SPR)) s.canvas = outline(s.canvas, 4, 'rgba(46,32,44,.92)');
});
const pack = JSON.parse(fs.readFileSync(path.join(OUT, 'pack.json')));
const keys = await p.evaluate(() => Object.keys(__export.SPR));
for (const k of keys){
  const m = await p.evaluate(k => { const s = __export.SPR[k]; return {ax: s.ax, ay: s.ay, w: s.w, h: s.h, d: s.canvas.toDataURL('image/webp', .9)}; }, k);
  const f = 's_' + k.replace(/[^a-z0-9]+/gi, '_') + '.webp';
  fs.writeFileSync(path.join(OUT, f), Buffer.from(m.d.split(',')[1], 'base64'));
  pack.spr[k] = {f, ax: +m.ax.toFixed(2), ay: +m.ay.toFixed(2), w: +m.w.toFixed(2), h: +m.h.toFixed(2)};
}
pack.v = pack.v.replace(/w?$/, '') + 'w';
fs.writeFileSync(path.join(OUT, 'pack.json'), JSON.stringify(pack));
console.log('marche :', keys.length, 'images');
await b.close();
