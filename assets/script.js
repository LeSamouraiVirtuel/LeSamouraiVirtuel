/* Sabrille — interactions */
(function () {
  'use strict';

  // Current year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header shadow
  var header = document.querySelector('.site-header');
  var fab = document.querySelector('.fab');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (fab) fab.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal on scroll
  var revealables = document.querySelectorAll(
    '.service-card, .step, .price-card, .why-card, .testimonial, .section-head, .cta-copy, .quote-form'
  );
  if ('IntersectionObserver' in window) {
    revealables.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  // Contact form (client-side; opens a prefilled email)
  var form = document.getElementById('quote-form');
  var hint = document.getElementById('form-hint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setHint('Merci d’indiquer votre nom et un email valide.', 'err');
        return;
      }

      var subject = encodeURIComponent('Demande de devis — ' + (service || 'nettoyage'));
      var body = encodeURIComponent(
        'Nom : ' + name + '\n' +
        'Email : ' + email + '\n' +
        'Prestation : ' + (service || 'Non précisé') + '\n\n' +
        (message || '(pas de message)')
      );
      window.location.href = 'mailto:contact@sabrille.ch?subject=' + subject + '&body=' + body;
      setHint('Merci ! Votre logiciel de messagerie va s’ouvrir. À très vite ✨', 'ok');
      form.reset();
    });
  }

  function setHint(msg, kind) {
    if (!hint) return;
    hint.textContent = msg;
    hint.className = 'form-hint ' + (kind || '');
  }
})();
