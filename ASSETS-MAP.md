# Mapa de assets — "Pronto: Héroes del Instante"

**Lectura obligatoria antes de usar este documento:** los nombres de archivo en `img/` NO
corresponden a su contenido visual real (ver `ANALISIS-DISENO.md` sección 0.1). Este mapa fue
construido verificando el contenido real de cada uno de los 55 PNG/JPG (mediante contact sheets
renderizados con Pillow y lectura visual individual), no confiando en el nombre del archivo.
La columna **"Ruta original en disco"** es exacta y no debe modificarse (mayúsculas, espacios y
paréntesis tal cual). La columna **"Contenido real verificado"** describe lo que la imagen
realmente muestra. La columna **"Nombre limpio propuesto"** es la ruta/nombre sugerido para usar
en el proyecto de código (referenciando el ARCHIVO ORIGINAL con ese contenido, no renombrado en
disco — el renombrado físico, si se decide hacer, es tarea aparte de la fase de codificación).

---

## 1. INICIO

| Ruta original en disco | Contenido real verificado | Nombre limpio propuesto | Página(s) PDF | Notas |
|---|---|---|---|---|
| `img/INICIO/Fondo-inicio (1).jpg` | Foto de la mujer (uniforme Pronto, polo verde oscuro) | `/assets/img/inicio/foto-mujer.jpg` | 1 | Nombre en disco sugiere "fondo", pero es la foto de la persona de la izquierda |
| `img/INICIO/LOGO-PRONTO (1).png` | Foto del hombre (uniforme Pronto, polo negro) | `/assets/img/inicio/foto-hombre.png` | 1 | Nombre en disco sugiere el logo, pero es la foto de la persona de la derecha |
| `img/INICIO/MUJER-1 (1).png` | Logotipo "Pronto" (script 3D negro) | `/assets/img/inicio/logo-pronto.png` | 1, 9, 16, 22, 29, 36, 37 | Es el ÚNICO logo real del proyecto; se reutiliza en splash y en las 6 pantallas de cierre (arriba a la derecha) |
| — (falta) | Textura de fondo amarillo con veta de madera + iconos línea (surtidor, café) del splash | — | 1 | **No existe como archivo separado.** Habría que recrearla en CSS/SVG o pedir el asset. |

---

## 2. HONESTIDAD (`img/HONESTIDAD/`)

| Ruta original en disco | Contenido real verificado | Nombre limpio propuesto | Página(s) PDF | Notas |
|---|---|---|---|---|
| `BOTON-ENFOQUE-AL-CLIENTE.png` | Botón circular flecha-atrás (◀, amarillo/negro) | `/assets/img/global/boton-flecha-atras.png` | (navegación, no visible como página fija) | GLOBAL — mismo botón se repite en las 5 carpetas de valor |
| `boton-iniciar (2).png` | Panel degradado amarillo→negro liso, 1840x2014, sin texto | `/assets/img/global/panel-degradado-chico.png` | ninguna identificada con certeza | Tamaño distinto del degradado de cierre; rol exacto sin confirmar — posible panel decorativo no usado en el PDF final o recorte de trabajo |
| `flecha-atras (1).png` | Botón píldora amarillo "INICIAR DESAFIO" | `/assets/img/global/boton-iniciar-desafio.png` | 3 (loading Honestidad) | GLOBAL — mismo botón en todas las pantallas "loading" (3, 10, 17→ver Innovación, 24, 31) |
| `flecha-avanzar (2).png` | Botón circular play (▶) negro/amarillo grande | `/assets/img/global/boton-play-circular-grande.png` | 2 (video placeholder) | GLOBAL |
| `fondo-amarillo-final.png` | Círculo amarillo chico con play (▶), 447x447 | `/assets/img/global/boton-play-circular-chico.png` | reproductor de audio (controles) | GLOBAL — duplicado visual de `fondo-cajas (2).png` |
| `fondo-boton-amarillo.png` | Degradado amarillo→negro a pantalla completa, 3778x2109 | `/assets/img/global/fondo-cierre-degradado.png` | 9, 16, 22, 29, 36, 37 | GLOBAL — fondo de TODAS las pantallas de cierre; imagen única en todo el proyecto |
| `fondo-cajas (2).png` | Círculo amarillo chico con play (▶), 374x375 | `/assets/img/global/boton-play-circular-chico-2.png` | reproductor de audio | Duplicado casi idéntico de `fondo-amarillo-final.png` |
| `fondo-gris-video (2).png` | **Icono de regalo** (caja verde/roja con moño) | `/assets/img/honestidad/icono-regalo-beneficios.png` | 7 | Icono real de la tarjeta "Beneficios para el cliente" |
| `icono-regalo.png` | Botón píldora amarillo "Enfoque al Cliente" | `/assets/img/honestidad/boton-siguiente-enfoque.png` | 9 | Botón de transición al siguiente módulo, en el cierre de Honestidad |
| `medalla.png` | Rectángulo gris liso redondeado, 3738x2087 | `/assets/img/global/placeholder-video-gris.png` | 2 (fondo del recuadro de video) | GLOBAL — mismo placeholder gris se repite (con contenido pixel-idéntico) en cada carpeta bajo otro nombre |
| `play-boton.png` | **Medalla dorada** grabada "HONESTIDAD" (ojo, balanza) | `/assets/img/global/medalla-honestidad.png` | 9, 16, 22, 29, 36, 37 | Único asset de medalla en todo el proyecto — reutilizado (con el mismo texto "HONESTIDAD") en los 6 cierres. Ver duda 0.3 en ANALISIS-DISENO.md |

