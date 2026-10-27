// ==========================================================
// COLEGIO CRISTIANO SHAMMAH — Interacciones del sitio
// Cada bloque va en su propio try/catch para que un fallo en
// una parte nunca impida que el resto del sitio funcione.
// ==========================================================

function forEachEl(nodeList, fn) {
  for (var i = 0; i < nodeList.length; i++) { fn(nodeList[i], i); }
}

document.addEventListener('DOMContentLoaded', function () {

  // ---- Menú lateral (sidebar) responsive ----
  try {
    var hamburger = document.querySelector('.sidebar-hamburger');
    var sidebar = document.querySelector('.sidebar');
    var scrim = document.querySelector('.sidebar-scrim');

    var openSidebar = function () {
      if (sidebar) sidebar.classList.add('is-open');
      if (scrim) scrim.classList.add('is-open');
    };
    var closeSidebar = function () {
      if (sidebar) sidebar.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
    };
    if (hamburger && sidebar) {
      hamburger.addEventListener('click', function () {
        if (sidebar.classList.contains('is-open')) { closeSidebar(); }
        else { openSidebar(); }
      });
    }
    if (scrim) { scrim.addEventListener('click', closeSidebar); }
    if (sidebar) {
      forEachEl(sidebar.querySelectorAll('a'), function (a) {
        a.addEventListener('click', closeSidebar);
      });
    }
  } catch (err) { /* el menú no debe romper el resto del sitio */ }

  // ---- Carrusel de fotos ----
  try {
    forEachEl(document.querySelectorAll('.carousel'), function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      var slides = carousel.querySelectorAll('.carousel-slide');
      var prevBtn = carousel.querySelector('.carousel-btn.prev');
      var nextBtn = carousel.querySelector('.carousel-btn.next');
      var dotsWrap = carousel.querySelector('.carousel-dots');
      if (!track || !slides.length) { return; }

      var index = 0;
      var total = slides.length;
      var dots = [];

      if (dotsWrap) {
        for (var d = 0; d < total; d++) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Ir a la foto ' + (d + 1));
          (function (dIndex) {
            dot.addEventListener('click', function () { goTo(dIndex); });
          })(d);
          dotsWrap.appendChild(dot);
          dots.push(dot);
        }
      }

      function render() {
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        forEachEl(dots, function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
      function goTo(i) {
        index = (i + total) % total;
        render();
      }
      function next() { goTo(index + 1); }
      function prev() { goTo(index - 1); }

      if (nextBtn) { nextBtn.addEventListener('click', next); }
      if (prevBtn) { prevBtn.addEventListener('click', prev); }

      render();

      // Autoplay suave, se detiene si el usuario interactúa
      var autoplay = window.setInterval(next, 6000);
      carousel.addEventListener('mouseenter', function () { window.clearInterval(autoplay); });
    });
  } catch (err) { /* no crítico */ }

  // ---- Revelado suave al hacer scroll (con salvaguarda) ----
  try {
    var reveals = document.querySelectorAll('.reveal');
    var revealAllNow = function () {
      forEachEl(reveals, function (el) { el.classList.add('is-visible'); });
    };
    if ('IntersectionObserver' in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        forEachEl(entries, function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      forEachEl(reveals, function (el) { io.observe(el); });
    } else {
      revealAllNow();
    }
    window.setTimeout(revealAllNow, 1800);
  } catch (err) {
    forEachEl(document.querySelectorAll('.reveal'), function (el) {
      el.classList.add('is-visible');
    });
  }

  // ---- Año en el footer ----
  try {
    forEachEl(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = new Date().getFullYear();
    });
  } catch (err) { /* no crítico */ }

  // ---- Formulario de contacto (sin backend): abre WhatsApp con el mensaje ----
  try {
    var form = document.querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = form.querySelector('#nombre').value.trim();
        var telefono = form.querySelector('#telefono').value.trim();
        var nivel = form.querySelector('#nivel').value;
        var mensaje = form.querySelector('#mensaje').value.trim();

        var texto = 'Hola Shammah, mi nombre es ' + nombre +
          '. Quisiera información sobre el proceso de admisión 2026' +
          (nivel ? ' para el nivel de ' + nivel : '') +
          (telefono ? '. Mi teléfono de contacto es ' + telefono : '') +
          (mensaje ? '. ' + mensaje : '');

        // TODO: reemplazar 51924991420 por el número de WhatsApp real del colegio
        var whatsappNumber = '51924991420';
        var url = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(texto);
        window.open(url, '_blank');
      });
    }
  } catch (err) { /* no crítico */ }

});
