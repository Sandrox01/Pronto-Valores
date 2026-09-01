/**
 * video-player.js
 * Conecta cada `.video-player` con su <video> real. Sin fuente de video
 * todavía (assets/video/.../*.mp4 vacíos), pero SÍ hay narración real en
 * `.video-player__narracion` (assets/audio/[modulo]/escenario.mp3, ya
 * entregada por el equipo de contenido) — mientras no llegue el .mp4, esa
 * narración es la que manda: controla play/pausa, la barra de progreso, el
 * tiempo y el auto-avance al terminar. El botón también intenta reproducir
 * el <video> (para cuando llegue el archivo real, quede sincronizado sin
 * tocar código), pero su error se ignora en silencio si no hay fuente.
 */
(function () {
  function formatoTiempo(segundos) {
    if (!isFinite(segundos) || segundos < 0) segundos = 0;
    var m = Math.floor(segundos / 60);
    var s = Math.floor(segundos % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // Algunos MP3 reportan `duration === Infinity` un instante después de
  // 'loadedmetadata' (típico en Chromium hasta que el archivo termina de
  // descargarse o se hace un seek cerca del final) — sin este guard,
  // `currentTime = fracción * Infinity` lanza "non-finite value" y rompe
  // el arrastre de la barra.
  function duracionValida(d) {
    return isFinite(d) && d > 0;
  }

  function iniciar(reproductor) {
    var video = reproductor.querySelector('.video-player__el');
    var narracion = reproductor.querySelector('.video-player__narracion');
    var btnPlay = reproductor.querySelector('.video-player__play');
    var barra = reproductor.querySelector('.video-player__barra');
    var relleno = reproductor.querySelector('.video-player__relleno');
    var thumb = reproductor.querySelector('.video-player__thumb');
    var tiempoEl = reproductor.querySelector('.video-player__tiempo');
    if (!video) return;

    // El "reloj" de la interfaz: la narración si existe (tiene duración
    // real), si no el propio <video> (para cuando llegue el .mp4 real).
    var reloj = narracion || video;

    // La locución (mp3) casi siempre dura más que el reel de video. Si la
    // narración es el "reloj" y hay un <video> real con fuente, se deja el
    // video en bucle para que la imagen siga viva bajo la voz en lugar de
    // congelarse en el último fotograma; se detiene junto con la narración
    // (ver handler de 'ended' más abajo).
    var fuenteVideo = video.querySelector('source');
    var videoEnBucle = !!(narracion && narracion === reloj && fuenteVideo && fuenteVideo.getAttribute('src'));
    if (videoEnBucle) video.loop = true;

    // Sin esto, una fuente vacía/rota puede disparar una promesa de play()
    // rechazada sin capturar y aparecer como error no controlado en consola.
    video.addEventListener('error', function () {}, true);
    if (narracion) narracion.addEventListener('error', function () {}, true);

    function actualizarBarra(fraccion) {
      var pct = Math.max(0, Math.min(1, fraccion)) * 100 + '%';
      relleno.style.width = pct;
      thumb.style.left = pct;
    }

    function intentarReproducir(el) {
      var promesa = el.play();
      if (promesa && typeof promesa.catch === 'function') {
        promesa.catch(function () {
          /* sin fuente real: no hay nada que reproducir, se ignora en silencio */
        });
      }
    }

    btnPlay.addEventListener('click', function () {
      if (reloj.paused) {
        intentarReproducir(video);
        if (narracion) intentarReproducir(narracion);
      } else {
        video.pause();
        if (narracion) narracion.pause();
      }
    });

    reloj.addEventListener('play', function () {
      reproductor.classList.add('has-played');
      btnPlay.classList.add('esta-reproduciendo');
    });
    reloj.addEventListener('pause', function () {
      btnPlay.classList.remove('esta-reproduciendo');
    });

    reloj.addEventListener('timeupdate', function () {
      tiempoEl.textContent = formatoTiempo(reloj.currentTime);
      if (duracionValida(reloj.duration)) actualizarBarra(reloj.currentTime / reloj.duration);
    });

    reloj.addEventListener('loadedmetadata', function () {
      tiempoEl.textContent = formatoTiempo(reloj.currentTime);
    });

    // Al terminar la narración (o el video): si este reproductor tiene un
    // botón de llamada a la acción propio (ej. "Iniciar desafío" en
    // Bienvenida), se revela SOBRE la misma pantalla — así lo pide el guion
    // ("Al finalizar, aparece el botón activo 'Iniciar desafío'"), no se
    // navega sola a otra vista. Si no tiene botón propio, avanza sola a la
    // siguiente vista (comportamiento de los escenarios de cada valor).
    var cta = reproductor.querySelector('.video-player__cta');
    reloj.addEventListener('ended', function () {
      btnPlay.classList.remove('esta-reproduciendo');
      // Cortar el bucle del reel y dejarlo quieto cuando termina la locución.
      if (videoEnBucle) { video.loop = false; }
      video.pause();
      if (cta) {
        btnPlay.hidden = true;
        cta.hidden = false;
      } else if (window.prontoGravity) {
        window.prontoGravity.next();
      }
    });

    // --- Arrastre del scrubber ---
    var arrastrando = false;

    function fraccionDesdeEvento(e) {
      var rect = barra.getBoundingClientRect();
      var clientX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }

    function moverA(fraccion) {
      if (!isFinite(fraccion)) return;
      actualizarBarra(fraccion);
      if (duracionValida(reloj.duration)) {
        var nuevoTiempo = fraccion * reloj.duration;
        if (isFinite(nuevoTiempo)) reloj.currentTime = nuevoTiempo;
      }
      tiempoEl.textContent = formatoTiempo(reloj.currentTime);
    }

    function onDown(e) {
      arrastrando = true;
      thumb.style.cursor = 'grabbing';
      moverA(fraccionDesdeEvento(e));
    }
    function onMove(e) {
      if (!arrastrando) return;
      e.preventDefault();
      moverA(fraccionDesdeEvento(e));
    }
    function onUp() {
      arrastrando = false;
      thumb.style.cursor = 'grab';
    }

    barra.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    barra.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  document.querySelectorAll('.video-player').forEach(iniciar);

  // Al cambiar de vista con el motor de gravedad, pausar el video y su
  // narración si pertenecen a una vista que ya no está en pantalla.
  document.addEventListener('gravity:change', function (e) {
    var actual = document.querySelectorAll('.view')[e.detail.index] || null;
    document.querySelectorAll('.video-player').forEach(function (rep) {
      if (rep.closest('.view') === actual) return;
      var v = rep.querySelector('.video-player__el');
      var n = rep.querySelector('.video-player__narracion');
      if (v && !v.paused) v.pause();
      if (n && !n.paused) n.pause();
    });
  });
})();
