// SUIVI DES JOUEURS — silencieux, jamais affiché dans le jeu. Lisible uniquement par l'éditeur (tableau de bord protégé
// par les règles Firestore). Seulement pour les joueurs avec un compte. Ce qui est enregistré est décrit dans privacy.html.
//   track/{uid}          : fiche du joueur (identité du compte, appareil, dernière connexion, totaux, course)
//   track/{uid}/s/{sid}  : une session (début, fin, durée, temps de jeu, appareil, IP et ville approximative, provenance, actions)
//   track/{uid}/secu/{id}: journal de sécurité (IP + heure de connexion), NÉCESSAIRE, gardé 6 mois
// Deux niveaux (choisis dans la fenêtre « Conditions et confidentialité ») :
//   Nécessaire : compte, sauvegarde, achats, journal de sécurité — toujours.
//   Analyse    : appareil détaillé, IP + ville par session, provenance, écrans, actions, temps de jeu, chrono — seulement avec l'accord.
import * as ACC from './account.js';

const day = t => new Date(t).toLocaleDateString('sv-SE'); // AAAA-MM-JJ, heure locale du joueur
const rnd = () => Math.random().toString(36).slice(2, 8);
const ls = {get: k => { try { return localStorage.getItem(k); } catch(e){ return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch(e){} }};

// provenance : la première adresse d'arrivée sur le jeu (lien partagé, réseau social…), gardée même avant le compte
const REF = (() => { let r = null; try { r = JSON.parse(ls.get('vdp-ref') || 'null'); } catch(e){}
  if (!r){ r = {ref: (document.referrer || '').slice(0, 300), q: location.search.slice(0, 200), t: Date.now()}; ls.set('vdp-ref', JSON.stringify(r)); }
  return r; })();
const here = () => ({ref: (document.referrer || '').slice(0, 300), q: location.search.slice(0, 200)});

/** L'appareil, tel que le navigateur le décrit (aucune empreinte cachée) */
export function device(){
  const ua = navigator.userAgent, n = {};
  let m;
  if ((m = ua.match(/iPhone OS (\d+[_\d]*)/)) ) { n.os = 'iOS'; n.osv = m[1].replace(/_/g, '.'); n.model = 'iPhone'; }
  else if ((m = ua.match(/iPad.*OS (\d+[_\d]*)/))) { n.os = 'iPadOS'; n.osv = m[1].replace(/_/g, '.'); n.model = 'iPad'; }
  else if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1){ n.os = 'iPadOS'; n.model = 'iPad'; m = ua.match(/Version\/([\d.]+)/); n.osv = m ? m[1] : ''; }
  else if ((m = ua.match(/Android ([\d.]+)/))){ n.os = 'Android'; n.osv = m[1]; const md = ua.match(/Android [\d.]+; ([^;)]+)/); if (md && !/^K$|wv/.test(md[1])) n.model = md[1].trim(); }
  else if ((m = ua.match(/Mac OS X (\d+[_\d]*)/))){ n.os = 'macOS'; n.osv = m[1].replace(/_/g, '.'); n.model = 'Mac'; }
  else if ((m = ua.match(/Windows NT ([\d.]+)/))){ n.os = 'Windows'; n.osv = {'10.0': '10/11', '6.3': '8.1', '6.1': '7'}[m[1]] || m[1]; n.model = 'PC'; }
  else if (/CrOS/.test(ua)) n.os = 'ChromeOS'; else if (/Linux/.test(ua)) n.os = 'Linux'; else n.os = '?';
  if ((m = ua.match(/Edg\/([\d.]+)/))) n.br = 'Edge ' + m[1].split('.')[0];
  else if ((m = ua.match(/SamsungBrowser\/([\d.]+)/))) n.br = 'Samsung ' + m[1].split('.')[0];
  else if ((m = ua.match(/(?:OPR|Opera)\/([\d.]+)/))) n.br = 'Opera ' + m[1].split('.')[0];
  else if ((m = ua.match(/(?:Firefox|FxiOS)\/([\d.]+)/))) n.br = 'Firefox ' + m[1].split('.')[0];
  else if ((m = ua.match(/(?:Chrome|CriOS)\/([\d.]+)/))) n.br = 'Chrome ' + m[1].split('.')[0];
  else if ((m = ua.match(/Version\/([\d.]+).*Safari/))) n.br = 'Safari ' + m[1];
  else n.br = '?';
  if (/FBAN|FBAV|Instagram|Snapchat|TikTok|Line\//.test(ua)) n.br += ' (dans une appli)';
  n.sw = screen.width; n.sh = screen.height; n.dpr = devicePixelRatio || 1; n.vw = innerWidth; n.vh = innerHeight;
  n.lang = navigator.language || ''; n.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  n.pwa = !!(navigator.standalone || matchMedia('(display-mode: standalone)').matches);
  n.touch = (navigator.maxTouchPoints || 0) > 0;
  if (n.model === 'iPhone') n.model = iphone(n.sw, n.sh, n.dpr);
  return n;
}
// Safari ne donne pas le modèle exact : on le déduit de la taille d'écran (famille d'iPhone)
function iphone(w, h, d){ const k = `${Math.min(w, h)}x${Math.max(w, h)}@${d}`;
  return {'320x568@2': 'iPhone SE (1re gén.)', '375x667@2': 'iPhone SE / 6-8', '414x736@3': 'iPhone 6-8 Plus', '375x812@3': 'iPhone X / XS / 11 Pro / 12-13 mini',
    '414x896@2': 'iPhone XR / 11', '414x896@3': 'iPhone XS Max / 11 Pro Max', '390x844@3': 'iPhone 12-14', '428x926@3': 'iPhone 12-14 Plus / Pro Max',
    '393x852@3': 'iPhone 14 Pro / 15 / 16', '430x932@3': 'iPhone 14 Pro Max / 15-16 Plus / Pro Max', '402x874@3': 'iPhone 16 Pro', '440x956@3': 'iPhone 16 Pro Max'}[k] || 'iPhone';
}
// modèle précis sur Android (Chrome le donne si on le demande)
async function hiModel(d){ try { const h = await navigator.userAgentData?.getHighEntropyValues?.(['model', 'platformVersion']); if (h?.model) d.model = h.model; if (h?.platformVersion && d.os === 'Windows') d.osv = +h.platformVersion.split('.')[0] >= 13 ? '11' : '10'; } catch(e){} return d; }

