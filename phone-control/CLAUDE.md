# Consignes pour Claude : piloter le téléphone

- **iPhone** (cas de l'utilisateur) : `python3 iphone.py <commande>` sur un Mac
  via « Recopie de l'iPhone ». Voir README-iPhone.md. Pas de commande `ui` :
  se fier aux captures (coordonnées = pixels de l'image).
- **Android** : `python3 phone.py <commande>` via ADB. Voir README.md.

Boucle de travail :
1. `check` (iPhone) ou `devices` (Android) : vérifier qu'un appareil est en état `device`.
   Sinon, guider l'utilisateur (README.md, section Installation).
2. `screenshot /tmp/screen.png` puis lire l'image pour voir l'écran.
3. Android uniquement : `ui` pour obtenir textes et coordonnées exactes.
   Préférer `tap-text` aux coordonnées devinées.
4. Agir (tap, swipe, type, key, open, url), puis refaire une capture pour vérifier.

Règles :
- Demander confirmation avant toute action irréversible ou visible par d'autres :
  envoyer un message, appeler, payer, supprimer, publier, modifier un compte.
- Ne jamais saisir de mot de passe ou de code PIN : l'utilisateur le fait lui-même.
- Si l'écran est verrouillé, demander à l'utilisateur de le déverrouiller.
