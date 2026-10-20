# Especificación — Ejercicio 2: Presentación con CSS y uso adaptable

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 2)**
Estado de este documento: **Fase 1 (SPEC) — decisión P1 resuelta por el usuario (Opción A: vistas apiladas), 2026-10-20. No se escribió código de producto.**
Fecha de redacción: 2026-10-20.

---

## 1. Problema, objetivo y resultado esperado

**Problema.** El parcial exige un frontend de librería construido con HTML5, CSS y JavaScript nativos, sin frameworks ni herramientas de compilación, abrible directamente con `file://`. El Ejercicio 1 ya entregó la estructura HTML completa (5 vistas, formularios, tablas, contenedores de estado y plantillas de render). Ese HTML es hoy **estructura sin presentación**: `css/styles.css` existe pero es un placeholder de 3 líneas con cero reglas, de modo que el documento se ve como texto plano sin jerarquía, sin legibilidad y sin identidad visual. El Ejercicio 2 (20 puntos: *Coherencia y organización* 8; *Adaptación* 8; *Accesibilidad básica* 4) debe aportar esa presentación **sin tocar el HTML ya aprobado**.

**Objetivo.** Definir una identidad visual propia y coherente (color, tipografía, espaciado, tarjetas, formularios, botones, tablas y mensajes), una organización CSS con Flexbox/Grid que funcione a 320 px y 1280 px sin desplazamiento horizontal de la página —con las tablas anchas desplazándose dentro de su propio contenedor—, y una accesibilidad básica verificable: foco visible, recorrido por teclado y mensajes de error expresados con texto y no solo con color.

**Resultado esperado.** Un único archivo `css/styles.css` completo, coherente con la estructura HTML existente, que:

- declare todos sus valores como *custom properties* en `:root` (tokens de color, tipografía, espaciado, radios y sombras);
- reutilice las clases ya presentes en `index.html` para elementos equivalentes, sin selectores por `id` usados para estilo, sin CSS inline y sin URLs externas;
- aplique `.mensaje[hidden] { display: none; }` para que el atributo `hidden` del HTML siga siendo respetado por el CSS de autor;
- produzca, a 320 px y a 1280 px, `document.documentElement.scrollWidth <= clientWidth`, con el scroll horizontal de las tablas contenido en `.tabla-contenedor`;
- presente las **5 vistas apiladas** (decisión P1, §9.3) como paneles de superficie claramente separados entre sí, de modo que cada vista se lea como un bloque propio al recorrer la página;
- deje **preparados** (estilizados, no implementados) los componentes que renderizarán los Ejercicios 3–6: tarjeta de libro, fila de renglón, total de venta y detalle de venta.

---

## 2. Contexto verificado y referencias

### 2.1 Fuentes consultadas

| Fuente | Cómo se consultó | Uso |
|---|---|---|
| `Consigna Primer Parcial.pdf` (336.215 bytes, 6 páginas) | Extracción de texto con `pypdf` 6.19.0 (Python 3.14.7, local) a un archivo temporal; 12.251 caracteres. La extracción preserva el texto pero puede perder el diseño original (columnas, encabezados de página). | Fuente de requisitos del Ejercicio 2 y de sus criterios de evaluación. |
| `index.html` (10.358 bytes, 264 líneas) | Lectura directa completa. | Estructura de clases, ids, estados y componentes a estilizar. |
| `css/styles.css` (148 bytes, 3 líneas) | Lectura directa. | Estado inicial: placeholder sin reglas. |
| `js/app.js` (197 bytes, 3 líneas) | Lectura directa. | Estado inicial: placeholder sin lógica (fuera de alcance en este ejercicio). |
| `docs/ejercicio1-spec.md` (26.390 bytes) | Lectura directa completa. | Formato, tono, convención de identificadores (R-xx / CA-xx / Pxx) y antecedente de decisiones diferidas. |
| `docs/ejercicio1-plan.md` (14.182 bytes) | Lectura directa completa. | Convención de checklist (T-xx) y de comprobaciones para la Fase 2. |
| `docs/ejercicio1-implementacion-resumen.md` (9.844 bytes) | Lectura directa completa. | Precedente de registro de evidencia y de controles omitidos. |
| Directorio del proyecto | PowerShell `Get-ChildItem -Recurse -File -Force` + `git log`/`git status`, 2026-10-20. | Inventario real de archivos y estado del repositorio. |

No se consultaron fuentes externas, documentación de terceros ni recursos en línea. No se inventaron archivos, datos ni resultados.

### 2.2 Hechos verificados (estado del proyecto)

- El directorio contiene **7 archivos** versionados: `Consigna Primer Parcial.pdf`, `index.html`, `css/styles.css`, `js/app.js`, `docs/ejercicio1-spec.md`, `docs/ejercicio1-plan.md`, `docs/ejercicio1-implementacion-resumen.md`.
- `git log` muestra 3 commits en `main` (`4a1ae16` implementación del Ejercicio 1, `112a6ce` spec/plan/implementación, `fabeb66` spec inicial); el árbol de trabajo estaba **limpio** antes de crear este documento (la única excepción actual es este propio archivo, sin versionar).
- `css/styles.css` contiene **solo un comentario de 3 líneas** que declara que los estilos se implementan en el Ejercicio 2. **Cero reglas CSS** en el proyecto a la fecha.
- `js/app.js` contiene **solo un comentario de 3 líneas**. Sin lógica.
- **No existen** `README.md`, carpeta `recursos/`, imágenes de ningún tipo, ni hojas de estilo adicionales.

### 2.3 Hechos extraídos de la consigna (Ejercicio 2, página 2)

Texto de la consigna, verificado en la extracción:

> "Se define una identidad visual propia y coherente: colores, tipografía, espaciado, tarjetas, formularios y botones. El CSS se mantiene en archivos externos y se reutilizan clases para elementos equivalentes."
>
> "Se utiliza Flexbox o Grid para organizar el contenido. La interfaz se comprueba con un ancho de 320 px y otro de 1280 px: los textos y controles resultan legibles y el contenido no provoca desplazamiento horizontal de toda la página. Si una tabla necesita más espacio, se desplaza dentro de su propio contenedor."
>
> "Los controles conservan un foco visible y se recorren con el teclado. Los mensajes de error se expresan con texto y no dependen únicamente de un color. Las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria."

*Citas literales de la página 2 de la consigna.* La consigna enumera "colores, tipografía, espaciado, tarjetas, formularios y botones": esta SPEC **extiende** esa lista con **tablas y mensajes**, que no figuran en el texto original pero que son componentes obligatorios del Ejercicio 1 (5 tablas y 10 contenedores de estado ya estructurados en el HTML) y son objeto de la propia consigna ("Si una tabla necesita más espacio, se desplaza dentro de su propio contenedor"; "Los mensajes de error se expresan con texto"). La extensión se declara aquí como decisión propia, no como cita.

Puntaje (página 6): **Ejercicio 2 · 20 puntos** → *Coherencia y organización: 8; adaptación: 8; accesibilidad básica: 4*. Total del parcial: 100 puntos.

Restricciones transversales de la consigna que condicionan esta fase: "Se utilizan únicamente HTML, CSS y JavaScript nativos… No se utilizan librerías, frameworks ni CDNs de CSS o JavaScript"; "Los estilos, scripts, imágenes y demás recursos se incluyen en el proyecto"; "No se requiere API, base de datos, servidor ni conexión con el backend."

### 2.4 Auditoría del HTML existente (hechos medidos, no supuestos)

Medidos sobre `index.html` el 2026-10-20:

| Elemento | Cantidad verificada | Nota |
|---|---|---|
| Clases distintas en uso | **38** | Listado completo en §5.4. Son 86 atributos `class` y 100 tokens de clase. |
| Elementos `<label for>` | **12** | Coinciden con los **12** controles de formulario (`input`/`select`): **0 controles huérfanos**. |
| `<input>` / `<select>` / `<button>` | 7 / 5 / 6 | Los 2 botones "Quitar/Modificar renglón" viven dentro de `<template>` (inerto). |
| Enlaces `<a href>` | 5 | Los 5 del `<nav>`. |
| Elementos con `tabindex="0"` | 5 | Uno por `.tabla-contenedor`. |
| **Paradas de foco en el DOM vivo** | **26** | 5 enlaces + 7 `input` + 5 `select` + 4 botones (2 de plantilla son inertes) + 5 regiones `tabindex="0"`. |
| Tablas `<table>` | 5 | Las 5 dentro de un `div.tabla-contenedor` (**5/5**). |
| Contenedores `.mensaje` | **10** | 4 `mensaje--vacio` + 3 `mensaje--exito` + 3 `mensaje--error`. |
| Elementos `.mensaje` con atributo `hidden` | **7** | `catalogo-sin-resultados`, `libro-mensaje-exito`, `libro-mensaje-error`, `cliente-mensaje-exito`, `cliente-mensaje-error`, `venta-mensaje-exito`, `venta-mensaje-error`. |
| Atributos `style=` | **0** | Ningún estilo inline. |
| URLs externas (`http://`, `https://`, `//`) | **0** | Ninguna dependencia de red. |
| `<template>` | 2 | `plantilla-libro` (tarjeta `.libro`), `plantilla-renglon` (fila `.fila-renglon`). |
| Etiquetas `<style>` / `<script>` inline | **0** | `<script src="js/app.js" defer>` es el único script. |

**Consecuencia técnica derivada de estos hechos (verificada, no supuesto):** el navegador aplica `[hidden] { display: none }` desde la hoja de estilos del *user agent*. Ese valor es de **origen de autor ausente**, por lo que **cualquier** regla de autor que asigne `display` a `.mensaje` (por ejemplo `display: flex` o `display: grid`) **anula el `display: none`** del navegador. Con los **7** mensajes ocultos verificados arriba, un `.mensaje` flex/grid haría aparecer de golpe los 7 mensajes ocultos (2 mensajes de error, 3 de éxito y 2 de vacío) en la primera carga. Por eso esta SPEC exige una regla explícita (Punto técnico 1, §7).

