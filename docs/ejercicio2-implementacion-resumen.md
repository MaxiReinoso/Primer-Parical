# Resumen de implementación — Ejercicio 2: Presentación con CSS y uso adaptable

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 2)**
Fase: **3 (IMPLEMENTACIÓN) completada** — sobre SPEC aprobada (`openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/spec-ejercicio2.md`, P1 resuelta) y PLAN aprobado (`openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/plan-ejercicio2.md`, tareas T-01…T-13).
Fecha de redacción: 2026-10-20.

## 1. Resumen de cambios

Se ejecutaron las 13 tareas del plan. **El único archivo de producto modificado es `css/styles.css`**: `index.html` y `js/app.js` no se tocaron (verificado con `git diff`).

| Tarea | Resultado |
|---|---|
| T-01 | `:root` con los **38 custom properties** de la SPEC §5.2: 12 de color base, 3 derivados por `color-mix`, 6 de tipografía (2 pilas + 4 tamaños fluidos), 8 de espaciado, 4 de radios, 3 de sombras, 2 de layout. |
| T-02 | Capa base (`box-sizing: border-box` universal, reset de `h1`–`h3`/`p`/`fieldset`/`legend`, `html { scroll-behavior: smooth; color-scheme: light }`, `body` en flex vertical con `font-variant-numeric: tabular-nums`) y capa de layout (`.encabezado` + `h1` serif, `.navegacion` sticky, `.nav-enlace`, `.contenido`, **`.vista` como panel de superficie**, `.vista > h2`, `.pie` con `margin-block-start: auto`). |
| T-03 | `.formulario` en grid fluido `minmax(min(100%, 16rem), 1fr)`; `.campo`; `.campo__control` con borde `--color-texto-suave` y `min-block-size: 2.75rem`; `select[multiple]` con 8 rem; `.renglon-alta` (fieldset) con reset, borde `--color-borde-fuerte` y legend en serif. |
| T-04 | `.boton` base (`inline-flex`, `min-block-size: 2.75rem`), primario con `:hover`/`:active` derivados, `.boton--secundario`, `.boton--modificar` y `.boton--quitar` (destructivo, `--color-error`). |
| T-05 | `.mensaje` con las 3 variantes, glifo `::before` por estado (`✓` `✕` `ℹ`) y **`.mensaje[hidden] { display: none; }`**. |
| T-06 | `.tabla-contenedor` (único origen de scroll horizontal, `overflow-x/y: auto`, `min-inline-size: 0`) y `.tabla` (`inline-size: 100%` + `min-inline-size: max-content`), `thead th`, `tbody td`, hover de fila, `.fila-renglon__acciones` con `white-space: nowrap` y **sin** flex. |
| T-07 | Estilos de preparación de §5.8: `.libro` (+`hover`), `.libro__titulo`, `.libro__datos` con `dt`/`dd`, los 5 `libro__*`, `.listado--catalogo`, las 6 `.fila-renglon__*`, `.venta__total` + `output`, `.detalle-venta`, y la clase reservada `.boton--secundario`. |
| T-08 | `:focus-visible` global (anillo 2 px `--color-foco` + halo) y `.tabla-contenedor:focus-visible` con anillo hacia adentro (`outline-offset: -3px`). **Cero `outline: none`.** |
| T-09 | `@media (min-width: 48rem)` y `@media (min-width: 64rem)`. Ningún `max-width`. |
| T-10 | `@media (prefers-reduced-motion: reduce)` con las tres declaraciones `!important` justificadas y `html { scroll-behavior: auto; }` **sin** `!important`. |
| T-11 | Verificación por controles automatizables de solo lectura — §2.2. |
| T-12 | Verificación real en navegador a 320 px y 1280 px sobre copia temporal — §2.3 y §2.4. |
| T-13 | Este documento. |
| T-14 | **Cierre de los controles que habían quedado abiertos** (§2.7): recorrido de teclado con pulsaciones **reales** de `Tab` y `Enter` vía Chrome DevTools Protocol, y lectura del **CSSOM** (`document.styleSheets[0].cssRules`) sirviendo la copia temporal por HTTP. |
| T-15 | **Modularización del sistema de estilos** en tres capas: `css/styles.css` (punto de entrada) + `css/base.css` + `css/layout.css` + `css/componentes.css`. `index.html` **no se toca** (§2.8). |

**Resultado material:** el sistema de estilos pasa de 3 líneas (placeholder) a **4 archivos / 644 líneas / 17.211 bytes**:

