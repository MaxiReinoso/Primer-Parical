# Tasks: C-03 ejercicio3-datos-catalogo-filtro

> **Archivos que este change puede tocar:** `js/app.js` — **y nada más**.
> `index.html` y `css/` son territorio de C-01 y C-02 (regla dura DD-01).

## Checklist de implementación

### 1. Datos semilla (arrays con IDs estables)

- [x] 1.1 Declarar `editoriales` (2 items: Alfaguara, Planeta) con `id` y `nombre`
- [x] 1.2 Declarar `generos` (2 items: Novela, Ciencia Ficción) con `id` y `nombre`
- [x] 1.3 Declarar `autores` (3 items: García Márquez, Borges, Cortázar) con `id` y `nombre`
- [x] 1.4 Declarar `libros` (6 items mínimos) con: `id`, `titulo`, `isbn`, `precio` (number > 0), `editorialId` (existente), `generoId` (opcional, null para "Sin clasificar"), `autorIds` (array ≥1 existente)
- [x] 1.5 Verificar: al menos 1 libro con `generoId: null` (Bestiario), al menos 1 libro con múltiples `autorIds` (La casa de los espíritus)
- [x] 1.6 Declarar `clientes` (3 items mínimos) con `id`, `nombre` (completo), `email` (único case-insensitive)

### 2. Funciones de acceso (API interna, getters puros)

- [x] 2.1 `obtenerLibroPorId(id)` → devuelve libro o `undefined`
- [x] 2.2 `obtenerEditorialPorId(id)` → devuelve editorial o `undefined`
- [x] 2.3 `obtenerGeneroPorId(id)` → devuelve género o `null` si id falsy
- [x] 2.4 `obtenerAutoresPorIds(ids)` → devuelve array de autores (filtra inexistentes)
- [x] 2.5 `obtenerClientes()` → devuelve copia del array (`[...clientes]`)

### 3. Normalización y filtro

- [x] 3.1 `normalizarBusqueda(texto)` → `trim()` + `toLowerCase()`, maneja `null`/`undefined`
- [x] 3.2 `filtrarLibros(termino)` → usa `normalizarBusqueda`; si vacío devuelve copia de `libros`; si no, `filter` por `includes` en `titulo.toLowerCase()`

### 4. Render del catálogo

- [x] 4.1 `renderCatalogo(librosAMostrar)`:
  - [x] 4.1.1 Obtener referencias DOM: `#catalogo-listado`, `#catalogo-vacio`, `#catalogo-sin-resultados`, `#plantilla-libro`
  - [x] 4.1.2 Limpiar contenedor con `innerHTML = ""`
  - [x] 4.1.3 Si `libros.length === 0` → mostrar `#catalogo-vacio`, ocultar `#catalogo-sin-resultados`, return
  - [x] 4.1.4 Ocultar `#catalogo-vacio`
  - [x] 4.1.5 Si `librosAMostrar.length === 0` → mostrar `#catalogo-sin-resultados`, return
  - [x] 4.1.6 Ocultar `#catalogo-sin-resultados`
  - [x] 4.1.7 Para cada libro: clonar `plantilla-libro.content.cloneNode(true)`
  - [x] 4.1.8 Llenar **solo con `textContent`** (RN-CAT-08):
    - `.libro__titulo` ← `libro.titulo`
    - `.libro__isbn` ← `libro.isbn`
    - `.libro__editorial` ← `obtenerEditorialPorId(libro.editorialId)?.nombre ?? "—"`
    - `.libro__genero` ← `obtenerGeneroPorId(libro.generoId)?.nombre ?? "Sin clasificar"` (RN-CAT-07)
    - `.libro__autores` ← `obtenerAutoresPorIds(libro.autorIds).map(a => a.nombre).join(", ")`
    - `.libro__precio` ← `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }).format(libro.precio)`
  - [x] 4.1.9 `contenedor.appendChild(clone)`

### 5. Inicialización y eventos

