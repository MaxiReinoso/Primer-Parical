# Plan — Ejercicio 2: Presentación con CSS y uso adaptable

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 2)**
Fase: **2 (PLAN)** — SPEC aprobada 2026-10-20 (`docs/ejercicio2-spec.md`, §9.3 decisión P1 resuelta).
Estado: **pendiente de aprobación para implementar. No se ejecuta ninguna tarea todavía.**

## Decisiones que gobiernan este plan (de la SPEC aprobada)

- **P1 → Opción A: vistas apiladas.** Las 5 `<section class="vista">` se muestran todas, apiladas, cada una como un panel de superficie. La navegación sigue siendo salto por ancla, con navegación `sticky` y `scroll-margin-top` en `.vista`.
- **P4 → los 7 puntos técnicos son obligatorios** (§7): `.mensaje[hidden] { display: none }`; prohibición de `display: flex` sobre un `td`; `min-inline-size: 0` en hijos flexibles; `.tabla-contenedor` como único origen de scroll horizontal, con anillo de foco hacia adentro; `scroll-margin-top` en `.vista`; dos señales (color + glifo `::before`) por estado de mensaje; prohibición de `outline: none`.
- **P5 → la medición en navegador se hace sobre una copia temporal**, nunca sobre `index.html` del proyecto.
- **D1/D2 → mapeo de uso de la paleta** (la paleta no se modifica): los bordes que identifican un control usan `--color-texto-suave` (7,33:1); el texto de los enlaces nunca se apoya sobre `--color-acento-suave` (4,47:1).
- **D5 → `.tabla { inline-size: 100%; min-inline-size: max-content; }`** para que la tabla empuje el scroll dentro del contenedor y no se comprima.
- **D8 → una sola clase reservada**, `.boton--secundario`, declarada en el CSS y no agregada al HTML.
- **D11 → el `thead` no lleva `position: sticky`** (sería un efecto nulo sin altura acotada en el contenedor).
- **D12/D13 → `.pie { margin-block-start: auto }`** (el pie al pie de la ventana en un flex vertical) y **`justify-self: start`** para encoger los botones a ≥48 rem (`inline-size: auto` no alcanza en grid).

## Archivos del proyecto tras esta implementación

| Archivo | Acción |
|---|---|
| `css/styles.css` | **modificar** — reemplazar el placeholder de 3 líneas por la hoja de estilos completa (§5 de la SPEC). |
| `index.html` | **no se toca** (ni una línea). |
| `js/app.js` | **no se toca** (sigue siendo el placeholder). |
| `docs/ejercicio2-spec.md` | ya creado en Fase 1 (no se modifica salvo registro de decisiones, ya hecho). |
| `docs/ejercicio2-plan.md` | este archivo. |
| `docs/ejercicio2-implementacion-resumen.md` | crear al cierre de la Fase 3. |

No se crean: imágenes, `recursos/`, README (Ej. 6), hojas de estilo adicionales, JS con lógica, datos de ejemplo.

## Convención de verificación

Cada tarea declara su **comprobación**. La verificación se compone de tres capas, y **ningún control se declara aprobado sin ejecutarse**:

- **(a) Controles objetivos automatizables de solo lectura** sobre `css/styles.css` e `index.html`: script en la carpeta temporal del sistema (no se agrega ningún script al proyecto; la entrega no lleva herramientas ni dependencias).
- **(b) Comprobación real en navegador** (EdgeCore 155.0.4283.62, invocado por ruta absoluta: **no está en el `PATH`**) sobre una **copia temporal** del proyecto, con el **arnés de `<iframe>`** que hace falta para obtener un viewport real de 320 px (§7.11 de la SPEC: `--window-size=320,800` devuelve 492 px).
- **(c) Registro de evidencia** por control con estado **aprobado / fallido / omitido / pendiente** y su motivo.

Restricciones metodológicas verificadas y que este plan respeta:

1. El script de medición **no inyecta elementos en la página medida** (un `<pre>` con líneas largas ensancha el documento y produce un `scrollWidth` falso: 2085 px con él, 305 px sin él, con CSS idéntico). El reporte va por `postMessage` al arnés.
2. `index.html` del proyecto **no se modifica** para medir.
3. Las capturas a 320 px y 1280 px se guardan **fuera** del proyecto, en la carpeta temporal.

