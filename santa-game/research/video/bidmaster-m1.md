# Bid Master : analyse image par image, minute 1 (1:00 à 1:59)

Sources : 30 planches (une image toutes les 0,25 s), 55 captures pleine résolution prises aux changements d'écran, et des extraits à 10 ou 20 i/s tirés de `video.mp4` pour les animations (félicitations, billets qui volent, négociation, révélation de vente, expertise, coffres).
L'enregistrement iOS **n'affiche pas les doigts**. Chaque toucher est donc déduit d'un bouton qui s'enfonce ou de l'écran qui change juste après ; ces lignes sont marquées « (déduit) ».
Les montants de billets s'affichent **tronqués** à 2 décimales en K (18 268 → « 18.26K »). Tous les calculs ci-dessous tombent juste avec cette règle.

---

## 1. Chronologie

### 1:00 – 1:08 : deux ventes encaissées au Prêteur sur gages

| Temps | Événement |
|---|---|
| 1:00.00 | **Popup d'offre client** ouverte au-dessus du Prêteur sur gages (fond assombri). Titre « Urne ancienne du dragon divin » ; vignette rouge ; **$2,481** ; icône d'étagère + « épopée » ; « Prochaine offre : ⏱ 02:29:05 » ; portrait de la cliente + bulle « Je te donne **$3,250** [+30.9%] ». Boutons bleu « D'accord » et jaune « 8 (lingot) Nouvelle offre ». HUD : 298 lingots, **14.71K** billets. |
| 1:00.25 | Le minuteur passe à 02:29:04 (il tourne en direct dans la popup). |
| ≈1:00.40 | Le joueur touche **D'accord** (déduit). La popup disparaît sans animation de fermeture visible. |
| 1:00.45 | **Écran CONGRATULATIONS.** Voile sombre plein écran, faisceau de lumière dorée qui tombe du haut. Le titre « CONGRATULATIONS » (lettres blanc-doré, lueur dorée) apparaît d'un coup. Deux filets blancs partent du centre vers les bords. Le HUD derrière indique **déjà 18.26K** : le compteur est crédité tout de suite, il ne défile pas. |
| 1:00.75 | Le sous-titre « Félicitations pour l'obtention » apparaît en fondu entre les filets (≈0,3 s). |
| 1:01.25 | Les cartes de récompense apparaissent en fondu (opacité 50 % à 1:01.25, pleine à 1:01.35). Un losange de lumière tourne derrière. En haut à gauche, une icône ⓘ. Deux grandes cartes : violette **billets « 3,526 »** et bleue **livre EXP « 5 »**. En dessous, une pastille brune bordée d'or « **Prime De Secrétaire** » avec deux petites cartes : billets **32** et EXP **1**. |
| 1:01.45 | Le bouton rond **✓** (anneau doré, lueur) apparaît en fondu. Tout est en place ≈1,0 s après le début. |
| 1:01.5 – 1:03.0 | Écran fixe ≈1,6 s. Le joueur attend. |
| ≈1:03.10 | Le joueur touche **✓** (déduit). |
| 1:03.20 | Retour au Prêteur sur gages. **Gerbe de liasses de billets et de livres EXP** : elles jaillissent de l'emplacement vendu (en bas à gauche, où était l'urne) et du haut de la grille, puis s'éparpillent. |
| 1:03.2 – 1:04.8 | Les liasses (plus d'une trentaine, chacune tournée différemment) s'élèvent et convergent vers le **compteur de billets en haut à droite**. Les livres EXP montent vers le haut à gauche (zone du titre). Durée ≈1,4 s. Les particules continuent de voler par-dessus la popup suivante. L'emplacement de l'urne devient « + Ajouter des produits ». |
| ≈1:04.35 | Ouverture de la popup suivante, probablement par un toucher sur « Voir l'offre » du casque (déduit). La popup grossit depuis le centre : petite à 1:04.40, pleine à 1:04.50. |
| 1:04.50 | **Popup « Casque tactique »** : vignette orange, **$1,200**, icône (engrenage) « Légendaire », « Prochaine offre : 00:49:00 », « Je te donne **$1,452** [+21.0%] », « D'accord » / « 2 (lingot) Nouvelle offre ». |
| 1:05.25 | Le minuteur passe à 00:48:59. |
| ≈1:05.40 | Le joueur touche **D'accord** (déduit). |
| 1:05.50 | Deuxième **CONGRATULATIONS**, même séquence et même rythme. HUD **19.85K**. Récompenses : billets **1,575**, EXP **5** ; Prime De Secrétaire : billets **14**, EXP **1**. Le ✓ apparaît à 1:06.50. |
| ≈1:07.70 | Le joueur touche **✓** (déduit). |
| 1:07.75 | Retour au magasin avec une nouvelle gerbe de billets et d'EXP. L'emplacement du casque est désormais vide (« Ajouter des produits »). **Les six emplacements sont vides.** |

**Calculs vérifiés :**
- 14 710 + 3 526 + 32 = 18 268, affiché 18.26K ✓
- 18 268 + 1 575 + 14 = 19 857, affiché 19.85K ✓
- Le pourcentage de l'offre se rapporte à la valeur de l'objet : 3 250 / 2 481 = +31,0 % ; 1 452 / 1 200 = +21,0 % ✓
- **La récompense dépasse le prix annoncé d'environ +8,5 %** : 3 526 / 3 250 = 1,085 ; 1 575 / 1 452 = 1,085. Il y a donc un bonus caché de vente (manager, titre ou VIP [?]).
- **La Prime De Secrétaire vaut ≈1 % du prix de vente** (32 ≈ 1 % de 3 250 ; 14 ≈ 1 % de 1 452), plus 1 EXP.
- Chaque vente rapporte **5 EXP**.
- Le prix de « Nouvelle offre » varie selon l'objet : 8 lingots pour l'urne, 2 lingots pour le casque.

### 1:08 – 1:12 : remettre un objet en vente

| Temps | Événement |
|---|---|
| 1:08.00 | Le joueur fait glisser la grille d'étagères vers le haut (défilement). La rangée du haut apparaît : **deux emplacements « ★ VIP »** (étoile dorée + « VIP » en italique doré, sans bouton). Les billets volent encore. |
| 1:08.25 – 1:08.75 | La grille montre 3 rangées : VIP/VIP, puis + / +, puis + / +. Les points rouges sur les « + » signalent des emplacements libres. |
| ≈1:08.90 | Toucher sur un « + Ajouter des produits » (déduit). |
| 1:09.00 | **Entrepôt en mode « sélection »** (sans corbeille, sans « Mettre à jour ») : « Entrepôt [ **43**/51 ] », onglet « tous » actif. Les dernières liasses traversent encore cet écran et rejoignent le compteur : la couche de particules survit au changement d'écran. |
| 1:09 – 1:10.25 | Grille fixe. 1ʳᵉ rangée : Ornements de bête en bronze $573 (orange) · Kayak professionnel $516 (orange) · Moniteurs vitaux $1,210 (violet)… |
| ≈1:10.40 | Toucher sur « Ornements de bête en bronze » (déduit). |
| 1:10.50 | Retour au magasin assombri avec la **popup de mise en vente** (voir §2.4). Sous la popup, une **bannière VIP** : « VIP Vip Peut Ignorer Les Publicités Un Nombre Illimité De Fois [AD] ». |
| ≈1:11.40 | Toucher sur **« Commencer à vendre »** (déduit). |
| 1:11.50 | L'objet est posé sur l'étagère, au milieu à gauche : « Première offre ⏱ 01:54:00 » (vert), statuette en bronze, sous-boutons « 5 (lingot) Accélérer » (jaune) et « (clap) 01:00:00 ↓ » (vert). La flèche rouge vers le bas signifie « −1 h avec une pub ». La vendeuse cligne de l'œil (1:11.75). |
| 1:12.25 | 01:53:59 : le compte à rebours tourne. |

### 1:13 – 1:29 : la file de clients vendeurs (achat avec négociation)

| Temps | Événement |
|---|---|
| ≈1:13.10 | Toucher sur le bouton **« Client »** en bas à gauche (icône de silhouette avec point rouge) (déduit). |
| 1:13.15 – 1:13.35 | La popup « Client » grossit avec un **rebond** : petite, puis plus grande que sa taille finale, puis taille finale (≈0,2 s). |
| 1:13.35 | **Popup « Client »** : compteur « (silhouette) **2/2** » en haut à droite. Deux clients sont **empilés** : une femme en robe rouge devant, un homme aux cheveux blancs en salopette derrière. Devant eux, un plateau en bois avec l'objet proposé (une poussette). Fond : salle sombre à damier. |
| ≈1:13.90 | Toucher sur la scène (déduit). Ouverture de **« Obtenez le meilleur prix »**. |
| 1:14.00 | Négociation (voir §2.6) : « Hé. Je veux vendre à 59. » ; objet « Poussette portable » (fond **vert**) ; humeur ♥ vert « calme » ; halo **vert** derrière le client ; « $59 Votre citation » ; curseur au maximum. |
| 1:15.0 – 1:15.5 | Le joueur fait glisser le curseur vers la gauche : $43 → $29 → $27 → $26. Le curseur se règle au dollar près. |
| ≈1:15.60 | Toucher sur **« franchir »** (bleu) (déduit). Le joueur passe, il n'achète pas : les billets restent à 19.85K. |
| 1:15.65 | Retour immédiat à la popup « Client », compteur **1/2** : l'homme seul tient une **stèle** sur le plateau. |
| ≈1:16.70 | Toucher sur la scène (déduit). La négociation s'ouvre en grossissant (1:16.75). |
| 1:16.75 | « Hé. Je veux vendre à **21,677**. » ; « Stèles d'inscription égypt » (nom tronqué) ; vignette **rouge** ; « calme » ; curseur au maximum, « $21,677 ». |
| 1:17.75 – 1:21.25 | Glissements successifs vers le bas : 17,681 → 10,698 → 9,041 → 8,586 → 7,612 → 6,995 → 6,638 → 6,735 → 5,955 → 5,241 → 5,078. |
| ≈1:21.6 | Le bouton « offre » paraît légèrement enfoncé, sans aucune réaction visible [?]. |
| 1:22.50 | Remontée du curseur : 6,475 → **6,735** (1:23.00). |
| ≈1:23.60 | Toucher sur **« offre »** (déduit). |
| 1:23.65 | **Réaction du client** : la bulle devient rouge, « **J'ai payé 10,802!** » ; l'humeur passe à ♥ rouge « **se mettre en colère** » avec une petite jauge rouge dessous ; le halo derrière le client passe du **vert au rouge**. |
| 1:24.00 – 1:24.65 | Alerte **système iOS** « Batterie faible · Charge restante : 20 % · Mode économie d'énergie · Fermer », fermée par le joueur. Elle ne fait pas partie du jeu. |
| ≈1:25.45 | Nouveau toucher sur **« offre »** au même prix, $6,735 (déduit). Cette fois, le client accepte. |
| 1:25.50 | **Révélation de l'achat** : la popup « Client » s'efface derrière un voile noir. Deux **projecteurs dorés** en V partent des coins haut, avec des étincelles blanches et un halo orange au sol (sur le plateau). Panneau du bas : « Stèles d'inscription égyptiennes anciennes · valeur: · Paiement: · réaliser des bénéfices : » (champs vides). Le HUD tombe **aussitôt** à **13.12K**. |
| 1:26.05 | « valeur: **$7,250** » apparaît (jaune). |
| 1:26.30 | « Paiement: **$6,735** » apparaît. |
| 1:26.60 | En même temps : le titre « **C'est le tien!** » (blanc, gras), la stèle en grand sous les projecteurs, « réaliser des bénéfices : **$+515** » en **vert vif très gros**, et le bouton ✓. |
| 1:26.75 | Le « $+515 » reprend sa taille normale (effet « pop » d'environ 0,15 s). |
| ≈1:27.40 | Toucher sur **✓** (déduit). |
| 1:27.50 | La popup Client revient un instant avec le compteur **0/2**. Par-dessus grossit la popup **« pas de clients »** : petite à 1:27.5, plus grande que la finale vers 1:27.9, taille finale vers 1:28.1 (rebond d'≈0,5 s). |
| 1:27.75 – 1:28.75 | « pas de clients » ✕ · « Client suivant : » · minuteur **00:29:59 → 00:29:58** dans un losange de lignes fines · « Vous pouvez désormais aussi amener un client ! » · « Générer 1 client » + bouton jaune « (lingot) **5** ». |
| ≈1:28.90 | Toucher sur ✕ (déduit). Retour au magasin (1:29). Le bouton Client garde son point rouge pour l'instant ; il l'a perdu à 1:46. |

**Calculs vérifiés :**
- 19 857 − 6 735 = 13 122, affiché 13.12K ✓
- Bénéfice : 7 250 − 6 735 = 515 ✓
- Le prix demandé (21 677) vaut **≈3× la valeur réelle** (7 250). Le client dit avoir payé 10 802 (≈1,5× la valeur). Le joueur a acheté à **93 %** de la valeur.

### 1:29 – 1:39 : envoyer le kayak à l'Institut d'expertise

| Temps | Événement |
|---|---|
| ≈1:29.90 | Toucher sur **↩** en bas à droite (déduit). |
| 1:30.00 | **Ville** (HUD complet, voir §2.1), sans transition visible (coupe franche). |
| 1:30.75 – 1:31.75 | Glissement de la carte vers le haut à gauche. Apparaissent l'**Institut d'expertise** (maison blanche à toit gris) et l'« Atelier de réparation » (hangar bleu avec une clé géante). Des petits piétons marchent sur les trottoirs. |
| ≈1:31.90 | Toucher sur l'Institut (déduit). |
| 1:32.00 | **Institut d'expertise** (voir §2.8) : plateau vide avec un « + » (point rouge), minuteur à palettes « 00 : 00 ». |
| ≈1:33.90 | Toucher sur « + » (déduit). |
| 1:34.00 | **Entrepôt en mode sélection, onglet « identification » présélectionné.** Il ne liste que les objets à loupe : Kayak $516, bague diamant 3 carats $648, Porcelaine colorée de l'année du Tigre $619, Lampe de table classique $594, Lingot d'argent $489, Graphisme $480, M1911 $480, Meuleuse d'angle $462, Figurine Hatsune Miku $456, Chaises en cristal [prix masqué], épée spartiate [prix masqué], lance [prix masqué]. Toujours **43/51** : l'ornement est sorti, la stèle est entrée. |
| ≈1:35.40 | Toucher sur le Kayak (déduit). |
| 1:35.50 – 1:35.75 | La **popup « Kayak professionnel »** grossit au-dessus de l'Institut assombri (voir §2.9). |
| 1:35.75 – 1:37.75 | ≈2 s d'hésitation, rien ne bouge. |
| ≈1:37.85 | Toucher sur **« 304 Évaluation Standard »** (déduit). |
| 1:37.95 | La popup disparaît. Le kayak (jaune, « OCEAN KAYAK ») est posé sur le plateau. HUD **12.81K** (13 122 − 304 = 12 818 ✓). |
| 1:38.25 | Le minuteur à palettes passe de « 00:00 » à « **59:59** » (expertise standard = 1 h). Deux boutons apparaissent en bas : vert « (clap) **Rapide 30 minutes** » et jaune « (lingot) **6** immédiatement! ». |
| ≈1:39.10 | Toucher sur ↩ (déduit). |

### 1:39 – 1:52 : Entrepôt complet, puis mise en vente de la stèle

| Temps | Événement |
|---|---|
| 1:39.25 – 1:40.25 | Ville. Glissement de la carte (Musée, puis Marché commercial et « Métropole » en haut à gauche, dans le brouillard). L'icône « Limitée » à droite a **changé d'illustration** : un marin à la place de la femme rousse (icône tournante). |
| ≈1:40.40 | Toucher sur le bâtiment Entrepôt (déduit). |
| 1:40.50 | **Entrepôt en mode complet** (voir §2.3), **42/51** : le kayak est parti à l'Institut. La stèle est en tête, sur fond **rouge**. |
| 1:40.5 – 1:44.0 | 3,5 s de lecture sans défilement. |
| ≈1:44.10 | ↩ (déduit). |
| 1:44.25 – 1:45.75 | Ville. Glissement de retour vers le Prêteur sur gages. Le minuteur du cadeau passe de 08:33 à 08:32. |
| ≈1:45.90 | Toucher sur le Prêteur (déduit). |
| 1:46.00 | Magasin (déjà défilé sur les VIP). Ornement « 01:53:26 ». Le bouton Client a **perdu son point rouge** : il n'y a plus de clients. |
| ≈1:47.10 | Toucher sur « + » (déduit). Entrepôt en mode sélection (42/51). |
| ≈1:48.10 | Toucher sur la stèle (déduit). |
| 1:48.25 | La popup « Stèles d'inscription égyptiennes anciennes » grossit (pleine à 1:48.5). Contenu : **$7,250**, icône « épopée », « Première offre ⏱ **03:48:00** », « **Objets authentiques : Peuvent être placés dans un musée ou vendus directement.** », « Commencer à vendre » / « (clap) **01:54:00** ↓ ». Bannière VIP dessous. |
| ≈1:50.10 | Toucher sur **« Commencer à vendre »** (déduit). |
| 1:50.25 | La stèle est sur l'étagère du milieu à droite : « Première offre ⏱ 03:48:00 », « **11** Accélérer », « (clap) 01:00:00 ↓ ». Le minuteur passe à 03:47:59 à 1:50.5. |
| ≈1:51.10 | ↩ (déduit). Retour en ville. |

### 1:51 – 1:59 : le Serrurier et l'ouverture des coffres-forts

| Temps | Événement |
|---|---|
| 1:51.25 – 1:52.25 | La ville défile vers le Serrurier (bâtiment avec une **clé dorée géante** sur le toit et une bulle « clé » au-dessus) et les immeubles « Appartements » (icône hexagonale, « 0/5 », « 0/5 », « 0/7 »). |
| ≈1:52.40 | Toucher sur le Serrurier (déduit). |
| 1:52.50 | **Serrurier** (voir §2.10). |
| ≈1:53.90 | Toucher sur « Ouvrir » du coffre **doré** (déduit). |
| 1:54.00 | Le voile sombre tombe. Le **coffre doré** apparaît en grand au centre gauche, immobile ≈1,3 s. |
| 1:55.30 – 1:55.75 | Le coffre **glisse vers la droite en s'inclinant** (rotation ≈ +15°), revient à gauche incliné ≈ −15° (1:55.8), puis se redresse (1:56.0). C'est une secousse d'environ 0,7 s. |
| 1:56.05 | Le coffre disparaît. À sa place apparaît l'**objet** (masque de plongée avec caméra), avec « Valeur $ **62** » (62 en jaune) et une **loupe** à droite. Texte : « Évaluation des objets : la valeur des objets peut être augmentée après avoir réussi l'évaluation "Appraisal Academy". » Bouton ✓. Les projecteurs dorés en V et les étincelles montent en fondu (≈0,3 s). |
| 1:56.25 | Titre « **Caméra de plongée** ». |
| 1:56.50 | Étiquette de rareté **« Pas commun »** : texte bleu sur fond bleu clair. |
| ≈1:57.20 | Toucher sur ✓ (déduit). |
| 1:57.25 | Retour au Serrurier. L'étagère du coffre doré est devenue un « Slot de coffre-fort » vide. Les billets n'ont pas changé : **l'objet va à l'entrepôt, sans argent**. |
| ≈1:57.90 | Toucher sur « Ouvrir » du coffre **argent** (déduit). |
| 1:58.00 – 1:59.75 | Le coffre argenté s'affiche en grand (≈1,2 s immobile), puis subit la même secousse : à droite incliné (1:59.25), à gauche (1:59.5), droit (1:59.75). La suite se joue en minute 2. |

---

## 2. Inventaire des écrans

### 2.1 Ville (HUD principal), capture 1:30.11
- **Haut gauche** : avatar blonde dans un cadre doré, pastille « 19 » (niveau). Dessous : badge « VIP » gris en italique et pilule verte « (S) Grand Capitaliste ».
- **Haut, en ligne** : éclair bleu « 60/60 » + bouton « + » orange avec point rouge ; lingot « 298 » + « + » ; liasse « 13.12K » + « + ». En dessous à droite : enveloppe rouge (courrier) et engrenage (réglages).
- **Colonne gauche** (icônes rondes) : « Pack Temporaire » (personnage en cadre doré) · calendrier avec coche · liasse de billets (point rouge) · « AD » barré (anti-pub) · étoile à six branches dorée (Prestige ? [?]) · étal rayé rouge (point rouge, « Marché » [?]) · Facebook · camion (« Retour de voiture » probable) · chevron « ^ » pour replier.
- **Colonne droite** : « Limitée » (illustration qui change : femme rousse puis marin) avec point rouge · cadeau rose ouvert (point rouge) · trophée « S » (point rouge) · coffre rouge et or · cadeau vert avec minuteur « 08:48 » qui décompte en mm:ss · cochon-tirelire « (lingot) 800 » · pick-up · chapeau de mafieux à lunettes · chevron « ^ ».
- **Bas gauche** : bulle-téléphone orange « quêtes secondaires » avec « ! » rouge ; carte violette « Tâche » avec « ! » et « ? » rouge : « Participez à des ventes aux enchères de San Antonio niveaux et gagnez 3,500 de dollars (1,514/3,500) », le compteur en jaune.
- **Bas droite** : voiture blanche avec « S » rouge, minuteur « 1d 00:00:00 » (figé).
- **Barre d'onglets** (bois) : Ville (actif, fond jaune, carte pliée) · boutique (étal rouge, point rouge) · Rôle (carte violette) · corporation (blason violet) · Métropole (immeubles roses, **cadenas**) · **enchères** (gros marteau doré, débordant vers le haut, avec un petit badge de presse-papiers).
- **Bâtiments vus** : Musée, Entrepôt, Prêteur sur gages (enseigne « PAWN SHOP » dorée, « ! » rouge), Serrurier (clé dorée géante), Magasin de voitures (« MINI »), Institut d'expertise, Atelier de réparation (clé à molette géante), Marché commercial, immeubles d'appartements (icône hexagonale, 0/5, 0/7), « Métropole » dans le brouillard. Des piétons animés marchent sur les trottoirs.
- On navigue en **faisant glisser** la carte ; un toucher sur un bâtiment ouvre sa scène sans transition visible.

### 2.2 Prêteur sur gages (« Magasin de prêteurs sur gages »)
- **En-tête** : icône carrée (registre « ¥ » + personne), titre blanc, à droite un portrait rond « Manager » (femme à lunettes de soleil roses). En dessous : lingots 298 [+] et billets [+]. **La barre d'énergie n'apparaît pas dans les bâtiments.**
- La vendeuse rousse (loupe en main, collier de perles, tailleur bleu) se tient derrière un comptoir. Elle **cligne des yeux** de temps en temps.
- **Grille 2 colonnes × 4 rangées qui défile** : la rangée du haut porte deux emplacements « ★ VIP » (réservés aux VIP), puis viennent 6 emplacements normaux.
- **Un emplacement vide** affiche un carré doré « + », un point rouge et « Ajouter des produits ».
- **Un emplacement en attente** affiche « Première offre ⏱ hh:mm:ss » (vert), l'objet en 3D, « N (lingot) Accélérer » (jaune) et « (clap) 01:00:00 ↓ » (vert).
- **Un emplacement avec une offre** affiche le portrait du client, la bulle « Je veux acheter! » avec une liasse, et le bouton vert « Voir l'offre » avec un point rouge.
- **Bas** : « Client » (silhouette, point rouge s'il y a des clients) et ↩.

### 2.3 Entrepôt : deux modes
- **Mode complet** (ouvert depuis la ville) : maison « Entrepôt », « [ 42/51 ] » (42 en orange), **corbeille** ronde, Manager (homme à casquette verte et lunettes de soleil). En bas : « **Magasin d'accessoires** » (coffret violet), gros bouton jaune « **Mettre à jour** », ↩.
- **Mode sélection** (ouvert depuis un « + ») : pas de corbeille, pas de « Mettre à jour ». Il peut s'ouvrir sur l'onglet « identification » si l'on vient de l'Institut.
- **Onglets** : tous / identification / réparation / appui. L'onglet actif est jaune ; « appui » est grisé.
- **Cartes** sur 3 colonnes, triées par prix décroissant :
  - en haut à gauche, une icône de catégorie : colonne antique (antiquités), engrenage (technique), t-shirt (bijoux et mode), manette (armes et jouets), canapé (mobilier), ballon (sport) ;
  - en haut à droite, une icône d'état : **loupe** = à identifier, **clé et tournevis** = à réparer, **médaille dorée** = authentique (stèle), **médaille grise** = [?] (Laissez-passer Or) ;
  - le nom, puis une barre « $ prix ».
- **Couleur de fond** : orange = Légendaire (ornement, casque), **rouge = « épopée »** (urne, stèle), violet = rareté inférieure [?].
- **Bouton flottant** « Plus de capacité » (cadeau vert et rouge), en bas à droite de la grille.
- **Objets vus** (prix) : Stèles d'inscription égyptiennes anciennes 7,250 · Moniteurs vitaux 1,210 · bague diamant 3 carats 648 · Porcelaine colorée de l'année du Tigre 619 · …du Dragon 612 · Lampe de table classique 594 · Ornements de bête en bronze 573 · Kayak professionnel 516 · Flacon boule rose rose 499 · Lingot d'argent 489 · Laissez-passer Or 486 · Graphisme 480 · M1911 480 · Meuleuse d'angle 462 · Figurine Hatsune Miku 456 · Téléviseur incurvé ultra-clair, Chaises en cristal, épée spartiate, lance [prix masqués].

### 2.4 Popup de mise en vente (depuis l'entrepôt)
- Bandeau orange avec le nom et ✕ ; vignette de rareté (avec loupe ou médaille) ; prix orange ; icône de catégorie + rareté ; « Première offre ⏱ ».
- **Texte selon l'état de l'objet** :
  - « Objets à expertiser : Si expertisés comme authentiques, la valeur de l'objet augmente. » avec une flèche « › » qui renvoie vers l'expertise ;
  - « Objets authentiques : Peuvent être placés dans un musée ou vendus directement. »
- **Boutons** : « Commencer à vendre » (jaune) et pub verte « (clap) durée ↓ ». La durée de la pub vaut **la moitié** de l'attente (00:57:00 pour 01:54:00 ; 01:54:00 pour 03:48:00). Sur l'étagère, en revanche, la pub vaut toujours −01:00:00.
- **L'attente grandit avec la valeur** : $573 → 1 h 54 ; $7,250 → 3 h 48.
- **Le prix d'accélération en lingots aussi** : 5 contre 11.
- Une **bannière VIP** sous la popup vante « pubs ignorées en illimité ».

### 2.5 Popup d'offre client (vente)
Elle est décrite au §1 (urne, casque). Ce que la minute apprend : le minuteur « Prochaine offre » varie selon l'objet (02:29 contre 00:49), et le coût en lingots de « Nouvelle offre » aussi (8 contre 2).

### 2.6 « Client » et « Obtenez le meilleur prix » (achat)
- **Popup « Client »** : compteur « (silhouette) n/2 » ; les clients en attente sont empilés en profondeur ; l'objet est posé sur un plateau en bois.
- **Négociation** :
  - le portrait du client avec un **halo coloré selon l'humeur** (vert, puis rouge) ;
  - une bulle grise « Hé. Je veux vendre à X. » ;
  - le nom de l'objet entre des chevrons, et sa vignette de rareté (vert = commun ? [?], rouge = épopée) ;
  - l'humeur : ♥ + mot (« calme », « se mettre en colère ») + petite jauge ;
  - une plaque « $X Votre citation » ;
  - un curseur orange avec « − » et « + » ;
  - les boutons « franchir » (bleu, passer) et « offre » (jaune).
- **Révélation de l'achat** : voir la chronologie de 1:25.5 à 1:26.75.

### 2.7 « pas de clients »
« Client suivant : » + minuteur de 30 min dans un losange, « Vous pouvez désormais aussi amener un client ! », « Générer 1 client » contre **5 lingots**.

### 2.8 Institut d'expertise
Scène avec un rideau violet et des spots au plafond ; l'experte blonde en robe violette et gants noirs. Au centre, le plateau en métal avec « + » (point rouge). À gauche, un plateau verrouillé « Débloquer $3.99 » ; à droite, « Débloquer (lingot) 60 ». Un minuteur à **palettes mécaniques** « 00 : 00 ». Pendant une expertise s'ajoutent « Rapide 30 minutes » (pub) et « 6 (lingots) immédiatement! ».

### 2.9 Popup d'expertise (Kayak professionnel)
- La vignette porte un badge « ? ».
- Deux options : « Taux de Succès **40%** » (40 en vert) avec le bouton bleu « (billets) 304 Évaluation Standard », et « Taux de Succès **90%** » (90 en orange) avec le bouton jaune « (lingot) 3 Évaluation d'Expert ».
- Dessous : « ⓘ ASTUCE : Après une évaluation réussie, l'authenticité de l'objet sera déterminée. S'il est authentique, sa valeur augmentera considérablement ! »
- Tout en bas, une bannière « (soleil) Déverrouiller des skins de vanité augmente le taux de réussite de l'identification » avec « » ».
- **Prix** : la standard coûte **304 billets, soit ≈59 % de la valeur** de l'objet (516) ; l'expert coûte 3 lingots.

### 2.10 Serrurier
- L'homme à moustache, lunettes et gilet tient un coffre. Manager : homme à casquette et lunettes noires.
- **Grille 2 × 3** :
  - « **Location** » : chrono « −50% » et lingot « −50% » (en vert), avec un bouton vert pub « Location d'annonces » ;
  - deux coffres gagnés, « **Terminer** » (texte vert) : un **doré** et un **argenté**, chacun avec le bouton bleu « Ouvrir » ;
  - trois « Slot de coffre-fort » vides : « Participez à l'enchère pour obtenir un coffre-fort » ;
  - « Acheter une cellule » : cadenas + bouton jaune « **$1.99** ».
- **Ouverture** : le coffre est zoomé, secoué, puis l'objet est révélé sous les projecteurs avec son nom, sa rareté (« Pas commun ») et sa valeur (« Valeur $ 62 » + loupe). Le texte renvoie à l'Appraisal Academy, c'est-à-dire l'Institut.

---

## 3. Effets et « juice »

| Effet | Détails | Durée |
|---|---|---|
| Popups | Grossissement depuis le centre avec **léger dépassement** (rebond), sur un fond qui s'assombrit. La fermeture est instantanée. | 0,15 à 0,5 s |
| CONGRATULATIONS | Le titre et les filets apparaissent d'un coup. Ensuite viennent le sous-titre en fondu, puis les cartes en fondu, puis le ✓. Un faisceau doré tombe du haut et un losange de lumière tourne derrière les cartes. | ≈1 s pour l'entrée |
| Liasses et EXP qui volent | Une gerbe de plus de 30 liasses tournées au hasard part de l'emplacement vendu et monte vers le compteur de billets. Les livres EXP montent à gauche. Les particules **survivent au changement d'écran**. | ≈1,4 s |
| Compteur HUD | Il est crédité ou débité **immédiatement**, sans défilement des chiffres, avant même la fin de l'animation. | 0 s |
| Humeur du client | La bulle passe en texte rouge, le cœur et le halo passent du vert au rouge. | instantané |
| Révélation d'achat | Projecteurs en V, étincelles, halo au sol, puis les lignes valeur, paiement et bénéfice qui apparaissent une à une toutes les ≈0,3 s. Le **« $+515 » vert grossit puis revient** à sa taille. Titre « C'est le tien! ». | ≈1,1 s |
| Minuteur à palettes | Le passage de 00:00 à 59:59 se fait par basculement de palettes. | ≈0,2 s |
| Coffre-fort | Zoom, pause, **secousse** (glisse et s'incline à droite, puis à gauche), révélation avec projecteurs. Le titre et l'étiquette de rareté apparaissent en deux temps. | ≈2,5 s |
| Ambiance | La vendeuse cligne des yeux, des piétons marchent dans la ville, l'icône « Limitée » change d'illustration, les minuteurs tournent en direct partout. | — |
| Sons supposés | Fanfare sur CONGRATULATIONS ; bruissement de billets puis « ka-ching » quand les liasses arrivent au compteur ; grognement sur « J'ai payé 10,802! » ; roulement de tambour puis tintement sur « C'est le tien! » ; cliquetis métallique pendant la secousse du coffre. Ces sons sont **supposés** : la vidéo n'a pas été écoutée. | — |

---

## 4. Ce qui est nouveau par rapport à `BIDMASTER-VIDEO.md`

1. **Il y a deux sortes de clients.** Les **acheteurs** font une offre sur un objet exposé (« Je te donne… », +x %). Les **vendeurs** arrivent par une file « Client n/2 » et proposent leurs objets. Le résumé présentait « Obtenez le meilleur prix » comme une vente ; c'est en fait **un achat**, pour lequel « franchir » veut dire passer son tour.
2. **La négociation a une mécanique d'humeur.** Le client demande environ 3× la valeur. Une offre basse le fait passer de « calme » (vert) à « se mettre en colère » (rouge) avec une réplique (« J'ai payé 10,802! »). La même offre, refaite, a été acceptée. Le curseur descend sous les 5 923 cités dans le résumé (jusqu'à 5,078).
3. **Écran de révélation d'achat** « C'est le tien! » avec valeur / Paiement / « réaliser des bénéfices $+515 ».
4. **Le bonus caché de vente vaut environ +8,5 %** et la **Prime De Secrétaire environ 1 %** du prix ; chaque vente rapporte 5 EXP (+1 de la secrétaire).
5. **La mise en vente a ses propres règles.** On passe par l'entrepôt en mode sélection. L'attente de « Première offre » dépend de la valeur (1 h 54 ou 3 h 48), le coût d'accélération aussi (5 ou 11 lingots), et la pub vaut −50 % dans la popup mais −1 h sur l'étagère. Il existe **deux étagères réservées aux VIP**.
6. **Les statuts d'objet ont un effet.** « Objets à expertiser » contre « Objets authentiques » (ces derniers peuvent aller au musée ou être vendus directement). Une médaille dorée marque l'objet authentique.
7. **Couleurs de rareté corrigées** : orange = Légendaire, rouge = « épopée » (et non rouge = légendaire comme dans le résumé). « Pas commun » apparaît en bleu.
8. **Déroulé d'une expertise** : l'entrepôt s'ouvre sur l'onglet identification. L'option standard coûte 304 billets (≈59 % de la valeur) et dure 1 h, avec un minuteur à palettes, « Rapide 30 minutes » (pub) et « 6 lingots immédiatement ». La bannière « skins de vanité » augmente le taux de réussite.
9. **Ouverture des coffres au Serrurier**, avec coffres doré et argenté : la secousse, puis l'objet révélé avec sa rareté et sa valeur (Caméra de plongée, Pas commun, $62). L'emplacement « Location » donne −50 % de temps et −50 % de lingots via une pub.
10. **« pas de clients »** : le client suivant arrive dans 30 min, ou tout de suite contre 5 lingots (« Générer 1 client »).
11. **Entrepôt complet** : corbeille, « Magasin d'accessoires », « Plus de capacité ». Le compteur 43 puis 42/51 ne compte que les objets en stock : ceux qui sont exposés ou en expertise en sortent.
12. **HUD de la ville, détails absents du résumé** : un minuteur cadeau en mm:ss, un cochon-tirelire « 800 », une Tâche avec progression chiffrée (1,514/3,500), « quêtes secondaires », un événement « 1d 00:00:00 », et l'onglet Métropole verrouillé.

**Bilan d'argent sur la minute** :

| Moment | Billets |
|---|---|
| Départ | 14 710 |
| Vente de l'urne | 18 268 |
| Vente du casque | 19 857 |
| Achat de la stèle | 13 122 |
| Expertise du kayak | 12 818 |

Les lingots restent à 298 toute la minute.
