#!/bin/bash
# Met en ligne la version du dépôt sur gh-pages : on copie EXACTEMENT les fichiers servis, et tout le reste est retiré
# (une seule version en ligne, rien de mort). Usage : tools/deploy.sh <dossier du clone gh-pages>
set -e
SRC="$(cd "$(dirname "$0")/.." && pwd)"; DST="$1"
[ -d "$DST/.git" ] || [ -f "$DST/.git" ] || { echo "clone gh-pages introuvable : $DST"; exit 1; }
V=$(python3 -c "import json;print(json.load(open('$SRC/version.json'))['v'])")
grep -q "vdp-v$V'" "$SRC/sw.js" || { echo "sw.js n'a pas le cache vdp-v$V"; exit 1; }
grep -q "main.js?v=$V\"" "$SRC/index.html" || { echo "index.html ne charge pas main.js?v=$V"; exit 1; }
rsync -a --delete --exclude .git --exclude .nojekyll \
  --include 'index.html' --include 'sw.js' --include 'version.json' --include 'manifest.webmanifest' --include 'icon-*.png' \
  --include 'js/***' --include 'assets/' --include 'assets/*.glb' --include 'assets/pack/***' --include 'assets/battle/***' \
  --exclude '*' "$SRC/" "$DST/"
touch "$DST/.nojekyll"
cd "$DST" && git add -A && git commit -qm "v$V" && git push -q origin HEAD:gh-pages && echo "en ligne : v$V"
