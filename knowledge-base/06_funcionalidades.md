# Funcionalidades

Organizadas por **épica** y luego por **historia de usuario** (formato US-NNN). Cada épica corresponde a un ejercicio de la consigna.

## Épica 1: Estructura y pantallas HTML — *Ejercicio 1 (20 pts)*

### US-001 — Navegar entre las 5 vistas
**Como** lector
**Quiero** navegar entre Catálogo, Libros, Clientes, Ventas e Historial
**Para** llegar a cada sección del sistema desde una única página

**Criterios de aceptación**:
- [ ] CA-1: existen 5 vistas con navegación clara entre ellas
- [ ] CA-2: encabezado, navegación y contenido principal con etiquetas semánticas
- [ ] CA-3: cada campo tiene etiqueta asociada y cada botón un texto que describe su acción
- [ ] CA-4: las tablas incluyen encabezados

**Reglas relacionadas**: RN-GL-03

### US-002 — Ver los estados de una lista vacía
**Como** lector
**Quiero** que el sistema me diga cuando una lista está vacía o una búsqueda no arroja resultados
**Para** no confundir "no hay datos" con "el sistema falló"

**Criterios de aceptación**:
- [ ] CA-1: hay contenedores para lista vacía, búsqueda sin resultados y operaciones correctas o rechazadas
- [ ] CA-2: los mensajes son texto, con `role="status"` / `role="alert"`, no solo color

**Reglas relacionadas**: RN-CAT-06, RN-PRE-06

## Épica 2: Presentación con CSS — *Ejercicio 2 (20 pts)*

### US-003 — Identidad visual coherente
**Como** lector
**Quiero** que el sistema tenga una identidad visual propia y unificada
**Para** que se entienda que es un solo producto

**Criterios de aceptación**:
- [ ] CA-1: color, tipografía, espaciado, tarjetas, formularios y botones definidos
- [ ] CA-2: el CSS está en archivos externos y los elementos equivalentes reutilizan clases
- [ ] CA-3: la identidad resulta sólida y cohesiva

**Reglas relacionadas**: RN-PRE-01, RN-PRE-02

### US-004 — Usar la interfaz en pantalla chica
**Como** lector en un dispositivo angosto
**Quiero** que la interfaz se adapte a 320 px sin desplazar la página entera
**Para** poder operar el sistema desde el teléfono

**Criterios de aceptación**:
- [ ] CA-1: a 320 px y a 1280 px no hay desplazamiento horizontal de la página
- [ ] CA-2: las tablas anchas se desplazan dentro de su propio contenedor
- [ ] CA-3: textos y controles siguen siendo legibles

**Reglas relacionadas**: RN-PRE-03, RN-PRE-04

### US-005 — Operar con teclado y ver el foco
**Como** lector que navega con teclado
**Quiero** ver dónde está el foco y recorrer todos los controles
**Para** no perderme en los formularios

**Criterios de aceptación**:
- [ ] CA-1: los controles conservan foco visible
- [ ] CA-2: el recorrido por teclado alcanza y opera enlaces, campos, botones y contenedores con `tabindex`
- [ ] CA-3: los mensajes de error se comprueban por su texto

**Reglas relacionadas**: RN-PRE-05, RN-PRE-06

## Épica 3: Datos locales, catálogo y filtro — *Ejercicio 3 (15 pts)*

### US-006 — Explorar el catálogo
**Como** lector
**Quiero** ver el catálogo generado desde los datos locales
**Para** conocer los libros disponibles

**Criterios de aceptación**:
- [ ] CA-1: existen al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios
- [ ] CA-2: cada libro se relaciona con una editorial existente y uno o más autores existentes
- [ ] CA-3: el JavaScript genera el catálogo a partir del array de libros
- [ ] CA-4: un libro sin género muestra «Sin clasificar»

**Reglas relacionadas**: RN-CAT-01, RN-CAT-07, RN-CAT-08

### US-007 — Filtrar el catálogo por título
**Como** lector
**Quiero** buscar por parte del título
**Para** encontrar rápido el libro que busco

**Criterios de aceptación**:
- [ ] CA-1: el filtro ignora mayúsculas y minúsculas
- [ ] CA-2: encuentra coincidencias parciales y recorta espacios sobrantes
- [ ] CA-3: una búsqueda vacía muestra todo el catálogo
- [ ] CA-4: una búsqueda sin coincidencias muestra un mensaje claro

**Reglas relacionadas**: RN-CAT-02, RN-CAT-03, RN-CAT-04, RN-CAT-05, RN-CAT-06

