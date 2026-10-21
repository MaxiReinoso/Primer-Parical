# Librería El Estante — Base de Conocimiento

Base de conocimiento generada a partir de los documentos del proyecto (`docs/`) y de la consigna del parcial.

## Índice de Archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos por actor, alcance de los 6 ejercicios, fuera de alcance y métricas de éxito |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack tecnológico, arquitectura de la SPA, integraciones externas y estructura de archivos |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores del sistema, reparto de responsabilidades por ejercicio y rutas públicas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Dominios, ERD, entidades con sus constraints y el seed data inicial exigido |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas `RN-{DOMINIO}-{NN}` por dominio, incluidas las globales |
| [06_funcionalidades.md](06_funcionalidades.md) | 14 historias de usuario en 6 épicas, con criterios de aceptación y reglas relacionadas |
| [07_flujos_principales.md](07_flujos_principales.md) | 7 flujos extremo a extremo, con el estado actual de cada uno y sus casos de error |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de directorios, seguridad, variables de entorno y convenciones de verificación |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | 10 decisiones documentadas (DD-01…DD-10) y 5 supuestos inferidos (SU-01…SU-05) |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | 3 inconsistencias detectadas (todas resueltas) y 7 preguntas abiertas priorizadas |
| [11_criterios_evaluacion.md](11_criterios_evaluacion.md) | *Extra.* Distribución de puntos y enunciado literal de los 6 ejercicios de la consigna |
| [12_casos_manuales.md](12_casos_manuales.md) | *Extra.* Casos manuales exigidos, comprobación guiada del precio histórico y trampas de la verificación headless |

## Quick Start para Desarrolladores

1. **Entender el dominio** → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. **Entender los datos** → [04](04_modelo_de_datos.md)
3. **Entender las reglas** → [05](05_reglas_de_negocio.md)
4. **Entender la arquitectura** → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. **Implementar** → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. **Antes de codificar** → [10](10_preguntas_abiertas.md)
7. **Saber qué exige la consigna** → [11](11_criterios_evaluacion.md), [12](12_casos_manuales.md)

## Resumen Ejecutivo

**Librería El Estante** es el frontend de un parcial de Programación III (100 puntos, 6 ejercicios) que presenta el catálogo de una librería y registra libros, clientes y ventas. Se construye **únicamente con HTML5, CSS3 y JavaScript nativos**, sin frameworks, sin CDN, sin build y sin backend: se abre con doble clic desde `file://` y todos los datos son ficticios y viven en el navegador.

El HTML y el CSS ya están **implementados y verificados** (Ejercicios 1 y 2). Quedan pendientes los ejercicios 3 a 6, que agregan los datos, el render, las altas, la venta, la persistencia y el README. Cada ejercicio es un **change de OpenSpec** independiente: el equipo toma el suyo y ejecuta su fase `apply` siguiendo su `tasks.md`.
