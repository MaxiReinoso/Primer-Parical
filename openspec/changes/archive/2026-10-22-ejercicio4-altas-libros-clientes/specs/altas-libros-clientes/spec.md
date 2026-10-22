# Spec Delta: Altas de libros y clientes (Ejercicio 4)

## Purpose

Esta capacidad define el registro de **libros** y de **clientes** desde los formularios de las vistas
*Libros* y *Clientes*: los selectores de editorial, género y autores generados a partir de los datos
locales, las validaciones de dominio del alta, los mensajes de error y de éxito mostrados junto al
formulario, y la actualización de los listados y de los selectores relacionados sin recargar la página.

Es la capacidad que habilita el Ejercicio 5 (C-05), que consumirá los libros y clientes registrados
desde la vista de Ventas, y el Ejercicio 6 (C-06), que persistirá esas altas en `localStorage`.

## ADDED Requirements

### Requirement: Selectores del alta generados desde los datos locales

El sistema DEBE poblar `#libro-editorial`, `#libro-genero` y `#libro-autores` con opciones derivadas
de los datos locales (`editoriales`, `generos`, `autores`), y DEBE mantener en `#libro-genero` la
opción «Sin clasificar» con `value=""`, que representa la **ausencia** de género y no un género
ficticio.

#### Scenario: Editoriales disponibles en el selector

- **WHEN** la vista *Libros* se carga
- **THEN** `#libro-editorial` contiene una opción por cada elemento de `editoriales`, con `value` igual
  a su `id` y texto igual a su `nombre`

#### Scenario: Géneros con «Sin clasificar» como primera opción

- **WHEN** la vista *Libros* se carga
- **THEN** `#libro-genero` mantiene la opción «Sin clasificar» con `value=""` como **primera** opción y
  agrega una opción por cada elemento de `generos` a continuación

#### Scenario: Autores en selector múltiple

- **WHEN** la vista *Libros* se carga
- **THEN** `#libro-autores` contiene una opción por cada elemento de `autores` y permite seleccionar
  más de uno

---

### Requirement: Validación de los datos del alta de libro

El sistema DEBE rechazar el alta de un libro si el título está vacío, si el ISBN está vacío, si el
precio no es numérico o no es mayor que cero, si la editorial seleccionada no existe en los datos
locales, si no se selecciona al menos un autor, si alguno de los autores seleccionados no existe en los
datos locales o si se asigna un género que no existe en los datos locales.

#### Scenario: Título vacío

- **WHEN** se envía `#form-libro` con el título vacío o compuesto solo por espacios
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: ISBN vacío

- **WHEN** se envía `#form-libro` con el ISBN vacío o compuesto solo por espacios
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Precio no numérico o no positivo

- **WHEN** se envía `#form-libro` con el precio vacío, no numérico, igual a cero o menor que cero
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Precio numérico con más de dos decimales

- **WHEN** se envía `#form-libro` con un precio numérico mayor que cero que tiene más de dos decimales, por ejemplo `10.555`
- **THEN** el libro se registra con ese precio, **sin redondearlo** y **sin limitar sus decimales**

#### Scenario: Editorial inexistente

- **WHEN** se envía `#form-libro` con una editorial que no existe en `editoriales`
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Sin autores seleccionados

- **WHEN** se envía `#form-libro` sin seleccionar ningún autor
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Autor seleccionado inexistente

- **WHEN** se envía `#form-libro` con al menos un autor seleccionado que no existe en `autores`
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Género asignado inexistente

- **WHEN** se envía `#form-libro` con un género seleccionado que no existe en `generos`
- **THEN** el libro NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Género sin asignar es válido

- **WHEN** se envía `#form-libro` con «Sin clasificar» seleccionado y el resto de los datos válidos
- **THEN** el libro se registra con `generoId` nulo

---

### Requirement: Unicidad del ISBN comparado sin espacios ni guiones

El sistema DEBE comparar el ISBN ingresado con los ISBN del conjunto local **sin espacios ni guiones**,
y DEBE rechazar el alta si ya existe un ISBN equivalente. El sistema NO DEBE validar el dígito de
control del ISBN.

#### Scenario: ISBN repetido con guiones distintos

- **WHEN** se ingresa `9780307474728` y ya existe el libro con ISBN `978-0307474728`
- **THEN** el alta se rechaza y se informa que el ISBN ya está registrado

#### Scenario: ISBN repetido con espacios

- **WHEN** se ingresa `978 0307474728` y ya existe el libro con ISBN `978-0307474728`
- **THEN** el alta se rechaza y se informa que el ISBN ya está registrado

