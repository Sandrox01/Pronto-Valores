/**
 * carousel.js
 * Carrusel HORIZONTAL real dentro de una única .view: navega entre las
 * tarjetas de tips (+ la tarjeta de historia final) sin disparar el motor de
 * gravedad vertical (js/scroll-gravity.js). Solo en los bordes —"anterior"
 * en la primera tarjeta, "siguiente" en la última (historia)— la flecha cae
 * al motor de gravedad para pasar a la vista adjacente (loading/escenario
 * antes, cierre de módulo después).
 *
 * Cada `.carrusel-mini` lee su propio set de tarjetas desde un
 * `<script type="application/json" class="carrusel-datos">` embebido, y
 * controla tanto su propio trío de iconos (anterior/actual/siguiente) como
 * el `.audio-player` hermano dentro de la misma `.view` (icono grande,
 * título, párrafo de historia y el `src` del `<audio>` persistente).
 */
(function () {
  function porIndice(cards, i) {
    if (i < 0 || i >= cards.length) return null;
    return cards[i];
  }

  function iniciar(mini) {
    var datosEl = mini.querySelector('.carrusel-datos');
    if (!datosEl) return;

    var cards;
    try { cards = JSON.parse(datosEl.textContent); } catch (e) { return; }
    if (!cards || !cards.length) return;

    var view = mini.closest('.view');
    var audioPanel = view.querySelector('.audio-player');

    var btnPrev = mini.querySelector('.carrusel-mini__flecha--prev');
    var btnNext = mini.querySelector('.carrusel-mini__flecha--next');
    var elPrev = mini.querySelector('.carrusel-mini__icono--prev');
    var elActual = mini.querySelector('.carrusel-mini__icono--actual');
    var elNext = mini.querySelector('.carrusel-mini__icono--next');
    var trackTitulo = mini.querySelector('.carrusel-mini__track-titulo');

    var audioIcono = audioPanel ? audioPanel.querySelector('.audio-player__icono') : null;
    var audioTitulo = audioPanel ? audioPanel.querySelector('.audio-player__titulo') : null;
    var audioEyebrow = audioPanel ? audioPanel.querySelector('.audio-player__eyebrow') : null;
    var audioParrafo = audioPanel ? audioPanel.querySelector('.audio-player__parrafo') : null;
    var audioEl = audioPanel ? audioPanel.querySelector('.audio-player__el') : null;
    var audioPlayBtn = audioPanel ? audioPanel.querySelector('.audio-player__play') : null;
    var audioRelleno = audioPanel ? audioPanel.querySelector('.audio-player__relleno') : null;
    var audioThumb = audioPanel ? audioPanel.querySelector('.audio-player__thumb') : null;
    var audioTiempo = audioPanel ? audioPanel.querySelector('.audio-player__tiempo') : null;

    var index = 0;

    function llenarIcono(el, card, atenuado) {
      var img = el.querySelector('img');
      if (!card || (card.historia && card.icon === undefined)) {
        el.classList.add('carrusel-mini__icono--oculto');
        return;
      }
      el.classList.remove('carrusel-mini__icono--oculto');
      img.src = card.icon || '';
      img.alt = atenuado ? '' : (card.iconAlt || '');
      el.setAttribute('aria-hidden', atenuado ? 'true' : 'false');
    }

    function render() {
      var actual = cards[index];

      // Trío de iconos del mini-carrusel. En la tarjeta de historia, el PDF
      // de diseño muestra como "actual" el icono de una tarjeta temática
      // (no un icono propio de historia) — se respeta ese comportamiento vía
      // el campo opcional `miniActualIndex` en los datos de la tarjeta.
      var iActual = (actual.historia && typeof actual.miniActualIndex === 'number')
        ? actual.miniActualIndex
        : index;
      var cardActualParaMini = actual.historia ? cards[iActual] : actual;

      llenarIcono(elPrev, porIndice(cards, index - 1), true);
      llenarIcono(elActual, cardActualParaMini, false);
      llenarIcono(elNext, actual.historia ? null : porIndice(cards, index + 1), true);

      trackTitulo.textContent = actual.label || '';
      trackTitulo.hidden = !actual.label;

      btnPrev.setAttribute('aria-label', index === 0 ? 'Volver a la pantalla anterior' : 'Tarjeta anterior: ' + (porIndice(cards, index - 1).label || ''));
      btnNext.setAttribute('aria-label', index === cards.length - 1 ? 'Continuar al cierre del módulo' : 'Tarjeta siguiente: ' + ((porIndice(cards, index + 1) || {}).label || 'historia'));

      // Panel derecho: icono+título+texto de tip (sin audio: el guion no
      // trae locución para las tarjetas de tips, solo para escenario e
      // historia), o eyebrow+párrafo+reproductor real para la historia.
      if (audioPanel) {
        var esHistoria = !!actual.historia;
        var tieneAudio = esHistoria; // ver ANALISIS-DISENO.md: solo historia trae audio real
        audioPanel.classList.toggle('audio-player--historia', esHistoria);
        audioPanel.classList.toggle('audio-player--sin-audio', !tieneAudio);

        if (audioIcono) audioIcono.hidden = esHistoria;
        if (audioTitulo) audioTitulo.hidden = esHistoria;
        if (audioEyebrow) audioEyebrow.hidden = !esHistoria;
        if (audioParrafo) audioParrafo.hidden = false;

        if (esHistoria) {
          if (audioEyebrow) audioEyebrow.textContent = actual.eyebrow || '';
          if (audioParrafo) audioParrafo.innerHTML = actual.parrafo || '';
        } else {
          if (audioIcono) {
            var img = audioIcono.querySelector('img');
            img.src = actual.icon || '';
            img.alt = actual.iconAlt || '';
          }
          if (audioTitulo) audioTitulo.textContent = actual.label || '';
          if (audioParrafo) audioParrafo.innerHTML = actual.caption || '';
        }

        if (tieneAudio) {
          if (audioEl && actual.audio) {
            audioEl.pause();
            audioEl.src = actual.audio;
            audioEl.currentTime = 0;
          }
          if (audioPlayBtn) audioPlayBtn.classList.remove('esta-reproduciendo');
          if (audioRelleno) audioRelleno.style.width = '0%';
          if (audioThumb) audioThumb.style.left = '0%';
          if (audioTiempo) audioTiempo.textContent = '0:45';
        } else if (audioEl) {
          // Tarjeta de tip sin locución propia: no dejar ningún <audio>
          // real cargado ni reproduciéndose de una tarjeta anterior.
          audioEl.pause();
          audioEl.removeAttribute('src');
          audioEl.load();
        }
      }
    }

    function prev() {
      if (index === 0) {
        if (window.prontoGravity) window.prontoGravity.prev();
        return;
      }
      index--;
      render();
    }

    function next() {
      if (index === cards.length - 1) {
        if (window.prontoGravity) window.prontoGravity.next();
        return;
      }
      index++;
      render();
    }

    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);

    if (audioPanel) {
      audioPanel.addEventListener('audioplayer:prev', prev);
      audioPanel.addEventListener('audioplayer:next', next);
    }

    render();
  }

  document.querySelectorAll('.carrusel-mini').forEach(iniciar);
})();
