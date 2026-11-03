#!/usr/bin/env python3
"""simulator.py — un faux ESP32 + un faux iPhone, pour tester le VPS sans matériel.

Il se connecte au relais exactement comme le vrai ESP32 (WSS + jeton + certificat
vérifié), simule le pointeur AssistiveTouch d'un iPhone (390x844 points) et, à
chaque clic, prévient la page de calibration comme le ferait Safari.

  python3 simulator.py wss://IP:8765/esp JETON cert.pem http://127.0.0.1:8767/calib/CLE
"""
import asyncio
import json
import ssl
import sys
import urllib.request

from websockets.asyncio.client import connect

W, H = 390, 844          # écran iPhone en points
UNITS_PER_PT = 1.6       # « vitesse de suivi » simulée
SAFARI_TOP = 50          # hauteur de la barre d'état au-dessus de la page

pos = [W / 2, H / 2]


def move(dx, dy):
    pos[0] = min(max(pos[0] + dx / UNITS_PER_PT, 0), W - 1)
    pos[1] = min(max(pos[1] + dy / UNITS_PER_PT, 0), H - 1)


def click_event(calib_url):
    ev = {"x": pos[0], "y": pos[1] - SAFARI_TOP, "sx": pos[0], "sy": pos[1] - SAFARI_TOP,
          "iw": W, "ih": H - SAFARI_TOP, "sw": W, "sh": H, "dpr": 3, "type": "touch"}
    urllib.request.urlopen(urllib.request.Request(calib_url + "/event",
                                                  data=json.dumps(ev).encode()), timeout=3)


def handle(cmd, calib_url):
    op, arg = cmd[0], cmd[2:].split()
    if op == "?":
        return "OK connected"
    if op in "MG":
        move(int(arg[0]), int(arg[1]))
    elif op == "Z":
        move(-127 * 30, -127 * 30)
    elif op == "C" and arg[0] == "L":
        click_event(calib_url)
    print(f"  {cmd:<22} pointeur = ({pos[0]:.0f}, {pos[1]:.0f}) pt", flush=True)
    return "OK"


async def main(url, token, ca, calib_url):
    tls = ssl.create_default_context(cafile=ca)
    async with connect(url, ssl=tls, additional_headers={"Authorization": f"Bearer {token}"}) as ws:
        print("Faux ESP32 connecté au relais", flush=True)
        async for msg in ws:
            await ws.send(handle(msg, calib_url))


if __name__ == "__main__":
    asyncio.run(main(*sys.argv[1:5]))
