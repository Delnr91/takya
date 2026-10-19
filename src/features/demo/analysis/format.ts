// Formato visible en español (es-CL): coma decimal y estados traducidos.

export function seconds(ms: number, digits = 1) {
  return (ms / 1000).toLocaleString("es-CL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function mebibytes(bytes: number) {
  return (bytes / 1048576).toLocaleString("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function candidatesFound(count: number) {
  if (count === 0) return "Sin candidatos";
  return count === 1
    ? "1 candidato encontrado"
    : `${count} candidatos encontrados`;
}

export const reviewStateLabels: Record<string, string> = {
  PENDING: "Pendiente de revisión",
  IN_REVIEW: "En revisión",
  VERIFIED: "Verificado en el ejercicio",
  DISMISSED: "Candidato descartado",
  ESCALATED: "Revisión de supervisión solicitada en el ejercicio",
};
