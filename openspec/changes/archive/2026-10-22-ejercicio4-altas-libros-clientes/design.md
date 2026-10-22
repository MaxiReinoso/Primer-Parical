# Design: C-04 ejercicio4-altas-libros-clientes

## Context

**Estado actual verificado** (inspección directa del repositorio en `main` @ `53aeb7d`, rama `parte-4`):

- `index.html` (264 líneas) ya tiene los dos formularios completos, sus campos, sus mensajes y sus
  tablas: `#form-libro` (`46-80`), `#libro-mensaje-{exito,error}` (`82-83`), `#tabla-libros` (`86-98`),
  `#form-cliente` (`106-118`), `#cliente-mensaje-{exito,error}` (`120-121`), `#tabla-clientes` (`124-132`).
- Los selectores están **vacíos**: `#libro-editorial` (`64`), `#libro-genero` (`69-71`, solo «Sin
  clasificar»), `#libro-autores` (`76`), `#venta-cliente` (`143`), `#renglon-libro` (`151`).
- `css/` tiene todo lo necesario: `.mensaje--exito`, `.mensaje--error`, `.mensaje[hidden]`, `.tabla`,
  `.campo__control`, `select[multiple]`.
- `js/app.js` (203 líneas) tiene los arrays con la semilla mínima, los getters, el filtro y el render
  del catálogo. **No tiene ninguna lógica de alta**: ni validaciones, ni listeners de `submit` sobre los
  formularios de alta, ni render de las tablas de libros y clientes.
- Los datos semilla de C-03 cumplen el mínimo de la consigna y `lib-5` cubre el caso «Sin clasificar»:
  **no hay ningún problema que justifique tocar los datos iniciales**.

**Restricciones que moldean el diseño**:

| Restricción | Origen |
|---|---|
| `index.html` y `css/` son de C-01 y C-02; solo se tocan **si el change lo declara** | Regla dura 12 (DD-01) y guía de `apply` de `openspec/config.yaml` |
| `js/app.js` lo comparten C-03, C-04, C-05 y C-06; el merge se serializa | `CHANGES.md` §Reparto de propiedad de archivos |
| Cero dependencias, cero URLs externas, se abre con `file://` | RN-GL-01, RN-GL-02, RN-GL-03 |
| Los datos del usuario se insertan **como texto** | RN-CAT-08 |
| La spec vive **solo** en OpenSpec; en `docs/` va únicamente el resumen de implementación | `openspec/config.yaml` → `rules.docs` |

## Goals / Non-Goals

**Goals**

- Que el formulario de libros registre un libro válido y rechace cualquier alta inválida, con un motivo
  concreto en pantalla.
- Que el formulario de clientes registre un cliente válido y rechace cualquier alta inválida, con un
  motivo concreto en pantalla.
- Que la validación sea **íntegramente JavaScript**, sin depender de la validación de restricciones del
  navegador.
- Que tras un alta correcta se actualicen, sin recargar, el listado, el catálogo y los selectores
  relacionados.
- Tocar **un solo archivo de producto** (`js/app.js`) más los dos atributos `novalidate` en `index.html`
  que hacen posible el objetivo anterior.

**Non-Goals**

- Cualquier cosa del Ejercicio 5 (ventas, renglones, total, historial) o del Ejercicio 6 (`localStorage`,
  `README.md`).
- Editar o eliminar registros; administrar editoriales, géneros o autores.
- Refactorizar `js/app.js` o unificar estilos: este change **agrega**, no reformatea.
- Cambiar el diseño, las clases CSS o la estructura del HTML.

## Decisions

### D-01 — La validación es 100 % JavaScript: `novalidate` en los dos formularios

**Contexto.** `#cliente-email` es `type="email"` (`index.html:114`) y `#libro-precio` es `type="number"`
`step="0.01"` (`index.html:59`). El navegador valida ambos de forma nativa y, cuando un control es
inválido, **bloquea el envío**: el evento `submit` no se dispara. En ese caso la validación de
JavaScript no corre, `#cliente-mensaje-error` no aparece y el usuario solo ve el globo nativo del
navegador — que la consigna no contempla (los errores deben mostrarse *cerca del formulario*) y que el
repo prohíbe como única señal (RN-PRE-06: el error se expresa con texto, no solo con color).

**Alternativas consideradas.**

