# Proposal

## Why

El proyecto no tenía ninguna interfaz: sin `index.html` no había dónde mostrar el catálogo, ni dónde registrar libros, clientes y ventas. La consigna del Ejercicio 1 pide una estructura de **5 vistas** con navegación clara, semántica correcta y los contenedores de estado que el JavaScript de los ejercicios siguientes va a usar. Sin esa base, los ejercicios 3 a 6 no tienen dónde aterrizar.

## What Changes

- Se crea `index.html` como entrada única del proyecto, con las 5 vistas (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`) como `<section class="vista">` dentro de un `<main>`.
- Se agrega `<header>`, `<nav aria-label>` con 5 enlaces-ancla, y `<footer>`.
- Se construyen los formularios de alta de libros y de clientes, el buscador por título, y el formulario de venta con su bloque de renglones, su total y su botón de confirmación.
- Se construyen las 5 tablas con `<thead>`/`<th>` y un `<tbody>` vacío cada una, y los 10 contenedores de mensaje (vacío, sin resultados, éxito, error) con su `role` y su `hidden` inicial.
- Se agregan dos `<template>` HTML5 (`#plantilla-libro`, `#plantilla-renglon`) con el molde del render, sin datos.
- Se crean `css/styles.css` y `js/app.js` como placeholders para que los enlaces no den 404 en `file://`.

No hay cambios rompientes: el proyecto no tenía interfaz previa.

## Capabilities

### New Capabilities
- `estructura-html`: estructura semántica de las 5 vistas del frontend de la librería: navegación, formularios, tablas y contenedores de estado.

### Modified Capabilities

## Impact

- `index.html`: **creado** (264 líneas, 10.358 bytes). Única fuente de verdad del markup: los ejercicios siguientes lo consumen, no lo modifican.
- `css/styles.css`, `js/app.js`: creados como placeholders vacíos (3 líneas cada uno) para que el `<link>` y el `<script>` no fallen.
- Sin dependencias, sin build, sin backend. El proyecto se abre con doble clic desde `file://`.
- Documentación de la fase: `docs/ejercicio1-spec.md`, `docs/ejercicio1-plan.md`, `docs/ejercicio1-implementacion-resumen.md`.
