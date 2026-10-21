# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — "Estilos en archivos externos": ¿uno o varios?
**Documento A dice**: la consigna, *"El CSS se mantiene en archivos externos y se reutilizan clases para elementos equivalentes"* (plural) y el formato de entrega menciona *"carpetas de CSS, JavaScript y recursos locales"*.
**Documento B dice**: el criterio de evaluación del ejercicio, *"Estilos estructurados en archivos externos (base, layout, componentes)"* (3 capas nombradas explícitamente), y el comentario del docente sobre otro trabajo habla de *"estilización externa y modularizada"*.
**Impacto**: una entrega con **un solo** `styles.css` de 623 líneas cumple "externos" pero no "modularizada en base, layout y componentes" leído en plural. Es la diferencia entre 8/8 y un punto menos en C2.1.
**Resolución propuesta**: **resuelta** — se modularizó en `base.css` + `layout.css` + `componentes.css`, con `styles.css` como punto de entrada, sin modificar `index.html`. Verificado: equivalencia de reglas 68 ↔ 68 y render idéntico. Registrado como DD-03.

### IN-02 — El conteo de clases del HTML
**Documento A dice**: una primera versión de la SPEC afirmaba *"45 clases"* en `index.html`.
**Documento B dice**: el conteo real es **38 clases distintas** (86 atributos `class`, 100 tokens).
**Impacto**: la cifra errónea se repitió en 7 lugares de la SPEC y sugería que faltaban 7 clases en el mapa de componentes.
**Resolución propuesta**: **resuelta** — corregido a 38 y el mapa §5.4 pasó a sumar exactamente 38. Detectado por auditoría independiente de la SPEC.

### IN-03 — La consigna menciona imágenes, el proyecto no tiene ninguna
**Documento A dice**: la consigna, *"Las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria"*.
**Documento B dice**: el proyecto tiene **cero** imágenes: no hay `<img>`, ni `background-image`, ni `url()`.
**Impacto**: el requisito de texto alternativo queda **vacuo**. Declararlo "aprobado" por el solo hecho de tener 0 imágenes sería una afirmación falsa; declararlo "fallido" tampoco corresponde.
**Resolución propuesta**: **resuelta** — se declara explícitamente **vacuo** en la SPEC §9 (S3) y en el resumen de implementación, no como aprobado.

## Reglas de trabajo acordadas

- **Todo el trabajo del parcial sigue el ciclo de OpenSpec**: un change por ejercicio, con `/opsx:propose` → `/opsx:apply` → `/opsx:archive`. Un ejercicio no está entregado si no pasó por ese ciclo.
- **El trabajo previo al ciclo está descartado.** Las ramas remotas `Parte-3`, `Parte-4` y `ejercicio-5` contienen implementación hecha antes de que existiera OpenSpec: no se integran, no se toman como referencia y no se hace cherry-pick. Se rehace siguiendo el `tasks.md` del change correspondiente.
- **La spec de cada change vive en OpenSpec** y en `docs/` queda solo el resumen de implementación con la evidencia (DD-11).

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|---|---|---|---|
| Alta | ¿Qué motor de render se usa para la verificación? Hoy hay **uno solo** (Edge headless) y el resto queda OMITIDO con su motivo. Instalar un segundo motor (hay `winget` y `choco`) cerraría ese control. | Cierre de la verificación del Ejercicio 2 | Docente / equipo |
| ~~Alta~~ **RESUELTA** | ¿Quién ejecuta cada change? **Asignado el 2026-10-21:** C-01 → Maximiliano Reinoso · C-02 → Luciano Ibañez · C-03 → Xavier Papalardo · C-04 → Benjamin Arollo · C-05 → Martin Sisterna · C-06 → Lautaro Gómez Canovas. Queda registrado en el campo `assignee` de cada `.openspec.yaml` y en `knowledge-base/03_actores_y_roles.md`. | — | — |
| Media | ¿El `README.md` (Ejercicio 6) lo escribe quien ejecute ese change, o se prepara ahora con lo ya verificado? | Ejercicio 6 | Equipo |
| Media | ¿La KB y el `CHANGES.md` se versionan en el repo o viven solo en la máquina? Hoy están en el repo, en el mismo commit que el resto. | Entrega | Docente |
| Media | ¿Conviene agregar casos manuales del Ejercicio 6 (pág. 5 de la consigna) como change aparte, o forman parte del change de persistencia? | Ejercicio 6 | Equipo |
| Baja | ¿Se documentará en el README la procedencia de imágenes ajenas? La consigna lo pide "si existen"; en este proyecto no existen. | Ejercicio 6 | Equipo |
| Baja | ¿El `change` del Ejercicio 6 debe además cubrir la "comprobación guiada del precio histórico" que la consigna describe paso a paso? | Ejercicio 6 | Docente |

## Supuestos no verificables con las fuentes actuales

| Supuesto | Por qué no se puede confirmar | Qué lo confirmaría |
|---|---|---|
| Que la estructura de "un change por ejercicio" es la que espera el docente | Las pautas de evaluación recibidas no mencionan OpenSpec ni changes | La confirmación del equipo / del docente |
| ~~Que los compañeros trabajarán con el CLI `openspec` y no solo con los documentos de `docs/`~~ **RESUELTO (DD-11):** la spec vive solo en OpenSpec y `docs/` queda con el resumen de implementación. | — | — |
| Que la base de conocimiento no debe filtrarse al docente como documentación de producto | La consigna no menciona KB | La decisión del equipo |
