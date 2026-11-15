# Bid Master, minute 3 (3:00 à 3:59) : analyse image par image

Sources : 30 planches (une image toutes les 0,25 s), captures pleine résolution `sc/t3m*.jpg`, plus des extractions ffmpeg à 10 et 15 i/s sur les moments ambigus (clic vers la mine, début et fin de la roue, retour de félicitations, ouverture du garage, entrée dans le Monopoly).
Tout ce qui suit a été vu dans la vidéo. Les hypothèses sont signalées comme telles et les zones illisibles sont marquées [?].

Ressources au début de la minute : énergie 60/60, **298 lingots**, **13.69K billets**. À la fin : 309 lingots, 16.21K billets, et 2,431 tickets dans le Monopoly.

---

## 1. Chronologie

### A. Liste « événement à durée limitée » puis mine d'or (3:00 à 3:12)

- **3:00.00** : la popup « événement à durée limitée » est déjà ouverte (elle vient de la minute 2). Elle est posée sur la ville assombrie, dont on devine le HUD (60/60, 298, 13.69K). La liste est en fin de défilement : les cartes montent d'environ 70 px entre 3:00.00 et 3:00.75, puis une zone blanche vide apparaît sous la dernière carte (sur-défilement). Le doigt glisse vers le haut.
- **3:01.00 à 3:01.25** : rebond élastique, la liste redescend et le titre « Capturez la mine d'or » de la première carte visible redevient lisible. Elle reste immobile jusqu'à 3:01.83.
- **3:01.85 environ** : le joueur touche le bouton jaune « Entrer » de la carte « Capturez la mine d'or ». **Coupure franche** sans fondu : à 3:01.87 l'écran « Capturez la mine d'or » s'affiche en plein écran.
- **3:01.9 à 3:02.6** : la roue est au repos. Huit pastilles sont disposées en cercle autour du gros bouton « commencer! ».
- **3:02.6 à 3:02.7** : le joueur touche « commencer! ». Le compteur de lingots passe de **298 à 296** (coût : 2 lingots). La roue démarre.
- **3:02.7 à 3:08.2 (environ 5,5 s)** : « tirage » de la roue. Un halo clair (cercle lumineux translucide et pastille agrandie) **saute d'une pastille à l'autre de façon apparemment aléatoire**, et non en tournant dans l'ordre. Séquence relevée à 10 i/s : +30 %, +60 %, +500 %, +40 %, +200 %, +20 %, +50 %, +250 %… Le halo change environ toutes les 0,1 s au début, puis ralentit jusqu'à environ 0,25 à 0,5 s par saut vers 3:06 à 3:08. Le chiffre « Temps restants aujourd'hui : 20 » ne bouge pas pendant le tirage.
- **3:08.2 environ** : le halo s'arrête sur **+30 %** (en haut à droite).
- **3:08.4 à 3:08.9** : une **onde de choc dorée** part de la pastille +30 %. C'est un grand disque jaune translucide qui grossit jusqu'à couvrir la moitié haute de l'écran (titre compris), puis s'efface en 0,4 s environ.
- **3:09.2 à 3:09.4** : une deuxième pulsation, plus petite, d'environ 2 fois le diamètre de la pastille.
- **3:09.5 à 3:10.0** : une **flèche verte courbe montante** apparaît à droite de la pastille +30 % (signe « bonus ») et reste visible.
- **3:10.05** : fondu au noir partiel et apparition de l'écran **CONGRATULATIONS**. Le titre apparaît d'abord seul, sur un fond assombri qui laisse voir la roue en transparence et éclairé par un faisceau de lumière dorée venant du haut.
- **3:10.25** : apparition du sous-titre « Félicitations pour l'obtention » entre deux filets horizontaux.
- **3:10.75** : apparition des cartes : une grande carte orange « lingot × **3** », une étiquette « Prime De Secrétaire » et une petite carte « lingot × **1** » en dessous, une icône « i » en haut à gauche. Derrière, le HUD affiche déjà **300** (296 + 3 + 1).
- **3:11.00** : le bouton rond « ✓ » apparaît en bas.
- **3:11.45 environ** : le joueur touche « ✓ ». Retour immédiat à la mine.
- **3:11.5 à 3:11.9** : quelques lingots volent en diagonale de bas en haut à travers l'écran, vers le compteur de lingots. **La roue a changé de monnaie** : les huit pastilles montrent maintenant des liasses de billets, avec les mêmes pourcentages, et le bouton central affiche « commencer! » avec un coût de **100 billets**. « Temps restants aujourd'hui » vaut maintenant **19**.
- **3:11.9 environ** : le joueur touche « ↩ » (en bas à droite). Retour à la liste d'événements, **sans fondu**. Les lingots volants continuent leur trajet par-dessus la liste jusqu'au haut de l'écran (3:12.0 à 3:12.3), ce qui montre que l'effet est indépendant de l'écran.

### B. Liste, puis « Remises à la consommation » (3:12 à 3:16)

