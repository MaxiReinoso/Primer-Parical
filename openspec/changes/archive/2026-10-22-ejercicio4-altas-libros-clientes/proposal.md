# Propuesta: C-04 ejercicio4-altas-libros-clientes

> **Ejercicio**: 4 — *Alta de libros y clientes* (15 puntos) · US-008, US-009
> **Change**: `ejercicio4-altas-libros-clientes` · assignee: Benjamin Arollo
> **Rama**: `parte-4` (base `main` @ `53aeb7d "Ejercicio 3"`)
> **Especificación**: aprobada por el docente el 2026-10-21 con cuatro ajustes (ver `design.md` §Decisiones)

## Why

El punto 4 de la consigna (15 puntos) exige registrar **libros y clientes** desde formularios, con
validación en el cliente y actualización de listados y selectores **sin recargar la página**.

Hoy el HTML y el CSS de esos formularios ya existen y están verificados (C-01 y C-02, 40 de los 100
puntos) y los datos semilla y los getters de relación ya existen (C-03, archivado), pero **no hay
ninguna lógica de alta**: los selectores de editorial, género y autores están vacíos, las tablas de
libros y de clientes nunca se renderizan, y no hay validación ni manejo del evento `submit`.

Sin este change, el punto 4 del parcial no se puede entregar: los formularios no registran nada.

## What Changes

- **Alta de libros (6 pts)**: se pueblan `#libro-editorial`, `#libro-genero` y `#libro-autores` desde
  los datos locales; se validan título, ISBN, precio, editorial, género y autores (RN-LIB-01…10); el
  libro se agrega a `libros` con `id` estable y único.
- **Alta de clientes (4 pts)**: se validan nombre completo y email, incluida la unicidad del email
  comparada sin espacios exteriores y sin distinguir mayúsculas (RN-CLI-01…04); el cliente se agrega a
  `clientes` con `id` estable y único.
- **Validación y actualización de la interfaz (5 pts)**: ambos envíos se controlan con
  `preventDefault()`; los errores se muestran en texto comprensible **junto al formulario**; el alta
  correcta informa el resultado, limpia el formulario y actualiza el listado, el catálogo y los
  selectores relacionados **sin recargar la página**.
- **Render de los listados**: `renderLibros()` y `renderClientes()` vuelcan `#tabla-libros-cuerpo` y
  `#tabla-clientes-cuerpo`, que hoy están vacías, con las columnas que el `<thead>` ya define.
- **Cambio de alcance declarado — `index.html`**: se agrega el atributo `novalidate` a `#form-libro` y
  `#form-cliente` para que **toda** la validación sea JavaScript y los errores aparezcan junto al
  formulario. Es la **única** modificación de `index.html` posterior a C-01, y está **autorizada
  explícitamente por el docente** (ver §Impact y `design.md` D-01).
- **Gobernanza**: se actualiza la fila de C-04 en `CHANGES.md` (§Reparto de propiedad de archivos) para
  que declare `index.html`, y se corrige la frase desactualizada de
  `knowledge-base/07_flujos_principales.md` que pedía "el conjunto de datos" (ya entregado por C-03).

## Capabilities

### New Capabilities

- `altas-libros-clientes` — Registro de libros y de clientes desde los formularios de las vistas
  *Libros* y *Clientes*: selectores generados a partir de los datos locales, validaciones de dominio,
  mensajes de error y de éxito junto al formulario, y actualización de listados y selectores
  relacionados sin recargar la página.

### Modified Capabilities

Ninguna. La capacidad `catalogo-filtro` (C-03) **no cambia de requisitos**: este change la consume
(`filtrarLibros`, `renderCatalogo`, los getters y la forma de los arrays) sin alterarla. La única
interacción observable es que, tras un alta de libro, el catálogo se vuelve a renderizar **respetando
el filtro activo**, de modo que el libro recién creado puede no aparecer en los resultados hasta que la
búsqueda coincida o se borre.

## Impact

### Archivos que este change puede tocar

| Archivo | Acción | Nota |
|---------|--------|------|
| `js/app.js` | Modifica | Único archivo de producto con la lógica del punto 4 |
| `index.html` | Modifica (2 atributos) | `novalidate` en `#form-libro` y `#form-cliente`. **Excepción explícita a DD-01**, autorizada por el docente el 2026-10-21 y declarada aquí |
| `CHANGES.md` | Modifica (1 fila) | Declara `index.html` en la propiedad de archivos de C-04 (§Reparto) |
| `knowledge-base/07_flujos_principales.md` | Modifica (1 frase) | Corrige la frase desactualizada que pedía "el conjunto de datos" |
| `css/` | **No toca** | `.mensaje--exito`, `.mensaje--error`, `.mensaje[hidden]`, `.tabla`, `.campo__control` y `select[multiple]` ya resuelven la presentación |
| `openspec/specs/altas-libros-clientes/spec.md` | Crea | Spec consolidada, al archivar el change |

> La excepción a DD-01 cumple la condición que la propia regla impone: *"NUNCA modificar `index.html`
> ni `css/` salvo que el change lo declare explícitamente"* (regla dura 12) y la guía de `apply` del
> repo: *"No toques `index.html` ni `css/` salvo que el change lo declare"*. Aquí el change lo declara.

### Contrato con los demás changes

