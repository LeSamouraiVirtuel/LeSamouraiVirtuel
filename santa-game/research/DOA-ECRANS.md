# Dragons of Atlantis : atlas des écrans, analyse UI et systèmes chiffrés

> Complément visuel de `DRAGONS-OF-ATLANTIS.md`. Il porte sur la version navigateur/Facebook (Kabam, 2011-2015, notée **DoA**) et sur la version mobile *Heirs of the Dragon* (Kabam puis Deca Games, 2013 à aujourd'hui, notée **HotD**).
> **[C]** = visible sur la capture ou écrit tel quel dans une page du wiki. **[I]** = inféré ou recoupé par moi.
> Images : `research/doa/img/` (415 fichiers dédupliqués par MD5, icônes de moins de 200 px exclues). La correspondance fichier → URL d'origine est dans `research/doa/sources.json`.
> Sources des images :
> - wiki Fandom DoA, 3 948 fichiers listés par `list=allimages` ;
> - wiki Fandom HotD, 1 121 fichiers ;
> - croisement page ↔ images par `generator=allpages&prop=images` ;
> - App Store (id 558756671, recherche/lookup iTunes FR/GB/DE/JP/BR/TW) ;
> - Google Play (`com.kabam.doamobile`) ;
> - miniatures YouTube (`hq1/hq2/hq3/maxresdefault`) de 30 vidéos de gameplay.
>
> Méthode de lecture : chaque candidate a été passée en revue sur planche contact. Les écrans clés ont ensuite été ouverts en pleine taille. Les captures vues seulement sur planche sont marquées *(vignette)*.
> Les numéros d'interface viennent de captures de joueurs à des époques et des niveaux différents. Ils illustrent les ordres de grandeur ; ils ne forment pas un état unique du jeu.

---

## 0. Index des écrans par catégorie

| Catégorie | Écrans (fichiers `img/…`) |
|---|---|
| **HUD / vue Ville** | `doa_Visual-Walkthrough-for-DoA.jpg` (wireframe officiel), `doa_City_Updated.PNG`, `doa_Main_City.jpg`, `doa_8.3.2014.png`, `doa_23.3.2014.png`, `doa_Capture12.PNG`, `doa_Solarian_City.png`, `doa_A_real_primus_city.png`, `doa_Foutje_(23-12-2012_18.24).png`, `doa_Screenshot_2014-12-29_at_10.25.34_PM.png`, `doa_Wall_in_city.png`, `doa_My_city2.jpg`, `doa_City_189m.jpg`, `doa_Ppl_city.png` ; HotD : `hotd_Cityview.png`, `hotd_20200629_133906.jpg`, `yt_d8l9vKB75mM_hq1.jpg`, `yt_ol4KyWz7oK4_maxresdefault.jpg` |
| **Vue Field (champs)** | `doa_Field.jpg`, `doa_Fields.jpg`, `doa_Field_of_dreams.PNG`, `yt_mEkn2Ma6y64_hq2.jpg`, `yt_FfNy60y6S8s_hq1.jpg`, `yt__N3VROxEjI0_hq3.jpg` (« What to Build Next? »), `doa_DoA_Bug.png`, `doa_Solerian_Highland_Field.png`, `doa_Spectral_Ruins_Field.jpg` |
| **Tutoriel / premier lancement** | `doa_Races.png`, `doa_Four_tribes_repres.jpg`, `doa_Realm_Screen.png`, `doa_New_realms.png`, `doa_Change_Realm_button.png` (chargement), `doa_1st_screen.png`, `doa_2nd_pic.png`→`doa_6th_pic.png` (ville qui se construit), `yt_46_sizitI64_hq1-3.jpg`, `yt_KI7JAEYMoBg_*` (HotD, en russe), `doa_CoA_-_Log-in_Menu.png` |
| **Dialogues de bâtiments (DoA)** | Ferme `doa_Inside_Field.png` ; Maison `doa_Inside_Home.png` ; Forteresse + production `doa_Upkeep.png`, `doa_Capture_3.0.PNG` ; Mur `doa_Level_1_Wall.png`, `doa_Wall_11.png`, `doa_Screenshot_13.png` ; Sentinelle `doa_Sentinel.png`, `doa_Sentinel2.jpg`, `doa_Sentinel_level_13.jpg` ; Silo `doa_Level_1_Silo.png`, `doa_Screen_shot_2012-07-01_at_11.14.23_AM.png` ; Muster Point `doa_Inside_MP.png`, `doa_Level_1_Muster_Point.png` ; Dragon's Keep `doa_Inside_Keep.png`, `doa_Water_dragon_level_12_redigert.png`, `doa_DoA_Hydra-Alt-GD.png`, `doa_Dragon_s_Keep_12.png`, `doa_Great_Dragon_Keep_Level_11/12_Upgrade_Info.png`, `doa_Screenshot_3250.png`, `doa_Tempest_*` ; Théâtre `doa_Theater.png` ; Science Center `doa_Research.png`, `doa_2014-04-29_-_3.png`, `doa_Dark_Slayers_-_200_-_Research.PNG` ; Tour défensive `doa_Screenshot_11.png`, `doa_Screenshot_15.png` ; Troop Quarters `doa_Troop_Quarters.png`, `doa_Screenshot_2.png` ; Warp Gate `doa_Screenshot_4.png` ; Warehouse `doa_Screenshot_8.png` ; Skythrone `doa_Buildings.jpg` |
| **Dialogues de bâtiments (HotD)** | `yt_7NDqtKsKYoo_hq1.jpg` (Home), `hotd_Screenshot_2014-02-26-08-18-38.png` (Factory), `hotd_Research.jpg` (Science Center), `yt_d8l9vKB75mM_hq3.jpg` (Garrison), `yt_7NDqtKsKYoo_hq3.jpg` (City Status / impôts), `hotd_Ruby_Mine_Interface.jpg`, `yt_swGnfw8IQyI_hq2.jpg` (Storage Vault, vignette) ; illustrations des bâtiments `hotd_Fortress.jpg`, `hotd_Garrison.jpg`, `hotd_Home.jpg`, `hotd_Farmhd.jpg`, `hotd_Storage.jpg`, `hotd_Theater.jpg`, `hotd_Lore_tower.jpg`, `hotd_Dragon_tower.jpg` |
| **Entraînement / troupes** | `doa_Ssdstatscreen.png`, `yt_80uOBIjpNvw_hq2.jpg`, `yt_Qd-3epRJulE_hq2.jpg` (Train Troops), `doa_Outpost_training.jpg`, `doa_Porter_Requirements.png`, `doa_Doa_conscript.jpg`, `doa_Doa_longbowmen.jpg`, `doa_Doa_porter.jpg`, `doa_Doa_lightning_cannon.jpg`, `doa_LJ_power.png`, `doa_Dragons_of_Atlantis_on_Facebook-_Ice_Giants.png`, `doa_Library_Troops.PNG`, `doa_Stats.jpg` (file In Training), `doa_Capture_dddd.PNG` (file globale), `doa_Screen_Shot_2012-08-05_at_8.20.20_PM.png` (« Training Queue Full »), `doa_Doa_graph.png`, `hotd_Untitled_drawing_(1).jpg` (types de troupes) |
| **Carte / marches / espionnage** | `doa_Clouds.jpg`, `doa_Screenshot_(2).png`, `yt_k6Tl4ogXGeM_hq3.jpg`, `doa_T1.PNG`, `doa_T2.PNG`, `doa_T3.PNG`, `doa_T5.PNG`, `doa_Capture2.jpg`, `doa_DOA.png`, `doa_General_List.png`, `doa_Wave_attack.png`, `doa_Doa_Waving.jpg`, `doa_Dragons_no_marching.png`, `doa_To_spy.png`, `doa_Ssd1.png` (Transfer Goods), `doa_DragonsCoords.jpg`, `doa_Crimson_Citadel_Map.png`, `yt_1B0tzFSKEpA_maxresdefault.jpg` (marche HotD) |
| **Rapports / messages** | `doa_Batte_report.png`, `doa_Spy_vs_Spy.png`, `doa_City_Spy.png`, `doa_Outpost_Spy.png`, `doa_1_Tail.PNG`, `doa_2014-04-26_2244186.png`, `doa_551408_…png`, `doa_417871_…jpg`, `doa_SOULS.jpg`, `doa_DOA_epic_wall.png`, `doa_DoA_level_6.png`, `doa_FDftw.png`, `doa_Screenshot_1.jpg` (malédiction), `doa_Tower_3_part_1.png`, `doa_Sentinel_Report.png`, `doa_Urgent_Report.jpg`, `doa_Swamp_Lakes-_Message.PNG`, `doa_Nomad_Desert-_Message.PNG`, `doa_Discovered_Ice_Outpost.jpg`, `doa_Ice_outpost_is_coming_.jpg`, `doa_Dark_Tower_Message.png`, `doa_Spec_op.png` ; HotD `hotd_Screenshot_2014-01-03-20-40-22.png`, `hotd_Spied.jpg`, `hotd_Battle_rport.jpg` |
| **Quêtes** | `doa_Quest.png`, `doa_Quest_Completed.jpg`, `doa_House_Your_Citizens.png`, `doa_Start_Farming.png`, `doa_Increase_Farming.png`, `doa_Improve_Farming.png`, `doa_Build_Garrison.png` (Increase Quarrying), `doa_Build_Officerrs_Quartes.png`, `doa_Build_Science_Center.png`, `doa_Greater_Housing.png`, `doa_Grow_Population250.png`, `doa_Produce_More_Food.png`, `doa_Raise_Gold_Income.png`, `doa_Agriculture.png`, `doa_Reinforce_Fortress11.png`, `doa_Improve_Muster_Point.png`, `doa_Improve_Officers__Quarters.png`, `doa_Increase_marches.png`, `doa_Become_An_Arbiter.png`, `doa_Bizarre_Talisman.png`, `doa_Hunting_the_Hunted.png`, `doa_Elemental_Dragon_Lord.png`, `doa_Desert_Settlers.png`, `doa_King_of_the_Sands.png`, `doa_Serpents_Egg.png`, `doa_The_Outpost_of_Frost.png`, `doa_Improve_Training_Camps_otp1_lvl10.png` ; HotD `hotd_Fighting.jpg`, `hotd_Battle_rport.jpg` (campagne), `yt_FpOU-6TCY2o_hq3.jpg` |
| **Boutique / inventaire / objets** | `doa_Items.png` (Shop), `yt_mEkn2Ma6y64_hq3.jpg` (Nanos), `doa_Cs.jpg` (Curses), `doa_ThanksgivingEvent.jpg`, `doa_Chests.jpg` (Inventory), `doa_Chance_chest_prize.png`, `doa_Prize_chest_prize.png`, `doa_Matryoska_mystery_chest.jpg`, `doa_Extreme_Box.png`, `doa_Luna_items.jpg`, `doa_Rubies_New_Pic.png` (achat de rubis), `doa_Treasure_Hold_Essence_box.png` ; HotD `hotd_Image.jpg` (Chest Contents), `hotd_Nightshade_Chest.png`, `hotd_Water_Dragon_Chest.png`, `hotd_Screenshot_2016-02-20-22-22-50.png`, `hotd_Get_item.jpg`, `hotd_Arena_shop.jpg`, `yt_FpOU-6TCY2o_hq2.jpg` (coffre débutant) |
| **Accélérations / files** | `yt_Qd-3epRJulE_hq1.jpg` (« In a Hurry? Chronos Can Help! »), boutons SPEED partout, `doa_Capture_dddd.PNG`, `doa_Spectral_Ruins_Field.jpg` (panneau Construction), `hotd_20200629_133906.jpg` (bouton « Free »), `hotd_Ruby_Mine_Interface.jpg` (files payantes) |
| **Généraux** | `doa_General_List.png`, `doa_Gen.png` ; HotD `hotd_Antiope.png`, `hotd_Screenshot_2015-05-26-10-49-39.png` (Enhance), `hotd_Screenshot_2015-05-26-10-49-16.png` (General Room), `hotd_Screenshot_2015-07-20-13-06-52.png` (Assign), `hotd_Tisi23_(2).jpg`, `hotd_Troops_General_Mara.png`, `hotd_Allosaurus.jpg`, `hotd_Gralix.png`, `hotd_Heliodora.jpg`, `hotd_Claire.jpg`, `hotd_Luna.png`, `hotd_Generals1.jpg` (infographie), `yt_Fp-utc7sQ-8_hq2.jpg`, `yt_gJYowTrGy80_hq1.jpg` |
| **Dragons** | Keep (cf. bâtiments), stades `doa_Infant.png`, `doa_Juvenile_Dragon_(level_6).png`, `doa_Great_Dragon_Level_9.png`, `doa_2012-08-17_080705.jpg` (œuf) ; Sanctuary `doa_Inventory_screen.png` (Master Rookery), `doa_Master_Rookery_icon.png`, `doa_Marches.jpg`, `doa_(94)_…santuary.png`, `doa_Dragons_of_Atlantis_Kabam.png`, `doa_Capture_dragon.JPG`, `doa_Screen_Shot_2014-01-03_at_15.14.15.png`, `doa_Screen_shot_2013-11-07_at_9.55.14_AM.png`, `doa_Capturedoa.jpg`, `doa_2_alwetende_gifdraken_kruizen.jpg` (reproduction), `doa_FR_IX_Family_-_20130603.png`, `doa_Speed_Attributes.png`, `doa_Battlearts.png`, `doa_New_Frost_Dragon_Battle_Arts__.PNG` ; HotD `hotd_Screenshot_2014-01-25-15-18-43-1-.jpg` (Dragon Cave), `hotd_Screenshot_2014-01-25-19-49-09.jpg`, `hotd_Dragonexploration.png`, `hotd_Dragonselect.png`, `hotd_Cave_rewards.jpg`, `hotd_Normal_training.jpg`, `hotd_Advanced_training.jpg`, `hotd_Screenshot_2014-06-05-*.jpg`, `hotd_ED_keep.png`, `hotd_NSD_keep_1.jpg`, `hotd_Sanctuary_equip.jpg`, `hotd_Charm_transform.jpg`, `hotd_EarthDragonSkill.gif`, `hotd_WaterDragonSkill.gif`, `hotd_New_Year_Tailbrace.png` |
| **Avant-postes (outposts)** | `doa_Water_Outpost.png`, `doa_Stone_outpost_2.png`, `doa_Fire_Outpost.png`, `doa_Fire_outpost_2.png`, `doa_Wind_outpost_2.png`, `doa_Ice_outpost.jpg`, `doa_Chrono_Outpost.png`, `doa_Cliffs_Of_Chronos_Outpost.png`, `doa_Doasolarianhighlands.png`, `doa_Capture_1111111.PNG` (Spectral), `doa_Screen_Shot_2013-05-17_at_11.26.10_PM.png` (Skythrone), `doa_Colossus_Buildings.png` (Lost City), `doa_Outposts_of_atlantis.jpg`, `doa_Outpostsfile.png`, `doa_Create_Skythrone_Outpost_icon.png`, `doa_Expand_Your_Empire(Skythrone_Outpost)_icon.png`, `doa_Snap_Shot.PNG`, `doa_Skythrone_Outpost_Start_Guide_icon.png`, `doa_Steelshard_Caverns_Start_Guide(small)_icon.png`, `doa_Steelshard_Dome.png`, `doa_Steelshard_Helix.png` |
| **Alliance / social** | `doa_Allianc_screen.png`, `doa_Alliance_Board.png`, `doa_Untitled.png`, `doa_Message.jpg` (profil joueur), `doa_Gen.png` (ami Facebook = général) ; HotD `hotd_Alliance_base.jpg` |
| **Classements / événements / PvP** | `doa_Leaderboards.png`, `doa_Leader_.png`, `doa_Bandicam_2014-06-06_*.jpg`, `doa_CoA_Tournament_UI.png`, `doa_Event.PNG`, `doa_Events_button.png`, `doa_Untitleddd.jpg` (Power Challenge), `doa_Dark_tower_3-_2014.jpg`, `doa_Tower_3_part_1.png` ; HotD `hotd_Screenshot_2014-06-11-10-59-22.png` / `hotd_Arean_team.jpg` / `hotd_Arena_battle.jpg` / `hotd_Arena_shop.jpg` / `hotd_Arena_city_view.jpg` (Arène), `hotd_appstore_gb_ipad_4.jpg` (Dragon Lord Championship), `hotd_DBG-3W1DL-score.png`, `hotd_WinStreak51.png`, `hotd_Winstreak3.png`, `hotd_Turnbased.gif`, `hotd_Untitled_drawing*.jpg` (guides Arène) |
| **Rétention (login, niveaux)** | `hotd_June_daily_login_rewards.jpg`, `hotd_August_daily_login_rewards.jpg`, `hotd_June_daily_reward.jpg`, `hotd_Level19.jpg`, `hotd_Lvl_26_rewards.png`, `hotd_Level6/7/21.jpg`, `yt_7NDqtKsKYoo_hq2.jpg` (Level Up Rewards), `hotd_Completion-grant.jpg` |
| **Fonctions avancées** | Forge `doa_Forge_Item_Forge.png`, `doa_Forge_Crush.png`, `doa_Forge_Upgrading_Equipment.png`, `doa_Forge-_Adventurers.png`, `doa_2000_forge_adventure_consult_the_ancients_tyche.PNG`, `doa_Stalkers.png` ; Résurrection `doa_Dark_Portal_Inside.png`, `doa_Dark_Portal_Reviving.png`, `doa_Reviving_All_Troops_Screen.png` ; Marketplace `doa_Marketplace_Ratio_Chart.png` ; Commerce `doa_Trade_Buy.png`, `doa_Trade_Sell.png` ; Raccourcis `doa_DoA_Hot_Keys_Keyboard.png` ; HotD Tome `hotd_Tome.jpg`, `hotd_Tome_page.jpg`, Grodz `hotd_Grodz_Wanted.jpg`, `hotd_Grodz_Loot.jpg`, `hotd_Great_Dragon_Loot.jpg`, Floating Isles `hotd_Floating_isles.jpg`, `hotd_Portal-active.jpg` |
| **Visuels marketing** | App Store `hotd_appstore_fr_ipad_1..5.jpg`, `hotd_appstore_gb_ipad_3..5.jpg` ; `hotd_DOA_2/3/4/6/7.png`, `hotd_Doa_main1.png`, `hotd_Doaslider2-4.jpg` ; DoA `doa_Dragons_of_Atlantis_Play_for_Free_on_Kabam.png`, `doa_Play_Free_No_Download_Game_Dragons_of_Atlantis4.png` |

---

## 1. Écrans de navigation principaux

### 1.1 Wireframe officiel du HUD (Kabam, 26/07/2012) — `doa_Visual-Walkthrough-for-DoA.jpg`
**Ce que c'est** : un document de Kabam qui annote chaque zone de l'interface navigateur. La résolution minimale indiquée est **760 × 800 px** [C].
**Éléments numérotés [C]** :
1. Compteur de rubis « 115,858 » et bouton rose **Buy Rubies** (en haut à gauche).
2. Bouton **Shop**.
3. Bouton **Fortuna** : il remplace « Fortuna's Rewards », une loterie quotidienne.
4. Bouton **Quests**, avec une pastille de compteur dorée « 106 ».
5. Bouton **Messages**, avec une pastille « 6 ».
6. **Barre de Power** : « Level 20 – Power: 6,805,607 ». Kabam précise que l'XP du joueur s'appelle « Power ».
7. Nom de la ville dans un cartouche (« First City »).
8. Navigation par onglets **Empire / Map / Field / City** (l'onglet actif est en surbrillance). La note précise que « Wildernesses » est jugé peu important et déplacé dans la modale de la Forteresse.
9. Champ de coordonnées, affiché seulement dans la vue Map.
10. **Troop Orders**, trois icônes verticales sur le bord gauche : Marching, Spy, Reinforce.
11-14. Colonne droite à côté du portrait du dragon : **General, Troops, Dragon, Defense**. Defense ouvre la modale du Mur.
15. **Progress Indicators** sur le bord droit : progression de construction, de recherche, d'entraînement et de résurrection, plus la santé du dragon.
16-18. Barre du bas : **Friends / Alliance / Leaderboard**.
19. **Panneau de ressources** : Food 0, Lumber 365K, Stone 62.0K, Metal 103K, Gold 196K, Population 2.55K, Blue Energy 501K, Anthropus Talismans 100K. Chaque ressource a un bouton « + » qui ouvre le Store sur le bon onglet, et une infobulle détaillée au survol.
20. Chat à onglets **World / Alliance**, avec le message de règles affiché en permanence.
21. Le timer de **protection PvP** s'affiche comme une icône (bouclier) dans la zone des buffs et débuffs.

**Lecture du layout [C]** : quatre coins fonctionnels encadrent une grande vue iso au centre.
- En haut à gauche : l'identité du joueur.
- En haut au centre : la navigation.
- En haut à droite : le militaire.
- Le long des bords : les actions en cours.
- En bas : les ressources et le social.

Tous les boutons sont des **pastilles turquoise à texte en petites capitales serif**, posées sur des cadres en pierre et or.
**Ce qu'on peut en tirer** : le découpage en clusters (Identité / Navigation / Ordres / Progrès / Ressources / Social) est directement réutilisable. Il donnerait pour le village de Noël :
- en haut à gauche : avatar du Père Noël, niveau et « Esprit de Noël » ;
- en haut au centre : Village / Forêt / Carte ;
- sur le bord droit : les files (atelier, recherche, lutins en formation) ;
- en bas : la barre de ressources avec « + » qui ouvre la boutique sur le bon onglet.

La règle « une icône de progression par file, avec compteur » évite d'ouvrir les bâtiments pour savoir ce qui tourne.

### 1.2 Vue Ville (DoA) — `doa_City_Updated.PNG`, `doa_Main_City.jpg`
**`doa_City_Updated.PNG` [C]** : ville « Krystal Meth », Level 20, Power 7,731,335.
- Le HUD est celui du §1.1, avec les variantes Sanctuary/Empire sous Map/Field/City et Attack au lieu de General.
- Le portrait de gauche est un avatar de race Zolmec, avec le titre « Arbiter Goku Ali ».
- La Forteresse est une pyramide aztèque au centre, sur un piton : c'est la forme de niveau 11 propre à la race Zolmec.
- **Tous les bâtiments portent un badge carré jaune avec leur niveau** (9, 10, 11).
- On compte une trentaine de bâtiments presque identiques au niveau 9 : des maisons et des garnisons.
- Un rempart crénelé avec tours entoure le bas de l'écran.
- Sur le bord droit, les indicateurs de file ont des pastilles numériques : 2, 1, 4, 7, 1.
- Une mascotte publicitaire « Donate & Earn » (un chat) est collée sur la vue.

**`doa_Main_City.jpg` [C]** : compte Level 29, Power 4.304.497.192.
- On voit une quarantaine de bâtiments au niveau 17 et un dragon rose sur l'aire du Keep.
- Un bandeau défilant au-dessus des ressources annonce « Win Prizes! – Millionaire's Mystery Box On Sale! ».
- Les boutons du bas sont Trade / Alliance / Competition.
- Les ressources sont en milliards (4.05B, 7.84B, 6.44B, 111B, 1.48B ; 810K de population ; 8.40M de Blue Energy).
- La colonne de droite liste les icônes de buffs actifs (clé, bouclier, épées), la musique et le son.

**Systèmes révélés** [C/I] :
- Les emplacements de la ville sont **fixes et génériques** : n'importe quel bâtiment peut aller sur n'importe quelle parcelle. En fin de partie, la ville devient une **mer de maisons et de garnisons**, car le nombre compte autant que le niveau (cf. §8.4).
- Le visuel de chaque bâtiment change aux paliers de niveau.

**Ce qu'on peut en tirer** :
- Badges de niveau lisibles sur chaque bâtiment.
- Un **bâtiment central dont l'apparence change** à un palier (Forteresse L11 → « Grand Atelier »).
- Mais aussi **une limite au clonage**. Un village de Noël rempli de 30 garnisons identiques serait laid. Il vaut mieux plafonner le nombre de copies ou fusionner les copies en niveaux.

### 1.3 Vue Ville (HotD) — `hotd_Cityview.png`, `hotd_20200629_133906.jpg`, `yt_d8l9vKB75mM_hq1.jpg`
**`hotd_20200629_133906.jpg` (mobile 2020, portrait) [C]** :
- Barre du haut : « Lv. 3 / Power 184 ». Six ressources sur deux lignes avec icônes : 19.1k nourriture, 32.2k bois, 23.0k pierre, 18.3k métal, 12.6k or et 73 en population (icône casque).
- Un timer global « 07:37 », probablement la protection ou le prochain événement [I].
- En haut à droite, un bloc vert « 10 / Get More » avec un rubis.
- Colonne gauche : portrait de la conseillère, icône **calendrier** (connexion quotidienne) et **coffre doré** (offre).
- Les champs sont des **losanges vides** sur l'herbe, à gauche.
- Un **cristal rouge flottant** marque la Ruby Mine, encadrée en rouge par l'auteur.
- La Forteresse est niveau 3, avec une bulle de bouclier vert.
- Un coffre doré lumineux est à collecter sur un socle.
- Une bulle **« Free »** flotte au-dessus d'un chantier : l'accélération gratuite des dernières minutes.
- Une barre d'onglets contextuels **March / Research / Train / Build** s'affiche au-dessus de la ligne d'état « No Construction in Progress ».
- Le dock du bas contient : bouton ville rond, Items, Special Offers, Quest, Alliance, Mail, Tournament.

**`hotd_Cityview.png` [C]** : ville tardive sur une île.
- Badges **écussons verts** de niveau (20, 30, 34, 50).
- Le Keep du dragon est niveau 50, sur une plateforme circulaire.
- Un **portail bleu** sur l'eau donne accès aux Floating Isles.
- Une île annexe est niveau 41.
- On voit l'étiquette « Arena », une bannière d'alliance avec trophée et un chevron vert qui déplie un menu.

**`yt_d8l9vKB75mM_hq1.jpg` (2014) [C]** :
- Bulle « Research! » au-dessus du Science Center.
- Coffre temporisé « 71H 58M ».
- File « Home (Lv.2) 58S » avec un bouton vert **Speedup**.
- Chat sur deux lignes au-dessus du dock (Items / Quest / Alliance / Mail avec badge 1 / Leaderboard / Train).

**Système révélé** :
- Sur mobile, **la ville et les champs sont fusionnés en une seule vue** : les champs forment un quartier.
- L'état des files est **toujours visible en une ligne**, accompagné d'un bouton d'action rapide.

**Ce qu'on peut en tirer** :
1. Des **bulles d'appel à l'action** au-dessus des bâtiments inactifs (« Recherche ! », « Gratuit »).
2. Une **ligne d'état de file** avec un bouton Accélérer.
3. Des **coffres physiques dans le décor** pour les récompenses temporisées.
4. Une vue unique village + champs.

### 1.4 Vue Field (champs) — `doa_Field.jpg`, `doa_Fields.jpg`, `yt_mEkn2Ma6y64_hq2.jpg`, `yt__N3VROxEjI0_hq3.jpg`
**[C]** :
- `doa_Field.jpg` : un plateau rocheux découpé en une trentaine de **parcelles carrées vides** en terre battue, à côté d'une ville steampunk de race Solerian.
- `yt_mEkn2Ma6y64_hq2.jpg` (2011) : vue Field du tutoriel. La conseillère Cassandra (toge blanche et orange) dit : « *Your people will need more than just homes to survive. Let's begin work in the Fields.* » Le HUD de l'époque affiche :
  - « First Citizen / Level 1 / Power 5 » ;
  - or 10,008 (+4) ;
  - population 45/45 ;
  - **impôt 10 %** et **bonheur 90 %** ;
  - un tableau **Reserves / Per hour** : 10,116/100 ; 9,716/100 ; 10,166/100 ; 10,116/100.
- `yt__N3VROxEjI0_hq3.jpg` : un clic sur une parcelle vide ouvre **« What to Build Next? »**, quatre cartes illustrées **Farm / Mine / Quarry / Lumbermill**, chacune avec un bouton Select.
- `doa_DoA_Bug.png` : même modale en ville, avec Dark Portal / Mausoleum.

**Système [C]** :
- Les champs produisent en continu vers les réserves de la ville.
- La production de base est de **100 par heure et par ressource** même sans champ, ce qui explique les « 100 » du tutoriel (wiki *Silo*).
- La Forteresse ouvre des parcelles au fil des niveaux.

**Ce qu'on peut en tirer** :
- Une **vue séparée « Forêt enchantée / Champs »** pour la production brute, distincte du village des bâtiments-services.
- Le **sélecteur à 4 cartes** sur une parcelle vide est l'UI la plus simple possible pour construire.
- Le tableau **Réserves / par heure** reste dans le HUD en permanence.

### 1.5 Carte du monde — `doa_Clouds.jpg`, `doa_T1/T2.PNG`, `yt_k6Tl4ogXGeM_hq3.jpg`, `doa_DragonsCoords.jpg`, `doa_Crimson_Citadel_Map.png`
**`doa_Clouds.jpg` (UI de 2011-2012) [C]**. En-tête :
- portrait, « Arbiter Level 20 Power 6,206,366 » ;
- or 3,078,929 (+77,310/h) ;
- population 369,050 (13,560 inactive) ;
- icône balance « 21 % » pour l'impôt, cœur « 100 % » pour le bonheur.

Le tableau **RESERVES / PER HOUR** contient :

| Ressource | Réserve | Par heure |
|---|---|---|
| Nourriture | 0 | **−26,714,500** |
| Bois | 7,172,669 | 347,130 |
| Pierre | 10,420,704 | 288,420 |
| Métal | 7,443,720 | 156,480 |
| Énergie bleue | 1,700,000 | 12,240 |

Ce tableau illustre l'**entretien** d'une grande armée : une production de nourriture négative bloquée à 0.

Le reste de l'écran :
- Champ X/Y + **Go** + liste déroulante de favoris.
- La carte iso montre des camps d'Anthropus (huttes), des lacs, des montagnes, des forêts, des villes de joueurs (tours) et des **nuages**. Les nuages sont des sites de test des développeurs qu'on ne peut pas attaquer (wiki *Map*).
- Onglets en bas de la carte : **Empire / Progress / Friends / Wildernesses**.

**`doa_T1.PNG` [C]** : l'infobulle au survol d'une tuile dit « 214/433 Anthropus Camp Lvl: 5 – *Anthropus camps contain invaders and resources and can be spied on or attacked.* »
**`doa_T2.PNG` [C]** : un clic ouvre une popup « Anthropus Camp Lvl. 5 » avec vignette, Title/Name/Power/Location/Alliance, « ☆ Add Bookmark » et deux boutons **Attack / Spy**.
**`doa_Crimson_Citadel_Map.png` [C]** : infobulle de Crimson Citadel, avec ses coordonnées et un texte d'avertissement.
**`doa_DragonsCoords.jpg` [C]** : schéma du système de coordonnées iso. Y monte en diagonale, de sorte que 9/9 et 11/11 ne touchent pas 10/10. La carte fait **750 × 750 cases et boucle sur elle-même**.

**Formules (wiki *Map*) [C]** :
- `distance = √(dx² + dy²)`, avec `dx = min(|x1−x2|, 750 − |x1−x2|)`, et de même pour dy.
- `temps de marche = distance × s/case de la troupe la plus lente + 30 s de rassemblement`.
- Les contrées sauvages (wildernesses) donnent **+5 % par niveau** à leur ressource : Forêt → bois, Colline → pierre, Montagne → métal, Lac/Savane → nourriture. Les Plaines ne donnent rien mais sont requises pour fonder un avant-poste.

**Ce qu'on peut en tirer** :
- Une carte de la **Toundra** avec des tuiles « forêt de sapins », « lac gelé », « colline de cristal », chacune à **adopter** pour +5 %/niveau.
- Des **campements de Grinchs** (PvE) qui rapportent du butin.
- Survol → infobulle, clic → popup à deux actions.
- Les favoris de coordonnées.
- Un **temps de trajet visible avant d'envoyer**.

---

## 2. Dialogues de bâtiments (gabarit commun)

### 2.1 Gabarit DoA (2011-2012) — `doa_Inside_Field.png`, `doa_Inside_Home.png`, `doa_Level_1_Wall.png`, `doa_Level_1_Silo.png`, `doa_Sentinel.png`
**Structure identique pour tous [C]** :
- **Bandeau titre doré en arc** (« FARM LEVEL 6 », serif en petites capitales), avec un bouton **X turquoise** dans le coin.
- **Phrase de description** du bâtiment, sur une ligne grise sous le titre.
- **Colonne gauche** : un cadre d'image du bâtiment (illustration iso sur fond sable), puis :
  - un bouton **Upgrade** turquoise ;
  - le **temps de construction** juste en dessous (« 9m 4s ») ;
  - un bouton **Disintegrate** (démolir) ;
  - ou, si une autre construction est en cours, le texte « *You can only build one building at a time* » avec le timer de l'autre chantier.
- **Colonne droite** :
  - « **Current Level:** … » en **cyan** ;
  - « **Next Level:** … » en **blanc** ;
  - puis un tableau **You have / You need**, une ligne par prérequis : icône, nom, quantité possédée, quantité requise, **coche bleue** ou **croix rouge**.

**Contenus relevés [C]** :

| Écran | Niveau actuel → suivant | Coût du niveau suivant (Nourriture / Bois / Métal / Pierre) | Temps |
|---|---|---|---|
| Farm L6 (avant-poste) | « Employs 210 laborers and produces 2,100 bushels of Food per hour into the Outpost silos » → 280 / 2,800 | 3,200 / 19,200 / 9,600 / 12,800 | 9m 4s |
| Homes L9 | « Raise your maximum Population by 4500 » → 5500 | **Completion Grant 0/1 ✗** + 51,200 / 256,000 / 25,600 / 51,200 | 50m 13s |
| Wall L1 | « Your Wall has a 1.05 Resistance rating » → 2.1 | 6,000 / 3,000 / 1,000 / 20,000 | 31m 58s |
| Silo L1 | « Gather up to 6900 resources before collecting » → 20700 | 500 / 2,400 / 1,000 / 3,000 | 6m 19s |
| Sentinel L11 | « determine if an attack is headed for one of your outposts » ; « *This building has reached the maximum level.* » | — | — |
| Muster Point L1 (avant-poste) | « Host 1 units of defending troops » → 2 | 200 / 1,200 / 500 / 4,000 | 3m 2s |

**Système** :
- Chaque niveau = **un chiffre d'effet clair** (population, production, résistance, capacité).
- Les coûts **doublent** à chaque niveau.
- Le **niveau 10 exige un objet** (Completion Grant).
- Il n'y a **qu'un chantier à la fois** en DoA navigateur.

**Ce qu'on peut en tirer** — c'est le gabarit à copier presque tel quel :
- titre + niveau ;
- phrase d'ambiance ;
- comparaison **Actuel (couleur) vs Suivant (neutre)** ;
- tableau Possédé/Requis avec coches ;
- bouton principal + temps juste dessous ;
- action destructive (Démolir) séparée visuellement et placée plus bas.

### 2.2 Gabarit DoA 2013+ (cadre sombre) — `doa_Wall_11.png`, `doa_Troop_Quarters.png`, `doa_Great_Dragon_Keep_Level_11_Upgrade_Info.png`, `doa_Capture_3.0.PNG`, `doa_Screenshot_11.png`
**Évolutions [C]** :
- Le cadre devient sombre, avec bandeau turquoise et filets dorés.
- Les **lignes manquantes passent en rouge**, avec un bouton rose **BUY** sur la ligne pour acheter le manque en rubis :
  - Wall L10 : Ancestral Seal 0/1, Food 0/1,920,000, Gold 31,401,648/100,000,000 en rouge avec BUY ;
  - Lumber 10,086,464/960,000 ✓, Metals 4,049,850/512,000 ✓, Stone 7,701,822/6,400,000 ✓ ;
  - temps 14d 21h 5m 13s.
- Format compact « **requis / possédé** » en K/M/B : « Stone 614K / 1.13B », « Fortress Lvl 11 / Lvl 11 ».
- Grand « **Upgrade Time: 4D 6H 24M 0S** » en turquoise.
- Troop Quarters L8 : « Troop Capacity 100,000 → 150,000 ». Le seul prérequis est **Eternal Rune 350/114** (croix rouge), un objet d'événement.
- Defensive Tower L1 (`doa_Screenshot_11.png`) : deux colonnes de stats **Current Level / Next Level** avec icônes (melee, speed, defense, range, ranged, life, load, upkeep). Elle propose aussi :
  - « Troop Strategy : Fight Back / Hide (View Wall) » ;
  - « Tower Strategy : Fight Back / Inactive » ;
  - les prérequis Tower Schematic 1/81, Gold 3.45K, …, Wall Lvl 2/Lvl 0 ✗.

**Ce qu'on peut en tirer** : un bouton **« Compléter avec des étoiles »** sur la ligne manquante. C'est une monétisation douce, et elle doit rester optionnelle dans un jeu familial. Les grands nombres en K/M sont abrégés **dans les tableaux**, et le temps total s'affiche en gros.

### 2.3 Gabarit HotD (mobile) — `yt_7NDqtKsKYoo_hq1.jpg`, `hotd_Screenshot_2014-02-26-08-18-38.png`, `yt_d8l9vKB75mM_hq3.jpg`
**[C]** :
- **Barre de titre** sombre : icône tour à gauche (retour ville), « Factory (Lv.19) » au centre, bloc vert rubis « 15 Get More » à droite.
- Carte parchemin : icône du bâtiment + description.
- Cartouche **« Next Level 20 »** + texte de l'effet (« Train Armored Transports, Giants, and Fire Mirrors »).
- Deux boutons côte à côte :
  - bleu **Upgrade** avec horloge « 3M 57S » ;
  - vert **Instant Upgrade** avec coût en rubis « 15 » (« 1008 » pour la Factory 19).
- Message rouge quand l'action est bloquée : « *You cannot build more than one building at the same time* ».
- Tableau **Type / Required / You Own** avec coches vertes : Food 242,593 / Wood 1,151,209 / Stone 964,842 / Metal 457,858 / Completion Grant 1 (2 possédés).
- Bouton rouge **Destroy** en bas.

**Home Lv.13 [C]** : « Raise Population Limit by 2800 » ; coûts Food 2,659 / Wood 18,296 / Stone 2,659 / Metal 1,829 ; 3M 57S ; instantané pour 15 rubis.
**Garrison Lv.1** : onglets **Detail / Troops / In Training** (`yt_d8l9vKB75mM_hq3.jpg`).

**Ce qu'on peut en tirer** :
- Sur mobile, **deux boutons côte à côte** : « Attendre » (bleu, avec le temps) et « Instantané » (vert, avec le coût).
- **Onglets dans le dialogue** pour les bâtiments multifonctions : Détail / Production / File.
- Destroy en rouge, isolé en bas.

---

## 3. Dialogues bâtiment par bâtiment

### 3.1 Forteresse — `doa_Upkeep.png`, `doa_Capture_3.0.PNG`
**[C]** Forteresse au maximum, de race Zolmec : un temple vert et cristal.
- Texte : « *Current Level: Occupy 11 Wildernesses, accept 11 Reinforcement Marches, open 1 more Resource and City site, upgrade City Muster Point and Officer's Quarters to level 11.* » ; « *This building has reached the maximum level.* »
- Champ « 40 % » + bouton **Change Tax Rate**.
- **Tableau « Hourly Resource Production »** :

| Source | Food | Lumber | Stone | Metals | Gold |
|---|---|---|---|---|---|
| Base Rate | 109,000 | 13,600 | 5,200 | 3,700 | 27,084 |
| Research Increase | 98,100 | 6,800 | 1,560 | 2,220 | 0 |
| Wilderness Increase | 2,136,400 | 61,880 | 0 | 1,295 | 0 |
| Nano Increase | 0 | 0 | 0 | 925 | 0 |
| Army Consumption | 20,083,016 | 0 | 0 | 0 | 180 |
| **Total** | **−17,739,516** | 82,280 | 6,760 | 8,140 | 26,904 |

**Système** :
- La production finale vaut `Base × (1 + Σ bonus)`. Les bonus s'additionnent en lignes séparées : recherche, contrées, nanos.
- On retranche l'entretien. La colonne or soustrait 180, le **salaire des généraux** [I, cohérent avec le wiki *Officers' Quarters*].
- La recherche ajoute ici +90 % de nourriture (Agriculture 9) et +50 % de bois (Woodcraft 5) [I].
- La Forteresse L10 → L11 (`doa_Capture_3.0.PNG`) demande Ancestral Seal 1/0 ✗, Stone 5.12M/3.30M ✗ (BUY), Metals 102K, Lumber 307K, Food 205K, Gold 100K, et 10d 16h.

**Ce qu'on peut en tirer** : le **tableau de décomposition de la production** (base / recherche / territoires / boosts / consommation / total) est un excellent outil pédagogique pour un jeu de gestion. C'est l'écran « Bilan du Grand Atelier ».

### 3.2 Impôt et population — `doa_DoA_Taxes.jpg`, `yt_7NDqtKsKYoo_hq3.jpg`, HUD
**[C]** :
- La courbe « *Taxes Collected – Maximum where Tax Rate = Happiness* » est une parabole : 0 à 0 %, un pic d'environ 3 000 vers 54 %, puis 1 000 à 100 %.
- HotD « City Status » a trois onglets **Resources / Taxes / Buffs**. On y trouve :
  - un **slider** Tax Rate de 0 à 100 avec un champ numérique ;
  - le texte « *Raise the rate to increase Gold income. Tax rate affects Happiness and Population.* » ;
  - le bouton Change Tax Rate ;
  - la liste Happiness 100, Pop. Level, Population, In Training, Idle Population.
- Le HUD DoA affiche en permanence **taux d'impôt (balance)** et **bonheur (cœur)**.

**Formules** : voir §8.2.
**Ce qu'on peut en tirer** : le curseur « **Exigence des commandes** » (taux de production imposé aux lutins). Son effet sur la **bonne humeur** se lit sur un cœur, et le gain d'or sur une courbe en cloche affichée dans le dialogue. Le joueur voit lui-même l'optimum.

### 3.3 Science Center / recherche — `doa_Research.png`, `doa_2014-04-29_-_3.png`, `hotd_Research.jpg`, `doa_Dark_Slayers_-_200_-_Research.PNG`
**DoA [C]** : grande modale à liste défilante. Chaque carte contient :
- une icône carrée ;
- le **nom + niveau visé** (« Weapons Calibration Lvl. 3 ») ;
- une description qui donne l'effet chiffré (« *Each upgrade increases ranged weapons' reach by 5%* ») ;
- « **Upgrade Time: 5h 29m 56s** » ;
- un bouton **Research** ;
- à droite, une colonne de prérequis : icône, nom, **requis**, **possédé**.

