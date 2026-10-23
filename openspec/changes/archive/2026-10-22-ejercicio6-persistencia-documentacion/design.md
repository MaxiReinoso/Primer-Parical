# Design: C-06 ejercicio6-persistencia-documentacion

## Context

Ver `proposal.md` §Why. Estado del repositorio verificado el 2026-10-22 sobre `main` (`41a54d9`):

- `js/app.js` (520 líneas) contiene C-03 + C-04: arrays `editoriales`, `generos`, `autores`, `libros`,
  `clientes`; getters; `filtrarLibros`/`renderCatalogo`; `poblarSelectoresRelacionados`; `registrarLibro`,
  `registrarCliente`; dos listeners `DOMContentLoaded` (`inicializarCatalogo` y `inicializarAltas`). **No
  hay `ventas`, ni `registrarVenta`, ni `confirmarVenta`, ni historial.**
- `index.html` (264 líneas) ya contiene las 5 vistas, `#form-venta`, `#venta-cliente`, `#renglon-libro`,
  `#tabla-renglones-cuerpo`, `#venta-total`, `#tabla-historial-cuerpo`, `#historial-vacio`,
  `#historial-detalle-vacio`, `#tabla-detalle-cuerpo`, `#venta-mensaje-{exito,error}` y la plantilla
  `#plantilla-renglon`. No existe ningún contenedor de mensaje de persistencia.
- `README.md` **no existe** (`Test-Path README.md` → `False`).
- `openspec/specs/` contiene `estructura-html`, `presentacion-css`, `catalogo-filtro` y
  `altas-libros-clientes`. **No existe `venta-historial`**, aunque el change C-05 figure archivado.
- `js/app.js` se carga con `defer`: se ejecuta después del parseo del HTML y **antes** de
  `DOMContentLoaded`.
- Los arrays de dominio son `const`: no se pueden reasignar; su contenido sí se puede reemplazar in situ.
- `generarIdLibro()`/`generarIdCliente()` calculan el siguiente id leyendo el array actual (C-04 D-06),
  por lo que siguen siendo correctos sobre un conjunto restaurado.

Restricciones que moldean el diseño:

| Restricción | Origen |
|---|---|
| Solo se tocan `js/app.js` y `README.md`; `index.html` y `css/` son de C-01/C-02 | Regla dura 12 y `CHANGES.md` §[C-06] |
| Cero dependencias, cero URLs externas, apertura por `file://`, cero build | RN-GL-01, RN-GL-02, RN-GL-03 |
| Datos del usuario y datos restaurados se insertan como texto | RN-CAT-08 y regla dura 13 |
| Ningún control se declara aprobado sin ejecutarlo | Regla dura 11 |
| La spec vive solo en OpenSpec; `docs/` solo lleva el resumen de implementación | `openspec/config.yaml` → `rules.docs` |

### Gap de C-05: estado real

C-05 está **archivado pero no implementado en `main`**:

- `git show --stat 292462e` lista solo `docs/ejercicio5-implementacion-resumen.md` y los cuatro
  artefactos del change; no aparecen cambios en `js/app.js`.
- `git log --all -S "registrarVenta"` no devuelve ningún commit.
- `js/app.js` no tiene `ventas` ni lógica de venta/historial.
- `openspec/specs/venta-historial/` no existe.

C-06 **no puede** implementar C-05: está fuera de su propiedad de archivos/alcance y duplicaría un
change ajeno. El diseño trata el flujo de venta como **dependencia externa bloqueante** (D-08).

## Goals / Non-Goals

**Goals**

- Persistir `{ libros, clientes, ventas }` bajo una única clave versionada, con arranque determinista.
- Restaurar sin duplicar la semilla y sin confiar en la forma del JSON guardado.
- Enganchar una escritura única y consistente después de cada mutación.
- Entregar un `README.md` verificable que permita reproducir los 8 casos manuales y la comprobación del
  precio histórico.
- No tocar `index.html`, `css/`, `CHANGES.md` (más allá del checkbox de cierre) ni changes archivados.

