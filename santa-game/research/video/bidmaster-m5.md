# Bid Master : analyse image par image de la minute 5 (5:00 à 5:59)

Source : enregistrement iPhone 888×1920, 60 i/s. J'ai lu les 30 planches de `sheets/m5` (une image toutes les 0,25 s), les 31 captures `sc/t5m*.jpg`, plus des extractions ffmpeg à 10, 20 et 30 i/s sur les moments ambigus (début de l'enchère, compteur d'estimation, apparition des bulles et de la boutique, marteau, ramassage de la statue, classement). Pour le contexte, j'ai aussi lu la dernière planche de la minute 4 (4:58 à 4:59).
Tout ce qui suit a été vu. Une déduction est signalée par « (déduit) », un point illisible ou incertain par [?].
La vidéo ne montre pas les doigts du joueur : on ne voit pas où il touche. Je situe donc chaque toucher par la réaction de l'interface (bouton qui change d'état, popup qui s'ouvre).

Contenu de la minute : la fin de la phase d'estimation, une **vente aux enchères complète** (une statue), une boutique ouverte au milieu de l'enchère, la calculatrice, le marteau, le bilan, la carte de l'objet, le classement, la Roue de la Fortune et l'écran de chargement dans la voiture.

---

## 1. Chronologie

### Contexte (fin de la minute 4, pour comprendre 5:00)
- 4:58.00 — **Phase d'estimation.** Un bandeau sombre en haut affiche, en jaune : « Cliquez sur un article pour estimer son prix ! ». Une petite bulle blanche sort du bord droit avec un chiffre qui décompte : « 3 » (4:58.00 à 4:58.25), « 2 » (4:58.50 à 4:59.25), puis « 1 » (4:59.50 à 5:00.45). Ce sont environ 3 s d'estimation. Au-dessus de la statue, une jauge cyan se vide et se remplit, et une loupe bleue (un cercle) se déplace sur la statue à chaque toucher. Seul bouton : « franchir », en vert-gris kaki et centré. Il n'y a encore ni outils ni « offre ».
- 4:59.00 — Une étiquette cyan apparaît au-dessus de la statue : « Valeur possible $21,336 ? ».
- 4:59.25 à 5:00.00 — Une bulle jaune d'estimation (icône parchemin + loupe) pousse au-dessus de l'avatar du joueur. Sa valeur monte : $9,875+, $16,356+, $20,177+, puis $21,336+.

### Ouverture de l'enchère
- 5:00.00 à 5:00.45 — Même écran d'estimation, avec le chiffre « 1 » et la bulle « $21,336+ ».
- 5:00.50 — **Coupure franche vers la phase d'enchère, sans fondu.** Le bandeau, la jauge, la loupe et la bulle « 1 » disparaissent. En même temps :
  - la bulle du commissaire-priseur s'ouvre en « pop » : elle grandit en ≈ 0,1 s depuis sa pointe (le bord droit), avec un léger rebond. Texte : « qui est prêt à enchérir $10,080 » (le nombre est coupé sur deux lignes : « $10, / 080 ») ;
  - en bas à gauche apparaissent la pastille « ⚡ SPEED X2 › » et trois emplacements d'outils (botte « + », tomate « + », calculatrice « 2 ») ;
  - le bouton kaki laisse la place à deux boutons : « franchir » (rouge, à gauche, plus étroit) et « offre » (vert, à droite, plus large).
