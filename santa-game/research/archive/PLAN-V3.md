# Plan V3 : un village à ressources où chaque bâtiment sert

Demande du joueur :
- revenir aux **ressources** de la première version, pas aux chaînes de produits façon Township ;
- **chaque bâtiment a une vraie utilité**, comme dans Bid Master ;
- **chaque amélioration change quelque chose de visible**, comme dans Dragons of Atlantis.

Sources : `research/BIDMASTER.md`, `research/DRAGONS-OF-ATLANTIS.md`, `TOWNSHIP-10MIN.md` (didacticiel et confort).

On garde le moteur V2 : 2D isométrique, images pré-rendues, effets, didacticiel, tâches, cadeau du jour, mini-jeux.

## Ressources
| Ressource | Produite par | Sert à |
|---|---|---|
| **Pièces** | Bureau des lettres, Musée, commandes | Tout construire et améliorer |
| **Bois** | Scierie | Bâtiments, jouets en bois |
| **Biscuits** | Four à biscuits | Nourrir les lutins (gros chantiers), jouets gourmands |
| **Tissu** | Filature (niveau 5) | Peluches, chaussettes, papier cadeau |
| **Lutins** (population) | Chalets | Ouvriers : chaque niveau d'un bâtiment de production en emploie |
| **Bonheur** | Décorations, Théâtre | Bonus de production et de pièces (formule de DoA) |
| **Étoiles** | Niveaux, tâches, cadeau du jour | Accélérer, monnaie rare |

Règle de DoA : chaque bâtiment de production a un **petit stock interne** (environ 4 h de production). On touche la bulle pour collecter, ce qui fait revenir le joueur sans le punir. Le stock global est plafonné par l'**Entrepôt**.

## Bâtiments
Chaque ligne précise ce que fait une amélioration, et la fiche du bâtiment affiche toujours « niveau N → N+1 » avec les chiffres.

| Bâtiment | Utilité | Ce que change chaque niveau |
|---|---|---|
| **Maison du Père Noël** | Cœur du village | Niveau max des autres bâtiments = son niveau ; débloque 1 bâtiment par niveau ; +stock |
| **Scierie** | Bois/h | Production ×1,35, stock interne +, emploie des lutins |
| **Four à biscuits** | Biscuits/h | Idem |
| **Filature** | Tissu/h | Idem |
| **Bureau des lettres** | Pièces/h (les lettres arrivent avec une pièce) | Pièces/h ×1,35 ; bonus du bonheur |
| **Chalets des lutins** (appartements) | +lutins | +habitants ; chaque chalet est plus cher et plus grand |
| **Entrepôt** | Stock max de toutes les ressources | +60 % de stock par niveau |
| **Atelier des jouets** | Fabrique les jouets demandés dans les lettres | +1 place de file, vitesse +7 % |
| **Bureau du traîneau** | Commandes des enfants (jouets → pièces, XP, étoiles) | +1 commande à la fois, meilleures récompenses |
| **Salle d'emballage** | Emballe les jouets : rareté commun → légendaire | Meilleures chances de rareté |
| **Musée des jouets** (Bid Master) | Expose des cadeaux : revenu passif, bonus de collection | +1 vitrine ; nouvel étage tous les 3 niveaux |
| **Bibliothèque des contes** (Science Center de DoA) | Recherches : +10 % de bois, de biscuits, de vitesse de construction… | Niveau max des recherches = niveau de la bibliothèque |
| **Écurie des rennes** | Mini-jeu Tournée de Noël | +1 ticket, gains +25 % |
| **Théâtre de marionnettes** | +bonheur | +bonheur par niveau |
| **Gare du Pôle** | Train toutes les X h : haches, scies, matériaux rares | Train plus fréquent et plus chargé |
| **Décorations** | +bonheur | — |

**Lutins intendants** (managers de Bid Master) : à partir du niveau 5, un bâtiment peut recevoir un intendant qui collecte tout seul. Il se débloque pour tous les bâtiments, ce qui corrige la critique faite à Bid Master.

## Rythme
- **Chapitres de tâches** : un bâtiment nouveau par chapitre, et chaque tâche dit exactement quoi faire.
- **Début rapide** : constructions en secondes, puis en minutes. Pas de minuterie de plusieurs heures avant le niveau 8.
- **Hors ligne** : les bâtiments se remplissent jusqu'à leur stock interne (environ 4 h), puis s'arrêtent.

## Ce qui disparaît de la V2
Champs, cultures, animaux et usines à recettes. Le Bureau du traîneau, la Grange devenue Entrepôt, les agrandissements, le didacticiel, les effets et les mini-jeux sont gardés et adaptés.
