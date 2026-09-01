/**
 * presenter.js
 * Controla la vista presentadora animada entre valores: detecta cuándo el
 * usuario entra en una vista `.view-presenter`, inyecta el div de resplandor
 * y divide el título en spans individuales por carácter para lograr la
 * animación letter-by-letter con bounce. Después de ~4.2s ejecuta la salida
 * (fade-out) y avanza automáticamente a la vista siguiente (escenario del
 * siguiente valor).
 *
 * La vista presentadora NO es interactiva: no tiene botones, solo avanza
 * sola. El usuario puede saltarla manualmente con scroll/teclado/swipe.
 */
(function () {
  if (!window.prontoGravity) return;

  var PRESENTER_DURATION = 4200; // ms antes de iniciar la salida
  var EXIT_DURATION = 450;       // ms de la animación de salida

  var pendingTimer = null;
  var exitTimer = null;

  /**
   * Prepara la estructura interna de una vista presentadora: inyecta el
   * glow div y divide el título en <span class="presenter-char"> por cada
   * carácter (incluyendo espacios, que se renderizan como &nbsp;).
   * Solo se ejecuta una vez por vista (flag .is-prepared).
   */
  function preparePresenterView(view) {
    if (view.classList.contains('is-prepared')) return;

    var card = view.querySelector('.presenter-card');
    if (!card) return;

    // Inyectar glow div si no existe
    if (!card.querySelector('.presenter-card__glow')) {
      var glow = document.createElement('div');
      glow.className = 'presenter-card__glow';
      glow.setAttribute('aria-hidden', 'true');
      card.insertBefore(glow, card.firstChild);
    }

    // Dividir título en caracteres
    var title = card.querySelector('.presenter-card__title');
    if (title && !title.querySelector('.presenter-char')) {
      var text = title.textContent.trim();
      title.textContent = '';
      title.setAttribute('aria-label', text);

      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.className = 'presenter-char';
        span.setAttribute('aria-hidden', 'true');
        // Usar &nbsp; para espacios y preserve para saltos de línea
        if (text[i] === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = text[i];
        }
        span.style.setProperty('--i', String(i));
        title.appendChild(span);
      }
    }

    view.classList.add('is-prepared');
  }

  /**
   * Inicia la secuencia de animación en la vista presentadora activa.
   */
  function startPresenterSequence(index) {
    clearTimers();

    var view = window.prontoGravity.views[index];
    if (!view || !view.classList.contains('view-presenter')) return;

    // Asegurar que la vista está preparada (glow + char spans)
    preparePresenterView(view);

    var card = view.querySelector('.presenter-card');
    if (!card) return;

    // Forzar reflow para que las keyframes se reinicien correctamente
    card.classList.remove('is-animating', 'is-exiting');
    void card.offsetHeight;
    card.classList.add('is-animating');

    // Después de PRESENTER_DURATION, lanzar salida y avanzar
    pendingTimer = setTimeout(function () {
      card.classList.remove('is-animating');
      card.classList.add('is-exiting');

      exitTimer = setTimeout(function () {
        card.classList.remove('is-exiting');
        window.prontoGravity.next();
      }, EXIT_DURATION);
    }, PRESENTER_DURATION);
  }

  function clearTimers() {
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
    if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
  }

  // Cuando el motor de gravedad cambia de vista
  document.addEventListener('gravity:change', function (e) {
    var view = window.prontoGravity.views[e.detail.index];
    if (view && view.classList.contains('view-presenter')) {
      startPresenterSequence(e.detail.index);
    } else {
      clearTimers();
    }
  });

  // Si el usuario navega manualmente, limpiar timers
  window.prontoGravity.onChange(function () {
    var current = window.prontoGravity.views[window.prontoGravity.current()];
    if (!current || !current.classList.contains('view-presenter')) {
      clearTimers();
    }
  });
})();
