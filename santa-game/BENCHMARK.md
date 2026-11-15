# Étude des concurrents : Township, Hay Day, Clash of Clans

Synthèse de trois dossiers de recherche (novembre 2026) : wikis des jeux via leur API, blogs Supercell et Playrix, Deconstructor of Fun, PocketGamer.biz, GameRefinery, Udonis, Gamedeveloper, fiches App Store. Elle s'appuie aussi sur l'analyse de plus de 800 captures in-game (voir `STYLE.md`).

## 1. Histoire en bref

| | Township (Playrix) | Hay Day (Supercell) | Clash of Clans (Supercell) |
|---|---|---|---|
| Sortie mobile | 2012-2013 (Facebook en 2011) | 21 juin 2012 (soft launch Canada) | 2 août 2012 |
| Ajouts sociaux | Co-ops (2016), Regattas hebdo (2016), Teams (2025) | Quartiers (2014), Derby hebdo (2015) | Clans (2012), Guerres (2014), Clan Games (2017), Ligues (2018), Clan Capital (2022) |
| Pass de saison | Gold Pass 2019, Golden Ticket 2021, « X Pass » 2025 | Farm Pass (~2020) | Gold Pass avril 2019 (~27 M$ la 1re semaine), refonte mars 2026 |
| Fin 2026 | ~45 M$/mois, 2 pass + expédition + régate chaque mois, Christmas Pass v40 (oct. 2026) | Équipe de 50 personnes, MAU de nouveau en hausse, mises à jour saisonnières | HdV 18, modes Battle/Ranked, refonte de l'interface (8 oct. 2026) |

Les trois jeux ont plus de 13 ans et grandissent encore. Leur base est restée la même ; ils ajoutent chaque mois une couche sociale et des rendez-vous.

## 2. Ce qu'ils font tous au démarrage (et ce que nous faisons maintenant)

| Règle observée | Township | Hay Day | Clash of Clans | Le Village du Pôle |
|---|---|---|---|---|
| Écran de chargement illustré, logo, barre de progression, astuce | ✔ | ✔ | ✔ | ✔ astuces qui changent |
| **Pas de menu titre** : on entre directement dans la ville | ✔ | ✔ | ✔ | ✔ (le bouton « Jouer » est supprimé) |
| Ville de départ déjà en partie construite | ✔ | ✔ (ferme léguée par l'oncle) | ✔ | ✔ (le Père Noël prend sa retraite) |
| Un personnage guide qui parle (portrait + bulle) | Ernie | Mr. Wicker | conseillère | **Pépin** le lutin |
| Main ou flèche qui montre où toucher, reste bloqué | ✔ | ✔ | ✔ | ✔ voile sombre + anneau doré + main animée |
| Premier gain en quelques secondes | blé 2 min | blé 2 min | canon | bois de la scierie |
| Apprendre la monnaie premium tôt | — | — | ✔ (gemmes pour l'ouvrier) | ✔ finir le chantier avec une étoile |
| Tutoriel court (< 3 min) puis liberté | ✔ | ✔ | ~6 min (jugé trop long) | 8 étapes, ~1 min 30 |
| Objectifs toujours visibles | Task Board (3) | commandes | — | carte « Objectif » en bas |

**Écran de jeu (refonte Clash of Clans d'octobre 2026, HUD Township) :** profil et XP en haut à gauche, ressources en haut à droite, widgets d'événements en colonnes sur les côtés, gros boutons en bas, et des pastilles rouges qui s'effacent après la visite. Tout est appliqué (voir `STYLE.md`).

## 3. Leurs boucles de jeu

- **Township** : champs → nourriture → animaux → usines → commandes. Hélicoptère pour les commandes immédiates, train de 5 h qui rapporte les matériaux, avion qui laisse 15 h pour remplir ses caisses. Deux plafonds : la grange et la population.
- **Hay Day** : planter → récolter → transformer → vendre (camion, bateau, étal entre joueurs). Le silo et la grange sont limités et s'agrandissent avec des pièces rares. Un seul geste « glisser l'outil sur plusieurs cibles ». Rien n'est vendu pendant les premiers jours.
- **Clash of Clans** : collecteurs plafonnés → améliorations limitées par les **ouvriers** → hôtel de ville qui plafonne tout. Minuteurs de quelques secondes au début, de plusieurs jours ensuite. Le coût en gemmes pour finir est toujours affiché.

Le Village du Pôle reprend ces trois boucles : production, puis Atelier, puis lettres, puis emballage. Il a 2 lutins bâtisseurs, une Maison qui plafonne tout, et des minuteurs qui s'allongent.

## 4. Rétention (ce qui fait revenir chaque jour)

| Mécanique | Concurrents | Chez nous |
|---|---|---|
| Bonus quotidien + série | Ernie (Township), Daily Tasks + Stamp Cards (CoC 2026) | ✔ cycle de 7 jours + paliers de série |
| Événement avec énergie qui se recharge | Valley (Hay Day), événements (Township) | ✔ clochettes, 1 toutes les 20 min |
| Pass mensuel gratuit + premium | les 3 | ✔ Pass des Fêtes |
| Course d'équipe hebdomadaire | Regatta, Derby, Clan Games | ✔ Grande Tournée de guilde |
| Collection à long terme | Cartes (Township, 62 jours) | ✔ Album des cadeaux rares |
| Notifications seulement quand quelque chose est prêt | Hay Day | à faire (app native) |

## 5. Prochaines étapes inspirées de la recherche

1. **Bâtiments futurs visibles en ruines** dès le début (Township, Hay Day), à restaurer au bon niveau, avec un habitant qui le demande.
2. **Un déblocage par niveau** sur les niveaux 1 à 15, chacun présenté par Pépin (mini-tutoriel à la 1re ouverture).
3. **Toucher la barre d'XP** pour voir ce que débloque le niveau suivant (Township, 2017).
4. **Loupe sur une commande** qui amène au bâtiment concerné (Township, décembre 2025 ; Clash of Clans, 2026).
5. **Saisie du nom après la première victoire**, le plus tard possible : Clash of Clans a mesuré une perte de joueurs à cet écran.
6. **Rien à vendre les premiers jours**, première offre vers le niveau 8 (Hay Day).
7. **Retour des joueurs inactifs** : événement de bienvenue (Clash of Clans, mai 2026).
