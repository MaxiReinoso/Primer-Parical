# Especificación — Ejercicio 3: Catálogo dinámico y filtro por título

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 3)**
Estado de este documento: **Fase 1 (SPEC) — pendiente de aprobación. No se escribió código.**
Fecha de redacción: 2026-10-20.

---

## 1. Problema, objetivo y resultado esperado

**Problema.** Los Ejercicios 1 y 2 entregaron la estructura HTML completa (5 vistas, formularios, tablas, plantillas) y la presentación CSS (identidad visual, layout responsive, accesibilidad). El `js/app.js` es aún un placeholder sin lógica. El Ejercicio 3 (20 puntos: *Catálogo y filtro* 15; *Calidad de código* 5) debe implementar en JavaScript nativo: (a) datos locales ficticios (libros, editoriales, géneros, autores, clientes), (b) renderizado dinámico del catálogo en la vista Catálogo usando la plantilla `#plantilla-libro`, (c) filtro por título insensible a mayúsculas/minúsculas y espacios sobrantes, (d) mensajes de estado "lista vacía" y "búsqueda sin resultados" gestionados por JS.

**Objetivo.** Escribir `js/app.js` completo que, al abrir `index.html` en el navegador (`file://`):
- Cargue los datos ficticios en memoria (≥6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes).
- Renderice el catálogo completo al inicio poblando `#catalogo-listado` con tarjetas `.libro` clonadas desde `#plantilla-libro`.
- Escuche `input` en `#buscador-titulo` y filtre en tiempo real: normalice la consulta (trim + lowercase) y compare contra los títulos normalizados.
- Búsqueda vacía → muestre todo el catálogo (R-03).
- Búsqueda sin coincidencias → oculte `#catalogo-listado`, muestre `#catalogo-sin-resultados` con el texto original del HTML (R-04).
- Con coincidencias → oculte `#catalogo-sin-resultados`, muestre `#catalogo-listado` con las tarjetas filtradas.
- Catálogo sin libros en datos → muestre `#catalogo-vacio`, oculte `#catalogo-listado` y `#catalogo-sin-resultados`.

**Resultado esperado.** Un `js/app.js` funcional, sin dependencias externas, que pase las comprobaciones manuales reproducibles de la Fase 3. El HTML y CSS **no se modifican**.

---

## 2. Contexto verificado y referencias

### 2.1 Fuentes consultadas

| Fuente | Cómo se consultó | Uso |
|---|---|---|
| `Consigna Primer Parcial.pdf` | Extracción de texto con `pypdf` (previa, Ejercicios 1–2) | Requisitos del Ejercicio 3 y criterios de evaluación. |
| `index.html` (10.358 bytes, 264 líneas) | Lectura directa completa | Estructura de la vista Catálogo, ids, plantillas, clases CSS ya existentes. |
| `css/styles.css` (623 líneas) | Lectura directa completa | Clases de presentación ya definidas para `.libro`, `.listado--catalogo`, `.mensaje`, `.mensaje[hidden]`. |
| `js/app.js` (3 líneas) | Lectura directa | Estado inicial: placeholder sin lógica. |
| `docs/ejercicio1-spec.md`, `docs/ejercicio2-spec.md` | Lectura directa | Convenciones de ids, clases, plantillas, decisiones aprobadas (SPA, nombre "Librería El Estante", plantillas incluidas, placeholders creados). |

No se consultaron fuentes externas. No se inventaron archivos, datos ni resultados.

### 2.2 Hechos verificados (estado del proyecto)

- El directorio contiene: `index.html`, `css/styles.css`, `js/app.js`, `docs/`, `openspec/`.
- **HTML (Ejercicio 1 aprobado):** Vista Catálogo con:
  - `#form-busqueda` → `#buscador-titulo` (type="search", name="titulo")
  - `#catalogo-listado.listado.listado--catalogo` (contenedor grid, inicialmente vacío)
  - `#catalogo-vacio.mensaje.mensaje--vacio` (visible inicial: "No hay libros en el catálogo.")
  - `#catalogo-sin-resultados.mensaje.mensaje--vacio[hidden]` ("No se encontraron libros que coincidan con la búsqueda.")
  - `<template id="plantilla-libro">` con `<article class="libro">` → `<h3 class="libro__titulo">` + `<dl class="libro__datos">` con 5 pares `dt`/`dd` (`.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio`).
- **CSS (Ejercicio 2 aprobado):** Estilos listos para `.listado--catalogo` (grid fluido), `.libro` (tarjeta con sombra), `.libro__datos` (grid dt/dd), `.mensaje[hidden] { display: none }`.
- **JS:** Placeholder de 3 líneas. Sin datos, sin render, sin listeners.

