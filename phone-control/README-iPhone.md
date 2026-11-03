# 🍎 Contrôle de l'iPhone par Claude

Apple n'autorise aucun outil comme ADB (Android). La méthode fiable sans
jailbreak passe par **Recopie de l'iPhone** (iPhone Mirroring) : ton Mac
affiche l'iPhone dans une fenêtre, et Claude clique et tape dedans avec
`iphone.py`.

```
Toi (app Claude) → Claude Code sur ton Mac → fenêtre « Recopie de l'iPhone » → 📱 iPhone
                      (Remote Control)          iphone.py
```

## Ce qu'il te faut
- Un **Mac** (puce Apple ou Intel avec puce T2), sous **macOS 15 Sequoia** ou plus récent.
- Un **iPhone sous iOS 18** ou plus récent.
- Le **même compte Apple** sur les deux, avec l'identification à deux facteurs activée.
- Le Wi-Fi et le Bluetooth activés, et les deux appareils proches l'un de l'autre.

> ⚠️ La Recopie de l'iPhone **n'est pas disponible dans l'Union européenne** (France
> comprise) pour l'instant, à cause de la réglementation DMA. Si l'app « Recopie de
> l'iPhone » est absente de ton Mac, va directement à la section *Sans la Recopie*.

## Installation
1. Sur le Mac, ouvre **Recopie de l'iPhone** (dans le Launchpad ou le Dock) et
   suis les étapes. L'iPhone doit être **verrouillé** pendant la recopie.
2. Dans le Terminal : `brew install cliclick` (pour installer Homebrew, va sur https://brew.sh).
3. Ouvre **Réglages Système → Confidentialité et sécurité** et autorise le **Terminal**
   (ou l'app Claude) dans **Accessibilité** et dans **Enregistrement de l'écran et audio**.
4. Récupère ce dépôt, puis lance le test : `python3 iphone.py check`.
5. Donne la main à Claude : app Claude desktop → Paramètres → Claude Code →
   **Remote Control**, en ajoutant le dossier `phone-control`.

## Commandes
| Action | Commande |
|---|---|
| Voir l'écran | `python3 iphone.py screenshot ecran.png` |
| Toucher | `python3 iphone.py tap 150 400` |
| Appui long | `python3 iphone.py longpress 150 400` |
| Faire défiler | `python3 iphone.py swipe up/down/left/right` |
| Écrire | `python3 iphone.py type "Salut"` · `python3 iphone.py key enter` |
| Accueil / apps ouvertes / recherche | `python3 iphone.py home` · `switcher` · `search` |
| Ouvrir une app | `python3 iphone.py open "WhatsApp"` |

Si les clics tombent un peu à côté, ajuste les marges :
`IPHONE_TOP=28 python3 iphone.py tap ...` (28 = hauteur de la barre de titre).

## Sans la Recopie (UE, ou si tu n'as pas de Mac)
- **Mac + câble, avancé :** Appium avec WebDriverAgent. Il faut Xcode et un
  compte Apple. Le contrôle est complet, mais l'installation est lourde.
- **Sans ordinateur :** l'app **Raccourcis** de l'iPhone peut lancer des actions
  toutes prêtes (envoyer un message, régler une alarme, ouvrir une app…). Claude
  peut t'écrire ces raccourcis, mais ce n'est pas du contrôle de l'écran en direct.

## Limites
- Le **code** de l'iPhone se tape toujours par toi.
- Les apps bancaires et de streaming peuvent masquer leur contenu dans la recopie.
