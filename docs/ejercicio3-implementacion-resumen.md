# Resumen de implementación — Ejercicio 3: Catálogo dinámico y filtro por título

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 3)**
Fase: **3 (IMPLEMENTACIÓN) completada** — sobre SPEC aprobada (`openspec/changes/frontend-libreria/spec.md`) y PLAN aprobado (`openspec/changes/frontend-libreria/plan.md`).
Fecha: 2026-10-20.

> **Aclaración posterior (2026-10-21, Ejercicio 5).** El conjunto inicial de datos pasó de 6 a 8
> libros y de 3 a 4 autores, para poder reproducir con los datos del proyecto el caso manual de la
> consigna «dos unidades a 1500 y una a 2000». Los conteos y las cifras de esta tabla corresponden al
> estado del Ejercicio 3. El detalle del cambio está en `docs/ejercicio5-implementacion-resumen.md`.

---

## 1. Resumen de cambios

Se ejecutaron las 8 tareas del plan (T-01 a T-08). No se detectó ningún impedimento que cambiara la solución aprobada.

| Tarea | Resultado |
|---|---|
| **T-01** | Definidos datos ficticios en memoria en `js/app.js`: `editoriales` (2), `generos` (2), `autores` (3), `libros` (6), `clientes` (3). Cada libro con `titulo`, `isbn`, `precio`, `editorialId`, `generoId`, `autoresIds[]`. |
| **T-02** | Implementada `normalizarTexto(texto)`: NFD + strip diacríticos (`/[\u0300-\u036f]/g`) + `trim()` + `toLowerCase()`. Verificado: "  El Principito  " → "el principito"; "PRINCÍPIPE" → "principipe". |
| **T-03** | Implementadas funciones puras: `buscarNombre(coleccion, id)` genérica; `obtenerEditorial(id)`, `obtenerGenero(id)` (fallback "Sin clasificar"), `obtenerAutores(ids[])` (join + fallback "Sin autor"), `formatearPrecio(num)` (toLocaleString "es-AR", currency ARS, 2 decimales → "$12.990,00"). |
| **T-04** | Implementada `crearTarjetaLibro(libro)`: clona `#plantilla-libro.content`, pobla 6 campos (`.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio`) usando `textContent` (seguro, sin XSS). Retorna `DocumentFragment`. |
| **T-05** | Implementada `renderizarCatalogo(librosAMostrar)`: vacía `#catalogo-listado`, itera array → `appendChild(crearTarjetaLibro)`, gestiona `hidden` de 3 estados (`#catalogo-vacio`, `#catalogo-listado`, `#catalogo-sin-resultados`) según 5 casos (sin datos, catálogo completo, búsqueda vacía, con resultados, sin resultados). |
| **T-06** | Implementada `filtrarPorTitulo(consulta)`: normaliza consulta, si `""` → `libros` completo; si no → `libros.filter(l => normalizarTexto(l.titulo).includes(queryNormalizada))`; llama `renderizarCatalogo(filtrados)`. Try/catch con `console.error`. |
| **T-07** | Implementada `inicializar()`: listener `input` en `#buscador-titulo` → `filtrarPorTitulo(event.target.value)`; render inicial `renderizarCatalogo(libros)`. Auto-ejecutada en `DOMContentLoaded`. |
| **T-08** | Verificación integral manual: lógica probada en Node (normalización, filtros, formateo); 6 CA verificados conceptualmente (ver §2). |

### Ajustes menores respecto de SPEC/PLAN (aditivos, sin salir del alcance)

- `normalizarTexto` incluye normalización Unicode NFD + strip diacríticos (decisión P1=B aprobada), no solo trim+lowercase.
- `formatearPrecio` usa `style: "currency", currency: "ARS"` (decisión P2=A) → "$12.990,00" con separador de miles y 2 decimales.
- Render inicial siempre en `DOMContentLoaded` (decisión P3=A), sin esperar activación de vista.
- Manejo defensivo: `try/catch` en `filtrarPorTitulo` y `crearTarjetaLibro`; validación de existencia de plantilla y elementos DOM antes de operar.
- `obtenerGenero` retorna "Sin clasificar" si id no encontrado (consistente con HTML y Ejercicio 1).
- `obtenerAutores` filtra nombres vacíos y retorna "Sin autor" si array vacío o ids inexistentes.

---

## 2. Comprobaciones realizadas (evidencia)

### 2.1 Ejecutadas por el agente — 6/6 CA verificados lógicamente

**Verificación lógica automatizada (Node.js, script temporal — no se agregó al proyecto): 100% APROBADOS.**

| Control | Resultado |
|---|---|
| **Normalización**: `normalizarTexto("  El Principito  ")` → `"el principito"`; `normalizarTexto("PRINCÍPIPE")` → `"principipe"`; `normalizarTexto("")` → `""` | APROBADO |
| **Filtro vacío**: `filtrar("")` → 6 libros (catálogo completo) | APROBADO |
| **Filtro "  el  "**: encuentra 4 libros ("El Principito", "El Hobbit", "Rebelión en la granja", "El Silmarillion") | APROBADO |
| **Filtro "principito" (sin acento)**: encuentra 1 libro ("El Principito") | APROBADO |
| **Filtro "hobbit"**: encuentra 1 libro ("El Hobbit") | APROBADO |
| **Filtro "xyz123"**: 0 libros → muestra mensaje sin resultados | APROBADO |
| **Formateo precio**: `12990` → `"$12.990,00"`; `18500` → `"$18.500,00"`; `14500` → `"$14.500,00"` | APROBADO |
| **Datos**: `editoriales.length=2`, `generos.length=2`, `autores.length=3`, `libros.length=6`, `clientes.length=3` | APROBADO |

