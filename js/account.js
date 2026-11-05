// COMPTES : connexion Google, création de compte par e-mail, liaison des deux, sauvegarde du village dans le cloud.
// Service : Firebase (Authentication + Firestore). Rien ne marche tant que FIREBASE_CONFIG est vide :
// on colle ici le bloc « firebaseConfig » de la console Firebase (il est public par nature, ce n'est pas un secret).
export const FIREBASE_CONFIG = null;   // ← { apiKey: '…', authDomain: '…', projectId: '…', appId: '…' }

const V = '10.12.2', base = `https://www.gstatic.com/firebasejs/${V}/`;
let A = null, F = null, auth = null, db = null, user = null, listeners = [];
export const ready = () => !!FIREBASE_CONFIG;
export const current = () => user;
export const onChange = f => { listeners.push(f); f(user); };

export async function init(){
  if (!FIREBASE_CONFIG || auth) return !!auth;
  const [{initializeApp}, Au, Fs] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
  A = Au; F = Fs; const app = initializeApp(FIREBASE_CONFIG);
  auth = A.getAuth(app); db = F.getFirestore(app);
  await A.setPersistence(auth, A.browserLocalPersistence).catch(() => {});
  A.getRedirectResult(auth).catch(() => {});
  A.onAuthStateChanged(auth, u => { user = u; listeners.forEach(f => f(u)); });
  return true;
}
const standalone = () => navigator.standalone || matchMedia('(display-mode: standalone)').matches;
const google = () => { const p = new A.GoogleAuthProvider(); p.setCustomParameters({prompt: 'select_account'}); return p; };

export async function signInGoogle(){
  await init();
  // sur iPhone, l'app de l'écran d'accueil bloque les fenêtres : on passe par une redirection
  if (standalone()) return A.signInWithRedirect(auth, google());
  try { return await A.signInWithPopup(auth, google()); }
  catch(e){ if (/popup/.test(e.code || '')) return A.signInWithRedirect(auth, google()); throw e; }
}
export async function signUpEmail(email, pass, name){ await init(); const r = await A.createUserWithEmailAndPassword(auth, email, pass); if (name) await A.updateProfile(r.user, {displayName: name}); await A.sendEmailVerification(r.user).catch(() => {}); return r; }
export async function signInEmail(email, pass){ await init(); return A.signInWithEmailAndPassword(auth, email, pass); }
export async function resetPassword(email){ await init(); return A.sendPasswordResetEmail(auth, email); }
export async function signOut(){ await init(); return A.signOut(auth); }
/** Relier Google à un compte e-mail (ou l'inverse) : on pourra se connecter avec l'un ou l'autre. */
export async function linkGoogle(){ await init(); if (!user) throw new Error('Connecte-toi d’abord'); return standalone() ? A.linkWithRedirect(user, google()) : A.linkWithPopup(user, google()); }
export async function linkEmail(email, pass){ await init(); if (!user) throw new Error('Connecte-toi d’abord'); return A.linkWithCredential(user, A.EmailAuthProvider.credential(email, pass)); }
export const providers = () => (user?.providerData || []).map(p => p.providerId);

/* ---------- sauvegarde dans le cloud : un document par joueur, users/{uid} ---------- */
export async function cloudLoad(){ if (!user) return null; const d = await F.getDoc(F.doc(db, 'users', user.uid)); return d.exists() ? d.data() : null; }
export async function cloudSave(state){
  if (!user) return false;
  const data = {save: JSON.stringify(state), lvl: state.lvl || 1, t: Date.now(), name: user.displayName || ''};
  await F.setDoc(F.doc(db, 'users', user.uid), data); return true;
}
export function friendlyError(e){
  const c = e?.code || '';
  return {'auth/invalid-email': 'Adresse e-mail invalide.', 'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail : connecte-toi.', 'auth/weak-password': 'Mot de passe trop court (6 caractères minimum).',
    'auth/invalid-credential': 'E-mail ou mot de passe incorrect.', 'auth/wrong-password': 'Mot de passe incorrect.', 'auth/user-not-found': 'Aucun compte avec cet e-mail.', 'auth/too-many-requests': 'Trop d’essais : réessaie dans quelques minutes.',
    'auth/credential-already-in-use': 'Ce compte Google est déjà relié à un autre joueur.', 'auth/provider-already-linked': 'C’est déjà relié.', 'auth/network-request-failed': 'Pas de connexion internet.',
    'auth/popup-closed-by-user': 'Fenêtre fermée avant la fin.', 'auth/unauthorized-domain': 'Domaine non autorisé dans Firebase (Authentication → Paramètres → Domaines autorisés).'}[c] || (e?.message || 'Erreur inconnue');
}
