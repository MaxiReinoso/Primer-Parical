# Proposal

## Why

El HTML del Ejercicio 1 estaba aprobado pero **sin presentación**: `css/styles.css` era un placeholder de 3 líneas sin una sola regla, así que la interfaz se veía como texto plano, sin jerarquía tipográfica, sin superficies diferenciadas y sin legibilidad real. La consigna del Ejercicio 2 pide una identidad visual propia y coherente, un diseño adaptable de 320 px a 1280 px, foco visible y contraste verificado.

## What Changes

- Se reemplaza el placeholder por un **sistema de estilos modular en tres capas**: `css/base.css` (tokens, reset y tipografía), `css/layout.css` (estructura de página y composición adaptable) y `css/componentes.css` (componentes, foco, responsive y movimiento reducido), con `css/styles.css` como punto de entrada que los importa.
- Se define una **identidad visual** con 38 *custom properties* en `:root`: 12 colores base, 3 derivados por `color-mix`, 2 pilas tipográficas del sistema, 4 tamaños fluidos con `clamp()`, 8 pasos de espaciado en múltiplos de 4 px, 4 radios y 3 sombras.
- Se compone el layout con **Flexbox y Grid mobile-first**: las 5 vistas se presentan como paneles de superficie, los formularios usan una grilla fluida `minmax(min(100%, 16rem), 1fr)` y el catálogo una grilla de tarjetas.
- Se resuelve la **adaptación a 320 px y 1280 px** sin desplazamiento horizontal del documento: las tablas anchas se desplazan dentro de su propio `.tabla-contenedor`.
- Se define el **foco visible** con `:focus-visible` y anillo de contraste suficiente, y los **mensajes de estado** con dos señales (color + glifo), sin depender solo del color.

No hay cambios rompientes: el HTML del Ejercicio 1 no se modifica.

## Capabilities

### New Capabilities
- `presentacion-css`: identidad visual, composición adaptable entre 320 px y 1280 px, foco visible en el recorrido de teclado y contraste AA del frontend.

### Modified Capabilities

## Impact

- `css/`: nuevo sistema de estilos (4 archivos, 644 líneas, 17.211 bytes en total).
- `index.html`: **sin cambios** — se verificó con `git diff` que ni una línea fue tocada. El único `<link>` sigue apuntando a `css/styles.css`, y la modularización se resolvió con `@import` justamente para no tener que agregar `<link>`.
- `js/app.js`: sin cambios.
- Sin dependencias, sin URLs externas, sin webfonts: la tipografía usa solo pilas del sistema.
- Documentación de la fase: `openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/spec-ejercicio2.md`, `openspec/changes/archive/2026-10-21-ejercicio2-estilos-css/notas/plan-ejercicio2.md`, `docs/ejercicio2-implementacion-resumen.md`.
