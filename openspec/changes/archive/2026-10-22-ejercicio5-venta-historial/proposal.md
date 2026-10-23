# Proposal

## Why

El ejercicio 5 pide implementar la **venta simulada** y el **historial de ventas** en "Librería El Estante". El cambio C-05 ya fue archivado el 2026-10-22 con `proposal.md`, `design.md` y `tasks.md`, pero **nunca se implementó en código**: `git log --all -S "registrarVenta"` no encuentra commits que lo agreguen, el commit `292462e` solo añadió los artefactos de OpenSpec, y `js/app.js` en `main` contiene únicamente C-03 + C-04. Además `openspec/specs/venta-historial/` no existe. Por consiguiente, esta propuesta **reemplaza el plan archivado de C-05 que nunca fue implementado** y deja explícito que la evidencia previa (`docs/ejercicio5-implementacion-resumen.md` mencionada en el archive) era **incorrecta**. Ahora se propone el plan correcto para implementar C-05 sobre el estado real del repositorio, respetando las dependencias y el contrato que C-06 espera.

## What Changes

- **Composición de la venta**: poblar `#venta-cliente` y `#renglon-libro` usando `poblarSelectoresRelacionados()` (definida por C-04, sin reimplementarla). Agregar renglones validando libro existente y cantidad entera mayor a cero. Ante libro repetido **sumar cantidad** al renglón existente e informar el duplicado, sin crear un segundo renglón (RN-VEN-03).
- **Edición previa a confirmar**: permitir quitar renglones y **modificar la cantidad** de un renglón antes de confirmar (mecanismo a definir en design.md), recalculando subtotales/total.
- **Cálculos**: `subtotal = cantidad * precioUnitario`, `total = suma de subtotales`, con dos decimales vía `formatearPrecio()` / `Intl.NumberFormat("es-AR", ...)` (RN-VEN-05 a RN-VEN-08).
- **Confirmación**: `confirmarVenta()` (único punto de push) valida cliente, >=1 renglón y cantidades válidas; registra venta con `{ id, fecha, clienteId, clienteNombre, renglones, total }`. **Copia `precioUnitario` (más `titulo`, `isbn`) como snapshot histórico** al renglón al agregar/confirmar; nunca se vuelve a leer `libro.precio` para el historial/detalle. Limpia el formulario/estado para nueva venta. Muestra mensajes en `#venta-mensaje-exito` / `#venta-mensaje-error`. Las ventas confirmadas **no son editables ni eliminables** (RN-VEN-09 a RN-VEN-14).
- **Historial**: `renderHistorial()` muestra `id`, `fecha`, `cliente`, `total` en `#tabla-historial-cuerpo`; botón "Ver detalle" renderiza en `#tabla-detalle-cuerpo` con **precio unitario histórico**; gestiona `#historial-vacio` y `#historial-detalle-vacio` (RN-HIS-01, RN-HIS-02).
- **Inicialización**: agregar inicialización de ventas (tercer `DOMContentLoaded` o función `inicializarVentas()`) al final del archivo, dejando `ventas = []` y el único `ventas.push(...)` en forma consumible por C-06 (`cargarEstado()` / `guardarEstado()` esperan un arreglo global `ventas`).
- **Verificación**: todos los casos manuales relevantes (4-6) y la comprobación guiada del precio histórico, con evidencia por control {aprobado, fallido, omitido, pendiente}.

## Capabilities

### New Capabilities
- `venta-historial`: Composición, validación, cálculos, confirmación e historial inmutable de ventas, con snapshot histórico del precio unitario y datos descriptivos necesarios para el detalle.

### Modified Capabilities
Ninguna. Se consume el contrato de C-03/C-04 sin modificar sus requisitos.

## Impact

### Archivos afectados
| Archivo | Acción | Nota |
|---------|--------|------|
| `js/app.js` | Modificar | Única lógica del ejercicio 5. Agregar, no reformatear código existente. Debe exponer `ventas = []` y un único punto `ventas.push(...)` (recomendado `confirmarVenta()`) para C-06. |
| `index.html` | Sin modificar | Ya contiene toda la estructura requerida. Regla dura 12. |
| `css/` | Sin modificar | Clases necesarias ya existen. Regla dura 12. |
| `docs/ejercicio5-implementacion-resumen.md` | Crear al cierre | Evidencia real de verificación. |
| `CHANGES.md` | Solo checkbox (orquestador) | Marcar `[x]` al cerrar; no es implementación. |

### Dependencias
- C-03 `ejercicio3-datos-catalogo-filtro` (archivado/completado) - datos locales
- C-04 `ejercicio4-altas-libros-clientes` (archivado/completado) - `poblarSelectoresRelacionados()`, clientes/libros registrados

### Riesgos
- **Histórico de precios**: si se lee `libro.precio` al mostrar detalle se rompe la invariante. Debe copiarse al momento de agregar/confirmar.
- **Reutilización vs duplicado**: usar `poblarSelectoresRelacionados()` sin reimplementar.
- **Validación sin `novalidate`/nativos problemáticos**: `#form-venta` carece de `novalidate` y `#renglon-cantidad` tiene `step=1`; definir estrategia en design.
- **Selector de cliente vacío**: `#venta-cliente` sin opción vacía y se repuebla tras altas; definir validación resiliente.
- **Integración con C-06**: debe dejar `ventas` global y un único punto de push; `cargarEstado()` de C-06 debe poder restaurar sin duplicar.
- **Plan archivado inválido**: no copiar sus huecos; corregir con estado real del código.

**Governance:** MEDIO
