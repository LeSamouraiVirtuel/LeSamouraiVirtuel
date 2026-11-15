# Bid Master : auction tycoon — historique complet des mises à jour (2023 → oct. 2026)

> Recherche faite le 4 novembre 2026. Elle complète `BIDMASTER.md` (inventaire des bâtiments et systèmes).
> Légende : **[C]** = confirmé par une source citée (URL en §5) ; **[I]** = déduit ou recoupé, ou bien source unique peu fiable.
> Données brutes conservées dans `research/raw/bidmaster/`. Les fichiers principaux :
> - `versionHistory_all_storefronts.json` : historique App Store extrait de 12 vitrines (us, gb, fr, de, es, br, jp, kr, tw, in, bn) ;
> - `soft112_versionHistory.json` : miroir plus ancien de l'historique App Store, qui remonte à la v0.2.2 ;
> - `bidmaster_versions_master.json` : synthèse iOS et Android ;
> - `uptodown_api_p*.json` : liste des APK Android ;
> - `reviews_all.json` : 630 avis App Store, avec la version notée par chaque joueur ;
> - `lookup_*.json` : API iTunes ;
> - `*.html.gz` : pages sources.

---

## 0. Méthode et limites (à lire d'abord)

- **App Store (iOS)** : la page web d'Apple n'affiche que les **25 dernières versions**, de la 0.3.6 (5 févr. 2024) à la 0.9.1 (26 oct. 2026), quelle que soit la vitrine. J'ai interrogé 12 vitrines. Le contenu des notes est identique partout, seule la langue change (traductions officielles). Il y a une exception : la vitrine **GB** a une formulation anglaise légèrement différente pour la 0.6.3 et la 0.7.0. Ces variantes sont reproduites plus bas.
- **Versions iOS antérieures (0.2.2 à 0.3.5)** : je les ai retrouvées sur le miroir **soft112**, qui a conservé une copie plus ancienne de l'historique App Store.
- **Avant la 0.2.2 (août à nov. 2023)** : **aucune note de version n'a été retrouvée**. Un résumé de moteur de recherche cite les versions 0.1.5 (21 août 2023), 0.1.6 (20 sept. 2023, « fully launched »), 0.1.9 (3 nov. 2023) et 0.2.1 (27 nov. 2023). Je n'ai pas pu retrouver de page source pour ces versions, donc **[I] non vérifié**. Seule la date du 21 août 2023 est confirmée, par l'API iTunes.
- **Android (Google Play)** : Google Play ne publie pas d'historique, seulement le « Quoi de neuf » actuel. Ce texte est d'ailleurs **périmé** : la fiche est en v0.9.0, mais il affiche encore les notes de la 0.8.5. La liste des numéros de version vient d'**Uptodown**, qui en recense 29. Attention : les dates Uptodown sont des **dates de mise en ligne sur le miroir** et non des dates officielles. Plusieurs sont manifestement tardives, comme la 0.1.9 datée de mars 2025. APKPure, APKCombo, AppBrain et Aptoide **bloquent l'accès automatisé** (403 ou domaine refusé) ; je n'ai pas contourné ce blocage et n'ai utilisé que leurs extraits dans les moteurs de recherche.
- **Réseaux sociaux** : je n'ai trouvé **aucune page Facebook, Discord ou X officielle indexée**. YouTube ne contient que des vidéos de joueurs, dont j'ai utilisé les titres et l'ancienneté.
- **Notes en double** : six paires de versions consécutives portent **exactement le même texte** (0.3.1/0.3.3, 0.3.7/0.3.8, 0.6.1/0.6.2 à une ligne près, 0.8.0/0.8.1, 0.8.7/0.8.8, 0.9.0/0.9.1). Ce sont des correctifs (hotfixes) publiés sans notes propres.

---

## 1. État au lancement

### 1.1 Dates de sortie par plateforme

| Plateforme | Date | Source | Statut |
|---|---|---|---|
| iOS (App Store, id 6453025143) | **21 août 2023** (`releaseDate` 2023-08-21T07:00:00Z) | API iTunes lookup, MWM (« First Released Aug 21, 2023 »), TapTap (« Scheduled to release on Aug 21, 2023 for iOS ») | [C] |
| iOS, date de « publication » affichée par iofreeonline | 27 nov. 2023 | iofreeonline (« Pubish Date : Mon Nov 27 2023 ») | [I] Il s'agit probablement de la date d'une version (0.2.1 ?) ou d'une sortie mondiale après un soft-launch. |
| Android, annonce TapTap | **20 juin 2023** (« Scheduled to release on Jun 20, 2023 for Android ») | TapTap | [C] pour l'annonce. [I] pour une sortie réelle : c'était probablement un soft-launch ou une pré-inscription. |
| Android, Google Play, « Released on » | **6 août 2024** | Google Play (bloc de données de la fiche), Skich | [C] C'est la date que Google affiche. Elle est postérieure à des APK plus anciennes (0.1.9, puis 0.4.5 en juin 2024), ce qui suggère une **republication ou une sortie mondiale de la fiche Play en août 2024**, au moment de la v0.5.2 (guildes) [I]. |
| Plus ancienne version Android connue | **0.1.9** | Uptodown, liste des versions | [C] pour l'existence. La date du miroir (31 mars 2025) n'est pas fiable. |

Éditeurs : le vendeur iOS s'appelait d'abord **SHENZHEN BRAINPOWER TECHNOLOGY CO.LTD** (selon iofreeonline et des résumés de recherche), puis **EYEWIND LIMITED** (vendeur actuel d'après l'API iTunes) [C]. Sur Android, l'éditeur est **Hydodo** [C]. La politique de confidentialité se trouve sur incolor.cc et le contact est Privacy@eyewind.cc [C].

Jalons d'audience :
- iOS : 50 000 téléchargements atteints en mars 2024 et 5 M en janvier 2026, d'après MWM [C, estimation tierce].
- Android : 5 M d'installations le 1ᵉʳ mars 2025 et 10 M le 2 juillet 2025, d'après androidrank [C, estimation tierce].
- Notes : 4,4 sur 3 095 avis sur iOS (US) et 4,3 sur 98 214 avis sur Google Play [C].

### 1.2 Description de lancement (texte iOS original, inchangé depuis 2023 [I])

La fiche iOS a gardé une description générique centrée uniquement sur les enchères d'entrepôts. Elle ne mentionne aucun bâtiment, ce qui en fait le meilleur témoin du **jeu de 2023**. Je la considère comme le texte de lancement [I] : elle ne cite ni guilde, ni musée, ni usine, alors que la fiche Google Play de 2024 en parle.

**Verbatim (EN, App Store) :**

> Welcome to "Bid Master", a game that combines the fun of auctions and bidding. You'll compete with other players in a game that's both easy and challenging.
>
> As a savvy auctioneer, your mission is to find valuable items in abandoned warehouses and sell them to fulfill your dreams of wealth.
>
> **Warehouse Auctions** — You'll participate in a series of thrilling warehouse auctions. Each warehouse is filled with unknown possibilities, and you'll need to use your intuition and strategy to determine which warehouse may contain treasures. Will you buy a seemingly ordinary warehouse, or will you boldly invest in a warehouse filled with potential? The choice is yours.
>
> **Compete** — You're not the only auctioneer. You'll be bidding against other players. Whether you're new to auctions or a seasoned pro, through the trials and tribulations of this game, you can easily become a winner.
>
> **Uncover Treasures** — Every auction win, every time you uncover hidden treasures, brings you endless satisfaction and achievement. Whether it's valuable artwork, rare collectibles, or historical relics, they could all be hidden in these seemingly ordinary warehouses.
>
> **Path to Wealth** — In the game, you can accumulate wealth and level up your auctioneer status to unlock more features and rewards. This game will take you from nothing to abundant wealth, feeling the joy and achievement of becoming rich.
>
> **Start Bidding Now** — Now, prepare your bidding strategy and start your auction journey! In the world of "Bid Master", let's seek out hidden items and win wealth together! Download for free, PLAY Now!

**Traduction française officielle (vitrine FR, titre « Bid Master : enchere tycoon ») :**

> Bienvenue à "Bid Master", un jeu qui combine le plaisir des enchères et des offres. Vous concourrez avec d'autres joueurs dans un jeu qui est à la fois facile et stimulant. En tant que commissaire-priseur avisé, votre mission est de trouver des objets de valeur dans des entrepôts abandonnés et de les vendre pour réaliser vos rêves de richesse.
> **Enchères d'Entrepôts** — Vous participerez à une série d'enchères d'entrepôts passionnantes. […] Allez-vous acheter un entrepôt apparemment ordinaire, ou allez-vous audacieusement investir dans un entrepôt plein de potentiel ? Le choix est le vôtre.
> **Compétition** — Vous n'êtes pas le seul commissaire-priseur. Vous enchérisserez contre d'autres joueurs. […]
> **Découvrez des Trésors** — […] Qu'il s'agisse d'œuvres d'art précieuses, de pièces de collection rares ou de reliques historiques, elles pourraient toutes être cachées dans ces entrepôts apparemment ordinaires.
> **Chemin vers la Richesse** — Dans le jeu, vous pouvez accumuler de la richesse et améliorer votre statut de commissaire-priseur pour débloquer plus de fonctionnalités et de récompenses. […]
> **Commencez à Enchérir Maintenant** — […] Téléchargez gratuitement, JOUEZ maintenant !

**À titre de comparaison, la description Google Play (sortie de la fiche en août 2024, toujours en ligne) [C] :**

> Welcome to "Bid Master," a tycoon simulator that seamlessly blends price guessing and auction simulation. […] your goal is to bid on and collect rare items, open a pawn shop, and establish and grow your business. […]
> 📦 Test your auctioning strategy! -- Collect rare treasures from around the world: antiques, sports cars, motorcycles, ships, famous paintings, second-hand cars, and even alien artifacts! […] -- Boss level challenges: Bid on ancient crowns, noble armor, mysterious statues, golden cups […]
> 💪 Manage your business empire […] -- Rent out buildings, open museums, sell cars, run gas stations, fish at fisheries…
> 🌍 Diversified business strategies -- Simulate deep-sea fishing to catch various rare fish, which you can sell or place in your Fish aquarium! […] -- Run your own restaurant! Play some cooking games […] -- Build your five-star hotel. Collect rent […] -- Manage a car factory, sell motorcycles, cars, and truck. Simulate truck operations. […]
> 🏆 Guild Wars -- Join a guild and participate in auction competitions with players from around the globe! […]

