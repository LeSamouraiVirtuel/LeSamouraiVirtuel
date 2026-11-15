// Génère des modèles 3D avec Meshy (IA texte → 3D) pour remplacer les bâtiments du jeu.
// Clé lue dans la variable d'environnement MESHY_API_KEY (paramètres de l'environnement, jamais dans le code).
//
// Usage : node tools/meshy.mjs [clé1 clé2 ...]   (sans argument : tous les modèles de la liste)
// Sortie : assets/meshy/<clé>.glb + assets/meshy/<clé>.png (aperçu) + assets/meshy/tasks.json (reprise possible)
import fs from 'fs';
import path from 'path';

const KEY = process.env.MESHY_API_KEY;
if (!KEY){ console.error('MESHY_API_KEY manquante'); process.exit(1); }
const API = 'https://api.meshy.ai/openapi/v2/text-to-3d';
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../assets/meshy');
fs.mkdirSync(OUT, {recursive: true});
const STYLE = 'stylized cozy mobile game asset, Township / Clash of Clans style, hand-painted cartoon textures, chunky soft shapes, warm Christmas lights, thick snow on the roof, isometric-friendly, single building on a small square snowy base, no background';
// clé du jeu → description (bâtiments d'abord : c'est là que la différence se voit le plus)
export const MODELS = {
  santa:    "Santa Claus's big wooden log house, red and white roof, warm glowing windows, Christmas wreath on the door, decorated tree beside it",
  orders:   'small wooden sleigh delivery office with a red awning, a parked red sleigh full of gifts, mailbox, lantern',
  barn:     'cozy red wooden barn with big doors, hay bales, crates and sacks of goods, snowy roof',
  bakery:   'gingerbread bakery shop with a big bread sign, candy cane pillars, chimney with smoke',
  dairy:    'small blue-and-white dairy with milk cans and a cheese wheel sign',
  sugarmill:'wooden sugar mill with a water wheel and candy-striped sacks',
  pastry:   'pink pastry shop with a giant cupcake on the roof, striped awning',
  toyshop:  "Santa's toy workshop with a big gear sign, toy soldiers at the door, gift boxes",
  cabin:    'tiny cute elf cottage with a round door, colorful roof, chimney',
  bighouse: 'large two-storey family chalet with balconies and Christmas lights',
  grocery:  'small village grocery with fruit stands and a green awning',
  school:   'little elf school with a bell tower and a snowy playground',
  postoffice:'Christmas post office with a giant letterbox and stacked parcels',
  henhouse: 'snowy wooden chicken coop with a small fenced yard and three chickens',
  cowshed:  'snowy cow shed with a fenced yard and two cows',
  bunny:    'fluffy angora rabbit hutch with a fenced yard and white rabbits',
};
const H = {'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json'};
const TF = path.join(OUT, 'tasks.json');
const tasks = fs.existsSync(TF) ? JSON.parse(fs.readFileSync(TF, 'utf8')) : {};
const saveTasks = () => fs.writeFileSync(TF, JSON.stringify(tasks, null, 1));
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function call(method, url, body){
  const r = await fetch(url, {method, headers: H, body: body && JSON.stringify(body)});
  const t = await r.text(); if (!r.ok) throw new Error(`${r.status} ${t.slice(0, 300)}`); return JSON.parse(t);
}
async function wait(id, label){
  for (;;){ const t = await call('GET', `${API}/${id}`); process.stdout.write(`\r${label} ${t.status} ${t.progress ?? ''}%   `);
    if (t.status === 'SUCCEEDED'){ console.log(); return t; }
    if (t.status === 'FAILED' || t.status === 'CANCELED') throw new Error(`${label}: ${t.status} ${JSON.stringify(t.task_error || '')}`);
    await sleep(8000); }
}
async function make(k){
  const T = tasks[k] ||= {};
  if (!T.preview){ T.preview = (await call('POST', API, {mode: 'preview', prompt: `${MODELS[k]}. ${STYLE}`.slice(0, 800), ai_model: 'latest', target_polycount: 60000, origin_at: 'bottom', target_formats: ['glb']})).result; saveTasks(); }
  await wait(T.preview, `${k} (forme)`);
  if (!T.refine){ T.refine = (await call('POST', API, {mode: 'refine', preview_task_id: T.preview, enable_pbr: false, texture_prompt: `${MODELS[k]}, bright saturated hand-painted cartoon colors, soft warm lighting baked in`.slice(0, 800), target_formats: ['glb']})).result; saveTasks(); }
  const r = await wait(T.refine, `${k} (textures)`);
  for (const [ext, url] of [['glb', r.model_urls?.glb], ['png', r.thumbnail_url]]) if (url){ const b = Buffer.from(await (await fetch(url)).arrayBuffer()); fs.writeFileSync(path.join(OUT, `${k}.${ext}`), b); }
  T.done = true; T.credits = (T.credits || 0) + (r.consumed_credits || 0); saveTasks();
  console.log(`✓ ${k}`);
}
const list = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MODELS);
for (const k of list){ if (!MODELS[k]){ console.log('inconnu :', k); continue; } if (tasks[k]?.done && fs.existsSync(path.join(OUT, k + '.glb'))) continue; try { await make(k); } catch (e){ console.log(`✗ ${k}: ${e.message}`); } }
