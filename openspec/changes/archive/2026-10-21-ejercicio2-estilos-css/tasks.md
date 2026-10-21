# Tasks

> Change ya implementado y verificado. Las tareas están marcadas como hechas; la evidencia vive en `docs/ejercicio2-implementacion-resumen.md`.

## 1. Tokens y capa base

- [x] 1.1 Declarar los 38 custom properties en `:root` de `css/base.css` y verificar que los 12 hexadecimales de la paleta aparezcan una sola vez en todo el CSS
- [x] 1.2 Implementar el reset global (`box-sizing: border-box`, `margin-block`/`padding` de headings y `dd`/`p`, `field`/`legend`) y la tipografía base con las dos pilas del sistema, y verificar con `grep` que no hay `url()`, `@import` fuera del punto de entrada ni `@font-face`

## 2. Capa de layout

- [x] 2.1 Implementar `.encabezado`, `.navegacion` (sticky, `flex-wrap`), `.nav-enlace`, `.contenido`, `.vista` como panel de superficie y `.pie` con `margin-block-start: auto`, y verificar que las 5 vistas se leen como paneles separados en la captura de 1280 px
- [x] 2.2 Implementar las grillas fluidas con `minmax(min(100%, X), 1fr)` en `.formulario` y `.listado--catalogo`, y verificar que a 320 px no hay ninguna pista más ancha que su contenedor

## 3. Capa de componentes

- [x] 3.1 Implementar `.campo`, `.campo__control` (borde `--color-texto-suave`, `min-block-size` 2,75 rem), `select[multiple]` y `.renglon-alta` con su `legend`, y verificar que los 12 controles quedan con etiqueta y con borde de contraste ≥ 3:1
- [x] 3.2 Implementar `.boton` y sus modificadores (primario, secundario, destructivo) y verificar que ningún botón queda por debajo de 44 px de alto
- [x] 3.3 Implementar `.mensaje` con sus tres variantes, los glifos `✓` `✕` `ℹ` y la regla `.mensaje[hidden] { display: none }`, y verificar que los 7 mensajes con `hidden` quedan ocultos y los 3 visibles se muestran
- [x] 3.4 Implementar `.tabla-contenedor` (`overflow-x: auto`, `min-inline-size: 0`) y `.tabla` (`inline-size: 100%`, `min-inline-size: max-content`), y verificar que a 320 px los 5 contenedores se desplazan solos y que el documento no scrollea en horizontal
- [x] 3.5 Implementar los estilos de preparación de los Ejercicios 3 a 6 (`.libro` y sus partes, `.fila-renglon__*`, `.venta__total` y su `output`, `.detalle-venta`, `.boton--secundario` reservada), y verificar que el `<template>` sigue inerte y `js/app.js` sigue vacío

## 4. Accesibilidad y responsive

- [x] 4.1 Implementar `:focus-visible` con anillo de 2 px `--color-foco` y la excepción de `.tabla-contenedor` con `outline-offset: -3px`, y verificar con `grep` que no hay `outline: none` en todo el CSS
- [x] 4.2 Implementar las media queries de 48 rem y 64 rem y el bloque `prefers-reduced-motion` con las únicas declaraciones `!important` justificadas, y verificar que solo hay `min-width` y que el `scroll-behavior` se anula sin `!important`

## 5. Modularización

- [x] 5.1 Separar el CSS en `base.css`, `layout.css` y `componentes.css` con `styles.css` como punto de entrada, sin modificar `index.html`, y verificar la equivalencia a nivel de reglas (68 ↔ 68 con las mismas condiciones de `@media`)
- [x] 5.2 Verificar que el render es idéntico a 320, 768 y 1280 px tras la separación, y que los 4 archivos cargan correctamente por `file://`

## 6. Verificación

- [x] 6.1 Ejecutar los controles automatizables de solo lectura sobre los 4 archivos de `css/` y verificar 0 coincidencias de CSS inline, `<style>`, URLs externas, selectores por `id` y `!important` fuera del bloque justificado
- [x] 6.2 Medir en navegador real a 320, 768 y 1280 px sobre una copia temporal y verificar `scrollWidth <= clientWidth`, el scroll propio de las tablas y los tamaños fluidos de las tipografías
- [x] 6.3 Verificar el recorrido de teclado con pulsaciones reales de `Tab` y `Enter` (26/26 paradas con anillo, sin trampa de foco, `Enter` navega a `#ventas`) y la lectura del CSSOM (3 imports, 38 declaraciones en `:root`, 1 regla con `!important`)
- [x] 6.4 Generar las capturas a 320 px y 1280 px, recortarlas al ancho exacto e inspeccionarlas visualmente

## 7. Documentación

- [x] 7.1 Escribir `openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/spec-ejercicio2.md`, `openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/plan-ejercicio2.md` y `docs/ejercicio2-implementacion-resumen.md` con la evidencia de la verificación
