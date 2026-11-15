// Pour les tests : remplit la fenêtre « Conditions et confidentialité » (adulte, analyse au choix) sans toucher à l'écran d'accueil.
module.exports = analyse => { new MutationObserver(() => {
  const L = document.querySelector('#legal'); if (L && !L.dataset.auto){ L.dataset.auto = 1; const y = L.querySelector('#lyear'); y.value = '1990'; y.dispatchEvent(new Event('change')); L.querySelector(`[data-l=${analyse ? 'oui' : 'non'}]`).click(); L.querySelector('[data-l=go]').click(); }
}).observe(document, {childList: true, subtree: true}); };