- 5:01.25 à 5:02.25 — **La bulle d'estimation redescend comme un compteur.** Relevé à 10 i/s : 21,336 → 20,274 → 18,819 → 17,530 → 16,404 → 15,443 → 14,647 → 14,016 → 13,550 → 13,249 → 13,112, puis elle se fige sur **$13,104+**. Elle décélère en ≈ 1,2 s. L'estimation affichée se fixe donc *après* le début de l'enchère.
- 5:03.00 (toucher vers 5:02.9 sur l'outil tomate, déduit) — **Popup « Nous n'avons plus de »** (titre tronqué). Elle apparaît sans animation, et le fond s'assombrit à ≈ 60 %. Bandeau orangé en haut avec « ✕ » blanc. Au centre, une icône de tomate sur un socle sombre, avec le chiffre « 9 ». Texte : « Confondre les adversaires en oubliant d'ench / érir » (le mot est coupé). Bouton jaune « [lingot] 2 ». Lecture : un lot de 9 tomates coûte 2 lingots.
- 5:04.25 — Popup fermée par « ✕ » (déduit), et la scène redevient claire.
- 5:04.50 — Le chauve à lunettes noires (Ting, voir le classement) dit **« Je veux ceci »** dans une petite bulle blanche.
- 5:05.00 (toucher vers 5:04.9 sur l'outil botte, déduit) — **Popup « Je n'ai plus de bottes ! »**, au même gabarit. Icône : une botte jaune, « 3 ». Texte : « Achetez des bottes pour chasser un adversaire ». Bouton « [lingot] 2 ». Derrière le voile, l'enchère **continue** : l'étiquette « $10,080 » s'affiche au-dessus du chauve, puis à 5:05.50 la bulle du commissaire change pour « Est-ce que quelqu'un d'autre enchérit ? $10,780 ».
- 5:06.00 — Popup fermée. On voit alors une bulle rouge et blanche avec un numéro (« 7? », presque masqué [?]) derrière la tête de la vieille dame : c'est la pancarte que le chauve tient levée.

### Boutique au milieu de l'enchère
- 5:06.50 — **La boutique s'ouvre** (déclencheur [?] : peut-être le bouton « SPEED X2 › », puisque SPEED X2 est un avantage VIP). Animation : à 20 i/s, la fenêtre part de ≈ 30 % de sa taille au centre et atteint ≈ 105 % en ≈ 0,2 s, puis revient à 100 % (rebond). En même temps, un **second HUD** (celui de la ville) apparaît en haut : avatar avec niveau « 19 », énergie « (01:40 +1) 50/60 », lingots 309, billets 16.21K, badges « VIP » et « Grand Capitaliste », roue dentée.
- 5:06.75 — Onglet **VIP** (détail en section 2).
- 5:08.00 — Onglet **coffret cadeau** (toucher ≈ 5:07.9).
- 5:08.75 — Onglet **Monnaie Rare**.
- 5:09.00 — Onglet **billet de banque**.
- 5:09.50 — Retour à l'onglet **VIP**.
- Pendant tout ce temps, le minuteur d'énergie défile : 01:40 → 01:39 → 01:38 → 01:37.
- 5:10.50 — « non merci » touché (≈ 5:10.4). La boutique **disparaît en une image**, sans animation de sortie. L'enchère reprend au même point (« Est-ce que quelqu'un d'autre enchérit ? $10,780 », étiquette $10,080 sur le chauve). Elle semble donc avoir été **mise en pause** pendant la boutique (déduit des durées, voir le rythme plus bas).

### Calculatrice
- 5:11.75 (toucher sur la calculatrice ≈ 5:11.7) — **Popup « Utilisez une calculatrice »** (bandeau orangé, « ✕ »). Un champ beige affiche « $13,440 - $20,160 », suivi du texte « Le prix actuel en entrepôt se situe à peu près dans la fourchette de prix totale » et d'un bouton jaune **« Confirmer »**, écrit en lettres blanches à contour. Dès l'ouverture de la popup, le compteur de la calculatrice passe de 2 à 1, et une étiquette verte « $13,440-$20,160 » apparaît au-dessus des outils.
- 5:13.00 — « Confirmer » touché (≈ 5:12.95). La popup se ferme. L'étiquette verte de fourchette reste affichée jusqu'à la fin de l'enchère.

### Les enchères
- 5:13.50 — **Assombrissement en vignette** : un dégradé noir part des bords, le centre reste plus clair, et le HUD s'estompe. L'indicateur d'accueil iOS devient blanc. La bulle se rouvre en « pop » : « Y a-t-il d'autres offres ? Vente aux enchères 1ère fois! », avec cette fois un liseré rouge sur le côté droit.
- 5:14.00 — L'ouvrier (casque blanc, gilet orange) lève sa pancarte « 90 » (on lit « 06 » quand elle tourne) en disant **« Ne rivalise pas avec moi »**.
- 5:14.50 — L'étiquette « **$10,780** » s'affiche au-dessus de l'ouvrier.
- 5:15.00 — La scène se rallume. Nouvelle demande : « qui est prêt à enchérir $11,480 ».
- 5:15.75 — **Le joueur enchérit** (« offre » touché ≈ 5:15.6). L'avatar du joueur (blonde en robe rouge, « Edie ») lève sa pancarte « **11** » et dit **« ici »**. Les **deux boutons deviennent gris** : on ne peut pas surenchérir sur soi-même. La bulle d'estimation $13,104+ disparaît.
- 5:16.25 — L'étiquette « **$11,480** » s'affiche au-dessus du joueur.
- 5:17.25 — « je peux entendre $12,180 ».
- 5:18.50 — Le cowboy (chapeau blanc, étoile de shérif) lève la main et dit **« ici »**. « franchir » redevient **rouge** tout de suite, mais « offre » reste gris.
- 5:19.00 — L'étiquette « **$12,180** » pousse au-dessus du cowboy : petite à 5:19.00, à pleine taille à 5:19.25.
- 5:19.50 — « Et maintenant? $12,880 ». « offre » redevient **vert** au moment de cette annonce.
- 5:21.25 — Ting (le chauve) : **« Désolé, je le veux »** ; le cowboy : **« Tu dois être en train de plaisanter. »** (deux bulles en même temps).
- 5:22.00 — L'étiquette « **$12,880** » s'affiche au-dessus de Ting.
- 5:22.25 — « qui est prêt à enchérir $13,580 ».
- 5:24.50 — Vignette sombre. 5:24.75 — « Y a-t-il d'autres offres ? Vente aux enchères 1ère fois! ».
- 5:25.00 — Le cowboy, pancarte levée (numéro « 52 » ou « 25 » [?]) : **« Je vais forcément gagner ! »**.
- 5:25.75 — L'étiquette « **$13,580** » s'affiche au-dessus du cowboy. 5:26.00 — La scène se rallume.
- 5:26.25 — « je peux entendre $14,280 ».
- 5:27.75 — Ting : **« Ne rivalise pas avec moi »** ; le cowboy : **« Tu es sérieux ? »**.
- 5:28.50 — L'étiquette « **$14,280** » s'affiche au-dessus de Ting.
- 5:28.75 — « Et maintenant? $14,980 ».
- 5:29.00 à 5:30.00 — Ting : **« Je suis déterminé à l'avoir ! »**, une réplique d'ambiance alors qu'il est déjà le meilleur enchérisseur.
- 5:30.25 — Le cowboy : **« ici »**. 5:30.75 — L'étiquette « **$14,980** » s'affiche au-dessus du cowboy.
- 5:31.25 — « Et maintenant? $15,680 ».
- 5:33.50 — Vignette sombre. 5:33.75 — « Y a-t-il d'autres offres ? Vente aux enchères 1ère fois! ».
- 5:36.75 — **Deuxième palier : la bulle change de style.** Elle est plus grande, a une bordure rouge épaisse, deux points d'exclamation rouges en haut à gauche et des traits d'éclat rouges en haut à droite. Texte : **« Compte à rebours 3 secondes ! Vente aux enchères 2ème fois! »**. Le joueur, lui, devient plus sombre que la scène.
- 5:37.25 — **Le joueur enchérit en pleine dernière ligne droite** (toucher ≈ 5:37.1) : « ici », pancarte 11, boutons gris. Le cowboy réagit : **« Incroyable . »** (avec l'espace avant le point).
- 5:37.75 — L'étiquette « **$15,680** » s'affiche au-dessus du joueur. La scène reste sombre jusqu'à 5:38.5.
- 5:38.75 — La scène se rallume. « je peux entendre $16,380 », d'abord en petit puis en grand dès 5:39.00. **Personne ne répond.**
- 5:40.75 — Vignette sombre + « Y a-t-il d'autres offres ? Vente aux enchères 1ère fois! ».
- 5:43.75 — « Compte à rebours 3 secondes ! Vente aux enchères 2ème fois! ».
- 5:46.75 — **Adjudication.** La scène se rallume. Un **marteau doré** apparaît en haut à droite à côté d'un socle en bois : petit à 5:46.60, grand à 5:46.70. Il frappe en se balançant (≈ 3 oscillations visibles en 0,5 s à 30 i/s, angle de −40° à +20° environ) et reste animé jusqu'à 5:47.6. Une bulle rouge du même style dit **« Vendu! »**.
- 5:47.75 — **Bilan.** Le marteau, la bulle, les outils, SPEED X2 et les boutons disparaissent. En haut, en blanc à contour : « Cliquez sur l'article pour le recevoir ». En bas, un panneau gris translucide : « Payé: 15,680 / Prix estimé: 0 / Fraction: (vide) », avec le bouton jaune « Récupérez tous les objets ». **Billets : 16.21K → 528**, d'un coup, sans compteur visible. Les rivaux changent tous de pose en même temps : Ting a la main sur le front, la vieille dame la bouche ouverte, le cowboy se couvre les yeux, l'ouvrier fait la grimace, la rousse fronce les sourcils. Le joueur, les yeux fermés et souriant, agite sa pancarte « 11 » en boucle (≈ 1 aller-retour par seconde).

### Après la vente
- 5:50.50 — La statue est touchée (≈ 5:50.4). Une plaque blanche à bord orange s'affiche au-dessus d'elle : « Statue de la danseuse du vent » en petit, « $16,800 » en gros orange. Le bouton jaune devient un bouton **gris « franchir »**. « Prix estimé » défile : 0 → 1,313 (5:50.50) → 6,258 (5:50.75) → 11,199 (5:51.00) → 16,145 (5:51.25) → **16,800** (5:51.50), soit ≈ 1 s, de façon linéaire.
- 5:50.75 à 5:51.50 — La statue rétrécit légèrement. Des **confettis** multicolores (rouge, vert, bleu, jaune, rose) jaillissent de la plaque et retombent. La statue disparaît à 5:51.50 et la plaque à 5:52.00 : le socle est vide.
- 5:52.25 — « Fraction: » reçoit **« 1,120 » en vert, en très grand** (≈ 3 fois la taille finale), qui rétrécit et se pose à droite à 5:52.50. C'est un effet de « punch ».
- 5:53.50 (toucher sur « franchir » ≈ 5:53.4, déduit) — **Carte de l'objet.** Le fond s'assombrit. Une carte jaune vif avec un tourbillon rouge et orange s'ouvre en grandissant depuis ≈ 70 % (5:53.50) jusqu'à 100 % (5:53.75). En tête : une étoile rouge et « Statue de la danseuse du vent », et à droite une petite icône de catégorie (un socle ou une colonne). Une pastille porte « [billet] 16,800 », avec une petite étoile dans le coin. La statue **apparaît dans le tourbillon** à 5:54.00. Sous la carte : « Cliquez sur Continuer ».
- 5:54.45 — **Classement des enchérisseurs** (toucher ≈ 5:54.4). Une banderole jaune « Edie » avec une coupe dorée et des éclats blancs. Les 4 lignes arrivent en **glissant depuis la gauche** en ≈ 0,15 s. Les médailles 1, 2 et 3 apparaissent en « pop » à 5:54.60. L'**avatar du joueur tombe du haut** sur la banderole à ≈ 5:54.7, pancarte 11 en main. Des confettis tombent. Un bouton jaune « continuer » apparaît en fondu à 5:54.75.
- 5:55.25 — **Roue de la Fortune** (« continuer » touché ≈ 5:55.1). Elle grandit depuis le centre : petite à 5:55.25, pleine taille à 5:55.50. La roue **tourne lentement à vide**, d'environ un secteur (≈ 45°) en 2 s.
- 5:57.75 — Le « ✕ » de la roue est touché (≈ 5:57.6). **Écran de chargement dans la voiture**, sans transition visible.
- 5:57.75 à 5:59.75 — Écran fixe : le joueur ne fait plus rien.

### Rythme de l'enchère (mesuré)

| # | Montant | Enchérisseur | Annonce de la demande → réplique | Réplique → étiquette |
|---|---|---|---|---|
| 1 | $10,080 | Ting (chauve, lunettes noires) | 5:00.50 → 5:04.50 (4 s, popup tomate comprise) | ≈ 0,5 s |
| 2 | $10,780 | Ouvrier (casque, gilet orange), pancarte « 90 » | 5:05.50 → 5:14.00 (boutique et calculatrice entre-temps) | 0,5 s |
| 3 | $11,480 | **Joueur** (Edie, « 11 ») | 5:15.00 → 5:15.6 | 0,5 s |
| 4 | $12,180 | Cowboy | 5:17.25 → 5:18.50 (1,25 s) | 0,5 à 0,75 s |
| 5 | $12,880 | Ting | 5:19.50 → 5:21.25 (1,75 s) | 0,75 s |
| 6 | $13,580 | Cowboy | 5:22.25 → 5:25.00 (après « 1ère fois ») | 0,75 s |
| 7 | $14,280 | Ting | 5:26.25 → 5:27.75 (1,5 s) | 0,75 s |
| 8 | $14,980 | Cowboy | 5:28.75 → 5:30.25 (1,5 s) | 0,5 s |
| 9 | $15,680 | **Joueur**, gagnant | 5:31.25 → 5:37.1 (pendant le « 2ème fois ») | 0,6 s |
| – | $16,380 | personne | 5:38.75 → … | – |

- **Le pas est fixe : +700** à chaque enchère (10,080 → 16,380).
- Entre l'étiquette d'une enchère et la demande suivante du commissaire, il s'écoule ≈ 0,25 à 0,5 s.
- **Clôture sans nouvelle enchère** : la demande est annoncée, puis ≈ 2 à 2,25 s plus tard viennent la vignette sombre et « 1ère fois ». **3 s** plus tard arrive le « Compte à rebours 3 secondes ! 2ème fois », puis encore **3 s** plus tard le « Vendu! ». Mesures : 5:38.75 / 5:40.75 / 5:43.75 / 5:46.75, et de même 5:31.25 / 5:33.50 / 5:36.75. Il faut donc **≈ 8 s sans enchère** pour adjuger.
- **Toute enchère remet le compte à zéro**, même pendant le « 2ème fois » (5:37.25), et la lumière revient. Les rivaux répondent souvent pendant la « 1ère fois » (5:14.00, 5:25.00) : c'est le moment de tension voulu.
- Pendant la boutique, l'enchère paraît en pause : la même demande $10,780 reste affichée 8 s, dont ≈ 4 s de boutique et ≈ 1,2 s de calculatrice. En revanche, derrière la popup des bottes, l'enchère a continué. Pause des popups d'outils : [?].
- Deux rivaux ne lèvent jamais leur pancarte : la vieille dame en pull rouge et la rousse à lunettes.

### Formules déduites des chiffres vus (valeur réelle : 16,800)
- Mise de départ $10,080 = **60 %** de la valeur.
- Pas de $700 = **1/24 de la valeur** (≈ 4,2 %).
- Fourchette de la calculatrice $13,440 – $20,160 = **80 % à 120 %** de la valeur.
- Estimation finale de la bulle : $13,104+ = 78 % ; « Valeur possible $21,336 ? » = 127 %.
- Prix payé $15,680 = 93,3 % ; « Fraction » (le gain) = 16,800 − 15,680 = **1,120**.

---

## 2. Inventaire écran par écran

### A. Salle d'enchères, phase « enchère » (5:00.50 à 5:47.6)
- **Décor** : nef gothique en grisaille (piliers et arcs gris clair), grand vitrail au fond (rose, cyan, violet) et sol en losanges gris bordés de cuivre. La statue (torse féminin sans tête, couleur ivoire et or, socle doré) occupe le centre, à un tiers de la hauteur. Ce décor ne bouge jamais.
- **HUD en haut**, sur une bande grise translucide. À gauche, un carré noir avec « ⏸ » et à côté « entrepôt » en petit au-dessus de « 1/1 » (« 1 » gros, « /1 » petit). Puis un lingot doré « 309 » et un « + » orange carré, puis une liasse verte « 16.21K » et un « + » orange. Le HUD de la ville (énergie, avatar) n'est **pas** affiché ici.
- **Commissaire-priseur** : on ne le voit jamais. Seule sa bulle s'affiche, blanche, rectangulaire, avec la pointe à droite (il est hors champ à droite). Elle est placée en haut à droite, entre 1/8 et 1/6 de la hauteur. Texte noir en gras, ≈ 26 px à 740 de large. Le style passe à un liseré rouge à droite pour « 1ère fois », puis à une bordure rouge épaisse avec « !! » et des éclats pour « 2ème fois » et « Vendu! ».
- **Six personnages au premier tiers bas**, en rang serré de gauche à droite : Ting (chauve, lunettes noires, chemise à carreaux orange, blouson brun), la vieille dame (cheveux blancs, lunettes rondes, pull rouge, collier de grosses perles rouges), le cowboy (costume blanc, chapeau à fer à cheval, étoile de shérif), l'ouvrier (casque blanc, gilet orange à bandes), la rousse (queue de cheval, lunettes, haut crème) et, au premier plan à droite, **le joueur** (blonde en robe rouge, bras croisés). Au repos, ils ont une légère respiration [?]. Pour enchérir, chacun lève une pancarte ronde blanche numérotée en bordeaux (11 pour le joueur, 90 pour l'ouvrier, « 7? » pour Ting, « 52 » pour le cowboy [?]).
- **Bulles des personnages** : petites, blanches, texte noir gras, pointe vers le bas, posées au-dessus de la tête. Elles portent la réplique (« ici », « Je veux ceci »…), puis sont remplacées par l'**étiquette de prix**, une bulle blanche avec « $12,180 » en gros et un fin liseré doré en bas. L'étiquette reste au-dessus du meilleur enchérisseur du moment. Il n'y en a qu'une à l'écran.
- **Bulle d'estimation du joueur** : jaune à bord doré, icône parchemin + loupe, montant orange-rouge suivi de « + » (« $13,104+ »). Elle est au-dessus du joueur et reste jusqu'à sa première enchère.
- **SPEED X2** : pastille grise en biseau avec un éclair jaune dans un rond, « SPEED X2 » et « › ». À gauche, à ≈ 80 % de la hauteur.
- **Outils** : trois tuiles sombres en parallélogramme, sous SPEED X2. 1) botte (« + » blanc en bas à droite : stock vide) ; 2) tomate (« + » : vide) ; 3) calculatrice bleue avec un compteur (« 2 » puis « 1 »). Une fois la calculatrice utilisée, l'étiquette verte « $13,440-$20,160 » flotte au-dessus des outils.
- **Boutons** : « franchir », rouge à reflet clair, ≈ 38 % de la largeur ; « offre », vert vif, ≈ 52 %. Tous deux ont un texte blanc à ombre portée. Ils deviennent gris dégradé, sans être masqués, quand le joueur est le meilleur enchérisseur. « franchir » redevient rouge dès qu'un rival surenchérit ; « offre » seulement à la demande suivante.
- **Ce que l'écran apprend** : l'enchère est une suite de demandes à pas fixe. Le joueur ne choisit pas le montant : il accepte la demande ou passe (« franchir »). Il est en concurrence avec des rivaux scénarisés qui ont chacun leurs répliques. L'information (estimation, calculatrice) est une ressource limitée. La décision tient en une question : jusqu'où suivre par rapport à la valeur estimée.