| Change | Relación |
|--------|----------|
| C-01 `ejercicio1-estructura-html` | **Consume** sus ids, formularios, tablas y mensajes. Excepción puntual declarada arriba: agrega `novalidate` a 2 formularios, sin alterar estructura, campos, nombres ni relaciones |
| C-02 `ejercicio2-estilos-css` | **Consume** sus clases. No se toca `css/` |
| C-03 `ejercicio3-datos-catalogo-filtro` | **Consume** `editoriales`, `generos`, `autores`, `libros`, `clientes`, los getters y `filtrarLibros`/`renderCatalogo`. No se altera ninguna función existente: solo se agregan funciones nuevas y un listener nuevo de `DOMContentLoaded` |
| C-05 `ejercicio5-venta-historial` | **Compartido**: C-04 escribe el helper que puebla `#venta-cliente` y `#renglon-libro` (lo que CHANGES.md asigna a C-04) para que C-05 lo reutilice. C-04 **no** implementa renglones, total ni historial |
| C-06 `ejercicio6-persistencia-documentacion` | **Consume** los `id` generados: el esquema `lib-N` / `cli-N` calculado sobre el array actual sigue siendo único y estable cuando C-06 agregue `localStorage` |

### Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Romper el catálogo ya verificado (20 + 15 pts entregados) | No se modifica ninguna función existente de C-03; control de regresión con los controles de `docs/ejercicio3-implementacion-resumen.md` |
| Inserción de HTML interpretable en los listados | Solo `textContent` / `createTextNode` (RN-CAT-08) |
| Solapamiento de escritura en `js/app.js` con C-05 y C-06 | El merge se serializa **C-03 → C-04 → C-05 → C-06** (regla del repo) |
| Que `index.html` quede como único punto de conflicto con C-01 | Cambio de 2 atributos, declarado en `proposal.md`, `design.md` y `tasks.md`; sin cambios de estructura |

## Fuera de alcance (lo que NO entra)

- Ventas, renglones, total, confirmación e historial (Ejercicio 5).
- Persistencia con `localStorage` y `README.md` de entrega (Ejercicio 6).
- Edición y eliminación de registros: la consigna dice *"No se exige editar ni eliminar registros"*.
- Alta, baja o modificación de **editorial, género o autor**: la consigna excluye administrar esas
  entidades.
- Modificaciones en `css/`, cambios de diseño y refactors generales.
- Frameworks, librerías, CDNs, APIs, bases de datos o backend.

## Reglas de negocio cubiertas

- **RN-LIB-01** a **RN-LIB-10** (título e ISBN no vacíos, ISBN único sin espacios ni guiones, precio
  numérico mayor que cero, editorial existente, al menos un autor existente, género opcional pero
  existente, «Sin clasificar» como ausencia de género, opciones generadas desde los datos locales, sin
  dígito de control).
- **RN-CLI-01** a **RN-CLI-06** (nombre y email no vacíos, formato de email válido, unicidad sin
  distinguir mayúsculas ni espacios exteriores, sin campo de apellido, errores cerca del formulario).
- **RN-CAT-08** y **RN-PRE-06** (datos insertados como texto; errores expresados en texto).
- **RN-GL-01**, **RN-GL-02**, **RN-GL-03** (solo HTML/CSS/JS nativo, cero URLs externas, abre con
  `file://`).

## Criterios de aceptación

El detalle completo, con el método de comprobación de cada uno, está en
`specs/altas-libros-clientes/spec.md` (escenarios) y en `tasks.md` (comprobaciones). Resumen:

| CA | Verificación |
|----|--------------|
| CA-01 | Se validan el título y la unicidad del ISBN **normalizado** (sin espacios ni guiones) |
| CA-02 | Se validan el precio y la existencia de editorial, autores y género cuando corresponda |
| CA-03 | Se exige al menos un autor |
| CA-04 | Se validan el nombre completo y el formato del email |
| CA-05 | Se rechazan emails duplicados sin distinguir mayúsculas ni espacios exteriores |
| CA-06 | Los errores impiden agregar registros inválidos |
| CA-07 | Los registros válidos actualizan listados y selectores relacionados sin recargar |
| CA-08 | Los datos se insertan como texto y se respetan las tecnologías permitidas |
| CA-09 | Se conserva la estructura existente y no se implementan funcionalidades excluidas |

## Evidencia de verificación requerida

Los **2 casos manuales del Ejercicio 4** de `knowledge-base/12_casos_manuales.md`:

1. Alta de libro con ISBN existente y luego con ISBN nuevo → el duplicado se rechaza; el válido aparece
   en catálogo y selección de venta.
2. Alta de cliente con email inválido, email existente en mayúsculas y email nuevo → se rechazan los dos
   primeros; el nuevo aparece en listado y selección.

Y el registro de la evidencia control por control en `docs/ejercicio4-implementacion-resumen.md`, con
estado {aprobado, fallido, omitido, pendiente} y motivo.

## Dependencias

- C-01 `ejercicio1-estructura-html` ✔ — el HTML ya tiene `#form-libro`, `#form-cliente`, sus seis campos,
  los dos pares de mensajes, las dos tablas y los selectores de ventas.
- C-02 `ejercicio2-estilos-css` ✔ — el CSS ya tiene las clases de formulario, mensaje y tabla.
- C-03 `ejercicio3-datos-catalogo-filtro` ✔ — ya están los arrays, los getters, el filtro y el render del
  catálogo.

## Próximo paso

`design.md` con las decisiones y sus alternativas, y `tasks.md` con el checklist de implementación
declarando los archivos que este change puede tocar.