# Ejercicio 5 — Venta simulada e historial — Resumen de implementación

- **Change:** `ejercicio5-venta-historial` (C-05)
- **Fecha de verificación:** 2026-10-22
- **Archivo de producto modificado:** `js/app.js` (bloque §7 agregado al final, sin reformatear C-03/C-04)
- **Archivos NO tocados:** `index.html`, `css/`, change C-06, archivados, knowledge-base
- **Evidencia de verificación:** arnés real en Edge headless sobre copia del sitio (ver §2)

## 1. Implementación

### Funciones agregadas

| Función | Rol |
|---|---|
| `generarIdVenta()` | `siguienteId(ventas, "ven")`. |
| `calcularSubtotal(renglon)` | `cantidad * precioUnitario`, sin redondeo (D-07). |
| `calcularTotal(renglones)` | Suma de subtotales, sin redondeo (D-07). |
| `renderRenglonesEnCurso()` | Clona `#plantilla-renglon`, vuelca los 4 valores con `textContent`, conecta quitar/modificar por índice y actualiza `#venta-total`. |
| `agregarRenglon()` | Valida libro y cantidad entera > 0; resuelve duplicado sumando cantidad; crea snapshot y setea `ventaEnCurso.clienteId`. |
| `modificarRenglon(indice)` | `window.prompt()`; cancelar o valor inválido no muta; válido recalcula y re-renderiza. |
| `quitarRenglon(indice)` | `splice` + render. |
| `confirmarVenta()` | Valida cliente por pertenencia, ≥1 renglón y cantidades enteras > 0; único `ventas.push`; limpia estado y renderiza historial. |
| `renderHistorial()` | Itera `ventas.slice().reverse()`, pinta id/fecha ISO/cliente/total y botón "Ver detalle"; alterna `#historial-vacio`. |
| `renderDetalleVenta(venta)` | Vuelca `titulo`, `cantidad`, `precioUnitario` y `subtotal` **del snapshot**; alterna `#historial-detalle-vacio`. |
| `inicializarVentas()` | `noValidate`, listeners de submit y alta de renglón, estado inicial, `poblarSelectoresRelacionados()`, render de renglones e historial. |

Estado global agregado: `const ventas = []` y `const ventaEnCurso = { clienteId: null, renglones: [] }`.
Tercer listener: `document.addEventListener("DOMContentLoaded", inicializarVentas);`.

### Contrato dejado a C-06

1. `const ventas = []` en el ámbito del script de `js/app.js` (C-06 restaura con reemplazo in situ, nunca reasignando).
2. **Exactamente un** `ventas.push(venta)`, dentro de `confirmarVenta()`.
3. Forma de la venta: `{ id, fecha, clienteId, clienteNombre, renglones, total }`.
4. Forma de cada renglón (snapshot copiado, nunca recalculado desde el catálogo):
   `{ libroId, titulo, isbn, precioUnitario, cantidad, subtotal }`.
5. C-06 agrega `guardarEstado()` inmediatamente después de ese único push, y `cargarEstado()` al final del archivo.
6. Este change **no** declara ni llama a `cargarEstado()`/`guardarEstado()`.

## 2. Verificación ejecutada

### Entorno

- Sintaxis: `node --check js/app.js` → sin errores.
- Change: `openspec validate ejercicio5-venta-historial` → `Change 'ejercicio5-venta-historial' is valid` (solo warnings preexistentes de RFC 2119 en la spec).
- Navegador: Microsoft Edge `--headless=new`, apertura por `file://`, copia del sitio en
  `C:\Users\LauG\AppData\Local\Temp\opencode\c05-harness` (`index.html` + `css/` + `js/`), `--virtual-time-budget=10000`.
- Script de prueba inyectado en la copia de `index.html`: captura `window.onerror` y `console.error`, ejecuta los
  casos sobre la UI real (formularios, selects, botones y tablas) y vuelca `PASS/FAIL nombre: detalle` en `#__resultados`.
