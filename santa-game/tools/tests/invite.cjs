// Pour les tests : à la fenêtre « Conditions et confidentialité », on choisit une année adulte, on refuse l'analyse et on accepte ;
// puis à l'écran d'accueil, on clique vraiment sur « Jouer en invité ».
module.exports = () => { new MutationObserver(() => {
  const L = document.querySelector('#legal'); if (L && !L.dataset.auto){ L.dataset.auto = 1; const y = L.querySelector('#lyear'); y.value = '1990'; y.dispatchEvent(new Event('change')); L.querySelector('[data-l=non]').click(); L.querySelector('[data-l=go]').click(); }
  const b = document.querySelector('#welcome [data-w=guest]'); if (b) b.click(); }).observe(document, {childList: true, subtree: true}); };
