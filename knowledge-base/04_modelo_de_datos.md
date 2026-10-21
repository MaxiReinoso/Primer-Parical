# Modelo de Datos

## Dominios

| Dominio | Descripción |
|---|---|
| **Catálogo** | Libros con su editorial, género y autores; se consulta y se filtra por título. |
| **Altas** | Registro de libros y de clientes desde formularios. |
| **Ventas** | Composición de una venta por renglones y su confirmación con total. |
| **Historial** | Consulta de ventas confirmadas y de sus renglones con precio histórico. |
| **Persistencia** | Conservación de libros, clientes y ventas en `localStorage`. |

## ERD (Entity Relationship Diagram)

```
        Editorial ──1:N──▶ Libro ◀──N:M── Autor
                                │  ▲
                                │  │
              Género ──0:1─────┘  │
                                 │
        Venta ──1:N──▶ Renglón ────┘
          │              │
          │              └──▶ Libro (referencia, con precio unitario histórico)
          │
          └──N:1──▶ Cliente
```

- Un **Libro** pertenece a **exactamente 1** Editorial y tiene **1 o más** Autores.
- Un Libro puede no tener **Género** (se representa como «Sin clasificar»).
- Un **Renglón** apunta a 1 Libro y guarda su **precio unitario copiado** (valor histórico).
- Una **Venta** pertenece a 1 Cliente y tiene 1 o más Renglones.
- Editorial, Género y Autor son **entidades de catálogo**: se consultan, pero la consigna **no** pide gestionarlas (no hay altas, bajas ni modificaciones de ellas).

## Entidades

### Libro
- **Atributos**: `id` (estable), `titulo` (string), `isbn` (string), `precio` (number), `editorialId` (fk), `generoId` (fk, **opcional**), `autorIds` (array de fk, **mínimo 1**)
- **Relaciones**: N Editorial → 1 Libro; N Libro ↔ N Autor; 0..1 Género → N Libro
- **Constraints**: `titulo` y `isbn` no vacíos; `isbn` único en el conjunto local; `precio` numérico **mayor que cero**; `editorialId` y todos los `autorIds` deben existir en los datos locales; `generoId`, si se asigna, debe existir
- **Comparación de ISBN**: sin espacios ni guiones. **No** se implementa el dígito de control

### Editorial
- **Atributos**: `id` (estable), `nombre`
- **Relaciones**: 1 Editorial → N Libro
- **Constraints**: existencia verificada al dar de alta un libro

### Género
- **Atributos**: `id` (estable), `nombre`
- **Relaciones**: 0..1 Género → N Libro
- **Constraints**: la ausencia de género se representa con la opción «Sin clasificar» (`value=""`), no con un género ficticio

### Autor
- **Atributos**: `id` (estable), `nombre`
- **Relaciones**: N Autor ↔ N Libro
- **Constraints**: en el alta de un libro se selecciona **al menos un** autor

### Cliente
- **Atributos**: `id` (estable), `nombre` (string, nombre completo), `email` (string)
- **Relaciones**: 1 Cliente → N Venta
- **Constraints**: nombre y email no vacíos; email con formato válido; **unicidad** de email comparada sin espacios exteriores y **sin distinguir mayúsculas de minúsculas**
- **Nota**: no se requiere un campo de apellido separado

### Venta
- **Atributos**: `id` (identificador de la venta), `fecha` (string), `clienteId` (fk), `renglones` (array de Renglón), `total` (number con 2 decimales)
- **Relaciones**: 1 Cliente → N Venta; 1 Venta → N Renglón
- **Constraints**: requiere cliente existente y al menos un renglón; **no se edita ni se elimina** desde la interfaz

### Renglón
- **Atributos**: `libroId` (fk), `cantidad` (entero > 0), `precioUnitario` (número, **copiado** del catálogo), `subtotal` (cantidad × precioUnitario)
- **Relaciones**: 1 Libro → N Renglones
- **Constraints**: cantidad **entera mayor que cero**; no se admiten **libros repetidos** dentro de la misma venta (se modifica la cantidad del renglón existente o se informa el duplicado)
- **Invariante clave**: `precioUnitario` se **copia** al confirmar la venta, de modo que consultar el historial después de un cambio de precio en el catálogo **no** recalcula nada

## Seed data inicial

Mínimo exigido por la consigna para el Ejercicio 3:

| Conjunto | Mínimo | Nota |
|---|---|---|
| Libros | **6** | Cada uno con editorial existente y 1 o más autores existentes; el género es opcional |
| Editoriales | **2** | Referenciadas por los libros |
| Géneros | **2** | Adicionales a la pseudo-opción «Sin clasificar» |
| Autores | **3** | Referenciados por los libros |
| Clientes | **3** | Con nombre completo y email único |

Los datos son **ficticios** y se cargan en el primer inicio; en los inicios posteriores se recuperan de `localStorage` **sin duplicar** los ejemplos (Ejercicio 6).
