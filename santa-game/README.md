# Le Village du Pôle — Deviens le Père Noël

Jeu de gestion de village de Noël pour téléphone, tablette et PC, dans la lignée de Township et Hay Day. Il tourne dans le navigateur et s'installe comme une application depuis l'écran d'accueil.

**En ligne :** https://lesamouraivirtuel.github.io/LeSamouraiVirtuel/ (une seule adresse, toujours la dernière version).

## Règle de rangement (à chaque version)

1. **On retire ce qui ne sert plus.**
   - Avant de livrer, on vérifie qu'aucun fichier, image, modèle ou outil n'est devenu inutile : fichier que plus rien ne charge, ancien plan, capture périmée.
   - S'il ne sert plus, on le supprime.
   - S'il a une valeur historique, on le déplace dans `research/archive/` ou `tools/archive/`.
2. **Une seule version en ligne.**
   - `tools/deploy.sh` copie exactement les fichiers servis (page, `js/`, `assets/pack`, `assets/battle`, modèles `.glb`, icônes) et efface tout le reste sur `gh-pages`.
   - On ne garde jamais d'ancienne page à côté (pas de `v1.html`, `v2.html`…).
3. **Numéro de version partout.** On met le même numéro `N` à trois endroits ; `deploy.sh` refuse de publier s'ils ne correspondent pas :
   - `version.json` ;
   - `GAME_V` dans `js/v2/main.js` et `main.js?v=N` dans `index.html` ;
   - le cache `vdp-vN` dans `sw.js`.
4. **Parcours complet testé avant chaque mise en ligne**, sur iPhone SE et sur PC :
   - le tutoriel ;
   - l'ouverture de colis ;
   - les lettres ;
   - la bataille ;
   - l'audit des textes de toutes les fenêtres.

## Légal (à lire avant tout paiement réel)

- Toutes les informations légales (éditeur, contact, hébergeurs, droit applicable) sont dans **`js/legal.js`**, à un seul endroit. Les pages `cgu.html`, `privacy.html` et `mentions.html` et le jeu les lisent.
- **Quand les textes changent**, on change `LEGAL_V` dans `js/legal.js` : le jeu redemande l'accord à tous les joueurs.
- **Avant tout paiement réel** (App Store, Google Play), il faudra le **nom complet** et l'**adresse postale** de l'éditeur (société ou personne). C'est obligatoire en France (LCEN) et en Suisse (LCD, art. 3 al. 1 let. s). Il faudra aussi :
  - revoir les conditions de vente ;
  - valider les achats côté serveur (`research/ANTI-TRICHE.md`).
- Aujourd'hui, l'éditeur est un particulier et les achats sont simulés : il n'y a aucune activité commerciale.
- **Durées de conservation**, appliquées par le jeu et par le bouton « Nettoyage » du tableau de bord :
  - journal de sécurité : 6 mois ;
  - sessions d'analyse : 13 mois ;
  - comptes inactifs : 2 ans.
  Les comptes de connexion Firebase inactifs se suppriment dans la console Firebase.
- **Règles Firestore** : `firebase/firestore.rules`, testées par `tools/tests/regles.cjs` sur l'émulateur contre les sauvegardes de chaque version. Pas de Cloud Functions. Avant de publier une nouvelle version des règles : dans la console Firebase, créer le document `admins/{uid}` de l'éditeur (Authentication → Users → copier l'uid ; un champ `ok` = true suffit). Sinon le tableau de bord ne s'ouvre plus. L'adresse e-mail n'est plus dans les règles. Une mise à jour ne peut plus retirer `vu` ni un jalon déjà classé, sauf quand le joueur met `analyse` à faux (vieux clients). Le client v95, lui, supprime le document `track/{uid}`. Les clients v93/v94 en cache écrivent encore leur fiche (`derniere` en nombre, `creeLe`) ; seul leur jalon, qui n'a pas l'heure du serveur, est refusé.
- **Codes de village** : la somme sur les exports est un anti-bricolage. La clé est dans `js/v2/town.js`, côté joueur. Un code sans somme est accepté, plafonné, et marqué « ancien code ». `testEditeur` est retiré à l'import, pas au chargement d'une partie déjà sur l'appareil.

## Tests de non-régression

```bash
bash tools/tests/run.sh      # tutoriel, colis, bataille (iPhone SE et PC), lettres, audit des textes, robot
```

Variables utiles : `PLAYWRIGHT_BROWSERS_PATH` (dossier des navigateurs), `CHROMIUM_PATH` (Chromium pour le PC). Les captures vont dans `tools/tests/out/` (ignoré par git).

## Lancer en local

```bash
cd santa-game
python3 -m http.server 8765      # puis http://localhost:8765
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Interface : barres, fenêtres, styles, chargement |
| `js/v2/main.js` | Le jeu : carte du village, caméra, lutins, toutes les fenêtres, boutique, cinématiques |
| `js/v2/town.js` | Règles : bâtiments, coûts, production, lettres, zones, sauvegarde |
| `js/v2/meta.js` | Missions, pass, événements, boutique, skins, packs |
| `js/v2/baker.js`, `bake.js`, `models.js` | Fabrication des images à partir des modèles 3D (outils et secours) |
| `js/battle3d.js` | Bataille contre les trolls en 3D. Elle est chargée seulement quand on lance une bataille. |
| `js/minigames.js` | Mini-jeux : Tournée de Noël, Tour de cadeaux |
| `js/tuto.js`, `js/villains.js`, `js/account.js` | Tutoriel, portraits des méchants, comptes (Firebase) |
| `js/assets.js`, `js/buildings.js`, `js/world.js` | Chargement et construction des modèles 3D (pour la fabrication des images) |
| `assets/pack/` | Toutes les images du jeu pré-rendues (WebP) et `pack.json` |
| `assets/*.glb`, `assets/battle/*.glb` | Modèles 3D (CC0) |
| `tools/` | Fabrication du pack, mise en ligne, simulation d'économie |
| `research/` | Études (20 jeux, audit complet, journal des tours dans `BOUCLE.md`) |

## Fabriquer les images

Il faut un serveur local sur le port 8765, puis :

```bash
bash tools/repack-all.sh     # tout le pack (≈ 30 min) : bâtiments, icônes, marche des lutins, skins
bash tools/repack-skins.sh   # seulement les skins
```

## Mettre en ligne

```bash
bash tools/deploy.sh <dossier du clone de la branche gh-pages>
```

## Modèles 3D et licences

Les modèles viennent de packs **CC0** (domaine public) : [Kenney](https://kenney.nl) (Holiday Kit, Fantasy Town Kit) et [KayKit](https://kaylousberg.com) (personnages et animations). Les monstres de la bataille viennent de [Quaternius](https://quaternius.com) (licence dans `assets/battle/`). `tools/build-assets.mjs` regénère les `.glb` à partir des packs d'origine.
