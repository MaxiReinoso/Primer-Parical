# Diseño: C-03 ejercicio3-datos-catalogo-filtro

## Estructura de datos (seed)

Todos los `id` son **strings estables** (no generados en runtime) para que C-04/C-05/C-06 puedan referenciarlos determinísticamente.

```js
// Datos de catálogo (entidades de referencia)
const editoriales = [
  { id: "ed-1", nombre: "Alfaguara" },
  { id: "ed-2", nombre: "Planeta" }
];

const generos = [
  { id: "gen-1", nombre: "Novela" },
  { id: "gen-2", nombre: "Ciencia Ficción" }
];

const autores = [
  { id: "aut-1", nombre: "Gabriel García Márquez" },
  { id: "aut-2", nombre: "Jorge Luis Borges" },
  { id: "aut-3", nombre: "Julio Cortázar" }
];

// Libros: 6 mínimo, cada uno con editorialId existente, autorIds (array, ≥1), generoId opcional
const libros = [
  {
    id: "lib-1",
    titulo: "Cien años de soledad",
    isbn: "978-0307474728",
    precio: 2500,
    editorialId: "ed-1",
    generoId: "gen-1",
    autorIds: ["aut-1"]
  },
  {
    id: "lib-2",
    titulo: "El Aleph",
    isbn: "978-8437604947",
    precio: 1800,
    editorialId: "ed-2",
    generoId: "gen-1",
    autorIds: ["aut-2"]
  },
  {
    id: "lib-3",
    titulo: "Rayuela",
    isbn: "978-8437601380",
    precio: 2200,
    editorialId: "ed-1",
    generoId: "gen-1",
    autorIds: ["aut-3"]
  },
  {
    id: "lib-4",
    titulo: "Ficciones",
    isbn: "978-8437601373",
    precio: 1950,
    editorialId: "ed-2",
    generoId: "gen-2",
    autorIds: ["aut-2"]
  },
  {
    id: "lib-5",
    titulo: "Bestiario",
    isbn: "978-8437604954",
    precio: 2100,
    editorialId: "ed-1",
    generoId: null, // SIN GÉNERO → "Sin clasificar"
    autorIds: ["aut-3"]
  },
  {
    id: "lib-6",
    titulo: "La casa de los espíritus",
    isbn: "978-8437604961",
    precio: 2700,
    editorialId: "ed-2",
    generoId: "gen-1",
    autorIds: ["aut-1", "aut-3"] // MÚLTIPLES AUTORES
  }
];

// Clientes: 3 mínimo, nombre completo y email único (case-insensitive)
const clientes = [
  { id: "cli-1", nombre: "María González", email: "maria.gonzalez@email.com" },
  { id: "cli-2", nombre: "Juan Pérez", email: "juan.perez@email.com" },
  { id: "cli-3", nombre: "Ana López", email: "ana.lopez@email.com" }
];
```

## Funciones de acceso (API interna)

Estas funciones **no mutan** los arrays; son getters puros que C-04, C-05, C-06 importarán/usarán.

```js
// Devuelve el libro o undefined
function obtenerLibroPorId(id) {
  return libros.find(l => l.id === id);
}

// Devuelve la editorial o undefined
function obtenerEditorialPorId(id) {
  return editoriales.find(e => e.id === id);
}

// Devuelve el género o undefined (null si no tiene género asignado)
function obtenerGeneroPorId(id) {
  if (!id) return null;
  return generos.find(g => g.id === id);
}

// Devuelve array de autores (puede estar vacío si ids no existen)
function obtenerAutoresPorIds(ids) {
  if (!Array.isArray(ids)) return [];
  return ids.map(id => autores.find(a => a.id === id)).filter(Boolean);
}

// Devuelve copia del array de clientes
function obtenerClientes() {
  return [...clientes];
}
```

## Normalización y filtro

```js
// Recorta espacios en los extremos y pasa a minúsculas
function normalizarBusqueda(texto) {
  return (texto || "").trim().toLowerCase();
}

// Filtra libros por subcadena en el título (case-insensitive)
function filtrarLibros(termino) {
  const normalizado = normalizarBusqueda(termino);
  if (!normalizado) return [...libros]; // búsqueda vacía → todo
  return libros.filter(l => l.titulo.toLowerCase().includes(normalizado));
}
```

## Render del catálogo

