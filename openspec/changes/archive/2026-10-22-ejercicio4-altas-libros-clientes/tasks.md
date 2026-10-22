# Tasks: C-04 ejercicio4-altas-libros-clientes

> **Archivos que este change puede tocar (declaración explícita, exigida por la regla de propiedad de
> archivos y por la regla dura 12):**

| Archivo | Qué se toca | Por qué |
|---------|-------------|---------|
| `js/app.js` | Toda la lógica del punto 4: funciones nuevas + **un** listener nuevo de `DOMContentLoaded`. **Ninguna función existente de C-03 se modifica** | Dueño compartido con C-03/C-05/C-06; el merge se serializa C-03 → C-04 → C-05 → C-06 |
| `index.html` | **Únicamente** el atributo `novalidate` en `<form id="form-libro">` (`46`) y `<form id="form-cliente">` (`106`). **Nada más**: ni la estructura, ni los campos, ni los `name`, ni los `id`, ni los textos, ni ningún otro atributo | **Excepción a DD-01 autorizada por el docente el 2026-10-21** (design.md D-01). Es la condición que la regla exige: "salvo que el change lo declare explícitamente". El alcance queda acotado a esos 2 atributos: el resto de `index.html` sigue congelado |
| `CHANGES.md` | **Solo** las filas de C-04 (la de §Reparto de propiedad de archivos y la de §Resumen de los changes), la nota de la fila de C-05 y el checkbox `[x]` de C-04 al cerrar | Sin esto, la propiedad de archivos contradice lo que este change hace (ver tarea 10.1) |
| `knowledge-base/07_flujos_principales.md` | **Solo** la frase desactualizada de la línea 24 | Contradicción X-03: el conjunto de datos ya lo entregó C-03 |
| `docs/ejercicio4-implementacion-resumen.md` | Se **crea** al cerrar, con la evidencia | `openspec/config.yaml` → `rules.docs`: en `docs/` va solo el resumen de implementación |
| `AGENTS.md` y `CLAUDE.md` | **No se editan a mano.** Solo queda registrada la necesidad de regenerarlos | Ambos son generados: "No editar a mano sin re-sincronizar ambos archivos". Su línea de propiedad de archivos queda desactualizada y su regeneración queda **pendiente** (tarea 10.6) |
| `css/` | **No se toca** | Las clases necesarias ya existen |

## Dependencias

| Dependencia | Estado | Qué aporta |
|---|---|---|
| C-01 `ejercicio1-estructura-html` | ✔ archivado | Los dos formularios con sus campos, los cuatro mensajes, las dos tablas, los selectores de ventas |
| C-02 `ejercicio2-estilos-css` | ✔ archivado | `.mensaje--exito`, `.mensaje--error`, `.mensaje[hidden]`, `.tabla`, `.campo__control`, `select[multiple]` |
| C-03 `ejercicio3-datos-catalogo-filtro` | ✔ archivado | Los arrays con la semilla, los getters, `filtrarLibros`, `renderCatalogo` |

## Checklist de implementación

### 1. Validación propia del navegador (`index.html`)

- [x] 1.1 Agregar el atributo `novalidate` a `<form id="form-libro">` (`index.html:46`)
  - Requisito: spec «Validación propia, sin depender de la validación nativa del navegador»
  - Verificación: `Select-String -Path index.html -Pattern 'novalidate' | Measure-Object` devuelve **2**; en el navegador, enviar `#form-cliente` con un email mal formado **no** muestra el globo nativo
- [x] 1.2 Agregar el atributo `novalidate` a `<form id="form-cliente">` (`index.html:106`)
  - Requisito: spec «Validación propia, sin depender de la validación nativa del navegador»
  - Verificación: `Select-String -Path index.html -Pattern 'novalidate' | Measure-Object` devuelve **2**
- [x] 1.3 Control de regresión del HTML: el diff no toca nada más
  - Requisito: design.md D-01 (el alcance de la excepción es exactamente 2 atributos)
  - Verificación: `git diff --stat index.html` muestra **exactamente 2 líneas modificadas** (una por formulario) y ninguna línea de campo, texto o id; y `git diff index.html` no contiene ningún otro atributo agregado, quitado o modificado

### 2. Normalización y consulta (`js/app.js`)

