# Tasks: C-06 ejercicio6-persistencia-documentacion

> **Archivos que este change puede tocar (declaración explícita, regla dura 12):**
>
> | Archivo | Qué se toca | Por qué |
> |---------|-------------|---------|
> | `js/app.js` | Bloque nuevo de persistencia + llamadas de escritura en `registrarLibro`, `registrarCliente` y confirmación de venta + `cargarEstado()` al final. **No se reformatea ni se renombra nada existente** | Dueño compartido; el merge se serializa C-03 → C-04 → C-05 → C-06 |
> | `README.md` | Se **crea** completo | Documento de entrega exigido por la consigna; hoy no existe |
> | `docs/ejercicio6-implementacion-resumen.md` | Se **crea** al cerrar, con la evidencia | `openspec/config.yaml` → `rules.docs`: en `docs/` va solo el resumen |
> | `CHANGES.md` | **Solo** el checkbox `[x]` de C-06 al cerrar | Cierre del roadmap |
> | `index.html` | **No se toca** | Territorio de C-01 |
> | `css/` | **No se toca** | Territorio de C-02 |
> | `openspec/changes/archive/**` | **No se toca** | Changes archivados inmutables |

> **TDD en un proyecto sin test runner.** No hay npm ni framework de tests. La verificación se ejecuta en
> tres capas: (a) `node --check js/app.js` como puerta de sintaxis, (b) funciones puras probadas con un
> arnés de consola documentado en la tarea 1.2, (c) casos manuales reales en navegador con estado
> {aprobado, fallido, omitido, pendiente} y motivo. Ningún control se marca aprobado sin ejecutarlo
> (regla dura 11). No se crean archivos de test.

## Dependencias

| Dependencia | Estado | Qué aporta |
|---|---|---|
| C-01 `ejercicio1-estructura-html` | ✔ archivado | Las 5 vistas, formularios, tablas y mensajes |
| C-02 `ejercicio2-estilos-css` | ✔ archivado | Clases `.mensaje`, `.tabla`, `.campo__control` y tokens |
| C-03 `ejercicio3-datos-catalogo-filtro` | ✔ archivado | Semilla, arrays `libros`/`clientes` y renders |
| C-04 `ejercicio4-altas-libros-clientes` | ✔ archivado | `registrarLibro`, `registrarCliente`, `poblarSelectoresRelacionados` |
| C-05 `ejercicio5-venta-historial` | ✘ **archivado pero NO implementado en `main`** | Debe aportar `ventas` y el flujo de confirmación. Ver tarea 0 |

## 0. Prerrequisito bloqueante: C-05 presente en `main`

- [x] 0.1 Verificar que C-05 esté implementado y detener la aplicación si falta
  - Verificación: `git log --all -S "registrarVenta" --oneline` devuelve al menos un commit **y**
    `Select-String -Path js\app.js -Pattern "const ventas|let ventas|confirmarVenta|registrarVenta"` devuelve coincidencias **y**
    `Test-Path openspec\specs\venta-historial\spec.md` devuelve `True`.
  - **Regla de corte:** si alguna de las tres falla, NO continuar. Informar al orquestador que C-06 no puede
    aplicarse: sin flujo de venta no hay gancho de persistencia ni comprobación de precio histórico. C-06 no
    implementa C-05.

- [x] 0.2 Confirmar el contrato real de confirmación de venta contra el código restaurado
  - Verificación: identificar la función que agrega la venta a `ventas` y el punto exacto posterior a
    `ventas.push(...)`. Dejar registrado en el resumen de implementación el nombre real de la función y el
    punto de enganche. Esperado: un único punto, con la venta completa (`id`, `fecha`, cliente,
    `renglones` con `precioUnitario` y `total`).
  - Si el flujo existe con otro nombre, adaptar la tarea 3.4 al nombre real. No inventar nombres.

> **Fallback documentado (solo si C-05 no se restaura).** C-06 persiste `libros` y `clientes` con
> `ventas: []` y deja los casos manuales 4, 5 y 6 como **pendientes** con su motivo en el README. La forma
> `{ libros, clientes, ventas }` se mantiene. Esto no sustituye el prerrequisito: es el modo degradado para
> no bloquear el resto del cierre.

## 1. Persistencia: clave, normalización y helpers (`js/app.js`)

