// COMPTES : connexion Google, création de compte par e-mail, liaison des deux, sauvegarde du village dans le cloud.
// Service : Firebase (Authentication + Firestore). La configuration est dans js/firebase-config.js.
import {FIREBASE_CONFIG as CFG} from './firebase-config.js';
export const FIREBASE_CONFIG = CFG && /^AIza[\w-]{30,}$/.test(CFG.apiKey || '') ? CFG : null;

const V = '10.12.2', base = `https://www.gstatic.com/firebasejs/${V}/`;
let A = null, F = null, auth = null, db = null, user = null, listeners = [];
export let lastErr = null;
export const ready = () => !!FIREBASE_CONFIG;
export const current = () => user;
export const onChange = f => { listeners.push(f); f(user); };

export async function init(){
  if (!FIREBASE_CONFIG || auth) return !!auth;
  const [{initializeApp}, Au, Fs] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
  A = Au; F = Fs; const app = initializeApp(FIREBASE_CONFIG);
  auth = A.getAuth(app); db = F.getFirestore(app);
  await A.setPersistence(auth, A.browserLocalPersistence).catch(() => {});
  A.getRedirectResult(auth).catch(e => { lastErr = e; listeners.forEach(f => f(user)); });
  A.onAuthStateChanged(auth, u => { user = u; listeners.forEach(f => f(u)); });
  return true;
}
const standalone = () => navigator.standalone || matchMedia('(display-mode: standalone)').matches;
// Safari (Mac, iPhone, iPad — et tous les navigateurs d'iPhone, qui utilisent Safari) bloque les cookies de firebaseapp.com
// sur un site github.io : la connexion par REDIRECTION n'y marche pas. On y utilise uniquement la fenêtre (popup),
// ouverte tout de suite au clic (sinon Safari la bloque).
export const isApple = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || (/Safari\//.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg|OPR|Android|FxiOS/.test(navigator.userAgent));
/** Google dans l'app de l'écran d'accueil d'un iPhone : ni fenêtre ni redirection ne reviennent dans l'app. */
export const googleUnavailable = () => standalone() && isApple();
const google = () => { const p = new A.GoogleAuthProvider(); p.setCustomParameters({prompt: 'select_account'}); return p; };

export function signInGoogle(){
  if (!auth) return init().then(() => signInGoogle());
  if (googleUnavailable()) return Promise.reject(Object.assign(new Error('pwa'), {code: 'vdp/google-in-app'}));
  // aucune attente avant la fenêtre : elle doit s'ouvrir dans le même geste que le clic
  return A.signInWithPopup(auth, google()).catch(e => {
    if (!isApple() && /popup-blocked|operation-not-supported/.test(e.code || '')) return A.signInWithRedirect(auth, google());
    throw e;
  });
}
export async function signUpEmail(email, pass, name){ await init(); const r = await A.createUserWithEmailAndPassword(auth, email, pass); if (name) await A.updateProfile(r.user, {displayName: name}); await A.sendEmailVerification(r.user).catch(() => {}); return r; }
export async function signInEmail(email, pass){ await init(); return A.signInWithEmailAndPassword(auth, email, pass); }
export async function resetPassword(email){ await init(); return A.sendPasswordResetEmail(auth, email); }
export async function signOut(){ await init(); return A.signOut(auth); }
/** Relier Google à un compte e-mail (ou l'inverse) : on pourra se connecter avec l'un ou l'autre. */
export function linkGoogle(){ if (!auth || !user) return Promise.reject(new Error('Connecte-toi d’abord')); if (googleUnavailable()) return Promise.reject(Object.assign(new Error('pwa'), {code: 'vdp/google-in-app'})); return A.linkWithPopup(user, google()); }
export async function linkEmail(email, pass){ await init(); if (!user) throw new Error('Connecte-toi d’abord'); return A.linkWithCredential(user, A.EmailAuthProvider.credential(email, pass)); }
export const providers = () => (user?.providerData || []).map(p => p.providerId);

/* ---------- sauvegarde dans le cloud : un document par joueur, users/{uid} ---------- */
export async function cloudLoad(){ if (!user) return null; const d = await F.getDoc(F.doc(db, 'users', user.uid)); return d.exists() ? d.data() : null; }
// Document users/{uid} : uniquement les champs autorisés par firebase/firestore.rules (taille plafonnée).
export async function cloudSave(state, extra = {}){
  if (!user) return false;
  const data = {save: JSON.stringify(state), fmt: state.fmt || 5, lvl: Math.max(1, Math.round(state.lvl || 1)), t: Date.now(), name: (user.displayName || state.name || '').slice(0, 40), ...extra};
  await F.setDoc(F.doc(db, 'users', user.uid), data); return true;
}
/** Supprimer son compte : le village en ligne d'abord, puis le compte. Firebase exige parfois une connexion récente. */
export async function deleteAccount(password){
  await init(); if (!user) throw new Error('Connecte-toi d’abord');
  const u = user, pv = providers();
  try { await u.getIdToken(true); } catch(e){}
  const reauth = async () => {
    if (pv.includes('password') && password) await A.reauthenticateWithCredential(u, A.EmailAuthProvider.credential(u.email, password));
    else if (pv.includes('google.com')) await A.reauthenticateWithPopup(u, google());
    else throw Object.assign(new Error('reconnexion'), {code: 'auth/requires-recent-login'});
  };
  if (password) await reauth();
  await F.deleteDoc(F.doc(db, 'users', u.uid));
  try { await A.deleteUser(u); }
  catch(e){ if (e.code !== 'auth/requires-recent-login') throw e; await reauth(); await A.deleteUser(u); }
  return true;
}
export function friendlyError(e){
  const c = e?.code || '';
  return {'auth/invalid-email': 'Adresse e-mail invalide.', 'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail : connecte-toi.', 'auth/weak-password': 'Mot de passe trop court (6 caractères minimum).',
    'auth/invalid-credential': 'E-mail ou mot de passe incorrect.', 'auth/wrong-password': 'Mot de passe incorrect.', 'auth/user-not-found': 'Aucun compte avec cet e-mail.', 'auth/too-many-requests': 'Trop d’essais : réessaie dans quelques minutes.',
    'auth/credential-already-in-use': 'Ce compte Google est déjà relié à un autre joueur.', 'auth/provider-already-linked': 'C’est déjà relié.', 'auth/network-request-failed': 'Pas de connexion internet.',
    'auth/popup-closed-by-user': 'Fenêtre fermée avant la fin.', 'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'Comptes pas encore configurés (clé du projet manquante).', 'auth/operation-not-allowed': 'Ce mode de connexion n’est pas activé dans Firebase.', 'auth/popup-blocked': 'La fenêtre Google a été bloquée : autorise les fenêtres (pop-up) pour ce site, puis réessaie.', 'vdp/google-in-app': 'Dans l’app de l’écran d’accueil, la connexion Google n’est pas possible sur iPhone : crée ton compte avec ton e-mail ici. Tu pourras relier Google plus tard depuis Safari.', 'auth/cancelled-popup-request': 'Une autre fenêtre de connexion est déjà ouverte.', 'auth/internal-error': 'Erreur de connexion à Google : réessaie, ou utilise ton e-mail.', 'auth/web-storage-unsupported': 'Ton navigateur bloque le stockage (navigation privée ?) : ouvre le jeu dans une fenêtre normale.', 'auth/missing-password': 'Entre un mot de passe.', 'auth/missing-email': 'Entre ton e-mail.', 'auth/requires-recent-login': 'Par sécurité, entre ton mot de passe (ou reconnecte-toi avec Google) pour confirmer.', 'permission-denied': 'Sauvegarde refusée par le serveur.', 'auth/unauthorized-domain': 'Domaine non autorisé dans Firebase (Authentication → Paramètres → Domaines autorisés).'}[c] || (e?.message || 'Erreur inconnue');
}
