# Bid Master : Auction Tycoon — inventaire des bâtiments et systèmes (état 2025-2026)

> Recherche faite le 4 novembre 2026. Légende : **[C]** = confirmé par au moins une source citée ; **[I]** = déduit (recoupement, logique du genre, ou une seule source peu fiable) ; **[U]** = observation du porteur de projet (capture d'écran ou partie jouée), non retrouvée en ligne.

## 0. Identification du jeu

- **Le bon jeu** : *Bid Master : auction tycoon* (Android, éditeur **Hydodo**, package `com.bid.master.war.auction.battle`, plus de 10 M de téléchargements, note de 4,3) **[C]**. Sur iOS : *Bid Master : Auction Game*, id 6453025143. Le vendeur est **EYEWIND LIMITED** ; l'ancienne fiche indiquait SHENZHEN BRAINPOWER TECHNOLOGY. Les adresses de support sont Hydodo.apps.feedback@… et Focus.apps.feedback@… **[C]**. En France, le titre affiché est « Bid Master : enchère tycoon » **[C]**.
- **Jeux à ne pas confondre** : *Bid Wars 1/2/3* (Aliens LLC), *Storage Hunter*, *Pawn Shop Master*. Beaucoup de guides en ligne portent sur Bid Wars 3, dont le monteur de ville, le Scrapyard et les « Big 5 ». Je les ai **exclus** du rapport.
- **Version** : la plus récente est la 0.9.1 (26 oct. 2026). Sur Android, la dernière mise à jour date du 3 sept. 2026. Le jeu est sorti début 2024 (v0.3.6, 5 févr. 2024) **[C]**.
- **Qualité des sources** : il n'existe ni wiki fandom ni fil Reddit utile. La matière vient de la fiche Google Play (EN et FR), des notes de version de l'App Store (v0.3.6 à 0.9.1) et d'environ 480 avis App Store (US, GB, CA, AU, FR) lus par flux RSS. S'y ajoutent un site de guides (iofreeonline, au **ton en partie généré par IA**, donc ses détails sont marqués [I] quand rien ne les recoupe) et des titres de vidéos YouTube. Les noms français des bâtiments viennent surtout de l'observation [U]. Les mécaniques chiffrées (taux de réussite, durées) viennent des avis de joueurs.

---

## 1. Boucle principale

1. **Énergie → enchère d'entrepôt** : chaque entrée en enchère coûte de l'énergie, environ « 10 éclairs » d'après un avis [C]. La réserve est plafonnée, à 60/60 sur l'écran observé [U], et se recharge lentement [C]. Les enchères spéciales (motos, voitures, etc.) coûtent en plus des lingots d'or, par exemple 7 lingots pour l'enchère moto [C].
2. **Inspection puis enchère** contre des IA qui bluffent et font monter les prix, ainsi que contre d'autres joueurs dans les enchères mondiales [C]. Des objets consommables, payés en lingots, font gagner l'enchère plus vite ou réduisent la concurrence [C]. À la fin, la valeur gagnée est « amputée de 20 % si on n'utilise pas de lingots » [C].
3. **Rapatriement à l'Entrepôt (inventaire)** : environ 150 emplacements [C]. Un écart entre la valeur affichée pendant l'enchère et la valeur réelle à l'entrepôt revient très souvent dans les plaintes [C].
4. **Traitement des objets** :
   - **Identification / expertise** au « College », qui correspond à l'Institut d'expertise [C/U]. Elle dure environ 1 h et n'a qu'un emplacement [C]. Taux de réussite : environ 40 % en cash, environ 70 % avec une pub, environ 90 % en lingots [C]. Un objet non expertisé « vaut 4 fois moins » [C].
   - **Réparation / restauration** à l'Atelier de réparation, avec la même grille 40/70/90 % [C]. L'échec peut casser l'objet, qui exige alors de l'or [C]. Selon un guide, réparer peut doubler ou tripler le prix [I].
   - Un **Serrurier** (« lock smith ») impose aussi une attente [C]. Il ouvre probablement les coffres et caisses verrouillés [I].
5. **Débouché de l'objet**, au choix :
   - le **vendre au Prêteur sur gages**, où les offres arrivent avec un minuteur de 1 à 12 h selon la rareté. Garder l'objet plus longtemps attire plusieurs offres, de 50 à 60 % plus élevées [C] ;
   - l'**exposer au Musée** (objets authentifiés seulement), qui génère un revenu passif et attire des touristes [C] ;
   - le **garder pour une collection** ou une quête (« exhibit 4 items in the museum », « obtenir une pièce d'équipement moto ») [C] ;
   - l'**échanger** contre un objet potentiellement meilleur [C] ;
   - s'il s'agit d'une **voiture**, la remettre en état à l'usine puis la vendre au Magasin de voitures ou l'exposer au Garage [C].
6. **Réinvestir le cash** : améliorer les bâtiments, acheter des biens qui rapportent (appartements, hôtel, gare, etc.), débloquer de nouvelles villes et cartes d'enchères [C].
7. **Méta** : les quêtes de chapitre (« chapitre 58 », « chapitre 73 », « Phase 26 ») font avancer le joueur et débloquent les bâtiments [C].

> Ce qui donne sa force à la boucle : un objet gagné **passe par 2 ou 3 bâtiments** (expertise → réparation → vente ou exposition). Chaque bâtiment a donc une raison d'exister, et les minuteurs ouvrent les **sessions courtes** décrites par un joueur : « tour de 3 minutes pour vérifier deux bâtiments » [C].

---

## 2. Monnaies et ressources

| Ressource | Rôle | Comment l'obtenir | Où la dépenser |
|---|---|---|---|
| **Cash ($)** | Monnaie molle principale [C] | Ventes au Prêteur, loyers, musée, gare, entreprises, quêtes [C] | Enchères, expertise et réparation (taux faible), achat et amélioration des bâtiments, cannes à pêche (une canne à 120 000 $) [C] |
| **Lingots d'or** | Monnaie dure [C] | Quêtes, connexion quotidienne, pubs, événements, montée de niveau, achats, tirelire [C] | Expertise et réparation à 90 %, accélérations, enchères spéciales, casino, achat du club et des appartements, amélioration d'entreprises, rafraîchissement de la boutique de guilde [C] |
| **Énergie (éclairs)** | Ticket d'entrée aux enchères [C] | Recharge dans le temps, pubs, achats [C/I] | Environ 10 par enchère, même coût au niveau 1 qu'ensuite [C] |
| **Diamants** | Monnaie secondaire [C] | Missions du Dépôt de bus [C] | Usage précis inconnu [I] |
| **Points d'événement** (p. ex. City of Monopoly) | Monnaie de boutique d'événement [C] | Mini-jeu Monopoly [C] | Boutique, avec un cadre doré à 29 999 points [C] |
| **Pièces auto** (moteur, roues…) | Ressource de crafting [C] | Enchère « auto parts warehouse » [C] | Fabrication ou restauration de voitures à l'usine [C] |
| **Poissons** | Ressource de collection et de vente [C] | Pêche manuelle au quai [C] | Vente ou aquarium [C] |
| **Minerais / trésors de mine** | Ressource de progression [C] | Exploration de mine par paliers (mine de diamant…) [C] | Objectifs de palier [C/I] |
| **Actions boursières** | Spéculation [C] | Achat à la Bourse [C] | Revente (les joueurs la jugent truquée) [C] |
| **XP / niveau de commissaire-priseur** | Débloque des fonctions [C] | Enchères, quêtes [C] | Paliers (tenue de la secrétaire tous les 5 ou 10 niveaux, aujourd'hui retirée) [C] |
| **Tirelire (piggy bank)** | Réserve d'or remplie en jouant, payante pour la casser [C] | Passive | Achat réel : 100 lingots sur les 700 à 800 affichés, très mal perçu [C] |

---

## 3. Bâtiments et lieux

Abréviations de déblocage : **Q** = quête de chapitre, **€** = achat en cash, **Au** = achat en or, **Év** = événement, **Niv** = niveau.

| Bâtiment (FR / EN) | Rôle dans la boucle | Produit / consomme | Effet de l'amélioration | Déblocage |
|---|---|---|---|---|
| **Enchères / carte des entrepôts** (Enchères, Warehouse auctions : LA Storage, plage de Virginie, Greensboro, Royaume-Uni…) | Source de tous les objets [C] | Consomme énergie et cash (or pour les enchères spéciales) ; produit des objets [C] | Les nouveaux niveaux montent en valeur et en mise [C] ; boss levels [C] | Progression par niveaux et chapitres [C] |
| **Entrepôt** (inventaire, Warehouse) | Stock des objets non traités [C] | Environ 150 emplacements [C] | Plus de capacité [I] | Départ [C] |
| **Prêteur sur gages** (Pawn Shop) | Vente des objets [C] | Objet → offres en cash, sur 1 à 12 h [C] | Plus d'emplacements de vente, offres plus rapides ou plus hautes [I] (les joueurs réclament « more sell spots ») [C] | Départ, amélioration demandée pour accéder à la Métropole [I] |
| **Institut d'expertise** (College / appraiser / research) | Identifie et authentifie l'objet, et multiplie sa valeur [C] | Cash (40 %), pub (70 %) ou or (90 %) ; 1 h ; 1 emplacement [C] | Plus d'emplacements demandés [C], durée et taux [I] | Tôt (Q) [C] |
| **Atelier de réparation** (Repair shop) | Restaure l'objet et augmente sa valeur [C] | Même grille cash / pub / or ; peut détruire l'objet [C] | Durée, emplacements [I] | Tôt (Q) [C] |
| **Serrurier** (Locksmith) | Ouvre les contenants verrouillés [I], avec minuteur [C] | Temps et cash [I] | Durée [I] | Q [I] |
| **Musée** | Expose les objets authentifiés : revenu passif, touristes, sets [C] | Objets → cash passif ; touristes recrutés par pub pour doubler le gain [C] | **Étages** : le 3ᵉ étage est arrivé avec la saison S4 (v0.6.3) [C] ; plus de vitrines [I] | Q « exposer 4 objets » vers la Phase 26 [C] |
| **Bibliothèque** (Library) | Lieu « utile » cité dans l'avis « every location feels purposeful » [C]. Fonction exacte non documentée : catalogue ou codex des objets possédés [I] | ? | ? | ? |
| **Banque** (Bank) | Visitée régulièrement [C]. Probablement dépôt, intérêts ou prêt [I] | Cash [I] | Taux et plafond [I] | ? |
| **Bourse** (Stock exchange) | Achat et vente d'actions, avec objectifs de quête [C] | Cash ↔ actions [C] | — | Q [C] |
| **Appartements / logements** (Apartments) | Location : loyer à collecter [C] | Achat en cash ou en or ; environ 30 $/jour au début [C] | Chaque appartement en débloque un autre, plus cher [C] | € ou Au [C] |
| **Hôtel cinq étoiles** | Loyers élevés [C] | Gros investissement, gros revenu passif [C/I] | Revenu [I] | € (tard) [I] |
| **Club / boîte de nuit** (Nightclub) | Bâtiment de prestige et de revenu, avec une « secrétaire » [C] | Achat en or [C] | ? | Au [C] |
| **Restaurant** | Mini-jeu de cuisine pour servir les clients et gagner du cash [C] | Temps de jeu actif → cash [C] | Recettes et revenu [I] | Q [I] |
| **Station-service** (Gas station) | Entreprise à revenu [C] | Cash passif [C/I] | Revenu [I] | Q [I] |
| **Quai, pêche, aquarium** (Wharf, Fishery, Fish aquarium) | Pêche manuelle de poissons rares, vendus ou mis en aquarium [C] | Cannes (jusqu'à 120 000 $) → poissons [C] | Meilleures cannes = meilleurs poissons [C] | Q [I] |
| **Usine automobile** (Car factory / Car processing) | Assemble ou restaure des véhicules à partir de pièces [C] | Pièces (moteur, roues…) → voitures [C] | Capacité ; manager possible [C/I] | Q [I] |
| **Magasin de voitures** (Car sales) | Vend motos, voitures, camions [C] | Voitures → cash [C] | Revenu ; manager [C/I] | Q [I] |
| **Garage** (v0.6.1) | Expose ses voitures et rapporte un revenu [C] | Voitures exposées → cash et prestige [C] | Places [I] | v0.6.1 [C] |
| **Entrepôt de pièces auto** (Auto parts warehouse) | Enchère dédiée aux pièces [C] | Énergie et cash → pièces [C] | — | Q [I] |
| **Usine de traitement des déchets / décharge** (Garbage treatment plant, trash dump) | Recycle les objets sans valeur [C/I] | Déchets → cash [I] | Manager absent, demandé par les joueurs [C] | € [C] |
| **Dépôt de bus** puis **Centre de transport de la Métropole** (Bus depot / Transport Center, « gare », v0.8.5) | Missions qui rapportent des diamants ; gérer sa gare [C] | Revenu horaire [C/I]. Le bénéfice de la gare a été « divisé par 10 » par un patch [C] | Augmenter le revenu de base [I] | Métropole [C] |
| **Casino** (machines à sous, BLACK 21, Lucky Dice) | Puits de cash et d'or, 10 tirages par jour [C] | Mises en cash ou en or [C] | — | Q (tâche « 2 tirages aux rouleaux ») [C] |
| **City of Monopoly** | Mini-jeu de plateau avec boutique à points [C] | Dés → points et prix [C] | — | Év (v0.5.7) puis permanent [C/I] |
| **Mine** (Mystic Adventure : mine de diamant, paliers) | Exploration à paliers, objets à collecter [C] | Temps → trésors [C] | Paliers successifs [C] | Q [C] |
| **Aventure secrète / donjon** (Secret realm, carte maya…) | Donjons, monstres, coffres [C] | Énergie ou tickets [I] → trésors [C] | Saisons [C] | v0.5.6 [C] |
| **Agence de voyage chasse au trésor** (Treasure hunting travel agency) | Cartes d'entrepôts saisonnières (S1…) [C] | Énergie → collections [C] | Nouvelles cartes à chaque saison [C] | Saisons [C] |
| **Maison de l'inventeur** (v0.6.3) | Lieu spécial [C], fonction non documentée [I] | ? | ? | Év [C] |
| **Métropole** (v0.7.0) | 2ᵉ grande carte « fin de partie » : propriétés commerciales, maison de rêve [C] | Cash → revenu horaire, même hors ligne [C/I] | Niveaux de propriété ; coffre plafonné à vider [I] | Niveau, cash et progression initiale [C/I] |
| **Maison de rêve / villa** (v0.7.0, v0.8.1) | Logement personnel à construire et décorer [C] | Cash ou or → prestige [I] | Pièces, déco [I] | Q / € [I] |
| **Zone de bataille de la Métropole** (v0.7.7) | Guerre de territoires entre joueurs ou guildes [C] | ? → contrôle de quartier [C] | — | Guilde [I] |
| **Quartier chaotique** (Chaotic district) | Zone citée par un joueur [C] | ? | ? | ? |
| **Manoir du collectionneur** (v0.9.x) | Construire et gérer son manoir [C] | Cash, or, objets [I] | Ailes et pièces [I] | Tard [C/I] |
| **Cour des familiers** (Pet Courtyard, v0.9.x ; système d'animaux v0.8.1) | Interaction avec les animaux et croissance [C] | Nourriture et soins [I] → bonus [I] | Croissance de l'animal [C] | v0.8.1 [C] |
| **Base et propriétés de guilde** (v0.8.7) | Bâtiments collectifs [C] | Contributions [I] | Niveaux collectifs [I] | Guilde [C] |
| **Corporation** | [U] Probablement la guilde, ou une holding qui regroupe les entreprises [I] | ? | ? | ? |
| **Bureau de la secrétaire** | Aide : rappels et collecte [C/I]. Tenues tous les 5 ou 10 niveaux [C] | — | Améliorations des fonctions (v0.3.9) [C] | Départ [C] |

**Managers** : certaines entreprises acceptent un manager qui les automatise, pas toutes (« add more managers… garbage plant, car factory, car sales ») [C]. L'algorithme de choix des managers a changé en 2026 [C].

---

## 4. Systèmes méta

- **Énergie** : jauge plafonnée, 60/60 à l'écran [U]. Environ 10 par enchère [C]. Recharge lente, coût fixe quel que soit le niveau (critiqué) [C]. Une fois l'énergie et le cash épuisés, on ne peut plus rejouer « en bas » de la carte [C].
- **Minuteurs omniprésents** : expertise 1 h, réparation plusieurs heures, vente de 1 à 12 h, serrurier [C]. Une ou deux pubs divisent le temps (de 1 h à 30 min) [C]. Les minuteurs ne tournent pas toujours hors ligne (bug signalé) [C].
- **Taux de réussite à trois niveaux** (cash 40 %, pub 70 %, or 90 %) : c'est le principal levier de monétisation et la première source de frustration [C].
- **Événements limités** (tous [C]) : Nouvel An (lingots, BLACK 21, Lucky Dice), Halloween (lanternes, « Castle Treasure », enchère limitée), Noël (marché de Noël, Défi et Vœux de Noël), Thanksgiving (connexion), roue d'or (3 200 lingots), loterie de camions et de skins (robots, hélicoptère), enchères blind box, enchère maritime (navires), Treasure Inn (voitures), valises abandonnées, trésors des grands fonds, Cross-Era (années 1970 à 2025), « Resource Aid », retour 3 jours.
- **Événements narratifs** (tous [C]) : *Lost Treasure / The Lost City* (arbre de décisions de plus de 30 branches, objet clé « Star Compass »), *Visitor in the Fog* (indices, fins Cash, Or et SSS), mode enquête et puzzle, chasse au trésor en plusieurs phases. Les bonnes fins donnent des objets de collection, les mauvaises fins des consolations en cash ou en or.
- **Collections et sets** : plus de 1 000 objets avec des raretés jusqu'à Légendaire [C/I]. Le musée sert à compléter des sets, avec des bonus de set [I]. Les collectionneurs paient plus pour les pièces de set [I].
- **Rôles / personnage** : avatar et skins, version chibi du héros (v0.4.2), cadres d'avatar, montures [C]. La secrétaire est un PNJ guide [C]. « Rôle » [U] : écran de profil (tenue, titre, statut de commissaire-priseur) [I].
- **Guilde** (v0.5.4) : amis, chat, classements, compétitions et guerres d'enchères, connexion de guilde, boutique de guilde rafraîchissable en or, base et propriétés de guilde, territoires en Métropole [C].
- **Saisons** : S1 de l'agence de voyage en 2024, S4 en février 2025 (musée au 3ᵉ étage), S7 en août 2025 [C].
- **VIP** : abonnement d'environ 19,99 $ ou 30 jours, censé supprimer les pubs. Il est plafonné à environ 30 « clics pub » gratuits, ce que les joueurs jugent trompeur [C].
- **Revenus hors ligne / idle** : loyers, musée, gare et entreprises accumulent hors ligne ; les managers automatisent [C/I]. Il faut se connecter régulièrement parce que les coffres plafonnent [I].
- **Quotidien** : connexion 7 jours (v0.3.9), récompenses quotidiennes, 10 tirages de casino par jour, pubs ×2 sur les gains [C].
- **Monétisation** : pubs récompensées partout, lingots, tirelire, packs, pass, VIP [C].

---

## 5. Rythme de progression

- **Début** : tutoriel long (plus de 15 min) et bloquant [C]. Enchères rentables tout de suite, puis apparition progressive de l'expertise, de la réparation, du prêteur et du musée [C].
- **Milieu** (niveaux 13 à 30, chapitres 20 à 60) : un nouveau bâtiment ou mini-jeu arrive presque à chaque chapitre (casino, pêche, mine, bourse, appartements, usine) [C]. C'est la phase la plus appréciée : « lots of different buildings that have mini games… something to do in between objectives » [C]. Il faut environ 8 h pour débloquer la 2ᵉ ville [C/I].
- **Fin** (chapitres 70 et plus, Métropole, manoir) : les objectifs à six chiffres ralentissent fortement la progression (« things are $100k+ ») [C]. Les joueurs se plaignent d'un manque de contenu compétitif en fin de partie [C].
- **Cadence des contenus** : une mise à jour toutes les 4 à 8 semaines, et toujours un événement saisonnier [C].
- **Points faibles à éviter** : pubs obligatoires, échecs aléatoires qui font perdre la mise, écart entre valeur affichée et valeur réelle, quêtes bloquées par un RNG ou un bug, VIP trompeur [C].

---

## 6. Idées à reprendre pour un jeu de village du Père Noël basé sur les ressources

1. **Chaque objet passe par plusieurs bâtiments.** Un « paquet mystère » gagné passe à l'Atelier de déballage, puis au Contrôle qualité des lutins, puis à l'Emballage. Il finit dans la Hotte (livraison) ou au Musée des jouets. C'est ce qui donne une utilité à chaque bâtiment.
2. **Ventes aux enchères de traîneaux perdus ou de colis non distribués**, à l'énergie (« Rennes 60/60 »). Les entrées n'ont pas toutes le même coût, mais un coût **qui progresse avec le niveau** (corrige la critique du coût fixe).
3. **Bureau d'expertise des lutins** avec trois options : rapide, sûre (plus lente) ou en « poudre d'étoile ». **Échec doux** : jamais de perte de l'objet, seulement du temps (corrige la frustration principale).
4. **Atelier de réparation** : un jouet cassé coûte ×0,3, un jouet réparé ×1, un jouet peint ×1,5. Les paliers de valeur restent lisibles.
5. **Marché du village** (le prêteur sur gages) : des offres de PNJ arrivent dans le temps. **Attendre donne de meilleures offres**, ce qui crée un vrai choix entre vendre tout de suite et patienter.
6. **Musée des jouets anciens à étages** : chaque étage est un thème (bois, mécanique, poupées). Exposer rapporte un revenu passif et attire des visiteurs. **Bonus de set complet**, nouvel étage débloqué à chaque saison.
7. **Bibliothèque des contes**, véritable codex : chaque objet découvert entre au catalogue. Compléter une page rapporte de l'XP ou un bonus permanent.
8. **Entrepôt à capacité limitée** (par exemple 30 au départ), qu'on améliore. La tension du « stock plein » pousse à traiter les objets.
9. **Maisons des lutins (appartements)** qui rapportent un **loyer en cookies**. Chaque maison achetée débloque la suivante, plus chère et plus rentable.
10. **Managers lutins** qui automatisent un bâtiment après un certain niveau. **Tous les bâtiments doivent pouvoir en avoir un** (frustration notée chez Bid Master).
11. **Usine à traîneaux** : on assemble des pièces (patins, harnais, clochettes) gagnées aux enchères spéciales. Le traîneau fini se vend ou s'expose au **Garage des traîneaux**, qui rapporte du prestige.
12. **Pêche sur le lac gelé et aquarium**, en mini-jeu actif et facultatif qui rapporte une ressource de collection. Une **version automatisée** se débloque ensuite.
13. **Mine de cristaux de glace à paliers** (Mystic Adventure), qui alimente l'électricité magique ou les décorations.
14. **Gare du Pôle (Transport Center)** : un train de livraison avec un revenu horaire et des missions qui rapportent une monnaie rare.
15. **Bourse aux bonbons** : prix du sucre d'orge qui fluctuent de façon **honnête et lisible** (une courbe visible, jamais truquée).
16. **Banque des étrennes** : dépôt à intérêts, déblocable, pour lisser l'économie et donner un usage au cash en excès.
17. **Mini-jeux par bâtiment**, sans casino : cuisine de biscuits au Restaurant, dés « Village-opoly » pendant un événement. Ils occupent le joueur pendant les minuteurs.
18. **Coffres plafonnés** pour les revenus hors ligne : 8 h de production maximum, ce qui invite à revenir sans punir.
19. **Une 2ᵉ carte « Métropole » = la Ville du Nord**, débloquée par le niveau et un seuil de ressources. On y passe de l'objet à l'unité à la gestion de propriétés.
20. **Événements narratifs à embranchements** (« Le Traîneau perdu dans le brouillard ») : choix, indices et fins multiples. Les bonnes fins donnent des objets de collection.
21. **Chapitres de quêtes** qui introduisent **un bâtiment par chapitre**, avec une tâche simple (« expose 4 jouets au musée »). La quête doit **dire clairement quels objets conviennent** (bug d'UX vu chez Bid Master).
22. **Secrétaire / guide** → la Mère Noël ou un lutin-intendant. Il rappelle les bâtiments prêts à collecter (badge de collecte) et change de tenue tous les 5 niveaux.
23. **Guilde → Corporation des villages** : base collective, quêtes communes, classement amical. Pas de guerre de territoires agressive.
24. **Familiers** (Cour des familiers) : rennes ou chiots qu'on nourrit et qui grandissent, avec un petit bonus passif (+x % de vitesse sur un bâtiment).
25. **Calendrier de l'Avent** = connexion de 24 jours, plus des événements saisonniers courts (Nouvel An, Chandeleur…) avec un entrepôt thématique.

---

## Sources

- Google Play, *Bid Master : auction tycoon* (Hydodo) : https://play.google.com/store/apps/details?id=com.bid.master.war.auction.battle (description EN et FR, Quoi de neuf, avis)
- App Store US, description et historique des versions 0.3.6 à 0.9.1 : https://apps.apple.com/us/app/bid-master/id6453025143
- App Store FR, « Bid Master : enchère tycoon » (avis FR, Nouveautés) : https://apps.apple.com/fr/app/bid-master/id6453025143
- Avis App Store par flux RSS (US, GB, CA, AU, FR, 481 avis) : https://itunes.apple.com/us/rss/customerreviews/page=1/id=6453025143/sortby=mostrecent/json (même modèle pour les autres pays)
- iofreeonline, page du jeu, Walkthrough (Métropole) et Specials (Lost City, Visitor in the Fog) ; contenu partiellement généré, à prendre avec précaution : https://www.iofreeonline.com/IOS/game/Bid-Master.html, …/pages/Walkthrough.html, …/pages/Specials.html
- BlueStacks, fiche du jeu : https://www.bluestacks.com/pl/apps/casual/bid-master-auction-tycoon-on-pc.html
- grand-screen, test du jeu : https://grand-screen.com/games/bid-master-auction-tycoon/
- YouTube, titres seulement (« COMPLETE TIPS & TUTORIALS FOR PLAYING THE BID MASTER AUCTION TYCOON GAME », « [Bid Master] How to get the Star Compass | Lost Treasure », « [Bid Master - Visitor in the Fog] All Endings ») : recherche https://www.youtube.com/results?search_query=bid+master+auction+tycoon
- Pour écarter les jeux homonymes : guide Bid Wars 3 de LevelWinner, https://www.levelwinner.com/?p=104198 (jeu différent, non utilisé)