| Alternativa | Qué implica | Por qué no |
|---|---|---|
| A — Listener `invalid` en fase de captura | Solo JS; se suprime el globo con `preventDefault()` y se muestra el mensaje propio | Funciona, pero deja la validación nativa activada: el control sigue siendo inválido para el navegador y el envío queda bloqueado por el navegador, no por nuestra lógica. Es una solución de esquive, no de diseño |
| B — `novalidate` en `#form-libro` y `#form-cliente` | 2 atributos en `index.html`; toda la validación pasa a ser nuestra | **Elegida** |
| C — Dejar la validación nativa | 0 cambios | Rompe R-16/R-21: el mensaje de error propio no aparece nunca para un email mal formado |

**Decisión: B.** Con `novalidate` el navegador no valida ni bloquea: el `submit` siempre se dispara, y
nuestra validación decide. Es además la coherente con RN-GL-04 (la validación es de la práctica y la
escribe el estudiante, no el navegador) y con el diseño pedagogical que pide la consigna.

**Consecuencia sobre el alcance.** `index.html` deja de estar congelado **para este change**: se
modifica en **exactamente 2 atributos**, sin tocar estructura, campos, nombres, identificadores,
relaciones ni textos. La excepción queda declarada en `proposal.md` (§Impact), en este `design.md` y en
`tasks.md`, y se refleja en `CHANGES.md` §Reparto de propiedad de archivos. Es la condición que la
propia regla dura 12 exige: *"salvo que el change lo declare explícitamente"*.

**Trade-off aceptado.** Un `index.html` que se aparta del congelado de C-01: si otro change(\[C-05,
C-06\]) mergea sobre `index.html` después de C-04, el orden de merge debe respetar esta dependencia
(`C-04` antes que `C-05`). El cambio es de 2 atributos y no genera conflicto semántico con nadie.

### D-02 — El email exige un punto en el dominio

**Contexto.** La consigna exige «un formato válido» sin definirlo. El criterio del HTML acepta `a@b`
(dominio de una sola etiqueta).

**Alternativas.** Aceptar el criterio del HTML (`a@b` válido) · exigir un punto en el dominio.

**Decisión: exigir un punto.** Regla: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Es sencilla, sin dependencias,
coherente con la práctica y rechaza las direcciones que la consigna considera inválidas. Además, la
comparación de duplicados es **case-insensitive** (RN-CLI-04), así que el formato se valida sobre el
valor ya normalizado.

**Trade-off aceptado.** Se rechazan direcciones técnicamente válidas según RFC (`a@b`). Es aceptable en
el alcance del parcial y evita que el docenteiscounta como "email válido" un caso claramente inválido.

### D-03 — El ISBN se compara normalizado y sin distinguir mayúsculas

**Contexto.** RN-LIB-10 pide comparar el ISBN «sin espacios ni guiones». La consigna aclara que el
dígito de control **no** se implementa.

**Decisión.** `normalizarIsbn()` = `trim()` + eliminación de **todos** los espacios (incluidos los
interiores) y guiones. La comparación no distingue mayúsculas: el dígito de control del ISBN no lo
hace, y una comparación más estricta solo puede **rechazar más**, nunca menos.

**Consecuencia.** `"978-0307474728"`, `"9780307474728"` y `"978 0307474728"` colisionan entre sí y con
el ISBN de `lib-1`.

### D-04 — El catálogo respeta el filtro activo

**Contexto.** Tras un alta hay que actualizar el catálogo (el caso manual exige que el libro válido
"aparezca en catálogo y selección de venta"). Si el usuario tiene una búsqueda escrita, hay dos
lecturas posibles.

**Decisión: respetar el filtro activo.** El catálogo se vuelve a renderizar con
`renderCatalogo(filtrarLibros(buscador.value))`: el libro recién creado **se registra correctamente**
(queda en `libros`, en el listado de libros registrados y en `#renglon-libro`), pero **no aparece en
los resultados filtrados** hasta que la búsqueda coincida o se borre. La alternativa (re-renderizar el
catálogo completo ignorando el filtro) haría que la vista contradiga lo que el usuario está leyendo.

**Consecuencia.** El listado de libros registrados y `#renglon-libro` **sí** muestran siempre el libro
nuevo: son las vistas donde el usuario espera ver lo que acaba de cargar.

### D-05 — Un solo helper puebla los selectores de la vista de Ventas