Exemples relevés :
- **Weapons Calibration L3** : Woodcraft Lvl4/Lvl7, Science Center Lvl4/Lvl7, Stone 4,000, Gold 40,000, Metals 4,800, Lumber 6,400.
- **Metallurgy L4** (« +5 % attaque et défense ») : Alloys 5/5, Metalsmith 5/5, SC 5/7, Garrison 2/8, Stone 3,200, Gold 56,000, Metals 48,000, Food 12,800, Lumber 2,400 ; 6h 14m 41s.
- **Medicine L4** (« +5 % de vie ») : SC 6/7, Food 24,000, Gold 57,600 ; 8h 17m 43s.

Quand un prérequis manque, la ligne passe en **rouge** et le texte « **Requirements Unmet** » s'affiche sous le temps. Au niveau maximum, la carte dit « *You have reached the maximum level for this type of research.* » (5d 5h 56m 16s pour le L11).

**HotD [C]** :
- Onglets **Detail / Research**.
- Liste de cartes : icône peinte, nom, description, « Level 5 », chevron « > ».
- Les recherches non disponibles ont l'icône **barrée de chaînes et d'un cadenas** (Metallurgy Level 6, Dragonry Level 7).

**Système** : voir §8.6. Une recherche de niveau N demande le Science Center à N **et** le bâtiment lié à N. Une seule recherche tourne à la fois.
**Ce qu'on peut en tirer** :
- Une **liste de cartes plutôt qu'un arbre graphique**, ce qui est lisible et suffisant.
- Le cadenas-chaînes pour ce qui est verrouillé.
- La ligne de prérequis en rouge qui indique **exactement** quoi faire.
- L'effet chiffré **dans la description** (« +5 % par niveau »).

