# presentacion-css Specification

## Purpose
Definir la presentación del frontend: una identidad visual propia y coherente con tokens como única fuente de valores, una composición adaptable entre 320 px y 1280 px sin desplazamiento horizontal del documento, foco visible en todo el recorrido de teclado y contraste AA en los pares de color en uso.

## Requirements

### Requirement: Identidad visual en CSS externo y modular
El sistema DEBE definir color, tipografía, espaciado, tarjetas, formularios, botones, tablas y mensajes en archivos CSS externos, declarando todos sus valores como *custom properties* en `:root` y reutilizando clases para elementos equivalentes.

#### Scenario: Los estilos viven fuera del HTML
- **WHEN** se inspecciona `index.html`
- **THEN** no hay atributos `style=` ni etiquetas `<style>`, y el único enlace de estilos apunta a `css/styles.css`

#### Scenario: El sistema de estilos está modularizado en tres capas
- **WHEN** se listan los archivos de `css/`
- **THEN** existen `base.css` (tokens, reset y tipografía), `layout.css` (estructura de página) y `componentes.css` (componentes, foco, responsive y movimiento reducido), importados en ese orden desde `styles.css`

#### Scenario: Los tokens son la única fuente de valores
- **WHEN** se lee `css/base.css`
- **THEN** el bloque `:root` declara 38 tokens y cada hexadecimal de la paleta aparece una sola vez en todo el CSS

#### Scenario: Los elementos equivalentes comparten clase
- **WHEN** se cruzan las clases del CSS con las del HTML
- **THEN** la única clase del CSS que no existe en el HTML es la reservada `.boton--secundario`, declarada para el render del Ejercicio 5

### Requirement: Composición adaptable de 320 px a 1280 px
La interfaz DEBE organizarse con Flexbox o Grid, ser legible a 320 px y a 1280 px, y **NO** provocar desplazamiento horizontal del documento.

#### Scenario: Sin scroll horizontal de la página
- **WHEN** se mide `document.documentElement.scrollWidth` frente a `clientWidth` a 320, 768 y 1280 px
- **THEN** `scrollWidth` es menor o igual que `clientWidth` en los tres anchos

#### Scenario: Las tablas anchas se desplazan dentro de su contenedor
- **WHEN** una tabla no entra en su `.tabla-contenedor`
- **THEN** el contenedor tiene `scrollWidth` mayor que `clientWidth` y el documento no scrollea en horizontal

#### Scenario: La composición es mobile-first
- **WHEN** se revisan las media queries del CSS
- **THEN** todas usan `min-width` y ninguna usa `max-width`

### Requirement: Foco visible en todo el recorrido de teclado
Los controles DEBEN conservar un foco visible con contraste suficiente y ser alcanzables y operables con el teclado, incluidos los contenedores con `tabindex`.

#### Scenario: El recorrido completo muestra el anillo
- **WHEN** se recorren las 26 paradas de foco con la tecla Tab
- **THEN** todas muestran un anillo sólido de 2 px del color `--color-foco`, y los contenedores de tabla lo muestran hacia adentro con `outline-offset: -3px`

#### Scenario: El foco no queda atrapado
- **WHEN** se avanza más allá de la última parada
- **THEN** el foco sale del documento y vuelve al inicio

#### Scenario: La navegación se opera con Enter
- **WHEN** se enfoca un enlace del `<nav>` y se pulsa Enter
- **THEN** `location.hash` cambia a la vista destino

### Requirement: Mensajes de estado comprensibles sin depender del color
Los mensajes de error y de estado DEBEN expresarse con texto y DEBEN combinar al menos dos señales (color y glifo), de modo que el significado no dependa únicamente del color.

#### Scenario: El atributo hidden se respeta
- **WHEN** se cargan los 10 contenedores de mensaje
- **THEN** los 7 que llevan `hidden` tienen `display: none` y los 3 visibles se muestran con su texto

#### Scenario: Cada estado tiene color y glifo
- **WHEN** se lee el `::before` de cada mensaje
- **THEN** el estado de éxito usa `✓`, el de error `✕` y el de vacío `ℹ`, sobre un color de estado propio

#### Scenario: El texto del HTML es el portador del significado
- **WHEN** se lee el texto de un mensaje de error
- **THEN** describe el resultado sin necesidad de interpretar el color

### Requirement: Contraste AA de los pares de color en uso
Los pares de color que llevan texto o información de interfaz DEBEN alcanzar 4,5:1 (texto normal) o 3:1 (elementos de interfaz), según la WCAG 2.1.

#### Scenario: Los pares en uso cumplen el umbral
- **WHEN** se calculan los ratios de los pares de la paleta
- **THEN** el texto principal da 13,59:1 sobre el fondo, el acento 5,82:1 sobre la superficie, el foco 6,13:1 sobre el fondo y los colores de estado por encima de 4,5:1 sobre su superficie

#### Scenario: Los pares que no alcanzan el umbral no se usan en texto
- **WHEN** se busca un uso de `--color-acento` sobre `--color-acento-suave` o de `--color-borde-fuerte` como borde de control
- **THEN** no existe: el texto de los enlaces se apoya sobre `--color-superficie-alt` y los bordes de control usan `--color-texto-suave`