**Contexto.** `CHANGES.md` asigna a C-04 actualizar `#renglon-libro` y `#venta-cliente` tras cada alta,
pero el scope de C-05 incluye "poblar selectores". Es un solapamiento real de propiedad.

**Decisión.** `poblarSelectoresRelacionados()` vive en **C-04** y se llama **al inicializar** y **después
de cada alta**. C-05 la reutiliza y le agrega la lógica de venta (renglones, total, confirmación) que
**no** es de este change.

**Contrato del helper (lo que C-05 va a consumir).** Nombre exacto `poblarSelectoresRelacionados`,
**sin argumentos**, **sin valor de retorno**, y es la **única** función que escribe las opciones de
`#venta-cliente` y `#renglon-libro`: ninguna otra función debe agregar opciones a esos dos selectores.
**Preserva la selección actual**: antes de reconstruir las opciones guarda el `value` seleccionado y,
después de reconstruirlas, lo restaura si ese valor sigue existiendo; si ya no existe, queda la
primera opción. Así, registrar un cliente mientras se compone una venta no borra el cliente elegido.

**Coordinación con C-05.** El contrato queda registrado en la fila de C-05 de `CHANGES.md` §Reparto de
propiedad de archivos (tarea 10.1): *C-04 define `poblarSelectoresRelacionados()` y C-05 la reutiliza,
no la reimplementa*. El scope de C-05 en `CHANGES.md` dice "poblar selectores"; con este contrato esa
población queda **sin duplicar**: la hace la función que C-04 entrega y C-05 consume.

**Alternativa descartada.** Dejar la población inicial a C-05: los selectores quedarían vacíos hasta la
primera alta, lo que rompe la lectura de la vista de Ventas.

### D-06 — Identificadores `lib-N` y `cli-N` calculados sobre el conjunto actual

**Contexto.** El modelo de datos exige `id` estable; la semilla usa `lib-1…lib-6` y `cli-1…cli-3`.

**Decisión.** `generarIdLibro()` y `generarIdCliente()` calculan el siguiente sufijo numérico **leyendo
el array actual**, de modo que el id es único, sigue el patrón del modelo de datos y sigue siendo válido
cuando el Ejercicio 6 agregue `localStorage` (el cálculo se hace sobre el conjunto cargado, no sobre un
contador de sesión).

**Alternativa descartada.** `crypto.randomUUID()`: rompe el patrón `lib-N`/`cli-N` del modelo de datos.

### D-07 — Las tablas de libros y clientes no tienen estado vacío

**Contexto.** El HTML congelado no tiene un contenedor de "sin registros" para esas dos tablas (sí lo
tiene para el catálogo: `#catalogo-vacio`).

**Decisión.** No se agrega. La semilla garantiza 6 libros y 3 clientes, y en este punto no existe la
baja de registros: la tabla nunca queda vacía. Agregar el mensaje requeriría tocar `index.html` más
allá de los 2 atributos autorizados.

### D-08 — El motivo del error reemplaza el texto genérico del mensaje

**Contexto.** `#libro-mensaje-error` trae el texto genérico "No se pudo registrar el libro. Revisá los
datos." y hay **un** mensaje por formulario.

**Decisión.** El `textContent` del mensaje se **reemplaza** por el motivo concreto del rechazo (por
ejemplo "El ISBN 978-0307474728 ya está registrado."). El elemento, su clase `.mensaje--error` y su
`role="alert"` ya están; lo que cambia es el texto.

**Alternativa descartada.** Conservar el texto genérico y agregar el motivo aparte: no hay dónde.

### D-09 — Con varios errores simultáneos se muestra el primero

**Contexto.** Un formulario puede tener varios errores a la vez, pero hay un solo mensaje por formulario.

**Decisión.** Se muestra **el primer** error según el orden de validación (el más básico primero) y se
enfoca su campo. El usuario corrige y vuelve a enviar: el siguiente error aparece. Acumular todos los
motivos en un solo párrafo sería menos usable y menos accesible.

### D-10 — El precio no se redondea ni se limita en decimales

**Contexto.** RN-LIB-04 exige «precio numérico y mayor que cero», y nada más. La consigna no fija
decimales. El HTML declara `step="0.01"`, pero con `novalidate` (D-01) esa restricción deja de
aplicarse y el valor llega tal cual a la validación.

