# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad. Los dominios siguen los 6 ejercicios de la consigna.

## Dominio: Catálogo (RN-CAT)

- **RN-CAT-01**: El catálogo se genera en el DOM a partir del array de libros — nunca se escribe a mano en el HTML.
- **RN-CAT-02**: El filtro por título **ignora las diferencias entre mayúsculas y minúsculas**.
- **RN-CAT-03**: El filtro busca **coincidencias parciales** (subcadena), no igualdad exacta.
- **RN-CAT-04**: El filtro **elimina los espacios sobrantes en los extremos** de la búsqueda antes de comparar.
- **RN-CAT-05**: Una búsqueda **vacía muestra todo** el catálogo.
- **RN-CAT-06**: Una búsqueda **sin coincidencias** muestra un mensaje claro, no un catálogo vacío.
- **RN-CAT-07**: Si un libro no tiene género asignado, se muestra **«Sin clasificar»**.
- **RN-CAT-08**: Los datos escritos por el usuario se insertan **como texto** en el DOM (nunca como HTML interpretable).

## Dominio: Alta de libros (RN-LIB)

- **RN-LIB-01**: El registro exige **título no vacío**.
- **RN-LIB-02**: El registro exige **ISBN no vacío**.
- **RN-LIB-03**: El **ISBN no puede existir** en el conjunto local.
- **RN-LIB-04**: El **precio debe ser numérico y mayor que cero**.
- **RN-LIB-05**: La **editorial debe existir** en los datos locales.
- **RN-LIB-06**: Se debe seleccionar **al menos un autor**, y **todos** los seleccionados deben existir en los datos locales.
- **RN-LIB-07**: El género **puede quedar sin asignar**; si se asigna, debe existir en los datos locales.
- **RN-LIB-08**: El selector de género incluye la opción **«Sin clasificar»**, que representa la ausencia de género.
- **RN-LIB-09**: Las opciones de editorial y género se generan desde los datos locales; los autores, mediante un **selector múltiple o control equivalente**.
- **RN-LIB-10**: El ISBN se compara **sin espacios ni guiones**. No se implementa el **dígito de control**.

## Dominio: Alta de clientes (RN-CLI)

- **RN-CLI-01**: El registro exige **nombre completo no vacío**.
- **RN-CLI-02**: El registro exige **email no vacío**.
- **RN-CLI-03**: El email debe tener **formato válido**.
- **RN-CLI-04**: No puede existir **otro cliente con el mismo email**, comparado **sin espacios exteriores y sin distinguir mayúsculas de minúsculas**.
- **RN-CLI-05**: No se requiere un campo de **apellido separado**.
- **RN-CLI-06**: Los errores se muestran **cerca del formulario**.

## Dominio: Ventas (RN-VEN)

- **RN-VEN-01**: La venta requiere un **cliente existente**.
- **RN-VEN-02**: La venta requiere **al menos un renglón** con un **libro existente** y una **cantidad entera mayor que cero**.
- **RN-VEN-03**: **No se admiten libros repetidos** dentro de la misma venta: se modifica la cantidad del renglón existente o se informa el duplicado.
- **RN-VEN-04**: Antes de confirmar se permite **cambiar cantidades y quitar renglones**.
- **RN-VEN-05**: Cada renglón muestra **libro, cantidad, precio unitario y subtotal**.
- **RN-VEN-06**: `subtotal = cantidad × precio unitario`.
- **RN-VEN-07**: `total = Σ subtotales`.
- **RN-VEN-08**: Los importes se presentan con **dos decimales**.
- **RN-VEN-09**: Se **impide confirmar** una venta sin cliente, sin renglones o con cantidades inválidas.
- **RN-VEN-10**: Al confirmar se registran **identificador, fecha, cliente, renglones y total**.
- **RN-VEN-11**: El **precio unitario se copia** al renglón como **valor histórico**: no se vuelve a obtener del precio actual del catálogo al consultar el historial.
- **RN-VEN-12**: Se conservan también los **datos descriptivos** necesarios para leer la venta.
- **RN-VEN-13**: Las ventas confirmadas **no se editan ni se eliminan** desde la interfaz.
- **RN-VEN-14**: La confirmación **limpia el formulario** para una nueva venta y muestra un **mensaje de resultado**.

## Dominio: Historial (RN-HIS)

- **RN-HIS-01**: El historial muestra **identificador, fecha, cliente y total**.
- **RN-HIS-02**: El historial **permite consultar los renglones** de cada venta.

## Dominio: Persistencia (RN-PER)

- **RN-PER-01**: `localStorage` conserva **libros, clientes y ventas**.
- **RN-PER-02**: En el **primer inicio** se cargan los ejemplos.
- **RN-PER-03**: Al **volver a abrir** se recuperan los registros guardados **sin duplicar** los datos iniciales.
- **RN-PER-04**: El almacenamiento **depende del navegador, del perfil y de la ubicación de apertura**, y **no comparte información entre usuarios**. Esa limitación debe quedar registrada en el README.

## Dominio: Presentación (RN-PRE)

- **RN-PRE-01**: Los estilos viven en **archivos externos** al HTML, nunca inline.
- **RN-PRE-02**: Los **elementos equivalentes reutilizan las mismas clases**.
- **RN-PRE-03**: La interfaz se comprueba a **320 px** y a **1280 px**: los textos y controles son legibles y **el contenido no provoca desplazamiento horizontal de toda la página**.
- **RN-PRE-04**: Si una tabla necesita más espacio, **se desplaza dentro de su propio contenedor**.
- **RN-PRE-05**: Los controles **conservan un foco visible** y **se recorren con el teclado**.
- **RN-PRE-06**: Los mensajes de error **se expresan con texto** y **no dependen únicamente de un color**.
- **RN-PRE-07**: Las **imágenes informativas** tienen texto alternativo; las decorativas no repiten información innecesaria. *(Vacuo en este proyecto: cero imágenes.)*

## Excepciones globales

- **RN-GL-01**: El proyecto usa **únicamente HTML, CSS y JavaScript nativos**. El uso de librerías o frameworks **incumple el alcance técnico** y se informa en la evaluación.
- **RN-GL-02**: **Cero URLs externas**: todo recurso va incluido en el proyecto y la aplicación funciona sin conexión.
- **RN-GL-03**: La aplicación se abre **directamente con `file://`**, sin servidor ni paso de build.
- **RN-GL-04**: Las validaciones **sirven para la práctica**; no representan seguridad ni integridad garantizada por un servidor.
- **RN-GL-05**: Los datos son **ficticios** y la venta **no gestiona stock, cobros ni facturación fiscal**.
