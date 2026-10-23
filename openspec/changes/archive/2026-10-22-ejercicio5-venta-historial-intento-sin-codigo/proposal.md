# Propuesta: C-05 ejercicio5-venta-historial

> **Ejercicio**: 5 — *Venta simulada e historial* (20 puntos) — US-010, US-011, US-012  
> **Change**: `ejercicio5-venta-historial`  
> **Assignee**: Martin Sisterna  
> **Rama**: `feature/ejercicio5-venta-historial` (base `main` @ `0f39794`)  
> **Dependencias**: C-03 `ejercicio3-datos-catalogo-filtro` archivado, C-04 `ejercicio4-altas-libros-clientes` archivado

## Why

La consigna pide implementar la **venta simulada** y el **historial de ventas**. Hoy la vista *Ventas* e *Historial* ya existen en `index.html` con sus formularios, tablas, plantillas y mensajes, pero `js/app.js` no tiene ninguna lógica para componer renglones, calcular totales, confirmar la venta ni mostrar el detalle histórico.

Sin este change no se pueden cumplir los 20 puntos del ejercicio 5.

## What Changes

- **Composición de la venta**: poblar `#venta-cliente` y `#renglon-libro` con los datos existentes. Agregar renglones con validación de libro existente y cantidad entera mayor a cero. Ante un libro repetido, **no crear un segundo renglón**: modificar la cantidad del renglón existente o informar el duplicado (RN-VEN-03).
- **Edición previa a confirmar**: permitir cambiar cantidades y quitar renglones desde la tabla `#tabla-renglones` con los botones "Modificar renglón" / "Quitar renglón" (RN-VEN-04).
- **Cálculos**: `subtotal = cantidad * precioUnitario`, `total = suma de subtotales`, importes con **dos decimales** en `#venta-total` (RN-VEN-05 a RN-VEN-08).
- **Confirmación**: impedir confirmar sin cliente, sin renglones o con cantidades inválidas (RN-VEN-09). Al confirmar, registrar **identificador, fecha, cliente, renglones y total** (RN-VEN-10). **Copiar el precio unitario como valor histórico** al renglón y conservar los datos descriptivos necesarios para leer esa venta (RN-VEN-11, RN-VEN-12). Limpiar el formulario y mostrar mensaje de resultado. Las ventas confirmadas **no se editan ni se eliminan** (RN-VEN-13, RN-VEN-14).
- **Historial**: mostrar en `#tabla-historial-cuerpo` **identificador, fecha, cliente y total**. Permitir consultar el detalle con `#tabla-detalle-cuerpo` mostrando los renglones **con su precio unitario histórico**. Mostrar/ocultar `#historial-vacio` y `#historial-detalle-vacio` según corresponda (RN-HIS-01, RN-HIS-02).
- **Reutilización**: aprovechar `poblarSelectoresRelacionados()` creado por C-04 para mantener `#venta-cliente` y `#renglon-libro` actualizados tras altas.

## Capabilities

### New Capabilities

- `venta-historial` — Composición, validación, confirmación e historial inmutable de ventas, con precio unitario copiado como valor histórico.

### Modified Capabilities

Ninguna. Se consume el contrato dejado por C-03/C-04 sin modificar sus requisitos.

## Impact

### Archivos que este change puede tocar

| Archivo | Acción | Nota |
|---------|--------|------|
| `js/app.js` | Modifica | Única lógica para el ejercicio 5. Se agrega, **no se reformatea** el código existente. |
| `index.html` | **No toca** | Ya contiene toda la estructura requerida por C-01. |
| `css/` | **No toca** | Clases necesarias ya existen. |
| `docs/ejercicio5-implementacion-resumen.md` | Crea | Al cerrar el change con evidencia de verificación. |

> Se respeta la regla de propiedad de archivos de `CHANGES.md`: C-05 solo toca `js/app.js`.