**Decisión.** La validación comprueba **numérico y mayor que cero**, y nada más. Un precio como
`10.555` **se acepta y se guarda sin redondear**, y el listado lo muestra tal como fue ingresado.
**No se impone un límite de decimales ni se redondea el valor** sin autorización explícita.

**Por qué no redondear.** El redondeo a dos decimales pertenece a la presentación de importes de la
vista de Ventas (RN-VEN-08, Ejercicio 5). Imponer un tope en el alta impondría una regla que la consigna
no pide y que podría rechazar un alta válida.

**Consecuencia.** El control 7.2 verifica que `10.555` se acepta y que aparece sin redondear; la tarea
5.1 deja explícito que no se puede agregar un tope de decimales sin autorización.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| **Romper el catálogo ya verificado** (20 + 15 pts ya entregados) | No se modifica ninguna función existente de C-03: se agregan funciones y un listener nuevo. Control de regresión con los controles de `docs/ejercicio3-implementacion-resumen.md` |
| **Inserción de HTML interpretable** en los listados | Solo `textContent` / `createTextNode` (RN-CAT-08); control explícito con un título que contiene marcado |
| **`novalidate` no aplicado** → el globo nativo tapa el mensaje propio | Control explícito en navegador: enviar un email mal formado y verificar que aparece el mensaje de la página y no el del navegador |
| **Solapamiento con C-05** sobre `#venta-cliente` y `#renglon-libro` | D-05: una sola función, sin lógica de venta, reutilizable por C-05 |
| **Conflicto de escritura en `js/app.js`** con C-05 y C-06 | El merge se serializa **C-03 → C-04 → C-05 → C-06** (regla del repo) |
| **Filtro activo que oculta el libro recién creado** | D-04: es el comportamiento pedido; el listado de libros registrados y `#renglon-libro` sí lo muestran siempre |
| **Ids que colisionen** con registros futuros | D-06: el cálculo se hace sobre el conjunto actual, también con `localStorage` |
| **Un tope de decimales no pedido** que rechace un alta válida | D-10: la validación solo exige «numérico y mayor que cero»; `10.555` se acepta sin redondear y **no se impone un límite sin autorización** |
| **`AGENTS.md` y `CLAUDE.md` quedan desactualizados** tras cambiar la propiedad de archivos | No se editan a mano (son generados): se deja registrada la **regeneración pendiente** para el equipo, que la resuelve con `agents-md-generator` re-sincronizando `knowledge-base/` y `CHANGES.md` (tarea 10.6) |

## Migration Plan

No aplica: no hay datos persistidos, ni despliegue, ni usuarios previos. El cambio es aditivo sobre el
código estático; si hubiera que revertirlo, alcanza con deshacer los 2 atributos de `index.html` y las
funciones agregadas en `js/app.js` (el resto del archivo no se toca).

## Open Questions

Ninguna abierta. Las cuatro preguntas de la especificación quedaron resueltas por el docente el
2026-10-21: formato de email (D-02), validación nativa (D-01), comportamiento del catálogo frente al
filtro (D-04) y ubicación de la documentación (abajo). El punto del precio con más de dos decimales
quedó resuelto por interpretación del requisito en D-10, y la regeneración de `AGENTS.md` y
`CLAUDE.md` queda registrada como pendiente (tarea 10.6), sin bloquear la implementación.

## Trazabilidad: dónde quedó cada parte de la SPEC aprobada

La SPEC se redactó como documento único y, al confirmarse la convención de OpenSpec, se **distribuyó**
en los cuatro artefactos de este change, **sin dejar copias**:

| Parte de la SPEC | Ubicación actual |
|---|---|
| Objetivo, alcance, exclusiones, estado actual, diagnóstico, reglas de negocio, CA | `proposal.md` |
| Los 26 requisitos (R-01…R-26) como comportamiento observable con escenarios WHEN/THEN | `specs/altas-libros-clientes/spec.md` |
| Diseño de funciones, validaciones, flujos, compatibilidad con los datos, supuestos y decisiones | `design.md` (este archivo) |
| Casos de error, casos límite y comprobaciones | `tasks.md` (53 tareas, cada una con su requisito y su comprobación) |

`docs/SPEC-punto-4.md` se elimina: `openspec/config.yaml` → `rules.docs` establece que *"la spec de
cada change vive SOLO en OpenSpec [...] No la dupliques en `docs/`"*, y en `docs/` va únicamente
`docs/ejercicio4-implementacion-resumen.md` con la evidencia de la verificación.