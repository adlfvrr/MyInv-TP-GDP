# Pruebas integrales de aceptación — T12 (#12)

**Proyecto:** MyInv · Distribuidora "La previa" · Etapa 2
**Versión probada:** `main` con los Módulos 1 a 4 integrados (PR #13, #14, #16 y #17)
**Participantes:** Adolfo Vera (@adlfvrr), Gabriel Aguirre (@GabiAguirre07), Lucas Vitale (@Vitale71)
**Datos de prueba:** `database/02_seed.sql` (16 bebidas, 4 de ellas en stock mínimo)

## Navegadores

| Navegador | Probó | Resultado |
| :-- | :-- | :-: |
| Google Chrome | Gabriel Aguirre | ✅ OK |
| Brave | Adolfo Vera | ✅ OK |
| Firefox | — | No probado (ver modificación respecto del plan, Tarea 3.6) |
| Edge | — | No probado (ver modificación respecto del plan, Tarea 3.6) |

## Resultados por criterio de aceptación (propuesta MyInv)

| # | Criterio | Qué se verificó | Resultado |
| :-: | :-- | :-- | :-: |
| 1 | **Corrección funcional** — registrar correctamente entradas y salidas, reflejando el stock en tiempo real | Login por rol; ABM de productos; entradas que suman y salidas que descuentan stock; salida mayor al disponible rechazada ("Stock insuficiente"); stock actualizado en pantalla, en el catálogo, en el historial y en la tabla `movimiento` | ✅ Cumple |
| 2 | **Rendimiento** — consultas y actualizaciones en menos de 5 s | Catálogo de productos: **38 ms** · Alertas + reporte de existencias: **34 ms** · Historial de movimientos: **14 ms** · Registro de movimientos: verificado dentro del límite (sin medición en ms registrada) | ✅ Cumple |
| 3 | **Usabilidad** — un empleado sin capacitación previa carga un movimiento siguiendo la interfaz | Lo probó un familiar de un integrante, sin capacitación previa: cargó un movimiento solo, siguiendo la pantalla, sin dudas ni dificultades | ✅ Cumple |
| 4 | **Compatibilidad** — funciona en los principales navegadores de escritorio | Recorrido completo en Chrome y Brave sin errores | ⚠️ Cumple en Chrome y Brave; Firefox y Edge no probados |
| 5 | **Alertas** — notificación automática al alcanzar el stock mínimo | Aviso al registrar una salida que deja el producto en el mínimo; panel de alertas ordenado por faltante; aviso destacado en Inicio | ✅ Cumple |

## Bugs encontrados en T12

Ninguno (0).

## Conclusión

Los criterios de corrección funcional, rendimiento, usabilidad y alertas se cumplen. La compatibilidad se validó en Chrome y Brave en lugar de Chrome, Firefox y Edge, cambio registrado como modificación respecto del plan inicial.