### 2.5 Herramientas de verificación disponibles (verificadas)

- **Navegador:** `C:\Program Files (x86)\Microsoft\EdgeCore\155.0.4283.62\msedge.exe` (EdgeCore 155.0.4283.62). **No está en el `PATH`**: hay que invocarlo por ruta absoluta. Se verificó que responde a `--headless=new --disable-gpu --window-size=… --virtual-time-budget=… --dump-dom` sobre `file://` devolviendo el DOM (los errores de registro `EdgeUpdate` que emite por `stderr` son ruido inocuo del binario, no fallos de carga).
- **Limitación verificada del navegador headless:** `--window-size=320,800` **no produce un viewport de 320 px**. Medido: `window.innerWidth` = **492 px**. Se probaron `--headless=new`, `--headless=old`, `--force-device-scale-factor=1` y `--hide-scrollbars`: **los cuatro devuelven 492 px**, porque Edge impone un ancho mínimo de ventana. Con `--window-size=1280,900` se obtiene `innerWidth` = 1256 px. **Conclusión: el control de 320 px NO puede ejecutarse con `--window-size`; hay que obtener el viewport de 320 px por otro medio** (§7.11).
- **Python 3.14.7** con `pypdf` 6.19.0 disponible (usado para la extracción del PDF).
- **No existe** framework de tests en el proyecto: no hay `pytest.ini`, `package.json`, `tox.ini`, `conftest.py` ni archivos de prueba. La política de pruebas de este ejercicio es, por lo tanto, la de tres capas definida en el encargo (§7.11).
- No se ejecutó ninguna medición en navegador **sobre el producto**: `index.html` no se modifica. Las mediciones de la Fase 3 se harán sobre una **copia temporal** (§7.11).

### 2.6 Validación exploratoria de las reglas de mayor riesgo (hechos medidos)

Antes de cerrar esta SPEC se construyó, **en la carpeta temporal y fuera del proyecto**, un **prototipo mínimo** con las reglas técnicas de mayor riesgo de este documento, y se midió en Edge headless con viewport real de 320 px y de 1280 px (§7.11 explica cómo se obtuvo el viewport exacto). **El prototipo no es la entrega**: la Fase 3 escribirá el CSS real. Resultado medido:

| Regla a validar | Medición a 320 px | Medición a 1280 px | Veredicto |
|---|---|---|---|
| `.mensaje[hidden]` anula el `display:flex` de `.mensaje` | 7/7 mensajes con `hidden` con `display:none`; 3/3 visibles mostrados con su texto exacto | igual | **Validada** |
| Los glifos por variante | `✓` ×3 (éxito), `✕` ×3 (error), `ℹ` ×4 (vacío) | igual | **Validada** |
| Sin scroll horizontal del documento | `scrollWidth` 305 = `clientWidth` 305 | 1265 = 1265 | **Validada** |
| `.tabla-contenedor` con scroll propio | 4 de 5 contenedores desplazan (273 px de cliente) | 1 de 5 (solo renglones) | **Validada** |
| Ningún elemento desborda fuera de un scroller | `NINGUNO` | `NINGUNO` | **Validada** |
| Escala fluida `clamp()` | `h1` = 22 px, body = 16,02 px, media query de 48rem **inactiva** | `h1` = 40 px, body = 17 px, media query **activa** | **Validada** (los extremos coinciden con lo pedido) |
| `min-inline-size: max-content` en `.tabla` | la tabla de renglones midió 467 px dentro de un contenedor de 273 px | — | **Validada** (la tabla no se comprime: desborda dentro del contenedor) |

**Dos hallazgos que la SPEC incorpora como cambio de diseño (no eran previsibles por lectura):**

1. **La tabla de renglones quedaba comprimida a 268 px a 1280 px.** `#tabla-renglones` está dentro de `#form-venta`, y `.formulario` es una grilla: el `.tabla-contenedor` quedaba en **una sola columna** de la grilla (268 px de 1120 px), con scroll propio innecesario. **Corrección adoptada en §5.3:** los bloques anchos dentro de un formulario (`.tabla-contenedor`, `.venta__total`, `.renglon-alta`, botón de envío) ocupan la fila completa con `grid-column: 1 / -1`. **Medido tras aplicar la corrección:** la tabla de renglones pasa de 489/268 (con scroll) a 1120/1120 (quieta) a 1280 px; a 320 px el comportamiento no cambia.
2. **El script de medición no puede escribir un `<pre>` dentro del documento medido.** Un `<pre>` con líneas largas (`white-space: pre`) ensancha el documento y produce un `scrollWidth` falso: se midió **2085 px con el `<pre>` presente y 305 px sin él**, con el CSS **idéntico** en ambos casos. **Regla adoptada en §7.11:** el script de medición reporta por `postMessage` al arnés y **no** inyecta elementos en la página medida.

---

## 3. Alcance

### 3.1 Incluido

- **Un único archivo de estilos: `css/styles.css`**, completo y en la ubicación ya enlazada por `index.html`. No se crean hojas de estilo adicionales, ni CSS inline, ni `<style>`.
- **Tokens (custom properties) declarados en `:root`:** color (12 tokens base + 3 derivados para interacción), tipografía (2 pilas y 4 tamaños fluidos), espaciado (8 pasos), radios (4 valores), sombras (3 valores), más 2 medidas de layout.
- **Identidad visual completa:** color, tipografía, espaciado, tarjetas, formularios, botones, tablas y mensajes, con estilos reutilizables para elementos equivalentes.
- **Layout con Flexbox y Grid** (mobile-first), con `box-sizing: border-box` global, `min-inline-size: 0` en los hijos flexibles que pueden recibir contenido largo, y `clamp()` / `minmax()` para tipografía y grillas fluidas.
- **Adaptación a 320 px y 1280 px:** sin desplazamiento horizontal del documento; las tablas anchas se desplazan dentro de su `.tabla-contenedor`.
- **Accesibilidad básica:** foco visible con `:focus-visible` y anillo de contraste suficiente, `outline: none` prohibido, mensajes de estado con **dos señales** (color + glifo) y texto como portador principal del significado.
- **Estilos de los 10 contenedores de estado** y respeto del atributo `hidden`.
- **Preparación de los componentes de los Ejercicios 3–6** (estilados, **no implementados**): `.libro` y sus partes, `.fila-renglon` y sus celdas, `.boton--quitar` / `.boton--modificar`, `.venta__total`, `.detalle-venta`, `.listado--catalogo`, y las clases reservadas que el JS futuro necesitará.
- **Verificación en tres capas** (controles automatizables de solo lectura, comprobación real en navegador a 320 px y 1280 px sobre copia temporal, y registro de evidencia por control con estado aprobado/fallido/omitido/pendiente).

### 3.2 Excluido

- **Cualquier modificación de `index.html`** (ni una línea). Toda la presentación se resuelve con las 38 clases existentes y con selectores de elemento/descendiente dentro de los componentes. Esta restricción la impone el encargo y preserva el trabajo aprobado del Ejercicio 1.
- **Cualquier modificación de `js/app.js`**: sin lógica, sin datos, sin listeners.
- **JavaScript funcional de los Ejercicios 3–6:** render del catálogo, filtro por título, validaciones de alta, población de selectores, cálculo de subtotales y total, historial, detalle de venta, `localStorage`.
- **Modo oscuro / temas / `prefers-color-scheme`:** no está en la consigna; la paleta es una sola.
- **Animaciones de entrada y transiciones decorativas:** no aportan a los criterios evaluados. Se conservan **únicamente** las transiciones de color de interacción (ver §7.8). El `scroll-behavior: smooth` del `html` **sí** se incluye (D9): mejora el salto por ancla de la navegación.
- **Imágenes, íconos, sprites, `background-image`:** cero imágenes. El requisito de texto alternativo de la consigna queda **vacuo** y se declara como tal (§9, S3).
- **Webfonts, `@font-face`, Google Fonts, `fonts.googleapis.com`:** cero URLs externas (restricción dura).
- **IMGs, sprites SVG, `data:` URIs:** no aplican por la misma razón.
- **README, casos manuales, comprobación de precio histórico:** corresponden al Ejercicio 6.
- **Librerías, frameworks, CDNs, preprocesadores (Sass/Less), build, npm, autoprefixer, PostCSS:** prohibidos por la consigna.
- **Formateo de importes en moneda, reglas de redondeo, cálculo de totales:** lógica del Ejercicio 5; aquí solo se estila el contenedor `<output>` ya existente.

---

## 4. Requisitos y escenarios observables

