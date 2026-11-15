// Ajoute au pack les icônes de Flocon (6 stades × tous les pelages). Usage : serveur local 8765, puis node tools/export-pets.mjs
import {createRequire} from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url); const {chromium} = require('playwright');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../assets/pack');
const b = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
const p = await b.newPage({viewport: {width: 390, height: 844}}); p.on('pageerror', e => { if (!/export prêt/.test(e.message)) console.log('PAGEERR', e.message); });
await p.goto('http://localhost:8765/index.html?export=pet'); await p.waitForFunction(() => window.__export, null, {timeout: 1800000});
await p.evaluate(() => { for (const k of Object.keys(__export.ICON)){ const src = __export.ICON[k], c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const x = c.getContext('2d');
  for (let a = 0; a < 16; a++){ const t = a / 16 * Math.PI * 2; x.drawImage(src, Math.round(Math.cos(t) * 4), Math.round(Math.sin(t) * 4)); } x.globalCompositeOperation = 'source-in'; x.fillStyle = 'rgba(46,32,44,.95)'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over'; x.drawImage(src, 0, 0); __export.ICON[k] = c; } });
const pack = JSON.parse(fs.readFileSync(path.join(OUT, 'pack.json'))), keys = await p.evaluate(() => Object.keys(__export.ICON)), written = [];
for (const k of keys){ const d = await p.evaluate(k => __export.ICON[k].toDataURL('image/webp', .92), k); const f = 'i_' + k.replace(/[^a-z0-9]+/gi, '_') + '.webp'; fs.writeFileSync(path.join(OUT, f), Buffer.from(d.split(',')[1], 'base64')); pack.icon[k] = f; written.push(f); }
pack.v = pack.v.replace(/p?$/, '') + 'p'; fs.writeFileSync(path.join(OUT, 'pack.json'), JSON.stringify(pack));
fs.writeFileSync(path.join(OUT, '..', 'pets-written.txt'), written.join('\n')); console.log('icônes de Flocon :', keys.length); await b.close();