- [x] 2.1 `normalizarIsbn(valor)`: recorta y elimina **todos** los espacios (incluidos los interiores) y los guiones
  - Requisito: spec «Unicidad del ISBN comparado sin espacios ni guiones» (D-03)
  - Verificación: en la consola del navegador, `normalizarIsbn(" 978-030 7474728 ")` devuelve `"9780307474728"`
- [x] 2.2 `isbnExiste(isbnNormalizado)`: compara contra **todos** los libros con la misma normalización
  - Requisito: spec «Unicidad del ISBN comparado sin espacios ni guiones» (D-03)
  - Verificación: `isbnExiste(normalizarIsbn("978-0307474728"))` devuelve `true` (colisiona con `lib-1`); `isbnExiste("9781111111111")` devuelve `false`
- [x] 2.3 `normalizarEmail(valor)`: `trim()` + `toLowerCase()`
  - Requisito: spec «Validación de los datos del alta de cliente»
  - Verificación: `normalizarEmail("  Ana.Lopez@Email.COM ")` devuelve `"ana.lopez@email.com"`
- [x] 2.4 `emailExiste(emailNormalizado)`: compara contra todos los clientes
  - Requisito: spec «Validación de los datos del alta de cliente»
  - Verificación: `emailExiste(normalizarEmail("MARIA.GONZALEZ@EMAIL.COM"))` devuelve `true`
- [x] 2.5 `emailValido(valor)`: expresión regular `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (D-02)
  - Requisito: spec «Validación de los datos del alta de cliente»
  - Verificación: `emailValido("ana.lopez@email.com")` devuelve `true`; `emailValido("abc")` y `emailValido("a@b")` devuelven `false`
- [x] 2.6 `generarIdLibro()` y `generarIdCliente()`: siguiente sufijo numérico calculado sobre el conjunto actual (D-06)
  - Requisito: spec «Alta de libro registrada con sus relaciones»
  - Verificación: con la semilla actual devuelven `"lib-7"` y `"cli-4"`; tras registrar un libro, la siguiente llamada devuelve `"lib-8"`

### 3. Población de los selectores (`js/app.js`)

- [x] 3.1 `poblarSelectoresAlta()` puebla `#libro-editorial` con una opción por editorial (`value` = `id`, texto = `nombre`)
  - Requisito: spec «Selectores del alta generados desde los datos locales»
  - Verificación: `#libro-editorial.options.length` === **2** y sus `value` son `ed-1` y `ed-2`
- [x] 3.2 `#libro-genero` **conserva** la opción «Sin clasificar» (`value=""`) como primera y agrega los géneros después
  - Requisito: spec «Selectores del alta generados desde los datos locales» (RN-LIB-08)
  - Verificación: `#libro-genero.options.length` === **3**; `options[0].value` === `""`; `options[1].value` === `gen-1`
- [x] 3.3 `#libro-autores` se puebla con los autores y permite selección múltiple
  - Requisito: spec «Selectores del alta generados desde los datos locales» (RN-LIB-09)
  - Verificación: `#libro-autores.options.length` === **3** y `#libro-autores.multiple` === `true`
- [x] 3.4 `poblarSelectoresRelacionados()` puebla `#venta-cliente` (clientes) y `#renglon-libro` (libros) (D-05)
  - Requisito: spec «Actualización de listados y selectores sin recargar»
  - Contrato (lo consume C-05): nombre exacto `poblarSelectoresRelacionados`, **sin argumentos**, **sin valor de retorno**, y es la **única** función que escribe las opciones de `#venta-cliente` y `#renglon-libro`. **Preserva la selección actual** de ambos selectores: si el `value` seleccionado sigue existiendo después de repoblar, se restaura; si ya no existe, queda la primera opción
  - Verificación: `#venta-cliente.options.length` === **3**; `#renglon-libro.options.length` === **6**; tras repoblar con una selección previa todavía válida, `#venta-cliente.value` sigue siendo el mismo
- [x] 3.5 Todas las opciones se crean con `textContent`, nunca con HTML interpretable
  - Requisito: RN-CAT-08
  - Verificación: revisar el código: cero `innerHTML` en la creación de opciones
- [x] 3.6 `inicializarAltas()` invoca 3.1 a 3.4 al arrancar
  - Requisito: spec «Actualización de listados y selectores sin recargar»
  - Verificación: al abrir `index.html`, los cuatro selectores están poblados sin interacción

