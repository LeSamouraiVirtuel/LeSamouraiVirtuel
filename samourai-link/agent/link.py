#!/usr/bin/env python3
"""link.py — SamouraiLink : Claude pilote un iPhone sans Mac ni jailbreak.

Deux modes, choisis automatiquement :
  • VPS   : le relais (relay.py) tourne sur cette machine (127.0.0.1:8766).
            Mains = ESP32 en Wi-Fi ; yeux = flux vidéo de l'iPhone (latest.jpg).
  • Local : ESP32 branché en USB ; yeux = écran local (UxPlay/AirPlay).

Commandes :
  status                       relais, ESP32 et iPhone connectés ? image récente ?
  screenshot [fichier]         capture de l'écran de l'iPhone
  calibrate                    calibration automatique (page /calib ouverte dans Safari)
  set-calibration X0 Y0 X1 Y1  calibration manuelle (mode local, voir README)
  tap X Y                      toucher le point (X,Y) de la capture
  move X Y | nudge DX DY | click
  longpress X Y [secondes]
  swipe X1 Y1 X2 Y2            glisser
  scroll N                     molette (N>0 = vers le haut)
  type "texte" | key NOM | hotkey MODS NOM
  home                         écran d'accueil (clic droit configuré dans AssistiveTouch)
  raw "CMD"                    envoie une commande brute à l'ESP32 (débogage)

Variables : LINK_RELAY (127.0.0.1:8766), LINK_FRAME (/var/lib/samourai/latest.jpg),
            LINK_PORT (port USB), LINK_DRY_RUN=1 (test sans rien).
"""
import glob
import json
import os
import shutil
import socket
import struct
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
CONF = os.environ.get("LINK_CALIB", os.path.join(HERE, "calibration.json"))
RELAY = os.environ.get("LINK_RELAY", "127.0.0.1:8766")
FRAME = os.environ.get("LINK_FRAME", "/var/lib/samourai/latest.jpg")
DRY = os.environ.get("LINK_DRY_RUN")
FRAME_MAX_AGE = 5      # secondes : au-delà, le flux vidéo est considéré coupé


# ---------- Mains ----------
class Hands:
    def __init__(self):
        self.mode, self.sock, self.ser = "dry", None, None
        if DRY:
            return
        host, port = RELAY.rsplit(":", 1)
        try:
            self.sock = socket.create_connection((host, int(port)), timeout=3)
            self.sock.settimeout(40)
            self.rfile = self.sock.makefile("r", encoding="utf-8", errors="replace")
            self.mode = "vps"
            return
        except OSError:
            pass
        try:
            import serial
        except ImportError:
            sys.exit("Ni relais VPS joignable, ni pyserial installé (pip install pyserial).")
        port = os.environ.get("LINK_PORT") or next(iter(
            glob.glob("/dev/ttyUSB*") + glob.glob("/dev/ttyACM*") +
            glob.glob("/dev/cu.usbserial*")), None)
        if not port:
            sys.exit("Ni relais VPS (relay.py) ni ESP32 en USB trouvés.")
        self.ser = serial.Serial(port, 115200, timeout=40)
        time.sleep(0.1)
        self.ser.reset_input_buffer()
        self.mode = "usb"

    def ask(self, cmd):
        """Envoie une commande et renvoie la réponse brute (sans vérifier)."""
        if self.mode == "dry":
            print("[esp32]", cmd)
            return {"?": "OK connected", "PING": "OK relay, esp32 online"}.get(cmd, "OK")
        line = (cmd + "\n").encode("utf-8", "replace")
        if self.mode == "vps":
            self.sock.sendall(line)
            return self.rfile.readline().strip()
        self.ser.write(line)
        return self.ser.readline().decode(errors="replace").strip()

    def send(self, cmd):
        resp = self.ask(cmd)
        if not resp.startswith("OK"):
            sys.exit(f"Échec de « {cmd} » : {resp or 'pas de réponse'}")
        return resp


# ---------- Yeux ----------
def jpeg_size(path):
    with open(path, "rb") as f:
        data = f.read()
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack(">HH", data[i + 5:i + 9])
            return w, h
        i += 2 + struct.unpack(">H", data[i + 2:i + 4])[0]
    return None


def frame_info():
    """(largeur, hauteur, âge en s) de la dernière image du flux, ou None."""
    if not os.path.exists(FRAME):
        return None
    size = jpeg_size(FRAME) or (0, 0)
    return size[0], size[1], time.time() - os.path.getmtime(FRAME)


def screenshot(h, path):
    if h.mode in ("vps", "dry") and (os.path.exists(FRAME) or h.mode == "vps"):
        info = frame_info()
        if not info:
            sys.exit("Aucune image : lance la diffusion d'écran sur l'iPhone (README, étape iPhone).")
        w, hh, age = info
        if age > FRAME_MAX_AGE:
            sys.exit(f"Dernière image vieille de {age:.0f} s : la diffusion d'écran de l'iPhone "
                     "est coupée (iPhone verrouillé ?). Demande à l'utilisateur de la relancer.")
        shutil.copyfile(FRAME, path)
        print(f"Capture : {os.path.abspath(path)}  ({w}x{hh}, il y a {age:.1f} s)")
        return
    if h.mode == "dry":
        print(f"[écran] capture -> {path}")
        return
    try:
        import mss
        import mss.tools
    except ImportError:
        sys.exit("pip install mss")
    with mss.mss() as s:
        img = s.grab(s.monitors[1])
        mss.tools.to_png(img.rgb, img.size, output=path)
    print(f"Capture : {os.path.abspath(path)}  ({img.size[0]}x{img.size[1]})")