### B. Phase « estimation » (fin de la minute 4 jusqu'à 5:00.45)
Bandeau « Cliquez sur un article pour estimer son prix ! » (jaune sur noir), bulle de décompte 3-2-1, jauge cyan au-dessus de l'objet, loupe, étiquette cyan « Valeur possible $X ? ». Un seul bouton : « franchir » en kaki, ce qui veut dire qu'on peut renoncer avant même le début. L'estimation est un mini-jeu de **tapotage chronométré** (≈ 3 s) qui donne une valeur, puis cette valeur se « corrige » en défilant.

### C. Popups « outil épuisé » (5:03 et 5:05)
Gabarit unique : carte crème ≈ 72 % de la largeur, posée au milieu. Bandeau titre orange doré avec texte blanc et « ✕ » blanc à droite. Icône de l'outil sur un socle sombre en biseau, avec la quantité du lot en blanc gras. Description grise centrée. Bouton jaune « [lingot] 2 ». En bas, une bordure crème hachurée. Le voile noir couvre ≈ 60 %. Aucune animation d'entrée.
- Tomate : titre « Nous n'avons plus de » (tronqué), lot de **9**, « Confondre les adversaires en oubliant d'enchérir ».
- Botte : « Je n'ai plus de bottes ! », lot de **3**, « Achetez des bottes pour chasser un adversaire ».
- **Ce qu'on apprend** : la botte retire un rival de l'enchère, la tomate en empêche d'enchérir. Les outils s'achètent par lots, contre la monnaie premium.

