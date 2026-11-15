// INFORMATIONS LÉGALES — à changer ICI SEULEMENT (les pages cgu.html, privacy.html, mentions.html et le jeu les lisent).
// Avant tout paiement réel : nom complet et adresse postale de l'éditeur obligatoires (LCEN en France, LCD en Suisse) — voir README.
export const LEGAL = {
  editeur: 'Le Village du Pôle — projet personnel de l’équipe LeSamouraiVirtuel',
  statut: 'éditeur particulier, non professionnel (aucune activité commerciale : les achats sont simulés)',
  adresse: '',                                   // adresse postale : à remplir avant tout paiement réel
  contact: 'better.ask.yannis@gmail.com',        // contact, assistance et exercice des droits
  directeur: 'l’équipe LeSamouraiVirtuel',        // responsable de la publication
  hebergeurs: [
    'GitHub Pages — GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis (site du jeu)',
    'Firebase / Google Cloud — Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande (comptes et sauvegardes, données stockées dans l’Union européenne, région eur3 : Belgique et Pays-Bas)',
  ],
  droit: 'droit français ; pour les joueurs résidant en Suisse, la loi fédérale sur la protection des données (nLPD) s’applique aussi',
};
// Version des textes : la changer quand les conditions ou la confidentialité changent → l'accord est redemandé à tous.
export const LEGAL_V = '2026-11-15';
// Durées de conservation (affichées dans la page Confidentialité et appliquées par le jeu)
export const KEEP = {securiteMois: 6, analyseMois: 13, inactifAns: 2};
// Âge minimum pour accepter seul l'analyse et les achats (consentement numérique, RGPD art. 8 selon les pays)
const AGE = {FR: 15, BE: 13, DK: 13, EE: 13, FI: 13, LV: 13, MT: 13, PT: 13, SE: 13, AT: 14, BG: 14, CY: 14, ES: 14, IT: 14, LT: 14, CZ: 15, GR: 15, SI: 15, DE: 16, NL: 16, IE: 16, LU: 16, PL: 16, RO: 16, SK: 16, HR: 16, HU: 16, CH: 16, GB: 13, US: 13, CA: 13};
export function ageMin(){
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || ''), lang = navigator.language || '';
  const byTz = {'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Zurich': 'CH', 'Europe/Berlin': 'DE', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Luxembourg': 'LU', 'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Lisbon': 'PT', 'Europe/Vienna': 'AT', 'America/Montreal': 'CA', 'America/Toronto': 'CA'}[tz];
  const c = byTz || (lang.split('-')[1] || '').toUpperCase();
  return AGE[c] || 16;
}
