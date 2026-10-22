# Ejercicio 5 — Venta simulada e historial — Resumen de implementación

- Cambio: ejercicio5-venta-historial (OpenSpec)
- Archivos modificados: js/app.js
- Archivos creados: openspec/changes/ejercicio5-venta-historial/{proposal,design,tasks}.md, docs/ejercicio5-implementacion-resumen.md
- Sin cambios en index.html ni css/

## Funcionalidad
- Composición de venta con cliente y renglones. Validación de libro y cantidad entera > 0.
- Libro repetido: suma cantidad al renglón existente.
- Precio unitario copiado como valor histórico al agregar/confirmar.
- Modificar cantidad y quitar renglón antes de confirmar.
- Totales con dos decimales.
- Confirmación requiere cliente, >=1 renglón, cantidades válidas. Registra venta con id, fecha, cliente, renglones con precio histórico, total. Limpia formulario.
- Historial con id, fecha, cliente, total y Ver detalle.
- Usa poblarSelectoresRelacionados().

## Verificación
- node --check js/app.js: OK
