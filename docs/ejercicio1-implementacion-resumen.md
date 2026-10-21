# Resumen de implementación — Ejercicio 1: Estructura y pantallas HTML

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 1)**
Fase: **3 (IMPLEMENTACIÓN) completada** — sobre SPEC aprobada (`openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/spec-ejercicio1.md`) y PLAN aprobado (`openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/plan-ejercicio1.md`).
Fecha: 2026-10-16.

## 1. Resumen de cambios

Se ejecutaron las 11 tareas del plan (T-01 a T-11). No se detectó ningún impedimento que cambiara la solución aprobada.

| Tarea | Resultado |
|---|---|
| T-01 | Creado `css/styles.css` — solo comentario de encabezado, cero reglas. |
| T-02 | Creado `js/app.js` — solo comentario de encabezado, cero lógica. |
| T-03 | Creado `index.html`: doctype, `lang="es"`, charset, `viewport` (width=device-width), título «Librería El Estante — Programación III, Parcial 1», `<link>` a CSS, `<script defer>` a JS, `<header>` con `<h1 id="titulo-libreria">`, `<nav aria-label>` con los 5 enlaces-ancla, `<main>` con las 5 secciones, `<footer>` con pie de práctica académica. |
| T-04 | Vista Catálogo: `form-busqueda` (`role="search"`) con label+`input[type=search]`, `#catalogo-listado` vacío, `#catalogo-vacio` visible, `#catalogo-sin-resultados` con `hidden`. |
| T-05 | Vista Libros: `form-libro` con 6 campos (título, ISBN, precio `number step=0.01`, select editorial vacío, select género con `<option value="">Sin clasificar</option>`, select `multiple` de autores vacío), botón "Registrar libro", mensajes éxito/error (`role="status"`/`role="alert"`, `hidden`), tabla de 6 columnas con `thead`/`th` y `tbody#tabla-libros-cuerpo` vacío. |
| T-06 | Vista Clientes: `form-cliente` con nombre completo y email (`type=email`), botón "Registrar cliente", mensajes, tabla de 2 columnas con `tbody` vacío. |
| T-07 | Vista Ventas: un único `form-venta` con selección de cliente, `fieldset/legend` de renglón (select de libro + cantidad `number step=1` + botón `type="button"` "Agregar renglón"), tabla de renglones (Libro, Cantidad, Precio unitario, Subtotal, Acciones) con `tbody` vacío, `Total: <output id="venta-total">$0,00</output>`, botón `type="submit"` "Confirmar venta", mensajes. |
| T-08 | Vista Historial: tabla de ventas (Identificador, Fecha, Cliente, Total, Detalle) con `tbody` vacío, `#historial-vacio` visible, `#historial-detalle` (región `aria-label`) con `#historial-detalle-vacio` visible y sub-tabla `#tabla-detalle` (Libro, Cantidad, Precio unitario, Subtotal) con `tbody` vacío. |
| T-09 | `<template id="plantilla-libro">` (tarjeta `article.libro` con `h3` y `dl` de ISBN/editorial/género/autores/precio, elementos vacíos) y `<template id="plantilla-renglon">` (`tr.fila-renglon` con 4 `td` + `td` de acciones con botones `type="button"`). |
| T-10 | Verificación integral — ver §2. |
| T-11 | Este documento. |

### Ajustes menores respecto de SPEC/PLAN (aditivos, sin salir del alcance)

- Texto del estado "búsqueda sin resultados": "No se encontraron libros que coincidan con la búsqueda." (la SPEC proponía texto con el término entre comillas; el texto específico se compondrá desde JS en Ejercicio 3).
- Botones de la plantilla de renglón: "Quitar renglón" / "Modificar renglón" (el PLAN decía "Quitar"/"Modificar"; se hizo más descriptivo para cumplir R-02).
- Adiciones semánticas/de preparación: `aria-labelledby` + `id` en cada `h2`, `scope="col"` en todos los `th`, `fieldset/legend` en el bloque de renglón, `id="boton-agregar-renglon"`, clases estructurales `.campo`, `.tabla`, `.boton`, `.encabezado`, `.contenido`, `.pie`, `.venta__total`, `.detalle-venta`, `.renglon-alta`. No renombra ni contradice la convención §5.3 de la SPEC.

## 2. Comprobaciones realizadas (evidencia)

### 2.1 Ejecutadas por el agente — 37 controles, 0 fallidos

**Verificación estructural automatizada (Python stdlib, solo lectura, script en carpeta temporal — no se agregó al proyecto): 29/29 APROBADOS.**

| Control | Resultado |
|---|---|
| Semántica: `header`/`nav`/`main`/`footer`; 5 `section` en orden `#catalogo → #libros → #clientes → #ventas → #historial`; encabezados `[h1, h2×5, h3]` sin saltos | APROBADO |
| Labels: 0 `for` sin `id` destino; 0 controles sin label; sin `for` repetido | APROBADO |
| Tablas: 5/5 con `thead`+`th` y con `tbody`; 0 filas de datos hardcodeadas fuera de plantillas | APROBADO |
| Botones: 0 sin texto; "Agregar renglón"/"Quitar renglón"/"Modificar renglón" con `type="button"` | APROBADO |
| Estados: los 10 contenedores de SPEC §6 existen con su visibilidad inicial correcta; `role="status"`/`role="alert"` presentes | APROBADO |
| Ids: 42/42 requeridos presentes; 0 duplicados; 0 controles sin `name` | APROBADO |
| Limpieza: 0 `style` inline; 0 `<script>` con cuerpo; 0 `required`/`pattern`/`min` (P6); 0 URLs externas | APROBADO |
| Enlaces: `css/styles.css` y `js/app.js` existen, enlazados, `defer` presente; CSS sin reglas; JS sin lógica | APROBADO |
| Navegación: enlaces `#catalogo, #libros, #clientes, #ventas, #historial` en ese orden | APROBADO |
| Scroll propio: `tabla-contenedor` en 5/5 tablas; 0 anchos/altos fijos en HTML | APROBADO |
| Plantillas: ambas presentes, no anidadas; 0 datos de ejemplo hardcodeados | APROBADO |

