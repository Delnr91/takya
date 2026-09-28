"use client";

import { motion } from "framer-motion";

export function XAIPanel() {
  const aiAnalysis = {
    id: "INC-2026-0928-A",
    classification: "Intrusión Perimetral",
    confidence: 0.98,
    indicators: [
      "Trayectoria evasiva",
      "Horario no autorizado (18:42)",
      "Cruce de línea de seguridad (Z-4)"
    ],
    recommendation: "ESCALAR A RESPUESTA INMEDIATA"
  };

  return (
    <div className="flex flex-col h-full bg-black/40 border-l border-sage/20 p-6 font-mono">
      <div className="mb-6 border-b border-sage/20 pb-4">
        <h2 className="text-ivory font-bold uppercase tracking-widest text-xs">Análisis XAI</h2>
        <p className="text-sage text-[10px] mt-1">Explicabilidad de Modelo Táctico</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6">
        <div className="bg-[#0a0f0d] border border-sage/20 p-4 rounded-sm text-xs text-sage mb-6">
          <pre className="whitespace-pre-wrap leading-relaxed">
            <span className="text-terracotta">{"{"}</span>
            {"\n  "}<span className="text-ivory">"event_id"</span>: <span className="text-info">"{aiAnalysis.id}"</span>,
            {"\n  "}<span className="text-ivory">"classification"</span>: <span className="text-info">"{aiAnalysis.classification}"</span>,
            {"\n  "}<span className="text-ivory">"confidence"</span>: <span className="text-terracotta">{aiAnalysis.confidence}</span>,
            {"\n  "}<span className="text-ivory">"indicators"</span>: [
            {aiAnalysis.indicators.map((ind, i) => (
              <span key={i}>
                {"\n    "}<span className="text-medium">"{ind}"</span>{i < aiAnalysis.indicators.length - 1 ? "," : ""}
              </span>
            ))}
            {"\n  "}],
            {"\n  "}<span className="text-ivory">"action_recommended"</span>: <span className="text-terracotta font-bold">"{aiAnalysis.recommendation}"</span>
            {"\n"}<span className="text-terracotta">{"}"}</span>
          </pre>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        <h3 className="text-[10px] text-sage uppercase tracking-wider mb-2">Decisión de Operador</h3>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-terracotta text-ivory font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-terracotta/90 transition-colors"
        >
          Escalar (Alarma)
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-sage/20 text-ivory border border-sage/40 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-sage/30 transition-colors"
        >
          Verificar (Solicitar Patrulla)
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-transparent text-sage border border-sage/20 font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-sage/10 transition-colors"
        >
          Descartar (Falso Positivo)
        </motion.button>
      </div>
    </div>
  );
}
