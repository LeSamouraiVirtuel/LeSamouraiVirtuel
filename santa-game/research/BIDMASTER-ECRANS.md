# Bid Master : auction tycoon — atlas des écrans réels (UI et systèmes)

> Fait le 4 novembre 2026, en complément de `BIDMASTER.md`.
> Les images sont dans `research/bidmaster/img/`. La correspondance fichier → URL d'origine (et vidéo source) est dans `research/bidmaster/sources.json`.
> **Légende** : **[C]** = visible sur l'image citée ; **[I]** = déduit (recoupement de plusieurs images, logique de l'interface ou du genre).
> **Fichiers** : `appstore_*` = captures officielles App Store ; `gplay_*` = captures officielles Google Play ; `yt_<id>_<cadre>.jpg` = miniatures YouTube publiques. Pour `<cadre>` : `max` = miniature, `hq1/hq2/hq3` = images à 25/50/75 % de la vidéo en 480×360, `oar1/2/3/oardefault` = mêmes images en 720×1280, plein cadre vertical, pour les vidéos verticales et les Shorts. L'identifiant de la vidéo se retrouve dans `sources.json`.

---

## 0. Corpus et méthode

| Source | Images | Commentaire |
|---|---|---|
| iTunes Lookup API, 22 storefronts (us, fr, gb, de, es, it, br, jp, kr, tw, ru, ca, au, mx, nl, pl, tr, th, id, hk, sa ; vn et cn sans fiche) + pages HTML apps.apple.com | 32 | **Un seul jeu de captures pour tous les pays**, sauf le Brésil (texte « Nível », « LANCE »). 8 iPhone + 8 iPad × 2 langues. Le paramètre `lang=` ne change rien. |
| Google Play, 17 langues (`hl=`) | 20 | 8 captures paysage 1920×1080 + 8 tablette 2048×1536, identiques dans toutes les langues ; 4 variantes en plus (Thaïlande / autres marchés). Ce sont les mêmes illustrations marketing que l'App Store, recadrées. |
| YouTube : miniatures et images intermédiaires de **188 vidéos** (recherches en EN, FR, ES, PT, RU, ID, ZH, KO, JA ; chaînes V & F, BING ZLEE, Lim Shi San, Player Bid Master, Eyewind) | 997 | Seule source de **vrais écrans de jeu** : HUD, menus, popups. Les vidéos de « hack » et les homonymes (Storage Hunter Simulator, AutoBidMaster, drame « The Bid Master ») sont exclus. |
| apkpure, apkcombo, uptodown, softonic, qoo-app | 0 | 403 / 404 / 502 depuis le proxy. Je n'ai rien contourné. |
| Reddit, Wayback Machine | 0 | Reddit renvoie une page HTML sans API ; Archive renvoie 429. |
| Facebook, X, Discord, TikTok, Instagram | 0 | Connexion obligatoire. Rien n'a été tenté. |

- **Total : 1 049 fichiers uniques** (aucun doublon MD5). J'ai retiré 1 doublon exact et 17 quasi-doublons d'une même vidéo (empreinte perceptuelle 16×16), ainsi que les `oardefault` identiques à un `oarN`. L'empreinte donnait de faux positifs entre vidéos différentes (cadres noirs) : ces 98 images ont été restaurées.
- Le corpus couvre environ **75 écrans distincts** : 11 compositions marketing et environ 64 écrans de jeu.
- **Limite des sources** : les captures des stores sont des **illustrations marketing**. Elles montrent le décor et les personnages, avec un HUD simplifié et des chiffres mis en scène (6 888 lingots, 960 000 $). Le **vrai langage UI** ne vient que des images YouTube. Celles-ci sont souvent en 480×360 ; la lecture des petits textes y est marquée [C] seulement quand elle est nette.
- **Versions** : les vidéos vont de 2024 (v0.3-0.5, ville « Poor Guy », sans Métropole) à fin 2026 (onglet Métropole, Quartier chaotique, Free Market). Le HUD a peu changé entre les deux.

---

## 1. Index des écrans par catégorie

