# Spec Delta: Catálogo y Filtro (Ejercicio 3)

## Purpose

Esta capacidad define los datos semilla (editoriales, géneros, autores, libros, clientes), los getters puros de acceso, la normalización y filtro de búsqueda por título, el render del catálogo desde plantilla HTML, y la inicialización con listeners de eventos. Es la base de datos y UI sobre la que construyen C-04 (altas), C-05 (ventas) y C-06 (persistencia).

## ADDED Requirements

### Requirement: Datos semilla precargados

El sistema DEBE proporcionar arrays precargados con 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes, cada uno con IDs estables y relaciones referenciales válidas.

#### Scenario: Editoriales disponibles
- **WHEN** el módulo se inicializa
- **THEN** `editoriales` contiene exactamente 2 elementos: `{id: "ed-1", nombre: "Alfaguara"}` y `{id: "ed-2", nombre: "Planeta"}`

#### Scenario: Géneros disponibles
- **WHEN** el módulo se inicializa
- **THEN** `generos` contiene exactamente 2 elementos: `{id: "gen-1", nombre: "Novela"}` y `{id: "gen-2", nombre: "Ciencia Ficción"}`

#### Scenario: Autores disponibles
- **WHEN** el módulo se inicializa
- **THEN** `autores` contiene exactamente 3 elementos con nombres "Gabriel García Márquez", "Jorge Luis Borges", "Julio Cortázar"

#### Scenario: Libros con relaciones válidas
- **WHEN** el módulo se inicializa
- **THEN** `libros` contiene exactamente 6 elementos, cada uno con `editorialId` válido, `generoId` válido o `null`, y `autorIds` array no vacío con IDs existentes

#### Scenario: Libro sin género muestra "Sin clasificar"
- **WHEN** se consulta el género de `lib-5` (Bestiario) que tiene `generoId: null`
- **THEN** `obtenerGeneroPorId(null)` retorna `null` y el render muestra "Sin clasificar"

#### Scenario: Libro con múltiples autores
- **WHEN** se consulta los autores de `lib-6` (La casa de los espíritus) con `autorIds: ["aut-1", "aut-3"]`
- **THEN** `obtenerAutoresPorIds(["aut-1", "aut-3"])` retorna array con 2 autores

#### Scenario: Clientes disponibles
- **WHEN** el módulo se inicializa
- **THEN** `clientes` contiene exactamente 3 elementos con nombre y email válidos

---

### Requirement: Getters puros de acceso a datos

El sistema DEBE exponer funciones puras (sin mutación de estado) para consultar entidades por ID o listar colecciones, que sirvan como contrato de integración para C-04, C-05, C-06.

#### Scenario: Obtener libro por ID existente
- **WHEN** se llama `obtenerLibroPorId("lib-1")`
- **THEN** retorna el objeto libro completo con `id: "lib-1"`

#### Scenario: Obtener libro por ID inexistente
- **WHEN** se llama `obtenerLibroPorId("no-existe")`
- **THEN** retorna `undefined`

#### Scenario: Obtener editorial por ID
- **WHEN** se llama `obtenerEditorialPorId("ed-1")`
- **THEN** retorna `{id: "ed-1", nombre: "Alfaguara"}`

#### Scenario: Obtener género por ID válido
- **WHEN** se llama `obtenerGeneroPorId("gen-1")`
- **THEN** retorna `{id: "gen-1", nombre: "Novela"}`

#### Scenario: Obtener género por ID null o falsy
- **WHEN** se llama `obtenerGeneroPorId(null)` o `obtenerGeneroPorId(undefined)`
- **THEN** retorna `null`

#### Scenario: Obtener autores por array de IDs
- **WHEN** se llama `obtenerAutoresPorIds(["aut-1", "aut-3"])`
- **THEN** retorna array con 2 objetos autor (filtrando IDs inexistentes)

#### Scenario: Obtener autores con IDs inexistentes
- **WHEN** se llama `obtenerAutoresPorIds(["aut-1", "fake", "aut-2"])`
- **THEN** retorna array con 2 objetos autor (ignorando "fake")

#### Scenario: Obtener clientes retorna copia superficial
- **WHEN** se llama `obtenerClientes()`
- **THEN** retorna `[...clientes]` (nuevo array, misma referencia a objetos)

---

### Requirement: Normalización de búsqueda

El sistema DEBE normalizar términos de búsqueda aplicando trim y lowercase, tratando valores nulos como cadena vacía.

#### Scenario: Normaliza texto con espacios
- **WHEN** se llama `normalizarBusqueda("  Foo  ")`
- **THEN** retorna `"foo"`