| ID | Grupo | Requisito verificable | Escenario observable (verificación) | Casos límite relevantes |
|---|---|---|---|---|
| R-01 | Identidad visual | `css/styles.css` define color, tipografía, espaciado, tarjetas, formularios, botones, tablas y mensajes con una identidad única y coherente. | Inspeccionar el archivo: existen reglas para las 8 familias; los valores provienen de tokens, no de literales repetidos; abrir `index.html` muestra jerarquía tipográfica, superficies diferenciadas, tarjetas con sombra y botones con jerarquía primaria/secundaria/destructiva. | Un mismo elemento (p. ej. botón) no puede tener dos apariencias según dónde esté: los 4 botones del DOM vivo y los 2 de plantilla comparten `.boton` y solo difieren por modificador. |
| R-02 | Reutilización y separación | El CSS vive en un archivo externo; los elementos equivalentes reutilizan las clases existentes; no hay selectores por `id` usados para estilo, ni CSS inline, ni URLs externas. | `grep` de `style=` y `<style>` en `index.html` → 0 coincidencias; `grep` de `#` seguido de identificador en `styles.css` → 0 selectores por id; `grep` de `http://`, `https://`, `//` en ambos → 0; los 5 encabezados de tabla, los 12 campos y los 6 botones reciben estilo por clase, no por id. | El `<h1>` (`#titulo-libreria`) se estila con `.encabezado h1` (descendiente), no con su id; los 5 `<section id="…">` se estilan con `.vista`, no por id. |
| R-03 | Estados | Los 10 contenedores de estado tienen estilo coherente y distinguible; el atributo `hidden` se respeta; ningún mensaje oculto aparece en la carga inicial. | Medir en navegador: los 7 elementos con `hidden` tienen `offsetParent === null` / `getComputedStyle(el).display === "none"`; los 3 visibles se ven; en la primera carga el texto visible NO contiene "No se encontraron libros", "registrado correctamente" ni "No se pudo". | Si `.mensaje` fuese `grid` o `flex` sin la regla `[hidden]`, los 7 ocultos aparecerían de golpe (§2.4). Con `.mensaje { display: flex }` **y** `.mensaje[hidden] { display: none }`, gana la segunda por especificidad (0,2,0 > 0,1,0). |
| R-04 | Accesibilidad básica | Todos los controles conservan foco visible con contraste suficiente; el recorrido por teclado alcanza y opera enlaces, campos, botones y contenedores con `tabindex`; los mensajes de error se comprueban por su texto y no dependen solo del color. | En navegador: cada elemento enfocado tiene un `outline` visible (computed `outline-style !== "none"` y `outline-color` = `--color-foco`); el ciclo de `Tab` recorre los 26 puntos de foco del DOM vivo; el texto de cada `.mensaje` describe el estado ("No se pudo registrar el libro. Revisá los datos."); cada estado combina color + glifo `::before`. | `.tabla-contenedor` tiene `tabindex="0"`: su anillo va hacia adentro (`outline-offset` negativo) porque el `outline` por defecto se dibujaría fuera y podría quedar recortado por el `overflow`. Ningún `:focus-visible` puede quedar anulado: `outline: none` está prohibido en todo el CSS. |
| R-05 | Adaptación | A 320 px y a 1280 px no hay desplazamiento horizontal de la página; las tablas anchas se desplazan dentro de su `.tabla-contenedor`; textos y controles son legibles en ambos anchos. | Medir en navegador (copia temporal): `document.documentElement.scrollWidth <= document.documentElement.clientWidth` en ambos anchos; `document.querySelector('.tabla-contenedor').scrollWidth > .clientWidth` con la tabla de renglones; ningún elemento del DOM tiene `getBoundingClientRect().right > innerWidth`. | El `.tabla-contenedor` es el **único** elemento con scroll horizontal: como ítem de grid dentro de `.vista` necesita `min-inline-size: 0` (si no, el `min-width: auto` del grid lo dimensiona a max-content y el scroll se propaga al documento). Un `td` con `display: flex` se sale del modelo de tabla y rompe la altura de fila. La celda de acciones usa `white-space: nowrap` y NO flex. |
| R-06 | Organización | Los tokens están declarados como custom properties en `:root`; el archivo sigue un orden de capas legible; CSS3 moderno, sin ataduras heredadas. | `:root` declara los tokens de color, tipografía, espaciado, radios y sombras; el archivo se lee por capas (tokens → base → layout → componentes → responsive → movimiento reducido); no hay literales de color repetidos fuera de `:root` (salvo los derivados por `color-mix`); el `grep` de `!important` solo encuentra coincidencias dentro del bloque `@media (prefers-reduced-motion: reduce)`. | `!important` está **prohibido** salvo en la regla justificada de `prefers-reduced-motion` (necesaria para anular transiciones más específicas). |
| R-07 | Preparación | Los estilos de tarjeta de libro, fila de renglón, total y detalle de venta están preparados para el render de los Ej. 3–6, **sin implementar ese render**. | Inspeccionar el CSS: existen las reglas de §5.8 para `.libro`, `.libro__titulo`, `.libro__datos` y sus `dt`/`dd`, las 5 clases `libro__isbn`/`__editorial`/`__genero`/`__autores`/`__precio`, `.fila-renglon` y sus 5 celdas, `.boton--quitar`, `.boton--modificar`, `.venta__total` (con su `output`), `.detalle-venta`; el `<template>` de `index.html` sigue inerte (0 tarjetas y 0 filas renderizadas) y `js/app.js` sigue vacío. | Los `<dd>` de `.libro__datos` traen `margin-inline-start: 40px` por defecto de la UA: hay que anularlo para que la grilla `dt`/`dd` se alinee. El `<select multiple>` de autores necesita `min-block-size` para ser utilizable con el teclado. |
| R-08 | Verificación | La comprobación se realiza en tres capas y se registra con estado por control; ningún control no ejecutado se presenta como aprobado. | Existe un registro de evidencia con una fila por control y estado ∈ {aprobado, fallido, omitido, pendiente} + motivo; los controles de navegador se ejecutaron sobre una copia temporal, no sobre `index.html`. | La inspección visual de las capturas queda **omitida con motivo** si el modelo no puede leer imágenes: se deriva a revisión humana (así se hizo en el Ejercicio 1). |

---

## 5. Estructura propuesta, interfaces y datos

### 5.1 Arquitectura del CSS

Un solo archivo, `css/styles.css`, organizado en capas en este orden (orden pensado para que cada capa dependa solo de las anteriores):

1. **Cabecera de comentario** — identificación, ejercicio, y la advertencia de que los tokens son la única fuente de valores.
2. **`:root`** — todos los tokens (§5.2). Se declara primero para que las capas siguientes solo usen `var()`.
3. **Base / reset** — `box-sizing: border-box` global, `margin-block`/`padding` de headings y `dd`/`p`, `font-family` y `font-size` base, `color`/`background` del `body`, `line-height`, `font-variant-numeric: tabular-nums`, `scroll-behavior: smooth`, `color-scheme: light`.
4. **Tipografía** — `h1`–`h3` con la pila serif y tamaños fluidos; anclas `a`.
5. **Layout** — `.encabezado`, `.navegacion`, `.nav-enlace`, `.contenido`, `.vista`, `.pie`.
6. **Componentes** — `.formulario`, `.campo`, `.campo__control`, `.renglon-alta`, `.boton` (+ modificadores), `.mensaje` (+ modificadores), `.tabla-contenedor`, `.tabla`, `.listado--catalogo`, `.libro` (+ partes), `.fila-renglon` (+ celdas), `.venta__total`, `.detalle-venta`.
7. **Foco** — reglas de `:focus-visible` (globales y la excepción de `.tabla-contenedor`).
8. **Responsive** — `@media (min-width: 48rem)` y `@media (min-width: 64rem)` (mobile-first: las reglas base son de 320 px).
9. **Movimiento reducido** — `@media (prefers-reduced-motion: reduce)` con las únicas declaraciones `!important` justificadas.

**Interfaces con el HTML.** La única interfaz es el conjunto de 38 clases ya presentes en `index.html` (§5.4). El CSS **no conoce** ningún `id` y **no** añade clases al HTML.

### 5.2 Tokens (`:root`)

#### 5.2.1 Color — 12 tokens base

| Token | Valor | Rol | Contraste medido (WCAG 2.1) |
|---|---|---|---|
| `--color-fondo` | `#f7f1e6` | Fondo de página (crema) | — (referencia) |
| `--color-superficie` | `#fffdf8` | Tarjetas, campos, tablas, navegación | texto 15,03:1 · texto-suave 7,33:1 |
| `--color-superficie-alt` | `#efe6d6` | Fondos alternos: `thead`, hover de fila, hover de enlace | texto 12,34:1 · texto-suave 6,01:1 · acento 4,78:1 |
| `--color-borde` | `#d9cdb8` | Separadores decorativos | 1,54:1 sobre superficie — decorativo, no identifica control |
| `--color-borde-fuerte` | `#b9a98d` | Contornos decorativos realzados: tarjeta `.libro`, `fieldset` `.renglon-alta` | 2,26:1 sobre superficie — **no alcanza 3:1** (§7.9, D1) |
| `--color-texto` | `#2b241f` | Texto principal | 13,59:1 sobre fondo · 15,03:1 sobre superficie |
| `--color-texto-suave` | `#5f5349` | Texto secundario, etiquetas, **bordes de control** | 6,62:1 sobre fondo · 7,33:1 sobre superficie |
| `--color-acento` | `#a8452b` | Acento terracota: enlaces, botón primario | 5,26:1 sobre fondo · 5,82:1 sobre superficie · 5,91:1 con texto blanco |
| `--color-acento-suave` | `#f0dcd2` | Tinte terracota: fondo de mensajes, hover de botón secundario | texto 11,55:1 · texto-suave 5,63:1 · exito 4,79:1 · error 5,54:1 |
| `--color-exito` | `#2f6b46` | Estado correcto | 5,64:1 sobre fondo · 6,24:1 sobre superficie · 4,79:1 sobre acento-suave |
| `--color-error` | `#a3271f` | Estado rechazado / acción destructiva | 6,51:1 sobre fondo · 7,20:1 sobre superficie · 5,54:1 sobre acento-suave · 7,32:1 con texto blanco |
| `--color-foco` | `#0f5aa8` | Anillo de foco | 6,13:1 sobre fondo · 6,78:1 sobre superficie |

#### 5.2.2 Color — 3 tokens derivados (interacción)

Derivados con `color-mix(in srgb, …)` a partir de los tokens base, para no introducir hexadecimales nuevos:

| Token | Definición | Resultado | Contraste verificado |
|---|---|---|---|
| `--color-acento-hover` | `color-mix(in srgb, var(--color-acento) 84%, #000)` | `#8d3a24` | blanco sobre el: 7,60:1 ✔ |
| `--color-acento-activo` | `color-mix(in srgb, var(--color-acento) 72%, #000)` | `#79321f` | blanco sobre el: 9,17:1 ✔ |
| `--color-error-hover` | `color-mix(in srgb, var(--color-error) 84%, #000)` | `#89211a` | blanco sobre el: 9,15:1 ✔ |

#### 5.2.3 Tipografía

