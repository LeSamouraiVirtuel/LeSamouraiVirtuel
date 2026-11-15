# Rythme de progression : ce que font vraiment Township, Hay Day, Clash of Clans, Bid Master et Dragons of Atlantis

> Recherche faite le 4 novembre 2026. Elle répond à la remarque du propriétaire : « un niveau toutes les 10-15 minutes, linéaire, c'est faux ».
> Il a raison. Dans les cinq jeux, **le temps par niveau grandit avec le niveau**, d'un facteur d'environ **×1 000** entre le niveau 2 (une minute) et le niveau 50-60 (une semaine).
>
> **Méthode.** Les tables d'XP, de minuteurs et de déblocages ont été lues **dans le wikitext brut** des wikis Fandom (API MediaWiki publique) : Township *Level up*, *Xp*, *Factories*, *Crops*, *Community Buildings*, *Regatta* ; Hay Day *Experience*, *Experience Levels/Levels 1-100*, *Crops List*, *Production Buildings List*, *Derby*, *Farm Pass* ; Clash of Clans *Experience*, *Town Hall*, *Cannon/Gold Mine/Archer Tower (Home Village)*, *Laboratory*, *Events*, *Season Challenges*, *Magic Items*. Les ajustements de courbes ont été calculés sur ces tables (script Python).
> Pour Bid Master et Dragons of Atlantis, je repars de nos fichiers (`BIDMASTER*.md`, `video/`, `DRAGONS-OF-ATLANTIS.md`, `DOA-ECRANS.md`). Les temps réels viennent de guides, d'articles et de témoignages de joueurs.
> **Limites.** Reddit et forum.playrix.com sont inaccessibles depuis cette session (blocage réseau). Les témoignages « niveau X en Y jours » sont donc rares et viennent d'autres sources. Je les signale comme anecdotes.
>
> **Légende** : **[C]** confirmé par une source citée ; **[I]** inféré (calcul, recoupement ou convention du genre).

---

## 0. En une page

| Constat | Township | Hay Day | Clash of Clans | Dragons of Atlantis | Bid Master |
|---|---|---|---|---|---|
| XP du niveau 1 → 2 | 9 [C] | 27 [C] | 30 [C] | Power ×2 par niveau [C/I] | ? |
| XP du niveau 10 → 11 | 963 [C] | 960 [C] | 450 [C] | — | — |
| XP du niveau 30 → 31 | 23 974 [C] | 26 100 [C] | 1 450 [C] | — | — |
| XP du niveau 50 → 51 | 130 727 [C] | 157 000 [C] | 2 450 [C] | — | — |
| Forme de la courbe | ×2 à ×3 par niveau (1-5), puis **≈ L³** (10-62), puis **linéaire** (+11 000/niv. à partir de 63) [C/I] | Même chose : **≈ L³** jusqu'à 50, puis **+11 000/niv. exactement** [C] | **Linéaire** : +50 par niveau jusqu'au 200 [C] | **Exponentielle** (Power ×2 = +1 niveau) [I] | Chapitres de 4 tâches, ~1,4 chapitre par niveau au milieu de partie [I] |
| Temps réel, joueur très actif | Niv. 11 le jour de l'installation, niv. 20 à J3, niv. 35 à J23 [C, guide japonais] | Niv. 1→20 en 3 h (vidéo « speed ») ; niv. 100 en 10 mois [C, anecdotes] | HDV 1→5 « en quelques jours », HDV 7 en une semaine en *rush* [C, guides] | Constructions de 10 s à 1 min le jour 1, 1 à 12 jours au niveau 10 [C] | Niveau 19 et chapitre 26 sur la vidéo analysée [C] |
| Temps réel, joueur occasionnel | Niv. 21 « après quelques semaines » [C, Deconstructor of Fun] | Niv. 7 après 3 jours [C, Udonis] ; niv. 34 en 4 ans [C, anecdote] | 2-3 mois par HDV au-delà de HDV 5 [C, guide] | — | ~8 h pour débloquer la 2ᵉ ville [C/I] |
| Construction du bâtiment-clé | Usines : 3 s → 1 h (niv. 4) → 1 j (niv. 20) → 2 j (niv. 47) → 3 j (plafond) [C] | 40 s → 2 h (niv. 6) → 1 j (niv. 17) → 2 j (niv. 30) → 4 j (plafond) [C] | HDV : 10 s → 30 min → 3 h → … → 1 j (HDV 8) → 5 j (HDV 11) → 12 j (HDV 18) [C] | Forteresse : 30 min → 4 h 12 (niv. 5) → 6 j (niv. 10) → 10 j 16 h (niv. 11) [C] | Expertise 1 h, prêteur 2-4 h, réparation plusieurs heures [C] |

**Les trois lois communes [I, tirées des tables] :**
1. **Rafale d'accueil.** 5 à 10 niveaux le premier jour, dont 3 à 5 dans la première session de 15 minutes.
2. **Coude vers les niveaux 15-20.** Le passage de niveau passe de « minutes » à « environ un jour ». C'est là qu'apparaissent les minuteurs de plusieurs heures, la 2ᵉ ressource rare et les événements hebdomadaires.
3. **Plateau.** Au-delà de 40-60, un niveau prend une semaine ou plus. Les jeux compensent en multipliant les **récompenses intermédiaires** : coffres d'XP à l'intérieur d'un niveau, tâches, événements, ligues. Le joueur ne vit plus « au niveau », il vit « à la tâche ».

**Notre jeu aujourd'hui** (`js/v2/town.js`) : `xpNeed(L) = 20·L^1.6 + 10·L` (30 XP au niveau 1, 896 au 10, 14 598 au 60) et `upTime = base × 1,55^(niv−1)` plafonné à 8 h. La Maison du Père Noël passe du niveau 14 au 15 en **2 h 34**, alors que l'équivalent prend **5 à 12 jours** chez Clash of Clans ou DoA [C, calcul sur le code]. Le jeu est donc à la fois **trop lent au début** (pas de rafale) et **beaucoup trop rapide ensuite**.

---

## 1. Tables d'XP par niveau

### 1.1 Township : XP pour passer au niveau suivant [C, wiki *Level up*]

La colonne « coffres » indique les **coffres d'XP intermédiaires** placés sur la barre (C1…C5), ajoutés par la v5.6.1 en 2018 (le wiki dit qu'ils n'existent « probablement plus », mais les seuils restent listés). « Cumul » = XP totale pour **atteindre** ce niveau (calculée).

| Niv. | XP → suivant | Cumul | Rapport au précédent | Coffres | Récompense en l'atteignant |
|---|---|---|---|---|---|
| 1 | 9 | 0 | — | — | départ : 500 pièces, 30 T-cash |
| 2 | 17 | 9 | ×1,89 | — | 100 pièces + 1 T-cash |
| 3 | 44 | 26 | ×2,59 | — | 150 + 1 |
| 4 | 130 | 70 | ×2,95 | — | 200 + 1 |
| 5 | 284 | 200 | ×2,18 | — | 250 + 1 |
| 6 | 292 | 484 | ×1,03 | — | 300 + 1 |
| 7 | 408 | 776 | ×1,40 | — | 300 + 1 |
| 8 | 556 | 1 184 | ×1,36 | — | 300 |
| 9 | 739 | 1 740 | ×1,33 | — | 300 |
| 10 | 963 | 2 479 | ×1,30 | — | 300 |
| 11 | 1 234 | 3 442 | ×1,28 | 1 | 400 |
| 12 | 1 555 | 4 676 | ×1,26 | 1 | 400 |
| 13 | 1 935 | 6 231 | ×1,24 | 1 | 400 |
| 14 | 2 377 | 8 166 | ×1,23 | 1 | 400 |
| 15 | 2 889 | 10 543 | ×1,22 | 1 | 500 |
| 16 | 3 478 | 13 432 | ×1,20 | 1 | 500 |
| 17 | 4 149 | 16 910 | ×1,19 | 1 | 600 |
| 18 | 4 912 | 21 059 | ×1,18 | 1 | 600 |
| 19 | 5 771 | 25 971 | ×1,17 | 1 | 700 |
| 20 | 6 736 | 31 742 | ×1,17 | 1 | 800 |
| 22 | 9 011 | 46 291 | ×1,15 | 1 | 900 |
| 25 | 13 413 | 77 442 | ×1,14 | 1 | 1 200 |
| 26 | 15 178 | 90 855 | ×1,13 | 2 | 1 300 |
| 28 | 19 210 | 123 141 | ×1,12 | 2 | 1 500 |
| 30 | 23 974 | 163 846 | ×1,12 | 2 | 1 700 |
| 35 | 39 606 | 312 697 | ×1,10 | 2 | 2 500 |
| 40 | 61 628 | 551 937 | ×1,09 | 2 | 3 400 |
| 45 | 91 481 | 916 348 | ×1,08 | 2 | 4 500 |
| 50 | 130 727 | 1 448 160 | ×1,07 | 2 | 5 700 |
| 54 | 170 009 | 2 027 638 | ×1,07 | 3 | 6 900 |
| 55 | 181 043 | 2 197 647 | ×1,06 | 3 | 7 200 |
| 60 | 244 220 | 3 223 700 | ×1,06 | 3 | 8 900 |
| 62 | 273 515 | 3 726 485 | ×1,06 | 3 | 9 600 |
| 63 | 300 000 | 4 000 000 | ×1,10 | 3 | 10 000 |
| 65 | 325 000 | 4 612 000 | ×1,04 | 3 | 10 000 |
| 66 | 337 000 | — | — | 3 | **75 T-cash** (plus de pièces) |
| 70 | 384 000 | 6 357 000 | ×1,03 | 3 | 75 T-cash |
| 75 | 442 000 | — | — | **4** | 75 T-cash |
| 80 | 498 000 | 10 718 000 | ×1,02 | 4 | 75 T-cash |
| 100 | 706 000 | 22 690 000 | ×1,01 | 4 | 125 T-cash |
| 101 | 716 000 | — | — | **5** | 125 T-cash |
| 134 | 1 017 000 | 51 945 000 | ×1,01 | 5 | dernier déblocage |
| 200 | 1 523 000 | 136 054 000 | — | — | — |
| 500 | 3 164 000 | 854 280 000 | — | — | — |

