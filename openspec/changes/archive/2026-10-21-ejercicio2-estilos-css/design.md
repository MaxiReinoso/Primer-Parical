# Design

## Contexto

La consigna del Ejercicio 2 pide identidad visual, Flexbox/Grid, adaptabilidad de 320 a 1280 px, foco visible y contraste AA. `index.html` viene aprobado del Ejercicio 1 y **no se modifica**: toda la presentación tiene que expresarse con las 38 clases que ya están en el markup.

## Decision 1 — CSS modular en tres capas, con `@import` y no varios `<link>`

**Contexto**: el criterio de evaluación habla de "estilos estructurados en archivos externos (**base, layout, componentes**)", y la consigna pide "el CSS se mantiene en archivos externos" y una entrega con "carpetas de CSS".

**Alternativas**:
| Opción | A favor | En contra |
|---|---|---|
| Un único `styles.css` con las capas como secciones | Simple, un solo archivo | No coincide con la lectura literal de "archivos externos (base, layout, componentes)" |
| 3 `<link>` en `index.html` | Es la forma idiomática; sin cadena de `@import` | **Modifica `index.html`**, que está aprobado y congelado |
| **`@import` desde el punto de entrada** | Las 3 capas como archivos, un solo `<link>`, `index.html` intacto | Encadena las peticiones en serie (irrelevante a esta escala) |

**Decisión**: `@import` desde `styles.css`.

**Consecuencia medida**: las hojas importadas no aparecen como entradas de primer nivel de `document.styleSheets` sobre `file://` (cada URL es un origen opaco distinto en Chromium). Para leerlas hay que servir la copia por `http://127.0.0.1` y recorrer `CSSImportRule.styleSheet.cssRules`.

## Decision 2 — Tokens como única fuente de valores

Los 38 tokens viven en `:root` dentro de `base.css`. Ningún color, tipografía, espaciado, radio o sombra se repite fuera de `:root`, salvo el `#ffffff` del texto de botón y los tres derivados por `color-mix`.

Esto no es solo estética: **hace auditable el contraste**. Los 21 pares de la paleta se calculan contra un solo lugar, y dos de ellosturned no alcanzan el umbral — lo que se resuelve con el mapeo de uso, no con la paleta.

## Decision 3 — Mapeo de uso de la paleta por contraste

Dos pares de la paleta **no** alcanzan el umbral si se usan en su lugar habitual:

| Par | Ratio | Resolución |
|---|---|---|
| `--color-acento` sobre `--color-acento-suave` | 4,47:1 (< 4,5:1) | El texto de los enlaces nunca se apoya sobre ese tinte: el hover de `.nav-enlace` usa `--color-superficie-alt` (4,78:1). |
| `--color-borde-fuerte` sobre `--color-superficie` | 2,26:1 (< 3:1 de 1.4.11) | Los bordes que **identifican un control** usan `--color-texto-suave` (7,33:1). `--color-borde` y `--color-borde-fuerte` quedan como separadores decorativos. |

**La paleta no se modifica**: la consigna evalúa "contraste de colores AA verificado", y cambiar los colores alteraría la identidad visual ya resuelta. Se corrige el uso.

## Decision 4 — Las 5 vistas como paneles de superficie

Con la decisión P1 (vistas apiladas, resuelta por el usuario), cada `.vista` es un panel con fondo `--color-superficie`, borde `--color-borde`, radio `--radio-3` y `--sombra-1`, separado de la anterior por el `gap` de `.contenido`. El título de la vista (`h2`) abre el panel con un filete que lo delimita.

**Alternativa descartada**: marcar la vista activa en la navegación. En CSS puro exige `body:has(#catalogo:target) .nav-enlace[href="#catalogo"]`, o sea **selectores por `id` usados para estilo**, lo que contradice el criterio "no hay selectores por `id` usados para estilo". Queda para el Ejercicio 3, donde el JS puede resolverlo sin selectores por `id`.

## Decision 5 — El `thead` no lleva `position: sticky`

`.tabla-contenedor` no tiene `max-block-size`, así que no hay scroll vertical y el `sticky` sería un efecto nulo. Además, con `border-collapse: collapse` el filete colapsado no acompaña al `th` en Chrome. Cuando el historial tenga muchas filas (Ejercicio 5), se puede acotar la altura y activarlo.

## Decision 6 — Verificación en tres capas, sin framework de tests

El proyecto no tiene `package.json`, `pytest.ini` ni runner, y la consigna no los pide: pide "casos manuales reproducibles" registrados en el README. La verificación se compone de:

1. **Controles automatizables de solo lectura** (scripts en la carpeta temporal del sistema; el proyecto **no** incluye herramientas).
2. **Comprobación real en navegador** a 320, 768 y 1280 px, sobre una **copia temporal**: nunca se modifica el producto para medir.
3. **Registro de evidencia** por control, con estado ∈ {aprobado, fallido, omitido, pendiente}.

### Trampas de la medición (resueltas)

| Trampa | Qué pasa | Cómo se resolvió |
|---|---|---|
| Ancho mínimo de ventana | `--window-size=320,800` devuelve `innerWidth` = **492**, no 320. Probados `--headless=new`, `--headless=old`, `--force-device-scale-factor=1` y `--hide-scrollbars`: los cuatro igual. | Arnés de `<iframe>` de 320 px: dentro, `innerWidth` vale 320 exacto y las media queries se evalúan contra ese ancho. |
| `<pre>` inyectado en la página medida | `white-space: pre` con líneas largas ensancha el documento: `scrollWidth` 2085 px con él, 305 px sin él, con CSS **idéntico**. | El script de medición reporta por `postMessage` y no inyecta nada en la página medida. |
| CSSOM sobre `file://` | `document.styleSheets[0].cssRules` está bloqueado por la política de origen único. | Servir la copia por `http://127.0.0.1` y recorrer `CSSImportRule.styleSheet.cssRules`. |

## Riesgos

- **Bajo**: `@import` encadena 3 peticiones en serie. A esta escala (17 KB) es irrelevante, pero en un proyecto grande conviene migrar a `<link>`.
- **Bajo**: las hojas importadas no son enumerables desde JS sobre `file://` (§Decision 1). No afecta a la aplicación.
- **Ninguno abierto** sobre el comportamiento: el render medido a 320, 768 y 1280 px es idéntico al de la versión de un solo archivo (verificado: 68 reglas ↔ 68 reglas con las mismas condiciones de `@media`).
