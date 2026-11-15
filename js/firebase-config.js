// Configuration Firebase du projet « village-du-pole » (console Firebase → Paramètres du projet → Vos applications → Web).
// Ces valeurs ne sont pas secrètes : elles identifient le projet et finissent de toute façon dans le code du jeu en ligne.
// La sécurité vient des règles Firestore (firebase/firestore.rules : chacun ne lit et n'écrit que son propre village)
// et des domaines autorisés dans Firebase Authentication.
// Si apiKey est vide ou mal formée, les comptes se désactivent d'eux-mêmes (le jeu reste jouable).
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB90v6IKHdNqxA7BqndGKUQ6S-3ddtDmug',
  authDomain: 'village-du-pole.firebaseapp.com',
  projectId: 'village-du-pole',
  storageBucket: 'village-du-pole.firebasestorage.app',
  messagingSenderId: '39606749640',
  appId: '1:39606749640:web:72aa7c6dc2e21d448ad8fd',
};
