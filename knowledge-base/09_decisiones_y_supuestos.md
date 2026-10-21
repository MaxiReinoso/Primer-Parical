# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — SPA de una página con 5 secciones
**Decisión**: un único `index.html` con las 5 vistas como `<section class="vista">` y el `<nav>` con enlaces-ancla `href="#id"`.
**Contexto**: la consigna permite "varias páginas o secciones de una misma página". El Ejercicio 1 tenía que fijar una y el Ejercicio 2 se apoyó en ella.
**Alternativas consideradas**: (a) multipágina con 5 `.html`; (b) SPA con secciones.
**Justificación**: los enlaces-ancla funcionan **sin JavaScript**, el `index.html` queda aprobado y congelado, y las actualizaciones tras un alta ocurren en la misma vista que el formulario que las dispara. La multipágina obligaría a duplicar encabezado y navegación, y a resolver el paso de datos entre archivos.
**Trade-offs aceptados**: las 5 vistas quedan apiladas y visibles a la vez; el mostrado exclusivo de una vista requiere CSS `:target` o JS, y se resolvió **no** hacerlo (ver DD-04).

### DD-02 — Identidad visual cálida con paleta tierra
**Decisión**: paleta crema/terracota con tokens de 38 `custom properties` en `:root`.
**Contexto**: la consigna pide "una identidad visual propia y coherente" sin fijar una paleta.
**Alternativas consideradas**: (a) paleta neutra de grises; (b) paleta cálida con acento terracota; (c) modo oscuro.
**Justificación**: una paleta cálida con contraste medido da personalidad sin perder legibilidad, y **todos** los pares en uso cumplen WCAG AA. El modo oscuro queda fuera de alcance.
**Trade-offs aceptados**: el mapeo de uso de la paleta es sutil: dos pares de la paleta **no** alcanzan el umbral si se usan en el lugar habitual (ver DD-05 y DD-06), y se resolvió el uso, no los colores.

### DD-03 — CSS modular en tres capas con `@import`
**Decisión**: `styles.css` es el punto de entrada e importa `base.css`, `layout.css` y `componentes.css`.
**Contexto**: el criterio de evaluación del ejercicio habla de "estilos estructurados en archivos externos (**base, layout, componentes**)", y la consigna pide "el CSS se mantiene en archivos externos" y una entrega con "carpetas de CSS".
**Alternativas consideradas**: (a) un único `styles.css` con las capas como secciones; (b) 3 `<link>` en `index.html`; (c) `@import` desde el punto de entrada.
**Justificación**: (c) cumple las tres condiciones a la vez: entrega las tres capas como archivos, **no modifica `index.html`** (que está aprobado y congelado) y mantiene un único `<link>`. La equivalencia se verificó a nivel de reglas (68 ↔ 68, mismas condiciones de `@media`) y de render (idéntico a 320, 768 y 1280 px).
**Trade-offs aceptados**: `@import` encadena las peticiones en serie, lo que es irrelevante a esta escala pero no es el patrón ideal en un proyecto grande; y las hojas importadas no aparecen como entradas de primer nivel de `document.styleSheets`.

### DD-04 — Las 5 vistas se muestran apiladas (Opción A)
**Decisión**: todas las vistas visibles en el flujo normal, cada una como panel de superficie; no hay conmutador de vista.
**Contexto**: la SPEC del Ejercicio 1 dejó la decisión explícitamente para el Ejercicio 2 ("el mostrado exclusivo de una vista requiere CSS `:target`/clases (Ej. 2) o JS (Ej. 3)"). El usuario resolvió: Opción A.
**Alternativas consideradas**: (a) apiladas; (b) exclusivas con `:target`.
**Justificación**: la opción B obliga a garantizar que el ancla de la URL coincida con la vista visible (si no, la página queda en blanco) y agrega complejidad de estado. La A no depende de JS y no tiene ese modo de fallo.
**Trade-offs aceptados**: no se marca la vista activa en la navegación (ver DD-08) y el scroll vertical recorre las 5 vistas.