*Traduction :* « Bienvenue dans "Bid Master", un simulateur de magnat qui mêle devinette de prix et simulation d'enchères. […] Votre but : enchérir sur des objets rares et les collectionner, ouvrir un prêteur sur gages, puis fonder et développer votre entreprise. […] Collectionnez des trésors du monde entier : antiquités, voitures de sport, motos, navires, tableaux célèbres, voitures d'occasion, et même des artefacts extraterrestres ! […] Défis de niveaux boss : couronnes anciennes, armures nobles, statues mystérieuses, coupes en or… […] Louez des bâtiments, ouvrez des musées, vendez des voitures, gérez des stations-service, pêchez dans des pêcheries… Pêche en haute mer et aquarium ; restaurant avec mini-jeux de cuisine ; hôtel cinq étoiles et loyers ; usine automobile, vente de motos, voitures et camions. 🏆 Guerres de guildes : rejoignez une guilde et participez à des compétitions d'enchères contre des joueurs du monde entier ! »

> Lecture : en un an, la description passe d'un **pur jeu d'enchères** (2023) à un **tycoon multi-bâtiments avec guildes** (2024). Les « ships » (navires) et les « truck operations » figurent dans la description Play avant même les notes 0.8.5 (enchère maritime) et 0.6.1 (loterie de camions) : la description a donc été retouchée par la suite [I].

### 1.3 Ce que contenait le jeu au lancement (août 2023 à nov. 2023)

Aucune note de version de cette période n'a survécu. Voici ce qu'on peut reconstituer :

