"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { DemoLoading, DemoShell } from "../components/DemoShell";

const AnalysisWorkspace = dynamic(
  () =>
    import("./AnalysisWorkspace").then((module) => module.AnalysisWorkspace),
  { loading: () => <DemoLoading /> },
);

export function DemoExperience() {
  const params = useSearchParams();
  return params.get("mode") === "analysis" ? (
    <AnalysisWorkspace />
  ) : (
    <DemoShell />
  );
}
