# Especificación — Ejercicio 1: Estructura y pantallas HTML

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 1)**
Estado de este documento: **Fase 1 (SPEC) — pendiente de aprobación. No se escribió código.**
Fecha de redacción: 2026-10-16.

---

## 1. Problema, objetivo y resultado esperado

**Problema.** El parcial exige un frontend de librería construido con HTML5, CSS y JavaScript nativos, sin frameworks ni herramientas de compilación, abrible directamente con `file://`. El Ejercicio 1 (20 puntos: *Vistas y navegación* 10; *Semántica, formularios y estados* 10) debe sentar la estructura completa de vistas sobre la que los Ejercicios 2–6 agregan estilos, datos, altas, ventas y persistencia.

**Objetivo.** Obtener la estructura HTML completa del sistema con las 5 vistas requeridas (Catálogo, Libros, Clientes, Ventas, Historial), navegación clara entre ellas, semántica correcta, formularios con `label` asociado, tablas con `thead`/`th`, contenedores de estados/mensajes, e `id`/`name`/`class` preparados para el JavaScript nativo de los Ejercicios 3–5.

**Resultado esperado.** Un `index.html` (más los HTML adicionales si se opta por arquitectura multipágina) que abra en el navegador sin conexión, muestre las 5 vistas con su navegación, y contenga únicamente estructura —sin CSS ni JS implementados—, enlazando `css/styles.css` y `js/app.js` como archivos externos a desarrollar después.

---

## 2. Contexto verificado y referencias

### 2.1 Fuentes consultadas

