# Tasks: C-05 ejercicio5-venta-historial

> **Archivos que este change puede tocar (declaración explícita):**
> 
> | Archivo | Qué se toca | Por qué |
> |---------|-------------|---------|
> | `js/app.js` | Lógica de venta e historial + listeners necesarios | Único archivo de producto para este ejercicio. Se agrega, no se reformatea. |
> | `index.html` | **No se toca** | Estructura ya completa (C-01). |
> | `css/` | **No se toca** | Clases ya existen (C-02). |
> | `docs/ejercicio5-implementacion-resumen.md` | Se crea al cerrar con evidencia | Requerido por el flujo OpenSpec. |

## Dependencias
- C-01, C-02, C-03, C-04 archivados/completados.

## Checklist

### 1. Estado y helpers
- [ ] 1.1 Declarar `ventas = []` y estado de venta en curso (`ventaEnCurso`) en `js/app.js`
- [ ] 1.2 Funciones helper para formatear precio con 2 decimales y generar id de venta
- [ ] 1.3 Funciones para calcular subtotal/total

### 2. Poblado de selects
- [ ] 2.1 Integrar con `poblarSelectoresRelacionados()` (llamarlo en inicialización de ventas)
- [ ] 2.2 Asegurar que `#venta-cliente` y `#renglon-libro` se pueblen correctamente

### 3. Agregar renglón
- [ ] 3.1 Validar libro existente y cantidad entera > 0
- [ ] 3.2 Si libro repetido, **sumar cantidad** al renglón existente e informar duplicado
- [ ] 3.3 Copiar `precioUnitario` y datos descriptivos al crear renglón (histórico)
- [ ] 3.4 Clonar `#plantilla-renglon` y renderizar en `#tabla-renglones-cuerpo`
- [ ] 3.5 Actualizar `#venta-total` con dos decimales

### 4. Editar/quitar renglones antes de confirmar
- [ ] 4.1 Botón "Modificar renglón" permite cambiar cantidad
- [ ] 4.2 Botón "Quitar renglón" elimina el renglón
- [ ] 4.3 Recalcular subtotal/total tras cambios

### 5. Confirmación de venta
- [ ] 5.1 Validar cliente existente, >=1 renglón, cantidades válidas. Impedir confirmación inválida
- [ ] 5.2 Registrar venta con `id`, `fecha`, `cliente`, `renglones` (con `precioUnitario` histórico), `total`
- [ ] 5.3 Limpiar formulario y tabla de renglones para nueva venta
- [ ] 5.4 Mostrar mensaje de resultado en `#venta-mensaje-exito`/`#venta-mensaje-error`
- [ ] 5.5 Ventas confirmadas no editables ni eliminables

### 6. Historial
- [ ] 6.1 Renderizar `#tabla-historial-cuerpo` con id, fecha, cliente, total
- [ ] 6.2 Mostrar/ocultar `#historial-vacio`
- [ ] 6.3 Botón "Ver detalle" renderiza renglones en `#tabla-detalle-cuerpo` con precio unitario **histórico**
- [ ] 6.4 Mostrar/ocultar `#historial-detalle-vacio`

### 7. Integración e inicialización
- [ ] 7.1 Agregar listeners para `#boton-agregar-renglon`, `#form-venta`, y botones del historial
- [ ] 7.2 Inicializar render de renglones/historial al cargar
- [ ] 7.3 No romper C-03/C-04 (sin modificar funciones existentes)

### 8. Verificación (casos manuales)
- [ ] 8.1 Venta sin cliente → no se confirma
- [ ] 8.2 Cantidad 0, negativa, decimal → rechazados
- [ ] 8.3 Libro repetido → suma cantidad, no crea segundo renglón
- [ ] 8.4 Venta válida: 2×1500 + 1×2000 → subtotales 3000/2000, total 5000
- [ ] 8.5 Detalle conserva precios históricos tras cambio en catálogo
- [ ] 8.6 Limpiar formulario tras confirmación
- [ ] 8.7 Verificación a 320px sin scroll horizontal de página
- [ ] 8.8 Sin errores en consola

### 9. Cierre
- [ ] 9.1 Actualizar `CHANGES.md` marcando C-05 como `[x]` completado
- [ ] 9.2 Crear `docs/ejercicio5-implementacion-resumen.md` con evidencia
- [ ] 9.3 Archivar change con `/opsx:archive ejercicio5-venta-historial`
