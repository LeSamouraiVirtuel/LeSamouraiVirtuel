#!/usr/bin/env python3
"""phone.py — piloter un téléphone Android via ADB.

Pensé pour être utilisé par Claude Code (ou par toi) depuis un ordinateur
relié au téléphone en USB ou en Wi-Fi (ADB sans fil).

Exemples :
  python3 phone.py devices
  python3 phone.py screenshot ecran.png
  python3 phone.py ui                    # liste les éléments visibles (texte + coordonnées)
  python3 phone.py tap 540 1200
  python3 phone.py tap-text "Paramètres"
  python3 phone.py swipe up
  python3 phone.py type "Bonjour"
  python3 phone.py key home | back | enter | recent | power | volup | voldown
  python3 phone.py open com.whatsapp
  python3 phone.py url https://example.com
  python3 phone.py apps [filtre]
  python3 phone.py info
"""
import os
import re
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET

ADB = os.environ.get("ADB", shutil.which("adb") or "adb")
SERIAL = os.environ.get("ANDROID_SERIAL")  # utile si plusieurs appareils

KEYS = {
    "home": 3, "back": 4, "call": 5, "endcall": 6, "volup": 24, "voldown": 25,
    "power": 26, "camera": 27, "enter": 66, "delete": 67, "menu": 82,
    "search": 84, "play": 85, "next": 87, "prev": 88, "mute": 164,
    "recent": 187, "wakeup": 224, "sleep": 223,
}


def adb(*args, binary=False, check=True):
    cmd = [ADB] + (["-s", SERIAL] if SERIAL else []) + list(args)
    try:
        res = subprocess.run(cmd, capture_output=True, check=False)
    except FileNotFoundError:
        sys.exit("adb introuvable. Installe Android Platform Tools (voir README.md).")
    if check and res.returncode != 0:
        sys.exit(f"Erreur adb ({' '.join(args)}): {res.stderr.decode(errors='replace').strip()}")
    return res.stdout if binary else res.stdout.decode(errors="replace")


def shell(*args, **kw):
    return adb("shell", *args, **kw)


def screen_size():
    out = shell("wm", "size")
    m = re.findall(r"(\d+)x(\d+)", out)
    if not m:
        sys.exit("Impossible de lire la taille de l'écran.")
    w, h = m[-1]  # "Override size" en dernier s'il existe
    return int(w), int(h)


def cmd_devices():
    print(adb("devices", "-l").strip())


def cmd_info():
    props = {
        "Modèle": "ro.product.model",
        "Marque": "ro.product.brand",
        "Android": "ro.build.version.release",
        "SDK": "ro.build.version.sdk",
    }
    for label, p in props.items():
        print(f"{label}: {shell('getprop', p).strip()}")
    w, h = screen_size()
    print(f"Écran: {w}x{h}")
    batt = shell("dumpsys", "battery")
    lvl = re.search(r"level: (\d+)", batt)
    if lvl:
        print(f"Batterie: {lvl.group(1)}%")


def cmd_screenshot(path="screen.png"):
    data = adb("exec-out", "screencap", "-p", binary=True)
    if not data.startswith(b"\x89PNG"):
        sys.exit("La capture d'écran a échoué (écran verrouillé/protégé ?).")
    with open(path, "wb") as f:
        f.write(data)
    print(f"Capture enregistrée : {os.path.abspath(path)}")


def ui_nodes():
    shell("uiautomator", "dump", "/sdcard/window_dump.xml")
    xml = shell("cat", "/sdcard/window_dump.xml")
    start = xml.find("<?xml")
    if start < 0:
        sys.exit("Impossible de lire l'interface (uiautomator).")
    root = ET.fromstring(xml[start:].strip())
    nodes = []
    for n in root.iter("node"):
        b = re.findall(r"\d+", n.get("bounds", ""))
        if len(b) != 4:
            continue
        x1, y1, x2, y2 = map(int, b)
        label = n.get("text") or n.get("content-desc") or ""
        nodes.append({
            "label": label,
            "id": n.get("resource-id", ""),
            "clickable": n.get("clickable") == "true",
            "x": (x1 + x2) // 2,
            "y": (y1 + y2) // 2,
        })
    return nodes


