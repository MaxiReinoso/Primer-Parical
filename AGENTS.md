# Librería El Estante — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Estructura | HTML5 semántico (etiquetas `header`/`nav`/`main`/`section`/`footer`, `<template>`) | HTML5 |
| Presentación | CSS3 (custom properties, Flexbox, Grid, `clamp()`, `minmax()`, `:focus-visible`, `color-mix()`) | CSS3, navegadores modernos |
| Comportamiento | JavaScript nativo (ES6+: arrays, objetos, eventos, DOM, `localStorage`) | ES6+ |
| Persistencia | `localStorage` del navegador | API estándar |
| Entorno | Apertura directa `file://`, sin build, sin `npm`, sin servidor | — |
| Versionado | Git, rama `main`, commits `feat:` / `docs:` | — |

**Restricción dominante: cero dependencias.** Sin frameworks, sin backend, sin base de datos, sin CDN, sin preprocesadores, sin `package.json`. La consigna prohíbe las librerías: usarlas incumple el alcance técnico.

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, alcance y puntos de los 6 ejercicios |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, arquitectura de la SPA, estructura de archivos |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores y **reparto de responsabilidades por ejercicio** |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, relaciones, constraints y seed data mínimo |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas `RN-{DOMINIO}-{NN}` |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica, con criterios de aceptación |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E y **estado actual** de cada uno |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura, seguridad, convenciones de verificación |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones `DD-xx` y supuestos `SU-xx` con su fundamento |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias y preguntas a resolver ANTES de codear |
| [11_criterios_evaluacion.md](knowledge-base/11_criterios_evaluacion.md) | Enunciado literal de los 6 ejercicios y reparto de puntos |
| [12_casos_manuales.md](knowledge-base/12_casos_manuales.md) | Casos manuales exigidos y trampas de la verificación headless |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` antes de arrancar el primer change.

---

## Skills Disponibles

Fuente de verdad: `.atl/skill-registry.md` (generado por `skill-registry`, **no versionado**). Se indexaron 43 skills; **26 son aplicables** a este proyecto (12 Tier A + 14 Tier B). Las 17 Tier C (backend, infra, React, ofimática) son ajenas al stack: no las cargues.

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Accesibilidad** | Auditoría y corrección de a11y sobre HTML nativo | `accessibility`, `fixing-accessibility`, `web-design-guidelines` |
| **Verificación** | Comprobación en navegador y evidencia antes de afirmar | `webapp-testing`, `verification-before-completion` |
| **Diseño de interfaz** | Identidad visual, tokens, pulido de UI existente | `frontend-design`, `impeccable`, `performance` |
| **Documentación** | README de entrega y documentación técnica | `documentation`, `documentation-writer` |
| **Revisión** | Revisión contra estándares del repo y contra el spec | `code-review`, `git-commit` |
| **Orquestación** | SDD / OPSX / fundación del proyecto | `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-explore`, `openspec-update-change`, `openspec-sync-specs`, `active-orchestrator`, `kb-creator`, `roadmap-generator`, `find-skills`, `agents-md-generator` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 6 changes en 5 fases. Los 2 primeros están **completados y verificados**; los 4 últimos están **pendientes** y son el trabajo de los integrantes del equipo.
- **Camino crítico** (5): `C-01 → C-02 → C-03 → C-05 → C-06`.
- **Primer change pendiente**: `C-03` — `ejercicio3-datos-catalogo-filtro` (datos locales, catálogo y filtro). Es el **único habilitado** ahora: `C-04` y `C-05` dependen de él, y `C-06` depende de ambos.
- **Gates**: `C-03 ✓` → habilita `C-04` y `C-05` (paralelismo **lógico**, no de escritura concurrente: los cuatro escriben `js/app.js`, así que el merge se serializa) → `C-04 ✓ + C-05 ✓` habilita `C-06`.
- **Propietario de archivos**: `index.html` → C-01 · `css/` → C-02 · `js/app.js` → C-03 a C-06 · `README.md` → C-06.
- **Specs vivos** (ya archivados): `estructura-html` (5 requirements) y `presentacion-css` (5 requirements) en `openspec/specs/`.

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras

> Reglas **globales** (orquestación, governance, evidencia antes de afirmar, conventional commits) ya definidas en la configuración del stack: el proyecto las **hereda**, no se repiten acá.

Acá van las reglas **específicas de este proyecto**, derivadas de su stack (HTML5 + CSS3 + JavaScript nativo) y **confirmadas con el usuario** el 2026-10-21. Son contrato; romperlas es un defecto. Formato `NUNCA X → hacer Y`:

1. **NUNCA agregar dependencias** → usar solo HTML5, CSS3 y JavaScript nativos. Sin frameworks, CDN, npm, bundlers ni preprocesadores. *(RN-GL-01)*
2. **NUNCA usar URLs externas** → cero `http://`, `https://`, `url()`, `@font-face` ni `@import` de CDN. Todo recurso va incluido; la app funciona sin conexión. *(RN-GL-02)*
3. **NUNCA escribir CSS inline ni `<style>`** → todo el CSS vive en `css/`, en archivos externos. *(RN-PRE-01)*
4. **NUNCA usar selectores por `id` para dar estilo** → usar clases; los `id` existen para que el JavaScript los encuentre. *(CA-01)*
5. **NUNCA escribir `outline: none`** → el foco se estiliza con `:focus-visible` y un anillo de contraste suficiente. *(Punto técnico 7)*
6. **NUNCA poner `display: flex` sobre un `td`** → un `td` flex se sale del modelo de tabla y rompe la altura de fila; usar `white-space: nowrap`. *(Punto técnico 2)*
7. **NUNCA escribir `!important`** → salvo en el bloque `@media (prefers-reduced-motion: reduce)`, donde es la única excepción justificada. *(§7.8)*
8. **NUNCA escribir un literal de color, tipografía, espaciado, radio o sombra fuera de `:root`** → los tokens son la única fuente de valores. *(§5.2)*
9. **SIEMPRE declarar `min-inline-size: 0`** en todo hijo de flex/grid que pueda recibir contenido largo → es la causa habitual del scroll horizontal no deseado. *(§7.4-10)*
10. **SIEMPRE insertar los datos escritos por el usuario como texto** (`textContent`), nunca como HTML interpretable. *(RN-CAT-08)*
11. **SIEMPRE verificar antes de afirmar** → ninguna prueba se declara aprobada sin ejecutarla; todo control queda con estado {aprobado, fallido, omitido, pendiente} y su motivo. *(Consigna, pág. 5)*
12. **NUNCA modificar `index.html` ni `css/`** salvo que el change lo declare explícitamente → son de C-01 y C-02, y sus estilos nuevos se **agregan**, no se redefinen. *(DD-01)*

Además, por convención del proyecto (no son reglas duras): escribir la documentación, los comentarios y los mensajes al usuario **en español**, y nombrar en **BEM en español** (`bloque.elemento__parte`, `bloque--variante`).

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias y gates
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Para **cada** change, la documentación de fase va en `docs/ejercicioN-spec.md`, `docs/ejercicioN-plan.md` y `docs/ejercicioN-implementacion-resumen.md`, con la evidencia de la verificación.

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
