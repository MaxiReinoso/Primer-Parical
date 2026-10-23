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
  guardarEstado();
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
  guardarEstado();
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

// ============================
// 7. Ventas e historial (Ejercicio 5)
// ============================

// --- 7.1 Estado de la venta ---

const ventas = [];
const ventaEnCurso = { clienteId: null, renglones: [] };

function generarIdVenta() {
  return siguienteId(ventas, "ven");
}

function calcularSubtotal(renglon) {
  return renglon.cantidad * renglon.precioUnitario;
}

function calcularTotal(renglones) {
  return renglones.reduce((total, renglon) => total + calcularSubtotal(renglon), 0);
}

// --- 7.2 Render de los renglones en curso ---

function renderRenglonesEnCurso() {
  const cuerpo = document.getElementById("tabla-renglones-cuerpo");
  const plantilla = document.getElementById("plantilla-renglon");

  cuerpo.replaceChildren();

  ventaEnCurso.renglones.forEach((renglon, indice) => {
    const clone = plantilla.content.cloneNode(true);
    const fila = clone.querySelector(".fila-renglon");

    fila.querySelector(".fila-renglon__libro").textContent = renglon.titulo;
    fila.querySelector(".fila-renglon__cantidad").textContent = String(renglon.cantidad);
    fila.querySelector(".fila-renglon__precio-unitario").textContent = formatearPrecio(renglon.precioUnitario);
    fila.querySelector(".fila-renglon__subtotal").textContent = formatearPrecio(renglon.subtotal);

    fila.querySelector(".boton--quitar").addEventListener("click", () => quitarRenglon(indice));
    fila.querySelector(".boton--modificar").addEventListener("click", () => modificarRenglon(indice));

    cuerpo.appendChild(clone);
  });

  document.getElementById("venta-total").textContent = formatearPrecio(calcularTotal(ventaEnCurso.renglones));
}

// --- 7.3 Agregar, modificar y quitar renglones ---

function agregarRenglon() {
  const mensajeExito = document.getElementById("venta-mensaje-exito");
  const mensajeError = document.getElementById("venta-mensaje-error");
  const libroId = document.getElementById("renglon-libro").value;
  const cantidadTexto = document.getElementById("renglon-cantidad").value.trim();
  const cantidad = cantidadTexto === "" ? NaN : Number(cantidadTexto);
  const libro = obtenerLibroPorId(libroId);

  if (!libro) {
    mostrarError(mensajeError, mensajeExito, [
      { motivo: "Seleccioná un libro válido.", campo: "renglon-libro" }
    ]);
    return;
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarError(mensajeError, mensajeExito, [
      { motivo: "La cantidad debe ser un número entero mayor que cero.", campo: "renglon-cantidad" }
    ]);
    return;
  }

  const existente = ventaEnCurso.renglones.find(renglon => renglon.libroId === libroId);

  if (existente) {
    existente.cantidad += cantidad;
    existente.subtotal = calcularSubtotal(existente);
    renderRenglonesEnCurso();
    mostrarMensaje(mensajeExito, `Se sumó la cantidad al renglón existente de "${libro.titulo}".`);
    ocultarMensaje(mensajeError);
    return;
  }

  ventaEnCurso.renglones.push({
    libroId: libro.id,
    titulo: libro.titulo,
    isbn: libro.isbn,
    precioUnitario: libro.precio,
    cantidad,
    subtotal: cantidad * libro.precio
  });
  ventaEnCurso.clienteId = document.getElementById("venta-cliente").value;
  document.getElementById("renglon-cantidad").value = "";

  ocultarMensaje(mensajeExito);
  ocultarMensaje(mensajeError);
  renderRenglonesEnCurso();
}

function modificarRenglon(indice) {
  const mensajeExito = document.getElementById("venta-mensaje-exito");
  const mensajeError = document.getElementById("venta-mensaje-error");
  const renglon = ventaEnCurso.renglones[indice];
  if (!renglon) return;

  const respuesta = window.prompt("Ingresá la nueva cantidad:", String(renglon.cantidad));
  if (respuesta === null) return;

  const cantidadTexto = String(respuesta).trim();
  const cantidad = cantidadTexto === "" ? NaN : Number(cantidadTexto);

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarError(mensajeError, mensajeExito, [
      { motivo: "La cantidad debe ser un número entero mayor que cero.", campo: "renglon-cantidad" }
    ]);
    return;
  }

  renglon.cantidad = cantidad;
  renglon.subtotal = calcularSubtotal(renglon);
  ocultarMensaje(mensajeError);
  renderRenglonesEnCurso();
}

function quitarRenglon(indice) {
  if (indice < 0 || indice >= ventaEnCurso.renglones.length) return;
  ventaEnCurso.renglones.splice(indice, 1);
  renderRenglonesEnCurso();
}

// --- 7.4 Confirmación de la venta ---