| Token | Valor |
|---|---|
| `--fuente-titulo` | `Georgia, "Iowan Old Style", "Palatino Linotype", "Times New Roman", serif` |
| `--fuente-texto` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--tamano-base` | `clamp(1rem, 0.98rem + 0.105vw, 1.0625rem)` → **16 px → 17 px** |
| `--tamano-titulo-1` | `clamp(1.375rem, 1rem + 1.875vw, 2.5rem)` → **22 px → 40 px** |
| `--tamano-titulo-2` | `clamp(1.1875rem, 1.0417rem + 0.7292vw, 1.625rem)` → 19 px → 26 px |
| `--tamano-titulo-3` | `clamp(1.0625rem, 1rem + 0.3125vw, 1.25rem)` → 17 px → 20 px |

Los **cuatro** tokens fluidos están calibrados para que sus extremos se alcancen **exactamente en los dos anchos evaluados** (320 px y 1280 px), no antes. Comprobación calculada:

| Token | 320 px | 768 px | 1280 px |
|---|---|---|---|
| `--tamano-base` | 16,02 px | 16,49 px | 17,02 px |
| `--tamano-titulo-1` | 22,00 px | 30,40 px | 40,00 px |
| `--tamano-titulo-2` | 19,00 px | 22,27 px | 26,00 px |
| `--tamano-titulo-3` | 17,00 px | 18,40 px | 20,00 px |

Los dos primeros son los fijados por el encargo (16→17 px y 22→40 px); los otros dos son propuesta propia para el `h2` de vista y el `h3` de tarjeta, calibrados con el mismo criterio.

#### 5.2.4 Espaciado, radios, sombras y layout

| Token | Valor | Uso |
|---|---|---|
| `--esp-1` … `--esp-8` | 4, 8, 12, 16, 24, 32, 48, 64 px | Todos múltiplos de 4 px. |
| `--radio-1` | 4 px | Bordes de control pequeño, chips. |
| `--radio-2` | 8 px | Campos, botones, mensajes, celdas. |
| `--radio-3` | 14 px | Tarjetas (`.libro`), paneles (`.detalle-venta`). |
| `--radio-4` | 999 px | Píldora (`.nav-enlace` activo, `.boton` tipo chip si hiciera falta). |
| `--sombra-1` | `0 1px 2px rgb(43 36 31 / 8%)` | Tarjetas y superficies elevadas (`.libro`, `.detalle-venta`). |
| `--sombra-2` | `0 6px 18px rgb(43 36 31 / 10%)` | Estado elevado: `.libro:hover` (§5.8). |
| `--sombra-foco` | `0 0 0 3px rgb(15 90 168 / 35%)` | Halo complementario del anillo de foco. |
| `--alto-nav` | 3rem (48 px) | Altura fija de la navegación; base del `scroll-margin-top`. |
| `--ancho-maximo` | 72rem (1152 px) | Ancho máximo de `.contenido` en 1280 px. |

Total: **38 custom properties** en `:root` = 12 de color base + 3 de color derivados + 6 de tipografía (2 pilas + 4 tamaños fluidos) + 8 de espaciado + 4 de radios + 3 de sombras + 2 de layout.

### 5.3 Reglas de layout (Flexbox y Grid)

**Las reglas de esta sección asumen la Opción A (vistas apiladas, decisión P1 de §9.3).** Con la Opción B habría que sobrescribir `.vista { display: none }` y `.vista:target { display: grid }` y recalcular el `gap`; no es el caso elegido.

| Contexto | Regla propuesta | Motivo |
|---|---|---|
| `body` | `display: flex; flex-direction: column; min-block-size: 100vh;` | Estructura de columna para que el `<footer>` pueda empujarse al pie. |
| `.pie` | `margin-block-start: auto;` | En un contenedor flex vertical con `justify-content` por defecto (flex-start), el espacio libre queda **debajo** del pie: sin esta regla el pie **no** queda al pie de la ventana (D12). |
| `.contenido` | `display: grid; gap: var(--esp-7); padding: var(--esp-4); max-inline-size: var(--ancho-maximo); margin-inline: auto; inline-size: 100%;` | Contenedor centrado, con ritmo vertical y separación amplia entre los paneles de vista. |
| `.vista` | `display: grid; gap: var(--esp-4); scroll-margin-top: calc(var(--alto-nav) + var(--esp-4)); padding: var(--esp-5); background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-3); box-shadow: var(--sombra-1);` | **Decisión P1 (vistas apiladas):** cada vista se presenta como un **panel de superficie** propio, separado de la anterior por el `gap` de `.contenido` y por su borde y sombra. El `scroll-margin-top` evita que la navegación fija tape el encabezado de la vista al saltar por ancla. |
| `.vista > h2` | `font-family: var(--fuente-titulo); font-size: var(--tamano-titulo-2); margin: 0; padding-block-end: var(--esp-2); border-block-end: 1px solid var(--color-borde);` | El título de la vista abre el panel y lo delimita del contenido. Se usa el descendiente `.vista > h2`, **no** el `id` del `<h2>`. |
| `.contenido > *`, `.vista > *` | `min-inline-size: 0;` | Evita que un hijo de grid con contenido ancho (`.tabla-contenedor`) dimensione la columna a max-content y desborde el documento. |
| `.formulario` | `display: grid; gap: var(--esp-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));` | 1 columna a 320 px, varias a medida que entra el espacio. El `min(100%, 16rem)` es el patrón que impide el desbordamiento cuando el contenedor es más angosto que la pista. |
| `.formulario > .tabla-contenedor`, `.formulario > .venta__total`, `.formulario > .renglon-alta`, `.formulario > .boton` | `grid-column: 1 / -1;` | Los bloques anchos ocupan la **fila completa** de la grilla del formulario. Sin esta regla, la tabla de renglones quedaba comprimida en una sola columna (medido: 268 px de 1120 px a 1280 px) — §2.6, hallazgo 1. |
| `.campo` | `display: grid; gap: var(--esp-1); min-inline-size: 0;` | Etiqueta encima del control. |
| `.campo__control` | `inline-size: 100%; max-inline-size: 100%; min-inline-size: 0;` | El control nunca excede su celda. |
| `.listado--catalogo` | `display: grid; gap: var(--esp-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));` | Grilla fluida de tarjetas de libro. |
| `.libro` | `min-inline-size: 0;` | La tarjeta puede recibir título y email largos sin romper la grilla. |
| `.navegacion` | `position: sticky; inset-block-start: 0; display: flex; flex-wrap: wrap; gap: var(--esp-2); align-items: center; min-block-size: var(--alto-nav);` | Navegación fija (sticky) sin alterar el flujo; `flex-wrap` para que a 320 px los 5 enlaces bajen de línea sin scroll horizontal. |
| `.nav-enlace` | `padding: var(--esp-2) var(--esp-3); border-radius: var(--radio-1);` | Área de clic cómoda. |
| `.renglon-alta` | `display: grid; gap: var(--esp-4); grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); border: 1px solid var(--color-borde-fuerte); border-radius: var(--radio-2); padding: var(--esp-4); margin: 0; min-inline-size: 0; background-color: var(--color-superficie);` | El `<fieldset>` agrupa el alta de renglón. El reset anula el `border: 2px groove` y el `margin-inline: 2px` del *user agent*. El `background-color` garantiza que el recorte nativo del `<legend>` se rellene con el color del panel y no con transparente, de modo que el borde del fieldset no se dibuje detrás del texto del legend (D14). |
| `fieldset` | `border: 0; margin: 0; padding: 0; min-inline-size: 0;` | Reset del `<fieldset>` (el borde y el margen por defecto del UA). |
| `.renglon-alta legend` | `padding: 0 var(--esp-2) 0 0; font-family: var(--fuente-titulo); font-size: var(--tamano-titulo-3); font-weight: 700; color: var(--color-texto);` | El `<legend>` titula el bloque de renglón con la tipografía de títulos. |
| `.formulario > .boton` | `justify-self: stretch; inline-size: 100%;` | Botón a ancho completo en la base (móvil). **Nota:** `inline-size: auto` no alcanza para encogerlo, porque el `justify-self` por defecto de un ítem de grid es `stretch` y lo estira a la columna (D13). |
| `.libro__datos` | `display: grid; grid-template-columns: max-content 1fr; gap: var(--esp-1) var(--esp-3);` | Pares `dt`/`dd` alineados; el `dd` lleva `margin-inline-start: 0` (anula el valor por defecto de la UA). |

### 5.4 Mapa de componentes — las 38 clases del HTML

Las 38 clases verificadas en `index.html` y su responsabilidad en el CSS. **Ninguna se renombra y ninguna se añade al HTML.**

| Grupo | Clases (verificadas) | Responsabilidad en el CSS |
|---|---|---|
| Estructura (6) | `.encabezado`, `.navegacion`, `.nav-enlace`, `.contenido`, `.vista`, `.pie` (+ `body`, `main`, `footer`, `header`, `nav`, `section`) | Superficies, navegación sticky, `scroll-margin`, **panel de superficie por vista (P1)**, título de vista con filete, pie de página. |
| Formulario (5) | `.formulario`, `.formulario--busqueda`, `.campo`, `.campo__control`, `.renglon-alta` | Grilla fluida, etiqueta + control, control con borde y foco,fieldset con `legend`. |
| Botones (3 + 1 reservado) | `.boton`, `.boton--quitar`, `.boton--modificar`, `.boton--secundario` *(reservada, §5.6)* | Primario (acento), secundario (contorno), destructivo (error). |
| Listados (2) | `.listado`, `.listado--catalogo` | Grilla de tarjetas. |
| Mensajes (4) | `.mensaje`, `.mensaje--exito`, `.mensaje--error`, `.mensaje--vacio` | Superficie tintada + filete de color + glifo + texto; y la regla `[hidden]`. |
| Tablas (2) | `.tabla-contenedor`, `.tabla` | Scroll propio + anillo de foco hacia adentro; tabla con encabezado, separadores y hover. |
| Venta (2) | `.venta__total`, `.detalle-venta` | Total destacado con cifras tabulares; panel de detalle. |
| Tarjeta de libro (8) | `.libro`, `.libro__titulo`, `.libro__datos`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio` | Tarjeta con sombra, título serif, grilla `dt`/`dd`. |
| Fila de renglón (6) | `.fila-renglon`, `.fila-renglon__libro`, `.fila-renglon__cantidad`, `.fila-renglon__precio-unitario`, `.fila-renglon__subtotal`, `.fila-renglon__acciones` | Celdas con alineación vertical al medio; **acciones con `white-space: nowrap` y sin flex**. |