### 3.4 Garnison / entraînement — `doa_Ssdstatscreen.png`, `yt_80uOBIjpNvw_hq2.jpg`, `yt_Qd-3epRJulE_hq2.jpg`, `doa_Outpost_training.jpg`, `doa_Porter_Requirements.png`, `doa_Screen_Shot_2012-08-05_at_8.20.20_PM.png`
**« Train Troops » [C]** :
- Une rangée d'**onglets-icônes** (un par troupe) en haut, puis des cartes à 3 colonnes : illustration, texte d'ambiance, « You have: 0 », boutons **Train / Dismiss**.
- En avant-poste, la rangée d'icônes de dragons au-dessus sert de **sélecteur de ville** (`doa_Outpost_training.jpg` : « Water Outpost » / « Fire Outpost »).

**Dialogue d'une troupe (Swift Strike Dragon) [C]** :
- Texte d'ambiance.
- « You have: 2,265 ; **Maximum: 165** ; How many will you train? [0] **Max** ».
- Prérequis par unité : Dragonry Lvl4/Lvl2, Food 1,462,931/1,000, Garrison Lvl5/Lvl5, **Idle Pop. 495/3**, Lumber 1,165,693/600, Metals 99,284/500, Rapid Dep. Lvl2/Lvl1, Rookery Lvl6/Lvl1.
- Stats : Melee Attack 150, Defense 60, Life 300, Speed 1,000, Range 0, Load 100, Ranged Attack 0, Power 5.
- **Upkeep : Food 18**.
- Bouton **Begin Training**.