### 2.3 Hechos extraídos de la consigna (Ejercicio 3, página 3)

Texto verificado en la extracción del PDF:

> "El catálogo se genera dinámicamente a partir de un array de libros. Se incluye un buscador por título que filtra la lista en tiempo real. La búsqueda ignora mayúsculas/minúsculas y espacios sobrantes. Si no hay coincidencias, se muestra un mensaje claro. Si la búsqueda está vacía, se muestra todo el catálogo."

> "Datos iniciales: mínimo 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes. Los datos son ficticios y se definen en el propio JavaScript."

> "El JavaScript se escribe en `js/app.js` (ya enlazado con `defer`). No se usan librerías, frameworks, CDNs, APIs, base de datos, servidor ni login real."

Puntaje: **Ejercicio 3 · 20 puntos** → *Catálogo y filtro: 15; Calidad de código: 5*.

---

## 3. Alcance

### 3.1 Incluido

- Definición de **datos ficticios en memoria** (arrays/objetos en `js/app.js`):
  - `editoriales` (≥2): id, nombre
  - `generos` (≥2): id, nombre
  - `autores` (≥3): id, nombre
  - `libros` (≥6): id, titulo, isbn, precio, editorialId, generoId, autoresIds[]
  - `clientes` (≥3): id, nombre, email
- **Renderizado del catálogo** al cargar la página:
  - Clonar `#plantilla-libro.content` por cada libro.
  - Poblar `.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio` con datos resueltos (lookups por id → nombre).
  - Adjuntar al `#catalogo-listado`.
  - Gestionar visibilidad de `#catalogo-vacio`, `#catalogo-listado`, `#catalogo-sin-resultados` según corresponda.
- **Filtro por título en tiempo real**:
  - Listener `input` en `#buscador-titulo`.
  - Normalización: `query.trim().toLowerCase()` y `libro.titulo.toLowerCase()`.
  - Coincidencia: `includes` (búsqueda parcial).
  - Re-render del listado filtrado (vaciar contenedor + volver a poblar).
  - Búsqueda vacía (`""` tras trim) → catálogo completo.
  - Sin coincidencias → mostrar `#catalogo-sin-resultados`, ocultar `#catalogo-listado` y `#catalogo-vacio`.
- **Funciones de responsabilidad reconocible** (R-07):
  - `normalizarTexto(str)` → trim + lowercase.
  - `obtenerNombre(array, id)` / lookups específicos.
  - `renderizarCatalogo(librosFiltrados)` → DOM mutations.
  - `filtrarPorTitulo(consulta)` → lógica de filtro + llamada a render.
  - `inicializar()` → carga datos, listener, render inicial.

### 3.2 Excluido

- **Cualquier modificación de `index.html` o `css/styles.css`**. La estructura y presentación ya están aprobadas y cerradas.
- Altas, bajas, modificaciones de editoriales, géneros, autores (Ejercicio 4).
- Validaciones de formularios de alta (Ejercicio 4).
- Población de `<select>` de editorial, género, autores (Ejercicio 4).
- Ventas: renglones, subtotales, total, confirmación, historial (Ejercicios 5–6).
- `localStorage` / persistencia (Ejercicio 6).
- Cualquier dependencia externa, fetch, CDN, framework, build, TypeScript.
- Datos reales o conexión a backend.

---

## 4. Requisitos y escenarios observables

