"use client";

import { motion } from "framer-motion";

export function VideoFeed() {
  return (
    <div className="flex flex-col h-full p-6 bg-[#030504] relative overflow-hidden">
      {/* Telemetry Corners */}
      <div className="absolute top-4 left-4 text-sage/70 font-mono text-[10px] uppercase">
        <p>CAM-04 // SECTOR NORTE</p>
        <p>LAT: -33.4489</p>
        <p>LNG: -70.6693</p>
      </div>
      <div className="absolute top-4 right-4 text-sage/70 font-mono text-[10px] text-right uppercase">
        <p>REC 1080P // 60FPS</p>
        <p className="text-terracotta">OPTICAL ZOOM 12X</p>
      </div>
      
      {/* Main Video Area Simulated */}
      <div className="flex-1 w-full h-full border border-sage/10 relative rounded-sm bg-black overflow-hidden flex items-center justify-center mt-8">
        
        {/* Reticle / Crosshair */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-[1px] h-full bg-sage absolute"></div>
          <div className="w-full h-[1px] bg-sage absolute"></div>
          <div className="w-16 h-16 border border-sage rounded-full absolute"></div>
        </div>

        {/* Flashing Bounding Box */}
        <motion.div
          className="absolute border-2 border-terracotta w-64 h-80 z-10"
          style={{ top: "30%", left: "40%" }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          {/* Box corners decorators */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-terracotta"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-terracotta"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-terracotta"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-terracotta"></div>

          {/* AI Label */}
          <div className="absolute -top-6 left-0 bg-terracotta text-ivory text-[10px] font-mono px-2 py-1 uppercase font-bold tracking-wider">
            Sujeto Anómalo 98%
          </div>
        </motion.div>

        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{
            backgroundImage: "linear-gradient(to right, #435b4f 1px, transparent 1px), linear-gradient(to bottom, #435b4f 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        ></div>

        {/* Status overlay */}
        <div className="absolute bottom-4 left-4 flex gap-4 text-xs font-mono">
          <span className="bg-sage/20 text-sage px-2 py-1 rounded-sm border border-sage/30">LIDAR: ACTIVE</span>
          <span className="bg-terracotta/20 text-terracotta px-2 py-1 rounded-sm border border-terracotta/30 animate-pulse">THREAT_DETECTED</span>
        </div>
      </div>
    </div>
  );
}
