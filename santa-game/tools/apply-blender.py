# Intègre les rendus Blender au pack du jeu : réduction (super-échantillonnage), couleurs plus vives,
# liseré sombre autour des silhouettes (comme bake.js), WebP, et mise à jour de assets/pack/pack.json.
# Usage : python3 tools/apply-blender.py <dossier des rendus>
import json, os, sys, time
from PIL import Image, ImageEnhance, ImageFilter

SRC = sys.argv[1]
PACK = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'pack')
pack = json.load(open(os.path.join(PACK, 'pack.json')))
meta = json.load(open(os.path.join(SRC, 'meta.json')))

def density(k): return 2 if k.startswith('forest') else 2.4 if k == 'splash' else 3

def process(k, m):
    im = Image.open(os.path.join(SRC, m['f'])).convert('RGBA')
    d = density(k)
    W, H = max(2, round(m['w'] * d)), max(2, round(m['h'] * d))
    im = im.resize((W, H), Image.LANCZOS)
    rgb, a = im.convert('RGB'), im.getchannel('A')
    rgb = ImageEnhance.Color(rgb).enhance(1.18)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.07)
    im = Image.merge('RGBA', (*rgb.split(), a))
    # liseré : silhouette (pas l'ombre, qui est semi-transparente) élargie, posée dessous
    if k != 'splash':
        r = max(1, round(d * .9))
        mask = a.point(lambda v: 255 if v > 150 else 0).filter(ImageFilter.MaxFilter(2 * r + 1))
        line = Image.new('RGBA', im.size, (34, 22, 30, 0)); line.putalpha(mask.point(lambda v: int(v * .62)))
        im = Image.alpha_composite(line, im)
    return im

n = 0
for k, m in meta.items():
    im = process(k, m)
    if k == 'splash':
        f = pack.get('splash', {}).get('f', 'splash.webp'); im.save(os.path.join(PACK, f), 'WEBP', quality=90, method=6)
        pack['splash'] = {'f': f, 'ax': m['ax'], 'ay': m['ay'], 'w': m['w'], 'h': m['h']}
    elif k in pack['spr']:
        e = pack['spr'][k]; im.save(os.path.join(PACK, e['f']), 'WEBP', quality=90, method=6)
        e.update(ax=m['ax'], ay=m['ay'], w=m['w'], h=m['h'])
    else: continue
    n += 1
pack['v'] = format(int(time.time()), 'x')
json.dump(pack, open(os.path.join(PACK, 'pack.json'), 'w'))
print('images Blender intégrées :', n)
