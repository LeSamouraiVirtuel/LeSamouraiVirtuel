# Consignes pour Claude : piloter le téléphone

Outil : `python3 phone.py <commande>` (voir `python3 phone.py --help`).

Boucle de travail :
1. `python3 phone.py devices` : vérifier qu'un appareil est en état `device`.
   Sinon, guider l'utilisateur (README.md, section Installation).
2. `python3 phone.py screenshot /tmp/screen.png` puis lire l'image pour voir l'écran.
3. `python3 phone.py ui` pour obtenir textes et coordonnées exactes.
   Préférer `tap-text` aux coordonnées devinées.
4. Agir (tap, swipe, type, key, open, url), puis refaire une capture pour vérifier.

Règles :
- Demander confirmation avant toute action irréversible ou visible par d'autres :
  envoyer un message, appeler, payer, supprimer, publier, modifier un compte.
- Ne jamais saisir de mot de passe ou de code PIN : l'utilisateur le fait lui-même.
- Si l'écran est verrouillé, demander à l'utilisateur de le déverrouiller.