/** IP et ville approximative : service gratuit sans clé (GeoJS), avec un second service en secours */
async function geo(){
  const get = (u, ms = 5000) => Promise.race([fetch(u, {cache: 'no-store'}).then(r => r.ok ? r.json() : null), new Promise(r => setTimeout(() => r(null), ms))]).catch(() => null);
  let g = await get('https://get.geojs.io/v1/ip/geo.json');
  if (g?.ip) return {ip: g.ip, pays: g.country || '', cc: g.country_code || '', region: g.region || '', ville: g.city || '', fai: (g.organization_name || '').slice(0, 80), src: 'geojs'};
  g = await get('https://ipapi.co/json/');
  if (g?.ip) return {ip: g.ip, pays: g.country_name || '', cc: g.country_code || '', region: g.region || '', ville: g.city || '', fai: (g.org || '').slice(0, 80), src: 'ipapi'};
  return null;
}

let on = false, uid = null, sid = null, part = 0, nEv = 0, buf = [], t0 = 0, visFrom = 0, playAcc = 0, dev = null, ctx = null, lastHide = 0, timer = 0, busy = false;
const db = () => ACC.fs();
let src = () => false;                                   // accord pour l'analyse, fourni par le jeu (choix du joueur)
export const setConsentSource = f => { src = f; };
export const consent = () => src() ? 'yes' : 'no';
export const active = () => on;
const MOIS = 30.44 * 864e5;

/** À chaque connexion. need = données nécessaires {village, creeLe, niveau, maison, eur, achats, inviteAvant, legal} ;
 *  getInfo() = données d'analyse rafraîchies à chaque envoi. */
