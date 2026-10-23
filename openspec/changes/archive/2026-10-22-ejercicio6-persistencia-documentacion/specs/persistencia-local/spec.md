# Spec Delta: Persistencia Local (Ejercicio 6)

## Purpose

Esta capacidad define cómo el sistema conserva libros, clientes y ventas en `localStorage` entre
recargas: la clave versionada y la forma del estado, la carga inicial de la semilla, la restauración sin
duplicación, la validación defensiva de los datos leídos y la escritura después de cada mutación.

## ADDED Requirements

### Requirement: Clave única, versionada y forma del estado

El sistema DEBE persistir el estado del dominio en una única clave de `localStorage` llamada
`libreria-el-estante:v1`, cuyo valor DEBE ser un objeto JSON con los arrays `libros`, `clientes` y
`ventas`. NO DEBE usar otras claves para el estado del dominio.

#### Scenario: Escritura en la clave versionada

- **WHEN** el sistema persiste el estado
- **THEN** existe una entrada en `localStorage` con la clave exacta `libreria-el-estante:v1`

#### Scenario: Forma del objeto persistido

- **WHEN** se lee y parsea el valor de `libreria-el-estante:v1`
- **THEN** es un objeto con exactamente las propiedades `libros`, `clientes` y `ventas`, y las tres son arrays

#### Scenario: Sin claves paralelas para el dominio

- **WHEN** se inspeccionan las claves de `localStorage` después de un alta y una venta
- **THEN** el estado del dominio aparece una sola vez, bajo `libreria-el-estante:v1`

---

### Requirement: Carga inicial de la semilla en el primer inicio

El sistema DEBE cargar la semilla de C-03 —2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes—
cuando la clave de almacenamiento no existe o su contenido fue descartado por inválido, y DEBE iniciar
las ventas como un array vacío.

#### Scenario: Primer inicio sin estado guardado

- **WHEN** se abre la aplicación y `libreria-el-estante:v1` no existe
- **THEN** el catálogo muestra los 6 libros de la semilla, el listado de clientes muestra los 3 clientes y el historial muestra su estado vacío

#### Scenario: Estado descartado por inválido

- **WHEN** la clave existe pero su contenido es inválido y el sistema lo descarta
- **THEN** el estado en memoria vuelve a la semilla de C-03 y la aplicación queda operable

---

### Requirement: Restauración sin duplicar datos iniciales

El sistema DEBE restaurar los conjuntos guardados **reemplazando** los conjuntos en memoria, de modo que
al volver a abrir no se agreguen los ejemplos de la semilla ni se dupliquen las ventas confirmadas.

#### Scenario: Recarga después de altas

- **WHEN** se registran un libro y un cliente y luego se recarga la página
- **THEN** el libro y el cliente nuevos siguen presentes y la cantidad total de libros es la guardada, no la guardada más los 6 ejemplos

#### Scenario: Recarga después de una venta

- **WHEN** se confirma una venta y luego se recarga la página
- **THEN** la venta aparece una sola vez en el historial y no se duplica

#### Scenario: Ejemplos sin repetir

- **WHEN** el estado guardado contiene los 6 libros de la semilla y se recarga
- **THEN** el catálogo sigue mostrando 6 libros y no 12

---

### Requirement: Validación del estado restaurado como entrada no confiable

El sistema DEBE validar y normalizar la forma del estado leído de `localStorage` antes de usarlo. DEBE
descartar el estado cuando el JSON es inválido, la raíz no es un objeto, o `libros`, `clientes` o
`ventas` no son arrays, y NUNCA DEBE insertar el contenido guardado como HTML interpretable.

#### Scenario: JSON inválido

- **WHEN** `libreria-el-estante:v1` contiene texto que no es JSON válido
- **THEN** el sistema no lanza un error fatal, descarta ese estado y arranca con la semilla

#### Scenario: Raíz que no es un objeto

- **WHEN** el valor guardado es `null`, un array o un valor primitivo
- **THEN** el sistema descarta el estado y arranca con la semilla

#### Scenario: Colección que no es un array

- **WHEN** el objeto guardado tiene `libros`, `clientes` o `ventas` con un valor que no es un array
- **THEN** el sistema descarta el estado completo y arranca con la semilla

#### Scenario: Registros con forma inválida

- **WHEN** un elemento de `libros` o `clientes` no tiene la forma esperada del modelo de datos
- **THEN** el sistema lo omite o lo normaliza antes de usarlo y nunca lo interpreta como HTML

#### Scenario: Título guardado con marcado

- **WHEN** un libro guardado tiene un título como `<img src=x onerror=alert(1)>`
- **THEN** el catálogo y el listado muestran ese texto de forma literal, sin ejecutar nada

---

### Requirement: Persistencia después de cada mutación del estado

El sistema DEBE escribir el estado completo después de cada alta de libro, cada alta de cliente y cada
venta confirmada. NO DEBE requerir una acción manual de guardado.

#### Scenario: Alta de libro persistida

- **WHEN** se registra un libro válido
- **THEN** el libro queda incluido en `libros` dentro de `libreria-el-estante:v1` antes de que el usuario recargue

#### Scenario: Alta de cliente persistida

- **WHEN** se registra un cliente válido
- **THEN** el cliente queda incluido en `clientes` dentro de `libreria-el-estante:v1`

#### Scenario: Venta confirmada persistida

- **WHEN** se confirma una venta válida
- **THEN** la venta queda incluida en `ventas` dentro de `libreria-el-estante:v1`

#### Scenario: Alta rechazada no persiste

- **WHEN** un alta o una confirmación es rechazada por validación
- **THEN** el estado guardado no cambia y no aparece ningún registro parcial

---

### Requirement: Integridad del historial persistido

El sistema DEBE conservar en `localStorage` los renglones con `precioUnitario`, `subtotal` y `total`
copiados al confirmar la venta, de modo que modificar el precio de un libro en el catálogo guardado NO
altere una venta ya persistida.

#### Scenario: Precio del catálogo modificado en el almacenamiento

- **WHEN** se modifica únicamente el `precio` de un libro dentro de `libros` en `libreria-el-estante:v1`, sin tocar `ventas`
- **THEN** los renglones y el total de la venta guardada conservan los valores confirmados

#### Scenario: Recarga después del cambio de precio

- **WHEN** se recarga la página después de cambiar el precio del catálogo guardado
- **THEN** el detalle de la venta anterior sigue mostrando el precio unitario, los subtotales y el total originales

---

### Requirement: Tolerancia a fallos de lectura, escritura y cuota

El sistema DEBE capturar los errores de `localStorage` al leer y al escribir, informar el problema sin
interrumpir la sesión y mantener el estado en memoria utilizable. Si el almacenamiento no está
disponible, la aplicación DEBE funcionar con la semilla durante esa sesión.

#### Scenario: Cuota de almacenamiento excedida

- **WHEN** una escritura falla con `QuotaExceededError`
- **THEN** el sistema informa que no pudo guardar, mantiene el registro en memoria y la interfaz sigue operable

#### Scenario: Almacenamiento no disponible

- **WHEN** el acceso a `localStorage` lanza una excepción, por ejemplo `SecurityError` sobre una ubicación restringida
- **THEN** la aplicación arranca con la semilla y muestra un aviso de que los datos no se conservarán entre recargas

#### Scenario: Lectura fallida

- **WHEN** leer la clave lanza una excepción
- **THEN** el sistema no se detiene, informa el problema y continúa con la semilla
