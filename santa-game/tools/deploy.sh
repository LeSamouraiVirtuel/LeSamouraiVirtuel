#!/bin/bash
# Met en ligne la version du dépôt sur gh-pages : on copie EXACTEMENT les fichiers servis, et tout le reste est retiré
# (une seule version en ligne, rien de mort). Usage : tools/deploy.sh <dossier du clone gh-pages>
set -e
SRC="$(cd "$(dirname "$0")/.." && pwd)"; DST="$1"
[ -d "$DST/.git" ] || [ -f "$DST/.git" ] || { echo "clone gh-pages introuvable : $DST"; exit 1; }
V=$(python3 -c "import json;print(json.load(open('$SRC/version.json'))['v'])")
grep -q "vdp-v$V'" "$SRC/sw.js" || { echo "sw.js n'a pas le cache vdp-v$V"; exit 1; }
grep -q "main.js?v=$V\"" "$SRC/index.html" || { echo "index.html ne charge pas main.js?v=$V"; exit 1; }
# chaque module doit se lire comme un module de navigateur (un contrôle « script » laisse passer des erreurs)
T=$(mktemp -d); for f in "$SRC"/js/*.js "$SRC"/js/v2/*.js; do cp "$f" "$T/c.mjs"; node --check "$T/c.mjs" >/dev/null 2>&1 || { echo "erreur de syntaxe (module) : $f"; rm -rf "$T"; exit 1; }; done; rm -rf "$T"
python3 - "$SRC" "$DST" <<'PY'
# copie exacte : on garde seulement les fichiers servis, tout le reste est effacé dans gh-pages
import sys, os, shutil, filecmp
src, dst = sys.argv[1], sys.argv[2]
keep = ['index.html', 'privacy.html', 'cgu.html', 'mentions.html', 'tdb-7q4x.html', 'sw.js', 'version.json', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'js', 'assets/pack', 'assets/battle']
keep += ['assets/' + f for f in os.listdir(os.path.join(src, 'assets')) if f.endswith('.glb')]
want = set()
for k in keep:
    p = os.path.join(src, k)
    if os.path.isdir(p):
        for d, _, fs in os.walk(p):
            for f in fs: want.add(os.path.relpath(os.path.join(d, f), src))
    elif os.path.exists(p): want.add(k)
for d, ds, fs in os.walk(dst):
    if '.git' in ds: ds.remove('.git')
    for f in fs:
        r = os.path.relpath(os.path.join(d, f), dst)
        if r in ('.git', '.nojekyll'): continue
        if r not in want: os.remove(os.path.join(d, f)); print('retiré :', r)
for r in sorted(want):
    a, b = os.path.join(src, r), os.path.join(dst, r); os.makedirs(os.path.dirname(b), exist_ok=True)
    if not os.path.exists(b) or not filecmp.cmp(a, b, shallow=False): shutil.copy2(a, b)
for d, ds, fs in sorted(os.walk(dst, topdown=False), key=lambda x: -len(x[0])):
    if '.git' not in d and d != dst and not os.listdir(d): os.rmdir(d)
PY
touch "$DST/.nojekyll"
cd "$DST" && git add -A && git commit -qm "v$V" && git push -q origin HEAD:gh-pages && echo "en ligne : v$V"
