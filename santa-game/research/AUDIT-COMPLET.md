# Audit complet — Le Village du Pôle (v78, 7 novembre 2026)

Sources de cet audit :
- tes captures (village niveau 13, colis bloqué, erreur Object.entries) ;
- les tests automatiques : 36 fenêtres sur 3 écrans, un robot qui touche tous les bâtiments, bataille, colis, tutoriel ;
- la lecture du code ;
- l'étude des 20 jeux (`research/jeux/SYNTHESE.md`).

Priorités :
- **P0** : casse le jeu ou fait perdre quelque chose ;
- **P1** : gêne visible et fréquente ;
- **P2** : amélioration.

## 1. Fiabilité (P0)
| Constat | Preuve | À faire |
|---|---|---|
| Deux bugs bloquants en 2 jours (colis bloqué en v76, erreur Object.entries en v76/77) sont passés à travers mes tests. | Tes captures | Une batterie de tests de non-régression lancée à chaque version : ouvrir un colis, réclamer chaque récompense, enchaîner deux fenêtres, finir un chantier, livrer une lettre, acheter un skin, faire une bataille. |
| La sauvegarde n'existe que sur le téléphone. Un effacement des données du navigateur fait tout perdre (c'est déjà arrivé). | `account.js` : FIREBASE_CONFIG est vide | Activer les comptes : il me faut la configuration Firebase. En attendant : rappel régulier « Exporter ma sauvegarde » et copie automatique de secours. |
| Les mises à jour arrivent pendant que tu joues. Le rechargement automatique au retour dans l'appli peut couper une action. | Rechargement après 2,5 s en arrière-plan | Recharger seulement depuis l'écran du village, jamais pendant une fenêtre ouverte. |
| Une erreur dans un bouton peut laisser une fenêtre bloquée. | Colis bloqué | Toute fenêtre doit avoir un ✕ qui marche toujours, et un délai de secours de 5 s. |

