# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librería El Estante — Primer Parcial de Programación III**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

Los 6 changes corresponden **uno a uno a los 6 ejercicios de la consigna** (100 puntos). Los ejercicios 1 y 2 ya están implementados y verificados; los ejercicios 3 a 6 son el trabajo pendiente del equipo.

---

## Cómo usar este documento

> ⚠️ **El trabajo de este parcial se hace SIEMPRE con el ciclo de OpenSpec.** Cada ejercicio es un change: `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Lo que no pasa por ese ciclo no cuenta como entrega.
>
> Las ramas `Parte-3`, `Parte-4` y `ejercicio-5` del remoto son **trabajo previo al ciclo, descartado**: no se integran, no se usan como referencia y no hay que hacer cherry-pick de ellas. Si encontrás código de esos ejercicios por ahí, rehacelo siguiendo el `tasks.md` de tu change.

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Crear el change si todavía no existe: `openspec new change <nombre-del-change>` y redactar `proposal.md`, `design.md` y `tasks.md` (**cada `tasks.md` debe declarar explícitamente los archivos que puede tocar** — ver §Reparto de propiedad de archivos).
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 ejercicio1-estructura-html            ✓ completado  (20 pts)
  └── C-02 ejercicio2-estilos-css          ✓ completado  (20 pts)
        └── C-03 ejercicio3-datos-catalogo-filtro             ← desbloquea las 2 ramas de JS
              ├── C-04 ejercicio4-altas-libros-clientes  (15 pts)
              │     └──┐
              │        ├── C-06 ejercicio6-persistencia-documentacion  (10 pts)
              └── C-05 ejercicio5-venta-historial          (20 pts)
                    └──┘
```

**Reglas de dependencia aplicadas** (derivadas de la consigna, no de la arquitectura):

| Regla | Aplicación en este proyecto |
|---|---|
| La entidad referenciada va antes que la que la referencia | C-03 crea los datos (libros, clientes) → C-04 los usa en sus formularios → C-05 los usa en la venta (con los clientes de la semilla si C-04 todavía no está aplicado) |
| La capa de datos va antes que la capa de comportamiento | C-03 (datos + render) antes que C-04/C-05 (lógica de altas y de ventas) y C-06 (persistencia) |
| El cierre va al final | C-06 (persistencia + README + evidencia) depende de que C-04 y C-05 ya existan, porque el `localStorage` guarda **libros, clientes y ventas** |

### Reparto de propiedad de archivos

> Regla de convivencia (KB `09_decisiones_y_supuestos.md` §SU-02 y §SU-05): **cada change declara en su `tasks.md` los archivos que puede tocar**. Nadie edita un archivo que no es suyo.

| Change | Puede tocar | No puede tocar | Nota |
|---|---|---|---|
| C-01 `ejercicio1-estructura-html` | `index.html` | — | Ya entregado: el HTML queda **congelado** y es la fuente de verdad de la estructura |
| C-02 `ejercicio2-estilos-css` | `css/styles.css`, `css/base.css`, `css/layout.css`, `css/componentes.css` | `index.html`, `js/app.js` | Ya entregado: los estilos nuevos se **agregan**, no se redefinen los existentes |
| C-03 `ejercicio3-datos-catalogo-filtro` | `js/app.js` | `index.html`, `css/` | Dueño exclusivo de `js/app.js` durante su ventana de trabajo |
| C-04 `ejercicio4-altas-libros-clientes` | `js/app.js` | `index.html`, `css/` | ⚠️ Comparte `js/app.js` con C-03, C-05 y C-06 |
| C-05 `ejercicio5-venta-historial` | `js/app.js` | `index.html`, `css/` | ⚠️ Comparte `js/app.js` con C-03, C-04 y C-06 |
| C-06 `ejercicio6-persistencia-documentacion` | `js/app.js`, `README.md` | `index.html`, `css/` | Es el único change que escribe `README.md` |

