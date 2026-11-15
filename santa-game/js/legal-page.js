// Remplit les pages légales avec les valeurs de js/legal.js (un seul endroit à changer).
import {LEGAL, LEGAL_V, KEEP} from './legal.js';
const v = {...LEGAL, version: new Date(LEGAL_V).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}), securite: KEEP.securiteMois, analyse: KEEP.analyseMois, inactif: KEEP.inactifAns,
  adresse: LEGAL.adresse || 'pas d’adresse postale publiée (éditeur particulier sans activité commerciale) : contact par e-mail'};
document.querySelectorAll('[data-l]').forEach(el => { const k = el.dataset.l;
  if (k === 'contact') el.innerHTML = `<a href="mailto:${LEGAL.contact}">${LEGAL.contact}</a>`;
  else if (k === 'hebergeurs') el.innerHTML = LEGAL.hebergeurs.map(h => `<li>${h}</li>`).join('');
  else el.textContent = v[k] ?? ''; });