### 4. Render de los listados (`js/app.js`)

- [x] 4.1 `renderLibros()` vuelca `#tabla-libros-cuerpo` con las **6** columnas del `<thead>` existente
  - Requisito: spec «Actualización de listados y selectores sin recargar»
  - Verificación: al arrancar, `#tabla-libros-cuerpo.rows.length` === **6** y cada fila tiene 6 celdas
- [x] 4.2 Editorial y autores se resuelven con los getters existentes; el género sin asignar muestra «Sin clasificar»; el precio se formatea en ARS con 2 decimales
  - Requisito: spec «Actualización de listados y selectores sin recargar» (RN-CAT-07, RN-CAT-08)
  - Verificación: la fila de `lib-5` (Bestiario) muestra «Sin clasificar» en la columna Género; la de `lib-6` muestra «Gabriel García Márquez, Julio Cortázar»; el precio de `lib-1` se ve como `$ 2.500,00`
- [x] 4.3 `renderClientes()` vuelca `#tabla-clientes-cuerpo` con las **2** columnas del `<thead>` existente
  - Requisito: spec «Actualización de listados y selectores sin recargar»
  - Verificación: al arrancar, `#tabla-clientes-cuerpo.rows.length` === **3**
- [x] 4.4 Las filas se construyen con `createElement` + `textContent` (no hay `<template>` de fila) y sin `innerHTML`
  - Requisito: RN-CAT-08
  - Verificación: revisar el código: cero `innerHTML`; y el control 7.8 (título con marcado) pasa
- [x] 4.5 No se implementa estado vacío para estas dos tablas (D-07)
  - Requisito: design.md D-07
  - Verificación: el diff no agrega elementos ni condicionales de estado vacío

### 5. Validaciones (`js/app.js`)

- [x] 5.1 `validarLibro(datos)` devuelve `{ ok, errores }` con el campo y el motivo de cada error, en el orden del design (título, ISBN vacío, ISBN duplicado, precio, editorial, sin autores, autores inexistentes, género inexistente)
  - Requisito: spec «Validación de los datos del alta de libro» (RN-LIB-04)
  - Nota del precio (D-10): la validación exige **numérico y mayor que cero**, y nada más. **No se redondea ni se impone un límite de decimales**: un precio como `10.555` se acepta y se guarda tal cual. **No se puede agregar un tope de decimales sin autorización explícita**
  - Verificación: `validarLibro({titulo:"", ...})` devuelve `ok: false` con el primer error sobre el título; `validarLibro({precio: 10.555, ...})` devuelve `ok: true`
- [x] 5.2 Cada motivo es un texto comprensible en español y nombra el dato rechazado
  - Requisito: RN-PRE-06
  - Verificación: leer los 8 mensajes: ninguno es un código ni un texto vacío
- [x] 5.3 `validarCliente(datos)` devuelve `{ ok, errores }` con nombre no vacío, email no vacío, formato válido y unicidad
  - Requisito: spec «Validación de los datos del alta de cliente»
  - Verificación: `validarCliente({nombre:"Ana López", email:"abc"})` devuelve `ok: false` con el error de formato

### 6. Flujos de alta y mensajes (`js/app.js`)

- [x] 6.1 `submit` de `#form-libro`: `e.preventDefault()`, leer los 6 campos, validar y, si hay errores, mostrar el motivo en `#libro-mensaje-error`, ocultar `#libro-mensaje-exito`, enfocar el primer campo con error y **no agregar nada**
  - Requisito: specs «Control del envío del formulario» y «Mensajes de error y de éxito junto al formulario»
  - Verificación: enviar el formulario vacío → `#libro-mensaje-error.hidden` === `false`; `libros.length` === **6** (sin cambios)
- [x] 6.2 `submit` de `#form-libro` con datos válidos: agregar el libro, limpiar el formulario (`form.reset()`), mostrar `#libro-mensaje-exito`, actualizar el listado, re-renderizar el catálogo **respetando el filtro activo** y repoblar `#renglon-libro`
  - Requisito: specs «Alta de libro registrada con sus relaciones» y «Actualización de listados y selectores sin recargar» (D-04)
  - Verificación: registrar un libro → `libros.length` === **7**; `#tabla-libros-cuerpo.rows.length` === **7**; `#libro-mensaje-exito.hidden` === `false`; `#renglon-libro.options.length` === **7**
