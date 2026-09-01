# Análisis de diseño — "Pronto: Héroes del Instante"

Análisis del PDF de diseño objetivo (`guia-pronto-valores.pdf`, 37 páginas / vistas 1920x1080,
renderizadas con PyMuPDF a 1.5x para inspección). Documento de referencia para la codificación
posterior del módulo SCORM. **No se ha escrito ningún HTML/CSS/JS.**

---

## 0. HALLAZGOS CRÍTICOS A CONFIRMAR ANTES DE CODEAR

### 0.1 Los nombres de archivo en `img/` NO corresponden a su contenido visual real
Verificado exhaustivamente (contact sheets con Pillow + lectura individual de cada PNG) en las
6 carpetas. El nombre del archivo y la imagen que contiene están sistemáticamente desalineados —
parece que, al exportar, dos listas (nombres vs. imágenes) quedaron emparejadas con un desfase.
Ejemplos (ver tabla completa en `ASSETS-MAP.md`):

| Archivo (nombre en disco) | Lo que su nombre sugiere | Lo que REALMENTE contiene |
|---|---|---|
| `INICIO/Fondo-inicio (1).jpg` | Textura de fondo | Foto de la mujer (uniforme Pronto) |
| `INICIO/LOGO-PRONTO (1).png` | Logotipo "Pronto" | Foto del hombre (uniforme Pronto) |
| `INICIO/MUJER-1 (1).png` | Foto de mujer | Logotipo "Pronto" (script) |
| `HONESTIDAD/icono-regalo.png` | Icono de regalo | Botón píldora "Enfoque al Cliente" |
| `HONESTIDAD/fondo-gris-video (2).png` | Placeholder gris de video | Icono de regalo (verde/rojo) |
| `HONESTIDAD/play-boton.png` | Botón de play | Medalla dorada "HONESTIDAD" |
| `HONESTIDAD/medalla.png` | Medalla | Rectángulo gris liso (placeholder video) |
| `HONESTIDAD/BOTON-ENFOQUE-AL-CLIENTE.png` | Botón "Enfoque al Cliente" | Botón circular flecha-atrás (◀) |

Este mismo patrón se repite, con variaciones distintas, en `ENFOQUE-AL-CLIENTE`, `COMO-INNOVO`,
`RESPONSABILIDAD` y `EXCELENCIA-OPERACIONAL`. **No se debe asumir nunca que el nombre del
archivo describe su contenido.** El mapeo correcto verificado archivo-por-archivo está en
`ASSETS-MAP.md`. No se renombró ningún archivo en disco (solo análisis).

### 0.2 Faltan iconos de tarjetas de carrusel para 2 de los 5 módulos
Cada módulo tiene un carrusel de "tarjetas de audio" con un icono cuadrado distinto por tarjeta.
Contando cuántos iconos ÚNICOS usa cada módulo en el PDF, y verificando cuáles existen realmente
en disco (aunque sea con nombre incorrecto):

- **Honestidad** (4 tarjetas: etiqueta/aguacate "Precios claros", caja fuerte "Cuentas claras",
  apretón de manos "Confianza mutua", regalo "Beneficios para el cliente"): **solo el icono de
  regalo existe en disco** (mal nombrado como `fondo-gris-video (2).png`). Los iconos de
  etiqueta/aguacate, caja fuerte y apretón de manos **no existen como archivo** en `img/HONESTIDAD`.
- **Enfoque al Cliente** (3 tarjetas: carita feliz "Contacto humano", rayo "Agilidad sin
  fricción", diálogo "Escucha activa"): el rayo y el diálogo sí existen (mal nombrados como
  `boton-play.png` e `IMAGEN-ENFOQUE-IZQ.png`), pero **el icono de carita feliz no existe** en
  `img/ENFOQUE-AL-CLIENTE`.
- **Innovación** (3 tarjetas: PC+engranaje "Cero resistencia", bombillo "Maestría técnica",
  flecha circular "Propón mejoras"): las 3 existen en disco (mal nombradas). Sin faltantes.
- **Responsabilidad** (3 tarjetas: escudo "Higiene impecable", reloj "Puntualidad de héroe",
  mano/pulgar "Hazte cargo"): las 3 existen en disco (mal nombradas). Sin faltantes.