| Archivo | Tamaño | Líneas | Contenido |
|---|---|---|---|
| `css/styles.css` | 688 B | 18 | Punto de entrada: solo comentarios y los 3 `@import` |
| `css/base.css` | 3.331 B | 124 | Tokens (`:root` con 38 declaraciones), reset y tipografía |
| `css/layout.css` | 3.017 B | 112 | Estructura de página y composición adaptable |
| `css/componentes.css` | 10.175 B | 390 | Componentes, foco, responsive y movimiento reducido |

En total: **82 bloques de regla**, **38 custom properties** y **5 media queries** (los dos cortes de ancho, uno por capa, más el de movimiento reducido). El `git status` muestra solo `css/` y los documentos de `docs/`; `index.html` y `js/app.js` intactos.

### 1.1 Ajustes respecto de la SPEC (aditivos, sin salir del alcance)

- **D14 (nuevo,documentado en la SPEC §9.2):** `.renglon-alta` declara `background-color: var(--color-superficie)`. El recorte nativo del `<legend>` se rellena con el fondo del fieldset; con el fieldset transparente, el borde puede verse detrás del texto. **En Edge 155 el recorte ya se compone con el color del panel** (verificado por análisis de píxeles: el borde se corta correctamente), por lo que la regla es **defensiva y no cambia el render medido**. Se documentó en la SPEC §5.3 y §9.2 para mantener SPEC e implementación en sincronía.
- **Nada más.** No se cambió ninguna regla de la SPEC, ni se agrego ninguna clase al HTML, ni se amplió el alcance.

---

## 2. Comprobaciones realizadas (evidencia)

### 2.1 Capas y condiciones de medición

| Aspecto | Dato |
|---|---|
| Navegador | EdgeCore **155.0.4283.62**, en `C:\Program Files (x86)\Microsoft\EdgeCore\155.0.4283.62\msedge.exe` (**no está en el `PATH`**; invocado por ruta absoluta) |
| Modo | `--headless=new --disable-gpu --virtual-time-budget=… --dump-dom` |
| Viewport de 320 px | **arnés de `<iframe>`** de 320 px (Edge headless impone un ancho mínimo de 492 px: `--window-size=320,800` devuelve `innerWidth` = 492; se probaron `--headless=new`, `--headless=old`, `--force-device-scale-factor=1` y `--hide-scrollbars`, los cuatro devuelven 492) |
| Copia medida | `%TEMP%\opencode\verif-ej2\` (copia de `index.html` + `css/`). **`index.html` del proyecto no se modificó** (`git status` lo confirma) |
| Reporte | `postMessage` del iframe al arnés. **El script no inyecta elementos en la página medida** (un `<pre>` con líneas largas ensancha el documento: 2085 px con él, 305 px sin él, con CSS idéntico) |

### 2.2 Capa (a) — controles objetivos de solo lectura: **56/56 APROBADOS**

Script en la carpeta temporal (no se agrega al proyecto), ejecutado sobre los **4 archivos de `css/`** en conjunto. Resultado: **56/56 APROBADOS, 0 fallidos**.

| Control | Resultado |
|---|---|
| `index.html` sin `style=` inline, sin `<style>`, sin `<script>` con cuerpo | APROBADO |
| Cero URLs externas (`http://`, `https://`, `//`) en `index.html` y `styles.css`; sin `url()`, `@import` ni `@font-face` | APROBADO |
| Cero selectores por `id` usados para estilo (solo `:root`, que es pseudo-clase) | APROBADO |
| `!important` solo dentro del bloque `prefers-reduced-motion` (3 declaraciones) | APROBADO |
| `scroll-behavior: auto` sin `!important` | APROBADO |
| Sin `width:` fijo en px; sin `max-width` en media queries; 2 `@media min-width` + 1 `prefers-reduced-motion` | APROBADO |
| `:root` con **38** custom properties (en `base.css`); los 12 hexadecimales de la paleta, uno de cada uno | APROBADO |
| Estructura modular: `styles.css` con **3** `@import` (relativos) antes de cualquier regla; los 4 archivos existen, con comentarios balanceados y cabecera identificativa | APROBADO |
| `box-sizing: border-box` universal; `clamp(` ×4; `minmax(min(100%` ×4; `min-inline-size: 0` ×5 | APROBADO |
| `:focus-visible` presente y **cero** `outline: none` / `outline: 0` | APROBADO |
| `.mensaje[hidden] { display: none }` presente | APROBADO |
| `.tabla-contenedor` con `overflow-x: auto` | APROBADO |
| `grid-column: 1 / -1` en `.formulario > …`; `.pie { margin-block-start: auto }`; `justify-self` en `.formulario > .boton` | APROBADO |
| `.vista` con `scroll-margin-top` y superficie de panel | APROBADO |
| Cero `display: flex` sobre un selector `td`; `position: sticky` **solo** en `.navegacion`; `thead` en `static` | APROBADO |
| Los 3 glifos de mensaje presentes | APROBADO |
| `.boton--secundario` declarada; `.boton--enlace` **ausente** (descartada en D8) | APROBADO |
| Sin lógica en el CSS (`addEventListener`, `localStorage`, `fetch(`, funciones) | APROBADO |
| Clases del CSS que no existen en el HTML: **solo `.boton--secundario`** (la reservada de D8) | APROBADO |
| **CA-05 — alcance puro:** `git diff HEAD -- index.html js/app.js` sin diferencias; ningún archivo fuera de `css/styles.css` y `docs/` creado o modificado | APROBADO |