```js
function renderCatalogo(librosAMostrar) {
  const contenedor = document.getElementById("catalogo-listado");
  const vacio = document.getElementById("catalogo-vacio");
  const sinResultados = document.getElementById("catalogo-sin-resultados");
  const plantilla = document.getElementById("plantilla-libro");

  // Limpiar contenedor
  contenedor.innerHTML = "";

  // Estados vacíos
  if (libros.length === 0) {
    vacio.hidden = false;
    sinResultados.hidden = true;
    return;
  }

  vacio.hidden = true;

  if (librosAMostrar.length === 0) {
    sinResultados.hidden = false;
    return;
  }

  sinResultados.hidden = true;

  // Clonar plantilla para cada libro
  librosAMostrar.forEach(libro => {
    const clone = plantilla.content.cloneNode(true);
    const article = clone.querySelector(".libro");

    // Título
    article.querySelector(".libro__titulo").textContent = libro.titulo;

    // ISBN
    article.querySelector(".libro__isbn").textContent = libro.isbn;

    // Editorial
    const editorial = obtenerEditorialPorId(libro.editorialId);
    article.querySelector(".libro__editorial").textContent = editorial ? editorial.nombre : "—";

    // Género (RN-CAT-07: "Sin clasificar" si no tiene)
    const genero = obtenerGeneroPorId(libro.generoId);
    article.querySelector(".libro__genero").textContent = genero ? genero.nombre : "Sin clasificar";

    // Autores (lista separada por ", ")
    const autoresDelLibro = obtenerAutoresPorIds(libro.autorIds);
    article.querySelector(".libro__autores").textContent =
      autoresDelLibro.map(a => a.nombre).join(", ");

    // Precio (formato ARS con 2 decimales)
    article.querySelector(".libro__precio").textContent =
      new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })
        .format(libro.precio);

    contenedor.appendChild(clone);
  });
}
```

## Inicialización y eventos

```js
function inicializarCatalogo() {
  // Render inicial: catálogo completo
  renderCatalogo([...libros]);

  // Evento input en buscador (filtro en tiempo real)
  const buscador = document.getElementById("buscador-titulo");
  buscador.addEventListener("input", () => {
    const filtrados = filtrarLibros(buscador.value);
    renderCatalogo(filtrados);
  });

  // Evento submit del formulario (preventDefault para evitar recarga)
  const form = document.getElementById("form-busqueda");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const filtrados = filtrarLibros(buscador.value);
    renderCatalogo(filtrados);
  });
}

// Punto de entrada cuando el DOM está listo
document.addEventListener("DOMContentLoaded", inicializarCatalogo);
```

## Convenciones de código (alineadas con reglas duras)

| Regla | Aplicación |
|-------|------------|
| **RN-CAT-08** | Solo `textContent` / `createTextNode` — **nunca** `innerHTML` ni `insertAdjacentHTML` |
| **RN-GL-01** | Solo JS nativo (ES6+), sin librerías |
| **RN-GL-02** | Cero URLs externas |
| **DD-01** | No tocar `index.html` ni `css/` |
| **BEM en español** | Clases ya definidas en HTML/CSS: `.libro`, `.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio`, `.listado--catalogo`, `.mensaje--vacio` |
| **Tokens CSS** | El render no declara estilos; usa las clases existentes |

## Puntos de integración para cambios posteriores

| Change | Qué consume de C-03 |
|--------|---------------------|
| C-04 (altas) | Arrays `editoriales`, `generos`, `autores`, `libros`, `clientes` + getters `obtenerEditorialPorId`, `obtenerGeneroPorId`, `obtenerAutoresPorIds` + `renderCatalogo` para refrescar |
| C-05 (ventas) | Arrays `libros`, `clientes` + getters `obtenerLibroPorId`, `obtenerClientes` + `renderCatalogo` para refrescar selector `#renglon-libro` |
| C-06 (persistencia) | Todos los arrays + getters; `cargarEstado()` / `guardarEstado()` envolverán estos datos |

## Tests de aceptación (para verificación manual)

| Test | Entrada | Esperado |
|------|---------|----------|
| T1 | Cargar página | 6 tarjetas visibles con datos completos; "Sin clasificar" en Bestiario |
| T2 | Escribir "CIEN" en buscador | 1 tarjeta: "Cien años de soledad" |
| T3 | Escribir "  aleph  " (con espacios) | 1 tarjeta: "El Aleph" |
| T4 | Escribir "xyz" (inexistente) | `#catalogo-sin-resultados` visible, mensaje claro |
| T5 | Vaciar buscador | 6 tarjetas (catálogo completo) |
| T6 | Recargar página | Estado inicial idéntico (seed data inmutable) |