def cmd_ui():
    for n in ui_nodes():
        if n["label"] or n["clickable"]:
            flag = "*" if n["clickable"] else " "
            rid = n["id"].split("/")[-1]
            print(f"{flag} ({n['x']:>4},{n['y']:>4})  {n['label']!r}  {rid}")
    print("\n* = cliquable. Utilise : phone.py tap X Y  ou  phone.py tap-text \"texte\"")


def cmd_tap(x, y):
    shell("input", "tap", str(int(x)), str(int(y)))
    print(f"Tap en ({x},{y})")


def cmd_tap_text(text):
    t = text.lower()
    nodes = ui_nodes()
    exact = [n for n in nodes if n["label"].lower() == t]
    partial = [n for n in nodes if t in n["label"].lower()]
    match = (exact or partial or [None])[0]
    if not match:
        sys.exit(f"Aucun élément contenant « {text} » à l'écran.")
    cmd_tap(match["x"], match["y"])


def cmd_swipe(direction_or_x1, y1=None, x2=None, y2=None, ms="300"):
    if y1 is None:
        w, h = screen_size()
        cx, cy = w // 2, h // 2
        d = direction_or_x1
        moves = {
            "up": (cx, int(h * .75), cx, int(h * .25)),     # faire défiler vers le bas
            "down": (cx, int(h * .25), cx, int(h * .75)),
            "left": (int(w * .85), cy, int(w * .15), cy),
            "right": (int(w * .15), cy, int(w * .85), cy),
            "notifications": (cx, 5, cx, int(h * .6)),
        }
        if d not in moves:
            sys.exit("Direction : up | down | left | right | notifications")
        coords = moves[d]
    else:
        coords = (direction_or_x1, y1, x2, y2)
    shell("input", "swipe", *map(str, coords), str(ms))
    print(f"Swipe {coords}")


def cmd_type(text):
    # adb "input text" : espaces -> %s, caractères spéciaux échappés
    esc = text.replace("%", r"\%").replace(" ", "%s")
    esc = re.sub(r"([\\'\"&|<>;()$`!*?#~\[\]{}])", r"\\\1", esc)
    if any(ord(c) > 127 for c in text):
        print("Attention : les accents/emojis ne passent pas avec 'input text' "
              "sur tous les téléphones (installer ADBKeyBoard si besoin).")
    shell("input", "text", esc)
    print(f"Texte saisi : {text}")


def cmd_key(name):
    code = KEYS.get(name.lower(), name)
    shell("input", "keyevent", str(code))
    print(f"Touche {name}")


def cmd_open(package):
    shell("monkey", "-p", package, "-c", "android.intent.category.LAUNCHER", "1")
    print(f"Application ouverte : {package}")


def cmd_url(url):
    shell("am", "start", "-a", "android.intent.action.VIEW", "-d", url)
    print(f"Ouvert : {url}")


def cmd_apps(filt=""):
    pkgs = sorted(l.replace("package:", "").strip()
                  for l in shell("pm", "list", "packages", "-3").splitlines() if l.strip())
    for p in pkgs:
        if filt.lower() in p.lower():
            print(p)


COMMANDS = {
    "devices": cmd_devices, "info": cmd_info, "screenshot": cmd_screenshot,
    "ui": cmd_ui, "tap": cmd_tap, "tap-text": cmd_tap_text, "swipe": cmd_swipe,
    "type": cmd_type, "key": cmd_key, "open": cmd_open, "url": cmd_url,
    "apps": cmd_apps,
}


def main(argv):
    if not argv or argv[0] in ("-h", "--help", "help") or argv[0] not in COMMANDS:
        print(__doc__)
        return 0 if argv and argv[0] in ("-h", "--help", "help") else 1
    try:
        COMMANDS[argv[0]](*argv[1:])
    except TypeError:
        sys.exit(f"Mauvais arguments pour « {argv[0]} ». Voir : phone.py --help")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