| ID | Grupo | Requisito verificable | Escenario observable (verificación manual) | Casos límite relevantes |
|---|---|---|---|---|
| R-01 | Funcional | El catálogo se genera dinámicamente desde el array de libros. | Al abrir `index.html` y navegar a `#catalogo`, `#catalogo-listado` contiene 6+ `<article class="libro">` con datos correctos (título, ISBN, editorial, género, autores, precio). | Array vacío → `#catalogo-vacio` visible, listado oculto. |
| R-02 | Funcional | El filtro por título ignora mayúsculas/minúsculas, espacios sobrantes y acentos/diacríticos. | Escribir "  el  " en `#buscador-titulo` → encuentra "El Principito" y "El Hobbit". Escribir "principito" (sin acento) → encuentra "El Principito". Escribir "1984" → encuentra "1984". | Consulta con solo espacios → tratado como vacía (R-03). |
| R-03 | Funcional | Una búsqueda vacía muestra todo el catálogo. | Borrar el contenido de `#buscador-titulo` (o dejarlo vacío al cargar) → se renderizan los 6+ libros. | Input con solo espacios → `trim()` → "" → catálogo completo. |
| R-04 | Funcional | Una búsqueda sin coincidencias muestra un mensaje claro. | Escribir "xyz123" → `#catalogo-sin-resultados` visible (sin `hidden`), `#catalogo-listado` vacío, `#catalogo-vacio` oculto. | El texto del mensaje es el ya definido en HTML: "No se encontraron libros que coincidan con la búsqueda." |
| R-05 | Datos y estados | Conjunto inicial: ≥6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes. | `console.log({editoriales, generos, autores, libros, clientes})` en DevTools muestra arrays con las cantidades mínimas y estructura correcta (id + campos). | ISBN como string (puede tener guiones). Precio como number (formateo en render: "$X,YY"). Autores: array de ids → join de nombres con ", ". Género: si id no encontrado → "Sin clasificar" (consistente con HTML). |
| R-06 | Estructura | Los datos se insertan como texto en el DOM, sin traer datos externos. | Network tab: 0 requests tras carga inicial. No `fetch`, `XMLHttpRequest`, `import`, `module`. | — |
| R-07 | Calidad | El sistema responde a eventos con funciones de responsabilidad reconocible. | Código legible: `normalizarTexto`, `renderizarCatalogo`, `filtrarPorTitulo`, `inicializar` separadas. Sin funciones >50 líneas. Sin lógica en el scope global salvo `inicializar()` y exports mínimos. | — |
| R-08 | Compatibilidad | Funciona en navegadores modernos sin dependencias externas. | Probado en Edge/Chrome/Firefox recientes: sin errores de consola, filtro responde <100ms. | — |
| R-09 | Convenciones | Uso de HTML semántico y CSS propio, sin frameworks ni CDNs. | Ya verificado en Ejercicios 1–2. JS usa `const`/`let`, arrow functions, template literals, `classList`, `cloneNode(true)`, `querySelector`. | — |

---

## 5. Estructura propuesta, interfaces y datos

### 5.1 Datos en memoria (definidos en `js/app.js`)

```javascript
// Datos ficticios — estructura normalizada por ids
const editoriales = [
  { id: 1, nombre: "Editorial Planeta" },
  { id: 2, nombre: "Penguin Random House" }
];

const generos = [
  { id: 1, nombre: "Ficción" },
  { id: 2, nombre: "No Ficción" }
];

const autores = [
  { id: 1, nombre: "Antoine de Saint-Exupéry" },
  { id: 2, nombre: "J.R.R. Tolkien" },
  { id: 3, nombre: "George Orwell" }
];

const libros = [
  { id: 1, titulo: "El Principito", isbn: "978-950-731-456-7", precio: 12990, editorialId: 1, generoId: 1, autoresIds: [1] },
  { id: 2, titulo: "El Hobbit", isbn: "978-84-450-7342-1", precio: 18500, editorialId: 2, generoId: 1, autoresIds: [2] },
  { id: 3, titulo: "1984", isbn: "978-84-9759-327-5", precio: 14500, editorialId: 1, generoId: 1, autoresIds: [3] },
  { id: 4, titulo: "Rebelión en la granja", isbn: "978-84-450-0123-4", precio: 11200, editorialId: 2, generoId: 1, autoresIds: [3] },
  { id: 5, titulo: "El Silmarillion", isbn: "978-84-450-7128-1", precio: 22000, editorialId: 1, generoId: 1, autoresIds: [2] },
  { id: 6, titulo: "Carta a un niño que nunca nació", isbn: "978-950-731-123-4", precio: 9800, editorialId: 2, generoId: 2, autoresIds: [1] }
];

const clientes = [
  { id: 1, nombre: "Juan Pérez", email: "juan@email.com" },
  { id: 2, nombre: "María González", email: "maria@email.com" },
  { id: 3, nombre: "Carlos López", email: "carlos@email.com" }
];
```

> **Nota:** Los datos son **hardcodeados en el JS** (no en JSON externo, no en localStorage). Cumplen mínimos: 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes.

### 5.2 Funciones (responsabilidad única)

