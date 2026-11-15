# Bid Master : analyse image par image, minute 0 (0:00 à 0:59)

Source : `video.mp4` (iPhone, 60 i/s). J'ai regardé les 30 planches de 8 vignettes (une image toutes les 0,25 s), les captures `sc/t0m*.jpg`, et j'ai extrait des images avec ffmpeg sur 7,3-9,9 s (CONGRATULATIONS puis pluie de billets) et sur 22,85-23,25 s (ouverture de la fiche Spokane).
Convention : tout ce qui est écrit ici a été vu à l'écran. [?] = illisible ou incertain. « Interprétation » = déduction, pas une observation.
Les instants de toucher sont **déduits** du changement d'écran qui suit, car aucun indicateur de toucher ne s'affiche (précision ±0,1 s).

---

## 1. Chronologie

### Premier lancement
- **0:00.00** — Écran d'accueil iOS. Pastille rouge d'enregistrement d'écran en haut à gauche, batterie 23. Icônes : iTunes Store, Mesures, Authen…, Journal, Threads, Drive, Claude, Notion, Discord, Sheets, AnyDesk, Temu, Facebook, Mobile…, Gemini, Clash Royale, Google Maps, Grindr, **Bid Master** (4e colonne, 5e rangée), Wakeline, Tinder.
- **0:00.2** — Le joueur touche l'icône Bid Master.
- **0:00.25** — Animation iOS d'ouverture : une carte sombre grandit depuis l'icône. Le logo « MADE WITH Unity » y est déjà visible.
- **0:00.50 → 0:01.0** — Bannière iOS « Mode Jeu / Oui » (manette bleue) qui glisse depuis le haut. Écran Unity gris anthracite, logo blanc au centre.
- **0:01.0 → 0:01.5** — Le logo Unity s'éteint en fondu (≈0,4 s). L'écran passe au noir (0:01.75 à 0:02.0).
- **0:02.25** — **Écran de chargement** (garage), qui apparaît d'un coup :
  - mur de briques et lampe industrielle allumée, avec un cône de lumière blanche ;
  - logo « BID » (blanc à contour rouge) et « MASTER » (jaune-orangé à contour bordeaux) ;
  - rideau de garage à moitié levé, sur un 4×4 vert d'eau et noir, avec des cartons et un balai à droite ;
  - **billets verts qui tombent en tournoyant** autour du logo, en boucle ;
  - barre de chargement : fond vert sombre et remplissage jaune, avec en dessous le texte jaune « Allez dans mon empire de prêteurs sur gages… ».
- **0:02.25 → 0:03.75** — La barre se remplit (≈5 % à 2,25 s, 25 % à 2,5 s, 42 % à 2,75 s, 58 % à 3,0 s, 75 % à 3,25 s, 92 % à 3,5 s, pleine à 3,75 s), en ≈1,5 s.
- **0:04.25** — La bannière « Mode Jeu » remonte et disparaît.
- **0:03.75 → 0:05.6** — La barre reste pleine pendant ≈1,9 s : le jeu charge sans rien montrer d'autre.
- **0:05.68** — Coupe franche vers la **Ville** (voir §2-D), avec le HUD complet.
- **0:05.75** — Une image plus tard, le **calendrier de connexion** s'ouvre automatiquement par-dessus, sans transition visible, avec un voile sombre sur la ville (§2-B).
- **0:06.5** — Le joueur touche la case « Le 25jour », qui est en surbrillance. Sur la vignette, la case paraît légèrement enfoncée.
- **0:06.73** — La popup « Récompense de connexion » s'ouvre en **grossissant depuis une petite taille** : à 6,73 s elle fait ≈45 % de sa taille finale, à 6,75 s elle est pleine taille. Le voile s'assombrit.
  - Au même moment, une **pastille rouge** apparaît sur le « + » de l'énergie du HUD. Elle reste ensuite jusqu'à la fin de la minute.
- **0:07.45** — Le joueur touche le bouton bleu « Recevoir ». Il ne touche pas le bouton vert « Obtenez le double du montant », qui passe par une pub.
- **0:07.5** — Plein écran **CONGRATULATIONS** :
  - le fond s'assombrit davantage ;
  - un faisceau de lumière dorée descend du haut ;
  - le titre « CONGRATULATI ONS » s'affiche en lettres blanc-crème à halo doré, avec un filet horizontal de part et d'autre.
  - Derrière, le calendrier est déjà mis à jour : jour 25 coché, compteur des clés **(10/7)**.
- **0:08.25** — Le sous-titre « Félicitations pour l'obtention » apparaît en fondu.
- **0:08.3 → 0:08.5** — Les cartes apparaissent en fondu et en grossissant légèrement :
  - une grande carte violette de billets marquée **976** (et non 900, voir §4) ;
  - une petite icône « i » à gauche ;
  - la pastille « Prime De Secrétaire » avec une petite carte violette **9** ;
  - le bouton rond « ✓ » doré qui pulse légèrement.