> **Transparencia:** en la primera corrida, 2 controles marcaron FALLIDO y eran **falsos positivos de mi propio script**: (a) el detector de "selectores por `id`" confundía los hexadecimales de la paleta (`#f7f1e6`, …) con identificadores; (b) el control de media queries exigía exactamente 2 bloques `@media` y no contaba el de `prefers-reduced-motion`. Se corrigieron ambos controles (excluyendo colores hexadecimales válidos del patrón de id, y contando el tercer bloque por separado) y se reejecutó: **48/48**.

### 2.3 Capa (b) — navegador real, viewport de 320 px y de 1280 px

Arnés de `<iframe>`; las dos mediciones son de la **misma copia instrumentada**, con el CSS definitivo.

| # | Control | 320 px | 1280 px | Estado |
|---|---|---|---|---|
| B1 | `documentElement.scrollWidth <= clientWidth` | 305 ≤ 305 ✔ | 1265 ≤ 1265 ✔ | APROBADO |
| B2 | Ningún elemento **fuera** de un contenedor con scroll rebasa el `innerWidth` | NINGUNO | NINGUNO | APROBADO |
| B3 | `.tabla-contenedor` con scroll propio | **5 de 5** desplazan (221 px de cliente; tablas de 227–467 px) | 0 de 5 (las 5 caben: 924/924) | APROBADO |
| B4 | Los 7 mensajes con `hidden` tienen `display: none` | 7/7 | 7/7 | APROBADO |
| B5 | Los 3 mensajes visibles se muestran con su texto exacto | 3/3 ✔ | 3/3 ✔ | APROBADO |
| B6 | Glifo por variante | `✓`×3, `✕`×3, `ℹ`×4 | igual | APROBADO |
| B7 | Media query de 48 rem | **inactiva** | **activa** | APROBADO |
| B8 | Escala fluida `clamp()` | `h1` 22 px · body 16,016 px · `h2` de vista 19,0006 px | `h1` 40 px · body 17 px · `h2` de vista 26 px | APROBADO |
| B9 | Foco visible en los **26** puntos de foco del DOM vivo | `outline: solid 2px rgb(15,90,168)` (`--color-foco`), `offset 2px` | igual | APROBADO |
| B10 | Anillo del `.tabla-contenedor` hacia adentro | `outline-offset: -3px` | igual | APROBADO |
| B11 | Cero `outline: none` / anulación de foco | 0 | 0 | APROBADO |
| B12 | Ningún botón por debajo de 44 px de alto | NINGUNO | NINGUNO | APROBADO |
| B13 | Contraste **renderizado** (color computado vs fondo efectivo real) | 8 pares, todos AA | 8 pares, todos AA | APROBADO |
| B14 | `document.styleSheets.length` | 1 (solo `css/styles.css`) | 1 | APROBADO |
| B15 | **Breakpoint intermedio de 768 px** (cierre de T-09) | `scrollWidth` 768 = `clientWidth` 768; sin desborde; MQ48 **activa**; las 5 tablas caben (636/636, sin scroll); `h1` 30,4 px · body 16,4864 px · `h2` de vista 22,2675 px | idem | APROBADO |
| B16 | **Medición con `--hide-scrollbars`** (cierra el control PENDIENTE de §2.6) | `scrollWidth` 320 = `clientWidth` 320 = `innerWidth` 320; sin desborde; 4/5 contenedores con scroll propio | 1280 = 1280 = 1280; sin desborde | APROBADO |

