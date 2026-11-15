// SUIVI DES JOUEURS — silencieux, jamais affiché dans le jeu. Lisible uniquement par l'éditeur (tableau de bord protégé
// par les règles Firestore). Seulement pour les joueurs avec un compte. Ce qui est enregistré est décrit dans privacy.html.
//   track/{uid}          : fiche du joueur (identité du compte, appareil, dernière connexion, totaux, course)
//   track/{uid}/s/{sid}  : une session (début, fin, durée, temps de jeu, appareil, IP et ville approximative, provenance, actions)
// Le détail (appareil, IP, ville, actions) n'est enregistré qu'avec l'accord du joueur (consent === 'yes').
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
const consentKey = u => 'vdp-consent-' + u;
export const consent = () => uid ? ls.get(consentKey(uid)) : null;           // 'yes' | 'no' | null (pas encore demandé)
export const active = () => on;

/** Fiche du joueur : appelé à chaque connexion. info = {village, created, lvl, hq, eur, nbuy, wasGuest} */
export async function begin(user, info, getInfo){
  const D = db(); if (!D || !user) return; const {F, db: base} = D;
  uid = user.uid; ctx = getInfo;
  const pv = (user.providerData || []).map(p => p.providerId);
  const id = {email: user.email || '', nom: user.displayName || '', photo: user.photoURL || '', fournisseur: pv.includes('google.com') ? (pv.includes('password') ? 'Google + e-mail' : 'Google') : 'e-mail',
    compteCree: Date.parse(user.metadata?.creationTime || '') || null, derniere: Date.now(), consent: consent() || 'non demandé', provenance: REF};
  try { await F.setDoc(F.doc(base, 'track', uid), {...id, ...info}, {merge: true}); } catch(e){ return; }
  if (consent() === 'yes') startSession();
}
/** Accord du joueur (une seule fois, modifiable dans les réglages) */
export function setConsent(v){ if (!uid) return; ls.set(consentKey(uid), v); const D = db(); if (D) D.F.setDoc(D.F.doc(D.db, 'track', uid), {consent: v, consentT: Date.now()}, {merge: true}).catch(() => {});
  if (v === 'yes' && !on) startSession(); if (v === 'no' && on) stop(); }
export function stop(){ if (on) flush(true); on = false; sid = null; clearInterval(timer); }

async function startSession(){
  const D = db(); if (!D || !uid) return; const {F, db: base} = D;
  on = true; part = 0; nEv = 0; buf = []; t0 = Date.now(); playAcc = 0; visFrom = document.hidden ? 0 : t0;
  sid = new Date(t0).toISOString().slice(0, 19).replace(/[-:T]/g, '') + '-' + rnd();
  dev = device(); hiModel(dev);
  const s = {debut: t0, fin: t0, duree: 0, jeu: 0, appareil: dev, arrivee: here(), ev: [], niv: ctx?.()?.lvl || 0};
  try {
    await F.setDoc(F.doc(base, 'track', uid, 's', sid), s);
    await F.setDoc(F.doc(base, 'track', uid), {appareil: dev, sessions: F.increment(1), jours: {[day(t0)]: F.increment(1)}, derniere: t0}, {merge: true});
  } catch(e){ on = false; return; }
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
    await F.setDoc(F.doc(base, 'track', uid), {...info, derniere: t, tempsJeu: F.increment(jeu)}, {merge: true});
  } catch(e){ buf.unshift(...evs); }
  busy = false;
}
/** Jalon de la course (créé → sommet) : moment, euros affichés dépensés et nombre d'achats à cet instant */
export function milestone(key, data){ const D = db(); if (!D || !uid) return; D.F.setDoc(D.F.doc(D.db, 'track', uid), {course: {[key]: {t: Date.now(), ...data}}}, {merge: true}).catch(() => {}); }

// fin de session quand le jeu est caché plus de 10 minutes ; nouvelle session au retour
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ playNow(); visFrom = 0; lastHide = Date.now(); if (on) flush(true); }
  else { if (on && lastHide && Date.now() - lastHide > 10 * 60e3){ stop(); if (consent() === 'yes') startSession(); } else visFrom = Date.now(); }
});
addEventListener('pagehide', () => { if (on) flush(true); });
