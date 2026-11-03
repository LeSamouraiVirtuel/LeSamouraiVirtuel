#!/usr/bin/env python3
"""iphone.py — piloter un iPhone depuis un Mac via « Recopie de l'iPhone ».

Prérequis : Mac sous macOS 15+ et iPhone sous iOS 18+, même compte Apple,
l'app « Recopie de l'iPhone » (iPhone Mirroring) ouverte et connectée,
`brew install cliclick`, et le Terminal autorisé dans Réglages Système >
Confidentialité > Accessibilité ET Enregistrement de l'écran.

Coordonnées : celles de l'image produite par `screenshot` (1 pixel = 1 point),
(0,0) = coin haut-gauche de l'écran de l'iPhone dans la fenêtre.

Exemples :
  python3 iphone.py check
  python3 iphone.py screenshot ecran.png
  python3 iphone.py tap 150 400
  python3 iphone.py swipe up            # up | down | left | right
  python3 iphone.py type "Bonjour"
  python3 iphone.py key enter           # enter | delete | escape | tab | space
  python3 iphone.py home                # écran d'accueil
  python3 iphone.py switcher            # sélecteur d'apps
  python3 iphone.py open "WhatsApp"     # ouvre une app via la recherche
"""
import os
import shutil
import subprocess
import sys
import time

BUNDLE = "com.apple.ScreenContinuity"   # identifiant de « Recopie de l'iPhone »
# Marges entre le bord de la fenêtre et l'écran de l'iPhone (en points).
# Réglables si les clics tombent à côté : IPHONE_TOP / IPHONE_SIDE / IPHONE_BOTTOM
TOP = int(os.environ.get("IPHONE_TOP", "0"))
SIDE = int(os.environ.get("IPHONE_SIDE", "0"))
BOTTOM = int(os.environ.get("IPHONE_BOTTOM", "0"))
DRY = os.environ.get("IPHONE_DRY_RUN")  # pour tester sans Mac

KEYCODES = {"enter": 36, "return": 36, "tab": 48, "space": 49, "delete": 51,
            "escape": 53, "left": 123, "right": 124, "down": 125, "up": 126}


def run(cmd, capture=True):
    if DRY:
        print("[dry-run]", " ".join(cmd))
        if cmd[0] == "osascript" and "bounds" in cmd[-1]:
            return "100, 50, 420, 760"
        return ""
    try:
        res = subprocess.run(cmd, capture_output=capture, text=True)
    except FileNotFoundError:
        sys.exit(f"Commande introuvable : {cmd[0]} (voir README-iPhone.md).")
    if res.returncode != 0:
        sys.exit(f"Erreur {cmd[0]} : {(res.stderr or '').strip()}")
    return (res.stdout or "").strip()


def osa(script):
    return run(["osascript", "-e", script])


def activate():
    osa(f'tell application id "{BUNDLE}" to activate')
    if not DRY:
        time.sleep(0.3)


def screen_rect():
    """Rectangle (x, y, w, h) de l'écran de l'iPhone, en points macOS."""
    out = osa(
        'tell application "System Events" to tell (first process whose '
        f'bundle identifier is "{BUNDLE}") to tell window 1 to '
        'set {p, s} to {position, size}\n'
        'return (item 1 of p as text) & ", " & (item 2 of p as text) & ", " & '
        '(item 1 of s as text) & ", " & (item 2 of s as text) -- bounds'
    )
    try:
        x, y, w, h = (int(float(v)) for v in out.split(","))
    except ValueError:
        sys.exit("Fenêtre « Recopie de l'iPhone » introuvable. Ouvre-la et connecte l'iPhone.")
    return x + SIDE, y + TOP, w - 2 * SIDE, h - TOP - BOTTOM


def to_screen(x, y):
    rx, ry, rw, rh = screen_rect()
    x, y = int(float(x)), int(float(y))
    if not (0 <= x <= rw and 0 <= y <= rh):
        sys.exit(f"({x},{y}) est hors de l'écran de l'iPhone ({rw}x{rh}).")
    return rx + x, ry + y


def cliclick(*args):
    if not DRY and not shutil.which("cliclick"):
        sys.exit("cliclick manquant : brew install cliclick")
    run(["cliclick", "-w", "40", *args])


