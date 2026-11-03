# Le Village du Pôle — Deviens le Père Noël

Jeu mobile de construction de village en 3D, du même genre que les jeux de gestion qu'on voit dans les pubs mobiles. Il tourne dans le navigateur du téléphone avec Three.js et peut être packagé en application avec Capacitor.

## Lancer le jeu

Les modules JavaScript et les modèles 3D doivent être servis par un serveur web (ouvrir le fichier directement ne marche pas) :

```bash
cd santa-game
npx serve .          # puis ouvre l'adresse affichée (depuis le téléphone : même Wi-Fi, IP de l'ordi)
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Interface : HUD, panneaux, écran titre, styles |
| `js/main.js` | Boucle de jeu, caméra, personnages, interactions, icônes 3D |
| `js/game.js` | Règles : bâtiments, coûts, production, quêtes, sauvegarde |
| `js/buildings.js` | Modèles des bâtiments par niveau (3 paliers + décorations) |
| `js/world.js` | Terrain en terrasses, forêt, place du village, lumières, nuages |
| `js/assets.js` | Chargement des modèles, recoloration du Père Noël et des lutins |
| `assets/*.glb` | Modèles 3D compressés (générés par `tools/build-assets.mjs`) |

## Le jeu

- Tu commences en lutin au pied de la montagne. Ton personnage change avec le niveau de la Maison du Père Noël : le manteau passe du vert au rouge, la barbe devient blanche, et il gagne le bonnet au niveau 6.
- 7 bâtiments avec 10 niveaux chacun. L'apparence change par palier : socle en bois, puis en pierre, puis en pierre et or, avec un bâtiment plus grand et des décorations ajoutées à chaque niveau.
- Chaque bâtiment a ses animations : roue de la scierie, train de jouets de l'atelier, lettres qui volent au-dessus du bureau de poste, rennes, cookie géant, fumée des cheminées.
- Des lutins se promènent dans le village et vont travailler sur les chantiers en cours.
- 4 terrasses sur la montagne, cachées sous les nuages jusqu'à ce qu'elles soient débloquées (Maison niveaux 2, 4 et 6).
- Le traîneau part en tournée avec les cadeaux et rapporte des pièces et des étoiles.
- 13 objectifs servent de tutoriel. La production continue hors ligne (jusqu'à 8 h) et la partie est sauvegardée automatiquement.

**Contrôles** : glisser pour se déplacer, pincer ou molette pour zoomer, toucher une bulle pour récolter, toucher un bâtiment ou un « + » pour ouvrir sa fiche, toucher le Père Noël pour le saluer.

## Modèles 3D et licences

Tous les modèles viennent de packs **CC0** (domaine public, usage commercial libre) :

- [Kenney](https://kenney.nl) : Holiday Kit, Fantasy Town Kit
- [KayKit par Kay Lousberg](https://kaylousberg.com) : Holiday, Resource Bits, Adventurers (personnages et animations)

Pour regénérer les `.glb` à partir des packs d'origine (miroir : `github.com/series-ai/jam-ready-assets`) :

```bash
cd santa-game/tools && npm i
node build-assets.mjs /chemin/vers/jam-ready-assets ../assets
```

## Prochaines étapes

- Packager en app iOS/Android avec Capacitor.
- Musique et vrais effets sonores.
- Événements quotidiens, coffres, rennes à collectionner.
- Bande-annonce et pubs vidéo avec Remotion ou HyperFrames, à partir de captures du jeu.