→ Le maximum se calcule comme le **minimum des ressources divisées par le coût unitaire**. Ici, c'est la population inactive qui limite : 495 / 3 = 165 [C].

**Autres écrans [C]** :
- `doa_Porter_Requirements.png` : la ligne **Idle Pop. 0/1 ✗** bloque tout, alors que le joueur a 13 M de chaque ressource. C'est la tension population/production illustrée.
- `yt_80uOBIjpNvw_hq2.jpg` (2013) : les lignes « Rapid Deployment Lvl 11/Lvl 9 » et « Aerial Combat Lvl 11/Lvl 7 » sont rouges. Le dialogue affiche aussi « Power: 35 » pour la troupe.
- Popup « **Training Queue Full** — *Wait for your current troops to finish their training, or add more Garrisons to increase your training capacity.* » : **chaque garnison = une file**.

**HotD Garrison Lv.1 [C]** :
- « Conscripts Owned: 0 » ; Life 75, Range 0, Defense 10, Speed 200, Attack 10, Load 20, Ranged 0, Upkeep 3.
- **Slider** + champ.
- **Train (0S)** / **Instant Train (0 rubis)**.
- Coût Food 80, Wood 100, Stone 0.

**Ce qu'on peut en tirer** :
- Un « **combien ? [champ] [Max]** » où **Max calcule automatiquement le facteur limitant**.
- Afficher la population libre comme une ressource à part entière.
- **Une file par atelier** : le message « File pleine — construisez un autre atelier » pousse à l'expansion.

### 3.5 Files d'entraînement — `doa_Stats.jpg`, `doa_Capture_dddd.PNG`, `doa_Reviving_All_Troops_Screen.png`
**[C]** :
- `doa_Stats.jpg` : le panneau « **In Training** » liste des cartes « *Troops waiting to be trained* — 500 Fangtooth — Total Training time / Time remaining — **Cancel** ».
- Le joueur a annoté la même file de 500 Fangtooth avec 8 → 14 Training Camps L10 : 19h06m55 → 16h59m29 → 15h17m32 → 13h54m07 → 12h44m37 → 11h45m48 → 10h55m23.
  → `temps ∝ 1 / nb_camps` (cf. formule §8.4).
- `doa_Capture_dddd.PNG` : un panneau « **Training** » **global multi-villes**, une ligne par file avec portrait, nom, quantité, ville d'origine, barre de progression qui se remplit en vert et bouton **SPEED** rose :
  - Porter (50,000) Capital City 1d 7h 40m 49s ;
  - Fangtooth (750) Water Outpost 20h 43m 31s ;
  - Longbowman (44,596) Stone Outpost ;
  - Soul Reaper (1,200) Ice Outpost ;
  - Conscript (4,008) Fire Outpost 41m 38s ;
  - Fire Mirror (1,100) Spectral Ruins.

**Ce qu'on peut en tirer** : un **panneau global des files** (tous les ateliers de tous les hameaux), où chaque ligne a une barre et un bouton Accélérer. C'est indispensable dès qu'il y a plusieurs sites.

### 3.6 Dragon's Keep — `doa_Inside_Keep.png`, `doa_Water_dragon_level_12_redigert.png`, `doa_DoA_Hydra-Alt-GD.png`, `doa_Battlearts.png`, `doa_Screenshot_3250.png`, stades
**Keep 3 (DoA 2011) [C]** :
- Une **grande scène du dragon** : un bébé dragon d'eau dans un bassin.
- Une barre « **Full Health** » turquoise avec un bouton rose **SPEED** (pour accélérer les soins).
- Stats Melee 675, Ranged 700, Defense 700, Load 0, Life 42000, Speed 900, Range 1500.
- « Upgrade Time: 48m 0s ».
- Prérequis Food 3,200, **Gold 12,000**, Lumber 20,000, Metals 5,600, Stone 9,600.
- Un panneau de **4 silhouettes noires des pièces d'armure** manquantes : « *Reclaim armor so that when your [dragon] becomes an adult (lvl. 8) it can be trained in the art of Aerial Combat. A Great or Elemental Dragon must be included in the march for a piece to be found.* »

**Keep 12 Water Dragon (2013) [C]** :
- Colonne de 8 stats avec icônes : épée 12,787 ; course 900 ; bouclier 13,262 ; portée 1,600 ; arc 13,262 ; cœur 1,145,877 ; chariot 90,000 ; couverts 0.
- Grand portrait de l'adulte armuré.
- Deux **listes déroulantes « Natural Scales » / « Steel Armor 4/4 »** pour choisir l'apparence et les bonus.
- Coûts Ancestral Seal 1/10, Food 205K/7.54M, etc. ; 8d 0h.
- Section **Battle Arts** : trois compétences (Eternal Spring 10, Water Of Life 10, Tidal Wave 13), chacune avec une **barre de 15 pips** et « *Click to upgrade* ».

**Popup Battle Art [C]** :
- « *Water Dragon's Attack increases each turn it remains alive in battle. Up to five turns.* »
- Current Level Bonus 0 → Next 2,900,000 ; Bonus at Level 10: 15,000,000.
- Deux voies d'amélioration : « Use Water Dragon Spring » / « Use Water Dragon Essence (You have 800) ».

**Autres écrans [C]** :
- `doa_Screenshot_3250.png` : « *Your Steelshard Dragon is fully matured – Begin Aerial Combat training in the Science Center…* ». Un message d'étape suivante apparaît au palier.
- Stades visibles : œuf dans une grotte (`doa_2012-08-17_080705.jpg`), nourrisson (`doa_Infant.png`), juvénile L6 (`doa_Juvenile_Dragon_(level_6).png`), adulte L8+ (`doa_Screen_Shot_2012-04-28_at_16.06.19.png`), puis Tempest œuf → L2 → L6 (`doa_Tempest_*`).

**Système** : voir §8.7.
**Ce qu'on peut en tirer** — c'est l'écran « mascotte » idéal pour un renne ou un ours polaire du Père Noël :
- une grande scène qui **change d'apparence par stade** ;
- une barre de santé ;
- **4 silhouettes de pièces à collectionner** (harnais, clochettes, couverture, bonnet) ;
- un sélecteur de « robe » et d'équipement ;
- plus tard, 3 talents à pips.

### 3.7 Mur, Sentinelle, défense — `doa_Level_1_Wall.png`, `doa_Screenshot_13.png`, `doa_Sentinel2.jpg`, `doa_Sentinel_level_13.jpg`, `doa_Sentinel_Report.png`
**Mur 2013 [C]** :
- « *Your Wall has a 1.05 Resistance rating. Level 1 Defensive Tower unlocked* ».
- **Troop Strategy : Fight Back / Hide** (cases à cocher).
- **Tower Strategy : Fight Back / Inactive**.
- « Defending Troops — **Choose Defenders** ».

**Sentinelle [C]** :
- L9 → « *foresee the exact number of troops* », Next « *attacker's name* » ; Completion Grant 0/1 BUY ; 1d 23h 42m 49s.
- L12 → « *report on which Sanctuary dragon abilities the attacker has active* », Next « *which Dragon Battle Art abilities* ».

**Message « Sentinel Warning! » [C]** : un parchemin officiel où **chaque phrase correspond à un niveau de Sentinelle** :
- « *An attack has been spotted!* » (L1) ;
- « *headed for our glorious city of X* » ;
- « *they will surely attempt to spy* » (L2) ;
- « *will likely arrive by 2012-02-05 11:02:48 UTC* » (L3) ;
- « *highly regarded Solarian Arbiter* » + alliance (L4) ;
- « *originate from XXX/XXX* » ;
- « *include 1 Spies* » ;
- « *none other than [Name]* » (L10) ;
- « *Prepare for battle!* ».

**Ce qu'on peut en tirer** : une **Tour d'observation météo / du Grinch** qui, niveau après niveau, ajoute une phrase à l'alerte : « une tempête approche » → « elle arrive à 14 h » → « c'est un blizzard » → « force 3 ». C'est une progression narrative très lisible.

### 3.8 Silo (avant-poste) — `doa_Level_1_Silo.png`, `doa_Screen_shot_2012-07-01_at_11.14.23_AM.png`
**[C]** Description : « *Resources produced in your Outpost are gathered in Silos and must be collected before they can be used. Upgrade your Silos to increase how much you can gather and upgrade your Outpost Keep to allow more silos to be built.* »
- Section « **Current Capacity** » : une barre par silo (« Silo Level 2 — 5000/20700 », quatre silos).
- Grille par ressource **Hourly / Army Consumption / Gathered** : Hourly 200/200/25,200/200 ; Gathered 127/127/18,651/127.
- Gros bouton **Collect All**.

**Ce qu'on peut en tirer** : la **« Hotte de collecte »** d'une annexe. Elle se remplit et doit être vidée à la main avec un bouton « Tout ramasser ». Ses jauges sont satisfaisantes à regarder. C'est la boucle de retour quotidien.

### 3.9 Muster Point, marches, espionnage — `doa_Inside_MP.png`, `doa_T3.PNG`, `doa_Capture2.jpg`, `doa_General_List.png`, `doa_T5.PNG`, `doa_Wave_attack.png`, `doa_To_spy.png`, `doa_Ssd1.png`, `yt_1B0tzFSKEpA_maxresdefault.jpg`
**[C]** :
- **Troop Deployment** : deux tableaux parchemin, Status/City/Type/Location (marches envoyées) et « Hosted Troops » (renforts reçus).
- **Attack** :
  - « *Where will you send your march?* » + vignette de la cible + coordonnées ;
  - ou « Bookmarked Locations / Enter Coordinates / Find » ;
  - « *Assemble your march* » + **Select General** (liste Gen. 1…Gen. 9, chacun avec 5 ★, et « Appoint Generals… ») ;
  - une grille de portraits de troupes où l'on saisit une quantité, la première case étant « Select a Dragon » ;
  - pied : **Load Capacity 1,119,000 / Estimated Time 2m 39s / Selected Troops 23,513 / Slots Left 26,487** ;
  - boutons **Use Last March**, Attack, Cancel ;
  - validation « *You must choose some troops.* ».
- **Marching** :
  - une liste de marches, chacune avec une **barre de progression qui se remplit** : cible (Lv.5), coordonnées, lien « 6000 Troops », temps restant, bouton **SPEED** ;
  - après l'arrivée : « Retreating – 50 Troops » et « Waiting for Report! » ;
  - « You have no troops out. » ;
  - bouton **New Attack**.
- **Spy** : Send from [ville] ; Spy 100,067 [27/137] Max ; Maximum Troops.
- **Transfer Goods** : transporteurs (Porter / Armored Transport / Pack Dragon) + 5 ressources, chacune avec Max ; Load Capacity ; coordonnées ; Transfer.
- **HotD March** :
  - « Select Troops », case « Save troop selection » ;
  - une ligne par troupe : portrait ★, nom, Lv.8, « Owned: 46,499 », slider, champ, bouton **MAX** ;
  - pied « 4M 54S / Troops 0/165,480 / Load Capacity 0 » ; **Attack**.

**Système** : chaque marche exige un général. La capacité vient du Muster Point (§8.5). Le temps de marche dépend de la troupe la plus lente.
**Ce qu'on peut en tirer** — pour des **tournées de traîneaux** :
- choisir un chef-lutin ;
- remplir le traîneau avec des sliders et MAX ;
- voir la **charge** et le **temps estimé** avant de partir ;
- « Refaire la dernière tournée » ;
- un panneau des tournées en cours avec barres.

### 3.10 Officers' Quarters / généraux — `doa_General_List.png`, `doa_Gen.png`, `hotd_Antiope.png`, `hotd_Screenshot_2015-05-26-10-49-39.png`, `hotd_Screenshot_2015-07-20-13-06-52.png`, `hotd_Generals1.jpg`
**DoA [C]** : les généraux sont des **amis Facebook** (`doa_Gen.png` : « FB friend Available », carte 5 ★, Dismiss). Il existe aussi des généraux génériques gratuits. Un ami qui joue coûte **10 or/h** au lieu de 20 (wiki *Generals*).

**HotD [C]** : un dock de 5 onglets **Recruit / Generals / Upgrade / Assign / Quarters** (badge rouge « 3 » sur Assign).
- **General Detail** :
  - carte portrait à cadre doré avec rareté (« Legendary », en orange), niveau (pastille verte) et 5 ★ ;
  - Lv. 1 / Max Lv. 50, barre XP, « Next Lv. XP 100 » ;
  - Life +10.5 %, Attack +10.5 %, Leadership 8800, Power 50000, Absorbed XP 1600 ;
  - « Times Evolved 0/5 » ;
  - compétences : « Increase Storm Drake Combat Speed +5.0 % Lv. 1/10 », puis des lignes verrouillées « **Unlocked at Lv.25 / 50 / 75** » en rouge ;
  - boutons **Evolve / Enhance**.
- **Enhance** :
  - le général au centre, entouré de **6 emplacements « + »** pour sacrifier d'autres généraux ;
  - XP 12000, **Auto Select / Enhance** ;
  - Power 1,294,650 → **1,355,250** (flèche jaune) ;
  - compétences avec « Level Up Rate » 0 % / 5 %.
- **Assign Generals** : quatre bandeaux de couleur par race-rôle. L'infographie `hotd_Generals1.jpg` détaille les rôles :
  - **Amazon : Field Marshals** (rouge) : marches et attaque ;
  - **Primus : Castellans** (vert) : défense et mur ;
  - **Zolmec : High Stewards** (violet) : production et population ;
  - **Solerian : Way Marshals** (bleu) : limite de troupes et vitesse.
  - Un slot vide affiche « *Make buffs effective by assigning the corresponding General.* » Une fois assigné, ses buffs s'affichent et on peut **Dismiss**.

**Ce qu'on peut en tirer** — des **chefs-lutins** à collectionner :
- rareté, niveau et étoiles ;
- **3-4 talents qui se débloquent aux niveaux 25/50/75** ;
- montée de niveau par « fusion » ;
- surtout, **4 postes d'affectation** (Atelier = production, Écurie = tournées, Tour = défense, Cuisine = bonheur), qui ne donnent leur bonus qu'avec un chef assigné.

### 3.11 Théâtre — `doa_Theater.png`
**[C]** « **Quest Highlights** » : une liste de 4 vidéos en sépia (Aerial Combat, Train a Stone Dragon, Great Dragon Attack, Train a Water Dragon), chacune avec « *Complete Quest to unlock video* » en rouge et une description de l'objectif.
**Système** : le Théâtre donne +2 à 3 % de bonheur par niveau (§8.2). Il sert aussi de **galerie de récompenses narratives**.
**Ce qu'on peut en tirer** : le **« Cinéma du village »**, qui débloque de petites saynètes (animations) quand on termine des chapitres de quêtes. C'est une récompense sans inflation économique.

