import { Suspense } from "react";
import { DemoShell, DemoLoading } from "@/features/demo/components/DemoShell";

export default function DemoPage() {
  return (
    <Suspense fallback={<DemoLoading />}>
      <DemoShell />
    </Suspense>
  );
}
