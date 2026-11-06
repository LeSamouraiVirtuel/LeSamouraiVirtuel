# Bid Master : analyse image par image, minute 6 (6:00 à 6:52, fin de la vidéo)

Sources : 26 planches (une image toutes les 0,25 s), captures pleine résolution `sc/t6m*.jpg`, et images extraites avec ffmpeg (de 10 à 20 i/s) aux transitions de 6:00, 6:02, 6:04 et 6:16.
Les heures sont celles de la vidéo (m:ss.xx), à ±0,1 s près. **[?]** marque ce qui est illisible ou déduit sans être visible. Le doigt du joueur n'apparaît jamais (pas d'indicateur de toucher sur iOS) : l'endroit touché se déduit de l'écran qui s'ouvre.

État du compte au début de la minute : niveau 19, « Grand Capitaliste », énergie 50/60, lingots 309, billets 528.
À la fin : énergie 110/60, lingots 310, billets 2.17K.

---

## 1. Chronologie

### A. Fin de l'enchère : écran « charger la voiture » (6:00 – 6:02.3)
- **5:59.3 – 5:59.9** : écran de chargement après l'enchère gagnée. En haut, une illustration : une citadine rouge sportive (style R5 Turbo, plaque illisible) garée devant un bâtiment de briques, et à gauche une pile de 3 cartons. En dessous, trois onglets : **tous** (jaune, actif), **identification** (avec une pastille rouge), **réparation**. Le bandeau dit « Veuillez cliquer pour sélectionner les éléments que vous devez emporter **0/4** ». Un seul objet est affiché : la carte rouge « Statue de la danseuse du vent », **$5,208**, avec une icône socle en haut à gauche et une loupe en haut à droite (objet à identifier). Grand bouton jaune en bas : « Rapportez-le à l'entrepôt ».
- **≈ 6:00.0** : **le joueur touche la carte.** Elle s'assombrit (filtre brun), une **grande coche verte** apparaît au centre, et le compteur passe à **1/4** (« 1 » en jaune).
- **6:00.0 – 6:00.9** : **animation de chargement.** Un carton se détache de la pile, monte et vole vers la voiture ; il passe en semi-transparence au-dessus du coffre (6:00.5) ; à 6:00.75, deux cartons sont posés sur la lunette arrière, puis ils disparaissent dans la voiture. Pendant ce temps, la coche verte se transforme en un rectangle blanc, puis en tampon gris « **accepter** » posé en travers de la carte (≈ 6:00.75 – 6:01.0). Durée totale : environ 0,9 s.
- **≈ 6:01.1 – 6:01.2** : **la voiture démarre** et sort par la droite en environ 0,15 s (on la voit en mouvement à mi-écran sur une image, puis la route est vide). Il ne reste que la pile de cartons et le décor.
- **6:01.2 – 6:02.3** : écran immobile (route vide, carte « accepter »).
- **≈ 6:02.3** : **le joueur touche « Rapportez-le à l'entrepôt »** [?] (la touche n'est pas visible, mais l'écran change aussitôt). Coupure franche, sans fondu, vers la ville avec la popup « retour de voiture » déjà ouverte. La popup fait un léger « pop » : elle est un peu plus grande sur la première image, puis se stabilise en environ 0,1 s.

### B. Popup « retour de voiture » (6:02.3 – 6:04.0)
- Ville assombrie en fond. Titre « retour de voiture » sur un bandeau orange-or, croix blanche à droite.
- Ligne de minuteur : réveil + « **00:13** », puis « 00:12 » à 6:03.25 ; barre de progression bleu ciel presque vide sur fond bleu nuit, qui avance lentement.
- Texte : « Changez ou améliorez votre voiture pour revenir plus rapidement ».
- Scène animée : route isométrique en diagonale, bordée de haies, terre-plein et pointillés. La petite voiture rouge roule dessus et se décale légèrement d'une image à l'autre (sur place, en roulant).
- Bouton jaune : icône lingot, « **1** », « Retour Accéléré ».
- **≈ 6:04.0** : **le joueur ferme la popup** (croix [?]). Elle disparaît d'un coup, sans animation de sortie, et la ville s'affiche en pleine lumière.

