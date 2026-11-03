# ⚔️ SamouraiLink : Claude pilote un iPhone, sans Mac ni jailbreak

On ne pirate pas l'iPhone. On lui donne ce qu'il accepte déjà de n'importe quel humain :
**des yeux qui regardent l'écran** et **des mains qui touchent**.

```
              AirPlay (Recopie de l'écran)
   📱 iPhone ────────────────────────────────► 🖥️ Raspberry Pi (ou PC)
       ▲                                         │  UxPlay affiche l'écran
       │ Bluetooth : souris + clavier            │  Claude Code (Remote Control)
       │                                         │  link.py : regarde, décide, agit
   🔌 ESP32 ◄────────────── câble USB ───────────┘
```

1. **Yeux** : l'iPhone envoie son écran en AirPlay vers le Pi, qui fait tourner
   [UxPlay](https://github.com/FDH2/UxPlay), un récepteur AirPlay open source.
   `link.py screenshot` capture cet écran.
2. **Mains** : un ESP32 à environ 8 € se présente à l'iPhone comme une souris et un
   clavier Bluetooth. Avec **AssistiveTouch**, un pointeur apparaît sur l'iPhone :
   Claude le déplace, clique, glisse et tape du texte.
3. **Cerveau** : Claude Code tourne sur le Pi. Tu lui parles depuis l'app Claude, où que tu sois.

## 🛒 Matériel (≈ 90 €, ou ≈ 10 € si tu as déjà un PC)
| Pièce | Prix | Rôle |
|---|---|---|
| ESP32 DevKit V1 (ESP32-WROOM-32) | 5–10 € | les mains (souris + clavier Bluetooth) |
| Câble micro-USB ou USB-C **data** | 3 € | relie l'ESP32 au Pi |
| Raspberry Pi 5 4 Go + alimentation + carte SD 32 Go | ≈ 80 € | les yeux et le cerveau, allumé en permanence |

> Un PC Windows ou Linux peut remplacer le Pi : UxPlay et Python y fonctionnent aussi.
> Attention : ni ESP32-S2 ni ESP32-C3 « sans Bluetooth Classic ». Prends un **ESP32 classique**.

## 🔧 Installation, une seule fois (≈ 45 min)
Après ça, Claude se débrouille seul.

### A. Les mains (ESP32)
1. Installe l'[Arduino IDE](https://www.arduino.cc/en/software). Dans Gestionnaire de cartes,
   ajoute **esp32 by Espressif** en version **2.0.17**.
2. Télécharge [ESP32-BLE-Combo](https://github.com/blackketter/ESP32-BLE-Combo) en .zip, puis
   Croquis → Inclure une bibliothèque → Ajouter la bibliothèque .ZIP.
3. Ouvre `firmware/samourai_hid/samourai_hid.ino`, choisis la carte « ESP32 Dev Module »,
   puis clique sur **Téléverser**.
4. Sur l'iPhone, va dans Réglages → Bluetooth et appaire **SamouraiLink**.

### B. Réglages de l'iPhone
1. Réglages → Accessibilité → Toucher → **AssistiveTouch** : **activé**. Le pointeur apparaît.
2. Dans AssistiveTouch → Appareils → SamouraiLink → **Personnaliser les boutons
   supplémentaires**, mets le **clic droit** sur **Écran d'accueil**.
3. Dans AssistiveTouch, règle la **Vitesse de suivi** au milieu et ne la change plus.
4. Réglages → Général → Clavier → Clavier physique : disposition **Anglais (US)**.
5. Réglages → Écran et luminosité → Verrouillage auto : **Jamais** (ou 5 min au minimum).

### C. Les yeux et le cerveau (Raspberry Pi)
```bash
# Raspberry Pi OS (64 bits). Passe en session X11 : sudo raspi-config → Advanced → Wayland → X11
sudo apt update && sudo apt install -y uxplay python3-pip git
pip install --break-system-packages pyserial mss pillow
git clone https://github.com/LeSamouraiVirtuel/LeSamouraiVirtuel && cd LeSamouraiVirtuel/samourai-link/agent
uxplay -n SamouraiLink -fs &          # récepteur AirPlay en plein écran
```
1. Sur l'iPhone, ouvre Centre de contrôle → **Recopie de l'écran** → **SamouraiLink**.
2. Teste : `python3 link.py status` doit répondre `OK connected`.
3. Calibre une fois : `python3 link.py calibrate` (Claude le fait lui-même en lisant les captures).
4. Installe Claude Code sur le Pi, puis lance `claude remote-control` dans le dossier `agent`.

Ensuite, depuis l'app Claude sur ton iPhone :
*« Ouvre Spotify et mets ma playlist du matin »*. Claude regarde, bouge, clique.

## 🧠 Comment Claude vise juste
Le pointeur iOS ne se place pas à des coordonnées absolues. `link.py` contourne ça :
1. Il plaque le pointeur dans le **coin haut-gauche** : c'est un point de départ connu.
2. Il avance par **petits pas de 4 unités**, ce qui évite l'accélération du pointeur.
3. La **calibration** relie les pixels de la capture aux unités de la souris.
4. Claude **vérifie sur une capture** et corrige avec `nudge` si besoin. C'est une boucle fermée.

## ⚠️ Limites (honnêtes)
- La Recopie de l'écran AirPlay s'arrête si l'iPhone se verrouille. Il faut alors la relancer depuis l'iPhone.
- Le **code de déverrouillage** et Face ID restent à toi.
- Les apps bancaires et de streaming masquent leur contenu en AirPlay (écran noir).
- Accents et emojis : pas avec le clavier simulé. On peut ajouter la disposition FR au firmware plus tard.
- Je n'ai **pas encore testé ce système sur du vrai matériel** : il faudra ajuster aux premiers essais.

## 🔒 Sécurité
Le SamouraiLink peut tout faire sur ton iPhone. Garde le Pi chez toi, protège-le avec un mot de passe,
et retire l'appareil Bluetooth « SamouraiLink » de l'iPhone pour couper l'accès instantanément.