- **3:12.0 à 3:13.0** : un défilement vers le bas puis un sur-défilement : à 3:12.50 une bande blanche vide apparaît sous la dernière carte. Rebond retour à 3:12.75, liste stable à 3:13.00.
- **3:14.0** : la liste est légèrement remontée.
- **3:14.9 environ** : le joueur touche « Entrer » sur « Remises à la consommation sur les lingots d'or ».
- **3:15.00** : la popup « Remises à la consommation sur les lingots d'or » apparaît en **zoom depuis le centre** (environ 90 % à 3:15.00, 100 % à 3:15.25). Elle est posée par-dessus la liste, elle-même assombrie.
- **3:15.25 à 3:16.0** : popup statique. On voit 4 paliers, tous cochés, et un cinquième (150) coupé en bas.
- **3:16.1 environ** : le joueur touche le « ✕ » blanc (bord droit, à cheval sur le cadre). La popup disparaît et la liste revient (3:16.25).
- **3:16.5 à 3:17.0** : le joueur fait défiler la liste vers le haut. Une **cinquième carte**, sans titre visible (deux femmes glamour en robe dorée et lunettes de soleil, icônes lingot, billets et éclair bleu « énergie »), apparaît **au-dessus** de « Capturez la mine d'or ». C'est la vraie tête de liste.

### C. « Récompenses d'activité » et deux coffres (3:18 à 3:24)

- **3:18.3 environ** : le joueur touche « Entrer » sur « Récompenses d'activité ».
- **3:18.46 à 3:18.75** : la popup s'ouvre en **pop-in** (petite, puis à sa taille finale).
- **3:19.0 environ** : le joueur touche le **coffre du palier 10**, qui scintille et porte une pastille rouge.
- **3:19.25** : CONGRATULATIONS (titre seul, faisceau doré). Sous-titre à 3:19.75.
- **3:20.00** : apparition des cartes : billets **108**, lingot **1** ; « Prime De Secrétaire » : billets **1**, lingot **1**. Le « ✓ » est encore grisé (estompé) à 3:20.00 et devient net à 3:20.25.
- **3:20.6 environ** : le joueur touche « ✓ ». Retour à la popup d'activité (3:20.75) : une liasse de billets et un lingot volent depuis le centre vers le haut. Le coffre 10 est maintenant **ouvert et sombre**, sans pastille.
- **3:21.0 environ** : le joueur touche le **coffre du palier 30**.
- **3:21.25 à 3:22.0** : CONGRATULATIONS, pendant que **des dizaines de liasses de billets et quelques lingots** du gain précédent traversent encore l'écran en diagonale vers le haut.
- **3:22.00** : cartes billets **217**, lingot **2** ; « Prime De Secrétaire » : billets **2**, lingot **1**.
- **3:22.6 environ** : le joueur touche « ✓ ». Retour à la popup (3:22.75), nouvelle gerbe de billets et de lingots. Les deux coffres 10 et 30 sont ouverts.
- **3:23.0 à 3:23.5** : les billets volent vers le haut à droite (compteur de billets) et les lingots vers le compteur de lingots.
- **3:23.6 environ** : le joueur touche le « ✕ » de la popup d'activité. Retour à la liste (3:23.75). Les billets continuent de voler par-dessus.
- **3:24.3 environ** : le joueur touche le « ✕ » de la liste. Retour à la **Ville** à 3:24.50. HUD : **305** lingots, **14.02K** billets.

Contrôle : 300 + 1 + 1 + 2 + 1 = 305 lingots ; 13 690 + 108 + 1 + 217 + 2 = 14 018, affiché 14.02K.

### D. Ville, puis garage souterrain (3:24 à 3:30)

- **3:24.5 à 3:26.3** : le joueur fait glisser la carte de la ville (panoramique vers le bas puis vers la droite). On voit Vente de voitures, Marché commercial, des Appartements et des lots verrouillés.
- **3:26.35 environ** : le joueur touche probablement le bâtiment « Vente de voitures », au centre de l'écran à ce moment-là [? : le doigt n'est pas visible].
- **3:26.40** : l'écran « Garage souterrain » s'affiche. La popup « Gains sur crochet » apparaît **en même temps**, en zoom avec un léger rebond (environ 60 %, puis 90 %, puis 100 % en 0,15 s).
- **3:27.1 environ** : le joueur touche « Réclamer vos gains ».
- **3:27.25** : CONGRATULATIONS. Sous-titre à 3:27.50.
- **3:28.00** : cartes lingot **3**, billets **2,170**, EXP **12** ; « Prime De Secrétaire » : billets **20**, lingot **1**, EXP **1**. Le HUD derrière affiche 309 et 16.21K. À noter : la popup annonçait **2,000** billets mais la récompense est de **2,170** [? : origine des 170 billets en plus inconnue].
- **3:28.4 environ** : le joueur touche « ✓ ». Retour à « Gains sur crochet » (3:28.50), qui a changé : les cartes sont remplacées par de petites icônes qui s'envolent (lingot, billets, EXP), le minuteur passe à **00:00:00** et le bouton « Réclamer vos gains » devient **gris**.
- **3:28.75 à 3:29.0** : les icônes se multiplient en paquets (liasses, cartes EXP, lingots) et volent vers le haut.
- **3:29.25** : la popup se ferme toute seule. On voit le garage en clair, traversé par **une pluie d'environ 40 liasses de billets, une dizaine de cartes EXP et 3 lingots** qui montent vers le compteur. Le bandeau du bas passe de « $ 3 / 2,000 / 12 » à « **0 / 0 / 0** ».
- **3:30.1 environ** : le joueur touche « ↩ ». Retour à la Ville (3:30.25). Les dernières liasses volent encore vers le HUD.

