# Librería El Estante

Trabajo práctico del **Primer Parcial de Programación III**. Es una aplicación web de una librería
ficticia: catálogo de libros, alta de libros y clientes, venta simulada e historial, con persistencia
en el navegador. No usa servidor, base de datos ni conexión a internet.

## Integrantes

| Integrante | Ejercicio a cargo |
|---|---|
| Maximiliano Reinoso | Ejercicio 1 — Estructura HTML |
| Luciano Ibañez | Ejercicio 2 — Presentación CSS |
| Xavier Papalardo | Ejercicio 3 — Datos, catálogo y filtro |
| Benjamin Arollo | Ejercicio 4 — Alta de libros y clientes |
| Martin Sisterna | Ejercicio 5 — Venta e historial |
| Lautaro Gómez Canovas | Ejercicio 6 — Persistencia y documentación |

## Cómo abrir el proyecto (sin npm)

No hace falta instalar nada, ni ejecutar `npm install`, ni levantar un servidor.

1. Descargar o clonar la carpeta del proyecto.
2. Abrir `index.html` con doble clic, o arrastrarlo a una pestaña del navegador.
3. También se puede pegar una ruta `file://` en la barra de direcciones. Ejemplo para esta copia:

   ```text
   file:///L:/Repos/Primer-Parical/index.html
   ```

La aplicación funciona sin conexión. El único estado que se conserva es el que el navegador guarda en
`localStorage` (ver más abajo).

## Navegación entre las cinco vistas

La navegación principal del encabezado tiene cinco enlaces-ancla. Cada uno muestra la sección
correspondiente dentro de la misma página, sin recargar:

| Vista | Enlace | Qué muestra |
|---|---|---|
| Catálogo | `#catalogo` | Búsqueda por título y tarjetas de los libros |
| Libros | `#libros` | Formulario de alta y tabla de libros registrados |
| Clientes | `#clientes` | Formulario de alta y tabla de clientes registrados |
| Ventas | `#ventas` | Cliente, renglones, total y confirmación de la venta |
| Historial | `#historial` | Ventas confirmadas y detalle de cada una |

## Funcionalidades implementadas y pendientes

### Implementadas

- Catálogo con los datos iniciales y búsqueda parcial por título, sin distinguir mayúsculas.
- Mensaje de «sin resultados» cuando la búsqueda no coincide con ningún libro.
- Alta de libros con validación de título, ISBN único, precio mayor que cero, editorial, género y al
  menos un autor.
- Alta de clientes con validación de nombre, formato de email y email único sin distinguir mayúsculas.
- Venta por renglones con cantidad entera mayor que cero; un libro repetido suma cantidad en el mismo
  renglón y no crea una fila nueva.
- Cálculo de subtotal y total, y copia del precio unitario y de los datos descriptivos como snapshot
  histórico al agregar y confirmar.
- Confirmación de venta con validación de cliente y de al menos un renglón.
- Historial de ventas con detalle que conserva el precio unitario, los subtotales y el total originales.
- Persistencia de libros, clientes y ventas en `localStorage`, con restauración sin duplicar los datos
  iniciales.
- Validación defensiva del estado guardado y aviso visible ante fallos de lectura o de escritura.

### Pendientes

- Edición y eliminación de registros: no forman parte de la consigna.
- Administración de editoriales, géneros y autores: son datos fijos del código.
- Sincronización entre usuarios o dispositivos: el almacenamiento es local al navegador.

No queda ninguna funcionalidad pendiente de los seis ejercicios del parcial en esta copia.

## Ubicación de los datos iniciales

La semilla vive en `js/app.js`, en los arrays:

| Array | Contenido inicial |
|---|---|
| `editoriales` | 2 editoriales |
| `generos` | 2 géneros |
| `autores` | 3 autores |
| `libros` | 6 libros |
| `clientes` | 3 clientes |

Los datos son ficticios. La semilla se usa cuando todavía no existe estado guardado, o cuando el
estado guardado se descarta por inválido.

## Funcionamiento y límites de localStorage

La aplicación guarda el estado del dominio en una única clave:

```text
libreria-el-estante:v1
```

El valor es un objeto JSON con esta forma:

```json
{
  "libros": [],
  "clientes": [],
  "ventas": []
}
```

Se escribe después de cada alta de libro, cada alta de cliente y cada venta confirmada. No se guarda
automáticamente al abrir la página: la clave aparece con la primera modificación real. Si no hay clave,
la aplicación arranca con la semilla.

Límites que hay que tener en cuenta:

- El almacenamiento depende del **navegador**, del **perfil** y de la **ubicación desde la que se abre**
  el proyecto. Otra ruta `file://`, otro navegador u otro perfil no ven los mismos datos.
- La información **no se comparte entre usuarios ni entre dispositivos**. No hay backend ni
  sincronización.
- El navegador puede limitar la cuota de almacenamiento. Si una escritura falla, la aplicación avisa al
  pie de la página, mantiene el cambio en memoria durante esa sesión y no interrumpe el uso.
- El estado guardado se valida al leerlo. Si el JSON está roto o tiene una forma inválida, se descarta y
  se vuelve a la semilla; si un registro individual es inválido, se omite ese registro.
- Para reiniciar la aplicación se puede borrar la clave desde las herramientas de almacenamiento del
  navegador y recargar.

## Resultados observados de los ocho casos manuales

Verificación ejecutada el **2026-10-22** sobre una copia temporal del proyecto, en Microsoft Edge
(Chromium) headless, controlado por el protocolo de DevTools. Los archivos de la entrega no se
modificaron durante las pruebas.