### D. Popup « Utilisez une calculatrice » (5:11.75)
Même gabarit. Champ beige « $13,440 - $20,160 ». Texte : « Le prix actuel en entrepôt se situe à peu près dans la fourchette de prix totale ». Bouton « Confirmer » (jaune, texte blanc à contour orangé). La calculatrice coûte une charge (2 → 1) et donne une fourchette de ±20 % qui reste affichée.

### E. Boutique (5:06.5 à 5:10.4)
- **En-tête** : HUD de la ville complet (portrait de la blonde, badge « 19 », éclair « 50/60 » avec « (01:40 +1) » en vert, « + » orange et point rouge, lingots 309, billets 16.21K, « VIP » en gris, « Grand Capitaliste » sur une pastille verte, roue dentée). Au-dessus de la fenêtre, un grand nœud rouge sur un coffret doré, avec un halo.
- **Onglets** : « VIP », « coffret cadeau », « Monnaie Rare », « billet de banque ». L'onglet actif est jaune clair, les autres brun-caramel. Sous les onglets, un auvent rayé crème et orange.
- **VIP** : deux cartes en éventail avec la même conseillère illustrée (casquette, cheveux blond-roux).
  - « VIP 7 jours » (carte bleu-violet, ruban rouge « valeur 1500% ») : « L'énergie maximale est de 90 », « Ajouter 2 emplacements de prêteur sur gages » (pastille VIP), « SPEED X2 », « 2x expérience », « Aller aux annonces » (logo AD barré, « 30 fois par jour »). Bouton orange « $9.99 /7 jours ».
  - « VIP 30 jours » (carte orange, ruban violet « valeur 3000% ») : mêmes avantages, avec « 50 fois par jour ». Bouton « $19.99 /30 jours ».
  - En dessous : « 25% Rabais » sur un ruban vert, « Forfait cadeau de connexion de 7 jours », « Peut être collecté tous les jours pendant sept jours consécutifs », icônes lingots « 110 » et billets « 16,200 », bouton vert « $5.99 ».
  - Bouton bleu arrondi « non merci ».