| Élément | Présent au lancement ? | Justification |
|---|---|---|
| Enchères d'entrepôts contre des IA et d'autres joueurs, inspection, valeur cachée | Oui [C] | Description iOS 2023 |
| Niveau / statut de commissaire-priseur qui débloque des fonctions | Oui [C] | Description iOS |
| Objets d'art, de collection et reliques | Oui [C] | Description iOS |
| Lingots d'or (monnaie dure) | Oui [I] | Ils sont cités comme récompense dès la 0.2.2 (déc. 2023), ce qui suppose qu'ils existaient avant |
| Agence de voyage chasse au trésor (cartes d'entrepôts thématiques) | Probable avant fév. 2024 [I] | En 0.3.6, une « nouvelle » saison S1 de l'agence démarre : l'agence existait donc déjà, peut-être sous forme d'événement |
| Prêteur sur gages, expertise, réparation, musée | Probable [I] | Indispensables à la boucle et jamais annoncés dans aucune note, donc présents d'origine. La note 0.6.1 sur l'expertise et la réparation en lingots montre qu'ils existaient avant déc. 2024 [C] |
| Usine de traitement automobile | **Non** [C] | Ajoutée en 0.3.1 (30 déc. 2023) |
| Secrétaire | **Non** [C] | Ajoutée en 0.3.1 |
| Système de titres | **Non** [C] | Ajouté en 0.3.5 |
| Connexion 7 jours | **Non** [C] | Ajoutée en 0.3.9 |
| Guildes, amis, classements, chat | **Non** [C] | Ajoutés en 0.5.2 (août 2024) |
| Pêche, restaurant, hôtel, station-service, appartements, casino, bourse, banque | Inconnu [I] | Aucune note ne les annonce. Ils figurent dans la description Play d'août 2024, donc ils sont arrivés entre 2023 et mi-2024, par des versions dont les notes sont perdues ou très vagues (« added new warehouse », « more auction items ») |

### 1.4 Légendes des captures d'écran de lancement

**Introuvables.** Les captures de 2023 n'ont pas été archivées : la Wayback Machine est inaccessible depuis cet environnement et les miroirs ne gardent que les visuels actuels. Les 8 captures iPhone actuelles (téléchargées dans `raw/bidmaster/screenshots/`) **n'ont aucune légende textuelle**. Ce sont des scènes d'enchère qui montrent :
1. une maison délabrée à 15 000 $ ;
2. un parking de voitures de sport à 300 000 $ ;
3. un box avec la Joconde, une couronne et un buste ;
4. un conteneur avec une moto ancienne ;
5. une Coccinelle jaune ;
6. une montre en or sortie d'un carton ;
7. une supercar dorée ;
8. une loupe d'inspection sur des objets cachés (« $??? ») et des pancartes d'enchérisseurs (BID 001, 003, 077, 023).

Les mêmes adversaires PNJ reviennent sur chaque image : une femme rousse, un homme moustachu, un homme à casquette verte, un vieil homme en salopette, un ouvrier casqué et une blonde en robe rouge [C, observation des images].

---

## 2. Historique complet des versions

### 2.1 Tableau récapitulatif

Plateforme iOS : date officielle App Store, en UTC. Plateforme Android : date du miroir Uptodown, **[I]**, souvent décalée.

| # | Version | iOS (date) | Android (Uptodown, indicatif) | Notes trouvées ? | Contenu principal |
|---|---|---|---|---|---|
| 1 | 0.1.5 ? | 21 août 2023 (sortie) [C] | — | **Non** | Lancement iOS. Le n° 0.1.5 n'est pas vérifié [I] |
| 2 | 0.1.6 ? | 20 sept. 2023 [I] | — | **Non** | (« fully launched » selon un résumé non sourcé) |
| 3 | 0.1.9 | 3 nov. 2023 [I] | 0.1.9 existe [C] | **Non** | — |
| 4 | 0.2.1 ? | 27 nov. 2023 [I] | — | **Non** | (même date que la « Pubish Date » d'iofreeonline) |
| 5 | 0.2.2 | **8 déc. 2023** [C] | — | Oui | Noël, carte d'hiver |
| 6 | 0.3.1 | **30 déc. 2023** [C] | — | Oui | Usine automobile, secrétaire |
| 7 | 0.3.3 | **3 janv. 2024** [C] | — | Oui (= 0.3.1) | Correctif |
| 8 | 0.3.5 | **25 janv. 2024** [C] | — | Oui | 3 événements, titres |
| 9 | 0.3.6 | **5 févr. 2024** [C] | — | Oui | Saison S1 de l'agence de voyage |
| 10 | 0.3.7 | **8 févr. 2024** [C] | — | Oui | Nouvel An, carte de printemps, 2 cartes d'agence |
| 11 | 0.3.8 | **28 févr. 2024** [C] | — | Oui (= 0.3.7) | Correctif |
| 12 | 0.3.9 | **16 mars 2024** [C] | — | Oui | Connexion 7 jours, secrétaire |
| 13 | 0.4.2 | **22 avr. 2024** [C] | — | Oui | Profil, nouvel entrepôt, héros chibi |
| — | 0.4.5 | — | 17 juin 2024 (APKCombo : mai 2024) | **Non** (Android seul) | — |
| 14 | 0.4.8 | **24 juin 2024** [C] | — | Oui | « Resource Aid », refonte graphique |
| — | 0.4.7 / 0.4.9 | — | APK en miroir | **Non** (Android seul) | — |
| 15 | 0.5.2 | **8 août 2024** [C] | miroir 24 janv. 2025 | Oui | **Guildes**, amis, classements, chat, boss |
| 16 | 0.5.4 | **9 sept. 2024** [C] | miroir 12 mars 2025 | Oui | Chasse au trésor, compétition de guilde, skins |
| — | 0.5.5 | — | miroir 27 janv. 2025 | **Non** (Android seul) | — |
| 17 | 0.5.6 | **16 oct. 2024** [C] | APKPure : 27 sept. 2024 [I] | Oui | Retour 3 jours, **Aventure secrète** (donjons) |
| 18 | 0.5.7 | **31 oct. 2024** [C] | miroir 30 janv. 2025 | Oui | Halloween, **Monopoly** |
| — | 0.5.9 / 0.6.0 | — | miroir 3 févr. 2025 | **Non** (Android seul) | — |
| 19 | 0.6.1 | **16 déc. 2024** [C] | miroir 3 févr. 2025 | Oui | **Enchères mondiales**, Noël, expertise et réparation en or à +100 %, **Garage** |
| 20 | 0.6.2 | **31 déc. 2024** [C] | 31 déc. 2024 | Oui (≈ 0.6.1) | Correctif (écran noir) |
| 21 | 0.6.3 | **17 févr. 2025** [C] | miroir 14 mars 2025 | Oui | BLACK 21, Lucky Dice, Maison de l'inventeur, carte maya, connexion de guilde, **S4, 3ᵉ étage du musée** |
| — | 0.6.4 | — | 13 mars 2025 | **Non** (Android seul) | — |
| 22 | 0.6.5 | **9 avr. 2025** [C] | APKPure : 13 mars 2025 ; Uptodown : 15 mars 2025 | Oui | Loterie de skins (robot, hélicoptère) |
| — | 0.6.6 | — | 10 juin 2025 | **Non** (Android seul) | — |
| 23 | 0.6.7 | **4 juin 2025** [C] | 10 juin 2025 | Oui | **Mine**, missions de prime, niveaux Allemagne |
| — | 0.6.8 | — | 23 juin 2025 | **Non** (Android seul) | — |
| 24 | 0.7.0 | **8 août 2025** [C] | 2 août 2025 | Oui | **Métropole**, maison de rêve, trésors des grands fonds, enchères blind box, tenues |
| — | 0.7.5 / 0.7.6 | — | 27 et 29 oct. 2025 (APKCombo : 0.7.6 le 28 oct. 2025) | **Non** (Android seul ; équivalent probable de la 0.7.7 iOS) | — |
| 25 | 0.7.7 | **30 oct. 2025** [C] | — | Oui | **Zone de bataille de la Métropole** (territoires), Halloween, Thanksgiving |
| 26 | 0.7.8 | **25 nov. 2025** [C] | — | Oui | Stabilité |
| 27 | 0.8.0 | **17 déc. 2025** [C] | 17 déc. 2025 | Oui | Défi et Vœux de Noël, **animaux**, mode enquête-histoire, villa |
| 28 | 0.8.1 | **29 janv. 2026** [C] | 27 janv. 2026 | Oui (= 0.8.0) | Correctif |
| — | 0.8.4 | — | 25 mars 2026 | **Non** (Android seul ; contenu ≈ 0.8.5 [I]) | — |
| 29 | 0.8.5 | **2 avr. 2026** [C] | 27 mars 2026 | Oui | **Centre de transport**, enchère maritime, niveaux Royaume-Uni |
| 30 | 0.8.7 | **30 juin 2026** [C] | 12 juin 2026 | Oui | Treasure Inn (voitures), enchère de valises, **base et propriétés de guilde** |
| 31 | 0.8.8 | **9 juil. 2026** [C] | 12 juil. 2026 | Oui (= 0.8.7) | Correctif |
| 32 | 0.9.0 | **23 sept. 2026** [C] | AppBrain : 2 sept. ; Play : 3 sept. ; Uptodown : 8 sept. ; APKPure : 12 sept. 2026 (build 183) | Oui | **Manoir du collectionneur**, **Cour des familiers**, phase 2 de l'énigme |
| 33 | 0.9.1 | **26 oct. 2026** [C] (version actuelle) | — (Play reste en 0.9.0) | Oui (= 0.9.0) | Correctif |

**Bilan** : **29 versions iOS avec notes** (0.2.2 à 0.9.1, soit 25 notes issues d'Apple et 4 issues du miroir soft112). S'y ajoutent **4 versions iOS de 2023 sans notes** : seule la date du 21 août 2023 est sûre, et la 0.1.9 est attestée côté Android. Enfin, **12 versions propres à Android** n'ont pas d'équivalent iOS : 0.4.5, 0.4.7, 0.4.9, 0.5.5, 0.5.9, 0.6.0, 0.6.4, 0.6.6, 0.6.8, 0.7.5, 0.7.6 et 0.8.4. Cela fait **45 numéros de version** au total. **Aucune note** n'a été retrouvée pour les versions iOS 0.1.x à 0.2.1 (août à nov. 2023) ni pour les versions propres à Android.

> Note : la 0.8.5 iOS a été **reconditionnée par Apple** vers juin 2026. Selon le miroir soft112, Apple a ajouté en tête de notes « This app has been updated by Apple to prepare for watchOS 27 compatibility. No new features are included. », puis « This update from Apple will improve the functionality of this app. No new features are included. ». Ce sont des recompilations automatiques d'Apple, pas des contenus du développeur [C].

---

### 2.2 Notes de version détaillées (verbatim + traduction + analyse)

Pour chaque version, je donne : le texte original anglais (App Store US, ou miroir soft112 pour les versions 0.2.2 à 0.3.5), la **traduction française officielle** publiée par le studio sur la vitrine FR quand elle existe (à partir de la 0.3.6), sinon ma traduction, puis une analyse ligne par ligne. Le chinois traditionnel (vitrine TW) sert de référence quand l'anglais est ambigu, car le studio est chinois et le texte d'origine est probablement en chinois [I].

---

#### v0.1.5 → v0.2.1 (21 août → 27 nov. 2023), iOS
**Aucune note retrouvée.** Seules la date de sortie (21 août 2023, [C]) et l'existence d'une APK Android 0.1.9 ([C]) sont établies. Les numéros 0.1.5, 0.1.6 et 0.2.1 restent [I].

---

#### v0.2.2 — 8 déc. 2023 (iOS) — source : soft112 [C]
```
Hey! Thank you for choosing us!
NEW:
Christmas event can get a lot of gold bars
The map is updated to the winter Christmas style
Increase new items
```
Traduction : « Hé ! Merci de nous avoir choisis ! NOUVEAU : l'événement de Noël permet d'obtenir beaucoup de lingots d'or. La carte passe au style hivernal de Noël. Ajout de nouveaux objets. »

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Événement de Noël riche en lingots | Premier **événement saisonnier** connu. Il distribue généreusement la monnaie dure pour fidéliser les joueurs pendant les fêtes, période où les acquisitions sont nombreuses | Événement / rétention |
| Carte en style hiver | **Habillage saisonnier** de la carte principale. Cela ne coûte pas cher et donne l'impression d'un jeu vivant | Cosmétique / événement |
| Nouveaux objets | Plus de variété dans le butin des entrepôts, ce qui renouvelle la découverte | Contenu |

---

#### v0.3.1 — 30 déc. 2023 et v0.3.3 — 3 janv. 2024 (iOS) — même texte — source : soft112 [C]
```
Hey! Thank you for choosing us!
NEW:
1. Car Processing Factory! Experience a fresh gameplay mode!
2. New addition: A secretary to help boost your profits! Let's make your earnings effortless!
3. More auction items added! Explore a wider array of products for auction!
```
Traduction : « 1. Usine de traitement automobile ! Découvrez un nouveau mode de jeu ! 2. Nouveauté : une secrétaire pour vous aider à augmenter vos profits, sans effort ! 3. Plus d'objets aux enchères ! Explorez une gamme plus large de produits. »

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Usine de traitement automobile | **Premier bâtiment « tycoon »** hors de la boucle d'enchères. Les pièces et véhicules gagnés sont restaurés puis revendus. C'est le début de la transformation d'un jeu d'enchères en jeu de gestion | **Système ajouté** |
| Secrétaire | PNJ d'assistance qui « augmente les profits » : probablement collecte et rappels, puis un pas vers l'idle et l'automatisation [I]. Elle sera améliorée en 0.3.9 | **Système ajouté** / confort |
| Plus d'objets | Contenu | Contenu |
| (0.3.3) | Republication 4 jours plus tard avec des notes identiques : **correctif** | Correctif |

---

#### v0.3.5 — 25 janv. 2024 (iOS) — source : soft112 [C]
```
Hey! Thank you for choosing us!
NEW:
- Dive into 3 new exciting limited-time events.
- Discover a multitude of new items to enhance your gameplay.
- Showcase your prowess with our brand new title system.
Join us now and embark on a thrilling bidding adventure!
```
Traduction : « Plongez dans 3 nouveaux événements à durée limitée. Découvrez une multitude de nouveaux objets. Affichez votre talent grâce à notre tout nouveau système de titres. Rejoignez-nous et embarquez pour une aventure d'enchères palpitante ! »

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| 3 événements limités | Le « carnaval du Nouvel An » dont la fin est annoncée en 0.3.6 [I]. Le jeu commence à **enchaîner les événements** | Événements |
| Nouveaux objets | Contenu | Contenu |
| Système de titres | Statut social affiché (prestige), précurseur du profil (0.4.2) et des fonctions sociales (0.5.2) | **Système ajouté** (méta / social) |

---

#### v0.3.6 — 5 févr. 2024 (iOS) [C]
EN (US) :
```
Hey! Thank you for choosing us!
NEW:
- The New Year carnival event has ended, and the new treasure hunting travel agency S1 season has begun.
(Providing a new treasure warehouse for you to collect and search for new collectibles.)
- Optimized related gaming experiences and fixed related bugs.
Join us now and embark on a thrilling bidding adventure!
```
FR officiel :
```
Hey! Merci de nous avoir choisi!
NOUVEAU:
- La fête du Nouvel An est terminée, et la nouvelle saison de l'agence de voyage à la recherche de trésors S1 a commencé.
(Fourniture d'un nouvel entrepôt de trésors pour que vous puissiez collecter et rechercher de nouveaux objets de collection.)
- Optimisation des expériences de jeu connexes et correction des bugs associés.
Rejoignez-nous maintenant et embarquez pour une aventure d'enchères excitante!
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Fin du carnaval et **saison S1 de l'Agence de voyage chasse au trésor** | Arrivée du **modèle saisonnier**. Chaque saison apporte un entrepôt thématique et une collection à compléter, ce qui crée un **rendez-vous récurrent** et une raison de revenir | **Système ajouté** (saisons) / rétention |
| Optimisations et bugs | Maintenance | Correctif |

---

#### v0.3.7 — 8 févr. 2024 et v0.3.8 — 28 févr. 2024 (iOS) — même texte [C]
EN :
```
Hey! Thank you for choosing us!
NEW: 
- Start the New Year-themed event and win massive gold bar rewards.
- Update the spring-themed map scenes.
- Add 2 new treasure hunting travel agency maps.
- Optimize game experiences and fix bugs.

Join us now and embark on a thrilling bidding adventure!
```
FR officiel :
```
Hey! Merci de nous avoir choisi!
NOUVEAU:
- Démarrez l'événement sur le thème du Nouvel An et remportez d'énormes récompenses en lingots d'or.
- Mettez à jour les scènes de la carte sur le thème du printemps.
- Ajoutez 2 nouvelles cartes d'agences de voyage à la recherche de trésors.
- Optimisez les expériences de jeu et corrigez les bugs.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Événement du Nouvel An (lunaire, 10 févr. 2024 [I]) avec beaucoup de lingots | Deuxième fête de suite qui distribue de l'or. Le **Nouvel An chinois** confirme l'origine chinoise du studio. Le texte TW parle de « 新年主題活動 » | Événement |
| Carte au thème du printemps | Habillage saisonnier, qui remplace le décor d'hiver de la 0.2.2 | Cosmétique |
| 2 nouvelles cartes d'agence de voyage | Plus de contenu pour la saison S1 | Contenu saisonnier |
| (0.3.8) | Correctif, mêmes notes | Correctif |

---

#### v0.3.9 — 16 mars 2024 (iOS) [C]
EN :
```
Hey! Thank you for your support!
New version changes:
-Reward for adding 7-day continuous check-in function
-Optimize secretary functions
-Optimize the overall interface layout
-Optimize gaming experience and fix bugs
We look forward to your performance in the game, so come and try these new features quickly
```
FR officiel :
```
Hé! Merci de nous soutenir!
Changements dans la nouvelle édition:
- ajout de 7 jours de bonus de fonction d'inscription continue
- Optimisation des fonctions de secrétariat
- Optimisation de la disposition globale de l'interface
- Optimisation de l'expérience de jeu réparation bug
```
*(La traduction officielle est approximative : « inscription continue » signifie en fait « connexion consécutive », 连续签到.)*

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Connexion 7 jours consécutifs** | Levier de **rétention J1 à J7** classique du free-to-play | **Système ajouté** (rétention) |
| Fonctions de la secrétaire optimisées | Plus d'automatisation ou de confort (tenues aux paliers de niveau, selon les avis [C, cf. BIDMASTER.md]) | Équilibrage / confort |
| Disposition de l'interface | Refonte de l'interface, nécessaire vu le nombre de bâtiments ajoutés | UX |
| Bugs | — | Correctif |

---

#### v0.4.2 — 22 avr. 2024 (iOS) [C]
EN :
```
Hey! Thank you for your support!
New updates:
Optimized game experience and fixed bugs
Added personal information feature
Added new warehouse
Added Q version of the main character
We look forward to seeing your performance in the game. Come and try out these new features soon!
```
FR officiel :
```
Salut ! Merci pour votre soutien !
Nouvelles mises à jour :
Expérience de jeu optimisée et bogues corrigés
Fonctionnalité d'informations personnelles ajoutée
Nouvel entrepôt ajouté
Ajout de la version Q du personnage principal
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Bugs | — | Correctif |
| **Informations personnelles** (个人信息) | **Écran de profil** (avatar, titre, statistiques), préalable au multijoueur social de la 0.5.2 | **Système ajouté** (méta) |
| Nouvel entrepôt | Nouvelle carte ou niveau d'enchère | Contenu |
| Héros en « version Q » (chibi, Q版) | Nouveau style de l'avatar, rendu plus mignon et plus cohérent avec les PNJ caricaturaux. Il prépare la vente de **skins** (0.5.4, 0.6.5) | Art / monétisation future |

---

#### v0.4.8 — 24 juin 2024 (iOS) [C]
EN :
```
Hey! Welcome back to the world of Auction Master!
Update details:
● New "Resource Aid" event to make your auction journey easier!
● Optimized game experience for smoother bidding!
● Fixed known bugs to improve stability!
● Enhanced game art for more beautiful visuals!
Come experience the new version and enjoy more auction fun!
```
FR officiel :
```
Hey! Bienvenue de retour dans le monde du Maître des Enchères!
Détails de la mise à jour:
● Nouvel événement "Aide aux Ressources" pour faciliter votre parcours de mise aux enchères!
● Expérience de jeu optimisée pour des enchères plus fluides!
● Correction des bugs connus pour améliorer la stabilité!
● Amélioration de l'art du jeu pour des graphismes plus beaux!
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Événement « Resource Aid » (资源补助) | **Aide aux ressources** (énergie, cash) : un geste d'équilibrage pour débloquer les joueurs coincés. C'est l'aveu implicite d'une économie trop serrée [I] | Événement / équilibrage |
| Enchères plus fluides | Optimisation du cœur de jeu | UX / performance |
| Stabilité | — | Correctif |
| Graphismes améliorés | **Refonte artistique**, probablement en vue de la (re)sortie mondiale de la fiche Play du 6 août 2024 [I] | Art |

---

#### v0.5.2 — 8 août 2024 (iOS) [C]
EN :
```
Hey! Welcome back to the world of Auction Masters!
New Updates:
● Introducing guilds, friends, leaderboards, chat, and more!
● Introducing the first guild event gameplay.
● Challenge new BOSS levels and discover world-class treasures!
● Bug fixes for improved stability.
Come and experience the all-new version now!
```
FR officiel :
```
Salut ! Bienvenue dans le monde des Maîtres des Enchères !
Nouvelles mises à jour :
● Introduction des guildes, amis, classements, chat, et plus encore !
● Découvrez le premier événement de guilde !
● Affrontez de nouveaux niveaux de BOSS et découvrez des trésors mondiaux !
● Corrections de bugs pour une stabilité améliorée.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Guildes, amis, classements, chat** | **Virage social majeur**. Le jeu passe d'un jeu solo face à des IA à un jeu multijoueur asynchrone. C'est le levier de **rétention à long terme** et de dépense compétitive. La date coïncide avec la date « Released on » du Play Store (6 août 2024) : c'est la **version de la sortie mondiale Android** [I] | **Système ajouté** (social) |
| Premier événement de guilde | Première activité collective (contributions communes) | Événement / social |
| Nouveaux **niveaux BOSS** | Enchères de prestige pour des objets « de classe mondiale » (couronnes, armures, d'après la fiche Play). Ce sont des pics de difficulté et de récompense | Contenu / progression |
| Bugs | — | Correctif |

---

#### v0.5.4 — 9 sept. 2024 (iOS) [C]
EN :
```
Hey! Welcome back to Bid Master!

What's new:
● Treasure Hunt: Collect rare items and earn luxurious rewards!
● Guild Competition: Team up with your friends and compete for the top guild position!
● New Skins: Cool new skins are waiting for you to unlock.
● Bug Fixes: We've fixed some known bugs.

Come and experience the new version now!
```
FR officiel :
```
Hé! Bon retour sur Bid Master!

Quoi de neuf:

● Chasse au trésor: Collectez des objets rares et gagnez des récompenses luxueuses!
● Compétition de guilde: Faites équipe avec vos amis pour la première place!
● Nouveaux skins: De nouveaux skins cool vous attendent à débloquer.
● Corrections de bugs: Nous avons corrigé des bugs connus.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Chasse au trésor (寻宝活动) | Événement de collection d'objets rares, qui préfigure les « Treasure Hunt Puzzle » narratifs de 2025-2026 | Événement |
| **Compétition de guilde** | Classement inter-guildes : c'est le début des « Guild Wars » mises en avant sur la fiche Play | **Système ajouté** (compétitif) |
| Nouveaux skins | Cosmétiques à débloquer, **monétisation cosmétique** | Monétisation |
| Bugs | — | Correctif |

---

#### v0.5.6 — 16 oct. 2024 (iOS) ; Android vers le 27 sept. 2024 selon APKPure [I]
EN :
```
Hey, dear players! Thank you for your support and love!
This update content:
● Return event: Limited time event is now open! Log in for 3 consecutive days and receive a large number of rewards every day! Come and participate and get rich rewards!
● Secret realm adventure: Explore mysterious dungeons, defeat powerful monsters, open mysterious treasure chests, and find legendary treasures!
Come and update and experience a more exciting game world immediately!
```
FR officiel :
```
Hé, chers joueurs ! Merci pour votre soutien et votre amour !
Contenu de cette mise à jour :
● Événement de retour : l'événement à durée limitée est maintenant ouvert ! Connectez-vous 3 jours de suite et recevez de nombreuses récompenses chaque jour ! […]
● Aventure secrète : explorez des donjons mystérieux, battez des monstres puissants, ouvrez des coffres au trésor mystérieux et trouvez des trésors légendaires !
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Événement de retour** (connexion 3 jours) | Campagne de **réactivation** des joueurs inactifs, typique après une baisse de rétention ou avant une campagne d'acquisition | Rétention / événement |
| **Aventure secrète** (秘境探险) | **Mode à part entière** : donjons, monstres, coffres. Il rompt avec le thème réaliste des enchères pour offrir une activité supplémentaire entre deux minuteurs. Il revient par « numéros » (le 2ᵉ en 0.6.3) | **Système ajouté** (mode) |

---

#### v0.5.7 — 31 oct. 2024 (iOS) [C]
EN :
```
This update includes:
● Halloween Event: Light up the pumpkin lanterns to receive exclusive Halloween avatar frames!
● Halloween Castle Treasure: Join the Halloween-exclusive auction and bid on these strange items!
● Monopoly: Join the legendary Monopoly battle to win tons of prizes! Achieve your billionaire dreams!
● Fixed some issues for better stability.
Update now and explore a more exciting game world!
```
FR officiel :
```
Cette mise à jour comprend :
● Événement d'Halloween : Allumez les lanternes en citrouille pour recevoir des cadres d'avatar exclusifs à Halloween !
● Trésor du Château d'Halloween : Participez à l'enchère exclusive d'Halloween et enchérissez sur ces objets étranges !
● Monopoly : Rejoignez la bataille légendaire de Monopoly pour gagner des prix !
● Des problèmes ont été corrigés.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Lanternes-citrouilles et cadres d'avatar | Événement à collecte, avec une récompense cosmétique **sociale** (cadre visible par la guilde) | Événement |
| Trésor du château d'Halloween | **Enchère thématique limitée**. Le modèle « enchère spéciale d'événement » sera réutilisé ensuite : Noël, blind box, mer, valises, Treasure Inn | Événement / contenu |
| **Monopoly** (大富翁, « City of Monopoly ») | **Mini-jeu de plateau à dés**, avec une boutique à points (un objet à 29 999 points d'après un avis [C]). Il tourne autour des dés, une mécanique de **monétisation éprouvée** (type Monopoly GO) | **Système ajouté** (mini-jeu) / monétisation |
| Stabilité | — | Correctif |

---

#### v0.6.1 — 16 déc. 2024 (iOS) [C]
EN :
```
Update Contents:
1. Global Auction: Compete in bidding for world treasures.
2. Christmas Event: Limited-time Christmas rewards and special Christmas market warehouse.
3. Gold Bar Appraisal & Repair: Success rate increased by 100%.
4. Cool Heavy Truck Lottery event.
5. Garage Feature: Showcase cars and earn profits.
```
FR officiel :
```
Contenu de la mise à jour:
1. Enchères mondiales : Participez aux enchères pour les trésors du monde.
2. Événement de Noël : Récompenses de Noël limitées et entrepôt spécial du marché de Noël.
3. Évaluation & réparation des lingots d'or : Taux de succès augmenté de 100 %.
4. Tirage au sort de camions lourds.
5. Activation de la fonction de garage : Affichez vos voitures et générez des profits.
```
TW (référence) : « 3、金條鑑定&維修：成功的機率提升100% ».

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Enchères mondiales** (全球玩家在线拍卖会) | **Enchères en temps réel entre joueurs** du monde entier. Jusque-là, on enchérissait surtout contre des IA. C'est la promesse « compete with other players » de 2023 enfin tenue pleinement | **Système ajouté** (multijoueur) |
| Noël, entrepôt du marché de Noël | Événement saisonnier avec un entrepôt d'enchères dédié | Événement |
| **Expertise et réparation payées en lingots : « taux de succès +100 % »** | **Équilibrage de monétisation**. L'option payante (or) devient (quasi) certaine, alors que les options cash et pub restent aléatoires. Un avis d'avril 2025 parle d'« un taux de réussite à 100 % sur l'expertise » [C], ce qui confirme que l'or garantit le succès. La ligne **disparaît des notes de la 0.6.2**, ce qui suggère une formulation retirée ou un changement corrigé [I] | **Équilibrage** / monétisation |
| Loterie de camions lourds | **Gacha de véhicules** : monétisation par loterie | Monétisation / événement |
| **Garage** | Exposer ses voitures pour un revenu passif. Il donne un débouché aux voitures de l'usine (0.3.1) et ajoute une source idle | **Bâtiment ajouté** |

---

#### v0.6.2 — 31 déc. 2024 (iOS) [C]
EN :
```
1. Global players online auction: Join the bidding for world treasures.
2. Christmas event: Limited-time Christmas rewards and special Christmas market warehouse.
3. Cool heavy truck lottery event.
4. Garage function unlocked: Show off your cars and earn profits.
```
FR officiel :
```
1. Enchères en ligne pour joueurs du monde entier : enchérissez pour des trésors mondiaux.
2. Événement de Noël : Récompenses limitées et entrepôt spécial du marché de Noël.
3. Événement de loterie pour camions lourds impressionnants.
4. Fonction garage activée : Exposez vos voitures et gagnez des profits.
```
| Analyse | Type |
|---|---|
| Ce sont les notes de la 0.6.1 **moins la ligne sur l'expertise en or**. C'est un **correctif** publié 15 jours après : les avis du 17 au 21 déc. 2024 en v0.6.1 signalent un « **black screen** » après la mise à jour et des comptes perdus [C]. | Correctif |

---

#### v0.6.3 — 17 févr. 2025 (iOS) [C]
EN (US) :
```
1. New Year Event: Added "BLACK 21" and "Lucky Dice" gameplay, limited time return, Inventor's House.
2. Added the second issue of the secret adventure theme, Mayan document map
3. Added guild sign-in and system announcement
4. Started the new season S4, the museum expanded the third floor
```
EN (variante GB) :
```
1. New Year Event: Added "BLACK 21" and "Lucky Dice" game modes, limited-time return, Inventor's House. 
2. New 2nd Phase - Secret Adventure, Maya Document Map. 
3. New Guild Sign-In and System Announcements. 
4. S4 New Season Starts, Museum Expands to 3rd Floor!
```
FR officiel :
```
1. Événement du Nouvel An : ajout du nouveau gameplay « BLACK 21 » et « Lucky Dice », retour à durée limitée, Maison de l'inventeur.
2. Ajout du deuxième numéro du thème Secret Realm Adventure, Maya Document Map
3. Ajout de la connexion à la guilde et de l'annonce du système
4. La nouvelle saison 4 commence et le musée s'agrandit jusqu'au troisième étage
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Nouvel An : **BLACK 21** (blackjack) et **Lucky Dice** | **Jeux de casino** dans l'événement (le casino existe aussi en permanence, cf. BIDMASTER.md). Ce sont des puits à monnaie, avec des mécaniques de hasard | Événement / mini-jeux / monétisation |
| « Retour à durée limitée » (限时回归) | Réactivation des joueurs inactifs, comme en 0.5.6 | Rétention |
| **Maison de l'inventeur** (发明家之家) | Lieu ou bâtiment d'événement (fonction non documentée) | Bâtiment (événement) |
| **Aventure secrète n° 2 : carte des documents mayas** | Deuxième épisode du mode donjon de la 0.5.6 : le contenu devient **épisodique** | Contenu (mode) |
| **Connexion de guilde** et annonces système | Récompense quotidienne pour **se connecter en guilde**, plus un canal d'annonces officielles dans le jeu. Cela compense l'absence de réseaux sociaux officiels | Rétention / social / communication |
| **Saison S4, 3ᵉ étage du musée** | Confirme le rythme saisonnier (S1 en févr. 2024, S4 en févr. 2025, soit environ 4 mois par saison) et l'**extension verticale du musée** : chaque saison ajoute de la capacité d'exposition et donc des puits à objets [I] | **Saison** / **bâtiment étendu** |

---

#### v0.6.5 — 9 avr. 2025 (iOS) ; Android vers le 13 mars 2025 (APKPure) [I]
EN :
```
Dear Auction Masters, the new version is now live! 
1. Skin Lottery Event: Obtain exclusive robot skins and helicopter mounts with special entry effects. 
2. More auction items added! 
3. Bug fixes and optimizations to enhance your gaming experience.
```
FR officiel :
```
Chers Maîtres des enchères, la nouvelle version est maintenant disponible ! 
1. Événement de loterie de skins : Obtenez des skins exclusifs de robot et des montures d'hélicoptère avec des effets spéciaux d'entrée. 
2. Plus d'articles aux enchères ajoutés ! 
3. Correction de bugs et optimisations pour améliorer votre expérience de jeu.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Loterie de skins** : robots, montures hélicoptère, effets d'entrée | **Gacha cosmétique** avec une visibilité sociale (l'effet d'entrée se voit dans les enchères mondiales). Les **montures** apparaissent ici | Monétisation |
| Plus d'objets | Contenu | Contenu |
| Bugs | — | Correctif |

---

#### v0.6.7 — 4 juin 2025 (iOS) [C]
EN :
```
New version is now online! 
1. New mining gameplay: dig for rare minerals to exchange for limited skins! 
2. Bounty missions open: complete time-limited challenges to win mysterious rewards! 
3. German mainline levels: added more auction items! 
4. Fixed known bugs.
```
FR officiel :
```
Nouvelle version en ligne! 
1. Nouveau gameplay de minage: creusez des minéraux rares pour échanger contre des skins limités! 
2. Missions de prime ouvertes: relevez des défis limités dans le temps pour gagner des récompenses mystérieuses! 
3. Niveaux principaux allemands: ajout de plus d'objets aux enchères! 
4. Bugs connus corrigés.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Mine** (挖矿) : minerais rares échangés contre des skins limités | Nouveau mode (« Mystic Adventure », mine de diamant par paliers [C, cf. BIDMASTER.md]). C'est une **chasse aux cosmétiques gratuite**, mais elle est boguée : plusieurs avis de juin-juil. 2025 signalent que la mine plante et fait perdre la progression, et un joueur reste bloqué « des mois » au premier palier [C] | **Système ajouté** (mode) |
| **Missions de prime** (悬赏任务) | Défis à durée limitée, soit une boucle quotidienne ou hebdomadaire supplémentaire | Rétention |
| **Niveaux principaux en Allemagne** | Nouveau chapitre géographique de la carte principale (après les villes américaines). Le scénario est structuré **par pays** | Contenu (progression) |
| Bugs | — | Correctif |

---

#### v0.7.0 — 8 août 2025 (iOS) ; Android le 2 août 2025 (Uptodown) [C/I]
EN (US) :
```
· New Metropolitan map
· Build your dream home
· Deep-sea treasure event
· Blind box auction with mystery rewards
· New auctioneer costumes
· Bug fixes!
```
EN (variante GB) : identique, précédée de « Update is here! ».
FR officiel :
```
Mise à jour!
· Nouvelle carte métropolitaine
· Système de maison activé
· Trésors sous-marins
· Enchères de boîtes surprises
· Nouvelles tenues d'enchérisseur
· Bugs corrigés!
```
TW : « 城市新地圖登場 · 家園系統正式開放 · 深海寶藏活動展開 · 神秘盲盒拍賣中 · 新拍賣師服裝上架 · 修正多項錯誤！ »

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Nouvelle carte : la Métropole** | **Deuxième grande carte** : c'est l'extension majeure de fin de partie. On y achète des propriétés commerciales à revenu horaire. Elle répond aux joueurs « bloqués en attendant des mises à jour » (avis de juil.-août 2025 [C]) | **Système ajouté** (zone) |
| **Maison de rêve** (« système de maison », 家园系统) | Logement personnel à construire. C'est un puits à cash et à prestige, ancêtre de la villa (0.8.0) et du manoir (0.9.0) | **Système ajouté** |
| **Trésors des grands fonds** | Événement thématique sous-marin | Événement |
| **Enchères blind box** | Enchère « à l'aveugle » dont le contenu est caché : de l'**aléatoire pur** qui reprend la mode des blind boxes chinoises | Événement / monétisation |
| Nouvelles tenues de commissaire-priseur | Cosmétiques | Monétisation |
| Bugs | — | Correctif |

> Contexte : un avis du 24 août 2025 (v0.7.0) indique que « **Season 7 was late on release** » et que, dans les nouveaux appartements, le bouton « collect rent » manque [C]. Un écart de 65 jours sépare la 0.6.7 de la 0.7.0 : c'est le plus long depuis le lancement, et les avis « No update for 2 months » (5 août 2025) le confirment [C].

---

#### v0.7.7 — 30 oct. 2025 (iOS) ; Android 0.7.5 et 0.7.6 du 27 au 29 oct. 2025 [I]
EN :
```
New update is live!
1、Added Metropolis Battle Zone to fight for city territories.
2、Halloween Pumpkin Event is open with festive rewards.
3、Halloween Limited Auction offers exclusive time-limited items.
4、Thanksgiving Login Event gives special daily gifts.
```
FR officiel :
```
Nouvelle mise à jour en ligne !
1、Zone de bataille de la métropole ajoutée pour se battre pour les territoires.
2、Événement Citrouille d'Halloween ouvert avec récompenses festives.
3、Enchère limitée Halloween propose objets exclusifs à durée limitée.
4、Événement de connexion Thanksgiving offre cadeaux quotidiens spéciaux.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Zone de bataille de la Métropole** (大都会战斗区) : guerre de territoires | **PvP de fin de partie**. Les joueurs ou les guildes se disputent des quartiers de la Métropole. C'est le premier contenu compétitif sur la carte idle, que les vétérans réclamaient. Le « **Chaotic district** » cité par un joueur en févr. 2026 en fait probablement partie [I] | **Système ajouté** (PvP / guilde) |
| Citrouilles d'Halloween | Reprise de l'événement de 2024 | Événement (récurrent) |
| Enchère limitée d'Halloween | Reprise | Événement (récurrent) |
| Connexion Thanksgiving | Calendrier de connexion | Rétention |

> Réaction des joueurs : un avis du 1ᵉʳ nov. 2025 (v0.7.7, 1★) dit « This latest update is terrible […] **Free market needs to go back** to the way it was before » [C]. Le **marché libre** (échange entre joueurs ?) a donc été modifié sans que les notes le mentionnent : c'est un **changement d'équilibrage non annoncé** [I].

---

#### v0.7.8 — 25 nov. 2025 (iOS) [C]
EN : `Fixed some known issues and improved game stability.`
FR officiel : `Correction de certains problèmes connus et amélioration de la stabilité du jeu.`

| Analyse | Type |
|---|---|
| C'est le seul correctif « pur » de tout l'historique. Il arrive 26 jours après la 0.7.7 et suit probablement les retours sur la zone de bataille et le marché libre [I]. Le contenu exact n'est pas documenté. | Correctif |

---

#### v0.8.0 — 17 déc. 2025 et v0.8.1 — 29 janv. 2026 (iOS) — même texte [C]
EN :
```
· Added the Christmas Challenge event
· Started the Christmas Wish event
· Launched the Pet System
· Added a new story-puzzle mode
· Opened a new villa area
```
FR officiel :
```
· Ajout de l'événement Défi de Noël
· Lancement des Vœux de Noël
· Activation du système d'animaux
· Nouveau mode enquête-histoire ajouté
· Nouvelle zone de la villa ouverte
```
TW : « 新增聖誕挑戰活動 · 開啟聖誕許願活動 · 上線寵物系統 · 新增劇情解密玩法 · 開放別墅新區域 »

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| Défi de Noël | Événement à objectifs | Événement |
| Vœux de Noël | Événement de type « liste de souhaits » ou tirage [I] | Événement / monétisation |
| **Système d'animaux** (宠物系统) | **Familiers** à collectionner et faire grandir, avec un bonus passif [I]. Il sera étendu en Cour des familiers en 0.9.0 | **Système ajouté** |
| **Mode enquête-histoire** (剧情解密玩法) | **Événements narratifs à embranchements**. D'après les dates des vidéos YouTube (environ 8 mois avant nov. 2026, donc vers févr.-mars 2026), il s'agit de **« Lost Treasure / The Lost City »** : objet clé Star Compass, plusieurs fins (Night Pearl, Dragoncrest Obsidian Obelisk) [I]. C'est la « phase 1 » de la chasse au trésor-énigme | **Système ajouté** (narratif) |
| Nouvelle zone de la villa | Extension de la maison de rêve (0.7.0) | Contenu |
| (0.8.1) | Correctif publié 43 jours plus tard avec les mêmes notes | Correctif |

> Réaction des joueurs : en mars-avril 2026, les avis iOS se plaignent d'être encore **« en avril avec le thème de Noël »**, alors que « Android users received the update 3 weeks ago » (2 avr. 2026) [C]. Un joueur allemand écrit « immer auf Update warten » (« toujours attendre la mise à jour ») [C]. **Le décalage iOS / Android** devient un sujet de mécontentement.

---

#### v0.8.5 — 2 avr. 2026 (iOS) ; Android 0.8.4 et 0.8.5 les 25-27 mars 2026 (Uptodown) [I]
EN :
```
What's New:

·Added a new Transport Center in the Metropolis – manage your own station

·New Mysterious Sea Auction – discover and collect various ships

·Main storyline expanded with new UK-themed auction levels
```
FR officiel :
```
Nouveautés :

·Nouveau Centre de Transport dans la Métropole – gérez votre propre gare

·Nouvelle Enchère Maritime Mystérieuse – découvrez et collectionnez divers navires

·Scénario principal étendu avec de nouveaux niveaux d'enchères sur le thème du Royaume-Uni
```
*(C'est aussi le texte « Quoi de neuf » toujours affiché sur Google Play en nov. 2026, alors que la fiche est en 0.9.0.)*

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Centre de transport de la Métropole** (gérer sa gare) | Nouveau bâtiment à revenu de la Métropole, avec une logique de **missions** (le Dépôt de bus rapporte des **diamants** [C]). Les joueurs y investissent massivement… avant le nerf de la 0.8.7 | **Bâtiment ajouté** |
| **Enchère maritime mystérieuse** (navires) | Nouvelle catégorie d'objets de collection. Les « ships » sont déjà cités dans la description Play | Contenu / événement |
| **Niveaux Royaume-Uni** | Nouveau chapitre géographique, après l'Allemagne (0.6.7) | Contenu (progression) |

> Apple a ensuite republié cette version sans changement (juin 2026, compatibilité watchOS 27) [C].

---

#### v0.8.7 — 30 juin 2026 et v0.8.8 — 9 juil. 2026 (iOS) — même texte [C]
EN :
```
1. Added the "Treasure Inn: Car Auction" event. Join auctions and discover more collectibles.
2. Added the Suitcase Auction event. Explore mysterious items inside abandoned suitcases.
3. The Guild interface has been fully updated, with new Guild Base and Guild Property features.
```
FR officiel :
```
1. Nouvel événement "Auberge au trésor : enchères auto". Participez aux enchères et découvrez plus d'objets de collection.
2. Nouvel événement Enchères de valises. Explorez les objets mystérieux contenus dans des valises abandonnées.
3. L'interface de guilde a été entièrement mise à jour, avec la base et les propriétés de guilde.
```
| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| « Treasure Inn : enchère de voitures » (寻宝旅社：汽车拍卖) | Enchère d'événement centrée sur les voitures, qui alimente l'usine et le garage | Événement |
| **Enchère de valises** abandonnées | Nouvelle variante d'enchère (contenant plus petit) | Événement / contenu |
| **Refonte de l'interface de guilde, base et propriétés de guilde** (公会基地与公会房产) | **Méta collective** : la guilde possède des bâtiments communs, sur le même modèle que la Métropole. Cela prépare la « **Guild conquest** » vue par un joueur en oct. 2026 [C] | **Système ajouté** (guilde) |
| *(non annoncé)* **Nerf du Centre de transport et de la gare** | Avis du 3 au 5 juil. 2026 en v0.8.7 : « the new update **nerfed earning by 60%** » sur le transport, « La dernière mise à jour a **divisé le bénéfice de la gare par 10** ! », « they updated **operating times** and put it onto the bus stop », « took away profit […] made things more expensive » [C]. C'est un **rééquilibrage économique majeur et non annoncé**, qui crée la perception d'un « bait-and-switch » chez les joueurs ayant investi | **Équilibrage (nerf) non documenté** |
| *(non annoncé)* Algorithme des managers | « L'algorithme des choix de manager est à revoir » (avis FR, 5 juil. 2026) [C] : le choix des managers a changé à cette période [I] | Équilibrage non documenté |
| (0.8.8) | Correctif 9 jours plus tard, mêmes notes. Les avis de juin-juil. 2026 signalent « **can't connect to the server** » en guilde et des comptes inaccessibles après la mise à jour [C] | Correctif |

---

#### v0.9.0 — 23 sept. 2026 et v0.9.1 — 26 oct. 2026 (iOS) — même texte ; Android 0.9.0 du 2 au 12 sept. 2026 [C/I]
EN :
```
1. Added the Collector Manor system. Build and manage your own manor.
2. Added the Pet Courtyard system with pet interaction and growth features.
3. Treasure Hunt Puzzle Phase 2 is now open. Explore clues and take on new puzzle challenges.
```
FR officiel :
```
1. Ajout du système Manoir du collectionneur. Construisez et gérez votre propre manoir.
2. Ajout du système Cour des familiers, avec interactions et progression.
3. La phase 2 de la Chasse au trésor est ouverte. Explorez les indices et relevez de nouveaux défis d'énigmes.
```
TW : « 新增收藏家莊園系統 · 新增寵物庭院系統，解鎖寵物互動與養成玩法 · 開啟第 2 期尋寶解謎玩法 »

| Ligne | Ce que ça change / pourquoi | Type |
|---|---|---|
| **Manoir du collectionneur** (收藏家庄园) | Troisième étape du « logement » (maison de rêve en 0.7.0, villa en 0.8.0, manoir maintenant). C'est un puits de fin de partie qui donne un **usage à la collection** (le joueur expose et gère ses objets) | **Système ajouté** |
| **Cour des familiers** : interaction et croissance | Approfondissement du système d'animaux de la 0.8.0, avec une **boucle d'élevage** (养成) typique des jeux chinois | **Système ajouté** |
| **Énigme de chasse au trésor, phase 2** | Deuxième épisode narratif, probablement **« Visitor in the Fog »** (indices, fins Cash, Or et SSS) : les vidéos YouTube de BING ZLEE ont environ 1 mois, soit oct. 2026 [I] | Contenu (narratif) |
| (0.9.1) | Correctif 33 jours plus tard. Google Play reste en 0.9.0 (mis à jour le 3 sept. 2026) | Correctif |

> Événement Google Play en cours (« Events & offers ») : **« Old car auction: hidden value under the rust »**, qui se termine le 14 novembre 2026 [C]. Il n'apparaît dans aucune note de version : les événements tournent **côté serveur**, sans mise à jour.

---

## 3. Chronologie des systèmes

| Système / bâtiment / fonction | Première apparition | Version | Statut |
|---|---|---|---|
| Enchères d'entrepôts, valeur cachée, statut de commissaire-priseur | Lancement, 21 août 2023 | 0.1.x | [C] |
| Prêteur sur gages, expertise (College), réparation, entrepôt | Avant déc. 2024 ; très probablement au lancement | jamais annoncé | [I] |
| Musée (étages 1 et 2) | Avant févr. 2025 ; probablement 2023-2024 | jamais annoncé | [I] |
| Événements saisonniers (Noël, lingots) et habillage de carte | 8 déc. 2023 | 0.2.2 | [C] |
| **Usine automobile** (Car Processing Factory) | 30 déc. 2023 | 0.3.1 | [C] |
| **Secrétaire** | 30 déc. 2023 (améliorée en mars 2024) | 0.3.1 / 0.3.9 | [C] |
| **Système de titres** | 25 janv. 2024 | 0.3.5 | [C] |
| **Agence de voyage chasse au trésor, saison S1** | 5 févr. 2024 | 0.3.6 | [C] |
| 2 cartes supplémentaires de l'agence | 8 févr. 2024 | 0.3.7 | [C] |
| **Connexion 7 jours** | 16 mars 2024 | 0.3.9 | [C] |
| Profil (informations personnelles), héros chibi | 22 avr. 2024 | 0.4.2 | [C] |
| Pêche, aquarium, restaurant (cuisine), hôtel 5★, station-service, location de bâtiments | Avant août 2024 (cités dans la description Play) | jamais annoncé | [I] |
| Événement Resource Aid | 24 juin 2024 | 0.4.8 | [C] |
| **Guildes, amis, classements, chat** ; premier événement de guilde | 8 août 2024 | 0.5.2 | [C] |
| **Niveaux BOSS** | 8 août 2024 | 0.5.2 | [C] |
| Compétition de guilde, skins | 9 sept. 2024 | 0.5.4 | [C] |
| Événement de retour (3 jours) | 16 oct. 2024 | 0.5.6 | [C] |
| **Aventure secrète / donjons** | 16 oct. 2024 (n° 2 maya en févr. 2025) | 0.5.6 / 0.6.3 | [C] |
| **City of Monopoly** | 31 oct. 2024 | 0.5.7 | [C] |
| Halloween (lanternes, cadres d'avatar, enchère du château) | 31 oct. 2024 (reprise en oct. 2025) | 0.5.7 / 0.7.7 | [C] |
| **Enchères mondiales** (joueurs réels) | 16 déc. 2024 | 0.6.1 | [C] |
| **Garage** | 16 déc. 2024 | 0.6.1 | [C] |
| Expertise et réparation en or à « +100 % » | 16 déc. 2024 | 0.6.1 | [C] |
| Loterie de camions lourds | 16 déc. 2024 | 0.6.1 | [C] |
| Casino d'événement (BLACK 21, Lucky Dice), Maison de l'inventeur | 17 févr. 2025 | 0.6.3 | [C] |
| Connexion de guilde, annonces système | 17 févr. 2025 | 0.6.3 | [C] |
| **Saison S4, 3ᵉ étage du musée** | 17 févr. 2025 | 0.6.3 | [C] |
| Saisons S2 et S3 | Entre févr. 2024 et févr. 2025 (non annoncées) | ? | [I] |
| Loterie de skins (robots), **montures** (hélicoptère) | 9 avr. 2025 | 0.6.5 | [C] |
| Saisons S5 et S6 | Printemps-été 2025 (non annoncées) | ? | [I] |
| **Mine** (minerais contre skins) | 4 juin 2025 | 0.6.7 | [C] |
| Missions de prime | 4 juin 2025 | 0.6.7 | [C] |
| Niveaux principaux **Allemagne** | 4 juin 2025 | 0.6.7 | [C] |
| **Saison S7** | Vers août 2025, « en retard » | ≈ 0.7.0 | [C] avis / [I] version |
| **Métropole** (2ᵉ carte) | 8 août 2025 | 0.7.0 | [C] |
| **Maison de rêve** | 8 août 2025 | 0.7.0 | [C] |
| Trésors des grands fonds, enchère blind box, tenues | 8 août 2025 | 0.7.0 | [C] |
| Appartements « nouveaux » (bug du loyer) | Vers août 2025 | ≈ 0.7.0 | [C] avis |
| **Zone de bataille de la Métropole** (guerre de territoires) | 30 oct. 2025 | 0.7.7 | [C] |
| Thanksgiving (connexion) | 30 oct. 2025 | 0.7.7 | [C] |
| Marché libre modifié | Vers oct. 2025 | 0.7.7 | [C] avis / non annoncé |
| **Système d'animaux** | 17 déc. 2025 | 0.8.0 | [C] |
| **Mode enquête-histoire**, phase 1 (Lost City / Lost Treasure) | 17 déc. 2025 | 0.8.0 | [C] mode / [I] titre |
| **Villa** (nouvelle zone) | 17 déc. 2025 | 0.8.0 | [C] |
| Défi et Vœux de Noël | 17 déc. 2025 | 0.8.0 | [C] |
| Quartier chaotique | Cité en févr. 2026 | ? (≈ 0.7.7 / 0.8.x) | [I] |
| **Centre de transport** (gare / dépôt de bus de la Métropole) | 2 avr. 2026 (Android fin mars) | 0.8.5 | [C] |
| Enchère maritime (navires) | 2 avr. 2026 | 0.8.5 | [C] |
| Niveaux principaux **Royaume-Uni** | 2 avr. 2026 | 0.8.5 | [C] |
| Treasure Inn (voitures), enchère de valises | 30 juin 2026 | 0.8.7 | [C] |
| **Base et propriétés de guilde** | 30 juin 2026 | 0.8.7 | [C] |
| Nerf de la gare / du transport (−60 % à −90 %), managers revus | Juin-juil. 2026 | 0.8.7 | [C] avis / non annoncé |
| Guild conquest | Cité en oct. 2026 | ≈ 0.8.7 / 0.9.0 | [I] |
| **Manoir du collectionneur** | 23 sept. 2026 (Android début sept.) | 0.9.0 | [C] |
| **Cour des familiers** | 23 sept. 2026 | 0.9.0 | [C] |
| Énigme de chasse au trésor, phase 2 (Visitor in the Fog) | 23 sept. 2026 | 0.9.0 | [C] mode / [I] titre |
| **Managers** | Avant 2025 (avis) ; algorithme changé en 2026 | jamais annoncé | [I] |
| **VIP** (environ 19,99 $ / 30 jours, et 7 jours) | Au plus tard déc. 2024 (avis v0.6.2) | jamais annoncé | [C] avis |
| **Tirelire** (piggybank à 2,99 $, piggybank_2 à 4,99 $) | Au plus tard janv. 2025 (avis v0.6.2) | jamais annoncé | [C] |
| Casino permanent, bourse, banque, bibliothèque, serrurier, dépôt de bus (diamants) | Inconnu | jamais annoncé | [I] |

Achats intégrés listés sur l'App Store US [C] : piggybank 2,99 $ ; Combo Pack 1 à 3,99 $ ; first_paygift 2,99 $ ; Combo Pack 2 à 9,99 $ ; turntable lottery 0,99 $ ; piggybank_2 4,99 $ ; Gold Bullion Pack1 2,99 $ ; Limited-Time Pay Gift Pack2 5,99 $ ; Gold Bullion Pack2 5,99 $ ; Combo Pack 3 à 19,99 $. Fourchette Google Play : 0,99 $ à 119,99 $ par article.

---

## 4. Ce que les mises à jour révèlent de la stratégie

### 4.1 Cadence
- **Phase 1, lancement et soft-launch (août à nov. 2023)** : peu de traces. Sur iOS, il s'écoule 109 jours entre la sortie et la 0.2.2. Le jeu se cherche [I].
- **Phase 2, croissance rapide (déc. 2023 à avr. 2024)** : **9 versions en 4,5 mois** (une tous les 3 à 22 jours). Chaque version ajoute un système de rétention : secrétaire, usine, titres, saisons, connexion 7 jours, profil. Le jeu **passe d'un jeu d'enchères à un tycoon**.
- **Phase 3, mondialisation et social (juin à déc. 2024)** : une version toutes les 4 à 6 semaines, avec la refonte graphique, les guildes, la sortie mondiale de la fiche Play en août 2024, Monopoly et les enchères mondiales. C'est le pic de densité de contenu. 14 versions iOS en 2024.
- **Phase 4, ralentissement (2025)** : **7 versions seulement**, espacées de 48 à 83 jours. Les ajouts sont plus lourds (mine, Métropole, zone de bataille). Les joueurs se plaignent ouvertement : « No update for 2 months » (août 2025), « Season 7 was late », « la pause entre saisons dure plus longtemps que la saison » (oct. 2025) [C].
- **Phase 5, fin de partie et méta collective (2026)** : 6 versions, dont 3 correctifs. Il y a **63 à 89 jours** entre deux versions de contenu. Android reçoit les versions 1 à 3 semaines avant iOS (0.8.4/0.8.5 en mars contre le 2 avril ; 0.9.0 début sept. contre le 23 sept.), ce qui provoque une colère explicite des joueurs iOS [C].
- **Schéma récurrent** : une version de contenu, puis un correctif avec **les mêmes notes** 3 à 43 jours plus tard (6 fois).
- **Calendrier fixe** : Noël (2023, 2024, 2025), Nouvel An lunaire (2024, 2025), Halloween (2024, 2025), Thanksgiving (2025). Les événements tournent aussi côté serveur, sans mise à jour (par exemple l'événement Play « Old car auction », nov. 2026).

### 4.2 Rétention
Les leviers arrivent dans un ordre très classique :
1. connexion (7 jours en 0.3.9, retour 3 jours en 0.5.6 et 0.6.3, Thanksgiving) ;
2. statut (titres, profil, skins, montures) ;
3. rendez-vous (saisons de l'agence de voyage, environ 4 mois puis environ 2 mois [I]) ;
4. social (guildes en 0.5.2, compétition, connexion de guilde, base de guilde) ;
5. fin de partie (Métropole, puis territoires, transport, manoir).

Les « modes à côté » (donjons, Monopoly, mine, énigmes narratives, animaux) occupent le joueur **pendant les minuteurs** de la boucle principale. Les **chapitres géographiques** (Allemagne en 0.6.7, Royaume-Uni en 0.8.5) étirent la progression principale.

### 4.3 Monétisation
- **Hasard payant** : la loterie de camions (0.6.1), la loterie de skins (0.6.5), les enchères blind box (0.7.0), les dés Monopoly (0.5.7), BLACK 21 et Lucky Dice (0.6.3), ainsi qu'une « turntable lottery » à 0,99 $ en achat intégré.
- **Or contre réussite** : en 0.6.1, la réussite payée en or est fortement augmentée (« +100 % »), alors que les options cash et pub restent aléatoires et peuvent **casser l'objet**. C'est le premier motif de plainte (« college fails more times than not », « break and demand gold »…) [C].
- **Cosmétiques** : skins, tenues, cadres, montures.
- **Abonnement VIP** : il promet « no ads » mais n'offre qu'environ 30 « clics pub » gratuits. C'est la première source d'avis 1★ pour tromperie (déc. 2024 à juil. 2026) [C]. Aucune note de version ne l'aborde.
- **Paquets** : tirelire, Combo Packs, packs de lingots. Un « 7-day rewards pack » est jugé trompeur (févr. 2025) [C].
- **Nerfs de rentabilité après investissement** : marché libre (0.7.7) et gare / transport (0.8.7). Ce sont des changements d'équilibrage **non annoncés** dans les notes, qui servent à resserrer l'économie et à pousser l'achat d'or [I]. Les notes ne mentionnent **jamais** un équilibrage défavorable : seuls les buffs sont annoncés (0.6.1).

### 4.4 Ce que les joueurs réclamaient et ce qui a été fait

Sources : 630 avis App Store, de mars 2024 à oct. 2026, dans 8 pays. La note moyenne par version reste basse dans le flux RSS, qui est biaisé vers les avis récents et négatifs : 3,4 en v0.5.7, 2,4 en v0.7.0, 2,0 en v0.8.5, 2,7 en v0.9.0.

| Demande ou plainte des joueurs [C] | Période | Réponse visible dans les mises à jour |
|---|---|---|
| Écran noir et comptes perdus après la mise à jour | déc. 2024 (v0.6.1) | Correctif 0.6.2 au bout de 15 jours (même contenu) [C/I] |
| Monopoly grisé, injouable ; support injoignable | mars 2025 (v0.6.3) | Rien dans les notes ; 0.6.5 « bug fixes » [I] |
| Expertise à « 97 % ou 100 % » qui échoue ou fait baisser la valeur | avr. 2025 | Rien d'annoncé |
| Plantage de la mine et perte de progression | juin-juil. 2025 (v0.6.7) | « Bug fixes! » en 0.7.0 ; aucun correctif explicite |
| « Need updates more regularly », « no update for 2 months » | juil.-août 2025 | **0.7.0 Métropole** (août 2025), mais la cadence ralentit ensuite |
| Automatiser la pêche ; managers pour toutes les entreprises (usine, vente de voitures, déchets) | 2025 | Aucune note ne répond. L'algorithme des managers change en 2026, mal reçu |
| Plus d'emplacements de vente et d'expertise (« Add more sell spots! », « one slot ») | 2025-2026 | Rien d'annoncé |
| Contenu compétitif de fin de partie (« lacks end game content ») | 2025-2026 | **Zone de bataille** (0.7.7), **base et propriétés de guilde** (0.8.7), Guild conquest, **manoir** (0.9.0) : la réponse principale du studio |
| Multijoueur avec des amis / cross-play iOS-Android | août 2025, juil. 2026 | Les guildes existent ; **pas de cross-play** annoncé |
| Retour de l'ancien marché libre | nov. 2025 (v0.7.7) | Correctif 0.7.8, sans détail |
| Retard d'iOS par rapport à Android (thème de Noël encore en avril) | mars-juin 2026 | 0.8.5 iOS le 2 avr. 2026 ; le décalage persiste en 0.9.0 |
| Problèmes de connexion à la guilde et au serveur, comptes inaccessibles | juin-sept. 2026 (v0.8.7/0.8.8) | Correctif 0.8.8 au bout de 9 jours ; la plainte persiste en sept. 2026 |
| Nerf de la gare (×0,1, −60 %) après investissement | juil. 2026 | Aucun retour arrière visible |
| VIP sans suppression des pubs | déc. 2024 à juil. 2026 | Jamais corrigé ni clarifié |
| Bouton de signalement de bug cassé (« network issue ») | déc. 2024 à juin 2026 | Jamais mentionné |
| Coquille « Next Gril » dans « rescue the beauty » | avr. 2026 | Inconnu |

**Conclusion stratégique [I]** : le studio (Hydodo / EYEWIND, chinois) suit une feuille de route **orientée contenu et monétisation** : un nouveau système tous les 1 à 3 mois et un événement de saison à chaque fête. Ses notes ne mentionnent **jamais** les problèmes d'équilibrage ou de support que les joueurs remontent. Il traite surtout les plaintes de fin de partie, en ajoutant des couches (Métropole, puis territoires, guilde, manoir), et non les frictions du cœur de jeu (taux d'échec, emplacements, pubs du VIP). Android est la plateforme prioritaire, avec un écart de 1 à 3 semaines.

**Leçons pour le jeu du Père Noël :**
1. publier des notes **honnêtes**, y compris sur les nerfs ;
2. garder la parité entre plateformes ;
3. ne pas réduire un revenu dans lequel le joueur a investi (ou le compenser) ;
4. un « VIP sans pub » doit vraiment supprimer les pubs ;
5. alterner ajouts de fin de partie et améliorations du cœur de jeu (emplacements, automatisation).

---

## 5. Sources

### Sources primaires (App Store)
- Historique App Store US (25 versions, 0.3.6 à 0.9.1, extrait du bloc JSON `serialized-server-data`) : https://apps.apple.com/us/app/bid-master-auction-game/id6453025143. Copie : `raw/bidmaster/appstore_us.html.gz`, `serialized_us.json`.
- Mêmes historiques, localisés :
  - FR : https://apps.apple.com/fr/app/bid-master-enchere-tycoon/id6453025143
  - GB : https://apps.apple.com/gb/app/bid-master/id6453025143
  - DE : https://apps.apple.com/de/app/bid-master-tycoon-spiele/id6453025143
  - ES : https://apps.apple.com/es/app/bid-master/id6453025143
  - BR : https://apps.apple.com/br/app/bid-master-leil%C3%B5es-tycoon/id6453025143
  - JP : https://apps.apple.com/jp/app/bid-master/id6453025143
  - KR : https://apps.apple.com/kr/app/bid-master-%EA%B2%BD%EB%A7%A4/id6453025143
  - TW : https://apps.apple.com/tw/app/%E6%8B%8D%E8%B3%A3%E5%A4%A7%E5%B8%AB/id6453025143
  - IN et BN : même modèle.
  - CN : 404, l'application n'y est pas disponible.
  - Les 12 vitrines sont regroupées dans `versionHistory_all_storefronts.json`.
- API iTunes (date de sortie 2023-08-21, version 0.9.1 du 2026-10-26, vendeur EYEWIND LIMITED., description) : https://itunes.apple.com/lookup?id=6453025143&country=us (et `&country=fr`).
- Avis App Store (flux RSS, 8 pays × 10 pages, 630 avis dédoublonnés avec leur version) : https://itunes.apple.com/us/rss/customerreviews/page=1/id=6453025143/sortby=mostrecent/json. Remplacer `us` par gb, ca, au, fr, de, in ou ph. Copie : `reviews_all.json`.

### Miroirs et trackers
- **soft112, miroir de l'historique App Store** (versions 0.2.2, 0.3.1, 0.3.3 et 0.3.5, et les notes Apple watchOS 27 sur la 0.8.5) : https://bid-master-ios.soft112.com/. Copie : `soft112_versionHistory.json`.
- **Google Play** :
  - fiche EN et FR (« Released on Aug 6, 2024 », « Updated on Sep 3, 2026 », version 0.9.0, « What's new » = texte de la 0.8.5, 10M+, prix des achats de 0,99 à 119,99 $, événement « Old car auction », description) : https://play.google.com/store/apps/details?id=com.bid.master.war.auction.battle&hl=en&gl=US ;
  - page de l'événement : https://play.google.com/store/apps/eventdetails/4829876982554009601.
- **Uptodown**, liste des 29 versions Android (dates de miroir) : https://bid-master.en.uptodown.com/android/versions, API : https://bid-master.en.uptodown.com/android/apps/1000163395/versions/1 (et /2).
- **TapTap** (annonces : Android le 20 juin 2023, iOS le 21 août 2023) : https://www.taptap.io/app/33570258.
- **MWM** (« First Released Aug 21, 2023 », jalons de téléchargements) : https://mwm.ai/apps/bid-master/6453025143.
- **androidrank** (5 M d'installations le 2025-03-01, 10 M le 2025-07-02, 98 214 avis) : https://www.androidrank.org/application/bid_master/com.bid.master.war.auction.battle.
- **Skich** (Release date Aug 06, 2024 ; Update Sep 03, 2026) : https://skich.app/games/bid-master.
- **apps112** (listing 0.9.0 depuis le 2026-09-02) : https://bid-master-win-the-auction.apps112.com/.
- **Malavida, iOSGods** (0.9.0 seulement, sans historique) : https://www.malavida.com/en/soft/bid-master/android/, https://app.iosgods.com/store/appdetails/5888-bid-master-auction-game-ios-mod-ipa.
- **iofreeonline** (« Pubish Date : Mon Nov 27 2023 », vendeur SHENZHEN BRAINPOWER TECHNOLOGY CO.LTD ; site en partie généré par IA) : https://www.iofreeonline.com/IOS/game/Bid-Master.html.
- **APKPure, AppBrain, APKCombo, Aptoide** : accès automatisé **bloqué** (403 ou domaine refusé), non contourné. Seuls leurs **extraits dans les moteurs de recherche** ont été utilisés [I] :
  - APKPure 0.5.6, « released on Sep 27, 2024 » : https://apkpure.com/bid-master-storage-auc-wars/com.bid.master.war.auction.battle/download/0.5.6
  - APKPure 0.6.5, « Mar 13, 2025 » : …/download/0.6.5
  - APKPure 0.9.0, build 183, « Sep 12, 2026 » : https://m.apkpure.com/bid-master-storage-auc-wars/com.bid.master.war.auction.battle/download
  - AppBrain 0.9.0, « Sep 2, 2026 » : https://www.appbrain.com/app/bid-master-auction-tycoon/com.bid.master.war.auction.battle
  - APKCombo, versions 0.4.5 (mai 2024) à 0.7.6 (28 oct. 2025) : https://apkcombo.com/bid-master-auction-tycoon/com.bid.master.war.auction.battle/old-versions/
- **YouTube** (titres et ancienneté des vidéos ; chaîne BING ZLEE : Lost City / Star Compass il y a environ 8 mois, Visitor in the Fog il y a environ 1 mois) : https://www.youtube.com/results?search_query=bid+master+auction+tycoon+update. Copies : `yt_*.html.gz`.

### Sources non trouvées
- Aucune page officielle Facebook, Discord ou X n'est indexée (recherches « Bid Master Hydodo facebook / discord »).
- La Wayback Machine est inaccessible depuis cet environnement (egress bloqué).

### Versions sans notes retrouvées
- **iOS** : la version de lancement du 21 août 2023 (0.1.5 ?), puis 0.1.6 ?, 0.1.9 et 0.2.1 ? (sept. à nov. 2023).
- **Android** (pas de notes publiques par version) : 0.1.9, 0.4.5, 0.4.7, 0.4.9, 0.5.5, 0.5.9, 0.6.0, 0.6.4, 0.6.6, 0.6.8, 0.7.5, 0.7.6, 0.8.4. Le « Quoi de neuf » Play actuel de la 0.9.0 reprend le texte de la 0.8.5.
- **Saisons S2, S3, S5, S6 et S8+** : jamais annoncées dans les notes.
