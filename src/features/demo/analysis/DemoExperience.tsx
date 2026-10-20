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
  // El motor real (subir archivos) solo con ?mode=analysis&motor=local; en la
  // demo pública «Analizar» es una sección de la consola con videos cargados.
  return params.get("mode") === "analysis" &&
    params.get("motor") === "local" ? (
    <AnalysisWorkspace />
  ) : (
    <DemoShell />
  );
}
