# Consignes pour Claude : piloter l'iPhone via SamouraiLink

Outil : `python3 link.py <commande>` (ou l'alias `link` après `source /etc/profile.d/samourai.sh`).
Sur le VPS, les variables LINK_FRAME et LINK_CALIB viennent de /etc/profile.d/samourai.sh.

## Boucle de travail
1. `link status`. Il faut : relais OK, esp32 online, iPhone connected, image de moins de 5 s.
   - esp32 offline : l'ESP32 est débranché ou n'a pas de Wi-Fi.
   - iPhone not connected : le Bluetooth est coupé sur l'iPhone.
   - image vieille ou absente : la diffusion d'écran est arrêtée, demander de la relancer.
2. Pas encore calibré : demander d'ouvrir la page /calib dans Safari, puis `link calibrate`.
3. `link screenshot /tmp/s.jpg`, puis lire l'image. Les coordonnées sont les pixels de cette image.
4. Agir : `tap X Y`, `swipe X1 Y1 X2 Y2`, `type "..."`, `key ENTER`, `home`, `scroll N`.
5. Attendre environ 1,5 s (délai vidéo), puis refaire une capture pour vérifier.
   Si le tap est décalé : `move X Y`, capture, `nudge DX DY`, `click`.
   Si le décalage revient, recalibrer.

## Astuces iOS
- Ouvrir une app : `home`, puis swipe vers le bas au milieu de l'écran d'accueil (recherche),
  `type "Nom"`, `key ENTER`.
- Retour : bouton « < » en haut à gauche, ou swipe depuis le bord gauche.

## Règles
- Demander confirmation avant toute action irréversible ou visible par d'autres :
  envoyer un message, appeler, payer, supprimer, publier, modifier un compte.
- Ne jamais saisir de code, de mot de passe, ni valider Face ID ou un paiement.
- Ne jamais afficher le contenu de /etc/samourai/env ni d'INFOS.txt dans la conversation.