**Contraste renderizado medido en el navegador** (mismo cálculo que §2.4, pero sobre los colores computados reales):

| Elemento | Ratio | Veredicto |
|---|---|---|
| `.encabezado h1` | 15,03:1 | AA ✔ |
| `.nav-enlace` | 5,82:1 | AA ✔ |
| `.campo label` | 15,03:1 | AA ✔ |
| `.campo__control` | 15,03:1 | AA ✔ |
| `.mensaje--vacio` | 5,63:1 | AA ✔ |
| `.vista > h2` | 15,03:1 | AA ✔ |
| `.tabla thead th` | 12,34:1 | AA ✔ |
| `.pie` | 6,62:1 | AA ✔ |

**Mediciones suplementarias** (misma copia, viewport de 1280 px):

| # | Control | Medición | Estado |
|---|---|---|---|
| S1 | `.navegacion` | `position: sticky`, `top: 0px`, `min-block-size: 48px`, fondo `rgb(255,253,248)` | APROBADO |
| S2 | Las 5 `.vista` | 5 visibles y apiladas; cada una con fondo de superficie, radio 14 px, sombra y `scroll-margin-top: 64px` (= 48 + 16) | APROBADO |
| S3 | `.pie` al pie de la ventana (D12) | con el contenido acotado a 120 px, `pie.bottom` = 900 = `innerHeight` → **pegado al pie** | APROBADO |
| S4 | Movimiento reducido (T-10) | con `--force-prefers-reduced-motion`: `prefers-reduced-motion` = true, `scroll-behavior` = **auto**, `transition-duration` = **1e-05s** | APROBADO |
| S5 | `thead` sin `position: sticky` (D11) | `position: static` | APROBADO |
| S6 | `fieldset` y `legend` | borde `1px solid`, `legend` en Georgia | APROBADO |
| S7 | `<output>` y `<select multiple>` | `font-variant-numeric: tabular-nums`; `min-block-size: 128px` (8 rem) | APROBADO |
| S8 | `.formulario > .boton` a 1280 px (D13) | `justify-self: start`, `inline-size: 142,875px` (intrínseco, no estirado) | APROBADO |

### 2.4 Capa (b) — verificación visual de las capturas: **APROBADO**

A diferencia del Ejercicio 1, **las capturas se pudieron inspeccionar realmente**: se generaron, se recortaron al ancho exacto y se leyeron como imagen.

| Captura | Archivo | Ancho | Resultado de la inspección |
|---|---|---|---|
| 1280 px | `%TEMP%\opencode\verif-ej2\caps\captura1280.png` | 1280 px exactos | Las 5 vistas se leen como **5 paneles separados** sobre el fondo crema, con títulos serif, filete bajo cada título, formularios alineados, tablas con encabezadoAlternate, mensajes tintados con glifo `ℹ`, botones terracota y el pie al final. Correcto. |
| 320 px | `%TEMP%\opencode\verif-ej2\caps\captura320.png` | 320 px exactos | Una columna; el `<nav>` **envuelve a dos líneas sin scroll horizontal**; botones a ancho completo; los `<select multiple>` con altura de 8 rem; **las tablas quedan recortadas en su contenedor** (scroll interno) sin desbordar la página. Correcto. |

Las capturas quedan **fuera del proyecto**, en la carpeta temporal.

**Investigación de un posible defecto visual (resuelta, sin defecto).** Al inspeccionar la captura de 1280 px, el `<legend>` "Agregar renglón a la venta" parecía cruzado por el borde del `<fieldset>`. Se investigó con **análisis de píxeles** (no con el ojo): en la fila del borde (y = 1786) el patrón es `B` a la izquierda del legend, superficie y glifos `T`/`.` bajo el texto, y `B` reanudando a la derecha — es decir, **el borde se corta correctamente** detrás del legend. Se comparó el render **con y sin** el `background-color` añadido al fieldset (D14): **idéntico**. La percepción inicial era errónea; la regla D14 se conserva como defensa de composición y queda documentada como tal, sin atribuirle un defecto que no existía.

