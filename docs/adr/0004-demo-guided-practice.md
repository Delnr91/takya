# ADR 0004: Práctica guiada de la consola

## Estado

Aceptado (2026-09-29). Implementación local de `/demo`; la V1 pública de `main` continúa centrada en `/landing`.

## Contexto

La demostración debe permitir comprender la propuesta de TAKYA sin conocer software de televigilancia. Las referencias de `public/referencias/referencias/referencias dmo/` muestran vistas claras, pictogramas y una secuencia de observación, comprensión y decisión. El MVP no tiene cámaras, inferencia ni despacho reales.

## Decisión

1. Presentar cada caso en tres pasos visibles: **Observar → Comprender → Decidir**. El operador marca dos vistas disponibles y reconoce la explicación antes de decidir. Una tercera fuente se muestra sin conexión para practicar el tratamiento de información incompleta.
2. Usar escenas SVG ilustradas, avisos y niveles de confianza ficticios identificados como simulación. Separar lo visible, la interpretación y lo que aún se desconoce.
3. Mantener los roles dentro de una sola sesión de práctica: operador revisa y decide; supervisión consulta evidencia y marca la recepción de derivaciones. El selector de rol es una vista de ejercicio, no una autorización de seguridad.
4. Ejecutar el motor como transiciones puras validadas con Zod. Guardar sesión y registro de eventos en `localStorage`, con recuperación segura si la versión o los datos son incompatibles. El perfil de entrada se guarda en `sessionStorage`.
5. Iniciar las llegadas automáticas en pausa. El usuario puede crear un caso o elegir intervalos de 15, 30 o 60 segundos. El límite es de 30 casos y el temporizador no crea casos en una pestaña oculta.
6. Reconocer solo la revisión completa de los tres casos iniciales; no premiar velocidad ni tipo de decisión. Incluir controles de texto grande, menor transparencia y movimiento reducido.
7. Ofrecer Ajustes y una salida de práctica que borre los datos locales. El marcador de entrada en `sessionStorage` ordena el recorrido, pero no representa una credencial ni protege datos reales.

## Consecuencias

- La presentación se puede recorrer sin servicios externos. Los datos guardados pertenecen al navegador y se pierden al limpiar su almacenamiento.
- La interfaz no prueba detección, exactitud de IA ni tiempos de respuesta operativos. Los números del tablero describen únicamente la simulación local.
- El registro permite explicar qué hizo la persona y qué agrupó el simulador. La exportación JSON contiene el historial de práctica completo.
