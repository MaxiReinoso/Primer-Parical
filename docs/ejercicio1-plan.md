# Plan — Ejercicio 1: Estructura y pantallas HTML

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 1)**
Fase: **2 (PLAN)** — SPEC aprobada 2026-10-16 (ver `docs/ejercicio1-spec.md`, §9 decisiones P1–P6 resueltas).
Estado: **pendiente de aprobación para implementar. No se ejecuta ninguna tarea todavía.**

## Decisiones que gobiernan este plan (de la SPEC aprobada)

- **P1 → Opción A: SPA.** Un único `index.html` con 5 `<section>` y `<nav>` con enlaces-ancla `href="#id"`.
- **P2 →** `<h1>` = «Librería El Estante».
- **P3 →** se incluyen `<template id="plantilla-libro">` y `<template id="plantilla-renglon">`.
- **P4 →** historial con 4 columnas obligatorias + columna "Detalle" (botón "Ver detalle" renderizado por JS en Ej. 5; en esta fase solo la estructura de columna y su `<th>`).
- **P5 →** se crean `css/styles.css` y `js/app.js` como placeholders vacíos con comentario de encabezado.
- **P6 →** sin atributos `required`/`pattern`/`min` en ningún campo.

## Archivos del proyecto tras esta implementación

| Archivo | Acción |
|---|---|
| `index.html` | crear (raíz del parcial) |
| `css/styles.css` | crear (placeholder vacío, solo comentario) |
| `js/app.js` | crear (placeholder vacío, solo comentario) |
| `docs/ejercicio1-spec.md` | ya creado en Fase 1 (no se modifica salvo registro de decisiones, ya hecho) |
| `docs/ejercicio1-plan.md` | este archivo |
| `docs/ejercicio1-implementacion-resumen.md` | crear al cierre de la Fase 3 |

No se crean: imágenes, `recursos/`, README (Ej. 6), otros HTML, CSS con reglas, JS con lógica.

## Convención de verificación

Cada tarea declara su **comprobación**. Las verificaciones estructurales se hacen con (a) inspección visual del HTML en el navegador (`file://`), (b) lectura del código fuente, y (c) comprobaciones automatizadas de **solo lectura** ejecutadas con Python stdlib desde la carpeta temporal del sistema (no se agrega ningún script de verificación al proyecto; la entrega no lleva herramientas ni dependencias). Ningún control se declara aprobado sin ejecutarse.

---

## Checklist de tareas

### T-01 — Placeholder de `css/styles.css`
- **Resultado esperado:** existe `css/styles.css` con un comentario de encabezado identificatorio y **cero reglas CSS**.
- **Cubre:** R-06, CA-04, decisión P5.
- **Archivos:** crear `css/styles.css`.
- **Dependencias:** ninguna (puede ejecutarse en paralelo con T-02).
- **Comprobación:** el archivo existe en `css/`; su contenido es solo comentario; `grep` de selecciones/propiedades sin coincidencias.

### T-02 — Placeholder de `js/app.js`
- **Resultado esperado:** existe `js/app.js` con comentario de encabezado y **cero lógica** (sin funciones, sin listeners, sin datos).
- **Cubre:** R-06, R-07, CA-04, decisión P5.
- **Archivos:** crear `js/app.js`.
- **Dependencias:** ninguna (paralela con T-01).
- **Comprobación:** el archivo existe en `js/`; solo comentario; sin declaraciones ejecutables.