Table complète (niveaux 1 à 500) dans le wiki. Le wiki précise : « **à partir du niveau 134, plus aucun objet n'est débloqué**, il faut attendre une mise à jour » [C, *Xp*].

**Ajustements [I, calcul sur les 500 valeurs] :**
- **Niveaux 1-5 (rafale)** : rapport de ×1,9 à ×3 par niveau (9 → 284). C'est une exponentielle raide, mais sur de toutes petites valeurs : tout tient en 10 minutes.
- **Niveaux 6-10** : rapport d'environ ×1,33 (292 → 963).
- **Niveaux 10-62 (cœur du jeu)** : `XP(L) ≈ 0,55 · L^3,16` (écart maximal de 18 %). Le rapport décroît doucement, de ×1,30 (niv. 10) à ×1,06 (niv. 60). Les écarts entre niveaux augmentent eux-mêmes linéairement (+321, +380, +442, +512, +589… au début), d'où une **courbe cubique**.
- **Coude au niveau 63** : la cubique est remplacée par des **paliers ronds et linéaires** : +11 000 à +12 000 par niveau de 63 à 100, +9 150 de 100 à 134, +6 300 de 200 à 300, +4 800 de 400 à 500. **La courbe devient concave** : le jeu accepte que l'XP par niveau croisse moins vite que la production du joueur.

### 1.2 Hay Day : XP pour passer au niveau suivant [C, wiki *Experience Levels* et *Experience*]

| Niv. | XP → suivant | Cumul | | Niv. | XP → suivant | Cumul |
|---|---|---|---|---|---|---|
| 1 | 27 | 0 | | 20 | 6 320 | 30 368 |
| 2 | 7 | 27 | | 22 | 9 140 | 44 438 |
| 3 | 14 | 34 | | 25 | 14 000 | 76 608 |
| 4 | 30 | 48 | | 28 | 20 500 | 124 608 |
| 5 | 50 | 78 | | 30 | 26 100 | 168 508 |
| 6 | 220 | 128 | | 35 | 42 200 | 330 908 |
| 7 | 370 | 348 | | 40 | 67 900 | 583 908 |
| 8 | 490 | 718 | | 45 | 110 900 | 1 003 508 |
| 9 | 790 | 1 208 | | 50 | 157 000 | 1 649 808 |
| 10 | 960 | 1 998 | | 55 | 212 000 | 2 544 808 |
| 11 | 1 180 | 2 958 | | 60 | 267 000 | 3 714 808 |
| 12 | 1 550 | 4 138 | | 70 | 377 000 | 6 879 808 |
| 13 | 1 790 | 5 688 | | 80 | 487 000 | 11 144 808 |
| 14 | 2 270 | 7 478 | | 100 | 707 000 | 22 974 808 |
| 15 | 2 880 | 9 748 | | 150 | 1 257 000 | 71 799 808 |
| 16 | 3 270 | 12 628 | | 200 | 1 807 000 | 148 124 808 |
| 17 | 4 120 | 15 898 | | 500 | 5 107 000 | — |
| 18 | 4 740 | 20 018 | | | | |

**Formule officielle du wiki [C]** : « jusqu'au niveau 50, l'augmentation est irrégulière » ; ensuite `XP(L) = 157 000 + 11 000·(L − 50)` pour 50 ≤ L ≤ 500, puis `5 107 000 + 20 000·(L − 500)`.
**Ajustement [I]** : niveaux 10-50, `XP(L) ≈ 0,42 · L^3,26` (écart maximal de 22 %).

**Observation clé [I]** : **Township et Hay Day ont presque la même courbe.** Il faut environ 31 000 XP pour le niveau 20 dans les deux jeux, 165 000 pour le 30, 1,5 à 1,6 million pour le 50 et 23 millions pour le 100. Les deux finissent par +11 000 XP par niveau. Playrix a calqué la courbe de Supercell, ou les deux ont convergé. C'est **la courbe de référence du genre « ferme-ville »**.

Particularités de Hay Day [C] :
- **Niveaux 2 à 5 quasi gratuits** (7, 14, 30, 50 XP) : on passe 4 niveaux en quelques minutes **juste après** le niveau 1, qui coûte 27 XP.
- **Seuils intermédiaires** à partir du niveau 15 : 1 seuil (niv. 15-24), 2 (25-39), 3 (40-59), 4 (60-84), 5 (85+). Chaque seuil donne des fournitures, des diamants ou des bons.
- **Récompenses régulières** : des champs tous les 2 niveaux (3 jusqu'au niveau 49, 2 jusqu'au 99) ; des diamants à chaque niveau à partir du 37 (2, puis 5, 8, 10, 12, 15, 20, 25) ; de gros bonus aux niveaux 50, 100, 200…
- **Après le niveau 126, plus aucun nouvel objet** : seulement des diamants et des champs.

### 1.3 Clash of Clans : niveau d'expérience [C, wiki *Experience*]

| Plage | XP pour le niveau suivant | XP cumulée pour atteindre L |
|---|---|---|
| Niv. 1 | 30 | 0 |
| 2 ≤ L ≤ 200 | **50 × (L − 1)** (50, 100, 150… 9 950) | (L−1)(L−2)·25 + 30 (niv. 50 : 58 830 ; niv. 100 : 242 580) |
| 201 ≤ L ≤ 299 | 500 × (L − 200) + 9 500 | 250(L−200)² + 9 250(L−200) + 985 530 |
| L ≥ 300 | 1 000 × (L − 300) + 60 000 | 500(L−300)² + 59 500(L−300) + 4 410 530 |

- **L'XP ne débloque que des décorations** [C]. La vraie progression est l'**Hôtel de ville (HDV)**, qui ouvre bâtiments, niveaux et troupes.
- **XP gagnée par construction = ⌊√(durée en secondes)⌋** [C] : 10 s → 3 XP, 1 min → 7, 1 h → 60, 1 j → 293, 7 j → 777, 20 j → 1 314 (maximum). Détruire un HDV ennemi rapporte autant d'XP que son niveau.
- **Conséquence [I]** : la courbe d'XP est **linéaire** et l'XP par heure de construction **décroît** (√t / t). Le temps par niveau augmente donc même avec une courbe d'XP seulement quadratique en cumul. C'est une façon élégante d'obtenir du non-linéaire.

### 1.4 Dragons of Atlantis : niveau = puissance qui double [C/I]

- L'XP du joueur s'appelle **Power** [C, Kabam]. Toute amélioration rapporte de la Power, qui **double à chaque niveau de bâtiment** [C].
- Points observés : « Level 20 – Power 5 242 880 » comme seuil du titre *Arbiter* [C] ; or 5 242 880 = **5 × 2²⁰**. Les comptes « Level 20, Power 6,8 M / 7,7 M » et « Level 29, Power 4,3 G » (5×2²⁹ = 2,7 G) sont cohérents avec un seuil **Power(L) ≈ 5 · 2^L** [I]. Une exception, « Lv. 3 / Power 184 », vient sans doute d'anciens seuils différents en début de partie [I].
- **Conséquence [I]** : un niveau joueur = un **doublement** de tout ce qu'on a construit. Comme le temps de construction double lui aussi par niveau (§3.4), le temps par niveau joueur **double à peu près à chaque niveau**. C'est la courbe la plus dure des cinq jeux, et c'est aussi le jeu le plus « hardcore ».

### 1.5 Bid Master [C, notre vidéo et nos captures]

