#!/usr/bin/env python3
# Fabrique /essais/ : une COPIE DE TEST du vrai jeu (même moteur, même village), non liée au jeu, noindex,
# sans compte ni écriture en ligne, avec son propre village local (village test niveau 20). Les essais visuels et jouables
# sont dans essais/xp/ (jamais écrasés). Relancer ce script après chaque changement du jeu pour garder la copie à jour.
import os, re, shutil, sys
G = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); E = os.path.join(G, 'essais')
if os.path.isdir(os.path.join(E, 'js')): shutil.rmtree(os.path.join(E, 'js'))
shutil.copytree(os.path.join(G, 'js'), os.path.join(E, 'js'))
shutil.copy(os.path.join(G, 'tools', 'editeur', 'village-test-niveau20.txt'), os.path.join(E, 'village-test-niveau20.txt'))
def patch(rel, pairs):
    p = os.path.join(E, rel); s = open(p, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s: sys.exit(f'motif introuvable dans {rel} : {old[:60]}')
        s = s.replace(old, new)
    open(p, 'w', encoding='utf-8').write(s)
LOCAL = r"/^(localhost|127\.0\.0\.1)$/.test(location.hostname)"
patch('js/firebase-config.js', [("export const FIREBASE_CONFIG = {", "export const FIREBASE_CONFIG_DESACTIVE = {")])
open(os.path.join(E, 'js', 'firebase-config.js'), 'a', encoding='utf-8').write("\n// essais : aucun compte, aucune écriture en ligne\nexport const FIREBASE_CONFIG = null;\n")
patch('js/v2/town.js', [("const KEY = 'village-du-pole-v5';", "const KEY = 'vdp-essais-v5';   // essais : village séparé du vrai jeu")])
patch('js/v2/main.js', [
  ("const ROOT = new URL('../../', import.meta.url).href;", "const ROOT = new URL('../../../', import.meta.url).href;   // essais : les images sont celles du jeu"),
  ("const DEV = " + LOCAL + ";", "const DEV = true;   // essais"),
  ("fetch('version.json?c=' + realNow()", "fetch('../version.json?c=' + realNow()"),
  ("const saved = T.loadTown();", "let saved = T.loadTown();\n// essais : village de démonstration niveau 20 (le même que le « village test éditeur »)\nif (!saved){ try { saved = T.migrate(await T.importCode(await (await fetch('village-test-niveau20.txt', {cache: 'no-store'})).text())); } catch(e){ console.warn(e); } }"),
  ("let S = saved || T.newTown();", "let S = saved || T.newTown(); S.legal ||= {v: 'essais', t: Date.now(), cgu: true, analyse: false}; S.guest = 1; S.chIntro = 1;"),
  ("function legalGate(go){\n", "function legalGate(go){ return go();\n"),
  ("  const d = new Date(), h = HOUR_FORCE ?? d.getHours() + d.getMinutes() / 60;", "  const d = new Date(), h = window.__xpHour ?? HOUR_FORCE ?? d.getHours() + d.getMinutes() / 60;"),
  ("  items.sort((a, b) => a.d - b.d);\n  for (const it of items) it.f();", "  items.sort((a, b) => a.d - b.d);\n  try { window.__fx?.under(ctx, W, H); } catch(e){}\n  for (const it of items) it.f();"),
  ("  drawDrop();\n  ambiance();", "  drawDrop();\n  ambiance();\n  try { window.__fx?.over(ctx, W, H); } catch(e){}"),
  ("navigator.serviceWorker.register('sw.js').catch(() => {});", "void 0;   // essais : pas de service worker"),
  ("if (" + LOCAL + ") window.__v2 = {", "window.__v2 = {"),
  ("function collectBld(o){", "function collectBld(o){ try { const b = BUILDINGS[o.type], c = toScreen(o.x + b.w / 2, o.y + b.h / 2); window.__fx?.burst(c.x, c.y - 40 * cam.z); } catch(e){}"),
  ("function fxPoof(o){", "function fxPoof(o){ try { const b = BUILDINGS[o.type], c = toScreen(o.x + b.w / 2, o.y + b.h / 2); window.__fx?.burst(c.x, c.y - 30 * cam.z, ['#ffffff', '#ffd34a', '#c9e6ff']); } catch(e){}"),
])
s = open(os.path.join(E, 'js/v2/main.js'), encoding='utf-8').read()
s += """
// essais : accès du module d'essais (xp/) au vrai moteur
window.__ess = {get S(){ return S; }, T, M, toScreen, cam, campGo, cinema, bravo, openPanel, closePanel, sfx, ICON, SPR, B, giveReward, save, toast, centerOn, get W(){ return W; }, get H(){ return H; }};
document.dispatchEvent(new Event('ess-ready'));
"""
open(os.path.join(E, 'js/v2/main.js'), 'w', encoding='utf-8').write(s)
open(os.path.join(E, 'js', 'assets.js'), 'a', encoding='utf-8').write('\n// essais : accès à la bibliothèque des modèles\nexport const __A = A;\n')
for f in ['js/fishing.js', 'js/battle3d.js', 'js/minigames.js']:
    p = os.path.join(E, f); t = open(p, encoding='utf-8').read(); open(p, 'w', encoding='utf-8').write(t.replace("if (" + LOCAL + ") window.", "window."))
h = open(os.path.join(G, 'index.html'), encoding='utf-8').read()
h = h.replace('src="assets/', 'src="../assets/').replace('href="icon-', 'href="../icon-').replace('<link rel="manifest" href="manifest.webmanifest">', '')
h = re.sub(r'<title>[^<]*</title>', '<title>Essais — Village du Pôle</title>\n<meta name="robots" content="noindex, nofollow, noarchive">', h, count=1)
h = re.sub(r'<script type="module" src="js/v2/main.js\?v=\d+"></script>', '<script type="module" src="js/v2/main.js?e=1"></script>\n<link rel="stylesheet" href="xp/xp.css">\n<script type="module" src="xp/xp.js"></script>', h)
open(os.path.join(E, 'index.html'), 'w', encoding='utf-8').write(h)
print('essais/ prêt')
