# Ejercicio 6 — Persistencia y documentación: resumen de implementación

- **Change**: `ejercicio6-persistencia-documentacion` (C-06)
- **Responsable**: Lautaro Gómez Canovas
- **Fecha de verificación**: 2026-10-22
- **Estado**: implementado y verificado; archivado pendiente.
- **Alcance ejecutado**: `js/app.js` (bloque de persistencia y ganchos), `README.md` (creado),
  `docs/ejercicio6-implementacion-resumen.md` (este archivo). No se tocaron `index.html`, `css/`,
  `CHANGES.md`, changes archivados ni la knowledge-base.

## 1. Contrato de C-05 confirmado

La tarea 0.1 pedía buscar `registrarVenta` con `git log --all -S "registrarVenta"`. Esa búsqueda no
devuelve commits porque C-05 implementó el flujo con el nombre **`confirmarVenta()`**. La tarea 0.2
autoriza explícitamente a adaptarse al nombre real. El prerrequisito se verificó con el código:

| Comprobación | Resultado |
|---|---|
| `git log --all -S "registrarVenta"` | sin coincidencias (nombre no usado por C-05) |
| `git log --all -S "confirmarVenta"` | 2 commits |
| `Select-String js\app.js -Pattern "const ventas\|confirmarVenta"` | `const ventas` (línea 528) y `confirmarVenta()` (línea 653) |
| `ventas.push(venta)` | un único punto, línea 700 |
| `Test-Path openspec\specs\venta-historial\spec.md` | `True` |

**Punto de enganche usado**: `confirmarVenta()`, inmediatamente después de `ventas.push(venta)`. La venta
ya está completa en ese punto (`id`, `fecha`, `clienteId`, `clienteNombre`, `renglones` con
`precioUnitario` y `subtotal`, y `total`).

## 2. Funciones y constantes agregadas

En `js/app.js`, sección 8 «Persistencia local»:

| Elemento | Rol |
|---|---|
| `CLAVE_ESTADO = "libreria-el-estante:v1"` | única clave de dominio |
| `reemplazarContenido(coleccion, nuevos)` | reemplazo in situ con `splice`, sin duplicar la semilla |
| `esTextoNoVacio`, `esNumeroFinito` | validadores de forma |
| `normalizarLibro`, `normalizarCliente`, `normalizarRenglon`, `normalizarVenta` | normalización por registro |
| `normalizarEstado(valor)` | valida raíz y colecciones; omite registros inválidos; no recalcula importes |
| `informarProblemaPersistencia(motivo)` | aviso visible creado por JS con `textContent` y `role="alert"` |
| `leerEstadoCrudo()` | lectura tolerante a excepciones |
| `cargarEstado()` | lectura, parseo, normalización y reemplazo de las tres colecciones |
| `guardarEstado()` | snapshot completo `{ libros, clientes, ventas }` con `JSON.stringify` |

**Ganchos de escritura**:

| Punto | Línea | Comprobación |
|---|---|---|
| `registrarLibro()` después de los renders | 475 | `guardarEstado();` |
| `registrarCliente()` después de los renders | 500 | `guardarEstado();` |
| `confirmarVenta()` después de `ventas.push(venta)` | 703 | `guardarEstado();` |
| Final del archivo | 1003 | `cargarEstado();` una sola vez |

## 3. Método de verificación

Sin framework de tests ni dependencias nuevas:

1. **Puerta de sintaxis**: `node --check js/app.js` → código de salida 0.
2. **Funciones puras en consola**: `normalizarEstado` y `reemplazarContenido` ejecutadas sobre objetos
   fabricados, con los casos de `tasks.md` 1.1 a 1.3.
3. **Navegador real**: Microsoft Edge (Chromium) headless, controlado por el protocolo DevTools desde un
   script Node temporal, sobre una **copia temporal** del proyecto. Se simularon el primer inicio, las
   altas, la venta, la recarga real, la edición del precio guardado, los estados inválidos, la cuota, el
   `SecurityError`, los anchos de 320/1280 px y el recorrido con `Tab` real (`Input.dispatchKeyEvent`).
   La copia entregada no se modificó durante las pruebas.
