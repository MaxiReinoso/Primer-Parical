# Resumen de implementación — Ejercicio 5: Venta simulada e historial

Proyecto: **Primer Parcial — Programación III: Frontend de una librería (Ejercicio 5)**
Fase: **3 (IMPLEMENTACIÓN) completada.**
Fecha de redacción: 2026-10-21.

> Este ejercicio se implementó directamente sobre la rama `entrega` (merge de `main` + `Parte-4`), sin
> un documento de SPEC/PLAN previo: la consigna ya fijaba el alcance y el HTML del Ejercicio 1 ya traía
> la estructura de las vistas Ventas e Historial maquetada. Este documento cumple el rol de registro de
> implementación y de evidencia de verificación.

---

## 1. Resumen de cambios

| Archivo | Cambio | Detalle |
|---|---|---|
| `index.html` | +5 líneas | Se agregaron `#renglon-mensaje-exito` y `#renglon-mensaje-error` (mensajes del área de renglones) y `#historial-detalle-resumen` (encabezado de la venta seleccionada). No se modificó la estructura de las vistas ni la plantilla `#plantilla-renglon`. |
| `js/app.js` | +624 / −21 líneas | Cuatro secciones nuevas (9 a 12) con el estado de ventas, los cálculos, las validaciones, el render y los handlers. Se renumeró la sección de inicialización a 13. |
| `js/app.js` | Refactor menor | Se extrajo `crearFilaVacia(colspan, texto)`, compartido por las tres tablas con estado vacío. Sustituye los estilos inline duplicados que quedaban en `renderTablaLibros` y `renderTablaClientes`. Comportamiento idéntico. |
| `js/app.js` | Datos de prueba | Se agregaron 2 libros (`Rayuela` a $2.000 y `Cuentos de la selva` a $1.500) y 1 autor (Julio Cortázar). Motivo: la consigna exige registrar el caso manual «Venta válida: dos unidades a 1500 y una a 2000 → subtotales 3000 y 2000; total 5000». Sin esos precios el caso no es reproducible con los datos que trae el proyecto. El conjunto inicial pasa de 6 a 8 libros (la consigna pide «al menos seis»). |
| `css/componentes.css` | +44 líneas | `.tabla__vacia`, `.renglon-cantidad-input`, `.historial__acciones`, `.detalle-venta__resumen` y `.boton--guardar`. No se modificó ninguna regla existente. |
| `fix.js`, `fix.py`, `fix_render.py` | eliminados | Andamiaje de un solo uso que parcheaba `renderTablaClientes`. No los referencia ningún archivo del proyecto y la consigna pide entregar solo `index.html`, CSS, JS, recursos y `README.md`. |

### 1.1 Funciones agregadas

| Función | Responsabilidad |
|---|---|
| `calcularSubtotal(renglon)` | Subtotal = cantidad × precio unitario. |
| `calcularTotal(renglones)` | Total = suma de los subtotales. |
| `crearRenglon(libro, cantidad)` | Crea el renglón **copiando** el precio del catálogo (`precioUnitario`) y el título. |
| `buscarRenglon(libroId)` | Localiza el renglón de un libro en la venta en curso. |
| `formatearCodigoVenta(id)` | `1` → `V-001` (formato de negocio en la interfaz). |
| `formatearFecha(fechaIso)` | Fecha ISO → `21/10/26, 5:06 p. m.` (formato `es-AR`). |
| `validarRenglon(datos)` | Libro existente + cantidad entera mayor que cero. |
| `validarVenta(datos)` | Cliente existente + al menos un renglón + cantidades válidas. |
| `mostrarMensajeRenglon(texto, esError)` | Mensaje de éxito o error del área de renglones. |
| `renderTablaRenglones()` | Renderiza los renglones; en modo edición la celda de cantidad se reemplaza por un input. |
| `renderTotalVenta()` | Actualiza `#venta-total`. |
| `renderTablaHistorial()` | Renderiza el historial (id, fecha, cliente, total, botón «Ver detalle»). |
| `renderDetalleVenta(venta)` | Muestra el encabezado y los renglones de una venta. |
| `handleAgregarRenglon()` | Agrega un renglón; si el libro ya está, suma la cantidad al renglón existente. |
| `handleQuitarRenglon(indice)` | Quita un renglón. |
| `handleModificarRenglon(indice)` | Pone un renglón en modo edición. |
| `handleGuardarCantidad(indice, fila)` | Valida y guarda la cantidad editada. |
| `handleCancelarEdicion()` | Cancela la edición. |
| `handleSubmitVenta(evento)` | Valida, registra la venta en el historial y limpia el formulario. |

