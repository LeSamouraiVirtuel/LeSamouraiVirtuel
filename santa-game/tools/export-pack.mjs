// Fabrique assets/pack/ : toutes les images du jeu pré-rendues en WebP haute densité (3×) + pack.json.
// Le téléphone télécharge ces images au lieu de calculer la 3D : chargement rapide et fiable.
//
// Usage : servir santa-game/ sur http://localhost:8765 puis
//   NODE_PATH=$(npm root -g) node tools/export-pack.mjs
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../assets/pack');
fs.rmSync(OUT, {recursive: true, force: true}); fs.mkdirSync(OUT, {recursive: true});

const b = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
const p = await b.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1});
p.on('pageerror', e => { if (!/export prêt/.test(e.message)) console.log('PAGEERR', e.message); });
await p.goto('http://localhost:8765/index.html?export');
await p.waitForFunction(() => window.__export, null, {timeout: 1800000});
const save = async (expr, name) => {
  const data = await p.evaluate(expr);
  fs.writeFileSync(path.join(OUT, name), Buffer.from(data.split(',')[1], 'base64'));
  return name;
};
// Contour sombre autour des bâtiments, des lutins et des icônes : ils se détachent de la neige (comme Township / Hay Day).
// Fait ici, une seule fois : le téléphone reçoit des images déjà détourées, sans calcul ni mémoire en plus.
await p.evaluate(() => {
  const outline = (src, r, color) => {
    const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    const x = c.getContext('2d');
    for (let a = 0; a < 16; a++){ const t = a / 16 * Math.PI * 2; x.drawImage(src, Math.round(Math.cos(t) * r), Math.round(Math.sin(t) * r)); }
    x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-over'; x.drawImage(src, 0, 0);
    return c;
  };
  for (const [k, s] of Object.entries(__export.SPR)){
    if (/^forest|path/.test(k)) continue;
    s.canvas = outline(s.canvas, /^elf/.test(k) ? 4 : /tree/.test(k) ? 3 : 5, 'rgba(46,32,44,.92)');
  }
  for (const k of Object.keys(__export.ICON)) __export.ICON[k] = outline(__export.ICON[k], 4, 'rgba(46,32,44,.95)');
});
const web = c => `(${c}).toDataURL('image/webp', .9)`;
const keys = await p.evaluate(() => ({spr: Object.keys(__export.SPR), icon: Object.keys(__export.ICON), thumb: Object.keys(__export.thumbs)}));
const pack = {v: Date.now().toString(36), spr: {}, icon: {}, thumb: {}};
const safe = k => k.replace(/[^a-z0-9]+/gi, '_');
for (const k of keys.spr){
  const m = await p.evaluate(k => { const s = __export.SPR[k]; return {ax: s.ax, ay: s.ay, w: s.w, h: s.h}; }, k);
  const f = await save(`(() => __export.SPR[${JSON.stringify(k)}].canvas.toDataURL('image/webp', .9))()`, 's_' + safe(k) + '.webp');
  pack.spr[k] = {f, ax: +m.ax.toFixed(2), ay: +m.ay.toFixed(2), w: +m.w.toFixed(2), h: +m.h.toFixed(2)};
}
for (const k of keys.icon) pack.icon[k] = await save(`(() => __export.ICON[${JSON.stringify(k)}].toDataURL('image/webp', .92))()`, 'i_' + safe(k) + '.webp');
for (const k of keys.thumb) pack.thumb[k] = await save(`(() => __export.thumbs[${JSON.stringify(k)}].toDataURL('image/webp', .92))()`, 't_' + safe(k) + '.webp');
pack.portrait = await save(`__export.portrait.toDataURL('image/webp', .92)`, 'portrait.webp');
pack.buildIcon = await save(`__export.buildIcon.toDataURL('image/webp', .92)`, 'build.webp');
const sp = await p.evaluate(() => { const s = __export.splash; return s && {ax: s.ax, ay: s.ay, w: s.w, h: s.h}; });
if (sp){ pack.splash = {f: await save(`__export.splash.canvas.toDataURL('image/webp', .9)`, 'splash.webp'), ...sp}; }
fs.writeFileSync(path.join(OUT, 'pack.json'), JSON.stringify(pack));
let total = 0; for (const f of fs.readdirSync(OUT)) total += fs.statSync(path.join(OUT, f)).size;
console.log('pack:', fs.readdirSync(OUT).length, 'fichiers,', (total / 1024 / 1024).toFixed(1), 'Mo');
await b.close();