---

## Checklist de tareas

### T-01 — Tokens en `:root` y cabecera del archivo
- **Resultado esperado:** `css/styles.css` abre con un comentario de cabecera identificatorio y un bloque `:root` que declara los **38 custom properties** de §5.2: 12 de color base + 3 derivados por `color-mix` + 6 de tipografía (2 pilas + 4 tamaños fluidos) + 8 de espaciado + 4 de radios + 3 de sombras + 2 de layout. Ningún valor de color, tipografía, espaciado, radio o sombra aparece fuera de `:root` salvo los `#ffffff` del texto de botón y los tres `color-mix`.
- **Cubre:** R-01, R-06; CA-01, CA-06.
- **Archivos:** `css/styles.css` (se reemplaza el placeholder).
- **Dependencias:** ninguna (arranca el archivo).
- **Comprobación:** `grep` de `--[a-z-]*:` en `:root` devuelve 38 declaraciones; los 12 hexadecimales de la paleta aparecen **exactamente una vez** cada uno; los 4 `clamp()` dan 16,02/17,02 px (base) y 22,00/40,00 px (título 1) a 320/1280 px.

### T-02 — Base, reset y layout de página
- **Resultado esperado:** capa base con `box-sizing: border-box` universal, `html { scroll-behavior: smooth; color-scheme: light }`, `body` en flex vertical (`min-block-size: 100vh`), `font-family`/`font-size`/`line-height`/`font-variant-numeric: tabular-nums` en `body`, reset de `h1`–`h3`/`p`/`dd`/`fieldset`; y capa de layout con `.encabezado` (+ `.encabezado h1` en la pila serif), `.navegacion` (`position: sticky`, `flex-wrap: wrap`, `min-block-size: var(--alto-nav)`), `.nav-enlace`, `.contenido` (grid, `gap`, `max-inline-size`, centrado), `.vista` (**panel de superficie** con `padding`, `background`, `border`, `border-radius`, `box-shadow` y `scroll-margin-top`), `.vista > h2` (título serif con filete) y `.pie` (con `margin-block-start: auto`).
- **Cubre:** R-01, R-05, R-06; CA-01, CA-02, CA-06.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-01.
- **Comprobación:** el HTML de las 5 vistas se ve como 5 paneles separados sobre el fondo crema; el pie queda al pie de la ventana con contenido corto; `.vista` tiene `scroll-margin-top` calculado con `--alto-nav`; **0** selectores por `id` en todo el archivo.

### T-03 — Formularios y campos
- **Resultado esperado:** `.formulario` en grid fluido `repeat(auto-fit, minmax(min(100%, 16rem), 1fr))`; `.formulario > .boton` con `justify-self: stretch; inline-size: 100%` en la base; `.campo` (grid, etiqueta sobre control, `min-inline-size: 0`); `.campo__control` con `inline-size: 100%`, `min-block-size: 2.75rem`, borde 1 px `--color-texto-suave` (7,33:1), radio `--radio-2` y fondo `--color-superficie`; `.campo label` en negrita; `select[multiple]` con `min-block-size: 8rem`; `.renglon-alta` (fieldset) con reset de `border`/`margin`/`padding`, borde `--color-borde-fuerte`, radio `--radio-2` y grid `minmax(min(100%, 14rem), 1fr)`; `.renglon-alta legend` con la pila serif.
- **Cubre:** R-01, R-02, R-04, R-05; CA-01, CA-03, CA-06.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02.
- **Comprobación:** los 12 controles de formulario quedan con `min-block-size` de 44 px o más y con borde de contraste ≥3:1; a 320 px el formulario es de una sola columna y ningún control excede el ancho del panel; el `<fieldset>` no muestra el borde `groove` del UA.

