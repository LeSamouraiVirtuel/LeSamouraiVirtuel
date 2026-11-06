# Merge Mansion (Metacore / Supercell) — étude pour « Le Village du Pôle »

> Étude du 6 novembre 2026. Provenance : [URL], [IMG = capture regardée], [VID = image extraite de la vidéo officielle App Store], [AVIS = avis App Store US via flux RSS Apple]. « Non trouvé » si absent.
> Limites : Reddit illisible pour l'outil (pas de contournement) ; wiki Fandom refusé (HTTP 402) ; YouTube non utilisé.

Médias regardés (`img/merge-mansion/`) :
- `as_iphone_1..6.jpg`, `as_ipad_1..3.jpg` (App Store), `gp_plateau_tel.jpg`, `gp_plateau2_tel.jpg`, `gp_tablette_1.jpg`, `gp_tablette_2.jpg` (Google Play) → **13 images**.
- **Vidéo d'aperçu officielle App Store** (flux `.m3u8` public de apptrailers.itunes.apple.com, 29,4 s, 332×720) téléchargée avec ffmpeg, découpée à 1 image/s : `v_001..v_030.jpg` + planches `v_planche_1.jpg`, `v_planche_2.jpg` → **1 vidéo, ~30 images regardées**.

---

## 1. Fiche

| Élément | Valeur | Source |
|---|---|---|
| Éditeur | Metacore Games Oy (Helsinki) ; **racheté à 100 % par Supercell**, finalisé (annonce du 19 oct. 2026) | [iTunes API], [mobilegamer.biz/supercell-has-completed-its-acquisition-of-merge-mansion-maker-metacore/] |
| Sortie | Septembre 2020 (App Store : 16 sept. 2020) | [Wikipedia], [iTunes API] |
| Plateformes | iPhone, iPad, Android. Pas de version Mac/PC officielle trouvée (seulement émulateurs type BlueStacks) | [App Store], [bluestacks.com] |
| Version | 26.09.01 (3 nov. 2026) ; 293,7 Mo ; iOS 15+ ; 12+ ; anglais seulement sur iOS | [iTunes API], [App Store] |
| Notes | App Store US 4,56/5 (203 689 notes) ; Google Play 4,5/5 (665 K avis), « 10M+ » téléchargements | [iTunes API], [Google Play] |
| Revenus | 38,6 M$ du 1er janv. au 16 nov. 2021 ; ~490 M$ depuis 2020 selon AppMagic (oct. 2026) ; d'autres médias citent ~700 M$ et 60 M de joueurs | [Wikipedia], [mobilegamer.biz], [pocketgamer.biz / wnhub.io] |
| Entreprise | Metacore : CA 2024 en baisse de 5 % à 154 M€ ; 159 licenciements à Helsinki + fermeture des bureaux Allemagne/Suède (2026) | [wnhub.io item 48161], [mobilegamer.biz] |
| État | Pic des revenus en 2022–2023, déclin depuis ; nouveau directeur du jeu (Jose Saarniniemi, juin 2026) ; objectif affiché : « retrouver la première place » | [mobilegamer.biz], [pulse.bot / trysignalbase] |

## 2. Historique et mises à jour

