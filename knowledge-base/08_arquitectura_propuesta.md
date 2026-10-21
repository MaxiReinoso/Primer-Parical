# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| **SPA de una página con secciones** | Las 5 vistas son `<section class="vista">` dentro de un `<main>` | Los enlaces-ancla funcionan sin JS, el HTML queda en un único archivo aprobado y las actualizaciones tras un alta occuren sin recargar |
| **Separación estricta estructura / estilos / comportamiento** | `index.html` · `css/` · `js/app.js` | La consigna lo exige: *"Se valora código legible... y separación entre estructura, estilos y comportamiento"* |
| **Tokens de diseño (`custom properties`)** | `:root` con 38 variables | Una sola fuente de valores: cambiar la identidad visual no toca reglas, y el contraste se puede auditar en un solo lugar |
| **CSS modular en capas** | `base.css` → `layout.css` → `componentes.css`, importados por `styles.css` | Cada archivo es legible por separado; el orden de carga define la cascada |
| **BEM en español** | `.libro__titulo`, `.boton--quitar`, `.fila-renglon__acciones` | Nombres autodescriptivos que Allow-Override en las convenciones del proyecto |
| **Plantillas HTML5 (`<template>`)** | `#plantilla-libro`, `#plantilla-renglon` | El molde del render vive en el HTML, inerte; el JS lo clona. Cero datos de ejemplo en el markup |
| **Hook de estado por atributo** | `hidden` en los 7 mensajes ocultos | El HTML declara el estado inicial; el JS solo alterna el atributo. El CSS debe respetarlo (`.mensaje[hidden]`) |
| **Contenedor con scroll propio** | `.tabla-contenedor` con `overflow-x: auto` | La tabla ancha se desplaza dentro de su bloque y el documento no scrollea en horizontal |
| **Verificación en tres capas sin framework de tests** | Controles de solo lectura + navegador real + registro de evidencia | El proyecto **no tiene** framework de tests; la consigna pide casos manuales reproducibles, no una suite |

## Estructura de directorios

```
Primer-Parical/
├── index.html                  # entrada única: 5 vistas + 2 plantillas
├── css/
│   ├── styles.css              # punto de entrada: 3 @import, sin reglas
│   ├── base.css                # :root (38 tokens), reset, tipografía
│   ├── layout.css              # encabezado, navegación, contenido, vistas, pie
│   └── componentes.css         # formularios, botones, mensajes, tablas, foco, responsive
├── js/
│   └── app.js                  # toda la lógica (Ejercicios 3–6)
├── docs/                       # resumen de implementación por ejercicio
├── knowledge-base/             # esta base de conocimiento
├── openspec/
│   ├── config.yaml
│   ├── changes/                # un change por ejercicio
│   │   └── archive/
│   └── specs/                  # specs por capacidad, ya archivadas
├── CHANGES.md                  # roadmap e índice de cambios
├── AGENTS.md                   # instrucciones del proyecto para los agentes
└── Consigna Primer Parcial.pdf
```

## Seguridad

- **Autenticación:** ninguna. No hay login, sesiones ni credenciales — la consigna lo excluye.
- **Autorización:** ninguna. Todo el contenido es público por diseño.
- **Validación de input:** en el cliente y con fines **pedagógicos**. La consigna lo dice: *"Las validaciones y el almacenamiento del navegador sirven para la práctica; no representan seguridad ni integridad garantizada por un servidor"*.
- **Inserción en el DOM:** los datos escritos por el usuario se insertan **como texto** (`textContent` / `createTextNode`), nunca como HTML interpretable (RN-CAT-08).
- **Secretos:** el proyecto no maneja secretos, tokens ni credenciales. `localStorage` guarda únicamente los datos ficticios del parcial.
- **Dependencias:** cero. No hay superficie de ataque de terceros.

## Variables de entorno

**Ninguna.** El proyecto no lee variables de entorno, no usa `.env` y no tiene configuración por entorno: se abre con `file://` y funciona siempre igual.

| Variable | Descripción | Ejemplo | Sensible |
|---|---|---|---|
| — | — | — | — |

La única "configuración" es la clave de `localStorage` que el Ejercicio 6 defina, que es un detalle de implementación y no una variable de entorno.

## Convenciones de verificación

No hay framework de tests. La verificación del proyecto se compone de:

1. **Controles automatizables de solo lectura** sobre el HTML, el CSS y el JS, ejecutados con scripts en la carpeta temporal del sistema (el proyecto no incluye herramientas de verificación).
2. **Comprobación real en navegador** (Edge headless) a 320 px, 768 px y 1280 px, sobre una **copia temporal** del proyecto: nunca se modifica el producto para medir.
3. **Registro de evidencia** por control, con estado ∈ {aprobado, fallido, omitido, pendiente} y su motivo. Ningún control no ejecutado se presenta como aprobado.

> **Trampa conocida de la verificación headless:** Edge impone un ancho mínimo de ventana de 492 px, así que `--window-size=320,800` **no** produce un viewport de 320 px. El viewport exacto se obtiene con un arnés de `<iframe>` (ver `docs/ejercicio2-implementacion-resumen.md` §2.3).