function confirmarVenta() {
  const mensajeExito = document.getElementById("venta-mensaje-exito");
  const mensajeError = document.getElementById("venta-mensaje-error");
  const clienteId = document.getElementById("venta-cliente").value;
  const cliente = obtenerClientes().find(item => item.id === clienteId);

  if (!clienteId || !cliente) {
    mostrarError(mensajeError, mensajeExito, [
      { motivo: "Seleccioná un cliente válido.", campo: "venta-cliente" }
    ]);
    return;
  }

  if (ventaEnCurso.renglones.length === 0) {
    mostrarError(mensajeError, mensajeExito, [
      { motivo: "Agregá al menos un renglón a la venta.", campo: "renglon-libro" }
    ]);
    return;
  }

  const cantidadInvalida = ventaEnCurso.renglones.some(
    renglon => !Number.isInteger(renglon.cantidad) || renglon.cantidad <= 0
  );
  if (cantidadInvalida) {
    mostrarError(mensajeError, mensajeExito, [
      { motivo: "Las cantidades deben ser números enteros mayores que cero.", campo: "renglon-cantidad" }
    ]);
    return;
  }

  const renglones = ventaEnCurso.renglones.map(renglon => ({
    libroId: renglon.libroId,
    titulo: renglon.titulo,
    isbn: renglon.isbn,
    precioUnitario: renglon.precioUnitario,
    cantidad: renglon.cantidad,
    subtotal: renglon.subtotal
  }));

  const venta = {
    id: generarIdVenta(),
    fecha: new Date().toISOString(),
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    renglones,
    total: calcularTotal(renglones)
  };
  ventas.push(venta);
  guardarEstado();

  ventaEnCurso.clienteId = null;
  ventaEnCurso.renglones = [];
  document.getElementById("tabla-renglones-cuerpo").replaceChildren();
  document.getElementById("renglon-cantidad").value = "";
  document.getElementById("venta-total").textContent = formatearPrecio(0);

  mostrarExito(mensajeExito, mensajeError);
  renderHistorial();
}

// --- 7.5 Historial y detalle ---

function renderHistorial() {
  const cuerpo = document.getElementById("tabla-historial-cuerpo");
  const vacio = document.getElementById("historial-vacio");

  cuerpo.replaceChildren();

  ventas.slice().reverse().forEach(venta => {
    const fila = document.createElement("tr");

    [venta.id, venta.fecha, venta.clienteNombre, formatearPrecio(venta.total)].forEach(texto => {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });

    const celdaDetalle = document.createElement("td");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton boton--secundario";
    boton.textContent = "Ver detalle";
    boton.addEventListener("click", () => renderDetalleVenta(venta));
    celdaDetalle.appendChild(boton);
    fila.appendChild(celdaDetalle);

    cuerpo.appendChild(fila);
  });

  vacio.hidden = ventas.length > 0;
}

function renderDetalleVenta(venta) {
  const cuerpo = document.getElementById("tabla-detalle-cuerpo");
  const vacio = document.getElementById("historial-detalle-vacio");

  cuerpo.replaceChildren();

  venta.renglones.forEach(renglon => {
    const fila = document.createElement("tr");
    [
      renglon.titulo,
      String(renglon.cantidad),
      formatearPrecio(renglon.precioUnitario),
      formatearPrecio(renglon.subtotal)
    ].forEach(texto => {
      const celda = document.createElement("td");
      celda.textContent = texto;
      fila.appendChild(celda);
    });
    cuerpo.appendChild(fila);
  });

  vacio.hidden = true;
}

// --- 7.6 Inicialización ---

function inicializarVentas() {
  document.getElementById("form-venta").noValidate = true;

  document.getElementById("form-venta").addEventListener("submit", evento => {
    evento.preventDefault();
    confirmarVenta();
  });

  document.getElementById("boton-agregar-renglon").addEventListener("click", () => {
    agregarRenglon();
  });

  ocultarMensaje(document.getElementById("venta-mensaje-exito"));
  ocultarMensaje(document.getElementById("venta-mensaje-error"));
  document.getElementById("historial-detalle-vacio").hidden = false;
  document.getElementById("tabla-detalle-cuerpo").replaceChildren();

  poblarSelectoresRelacionados();
  renderRenglonesEnCurso();
  renderHistorial();
}

document.addEventListener("DOMContentLoaded", inicializarVentas);

// ============================
// 8. Persistencia local (Ejercicio 6)
// ============================

const CLAVE_ESTADO = "libreria-el-estante:v1";

function reemplazarContenido(coleccion, nuevos) {
  coleccion.splice(0, coleccion.length, ...nuevos);
}

