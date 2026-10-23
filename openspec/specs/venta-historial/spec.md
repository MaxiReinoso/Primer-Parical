# venta-historial Specification

## Purpose
Define la capacidad `venta-historial`: componer una venta por renglones con validaciones, copiar precio unitario y datos descriptivos como snapshot histórico al confirmar/agregar, calcular subtotales/total con dos decimales, confirmar con validaciones estrictas (cliente + >=1 renglón + cantidades válidas), limpiar el formulario tras confirmar, mantener ventas confirmadas inmutables y mostrar historial con detalle que conserva el precio histórico.

## Requirements

### Requirement: Poblado de selectores para venta
El sistema DEBE poblar `#venta-cliente` con clientes disponibles y `#renglon-libro` con libros del catálogo, reutilizando `poblarSelectoresRelacionados()` definido por C-04. Los selects DEBEN actualizarse tras altas sin recargar la página.

#### Scenario: Inicialización de selects
- **WHEN** se inicializa la funcionalidad de ventas
- **THEN** `#venta-cliente` contiene opciones con clientes (semilla o registrados) y `#renglon-libro` contiene opciones con libros existentes

#### Scenario: Actualización tras alta
- **WHEN** se registra un nuevo cliente o libro tras inicialización
- **THEN** `poblarSelectoresRelacionados()` actualiza `#venta-cliente` y/o `#renglon-libro` sin duplicar opciones

### Requirement: Agregar renglón con validaciones
El sistema DEBE validar que el libro exista en el catálogo y que la cantidad sea un entero mayor a cero. Si el libro ya existe en la venta en curso, DEBE sumar la cantidad al renglón existente e informar el duplicado; NO DEBE crear un segundo renglón.

#### Scenario: Agregar renglón válido
- **WHEN** se selecciona un libro existente y se ingresa una cantidad entera mayor a cero y se pulsa "Agregar renglón"
- **THEN** se clona `#plantilla-renglon`, se agrega a `#tabla-renglones-cuerpo`, se copian `precioUnitario` y datos descriptivos (`titulo`, `isbn`) como snapshot histórico, se calcula `subtotal = cantidad * precioUnitario`

#### Scenario: Cantidad inválida
- **WHEN** se intenta agregar con cantidad 0, negativa, decimal o no numérica
- **THEN** no se agrega el renglón y se muestra un mensaje de error claro

#### Scenario: Libro inexistente
- **WHEN** se intenta agregar con un libro inexistente
- **THEN** no se agrega el renglón y se muestra un mensaje de error claro

#### Scenario: Libro repetido suma cantidad
- **WHEN** se agrega el mismo libro que ya está en la venta en curso
- **THEN** se suma la cantidad al renglón existente, no se duplica la fila y se informa el duplicado al usuario

### Requirement: Snapshot histórico de precio y datos
Al agregar un renglón y/o al confirmar la venta, el sistema DEBE copiar `precioUnitario` (y `titulo`, `isbn`) al objeto del renglón. El historial y el detalle DEBEN mostrar esos valores copiados; NO DEBE recalcularse desde `libro.precio` en el catálogo.

#### Scenario: Precio histórico preservado
- **WHEN** se confirma una venta con un renglón a precio unitario X y posteriormente cambia el precio del libro en el catálogo
- **THEN** el detalle de esa venta sigue mostrando precio unitario X (histórico)

#### Scenario: Datos descriptivos preservados
- **WHEN** se guarda un renglón en el historial
- **THEN** el detalle puede mostrar `titulo` e `isbn` del renglón sin necesidad de volver a buscar en el catálogo

### Requirement: Edición de renglones antes de confirmar
El sistema DEBE permitir quitar un renglón y **modificar la cantidad** de un renglón antes de confirmar la venta, validando que la nueva cantidad sea entera mayor a cero. Tras cualquier modificación DEBE recalcular subtotales y total.

#### Scenario: Quitar renglón
- **WHEN** se pulsa "Quitar renglón" sobre un renglón de la venta en curso
- **THEN** se elimina el renglón y se recalcula total