## Épica 4: Alta de libros y clientes — *Ejercicio 4 (15 pts)*

### US-008 — Registrar un libro
**Como** lector
**Quiero** registrar un libro con su editorial, género y autores
**Para** que pase a formar parte del catálogo

**Criterios de aceptación**:
- [ ] CA-1: las opciones se generan desde los datos locales
- [ ] CA-2: el selector de género incluye «Sin clasificar»
- [ ] CA-3: se validan título, ISBN, precio, editorial y autores
- [ ] CA-4: se selecciona al menos un autor
- [ ] CA-5: tras un alta correcta, el listado y las opciones se actualizan sin recargar

**Reglas relacionadas**: RN-LIB-01 … RN-LIB-10, RN-GL-04

### US-009 — Registrar un cliente
**Como** lector
**Quiero** registrar un cliente con nombre y email
**Para** poder venderle

**Criterios de aceptación**:
- [ ] CA-1: se validan nombre, email y unicidad del email
- [ ] CA-2: los errores se muestran cerca del formulario
- [ ] CA-3: el envío se controla con `preventDefault`
- [ ] CA-4: el registro solo se agrega si todas las comprobaciones pasan

**Reglas relacionadas**: RN-CLI-01 … RN-CLI-06

## Épica 5: Venta simulada e historial — *Ejercicio 5 (20 pts)*

### US-010 — Componer una venta
**Como** lector
**Quiero** agregar renglones a una venta para un cliente
**Para** registrar lo que se lleva

**Criterios de aceptación**:
- [ ] CA-1: se selecciona un cliente existente y al menos un libro con cantidad entera mayor que cero
- [ ] CA-2: no se admiten libros repetidos: se modifica la cantidad o se informa el duplicado
- [ ] CA-3: se pueden cambiar cantidades y quitar renglones antes de confirmar
- [ ] CA-4: cada renglón muestra libro, cantidad, precio unitario y subtotal

**Reglas relacionadas**: RN-VEN-01 … RN-VEN-06

### US-011 — Confirmar la venta y ver el total
**Como** lector
**Quiero** confirmar la venta y ver el total calculado
**Para** cerrar la operación

**Criterios de aceptación**:
- [ ] CA-1: el total es la suma de los subtotales, con dos decimales
- [ ] CA-2: se impide confirmar sin cliente, sin renglones o con cantidades inválidas
- [ ] CA-3: al confirmar se registran identificador, fecha, cliente, renglones y total
- [ ] CA-4: la confirmación limpia el formulario y muestra un mensaje de resultado

**Reglas relacionadas**: RN-VEN-07 … RN-VEN-10, RN-VEN-13, RN-VEN-14

### US-012 — Consultar el historial y el detalle de una venta
**Como** lector
**Quiero** ver las ventas confirmadas y el detalle de sus renglones
**Para** revisar lo que registré

**Criterios de aceptación**:
- [ ] CA-1: el historial muestra identificador, fecha, cliente y total
- [ ] CA-2: se pueden consultar los renglones
- [ ] CA-3: el precio unitario conservado **no** cambia si después se modifica el precio del catálogo

**Reglas relacionadas**: RN-HIS-01, RN-HIS-02, RN-VEN-11, RN-VEN-12

## Épica 6: Persistencia, verificación y documentación — *Ejercicio 6 (10 pts)*

### US-013 — Conservar los datos entre recargas
**Como** lector
**Quiero** que los registros sobrevivan a una recarga
**Para** no perder el trabajo

**Criterios de aceptación**:
- [ ] CA-1: libros, clientes y ventas se conservan con `localStorage`
- [ ] CA-2: en el primer inicio se cargan los ejemplos
- [ ] CA-3: al reabrir se recuperan los registros sin duplicar los ejemplos

**Reglas relacionadas**: RN-PER-01 … RN-PER-04

### US-014 — Entregar el proyecto documentado
**Como** docente
**Quiero** un README con los pasos de apertura, la navegación, lo implementado y pendiente, la ubicación de los datos iniciales, los límites de `localStorage` y **los resultados reales** de los casos manuales
**Para** poder evaluar y reproducir la comprobación del precio histórico

**Criterios de aceptación**:
- [ ] CA-1: el README identifica a quienes realizan el trabajo
- [ ] CA-2: los casos manuales quedan registrados con su resultado observado
- [ ] CA-3: se documenta que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura
- [ ] CA-4: la procedencia de imágenes ajenas, si existen, queda declarada

**Reglas relacionadas**: RN-PER-04, RN-GL-01