### T-04 — Botones
- **Resultado esperado:** `.boton` base (`display: inline-flex`, `align-items/justify-content: center`, `gap`, `min-block-size: 2.75rem`, `padding`, `border: 1px solid transparent`, radio `--radio-2`, `font: inherit`, `font-weight: 600`, `cursor: pointer`, `text-align: center`); primario con fondo `--color-acento` y texto `#ffffff` (5,91:1), `:hover` `--color-acento-hover` (7,60:1) y `:active` `--color-acento-activo` (9,17:1); `.boton--secundario` y `.boton--modificar` con fondo `--color-superficie`, texto `--color-texto` y borde `--color-texto-suave`, hover a `--color-superficie-alt`; `.boton--quitar` con fondo `--color-error` (7,32:1 con texto blanco) y hover `--color-error-hover` (9,15:1).
- **Cubre:** R-01, R-04; CA-01, CA-03.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02.
- **Comprobación:** los 6 botones del HTML (4 en el DOM vivo + 2 en la plantilla) comparten `.boton` y difieren solo por modificador; ningún botón queda por debajo de 44 px de alto; el texto de los botones de color blanco mantiene ≥4,5:1 en los tres estados.

### T-05 — Mensajes de estado
- **Resultado esperado:** `.mensaje` (`display: flex`, `align-items: flex-start`, `gap`, `padding`, fondo `--color-acento-suave`, filete inline-start 4 px del color de estado, radio `--radio-2`, `min-inline-size: 0`, `overflow-wrap: anywhere`); `.mensaje--exito` (texto y filete `--color-exito`, 4,79:1 sobre el tinte), `.mensaje--error` (`--color-error`, 5,54:1), `.mensaje--vacio` (`--color-texto-suave`, 5,63:1); glifo `::before` por variante (`✓` éxito, `✕` error, `ℹ` vacío); y **`.mensaje[hidden] { display: none; }`**.
- **Cubre:** R-03, R-04; CA-01, CA-04.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02.
- **Comprobación:** los 7 mensajes con `hidden` quedan con `display: none` y los 3 visibles se muestran con su texto; cada estado muestra color **y** glifo; el texto del HTML sigue siendo legible y nunca queda solo en el color.

### T-06 — Tablas y scroll propio
- **Resultado esperado:** `.tabla-contenedor` como **único** origen de scroll horizontal (`overflow-x: auto; overflow-y: auto; max-inline-size: 100%; min-inline-size: 0; border; border-radius; box-shadow: var(--sombra-1); background: var(--color-superficie)`); `.tabla` con `inline-size: 100%; min-inline-size: max-content; border-collapse: collapse`; `thead th` con fondo `--color-superficie-alt`, texto `--color-texto`, filete inferior 2 px `--color-texto-suave` y `text-align: start` (**sin** `position: sticky`, D11); `tbody td` con `padding`, separador inferior 1 px `--color-borde` y `vertical-align: middle`; `tbody tr:hover` con fondo `--color-superficie-alt`; `.fila-renglon__acciones` con `white-space: nowrap` y **sin** `display: flex`.
- **Cubre:** R-02, R-05; CA-01, CA-02.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02.
- **Comprobación:** a 320 px y a 1280 px el documento **no** tiene scroll horizontal; las tablas anchas se desplazan dentro de su contenedor; ningún `td` tiene `display: flex`; el `grep` de `position: sticky` solo encuentra la regla de `.navegacion`.

### T-07 — Preparación para los render de los Ejercicios 3–6
- **Resultado esperado:** reglas concretas de §5.8 para `.libro` (tarjeta con borde `--color-borde-fuerte` y `--sombra-1`), `.libro:hover` (`--sombra-2`), `.libro__titulo`, `.libro__datos` (grid `max-content 1fr`), `.libro__datos dt`, `.libro__datos dd` (`margin: 0`), las cinco clases `libro__isbn`/`__editorial`/`__genero`/`__autores`/`__precio`, `.listado--catalogo` (grid `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`), `.fila-renglon__libro`, `.fila-renglon__cantidad`/`__precio-unitario`/`__subtotal` (cifras tabulares, alineación a la derecha), `.fila-renglon__acciones .boton + .boton`, `.venta__total` (flex `space-between`, fondo `--color-superficie-alt`), `.venta__total output` (cifras tabulares) y `.detalle-venta`; más la clase reservada `.boton--secundario` (D8), **sin** agregarla al HTML.
- **Cubre:** R-07; CA-04.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02, T-04, T-06.
- **Comprobación:** existen reglas para las 8 clases `.libro*`, las 6 `.fila-renglon*`, `.venta__total` y `.detalle-venta`; el `<template>` de `index.html` sigue inerte (0 tarjetas y 0 filas renderizadas en el DOM) y `js/app.js` sigue sin lógica; `.boton--secundario` existe en el CSS y **no** en el HTML.

