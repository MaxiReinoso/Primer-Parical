# Design: C-05 ejercicio5-venta-historial

## Context

**Estado real verificado del repositorio (2026-10-22):**

- El change C-05 se archivó el 2026-10-22 (`openspec/changes/archive/2026-10-22-ejercicio5-venta-historial/`)
  pero **nunca se implementó**: el commit `292462e` solo agregó
  `docs/ejercicio5-implementacion-resumen.md` y los cuatro artefactos del change. `git diff --stat 0f39794 41a54d9 --
  js/app.js index.html css/` está vacío y `git log --all -S "registrarVenta"` no devuelve commits. La evidencia previa
  del resumen era incorrecta.
- `js/app.js` en `main` contiene **solo C-03 + C-04** (~520 líneas). Símbolos reutilizables ya existentes:
  - Arrays de dominio `libros`, `clientes`, `editoriales`, `generos`, `autores` (`js/app.js:8-85`).
  - `obtenerLibroPorId` (`js/app.js:91`), `obtenerClientes` (`js/app.js:109`).
  - `formateadorPrecio` con `minimumFractionDigits: 2` y `formatearPrecio()` (`js/app.js:133-139`).
  - `siguienteId(coleccion, prefijo)` (`js/app.js:234`).
  - `poblarOpciones()` (`js/app.js:262`) y `poblarSelectoresRelacionados()` (`js/app.js:294`), que ya pueblan
    `#venta-cliente` y `#renglon-libro`.
  - `mostrarMensaje`/`ocultarMensaje` (`js/app.js:406-413`), `mostrarError`/`mostrarExito` (`js/app.js:415-424`).
  - Listeners `DOMContentLoaded`: `inicializarCatalogo` (`js/app.js:207`) e `inicializarAltas` (`js/app.js:520`).
  - **No existen** `ventas`, `ventaEnCurso`, `registrarVenta`, `confirmarVenta`, `agregarRenglon`, ni historial.
- `index.html` (264 líneas, congelado por C-01) ya contiene toda la estructura: `#form-venta` (sin `novalidate`),
  `#venta-cliente` (sin opción vacía), `#renglon-libro`, `#renglon-cantidad` (`type="number" step="1"`, sin `min`),
  `#boton-agregar-renglon`, `#tabla-renglones-cuerpo`, `<output id="venta-total">`, `#venta-mensaje-{exito,error}`,
  `#tabla-historial-cuerpo`, `#historial-vacio`, `#historial-detalle`, `#historial-detalle-vacio`,
  `#tabla-detalle-cuerpo`, y la plantilla `#plantilla-renglon` con los botones `.boton--quitar` y `.boton--modificar`.
  La tabla de renglones **no tiene input de cantidad inline**: el renglón solo muestra texto.
- `css/` (congelado por C-02) ya define `.fila-renglon*`, `.boton--quitar`, `.boton--modificar`, `.venta__total`,
  `.detalle-venta`, `.mensaje*`, `.tabla*`.
- Contrato esperado por C-06 (`design.md` de `ejercicio6-persistencia-documentacion`, D-03..D-05, D-08): un arreglo
  global `ventas` (C-06 escribe `typeof ventas !== "undefined" ? ventas : []` y hace reemplazo in situ), **un único
  punto que agrega** la venta completa, seguido una sola vez de `guardarEstado()`, y `cargarEstado()` síncrono al final
  de `app.js`.

**Restricciones:**

- Cero dependencias, sin build, apertura directa por `file://`.
- Los datos escritos por el usuario se insertan como `textContent`, nunca como HTML interpretable (RN-CAT-08, regla dura 10).
- No se modifican `index.html` ni `css/` (regla dura 12, DD-01).
- `js/app.js` se comparte con C-03/C-04/C-06: **se agrega, no se reformatea** ni se renombra lo existente.
- Todo literal de color/espaciado/etc. vive en `:root` (regla dura 8); este change no escribe CSS.

## Goals / Non-Goals

**Goals**

