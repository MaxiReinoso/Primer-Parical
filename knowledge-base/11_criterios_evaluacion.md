# Criterios de Evaluación y Consigna

> **Extra (11).** Complementa los 10 archivos canónicos: no los reemplaza.

## Distribución de puntos (consigna, pág. 6)

| Ejercicio | Puntos | Distribución |
|---|---|---|
| 1 — HTML | 20 | Vistas y navegación: 10 · semántica, formularios y estados: 10 |
| 2 — CSS | 20 | Coherencia y organización: 8 · adaptación: 8 · accesibilidad básica: 4 |
| 3 — Datos y catálogo | 15 | Modelo y ejemplos: 5 · renderizado: 5 · filtro y estados: 5 |
| 4 — Altas | 15 | Libros y selectores: 6 · clientes: 4 · validación y actualización: 5 |
| 5 — Ventas | 20 | Composición y validaciones: 8 · cálculos: 5 · confirmación e historial inmutable: 7 |
| 6 — Cierre | 10 | Persistencia: 4 · pruebas manuales registradas: 3 · documentación y entrega: 3 |
| **Total** | **100** | |

## Enunciado por ejercicio

### Ejercicio 1 — Estructura y pantallas HTML
Se organiza el proyecto con `index.html` como entrada. Se permite usar varias páginas o secciones de una misma página, siempre que exista navegación clara entre las siguientes vistas:

- **Catálogo**: título de la librería, buscador por título y listado de libros. Cada libro muestra título, ISBN, editorial, género, autores y precio. Si no tiene género asignado, se muestra «Sin clasificar».
- **Libros**: formulario de alta y listado de libros registrados.
- **Clientes**: formulario de alta y listado de clientes registrados.
- **Ventas**: selección de cliente, composición de renglones y resumen de la venta.
- **Historial**: listado de ventas y acceso a sus detalles.

Se incluyen encabezado, navegación y contenido principal con etiquetas semánticas. Cada campo posee una etiqueta asociada; los botones tienen textos que describen su acción. Las tablas incluyen encabezados. Se incorporan mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas. Los listados y el historial se conectan con los datos locales. La estructura contempla los campos y estados que utiliza JavaScript.

### Ejercicio 2 — Presentación con CSS y uso adaptable
Se define una identidad visual propia y coherente: colores, tipografía, espaciado, tarjetas, formularios y botones. El CSS se mantiene en archivos externos y se reutilizan clases para elementos equivalentes. Se utiliza Flexbox o Grid para organizar el contenido. La interfaz se comprueba con un ancho de 320 px y otro de 1280 px: los textos y controles resultan legibles y el contenido no provoca desplazamiento horizontal de toda la página. Si una tabla necesita más espacio, se desplaza dentro de su propio contenedor. Los controles conservan un foco visible y se recorren con el teclado. Los mensajes de error se expresan con texto y no dependen únicamente de un color. Las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria.

### Ejercicio 3 — Datos locales, catálogo y filtro
Se representan libros, editoriales, géneros, autores y clientes mediante arrays y objetos con identificadores estables. El conjunto inicial incluye al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios. Cada libro se relaciona con una editorial existente y uno o más autores existentes. El género es opcional; si se asigna, corresponde a un género existente. JavaScript genera el catálogo a partir del array de libros. El filtro por título ignora diferencias entre mayúsculas y minúsculas, busca coincidencias parciales y elimina espacios sobrantes en los extremos de la búsqueda. Una búsqueda vacía muestra todo el catálogo; una búsqueda sin coincidencias muestra un mensaje claro. Se utilizan eventos y funciones con responsabilidades reconocibles. Los datos escritos por los usuarios se insertan como texto en el DOM. No se requiere traer datos con fetch ni administrar altas, bajas y modificaciones de editoriales, géneros o autores.

### Ejercicio 4 — Alta de libros y clientes
El formulario de libros permite registrar título, ISBN, precio y las relaciones con editorial, género y autores. Las opciones se generan a partir de los datos locales: editorial y género mediante selectores, y autores mediante un selector múltiple o controles de selección equivalentes. El selector de género incluye la opción «Sin clasificar», que representa la ausencia de género.

Se comprueba que el título y el ISBN no estén vacíos, que el ISBN no exista en el conjunto local, que el precio sea numérico y mayor que cero y que la editorial y todos los autores seleccionados existan en los datos locales. Se selecciona al menos un autor. El género puede quedar sin asignar; si se asigna, se verifica que exista en los datos locales. Para este parcial, el ISBN se compara sin espacios ni guiones; no se requiere implementar su dígito de control.

El formulario de clientes permite registrar nombre completo y email. No se requiere un campo de apellido separado. Se comprueba que el nombre completo y el email no estén vacíos, que el email tenga un formato válido y que no exista otro cliente con el mismo email, comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas. Se controla el envío con `preventDefault`, se muestran errores cerca del formulario y solo se agrega el registro si todas las comprobaciones pasan. Tras un alta correcta, el listado y las opciones relacionadas se actualizan sin recargar la página. No se exige editar ni eliminar registros.

### Ejercicio 5 — Venta simulada e historial
Se selecciona un cliente existente y se agrega al menos un renglón con un libro existente y una cantidad entera mayor que cero. No se admiten libros repetidos dentro de la misma venta: se modifica la cantidad del renglón existente o se informa el duplicado. Antes de confirmar, se permite cambiar cantidades y quitar renglones.

Cada renglón muestra libro, cantidad, precio unitario y subtotal. Se calcula subtotal como cantidad por precio y total como suma de subtotales; los importes se presentan con dos decimales. Se impide confirmar una venta sin cliente, sin renglones o con cantidades inválidas.

Al confirmar, se registra un identificador, fecha, cliente, renglones y total. El precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial. Se conservan también los datos descriptivos necesarios para leer esa venta. El historial muestra identificador, fecha, cliente y total, y permite consultar los renglones. Las ventas confirmadas no se editan ni eliminan desde la interfaz. La confirmación limpia el formulario para una nueva venta y muestra un mensaje de resultado.

### Ejercicio 6 — Persistencia, verificación y documentación
Se utiliza localStorage para conservar libros, clientes y ventas. En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales. El README explica que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura, y que no comparte información entre usuarios. Se registra en el README el resultado observado de estos casos manuales (ver `12_casos_manuales.md`).

La comprobación del precio histórico se realiza de forma guiada por el docente en una copia del proyecto y con datos de prueba: se confirma una venta, se anotan sus importes, se modifica únicamente el precio del libro dentro del catálogo guardado en localStorage (sin modificar ni borrar las ventas guardadas), se recarga la página y se consulta el detalle de la venta anterior. La ubicación y la estructura del catálogo guardado se identifican en el README para reproducir esta comprobación.

**Si un caso falla o una funcionalidad queda pendiente, se registra el comportamiento real. No se indica una prueba como aprobada sin ejecutarla.**

## Formato de entrega
Se entrega una carpeta o archivo comprimido con `index.html`, los demás HTML si corresponden, carpetas de CSS, JavaScript y recursos locales, y un README.md. **No se incluyen dependencias instaladas ni herramientas de compilación.**

El README identifica a quienes realizan el trabajo y contiene: pasos para abrir index.html en el navegador sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de localStorage; resultados de los casos manuales y procedencia de imágenes ajenas, si existen.