*Nota de transparencia:* el primer run marcó FALLIDO "ancho fijo": era un **falso positivo** de mi propia expresión regular, que detectó el `width=device-width` del `meta viewport` (obligatorio por T-03, no es ancho fijo). Corregí el control para excluir el `meta viewport` y volví a ejecutar: 29/29.

**Carga real en navegador headless (Edge, `file://`) — 8/8 APROBADOS** (DOM capturado con `--dump-dom` tras abrir `index.html`):
h1 y 5 secciones presentes en el DOM cargado; templates inertes (0 tarjetas/filas/botones "Quitar renglón" fuera de `<template>`); visibilidad inicial de estados conservada; mensajes de historial presentes; 10.090 bytes cargados sin dependencias de red.

**Existencia de archivos:** `index.html`, `css/styles.css`, `js/app.js`, `openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/spec-ejercicio1.md`, `openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/plan-ejercicio1.md` verificados en disco.

### 2.2 No ejecutadas / pendientes (NO se declaran aprobadas)

| Control | Estado | Motivo |
|---|---|---|
| Inspección visual de las capturas 320 px y 1280 px | **OMITIDO** | Se generaron las capturas (`Temp\opencode\ej1_320.png`, `ej1_1280.png`) pero el modelo del agente **no admite lectura de imágenes**: no pude verlas. Quedan para tu revisión manual. |
| Recorrido de teclado en vivo (Tab/Enter sobre nav, formularios y botones) | **OMITIDO** | Requiere interacción gráfica; el agente no opera la ventana. Estructuralmente soportado (controles nativos `<a>`, `<input>`, `<select>`, `<button>`), pero la verificación final es manual. |
| Desplazamiento horizontal de la página a 320 px con tablas anchas | **PENDIENTE POR ALCANCE** | La regla `overflow` dentro de `.tabla-contenedor` es CSS del Ejercicio 2. En Ejercicio 1 solo se verificó la estructura habilitante (5/5 contenedores, sin anchos fijos). |
| Foco visible | **PENDIENTE POR ALCANCE** | Estilo de foco: Ejercicio 2 (R-04, CA-04 lo contemplan estructuralmente). |

## 3. Limitaciones

- Verificación automatizada = estructura y carga; no cubre comportamiento visual ni accesibilidad percepción (sin imágenes ni interacción gráfica disponibles para el agente).
- Sin CSS no hay layout: la legibilidad a 320/1280 px se define en el Ejercicio 2.
- La navegación SPA hoy salta por anclas con las 5 vistas apiladas y visibles; el mostrado exclusivo de una vista requiere CSS (Ej. 2) o JS (Ej. 3), tal como aclaró la SPEC §5.1 (decisión P1).

## 4. Pendientes (fuera de este ejercicio, por diseño)

1. CSS con reglas, foco visible y `overflow` de tablas — Ejercicio 2.
2. Datos, render de catálogo, filtro, altas con validación, ventas, historial y localStorage — Ejercicios 3–6.
3. README y casos manuales — Ejercicio 6.
4. Los 4 controles de §2.2 marcados OMITIDO/PENDIENTE requieren revisión manual o pertenecen a ejercicios posteriores.

## 5. Archivos generados

| Archivo | Acción |
|---|---|
| `index.html` | creado (estructura completa, ~10 KB) |
| `css/styles.css` | creado (placeholder, solo comentario) |
| `js/app.js` | creado (placeholder, solo comentario) |
| `openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/spec-ejercicio1.md` | Fase 1 (§9 actualizada con P1–P6 resueltas) |
| `openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/plan-ejercicio1.md` | Fase 2 |
| `docs/ejercicio1-implementacion-resumen.md` | este archivo |

Fuera del proyecto (temp del sistema, no se entrega): scripts de verificación y capturas mencionados en §2.

## 6. Mapeo a requisitos y criterios

| Criterio | Evidencia | Estado |
|---|---|---|
| CA-01 (R-01, R-02, R-06) | Semántica + nav 5 enlaces + archivos en raíz/css/js (§2.1) | APROBADO (estructura); recorrido teclado en vivo OMITIDO (§2.2) |
| CA-02 (R-02, R-03) | Formularios completos por vista, «Sin clasificar», `multiple`, tabla renglones+total, historial+detalle (§2.1) | APROBADO |
| CA-03 (R-03, R-04) | 10 estados con visibilidad inicial, mensajes de texto con `role`, 5 tablas con `thead`/`th`, labels 0 huérfanos (§2.1) | APROBADO |
| CA-04 (R-05, R-06, R-07) | Enlaces+defer, 0 inline, 0 URLs externas, 5/5 `.tabla-contenedor`, 42 ids, 0 lógica (§2.1) | APROBADO (scroll y foco real → PENDIENTE Ej. 2, §2.2) |
| CA-05 (global) | Solo HTML5 + 2 placeholders; nada de lo excluido fue creado | APROBADO |
| Verificación integral | 37 controles ejecutados con resultado informado; omitidos/pendientes listados sin presentarse como aprobados | APROBADO |
| Trazabilidad | Decisiones P1–P6 registradas en SPEC §9; ajustes menores en §1; pendientes en §2.2/§4 | APROBADO |
| Integridad | Ninguna entrega declarada completa con controles ocultos; pendientes enumerados con motivo | APROBADO |