**Non-Goals**

- Reparar o reimplementar C-05.
- Editar/eliminar registros, administrar editoriales/géneros/autores, sincronizar usuarios.
- Cambiar estilos, estructura HTML o crear utilidades de test/dependencias.
- Exportar/importar el estado o migrar datos de otras versiones.

## Decisions

### D-01 — Una sola clave y una sola forma de estado

**Decisión.** `localStorage` guarda exactamente una entrada de dominio:

```json
{
  "libros":    [ { "id": "lib-1", "titulo": "…", "isbn": "…", "precio": 2500, "editorialId": "ed-1", "generoId": "gen-1", "autorIds": ["aut-1"] } ],
  "clientes":  [ { "id": "cli-1", "nombre": "…", "email": "…" } ],
  "ventas":    [ { "id": "ven-1", "fecha": "…", "clienteId": "cli-1", "clienteNombre": "…",
                   "renglones": [ { "libroId": "lib-1", "titulo": "…", "isbn": "…",
                                    "cantidad": 2, "precioUnitario": 1500, "subtotal": 3000 } ],
                   "total": 5000 } ]
}
```

Clave: `libreria-el-estante:v1`. Las entidades de catálogo (`editoriales`, `generos`, `autores`) **no**
se persisten: son datos fijos del código y no se gestionan desde la interfaz.

**Alternativas descartadas.**

| Alternativa | Por qué no |
|---|---|
| Una clave por entidad (`…:libros`, `…:clientes`, `…:ventas`) | Tres lecturas/escrituras no atómicas; una recarga intermedia deja el estado incoherente; el README tendría que explicar tres rutas en vez de una |
| Persistir las ventas dentro de cada libro/cliente | Cambia el modelo de datos y rompe la invariante de precio histórico |
| Guardar solo un contador o un flag de "ya inicializado" | No conserva los registros; incumple RN-PER-01 |

### D-02 — Versión en la clave, no dentro del objeto; migración explícita y conservadora

**Decisión.** La versión vive en el sufijo de la clave (`:v1`). El objeto guardado contiene solo
`libros`, `clientes` y `ventas`. Si en el futuro cambia la forma, se agrega `guardarEstadoV2` /
`normalizarEstadoV2` y se sube la clave a `:v2`; **no** se reescribe `:v1` en silencio ni se migran
datos de forma implícita.

**Alternativas.**

| Alternativa | Por qué no |
|---|---|
| Campo `version` dentro del JSON | Agrega un campo que no es del dominio y complica la ruta que el docente debe inspeccionar (`…v1 → libros[i].precio`) |
| Migración automática "best effort" | Sin versiones previas reales, la migración sería código muerto y una fuente de corrupción |

**Consecuencia.** Una clave `libreria-el-estante:v0` o con otro nombre se ignora: no se migra, no se
duplica y no se borra. El README documenta únicamente `:v1`.

### D-03 — Restauración por reemplazo in situ, nunca por concatenación

**Contexto.** `libros` y `clientes` son `const`; C-05 declarará `ventas` (probablemente `const ventas = []`).

**Decisión.** Un helper `reemplazarContenido(coleccion, nuevos)` hace
`coleccion.splice(0, coleccion.length, ...nuevos)`. `cargarEstado()` lo usa para las tres colecciones.
Nunca se hace `libros.push(...guardados)` ni `libros = guardados`.

**Por qué.** Concatenar es exactamente el bug que RN-PER-03 prohíbe: en la segunda recarga los 6 ejemplos
volverían a sumarse. El reemplazo in situ preserva las referencias que ya capturaron los closures de
C-03/C-04/C-05 y no requiere cambiar `const` por `let` ni reformatear código ajeno.

**Alternativa descartada.** Convertir los arrays a `let` y reasignarlos: toca declaraciones de C-03/C-04,
puede romper closures que capturaron el array anterior y aumenta el diff sobre código ya verificado.

### D-04 — `cargarEstado()` corre una vez al final de `app.js`, antes de `DOMContentLoaded`