| Función | Firma | Responsabilidad |
|---|---|---|
| `normalizarTexto` | `(texto: string) => string` | `return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();` |
| `buscarNombre` | `(coleccion: Array<{id,nombre}>, id: number) => string` | Lookup genérico: `coleccion.find(x => x.id === id)?.nombre ?? ""` |
| `obtenerEditorial` | `(id: number) => string` | `buscarNombre(editoriales, id)` |
| `obtenerGenero` | `(id: number) => string` | `buscarNombre(generos, id) ?? "Sin clasificar"` |
| `obtenerAutores` | `(ids: number[]) => string` | `ids.map(id => buscarNombre(autores, id)).filter(Boolean).join(", ") \|\| "Sin autor"` |
| `formatearPrecio` | `(num: number) => string` | `"$" + num.toLocaleString("es-AR", {minimumFractionDigits: 2})` |
| `crearTarjetaLibro` | `(libro: Object) => DocumentFragment` | Clona `#plantilla-libro`, puebla los 6 campos, retorna fragment. |
| `renderizarCatalogo` | `(librosAMostrar: Object[]) => void` | Vacía `#catalogo-listado`, itera `librosAMostrar` → `appendChild(crearTarjetaLibro(l))`. Gestiona visibilidad de los 3 estados (`#catalogo-vacio`, `#catalogo-listado`, `#catalogo-sin-resultados`). |
| `filtrarPorTitulo` | `(consulta: string) => void` | `const q = normalizarTexto(consulta); const filtrados = q === "" ? libros : libros.filter(l => normalizarTexto(l.titulo).includes(q)); renderizarCatalogo(filtrados);` |
| `inicializar` | `() => void` | `document.addEventListener("DOMContentLoaded", () => { listener en #buscador-titulo (input) → filtrarPorTitulo; renderizarCatalogo(libros); });` |

### 5.3 Interfaz con el HTML existente (solo lectura)

| Elemento HTML | Uso en JS |
|---|---|
| `#buscador-titulo` | `addEventListener("input", e => filtrarPorTitulo(e.target.value))` |
| `#catalogo-listado` | `innerHTML = ""` + `appendChild(fragment)` por cada libro |
| `#catalogo-vacio` | `hidden = true/false` según `libros.length === 0` (solo en render inicial) |
| `#catalogo-sin-resultados` | `hidden = true/false` según `filtrados.length === 0 && consulta !== ""` |
| `#plantilla-libro` | `document.getElementById("plantilla-libro").content.cloneNode(true)` |

### 5.4 Estados de la vista Catálogo (gestión por JS)

| Estado | Condición | `#catalogo-vacio` | `#catalogo-listado` | `#catalogo-sin-resultados` |
|---|---|---|---|---|
| Carga inicial (con libros) | `libros.length > 0` | `hidden` | visible | `hidden` |
| Carga inicial (sin libros) | `libros.length === 0` | visible | `hidden` | `hidden` |
| Búsqueda vacía | `consulta.trim() === ""` | `hidden` | visible (todos) | `hidden` |
| Búsqueda con resultados | `filtrados.length > 0` | `hidden` | visible (filtrados) | `hidden` |
| Búsqueda sin resultados | `filtrados.length === 0 && consulta.trim() !== ""` | `hidden` | `hidden` | visible |

---

## 6. Estados y manejo de errores

| Situación | Manejo en JS |
|---|---|
| Dato faltante en lookup (ej. `editorialId` inexistente) | `buscarNombre` retorna `""`; `obtenerGenero` retorna `"Sin clasificar"` por defecto. |
| `autoresIds` vacío o ids inexistentes | `obtenerAutores` retorna `"Sin autor"`. |
| `precio` no numérico | `formatearPrecio` usa `Number(num) \|\| 0`. |
| Excepción en listener/render | `try/catch` en `inicializar` y `filtrarPorTitulo` → `console.error` + mensaje genérico en consola (no rompe la UI). |
| Plantilla no encontrada | `console.error("Plantilla #plantilla-libro no encontrada")`; no renderiza. |

---

## 7. Restricciones técnicas y convenciones

1. **Solo `js/app.js`** se modifica. `index.html` y `css/styles.css` son **inmutables** en este ejercicio.
2. **JavaScript nativo ES6+**: `const`/`let`, arrow functions, template literals, `classList`, `querySelector`, `cloneNode(true)`, `DocumentFragment`, `includes`, `map`, `filter`, `find`, `join`, `toLocaleString`.
3. **Sin módulos ES** (`import`/`export`): script cargado con `defer`, todo en scope global o IIFE. `inicializar()` se auto-ejecuta al `DOMContentLoaded`.
4. **Sin `innerHTML` con strings concatenados** para evitar XSS: usar `textContent` en los nodos clónicos.
5. **Sin `style=` inline**: visibilidad solo mediante `element.hidden = true/false` (el CSS ya tiene `.mensaje[hidden] { display: none }`).
6. **Nomenclatura en español**, descriptiva, coherente con ids del HTML (`buscador-titulo`, `catalogo-listado`, etc.).
7. **Performance**: listener `input` sin debounce (dataset ≤6 libros, filtro trivial). Re-render completo en cada keystroke es aceptable.
8. **Accesibilidad**: el `input` ya tiene `type="search"` y label asociado; el `role="status"`/`role="alert"` en mensajes ya está en HTML; JS solo alterna `hidden`.

