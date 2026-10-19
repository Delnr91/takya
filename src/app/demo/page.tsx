import { Suspense } from "react";
import { DemoLoading } from "@/features/demo/components/DemoShell";
import { DemoExperience } from "@/features/demo/analysis/DemoExperience";

export default function DemoPage() {
  return (
    <Suspense fallback={<DemoLoading />}>
      <DemoExperience />
    </Suspense>
  );
}
