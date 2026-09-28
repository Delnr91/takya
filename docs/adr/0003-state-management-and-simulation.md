# ADR 0003: Gestión de Estado y Motor de Simulación en Cliente

## Estado
Aceptado (2026-09-28)

## Contexto
El MVP (Demo Day) no contará con un backend real de inferencia de video ni conexiones de socket reales a cámaras IP. Sin embargo, debe sentirse "vivo" durante las presentaciones ante jurados e inversionistas.

## Decisión
1. **Motor Ticker Local:** Construiremos un custom hook `useSimulationTicker` que inyecte incidentes pre-configurados en intervalos de tiempo para simular tráfico.
2. **Máquina de Estados en React:** Usaremos `useReducer` o estado local complejo estructurado para garantizar que los incidentes pasen por flujos estrictos (PENDING -> REVIEW -> VERIFIED/DISMISSED). No usaremos bibliotecas globales pesadas como Redux; el estado de la consola se aislará en el cliente bajo `features/demo`.
3. **Audit Trail en LocalStorage:** Las acciones de auditoría se persistirán localmente durante la sesión para demostrar persistencia básica.

## Consecuencias
- Presentación de Demo Day fluida y sin dependencias externas de red o backend.
- Riesgo de pérdida temporal de datos si se limpia el navegador, aceptable para un entorno de simulación MVP.