- **0:08.95** — Le joueur touche « ✓ ».
- **0:09.0** — Retour au calendrier, qui affiche maintenant « 17 ciel Connecté » au lieu de 16, le jour 25 coché et (10/7).
  - Le compteur de billets du HUD passe **directement de 4.85K à 5.83K**, sans défiler.
  - **Pluie de billets** : deux paquets de billets jaillissent des positions des deux cartes, l'un vers le centre (jour 23 et 25) et l'autre vers le bas (barre des clés). Ils s'éparpillent puis montent en arc vers le compteur de billets en haut à droite. Il y a ≈30 billets et l'effet dure ≈1,2 s (9,0 → 10,7 s).
- **0:09.75** — Le calendrier s'est fermé tout seul : on ne voit aucun toucher sur la croix [?].
  - Par-dessus, l'**offre « Modification d'un pick-up »** s'ouvre sans attendre la fin de la pluie de billets (§2-C).
  - Animation d'entrée : un halo circulaire doré apparaît d'abord, puis le pick-up arrive par la droite **en zoom exagéré**. À 10,0 s il est coupé par le bord de l'écran, à 10,25 s il est à sa taille finale.
- **0:10.25** — Le titre en bandeau incliné apparaît. Les 5 étoiles sont d'abord grises, puis se remplissent en or vers 10,5 s.
- **0:10.5 → 0:10.75** — La pastille rouge « Valeur 300% » apparaît en fondu puis devient nette.
- **0:11.9** — Le joueur touche la croix blanche en haut à droite de l'offre.
- **0:11.95** — La ville est visible sans aucune popup pendant une seule image.
- **0:12.0** — La popup **« événement à durée limitée »** s'ouvre (§2-E). Elle commence légèrement plus grande (à 12,0 et 12,15 s elle remplit l'écran), puis se réduit à sa taille finale à 12,25 s. C'est un petit effet de rebond inverse.
  - Les 4 minuteurs affichent d'abord « 00:00:00 ». À **12,75 s**, ils passent à **« 35d 06:52:31 »** : la donnée arrive avec ≈0,7 s de retard.
- **0:13.1** — Le joueur touche la croix et la popup se ferme.
- **0:13.25 → 0:17.9** — La **Ville** reste au repos pendant 4,6 s.
  - Les piétons marchent : une femme en robe orange près du Musée, une blonde en robe rouge et un homme en costume devant le Pawn Shop, un vieil homme en chemise près de MINI.
  - L'icône « Limitée » en haut de la colonne droite change de portrait à **15,75 s** (marin brun → femme rousse en tenue de pirate). C'est un carrousel.
- **0:17.9** — Le joueur touche l'onglet **« enchères »** (gros marteau en bas à droite).
- **0:18.0** — **Carte des enchères**, sans transition, centrée sur la **région en cours, « Texas »** (§2-F). L'onglet « enchères » prend un fond doré clair.
- **0:18.6 → 0:20.5** — Le joueur fait glisser la carte vers le bas pour voir les régions précédentes.
  - Entre deux régions, il y a une bande sombre, avec des doubles chevrons ⌃ ⌄ et le nom de la région dans une étiquette brune.
  - 18,75 s : Texas en haut. 19,0 s : jonction Texas/Californie. 19,25 → 20,0 s : **« Californie »**. 20,25 s : jonction. 20,5 s : **« Etat De Washington »**.
  - Le défilement est fluide, avec une petite inertie.
- **0:20.5 → 0:22.9** — La carte de Washington reste immobile.
- **0:22.95** — Le joueur touche le lieu « 1 Spokane ».
- **0:23.05** — La fiche **Spokane** apparaît en grossissant depuis le centre (≈60 % de sa taille), dépasse sa taille finale à 23,25 s, puis revient à 23,5 s. C'est un rebond d'environ 0,3 s.
- **0:24.9** — Le joueur touche la croix et la fiche se ferme.
- **0:25.0 → 0:25.9** — La carte de Washington est de nouveau à l'écran.
- **0:25.9** — Le joueur touche « 2 Kennewick ». La fiche **Kennewick** s'ouvre avec le même rebond (≈55 % à 25,93 s, taille finale ≈26,0 s).
- **0:26.3** — Le joueur touche le bouton vert **« GO! ⚡5 »**, celui qui porte l'icône de clap (pub).
- **0:26.32 → 0:26.7** — Écran entièrement noir : la pub se charge.
- **0:26.75** — **Pub vidéo** pour un autre jeu. La vidéo est encore noire, mais un bouton bleu-violet « OBTENIR » s'affiche en bas à droite, avec l'icône du roi de Clash Royale et un petit « i » en bas à gauche.
- **0:27.0 → 0:28.5** — La vidéo est en prise de vue réelle : une rue médiévale, un homme massif couronné de paille et une princesse blonde. Sous-titre « PèRE, MèRE VOICI HENRI » (avec ces capitales irrégulières), à partir de 27,5 s.
  - On ne voit ni bouton de fermeture ni compte à rebours.
