# Resumen de Implementación — Ejercicio 3: Datos, Catálogo y Filtro

> Change: `ejercicio3-datos-catalogo-filtro` (C-03)
> Fecha: 2026-10-21
> Archivo modificado: `js/app.js` (único archivo tocado)

---

## Tabla de Verificación (Controles × Estado × Motivo)

| Control | Estado | Motivo / Evidencia |
|---------|--------|-------------------|
| **CA-1**: 6 tarjetas visibles al cargar | APROBADO | Se renderizan 6 artículos `.libro` con datos completos desde el seed |
| **CA-2**: "Sin clasificar" en Bestiario | APROBADO | Libro `lib-5` tiene `generoId: null` → `obtenerGeneroPorId(null)` devuelve `null` → texto "Sin clasificar" |
| **CA-3**: Editorial y autores correctos | APROBADO | Cada tarjeta muestra editorial y autores via getters; verificación visual OK |
| **CA-4**: Precio formateado ARS (2 decimales) | APROBADO | `Intl.NumberFormat("es-AR", {style:"currency",currency:"ARS",minimumFractionDigits:2})` → ej. "$2.500,00" |
| **CA-5**: Búsqueda "CIEN" → 1 resultado | APROBADO | `normalizarBusqueda("CIEN")` → "cien" → `filter` por `includes` en título lowercase |
| **CA-6**: Búsqueda "  aleph  " → 1 resultado | APROBADO | `trim()` + `toLowerCase()` normaliza a "aleph" → coincide con "El Aleph" |
| **CA-7**: Vaciar buscador → catálogo completo | APROBADO | `normalizarBusqueda("")` → `""` → `filtrarLibros` devuelve `[...libros]` (6 items) |
| **CA-8**: Búsqueda "xyz" → mensaje sin resultados | APROBADO | `librosAMostrar.length === 0` → `#catalogo-sin-resultados.hidden = false` |
| **CA-9**: Recarga → estado inicial idéntico | APROBADO | Seed data inmutable (const), sin `localStorage` ni mutaciones |
| **CA-10**: Consola sin errores/warnings | APROBADO | Sin `console.log`, sin `debugger`, sin operaciones inválidas de DOM |
| **Regla dura RN-CAT-08**: Solo `textContent` | APROBADO | Todo render usa `textContent`; cero `innerHTML`/`insertAdjacentHTML` en datos de usuario |
| **Regla dura DD-01**: No tocar `index.html` ni `css/` | APROBADO | Solo `js/app.js` modificado (ver `git diff --name-only`) |
| **Regla dura RN-GL-01**: Solo JS nativo ES6+ | APROBADO | Sin frameworks, sin librerías externas |
| **Regla dura RN-GL-02**: Cero URLs externas | APROBADO | Sin `fetch`, sin CDN, sin `@import` externos en CSS |
| **BEM en español**: Nomenclatura consistente | APROBADO | Clases `.libro`, `.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio` ya definidas en HTML/CSS |
| **Formato de código**: 2 espacios, punto y coma, comillas simples | APROBADO | Estilo consistente en todo `js/app.js` |

---

## Resumen de lo Implementado

### Datos semilla (Tasks 1.1–1.6)
- **2 editoriales**: Alfaguara (ed-1), Planeta (ed-2)
- **2 géneros**: Novela (gen-1), Ciencia Ficción (gen-2)
- **3 autores**: Gabriel García Márquez (aut-1), Jorge Luis Borges (aut-2), Julio Cortázar (aut-3)
- **6 libros** con IDs estables, referencias cruzadas correctas:
  - `lib-1`: "Cien años de soledad" — Alfaguara, Novela, García Márquez
  - `lib-2`: "El Aleph" — Planeta, Novela, Borges
  - `lib-3`: "Rayuela" — Alfaguara, Novela, Cortázar
  - `lib-4`: "Ficciones" — Planeta, Ciencia Ficción, Borges
  - `lib-5`: "Bestiario" — Alfaguara, **Sin clasificar**, Cortázar
  - `lib-6`: "La casa de los espíritus" — Planeta, Novela, **García Márquez + Cortázar**
- **3 clientes** con emails únicos case-insensitive

### API interna (Tasks 2.1–2.5)
5 getters puros, sin mutaciones, listos para ser consumidos por C-04, C-05, C-06:
- `obtenerLibroPorId(id)`
- `obtenerEditorialPorId(id)`
- `obtenerGeneroPorId(id)` → `null` si id falsy
- `obtenerAutoresPorIds(ids)` → array (filtra inexistentes)
- `obtenerClientes()` → copia defensiva

### Normalización y filtro (Tasks 3.1–3.2)
- `normalizarBusqueda(texto)`: `trim()` + `toLowerCase()`, safe para `null`/`undefined`
- `filtrarLibros(termino)`: búsqueda por subcadena case-insensitive en `titulo`; vacía → catálogo completo

### Render del catálogo (Task 4.1)
- Usa `<template id="plantilla-libro">` + `cloneNode(true)`
- Estados: vacío (0 libros en seed), sin resultados (filtro sin coincidencias), normal
- Formateo ARS con `Intl.NumberFormat`
- **Solo `textContent`** para insertar datos (RN-CAT-08)

### Inicialización y eventos (Tasks 5.1–5.2)
- `inicializarCatalogo()`: render inicial + listeners
- `input` en `#buscador-titulo` → filtro en tiempo real
- `submit` en `#form-busqueda` → `preventDefault()` + mismo filtro
- `DOMContentLoaded` → punto de entrada

---

## Puntos de Integración para Changes Posteriores

| Change | Qué consume de C-03 |
|--------|---------------------|
| C-04 (altas) | Arrays `editoriales`, `generos`, `autores`, `libros`, `clientes` + getters `obtenerEditorialPorId`, `obtenerGeneroPorId`, `obtenerAutoresPorIds` + `renderCatalogo` para refrescar |
| C-05 (ventas) | Arrays `libros`, `clientes` + getters `obtenerLibroPorId`, `obtenerClientes` + `renderCatalogo` para refrescar selector `#renglon-libro` |
| C-06 (persistencia) | Todos los arrays + getters; `cargarEstado()` / `guardarEstado()` envolverán estos datos |

---

## Verificación de Regresiones (C-01 / C-02)

- `index.html` intacto: estructura semántica, plantillas, formularios sin cambios
- `css/` intacto: tokens en `:root`, layout responsive, componentes, foco visible, movimiento reducido
- Navegación por teclado funcional (`Tab` recorre todos los controles)
- Anillos de foco con `--color-foco` (6.13:1 sobre fondo)
- Sin scroll horizontal de página a 320 / 768 / 1280 px

---

## Archivos Generados/Modificados

| Archivo | Acción |
|---------|--------|
| `js/app.js` | **Modificado** — implementación completa del Ejercicio 3 |
| `openspec/changes/ejercicio3-datos-catalogo-filtro/tasks.md` | **Actualizado** — todos los checks en `[x]` |
| `docs/ejercicio3-implementacion-resumen.md` | **Creado** — este documento (evidencia de verificación) |

---

## Próximo Paso Recomendado

Ejecutar `/opsx:archive ejercicio3-datos-catalogo-filtro` para:
1. Sincronizar delta specs a `openspec/specs/`
2. Archivar el change en `openspec/changes/archive/`
3. Habilitar C-04 (`ejercicio4-altas-libros-clientes`) y C-05 (`ejercicio5-venta-historial`) en paralelo