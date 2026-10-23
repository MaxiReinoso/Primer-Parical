# Tasks: C-05 ejercicio5-venta-historial

> **Archivos que este change puede tocar (declaración explícita):**
>
> | Archivo | Qué se toca | Por qué |
> |---------|-------------|---------|
> | `js/app.js` | Bloque nuevo de ventas/historial al final del archivo + un `DOMContentLoaded` | Único archivo de producto del ejercicio 5. **Se agrega, no se reformatea** (regla dura 12). |
> | `index.html` | **No se toca** | Estructura ya completa (C-01). Regla dura 12. |
> | `css/` | **No se toca** | Clases ya existen (C-02). Regla dura 12. |
> | `docs/ejercicio5-implementacion-resumen.md` | Se crea/reescribe al cerrar con evidencia real | Requerido por el flujo OpenSpec. El actual contiene evidencia falsa. |
> | `CHANGES.md` | Solo checkbox `[x]` al cerrar | Responsabilidad del orquestador, no de la fase apply. |

## Dependencias

- C-01 (estructura HTML) y C-02 (presentación CSS): archivados/completados; ambas superficies congeladas.
- C-03 `ejercicio3-datos-catalogo-filtro`: archivado/completado — arrays `libros`/`clientes` y `formatearPrecio()`.
- C-04 `ejercicio4-altas-libros-clientes`: archivado/completado — `poblarSelectoresRelacionados()`, `siguienteId()`,
  `mostrarError()`/`mostrarExito()`.
- **Habilita a** C-06 `ejercicio6-persistencia-documentacion` (contrato D-09 del `design.md`).

## Referencias de diseño

Decisiones cerradas en `design.md`: D-01 (nombres canónicos, `confirmarVenta`), D-02 (identidad por índice),
D-03 (`prompt()` para modificar), D-04 (cliente vacío), D-05 (`novalidate` por JS), D-06 (fecha ISO, orden reverso
sobre copia), D-07 (cálculo exacto, formato solo al mostrar), D-08 (contrato `{ motivo, campo }`), D-09 (contrato C-06).

## Checklist

### 1. Estado y helpers de cálculo
- [x] 1.1 Declarar `const ventas = []` y `const ventaEnCurso = { clienteId: null, renglones: [] }` en el ámbito del script.
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'const ventas = \[\]|const ventaEnCurso'` devuelve 2 coincidencias.
- [x] 1.2 `generarIdVenta()` → `siguienteId(ventas, "ven")` (reutiliza C-04, no reimplementa).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'function generarIdVenta'` devuelve 1 coincidencia.
- [x] 1.3 `calcularSubtotal(renglon)` = `renglon.cantidad * renglon.precioUnitario`; `calcularTotal(renglones)` = reducción de subtotales (D-07: sin redondeo del dato).
  - **Verificación:** `node --check js/app.js` sin errores.

### 2. Poblado de selectores (reutilizar C-04)
- [x] 2.1 `inicializarVentas()` llama a `poblarSelectoresRelacionados()` para poblar `#venta-cliente` y `#renglon-libro` (D-09).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'poblarSelectoresRelacionados\(\)'` aparece dentro de `inicializarVentas`.
  - **Resultado esperado (navegador):** `#venta-cliente` lista los clientes semilla y registrados; `#renglon-libro` lista los libros; ambos sin duplicados tras un alta.

### 3. Agregar renglón
- [x] 3.1 `agregarRenglon()` valida libro existente (`obtenerLibroPorId`) y cantidad entera > 0 (rechaza 0, negativa, decimal, no numérica).
  - **Verificación:** `node --check js/app.js`; caso manual 8.2 (ver §8).
- [x] 3.2 Libro repetido: si `libroId` ya existe en `ventaEnCurso.renglones`, **sumar** la cantidad al renglón existente, recalcular su subtotal y **no** crear fila nueva; informar el duplicado (D-… / RN-VEN-03).
  - **Verificación:** caso manual 8.3 (ver §8).
- [x] 3.3 Copiar snapshot histórico al renglón: `{ libroId, titulo, isbn, precioUnitario: libro.precio, cantidad, subtotal }`. Nunca volver a leer `libro.precio` al renderizar historial/detalle (RN-VEN-11/12).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'precioUnitario'` solo dentro de `agregarRenglon`/`confirmarVenta`/render del snapshot; ningún `.precio` en `renderHistorial`/`renderDetalleVenta`.
- [x] 3.4 `renderRenglonesEnCurso()` clona `#plantilla-renglon` (D-02: recorre `ventaEnCurso.renglones` con `forEach`), rellena `.fila-renglon__libro/__cantidad/__precio-unitario/__subtotal` con `textContent` y conecta `.boton--quitar`/`.boton--modificar` por índice.
  - **Verificación:** `node --check js/app.js`; resultado esperado: tras agregar, `#tabla-renglones-cuerpo` tiene 1 fila con los 4 valores.