- Implementar composición de la venta (renglones), validaciones, cálculos con dos decimales y confirmación.
- Implementar historial inmutable con detalle por venta, siempre sobre el **snapshot histórico** del precio.
- Garantizar el contrato que C-06 consume: `ventas` global, único punto de commit, sin tocar archivos congelados.
- Reutilizar `poblarSelectoresRelacionados()`, `formatearPrecio()`, `siguienteId()` y los helpers de mensajes.

**Non-Goals**

- Persistencia en `localStorage` (es C-06).
- CRUD de editoriales/géneros/autores.
- Edición, anulación o eliminación de ventas confirmadas (RN-VEN-13).
- Modificar `index.html` o `css/`, o agregar estructura/estilos nuevos.

## Decisions

### D-01 — Nombres canónicos de las funciones nuevas

**Decisión.** El único punto que agrega la venta a `ventas` se llama **`confirmarVenta()`**, y es el
**único `ventas.push(...)`** del archivo. Las demás funciones nuevas se nombran:

| Función | Responsabilidad |
|---------|-----------------|
| `inicializarVentas()` | Tercer `DOMContentLoaded`: poblar selects vía `poblarSelectoresRelacionados()`, registrar listeners y renderizar estado inicial. |
| `agregarRenglon()` | Valida libro + cantidad, resuelve duplicado y agrega/actualiza el renglón en `ventaEnCurso`. |
| `modificarRenglon(indice)` | Cambia la cantidad de un renglón existente tras validar. |
| `quitarRenglon(indice)` | Elimina un renglón existente. |
| `confirmarVenta()` | Valida, arma el snapshot, hace el único `ventas.push(...)` y limpia el formulario. |
| `renderRenglonesEnCurso()` | Re-renderiza `#tabla-renglones-cuerpo` y `#venta-total` desde `ventaEnCurso`. |
| `renderHistorial()` | Renderiza `#tabla-historial-cuerpo` y gestiona `#historial-vacio`. |
| `renderDetalleVenta(venta)` | Renderiza `#tabla-detalle-cuerpo` y gestiona `#historial-detalle-vacio`. |
| `generarIdVenta()` | `siguienteId(ventas, "ven")`. |
| `calcularSubtotal(renglon)` / `calcularTotal(renglones)` | Cálculos numéricos (sin formato). |

**Por qué.** `CHANGES.md` y el `proposal.md` de este change nombran `confirmarVenta()`; C-06 menciona
`registrarVenta`/`confirmarVenta` como "nombres a confirmar". Se fija **`confirmarVenta`** y se deja constancia para
C-06. Un solo nombre de commit evita dos puntos de push.

**Alternativa descartada.** `registrarVenta()` como nombre del commit: contradice `CHANGES.md`, que ya usa
`agregarRenglon()`, `confirmarVenta()` y `renderHistorial()`. Se reserva `registrarVenta` como alias prohibido.

### D-02 — Identidad de fila por índice de posición, no por `data-*` ni closure

**Decisión.** El estado autoritativo es `ventaEnCurso.renglones` (arreglo ordenado). El render de
`#tabla-renglones-cuerpo` recorre ese arreglo con `forEach((renglon, indice) => ...)`. Los botones "Modificar" y
"Quitar" de cada fila llaman `modificarRenglon(indice)` / `quitarRenglon(indice)`. Tras cada mutación se llama
`renderRenglonesEnCurso()`, que **reconstruye todas las filas** desde el arreglo.

**Por qué.** `index.html` está congelado y la plantilla `#plantilla-renglon` no tiene atributos `data-*`; añadirlos
implica tocar HTML o inventar convenciones frágiles. Reconstruir desde el arreglo es determinista, no requiere
identidad persistente, no acumula listeners duplicados (se recrean los nodos) y respeta `textContent`. El índice es
estable mientras el arreglo sea el origen de verdad.

**Alternativa descartada.** `data-indice` / `data-venta-id` en las filas: requiere atributos que la plantilla
congelada no declara. Closure por renglón: sobrevive a la reconstrucción del DOM de forma inconsistente si se
reordenan filas.

### D-03 — "Modificar renglón" sin input inline: `prompt()`

