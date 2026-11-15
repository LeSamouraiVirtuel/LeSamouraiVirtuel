// Exporte chaque scène du jeu (bâtiments, champs, décor, personnages…) en .glb pour le rendu Blender (tools/blender-render.py).
// Usage : servir santa-game/ sur http://localhost:8765 puis  NODE_PATH=$(npm root -g) node tools/export-glb.mjs
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'glb');
fs.mkdirSync(OUT, {recursive: true});
const b = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
const p = await b.newPage({viewport: {width: 390, height: 844}});
p.on('pageerror', e => { if (!/export prêt/.test(e.message)) console.log('PAGEERR', e.message); });
await p.goto('http://localhost:8765/index.html?export');
await p.waitForFunction(() => window.__export, null, {timeout: 1800000});
await p.evaluate(async () => { const m = await import('three/addons/exporters/GLTFExporter.js'); window.__gx = new m.GLTFExporter(); });
const keys = await p.evaluate(() => Object.keys(__export.models));
const meta = {};
for (const k of keys){
  const r = await p.evaluate(async k => {
    const o = __export.models[k]; o.updateMatrixWorld(true);
    const buf = await __gx.parseAsync(o, {binary: true, onlyVisible: true});
    let s = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    const sp = __export.SPR[k] || __export.splash; return {b64: btoa(s), ax: sp.ax, ay: sp.ay, w: sp.w, h: sp.h};
  }, k);
  const f = k.replace(/[^a-z0-9]+/gi, '_') + '.glb';
  fs.writeFileSync(path.join(OUT, f), Buffer.from(r.b64, 'base64'));
  meta[k] = {f, forest: k.startsWith('forest'), shadow: true};
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(meta, null, 1));
console.log('glb:', keys.length);
await b.close();