- [x] 1.1 Declarar `CLAVE_ESTADO = "libreria-el-estante:v1"` y `reemplazarContenido(coleccion, nuevos)`
  - Requisito: spec «Clave única, versionada y forma del estado» (D-01, D-02, D-03)
  - Verificación: en consola del navegador, `CLAVE_ESTADO` devuelve `"libreria-el-estante:v1"`; con
    `const a = [1,2]; reemplazarContenido(a, [3,4,5]);` el array queda `[3,4,5]` y **la misma referencia**
    (`a` no se reasigna).

- [x] 1.2 Implementar `normalizarEstado(valor)` con la política de D-06
  - Requisito: spec «Validación del estado restaurado como entrada no confiable»
  - Verificación (arnés de consola, pegar en DevTools sobre `index.html`):
    ```js
    const casos = [
      [null, false],
      [[], false],
      [{ libros: [], clientes: [], ventas: "no" }, false],
      [{ libros: [{ id:"l1", titulo:"T", isbn:"I", precio:10, editorialId:"ed-1", generoId:null, autorIds:["aut-1"] }], clientes: [], ventas: [] }, true],
      [{ libros: [{ id:"l1", titulo:"T", isbn:"I", precio:"10", editorialId:"ed-1", generoId:null, autorIds:[] }], clientes: [], ventas: [] }, true]
    ];
    casos.map(([v]) => { const r = normalizarEstado(v); return [r.valido, r.estado && r.estado.libros.length]; });
    ```
    Esperado: `[[false, …], [false, …], [false, …], [true, 1], [true, 0]]` — el último descarta el libro
    con `precio` string y deja `libros` vacío, sin lanzar.

- [x] 1.3 Verificar que `normalizarEstado` no recalcula precios, subtotales ni totales
  - Requisito: spec «Integridad del historial persistido» (D-06)
  - Verificación: normalizar una venta con `precioUnitario: 1500`, `subtotal: 3000`, `total: 5000` y un
    catálogo con `precio: 9999` devuelve exactamente `1500`, `3000` y `5000`.

## 2. Carga inicial y orden de inicialización (`js/app.js`)

- [x] 2.1 Implementar `cargarEstado()`: leer clave, normalizar y reemplazar las tres colecciones
  - Requisito: spec «Carga inicial de la semilla en el primer inicio» y «Restauración sin duplicar datos iniciales» (D-03, D-06)
  - Verificación: con la clave ausente, `libros.length === 6` y `clientes.length === 3`; con un estado
    guardado de 1 libro y 1 cliente, tras `cargarEstado()` quedan exactamente 1 y 1 (no 7 y 4).

- [x] 2.2 Invocar `cargarEstado()` una sola vez al final de `app.js`, después de todas las declaraciones
  - Requisito: spec «Carga inicial de la semilla en el primer inicio» (D-04, D-08)
  - Verificación: `Select-String -Path js\app.js -Pattern '^cargarEstado\(\);'` devuelve exactamente 1
    coincidencia y está en la última sección del archivo; `node --check js/app.js` sale con código 0. En
    navegador, la consola no muestra `ReferenceError` por `ventas`.

- [x] 2.3 Probar los cuatro estados inválidos: JSON roto, raíz `null`, raíz array y colección no array
  - Requisito: spec «Validación del estado restaurado como entrada no confiable»
  - Verificación: para cada payload, ejecutar en consola
    `localStorage.setItem("libreria-el-estante:v1", payload)` y recargar:
    1. `"{no es json"` → arranca con 6 libros.
    2. `"null"` → arranca con 6 libros.
    3. `"[]"` → arranca con 6 libros.
    4. `'{"libros":{},"clientes":[],"ventas":[]}'` → arranca con 6 libros.
    En los cuatro casos no hay excepción fatal y la interfaz queda operable.

- [x] 2.4 Probar la no duplicación de la semilla y de las ventas
  - Requisito: spec «Restauración sin duplicar datos iniciales» (RN-PER-03)
  - Verificación: registrar 1 libro (queda en 7), recargar y comprobar `libros.length === 7` (no 13);
    confirmar 1 venta, recargar y comprobar `ventas.length === 1` y una sola fila en `#tabla-historial-cuerpo`.

## 3. Escritura después de cada mutación (`js/app.js`)

