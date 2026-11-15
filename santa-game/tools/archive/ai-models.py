# Modèles 3D gratuits par IA, sans abonnement : FLUX.1-schnell (image, licence Apache 2.0) puis
# TRELLIS de Microsoft (image → 3D texturé, licence MIT), via les démos publiques Hugging Face.
# Nécessite un compte Hugging Face GRATUIT : token « Read » dans la variable d'environnement HF_TOKEN.
# Quota gratuit : quelques minutes de GPU par jour (≈ 3 à 5 bâtiments) ; relancer le lendemain reprend où on en était.
#
# Usage : pip install gradio_client ; python3 tools/ai-models.py [clé1 clé2 ...]
# Sortie : assets/ai/<clé>.png (image de référence) et assets/ai/<clé>.glb (modèle), assets/ai/done.json
import json, os, shutil, sys
from gradio_client import Client, handle_file

TOKEN = os.environ.get('HF_TOKEN')
if not TOKEN: sys.exit('HF_TOKEN manquant (compte Hugging Face gratuit → Settings → Access Tokens → Read)')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'ai')
os.makedirs(OUT, exist_ok=True)
STYLE = ('isometric 3D game asset, stylized cartoon like Township and Clash of Clans mobile games, chunky soft shapes, '
         'hand-painted textures, bright saturated colors, thick snow on the roof, warm glowing windows, Christmas decorations, '
         'single building on a small square snowy base, centered, full view, plain white background, no shadow, no text')
MODELS = {
    'santa': "Santa Claus's big wooden log house with red and white roof, wreath on the door, decorated Christmas tree beside it",
    'orders': 'small wooden sleigh delivery office with a red awning and a red sleigh full of gifts parked in front',
    'barn': 'cozy red wooden barn with big doors, hay bales, crates and sacks',
    'bakery': 'gingerbread bakery shop with a big bread sign, candy cane pillars, chimney',
    'dairy': 'small blue and white dairy shop with milk cans and a cheese wheel sign',
    'sugarmill': 'wooden sugar mill with a water wheel and candy striped sacks',
    'pastry': 'pink pastry shop with a giant cupcake on the roof and a striped awning',
    'toyshop': "Santa's toy workshop with a big gear sign, toy soldiers at the door, gift boxes",
    'cabin': 'tiny cute elf cottage with a round door, colorful roof and chimney',
    'bighouse': 'large two storey family chalet with balconies and Christmas lights',
    'grocery': 'small village grocery with fruit stands and a green awning',
    'school': 'little elf school with a bell tower',
    'postoffice': 'Christmas post office with a giant red letterbox and stacked parcels',
    'henhouse': 'snowy wooden chicken coop with a small fenced yard and chickens',
    'cowshed': 'snowy cow shed with a fenced yard and two cows',
    'bunny': 'angora rabbit hutch with a fenced yard and fluffy white rabbits',
}
DONE = os.path.join(OUT, 'done.json')
done = json.load(open(DONE)) if os.path.exists(DONE) else {}
flux = Client('black-forest-labs/FLUX.1-schnell', hf_token=TOKEN, verbose=False)
trellis = Client('trellis-community/TRELLIS', hf_token=TOKEN, verbose=False)

for k in (sys.argv[1:] or MODELS):
    if done.get(k): continue
    try:
        img = os.path.join(OUT, k + '.png')
        if not os.path.exists(img):
            r = flux.predict(f'{MODELS[k]}. {STYLE}', 7, False, 1024, 1024, 4, api_name='/infer')
            src = r[0] if isinstance(r[0], str) else r[0]['path']; shutil.copy(src, img)
            print('image', k, flush=True)
        trellis.predict(api_name='/start_session')
        prep = trellis.predict(handle_file(img), api_name='/preprocess_image')
        prep = prep if isinstance(prep, str) else prep['path']
        res = trellis.predict(handle_file(prep), [], 0, 7.5, 12, 3, 12, 'stochastic', 0.95, 1024, api_name='/generate_and_extract_glb')
        glb = res[-1] if isinstance(res[-1], str) else res[-1]['path']
        shutil.copy(glb, os.path.join(OUT, k + '.glb'))
        done[k] = True; json.dump(done, open(DONE, 'w'))
        print('✓', k, flush=True)
    except Exception as e:
        print('✗', k, str(e)[:300], flush=True)
        if 'quota' in str(e).lower(): sys.exit('Quota gratuit du jour épuisé : relancer demain.')