- **0:28.75** — Le joueur glisse depuis le bas : **sélecteur d'apps iOS**. La carte de la pub rétrécit.
- **0:29.0 → 0:29.5** — Le joueur fait défiler les apps récentes : Horloge (Minuteurs, 1 h 16 min), une app de notes ou de chat [?], une app Instagram ou Claude [?].
- **0:29.75** — Retour à l'écran d'accueil. Il est **16:07**, batterie 22.

### Deuxième lancement
On voit de nouveau le logo Unity : l'app a été relancée à froid. Elle a soit été fermée dans le sélecteur, soit planté [?].

- **0:30.4** — Le joueur touche l'icône Bid Master. Animation d'ouverture iOS, puis écran gris uni de 30,75 à 32,0 s.
- **0:32.25 → 0:33.5** — « MADE WITH Unity » : fondu entrant en ≈0,25 s, maintien ≈0,75 s, fondu sortant ≈0,5 s. Écran noir à 34,0 s.
- **0:34.25** — Même écran de chargement du garage. La barre se remplit de 34,25 à 35,75 s, en ≈1,5 s, puis reste pleine jusqu'à 36,9 s.
- **0:37.0** — Ville, avec l'**offre pick-up directement**. Cette fois, ni calendrier (déjà réclamé) ni popup d'événements.
  - Entrée en 4 temps : 37,0 s, anneau lumineux seul ; 37,25 s, le pick-up glisse depuis la droite ; 37,5 s, titre et étoiles ; 37,75 s, « Valeur 300% ».
- **0:38.1** — Le joueur touche la croix.
- **0:38.15** — Ville. Une **nouvelle icône** est apparue dans la colonne droite : un **cadeau doré avec le minuteur « 09:39 »**. Il décompte en temps réel : 09:38 à 39,0 s, 09:37 à 40,0 s, … 09:31 à 46,25 s.
- **0:38.25 → 0:40.75** — La ville reste au repos : les piétons marchent et une voiture rouge circule près du Musée.
- **0:40.9 → 0:42.0** — Le joueur fait glisser la carte vers le haut et la gauche. Il découvre l'Entrepôt, le **Serrurier** (énorme clé dorée sur le toit), deux immeubles d'appartements (« 0/5 » et « 0/7 »), le Magasin de voitures et un Restaurant.
- **0:43.0 → 0:44.25** — **Pincement pour zoomer** : les étiquettes grossissent avec le décor (« Entrepôt » passe en gros caractères).
- **0:44.5** — Dézoom (pincement inverse) : retour à l'échelle normale.
- **0:45.0 → 0:46.25** — Glissement vers la droite et le haut : Casino, Bibliothèque, Institut d'expertise, Atelier de réparation, Restaurant, Hôtel « Chasse au… » [?], **jetée** avec yacht, et une étiquette « Secrétair[e] » [?] tout en bas.
- **0:46.5 → 0:47.0** — Glissement retour vers le Pawn Shop.
- **0:47.1** — Le joueur touche le bâtiment Prêteur sur gages.
- **0:47.25** — **Magasin de prêteurs sur gages**, par coupe franche sans transition (§2-G). Le HUD de la ville et la barre d'onglets disparaissent.
- **0:48.0 → 0:48.25** — Le joueur fait défiler les étagères vers le haut. La rangée VIP sort par le haut et on découvre en bas une 4e rangée (un client « Je veux acheter! »).
- **0:48.9** — Le joueur touche « Voir l'offre » sous le Robot.
- **0:48.95** — La popup **« Robot d'escorte »** s'ouvre en grossissant (≈50 % → 100 % en ≈0,1 s). Le minuteur avance : 01:59:16 à 49,0 s, 01:59:15 à 49,25 s, 01:59:14 à 50,25 s.
- **0:50.9** — Le joueur touche le bouton bleu « D'accord ».
- **0:51.0** — Plein écran CONGRATULATIONS : le titre seul d'abord, puis le sous-titre à 51,25 s qui clignote [?] à 51,5 s. Les cartes arrivent en fondu à 51,75 s, nettes à 52,0 s.
  - Le compteur de billets affiche **déjà 10.49K** derrière le voile (avant : 5.83K).