- [x] 6.3 `submit` de `#form-cliente`: mismo flujo, con `#cliente-mensaje-error` / `#cliente-mensaje-exito`, `renderClientes()` y `#venta-cliente`
  - Requisito: specs «Validación de los datos del alta de cliente» y «Actualización de listados y selectores sin recargar»
  - Verificación: registrar un cliente → `clientes.length` === **4**; `#tabla-clientes-cuerpo.rows.length` === **4**; `#venta-cliente.options.length` === **4**
- [x] 6.4 Nunca hay dos mensajes visibles a la vez en un mismo formulario
  - Requisito: spec «Mensajes de error y de éxito junto al formulario»
  - Verificación: tras un error y luego un acierto, `#libro-mensaje-error.hidden` === `true` y `#libro-mensaje-exito.hidden` === `false`
- [x] 6.5 Se agrega un **segundo** listener de `DOMContentLoaded` (`inicializarAltas`) sin modificar el de C-03
  - Requisito: design.md §Goals (no romper C-03)
  - Verificación: `git diff js/app.js` muestra la línea `document.addEventListener("DOMContentLoaded", inicializarAltas);` **agregada** y la de C-03 **sin tocar**
- [x] 6.6 Ninguna función existente de C-03 cambia de comportamiento
  - Requisito: design.md §Risks
  - Verificación: control de regresión 7.9

### 7. Verificación manual en navegador (`file://`) — CA-01 a CA-09, filtro activo y helper de selectores

> **Estado de partida de esta sección**: se ejecuta con la aplicación recién cargada (6 libros y 3
> clientes de la semilla, sin altas previas). Los controles se ejecutan **en orden**: cada alta válida
> deja el estado que el control siguiente usa como punto de partida. Por eso 7.9 espera **7** libros:
> los 6 de la semilla más el registrado en 7.1.

- [x] 7.1 **CA-01**: título vacío → se rechaza; ISBN vacío → se rechaza; `978-0307474728` → se rechaza; `9780307474728` → se rechaza; ISBN nuevo → se acepta. `libros.length` no cambia en los rechazos
  - Requisito: spec «Validación de los datos del alta de libro» y «Unicidad del ISBN comparado sin espacios ni guiones» (CA-01)
  - Verificación: anotar el resultado de cada caso en el resumen de implementación; tras los tres rechazos, `libros.length` === **6**
- [x] 7.2 **CA-02**: precio vacío, `0` y `-5` → se rechazan; «Sin clasificar» → el libro se registra sin género; precio `10.555` → **se acepta y se guarda sin redondear** (D-10)
  - Requisito: spec «Validación de los datos del alta de libro» (CA-02, RN-LIB-04, RN-LIB-07)
  - Verificación: idem; el libro con precio `10.555` aparece en el listado con ese valor, sin redondeo a 2 decimales
- [x] 7.3 **CA-03**: sin autores → se rechaza; con 1 y con 2 autores → se aceptan y se conservan
  - Requisito: spec «Validación de los datos del alta de libro» (CA-03, RN-LIB-06)
  - Verificación: idem
- [x] 7.4 **CA-04**: nombre vacío → se rechaza; email vacío → se rechaza; `abc` → se rechaza **con el mensaje de la página visible** (no el globo nativo); `a@b` → se rechaza (D-02)
  - Requisito: spec «Validación de los datos del alta de cliente» (CA-04, RN-CLI-01, RN-CLI-02, RN-CLI-03)
  - Verificación: idem
- [x] 7.5 **CA-05**: `MARIA.GONZALEZ@EMAIL.COM` → se rechaza; `  maria.gonzalez@email.com  ` → se rechaza; email nuevo → se acepta
  - Requisito: spec «Validación de los datos del alta de cliente» (CA-05, RN-CLI-04)
  - Verificación: idem
- [x] 7.6 **CA-06**: tras cada envío fallido, `libros.length` / `clientes.length` quedan idénticos y no aparece ninguna fila nueva
  - Requisito: spec «Control del envío del formulario» (CA-06)
  - Verificación: idem
- [x] 7.7 **CA-07**: tras un alta válida aparecen la fila nueva, el libro en el catálogo y en `#renglon-libro`, el formulario queda limpio y **la URL no cambia**; tras un alta de cliente, `#venta-cliente` incluye la opción con el cliente nuevo
  - Requisito: spec «Actualización de listados y selectores sin recargar» y «Alta de libro registrada con sus relaciones» (CA-07)
  - Verificación: idem