**Restricción de recurso (no es una dependencia):** C-03, C-04, C-05 y C-06 escriben **el mismo archivo** `js/app.js`. Por lo tanto el paralelismo entre ellos es **lógico**, no de escritura concurrente: se puede trabajar en ramas separadas, pero el **merge sobre `js/app.js` se serializa en el orden C-03 → C-04/C-05 → C-06**.

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 ejercicio1-estructura-html            [Agente A — HTML]   ✓ ya ejecutado

GATE 1: C-01 ✓
  → C-02 ejercicio2-estilos-css                [Agente B — CSS]    ✓ ya ejecutado

GATE 2: C-01 ✓ + C-02 ✓
  → C-03 ejercicio3-datos-catalogo-filtro      [Xavier Papalardo — JS]    ← único change habilitado

GATE 3: C-03 ✓                                ← PRIMER FORK (2 ramas lógicas)
  → C-04 ejercicio4-altas-libros-clientes      [Benjamin Arollo — JS]
  → C-05 ejercicio5-venta-historial            [Martin Sisterna — JS]
        (paralelo lógico; el merge de js/app.js se serializa)

GATE 4: C-04 ✓ + C-05 ✓
  → C-06 ejercicio6-persistencia-documentacion [Lautaro Gómez Canovas — JS + README]
```

### Orden de arranque y de merge (los 4 escriben `js/app.js`)

| # | Change | Responsable | Arranca cuando | Merge a `main` |
|---|---|---|---|---|
| 1 | C-03 | Xavier Papalardo | **ya** (es el único habilitado) | primero: define los datos locales y el render |
| 2 | C-04 | Benjamin Arollo | C-03 mergeado | segundo: consume los datos de C-03 y agrega el registro de clientes y libros |
| 3 | C-05 | Martin Sisterna | C-04 mergeado | tercero: consume los clientes que registró C-04 |
| 4 | C-06 | Lautaro Gómez Canovas | C-04 y C-05 mergeados | último: agrega `localStorage` y el `README.md` |

**El fork de GATE 3 es lógico, no de escritura concurrente.** Los cuatro escriben el mismo `js/app.js`, así que el orden de merge es **C-03 → C-04 → C-05 → C-06**, uno atrás de otro. Mergear C-05 antes que C-04 rompe la venta: C-05 consume clientes y C-04 es quien los registra.

**Cómo trabajar sin pisarse:**

1. Cada quien trabaja en **su propia rama** (`feature/ejercicioN-<apellido>`), nunca en `main` directo.
2. Cada quien abre **su change** con `/opsx:propose <nombre-del-change>` y su `tasks.md` declara que solo toca `js/app.js` (y `README.md` en el caso de C-06).
3. Cuando el change de la fila 1 está mergeado, arranca el de la fila 2. **No se espera a que terminen los dos del fork.**
4. `/opsx:apply` y luego `/opsx:archive`. Con el change archivado, su spec queda en `openspec/specs/` y es la base del siguiente.

### Camino crítico (5 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-05 → C-06
```

- **Tramo ya ejecutado:** `C-01 → C-02` (no consume tiempo del equipo).
- **Tramo pendiente:** `C-03 → C-05 → C-06` — 3 changes. `C-04` es la **rama de longitud igual** al fork del GATE 3: no acorta el camino crítico, pero **sí es indispensable para la entrega** (15 pts) y bloquea a C-06.
- No hay refactors, dashboards ni features opcionales: la consigna no los pide y **no se inventan**.

### Plan óptimo con 3 agentes

| Paso | Agente A (HTML — `index.html`) | Agente B (CSS — `css/`) | Agente C (JS — `js/app.js`, serie) |
|---|---|---|---|
| 1 | C-01 ejercicio1-estructura-html ✓ | — | — |
| 2 | — | C-02 ejercicio2-estilos-css ✓ | — |
| 3 | — | — | C-03 ejercicio3-datos-catalogo-filtro (Xavier Papalardo) |
| 4 | — | — | C-04 ejercicio4-altas-libros-clientes (Benjamin Arollo) — rama A |
| 5 | — | — | C-05 ejercicio5-venta-historial (Martin Sisterna) — rama B |
| 6 | — | — | C-06 ejercicio6-persistencia-documentacion (Lautaro Gómez Canovas) |

