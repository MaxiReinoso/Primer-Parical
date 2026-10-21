// Librería El Estante — lógica de la aplicación (Ejercicio 3 + 4)
// Catálogo dinámico, filtro por título, alta de libros y clientes

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
 * Normaliza un ISBN: elimina espacios y guiones
 * @param {string} isbn
 * @returns {string}
 */
function normalizarISBN(isbn) {
  return isbn.replace(/[\s-]/g, "");
}

/**
 * Valida formato de email con regex simple
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Genera el próximo id disponible para un array de objetos con propiedad id
 * @param {Array<{id: number}>} array
 * @returns {number}
 */
function generarId(array) {
  if (array.length === 0) return 1;
  return Math.max(...array.map(item => item.id)) + 1;
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
// 3. POBLAR SELECTS (Ejercicio 4)
// ============================================================

/**
 * Pobla los selects del formulario de libros con datos actuales
 */
function poblarSelectsLibro() {
  // Select editorial
  const selectEditorial = document.getElementById("libro-editorial");
  if (selectEditorial) {
    const valorActual = selectEditorial.value;
    selectEditorial.innerHTML = '<option value="">Seleccionar editorial</option>';
    for (const editorial of editoriales) {
      const option = document.createElement("option");
      option.value = editorial.id;
      option.textContent = editorial.nombre;
      selectEditorial.appendChild(option);
    }
    if (valorActual && Array.from(selectEditorial.options).some(opt => opt.value === valorActual)) {
      selectEditorial.value = valorActual;
    }
  }

  // Select género
  const selectGenero = document.getElementById("libro-genero");
  if (selectGenero) {
    const valorActual = selectGenero.value;
    selectGenero.innerHTML = '<option value="">Sin clasificar</option>';
    for (const genero of generos) {
      const option = document.createElement("option");
      option.value = genero.id;
      option.textContent = genero.nombre;
      selectGenero.appendChild(option);
    }
    if (valorActual && Array.from(selectGenero.options).some(opt => opt.value === valorActual)) {
      selectGenero.value = valorActual;
    }
  }

  // Multi-select autores
  const selectAutores = document.getElementById("libro-autores");
  if (selectAutores) {
    const valoresActuales = Array.from(selectAutores.selectedOptions).map(opt => opt.value);
    selectAutores.innerHTML = "";
    for (const autor of autores) {
      const option = document.createElement("option");
      option.value = autor.id;
      option.textContent = autor.nombre;
      if (valoresActuales.includes(String(autor.id))) {
        option.selected = true;
      }
      selectAutores.appendChild(option);
    }
  }
}

/**
 * Pobla el select de clientes (para ventas y tabla)
 */
function poblarSelectClientes() {
  const selectCliente = document.getElementById("venta-cliente");
  if (selectCliente) {
    const valorActual = selectCliente.value;
    selectCliente.innerHTML = '<option value="">Seleccionar cliente</option>';
    for (const cliente of clientes) {
      const option = document.createElement("option");
      option.value = cliente.id;
      option.textContent = `${cliente.nombre} (${cliente.email})`;
      selectCliente.appendChild(option);
    }
    if (valorActual && Array.from(selectCliente.options).some(opt => opt.value === valorActual)) {
      selectCliente.value = valorActual;
    }
  }

  // También actualizar #renglon-libro si existe (para ventas)
  const selectRenglonLibro = document.getElementById("renglon-libro");
  if (selectRenglonLibro) {
    const valorActual = selectRenglonLibro.value;
    selectRenglonLibro.innerHTML = '<option value="">Seleccionar libro</option>';
    for (const libro of libros) {
      const option = document.createElement("option");
      option.value = libro.id;
      option.textContent = `${libro.titulo} (${formatearPrecio(libro.precio)})`;
      selectRenglonLibro.appendChild(option);
    }
    if (valorActual && Array.from(selectRenglonLibro.options).some(opt => opt.value === valorActual)) {
      selectRenglonLibro.value = valorActual;
    }
  }
}

// ============================================================
// 4. VALIDACIONES FORMULARIOS (Ejercicio 4)
// ============================================================

/**
 * Valida el formulario de alta de libro
 * @param {Object} datos - {titulo, isbn, precio, editorialId, generoId, autoresIds}
 * @returns {{valido: boolean, errores: string[]}}
 */
function validarFormularioLibro(datos) {
  const errores = [];

  // 1. Título no vacío
  if (!datos.titulo || datos.titulo.trim() === "") {
    errores.push("El título es obligatorio.");
  }

  // 2. ISBN no vacío + único (normalizado)
  if (!datos.isbn || datos.isbn.trim() === "") {
    errores.push("El ISBN es obligatorio.");
  } else {
    const isbnNormalizado = normalizarISBN(datos.isbn);
    const isbnDuplicado = libros.some(libro => normalizarISBN(libro.isbn) === isbnNormalizado);
    if (isbnDuplicado) {
      errores.push("Ya existe un libro con ese ISBN.");
    }
  }

  // 3. Precio numérico > 0
  const precioNum = Number(datos.precio);
  if (isNaN(precioNum) || precioNum <= 0) {
    errores.push("El precio debe ser un número mayor a 0.");
  }

  // 4. Editorial seleccionada existe en editoriales
  const editorialId = Number(datos.editorialId);
  if (isNaN(editorialId) || !editoriales.some(e => e.id === editorialId)) {
    errores.push("Debe seleccionar una editorial válida.");
  }

  // 5. Al menos 1 autor seleccionado + todos existen en autores
  if (!Array.isArray(datos.autoresIds) || datos.autoresIds.length === 0) {
    errores.push("Debe seleccionar al menos un autor.");
  } else {
    const autoresInvalidos = datos.autoresIds.some(id => !autores.some(a => a.id === Number(id)));
    if (autoresInvalidos) {
      errores.push("Uno o más autores seleccionados no son válidos.");
    }
  }

  // 6. Género: si se elige (value !== ""), debe existir en generos
  if (datos.generoId !== "" && datos.generoId !== undefined && datos.generoId !== null) {
    const generoId = Number(datos.generoId);
    if (isNaN(generoId) || !generos.some(g => g.id === generoId)) {
      errores.push("El género seleccionado no es válido.");
    }
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

/**
 * Valida el formulario de alta de cliente
 * @param {Object} datos - {nombre, email}
 * @returns {{valido: boolean, errores: string[]}}
 */
function validarFormularioCliente(datos) {
  const errores = [];

  // 1. Nombre completo no vacío
  if (!datos.nombre || datos.nombre.trim() === "") {
    errores.push("El nombre completo es obligatorio.");
  }

  // 2. Email no vacío + formato válido
  if (!datos.email || datos.email.trim() === "") {
    errores.push("El email es obligatorio.");
  } else if (!validarEmail(datos.email.trim())) {
    errores.push("El formato del email no es válido.");
  } else {
    // 3. Email único (trim + case-insensitive)
    const emailNormalizado = datos.email.trim().toLowerCase();
    const emailDuplicado = clientes.some(cliente => cliente.email.trim().toLowerCase() === emailNormalizado);
    if (emailDuplicado) {
      errores.push("Ya existe un cliente registrado con ese email.");
    }
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

// ============================================================
// 5. RENDER TABLAS (Ejercicio 4)
// ============================================================

/**
 * Renderiza la tabla de libros en #tabla-libros tbody
 */
function renderTablaLibros() {
  const tbody = document.querySelector("#tabla-libros tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (libros.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No hay libros registrados.";
    td.style.textAlign = "center";
    td.style.padding = "1rem";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const libro of libros) {
    const tr = document.createElement("tr");

    const tdTitulo = document.createElement("td");
    tdTitulo.textContent = libro.titulo;

    const tdIsbn = document.createElement("td");
    tdIsbn.textContent = libro.isbn;

    const tdEditorial = document.createElement("td");
    tdEditorial.textContent = obtenerEditorial(libro.editorialId);

    const tdGenero = document.createElement("td");
    tdGenero.textContent = obtenerGenero(libro.generoId);

    const tdAutores = document.createElement("td");
    tdAutores.textContent = obtenerAutores(libro.autoresIds);

    const tdPrecio = document.createElement("td");
    tdPrecio.textContent = formatearPrecio(libro.precio);

    tr.append(tdTitulo, tdIsbn, tdEditorial, tdGenero, tdAutores, tdPrecio);
    tbody.appendChild(tr);
  }
}

/**
 * Renderiza la tabla de clientes en #tabla-clientes tbody
 */
function renderTablaClientes() {
  const tbody = document.querySelector("#tabla-clientes tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (clientes.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.textContent = "No hay clientes registrados.";
    td.style.textAlign = "center";
    td.style.padding = "1rem";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const cliente of clientes) {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = cliente.nombre;

    const tdEmail = document.createElement("td");
    tdEmail.textContent = cliente.email;

    const tdAcciones = document.createElement("td");
    // Placeholder para futuras acciones (Ej. 5/6)
    tdAcciones.textContent = "—";

    tr.append(tdNombre, tdEmail, tdAcciones);
    tbody.appendChild(tr);
  }
}

// ============================================================
// 6. HANDLERS SUBMIT FORMULARIOS (Ejercicio 4)
// ============================================================

/**
 * Maneja el submit del formulario de libro
 * @param {Event} evento
 */
function handleSubmitLibro(evento) {
  evento.preventDefault();

  const form = evento.target;
  const mensajeExito = document.getElementById("libro-mensaje-exito");
  const mensajeError = document.getElementById("libro-mensaje-error");

  // Ocultar mensajes previos
  if (mensajeExito) mensajeExito.hidden = true;
  if (mensajeError) mensajeError.hidden = true;

  // Obtener datos del formulario
  const formData = new FormData(form);
  const titulo = formData.get("titulo")?.toString().trim() ?? "";
  const isbn = formData.get("isbn")?.toString().trim() ?? "";
  const precio = formData.get("precio")?.toString().trim() ?? "";
  const editorialId = formData.get("editorial")?.toString() ?? "";
  const generoId = formData.get("genero")?.toString() ?? "";
  const autoresIds = formData.getAll("autores").map(v => Number(v)).filter(n => !isNaN(n));

  const datos = { titulo, isbn, precio, editorialId, generoId, autoresIds };

  // Validar
  const { valido, errores } = validarFormularioLibro(datos);

  if (!valido) {
    if (mensajeError) {
      mensajeError.textContent = errores.join(" ");
      mensajeError.hidden = false;
    }
    return;
  }

  // Crear nuevo libro
  const nuevoLibro = {
    id: generarId(libros),
    titulo: datos.titulo.trim(),
    isbn: datos.isbn.trim(),
    precio: Number(datos.precio),
    editorialId: Number(datos.editorialId),
    generoId: datos.generoId === "" ? null : Number(datos.generoId),
    autoresIds: datos.autoresIds
  };

  // Agregar a la colección
  libros.push(nuevoLibro);

  // Actualizar vistas
  renderTablaLibros();
  poblarSelectsLibro();
  poblarSelectClientes(); // actualiza #venta-cliente y #renglon-libro
  renderizarCatalogo(libros); // actualiza catálogo (Ej. 3)

  // Limpiar formulario
  form.reset();

  // Mostrar éxito
  if (mensajeExito) {
    mensajeExito.textContent = "Libro agregado correctamente.";
    mensajeExito.hidden = false;
  }
}

/**
 * Maneja el submit del formulario de cliente
 * @param {Event} evento
 */
function handleSubmitCliente(evento) {
  evento.preventDefault();

  const form = evento.target;
  const mensajeExito = document.getElementById("cliente-mensaje-exito");
  const mensajeError = document.getElementById("cliente-mensaje-error");

  // Ocultar mensajes previos
  if (mensajeExito) mensajeExito.hidden = true;
  if (mensajeError) mensajeError.hidden = true;

  // Obtener datos del formulario
  const formData = new FormData(form);
  const nombre = formData.get("nombre")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";

  const datos = { nombre, email };

  // Validar
  const { valido, errores } = validarFormularioCliente(datos);

  if (!valido) {
    if (mensajeError) {
      mensajeError.textContent = errores.join(" ");
      mensajeError.hidden = false;
    }
    return;
  }

  // Crear nuevo cliente
  const nuevoCliente = {
    id: generarId(clientes),
    nombre: datos.nombre,
    email: datos.email.toLowerCase()
  };

  // Agregar a la colección
  clientes.push(nuevoCliente);

  // Actualizar vistas
  renderTablaClientes();
  poblarSelectClientes(); // actualiza #venta-cliente y #renglon-libro

  // Limpiar formulario
  form.reset();

  // Mostrar éxito
  if (mensajeExito) {
    mensajeExito.textContent = "Cliente agregado correctamente.";
    mensajeExito.hidden = false;
  }
}

// ============================================================
// 7. RENDER DE TARJETAS Y CATÁLOGO (Ejercicio 3)
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
// 8. FILTRADO POR TÍTULO (Ejercicio 3)
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
// 9. INICIALIZACIÓN
// ============================================================

/**
 * Inicializa la aplicación: listeners, poblar selects, render inicial
 */
function inicializar() {
  // Listener búsqueda catálogo (Ej. 3)
  const buscador = document.getElementById("buscador-titulo");
  if (!buscador) {
    console.error("Input #buscador-titulo no encontrado");
  } else {
    buscador.addEventListener("input", (evento) => {
      filtrarPorTitulo(evento.target.value);
    });
  }

  // Poblar selects iniciales (Ej. 4)
  poblarSelectsLibro();
  poblarSelectClientes();

  // Render tablas iniciales (Ej. 4)
  renderTablaLibros();
  renderTablaClientes();

  // Render catálogo inicial (Ej. 3)
  renderizarCatalogo(libros);

  // Listeners submit formularios (Ej. 4)
  const formLibro = document.getElementById("form-libro");
  if (formLibro) {
    formLibro.addEventListener("submit", handleSubmitLibro);
  }

  const formCliente = document.getElementById("form-cliente");
  if (formCliente) {
    formCliente.addEventListener("submit", handleSubmitCliente);
  }
}

// Auto-ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", inicializar);