export async function begin(user, need, getInfo){
  const D = db(); if (!D || !user) return; const {F, db: base} = D;
  if (uid === user.uid && (on || starting)) return;            // déjà suivi (événement de connexion en double)
  if (uid && uid !== user.uid) stop();
  uid = user.uid; ctx = getInfo;
  const pv = (user.providerData || []).map(p => p.providerId);
  const id = {email: user.email || '', nom: user.displayName || '', photo: user.photoURL || '', fournisseur: pv.includes('google.com') ? (pv.includes('password') ? 'Google + e-mail' : 'Google') : 'e-mail',
    compteCree: Date.parse(user.metadata?.creationTime || '') || null, derniere: F.serverTimestamp(), analyse: !!src()};
  try {
    const prev = await F.getDoc(F.doc(base, 'track', uid));
    // « vu » : première fois que le serveur voit ce joueur. L'horloge officielle de la course part de là, et ne bouge plus.
    if (!prev.exists() || !prev.data()?.vu) id.vu = F.serverTimestamp();
    await F.setDoc(F.doc(base, 'track', uid), {...id, ...need}, {merge: true});
  } catch(e){ return; }
  securite();
  if (src()){ F.setDoc(F.doc(base, 'track', uid), {provenance: REF}, {merge: true}).catch(() => {}); startSession(); purgeOld(); }
}
// journal de sécurité (nécessaire) : IP et heure de chaque connexion, effacé après 6 mois
async function securite(){
  const D = db(); if (!D || !uid) return; const {F, db: base} = D, t = Date.now();
  let ip = ''; try { ip = (await Promise.race([fetch('https://get.geojs.io/v1/ip.json', {cache: 'no-store'}).then(r => r.json()), new Promise(r => setTimeout(() => r({}), 5000))])).ip || ''; } catch(e){}
  F.setDoc(F.doc(base, 'track', uid, 'secu', String(t)), {t, ip}).catch(() => {});
  try { const old = await F.getDocs(F.query(F.collection(base, 'track', uid, 'secu'), F.where('t', '<', t - 6 * MOIS))); old.docs.forEach(d => F.deleteDoc(d.ref).catch(() => {})); } catch(e){}
}
// analyse détaillée : les sessions de plus de 13 mois sont effacées (les totaux de la fiche restent, agrégés)
async function purgeOld(){
  const D = db(); if (!D || !uid) return; const {F, db: base} = D;
  try { const old = await F.getDocs(F.query(F.collection(base, 'track', uid, 's'), F.where('debut', '<', Date.now() - 13 * MOIS))); old.docs.forEach(d => F.deleteDoc(d.ref).catch(() => {})); } catch(e){}
}
/** Le joueur change d'avis (réglages ou nouvelle fenêtre d'accord). En cas de refus, l'analyse déjà enregistrée est effacée. */
export async function setConsent(v){
  const D = db(); if (!D || !uid) return; const {F, db: base} = D;
  if (v === 'yes'){ F.setDoc(F.doc(base, 'track', uid), {analyse: true}, {merge: true}).catch(() => {}); if (!on){ F.setDoc(F.doc(base, 'track', uid), {provenance: REF}, {merge: true}).catch(() => {}); startSession(); } return; }
  on = false; sid = null; buf = []; clearInterval(timer);   // pas d'envoi final : la fiche de suivi part en entier
  try {
    const ss = await F.getDocs(F.collection(base, 'track', uid, 's')); ss.docs.forEach(d => F.deleteDoc(d.ref).catch(() => {}));
    const sec = await F.getDocs(F.collection(base, 'track', uid, 'secu')); sec.docs.forEach(d => F.deleteDoc(d.ref).catch(() => {}));
    await F.deleteDoc(F.doc(base, 'track', uid));
  } catch(e){}
}
/** Trace de l'accord légal (date, version des textes, choix), gardée dans le compte avec l'historique */
export function legalProof(rec){ const D = db(); if (!D || !uid) return; D.F.setDoc(D.F.doc(D.db, 'track', uid), {legal: rec, legalHist: D.F.arrayUnion(rec)}, {merge: true}).catch(() => {}); }
export function stop(){ if (on) flush(true); on = false; sid = null; clearInterval(timer); }

let starting = false;
async function startSession(){
  const D = db(); if (!D || !uid || on || starting) return; const {F, db: base} = D;
  starting = true; on = true; part = 0; nEv = 0; buf = []; t0 = Date.now(); playAcc = 0; visFrom = document.hidden ? 0 : t0;
  sid = new Date(t0).toISOString().slice(0, 19).replace(/[-:T]/g, '') + '-' + rnd();
  dev = device(); hiModel(dev);
  const s = {debut: t0, fin: t0, duree: 0, jeu: 0, appareil: dev, arrivee: here(), ev: [], niv: ctx?.()?.lvl || 0};
  try {
    await F.setDoc(F.doc(base, 'track', uid, 's', sid), s);
    await F.setDoc(F.doc(base, 'track', uid), {appareil: dev, sessions: F.increment(1), jours: {[day(t0)]: F.increment(1)}, derniere: F.serverTimestamp()}, {merge: true});
  } catch(e){ on = false; starting = false; return; }
  starting = false;
  geo().then(g => { if (!g || !on) return; F.updateDoc(F.doc(base, 'track', uid, 's', sid), {geo: g}).catch(() => {});
    F.setDoc(F.doc(base, 'track', uid), {geo: g, ips: F.arrayUnion(g.ip)}, {merge: true}).catch(() => {}); });
  clearInterval(timer); timer = setInterval(() => flush(), 60e3);
}
/** Une action du joueur : écran ouvert, achat, dépense d'étoiles, niveau, mini-jeu, pêche… */
export function ev(k, d = {}){ if (!on) return; buf.push({...d, t: Date.now(), k}); if (buf.length >= 50) flush(); }

