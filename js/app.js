// Librería El Estante — lógica de la aplicación (Ejercicio 3 + 4 + 5)
// Catálogo dinámico, filtro por título, alta de libros y clientes, venta e historial

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
  { id: 3, nombre: "George Orwell" },
  { id: 4, nombre: "Julio Cortázar" }
];

const libros = [
  { id: 1, titulo: "El Principito", isbn: "978-950-731-456-7", precio: 12990, editorialId: 1, generoId: 1, autoresIds: [1] },
  { id: 2, titulo: "El Hobbit", isbn: "978-84-450-7342-1", precio: 18500, editorialId: 2, generoId: 1, autoresIds: [2] },
  { id: 3, titulo: "1984", isbn: "978-84-9759-327-5", precio: 14500, editorialId: 1, generoId: 1, autoresIds: [3] },
  { id: 4, titulo: "Rebelión en la granja", isbn: "978-84-450-0123-4", precio: 11200, editorialId: 2, generoId: 1, autoresIds: [3] },
  { id: 5, titulo: "El Silmarillion", isbn: "978-84-450-7128-1", precio: 22000, editorialId: 1, generoId: 1, autoresIds: [2] },
  { id: 6, titulo: "Carta a un niño que nunca nació", isbn: "978-950-731-123-4", precio: 9800, editorialId: 2, generoId: 2, autoresIds: [1] },
  // Libros agregados en el Ejercicio 5 con precios que permiten reproducir el
  // caso manual de la consigna "dos unidades a 1500 y una a 2000".
  { id: 7, titulo: "Rayuela", isbn: "978-843760457-2", precio: 2000, editorialId: 2, generoId: 1, autoresIds: [4] },
  { id: 8, titulo: "Cuentos de la selva", isbn: "978-950-654321-5", precio: 1500, editorialId: 1, generoId: 1, autoresIds: [1] }
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
 * Crea la fila que se muestra cuando una tabla no tiene datos que mostrar.
 * @param {number} colspan - Cantidad de columnas que ocupa la fila
 * @param {string} texto - Mensaje visible para el usuario
 * @returns {HTMLTableRowElement}
 */
function crearFilaVacia(colspan, texto) {
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = colspan;
  td.className = "tabla__vacia";
  td.textContent = texto;
  tr.appendChild(td);
  return tr;
}

/**
 * Renderiza la tabla de libros en #tabla-libros tbody
 */
function renderTablaLibros() {
  const tbody = document.querySelector("#tabla-libros tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (libros.length === 0) {
    tbody.appendChild(crearFilaVacia(6, "No hay libros registrados."));
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
    tbody.appendChild(crearFilaVacia(2, "No hay clientes registrados."));
    return;
  }

  for (const cliente of clientes) {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = cliente.nombre;

    const tdEmail = document.createElement("td");
    tdEmail.textContent = cliente.email;

    const tdAcciones = document.createElement("td");

    tdAcciones.textContent = "—";

    tr.append(tdNombre, tdEmail);
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
// 9. ESTADO DE VENTAS Y CÁLCULOS (Ejercicio 5)
// ============================================================

// Ventas confirmadas. Cada venta guarda sus propios importes: el precio
// unitario se copia al renglón como valor histórico y no vuelve a leerse
// del catálogo al consultar el historial.
const ventas = [];

// Renglones de la venta en curso, todavía sin confirmar.
let renglonesVenta = [];

// Índice del renglón que se está editando (cantidad), o null si no hay edición.
let indiceRenglonEnEdicion = null;

/**
 * Calcula el subtotal de un renglón: cantidad × precio unitario.
 * @param {Object} renglon
 * @returns {number}
 */
function calcularSubtotal(renglon) {
  return renglon.cantidad * renglon.precioUnitario;
}

/**
 * Calcula el total de una venta: suma de los subtotales de sus renglones.
 * @param {Object[]} renglones
 * @returns {number}
 */
function calcularTotal(renglones) {
  return renglones.reduce((total, renglon) => total + calcularSubtotal(renglon), 0);
}

/**
 * Crea un renglón a partir de un libro del catálogo.
 * El precio unitario se COPIA desde el catálogo: a partir de este momento
 * el renglón conserva ese valor aunque el precio del libro cambie.
 * @param {Object} libro
 * @param {number} cantidad
 * @returns {Object}
 */
function crearRenglon(libro, cantidad) {
  return {
    libroId: libro.id,
    titulo: libro.titulo,
    cantidad,
    precioUnitario: libro.precio
  };
}

/**
 * Busca el renglón de un libro dentro de la venta en curso.
 * @param {number} libroId
 * @returns {Object|undefined}
 */
function buscarRenglon(libroId) {
  return renglonesVenta.find(renglon => renglon.libroId === libroId);
}

/**
 * Formatea el identificador numérico de una venta como código de negocio.
 * @param {number} id
 * @returns {string}
 */
function formatearCodigoVenta(id) {
  return `V-${String(id).padStart(3, "0")}`;
}

/**
 * Formatea una fecha ISO como fecha y hora legibles.
 * @param {string} fechaIso
 * @returns {string}
 */
function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso);
  if (isNaN(fecha.getTime())) return "";
  return fecha.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

// ============================================================
// 10. VALIDACIONES DE VENTA (Ejercicio 5)
// ============================================================

/**
 * Valida los datos de un renglón antes de agregarlo a la venta.
 * @param {{libroId: string, cantidad: string}} datos
 * @returns {{valido: boolean, errores: string[]}}
 */
function validarRenglon(datos) {
  const errores = [];

  // 1. Libro seleccionado y existente en el catálogo
  const libroId = Number(datos.libroId);
  if (!libroId || isNaN(libroId)) {
    errores.push("Seleccioná un libro.");
  } else if (!libros.some(libro => libro.id === libroId)) {
    errores.push("El libro seleccionado no existe en el catálogo.");
  }

  // 2. Cantidad presente, entera y mayor que cero
  const cantidadCruda = (datos.cantidad ?? "").toString().trim();
  const cantidad = Number(cantidadCruda);
  if (cantidadCruda === "") {
    errores.push("Ingresá una cantidad.");
  } else if (!Number.isInteger(cantidad)) {
    errores.push("La cantidad debe ser un número entero.");
  } else if (cantidad <= 0) {
    errores.push("La cantidad debe ser mayor que cero.");
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

/**
 * Valida la venta completa antes de confirmarla.
 * @param {{clienteId: string}} datos
 * @returns {{valido: boolean, errores: string[]}}
 */
function validarVenta(datos) {
  const errores = [];

  // 1. Cliente seleccionado y existente en los datos locales
  const clienteId = Number(datos.clienteId);
  if (!clienteId || isNaN(clienteId)) {
    errores.push("Seleccioná un cliente.");
  } else if (!clientes.some(cliente => cliente.id === clienteId)) {
    errores.push("El cliente seleccionado no existe.");
  }

  // 2. Al menos un renglón
  if (renglonesVenta.length === 0) {
    errores.push("Agregá al menos un renglón a la venta.");
  }

  // 3. Todas las cantidades válidas
  const hayCantidadInvalida = renglonesVenta.some(
    renglon => !Number.isInteger(renglon.cantidad) || renglon.cantidad <= 0
  );
  if (hayCantidadInvalida) {
    errores.push("Todas las cantidades deben ser números enteros mayores que cero.");
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

// ============================================================
// 11. RENDER DE VENTAS E HISTORIAL (Ejercicio 5)
// ============================================================

/**
 * Muestra un mensaje junto al área de renglones.
 * @param {string} texto
 * @param {boolean} esError
 */
function mostrarMensajeRenglon(texto, esError) {
  const exito = document.getElementById("renglon-mensaje-exito");
  const error = document.getElementById("renglon-mensaje-error");

  if (exito) exito.hidden = true;
  if (error) error.hidden = true;

  const destino = esError ? error : exito;
  if (destino) {
    destino.textContent = texto;
    destino.hidden = false;
  }
}

/**
 * Renderiza la tabla de renglones de la venta en curso.
 * Si un renglón está en edición, su celda de cantidad muestra un input.
 */
function renderTablaRenglones() {
  const tbody = document.querySelector("#tabla-renglones tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (renglonesVenta.length === 0) {
    tbody.appendChild(crearFilaVacia(5, "Todavía no agregaste renglones a la venta."));
    renderTotalVenta();
    return;
  }

  const plantilla = document.getElementById("plantilla-renglon");
  if (!plantilla) {
    console.error("Plantilla #plantilla-renglon no encontrada");
    return;
  }

  renglonesVenta.forEach((renglon, indice) => {
    const fragment = plantilla.content.cloneNode(true);
    const fila = fragment.querySelector(".fila-renglon");
    if (!fila) return;

    const enEdicion = indice === indiceRenglonEnEdicion;

    fila.querySelector(".fila-renglon__libro").textContent = renglon.titulo;

    const celdaCantidad = fila.querySelector(".fila-renglon__cantidad");
    if (enEdicion) {
      celdaCantidad.textContent = "";
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.step = "1";
      input.className = "renglon-cantidad-input";
      input.value = String(renglon.cantidad);
      input.setAttribute("aria-label", `Cantidad de ${renglon.titulo}`);
      input.addEventListener("keydown", evento => {
        if (evento.key === "Enter") {
          evento.preventDefault();
          handleGuardarCantidad(indice, fila);
        }
      });
      celdaCantidad.appendChild(input);
    } else {
      celdaCantidad.textContent = renglon.cantidad;
    }

    fila.querySelector(".fila-renglon__precio-unitario").textContent = formatearPrecio(renglon.precioUnitario);
    fila.querySelector(".fila-renglon__subtotal").textContent = formatearPrecio(calcularSubtotal(renglon));

    const celdaAcciones = fila.querySelector(".fila-renglon__acciones");

    const botonQuitar = celdaAcciones.querySelector(".boton--quitar");
    botonQuitar.addEventListener("click", () => handleQuitarRenglon(indice));

    const botonModificar = celdaAcciones.querySelector(".boton--modificar");
    if (enEdicion) {
      botonModificar.textContent = "Guardar cantidad";
      botonModificar.classList.remove("boton--modificar");
      botonModificar.classList.add("boton--guardar");
      botonModificar.addEventListener("click", () => handleGuardarCantidad(indice, fila));

      const botonCancelar = document.createElement("button");
      botonCancelar.type = "button";
      botonCancelar.className = "boton boton--secundario";
      botonCancelar.textContent = "Cancelar";
      botonCancelar.addEventListener("click", handleCancelarEdicion);
      celdaAcciones.appendChild(botonCancelar);
    } else {
      botonModificar.addEventListener("click", () => handleModificarRenglon(indice));
    }

    tbody.appendChild(fragment);
  });

  renderTotalVenta();
}

/**
 * Actualiza el total de la venta en curso.
 */
function renderTotalVenta() {
  const output = document.getElementById("venta-total");
  if (!output) return;
  output.textContent = formatearPrecio(calcularTotal(renglonesVenta));
}

/**
 * Renderiza la tabla del historial de ventas confirmadas.
 * Las ventas no se editan ni se eliminan: solo se consultan.
 */
function renderTablaHistorial() {
  const tbody = document.querySelector("#tabla-historial tbody");
  const vacio = document.getElementById("historial-vacio");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (ventas.length === 0) {
    if (vacio) vacio.hidden = false;
    return;
  }

  if (vacio) vacio.hidden = true;

  // La venta más reciente aparece primero.
  const ventasOrdenadas = [...ventas].reverse();

  for (const venta of ventasOrdenadas) {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = formatearCodigoVenta(venta.id);

    const tdFecha = document.createElement("td");
    tdFecha.textContent = formatearFecha(venta.fecha);

    const tdCliente = document.createElement("td");
    tdCliente.textContent = venta.clienteNombre;

    const tdTotal = document.createElement("td");
    tdTotal.textContent = formatearPrecio(venta.total);

    const tdAcciones = document.createElement("td");
    tdAcciones.className = "historial__acciones";
    const botonDetalle = document.createElement("button");
    botonDetalle.type = "button";
    botonDetalle.className = "boton boton--secundario";
    botonDetalle.textContent = "Ver detalle";
    botonDetalle.setAttribute("aria-label", `Ver detalle de la venta ${formatearCodigoVenta(venta.id)}`);
    botonDetalle.addEventListener("click", () => renderDetalleVenta(venta));
    tdAcciones.appendChild(botonDetalle);

    tr.append(tdId, tdFecha, tdCliente, tdTotal, tdAcciones);
    tbody.appendChild(tr);
  }
}

/**
 * Muestra el detalle de una venta: encabezado y renglones.
 * Los importes salen de la venta guardada, nunca del catálogo actual.
 * @param {Object|null} venta
 */
function renderDetalleVenta(venta) {
  const tbody = document.querySelector("#tabla-detalle tbody");
  const vacio = document.getElementById("historial-detalle-vacio");
  const resumen = document.getElementById("historial-detalle-resumen");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!venta) {
    if (vacio) vacio.hidden = false;
    if (resumen) {
      resumen.textContent = "";
      resumen.hidden = true;
    }
    return;
  }

  if (vacio) vacio.hidden = true;

  if (resumen) {
    resumen.hidden = false;
    resumen.textContent =
      `Venta ${formatearCodigoVenta(venta.id)} — ${formatearFecha(venta.fecha)} — ` +
      `${venta.clienteNombre} — Total ${formatearPrecio(venta.total)}`;
  }

  for (const renglon of venta.renglones) {
    const tr = document.createElement("tr");

    const tdLibro = document.createElement("td");
    tdLibro.textContent = renglon.titulo;

    const tdCantidad = document.createElement("td");
    tdCantidad.textContent = renglon.cantidad;

    const tdPrecioUnitario = document.createElement("td");
    tdPrecioUnitario.textContent = formatearPrecio(renglon.precioUnitario);

    const tdSubtotal = document.createElement("td");
    tdSubtotal.textContent = formatearPrecio(renglon.subtotal);

    tr.append(tdLibro, tdCantidad, tdPrecioUnitario, tdSubtotal);
    tbody.appendChild(tr);
  }
}

// ============================================================
// 12. HANDLERS DE VENTA E HISTORIAL (Ejercicio 5)
// ============================================================

/**
 * Agrega un renglón a la venta en curso.
 * Si el libro ya está en la venta, se modifica la cantidad del renglón
 * existente en lugar de crear un renglón repetido.
 */
function handleAgregarRenglon() {
  const selectLibro = document.getElementById("renglon-libro");
  const inputCantidad = document.getElementById("renglon-cantidad");
  if (!selectLibro || !inputCantidad) return;

  const datos = {
    libroId: selectLibro.value,
    cantidad: inputCantidad.value.trim()
  };

  const { valido, errores } = validarRenglon(datos);
  if (!valido) {
    mostrarMensajeRenglon(errores.join(" "), true);
    return;
  }

  const libro = libros.find(item => item.id === Number(datos.libroId));
  const cantidad = Number(datos.cantidad);
  const renglonExistente = buscarRenglon(libro.id);

  if (renglonExistente) {
    renglonExistente.cantidad += cantidad;
  } else {
    renglonesVenta.push(crearRenglon(libro, cantidad));
  }

  indiceRenglonEnEdicion = null;
  inputCantidad.value = "";
  renderTablaRenglones();

  if (renglonExistente) {
    mostrarMensajeRenglon(
      `«${libro.titulo}» ya estaba en la venta: se sumó la cantidad al renglón existente.`,
      false
    );
  } else {
    mostrarMensajeRenglon(`Renglón agregado: ${libro.titulo}.`, false);
  }
}

/**
 * Quita un renglón de la venta en curso.
 * @param {number} indice
 */
function handleQuitarRenglon(indice) {
  const renglon = renglonesVenta[indice];
  if (!renglon) return;

  renglonesVenta.splice(indice, 1);

  if (indiceRenglonEnEdicion === indice) {
    indiceRenglonEnEdicion = null;
  } else if (indiceRenglonEnEdicion !== null && indiceRenglonEnEdicion > indice) {
    indiceRenglonEnEdicion -= 1;
  }

  renderTablaRenglones();
  mostrarMensajeRenglon(`Renglón quitado: ${renglon.titulo}.`, false);
}

/**
 * Pone un renglón en modo edición para cambiar su cantidad.
 * @param {number} indice
 */
function handleModificarRenglon(indice) {
  indiceRenglonEnEdicion = indice;
  renderTablaRenglones();

  const input = document.querySelector("#tabla-renglones .renglon-cantidad-input");
  if (input) {
    input.focus();
    input.select();
  }
}

/**
 * Guarda la cantidad editada de un renglón.
 * @param {number} indice
 * @param {HTMLElement} fila - Fila del renglón en edición
 */
function handleGuardarCantidad(indice, fila) {
  const input = fila.querySelector(".renglon-cantidad-input");
  const valor = input ? input.value.trim() : "";
  const cantidad = Number(valor);

  if (valor === "" || !Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarMensajeRenglon("La cantidad debe ser un número entero mayor que cero.", true);
    return;
  }

  renglonesVenta[indice].cantidad = cantidad;
  indiceRenglonEnEdicion = null;
  renderTablaRenglones();
  mostrarMensajeRenglon("Cantidad actualizada.", false);
}

/**
 * Cancela la edición de la cantidad de un renglón.
 */
function handleCancelarEdicion() {
  indiceRenglonEnEdicion = null;
  renderTablaRenglones();
}

/**
 * Confirma la venta: la registra en el historial y limpia el formulario.
 * @param {Event} evento
 */
function handleSubmitVenta(evento) {
  evento.preventDefault();

  const form = evento.target;
  const mensajeExito = document.getElementById("venta-mensaje-exito");
  const mensajeError = document.getElementById("venta-mensaje-error");

  if (mensajeExito) mensajeExito.hidden = true;
  if (mensajeError) mensajeError.hidden = true;

  const selectCliente = document.getElementById("venta-cliente");
  const clienteId = selectCliente ? selectCliente.value : "";

  const { valido, errores } = validarVenta({ clienteId });
  if (!valido) {
    if (mensajeError) {
      mensajeError.textContent = errores.join(" ");
      mensajeError.hidden = false;
    }
    return;
  }

  const cliente = clientes.find(item => item.id === Number(clienteId));

  const venta = {
    id: generarId(ventas),
    fecha: new Date().toISOString(),
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    clienteEmail: cliente.email,
    renglones: renglonesVenta.map(renglon => ({
      libroId: renglon.libroId,
      titulo: renglon.titulo,
      cantidad: renglon.cantidad,
      precioUnitario: renglon.precioUnitario,
      subtotal: calcularSubtotal(renglon)
    })),
    total: calcularTotal(renglonesVenta)
  };

  ventas.push(venta);

  // Limpiar la venta en curso para poder cargar una nueva.
  renglonesVenta = [];
  indiceRenglonEnEdicion = null;
  form.reset();
  renderTablaRenglones();
  renderTotalVenta();

  // Refrescar el historial y mostrar el detalle de la venta recién confirmada.
  renderTablaHistorial();
  renderDetalleVenta(venta);

  if (mensajeExito) {
    mensajeExito.textContent = `Venta registrada correctamente. Identificador ${formatearCodigoVenta(venta.id)}.`;
    mensajeExito.hidden = false;
  }
}

// ============================================================
// 13. INICIALIZACIÓN
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

  // Listeners de venta (Ej. 5)
  const formVenta = document.getElementById("form-venta");
  if (formVenta) {
    formVenta.addEventListener("submit", handleSubmitVenta);
  }

  const botonAgregarRenglon = document.getElementById("boton-agregar-renglon");
  if (botonAgregarRenglon) {
    botonAgregarRenglon.addEventListener("click", handleAgregarRenglon);
  }

  // Enter en la cantidad agrega el renglón en lugar de confirmar la venta.
  const inputCantidad = document.getElementById("renglon-cantidad");
  if (inputCantidad) {
    inputCantidad.addEventListener("keydown", evento => {
      if (evento.key === "Enter") {
        evento.preventDefault();
        handleAgregarRenglon();
      }
    });
  }

  // Render inicial de venta e historial (Ej. 5)
  renderTablaRenglones();
  renderTotalVenta();
  renderTablaHistorial();
  renderDetalleVenta(null);
}

// Auto-ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", inicializar);