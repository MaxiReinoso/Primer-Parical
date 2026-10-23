# CHANGES â€” Secuencia de ImplementaciÃ³n

> Ãndice canÃ³nico de todos los changes del proyecto **LibrerÃ­a El Estante â€” Primer Parcial de ProgramaciÃ³n III**.
> Cada change es atÃ³mico: un agente puede implementarlo en una sesiÃ³n (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

Los 6 changes corresponden **uno a uno a los 6 ejercicios de la consigna** (100 puntos). Los ejercicios 1 y 2 ya estÃ¡n implementados y verificados; los ejercicios 3 a 6 son el trabajo pendiente del equipo.

---

## CÃ³mo usar este documento

> âš ï¸ **El trabajo de este parcial se hace SIEMPRE con el ciclo de OpenSpec.** Cada ejercicio es un change: `/opsx:propose` â†’ `/opsx:apply` â†’ `/opsx:archive`. Lo que no pasa por ese ciclo no cuenta como entrega.
>
> Las ramas `Parte-3`, `Parte-4` y `ejercicio-5` del remoto son **trabajo previo al ciclo, descartado**: no se integran, no se usan como referencia y no hay que hacer cherry-pick de ellas. Si encontrÃ¡s cÃ³digo de esos ejercicios por ahÃ­, rehacelo siguiendo el `tasks.md` de tu change.

1. Identificar el change a implementar (verificar que sus dependencias estÃ¡n en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Crear el change si todavÃ­a no existe: `openspec new change <nombre-del-change>` y redactar `proposal.md`, `design.md` y `tasks.md` (**cada `tasks.md` debe declarar explÃ­citamente los archivos que puede tocar** â€” ver Â§Reparto de propiedad de archivos).
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Ãrbol de dependencias

```
C-01 ejercicio1-estructura-html            âœ“ completado  (20 pts)
  â””â”€â”€ C-02 ejercicio2-estilos-css          âœ“ completado  (20 pts)
        â””â”€â”€ C-03 ejercicio3-datos-catalogo-filtro             â† desbloquea las 2 ramas de JS
              â”œâ”€â”€ C-04 ejercicio4-altas-libros-clientes  (15 pts)
              â”‚     â””â”€â”€â”
              â”‚        â”œâ”€â”€ C-06 ejercicio6-persistencia-documentacion  (10 pts)
              â””â”€â”€ C-05 ejercicio5-venta-historial          (20 pts)
                    â””â”€â”€â”˜
```

**Reglas de dependencia aplicadas** (derivadas de la consigna, no de la arquitectura):

| Regla | AplicaciÃ³n en este proyecto |
|---|---|
| La entidad referenciada va antes que la que la referencia | C-03 crea los datos (libros, clientes) â†’ C-04 los usa en sus formularios â†’ C-05 los usa en la venta (con los clientes de la semilla si C-04 todavÃ­a no estÃ¡ aplicado) |
| La capa de datos va antes que la capa de comportamiento | C-03 (datos + render) antes que C-04/C-05 (lÃ³gica de altas y de ventas) y C-06 (persistencia) |
| El cierre va al final | C-06 (persistencia + README + evidencia) depende de que C-04 y C-05 ya existan, porque el `localStorage` guarda **libros, clientes y ventas** |

### Reparto de propiedad de archivos

> Regla de convivencia (KB `09_decisiones_y_supuestos.md` Â§SU-02 y Â§SU-05): **cada change declara en su `tasks.md` los archivos que puede tocar**. Nadie edita un archivo que no es suyo.

| Change | Puede tocar | No puede tocar | Nota |
|---|---|---|---|
| C-01 `ejercicio1-estructura-html` | `index.html` | â€” | Ya entregado: el HTML queda **congelado** y es la fuente de verdad de la estructura |
| C-02 `ejercicio2-estilos-css` | `css/styles.css`, `css/base.css`, `css/layout.css`, `css/componentes.css` | `index.html`, `js/app.js` | Ya entregado: los estilos nuevos se **agregan**, no se redefinen los existentes |
| C-03 `ejercicio3-datos-catalogo-filtro` | `js/app.js` | `index.html`, `css/` | DueÃ±o exclusivo de `js/app.js` durante su ventana de trabajo |
| C-04 `ejercicio4-altas-libros-clientes` | `js/app.js`, `index.html` | `css/` | âš ï¸ Comparte `js/app.js` con C-03, C-05 y C-06. ExcepciÃ³n declarada: `index.html` **solo** recibe el atributo `novalidate` en `#form-libro` y `#form-cliente`; el resto del HTML sigue congelado |
| C-05 `ejercicio5-venta-historial` | `js/app.js` | `index.html`, `css/` | âš ï¸ Comparte `js/app.js` con C-03, C-04 y C-06. **C-04 define `poblarSelectoresRelacionados()` y C-05 la reutiliza, no la reimplementa** (design.md D-05) |
| C-06 `ejercicio6-persistencia-documentacion` | `js/app.js`, `README.md` | `index.html`, `css/` | Es el Ãºnico change que escribe `README.md` |

**RestricciÃ³n de recurso (no es una dependencia):** C-03, C-04, C-05 y C-06 escriben **el mismo archivo** `js/app.js`. Por lo tanto el paralelismo entre ellos es **lÃ³gico**, no de escritura concurrente: se puede trabajar en ramas separadas, pero el **merge sobre `js/app.js` se serializa en el orden C-03 â†’ C-04/C-05 â†’ C-06**.

### Paralelismo por fase

> Cada "gate" es un punto de sincronizaciÃ³n. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  â†’ C-01 ejercicio1-estructura-html            [Agente A â€” HTML]   âœ“ ya ejecutado

GATE 1: C-01 âœ“
  â†’ C-02 ejercicio2-estilos-css                [Agente B â€” CSS]    âœ“ ya ejecutado

GATE 2: C-01 âœ“ + C-02 âœ“
  â†’ C-03 ejercicio3-datos-catalogo-filtro      [Xavier Papalardo â€” JS]    â† Ãºnico change habilitado

GATE 3: C-03 âœ“                                â† PRIMER FORK (2 ramas lÃ³gicas)
  â†’ C-04 ejercicio4-altas-libros-clientes      [Benjamin Arollo â€” JS]
  â†’ C-05 ejercicio5-venta-historial            [Martin Sisterna â€” JS]
        (paralelo lÃ³gico; el merge de js/app.js se serializa)

GATE 4: C-04 âœ“ + C-05 âœ“
  â†’ C-06 ejercicio6-persistencia-documentacion [Lautaro GÃ³mez Canovas â€” JS + README]
```

### Orden de arranque y de merge (los 4 escriben `js/app.js`)

| # | Change | Responsable | Arranca cuando | Merge a `main` |
|---|---|---|---|---|
| 1 | C-03 | Xavier Papalardo | **ya** (es el Ãºnico habilitado) | primero: define los datos locales y el render |
| 2 | C-04 | Benjamin Arollo | C-03 mergeado | segundo: consume los datos de C-03 y agrega el registro de clientes y libros |
| 3 | C-05 | Martin Sisterna | C-04 mergeado | tercero: consume los clientes que registrÃ³ C-04 |
| 4 | C-06 | Lautaro GÃ³mez Canovas | C-04 y C-05 mergeados | Ãºltimo: agrega `localStorage` y el `README.md` |

**El fork de GATE 3 es lÃ³gico, no de escritura concurrente.** Los cuatro escriben el mismo `js/app.js`, asÃ­ que el orden de merge es **C-03 â†’ C-04 â†’ C-05 â†’ C-06**, uno atrÃ¡s de otro. Mergear C-05 antes que C-04 rompe la venta: C-05 consume clientes y C-04 es quien los registra.

**CÃ³mo trabajar sin pisarse:**

1. Cada quien trabaja en **su propia rama** (`feature/ejercicioN-<apellido>`), nunca en `main` directo.
2. Cada quien abre **su change** con `/opsx:propose <nombre-del-change>` y su `tasks.md` declara que solo toca `js/app.js` (y `README.md` en el caso de C-06).
3. Cuando el change de la fila 1 estÃ¡ mergeado, arranca el de la fila 2. **No se espera a que terminen los dos del fork.**
4. `/opsx:apply` y luego `/opsx:archive`. Con el change archivado, su spec queda en `openspec/specs/` y es la base del siguiente.

### Camino crÃ­tico (5 changes â€” mÃ­nimo irreducible)

```
C-01 â†’ C-02 â†’ C-03 â†’ C-05 â†’ C-06
```

- **Tramo ya ejecutado:** `C-01 â†’ C-02` (no consume tiempo del equipo).
- **Tramo pendiente:** `C-03 â†’ C-05 â†’ C-06` â€” 3 changes. `C-04` es la **rama de longitud igual** al fork del GATE 3: no acorta el camino crÃ­tico, pero **sÃ­ es indispensable para la entrega** (15 pts) y bloquea a C-06.
- No hay refactors, dashboards ni features opcionales: la consigna no los pide y **no se inventan**.

### Plan Ã³ptimo con 3 agentes

| Paso | Agente A (HTML â€” `index.html`) | Agente B (CSS â€” `css/`) | Agente C (JS â€” `js/app.js`, serie) |
|---|---|---|---|
| 1 | C-01 ejercicio1-estructura-html âœ“ | â€” | â€” |
| 2 | â€” | C-02 ejercicio2-estilos-css âœ“ | â€” |
| 3 | â€” | â€” | C-03 ejercicio3-datos-catalogo-filtro (Xavier Papalardo) |
| 4 | â€” | â€” | C-04 ejercicio4-altas-libros-clientes (Benjamin Arollo) â€” rama A |
| 5 | â€” | â€” | C-05 ejercicio5-venta-historial (Martin Sisterna) â€” rama B |
| 6 | â€” | â€” | C-06 ejercicio6-persistencia-documentacion (Lautaro GÃ³mez Canovas) |

Los pasos 3 a 6 los ejecuta **una persona distinta cada uno** (el equipo aÃºn debe asignar responsables â€” KB `10_preguntas_abiertas.md`, pregunta abierta de prioridad Alta). Como los cuatro escriben `js/app.js`, la columna C avanza **en serie**; el paso 4 y el 5 son ramas de la misma duraciÃ³n, no trabajo concurrente sobre el mismo archivo.

---

## FASE 0 â€” Estructura y presentaciÃ³n (ejercicios ya entregados)

> FASE cerrada. No hay trabajo pendiente. Se conserva en el roadmap como base de la que parten los demÃ¡s changes.

### [C-01] `ejercicio1-estructura-html`
- **Estado**: `[x]` **completado y verificado** â€” 20/20 pts. Entregado 2026-10-16. Evidencia: `docs/ejercicio1-implementacion-resumen.md` + change archivado `ejercicio1-estructura-html`
- **Scope**: Estructura HTML de la SPA de una pÃ¡gina con las 5 vistas de la consigna
  - `index.html`: doctype, `lang="es"`, charset, `viewport`, `<title>`, `<link>` a `css/styles.css`, `<script defer>` a `js/app.js`
  - SemÃ¡ntica: `<header class="encabezado">` con `<h1>`, `<nav aria-label>` con los **5 enlaces-ancla** (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`), `<main class="contenido">` con 5 `<section class="vista">`, `<footer class="pie">`
  - CatÃ¡logo: `#form-busqueda` (`role="search"`) + `#buscador-titulo` + `#catalogo-listado` + `#catalogo-vacio` (visible) + `#catalogo-sin-resultados` (`hidden`)
  - Libros: `#form-libro` con `#libro-titulo`, `#libro-isbn`, `#libro-precio` (`number step=0.01`), `#libro-editorial`, `#libro-genero` (con `<option value="">Sin clasificar</option>`), `#libro-autores` (`multiple`), `#libro-mensaje-{exito,error}`, tabla `#tabla-libros` con `thead`+`tbody#tabla-libros-cuerpo`
  - Clientes: `#form-cliente` con `#cliente-nombre`, `#cliente-email` (`type=email`), `#cliente-mensaje-{exito,error}`, tabla `#tabla-clientes` con `tbody#tabla-clientes-cuerpo`
  - Ventas: `#form-venta` con `#venta-cliente`, `fieldset/legend` de renglÃ³n (`#renglon-libro`, `#renglon-cantidad` `number step=1`, `#boton-agregar-renglon` `type="button"`), tabla `#tabla-renglones` con `tbody#tabla-renglones-cuerpo`, `<output id="venta-total">$0,00</output>`, `#venta-mensaje-{exito,error}`
  - Historial: tabla `#tabla-historial` con `tbody#tabla-historial-cuerpo`, `#historial-vacio` (visible), `#historial-detalle` (`role="region"`) con `#historial-detalle-vacio` y `#tabla-detalle` con `tbody#tabla-detalle-cuerpo`
  - Plantillas `<template>`: `#plantilla-libro` (`.libro__titulo`, `.libro__isbn`, `.libro__editorial`, `.libro__genero`, `.libro__autores`, `.libro__precio`) y `#plantilla-renglon` (`.fila-renglon__libro`, `__cantidad`, `__precio-unitario`, `__subtotal`, `__acciones` con botones "Quitar renglÃ³n" / "Modificar renglÃ³n")
  - 10 contenedores de estado con `role="status"` / `role="alert"` y `hidden`; 0 CSS inline, 0 `<script>` inline, 0 URLs externas, 42/42 ids presentes y 0 duplicados
  - VerificaciÃ³n ejecutada: 29/29 controles estructurales automatizados + 8/8 de carga real en navegador headless (37 controles, 0 fallidos); 2 controles OMITIDO (inspecciÃ³n visual de capturas y recorrido de teclado en vivo) con su motivo
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` Â§Ejercicio 1 â€” Estructura y pantallas HTML
  - `knowledge-base/06_funcionalidades.md` Â§Ã‰pica 1 (US-001, US-002)
  - `knowledge-base/08_arquitectura_propuesta.md` Â§Patrones aplicados Â· Â§Estructura de directorios
  - `knowledge-base/02_descripcion_general.md` Â§Arquitectura general
  - `docs/ejercicio1-implementacion-resumen.md` Â§2 â€” evidencia de los 37 controles

---

### [C-02] `ejercicio2-estilos-css`
- **Estado**: `[x]` **completado y verificado** â€” 20/20 pts. Entregado 2026-10-20. Evidencia: `docs/ejercicio2-implementacion-resumen.md` + change archivado `ejercicio2-estilos-css`
- **Scope**: Identidad visual coherente y uso adaptable, con CSS externo y modular
  - `css/styles.css`: punto de entrada, **solo** 3 `@import` relativos (`base` â†’ `layout` â†’ `componentes`) y 0 reglas
  - `css/base.css`: `:root` con los **38 custom properties** (12 color base, 3 derivados por `color-mix`, 6 tipografÃ­a, 8 espaciado, 4 radios, 3 sombras, 2 layout) + reset de `h1`â€“`h3`/`p`/`fieldset`/`legend` + `box-sizing: border-box` universal + `color-scheme: light`
  - `css/layout.css`: `.encabezado` + `h1` serif, `.navegacion` sticky, `.nav-enlace`, `.contenido`, `.vista` como panel de superficie con `scroll-margin-top`, `.pie` con `margin-block-start: auto`
  - `css/componentes.css`: `.formulario` (grid fluido `minmax(min(100%, 16rem), 1fr)`), `.campo`, `.campo__control` (borde `--color-texto-suave`, `min-block-size: 2.75rem`), `select[multiple]`, `.renglon-alta`, `.boton` + `--secundario`/`--modificar`/`--quitar`, `.mensaje` con 3 variantes y glifo `::before` + `.mensaje[hidden] { display: none }`, `.tabla-contenedor` (`overflow-x: auto`, Ãºnico origen de scroll horizontal) + `.tabla` + `thead th` + `tbody td` + hover de fila, `.fila-renglon__acciones` sin flex, reglas de preparaciÃ³n `.libro*`, `.listado--catalogo`, `.venta__total`, `.detalle-venta`
  - Accesibilidad: `:focus-visible` global con anillo `2px var(--color-foco)` + halo, `.tabla-contenedor:focus-visible` con anillo hacia adentro (`outline-offset: -3px`), **cero** `outline: none`; errores con texto y doble seÃ±al (color + glifo)
  - Adaptabilidad: 2 cortes `@media (min-width: 48rem)` y `@media (min-width: 64rem)` (uno por capa) + `clamp()` y `minmax()` fluidos; `@media (prefers-reduced-motion: reduce)` con las 3 declaraciones `!important` justificadas
  - VerificaciÃ³n ejecutada: 56/56 controles de solo lectura; 16 controles en navegador real a 320 / 768 / 1280 px; 8 suplementarios; 8 pares de contraste renderizado AA; T-14 recorrido con `Tab` reales 26/26 paradas; T-15 modularizaciÃ³n 68 â†” 68 reglas equivalentes y render idÃ©ntico en los 3 anchos
  - Controls no cerrados: **OMITIDO** segundo motor de renderizado (no hay otro instalado) y **PENDIENTE POR ALCANCE** la apariencia de tablas y tarjetas *con contenido real* â†’ cierra con C-03 (catÃ¡logo) y C-05 (renglones e historial)
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` Â§Ejercicio 2 â€” PresentaciÃ³n con CSS y uso adaptable
  - `knowledge-base/06_funcionalidades.md` Â§Ã‰pica 2 (US-003, US-004, US-005)
  - `knowledge-base/05_reglas_de_negocio.md` Â§Dominio: PresentaciÃ³n (RN-PRE-01 â€¦ RN-PRE-07)
  - `knowledge-base/09_decisiones_y_supuestos.md` Â§DD-02, Â§DD-03, Â§DD-05, Â§DD-07, Â§DD-09
  - `knowledge-base/12_casos_manuales.md` Â§Trampas de la verificaciÃ³n en navegador

---

## FASE 1 â€” Datos locales, catÃ¡logo y filtro (ejercicio 3)

> Ãšnico change habilitado en este momento: todo lo demÃ¡s depende de Ã©l.

### [C-03] `ejercicio3-datos-catalogo-filtro`
- **Estado**: `[x]` **completado y archivado** â€” 15 pts. US-006, US-007. Archivado 2026-10-21. Evidencia: `docs/ejercicio3-implementacion-resumen.md` + change archivado `ejercicio3-datos-catalogo-filtro` + spec consolidada `openspec/specs/catalogo-filtro/spec.md`
- **Scope**: Arrays de datos locales, render del catÃ¡logo y filtro por tÃ­tulo
  - **Datos** (en `js/app.js`): arrays `editoriales`, `generos`, `autores`, `libros`, `clientes` con **`id` estable**; semilla mÃ­nima exigida: **6 libros, 2 editoriales, 2 gÃ©neros, 3 autores, 3 clientes** ficticios
  - **Relaciones**: cada libro con `editorialId` existente, `autorIds` con **1 o mÃ¡s** autores existentes y `generoId` **opcional**; incluir al menos un libro **sin gÃ©nero** para ejercitar Â«Sin clasificarÂ»
  - **Render**: `renderCatalogo()` clona `#plantilla-libro` y vuelca en `#catalogo-listado`; el texto se inserta **como texto** (`textContent` / `createTextNode`), nunca como HTML interpretable (RN-CAT-08); muestra tÃ­tulo, ISBN, editorial, gÃ©nero, autores y precio; Â«Sin clasificarÂ» cuando el libro no tiene gÃ©nero (RN-CAT-07)
  - **Filtro**: `normalizarBusqueda()` recorta espacios sobrantes y pasa a minÃºsculas (RN-CAT-04); `filtrarLibros()` compara por **subcadena** sobre el tÃ­tulo, ignorando mayÃºsculas y minÃºsculas (RN-CAT-02, RN-CAT-03)
  - **Estados**: bÃºsqueda vacÃ­a â†’ catÃ¡logo completo (RN-CAT-05); bÃºsqueda sin coincidencias â†’ `#catalogo-sin-resultados` visible con mensaje claro, nunca un catÃ¡logo vacÃ­o (RN-CAT-06); `#catalogo-vacio` para el catÃ¡logo sin libros
  - **Eventos**: `input` sobre `#buscador-titulo`; `submit` de `#form-busqueda` controlado con `preventDefault` sin recarga
  - **API interna que dejan las funciones** (la consumen C-04, C-05 y C-06): `obtenerLibroPorId()`, `obtenerEditorialPorId()`, `obtenerGeneroPorId()`, `obtenerAutoresPorIds()`, `obtenerClientes()`
  - **Fuera de alcance explÃ­cito**: sin `fetch`, sin CRUD de editoriales, gÃ©neros ni autores, sin `localStorage` (eso es C-06)
  - **VerificaciÃ³n**: los 3 casos de bÃºsqueda de `12_casos_manuales.md` (mayÃºsculas parciales, bÃºsqueda vacÃ­a, texto inexistente) + primera apariciÃ³n de **tarjetas con contenido real** (cierra el control PENDIENTE POR ALCANCE del Ej. 2)
  - **Archivos que puede tocar**: `js/app.js` â€” y nada mÃ¡s. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-01, C-02
- **Governance**: CRITICO â€” define el modelo de datos y la forma de los arrays que C-04, C-05 y C-06 consumen; cualquier cambio acÃ¡ rompe los tres
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` Â§Ejercicio 3 â€” Datos locales, catÃ¡logo y filtro
  - `knowledge-base/05_reglas_de_negocio.md` Â§Dominio: CatÃ¡logo (RN-CAT-01 â€¦ RN-CAT-08)
  - `knowledge-base/04_modelo_de_datos.md` Â§Entidades (Libro, Editorial, GÃ©nero, Autor, Cliente) Â· Â§Seed data inicial
  - `knowledge-base/07_flujos_principales.md` Â§Flujo 1 â€” BÃºsqueda en el catÃ¡logo
  - `knowledge-base/06_funcionalidades.md` Â§Ã‰pica 3 (US-006, US-007)

---

## FASE 2 â€” Alta de libros y de clientes (ejercicio 4)

> Rama A del fork del GATE 3. Corre en paralelo lÃ³gico con C-05.

### [C-04] `ejercicio4-altas-libros-clientes`
- **Estado**: `[x]` **completado y archivado** â€” 15 pts. US-008, US-009. Entregado 2026-10-22. Evidencia: `docs/ejercicio4-implementacion-resumen.md` + change archivado `2026-10-22-ejercicio4-altas-libros-clientes`
- **Scope**: Formularios de alta de libros y de clientes, con validaciÃ³n en el cliente
  - **Poblar selectores**: `#libro-editorial` y `#libro-genero` se generan desde los datos locales; `#libro-autores` es un selector mÃºltiple con los autores existentes; `#libro-genero` mantiene la opciÃ³n Â«Sin clasificarÂ» (`value=""`), que representa la **ausencia** de gÃ©nero y no un gÃ©nero ficticio (RN-LIB-08, RN-LIB-09)
  - **ValidaciÃ³n de libro** (`validarLibro()`), con motivo de rechazo explÃ­cito por regla:
    - tÃ­tulo no vacÃ­o (RN-LIB-01) Â· ISBN no vacÃ­o (RN-LIB-02) Â· ISBN no duplicado, comparado **sin espacios ni guiones**, sin dÃ­gito de control (RN-LIB-03, RN-LIB-10)
    - precio numÃ©rico y **mayor que cero** (RN-LIB-04) Â· editorial existente en los datos locales (RN-LIB-05)
    - **al menos un autor** y todos los seleccionados existentes (RN-LIB-06) Â· gÃ©nero puede quedar sin asignar; si se asigna, debe existir (RN-LIB-07)
  - **Alta de libro**: `submit` de `#form-libro` con `preventDefault`; los fallos se muestran cerca del formulario en `#libro-mensaje-error`; si todo pasa, se agrega el libro, se muestra `#libro-mensaje-exito`, se **limpia el formulario** y se actualizan `#tabla-libros-cuerpo` y las **opciones relacionadas** (selector de libro de la venta) **sin recargar la pÃ¡gina**
  - **ValidaciÃ³n de cliente** (`validarCliente()`): nombre completo no vacÃ­o (RN-CLI-01) Â· email no vacÃ­o (RN-CLI-02) Â· email con **formato vÃ¡lido** (RN-CLI-03) Â· email Ãºnico, comparado **sin espacios exteriores y sin distinguir mayÃºsculas de minÃºsculas** (RN-CLI-04); no se pide campo de apellido separado (RN-CLI-05)
  - **Alta de cliente**: `submit` de `#form-cliente` con `preventDefault`; `#cliente-mensaje-error` / `#cliente-mensaje-exito`; se limpia el formulario y se actualizan `#tabla-clientes-cuerpo` y el selector `#venta-cliente` sin recargar
  - **Restricciones**: la validaciÃ³n es **declarativa y pedagÃ³gica**, no de seguridad (RN-GL-04); el HTML **no** usa `required`/`pattern`/`min` (la validaciÃ³n es de JS); no se implementa ediciÃ³n ni borrado de registros (no lo pide la consigna)
  - **VerificaciÃ³n**: casos Â«ISBN existente / ISBN nuevoÂ» y Â«email invÃ¡lido / email existente en mayÃºsculas / email nuevoÂ» de `12_casos_manuales.md`
  -   - **Archivos que puede tocar**: `js/app.js` y `index.html` â€” este Ãºltimo **solo** para agregar el atributo `novalidate` en `#form-libro` y `#form-cliente`, de modo que la validaciÃ³n sea Ã­ntegramente de JavaScript (decisiÃ³n D-01, autorizada por el docente el 2026-10-21). `css/` es territorio de C-02 y no se toca
- **Dependencias**: C-03
- **Governance**: MEDIO â€” flujo con estado (alta, error, refresco de listados y selectores) y validaciÃ³n replicada en la interfaz
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` Â§Ejercicio 4 â€” Alta de libros y clientes
  - `knowledge-base/05_reglas_de_negocio.md` Â§Dominio: Alta de libros (RN-LIB-01 â€¦ RN-LIB-10) Â· Â§Dominio: Alta de clientes (RN-CLI-01 â€¦ RN-CLI-06)
  - `knowledge-base/07_flujos_principales.md` Â§Flujo 2 â€” Alta de un libro Â· Â§Flujo 3 â€” Alta de un cliente
  - `knowledge-base/04_modelo_de_datos.md` Â§Libro Â· Â§Cliente
  - `knowledge-base/06_funcionalidades.md` Â§Ã‰pica 4 (US-008, US-009)

---

## FASE 3 â€” Venta simulada e historial (ejercicio 5)

> Rama B del fork del GATE 3. Corre en paralelo lÃ³gico con C-04. Es el change de mayor puntaje pendiente (20 pts).

### [C-05] `ejercicio5-venta-historial`
- **Estado**: `[x]` **completado y verificado** â€” 20 pts. US-010, US-011, US-012. Evidencia: `docs/ejercicio5-implementacion-resumen.md`.
- **Scope**: ComposiciÃ³n de la venta, confirmaciÃ³n con total e historial inmutable
  - **Poblar selectores**: `#venta-cliente` con los clientes disponibles (los de la semilla de C-03 y los registrados por C-04) y `#renglon-libro` con los libros del catÃ¡logo
  - **Agregar renglÃ³n**: `agregarRenglon()` valida que el libro exista y que la cantidad sea un **entero mayor que cero** (RN-VEN-02); ante un **libro repetido** se informa el duplicado o se modifica la cantidad del renglÃ³n existente, **nunca** se crea un segundo renglÃ³n (RN-VEN-03); clona `#plantilla-renglon` y vuelca en `#tabla-renglones-cuerpo`
  - **Columnas del renglÃ³n**: libro, cantidad, precio unitario y subtotal (RN-VEN-05)
  - **CÃ¡lculos**: `subtotal = cantidad Ã— precioUnitario` (RN-VEN-06); `total = Î£ subtotales` (RN-VEN-07); importes con **dos decimales** (RN-VEN-08) en `#venta-total`
  - **EdiciÃ³n previa a confirmar**: cambiar cantidades y quitar renglones con los botones "Modificar renglÃ³n" / "Quitar renglÃ³n" (RN-VEN-04)
  - **ConfirmaciÃ³n**: `confirmarVenta()` **impide** confirmar sin cliente, sin renglones o con cantidades invÃ¡lidas (RN-VEN-09); al confirmar registra **identificador, fecha, cliente, renglones y total** (RN-VEN-10)
  - **Invariante clave**: el `precioUnitario` **se copia** al renglÃ³n como valor histÃ³rico y **no** se vuelve a leer del catÃ¡logo; junto con Ã©l se copian los **datos descriptivos** necesarios para leer la venta (tÃ­tulo, ISBN) (RN-VEN-11, RN-VEN-12) â€” es lo que evalÃºa la comprobaciÃ³n guiada del docente
  - **Post-condiciÃ³n**: la confirmaciÃ³n **limpia el formulario** para una nueva venta y muestra un mensaje de resultado (RN-VEN-14); las ventas confirmadas **no se editan ni se eliminan** desde la interfaz (RN-VEN-13)
  - **Historial**: `renderHistorial()` vuelca en `#tabla-historial-cuerpo` con **identificador, fecha, cliente y total** (RN-HIS-01); `#historial-vacio` cuando no hay ventas; "Ver detalle" renderiza los renglones en `#tabla-detalle-cuerpo` **con el precio unitario histÃ³rico** (RN-HIS-02) y oculta `#historial-detalle-vacio`
  - **VerificaciÃ³n**: venta sin cliente / cantidad 0, negativa o decimal / libro repetido; y la venta de referencia Â«2 unidades a 1500 y 1 a 2000 â†’ subtotales 3000 y 2000, total 5000Â», con el detalle conservado en el historial
  - **Dependencia blanda con C-04**: si C-04 ya estÃ¡ aplicado, el selector de clientes incluye a los registrados; si no, se trabaja con los 3 clientes de la semilla. C-05 **no** implementa el alta de clientes
  - **Archivos que puede tocar**: `js/app.js` â€” y nada mÃ¡s. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-03
- **Governance**: MEDIO â€” mÃ¡quina de estados de la venta (borrador â†’ confirmada) con la invariante de precio histÃ³rico, que es el control que el docente ejecuta en la copia de prueba
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` Â§Ejercicio 5 â€” Venta simulada e historial
  - `knowledge-base/05_reglas_de_negocio.md` Â§Dominio: Ventas (RN-VEN-01 â€¦ RN-VEN-14) Â· Â§Dominio: Historial (RN-HIS-01, RN-HIS-02)
  - `knowledge-base/07_flujos_principales.md` Â§Flujo 4 â€” Venta simulada Â· Â§Flujo 5 â€” Consulta del historial y del detalle
  - `knowledge-base/04_modelo_de_datos.md` Â§Venta Â· Â§RenglÃ³n (invariante de `precioUnitario`)
  - `knowledge-base/06_funcionalidades.md` Â§Ã‰pica 5 (US-010, US-011, US-012)

---

## FASE 4 â€” Persistencia, verificaciÃ³n y documentaciÃ³n (ejercicio 6)

> Cierra el proyecto. Depende de que C-04 y C-05 estÃ©n aplicados, porque el `localStorage` guarda libros, clientes **y** ventas.

### [C-06] `ejercicio6-persistencia-documentacion`
- **Estado**: `[x]` **completado y verificado** â€” 10 pts. US-013, US-014.
- **Scope**: Persistencia con `localStorage`, evidencia de los casos manuales y README de entrega
  - **Clave de almacenamiento**: una clave Ãºnica, versionada y documentada en el README (p. ej. `libreria-el-estante:v1`) que guarda el objeto `{ libros, clientes, ventas }` â€” la Ãºnica "configuraciÃ³n" del proyecto (KB `08_arquitectura_propuesta.md` Â§Variables de entorno)
  - **Carga inicial**: `cargarEstado()` lee `localStorage`; si la clave **no existe** carga la **semilla de C-03** (RN-PER-02); si existe, recupera los registros guardados **sin duplicar** los datos iniciales (RN-PER-03)
  - **Escritura**: `guardarEstado()` persiste libros, clientes y ventas (RN-PER-01) despuÃ©s de cada alta de libro, cada alta de cliente y cada venta confirmada
  - **README.md** (documento de entrega exigido por la consigna):
    - quiÃ©nes realizan el trabajo
    - pasos para **abrir `index.html` en el navegador sin npm**, con la URL `file://` de ejemplo
    - navegaciÃ³n entre las 5 vistas
    - funcionalidades **implementadas y pendientes**
    - **ubicaciÃ³n de los datos iniciales** (la semilla vive en `js/app.js`)
    - funcionamiento y **lÃ­mites** de `localStorage`: depende del navegador, del perfil y de la ubicaciÃ³n de apertura, y **no comparte informaciÃ³n entre usuarios** (RN-PER-04)
    - **resultados observados** de los 8 casos manuales de `12_casos_manuales.md`: *ningÃºn caso se marca aprobado sin ejecutarlo*; si falla o queda pendiente, se registra el comportamiento real
    - **procedencia de imÃ¡genes ajenas**: en este proyecto hay **cero imÃ¡genes**, se declara explÃ­citamente y no se inventa procedencia (KB `10_preguntas_abiertas.md`, IN-03)
    - **comprobaciÃ³n guiada del precio histÃ³rico**: la **ubicaciÃ³n y la estructura del catÃ¡logo guardado** para que el docente reproduzca los 4 pasos de la consigna, y el resultado observado de esa comprobaciÃ³n
  - **Alcance tÃ©cnico de la entrega**: solo `index.html`, `css/`, `js/` y `README.md`; **cero dependencias instaladas, cero herramientas de compilaciÃ³n** (RN-GL-01, RN-GL-03)
  - **VerificaciÃ³n**: recÃ¡lculo del estado tras alta y venta â†’ recargar â†’ recuperar los datos sin duplicar ejemplos ni ventas
  - **Archivos que puede tocar**: `js/app.js` y `README.md` â€” y nada mÃ¡s. `index.html` y `css/` son territorio de C-01 y C-02
- **Dependencias**: C-04, C-05 (y C-03 de forma transitiva)
- **Governance**: MEDIO â€” toca la ruta de escritura de las tres entidades y es la base de la comprobaciÃ³n guiada del precio histÃ³rico que evalÃºa el docente
- **Leer antes**:
  - `knowledge-base/11_criterios_evaluacion.md` Â§Ejercicio 6 â€” Persistencia, verificaciÃ³n y documentaciÃ³n Â· Â§Formato de entrega
  - `knowledge-base/05_reglas_de_negocio.md` Â§Dominio: Persistencia (RN-PER-01 â€¦ RN-PER-04) Â· Â§Excepciones globales (RN-GL-01 â€¦ RN-GL-05)
  - `knowledge-base/12_casos_manuales.md` Â§Casos manuales exigidos por la consigna Â· Â§ComprobaciÃ³n guiada del precio histÃ³rico
  - `knowledge-base/07_flujos_principales.md` Â§Flujo 6 â€” Persistencia entre recargas
  - `knowledge-base/06_funcionalidades.md` Â§Ã‰pica 6 (US-013, US-014)

---

## Resumen de los changes

| Change | Ejercicio | Puntos | Estado | Depende de | Puede tocar | Estado en `openspec/changes/` |
|---|---|---|---|---|---|---|
| C-01 `ejercicio1-estructura-html` | 1 | 20 | `[x]` completado | â€” | `index.html` | Completo (`proposal`+`design`+`tasks`+`spec`); falta archivar |
| C-02 `ejercicio2-estilos-css` | 2 | 20 | `[x]` completado | C-01 | `css/` | Scaffold vacÃ­o: falta `proposal`+`design`+`tasks`+`spec` |
| C-03 `ejercicio3-datos-catalogo-filtro` | 3 | 15 | `[x]` completado | C-01, C-02 | `js/app.js` | Completo (`proposal`+`design`+`tasks`+`spec`); archivado 2026-10-21 |
| C-04 `ejercicio4-altas-libros-clientes` | 4 | 15 | `[x]` completado | C-03 | `js/app.js`, `index.html` | Completo (`proposal`+`design`+`tasks`+`spec`); archivado 2026-10-22 |
| C-05 `ejercicio5-venta-historial` | 5 | 20 | `[ ]` pendiente | C-03 | `js/app.js` | Scaffold vacÃ­o: falta `proposal`+`design`+`tasks`+`spec` |
| C-06 `ejercicio6-persistencia-documentacion` | 6 | 10 | `[ ]` pendiente | C-04, C-05 | `js/app.js`, `README.md` | Scaffold vacÃ­o: falta `proposal`+`design`+`tasks`+`spec` |
| **Total** | | **100** | 55 pts entregados Â· 45 pts pendientes | | | |

> Los 6 scaffolds de change ya existen (creados el 2026-10-21 con `openspec new change <nombre>`). Este roadmap **no los modifica**: los documentos `proposal.md`, `design.md` y `tasks.md` de los changes 2 a 6 se redactan en la fase `propose` de cada uno, y cada `tasks.md` **debe declarar los archivos que puede tocar** (Â§Reparto de propiedad de archivos).

**Primer change recomendado:** `C-04` (`ejercicio4-altas-libros-clientes`) y `C-05` (`ejercicio5-venta-historial`) â€” ambos habilitados tras C-03 âœ“. Paralelismo lÃ³gico (ambos escriben `js/app.js`; merge serializa C-04 â†’ C-05).

**Ãšltimo paso de la secuencia:** `C-06` (`ejercicio6-persistencia-documentacion`) â€” cierra la persistencia, la evidencia de los casos manuales y el README de entrega.