- Resultado global: **54 PASS, 0 FAIL**.
- Los dos libros de prueba (precio 1500 y 2000) se crearon **antes** mediante el formulario real de C-04, tal como
  exige el caso 8.4.

### Tabla control por control

| Control | Estado | Cómo se ejecutó / evidencia |
|---|---|---|
| 1.1 Estado global `ventas` y `ventaEnCurso` | aprobado | Declarados en `js/app.js`; `Select-String` devuelve las 2 coincidencias. |
| 1.2 `generarIdVenta()` reutiliza `siguienteId` | aprobado | `Select-String` devuelve 1 definición; arnés obtiene `ven-1`, `ven-2`. |
| 1.3 `calcularSubtotal` / `calcularTotal` sin redondeo | aprobado | `node --check` limpio; arnés obtiene total exacto `5000` y subtotales `3000`/`2000`. |
| 2.1 Poblar selects reutilizando C-04 | aprobado | `poblarSelectoresRelacionados()` llamado en `inicializarVentas()`; arnés opera con libros semilla y los dos libros nuevos sin duplicados. |
| 3.1 Validar libro y cantidad entera > 0 | aprobado | Arnés: `0`, `-1`, `1.5` y vacío no crean fila y muestran error; libro inexistente tampoco. |
| 3.2 Libro repetido suma cantidad sin duplicar fila | aprobado | Arnés: 2 + 3 del mismo libro → 1 fila con cantidad `5` y aviso "Se sumó la cantidad...". |
| 3.3 Snapshot histórico `{ libroId, titulo, isbn, precioUnitario, cantidad, subtotal }` | aprobado | Código: snapshot en `agregarRenglon()`; historial/detalle solo leen `precioUnitario` del renglón. |
| 3.4 `renderRenglonesEnCurso()` clona plantilla y conecta botones por índice | aprobado | Arnés: filas con los 4 valores; quitar y modificar operan por índice. |
| 3.5 `#venta-total` con `formatearPrecio()` | aprobado | Arnés: `$ 5.000,00` para 2×1500 + 1×2000; `$ 0,00` al vaciar. |
| 4.1 Modificar con `prompt()` valida y no muta con inválido/cancelar | aprobado | Arnés: `prompt=4` recalcula a `$ 10.000,00`; `prompt=0` no muta y muestra error; `null` no muta. |
| 4.2 Quitar renglón | aprobado | Arnés: fila eliminada y total vuelve a `$ 0,00`. |
| 4.3 Toda mutación re-renderiza | aprobado | `agregarRenglon`, `modificarRenglon`, `quitarRenglon` y la confirmación llaman a `renderRenglonesEnCurso()` o limpian la tabla. |
| 5.1 `noValidate` + submit con `preventDefault` | aprobado | `Select-String 'noValidate'` → 1 coincidencia; arnés dispara submit y obtiene mensajes propios. |
| 5.2 Rechazos con `{ motivo, campo }` y campo existente | aprobado | Arnés: sin cliente → `venta-cliente`; sin renglones → `renglon-libro`; cantidad corrupta → `renglon-cantidad`; ninguno registra venta. |
| 5.3 Venta válida y único `ventas.push` | aprobado | `(Select-String 'ventas\.push\(').Count` → `1`; arnés: una venta con id, fecha, cliente, 2 renglones y total. |
| 5.4 Limpieza tras confirmar | aprobado | Arnés: tabla vacía, cantidad vacía, total `$ 0,00`. |
| 5.5 Mensaje de éxito/error | aprobado | Arnés: éxito visible y error oculto al confirmar; inverso en cada rechazo. |
| 5.6 `renderHistorial()` tras confirmar | aprobado | Arnés: historial pasa de 0 a 1 fila y luego a 2. |
| 6.1 Historial con id/fecha/cliente/total, más reciente primero | aprobado | Arnés: 2 filas; la primera es `ven-2` y la segunda `ven-1`. |
| 6.2 Alternar `#historial-vacio` | aprobado | Arnés: visible al inicio, oculto tras confirmar. |
| 6.3 "Ver detalle" con snapshot | aprobado | Arnés: detalle de `ven-1` con 2 filas y precio unitario `$ 1.500,00`. |
| 6.4 Alternar `#historial-detalle-vacio` | aprobado | Arnés: visible antes de elegir, oculto al renderizar detalle. |
| 6.5 `textContent` en datos de usuario | aprobado | Código: sin `innerHTML` nuevo en §7 (el único `innerHTML` del archivo es el preexistente de C-03). |
| 7.1 Listeners de venta | aprobado | Arnés: submit de `#form-venta`, click de `#boton-agregar-renglon` y botones de fila funcionan. |
| 7.2 Tercer `DOMContentLoaded` sin tocar los 2 previos | aprobado | `(Select-String 'DOMContentLoaded').Count` → `3`. |
| 7.3 No romper C-03/C-04; sin `cargarEstado`/`guardarEstado` | aprobado | `Select-String 'cargarEstado|guardarEstado'` → 0; catálogo, libros y clientes siguen operativos en el arnés. |
| 8.1 Venta sin cliente | aprobado | Arnés: no registra, error visible y foco en `#venta-cliente`. |
| 8.2 Cantidad 0, negativa, decimal o vacía | aprobado | Arnés: los 4 valores rechazados, sin fila nueva y con error. |
| 8.3 Libro repetido | aprobado | Arnés: una sola fila con cantidad `5` y aviso de duplicado. |
| 8.4 Venta 2×1500 + 1×2000 | aprobado | Libros creados por C-04; arnés: subtotales `$ 3.000,00` y `$ 2.000,00`, total `$ 5.000,00`. |
| 8.5 Confirmar con cantidad inválida | aprobado | Arnés: se corrompe la cantidad del estado a `0`; confirmar no registra y muestra error. |
| 8.6 Limpieza tras confirmación | aprobado | Arnés: tabla vacía, cantidad vacía, total `$ 0,00`, éxito visible. |
| 8.7 Historial y orden | aprobado | Arnés: 2 ventas, la más reciente primero, `#historial-vacio` oculto. |
| 8.8 Precio histórico tras cambiar el catálogo | **pendiente** (variante con recarga) | Verificación en memoria **aprobada**: tras confirmar, se cambió `libros[i].precio` a `9999` y "Ver detalle" siguió mostrando `$ 1.500,00` y subtotal `$ 3.000,00`. La variante con `localStorage` + recarga depende de C-06, que no está aplicado. |
| 8.9 Sin scroll horizontal a 320px | **omitido** | Edge headless no baja de 492px de viewport (`--window-size=320` → `innerWidth=492`). A 492px: `scrollWidth=477 <= 492`, sin scroll horizontal. No se pudo ejecutar a 320px exactos. |
| 8.10 Consola limpia | aprobado | `node --check` limpio; arnés capturó `window.onerror` y `console.error`: 0 errores. |
| 9.1 `node --check` + `openspec validate` | aprobado | `node --check js/app.js` OK; `openspec validate ejercicio5-venta-historial` → válido. |
| 9.2 Reescribir este documento con evidencia real | aprobado | Este archivo reemplaza el resumen anterior, que era incorrecto. |
| 9.3 Marcar C-05 en `CHANGES.md` | aprobado | `[x]` aplicado en la línea de estado de C-05. |
| 9.4 Archivar el change | pendiente | No se archiva en esta corrida (instrucción explícita). |

## 3. Desviaciones y bloqueos

- **8.9 (320px):** limitación del navegador headless, no del código. Se midió a 492px sin desborde horizontal;
  queda como control omitido para repetirlo manualmente a 320px.
- **8.8 (persistencia):** la invariante de precio histórico de C-05 quedó aprobada en memoria; la comprobación
  completa con recarga requiere C-06.
- Sin otras desviaciones. No se tocaron `index.html` ni `css/`.