### C. Ville, puis Ligue des guildes (6:04.0 – 6:06.2)
- **6:04.0 – 6:04.9** : ville (voir l'inventaire en 2.3). Au-dessus de l'Entrepôt : icône voiture, barre bleue et **00:12 → 00:11** (le retour de la voiture continue). La vignette « Limitée » en haut à droite **change de personnage** à 6:04.5 (la femme pirate rousse devient un jeune marin) : c'est un carrousel.
- **≈ 6:04.95** : **le joueur touche l'icône trophée « S »** de la colonne de droite [?] (déduit : l'écran qui s'ouvre porte le même trophée). Coupure franche vers la Ligue des guildes.
- **6:04.95 – 6:05.2** : **écran d'erreur de chargement.** Fond diagonal bleu/rouge, titre fantôme « Saison %s · Ligue des guildes » : on voit la **variable de format non remplie**, un bug d'affichage. Au centre, une planète grise à anneau avec une icône wifi et un cercle de points (indicateur de chargement), et le texte « **Échec de l'extraction des données, quittez et ré essayez** ». En bas : « Description de l'événement », « Temple de la renommée » et le bouton retour ⮌ (estompés).
- **6:05.25** : les données arrivent, sans que le joueur ait rien fait. Titre « **Saison S13 · Ligue des guildes** », « Temps restant de l'événement : **0d 00:00:00** ».
- **6:06.0** : le minuteur se corrige en « **36d 11:46:34** ».
- **≈ 6:06.2** : **le joueur touche ⮌** (en bas à droite) et revient à la ville. Coupure franche.

### D. Ville : la caméra glisse (6:06.2 – 6:08.4)
- **6:06.25 – 6:07.75** : **le joueur fait glisser la carte** vers le haut et la gauche : on découvre le **Musée** (étiquette « Musée » avec une icône colonnes) et le **Magasin de voitures** (étiquette avec un personnage en costume). Le défilement est fluide et s'arrête avec un léger amorti. Une icône ronde « groupe » avec « 0/5 » apparaît au-dessus d'un immeuble (appartements).
- Un **« ! » rouge** apparaît à côté de l'étiquette « Prêteur sur gages » (≈ 6:07.5) : il y a une action à faire au prêteur.
- Le compteur de la voiture-dollar en bas à droite passe de **00:02:30 à 00:02:40** (≈ 6:07.25).
- Des passants se déplacent dans les rues : une femme en rouge près de l'Entrepôt, un vieil homme en costume.
- **≈ 6:08.4** : **le joueur touche le widget « Tâche »** (en bas à gauche). La popup s'ouvre en grandissant (6:08.5 : plus grande et plus haute) puis se pose (6:08.75), en environ 0,3 s.

### E. Popup « Tâche du Chapitre Vingt-six » (6:08.4 – 6:10.4)
- Inventaire en 2.5. Le bouton « **Prime du marché noir** » (coffre à pièces) apparaît en bas à gauche, **par-dessus** le voile sombre.
- **6:09.75** : la liste descend d'environ 40 px, puis remonte (le joueur la tire vers le bas [?], effet élastique).
- **≈ 6:10.4** : **le joueur ferme** (croix). Retour immédiat à la ville.

### F. Ville, glissement vers le haut (6:10.4 – 6:12.4)
- **6:11.0 – 6:11.5** : **le joueur fait glisser la carte vers le bas** (la caméra monte) : le haut de la ville est couvert d'un **brouillard noir et blanc en dents de scie** (zone verrouillée). Une étiquette « ...opole » (Métropole) et un panneau doré triangulaire apparaissent en haut à gauche.
- Le minuteur de la voiture tombe à **00:04** (6:11.5).

### G. Calendrier de connexion, rattrapage et récompense (6:12.4 – 6:21.4)
- **≈ 6:12.4** : **le joueur touche l'icône calendrier** (2ᵉ de la colonne de gauche). Le carnet s'ouvre avec un léger zoom (6:12.5, un peu plus grand) puis se pose (6:12.75).
- **6:13.0** : animation d'entrée : le carnet glisse de 15 à 20 px vers la gauche puis revient.
- **6:14.0 – 6:15.0** : **le joueur fait défiler la grille** vers le haut (jours 17 à 23 visibles), puis la ramène vers le bas.
- **≈ 6:15.4** : **le joueur touche la case « Rattrapage »** (jour 21 : éclair 60 + billets 1,500). Une petite popup « **Rattrapage** » s'ouvre en zoom : petite à 6:15.43, à sa taille finale à 6:15.5. Dedans, deux cartes violettes (éclair **60**, billets **1,500**) et un bouton jaune « lingot **1** · **commence** ».
- **≈ 6:16.1** : **le joueur touche « commence »**. Coupure franche vers l'écran CONGRATULATIONS.
- **6:16.25** : le titre doré « **CONGRATULATIONS** » apparaît (lettres espacées, lueur dorée), avec un **faisceau de lumière** qui descend du haut de l'écran.
- **6:16.5** : le sous-titre « Félicitations pour l'obtention » apparaît, encadré de deux filets horizontaux.
- **6:17.0** : les cartes de récompense apparaissent en fondu (encore translucides) : éclair **60**, billets **1,627**. Une icône « i » se trouve en haut à gauche. En dessous, l'étiquette « Prime De Secrétaire » et une carte billets **15**.
- **6:17.25** : les cartes sont pleinement opaques et le bouton rond « ✓ » apparaît (gris foncé, entouré d'un halo doré).
- **≈ 6:17.6** : **le joueur touche ✓**. Retour au calendrier.
- **6:17.75** : le HUD est **déjà à jour** (énergie **110/60**, lingots **308**, billets **2.17K**), avant même l'arrivée des particules. Le calendrier affiche « **18** ciel Connecté » et la barre de clés « **(11/7)** ».
- **6:17.75 – 6:19.25** : **les icônes s'envolent** (voir 3). Des dizaines de petits éclairs bleus et de liasses de billets jaillissent du milieu du carnet, s'éparpillent en gerbe (6:18.0 – 6:18.25), puis filent en arc vers le haut : les éclairs vers la jauge d'énergie à gauche, les billets vers le compteur de billets à droite (6:18.5 – 6:19.25). Durée : environ 1,5 s.
- **6:19.25 – 6:21.25** : **le joueur fait défiler la grille jusqu'en haut** (jours 1 à 7 visibles à 6:20.5), puis la redescend un peu.
- **≈ 6:21.4** : **le joueur ferme** (croix). Retour à la ville.
- Pendant que la popup était ouverte, la voiture est revenue : à 6:21.5, **la petite voiture rouge est garée** devant l'Entrepôt et le Pawn Shop, et la barre de minuteur a disparu.

### H. Boutique (6:23.4 – 6:26.2)
- **≈ 6:23.4** : **le joueur touche l'onglet « boutique »** dans la barre du bas. Coupure franche ; l'onglet s'éclaire en jaune.
- Inventaire en 2.8. Rien ne bouge, sauf un reflet lumineux sur les lingots du « Forfait ».
- **≈ 6:26.2** : **le joueur touche l'onglet « Ville »**. Retour à la ville, décalée d'une colonne au premier affichage (6:26.25), puis recadrée (6:26.5).

### I. Ville, puis « Dollars gratuits » (6:26.2 – 6:29.7)
- **6:27.25** : le compteur de la voiture-dollar passe à **00:03:00**.
- **≈ 6:29.0** : **le joueur touche l'icône billets** (3ᵉ de la colonne de gauche, avec une pastille rouge). La popup « **Dollars gratuits** » s'ouvre avec un zoom (plus grande à 6:29.0, posée à 6:29.25).
  - Texte : « Regardez l'annonce pour obtenir ».
  - Carte violette billets **300**.
  - Bouton vert avec une icône clap de cinéma : « Recevoir ».
- **≈ 6:29.7** : **le joueur ferme** (croix) **sans regarder la pub**.

### J. Pass de niveau (6:31.1 – 6:40.4)
- **≈ 6:31.1** : **le joueur touche une icône de la colonne de gauche** [?] (probablement l'hexagone à étoile, 5ᵉ icône). La popup « Lv. 19 » apparaît un peu plus bas (6:31.25) et remonte se poser (6:31.5).
- **6:31.75** : **la conseillère rousse** (robe bustier argentée, grandes boucles d'oreilles) **entre en fondu** depuis le bord gauche, devant la liste. Le texte « Astuce » apparaît en bas.
- **6:32.5** : une **bulle de dialogue** blanche apparaît à côté d'elle (voir 2.10).
- **6:32.0 – 6:34.0** : **le joueur fait défiler l'échelle vers le bas**, du niveau 4 au niveau 30. Les niveaux 1 à 19 ont un fond coloré (violet et or) ; à partir du niveau 20, les cases sont **grises et désaturées**, et la ligne centrale passe du jaune au gris.
- **6:34.25 – 6:35.75** : **défilement vers le haut** jusqu'à la ligne du niveau 19, la ligne actuelle, mise en évidence : fond plus clair, coche verte sur la récompense ordinaire **350**, losange 19 jaune.
- **6:36.5 – 6:39.75** : nouveau défilement vers le bas jusqu'à 30, avec un rebond en fin de liste (6:38.25 → 6:38.5).
- **6:37.5** : en fond, le compteur de la voiture-dollar passe à **00:03:10**.
- **≈ 6:40.4** : **le joueur ferme** (croix). Retour à la ville.

### K. Coffret cadeau (6:41.4 – 6:44.9)
- **≈ 6:41.4** : **le joueur touche l'icône cadeau rose** (2ᵉ de la colonne de droite [?]).
- **6:41.5** : voile sombre, puis **la présentatrice blonde** (corset violet, nœud et gants noirs) **et le titre** « Coffret cadeau » apparaissent en premier, avec une lueur rouge-rose derrière. Texte : « Salut, chérie, peux-tu m'acheter quelque chose ? ». En haut à gauche, une case or « lingot **1** » avec une pastille rouge : le **cadeau gratuit**.
- **6:42.0** : **les offres apparaissent une par une**, à 0,25 s d'intervalle : 1ʳᵉ arche bleue (6:42.0), 2ᵉ arche bleue (6:42.25), 3ᵉ arche rouge avec « **meilleur choix!** » en jaune (6:42.5).
- **≈ 6:42.6** : **le joueur touche le lingot gratuit**. Écran CONGRATULATIONS (même enchaînement qu'en G : titre à 6:42.75, sous-titre à 6:43.0, carte lingot **1** et « Prime De Secrétaire » lingot **1** à 6:43.5, bouton ✓ à 6:43.75).
- **≈ 6:43.9** : **le joueur touche ✓**. Retour au coffret : le lingot gratuit porte maintenant une **coche verte**, et le HUD passe à **310 lingots** (308 + 1 + 1 de prime).
- **6:44.0 – 6:44.75** : un **lingot doré** traverse l'écran en diagonale, de haut en bas, en scintillant au passage sur les offres ; c'est un reflet décoratif ou le vol du lingot [?]. Le bandeau « Achetez trois packs en un seul clic » est maintenant affiché en bas.
- **≈ 6:44.9** : **le joueur ferme** (croix). Retour à la ville.

### L. Sortie du jeu et fin de l'enregistrement (6:45 – 6:51.9)
- **6:45 – 6:47.0** : ville au repos. Le minuteur cadeau passe de 03:33 à 03:31.
- **≈ 6:47.1** : **le joueur glisse vers le haut depuis le bas de l'écran** (geste « accueil » d'iOS). Une image noire (6:47.25), puis une **illustration de ville façon bande dessinée** (immeubles de briques, gratte-ciel, cumulus sur ciel turquoise), qui sert d'image de mise en arrière-plan du jeu. Elle se réduit en carte arrondie (6:48.25), puis en vignette (6:48.5).
- **6:48.75 – 6:49.25** : écran d'accueil de l'iPhone (16:14, batterie 18 %). L'icône **Bid Master** est en 4ᵉ colonne, 5ᵉ ligne.
- **6:49.5 – 6:50.25** : sélecteur d'apps : la carte « Bid Master » montre cette même ville BD, puis le joueur fait défiler vers l'app Horloge (« Minuteurs », minuteur de 1:16:00).
- **6:50.5 – 6:50.75** : retour à l'accueil.
- **6:51.0 – 6:51.5** : **centre de contrôle** (Orange F, 18 %, pastille rouge d'enregistrement). Le joueur arrête l'enregistrement d'écran.
- **≈ 6:51.9** : fin de la vidéo.

---

## 2. Inventaire des écrans

### 2.1 Écran « charger la voiture » (après l'enchère)
- **Haut (40 %)** : illustration fixe. Façade de briques, pelouse, trottoir pavé, voiture rouge vue de trois quarts arrière, pile de 3 cartons à gauche.
- **Onglets** (marron, texte beige, l'actif en jaune) : « tous » | « identification » (pastille rouge) | « réparation ».
- **Bandeau en forme de flèche** : « Veuillez cliquer pour sélectionner les éléments que vous devez emporter » suivi de « 0/4 », puis « 1/4 », en jaune.
- **Grille** (3 colonnes, fond beige) : carte rouge de légendaire, socle en haut à gauche, loupe en haut à droite, statue sur fond rayonnant, nom sur 2 lignes, bandeau « $ » + prix en or.
- **Bas** : bandeau marron foncé et gros bouton jaune dégradé « Rapportez-le à l'entrepôt ».
- **Ce que ça apprend** : la voiture a une **capacité de 4 objets par trajet**, et c'est le joueur qui choisit ce qu'il charge. Les lots non chargés restent sur place [?]. Le trajet de retour dure un temps réel (13 s ici), affiché sur la carte.

### 2.2 Popup « retour de voiture »
- **Modèle commun à toutes les petites popups** : bandeau titre orange-or avec texte blanc ombré, croix blanche, corps beige clair, bordure inférieure hachurée.
- **Contenu** : minuteur + barre ; texte de conseil ; scène animée ; bouton payant « 1 lingot · Retour Accéléré ».
- **Ce que ça apprend** : la voiture est un **objet qu'on améliore**, et sa vitesse règle le temps de retour. On peut payer 1 lingot pour finir tout de suite.

### 2.3 HUD de la ville (permanent)
- **Haut à gauche** : portrait (blonde) dans un cadre doré, badge **19**, puis « VIP » (gris, inactif) et la pilule verte « $ Grand Capitaliste ».
- **Ressources** : éclair « 50/60 » + bouton « + » orange avec une pastille rouge, et au-dessus « (00:45 +1) » (00:45 en blanc, +1 en vert : **compte à rebours avant le prochain point d'énergie**) ; lingot « 309 » + « + » ; billets « 528 » + « + ». Au-dessus de 60/60 (110/60), **la ligne du minuteur disparaît**.
- **Sous les ressources** : enveloppe rouge (courrier) et roue crantée (réglages).
- **Colonne de gauche** (icônes rondes sur fond translucide) :
  1. « Pack Temporaire » (personnage en rouge, cadre doré) ;
  2. calendrier avec une coche ;
  3. liasse de billets (pastille rouge) ;
  4. « AD » barré (anti-pub) ;
  5. hexagone à étoile dorée ;
  6. échoppe à auvent rayé, étiquette tronquée « ...commerci... » (pastille rouge) ;
  7. Facebook ;
  8. camion ;
  9. chevron « ^ » (replier la colonne).
- **Colonne de droite** :
  1. « Limitée », portrait en carrousel (femme pirate rousse ↔ jeune marin), pastille rouge ;
  2. boîte cadeau rose avec des confettis (pastille rouge) ;
  3. trophée doré « S » (pastille rouge) ;
  4. coffre d'or à rubans rouges ;
  5. cadeau vert avec un minuteur « **04:14** » qui descend en temps réel ;
  6. tirelire cochon dorée avec une étiquette lingot « **800** » (pastille rouge) ;
  7. pick-up gris-vert ;
  8. homme au chapeau noir (pastille dorée) ;
  9. chevron « ^ ».
- **Bas à gauche** : téléphone doré « quêtes secondaires » et widget **Tâche** (presse-papiers violet avec un « ! », point d'interrogation rouge), avec le texte « Participez à des ventes aux enchères de San Antonio niveaux et gagnez 3,500 de dollars (1,514/3,500) ».
- **Bas à droite** : voiture blanche et rond rouge « $ », compteur « 00:02:30 » qui **augmente par paliers de 10 s** environ toutes les 10 s (2:30, puis 2:40 à 6:07, 2:50 à 6:17, 3:00 à 6:27, 3:10 à 6:37). Rôle inconnu [?].
- **Barre d'onglets du bas** :
  - « Ville » (carte isométrique, active, fond jaune) ;
  - « boutique » (échoppe, pastille rouge) ;
  - « Rôle » (carte à jouer) ;
  - « corporation » (bouclier violet) ;
  - « Métropole » (immeuble rose, cadenas) ;
  - « enchères » (gros marteau doré qui dépasse de la barre, petit badge presse-papiers).
- **Sur la carte** : étiquettes sombres avec une icône (Entrepôt, Prêteur sur gages, Serrurier, Musée, Magasin de voitures, ...commercial), immeuble « 0/5 » avec une icône groupe, brouillard noir et blanc en haut (zone Métropole), passants animés, voitures garées.

### 2.4 Ligue des guildes (Saison S13)
- **Fond** en diagonale : bleu à gauche, rouge et rose à droite. Rayon lumineux oblique et confettis qui tombent en continu (losanges verts, jaunes, bleus).
- **Titre** : trophée « S » à rubans violets, « Saison S13 · Ligue des guildes », « Temps restant de l'événement : 36d 11:46:34 ».
- **Podium**, trois arches :
  - n° 2 « Пантеон » (blason étoile beige), **$8.01B**, cadeau violet ;
  - n° 1 « TOP ELITES » (arche dorée, plus haute), **$20.71B**, cadeau rouge à étoiles ;
  - n° 3 « Saint-P », **$7.97B**, cadeau bleu.
- **Classement** (lignes lilas, numéro sur fond gris foncé, blason, nom, liasse, montant en brun-or, cube cadeau vert à droite) :

  | Rang | Guilde | Montant |
  |---|---|---|
  | 4 | Кальянокури | $6.21B |
  | 5 | Renaissance | $5.01B |
  | 6 | NL Lions 2 | $4.61B |
  | 7 | SLACKERS | $4.55B |
  | 8 | Active | $4.34B |
  | 9 | ITALIANO VERO | $4.03B |

- **Ligne du joueur** (fond jaune pâle) : **2608** MANIFEST **$3.33M**.
- **Bas** : « Description de l'événement », « Temple de la renommée », « Défis saisonniers », bouton retour ⮌ encadré.
- **Ce que ça apprend** : le classement des guildes se fait sur **l'argent gagné** (en milliards), par saisons d'environ 5 semaines. Il y a des récompenses par rang, et des milliers de guildes internationales (noms russes, néerlandais, italiens).

### 2.5 Tâche du Chapitre Vingt-six
- **En-tête** : rideau de théâtre rouge, titre « Tâche du Chapitre Vingt-six » entre deux losanges, médaillon solaire « **3/4** », barre jaune aux 3/4, trois récompenses : billets **400** (violet), lingots **2** (or), livre EXP **10** (bleu). Sous-titre « Récompense pour l'achèvement ».
- **Liste** (cartes blanc cassé, titre en orange) :
  1. « Participez à des ventes aux enchères de San Antonio niveaux et gagnez 3,500 de dollars », **1,514/3,500** (en rouge), barre à 43 %, récompenses billets 50 + EXP 2, **bouton bleu « Aller à »** ;
  2. « Effectuer 2 tirages de manager » : lingot 1 + EXP 2, **gros tampon coche doré** ;
  3. « Exposer 4 d'objets dans un musée » : lingot 1 + EXP 2, tampon ;
  4. « Évaluer 1 d'objets » : billets 50 + EXP 2, tampon.
- **Ruban du bas** : couronne, « Mon objectif : être l'homme le plus riche du monde ».
- **Ce que ça apprend** : la progression est découpée en **chapitres numérotés** (26 ici) de 4 tâches qui couvrent toute la boucle (enchère, tirage de manager, musée, expertise). Chaque tâche rapporte un peu, et le chapitre complet rapporte un bonus. Le bouton « Aller à » mène directement à l'endroit concerné.

### 2.6 Calendrier de connexion « 28 ciel »
- **Carnet à spirales** (3 anneaux, signet rouge), fond papier.
- **En-tête** : « **28** ciel » en gros chiffres rouge-brun, « Récompense de connexion » ; à droite « **17** ciel Connecté », puis 18. « ciel » est une **traduction ratée** de « jours » (天 en chinois veut dire « jour » et « ciel »).
- **Grille de 3 colonnes.** Une case grise avec une coche orange = déjà reçue. Une case blanche = à venir. Une case à bandeau orange « **Rattrapage** » = jour manqué, rattrapable contre de l'or. Une étiquette jaune inclinée « **Récompenses exclusives!** » marque les jours spéciaux, et certains jours prennent deux cases de large.
- **Contenu vu** :

  | Jour | Récompense | État |
  |---|---|---|
  | 1 | 200 | ✓ |
  | 2 | lingots 9 + 300 | ✓, exclusif |
  | 3 à 6 | 400, 500, 600, 700 | Rattrapage |
  | 7 | voiture violette « SSS » ×1 + 1,999 | ✓ |
  | 8 | 300 | Rattrapage |
  | 9 | chaussure 5 + lingots 5 | ✓, exclusif |
  | 10, 11 | 600, 700 | Rattrapage |
  | 12 | 800 | ✓ |
  | 13 | 900 | ✓ |
  | 14 | objet rose (tissu ?) 20 + 1,000 | ✓ |
  | 15 | 500 | ✓ |
  | 16 | tomate 20 + lingots 10 | ✓, exclusif |
  | 17, 18, 19 | 700, 800, 900 | ✓ |
  | 20 | 1,000 | ✓ |
  | 21 | éclair 60 + 1,500 | d'abord « Rattrapage », puis reçu ✓ |
  | 22 | 600 | ✓ |
  | 23 | calculatrice 5 + lingots 15 | ✓, exclusif |
  | 24, 25 | 800, 900 | ✓ |
  | 26 | 1,000 | blanc, non coché |
  | 27 | 1,100 | blanc |
  | 28 | morceau de portrait (puzzle, brune) 50 + 2,000 | blanc |

- **Pied** (bandeau brique) : 6 clés dorées sur une tige, coffre violet et or au bout, « Connectez-vous en continu pendant **7** jours pour ouvrir le mystérieux coffre au trésor ! », « (10/7) » puis « (11/7) ».
- **Popup Rattrapage** : petite popup standard, deux cartes violettes et un bouton or « 1 lingot · commence ».
- **Ce que ça apprend** :
  - les jours manqués ne sont pas perdus : **chacun se rattrape pour 1 lingot** ;
  - rattraper un jour compte comme une connexion (17 → 18 connectés, série 10/7 → 11/7) ;
  - les récompenses montent régulièrement de 100 en 100 sur une semaine (600 → 1,100), avec des pics « exclusifs » (outils comme la calculatrice, la chaussure, la tomate, ou un fragment de personnage) ;
  - le jour 28 donne un fragment de personnage, et le jour 7 une voiture rare « SSS ».

### 2.7 CONGRATULATIONS (version courte)
- Fond noir translucide par-dessus l'écran précédent (encore visible en dessous), faisceau doré qui descend du haut.
- Titre « CONGRATULATIONS » en capitales dorées lumineuses, sous-titre « Félicitations pour l'obtention » entre deux filets.
- Icône « i » en haut à gauche du bloc de récompenses.
- Cartes carrées à fond violet (billets, énergie) ou orange (lingot), quantité en blanc en bas à droite.
- « Prime De Secrétaire » : pilule sombre à texte or, avec une seule petite carte bonus en dessous.
- Bouton rond « ✓ » gris anthracite, cerclé, avec un halo.
- **Chiffres** :
  - rattrapage : 1,500 billets annoncés, **1,627** reçus (environ +8,5 %, bonus dont l'origine n'est pas affichée [?]), plus 15 de prime de secrétaire ;
  - coffret : lingot 1 + prime 1 lingot.
  - Les comptes tombent juste : 528 + 1,627 + 15 = 2,170 (« 2.17K ») et 50 + 60 = 110.

### 2.8 Boutique, onglet VIP
- **Onglets** : « VIP » (jaune, actif), « coffret cadeau » (pastille rouge), « Monnaie Rare », « billet de banque ». Sous les onglets, un **lambrequin d'auvent** festonné beige et brun.
- Icône « ? » (bulle et point d'interrogation dorés) en haut à gauche.
- **Carte VIP 7 jours** (bleu et violet, inclinée, au second plan) :
  - ruban rouge « valeur 1500% » ;
  - avantages : « L'énergie maximale est de 90 », « VIP · Ajouter 2 emplacements de prêteur sur gages », « SPEED X2 », « 2x expérience », « 30 fois par jour · Aller aux annonces » (AD barré, c'est-à-dire sauter les pubs) ;
  - bouton orange « **$9.99** /7 jours ».
- **Carte VIP 30 jours** (orange, au premier plan) :
  - ruban violet « valeur 3000% » ;
  - mêmes avantages, avec « 50 fois par jour » ;
  - « **$19.99** /30 jours ».
- Même illustration sur les deux cartes : jeune femme blonde, casquette, chemise blanche.
- **Bandeau « Forfait cadeau de connexion de 7 jours »** : pastille verte « 25% Rabais », « Peut être collecté tous les jours pendant sept jours consécutifs », lingots **110** + billets **16,200**, illustration d'un coffre de lingots et billets, bouton **vert** « **$5.99** ».
- Bouton « Magasin d'accessoires » (coffret à icône anti-pub) en bas à gauche.
- **Ce que ça apprend** : le VIP augmente l'énergie maximale (60 → 90), ajoute des emplacements au prêteur, double la vitesse et l'EXP, et permet de sauter les pubs (30 ou 50 fois par jour).

### 2.9 Popup « Dollars gratuits »
- Popup standard : « Regardez l'annonce pour obtenir », carte billets **300**, bouton vert « clap · Recevoir ».
- **Ce que ça apprend** : de l'argent gratuit contre une pub, accessible depuis une icône permanente avec une pastille rouge.

### 2.10 Pass de niveau
- **Médaille hexagonale** dorée à ailes : « Lv. **19** ».
- **En-tête** : « Débloquez le pass pour l'obtenir » avec 3 récompenses cadenassées (billets **8,000**, lingots **50**, portrait puzzle rousse **30**) ; « Mettez à niveau pour obtenir plus de récompenses » ; ~~$99.99~~ en rouge barré ; gros bouton jaune **$17.99** ; rond rouge « **-80%** off » ; libellés de colonnes « ordinaire » / « Pass Premium ».
- **Échelle** : losanges numérotés sur une tige centrale (jaune jusqu'au niveau atteint, grise ensuite).
  - Colonne gauche (gratuite, une case violette par niveau) : 50 aux niveaux 1-3 ; 100 aux niveaux 4-8 ; 150 au 9 ; 200 aux 10-12 [?] ; 250 au 13 ; 300 aux 16-17 ; 350 aux 19-21 ; 400 aux 22-24 ; 450 aux 25-27 ; 500 aux 28-29 ; niveau 30 [?].
  - Colonne droite (Premium, 2 cases cadenassées par niveau), billets + lingots :

    | Niv. | Prime | Niv. | Prime | Niv. | Prime |
    |---|---|---|---|---|---|
    | 1 | 500 + 5 | 11 | 1,600 + 10 | 21 | 2,600 + 10 |
    | 2 | 600 + 5 | 12 | 1,700 + 10 | 22 | 2,700 + 10 |
    | 3 | 700 + 5 | 13 | 1,800 + 10 | 23 | 2,800 + 10 |
    | 4 | 800 + 5 | 14 | 1,900 + 10 | 24 | 2,900 + 10 |
    | 5 | 900 + **chaussure 10** | 15 | [?] + objet rose 20 | 25 | 3,000 + **tomate 20** |
    | 6 | 1,000 + 5 | 16 | 2,100 + 10 | 26 | 3,200 + 10 |
    | 7 | 1,100 + 5 | 17 | 2,200 + 10 | 27 | 3,400 + 10 |
    | 8 | 1,200 + 5 | 18 | 2,300 + 10 | 28 | 3,600 + 20 |
    | 9 | 1,300 + 5 | 19 | 2,400 + 10 | 29 | 4,000 + 20 |
    | 10 | 1,500 + **portrait 20** | 20 | 2,500 + **portrait 30** | 30 | **9,999 + portrait 50** |

  - Les récompenses gratuites déjà reçues portent une **coche verte** ; les niveaux non atteints sont en gris.
- **Conseillère rousse** avec une bulle : « Cher client, engagez-moi, je peux vous aider à améliorer le succès de l'identification des articles et la probabilité d'identification comme étant authentiques. »
- **Astuce** en bas : « Après avoir débloqué le pass, vous pouvez débloquer le personnage dans l'interface « Personnage » et le mettre à l'université pour rendre ses compétences efficaces. »
- **Ce que ça apprend** : le pass suit le **niveau du joueur** (et non une saison). Le personnage-récompense est une **experte** qui augmente les chances de réussir une expertise et de tomber sur un objet authentique. Les personnages ont des compétences, qu'on améliore à l'« université ».

### 2.11 Coffret cadeau
- **Présentatrice blonde** en corset violet, en grand à droite. Titre orange « Coffret cadeau », « Salut, chérie, peux-tu m'acheter quelque chose ? ». Case gratuite « lingot 1 » (pastille rouge, puis coche verte).
- **Trois arches** (« Limite d'achat » en haut, « (0/1) » en bas) :

  | Arche | Contenu | Prix |
  |---|---|---|
  | Bleue | 3,000 billets, 20 lingots, chaussure 6 | ~~5.99~~ **$1.99** |
  | Bleue | 12,000 billets, 85 lingots, éclair 60, tomate 15 | ~~19.99~~ **$5.99** |
  | Rouge, « meilleur choix! » | 90,000 billets, calculatrice 25, 180 lingots, tomate 30, éclair 120, objet rose 50, chaussure 25 | ~~49.99~~ **$12.99** |

- **Bandeau rouge** : « Achetez trois packs en un seul clic. L'achat en un clic bénéficie d'une remise spéciale de « 80% de réduction » ! », ~~$20.99~~ → **$16.99**.
- **Ce que ça apprend** : on donne **1 lingot gratuit par jour** pour amener le joueur devant les offres. Chaque pack ne s'achète qu'une fois, et il existe un lot des trois. Les consommables (calculatrice, chaussure, tomate, objet rose) sont des outils d'enchère ou de mini-jeux [?].

---

## 3. Effets et « juice »

| Moment | Effet | Durée |
|---|---|---|
| 6:00.0 | Coche verte sur la carte, assombrissement, compteur 0/4 → 1/4 | instantané |
| 6:00.0 – 6:00.9 | Le carton vole de la pile à la voiture (arc, semi-transparent), puis la coche se change en tampon « accepter » | ≈ 0,9 s |
| 6:01.1 | La voiture accélère et sort par la droite | ≈ 0,15 s |
| 6:02.3, 6:08.4, 6:12.4, 6:15.4, 6:29.0 | Popups qui s'ouvrent en zoom avec un rebond (un peu trop grandes, puis taille finale) | 0,1 – 0,3 s |
| 6:02 – 6:04 | Petite voiture qui roule sur une route isométrique, barre de minuteur qui avance | continu |
| 6:04.5 | Carrousel de portraits sur l'icône « Limitée » | quelques secondes par portrait |
| 6:05 – 6:06 | Ligue : confettis qui tombent, rayon lumineux oblique, scintillement sur le titre | continu |
| 6:05.0 | Chargement : points en cercle autour de la planète, icône wifi | ≈ 0,25 s ici |
| 6:06 – 6:08, 6:11 | Défilement de la carte à l'inertie, avec amorti | ≈ 0,5 s |
| 6:16.25 – 6:17.25 | CONGRATULATIONS en cascade : faisceau + titre, puis sous-titre (+0,25 s), cartes en fondu (+0,75 s), bouton ✓ (+1 s) | ≈ 1 s avant de pouvoir valider |
| 6:17.75 – 6:19.25 | **Pluie d'icônes** : des dizaines d'éclairs et de liasses jaillissent en gerbe du centre puis volent en arc vers le HUD (énergie à gauche, billets à droite). Le compteur est mis à jour d'un coup, sans défilement des chiffres. | ≈ 1,5 s |
| 6:23 – 6:26 | Reflet qui balaie la pile de lingots du forfait | en boucle |
| 6:31.75 / 6:32.5 | La conseillère entre en fondu depuis la gauche, puis sa bulle apparaît | 0,25 s + 0,75 s |
| 6:32 – 6:40 | L'échelle du pass défile : couleurs jusqu'au niveau atteint, gris ensuite ; rebond en bout de liste | — |
| 6:41.5 – 6:42.5 | Coffret : la présentatrice et le titre d'abord, puis les arches une par une, à 0,25 s d'intervalle | ≈ 1 s |
| 6:44.0 – 6:44.75 | Un lingot scintillant traverse les offres en diagonale | ≈ 0,75 s |
| Partout | Pastilles rouges sur les icônes, passants animés dans la ville, minuteurs qui défilent à la seconde | continu |

**Sons supposés** (aucun son n'est exploitable, ce sont des déductions) : « clac » au tampon « accepter », moteur au départ de la voiture, fanfare sur CONGRATULATIONS, cascade de pièces pendant la pluie d'icônes.

**Rythme** : l'écran CONGRATULATIONS **impose environ 1 s** avant qu'on puisse valider. La pluie d'icônes, elle, ne bloque rien : le joueur fait défiler le calendrier pendant qu'elle se joue.

---

## 4. Nouveau ou différent par rapport à `BIDMASTER-VIDEO.md`

1. **Choisir ce qu'on charge après l'enchère** : capacité « x/4 », carton qui vole dans la voiture, tampon « accepter », départ de la voiture. Le résumé ne parlait que de « Retour de voiture ».
2. **Le retour de voiture est un vrai trajet** : 13 s, barre de minuteur au-dessus de l'Entrepôt sur la carte, voiture garée en ville à l'arrivée. Le résumé ne disait pas que la voiture « s'améliore » ni que le trajet est visible sur la carte.
3. **Ligue des guildes, Saison S13** : écran entièrement nouveau (classement en milliards de dollars, podium, rang 2608 du joueur, 36 jours restants). On y voit aussi un **bug** : « Saison %s », erreur « Échec de l'extraction des données », puis « 0d 00:00:00 » avant la correction.
4. **Chapitres de tâches** (« Chapitre Vingt-six », 3/4, objectif « l'homme le plus riche du monde ») : la structure de progression scénarisée était absente du résumé.
5. **Calendrier** : précisions qui manquaient.
   - Il s'appelle « 28 ciel » (traduction ratée) et compte 17, puis 18 jours connectés.
   - **Les jours manqués se rattrapent pour 1 lingot.**
   - Il y a des cases « Récompenses exclusives! », un jour 7 avec une voiture « SSS » et un jour 28 avec un fragment de personnage.
   - La série « 10/7 » mène à un coffre, et le compteur dépasse 7.
6. **Prime de secrétaire sur toutes les récompenses**, pas seulement sur les ventes : +15 billets sur le rattrapage, +1 lingot sur le cadeau gratuit. On voit aussi un **bonus caché** (1,500 annoncés, 1,627 reçus).
7. **L'énergie peut dépasser le maximum** (110/60) ; le minuteur de recharge « (mm:ss +1) » disparaît alors.
8. **La pluie d'icônes vers le HUD** est un effet qui n'était pas décrit (le résumé citait seulement « pièces qui volent » au Monopoly).
9. **Détail du VIP** : énergie max 90, +2 emplacements au prêteur, vitesse ×2, EXP ×2, 30 ou 50 pubs sautées par jour, « valeur 1500 % / 3000 % ». Forfait 7 jours : 110 lingots + 16,200 billets pour $5.99.
10. **« Dollars gratuits »** : 300 billets contre une pub, depuis une icône permanente. Le joueur refuse.
11. **Pass de niveau** : échelle chiffrée de 1 à 30 (gratuite et premium), $17.99 au lieu de $99.99 ; la conseillère est une **experte d'identification** qu'on « met à l'université ». Le résumé disait « pass de saison ». Ce pass est lié au **niveau** (Lv. 19), et la récompense phare est un personnage aux compétences réelles.
12. **Coffret cadeau** : 1 lingot gratuit chaque jour pour attirer le joueur ; trois packs **limités à 1 achat** ($1.99, $5.99, $12.99) et un lot des trois à $16.99 (« 80 % »). Les contenus sont détaillés, avec les consommables calculatrice, chaussure, tomate et objet rose.
13. **Indicateurs de la ville** qui n'étaient pas notés :
    - cadeau vert à minuteur (04:14, qui descend) ;
    - tirelire « 800 » ;
    - vignette « Limitée » en carrousel ;
    - compteur « 00:02:30 » qui monte par paliers de 10 s (rôle inconnu) ;
    - « ! » rouge au prêteur ;
    - immeuble « 0/5 » ;
    - brouillard en dents de scie sur la Métropole.
14. **Sortie du jeu** : en arrière-plan, le jeu affiche une illustration de ville façon bande dessinée. La vidéo se termine sur l'écran d'accueil iOS et l'arrêt de l'enregistrement (16:14, batterie 18 %). Le résumé plaçait le pass à 6:30 et le coffret à 6:40 : c'est confirmé.
