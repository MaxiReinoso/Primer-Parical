# Plan de Implementación — Ejercicio 3: Catálogo dinámico y filtro por título

Proyecto: **Primer Parcial — Programación III (Ejercicio 3)**
Estado: **Fase 2 (PLAN) — listo para implementar tras aprobación de SPEC**
Fecha: 2026-10-20.

---

## Resumen de decisiones aprobadas (desde SPEC)

| Clave | Decisión |
|---|---|
| **P1** | **B** — Normalizar acentos: `normalize("NFD").replace(/[\u0300-\u036f]/g, "")` |
| **P2** | **A** — Precio: `toLocaleString("es-AR", {minimumFractionDigits: 2})` → "$12.990,00" |
| **P3** | **A** — Render inicial siempre en `DOMContentLoaded` |

---

## Checklist de tareas atómicas

| ID | Tarea | Resultado esperado | Requisito / CA | Archivos | Dependencias | Comprobación (Definition of Done) |
|---|---|---|---|---|---|---|
| **T-01** | **Definir datos ficticios en memoria** | Arrays/objetos `editoriales`, `generos`, `autores`, `libros`, `clientes` con estructura y cantidades mínimas | R-05, CA-05 | `js/app.js` | — | `console.log({editoriales, generos, autores, libros, clientes})` muestra: ed≥2, gen≥2, aut≥3, lib≥6, cli≥3; cada libro tiene `titulo`, `isbn`, `precio`, `editorialId`, `generoId`, `autoresIds[]` |
| **T-02** | **Implementar `normalizarTexto(texto)`** | Función que retorna string sin acentos, trim, lowercase | R-02, CA-02 | `js/app.js` | T-01 | `normalizarTexto("  El Principito  ")` → `"el principito"`; `normalizarTexto("PRINCÍPIPE")` → `"principipe"` |
| **T-03** | **Implementar lookups genéricos y específicos** | `buscarNombre(coleccion, id)`, `obtenerEditorial(id)`, `obtenerGenero(id)`, `obtenerAutores(ids[])`, `formatearPrecio(num)` | R-01, R-05, CA-01, CA-05 | `js/app.js` | T-01 | `obtenerEditorial(1)` → "Editorial Planeta"; `obtenerGenero(999)` → "Sin clasificar"; `obtenerAutores([1,2])` → "Antoine de Saint-Exupéry, J.R.R. Tolkien"; `formatearPrecio(12990)` → "$12.990,00" |
| **T-04** | **Implementar `crearTarjetaLibro(libro)`** | Retorna `DocumentFragment` clonado de `#plantilla-libro` con 6 campos poblados via `textContent` | R-01, R-06, CA-01, CA-06 | `js/app.js` | T-01, T-03 | Fragment contiene `.libro__titulo` = título, `.libro__isbn` = ISBN, `.libro__editorial` = nombre editorial, `.libro__genero` = nombre género, `.libro__autores` = autores join, `.libro__precio` = precio formateado |
| **T-05** | **Implementar `renderizarCatalogo(librosAMostrar)`** | Vacia `#catalogo-listado`, itera array → `appendChild(crearTarjetaLibro)`; gestiona `hidden` de 3 estados | R-01, R-03, R-04, CA-01, CA-03, CA-04 | `js/app.js` | T-04 | - Con 6 libros: `#catalogo-listado` tiene 6 hijos `.libro`, `#catalogo-vacio[hidden]`, `#catalogo-sin-resultados[hidden]`<br>- Con `[]`: `#catalogo-vacio` visible, listado y sin-resultados ocultos<br>- Con array filtrado: listado visible con N hijos, otros dos ocultos |
| **T-06** | **Implementar `filtrarPorTitulo(consulta)`** | Normaliza consulta, filtra `libros` con `includes`, llama `renderizarCatalogo` | R-02, R-03, R-04, CA-02, CA-03, CA-04 | `js/app.js` | T-02, T-05 | - `filtrarPorTitulo("")` → renderiza 6 libros<br>- `filtrarPorTitulo("  el  ")` → 2 libros ("El Principito", "El Hobbit")<br>- `filtrarPorTitulo("principito")` (sin acento) → 1 libro<br>- `filtrarPorTitulo("xyz")` → muestra `#catalogo-sin-resultados` |
| **T-07** | **Implementar `inicializar()` + listener `DOMContentLoaded`** | Listener en `#buscador-titulo` (`input` → `filtrarPorTitulo`), render inicial `renderizarCatalogo(libros)` | R-01, R-07, CA-01, CA-06 | `js/app.js` | T-05, T-06 | Al abrir `index.html`: catálogo renderizado; escribir en buscador filtra en tiempo real sin errores de consola |
| **T-08** | **Verificación integral manual (humano)** | Ejecutar todos los CA-01 a CA-06 en navegador, registrar evidencia | Todos | `index.html` + `js/app.js` | T-01 a T-07 | Tabla de evidencia completada (ver §3) |