- **Excelencia Operacional** (3 tarjetas: diana "Cero errores", check verde "Orden constante",
  estantería "Sin atajos"): las 3 existen en disco (mal nombradas). Sin faltantes.

**Acción requerida del usuario:** decidir si se generan/consiguen los 4 iconos faltantes
(etiqueta-aguacate, caja fuerte, apretón de manos, carita feliz) o si se sustituyen por iconos
genéricos equivalentes disponibles (p. ej. de una librería de iconos) antes de codear esas
pantallas.

### 0.3 La medalla de cierre es un ÚNICO asset compartido, y su texto grabado dice siempre "HONESTIDAD"
Solo existe **una** medalla en todo el proyecto (`img/HONESTIDAD/play-boton.png`, 1136x1247,
oro con balanza, ojo y texto "HONESTIDAD" grabado en el propio PNG). El PDF confirma que esta
MISMA imagen se usa, sin cambios, en las 5 pantallas de cierre de módulo (páginas 9, 16, 22, 29,
36) y en la pantalla final (página 37) — es decir, el propio mockup de diseño muestra la medalla
"HONESTIDAD" al cerrar Enfoque al Cliente, Innovación, Responsabilidad y Excelencia Operacional,
lo cual es casi con certeza un error de la maqueta (o una decisión deliberada de usar una medalla
"genérica"). El texto está pintado dentro del PNG, no es editable por CSS.

**Pregunta obligatoria para el usuario:** ¿se debe encargar/generar una medalla distinta por
cada valor (Enfoque al Cliente, Innovación, Responsabilidad, Excelencia Operacional), o se
usa intencionalmente la misma medalla "HONESTIDAD" en las 5 pantallas de cierre (replicando
literalmente lo que muestra el PDF)? Esto determina si faltan 4 assets más.

### 0.4 Otros assets confirmados como GLOBALES/compartidos (ver detalle y justificación en ASSETS-MAP.md)
- El **degradado amarillo→negro de pantalla completa** de las pantallas de cierre
  (`HONESTIDAD/fondo-boton-amarillo.png`, 3778x2109) — imagen única en todo el proyecto, se
  repite visualmente en todas las pantallas de cierre del PDF.
- El **placeholder gris de video** (rectángulo liso ~#656565 con esquinas redondeadas,
  3738x2087) aparece, con contenido pixel-idéntico, una vez por carpeta bajo un nombre distinto
  cada vez (`HONESTIDAD/medalla.png`, `ENFOQUE-AL-CLIENTE/ICONO-RAYO.png`,
  `COMO-INNOVO/ICONO-PC.png`, `RESPONSABILIDAD/ICONO-RELOJ.png`,
  `EXCELENCIA-OPERACIONAL/boton-iniciar (4).png`) — es un solo asset reutilizado.
- Los **botones de navegación genéricos** (play circular, flechas prev/next circulares, píldora
  "INICIAR DESAFIO", panel degradado 1840x2014) también se repiten idénticos en cada carpeta con
  nombres distintos — son componentes de UI reutilizables, no artwork específico de cada valor.

### 0.5 Variación de encabezado en Excelencia Operacional
Los carruseles de Honestidad/Enfoque/Innovación/Responsabilidad usan el encabezado
"¿Cómo aplico mi [valor]?" en el panel izquierdo. Excelencia Operacional usa en cambio
**"Tips de Excelencia operacional"** (páginas 32-35), rompiendo el patrón textual — confirmar si
es intencional o un descuido del diseñador.

### 0.6 Pantalla final (página 37): sin botón de continuar/reinicio
La pantalla final "¡Felicidades, Héroe del instante!" **no tiene ningún botón visible** (ni
"Reiniciar" ni "Salir" ni "Continuar") — layout idéntico a las pantallas de cierre de módulo
(medalla + logo + texto) pero sin la cápsula amarilla de acción. Confirmar con el usuario si el
SCORM debe agregar un botón funcional (p. ej. `LMSFinish`/cerrar) aunque el diseño visual no lo
muestre explícitamente.