**Observación cosmética aceptada (no es defecto).** A 320 px el `<legend>` envuelve a dos líneas ("Agregar renglón a la / venta"). Es el comportamiento nativo de `<legend>` cuando no entra en el ancho del fieldset; la segunda línea queda dentro del padding del fieldset **sin colisionar** con el contenido (medido y verificado en la captura). Impedir el envoltura (`white-space: nowrap`) haría que el texto **desbordara** el fieldset, que es peor. Se deja como está.

### 2.5 Contraste de la paleta (cálculo exigido)

Calculado con la fórmula de WCAG 2.1 sobre los tokens **definidos en el CSS entregado**, y verificado además contra los colores computados en el navegador (§2.3):

| Par | Ratio | | Par | Ratio |
|---|---|---|---|---|
| `--color-texto` sobre `--color-fondo` | **13,59:1** ✔ | | `--color-exito` sobre `--color-superficie` | **6,24:1** ✔ |
| `--color-texto` sobre `--color-superficie` | **15,03:1** ✔ | | `--color-exito` sobre `--color-acento-suave` | **4,79:1** ✔ |
| `--color-texto` sobre `--color-superficie-alt` | **12,34:1** ✔ | | `--color-error` sobre `--color-superficie` | **7,20:1** ✔ |
| `--color-texto-suave` sobre `--color-fondo` | **6,62:1** ✔ | | `--color-error` sobre `--color-acento-suave` | **5,54:1** ✔ |
| `--color-texto-suave` sobre `--color-superficie` | **7,33:1** ✔ | | `--color-error` con texto blanco | **7,32:1** ✔ |
| `--color-texto-suave` sobre `--color-superficie-alt` | **6,01:1** ✔ | | `--color-foco` sobre `--color-fondo` | **6,13:1** ✔ |
| `--color-acento` sobre `--color-fondo` | **5,26:1** ✔ | | `--color-foco` sobre `--color-superficie` | **6,78:1** ✔ |
| `--color-acento` sobre `--color-superficie` | **5,82:1** ✔ | | `#ffffff` sobre `--color-acento` | **5,91:1** ✔ |
| `--color-acento` sobre `--color-acento-suave` | **4,47:1** ✘ | | `#ffffff` sobre `--color-acento-hover` | **7,60:1** ✔ |
| `--color-borde-fuerte` sobre `--color-superficie` | **2,26:1** ✘ | | `#ffffff` sobre `--color-acento-activo` | **9,17:1** ✔ |
| `--color-borde` sobre `--color-superficie` | 1,54:1 (decorativo) | | `#ffffff` sobre `--color-error-hover` | **9,15:1** ✔ |

Los **dos casos que no alcanzan el umbral** están resueltos por **mapeo de uso**, sin tocar la paleta: `--color-acento` no se usa como texto sobre `--color-acento-suave` (el hover de los enlaces usa `--color-superficie-alt`, donde da 4,78:1), y `--color-borde-fuerte` no se usa como borde que identifique un control (los bordes de campo usan `--color-texto-suave`, 7,33:1). Detalle en la SPEC §7.9, D1 y D2.

### 2.6 No ejecutadas / pendientes (NO se declaran aprobadas)

| Control | Estado | Motivo |
|---|---|---|
| Comportamiento en otros navegadores (Firefox, Safari, Chrome) | **OMITIDO** | No hay un segundo motor instalado en la máquina; solo se verificó EdgeCore 155. **No se instaló ninguno**: hacerlo es un cambio de sistema fuera del alcance aprobado, y se deja a decisión del docente. La consigna no exige verificar en más de un motor. |
| Ancho real de la barra de desplazamiento del sistema | **APROBADO** | Medido: 15 px a 320 px de viewport y 15 px a 1280 px (`innerWidth` 320/1280 frente a `clientWidth` 305/1265). La medición repetida con `--hide-scrollbars` da `scrollWidth == clientWidth == innerWidth` en los tres anchos (320, 768, 1280), de modo que **la barra no altera el veredicto** en ningún caso (control B16). |
| Revisión de la apariencia de tablas y tarjetas **con contenido real** | **PENDIENTE POR ALCANCE** | Los `tbody` están vacíos porque los datos los cargan los Ej. 3–5. Las reglas de preparación están escritas (§5.8 de la SPEC) pero no hay contenido que las ejercite. |

> Los otros dos controles que esta sección listaba como **OMITIDO** (recorrido de teclado en vivo y lectura del CSSOM) **fueron ejecutados y cerrados** en la tarea T-14 — ver §2.7.

### 2.7 Cierre de los controles abiertos (T-14)