### 5.5 Comportamiento de tabla y scroll propio

- `.tabla-contenedor` — es el **único** elemento del proyecto que puede generar scroll horizontal:
  - `overflow-x: auto; overflow-y: auto;` (el `overflow-y` computes a `auto` en CSS: no puede quedar en `visible` junto a un `overflow-x` distinto de `visible`).
  - `max-inline-size: 100%; min-inline-size: 0;` → nunca propaga su ancho al documento.
  - `border-radius: var(--radio-2); border: 1px solid var(--color-borde); box-shadow: var(--sombra-1); background: var(--color-superficie);` → el borde lo separa del panel de vista, que comparte superficie. **Una sola sombra**: `--sombra-1` (la `--sombra-2` queda para el hover de tarjeta, §5.8).
  - `:focus-visible { outline-offset: -3px; }` → el anillo va **hacia adentro**: el `outline` por defecto se dibuja fuera del borde del contenedor y se superpone al contenido circundante; con `outline-offset: -3px` el anillo queda dentro del área visible de la tabla. (El `outline` de un elemento no es recortado por su propio `overflow`; la razón del offset negativo es la superposición, no el recorte.)
- `.tabla` — `inline-size: 100%; min-inline-size: max-content; border-collapse: collapse;`:
  - `inline-size: 100%` hace que la tabla ocupe el ancho disponible cuando le sobra espacio;
  - `min-inline-size: max-content` impide que la tabla se encoja por debajo de su ancho natural y **empuje el scroll dentro del contenedor** en lugar de comprimir el contenido;
  - `thead th` → fondo `--color-superficie-alt`, texto `--color-texto`, filete inferior 2 px `--color-texto-suave` (6,01:1, cumple 3:1 para UI), `text-align: start`; **no** se le aplica `position: sticky`: el contenedor no tiene altura acotada, así que no habría scroll vertical y el efecto sería nulo (D11);
  - `tbody td` → `padding: var(--esp-2) var(--esp-3)`, separador inferior 1 px `--color-borde` (decorativo);
  - `tbody tr:hover` → fondo `--color-superficie-alt` (señal de estado, no de identidad de control);
  - `vertical-align: middle` en las celdas.

### 5.6 Foco visible y mensajes

- `:focus-visible { outline: 2px solid var(--color-foco); outline-offset: 2px; }` — anillo de 2 px con `--color-foco` (6,13:1 sobre fondo, 6,78:1 sobre superficie) + `box-shadow: var(--sombra-foco)`. **Prohibido `outline: none` en todo el CSS** (no hay reset de outline).
- `.mensaje` — `display: flex; align-items: flex-start; gap: var(--esp-2); padding: var(--esp-3) var(--esp-4); background: var(--color-acento-suave); border-inline-start: 4px solid <color de estado>; border-radius: var(--radio-2); color: <color de estado>; min-inline-size: 0; overflow-wrap: anywhere;` — el `min-inline-size: 0` y el `overflow-wrap` evitan que un texto largo (p. ej. el detalle de un rechazo) desborde el panel a 320 px.
- Cada estado lleva **dos señales**: el color (texto + filete) y un glifo `::before` — `✓` éxito, `✕` error, `ℹ` vacío. El texto del HTML sigue siendo el portador principal del significado (R-04, consigna: "no dependen únicamente de un color").
- `.mensaje[hidden] { display: none; }` — regla obligatoria, especificidad (0,2,0) superior a la de `.mensaje` (0,1,0). Sin ella, los 7 mensajes ocultos aparecerían (§2.4).
- **Clases reservadas** para los renders futuros, ya estilizadas pero hoy sin uso en el HTML: `.boton--secundario` (botón «Ver detalle» que renderizará el Ejercicio 5 en la columna *Detalle* del historial). Se declara en el CSS y **no** se agrega al HTML en esta fase. No se inventa ninguna otra clase reservada: `.boton--enlace` se descartó por no tener un uso concreto previsto (D8).

### 5.7 Botones y campos de formulario

- `.boton` — base común: `display: inline-flex; align-items: center; justify-content: center; gap: var(--esp-2); min-block-size: 2.75rem (44 px, objetivo táctil mínimo); padding: var(--esp-2) var(--esp-4); border: 1px solid transparent; border-radius: var(--radio-2); font: inherit; font-weight: 600; cursor: pointer; text-align: center;`
- `.boton` (primario) — fondo `--color-acento`, texto `#ffffff` (5,91:1); `:hover` → `--color-acento-hover` (7,60:1); `:active` → `--color-acento-activo` (9,17:1).
- `.boton--secundario` — fondo `--color-superficie`, texto `--color-texto`, borde 1 px `--color-texto-suave` (7,33:1, cumple 3:1 para identificar el control); `:hover` → fondo `--color-superficie-alt`.
- `.boton--modificar` — misma familia que `.boton--secundario` (acción neutra).
- `.boton--quitar` — fondo `--color-error` (7,32:1 con texto blanco), texto `#ffffff`; `:hover` → `--color-error-hover` (9,15:1). Es la **acción destructiva**, distinguible del primario no solo por color sino por su etiqueta textual «Quitar renglón» (R-04).
- `.campo__control` — `padding: var(--esp-2) var(--esp-3); border: 1px solid var(--color-texto-suave); border-radius: var(--radio-2); background: var(--color-superficie); color: var(--color-texto); font: inherit; min-block-size: 2.75rem;` El borde usa `--color-texto-suave` y **no** `--color-borde-fuerte` (§7.9, D1).
- `select[multiple]` — `min-block-size: 8rem;` para que la selección múltiple sea utilizable.
- `.campo label` — `font-weight: 600; color: var(--color-texto);` (selector de descendiente; no hay `#id`).

### 5.8 Estilos de preparación para los render de los Ejercicios 3–6

Estas reglas existen **para que el JavaScript de los Ejercicios 3–6 pueda insertar contenido** con la identidad visual ya resuelta. **No se implementa ningún render**: las plantillas `<template>` siguen inertes y `js/app.js` sigue vacío (R-07, CA-04).

| Clase | Regla propuesta | Nota |
|---|---|---|
| `.libro` | `padding: var(--esp-4); background: var(--color-superficie); border: 1px solid var(--color-borde-fuerte); border-radius: var(--radio-3); box-shadow: var(--sombra-1); min-inline-size: 0;` | Tarjeta del catálogo. |
| `.libro:hover` | `box-shadow: var(--sombra-2);` | **Único uso de `--sombra-2`**: estado elevado al pasar el puntero. |
| `.libro__titulo` | `font-family: var(--fuente-titulo); font-size: var(--tamano-titulo-3); margin: 0; overflow-wrap: anywhere;` | Título del libro (`<h3>`), en la pila serif. |
| `.libro__datos` | `display: grid; grid-template-columns: max-content 1fr; gap: var(--esp-1) var(--esp-3); margin: 0;` | Grilla de pares `dt`/`dd`. |
| `.libro__datos dt` | `font-weight: 600; color: var(--color-texto-suave);` | Rótulo del dato (ISBN, Editorial, Género, Autores, Precio). |
| `.libro__datos dd` | `margin: 0; color: var(--color-texto); overflow-wrap: anywhere;` | Valor del dato. El `margin: 0` anula el `margin-inline-start: 40px` del *user agent*. |
| `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio` | `margin: 0; color: var(--color-texto);` | Los cinco `<dd>` comparten la misma regla; no necesitan reglas propias. |
| `.fila-renglon` | — (hereda de `.tabla tbody tr`) | Fila de renglón. |
| `.fila-renglon__libro` | `text-align: start;` | Celda del libro. |
| `.fila-renglon__cantidad`, `.fila-renglon__precio-unitario`, `.fila-renglon__subtotal` | `font-variant-numeric: tabular-nums; text-align: end;` | Columnas numéricas alineadas a la derecha, con cifras de ancho constante. |
| `.fila-renglon__acciones` | `white-space: nowrap;` | **Nunca `display: flex`** (§7.4-12): los dos botones quedan en línea por su display `inline-flex`. |
| `.fila-renglon__acciones .boton + .boton` | `margin-inline-start: var(--esp-2);` | Separación entre «Quitar» y «Modificar» sin recurrir a flex. |
| `.venta__total` | `display: flex; justify-content: space-between; gap: var(--esp-4); padding: var(--esp-3) var(--esp-4); background: var(--color-superficie-alt); border-radius: var(--radio-2); font-size: var(--tamano-titulo-3); font-weight: 600;` | Bloque del total de la venta. |
| `.venta__total output` | `font-variant-numeric: tabular-nums; font-weight: 700;` | El `<output id="venta-total">` muestra el importe con cifras tabulares. |
| `.detalle-venta` | `display: grid; gap: var(--esp-4); padding: var(--esp-4); background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-3);` | Panel del detalle de la venta seleccionada. |

### 5.9 Responsive (mobile-first)

| Punto de corte | Qué cambia |
|---|---|
| Base (320 px) | Una sola columna. `.contenido` con `padding: var(--esp-4)`. Botones de formulario a ancho completo (`justify-self: stretch; inline-size: 100%`). |
| `@media (min-width: 48rem)` (768 px) | `.contenido { padding: var(--esp-6); gap: var(--esp-8); }`; `.vista { padding: var(--esp-6); }`; `.formulario { grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); }`; botones de formulario a ancho intrínseco (`justify-self: start; inline-size: auto;` — hace falta `justify-self`, porque `inline-size: auto` no encoge un ítem de grid cuyo `justify-self` por defecto es `stretch`, D13). |
| `@media (min-width: 64rem)` (1024 px) | `.contenido` con `padding: var(--esp-8)`; `.vista { padding: var(--esp-7); }`; `.listado--catalogo` con `minmax(min(100%, 20rem), 1fr)` (3–4 tarjetas por fila a 1280 px). |

