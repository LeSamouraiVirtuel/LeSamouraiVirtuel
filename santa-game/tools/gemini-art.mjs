// Illustrations du jeu avec Nano Banana (Gemini « image ») et une clé API gratuite Google AI Studio.
// Clé lue dans la variable d'environnement GEMINI_API_KEY (réglages de l'environnement, jamais dans le code).
//
// Usage : node tools/gemini-art.mjs [clé1 clé2 ...]      (sans argument : toute la liste)
// Sortie : assets/art/<clé>.png  (+ art/done.json pour reprendre là où on s'est arrêté si le quota du jour est atteint)
import fs from 'fs';
import path from 'path';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY){ console.error('GEMINI_API_KEY manquante (https://aistudio.google.com/apikey, gratuit)'); process.exit(1); }
const MODELS = (process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image,gemini-2.0-flash-preview-image-generation').split(',');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../assets/art');
fs.mkdirSync(OUT, {recursive: true});

// Style commun : la « bible » visuelle du jeu (même angle, même lumière, même rendu pour tout)
const STYLE = 'Premium mobile game art in the style of Township, Hay Day and Bid Master: hand-painted, rich textures, crisp clean edges, soft warm lighting from the top-left, gentle ambient occlusion, vibrant but harmonious Christmas palette (deep reds, warm wood, emerald greens, snowy whites, golden lights). Isometric 3/4 view at 30 degrees, centered, full object visible, fully isolated on a plain pure white background, no text, no watermark, no frame.';
const ART = {
  // bâtiments (vue isométrique, sur un petit socle enneigé)
  santa: 'Santa Claus\'s big cozy log house with red-and-white roof covered in thick snow, glowing warm windows, wreath on the door, decorated Christmas tree beside it, on a small square snowy plot',
  sawmill: 'small wooden sawmill with a water wheel, stacked logs and fresh planks, snowy roof, lantern, on a small square snowy plot',
  letters: 'cute Christmas letters office with a red mailbox, envelopes, a little wooden counter with a striped awning, snowy roof, on a small square snowy plot',
  bakery: 'gingerbread cookie bakery with icing on the roof, candy cane pillars, chimney with smoke, cookies in the window, on a small square snowy plot',
  mill: 'cozy wool spinning mill with spools of colorful yarn, a spinning wheel by the door, sheep fence, snowy roof, on a small square snowy plot',
  cabin: 'tiny cute elf cottage with a round green door, mushroom-like red roof covered in snow, smoking chimney, on a small square snowy plot',
  storage: 'sturdy wooden storage barn with big doors open on crates, sacks and barrels, snowy roof, on a small square snowy plot',
  workshop: 'Santa\'s toy workshop with big gear sign, toy soldiers at the door, wrapped gifts, colorful lights, snowy roof, on a small square snowy plot',
  orders: 'sleigh delivery post office with a red sleigh full of gifts parked outside, wooden sign with an envelope, snowy roof, on a small square snowy plot',
  stable: 'reindeer stable with two reindeer, hay bales, golden bells, wooden fence, snowy roof, on a small square snowy plot',
  theater: 'small puppet theater with red velvet curtains, string lights, wooden benches in front, snowy roof, on a small square snowy plot',
  // gardiens (bustes, regard vers le joueur)
  k_santa: 'portrait bust of a jolly old Santa Claus with white beard and red hat, friendly smile, looking at the viewer',
  k_sawmill: 'portrait bust of a sturdy elf lumberjack named Sven with a plaid shirt, axe on shoulder and green hood, cheerful',
  k_letters: 'portrait bust of a young elf girl postmistress named Plume with a feather quill and envelopes, red cap, smiling',
  k_bakery: 'portrait bust of a round kind grandma baker elf named Mother Michou with apron, flour on cheeks, holding a gingerbread cookie',
  k_mill: 'portrait bust of an elf seamstress named Bobine with knitting needles and a colorful scarf, smiling',
  k_workshop: 'portrait bust of an old elf toymaker named Master Gear with goggles on forehead and a wooden toy train',
  k_orders: 'portrait bust of an elf mail carrier named Grelot with a bell cap and a big bag of letters, joyful',
  k_storage: 'portrait bust of a friendly big polar bear warehouse keeper wearing a scarf and holding a clipboard',
  k_stable: 'portrait bust of an elf reindeer keeper lady with braided hair, holding reins, a reindeer head beside her',
  k_theater: 'portrait bust of a whimsical puppeteer elf named Mister Thread with a top hat and a little marionette',
  // décors d'écran
  bg_village: 'wide background scene of a snowy Christmas village street at dusk, lantern lights, fir trees, soft bokeh, no characters, 9:16 vertical composition',
  splash: 'splash art: Santa Claus\'s cozy snowy village at night under northern lights, Santa\'s house glowing, elves and reindeer, sleigh in the sky, magical atmosphere, vertical 9:16, leave the top third free for a logo',
};
const DONE = path.join(OUT, 'done.json');
const done = fs.existsSync(DONE) ? JSON.parse(fs.readFileSync(DONE, 'utf8')) : {};
async function gen(prompt){
  let last = '';
  for (const m of MODELS){
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${KEY}`, {method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({contents: [{parts: [{text: prompt}]}], generationConfig: {responseModalities: ['IMAGE', 'TEXT']}})});
    const j = await r.json().catch(() => ({}));
    const part = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part) return Buffer.from(part.inlineData.data, 'base64');
    last = `${m}: ${r.status} ${JSON.stringify(j.error || j).slice(0, 300)}`;
    if (r.status === 429) throw new Error('QUOTA ' + last);
  }
  throw new Error(last);
}
const list = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ART);
for (const k of list){
  if (done[k] || !ART[k]) continue;
  try {
    const img = await gen(`${ART[k]}. ${STYLE}`);
    fs.writeFileSync(path.join(OUT, k + '.png'), img); done[k] = true; fs.writeFileSync(DONE, JSON.stringify(done, null, 1));
    console.log('✓', k);
    await new Promise(r => setTimeout(r, 4000));
  } catch (e){ console.log('✗', k, e.message.slice(0, 300)); if (/QUOTA/.test(e.message)) { console.log('Quota atteint : relancer plus tard.'); break; } }
}
