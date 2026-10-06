# Recorrido de la demo funcional

La consola reproduce evidencia grabada, presenta señales sincronizadas, permite comprender contexto, registrar decisiones, recibir derivaciones como Supervisión y conservar/exportar historial local. K8 responde con Groq desde guías curadas. No hay detección automática de video, cámaras conectadas ni despacho real.

## Entrada y presentación

1. Desde `/home`, las dos tarjetas usan una cortina de transición: proyecto hacia `/landing`, consola hacia `/login`. La landing conserva su identidad y acceso a la demo.
2. Elige Operador en el login. Es acceso de práctica sin contraseña, no autenticación operativa.
3. Inicio reúne 9 señales curadas en 3 casos. Son cifras de la sesión, no resultados medidos de eficacia.
4. En Casos, filtra por prioridad/estado y elige Lista o Carrusel. El carrusel usa botones, flechas y arrastre opcional; no avanza solo ni reproduce varios videos.
5. En Observar, pulsa Ver el clip, usa los botones de momentos importantes, pausa o retira los recuadros. Marca Ya revisé este clip y repite en cada clip disponible. Un error de carga bloquea la marca y ofrece reintento.
6. En Comprender, distingue hechos visibles, incertidumbre y siguiente acción sugerida. La explicación cita señales del caso sin inventar porcentajes de certeza.
7. En Decidir, verifica, escala o descarta, con motivo. No se puede saltar evidencia ni explicación.
8. Cambia a Supervisión, abre una derivación y confirma recepción. El perfil no sustituye la decisión inicial del operador.
9. Historial muestra cada acción y permite descargar el registro. Recargar conserva la práctica en este navegador.
10. La mascota K8 abre una consulta breve centrada sin cambiar de pantalla. La cabecera permite ocultarla; la sección K8 IA permanece. El chat redirige temas ajenos a la plataforma.
11. Ajustes ofrece lectura, contraste, paneles sólidos, movimiento, fondo, perfil y ritmo. Ocultar ayuda lateral amplía evidencia con Motion; pasos y decisiones siguen visibles.

## Casos

| Caso                         | Clips             | Lectura responsable                                                 | Sugerencia                                                 |
| ---------------------------- | ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| Posible descarga de residuos | 2 de una cámara   | Material/manipulación visibles; origen y autorización sin confirmar | Solicitar revisión en terreno                              |
| Fuego y humo visibles        | 3 de un reportaje | Llamas, humo y respuesta; continuidad/estado actual sin comprobar   | Confirmar estado y coordinación antes de duplicar recursos |
| Camión junto a material      | 1 móvil           | Descarga no visible                                                 | Buscar contexto antes de atribuir el hecho                 |

Los lugares proceden del material de origen; no son geolocalización calculada. Los tiempos de llegada son de la simulación, no de captura. Recortes de una fuente no son cámaras independientes ni una secuencia continua verificada.

## Material y compatibilidad

El [registro de edición](media/README.md) describe cortes, procedencia y límites. Los originales se conservan en `.media-source/`, excluidos de Git y de la web pública. Los derivados están en `public/videos/incidents/`. El plan/manifiesto permiten reproducir los cortes con FFmpeg. No se presenta este material como capturado por TAKYA.

Las sesiones ilustradas se conservan. Un aviso ofrece cargar casos en video mediante el reinicio con confirmación. No se borran decisiones al migrar. Al recuperar una sesión se validan catálogo, fuentes y momentos, además de Zod y reglas de decisión.

Llegadas pausadas inicialmente, ritmos de 15/30/60 segundos, máximo 30 casos. Nuevo caso reutiliza catálogo; no detecta nuevos hechos. El progreso reconoce completar revisiones, sin puntuar rapidez ni premiar escalar.

## Arquitectura

`schemas/media.ts` valida el catálogo; `data/media.ts` relaciona clips/momentos; `model/simulation.ts` gobierna estados/persistencia; `IncidentVideoPlayer` reproduce; `ExplanationPanel` explica; `DecisionDialog` registra criterio. El chat generativo es independiente y no recibe videos. Ver [ADR 0005](adr/0005-recorded-evidence-and-cognitive-motion.md).