- Le joueur enregistré est **niveau 19**, en **chapitre 26** (« Tâche du Chapitre Vingt-six », 3/4) [C]. D'autres captures montrent les niveaux 18 et 21 [C].
- **Sources d'EXP observées** [C] : chaque vente rapporte **5 EXP** (+1 de prime de secrétaire) ; chaque tâche de chapitre **2 EXP** ; l'achèvement d'un chapitre **10 EXP** (+400 billets, +2 lingots) ; le garage **12 EXP/jour** ; « Gains sur crochet » **12 EXP** ; le VIP double l'EXP (« 2x expérience »).
- Les seuils d'EXP par niveau ne sont pas visibles sur nos images [I]. Les montants de 2 à 12 EXP suggèrent des seuils de quelques centaines d'EXP au niveau 20 [I].
- **Gating visible** : des parcelles verrouillées « **Lv. 24** » et « **Lv. 26** » restent affichées sur la carte au niveau 19 [C]. Le joueur voit ce qui arrive **5 à 7 niveaux plus tard**.
- **Rythme de chapitre [I]** : 26 chapitres pour 19 niveaux, soit ~1,4 chapitre par niveau. Nos notes situent le milieu de partie aux « niveaux 13 à 30, chapitres 20 à 60 », avec « un nouveau bâtiment ou mini-jeu presque à chaque chapitre » [C, BIDMASTER.md].

---

## 2. Temps réel pour atteindre les niveaux

### 2.1 Témoignages et repères [C sauf mention]

| Jeu | Repère | Profil du joueur | Source |
|---|---|---|---|
| Township | **Niv. 5 et niv. 11 le jour de l'installation**, niv. 20 à **J3** (J2 « possible »), niv. 35 à **J23**, niv. 51 en 30 jours (« juste », de préférence en payant) | Très actif (campagne de récompense) : **3 connexions/jour, 5-10 min chacune, 15-30 min/jour** | Guide japonais appmatch |
| Township | Mine (niv. 21) restaurée « **après quelques semaines** de jeu actif » | Joueur moyen | Deconstructor of Fun |
| Township | Premier passage de niveau en 2-3 min, niv. 3 vers 6-8 min, niv. 5 vers 30-60 min | Session 1 | Notre `TOWNSHIP-10MIN.md` [I] |
| Township | Niv. 100 jugé « corvée » sans payer | Vétéran | Forum Playrix (cité par la recherche, non lu) |
| Hay Day | Niv. 1 → 20 en **3 heures** | Vidéo « level up fast », ancienne, joueur qui optimise | YouTube |
| Hay Day | Niv. 7 après **3 jours** ; « Weekly deals » débloqués à J7 | Testeur occasionnel | Udonis |
| Hay Day | Niv. 25 → 29 en **12 jours** | Joueur régulier | TikTok (anecdote) |
| Hay Day | Niv. 100 **10 mois** après le début ; d'autres en 5 ou 9 ans | Actif / occasionnels | TikTok (anecdotes) |
| Hay Day | Niv. 34 en **4 ans** (avec une perte de progression) | Très occasionnel | Saratoga Falcon |
| Clash of Clans | HDV 1 → 5 « **en quelques jours** » | Joueur actif | Guide (recherche web) |
| Clash of Clans | HDV 7 en **semaine 1**, HDV 8 en semaine 2 | *Rush* agressif, non standard | Guide (recherche web) |
| Clash of Clans | « **2-3 mois par niveau d'HDV** est normal » (au-delà des premiers) | Joueur qui maxe | Guide (recherche web) |
| Clash of Clans | Maxer HDV 10 ≈ **6 mois**, HDV 11 ≈ **10 mois**, HDV 13 ≈ 12-18 mois | Actif optimisé, sans payer | Page Q&R (estimation isolée) |
| DoA | Premières minutes : constructions de 10 à 60 s, quêtes qui remboursent tout | Session 1 | Wiki DoA |
| DoA | Jour 1 : 5 maisons, 11 champs au niv. 3, Science Center, 5 garnisons, Forteresse niv. 2 « seulement si tu restes en ligne » | Guide débutant | Wiki DoA |
| Bid Master | Tutoriel de plus de 15 min, bloquant ; ~8 h pour débloquer la 2ᵉ ville | Avis joueurs | BIDMASTER.md |

### 2.2 Modèle Township calé sur ces repères [I]

J'ai calé un modèle « XP gagnée par jour = a·L^p » sur les deux repères du guide japonais (niv. 11 → 20 en 3 jours, niv. 20 → 35 en 20 jours). Résultat : **R(L) ≈ 1 440 · L^0,68 XP/jour**, soit 7 400 XP/jour au niveau 11, 14 500 au 30 et 23 300 au 60. Ce modèle prolonge ensuite la courbe :

| Atteindre | Jour (joueur très actif) | Durée d'un niveau à ce stade |
|---|---|---|
| 11 | J0 | ~4 h |
| 15 | J1 | ~6 h |
| 20 | J3 | ~13 h |
| 25 | J7 | ~1 j |
| 30 | J13 | 1,5 j |
| 35 | J23 | 2,3 j |
| 40 | J37 | 3,3 j |
| 50 | J84 (≈ 3 mois) | 6 j |
| 60 | J165 (≈ 5,5 mois) | 10 j |
| 80 | J454 (≈ 15 mois) | 17 j |
| 100 | J845 (≈ 2,3 ans) | 21 j |

À recouper avec le guide japonais (niv. 51 « en 30 jours » est un sprint payant, le modèle donne 3 mois) et avec Hay Day (niv. 100 en 10 mois pour un joueur très actif, le modèle Township donne 2,3 ans). **La vérité pour un joueur actif est entre les deux.** Le point robuste, c'est la **forme** : un niveau dure ~4 h au niveau 11, ~1 jour au 25, ~1 semaine au 50.

### 2.3 Chronologie type (joueur actif, 2-3 sessions par jour)

| Moment | Township | Hay Day | Clash of Clans | DoA | Bid Master |
|---|---|---|---|---|---|
| **Session 1** (10-20 min) | Niv. 1 → 4-5 : blé, boulangerie, hélico, moulin [C/I] | Niv. 1 → 5-6 : poules, boulangerie, camion (niv. 4) [C/I] | HDV 1 → 3 (10 s, puis 30 min) ; tutoriel avec gobelins [C/I] | Constructions de 10 à 60 s, quêtes à la chaîne [C] | Tutoriel de plus de 15 min, 1ʳᵉ enchère, prêteur [C] |
| **Jour 1** | Niv. **8-11** ; train (niv. 5) [C] | Niv. **6-9** ; laiterie, sucrerie, boutique, journal [I] | HDV **4** (3 h) [I] | Forteresse niv. 2 (30 min à 1 h 30) [C] | Plusieurs villes de la carte, expertise (1 h) [C/I] |
| **Semaine 1** | Niv. **20-25** : usines en 1 j, mine (21), îles [I] | Niv. **12-17** : camion (9 commandes), bateau (17), quartier (niv. 10) [I] | HDV **5-6**, 3-4 bâtisseurs [I] | Bâtiments niv. 5-6 (4 h - 8 h 30) [I] | Niveau ~10, guilde [I] |
| **Mois 1** | Niv. **30-40** ; usines en 1,5 j ; Regatta hebdo [I] | Niv. **20-28** : derby (18), mine (24), pêche (27) [I] | HDV **7-8** : roi barbare (HDV 7), constructions de 12 h à 1 j [I] | Bâtiments niv. 8 (1 j 10 h) ; premières contrées [I] | Niveau ~15-20, chapitre ~20-26 [I] |
| **Mois 3+** | Niv. **45-50+** ; plus d'une semaine par niveau [I] | Niv. **35-50** ; 3-5 jours par niveau [I] | HDV **9-10** ; constructions de 2-3 j, labo de 4 à 9 j [I] | **Mur du niveau 10** : 1-12 jours par bâtiment, objets-clés [C] | Métropole, objectifs à 6 chiffres [C] |

---

## 3. Minuteurs par étape

### 3.1 Clash of Clans : Hôtel de ville [C, wiki *Town Hall*, valeurs actuelles après les rééquilibrages]

| HDV atteint | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Durée | **10 s** | **30 min** | **3 h** | 6 h | 12 h | 18 h | **1 j** | 2 j | 3 j | **5 j** | 6 j | 7 j | 7 j 12 h | 8 j | 9 j | 10 j | **12 j** |
| XP | 3 | 42 | 103 | 146 | 207 | 254 | 293 | 415 | 509 | 657 | 720 | 777 | 804 | 831 | 881 | 929 | 1 018 |
| Coût (or) | 1 000 | 4 000 | … | | | | | | | | | 12 M (HDV 13) | | 15 M | 16 M | | |

**Autres bâtiments [C]** :
- Canon : 5 s, 30 s, 2 min, 20 min, 30 min, 1 h, 2 h, 3 h… 1 j (niv. 20), 1 j 12 h, 2 j.
- Mine d'or : 5 s, 15 s, 1 min, 2 min, 5 min, 15 min, 30 min, 1 h… 1 j, 2 j.
- Tour d'archers : 15 s, 2 min, 20 min, 1 h… 2 j, puis 7 j.
- Laboratoire : 1 min, 30 min, 2 h, 4 h, 8 h, 16 h, 1 j, 1 j 18 h, 2 j 18 h, 4 j, 6 j… 16 j.

**Temps total de bâtisseurs pour tout maxer, par HDV** [C, clash.ninja, sans diviser par le nombre de bâtisseurs] :

