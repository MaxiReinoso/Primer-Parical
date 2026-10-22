# Propuesta: C-03 ejercicio3-datos-catalogo-filtro

## ¿Qué se propone?

Implementar los **datos locales** (arrays de editoriales, géneros, autores, libros y clientes con IDs estables), el **render del catálogo** a partir del array de libros y el **filtro por título** con normalización y estados de UI claros.

## ¿Por qué?

- Es el **primer change de la Fase 1** y el **único habilitado** ahora (GATE 2: C-01 ✓ + C-02 ✓).
- Define el **modelo de datos y la forma de los arrays** que consumirán C-04 (altas), C-05 (ventas) y C-06 (persistencia). Cambios aquí rompen los tres cambios siguientes → **governance CRITICO**.
- Cumple los **15 puntos del Ejercicio 3** (US-006, US-007) y cierra el control "Apariencia de tablas y tarjetas con contenido real" que quedó PENDIENTE POR ALCANCE en el Ejercicio 2.

## Alcance (lo que SÍ entra)

| Ítem | Descripción |
|------|-------------|
| Datos semilla | 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes ficticios con `id` estable |
| Relaciones | Cada libro con `editorialId` existente, `autorIds` ≥ 1 existente, `generoId` opcional; al menos 1 libro sin género |
| Render | `renderCatalogo()` clona `#plantilla-libro` → `#catalogo-listado`; datos insertados como **texto** (`textContent`) |
| Filtro | `normalizarBusqueda()` recorta y pasa a minúsculas; `filtrarLibros()` compara por **subcadena** en título |
| Estados UI | Búsqueda vacía → catálogo completo; sin coincidencias → `#catalogo-sin-resultados` visible con mensaje; catálogo sin libros → `#catalogo-vacio` |
| Eventos | `input` en `#buscador-titulo`; `submit` en `#form-busqueda` con `preventDefault` |
| API interna | `obtenerLibroPorId()`, `obtenerEditorialPorId()`, `obtenerGeneroPorId()`, `obtenerAutoresPorIds()`, `obtenerClientes()` |

## Fuera de alcance (lo que NO entra)

- CRUD de editoriales, géneros, autores (no lo pide la consigna)
- `fetch`, APIs externas, `localStorage` (eso es C-06)
- Altas de libros/clientes (C-04), ventas/historial (C-05)
- Modificaciones a `index.html` o `css/` (territorio de C-01 y C-02)

## Reglas de negocio cubiertas

- **RN-CAT-01** a **RN-CAT-08** (catálogo generado dinámicamente, filtro case-insensitive + substring + trim, búsqueda vacía, sin resultados, "Sin clasificar", texto no HTML)
- **RN-GL-01**, **RN-GL-02**, **RN-GL-03** (solo HTML/CSS/JS nativo, cero URLs externas, abre con `file://`)

## Criterios de aceptación (derivados de US-006, US-007)

| CA | Verificación |
|----|--------------|
| CA-1 | ≥6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes con `id` estable |
| CA-2 | Cada libro tiene editorial existente y ≥1 autor existente |
| CA-3 | Catálogo generado desde el array, no escrito en HTML |
| CA-4 | Libro sin género muestra "Sin clasificar" |
| CA-5 | Filtro ignora mayúsculas/minúsculas |
| CA-6 | Filtro encuentra coincidencias parciales y recorta espacios |
| CA-7 | Búsqueda vacía muestra catálogo completo |
| CA-8 | Búsqueda sin coincidencias muestra mensaje claro |

## Evidencia de verificación requerida

Los **3 casos de búsqueda** de `12_casos_manuales.md`:
1. Parte del título en mayúsculas → coincidencias sin distinguir mayúsculas
2. Búsqueda vacía → catálogo completo
3. Texto inexistente → mensaje sin resultados

Y la **primera aparición de tarjetas con contenido real** (cierra el control PENDIENTE POR ALCANCE del Ej. 2).

## Archivos que se tocan

| Archivo | Acción |
|---------|--------|
| `js/app.js` | **Único archivo** — escribe datos, render, filtro, eventos, API interna |

## Dependencias

- C-01 `ejercicio1-estructura-html` ✓ (HTML ya tiene `#plantilla-libro`, `#catalogo-listado`, `#buscador-titulo`, `#form-busqueda`, `#catalogo-vacio`, `#catalogo-sin-resultados`)
- C-02 `ejercicio2-estilos-css` ✓ (CSS ya tiene `.listado--catalogo`, `.libro*`, `.mensaje--vacio`, `.mensaje[hidden]`)

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Romper el modelo que esperan C-04, C-05, C-06 | **Freezar la forma de los arrays** en el `design.md`; cualquier cambio posterior requiere coordinación explícita |
| Insertar HTML en lugar de texto (XSS) | Usar **solo** `textContent` / `createTextNode`; revisar con linter manual |
| Filtro no recorta espacios | Test unitario de `normalizarBusqueda("  foo  ")` → `"foo"` |
| `id` no estable entre recargas | Los `id` son strings/numbers literales en el seed; C-06 hará la persistencia |

## Próximo paso

Crear `design.md` con la estructura exacta de los arrays, firmas de funciones y flujo de render, y `tasks.md` con checklist de implementación.