import { scenarios } from "../data/scenarios";
import type { Incident, Severity } from "../schemas/simulation";
import { isResolved } from "./simulation";

export function filterIncidents(
  incidents: Incident[],
  severity: Severity | "ALL",
  status: "active" | "resolved" | "all",
  query: string,
) {
  const rank = { HIGH: 0, MEDIUM: 1, INFO: 2 };
  const search = query.trim().toLocaleLowerCase("es");
  return incidents
    .filter(
      (incident) =>
        (severity === "ALL" || incident.severity === severity) &&
        (status === "all" ||
          isResolved(incident) === (status === "resolved")) &&
        `${incident.id} ${scenarios[incident.scenario].title} ${scenarios[incident.scenario].place}`
          .toLocaleLowerCase("es")
          .includes(search),
    )
    .sort(
      (a, b) =>
        rank[a.severity] - rank[b.severity] || a.createdAt - b.createdAt,
    );
}

export function nextIncident(incidents: Incident[]) {
  return (
    incidents.find((incident) => incident.status === "IN_REVIEW") ??
    filterIncidents(incidents, "ALL", "active", "")[0]
  );
}
