# Dragons of Atlantis (Kabam) : bâtiments, économie et progression

> Recherche faite pour le jeu « village du Père Noël ». Elle couvre deux versions : la version navigateur/Facebook (2011, notée **DoA**) et la version mobile *Heirs of the Dragon* (notée **HotD**).
> **[C]** = confirmé par une source (le plus souvent un tableau des wikis de fans, lu via l'API MediaWiki publique de Fandom). **[I]** = inféré, déduit ou recoupé par moi.
> Avertissement : les wikis datent de plusieurs patchs successifs. Quelques valeurs sont incohérentes d'une page à l'autre, et je les signale. Les ordres de grandeur et les *formes de courbes* sont fiables, mais l'unité près ne l'est pas toujours.

---

## 1. Économie

### 1.1 Ressources
| Ressource | Produite par | Sert à | Notes |
|---|---|---|---|
| Nourriture (Food) | Ferme (champ) ; bonus des Lacs et Savanes conquis | troupes (entraînement + **entretien horaire**), bâtiments | Les camps d'Anthropus en rapportent énormément, d'où le conseil de ne construire que 1 à 6 fermes **[C]** |
| Bois (Lumber) | Scierie | « rien ne se construit ni ne s'entraîne sans bois » | La ressource la plus tendue en début de partie **[C]** |
| Pierre (Stone) | Carrière | surtout les **améliorations de bâtiments** (Forteresse, Mur) | Fortress L11 = 5,12 M de pierre **[C]** |
| Métal (Ore/Metals) | Mine | quasi toutes les recherches, les troupes avancées | Devient « la ressource la plus précieuse » **[C]** |
| Or (Gold) | **Impôt** sur la population (Forteresse), vente au Comptoir | recherche, salaires des Généraux, Dragon's Keep, Rookery | Ne se stocke pas dans le coffre avant le niveau 11 du Storage Vault **[C]** |
| Population | Maisons (Homes) | ouvriers des champs + troupes en formation + base de l'impôt | Voir 1.3 |
| Énergie bleue, Talismans, Énergie lunaire | Reaping Stones, camps, avant-postes tardifs | dragons spéciaux, troupes d'élite | Contenu de fin de partie **[C]** |
| Rubis | Achat réel | accélérations, objets | Monnaie premium **[C]** |

### 1.2 Production
- **Production de base = somme des bâtiments de champ** : chaque Ferme, Scierie, Carrière ou Mine produit selon son niveau **[C]**.
  Courbe DoA (identique pour les 4 types) : L1 100/h, L2 300, L3 600, L4 1 000, L5 1 500, L6 2 100, L7 2 800, L8 3 600, L9 4 500, L10 5 500, L11 6 600, L12 7 800, L13 9 100, L14 10 500, L15 12 000 **[C]**.
  → On ajoute +100, +200, +300… par niveau : c'est une progression **arithmétique du gain**, donc une production quadratique **[I]**.
- **Bonus multiplicatifs** sur la production de base, cumulables entre catégories **[C]** :
  - Recherche (Agriculture, Woodcraft, Masonry, Alloys) : **+10 % par niveau** (+20 à 25 % au-delà de L11).
  - Contrées sauvages conquises : **+5 % par niveau de la contrée**, soit +50 % pour une L10. Forêt = bois, Montagne = métal, Colline = pierre, Lac et Savane = nourriture. Plafond de 20 contrées en DoA.
  - « Nanos » (objets) : +25 % pendant 24 h ou 7 j. Ils ne se cumulent qu'en durée, **pas en pourcentage**.
- Les champs de la **ville** versent directement dans la réserve. Ceux des **avant-postes** remplissent un **Silo**, qu'il faut vider à la main (ou avec un objet « Collector Nano ») et qui peut être pillé à 100 % **[C]**.
- **Hors ligne** : la production tourne en continu côté serveur, jusqu'au plafond de capacité **[C pour l'arrêt au plafond / I pour le « continu »]**. Les guides conseillent de lancer les constructions longues (Forteresse, Science Center) avant de se déconnecter **[C]**.

