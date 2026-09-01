/**
 * audio-player.js
 * Conecta cada `.audio-player` con su <audio data-audio="..."> real. El
 * archivo mp3 referenciado no existe todavía (placeholder), por lo que se
 * silencia el evento 'error' y se conserva "0:45" como duración de ejemplo
 * (documentada en ANALISIS-DISENO.md §5) hasta que 'loadedmetadata' entregue
 * una duración real.
 *
 * Incluye efecto karaoke: el texto del párrafo se divide en palabras
 * resaltables (.kw) y se sincroniza con la reproducción del audio,
 * resaltando la palabra actual en amarillo y desplazándose automáticamente.
 */
(function () {
  function formatoTiempo(segundos) {
    if (!isFinite(segundos) || segundos < 0) segundos = 0;
    var m = Math.floor(segundos / 60);
    var s = Math.floor(segundos % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function duracionValida(d) {
    return isFinite(d) && d > 0;
  }

  /* =====================================================================
     Karaoke: divide el texto del párrafo en spans (.kw) por palabra,
     resalta la palabra actual según el progreso del audio y hace
     auto-scroll para mantenerla visible.
     ===================================================================== */

  /**
   * Reconstruye el contenido del párrafo envolviendo cada palabra en un
   * <span class="kw">, preservando <br> y otros nodos existentes.
   */
  function splitTextIntoWords(parrafo) {
    // Guardar estado de resaltado previo (si el carrusel recicla el párrafo)
    var prevActive = parrafo.querySelector('.kw--active');
    var prevId = prevActive ? prevActive.dataset.kid : null;

    // Limpiar solo nodos de texto; preservar <br>, <span>, etc.
    var nodes = Array.prototype.slice.call(parrafo.childNodes);
    var fragment = document.createDocumentFragment();

    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        // Nodo de texto: dividir en palabras
        var words = node.textContent.split(/(\s+)/);
        words.forEach(function (token) {
          if (token.match(/^\s+$/)) {
            fragment.appendChild(document.createTextNode(token));
          } else if (token.length > 0) {
            var span = document.createElement('span');
            span.className = 'kw';
            span.dataset.kid = token.toLowerCase();
            span.textContent = token;
            fragment.appendChild(span);
          }
        });
      } else {
        // <br> u otro elemento: conservar tal cual
        fragment.appendChild(node.cloneNode(true));
      }
    });

    parrafo.textContent = '';
    parrafo.appendChild(fragment);

    // Restaurar resaltado si la palabra sigue visible
    if (prevId) {
      var restored = parrafo.querySelector('[data-kid="' + prevId + '"]');
      if (restored) restored.classList.add('kw--active');
    }
  }

  /**
   * Actualiza el resaltado karaoke y el auto-scroll según el progreso
   * actual del audio.
   */
  function actualizarKaraoke(parrafo, fraccion) {
    var palabras = parrafo.querySelectorAll('.kw');
    if (!palabras.length) return;

    // Ponderar cada palabra por su largo en caracteres (+1 por el espacio
    // implícito entre palabras, que representa una pausa natural al hablar).
    // Esto distribuye el tiempo de forma proporcional a lo que tarda en
    // narrarse cada palabra, en vez de repartir el tiempo de forma uniforme.
    var pesos = [];
    var pesoTotal = 0;
    for (var i = 0; i < palabras.length; i++) {
      var w = palabras[i].textContent.length + 1;
      pesos.push(w);
      pesoTotal += w;
    }

    var acumulado = 0;
    var idx = 0;
    for (var j = 0; j < pesos.length; j++) {
      acumulado += pesos[j] / pesoTotal;
      if (fraccion <= acumulado) { idx = j; break; }
      idx = j;
    }

    for (var k = 0; k < palabras.length; k++) {
      if (k < idx) {
        palabras[k].classList.remove('kw--active');
        palabras[k].classList.add('kw--spoken');
      } else if (k === idx) {
        palabras[k].classList.add('kw--active');
        palabras[k].classList.remove('kw--spoken');
      } else {
        palabras[k].classList.remove('kw--active', 'kw--spoken');
      }
    }

    // Auto-scroll: mover SOLO el propio párrafo ajustando su scrollTop a mano.
    // No usar element.scrollIntoView(): además del párrafo llega a desplazar
    // #stage/#track (que tienen overflow:hidden pero siguen siendo scrollables
    // por script), lo que descuadra el motor de gravedad y deja asomando la
    // vista siguiente.
    var active = parrafo.querySelector('.kw--active');
    if (active) {
      var pRect = parrafo.getBoundingClientRect();
      var aRect = active.getBoundingClientRect();
      var relativeTop = aRect.top - pRect.top;
      var visible = relativeTop >= 0 && (relativeTop + aRect.height) <= pRect.height;
      if (!visible) {
        var deltaCentro = (aRect.top + aRect.height / 2) - (pRect.top + pRect.height / 2);
        var objetivo = parrafo.scrollTop + deltaCentro;
        var maxScroll = parrafo.scrollHeight - parrafo.clientHeight;
        objetivo = Math.max(0, Math.min(maxScroll, objetivo));
        if (Math.abs(objetivo - parrafo.scrollTop) > 4) parrafo.scrollTop = objetivo;
      }
    }
  }

  /**
   * Limpia todos los estados de resaltado del párrafo.
   */
  function limpiarKaraoke(parrafo) {
    var all = parrafo.querySelectorAll('.kw');
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove('kw--active', 'kw--spoken');
    }
  }

  function iniciar(reproductor) {
    var audio = reproductor.querySelector('.audio-player__el');
    var btnPlay = reproductor.querySelector('.audio-player__play');
    var btnRepetir = reproductor.querySelector('.audio-player__repetir');
    var btnAnterior = reproductor.querySelector('.audio-player__anterior');
    var btnSiguiente = reproductor.querySelector('.audio-player__siguiente');
    var btnAleatorio = reproductor.querySelector('.audio-player__aleatorio');
    var barra = reproductor.querySelector('.audio-player__barra');
    var relleno = reproductor.querySelector('.audio-player__relleno');
    var thumb = reproductor.querySelector('.audio-player__thumb');
    var tiempoEl = reproductor.querySelector('.audio-player__tiempo');
    var parrafo = reproductor.querySelector('.audio-player__parrafo');
    if (!audio) return;

    var duracionEjemplo = 45;
    var srcReal = audio.dataset.audio;
    if (srcReal) audio.src = srcReal;
    audio.addEventListener('error', function () {}, true);

    function textoTiempo(actual, total) {
      return formatoTiempo(actual > 0 ? actual : total);
    }
    tiempoEl.textContent = textoTiempo(0, duracionEjemplo);

    function actualizarBarra(fraccion) {
      var pct = Math.max(0, Math.min(1, fraccion)) * 100 + '%';
      relleno.style.width = pct;
      thumb.style.left = pct;
    }

    if (btnPlay) {
      btnPlay.addEventListener('click', function () {
        if (audio.paused) {
          var promesa = audio.play();
          if (promesa && typeof promesa.catch === 'function') {
            promesa.catch(function () {});
          }
        } else {
          audio.pause();
        }
      });
      audio.addEventListener('play', function () { btnPlay.classList.add('esta-reproduciendo'); });
      audio.addEventListener('pause', function () { btnPlay.classList.remove('esta-reproduciendo'); });
    }

    if (btnRepetir) {
      btnRepetir.addEventListener('click', function () {
        audio.loop = !audio.loop;
        btnRepetir.classList.toggle('esta-activo', audio.loop);
        btnRepetir.setAttribute('aria-pressed', String(audio.loop));
      });
    }

    if (btnAleatorio) {
      btnAleatorio.addEventListener('click', function () {
        var activo = btnAleatorio.classList.toggle('esta-activo');
        btnAleatorio.setAttribute('aria-pressed', String(activo));
      });
    }

    if (btnAnterior) {
      btnAnterior.addEventListener('click', function () {
        audio.currentTime = 0;
      });
    }
    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', function () {
        var total = duracionValida(audio.duration) ? audio.duration : duracionEjemplo;
        audio.currentTime = total;
      });
    }

    // --- Timeupdate: actualizar barra + karaoke ---
    audio.addEventListener('timeupdate', function () {
      var total = duracionValida(audio.duration) ? audio.duration : duracionEjemplo;
      tiempoEl.textContent = textoTiempo(audio.currentTime, total);
      var fraccion = audio.currentTime / total;
      actualizarBarra(fraccion);
      if (parrafo && parrafo.querySelectorAll('.kw').length) {
        actualizarKaraoke(parrafo, fraccion);
      }
    });

    audio.addEventListener('loadedmetadata', function () {
      if (duracionValida(audio.duration)) duracionEjemplo = audio.duration;
      tiempoEl.textContent = textoTiempo(audio.currentTime, duracionEjemplo);
    });

    audio.addEventListener('durationchange', function () {
      if (duracionValida(audio.duration)) duracionEjemplo = audio.duration;
    });

    audio.addEventListener('ended', function () {
      btnPlay.classList.remove('esta-reproduciendo');
      reproductor.dispatchEvent(new CustomEvent('audioplayer:next', { bubbles: true }));
    });

    // --- Karaoke: observar cambios en el párrafo y reiniciar split ---
    if (parrafo) {
      // Dividir texto actual si ya existe
      if (parrafo.textContent.trim()) splitTextIntoWords(parrafo);

      // Observar cambios de contenido (carousel.js cambia el texto al rotar tarjetas)
      var karaokeObserver = new MutationObserver(function () {
        // Solo re-split si no hay .kw ya (evitar loop infinito)
        if (!parrafo.querySelector('.kw')) {
          splitTextIntoWords(parrafo);
        }
      });
      karaokeObserver.observe(parrafo, { childList: true, characterData: true, subtree: true });

      // Limpiar karaoke al pausar o al terminar
      audio.addEventListener('pause', function () { limpiarKaraoke(parrafo); });
    }

    // --- Arrastre del scrubber ---
    if (!barra) return;
    var arrastrando = false;

    function fraccionDesdeEvento(e) {
      var rect = barra.getBoundingClientRect();
      var clientX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }

    function moverA(fraccion) {
      if (!isFinite(fraccion)) return;
      actualizarBarra(fraccion);
      var durOk = duracionValida(audio.duration);
      var total = durOk ? audio.duration : duracionEjemplo;
      var nuevoTiempo = fraccion * total;
      if (durOk && isFinite(nuevoTiempo)) audio.currentTime = nuevoTiempo;
      tiempoEl.textContent = textoTiempo(nuevoTiempo, total);
    }

    function onDown(e) { arrastrando = true; thumb.style.cursor = 'grabbing'; moverA(fraccionDesdeEvento(e)); }
    function onMove(e) { if (!arrastrando) return; e.preventDefault(); moverA(fraccionDesdeEvento(e)); }
    function onUp() { arrastrando = false; thumb.style.cursor = 'grab'; }

    barra.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    barra.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  document.querySelectorAll('.audio-player').forEach(iniciar);

  // Al cambiar de vista con el motor de gravedad (rueda, flechas, puntos de
  // progreso...), pausar el audio de cualquier vista que ya no sea la actual
  // — p. ej. la locución de una historia del carrusel que quedó sonando.
  document.addEventListener('gravity:change', function (e) {
    var actual = document.querySelectorAll('.view')[e.detail.index] || null;
    document.querySelectorAll('.audio-player__el').forEach(function (audio) {
      if (!audio.paused && audio.closest('.view') !== actual) audio.pause();
    });
  });
})();