| HDV | Structures | Laboratoire | Héros |
|---|---|---|---|
| 4 | 2 j 3 h | 9 h | — |
| 6 | 7 j 17 h | 1 j 4 h | — |
| 9 | 2 mois 29 j | 1 mois 4 j | 1 mois 14 j |
| 12 | 7 mois 1 j | 4 mois 10 j | 5 mois 2 j |

Avec 5 bâtisseurs [I] : HDV 4 ≈ 0,5 jour, HDV 6 ≈ 2 jours, HDV 9 ≈ 3 semaines, HDV 12 ≈ 6 semaines de construction pure. Ce sont **les ressources** (le pillage) qui rallongent le tout à des mois.

**Forme [I]** : secondes au HDV 1-2, minutes au HDV 3, heures aux HDV 4-7, un jour au HDV 8, des jours au-delà. Le saut le plus fort est **×18 entre HDV 2 et 3**, puis ×6, puis ×2, puis ×1,5. Ensuite la croissance ralentit vers un **plafond de 7 à 12 jours**.

### 3.2 Township : usines, bâtiments communautaires et cultures [C, wiki]

**Usines** (construction sans matériaux, seulement pièces et temps) :

| Niv. | Usine | Durée | XP | Pièces |
|---|---|---|---|---|
| 2 | Boulangerie | **3 s** | 10 | 125 |
| 3 | Moulin à grain | **40 s** | 11 | 150 |
| 4 | Laiterie | **1 h** | 12 | 175 |
| 7 | Sucrerie | 2 h | 15 | 250 |
| 9 | Textile | 6 h | 25 | 500 |
| 12 | Tailleur | 10 h | 38 | 800 |
| 14 | Snacks | 12 h | 58 | 1 300 |
| 16 / 18 | Fast-food / Papeterie | 16 h | 91 / 120 | 2 100 / 2 800 |
| 20 | Glacier | **1 j** | 174 | 3 600 |
| 24-31 | Pâtisserie → Agroalimentaire | 1 j 2 h → 1 j 10 h | 252 → 500 | 5 300 → 12 000 |
| 34-46 | Plastiques → Papeterie de bureau | 1 j 12 h → 1 j 22 h | 623 → 1 655 | 15 k → 40 k |
| 47 | Meubles | **2 j** | 1 985 | 48 000 |
| 50-78 | Chaussures → Cuisine | 2 j 4 h → **3 j** | 2 480 → 14 030 | 60 k → 340 k |
| 78+ | toutes | **plafond 3 j** | jusqu'à ~24 000 | jusqu'à 630 k |

**Ajustement [I]** : la durée suit à peu près `durée ≈ 1 h × 1,6^(niv/4)` jusqu'au niveau 20 (×24 en 16 niveaux), puis **+2 h par 3 niveaux** jusqu'au plafond de 3 jours. L'XP de construction suit les pièces (≈ pièces/24 au-delà du niveau 20).

**Bâtiments communautaires** (ils demandent des matériaux apportés par le train) : 2 min (niv. 5), 10 min (5), 20 min (6), 30 min (7), **1 h (8)**, 2 h (10), 4 h (14), **7 h (20)**, 12 h (26), 16 h (30), **1 j (38)**, 1 j 12 h (50), 1 j 22 h (60), 2 j 19 h (100), plafond ~3 j. Le nombre de matériaux passe de **1 à 2** (niv. 5) à **~17** (niv. 20), **~35** (30), **~75** (50) [C].
**Forme [I]** : **+30 min par niveau** de 8 à 23, puis **+1 h par niveau** jusqu'à 1 j 22 h au niveau 60. C'est **quasi linéaire**, mais la **quantité de matériaux** (qui dépend de trains de 5 h) croît plus vite que la durée.

**Cultures** :

| Niv. | 1 | 3 | 4 | 7 | 9 | 13 | 15 | 18 | 22 | 25 | 29 | 31 | 43 | 50 | 56 | 72 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Culture | Blé | Maïs | Carotte | Canne | Coton | Fraise | Tomate | Pin | Pomme de terre | Cacao | Hévéa | Soie | Poivron | Menthe | Riz | Café |
| Durée | **2 min** | 5 min | 10 min | 20 min | 30 min | **1 h** | 2 h | 3 h | 4 h | **8 h** | 12 h | **15 h** | 5 h | 2 h 45 | **1 h 20** | 6 h |
| XP | 1 | 1 | 2 | 3 | 4 | 6 | 6 | 7 | 8 | 19 | 24 | 27 | 9 | 7 | 5 | 16 |

**Leçon [I]** : de 1 à 31, chaque nouvelle culture **double** à peu près la durée (2 min → 15 h). **Après 31, les nouvelles cultures redeviennent courtes** (riz 1 h 20 au niveau 56, menthe 2 h 45 au 50). Le jeu **garde toujours des minuteurs courts** pour les sessions actives et ajoute des minuteurs longs pour la nuit.

**Autres minuteurs Township [C, TOWNSHIP-10MIN.md / Deconstructor of Fun]** :
- hélico : remplacement d'une commande jetée en 30 min ;
- train : retour en jusqu'à **5 h** ;
- zoo : nouvelle commande toutes les 3 h (8 par jour au maximum) ;
- avion : 15 h pour remplir ;
- navires : 1 coffre par 24 h ;
- produits : pain 5 min, cookies 15 min.

### 3.3 Hay Day : bâtiments de production et cultures [C, wiki]

**Construction** : moulin 40 s (niv. 2), boulangerie **10 s** (4), laiterie **2 h** (6), sucrerie 6 h (7), popcorn et barbecue 8 h (8-9), four à tartes 12 h (14), métier à tisser **1 j** (17), machine à coudre 20 h (19), four à gâteaux 1 j (21), mine 1 j 11 h (24), filet **2 j** (30), confiture et bijoutier 1 j 12 h (35-38), salon des canards 2 j 5 h (50), mixeur **3 j** (64), pâtes 3 j 7 h (67), fondue **4 j** (81), **plafond 4 j** jusqu'au niveau 124.
**Forme [I]** : **secondes → 2 h d'un coup (niv. 6)** → 1 jour au niveau 17 → 2 jours vers 30-44 → 3 jours vers 64 → plafond de 4 jours dès 81. L'XP de construction est faible (3 à 46) : chez Hay Day, **l'XP vient des commandes, pas des bâtiments**.

**Cultures et arbres** :

| Niv. | 1 | 2 | 5 | 7 | 9 | 13 | 15 | 18 | 25 | 30 | 34 | 45 | 52 | 60 | 89 | 119 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Culture | Blé | Maïs | Soja | Canne | Carotte | Indigo | Citrouille | Coton | Piment / **haricot noir** | Tomate | Fraise | **Camomille** | **Ananas** | **Ail** | **Champignon** | **Avoine** |
| Durée | 2 min | 5 min | 20 min | 30 min | 10 min | **2 h** | 3 h | 2 h 30 | 4 h / **10 min** | 6 h | **8 h** | **20 min** | **30 min** | **30 min** | **20 min** | **7 min** |

Les arbres et buissons durent de 16 h à 1 j 12 h (pommier 16 h au niveau 15, cerisier 1 j 3 h au 22, cocotier 1 j 12 h au 101).
**Même leçon, plus marquée [I]** : après un pic à 8 h (fraise, niv. 34), Hay Day ajoute **sans arrêt des cultures de 7 à 45 minutes** (haricot noir, camomille, ananas, riz, ail, concombre, champignon, avoine). **Les minuteurs ne grandissent pas indéfiniment** : ce qui grandit, ce sont les **quantités** demandées et la **longueur des chaînes** de production.
**XP par culture [C]** : de 1 (2 min) à 22 (1 j 10 h). L'XP récompense un peu la durée, mais très sous-linéairement.

### 3.4 Dragons of Atlantis [C, nos fichiers DoA]

- **Doublement par niveau** (ressources **et** temps) jusqu'au niveau 10.
  - Maison : 10 s, 20 s, 41 s, 1 min 23… 1 h 35 au niveau 10.
  - Ferme : 15 s → 4 min 12 (niv. 5) → 2 h 23 (niv. 10) → 3 j 4 h (niv. 15).
- **Forteresse** : 30 min (niv. 2), 1 h, 2 h, **4 h 12 (niv. 5)**, 8 h 30, 17 h, **1 j 10 h (niv. 8)**, 2 j 22 h, **5 j 23 h (niv. 10)**, 10 j 16 h (niv. 11).
- **Mur** : 1 h (niv. 2) → **11 j 22 h (niv. 10)**. Coffre de stockage : 10 min → ~4 j (niv. 10) → **21 j (niv. 16+)**.
- **Plateau de 4 à 22 jours** au-delà du niveau 10, plus des **objets-clés** obligatoires (Completion Grant, sceaux). Le mur devient l'objet rare, plus le temps seul.
- Recherches : 0 → 10 en 5 jours (Agriculture) à 40 jours (Rationnement) ; **312 jours pour tout**.
- Accélérations en paliers fixes : 1 min, 5 min, 15 min, 1 h, 2,5 h, 8 h, 15 h, 24 h, 2,5 j, 4 j.

### 3.5 Bid Master [C, vidéo et captures]

