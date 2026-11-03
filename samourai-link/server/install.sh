#!/usr/bin/env bash
# install.sh — installe la partie VPS de SamouraiLink (Debian 12 / Ubuntu 22.04+, en root).
#   sudo bash install.sh [IP_OU_DOMAINE_DU_VPS]
# Relançable sans risque : les secrets déjà créés sont conservés.
set -euo pipefail

[ "$(id -u)" = 0 ] || { echo "Lance-moi en root : sudo bash install.sh"; exit 1; }
SRC="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${1:-$(curl -fsS4 https://api.ipify.org || hostname -I | awk '{print $1}')}"
APP=/opt/samourai ; ETC=/etc/samourai ; VAR=/var/lib/samourai

echo "==> Paquets"
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get install -y -q nginx libnginx-mod-rtmp ffmpeg openssl python3-venv curl

echo "==> Fichiers"
id samourai >/dev/null 2>&1 || useradd --system --home "$VAR" --shell /usr/sbin/nologin samourai
mkdir -p "$APP" "$ETC" "$VAR"
cp "$SRC/server/relay.py" "$SRC/server/simulator.py" "$APP/"
cp -r "$SRC/agent" "$APP/"
python3 -m venv "$APP/venv"
"$APP/venv/bin/pip" install -q "websockets==15.0.1" pyserial
chown samourai:samourai "$VAR" && chmod 755 "$VAR"

echo "==> Secrets"
if [ ! -f "$ETC/env" ]; then
  cat > "$ETC/env" <<EOV
ESP_TOKEN=$(openssl rand -hex 24)
STREAM_KEY=$(openssl rand -hex 12)
CALIB_KEY=$(openssl rand -hex 8)
TLS_CERT=$ETC/cert.pem
TLS_KEY=$ETC/key.pem
EOV
fi
chmod 640 "$ETC/env" && chgrp samourai "$ETC/env"
set -a; . "$ETC/env"; set +a

if [ ! -f "$ETC/cert.pem" ] || ! openssl x509 -in "$ETC/cert.pem" -noout -text | grep -q "$HOST"; then
  if [[ "$HOST" =~ ^[0-9.]+$ ]]; then SAN="IP:$HOST"; else SAN="DNS:$HOST"; fi
  openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -days 3650 \
    -subj "/CN=$HOST" -addext "subjectAltName=$SAN" \
    -keyout "$ETC/key.pem" -out "$ETC/cert.pem" 2>/dev/null
fi
chgrp samourai "$ETC/key.pem" && chmod 640 "$ETC/key.pem"

echo "==> Réception vidéo (nginx-rtmp, clé obligatoire)"
cat > /etc/nginx/samourai-rtmp.conf <<EOR
rtmp {
  server {
    listen 1935;
    chunk_size 4096;
    application live {
      live on;
      record off;
      on_publish http://127.0.0.1:8767/rtmp-auth;
      allow play 127.0.0.1;
      deny play all;
    }
  }
}
EOR
grep -q samourai-rtmp.conf /etc/nginx/nginx.conf || echo "include /etc/nginx/samourai-rtmp.conf;" >> /etc/nginx/nginx.conf
nginx -t                       # s'arrête ici si la configuration nginx est invalide
systemctl enable --now nginx
systemctl reload nginx

echo "==> Services"
cat > /etc/systemd/system/samourai-relay.service <<EOS
[Unit]
Description=SamouraiLink relais (ESP32 <-> Claude)
After=network-online.target
[Service]
User=samourai
EnvironmentFile=$ETC/env
ExecStart=$APP/venv/bin/python $APP/relay.py
Restart=always
RestartSec=2
[Install]
WantedBy=multi-user.target
EOS
cat > /etc/systemd/system/samourai-frames.service <<EOS
[Unit]
Description=SamouraiLink yeux (flux iPhone -> $VAR/latest.jpg)
After=nginx.service
[Service]
User=samourai
EnvironmentFile=$ETC/env
ExecStart=/bin/sh -c 'exec ffmpeg -nostdin -loglevel error -rw_timeout 5000000 -i rtmp://127.0.0.1/live/\$STREAM_KEY -vf fps=3 -q:v 3 -update 1 -atomic_writing 1 -y $VAR/latest.jpg'
Restart=always
RestartSec=2
[Install]
WantedBy=multi-user.target
EOS
cat > /etc/profile.d/samourai.sh <<EOP
export LINK_FRAME=$VAR/latest.jpg
export LINK_CALIB=$VAR/calibration.json
alias link="$APP/venv/bin/python $APP/agent/link.py"
EOP
chmod 2775 "$VAR"   # groupe samourai : Claude peut y écrire la calibration
[ -n "${SUDO_USER:-}" ] && usermod -aG samourai "$SUDO_USER" || true
systemctl daemon-reload
systemctl enable --now samourai-relay samourai-frames
systemctl restart samourai-relay samourai-frames

if command -v ufw >/dev/null && ufw status | grep -q active; then
  ufw allow 8765/tcp; ufw allow 8767/tcp; ufw allow 1935/tcp
fi

INFO="$ETC/INFOS.txt"
cat > "$INFO" <<EOI
===================== SamouraiLink : à garder secret =====================

1) ESP32 : remplace le contenu de firmware/samourai_hid/config.h par :
---------------------------------------------------------------------------
#pragma once
#define WIFI_SSID   "NOM_DE_TON_WIFI"
#define WIFI_PASS   "MOT_DE_PASSE_WIFI"
#define RELAY_HOST  "$HOST"
#define RELAY_PORT  8765
#define RELAY_TOKEN "$ESP_TOKEN"
static const char RELAY_CA[] = R"($(cat "$ETC/cert.pem")
)";
---------------------------------------------------------------------------

2) iPhone, app de diffusion d'écran (ex. Larix Screencaster) :
   Serveur :  rtmp://$HOST:1935/live
   Clé     :  $STREAM_KEY
   (URL complète si l'app la demande en un seul champ :
    rtmp://$HOST:1935/live/$STREAM_KEY)

3) iPhone, page de calibration à ouvrir dans Safari :
   http://$HOST:8767/calib/$CALIB_KEY

4) Claude sur le VPS :  source /etc/profile.d/samourai.sh && link status
===========================================================================
EOI
chmod 600 "$INFO"
cat "$INFO"
echo "Ces infos sont aussi dans $INFO"