- **coffret cadeau** : sous-titre « Pas assez de fonds ! Avez-vous besoin d'aide ? ». Grille 3×2 de cartes jaunes, chacune avec un rabais en ruban vert et le texte « Les ressources des colis I…V » :

  | Rabais | Contenu | Prix |
  |---|---|---|
  | 20 % | 15 lingots, 4,000 billets, 10 énergie | $3.99 |
  | 30 % | 75, 15,000, 30 d'un objet rose [?] | $9.99 |
  | 40 % « Chaud » | 150, 30,000, 70 énergie | $19.99 |
  | 45 % | 250, 60,000, **30 bottes** | $24.99 |
  | 50 % | 350, 80,000, **90 tomates** | $29.99 |
  | 60 % « Le meilleur » | 500, 150,000, **30 calculatrices** | $39.99 |

- **Monnaie Rare** (or) : 40 ($2.99, −10 %), 130 ($5.99, −15 %), 280 ($9.99, −20 %), 815 ($19.99, −25 %, « Chaud »), 1,520 ($29.99, −30 %), 3,500 ($49.99, −40 %, « Le meilleur »). L'illustration grossit avec le montant : un lingot, une pile, un coffre, puis un coffre-fort.
- **billet de banque** (cartes vertes) : 640 Billets contre 10 lingots, 2,560 contre 40, 12,800 contre 195, 32,000 contre 485, 64,000 contre 960, 160,000 contre 2,350.
- **Ce qu'on apprend** : les outils d'enchère (bottes, tomates, calculatrices) sont la récompense phare des packs payants. Le VIP double la vitesse (SPEED X2) et l'expérience, et réduit les pubs. La boutique peut s'ouvrir *pendant* l'enchère, qui se met alors en pause (déduit).