| Fuente | Cómo se consultó | Uso |
|---|---|---|
| `Consigna Primer Parcial.pdf` (336.215 bytes, 6 páginas) | El modelo no admite lectura directa de PDF; se extrajo el texto con `pypdf` (Python 3.13, local) a un archivo temporal y se leyó completo. La extracción preserva el texto pero puede perder el diseño original (columnas, encabezados de página). | Fuente de requisitos del Ejercicio 1 y de los criterios de evaluación. |
| Listado de directorio de `C:\Users\Admin\Documents\facu 3\prog\Primer Parcial\` | PowerShell `Get-ChildItem -Force` + glob `**/*`, 2026-10-16. | Verificación del estado actual. |

No se consultaron otras fuentes. No se inventaron archivos, datos ni resultados.

### 2.2 Hechos verificados (directorio del parcial)

- El directorio contiene **un único archivo**: `Consigna Primer Parcial.pdf`.
- **No existen**: `index.html`, carpeta `css/`, carpeta `js/`, carpeta `recursos/`, carpeta `docs/` (recién creada para alojar este documento), ni ningún otro HTML.
- Los `{{DATO_PENDIENTE: Verificar existencia de index.html, carpetas css/, js/ y recursos/}}` de la plantilla quedan **resueltos con hechos**: nada de eso existe hoy; todo se crea desde cero.

### 2.3 Hechos extraídos de la consigna (Ejercicio 1, páginas 2–3)

- "Se organiza el proyecto con `index.html` como entrada. Se permite usar **varias páginas o secciones de una misma página**, siempre que exista navegación clara entre las siguientes vistas."
- Catálogo: título de la librería, buscador por título y listado de libros; cada libro muestra título, ISBN, editorial, género, autores y precio; sin género se muestra «Sin clasificar».
- Libros / Clientes: formulario de alta + listado.
- Ventas: selección de cliente, composición de renglones y resumen de la venta.
- Historial: listado de ventas y acceso a sus detalles.
- "Se incluyen encabezado, navegación y contenido principal con etiquetas semánticas. Cada campo posee una etiqueta asociada; los botones tienen textos que describen su acción. Las tablas incluyen encabezados. Se incorporan mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas."
- "Los listados y el historial se conectan con los datos locales. La estructura contempla los campos y estados que utiliza JavaScript."
- Puntaje Ejercicio 1: 20 puntos → *Vistas y navegación: 10; semántica, formularios y estados: 10*.
- Trazabilidad de ejercicios posteriores que condicionan la estructura: Ej. 3 (render del catálogo y filtro por título), Ej. 4 (selectores poblados desde datos locales, «Sin clasificar» en género, selector múltiple de autores, `preventDefault`, mensajes junto al formulario), Ej. 5 (renglón con libro/cantidad/precio unitario/subtotal, quitar/modificar renglón, confirmar con identificador/fecha/cliente/total, historial con detalle), Ej. 6 (localStorage, README).

---

## 3. Alcance

### 3.1 Incluido

- **Vista Catálogo (`#catalogo`):** título de la librería; buscador por título con `<label>` asociado; contenedor de listado de libros (título, ISBN, editorial, género — contemplando «Sin clasificar» —, autores, precio); contenedores de estado "lista vacía" y "búsqueda sin resultados".
- **Vista Libros (`#libros`):** formulario de alta con título, ISBN, precio, select de editorial, select de género con opción «Sin clasificar», selector múltiple de autores y botón con texto descriptivo; listado en tabla con `<thead>` y `<th>`; contenedores de mensaje correcto/rechazado.
- **Vista Clientes (`#clientes`):** formulario de alta con nombre completo, email y botón descriptivo; listado en tabla con encabezados; contenedores de mensaje correcto/rechazado.
- **Vista Ventas (`#ventas`):** selección de cliente existente; composición de renglón (selector de libro + campo cantidad + botón "Agregar renglón"); tabla de renglones (libro, cantidad, precio unitario, subtotal, acciones); sección de total; botones para quitar/modificar renglón (mínimo quitar; se dejan preparados en la estructura de fila); botón "Confirmar venta" con texto descriptivo; contenedor de mensajes de resultado/validación.
- **Vista Historial (`#historial`):** tabla de ventas (identificador, fecha, cliente, total) con acceso al detalle de la venta seleccionada; zona de detalle; mensaje "sin ventas registradas".
- **Navegación:** `<nav>` con enlaces a las 5 vistas, accesible por teclado (Tab + Enter).
- **Semántica general:** `<header>`, `<nav>`, `<main>`, `<section>` por vista, `<footer>` cuando aplique.
- **Formularios:** cada campo con `<label for>` coincidente con su `id`; botones con texto que describe la acción.
- **Tablas:** todas con `<thead>` y `<th>`; `tbody` con `id` para render futuro.
- **Preparación JS:** `id`, `name` y `class` coherentes con los Ejercicios 3–5 (ver §5).
- **Enlaces externos:** `<link rel="stylesheet" href="css/styles.css">` y `<script src="js/app.js" defer></script>`, dejando claro que CSS/JS aún no se implementan.

### 3.2 Excluido

- Cualquier regla CSS (Ejercicio 2) y JavaScript funcional: validaciones, filtrado, render, cálculos, persistencia, localStorage (Ejercicios 3–6).
- ABM completo (editar/eliminar).
- Datos dinámicos reales: el HTML no lleva ejemplos hardcodeados de libros/clientes/ventas; solo estructura vacía y contenedores. (Únicos textos fijos autorizados y justificados: la opción «Sin clasificar», rótulos de columna, textos de mensaje y el total inicial — ver §6.)
- Imágenes/iconos: no se crean recursos `recursos/` ni se referencian imágenes (no existen recursos locales justificados hoy).
- README, casos manuales, comprobación de precio histórico (Ejercicio 6).
- Librerías, frameworks, CDNs, APIs, backend, DB, npm, build, TypeScript, preprocesadores.
- Refactorizaciones o dependencias ajenas: cualquier necesidad fuera de alcance se anota como **propuesta pendiente** (§9).

---

## 4. Requisitos y escenarios observables

| ID | Grupo | Requisito verificable | Escenario observable (verificación) | Casos límite relevantes |
|---|---|---|---|---|
| R-01 | Funcional | Navegación clara entre las 5 vistas: Catálogo, Libros, Clientes, Ventas, Historial. | Desde cualquier vista, la barra de `<nav>` muestra 5 enlaces con texto visible; recorrerlos con Tab y activar con Enter lleva al destino de cada vista. | Si se elige SPA: los enlaces son anclas `href="#id"` que saltan a la vista aún sin JS; el mostrado exclusivo de una vista queda para Ej. 2/3 (segs. decisión de §9). Si se elige multipágina: cada enlace apunta a un `.html` existente y la navegación es totalmente funcional desde el Ejercicio 1. |
| R-02 | Estructura e interfaces | HTML semántico (`header`, `nav`, `main`, `section`, `footer`); cada campo con `<label for>`; botones con texto descriptivo; todas las tablas con `<thead>` y `<th>`. | Inspección del código fuente: existen las etiquetas semánticas pedidas; cada `for=` coincide con un `id=` existente y viceversa (todo `id` de control tiene su label); los `<button>` contienen texto que nombra la acción ("Registrar libro", "Registrar cliente", "Agregar renglón", "Confirmar venta"); toda `<table>` tiene `<thead>` con `<th>`. | Selects vacíos (editorial/género/autores se pueblan desde JS en Ej. 4) deben conservar igualmente su `<label for>`; el `multiple` también lleva label. |
| R-03 | Datos y estados | Contenedores para: listado de catálogo, "lista vacía", "búsqueda sin resultados", formularios con sus campos, listados de libros/clientes, tabla de renglones, total, listado de ventas, detalle de venta, mensajes de éxito/error/rechazo; `id`/`name`/`class` coherentes con Ej. 3–5. | Checklist de ids de §5 presentes en el HTML; género incluye opción «Sin clasificar»; autores es `<select multiple>`; tabla de renglones tiene columnas libro/cantidad/precio unitario/subtotal; existe contenedor de total; existe zona de detalle de venta; cada formulario/message tiene su contenedor de estado. | Género ausente → opción «Sin clasificar» con `value=""`. Historial vacío → mensaje "sin ventas registradas". Búsqueda sin coincidencias ≠ lista vacía: son dos contenedores distintos. Sin ventas/no seleccionada → mensaje en la zona de detalle. |
| R-04 | Calidad | Accesibilidad básica: labels, orden lógico, navegación por teclado viable; mensajes como texto (no solo color); foco visible previsto en estructura. | Recorrido por teclado: cada control es alcanzable en orden lógico label→control; los mensajes son nodos de texto en el HTML (palabras como "Operación correcta"/"Rechazada", no solo clases de color); los contenedores de mensaje usan `role="status"`/`role="alert"` (atributos HTML, sin JS); las tablas envueltas en un contenedor propio preparado para `overflow` y foco (regla CSS en Ej. 2). | Sin imágenes no hay `alt` que verificar; si se agregaran después, las decorativas llevan `alt=""`. |
| R-05 | Compatibilidad | Apertura directa `file://` sin herramientas externas; contemplar 320 px y 1280 px sin desplazamiento horizontal global; tablas con desplazamiento dentro de su propio contenedor. | Abrir `index.html` con doble clic (sin servidor): carga sin errores de recursos inexistentes más allá de los enlaces CSS/JS declarados; no hay URLs externas, iframes ni dependencias de red; toda tabla está dentro de un `div.tabla-contenedor` (clase destinada a `overflow-x:auto` en Ej. 2); no se fija ningún ancho fijo en el HTML. | Anchos 320/1280 se verifican al 100% en Ej. 2; en Ej. 1 solo se garantiza la estructura habilitante (contenedores de scroll, ausencia de anchos fijos, sin CSS inline). |
| R-06 | Convenciones | Archivos en ubicación correcta; enlaces a `css/styles.css` y `js/app.js`; nombres en español/claros; sin CSS/JS inline. | `index.html` en la raíz del parcial; `<link>` y `<script defer>` apuntan a las rutas indicadas; nombres de ids/clases/atributos en español y descriptivos; `grep` de `style=` y `<script>` inline sin coincidencias (salvo el tag `src=` autorizado). | Los archivos `css/styles.css` y `js/app.js` aún no existen: se crearán como placeholders vacíos (decisión de §9) o se dejan los enlaces colgantes según se apruebe. |
| R-07 | Preparación futura | Solo estructura, ids, clases y contenedores; sin filtrado, validación, cálculos, persistencia ni ABM. | El HTML no contiene lógica: sin atributos `required`/`pattern` (decisión §9), sin datos de ejemplo hardcodeados, sin `<style>` ni scripts con cuerpo; los `tbody` y contenedores de listado están vacíos. | Textos fijos mínimos autorizados y justificados: «Sin clasificar», rótulos, mensajes y total inicial (§6). |

---

## 5. Estructura propuesta, interfaces y datos

### 5.1 Arquitectura — *decisión pendiente (ver §9, P1)*

La consigna permite "varias páginas o secciones de una misma página". Se proponen dos opciones:

**Opción A — SPA con secciones (recomendada).** Un solo `index.html` con `<section id="catalogo">`, `#libros`, `#clientes`, `#ventas`, `#historial` dentro de `<main>`. Los enlaces del `<nav>` usan `href="#catalogo"` etc.:

- *A favor:* coincide con los ids `#catalogo` de la propia consigna; un único `js/app.js` en Ej. 3–5 sin guards por página; co-locación de formularios y listados que se actualizan en el mismo evento (alta de libro → aparece en catálogo y en la selección de venta); los enlaces-ancla **ya funcionan sin JS** (saltan a la vista), de modo que la navegación es operativa desde el Ejercicio 1.
- *En contra:* el mostrado exclusivo de una vista (ocultar las demás) requiere CSS `:target`/clases (Ej. 2) o JS (Ej. 3); hasta entonces las 5 vistas quedan apiladas y visibles en la misma página.

**Opción B — Multipágina.** `index.html` (Catálogo) + `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, todas con el mismo `<header>`/`<nav>`.

- *A favor:* navegación plenamente funcional desde el Ejercicio 1 sin JS ni CSS; cada vista es una pantalla "real" ya en esta entrega.
- *En contra:* duplicación de encabezado/navegación en 5 archivos; `app.js` debe detectar en qué página está para no fallar; las actualizaciones cruzadas (alta de libro → catálogo/venta en otra página) dependen de recargas o de localStorage anticipado (Ej. 6), lo que complica los Ejercicios 3–5.

**No se cierra esta decisión acá** (§9, P1).

### 5.2 Esqueleto semántico común (aplica a ambas opciones)

```
<header>  → <h1 id="titulo-libreria">Nombre de la librería</h1>   (nombre pendiente: §9, P2)
<nav aria-label="Navegación principal"> → 5 <a class="nav-enlace" href="…">
<main>    → <section class="vista" id="catalogo|libros|clientes|ventas|historial"> … </section>
<footer>  → pie con dato de práctica académica (texto breve, sin datos ficticios inventados)
```

Cada `<section>` abre con `<h2>`.

### 5.3 Convención de nombres (estable para Ej. 3–5)

- **Secciones/vistas:** `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial` + clase `.vista`.
- **Formularios:** prefijo `form-`: `#form-busqueda`, `#form-libro`, `#form-cliente`, `#form-venta` (incluye renglones + confirmación).
- **Campos:** prefijo entidad-campo: `#libro-titulo`, `#cliente-email`, `#venta-cliente`, `#renglon-libro`, `#renglon-cantidad`, `#buscador-titulo`. El atributo `name` repite solo el segmento de campo (`name="titulo"`, `name="email"`, `name="cantidad"`, …) dentro de su formulario.
- **Listados:** `#catalogo-listado`; **tablas:** `#tabla-libros`, `#tabla-clientes`, `#tabla-renglones`, `#tabla-historial`, `#tabla-detalle`; **cuerpos de tabla** (target de render): sufijo `-cuerpo` → `#tabla-libros-cuerpo`, `#tabla-clientes-cuerpo`, `#tabla-renglones-cuerpo`, `#tabla-historial-cuerpo`, `#tabla-detalle-cuerpo`.
- **Mensajes/estados:** `#<entidad>-mensaje-exito` y `#<entidad>-mensaje-error`; estados de lista: `#catalogo-vacio`, `#catalogo-sin-resultados`, `#historial-vacio`, `#historial-detalle-vacio`; detalle: `#historial-detalle`; total: `#venta-total`.
- **Clases (hooks estables):** `.vista`, `.nav-enlace`, `.formulario`, `.campo`, `.listado`, `.mensaje` con modificadores `.mensaje--exito`, `.mensaje--error`, `.mensaje--vacio`, `.tabla-contenedor`, `.libro` (tarjeta), `.fila-renglon`. El Ejercicio 2 podrá *agregar* clases de estilo sin renombrar estas.
- **Plantillas HTML5 (propuesta, §9 P3):** `<template id="plantilla-libro">` (tarjeta del catálogo: título, ISBN, editorial, género, autores, precio) y `<template id="plantilla-renglon">` (fila `<tr>` de renglón: libro, cantidad, precio unitario, subtotal, acciones). Son HTML5 estándar, inercia (no se renderizan) y dejan el molde de render sin lógica.

### 5.4 Inventario mínimo de `id` por vista

| Vista | IDs |
|---|---|
| Global | `titulo-libreria` |
| Catálogo | `form-busqueda`, `buscador-titulo`, `catalogo-listado`, `catalogo-vacio`, `catalogo-sin-resultados`, `plantilla-libro` (si se aprueba) |
| Libros | `form-libro`, `libro-titulo`, `libro-isbn`, `libro-precio`, `libro-editorial`, `libro-genero`, `libro-autores`, `libro-mensaje-exito`, `libro-mensaje-error`, `tabla-libros`, `tabla-libros-cuerpo` |
| Clientes | `form-cliente`, `cliente-nombre`, `cliente-email`, `cliente-mensaje-exito`, `cliente-mensaje-error`, `tabla-clientes`, `tabla-clientes-cuerpo` |
| Ventas | `form-venta`, `venta-cliente`, `renglon-libro`, `renglon-cantidad`, `tabla-renglones`, `tabla-renglones-cuerpo`, `venta-total`, `venta-mensaje-exito`, `venta-mensaje-error`, `plantilla-renglon` (si se aprueba) |
| Historial | `tabla-historial`, `tabla-historial-cuerpo`, `historial-detalle`, `tabla-detalle`, `tabla-detalle-cuerpo`, `historial-vacio`, `historial-detalle-vacio` |

### 5.5 Detalle funcional de cada vista (estructura, sin lógica)

- **Catálogo:** `<form id="form-busqueda" role="search">` con label "Buscar por título" + `input[type=search]`; `#catalogo-listado` vacío (JS lo renderiza en Ej. 3); los dos mensajes de estado. *Nota:* sin JS, pulsar Enter recargaría la página (inofensivo); en Ej. 3 se escucha `input` y/o se aplica `preventDefault`.
- **Libros:** campos texto (título), texto (ISBN), `input[type=number] step="0.01"` (precio), `select` editorial (**vacío**: se puebla desde datos locales en Ej. 4), `select` género **con** `<option value="">Sin clasificar</option>` estática + resto poblado por JS, `select multiple` autores (vacío, se puebla en Ej. 4), `<button type="submit">Registrar libro</button>`. Tabla: Título | ISBN | Editorial | Género | Autores | Precio, `tbody#tabla-libros-cuerpo` vacío.
- **Clientes:** `nombre completo` (texto) y `email` (`type=email`), `<button type="submit">Registrar cliente</button>`. Tabla: Nombre completo | Email.
- **Ventas:** un único `<form id="form-venta">` que contiene: `select#venta-cliente`; bloque de renglón (`select#renglon-libro` vacío + `input#renglon-cantidad[type=number]` + `<button type="button">Agregar renglón</button>`); `#tabla-renglones` con columnas Libro | Cantidad | Precio unitario | Subtotal | Acciones (la columna Acciones alberga los botones "Quitar"/"Modificar" de las filas que renderizará JS en Ej. 5); bloque de total; `<button type="submit">Confirmar venta</button>`; mensajes. Ventas y renglones se renderizan sin filas hardcodeadas.
- **Historial:** `#tabla-historial` con Identificador | Fecha | Cliente | Total | Detacción de detalle (columna extra "Detalle" con botón "Ver detalle" renderizado por JS — necesaria porque el consigna exige "acceso a sus detalles" y un botón es operable por teclado; ver §9, P4). `#historial-detalle` (región con `aria-label`) vacío; `#historial-vacio` y `#historial-detalle-vacio` con su texto.

### 5.6 Datos necesarios en esta fase

Ninguno. Los datos (libros, editoriales, géneros, autores, clientes, ventas) se introducen en el Ejercicio 3. No se hardcodean ejemplos en el HTML.

---

## 6. Estados y manejo de errores (solo estructural)

| Estado | Contenedor | Texto fijo propuesto | Visibilidad inicial | Quién lo activa |
|---|---|---|---|---|
| Catálogo sin libros | `#catalogo-vacio` | "No hay libros en el catálogo." | visible (la lista empieza vacía) | Ej. 3 |
| Búsqueda sin coincidencias | `#catalogo-sin-resultados` | "No se encontraron libros para «…»." (el texto puede componerse desde JS) | `hidden` | Ej. 3 |
| Alta de libro correcta | `#libro-mensaje-exito` (`role="status"`) | "Libro registrado correctamente." | `hidden` | Ej. 4 |
| Alta de libro rechazada | `#libro-mensaje-error` (`role="alert"`) | "No se pudo registrar el libro. Revisá los datos." | `hidden` | Ej. 4 |
| Alta de cliente correcta/rechazada | `#cliente-mensaje-exito` / `#cliente-mensaje-error` | análogo a libros | `hidden` | Ej. 4 |
| Venta: resultado/validación | `#venta-mensaje-exito` / `#venta-mensaje-error` | "Venta registrada." / "No se pudo confirmar la venta. Revisá los datos." | `hidden` | Ej. 5 |
| Historial sin ventas | `#historial-vacio` | "No hay ventas registradas." | visible | Ej. 5 |
| Detalle sin venta seleccionada | `#historial-detalle-vacio` | "Seleccioná una venta para ver su detalle." | visible | Ej. 5 |
| Total inicial | `#venta-total` | "$0,00" | siempre (se sobreescribe) | Ej. 5 |

Todos los mensajes son **texto** en el HTML (nunca solo color — R-04). Se declara explícitamente: aquí solo se prevén los estados; **no se implementa validación ni lógica**.

---

## 7. Restricciones técnicas y convenciones

1. HTML5 puro; sin frameworks, librerías, CDNs, APIs, servidor, DB, npm, build, TypeScript ni preprocesadores.
2. Apertura directa `file://`, sin conexión a internet: **cero URLs externas**.
3. Separación estricta: `index.html` en la raíz; `css/styles.css`; `js/app.js` con `defer`; **sin** `style=` inline ni `<script>` con cuerpo inline.
4. Semántica: `header`, `nav`, `main`, `section`, `footer`; un `h1` (título de la librería) y `h2` por vista; orden de encabezados sin saltos.
5. Todo control visible tiene `<label for>` apuntando a un `id` existente.
6. Botones con texto que describe la acción; nunca botones vacíos o "Enviar" genéricos.
7. Toda tabla con `<thead>` + `<th>`; `tbody` con `id` para render.
8. Nombres en español, descriptivos y consistentes con la convención de §5.3.
9. Sin anchos fijos ni estilos de layout en el HTML (dejan de ser responsabilidad del Ejercicio 2); tablas envueltas en `.tabla-contenedor` para scroll propio.
10. Sin lógica: no `required`/`pattern` (decisión §9 P5), no funciones, no datos de ejemplo.

---

## 8. Criterios de aceptación (adaptados al Ejercicio 1)

- [ ] **CA-01 — Estructura general (R-01, R-02, R-06):** Existe `index.html` (y HTML adicionales si se aprobó multipágina) con `<header>`, `<nav>`, `<main>`, una `<section>` por vista y `<footer>`; la navegación enlaza las 5 vistas y es operable por teclado.
- [ ] **CA-02 — Formularios y datos (R-02, R-03):** Catálogo con buscador + label; Libros con todos los campos, select de género con «Sin clasificar», selector múltiple de autores y botón descriptivo; Clientes con nombre completo y email + botón descriptivo; Ventas con selección de cliente, libro+cantidad+botón "Agregar renglón", tabla de renglones con subtotal, bloque de total, quitar/modificar renglón previstos y "Confirmar venta"; Historial con tabla de ventas + zona de detalle.
- [ ] **CA-03 — Estados y mensajes (R-03, R-04):** Contenedores presentes para lista vacía, búsqueda sin resultados, éxito, error/rechazo (por formulario), sin ventas y detalle sin selección; todos los mensajes son texto con `role` apropiado; toda tabla con `<thead>` y `<th>`; todo campo con `<label for>`.
- [ ] **CA-04 — Adaptación y preparación (R-05, R-06, R-07):** Enlaces a `css/styles.css` y `js/app.js` (`defer`); sin CSS/JS inline; sin URLs externas; tablas dentro de `.tabla-contenedor`; sin anchos fijos; ids/nombres/clases según §5.3; sin lógica ni datos hardcodeados.
- [ ] **CA-05 — Alcance puro (global):** Se cubre todo el alcance aprobado sin incorporar trabajo excluido; solo tecnologías y dependencias permitidas.
- [ ] **Verificación integral:** Todas las comprobaciones de §4 se ejecutan y se informa evidencia, distinguindo aprobado/fallido/omitido/pendiente; ningún control no ejecutado se declara aprobado.
- [ ] **Trazabilidad:** Supuestos, `{{DATO_PENDIENTE}}`, limitaciones y propuestas pendientes quedan identificados en §9.
- [ ] **Integridad:** No se declara completa la entrega con criterios sin verificar; los pendientes se enumeran con su motivo.

---

## 9. Supuestos, información pendiente y decisiones que requieren tu respuesta

### Decisiones que requieren respuesta (bloqueantes para PLAN/IMPLEMENTACIÓN)

- **P1 — Arquitectura: SPA con secciones o multipágina?** (§5.1). *Recomendación: Opción A (SPA con secciones y enlaces-ancla), por los motivos listados en §5.1.* Responder: **"A"** o **"B"** (o indicar otra condición).
- **P2 — Nombre de la librería** para el `<h1>` del encabezado (la consigna pide "título de la librería" pero no lo define). *Propuesta: «Librería El Estante»* — aceptar o indicar el nombre a usar.

### Decisiones no bloqueantes (se avanzan con la propuesta salvo veto)

- **P3 — `<template>` para tarjeta de libro y fila de renglón.** *Propuesta: incluirlos* (`#plantilla-libro`, `#plantilla-renglon`): refuerza "preparación JS" sin introducir lógica ni datos renderizados.
- **P4 — Columna extra "Detalle" en la tabla del historial.** La consigna pide las 4 columnas (identificador, fecha, cliente, total) *y* "acceso a sus detalles". *Propuesta: 4 columnas obligatorias + columna "Detalle" con botón "Ver detalle"* renderizado por JS (operable por teclado). Alternativa: hacer el identificador un botón dentro de su propia celda.
- **P5 — Placeholders de `css/styles.css` y `js/app.js`.** *Propuesta: crear ambos archivos vacíos (con un comentario de encabezado) para que los enlaces no den 404 en `file://`.* Alternativa: dejar los enlaces colgantes hasta el Ejercicio 2.
- **P6 — Atributos de validación nativos** (`required`, `pattern`, `min`). *Propuesta: no incluirlos en el Ejercicio 1* (la validación es del Ejercicio 4 y el alcance de este ejercicio excluye lógica de validación); se podrá agregar después junto con la validación JS si se aprueba.

### Supuestos declarados

- S1: La consigna se leyó mediante extracción de texto del PDF; el contenido coincide con el resumen de la consigna del pedido, pero el diseño de página del PDF no fue inspeccionado.
- S2: No existen recursos de imagen local ni se requieren; por eso no se crea `recursos/` ni se referencian imágenes.
- S3: El Ejercicio 1 no exige README (corresponde al Ejercicio 6), por lo que no se genera.
- S4: Los estados iniciales "visibles" de §6 (listas vacías) son coherentes con arrancar sin datos; si en el Ejercicio 3 los datos se cargan de inmediato, JS los ocultará al renderizar.

### Información pendiente (no bloqueante)

- `{{DATO_PENDIENTE: ...}}` de datos ficticios hardcodeados: resuelto como **no requeridos** para este ejercicio (solo estructura), tal como indica la consigna.

---

**Fin de la Fase 1 (SPEC). No se escribió ni modificó ningún archivo de producto (`index.html`, CSS, JS): solo se creó este documento en `docs/`. Se espera tu revisión y aprobación, y tus respuestas a P1 y P2, antes de avanzar a la Fase 2 (PLAN).**
