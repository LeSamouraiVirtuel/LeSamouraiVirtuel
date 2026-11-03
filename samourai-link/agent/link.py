#!/usr/bin/env python3
"""link.py — SamouraiLink : Claude pilote un iPhone sans Mac ni jailbreak.

Yeux : l'écran de l'iPhone arrive en AirPlay (UxPlay) sur ce Raspberry Pi / PC.
Mains : un ESP32 joue la souris + le clavier Bluetooth de l'iPhone (AssistiveTouch).

Commandes :
  python3 link.py status                    l'ESP32 et l'iPhone sont-ils connectés ?
  python3 link.py screenshot [fichier.png]  capture de l'écran recopié
  python3 link.py calibrate                 étape 1 de la calibration (voir README)
  python3 link.py set-calibration X0 Y0 X1 Y1   termine la calibration
  python3 link.py tap X Y                   touche le point (X,Y) de la capture
  python3 link.py move X Y                  amène seulement le pointeur en (X,Y)
  python3 link.py nudge DX DY               petit ajustement du pointeur (unités souris)
  python3 link.py click                     clic à la position actuelle
  python3 link.py swipe X1 Y1 X2 Y2         glisser (faire défiler, déverrouiller un curseur…)
  python3 link.py scroll N                  molette (N>0 = vers le haut)
  python3 link.py type "texte"              taper du texte (ASCII)
  python3 link.py key ENTER|TAB|ESC|BACKSPACE|SPACE|UP|DOWN|LEFT|RIGHT
  python3 link.py hotkey GUI SPACE          raccourci clavier (ici : Cmd+Espace)
  python3 link.py home                      écran d'accueil (clic droit, voir README)

Variables : LINK_PORT (port série de l'ESP32, auto sinon), LINK_DRY_RUN=1 (test sans matériel).
"""
import glob
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
CONF = os.path.join(HERE, "calibration.json")
DRY = os.environ.get("LINK_DRY_RUN")
CAL_UNITS = 200          # unités souris parcourues pendant la calibration
STEP = 4                 # petits pas = pas d'accélération du pointeur iOS
STEP_DELAY = 0.008


# ---------- Mains : l'ESP32 ----------
class Hands:
    def __init__(self):
        self.ser = None
        if DRY:
            return
        try:
            import serial
        except ImportError:
            sys.exit("pip install pyserial mss pillow")
        port = os.environ.get("LINK_PORT") or next(iter(
            glob.glob("/dev/ttyUSB*") + glob.glob("/dev/ttyACM*") +
            glob.glob("/dev/cu.usbserial*")), None)
        if not port:
            sys.exit("ESP32 introuvable : branche-le en USB ou définis LINK_PORT (ex. COM3).")
        self.ser = serial.Serial(port, 115200, timeout=2)
        time.sleep(0.1)
        self.ser.reset_input_buffer()

    def send(self, cmd):
        if DRY:
            print("[esp32]", cmd)
            return "OK connected" if cmd == "?" else "OK"
        self.ser.write((cmd + "\n").encode("ascii", "replace"))
        resp = self.ser.readline().decode(errors="replace").strip()
        if resp.startswith("ERR"):
            sys.exit(f"ESP32 : {resp} (commande « {cmd} »). L'iPhone est-il appairé ?")
        return resp

    def move_by(self, dx, dy):
        """Déplacement relatif en petits pas réguliers (évite l'accélération iOS)."""
        dx, dy = int(round(dx)), int(round(dy))
        n = max(abs(dx), abs(dy)) // STEP + 1
        done_x = done_y = 0
        for i in range(1, n + 1):
            tx, ty = round(dx * i / n), round(dy * i / n)
            if tx != done_x or ty != done_y:
                self.send(f"M {tx - done_x} {ty - done_y}")
                done_x, done_y = tx, ty
                if not DRY:
                    time.sleep(STEP_DELAY)

    def home_corner(self):
        """Bloque le pointeur dans le coin haut-gauche : point de départ connu."""
        for _ in range(30):
            self.send("M -127 -127")
        if not DRY:
            time.sleep(0.15)


# ---------- Yeux : l'écran recopié ----------
def screenshot(path):
    if DRY:
        print(f"[écran] capture -> {path}")
        return
    try:
        import mss
        import mss.tools
    except ImportError:
        sys.exit("pip install pyserial mss pillow")
    with mss.mss() as s:
        img = s.grab(s.monitors[1])
        mss.tools.to_png(img.rgb, img.size, output=path)
    print(f"Capture : {os.path.abspath(path)}  ({img.size[0]}x{img.size[1]})")


