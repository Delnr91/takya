"use client";

import { useSearchParams } from "next/navigation";
import { severitySchema, type Severity } from "../schemas/simulation";

const views = [
  "turn",
  "cases",
  "review",
  "cameras",
  "history",
  "guide",
  "ai",
  "settings",
] as const;
export type DemoView = (typeof views)[number];
export function useDemoNavigation() {
  const params = useSearchParams();
  const rawView = params.get("view");
  const view: DemoView = views.find((item) => item === rawView) ?? "turn";
  const parsedSeverity = severitySchema.safeParse(params.get("severity"));
  const severity: Severity | "ALL" = parsedSeverity.success
    ? parsedSeverity.data
    : "ALL";
  const rawStatus = params.get("status");
  const status: "resolved" | "all" | "active" =
    rawStatus === "resolved" || rawStatus === "all" ? rawStatus : "active";
  const query = params.get("q")?.slice(0, 80) ?? "";
  const update = (values: Record<string, string>, push = false) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    window.history[push ? "pushState" : "replaceState"](
      null,
      "",
      `/demo?${next.toString()}`,
    );
    if (push) window.scrollTo({ top: 0, behavior: "instant" });
  };
  return {
    view,
    severity,
    status,
    query,
    update,
    navigate: (next: DemoView) => update({ view: next }, true),
  };
}