---

## 2. Decisiones de diseño

| Clave | Decisión | Motivo |
|---|---|---|
| **D1** | **Libro repetido → se suma la cantidad al renglón existente** y se informa con un mensaje. | La consigna permite las dos salidas («se modifica la cantidad del renglón existente o se informa el duplicado»). Se hacen ambas: nunca hay dos renglones del mismo libro y el usuario sabe qué pasó. |
| **D2** | **El precio unitario se congela al crear el renglón.** La venta guarda `precioUnitario`, `subtotal` y `total` por renglón. | Requisito explícito de la consigna: «el precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial». `renderDetalleVenta` lee únicamente la venta guardada, nunca `libros`. |
| **D3** | **Identificador numérico en el modelo (`id: 1`) y código de negocio en la interfaz (`V-001`).** | Permite reutilizar `generarId(ventas)` y mostrar un identificador legible. El `id` persistido en `localStorage` (Ejercicio 6) es el numérico. |
| **D4** | **La cantidad se edita en línea, dentro de la fila** (el input reemplaza la celda y el botón pasa a «Guardar cantidad», con un «Cancelar»). | La consigna pide «permitir cambiar cantidades» antes de confirmar. Editar en la fila evita tener que elegir de nuevo el libro y el cliente. |
| **D5** | **La fecha se guarda en ISO y se muestra en `es-AR`.** | El modelo queda serializable (requisito para el Ejercicio 6) y la interfaz muestra un formato local legible. |
| **D6** | **El historial se muestra de la venta más reciente a la más antigua.** | Es el orden esperado en un historial. El `id` y la fecha siguen siendo crecientes. |
| **D7** | **Enter en el campo cantidad agrega el renglón en lugar de confirmar la venta** (`preventDefault`). | Sin esto, el envío implícito del formulario disparaba «Confirmar venta» al presionar Enter en la cantidad: una confirmación de venta no deseada. |
| **D8** | **El botón «Guardar cantidad» pierde `.boton--modificar` y gana `.boton--guardar`.** | Deja un selector estable y un gancho semántico para el estilo y para las pruebas automatizadas. |
| **D9** | **Los datos descriptivos viajan con la venta**: `titulo` por renglón y `clienteNombre` / `clienteEmail` por venta. | «Se conservan también los datos descriptivos necesarios para leer esa venta»: el historial sigue siendo legible aunque el catálogo cambie. |
| **D10** | **El botón es `#boton-agregar-renglon` (`type="button"`) y nunca envía el formulario.** | Evita envíos implícitos duplicados. El submit del formulario solo lo dispara «Confirmar venta». |

---

## 3. Comprobaciones realizadas

Las comprobaciones se ejecutaron sobre Chrome real (headless, `file://`) con `puppeteer-core` +
WebDriver-free CDP, sobre el proyecto abierto tal como se entrega. Los scripts de prueba quedaron
fuera del proyecto (archivos temporales) para no sumar dependencias a la entrega.

### 3.1 Casos manuales de la consigna (43/43 Approved)

