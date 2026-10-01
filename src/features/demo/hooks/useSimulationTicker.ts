"use client";

import { useEffect } from "react";

/** Hidden tabs do not generate bursts of unattended incidents. */
export function useSimulationTicker(
  enabled: boolean,
  intervalSeconds: number,
  onTick: () => void,
) {
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") onTick();
    }, intervalSeconds * 1000);
    return () => window.clearInterval(timer);
  }, [enabled, intervalSeconds, onTick]);
}