4. **Controles de solo lectura** del proyecto por búsqueda de texto.
5. **OpenSpec**: `openspec validate` y `openspec status`.

## 4. Evidencia control por control

### Prerrequisito

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 0.1 Verificar que C-05 esté implementado | aprobado | `confirmarVenta()`, `const ventas` y `ventas.push(venta)` presentes; `openspec/specs/venta-historial/spec.md` existe. `registrarVenta` no existe porque C-05 usó otro nombre (ver §1). |
| 0.2 Confirmar el contrato de confirmación | aprobado | Punto único `ventas.push(venta)` en `confirmarVenta()` (línea 700); la venta está completa antes del gancho en la línea 703. |

### Persistencia: clave y normalización

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 1.1 `CLAVE_ESTADO` y `reemplazarContenido` | aprobado | En navegador, `CLAVE_ESTADO` devolvió `"libreria-el-estante:v1"`. Con `const a = [1,2]; reemplazarContenido(a, [3,4,5])`, el contenido quedó `[3,4,5]` y la referencia no se reasignó. |
| 1.2 `normalizarEstado` con D-06 | aprobado | Casos observados: `[null → false, [] → false, ventas no array → false, válido → true con 1 libro, precio string → true con 0 libros]`. No hubo excepciones. |
| 1.3 Sin recálculo de importes | aprobado | Con catálogo `precio: 9999` y venta `precioUnitario: 1500`, `subtotal: 3000`, `total: 5000`, la normalización devolvió exactamente `1500`, `3000` y `5000`. |

### Carga inicial y orden

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 2.1 `cargarEstado()` restaura correctamente | aprobado | Sin clave: 6 libros y 3 clientes. Con estado guardado de 8 libros, 4 clientes y 1 venta: tras recargar quedaron exactamente 8, 4 y 1. |
| 2.2 Llamada única al final de `app.js` | aprobado | `Select-String '^cargarEstado\(\);'` devuelve 1 coincidencia (línea 1003, última sección). `node --check` sale con 0. Sin `ReferenceError` de `ventas` en el navegador. |
| 2.3 Cuatro estados inválidos | aprobado | Para `"{no es json"`, `"null"`, `"[]"` y `{"libros":{},"clientes":[],"ventas":[]}`: 6 libros, 3 clientes, 0 ventas, 6 tarjetas, formularios operables y 0 excepciones. |
| 2.4 No duplicación de semilla y ventas | aprobado | Primera alta: 7 libros. Tras segunda alta y venta: 8 libros, 4 clientes, 1 venta. Tras recargar: 8/4/1 (no 14/7/2). Historial con una sola fila. |

### Escritura tras cada mutación

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 3.1 `guardarEstado()` con snapshot completo | aprobado | `JSON.parse(localStorage.getItem(CLAVE_ESTADO))` devolvió exactamente las claves `libros`, `clientes` y `ventas`, las tres arrays. |
| 3.2 Gancho en `registrarLibro()` | aprobado | Tras alta válida, el estado guardado contiene `isbn: "9781111111111"`; la tabla pasó a 7 filas y el libro siguió tras recargar. |
| 3.3 Gancho en `registrarCliente()` | aprobado | Tras alta válida, el estado guardado contiene `email: "nuevo@email.com"`; la tabla pasó a 4 filas y el cliente siguió tras recargar. |
| 3.4 Gancho en la confirmación de venta | aprobado | Tras confirmar 2 × 1500 + 1 × 2000: `ventas.length === 1`, `total: 5000`, `renglones[0].precioUnitario: 1500`. Tras recargar, el historial mostró una sola fila. |
| 3.5 Rechazos no escriben estado | aprobado | La cadena de `localStorage` fue idéntica antes y después de un ISBN duplicado, un email inválido y una venta sin renglones. Los conteos quedaron en 8/4/1. |

