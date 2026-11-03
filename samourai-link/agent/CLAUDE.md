# Consignes pour Claude : piloter l'iPhone via SamouraiLink

Outil : `python3 link.py <commande>` (voir `python3 link.py --help`).

## Boucle de travail
1. `status` → doit afficher `OK connected`. Sinon : l'ESP32 est débranché ou l'iPhone n'est pas appairé.
2. `screenshot /tmp/s.png` puis lire l'image. Écran noir ou absent : la Recopie AirPlay
   est coupée, demander à l'utilisateur de la relancer depuis le Centre de contrôle.
3. Si `calibration.json` n'existe pas : `calibrate`, lire calib0.png et calib1.png,
   trouver le centre du rond gris du pointeur, puis `set-calibration X0 Y0 X1 Y1`.
4. Agir avec `tap X Y` (coordonnées = pixels de la capture plein écran), `swipe`, `type`, `key`, `home`.
5. Refaire une capture après chaque action pour vérifier. Si le tap est décalé :
   `move X Y`, capture, `nudge DX DY`, puis `click`. Si l'écart revient, refaire la calibration.

## Astuces iOS
- Ouvrir une app : `home`, puis `swipe` vers le bas au milieu de l'écran (recherche), `type "Nom"`, `key ENTER`.
- Retour en arrière : swipe depuis le bord gauche, ou le bouton « < » en haut à gauche.

## Règles
- Demander confirmation avant toute action irréversible ou visible par d'autres :
  envoyer un message, appeler, payer, supprimer, publier, modifier un compte.
- Ne jamais saisir de code, de mot de passe, ni valider Face ID ou un paiement : c'est l'utilisateur qui le fait.