function esTextoNoVacio(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function esNumeroFinito(valor) {
  return typeof valor === "number" && Number.isFinite(valor);
}

function normalizarLibro(valor) {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return null;

  const generoId = valor.generoId === undefined ? null : valor.generoId;

  if (
    !esTextoNoVacio(valor.id) ||
    !esTextoNoVacio(valor.titulo) ||
    !esTextoNoVacio(valor.isbn) ||
    !esTextoNoVacio(valor.editorialId) ||
    !esNumeroFinito(valor.precio) ||
    valor.precio <= 0 ||
    !(generoId === null || typeof generoId === "string") ||
    !Array.isArray(valor.autorIds) ||
    !valor.autorIds.every(esTextoNoVacio)
  ) {
    return null;
  }

  return {
    id: valor.id,
    titulo: valor.titulo,
    isbn: valor.isbn,
    precio: valor.precio,
    editorialId: valor.editorialId,
    generoId,
    autorIds: [...valor.autorIds]
  };
}

function normalizarCliente(valor) {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return null;

  if (!esTextoNoVacio(valor.id) || !esTextoNoVacio(valor.nombre) || !esTextoNoVacio(valor.email)) {
    return null;
  }

  return { id: valor.id, nombre: valor.nombre, email: valor.email };
}

function normalizarRenglon(valor) {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return null;

  if (
    !esTextoNoVacio(valor.libroId) ||
    !Number.isInteger(valor.cantidad) ||
    valor.cantidad <= 0 ||
    !esNumeroFinito(valor.precioUnitario) ||
    !esNumeroFinito(valor.subtotal)
  ) {
    return null;
  }

  return {
    libroId: valor.libroId,
    titulo: typeof valor.titulo === "string" ? valor.titulo : "",
    isbn: typeof valor.isbn === "string" ? valor.isbn : "",
    cantidad: valor.cantidad,
    precioUnitario: valor.precioUnitario,
    subtotal: valor.subtotal
  };
}

function normalizarVenta(valor) {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) return null;

  if (
    !esTextoNoVacio(valor.id) ||
    !esTextoNoVacio(valor.fecha) ||
    !Array.isArray(valor.renglones) ||
    valor.renglones.length === 0 ||
    !esNumeroFinito(valor.total)
  ) {
    return null;
  }

  const renglones = [];
  for (const renglon of valor.renglones) {
    const normalizado = normalizarRenglon(renglon);
    if (!normalizado) return null;
    renglones.push(normalizado);
  }

  return {
    id: valor.id,
    fecha: valor.fecha,
    clienteId: typeof valor.clienteId === "string" ? valor.clienteId : null,
    clienteNombre: typeof valor.clienteNombre === "string" ? valor.clienteNombre : "",
    renglones,
    total: valor.total
  };
}

function normalizarEstado(valor) {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    return { estado: null, valido: false, motivo: "La raíz del estado no es un objeto." };
  }

  if (!Array.isArray(valor.libros) || !Array.isArray(valor.clientes) || !Array.isArray(valor.ventas)) {
    return { estado: null, valido: false, motivo: "libros, clientes y ventas deben ser arrays." };
  }

  return {
    estado: {
      libros: valor.libros.map(normalizarLibro).filter(Boolean),
      clientes: valor.clientes.map(normalizarCliente).filter(Boolean),
      ventas: valor.ventas.map(normalizarVenta).filter(Boolean)
    },
    valido: true,
    motivo: ""
  };
}

function informarProblemaPersistencia(motivo) {
  let aviso = document.querySelector("[data-persistencia]");

  if (!aviso) {
    aviso = document.createElement("p");
    aviso.className = "mensaje mensaje--error";
    aviso.setAttribute("role", "alert");
    aviso.setAttribute("data-persistencia", "true");
    const pie = document.querySelector(".pie");
    if (pie) {
      pie.appendChild(aviso);
    } else {
      document.body.appendChild(aviso);
    }
  }

  aviso.textContent = motivo;
  aviso.hidden = false;
}

function leerEstadoCrudo() {
  try {
    return { crudo: localStorage.getItem(CLAVE_ESTADO), error: null };
  } catch (error) {
    return { crudo: null, error };
  }
}

function cargarEstado() {
  const lectura = leerEstadoCrudo();

  if (lectura.error) {
    const nombre = lectura.error && lectura.error.name ? lectura.error.name : "error desconocido";
    informarProblemaPersistencia(
      "No se pudo leer el almacenamiento local: los datos no se conservarán entre recargas."
    );
    console.warn(`[persistencia] Lectura fallida (${nombre}).`);
    return;
  }

  if (lectura.crudo === null) return;

  let valor;
  try {
    valor = JSON.parse(lectura.crudo);
  } catch (error) {
    console.warn("[persistencia] El estado guardado no es JSON válido; se usan los datos iniciales.");
    return;
  }

  const resultado = normalizarEstado(valor);
  if (!resultado.valido) {
    console.warn(`[persistencia] Estado descartado: ${resultado.motivo}`);
    return;
  }

  reemplazarContenido(libros, resultado.estado.libros);
  reemplazarContenido(clientes, resultado.estado.clientes);
  reemplazarContenido(ventas, resultado.estado.ventas);
}

function guardarEstado() {
  try {
    localStorage.setItem(CLAVE_ESTADO, JSON.stringify({ libros, clientes, ventas }));
  } catch (error) {
    const nombre = error && error.name ? error.name : "desconocido";
    const motivo =
      nombre === "QuotaExceededError"
        ? "No se pudo guardar: se superó la cuota del almacenamiento local. El cambio sigue disponible en esta sesión."
        : "No se pudo guardar el estado en el almacenamiento local. El cambio sigue disponible en esta sesión.";
    informarProblemaPersistencia(motivo);
    console.warn(`[persistencia] Escritura fallida (${nombre}).`);
  }
}

cargarEstado();