---

## 8. Criterios de aceptación vinculados a requisitos

| CA | Requisito | Verificación manual (pasos) |
|---|---|---|
| **CA-01** | R-01 | 1. Abrir `index.html`. 2. Ir a `#catalogo`. 3. Verificar 6+ tarjetas `.libro` con datos correctos. 4. Consola: `libros.length >= 6`. |
| **CA-02** | R-02 | 1. Escribir "  EL  " en buscador. 2. Verificar que aparecen "El Principito" y "El Hobbit". 3. Escribir "principito" (minúscula, sin acento) → aparece "El Principito". 4. Escribir "hobbit" (minúscula) → aparece "El Hobbit". 5. Escribir "PRINCIPI" (parcial) → aparece "El Principito". |
| **CA-03** | R-03 | 1. Vaciar buscador (Backspace hasta limpio). 2. Verificar que vuelven a verse los 6+ libros. |
| **CA-04** | R-04 | 1. Escribir "xyz123". 2. Verificar `#catalogo-sin-resultados` visible con su texto original. 3. Verificar `#catalogo-listado` vacío (sin tarjetas). 4. Verificar `#catalogo-vacio` oculto. |
| **CA-05** | R-05 | 1. Consola: `console.log({editoriales, generos, autores, libros, clientes})`. 2. Verificar conteos: ed≥2, gen≥2, aut≥3, lib≥6, cli≥3. 3. Verificar estructura: cada libro tiene `titulo`, `isbn`, `precio`, `editorialId`, `generoId`, `autoresIds[]`. |
| **CA-06** | R-09 | 1. Network tab: 0 requests tras carga. 2. No `import`, `fetch`, CDN. 3. Código usa solo APIs nativas. |

---

## 9. Supuestos, información pendiente y decisiones que requieren tu respuesta

### Decisiones resueltas (basadas en Ejercicios 1–2 aprobados)

- **Arquitectura**: SPA con secciones (Opción A,決まっています). El `js/app.js` único gestiona todas las vistas.
- **Nombre de la librería**: "Librería El Estante" (ya en `<h1>`).
- **Plantillas**: `#plantilla-libro` y `#plantilla-renglon` ya existen en HTML.
- **Placeholders CSS/JS**: Ya creados en Ejercicios 1–2.

### Supuestos declarados

- **S1**: La consigna se leyó mediante extracción de texto del PDF; el contenido coincide con el resumen, pero el diseño de página del PDF no fue inspeccionado visualmente.
- **S2**: ~~El matching de filtro es **simple** (`includes` tras `toLowerCase()`), **sin normalización de acentos** (p.ej. "principito" no encuentra "Príncipe"). Si se requiere normalización Unicode, es decisión pendiente (P1).~~ **Resuelto P1=B: se normalizan acentos.**
- **S3**: Los datos son **hardcodeados en el JS** (no en archivo JSON, no en localStorage). El Ejercicio 6 hará persistencia.
- **S4**: El formateo de precio usa `toLocaleString("es-AR")` → "$12.990,00" (con separador de miles). ~~Si el TP exige otro formato (p.ej. "$12.990"), es decisión pendiente (P2).~~ **Resuelto P2=A.**
- **S5**: El `autoresIds` es array; en la tarjeta se muestra `join(", ")`. Si un libro tiene 0 autores → "Sin autor".
- **S6**: ~~El render inicial se ejecuta siempre al `DOMContentLoaded`. Si se requiere activación por vista, es decisión pendiente (P3).~~ **Resuelto P3=A: siempre al cargar.**

### Decisiones resueltas (respuesta del usuario, 2026-10-20)

| Clave | Decisión | Detalle |
|---|---|---|
| **P1** | **B — Sí, normalizar acentos** | `normalizarTexto` aplicará `normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()` tanto a la consulta como al título del libro. |
| **P2** | **A — `toLocaleString("es-AR")`** | Formato: "$12.990,00" (con separador de miles y 2 decimales). |
| **P3** | **A — Siempre al `DOMContentLoaded`** | `inicializar()` se ejecuta una vez al cargar la página; el catálogo se renderiza aunque la vista no esté visible (los datos ya están en memoria). |

---

**Fin de la Fase 1 (SPEC). No se escribió ni modificó `js/app.js`: solo se creó este documento en `openspec/changes/frontend-libreria/spec.md`. Se espera tu revisión, aprobación explícita y respuestas a P1–P3 antes de avanzar a la Fase 2 (PLAN).**