- **0:52.0 → 0:53.5** — L'écran reste fixe : la grande carte billets **4,616** et la carte livre « EXP » bleue **5**. Prime De Secrétaire : billets **42** et EXP **1**. Bouton ✓.
- **0:53.6** — Le joueur touche « ✓ ».
- **0:53.75 → 0:54.75** — Retour au magasin, avec une **pluie de billets et de cartes EXP** :
  - elle part du centre et de l'étagère vendue ;
  - les billets montent vers le compteur de billets en haut à droite, les cartes EXP vers le coin haut gauche (icône du magasin) ;
  - elle dure ≈1,3 s.
  - L'étagère du Robot devient « Ajouter des produits ».
  - Les étagères se réorganisent et défilent toutes seules : l'urne remonte, le casque apparaît en bas.
- **0:54.9** — Pendant que les billets volent encore, le joueur touche « Voir l'offre » sous le vase noir.
- **0:54.97** — La popup **« ChampagneAsDePique »** s'ouvre. La pluie de billets continue de passer **par-dessus** la popup jusqu'à 55,25 s.
- **0:55.9** — Le joueur touche « D'accord ».
- **0:56.0** — CONGRATULATIONS, compteur à **14.71K**. Sous-titre à 56,25 s, cartes à 56,75 s : billets **4,176** et EXP **5**, Secrétaire **38** et EXP **1**.
- **0:57.9** — Le joueur touche « ✓ ».
- **0:58.0 → 0:59.75** — Même pluie de billets et d'EXP. Il ne reste en vente que l'urne et le casque ; 4 étagères sont vides avec « Ajouter des produits ». La pluie traverse à nouveau la popup suivante.
- **0:59.1** — Le joueur touche « Voir l'offre » sous l'urne.
- **0:59.25** — La popup **« Urne ancienne du dragon divin »** s'ouvre, avec le même grossissement. Fin de la minute.

---

## 2. Inventaire écran par écran

### A. Écran de chargement (2,25 s et 34,25 s)
Détails déjà décrits en 0:02.25. À noter en plus :
- aucun numéro de version et aucun bouton ;
- la barre ne montre pas de pourcentage ;
- le texte d'ambiance est le même aux deux lancements ;
- c'est la seule animation, avec les billets qui tombent ; le rideau ne bouge pas.

### B. Calendrier « Récompense de connexion » (5,75 → 9,75 s)
**Forme générale**
- Carnet à spirale : 3 anneaux métalliques en haut, papier crème, cadre brun-rouge, trombone en bas à gauche, petit ruban rouge en haut.
- Croix ronde rouge et blanche en haut à droite.

**En-tête**
- À gauche, « **28** » en grand chiffre bordeaux, suivi de « ciel ». C'est une **mauvaise traduction de « jours »**, sans doute « sky/day ». En dessous : « Récompense de connexion » en lettres espacées.
- À droite, « **16** ciel » puis « Connecté », qui passe à « 17 » après la réclamation.

**Grille des jours** (elle défile ; ici elle est positionnée sur la semaine en cours)
- La rangée du haut est coupée : on lit « 1,000 », « 60 » et « 1,500 », sans doute les jours 19 à 21 [?].
- Une case réclamée est grisée, avec une **coche dorée** dans son coin.
- La case du jour à réclamer a un **cadre doré lumineux** et une **pastille rouge**.

| Jour | Récompense | État |
|---|---|---|
| Le 22jour | billets 600 | coche |
| Le 23jour (case double) | calculatrice ×5 + lingot ×15, ruban jaune incliné « Récompenses exclusives! » | coche |
| Le 24jour | billets 800 | coche |
| Le 25jour | billets 900 | à réclamer : cadre doré et pastille rouge |
| Le 26jour | billets 1,000 | à venir |
| Le 27jour | billets 1,100 | à venir |
| Le 28jour (case double, bandeau orange) | pièce de puzzle portrait (femme brune en chignon) ×50 + billets 2,000 | à venir |

**Barre du bas** (bordeaux)
- 6 clés dorées sur une tige, et au bout un **coffre violet et or**.
- Texte : « Connectez-vous en continu pendant **7** jours pour ouvrir le mystérieux coffre au trésor ! », avec le 7 en jaune.
- Compteur « (9/7) », qui passe à « (10/7) ». Il dépasse 7 et on ne voit aucun effet sur le coffre [?].

**Popup « Récompense de connexion »**
- Bandeau orange, croix blanche.
- Sur fond crème : une carte violette, billets « 900 ».
- Bouton vert « Obtenez le double du montant », avec un **clap de cinéma** : c'est une pub.
- Bouton bleu « Recevoir ».

**Ce que ça apprend sur le jeu**
- Le calendrier compte 28 jours, avec une récompense en billets qui augmente d'environ 100 par jour.
- Les jours 23 et 28 sont des jours spéciaux : objet rare, ou fragment de personnage (puzzle ×50).
- Il y a un coffre de fidélité pour 7 jours de connexion d'affilée.
- On peut doubler la récompense en regardant une pub.