### E. Panoramique dans la ville (3:30 à 3:34)

- **3:30.25 à 3:34.25** : un long glissement du doigt (environ 4 s) vers le bas puis vers la gauche. Ordre d'apparition : Vente de voitures, Marché commercial, Appartement (cadenas orange), immeubles « 0/5 » et « 0/7 », lots « Lv. 26 » et « Lv. 24 », Serrurier, Entrepôt, **Prêteur sur gages** (enseigne PAWN SHOP, « ! » rouge), **Magasin de voitures** (bâtiment « MINI »), Restaurant, **La ville des Monopoly** (grande roue, dés géants, chapeau haut-de-forme), **Institut d'expertise** (« ! » rouge), **Atelier de réparation** (« ! » rouge), **Bibliothèque**, fontaine, statue blanche et arbres d'automne orange. Des passants miniatures marchent dans les rues.
- Pendant tout ce temps, le minuteur sous l'icône cadeau de la colonne de droite décompte de 06:53 (3:24.5) à 06:44 (3:34). En bas à droite, l'icône voiture « S » affiche **« 1d 00:00:00 » avant la collecte du garage et « 00:00:00 » après** : c'est le raccourci vers les gains du garage.
- Dans la colonne de droite, l'icône « Limitée » **alterne entre deux portraits**, un homme en casquette de marin (3:24 à 3:30) et une femme rousse (3:30.25 à 3:32.25), puis revient au marin à 3:32.75.

### F. Monopoly : bonus, location, loyer, dé choisi, boutique (3:34 à 3:59)

