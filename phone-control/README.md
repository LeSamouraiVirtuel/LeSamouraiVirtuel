# 📱 Contrôle du téléphone par Claude

**Énoncé :** « Est-ce que Claude peut contrôler mon téléphone ? »
**Réponse : oui, un téléphone Android, à condition de passer par un ordinateur.**

```
 Toi (app Claude) ──► Claude Code sur ton ordinateur ──► ADB (USB ou Wi-Fi) ──► 📱 Android
                         (Remote Control)                 phone.py
```

Claude ne peut pas parler directement à ton téléphone depuis le cloud : il n'a
ni accès réseau ni pilote. Il faut donc un relais : ton ordinateur. Claude y
lance `phone.py`, qui envoie les commandes au téléphone avec **ADB** (Android
Debug Bridge, l'outil officiel de Google).

## Ce que Claude peut faire

| Action | Commande |
|---|---|
| Voir l'écran (capture) | `python3 phone.py screenshot ecran.png` |
| Lire l'écran (textes + positions) | `python3 phone.py ui` |
| Toucher un point / un bouton | `python3 phone.py tap 540 1200` · `python3 phone.py tap-text "Envoyer"` |
| Faire défiler | `python3 phone.py swipe up/down/left/right/notifications` |
| Écrire du texte | `python3 phone.py type "Salut"` |
| Touches | `python3 phone.py key home/back/enter/recent/power/volup/voldown` |
| Ouvrir une appli / une page web | `python3 phone.py open com.whatsapp` · `python3 phone.py url https://...` |
| Lister les applis, infos, batterie | `python3 phone.py apps` · `python3 phone.py info` |

Claude enchaîne tout ça en boucle : **capture → il regarde → il agit → nouvelle capture**.
Tu lui dis par exemple « ouvre YouTube et cherche une vidéo de samouraï » et il le fait.

## Installation (≈ 10 minutes)

### 1. Sur le téléphone Android
1. **Paramètres → À propos du téléphone →** touche 7 fois **Numéro de build**
   (« Vous êtes développeur »).
2. **Paramètres → Système → Options pour les développeurs →** active
   **Débogage USB** (et **Débogage sans fil** si tu veux le Wi-Fi).
   Sur Xiaomi, active aussi **Débogage USB (paramètres de sécurité)**.

### 2. Sur l'ordinateur
1. Installe **Android Platform Tools** (contient `adb`) :
   - Windows : `winget install Google.PlatformTools`
   - Mac : `brew install android-platform-tools`
   - Linux : `sudo apt install adb`
2. Installe Python 3, puis récupère ce dossier (`git clone` de ce dépôt).
3. Branche le téléphone en USB, accepte « Autoriser le débogage USB » sur le téléphone.
4. Vérifie : `python3 phone.py devices` → ton téléphone doit apparaître avec `device`.

   *Sans câble (Android 11+) :* Options développeurs → Débogage sans fil →
   « Associer avec un code », puis `adb pair IP:PORT` et `adb connect IP:PORT`.

### 3. Donner la main à Claude
- **Depuis l'app Claude (téléphone ou web) :** sur l'ordinateur, active
  **Remote Control** (app Claude desktop → Paramètres → Claude Code → Remote Control,
  ou `claude remote-control` dans ce dossier). Dans une session Claude Code,
  demande « connecte-toi au dossier phone-control de mon ordinateur ».
- **Ou directement sur l'ordinateur :** lance `claude` dans ce dossier.

Ensuite il suffit de dire : *« Prends une capture de mon téléphone et ouvre les paramètres Wi-Fi »*.

## Limites (honnêtement)
- **iPhone :** pas d'équivalent simple à ADB. Il faut un Mac, Xcode et
  WebDriverAgent (Appium) : faisable mais bien plus lourd. Ce dossier vise Android.
- **Écran verrouillé par code :** Claude ne le déverrouille pas, c'est à toi de le faire.
- **Applis bancaires / Netflix :** elles bloquent souvent les captures (écran noir).
- **Accents/emojis** avec `type` : ça dépend du téléphone. Installe ADBKeyBoard en cas de souci.

## Sécurité
Le débogage USB donne un contrôle total du téléphone à l'ordinateur autorisé.
N'accepte la demande d'autorisation que pour **ton** ordinateur, et désactive
le débogage quand tu as fini.
