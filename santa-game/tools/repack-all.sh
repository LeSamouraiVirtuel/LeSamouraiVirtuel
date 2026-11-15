set -e
cd "$(dirname "$0")/.."
NODE_PATH=$(npm root -g) node tools/export-pack.mjs
python3 - <<'PY'
from PIL import Image, ImageEnhance; import glob, json, os
P=json.load(open('assets/pack/pack.json'))
spr={m['f'] for m in P['spr'].values()}
n=0
for f in glob.glob('assets/pack/*.webp'):
    name=os.path.basename(f); im=Image.open(f).convert('RGBA'); w,h=im.size
    if name in spr or name=='splash.webp':
        k=.5 if name.startswith('s_forest') else 2/3
        im=im.resize((max(1,round(w*k)),max(1,round(h*k))),Image.LANCZOS)
    r,g,b,a=im.split(); rgb=Image.merge('RGB',(r,g,b))
    rgb=ImageEnhance.Color(rgb).enhance(1.28); rgb=ImageEnhance.Contrast(rgb).enhance(1.06)
    im=Image.merge('RGBA',(*rgb.split(),a)); im.save(f,'WEBP',quality=88,method=4); n+=1
P['v']=str(P['v'])+'c'; json.dump(P,open('assets/pack/pack.json','w'))
print('post',n)
PY
NODE_PATH=$(npm root -g) node tools/export-walk.mjs
python3 - <<'PY'
from PIL import Image, ImageEnhance; import glob
for f in glob.glob('assets/pack/s_elfw_*.webp'):
    im=Image.open(f).convert('RGBA'); w,h=im.size
    im=im.resize((max(1,round(w*2/3)),max(1,round(h*2/3))),Image.LANCZOS)
    a=im.getchannel('A'); rgb=im.convert('RGB')
    rgb=ImageEnhance.Color(rgb).enhance(1.28); rgb=ImageEnhance.Contrast(rgb).enhance(1.06)
    rgb.putalpha(a); rgb.save(f,'WEBP',quality=88)
print('walk ok')
PY
bash tools/repack-skins.sh
du -sh assets/pack