## 2. Économie (P0-P1)
| Constat | Preuve | À faire |
|---|---|---|
| Tu as 382k de bois, 369k de biscuits et 384k de tissu, mais seulement 6,2k pièces : les ressources débordent, les pièces bloquent tout. | Ta capture | Ajouter des débouchés pour le surplus : convertir au Marché en pièces, grosses commandes du Nord, « dons au village » qui rapportent XP et pièces. Revoir le coût en pièces des améliorations. |
| 9,1k étoiles d'or (achats simulés) : tout devient gratuit, le jeu perd son enjeu. | Ta capture | Rien à changer côté jeu : c'est le mode test. Mais nos essais d'équilibrage doivent se faire sans achats. |
| Flocon : 769 / 20,2 M d'XP et des repas à +2,4 M. Les chiffres sont absurdes. | Capture du renne | Courbe d'XP plus douce (×1,32 par niveau, c'est trop) et des gains à l'échelle. |
| L'Écurie au niveau 3→4 n'apporte rien de visible (1→1 équipe, 2→2 destinations). | Capture de l'Écurie | Chaque niveau doit montrer au moins un gain. |

## 3. Écran principal (P1)
| Constat | Preuve | À faire |
|---|---|---|
| 9 boutons ronds sur les côtés, plus des pastilles partout (15 sur Village, 6 sur Jeux) : trop chargé. | Tes captures | Garder 3 boutons de chaque côté, les autres dans un menu « Plus ». Pastilles seulement pour ce qui est réclamable tout de suite. |
| La carte de quête recouvre le village et les boutons sur petit écran. | Captures SE et paysage | La rendre repliable, en une seule ligne quand elle est repliée. |
| Les panneaux de zone (« NIV. 30 », « À VENDRE », noms) chevauchent la barre du haut. | Ta capture (NIV.30 sous les ressources) | Masquer les panneaux qui passent sous l'interface, comme les étiquettes des bâtiments. |
| Les bulles de récolte (MAX, cristaux, cadeau) sont parfois loin de leur bâtiment ou à moitié cachées. | Ta capture | Bulle centrée au-dessus du toit, et repoussée si elle sort de l'écran. |

## 4. Progression et contenu (P1)
| Constat | À faire |
|---|---|
| Chapitre 2 « Construis l'Atelier » puis « Fabrique 2 trains » : les quêtes d'histoire avancent lentement par rapport au niveau 13. | Rattraper automatiquement les quêtes déjà remplies, et donner plusieurs objectifs en parallèle (3 tâches visibles). |
| Les lettres (commandes) sont le cœur du jeu mais sont cachées derrière un bouton. | 4 lettres toujours visibles dans un panneau du Bureau sur la carte (comme Travel Town et Township). |
| Mini-jeux : Tour de cadeaux et Tournée de Noël, ils restent peu nombreux. | Un 3e mini-jeu, et des défis quotidiens sur les mini-jeux. |
| Bataille : elle ressemble aux pubs, mais reste courte. | Plus de types de portails (+10, ×2 mobiles, portails piégés −5), boss de fin de chapitre, et une vraie carte de campagne. |

## 5. Graphismes et animations (P1-P2)
| Constat | À faire |
|---|---|
| L'Écurie n'a pas de vrai bâtiment (barrières et traîneau seulement). | Vrai bâtiment : grange avec toit et box des rennes. |
| Flocon n'apparaît pas dans le village. | Flocon qui se promène près de l'Écurie, avec son skin. |
| Les lutins ne font que marcher. | Petites actions : porter du bois à la Scierie, s'arrêter devant un bâtiment, faire coucou. |
| Aucun avant/après quand un bâtiment change d'apparence. | Petite cinématique : rideau de neige, puis nouveau bâtiment, puis feu d'artifice. |

## 6. Plateformes et performances (P1-P2)
| Constat | Preuve | À faire |
|---|---|---|
| Les premières images téléchargées pèsent environ 3 Mo (106 images chargées tout de suite, sur 587). | `pack.json` | Une seule « planche » d'images au lieu de 106 fichiers : le chargement est plus rapide avec une connexion faible. |
| Le pack complet pèse 7 Mo depuis l'ajout des skins. | — | Skins déjà chargés seulement à la demande : c'est bon. Surveiller le poids. |
| PC : on peut zoomer à la molette, mais il n'y a pas de raccourcis clavier. | Code | Échap ferme la fenêtre ; les flèches et ZQSD déplacent la carte. |
| Il n'existe pas de mode « économie de batterie ». | — | Réglage « Animations réduites », qui coupe la neige, la fumée et le bob des lutins. |

## 7. Boutique et éthique (P2)
- **Déjà bien** :
  - les taux des colis sont affichés ;
  - il n'y a pas de pub forcée ;
  - les skins sont purement cosmétiques ;
  - une confirmation est demandée avant de dépenser des étoiles.
- **À faire** :
  - un plafond de dépenses visible ;
  - un historique des achats ;
  - l'option « Restaurer les achats » (obligatoire sur l'App Store) ;
  - un vrai paiement (Apple / Google) pour une sortie sur les stores.

## 8. Technique (P2)
- `main.js` fait 2 400 lignes : le découper en modules (fenêtres, carte, boutique, bataille). Ça réduira les bugs croisés comme celui des colis.
- Les outils de fabrication des images sont maintenant dans le dépôt :
  - `tools/repack-all.sh` ;
  - `tools/repack-skins.sh` ;
  - `export-walk` et `export-skins`.
- Il manque des tests automatiques dans le dépôt : y mettre les scripts Playwright (tutoriel, audit des textes, colis, bataille).

## Ordre conseillé
1. Batterie de tests de non-régression (P0) et fenêtres qui ne peuvent plus se bloquer.
2. Rechargement automatique seulement au calme (P0).
3. Économie : débouchés pour le surplus de ressources, et courbe d'XP de Flocon (P0-P1).
4. Écran principal désencombré : menu « Plus » et quête repliable (P1).
5. 4 lettres visibles sur la carte (P1).
6. Vrai bâtiment de l'Écurie et Flocon dans le village (P1).
7. Comptes Firebase dès que tu m'envoies la configuration.
