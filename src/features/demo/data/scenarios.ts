import type { Outcome, Scenario, Severity } from "../schemas/simulation";

type ScenarioContent = {
  title: string;
  place: string;
  severity: Severity;
  summary: string;
  visible: string;
  unknown: string;
  explanation: string;
  confidence: number | null;
  verdict?: string;
  suggestion?: string;
  actionSteps?: readonly string[];
  signals: readonly [string, string, string];
  feedback: string;
};

export const scenarios: Record<Scenario, ScenarioContent> = {
  dumping: {
    title: "Posible descarga de residuos",
    place: "Bonilla / Juvenal Morla · Antofagasta",
    severity: "MEDIUM",
    summary:
      "Dos tramos de una cámara: material junto a un camión y su salida.",
    visible:
      "Un camión está detenido junto a residuos. Se ve manipulación de material y luego la salida del vehículo; el acopio permanece.",
    unknown:
      "Los extractos no prueban quién originó todo el acopio ni si la actividad tenía autorización.",
    explanation:
      "Reunimos la manipulación de material, la presencia del camión y su salida en un solo caso. Los dos clips proceden de la misma cámara: no cuentan como dos confirmaciones independientes.",
    confidence: null,
    verdict: "Material y actividad visibles",
    suggestion: "Solicitar revisión en terreno",
    actionSteps: [
      "Revisa los dos tramos y describe solo lo visible.",
      "Si corresponde, deriva a supervisión para comprobar autorización y retiro.",
      "Registra el motivo; no atribuyas responsabilidad solo por la presencia del camión.",
    ],
    signals: [
      "Vehículo junto al acopio",
      "Manipulación de material",
      "Salida del camión; residuos permanecen",
    ],
    feedback:
      "La evidencia permite registrar actividad y residuos. La infracción y la responsabilidad necesitan antecedentes adicionales.",
  },
  fire: {
    title: "Fuego y humo visibles",
    place: "La Chimba · Antofagasta · ubicación del reportaje",
    severity: "HIGH",
    summary:
      "Fuego, personal de respuesta y humo: tres extractos para comprender el contexto.",
    visible:
      "Se ven llamas en material acumulado, personal de respuesta próximo al fuego y humo en otros tramos del reportaje.",
    unknown:
      "No están confirmados la hora exacta, la continuidad entre tomas, el perímetro ni si la respuesta registrada sigue vigente.",
    explanation:
      "Los clips aportan tres aspectos del episodio documentado: foco, respuesta y visibilidad. La presencia de personal de respuesta no permite dar la emergencia por controlada. La continuidad temporal entre tomas no está comprobada.",
    confidence: null,
    verdict: "Fuego visible; estado por confirmar",
    suggestion: "Escalar para confirmar la respuesta",
    actionSteps: [
      "Revisa foco, respuesta y humo.",
      "Deriva a supervisión para confirmar situación y apoyo ya coordinado.",
      "Registra lo observado y evita duplicar solicitudes de recursos.",
    ],
    signals: [
      "Llamas sobre material acumulado",
      "Personal de respuesta junto al foco",
      "Humo y focos restantes",
    ],
    feedback:
      "Ver equipos de respuesta aporta contexto, pero no confirma que la emergencia haya terminado. La coordinación evita duplicar avisos.",
  },
  uncertain: {
    title: "Camión junto a material",
    place: "Sector exvertedero · Antofagasta · ubicación del reportaje",
    severity: "INFO",
    summary: "Un registro móvil aporta contexto, pero no muestra una descarga.",
    visible:
      "Se ve un camión en un camino con material acumulado a los costados. La cámara se mueve y el vehículo entra y sale del encuadre.",
    unknown:
      "No se observa la descarga ni se puede atribuir el material a ese camión. Tampoco hay otra toma que lo confirme.",
    explanation:
      "Agrupamos las señales del mismo registro y conservamos una prioridad informativa: la cercanía de un vehículo al material no basta para afirmar que lo descargó. Este caso exige más contexto antes de atribuir una infracción.",
    confidence: null,
    verdict: "Evidencia insuficiente para atribuir descarga",
    suggestion: "Buscar contexto antes de actuar",
    actionSteps: [
      "Mira el momento del vehículo y el entorno.",
      "Si hace falta, solicita otra vista o revisión del lugar.",
      "Puedes descartar la atribución al vehículo dejando registrado el motivo.",
    ],
    signals: [
      "Material al costado del camino",
      "Vehículo visible en el sector",
      "Descarga no visible en el extracto",
    ],
    feedback:
      "TAKYA también ayuda a reconocer cuándo la evidencia no alcanza. Un vehículo cerca de residuos no demuestra una descarga.",
  },
  smoke: {
    title: "Posible humo",
    place: "Recinto norte · Antofagasta",
    severity: "HIGH",
    summary: "Dos vistas muestran una columna junto al galpón.",
    visible:
      "Una columna clara se eleva junto al galpón. Hay personas cerca del acceso.",
    unknown: "La imagen no permite confirmar el origen ni si hay un incendio.",
    explanation:
      "Se agruparon señales del mismo sector y del mismo intervalo. La presencia de personas sugiere revisar este caso primero.",
    confidence: 89,
    signals: [
      "Columna visible junto al galpón",
      "Segunda vista del mismo acceso",
      "Personas próximas al sector",
    ],
    feedback:
      "Una señal de humo pide contexto. La imagen por sí sola no confirma un incendio: registra lo observado y explica si hace falta apoyo.",
  },
  rubble: {
    title: "Material junto al acceso",
    place: "Acceso La Chimba · Antofagasta",
    severity: "MEDIUM",
    summary: "Varios avisos podrían referirse a un mismo depósito.",
    visible:
      "Hay material apilado en el borde del acceso y un vehículo próximo.",
    unknown: "No sabemos quién dejó el material ni si existe autorización.",
    explanation:
      "Los avisos comparten lugar y tiempo. Agruparlos ayuda a revisar un solo caso, sin atribuir responsabilidades a las personas visibles.",
    confidence: 84,
    signals: [
      "Material visible junto al camino",
      "Vehículo próximo al acceso",
      "Mismo material desde otra vista",
    ],
    feedback:
      "Confirmar material visible no confirma una infracción. La autorización y la responsabilidad requieren información adicional.",
  },
  movement: {
    title: "Movimiento en el patio",
    place: "Patio municipal · Antofagasta",
    severity: "INFO",
    summary: "Un cambio de sombra activó varios avisos cercanos.",
    visible:
      "Las ramas y su sombra cambian de posición. El acceso se mantiene despejado.",
    unknown:
      "Una vista parcial no permite asegurar qué ocurre fuera de cuadro.",
    explanation:
      "La señal se repite en dos vistas. No se ve una persona cruzando el acceso; conviene comparar antes de considerar una respuesta.",
    confidence: 72,
    signals: [
      "Cambio de sombra en el suelo",
      "Ramas en movimiento",
      "Acceso visible despejado",
    ],
    feedback:
      "Un aviso de movimiento no equivale a un riesgo. Comparar las vistas ayuda a reconocer señales ambientales y evitar respuestas innecesarias.",
  },
};

export const scenarioOrder: readonly Scenario[] = [
  "dumping",
  "fire",
  "uncertain",
];
export const severityLabels: Record<Severity, string> = {
  HIGH: "Revisar primero",
  MEDIUM: "Atención media",
  INFO: "Informativo",
};
export const statusLabels: Record<IncidentStatus, string> = {
  PENDING: "Por revisar",
  IN_REVIEW: "En revisión",
  VERIFIED: "Verificado",
  ESCALATED: "Derivado",
  DISMISSED: "Descartado",
};
type IncidentStatus = "PENDING" | "IN_REVIEW" | Outcome;
export const decisionLabels: Record<Outcome, string> = {
  VERIFIED: "Verificar",
  ESCALATED: "Escalar",
  DISMISSED: "Descartar",
};
export const reasons: Record<Outcome, readonly string[]> = {
  VERIFIED: [
    "Hecho visible, sin urgencia inmediata",
    "Requiere seguimiento preventivo",
  ],
  ESCALATED: [
    "Hace falta una revisión en terreno",
    "Posible riesgo para personas",
  ],
  DISMISSED: [
    "Movimiento causado por el entorno",
    "Aviso repetido sin una nueva situación",
    "Actividad habitual sin riesgo visible",
  ],
};