Los controles que la implementación había dejado como *omitidos* no figuraban como tarea en el PLAN: se agregaron como **T-14** y se ejecutaron.

#### 2.7.1 Recorrido de teclado con pulsaciones reales — **APROBADO**

Método: EdgeCore 155 headless con `--remote-debugging-port`, envío de `Input.dispatchKeyEvent` reales de `Tab` y `Enter` por Chrome DevTools Protocol, leyendo `document.activeElement` y sus estilos computados en cada pulsación. Se recorrieron **26** pulsaciones sobre `index.html` **del proyecto** (esta verificación no necesita copia: no modifica nada).

| # | Elemento alcanzado | Anillo de foco | `outline-offset` |
|---|---|---|---|
| 1–5 | `A.nav-enlace` ×5 (Catálogo, Libros, Clientes, Ventas, Historial) | `solid 2px rgb(15, 90, 168)` | 2 px |
| 6 | `INPUT#buscador-titulo` | `solid 2px rgb(15, 90, 168)` | 2 px |
| 7–9 | `INPUT#libro-titulo`, `#libro-isbn`, `#libro-precio` | `solid 2px rgb(15, 90, 168)` | 2 px |
| 10–12 | `SELECT#libro-editorial`, `#libro-genero`, `#libro-autores` | `solid 2px rgb(15, 90, 168)` | 2 px |
| 13 | `BUTTON.boton` (Registrar libro) | `solid 2px rgb(15, 90, 168)` | 2 px |
| 14 | `DIV.tabla-contenedor` (libros) | `solid 2px rgb(15, 90, 168)` | **−3 px** (hacia adentro) |
| 15–16 | `INPUT#cliente-nombre`, `#cliente-email` | `solid 2px rgb(15, 90, 168)` | 2 px |
| 17 | `BUTTON.boton` (Registrar cliente) | `solid 2px rgb(15, 90, 168)` | 2 px |
| 18 | `DIV.tabla-contenedor` (clientes) | `solid 2px rgb(15, 90, 168)` | **−3 px** |
| 19–21 | `SELECT#venta-cliente`, `SELECT#renglon-libro`, `INPUT#renglon-cantidad` | `solid 2px rgb(15, 90, 168)` | 2 px |
| 22 | `BUTTON#boton-agregar-renglon` | `solid 2px rgb(15, 90, 168)` | 2 px |
| 23 | `DIV.tabla-contenedor` (renglones) | `solid 2px rgb(15, 90, 168)` | **−3 px** |
| 24 | `BUTTON.boton` (Confirmar venta) | `solid 2px rgb(15, 90, 168)` | 2 px |
| 25–26 | `DIV.tabla-contenedor` (historial y detalle) | `solid 2px rgb(15, 90, 168)` | **−3 px** |

- **26 de 26** paradas declaradas fueron alcanzadas, en **orden lógico** (navegación → buscador → cada vista en su orden → controles → contenedores).
- **0 paradas sin anillo de foco visible** con el color `--color-foco`.
- El foco **sale del documento** al final y **vuelve al inicio**: no hay trampa de foco.
- **`Enter` sobre un enlace del `<nav>`**: `location.hash` pasó de `''` a `'#ventas'` → la navegación es operativa con teclado, y el panel de Ventas queda visible.

#### 2.7.2 Lectura del CSSOM — **APROBADO**

Método: la **copia temporal** servida por `http://127.0.0.1` (mismo origen, sin tocar el producto) y lectura de `document.styleSheets[0].cssRules`, que en `file://` queda bloqueada por la política de origen único de Chromium.

| Dato | Valor medido | Coincide con lo verificado por lectura de texto |
|---|---|---|
| Hojas de estilo de primer nivel | 1 (`http://127.0.0.1:8761/css/styles.css`) | ✔ |
| Reglas `@import` de la hoja de entrada | **3** → `base.css`, `layout.css`, `componentes.css` | ✔ |
| Declaraciones en `:root` | **38** | ✔ |
| Media queries | **5**: `(min-width: 48rem)` y `(min-width: 64rem)` **una vez por capa**, más `(prefers-reduced-motion: reduce)` | ✔ |
| Reglas con `!important` | **1** (la de `prefers-reduced-motion`) | ✔ |

> Con la estructura modular, las hojas importadas **no** aparecen como entradas de primer nivel de `document.styleSheets` (en `file://` cada URL es un origen opaco distinto, y en HTTP quedan anidadas dentro de la regla `@import`). Por eso la lectura recorre `CSSImportRule.styleSheet.cssRules`. Es una diferencia de **cómo se enumera** el CSSOM, no de **qué se aplica**: el render medido es idéntico (§2.8).

