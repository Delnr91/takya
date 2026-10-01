/** Curated, versioned answers for the local documentary companion. */
export const knowledge = [
  {
    id: "flujo",
    title: "Cómo revisar un caso",
    summary:
      "Abre un caso, compara las dos vistas disponibles, revisa la explicación y lo que falta confirmar. Después elige Verificar, Escalar o Descartar y registra un motivo. La vista aérea sin conexión no bloquea la revisión.",
    keywords: [
      "revisar",
      "caso",
      "observar",
      "camara",
      "evidencia",
      "flujo",
      "pasos",
    ],
    source: "docs/06_DEMO_OPERATOR_FLOW.md · Recorrido sugerido",
  },
  {
    id: "criterio",
    title: "Qué significa la prioridad",
    summary:
      "La prioridad de esta práctica viene de escenarios predefinidos. Es una sugerencia visual para ordenar la atención, no una detección real ni una certeza. Contrasta señales y fuentes antes de decidir.",
    keywords: [
      "prioridad",
      "alarma",
      "señales",
      "explicacion",
      "confianza",
      "riesgo",
    ],
    source: "docs/07_ARQUITECTURA_IA_FIRST.md · Situación actual",
  },
  {
    id: "humano",
    title: "Quién toma la decisión",
    summary:
      "El operador decide y justifica. Supervisión puede consultar casos y recibir una derivación, pero no reemplaza la decisión inicial. K8 no ejecuta acciones sobre cámaras, personas ni equipos reales.",
    keywords: [
      "decidir",
      "decision",
      "operador",
      "supervision",
      "escalar",
      "humano",
      "terreno",
    ],
    source: "docs/06_DEMO_OPERATOR_FLOW.md · Entrada y roles",
  },
  {
    id: "datos",
    title: "Qué datos se guardan",
    summary:
      "El perfil de práctica, los casos y el historial quedan en este navegador. Puedes descargar el registro desde Historial o Ajustes. Cerrar sesión borra la práctica local; no es una cuenta real.",
    keywords: [
      "datos",
      "guardar",
      "historial",
      "privacidad",
      "sesion",
      "descargar",
      "borrar",
    ],
    source: "docs/06_DEMO_OPERATOR_FLOW.md · Variantes y límites",
  },
  {
    id: "ia",
    title: "Qué hace la IA en esta versión",
    summary:
      "La consola usa reglas y escenarios locales. K8 recupera respuestas redactadas a partir de documentación curada; no llama a una API ni genera conocimiento nuevo. En una versión operativa, un servicio protegido necesitaría evidencia verificable, permisos y evaluación antes de asistir decisiones.",
    keywords: [
      "ia",
      "inteligencia",
      "k8",
      "rag",
      "modelo",
      "chat",
      "funciona",
      "software",
    ],
    source:
      "docs/07_ARQUITECTURA_IA_FIRST.md · Situación actual y ruta de implementación",
  },
  {
    id: "limites",
    title: "Límites de la demostración",
    summary:
      "Las cámaras, escenas, avisos y cifras son ejemplos. Ningún botón despacha recursos ni se conecta a sistemas de televigilancia. No uses esta práctica para evaluar una situación real.",
    keywords: [
      "demo",
      "simulacion",
      "real",
      "limites",
      "camaras",
      "conectar",
      "seguridad",
    ],
    source: "docs/06_DEMO_OPERATOR_FLOW.md · Propósito y límites",
  },
] as const;

export type KnowledgeEntry = (typeof knowledge)[number];