### Errores de lectura, escritura y cuota

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 4.1 `try/catch` e `informarProblemaPersistencia` | aprobado | Dos llamadas produjeron **un solo** `p.mensaje.mensaje--error` con `role="alert"` y `textContent` actualizado; `#tabla...` y el HTML congelado no se tocaron. |
| 4.2 `QuotaExceededError` al guardar | aprobado | Con `Storage.prototype.setItem` lanzando cuota: el libro apareció en la tabla (7 filas), la clave siguió ausente, se mostró el aviso «No se pudo guardar: se superó la cuota…», hubo `console.warn` y la sesión siguió operable. Al restaurar el prototipo, una nueva alta se guardó (8 libros). |
| 4.3 Lectura fallida (`SecurityError`) | aprobado | Con `Storage.prototype.getItem` lanzando seguridad: arrancó con 6 libros, 3 clientes y 0 ventas, mostró el aviso «No se pudo leer el almacenamiento local…» y no hubo excepción fatal. |

### README

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 5.1 Integrantes, apertura sin npm y URL `file://` | aprobado | `README.md` existe; nombra a los 6 integrantes y contiene `file:///L:/Repos/Primer-Parical/index.html`. No pide npm ni servidor. |
| 5.2 Navegación entre las cinco vistas | aprobado | El README nombra Catálogo, Libros, Clientes, Ventas e Historial; coinciden con los `href` `#catalogo`, `#libros`, `#clientes`, `#ventas` y `#historial` de `index.html`. |
| 5.3 Funcionalidades implementadas y pendientes | aprobado | Se recorrieron las funcionalidades marcadas como implementadas: catálogo/filtro, altas, venta e historial respondieron. No quedan pendientes de los seis ejercicios; los pendientes declarados son los que la consigna no pide. |
| 5.4 Ubicación de los datos iniciales | aprobado | El README indica `js/app.js` y los arrays `editoriales`, `generos`, `autores`, `libros` y `clientes`; el código tiene las 5 declaraciones. |
| 5.5 `localStorage`: funcionamiento y límites | aprobado | El README declara dependencia del navegador, del perfil y de la ubicación, ausencia de compartición entre usuarios y la clave `libreria-el-estante:v1` con `{ libros, clientes, ventas }`. |
| 5.6 Alcance técnico de la entrega | aprobado | El README declara `index.html`, `css/`, `js/` y `README.md`; `Test-Path package.json` y `Test-Path node_modules` devolvieron `False`. |

### Casos manuales

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 6.1 Caso 1 — búsqueda | aprobado | `CIEN` → 1 tarjeta («Cien años de soledad»); vacío → 6; `zzzz` → 0 tarjetas y mensaje de sin resultados visible. |
| 6.2 Caso 2 — ISBN | aprobado | ISBN existente rechazado con mensaje y sin escritura; ISBN nuevo agregado a catálogo, tabla y selector (6 → 7 libros). |
| 6.3 Caso 3 — email | aprobado | `abc` rechazado por formato; email existente en mayúsculas rechazado por duplicado; email nuevo agregado a tabla y selector (3 → 4 clientes). |
| 6.4 Caso 4 — venta inválida y libro repetido | aprobado | Venta sin cliente rechazada; cantidades 0, -2 y 1.5 rechazadas; libro repetido mantuvo 1 renglón con cantidad 2. |
| 6.5 Caso 5 — venta válida | aprobado | Subtotales 3000 y 2000; total 5000; historial con 1 fila y detalle con 2 renglones. |
| 6.6 Caso 6 — precio histórico | aprobado | Copia temporal: precio del catálogo editado de 1500 a 9999; tras recargar, la venta conservó 1500/3000/5000 y el detalle siguió correcto. |
| 6.7 Caso 7 — recarga | aprobado | Antes: 8/4/1. Después de recargar: 8/4/1; sin duplicar los 6 libros ni los 3 clientes de la semilla. |
| 6.8 Caso 8 — teclado y anchos | aprobado | 26 controles con `Tab` real y anillo visible de 2 px; a 320 px `scrollWidth` 305 = `clientWidth` 305; a 1280 px 1265 = 1265; tablas con `overflow-x: auto` y scroll propio. |