- [x] 3.1 Implementar `guardarEstado()` con snapshot completo y `JSON.stringify`
  - Requisito: spec «Persistencia después de cada mutación del estado» (D-05)
  - Verificación: en consola, `guardarEstado(); JSON.parse(localStorage.getItem(CLAVE_ESTADO))` devuelve un
    objeto con exactamente las propiedades `libros`, `clientes` y `ventas`, las tres arrays.

- [x] 3.2 Llamar `guardarEstado()` en `registrarLibro()` después de `libros.push(...)` y de los renders
  - Requisito: spec «Persistencia después de cada mutación del estado» (D-05, D-12)
  - Verificación: registrar un libro válido y comprobar en consola
    `JSON.parse(localStorage.getItem(CLAVE_ESTADO)).libros.some(l => l.isbn === "9781111111111")` devuelve
    `true`; recargar y el libro sigue en `#tabla-libros-cuerpo`.

- [x] 3.3 Llamar `guardarEstado()` en `registrarCliente()` después de `clientes.push(...)` y de los renders
  - Requisito: spec «Persistencia después de cada mutación del estado» (D-05, D-12)
  - Verificación: registrar un cliente nuevo y comprobar
    `JSON.parse(localStorage.getItem(CLAVE_ESTADO)).clientes.some(c => c.email === "nuevo@email.com")`
    devuelve `true`; recargar y el cliente sigue en `#tabla-clientes-cuerpo`.

- [x] 3.4 Llamar `guardarEstado()` en el punto de confirmación de venta de C-05 (nombre real confirmado en 0.2)
  - Requisito: spec «Persistencia después de cada mutación del estado»; design D-05, D-08
  - Verificación: confirmar la venta de referencia (2 × 1500 + 1 × 2000) y comprobar
    `JSON.parse(localStorage.getItem(CLAVE_ESTADO)).ventas.length === 1`, con `total: 5000` y
    `renglones[0].precioUnitario` histórico; recargar y la venta sigue en el historial una sola vez.

- [x] 3.5 Verificar que un alta o una venta rechazada no escribe estado
  - Requisito: spec «Persistencia después de cada mutación del estado»
  - Verificación: anotar `localStorage.getItem(CLAVE_ESTADO)`; provocar ISBN duplicado, email inválido y
    venta sin renglones; comprobar que la cadena guardada es **idéntica** después de los tres rechazos.

## 4. Errores de lectura, escritura y cuota (`js/app.js`)

- [x] 4.1 Envolver lectura, parseo y escritura en `try/catch` y agregar `informarProblemaPersistencia(motivo)`
  - Requisito: spec «Tolerancia a fallos de lectura, escritura y cuota» (D-07)
  - Verificación: la función crea un único `<p class="mensaje mensaje--error" role="alert">` con
    `textContent` (sin `innerHTML`) y no toca `index.html`; ejecutarla dos veces deja **un** solo elemento y
    actualiza el texto. Comprobar con
    `document.querySelectorAll('.pie .mensaje--error').length === 1`.

- [x] 4.2 Simular `QuotaExceededError` al guardar sin perder el registro en memoria
  - Requisito: spec «Tolerancia a fallos de lectura, escritura y cuota»
  - Verificación: en consola, guardar `const original = Storage.prototype.setItem;`, reemplazarlo por una
    función que lance `{ name: "QuotaExceededError" }`, registrar un libro válido y comprobar que: (a) el
    libro aparece en la tabla, (b) el aviso visible dice que no se pudo guardar, (c) hay `console.warn`, y
    (d) la sesión sigue operable. Restaurar con `Storage.prototype.setItem = original;`.

- [x] 4.3 Simular lectura fallida (`SecurityError`) y verificar arranque con semilla
  - Requisito: spec «Tolerancia a fallos de lectura, escritura y cuota»
  - Verificación: reemplazar temporalmente `Storage.prototype.getItem` por una función que lance
    `{ name: "SecurityError" }`, recargar la vista o llamar `cargarEstado()` y comprobar que no hay
    excepción fatal, que hay aviso visible y que el catálogo muestra la semilla. Restaurar el prototipo.

## 5. README: apertura, navegación, estado y almacenamiento (`README.md`)

- [x] 5.1 Crear `README.md` con integrantes, apertura sin npm y URL `file://` de ejemplo
  - Requisito: spec «README en la raíz de la entrega» e «Identificación del equipo y apertura sin npm»
  - Verificación: `Test-Path README.md` devuelve `True`; el README nombra a los 6 integrantes y contiene una
    ruta con `file://` que, pegada en el navegador, abre `index.html`; no pide `npm install` ni servidor.

