// Librería El Estante — lógica de la aplicación.
// Ejercicio 3: Datos semilla, catálogo y filtro.

// ============================
// 1. Datos semilla (seed data)
// ============================

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
    generoId: null,
    autorIds: ["aut-3"]
  },
  {
    id: "lib-6",
    titulo: "La casa de los espíritus",
    isbn: "978-8437604961",
    precio: 2700,
    editorialId: "ed-2",
    generoId: "gen-1",
    autorIds: ["aut-1", "aut-3"]
  }
];

const clientes = [
  { id: "cli-1", nombre: "María González", email: "maria.gonzalez@email.com" },
  { id: "cli-2", nombre: "Juan Pérez", email: "juan.perez@email.com" },
  { id: "cli-3", nombre: "Ana López", email: "ana.lopez@email.com" }
];

// ============================
// 2. Funciones de acceso (getters puros)
// ============================

function obtenerLibroPorId(id) {
  return libros.find(l => l.id === id);
}

function obtenerEditorialPorId(id) {
  return editoriales.find(e => e.id === id);
}

function obtenerGeneroPorId(id) {
  if (!id) return null;
  return generos.find(g => g.id === id);
}

function obtenerAutoresPorIds(ids) {
  if (!Array.isArray(ids)) return [];
  return ids.map(id => autores.find(a => a.id === id)).filter(Boolean);
}

function obtenerClientes() {
  return [...clientes];
}

// ============================
// 3. Normalización y filtro
// ============================

function normalizarBusqueda(texto) {
  return (texto || "").trim().toLowerCase();
}

function filtrarLibros(termino) {
  const normalizado = normalizarBusqueda(termino);
  if (!normalizado) return [...libros];
  return libros.filter(l => l.titulo.toLowerCase().includes(normalizado));
}

// ============================
// 4. Render del catálogo
// ============================

function renderCatalogo(librosAMostrar) {
  const contenedor = document.getElementById("catalogo-listado");
  const vacio = document.getElementById("catalogo-vacio");
  const sinResultados = document.getElementById("catalogo-sin-resultados");
  const plantilla = document.getElementById("plantilla-libro");

  contenedor.innerHTML = "";

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

  const formateadorPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2
  });

  librosAMostrar.forEach(libro => {
    const clone = plantilla.content.cloneNode(true);
    const article = clone.querySelector(".libro");

    article.querySelector(".libro__titulo").textContent = libro.titulo;
    article.querySelector(".libro__isbn").textContent = libro.isbn;

    const editorial = obtenerEditorialPorId(libro.editorialId);
    article.querySelector(".libro__editorial").textContent = editorial ? editorial.nombre : "—";

    const genero = obtenerGeneroPorId(libro.generoId);
    article.querySelector(".libro__genero").textContent = genero ? genero.nombre : "Sin clasificar";

    const autoresDelLibro = obtenerAutoresPorIds(libro.autorIds);
    article.querySelector(".libro__autores").textContent = autoresDelLibro.map(a => a.nombre).join(", ");

    article.querySelector(".libro__precio").textContent = formateadorPrecio.format(libro.precio);

    contenedor.appendChild(clone);
  });
}

// ============================
// 5. Inicialización y eventos
// ============================

function inicializarCatalogo() {
  renderCatalogo([...libros]);

  const buscador = document.getElementById("buscador-titulo");
  buscador.addEventListener("input", () => {
    const filtrados = filtrarLibros(buscador.value);
    renderCatalogo(filtrados);
  });

  const form = document.getElementById("form-busqueda");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const filtrados = filtrarLibros(buscador.value);
    renderCatalogo(filtrados);
  });
}

document.addEventListener("DOMContentLoaded", inicializarCatalogo);