### T-03 — Esqueleto de `index.html` (head, header, nav, main, footer)
- **Resultado esperado:** `index.html` válido con `<!doctype html>`, `<html lang="es">`, `meta charset="utf-8"`, `meta name="viewport" width=device-width, initial-scale=1` (habilita 320 px en Ej. 2), `<title>`, `<link rel="stylesheet" href="css/styles.css">`, `<script src="js/app.js" defer></script>`; `<header>` con `<h1 id="titulo-libreria">Librería El Estante</h1>`; `<nav aria-label="Navegación principal">` con 5 enlaces `<a class="nav-enlace" href="#catalogo|#libros|#clientes|#ventas|#historial">` con texto visible ("Catálogo", "Libros", "Clientes", "Ventas", "Historial"); `<main>`; `<footer>` con texto breve de práctica académica. Las 5 secciones se crean vacías con su `id` y `class="vista"` + `<h2>` (el contenido de cada una se completa en T-04…T-08).
- **Cubre:** R-01, R-02, R-05, R-06; CA-01.
- **Archivos:** crear `index.html`.
- **Dependencias:** previa a T-04…T-09.
- **Comprobación:** abrir con doble clic (`file://`) — el título del navegador y el `<h1>` muestran «Librería El Estante»; los 5 enlaces del nav son recorribles con Tab y al activarlos con Enter la barra de dirección queda con `#…` (salto a la vista); `grep` de `style=`/`<script>` inline sin coincidencias; no hay URLs externas.

### T-04 — Vista Catálogo (`#catalogo`)
- **Resultado esperado:** `<section id="catalogo" class="vista">` con: `<h2>` "Catálogo"; `<form id="form-busqueda" role="search">` con `<label for="buscador-titulo">Buscar por título</label>` + `<input id="buscador-titulo" name="titulo" type="search">`; `<div id="catalogo-listado" class="listado">` **vacío**; `<p id="catalogo-vacio" class="mensaje mensaje--vacio">` con texto "No hay libros en el catálogo." **visible**; `<p id="catalogo-sin-resultados" class="mensaje mensaje--vacio" hidden>` con texto de "sin resultados".
- **Cubre:** R-02, R-03, R-04; CA-02, CA-03.
- **Archivos:** modificar `index.html`.
- **Dependencias:** T-03.
- **Comprobación:** `for="buscador-titulo"` coincide con un `id` existente; `#catalogo-listado` sin hijos; los dos estados existen con la visibilidad inicial de la SPEC §6; sin lógica ni datos.

### T-05 — Vista Libros (`#libros`)
- **Resultado esperado:** `<section id="libros" class="vista">` con `<h2>`; `<form id="form-libro">` con label+campo para: `libro-titulo` (text), `libro-isbn` (text), `libro-precio` (number, `step="0.01"`, sin `min`), `libro-editorial` (`select`, **vacío**), `libro-genero` (`select` con `<option value="">Sin clasificar</option>` estática como única opción), `libro-autores` (`select multiple`, vacío); `<button type="submit">Registrar libro</button>`; `#libro-mensaje-exito` (`role="status"`, `hidden`) y `#libro-mensaje-error` (`role="alert"`, `hidden`) con sus textos; tabla `#tabla-libros` dentro de `div.tabla-contenedor` con `<thead>` (Título | ISBN | Editorial | Género | Autores | Precio) y `<tbody id="tabla-libros-cuerpo">` vacío.
- **Cubre:** R-02, R-03, R-04, R-05; CA-02, CA-03.
- **Archivos:** modificar `index.html`.
- **Dependencias:** T-03.
- **Comprobación:** los 6 campos tienen `label for` coincidente; «Sin clasificar» presente con `value=""`; `#libro-autores` tiene `multiple`; botón con texto "Registrar libro"; tabla con `thead`+`th` y `tbody#tabla-libros-cuerpo` vacío; mensajes con `role` y `hidden`; sin `required`/`pattern`.

### T-06 — Vista Clientes (`#clientes`)
- **Resultado esperado:** `<section id="clientes" class="vista">` con `<h2>`; `<form id="form-cliente">` con label+campo `cliente-nombre` (text) y `cliente-email` (type=email, sin `required`/`pattern`); `<button type="submit">Registrar cliente</button>`; `#cliente-mensaje-exito` (`role="status"`, `hidden`) y `#cliente-mensaje-error` (`role="alert"`, `hidden`); tabla `#tabla-clientes` en `.tabla-contenedor` con `<thead>` (Nombre completo | Email) y `<tbody id="tabla-clientes-cuerpo">` vacío.
- **Cubre:** R-02, R-03, R-04, R-05; CA-02, CA-03.
- **Archivos:** modificar `index.html`.
- **Dependencias:** T-03.
- **Comprobación:** labels coincidentes; botón descriptivo; `thead`+`th` presentes; `tbody` vacío; mensajes con `role`/`hidden`.