- **Sept. 2020** : lancement ; premier jeu de Metacore. [Wikipedia]
- **2021** : 40 M+ de téléchargements (16 août 2021) ; campagne vidéo en prises de vue réelles avec **Kathy Bates** en Grand‑mère Ursula (agence W+K) ; Supercell prête 180 M$ à Metacore. [Wikipedia], [pocketgamer.biz/news/76462]
- **Déc. 2021 / janv. 2022** : événement de Noël puis « nouvelle zone » (v22.01.06) ; mai 2022 : Hopeberry Festival. [apk4fun.com/history/741269]
- **Juin 2022** : événements « Garage Cleanup » (plateau séparé ; objets perdus à la fin si non vendus). [gosunoob.com], [touchtapplay.com]
- **Avril 2022** : bande originale officielle (12 titres). [Wikipedia]
- **Début 2023** : publicités avec **Pedro Pascal** (détective Tim Rockford). [Wikipedia]
- **2023** : zones Heikki's Sauna (juil.), 3e anniversaire (sept.), Charlie's Hideout, Dining Room, Bathroom (17 nov.). [merge-mansion.fandom.com/wiki/Mansion_Updates (extrait moteur)]
- **2024** : The Gallery (janv.) ; mise à jour du 20 août 2024 : nouvelle zone, rebondissements, nouvel animal. [mergemansion.com/news/aug24-update/]
- **2026** (historique App Store) : Grand‑mère disparaît pour résoudre « le mystère du plateau » (févr.) ; retour du Japon + zone espionnage (mars) ; Gift Shop (avril) ; Factory Floor (mai) ; Hallway of Curiosities + soirée foot (juin) ; Kitchen + **retour du bouton « Settings »** (juillet) ; Pantry (août) ; Parlor + Season Pass d'Halloween (sept.) ; **Factory Office + Hopewell Bay sous la neige** (3 nov. 2026). [App Store historique]
- **21–24 sept. 2026** : une mise à jour **bloque le chargement à 100 %** pour de nombreux joueurs (≈15 avis 1–2★ en 3 jours). [AVIS]

## 3. Boucle de jeu et fonctionnalités