| # | Catégorie | Écrans trouvés | Fichiers de référence (meilleure résolution) |
|---|---|---|---|
| 1 | Ville / HUD | Ville niv. 19 EN, ville d'hiver EN/ES/RU, ville débutant, quartier des concessionnaires, quartier d'appartements, station-service, usine de recyclage, Quartier chaotique | `yt_Iq1QE57VqfM_oar1`, `yt_XCUz49gib6c_oar2`, `yt_cafxyf6fy4M_oar3`, `yt_FnULWK9K7pc_oar3`, `yt_5VAP269cTBs_oar1`, `yt_LGF2vBLvAvY_oar1`, `yt_fk-d7Oard-I_oar2`, `yt_KmM-SHgnDxo_oar1`, `yt_e68gZnIF25s_oar1` |
| 2 | Carte des enchères | Carte du monde (Washington…) | `yt_meGCHUXpAPE_hq2` |
| 3 | Enchère | Ouverture au coupe-boulon, inspection, enchère, annonces, VENDU, bilan, classement, choix de conteneur, enchère conteneur chronométrée, révélation d'objet spécial, conteneur à l'aveugle | voir §3 |
| 4 | Chargement du butin | « Select items to take n/N » | `yt_zJjVMMWoGME_oar1`, `yt_vn7BfW1jdX8_hq3` |
| 5 | Entrepôt / inventaire | Grille, onglets All / Appraisal / Repair / prop | `yt_qqZyXlai0P8_oar1`, `yt_-0Yj3AklHPQ_oar2` |
| 6 | Expertise (College / Institut d'expertise) | Scène, minuteur, accélérer, résultat | `yt_ZWleCa7gURo_oar2`, `yt_eOR6IC2s-wk_oar2`, `yt_LSa-QYbIfkY_hq3` |
| 7 | Réparation | Atelier (version ZH) | `yt_tHfvA0zmVtk_hq3` |
| 8 | Prêteur sur gages | Étagères, VIP, offres, minuteurs | `yt_eOR6IC2s-wk_oar1`, `yt_ZdYQyn1V2jg_oar2`, `yt_twbHAJXsThI_oar1` |
| 9 | Clients (achat à des PNJ) | Négociation « GET THE BEST PRICE », « IT'S YOURS! », popup client | `yt_ENwXH4e-Cn0_oar1`, `yt_ENwXH4e-Cn0_oar2`, `yt_cafxyf6fy4M_oar1` |
| 10 | Free Market (échange) | Boîte mystère, échange contre un objet | `yt_ZWleCa7gURo_oar1`, `yt_qqZyXlai0P8_oar2` |
| 11 | Musée | Intérieur à plateaux, popup INCOME | `yt_lWNtUoZyrqs_oar2`, `yt_lWNtUoZyrqs_oar3`, `yt_XCUz49gib6c_oar1`, `yt_v0GxfCp8s8E_oar1` |
| 12 | Collection | « MY COLLECTION » par rareté | `yt_B-8HUWmm7VA_hq3` (basse résolution) |
| 13 | Banque | « FIXED VAULT » (dépôt à terme) | `yt_B-8HUWmm7VA_hq2` (basse résolution) |
| 14 | Appartements | Fiche d'appartement, locataires | `yt_LlO3YNj1C7I_hq3`, `yt_TMThHKxdNzk_hq3` |
| 15 | Voitures | Magasin de voitures (location / achat), garage souterrain, garage abandonné | `yt_vn7BfW1jdX8_hq2`, `yt_zG_Cdy9q4eM_hq1`, `yt_dFPJ3PCJ02M_hq1`, `yt_syrs7Arm8Ms_hq3` |
| 16 | Restaurant | Chef, cloche, minuteur | `yt_UnfNEgrzIFI_hq3`, `yt_vK9yHm1BRxA_hq3` |
| 17 | Pêche / aquarium | Bateau, jauge, aquarium | `yt_YwqgTxCUebU_oar1`, `yt_YwqgTxCUebU_oar2`, `yt_r8c1ZF-SrT8_max` |
| 18 | Mine / Mystic Adventure | Donjon à cases, combat VS, mine coopérative | `yt_cRIhiWXSvTc_oar2`, `yt_cRIhiWXSvTc_oar1`, `yt_egsEb-JQ9H4_oar1` |
| 19 | Casino | Hall, roue de la fortune | `yt_YkhcMVWJbSY_oardefault`, `yt_YkhcMVWJbSY_oar1`, `yt_imYPSjmMWLo_hq1` |
| 20 | City of Monopoly | Plateau, prison, boutique d'échange | `yt_MzURWKnBhwY_oar3` |
| 21 | Usine de recyclage | Intérieur (broyeur, camions) | `yt_KmM-SHgnDxo_oar2` |
| 22 | Mini-jeu Rescue Beauty | Cartes à retourner | `yt_wI9QeNxOXCw_hq1`, `yt_O3hw6K96zDA_hq3` |
| 23 | Rôle / personnages | Galerie de cartes, carte de personnage, révélations, combat de gang | `yt_vFmTNJZGxXo_hq1`, `yt_OXVXksMyMiw_oar3`, `yt_e68gZnIF25s_oar2` |
| 24 | Profil / avatar | Popup avatar / cadre, profil « General Stats », titres « My struggle » | `yt_PYUWPYhhU1U_oar1`, `yt_w-07HqhpmsE_hq3`, `yt_5VAP269cTBs_oar3` |
| 25 | Boutique / VIP / packs | Popup Mall (VIP / GIFT / GOLD / MONEY), Mecha Outfit (gacha), Adventure set | `yt_xTpbuGRgvbE_oar3`, `yt_Q3sfRAmjNCw_hq3`, `yt_al0lrRTbyJE_hq1` |
| 26 | Événements | Sapin de Noël « Make a wish », Dock treasure hunt, liste « Activities », Lost City, Visitor in the Fog | `yt_OXVXksMyMiw_oar1`, `yt_d_1gOCN5PnQ_oar1`, `yt_Asjwwk8ZVEw_hq1`, `yt_ydkcOVhz-9E_hq2` |
| 27 | Narration / dialogues | Boîte de dialogue, choix, fins notées | `yt_uJ_Wfk0mLbQ_oar1`, `yt_A7LTvIHQhJA_hq1`, `yt_7aAD74K6KrM_max` |
| 28 | Quêtes / tâches | Carte de quête, quêtes secondaires | dans toutes les vues de ville |
| 29 | Classements | Classement de fin d'enchère | `yt_xSVlqbrIvKM_oar3`, `yt_PbTw-bxxrGY_oar3` |
| 30 | Chargement | Écran normal, de Noël, d'Halloween | `yt_Sp6Qfj6V8yU_oar1`, `yt_cafxyf6fy4M_oar2`, `yt_zh9K3gWZbaE_hq1` |
| 31 | Marketing (stores) | 11 compositions | `appstore_en_iphone_01…08`, `gplay_17…20` |
| 32 | Publicités Eyewind | Enchère de conteneur sur camion | `yt_-H-lbq61W5E_oar2`, `yt_C9se2tWxjXM_hq1` |

---

## 2. Ville et HUD

### 2.1 `yt_Iq1QE57VqfM_oar1.jpg` — Ville au niveau 19, EN (écran de référence, le plus proche de la capture de l'utilisateur)

**HUD supérieur** [C], sur une bande de 2 lignes, de gauche à droite :
- portrait carré de l'avatar, cadre doré, badge hexagonal orange « **19** » (niveau) en haut à gauche ;
- **énergie** : éclair bleu, « 60/60 » sur une pilule sombre, bouton carré jaune « + » ;
- **or** : lingot, « 65.97K », « + » ;
- **cash** : liasse verte, « 4.02M », « + ». Les grands nombres sont abrégés en K / M ;
- 2ᵉ ligne : pilule contour blanc « **VIP** », puis pilule de **titre** avec couronne « Global No. 1 » (palier de richesse, cf. §14.3) ;
- à droite, sous le cash : bouton carré sombre en forme d'**engrenage** (paramètres).

**Colonne gauche** [C] : boutons ronds à fond sombre et liseré clair, environ 1/9 de la largeur de l'écran. Les **pastilles rouges** signalent une action en attente. De haut en bas :
1. calendrier coché (connexion quotidienne) ;
2. lingots d'or (pack d'or ou premier achat [I]), pastille ;
3. liasse de billets (pack de cash [I]), pastille ;
4. « AD » barré (supprimer les pubs) ;
5. badge étoilé hexagonal (médailles ou pass [I]), pastille ;
6. **étal à auvent rayé** rouge et blanc (boutique de bonnes affaires [I]), pastille ;
7. « f » Facebook ;
8. boîte de nourriture avec **minuteur « 2d 01:22:37 »** (pack à durée limitée) ;
9. citrouille à chapeau de sorcière (événement d'Halloween) ;
10. chevron « ^ » pour replier ou déplier la colonne.

**Colonne droite** [C] : coupe dorée marquée « S » (saison ou classement [I]), pastille ; cadeau avec minuteur « 09:59 » (cadeau gratuit périodique [I]) ; sablier, pastille ; cadeau rose étoilé, pastille ; **tirelire avec étiquette « 800 » lingots**, pastille ; chevron.

**Carte** [C] : ville isométrique en vue ¾, routes grises et passages piétons. Chaque bâtiment porte une **plaque d'étiquette** sombre semi-transparente avec une icône et un nom en capitales blanches : « MUSEU(M) », « PAWNSHOP » avec une **pastille ronde rouge « ! »**, « COLLEGE », « AUTO SHOP ». Au-dessus du restaurant flotte une **bulle blanche** avec fourchette et couteau (production prête ou interaction disponible [I]). Des PNJ marchent sur les trottoirs.

**Bas gauche** [C] : onglet incliné « SIDE QUEST » avec icône de téléphone, puis presse-papiers violet « ! » marqué « QUESTS » avec un badge « ? » rouge. La carte de quête sombre affiche « Repair 1 items **(0/1)** », la progression en jaune.

**Bas droit** [C] : « Invitation Rewards », avec une icône de partage et un lingot.

**Barre de navigation** [C] : 5 onglets sur fond bois sombre. City (onglet actif, tuile beige surélevée, icône carte et punaise), Mall (étal, pastille), Role (carte de tarot, pastille), Guild (bouclier violet à silhouettes), puis **Auctions**, un **marteau doré surdimensionné qui déborde de la barre**. C'est l'appel à l'action principal.

**Ce que ça révèle** : la ville est un hub qui donne accès à tout. Le HUD mélange les ressources (énergie, or, cash), le statut (niveau, VIP, titre) et environ 15 raccourcis de monétisation ou d'événement rangés en deux colonnes. La quête du moment reste toujours visible.

**À reprendre pour le village du Père Noël** : un HUD sur 2 lignes (ressources, puis statut), deux colonnes repliables pour les offres et événements, et une barre de 5 onglets dont l'action principale (« Tournée » ou « Atelier ») est surdimensionnée. Il vaut mieux limiter les colonnes à 5 ou 6 icônes chacune : Bid Master en affiche jusqu'à 10 par côté, ce qui masque la ville.

### 2.2 `yt_XCUz49gib6c_oar2.jpg` — Ville d'hiver EN (décor de Noël)

- [C] Neige sur les toits et les arbres, bonshommes de neige, tournesols, fontaine.
- [C] Bâtiments : **CASINO** (gothique en brique avec des dés sur le toit), **LIBRARY** (immeuble beige avec badge rouge « ! »), **COLLEGE**, **REPAIR SHOP** (enseigne en forme de clé).
- [C] Colonne droite : portrait « **Limited** » (personnage en vente limitée, halo rouge), **icône de sapin de Noël** avec pastille (événement de Noël, cf. §17.1), coupe « S », cadeau avec minuteur « 03:34 », tirelire « 800 », pick-up (pack véhicule [I]), personnage au chapeau.
- [C] Quête : « Participate in Dallas level auctions and earn 4,000 of dollars (1,915/4,000) ».
- [C] Bas droit : badge « S » avec voiture et minuteur « 1d 00:00:00 ».
- **À retenir** : la saison se traduit par un **habillage de la carte entière** (neige) et une icône d'événement dans la colonne, sans changer l'interface.

### 2.3 `yt_cafxyf6fy4M_oar3.jpg` — Ville d'hiver ES (onglets complets, Métropole visible)

- [C] HUD : énergie « 46/60 », avec au-dessus « **(00:46 +1)** », le compte à rebours avant le prochain point. Or 33, cash 482.23K, titre « Señor Supremo De la Riqueza ».
- [C] Bâtiments : Casino, Biblioteca, Instituto de tasación, Taller de reparaciones. Quête : « Repara 2 de objetos (0/2) ».
- [C] **Barre à 6 onglets** : Ciudad / comercio / Rol / gremio / **Metrópolis** / subasta. La Métropole s'insère en 5ᵉ position, ce qui correspond à la capture de l'utilisateur (Ville, boutique, Rôle, corporation, Métropole, enchères).
- La même ville en russe figure dans `yt_vK9yHm1BRxA_hq2` et `yt_BZyzSPx8PyI_hq1`, en indonésien (Kota / toko / Peran / Guild / Metropolis / lelang) dans `yt_soeIEosGSCI_oar3`.
- **À retenir** : l'onglet Métropole n'apparaît que lorsqu'il est débloqué [I]. Sur la capture de l'utilisateur, il est grisé avec un cadenas : l'onglet est visible avant déblocage, ce qui sert de teaser.

### 2.4 `yt_FnULWK9K7pc_oar3.jpg` — Ville débutant (tutoriel)

- [C] Titre « **Poor Guy** » : le premier palier de titre est volontairement dévalorisant. Énergie 60/60, or 1, cash 2.43K.
- [C] Une **main de tutoriel** blanche pointe le bâtiment INVENTORY. Quête : « Unlock INVENTORY features (0/1) ».
- [C] Un bâtiment est verrouillé par un cadenas « **Lv. 17** ».
- [C] LOCKSMITH : immeuble surmonté d'une **clé géante** dorée.
- Voir aussi `yt_q8iLQ5Q9d2A_hq3` : cadenas « Lv. 6 » et « Lv. 12 », main sur COLLEGE, quête « Participate in 1 auctions in any area (0/1) ». Et `yt_KZi9F6lI5_M_oar1` : titre « Thousandaire », cadenas « Lv 13 », quête terminée « (1/1) », icône « On-hook earnings » (gains hors ligne).
- **À retenir** : les bâtiments **verrouillés par niveau restent visibles sur la carte**, surmontés d'un cadenas et du niveau requis. Le tutoriel avance par quêtes « Débloquer la fonction X ».

### 2.5 `yt_5VAP269cTBs_oar1.jpg` — Quartier « Car Sales » (2ᵉ ville)

- [C] HUD : 60/60, 84.39K, 3.29M, titre « World's Richest ».
- [C] Colonne droite : pile de **minuteurs** (18:36:09, 18:21:41, 18:50:15, 19:11:08) et une étiquette « FREE ».
- [C] Bâtiment « Car Sales » ; **grille de terrains vides** (parcelles constructibles) ; cadenas « Lv. 18 ».
- **À retenir** : chaque quartier est un **lot de parcelles** à remplir.

### 2.6 `yt_LGF2vBLvAvY_oar1.jpg` — Quartier d'appartements (Oakland)

- [C] Tours d'appartements. Au-dessus de chacune : une icône ronde « **0/10** » ou « 0/12 » (locataires) et une **bulle de cash** « 2,080 », « 32,987 », « 27,300 », « 29,491 », la récolte en attente.
- [C] LOCKSMITH, Car Sales ; en haut à gauche « **Limited time set** » (le « Pack Temporaire » de la capture de l'utilisateur) ; en haut à droite « Limited ».
- Voir aussi `yt_PGqzl4vdyRc_hq1` : tours de bureaux sombres avec des bulles 7,474 / 8,861 et une grille de parcelles vides. Et `yt_vK9yHm1BRxA_hq2` : RU, énergie « 65/60 » au-dessus du plafond, tours « 0/5 » et « 0/7 ».
- **À retenir** : le **revenu passif s'affiche en bulle au-dessus du bâtiment** et se récolte d'un tap sur la carte, sans ouvrir d'écran. L'énergie peut dépasser le plafond grâce aux objets et récompenses [C].

### 2.7 `yt_fk-d7Oard-I_oar2.jpg` — Station-service et Mystic Adventure

- [C] Bâtiment « GAS STATION » avec 3 collecteurs ronds au-dessus des pompes (icône cash, compteur « 0 » sur une jauge circulaire).
- [C] Un **cadenas orange rond** « déverrouiller » sur un emplacement de pompe vide. On achète les pompes une par une [I].
- [C] Héliport étiqueté « **Mystic Adventure** » (entrée de la mine / du donjon, §12) ; camion-poubelle.
- [C] Colonne gauche : « Limited time set », personnage vert (pack), calendrier, cash, AD, badge, étal, Facebook. Colonne droite : Limited, cadeau, coupe, « 06:21 », « 2d 03:40:2 », tirelire 800, camion (le « truck » de la capture de l'utilisateur), personnage.
- **À retenir** : un bâtiment de production a **plusieurs sous-emplacements** (pompes), chacun avec son collecteur. On en achète de nouveaux sur place via le cadenas.

### 2.8 `yt_e68gZnIF25s_oar1.jpg` — Quartier chaotique (Métropole)

- [C] Tours de verre futuristes, étiquette « **Chaotic District** » avec « ! » rouge, « **Metropolis Real Estate** ».
- [C] Un immeuble porte la plaque d'état « **Waiting for Collector** » ; cadenas « **Lv. 38** ».
- [C] Colonne gauche : un violet « 7 » (connexion 7 jours [I]) et des cartes dorées (tirage de personnages [I]).
- **À retenir** : la Métropole reprend la grammaire de la ville (plaques, cadenas de niveau) sur un décor plus moderne. Les plaques d'état (« Waiting for Collector ») indiquent ce que le bâtiment attend.

### 2.9 Synthèse « Ville » — ce qu'on peut en tirer

- Toute la boucle passe par la carte : **bulle = prêt**, **« ! » rouge = action**, **cadenas + Lv = verrouillé**, **cadenas orange = achetable**.
- Les quêtes sont toujours à l'écran (carte en bas à gauche) et pointent vers le bâtiment concerné.
- La saison habille toute la carte (neige, citrouilles) : c'est peu coûteux et très visible. Pour le village de Noël, l'hiver est l'état par défaut, et les saisons peuvent devenir **printemps du Pôle**, **aurore boréale**, etc.

---

## 3. Enchère (cœur du jeu)

### 3.1 Déroulé observé, étape par étape

1. **Choix du lieu** sur la carte du monde (`yt_meGCHUXpAPE_hq2`) [C] : carte parchemin brune de la côte ouest des États-Unis, étiquette « Washington ». Des chemins pointillés dorés relient des **nœuds numérotés** ronds (1, 2…), avec des **nœuds étoile blancs** (spéciaux ou boss [I]). Un nœud affiche une vignette photo du lieu. L'onglet Auctions est en surbrillance dans la barre.
2. **Ouverture** (`yt_-R_R6eaDzP0_oar1`, `yt_PpYfJvMDWlQ_max`, `yt_8FlAHfN5420_oar3`) [C] : rideau métallique ou porte de bois / d'église cadenassée, **coupe-boulon rouge** animé qui coupe le cadenas, foule de 4 à 10 enchérisseurs caricaturaux devant.
3. **Inspection** (`yt_19WRk3GnYeo_oar1`, `yt_4R7WDQX6AQ0_oar1`, `yt_KjmlNGV_No8_oar1`) [C] : bandeau jaune sur noir « **Tap an item to inspect it!** », **compteur blanc en bulle** en haut à droite (« 1 », « 3 », « 6 » : inspections restantes), curseur loupe, **barre de progression bleue** au-dessus de l'objet pendant l'inspection. Le résultat est soit une étiquette **turquoise « maybe $2,656 »** (estimation incertaine), soit une **étiquette orange « Printed benches $23x »** (nom et valeur).
4. **Enchères** (`yt_3UZvZ2pQ4Cc_oar2`) [C] :
   - HUD réduit : bouton pause, « **Unit 1/1** » (ou 2/3 : plusieurs box par étape), or, cash ;
   - bulle blanche du commissaire en haut à droite : « Do I hear $4,990 », « Who'll make it $1,200 », « Anyone for $3,940 », « Now $1,690 », puis « Any more bids? **Going Once!** », « **Going Twice!** » (bulle à liseré rouge) ;
   - prix courant en étiquette blanche au-dessus de l'enchérisseur en tête ;
   - pancartes numérotées (80 pour le joueur [I], 22, 52…) ; railleries des rivaux « I am bound to win! », « I need this », « It's mine », « here » ;
   - **jeton de surenchère jaune** « $445+ », « $2,871+ » près du joueur : le **pas de mise** proposé ;
   - pilule « **SPEED X2 ›** » ;
   - rangée de **3 objets bonus** avec stock (coche dorée, tomate, calculatrice ; « 2 », « 30/39/27 », « + » quand le stock est vide) ;
   - deux gros boutons : **PASS** rouge et **BID** vert. Les deux passent au gris pendant que les rivaux répondent.
5. **Bonus « calculatrice »** (`yt_Bsn70bTaUkw_oar2`, `yt_N_nKvltdKO4_oar2`) [C] : pilule verte « **$4,680~$7,020** » sous la foule, la **fourchette de valeur** du box.
6. **Vente** [C] : panneau rouge « **Sold!** » avec un marteau de juge qui tombe (`yt_19WRk3GnYeo_oar2`). Localisé : « Es ist dein! » en DE, « Продано! » en RU.
7. **Révélation** (`yt_TZX42Uh7t-c_oar3`, `yt_Yn4hTTc0ILw_oardefault`) [C] : bandeau « **Click on the item to receive the goods** » ; chaque tap révèle une étiquette orange avec confettis. Panneau translucide en bas : « **Paid: 1,490 / Estimated unit value: 1,642 / Score:** ». La valeur estimée **augmente à chaque révélation** (0 → 40). Bouton « **COLLECT ALL ITEMS** » (`yt_qUBmyFl-iAA_oar3`), puis « SKIP ».
8. **Objet spécial** (`yt_nGD1OeI6Fxk_oar3`) [C] : bannière étoilée « **Vintage car** » avec icône voiture, carte jaune rayonnante, pilule de valeur « 9,200 », « Click Continue ». Le score vert « 2,001 » correspond au **profit** (10 001 − 8 000).
9. **Classement** (`yt_xSVlqbrIvKM_oar3`) [C] : le vainqueur en chibi tient un trophée, avec un **ruban doré** à son nom (« Aidyn »). Quatre lignes en pilule crème : médaille or / argent / bronze / « 4 », avatar, nom (« **YOU** »), barre d'EXP « +15 / +12 / +9 / +8 », gain en cash (1,706 / 50 / 0 / 0). Bouton jaune « CONTINUE ». Le classement se fait **au score (profit)** ; tout le monde gagne de l'XP.

### 3.2 Variantes d'enchère

| Fichier | Variante | Détails [C] |
|---|---|---|
| `yt_6ah00kbcN4Y_oar1` | **CHOOSE ONE** | 3 conteneurs sur un quai avec des étiquettes de fourchette « $0~$5000 » ; une flèche montre le choix. Ailleurs : « $15001~$20000 », « $30001~$50000 » (`yt_y7KnRDnpCkQ_max`). |
| `yt_6ah00kbcN4Y_oar2` | **Enchère conteneur chronométrée** | Sablier « 00:25 » ; colonne de 3 portraits rivaux à gauche ; portrait du joueur avec flèche en bas à droite ; bouton outil jaune « Remove mulches randomly » coûtant 1 lingot (traduction approximative : retirer des rivaux au hasard [I]) ; PASS / BID. |
| `yt_d_1gOCN5PnQ_oar1` | **Dock treasure hunt** (conteneur à l'aveugle) | Popup en forme de distributeur à capsules violet : « Take part in the dock's blind box container auction – no one knows what's inside! ». Piste de paliers 3/6/9/15/21 participations, START, « (Number of entries per day: 0/3) ». |
| `yt_MfhjAOoEYvA_oar1` | **Quai / plage** | Voilier, monster truck, jet-ski sur une jetée ; « Do I hear $9,850 » ; bilan « Paid 16,350 / Est 19,713 / Score 3,363 ». |
| `yt_Bsn70bTaUkw_oar2` | **Cathédrale** | Vitraux, autel doré, tapis. Lieu des objets d'art (Néfertiti, momie, relique au paon). |
| `yt_KhzthGpd3zw_oar2` | **Port / poissonnerie** | Esturgeon géant sur un chevalet. |
| `yt_PbTw-bxxrGY_oar1` | **Port industriel** | Brise-glace en arrière-plan. |
| `appstore_en_iphone_01` | **Maison abandonnée** (marketing) | On mise sur une maison entière, bulle turquoise « $15,000 ». |
| `appstore_en_iphone_02` | **Parking souterrain** (marketing) | Ferraris, panneau « 300000$ ». |
| `yt_-H-lbq61W5E_oar2` | **Publicité Eyewind** | Conteneur sur camion « Container Auction », « Selling Price $10,000 vs Market Price $450 ». Interface publicitaire différente du jeu (PASS violet / BID turquoise). |

### 3.3 Ce qu'on peut en tirer (Noël)

- L'enchère est un **spectacle en 6 temps** (ouvrir, inspecter, miser, adjuger, révéler, classer). Chaque temps a un **signe visuel unique** : coupe-boulon, bandeau d'inspection, bulles du commissaire, marteau, confettis, podium.
- Pour le village : « **Enchère des traîneaux perdus** ». On ouvre la bâche avec des ciseaux à ruban ; on inspecte avec une loupe-lanterne et un compteur de 3 à 6 ; on mise contre des lutins rivaux à pancarte ; les étiquettes passent de « peut-être 40 🍪 » à « Train en bois 120 🍪 ». Le **bilan affiche le profit en vert ou en rouge**.
- La **fourchette de valeur** (calculatrice) donne un bon bonus lisible ; à transposer en « boussole du Père Noël ».
- **Garder** le panneau Paid / Estimated / Score (on lit aussitôt si on a gagné ou perdu). **Éviter** les pertes extrêmes vues (Paid 2,760 / Est 178) : il faut un plancher de valeur.

---

## 4. Chargement du butin (capacité du véhicule)

### `yt_zJjVMMWoGME_oar1.jpg` (aussi `yt_vn7BfW1jdX8_hq3`, `yt_amOnVIl4Lo4_hq1`, `yt_w-07HqhpmsE_hq2`)

- [C] En-tête illustré : **le véhicule du joueur** (citadine rouge, pick-up, GT-R) garé devant un mur de graffitis, avec des cartons.
- [C] Onglets : All / Appraisal / Repair (pastilles rouges).
- [C] Ruban brun « **Select items to take 1/2** ». Selon le véhicule : 3/3, 2/4, 6/12, 2/10.
- [C] Grille de cartes à 3 colonnes. **Couleur de fond = rareté** : vert < bleu < violet < orange / rouge < magenta. Chaque carte porte le nom de l'objet, son prix « $253 » et une coche verte quand elle est sélectionnée.
- [C] Coins de carte : en haut à gauche, une icône de catégorie (colonne antique, voiture, engrenage, manette, lit…) ; en haut à droite, une **clé** (à réparer) ou une **loupe** (à expertiser).
- [C] Bouton jaune « **TAKE TO INVENTORY** ».
- **Système** : la **capacité de chargement du véhicule** limite ce qu'on rapporte. On choisit les meilleurs objets et le reste est perdu [I]. Voir §8, Magasin de voitures, « Cargo Slots ».
- **Noël** : la **hotte ou le traîneau a N places**. Choisir quoi rapporter crée un vrai dilemme. On améliore le traîneau pour porter plus.

---

## 5. Entrepôt / inventaire

### `yt_qqZyXlai0P8_oar1.jpg` (aussi `yt_-0Yj3AklHPQ_oar2`, `yt_LlO3YNj1C7I_hq2`)

- [C] En-tête : icône et « INVENTORY », compteur « **[71/123]** » en rouge et blanc (capacité). La version 2024 indiquait « 149/152 ».
- [C] Portrait « **MANAGER** » en haut à droite : un manager peut être assigné à l'entrepôt.
- [C] Or 1.27K, cash 110.96K.
- [C] Onglets : **All** (jaune, actif) / Appraisal / Repair / **prop** (gris). « prop » contient les objets consommables ou de quête [I].
- [C] Cartes à 3 colonnes :
  - magenta : « Gilded Mummy Coffin $209,583 » ;
  - rouge / orange : « Grand-Prix Sportwagen $80,750 », « Divine Dragon Ancient Urn $8,270 », « Royal Genealogy Scrolls $3,564 », « Victoria's Crown $3,363 », « Aztec Gold Mask $2,897 », « Medieval two-handed sword $2,530 »…
- [C] Rosette dorée = expertisé ; loupe = à expertiser. Icône cadeau flottante en bas à droite.
- **Système** : un stock plafonné et trié par valeur. Les onglets filtrent par l'étape suivante du traitement.
- **Noël** : un « **Entrepôt des cadeaux** » avec les onglets *Tous / À vérifier / À réparer / Emballés*, et une capacité visible en permanence.

---

## 6. Expertise (College / Institut d'expertise)

### 6.1 `yt_ZWleCa7gURo_oar2.jpg` — COLLEGE, EN, haute résolution

- [C] En-tête : icône loupe et « COLLEGE » ; « MANAGER » en haut à droite ; or 1.30K, cash 128.93K.
- [C] À gauche, l'**experte** (rousse en robe blanche) ; au centre, un sarcophage égyptien sur une **scène à rideaux bleus**.
- [C] Deux socles latéraux verrouillés, avec des plaques « **UNLOCK $3.99** » (achat réel) et « **UNLOCK [lingot] 50** » : ce sont des **emplacements supplémentaires** d'expertise.
- [C] Minuteur à **chiffres à palettes** « 44:59 ».
- [C] Boutons : vert « **FAST! 30M** » avec un clap de cinéma (une pub retire 30 min) ; jaune « **[lingot] 4 HURRY!** » (finir tout de suite).
- [C] Une fois fini, la plaque « **READY!** » s'affiche avec le bouton « **RESULT** » (`yt_ZWleCa7gURo_oar3`).
- Variantes : `yt_eOR6IC2s-wk_oar2` (piano, « 36:50 », « 3 HURRY! ») ; `yt_LSa-QYbIfkY_hq3` (RU, « Разблокировать $3.99 / 50 », bouton vert « Быстрая оценка » avec pub, jaune « 6 gold Немедленно ») ; `yt_oAEZfbFzdII_oar3` (une autre experte, brune à lunettes, tailleur bleu) ; `yt_tHfvA0zmVtk_hq2` (ZH 鑑定學院, emplacement vide « + »).
- **Système** : **un seul emplacement gratuit**, deux autres payants. La grille temps / pub / or reste lisible : 1 pub = −30 min, l'or coûte en proportion du temps restant (6, 4, puis 3 lingots à mesure que le minuteur baisse) [C/I].
- **Noël** : un « **Bureau de contrôle des lutins** » avec un lutin-expert, une scène et un minuteur à palettes. Proposer **un 2ᵉ emplacement gagnable en jeu** (et pas seulement en euros) : c'est la principale frustration de Bid Master.

---

## 7. Réparation

### `yt_tHfvA0zmVtk_hq3.jpg` (ZH, 維修廠)

- [C] Ouvrier en casque de chantier et gilet orange ; objet sur un établi ; mur d'engrenages ; étiquette « 已就緒 » (prêt) ; bouton jaune et main de tutoriel.
- [I] Même modèle que le College (un emplacement, minuteur, accélération). Le bâtiment « REPAIR SHOP » apparaît en ville (`yt_XCUz49gib6c_oar2`). La quête « Repair 1 items » est la plus fréquente.
- **Noël** : un « **Atelier de recollage** » avec un lutin bricoleur en salopette.

---

## 8. Voitures (magasin, garages)

### 8.1 `yt_vn7BfW1jdX8_hq2.jpg` — AUTO SHOP (EN)

- [C] Ruban violet avec le nom du modèle « **Street Drifter** », 1 étoile sur 4, voiture de drift JDM blanche.
- [C] Encadré : « **Cargo Slots: 3** / **Return Speed: 15s** ».
- [C] Flèches « « » » pour faire défiler les modèles.
- [C] Boutons : vert « **RENT** » (pastille rouge), sous-titre « Rent for 2 auctions » ; jaune « **500,000 BUY** », sous-titre « **Car Space+1** ».
- RU (`yt_zG_Cdy9q4eM_hq1`, `yt_6iUTMsiTm2E_hq3`) : 4×4 vert « Повелитель Дьявольских Дорог » ★★★★★, capacité 20 à 25, retour 7 s, « Сдано в аренду 1 раз », « 1,000,000 / 5,000,000 Купить ».
- **Système** : le véhicule fixe **la capacité de butin** et **la durée du trajet de retour**. On peut le **louer** pour 2 enchères ou l'**acheter**.

### 8.2 `yt_dFPJ3PCJ02M_hq1.jpg` — Garage souterrain (RU « Подземный гараж »)

- [C] Liste verticale de « plateaux » où sont garées les voitures. Chaque plateau a un ruban avec le nom et les étoiles (« Ретро Мини Ракета ★★★★ », « Высокоскоростной Крейсер ★★★★★ ») et une **pièce dorée** à collecter. Des billets s'envolent quand on collecte (`yt_UnfNEgrzIFI_hq1`).
- [C] Un plateau verrouillé avec un prix vert « 8,500 » (`yt_PbKrcJudh1g_*`).
- **Système** : on expose ses voitures, qui **rapportent un revenu**.

### 8.3 `yt_syrs7Arm8Ms_hq3.jpg` — Garage abandonné (RU « Брошенный гараж »)

- [C] Garage avec une Porsche rouge. Rangée de récompenses. Grille de cartes de **pièces automobiles** : or « $4,000 », violettes « $3,000 / $2,500 / $1,300 », grises avec valeur « ??? » (moteur, toit, siège, radiateur). Bouton vert « Бесплатно » (gratuit, pub).
- [I] Collection de pièces pour reconstruire une voiture (cf. pièces auto dans `BIDMASTER.md`).
- **Noël** : un « **Hangar à traîneaux** » où les traîneaux sont des **véhicules à capacité et vitesse**, à louer ou acheter, et exposés pour du prestige. Les pièces (patins, clochettes) se collectionnent avec des « ??? » à révéler.

---

## 9. Prêteur sur gages et clients

### 9.1 `yt_eOR6IC2s-wk_oar1.jpg` + `yt_twbHAJXsThI_oar1.jpg` — PAWNSHOP (EN, haute résolution)

- [C] En-tête : icône, « PAWNSHOP », « MANAGER » ; portrait de la **prêteuse rousse** (tailleur bleu, collier, loupe) sur fond de boiserie.
- [C] **Étagères à 2 colonnes et 3 rangées** (6 emplacements visibles). Chaque objet occupe une case de bois sombre.
- [C] Sous chaque objet :
  - pilule jaune « **[lingot] 8 OFFER** » : payer 8 lingots pour obtenir l'offre tout de suite. Le coût baisse avec le temps (« 1 OFFER » à 6 min) ;
  - pilule verte « **[clap] 00:45:00 ↓** » : une pub retire 45 min ;
  - texte « **First Offer in ⏱01:31:59** » (minuteur vert).
- [C] Quand un client est là : avatar rond et bulle « **I want to buy it!** », bouton vert « **CHECK OFFER** » ou « GET OFFER » avec pastille.
- [C] Case vide : « **+** » vert, « Add an item! ». Case verrouillée : cadenas rond gris. Deux cases « **★VIP** » réservées aux VIP (`yt_ZdYQyn1V2jg_oar1`).
- [C] En bas : bouton « **CLIENTS** » à gauche, retour à droite. Les billets volent à chaque vente.
- **Système** : de 6 à 8 emplacements de vente en parallèle, chacun avec son minuteur. Le VIP ajoute 2 cases (confirmé dans la boutique VIP, §15.1).

### 9.2 `yt_ENwXH4e-Cn0_oar1.jpg` — Négociation client « GET THE BEST PRICE »

- [C] Popup sur fond sombre, en-tête orange « GET THE BEST PRICE ».
- [C] Client en buste (contremaître avec casque et presse-papiers), bulle « You're gonna love it. Only $ 320,850 ».
- [C] Pilule d'humeur verte avec cœur « **CALM** ».
- [C] Étiquette d'objet « Off-road sports cars » et vignette à cadre rouge.
- [C] Champ « **$123,184** YOUR OFFER », curseur avec boutons « − » et « + ».
- [C] Boutons : bleu « PASS », jaune « **OFFER** ».
- [C] Résultat (`_oar2`) : en-tête « CLIENTS », compteur 1/2, « **IT'S YOURS!** » sous des projecteurs, carte « VALUE: $115,000 • PAID: $102,851 • **PROFIT MARGIN: $+12,149** » (en vert), validation par un rond coché.
- [C] Popup « Cliente » en ES (`yt_cafxyf6fy4M_oar1`) : jeune homme avec un avion miniature sur un plateau, « 2/2 » (clients restants).
- **Système** : des PNJ viennent **vendre** des objets. On marchande avec un curseur, et l'humeur du client (CALM, …) détermine sa tolérance [I]. C'est un mini-jeu de prix, distinct de l'enchère.
- **Noël** : des « **Visiteurs du marché** » (rennes, bonhommes de neige) qui proposent des jouets. Un curseur d'offre et une **humeur affichée** (joyeux, grognon) suffisent à créer un vrai mini-jeu.

---

## 10. Free Market (boîte mystère / échange)

### `yt_ZWleCa7gURo_oar1.jpg` et `yt_qqZyXlai0P8_oar2.jpg`

- [C] « FREE MARKET » avec MANAGER. Un marchand aux cheveux gris en costume compte des billets à côté d'un **cube jaune géant « ?? »**, plaque « READY! », bouton « RESULT ».
- [C] Écran d'échange :
  - titre « **Gilded Mummy Coffin** », étiquette « Priceless », grand sarcophage, loupe, **flèches circulaires d'échange** ;
  - en petit à droite, la carte de l'objet du joueur « $209,583 » ;
  - ligne de valeur « **$74,095 (−65%)** » (écart en rouge) ;
  - boutons : jaune « [lingot] 32 **TRADE** » avec « **(1/10)** » (échanges du jour), bleu « **COLLECT** ».
  - Un 2ᵉ essai donne « $76,212 (−64%) (3/10) ».
- **Système** : on dépose un objet et on reçoit une contre-offre aléatoire. On la garde (COLLECT) ou on relance contre de l'or, 10 fois par jour au maximum. C'est une **machine à sous déguisée**.
- **Noël** : un « **Troc du Pôle** », plutôt **déterministe** (choix entre 3 contre-offres visibles), pour éviter le côté loterie.

---

## 11. Musée

### 11.1 `yt_lWNtUoZyrqs_oar2.jpg` — Intérieur, vue de dessus

- [C] Sol gris clair, murs moulurés. **Socles à cadre de bois et plateau crème**, chacun avec une **plaque de prix** : harpe « $9,000 », presse à imprimer « $5,950 », buste Moai « $150 », vase grec « $105 ». Un socle vide porte un « **+** ».
- [C] En haut à gauche, compteur « **965** » (recette de billets accumulée, icône ticket) et icône de **plan d'étage**.
- [C] En haut à droite, un **escalier** avec double chevron (étage suivant). Flèches jaunes « « » » pour changer de salle. Un « ! » d'aide en bas à gauche.
- Variantes : `yt_XCUz49gib6c_oar1` (boule-œil $12,000, Zeus $6,200, tête de Bouddha $11,640, démon ailé $8,800, livre $18,500 ; grands et petits socles) ; `yt_PYUWPYhhU1U_oar3` (socles **verrouillés** avec cadenas) ; `yt_v0GxfCp8s8E_oar1` (7 exemplaires du même tout-terrain, compteur 222,394).

### 11.2 `yt_lWNtUoZyrqs_oar3.jpg` — Popup INCOME

- [C] En-tête orange « INCOME », X.
- [C] « Ticket prices & Number of tourists » : ticket « $5 », visiteurs « x156 ». Carte violette cash « 965 ».
- [C] Boutons : jaune « **CLAIM** », vert « **DOUBLE X2** » (clap = pub), « **Frequency: 0/5** » (5 doublements par jour).
- [C] « Tip 1: Placing more different exhibits increases ticket income. » / « Tip 2: Too many identical exhibits reduce visitor interest. (Each identical item reduces income by 2%) ».
- **Système** : le revenu vaut le prix du billet multiplié par le nombre de visiteurs. **La variété est récompensée** et les doublons pénalisés (−2 % par objet identique). Il y a plusieurs étages et salles, et des socles à débloquer.
- **Noël** : le « **Musée des jouets anciens** » reprend tel quel la **règle de variété**, très bonne et lisible. Prévoir des étages thématiques et la pub ×2 plafonnée à 5 par jour (ou une alternative sans pub).

### 11.3 Collection — `yt_B-8HUWmm7VA_hq3.jpg` (basse résolution)

- [C] « MY COLLECTION », onglets de rareté colorés (Common / Uncommon / Rare / Legendary / Epic). Cartes vertes : Puma Sneakers $220, Tear-resistant fabric $100, Abstract Human Head $15, Artistic Rubik's Cube $15, Sketchpad $160. Barre « Collection Progress » et bouton jaune.
- **Noël** : un « **Livre des jouets** », codex par rareté avec une progression récompensée. C'est la Bibliothèque [I].

---

## 12. Mystic Adventure / mine

### 12.1 `yt_cRIhiWXSvTc_oar2.jpg` — Donjon (pyramide), haute résolution

- [C] Badge rond « **10TH FLOOR** ».
- [C] Barre de statistiques : cœur 78 (PV), épée 33 (ATQ), bouclier 27 (DÉF), (i). Deuxième ligne : clés 0, bombes 1, coffre « (10/10) ».
- [C] Grille de **cases de sable** à creuser : cristaux bleus (minerai), pièges à pointes, « ? » mystères, bombes, pioche, **escalier** (sortie).
- [C] Explorateur avec pioche ; momie-pharaon embusquée en bordure.
- [C] En bas : jauge de pioche « **1/60** » et minuteur de recharge « 00:17 » (énergie propre au mini-jeu), boutons « Monster Notes » (bestiaire) et « Power-up items », retour.

### 12.2 `yt_cRIhiWXSvTc_oar1.jpg` — Combat « VS »

- [C] Ruban « VS » sur demi-cercle bleu et rouge. Fiches : « RazvanX » ATK 33 / DEF 27 / HP 78 contre « mummy » ATK 18 / DEF 8 / HP 55, puis « pharaoh » ATK 26 / DEF 15 / HP 118.
- [C] Barres de PV, dégâts « −0 », bouton bleu « PASS » (« Melompati » en ID : fuir). Temple doré avec statues d'Anubis.
- RU : pack « Набор приключений » (clé ×10, bombe ×15, pioche ×120) en vente (`yt_al0lrRTbyJE_hq1`). Boss final pharaon (`yt_soeIEosGSCI` d'après le titre).

### 12.3 `yt_egsEb-JQ9H4_oar1.jpg` — Mine coopérative (PT)

- [C] Bandeau « Recompensas de Escavação — Todos os objetivos de recompensa concluídos ».
- [C] 4 portraits de joueurs Lv.400 aux coins, chacun avec sa **contribution** en gemmes vertes (4.93M, 142.31M, 25.72B, 834.74B).
- [C] Au centre : « **0/160T** » et « **Cliques Diários 966/1,000** » (taps plafonnés à 1 000 par jour). Tas d'émeraudes avec 3 **pioches dorées** (points d'amélioration). Des chibis creusent ; foreuse géante en bas ; bouton « Retornar ».
- **Système** : un clicker coopératif (guilde [I]) avec plafond quotidien.
- **Noël** : la « **Mine de cristaux de glace** » en donjon à étages (énergie propre, bestiaire de bonhommes de neige farceurs), plus une **mine de guilde à taps plafonnés**.

---

## 13. Casino, Monopoly, Rescue Beauty, Restaurant, Pêche, Recyclage, Banque, Appartements

### 13.1 Casino — `yt_YkhcMVWJbSY_oardefault.jpg` et `_oar1`

- [C] En-tête « CASINO » et avatar. Hôtesse en robe dorée. Deux grandes tuiles : « **SLOT MACHINE** » (enseigne BIG WIN 777) et « **WHEEL OF FORTUNE** » (disque bleu, pointeur flamme).
- [C] Version RU : 4 tuiles, dont cartes et jetons (BLACK 21) et dés (`yt_imYPSjmMWLo_hq1`).
- [C] Popup roue : ruban violet, X, roue néon violette à 10 secteurs (lingots 1/2/5/10, cash 100/200/400/1,000). Boutons jaune « **[lingot] 2 START** », vert « **[clap] FREE** », (i).
- **Noël** : remplacer le casino par une « **Roue de la Saint-Nicolas** » gratuite une fois par jour, sans mise en or.

### 13.2 City of Monopoly — `yt_MzURWKnBhwY_oar3.jpg`

- [C] Plateau isométrique sur pavés. Cases bleues « +300 / +500 / +200 » (coupons de points), jaunes (immeuble), roses avec dé arc-en-ciel (rejouer), orange « ? » (chance), verte (borne d'arcade), maison.
- [C] Le pion du joueur est sur une **case rouge « prison »** : bandeau rouge « …specified number of points to escape », dé, bouton bleu avec clap « **escape** » (pub).
- [C] Gros **bouton rond orange avec dé** (lancer), « **Redemption shop** » (panier rouge de coupons), dé doré en bas à gauche, retour jaune.
- [C] Compteur de dés « 20/20 », « 4/20 » (`yt_JUShRNHkzBc_hq3`, `yt_zG_Cdy9q4eM_hq3`). Le bâtiment City of Monopoly est en ville (`yt_MzURWKnBhwY_oar2`).
- **Noël** : un « **Village-opoly** » avec des dés-flocons, une boutique de coupons et des cases-maisons du village.

### 13.3 Rescue Beauty — `yt_wI9QeNxOXCw_hq1.jpg`, `yt_O3hw6K96zDA_hq3.jpg`

- [C] « Rescue Beauty » / « Спасательная красота ». Récompenses : cash 500 (carte violette), or 2. Une femme derrière des barreaux dit « Help! ».
- [C] Cartes de résultat « ? » (« Secret card ») et tête de mort (« Miss »). Grille 3×3 de cartes face cachée : « Click on the card to find the girl ».
- [I] Mini-jeu de mémoire / chance, publicitaire. **À ne pas reprendre** (thème).

### 13.4 Restaurant — `yt_UnfNEgrzIFI_hq3.jpg`

- [C] « Ресторан » / « RESTAURANT ». Chef en buste, cloche argentée, **minuteur « 00:59:27 » sous la cloche**, bulle « …тоже нужен перерыв…, подождите минутку » (le chef fait une pause).
- [C] Version BR : bouton « + » pour ajouter un plat (`yt_FydxD1tdybY_hq2`).
- **Noël** : la « **Boulangerie de Mère Noël** », dont la recette cuit pendant un minuteur affiché sous la cloche.

### 13.5 Pêche et aquarium — `yt_YwqgTxCUebU_oar1/2`, `yt_r8c1ZF-SrT8_max`

- [C] Bateau blanc à quai, gros bouton doré « **Go fishing** », compteur de lancers « 10/10 », skyline.
- [C] En pêche : « TIME LEFT: 11 s », ligne, marqueur de poisson avec distance « 4.5M », **jauge verticale dégradée** à droite, gros bouton « **Pull the rod** » (icône ancre), consigne « Press and hold the button to control the cursor in the green area ».
- [C] Aquarium : scène sous-marine avec épave ; les poissons pêchés nagent.
- **Noël** : « **Pêche sous la glace** », où l'on maintient le curseur dans la zone verte ; aquarium d'hiver.

### 13.6 Usine de recyclage — `yt_KmM-SHgnDxo_oar2.jpg`

- [C] Broyeur jaune à deux vis. Panneau « **Aterro sanitário 970/12000** » (stock et plafond de la décharge), « **Velocidade (01:00) 240** » (débit par minute), « Lucro/unidade » (profit par unité).
- [C] Panneau en bas à gauche « **Lucro da usina 3,984,750** », pastille rouge (à collecter). En bas à droite : « Aguardando transporte 970 » et bouton camion « **Caminhões de coleta »** » (camions de collecte).
- **Système** : chaîne de production idle (stock, débit, profit unitaire, collecte), avec une amélioration des camions [I].
- **Noël** : un « **Atelier de recyclage du papier cadeau** » avec stock, débit et collecte.

### 13.7 Banque — `yt_B-8HUWmm7VA_hq2.jpg` (basse résolution)

- [C] « FIXED VAULT » : « Deposit Amount $2,352 », taux d'environ 2,95 % [I : lecture floue], « Max Deposit $1,000,000 ».
- [C] Curseur avec boutons 25 % / 50 % / 75 % / MAX. « Select Fixed Deposit Term » : 3 Days / 5 Days / 7 Days. Jaune « Confirm Fixed Deposit ». « Orders Held: 2 » et « View Details ».
- **Noël** : la « **Banque des étrennes** », dépôt à terme de 3 / 5 / 7 jours. Le système est simple et peut être repris tel quel.

### 13.8 Appartements — `yt_LlO3YNj1C7I_hq3.jpg`, `yt_TMThHKxdNzk_hq3.jpg`

- [C] Gérante âgée à lunettes rouges. « Apartment No.1 / No.2 (LV 1) », « Tenants 5/5 » avec silhouettes, « Current rental income $1 / 50 », bouton jaune (amélioration [I]).
- [C] La quête « Any apartment reaches level 3 (2/3) » confirme des niveaux d'appartement.
- **Noël** : des « **Chalets des lutins** » de niveau 1 à N, avec locataires et loyer en biscuits.

---

## 14. Rôle, personnages, profil

### 14.1 Galerie de personnages — `yt_vFmTNJZGxXo_hq1.jpg` (RU), `yt_Hx98-C5Mc4Q_hq*`

- [C] Fond de velours rouge sombre. Grille de 3, 4 puis 3 **cartes-portraits**. Cadre doré, bleu ou violet selon la rareté ; compteurs « X15 », « X1 », « X10 » (doublons ou fragments).

### 14.2 Carte de personnage — `yt_OXVXksMyMiw_oar3.jpg`

- [C] Ruban violet « **Poco común** » (Peu commun), nom « **Bomba Jason** », icône ronde à gauche, icône cible à droite.
- [C] Brute masquée avec batte devant un **NIGHTCLUB** néon ; 2 carrés de compétence (poing, explosion).
- **Révélations** [C] : personnage sous projecteur rouge, sur damier (`yt_b3lkduTNGdM`, `yt_ugsGy6MfyT8_hq1`, `yt_r8c1ZF-SrT8_hq1`). Légende « Дополнительный доход увеличивается на 12% » (revenu supplémentaire +12 %). Chaque personnage donne donc un **bonus passif** [C].
- **Combat de gang** (`yt_e68gZnIF25s_oar2`) [C] : rue de nuit, équipe du joueur (gangster au fusil, ninja, cowboy) contre des détenus en combinaison orange. Barres de PV, dégâts « −167 / −121 / −497 », boutons « x1 / x2 (verrouillé) / Auto », rangée de 5 cartes de personnage.
- **Système** : le Rôle est une **collection de personnages-cartes** (rareté, doublons) qui donnent des bonus de revenu et se battent en automatique dans la Métropole / Quartier chaotique [I].
- **Noël** : des « **Lutins vedettes** » à collectionner, chacun avec un bonus (+12 % sur un bâtiment). **Pas de combat** ; plutôt une « mission » automatique (livraison).

### 14.3 Profil, avatar, titres

- `yt_PYUWPYhhU1U_oar1` [C] : popup avec une **pince à dessin jaune** en haut à gauche (style dossier) et un X. Onglets « avatar » (jaune, actif) / « Avatar frame » (pastille). Grille de 4 colonnes de portraits : le portrait choisi a une coche verte et un fond jaune, les autres sont grisés avec un cadenas. « How to obtain: Obtained by permanently unlocking the corresponding costume ». Bouton jaune « **In use ✓** ».
- `yt_w-07HqhpmsE_hq3` [C] : profil sur panneau rouge, avatar en tenue (bandana, blouson rouge), bouton jaune de mode, titre « World's Richest ». « **General Stats** » : Cash 5,132,950 / Gold 119,192 / Level 21.Miami. Icône Facebook.
- `yt_5VAP269cTBs_oar3` [C] : « **My struggle** ». Couronne dorée en en-tête et **paliers hexagonaux** avec ruban de titre : Global No. 1 / World's Richest / Wealth Dominator / Global Tycoon. Trône ; « Earn: $9999999 » et bouton « CLAIM » ; récompense 20,000 cash + 25 or ; tampons « COMPLETED ». Pied : « The current total amount of banknotes obtained: $5547259 ».
- **Titres observés** [C], du plus bas au plus haut [I] : Poor Guy → Thousandaire → Industrialist → Business Leader → Auction Tycoon → Auction Legend → World's Richest → Wealth Dominator → Global Tycoon → Global No. 1. Le « Grand Capitaliste » de l'utilisateur est un palier intermédiaire en VF [I].
- **Système** : le **titre dépend des gains cumulés**, pas du solde. Chaque palier se réclame et rapporte quelque chose.
- **Noël** : des titres de « **Lutin stagiaire** » à « **Grand Intendant du Pôle** », selon le total de cadeaux livrés.

---

## 15. Boutique, VIP, packs

### 15.1 `yt_xTpbuGRgvbE_oar3.jpg` — Popup Mall (ouvert pendant une enchère)

- [C] Le HUD complet passe au-dessus du popup : avatar niv. 18, énergie **130/60**, or 55, cash 44.54K, VIP, titre « Auction Tycoon ».
- [C] Boutique au **store rayé festonné** et grand nœud rouge. Onglets : **VIP** (actif) / GIFT / GOLD / MONEY.
- [C] Deux cartes VIP avec la secrétaire en illustration :
  - « **VIP 7 DAYS** », bandeau « SUPER VALUE 1500% », **$9.99 / 7 days** ;
  - « **VIP 30 DAYS** », bandeau « SUPER VALUE 3000% », **$19.99 / 30 days** ;
  - avantages identiques : « Energy Max to 90 », « **+2 Pawn Shop Slots** », « SPEED X2 », « 2x EXP », « NO ADS (30 times daily) ».
- [C] Bannière « **7 days Login gift pack** » (25 % OFF), « Claim every day for seven consecutive days » : 110 or + 16,200 cash, **$5.99**.
- [C] Bouton bleu « NO, THANKS ».
- **Système** : le VIP agit sur les leviers du cœur de jeu (énergie max, emplacements du prêteur, vitesse, XP). « No ads » est plafonné à 30 par jour, ce qui confirme les critiques des joueurs.

### 15.2 Mecha Outfit (tirage) — `yt_Q3sfRAmjNCw_hq3.jpg`

- [C] « Mecha Outfit », « Limited Time UP! », « Remaining 30 days », illustration de robot, bonus « Increase cash income +12% ».
- [C] Rangée de portraits de tenues ; boutons hexagonaux jaunes x1 / x10 (coût en or) ; case « Skip draw animation » ; icône SHOP.
- **Système** : un gacha de **costumes à bonus permanent**, qui débloquent aussi les avatars (§14.3).

### 15.3 Packs

- [C] « Набор приключений » (§12.2). Colonne gauche de la ville : « Limited time set », packs minutés « 2d 01:22:37 », « 13d 03:47:42 » (`yt_vn7BfW1jdX8_hq1`).
- **Noël** : une boutique sur 4 onglets, au store rayé rouge et blanc (déjà très Noël). Un « pass » unique **sans** formule « SUPER VALUE 3000 % ».

---

## 16. Quêtes et tâches

- [C] Carte de quête (toutes les villes) : presse-papiers violet « ! » avec badge « ? », texte blanc et progression jaune entre parenthèses.
- [C] Exemples relevés :
  - « Repair 1 items (0/1) » ;
  - « Participate in 3 auctions in any area (0/3) » ;
  - « Complete the level Miami and earn $6,500 (3,942/6,500) » ;
  - « Get first place in Seattle level (1/1) » ;
  - « Use 2 boot items in auctions (1/2) » ;
  - « List 1 of items in the Pawn Shop (0/1) » ;
  - « Unlock REPAIR SHOP features (4/1) » (sic) ;
  - « Any apartment reaches level 3 (2/3) » ;
  - « Membuka 2 brankas (1/2) » (ouvrir 2 coffres, donc serrurier) ;
  - bug de « (−13,350/3,800) » (progression négative).
- [C] « SIDE QUEST » / « Missões secundárias » / « Misiones secundarias » : une icône de **téléphone orange** au-dessus de la carte de quête (les « quêtes secondaires » de l'utilisateur).
- **Noël** : une carte de quête toujours visible, **une seule quête principale à la fois** et le téléphone (ou une lettre au Père Noël) pour les quêtes secondaires. **Valider les compteurs** (pas de valeur négative, pas de 4/1).

---

## 17. Événements et narration

### 17.1 Sapin de Noël — `yt_OXVXksMyMiw_oar1.jpg` (le plus utile pour le projet)

- [C] Fond de nuit enneigée. Une enseigne de Noël (houx, bord de neige) pend à deux cordes. En titre rouge : « ⏱ Tiempo Restante: **55d** 23:03:34 ». En texte : « Elija un paquete diario, reclámelo mañana! Nuevos paquetes tras reclamar. »
- [C] Sapin décoré de **10 paquets rouges à nœud doré** disposés en triangle. Chacun porte un médaillon sombre avec le **type de récompense et « ??? »** (liasse de cash, boîte d'or, ticket, coffre violet, éclair d'énergie, tomate-bonus, objet rose…). Les paquets déjà réclamés sont grisés avec une coche verte.
- [C] Bouton jaune enneigé « **Make a wish** » ; retour en bas à droite.
- **Système** : on choisit un paquet par jour, on le réclame le lendemain, sur 55 jours. On connaît le type de récompense mais pas la quantité. L'événement donne une **raison de revenir le lendemain**.
- **Noël** : à reprendre directement en **calendrier de l'Avent** (« Choisis une boule aujourd'hui, ouvre-la demain »).

### 17.2 Liste « Activities » — `yt_Asjwwk8ZVEw_hq1.jpg`

- [C] Popup à cadre violet, liste de bannières d'événements (« Season outfit available for a limited time », « Visitor in the Fog (Phase 2) », manoir), chacune avec un bouton jaune. Coins « New » rouges ; minuteurs « 00:00:00 » et « Enter ».

### 17.3 Narration (Lost City, Visitor in the Fog)

- [C] Écran titre : grand logo en œil ; boutons « Start Game » (jaune, sous-titre « Remaining Attempts »), « Continue Game », « Adventure Log » (`yt_ydkcOVhz-9E`, `yt_R0mNWuHfogs_max`).
- [C] Journal : onglets « Story Endings / Clues », grille de cartes de fin (« The Vanished Him », « Left With Nothing », « Total Loss », « Known to All », « Dawn's First Light »), cartes « ? » « Not Found ». Barre « **Ending Progress Reward** » avec loupe et coffres à 50 / 75 / 100 %.
- [C] Cartes de fin notées **SSS / SS / B / C**. Partage : « Share your achievements on BID MASTER's Facebook page for a chance to win a mystery reward ».
- [C] Dialogue (`yt_uJ_Wfk0mLbQ_oar1`) : personnage en buste réaliste, cartouche « Jeff » et boîte blanche « Kristen, why are… ». Choix (« Raise Doubt », « Inspect Ship Hull », « Jeff Goes First / Go First Yourself ») sous un médaillon « **Major Decision** ».
- [C] Objets légendaires (`yt_Q151ROQIreM_max`) : popup beige, en-tête orange, étiquette « LEGENDARY », icône sur fond orange, pilule de prix « $80,000 ».
- **Noël** : un conte à embranchements (« Le traîneau perdu dans le brouillard ») avec un journal des fins et une progression récompensée.

---

## 18. Écrans de chargement et visuels marketing

- `yt_Sp6Qfj6V8yU_oar1` [C] : logo BID MASTER (lettres rouges et jaunes à contour noir épais) peint sur une porte de garage, SUV vert, billets qui volent, barre de progression jaune.
- `yt_cafxyf6fy4M_oar2` [C] : version de Noël (guirlande, cadeaux, jeep), « Toque de nuevo para salir ». `yt_zh9K3gWZbaE_hq1` : bonhomme de neige en bonnet de Père Noël, sapin. `yt_w-07HqhpmsE_hq1` : version d'Halloween (citrouille, toile d'araignée).
- `appstore_en_iphone_01…08`, iPad (mêmes illustrations, cadre 3:4), `appstore_ptbr_*` (« Nível », « LANCE »), `gplay_01…16` (paysage) [C] :
  - décors **semi-réalistes peints** (maison abandonnée, parking, box, conteneur) ;
  - **enchérisseurs caricaturaux au premier plan**, avec de grandes pancartes « BID 001 / 023 / 009 » ;
  - un objet-héros sous projecteurs (Coccinelle jaune, montre en or qui jaillit d'un carton, McLaren dorée) ;
  - bulle turquoise de prix « $15,000 », silhouettes noires étiquetées « $??? » ;
  - HUD « Unit 2/6 » ;
  - `gplay_17-18` : homme barbu devant un garage jaune, pick-up bâché « BID $7,000 » ; `gplay_19-20` : manoir en ruine avec une Ferrari rouge dans le garage.
- **Noël** : un écran de chargement **saisonnier** (déjà le cas chez eux). En marketing, une scène peinte et des personnages caricaturaux à grosse tête au premier plan.

---

## 19. Synthèse du langage visuel (règles concrètes)

### 19.1 Structure d'écran

1. **Trois zones fixes** : HUD en haut (2 lignes), contenu au centre, barre d'onglets en bas (5 ou 6 onglets). Dans les écrans de bâtiment, la barre d'onglets disparaît et un **bouton retour carré** (flèche courbe) apparaît **en bas à droite** [C].
2. **Écran de bâtiment = en-tête + PNJ + scène + actions** : bandeau titre (icône et nom en capitales blanches, à gauche ; portrait « MANAGER » à droite), **mini-HUD or et cash**, grande illustration du PNJ propriétaire (experte, prêteuse, chef, hôtesse, gérante) dans le tiers supérieur, zone de travail (scène, étagères, socles) au milieu, **1 ou 2 gros boutons** en bas [C].
3. **Les popups** se posent sur un voile noir à environ 60 %, avec en-tête coloré (orange pour les gains et actions, violet pour les événements et le casino) et **X blanc en haut à droite**. Le corps est crème ou beige ; il y a une seule action principale, plus éventuellement une action pub en vert [C].

### 19.2 Codes couleur des boutons

| Couleur | Sens | Exemples [C] |
|---|---|---|
| **Jaune / doré**, dégradé, texte blanc ombré | Action principale ou payer en or | BID (enchère conteneur), START, CLAIM, RESULT, TAKE TO INVENTORY, HURRY!, BUY, In use |
| **Vert** | Valider, gratuit, **pub (avec un clap de cinéma)** | BID, FREE, FAST! 30M, DOUBLE X2, CHECK OFFER, RENT |
| **Rouge** | Refuser ou passer | PASS |
| **Bleu** | Option secondaire ou neutre | PASS (négociation), COLLECT, NO THANKS, escape |
| **Gris** | Désactivé (attente des rivaux) | PASS / BID grisés |

- **Règle** : le **clap de cinéma** signale toujours une pub, et le **lingot** sur le bouton signale toujours une dépense d'or. Le joueur sait ce que coûte une action **avant** de taper.

### 19.3 Rareté

- Fond de carte plein : **vert** (commun) → **bleu** → **violet** → **orange / rouge** → **magenta** (inestimable). C'est la même échelle dans le butin, l'inventaire et les récompenses [C].
- Cadres de personnages : doré, bleu, violet. Ruban de rareté nommé (« Poco común ») [C].

### 19.4 Signalétique sur la carte

- **Pastille rouge** = quelque chose à faire ; **« ! » rouge** sur une plaque = bâtiment à visiter ; **bulle blanche avec icône** = production prête ; **bulle de cash avec montant** = récolte ; **cadenas gris + « Lv. N »** = verrouillé par niveau ; **cadenas orange rond** = achetable ; **minuteur sous une icône** = offre limitée ; **compteur « 0/10 »** sur une jauge ronde = occupation [C].

### 19.5 Typographie et chiffres

- Sans-serif grasse arrondie, capitales pour les titres. **Texte blanc avec contour ou ombre sombre** sur les boutons. Le titre du jeu est un lettrage cartoon rouge et jaune à gros contour [C].
- Les nombres sont abrégés (4.02M, 65.97K) dans le HUD et complets dans les bilans (1,490). Les gains et la marge sont en **vert**, les pertes et pourcentages négatifs en **rouge** (« −65% ») [C].
- Les **minuteurs sont omniprésents**, en vert (« ⏱01:31:59 ») ou en chiffres à palettes (College) [C].

### 19.6 Feedback

- Billets qui volent à chaque gain, confettis à chaque révélation, projecteurs pour les objets rares et les personnages, marteau qui tombe, tampons « COMPLETED ». Les railleries des rivaux en bulles rendent l'enchère vivante [C].

### 19.7 Densité

- La ville est **très dense** : jusqu'à 10 icônes par colonne, plus la quête, plus le bouton d'invitation. Les écrans de bâtiment sont au contraire **aérés** : un PNJ, une scène, 2 boutons. Le contraste entre une ville chargée et des bâtiments sobres est voulu [I], mais la ville déborde.

### 19.8 Règles à appliquer au village de Noël

1. HUD : `[Avatar+niveau] [Énergie rennes n/max +] [Étoiles (or) +] [Biscuits (cash) +]`. En 2ᵉ ligne : `[VIP] [Titre]`, et l'engrenage à droite.
2. Barre de 5 onglets : Village / Boutique / Lutins / Guilde / **Tournée** (surdimensionnée, ex. clochette dorée).
3. 6 icônes au maximum par colonne latérale, repliables. Toujours une **icône d'événement saisonnier** en tête de colonne droite.
4. Code fixe : jaune = action principale, vert = gratuit ou valider, rouge = passer, bleu = secondaire. Toute dépense affiche son icône de monnaie.
5. Rareté sur 5 couleurs, identique partout.
6. Chaque bâtiment a son PNJ (lutin) dans le tiers haut, et 1 ou 2 boutons en bas.
7. Bulles de récolte sur la carte, pour éviter d'ouvrir un écran juste pour collecter.
8. Bilans chiffrés lisibles : Payé / Valeur / Profit en vert ou rouge.

---

## 20. Systèmes sans capture trouvée

| Système | État | Notes |
|---|---|---|
| **Corporation / Guilde** (écran principal, chat, boutique de guilde, base) | **Aucun écran** | Seul l'onglet « Guild » de la barre [C] ; la mine coopérative (§12.3) en est probablement une activité [I]. |
| **Métropole** (écran dédié, construction, maison de rêve) | **Partiel** | Onglet Métropole [C], Quartier chaotique et « Metropolis Real Estate » [C], combat de gang [C] ; pas d'écran de gestion de propriété. |
| **Mall (onglet boutique complet)** | Partiel | Seul le popup VIP / GIFT / GOLD / MONEY est visible ; les onglets GIFT, GOLD et MONEY n'ont pas été vus. |
| **Bibliothèque** | Bâtiment seulement | « LIBRARY » sur la carte [C] ; écran intérieur non trouvé. La collection (§11.3) en est peut-être le contenu [I]. |
| **Serrurier** | Bâtiment et quête | « LOCKSMITH » avec clé géante [C], quête « ouvrir 2 coffres » [C] ; pas d'écran. |
| **Bourse** | Aucun | Mentionnée dans les titres de vidéo (« Bank and Stock Exchange ») ; images non exploitables. |
| **Nightclub** (gestion) | Partiel | Façade et personnage « Bomba Jason » [C] ; pas d'écran de gestion. |
| **Station-service** (intérieur), **Usine automobile**, **Centre de transport / gare** | Partiel ou aucun | Station visible en ville seulement. |
| **Manoir du collectionneur**, **Cour des familiers** (animaux), **Maison de l'inventeur** | Aucun | |
| **Paramètres** (engrenage), **Courrier** (mail) | Aucun | |
| **Classements globaux** (hors enchère), **Guild League** (« S1 Guild League ») | Icône seulement | `yt_jXY_NhzveKo_max`. |
| **Connexion 7 jours** (écran), **Tirelire** (écran d'achat), **Roue d'or**, **Pass de saison** | Icônes seulement | Tirelire « 800 » [C]. |
| **Machine à sous** (écran de jeu), **BLACK 21**, **Lucky Dice** | Tuile seulement | |
| **Secrétaire** | Partiel | Popup de récompense « Бонус секретаря » (×88 → ×110) avec la secrétaire agenouillée [C] (`yt_hQzkpCEvGjU_max`, basse résolution) ; illustration de la boutique VIP. |

---

## 21. Fichiers les plus utiles à ouvrir en premier

`yt_Iq1QE57VqfM_oar1` (ville et HUD) · `yt_XCUz49gib6c_oar2` (ville d'hiver) · `yt_3UZvZ2pQ4Cc_oar2` (enchère) · `yt_xSVlqbrIvKM_oar3` (classement) · `yt_zJjVMMWoGME_oar1` (butin) · `yt_qqZyXlai0P8_oar1` (inventaire) · `yt_ZWleCa7gURo_oar2` (expertise) · `yt_eOR6IC2s-wk_oar1` (prêteur) · `yt_ENwXH4e-Cn0_oar1` (négociation) · `yt_lWNtUoZyrqs_oar2` et `_oar3` (musée) · `yt_OXVXksMyMiw_oar1` (sapin de Noël) · `yt_xTpbuGRgvbE_oar3` (VIP) · `yt_MzURWKnBhwY_oar3` (Monopoly) · `yt_cRIhiWXSvTc_oar2` (donjon) · `yt_KmM-SHgnDxo_oar2` (recyclage) · `yt_YwqgTxCUebU_oar2` (pêche) · `yt_PYUWPYhhU1U_oar1` (avatar) · `yt_5VAP269cTBs_oar3` (titres).
