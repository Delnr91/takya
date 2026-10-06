/** Curated first steps matching the controls documented in the navigation guide. */
type Guidance = { question: string; answer: string };
const firstStep: Guidance = {
  question: "¿Cómo comienzo una revisión desde Inicio de TAKYA?",
  answer:
    "Pulsa Comenzar revisión en el caso recomendado de Inicio. Si ya lo abriste, verás Continuar revisión. ¿Lo encontraste?",
};
const steps: Readonly<Record<string, Guidance>> = {
  Inicio: firstStep,
  Casos: {
    question: "¿Cómo abro un caso desde la lista o el carrusel de Casos?",
    answer:
      "Elige una tarjeta de Casos y ábrela. Puedes usar la lista o el carrusel. ¿La encontraste?",
  },
  Cámaras: {
    question: "¿Cómo elijo un caso y abro un registro en Cámaras?",
    answer:
      "Usa Elige el caso para seleccionar el incidente que quieres observar. ¿Lo encontraste?",
  },
  Historial: {
    question: "¿Cómo consulto una decisión ya registrada en Historial?",
    answer:
      "Selecciona el caso en la lista de Historial. Verás su decisión, el motivo y los pasos registrados. ¿Lo encontraste?",
  },
  Guía: {
    question: "¿Cómo sigo el recorrido de la Guía de TAKYA?",
    answer:
      "Empieza por Observar en la Guía. Ahí verás cómo revisar los registros antes de decidir. ¿Lo encontraste?",
  },
  "K8 IA": {
    question: "¿Cómo consulto a K8 y escucho su respuesta?",
    answer:
      "Escribe lo que necesitas comprender en el campo de consulta de K8 IA y pulsa Enviar. ¿Lo encontraste?",
  },
  Ajustes: {
    question: "¿Cómo aumento la letra en Ajustes de TAKYA?",
    answer:
      "Activa Texto grande en Ajustes para ampliar la lectura. ¿Lo encontraste?",
  },
  "Revisión de un caso": {
    question: "¿Cómo reviso el video en Observar antes de decidir?",
    answer:
      "Pulsa Observar en los pasos del caso para consultar los clips. ¿Lo encontraste?",
  },
};
export function getQuickGuidance(
  section: string,
  options: {
    supervisor?: boolean;
    hasNextCase?: boolean;
    hasPendingReferral?: boolean;
  } = {},
): Guidance {
  if (
    section === "Inicio" &&
    (options.supervisor || options.hasNextCase === false)
  ) {
    return {
      question: "¿Qué puedo hacer desde Inicio de TAKYA?",
      answer:
        options.supervisor && options.hasPendingReferral
          ? "Selecciona una derivación pendiente en la bandeja de Inicio para consultar su contexto. ¿La encontraste?"
          : "Abre Historial para consultar los casos y las revisiones registradas. ¿Lo encontraste?",
    };
  }
  return steps[section] ?? firstStep;
}