- [x] 5.2 Agregar la navegación entre las cinco vistas
  - Requisito: spec «Navegación entre las cinco vistas»
  - Verificación: el README nombra Catálogo, Libros, Clientes, Ventas e Historial; cada nombre coincide con
    un `href` del `<nav>` de `index.html` (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`) y
    al usarlo en el navegador se muestra la sección correspondiente.

- [x] 5.3 Documentar funcionalidades implementadas y pendientes con el estado real
  - Requisito: spec «Funcionalidades implementadas y pendientes»
  - Verificación: recorrer la lista y ejecutar cada funcionalidad marcada como implementada; ninguna debe
    fallar. Si C-05 no está implementado, venta/historial y la persistencia de ventas figuran como
    **pendientes** con el motivo, no como terminadas.

- [x] 5.4 Documentar la ubicación de los datos iniciales
  - Requisito: spec «Ubicación de los datos iniciales»
  - Verificación: el README indica `js/app.js` y los arrays `editoriales`, `generos`, `autores`, `libros` y
    `clientes`; `Select-String -Path js\app.js -Pattern 'const (editoriales|generos|autores|libros|clientes) ='`
    devuelve 5 coincidencias.

- [x] 5.5 Documentar funcionamiento y límites de `localStorage`, clave y forma del estado
  - Requisito: spec «Funcionamiento y límites de localStorage» (RN-PER-04)
  - Verificación: el README declara que depende del navegador, del perfil y de la ubicación de apertura, que
    no comparte información entre usuarios y que la clave es `libreria-el-estante:v1` con
    `{ libros, clientes, ventas }`. Contraste con la clave real en DevTools.

- [x] 5.6 Declarar el alcance técnico de la entrega
  - Requisito: spec «README en la raíz de la entrega»
  - Verificación: el README declara que se entregan `index.html`, `css/`, `js/` y `README.md`, sin
    dependencias ni compilación; `Test-Path package.json` devuelve `False` y `Test-Path node_modules`
    devuelve `False`.

## 6. Casos manuales: ejecución y registro en el README

> Cada tarea ejecuta el caso, registra en `README.md` **estado + motivo + resultado observado** y no marca
> aprobado nada que no se haya corrido. Estados válidos: `aprobado`, `fallido`, `omitido`, `pendiente`.

- [x] 6.1 Caso 1 — búsqueda parcial en mayúsculas, búsqueda vacía y texto inexistente
  - Verificación: buscar `CIEN` → aparece «Cien años de soledad»; borrar la búsqueda → 6 libros; buscar
    `zzzz` → `#catalogo-sin-resultados` visible. Registrar el resultado real en el README.

- [x] 6.2 Caso 2 — alta con ISBN existente y luego con ISBN nuevo
  - Verificación: alta con `978-0307474728` → rechazo con mensaje; alta con un ISBN nuevo → aparece en
    catálogo, en `#tabla-libros-cuerpo` y en `#renglon-libro`. Registrar el resultado real.

- [x] 6.3 Caso 3 — email inválido, email existente en mayúsculas y email nuevo
  - Verificación: `abc` → rechazo; `MARIA.GONZALEZ@EMAIL.COM` → rechazo; email nuevo → aparece en
    `#tabla-clientes-cuerpo` y en `#venta-cliente`. Registrar el resultado real.

- [x] 6.4 Caso 4 — venta sin cliente, cantidad 0/negativa/decimal y libro repetido
  - Verificación: ninguno de los intentos inválidos confirma la venta; el libro repetido no crea un segundo
    renglón. Si C-05 no está implementado, registrar `pendiente` con el motivo «C-05 ausente en main».

- [x] 6.5 Caso 5 — venta válida de 2 × 1500 + 1 × 2000
  - Verificación: subtotales 3000 y 2000, total 5000 y detalle conservado en el historial. Si C-05 no está,
    registrar `pendiente` con el motivo.

- [x] 6.6 Caso 6 — cambio exclusivo del precio del catálogo guardado en una copia de prueba
  - Verificación: en una **copia temporal** del proyecto, confirmar la venta, anotar importes, editar solo
    `libros[i].precio` en `libreria-el-estante:v1`, recargar y abrir el detalle: el precio unitario, los
    subtotales y el total conservan los valores confirmados. Si C-05 no está, registrar `pendiente`.

- [x] 6.7 Caso 7 — recarga después de altas y venta
  - Verificación: registrar libro y cliente, confirmar venta si C-05 existe, recargar y comprobar que no se
    duplican los 6 ejemplos ni la venta. Registrar cantidades observadas.

- [x] 6.8 Caso 8 — navegación por teclado y anchos de 320 px y 1280 px
  - Verificación: recorrer con `Tab` y comprobar foco visible en todos los controles; medir
    `documentElement.scrollWidth <= clientWidth` a 320 px (arnés de `<iframe>` por el mínimo de 492 px de
    Edge) y a 1280 px; las tablas anchas se desplazan dentro de su contenedor. Registrar el resultado real.

## 7. README: imágenes y comprobación guiada del precio histórico

- [x] 7.1 Declarar explícitamente que el proyecto tiene cero imágenes
  - Requisito: spec «Declaración explícita de cero imágenes» (IN-03)
  - Verificación: el README declara cero imágenes propias y de terceros, no inventa procedencia y registra
    el requisito de texto alternativo como **vacuo**, no como aprobado. Control:
    `Select-String -Path index.html,css\*.css -Pattern '<img|url\(|background-image'` no devuelve coincidencias.

- [x] 7.2 Documentar la ubicación y la estructura del catálogo guardado
  - Requisito: spec «Guía reproducible de la comprobación del precio histórico» (D-10)
  - Verificación: el README indica `localStorage["libreria-el-estante:v1"] → libros → [i] → precio` para el
    catálogo y `… → ventas → [j] → renglones → [k] → precioUnitario` para el histórico. Contrastar la ruta
    con el JSON real en DevTools.

- [x] 7.3 Documentar los 4 pasos de la comprobación guiada y su resultado observado
  - Requisito: spec «Guía reproducible de la comprobación del precio histórico»
  - Verificación: el README enumera: confirmar y anotar; modificar solo el precio; recargar; consultar el
    detalle. El resultado observado coincide con el registrado en 6.6 y no es una promesa.

## 8. Integración, regresión y cierre

- [x] 8.1 Puerta de sintaxis y carga limpia
  - Verificación: `node --check js/app.js` sale con código 0; al abrir `index.html` por `file://` la consola
    del navegador no muestra errores y las 5 vistas renderizan.

- [x] 8.2 Repetir los controles de solo lectura del proyecto
  - Verificación: cero `http://`/`https://`/`url()` en `index.html`, `css/` y `js/`; cero `<style>` y
    `style=`; cero selectores por `#id` en CSS (excluyendo hex); `!important` solo dentro del bloque
    `prefers-reduced-motion`; sin `display: flex` sobre `td`.

- [x] 8.3 Regresión de C-03 y C-04
  - Verificación: repetir los casos 1, 2 y 3 (filtro y altas) con la persistencia activa y comprobar que se
    comportan igual que antes; `#renglon-libro` y `#venta-cliente` se actualizan tras cada alta.

- [x] 8.4 Validar el change y la coherencia de los artefactos
  - Verificación: `openspec validate "ejercicio6-persistencia-documentacion"` pasa sin errores;
    `openspec status --change "ejercicio6-persistencia-documentacion"` reporta planificación completa.

- [x] 8.5 Crear `docs/ejercicio6-implementacion-resumen.md` con la evidencia control por control
  - Verificación: el archivo existe y cada control de las tareas 1 a 7 figura con estado
    {aprobado, fallido, omitido, pendiente} y motivo; no hay ningún control sin ejecutar marcado aprobado.

- [x] 8.6 Marcar C-06 como completado en `CHANGES.md`
  - Verificación: la fila de C-06 pasa a `[x]` y no se modifica ninguna otra sección del roadmap.

## Workflow follow-up

- Archivar el change con `/opsx:archive ejercicio6-persistencia-documentacion` una vez revisado.
- Verificar que `openspec/specs/persistencia-local/spec.md` y `openspec/specs/documentacion-entrega/spec.md`
  quedaron creados tras el archivado.
- Si C-05 se restauró durante la aplicación, actualizar el README y el resumen para reflejar el estado real
  de venta/historial antes de la entrega.
