#!/bin/bash
# Parcours de non-régression, à lancer avant chaque mise en ligne (le jeu doit être servi sur http://localhost:8765).
# Playwright doit être installé (NODE_PATH vers les modules globaux) ; WebKit pour l'iPhone, Chromium pour le PC.
cd "$(dirname "$0")"; mkdir -p out; export NODE_PATH=${NODE_PATH:-$(npm root -g)}
for d in se pc; do
  echo "=== $d tutoriel"; mkdir -p out/$d; timeout 600 node tutoriel-$d.cjs out/$d/ 2>&1 | tail -1
  echo "=== $d colis"; timeout 300 node colis-$d.cjs 2>&1 | tail -3
  echo "=== $d bataille"; timeout 300 node bataille-$d.cjs 6 2>&1 | grep -v "^\s*at " | tail -2
done
echo "=== lettres, loupe, étoiles, établi"; timeout 600 node lettres-etoiles-outils.cjs 2>&1 | tail -7
echo "=== audit des textes (SE + PC)"; timeout 1500 node audit-textes.cjs 2>&1 | tail -6
echo "=== pêche : vraie touche lisible"; timeout 300 node peche-touche.cjs 2>&1 | tail -2
echo "=== freins de la course éteints (Maison 14+ sans défi, accélérations) ; freins allumés en test ; anti-triche"; timeout 300 node freins-eteints.cjs 2>&1 | tail -1; timeout 300 node course.cjs 2>&1 | tail -1; timeout 300 node triche.cjs 2>&1 | tail -1
echo "=== défis de la Maison clairs (villages niv. 18 à 23, SE + PC)"; timeout 900 node defi.cjs 2>&1 | tail -2
echo "=== robot : tous les bâtiments et boutons"; timeout 900 node robot-batiments.cjs 2>&1 | tail -3
echo "=== PC souris : tickets, gains, bataille"; timeout 600 node tickets-souris-pc.cjs 2>&1 | tail -5
echo "=== Mac (Safari) souris"; timeout 600 node tickets-souris-mac.cjs 2>&1 | tail -5
echo "=== comptes (création, connexion, reprise, suppression) — sur l’émulateur"; timeout 600 node comptes2.cjs 2>&1 | tail -5
echo "=== écran d'accueil, bonus de bienvenue, profil (SE, iPhone 13, Mac, PC)"; timeout 1200 node accueil.cjs 2>&1 | tail -4
# suivi + tableau de bord : nécessite l'émulateur Firebase (firebase emulators:start avec firebase/firestore.rules)
if curl -s -m 2 http://127.0.0.1:8080 >/dev/null; then echo "=== suivi invisible + tableau de bord (émulateur)"; timeout 600 node suivi.cjs 2>&1 | tail -4; fi
echo "=== partie légale : conditions, âge, accord parental, chances, pages (SE + PC)"; timeout 900 node legal.cjs 2>&1 | tail -3
if curl -s -m 2 http://127.0.0.1:8080 >/dev/null; then echo "=== règles Firestore contre les sauvegardes de chaque version (émulateur)"; node regles.cjs 2>&1 | tail -3; fi
