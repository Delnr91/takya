"use client";

import { motion } from "framer-motion";

const INCIDENTS = [
  { id: "INC-2026-0928-A", title: "Anomalía Perimetral Sector 4", time: "18:42:01", status: "critical" },
  { id: "INC-2026-0928-B", title: "Vehículo no autorizado", time: "18:30:12", status: "inactive" },
  { id: "INC-2026-0928-C", title: "Movimiento inusual - Bodega B", time: "17:15:00", status: "inactive" },
  { id: "INC-2026-0928-D", title: "Falla de cámara térmica", time: "16:02:44", status: "inactive" },
];

export function IncidentList() {
  return (
    <div className="flex flex-col h-full bg-black/40 border-r border-sage/20 p-4 font-mono text-sm">
      <div className="mb-6 flex items-center justify-between border-b border-sage/20 pb-4">
        <h2 className="text-ivory font-bold uppercase tracking-widest text-xs">Feed de Eventos</h2>
        <span className="text-terracotta animate-pulse">● LIVE</span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {INCIDENTS.map((inc, i) => (
          <motion.div
            key={inc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 border-l-2 cursor-pointer transition-colors ${
              inc.status === "critical"
                ? "border-terracotta bg-terracotta/10 text-terracotta"
                : "border-sage/30 bg-transparent text-sage hover:bg-sage/10 hover:text-ivory"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs">{inc.id}</span>
              <span className="text-[10px] opacity-70">{inc.time}</span>
            </div>
            <p className={`text-xs ${inc.status === "critical" ? "text-ivory" : ""}`}>{inc.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
