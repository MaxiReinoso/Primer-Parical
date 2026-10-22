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

const formateadorPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2
});

function formatearPrecio(valor) {
  return formateadorPrecio.format(valor);
}

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

    article.querySelector(".libro__precio").textContent = formatearPrecio(libro.precio);

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
// ============================
// 6. Altas de libros y clientes (Ejercicio 4)
// ============================

// --- 6.1 Normalización y consultas ---

function normalizarIsbn(valor) {
  return String(valor || "").trim().replace(/[\s-]/g, "").toLowerCase();
}

function isbnExiste(isbnNormalizado) {
  return libros.some(libro => normalizarIsbn(libro.isbn) === isbnNormalizado);
}

function normalizarEmail(valor) {
  return String(valor || "").trim().toLowerCase();
}

function emailExiste(emailNormalizado) {
  return clientes.some(cliente => normalizarEmail(cliente.email) === emailNormalizado);
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || "").trim());
}

function siguienteId(coleccion, prefijo) {
  const mayor = coleccion.reduce((maximo, item) => {
    const numero = parseInt(String(item.id).replace(/^\D+/, ""), 10);
    return Number.isNaN(numero) ? maximo : Math.max(maximo, numero);
  }, 0);
  return `${prefijo}-${mayor + 1}`;
}

function generarIdLibro() {
  return siguienteId(libros, "lib");
}

function generarIdCliente() {
  return siguienteId(clientes, "cli");
}

// --- 6.2 Población de los selectores ---

function agregarOpcion(select, valor, texto) {
  const opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = texto;
  select.appendChild(opcion);
}

// Reconstruye las opciones de un select conservando la selección previa si el
// valor sigue existiendo. Es la única fuente de las opciones de los selectores
// de la vista de Ventas (contrato documentado en design.md D-05).
function poblarOpciones(select, opciones) {
  const seleccionPrevia = select.value;
  select.replaceChildren();
  opciones.forEach(opcion => agregarOpcion(select, opcion.valor, opcion.texto));
  const sigueExistiendo = Array.from(select.options).some(opcion => opcion.value === seleccionPrevia);
  if (seleccionPrevia && sigueExistiendo) {
    select.value = seleccionPrevia;
  }
}

function poblarSelectoresAlta() {
  poblarOpciones(
    document.getElementById("libro-editorial"),
    editoriales.map(editorial => ({ valor: editorial.id, texto: editorial.nombre }))
  );

  poblarOpciones(
    document.getElementById("libro-autores"),
    autores.map(autor => ({ valor: autor.id, texto: autor.nombre }))
  );

  // El género conserva la opción «Sin clasificar» (value=""), que representa
  // la ausencia de género y no un género ficticio (RN-LIB-08).
  const selectGenero = document.getElementById("libro-genero");
  Array.from(selectGenero.options).forEach(opcion => {
    if (opcion.value !== "") {
      selectGenero.removeChild(opcion);
    }
  });
  generos.forEach(genero => agregarOpcion(selectGenero, genero.id, genero.nombre));
}

function poblarSelectoresRelacionados() {
  poblarOpciones(
    document.getElementById("venta-cliente"),
    clientes.map(cliente => ({ valor: cliente.id, texto: cliente.nombre }))
  );

  poblarOpciones(
    document.getElementById("renglon-libro"),
    libros.map(libro => ({ valor: libro.id, texto: `${libro.titulo} - ${libro.isbn}` }))
  );
}

// --- 6.3 Render de los listados ---

function renderLibros() {
  const cuerpo = document.getElementById("tabla-libros-cuerpo");
  cuerpo.replaceChildren();

  libros.forEach(libro => {
    const editorial = obtenerEditorialPorId(libro.editorialId);
    const genero = obtenerGeneroPorId(libro.generoId);
    const autoresDelLibro = obtenerAutoresPorIds(libro.autorIds);
    const celdas = [
      libro.titulo,
      libro.isbn,
      editorial ? editorial.nombre : "-",
      genero ? genero.nombre : "Sin clasificar",
      autoresDelLibro.map(autor => autor.nombre).join(", "),
      formatearPrecio(libro.precio)
    ];

    const fila = document.createElement("tr");
    celdas.forEach(texto => {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });
    cuerpo.appendChild(fila);
  });
}

function renderClientes() {
  const cuerpo = document.getElementById("tabla-clientes-cuerpo");
  cuerpo.replaceChildren();

  clientes.forEach(cliente => {
    const fila = document.createElement("tr");
    [cliente.nombre, cliente.email].forEach(texto => {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });
    cuerpo.appendChild(fila);
  });
}

// --- 6.4 Validaciones ---

