#!/usr/bin/env python3
"""relay.py — le standard téléphonique de SamouraiLink, sur le VPS.

  ESP32 (chez toi) ──WSS:8765 (TLS + jeton)──► relay ◄──127.0.0.1:8766── link.py (Claude)
  iPhone Safari ──HTTP:8767 /calib/<clé>──► page de calibration (coordonnées des clics)
  nginx-rtmp ──127.0.0.1:8767 /rtmp-auth──► vérifie la clé du flux vidéo de l'iPhone

Configuration par variables d'environnement (voir install.sh) :
  ESP_TOKEN, STREAM_KEY, CALIB_KEY, TLS_CERT, TLS_KEY,
  WSS_PORT (8765), CTRL_PORT (8766), HTTP_PORT (8767)
"""
import asyncio
import hmac
import json
import logging
import os
import ssl
import time
import urllib.parse

from websockets.asyncio.server import serve

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger("relay")

ESP_TOKEN = os.environ["ESP_TOKEN"]
STREAM_KEY = os.environ["STREAM_KEY"]
CALIB_KEY = os.environ["CALIB_KEY"]
WSS_PORT = int(os.environ.get("WSS_PORT", 8765))
CTRL_PORT = int(os.environ.get("CTRL_PORT", 8766))
HTTP_PORT = int(os.environ.get("HTTP_PORT", 8767))
CMD_TIMEOUT = 30

esp = None                 # connexion WebSocket de l'ESP32
esp_lock = asyncio.Lock()  # une commande à la fois
last_event = {}            # dernier clic reçu par la page de calibration

CALIB_PAGE = """<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>SamouraiLink</title><style>
html,body{margin:0;height:100%;background:#111;color:#eee;font:18px -apple-system,sans-serif;
touch-action:none;-webkit-user-select:none;user-select:none;overflow:hidden}
#m{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px}
</style></head><body><div id="m">⚔️ SamouraiLink<br>Page de calibration.<br>Laisse-la ouverte,
Claude s'occupe du reste.</div><script>
let n=0;
function send(e){
  const b={x:e.clientX,y:e.clientY,sx:e.screenX,sy:e.screenY,iw:innerWidth,ih:innerHeight,
           sw:screen.width,sh:screen.height,dpr:devicePixelRatio,t:Date.now(),type:e.pointerType||e.type};
  document.getElementById('m').textContent='Clic '+(++n)+' : ('+Math.round(b.x)+', '+Math.round(b.y)+')';
  fetch(location.pathname+'/event',{method:'POST',body:JSON.stringify(b)});
  e.preventDefault();
}
addEventListener('pointerdown',send,{passive:false});
</script></body></html>"""


def same(a, b):
    return hmac.compare_digest(str(a), str(b))


# ---------- WSS : connexion de l'ESP32 ----------
def check_esp(connection, request):
    if request.path != "/esp" or not same(request.headers.get("Authorization", ""),
                                          f"Bearer {ESP_TOKEN}"):
        log.warning("ESP32 refusé (jeton ou chemin invalide)")
        return connection.respond(403, "interdit\n")
    return None


async def esp_handler(ws):
    global esp
    if esp is not None:
        await esp.close()
    esp = ws
    log.info("ESP32 connecté depuis %s", ws.remote_address)
    try:
        await ws.wait_closed()
    finally:
        if esp is ws:
            esp = None
        log.info("ESP32 déconnecté")


async def to_esp(cmd):
    if esp is None:
        return "ERR esp32 offline (pas connecté au relais)"
    async with esp_lock:
        try:
            await esp.send(cmd)
            return str(await asyncio.wait_for(esp.recv(), CMD_TIMEOUT))
        except Exception as e:  # coupure, délai dépassé…
            return f"ERR {type(e).__name__}"


# ---------- 127.0.0.1:8766 : commandes de link.py ----------
async def ctrl_handler(reader, writer):
    try:
        while line := await reader.readline():
            cmd = line.decode(errors="replace").strip()
            if not cmd:
                continue
            if cmd == "LAST":                     # dernier clic de calibration
                resp = json.dumps(last_event)
            elif cmd == "PING":
                resp = "OK relay, esp32 " + ("online" if esp else "offline")
            else:
                resp = await to_esp(cmd)
            writer.write((resp + "\n").encode())
            await writer.drain()
    finally:
        writer.close()


# ---------- HTTP:8767 : page de calibration + auth du flux vidéo ----------
async def http_handler(reader, writer):
    global last_event
    status, body, ctype = 404, b"introuvable\n", "text/plain"
    try:
        head = await asyncio.wait_for(reader.readuntil(b"\r\n\r\n"), 10)
        lines = head.decode(errors="replace").split("\r\n")
        method, target, _ = lines[0].split(" ", 2)
        hdrs = {k.lower(): v.strip() for k, v in
                (l.split(":", 1) for l in lines[1:] if ":" in l)}
        length = min(int(hdrs.get("content-length", 0)), 65536)
        data = await reader.readexactly(length) if length else b""
        path = urllib.parse.urlsplit(target).path
        local = writer.get_extra_info("peername")[0] in ("127.0.0.1", "::1")
        page = f"/calib/{CALIB_KEY}"

        if method == "GET" and same(path, page):
            status, body, ctype = 200, CALIB_PAGE.encode(), "text/html; charset=utf-8"
        elif method == "POST" and same(path, page + "/event"):
            ev = json.loads(data or b"{}")
            last_event = {k: ev[k] for k in ev if k in
                          ("x", "y", "sx", "sy", "iw", "ih", "sw", "sh", "dpr", "type")}
            last_event["received"] = time.time()
            status, body = 200, b"ok\n"
        elif method == "POST" and path == "/rtmp-auth" and local:
            name = urllib.parse.parse_qs(data.decode()).get("name", [""])[0]
            ok = same(name, STREAM_KEY)
            log.info("Flux vidéo %s", "accepté" if ok else "REFUSÉ (mauvaise clé)")
            status, body = (200, b"ok\n") if ok else (403, b"interdit\n")
    except Exception as e:
        status, body = 400, f"requete invalide ({type(e).__name__})\n".encode()
    reason = {200: "OK", 400: "Bad Request", 403: "Forbidden", 404: "Not Found"}[status]
    writer.write(f"HTTP/1.1 {status} {reason}\r\nContent-Type: {ctype}\r\n"
                 f"Content-Length: {len(body)}\r\nConnection: close\r\n\r\n".encode() + body)
    await writer.drain()
    writer.close()


async def main():
    tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    tls.load_cert_chain(os.environ["TLS_CERT"], os.environ["TLS_KEY"])
    async with serve(esp_handler, "0.0.0.0", WSS_PORT, ssl=tls,
                     process_request=check_esp, ping_interval=20, ping_timeout=20):
        ctrl = await asyncio.start_server(ctrl_handler, "127.0.0.1", CTRL_PORT)
        http = await asyncio.start_server(http_handler, "0.0.0.0", HTTP_PORT)
        log.info("Relais prêt : WSS %d, contrôle 127.0.0.1:%d, HTTP %d",
                 WSS_PORT, CTRL_PORT, HTTP_PORT)
        async with ctrl, http:
            await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