- **3:34.3 environ** : le joueur touche « La ville des Monopoly ».
- **3:34.45** : coupure vers le plateau de Monopoly, assombri. La popup « Bonus de connexion quotidien » s'ouvre en zoom (environ 50 %, puis 80 %, puis 100 % de 3:34.45 à 3:34.65) : **ticket doré × 1000** et **dé doré × 2**. Des étincelles blanches clignotent aux coins du titre.
- **3:34.65 à 3:35.1** : popup immobile. Elle n'a aucun bouton.
- **3:35.2 environ** : un toucher ferme la popup. Le plateau s'éclaircit et un **paquet de tickets dorés** part du centre-gauche et vole vers le compteur en haut à gauche (3:35.25 à 3:36.75, environ 1,5 s, une vingtaine de tickets en traînée). Le compteur reste à **2,331** [? : le bonus ×1000 était sans doute déjà compté, ou n'est pas encore crédité].
- **3:36.4 environ** : le joueur touche le gros bouton rouge « dé » (20/20).
- **3:36.5 à 3:38.25 (environ 1,8 s)** : un **dé blanc 3D roule et rebondit** en zigzag sur le plateau (du square central vers le bas de l'écran, puis retour), en tournant sur lui-même. Il s'arrête face « **1** ».
- **3:38.50** : le compteur de lancers passe à **19/20**. Une pastille « ⏱ 10:00 » apparaît sous le bouton (régénération : 1 dé toutes les 10 min, qui décompte ensuite seconde par seconde jusqu'à 09:40 à 3:59). Un **gros chevron doré qui rebondit** marque la case d'arrivée, et le pion (la joueuse blonde en robe rouge) avance d'une case vers un immeuble jaune.
- **3:39.25** : popup « **Louer un** » (zoom). On y lit le texte, la récompense **600** et deux boutons : bleu « 🎬 Location » (par une pub) et jaune « Location ◆ 1,200 » (contre des tickets).
- **3:40.1 environ** : le joueur touche « Location 1,200 ». La popup se ferme et le compteur passe de **2,331 à 1,131**. La case affiche maintenant « **x5** », écrit en miroir ou à l'envers sur la tuile.
- **3:41.0 environ** : nouveau lancer. Le dé roule de 3:41.0 à 3:42.75 et s'arrête sur « **6** ». À 3:43.00 le compteur passe à **18/20**.
- **3:43.0 à 3:46.25** : le pion **avance case par case**, environ 0,5 s par case, avec un petit saut, et la caméra le suit en glissant. Il passe sur +200, « ? », +200, la case verte « bouclier », la case « voleur », et passer sur une case +200 ne rapporte rien. Le chevron doré attend sur la case « immeuble **x2** ».
- **3:46.5 à 3:46.75** : un **cercle lumineux** part de la case et grossit vers le centre de l'écran, avec un ticket doré au centre, un rayonnement et des étoiles. L'écran s'assombrit.
- **3:47.00** : bandeau « **obtenir un loyer** » et ticket doré « **800** » dans un halo à étoiles scintillantes. Le bouton dé est remplacé par un **bouton « ✓ »** à 3:47.25.
- **3:48.1 environ** : le joueur touche « ✓ ». Le texte vert « **+800** » flotte au-dessus du pion et une gerbe d'environ 25 tickets jaillit de la case et vole vers le compteur (3:48.5 à 3:50.0). Le compteur passe à **1,931** vers 3:49.25. La case n'affiche plus que « **x1** ».
- **3:49.6 environ** : le joueur touche le **dé doré** en bas à gauche (compteur « 2 »). Une infobulle s'ouvre : « **Restant : 2** » et les **6 faces de dé** (1 à 6) sur 3 lignes de 2.
- **3:52.0** : la face « **3** » est grisée, donc enfoncée par le doigt. L'infobulle se ferme.
- **3:52.25 à 3:53.75** : le dé roule (environ 1,5 s) et s'arrête sur « **3** » à 3:54.0. **Le compteur 18/20 ne baisse pas** : le dé choisi ne consomme pas de lancer normal.
- **3:54.25 à 3:55.9** : le pion avance de 3 cases (+300, calculatrice, puis +500), toujours avec le chevron doré sur la destination. La caméra se déplace vers la **BANK** (banque néoclassique à dôme doré) et une fontaine.
- **3:56.0 à 3:57.5** : « **+500** » en vert au-dessus du pion, gerbe de tickets vers le compteur, compteur **2,431** à 3:57.0. Au même moment, le dé doré passe de **2 à 1**.
- **3:57.6 environ** : le joueur touche « Boutique de rachat » (panier rouge rempli de tickets, en bas à gauche).
- **3:57.75 à 3:58.0** : la popup « **boutique d'échange** » s'ouvre en zoom.
- **3:58.75 à 3:59.0** : le joueur fait défiler le rayonnage vers le bas. La dernière rangée apparaît ; la minute se termine dessus.

---

## 2. Inventaire des écrans

### 2.1 Popup « événement à durée limitée »

- **Cadre** : violet, coins arrondis, bandeau de titre violet avec le texte « événement à durée limitée » en dégradé doré, et un grand « ✕ » blanc en haut à droite. Au-dessus du bandeau à gauche : fanions (guirlande jaune, rose, vert, bleu), feu d'artifice violet et confettis. Au centre : une gerbe d'étincelles violette.
- **Contenu** : une liste à défilement vertical sur fond crème, avec rebond élastique en fin de liste. Chaque carte est une bannière illustrée sombre avec un titre blanc en haut à gauche, 2 à 4 icônes de récompense (carrés 1:1, fond orange pour les lingots, violet pour le reste) et un bouton jaune « Entrer » en bas à droite. Une pastille rouge sur le bouton signale une action disponible.
- **Ordre des cartes**, de haut en bas :
  1. Sans titre : deux femmes en robes dorées, sur un fond de ruines. Icônes lingot, billets, éclair bleu. Pastille rouge.
  2. « Capturez la mine d'or » : grosse pièce « START! » et lingots. Icônes lingot, billets. Pastille rouge.
  3. « Récompenses de recharge quotidienne » : rideau rouge et billets qui volent. Icônes lingot, billets, objet rose/papier [?], portrait-puzzle de femme brune (fragment de personnage). Pas de pastille.
  4. « Récompenses d'activité » : décor d'immeubles. Icônes lingot, billets. Pastille rouge.
  5. « Remises à la consommation sur les lingots d'or » : pile de lingots. Icônes chaussure noire et or [?], tomate, calculatrice. Pas de pastille.
- **En arrière-plan** : la ville assombrie, avec le HUD et la barre d'onglets visibles par transparence.
- **Ce que l'écran apprend** : les événements sont regroupés en une seule liste. Chaque carte affiche ses récompenses avant même d'entrer, et la pastille rouge pousse à « vider » chaque événement.

### 2.2 « Capturez la mine d'or »

- **Haut** : le titre blanc « Capturez la mine d'or » à gauche, puis deux compteurs à droite : lingots « 298 » avec un « + » jaune, billets « 13.69K » avec un « + ». L'énergie n'est pas affichée.
- **Fond** : terre brune floue avec des pépites dorées, et un cercle de pointillés lumineux.
- **Grand texte** : « Taux de gain » en blanc et « **100 %** » en orange. Ce taux **ne change pas** après le gain de +30 %.
- **Roue**, 8 pastilles rondes avec image et pourcentage blanc, dans le sens horaire à partir du haut : **+20 %** (2 lingots), **+30 %** (pile de lingots), **+40 %**, **+50 %**, **+60 %** (chariot de mine plein de lingots), **+200 %** (chariot), **+250 %** (grosse pile), **+500 %** (coffre-fort ouvert débordant d'or). Les gros bonus sont les plus rares, en haut à gauche.
- **Centre** : un grand bouton rond doré « commencer! » en marron, avec un bandeau rouge bordeaux portant l'icône lingot et « **2** ». En mode billets, l'icône est une liasse et le coût est « **100** ».
- **Bas** : « Temps restants aujourd'hui : » en petit gris, puis « **20** » (ensuite 19) en jaune gras sur une barre noire.
- **Bas droit** : un bouton « ↩ » carré sombre.
- **Ce que l'écran apprend** :
  - c'est un mini-jeu de pari : on mise 2 lingots, la roue tire un bonus et on récupère la mise multipliée par le « taux de gain » plus le bonus. Ici, 2 lingots misés ont rapporté 3 lingots (hypothèse : 2 × 130 % = 2,6, arrondi à 3), plus 1 lingot de prime de secrétaire ;
  - le nombre de tours est limité à 20 par jour ;
  - **après un tour en lingots, la roue passe en billets** (coût 100). On ne sait pas encore si les deux modes alternent ou si le mode lingots est plafonné [?].

### 2.3 Écran « CONGRATULATIONS » (vu 5 fois dans la minute)

- **Fond** : un voile noir à environ 80 % sur l'écran précédent, un faisceau doré vertical venant du haut et un grand losange clair estompé derrière les cartes.
- **Titre** : « CONGRATULATIONS » en capitales blanches à liseré doré et lueur orange. Le titre est toujours en anglais.
- **Sous-titre** : « Félicitations pour l'obtention », entre deux filets fins.
- **Icône** : un « i » cerclé en haut à gauche (détail des bonus, supposé).
- **Cartes** : de 1 à 3 grandes cartes carrées de 85 px environ dans la capture 740 px, avec une bordure blanche, un fond orange pour les lingots, violet pour les billets et bleu pour l'EXP, et la quantité en blanc gras en bas à droite.
- **Prime de secrétaire** : une étiquette sombre « Prime De Secrétaire » à bordure dorée, suivie de petites cartes (environ 60 px) avec les mêmes codes couleur.
- **Bouton** : un « ✓ » rond gris métal en bas, qui apparaît en dernier.
- **Ordre d'apparition** : titre (t), sous-titre (t + 0,25 à 0,5 s), cartes (t + 0,75 s), « ✓ » actif (t + 1 s).
- **Primes de secrétaire observées** :
  - lingots 3 → 1 ;
  - billets 108 et lingot 1 → billets 1 et lingot 1 ;
  - billets 217 et lingots 2 → billets 2 et lingot 1 ;
  - lingots 3, billets 2 170 et EXP 12 → billets 20, lingot 1 et EXP 1.

  On en déduit une **prime d'environ 1 %, arrondie à l'inférieur, avec un minimum de 1 par type de ressource**.

### 2.4 Popup « Remises à la consommation sur les lingots d'or »

- **Titre** : un gros titre doré sur trois lignes, « Remises à la / consommation sur les / lingots d'or », dans un bandeau sombre à paillettes. Un « ✕ » blanc déborde à droite, hors du cadre.
- **En-tête** : sur fond cuivre, « Consommation de courant » (traduction ratée de « dépense actuelle »), puis « **4,042** » en jaune sur une barre marron.
- **Paliers** : des cartes crème avec le texte « La consommation de lingots d'or atteint **N** » (N en orange) et un gros **tampon « ✓ » doré** à droite, présent sur les 4 paliers visibles :
  - 10 : billets 200, lingot 1 ;
  - 30 : billets 500, lingots 3 ;
  - 50 : billets 800, lingots 5, calculatrices 5 ;
  - 100 : billets 1,200, lingots 10, tomates 5 ;
  - 150 : coupé [?].
- **Ce que l'écran apprend** : dépenser de l'or rapporte (paliers cumulés). Le joueur a dépensé 4 042 lingots au total dans l'événement. La calculatrice (outil d'enchère) et la tomate (ingrédient du restaurant, supposé) servent de récompenses.

### 2.5 Popup « Récompenses d'activité »

- **Titre** : « Récompenses d'activité » en doré, avec un « ✕ » blanc.
- **Panneau supérieur sombre** : une étoile rouge « Activité » et « **35** ». Dessous, une barre de progression aux paliers **10 / 30 / 60 / 100**, jaune jusqu'à 30, noire au-delà, avec un coffre sous chaque palier :
  - 10 et 30 : coffres argent et or, brillants, avec une pastille rouge (puis ouverts et sombres une fois ramassés) ;
  - 60 et 100 : coffres rouge et argent, fermés.
- **Tableau** : trois colonnes « Cible » / « calendrier » / « ✪ Activité » :
  - Connexion quotidienne : 1/1, 5/5 (en orange, donc fait) ;
  - Terminez n'importe quel niveau d'enchères : 0/3, 0/15 ;
  - Vente d'accessoires complète : 3/3, 15/15 (orange) ;
  - Accessoires de réparation : 0/3, 0/15 ;
  - Accessoires d'identification : 0/5, 0/25 ;
  - Regarder des publicité : 1/2, 10/20 (coupé en bas).
- **Pied** : « La progression des tâches est actualisée quotidiennement ».
- **Ce que l'écran apprend** : un système classique de tâches quotidiennes. Chaque action donne des points d'activité (5 points par unité pour la plupart), et des paliers de points ouvrent des coffres. Regarder des pubs fait partie des tâches.
- **Contenu des coffres** : palier 10 = 108 billets et 1 lingot ; palier 30 = 217 billets et 2 lingots.

### 2.6 HUD de la Ville

D'après la capture pleine résolution à 3:24.76.

- **Haut gauche** : un portrait carré de la joueuse blonde, avec un badge de niveau « **19** » dans un hexagone doré.
- **Ligne de ressources** :
  - éclair bleu « 60/60 » avec un « + » orange à pastille rouge ;
  - lingot « 305 » et « + » ;
  - billets « 14.02K » et « + ».
- **Sous les ressources** : un badge « VIP » gris en italique et un badge vert « $ Grand Capitaliste ». À droite : une enveloppe à cachet rouge (courrier) et un engrenage (réglages).
- **Colonne gauche** (icônes rondes, de haut en bas) :
  - « Pack Temporaire » (portrait doré dans une arche) ;
  - calendrier avec coche ;
  - liasses (pastille rouge) ;
  - « AD » barré (anti-pub) ;
  - hexagramme doré ;
  - stand de marché (pastille rouge) ;
  - Facebook ;
  - camion ;
  - chevron « ^ » pour replier.
- **Colonne droite** :
  - « Limitée » (portrait alternant, pastille rouge) ;
  - boîte cadeau rose (pastille) ;
  - trophée « $ » (pastille) ;
  - coffre à ruban rouge ;
  - cadeau avec minuteur **06:53** ;
  - cochon tirelire « 800 » avec une étiquette lingot ;
  - pick-up ;
  - homme en chapeau et lunettes ;
  - chevron.
- **Bas gauche** :
  - un téléphone jaune « quêtes secondaires » ;
  - une carte « Tâche » (presse-papiers violet avec « ! » et un « ? » rouge), avec la bulle « Participez à des ventes aux enchères de San Antonio niveaux et gagnez 3,500 de dollars (1,514/3,500) », chiffres en jaune.
- **Bas droit** : la voiture « S » avec « 1d 00:00:00 », puis « 00:00:00 ».
- **Barre d'onglets** :
  - Ville (actif, fond jaune) ;
  - boutique (pastille rouge) ;
  - Rôle ;
  - corporation ;
  - Métropole (cadenas) ;
  - **enchères** (gros marteau doré qui déborde de la barre) ;
  - une petite icône violette « ! » à l'extrême droite.
- **Sur la carte** : chaque bâtiment porte une étiquette sombre « icône + nom ». Des cadenas orange signalent les lots déblocables, des cadenas gris « Lv. 24 » et « Lv. 26 » les lots verrouillés par niveau, des pastilles hexagonales « 0/5 » ou « 0/7 » les immeubles d'appartements, et des « ! » rouges les bâtiments où une action attend.

### 2.7 « Garage souterrain » et popup « Gains sur crochet »

- **Écran du garage** :
  - **En-tête** : une icône maison-voiture et le titre « Garage souterrain » ; compteurs lingots et billets avec « + ».
  - **Corps** : trois **places de parking empilées** façon étagères, avec des bandes jaunes et noires sur les bords.
    - Place 1, en haut : grisée, cadenas, bouton vert « billets **8,000** Débloquer ».
    - Place 2 : vide, avec un « + » gris.
    - Place 3 : plaque « **Mini Fusée Rétro** » avec ★★★ et un « A » doré (rang), une Renault 5 Turbo rouge stylisée, le libellé « En usage » sur une barre turquoise et une poubelle à gauche.
  - **Bandeau bas** : un « $ » doré et les compteurs à collecter lingot « 3 », billets « 2,000 », EXP « 12 », qui passent tous à 0 après la collecte. Bouton « ↩ ».
- **Popup « Gains sur crochet »** : un cadre beige avec un onglet de titre orange et un « ✕ » blanc.
  - Texte : « Plus le nombre total d'étoiles de tous les véhicules du garage est élevé, plus les revenus d'AFK sont élevés ».
  - Étoile « x3 », puis trois cartes : lingot **3**, billets **2,000**, EXP **12**.
  - Minuteur « ⏱ 1d 00:00:00 » (plafond atteint), puis 00:00:00 après la collecte.
  - Débits : lingot « **2.59/d** », billets « **2,000/d** », EXP « **12/d** ».
  - Bouton jaune « Réclamer vos gains », qui devient gris une fois utilisé.
  - « CONSEIL : Une fois que le nombre de lingots d'or atteint un nombre entier, vous pouvez les récupérer. La partie décimale sera conservée et continuera à s'accumuler. »
- **Ce que l'écran apprend** :
  - c'est un **revenu passif (AFK) plafonné à 24 h**, proportionnel au nombre total d'étoiles des voitures garées ;
  - les lingots s'accumulent en décimales (2.59 par jour) et ne se récoltent qu'en entiers ;
  - les places de garage s'achètent (8 000 billets) ;
  - « crochet » est une mauvaise traduction de « hook / idle ».

### 2.8 Monopoly : plateau

- **Décor** : une ville cartoon plus claire et plus saturée que la ville principale. Pavés roses, square avec arbre, cabine téléphonique rouge, terrasse de café à parasols multicolores, BANK néoclassique à dôme doré, fontaine, feux tricolores, passages piétons.
- **Cases** : un ruban de tuiles colorées en relief qui fait le tour des pâtés de maisons. Types observés :
  - tickets « +200 », « +300 », « +500 » (bleu, ticket doré en relief) ;
  - immeuble à louer (jaune, plan d'immeuble ; affiche « xN » une fois loué) ;
  - « ? » chance (orange et violet) ;
  - voleur masqué avec sac de billets (rose) ;
  - calculatrice (jaune et violet) ;
  - dé arc-en-ciel (rose) ;
  - maison (orange) ;
  - grandes cases d'angle vertes (bouclier rouge, ou maison avec « $ ») ;
  - grandes cases rouges à barreaux (prison, supposé) ;
  - ticket de départ (bleu).
- **Pion** : la joueuse blonde en robe rouge, bras croisés au repos, sur une case surlignée en jaune-vert lumineux.
- **HUD propre au Monopoly** :
  - en haut à gauche, compteur de tickets (icône ticket doré, « 2,331 ») ;
  - en bas, barre bleue avec, au centre, un **gros bouton rond rouge-orange** portant un dé blanc et « **20/20** » ; dessous, une pastille blanche « ⏱ 10:00 » en vert (régénération) ;
  - en bas à gauche : **dé doré** avec « 2 » (dés « choisis ») et, au-dessus, le panier rouge « Boutique de rachat » ;
  - en bas à droite : bouton jaune « ↩ ».
  - Il n'y a pas de HUD lingots ni billets.
- **Popup « Bonus de connexion quotidien »** : titre doré en contour, cadre blanc à bord bleu clair, deux cartes jaunes « ticket ×1000 » et « dé doré ×2 », sans bouton. On la ferme en touchant.
- **Popup « Louer un »** :
  - bandeau rouge corail « Louer un » et « ✕ » orange rond ;
  - texte rouge « Louez 5 fois et obtenez une récompense pour chaque séjour » ;
  - encadré jaune pâle « ticket **600** » ;
  - texte gris « Consommation 1 par arrêt ou passage ultérieur » ;
  - boutons bleu « 🎬 Location » (pub) et jaune « Location ◆1,200 ».
- **Écran « obtenir un loyer »** : écran assombri, bandeau doré « obtenir un loyer » entre deux filets, ticket dans une auréole rayonnante, « **800** » en blanc et un bouton « ✓ » à la place du bouton dé.
- **Infobulle du dé doré** : bulle blanche à bord bleu, « Restant : **2** » (le 2 en rouge), 6 dés blancs (faces 1 à 6, points noirs, le 1 rouge).
- **Ce que l'écran apprend** :
  - **location** : on paie 1 200 tickets (ou une pub) pour « louer » une case immeuble. Elle rapporte ensuite un loyer à chaque arrêt, pour 5 utilisations au total (« x5 », puis « x1 » après usage) ;
  - le loyer dépend de la case : 600 annoncés pour celle-ci, 800 sur une autre case marquée « x2 » ;
  - **dé à face choisie** : le dé doré, offert ×2 par la connexion, permet de choisir son résultat sans dépenser de lancer ;
  - 20 lancers maximum, 1 lancer régénéré toutes les 10 min.

### 2.9 Popup « boutique d'échange » (Monopoly)

- **Cadre** : une échoppe, avec un fronton rose « boutique d'échange », une étoile scintillante à gauche, un « ✕ » orange, un auvent à festons rouges et blancs et un comptoir en bois.
- **Rayonnage** : 2 colonnes de cases crème, chacune avec une quantité « xN » sur fond gris foncé en haut à droite et un bouton de prix en bas :
  - dé blanc x1 : « Gratuit » (bleu) ;
  - dé blanc x3 : « 🎬 Gratuit » (vert, contre une pub) ;
  - dé doré x1 : « 🎬 Gratuit » (vert, pub) ;
  - billets x1,000 : ticket **1000** (jaune) ;
  - billets x2,000 : **2000** ;
  - lingots x5 : **5000** ;
  - lingots x10 : **10000** ;
  - énergie (éclair bleu) x10 : **2000** ;
  - objet rose transparent (tissu ou cristal [?]) x10 : **8000** ;
  - arche dorée et violette avec dé et lingots (cadre d'avatar ou décoration [?]) x1 : **29999**.
- **Ce que l'écran apprend** : les tickets du Monopoly se convertissent en ressources du jeu principal. Le taux est d'environ 1 ticket pour 1 billet, ou 1 000 tickets par lingot. Des dés gratuits sont proposés, en partie contre des pubs.

---

## 3. Effets et « juice »

| Effet | Où | Description | Durée |
|---|---|---|---|
| Sur-défilement élastique | Liste d'événements | Zone blanche sous la liste, puis retour en rebond | 0,25 à 0,5 s |
| Halo sautillant | Roue de la mine | Pastille agrandie et cerclée de lumière qui saute au hasard entre les 8 cases, en ralentissant | environ 5,5 s |
| Onde de choc dorée | Pastille gagnante | Disque jaune translucide qui grossit jusqu'à la moitié de l'écran, puis une seconde pulsation plus petite | 0,5 s, puis 0,2 s |
| Flèche verte montante | À côté du gain | Flèche courbe verte, signe de bonus | reste jusqu'à la sortie |
| CONGRATULATIONS | Toutes les récompenses | Voile noir, faisceau de lumière du haut, titre lumineux, puis apparition échelonnée du sous-titre, des cartes et du « ✓ » | environ 1 s jusqu'au « ✓ » actif |
| Pluie de ressources | Après le « ✓ » | Lingots, liasses et cartes EXP qui volent en diagonale vers leurs compteurs du HUD, parfois **40 objets ou plus**. L'effet continue par-dessus les changements d'écran et même par-dessus un nouvel écran CONGRATULATIONS | 1 à 2 s |
| Coffre ouvert | Activité | Coffre brillant à pastille rouge, puis coffre ouvert et assombri | instantané |
| Pop-in des popups | Toutes les popups | Zoom de 50 à 60 % vers 100 % avec un léger rebond | 0,15 à 0,25 s |
| Bouton grisé | Garage | « Réclamer vos gains » passe du jaune au gris et le minuteur à 00:00:00 | instantané |
| Bandeau qui se vide | Garage | Compteurs 3 / 2 000 / 12 à 0 | instantané |
| Icônes alternées | HUD « Limitée » | Deux portraits qui alternent toutes les 2 à 3 s | en boucle |
| Dé 3D | Monopoly | Dé blanc qui roule, rebondit et tourne sur le plateau, puis se fige sur sa face | 1,5 à 1,8 s |
| Chevron doré | Monopoly | Gros marqueur doré qui sautille au-dessus de la case d'arrivée | pendant le déplacement |
| Pion qui sautille | Monopoly | Saut case par case, la caméra suit en glissant | environ 0,5 s par case |
| Cercle de loyer | Monopoly | Cercle lumineux qui part de la case et grossit au centre, avec ticket, rayons et étoiles | 0,5 s, puis une attente sur « ✓ » |
| « +800 » et « +500 » | Monopoly | Texte vert flottant au-dessus du pion, gerbe de 20 à 30 tickets jusqu'au compteur, puis mise à jour du compteur | 1,5 à 2 s |
| Envol des tickets | Bonus de connexion | Paquet de tickets qui file en traînée vers le compteur | environ 1,5 s |
| Minuteur de régénération | Monopoly | Pastille verte « 10:00 » sous le bouton dé, qui décompte | en continu |

**Sons supposés**, non audibles et donc hypothétiques :

- un « tic » à chaque saut du halo de la roue, de plus en plus lent ;
- un « gong » ou une fanfare sur l'onde de choc et sur CONGRATULATIONS ;
- un bruit de pièces et de billets pendant les pluies de ressources ;
- un roulement de dé ;
- des « pop » à chaque pas du pion ;
- une caisse enregistreuse sur le loyer.

---

## 4. Ce qui est nouveau par rapport à `BIDMASTER-VIDEO.md`

1. **La mine d'or, en détail** :
   - les 8 bonus sont +20, +30, +40, +50, +60, +200, +250 et +500 % ;
   - « Taux de gain 100 % » est un taux de base, que le tirage n'a pas modifié ;
   - le tirage est un halo qui saute au hasard, et non une roue qui tourne ;
   - le résultat est +30 % : 2 lingots misés ont rapporté 3 lingots, plus 1 de prime ;
   - **la roue passe ensuite en mode billets (100 billets par tour)** et le compteur quotidien passe de 20 à 19.
2. **La liste d'événements contient 5 cartes**, dont une carte sans titre (deux femmes) et « Remises à la consommation sur les lingots d'or ». Cette dernière est un système de **paliers de dépense cumulée** (10, 30, 50, 100, 150…), dont le compteur est à 4 042 et dont les quatre premiers paliers sont déjà réclamés.
3. **Les « Récompenses d'activité »** sont des tâches quotidiennes qui donnent des points d'activité (connexion, enchères, ventes, réparations, identifications, pubs) et des coffres aux paliers 10, 30, 60 et 100. Le joueur ouvre les coffres 10 et 30 dans cette minute.
4. **La prime de secrétaire est chiffrée** : environ 1 % du gain, avec un minimum de 1 par ressource. Elle s'ajoute à **toutes** les récompenses (mine, coffres, garage), pas seulement aux ventes.
5. **Le garage souterrain et ses « Gains sur crochet »**, absents du résumé :
   - un revenu passif plafonné à 24 h, qui dépend des étoiles des voitures (2.59 lingots, 2 000 billets et 12 EXP par jour) ;
   - des places de garage à débloquer (8 000 billets) ;
   - une voiture « Mini Fusée Rétro » ★★★ de rang A ;
   - un raccourci « S » sur la Ville affiche le minuteur du garage.
6. **Le Monopoly a des règles précises**, alors que le résumé parlait seulement de « dé, 20/20, loyer 800, pièces qui volent » :
   - un bonus de connexion propre (×1000 tickets et ×2 dés dorés) ;
   - une monnaie propre, les tickets ;
   - **la location de cases** (1 200 tickets ou une pub, pour 5 loyers) ;
   - un loyer touché quand on s'arrête sur une case louée (800) ;
   - des **dés dorés à face choisie** qui ne consomment pas de lancer ;
   - une régénération d'un lancer toutes les 10 min ;
   - une « boutique d'échange » qui convertit les tickets en billets, en lingots, en énergie et en cosmétiques, avec des dés gratuits contre des pubs.
7. **Bâtiments ou éléments de ville non cités dans le résumé** : Bibliothèque, Restaurant (vu dans la ville), La ville des Monopoly (bâtiment physique avec grande roue), Vente de voitures (qui mène au garage souterrain [?]), immeubles « 0/7 », lots « Lv. 26 ».
8. **HUD de la Ville détaillé** :
   - la quête « Tâche » sur les ventes aux enchères de San Antonio (1 514/3 500) ;
   - « quêtes secondaires » ;
   - le minuteur cadeau (06:53) ;
   - la tirelire « 800 » ;
   - l'icône « Limitée » à portraits alternés ;
   - la barre d'onglets : Ville, boutique, Rôle, corporation, Métropole (verrouillé), enchères.
9. **Correction du résumé** : à 3:00, l'écran n'est pas encore la mine. C'est la liste d'événements. La mine n'est ouverte qu'à 3:01.9.
10. **Rythme du « juice »** : les récompenses s'enchaînent sans temps mort. Il y a cinq écrans CONGRATULATIONS en une minute, et la pluie de ressources d'une récompense continue pendant l'écran CONGRATULATIONS suivant.

**Ressources de la minute** : lingots 298 → 309 (+11, dont 2 dépensés), billets 13.69K → 16.21K (+2,52K), tickets Monopoly 2,331 → 2,431 (−1 200 de location, +800 de loyer, +500 de case).
