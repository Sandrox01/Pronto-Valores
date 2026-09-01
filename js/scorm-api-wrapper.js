/**
 * scorm-api-wrapper.js
 * Wrapper ligero propio para SCORM 1.2 (API `API`, modelo de datos
 * `cmi.core.*`). Se eligió SCORM 1.2 sobre 2004 por ser el estándar con
 * mayor compatibilidad entre LMS corporativos.
 *
 * Responsabilidades:
 *  - Localizar el API del LMS buscando en la cadena de ventanas padre/opener
 *    (algoritmo estándar ADL "FindAPI").
 *  - LMSInitialize al cargar; marca cmi.core.lesson_status = "incomplete"
 *    la primera vez (si el LMS ya trae "completed"/"passed" no lo pisa).
 *  - Bookmarking: guarda cmi.core.lesson_location con el id de la última
 *    vista alcanzada en cada cambio de vista (evento `gravity:change` que
 *    emite js/scroll-gravity.js), y restaura esa posición al iniciar si el
 *    LMS soporta reanudar (cmi.core.entry === "resume").
 *  - Marca cmi.core.lesson_status = "completed" automáticamente al llegar a
 *    la vista final (data-view-id="final"), sin requerir un botón (el
 *    diseño del PDF no tiene botón visible en esa pantalla).
 *  - LMSFinish/Commit correcto al cerrar la ventana/pestaña.
 *
 * Si no se encuentra ningún LMS (ej. abriendo el archivo directo en un
 * navegador para pruebas), el wrapper opera en "modo standalone": no falla,
 * solo no persiste nada, y lo indica una vez por consola.
 */
(function () {
  var API = null;
  var initialized = false;
  var standalone = false;
  var FINAL_VIEW_ID = 'final';
  var MAX_SEARCH_PARENTS = 7;

  function findAPI(win) {
    var attempts = 0;
    while (win && !win.API && win.parent && win.parent !== win && attempts < MAX_SEARCH_PARENTS) {
      attempts++;
      win = win.parent;
    }
    return win ? win.API : null;
  }

  function locateAPI() {
    var api = findAPI(window);
    if (!api && window.opener) {
      api = findAPI(window.opener);
    }
    return api;
  }

  function safeCall(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  function init() {
    API = locateAPI();

    if (!API) {
      standalone = true;
      console.info('[SCORM] No se encontró un API de LMS — ejecutando en modo standalone (sin persistencia).');
      return;
    }

    var result = safeCall(function () { return API.LMSInitialize(''); }, 'false');
    initialized = (result === 'true' || result === true);

    if (!initialized) {
      console.warn('[SCORM] LMSInitialize falló; se continúa en modo standalone.');
      standalone = true;
      return;
    }

    var status = safeCall(function () { return API.LMSGetValue('cmi.core.lesson_status'); }, '');
    if (status === '' || status === 'not attempted') {
      setValue('cmi.core.lesson_status', 'incomplete');
    }

    var entry = safeCall(function () { return API.LMSGetValue('cmi.core.entry'); }, '');
    if (entry === 'resume') {
      var bookmark = safeCall(function () { return API.LMSGetValue('cmi.core.lesson_location'); }, '');
      if (bookmark) {
        document.addEventListener('DOMContentLoaded', function () {
          restoreBookmark(bookmark);
        });
      }
    }

    commit();
  }

  function restoreBookmark(viewId) {
    if (!window.prontoGravity) return;
    var idx = window.prontoGravity.views.findIndex(function (v) { return v.dataset.viewId === viewId; });
    if (idx > 0) window.prontoGravity.goTo(idx, { instant: true, force: true });
  }

  function setValue(key, value) {
    if (standalone || !initialized) return;
    safeCall(function () { return API.LMSSetValue(key, value); });
  }

  function commit() {
    if (standalone || !initialized) return;
    safeCall(function () { return API.LMSCommit(''); });
  }

  function onViewChange(index, view) {
    if (standalone) return;
    var viewId = view.dataset.viewId;
    if (!viewId) return;

    setValue('cmi.core.lesson_location', viewId);

    if (viewId === FINAL_VIEW_ID) {
      setValue('cmi.core.lesson_status', 'completed');
      setValue('cmi.core.score.raw', '100');
    }

    commit();
  }

  function finish() {
    if (standalone || !initialized) return;
    commit();
    safeCall(function () { return API.LMSFinish(''); });
    initialized = false;
  }

  document.addEventListener('gravity:change', function (e) {
    onViewChange(e.detail.index, window.prontoGravity.views[e.detail.index]);
  });

  window.addEventListener('beforeunload', finish);
  window.addEventListener('pagehide', finish);

  init();

  window.prontoScorm = { finish: finish, isStandalone: function () { return standalone; } };
})();