#### Scenario: Normaliza null y undefined
- **WHEN** se llama `normalizarBusqueda(null)` o `normalizarBusqueda(undefined)`
- **THEN** retorna `""`

#### Scenario: Normaliza cadena vacía
- **WHEN** se llama `normalizarBusqueda("")`
- **THEN** retorna `""`

#### Scenario: Normaliza mayúsculas
- **WHEN** se llama `normalizarBusqueda("CIEN AÑOS")`
- **THEN** retorna `"cien años"`

---

### Requirement: Filtrado de libros por título

El sistema DEBE filtrar la lista de libros por coincidencia de subcadena en el título (case-insensitive), aplicando normalización previa; búsqueda vacía retorna catálogo completo.

#### Scenario: Filtro por subcadena case-insensitive
- **WHEN** se llama `filtrarLibros("CIEN")`
- **THEN** retorna array con 1 elemento: "Cien años de soledad"

#### Scenario: Filtro por subcadena con trim
- **WHEN** se llama `filtrarLibros("  aleph  ")`
- **THEN** retorna array con 1 elemento: "El Aleph"

#### Scenario: Búsqueda vacía retorna catálogo completo
- **WHEN** se llama `filtrarLibros("")` o `filtrarLibros("   ")`
- **THEN** retorna copia completa `[...libros]` (6 elementos)

#### Scenario: Sin coincidencias retorna array vacío
- **WHEN** se llama `filtrarLibros("xyz")`
- **THEN** retorna `[]`

---

### Requirement: Render del catálogo desde plantilla

El sistema DEBE renderizar tarjetas de libros clonando una plantilla HTML (`#plantilla-libro`), poblando solo con `textContent` (nunca HTML interpretable), y mostrando 3 estados UI según el resultado.

#### Scenario: Catálogo completo al iniciar
- **WHEN** se llama `inicializarCatalogo()`
- **THEN** `#catalogo-listado` contiene 6 tarjetas, `#catalogo-vacio` oculto, `#catalogo-sin-resultados` oculto

#### Scenario: Tarjeta muestra todos los campos requeridos
- **WHEN** se renderiza cualquier libro
- **THEN** la tarjeta contiene `.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio` poblados con `textContent`

#### Scenario: Precio formateado en ARS
- **WHEN** se renderiza un libro con `precio: 2500`
- **THEN** `.libro__precio` muestra `"$ 2.500,00"` (Intl.NumberFormat es-AR, currency ARS)

#### Scenario: Género null muestra "Sin clasificar"
- **WHEN** se renderiza `lib-5` (generoId: null)
- **THEN** `.libro__genero` muestra "Sin clasificar"

#### Scenario: Autores múltiples separados por coma
- **WHEN** se renderiza `lib-6` (autorIds: ["aut-1", "aut-3"])
- **THEN** `.libro__autores` muestra "Gabriel García Márquez, Julio Cortázar"

#### Scenario: Búsqueda con resultados oculta estados vacíos
- **WHEN** `filtrarLibros("cien")` retorna 1 resultado y se renderiza
- **THEN** `#catalogo-listado` tiene 1 tarjeta, `#catalogo-vacio` oculto, `#catalogo-sin-resultados` oculto

#### Scenario: Búsqueda sin coincidencias muestra mensaje
- **WHEN** `filtrarLibros("xyz")` retorna `[]` y se renderiza
- **THEN** `#catalogo-listado` vacío, `#catalogo-vacio` oculto, `#catalogo-sin-resultados` visible

#### Scenario: Catálogo inicialmente vacío (sin datos)
- **WHEN** `libros` array está vacío y se llama `renderCatalogo([])`
- **THEN** `#catalogo-vacio` visible, `#catalogo-sin-resultados` oculto, `#catalogo-listado` vacío

---

### Requirement: Inicialización y listeners de eventos

El sistema DEBE inicializar el catálogo completo al cargar el DOM y registrar listeners para filtro en tiempo real (`input`) y envío de formulario (`submit` con preventDefault).

#### Scenario: Inicialización en DOMContentLoaded
- **WHEN** se dispara `DOMContentLoaded`
- **THEN** `inicializarCatalogo()` se ejecuta y renderiza catálogo completo

#### Scenario: Filtro en tiempo real en input
- **WHEN** usuario escribe en `#buscador-titulo`
- **THEN** se ejecuta `filtrarLibros(valor)` y `renderCatalogo(resultado)` en cada evento `input`

#### Scenario: Envío de formulario no recarga página
- **WHEN** usuario envía `#form-busqueda` (Enter o botón)
- **THEN** `e.preventDefault()` se ejecuta y filtro se aplica sin recarga

---

## REMOVED Requirements

(none)

---

## RENAMED Requirements

(none)