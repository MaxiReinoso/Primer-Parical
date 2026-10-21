# Flujos Principales

Cada flujo se documenta extremo a extremo. El alcance real de cada flujo depende del ejercicio que lo implementa: el **estado actual del proyecto** es el que se indica en cada caso.

## Flujo 1: Búsqueda en el catálogo
**Disparador**: el usuario escribe en el buscador por título
**Actor**: lector
**Estado actual**: **pendiente (Ejercicio 3)** — el HTML ya tiene el formulario (`#form-busqueda`) y los dos contenedores de mensaje (`#catalogo-vacio`, `#catalogo-sin-resultados`); falta la lógica.

**Pasos**:
1. El usuario escribe en `#buscador-titulo` (evento `input`).
2. El JS normaliza la búsqueda: recorta espacios sobrantes y pasa a minúsculas.
3. El JS filtra el array de libros comparando por **subcadena** sobre el título.
4. El JS reemplaza el contenido de `#catalogo-listado` con las tarjetas clonadas de `#plantilla-libro`.
5. Si el resultado está vacío y la búsqueda no lo estaba, se muestra `#catalogo-sin-resultados`; si la búsqueda está vacía, se muestra el catálogo completo.

**Casos de error**:
- Búsqueda sin coincidencias → mensaje claro, **no** un catálogo vacío (RN-CAT-06).
- Título con espacios sobrantes → se recortan antes de comparar (RN-CAT-04).

## Flujo 2: Alta de un libro
**Disparador**: envío del formulario `#form-libro`
**Actor**: lector
**Estado actual**: **pendiente (Ejercicio 4)** — el HTML y el CSS del formulario ya están listos; falta la lógica y el conjunto de datos.

**Pasos**:
1. El usuario completa título, ISBN, precio, editorial, género (opcional) y autores.
2. El JS intercepta el envío con `preventDefault`.
3. El JS valida título, ISBN, precio, editorial y autores (RN-LIB-01 … RN-LIB-07).
4. Si alguna validación falla → se muestra `#libro-mensaje-error` con el motivo; **no** se agrega el registro.
5. Si todas pasan → se agrega el libro, se muestra `#libro-mensaje-exito`, se **limpia el formulario** y se actualizan el listado y las opciones de los selectores sin recargar la página.

**Casos de error**:
- ISBN duplicado → se rechaza (RN-LIB-03).
- Precio no numérico o ≤ 0 → se rechaza (RN-LIB-04).
- Sin autores seleccionados → se rechaza (RN-LIB-06).

## Flujo 3: Alta de un cliente
**Disparador**: envío del formulario `#form-cliente`
**Actor**: lector
**Estado actual**: **pendiente (Ejercicio 4)**.

**Pasos**:
1. El usuario completa nombre completo y email.
2. El JS intercepta el envío con `preventDefault`.
3. El JS valida nombre, email y unicidad del email (RN-CLI-01 … RN-CLI-04).
4. Si falla → `#cliente-mensaje-error` con el motivo.
5. Si pasa → se agrega el cliente, se muestra `#cliente-mensaje-exito`, se limpia el formulario y se actualiza el listado y el selector de cliente de la vista de ventas.

**Casos de error**:
- Email con formato inválido → se rechaza (RN-CLI-03).
- Email existente en mayúsculas distintas → se rechaza (RN-CLI-04).

## Flujo 4: Venta simulada
**Disparador**: composición y confirmación desde `#form-venta`
**Actor**: lector
**Estado actual**: **pendiente (Ejercicio 5)** — la tabla, el fieldset de renglón, el bloque de total y los mensajes ya existen en el HTML y están estilizados.

**Pasos**:
1. El usuario selecciona un cliente en `#venta-cliente`.
2. El usuario elige un libro y una cantidad, y pulsa "Agregar renglón".
3. El JS valida la cantidad (entero > 0) y **detecta el duplicado de libro** (RN-VEN-02, RN-VEN-03).
4. El JS agrega la fila clonada de `#plantilla-renglon` a `#tabla-renglones-cuerpo` y recalcula subtotales y total.
5. El usuario puede quitar o modificar renglones antes de confirmar (RN-VEN-04).
6. Al confirmar, el JS valida que haya cliente y renglones con cantidades válidas, crea la venta con **precio unitario copiado** y la registra.

**Casos de error**:
- Venta sin cliente, sin renglones o con cantidad 0 / negativa / decimal → **no se confirma** (RN-VEN-09).
- Libro repetido → no crea un segundo renglón (RN-VEN-03).

## Flujo 5: Consulta del historial y del detalle
**Disparador**: el usuario navega a la vista Historial o pulsa "Ver detalle"
**Actor**: lector
**Estado actual**: **pendiente (Ejercicio 5)**.

**Pasos**:
1. El JS renderiza `#tabla-historial-cuerpo` con las ventas guardadas.
2. Si no hay ventas → se muestra `#historial-vacio`.
3. El usuario pulsa "Ver detalle" de una venta.
4. El JS renderiza `#tabla-detalle-cuerpo` con los renglones **y el precio unitario histórico** de esa venta, y oculta `#historial-detalle-vacio`.

**Casos de error**:
- Ninguna venta seleccionada → `#historial-detalle-vacio` (RN-HIS-01).

## Flujo 6: Persistencia entre recargas
**Disparador**: apertura de `index.html` y cada alta o venta confirmada
**Actor**: lector
**Estado actual**: **pendiente (Ejercicio 6)**.

**Pasos**:
1. Al cargar, el JS lee `localStorage`; si está vacío, carga los **datos de ejemplo** (RN-PER-02).
2. En cada alta o venta confirmada, el JS **escribe** el estado completo en `localStorage` (RN-PER-01).
3. Al reabrir, el JS **recupera** los registros guardados **sin duplicar** los ejemplos (RN-PER-03).

**Casos de error**:
- Perfil de navegador distinto o ubicación de apertura distinta → no se ven los datos guardados. Es una **limitación documentada**, no un error a corregir (RN-PER-04).

## Flujo 7: Recorrido de la interfaz con teclado y foco visible
**Disparador**: el usuario navega con `Tab` y `Enter`
**Actor**: lector
**Estado actual**: **implementado y verificado (Ejercicio 2)**.

**Pasos**:
1. El foco avanza por los 26 puntos de foco del DOM en orden lógico: 5 enlaces del `<nav>` → buscador → 6 campos de libro → botón → contenedor de tabla → 2 campos de cliente → botón → contenedor → 3 campos de venta → botón → contenedor → botón → 2 contenedores.
2. Cada punto de foco muestra un anillo `2px` de color `--color-foco`; los contenedores de tabla lo muestran **hacia adentro** (`outline-offset: -3px`).
3. El foco sale del documento al final y vuelve al inicio: **no hay trampa de foco**.
4. `Enter` sobre un enlace del `<nav>` activa la vista destino (`location.hash`).

**Casos de error**:
- Ninguno detectado: la recorrido completo se verificó con pulsaciones reales de `Tab` (3 corridas estables, 26/26 paradas con anillo).