### 3.12 Bâtiments d'avant-postes spéciaux — `doa_Troop_Quarters.png`, `doa_Screenshot_4.png`, `doa_Screenshot_8.png`, `doa_Colossus_Buildings.png`, `doa_Buildings.jpg`, `doa_Screenshot_15.png`
**[C]** :
- **Lost City** (Colossus) : bâtiments étiquetés Dragon's Keep L10, Defensive Tower L14, Warehouse L9, **Troop Quarters** L7 ×5, Wall L6, Warp Gate L9.
- **Warp Gate L1** : « *Warp troops and resources to and from the Lost City…* » ; can send 1,000 Troops, 100,000 Resources, Stealth Protection 30 min → 7,500 / 180,000 / 45 min ; onglets **Relocate / Stealth / Troops / Resources** ; « Choose a Wilderness » + Warp City.
- **Warehouse L1** : protège 100,000 de chaque ressource → 400,000 ; jauges « 100000 protected » ; Warp Resources.
- **Skythrone** : 5 bâtiments au niveau 0 (Library, Academy, Cathedral, Greenhouse, Forge), dont l'effet est « *Additional X % to the Dragon's [attribut]* ».
- **Defensive Tower L13** : Life 240,000,000 → 880,000,000.

**Ce qu'on peut en tirer** : des **annexes thématiques à règles propres**, par exemple un « Village des Elfes » dont l'Entrepôt protège et dont le Portail téléporte. Elles renouvellent le jeu sans changer le cœur.

---

## 4. Quêtes

