# Bid Master : synthèse de l'analyse image par image (6 min 52)

Méthode : 1 647 images (une tous les quarts de seconde), 491 changements d'écran capturés en pleine résolution, extractions à 10-30 i/s sur les animations. Analyse détaillée minute par minute dans `bidmaster-m0.md` à `bidmaster-m6.md`.

Limites : la vidéo n'a pas de son et ne montre jamais les doigts. Chaque toucher est déduit de la réaction de l'écran ; les points incertains sont marqués [?] dans les fichiers.

## 1. Corrections de la première analyse (BIDMASTER-VIDEO.md)

| Première analyse | En réalité |
|---|---|
| « Obtenez le meilleur prix » = vente | C'est un **achat** : un client vient vendre un objet, le joueur négocie à la baisse (file « Client 2/2 »). |
| Rouge = légendaire | **Orange = légendaire**, rouge = épique (« épopée »), violet = rare, etc. |
| Outils d'enchère : loupe, bombe, calculatrice | **Botte** (chasse un rival, 3 pour 2 lingots), **tomate** (l'empêche d'enchérir, 9 pour 2 lingots) et **calculatrice** (fourchette de prix). La loupe sert à la phase d'**estimation**, avant l'enchère. |
| Carte des enchères : Washington | Au moins 3 régions : Washington (1-5), Californie (6-10), Texas (11-13). Le joueur est au Texas, à San Antonio (13). |
| Réparation : valeur ×1,5 | **+25 %** de valeur. |
| Casino : 2 jeux | **4 jeux** (roue, machine à sous, blackjack, dés), chacun limité à 10 essais par jour. |
| Restaurant : jeu de fusion | Une cloche génère des ingrédients (stock de 20 qui se recharge). La commande servie rapporte de l'**énergie** (+20). |
| Pub VIP au milieu de l'enchère | La **boutique complète** (4 onglets) ; l'enchère semble en pause pendant ce temps. |
| 0:00 à 0:59 : un seul lancement | Le jeu est **lancé deux fois** : le joueur fuit une pub, le jeu redémarre à froid et ne réaffiche que l'offre pick-up. |

## 2. Mécaniques chiffrées (vérifiées sur plusieurs occurrences)