#### Scenario: ISBN nuevo se acepta

- **WHEN** se ingresa un ISBN que no existe en el conjunto local
- **THEN** el libro se registra con ese ISBN

#### Scenario: No se valida el dígito de control

- **WHEN** se ingresa un ISBN con un dígito de control inválido pero no repetido
- **THEN** el libro se registra: el sistema no implementa la validación del dígito de control

---

### Requirement: Alta de libro registrada con sus relaciones

El sistema DEBE agregar el libro al conjunto local con título, ISBN, precio, editorial, género
(opcional) y al menos un autor, con un `id` **estable y único**, y DEBE limpiar el formulario e informar
el resultado.

#### Scenario: Libro válido se agrega al conjunto

- **WHEN** se envía `#form-libro` con todos los datos válidos
- **THEN** `libros` contiene un elemento nuevo con `titulo`, `isbn`, `precio` numérico, `editorialId`
  existente, `generoId` existente o `null` y `autorIds` con al menos un autor existente

#### Scenario: Identificador estable y único

- **WHEN** se registran dos libros nuevos de forma successiva
- **THEN** sus `id` son distintos y siguen el patrón `lib-N` calculado sobre el conjunto actual

#### Scenario: Formulario limpio tras el alta

- **WHEN** un libro se registra correctamente
- **THEN** los campos del formulario `#form-libro` quedan vacíos y `#libro-genero` vuelve a «Sin
  clasificar»

#### Scenario: Mensaje de éxito

- **WHEN** un libro se registra correctamente
- **THEN** `#libro-mensaje-exito` queda visible y `#libro-mensaje-error` queda oculto

---

### Requirement: Validación de los datos del alta de cliente

El sistema DEBE rechazar el alta de un cliente si el nombre completo está vacío, si el email está
vacío, si el email no tiene un formato válido o si ya existe otro cliente con el mismo email comparado
sin espacios exteriores y sin distinguir mayúsculas de minúsculas. El sistema NO DEBE pedir un campo de
apellido separado.

#### Scenario: Nombre o email vacíos

- **WHEN** se envía `#form-cliente` con el nombre o el email vacíos
- **THEN** el cliente NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Email con formato inválido

- **WHEN** se envía `#form-cliente` con un email que no tiene un formato válido, por ejemplo `abc` o
  `a@b`
- **THEN** el cliente NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Email duplicado con distinta capitalización

- **WHEN** se envía `#form-cliente` con el email `MARIA.GONZALEZ@EMAIL.COM` y ya existe el cliente
  `maria.gonzalez@email.com`
- **THEN** el cliente NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Email duplicado con espacios exteriores

- **WHEN** se envía `#form-cliente` con el email `  maria.gonzalez@email.com  ` y ya existe ese
  cliente
- **THEN** el cliente NO se agrega y se muestra un mensaje de error junto al formulario

#### Scenario: Email nuevo se acepta

- **WHEN** se envía `#form-cliente` con un email válido que no existe en el conjunto local
- **THEN** el cliente se registra y queda visible en el listado de clientes

---

### Requirement: Mensajes de error y de éxito junto al formulario

El sistema DEBE mostrar los errores de validación en `#libro-mensaje-error` y
`#cliente-mensaje-error`, respectivamente, **junto al formulario correspondiente**, expresados en texto
comprensible que no depende únicamente del color, y DEBE mostrar los mensajes de éxito en
`#libro-mensaje-exito` y `#cliente-mensaje-exito`. En todo momento DEBE haber **a lo sumo un** mensaje
visible por formulario.

#### Scenario: Error de validación visible junto al formulario

- **WHEN** una validación falla
- **THEN** el mensaje de error del formulario correspondiente queda visible con el motivo del rechazo y
  el mensaje de éxito queda oculto

#### Scenario: Un solo mensaje visible por formulario

- **WHEN** un alta falla y luego un alta del mismo formulario tiene éxito
- **THEN** en cada momento hay exactamente un mensaje visible de ese formulario

#### Scenario: Foco en el primer campo con error

- **WHEN** una validación falla
- **THEN** el foco se ubica en el primer campo que resultó inválido

---

### Requirement: Control del envío del formulario

El sistema DEBE controlar el envío de `#form-libro` y `#form-cliente` con `preventDefault()`, y NO DEBE
agregar ningún registro cuando falla al menos una validación.

#### Scenario: El envío no recarga la página

- **WHEN** se envía cualquiera de los dos formularios
- **THEN** la página no se recarga y la URL no cambia