### F. Bilan de vente (5:47.75 à 5:53.4)
Phrase « Cliquez sur l'article pour le recevoir ». Panneau gris foncé translucide à trois lignes : « Payé: » (montant jaune), « Prix estimé: » (jaune, avec compteur), « Fraction: » (vert). Bouton jaune « Récupérez tous les objets », qui devient « franchir » gris une fois l'objet ramassé. Le joueur doit **toucher l'objet** pour découvrir sa vraie valeur : c'est un petit geste de révélation. « Fraction » est le **bénéfice ou la perte** de l'enchère.

### G. Carte de l'objet (5:53.5 à 5:54.4)
Bandeau magenta foncé avec une étoile rouge et blanche et le nom « Statue de la danseuse du vent », icône de catégorie à droite. Panneau jaune avec un tourbillon de traits rouges, l'objet au centre et la pastille « [billet] 16,800 ». « Cliquez sur Continuer ».

### H. Classement (5:54.45 à 5:55.1)
Banderole jaune « Edie », coupe dorée, avatar du joueur debout dessus. Quatre lignes crème arrondies :
1. médaille d'or « 1 », « YOU » (pastille grise), « Edie », barre EXP « +11 », billets « 1,120 » (fond jaune : c'est la ligne du joueur) ;
2. médaille d'argent « 2 », portrait de la rousse, nom « 陳慈芯 » (en chinois, non traduit), EXP « +9 », « 0 » ;
3. médaille de bronze « 3 », portrait de l'ouvrier, « 陳慈芯 » (même nom), EXP « +8 », « 0 » ;
4. « 4 » sans médaille, portrait du chauve, « Ting », EXP « +7 », « 0 ».