### T-08 — Foco visible
- **Resultado esperado:** `:focus-visible { outline: 2px solid var(--color-foco); outline-offset: 2px; box-shadow: var(--sombra-foco); }` global y `.tabla-contenedor:focus-visible { outline-offset: -3px; }` (anillo hacia adentro). **Cero `outline: none`** en todo el archivo: no hay reset de outline.
- **Cubre:** R-04; CA-03.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02.
- **Comprobación:** el `grep` de `outline` no encuentra `outline: none` ni `outline: 0`; cada uno de los 26 puntos de foco del DOM vivo recibe un anillo con `outline-color` = `--color-foco` (6,13:1 sobre fondo, 6,78:1 sobre superficie).

### T-09 — Responsive (mobile-first)
- **Resultado esperado:** `@media (min-width: 48rem)` (768 px): `.contenido { padding: var(--esp-6); gap: var(--esp-8) }`, `.vista { padding: var(--esp-6) }`, `.formulario` con `minmax(min(100%, 18rem), 1fr)` y `.formulario > .boton { justify-self: start; inline-size: auto }`; `@media (min-width: 64rem)` (1024 px): `.contenido { padding: var(--esp-8) }`, `.vista { padding: var(--esp-7) }`, `.listado--catalogo` con `minmax(min(100%, 20rem), 1fr)`. **Ningún `@media` usa `max-width`.**
- **Cubre:** R-05; CA-02, CA-06.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-02, T-03, T-07.
- **Comprobación:** el `grep` de `@media` devuelve 2 bloques, ambos con `min-width`; a 320 px la media query de 48 rem está **inactiva** y a 1280 px **activa** (verificado en navegador).

### T-10 — Movimiento reducido
- **Resultado esperado:** bloque `@media (prefers-reduced-motion: reduce)` con las declaraciones `!important` **justificadas** (`transition-duration`, `animation-duration`, `animation-iteration-count`) y una regla `html { scroll-behavior: auto; }` **sin** `!important` (misma especificidad que la regla base, gana por ir después).
- **Cubre:** R-06; CA-06.
- **Archivos:** `css/styles.css`.
- **Dependencias:** T-01.
- **Comprobación:** el `grep` de `!important` encuentra coincidencias **solo** dentro del bloque `prefers-reduced-motion`; ningún otro `!important` en el archivo.

### T-11 — Verificación (a): controles objetivos de solo lectura
- **Resultado esperado:** evidencia de cada control automatizable, con estado por control.
- **Cubre:** R-02, R-03, R-06; CA-01, CA-07.
- **Archivos:** ninguno (solo lectura; el script vive en la carpeta temporal).
- **Dependencias:** T-01…T-10.
- **Comprobación:**
  1. **Limpieza:** 0 coincidencias de `style=` inline, 0 `<style>` y 0 `<script>` con cuerpo en `index.html`; 0 URLs `http://`/`https://`/`//` en `index.html` y `styles.css`.
  2. **Selectores por id:** 0 selectores por `id` usados para estilo en `styles.css` (la única excepción admitida es `:root`, que es pseudo-clase).
  3. **`!important`:** todas las coincidencias dentro del bloque `prefers-reduced-motion`.
  4. **Anchos fijos:** 0 declaraciones `width:` en px que impidan la adaptación (se admiten `inline-size: 100%`, `max-inline-size: 100%` y `width: auto`).
  5. **Reglas clave presentes:** `:root` con los tokens; `:focus-visible`; `.mensaje[hidden]`; `.tabla-contenedor` con `overflow-x: auto`; `box-sizing: border-box` universal; `min-inline-size: 0`; `clamp(`; `minmax(`; `grid-column: 1 / -1`; `margin-block-start: auto` en `.pie`; `justify-self` en `.formulario > .boton`.
  6. **Tokens:** 38 declaraciones en `:root`; los 12 hexadecimales de la paleta, uno de cada uno.
  7. **Alcance puro (CA-05):** `git diff HEAD -- index.html js/app.js` sin diferencias; ningún archivo del proyecto fuera de `css/styles.css` y `docs/` fue creado o modificado; `grep` de `<script>` con cuerpo, `localStorage`, `fetch(`, `addEventListener` y `<img` en `styles.css` → 0 coincidencias (el CSS no puede contener lógica ni imágenes).