# ---------- Calibration : pixels de la capture <-> unités souris ----------
def load_cal():
    if DRY and not os.path.exists(CONF):
        return {"x0": 700, "y0": 40, "sx": 1.25, "sy": 1.25}
    try:
        with open(CONF) as f:
            return json.load(f)
    except FileNotFoundError:
        sys.exit("Pas encore calibré : lance « python3 link.py calibrate ».")


def to_units(x, y, cal):
    return (float(x) - cal["x0"]) * cal["sx"], (float(y) - cal["y0"]) * cal["sy"]


# ---------- Commandes ----------
def cmd_status(h):
    print(h.send("?"))


def cmd_screenshot(h, path="ecran.png"):
    screenshot(path)


def cmd_calibrate(h):
    h.home_corner()
    screenshot("calib0.png")
    h.move_by(CAL_UNITS, CAL_UNITS)
    if not DRY:
        time.sleep(0.4)
    screenshot("calib1.png")
    print("\nRepère le centre du pointeur (rond gris) dans calib0.png (X0,Y0)\n"
          "puis dans calib1.png (X1,Y1), et lance :\n"
          "  python3 link.py set-calibration X0 Y0 X1 Y1")


def cmd_set_calibration(h, x0, y0, x1, y1):
    x0, y0, x1, y1 = map(float, (x0, y0, x1, y1))
    if abs(x1 - x0) < 5 or abs(y1 - y0) < 5:
        sys.exit("Le pointeur n'a presque pas bougé : vérifie l'appairage et recommence.")
    cal = {"x0": x0, "y0": y0, "sx": CAL_UNITS / (x1 - x0), "sy": CAL_UNITS / (y1 - y0)}
    with open(CONF, "w") as f:
        json.dump(cal, f, indent=2)
    print(f"Calibration enregistrée : {cal}")


def cmd_move(h, x, y):
    cal = load_cal()
    ux, uy = to_units(x, y, cal)
    h.home_corner()
    h.move_by(ux, uy)
    print(f"Pointeur en ({x},{y})")


def cmd_tap(h, x, y):
    cmd_move(h, x, y)
    if not DRY:
        time.sleep(0.15)
    h.send("C L")
    print(f"Tap en ({x},{y})")


def cmd_nudge(h, dx, dy):
    h.move_by(int(dx), int(dy))


def cmd_click(h):
    h.send("C L")


def cmd_swipe(h, x1, y1, x2, y2):
    cal = load_cal()
    cmd_move(h, x1, y1)
    a, b = to_units(x1, y1, cal), to_units(x2, y2, cal)
    h.send("P L")
    h.move_by(b[0] - a[0], b[1] - a[1])
    h.send("U L")
    print(f"Glisser ({x1},{y1}) -> ({x2},{y2})")


def cmd_scroll(h, n):
    n = int(n)
    for _ in range(abs(n)):
        h.send(f"W {1 if n > 0 else -1}")


def cmd_type(h, text):
    if any(ord(c) > 127 for c in text):
        print("Attention : accents et emojis ne passent pas (clavier US). Je les retire.")
        text = text.encode("ascii", "ignore").decode()
    for i in range(0, len(text), 40):
        h.send("T " + text[i:i + 40])
    print(f"Texte saisi : {text}")


def cmd_key(h, name):
    h.send(f"K {name.upper()}")


def cmd_hotkey(h, mods, key):
    h.send(f"H {mods.upper()} {key.upper()}")


def cmd_home(h):
    h.send("C R")
    print("Accueil (clic droit configuré sur « Écran d'accueil »)")


COMMANDS = {"status": cmd_status, "screenshot": cmd_screenshot,
            "calibrate": cmd_calibrate, "set-calibration": cmd_set_calibration,
            "move": cmd_move, "tap": cmd_tap, "nudge": cmd_nudge, "click": cmd_click,
            "swipe": cmd_swipe, "scroll": cmd_scroll, "type": cmd_type,
            "key": cmd_key, "hotkey": cmd_hotkey, "home": cmd_home}


def main(argv):
    if not argv or argv[0] not in COMMANDS:
        print(__doc__)
        return 0 if argv and argv[0] in ("-h", "--help", "help") else 1
    h = Hands()
    try:
        COMMANDS[argv[0]](h, *argv[1:])
    except TypeError:
        sys.exit(f"Mauvais arguments pour « {argv[0]} ». Voir : link.py --help")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
