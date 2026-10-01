import type { Simulation } from "../schemas/simulation";

export function downloadPracticeHistory(state: Simulation) {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          simulation: true,
          sessionId: state.sessionId,
          exportedAt: new Date().toISOString(),
          entries: state.audit,
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "takya-historial-practica.json";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