function validarLibro(datos) {
  const errores = [];

  if (!datos.titulo.trim()) {
    errores.push({ campo: "libro-titulo", motivo: "El título no puede estar vacío." });
  }

  if (!datos.isbn.trim()) {
    errores.push({ campo: "libro-isbn", motivo: "El ISBN no puede estar vacío." });
  } else if (isbnExiste(normalizarIsbn(datos.isbn))) {
    errores.push({ campo: "libro-isbn", motivo: `El ISBN ${datos.isbn} ya está registrado.` });
  }

  if (!Number.isFinite(datos.precio) || datos.precio <= 0) {
    errores.push({ campo: "libro-precio", motivo: "El precio debe ser un número mayor que cero." });
  }

  if (!obtenerEditorialPorId(datos.editorialId)) {
    errores.push({ campo: "libro-editorial", motivo: "La editorial seleccionada no existe." });
  }

  if (datos.autorIds.length === 0) {
    errores.push({ campo: "libro-autores", motivo: "Seleccioná al menos un autor." });
  } else if (obtenerAutoresPorIds(datos.autorIds).length !== datos.autorIds.length) {
    errores.push({ campo: "libro-autores", motivo: "Uno de los autores seleccionados no existe." });
  }

  if (datos.generoId && !obtenerGeneroPorId(datos.generoId)) {
    errores.push({ campo: "libro-genero", motivo: "El género seleccionado no existe." });
  }

  return { ok: errores.length === 0, errores };
}

function validarCliente(datos) {
  const errores = [];

  if (!datos.nombre.trim()) {
    errores.push({ campo: "cliente-nombre", motivo: "El nombre completo no puede estar vacío." });
  }

  if (!datos.email.trim()) {
    errores.push({ campo: "cliente-email", motivo: "El email no puede estar vacío." });
  } else if (!emailValido(datos.email)) {
    errores.push({ campo: "cliente-email", motivo: "El email no tiene un formato válido." });
  } else if (emailExiste(normalizarEmail(datos.email))) {
    errores.push({ campo: "cliente-email", motivo: `El email ${datos.email} ya está registrado.` });
  }

  return { ok: errores.length === 0, errores };
}

// --- 6.5 Mensajes de error y de éxito ---

function mostrarMensaje(elemento, texto) {
  elemento.textContent = texto;
  elemento.hidden = false;
}

function ocultarMensaje(elemento) {
  elemento.hidden = true;
}

function mostrarError(elementoError, elementoExito, errores) {
  mostrarMensaje(elementoError, errores[0].motivo);
  ocultarMensaje(elementoExito);
  document.getElementById(errores[0].campo).focus();
}

function mostrarExito(elementoExito, elementoError) {
  elementoExito.hidden = false;
  ocultarMensaje(elementoError);
}

// --- 6.6 Lectura de los formularios y flujos de alta ---

function leerDatosLibro() {
  const selectAutores = document.getElementById("libro-autores");
  const precioTexto = document.getElementById("libro-precio").value.trim();
  return {
    titulo: document.getElementById("libro-titulo").value.trim(),
    isbn: document.getElementById("libro-isbn").value.trim(),
    precio: precioTexto === "" ? NaN : Number(precioTexto),
    editorialId: document.getElementById("libro-editorial").value,
    generoId: document.getElementById("libro-genero").value,
    autorIds: Array.from(selectAutores.selectedOptions).map(opcion => opcion.value)
  };
}

function leerDatosCliente() {
  return {
    nombre: document.getElementById("cliente-nombre").value.trim(),
    email: document.getElementById("cliente-email").value.trim()
  };
}

function registrarLibro() {
  const formulario = document.getElementById("form-libro");
  const mensajeExito = document.getElementById("libro-mensaje-exito");
  const mensajeError = document.getElementById("libro-mensaje-error");

  const datos = leerDatosLibro();
  const validacion = validarLibro(datos);
  if (!validacion.ok) {
    mostrarError(mensajeError, mensajeExito, validacion.errores);
    return;
  }

  libros.push({
    id: generarIdLibro(),
    titulo: datos.titulo,
    isbn: datos.isbn,
    precio: datos.precio,
    editorialId: datos.editorialId,
    generoId: datos.generoId || null,
    autorIds: datos.autorIds
  });

  formulario.reset();
  mostrarExito(mensajeExito, mensajeError);
  renderLibros();
  renderCatalogo(filtrarLibros(document.getElementById("buscador-titulo").value));
  poblarSelectoresRelacionados();
}

function registrarCliente() {
  const formulario = document.getElementById("form-cliente");
  const mensajeExito = document.getElementById("cliente-mensaje-exito");
  const mensajeError = document.getElementById("cliente-mensaje-error");

  const datos = leerDatosCliente();
  const validacion = validarCliente(datos);
  if (!validacion.ok) {
    mostrarError(mensajeError, mensajeExito, validacion.errores);
    return;
  }

  clientes.push({
    id: generarIdCliente(),
    nombre: datos.nombre,
    email: datos.email
  });

  formulario.reset();
  mostrarExito(mensajeExito, mensajeError);
  renderClientes();
  poblarSelectoresRelacionados();
}

// --- 6.7 Inicialización ---

function inicializarAltas() {
  poblarSelectoresAlta();
  poblarSelectoresRelacionados();
  renderLibros();
  renderClientes();

  document.getElementById("form-libro").addEventListener("submit", evento => {
    evento.preventDefault();
    registrarLibro();
  });

  document.getElementById("form-cliente").addEventListener("submit", evento => {
    evento.preventDefault();
    registrarCliente();
  });
}

document.addEventListener("DOMContentLoaded", inicializarAltas);