**Contexto.** Ya existen dos listeners `DOMContentLoaded` (`inicializarCatalogo` en `app.js:207`,
`inicializarAltas` en `app.js:520`) y C-05 agregará el suyo. Registrar un tercer listener de
inicialización no garantiza orden: los listeners se ejecutan en orden de registro y los dos existentes
renderizarían la semilla antes de restaurar.

**Decisión.** La llamada `cargarEstado()` se coloca **sincrónicamente al final del archivo**, después de
todas las declaraciones (incluida `ventas` de C-05) y de los registros de listeners. Como el script es
`defer`, el archivo se evalúa completo **antes** de que se dispare `DOMContentLoaded`; por lo tanto los
tres inicializadores existentes encuentran el estado ya restaurado y renderizan una sola vez lo correcto.

**Alternativas.**

| Alternativa | Por qué no |
|---|---|
| Nuevo listener `DOMContentLoaded(inicializarPersistencia)` registrado antes de los existentes | Obliga a insertar el registro por encima de `app.js:207`, es frágil ante futuros cambios de orden y acopla la persistencia al orden de registro |
| Llamar `cargarEstado()` dentro de `inicializarCatalogo()` | Modifica una función de C-03 ya verificada y deja a `inicializarAltas` dependiendo de que el catálogo se haya ejecutado antes |
| Llamada al inicio del archivo | `ventas` de C-05 todavía no existe (TDZ si es `const`); produciría `ReferenceError` |

**Consecuencia.** `cargarEstado()` debe ser una función pura de lectura + normalización + reemplazo, sin
tocar el DOM. Toda renderización sigue a cargo de los inicializadores existentes.

### D-05 — `guardarEstado()` escribe un snapshot completo después de cada mutación

**Decisión.** `guardarEstado()` serializa `{ libros, clientes, ventas }` y hace un único
`localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado))`. Se llama **solo** después de una mutación
exitosa:

- `registrarLibro()` → después de `libros.push(...)` y de los renders.
- `registrarCliente()` → después de `clientes.push(...)` y de los renders.
- flujo de confirmación de venta de C-05 → después de `ventas.push(...)`.

No se guarda al cargar, para no crear la clave antes de que exista un cambio real y para no convertir un
problema de cuota en un fallo de arranque. La clave aparece en `localStorage` con la primera alta o venta;
el README lo explica y la comprobación guiada siempre parte de una venta confirmada.

**Alternativas.**

| Alternativa | Por qué no |
|---|---|
| Guardar en cada evento `input`/`change` | Escribe decenas de veces por formulario, sin beneficio: el estado del dominio solo cambia al confirmar |
| Guardar al cerrar (`beforeunload`) | Poco fiable, no cubre cierres abruptos y retrasa la evidencia |
| Guardar con debounce | Agrega temporización y una ventana de pérdida; el dataset es mínimo y la escritura es barata |

**Contrato para C-05.** El punto único que agrega la venta a `ventas` DEBE llamar a `guardarEstado()` una
vez, después de que la venta quede completa (`id`, `fecha`, cliente, renglones con `precioUnitario`
histórico y `total`). No se debe guardar un borrador ni una venta parcial.

### D-06 — Validación y normalización defensiva del estado restaurado

**Contexto.** Todo lo que llega de `localStorage` es entrada no confiable (regla dura 13): puede haber
sido editado a mano —de hecho, la comprobación guiada del docente **edita el precio a propósito**—, puede
estar truncado o venir de otra versión.

**Decisión.** `normalizarEstado(valor)` devuelve `{ estado, valido, motivo }` y aplica esta política:

