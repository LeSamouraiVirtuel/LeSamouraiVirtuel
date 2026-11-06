# Synthèse de l'étude des 20 jeux (novembre 2026)

## Ce qui a été réellement fait

20 fiches détaillées, une par jeu, dans ce dossier. Chacune a 9 sections : fiche, historique, fonctionnalités, boutique, interface, avis, bugs, à copier / à éviter, sources.

Chaque affirmation porte sa provenance :
- **[S]** : source écrite avec URL ;
- **[I]** : image regardée ;
- **[V]** : image tirée d'une vidéo.

Ce qui est introuvable est noté « non trouvé ».

| Groupe | Jeux | Captures regardées | Vidéos découpées image par image |
|---|---|---|---|
| Fermes et aventure | Township, Hay Day, FarmVille 2, Klondike, Family Island | 159 | 5 (bandes-annonces App Store et vidéos de joueurs sur Dailymotion, environ 280 images) |
| Stratégie | Clash of Clans, Boom Beach, Dragons of Atlantis, Rise of Kingdoms, Lords Mobile | 50 | 5 (aperçus App Store, 1 image/s) |
| Playrix, merge, puzzle | Gardenscapes, Homescapes, Merge Mansion, Travel Town, Royal Match | 60 | 2 (aperçus App Store, environ 60 images) |
| Divers et pubs TikTok | SimCity BuildIt, Pocket Camp, Monopoly GO, Bid Wars, genre « Kingdom Shot » | 118 | 8 (environ 390 images) |

**Limites, en toute honnêteté :**
- **YouTube et TikTok** bloquent les téléchargements automatiques (vérification anti-robot). Cette protection n'a pas été contournée, donc aucune longue vidéo de YouTube n'a été regardée.
- **Les vidéos utilisées** sont les aperçus officiels de l'App Store (environ 30 s chacune) et des vidéos de joueurs sur Dailymotion.
- **Reddit et Fandom** refusaient l'accès. Les avis cités viennent du flux public des avis App Store et de Google Play.
- **« Kingdom Shot »** : aucun jeu connu ne porte ce nom exact. Le genre (canon + portes multiplicatrices) a été étudié à travers Mob Control et Castle Busters. Le jeu au nom proche, *Kingshot*, montre dans ses pubs un jeu qui n'est pas le vrai.
- Les images (94 Mo) restent sur la machine de travail et ne sont pas envoyées dans le dépôt : seules les fiches texte le sont.

## Les règles qui reviennent dans presque tous les jeux

### Écran et plateformes
1. **Sur tablette et PC, l'interface garde sa taille.**
   - Les barres sont ancrées aux coins et les fenêtres restent centrées, à taille fixe. Seule la carte s'agrandit.
   - Sources : Township, Hay Day, Merge Mansion, Royal Match, Clash of Clans.
   - → **Fait en v75.**
2. **Interface à échelle réglable.**
   - En octobre 2026, la refonte de l'écran de Clash of Clans a provoqué des avis 1★ demandant « more scaling options ».
   - → À faire : un réglage « taille de l'interface ».
3. **Le jeu de base doit marcher hors ligne, avec une sauvegarde cloud liée au compte dès le départ.**
   - La perte de compte est un motif de 1★ récurrent dans les 20 jeux.
   - → Le service de travail (cache) est déjà là. Les comptes attendent la configuration Firebase.

### Ouverture d'un bâtiment, récolte, popups
4. **Récolte directe** : toucher la bulle récolte sans ouvrir de fenêtre (Township, Hay Day, Family Island). → Déjà fait.
5. **Deux écoles pour ouvrir un bâtiment :**
   - Clash of Clans affiche une barre d'actions (Info / Améliorer / Décor) ;
   - les jeux de ferme ouvrent une fiche.
   - → Nous gardons la fiche d'abord, comme tu l'as demandé, avec des boutons d'activité dedans.
6. **Un seul popup maximum à l'ouverture du jeu.**
   - Les rafales de popups (12 dans FarmVille 2, 9 à 10 offres par jour dans Family Island) sont la critique la plus fréquente.
   - → À vérifier chez nous : cadeau du jour, événement, histoire.
7. **Chaque récompense est un moment** :
   - l'objet est montré en grand avec un halo ;
   - les pièces jaillissent puis volent vers le compteur ;
   - le personnage prend une pose de joie.
   - → La fenêtre BRAVO est déjà dans ce style.