- **Énergie** : jauge de **60** (90 en VIP). Une enchère coûte **10 énergie**, ou **5 avec une pub** : **6 enchères par jauge pleine**. La jauge peut dépasser le plafond grâce aux récompenses (65/60, 130/60 observés). Le HUD affiche « **(00:46 +1)** », le compte à rebours avant le prochain point.
  - **Vitesse de recharge non mesurée** dans nos sources. Le genre se situe en général entre 1 point toutes les 2 et toutes les 6 minutes, soit 2 à 6 h pour remplir 60 [I]. La restauration rend +20 énergie par commande.
- **Expertise** : **1 h** (une pub retire 30 min, 5-6 lingots = immédiat).
- **Prêteur** : première offre en **1 h 54** (objet à 573 $) ou **3 h 48** (objet à 7 250 $). **Le minuteur grandit avec la valeur.**
- **Vente** : 1 à 12 h. **Garage** : revenu plafonné à 24 h.
- **Mini-jeux** à recharge : Monopoly 1 dé toutes les 10 min (20 au maximum), cloche du restaurant (stock de 20, recharge en minutes), casino 10 essais par jour, mine d'or 20 essais par jour.
- Connexion sur 28 jours ; quêtes quotidiennes remises à zéro à minuit.

### 3.6 Synthèse : minuteur du bâtiment principal à chaque étape [C pour les valeurs, I pour l'alignement]

| Étape | Clash of Clans (HDV) | DoA (Forteresse) | Township (usine du niveau) | Hay Day (bâtiment du niveau) |
|---|---|---|---|---|
| Session 1 | 10 s (HDV 2) | — (déjà niv. 1) | 3 s - 40 s | 10 s - 40 s |
| Jour 1 | 30 min - 3 h (HDV 3-4) | 30 min - 1 h | 1 h - 2 h | 2 h - 8 h |
| Semaine 1 | 6 h - 12 h (HDV 5-6) | 2 h - 4 h | 6 h - 1 j | 12 h - 1 j |
| Mois 1 | 18 h - 1 j (HDV 7-8) | 8 h - 1 j 10 h | 1 j - 1 j 12 h | 1 j - 2 j |
| Mois 3+ | 2 j - 5 j (HDV 9-11) | 3 j - 6 j | 1 j 12 h - 2 j | 2 j - 3 j |
| Plafond | **12 j** | **21 j** | **3 j** | **4 j** |

---

## 4. Cadence des déblocages

### 4.1 Township [C, wiki *Level up*, comptage I]

| Niveaux | Nouveautés par niveau (hors déco) | Nouveaux bâtiments de production | Niveaux « secs » |
|---|---|---|---|
| 1-10 | 4,6 | 8 | aucun |
| 11-20 | 4,8 | 7 | aucun |
| 21-30 | 5,5 | 5 | aucun |
| 31-40 | 5,4 | 7 | aucun |
| 41-50 | 5,9 | 7 | aucun |
| 51-60 | 5,1 | 4 | aucun |
| 61-80 | 5,2 | 11 | aucun |
| 81-100 | 4,0 | 7 | aucun |
| 101-134 | 1,3 | 2 | **un niveau sur deux** (111, 113, … 133) |

**Grands déblocages** : boulangerie (2), hélipad (3), laiterie et maisons (4), **train** (5), centre d'événements (8), Maison de la chance (11), marché (13), 2ᵉ train (14), **aéroport** (17), labo (18), coopérative, **Regatta** (19), **mine** (21), académie (22), **zoo** (24), 3ᵉ train (25), musée (26), **port et îles** (29), îles (35, 41), fonderie (45), ressources de la mer (58), **échange d'outils** (60).
**Rythme [I]** : **un nouveau produit à chaque niveau**, **une nouvelle usine tous les 2-3 niveaux** et **un nouveau « système » (moyen de transport, mode) tous les 3-5 niveaux** jusqu'au 29, puis environ tous les 10 niveaux.

### 4.2 Hay Day [C, wiki *Experience Levels*, comptage I]

Nouveautés par niveau : 5,5 (1-10), 8,6 (11-20), **9,8 (21-30)**, 9,2 (31-40), 7,3 (41-50), 5,4 à 6,7 ensuite. **Aucun niveau sec avant le niveau 126.**

**Grands déblocages** :
- 1 à 11 : visiteurs (2), **camion** (4), laiterie et vaches (6), boutique et journal (7), roue de la fortune (8), événements (9), cochons et **quartier** (10), **Farm Pass** (11) ;
- 14 à 30 : Tom (14), seuils intermédiaires, maîtrise et facteur (15), moutons (16), **bateau** (17), **derby** (18), chiens et bons (20), extensions (22), **mine** (24), **pêche** (27), filets (30) ;
- 33 à 50 : aides (33), **ville** (34), boosters (35), ruches (39), homards (44), canards (50).

**Rythme [I]** : un « système » tous les 2-3 niveaux jusqu'au 35. Ensuite, **une machine tous les 2-3 niveaux** et des animaux tous les 3-5 niveaux.

### 4.3 Clash of Clans et DoA

- **CoC** [C] : chaque HDV ajoute 4 à 13 bâtiments (HDV 2 : +4, HDV 3 : +8, HDV 8 : +13…), des pièges, des niveaux de bâtiments, et à partir de HDV 7 des héros. Le joueur obtient **un « gros » déblocage par HDV** et **des dizaines d'améliorations entre deux HDV**. Le niveau d'XP, lui, ne débloque que des décorations : c'est **un compteur de prestige**, pas un rythme.
- **DoA** [C] : chaque niveau de bâtiment débloque **une chose visible** (une troupe par niveau de garnison, une information par niveau de sentinelle, un général par niveau de quartier des officiers…). Les déblocages sont **portés par les bâtiments**, pas par le niveau du joueur.

### 4.4 Bid Master [C/I]

Le moteur de déblocage est le **chapitre** : 4 tâches qui font tourner toutes les boucles (enchère, recrutement, musée, expertise) [C]. Au milieu de partie (chapitres 20-60), **presque chaque chapitre apporte un bâtiment ou un mini-jeu** [C]. Les parcelles verrouillées par niveau (« Lv. 24 », « Lv. 26 ») sont **visibles 5 à 7 niveaux à l'avance** [C].

---

## 5. Les schémas non linéaires et pourquoi les joueurs restent

### 5.1 La rafale d'accueil (session 1)

- **Seuils minuscules** : 9, 17, 44 XP (Township) ; 27, 7, 14, 30, 50 XP (Hay Day) ; 30, 50, 100 (CoC) [C]. **3 à 5 niveaux en 10-15 minutes.**
- **Constructions instantanées** : 3 s, 10 s, 40 s [C]. Le premier « vrai » minuteur (1 à 2 h : laiterie Township, laiterie Hay Day, HDV 3 en 30 min) arrive **vers la fin de la session 1** [C/I] et sert de **crochet de retour**.
- **Quêtes qui remboursent tout** (DoA) [C] : la quête « Sentinelle niv. 2 » coûte 300/2 k/600/6 k et rend exactement 300/2 k/600/6 k.

### 5.2 Le premier mur ou la porte douce

| Jeu | Mur | Nature |
|---|---|---|
| Township | Niv. 5-10 : le **train (5 h)** apporte les matériaux des bâtiments communautaires. Grange pleine « en quelques heures » [C] | Ressource apportée par un minuteur long |
| Hay Day | Niv. 6-7 : laiterie (2 h), sucrerie (6 h). La place dans la grange et le silo demande des outils rares [C/I] | Construction longue + stockage |
| Clash of Clans | HDV 4-5 : 3 h puis 6 h, 2-3 bâtisseurs, or et élixir limités par le pillage [C/I] | Bâtisseurs + ressources |
| DoA | Forteresse niv. 2 en 30 min - 1 h 30, puis **niv. 10 : Completion Grant** [C] | Objet-clé |
| Bid Master | Énergie (6 enchères par jauge), expertise de 1 h, échecs aléatoires [C] | Énergie + aléatoire |

### 5.3 Structure de la journée

- **Township** (guide JP) [C] : **3 connexions par jour, 5-10 minutes chacune**. Cultures toutes les quelques minutes ou dizaines de minutes pendant la session. Hélico et trains toutes les quelques heures. « Se connecter une fois par jour ou moins **casse les cycles** cultures-hélico. »
- **Hay Day** [C, Udonis] : on sort de session « quand les minuteurs tournent » et on revient sur notification (« le lait est prêt »). **Aucune punition en cas d'absence** : les cultures ne sèchent pas, les animaux ne meurent pas. 4 pubs par jour au maximum.
- **CoC** [I] : on relance tous les bâtisseurs à chaque connexion. Le jeu conseille de **lancer les constructions longues avant de dormir** (même conseil chez DoA [C]).
- **Bid Master** [C] : énergie, essais quotidiens plafonnés (casino 10, mine 20), dés toutes les 10 min, revenus passifs plafonnés à 24 h.