- [x] 3.5 `#venta-total` se actualiza con `formatearPrecio(total)` (dos decimales, reutiliza C-03).
  - **Verificación (navegador):** agregar renglones y ver `#venta-total` en formato `$X.XXX,XX`.

### 4. Editar/quitar renglones antes de confirmar (D-02, D-03)
- [x] 4.1 "Modificar renglón" abre `window.prompt()`, valida entero > 0; si es inválido o se cancela (`null`) **no** muta el estado; si es válido actualiza cantidad → recalcula subtotal/total.
  - **Verificación:** caso manual 8.1-adjunto (ver §8): modificar a valor inválido no rompe el estado; a valor válido recalcula.
- [x] 4.2 "Quitar renglón" elimina el renglón por índice y re-renderiza.
  - **Verificación (navegador):** quitar una fila reduce `#tabla-renglones-cuerpo` y actualiza `#venta-total`.
- [x] 4.3 Toda mutación llama a `renderRenglonesEnCurso()` (reconstruye filas y total).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'renderRenglonesEnCurso\(\)'` aparece tras cada mutación.

### 5. Confirmación de venta (D-01, D-04, D-05, D-06, D-08)
- [x] 5.1 `inicializarVentas()` aplica `noValidate = true` a `#form-venta` y registra `submit` con `preventDefault()` (D-05).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'noValidate'` devuelve 1 coincidencia.
- [x] 5.2 `confirmarVenta()` valida: cliente vacío o inexistente → rechaza; sin renglones → rechaza; cantidad inválida → rechaza. Rechazos vía `mostrarError(..., [{ motivo, campo }])` con `campo` ∈ {`venta-cliente`, `renglon-libro`, `renglon-cantidad`} (D-04, D-08). "Sin renglones" apunta a `renglon-libro`.
  - **Verificación:** casos manuales 8.4 y 8.5 (ver §8).
- [x] 5.3 Confirmación válida: `const venta = { id: generarIdVenta(), fecha: new Date().toISOString(), clienteId, clienteNombre, renglones: [...], total }` y **único** `ventas.push(venta)` (D-01, D-06).
  - **Verificación:** `(Select-String -Path js/app.js -Pattern 'ventas\.push\(').Count` === 1, dentro de `confirmarVenta`.
- [x] 5.4 Limpiar formulario/estado tras confirmar: vaciar `#tabla-renglones-cuerpo`, `#renglon-cantidad`, resetear `ventaEnCurso`, `#venta-total` a `$0,00` (RN-VEN-14).
  - **Verificación:** caso manual 8.6 (ver §8).
- [x] 5.5 `mostrarExito(#venta-mensaje-exito, #venta-mensaje-error)` al confirmar; rechazos dejan visible `#venta-mensaje-error` y ocultan el de éxito.
  - **Verificación (navegador):** mensaje correcto visible en cada caso.
- [x] 5.6 `renderHistorial()` se invoca tras confirmar para reflejar la nueva venta.
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'renderHistorial\(\)'` aparece en `confirmarVenta` y en `inicializarVentas`.

### 6. Historial con detalle histórico (D-06, D-08)
- [x] 6.1 `renderHistorial()` puebla `#tabla-historial-cuerpo` iterando `[...ventas].reverse()` (más reciente primero, sin mutar `ventas`) con `id`, `fecha` (ISO), `clienteNombre`, `formatearPrecio(total)` e inserta botón "Ver detalle" por venta.
  - **Verificación:** caso manual 8.7 (ver §8); `Select-String -Pattern '\[\.\.\.ventas\]\.reverse'`.
- [x] 6.2 Alternar `#historial-vacio`: visible si `ventas.length === 0`, oculto si hay ventas.
  - **Verificación (navegador):** estado inicial muestra `#historial-vacio`; tras confirmar queda oculto.
- [x] 6.3 "Ver detalle" → `renderDetalleVenta(venta)` puebla `#tabla-detalle-cuerpo` con `titulo`, `cantidad`, `formatearPrecio(precioUnitario)` y `formatearPrecio(subtotal)` **del snapshot** (nunca del catálogo).
  - **Verificación:** control obligatorio del precio histórico (ver §8, 8.8).
- [x] 6.4 Alternar `#historial-detalle-vacio`: oculto cuando hay detalle renderizado, visible antes de seleccionar.
  - **Verificación (navegador):** al pulsar "Ver detalle" `#historial-detalle-vacio` queda oculto.
- [x] 6.5 Toda inserción de datos del usuario (título, nombre, ISBN) usa `textContent` (regla dura 10 / RN-CAT-08).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'innerHTML'` no devuelve coincidencias nuevas del bloque de ventas.

### 7. Integración e inicialización (D-09)
- [x] 7.1 Registrar listeners: `#boton-agregar-renglon` (click), `#form-venta` (submit), y delegación de click en `#tabla-renglones-cuerpo` para modificar/quitar.
  - **Verificación:** `node --check js/app.js` sin errores.