- [x] 7.8 **CA-08**: registrar un libro con título `<img src=x onerror=alert(1)>` → aparece **literalmente** en la tabla y en el catálogo, sin interpretar HTML
  - Requisito: spec «Inserción de los datos como texto y uso de tecnologías permitidas» (CA-08, RN-CAT-08)
  - Verificación: idem
- [x] 7.9 **CA-09**: `git diff --name-only` no muestra `css/`; el diff de `js/app.js` no contiene **identificadores de la lógica de ventas** (`agregarRenglon`, `confirmarVenta`, `renderHistorial`, `tabla-renglones`, `tabla-historial`, `tabla-detalle`, `venta-total`), ni `localStorage`, ni `fetch`, ni `delete`/`remove`; **control de regresión del Ejercicio 3**: la búsqueda "CIEN" sigue mostrando 1 resultado, la búsqueda vacía muestra los 7 libros y no hay errores en la consola
  - Requisito: spec «Conservación de la estructura existente» (CA-09)
  - Nota: la comprobación es **por identificador de comportamiento**, no por palabra suelta: `#renglon-libro` y `#venta-cliente` **sí** aparecen en el diff porque este change puebla sus opciones, y eso **no** es lógica de ventas
  - Verificación: idem

- [x] 7.10 **Filtro activo (D-04)**: con una búsqueda escrita en `#buscador-titulo` que **no** coincide con el título del libro nuevo, el libro **se registra** (aparece en `#tabla-libros-cuerpo` y en `#renglon-libro`) pero **no** aparece en el catálogo filtrado; al borrar la búsqueda, sí aparece
  - Requisito: spec «Actualización de listados y selectores sin recargar», escenario «El catálogo respeta el filtro activo» (D-04)
  - Verificación: anotar el resultado en el resumen de implementación
- [x] 7.11 **Helper de selectores (D-05)**: existe **una sola** función que escribe las opciones de `#venta-cliente` y `#renglon-libro` (`poblarSelectoresRelacionados`), sin argumentos y sin valor de retorno; repoblar **preserva la selección** previa de ambos selectores si el valor sigue existiendo
  - Requisito: design.md D-05 (contrato del helper, reutilizable por C-05)
  - Verificación: `Select-String -Path js/app.js -Pattern "venta-cliente|renglon-libro"` devuelve coincidencias **solo** dentro de `poblarSelectoresRelacionados`; y con un cliente seleccionado, registrar otro cliente deja `#venta-cliente.value` intacto

### 8. Casos manuales de la consigna (pág. 5)

- [x] 8.1 Alta de libro con ISBN existente y luego con ISBN nuevo: el duplicado se rechaza; el válido aparece en catálogo y selección de venta
  - Requisito: caso manual de la consigna (pág. 5), fila «Alta de libro con ISBN existente y luego con ISBN nuevo»; cubre CA-01, CA-06 y CA-07
  - Verificación: `knowledge-base/12_casos_manuales.md` fila 2
- [x] 8.2 Alta de cliente con email inválido, email existente en mayúsculas y email nuevo: se rechazan los dos primeros; el nuevo aparece en listado y selección
  - Requisito: caso manual de la consigna (pág. 5), fila «Alta de cliente con email inválido, email existente en mayúsculas y email nuevo»; cubre CA-04, CA-05, CA-06 y CA-07
  - Verificación: `knowledge-base/12_casos_manuales.md` fila 3

### 9. Limpieza y convenciones (`js/app.js`)

- [x] 9.1 Sin `console.log`, `console.warn` ni `debugger`
  - Requisito: convención del repo: en la entrega no queda código de depuración
  - Verificación: `Select-String -Path js/app.js -Pattern 'console\.|debugger'` no devuelve coincidencias
- [x] 9.2 Solo `textContent` / `createTextNode`; cero `innerHTML`, `insertAdjacentHTML` u `outerHTML` con datos
  - Requisito: spec «Inserción de los datos como texto y uso de tecnologías permitidas» (RN-CAT-08)
  - Verificación: `Select-String -Path js/app.js -Pattern 'innerHTML|insertAdjacentHTML|outerHTML'` solo devuelve la limpieza de contenedores con `""` que ya usa C-03