### C. Offre « Modification d'un pick-up » (9,75 → 11,9 s et 37,0 → 38,1 s)
- Fond assombri, avec un **disque sombre entouré d'un anneau de lumière dorée** (éclipse) derrière le véhicule.
- Titre blanc à contour sombre sur un bandeau doré incliné, montant vers la droite : « Modification d'un pick-up ».
- 5 étoiles dorées.
- Le pick-up : gris anthracite, éclair vert fluo sur le flanc, rampe de 6 phares sur le toit, pare-buffle.
- Pastille ronde rouge « Valeur 300% ».
- Deux lignes inclinées : « Capacité maximale au niveau maximum : **10** » et « Vitesse maximale au niveau maximum : **8s** », avec les chiffres en vert-jaune.
- Contenu du pack, en 3 cartes : pick-up (fond orange), lingots ×30 (fond orange), billets ×5000 (fond violet).
- Gros bouton jaune « **$2.99** », avec une pastille rouge « **Chaud** » ornée d'une flamme.
- Texte en italique : « Après avoir acquis un pick-up, vous pouvez transporter plus de marchandises après la fin de l'enchère ! »
- Fermeture par une croix blanche flottante, sans cadre.

**Ce que ça apprend :** le véhicule fixe combien d'objets on rapporte d'une enchère (capacité) et le temps de retour (vitesse). Il s'améliore jusqu'à un niveau maximum.

### D. Ville (HUD permanent)
**Haut gauche**
- Portrait de l'avatar (blonde) dans un cadre doré, avec un badge losange **19** (niveau).
- En dessous, la pilule grise « VIP » et la pilule verte « Grand Capitaliste » avec une icône $.

**Barre de ressources**
- ⚡ **60/60** +, avec une pastille rouge sur le « + » à partir de 6,73 s.
- Lingot **298** +.
- Billets **4.85K**, puis 5.83K, 10.49K et 14.71K +.
- Les « + » sont des carrés orange.

**Sous la barre, à droite :** une enveloppe rouge (courrier) et un engrenage (réglages).

