# Casos Manuales y Verificación

> **Extra (12).** Complementa los 10 archivos canónicos: no los reemplaza.

## Casos manuales exigidos por la consigna (pág. 5)

Estos casos deben ejecutarse y **registrarse con su resultado observado** en el README del Ejercicio 6. No se indica una prueba como aprobada sin ejecutarla.

| Caso | Resultado esperado |
|---|---|
| Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados |
| Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta |
| Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección |
| Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón |
| Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial |
| Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba del proyecto | Al consultar nuevamente el historial después de recargar, el precio unitario, los subtotales y el total de esa venta conservan los valores confirmados |
| Recarga después de altas y venta | Se recuperan datos sin duplicar ejemplos ni ventas |
| Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita |

## Comprobación guiada del precio histórico

La consigna la describe paso a paso y la realiza el docente en una **copia de prueba** del proyecto, con datos de prueba:

1. Confirmar una venta y **anotar sus importes**.
2. Con las herramientas de almacenamiento del navegador, **modificar únicamente el precio** del libro dentro del catálogo guardado en `localStorage`, **sin modificar ni borrar** las ventas guardadas.
3. Recargar la página.
4. Consultar el detalle de la venta anterior.

**La ubicación y la estructura del catálogo guardado deben identificarse en el README** para reproducir esta comprobación.

## Verificación del Ejercicio 2 — controles ya ejecutados

El Ejercicio 2 está implementado y verificado. El detalle completo está en `docs/ejercicio2-implementacion-resumen.md`; el resumen:

| Capa | Controles | Estado |
|---|---|---|
| (a) Controles objetivos de solo lectura | 56 | APROBADOS |
| (b) Navegador real a 320 / 768 / 1280 px | 16 | APROBADOS |
| Suplementarios (sticky, pie al pie, movimiento reducido, fieldset, output, botón) | 8 | APROBADOS |
| Contraste renderizado (8 pares sobre colores computados reales) | 8 | APROBADOS |
| Cierre T-14: teclado con `Tab` real + lectura del CSSOM | 2 | APROBADOS |
| Modularización T-15: equivalencia de reglas + render en 3 anchos | 7 | APROBADOS |
| **Revisión visual de las capturas a 320 y 1280 px** | 2 | APROBADOS |
| Segundo motor de renderizado | 1 | **OMITIDO** — solo hay Edge headless instalado; no se instala software fuera del alcance aprobado |
| Apariencia de tablas y tarjetas **con contenido real** | 1 | **PENDIENTE POR ALCANCE** — depende de los Ej. 3–5 |

### Trampas de la verificación en navegador (leídas antes de medir)

1. **Edge headless impone un ancho mínimo de ventana de 492 px.** `--window-size=320,800` devuelve `innerWidth = 492`, no 320. Con cualquiera de las variantes probadas (`--headless=new`, `--headless=old`, `--force-device-scale-factor=1`, `--hide-scrollbars`) el resultado es el mismo. El viewport de 320 px se obtiene con un **arnés de `<iframe>`**.
2. **El script de medición no puede inyectar un `<pre>`** en la página medida: `white-space: pre` con líneas largas ensancha el documento y produce un `scrollWidth` falso (2085 px con el `<pre>`, 305 px sin él, con CSS idéntico). El reporte va por `postMessage`.
3. **Sobre `file://`, las hojas importadas por `@import` no aparecen** como entradas de primer nivel de `document.styleSheets`. Para leerlas hay que servir la copia por `http://127.0.0.1` y recorrer `CSSImportRule.styleSheet.cssRules`.

## Controles de solo lectura del proyecto (qué se verifica y cómo)

| Objetivo | Cómo se comprueba |
|---|---|
| Cero CSS inline y cero `<style>` | Búsqueda de `style=` y `<style>` en `index.html` |
| Cero URLs externas | Búsqueda de `http://`, `https://` y `//` en el HTML y en el CSS |
| Cero selectores por `id` usados para estilo | Búsqueda de `#identificador` en el CSS, excluyendo colores hexadecimales |
| `!important` solo donde está justificado | Todas las coincidencias dentro del bloque `prefers-reduced-motion` |
| Tokens como única fuente de valores | Conteo de declaraciones en `:root` y de cada hexadecimal de la paleta |
| Reglas clave presentes | `:focus-visible`, `.mensaje[hidden]`, `.tabla-contenedor { overflow-x: auto }`, `box-sizing: border-box`, `min-inline-size: 0`, `clamp(`, `minmax(` |
| Sin `display: flex` sobre `td` | Búsqueda de un selector `td` con `display: flex` |
| Sin desplazamiento horizontal de la página | `documentElement.scrollWidth <= clientWidth` a 320 / 768 / 1280 px |
| Foco visible en todo el recorrido | `Tab` real vía Chrome DevTools Protocol: 26/26 paradas con anillo `--color-foco` |

## Estado de los ejercicios

| Ejercicio | Estado | Dónde está el detalle |
|---|---|---|
| 1 — HTML | **Implementado y verificado** | `docs/ejercicio1-implementacion-resumen.md` + change archivado `ejercicio1-estructura-html` (spec, plan y resumen) |
| 2 — CSS | **Implementado y verificado** | `docs/ejercicio2-implementacion-resumen.md` + change archivado `ejercicio2-estilos-css` (spec, plan y resumen) |
| 3 — Datos, catálogo y filtro | Pendiente | change `ejercicio3-datos-catalogo-filtro` |
| 4 — Altas | Pendiente | change `ejercicio4-altas-libros-clientes` |
| 5 — Venta e historial | Pendiente | change `ejercicio5-venta-historial` |
| 6 — Persistencia y documentación | Pendiente | change `ejercicio6-persistencia-documentacion` |