| Caso de la consigna | Resultado esperado | Resultado observado | Estado |
|---|---|---|---|
| Venta sin cliente | No se confirma | Mensaje «Seleccioná un cliente.»; `ventas.length === 0` | **APROBADO** |
| Venta sin renglones | No se confirma | Mensaje «Agregá al menos un renglón a la venta.»; `ventas.length === 0` | **APROBADO** |
| Cantidad cero | No se agrega el renglón | Mensaje de error; 0 renglones en la tabla | **APROBADO** |
| Cantidad negativa | No se agrega el renglón | Mensaje de error; 0 renglones en la tabla | **APROBADO** |
| Cantidad decimal (`1.5`) | No se agrega el renglón | Mensaje de error; 0 renglones en la tabla | **APROBADO** |
| Libro repetido | No crea otro renglón | La cantidad de filas no cambia; la cantidad del renglón existente aumenta; mensaje «ya estaba en la venta» | **APROBADO** |
| Venta válida: 2 × 1500 y 1 × 2000 | Subtotales 3000 y 2000; total 5000 | Subtotales `$ 3.000,00` y `$ 2.000,00`; total `$ 5.000,00` | **APROBADO** |
| Detalle conservado en el historial | El detalle muestra los renglones | 2 renglones con `$ 1.500,00` / `$ 3.000,00` y `$ 2.000,00` / `$ 2.000,00` | **APROBADO** |
| Precio histórico | Tras cambiar el precio del catálogo, el historial conserva los valores confirmados | Se cambió el precio de `Cuentos de la selva` de 1500 a 9999: el detalle sigue mostrando `$ 1.500,00` y `$ 3.000,00`; en la venta guardada `precioUnitario === 1500`, `subtotal === 3000`, `total === 5000` | **APROBADO** |
| Identificador, fecha, cliente y total en el historial | Se muestran los cuatro | `V-001` — `21/10/26, 5:06 p. m.` — `Juan Pérez` — `$ 5.000,00` | **APROBADO** |
| La venta no se edita ni se elimina | Sin acciones de edición o borrado | La única acción del historial es «Ver detalle» | **APROBADO** |
| Confirmación limpia el formulario | 0 renglones, total `$ 0,00`, selects reiniciados | Tabla de renglones con el mensaje de estado vacío; total `$ 0,00`; cliente y libro vuelven a «Seleccionar …» | **APROBADO** |
| Mensaje de resultado | Se muestra al confirmar | «Venta registrada correctamente. Identificador V-001.» | **APROBADO** |
| Cambiar cantidades antes de confirmar | Permitido | La edición en línea pasó de 2 a 3 y recalculó el subtotal a `$ 4.500,00` | **APROBADO** |
| Quitar renglones antes de confirmar | Permitido | La fila se elimina y la tabla vuelve al estado vacío | **APROBADO** |

### 3.2 Regresión sobre los Ejercicios 3 y 4

| Control | Resultado observado | Estado |
|---|---|---|
| Catálogo renderizado | 8 tarjetas `.libro` | **APROBADO** |
| Tabla de libros / clientes | 8 filas / 3 filas | **APROBADO** |
| Selectores poblados | editorial 3 (incluye el placeholder), género 3, autores 4, cliente 4, libro 9 | **APROBADO** |
| Filtro insensible a mayúsculas | `HOBBIT` → 1 tarjeta | **APROBADO** |
| Filtro con espacios sobrantes | `"   "` → 8 tarjetas (catálogo completo) | **APROBADO** |
| Búsqueda sin resultados | `zzzz` → `#catalogo-sin-resultados` visible | **APROBADO** |
| Errores de consola | 0 errores y 0 excepciones | **APROBADO** |

### 3.3 Adaptación y accesibilidad (Ejercicio 2, sin regresiones)

| Control | Resultado observado | Estado |
|---|---|---|
| Ancho 320 px | `scrollWidth === clientWidth === 320`: la página **no** genera scroll horizontal | **APROBADO** |
| Scroll propio de las tablas | `.tabla-contenedor` con `overflow-x: auto`; `scrollWidth 467 > clientWidth 236` y `scrollLeft` llega al máximo (231) dentro del contenedor | **APROBADO** |
| Foco visible por teclado | `Tab` recorre la navegación y el buscador con `outline` visible en todos los controles | **APROBADO** |