### T-07 — Vista Ventas (`#ventas`)
- **Resultado esperado:** `<section id="ventas" class="vista">` con `<h2>`; **un único** `<form id="form-venta">` que contiene en orden lógico: label+`select#venta-cliente` (vacío); bloque de renglón con label+`select#renglon-libro` (vacío), label+`input#renglon-cantidad` (number, `step="1"`, sin `min`) y `<button type="button">Agregar renglón</button>`; `div.tabla-contenedor` con `table#tabla-renglones` — `<thead>`: Libro | Cantidad | Precio unitario | Subtotal | Acciones — y `<tbody id="tabla-renglones-cuerpo">` vacío (sin filas hardcodeadas; los botones "Quitar"/"Modificar" viven en la plantilla de T-09); bloque de total `<p>Total: <output id="venta-total">$0,00</output></p>` (placeholder justificado, SPEC §6); `<button type="submit">Confirmar venta</button>`; `#venta-mensaje-exito` (`role="status"`, `hidden`) y `#venta-mensaje-error` (`role="alert"`, `hidden`).
- **Cubre:** R-02, R-03, R-04, R-05; CA-02, CA-03.
- **Archivos:** modificar `index.html`.
- **Dependencias:** T-03.
- **Comprobación:** todos los controles con `label for`; "Agregar renglón" es `type="button"` (no envía el form) y "Confirmar venta" es `type="submit"`; tabla con las 5 columnas y `tbody` vacío; `#venta-total` presente con `$0,00`; mensajes con `role`/`hidden`.

### T-08 — Vista Historial (`#historial`)
- **Resultado esperado:** `<section id="historial" class="vista">` con `<h2>`; `div.tabla-contenedor` con `table#tabla-historial` — `<thead>`: Identificador | Fecha | Cliente | Total | Detalle — y `<tbody id="tabla-historial-cuerpo">` vacío; `div#historial-detalle` (región con `aria-label="Detalle de la venta"`) que contiene `table#tabla-detalle` con `<thead>` (Libro | Cantidad | Precio unitario | Subtotal) y `<tbody id="tabla-detalle-cuerpo">` vacío; `#historial-vacio` con "No hay ventas registradas." **visible**; `#historial-detalle-vacio` con "Seleccioná una venta para ver su detalle." **visible**.
- **Cubre:** R-02, R-03, R-04, R-05; CA-02, CA-03.
- **Archivos:** modificar `index.html`.
- **Dependencias:** T-03.
- **Comprobación:** 4 columnas obligatorias + columna "Detalle" (P4) con `th`; ambas tablas con `thead`+`th` y `tbody` vacíos; los 2 mensajes de estado existen y son texto visible; sin botones con lógica.

### T-09 — Plantillas HTML5 (`<template>`)
- **Resultado esperado:** `<template id="plantilla-libro">` con la tarjeta inerte del catálogo: `<article class="libro">` con `h3.libro__titulo`, y campos para ISBN, editorial, género (clase preparada para mostrar «Sin clasificar»), autores y precio —**elementos vacíos, sin texto de datos**—. `<template id="plantilla-renglon">` con una `<tr class="fila-renglon">`: `<td>` libro, `<td>` cantidad, `<td>` precio unitario, `<td>` subtotal, `<td>` acciones con `<button>` "Quitar" y `<button>` "Modificar" (texto descriptivo, `type="button"`).
- **Cubre:** R-03, R-07; CA-04 (preparación JS); decisión P3.
- **Archivos:** modificar `index.html` (colocadas al final de `main` o junto a su vista).
- **Dependencias:** T-04 (tarjeta) y T-07 (renglón) para no perder coherencia con sus vistas.
- **Comprobación:** existen ambos `id`; el contenido de las plantillas no se renderiza en el navegador (verificado en vivo: no aparece en la página); sin datos hardcodeados dentro; botones con texto y `type="button"`.

