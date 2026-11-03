# ⚔️ SamouraiLink : Claude pilote un iPhone, sans Mac ni jailbreak

On ne pirate pas l'iPhone. On lui donne ce qu'il accepte déjà de n'importe quel humain :
**des yeux qui regardent l'écran** et **des mains qui touchent**. Le cerveau tourne sur ton VPS.

```
   CHEZ TOI                                            TON VPS (n'importe où)
 ┌──────────────────────────────┐                ┌─────────────────────────────────────┐
 │ 📱 iPhone                    │  écran (RTMP)  │ nginx-rtmp ─► ffmpeg ─► latest.jpg  │
 │   app de diffusion d'écran ──┼───────────────►│     (clé secrète)        ▲ yeux     │
 │   AssistiveTouch (pointeur)  │                │                          │          │
 │        ▲ Bluetooth           │                │ Claude Code ─► link.py ──┘          │
 │ 🔌 ESP32 (souris + clavier) ─┼── Wi-Fi ──────►│        ▼                            │
 │   branché sur un chargeur    │   WSS (TLS +   │     relay.py ◄── page /calib        │
 └──────────────────────────────┘   jeton)       └─────────────────────────────────────┘
```

- **Yeux** : une app de diffusion d'écran envoie l'écran de l'iPhone au VPS. Le VPS garde la dernière image, 3 fois par seconde.
- **Mains** : un ESP32 à environ 8 € joue la souris et le clavier Bluetooth de l'iPhone. Il reçoit les ordres du VPS par Wi-Fi, sur une connexion chiffrée. Il se connecte lui-même au VPS : aucun port à ouvrir chez toi.
- **Cerveau** : Claude Code sur le VPS. Tu lui parles depuis l'app Claude.

## ✅ Ce qui est déjà testé (sans matériel)
| Élément | Test |
|---|---|
| Firmware ESP32 | **compile** en mode USB (44 %) et en mode Wi-Fi + TLS (53 %), y compris avec le `config.h` généré par `install.sh` |
| Relais | un faux ESP32 (`server/simulator.py`) se connecte en TLS ; un **mauvais jeton** et un **faux certificat** sont **refusés** |
| Flux vidéo | une vidéo test arrive dans `latest.jpg` ; un flux avec une **mauvaise clé** est **refusé** |
| Calibration automatique | retrouve exactement l'échelle simulée ; les taps tombent au point près |
| `install.sh` | tourne de bout en bout (sauf systemd, simulé dans le test) et garde les secrets quand on le relance |
| Pannes | flux coupé, ESP32 hors ligne, relais arrêté : un message clair à chaque fois |

**Pas encore testé :** le vrai Bluetooth avec un vrai iPhone, et une vraie app de diffusion d'écran.

## 🛒 Matériel
| Pièce | Prix |
|---|---|
| ESP32 DevKit V1 (**ESP32-WROOM-32**, pas S2/S3/C3) | 5–10 € |
| Câble USB **data** (pour flasher le programme une fois) + un chargeur USB | 3 € |
| Ton VPS : Debian 12 ou Ubuntu 22.04+, 1 Go de RAM suffit | déjà là |

## 🔧 Installation, une seule fois

### 1. VPS (≈ 5 min)
```bash
git clone -b claude/phone-control-8qps2h https://github.com/LeSamouraiVirtuel/LeSamouraiVirtuel
sudo bash LeSamouraiVirtuel/samourai-link/server/install.sh      # ou : install.sh mon-domaine.fr
```
Le script installe tout, crée les secrets et le certificat, lance les services, puis affiche
**les 3 infos à recopier**. Elles sont aussi gardées dans `/etc/samourai/INFOS.txt`.
Si ton hébergeur a un pare-feu dans son panneau, ouvre les ports **8765, 8767 et 1935** (TCP).

### 2. ESP32 (≈ 15 min, sur n'importe quel ordinateur, même emprunté)
1. Installe l'[Arduino IDE](https://www.arduino.cc/en/software). Dans le Gestionnaire de cartes,
   installe **esp32 by Espressif**, version **2.0.17**.