function playNow(){ const t = Date.now(); if (visFrom){ playAcc += t - visFrom; visFrom = t; } const p = Math.round(playAcc / 1000); playAcc -= p * 1000; return p; }
async function flush(final){
  const D = db(); if (!on || !sid || !D || (busy && !final)) return; const {F, db: base} = D; busy = true;
  const evs = buf.splice(0), t = Date.now(), jeu = playNow(), info = ctx?.() || {};
  try {
    if (nEv + evs.length > 900){ part++; nEv = 0; const nid = sid.replace(/_\d+$/, '') + '_' + part; await F.setDoc(F.doc(base, 'track', uid, 's', nid), {debut: t, fin: t, duree: 0, jeu: 0, suite: sid, appareil: dev, ev: []}); sid = nid; }
    const up = {fin: t, duree: Math.round((t - t0) / 1000), jeu: F.increment(jeu), niv: info.lvl || 0};
    if (evs.length) up.ev = F.arrayUnion(...evs);
    await F.updateDoc(F.doc(base, 'track', uid, 's', sid), up); nEv += evs.length;
    await F.setDoc(F.doc(base, 'track', uid), {...info, derniere: F.serverTimestamp(), tempsJeu: F.increment(jeu)}, {merge: true});
  } catch(e){ buf.unshift(...evs); }
  busy = false;
}
// Jalons officiels de la course. L'heure écrite est celle du serveur (request.time), jamais celle du téléphone.
// Un jalon déjà enregistré ne se réécrit pas. S'il est trop tôt (règles Firestore), on réessaie tant que la partie est ouverte.
// Seulement les jalons que les règles Firestore vérifient (le langage des règles plafonne le nombre de contrôles).
const RACE_KEY = /^(niv(5|10|20|100)|maison(10|20|25)|sommet)$/;
const pendingRace = new Map(); let raceBusy = false;
function raceBody(data){
  const n = (v, max) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));
  return {eur: Math.max(0, Math.min(1000000, Math.round((Number(data.eur) || 0) * 100) / 100)), achats: n(data.achats, 100000), niv: Math.max(1, Math.min(150, n(data.niv, 150) || 1)), jeu: n(data.jeu, 200000000)};
}
async function sendRace(){
  const D = db(); if (!D || !uid || !src() || raceBusy || !pendingRace.size) return; const {F, db: base} = D;
  raceBusy = true;
  try {
    const ref = F.doc(base, 'track', uid), snap = await F.getDoc(ref), course = snap.exists() ? snap.data()?.course || {} : {};
    for (const [key, data] of [...pendingRace]){
      const prev = course[key];
      if (prev && prev.t != null && typeof prev.t !== 'number'){ pendingRace.delete(key); continue; }   // déjà une heure serveur
      if (prev && typeof prev.t === 'number'){ pendingRace.delete(key); continue; }                     // ancien jalon (heure du téléphone) : on ne le réécrit pas
      try { await F.setDoc(ref, {course: {[key]: {t: F.serverTimestamp(), ...raceBody(data)}}}, {merge: true}); pendingRace.delete(key); }
      catch(e){}   // trop tôt, ou pas encore « vu » : on réessaiera
    }
  } catch(e){}
  raceBusy = false;
}
/** Jalon de la course (créé → sommet). L'heure officielle est celle du serveur au moment où il accepte le jalon. */
export function milestone(key, data = {}){ if (!RACE_KEY.test(key) || !uid || !src()) return; pendingRace.set(key, data); sendRace(); }
setInterval(() => sendRace(), 60e3);

// fin de session quand le jeu est caché plus de 10 minutes ; nouvelle session au retour
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ playNow(); visFrom = 0; lastHide = Date.now(); if (on) flush(true); }
  else { if (on && lastHide && Date.now() - lastHide > 10 * 60e3){ stop(); if (src()) startSession(); } else visFrom = Date.now(); }
});
addEventListener('pagehide', () => { if (on) flush(true); });