**Recette commune [I]** : trois familles de minuteurs.
1. **Minuteurs de session** (1 à 15 min), qu'on récolte pendant qu'on joue.
2. **Minuteurs de retour** (30 min à 4 h), qui appellent la session suivante.
3. **Minuteurs de nuit** (8 à 15 h), lancés le soir.

### 5.4 Cycles hebdomadaires et mensuels [C]

| Jeu | Hebdomadaire | Plus long |
|---|---|---|
| Township | **Regatta** du lundi 12 h UTC au lundi suivant 8 h UTC, 12 tâches de coopérative (dès le niv. 19) | Événements de 7-10 jours toutes les 2-3 semaines ; ligues de 4 semaines ; Gold Pass de 28 jours |
| Hay Day | **Derby** du mardi 8 h au lundi 8 h UTC (dès le niv. 18) | **Farm Pass** mensuel (dès le niv. 11), +3 tâches tous les 3 et 7 jours |
| Clash of Clans | Guerres de clans, raids de la capitale | Saison mensuelle avec **Builder Boost** (−10 à −20 % sur les durées) ; Clan Games ; « **Hammer Jam** » avant chaque nouvel HDV (−50 % sur la durée ou le coût de toutes les constructions) |
| DoA | Défis de Power par paliers bronze, argent, or ; tournois | Événements limités |
| Bid Master | Quêtes quotidiennes à minuit ; Guerre de guilde | Saisons d'environ 4 mois ; Noël, Halloween, Nouvel An ; connexion sur 28 jours |

### 5.5 Rattrapage et accélérateurs

