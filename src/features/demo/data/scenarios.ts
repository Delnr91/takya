import type { Outcome, Scenario, Severity } from "../schemas/simulation";

type ScenarioContent = {
  title: string;
  place: string;
  severity: Severity;
  summary: string;
  visible: string;
  unknown: string;
  explanation: string;
  confidence: number;
  signals: readonly [string, string, string];
  feedback: string;
};

export const scenarios: Record<Scenario, ScenarioContent> = {
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
  "smoke",
  "rubble",
  "movement",
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