| Nivel | Regla | Resultado |
|---|---|---|
| JSON | `JSON.parse` falla | `valido: false`; se descarta y se usa la semilla |
| Raíz | `null`, array o primitivo | `valido: false`; se descarta |
| Colecciones | `libros`, `clientes` o `ventas` no son arrays | `valido: false`; se descarta el estado completo |
| Registro de libro | `id`/`titulo`/`isbn`/`editorialId` string no vacío; `precio` número finito > 0; `generoId` string o `null`; `autorIds` array de strings | Se conserva; si no cumple, se **omite** el registro |
| Registro de cliente | `id`/`nombre`/`email` string no vacío | Se conserva; si no cumple, se omite |
| Registro de venta | `id`/`fecha` y `renglones` array no vacío; `total` número finito; cada renglón con `libroId`, `cantidad` entero > 0, `precioUnitario` y `subtotal` finitos | Se conserva; si no cumple, se omite la venta |
| Propiedades extra | Cualquier otra propiedad | Se ignora al normalizar |

`normalizarEstado` **no** recalcula precios ni totales: copia los valores guardados tal cual. Recalcular
rompería la invariante histórica que el docente evalúa.

**Alternativa descartada.** Descartar el estado completo ante un solo registro inválido: perdería altas
válidas por un registro corrupto y haría que una edición manual menor borre toda la sesión. La política
elegida degrada por registro y conserva lo utilizable.

**Inserción segura.** No se agrega ningún camino de render nuevo: los registros normalizados entran a los
arrays y los render existentes siguen usando `textContent`. Un título guardado con `<img …>` se muestra
literal.

### D-07 — Errores de acceso, parseo y cuota: no romper la sesión y avisar con texto

**Decisión.**

- `leerEstadoCrudo()` envuelve el acceso en `try/catch` y distingue "clave ausente" de "acceso fallido".
- `cargarEstado()` atrapa el fallo de parseo/normalización, conserva la semilla y registra el motivo.
- `guardarEstado()` atrapa `QuotaExceededError` (y cualquier excepción de escritura), mantiene el estado
  en memoria y llama a `informarProblemaPersistencia(motivo)`.
- **Aviso visible sin tocar `index.html`**: `informarProblemaPersistencia` crea, la primera vez y de forma
  perezosa, un `<p class="mensaje mensaje--error" role="alert">` con `textContent` y lo inserta al final
  del `<footer class="pie">` (o antes del cierre de `<body>` si el footer no existe). Reutiliza clases y
  tokens existentes; no crea estilos nuevos ni modifica archivos de C-01/C-02. Si el elemento ya existe,
  actualiza su texto.
- Siempre se emite además `console.warn("[persistencia] …")` con el motivo técnico para diagnóstico.

**Alternativas.**

| Alternativa | Por qué no |
|---|---|
| Solo `console.warn` | Viola la exigencia de informar al usuario y hace invisible la pérdida de datos |
| `window.alert` | Bloqueante, no estilizable, interrumpe la operación y no respeta el patrón de mensajes del proyecto |
| Agregar un contenedor en `index.html` | Prohibido: `index.html` es de C-01 (regla dura 12) |

**Trade-off aceptado.** El aviso aparece al pie y no junto al formulario que disparó la escritura. Es el
único lugar neutro disponible sin modificar el HTML congelado; el texto identifica el problema y la
operación en memoria no se pierde.

### D-08 — Gap de C-05: contrato mínimo, fallback explícito y prerrequisito bloqueante

**Contexto.** Ver §Context. Sin C-05 no existe `ventas`, ni el flujo de confirmación, ni el historial; por
lo tanto no hay dónde enganchar la persistencia de ventas ni qué venta usar en la comprobación del precio
histórico.

**Decisión.**

1. **Prerrequisito bloqueante.** Antes de aplicar C-06 debe existir en `main` el flujo de venta de C-05.
   La tarea 0 de `tasks.md` lo verifica y detiene la aplicación si falta.
2. **Contrato mínimo esperado de C-05** (nombres a confirmar contra el código restaurado; no se inventan
   detalles): un arreglo `ventas`; una función de confirmación que, tras validar, agrega a `ventas` un
   objeto con `id`, `fecha`, cliente, `renglones` con `precioUnitario` copiado y `total`; y un render de
   historial que lee de `ventas` sin recalcular precios desde el catálogo.
