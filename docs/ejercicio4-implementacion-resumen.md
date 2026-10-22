# Resumen de Implementación — Ejercicio 4: Alta de libros y clientes

> Change: `ejercicio4-altas-libros-clientes` (C-04) · assignee: Benjamin Arollo
> Fecha: 2026-10-22
> Rama: `parte-4` (base `main` @ `53aeb7d`) — **sin commits**
> Archivos de producto modificados: `js/app.js` (lógica del punto 4) y `index.html` (**2 atributos** `novalidate`, excepción declarada a DD-01 y autorizada por el docente el 2026-10-21)
> Archivos de gobernanza modificados: `CHANGES.md`, `knowledge-base/07_flujos_principales.md`
> Artefactos del change: `openspec/changes/ejercicio4-altas-libros-clientes/` (proposal, delta spec, design, tasks)

---

## 1. Resumen de la verificación

- **96 controles ejecutados en navegador real** (Edge headless, vía Chrome DevTools Protocol, ile://): **96 APROBADOS, 0 FALLIDOS**.
- **13 controles estáticos y de archivo**: APROBADOS (sección 1.2).
- **Consola del navegador**: sin errores ni warnings.
- **Segundo motor de render**: **OMITIDO** — no hay un segundo motor instalado en la máquina (pregunta abierta de prioridad Alta en `knowledge-base/10_preguntas_abiertas.md`; el motivo queda registrado como en los ejercicios anteriores).
- Ningún control se declara aprobado sin haber sido ejecutado.

### 1.1 Controles en navegador real

| Control | Qué comprueba | Estado | Evidencia |
|---|---|---|---|
| **3.1** | Editoriales en el selector | APROBADO | esperado=2 / real=2 |
| **3.2** | Generos: Sin clasificar primero | APROBADO | esperado=3//Sin clasificar/gen-1 / real=3//Sin clasificar/gen-1 |
| **3.3** | Autores en selector multiple | APROBADO | esperado=3/true / real=3/true |
| **3.4** | Selectores de ventas poblados | APROBADO | esperado=3/6 / real=3/6 |
| **4.1** | Tabla de libros inicial | APROBADO | esperado=6 / real=6 |
| **4.1b** | Tabla de clientes inicial | APROBADO | esperado=3 / real=3 |
| **4.2a** | Bestiario muestra Sin clasificar | APROBADO | esperado=Sin clasificar / real=Sin clasificar |
| **4.2b** | Autores multiples en la tabla | APROBADO | esperado=Gabriel García Márquez, Julio Cortázar / real=Gabriel García Márquez, Julio Cortázar |
| **4.2c** | Precio formateado ARS | APROBADO | esperado=$ 2.500,00 / real=$ 2.500,00 |
| **7.9a** | Regresion: busqueda CIEN | APROBADO | esperado=1 / real=1 |
| **7.9b** | Regresion: catalogo completo | APROBADO | esperado=6 / real=6 |
| **7.9c** | Regresion: sin resultados | APROBADO | esperado=true / real=true |
| **7.1a** | CA-01 titulo vacio: se rechaza | APROBADO | esperado=6 / real=6 |
| **7.1b** | CA-01 titulo vacio: error visible | APROBADO | esperado=true / real=true |
| **7.1c** | CA-01 foco en el campo con error | APROBADO | esperado=libro-titulo / real=libro-titulo |
| **7.1d** | CA-01 ISBN vacio: se rechaza | APROBADO | esperado=6 / real=6 |
| **7.1e** | CA-01 ISBN vacio: foco | APROBADO | esperado=libro-isbn / real=libro-isbn |
| **7.1f** | CA-01 ISBN duplicado con guiones: se rechaza | APROBADO | esperado=6 / real=6 |
| **7.1g** | CA-01 ISBN duplicado: mensaje con el motivo | APROBADO | esperado=El ISBN 978-0307474728 ya está registrado. / real=El ISBN 978-0307474728 ya está registrado. |
| **7.1h** | CA-01 ISBN duplicado sin guiones: se rechaza | APROBADO | esperado=6 / real=6 |
| **7.1i** | CA-01 ISBN nuevo: se acepta | APROBADO | esperado=7 / real=7 |
| **7.1j** | CA-01 ISBN nuevo: exito visible | APROBADO | esperado=true / real=true |
| **7.1k** | CA-01 ISBN nuevo: error oculto | APROBADO | esperado=false / real=false |
| **7.2a** | CA-02 precio vacio: se rechaza | APROBADO | esperado=7 / real=7 |
| **7.2b** | CA-02 precio vacio: foco | APROBADO | esperado=libro-precio / real=libro-precio |
| **7.2c** | CA-02 precio cero: se rechaza | APROBADO | esperado=7 / real=7 |
| **7.2d** | CA-02 precio negativo: se rechaza | APROBADO | esperado=7 / real=7 |
| **7.2e** | D-10 precio 10.555: se acepta | APROBADO | esperado=8 / real=8 |
| **7.2f** | D-10 el precio queda ALMACENADO sin redondear | APROBADO | esperado=10.555 / real=10.555 |
| **7.2f-2** | D-10 el precio se muestra formateado a 2 decimales (como el resto de la app) | APROBADO | esperado=$ 10,56 / real=$ 10,56 |
| **7.2f-bis** | D-10 la validacion NO redondea: validarLibro con precio 10.555 | APROBADO | esperado=true / real=true |
| **7.2f-ter** | D-10 el control number conserva 10.555 sin normalizar | APROBADO | esperado=10.555 / real=10.555 |
| **7.2f-cua** | D-10 un precio de 1 decimal (10.5) se conserva | APROBADO | esperado=10.5 / real=10.5 |
| **7.2g** | CA-02 Sin clasificar: el libro se registra sin genero | APROBADO | esperado=Sin clasificar / real=Sin clasificar |
| **7.3a** | CA-03 sin autores: se rechaza | APROBADO | esperado=9 / real=9 |
| **7.3b** | CA-03 sin autores: foco | APROBADO | esperado=libro-autores / real=libro-autores |
| **7.3c** | CA-03 un autor: se acepta | APROBADO | esperado=10 / real=10 |
| **7.3d** | CA-03 un autor: autor en la tabla | APROBADO | esperado=Jorge Luis Borges / real=Jorge Luis Borges |
| **7.3e** | CA-03 dos autores: se acepta | APROBADO | esperado=11 / real=11 |
| **7.3f** | CA-03 dos autores: ambos en la tabla | APROBADO | esperado=Gabriel García Márquez, Julio Cortázar / real=Gabriel García Márquez, Julio Cortázar |
| **7.4a** | CA-04 nombre vacio: se rechaza | APROBADO | esperado=3 / real=3 |
| **7.4b** | CA-04 nombre vacio: foco | APROBADO | esperado=cliente-nombre / real=cliente-nombre |
| **7.4c** | CA-04 email vacio: se rechaza | APROBADO | esperado=3 / real=3 |
| **7.4d** | CA-04 email vacio: foco | APROBADO | esperado=cliente-email / real=cliente-email |
| **7.4e** | CA-04 email invalido: se rechaza | APROBADO | esperado=3 / real=3 |
| **7.4f** | CA-04 email invalido: mensaje propio visible | APROBADO | esperado=true / real=true |
| **7.4g** | CA-04 email invalido: motivo en el mensaje | APROBADO | esperado=El email no tiene un formato válido. / real=El email no tiene un formato válido. |
| **7.4h** | CA-04 email a@b: se rechaza | APROBADO | esperado=3 / real=3 |
| **7.5a** | CA-05 duplicado en mayusculas: se rechaza | APROBADO | esperado=3 / real=3 |
| **7.5b** | CA-05 duplicado con espacios: se rechaza | APROBADO | esperado=3 / real=3 |
| **7.5c** | CA-05 email nuevo: se acepta | APROBADO | esperado=4 / real=4 |
| **7.5d** | CA-05 email nuevo: exito visible | APROBADO | esperado=true / real=true |
| **7.5e** | CA-05 email nuevo: error oculto | APROBADO | esperado=false / real=false |
| **7.5f** | CA-05 alta de cliente: aparece en el listado | APROBADO | esperado=4 / real=4 |
| **7.6a** | CA-06 el array de libros no crecio con los rechazos | APROBADO | esperado=11 / real=11 |
| **7.6b** | CA-06 el array de clientes no crecio con los rechazos | APROBADO | esperado=4 / real=4 |
| **7.6c** | CA-06 sin filas extra tras los rechazos | APROBADO | esperado=11/4 / real=11/4 |
| **7.7a** | CA-07 la pagina no se recargo (marcador intacto) | APROBADO | esperado=42 / real=42 |
| **7.7b** | CA-07 el libro aparece en el listado | APROBADO | esperado=12 / real=12 |
| **7.7c** | CA-07 el libro aparece en el catalogo | APROBADO | esperado=12 / real=12 |
| **7.7d** | CA-07 el libro aparece en el selector de la venta | APROBADO | esperado=12 / real=12 |
| **7.7e** | CA-07 el cliente aparece en el selector de ventas | APROBADO | esperado=4 / real=4 |
| **7.7f** | CA-07 el formulario quedo limpio | APROBADO | esperado=// / real=// |
| **7.7g** | CA-07 el genero volvio a Sin clasificar | APROBADO | esperado= / real= |
| **7.7h** | CA-07 los autores se limpiaron | APROBADO | esperado=0 / real=0 |
| **7.7i** | CA-07 exito visible y error oculto | APROBADO | esperado=true/false / real=true/false |
| **7.8a** | CA-08 el marcado se inserta como texto literal | APROBADO | esperado=<img src=x onerror=window.__xss=1> / real=<img src=x onerror=window.__xss=1> |
| **7.8b** | CA-08 no se ejecuto ningun marcado | APROBADO | esperado=undefined / real=undefined |
| **7.10a** | 7.10 el libro se registro igual | APROBADO | esperado=14 / real=14 |
| **7.10b** | 7.10 aparece en el listado de libros | APROBADO | esperado=14 / real=14 |
| **7.10c** | 7.10 NO aparece en el catalogo filtrado | APROBADO | esperado=0 / real=0 |
| **7.10d** | 7.10 el mensaje de sin resultados sigue visible | APROBADO | esperado=true / real=true |
| **7.10e** | 7.10 el libro si aparece en el selector de la venta | APROBADO | esperado=14 / real=14 |
| **7.10f** | 7.10 al borrar la busqueda aparece en el catalogo | APROBADO | esperado=14 / real=14 |
| **7.11a** | 7.11 el helper preserva la seleccion del cliente | APROBADO | esperado=cli-2 / real=cli-2 |
| **7.11b** | 7.11 el cliente nuevo igual esta en el selector | APROBADO | esperado=5 / real=5 |
| **D-01** | Premisa D-01: sin novalidate el navegador bloquea el submit (0 envios) | APROBADO | envios=0 |
| **D-01b** | D-01: con novalidate el submit se procesa y el mensaje propio se muestra | APROBADO | error oculto=false |
| **2.1** | normalizarIsbn quita espacios y guiones | APROBADO | esperado=9780307474728 / real=9780307474728 |
| **2.1b** | normalizarIsbn es idempotente con guiones | APROBADO | esperado=9780307474728 / real=9780307474728 |
| **2.2** | isbnExists detecta el ISBN de lib-1 con guiones | APROBADO | esperado=true / real=true |
| **2.2b** | isbnExists da falso para un ISBN nuevo | APROBADO | esperado=false / real=false |
| **2.3** | normalizarEmail recorta y pasa a minusculas | APROBADO | esperado=ana.lopez@email.com / real=ana.lopez@email.com |
| **2.4** | emailExists detecta el email de cli-1 en mayusculas | APROBADO | esperado=true / real=true |
| **2.5** | emailValido acepta un email correcto | APROBADO | esperado=true / real=true |
| **2.5b** | emailValido rechaza abc | APROBADO | esperado=false / real=false |
| **2.5c** | emailValido rechaza a@b | APROBADO | esperado=false / real=false |
| **2.6** | generarIdLibro sigue la semilla | APROBADO | esperado=lib-7 / real=lib-7 |
| **2.6b** | generarIdCliente sigue la semilla | APROBADO | esperado=cli-4 / real=cli-4 |
| **5.1** | validarLibro devuelve ok y errores | APROBADO | esperado=false/1/libro-titulo / real=false/1/libro-titulo |
| **5.1b** | validarLibro acepta datos validos | APROBADO | esperado=true/0 / real=true/0 |
| **5.1c** | validarLibro detecta genero inexistente | APROBADO | esperado=libro-genero / real=libro-genero |
| **5.1d** | validarLibro detecta autor inexistente | APROBADO | esperado=libro-autores / real=libro-autores |
| **5.1e** | validarLibro detecta editorial inexistente | APROBADO | esperado=libro-editorial / real=libro-editorial |
| **5.3** | validarCliente devuelve ok y errores | APROBADO | esperado=false/1/cliente-email / real=false/1/cliente-email |
| **5.3b** | validarCliente acepta datos validos | APROBADO | esperado=true/0 / real=true/0 |

### 1.2 Controles estáticos y de archivo

| Control | Qué comprueba | Estado | Evidencia |
|---|---|---|---|
| **1.3** | El cambio de `index.html` se limita a 2 atributos `novalidate` | APROBADO | `git diff --stat index.html` → `2 insertions(+), 2 deletions(-)`; el diff muestra solo `<form id="form-libro" ... novalidate>` y `<form id="form-cliente" ... novalidate>`; `#form-busqueda` intacto |
| **7.11** | Fuente única de las opciones de los selectores de ventas | APROBADO | `Select-String` encuentra **2** referencias a `venta-cliente`/`renglon-libro` en `js/app.js`, ambas dentro de `poblarSelectoresRelacionados()` (L296 y L301) |
| **9.1** | Sin `console.log`, `console.warn` ni `debugger` | APROBADO | `Select-String -Pattern 'console\.|debugger'` → sin coincidencias |
| **9.2** | Solo `textContent` / `createTextNode` | APROBADO | La **única** aparición de `innerHTML` es la de C-03 (`contenedor.innerHTML = ""`, L147); el código nuevo usa `replaceChildren()` y `textContent` |
| **9.3** | Sin `fetch`, `localStorage`, URLs externas ni dependencias | APROBADO | `Select-String -Pattern 'fetch\|localStorage\|https?://\|XMLHttpRequest\|import\s'` → sin coincidencias; sin `package.json` ni `node_modules` en el repo |
| **9.5** | Solo se modifican los archivos declarados | APROBADO | `git diff --name-only` → `index.html`, `js/app.js` |
| **9.4** | Estilo consistente | APROBADO | 2 espacios, punto y coma, comillas dobles, nombres de función y variable en español |
| **10.1** | Propiedad de archivos en `CHANGES.md` | APROBADO | Fila de C-04 en §Reparto: puede tocar `js/app.js`, `index.html`; no puede tocar `css/`; nota que acota `index.html` a `novalidate`. Fila de C-04 en §Resumen y la nota de la fila de C-05 actualizadas |
| **10.2** | KB actualizada | APROBADO | `knowledge-base/07_flujos_principales.md`: estado del Flujo 2 y del Flujo 3 actualizados; ya no se pide "el conjunto de datos" (lo entregó C-03) |
| **10.6** | `AGENTS.md` y `CLAUDE.md` sin editar a mano | APROBADO | `git diff --name-only` no los muestra; la regeneración pendiente queda registrada en la sección 5 de este documento |
| **D-01** | Premisa de la decisión D-01 verificada empíricamente | APROBADO | En una **copia temporal fuera del repo** sin `novalidate`, `requestSubmit()` con un email inválido dispara **0** eventos `submit` (el navegador bloquea); con `novalidate` el envío se procesa y el mensaje propio queda visible |
| **D-10** | El precio se guarda sin redondear ni con tope de decimales | APROBADO | `validarLibro({precio: 10.555, ...}).ok` → `true`; `libros[7].precio` → `10.555`; el control `number` conserva `"10.555"` |

---

## 2. Qué se implementó

### 2.1 `index.html` (2 atributos)

- `novalidate` en `#form-libro` y en `#form-cliente`: la validación pasa a ser **íntegramente de JavaScript** y los errores se muestran en el mensaje propio de la página, junto al formulario, en vez del globo nativo del navegador (decisión D-01).
- Nada más del HTML se tocó: ni estructura, ni campos, ni `name`, ni `id`, ni textos, ni otros atributos.

### 2.2 `js/app.js`

| Bloque | Contenido |
|---|---|
| 3.1 | `formateadorPrecio` + `formatearPrecio()`: **única** definición del formato de precio de la app, compartida por el catálogo y las tablas |
| 6.1 | `normalizarIsbn()`, `isbnExiste()`, `normalizarEmail()`, `emailExiste()`, `emailValido()`, `siguienteId()`, `generarIdLibro()`, `generarIdCliente()` |
| 6.2 | `agregarOpcion()`, `poblarOpciones()` (única fuente de las opciones, **preserva la selección actual**), `poblarSelectoresAlta()`, `poblarSelectoresRelacionados()` |
| 6.3 | `renderLibros()` (6 columnas) y `renderClientes()` (2 columnas), con filas creadas por `createElement` + `textContent` |
| 6.4 | `validarLibro()` y `validarCliente()`, que devuelven `{ ok, errores: [{campo, motivo}] }` |
| 6.5 | `mostrarMensaje()`, `ocultarMensaje()`, `mostrarError()` (muestra el motivo y enfoca el primer campo con error), `mostrarExito()` |
| 6.6 | `leerDatosLibro()`, `leerDatosCliente()`, `registrarLibro()`, `registrarCliente()` |
| 6.7 | `inicializarAltas()` + un **segundo** listener de `DOMContentLoaded` (el de C-03 queda intacto) |

### 2.3 Lo que NO se implementó

- Ventas, renglones, total, confirmación ni historial (Ejercicio 5).
- Persistencia con `localStorage` y `README.md` (Ejercicio 6).
- Edición ni baja de registros. Altas de editorial, género o autor.
- Ningún estilo nuevo: `css/` no se tocó.
- Los dos selectores de la vista de Ventas se **poblan** (opciones), pero no hay lógica de venta: es el alcance que `CHANGES.md` asigna a C-04 y que C-05 consume.

---

## 3. Desviaciones y notas de implementación

### 3.1 D-10 y el precio: el dato no se redondea, la visualización sí

El escenario normativo de D-10 pide que un precio como `10.555` se registre **sin redondearlo**. Verificado:

- `validarLibro({precio: 10.555, ...}).ok` → `true` (la validación no redondea).
- El control `number` conserva el texto `"10.555"` (no lo normaliza).
- El valor **almacenado** es `10.555` (`libros[7].precio === 10.555`).
- La **visualización** en la tabla muestra `$ 10,56`: `Intl.NumberFormat` con `style: "currency"` resuelve `maximumFractionDigits` en 2 (los decimales de la moneda ARS) y **redondea para mostrar**. Es el mismo formateador que usa el catálogo desde C-03, y es coherente con RN-VEN-08 (los importes se presentan con dos decimales).

**Conclusión**: la regla de negocio se cumple (no se redondea ni se limita el dato); el redondeo ocurre solo en la capa de presentación, por el comportamiento estándar de `Intl`. Si el docente quiere ver el precio sin redondear en pantalla, eso exigiría cambiar el formato de la app, que es decisión del Ejercicio 2/5 y no de este change.

### 3.2 Único punto del código de C-03 que se tocó

`renderCatalogo()` usaba un `Intl.NumberFormat` **local**. Para no duplicar la regla de formato de precio (el `price` de la app), el formateador se movió a un helper compartido `formatearPrecio()` y `renderCatalogo()` ahora lo usa. El comportamiento es **idéntico** (mismos opciones de `Intl`): queda verificado por los controles de regresión del Ejercicio 3 (búsqueda "CIEN", catálogo completo, mensaje de sin resultados) y por el control 4.2c (precio `$ 2.500,00`).

### 3.3 La premisa de D-01 quedó confirmada, no asumida

El diseño de D-01 se apoyaba en que la validación nativa del navegador bloquea el `submit`. Eso se comprobó **empíricamente** con una copia temporal del proyecto **fuera del repo** y sin `novalidate`: el navegador bloquea el envío (0 eventos `submit`), por lo que el mensaje propio nunca se habría mostrado. Con `novalidate` el envío se procesa y el mensaje de la página aparece.

---

## 4. Casos manuales de la consigna (pág. 5)

| Caso | Resultado esperado | Estado | Evidencia |
|---|---|---|---|
| Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta | APROBADO | Duplicado con guiones (7.1f) y sin guiones (7.1h) rechazados, `libros.length` sin cambios; el nuevo (7.1i) se registra, aparece en la tabla (7.1j), en el catálogo y en `#renglon-libro` (7.7d) |
| Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección | APROBADO | `abc` (7.4e) y `a@b` (7.4h) rechazados con el mensaje propio; mayúsculas (7.5a) y espacios exteriores (7.5b) rechazados; el nuevo (7.5c) se registra y aparece en el listado (7.5f) y en `#venta-cliente` (7.7e) |

---

## 5. Pendientes y limitaciones

| # | Pendiente | Estado | Motivo / responsable |
|---|---|---|---|
| P-1 | Regenerar `AGENTS.md` y `CLAUDE.md` | **PENDIENTE** | Su línea de propiedad de archivos quedó desactualizada por la excepción de `index.html`. No se editan a mano (son generados): los regenera el equipo con `agents-md-generator`, que re-sincroniza `knowledge-base/` y `CHANGES.md` (tarea 10.6) |
| P-2 | Verificación con un segundo motor de render | **OMITIDO** | No hay un segundo motor instalado en la máquina (pregunta abierta de prioridad Alta en la KB). Los controles se ejecutaron en Edge headless |
| P-3 | Persistencia de las altas al recargar | **FUERA DE ALCANCE** | Es el Ejercicio 6 (`localStorage`); en este punto las altas se pierden al recargar, como está previsto |
| P-4 | Flujo de la KB del Ejercicio 3 que sigue diciendo "pendiente" | **PENDIENTE** (ajeno a este change) | `knowledge-base/07_flujos_principales.md`, Flujo 1, quedó desactualizado por C-03 y no se tocó en este change |

---

## 6. Definición de "Hecho"

| Criterio | Estado |
|---|---|
| Los 53 checks del `tasks.md` ejecutados | APROBADO |
| Los 9 criterios de aceptación (CA-01 a CA-09) verificados en navegador real | APROBADO |
| Los controles del filtro activo (7.10) y del helper de selectores (7.11) verificados | APROBADO |
| Los 2 casos manuales de la consigna ejecutados | APROBADO |
| La validación es propia, sin depender de la validación nativa | APROBADO |
| El cambio de `index.html` limitado a 2 atributos `novalidate` | APROBADO |
| Sin regresiones en C-01, C-02 y C-03 | APROBADO |
| El change valida contra el esquema de OpenSpec | APROBADO |
| `AGENTS.md` y `CLAUDE.md` sin editar a mano | APROBADO |