#### Scenario: Modificar cantidad
- **WHEN** se pulsa "Modificar renglón" y se ingresa una nueva cantidad entera mayor a cero
- **THEN** se actualiza la cantidad, se recalcula `subtotal` y total; si es inválida, se rechaza sin romper el estado

### Requirement: Cálculos con dos decimales
Los subtotales y el total DEBEN calcularse como `subtotal = cantidad * precioUnitario`, `total = suma de subtotales` y mostrarse con dos decimales usando `formatearPrecio()` / formato `es-AR`.

#### Scenario: Totales formateados
- **WHEN** hay renglones en la venta en curso
- **THEN** `#venta-total` muestra el total formateado con dos decimales

### Requirement: Confirmación de venta con validaciones
El sistema DEBE impedir confirmar si no hay cliente seleccionado, si no hay renglones, o si alguna cantidad es inválida. Al confirmar DEBE registrar la venta con `{ id, fecha, clienteId, clienteNombre, renglones, total }` en el arreglo `ventas` **mediante un único punto de push** (función `confirmarVenta()`), limpiar el formulario/tabla para nueva venta, mostrar mensaje de éxito/error y **las ventas confirmadas NO DEBEN ser editables ni eliminables**.

#### Scenario: No se confirma sin cliente
- **WHEN** se intenta confirmar sin cliente seleccionado
- **THEN** no se registra la venta y se muestra mensaje de error

#### Scenario: No se confirma sin renglones
- **WHEN** se intenta confirmar sin renglones agregados
- **THEN** no se registra la venta y se muestra mensaje de error

#### Scenario: No se confirma con cantidades inválidas
- **WHEN** hay renglones pero alguna cantidad es inválida
- **THEN** no se registra la venta y se muestra mensaje de error

#### Scenario: Confirmación exitosa
- **WHEN** hay cliente, >=1 renglón y cantidades válidas
- **THEN** se crea un registro en `ventas` con id, fecha, clienteId, clienteNombre, renglones (con snapshot histórico), total; se limpia la venta en curso; se muestra mensaje de éxito

#### Scenario: Ventas confirmadas inmutables
- **WHEN** una venta ya fue confirmada
- **THEN** no existe funcionalidad para editarla o eliminarla desde la interfaz

### Requirement: Historial con detalle histórico
El sistema DEBE mostrar en `#tabla-historial-cuerpo` las ventas con `id`, `fecha`, `cliente`, `total`. Al seleccionar "Ver detalle" DEBE renderizar los renglones en `#tabla-detalle-cuerpo` con el **precio unitario histórico**. DEBE gestionar `#historial-vacio` y `#historial-detalle-vacio`. El historial DEBE mostrarse en orden coherente (recomendado más reciente primero).

#### Scenario: Historial vacío
- **WHEN** no hay ventas registradas
- **THEN** `#historial-vacio` visible y la tabla de historial vacía o sin filas

#### Scenario: Listado de historial
- **WHEN** hay ventas registradas
- **THEN** se muestran filas con id, fecha, cliente, total

#### Scenario: Ver detalle con precio histórico
- **WHEN** se pulsa "Ver detalle" sobre una venta
- **THEN** se muestran sus renglones con precio unitario histórico (del snapshot) en `#tabla-detalle-cuerpo`

### Requirement: Integración y contrato con C-06
El sistema DEBE declarar `ventas = []` como arreglo global en `js/app.js` y DEBE tener **exactamente un `ventas.push(...)`** (en `confirmarVenta()`). La inicialización DEBE dejarlo consumible por `cargarEstado()` de C-06 sin romper C-03/C-04. No se DEBE modificar `index.html` ni `css/`.

#### Scenario: Contrato de ventas global
- **WHEN** el módulo carga
- **THEN** existe `ventas = []` y el único push ocurre en el punto de confirmación

#### Scenario: Sin tocar archivos congelados
- **WHEN** se implementa el change
- **THEN** no se modifican `index.html` ni archivos bajo `css/`