### T-10 — Verificación integral de la estructura
- **Resultado esperado:** evidencia de cada control ejecutado (aprobado / fallido / omitido / pendiente).
- **Cubre:** CA-01…CA-05, Verificación integral, Trazabilidad, Integridad.
- **Archivos:** ninguno (solo lectura); los hallazgos que exijan corrección vuelven a T-04…T-09.
- **Dependencias:** T-01…T-09.
- **Comprobaciones concretas:**
  1. **Semántica:** existen `header`, `nav`, `main`, 5 `section` con `id` de vista, `footer`; un `h1` y `h2` por vista sin saltos de nivel (inspección de código).
  2. **Labels:** script stdlib de solo lectura (temp) que cruza todos los `for=` con `id=` existentes y todos los controles de formulario con su label — 0 huérfanos.
  3. **Tablas:** toda `<table>` tiene `<thead>` con `<th>`; todos los `tbody` vacíos (0 filas `<tr>` de datos fuera de plantillas).
  4. **Botones:** todos con texto que describe la acción; "Agregar renglón"/"Quitar"/"Modificar" con `type="button"`.
  5. **Estados:** presencia de los 9 contenedores de la SPEC §6 con visibilidad inicial correcta; mensajes son texto con `role="status"`/`role="alert"` donde corresponde.
  6. **Ids:** inventario real vs SPEC §5.4 — coincidencia total; `name` presente en todos los campos de formularios.
  7. **Limpieza:** 0 coincidencias de `style=`, `<script>` con cuerpo, `required`, `pattern`, `min=`; 0 URLs `http://`/`https://`/`//` externos.
  8. **Enlaces:** `css/styles.css` y `js/app.js` existen y son los enlazados; `script` con `defer`.
  9. **Navegación/teclado (en vivo, `file://`):** recorrer con Tab header→nav→formularios→botones; los 5 enlaces del nav saltan a su vista; foco manejado (el foco visible estilizado se verifica en Ej. 2).
  10. **Anchos (parcial, en vivo):** abrir a 320 px y 1280 px: sin CSS no hay layout, se verifica únicamente que no hay atributos/ancho fijo que provoque scroll horizontal propio del HTML y que cada tabla está en `.tabla-contenedor` (la regla `overflow` es Ej. 2 → queda como verificación **pendiente por alcance**).

### T-11 — Resumen de implementación
- **Resultado esperado:** `docs/ejercicio1-implementacion-resumen.md` con: resumen de cambios, comprobaciones realizadas con su evidencia y estado, limitaciones, pendientes, archivos generados y mapeo breve a R-01–R-07 / CA-01–CA-05.
- **Cubre:** Verificación integral, Trazabilidad, Integridad.
- **Archivos:** crear `docs/ejercicio1-implementacion-resumen.md`.
- **Dependencias:** T-10.
- **Comprobación:** el resumen distingue aprobados/fallidos/omitidos/pendientes; ningún control no ejecutado figura como aprobado; los pendientes (Ej. 2 CSS, Ej. 3+ JS, verificación de scroll con estilos) están enumerados con motivo.

## Orden de ejecución

```
T-01 ─┐
T-02 ─┼─(paralelas)─→ T-03 → T-04, T-05, T-06, T-07, T-08 (secuencial liviano o paralelas entre sí)
                          └→ T-09 (después de T-04 y T-07) → T-10 → T-11
```

## Fuera de alcance de este plan (no se toca)

CSS con reglas (Ej. 2); JS con lógica, validaciones, filtros, renders, cálculos, localStorage (Ej. 3–6); ABM; README; datos de ejemplo hardcodeados; imágenes; librerías/CDNs/servidor/npm/build. Cualquier necesidad detectada durante la implementación que exceda este listado se informa y se consulta antes de ampliar el alcance.

---

**Fin de la Fase 2 (PLAN). Se presenta para revisión; no se inicia la IMPLEMENTACIÓN sin autorización explícita.**
