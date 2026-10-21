# Design

## Contexto

La consigna del Ejercicio 1 permite "varias páginas o secciones de una misma página". La decisión de arquitectura quedó abierta en el plan de esta fase y la resolvió el usuario: **Opción A, SPA con secciones**.

## Decision 1 — SPA de una página y no multipágina

**Contexto**: la consigna acepta ambas. La opción multipágina obligaría a duplicar encabezado y navegación en 5 archivos, y a resolver el paso de datos entre páginas para que un alta actualice el catálogo.

**Decisión**: un único `index.html` con las 5 vistas como `<section class="vista">` y el `<nav>` con enlaces-ancla `href="#id"`.

**Consecuencias**:
- Los enlaces-ancla funcionan **sin JavaScript**: la navegación es operativa desde la primera carga.
- `index.html` queda como única fuente de verdad del markup, y los ejercicios 3 a 6 lo consumen sin modificarlo.
- El mostrado exclusivo de una vista (una a la vez) queda **fuera de alcance**: con la Opción A las 5 vistas se apilan. Se evalúa en el Ejercicio 2 y se resolvió como "apiladas" (ver `docs/ejercicio2-spec.md` §9.3, decisión P1).

## Decision 2 — Anclas y convención de nombres

Se usa el patrón `id` en kebab-case con prefijo de entidad: `form-libro`, `libro-titulo`, `tabla-libros`, `tabla-libros-cuerpo`, `libro-mensaje-exito`. Los `name` de los campos repiten solo el segmento del campo dentro de su formulario (`name="titulo"`, `name="email"`).

Los `id` de las vistas coinciden con los que nombra la propia consigna (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`).

## Decision 3 — Plantillas HTML5 en lugar de datos de ejemplo

El molde de la tarjeta de libro y el de la fila de renglón viven en `<template>`, que es HTML5 estándar y **inerto**: no se renderiza. Esto evita hardcodear libros o clientes ficticios en el markup, y deja el render del Ejercicio 3 y del Ejercicio 5 con un molde declarado en el HTML.

## Decision 4 — Placeholders de CSS y JS

`css/styles.css` y `js/app.js` se crean con un comentario de encabezado y cero código, para que los enlaces del `index.html` no den 404 al abrir el proyecto con `file://`. Los estilos llegan en el Ejercicio 2 y la lógica en los Ejercicios 3 a 6.

## Alternativas descartadas

| Alternativa | Por qué se descartó |
|---|---|
| 5 archivos `.html` | Duplica header y nav; complica la actualización cruzada entre vistas; la navegación no sería funcional sin JS |
| Datos de ejemplo hardcodeados en las tablas | La consigna pide que el JavaScript genere el catálogo desde los datos locales; meter filas fijas las haría inconsistentes |
| `required` / `pattern` en los campos | El JavaScript del Ejercicio 4 implementa su propia validación con mensajes propios; duplicar la validación nativa daría dos fuentes de verdad |

## Riesgos

- **Bajo**: el acoplamiento de `index.html` con el JS de los ejercicios siguientes se controla por la convención de `id` documentada en `docs/ejercicio1-spec.md` §5.3.
- **Ninguno abierto**: el HTML es estático y no tiene dependencias.