def cmd_check():
    if not DRY and sys.platform != "darwin":
        sys.exit("Ce script doit tourner sur un Mac.")
    activate()
    x, y, w, h = screen_rect()
    print(f"OK : écran de l'iPhone à ({x},{y}), taille {w}x{h} points.")


def cmd_screenshot(path="iphone.png"):
    activate()
    x, y, w, h = screen_rect()
    run(["screencapture", "-x", "-R", f"{x},{y},{w},{h}", path])
    # Écran Retina : ramène l'image à 1 pixel = 1 point pour des coordonnées simples
    run(["sips", "--resampleWidth", str(w), path])
    print(f"Capture ({w}x{h}) : {os.path.abspath(path)}")


def cmd_tap(x, y):
    activate()
    sx, sy = to_screen(x, y)
    cliclick(f"c:{sx},{sy}")
    print(f"Tap en ({x},{y})")


def cmd_longpress(x, y, seconds="1"):
    activate()
    sx, sy = to_screen(x, y)
    cliclick(f"dd:{sx},{sy}", f"w:{int(float(seconds) * 1000)}", f"du:{sx},{sy}")
    print(f"Appui long en ({x},{y})")


def cmd_swipe(a, y1=None, x2=None, y2=None):
    activate()
    rx, ry, rw, rh = screen_rect()
    if y1 is None:
        cx, cy = rw // 2, rh // 2
        moves = {"up": (cx, int(rh * .75), cx, int(rh * .25)),
                 "down": (cx, int(rh * .25), cx, int(rh * .75)),
                 "left": (int(rw * .85), cy, int(rw * .15), cy),
                 "right": (int(rw * .15), cy, int(rw * .85), cy)}
        if a not in moves:
            sys.exit("Direction : up | down | left | right")
        coords = moves[a]
    else:
        coords = tuple(int(float(v)) for v in (a, y1, x2, y2))
    (sx1, sy1), (sx2, sy2) = to_screen(*coords[:2]), to_screen(*coords[2:])
    steps = [f"dm:{sx1 + (sx2 - sx1) * i // 6},{sy1 + (sy2 - sy1) * i // 6}" for i in range(1, 6)]
    cliclick(f"dd:{sx1},{sy1}", *steps, f"du:{sx2},{sy2}")
    print(f"Swipe {coords}")


def cmd_type(text):
    activate()
    esc = text.replace("\\", "\\\\").replace('"', '\\"')
    osa(f'tell application "System Events" to keystroke "{esc}"')
    print(f"Texte saisi : {text}")


def cmd_key(name):
    activate()
    code = KEYCODES.get(name.lower())
    if code is None:
        sys.exit("Touches : " + ", ".join(KEYCODES))
    osa(f'tell application "System Events" to key code {code}')
    print(f"Touche {name}")


def shortcut(key):
    activate()
    osa(f'tell application "System Events" to keystroke "{key}" using command down')


def cmd_home():
    shortcut("1"); print("Écran d'accueil")


def cmd_switcher():
    shortcut("2"); print("Sélecteur d'apps")


def cmd_search():
    shortcut("3"); print("Recherche")


def cmd_open(app):
    cmd_home()
    cmd_search()
    if not DRY:
        time.sleep(0.6)
    cmd_type(app)
    if not DRY:
        time.sleep(0.8)
    cmd_key("enter")
    print(f"Ouverture de {app}")


COMMANDS = {"check": cmd_check, "screenshot": cmd_screenshot, "tap": cmd_tap,
            "longpress": cmd_longpress, "swipe": cmd_swipe, "type": cmd_type,
            "key": cmd_key, "home": cmd_home, "switcher": cmd_switcher,
            "search": cmd_search, "open": cmd_open}


def main(argv):
    if not argv or argv[0] not in COMMANDS:
        print(__doc__)
        return 0 if argv and argv[0] in ("-h", "--help", "help") else 1
    try:
        COMMANDS[argv[0]](*argv[1:])
    except TypeError:
        sys.exit(f"Mauvais arguments pour « {argv[0]} ». Voir : iphone.py --help")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
