"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCheck, Eye, Lightbulb, ShieldCheck } from "lucide-react";
import {
  api,
  evidenceUrl,
  incidentSchema,
  post,
  type Incident,
} from "./contracts";
import { reviewStateLabels, seconds } from "./format";

const unknownLabels: Record<string, string> = {
  CAPTURE_TIME_UNKNOWN: "La fecha de captura es desconocida.",
  IDENTITY_NOT_ASSESSED: "No se identifica a ninguna persona.",
  INTENT_NOT_ASSESSED: "No se determina intención ni delito.",
  AUDIO_NOT_ASSESSED: "El audio no se analiza.",
  CONTEXT_INCOMPLETE_START: "La fuente no contiene los 15 s previos completos.",
  CONTEXT_INCOMPLETE_END:
    "La fuente no contiene los 20 s posteriores completos.",
  DERIVATIVE_MAPPING_UNPROVEN:
    "Se muestra la fuente completa; no se ofrece un corte temporal como exacto.",
};

export function ReviewCase({
  incident,
  update,
  run,
  busy,
  onExport,
}: {
  incident: Incident;
  update: (item: Incident) => void;
  run: (operation: () => Promise<void>) => void;
  busy: boolean;
  onExport: () => void;
}) {
  const [viewed, setViewed] = useState(false);
  const [stills, setStills] = useState<string[]>([]);
  const [understood, setUnderstood] = useState(false);
  const [reason, setReason] = useState("");
  const [outcome, setOutcome] = useState("VERIFY");
  const [reasonCode, setReasonCode] = useState("SEEN_IN_VIDEO");
  const decided = ["VERIFIED", "DISMISSED", "ESCALATED"].includes(
    incident.review_state,
  );

  return (
    <section className="analysis-card" aria-labelledby="review-heading">
      <div className="analysis-section-heading">
        <Eye aria-hidden="true" />
        <div>
          <span className="analysis-eyebrow">REVISIÓN HUMANA</span>
          <h2 id="review-heading">Observar, comprender, decidir</h2>
        </div>
      </div>
      <p>{incident.reasons.map((r) => r.text).join(" ")}</p>
      <video
        controls
        preload="metadata"
        src={evidenceUrl(incident.source_id)}
        aria-label="Fuente completa del candidato"
      />
      <p className="analysis-muted">
        Contexto solicitado: {seconds(incident.context.requested.start_ms)}–
        {seconds(incident.context.requested.end_ms)} s. Registro mostrado:{" "}
        {seconds(incident.context.effective.start_ms)}–
        {seconds(incident.context.effective.end_ms)} s.
      </p>
      <label className="analysis-check">
        <input
          type="checkbox"
          checked={viewed}
          onChange={(e) => setViewed(e.target.checked)}
        />
        He revisado el registro completo.
      </label>
      <div className="analysis-stills">
        {incident.stills.map((still) => (
          <figure key={still.id}>
            {/* Private evidence must go directly through its session-authorized endpoint. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={evidenceUrl(still.id)}
              alt={`Fotograma limpio de la fuente a ${seconds(still.pts_ms, 2)} segundos`}
              loading="lazy"
            />
            <figcaption>
              <label className="analysis-check">
                <input
                  type="checkbox"
                  checked={stills.includes(still.id)}
                  onChange={(e) =>
                    setStills((old) =>
                      e.target.checked
                        ? [...old, still.id]
                        : old.filter((id) => id !== still.id),
                    )
                  }
                />
                Revisé {seconds(still.pts_ms, 2)} s
              </label>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="analysis-context">
        <h3>
          <Lightbulb aria-hidden="true" /> Lo que sabemos y lo que falta
        </h3>
        <ul>
          {incident.unknowns.map((code) => (
            <li key={code}>{unknownLabels[code] ?? code}</li>
          ))}
        </ul>
        <p>
          El score es una señal del detector. La continuidad por cajas puede
          equivocarse; no demuestra que sea siempre la misma persona.
        </p>
        <label className="analysis-check">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
          />
          Comprendo estos límites y revisaré el candidato con criterio humano.
        </label>
      </div>
      {incident.review_state === "PENDING" ? (
        <button
          className="analysis-primary"
          disabled={
            busy ||
            !viewed ||
            !understood ||
            stills.length !== incident.stills.length
          }
          onClick={() =>
            run(async () => {
              update(
                await api(
                  `incidents/${incident.id}/review`,
                  incidentSchema,
                  post({
                    expected_revision: incident.revision,
                    viewed_clip: viewed,
                    viewed_stills: stills,
                    acknowledged_unknowns: understood,
                  }),
                ),
              );
            })
          }
        >
          <CheckCheck aria-hidden="true" /> Continuar a la decisión
        </button>
      ) : null}
      {incident.review_state === "IN_REVIEW" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(async () => {
              await api(
                `incidents/${incident.id}/decisions`,
                z.object({ id: z.string() }),
                post(
                  {
                    expected_revision: incident.revision,
                    type: outcome,
                    reason_code: reasonCode,
                    reason_text: reason.trim(),
                  },
                  `decision-${incident.id}-${incident.revision}`,
                ),
              );
              update(await api(`incidents/${incident.id}`, incidentSchema));
            });
          }}
        >
          <h3>Decidir con un motivo</h3>
          <div className="analysis-fields">
            <label>
              Decisión
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
              >
                <option value="VERIFY">Verificar en el ejercicio</option>
                <option value="DISMISS">Descartar candidato</option>
                <option value="ESCALATE">
                  Solicitar revisión de supervisión
                </option>
              </select>
            </label>
            <label>
              Motivo
              <select
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
              >
                <option value="SEEN_IN_VIDEO">Visible en el registro</option>
                <option value="NOT_A_PERSON">No es una persona</option>
                <option value="OUTSIDE_ZONE">Fuera de la zona</option>
                <option value="AUTHORIZED_ACTIVITY">
                  Actividad autorizada
                </option>
                <option value="UNCLEAR_NEEDS_SUPERVISOR">
                  No está claro; requiere supervisión
                </option>
                <option value="OTHER">Otro motivo</option>
              </select>
            </label>
          </div>
          <label>
            Explica tu decisión
            <textarea
              required
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </label>
          <p className="analysis-muted">
            Registro de un ejercicio. No envía instrucciones, avisos ni
            despachos reales.
          </p>
          <button
            className="analysis-primary"
            disabled={busy || !reason.trim()}
            type="submit"
          >
            Registrar decisión
          </button>
        </form>
      ) : null}
      {decided ? (
        <div className="analysis-success" role="status">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>Decisión registrada por el servidor</strong>
            <p>
              {reviewStateLabels[incident.review_state]} · revisión{" "}
              {incident.revision}
            </p>
            <button onClick={onExport} disabled={busy}>
              Preparar evidencia
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