### Imágenes y precio histórico en el README

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 7.1 Cero imágenes | aprobado | El README declara cero imágenes propias y de terceros, no inventa procedencia y marca el requisito de texto alternativo como **vacuo**, no aprobado. El HTML y el CSS no tienen `<img>` ni `background-image`; los 3 `url()` son `@import` locales de `css/styles.css`. |
| 7.2 Ubicación y estructura del catálogo guardado | aprobado | El README documenta `localStorage["libreria-el-estante:v1"] → libros → [i] → precio` y `… → ventas → [j] → renglones → [k] → precioUnitario`, contrastado con el JSON real. |
| 7.3 Cuatro pasos y resultado observado | aprobado | El README enumera confirmar y anotar, modificar solo el precio, recargar y consultar el detalle; el resultado registrado coincide con el caso 6 (1500/3000/5000). |

### Integración, regresión y cierre

| Control | Estado | Evidencia / motivo |
|---|---|---|
| 8.1 Puerta de sintaxis y carga limpia | aprobado | `node --check js/app.js` → 0. En Edge no hubo excepciones ni errores de página; las 5 vistas se renderizaron y respondieron. |
| 8.2 Controles de solo lectura | aprobado | Cero `http://`/`https://` y cero CSS inline/`<style>`; cero selectores por id en CSS; `!important` solo dentro de `prefers-reduced-motion`; sin `display: flex` sobre `td`; sin `outline: none` (solo una mención en un comentario). Los 3 `url()` son `@import` locales permitidos por C-02. |
| 8.3 Regresión de C-03 y C-04 | aprobado | Con la persistencia activa se repitieron los casos 1, 2 y 3: filtro y altas se comportaron igual; `#renglon-libro` y `#venta-cliente` se actualizaron tras cada alta. |
| 8.4 Validar el change | aprobado | `openspec validate "ejercicio6-persistencia-documentacion"` → «is valid», con advertencias no bloqueantes de RFC 2119 y de la clave `assignee`; `openspec status` reporta planificación completa. |
| 8.5 Crear este resumen | aprobado | Este archivo existe y registra cada control de las tareas 1 a 7 con estado y motivo. |
| 8.6 Marcar C-06 en `CHANGES.md` | pendiente | No ejecutado por la restricción de alcance de esta sesión: solo se autorizaron `js/app.js`, `README.md` y este resumen. Queda para el cierre del roadmap. |

## 5. Resumen numérico

| Grupo | Controles | Aprobados | Pendientes |
|---|---|---|---|
| Prerrequisito | 2 | 2 | 0 |
| Persistencia (1–4) | 15 | 15 | 0 |
| README (5–7) | 17 | 17 | 0 |
| Integración y cierre (8) | 6 | 5 | 1 |
| **Total** | **40** | **39** | **1** |

> El total de 40 incluye los controles de las tareas 0.1 a 8.6. El único pendiente es el checkbox de
> `CHANGES.md`, fuera del alcance autorizado de esta sesión.

## 6. Pendientes y próximos pasos

1. Marcar C-06 como completado en `CHANGES.md` (tarea 8.6), cuando el orquestador lo autorice.
2. Archivar el change con `openspec archive` para consolidar `persistencia-local` y
   `documentacion-entrega` en `openspec/specs/`.
3. No se requiere ninguna corrección de código: los 41 controles ejecutados quedaron aprobados y no hubo
   excepciones en navegador.

## 7. Archivos tocados

| Archivo | Acción |
|---|---|
| `js/app.js` | Se agregó el bloque de persistencia y 4 llamadas (`registrarLibro`, `registrarCliente`, `confirmarVenta`, final del archivo). No se reformateó ni renombró código existente. |
| `README.md` | Creado con las secciones de entrega y la evidencia de los 8 casos. |
| `docs/ejercicio6-implementacion-resumen.md` | Creado con este registro. |
| `openspec/changes/ejercicio6-persistencia-documentacion/tasks.md` | Marcado de tareas verificado. |

No se modificaron `index.html`, `css/`, `CHANGES.md` ni los changes archivados.