3. **Fallback mientras C-05 no exista.** `cargarEstado()`/`guardarEstado()` usan
   `typeof ventas !== "undefined" ? ventas : []` y siempre escriben la propiedad `ventas`. Así:
   - la forma `{ libros, clientes, ventas }` se respeta desde el primer día;
   - C-06 puede persistir `libros` y `clientes` sin bloquearse;
   - cuando C-05 se restaure, la venta persistida empieza a funcionar sin cambiar la forma ni la clave.
4. **Prohibición de alcance.** C-06 no implementa `registrarVenta`, `confirmarVenta`, renglones, total ni
   historial. Si al aplicar C-06 el flujo sigue ausente, se aplica el fallback, se registra el caso manual
   4, 5 y 6 como **pendientes** en el README y se informa al orquestador.

**Alternativa descartada.** Implementar un flujo de venta mínimo dentro de C-06 "para poder probar": viola
la propiedad de archivos/change, duplica el trabajo de C-05 y haría que el README declare implementado
algo que pertenece a otro ejercicio.

### D-09 — Compatibilidad con ids, selectores y filtros restaurados

**Decisión.** No se agrega lógica de ids: `generarIdLibro()`/`generarIdCliente()` ya calculan el siguiente
sufijo sobre el array actual, restaurado incluido. Tras `cargarEstado()`:

- el catálogo respeta el filtro vacío inicial y muestra el conjunto restaurado;
- `poblarSelectoresRelacionados()` (C-04) reconstruye `#venta-cliente` y `#renglon-libro` con los
  conjuntos restaurados;
- las tablas de libros y clientes se renderizan desde los mismos arrays.

**Consecuencia.** No se cambia ningún id ni selector; `index.html` sigue intacto.

### D-10 — El README es un artefacto verificable, con evidencia por control

**Decisión.** `README.md` se organiza en secciones que mapean uno a uno los requisitos de
`documentacion-entrega`:

1. Integrantes y datos del parcial.
2. Cómo abrir sin npm, con URL `file://` de ejemplo (ruta relativa real del repo).
3. Navegación entre las 5 vistas.
4. Funcionalidades implementadas y pendientes (estado real; el gap de C-05 se declara si persiste).
5. Ubicación de la semilla (`js/app.js`, arrays `editoriales`, `generos`, `autores`, `libros`, `clientes`).
6. Funcionamiento y límites de `localStorage` (navegador, perfil, ubicación, no comparte entre usuarios;
   clave `libreria-el-estante:v1`).
7. Tabla de los 8 casos manuales con columnas `Caso | Estado | Motivo / resultado observado`, usando
   exactamente {aprobado, fallido, omitido, pendiente}. Ningún caso sin ejecutar se marca aprobado.
8. Imágenes: declaración de cero imágenes y estado **vacuo** del requisito de texto alternativo (no
   "aprobado").
9. Comprobación guiada del precio histórico: ruta exacta
   `libreria-el-estante:v1 → libros[i].precio` (catálogo) frente a
   `libreria-el-estante:v1 → ventas[j].renglones[k].precioUnitario` (histórico), los 4 pasos de la
   consigna y el resultado observado.
10. Alcance de la entrega: `index.html`, `css/`, `js/`, `README.md`; cero dependencias y cero build.

**Alternativa descartada.** README narrativo sin tabla de casos: no permite verificar el estado de cada
control ni cumple la regla dura 11.

### D-11 — Verificación sin framework: sintaxis, funciones puras en consola y casos manuales en navegador

**Contexto.** El proyecto no tiene test runner ni puede incorporarlo (cero dependencias, cero npm).

**Decisión.** Tres capas, sin archivos nuevos de test:

1. **Puerta de sintaxis:** `node --check js/app.js` debe salir con código 0. Detecta errores de parseo
   antes de abrir el navegador.
2. **Funciones puras en consola del navegador:** `normalizarEstado` se prueba con objetos fabricados
   (`null`, `[]`, colección no array, registro inválido, precio string, venta sin renglones) y se compara
   el resultado esperado. El snippet de consola queda documentado en `tasks.md`; no se agrega archivo.
   `cargarEstado`/`guardarEstado` se prueban contra `localStorage` real y se inspecciona la clave con
   `JSON.parse(localStorage.getItem("libreria-el-estante:v1"))`.
