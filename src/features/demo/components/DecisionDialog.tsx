import { useState } from "react";
import { Check, Send } from "lucide-react";
import {
  decisionSchema,
  type Decision,
  type Incident,
  type Outcome,
} from "../schemas/simulation";
import { decisionLabels, reasons, scenarios } from "../data/scenarios";
import { Dialog } from "./DemoPrimitives";

export function DecisionDialog({
  incident,
  outcome,
  onConfirm,
  onClose,
}: {
  incident: Incident;
  outcome: Outcome;
  onConfirm: (decision: Decision) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [destination, setDestination] = useState<
    "Supervisión municipal" | "Equipo en terreno"
  >("Supervisión municipal");
  const [error, setError] = useState("");
  return (
    <Dialog title={`${decisionLabels[outcome]} el caso`} onClose={onClose}>
      <p className="demo-muted">
        {incident.id} · {scenarios[incident.scenario].title}
      </p>
      <p className="demo-dialog-explanation">
        {outcome === "ESCALATED"
          ? "Dejarás una solicitud de apoyo en la bandeja de supervisión de esta práctica. No se envía ninguna alerta real."
          : outcome === "VERIFIED"
            ? "Confirmas lo observado. Verificar no significa que la situación esté resuelta en terreno."
            : "Registrarás por qué este aviso no requiere continuar la revisión."}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = decisionSchema.safeParse({
            outcome,
            reason,
            notes,
            destination: outcome === "ESCALATED" ? destination : null,
          });
          if (!parsed.success) {
            setError(
              parsed.error.issues[0]?.message ?? "Revisa el formulario.",
            );
            return;
          }
          onConfirm(parsed.data);
        }}
      >
        <fieldset className="demo-reasons">
          <legend>¿Por qué tomas esta decisión?</legend>
          {reasons[outcome].map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="reason"
                value={item}
                checked={reason === item}
                onChange={() => {
                  setReason(item);
                  setError("");
                }}
                required
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
        {outcome === "ESCALATED" ? (
          <label className="demo-field">
            Destino de la práctica
            <select
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value === "Equipo en terreno"
                    ? "Equipo en terreno"
                    : "Supervisión municipal",
                )
              }
            >
              <option>Supervisión municipal</option>
              <option>Equipo en terreno</option>
            </select>
          </label>
        ) : null}
        <label className="demo-field">
          Añadir una observación <span className="demo-muted">(opcional)</span>
          <textarea
            value={notes}
            maxLength={240}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Describe solo lo que pudiste observar."
          />
        </label>
        {error ? (
          <p role="alert" className="demo-error">
            {error}
          </p>
        ) : null}
        <div className="demo-action-row">
          <button
            type="button"
            className="demo-button demo-button-secondary"
            onClick={onClose}
          >
            Volver a revisar
          </button>
          <button type="submit" className="demo-button demo-button-primary">
            {outcome === "ESCALATED" ? (
              <Send aria-hidden="true" />
            ) : (
              <Check aria-hidden="true" />
            )}
            Confirmar decisión
          </button>
        </div>
      </form>
    </Dialog>
  );
}
