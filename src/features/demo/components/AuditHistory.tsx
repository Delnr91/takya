import { useState } from "react";
import { ArrowRight, Download, History, Search, UserRound } from "lucide-react";
import type { AuditEntry, Simulation } from "../schemas/simulation";
import { scenarios } from "../data/scenarios";
import { downloadPracticeHistory } from "../model/exportPractice";
import {
  EmptyState,
  Pictogram,
  StatusBadge,
  timeLabel,
} from "./DemoPrimitives";

const actionLabels: Record<AuditEntry["action"], string> = {
  INCIDENT_RECEIVED: "Avisos agrupados",
  REVIEW_STARTED: "Revisión iniciada",
  EVIDENCE_VIEWED: "Vista observada",
  EXPLANATION_READ: "Contexto comprendido",
  VERIFIED: "Caso verificado",
  ESCALATED: "Apoyo solicitado",
  DISMISSED: "Caso descartado",
  RECEIVED: "Derivación recibida",
  ROLE_CHANGED: "Rol de práctica cambiado",
  PROFILE_UPDATED: "Nombre de práctica actualizado",
};

export function AuditHistory({
  state,
  onSelect,
  onOpen,
  incidentId,
}: {
  state: Simulation;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  incidentId?: string;
}) {
  const [query, setQuery] = useState("");
  const incident =
    state.incidents.find(
      (item) => item.id === (incidentId ?? state.selectedId),
    ) ?? state.incidents[0];
  const items = state.incidents.filter((item) =>
    `${item.id} ${scenarios[item.scenario].title} ${scenarios[item.scenario].place}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const entries = state.audit
    .filter((entry) => entry.incidentId === incident?.id)
    .sort((a, b) => a.timestamp - b.timestamp);
  return (
    <>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">Trazabilidad de tu práctica</p>
          <h1>Cada decisión deja contexto.</h1>
          <p>Consulta qué se revisó, quién decidió y por qué.</p>
        </div>
        <button
          type="button"
          className="demo-button demo-button-secondary"
          onClick={() => downloadPracticeHistory(state)}
        >
          <Download aria-hidden="true" />
          Descargar registro
        </button>
      </div>
      <div className="demo-history-grid">
        <section className="demo-panel demo-history-cases">
          <label className="demo-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar en el historial"
              placeholder="Buscar caso o lugar"
              maxLength={80}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`demo-history-case ${item.id === incident?.id ? "is-selected" : ""}`}
              onClick={() => onSelect(item.id)}
              aria-pressed={item.id === incident?.id}
            >
              <span>
                <small>{item.id}</small>
                <strong>{scenarios[item.scenario].title}</strong>
              </span>
              <StatusBadge incident={item} />
            </button>
          ))}
          {!items.length ? (
            <EmptyState title="No encontramos ese caso.">
              Prueba con otro nombre o borra la búsqueda.
            </EmptyState>
          ) : null}
        </section>
        <section className="demo-panel demo-history-detail">
          <div className="demo-explanation-title">
            <Pictogram icon={History} small />
            <div>
              <p className="demo-eyebrow">{incident?.id}</p>
              <h2>La historia de esta revisión</h2>
            </div>
          </div>
          <ol className="demo-audit-timeline">
            {entries.map((entry) => (
              <li key={entry.id}>
                <span
                  className={`demo-audit-dot ${entry.role === "SYSTEM" ? "is-system" : ""}`}
                />
                <div>
                  <span className="demo-mono">
                    {timeLabel(entry.timestamp)}
                  </span>
                  <h3>{actionLabels[entry.action]}</h3>
                  <p>{entry.detail}</p>
                  <small>
                    <UserRound size={13} aria-hidden="true" />
                    {entry.actor} ·{" "}
                    {entry.role === "SYSTEM"
                      ? "Simulador"
                      : entry.role === "OPERATOR"
                        ? "Operador"
                        : "Supervisión"}
                  </small>
                </div>
              </li>
            ))}
          </ol>
          {incident ? (
            <button
              type="button"
              className="demo-button demo-button-secondary"
              onClick={() => onOpen(incident.id)}
            >
              Volver a la evidencia <ArrowRight aria-hidden="true" />
            </button>
          ) : null}
        </section>
      </div>
      <p className="demo-hint">
        El historial se guarda en este navegador. Las sugerencias del simulador
        y las decisiones humanas quedan identificadas por separado.
      </p>
    </>
  );
}
