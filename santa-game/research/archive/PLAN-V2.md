# Plan V2 : un vrai « Township de Noël »

Retour du joueur (3 nov. 2026) :
- pas assez fluide ;
- graphismes en dessous des références ;
- on attend trop vite : il faut pouvoir jouer 2 à 3 h sans attendre, avec l'impression d'avancer ;
- « ça ne ressemble pas du tout à Township ».

## Décisions

1. **Rendu 2D isométrique, comme Township.**
   - Le monde n'est plus une scène 3D recalculée à chaque image. Il est composé d'**images (sprites) pré-rendues** une seule fois au chargement, à partir des modèles 3D (caméra orthographique fixe, angle isométrique 2:1), avec un éclairage soigné.
   - Ensuite on ne fait que poser des images sur un canvas 2D. C'est très peu coûteux, donc fluide même sur un vieux téléphone, et toujours net.
   - Une case de la grille vaut 1 unité 3D (les modèles Kenney sont déjà sur une grille de 1).
   - Projection : `écranX = (x - y) * TW/2`, `écranY = (x + y) * TH/2`, avec `TH = TW/2`.
2. **Boucle de jeu de Township.**
   - **Champs** : on touche un champ, on choisit la graine, puis on glisse sur les champs pour planter. Une fois la culture mûre, on glisse la faucille pour récolter.
   - **Enclos** : on nourrit les animaux avec une culture, ils donnent un produit.
   - **Usines à file d'attente** : plusieurs recettes par usine, des emplacements de file, un bouton « récupérer ».
   - **Commandes du traîneau du facteur**, l'équivalent de l'hélicoptère de Township : un tableau de 9 commandes, chacune payée en pièces et XP, renouvelées en quelques secondes.
   - **Grange** : capacité limitée, agrandie avec des matériaux.
   - **Maisons** (population) et **bâtiments du village** (plafond de population). Les usines demandent de la population.
   - **Placement libre** des bâtiments par glisser-déposer, plus des **agrandissements** de terrain (neige ou forêt à dégager).
   - **Niveaux** : de l'XP sur chaque action, et un déblocage par niveau, comme le tableau de Township.
3. **Rythme : 2 à 3 h de jeu sans attendre.**
   - Minuteurs très courts au début : le blé pousse en 20 s, le pain sort en 30 s.
   - Toujours plusieurs choses en parallèle.
   - Montées de niveau fréquentes au début (toutes les 3 à 5 min), puis de plus en plus espacées.
4. **Ce qu'on garde de la V1** (branché sur la nouvelle boucle, étape 2) :
   - connexion quotidienne et série ;
   - événement du jour ;
   - boutique, étoiles et skins ;
   - guildes, classement et Grande Tournée ;
   - mini-jeux ;
   - calendrier de l'Avent ;
   - Pépin et le didacticiel.

## Étapes

- [x] **Étape 1 : cœur jouable.**
  - Moteur iso 2D.
  - Pré-rendu des sprites.
  - Champs, enclos, usines, commandes, grange, maisons.
  - Placement et agrandissements.
  - Niveaux 1 à 15.
  - Nouveau didacticiel.
- [ ] **Étape 2 : rebrancher les fonctions méta de la V1.**
- [ ] **Étape 3 :**
  - train du Pôle (matériaux) ;
  - visites de villages ;
  - finitions et effets (objets qui volent vers la grange, particules).

## Fichiers (V2)

| Fichier | Rôle |
|---|---|
| `js/v2/models.js` | Modèles procéduraux : champs, cultures, icônes (blé, outils, pièces) |
| `js/v2/bake.js` | Pré-rendu des modèles 3D en images |
| `js/v2/town.js` | Règles : cultures, recettes, commandes, niveaux, sauvegarde |
| `js/v2/main.js` | Boucle, interface, didacticiel |

La V2 est maintenant la page d’accueil (`index.html`). L’ancienne version 3D reste jouable sur `v1.html`.