**Decisión.** El botón `.boton--modificar` abre `window.prompt()` pidiendo la nueva cantidad; se valida entero > 0 y,
si pasa, se actualiza el renglón y se recalcula. Si el usuario cancela (`null`) no se muta el estado. La validación es
la misma que la de `agregarRenglon()`.

**Por qué.** La tabla congelada no tiene input de cantidad por fila y no podemos agregarlo sin tocar `index.html`.
`prompt()` es API nativa del navegador (cero dependencias), funciona en `file://` y no requiere estructura nueva. La
validación queda en JS, así que un valor inválido no rompe el estado (la spec lo exige).

**Alternativa descartada.** Reutilizar `#renglon-libro`/`#renglon-cantidad` para editar: el formulario de alta es para
agregar y confundiría el flujo. Insertar un input en la celda `.fila-renglon__cantidad` desde JS: sí agrega estructura
que la plantilla no declara; se descarta por menor fidelidad al HTML congelado.

### D-04 — Cliente vacío: validación resiliente sin opción placeholder

**Decisión.** `confirmarVenta()` valida así: obtiene `clienteId = #venta-cliente.value`; si está vacío **o**
`obtenerClientes().some(c => c.id === clienteId)` es falso, rechaza con mensaje de error ("Seleccioná un cliente
válido") y hace foco en `#venta-cliente`. `poblarSelectoresRelacionados()` repuebla el select tras altas y, al no
existir opción vacía en el HTML, el primer cliente de la semilla queda preseleccionado por defecto: no se puede
confirmar "sin cliente" eligiendo una opción placeholder inexistente.

**Por qué.** No hay opción vacía en `#venta-cliente` y no podemos agregarla sin tocar HTML. La validación por
pertenencia al conjunto de clientes (no por "value vacío") cubre el caso real: select sin opciones (catálogo de
clientes vacío) o valor que ya no existe tras una repoblación. Cumple el escenario "No se confirma sin cliente"
aunque el camino de "elegir vacío" no exista en la UI.

**Alternativa descartada.** Insertar `<option value="">` por JS: contradice el diseño del select congelado y cambia la
semántica de foco. Confiar solo en `!clienteId`: falla silenciosa si el select queda sin opciones.

### D-05 — `novalidate` en `#form-venta` vía JS, con validación 100% propia

**Decisión.** `inicializarVentas()` ejecuta `document.getElementById("form-venta").noValidate = true` y
`#form-venta` recibe un listener `submit` con `event.preventDefault()`. Toda validación (cliente, >=1 renglón,
cantidades enteras > 0) es de JS; no se depende de la validación nativa ni de `required`/`min`.

**Por qué.** El HTML congelado no tiene `novalidate` ni `min` en `#renglon-cantidad` (`step="1"` sin `min`). Sin
`novalidate`, el navegador puede bloquear el `submit` antes de nuestro handler y romper los mensajes de
`#venta-mensaje-error`. `noValidate = true` es una propiedad DOM (no toca el archivo) y hace determinista la
validación en todos los navegadores. Cumple RN-VEN-09 y el escenario "No se confirma con cantidades inválidas".

**Alternativa descartada.** Depender de la validación nativa: inconsistente entre navegadores y no emite los mensajes
propios. Editar `index.html` para agregar `novalidate`: viola regla dura 12.

### D-06 — Formato de fecha y orden del historial

**Decisión.** `fecha` se guarda como **ISO 8601 completo** (`new Date().toISOString()`, p. ej.
`2026-10-22T14:35:07.123Z`), que es el formato que C-06 serializa sin transformación. El listado de historial se
ordena **más reciente primero**: `renderHistorial()` itera una **copia** `[...ventas].reverse()`; nunca muta `ventas`.
La fecha mostrada en la tabla es el valor ISO tal cual (texto legible y estable; sin `Intl.DateTimeFormat` para evitar
dependencia de zona horaria en la verificación).

**Por qué.** ISO es determinista, ordenable lexicográficamente y verificable en `localStorage`. El orden "más
reciente primero" es el recomendado por la spec y el único natural para un historial de ventas. Reversar sobre copia
preserva la invariante de que `ventas` es append-only (un único push, sin reordenamientos).

**Alternativa descartada.** `toLocaleString("es-AR")` para guardar: no ordenable ni estable entre entornos; se usa solo
si se necesitara presentación, que aquí no hace falta.

### D-07 — Cálculo numérico exacto; el formato de dos decimales es solo presentación

**Decisión.** `subtotal` y `total` se guardan y calculan como **números**:
`subtotal = cantidad * precioUnitario`, `total = renglones.reduce((s, r) => s + r.subtotal, 0)`. El redondeo a dos
decimales **no** se aplica al dato: se aplica solo al mostrarlo, con `formatearPrecio()` (`Intl.NumberFormat("es-AR",
{ minimumFractionDigits: 2 })`). El snapshot guarda el número crudo; la UI muestra `formatearPrecio(subtotal)` y
`formatearPrecio(total)`.

**Por qué.** RN-VEN-06/07/08 exigen la fórmula y dos decimales en la **presentación**. Los precios semilla son enteros
(`2500, 1800, 2200, 1950, 2100, 2700`), y `cantidad * precio` también lo es; redondear el dato introduciría
divergencia entre el total guardado y la suma de renglones restaurados por C-06. `formatearPrecio()` ya está
verificado en C-03/C-04: reutilizarlo garantiza consistencia.

**Alternativa descartada.** `Number(total.toFixed(2))` al guardar: puede romper la igualdad
`total === Σ subtotales` en casos con decimales y complica la validación de C-06 (que solo exige finitos).

### D-08 — Contrato de mensajes de error: obligatorio `{ motivo, campo }`

**Decisión.** Todo rechazo del flujo de venta construye `errores` como arreglo de objetos `{ motivo, campo }` y llama
a los helpers existentes:
`mostrarError(#venta-mensaje-error, #venta-mensaje-exito, [{ motivo, campo }])` o
`mostrarExito(#venta-mensaje-exito, #venta-mensaje-error)`.
Campos usados, todos existentes en `index.html`: `venta-cliente`, `renglon-libro`, `renglon-cantidad`.
**Regla dura del contrato:** `mostrarError` hace `document.getElementById(errores[0].campo).focus()`, por lo que
**todo error DEBE apuntar a un id existente**. El caso "sin renglones" **no tiene un campo propio en el HTML**; se
resuelve apuntando a `renglon-libro` con motivo "Agregá al menos un renglón a la venta." (el foco cae en el primer
control del fieldset de renglones). No se crean elementos nuevos ni se toca `index.html`.

**Por qué.** Reutilizar `mostrarError`/`mostrarExito` evita duplicar lógica y mantiene el patrón de C-04. Documentar
explícitamente el `campo` para "sin renglones" evita un `ReferenceError`/foco nulo por un id inventado.

### D-09 — Inicialización compatible con C-06, sin duplicar `cargarEstado()`

**Decisión.** Al final del archivo se agrega el bloque de ventas y **un tercer listener**
`document.addEventListener("DOMContentLoaded", inicializarVentas);` (después de `app.js:520`). `ventas` se declara
**`const ventas = []`** en el ámbito de módulo del script, para que C-06 pueda hacer `reemplazarContenido(ventas, ...)`
(reemplazo in situ) sin reasignar. El **único** `ventas.push(...)` está en `confirmarVenta()`, y C-06 insertará
`guardarEstado()` inmediatamente después de ese push. `inicializarVentas()` **no** llama a `cargarEstado()` ni a
`guardarEstado()`: la carga la agrega C-06 de forma síncrona al final del archivo, antes de que se dispare
`DOMContentLoaded`, de modo que los tres inicializadores renderizan el estado ya restaurado. Múltiples
`DOMContentLoaded` son válidos y se ejecutan en orden de registro.

**Por qué.** Es exactamente el contrato del design de C-06 (D-03: `const` con reemplazo in situ; D-04: `cargarEstado()`
al final; D-05: `guardarEstado()` tras el push). Declarar `const ventas = []` (no `let`) evita reasignaciones
accidentales y obliga a C-06 a usar `splice`, que preserva las referencias capturadas por los closures de este change.

**Alternativa descartada.** Declarar `let ventas = []`: invita a reasignar y a romper closures. Llamar a
`cargarEstado()` desde `inicializarVentas()`: acopla la carga al orden de listeners y contradice la decisión de C-06.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Perder el precio histórico leyendo `libro.precio` al renderizar historial/detalle | D-07: el renglón guarda `precioUnitario` copiado; historial y detalle leen **solo** el snapshot. Verificación guiada del precio histórico como control obligatorio. |
| Duplicar renglones del mismo libro (RN-VEN-03) | D-… fork: `agregarRenglon()` busca por `libroId` en `ventaEnCurso.renglones`; si existe, **suma** cantidad y recalcula, sin crear fila nueva, e informa el duplicado. |
| Reinyectar HTML desde texto del usuario | Todo se inserta con `textContent` (títulos, nombres, ISBN). Regla dura 10 / RN-CAT-08. |
| `mostrarError` con `campo` inexistente ⇒ foco nulo | D-08: solo se usan ids existentes; "sin renglones" apunta a `renglon-libro`. |
| El `submit` nativo bloquea el handler y no se ve el mensaje | D-05: `noValidate = true` + `preventDefault()`; validación propia total. |
| Romper C-03/C-04 por reformateo | Solo se **agrega** al final; no se modifican ni renombran funciones ni listeners existentes (D-01, D-09). |
| C-06 no encuentra `ventas` o hay dos puntos de push | D-09: `const ventas = []` global, un solo `ventas.push(...)` en `confirmarVenta()`, sin tocar `cargarEstado()`/`guardarEstado()`. |
| `prompt()` bloqueado o no disponible | D-03: cancelar no muta estado; el flujo de quitar/agregar sigue operativo. Degradación segura. |
| Scroll horizontal a 320px en tablas | Sin CSS nuevo; las tablas usan `.tabla-contenedor` existente. El control manual de 320px queda en la verificación (no se agrega CSS). |
| Caso manual "2×1500 + 1×2000" no reproducible con la semilla | Verificación (tasks): crear antes dos libros a 1500 y 2000 vía C-04; dejar ese prerrequisito explícito. |

## Contract handed to C-06 (explicit)

1. `const ventas = []` declarado en el ámbito del script de `js/app.js`.
2. **Exactamente un** `ventas.push(...)`, dentro de `confirmarVenta()`, con la venta completa:
   `{ id, fecha, clienteId, clienteNombre, renglones, total }`.
3. Cada `renglon` es `{ libroId, titulo, isbn, precioUnitario, cantidad, subtotal }` (snapshot copiado; nunca recalculado).
4. C-06 agrega `guardarEstado()` **inmediatamente después** de ese único push.
5. C-06 agrega la llamada síncrona a `cargarEstado()` **al final de `app.js`**, tras el registro del tercer listener;
   como el script es `defer`, corre antes de `DOMContentLoaded` y los tres inicializadores (`inicializarCatalogo`,
   `inicializarAltas`, `inicializarVentas`) renderizan el estado restaurado.
6. `ventas` es `const`: C-06 restaura por reemplazo in situ (`ventas.splice(0, ventas.length, ...restauradas)`), nunca
   reasignando ni concatenando.
7. Este change **no** declara ni llama a `guardarEstado()`/`cargarEstado()`.

## Migration Plan

1. Implementar el bloque de ventas en `js/app.js` (agregar al final, sin reformatear), siguiendo D-01..D-09.
2. Verificar sintaxis con `node --check js/app.js`.
3. Ejecutar los casos manuales 4-6 y la comprobación guiada del precio histórico en navegador real, con evidencia por
   control {aprobado, fallido, omitido, pendiente}.
4. Al cerrar: escribir `docs/ejercicio5-implementacion-resumen.md` con evidencia real y marcar `[x]` en `CHANGES.md`
   (responsabilidad del orquestador).

## Open Questions

Ninguna. Las nueve decisiones (D-01..D-09) cierran los nueve puntos abiertos del planning previo. Los nombres que C-06
debía "confirmar contra el código restaurado" quedan fijados aquí (`confirmarVenta`); C-06 no cambia spec ni enfoque.