#### Scenario: Ningún registro parcial

- **WHEN** una validación falla
- **THEN** el conjunto local de libros o de clientes queda con la misma cantidad de elementos que antes
  del envío

---

### Requirement: Actualización de listados y selectores sin recargar

Tras un alta correcta, el sistema DEBE actualizar **sin recargar la página** el listado de libros
registrados, el listado de clientes registrados, el catálogo de la vista *Catálogo* y los selectores
relacionados de la vista *Ventas* (`#renglon-libro` y `#venta-cliente`).

#### Scenario: Listado de libros actualizado

- **WHEN** se registra un libro correctamente
- **THEN** `#tabla-libros-cuerpo` contiene una fila nueva con título, ISBN, editorial, género, autores y
  precio

#### Scenario: Listado de clientes actualizado

- **WHEN** se registra un cliente correctamente
- **THEN** `#tabla-clientes-cuerpo` contiene una fila nueva con nombre completo y email

#### Scenario: El catálogo respeta el filtro activo

- **WHEN** hay una búsqueda escrita en `#buscador-titulo` y se registra un libro cuyo título no coincide
  con esa búsqueda
- **THEN** el libro queda registrado, aparece en el listado de libros registrados y **no** aparece en el
  catálogo filtrado hasta que la búsqueda coincida o se borre

#### Scenario: Selector de libro de la venta actualizado

- **WHEN** se registra un libro correctamente
- **THEN** `#renglon-libro` incluye una opción con el libro nuevo

#### Scenario: Selector de cliente de la venta actualizado

- **WHEN** se registra un cliente correctamente
- **THEN** `#venta-cliente` incluye una opción con el cliente nuevo

---

### Requirement: Validación propia, sin depender de la validación nativa del navegador

El sistema DEBE validar **todos** los requisitos de alta con su propia validación en JavaScript, sin
depender de la validación de restricciones del navegador: `#form-libro` y `#form-cliente` DEBEN
desactivar la validación nativa (`novalidate`) y el sistema DEBE mostrar su propio mensaje de error
junto al formulario en lugar de un mensaje del navegador.

#### Scenario: Formularios con validación nativa desactivada

- **WHEN** se inspecciona `#form-libro` o `#form-cliente`
- **THEN** el formulario declara el atributo `novalidate`

#### Scenario: Email mal formado muestra el mensaje propio

- **WHEN** se envía `#form-cliente` con un email mal formado
- **THEN** el cliente NO se agrega y el mensaje de error **de la página** queda visible junto al
  formulario, sin depender del aviso nativo del navegador

#### Scenario: Precio inválido muestra el mensaje propio

- **WHEN** se envía `#form-libro` con un precio no numérico o no positivo
- **THEN** el libro NO se agrega y el mensaje de error de la página queda visible junto al formulario

---

### Requirement: Inserción de los datos como texto y uso de tecnologías permitidas

El sistema DEBE insertar todos los datos escritos por el usuario en el DOM **como texto**, nunca como
HTML interpretable, y DEBE usar únicamente HTML, CSS y JavaScript nativos, sin dependencias instaladas,
sin URLs externas y sin herramientas de compilación.

#### Scenario: Un título con marcado se inserta literal

- **WHEN** se registra un libro cuyo título es `<img src=x onerror=alert(1)>`
- **THEN** el listado de libros y el catálogo muestran ese texto de forma literal, sin interpretarlo
  como HTML y sin ejecutar nada

#### Scenario: Sin dependencias ni recursos externos

- **WHEN** se inspecciona el proyecto
- **THEN** no hay `package.json`, ni librerías, ni CDN, ni `fetch`, ni `localStorage` en el código del
  punto 4

---

### Requirement: Conservación de la estructura existente

El sistema NO DEBE agregar, renombrar ni eliminar campos, identificadores o relaciones de la
estructura existente, y NO DEBE implementar funcionalidades ajenas al Ejercicio 4.

#### Scenario: Los identificadores no cambian

- **WHEN** se inspecciona el código del punto 4
- **THEN** todos los elementos consultados por identificador existen en `index.html` con el mismo
  nombre, y no se agrega ni se renombra ninguno

#### Scenario: No se implementan funcionalidades excluidas

- **WHEN** se inspecciona el código del punto 4
- **THEN** NO existe lógica de ventas, de renglones, de total, de historial, de persistencia, de edición
  ni de eliminación de registros

## REMOVED Requirements

(none)

---

## RENAMED Requirements

(none)