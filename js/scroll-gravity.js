/**
 * scroll-gravity.js
 * Motor de navegación por secciones con efecto "gravedad": cada .view dentro
 * de #track equivale a una página completa del PDF (1920x1080). Un giro de
 * rueda, una tecla de flecha o un swipe vertical siempre resuelve en un salto
 * COMPLETO a la vista siguiente/anterior (nunca queda a mitad de camino),
 * con una animación de transición e ignorando/acumulando input mientras
 * la animación está en curso (flag isAnimating) para no saltar de golpe
 * varias vistas con un solo gesto.
 *
 * No usa una librería de scroll: controla `transform: translateY()` sobre
 * #track directamente. `scroll-snap-type` se añade como refuerzo semántico
 * en el fallback --sin JS-- (ver body.sin-js en css/layout.css).
 *
 * Los carruseles horizontales de tarjetas (dentro de una misma vista) son un
 * sistema de navegación independiente (ver js/carousel.js) y no interactúan
 * con este motor: los controles del carrusel usan click, no wheel/scroll, y
 * detienen la propagación del evento para no disparar nunca un cambio de vista.
 */
(function () {
  var track = document.getElementById('track');
  var stage = document.getElementById('stage');
  var viewport = document.getElementById('viewport');
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  var total = views.length;

  // Red de seguridad: aunque #stage/#track/#viewport tengan overflow:hidden,
  // el navegador aún puede desplazarlos por script (scrollIntoView, focus(),
  // etc.). Ese desplazamiento nativo se sumaría al translateY del motor de
  // gravedad y dejaría media vista asomando. Lo anulamos siempre.
  function anclarScrollNativo() {
    if (document.body.classList.contains('modo-movil')) return;
    [track, stage, viewport].forEach(function (el) {
      if (!el) return;
      if (el.scrollTop) el.scrollTop = 0;
      if (el.scrollLeft) el.scrollLeft = 0;
    });
  }
  [track, stage, viewport].forEach(function (el) {
    if (el) el.addEventListener('scroll', anclarScrollNativo, { passive: true });
  });
  var current = 0;
  var isAnimating = false;
  var WHEEL_THRESHOLD = 12; // ignora micro-eventos de trackpad ruidosos
  var wheelCooldown = null;

  var listeners = [];

  function onChange(fn) { listeners.push(fn); }

  function notify() {
    var view = views[current];
    listeners.forEach(function (fn) { fn(current, view); });
    view.dispatchEvent(new CustomEvent('view:enter', { detail: { index: current } }));
    document.dispatchEvent(new CustomEvent('gravity:change', {
      detail: { index: current, total: total, id: view.dataset.viewId || null }
    }));
  }

  function stageH() {
    return window.__prontoStage ? window.__prontoStage.STAGE_H : 1080;
  }

  function goTo(index, opts) {
    opts = opts || {};
    if (document.body.classList.contains('modo-movil')) {
      // En modo móvil el track no se transforma: se hace scroll nativo suave
      // hasta la vista objetivo (el reflow vertical ya es scroll continuo,
      // el "salto" de gravedad no aplica al layout apilado de móvil).
      index = Math.max(0, Math.min(total - 1, index));
      current = index;
      views[index].scrollIntoView({ behavior: opts.instant ? 'auto' : 'smooth', block: 'start' });
      notify();
      return;
    }

    index = Math.max(0, Math.min(total - 1, index));
    if (index === current && !opts.force) return;
    if (isAnimating && !opts.instant) return;

    current = index;
    var y = -(current * stageH());

    if (opts.instant) {
      track.style.transition = 'none';
      track.style.transform = 'translateY(' + y + 'px)';
      // forzar reflow para que la siguiente transición sí anime
      void track.offsetHeight;
      track.style.transition = '';
    } else {
      isAnimating = true;
      track.style.transition = 'transform var(--gravity-duration) var(--gravity-easing)';
      track.style.transform = 'translateY(' + y + 'px)';
    }

    anclarScrollNativo();
    notify();
  }

  track.addEventListener('transitionend', function (e) {
    if (e.propertyName === 'transform') isAnimating = false;
  });

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // --- Rueda del mouse / trackpad ---
  window.addEventListener('wheel', function (e) {
    if (document.body.classList.contains('modo-movil')) return; // scroll nativo
    if (e.target.closest('[data-no-gravity]')) return; // ej. dentro de un carrusel/scrubber

    if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
    e.preventDefault();

    if (isAnimating) return; // acumula/ignora hasta que termine la animación en curso
    if (wheelCooldown) return;

    if (e.deltaY > 0) next(); else prev();

    wheelCooldown = setTimeout(function () { wheelCooldown = null; }, 80);
  }, { passive: false });

  // --- Teclado ---
  window.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
  });

  // --- Touch / swipe vertical (también sirve como fallback en modo-móvil,
  //     donde simplemente no se preventDefault y el navegador hace scroll nativo) ---
  var touchStartY = null;
  var touchActive = false;

  window.addEventListener('touchstart', function (e) {
    if (document.body.classList.contains('modo-movil')) return;
    if (e.target.closest('[data-no-gravity]')) return;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (!touchActive || document.body.classList.contains('modo-movil')) return;
    if (e.target.closest('[data-no-gravity]')) return;
    e.preventDefault(); // evita el rebote nativo mientras se gestiona el swipe
  }, { passive: false });

  window.addEventListener('touchend', function (e) {
    if (!touchActive || document.body.classList.contains('modo-movil')) return;
    touchActive = false;
    if (touchStartY === null || isAnimating) return;

    var touchEndY = e.changedTouches[0].clientY;
    var delta = touchStartY - touchEndY;
    var SWIPE_THRESHOLD = 50;

    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta > 0) next(); else prev();
    touchStartY = null;
  }, { passive: true });

  // --- Navegación explícita: cualquier elemento con [data-goto] ---
  // data-goto="next" | "prev" | "0".."N" | "#id-de-vista"
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-goto]');
    if (!el) return;
    e.preventDefault();
    var target = el.dataset.goto;

    if (target === 'next') return next();
    if (target === 'prev') return prev();

    if (target.charAt(0) === '#') {
      var idx = views.findIndex(function (v) { return v.id === target.slice(1); });
      if (idx >= 0) return goTo(idx);
      return;
    }

    var n = parseInt(target, 10);
    if (!isNaN(n)) goTo(n);
  });

  // Reajustar posición (sin animar) cuando cambia el modo móvil/desktop o el
  // tamaño de ventana, para que la vista actual siga alineada tras el resize.
  window.addEventListener('stagescale', function () {
    if (!document.body.classList.contains('modo-movil')) {
      goTo(current, { instant: true, force: true });
    }
  });

  goTo(0, { instant: true, force: true });

  window.prontoGravity = {
    next: next,
    prev: prev,
    goTo: goTo,
    current: function () { return current; },
    total: total,
    views: views,
    onChange: onChange
  };
})();