### 4.1 Liste des quêtes — `doa_Quest.png`, `doa_Quest_Completed.jpg`
**Layout [C]** :
- **Liste gauche défilante groupée par catégories**. Les en-têtes sont des cartouches clairs (« SKYTHRONE », « MILITARY », « EXPANSION », « TITLE », « RESOURCES », « CONQUEST ») et chaque quête est un bouton parchemin.
- La quête sélectionnée est **surlignée en cyan avec une flèche**. Une quête terminée porte une **coche dorée**.
- À droite :
  - titre (« Improve Training Camps ») ;
  - texte d'ambiance (« *Better Training Camps let you train more powerful troops faster within your Outpost. Fire Mirrors and Granite Ogres can be trained at level 10.* ») ;
  - encart « **Quest Objectives** » (« Upgrade a Training Camp in Outpost #2 to Level 10 ») ;
  - **Reward:** une grille 2 colonnes de cartes icône + nom + quantité ;
  - bouton **Claim Reward** quand la quête est remplie.

**Catégories du wiki *Quests* [C]** : Conquest, Defense 1-2, Fortress, Expansion, Great Dragon, Rookery, Military 1-2, Troops, Science Center, Science, Resources, Infrastructure, Population, Taxes, Outpost, Skythrone, Steelshard Caverns, Title.

### 4.2 Quêtes de démarrage (ordre du tutoriel) — vignettes de quêtes
| Quête | Texte | Objectif | Récompense [C] |
|---|---|---|---|
| House Your Citizens | « *To build a great and thriving City, first your citizens need places to live.* » | Build a Level 1 Home | Fortuna's Ticket 1, Lumber 1,000, Blink 1, Stone 200, Metals 100, Food 200 |
| Start Farming | « *Food is the lifeblood of the city. Build your first Farm in the Fields, and build it well.* » | Farm reaches Level 1 | Lumber 2,000, Blink 1, Stone 1,500, Metals 1,000, Power 10, Food 300 |
| Increase Farming | « *More Farms will feed more Troops and Dragons.* » | Build a total of 3 Farms | Lumber 2,000, Stone 1,500, Metals 1,000, Food 600 |
| Increase Quarrying | « *More Quarries produce more Stone for a stronger Fortress, Walls, and buildings.* » | 3 Quarries | Lumber 2,250, Blink 1, Stone 900, Metals 1,500, Power 10, Food 900 |
| Improve Farming | « *Bigger and better Farms produce more Food and employ more citizens.* » | Farm to Level 3 | Lumber 5,000, Stone 3,000, Metals 2,500, Food 1,000 |
| Greater Housing | « *More homes increase population. You need people to work in the fields, pay taxes and to raise an army.* » | 3 Homes | Lumber 2,000, Stone 500, Gold 1,000, Metals 500, Food 500 |
| Grow Population | « *Happier citizens increase your Population relative to your Capacity.* » | Population 250 | Food 250, Power 10, Gold 250 |
| Build Science Center | « *Science! Production, medicine, weaponry and construction all advance with Science.* » | L1 Science Center | Lumber 2,500, Stone 1,500, Skip 1, Metals 200, Food 150 |
| Agriculture | « *Improving your Agricultural sciences will increase your Food Production.* » | Research Agriculture 1 | Gold 2,000 |
| Build Officers' Quarters | « *House your officers … appoint your best to be your Commanding Generals.* » | L1 OQ | Lumber 2,000, Stone 1,000, Metals 500, Food 500 |
| Produce More Food | « *With more Food, you can support more troops and keep your Great Dragon healthy.* » | Food production 1,000/h | Harvest Nanos 1 Day, Food 1,000 |
| Raise Gold Income | « *Gold is needed to pay for Scientific Research, pay your Generals, and provide … Gold for your Dragons.* » | Gold income 40,000/h | Food 100,000 |
| Reinforce Fortress | « *Building a new Fortress specific to your race will grant more space within the city and field.* » | Fortress 11 | Food 30,000, Jump 1, Power 10,000, Lumber 60,000, Stone 60,000 |
| Improve Muster Point / OQ | « *…specific to your race will allow for even larger marches.* » | MP/OQ 11 | Gold 10,000, Fortuna's Ticket 1, Power 1,000 |
| Increase Marches | « *Make use of your race's Muster Point…* » | Send a march > 100,000 | Gold 20,000, Forced March Drops 1, Food 50,000 |
| Become an Arbiter (Title) | « *The judicial path is opening up for you…* » | Reach Level 20 ; Power 5,242,880 | Gold 40,000 |
| Elemental Dragon Lord | — | Water/Stone/Fire/Wind Dragons L8 | 1 M de chaque ressource + Gold 100k, Divine Rations, Bounce, Testronius Powder |

**Système [C/I]** :
- Les premières quêtes **remboursent 5 à 10 fois le coût** de l'action. La Ferme L1 coûte 50/300/150/200 et rapporte 300/2,000/1,000/1,500 + Blink [C].
- Elles donnent souvent une **petite accélération** (Blink 1 min, Skip 15 min).
- Plus tard, la récompense **plafonne** : Sentinelle L5 → L8 rapporte toujours 1k/10k/5k/20k, alors que le coût continue de doubler (wiki *Quests*, Defense 1).
- Les quêtes de **Titre** (Arbiter, Ombudsman, Adjudicator) sont des jalons de niveau qui donnent un titre visible dans le HUD.

**Ce qu'on peut en tirer** :
- Un **journal de quêtes catégorisé** à gauche et des détails à droite, avec Objectif + Récompense en cartes.
- Les quêtes du premier jour remboursent largement. Les gains plafonnent ensuite pour que le joueur passe à la production.
- Une **chaîne de titres** pour le Père Noël (« Lutin apprenti » → « Maître d'atelier »).
- **HotD Campaign** (`hotd_Fighting.jpg`) : un onglet **Quest / Campaign** avec une carte parchemin où les camps grisés sont verrouillés et le camp actif s'affiche en couleur avec « Fighting… ». Une **campagne PvE linéaire sur carte** correspond bien à un jeu familial.

---

## 5. Boutique, inventaire, objets, accélérations

### 5.1 Shop — `doa_Items.png`, `yt_mEkn2Ma6y64_hq3.jpg`, `doa_Cs.jpg`
**[C]** :
- Onglets **Featured / Resource / Speed-Up / Production / General / Chest / Arsenal**.
- Grille de cartes sur 3 colonnes :
  - titre gravé (« 80,000 Stone ») ;
  - **illustration peinte** ;
  - « *Add 80,000 Stone to your city! You have: 0* » ;
  - Quantity [1] ;
  - Cost « 20 » + icône rubis ;
  - bouton rose **Buy**.
- Prix relevés :
  - 80,000 Stone / Metals : 20 rubis ;
  - 500,000 Wood/Food/Stone/Metals : 95 rubis ;
  - Nanos (Harvest/Forest/Stone/Metals) +25 % pendant 24 h : 7 rubis, pendant 7 j : 40 rubis ;
  - Double Tax Day Writ.
- Bouton bas « **Go To My Items** ».
- Les **Curses** (malédictions) sont vendues par une sorcière : Worms (−25 % de bois de l'attaquant pendant 24 h), Bats (métal), Locusts (nourriture), Frogs (pierre), 9 rubis chacune.

### 5.2 Inventaire et coffres — `doa_ThanksgivingEvent.jpg`, `doa_Chests.jpg`, `hotd_Image.jpg`, popups « You Received »
**[C]** :
- Inventaire avec les mêmes onglets que le Shop. Chaque carte a « You have: N », un champ « Use: [1] » et un bouton **Use**.
- Un bouton bas « Go To Shop » fait le **lien croisé Shop ↔ Items**.
- Exemples de coffres :
  - Completion Portfolio (« *A full portfolio of 5 Completion Grants* ») ;
  - Master Artisan's Chest (« *win TWO from: Better Homes Grant, Ancestral Seal, Completion Grant, Bounce, Jump* ») ;
  - Fortuna's Accelerator (chance d'obtenir une accélération de 200, 40, 20 ou 10 rubis) ;
  - Hold and Warp Chest.
- Popup « **You Received:** » **groupée par catégorie** (Speed Up / General / Resource / Arsenal / Chest), avec icône + « x2 Testronius Powder », puis **OK**.
- HotD « **Chest Contents** » : « *Contains items worth 645 Rubies.* » et une grille 2 colonnes (2.5-Hour Speedup ×4, Double Tax Week Writ, 1 Week Food/Wood/Metal/Stone Nanos, 20,000 Gold ×2, 20,000 Food ×2).
- `doa_Matryoska_mystery_chest.jpg` : des **coffres imbriqués** (un coffre contient un autre coffre).

### 5.3 Accélérations — `yt_Qd-3epRJulE_hq1.jpg`
**[C]** Modale « **In a Hurry? Chronos Can Help!** » : à gauche, le personnage Chronos tient un sablier lumineux. À droite, un cadre doré : tâche « Science Center (Lv.?) – Capital City – 20m 33s », puis la liste suivante.

| Objet | Effet | Coût |
|---|---|---|
| **Jump** | −1 h (« Down to 0s ») | 10 rubis |
| **Skip** | −15 min (« Down to 5m 36s ») | 5 rubis |
| **Hop** | −5 min | 3 rubis |
| **Blink** | −1 min | 1 rubis |

Chaque ligne affiche « You have: 0 » et Buy, ou Use si l'objet est possédé. **Le jeu calcule le temps restant après usage** (« Down to … »).
Paliers du wiki : Blink 1 min, Hop 5 min, Skip 15 min, Jump 1 h, Leap 2,5 h, Bounce 8 h, Bore 15 h, Bolt 24 h, Blast 2,5 j, Blitz 4 j.
HotD : bouton « **Free** » pour les dernières minutes (`hotd_20200629_133906.jpg`), et **Ruby Mine** (`hotd_Ruby_Mine_Interface.jpg`) :
- « *Additional Construction & Training queues appear for each active Ruby Mine selection.* »
- 1 rubis/jour gratuit pendant 30 jours ;
- 240 rubis + 5/jour ;
- 1600 + 10/jour.

**Ce qu'on peut en tirer** :
- Un personnage d'accélération (« **le Lutin-Horloger** ») et une liste d'objets à paliers qui affichent « **ramène à X** ».
- Un **bouton gratuit sous N minutes** (très bon pour un jeu familial).
- **Pas de file payante** : on l'évite pour la cible enfant, ou on la donne par progression.

### 5.4 Achat de monnaie premium — `doa_Rubies_New_Pic.png`
**[C]** Grille de 7 packs : 65 rubis à $9.90, 155 à $19.90 (+40 gratuits), 225 à $29.90, **400 à $49.90 « Most Popular »**, 1000 à $99.90, 2500 à $249.90, **5000 à $399.90 « Best value »**. On voit aussi « Redeem a Kabam Card / Enter Pin Code ».
**Ce qu'on peut en tirer** : uniquement comme repère anti-modèle pour un jeu familial. Il n'y a pas d'achat réel à prévoir.

### 5.5 Forge et équipement (fin de partie) — `doa_Forge_*.png`, `doa_Stalkers.png`
**[C]** :
- Forgeron PNJ « **Hephaestus The Blacksmith Level 8** », état « Idle ».
- **Durabilité du marteau 95/95** + **Repair** ; un Crush coûte 30m.
- Recette « Fangtooth Spear – *A ruby encrusted trident* » ; liste déroulante « Chance Booster » (Strength of Hephaestus Uncommon (42), Elixir of Kratos Uncommon (16)) ; ingrédients 1/245 ; bouton **Forge**.
- Aventuriers (**Tyche** « *lucky … all types of items* », **Nereus** « *water type items* ») envoyés en missions ; un journal de 2000 missions liste les drops par heure.
- L'équipement des troupes (Shadow Stalker Claws Lvl 6 : +240 / +1,194 / +4,044) se gère par Equip/Unequip et Go to Forge.

**Ce qu'on peut en tirer** : un « **Atelier des jouets spéciaux** » avec des recettes et une chance de réussite. Une durabilité d'outil qui se recharge avec le temps crée un rythme naturel. Les **aventuriers-lutins** partent en expédition pour ramener des matériaux.

### 5.6 Commerce joueur-joueur — `doa_Trade_Buy.png`, `doa_Trade_Sell.png`, `doa_Marketplace_Ratio_Chart.png`
**[C] Trading Post** :
- Onglets **Buy / Sell**.
- Filtres déroulants Product (ore) / Min. Quantity (1,000) / Max. Price (251,000).
- Tableau Product / Seller / Unit Price / Total Price / Buy : 1,000 à 50 = 50,000 ; 10,000 à 9 = 90,000 ; 20,000 à 4 = 80,000.
- Panneau « **Purchases** » : 1,000 — Time Left **30m 0s** — SPEED.
- Vente : « *Currently Selling (expires in 1 week)* » ; Product / Quantity / Unit Price ; **Seller's Fee** 5000 ; Sell.
- Marketplace (Abyssal) : trades gratuits par jour selon le niveau (L1 : 0, L2 : 1, L3 : 1, L4 : 2 … L10 : 5).

**Ce qu'on peut en tirer** : un **marché du village** avec livraison en 30 minutes. Pour un jeu solo, on le remplace par un PNJ marchand qui fait des offres à prix variables.

---

## 6. Dragons secondaires, Sanctuary, rétention

### 6.1 Sanctuary / Master Rookery / Guardian Roost — `doa_Inventory_screen.png`, `doa_Marches.jpg`, `doa_(94)_…santuary.png`, `doa_Dragons_of_Atlantis_Kabam.png`, `doa_2_alwetende_gifdraken_kruizen.jpg`
**[C]** :
- **Master Rookery** : « *where the dragons born in the Sanctuary reside… upgrade the dragons to grow them to adults, enabling them to breed and unlock new abilities…* ». On y voit une **grille 5×5 de portraits** (dont 2 slots verrouillés en silhouette), un panneau de détail et les boutons **Upgrade / Equip / Release**.
- **Guardian Roost** : « *Place hatched dragons here… to provide their magical abilities across your empire. You must have an open space here in order to hatch eggs in the Hatchery. More roosts can be purchased…* » La carte du dragon montre :
  - nom et rareté (« Common Helio Dragon », « Lesser Fire Dragon », « Legendary Hydra Dragon ») ;
  - symbole ♂/♀ et niveau ;
  - **3 capacités par paliers de niveau 1 / 6 / 10**, grisées tant qu'elles sont inactives : Food Capacity I, Wood Capacity I, Armored Transport Load I ; ou Marches I / Focused Anthropus… / Conscript Defense ;
  - « *This dragon's abilities are active.* » ;
  - Swap / Unequip / Release / Enchant.
- **Reproduction** (Drakenhol) : deux parents côte à côte, les capacités héritées en %, un œuf au centre, « Broedtijd » (temps d'incubation) 21h 23m 50s, boutons Accélérer / Annuler.
- `doa_Capturedoa.jpg` : « *Your dragons have delivered an egg to your Hatchery Nests!* »
- Table **Speed Attributes** : chaque capacité a une rareté en étoiles et un maximum en % (Mobility 6000 %, Banshee Speed 5000 %).

**Ce qu'on peut en tirer** : une **étable de petits rennes ou d'animaux de la banquise**. Chacun donne un bonus passif à la production, avec 3 talents qui s'ouvrent aux niveaux 1/6/10. Le nombre de places assignées est limité. On peut les **croiser** pour obtenir des talents hérités. C'est de la collection douce, sans combat.

### 6.2 Dragon Cave et entraînement du dragon (HotD) — `hotd_Screenshot_2014-01-25-15-18-43-1-.jpg`, `hotd_Cave_rewards.jpg`, `hotd_Normal_training.jpg`, `hotd_Advanced_training.jpg`
**[C]** :
- **Dragon Cave** : un coffre nommé « **High Mountain Treasure** » (ou Ancients Plunder, Lost Treasure of Atlantis, Dark Forest Treasure, Legendary Treasure) ; un dragon 3D en armure ; un médaillon du dragon choisi ; **Dispatch**.
- « *Remaining Explorations: 0* » ; « **Time left to refresh: 3H 43M 0S** » en rouge.
- « Dragon Exploration 3H 19M 5S » + **Speedup**.
- Récompense : popup « Reward — 15-Minute Speedup x1 — **Claim Reward** » (ou 25 SSD, 20,000 Wood, 10,000 Metal…).
- **Entraînement du dragon** : Normal Training « Dragon EXP +1221 », coût 12730 or, 30M ; Advanced Training « +1465 », 5 rubis, 30M.
- **Training Complete** : portrait du dragon niveau 52, barre XP 66 %, Dragon EXP +1221, or 45000, Rewards ×3, OK.

**Ce qu'on peut en tirer** — l'**expédition de la mascotte** :
- N expéditions par période, qui se rechargent toutes les X heures ;
- un coffre nommé avec une destination poétique (« Trésor du Grand Nord ») ;
- une récompense aléatoire dans une table courte.

### 6.3 Connexion quotidienne, niveaux, coffres débutant — `hotd_June_daily_login_rewards.jpg`, `hotd_Level19.jpg`, `yt_7NDqtKsKYoo_hq2.jpg`, `yt_FpOU-6TCY2o_hq2.jpg`
**[C]** :
- **June Daily Login Reward** : une bannière à **rideau rouge**. Texte : « *You have logged in a total of 18 days this month. Tap and claim your rewards according to the days logged-in!* »
  - Grille **5×5 (25 jours)**, chaque case avec numéro et objet ; les jours réclamés ont une **coche verte**.
  - Les cases sont **cumulatives**, pas consécutives : 18 jours au total.
  - La récompense du jour 25 est une **Completion Grant**, l'objet-clé du niveau 10.
- **You Have Reached Level 19** : blason doré flanqué de deux dragons ; « You Have Been Rewarded: » Food 25,850, Wood 31,480, Stone 30,900, Metal 13,750, Gold 34,400 ; Claim Reward.
  Autres paliers : L6 2,450/3,200/2,840/1,270/3,400 ; L7 3,350/4,280/3,920/1,750/4,600 ; L21 31,700/38,600/37,900/16,870/42,000 ; L26 48,950/59,300/58,600/26,070/65,000. Croissance ≈ ×1,07 à ×1,1 par niveau [I].
- **Player Info** : onglets Details / Realms ; « LEVEL UP REWARDS – *Leveling up allows you to earn more rewards* » + Claim Reward (un coffre gratuit tous les 5 niveaux) ; Rename City / Rename Player ; Leaderboards / Achievements.
- **Beginner's Chest** : « *Contains items to help establish your city* » ; 1-, 5- et 15-Minute Speedup, 1 Day Food/Wood/Stone/Metal Nanos ; Claim.

**Ce qu'on peut en tirer** — c'est le système le plus directement transposable en **calendrier de l'Avent** :
- une grille de **24 cases** pour le mois de décembre ;
- un comptage **cumulatif** (pas de punition si on rate un jour) ;
- un gros objet-clé le dernier jour ;
- une popup de niveau festive avec 5 ressources.

### 6.4 PvP de « vitrine » : Arène et championnat (HotD) — `hotd_Screenshot_2014-06-11-10-59-22.png`, `hotd_appstore_gb_ipad_4.jpg`, `hotd_WinStreak51.png`
**[C] Arène** :
- Onglets Arena Hall / Ranking / History / Store.
- Rank 100, Medals 185 (« *Earn Medals … trade in the Store* »).
- « Current Team1 Troop Power 25000/25000 » (« *Every 5 Player levels … increases Team Troop Power Capacity* »).
- Slots General / Dragon / Troops / Tome : « *You will NOT lose Troops participating in the Arena* ».
- Liste des rangs voisins avec bouton **VS** : « *Switch ranks with the player if you win!* »
- « *You have 10 free challenges daily* », « Reward Time Left 2D12H ».

**Dragon Lord Championship** : groupe A, plateau de 5 dragons (niveaux 75, 50, 82, 83), My Rank 5, Team Power, Manage, Free Refresh, Skip Animation.
**Win streak** : W 3 / L 0 → 30 pts ; Max Win Streak 51 → 100 pts ; All Dragons Survived 20 pts ; Bonus Time ×1.2.

**Ce qu'on peut en tirer** : des **concours sans perte** (concours de décoration, course de traîneaux), avec quelques essais gratuits par jour, un échange de rang et des médailles dépensables dans une boutique dédiée.

### 6.5 Classements, défis, tournois, événements — `doa_Leaderboards.png`, `doa_Bandicam_*`, `doa_CoA_Tournament_UI.png`, `doa_Event.PNG`, `doa_Untitleddd.jpg`
**[C]** :
- **Leaderboard** : onglets By Alliance / By Player / Tournaments / Challenges « Active! ».
- « **Compete in Tiered Power Challenge!** — Active Until Thu Jun 6 2013 — Time Left 6h 23m 9s » : « *As you complete each tier … your display interface will change from Bronze to Silver to Gold* ».
  - Trois coffres : Gain 200K Power → Bronze, 4.50M → Silver, 7.50M → Gold.
  - Ma ligne : Rank 15, Safien, 788,595 ; tableau des rangs 11-20 ; pagination « 1…65 ».
- **Power Challenge** (Shadow Empire) : paliers 500 K / 1 M / 25 M / 100 M / 200 M de Power gagnée, chacun avec un pack ; « *Limit 1 Prize Pack per tier* ».
- **Tournoi** CoA : 5 coffres par tranche de rang (11-20, 6-10, 4-5, 2-3, 1) ; « Your Information : Rank 174 » ; tableau Rank/Name/Power/Points.
- **Events** : un bloc « Active Tournament! » (« *Compete in the Tournament of Power and win the newest … Royal Woolly Dragon* ») et une section **Dragon Key Mystery** avec compte à rebours 9h 30m 13s. Un **bandeau d'événement rouge** est collé au-dessus de la barre de ressources (`doa_Events_button.png`).
- **Dark Towers** (événement PvE) : rapport « *Dark Tower Damaged! … Continue to siege* » ; « You have 73 [Attack Again] ».
- **Messages saisonniers** : « *A New Dragon of Ice — As the winter season brings its cold winds to Atlantis…* » (Cassandra), qui annonce l'avant-poste Frost et l'œuf en boutique.

**Ce qu'on peut en tirer** :
- Des **défis à paliers personnels** : « gagne X d'Esprit de Noël d'ici dimanche » → bronze/argent/or, avec une **interface qui change de couleur**. C'est plus sain qu'un classement pur.
- Des **événements saisonniers annoncés par lettre** de la conseillère.

### 6.6 Alliance et profil — `doa_Allianc_screen.png`, `doa_Alliance_Board.png`, `doa_Untitled.png`, `doa_Message.jpg`
**[C]** :
- **Alliance** : nom, Overlord, Rank 1, Power 47,470,489,675, Members 13 ; un bloc de message d'accueil ; onglets **Members / Activity / All Alliances / Applicants** ; Message Alliance ; tableau Name / Status (Overlord, Leader, Lord, Vassal) / Level / Power + View + Message ; Search ; **Resign** ; « Appoint Overlord Replacement ».
- Annonce d'une alliance d'entraide : « *Each member receives a small amount of resources per week until they reach level 14.* »
- **Profil d'un joueur** :
  - Title, Power ;
  - texte de race (« *The first Human Tribe was the Primus. They are peaceful and analytical…* ») ;
  - Alliance, Overlord, Rank (liste déroulante « Vassal ») ;
  - avatar en pied + grand dragon armuré dans son arène ;
  - boutons **Message / Send Resources / Reinforce / Dismiss**.

**Ce qu'on peut en tirer** : une **visite du village d'un ami** avec sa mascotte. Les actions sont amicales : envoyer un cadeau, aider un chantier.

### 6.7 Rapports et messages — `doa_Batte_report.png`, `doa_Spy_vs_Spy.png`, `doa_City_Spy.png`, `hotd_Screenshot_2014-01-03-20-40-22.png`, `doa_Urgent_Report.jpg`
**[C]** :
- **Rapport de bataille DoA** :
  - grand titre « **Defeat!** » / « **Victory!** » ;
  - Report No. et date ;
  - sous-titre narratif (« *Your walls were breached. Your Great Dragon was overwhelmed.* ») ;
  - « 0 souls recovered. Build Spectral Outpost » (lien d'appel au contenu) ;
  - illustration ;
  - encart **Resources** (−1,214,258 ×5, talismans, « no items ») ;
  - deux tableaux côte à côte : attaquant **Victorious** (vert/rouge) et défenseur **Defeated**, colonnes Troops / Fought / Survived ;
  - variante HotD : colonnes **Injured / Survived / Fought** + bouton vert **Recover** (soigner) et médailles **WIN** / **LOSS** (crâne).
- **Rapport d'espionnage** :
  - ressources ;
  - « **Last time awake** » (dernière connexion de la cible) ;
  - Troops/Total ;
  - niveaux de recherche de la cible ;
  - « *Research higher levels of Clairvoyance for more detailed spy reports!* ».
- **Message officiel** : un **rouleau de parchemin** déroulé (« Official Communication from Dragons of Atlantis » ; To / Date / Subject ; zone de texte jaune ; Delete / Close). Le texte sert au **lore** et annonce le contenu (temple Zolmec → serpent Mephitic).

**Ce qu'on peut en tirer** :
- Des **rapports en deux colonnes** pour les tournées de livraison : livré / perdu dans la neige.
- La **lettre de la conseillère** sur parchemin pour raconter et annoncer les nouveautés.
- Des liens « Construire X » dans les rapports pour guider.

### 6.8 Écrans de démarrage — `doa_Races.png`, `doa_Realm_Screen.png`, `doa_1st_screen.png`, `doa_2nd_pic.png`…
**[C]** :
- « **Choose Your Destiny** » : 4 grandes cartes portrait (Zolmec / Amazon / Solerian / Primus), chacune avec une phrase de caractère et **Select**. La race change l'apparence des bâtiments au niveau 11 (`doa_Ppl_city.png`).
- « **Select Your Realm** » : liste radio # / Realm / Lang / Population (Low / Medium / Very High / **Full**) / Your Player. « *You can share only Rubies between your Realms* ».
- **Premier écran** : Cassandra dit « *Welcome to a new realm in Atlantis… you have been granted an Expansion Chest… It is available now in your items.* » Done.
- Série 2nd→6th : la ville se construit de quêtes en quêtes. Le HUD affiche « **Protection: 6d 23h 28m 7s** », soit **une protection débutant de 7 jours** [C, qui confirme la valeur que l'autre fichier laissait inférée].

**Ce qu'on peut en tirer** : un **choix d'apparence au démarrage** (style du village : alpin, scandinave, pain d'épices, glace) qui change les skins au palier 11, une conseillère-guide, et un **cadeau de bienvenue déjà dans l'inventaire**.

---

## 7. Langage visuel et UX : règles concrètes

### 7.1 Ce qui est constant (DoA navigateur)
1. **Matière** : pierre sombre, bordures dorées gravées, bandeau titre doré en arc avec des volutes. Le contenu est sur **parchemin ou sable clair**. Le contraste vient d'un cadre sombre et d'un contenu clair.
2. **Typo** : serif en **petites capitales** pour les titres, boutons et en-têtes (Trajan ou Cinzel). Texte courant en sans-serif simple (Arial/Verdana 11-12 px).
3. **Couleurs fonctionnelles** :
   - turquoise = action principale (Upgrade, Research, Train) ;
   - **rose framboise = dépense premium** (Buy, SPEED, Buy Rubies) ;
   - **cyan = état actuel**, blanc = niveau suivant ;
   - **coche bleue** = prérequis rempli, **croix rouge et ligne rouge** = manquant ;
   - rouge = erreur ou blocage (« Requirements Unmet », « Training Queue Full ») ;
   - vert = victoire, rouge = défaite.
4. **Bouton de fermeture** : X turquoise carré en haut à droite, toujours au même endroit.
5. **Modales centrées par-dessus la vue**. Une seule modale à la fois, plus les popups de confirmation (« You Received »).
6. **Badges** : niveau = carré jaune sur chaque bâtiment ; pastille numérique dorée sur Quests et Messages ; compteurs sur les icônes de file.
7. **Nombres** : séparateurs de milliers complets dans les dialogues (48,324,388), **abrégés K/M/B dans le HUD** (365K, 4.05B).
8. **Le temps** suit toujours l'action : sous le bouton Upgrade, à droite d'une file, au pied de la modale Attack (Estimated Time).
9. **Infobulles** au survol des tuiles de carte et des ressources (détail Production / Consommation).
10. **Raccourcis clavier** (`doa_DoA_Hot_Keys_Keyboard.png`, wiki *Hot Keys*) : Q Quêtes, W Mur, E Empire, R Recherche, T Entraînement, I Messages, S Boutique, D Dragon, F Field, G Généraux, H Forge, L Classement, X Attaque, C Ville, B Sanctuary, M Carte, A Alliance, Esc fermer.

### 7.2 Évolutions HotD (mobile)
- **Barre de titre fixe** : retour ville (icône tour) à gauche, titre au centre, monnaie premium « Get More » à droite.
- Boutons larges **bleu (attente) / vert (instantané ou récompense) / rouge (destruction)**.
- **Sliders + champ + MAX** pour toutes les quantités.
- Cadenas et chaînes sur ce qui est verrouillé ; « Unlocked at Lv.X » en rouge.
- Bannières en **ruban rouge** pour les moments de célébration (Training Complete, Daily Login).
- Bouton **i** vert pour l'aide contextuelle sur chaque écran.
- **Dock** de 5-6 icônes illustrées en bas, et onglets contextuels March / Research / Train / Build.
- Bulles flottantes d'appel à l'action dans le monde (« Research! », « Free », coffre).

### 7.3 Règles à appliquer au village de Noël
1. **Un seul gabarit de dialogue de bâtiment** (§2.1) pour tout le jeu, avec : titre + niveau, phrase d'ambiance, Actuel (couleur) → Suivant, tableau Possédé/Requis avec coches, bouton principal + temps juste dessous, action destructive séparée en bas.
2. **Couleur = intention** : vert sapin = action, or = récompense, **rouge baie** = manque ou blocage, bleu glace = information. Jamais deux sens pour une même couleur.
3. **Le bouton Max calcule le facteur limitant** et la ligne limitante s'allume.
4. **Toute file est visible sans ouvrir de bâtiment** : icônes avec compteur sur le bord, ligne d'état « Rien en construction » / « Atelier → 2 min ».
5. **Chaque récompense passe par une popup « Tu as reçu »** groupée par type, avec un seul bouton OK.
6. **Le verrouillé reste visible** (silhouettes d'armure, cadenas sur les recherches, cases du calendrier) pour montrer le chemin.
7. **Nombres abrégés dans le HUD, complets dans le détail.**
8. **Une conseillère** (ici Mère Noël ou une lutine) qui parle en bulles pendant le tutoriel et écrit des lettres pour les événements.
9. **Badges de niveau** sur chaque bâtiment ; l'apparence change aux paliers 5/10/15.
10. **Bouton « i »** sur chaque écran plutôt qu'un manuel.

---

## 8. Systèmes consolidés (chiffres du wiki)

> Toutes les valeurs sont **[C]** (tables des wikis lues via l'API) sauf mention contraire. Les temps sont à Levitation 0.

### 8.1 Production, ouvriers, capacité (champs)
**Ferme DoA** (identique pour Scierie, Carrière et Mine pour la production ; seuls les coûts sont permutés) — wiki *Farms* :

| Niv | Prod/h | Ouvriers | Capacité | Coût N/B/M/P | Or | Temps |
|---|---|---|---|---|---|---|
| 1 | 100 | 10 | 12k | 50/300/150/200 | — | 15 s |
| 2 | 300 | 30 | 36k | 100/600/300/400 | — | 30 s |
| 3 | 600 | 60 | 72k | 200/1,200/600/800 | — | 1 m 1 s |
| 4 | 1,000 | 100 | 120k | 400/2,400/1,200/1,600 | — | 2 m 4 s |
| 5 | 1,500 | 150 | 180k | 800/4,800/2,400/3,200 | — | 4 m 12 s |
| 6 | 2,100 | 210 | 252k | 1,600/9,600/4,800/6,400 | — | 8 m 30 s |
| 7 | 2,800 | 280 | 336k | 3,200/19,200/9,600/12,800 | — | 17 m 14 s |
| 8 | 3,600 | 360 | 432k | 6,400/38,400/19,400/25,600 | — | 34 m 54 s |
| 9 | 4,500 | 450 | 540k | 12,800/76,800/38,400/51,200 | — | 1 h 10 m 41 s |
| 10 | 5,500 | 550 | 660k | 25,600/153,600/76,800/102,400 + Completion Grant | — | 2 h 23 m 8 s |
| 11 | 6,600 | 660 | 792k | 51,200/308k/153.6k/204k | 100k | 4 h 46 m |
| 12 | 7,800 | 780 | 936k | 102k/616k/307k/408k | 200k | 9 h 32 m |
| 13 | 9,100 | 910 | 1,092k | 205k/1.23M/614k/816k | 400k | 19 h 4 m |
| 14 | 10,500 | 1,050 | 1,260k | 410k/2.46M/1.23M/1.63M | 800k | 1 j 14 h |
| 15 | 12,000 | 1,200 | 1,440k | idem | 1M | 3 j 4 h |

- **Formules** [I, vérifiées sur toutes les lignes] :
  - `prod(n) = 50·n·(n+1)` jusqu'au L15 ;
  - `ouvriers = prod/10` ;
  - `capacité = 120 × prod` ;
  - `coût(n) = coût(1) × 2^(n−1)` ;
  - `temps(n) ≈ 15 s × 2^(n−1)`.
- Le L11-15 demande des *Advanced Masonry Tools*, le L16+ des *Mystic Masonry Tools* (wiki).
- **HotD Farm** (wiki HotD *Farm*) : 100, 300, 600, 1,000, 1,500, 2,100, 2,800, 3,000 (sic), 4,500, 5,500 (L10). Le gain devient ensuite **linéaire et faible** : +350/niveau du L11 au L15, +450 du L16 au L20, +600 du L21 au L25, +800 du L26 au L30, +1,000 du L31 au L35 (21,500 au L35). Les ouvriers plafonnent à 550 ; **capacité = 100 × prod** ; coût L1 50/300/200/150 ; temps L1 5 s, L2 30 s, L3 3 m 15 s. Le L10 et le L20 demandent un Completion Grant ; L21 10 Obsidian, L24 50…
- **Production de base sans champ** : 100/h par ressource (wiki *Silo*).

### 8.2 Population, bonheur, impôt
- `Population = Capacité(Maisons) × Bonheur %` (wiki *Population*).
- `Bonheur = 100 − taux d'impôt + 2 × niveau du Théâtre`. Le tableau du Théâtre donne +2 %/niveau jusqu'au L6, puis +3 % pour atteindre +25 % au L10.
- `Population inactive = Population − Ouvriers des champs − Recrues en formation`.
- `Or/heure = capacité des maisons × bonheur × taux`. L'optimum est atteint quand **taux = bonheur** (≈ 50 %, ou (100 + 2T)/2 avec Théâtre T) (wiki *Tax* + `doa_DoA_Taxes.jpg`).
- Pratique documentée : impôt à 50 % hors entraînement, 0 % pour entraîner, puis retour à 50 %.
- **Maison DoA** (wiki *Home*) :
  - population 100, 300, 600, 1,000, 1,500, 2,100, 2,800, 3,600, 4,500, 5,500 (L10), 7,000, 8,200, 9,500, 10,900, 12,400 (L15), 14,000 … 21,400 (L20) … 63,400 (L35) ;
  - coût L1 250/1,200/500/1,500, ×2 ;
  - temps 10 s, 20 s, 41 s, 1 m 23 s, 2 m 48 s, 5 m 40 s, 11 m 29 s, 23 m 16 s, ~46 m, 1 h 35 m (L10) ;
  - le L16+ ajoute de la **capacité de marche** (+1,000 en avant-poste / +5,000 en ville au L16, jusqu'à +100,000 en ville au L35) ;
  - objets requis : Completion Grant (L10), Ancestral Seal (11-15), Better Home Grant (16-20), Better Estate Grant (21-25), Dominion Grant (26-30), Ascendancy Grant (31-35).
- **Maison HotD** : Home 13 → 14 : « Raise Population Limit by 2800 » [C capture].
- Maisons des Solarian Highlands : ×1,5 de population.
- **Théâtre HotD** : « Tax Limit with still 100 happiness » vaut 1, 3, 4, 5, 6 … 11 (L10) … 25 (L20). Le jeu le juge inutile, puisqu'on conseille 0 % d'impôt en HotD.

### 8.3 Stockage et protection
- **Capacité** = somme des capacités des champs (120 h de production chacun). La production **s'arrête au plafond** ; le pillage peut le dépasser.
- **Storage Vault DoA** (protège, n'augmente pas la capacité) :
  - L1 100k, L2 400k, L3 600k, L4 800k, L5 1M, L6 1.2M, L7 1.4M, L8 1.7M, L9 2M, **L10 3M** (+ protection contre la famine), L11 5M + 500k d'or, L12 7M, L13 10M, L14 12.5M, L15 15M, L16 20M … L20 40M … L30 90M ;
  - temps 10 m → 3 j 23 h (L10) → 21 j 16 h (L16+) ;
  - coût L1 100/1,500/300/1,000.
- **Silo d'avant-poste** :
  - stock 6,900 / 20,700 / 41,400 / 69,000 / 103,500 / 144,900 / 193,200 / 248,400 / 310,500 / 379,500 (L10) ;
  - coût L1 250/1,200/500/1,500 ×2 ;
  - **non protégé** (100 % perdu si l'avant-poste est attaqué) ; collecte manuelle ou *Collector Nanos* ;
  - le nombre de silos est limité par le Keep de l'avant-poste.
- **Warehouse** (Lost City) : 100k → 400k protégés [C capture].

### 8.4 Entraînement et garnisons
- **Formule du temps** (wiki *Troops*) : `Temps(s) = T × B / (G + (L − G)/10)`, avec :
  - T = nombre de troupes ;
  - B = temps de base de la troupe ;
  - G = nombre de garnisons du site ;
  - L = somme de leurs niveaux.

  → **une garnison de plus vaut 1, un niveau de plus vaut 0,1**. C'est pour ça que les villes se couvrent de garnisons.
- Pour les dragons-troupes, on divise en plus par `(1 + Rookery/100)`.
- **Minimum absolu : 30 s** par file.
- Coûts Garrison : L1 250/1,200/500/1,500, ×2 jusqu'au L14.
- Déblocages et bonus affiché par niveau :

| Niveau | Débloque | Bonus |
|---|---|---|
| L1 | Porter & Conscript | +10 % |
| L2 | Halberdsman & Spy | +15 % |
| L3 | Minotaur | +20 % |
| L4 | Longbowman | +25 % |
| L5 | SSD | +30 % |
| L6 | Armored Transport | +35 % |
| L7 | Battle Dragon | +40 % |
| L9 | Giant | +50 % |
| L10 | Fire Mirror & élites | +55 % |
| L20 | Dimensional Ruiners | +105 % |

- **File** : chaque garnison = une file (popup « Training Queue Full… add more Garrisons »).
- **Stats des troupes** (sélection) :

| Troupe | Mêlée | Déf | Vie | Vitesse | Portée | Charge | Distance | Entretien | Power | Base |
|---|---|---|---|---|---|---|---|---|---|---|
| Porter | 1 | 10 | 45 | 100 | 0 | 200 | 0 | 2 | 1 | 48 s |
| Conscript | 10 | 10 | 75 | 200 | 0 | 20 | 0 | 3 | 1 | 26 s |
| Spy | 5 | 5 | 10 | 3000 | 0 | 0 | 0 | 5 | 2 | 103 s |
| Halberdsman | 40 | 40 | 150 | 300 | 0 | 40 | 0 | 6 | 2 | 141 s |
| Minotaur | 70 | 45 | 225 | 275 | 0 | 30 | 0 | 7 | 3 | 219 s |
| Longbowman | 5 | 30 | 75 | 250 | 1200 | 25 | 80 | 9 | 4 | 343 s |
| SSD | 150 | 60 | 300 | 1000 | 0 | 100 | 0 | 18 | 5 | 498 s |
| Battle Dragon | 300 | 300 | 1500 | 750 | 0 | 80 | 0 | 35 | 7 | 1492 s |
| Armored Transport | 5 | 200 | 750 | 150 | 0 | 5000 | 0 | 10 | 6 | 975 s |
| Giant | 1000 | 400 | 4000 | 120 | 0 | 45 | 0 | 100 | 9 | 4334 s |
| Fire Mirror | 20 | 30 | 1500 | 50 | 1500 | 75 | 1200 | 250 | 10 | 5843 s |
| Pack Dragon | 150 | 400 | 850 | 1000 | 0 | 6000 | 0 | 10 | 6 | 1831 s |

- Coûts unitaires vus en capture :
  - Conscript : 80 nourriture + 100 bois + 50 métal + 1 pop, Garrison 1 ;
  - Porter : 50 nourriture / 150 bois / 10 métal / 1 pop ;
  - Longbowman : ~300 nourriture / 350 bois / 300 métal / 2 pop, Garrison 4, Weapons Calibration 1 ;
  - SSD : 1,000 nourriture / 600 bois / 500 métal / 3 pop, Garrison 5, Rookery 1, Dragonry 2, Rapid Deployment 1.
- **Training Camp** (garnison d'avant-poste) : 14 camps L10 entraînent 500 Fangtooth en 10 h 55 m 23 s (capture + wiki).

### 8.5 Muster Point, Officers' Quarters, marches
- **Muster Point** :
  - L n → **n marches simultanées** ;
  - troupes par marche 20k × n jusqu'au L10 (200k), puis 240k (L11), 280k … 760k (L20), 1.16M (L30) ;
  - coût L1 100/600/250/2,000, ×2 ; temps 1 m 30 s → 14 h 18 m (L10) → 17 j 8 h (L18+) ;
  - **en avant-poste : +5,000 par niveau** de capacité de marche, et « Host N units of defending troops ».
- **Officers' Quarters** :
  - **généraux = niveau + 3** (4 au L1 → 13 au L10 → 30 au L27) ;
  - coût L1 400/2,500/700/1,200, 6 min ;
  - le salaire est prélevé sur l'or ;
  - un général gagne des **étoiles** avec les victoires (5 ★ = 13 victoires ; le conseil est d'attaquer en boucle une contrée L1).
- **Marche** :
  - `temps = 30 s + distance × (s/case de la troupe la plus lente)`, avec Rapid Deployment +5 % de vitesse par niveau ;
  - la charge = Σ charge des troupes ;
  - le « wave attack » consiste à envoyer une grosse marche suivie de marches de 1 troupe pour re-piller en boucle (`doa_Wave_attack.png`).

### 8.6 Recherche
- Une recherche à la fois.
- **Niveau N ⇔ Science Center ≥ N et bâtiment lié ≥ N** : Agriculture ↔ Ferme, Woodcraft ↔ Scierie, Masonry ↔ Carrière, Alloys ↔ Mine, Metallurgy ↔ Metalsmith + Alloys (+ Garrison), Dragonry ↔ Rookery, Mercantilism ↔ Factory.
- **Agriculture** : +10 %/niveau (+25 % au L11+) ; coût or/nourriture/métal 1,000/500/100 ×2 ; temps 7 m 13 s → 2 j 20 h 52 m (L10).
- **Levitation** :
  - −9,09 %, −16,67 %, −23,08 %, −28,57 %, −33,33 % … −50 % (L10) … −66,67 % (L20) ;
  - `t = base / (1 + 0,1 × niveau)` ;
  - prérequis SC 5 + Woodcraft 5 ; L1 5,000 or / 2,000 métal / 2,000 bois, 29 m 36 s.
- Effets des autres branches :
  - Weapons Calibration +5 % de portée ;
  - Metallurgy +5 % d'attaque/défense ;
  - Medicine +5 % de vie ;
  - Dragonry +5 % de vitesse des dragons-troupes ;
  - Rapid Deployment +5 % de vitesse de marche ;
  - Rationing −5 % d'entretien ;
  - Mercantilism +1 échange simultané ;
  - Clairvoyance : rapports d'espionnage plus riches.
- **Durée totale 0 → 10** : Agriculture 5 j 15 h ; Woodcraft 6 j 10 h ; Masonry 6 j 22 h ; Alloys 7 j 19 h ; Metallurgy et Mercantilism 17 j 11 h ; Rapid Deployment, Medicine et Levitation 23 j 5 h ; Dragonry 30 j 23 h ; Weapons Calibration 32 j 4 h ; Rationing 40 j 19 h ; **tout : 312 j 10 h**.
- **Science Center** : L1 120/2,500/200/1,500, 8 min ; L5 2 h 14 m ; L10 3 j 4 h + Completion Grant + Forteresse 10 ; L11 + 200,000 or + Ancestral Seal.

### 8.7 Grand Dragon et Keep
- **Coûts du Keep** :
  - L2 800 nourriture / **3,000 or** / 5,000 bois / 1,400 métal / 2,400 pierre, 9 min ;
  - ×2 par niveau : L5 1 h 36, L8 12 h 48, **L10 2 j 3 h 12 + Completion Grant** ;
  - L11-15 + Ancestral Seal, 4 j 6 h → 8 j ;
  - L16-20 + Draconic Seal.
- **Stats du dragon par niveau** (mêlée = distance = défense) :

| Niveau | Mêlée | Vie | Vitesse | Portée | Charge | Entretien |
|---|---|---|---|---|---|---|
| 1-2 | 0 | 0 | 750 | 1,500 | 0 | 0 |
| 3 | 200 | 20,000 | 750 | 1,500 | 0 | 200 |
| 4 | 459 | 45,947 | 750 | 1,500 | 0 | 400 |
| 5 | 747 | 74,743 | 750 | 1,500 | 0 | 600 |
| 6 | 1,055 | 105,560 | 750 | 1,500 | 0 | 800 |
| 7 | 1,379 | 137,972 | 750 | 1,500 | 0 | 1,000 |
| 8 | 1,717 | 171,716 | 750 | 1,500 | 0 | 1,200 |
| 9 | 2,066 | 206,608 | 750 | 1,500 | 0 | 1,400 |
| 10 | 2,425 | 242,514 | 750 | 1,500 | 0 | 1,600 |
| 11 | ~9,300-10,300 | 795,656 | 1,000 | 1,900 | **90,000** | 1,800 |
| 15 | 16,999 | 1,270,700 | 1,000 | 1,900 | 130,000 | 2,000 |
| 20 | 42,000 | 2,500,000 | 1,250 | 2,300 | 230,000 | — |

  → Croissance concave jusqu'au L10, puis **saut ×4 au palier 11**.
- **Stades** : œuf (L1-2), bébé, juvénile (~L6), **adulte au L8**. Il faut le L8 + **les 4 pièces d'armure** (casque, corps, griffes, queue) + la recherche Aerial Combat pour attaquer avec.
- Les pièces tombent au hasard dans les camps L5+ ou les contrées L7+, à condition qu'un dragon soit dans la marche. Pour le Wraith : Corps = Collines, Tête = Forêts, Queue = Lacs, Serres = Montagnes [C capture].
- **Écailles et armures cosmétiques** avec bonus : Copper Load +1M, Silver Speed +250 / Load +5M, Gold Ranged +100k / Melee +250k, Victory Life +1.5M / Melee +450k, etc.
- **Battle Arts** dès le L11 : 3 compétences de 15 niveaux chacune, améliorées avec des essences d'événement.

### 8.8 Forteresse, Mur, Sentinelle, autres bâtiments
- **Forteresse** :
  - coûts L2 400/600/200/**5,000 pierre**, 30 min ; L3 1 h 1 m ; L4 2 h 4 m ; L5 4 h 12 m ; L6 8 h 30 m ; L7 17 h 14 m ; L8 1 j 10 h 54 m ; L9 2 j 22 h 41 m ; **L10 5 j 23 h 8 m** (1.28M de pierre) ; L11 5.12M de pierre, 10 j 16 h ;
  - elle **plafonne tous les bâtiments à 10** tant qu'elle n'est pas L11 ;
  - au max, occupe 11 contrées et accepte 11 renforts ; +1 parcelle de ressource et de ville ;
  - **HotD** : L1 → 1 contrée, 1 renfort, 11 parcelles ; L5 → 3/3/17 ; L10 → 5/5/25 ; L15 → 7/7/32 ; L20 → 10/10/38 + Completion Grant.
- **Mur** :
  - résistance +1,05 par niveau (1.05 → 10.5 au L10 → 21.45 au L20) ;
  - au L16+, rallonge la marche de l'attaquant de 5 %/niveau ;
  - coût L2 6,000 / 3,000 / 1,000 / 20,000, 1 h ; L10 11 j 22 h ;
  - débloque les **tours défensives** (« Level 1 Defensive Tower unlocked ») ;
  - stratégie de troupes Fight Back / Hide.
- **Sentinelle** : une information de plus par niveau. L1 approche ; L2 espion ou attaque ; L3 heure ; L4 titre et alliance ; L5 force du général ; L6 effectif approximatif ; L7 types + coordonnées ; L8 effectif approximatif par type ; L9 effectif exact ; L10 nom ; L11 buffs d'objets ; L12 boosts du Sanctuary ; L13 Battle Arts ; L14 équipement. Coût L1 150/1,000/300/3,000, 5 min, ×2.
- **Théâtre** : +2 % (L1) → +25 % (L10) ; coût L1 300/2,000/400/1,000, 4 min → 1 j 14 h.
- **Rookery** :
  - un seul par royaume ;
  - L1 1,200 nourriture / 800 or / 2,000 bois / 1,000 métal / 800 pierre, 2 min ; ×2 → 19 h 43 m (L10) ;
  - débloque SSD (L1), BD (L5), Pack Dragon et Sand Strider (L10).
- **Metalsmith** : L1 125/1,000/1,200/600, 3 min → 1 j 4 h (L10) ; débloque Minotaur (1), BD et Giant (5), Fire Mirror (7), Lightning Cannon, Storm Drake et Venge Wyrm (10).
- **Factory** : L1 150/1,500/1,500/500, 9 min → 3 j 13 h (L10) ; +1 niveau de Mercantilism par niveau.
- **Commerce** : Factory 1 + Levitation 1 + Mercantilism 1 ; chaque transaction dure 30 min ; frais vendeur ; les annonces expirent après 1 semaine.
- **Troop Quarters** (Lost City) : capacité 5,000 (L1) → 7,500 (L2) … 100,000 (L8) → 150,000 ; payée en Eternal Runes.
- **Warp Gate** : 1,000 troupes / 100k ressources / 30 min de furtivité (L1) → 7,500 / 180k / 45 min.
- **Watchtower** (HotD) : +215 d'attaque à distance (L1) → +1,694 (L30+) ; +1 slot de général aux L10/20/30 ; Dragon Garrison au L40 ; payée en Arrows et Titarinea.
- **Healing Pool** (HotD) : 36 → 1,980 (L10) → 22,680 (L35) troupes soignables.

### 8.9 Économie des objets-clés et du temps
- **Objets de palier** :
  - Completion Grant (L10) ;
  - Ancestral Seal (L11-15/16) ;
  - Lineage Seal (L17+, puis 2, 3 ou 4) ;
  - Better Home/Estate/Dominion/Ascendancy Grants (maisons) ;
  - Draconic Seal (Keep 16+) ;
  - Advanced/Mystic Masonry Tools (champs) ;
  - HotD : Completion Grant aux L10 et L20, puis Obsidian ×10, ×50 …
- **Sources** : quêtes, connexion quotidienne (jour 25), coffres (Completion Portfolio = 5), boutique, tournois.
- **Courbe du temps** : un niveau ≈ ×2 jusqu'au L10. Après, c'est un **plateau de 4 à 22 jours** (Storage Vault L16+ : 21 j 16 h 50 m ; Muster L18+ : 17 j 8 h ; Mur L11+ : 11 j 12 h). Les ressources demandées plafonnent aussi : c'est l'objet-clé qui fait le mur.
- **Power** : il double à chaque niveau (Garrison 10 → 5,242,880 au L20). Les défis le comptent ×2.
- **Protection débutant** : **7 jours** (timer « Protection: 6d 23h… » au démarrage) [C capture].

### 8.10 Entretien (« upkeep »)
- Chaque troupe consomme de la nourriture par heure (Conscript 3, SSD 18, Giant 100, Fire Mirror 250). Le dragon consomme 200 → 2,000.
- Si le solde est négatif, la réserve tombe à 0 et y reste. **Personne ne meurt**, mais tout ce qui coûte de la nourriture est bloqué (capture `doa_Upkeep.png` : −17.7 M/h).
- Le Storage Vault L10+ protège la nourriture contre la famine. Divine Rations met l'entretien à 0 pendant 12 h. Rationing réduit l'entretien de 5 %/niveau.
- L'entretien a été **supprimé** dans Rise of Atlantis et dans HotD.

---

## 9. Systèmes sans capture exploitable trouvée
- **Dialogue Storage Vault de DoA navigateur** : seule une vignette HotD existe (`yt_swGnfw8IQyI_hq2.jpg`). Les valeurs viennent du wiki (§8.3).
- **Dialogues Scierie / Carrière / Mine** (identiques à la Ferme, §2.1 [I]) ; **Rookery**, **Metalsmith**, **Factory** de DoA (seul le dialogue HotD de la Factory est vu).
- **Dialogue Officers' Quarters de DoA** : seuls la liste des généraux et la carte « FB friend » sont vues.
- **Écran Empire / Wildernesses** (liste des contrées possédées avec bouton Abandonner) : il est cité dans le wireframe Kabam, mais aucune capture n'a été trouvée.
- **Fortuna** (roue ou tirage quotidien) : on a seulement le bouton et des tickets en récompense. Son fonctionnement exact n'a pas été vu.
- **Chat** : les captures sont en vignettes uniquement (World/Alliance, règles affichées).
- **Speed-up de marche** (Forced March Drops) et **Speed-up de soin du dragon** : on voit les boutons SPEED, pas les modales.
- **Healing Pool, Watchtower, Alliance Storage, Alliance Science Center (HotD)** : on a des illustrations de bâtiments (`hotd_Alliance_base.jpg`) et des tables du wiki, pas les dialogues.
- **Tutoriel complet HotD** : seulement par vignettes YouTube (y compris en russe, `yt_KI7JAEYMoBg_*` : nommage de la ville, conseillère).
- Les pages Fandom de bâtiments DoA (Fortress, Home, Garrison…) affichent surtout les **apparences L11 par race**, petites (< 300 px) et non téléchargées.
- Les captures App Store et Google Play actuelles montrent des **contenus 2024-2026** (Dragon Lord Championship, Calamity Trials, Faerie Dragon), loin de la boucle de gestion d'origine.

---

## 10. Ce qu'on peut en tirer — synthèse pour le village du Père Noël

| Mécanique DoA (écran source) | Transposition « village de Noël » | Pourquoi ça marche |
|---|---|---|
| Gabarit de dialogue Actuel → Suivant + Possédé/Requis (`doa_Inside_Field.png`) | Même gabarit pour Atelier, Chalet, Écurie… | Un seul écran à apprendre ; les manques sont visibles d'un coup d'œil |
| Bilan de production en lignes (`doa_Upkeep.png`) | « Bilan du Grand Atelier » : base / recherches / forêts adoptées / boosts / consommation | Rend les bonus compréhensibles et donne envie d'en ajouter |
| Champs à 4 cartes sur parcelle vide (`yt__N3VROxEjI0_hq3.jpg`) | Parcelle de neige → Biscuiterie / Scierie de sapins / Mine de charbon / Carrière de glace | Construction en un clic |
| Silo à vider + Collect All (`doa_Level_1_Silo.png`) | Hotte de l'annexe à ramasser chaque jour | Boucle de retour satisfaisante |
| Max = facteur limitant, Idle Pop (`doa_Ssdstatscreen.png`) | « Combien de jouets ? [Max] » qui montre « limité par : lutins libres » | Enseigne la gestion des goulots d'étranglement |
| Une file par garnison, `T×B/(G+(L−G)/10)` | Une file par établi ; un 2ᵉ établi vaut 10 niveaux | Vrai choix entre étendre et améliorer |
| Impôt/bonheur + courbe (`doa_DoA_Taxes.jpg`) | Curseur « cadence des commandes » ↔ bonne humeur des lutins | Optimum à découvrir, sans punition |
| Dragon qui grandit + 4 silhouettes d'armure (`doa_Inside_Keep.png`) | Renne-mascotte (faon → adulte) + 4 pièces de harnais | Collection visible, objectif clair |
| Guardian Roost, talents L1/6/10 (`doa_(94)…santuary.png`) | Petits animaux de la banquise assignés comme bonus passifs | Collection douce, sans combat |
| Sentinelle : une phrase de plus par niveau (`doa_Sentinel_Report.png`) | Observatoire météo : alerte tempête de plus en plus précise | Progression narrative |
| Quêtes catégorisées qui remboursent ×5 (`doa_Quest.png`) | Journal « Lettres au Père Noël » par chapitres | Onboarding sans frustration |
| Chronos et paliers d'accélération (`yt_Qd-3epRJulE_hq1.jpg`) | Lutin-Horloger avec sabliers 1/5/15/60 min « ramène à X » + bouton Gratuit < 3 min | Temps respectueux pour un public familial |
| Calendrier 25 cases cumulatif (`hotd_June_daily_login_rewards.jpg`) | **Calendrier de l'Avent** de 24 cases, objet-clé le 24 | Thème parfait, sans punition des jours manqués |
| Défi à paliers bronze/argent/or (`doa_Leaderboards.png`) | Défi de la semaine : l'interface se pare de guirlandes argent puis or | Motivation personnelle plutôt que compétitive |
| Lettres officielles sur parchemin (`doa_Ice_outpost_is_coming_.jpg`) | Lettres de la Mère Noël pour annoncer les nouveautés | Narration à bas coût |
| Annexes thématiques (outposts) | Village des Elfes, Mine de cristaux, Pôle des Aurores | Renouvellement du contenu |
| Objet-clé au niveau 10 (Completion Grant) | « Sceau du Pôle Nord », gagné par quêtes ou calendrier | Casse l'inflation pure et rythme les paliers |

**À éviter** (anti-modèles observés) :
- villes clonées remplies de bâtiments identiques ;
- murs de 10 à 22 jours ;
- achats premium omniprésents (BUY rose sur chaque ligne manquante, Ruby Mine qui vend des files) ;
- PvP avec pillage et perte de ressources ;
- entretien négatif bloquant (−17 M/h).