### 0.7 Tarjeta "historia" del carrusel: posición del icono activo
En las pantallas de "historia/testimonio" (última tarjeta de cada carrusel: Carlos, Elena, Luis,
Gabriel, Marta), el mini-carrusel del panel izquierdo no siempre muestra el icono de la última
tarjeta temática como "activo" — en Honestidad (pág. 8) el icono activo en la historia es el de
la tarjeta 1 (etiqueta/aguacate), no el de la tarjeta 4 (regalo). Confirmar el comportamiento
esperado del carrusel en la pantalla de historia (¿repite el último icono, o vuelve al primero,
o no importa porque es una pantalla aparte sin navegación funcional del carrusel?).

---

## 1. Paleta de colores (hex aproximados, muestreados sobre los renders del PDF)

| Nombre de uso | Hex aprox. | Dónde aparece |
|---|---|---|
| `amarillo-primario` | `#FFCE11` / `#FDC806` | Fondos de tarjetas, botones, acentos, splash |
| `amarillo-dorado-cierre` | `#F6C103` (degradado hacia negro) | Fondo pantallas de cierre |
| `negro-carbón` | `#000000` – `#101010` | Fondos oscuros, texto sobre amarillo, cajas de texto splash |
| `gris-video-placeholder` | `#656565` (aprox `#666666`) | Fondo del reproductor de video placeholder |
| `blanco` | `#FFFFFF` | Texto sobre fondos oscuros/tarjetas de audio |
| `dorado-medalla` | `#B8860B`–`#D4AF37` (metálico, con degradado) | Medalla de cierre |
| `rosa-magenta` (icono diálogo) | `#E91E63` aprox | Icono "Escucha activa" |
| `azul-claro` (icono PC innovación) | `#5BC8E8` aprox | Icono "Cero resistencia" |
| `rojo-escudo` | `#F44336` aprox | Icono "Higiene impecable" |
| `verde-check` | `#4CAF50` aprox | Icono "Orden constante" |
| `azul-diana` | `#2E7BC4` aprox | Icono "Cero errores" |

Nota: los hex de iconos ilustrados son aproximaciones visuales (ilustraciones flat-design multicolor);
para producción se recomienda tomarlos directamente de los PNG (que sí tienen transparencia real)
en vez de recodificarlos como CSS. La paleta funcional del sistema (UI, botones, textos) es
esencialmente **amarillo dorado + negro + blanco + gris neutro**, con los iconos de cada tarjeta
aportando color puntual.

---

## 2. Tipografías

- **Títulos / logotipo "Pronto"**: fuente script/brush con efecto 3D metálico (bisel negro con
  brillo), es un logotipo tratado gráficamente, no un font de sistema — se debe tratar como
  imagen/logo, no recrear con Google Fonts.
- **Títulos de pantalla y botones** ("¿Cómo aplico mi honestidad?", "INICIAR DESAFIO",
  "Enfoque al Cliente", etc.): sans-serif geométrica, muy redondeada, peso bold/extrabold.
  Se parece mucho a **Baloo 2** o **Fredoka** (Google Fonts) — ambas comparten esas terminales
  redondeadas y el peso grueso característico del texto en las tarjetas y botones.
- **Cuerpo de texto** (subtítulos, párrafos de historia/testimonio, labels de controles):
  sans-serif también redondeada pero más neutra/legible en párrafos largos — compatible con
  **Poppins** o **Fredoka** en peso semibold/medium. Dado que tanto títulos como cuerpo comparten
  la misma familia visual redondeada, es razonable usar **una sola familia (Fredoka o Baloo 2)**
  en distintos pesos para todo el proyecto, en vez de combinar dos fonts distintas.
- Confirmar con el usuario la elección final entre Baloo 2 / Fredoka antes de codear, ya que
  no hay metadata de fuente incrustada en el PDF (es un render plano).

---

## 3. Espaciados, proporciones y estilo visual del sistema

- **Lienzo**: 1920x1080 fijo por vista (cada página del PDF = una pantalla completa).
- **Tarjetas de contenido** (escenario, carrusel): esquinas muy redondeadas (~24-32px a escala
  1920px), fondo con degradado diagonal/vertical amarillo brillante → amarillo oscuro/negro hacia
  abajo, sin borde visible, sombra suave hacia afuera.
