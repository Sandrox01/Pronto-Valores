/**
 * stage-scale.js
 * Escala el #stage (lienzo lógico fijo 1920x1080) para que quepa completo en
 * cualquier ventana, manteniendo la proporción exacta del diseño del PDF
 * (letterbox si el aspect ratio del viewport no es 16:9).
 *
 * Por debajo de MOBILE_BREAKPOINT (o en portrait angosto) se desactiva el
 * escalado de lienzo fijo y se activa `body.modo-movil`, donde cada vista
 * fluye en layout vertical normal (ver css/base.css y css/secciones/*.css).
 */
(function () {
  var STAGE_W = 1920;
  var STAGE_H = 1080;
  var MOBILE_BREAKPOINT = 860; // px de ancho de viewport

  var viewport = document.getElementById('viewport');
  var stage = document.getElementById('stage');

  function esModoMovil() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    return w < MOBILE_BREAKPOINT || (w / h) < 0.62;
  }

  function aplicar() {
    var movil = esModoMovil();
    document.body.classList.toggle('modo-movil', movil);

    if (movil) {
      stage.style.transform = '';
      return;
    }

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var escala = Math.min(vw / STAGE_W, vh / STAGE_H);

    stage.style.transform = 'scale(' + escala + ')';

    window.__stageScale = escala;
    window.dispatchEvent(new CustomEvent('stagescale', { detail: { escala: escala, movil: false } }));
  }

  var raf = null;
  function onResize() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(aplicar);
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  document.addEventListener('DOMContentLoaded', aplicar);
  aplicar();

  window.__prontoStage = { STAGE_W: STAGE_W, STAGE_H: STAGE_H, esModoMovil: esModoMovil };
})();
