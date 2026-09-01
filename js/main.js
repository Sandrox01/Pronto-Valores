/**
 * main.js
 * Construye el indicador de progreso lateral (un punto por vista) fuera del
 * lienzo escalado 1920x1080, para que su tamaño en pantalla sea siempre
 * consistente sin importar el `transform:scale()` del stage. Se sincroniza
 * con el motor de gravedad vía el evento `gravity:change` y permite saltar
 * directo a una vista haciendo click en su punto.
 */
(function () {
  if (!window.prontoGravity) return;

  var nav = document.createElement('nav');
  nav.className = 'progreso-lateral';
  nav.setAttribute('aria-label', 'Progreso del curso');

  var puntos = window.prontoGravity.views.map(function (view, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'progreso-lateral__punto';
    btn.dataset.goto = String(i);
    btn.setAttribute('aria-label', 'Ir a la vista ' + (i + 1) + ' de ' + window.prontoGravity.total);
    nav.appendChild(btn);
    return btn;
  });

  document.getElementById('viewport').appendChild(nav);

  function marcarActivo(index) {
    puntos.forEach(function (p, i) {
      p.classList.toggle('esta-activo', i === index);
      p.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  }

  document.addEventListener('gravity:change', function (e) {
    marcarActivo(e.detail.index);
  });

  marcarActivo(window.prontoGravity.current());
})();