- [x] 7.2 Agregar `document.addEventListener("DOMContentLoaded", inicializarVentas);` **después** de `app.js:520`, sin modificar los listeners existentes.
  - **Verificación:** `(Select-String -Path js/app.js -Pattern 'DOMContentLoaded').Count` === 3; los 2 previos intactos.
- [x] 7.3 No romper C-03/C-04: no se modifican ni renombran funciones/listeners existentes; no se declara `cargarEstado()`/`guardarEstado()` (es C-06).
  - **Verificación:** `Select-String -Path js/app.js -Pattern 'cargarEstado|guardarEstado'` no devuelve coincidencias.

### 8. Verificación (casos manuales, evidencia por control)

> Ejecutar en navegador real abriendo `index.html` por `file://`. Registrar cada control con estado
> {aprobado, fallido, omitido, pendiente} y motivo.

- [x] 8.1 Venta sin cliente → no se confirma.
  - **Cómo:** dejar `#venta-cliente` sin cliente válido (o vaciar la colección) y pulsar "Confirmar venta".
  - **Esperado:** no se agrega a `ventas`; `#venta-mensaje-error` visible; foco en `#venta-cliente`.
- [x] 8.2 Cantidad 0, negativa, decimal o no numérica → renglón rechazado.
  - **Cómo:** probar `0`, `-2`, `1.5`, `abc` en `#renglon-cantidad` + "Agregar renglón".
  - **Esperado:** sin fila nueva; mensaje de error; foco en `#renglon-cantidad`.
- [x] 8.3 Libro repetido → suma cantidad, no crea segundo renglón.
  - **Cómo:** agregar el mismo libro con cantidad 2 y luego con cantidad 3.
  - **Esperado:** una sola fila con cantidad 5; se informa el duplicado.
- [x] 8.4 Venta válida: 2×1500 + 1×2000 → subtotales 3000 y 2000, total 5000.
  - **Prerrequisito:** la semilla no tiene libros de 1500/2000 (`2500, 1800, 2200, 1950, 2100, 2700`); **crear antes** dos libros a precio 1500 y 2000 vía C-04 (Ejercicio 4). Documentarlo en la evidencia.
  - **Cómo:** agregar 2 unidades del libro de 1500 y 1 del de 2000, seleccionar cliente, "Confirmar venta".
  - **Esperado:** `#venta-total` = `$5.000,00`; renglones 3000/2000; venta presente en `#tabla-historial-cuerpo`.
- [x] 8.5 Confirmar con renglones de cantidad inválida → no se confirma.
  - **Cómo:** si se logra un estado con cantidad inválida (p. ej. modificar a 0 sin validar), confirmar.
  - **Esperado:** no se agrega a `ventas`; mensaje de error.
- [x] 8.6 Limpiar formulario tras confirmación.
  - **Cómo:** tras 8.4, revisar el formulario.
  - **Esperado:** `#tabla-renglones-cuerpo` vacío, `#renglon-cantidad` vacío, `#venta-total` = `$0,00`; mensaje de éxito visible.
- [x] 8.7 Historial: listado con id/fecha/cliente/total, más reciente primero.
  - **Cómo:** confirmar dos ventas y observar `#tabla-historial-cuerpo`.
  - **Esperado:** dos filas; la última venta aparece primero; `#historial-vacio` oculto.
- [ ] 8.8 **Control obligatorio — precio histórico.** Venta confirmada + cambio exclusivo del precio de catálogo (en copia de prueba) → detalle conserva el precio unitario, subtotales y total confirmados.
  - **Cómo:** (1) confirmar la venta de 8.4 y anotar importes; (2) en `localStorage` (`libreria-el-estante:v1`), modificar **solo** `libros[i].precio` del libro usado, sin tocar `ventas`; (3) recargar; (4) "Ver detalle".
  - **Esperado:** `#tabla-detalle-cuerpo` muestra el `precioUnitario` original (1500/2000), no el nuevo.
  - **Nota:** este caso depende de la persistencia de C-06; si C-06 no está aplicado, marcar **pendiente** con motivo y registrar la verificación parcial en memoria (cambiar `libros` por consola y re-renderizar detalle).
- [ ] 8.9 Verificación a 320px: sin scroll horizontal de página (tablas con desplazamiento propio).
- [x] 8.10 Sin errores en consola del navegador (`node --check js/app.js` limpio + consola vacía al operar).

### 9. Cierre (responsabilidad del orquestador, no de apply)
- [x] 9.1 `node --check js/app.js` limpio y `openspec validate ejercicio5-venta-historial` válido.
- [x] 9.2 Reescribir `docs/ejercicio5-implementacion-resumen.md` con evidencia **real** (control por control, estado y motivo). El contenido actual es falso y debe reemplazarse.
- [x] 9.3 Marcar `[x]` C-05 en `CHANGES.md`.
- [ ] 9.4 Archivar el change con `/opsx:archive ejercicio5-venta-historial`.