### 1.3 Stockage / capacité
- Chaque ressource a une **capacité**. Une fois la capacité atteinte, **les champs cessent de produire**. Le pillage permet quand même de dépasser le plafond **[C]**.
- La capacité vient des champs eux-mêmes : la colonne « Capacity » des tableaux donne 12 k (L1), 36 k, 72 k, 120 k, 180 k… 660 k (L10). Cela fait **120 h de production du champ** en DoA et 100 h en HotD **[C pour les chiffres / I pour l'interprétation « somme des champs »]**.
- **Storage Vault** : il **n'augmente pas la capacité** **[C]**. Il **protège** une quantité de chaque ressource contre le pillage :
  - DoA : L1 100 k, L2 400 k, L5 1 M, L9 2 M, L10 3 M, L11 5 M (+ 500 k d'or), L15 15 M, L20 40 M **[C]**.
  - HotD : +50 k par niveau, de 50 k à 1,5 M au L30 **[C]**.
  - Au L10 et plus, il protège aussi la nourriture contre la « famine » : la réserve ne descend plus sous le montant protégé **[C]**.

### 1.4 Population, impôt, bonheur (le cœur du système)
Formules du wiki DoA **[C]** :
- `Population = Capacité (Maisons) × Bonheur %`
- `Bonheur = 100 − taux d'impôt + 2 × niveau du Théâtre`
- `Population inactive (idle) = Population − Ouvriers (champs) − Recrues en formation`
- `Or/heure = capacité des maisons × bonheur × taux d'impôt` → l'optimum est à environ **50 %** d'impôt (courbe de Laffer).
- Chaque champ **emploie des ouvriers** : 10 au L1, 30, 60, 100, 150, 210, 280, 360, 450, 550 au L10. Le nombre d'ouvriers vaut toujours **production/10** **[C]**. Un champ plein garde ses ouvriers **[C]**.
- **Tension clé** : chaque niveau de champ mange de la population qui manque ensuite aux troupes. L'impôt rapporte de l'or mais fait fuir des habitants. Les joueurs passent l'impôt à 50 % quand ils n'entraînent pas, puis à 0 % pour former des troupes **[C]**.
- **Entretien** : chaque troupe mange de la nourriture chaque heure (Conscrit : 3 nourriture/h ; Grand Dragon : 200 à 2 000/h selon son niveau). Si la production devient négative, **personne ne meurt** : la réserve reste à 0 et bloque alors constructions et entraînement **[C]**. La recherche *Rationing* réduit l'entretien de 5 % par niveau (100 % au L20). L'entretien a été **supprimé** dans les versions tardives (Rise of Atlantis, HotD) **[C]**.
- Les **Généraux** touchent un salaire prélevé sur l'or. Avec 0 % d'impôt, le revenu en or devient négatif **[C]**.

---

## 2. Bâtiments

**Règles générales**
- Une seule construction à la fois (DoA navigateur) **[C]**. Toutes les améliorations rapportent de la « Power » (score), qui **double à chaque niveau** **[C]**.
- **Coûts** : ×2 par niveau jusqu'au L10 (ressources **et** temps), puis souvent un plateau ou une croissance plus lente. Au-delà, il faut des **objets-clés** : *Completion Grant* pour le L10, *Ancestral Seal* pour L11-15/16, *Lineage Seal* pour L17+ (puis 2, 3 ou 4 sceaux) **[C]**. HotD : Completion Grant au L20, puis de l'*Obsidian* (×10, ×50, ×100, ×300, ×500, ×700) **[C]**.
- **La Forteresse verrouille le palier** : aucun bâtiment ne dépasse le L10 tant que la Forteresse n'est pas L11 (quelques exceptions : Sentinel, Vault) **[C]**.
- **Recherche niveau N** = Science Center ≥ N **et** bâtiment lié ≥ N : Masonry ↔ Carrière, Woodcraft ↔ Scierie, Alloys ↔ Mine, Metallurgy ↔ Metalsmith, Dragonry ↔ Rookery, Mercantilism ↔ Factory **[C]**.
- **Accélérer** : la recherche *Levitation* donne `temps = base / (1 + 0,1 × niveau)` (−9 % au L1, −33 % au L5, −50 % au L10) **[C]**.

### 2.1 Bâtiments de ville

| Bâtiment | Rôle | Ce que change chaque niveau | Prérequis / plafond | Exemples chiffrés |
|---|---|---|---|---|
| **Forteresse** (Fortress) | Cœur de la ville ; règle l'impôt, affiche la production | + **emplacements de champs** et + **contrées conquérables** ; au L11, débloque le L11+ de tous les autres bâtiments et change l'apparence selon la race | Déjà construite au L1. Le L11 demande un Completion Grant (L10) puis un Ancestral Seal | Coûts DoA : L2 400 nourriture / 600 bois / 200 métal / **5 000 pierre**, 30 min ; L5 40 k pierre, 4 h 12 ; L8 320 k pierre, 1 j 10 h ; L10 1,28 M pierre, ~6 j ; L11 5,12 M pierre, 10 j 16 h **[C]**. HotD : L1 → 1 contrée / 11 champs ; L5 → 3 / 17 ; L10 → 5 / 25 ; L20 → 10 / 38 **[C]** |
| **Maison** (Home) | Logement → capacité de population | + population par maison ; au-delà du L15, + capacité de marche | L10 : Completion Grant ; >L10 : Forteresse L11 + sceaux. Max L35 (DoA tardif) | Population DoA : 100, 300, 600, 1 000, 1 500, 2 100, 2 800, 3 600, 4 500, 5 500 (L10), 7 000 (L11), 12 400 (L15), 21 400 (L20). Temps : 10 s, 20 s, 41 s, 1 min 23… 1 h 35 au L10 **[C]**. HotD : 37 → 1 500 (L10) → 12 000 (L30) **[C]** |
| **Garnison** (Garrison) | Forme les troupes | **Débloque un type de troupe par niveau** et **−5 % de temps d'entraînement** par niveau (+10 % au L1 … +55 % au L10, +105 % au L20). **Construire plus de garnisons accélère plus que monter de niveau** et ajoute des files | Constructible en nombre (les guides en conseillent 10 à 20) | L1 Conscrit/Porteur, L2 Hallebardier/Espion, L3 Minotaure, L4 Archer long (LBM), L5 SSD, L6 Transport blindé, L7 Battle Dragon, L9 Géant, L10 Fire Mirror. Coût L1 250 / 1 200 / 500 / 1 500, ×2 par niveau **[C]** |
| **Science Center** | Toutes les recherches | Niveau du SC = niveau max des recherches ; débloque de nouvelles branches | Unique | L1 120 / 2 500 / 200 / 1 500, 8 min ; L5 2 h 14 ; L10 1,28 M bois, 3 j 4 h + Completion Grant + Forteresse L10 **[C]**. HotD : SC6 → recherches L3 + Dragonry ; SC10 → L5 + Levitation ; SC20 → L10 **[C]** |
| **Storage Vault** | Protège les ressources du pillage | + quantité protégée par niveau ; l'or est protégé à partir du L11 ; au L10, protection contre la famine | Unique ; ne nécessite pas Forteresse L11 pour son L11 | Voir 1.3. Temps : 10 min (L1) → ~4 j (L10) → 21 j (L16+) **[C]** |
| **Officers' Quarters** | Nomme les **Généraux** (1 par marche) | **+1 général par niveau** (4 au L1, 13 au L10, 30 au L27) | Indispensable pour attaquer | L1 400 / 2 500 / 700 / 1 200, 6 min **[C]** |
| **Muster Point** | Envoie les marches | **+1 marche simultanée et +20 k soldats par marche** par niveau (1 × 20 k au L1, 10 × 200 k au L10, 30 × 1,16 M au L30). En avant-poste : +5 k par niveau | Forteresse L11 pour aller au-delà | L1 100 / 600 / 250 / 2 000, 1 min 30 ; L10 1 M pierre, 14 h. HotD : 1 marche × 10 k → 10 × 100 k au L20 **[C]** |
| **Metalsmith** | Métallurgie | Débloque des troupes (Minotaure L1, Géant/BD L5, Fire Mirror L7…) ; plafonne la recherche Metallurgy | — | L1 125 / 1 000 / 1 200 / 600, 3 min ; ×2 par niveau **[C]** |
| **Factory** | Armement avancé, commerce | +1 niveau possible de *Mercantilism* (= +1 échange simultané) ; débloque Transport blindé, Géant, Fire Mirror | Commerce = Factory 1 + Levitation 1 + Mercantilism 1 | L1 150 / 1 500 / 1 500 / 500, 9 min ; L10 3 j 13 h **[C]** |
| **Rookery** | Troupes aériennes | Réduit le temps d'entraînement des troupes volantes ; plafonne *Dragonry* ; débloque SSD (L1), BD (L5), Pack Dragon (L10) | **1 seul par royaume** ; coûte aussi de l'or | L1 1 200 nourriture / 800 or / 2 000 bois…, 2 min **[C]** |
| **Dragon's Keep** | Nid du Grand Dragon | Le dragon grandit (œuf → bébé → adolescent → adulte) et ses stats montent ; L8 + 4 pièces d'armure = le dragon peut attaquer. En avant-poste, il fixe le nombre de champs | Coûte de l'or | L2 800 / 3 000 or / 5 000 bois, 9 min ; L8 12 h 48 ; L10 2 j 3 h + Completion Grant **[C]** |
| **Mur** (Wall) | Défense | + « Résistance » (bonus de défense des troupes) ; au L16+, rallonge aussi la marche des attaquants (+5 %/niveau). Choix « Défendre / Cacher » les troupes | Déjà présent | L2 20 k pierre, 1 h ; L10 5,12 M pierre, 11 j 22 h **[C]** |
| **Sentinelle** (Sentinel) | Alerte d'attaque | **Chaque niveau révèle une information de plus** : L1 « ennemi en approche », L2 espion ou attaque, L3 heure d'arrivée, L4 alliance, L5 général, L6 effectif approximatif, L7 types de troupes, L9 nombre exact, L10 nom de l'attaquant | — | L1 150 / 1 000 / 300 / 3 000, 5 min **[C]** |
| **Théâtre** (Theater) | Bonheur | **+2 à 3 % de bonheur par niveau** (+25 % au L10), donc plus d'impôt sans perdre d'habitants ; montre aussi les vidéos de quêtes | Jugé utile seulement les 1 à 3 premières semaines | L1 300 / 2 000 / 400 / 1 000, 4 min ; L10 1 j 14 h **[C]** |
| **Healing Pool** (HotD) | Soigne les blessés | + nombre de troupes récupérables (36 au L1, 1 980 au L10, 22 680 au L35) | Constructible en nombre | Coûte aussi de l'or **[C]** |

### 2.2 Champs (Field) et bâtiments d'avant-poste

| Bâtiment | Rôle | Par niveau | Coût / temps |
|---|---|---|---|
| **Ferme / Scierie / Carrière / Mine** | Produisent 1 ressource | Production 100 → 5 500/h (L10) ; ouvriers = prod/10 ; capacité = 120 h de prod | Ferme L1 50 / 300 / 150 / 200, 15 s ; L5 4 min 12 ; L10 2 h 23 ; ×2 par niveau. Mine L1 210 / 600 / 200 / 500. Chaque type est cher dans *une autre* ressource **[C]** |
| Emplacements | 30 emplacements de champ en ville (DoA) ; la Forteresse en ouvre progressivement (+3 au L2) **[C]** | | |
| **Silo** (avant-poste) | Stocke la production des champs d'avant-poste | 6,9 k (L1) → 103,5 k (L5) → 379,5 k (L10) | Non protégé : tout est perdu si l'avant-poste est attaqué **[C]** |
| **Training Camp** (avant-poste) | Garnison d'avant-poste | Accélère l'entraînement ; au L10, troupe spéciale de l'avant-poste. Plus de camps vaut mieux que des camps plus hauts **[C]** | |
| **Maisons** d'avant-poste | Population (×1,5 dans les Solarian Highlands) **[C]** | | |
| **Marketplace** (Abyssal) | Échanges d'objets | +1 échange gratuit par jour tous les 2 niveaux environ | Payé en Coral Doubloons **[C]** |

---

## 3. Recherche (Science Center)
Une recherche à la fois. Coût en **or + métal + bois**, ×2 par niveau. Temps cumulés de 0 à 10 : 5 j (Agriculture) à 40 j (Rationing) ; 312 j pour tout **[C]**.

| Branche | Effet par niveau | Lien |
|---|---|---|
| Agriculture / Woodcraft / Masonry / Alloys | +10 % de production (+20 à 25 % au-delà de L11) | niveau ≤ bâtiment de champ correspondant |
| **Levitation** | +10 % de vitesse de construction (formule hyperbolique) | Woodcraft 5 + SC 5 ; L1 : 5 000 or, 2 000 métal, 2 000 bois, 29 min |
| Mercantilism | +1 échange simultané | Factory |
| Clairvoyance | Rapports d'espionnage plus détaillés | |
| Rapid Deployment | +5 % de vitesse de marche | SC 4 |
| Weapons Calibration | +5 % de portée à distance (débloque le LBM au L1) | Woodcraft 4 |
| Metallurgy | +5 % attaque/défense | Metalsmith + Alloys |
| Medicine | +5 % de vie | SC 6 |
| Dragonry | +5 % de vitesse des dragons-troupes (débloque SSD/BD) | Rookery + SC 3 |
| Aerial Combat | −5 % du seuil de PV minimum de combat des dragons | |
| Rationing | −5 % d'entretien (100 % au L20) | SC 13 |
| Warrior/Guardian Revival, Energy Collection | âmes, énergie bleue (fin de partie) | |
**[C]** pour tout le tableau. Une troupe se débloque par une combinaison **bâtiment + recherche** : LBM = Garnison 4 + Weapons Calibration 1 ; Transport blindé = Garnison 6 + Factory 3 + Levitation 3 **[C]**.

---

## 4. Dragons
- **Grand Dragon** (1 par ville) : il naît et grandit **en montant le Dragon's Keep**. Il défend toujours la ville, sauf s'il est en marche. Il a une barre de vie, guérit après chaque combat (soin accélérable) et coûte un entretien en nourriture **[C]**.
  Stats : L3 200 att., 20 k PV ; L10 2 425 att., 242 k PV ; L11 ~9 300 att. et 90 k de charge (gros saut au palier 11) **[C]**.
- **Armure** en 4 pièces (casque, corps, griffes, queue), qui tombent **aléatoirement** dans les camps d'Anthropus L5+ (Grand Dragon) ou les contrées L7+ (dragons élémentaires). Il faut Keep L8 et les 4 pièces pour attaquer avec un dragon **[C]**.
- **Œufs** élémentaires (Eau sur les Lacs L5+, Pierre sur les Collines L7+, Feu sur les Montagnes, Vent sur les Savanes, plus Givre, Serpent, Ambre, Helios, Chrono…). Chaque œuf permet de **fonder un avant-poste** qui a son propre Keep, ses bâtiments et sa troupe spéciale **[C]**.
- Écailles et armures cosmétiques avec bonus (charge, vitesse, PV) **[C]**. Le dragon de ville est obligatoire dans la marche pour obtenir œufs et talismans **[C]**.
- Troupes-dragons : Swift Strike Dragon (rapide, « fermier »), Battle Dragon, Pack Dragon (transport) **[C]**.

## 5. Troupes, quêtes, avant-postes, objets, alliance
- **Troupes** (déblocage par garnison/bâtiment) : Porteur/Conscrit → Hallebardier/Espion → Minotaure → **Archer long** (pivot du début) → SSD → **Transport blindé** (charge du butin) → Battle Dragon → Géant → Fire Mirror → élites d'avant-poste (Fangtooth, Granite Ogre, Lava Jaw, Banshee…), qui demandent des objets ramassés en camp **[C]**.
- **PvE** : camps d'Anthropus (gros butin de nourriture : un camp L1 contient jusqu'à 112 k de nourriture, 15 k de bois, 500 de métal et 500 de pierre) et contrées sauvages (~1 k par attaque au L1). Les Généraux gagnent des **étoiles** à force de victoires, ce qui booste leurs troupes **[C]**.
- **Quêtes** : catégories (Conquête, Défense, Construction…). **Chaque quête rembourse à peu près le coût de l'action et donne souvent une accélération** (Blink, Hop, Skip) : par exemple, « Sentinelle L2 » coûte 300 / 2 k / 600 / 6 k et rend 300 / 2 k / 600 / 6 k. 5 garnisons construites → 10 k de chaque ressource **[C]**. Les gains de quêtes croissent moins vite que les coûts (×1 à ×2 au début, puis plafond) **[C, tableau Sentinelle]**.
- **Accélérations** (rubis) : Blink 1 min (1 rubis), Hop 5 min (3), Skip 15 min (5), Jump 1 h (10), Leap 2,5 h (15), Bounce 8 h (40), Bore 15 h (65), Bolt 24 h, Blast 2,5 j, Blitz 4 j. Les plus gros raccourcissent aussi l'entraînement et les marches **[C]**.
- **Boosts** : Nanos +25 % (24 h : 7 rubis, 7 j : 40), Double Tax (24 h : 35 rubis), Nomadic Recruits +20 000 habitants pendant 24 h, Divine Rations (0 entretien pendant 12 h) **[C]**.
- **Protection débutant** : il existe une « Beginner Protection » limitée dans le temps, et les guides disent de monter le Vault pendant cette période **[C]**. Sa durée exacte n'a pas été trouvée ; Kingdoms of Camelot, autre jeu Kabam, utilisait 7 jours ou château L5 **[I]**.
- **Alliance** : envoi de ressources entre membres, renforts, effet dissuasif ; dans HotD, Alliance Storage, Science Center d'alliance, boutique **[C]**.
- **Commerce** : comptoir joueur-joueur (or ↔ ressource), chaque transaction dure 30 min, avec une taxe vendeur **[C]**.

## 6. Rythme et progression
- **Premières minutes** : constructions de 10 à 60 s, quêtes à la chaîne qui remboursent tout. Champs L1 en 15 s, Maison L1 en 10 s **[C]**.
- **Jour 1** (ordre conseillé) : 5 maisons (dont une au L3) → 11 champs au L3 → Science Center + recherches de production L1-2 → 5 garnisons (quêtes) → Forteresse L2 (1 h 30, « seulement si tu restes en ligne ») → Metalsmith, OQ, Muster, Factory, Rookery → champs L3 à L5 → SC L5 → Levitation **[C]**.
- **Semaines 1-2** : obtenir l'armure du Grand Dragon (Keep L8, ~5 000 LBM), puis les œufs → 4 avant-postes « en moins d'une semaine » **[C]**.
- **Mur de temps** : au L10, un bâtiment met 1 à 12 jours ; au-delà, objets rares obligatoires. La progression devient alors limitée par les **objets-clés**, plus seulement par les ressources **[C]**.
- **Bascule économique** : les champs dominent le début ; ensuite le pillage (camps, joueurs) fournit l'essentiel et l'impôt passe à 0 **[C]**. Les guides conseillent de lancer les constructions longues avant de se déconnecter ou de dormir **[C]**.
- **Plafonds** : la plupart des bâtiments vont au L10-15 en début de vie du jeu, jusqu'à L20-35 dans les versions tardives (Muster L30, Home L35) **[C]**.

---

## 7. Ce qu'on peut reprendre pour un jeu de village du Père Noël basé sur les ressources

1. **Bâtiment central « Atelier du Père Noël » = Forteresse** : son niveau plafonne celui de tous les autres bâtiments et ouvre de nouveaux emplacements (+3 parcelles par niveau, comme la Forteresse L2).
2. **Producteurs à courbe +100 par niveau** (Ferme à biscuits, Scierie de sapins, Mine de charbon, Carrière de glace) : 100, 300, 600, 1 000, 1 500/h. Le gain par niveau augmente de façon arithmétique, ce qui donne une sensation constante de progrès.
3. **Coût et temps ×2 par niveau** (10 s → 20 s → 41 s → 1 min 23…) : les premiers niveaux sont instantanés et le mur arrive naturellement vers le niveau 8-10.
4. **Chaque producteur coûte surtout une ressource qu'il ne produit pas** (la Ferme demande du bois, la Mine de la nourriture), ce qui force à diversifier.
5. **Les lutins sont des ouvriers** : chaque niveau de producteur emploie des lutins (production/10). Les Maisons-chaumières donnent la capacité de lutins, et les lutins libres servent à autre chose (emballage, traîneaux).
6. **Bonheur ↔ taxe** : un curseur « exigence des cadeaux » qui rapporte de l'or mais fait partir des lutins (`bonheur = 100 − taxe + 2 × niveau du Théâtre`). Le Théâtre devient le « Chalet du chocolat chaud ».
7. **Capacité de stockage plafonnée** : la production s'arrête quand c'est plein, ce qui incite à revenir dépenser. Une capacité égale à ~100-120 h de production du bâtiment est une bonne règle.
8. **Coffre protégé (Storage Vault)** distinct de la capacité, pour un « Grinch » qui vole une partie des stocks non protégés (version PvE douce).
9. **Silo d'annexe à vider à la main** (relevé quotidien), opposé à la réserve principale automatique. Un geste de collecte satisfaisant.
10. **Bonus multiplicatifs empilables** : recherche +10 %/niveau, territoires conquis +5 %/niveau, boost temporaire +25 % (qui se cumule en durée, jamais en %).
11. **Recherche liée à un bâtiment** : la recherche « Biscuiterie N » exige le Labo N **et** une Ferme N, ce qui relie les deux arbres.
12. **Recherche « Lévitation » = vitesse de construction** avec `t = base / (1 + 0,1 × niv)`, pour un rendement décroissant élégant.
13. **Bâtiment de production en nombre ou en niveau** : comme pour la Garnison, construire plus d'ateliers à jouets accélère plus que les monter, ce qui crée un vrai choix d'emplacements.
14. **Un niveau = un déblocage visible** (Garnison : 1 nouveau jouet par niveau ; Sentinelle : une info de plus par niveau, par exemple l'Observatoire météo qui prévoit la tempête).
15. **Muster Point → Écurie des rennes** : +1 tournée simultanée et +capacité par tournée à chaque niveau.
16. **Officers' Quarters → Bureau des lutins-chefs** : +1 chef par niveau ; chaque tournée exige un chef ; les chefs gagnent des étoiles avec l'expérience.
17. **Mascotte qui grandit avec un bâtiment** : le Grand Dragon devient un **renne-mascotte** (ou Rudolph) qui évolue œuf → faon → adulte selon le niveau de l'Étable, avec 4 pièces d'harnais à collecter.
18. **Objets-clés de palier** (Completion Grant → « Sceau du Pôle Nord » au niveau 10) : ils cassent la pure inflation de ressources et peuvent être offerts par des quêtes ou des événements.
19. **Quêtes de construction qui remboursent le coût** (+ une petite accélération) : l'onboarding est fluide et le joueur est guidé sans frustration.
20. **Accélérations en paliers fixes** (1 min, 5 min, 15 min, 1 h, 8 h, 24 h) offertes par les quêtes plutôt que vendues.
21. **Contrées sauvages → forêts enneigées à « adopter »** : chacune donne +5 %/niveau à une ressource, avec un plafond de nombre fixé par le bâtiment central.
22. **Annexes thématiques** (avant-postes) débloquées par un œuf ou une clé : Village des Elfes, Mine de cristaux… Chacune a son bâtiment spécial et une bonus unique (×1,5 de population, ×2 de production).
23. **Construction longue lancée avant de partir** : la production et les chantiers avancent hors ligne, et le jeu propose des chantiers longs « pour la nuit ».
24. **Entretien optionnel** : la nourriture consommée par les lutins (chocolat/heure), sans mort, juste un blocage à 0. La simplification de HotD montre qu'on peut aussi le supprimer.
25. **Power/score qui double par niveau** : c'est l'indicateur unique de progression (« Esprit de Noël »).

---

## Sources
- Wiki Fandom Dragons of Atlantis (wikitext lu via l'API MediaWiki publique) : pages *Buildings, Fortress, Home, Garrison, Farms, Quarry, Mine, Lumber, Storage Vault, Science Center, Metalsmith, Officer's Quarters, Rookery, Training Camp, Muster Point, Wall, Dragon Keep, Sentinel, Factory, Theater, Silo, Population, Tax, Resources, Research, Levitation, Great Dragon, Outposts, Wilderness, Quests, FAQs, Guide:Beginner's Guide, Items:Speed Up, Items:Resource Boosts, Items: Completion Grant, Trade, Marketplace, Field* — https://dragonsofatlantis.fandom.com/wiki/Buildings (et pages liées)
- Wiki Fandom *Dragons of Atlantis: Heirs of the Dragon* : *Fortress, Farm, Home, Storage Vault, Garrison, Science Center, Muster Point, Wall, Healing Pool* — https://dragons-of-atlantis-heirs-of-the-dragon.fandom.com/wiki/Farm
- New City Guide (doatools) — https://doatools.wordpress.com/guides/new-city-guide/
- Newbie Walkthrough (princesslilo, 2011-2012) — https://princesslilo.wordpress.com/2011/04/27/dragons-of-atlantis-newbie-walkthrough/
- Guide débutants (GameYum) — https://www.gameyum.com/other-strategy-games/108329-strategy-guide-to-dragons-of-atlantis-for-beginners-and-low-power-players/
- DoA Full Review (doawiki) — https://doawiki.wordpress.com/doa-full-review/
- Atwiki japonais DoA (coûts de Home, extrait de recherche seulement) — https://w.atwiki.jp/dragonsofatlantis/pages/26.html
- Non accessibles : web.archive.org (bloqué par l'outil), community.gaeamobile.com (domaine non autorisé), support.decagames.com (403).
