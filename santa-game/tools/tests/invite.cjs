// Pour les tests : quand l'écran d'accueil apparaît, on clique vraiment sur « Jouer en invité ».
module.exports = () => { new MutationObserver(() => { const b = document.querySelector('#welcome [data-w=guest]'); if (b) b.click(); }).observe(document.documentElement, {childList: true, subtree: true}); };