- **Boucle** : générateurs (boîte à outils, tonneau d'outils…) → tap = 1 énergie → objets → fusion 2→1 vers le niveau supérieur → livrer les objets demandés par les tâches → les tâches restaurent le domaine et débloquent l'histoire. [Wikipedia], [IMG gp_plateau_tel]
- **Plateau** [IMG gp_plateau_tel, gp_plateau2_tel] : grille ~7×9 ; cases verrouillées sous des **cartons** ; objets identiques surlignés en vert avec coche quand ils correspondent à une tâche ; panneau d'info en bas (« Tool barrel — 3h 59m — Skip 10 gemmes — Sell +999 ») ; bouton stockage (boîte) en bas à droite ; retour en bas à gauche.
- **Tâches** en haut du plateau : vignettes de personnages (majordome, ouvrière) avec objets demandés et compteurs « 0/2 », « 1/2 », bouton « Complete » quand prêt. [IMG gp_plateau_tel]
- **Carte du domaine** [IMG as_iphone_5/6] : vue isométrique d'une zone (grange, salon de jeu), objets‑tâches en bulles au‑dessus des éléments à réparer (pelle + râteau cochés) ; colonne gauche = portraits d'événements avec minuterie (« 12d 23h », « 6d 10h », « 4d 16h ») ; colonne droite = minuteries d'événements, enveloppe (courrier), journal, liste de tâches avec pastille « 3 » ; bas = maison, plumeau (outil de nettoyage).
- **Narration** : personnages forts (Maddie, Grand‑mère Ursula, Pearl, Jackie, Charlie…), intrigue de secrets de famille et d'enquête ; la **vidéo** montre une vraie cinématique 3D (Grand‑mère arrêtée, menottée dans une voiture de police, Maddie en larmes contre la vitre) puis le titre « What's Grandma Hiding? ». [VID v_001–v_008] — En jeu : dialogues avec portrait de Maddie et bulle (« Grandma got arrested! I need to find out why... »). [VID planche 1, images 9–10]
- Un joueur regrette la disparition des dialogues à la fin des zones (« now whenever I complete a zone there's no dialogue whatsoever »). [App Store avis 7 juil. 2022]
- **Événements** : plateaux d'événements séparés (Garage, pêche, pâtisserie, observation d'oiseaux), événements d'histoire de 3 jours, boutique d'événement (décorations uniques), Season Pass, collections photo, animaux. [touchtapplay.com], [sportskeeda.com], [AVIS 26 août 2026]

## 4. Monétisation et boutique

- **Monnaies** (barre haute) : niveau (étoile bleue « 12 » + jauge XP), **énergie** (éclair, 100), **pièces** (1356), **gemmes** roses (100), chacune avec un « + » vert ; icône **panier** bleu (boutique) en haut à droite. [IMG as_iphone_2, gp_plateau_tel]
- Énergie plafonnée à 100 en régénération naturelle ; achat d'énergie contre gemmes. [gfinityesports.com / levelwinner via recherche]
- **Accélérateurs payants** : « Skip » d'un temps de recharge contre 10 gemmes. [IMG gp_plateau_tel]
- **Prix App Store US** : Pouch of Gems 1,99 $ ; Bag of Gems 4,99 $ ; Chest of Gems 9,99 $ ; Shop Offer 03/05/06/08/10 = 2,99 / 4,99 / 7,99 / 9,99 / **19,99 $** ; **Premium Pass 12,99 $** ; **Mystery Pass 9,99 $**. [App Store US]
- **Passes** : durée raccourcie au fil du temps selon un joueur (« used to last a month, then … three weeks. Now … 2 & 1/2 weeks for the same price ») ; suppression de la « machine à sous » de fin de pass. [AVIS 3 et 9 oct. 2026]
- Suppression des **récompenses vidéo (pub contre énergie)** signalée par un agrégateur d'avis. [marlvel.ai/apps/merge-mansion-puzzles-story/reviews]
- Skins/tenues : non trouvé (décorations d'événements et animaux seulement).

## 5. Interface et ergonomie

- **Téléphone** : barre de ressources fine en haut, plateau qui occupe presque toute la largeur, panneau d'info contextuel en bas (l'objet sélectionné est décrit avec actions Skip/Sell). [IMG gp_plateau_tel]
- **Tablette** [IMG gp_tablette_1, gp_tablette_2] : le plateau garde **une largeur fixe proche de celle du téléphone** et reste centré ; de **grandes marges** affichent le décor de la scène (porche, arbre, carton) ; la barre de ressources reste au même endroit et à la même taille ; le panneau d'info du bas suit la largeur du plateau. → l'interface ne s'étire pas, elle se « pose » sur un décor plus large.
- **Animations observées dans la vidéo** [VID] : cadenas en bulle au‑dessus de la porte → **clé qui tourne** → porte qui s'ouvre (images 9–14) ; transition en fondu vers un plateau ; **main‑curseur** qui glisse un objet sur son jumeau, flash blanc à la fusion ; objet obtenu (horloge dorée) affiché **en très grand au centre avec halo** avant de rejoindre la scène (planche 2, image 3) ; **avant/après** d'une pièce poussiéreuse et sombre qui devient lumineuse avec un rayon de lumière (planche 2, images 6–8) ; réactions de Maddie en gros plan (bouche ouverte, sourire). Fin : carton titre + bouton vert « Play Now! ».
- Lisibilité : icônes d'objets nombreuses et petites sur téléphone ; un joueur juge la chaîne de fusion difficile à suivre ; un autre se plaint d'un guidage trop insistant (« the correct answer starts blinking »). [AVIS 24 août 2026]
- Un agrégateur note des plaintes sur un **changement brutal de disposition d'interface** (le bouton Settings a été retiré puis rétabli en juillet 2026). [marlvel.ai], [App Store historique 26.06.02]

## 6. Avis des joueurs

Sur les **100 avis US les plus récents (6 août–9 oct. 2026)** : 31 × 1★, 16 × 2★, 18 × 3★, 13 × 4★, 22 × 5★. [AVIS]

Aimé : « really happy to keep finding more areas, more item chains to unlock, and more events for decorations! » (2022) ; « I love how it is not super easy to progress but its not too hard either » (2021). [App Store US]

Détesté [AVIS 2026] :
- Minuteries : « The timers on key generators can last an hour » ; « They make you wait like a full hour for the little things to reload ».
- Récompenses réduites : « Chopped the worth of rewards for fully merged items like gems in half ».
- Trop de systèmes : « There was NO "clue cards" or "mini games" nor "fishing or baking" … It was actually fun ».
- Art : « The art in the game is just sickening now » (accusation d'art IA).
- Pub vs jeu : « only about 30% of the scenarios depicted in the ads are re[al] » ; « you never get into the mansion ».

Controverses : publicités live‑action jugées non représentatives, comparées à *Lily's Garden* ; critiques de YouTubers (Danny Gonzalez, MatPat). [Wikipedia]

## 7. Bugs et problèmes connus

- **Sept. 2026** : chargement bloqué à 100 % après la mise à jour 26.08.x (« loads to 100% then freezes on the loading screen »). [AVIS 21–24 sept. 2026]
- Gemmes/pièces achetées non créditées ; agent support qui clôt la demande. [AVIS 11 et 25 sept. 2026]
- Gel à l'ouverture de l'événement « Green with Envy », gel en ajoutant de l'énergie dans le jeu de pêche. [AVIS août 2026]
- Objets d'événement perdus à la fin des événements Garage (règle connue). [touchtapplay.com]

## 8. Ce que « Le Village du Pôle » devrait copier / éviter

**Copier**
1. **Accroche narrative cinématique** au tout début (ex. : le traîneau du Père Noël volé / l'atelier sinistré) avec une question‑titre (« Qui a saboté l'atelier ? »).
2. **Cadenas → clé → porte qui s'ouvre** : chaque nouveau bâtiment du village se déverrouille par une petite séquence animée.
3. **Objet obtenu montré en grand au centre** avec halo avant d'aller à sa place.
4. **Avant/après lumineux** (bâtiment sombre et poussiéreux → illuminé) à chaque fin de chantier.
5. **Tâches visibles en bulles au‑dessus des éléments à réparer** dans la vue du village.
6. **Tablette : plateau à largeur fixe centré, décor dans les marges** (même logique pour notre version web/PC : ne pas étirer l'UI).
7. **Panneau d'info contextuel** en bas (nom, temps restant, accélérer/vendre).

**Éviter**
1. Recharges de générateurs d'une heure dès le début : frustration immédiate et désinstallation.
2. Raccourcir un pass sans baisser le prix ; retirer des fonctions de pass (« machine à sous »).
3. Empiler les mini‑systèmes (pêche, pâtisserie, oiseaux, cartes) au point de diluer la boucle principale.
4. Promettre un lieu (« le manoir ») qu'on ne voit qu'après des heures.
5. Déployer une mise à jour sans test de chargement sur anciens comptes.

## 9. Sources

- https://itunes.apple.com/lookup?id=1484442152&country=us
- https://apps.apple.com/us/app/id1484442152 (fiche, IAP, historique, lien vidéo)
- https://apptrailers.itunes.apple.com/itunes-assets/PurpleVideo211/v4/93/fc/e8/93fce887-bf43-b4df-63bd-99abf4b0ac3c/P1473903491_default.m3u8 (vidéo d'aperçu officielle)
- https://itunes.apple.com/us/rss/customerreviews/page=1/id=1484442152/sortby=mostrecent/json (+ pages 2–3)
- https://play.google.com/store/apps/details?id=com.everywear.game5
- https://en.wikipedia.org/wiki/Merge_Mansion
- https://mobilegamer.biz/supercell-has-completed-its-acquisition-of-merge-mansion-maker-metacore/
- https://www.pocketgamer.biz/supercell-confirms-plan-to-acquire-metacore-and-bring-merge-mansion-into-its-live-games-portfolio/
- https://www.pocketgamer.biz/news/76462/supercell-lends-metacore-180-million-dollars-merge-mansions/
- https://wnhub.io/news/investment/item-48161
- https://mergemansion.com/news/aug24-update/
- https://merge-mansion.fandom.com/wiki/Mansion_Updates (extrait moteur, page refusée en lecture directe)
- https://www.apk4fun.com/history/741269/
- https://www.touchtapplay.com/how-to-start-the-merge-mansion-garage-cleanup-event-rewards-and-more/
- https://www.sportskeeda.com/esports/merge-mansion-story-events-explained
- https://marlvel.ai/apps/merge-mansion-puzzles-story/reviews
- https://www.pocketgamer.biz/deconstructing-magmatic-games-travel-town (comparaison : « l'UI/UX de Merge Mansion surpasse ses concurrents »)
