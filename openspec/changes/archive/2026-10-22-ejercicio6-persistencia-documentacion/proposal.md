# Propuesta: C-06 ejercicio6-persistencia-documentacion

> **Ejercicio**: 6 — *Persistencia, verificación y documentación* (10 puntos) — US-013, US-014
> **Change**: `ejercicio6-persistencia-documentacion`
> **Assignee**: Lautaro Gómez Canovas
> **Dependencias**: C-04 `ejercicio4-altas-libros-clientes` archivado · C-05 `ejercicio5-venta-historial` archivado **con implementación ausente en `main`** (ver §Riesgos) · C-03 transitiva
> **Governance**: MEDIO

## Why

La consigna cierra el parcial con tres exigencias que hoy no están cubiertas: **conservar libros,
clientes y ventas entre recargas**, **registrar el resultado real de los 8 casos manuales** y
**entregar un README** que permita al docente abrir el proyecto sin npm y reproducir la comprobación
guiada del precio histórico.

Hoy `js/app.js` mantiene todo el estado en memoria y no toca `localStorage`; cada recarga vuelve a la
semilla de C-03 y pierde las altas. El repositorio tampoco tiene `README.md`. Sin este change no se
pueden obtener los 10 puntos del ejercicio 6 ni demostrar la invariante de precio histórico que el
docente verifica a mano.

## What Changes

- **Persistencia (US-013)**: definir una **única clave versionada** de `localStorage` —`libreria-el-estante:v1`—
  que guarda el objeto `{ libros, clientes, ventas }`.
- **Carga inicial**: `cargarEstado()` lee la clave. Si **no existe**, deja la semilla de C-03 tal como
  está (RN-PER-02). Si existe, **reemplaza** los conjuntos en memoria por los guardados, **sin agregar
  ni duplicar** los ejemplos iniciales (RN-PER-03).
- **Datos restaurados como entrada no confiable**: validar y normalizar la forma del estado leído antes
  de usarlo; si el JSON es inválido o la forma no sirve, descartar el estado guardado, conservar la
  semilla y registrar el motivo. Nunca inyectar el contenido guardado como HTML.
- **Escritura**: `guardarEstado()` serializa y persiste `libros`, `clientes` y `ventas` (RN-PER-01)
  después de **cada alta de libro**, **cada alta de cliente** y **cada venta confirmada**. Un fallo de
  cuota o de escritura no rompe la sesión: se informa y el estado en memoria sigue disponible.
- **Integridad histórica**: las ventas guardadas conservan `precioUnitario`, `subtotal` y `total`
  copiados al confirmar; modificar el precio del catálogo guardado **no** altera una venta ya guardada
  (RN-VEN-11, RN-VEN-12). Es la base de la comprobación guiada del docente.
- **README de entrega (US-014)**: crear `README.md` con integrantes, apertura por `file://` sin npm,
  navegación entre las 5 vistas, funcionalidades implementadas y pendientes, ubicación de la semilla,
  funcionamiento y límites de `localStorage` (RN-PER-04), resultados observados de los 8 casos manuales,
  declaración explícita de **cero imágenes** y guía de la comprobación del precio histórico (ubicación y
  estructura del catálogo guardado + los 4 pasos + resultado observado).
- **Sin cambios de alcance técnico**: cero dependencias, cero build, cero URLs externas, apertura directa
  desde `file://` (RN-GL-01, RN-GL-02, RN-GL-03).

## Capabilities

### New Capabilities

- `persistencia-local`: clave versionada, forma del estado, carga inicial, restauración sin duplicación,
  validación de datos restaurados, escritura tras cada mutación y tolerancia a datos ausentes, corruptos
  o sin cuota.
- `documentacion-entrega`: contenido obligatorio del `README.md` de entrega, registro de evidencia de
  los casos manuales, declaración de cero imágenes y guía reproducible del precio histórico.

> Se separan en dos capabilities porque una describe **comportamiento en ejecución** (persistencia) y la
> otra un **artefacto de entrega verificable** (README). Mezclarlas obligaría a que la spec de
> persistencia hable de redacción de documentos, y a que el README quedara sin contrato propio.

### Modified Capabilities

Ninguna. C-06 **consume** los contratos ya definidos por `catalogo-filtro`, `altas-libros-clientes` y la
capacidad de ventas de C-05, sin cambiar sus requisitos.

## Impact

### Archivos que este change puede tocar

| Archivo | Acción | Nota |
|---------|--------|------|
| `js/app.js` | Modifica | Agrega persistencia y los ganchos de escritura. **No reformatea** ni reescribe funciones de C-03/C-04/C-05. |
| `README.md` | Crea | Documento de entrega exigido por la consigna. Hoy no existe. |
| `index.html` | **No toca** | Territorio de C-01 (regla dura 12). |
| `css/` | **No toca** | Territorio de C-02. |
| `docs/ejercicio6-implementacion-resumen.md` | Crea al cerrar | Evidencia de verificación; la spec vive solo en OpenSpec. |
| `CHANGES.md` | Checkbox `[x]` al cerrar | Cierre del roadmap; no se reescribe el alcance. |

### Contratos consumidos

- Arrays globales `libros`, `clientes` y `ventas` mutados por las altas y la confirmación de venta.
- `inicializarCatalogo()`, `inicializarAltas()` y `poblarSelectoresRelacionados()` como puntos de
  inicialización y refresco existentes.
- Ventas con `id`, `fecha`, `clienteId`/`clienteNombre`, `renglones[{ libroId, titulo, isbn, cantidad,
  precioUnitario, subtotal }]` y `total`.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **C-05 no está implementado en `main`** — no existen `ventas`, `registrarVenta` ni `confirmarVenta`; el commit `292462e` solo agregó artefactos OpenSpec y `docs/`; `openspec/specs/` no tiene `venta-historial` | El gancho «persistir después de cada venta confirmada» no tiene punto de enganche real y la comprobación del precio histórico no se puede ejecutar | **Prerrequisito bloqueante declarado en `tasks.md`**: restaurar/implementar C-05 antes de aplicar C-06. Mientras tanto, `cargarEstado()`/`guardarEstado()` conservan la forma `{ libros, clientes, ventas }` y tratan `ventas` como array vacío si la API no existe. C-06 **no** implementa C-05 (fuera de su propiedad de archivos) |
| JSON corrupto, forma inválida o versión desconocida en `localStorage` | Arranque roto o datos incoherentes | Validación/normalización defensiva; ante estado inválido se descarta y se usa la semilla, sin duplicar |
| `QuotaExceededError` al escribir | Pérdida silenciosa de datos | Capturar el error, informar en pantalla/consola y mantener el estado en memoria |
| Duplicación de la semilla al recargar | Incumple RN-PER-03 y el caso manual 7 | La semilla solo se usa cuando la clave **no existe**; con clave existente se reemplaza, nunca se concatena |
| Modificar `index.html` o `css/` por comodidad | Rompe la propiedad de archivos y el trabajo de C-01/C-02 | Prohibido por `tasks.md`; toda la UI necesaria ya existe |
| README con casos marcados «aprobados» sin ejecutarlos | Viola la regla dura 11 y la consigna | Cada caso lleva estado {aprobado, fallido, omitido, pendiente} + motivo + evidencia observada |

## Fuera de alcance

- Implementar o reparar C-05 (venta, renglones, total, historial).
- Editar o eliminar registros; administrar editoriales, géneros o autores.
- Sincronización entre usuarios, backend, exportación/importación de datos.
- Cambios de HTML, CSS, build, dependencias o URLs externas.