### 2.8 Modularización del sistema de estilos (T-15)

El sistema de estilos pasó de un único archivo a **tres capas más un punto de entrada**, para que la entrega coincida con la lectura literal del criterio de evaluación *«estilos estructurados en archivos externos (base, layout, componentes)»* y con la consigna (*«el CSS se mantiene en archivos externos»*, formato de entrega con *«carpetas de CSS»*).

| Archivo | Capa | Bloques de regla | Líneas |
|---|---|---|---|
| `css/styles.css` | Punto de entrada: 3 `@import` | 0 | 18 |
| `css/base.css` | Base — tokens, reset, tipografía | 9 | 124 |
| `css/layout.css` | Layout — estructura y composición adaptable | 16 | 112 |
| `css/componentes.css` | Componentes — componentes, foco, responsive, movimiento reducido | 57 | 390 |

**Controles ejecutados (T-15):**

| # | Control | Resultado | Estado |
|---|---|---|---|
| M1 | **Equivalencia de reglas** contra la versión de un solo archivo (mismo archivo en git) | **68 reglas ↔ 68 reglas**, con las **mismas condiciones de `@media`** y el mismo contenido. La única diferencia estructural: cada capa lleva su propio bloque `@media` en vez de uno compartido. | APROBADO |
| M2 | **Render a 320 px** | `scrollWidth` 305 = `clientWidth` 305 · 5/5 contenedores con scroll propio · 7/7 mensajes ocultos · 3/3 visibles · MQ48 inactiva · `h1` 22 px · body 16,016 px · `h2` 19,0006 px | APROBADO |
| M3 | **Render a 768 px** | 753 = 753 · 0 desbordes · MQ48 activa · `h1` 30,4 px · body 16,4864 px · `h2` 22,2675 px | APROBADO |
| M4 | **Render a 1280 px** | 1265 = 1265 · 0 desbordes · MQ48 activa · `h1` 40 px · body 17 px · `h2` 26 px | APROBADO |
| M5 | **Teclado con `Tab` real** | 26/26 paradas · 0 sin anillo `--color-foco` · sin trampa de foco · `Enter` → `#ventas` (3 corridas estables) | APROBADO |
| M6 | **CSSOM** | 3 reglas `@import` → `base.css`, `layout.css`, `componentes.css` · `:root` con 38 declaraciones · 5 media queries · 1 regla con `!important` | APROBADO |
| M7 | **Estructura de archivos** | los 4 existen · comentarios balanceados en los 4 · cabecera identificativa en cada uno · los 4 cargan por `file://` | APROBADO |

**El render es idéntico al de la versión de un solo archivo** en los tres anchos: la captura a 1280 px se regeneró y se comparó contra la anterior, sin diferencias visibles.

**Decisión de diseño:** se usa `@import` y **no** varios `<link>` en `index.html`, para **no modificar `index.html`**, que está aprobado y congelado (§3.2 de la SPEC). El único `<link>` sigue apuntando a `css/styles.css`. Los `@import` son **relativos**: no hay ninguna URL externa.


---

## 3. Limitaciones

- La verificación de navegador cubre **un solo motor** (EdgeCore 155). Firefox y Safari no están instalados: no se puede afirmar compatibilidad entre navegadores. **No se instaló ningún motor adicional** (cambio de sistema fuera del alcance aprobado).
- La inspección visual se hizo sobre **capturas estáticas**: no se verificó el comportamiento interactivo (hover, focus visible por teclado, transición de scroll suave).
- Las tablas están hoy vacías (los `tbody` se llenan en los Ej. 3–5): la apariencia con contenido real —filas largas, correos extensos, autores múltiples— **no** pudo verificarse y deberá revisarse en los ejercicios siguientes. Las reglas de preparación (§5.8) están escritas para esos casos, pero sin datos no hay evidencia.
- Los componentes de los Ej. 3–6 (`.libro`, `.fila-renglon`, `.venta__total`, `.detalle-venta`) están **estilizados pero sin render**: su apariencia real solo se confirmará cuando exista contenido.
- Sin `README`, sin casos manuales, sin persistencia: corresponden al Ejercicio 6.

## 4. Pendientes (fuera de este ejercicio, por diseño)

