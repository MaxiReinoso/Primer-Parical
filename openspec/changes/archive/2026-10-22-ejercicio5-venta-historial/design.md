# Design: C-05 ejercicio5-venta-historial

## Context

**Estado actual verificado:**
- `index.html` ya tiene: `#form-venta`, `#venta-cliente`, `fieldset` de renglón con `#renglon-libro`, `#renglon-cantidad`, `#boton-agregar-renglon`, `#tabla-renglones` con `tbody#tabla-renglones-cuerpo`, `<output id="venta-total">`, mensajes `#venta-mensaje-{exito,error}`. Historial: `#tabla-historial` con `tbody#tabla-historial-cuerpo`, `#historial-vacio`, `#historial-detalle`, `#tabla-detalle` con `tbody#tabla-detalle-cuerpo`, `#historial-detalle-vacio`. Plantilla `#plantilla-renglon`.
- `js/app.js` (tras C-03/C-04): arrays `libros`, `clientes`, `editoriales`, `generos`, `autores`. Funciones para catálogo/filtro, altas de libros/clientes, `poblarSelectoresRelacionados()`, `renderLibros()`, `renderClientes()`. Ya hay dos listeners `DOMContentLoaded`.
- `css/` tiene clases para tablas, mensajes, botones y layout requeridas.

**Restricciones:**
- Cero dependencias, abrir con `file://`, sin CDN.
- Insertar datos del usuario como `textContent` (RN-CAT-08).
- No tocar `index.html` ni `css/`.
- Compartir `js/app.js` con C-03/C-04/C-06: agregar, no reformatear.
- `precioUnitario` debe copiarse como valor histórico (RN-VEN-11).

## Goals / Non-Goals

**Goals**
- Implementar composición, validación, cálculos y confirmación de venta.
- Implementar historial inmutable con detalle por venta.
- Garantizar invariante de precio histórico.
- Reutilizar `poblarSelectoresRelacionados()`.

**Non-Goals**
- CRUD de editoriales/géneros/autores.
- Edición o eliminación de ventas confirmadas.
- Persistencia (`localStorage`) — eso es C-06.
- Modificar estructura HTML/CSS.

## Decisions

### D-01 — Estado en memoria
Mantener `ventas = []` y `ventaEnCurso = { clienteId: null, renglones: [] }` en memoria. La confirmación pasa los renglones a `ventas` con sus valores copiados.

### D-02 — Renglones con precio histórico
Al agregar renglón, guardar `{ libroId, titulo, isbn, precioUnitario: libro.precio, cantidad, subtotal }`. Nunca leer `libro.precio` al mostrar el historial/detalle. Esto satisface RN-VEN-11/RN-VEN-12.

### D-03 — Libro repetido
Si el libro ya existe en `ventaEnCurso.renglones`, **sumar la cantidad** al renglón existente. Informar el duplicado con un mensaje claro. Nunca duplicar filas (RN-VEN-03).

### D-04 — Validaciones
- Agregar renglón: libro debe existir y cantidad entera > 0.
- Confirmar: cliente existente, >=1 renglón, todas las cantidades enteras > 0. Impedir con mensajes junto al formulario/área correspondiente (RN-VEN-09).

### D-05 — Edición previa
Permitir cambiar cantidad y quitar renglón antes de confirmar. Actualizar subtotal/total inmediatamente.

### D-06 — Historial
Guardar venta con `id`, `fecha` (ISO o legible), `clienteId`, `clienteNombre`, `renglones` (con `precioUnitario` histórico) y `total`. Mostrar listado con id, fecha, cliente, total. Al "Ver detalle" mostrar renglones con precio unitario histórico. Ventas no editables/eliminables.

### D-07 — Integración con selects
Usar `poblarSelectoresRelacionados()` tras altas (ya lo llama C-04). En inicialización también llamarlo para asegurar `#venta-cliente` y `#renglon-libro` poblados.

### D-08 — Sin segundo listener conflictivo
Agregar lógica de ventas en el mismo patrón: funciones + un nuevo `DOMContentLoaded` o extender el flujo. Verificar que no se dupliquen listeners. En C-04 ya hay `DOMContentLoaded(inicializarAltas)`. Se puede agregar otro listener o integrar en `inicializarAltas` si es seguro. Preferir agregar funciones y un `DOMContentLoaded` adicional solo si no rompe lo existente, o llamar desde ahí. Revisar comportamiento: múltiples `DOMContentLoaded` son permitidos y se ejecutan todos.

## Risks / Mitigations
- **Romper C-04**: no tocar funciones existentes, solo agregar.
- **Perder precio histórico**: siempre copiar al momento de agregar renglón/confirmar, nunca recalcular desde catálogo.
- **Conflicto con selects**: reutilizar `poblarSelectoresRelacionados()` tal como está definido.