- **CoC** [C] :
  - à chaque nouvel HDV, **boost automatique de 3 à 5 jours** (Power Boost, et Hero Boost à partir de HDV 8) ;
  - **Builder Potion** : bâtisseurs ×10 pendant 1 h ;
  - **Hammer Jam** : −50 % ;
  - Gold Pass : −10/−20 % sur toutes les durées ;
  - les rééquilibrages réduisent régulièrement les coûts des anciens HDV (le joueur qui arrive aujourd'hui progresse plus vite que celui de 2015) [I].
- **DoA** [C] : la recherche *Lévitation* donne `temps = base / (1 + 0,1·niv)`, soit −50 % au niveau 10. Les accélérations en paliers sont offertes par les quêtes.
- **Township et Hay Day** [C] :
  - la Maison de la chance (Township) et Tom (Hay Day) fournissent des produits contre des pièces ou des diamants ;
  - les seuils et coffres d'XP intermédiaires ;
  - Hay Day donne des champs tous les 2 niveaux.
- **Bid Master** [C] : « Resource Aid » (ressources offertes aux joueurs bloqués), événement de retour sur 3 jours, connexion rattrapable pour 1 lingot.

### 5.6 Pourquoi on ne décroche pas malgré des niveaux longs [C pour les mécanismes, I pour l'analyse]

1. **Le niveau n'est plus la boucle.** Au-delà du niveau 20, le joueur suit d'abord ses **commandes** (hélico, camion : 9 au maximum), ses **tâches** (tableau Township : 3 cartes ; chapitres Bid Master : 4 tâches) et ses **événements**. Le niveau devient un fond de progression.
2. **Récompenses intermédiaires proportionnelles à la longueur du niveau.** Township : 1 coffre d'XP par niveau de 11 à 25, 2 de 26 à 53, 3 de 54 à 74, 4 de 75 à 100, 5 au-delà. Hay Day : 1 à 5 seuils (15 → 85+). **Le nombre de récompenses par niveau grandit avec la durée du niveau**, si bien que l'intervalle entre deux récompenses reste d'environ 0,5 à 1,5 jour.
3. **Un déblocage à chaque niveau, jusqu'au bout du contenu** (Township jusqu'au 134, Hay Day jusqu'au 126). Les premiers niveaux secs arrivent seulement à la toute fin.
4. **Le prochain déblocage est visible** : cadenas « Lv. 24 », « Lv. 26 » (Bid Master), « Next Level » sur le bâtiment (DoA), aperçu du niveau suivant en touchant l'étoile (Hay Day).
5. **Des courts minuteurs subsistent toujours** (riz 1 h 20 à Township niv. 56, avoine 7 min à Hay Day niv. 119). Une session active reste donc productive même au niveau 100.
6. **Le social hebdomadaire** (Regatta, derby, guilde) donne une échéance de 7 jours indépendante du niveau.
7. **Aucune punition d'absence** (Hay Day), et des **revenus plafonnés** (garage à 24 h chez Bid Master, 8 h dans nos notes) qui invitent à revenir sans culpabiliser.

---

## 6. Courbe recommandée pour notre jeu (village du Père Noël)

> Objectif : **joueur actif, 2-3 sessions par jour** (5-15 min chacune, 20-40 min par jour).
> Toutes les valeurs sont **[I]** : ce sont des propositions calibrées sur les données ci-dessus.

### 6.1 Ce qu'on change par rapport à aujourd'hui

| | Aujourd'hui (`town.js`) | Recommandé |
|---|---|---|
| XP du niveau 1 | 30 | **10** (rafale) |
| XP du niveau 10 | 896 | 700 |
| XP du niveau 30 | 4 918 | 10 800 |
| XP du niveau 60 | 14 598 | 61 300 |
| XP cumulée pour atteindre le niveau 60 | 333 766 | ~1 020 000 |
| Formule | `20·L^1.6 + 10·L` | 1-7 à la main, puis **`2,2 · L^2,5`** à partir du niveau 8 |
| Maison du Père Noël niv. 15 | 2 h 34 (plafond global de 8 h) | **5 jours** (plafond de 7 jours) |

**Pourquoi un exposant de 2,5 (et pas 3,16 comme Township) ?** Township vise des années de jeu et 134 niveaux. Nous visons un arc d'environ 5 mois pour 60 niveaux. Un exposant plus doux garde les mêmes sensations (×1,26 par niveau au 10, ×1,04 au 60) avec moins d'XP à fabriquer.

### 6.2 Cibles de temps réel

Le temps cumulé suit **`T(L) ≈ (L/10)^2,8` jours** pour L ≥ 10. Ce temps compte en jours calendaires pour un joueur à 2-3 sessions par jour, et il est calé entre le modèle Township et les témoignages Hay Day.

| Atteindre le niveau | Temps cible | Équivalent chez les références |
|---|---|---|
| **2** | **~1 min** (session 1) | Township niv. 2 en 2-3 min ; Hay Day 27 XP |
| **5** | **~10-12 min** (session 1) | Township niv. 4-5 en session 1 |
| **10** | **fin du jour 1** (3 sessions, ~75 min de jeu cumulé) | Township niv. 8-11 au J0 ; Hay Day niv. 6-9 |
| **15** | **J3** | Township niv. 15 en J1 (très actif) ; CoC HDV 5 |
| **20** | **J7 (semaine 1)** | Township niv. 20 en J3 (très actif) ou « quelques semaines » (moyen) |
| **30** | **J22 (≈ 3 semaines)** | Township niv. 30 en ~J13 ; Hay Day ~niv. 25 à un mois |
| **40** | **J49 (≈ 7 semaines)** | Township niv. 40 en ~J37 |
| **60** | **J150 (≈ 5 mois)** | Township niv. 60 en ~J165 ; CoC HDV 10 en ~6 mois |

Durée **d'un** niveau : ~1 min (niv. 1-3) ; 3-7 min (niv. 4-6) ; 2-4 h de temps réel (niv. 7-9) ; **7 h (niv. 10)** ; **1 jour (niv. 20)** ; 2 jours (30) ; 3,5 jours (40) ; 5 jours (50) ; **7 jours (60)**. Le temps par niveau est multiplié par **~1 000** entre le niveau 2 et le niveau 60, comme chez les références.

### 6.3 XP par niveau, niveaux 1 à 60

« XP/jour nécessaire » = combien un joueur actif doit gagner par jour à ce niveau pour tenir la cible. **Cette colonne sert à équilibrer l'économie** (commandes, lettres, constructions). Elle grandit comme **~L^0,7**, exactement la pente mesurée sur Township (R ∝ L^0,68).

| Niv. | XP pour passer au suivant | XP cumulée pour atteindre ce niveau | Atteint vers | Durée de ce niveau (temps réel) | XP/jour nécessaire |
|---|---|---|---|---|---|
| 1 | 10 | 0 | 0 | ~1 min | — |
| 2 | 25 | 10 | ~1 min | ~2 min | — |
| 3 | 45 | 35 | ~3 min | ~3 min | — |
| 4 | 75 | 80 | ~6 min | ~5 min | — |
| 5 | 120 | 155 | ~11 min | ~7 min | — |
| 6 | 180 | 275 | ~18 min | fin de session 1 → session 2 | — |
| 7 | 260 | 455 | session 2 (~+3-4 h) | quelques heures | — |
| 8 | 400 | 715 | session 2 | quelques heures | — |
| 9 | 530 | 1 115 | session 3 (soir du J1) | quelques heures | — |
| 10 | 700 | 1 645 | fin du J1 | 7 h | 2 290 |
| 11 | 880 | 2 345 | J1,3 | 9 h | 2 440 |
| 12 | 1 100 | 3 225 | J1,7 | 10 h | 2 630 |
| 13 | 1 350 | 4 325 | J2,1 | 12 h | 2 810 |
| 14 | 1 600 | 5 675 | J2,6 | 13 h | 2 930 |
| 15 | 1 900 | 7 275 | J3,1 | 15 h | 3 080 |
| 16 | 2 250 | 9 175 | J3,7 | 17 h | 3 260 |
| 17 | 2 600 | 11 425 | J4,4 | 18 h | 3 390 |
| 18 | 3 000 | 14 025 | J5,2 | 20 h | 3 540 |
| 19 | 3 450 | 17 025 | J6,0 | 22 h | 3 700 |
| 20 | 3 950 | 20 475 | J7 | 1,0 j | 3 870 |
| 21 | 4 450 | 24 425 | J8 | 1,1 j | 4 010 |
| 22 | 5 000 | 28 875 | J9 | 1,2 j | 4 150 |
| 23 | 5 600 | 33 875 | J10 | 1,3 j | 4 300 |
| 24 | 6 200 | 39 475 | J12 | 1,4 j | 4 410 |
| 25 | 6 900 | 45 675 | J13 | 1,5 j | 4 570 |
| 26 | 7 600 | 52 575 | J15 | 1,6 j | 4 700 |
| 27 | 8 350 | 60 175 | J16 | 1,7 j | 4 830 |
| 28 | 9 150 | 68 525 | J18 | 1,8 j | 4 960 |
| 29 | 9 950 | 77 675 | J20 | 2,0 j | 5 070 |
| 30 | 10 800 | 87 625 | J22 | 2,1 j | 5 180 |
| 31 | 11 800 | 98 425 | J24 | 2,2 j | 5 340 |
| 32 | 12 700 | 110 225 | J26 | 2,3 j | 5 440 |
| 33 | 13 800 | 122 925 | J28 | 2,5 j | 5 590 |
| 34 | 14 800 | 136 725 | J31 | 2,6 j | 5 690 |
| 35 | 15 900 | 151 525 | J33 | 2,7 j | 5 810 |
| 36 | 17 100 | 167 425 | J36 | 2,9 j | 5 940 |
| 37 | 18 300 | 184 525 | J39 | 3,0 j | 6 050 |
| 38 | 19 600 | 202 825 | J42 | 3,2 j | 6 180 |
| 39 | 20 900 | 222 425 | J45 | 3,3 j | 6 300 |
| 40 | 22 300 | 243 325 | J49 | 3,5 j | 6 420 |
| 41 | 23 700 | 265 625 | J52 | 3,6 j | 6 530 |
| 42 | 25 200 | 289 325 | J56 | 3,8 j | 6 650 |
| 43 | 26 700 | 314 525 | J59 | 3,9 j | 6 760 |
| 44 | 28 300 | 341 225 | J63 | 4,1 j | 6 880 |
| 45 | 29 900 | 369 525 | J67 | 4,3 j | 6 980 |
| 46 | 31 600 | 399 425 | J72 | 4,5 j | 7 100 |
| 47 | 33 300 | 431 025 | J76 | 4,6 j | 7 200 |
| 48 | 35 100 | 464 325 | J81 | 4,8 j | 7 310 |
| 49 | 37 000 | 499 425 | J86 | 5,0 j | 7 430 |
| 50 | 38 900 | 536 425 | J91 | 5,2 j | 7 530 |
| 51 | 40 900 | 575 325 | J96 | 5,4 j | 7 640 |
| 52 | 42 900 | 616 225 | J101 | 5,5 j | 7 740 |
| 53 | 45 000 | 659 125 | J107 | 5,7 j | 7 850 |
| 54 | 47 100 | 704 125 | J112 | 5,9 j | 7 950 |
| 55 | 49 400 | 751 225 | J118 | 6,1 j | 8 070 |
| 56 | 51 600 | 800 625 | J124 | 6,3 j | 8 160 |
| 57 | 54 000 | 852 225 | J131 | 6,5 j | 8 280 |
| 58 | 56 400 | 906 225 | J137 | 6,7 j | 8 380 |
| 59 | 58 800 | 962 625 | J144 | 6,9 j | 8 470 |
| 60 | 61 300 | 1 021 425 | J151 | 7,2 j | 8 570 |

Code proposé :
```js
const XP_EARLY = [10, 25, 45, 75, 120, 180, 260];          // niveaux 1-7
const r = x => x < 1000 ? Math.round(x / 10) * 10 : x < 10000 ? Math.round(x / 50) * 50 : Math.round(x / 100) * 100;
export const xpNeed = L => L <= 7 ? XP_EARLY[L - 1] : r(2.2 * Math.pow(L, 2.5));
```

**Rythme d'XP en jeu, pour calibrer les gains** :
- **Jour 1** : ~20 XP par minute de jeu (1 645 XP en ~75 min). Une récolte vaut 1-2 XP, un premier bâtiment 10 XP, une commande 10-30 XP. Ce sont les valeurs de Township.
- **Jours suivants** : de 2 300 XP/jour (niv. 10) à 8 600 XP/jour (niv. 60). L'économie doit donc multiplier l'XP gagnée par ~3,7 entre ces deux niveaux, grâce à de plus grosses commandes, plus d'ateliers et des constructions plus longues.

**XP de construction** : adopter la règle de Clash of Clans, **`XP = ⌊√(durée en secondes)⌋`** (éventuellement ×1,5). Un chantier de 10 s rapporte 3 XP, 1 h en rapporte 60 et 1 jour 293. **Les longs chantiers rapportent moins d'XP par heure** : on ne peut pas monter de niveau en ne faisant que construire, il faut aussi les commandes et les lettres.

### 6.4 Maison du Père Noël (1 à 15) : durée des constructions et améliorations

La Maison est notre HDV, notre Forteresse. **Le niveau joueur requis** l'aligne sur les cibles de temps.

| Maison niv. | Niveau joueur requis | Atteint vers | Amélioration de la Maison | Autres bâtiments à ce stade (min → max) | Famille |
|---|---|---|---|---|---|
| 1 | 1 | session 1 | (déjà là) | 3 s → 15 s | **secondes** |
| 2 | 2 | ~1-2 min | **10 s** | 10 s → 1 min | secondes |
| 3 | 5 | ~12 min | **2 min** | 30 s → 5 min | **minutes** |
| 4 | 8 | session 2, J1 | **20 min** | 2 min → 30 min | minutes |
| 5 | 11 | J1-2 | **1 h** | 10 min → 1 h | **heures** |
| 6 | 14 | J2-3 | **2 h** | 20 min → 2 h | heures |
| 7 | 17 | J4-5 | **4 h** | 30 min → 4 h | heures (« avant de partir ») |
| 8 | 20 | J7 | **8 h** | 1 h → 8 h | **nuit** |
| 9 | 24 | J12 | **12 h** | 2 h → 12 h | nuit |
| 10 | 28 | J18 | **1 j** | 3 h → 16 h | **jours** |
| 11 | 33 | J28 | **1 j 12 h** | 4 h → 1 j | jours |
| 12 | 38 | J42 | **2 j** | 6 h → 1 j 12 h | jours |
| 13 | 44 | J63 | **3 j** | 8 h → 2 j | jours |
| 14 | 51 | J96 | **4 j** | 10 h → 2 j 12 h | jours |
| 15 | 58 | J137 | **5 j** | 12 h → 3 j | jours (**plafond global : 7 j**) |

**Règles** :
- Les deux premiers sauts (10 s → 2 min → 20 min) sont **×10 à ×12**, comme le HDV 2 → 3 de Clash of Clans (×180) ou Township 40 s → 1 h. Ensuite, **×2 par niveau** jusqu'au niveau 10 (comme DoA), puis **+12 h à +1 j par niveau**, avec un plafond (CoC : 12 j ; Township : 3 j ; Hay Day : 4 j). Pour un village de Noël grand public, **5 j pour la Maison et 3 j pour les autres bâtiments** est le bon compromis.
- **Formule pour les bâtiments autres que la Maison** : `durée(niv) = base × 2^(niv−1)` jusqu'au niveau 8, puis `× 1,35` par niveau. **Plafond de 3 j**, plus une limite « ≤ durée actuelle de la Maison ».
- **Garder 2 équipes de lutins bâtisseurs au départ**, une 3ᵉ à la Maison niv. 5 et une 4ᵉ à la Maison niv. 9, gagnées par quête ou événement. Chez CoC, le nombre de bâtisseurs est le principal accélérateur (×5 entre 1 et 5 bâtisseurs) [C].
- **Fin gratuite si moins de 3 min restent** : on garde cette règle (elle est déjà dans le code). Elle rend gratuits tous les chantiers des Maisons 1 à 3.
- **Maison 10+ : un objet-clé** (« Sceau du Pôle Nord », équivalent du Completion Grant de DoA), gagné par chapitre ou événement. Le mur devient alors un objectif, plus seulement une attente.

### 6.5 Minuteurs de production

| Étape (niveau joueur) | Courts : pendant la session | Retour : rappellent la session suivante | Nuit : lancés le soir |
|---|---|---|---|
| 1-5 (session 1) | **30 s - 2 min** (sapins, biscuits) | 5 min (premier jouet) | — |
| 6-10 (jour 1) | 1-5 min | **15-60 min** | 2 h (1ʳᵉ fois en fin de J1) |
| 11-20 (semaine 1) | 2-10 min | 30 min - 2 h | **4-8 h** |
| 21-35 (mois 1) | 5-15 min | 1-4 h | 8-12 h |
| 36-60 (mois 2-5) | **5-20 min (toujours !)** | 2-6 h | 10-16 h |

- **Règle Hay Day et Township** : chaque nouveau palier ajoute **au moins un produit court** (≤ 20 min) en plus des longs. La croissance passe surtout par les **quantités** demandées et la **longueur des chaînes** (jouet = bois + tissu + peinture), pas par l'allongement indéfini des minuteurs.
- **Lettres et commandes du traîneau** : remplacer une lettre jetée prend 30 min (Township) [C]. Le traîneau-train revient en **1 h (niv. 5-10), 3 h (11-20), 5 h (21+)**, et apporte les matériaux de construction (modèle du train de Township, 5 h) [C pour la référence].
- **Revenus passifs plafonnés** (scierie, bureau des lettres) : capacité = **8 h** de production. On revient le matin et le soir, sans punition (Hay Day [C]).

### 6.6 Objectifs courts entre deux niveaux (indispensables dès le niveau 15)

| Système | Fréquence | Référence | Notre version |
|---|---|---|---|
| **Coffres d'XP sur la barre** | 1 coffre par niveau (niv. 11-25), 2 (26-40), 3 (41-60) | Township C1-C5 ; Hay Day 1-5 seuils [C] | « Cadeaux sous le sapin » sur la barre d'XP : **une récompense toutes les 12-24 h de jeu réel** |
| **Tableau de tâches** | 3 cartes, renouvelées dès qu'une est finie | Township (niv. 3+) [C] | « Liste du Père Noël » : 3 tâches de 2 à 4 mots avec un bouton « Go » |
| **Chapitres** | 4 tâches et une grosse récompense ; ~1,5 chapitre par niveau au milieu de partie | Bid Master [C] | « Chapitres du conte de Noël » : une page d'histoire et un objet-clé |
| **Commandes** | 3 → 9 simultanées selon la population | Township (hélico), Hay Day (camion, 9) [C] | Lettres d'enfants sur la carte (rouge = il manque, vert = prêt) |
| **Quotidien** | 3 quêtes par jour, connexion sur 7 puis 28 jours | Township Gold Pass, Bid Master [C] | « Calendrier de l'Avent » (24 cases) toute l'année, avec rattrapage |
| **Hebdomadaire** | Course de 7 jours, 12 tâches de groupe | Township Regatta (niv. 19), Hay Day derby (niv. 18) [C] | « Course des traîneaux » du lundi au lundi, **à partir du niveau 18** |
| **Événement** | 7-10 jours toutes les 2-3 semaines | Township [C] | Fêtes (Saint-Nicolas, Épiphanie…) et minis-saisons |
| **Collections** | Objets et sets à compléter | Bid Master (musée), Township (musée) [C] | Album de jouets anciens |
| **Mini-jeux à recharge** | 10-20 essais par jour | Bid Master casino et mine, Township puzzles [C] | Déjà prévus (`minigames.js`) : les plafonner par jour |
| **Rattrapage** | Boost à chaque Maison (3-5 j), aide aux ressources, événement de retour | CoC, Bid Master [C] | « Coup de main des lutins » : −25 % sur les durées pendant 3 jours après chaque Maison |

### 6.7 Déblocages

- **Niveaux 1-20 : un déblocage visible à chaque niveau** (produit, bâtiment ou système). **Un nouveau système tous les 2-3 niveaux**, comme Township et Hay Day [C].
  - Exemples : atelier (2), lettres (3), traîneau-train (5), deuxième ressource (7), écurie des rennes (9), Liste du Père Noël (10), coffres d'XP (11), course des traîneaux (18), mine de cristaux (21).
- **Niveaux 21-60 : au moins un produit nouveau par niveau, et un bâtiment tous les 2-3 niveaux.** **Zéro niveau sec** avant la fin du contenu.
- **Montrer à l'avance** : parcelles verrouillées avec un cadenas « Niv. N » visibles **5 niveaux** avant (Bid Master [C]) ; aperçu du niveau suivant en touchant l'étoile (Hay Day [C]).

---

## Sources

**Wikis (wikitext lu via l'API MediaWiki publique)**
- Township : https://township.fandom.com/wiki/Level_up · https://township.fandom.com/wiki/Xp · https://township.fandom.com/wiki/Factories · https://township.fandom.com/wiki/Crops · https://township.fandom.com/wiki/Community_Buildings · https://township.fandom.com/wiki/Regatta
- Hay Day : https://hayday.fandom.com/wiki/Experience · https://hayday.fandom.com/wiki/Experience_Levels (sous-pages Levels 1-25, 26-50, 51-75, 76-100) · https://hayday.fandom.com/wiki/Crops_List · https://hayday.fandom.com/wiki/Production_Buildings_List · https://hayday.fandom.com/wiki/Derby · https://hayday.fandom.com/wiki/Farm_Pass
- Clash of Clans : https://clashofclans.fandom.com/wiki/Experience · https://clashofclans.fandom.com/wiki/Town_Hall · https://clashofclans.fandom.com/wiki/Cannon/Home_Village · https://clashofclans.fandom.com/wiki/Gold_Mine/Home_Village · https://clashofclans.fandom.com/wiki/Archer_Tower/Home_Village · https://clashofclans.fandom.com/wiki/Laboratory · https://clashofclans.fandom.com/wiki/Events · https://clashofclans.fandom.com/wiki/Season_Challenges · https://clashofclans.fandom.com/wiki/Magic_Items

**Données et guides**
- Clash Ninja, temps pour maxer chaque HDV : https://www.clash.ninja/guides/how-long-to-max-th-4 · …-th-6 · …-th-9 · …-th-12
- Guide japonais Township (jours par niveau, 3 connexions/jour) : https://games.appmatch.jp/?p=207572
- Deconstructor of Fun, *How Playrix' Township became a billion dollar game* : https://www.deconstructoroffun.com/blog/2020/10/13/how-playrix-township-became-a-billion-dollar-game
- Udonis, *Hay Day dissection* (niv. 7 après 3 jours, déblocages de monétisation) : https://www.blog.udonis.co/mobile-marketing/mobile-games/hay-day-monetization
- YouTube, « Level 1 to 20 only took 3 hours » (Hay Day) : https://www.youtube.com/watch?v=5ldDyTvC49o
- TikTok, témoignages Hay Day niveau 100 : https://www.tiktok.com/discover/max-level-hay-day · https://www.tiktok.com/discover/hay-day-levels
- Saratoga Falcon (Hay Day, niv. 34 en 4 ans) : https://saratogafalcon.org/?p=16447
- Guides CoC (rythme HDV, *rush*) : https://trophycoach.com/clash-of-clans/guides/clash-of-clans-beginner-guide · https://game-wisdom.com/?p=33068 · https://grandavehousing.calpoly.edu/news/how-long-to-max-town (estimations isolées, faible fiabilité)

**Nos fichiers**
- `santa-game/TOWNSHIP-10MIN.md`
- `research/BIDMASTER.md`, `research/BIDMASTER-ECRANS.md`, `research/BIDMASTER-UPDATES.md`, `research/video/SYNTHESE.md`, `research/video/bidmaster-m0..m4.md`
- `research/DRAGONS-OF-ATLANTIS.md`, `research/DOA-ECRANS.md`
- Code actuel : `js/v2/town.js` (`xpNeed`, `upTime`, `buildXp`)

**Inaccessibles** : reddit.com (bloqué pour l'outil de lecture) et forum.playrix.com (domaine hors du réseau autorisé de la session). Pour obtenir plus de témoignages « niveau X en Y jours », il faudrait autoriser ces domaines.

## Résultat dans le jeu (simulateur `node tools/simulate.mjs 150`)

Joueur assidu : 25 min puis 2 × 10 min le jour 1, ensuite 3 sessions de 10 min par jour.

| Niveau | 2 | 5 | 7 | 10 | 12 | 15 | 20 | 25 | 30 | 40 | 50 | 60 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Atteint | 1 min | 3 min | 19 min | 22 h | J1,4 | J3,1 | J7,4 | J15 | J26 | J51 | J89 | J144 |

Maison du Père Noël : niv. 10 à J3,9, 15 à J19, 20 à J80, 25 (max) à J115.

- XP par niveau : 10, 25, 45… puis 2,2·L^2,5, encore allongé au-delà de 40.
- XP des lettres : × (1 + 0,17 × niveau), pour que livrer reste la vraie source d'XP.
- Coffres de la barre d'XP à partir du niveau 8 : un coffre à chaque tiers de barre, pour garder un objectif à court terme dans les niveaux longs.
- Maison prolongée jusqu'au niveau 25 (chantiers de 5,5 à 7 jours, coût +28 % par niveau après 15).
