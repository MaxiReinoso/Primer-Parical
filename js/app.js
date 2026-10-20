// Librería El Estante — lógica de la aplicación (Ejercicio 3)
// Catálogo dinámico y filtro por título

// ============================================================
// 1. DATOS FICTICIOS EN MEMORIA
// ============================================================

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

// ============================================================
// 2. FUNCIONES PURAS (normalización, lookups, formateo)
// ============================================================

/**
 * Normaliza un texto para comparación: NFD + strip diacríticos + trim + lowercase
 * @param {string} texto
 * @returns {string}
 */
function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Busca el nombre en una colección por id
 * @param {Array<{id: number, nombre: string}>} coleccion
 * @param {number} id
 * @returns {string}
 */
function buscarNombre(coleccion, id) {
  const encontrado = coleccion.find(item => item.id === id);
  return encontrado ? encontrado.nombre : "";
}

/**
 * Obtiene el nombre de la editorial por id
 * @param {number} id
 * @returns {string}
 */
function obtenerEditorial(id) {
  return buscarNombre(editoriales, id);
}

/**
 * Obtiene el nombre del género por id, con fallback "Sin clasificar"
 * @param {number} id
 * @returns {string}
 */
function obtenerGenero(id) {
  return buscarNombre(generos, id) || "Sin clasificar";
}

/**
 * Obtiene los nombres de autores por array de ids, unidos por ", "
 * @param {number[]} ids
 * @returns {string}
 */
function obtenerAutores(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return "Sin autor";
  }
  const nombres = ids
    .map(id => buscarNombre(autores, id))
    .filter(Boolean);
  return nombres.length > 0 ? nombres.join(", ") : "Sin autor";
}

/**
 * Formatea un número como precio en formato argentino
 * @param {number} num
 * @returns {string}
 */
function formatearPrecio(num) {
  const valor = Number(num) || 0;
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2
  });
}

// ============================================================
// 3. RENDER DE TARJETAS Y CATÁLOGO
// ============================================================

/**
 * Crea una tarjeta de libro clonando la plantilla y poblando los datos
 * @param {Object} libro
 * @returns {DocumentFragment}
 */
function crearTarjetaLibro(libro) {
  const plantilla = document.getElementById("plantilla-libro");
  if (!plantilla) {
    console.error("Plantilla #plantilla-libro no encontrada");
    return document.createDocumentFragment();
  }

  const fragment = plantilla.content.cloneNode(true);
  const article = fragment.querySelector(".libro");

  if (!article) {
    console.error("Estructura de plantilla inválida: falta .libro");
    return fragment;
  }

  // Poblar campos usando textContent (seguro, sin XSS)
  const titulo = article.querySelector(".libro__titulo");
  const isbn = article.querySelector(".libro__isbn");
  const editorial = article.querySelector(".libro__editorial");
  const genero = article.querySelector(".libro__genero");
  const autores = article.querySelector(".libro__autores");
  const precio = article.querySelector(".libro__precio");

  if (titulo) titulo.textContent = libro.titulo;
  if (isbn) isbn.textContent = libro.isbn;
  if (editorial) editorial.textContent = obtenerEditorial(libro.editorialId);
  if (genero) genero.textContent = obtenerGenero(libro.generoId);
  if (autores) autores.textContent = obtenerAutores(libro.autoresIds);
  if (precio) precio.textContent = formatearPrecio(libro.precio);

  return fragment;
}

/**
 * Renderiza el catálogo en el DOM y gestiona visibilidad de estados
 * @param {Object[]} librosAMostrar
 */
function renderizarCatalogo(librosAMostrar) {
  const listado = document.getElementById("catalogo-listado");
  const vacio = document.getElementById("catalogo-vacio");
  const sinResultados = document.getElementById("catalogo-sin-resultados");

  if (!listado || !vacio || !sinResultados) {
    console.error("Elementos del catálogo no encontrados en el DOM");
    return;
  }

  // Vaciar listado
  listado.innerHTML = "";

  // Determinar estados
  const hayLibrosEnDatos = libros.length > 0;
  const hayResultados = librosAMostrar.length > 0;
  const esBusquedaVacia = librosAMostrar.length === libros.length;

  // Gestionar visibilidad
  if (!hayLibrosEnDatos) {
    // Sin libros en la base de datos
    vacio.hidden = false;
    listado.hidden = true;
    sinResultados.hidden = true;
    return;
  }

  if (hayResultados) {
    // Hay resultados (búsqueda con coincidencias o catálogo completo)
    vacio.hidden = true;
    listado.hidden = false;
    sinResultados.hidden = true;

    // Renderizar tarjetas
    const fragment = document.createDocumentFragment();
    for (const libro of librosAMostrar) {
      fragment.appendChild(crearTarjetaLibro(libro));
    }
    listado.appendChild(fragment);
  } else {
    // Búsqueda sin coincidencias
    vacio.hidden = true;
    listado.hidden = true;
    sinResultados.hidden = false;
  }
}

// ============================================================
// 4. FILTRADO POR TÍTULO
// ============================================================

/**
 * Filtra los libros por título y renderiza el resultado
 * @param {string} consulta
 */
function filtrarPorTitulo(consulta) {
  try {
    const queryNormalizada = normalizarTexto(consulta);

    let filtrados;
    if (queryNormalizada === "") {
      // Búsqueda vacía: mostrar todo
      filtrados = libros;
    } else {
      // Filtrar por inclusión en título normalizado
      filtrados = libros.filter(libro =>
        normalizarTexto(libro.titulo).includes(queryNormalizada)
      );
    }

    renderizarCatalogo(filtrados);
  } catch (error) {
    console.error("Error al filtrar por título:", error);
  }
}

// ============================================================
// 5. INICIALIZACIÓN
// ============================================================

/**
 * Inicializa la aplicación: listener de búsqueda y render inicial
 */
function inicializar() {
  const buscador = document.getElementById("buscador-titulo");

  if (!buscador) {
    console.error("Input #buscador-titulo no encontrado");
    return;
  }

  // Listener de input (tiempo real)
  buscador.addEventListener("input", (evento) => {
    filtrarPorTitulo(evento.target.value);
  });

  // Render inicial del catálogo completo
  renderizarCatalogo(libros);
}

// Auto-ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", inicializar);