# Anti-triche et achats réels : le plan

## Le principe
**La sauvegarde n'est pas une preuve.** Le jeu tourne chez le joueur : une sauvegarde peut être modifiée, que ce soit dans le navigateur ou en recopiant un code. Aucune règle côté jeu ne peut l'empêcher. On ne fait donc jamais confiance à la sauvegarde pour ce qui a de la valeur réelle, c'est-à-dire les achats payés.

## Aujourd'hui (achats simulés, rien n'est vendu)
- Tous les achats en euros sont **simulés et gratuits**. La mention « Version de test : achats simulés » reste dans la boutique.
- Ces achats simulés sont notés dans le journal de jeu, pour le tableau de bord. Ils n'ont aucune valeur.
- Les règles Firestore (`firebase/firestore.rules`) limitent déjà ce qu'un joueur peut écrire :
  - uniquement son propre document ;
  - uniquement les champs autorisés ;
  - des tailles plafonnées.
- La collection `purchases/{uid}` est **interdite en écriture à tous les joueurs**. Elle est réservée au futur serveur.

## Le jour où on vend pour de vrai
1. **Paiement par la plateforme uniquement** : StoreKit (Apple) et Google Play Billing, via Capacitor et RevenueCat par exemple. Jamais de paiement maison.
2. **Validation côté serveur** :
   - le jeu envoie le reçu d'achat à une Cloud Function Firebase ;
   - la fonction vérifie le reçu auprès d'Apple ou de Google (App Store Server API, Google Play Developer API) ;
   - elle écrit l'achat dans `purchases/{uid}/{idTransaction}` (produit, prix, devise, date, statut), avec l'Admin SDK, qui passe outre les règles.
   - L'identifiant de transaction sert de clé : un même reçu ne peut pas créditer deux fois.
3. **Les étoiles achetées ne viennent que du serveur** :
   - le solde d'étoiles achetées = la somme des achats validés dans `purchases`, moins les dépenses.
   - Le jeu lit ce solde, qu'il ne peut pas modifier.
   - Les étoiles gagnées en jouant restent dans la sauvegarde (une triche dessus ne coûte rien à personne).
4. **Notifications de la plateforme** : remboursements et annulations (App Store Server Notifications, Google Real-time Developer Notifications) arrivent sur une Cloud Function, qui retire l'achat.
5. **Restaurer les achats** : le bouton redemande à Apple ou Google la liste des achats du compte, puis le serveur la revalide. Les apparences des packs (non consommables) reviennent.
6. **Tableau de bord** : les euros dépensés viendront de `purchases` (validés par le serveur), et non plus du journal du jeu.
7. **App Check** (Firebase) : n'accepter que les requêtes venant de la vraie application.

## Limites honnêtes
- Les ressources ou les étoiles gagnées en jouant peuvent être trichées en modifiant la sauvegarde. Ce n'est grave que pour les classements entre joueurs. Si un classement public apparaît un jour, il faudra des contrôles côté serveur (vitesse de progression plausible, etc.).
- Le classement de la course ne lit plus la sauvegarde. L'heure d'un jalon est celle du serveur Firestore (`request.time`), au plus tôt un délai minimum après la première connexion suivie. Un temps choisi par le joueur est refusé par les règles. Les achats simulés de la version de test ne sont pas concernés.
