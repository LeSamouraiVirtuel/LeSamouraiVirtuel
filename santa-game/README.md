# Le Village du Pôle — Deviens le Père Noël

Prototype jouable d'un jeu mobile de construction de village (genre « base-builder » des pubs mobiles), en 3D low-poly avec Three.js.

## Jouer

Ouvre `index.html` dans un navigateur (téléphone ou ordinateur). Aucun build n'est nécessaire : Three.js est chargé depuis jsDelivr.

Pour tester sur téléphone en local :

```bash
cd santa-game
npx serve .        # puis ouvre l'adresse IP affichée depuis le téléphone (même Wi-Fi)
```

## Le jeu

Tu commences comme petit lutin au pied de la montagne. En développant le village tu montes en rang jusqu'à devenir le Père Noël, et ton personnage change d'apparence (manteau vert → rouge, barbe, ventre).

**Ressources** : 🪙 pièces, 🪵 bois, 🍪 biscuits, 🎁 cadeaux, ⭐ esprit de Noël (score).

| Bâtiment | Rôle | Débloqué |
|---|---|---|
| Maison du Père Noël | Bâtiment principal : limite le niveau des autres, augmente le stock, débloque les terrains | Départ |
| Scierie | Produit du bois | Départ |
| Bureau des lettres | Produit des pièces | Départ |
| Four à biscuits | Produit des biscuits | Maison niv. 1 |
| Atelier des lutins | Produit des cadeaux | Maison niv. 2 |
| Entrepôt | Augmente le stock max | Maison niv. 2 |
| Écurie des rennes | Débloque le traîneau, augmente les cadeaux par tournée | Maison niv. 3 |

- 10 niveaux par bâtiment, avec un coût ×1,65, une production ×1,45 et une durée de chantier ×1,55 par niveau.
- 2 lutins bâtisseurs, donc 2 chantiers en même temps. Un chantier peut être accéléré avec des pièces.
- 4 terrasses sur la montagne : Camp du bas (niv. 1), Pentes enneigées (niv. 3), Forêt des sapins (niv. 5), Sommet du Pôle (niv. 7).
- La tournée en traîneau échange les cadeaux contre des pièces et des ⭐.
- 13 objectifs guidés servent de tutoriel.
- La production continue hors ligne (jusqu'à 8 h). La partie est sauvegardée automatiquement dans le navigateur.

**Contrôles** : glisser pour se déplacer, pincer (ou molette) pour zoomer, toucher une bulle pour récolter, toucher un bâtiment ou un « + » pour ouvrir sa fiche.

## Équilibrage

Tous les chiffres sont en haut du script, dans `TYPES`, `QUESTS`, `ZONES` et les fonctions `rate`, `costOf`, `timeOf` et `storeCap`.

## Prochaines étapes possibles

- Packager en vraie app iOS/Android avec Capacitor (le code web reste le même).
- Remplacer les modèles en primitives par des modèles glTF (Blender, ou générés par IA puis retouchés).
- Musique et effets sonores, événements quotidiens, coffres, rennes à collectionner.
- Bande-annonce et pubs vidéo avec Remotion ou HyperFrames.