3. **Casos manuales en navegador real** (`12_casos_manuales.md`), con evidencia por control y estado
   {aprobado, fallido, omitido, pendiente}. La comprobación del precio histórico se ejecuta en una copia
   temporal del proyecto, nunca sobre la copia entregada.

Se descarta crear un HTML de test o un script `.js` extra: violaría la propiedad de archivos y el alcance
de entrega.

### D-12 — Propiedad de archivos y control de no regresión

**Decisión.** El diff de C-06 se limita a:

- `js/app.js`: bloque nuevo de persistencia + **una línea** de llamada en `registrarLibro`, **una** en
  `registrarCliente` y **una** en el punto de confirmación de C-05 (cuando exista), más la llamada final a
  `cargarEstado()`. No se reformatea ni se renombra nada existente.
- `README.md`: archivo nuevo.
- `docs/ejercicio6-implementacion-resumen.md` y el checkbox de `CHANGES.md`: al cerrar.

**Control de regresión.** Antes y después se ejecutan los controles de solo lectura del proyecto (cero
`http(s)://`, cero `<style>`/`style=`, cero selectores por id en CSS, `!important` solo en
`prefers-reduced-motion`) y se repiten los casos de C-03/C-04 (filtro, altas) para confirmar que la
restauración no los rompió. Ninguna función existente cambia de firma ni de comportamiento.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| **C-05 ausente en `main`** → no hay ventas que persistir ni comprobación de precio histórico posible | D-08: tarea 0 bloqueante; fallback con `ventas: []`; README declara pendientes los casos 4–6 si persiste; C-06 no implementa C-05 |
| Semilla duplicada al recargar | D-03: reemplazo in situ; el caso manual 7 es control obligatorio |
| JSON corrupto o editado a mano rompe el arranque | D-06: `try/catch` + validación por nivel; se descarta o se omiten registros |
| `QuotaExceededError` pierde datos en silencio | D-07: aviso visible con texto + `console.warn`, estado en memoria intacto |
| El aviso de persistencia no tiene contenedor en el HTML congelado | D-07: elemento creado por JS con clases existentes, sin tocar `index.html` ni `css/` |
| El docente edita el precio y el historial se recalcula | D-06: nunca se recalculan precios/totales al restaurar; D-10: ruta documentada separa catálogo de ventas |
| README que declara aprobado un caso no ejecutado | D-10: tabla con estado + motivo; regla dura 11 |
| Conflicto de escritura con C-05/C-06 sobre `js/app.js` | El merge se serializa C-05 → C-06; C-06 agrega, no reformatea |
| `cargarEstado()` antes de que `ventas` exista | D-04: llamada al final del archivo; D-08: guard `typeof ventas` |

## Migration Plan

No hay datos persistidos previos: la clave `libreria-el-estante:v1` no existe todavía. Pasos:

1. Restaurar/implementar C-05 en `main` (prerrequisito, tarea 0).
2. Agregar el bloque de persistencia y la llamada final a `cargarEstado()` en `js/app.js`; verificar con
   `node --check`.
3. Agregar los ganchos de escritura y verificar con una alta y una venta reales.
4. Crear `README.md` con la evidencia ejecutada.
5. Rollback: quitar el bloque de persistencia y las llamadas; el resto de `app.js` no se toca. La clave
   guardada puede quedar huérfana sin afectar la aplicación (simplemente se ignora si el código no la lee).

## Open Questions

- **Nombres exactos del flujo de confirmación de C-05.** Se confirman en la tarea 0 contra el código
  restaurado. No cambian la spec ni el enfoque: el contrato mínimo es que exista un punto único que deje la
  venta completa en `ventas` antes de llamar a `guardarEstado()`. Si el flujo no existe, se aplica el
  fallback de D-08 y los casos manuales 4, 5 y 6 quedan pendientes con su motivo.