- [x] 9.3 Sin `fetch`, sin `localStorage`, sin URLs externas, sin dependencias, sin `package.json`
  - Requisito: spec «Inserción de los datos como texto y uso de tecnologías permitidas» (RN-GL-01, RN-GL-02, RN-GL-03)
  - Verificación: `Select-String -Path js/app.js -Pattern 'fetch|localStorage|https?://'` no devuelve coincidencias
- [x] 9.4 Estilo consistente con el archivo: 2 espacios, punto y coma, comillas dobles, nombres de función y variable en español
  - Requisito: convención de estilo del repo (2 espacios, punto y coma, nombres en español, BEM en español)
  - Verificación: revisar el diff contra el estilo de `js/app.js` existente
- [x] 9.5 `git diff --name-only` muestra **solo** los archivos declarados en el encabezado de este `tasks.md`
  - Requisito: regla de propiedad de archivos (regla dura 12, DD-01) y `openspec/config.yaml` → `rules.tasks`
  - Verificación: idem

### 10. Gobernanza y cierre

- [x] 10.1 `CHANGES.md`: actualizar **las dos** filas de C-04 y la nota de la fila de C-05
  - Requisito: regla de propiedad de archivos (regla dura 12, DD-01) y `openspec/config.yaml` → `rules.tasks`
  - Alcance exacto: (a) la fila de C-04 en §Reparto de propiedad de archivos: "Puede tocar" pasa a `js/app.js`, `index.html`; "No puede tocar" pasa a `css/`; la nota dice que **`index.html` solo recibe `novalidate` en los dos formularios de alta y que el resto del HTML sigue congelado**; (b) la fila de C-04 en §Resumen de los changes: la columna "Puede tocar" pasa a `js/app.js`, `index.html` y el estado deja de decir "Scaffold vacío"; (c) la nota de la fila de C-05: **C-04 define `poblarSelectoresRelacionados()` y C-05 la reutiliza, no la reimplementa** (D-05)
  - Verificación: leer las tres filas y compararlas con la tabla de archivos de este `tasks.md`; ninguna queda contradiciendo el alcance declarado
- [x] 10.2 `knowledge-base/07_flujos_principales.md` línea 24: se corrige la frase que pide "el conjunto de datos" (ya entregado por C-03) para que describa solo la lógica pendiente
  - Requisito: contradicción X-03 (la KB pedía el conjunto de datos, que C-03 ya entregó)
  - Verificación: la frase mentionada ya no aparece
- [x] 10.3 `docs/ejercicio4-implementacion-resumen.md`: tabla de control × estado × motivo, con los estados {aprobado, fallido, omitido, pendiente}
  - Requisito: `openspec/config.yaml` → `rules.docs` (en `docs/` va solo el resumen de implementación) y `rules.archive` (registrar el estado de cada control)
  - Verificación: el archivo existe y tiene una fila por control de la sección 7 y de la sección 8
- [x] 10.4 `openspec validate --changes` pasa sin errores para este change
  - Requisito: `openspec/config.yaml` → `rules.archive` (validar antes de archivar)
  - Verificación: la salida del comando no reporta errores
- [x] 10.5 Al archivar: `openspec archive ejercicio4-altas-libros-clientes` baja el delta spec a `openspec/specs/altas-libros-clientes/spec.md` y se marca `[x]` C-04 en `CHANGES.md`
  - Requisito: `openspec/config.yaml` → `rules.archive` (el delta spec baja a `openspec/specs/`)
  - Verificación: la spec consolidada existe y `openspec list --specs` la muestra
- [x] 10.6 `AGENTS.md` y `CLAUDE.md`: **no se editan a mano**. Se deja registrada en el resumen de implementación que su línea de propiedad de archivos quedó desactualizada por la excepción de `index.html` y que **su regeneración queda pendiente** para el equipo (con `agents-md-generator`, que re-sincroniza `knowledge-base/` y `CHANGES.md`)
  - Requisito: encabezado de `AGENTS.md` y `CLAUDE.md`: "Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos"
  - Verificación: `git diff --name-only` **no** muestra `AGENTS.md` ni `CLAUDE.md`; y el resumen de implementación registra la regeneración pendiente

## Definición de "Hecho" (Definition of Done)