- **Iconos de tarjeta** (dentro del carrusel y como thumbnails de mini-carrusel): cuadrados
  negros con esquinas redondeadas (~16-20px), el icono ilustrado centrado con márgen generoso.
- **Layout de dos columnas** (escenario y carrusel): panel izquierdo ~45% del ancho, panel
  derecho ~45% del ancho, con separador — en el escenario es un hueco/gap simple; en el carrusel
  es una línea vertical amarilla delgada centrada.
- **Botones**: cápsula (pill, radio = 50% de la altura), amarillo con brillo/highlight superior,
  borde negro fino, texto negro bold centrado. Los botones circulares (play, flechas prev/next)
  llevan el mismo tratamiento: amarillo con brillo, borde negro, icono negro.
- **Placeholder de video**: rectángulo gris (~#656565) esquinas redondeadas, con foto de tienda
  Pronto de fondo (difuminada/oscurecida) + botón play circular grande centrado + scrubber
  (barra) amarilla en la parte inferior con thumb circular negro.
- **Reproductor de audio** (panel derecho del carrusel): tarjeta amarilla degradada, icono
  cuadrado negro grande arriba, título del track debajo, fila de controles (repetir, anterior,
  play/pausa grande, siguiente, aleatorio) en blanco/negro, barra de progreso amarilla con
  duración "0:45" fija como texto de ejemplo en todas las tarjetas.
- **Overlay de texto sobre foto** (tarjetas de escenario): scrim oscuro semitransparente en el
  tercio inferior de la imagen para legibilidad del título blanco + subtítulo.
- **Pantalla de cierre**: fondo a pantalla completa con degradado amarillo (arriba) → negro
  (abajo), medalla a la izquierda (~25% ancho) sobre panel negro redondeado, logo "Pronto"
  arriba a la derecha, título y subtítulo centrados/alineados a la derecha, botón cápsula debajo.

---

## 4. Tabla completa de las 37 vistas

| # | Módulo | Tipo de pantalla | Resumen de contenido | Assets usados (nombre real en disco, ver notas de contenido real en ASSETS-MAP.md) |
|---|---|---|---|---|
| 1 | Inicio | Splash / portada | Logo "Pronto", frase "Héroes del instante: solo hacemos que suceda", "¡Tu turno está por comenzar!", "Entra y descubre los superpoderes que llevas dentro.", botón play circular, 2 personas (mujer y hombre) uniforme Pronto | `INICIO/MUJER-1 (1).png` (logo real), `INICIO/Fondo-inicio (1).jpg` (foto mujer real), `INICIO/LOGO-PRONTO (1).png` (foto hombre real) |
| 2 | Honestidad | b) Loading | "INICIAR DESAFIO" sobre fondo gris + barra de progreso | pill "INICIAR DESAFIO" real = `flecha-atras (1).png` |
| 3 | Honestidad | a) Escenario/pregunta | "Cómo actúas cuando nadie te observa?" / "El verdadero valor de un héroe se nota cuando nadie lo está mirando. ¡Descubre tu primer superpoder!" + placeholder video | fotos de tienda (no en `img/`, son fotografías embebidas de stock/tienda real, no recortadas) + iconos "?" 3D |

**CORRECCIÓN (2026-08-14, verificado visualmente contra el PDF real):** el orden
original de esta tabla tenía loading y escenario invertidos para Honestidad
(decía escenario=2, loading=3). El orden REAL en el PDF es loading (pág. 2)
→ escenario (pág. 3) — igual patrón que Enfoque al Cliente (loading antes que
escenario). Ya corregido en `index.html`. Verificar este mismo orden al
construir Innovación/Responsabilidad/Excelencia en vez de asumir la tabla
original.