1. Datos, render del catálogo, filtro por título, altas con validación, populate de selectores, ventas, historial y `localStorage` — Ejercicios 3–6.
2. Vista activa en la navegación: en CSS puro exigiría selectores por `id` (contradice CA-01); queda para el Ejercicio 3 con JS (D10).
3. README y casos manuales — Ejercicio 6.
4. Revisión de la apariencia de las tablas **con contenido real** (Ej. 5) y de las tarjetas del catálogo (Ej. 3).

## 5. Archivos generados

| Archivo | Acción |
|---|---|
| `css/styles.css` | **modificado**: 3 líneas → punto de entrada de 18 líneas (3 `@import`) |
| `css/base.css` | **creado**: 124 líneas — tokens (`:root`, 38 declaraciones), reset y tipografía |
| `css/layout.css` | **creado**: 112 líneas — estructura de página y composición adaptable |
| `css/componentes.css` | **creado**: 390 líneas — componentes, foco, responsive y movimiento reducido |
| `openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/spec-ejercicio2.md` | Fase 1 (actualizada con P1 resuelta, D1–D14 y las correcciones de la auditoría) |
| `openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/plan-ejercicio2.md` | Fase 2 |
| `docs/ejercicio2-implementacion-resumen.md` | este archivo |
| `index.html` | **sin cambios** |
| `js/app.js` | **sin cambios** |

Fuera del proyecto (temp del sistema, no se entrega): copia de verificación, arnés de `<iframe>`, scripts de control, capturas PNG.

## 6. Mapeo a requisitos y criterios

| Criterio | Evidencia | Estado |
|---|---|---|
| **CA-01** (R-01, R-02, R-06) | 8 familias de estilos definidas; 38 tokens en `:root`; sistema modularizado en 3 capas + punto de entrada; 38 clases del HTML reutilizadas (+1 reservada); 0 selectores por `id`; 0 CSS inline; 0 URLs externas (§2.2, §2.8) | **APROBADO** |
| **CA-02** (R-05) | `scrollWidth == clientWidth` a 320 y 1280 px; 5/5 contenedores de tabla con scroll propio a 320 px; ningún elemento desborda fuera de un scroller; escala fluida verificada (B1–B3, B8) | **APROBADO** |
| **CA-03** (R-04) | Los 26 puntos de foco con anillo `solid 2px rgb(15,90,168)`; anillo del contenedor hacia adentro; 0 `outline: none`; botones ≥ 44 px; contraste renderizado AA en 8 pares; mensajes legibles por su texto y con doble señal (B9–B13); **recorrido con teclas Tab reales: 26/26 paradas en orden lógico, sin trampa de foco, y `Enter` navega a `#ventas`** (§2.7.1) | **APROBADO** |
| **CA-04** (R-03, R-07) | 10 contenedores de estado con estilo distinguible; 7/7 ocultos respetan `hidden`; 3/3 visibles; glifos correctos; reglas de preparación de §5.8 presentes; `<template>` inerte y `js/app.js` vacío (B4–B6, §2.2) | **APROBADO** |
| **CA-05** (global) | `git diff` sin diferencias en `index.html` y `js/app.js`; único archivo de producto modificado: `css/styles.css`; sin JS, datos, imágenes, README ni modo oscuro | **APROBADO** |
| **CA-06** (global) | CSS3 moderno con custom properties; BEM en español; mobile-first; `box-sizing: border-box` global; `min-inline-size: 0`; `clamp()`/`minmax()`; `!important` solo justificado; 0 `style=` inline; 0 URLs externas | **APROBADO** |
| **CA-07** (R-08) | 56 controles de la capa (a) + 16 de la capa (b) + 8 suplementarios + 8 de contraste + 2 de cierre (T-14) + 5 de modularización (T-15), todos ejecutados y reportados | **APROBADO** |
| **CA-08** (R-08) | **1** control marcado **OMITIDO** con su motivo (segundo motor de renderizado, §2.6) y **1** **PENDIENTE POR ALCANCE** (apariencia con contenido real, Ej. 3–5) — ninguno presentado como aprobado; los 3 que quedaban abiertos en la primera redacción se cerraron ejecutándolos (T-14, §2.7) y 2 falsos positivos de mi propio script se corrigieron y documentaron | **APROBADO** |
| **CA-09** (global) | Supuestos S1–S9, decisiones D1–D14, pendientes y limitaciones identificados en la SPEC §9 y en §2.6, §3 y §4 de este resumen | **APROBADO** |