2. Dans le Gestionnaire de bibliothèques, installe **WebSockets** de Markus Sattler, version **2.6.1**.
3. Télécharge [ESP32-BLE-Combo](https://github.com/blackketter/ESP32-BLE-Combo) (Code → Download ZIP),
   puis Croquis → Inclure une bibliothèque → Ajouter la bibliothèque .ZIP.
4. Ouvre `firmware/samourai_hid/samourai_hid.ino`. Colle dans `config.h` le bloc affiché par
   `install.sh` et mets ton Wi-Fi (**2,4 GHz**).
5. Choisis la carte **ESP32 Dev Module** et le Partition Scheme **Huge APP (3MB No OTA)**, puis clique sur **Téléverser**.
6. Débranche l'ordinateur et branche l'ESP32 sur un chargeur, près de l'iPhone. C'est fini pour l'ordinateur.

### 3. iPhone (≈ 10 min)
1. Réglages → Bluetooth : appaire **ESP32 Keyboard/Mouse**.
2. Réglages → Accessibilité → Toucher → **AssistiveTouch** : active-le.
   - Dans Appareils → ESP32 Keyboard/Mouse → Personnaliser les boutons supplémentaires,
     mets le **clic droit** sur **Écran d'accueil**.
   - Règle la **Vitesse de suivi** et ne la change plus (sinon il faut recalibrer).
3. Réglages → Général → Clavier → Clavier physique : **Anglais (US)**.
4. Installe une app de diffusion d'écran en RTMP, par exemple **Larix Screencaster** (gratuite).
   Mets le serveur et la clé de l'étape 2 d'INFOS.txt, puis lance la diffusion depuis
   Centre de contrôle → appui long sur Enregistrement de l'écran → choisis l'app.
5. Ouvre dans Safari la **page de calibration** (étape 3 d'INFOS.txt) et laisse-la au premier plan.

### 4. Donner la main à Claude
Sur le VPS : installe Claude Code (`curl -fsSL https://claude.ai/install.sh | bash`), puis
lance `claude remote-control` dans `/opt/samourai/agent`. Ensuite, depuis l'app Claude :
*« Calibre-toi, puis ouvre Spotify. »*

## 🧪 Tester le VPS sans matériel
```bash
# un faux ESP32 + faux iPhone se branche sur ton relais (remplace IP_DU_VPS)
sudo bash -c 'set -a; . /etc/samourai/env; exec /opt/samourai/venv/bin/python /opt/samourai/simulator.py \
  wss://IP_DU_VPS:8765/esp "$ESP_TOKEN" /etc/samourai/cert.pem "http://127.0.0.1:8767/calib/$CALIB_KEY"' &
source /etc/profile.d/samourai.sh
link status && link calibrate && link tap 585 1266   # le simulateur affiche où tombe le tap
kill %1                                              # arrête le simulateur
```

## 🧠 Comment Claude vise juste
1. `Z` : le pointeur est plaqué dans le **coin haut-gauche**, une origine connue.
2. `G dx dy` : l'ESP32 avance lui-même par **petits pas réguliers**, ce qui évite l'accélération du pointeur iOS.
3. **Calibration automatique** : Claude clique deux fois sur la page `/calib`, et Safari renvoie les coordonnées
   exactes des clics. On en déduit l'échelle entre les unités de la souris et les pixels de la capture.
4. Claude **vérifie sur une capture** et corrige avec `nudge` si besoin.

## ⚠️ Limites (honnêtes)
- Si l'iPhone se **verrouille**, la diffusion d'écran s'arrête. Mets le verrouillage automatique sur « Jamais » pendant les sessions.
- Le **code**, Face ID et les paiements restent à toi.
- Les apps bancaires et de streaming peuvent masquer leur contenu (écran noir).
- Accents et emojis ne passent pas encore (clavier US).
- Délai : environ 1 à 2 s entre une action et la capture qui la montre.

## 🔒 Sécurité
- ESP32 ↔ VPS : TLS avec **certificat épinglé** et jeton de 48 caractères. Un faux serveur ou un faux ESP32 est refusé.
- Le flux vidéo exige la clé secrète, sinon il est refusé. Seul le VPS lui-même peut relire les images.
- **Coupure d'urgence** : débranche l'ESP32, ou oublie l'appareil Bluetooth sur l'iPhone.
- Ne partage jamais `/etc/samourai/INFOS.txt`.