**Hallazgo adicional confirmado (2026-08-14):** el panel derecho del
escenario (placeholder de video) SÍ tiene un asset real reutilizable: es la
misma foto "Pague Aquí" (`assets/img/enfoque/foto-tienda-checkout.jpg`,
duplicada en `innovacion/`) en los escenarios de Honestidad y Enfoque al
Cliente al menos — tratarla como asset global de fondo/poster del video en
todos los módulos. El panel IZQUIERDO (pregunta), en cambio, es una foto
compuesta única por valor (empleado + gráfico 3D flotante: signos de
interrogación en Honestidad, relojes/arena en Enfoque, etc.) que NO existe
como archivo recortado en ninguna carpeta — decisión confirmada con el
usuario: reutilizar como fondo genérico las fotos de tienda reales ya
disponibles (mostrador/checkout/anaqueles) con scrim oscuro, en vez de dejar
el panel liso o esperar los assets reales.
| 4 | Honestidad | c) Carrusel 1/5 | "¿Cómo aplico mi honestidad?" → tarjeta "Precios claros" (icono etiqueta/aguacate) | icono etiqueta/aguacate **NO existe en disco** |
| 5 | Honestidad | c) Carrusel 2/5 | "Cuentas claras" (icono caja fuerte) | icono caja fuerte **NO existe en disco** |
| 6 | Honestidad | c) Carrusel 3/5 | "Confianza mutua" (icono apretón de manos) | icono apretón de manos **NO existe en disco** |
| 7 | Honestidad | c) Carrusel 4/5 | "Beneficios para el cliente" (icono regalo) | icono regalo real = `fondo-gris-video (2).png` |
| 8 | Honestidad | c) Carrusel 5/5 — Historia | Testimonio largo de "Carlos" sobre honestidad en caja | mismo panel, sin icono nuevo |
| 9 | Honestidad | d) Cierre | Medalla "HONESTIDAD", "Tu superpoder asegurado: ¡Honestidad!", subtítulo, botón "Enfoque al Cliente" | medalla real = `play-boton.png`; botón real = `icono-regalo.png` |
| 10 | Enfoque al Cliente | b) Loading | "INICIAR DESAFIO" + barra progreso | pill real = `IMAGEN-ENFOQUE-DER.png` |
| 11 | Enfoque al Cliente | a) Escenario/pregunta | "¿Un cliente difícil o un héroe sin capa en un mal día?" / relojes 3D flotando, hombre mirando reloj en fila | fotos stock embebidas |
| 12 | Enfoque al Cliente | c) Carrusel 1/3 | "Contacto humano" (icono carita feliz) | icono carita feliz **NO existe en disco** |
| 13 | Enfoque al Cliente | c) Carrusel 2/3 | "Agilidad sin fricción" (icono rayo) | icono rayo real = `boton-play.png` |
| 14 | Enfoque al Cliente | c) Carrusel 3/3 | "Escucha activa" (icono diálogo rosa) | icono diálogo real = `IMAGEN-ENFOQUE-IZQ.png` |
| 15 | Enfoque al Cliente | c) Historia | Testimonio de "Elena" sobre enfoque al cliente | — |
| 16 | Enfoque al Cliente | d) Cierre | Medalla "HONESTIDAD" (reutilizada), "¡Tu superpoder asegurado: Enfoque al Cliente!", botón "Innovación" | medalla real = `HONESTIDAD/play-boton.png`; botón real = `fondo-cajas (1).png` |
| 17 | Innovación | a) Escenario/pregunta | "¿La tecnología es un obstáculo o tu mejor aliada en el turno?" | fotos stock embebidas |
| 18 | Innovación | c) Carrusel 1/3 | "Cero resistencia" (icono PC + engranaje) | icono real = `BOTON-RESPONSABILIDAD.png` |
| 19 | Innovación | c) Carrusel 2/3 | "Maestría técnica" (icono bombillo) | icono real = `ICONO-FLECHA.png` |
| 20 | Innovación | c) Carrusel 3/3 | "Propón mejoras" (icono flecha circular arriba) | icono real = `IMAGEN-INNOVACION-DER.png` |
| 21 | Innovación | c) Historia | Testimonio de "Luis" sobre innovación (hornos UNOX) | — |
| 22 | Innovación | d) Cierre | Medalla "HONESTIDAD" (reutilizada), "¡Tu superpoder asegurado: Innovación!", botón "Responsabilidad" | botón real = `boton-play (2).png`? (ver ASSETS-MAP) |
| 23 | Responsabilidad | a) Escenario/pregunta | "¿Tu estación refleja tu nivel de compromiso profesional?" | fotos stock embebidas |
| 24 | Responsabilidad | b) Loading | "INICIAR DESAFIO" + barra progreso | — |
| 25 | Responsabilidad | c) Carrusel 1/3 | "Higiene impecable" (icono escudo+check) | icono real = `boton-play (1).png` |
| 26 | Responsabilidad | c) Carrusel 2/3 | "Puntualidad de héroe" (icono reloj) | icono real = `IMAGEN-RESPONSABILIDAD-IZQ.png` |
| 27 | Responsabilidad | c) Carrusel 3/3 | "Hazte cargo" (icono pulgar arriba) | icono real = `BOTON-EXCELENCIA.png` |
| 28 | Responsabilidad | c) Historia | Testimonio de "Gabriel" sobre responsabilidad (etiqueta mal fechada) | — |
| 29 | Responsabilidad | d) Cierre | Medalla "HONESTIDAD" (reutilizada), "¡Tu superpoder asegurado: Responsabilidad!", botón "Excelencia Operacional" | — |
| 30 | Excelencia Operacional | a) Escenario/pregunta | "¿Haces tu mejor trabajo cuando nadie te está vigilando?" | fotos stock embebidas |
| 31 | Excelencia Operacional | b) Loading | "INICIAR DESAFIO" + barra progreso | — |
| 32 | Excelencia Operacional | e) Carrusel 1/3 | Encabezado distinto: "Tips de Excelencia operacional" → "Cero errores" (icono diana) | icono real = `IMAGEN-EXCELENCIA-IZQ.png` |
| 33 | Excelencia Operacional | e) Carrusel 2/3 | "Orden constante" (icono check verde) | icono real = `fondo-gris-video (4).png` |
| 34 | Excelencia Operacional | e) Carrusel 3/3 | "Sin atajos" (icono estantería) | icono real = `flecha-avanzar (4).png` |
| 35 | Excelencia Operacional | e) Historia | Testimonio de "Marta" sobre excelencia (turno de medianoche) — mismo encabezado "Tips de Excelencia operacional" | — |
| 36 | Excelencia Operacional | d) Cierre | Medalla "HONESTIDAD" (reutilizada), "¡Tu superpoder asegurado: Excelencia Operacional!", botón "Finalizar desafío" | — |
| 37 | Cierre final | Pantalla de felicitación | "¡Felicidades, Héroe del instante!" resumen de los 5 valores, **sin botón visible** | medalla real = `play-boton.png` (misma, "HONESTIDAD") |