Bouton jaune « continuer ».
**Ce qu'on apprend** : chaque vente donne de l'EXP, à tous les participants. Les rivaux sont présentés comme des joueurs (des noms), mais ce sont visiblement des PNJ aux noms de remplissage. La colonne de gains montre le bénéfice (1,120), pas l'objet.

### I. Roue de la Fortune (5:55.25 à 5:57.6)
Titre dans un cartouche violet foncé bordé de lavande, avec de petites étoiles aux coins, et un « ✕ » blanc à côté. Roue violette à 8 secteurs : 300, 450, 600, 300, 450, 450, 1,800, 150, chacun illustré de liasses, et un sac de billets sur le 600. Pointeur doré au centre avec un moyeu orange et des points lumineux sur la jante. Bouton « i » à droite. Boutons : jaune « [lingot] 2 Commencer » et vert « [clap] Gratuit » (pub). Le HUD lingots et billets est remonté au-dessus du voile. Des étincelles violettes clignotent.

### J. Chargement dans la voiture (5:57.75 et après)
Illustration : une citadine rouge à ailes élargies (immatriculation « [?] 2Ø7 »), vue de trois quarts arrière devant un bâtiment en brique, avec trois cartons empilés à gauche. Onglets « tous » (actif), « identification » (avec un point rouge) et « réparation ». Bandeau : « Veuillez cliquer pour sélectionner les éléments que vous devez emporter **0/4** » (« 0/4 » en jaune). Une carte rouge et orange (rareté haute) : icône de catégorie en haut à gauche, loupe en haut à droite (objet à identifier), statue, nom « Statue de la danseuse du vent », pied sombre « $ $5,208 ». Gros bouton jaune « Rapportez-le à l'entrepôt ».
**Ce qu'on apprend** : la voiture a une capacité (4 objets). L'objet gagné n'est **pas encore identifié**, et sa valeur affichée ($5,208) est bien inférieure aux $16,800 annoncés au bilan [incohérence apparente, cause inconnue : valeur avant identification ?].

---

## 3. Effets et « juice »

