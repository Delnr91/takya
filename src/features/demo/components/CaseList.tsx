import { ArrowUpRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import type { Incident, Severity } from "../schemas/simulation";
import { scenarios, statusLabels } from "../data/scenarios";
import { filterIncidents } from "../model/selectors";
import {
  EmptyState,
  Pictogram,
  scenarioIcons,
  StatusBadge,
} from "./DemoPrimitives";

export function CaseList({
  incidents,
  severity,
  status,
  query,
  onFilter,
  onOpen,
}: {
  incidents: Incident[];
  severity: Severity | "ALL";
  status: "active" | "resolved" | "all";
  query: string;
  onFilter: (values: Record<string, string>) => void;
  onOpen: (id: string) => void;
}) {
  const items = filterIncidents(incidents, severity, status, query);
  return (
    <>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">Bandeja de revisión</p>
          <h1>Una señal a la vez.</h1>
          <p>TAKYA reúne los avisos. Tú revisas el contexto y decides.</p>
        </div>
        <Pictogram icon={SlidersHorizontal} />
      </div>
      <div className="demo-filters demo-panel">
        <label className="demo-search">
          <Search aria-hidden="true" />
          <input
            aria-label="Buscar caso o lugar"
            type="search"
            placeholder="Buscar caso o lugar"
            value={query}
            maxLength={80}
            onChange={(event) => onFilter({ q: event.target.value })}
          />
        </label>
        <label>
          Prioridad
          <select
            value={severity}
            onChange={(event) => onFilter({ severity: event.target.value })}
          >
            <option value="ALL">Todas</option>
            <option value="HIGH">Revisar primero</option>
            <option value="MEDIUM">Atención media</option>
            <option value="INFO">Informativo</option>
          </select>
        </label>
        <label>
          Estado
          <select
            value={status}
            onChange={(event) => onFilter({ status: event.target.value })}
          >
            <option value="active">Por atender</option>
            <option value="resolved">Con decisión</option>
            <option value="all">Todos los estados</option>
          </select>
        </label>
      </div>
      <p className="demo-result-count" aria-live="polite">
        {items.length} {items.length === 1 ? "caso" : "casos"}
      </p>
      <div className="demo-case-list">
        {items.map((incident) => (
          <button
            type="button"
            key={incident.id}
            className="demo-case-row demo-panel"
            onClick={() => onOpen(incident.id)}
          >
            <Pictogram
              icon={scenarioIcons[incident.scenario]}
              tone={incident.severity === "HIGH" ? "orange" : "sage"}
            />
            <span className="demo-case-copy">
              <span className="demo-eyebrow">
                {incident.id} · {statusLabels[incident.status]}
              </span>
              <strong>{scenarios[incident.scenario].title}</strong>
              <span>
                <MapPin size={14} aria-hidden="true" />
                {scenarios[incident.scenario].place}
              </span>
            </span>
            <span className="demo-case-meta">
              <StatusBadge incident={incident} />
              <span>
                {incident.alerts.length} avisos ·{" "}
                {incident.cameras.filter((camera) => camera.available).length}{" "}
                vistas disponibles
              </span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </button>
        ))}
      </div>
      {!items.length ? (
        <EmptyState title="No hay casos con estos filtros.">
          Prueba otra prioridad o elige todos los estados.{" "}
          <button
            type="button"
            className="demo-text-button"
            onClick={() => onFilter({ severity: "ALL", status: "all", q: "" })}
          >
            Limpiar filtros
          </button>
        </EmptyState>
      ) : null}
    </>
  );
}