Los pasos 3 a 6 los ejecuta **una persona distinta cada uno** (el equipo aún debe asignar responsables — KB `10_preguntas_abiertas.md`, pregunta abierta de prioridad Alta). Como los cuatro escriben `js/app.js`, la columna C avanza **en serie**; el paso 4 y el 5 son ramas de la misma duración, no trabajo concurrente sobre el mismo archivo.

---

## FASE 0 — Estructura y presentación (ejercicios ya entregados)

> FASE cerrada. No hay trabajo pendiente. Se conserva en el roadmap como base de la que parten los demás changes.

### [C-01] `ejercicio1-estructura-html`
- **Estado**: `[x]` **completado y verificado** — 20/20 pts. Entregado 2026-10-16. Evidencia: `docs/ejercicio1-implementacion-resumen.md` + change archivado `ejercicio1-estructura-html`
- **Scope**: Estructura HTML de la SPA de una página con las 5 vistas de la consigna
  - `index.html`: doctype, `lang="es"`, charset, `viewport`, `<title>`, `<link>` a `css/styles.css`, `<script defer>` a `js/app.js`
  - Semántica: `<header class="encabezado">` con `<h1>`, `<nav aria-label>` con los **5 enlaces-ancla** (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`), `<main class="contenido">` con 5 `<section class="vista">`, `<footer class="pie">`
  - Catálogo: `#form-busqueda` (`role="search"`) + `#buscador-titulo` + `#catalogo-listado` + `#catalogo-vacio` (visible) + `#catalogo-sin-resultados` (`hidden`)
  - Libros: `#form-libro` con `#libro-titulo`, `#libro-isbn`, `#libro-precio` (`number step=0.01`), `#libro-editorial`, `#libro-genero` (con `<option value="">Sin clasificar</option>`), `#libro-autores` (`multiple`), `#libro-mensaje-{exito,error}`, tabla `#tabla-libros` con `thead`+`tbody#tabla-libros-cuerpo`
  - Clientes: `#form-cliente` con `#cliente-nombre`, `#cliente-email` (`type=email`), `#cliente-mensaje-{exito,error}`, tabla `#tabla-clientes` con `tbody#tabla-clientes-cuerpo`
  - Ventas: `#form-venta` con `#venta-cliente`, `fieldset/legend` de renglón (`#renglon-libro`, `#renglon-cantidad` `number step=1`, `#boton-agregar-renglon` `type="button"`), tabla `#tabla-renglones` con `tbody#tabla-renglones-cuerpo`, `<output id="venta-total">$0,00</output>`, `#venta-mensaje-{exito,error}`
  - Historial: tabla `#tabla-historial` con `tbody#tabla-historial-cuerpo`, `#historial-vacio` (visible), `#historial-detalle` (`role="region"`) con `#historial-detalle-vacio` y `#tabla-detalle` con `tbody#tabla-detalle-cuerpo`
  - Plantillas `<template>`: `#plantilla-libro` (`.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio`) y `#plantilla-renglon` (`.fila-renglon__libro`, `__cantidad`, `__precio-unitario`, `__subtotal`, `__acciones` con botones "Quitar renglón" / "Modificar renglón")
  - 10 contenedores de estado con `role="status"` / `role="alert"` y `hidden`; 0 CSS inline, 0 `<script>` inline, 0 URLs externas, 42/42 ids presentes y 0 duplicados
  - Verificación ejecutada: 29/29 controles estructurales automatizados + 8/8 de carga real en navegador headless (37 controles, 0 fallidos); 2 controles OMITIDO (inspección visual de capturas y recorrido de teclado en vivo) con su motivo
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` §Ejercicio 1 — Estructura y pantallas HTML
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (US-001, US-002)
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones aplicados · §Estructura de directorios
  - `knowledge-base/02_descripcion_general.md` §Arquitectura general
  - `docs/ejercicio1-implementacion-resumen.md` §2 — evidencia de los 37 controles

---

### [C-02] `ejercicio2-estilos-css`
- **Estado**: `[x]` **completado y verificado** — 20/20 pts. Entregado 2026-10-20. Evidencia: `docs/ejercicio2-implementacion-resumen.md` + change archivado `ejercicio2-estilos-css`
- **Scope**: Identidad visual coherente y uso adaptable, con CSS externo y modular
  - `css/styles.css`: punto de entrada, **solo** 3 `@import` relativos (`base` → `layout` → `componentes`) y 0 reglas
  - `css/base.css`: `:root` con los **38 custom properties** (12 color base, 3 derivados por `color-mix`, 6 tipografía, 8 espaciado, 4 radios, 3 sombras, 2 layout) + reset de `h1`–`h3`/`p`/`fieldset`/`legend` + `box-sizing: border-box` universal + `color-scheme: light`
  - `css/layout.css`: `.encabezado` + `h1` serif, `.navegacion` sticky, `.nav-enlace`, `.contenido`, `.vista` como panel de superficie con `scroll-margin-top`, `.pie` con `margin-block-start: auto`
  - `css/componentes.css`: `.formulario` (grid fluido `minmax(min(100%, 16rem), 1fr)`), `.campo`, `.campo__control` (borde `--color-texto-suave`, `min-block-size: 2.75rem`), `select[multiple]`, `.renglon-alta`, `.boton` + `--secundario`/`--modificar`/`--quitar`, `.mensaje` con 3 variantes y glifo `::before` + `.mensaje[hidden] { display: none }`, `.tabla-contenedor` (`overflow-x: auto`, único origen de scroll horizontal) + `.tabla` + `thead th` + `tbody td` + hover de fila, `.fila-renglon__acciones` sin flex, reglas de preparación `.libro*`, `.listado--catalogo`, `.venta__total`, `.detalle-venta`
  - Accesibilidad: `:focus-visible` global con anillo `2px var(--color-foco)` + halo, `.tabla-contenedor:focus-visible` con anillo hacia adentro (`outline-offset: -3px`), **cero** `outline: none`; errores con texto y doble señal (color + glifo)
  - Adaptabilidad: 2 cortes `@media (min-width: 48rem)` y `@media (min-width: 64rem)` (uno por capa) + `clamp()` y `minmax()` fluidos; `@media (prefers-reduced-motion: reduce)` con las 3 declaraciones `!important` justificadas
  - Verificación ejecutada: 56/56 controles de solo lectura; 16 controles en navegador real a 320 / 768 / 1280 px; 8 suplementarios; 8 pares de contraste renderizado AA; T-14 recorrido con `Tab` reales 26/26 paradas; T-15 modularización 68 ↔ 68 reglas equivalentes y render idéntico en los 3 anchos
  - Controls no cerrados: **OMITIDO** segundo motor de renderizado (no hay otro instalado) y **PENDIENTE POR ALCANCE** la apariencia de tablas y tarjetas *con contenido real* → cierra con C-03 (catálogo) y C-05 (renglones e historial)
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` §Ejercicio 2 — Presentación con CSS y uso adaptable
  - `knowledge-base/06_funcionalidades.md` §Épica 2 (US-003, US-004, US-005)
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Presentación (RN-PRE-01 … RN-PRE-07)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-02, §DD-03, §DD-05, §DD-07, §DD-09
  - `knowledge-base/12_casos_manuales.md` §Trampas de la verificación en navegador

---

## FASE 1 — Datos locales, catálogo y filtro (ejercicio 3)

> Único change habilitado en este momento: todo lo demás depende de él.

### [C-03] `ejercicio3-datos-catalogo-filtro`
- **Estado**: `[ ]` pendiente — 15 pts. US-006, US-007.
- **Scope**: Arrays de datos locales, render del catálogo y filtro por título
  - **Datos** (en `js/app.js`): arrays `editoriales`, `generos`, `autores`, `libros`, `clientes` con **`id` estable**; semilla mínima exigida: **6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes** ficticios
  - **Relaciones**: cada libro con `editorialId` existente, `autorIds` con **1 o más** autores existentes y `generoId` **opcional**; incluir al menos un libro **sin género** para ejercitar «Sin clasificar»
  - **Render**: `renderCatalogo()` clona `#plantilla-libro` y vuelca en `#catalogo-listado`; el texto se inserta **como texto** (`textContent` / `createTextNode`), nunca como HTML interpretable (RN-CAT-08); muestra título, ISBN, editorial, género, autores y precio; «Sin clasificar» cuando el libro no tiene género (RN-CAT-07)
  - **Filtro**: `normalizarBusqueda()` recorta espacios sobrantes y pasa a minúsculas (RN-CAT-04); `filtrarLibros()` compara por **subcadena** sobre el título, ignorando mayúsculas y minúsculas (RN-CAT-02, RN-CAT-03)
  - **Estados**: búsqueda vacía → catálogo completo (RN-CAT-05); búsqueda sin coincidencias → `#catalogo-sin-resultados` visible con mensaje claro, nunca un catálogo vacío (RN-CAT-06); `#catalogo-vacio` para el catálogo sin libros
  - **Eventos**: `input` sobre `#buscador-titulo`; `submit` de `#form-busqueda` controlado con `preventDefault` sin recarga
  - **API interna que dejan las funciones** (la consumen C-04, C-05 y C-06): `obtenerLibroPorId()`, `obtenerEditorialPorId()`, `obtenerGeneroPorId()`, `obtenerAutoresPorIds()`, `obtenerClientes()`
  - **Fuera de alcance explícito**: sin `fetch`, sin CRUD de editoriales, géneros ni autores, sin `localStorage` (eso es C-06)
  - **Verificación**: los 3 casos de búsqueda de `12_casos_manuales.md` (mayúsculas parciales, búsqueda vacía, texto inexistente) + primera aparición de **tarjetas con contenido real** (cierra el control PENDIENTE POR ALCANCE del Ej. 2)
  - **Archivos que puede tocar**: `js/app.js` — y nada más. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-01, C-02
- **Governance**: CRITICO — define el modelo de datos y la forma de los arrays que C-04, C-05 y C-06 consumen; cualquier cambio acá rompe los tres
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` §Ejercicio 3 — Datos locales, catálogo y filtro
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Catálogo (RN-CAT-01 … RN-CAT-08)
  - `knowledge-base/04_modelo_de_datos.md` §Entidades (Libro, Editorial, Género, Autor, Cliente) · §Seed data inicial
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 — Búsqueda en el catálogo
  - `knowledge-base/06_funcionalidades.md` §Épica 3 (US-006, US-007)

---

## FASE 2 — Alta de libros y de clientes (ejercicio 4)

> Rama A del fork del GATE 3. Corre en paralelo lógico con C-05.

### [C-04] `ejercicio4-altas-libros-clientes`
- **Estado**: `[ ]` pendiente — 15 pts. US-008, US-009.
- **Scope**: Formularios de alta de libros y de clientes, con validación en el cliente
  - **Poblar selectores**: `#libro-editorial` y `#libro-genero` se generan desde los datos locales; `#libro-autores` es un selector múltiple con los autores existentes; `#libro-genero` mantiene la opción «Sin clasificar» (`value=""`), que representa la **ausencia** de género y no un género ficticio (RN-LIB-08, RN-LIB-09)
  - **Validación de libro** (`validarLibro()`), con motivo de rechazo explícito por regla:
    - título no vacío (RN-LIB-01) · ISBN no vacío (RN-LIB-02) · ISBN no duplicado, comparado **sin espacios ni guiones**, sin dígito de control (RN-LIB-03, RN-LIB-10)
    - precio numérico y **mayor que cero** (RN-LIB-04) · editorial existente en los datos locales (RN-LIB-05)
    - **al menos un autor** y todos los seleccionados existentes (RN-LIB-06) · género puede quedar sin asignar; si se asigna, debe existir (RN-LIB-07)
  - **Alta de libro**: `submit` de `#form-libro` con `preventDefault`; los fallos se muestran cerca del formulario en `#libro-mensaje-error`; si todo pasa, se agrega el libro, se muestra `#libro-mensaje-exito`, se **limpia el formulario** y se actualizan `#tabla-libros-cuerpo` y las **opciones relacionadas** (selector de libro de la venta) **sin recargar la página**
  - **Validación de cliente** (`validarCliente()`): nombre completo no vacío (RN-CLI-01) · email no vacío (RN-CLI-02) · email con **formato válido** (RN-CLI-03) · email único, comparado **sin espacios exteriores y sin distinguir mayúsculas de minúsculas** (RN-CLI-04); no se pide campo de apellido separado (RN-CLI-05)
  - **Alta de cliente**: `submit` de `#form-cliente` con `preventDefault`; `#cliente-mensaje-error` / `#cliente-mensaje-exito`; se limpia el formulario y se actualizan `#tabla-clientes-cuerpo` y el selector `#venta-cliente` sin recargar
  - **Restricciones**: la validación es **declarativa y pedagógica**, no de seguridad (RN-GL-04); el HTML **no** usa `required`/`pattern`/`min` (la validación es de JS); no se implementa edición ni borrado de registros (no lo pide la consigna)
  - **Verificación**: casos «ISBN existente / ISBN nuevo» y «email inválido / email existente en mayúsculas / email nuevo» de `12_casos_manuales.md`
  - **Archivos que puede tocar**: `js/app.js` — y nada más. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-03
- **Governance**: MEDIO — flujo con estado (alta, error, refresco de listados y selectores) y validación replicada en la interfaz
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` §Ejercicio 4 — Alta de libros y clientes
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Alta de libros (RN-LIB-01 … RN-LIB-10) · §Dominio: Alta de clientes (RN-CLI-01 … RN-CLI-06)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 — Alta de un libro · §Flujo 3 — Alta de un cliente
  - `knowledge-base/04_modelo_de_datos.md` §Libro · §Cliente
  - `knowledge-base/06_funcionalidades.md` §Épica 4 (US-008, US-009)

---

## FASE 3 — Venta simulada e historial (ejercicio 5)

> Rama B del fork del GATE 3. Corre en paralelo lógico con C-04. Es el change de mayor puntaje pendiente (20 pts).

### [C-05] `ejercicio5-venta-historial`
- **Estado**: `[ ]` pendiente — 20 pts. US-010, US-011, US-012.
- **Scope**: Composición de la venta, confirmación con total e historial inmutable
  - **Poblar selectores**: `#venta-cliente` con los clientes disponibles (los de la semilla de C-03 y los registrados por C-04) y `#renglon-libro` con los libros del catálogo
  - **Agregar renglón**: `agregarRenglon()` valida que el libro exista y que la cantidad sea un **entero mayor que cero** (RN-VEN-02); ante un **libro repetido** se informa el duplicado o se modifica la cantidad del renglón existente, **nunca** se crea un segundo renglón (RN-VEN-03); clona `#plantilla-renglon` y vuelca en `#tabla-renglones-cuerpo`
  - **Columnas del renglón**: libro, cantidad, precio unitario y subtotal (RN-VEN-05)
  - **Cálculos**: `subtotal = cantidad × precioUnitario` (RN-VEN-06); `total = Σ subtotales` (RN-VEN-07); importes con **dos decimales** (RN-VEN-08) en `#venta-total`
  - **Edición previa a confirmar**: cambiar cantidades y quitar renglones con los botones "Modificar renglón" / "Quitar renglón" (RN-VEN-04)
  - **Confirmación**: `confirmarVenta()` **impide** confirmar sin cliente, sin renglones o con cantidades inválidas (RN-VEN-09); al confirmar registra **identificador, fecha, cliente, renglones y total** (RN-VEN-10)
  - **Invariante clave**: el `precioUnitario` **se copia** al renglón como valor histórico y **no** se vuelve a leer del catálogo; junto con él se copian los **datos descriptivos** necesarios para leer la venta (título, ISBN) (RN-VEN-11, RN-VEN-12) — es lo que evalúa la comprobación guiada del docente
  - **Post-condición**: la confirmación **limpia el formulario** para una nueva venta y muestra un mensaje de resultado (RN-VEN-14); las ventas confirmadas **no se editan ni se eliminan** desde la interfaz (RN-VEN-13)
  - **Historial**: `renderHistorial()` vuelca en `#tabla-historial-cuerpo` con **identificador, fecha, cliente y total** (RN-HIS-01); `#historial-vacio` cuando no hay ventas; "Ver detalle" renderiza los renglones en `#tabla-detalle-cuerpo` **con el precio unitario histórico** (RN-HIS-02) y oculta `#historial-detalle-vacio`
  - **Verificación**: venta sin cliente / cantidad 0, negativa o decimal / libro repetido; y la venta de referencia «2 unidades a 1500 y 1 a 2000 → subtotales 3000 y 2000, total 5000», con el detalle conservado en el historial
  - **Dependencia blanda con C-04**: si C-04 ya está aplicado, el selector de clientes incluye a los registrados; si no, se trabaja con los 3 clientes de la semilla. C-05 **no** implementa el alta de clientes
  - **Archivos que puede tocar**: `js/app.js` — y nada más. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-03
- **Governance**: MEDIO — máquina de estados de la venta (borrador → confirmada) con la invariante de precio histórico, que es el control que el docente ejecuta en la copia de prueba
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` §Ejercicio 5 — Venta simulada e historial
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Ventas (RN-VEN-01 … RN-VEN-14) · §Dominio: Historial (RN-HIS-01, RN-HIS-02)
  - `knowledge-base/07_flujos_principales.md` §Flujo 4 — Venta simulada · §Flujo 5 — Consulta del historial y del detalle
  - `knowledge-base/04_modelo_de_datos.md` §Venta · §Renglón (invariante de `precioUnitario`)
  - `knowledge-base/06_funcionalidades.md` §Épica 5 (US-010, US-011, US-012)

---

## FASE 4 — Persistencia, verificación y documentación (ejercicio 6)

> Cierra el proyecto. Depende de que C-04 y C-05 estén aplicados, porque el `localStorage` guarda libros, clientes **y** ventas.

### [C-06] `ejercicio6-persistencia-documentacion`
- **Estado**: `[ ]` pendiente — 10 pts. US-013, US-014.
- **Scope**: Persistencia con `localStorage`, evidencia de los casos manuales y README de entrega
  - **Clave de almacenamiento**: una clave única, versionada y documentada en el README (p. ej. `libreria-el-estante:v1`) que guarda el objeto `{ libros, clientes, ventas }` — la única "configuración" del proyecto (KB `08_arquitectura_propuesta.md` §Variables de entorno)
  - **Carga inicial**: `cargarEstado()` lee `localStorage`; si la clave **no existe** carga la **semilla de C-03** (RN-PER-02); si existe, recupera los registros guardados **sin duplicar** los datos iniciales (RN-PER-03)
  - **Escritura**: `guardarEstado()` persiste libros, clientes y ventas (RN-PER-01) después de cada alta de libro, cada alta de cliente y cada venta confirmada
  - **README.md** (documento de entrega exigido por la consigna):
    - quiénes realizan el trabajo
    - pasos para **abrir `index.html` en el navegador sin npm**, con la URL `file://` de ejemplo
    - navegación entre las 5 vistas
    - funcionalidades **implementadas y pendientes**
    - **ubicación de los datos iniciales** (la semilla vive en `js/app.js`)
    - funcionamiento y **límites** de `localStorage`: depende del navegador, del perfil y de la ubicación de apertura, y **no comparte información entre usuarios** (RN-PER-04)
    - **resultados observados** de los 8 casos manuales de `12_casos_manuales.md`: *ningún caso se marca aprobado sin ejecutarlo*; si falla o queda pendiente, se registra el comportamiento real
    - **procedencia de imágenes ajenas**: en este proyecto hay **cero imágenes**, se declara explícitamente y no se inventa procedencia (KB `10_preguntas_abiertas.md`, IN-03)
    - **comprobación guiada del precio histórico**: la **ubicación y la estructura del catálogo guardado** para que el docente reproduzca los 4 pasos de la consigna, y el resultado observado de esa comprobación
  - **Alcance técnico de la entrega**: solo `index.html`, `css/`, `js/` y `README.md`; **cero dependencias instaladas, cero herramientas de compilación** (RN-GL-01, RN-GL-03)
  - **Verificación**: recálculo del estado tras alta y venta → recargar → recuperar los datos sin duplicar ejemplos ni ventas
  - **Archivos que puede tocar**: `js/app.js` y `README.md` — y nada más. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-04, C-05 (y C-03 de forma transitiva)
- **Governance**: MEDIO — toca la ruta de escritura de las tres entidades y es la base de la comprobación guiada del precio histórico que evalúa el docente
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` §Ejercicio 6 — Persistencia, verificación y documentación · §Formato de entrega
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Persistencia (RN-PER-01 … RN-PER-04) · §Excepciones globales (RN-GL-01 … RN-GL-05)
  - `knowledge-base/12_casos_manuales.md` §Casos manuales exigidos por la consigna · §Comprobación guiada del precio histórico
  - `knowledge-base/07_flujos_principales.md` §Flujo 6 — Persistencia entre recargas
  - `knowledge-base/06_funcionalidades.md` §Épica 6 (US-013, US-014)

---

## Resumen de los changes

| Change | Ejercicio | Puntos | Estado | Depende de | Puede tocar | Estado en `openspec/changes/` |
|---|---|---|---|---|---|---|
| C-01 `ejercicio1-estructura-html` | 1 | 20 | `[x]` completado | — | `index.html` | Completo (`proposal`+`design`+`tasks`+`spec`); falta archivar |
| C-02 `ejercicio2-estilos-css` | 2 | 20 | `[x]` completado | C-01 | `css/` | Scaffold vacío: falta `proposal`+`design`+`tasks`+`spec` |
| C-03 `ejercicio3-datos-catalogo-filtro` | 3 | 15 | `[ ]` pendiente | C-01, C-02 | `js/app.js` | Scaffold vacío: falta `proposal`+`design`+`tasks`+`spec` |
| C-04 `ejercicio4-altas-libros-clientes` | 4 | 15 | `[ ]` pendiente | C-03 | `js/app.js` | Scaffold vacío: falta `proposal`+`design`+`tasks`+`spec` |
| C-05 `ejercicio5-venta-historial` | 5 | 20 | `[ ]` pendiente | C-03 | `js/app.js` | Scaffold vacío: falta `proposal`+`design`+`tasks`+`spec` |
| C-06 `ejercicio6-persistencia-documentacion` | 6 | 10 | `[ ]` pendiente | C-04, C-05 | `js/app.js`, `README.md` | Scaffold vacío: falta `proposal`+`design`+`tasks`+`spec` |
| **Total** | | **100** | 40 pts entregados · 60 pts pendientes | | | |

> Los 6 scaffolds de change ya existen (creados el 2026-10-21 con `openspec new change <nombre>`). Este roadmap **no los modifica**: los documentos `proposal.md`, `design.md` y `tasks.md` de los changes 2 a 6 se redactan en la fase `propose` de cada uno, y cada `tasks.md` **debe declarar los archivos que puede tocar** (§Reparto de propiedad de archivos).

**Primer change recomendado:** `C-03` (`ejercicio3-datos-catalogo-filtro`) — es el único habilitado: depende solo de trabajo ya entregado, y su `apply` desbloquea las dos ramas del GATE 3.

**Último paso de la secuencia:** `C-06` (`ejercicio6-persistencia-documentacion`) — cierra la persistencia, la evidencia de los casos manuales y el README de entrega.