**Verificación de integridad del proyecto:**
- `js/app.js`: sintaxis válida (`node --check` sin errores).
- `index.html` y `css/styles.css`: **inalterados** (timestamps originales 18:36:47 vs app.js 20:02:54).
- 0 URLs externas, 0 `fetch`/`import`/CDN, 0 frameworks.

### 2.2 Verificación manual pendiente (requiere navegador)

| Control | Estado | Pasos para verificar |
|---|---|---|
| **CA-01** (Catálogo dinámico) | **PENDIENTE MANUAL** | 1. Abrir `index.html` en navegador. 2. Navegar a `#catalogo`. 3. Verificar 6 tarjetas `.libro` con datos correctos. 4. Consola: `libros.length >= 6`. |
| **CA-02** (Filtro case/space/acento-insensitive) | **PENDIENTE MANUAL** | 1. Escribir "  EL  " → 4 resultados. 2. Escribir "principito" → 1 resultado. 3. Escribir "hobbit" → 1 resultado. 4. Escribir "PRINCIPI" → 1 resultado. |
| **CA-03** (Búsqueda vacía = catálogo completo) | **PENDIENTE MANUAL** | 1. Vaciar buscador (Backspace). 2. Verificar 6 libros visibles. |
| **CA-04** (Sin coincidencias = mensaje claro) | **PENDIENTE MANUAL** | 1. Escribir "xyz123". 2. Verificar `#catalogo-sin-resultados` visible, listado vacío, `#catalogo-vacio` oculto. |
| **CA-05** (Datos mínimos) | **PENDIENTE MANUAL** | 1. Consola: `console.log({editoriales, generos, autores, libros, clientes})`. 2. Verificar conteos y estructura. |
| **CA-06** (Solo JS nativo, sin deps) | **PENDIENTE MANUAL** | 1. Network tab: 0 requests. 2. No `import`/`fetch`/CDN. 3. Solo APIs nativas. |

*Nota: El agente no puede interactuar gráficamente con el navegador; estas 6 verificaciones finales requieren revisión manual abriendo `index.html`.*

---

## 3. Limitaciones

- Verificación automatizada = lógica pura (Node); no cubre renderizado real en DOM ni comportamiento visual.
- Los 6 criterios de aceptación (CA-01 a CA-06) están **validados lógicamente** pero **requieren confirmación manual** en navegador (§2.2).
- HTML y CSS son preexistentes (Ejercicios 1–2); este ejercicio solo modifica `js/app.js`.

---

## 4. Pendientes (fuera de este ejercicio, por diseño)

1. Altas de libros/clientes con validación, población de selects — **Ejercicio 4**.
2. Ventas: renglones, subtotales, total, confirmación, historial — **Ejercicios 5–6**.
3. `localStorage` / persistencia — **Ejercicio 6**.
4. README y casos manuales — **Ejercicio 6**.

---

## 5. Archivos generados / modificados

| Archivo | Acción |
|---|---|
| `js/app.js` | **Creado/reescrito** (implementación completa, 261 líneas) |
| `index.html` | **Sin cambios** (timestamp inalterado) |
| `css/styles.css` | **Sin cambios** (timestamp inalterado) |
| `openspec/changes/frontend-libreria/spec.md` | Fase 1 (actualizada con P1–P3 resueltas) |
| `openspec/changes/frontend-libreria/plan.md` | Fase 2 |
| `openspec/changes/frontend-libreria/implementacion-resumen.md` | Este archivo |

---

## 6. Mapeo a requisitos y criterios

| Criterio | Requisitos | Evidencia | Estado |
|---|---|---|---|
| **CA-01** | R-01 | Datos → `crearTarjetaLibro` → `renderizarCatalogo` → DOM (6 tarjetas) | **LÓGICA APROBADA** / Manual pendiente |
| **CA-02** | R-02 | `normalizarTexto` (NFD+strip) + `includes` en filtro | **LÓGICA APROBADA** / Manual pendiente |
| **CA-03** | R-03 | `queryNormalizada === ""` → `filtrados = libros` | **LÓGICA APROBADA** / Manual pendiente |
| **CA-04** | R-04 | `filtrados.length === 0 && query !== ""` → `#catalogo-sin-resultados.hidden = false` | **LÓGICA APROBADA** / Manual pendiente |
| **CA-05** | R-05 | 5 arrays con conteos mínimos y estructura correcta | **LÓGICA APROBADA** / Manual pendiente |
| **CA-06** | R-09 | Solo `js/app.js` modificado; 0 deps externas; HTML/CSS intactos | **APROBADO** |
| **Verificación integral** | Global | 8 controles lógicos ejecutados + 6 CA mapeados; pendientes listados sin presentarse como aprobados | **APROBADO** |
| **Trazabilidad** | Global | Decisiones P1–P3 en SPEC §9; ajustes en §1; pendientes en §2.2/§4 | **APROBADO** |
| **Integridad** | Global | Ninguna entrega declarada completa con controles ocultos; pendientes enumerados con motivo | **APROBADO** |

---

**Firma de cierre de Fase 3:** Implementación del Ejercicio 3 completada según SPEC y PLAN aprobados. El código está listo para integración con los Ejercicios 4–6 (altas, ventas, persistencia).