**Iconos de carrusel FALTANTES en esta carpeta** (no existen como archivo, ni siquiera mal
nombrados): icono etiqueta/aguacate ("Precios claros", pág. 4), icono caja fuerte ("Cuentas
claras", pág. 5), icono apretón de manos ("Confianza mutua", pág. 6).

---

## 3. ENFOQUE-AL-CLIENTE (`img/ENFOQUE-AL-CLIENTE/`)

| Ruta original en disco | Contenido real verificado | Nombre limpio propuesto | Página(s) PDF | Notas |
|---|---|---|---|---|
| `BOTON-INNOVACION.png` | Foto real de checkout de tienda ("Pague Aquí", 1669x1898) | `/assets/img/enfoque/foto-tienda-checkout.jpg` | posible fondo de escenario (11) | Foto de contenido, no botón — verificar contra pág. 11 |
| `ICONO-DIALOGO.png` | Círculo amarillo chico play, 447x447 | `/assets/img/global/boton-play-circular-chico.png` | reproductor de audio | GLOBAL (duplicado) |
| `ICONO-RAYO.png` | Rectángulo gris liso, 3738x2087 | `/assets/img/global/placeholder-video-gris.png` | 11 (fondo video) | GLOBAL (duplicado) |
| `IMAGEN-ENFOQUE-DER.png` | Botón píldora "INICIAR DESAFIO" | `/assets/img/global/boton-iniciar-desafio.png` | 10 | GLOBAL |
| `IMAGEN-ENFOQUE-IZQ.png` | **Icono de diálogo** (burbuja de chat rosa, 3 puntos) | `/assets/img/enfoque/icono-dialogo-escucha-activa.png` | 14 | Icono real de la tarjeta "Escucha activa" |
| `boton-iniciar (1).png` | Círculo amarillo chico play, 374x375 | `/assets/img/global/boton-play-circular-chico-2.png` | reproductor de audio | GLOBAL (duplicado) |
| `boton-play.png` | **Icono de rayo** (relámpago blanco/amarillo/naranja) | `/assets/img/enfoque/icono-rayo-agilidad.png` | 13 | Icono real de la tarjeta "Agilidad sin fricción" |
| `flecha-avanzar (1).png` | Panel degradado amarillo→negro, 1840x2014 | `/assets/img/global/panel-degradado-chico.png` | — | GLOBAL (mismo caso que en Honestidad) |
| `fondo-cajas (1).png` | Botón píldora amarillo "Innovación" | `/assets/img/enfoque/boton-siguiente-innovacion.png` | 16 | Botón de transición al siguiente módulo, cierre de Enfoque al Cliente |
| `fondo-gris-video (1).png` | Círculo amarillo chico flecha-atrás (◀), 396x449 | `/assets/img/global/boton-flecha-atras-chico.png` | navegación | GLOBAL |

**Icono de carrusel FALTANTE:** carita feliz sonriente ("Contacto humano", pág. 12) — no existe
como archivo en esta carpeta.

---

## 4. COMO-INNOVO (`img/COMO-INNOVO/`) — módulo "Innovación"

| Ruta original en disco | Contenido real verificado | Nombre limpio propuesto | Página(s) PDF | Notas |
|---|---|---|---|---|
| `BOTON-RESPONSABILIDAD.png` | **Icono PC + engranaje** (monitor azul, gear blanco) | `/assets/img/innovacion/icono-pc-cero-resistencia.png` | 18 | Icono real de la tarjeta "Cero resistencia" |
| `ICONO-BOMBILLO.png` | Botón píldora amarillo "Responsabilidad" | `/assets/img/innovacion/boton-siguiente-responsabilidad.png` | 22 | Botón de transición al siguiente módulo, cierre de Innovación |
| `ICONO-FLECHA.png` | **Icono de bombillo** (foco amarillo/negro) | `/assets/img/innovacion/icono-bombillo-maestria.png` | 19 | Icono real de la tarjeta "Maestría técnica" |
| `ICONO-PC.png` | Rectángulo gris liso, 3738x2087 | `/assets/img/global/placeholder-video-gris.png` | 17 (fondo video) | GLOBAL (duplicado) |
| `IMAGEN-INNOVACION-DER.png` | **Icono flecha circular hacia arriba** (círculo amarillo, flecha blanca) | `/assets/img/innovacion/icono-flecha-propon-mejoras.png` | 20 | Icono real de la tarjeta "Propón mejoras" |
| `IMAGEN-INNOVACION-IZQ.png` | Foto real de checkout de tienda ("Pague Aquí") | `/assets/img/innovacion/foto-tienda-checkout.jpg` | posible fondo escenario (17) | Foto de contenido |
| `boton-iniciar.png` | Círculo amarillo chico play, 447x447 | `/assets/img/global/boton-play-circular-chico.png` | reproductor de audio | GLOBAL (duplicado) |
| `flecha-atras.png` | Panel degradado amarillo→negro, 1840x2014 | `/assets/img/global/panel-degradado-chico.png` | — | GLOBAL |
| `flecha-avanzar.png` | Círculo amarillo chico flecha-atrás (◀) — dirección incorrecta para su nombre | `/assets/img/global/boton-flecha-atras-chico.png` | navegación | GLOBAL |
| `fondo-cajas.png` | Círculo amarillo chico play (▶), 374x375 | `/assets/img/global/boton-play-circular-chico-2.png` | reproductor de audio | GLOBAL (duplicado) |
| `fondo-gris-video.png` | Botón píldora amarillo "INICIAR DESAFIO" | `/assets/img/global/boton-iniciar-desafio.png` | 17 (loading Innovación) | GLOBAL |

Sin iconos faltantes en este módulo (los 3 iconos de carrusel existen, mal nombrados).

---

## 5. RESPONSABILIDAD (`img/RESPONSABILIDAD/`)

| Ruta original en disco | Contenido real verificado | Nombre limpio propuesto | Página(s) PDF | Notas |
|---|---|---|---|---|
| `BOTON-EXCELENCIA.png` | **Icono de mano/pulgar arriba** (círculo púrpura) | `/assets/img/responsabilidad/icono-mano-hazte-cargo.png` | 27 | Icono real de la tarjeta "Hazte cargo" |
| `ICONO-ESCUDO.png` | Panel degradado amarillo→negro, 1840x2014 | `/assets/img/global/panel-degradado-chico.png` | — | GLOBAL |
| `ICONO-MANO.png` | Círculo amarillo chico play, 374x375 | `/assets/img/global/boton-play-circular-chico-2.png` | reproductor de audio | GLOBAL (duplicado) |
| `ICONO-RELOJ.png` | Rectángulo gris liso, 3738x2087 | `/assets/img/global/placeholder-video-gris.png` | 23 (fondo video) | GLOBAL (duplicado) |
| `IMAGEN-RESPONSABILIDAD-DER.png` | Botón píldora amarillo "Excelencia Operacional" | `/assets/img/responsabilidad/boton-siguiente-excelencia.png` | 29 | Botón de transición al siguiente módulo, cierre de Responsabilidad |
| `IMAGEN-RESPONSABILIDAD-IZQ.png` | **Icono de reloj** (esfera analógica, marco dorado) | `/assets/img/responsabilidad/icono-reloj-puntualidad.png` | 26 | Icono real de la tarjeta "Puntualidad de héroe" |
| `boton-iniciar (3).png` | Círculo amarillo chico flecha-atrás (◀), 447x447 | `/assets/img/global/boton-flecha-atras-chico.png` | navegación | GLOBAL |
| `boton-play (1).png` | **Icono de escudo con check** (rojo, chispa) | `/assets/img/responsabilidad/icono-escudo-higiene.png` | 25 | Icono real de la tarjeta "Higiene impecable" |
| `flecha-avanzar (3).png` | Botón píldora amarillo "INICIAR DESAFIO" | `/assets/img/global/boton-iniciar-desafio.png` | 24 (loading Responsabilidad) | GLOBAL |
| `fondo-cajas (3).png` | Foto real de mostrador Pronto Café | `/assets/img/responsabilidad/foto-tienda-mostrador.jpg` | posible fondo escenario (23) | Foto de contenido |
| `fondo-gris-video (3).png` | Círculo amarillo chico play (▶), 447x447 | `/assets/img/global/boton-play-circular-chico.png` | reproductor de audio | GLOBAL (duplicado) |

Sin iconos faltantes en este módulo (los 3 iconos de carrusel existen, mal nombrados).

---

## 6. EXCELENCIA-OPERACIONAL (`img/EXCELENCIA-OPERACIONAL/`)

| Ruta original en disco | Contenido real verificado | Nombre limpio propuesto | Página(s) PDF | Notas |
|---|---|---|---|---|
| `BOTON-FINALIZAR-DESAFIO.png` | Círculo amarillo chico flecha-atrás (◀) | `/assets/img/global/boton-flecha-atras-chico.png` | navegación | GLOBAL |
| `ICONO-CHECK.png` | Panel degradado amarillo→negro, 1840x2014 | `/assets/img/global/panel-degradado-chico.png` | — | GLOBAL |
| `ICONO-OBJETIVO.png` | Botón píldora amarillo "INICIAR DESAFIO" | `/assets/img/global/boton-iniciar-desafio.png` | 31 (loading Excelencia) | GLOBAL |
| `IMAGEN-EXCELENCIA-DER.png` | Foto real de anaqueles con marca Pronto | `/assets/img/excelencia/foto-tienda-anaqueles.jpg` | posible fondo escenario (30) | Foto de contenido |
| `IMAGEN-EXCELENCIA-IZQ.png` | **Icono de diana/objetivo** (círculos azules, flecha) | `/assets/img/excelencia/icono-objetivo-cero-errores.png` | 32 | Icono real de la tarjeta "Cero errores" |
| `boton-iniciar (4).png` | Rectángulo gris/pálido liso, 3738x2087 | `/assets/img/global/placeholder-video-gris.png` | 30 (fondo video) | GLOBAL (duplicado; tono ligeramente distinto a los otros, verificar) |
| `boton-play (2).png` | Botón píldora amarillo "Finalizar desafío" | `/assets/img/excelencia/boton-finalizar-desafio.png` | 36 | Botón de acción final del cierre de Excelencia Operacional |
| `flecha-atras (2).png` | Círculo amarillo chico play (▶), 447x447 | `/assets/img/global/boton-play-circular-chico.png` | reproductor de audio | GLOBAL (duplicado) |
| `flecha-avanzar (4).png` | **Icono de estantería** (anaquel con productos de colores) | `/assets/img/excelencia/icono-estanteria-sin-atajos.png` | 34 | Icono real de la tarjeta "Sin atajos" |
| `fondo-cajas (4).png` | Círculo amarillo chico play (▶), 374x375 | `/assets/img/global/boton-play-circular-chico-2.png` | reproductor de audio | GLOBAL (duplicado) |
| `fondo-gris-video (4).png` | **Icono de check verde** (círculo, chispas) | `/assets/img/excelencia/icono-check-orden-constante.png` | 33 | Icono real de la tarjeta "Orden constante" |

Sin iconos faltantes en este módulo (los 3 iconos de carrusel existen, mal nombrados).

---

## 7. Assets GLOBALES / compartidos — resumen y justificación

Confirmado por inspección visual (contenido pixel-equivalente repetido en varias carpetas, y/o
uso idéntico repetido en el PDF en las pantallas de todos los módulos):

| Rol | Origen físico recomendado (primera aparición útil) | Justificación |
|---|---|---|
| Logo "Pronto" | `INICIO/MUJER-1 (1).png` | Único logo en el proyecto; aparece en splash y en las 6 pantallas de cierre |
| Medalla de cierre (grabada "HONESTIDAD") | `HONESTIDAD/play-boton.png` | Única medalla en el proyecto; el PDF la reutiliza sin cambios en los 6 cierres — **ver pregunta abierta 0.3** |
| Fondo de pantalla de cierre (degradado amarillo→negro completo) | `HONESTIDAD/fondo-boton-amarillo.png` | Única imagen de este tamaño (3778x2109) en el proyecto |
| Placeholder gris de video | `HONESTIDAD/medalla.png` (o equivalente en cualquier carpeta, son idénticos) | Mismo contenido pixel-a-pixel repetido en las 5 carpetas bajo 5 nombres distintos |
| Botón píldora "INICIAR DESAFIO" | `HONESTIDAD/flecha-atras (1).png` | Mismo contenido repetido en las 5 carpetas (pantallas de loading) |
| Botón circular play (grande, ~588-999px) | `HONESTIDAD/flecha-avanzar (2).png` | Repetido en placeholders de video de escenario |
| Botón circular play (chico, ~374-447px) — 2 variantes duplicadas | varias | Repetido en controles de reproductor de audio de todas las tarjetas |
| Botón circular flecha-atrás (chico) | `HONESTIDAD/BOTON-ENFOQUE-AL-CLIENTE.png` | Repetido en navegación de mini-carrusel de todas las tarjetas |
| Panel degradado amarillo→negro chico (1840x2014, sin texto) | `HONESTIDAD/boton-iniciar (2).png` | Repetido idéntico en las 5 carpetas; rol exacto en el PDF sin confirmar (posible asset de trabajo no usado directamente) |

**Nota importante:** cada uno de estos "duplicados idénticos" existe físicamente 5 veces (una
copia por carpeta de valor) con 5 nombres de archivo distintos y aleatorios. Para el proyecto de
código conviene tratarlos como un solo asset global y elegir UNA sola copia física como fuente
(las copias son visualmente intercambiables), en vez de mantener 5 copias redundantes.

---

## 8. Preguntas abiertas — RESUELTAS (2026-08-14, confirmado por el usuario)

1. **Medalla única**: se replica tal cual el PDF — la misma `medalla-cierre.png` (grabada
   "HONESTIDAD") se usa en los 6 cierres de módulo. No se encargan medallas nuevas.
2. **Iconos faltantes**: se usan placeholders SVG propios (ver §9) mientras se entregan los
   assets reales. Nombres esperados de reemplazo documentados ahí mismo.
3. **Textura de fondo del splash**: se recrea en CSS/SVG (degradado + patrón lineal decorativo),
   no existe como archivo.
4. **Pantalla final (pág. 37)**: sin botón visible, tal como el PDF. El SCORM marca
   `completed`/`Terminate` automáticamente al llegar a esta vista, sin requerir clic.
5. **Encabezado distinto en Excelencia Operacional**: se replica tal cual ("Tips de Excelencia
   operacional"), fidelidad al PDF por encima de la unificación.

## 9. Rutas finales usadas en el proyecto (`/assets/img/...`)

Todos los archivos fueron copiados (no movidos ni renombrados en `img/` original) a rutas limpias
según el contenido real verificado en este documento. Fuente de verdad de "qué archivo original
contiene qué imagen" = tablas de las secciones 1-6 arriba.

- `/assets/img/global/` — logo-pronto.png, medalla-cierre.png, fondo-cierre-degradado.png,
  placeholder-video-gris.png, boton-iniciar-desafio.png, boton-play-circular-grande.png,
  boton-play-circular-chico.png, boton-play-circular-chico-2.png, boton-flecha-atras-grande.png,
  boton-flecha-atras-chico.png, panel-degradado-chico.png (rol exacto sin confirmar, ver nota §7)
- `/assets/img/inicio/` — foto-mujer.jpg, foto-hombre.png
- `/assets/img/honestidad/` — icono-regalo-beneficios.png, boton-siguiente-enfoque.png
- `/assets/img/enfoque/` — foto-tienda-checkout.jpg, icono-dialogo-escucha-activa.png,
  icono-rayo-agilidad.png, boton-siguiente-innovacion.png
- `/assets/img/innovacion/` — icono-pc-cero-resistencia.png, icono-bombillo-maestria.png,
  icono-flecha-propon-mejoras.png, boton-siguiente-responsabilidad.png, foto-tienda-checkout.jpg
- `/assets/img/responsabilidad/` — icono-escudo-higiene.png, icono-reloj-puntualidad.png,
  icono-mano-hazte-cargo.png, boton-siguiente-excelencia.png, foto-tienda-mostrador.jpg
- `/assets/img/excelencia/` — icono-objetivo-cero-errores.png, icono-check-orden-constante.png,
  icono-estanteria-sin-atajos.png, boton-finalizar-desafio.png, foto-tienda-anaqueles.jpg
- `/assets/img/faltantes/` — 4 iconos placeholder SVG propios (ver detalle abajo), a reemplazar
  por el asset final del diseñador cuando esté disponible, manteniendo el mismo nombre de archivo:
  - `icono-etiqueta-precios-claros.svg` → Honestidad, tarjeta 1 "Precios claros"
  - `icono-caja-fuerte-cuentas-claras.svg` → Honestidad, tarjeta 2 "Cuentas claras"
  - `icono-apreton-manos-confianza-mutua.svg` → Honestidad, tarjeta 3 "Confianza mutua"
  - `icono-carita-feliz-contacto-humano.svg` → Enfoque al Cliente, tarjeta 1 "Contacto humano"

**Para reemplazar un placeholder por el asset real**: entregar el PNG/SVG final con el mismo
nombre de archivo en la misma ruta — el HTML no necesita tocarse.
