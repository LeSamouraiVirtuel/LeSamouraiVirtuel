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
| `js/main.js` | Boucle de jeu, caméra, personnages, interactions, panneaux, icônes 3D |
| `js/minigames.js` | Mini-jeux (traîneau, boules de neige) |
| `js/features.js` | Connexion, événement du jour, cadeaux et rareté, album, boutique, garde-robe, profil, classement, guildes |
| `js/net.js` | Réseau : classement, guildes, Grande Tournée (en ligne ou démo) |
| `js/game.js` | Règles : bâtiments, jouets, lettres, missions, calendrier, niveaux, sauvegarde |
| `js/buildings.js` | Modèles des bâtiments par niveau (3 paliers + décorations) |
| `js/world.js` | Terrain en terrasses, forêt, place du village, lumières, nuages |
| `js/assets.js` | Chargement des modèles, recoloration du Père Noël et des lutins |
| `assets/*.glb` | Modèles 3D compressés (générés par `tools/build-assets.mjs`) |

## Le jeu

Le jeu ne se termine pas. Comme dans Township ou Hay Day, il y a toujours quelque chose à faire.

**Progression**
- Niveau du joueur sans limite. L'expérience vient de tout ce qu'on fait : récoltes, chantiers, jouets, lettres, mini-jeux, missions.
- Le personnage évolue avec le niveau, de lutin jusqu'au Père Noël (niveau 28), puis Père Noël ★ à ★★★★★.
- 8 bâtiments avec 25 niveaux chacun. Les chantiers durent de quelques secondes au début jusqu'à 24 h au niveau 25. La Maison du Père Noël demande un niveau joueur minimum.
- 6 terrasses sur la montagne, débloquées aux niveaux 1, 3, 6, 10, 15 et 21.

**Économie**
- Ressources : pièces, bois, biscuits, tissu (Filature), plus les étoiles, une monnaie rare.
- L'Atelier fabrique 8 jouets à partir des ressources, avec une file d'attente qui s'agrandit avec son niveau.
- Les lettres des enfants sont des commandes de jouets qui se renouvellent sans arrêt. Elles rapportent pièces, XP et parfois des étoiles.

**Activités**
- Mini-jeu « Tournée de Noël » : lâcher les cadeaux dans les cheminées depuis le traîneau. Les gains augmentent avec l'Écurie.
- Mini-jeu « Bataille de boules de neige » : toucher les lutins farceurs, pas les rennes.
- Les mini-jeux coûtent un ticket. Un ticket revient toutes les 15 minutes, et on peut en acheter avec des étoiles.
- 3 missions du jour, plus un coffre bonus.
- Calendrier de l'Avent : une case par jour, 24 cases, puis un nouveau calendrier.
- Objectifs : 11 étapes de tutoriel, puis des objectifs générés à l'infini.

**Rendez-vous quotidiens**
- **Bonus de connexion** sur un cycle de 7 jours, avec une **série** de jours consécutifs. Paliers à 3, 7, 14, 30, 60 et 100 jours, puis tous les 50 jours, avec des tenues exclusives. Une série cassée peut être sauvée avec des étoiles.
- **Événement du jour**, qui change chaque jour (course de traîneaux, chasse aux cadeaux, guerre des boules de neige, rush de l'atelier). Il utilise une énergie, les clochettes, qui se recharge d'une unité toutes les 20 minutes. Il y a 8 paliers de récompenses gratuites, plus une piste premium avec le Pass des Fêtes.

**Cadeaux et rareté**
- La Salle d'emballage transforme un jouet en cadeau. Selon le papier choisi (kraft, à rubans, doré) et le niveau de la salle, le cadeau sort **commun, rare, épique ou légendaire**, avec ouverture animée.
- La Hotte sert à livrer les cadeaux : pièces, XP, étoiles pour les plus rares, et points pour la guilde.
- L'Album de 32 cases (8 jouets × 4 raretés) donne une récompense par ligne, et la tenue « Père Noël doré » quand il est complet.

**Social**
- Classement hebdomadaire des joueurs et des guildes, à l'XP de la semaine.
- Guildes : créer (nom, devise, couleur, emblème), rejoindre, quitter, dissoudre.
- **Grande Tournée** : chaque semaine, les membres d'une guilde remplissent ensemble un traîneau avec leurs livraisons de cadeaux, et tout le monde touche les récompenses des 6 paliers.
- `js/net.js` a deux modes :
  - dans la page publiée sur claude.ai, il utilise la base de données partagée de la page : vrais joueurs entre les personnes qui ont accès à la page en tant que Contributeur ;
  - ailleurs, il passe en démo avec des joueurs simulés. Pour l'app des stores, il faudra un vrai serveur (Firebase, Supabase…) derrière la même interface.

**Boutique et cosmétiques**
- Les étoiles sont la monnaie premium. On en gagne en jouant, et on peut en acheter : packs de 0,99 € à 49,99 €, Pack du débutant, et Pass des Fêtes (30 jours : piste premium, un bâtisseur en plus, une clochette en plus).
- Avec les étoiles : finir un chantier, acheter des ressources ou des tickets, recharger l'énergie, sauver une série, acheter des tenues.
- La garde-robe propose 17 cosmétiques avec rareté : tenues du Père Noël, couleurs des lutins, socles des bâtiments.
- **Les paiements sont simulés.** Pour l'app, il faudra brancher les achats intégrés de l'App Store et de Google Play (par exemple avec RevenueCat et Capacitor) à la place de `buy()` dans `js/features.js`.

La production continue hors ligne (jusqu'à 8 h) et la partie est sauvegardée automatiquement.

**Contrôles** : glisser pour se déplacer, pincer ou molette pour zoomer, toucher une bulle pour récolter, toucher un bâtiment ou un « + » pour ouvrir sa fiche.

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
- Serveur pour le multijoueur de l'app (comptes, classement, guildes, chat de guilde, anti-triche).
- Achats intégrés réels (App Store, Google Play).
- Bande-annonce et pubs vidéo avec Remotion ou HyperFrames, à partir de captures du jeu.