---

## 4. Mapeo a los requisitos del Ejercicio 5

| Requisito de la consigna | Implementación | Estado |
|---|---|---|
| Se selecciona un cliente existente | `#venta-cliente` poblado desde `clientes`; `validarVenta` exige un cliente existente | **CUMPLIDO** |
| Al menos un renglón con libro existente y cantidad entera > 0 | `validarRenglon` | **CUMPLIDO** |
| No se admiten libros repetidos | `buscarRenglon` + suma de cantidad (D1) | **CUMPLIDO** |
| Se permiten cambiar cantidades y quitar renglones | `handleModificarRenglon` / `handleGuardarCantidad` / `handleQuitarRenglon` | **CUMPLIDO** |
| Cada renglón muestra libro, cantidad, precio unitario y subtotal | `renderTablaRenglones` sobre `#plantilla-renglon` | **CUMPLIDO** |
| Subtotal = cantidad × precio; total = suma de subtotales; 2 decimales | `calcularSubtotal`, `calcularTotal`, `formatearPrecio` | **CUMPLIDO** |
| Se impide confirmar sin cliente, sin renglones o con cantidades inválidas | `validarVenta` + `preventDefault` | **CUMPLIDO** |
| Al confirmar se registran id, fecha, cliente, renglones y total | `handleSubmitVenta` | **CUMPLIDO** |
| El precio unitario se copia como valor histórico | `crearRenglon` + `venta.renglones[].precioUnitario` (D2) | **CUMPLIDO** |
| Se conservan los datos descriptivos de la venta | `titulo` por renglón; `clienteNombre` y `clienteEmail` por venta (D9) | **CUMPLIDO** |
| El historial muestra id, fecha, cliente y total, y permite consultar los renglones | `renderTablaHistorial` + `renderDetalleVenta` | **CUMPLIDO** |
| Las ventas confirmadas no se editan ni se eliminan | Solo existe la acción «Ver detalle» | **CUMPLIDO** |
| La confirmación limpia el formulario y muestra un mensaje | `form.reset()` + `#venta-mensaje-exito` | **CUMPLIDO** |

---

## 5. Pendientes

| Pendiente | Ejercicio | Observación |
|---|---|---|
| Persistencia con `localStorage` | 6 | Las ventas viven en memoria (`const ventas`). Hay que serializar `ventas` y cargar la copia guardada al iniciar, sin duplicar los datos iniciales. |
| `README.md` | 6 | La consigna lo exige como parte de la entrega. |
| Casos manuales registrados en el README | 6 | La sección 3.1 de este documento es la evidencia que hay que volcar al README. |
| Comprobación guiada del precio histórico sobre `localStorage` | 6 | La consigna pide que la ubicación y la estructura del catálogo guardado queden documentadas en el README para que el docente pueda reproducirla. |

---

## 6. Notas de alcance

- **Sin dependencias externas.** No se agregó ninguna biblioteca al proyecto. `puppeteer-core` se usó
  únicamente como herramienta de verificación, fuera de la carpeta entregada.
- **Sin CDN.** Todo el CSS y el JS son locales, como exige la consigna.
- **El HTML y el CSS de los Ejercicios 1 y 2 no se alteraron.** Solo se agregaron elementos nuevos
  (`#renglon-mensaje-*`, `#historial-detalle-resumen`) y reglas nuevas. Las reglas CSS existentes no se
  modificaron, de modo que la verificación del Ejercicio 2 sigue vigente.
- **Los conteos del resumen del Ejercicio 3 quedaron desactualizados** respecto del conjunto de datos
  inicial (6 libros → 8). Se anotó la aclaración al comienzo de ese documento.
