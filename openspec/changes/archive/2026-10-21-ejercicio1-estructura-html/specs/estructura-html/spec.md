# Spec Delta

## Purpose

Definir la estructura HTML del frontend de la librería: las 5 vistas con navegación clara, la semántica del documento, los formularios con etiqueta asociada, las tablas con encabezados y los contenedores de estado que consume el JavaScript de los ejercicios siguientes.

## ADDED Requirements

### Requirement: Organización en cinco vistas con navegación clara
El sistema DEBE presentar cinco vistas —Catálogo, Libros, Clientes, Ventas e Historial— dentro de un único `index.html`, con una barra de navegación que lleva a cada una.

#### Scenario: Las cinco vistas existen y son alcanzables
- **WHEN** se inspecciona el DOM cargado
- **THEN** existen 5 `section` con los identificadores `catalogo`, `libros`, `clientes`, `ventas` e `historial`, en ese orden

#### Scenario: La navegación salta a cada vista
- **WHEN** se recorren los 5 enlaces del `<nav>` con el teclado y se activan
- **THEN** cada uno lleva a su vista destino, y los enlaces funcionan **sin JavaScript**

### Requirement: Semántica, etiquetas y tablas
El documento DEBE usar etiquetas semánticas (`header`, `nav`, `main`, `section`, `footer`), cada campo DEBE tener etiqueta asociada, cada botón DEBE tener un texto que describa su acción, y toda tabla DEBE incluir encabezados.

#### Scenario: Cada control tiene su etiqueta
- **WHEN** se cruzan todos los atributos `for` con los `id` existentes
- **THEN** los 12 controles de formulario tienen etiqueta y no hay ningún `for` huérfano

#### Scenario: Los botones describen su acción
- **WHEN** se leen los textos de los botones
- **THEN** nombran la acción ("Registrar libro", "Registrar cliente", "Agregar renglón", "Confirmar venta")

#### Scenario: Toda tabla tiene encabezados
- **WHEN** se inspecciona cada `<table>`
- **THEN** las 5 tienen `<thead>` con `<th scope="col">` y un `<tbody>` con identificador

### Requirement: Contenedores de estado
El sistema DEBE incluir contenedores para lista vacía, búsqueda sin resultados, operación correcta y operación rechazada, en cada vista que los necesita.

#### Scenario: Los diez contenedores de estado existen
- **WHEN** se buscan los elementos con clase `mensaje`
- **THEN** hay 10: 4 de estado vacío, 3 de éxito y 3 de error

#### Scenario: Los estados iniciales son los correctos
- **WHEN** se carga la página por primera vez
- **THEN** los 3 mensajes de estado vacío son visibles y los 7 restantes llevan el atributo `hidden`

### Requirement: Estructura preparada para el JavaScript
La estructura DEBE contemplar los campos y estados que utiliza JavaScript, sin incluir lógica ni datos de ejemplo.

#### Scenario: Los puntos de anclaje del render existen
- **WHEN** se busca el molde de la tarjeta de libro y el de la fila de renglón
- **THEN** ambos existen como `<template>` y permanecen inertes: 0 tarjetas y 0 filas renderizadas

#### Scenario: No hay lógica ni datos hardcodeados
- **WHEN** se inspecciona el HTML
- **THEN** no hay atributos `style=`, ni `<style>`, ni `<script>` con cuerpo, ni filas de datos fuera de las plantillas

### Requirement: Apertura directa sin herramientas
El proyecto DEBE abrirse directamente desde `file://`, sin servidor, sin `npm` y sin paso de build.

#### Scenario: Los recursos enlazados existen
- **WHEN** se abre `index.html` con doble clic
- **THEN** el `<link>` a `css/styles.css` y el `<script defer>` a `js/app.js` resuelven sin error

#### Scenario: Cero dependencias externas
- **WHEN** se buscan URLs en el proyecto
- **THEN** no hay ninguna `http://`, `https://` ni `//` externa