### DD-05 — El texto de los enlaces nunca se apoya sobre `--color-acento-suave`
**Decisión**: el hover/foco de `.nav-enlace` usa `--color-superficie-alt`; `--color-acento-suave` se usa solo como fondo.
**Contexto**: `--color-acento` (#a8452b) sobre `--color-acento-suave` (#f0dcd2) da **4,47:1**, por debajo del 4,5:1 de WCAG AA para texto normal.
**Alternativas consideradas**: (a) cambiar la paleta; (b) cambiar el mapeo de uso.
**Justificación**: la consigna evalúa "contraste de colores AA verificado". Cambiar la paleta alteraría la identidad visual ya resuelta; el mapeo de uso no. Sobre `--color-superficie-alt` el acento da **4,78:1** ✔.
**Trade-offs aceptados**: ninguno funcional; el hover de los enlaces no usa el tinte terracota.

### DD-06 — El borde de los controles usa `--color-texto-suave`
**Decisión**: el borde de `.campo__control` y de los botones secundarios usa `--color-texto-suave` (#5f5349); `--color-borde` y `--color-borde-fuerte` quedan como separadores decorativos.
**Contexto**: `--color-borde-fuerte` (#b9a98d) sobre `--color-superficie` da **2,26:1**, por debajo del 3:1 que WCAG 1.4.11 exige para el borde que identifica un control.
**Alternativas consideradas**: (a) cambiar la paleta; (b) usar `--color-borde-fuerte`; (c) usar `--color-texto-suave`.
**Justificación**: (c) da **7,33:1** ✔ y cumple la identificación del control. (b) es un borde decorativo, no identifica nada.
**Trade-offs aceptados**: el borde de los campos es más oscuro que el resto de la paleta; se compensa con `--radio-2` y con la etiqueta explícita de cada campo.

### DD-07 — El `thead` no lleva `position: sticky`
**Decisión**: los encabezados de tabla no se fijan.
**Contexto**: `.tabla-contenedor` no tiene `max-block-size`, así que no hay scroll vertical y el `sticky` sería un efecto nulo. Además, con `border-collapse: collapse` el filete colapsado no acompaña al `th` en Chrome.
**Alternativas consideradas**: (a) sin `sticky`; (b) acotar la altura del contenedor y usar `sticky`.
**Justificación**: (a) es más simple y no introduce un segundo eje de scroll. (b) solo tiene sentido cuando haya muchas filas, y ese volumen llega en el Ejercicio 5.
**Trade-offs aceptados**: con muchas ventas, el encabezado de tabla no queda visible al hacer scroll vertical.

### DD-08 — No se marca la vista activa en la navegación
**Decisión**: los enlaces del `<nav>` no se resaltan según la vista actual.
**Contexto**: marcarlo en CSS puro exige `body:has(#catalogo:target) .nav-enlace[href="#catalogo"]`, o sea **selectores por `id` usados para estilo**, lo que contradice el criterio "no hay selectores por `id` usados para estilo".
**Alternativas consideradas**: (a) usar `:has()` con ids; (b) no marcarlo en CSS; (c) marcarlo con JS.
**Justificación**: (b) respeta el criterio. (c) es válido y es la opción del Ejercicio 3, donde el JS ya existe.
**Trade-offs aceptados**: el usuario no ve resaltada la vista en la que está.

### DD-09 — Los contenedores de tabla son parte del recorrido de teclado
**Decisión**: `.tabla-contenedor` conserva `tabindex="0"` y su anillo de foco va hacia adentro (`outline-offset: -3px`).
**Contexto**: con `overflow-x: auto`, una tabla ancha que solo se puede desplazar con el mouse deja fuera de alcance a quien navega con teclado.
**Alternativas consideradas**: (a) sacar el `tabindex`; (b) mantenerlo con anillo hacia adentro.
**Justificación**: (b) mantiene la tabla desplazable con teclado, que es el requisito de "se recorren con el teclado" aplicado a un componente con scroll propio. El anillo hacia adentro evita que se solape con el contenido circundante.
**Trade-offs aceptados**: suma 5 paradas al recorrido de foco (26 en total).

### DD-10 — Verificación en tres capas, sin framework de tests
**Decisión**: controles automatizables de solo lectura + comprobación real en navegador + registro de evidencia; sin framework de tests.
**Contexto**: el proyecto no tiene `package.json`, `pytest.ini` ni runner alguno, y la consigna no los pide: pide "casos manuales reproducibles" registrados en el README.
**Alternativas consideradas**: (a) sumar un framework de tests; (b) la política de tres capas.
**Justificación**: (b) respeta la consigna y la restricción de cero dependencias. Los scripts de verificación viven en la carpeta temporal del sistema: **el proyecto no incluye herramientas**.
**Trade-offs aceptados**: no hay regresión automática en CI; la cobertura depende de re-ejecutar los controles a mano.

### DD-11 — La spec de cada change vive en OpenSpec; `docs/` queda con el resumen de implementación
**Decisión**: la especificación de cada ejercicio se escribe **una sola vez**, en el change de OpenSpec (`openspec/changes/<change>/` con proposal, delta spec, design y tasks). En `docs/` se escribe **únicamente** `docs/ejercicioN-implementacion-resumen.md`, con la evidencia de la verificación.
**Contexto**: hasta el ejercicio 2 la convención fue `docs/ejercicioN-{spec,plan,implementacion-resumen}.md`, porque OpenSpec todavía no existía. Al adoptarlo, mantener las dos convenciones obligaba a escribir el mismo spec dos veces.
**Alternativas consideradas**: (a) las dos (spec en `docs/` y en OpenSpec); (b) solo OpenSpec; (c) solo `docs/`.
**Justificación**: (b) elimina la duplicación sin perder nada: el ciclo de OpenSpec **obliga a escribir el spec antes de codificar**, y el `tasks.md` cumple el papel de plan de trabajo. La evidencia de la verificación —que es lo que el docente lee— queda en el resumen de `docs/`, que además es donde se registra el estado por control. (c) se descartó porque no da machine-readable ni permite el flujo propose/apply/archive.
**Trade-offs aceptados**: los ejercicios 1 y 2 se implementaron antes de que existiera el ciclo, así que sus spec y plan se **reubicaron** dentro del change archivado que los produjo (`openspec/changes/archive/<change>/notas/`) en lugar de reescribirse: se conserva el detalle sin duplicar la fuente de verdad. Queda una única convención para los 6 ejercicios.

## Supuestos inferidos

### SU-01 — El parcial se evalúa por ejercicio, no de forma integrada
**Supuesto**: cada ejercicio se califica por separado y el producto final se arma con la suma.
**Origen**: la consigna reparte 100 puntos en 6 ejercicios con criterios independientes.
**Riesgo si es falso**: un cambio de un ejercicio que rompa otro podría no detectarse hasta la corrección.
**Cómo validar**: los criterios de cada ejercicio se verifican por separado; el cruce entre ejercicios se revisa en la evaluación.

### SU-02 — `index.html` y `js/app.js` son territorio de un solo ejercicio a la vez
**Supuesto**: los ejercicios 3–6 tocan `js/app.js` y no el HTML ni el CSS; el Ejercicio 1 es el dueño del HTML y el 2 el del CSS.
**Origen**: separación de responsabilidades de la consigna + el hecho de que el Ejercicio 1 ya entregó el HTML aprobado.
**Riesgo si es falso**: dos personas tocando `js/app.js` en paralelo generarían conflictos.
**Cómo validar**: el reparto de cambios del equipo; si alguien necesita tocar el HTML, se documenta como ajuste.

### SU-03 — La KB documenta el proyecto tal como está, no como se proyecta
**Supuesto**: la base de conocimiento describe la consigna y lo implementado, y los ejercicios pendientes aparecen como *pendientes*, no como functionality existente.
**Origen**: el modo *ingest* de `kb-creator` (la KB se genera desde los documentos existentes).
**Riesgo si es falso**: si la KB se leyera como documentación de producto final, daría por hechas funcionalidades que aún no existen.
**Cómo validar**: cada flujo de `07_flujos_principales.md` declara su **estado actual**; los ejercicios 3–6 están marcados como pendientes.

### SU-04 — El segundo motor de renderizado no se instala
**Supuesto**: la verificación de CSS se hace en un único navegador (Edge headless) y el resto se declara OMITIDO con su motivo.
**Origen**: no hay un segundo motor instalado y la consigna no exige verificar en más de uno.
**Riesgo si es falso**: podrían existir diferencias de render entre motores.
**Cómo validar**: instalar un segundo motor (hay `winget` y `choco` disponibles) y repetir las mediciones de §2.3 del resumen del Ejercicio 2.

### SU-05 — Los compañeros ejecutan la fase `apply` de su change sin tocar el `index.html` aprobado
**Supuesto**: cada persona toma su change de OpenSpec y ejecuta el `apply` siguiendo su `tasks.md`.
**Origen**: el flujo OPSX (propose → apply → archive) y la separación de responsabilidades por ejercicio.
**Riesgo si es falso**: si dos changes requieren el mismo archivo, aparece un conflicto de merge.
**Cómo validar**: el `tasks.md` de cada change declara explícitamente los archivos que puede tocar.
