# Descripción General

## Stack tecnológico

| Capa | Tecnología | Versión mínima | Restricción de la consigna |
|---|---|---|---|
| Estructura | HTML5 semántico | HTML5 (navegadores modernos) | Sin frameworks ni templadores |
| Presentación | CSS3 | Flexbox, Grid, custom properties, `clamp()`, `minmax()`, `:focus-visible`, `color-mix()` | **Cero** librerías, frameworks, CDNs, preprocesadores y `url()` externas |
| Comportamiento | JavaScript nativo (ES6+) | Arrays, objetos, módulos o script clásico con `defer`, eventos, DOM, `localStorage` | Sin frameworks, sin `fetch`, sin bundler |
| Persistencia | `localStorage` del navegador | API estándar | Solo en el navegador; depende del perfil y de la ubicación de apertura |
| Entorno | Apertura directa `file://` | — | El README debe explicar cómo abrirlo sin `npm` |
| Versionado | Git | — | Rama `main`; commits con convención `feat:`/`docs:` |

**Sin dependencias de terceros, sin `package.json`, sin paso de build.** El proyecto se entrega y se ejecuta tal cual.

## Arquitectura general

Aplicación de una sola página con navegación por anclas. Las 5 vistas son secciones (`<section class="vista">`) dentro de un `<main>`, y el `<nav>` enlaza a cada una con `href="#id"`.

```
┌──────────────────────────────────────────────────────────┐
│ <header class="encabezado">  título de la librería        │
├──────────────────────────────────────────────────────────┤
│ <nav class="navegacion">  5 enlaces-ancla (sticky)       │
├──────────────────────────────────────────────────────────┤
│ <main class="contenido">                                │
│   <section class="vista" id="catalogo">  buscador + grilla│
│   <section class="vista" id="libros">    alta + tabla     │
│   <section class="vista" id="clientes">  alta + tabla     │
│   <section class="vista" id="ventas">    renglones + total│
│   <section class="vista" id="historial"> ventas + detalle │
│   <template id="plantilla-libro">   <template id="plantilla-renglon"> │
└──────────────────────────────────────────────────────────┘
│ <footer class="pie">  datos ficticios, sin servidor      │
└──────────────────────────────────────────────────────────┘
```

Decisiones de alto nivel que explican esta forma:

- **SPA de una página y no multipágina**: los enlaces-ancla funcionan sin JavaScript, el `index.html` queda aprobado y congelado, y los listados que se actualizan tras un alta viven en la misma vista que el formulario que los dispara.
- **Separación estricta estructura / estilos / comportamiento**: `index.html` no lleva estilos ni scripts inline; `css/` lleva todo el CSS; `js/app.js` lleva toda la lógica.
- **Plantillas `<template>` HTML5**: el molde del render de la tarjeta de libro y de la fila de renglón vive en el HTML, inerte, y el JavaScript lo clona. Ningún dato de ejemplo se escribe en el markup.
- **CSS modular en tres capas** (`base` / `layout` / `componentes`) con un punto de entrada que las importa: el orden de carga define la cascada y cada archivo es legible por separado.
- **Tokens como única fuente de valores**: los 38 `custom properties` de `:root` concentran color, tipografía, espaciado, radios y sombras.

## Integraciones externas

| Servicio | Propósito | Tipo |
|---|---|---|
| — | **Ninguna** | — |

La consigna lo dice sin ambigüedad: *"No se requiere API, base de datos, servidor ni conexión con el backend"*. Todo ocurre en el navegador.

## API REST

**No aplica.** El proyecto no expone ni consume endpoints. La única frontera de datos es `localStorage`, que se usa en el Ejercicio 6 para conservar libros, clientes y ventas entre recargas.

## Estructura de archivos del proyecto

```
Primer-Parical/
├── index.html                      # entrada única, 5 vistas, 2 plantillas
├── css/
│   ├── styles.css                  # punto de entrada: 3 @import
│   ├── base.css                    # tokens, reset, tipografía
│   ├── layout.css                  # estructura de página y composición adaptable
│   └── componentes.css             # componentes, foco, responsive, movimiento reducido
├── js/
│   └── app.js                      # lógica (placeholder en el estado actual)
├── docs/                           # spec / plan / resumen por ejercicio
├── knowledge-base/                 # base de conocimiento del proyecto
├── openspec/                       # cambios y specs por capacidad
├── CHANGES.md                      # roadmap de cambios
├── AGENTS.md                       # instrucciones del proyecto para los agentes
└── Consigna Primer Parcial.pdf     # enunciado de la consigna
```
