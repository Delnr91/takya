import {
  Check,
  CircleHelp,
  CloudFog,
  Layers3,
  Leaf,
  TriangleAlert,
  X,
  Flame,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { severityLabels, statusLabels } from "../data/scenarios";
import type { Incident, Scenario } from "../schemas/simulation";

export const scenarioIcons: Record<Scenario, LucideIcon> = {
  smoke: CloudFog,
  rubble: Layers3,
  movement: Leaf,
  dumping: Truck,
  fire: Flame,
  uncertain: CircleHelp,
};
export function Pictogram({
  icon: Icon,
  tone = "sage",
  small = false,
}: {
  icon: LucideIcon;
  tone?: string;
  small?: boolean;
}) {
  return (
    <span
      className={`demo-pictogram demo-tone-${tone}${small ? " demo-pictogram-small" : ""}`}
    >
      <Icon aria-hidden="true" strokeWidth={1.7} />
    </span>
  );
}
export function StatusBadge({ incident }: { incident: Incident }) {
  const resolved = ["VERIFIED", "ESCALATED", "DISMISSED"].includes(
    incident.status,
  );
  const Icon = resolved
    ? Check
    : incident.severity === "HIGH"
      ? TriangleAlert
      : CircleHelp;
  return (
    <span
      className={`demo-badge demo-badge-${resolved ? "resolved" : incident.severity.toLowerCase()}`}
    >
      <Icon size={14} aria-hidden="true" />
      {resolved
        ? statusLabels[incident.status]
        : severityLabels[incident.severity]}
    </span>
  );
}
export function Dialog({
  title,
  children,
  onClose,
  className = "",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (opener instanceof HTMLElement && opener.isConnected)
        opener.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`demo-dialog ${className}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="demo-dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="demo-icon-button"
          aria-label="Cerrar ventana"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="demo-empty">
      <Pictogram icon={Check} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function timeLabel(timestamp: number) {
  return new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}
