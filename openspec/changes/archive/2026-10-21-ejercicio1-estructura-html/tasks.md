# Tasks

> Change ya implementado y verificado. Las tareas están marcadas como hechas; la evidencia vive en `docs/ejercicio1-implementacion-resumen.md`.

## 1. Punto de entrada

- [x] 1.1 Crear `index.html` con doctype, `lang="es"`, charset, `meta viewport`, `<link>` al CSS y `<script defer>` al JS, y verificar que el proyecto abre con doble clic desde `file://` sin errores de recurso
- [x] 1.2 Crear `css/styles.css` y `js/app.js` como placeholders con cero reglas y cero código, y verificar que el `<link>` y el `<script>` resuelven

## 2. Estructura global

- [x] 2.1 Construir `<header>` con el `h1` del nombre de la librería, `<nav aria-label>` con los 5 enlaces-ancla y `<footer>`, y verificar que los 5 enlaces llevan a su vista

## 3. Vistas

- [x] 3.1 Construir la vista Catálogo con buscador por título, listado vacío y los dos mensajes de estado, y verificar que los mensajes quedan con la visibilidad inicial correcta
- [x] 3.2 Construir la vista Libros con los 6 campos, «Sin clasificar», selector múltiple de autores, botón y tabla de 6 columnas, y verificar que los 6 labels coinciden con sus `id`
- [x] 3.3 Construir la vista Clientes con nombre, email, botón y tabla de 2 columnas, y verificar labels y encabezados
- [x] 3.4 Construir la vista Ventas con un único formulario que contiene cliente, fieldset de renglón, tabla de 5 columnas, bloque de total y botón de confirmación, y verificar que los `type` de los botones son correctos
- [x] 3.5 Construir la vista Historial con tabla de ventas, zona de detalle con su sub-tabla y los dos mensajes de estado, y verificar que las columnas exigidas están presentes

## 4. Plantillas de render

- [x] 4.1 Agregar `<template id="plantilla-libro">` y `<template id="plantilla-renglon">` sin datos dentro, y verificar que permanecen inertes en el DOM cargado

## 5. Verificación

- [x] 5.1 Ejecutar los controles estructurales automatizados de solo lectura y verificar que no hay `style=`, ni `<style>`, ni `<script>` con cuerpo, ni URLs externas, ni ids duplicados, ni controles sin etiqueta
- [x] 5.2 Verificar en navegador real (`file://`) que el DOM cargado contiene las 5 vistas y que las plantillas siguen inertes

## 6. Documentación

- [x] 6.1 Escribir `openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/spec-ejercicio1.md`, `openspec/changes/archive/2026-10-21-ejercicio1-estructura-html/notas/plan-ejercicio1.md` y `docs/ejercicio1-implementacion-resumen.md` con la evidencia de la verificación