# ---------- Calibration : pixels de la capture <-> unités souris ----------
def load_cal():
    try:
        with open(CONF) as f:
            return json.load(f)
    except FileNotFoundError:
        if DRY:
            return {"x0": 0, "y0": 0, "sx": 1.25, "sy": 1.25}
        sys.exit("Pas encore calibré : lance « python3 link.py calibrate ».")


def save_cal(cal):
    with open(CONF, "w") as f:
        json.dump(cal, f, indent=2)
    print(f"Calibration enregistrée : {json.dumps(cal)}")


def to_units(x, y, cal):
    return (float(x) - cal["x0"]) * cal["sx"], (float(y) - cal["y0"]) * cal["sy"]


def wait_click_event(h, after, timeout=4.0):
    end = time.time() + timeout
    while time.time() < end:
        ev = json.loads(h.ask("LAST") or "{}")
        if ev.get("received", 0) > after:
            return ev
        time.sleep(0.2)
    return None


def cmd_calibrate(h):
    if h.mode == "usb":
        h.send("Z")
        screenshot(h, "calib0.png")
        h.send("G 200 200")
        time.sleep(0.4)
        screenshot(h, "calib1.png")
        print("Repère le centre du pointeur dans calib0.png (X0,Y0) et calib1.png (X1,Y1),\n"
              "puis : python3 link.py set-calibration X0 Y0 X1 Y1")
        return
    U1, U2 = 150, 150
    print("Calibration automatique : la page /calib doit être ouverte dans Safari sur l'iPhone.")
    h.send("Z")
    h.send(f"G {U1} {U1}")
    t0 = time.time()
    h.send("C L")
    e1 = wait_click_event(h, t0)
    h.send(f"G {U2} {U2}")
    t1 = time.time()
    h.send("C L")
    e2 = wait_click_event(h, t1)
    if not e1 or not e2:
        sys.exit("La page de calibration n'a reçu aucun clic. Est-elle ouverte au premier plan "
                 "dans Safari ? (adresse affichée par install.sh)")
    dx, dy = e2["x"] - e1["x"], e2["y"] - e1["y"]
    if abs(dx) < 5 or abs(dy) < 5:
        sys.exit(f"Le pointeur a trop peu bougé ({dx:.0f},{dy:.0f}). Vérifie AssistiveTouch.")
    info = frame_info()
    if info and info[0]:
        ratio = info[0] / e1["sw"]         # pixels de capture par point iOS
    else:
        ratio = e1.get("dpr", 3)
        print(f"(pas d'image du flux : je suppose {ratio} pixels par point)")
    sx, sy = U2 / (dx * ratio), U2 / (dy * ratio)
    x0 = e1["x"] * ratio - U1 / sx         # position du coin, ≈ 0 attendu
    save_cal({"x0": round(x0, 1), "y0": 0, "sx": round(sx, 4), "sy": round(sy, 4),
              "ratio": round(ratio, 4)})
    print("Vérifie avec : link.py move X Y, puis une capture. Le pointeur doit être sur (X,Y).")


def cmd_set_calibration(h, x0, y0, x1, y1):
    x0, y0, x1, y1 = map(float, (x0, y0, x1, y1))
    if abs(x1 - x0) < 5 or abs(y1 - y0) < 5:
        sys.exit("Le pointeur n'a presque pas bougé : vérifie l'appairage et recommence.")
    save_cal({"x0": x0, "y0": y0, "sx": 200 / (x1 - x0), "sy": 200 / (y1 - y0)})


# ---------- Commandes ----------
def cmd_status(h):
    print(f"Mode : {h.mode}")
    if h.mode in ("vps", "dry"):
        print("Relais :", h.ask("PING"))
    print("iPhone (Bluetooth) :", h.ask("?"))
    info = frame_info()
    print("Flux vidéo :", f"{info[0]}x{info[1]}, dernière image il y a {info[2]:.1f} s"
          if info else "aucune image")
    print("Calibration :", "faite" if os.path.exists(CONF) else "à faire (calibrate)")


def cmd_screenshot(h, path="ecran.jpg"):
    screenshot(h, path)


def cmd_move(h, x, y):
    ux, uy = to_units(x, y, load_cal())
    h.send("Z")
    h.send(f"G {round(ux)} {round(uy)}")
    print(f"Pointeur en ({x},{y})")


def cmd_tap(h, x, y):
    cmd_move(h, x, y)
    h.send("C L")
    print(f"Tap en ({x},{y})")


def cmd_longpress(h, x, y, seconds="1"):
    cmd_move(h, x, y)
    h.send("P L")
    time.sleep(float(seconds))
    h.send("U L")
    print(f"Appui long en ({x},{y})")


def cmd_nudge(h, dx, dy):
    h.send(f"G {int(dx)} {int(dy)}")


def cmd_click(h):
    h.send("C L")


def cmd_swipe(h, x1, y1, x2, y2):
    cal = load_cal()
    cmd_move(h, x1, y1)
    a, b = to_units(x1, y1, cal), to_units(x2, y2, cal)
    h.send("P L")
    h.send(f"G {round(b[0] - a[0])} {round(b[1] - a[1])}")
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
    print("Accueil (clic droit = « Écran d'accueil » dans AssistiveTouch)")


def cmd_raw(h, cmd):
    print(h.ask(cmd))


COMMANDS = {"status": cmd_status, "screenshot": cmd_screenshot,
            "calibrate": cmd_calibrate, "set-calibration": cmd_set_calibration,
            "move": cmd_move, "tap": cmd_tap, "longpress": cmd_longpress,
            "nudge": cmd_nudge, "click": cmd_click, "swipe": cmd_swipe,
            "scroll": cmd_scroll, "type": cmd_type, "key": cmd_key,
            "hotkey": cmd_hotkey, "home": cmd_home, "raw": cmd_raw}


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