### T-12 — Verificación (b): navegador a 320 px y 1280 px
- **Resultado esperado:** evidencia de las mediciones reales sobre la **copia temporal**, con estado por control.
- **Cubre:** R-03, R-04, R-05; CA-02, CA-03, CA-04, CA-07.
- **Archivos:** ninguno en el proyecto; la copia y el arnés viven en `%TEMP%\opencode\verif-ej2\`.
- **Dependencias:** T-01…T-10.
- **Comprobación:**
  1. **Anchos:** con el arnés de `<iframe>` (320 px y 1280 px reales), `documentElement.scrollWidth <= clientWidth` en ambos.
  2. **Scroll propio:** `.tabla-contenedor` con `scrollWidth > clientWidth` donde la tabla no entra; ningún elemento **fuera** de un contenedor con scroll rebasa el `innerWidth`.
  3. **Estados:** los 7 mensajes con `hidden` con `display: none`; los 3 visibles mostrados con su texto; glifo correcto por variante.
  4. **Escala fluida:** `h1` = 22 px y body ≈ 16,0 px a 320 px (media query de 48 rem inactiva); `h1` = 40 px y body ≈ 17,0 px a 1280 px (media query activa).
  5. **Foco:** el elemento enfocado tiene `outline-style` ≠ `none` y `outline-color` = `--color-foco`.
  6. **Hojas de estilo:** `document.styleSheets.length` = 1 (solo `css/styles.css`).
  7. **Capturas:** PNG a 320 px y 1280 px **fuera** del proyecto.

### T-13 — Registro de evidencia y resumen de implementación
- **Resultado esperado:** `docs/ejercicio2-implementacion-resumen.md` con: resumen de cambios, comprobaciones realizadas con su evidencia y estado (aprobado / fallido / omitido / pendiente), limitaciones, pendientes, archivos generados y mapeo breve a R-01…R-08 y CA-01…CA-09.
- **Cubre:** CA-05, CA-07, CA-08, CA-09.
- **Archivos:** crear `docs/ejercicio2-implementacion-resumen.md`.
- **Dependencias:** T-11, T-12.
- **Comprobación:** el resumen distingue aprobados/fallidos/omitidos/pendientes; **ningún control no ejecutado figura como aprobado**; la inspección visual de las capturas queda declarada **omitida con motivo** si el modelo no puede leer imágenes, derivada a revisión humana (como en el Ejercicio 1); los ratios de contraste se imprimen con su cálculo. **CA-05 (alcance puro):** `git diff` sobre `index.html`, `js/app.js` y cualquier otro archivo del proyecto no muestra diferencias: la única modificación es `css/styles.css` y los documentos de `docs/`; no hay JS, datos, imágenes, README ni modo oscuro.

---

## Orden de ejecución

```
T-01 ──→ T-02 ──┬─→ T-03 ─┐
                  ├─→ T-04 ─┤
                  ├─→ T-05 ─┤
                  ├─→ T-06 ─┤
                  ├─→ T-08 ─┤
                  └─→ T-10 ─┘
T-07 (depende de T-02, T-04, T-06) ──┐
T-09 (depende de T-02, T-03, T-07) ──┤
                                      └─→ T-11, T-12 (paralelas) ──→ T-13
```

## Fuera de alcance de este plan (no se toca)

`index.html` y `js/app.js`; JS con lógica, validaciones, filtros, renders, cálculos, localStorage (Ej. 3–6); ABM; README; datos de ejemplo hardcodeados; imágenes e íconos; webfonts y URLs externas; modo oscuro; la vista activa en la navegación (D10: exigiría selectores por `id`, contradice CA-01); `position: sticky` en el `thead` (D11). Cualquier necesidad detectada durante la implementación que exceda este listado se informa y se consulta antes de ampliar el alcance.

---

**Fin de la Fase 2 (PLAN). Se presenta para revisión; no se inicia la IMPLEMENTACIÓN sin autorización explícita.**
