"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export function AIParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ["#E05D44", "#7D9B8A", "#1B3B2B", "#cde467"];
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 10,
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full shadow-[0_0_10px_currentColor]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            color: p.color,
          }}
          animate={{
            y: ["-20vh", "20vh", "-20vh"],
            x: ["-10vw", "10vw", "-10vw"],
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Nodos de conexiA3n sutiles (simulando IA relacionando datos) */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {particles.slice(0, 15).map((p, i) => {
          const next = particles[i + 1];
          if (!next) return null;
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              stroke={p.color}
              strokeWidth="0.5"
              filter="url(#glow)"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: p.duration / 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: p.delay,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