| Caso | Estado | Motivo / resultado observado |
|---|---|---|
| 1. Búsqueda parcial en mayúsculas, búsqueda vacía y texto inexistente | aprobado | `CIEN` mostró 1 tarjeta: «Cien años de soledad». La búsqueda vacía mostró las 6 tarjetas. `zzzz` mostró 0 tarjetas y el mensaje «No se encontraron libros que coincidan con la búsqueda». |
| 2. Alta con ISBN existente y luego con ISBN nuevo | aprobado | `978-0307474728` fue rechazado con «El ISBN 978-0307474728 ya está registrado.» y el total siguió en 6. El ISBN nuevo `9781111111111` llevó el total a 7, apareció en el catálogo, en la tabla y en el selector de venta. |
| 3. Email inválido, email existente en mayúsculas y email nuevo | aprobado | `abc` fue rechazado por formato. `MARIA.GONZALEZ@EMAIL.COM` fue rechazado por duplicado. El email nuevo `nuevo@email.com` llevó los clientes de 3 a 4 y apareció en la tabla y en el selector de venta. |
| 4. Venta sin cliente, cantidad 0/negativa/decimal y libro repetido | aprobado | Sin cliente se rechazó con «Seleccioná un cliente válido.». Las cantidades 0, -2 y 1.5 se rechazaron con «La cantidad debe ser un número entero mayor que cero.». El libro repetido no creó una segunda fila: quedó 1 renglón con cantidad 2. |
| 5. Venta válida de 2 × 1500 + 1 × 2000 | aprobado | Subtotales observados: 3000 y 2000. Total: 5000. El historial mostró 1 fila y el detalle conservó 2 renglones con precio unitario 1500 y 2000. |
| 6. Cambio exclusivo del precio del catálogo guardado en una copia de prueba | aprobado | Se confirmó la venta, se cambió solo `libros[i].precio` de 1500 a 9999 en `libreria-el-estante:v1`, se recargó y se abrió el detalle. El catálogo mostró 9999, pero la venta conservó precio unitario 1500, subtotal 3000 y total 5000. |
| 7. Recarga después de altas y venta | aprobado | Antes de recargar: 8 libros, 4 clientes y 1 venta. Después de recargar: 8 libros (no 14), 4 clientes (no 7) y 1 venta (no 2). No se duplicaron los 6 libros ni los 3 clientes de la semilla. |
| 8. Navegación por teclado y anchos de 320 px y 1280 px | aprobado | 26 controles de página recorridos con `Tab`, todos con anillo de foco visible de 2 px. A 320 px: `scrollWidth` 305 = `clientWidth` 305, sin scroll horizontal de página. A 1280 px: 1265 = 1265. Las tablas anchas usan `overflow-x: auto` dentro de su contenedor. |

Estados posibles: `aprobado`, `fallido`, `omitido`, `pendiente`. Ningún caso se marca aprobado sin
haberlo ejecutado.

## Imágenes

El proyecto usa **cero imágenes**, tanto propias como de terceros. No hay archivos de imagen, etiquetas
`<img>`, `background-image` ni recursos externos. Por lo tanto:

- No hay procedencia, autoría ni licencia de imágenes que acreditar: no se inventa ninguna.
- El requisito de **texto alternativo se declara VACUO** por ausencia de imágenes. No se registra como
  un control aprobado.
- Los únicos `url()` del CSS son los tres `@import` relativos de `css/styles.css` hacia archivos CSS
  locales; no son imágenes ni recursos externos.

## Comprobación guiada del precio histórico

### Ubicación y estructura del catálogo guardado

En las herramientas de almacenamiento del navegador, el catálogo está en:

```text
localStorage["libreria-el-estante:v1"] → libros → [i] → precio
```

El histórico de cada venta está en:

```text
localStorage["libreria-el-estante:v1"] → ventas → [j] → renglones → [k] → precioUnitario
```

Los renglones también guardan `subtotal`, y la venta guarda `total`. Esos valores se copian al confirmar
y no se recalculan al leerlos.

### Los cuatro pasos

1. Confirmar una venta y anotar sus importes (precio unitario, subtotales y total).
2. En las herramientas de almacenamiento, modificar **únicamente** el `precio` del libro dentro de
   `libros`, sin modificar ni borrar `ventas`.
3. Recargar la página.
4. Consultar el detalle de la venta anterior.

### Resultado observado

La comprobación se ejecutó en una **copia temporal** del proyecto. Se confirmó una venta de 2 × 1500 más
1 × 2000, con total 5000. Después se cambió el precio del libro de 1500 a 9999 en el catálogo guardado y
se recargó. Resultado observado: el catálogo mostró 9999, mientras que el detalle de la venta conservó
precio unitario 1500, subtotal 3000 y total 5000. La venta no se duplicó y el historial siguió mostrando
una sola fila.

## Alcance técnico de la entrega

Se entregan:

- `index.html`
- `css/` (hoja de entrada y tres hojas importadas localmente)
- `js/app.js`
- `README.md`

No hay `package.json`, `node_modules`, dependencias instaladas, herramientas de compilación ni recursos
externos. El proyecto se abre directamente desde `file://` y funciona sin conexión.

## Estructura del proyecto

```text
Primer-Parical/
├── index.html
├── README.md
├── css/
│   ├── styles.css
│   ├── base.css
│   ├── layout.css
│   └── componentes.css
└── js/
    └── app.js
```