8. **Confirmation obligatoire avant de dépenser des étoiles** (dépenses accidentelles citées dans des avis 1★). → À vérifier sur tous les boutons étoiles.

### Économie et boutique
9. **Peu de monnaies (3 au plus), nombres abrégés.** SimCity en a 12, ce qui est critiqué. → Nous en avons beaucoup : à simplifier.
10. **Les outils d'extension (haches, scies) doivent avoir des sources régulières.** « Stingy with saws » revient souvent pour Hay Day. → Achat direct fait en v74. À ajouter : une source régulière.
11. **Skins de bâtiments clés comme produit phare** :
    - la fusée de Township ;
    - les styles en 3 pièces de Hay Day ;
    - les décors de Noël de Clash of Clans ;
    - le château bonhomme de neige de Lords Mobile.

    **Uniquement cosmétiques** : les skins à bonus de statistiques (Rise of Kingdoms, Lords Mobile) sont vus comme du « payer pour gagner ».
    → **Fait en v75** : Maison ×5, lutins ×5, Flocon ×7, sans aucun bonus.
12. **Packs exclusifs à durée limitée**, puis remis en vente plus tard. Une monnaie gagnée en jouant doit aussi permettre d'obtenir des skins. → **Fait** : pack de la semaine, et skins d'événement payés en flocons.
13. **Un pass à prix fixe** avec une piste gratuite riche, et un animal ou un skin exclusif qui reste après la saison. **Ne jamais réduire les récompenses d'une saison à l'autre** : c'est la première cause de colère dans les 5 jeux Playrix et merge.
14. **Aucune pub forcée.** Uniquement des pubs récompensées, et un achat « sans pub » qui coupe tout. C'est la critique n°1 de Bid Wars et de Mob Control.

### Publicité et bataille
15. **La pub doit montrer le vrai jeu.**
    - « Nothing like the ads » est le premier motif de 1★ pour Township, Klondike, Gardenscapes, Royal Match, Rise of Kingdoms, Lords Mobile et Kingshot.
    - L'autorité britannique de la publicité (ASA) a interdit des annonces de Playrix.
16. **Mode bataille façon pubs** : canon, portes ×2 / ×3 / ×100, parties de 1 à 2 minutes, bleu contre rouge, chiffres énormes. → Notre bataille contre les trolls en a déjà la base : à pousser plus loin (portes à grands chiffres, foule de boules).

### Ne pas casser les joueurs fidèles
17. **Ne jamais changer le village d'un joueur sans retour possible** (refontes de Family Island, SimCity et Clash of Clans en 2026). → Chez nous :
    - les réparations automatiques (bâtiments superposés, allées sous un bâtiment) déplacent sans rien supprimer d'acheté ;
    - la déco offerte retirée est remboursée à 0, la déco achetée à 50 %.
18. **Aucun objet d'événement invendable qui sature l'entrepôt** (crise Halloween 2026 de Hay Day).
19. **Coopératif plutôt que pillage punitif.** Avoir des messages d'équipe prédéfinis plutôt qu'un chat libre : Homescapes a coupé son chat au Royaume-Uni en 2026.

### Idées à reprendre
- **Commande → loupe → atelier qui fabrique l'objet manquant → retour à la commande** (Township, décembre 2025).
- **4 commandes visibles en permanence**, de difficulté variée, avec le portrait du demandeur et un bouton « GO » quand la commande est prête (Travel Town).
- **Mode placement** : village grisé, zone d'effet en couleur, gain affiché sur chaque maison (SimCity).
- **Collections en sets** avec cartes rares échangeables, taux affichés et garantie après X achats (Pocket Camp).
- **Avant/après spectaculaire** quand une étoile est dépensée (Playrix).
- **Des lutins qui travaillent pendant l'absence du joueur** (aides de Hay Day, castors de Family Island).

## Prochaines étapes proposées (par ordre)
1. Réglage « taille de l'interface » (petite, normale, grande).
2. Une seule fenêtre à l'ouverture du jeu, avec une file d'attente pour les autres.
3. Confirmation sur tous les achats en étoiles au-delà d'un seuil.
4. Bataille des trolls : portes à gros chiffres et foule de boules de neige, plus proche des pubs.
5. Commande → loupe → atelier.
6. Source régulière de haches et scies (coffre quotidien, Scierie de niveau élevé).
7. Moins de monnaies visibles (regrouper les matériaux rares).