Ningún `@media` usa `max-width` (mobile-first: se amplían las reglas, no se restringen).

### 5.10 Datos necesarios en esta fase

**Ninguno.** El CSS no consume datos: no hay variables de contenido, ni `attr()`, ni contadores, ni datos simulados. Las 38 clases y la jerarquía del HTML son la única entrada.

Los únicos "datos" de esta fase son **textos fijos ya presentes en el HTML** (rótulos, mensajes, «$0,00» inicial) que el CSS solo presenta; ninguno se modifica. El glifo de cada estado (`✓`, `✕`, `ℹ`) es contenido generado por `::before` y es puramente decorativo: la información real la porta el texto del HTML.

---

## 6. Estados y manejo de errores

Los **10** contenedores de estado verificados en `index.html`, con la variante CSS que los distingue:

| # | Estado | Contenedor | Variante | Señales (color + glifo) | Visibilidad inicial | Quién lo activa |
|---|---|---|---|---|---|---|
| 1 | Catálogo sin libros | `.mensaje--vacio` | `--vacio` | `--color-texto-suave` (5,63:1 sobre el tinte) + `ℹ` | visible | Ej. 3 |
| 2 | Búsqueda sin coincidencias | `.mensaje--vacio` | `--vacio` | idem + `ℹ` | `hidden` | Ej. 3 |
| 3 | Libro registrado | `.mensaje--exito` | `--exito` | `--color-exito` (4,79:1) + `✓` | `hidden` | Ej. 4 |
| 4 | Libro rechazado | `.mensaje--error` | `--error` | `--color-error` (5,54:1) + `✕` | `hidden` | Ej. 4 |
| 5 | Cliente registrado | `.mensaje--exito` | `--exito` | `--color-exito` + `✓` | `hidden` | Ej. 4 |
| 6 | Cliente rechazado | `.mensaje--error` | `--error` | `--color-error` + `✕` | `hidden` | Ej. 4 |
| 7 | Venta registrada | `.mensaje--exito` | `--exito` | `--color-exito` + `✓` | `hidden` | Ej. 5 |
| 8 | Venta rechazada | `.mensaje--error` | `--error` | `--color-error` + `✕` | `hidden` | Ej. 5 |
| 9 | Historial sin ventas | `.mensaje--vacio` | `--vacio` | `--color-texto-suave` + `ℹ` | visible | Ej. 5 |
| 10 | Detalle sin venta seleccionada | `.mensaje--vacio` | `--vacio` | `--color-texto-suave` + `ℹ` | visible | Ej. 5 |

**Reglas de manejo en CSS:**

1. Los 7 estados con `hidden` **permanecen ocultos** gracias a `.mensaje[hidden] { display: none; }` (obligatoria, §2.4).
2. Los 3 estados visibles (1, 9, 10) se muestran desde la primera carga: el CSS no los oculta ni los muestra condicionalmente (eso es lógica del Ej. 3/5).
3. **El significado nunca depende solo del color**: cada variante combina color, filete lateral, glifo `::before` y **texto propio en el HTML**.
4. El JS futuro solo necesita alternar el atributo `hidden` y/o las clases `.mensaje--exito` / `.mensaje--error` / `.mensaje--vacio`: el CSS ya está listo para los tres.
5. Los mensajes son texto seleccionable, con `line-height` cómodo y `max-inline-size` holgado; en 320 px el texto se envuelve sin desbordar (`min-inline-size: 0` + `overflow-wrap: anywhere` en palabras largas).

**Estados de foco (no son "mensajes" pero sí estados observables):** cada control interactivo tiene un estado de foco visible con anillo `--color-foco`; `.tabla-contenedor` con `tabindex="0"` recibe un anillo hacia adentro.

---

## 7. Restricciones técnicas y convenciones

### 7.1 CSS3 moderno con tokens

1. CSS3 moderno: *custom properties*, Flexbox, Grid, `clamp()`, `minmax()`, `min()`, `color-mix()`, `:focus-visible`, `@media`.
2. **Todos** los valores de color, tipografía, espaciado, radio y sombra salen de `:root`. Fuera de `:root` no se repite un literal de color salvo los 3 tokens derivados por `color-mix` y el `#ffffff` del texto de botón.
3. Sin frameworks, sin preprocesadores, sin build, sin `npm`, sin autoprefixer.

### 7.2 Cero URLs externas

4. **Cero URLs externas**: ni `url()`, ni `@import`, ni `@font-face`, ni webfonts, ni Google Fonts. La tipografía usa **solo pilas del sistema** (`--fuente-titulo`, `--fuente-texto`, §5.2.3), por lo que el proyecto sigue siendo 100 % local y abrible con `file://` sin conexión.

### 7.3 Separación y reutilización

5. El CSS vive **únicamente** en `css/styles.css`. `index.html` no se modifica: **0** `style=` inline, **0** `<style>`.
6. Los elementos equivalentes reutilizan las clases existentes. **Prohibido** usar selectores por `id` para dar estilo (se usan clases y selectores de elemento/descendiente).
7. BEM en español: bloque = elemento (`.libro`, `.tabla`, `.mensaje`), elemento = parte (`__titulo`, `__datos`), modificador = estado/variante (`--exito`, `--error`, `--vacio`, `--quitar`). Se respetan los nombres ya presentes en el HTML.

### 7.4 Layout

8. **Mobile-first**: las reglas base corresponden a 320 px; los `@media` usan `min-width`.
9. `box-sizing: border-box` **global** (universal), para que el padding y el borde cuenten dentro del ancho.
10. `min-inline-size: 0` en **todo** hijo de flex/grid que pueda recibir contenido largo (`.campo`, `.campo__control`, `.contenido > *`, `.vista > *`, `.libro`, `.tabla-contenedor`, `.mensaje`): es la causa habitual del scroll horizontal no deseado, porque el `min-width: auto` por defecto de flex/grid impide encoger al ítem por debajo de su contenido.
11. `clamp()` para tipografía y `minmax(min(100%, X), 1fr)` para grillas fluidas: ninguna pista de grilla puede exceder el ancho de su contenedor.
12. **Prohibido `display: flex` sobre un `td`**: la celda de acciones de `.fila-renglon` se alinea con `white-space: nowrap` (los dos botones quedan en línea por su display `inline-flex`, que es de nivel en línea), porque un `td` flex se sale del modelo de tabla y rompe la altura de fila.

### 7.5 Contención del scroll

13. `.tabla-contenedor` es el **único** elemento que puede generar scroll horizontal, y su scroll **no debe propagarse al documento** (`max-inline-size: 100%` + `min-inline-size: 0` + el ítem de grid padre con `min-inline-size: 0`).
14. Su anillo de foco va **hacia adentro** (`outline-offset` negativo) porque tiene `tabindex="0"` y su `outline` por defecto quedaría fuera del área de scroll.

### 7.6 Anclas y navegación

15. `.vista` lleva `scroll-margin-top` (calculado con `--alto-nav`) para que el ancla no quede tapada por la navegación fija.

### 7.7 Accesibilidad

16. `outline: none` está **prohibido** en todo el CSS: no hay reset de outline. El foco se estiliza con `:focus-visible` (2 px `--color-foco` + halo `--sombra-foco`).
17. Cada estado de mensaje lleva **dos** señales, no una: color + glifo `::before` (`✓` éxito, `✕` error, `ℹ` vacío). El texto del HTML sigue siendo el portador principal del significado.
18. `.mensaje[hidden] { display: none; }` con especificidad superior a la regla de layout del mensaje.

### 7.8 Movimiento

19. `!important` está **prohibido**, salvo en el bloque `@media (prefers-reduced-motion: reduce)`, donde es **necesario** para anular transiciones y animaciones más específicas (`transition-duration`, `animation-duration`, `animation-iteration-count`). Es la única excepción y queda justificada en el propio bloque con un comentario. El `scroll-behavior` se anula **sin** `!important`, con una regla `html { scroll-behavior: auto; }` dentro del mismo bloque: tiene la misma especificidad que la regla base y, al ir después, gana.

### 7.9 Contraste (cálculo exigido, con resultado)

Regla: **texto normal ≥ 4,5:1** (WCAG 2.1 AA, 1.4.3) y **elementos de interfaz ≥ 3:1** (1.4.11) cuando la información es necesaria para identificar el control.

| Par | Ratio | Veredicto |
|---|---|---|
| `--color-texto` sobre `--color-fondo` | **13,59:1** | AA ✔ |
| `--color-texto` sobre `--color-superficie` | **15,03:1** | AA ✔ |
| `--color-texto` sobre `--color-superficie-alt` | **12,34:1** | AA ✔ |
| `--color-texto-suave` sobre `--color-fondo` | **6,62:1** | AA ✔ |
| `--color-texto-suave` sobre `--color-superficie` | **7,33:1** | AA ✔ |
| `--color-texto-suave` sobre `--color-superficie-alt` | **6,01:1** | AA ✔ |
| `--color-acento` sobre `--color-fondo` / `--color-superficie` | **5,26:1** / **5,82:1** | AA ✔ |
| `#ffffff` sobre `--color-acento` | **5,91:1** | AA ✔ |
| `--color-exito` sobre `--color-superficie` / `--color-acento-suave` | **6,24:1** / **4,79:1** | AA ✔ |
| `--color-error` sobre `--color-superficie` / `--color-acento-suave` | **7,20:1** / **5,54:1** | AA ✔ |
| `#ffffff` sobre `--color-error` | **7,32:1** | AA ✔ |
| `--color-foco` sobre `--color-fondo` / `--color-superficie` | **6,13:1** / **6,78:1** | AA ✔ (y ≥ 3:1 para el anillo) |
| `--color-texto-suave` sobre `--color-acento-suave` | **5,63:1** | AA ✔ |
| **`--color-acento` sobre `--color-acento-suave`** | **4,47:1** | **✘ NO cumple AA para texto normal** (D2) |
| **`--color-borde-fuerte` sobre `--color-superficie`** | **2,26:1** | **✘ NO cumple 3:1 para UI** (D1) |
| `--color-borde` sobre `--color-superficie` | 1,54:1 | Decorativo, no identifica control ✔ |