Nota: en las filas donde el "asset real" no se especifica explícitamente, la pantalla reutiliza los
mismos botones/componentes de UI genéricos documentados en la sección 0.4 y en `ASSETS-MAP.md`.

---

## 4.1 CORRECCIÓN DE ARQUITECTURA (2026-08-14, confirmado por el usuario)

Las tarjetas del carrusel (4 tips + historia en Honestidad, 3 tips + historia
en los demás módulos) **NO son vistas verticales separadas** dentro del motor
de gravedad, aunque el PDF las exporte como páginas individuales (una captura
por estado del carrusel). Son un **carrusel horizontal real** dentro de una
ÚNICA `.view`: las flechas circulares prev/next cambian de tarjeta con
`js/carousel.js` (slide horizontal, sin animación de gravedad), y solo caen
al motor de gravedad vertical en los bordes (antes de la primera tarjeta /
después de la última). Esto reduce el total de `.view` del módulo Honestidad
de 9 a 5 (inicio ya contado aparte): loading, escenario, carrusel (un solo
`.view` con 5 tarjetas internas), cierre. Aplicar el mismo criterio a los
otros 4 módulos.

Además, el fondo de las tarjetas grandes (`.tarjeta-grande`) usa el asset
real `assets/img/global/panel-degradado-chico.png` (no una aproximación en
CSS), y los iconos del carrusel se agrandaron (380px actual / 260px atenuado)
y se centran verticalmente en el espacio entre el título y la etiqueta.

## 4.2 Assets pendientes — RESUELTO (2026-08-14)

