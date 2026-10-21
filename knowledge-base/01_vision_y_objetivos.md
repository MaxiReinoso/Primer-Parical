# Visión y Objetivos

## Propósito del sistema

**Librería El Estante** es el frontend de un sistema de gestión de una librería: presenta el catálogo de libros y registra libros, clientes y ventas. Es un parcial académico de Programación III (100 puntos) que desarrolla **exclusivamente el frontend**: los datos y las operaciones se simulan en el navegador, sin servidor, sin base de datos y sin conexión a internet.

El sistema se entrega como una carpeta con `index.html` como entrada, que se abre con doble clic y funciona sin build, sin `npm` y sin dependencias.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| Lector / visitante | Consultar el catálogo de libros y simular el registro de libros, clientes y ventas | Filtrar por título, consultar el historial de ventas y el detalle de cada una |
| Alumno / equipo de desarrollo | Construir y demostrar las 6 etapas del parcial | Cumplir los criterios de evaluación de cada ejercicio y documentar la verificación |
| Docente | Evaluar el frontend contra los criterios de la consigna | Verificar que no se usan librerías, frameworks, CDNs, API ni servidor |

No existe autenticación ni roles de producto: **la consigna lo excluye explícitamente** ("No se requiere un inicio de sesión real"). Los "actores" del equipo de desarrollo se reparten los 6 ejercicios.

## Alcance v1.0 (parcial completo, 100 puntos)

- **Ejercicio 1 — Estructura y pantallas HTML (20 pts):** 5 vistas (Catálogo, Libros, Clientes, Ventas, Historial) en un único `index.html`, con navegación por anclas, HTML semántico, formularios con `label` asociado, tablas con encabezados y contenedores de mensaje.
- **Ejercicio 2 — Presentación con CSS y uso adaptable (20 pts):** identidad visual propia en CSS externo y modular (base / layout / componentes), composición adaptable de 320 px a 1280 px con Flexbox y Grid, foco visible en todo el recorrido de teclado y contraste AA verificado.
- **Ejercicio 3 — Datos locales, catálogo y filtro (15 pts):** arrays y objetos con identificadores estables (mínimo 6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes), render del catálogo desde los datos y filtro por título que ignora mayúsculas, busca coincidencias parciales y recorta espacios sobrantes.
- **Ejercicio 4 — Alta de libros y clientes (15 pts):** formularios de alta con opciones generadas desde los datos locales, validaciones, `preventDefault`, errores junto al formulario y actualización sin recargar la página.
- **Ejercicio 5 — Venta simulada e historial (20 pts):** composición de renglones, cálculo de subtotales y total con dos decimales, confirmación de la venta con precio unitario histórico e historial consultable con su detalle.
- **Ejercicio 6 — Persistencia, verificación y documentación (10 pts):** `localStorage` para libros, clientes y ventas, README con los casos manuales ejecutados y sus resultados reales.

## Fuera de alcance

- Backend, API, base de datos, servidor o conexión con el sistema de producción.
- Autenticación, autorización, roles de usuario y sesiones.
- Gestión de stock, cobros, facturación fiscal yamed abstracto de pagos.
- Librerías, frameworks, CDNs, preprocessores de CSS, empaquetadores y `npm`.
- Compilación, transpilación y *type-checking*.
- Administración de altas, bajas y modificaciones de **editorales, géneros y autores** (la consigna lo excluye explícitamente).
- Editar o eliminar ventas confirmadas.
- Dígito de control del ISBN.

## Métricas de éxito

El éxito se mide contra los criterios de la consigna, no contra métricas de producto: no hay usuarios reales ni datos reales.

| Ejercicio | Puntaje | Criterio medible |
|---|---|---|
| 1 — HTML | 20 | Vistas y navegación 10 · semántica, formularios y estados 10 |
| 2 — CSS | 20 | Coherencia y organización 8 · adaptación 8 · accesibilidad básica 4 |
| 3 — Datos y catálogo | 15 | Modelo y ejemplos 5 · renderizado 5 · filtro y estados 5 |
| 4 — Altas | 15 | Libros y selectores 6 · clientes 4 · validación y actualización 5 |
| 5 — Ventas | 20 | Composición y validaciones 8 · cálculos 5 · confirmación e historial inmutable 7 |
| 6 — Cierre | 10 | Persistencia 4 · pruebas manuales registradas 3 · documentación y entrega 3 |

Indicadores transversales de la consigna: apertura directa por `file://` sin conexión; cero URLs externas; los listados y el historial conectados con los datos locales; y los datos escritos por el usuario insertados **como texto** en el DOM.