**Los dos hallazgos y su resolución (decididas en esta SPEC, con fundamento medido — §9, D1 y D2):**

- **D1 — Bordes de control.** `--color-borde-fuerte` (2,26:1) no alcanza el 3:1 de 1.4.11 para el borde que identifica un campo de formulario. Por eso el borde de `.campo__control` y de `.boton--secundario` usa `--color-texto-suave` (7,33:1), y `--color-borde` / `--color-borde-fuerte` quedan reservados para separadores decorativos (filetes de fila con `--color-borde`; contorno de tarjeta y de `fieldset` con `--color-borde-fuerte`). El filete bajo el `thead` usa `--color-texto-suave` (6,01:1), porque separa el encabezado del cuerpo y sí es información estructural.
- **D2 — Acento sobre su propio tinte.** `--color-acento` sobre `--color-acento-suave` da 4,47:1 (< 4,5:1). Por eso **el texto de los enlaces nunca se apoya sobre `--color-acento-suave`**: el hover/foco de `.nav-enlace` usa `--color-superficie-alt` (acento 4,78:1 ✔), y `--color-acento-suave` se usa como **fondo** de mensajes con texto en `--color-exito` / `--color-error` / `--color-texto-suave` (4,79 / 5,54 / 5,63 ✔) o como fondo de chip con texto `--color-texto` (11,55:1 ✔).

### 7.10 Accesibilidad de la lectura (consigna)

20. El requisito de la consigna "Las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria" queda **vacuo**: el proyecto tiene **cero imágenes** (verificado: no hay `<img>`, ni `background-image`, ni `url()`). Se declara **vacuo, no aprobado** (§9, S3).

### 7.11 Política de verificación de esta fase

No hay framework de tests en el proyecto (verificado). La verificación se compone de tres capas:

**(a) Controles objetivos automatizables de solo lectura** sobre `css/styles.css` e `index.html`:
coincidencia cero de `style=` inline, `<style>`, URLs externas (`http://`, `https://`, `//`), `!important` fuera del bloque justificado de `prefers-reduced-motion`, `width:` fijo en px que impida adaptación, y selectores por `id` usados para estilo; y presencia de las reglas clave esperadas (`:focus-visible`, `.tabla-contenedor { overflow-x: auto }`, `.mensaje[hidden]`, `:root` con los tokens, `box-sizing: border-box`, `min-inline-size: 0`, `clamp(`, `minmax(`).

