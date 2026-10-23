# Spec Delta: Documentación de Entrega (Ejercicio 6)

## Purpose

Esta capacidad define el contenido obligatorio del `README.md` de entrega: identificación del equipo,
apertura sin npm, navegación, estado real de las funcionalidades, ubicación de la semilla, límites de
`localStorage`, evidencia de los casos manuales, declaración de imágenes y guía del precio histórico.

## ADDED Requirements

### Requirement: README en la raíz de la entrega

El sistema DEBE incluir un archivo `README.md` en la raíz del proyecto que funcione como documento de
entrega, junto a `index.html`, `css/`, `js/` y los recursos locales.

#### Scenario: README presente en la raíz

- **WHEN** se inspecciona la carpeta de entrega
- **THEN** existe `README.md` en la raíz, al mismo nivel que `index.html`

#### Scenario: Entrega sin dependencias ni compilación

- **WHEN** se inspecciona la carpeta de entrega
- **THEN** no contiene `node_modules`, `package.json`, archivos de build ni herramientas instaladas

---

### Requirement: Identificación del equipo y apertura sin npm

El README DEBE identificar a quienes realizan el trabajo y DEBE explicar cómo abrir `index.html`
directamente en el navegador sin npm, incluyendo una URL de ejemplo con esquema `file://`.

#### Scenario: Integrantes identificados

- **WHEN** se lee la sección de presentación del README
- **THEN** aparecen los nombres de los integrantes del equipo

#### Scenario: Pasos de apertura sin npm

- **WHEN** se lee la sección de apertura del README
- **THEN** describe abrir `index.html` con doble clic o desde el navegador y no requiere `npm install`, `npm run` ni un servidor

#### Scenario: URL file de ejemplo

- **WHEN** se lee la sección de apertura del README
- **THEN** incluye un ejemplo de ruta con esquema `file://` que apunta a `index.html`

---

### Requirement: Navegación entre las cinco vistas

El README DEBE describir la navegación entre las vistas Catálogo, Libros, Clientes, Ventas e Historial.

#### Scenario: Las cinco vistas documentadas

- **WHEN** se lee la sección de navegación del README
- **THEN** nombra las cinco vistas y explica cómo llegar a cada una desde la navegación principal

---

### Requirement: Funcionalidades implementadas y pendientes

El README DEBE enumerar las funcionalidades implementadas y las pendientes de forma veraz, sin declarar
implementado lo que no puede ejecutarse en la copia entregada.

#### Scenario: Estado real declarado

- **WHEN** se lee la sección de estado del README
- **THEN** cada funcionalidad aparece como implementada o pendiente y la lista coincide con el comportamiento observable del proyecto entregado

#### Scenario: Dependencia ausente declarada

- **WHEN** una funcionalidad depende de otra que no está presente en la copia entregada
- **THEN** el README la registra como pendiente con su motivo, en lugar de presentarla como terminada

---

### Requirement: Ubicación de los datos iniciales

El README DEBE indicar dónde viven los datos iniciales y DEBE señalar que la semilla se define en
`js/app.js`.

#### Scenario: Semilla ubicada

- **WHEN** se lee la sección de datos iniciales del README
- **THEN** indica que la semilla de libros, editoriales, géneros, autores y clientes está en `js/app.js`

---

### Requirement: Funcionamiento y límites de localStorage

El README DEBE explicar el funcionamiento y los límites de `localStorage`: que el almacenamiento depende
del navegador, del perfil y de la ubicación de apertura, y que no comparte información entre usuarios
(RN-PER-04). DEBE indicar la clave utilizada.

#### Scenario: Dependencia del navegador, perfil y ubicación

- **WHEN** se lee la sección de almacenamiento del README
- **THEN** explica que los datos dependen del navegador, del perfil y de la ubicación desde la que se abre el proyecto

#### Scenario: Sin compartición entre usuarios

- **WHEN** se lee la sección de almacenamiento del README
- **THEN** declara explícitamente que la información no se comparte entre usuarios ni entre dispositivos

#### Scenario: Clave documentada

- **WHEN** se lee la sección de almacenamiento del README
- **THEN** menciona la clave `libreria-el-estante:v1` y el objeto `{ libros, clientes, ventas }` que guarda

---

### Requirement: Resultados observados de los ocho casos manuales

El README DEBE registrar los 8 casos manuales de `knowledge-base/12_casos_manuales.md` con su estado
{aprobado, fallido, omitido, pendiente}, su motivo y el resultado observado. NO DEBE marcar como aprobado
un caso que no fue ejecutado.

#### Scenario: Los ocho casos presentes

- **WHEN** se lee la sección de casos manuales del README
- **THEN** aparecen los 8 casos exigidos por la consigna, cada uno con estado y motivo

#### Scenario: Caso no ejecutado no se aprueba

- **WHEN** un caso no fue ejecutado
- **THEN** figura como pendiente u omitido con su motivo, nunca como aprobado

#### Scenario: Caso fallido registra el comportamiento real

- **WHEN** un caso se ejecuta y falla
- **THEN** figura como fallido y se describe lo observado, sin corregir la evidencia

---

### Requirement: Declaración explícita de cero imágenes

El README DEBE declarar explícitamente que el proyecto no incluye imágenes y que, por lo tanto, no hay
procedencia de imágenes ajenas que acreditar. NO DEBE inventar procedencia ni declarar la ausencia de
imágenes como un control aprobado.

#### Scenario: Declaración de cero imágenes

- **WHEN** se lee la sección de imágenes del README
- **THEN** declara que el proyecto usa cero imágenes, tanto propias como de terceros

#### Scenario: Sin procedencia inventada

- **WHEN** se revisa la declaración de imágenes
- **THEN** no atribuye autoría, licencia ni origen a ninguna imagen inexistente

#### Scenario: Ausencia declarada como vacua

- **WHEN** se registra el estado del requisito de texto alternativo
- **THEN** se declara **vacuo** por ausencia de imágenes, no como un control aprobado

---

### Requirement: Guía reproducible de la comprobación del precio histórico

El README DEBE identificar la ubicación y la estructura del catálogo guardado para que el docente
reproduzca los 4 pasos de la comprobación guiada, y DEBE registrar el resultado observado de esa
comprobación.

#### Scenario: Ubicación y estructura del catálogo guardado

- **WHEN** se lee la guía del precio histórico
- **THEN** indica que el catálogo está en `localStorage` bajo `libreria-el-estante:v1`, en la propiedad `libros`, y que el precio de cada libro está en su campo `precio`

#### Scenario: Los cuatro pasos descritos

- **WHEN** se lee la guía del precio histórico
- **THEN** describe: confirmar una venta y anotar sus importes; modificar solo el precio del libro en el catálogo guardado; recargar; consultar el detalle de la venta anterior

#### Scenario: Resultado observado registrado

- **WHEN** se lee el cierre de la guía del precio histórico
- **THEN** figura el resultado observado de la comprobación y no una promesa de resultado
