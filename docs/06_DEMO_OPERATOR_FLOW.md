# Recorrido de la consola de práctica

## Propósito

`/demo` ilustra cómo TAKYA podría ayudar a revisar avisos simultáneos con contexto y una decisión humana registrada. No ejecuta acciones sobre cámaras o equipos reales.

## Entrada y roles

1. En `/login`, elegir **Operador** o **Supervisión**. El nombre es opcional y sirve solo para identificar el registro local.
2. `/demo` requiere haber iniciado una práctica en la pestaña. Si no existe el marcador local de acceso, vuelve a `/login`. Este control es visual y no equivale a autenticación. El rol se puede cambiar desde la cabecera durante la práctica.
3. El operador puede iniciar una revisión, marcar las dos vistas disponibles, comprender señales y decidir. Supervisión puede consultar los casos y confirmar la recepción de una derivación; no puede cambiar la decisión inicial.

## Recorrido sugerido para presentar

1. **Inicio:** mostrar cómo 9 avisos de ejemplo se agrupan en 3 casos. Explicar que son cifras de esta sesión, no resultados medidos de TAKYA.
2. **Casos:** filtrar por prioridad o estado, abrir «Posible humo» y observar los dos puntos de vista. La vista aérea está sin conexión.
3. **Observar:** recorrer los 30 segundos ilustrados y marcar cada vista. Se puede volver atrás sin perder las marcas.
4. **Comprender:** revisar los avisos que llevaron a agrupar el caso, la explicación, lo visible y lo que falta confirmar.
5. **Decidir:** elegir Verificar, Escalar o Descartar, indicar un motivo y confirmar. La interfaz no permite saltar los pasos anteriores.
6. **Supervisión:** cambiar de rol, abrir la derivación y marcarla recibida.
7. **Historial:** consultar cada evento y descargar el registro JSON. Al recargar, la sesión continúa en el mismo navegador.
8. **K8 IA:** abrir la sección o pulsar el perro robot 3D en la esquina. Hacer una pregunta sobre la práctica y comprobar la respuesta y su documento fuente. K8 se abstiene de responder temas fuera de la base curada.
9. **Ajustes:** editar el nombre, cambiar tamaño de texto, transparencia, contraste, movimiento y fondo; configurar el ritmo, exportar, reiniciar o cerrar la práctica. Cerrar borra perfil, casos e historial locales y vuelve a `/login`.

## Variantes y límites

- Los otros casos ilustran material junto a un acceso y movimiento por ramas/sombras. Ambos admiten cualquiera de las tres decisiones si se justifican.
- La llegada automática comienza pausada y tiene ritmos de 15, 30 o 60 segundos. También existe «Nuevo caso». Se detiene al llegar a 30 casos.
- «Reiniciar» pide confirmación y reemplaza la sesión local. Conviene descargar el historial antes si se desea conservarlo.
- El progreso «3 de 3» reconoce terminar las revisiones iniciales. No puntúa rapidez ni favorece escalar.
- Todo el material visual es ilustrado. Las cámaras, prioridades, explicación y confianza son datos de ejemplo. Una solicitud de apoyo no despacha recursos.

## Mapa técnico

| Carpeta | Responsabilidad |
| --- | --- |
| `src/features/demo/schemas/` | Contratos Zod para perfil, caso, decisión, auditoría y sesión. |
| `src/features/demo/model/` | Máquina de estados pura, filtros, métricas y recuperación. |
| `src/features/demo/hooks/` | Integración React con almacenamiento, temporizador y URL. |
| `src/features/demo/components/` | Entrada, consola, pasos, escenas ilustradas, decisiones e historial. |
| `src/features/demo/data/` | Textos y escenarios deterministas de la práctica. |

La cobertura del motor está en `src/features/demo/model/simulation.test.ts` y se ejecuta con `npm run test:demo`.