**(b) Comprobación real en navegador** a **320 px** y **1280 px**, sobre una **copia temporal** del proyecto (`%TEMP%\opencode\verif-ej2\`, copiando `index.html` y la carpeta `css/`), con un `<script>` agregado **a la copia** que mide y reporta. `index.html` del proyecto **no se modifica**. Binario verificado: `C:\Program Files (x86)\Microsoft\EdgeCore\155.0.4283.62\msedge.exe` con `--headless=new --disable-gpu --virtual-time-budget=… --dump-dom`.

**Obtención del viewport exacto de 320 px (método obligatorio, medido en §2.5).** Edge headless **impone un ancho mínimo de ventana**: `--window-size=320,800` devuelve `innerWidth` = 492 px, con cualquiera de las variantes probadas. Por eso el control de 320 px se ejecuta con este **arnés**, en la carpeta temporal:

1. `arnes.html` contiene dos `<iframe>`: uno de `width:320px` y otro de `width:1280px`, ambos apuntando a la copia instrumentada.
2. La copia instrumentada mide **dentro** de su propio iframe (donde `window.innerWidth` vale exactamente 320 o 1280, y las media queries se evalúan contra ese ancho) y reporta por `window.parent.postMessage({w, lines}, "*")`.
3. El arnés escucha el `postMessage` y vuelca las líneas en su propio `<pre id="medidas">`, que es lo que se lee con `--dump-dom`.

**Restricción del método (medida en §2.6):** el script de medición **no debe inyectar ningún elemento en la página medida** (un `<pre>` con líneas largas ensancha el documento y produce un `scrollWidth` falso: 2085 px con él, 305 px sin él, con CSS idéntico). El reporte va **siempre** por `postMessage`.

**Controles que se miden:** `document.documentElement.scrollWidth` frente a `clientWidth` (deben cumplir `scrollWidth <= clientWidth`); que `.tabla-contenedor` produzca desplazamiento propio (`scrollWidth > clientWidth`); que ningún elemento **fuera de un contenedor con scroll** rebase el `innerWidth`; que los 7 mensajes con `hidden` tengan `display: none` y los 3 visibles se muestren; que la media query de 48rem esté inactiva a 320 px y activa a 1280 px; y los tamaños de fuente calculados (`h1` y body) contra los extremos del `clamp()`.

**Capturas:** `msedge --headless=new --disable-gpu --window-size=… --screenshot=…` para 320 px y 1280 px, guardadas **fuera** del proyecto (carpeta temporal). La revisión visual de esas capturas se registra como **omitida con motivo** si el modelo no puede inspeccionar imágenes, tal como se hizo en el Ejercicio 1.

**(c) Registro de evidencia** por control con estado **aprobado / fallido / omitido / pendiente** y su motivo. Ningún control no ejecutado se presenta como aprobado.

---

## 8. Criterios de aceptación

- [ ] **CA-01 — Identidad visual y organización (R-01, R-02, R-06):** `css/styles.css` define color, tipografía, espaciado, tarjetas, formularios, botones, tablas y mensajes; los tokens están declarados como custom properties en `:root`; los elementos equivalentes reutilizan las clases existentes y no hay selectores por `id` usados para estilo; no hay CSS inline ni URLs externas.
- [ ] **CA-02 — Adaptación (R-05):** a 320 px y a 1280 px no hay desplazamiento horizontal de la página (`scrollWidth <= clientWidth`); tablas anchas se desplazan dentro de su `.tabla-contenedor`; textos y controles son legibles en ambos anchos.
- [ ] **CA-03 — Accesibilidad básica (R-04):** todos los controles conservan foco visible con contraste suficiente; el recorrido por teclado alcanza y opera enlaces, campos, botones y contenedores con `tabindex`; los mensajes de error se comprenden por su texto y no dependen únicamente del color.
- [ ] **CA-04 — Estados y preparación (R-03, R-07):** los 10 contenedores de estado tienen estilo coherente y distinguible; el atributo `hidden` se respeta; los estilos de tarjeta de libro, fila de renglón, total y detalle de venta están preparados para el render de los Ej. 3–6 sin implementar ese render.
- [ ] **CA-05 — Alcance puro (global):** Se cubre todo el alcance aprobado y no se incorpora trabajo excluido (no se modifica `index.html` ni `js/app.js`; no hay JS, datos, imágenes, README ni modo oscuro).
- [ ] **CA-06 — Convenciones (global):** Se respetan las tecnologías, dependencias y convenciones permitidas: CSS3 moderno con custom properties, BEM en español, mobile-first, `box-sizing: border-box` global, `min-inline-size: 0` en hijos flexibles, `clamp()`/`minmax()`, sin `!important` sin justificación, sin `style=` inline, sin URLs externas.
- [ ] **CA-07 — Verificación (R-08):** Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia.
- [ ] **CA-08 — Integridad de la evidencia (R-08):** Se distinguen los controles aprobados, fallidos, omitidos y pendientes; ningún control no ejecutado se presenta como aprobado.
- [ ] **CA-09 — Trazabilidad (global):** Los supuestos, placeholders pendientes y limitaciones quedan identificados.

---

## 9. Supuestos, información pendiente y decisiones que requieren tu respuesta

### 9.1 Decisiones resueltas (datos consolidados de la consigna del ejercicio — 2026-10-20)

Vienen fijadas y **no se re-litigan** en esta SPEC:

- **P1 — Paleta:** los 12 tokens de color con sus valores y roles (tabla de §5.2.1).
- **P2 — Tipografía:** dos pilas del sistema (serif para títulos, `system-ui` para texto) y escalas fluidas con `clamp()`: base 16→17 px, títulos 22→40 px. Cero webfonts, cero URLs externas.
- **P3 — Espaciado, radios y sombras:** múltiplos de 4 px (`--esp-1`…`--esp-8`), radios 4/8/14/999 px, sombras `--sombra-1`/`--sombra-2`/`--sombra-foco`.
- **P4 — Los 7 puntos técnicos:** se fijan obligatoriamente en el CSS (`.mensaje[hidden]`, prohibición de `display:flex` en `td`, `min-inline-size: 0`, `.tabla-contenedor` como único origen de scroll con anillo hacia adentro, `scroll-margin-top` en `.vista`, dos señales por estado de mensaje, prohibición de `outline: none`).
- **P5 — Verificación:** la medición en navegador se hace sobre una **copia temporal**, sin modificar `index.html`; las capturas se guardan fuera del proyecto.

### 9.2 Decisiones tomadas en esta SPEC (con fundamento medido — requieren tu confirmación, no bloquean el PLAN)

| ID | Decisión | Fundamento |
|---|---|---|
| **D1** | El borde de los campos de formulario y de los botones secundarios usa `--color-texto-suave`, no `--color-borde-fuerte`. `--color-borde` / `--color-borde-fuerte` quedan como separadores decorativos. | `--color-borde-fuerte` sobre `--color-superficie` = 2,26:1 < 3:1 (WCAG 1.4.11). `--color-texto-suave` = 7,33:1 ✔. |
| **D2** | El texto de los enlaces nunca se apoya sobre `--color-acento-suave`; el hover/foco de `.nav-enlace` usa `--color-superficie-alt`. | `--color-acento` sobre `--color-acento-suave` = 4,47:1 < 4,5:1. Sobre `--color-superficie-alt` = 4,78:1 ✔. |
| **D3** | El fondo de los 10 mensajes es `--color-acento-suave`; el texto usa el color del estado (exito 4,79:1 · error 5,54:1 · texto-suave 5,63:1). | Los tres cumplen AA sobre el tinte; ningún color de estado sobre `--color-superficie-alt` sería necesario. |
| **D4** | La navegación es `position: sticky` con `--alto-nav: 3rem`; `.vista` usa `scroll-margin-top: calc(var(--alto-nav) + var(--esp-4))`. | La consigna no exige navegación de una sola vista; `sticky` no altera el flujo ni exige `padding-top` compensatorio en el `body`. |
| **D5** | `.tabla { inline-size: 100%; min-inline-size: max-content; }`. | Permite que la tabla ocupe el ancho sobrante y empuje el scroll **dentro** del contenedor cuando el contenido no entra. |
| **D6** | Sin filas alternadas ("zebra"); el `thead` usa `--color-superficie-alt` y el hover de fila también, para no competir dos superficies en la misma tabla. | Coherencia visual; el hover basta para señalar la fila. |
| **D7** | Alineación numérica con `font-variant-numeric: tabular-nums` en el documento, sin alinear columnas por `id`/`nth-child`. | CA-01 prohíbe selectores por `id` para estilo y el HTML no tiene clases por columna; añadir clases al HTML está fuera de alcance. |
| **D8** | Se declara en el CSS **una sola** clase reservada, `.boton--secundario` (para el botón «Ver detalle» del Ej. 5), sin agregarla al HTML. | CA-04 exige preparación de los estilos de las etapas futuras sin implementarlas. Se descartó inventar `.boton--enlace`: no tiene un uso previsto concreto. |
| **D9** | `scroll-behavior: smooth` en `html`, anulado por el bloque `prefers-reduced-motion`. | Mejora la navegación por anclas sin afectar el layout; el bloque de movimiento reducido lo desactiva. |
| **D11** | El `thead` **no** lleva `position: sticky`. | `.tabla-contenedor` no tiene `max-block-size`, así que no hay scroll vertical y el `sticky` sería un efecto nulo (y con `border-collapse: collapse` el filete colapsado no acompaña al `th` en Chrome). Un encabezado fijo por tabla no se aplica: cada vista ya es un panel con su propio título. |
| **D12** | `.pie { margin-block-start: auto; }`. | En un contenedor flex vertical con `justify-content: flex-start` (por defecto), el espacio libre queda **debajo** del pie: sin esta regla el pie no queda al pie de la ventana. |
| **D13** | Los botones de formulario se encogen a ≥48 rem con `justify-self: start`, no con `inline-size: auto`. | El `justify-self` por defecto de un ítem de grid es `stretch`: lo estira a la columna de todos modos. `inline-size: auto` solo no alcanza. |
| **D14** | `.renglon-alta` declara `background-color: var(--color-superficie)`. | El recorte nativo del `<legend>` se rellena con el fondo del fieldset; si el fieldset es transparente, el borde puede verse detrás del texto del legend. En Edge 155 el recorte ya se compone con el color del panel (verificado por análisis de píxeles: el borde se corta correctamente), por lo que la regla es **defensiva y no cambia el render medido**. |
| **D10** | No se marca la vista activa en la navegación. | Hacerlo en CSS puro exige `body:has(#catalogo:target) .nav-enlace[href="#catalogo"]`, o sea **selectores por `id` usados para estilo**, lo que contradice R-02 y CA-01. Queda para el Ejercicio 3, donde el JS puede resolverlo sin selectores por `id`. |

### 9.3 Decisión resuelta por el usuario (2026-10-20)

**P1 — Presentación de las 5 vistas: RESUELTA → Opción A (vistas apiladas).** Las 5 `<section class="vista">` se muestran **todas, apiladas en el flujo normal** de la página, cada una como un **panel de superficie** propio. La navegación del `<nav>` sigue siendo un salto por ancla (`href="#catalogo"`, etc.) con la navegación *sticky* y el `scroll-margin-top` de §5.3.

La SPEC del Ejercicio 1 (§5.1, decisión P1) había dejado esta decisión explícitamente para el Ejercicio 2: *"el mostrado exclusivo de una vista (ocultar las demás) requiere CSS `:target`/clases (Ej. 2) o JS (Ej. 3); hasta entonces las 5 vistas quedan apiladas y visibles en la misma página"*.

**Consecuencias de la resolución:**

| Aspecto | Comportamiento resultante |
|---|---|
| Separación entre vistas | Cada `.vista` es un panel con fondo `--color-superficie`, borde `--color-borde`, radio `--radio-3` y `--sombra-1`; el `gap` de `.contenido` las separa (`var(--esp-7)` en la base, `var(--esp-8)` desde 48 rem). |
| Salto por ancla | Funciona sin JS: `scroll-margin-top: calc(var(--alto-nav) + var(--esp-4))` evita que la navegación *sticky* tape el título del panel. |
| Estados iniciales | Los 3 mensajes visibles (catálogo vacío, historial vacío, detalle sin selección) quedan dentro de su panel; los 7 ocultos siguen ocultos. |
| Vista activa en la navegación | **No se marca.** Hacerlo en CSS puro exigiría `body:has(#catalogo:target) .nav-enlace[href="#catalogo"]`, es decir **selectores por `id` usados para estilo**, lo que contradice R-02 y CA-01. Se deja para el Ejercicio 3, donde el JS puede marcar la vista activa sin selectores por `id` (ver D10). |
| Lo que **no** se implementa | Nada de la Opción B: no hay `display: none` por defecto en las vistas, ni `:target`, ni conmutador de pantalla, ni vista inicial forzada. |
| Impacto en las mediciones | No cambia el control de scroll: con las 5 vistas apiladas, el documento se mide igual a 320 px y 1280 px (§7.11). El prototipo de §2.6 ya se midió **con las 5 vistas apiladas**. |

### 9.4 Supuestos declarados

- **S1:** La consigna se leyó mediante extracción de texto del PDF (`pypdf`); el texto coincide con el resumen del encargo, pero el diseño de página del PDF no fue inspeccionado.
- **S2:** El HTML del Ejercicio 1 se considera aprobado y **no se modifica**: la solución debe expresarse con las 38 clases existentes. Si en la implementación resultara imprescindible una clase adicional, se informa antes de tocar el HTML.
- **S3 (vacuo, declarado):** el proyecto tiene **cero imágenes** (verificado). Por eso el requisito de la consigna "las imágenes informativas tienen texto alternativo" queda **vacuo** — se declara como tal, **no como aprobado**.
- **S4:** La paleta se toma tal cual fue provista. Los dos casos que no alcanzan el umbral buscado (`--color-acento` sobre `--color-acento-suave` = 4,47:1 y `--color-borde-fuerte` sobre superficie = 2,26:1) **no se corrigen cambiando la paleta**: se corrigen con el mapeo de uso de §9.2 (D1, D2), de modo que la identidad visual se mantiene intacta.
- **S5:** El binario de navegador disponible es **EdgeCore 155.0.4283.62**, que **no está en el `PATH`**; la verificación headless lo invocará por ruta absoluta. No se verificó el comportamiento con otros navegadores (Firefox, Safari, Chrome), que no están instalados en la máquina.
- **S6:** El texto del glifo de cada estado (`✓`, `✕`, `ℹ`) se considera decorativo: la información la porta el texto del HTML, por lo que no se requiere texto alternativo adicional para el pseudo-elemento.
- **S7:** Se asume que la revisión visual humana de las capturas a 320 px y 1280 px queda a cargo del docente/lector, igual que en el Ejercicio 1, si el modelo no puede inspeccionar imágenes.
- **S8:** El control de 320 px se ejecuta con el **arnés de `<iframe>`** (§7.11), no con `--window-size`, porque Edge headless impone un ancho mínimo de 492 px (medido). Las media queries y el `clamp()` se evalúan dentro del iframe contra el ancho exacto de 320 px, de modo que la medición es equivalente a abrir la página en una ventana de 320 px.
- **S9:** La validación de §2.6 se hizo sobre un **prototipo mínimo** en carpeta temporal, no sobre el CSS final: valida el comportamiento de las reglas de riesgo, no la maqueta visual completa. La Fase 3 repite esas mismas mediciones sobre el CSS definitivo.

### 9.5 Información pendiente (no bloqueante)

- `{{DATO_PENDIENTE: ancho de barra de desplazamiento del sistema y su efecto en el cálculo de scrollWidth/clientWidth en la verificación headless}}` — **parcialmente resuelto por medición**: a 320 px de viewport se midió `innerWidth` = 320 y `clientWidth` = 305 (barra vertical de 15 px); a 1280 px, `innerWidth` = 1280 y `clientWidth` = 1265. La barra vertical es del documento, no de `.tabla-contenedor`, y en ambas medidas `scrollWidth == clientWidth`. En la Fase 3 se repetirá la medición con `--hide-scrollbars` y se informará la diferencia si la hay.
- `{{DATO_PENDIENTE: confirmación de que no existen otras hojas de estilo o recursos cargados por el navegador (por ejemplo, hojas de estilo del user agent que extiendan los valores por defecto de tabla)}}` — verificable en la Fase 3 con `document.styleSheets.length` en la copia temporal; en el prototipo se midió `document.styleSheets.length` = 1 (solo `css/styles.css`).
- `{{DATO_PENDIENTE: revisión humana de las capturas a 320 px y 1280 px}}` — las capturas se generan en la Fase 3, pero su inspección visual queda fuera del alcance del agente si no puede leer imágenes (§9, S7).

---

**Fin de la Fase 1 (SPEC). No se escribió ni modificó ningún archivo de producto (`index.html`, `css/styles.css`, `js/app.js`): solo este documento en `docs/`. La decisión P1 quedó resuelta (Opción A, §9.3). El plan de la Fase 2 está en `docs/ejercicio2-plan.md`; la Fase 3 (IMPLEMENTACIÓN) requiere autorización explícita.**