El usuario reemplazó por completo la carpeta `img/` con una nueva versión donde
TODOS los archivos tienen nombre correcto y descriptivo (verificado
visualmente archivo por archivo, ya no hay desalineación nombre↔contenido).
Incluye los 4 iconos de carrusel que faltaban y las 5 fotos de escenario
(panel izquierdo) que antes no existían como asset recortado:

- `HONESTIDAD/ICONO-PRECIO.png`, `ICONO-CAJA-FUERTE.png`, `ICONO-MANOS.png` →
  copiados a `assets/img/honestidad/`, reemplazan los placeholders SVG en
  `index.html`.
- `ENFOQUE-AL-CLIENTE/ICONO-CARA.png` → `assets/img/enfoque/icono-cara-contacto-humano.png`.
- `[MODULO]/IMAGEN-[MODULO]-IZQ.png` (las 5) → `assets/img/[modulo]/foto-escenario.png`,
  usadas como fondo real de `.escenario-panel__foto` en las 5 vistas de
  escenario (antes reutilizaban fotos genéricas de otro módulo).
- `INICIO/Fondo-inicio.jpg` → `assets/img/inicio/textura-fondo.jpg`: es la
  textura de madera + iconos + marco COMPLETA ya diseñada (antes recreada a
  mano en CSS/SVG); `.view-inicio` ahora la usa como fondo real.
- Los assets "globales" (medalla, degradado de cierre, panel-degradado-chico,
  etc.) también fueron re-verificados contra los nuevos nombres — el
  contenido coincide, no cambiaron las rutas de destino en `assets/img/`.

Carpeta `assets/img/faltantes/` (placeholders SVG) queda sin uso — ya no hay
ninguna referencia activa a ella en el código.

### Historial (ya no aplica, referencia)

**4 iconos de tarjeta de carrusel** (PNG transparente, mismo estilo flat
ilustrado que los existentes, se está usando un placeholder SVG propio
mientras tanto en `assets/img/faltantes/`):
- Honestidad — etiqueta de precio con aguacate ("Precios claros")
- Honestidad — caja fuerte ("Cuentas claras")
- Honestidad — apretón de manos ("Confianza mutua")
- Enfoque al Cliente — carita feliz ("Contacto humano")

**5 fotos de escenario** (panel izquierdo de la pregunta, una por valor —
mientras tanto se reutilizan fotos de tienda genéricas ya existentes con
scrim oscuro, ver honestidad.css):
- Honestidad — empleado en tienda + gráfico 3D flotante de signos de
  interrogación ("¿Cómo actúas cuando nadie te observa?")
- Enfoque al Cliente — empleado + gráfico 3D flotante de relojes/reloj de
  arena ("tiempo pasando, espera sin fin")
- Innovación — foto simple de empleado en punto de venta/café (sin gráfico 3D)
- Responsabilidad — foto simple de estación de trabajo/mostrador (sin
  gráfico 3D)
- Excelencia Operacional — foto simple de anaqueles/producto (sin gráfico 3D)

El panel DERECHO del escenario (placeholder de video) no necesita pedirse:
reutiliza la foto real "Pague Aquí" ya recortada, confirmada idéntica en las
4 páginas de escenario revisadas del PDF (3, 11, 17, 23, 30).

## 5. Resumen de textos exactos por tarjeta de carrusel (para referencia rápida)

| Módulo | Tarjeta 1 | Tarjeta 2 | Tarjeta 3 | Tarjeta 4 |
|---|---|---|---|---|
| Honestidad | Precios claros | Cuentas claras | Confianza mutua | Beneficios para el cliente |
| Enfoque al Cliente | Contacto humano | Agilidad sin fricción | Escucha activa | — |
| Innovación | Cero resistencia | Maestría técnica | Propón mejoras | — |
| Responsabilidad | Higiene impecable | Puntualidad de héroe | Hazte cargo | — |
| Excelencia Operacional | Cero errores | Orden constante | Sin atajos | — |

Encabezado del panel izquierdo del carrusel: "¿Cómo aplico mi [valor]?" para los primeros 4
módulos; "Tips de Excelencia operacional" para el quinto (ver hallazgo 0.5).

Todas las tarjetas de audio (temáticas e historia) muestran duración de ejemplo "0:45" en la
barra de progreso — es un placeholder de diseño, no audio real.
