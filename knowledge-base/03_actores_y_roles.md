# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| **Lector / visitante** | Usuario final del sistema: consulta el catálogo y simula las operaciones de la librería | Es el único actor del **producto**. No hay registro, ni login, ni roles: todo lo que hay en pantalla está disponible para quien abra la página. |
| **Alumno / equipo de desarrollo** | Quien construye y evalúa el frontend | Escribe el HTML, el CSS y el JavaScript de los 6 ejercicios, y documenta el resultado en `docs/`. |
| **Docente** | Quien evalúa contra los criterios de la consigna | Abre `index.html`, revisa el código, ejecuta los casos manuales y lee el README. No interactúa con el sistema en runtime. |

**No hay actor autenticado.** La consigna lo establece: *"No se requiere un inicio de sesión real"* y *"Tampoco se requiere un inicio de sesión"*. Los datos son ficticios y las validaciones "sirven para la práctica; no representan seguridad ni integridad garantizada por un servidor".

## RBAC — Matriz de permisos

El control de acceso es **inexistente por diseño**, así que no hay matriz de permisos que mantener. Lo que sí existe es un reparto de **responsabilidad de trabajo** entre las personas del equipo: cada ejercicio es un change independiente en OpenSpec y cada persona ejecuta la fase `apply` del suyo.

| Ejercicio | Change OpenSpec | Quién lo ejecuta | Puede tocar |
|---|---|---|---|
| 1 — Estructura y pantallas HTML | `ejercicio1-estructura-html` | *(ya implementado)* | `index.html` |
| 2 — Presentación con CSS | `ejercicio2-estilos-css` | *(ya implementado)* | `css/` |
| 3 — Datos locales, catálogo y filtro | `ejercicio3-datos-catalogo-filtro` | a definir | `js/app.js` |
| 4 — Alta de libros y clientes | `ejercicio4-altas-libros-clientes` | a definir | `js/app.js` |
| 5 — Venta simulada e historial | `ejercicio5-venta-historial` | a definir | `js/app.js` |
| 6 — Persistencia, verificación y documentación | `ejercicio6-persistencia-documentacion` | a definir | `js/app.js`, `README.md` |

Regla de convivencia entre ejercicios, derivada de la separación de responsabilidades de la consigna:

- Los ejercicios **3, 4, 5 y 6** tocan `js/app.js` y, salvo el 6, no tocan el HTML ni el CSS.
- El **Ejercicio 1** es la única fuente de verdad del HTML: los ejercicios siguientes lo consumen, no lo modifican.
- El **Ejercicio 2** es la única fuente de verdad del CSS: los ejercicios siguientes agregan estilos nuevos, no redefinen los existentes.

## Rutas públicas

| Ruta | Acceso | Contenido |
|---|---|---|
| `index.html` | **Pública** (todo el sistema) | Las 5 vistas, con anclas `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial` |

No hay rutas privadas, ni áreas de administración, ni redirecciones. El proyecto tiene **una sola página** y todo su contenido es público por diseño.
