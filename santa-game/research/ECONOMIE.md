# Économie : farmer a un sens, la fin est très loin

Objectif : monter de niveau ne suffit pas. Les gros chantiers demandent des ressources qu'il faut aller chercher, avec des activités différentes et du hasard (comme Bid Master). Une monnaie rare, chère à gagner, permet d'accélérer.

## 1. Quatre étages de ressources

| Étage | Ressources | Comment les obtenir | Plafond | À quoi elles servent |
|---|---|---|---|---|
| 1 | Pièces, bois, biscuits, tissu | Bâtiments de production (bulles à toucher, gardiens) ; lettres des enfants | Stock (Maison et Entrepôts), sauf pièces | Tout ; les pièces deviennent le nerf des gros chantiers (coût × 1 + (niv./6)²) |
| 2 | Cristaux de glace | Grotte aux cristaux, colis rares et plus | Aucun | Tous les bâtiments à partir du niveau 6 (Maison × 3) |
| 3 | Lingots d'or polaire | Grotte (étage 3 et plus), colis épiques et légendaires | Aucun | Tous les bâtiments à partir du niveau 11 (Maison × 3) |
| 4 | Étoiles d'or (monnaie rare) | Niveaux, tâches, album, colis légendaires, calendrier ; achat | Aucun | Accélérer, remplir les pioches, rappeler les rennes, engager des bâtisseurs |

## 2. Activités

- **Grotte aux cristaux** (Maison niv. 5). Pioches qui se rechargent (6 + niv./2 au maximum, une toutes les 45 − 2 × niv. minutes, au moins 15). On creuse une grille de 5 × 5 cases. Chaque case cache au hasard des cristaux, des pièces, une ressource, un lingot (étage 3 et plus), un colis mystère, 2 pioches, ou rien. Une case cache l'escalier : on descend à l'étage suivant, plus riche (gains × √étage). Remplir les pioches coûte 6 étoiles.
- **Expéditions des rennes** (Écurie). Quatre destinations, inspirées des lieux d'enchères de Bid Master :

  | Destination | Durée | Colis | Commun / rare / épique / légendaire | Écurie |
  |---|---|---|---|---|
  | Forêt des Murmures | 1 h | 1 | 75 / 22 / 3 / 0 % | niv. 1 |
  | Col du Blizzard | 4 h | 1 | 50 / 38 / 11 / 1 % | niv. 3 |
  | Aurores Boréales | 8 h | 2 | 35 / 42 / 20 / 3 % | niv. 6 |
  | Phare du Nord | 12 h | 2 | 20 / 42 / 31 / 7 % | niv. 10 |

  Le voyage coûte des biscuits (nourriture des rennes), de plus en plus avec le niveau. On envoie jusqu'à 3 équipes en même temps.
- **Colis mystère** : quatre raretés aux couleurs de Bid Master (gris, bleu, violet, orange). On les ouvre un par un, avec une animation. Le contenu est tiré au hasard à l'ouverture : pièces et une ressource toujours, cristaux à partir de rare, lingots à partir d'épique, 1 à 2 étoiles en légendaire (8 % de chances d'une étoile en épique), parfois une hache ou une scie.
- **Illuminations du village** (Maison niv. 4). Elles jouent le rôle des remparts de Clash of Clans : ni bâtisseur ni attente, un prix qui monte de 32 % par niveau, et +1 % de production pour tout le village à chaque niveau. C'est un puits sans fin : le surplus a toujours un usage.
- Toujours là : lettres et atelier, mini-jeux de l'Écurie, album, calendrier de l'Avent, cadeau du jour.

## 3. Monnaie rare

- Le coût pour accélérer suit celui des gemmes de Clash of Clans : 1 min = 1, 1 h = 20, 1 jour = 260, 1 semaine = 1 000 (les 3 dernières minutes sont gratuites).
- Bâtisseurs 3, 4 et 5 : 250, 500 et 1 000 étoiles.
- Boutique : 80 étoiles à 1,99 €, puis 500 / 1 200 / 2 500 / 6 500 jusqu'à 99,99 €. Le paiement sera branché avec la version App Store ; aucun paiement n'est collecté pour l'instant.
- Gains gratuits mesurés par le simulateur : environ 1,7 étoile par jour pour un joueur assidu (3 sessions de 10 min). Le 3ᵉ bâtisseur arrive vers le jour 140 sans payer.

## 4. Ce que dit le simulateur (`node tools/simulate.mjs 150`)

- Niveaux : 10 en 9 h, 20 à J6, 30 à J20, 40 à J49, 50 à J96, 57 à J150.
- Maison : niv. 10 à J9, 15 à J27, 20 à J63, 24 à J150. Le niveau 25 n'est pas atteint en 5 mois.
- Pendant les sessions, la Maison attend surtout des **pièces** (≈ 34 h) et des **cristaux** (≈ 30 h) : la ferme compte vraiment.
- Les autres bâtiments attendent surtout un bâtisseur libre (comme Clash of Clans). C'est là que les bâtisseurs en étoiles prennent leur valeur.
- Au bout de 150 jours, le simulateur a ouvert environ 1 600 colis (350 communs, 690 rares, 470 épiques, 90 légendaires), atteint l'étage 426 de la grotte et le niveau 31 des illuminations.