| Criterio | Cómo se verifica |
|----------|------------------|
| Todos los checks `[x]` de este documento | Checklist completo |
| Los 9 criterios de aceptación, el control del filtro activo, el control del helper de selectores y los 2 casos manuales de la consigna ejecutados | Evidencia en `docs/ejercicio4-implementacion-resumen.md`, con estado y motivo por control |
| La validación es propia: sin globo nativo | Control 7.4 y 1.1-1.3 |
| El cambio de `index.html` se limita a 2 atributos `novalidate` | Control 1.3: `git diff --stat index.html` muestra 2 líneas |
| `AGENTS.md` y `CLAUDE.md` sin editar a mano, con la regeneración pendiente registrada | Control 10.6 |
| `js/app.js` y `index.html` son los únicos archivos de producto modificados | `git diff --name-only` |
| Sin regresiones en C-01, C-02 y C-03 | Control 7.9 (búsqueda, catálogo y consola) |
| El change valida contra el esquema de OpenSpec | `openspec validate --changes` |

## Orden de ejecución recomendado

1. **Paso 0 — HTML (1.1-1.3)**: desactivar la validación nativa primero, porque de eso depende que
   nuestra validación sea la única que decide.
2. **Paso 1 — Funciones puras (2.1-2.6)**: normalización, consultas y generación de ids; son lógica
   pura, verificables desde la consola sin tocar el DOM.
3. **Paso 2 — Selectores y listados (3.1-4.5)**: poblar y renderizar; deja la interfaz mostrando datos.
4. **Paso 3 — Validaciones (5.1-5.3)**: reglas puras, sin DOM.
5. **Paso 4 — Flujos (6.1-6.6)**: conectar validaciones, DOM y eventos; recién aquí se puede hacer un
   alta de punta a punta.
6. **Paso 5 — Verificación (7.1-7.11, 8.1-8.2)**: en navegador real, con los casos de la consigna.
7. **Paso 6 — Limpieza (9.1-9.5)**: formato y prohibiciones.
8. **Paso 7 — Gobernanza (10.1-10.6)**: propiedad de archivos, KB, evidencia, validación y archivo.

## Notas para el implementador

- **No inventes campos**: usá exactamente los atributos de `knowledge-base/04_modelo_de_datos.md`:
  el libro es `{id, titulo, isbn, precio, editorialId, generoId, autorIds}` y el cliente
  `{id, nombre, email}`.
- **El HTML ya tiene todo**: no agregues campos, ids, mensajes ni tablas. Solo `novalidate`.
- **El CSS ya tiene todo**: no agregues estilos. `.mensaje[hidden] { display: none }` ya existe.
- **No toques el código de C-03**: `editoriales`, `generos`, `autores`, `libros`, `clientes`, los getters,
  `normalizarBusqueda`, `filtrarLibros`, `renderCatalogo` e `inicializarCatalogo` se reutilizan tal
  cual. Agregá, no modifiques.
- **El filtro activo manda**: al re-renderizar el catálogo después de un alta, pasale
  `filtrarLibros(buscador.value)` (D-04).
- **`#renglon-libro` y `#venta-cliente`**: su población es de este change (D-05), pero **no** implementes
  renglones, total ni historial: eso es C-05.
- **Sin `localStorage`**: la persistencia es del Ejercicio 6.
- **El helper de selectores es de C-04 y lo consume C-05**: `poblarSelectoresRelacionados()` es la
  única función que escribe las opciones de `#venta-cliente` y `#renglon-libro`, no toma argumentos, no
  devuelve nada y **preserva la selección actual** de ambos selectores. No lo reimplementes ni lo
  llames desde otro lado: C-05 lo consume tal cual (D-05).
- **El precio no se redondea**: la validación solo exige "numérico y mayor que cero" (RN-LIB-04). Un
  precio como `10.555` se acepta y se guarda tal cual. **No impongas un límite de decimales sin
  autorización** (D-10).
- **`index.html` es de C-01 salvo por 2 atributos**: solo `novalidate` en `#form-libro` y
  `#form-cliente`. Nada más de ese archivo se toca (control 1.3).
- **`AGENTS.md` y `CLAUDE.md` no se editan a mano**: son archivos generados. Se deja la regeneración
  pendiente y registrada (tarea 10.6).
- **Evidencia**: al terminar, creá `docs/ejercicio4-implementacion-resumen.md` con la tabla de
  verificación control por control, como en los resúmenes de los Ejercicios 1 a 3.