- [x] 5.1 `inicializarCatalogo()`:
  - [x] 5.1.1 `renderCatalogo([...libros])` (catálogo completo inicial)
  - [x] 5.1.2 `input` en `#buscador-titulo` → `filtrarLibros(buscador.value)` → `renderCatalogo(resultado)`
  - [x] 5.1.3 `submit` en `#form-busqueda` → `e.preventDefault()` → mismo filtro que input
- [x] 5.2 `DOMContentLoaded` → `inicializarCatalogo()`

### 6. Verificación manual (criterios de aceptación)

- [x] 6.1 Abrir `index.html` en navegador (file://)
- [x] 6.2 **CA-1/CA-2/CA-3/CA-4**: Ver 6 tarjetas con datos completos; "Sin clasificar" en Bestiario; editorial/autores correctos; precio formateado ARS
- [x] 6.3 **CA-5/CA-6**: Escribir "CIEN" → 1 resultado; escribir "  aleph  " → 1 resultado (trim + lowercase)
- [x] 6.4 **CA-7**: Vaciar buscador → 6 tarjetas (catálogo completo)
- [x] 6.5 **CA-8**: Escribir "xyz" → mensaje "No se encontraron libros que coincidan con la búsqueda." visible
- [x] 6.6 Recargar → estado inicial idéntico (seed inmutable)
- [x] 6.7 Verificar consola: sin errores, sin warnings

### 7. Limpieza y convenciones

- [x] 7.1 Sin `console.log` / `debugger` en código final
- [x] 7.2 Solo `textContent` / `createTextNode` — **cero** `innerHTML` / `insertAdjacentHTML` / `outerHTML`
- [x] 7.3 Sin URLs externas, sin CDN, sin `fetch`, sin `localStorage`
- [x] 7.4 Nombres de funciones/variables en español, BEM en español para clases (ya vienen del HTML/CSS)
- [x] 7.5 Código formateado consistentemente (indentación 2 espacios, punto y coma, comillas simples)

## Definición de "Hecho" (Definition of Done)

| Criterio | Cómo se verifica |
|----------|------------------|
| Todos los checks [x] arriba | Checklist completo |
| 6 casos manuales de `12_casos_manuales.md` pasan | Verificación en navegador real |
| Control "Apariencia de tarjetas con contenido real" (Ej. 2) cierra | Evidencia visual en `docs/ejercicio3-implementacion-resumen.md` |
| `js/app.js` es el **único** archivo modificado | `git diff --name-only` muestra solo `js/app.js` |
| Sin regresiones en C-01/C-02 | HTML/CSS intactos; navegación y estilos funcionan |

## Orden de ejecución recomendado

1. **Datos** (1.1–1.6) → base de todo
2. **Getters** (2.1–2.5) → usados por render y futuros changes
3. **Normalización + Filtro** (3.1–3.2) → lógica pura, testeable aislada
4. **Render** (4.1) → conecta datos con DOM
5. **Inicialización + Eventos** (5.1–5.2) → hace la app viva
6. **Verificación manual** (6.1–6.7) → evidencia
7. **Limpieza** (7.1–7.5) → calidad de entrega

## Notas para el implementador

- **Governance CRITICO**: La forma exacta de los arrays y las firmas de los getters **no deben cambiar** después de este change sin coordinación explícita con C-04, C-05, C-06.
- **No inventes campos**: Usa exactamente los atributos definidos en `design.md` y `knowledge-base/04_modelo_de_datos.md`.
- **El HTML ya tiene todo**: `#plantilla-libro`, `#catalogo-listado`, `#buscador-titulo`, `#form-busqueda`, `#catalogo-vacio`, `#catalogo-sin-resultados` — no agregues nada al HTML.
- **El CSS ya tiene todo**: `.listado--catalogo`, `.libro`, `.libro__*`, `.mensaje--vacio`, `.mensaje[hidden]` — no agregues estilos.
- **Evidencia**: Al terminar, crea `docs/ejercicio3-implementacion-resumen.md` con la tabla de verificación (control × estado × motivo), igual que `docs/ejercicio1-implementacion-resumen.md` y `docs/ejercicio2-implementacion-resumen.md`.