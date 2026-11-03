# Guide de style — Le Village du Pôle

Synthèse de l'analyse de **484 captures in-game réelles** de Township, Hay Day et Clash of Clans
(wikis des jeux, novembre 2026 ; environ 430 écrans de jeu et d'interface exploitables). Ce sont les règles appliquées au jeu.

## 1. Monde

| Règle | Township | Hay Day | Clash of Clans | Chez nous |
|---|---|---|---|---|
| Caméra fixe, quasi orthographique, ~35° de plongée, tournée en diagonale | ✔ | ✔ | ✔ | Focale étroite (26°), rotation de 25° |
| Sol rempli : 55–65 % couvert de bâtiments et décor | ✔ | ✔ | ✔ | Clôtures, sapins, lampadaires, cadeaux |
| Neige blanc-bleuté, ombres bleues, chemins dégagés jusqu'au sable chaud | ✔ (cartes de Noël) | — | — | Neige `#F4F8FC` / `#CFDFF0`, chemins sable |
| Saturation forte (~1,3×), lumière chaude venant d'en haut à gauche, ombres courtes teintées froides | ✔ | ✔ | ✔ | Étalonnage + soleil chaud |
| Nuages blancs sur les zones verrouillées, cadenas argent | ✔ | | | ✔ |
| Le niveau se voit sur le modèle (matériau qui change) | | | ✔ | Socles bois → pierre → or |

## 2. HUD (portrait)

- **Haut gauche** : portrait du joueur, étoile bleue avec le niveau, barre d'XP (rail sombre `#20304A`, remplissage dégradé `#17D7FF → #5960E9`, texte blanc contouré dedans).
- **Haut droite** : pilules de ressources sombres translucides, grosse icône 3D qui déborde à gauche (×1,3), nombre blanc contouré aligné à droite, barre de capacité, bouton vert « + » sur la monnaie premium.
- **Colonnes latérales** : widgets d'événement ronds ou carrés arrondis avec une plaque de minuteur sombre dessous (`2J 1H`) et un badge rouge cerclé de blanc.
- **Bas** : tuiles crème carrées (`#F8F0CA → #F1D9B8`, bord `#C9A57A`), la boutique la plus grande, à droite, en or.

## 3. Composants

- **Fenêtres** : centrées, ~92 % de la largeur, voile sombre à 55 % derrière. Corps parchemin `#FFF6DA → #F6E6BF`, cadre bois `#C98A4B` de 6 px, liseré sombre `#6B3A16`, rayon 22 px. Le titre est sur un **ruban rouge à queues d'aronde** qui chevauche le bord haut. La croix de fermeture est dans un **cercle rouge cerclé de blanc** qui chevauche le coin. Apparition avec rebond (0,8 → 1,05 → 1).
- **Boutons** : rectangle à rayon ~28 % de la hauteur, dégradé vertical, bande brillante en haut, contour 2 px plus sombre, **lèvre pleine de 4 px** en bas qui disparaît à l'appui. Une couleur par rôle : **vert** = confirmer / améliorer, **or** = acheter / récolter, **bleu** = secondaire, **rouge** = fermer / danger, **gris** = désactivé.
- **Cartes et emplacements** : crème plus foncé `#F1E1BC`, rayon 12. Les récompenses premium sont sur fond or avec un ruban de quantité cramoisi. Les icônes occupent ~70 % de la case et débordent du cadre.
- **Barres** : rail sombre en pilule, remplissage en dégradé avec un reflet en haut, valeur centrée en blanc contouré.
- **Coûts** : affichés dans le bouton, en rouge si on n'a pas assez.
- **Badges** : cercle rouge, chiffre blanc, anneau blanc de 2 px, en haut à droite.
- **Bulles au-dessus des bâtiments** : épingle blanche arrondie avec une pointe, icône produit, contour sombre.

## 4. Typographie

- Une seule police d'affichage, épaisse et arrondie (**Lilita One**) pour les titres, boutons, nombres et étiquettes, en **MAJUSCULES**. **Fredoka** pour les phrases.
- Texte blanc, **contour sombre** (~12 % de la hauteur des capitales), **ombre portée dure** `0 2px 0`, sans flou.
- Titres de célébration : dégradé jaune → orange `#FFE14A → #F7A21B`, contour brun.
- Texte courant sur parchemin : brun `#6B3F1E`, sans contour.

## 5. Célébration

Monde assombri, **rayons de lumière tournants**, objet 3D au centre sur une lueur, titre en dégradé jaune, chiffres « +N » en gros, **un seul** bouton vert « CONTINUER ».

## 6. Netteté (règle n°1)

Analyse de 324 captures supplémentaires classées par fonctionnalité (village, construction, commandes, boutique, clan et coopération, événements, menus). Dans les trois jeux, **rien n'est flou**. Le monde, les icônes et le texte sont nets au pixel près, et le flou n'apparaît que derrière une fenêtre de célébration. Les règles appliquées :

- Pas de flou de profondeur sur le monde.
- Rendu à la densité réelle de l'écran (jusqu'à ×2,6 sur iPhone), avec anti-crénelage MSAA ×4.
- Icônes 3D rendues à la densité de l'écran (×2 à ×3), jamais agrandies.
- Textures filtrées en anisotrope ×8.
- Si le téléphone ne suit pas, on baisse la résolution par paliers (qualité auto), mais on n'ajoute jamais de flou.