| Effet | Où, quand | Description et durée |
|---|---|---|
| Bulle en « pop » | Chaque réplique du commissaire | Grandit depuis la pointe (bord droit) de ≈ 20 % à 100 % en ≈ 0,1 à 0,15 s, avec un léger rebond. Le texte est déjà écrit, sans effet machine à écrire. Son supposé : aucun ou un petit « pop » [?]. |
| Étiquette de prix | Au-dessus d'un enchérisseur | Apparaît petite puis grandit en ≈ 0,25 s (5:19.00 → 5:19.25). |
| Pancarte | Rivaux et joueur | Bras levé et pancarte qui pivote (le numéro « 06 » se lit « 90 » selon l'angle), ≈ 0,5 s. Pendant le bilan, le joueur l'agite en boucle. |
| Vignette dramatique | « 1ère fois » et « 2ème fois » | Assombrissement radial depuis les bords en ≈ 0,25 s, HUD estompé. La lumière revient d'un coup dès une enchère ou à « Vendu! ». Son supposé : roulement de tension [?]. |
| Bulle d'urgence | « 2ème fois », « Vendu! » | Bordure rouge épaisse, « !! » rouges et éclats en éventail. |
| Marteau | 5:46.6 à 5:47.6 | Grandit d'un coup, frappe 2 à 3 fois sur un socle en bois en se balançant, ≈ 1 s. Son supposé : coups de marteau. |
| Compteur d'estimation | 5:01.25 à 5:02.25 | Défile vers le bas de 21,336 à 13,104 en décélérant, ≈ 1,2 s. |
| Changement de pose des rivaux | 5:47.75 | Tous passent à une pose de dépit en une image : main sur le front, bouche ouverte, sourcils froncés. |
| Révélation de l'objet | 5:50.5 à 5:52.0 | Plaque nom et prix, statue qui rétrécit, gerbe de confettis (≈ 1 s), disparition. |
| Compteur « Prix estimé » | 5:50.5 à 5:51.5 | 0 → 16,800, linéaire, ≈ 1 s. |
| « Punch » de la Fraction | 5:52.25 | Chiffre vert ≈ 3× trop grand qui rétrécit à sa place en ≈ 0,25 s. Son supposé : « ching » [?]. |
| Billets du HUD | 5:47.75 | 16.21K → 528 d'un coup (pas de défilement, pas de billets qui volent). |
| Carte de l'objet | 5:53.5 | Zoom de 70 % à 100 % en 0,25 s, tourbillon rouge, puis apparition de l'objet 0,5 s plus tard. |
| Classement | 5:54.45 | Lignes qui glissent de la gauche (≈ 0,15 s), médailles en pop, avatar qui tombe du haut sur la banderole, confettis, éclats blancs, bouton en fondu. |
| Boutique | 5:06.5 | Zoom de 30 % à 105 % puis 100 % en ≈ 0,25 s (rebond). Sortie instantanée. |
| Roue | 5:55.25 | Zoom d'entrée ≈ 0,25 s, rotation d'attente lente (≈ 22°/s), étincelles violettes. |
| Popups d'outils | 5:03, 5:05, 5:11.75 | Pas d'animation : elles apparaissent et disparaissent en une image. |

---

## 4. Nouveau ou différent par rapport à `research/BIDMASTER-VIDEO.md`

1. **Correction des outils.** Le résumé cite « loupe, bombe, calculatrice ». Ce sont en fait **la botte** (« chasser un adversaire »), **la tomate** (« confondre les adversaires en oubliant d'enchérir ») et **la calculatrice** (fourchette de ±20 %). La loupe n'est pas un outil de l'enchère : c'est le curseur de la **phase d'estimation**, qui précède l'enchère (tapotage d'≈ 3 s, décompte 3-2-1, « Valeur possible $X ? »).
2. **La mécanique exacte** : départ à 60 % de la valeur, pas fixe de +700 (1/24 de la valeur), le joueur accepte la demande ou passe. Il ne peut pas surenchérir sur lui-même (boutons gris). Une enchère remet le compte à rebours à zéro, même en « 2ème fois ».
3. **Le compte à rebours chiffré** : ≈ 2 s de silence, puis « 1ère fois » avec vignette sombre, 3 s, « Compte à rebours 3 secondes ! 2ème fois » (bulle rouge), 3 s, « Vendu! ». Soit ≈ 8 s sans enchère pour adjuger.
4. **Le répertoire complet des répliques** du commissaire (7 formules, section 1) et des rivaux (« Je veux ceci », « Ne rivalise pas avec moi », « Désolé, je le veux », « Tu dois être en train de plaisanter. », « Je vais forcément gagner ! », « Tu es sérieux ? », « Je suis déterminé à l'avoir ! », « Incroyable . », « ici »). Le commissaire n'est **jamais montré** : il n'existe que par sa bulle venue de la droite.
5. **Les enchérisseurs identifiés** : le joueur est l'avatar blond en robe rouge (« Edie », pancarte 11). Trois rivaux enchérissent (Ting le chauve, l'ouvrier, le cowboy) ; deux restent figurants.
6. **La « Pub boutique » de 5:05** est en fait la **boutique complète à 4 onglets** (VIP, coffret cadeau, Monnaie Rare, billet de banque), parcourue par le joueur. On y apprend que les outils d'enchère sont vendus en packs ($24.99 à $39.99), ainsi que les taux d'échange or → billets. L'enchère semble en pause pendant ce temps.
7. **Le bilan se fait en deux temps** : d'abord « Prix estimé: 0 ». Le joueur doit toucher l'objet (« Cliquez sur l'article pour le recevoir ») pour révéler 16,800 avec un compteur et des confettis, puis « Fraction » (le gain, 1,120) arrive avec un effet de « punch ». Les rivaux font une pose de dépit et le joueur agite sa pancarte.
8. **Écrans absents du résumé** : la carte de l'objet nommé (« Statue de la danseuse du vent »), le **classement post-enchère** avec EXP pour chacun (+11/+9/+8/+7) et des noms de PNJ non traduits (« 陳慈芯 » deux fois, « Ting »), puis l'**écran de chargement dans la voiture** (capacité 0/4, onglets tous / identification / réparation, « Rapportez-le à l'entrepôt »).
9. **Valeur incohérente** : l'objet adjugé est valorisé $16,800 au bilan, mais sa carte dans la voiture affiche $5,208, avec une loupe « à identifier » [?].
10. **La Roue de la Fortune** est détaillée : 8 secteurs de billets (150 à 1,800), « 2 lingots Commencer » ou « Gratuit » (pub). Le joueur l'a fermée sans tourner.
11. **Le HUD de l'enchère est propre à cet écran** (pause, « entrepôt 1/1 », or, billets) ; celui de la ville réapparaît seulement par-dessus la boutique.

### Idées directement utiles pour notre jeu (traîneau perdu)
- Garder **un seul geste** (« Miser » ou « Passer ») avec un pas fixe calculé sur la valeur cachée : départ à 60 %, pas de 1/24.
- Mettre en scène la clôture en **trois temps de 3 s**, avec assombrissement puis bulle rouge. C'est simple à coder et très tendu.
- Donner à chaque lutin rival **2 ou 3 répliques** ; le commissaire peut rester hors champ, seulement une bulle.
- Faire **révéler la valeur au toucher** après la victoire (compteur, confettis, gain en vert qui « punche »).
- Ne pas copier : la boutique ouverte au milieu de l'enchère, les noms de PNJ non traduits, et une valeur d'objet qui change d'un écran à l'autre.
