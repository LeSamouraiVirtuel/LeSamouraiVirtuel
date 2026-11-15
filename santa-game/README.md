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