**Colonne gauche** (icônes rondes, de haut en bas)
1. « Pack Temporaire » (portrait d'un personnage en rouge et or)
2. Calendrier coché (pastille rouge au premier lancement)
3. Liasse de billets (pastille rouge)
4. « AD » barré en rouge (supprimer les pubs)
5. Badge hexagonal doré à étoile
6. Étal de boutique (pastille rouge)
7. Facebook
8. Camion semi-remorque
9. Chevron ⌃ pour replier

**Colonne droite**
1. « Limitée » : carrousel de portraits, pastille rouge
2. Coffret cadeau rose (pastille rouge)
3. Trophée doré à $ (pastille rouge)
4. Coffre ou chariot rouge rempli de lingots [?]
5. **Cadeau doré avec le minuteur « 09:39 »** (seulement au 2e lancement)
6. Tirelire cochon avec « 800 » lingots (pastille rouge)
7. Pick-up
8. Gangster au chapeau violet (étincelles)
9. Chevron ⌃

**Bas gauche**
- Téléphone doré « quêtes secondaires ».
- Carte violette « Tâche » avec un gros « ! » et une pastille « ? ». Sa bulle dit : « Participez à des ventes aux enchères de San Antonio niveaux et gagnez 3,500 de dollars (**1,514/3,500**) », avec la progression en jaune.

**Bas droite**
- Voiture de sport blanche marquée d'un gros « S » doré, « Gains sur crochet », minuteur « **1d 00:00:00** », pastille rouge.

**Barre d'onglets**
- Ville (actif, fond beige)
- boutique (pastille rouge)
- Rôle
- corporation
- Métropole (cadenas)
- **enchères**, plus haut et plus gros, avec un marteau doré et un badge presse-papier « ! »

**Bâtiments vus** (chacun a une étiquette sombre : icône et nom)
- Musée (bulle avec un livre en haut de l'écran)
- Entrepôt
- Prêteur sur gages (« ! » rouge et bulle sac de billets, c'est-à-dire de l'argent à récolter)
- Institut d'expertise (« ! » rouge)
- boutique MINI
- Serrurier
- Magasin de voitures
- Appartements « 0/5 » et « 0/7 » (icône de groupe)
- Restaurant, Casino, Bibliothèque, Atelier de réparation
- Hôtel « Chasse au… » [?]
- jetée (yacht)
- « …é commerc… » (Marché commercial)
- « Secrétair… » [?]

**Vie de la ville :** piétons qui marchent, voitures qui roulent, arbres. La caméra se pilote par glissement et par pincement.

### E. Popup « événement à durée limitée » (12,0 → 13,1 s)
- Cadre violet, titre jaune italique, croix blanche.
- Décor de fête : feux d'artifice violets et guirlande de fanions multicolores en haut à gauche, confettis.
- 4 bannières illustrées. Chacune a un coin rouge « nouvelle », une horloge ⌚ avec « 35d 06:52:31 » et un bouton jaune « Entrer » :
  1. **Guerre de Guilde** : bagarreurs caricaturés (boxeurs, cow-boy, punk aux cheveux roses).
  2. **Tenue de saison en vente pour une durée limitée** : 8 personnages en costume sur fond rouge et or.
  3. **Visiteur dans le brouillard (Dossier de chasse au trésor, phase 2)** : fond de brume, 4 icônes d'objets (cadre ou tableau lumineux, parchemin doré, œuf ou gemme violet, lanterne).
  4. **Recevez votre domaine** : manoir, fontaine, statue de cheval dorée.

### F. Carte des enchères (18,0 → 26,3 s)
- Fond de **parchemin sépia**, avec des routes en relief et des côtes.
- Les lieux sont des **disques de bronze numérotés**, reliés par un **chemin de points jaunes lumineux**.
- Chaque région a un en-tête : étiquette brune, petite étoile, nom en blanc.
- Une bande sombre sépare les régions, avec les chevrons ⌃ ⌄.
- La numérotation **monte du bas vers le haut** :

| Région | Lieux | Spéciaux |
|---|---|---|
| **Etat De Washington** (bas) | 1 Spokane, 2 Kennewick, 3 Olympie, 4 Bellevue, 5 Seattle | ★ Sites archéologiques, ★ La ville automobile |
| **Californie** | 6 Saint Louis, 7 Sacramento, 8 Auckland, 9 San Francisco, 10 Los Angeles | ★ Reliques mystérieuses ; « armes à feu » (icône de montre ou boussole dorée) |
| **Texas** (région actuelle) | 11 Austin, 12 Fort Vaut, **13 San Antonio** (lieu actuel) ; Victoria, Dallas, Houston **verrouillés** (disques gris à cadenas) | ★ Camping à moteur (étoile dorée), Capitale de la mode (étoile **argentée**) |

- **Lieu actuel (San Antonio) :**
  - halo doré autour du disque ;
  - petit marteau incliné ;
  - au-dessus, une **vignette illustrée** (scène 3D d'une ville moderne) dans un cadre blanc ;
  - un badge presse-papier violet « ! ».
- Les noms de villes sont parfois de fausses traductions : « Fort Vaut » pour Fort Worth, et « Auckland » placé en Californie (sans doute Oakland).

**Fiche d'un lieu** (Spokane, Kennewick)
- Bandeau orange avec le nom et une croix.
- Grande illustration de la ville : Spokane = rue de briques ensoleillée façon New York ; Kennewick = site industriel avec derrick [?].
- Étiquette jaune « Enchère recommandée » : **$600** pour Spokane, **$800** pour Kennewick.
- Barre verte avec un gros « $ » doré : « Objectif : terminer 1 enchères », et « Terminer » à droite (objectif déjà rempli).
- « ★ Une liste d'objets de chasse au trésor pour le niveau » : 4 cartes grises avec le nom de l'objet et un prix caché « $ ??? ».
  - Spokane : Gramophone Ancien, Projecteur rétro, Console de jeu d'armoire, télévision vintage.
  - Kennewick : Ordinateur tout-en-un [?], Motoneige avancée, Vélo de montagne, Bateau en bois.
- Ruban rouge « Récompenses de la chasse au trésor » avec un « i » : lingots ×2 et billets ×300 (carte violette).
- Bouton bleu « **⚡10** » et bouton vert « **🎬 GO! ⚡5** ». Interprétation : on entre pour 10 d'énergie, ou pour 5 d'énergie en regardant une pub.
- L'énergie est restée à 60/60 après la pub interrompue.

### G. Magasin de prêteurs sur gages (47,25 → 59,75 s)
**En-tête**
- Icône carrée (fiche client), titre « Magasin de prêteurs sur gages ».
- À droite, un portrait rond « **Manager** » (femme à lunettes de soleil roses).
- Lingots 298 + et billets + : seulement deux ressources, l'énergie n'apparaît pas.

**Décor**
- Mur de pierre, rayons de lumière, cadre de tableau doré à gauche.
- La **gérante rousse** (blazer bleu marine, collier de perles dorées, loupe à la main) derrière un comptoir de bois.

**Étagères** (2 colonnes, qui défilent)
- **Rangée du haut : 2 emplacements « ★VIP » dorés**, verrouillés et vides.
- Puis les objets exposés, chacun avec :
  - un portrait de client rond ;
  - une bulle blanche « Je veux acheter! » avec une liasse de billets ;
  - un bouton vert « Voir l'offre » avec une pastille rouge.
- Objets :
  - **Robot d'escorte**, quadrupède armé, acheteur : vieil homme en casque de chantier blanc ;
  - **vase noir et or** (ChampagneAsDePique), acheteuse : femme brune ;
  - **urne verte de bronze** (Urne ancienne du dragon divin), acheteuse : femme brune ;
  - **casque tactique à lunettes**, acheteuse : femme blonde à lunettes.
- Une case vide montre un « + » jaune et le texte « Ajouter des produits » (pastille rouge).

**Bas d'écran :** bouton « Client » (silhouette, pastille rouge) à gauche, bouton retour ↩ à droite.

**Popup d'offre** (même gabarit pour les trois objets)

| Objet | Prix (orange) | Rareté (icône + texte) | Fond de la carte | Prochaine offre | « Je te donne » | Nouvelle offre |
|---|---|---|---|---|---|---|
| Robot d'escorte | $2,548 | ⚙ Légendaire | orange/jaune | 01:59:16 (décompte) | **$4,255 [+66.9%]** | 6 lingots |
| ChampagneAsDePique | $2,376 | 🏆 Légendaire | orange/jaune | 00:59:09 | **$3,849 [+61.9%]** | 4 lingots |
| Urne ancienne du dragon divin | $2,481 | [icône ?] épopée | **rouge** | 02:29:05 | **$3,250 [+30.9%]** | 8 lingots |

- Le prix proposé est en gros chiffres verts, le pourcentage en vert dans des crochets.
- Bouton bleu « D'accord » et bouton jaune « [lingot] N Nouvelle offre ».

**CONGRATULATIONS après une vente**

| Vente | Grandes cartes | Prime De Secrétaire | Billets avant → après |
|---|---|---|---|
| Robot | 4,616 + EXP 5 | 42 + EXP 1 | 5.83K → 10.49K |
| Champagne | 4,176 + EXP 5 | 38 + EXP 1 | 10.49K → 14.71K |

---

## 3. Effets et « juice »

| Effet | Où | Détail | Durée |
|---|---|---|---|
| Billets qui tombent en tournoyant | Chargement | Billets verts autour du logo, en boucle | tout le chargement |
| Barre de chargement | Chargement | Remplissage jaune par paliers, puis attente barre pleine | 1,5 s + 1,1 à 1,9 s |
| Popup qui grossit (rebond) | Récompense, fiches de lieu, offres client | De 45-60 % à 100 % ; pour les fiches de lieu, dépassement puis retour | 0,1 à 0,3 s |
| Popup qui se réduit | Événements | Arrive trop grande puis se réduit | ≈0,25 s |
| Voile sombre en paliers | Calendrier → popup → Congratulations | Chaque couche assombrit un peu plus | instantané |
| **Faisceau doré et titre lumineux** | CONGRATULATIONS | Cône de lumière depuis le haut, halo doré autour des lettres, filets horizontaux | apparition en ≈0,75 s |
| Apparition des cartes en 3 temps | CONGRATULATIONS | Titre, puis sous-titre (+0,25 à 0,75 s), puis cartes et ✓ (+0,25 à 0,5 s) | ≈1 s en tout |
| ✓ lumineux | CONGRATULATIONS | Halo doré pulsant autour du bouton rond | en continu |
| **Pluie de billets** | Après ✓ | ≈30 à 40 liasses qui jaillissent du centre, s'éparpillent, puis montent en arc vers le compteur | 1,2 à 1,5 s |
| Pluie d'EXP | Après une vente | Cartes EXP vert d'eau qui volent vers le haut gauche | ≈1,3 s |
| Compteur de billets | HUD | **Saut immédiat** au nouveau total dès CONGRATULATIONS (aucun défilement vu, aucun « bump ») | 0 s |
| Entrée de l'offre pick-up | Offre | Anneau, puis véhicule qui glisse, puis bandeau-titre, étoiles grises qui se remplissent, puis pastille « Valeur 300% » | ≈1 s |
| Flamme « Chaud » | Bouton prix | Petite flamme sur la pastille rouge | fixe [?] |
| Carrousel « Limitée » | Colonne droite | Le portrait change | ≈toutes les 5 s [?] |
| Minuteur cadeau | Colonne droite | Décompte à la seconde | en continu |
| Ville vivante | Ville | Piétons et voitures ; étiquettes qui suivent le zoom | en continu |
| Chemin lumineux | Carte | Points jaunes brillants, halo doré sur le lieu actuel | fixe |
| Réorganisation des étagères | Magasin | L'objet vendu disparaît, sa case devient « Ajouter des produits », la liste défile toute seule | ≈0,5 s |

**Sons :** non audibles dans l'analyse. Sons probables : déclic de bouton, « ta-da » ou fanfare sur CONGRATULATIONS, cascade de pièces ou de billets pendant la pluie, « woosh » à l'ouverture des popups.

**Rythme :** la pluie de billets n'est **pas bloquante**. Le joueur peut ouvrir l'offre suivante pendant qu'elle passe, et elle continue par-dessus la nouvelle popup. Une vente complète prend ≈5 s (Voir l'offre → D'accord → CONGRATULATIONS → ✓).

---

## 4. Ce qui est nouveau ou différent par rapport à `BIDMASTER-VIDEO.md`

1. **Bonus caché d'environ 8,5 % sur toutes les recettes**, qui n'apparaît jamais à l'écran :
   - 900 → **976** (calendrier) ;
   - offre de $4,255 → **4,616** encaissés ;
   - offre de $3,849 → **4,176** encaissés.
   La source est sans doute le VIP ou le titre « Grand Capitaliste » [interprétation].
2. **Prime De Secrétaire ≈ 1 % de la somme de base**, plus 1 EXP : 9 pour 900, 42 pour 4,255, 38 pour 3,849.
3. **Chaque vente rapporte 5 EXP.** Le résumé parlait d'un « livre d'EXP » sans valeur ; la valeur est 5.
4. **Le calendrier de connexion est la popup automatique au lancement.** Le résumé décrivait une « carte violette 900 » seule.
   - Le vrai déroulé : calendrier de 28 jours, puis on touche la case du jour, puis la popup 900, puis CONGRATULATIONS.
   - Le calendrier écrit **« ciel »** au lieu de « jours ».
   - Le compteur des clés dépasse : **10/7**.
5. **L'ordre des popups est fixe et ne revient pas après réclamation.** Au 1er lancement : calendrier, pick-up, événements. Au 2e lancement : pick-up seul.
   - L'offre pick-up apparaît **à chaque lancement**.
   - Son vrai titre est « **Modification d'un pick-up** ». Elle contient le véhicule, 30 lingots et 5000 billets, et affiche « Valeur 300% ».
6. **La carte des enchères a au moins 3 régions**, et non une seule (Washington) :
   - Washington 1-5, **Californie 6-10**, **Texas 11-13+** ;
   - le joueur est à **San Antonio (13)** ;
   - il y a des lieux verrouillés à cadenas, et des étoiles spéciales dorées ou **argentées** ;
   - la carte s'ouvre sur la région en cours ; la numérotation monte vers le haut.
7. **Fiche d'un lieu**, que le résumé ne mentionnait pas :
   - « Enchère recommandée » ($600, $800), qui augmente avec le niveau ;
   - « Objectif : terminer 1 enchères » ;
   - liste de 4 objets de chasse au trésor à prix cachés « ??? » ;
   - récompenses (2 lingots + 300 billets) ;
   - **coût d'entrée en énergie : 10, ou 5 avec une pub**.
8. **Pub lancée volontairement** par le bouton « GO! » (pas de pub imposée à cet endroit). Le joueur l'a fuie par le sélecteur d'apps, et le jeu a redémarré à froid [?].
9. **Le magasin du prêteur a 2 emplacements VIP verrouillés**, en haut des étagères. Il a un bouton « Client », un portrait « Manager », et les étagères défilent.
10. **Le coût de « Nouvelle offre » varie** selon l'objet (4, 6 ou 8 lingots).
    - Le délai « Prochaine offre » varie aussi : 0:59, 1:59, 2:29.
    - Le bonus proposé varie de +30,9 % à +66,9 %.
11. **La couleur de rareté ne correspond pas à ce que disait le résumé** (« rouge = légendaire ») : dans cette minute, un objet **épique (« épopée ») a un fond rouge**, et les objets légendaires ont un fond orange/jaune.
12. **Nouveaux éléments du HUD :**
    - le cadeau à minuteur (09:39) ;
    - la tirelire « 800 » ;
    - « Gains sur crochet » avec « 1d 00:00:00 » ;
    - la carte « Tâche » avec une progression chiffrée (1,514/3,500) ;
    - « quêtes secondaires » ;
    - « Pack Temporaire » ;
    - l'icône « AD » barrée ;
    - le carrousel « Limitée ».
13. **Nouveaux bâtiments de la ville :** Bibliothèque, Hôtel « Chasse au… », jetée (yacht), Restaurant, Casino, Atelier de réparation, et « Secrétair[e] » [?]. La caméra se pilote au doigt (glisser et pincer).
14. **Les minuteurs des événements ne sont pas tous différents** : les 4 affichent **35d 06:52:31**, après un affichage « 00:00:00 » pendant ≈0,7 s.
15. **Le Robot d'escorte et les chiffres du résumé ont la même origine** : $2,548, +66.9 % et 01:59:14 sont confirmés. La vente est acceptée à 0:50.9, et le CONGRATULATIONS du résumé (« 0:50-1:05 ») est bien **celui de cette vente**, pas d'une récompense de connexion.