- **Bonus caché d'environ +8,5 %** sur les gains en billets, jamais expliqué à l'écran : 900 → 976, offre de 4 255 → 4 616 encaissés, 3 849 → 4 176. La source est peut-être le VIP ou le titre du joueur [?].
- **Prime de secrétaire** : environ 1 % de chaque gain, avec un minimum de 1 par ressource. Elle s'applique partout (ventes, quêtes, mine, coffres, garage, connexion). Chaque vente donne aussi 5 EXP.
- **Enchère** (objet d'une valeur de 16 800) :
  - mise de départ = 60 % de la valeur ; pas fixe = 1/24 de la valeur (+700) ;
  - fourchette de la calculatrice = 80 à 120 % de la valeur ;
  - les rivaux répondent 1,25 à 1,75 s après chaque demande ;
  - quand plus personne n'enchérit : 2 s, puis « 1ère fois », 3 s, « 2ème fois », 3 s, puis le marteau et « Vendu ! », soit environ 8 s sans enchère ; toute enchère remet le compte à zéro ;
  - le joueur ne peut pas surenchérir sur lui-même (ses boutons passent au gris).
- **Négociation d'achat** : le client demande environ 3 fois la valeur. Une offre trop basse le fait passer de « calme » (vert) à « en colère » (rouge). Écran final « C'est le tien ! » avec valeur, paiement et bénéfice.
- **Prêteur** : l'attente de la première offre grandit avec la valeur (1 h 54 pour $573, 3 h 48 pour $7 250). On peut accélérer avec 5 à 11 lingots, ou une pub. Une « Nouvelle offre » coûte 4 à 8 lingots. Deux étagères sont réservées au VIP.
- **Expertise** : environ 1 h, option standard à environ 59 % de la valeur de l'objet en billets (40 % de réussite) ou 3 lingots (90 %). Une pub retire 30 min.
- **Lieu d'enchère** : entrée à 10 d'énergie (5 avec une pub), objectif du lieu (par exemple 3 191/6 000), 4 objets de chasse au trésor à trouver, récompenses en lingots et billets.
- **Voiture** : capacité 4 objets après l'enchère, retour en 13 s, accélérable pour 1 lingot.
- **Garage souterrain** : revenu passif plafonné à 24 h (2,59 lingots, 2 000 billets et 12 EXP par jour).
- **Mine d'or** : mise de 2 lingots, un halo saute entre 8 cases pendant environ 5,5 s (+20 % à +500 %), 20 essais par jour.
- **Monopoly** : 1 lancer gratuit toutes les 10 min (20 au maximum), location de case pour 5 loyers, dé doré à face choisie, boutique d'échange.
- **Connexion** : calendrier de 28 jours ; un jour manqué se rattrape pour 1 lingot.
- **Guilde** : chaque quête quotidienne rapporte +10 points à la guilde ; Ligue des guildes par saisons.
- **Managers** : recrutés par tirage (x1 = 2 lingots, x10 = 18, manager orange garanti au 10ᵉ) ; raretés de 3 à 5 étoiles ; « Administrateur de la collection 11/32 ».
- **Chapitres** : « Tâche du Chapitre 26 », 4 tâches qui couvrent toutes les boucles du jeu, avec la devise « être l'homme le plus riche du monde ».

## 3. Effets et rythme

- **Popups** : elles s'ouvrent en grossissant avec un dépassement (≈1,05 puis 1,0 en 0,2 à 0,3 s) et se ferment d'un coup, sans fondu.
- **CONGRATULATIONS** : il s'assemble en ≈1 s (faisceau doré, titre, sous-titre, grandes cartes, bande « Prime De Secrétaire », bouton ✓). On en voit 5 rien que dans la minute 3.
- **Compteurs** : ils sautent tout de suite au nouveau total, puis 30 à 40 liasses volent vers le compteur pendant 1,2 à 1,5 s. C'est purement décoratif et ça ne bloque jamais le joueur ; les pluies continuent même par-dessus les changements d'écran.
- **Cinématique avant l'enchère** (≈5 s) : la voiture arrive, les rivaux aussi, le cadenas est coupé à la pince, la porte se lève et l'objet apparaît en « $????? ».
- **Bilan de l'enchère** : le joueur touche l'objet, la valeur estimée s'affiche avec un compteur et des confettis, puis le gain apparaît en vert et grossit.
- **Ordre des popups au lancement** : connexion, puis offre, puis événements.

## 4. Ce qu'on reprend pour le village du Père Noël

1. **Tournée des traîneaux perdus** (les enchères), à l'identique dans sa structure :
   - cinématique d'arrivée, puis phase d'estimation avec la loupe, puis enchère contre 4 à 6 lutins rivaux qui ont chacun leur caractère et leurs répliques ;
   - mise de départ à 60 % de la valeur, pas de 1/24, clôture « 1ère fois, 2ème fois, Vendu ! » en environ 8 s ;
   - outils : boule de neige (chasse un rival), sucre d'orge collant (le bloque), calculatrice de la Mère Noël (fourchette).
2. **Chargement dans le traîneau** (capacité limitée, améliorable), puis retour au village.
3. **Bureau d'expertise des lutins** et **Atelier de réparation** (+25 %), avec un minuteur. Un échec ne détruit jamais l'objet.
4. **Bureau du traîneau, deux sens** :
   - des enfants veulent acheter, avec des offres qui arrivent au fil du temps ;
   - des marchands viennent vendre, avec une négociation où leur humeur évolue.
5. **Écran « Bravo ! »** à l'identique : assemblage en 1 s, grandes cartes, bonus du lutin assistant (≈1 %), puis les gains qui volent.
6. **Carte du Pôle Nord** : régions et étapes numérotées, objectif par lieu, objets de chasse au trésor.
7. **Revenus passifs plafonnés** (garage → écurie des rennes, 24 h maximum).
8. **Chapitres de 4 tâches** qui font tourner toutes les boucles.

**Ce qu'on ne copie pas** : le bonus caché (on affiche tout), les pubs à chaque étape, la boutique au milieu d'une action, les tirages au sort payants et la destruction d'objets.