---

## Orden de ejecución y dependencias

```
T-01 (datos)
  ├─ T-02 (normalizarTexto)
  ├─ T-03 (lookups + formatearPrecio)
  │    └─ T-04 (crearTarjetaLibro)
  │         └─ T-05 (renderizarCatalogo)
  │              ├─ T-06 (filtrarPorTitulo)
  │              └─ T-07 (inicializar + listener)
  └─ T-08 (verificación manual)
```

- **T-01 a T-03** son independientes entre sí y pueden hacerse en paralelo (son definiciones de datos y funciones puras).
- **T-04** depende de T-01 y T-03.
- **T-05** depende de T-04.
- **T-06** depende de T-02 y T-05.
- **T-07** depende de T-05 y T-06.
- **T-08** depende de T-07 (código completo).

---

## Entregables

| Archivo | Qué contiene |
|---|---|
| `js/app.js` | Código completo: datos + 8 funciones + `inicializar()` auto-ejecutable. Sin modificaciones a `index.html` ni `css/styles.css`. |

---

## Verificación integral (T-08) — Tabla de evidencia

| CA | Pasos de verificación | Estado | Evidencia / Notas |
|---|---|---|---|
| **CA-01** | 1. Abrir `index.html`<br>2. Ir a `#catalogo`<br>3. Contar tarjetas `.libro`<br>4. Consola: `libros.length` | ☐ Pendiente |  |
| **CA-02** | 1. Escribir "  EL  " → 2 libros<br>2. Escribir "principito" → 1 libro<br>3. Escribir "hobbit" → 1 libro<br>4. Escribir "PRINCIPI" → 1 libro | ☐ Pendiente |  |
| **CA-03** | 1. Vaciar buscador → 6 libros | ☐ Pendiente |  |
| **CA-04** | 1. Escribir "xyz123" → `#catalogo-sin-resultados` visible, listado vacío, `#catalogo-vacio` oculto | ☐ Pendiente |  |
| **CA-05** | 1. Consola: `console.log({editoriales, generos, autores, libros, clientes})`<br>2. Verificar conteos y estructura | ☐ Pendiente |  |
| **CA-06** | 1. Network tab: 0 requests<br>2. No `import`/`fetch`/CDN<br>3. Solo APIs nativas | ☐ Pendiente |  |

---

## Criterios de salida de la Fase 3 (IMPLEMENTACIÓN)

- [ ] Todas las tareas T-01 a T-07 completadas y código en `js/app.js`.
- [ ] Tabla de evidencia T-08 con **6/6 CA aprobados**.
- [ ] Sin errores en consola del navegador.
- [ ] HTML y CSS **inalterados** (verificar `git diff index.html css/styles.css` → sin cambios).

---

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Lookup de editorial/género/autor falla (id inexistente) | Baja | Medio | `buscarNombre` retorna `""`; `obtenerGenero` tiene fallback "Sin clasificar"; `obtenerAutores` filtra vacíos y tiene fallback "Sin autor". |
| `normalizarTexto` no cubre todos los diacríticos | Baja | Bajo | Regex `[\u0300-\u036f]` cubre marcas de combinación Unicode (NFD). Probar con "café", "niño", "pingüino". |
| `toLocaleString("es-AR")` no disponible en entorno raro | Muy baja | Bajo | Fallback: `num.toFixed(2).replace(".", ",")` + separador de miles manual. |
| Plantilla `#plantilla-libro` no encontrada | Baja | Alto | `try/catch` en `crearTarjetaLibro` + `console.error`; no rompe la UI. |

---

## Notas de implementación (recordatorios para Fase 3)

1. **No usar `innerHTML` con strings**: usar `textContent` en nodos clónicos para evitar XSS.
2. **Visibilidad solo con `hidden`**: `element.hidden = true/false` (el CSS ya tiene `.mensaje[hidden] { display: none }`).
3. **Performance**: dataset ≤6 libros, re-render completo en cada `input` es aceptable (<1ms). No hace falta debounce.
4. **Scope**: todo en `js/app.js` con `defer`. `inicializar()` se auto-ejecuta al `DOMContentLoaded`.
5. **Nomenclatura**: español, coherente con ids del HTML (`buscador-titulo`, `catalogo-listado`, etc.).
6. **Accesibilidad**: ya resuelta en HTML (`role="status"/"alert"`, `aria-label`, `type="search"`). JS solo alterna `hidden`.

---

**Fin del PLAN. A la espera de autorización explícita para iniciar la Fase 3 (IMPLEMENTACIÓN).**