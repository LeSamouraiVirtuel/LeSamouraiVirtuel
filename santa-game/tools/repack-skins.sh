set -e
cd "$(dirname "$0")/.."
NODE_PATH=$(npm root -g) node tools/export-skins.mjs
python3 - <<'PY'
from PIL import Image, ImageEnhance
for name in open('assets/skins-written.txt').read().split():
    f='assets/pack/'+name; im=Image.open(f).convert('RGBA'); w,h=im.size
    if name.startswith('s_'): im=im.resize((max(1,round(w*2/3)),max(1,round(h*2/3))),Image.LANCZOS)
    a=im.getchannel('A'); rgb=im.convert('RGB')
    rgb=ImageEnhance.Color(rgb).enhance(1.28); rgb=ImageEnhance.Contrast(rgb).enhance(1.06)
    rgb.putalpha(a); rgb.save(f,'WEBP',quality=88)
print('post ok')
PY
rm -f assets/skins-written.txt
du -sh assets/pack
