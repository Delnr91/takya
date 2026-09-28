"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HomeVideoBackground } from "./HomeVideoBackground";
import { motion } from "framer-motion";

const destinations = [
  { number: "01 / VISIÓN", title: "Conocer el Proyecto", href: "/landing", isPrimary: false },
  { number: "02 / DEMO", title: "Consola Interactiva", href: "/login", isPrimary: true },
] as const;

export function HomeSplash() {
  // Variantes para animación de texto escalonada
  const containerSlogan = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.6 }
    }
  };

  const itemLine = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-dark-deep font-sans">
      <HomeVideoBackground />

      {/* Grid de encuadre */}
      <div className="pointer-events-none absolute inset-0 z-10 border-[1px] border-white/10 m-6 md:m-10 mix-blend-overlay"></div>

      {/* Área Top-Left: Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="absolute left-10 top-10 md:left-16 md:top-16 z-20"
      >
        <Image
          src="/brand/logotipo-marfil.svg"
          alt="TAKYA"
          width={180}
          height={40}
          priority
          className="h-auto w-40 md:w-48 drop-shadow-[0_0_15px_rgba(244,241,234,0.3)]"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mt-4 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#F4F1EA]/60 font-semibold"
        >
          Inteligencia con criterio humano
        </motion.p>
      </motion.div>

      {/* Área Bottom-Left: Eslogan inmersivo con Text Reveal */}
      <div className="absolute left-10 bottom-10 md:left-16 md:bottom-16 z-20 max-w-[70vw]">
        {/* Aura de contraste para asegurar legibilidad sobre el video */}
        <div className="absolute -inset-12 bg-[#060A08]/40 blur-3xl rounded-full z-[-1] pointer-events-none"></div>
        
        <motion.h1 
          variants={containerSlogan}
          initial="hidden"
          animate="show"
          className="font-display text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[#F4F1EA] drop-shadow-[0_0_30px_rgba(6,10,8,0.9)] flex flex-col"
        >
          <motion.span variants={itemLine} className="block">Comprender</motion.span>
          <motion.span variants={itemLine} className="block text-[#F4F1EA]/90">antes de</motion.span>
          <motion.span variants={itemLine} className="block mt-2">
            <span className="text-[#E05D44] italic relative inline-block">
              actuar.
              {/* Brillo dinámico detrás de la palabra "actuar" */}
              <motion.span 
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#E05D44] blur-2xl z-[-1] opacity-50"
              ></motion.span>
            </span>
          </motion.span>
        </motion.h1>
      </div>

      {/* Área Bottom-Right: Botones flotantes (Liquid Glass + Jerarquía) */}
      <div className="absolute right-6 bottom-10 md:right-16 md:bottom-16 z-20 flex flex-col gap-4 w-[min(85vw,360px)]">
        {destinations.map((destination, index) => (
          <motion.div
            key={destination.href}
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 + (index * 0.2) }}
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={destination.href}
              className={`group flex min-h-24 md:min-h-28 flex-col justify-between rounded-3xl border p-6 text-ivory backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 overflow-hidden relative ${
                destination.isPrimary 
                ? "border-[#E05D44]/30 bg-gradient-to-br from-[#1B3B2B]/70 to-[#0C1410]/90 shadow-[inset_0_1px_2px_rgba(224,93,68,0.3),0_8px_32px_rgba(0,0,0,0.8)] hover:border-[#E05D44]/60" 
                : "border-white/10 bg-gradient-to-br from-[#7D9B8A]/10 to-[#0C1410]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.6)] hover:border-[#7D9B8A]/40"
              }`}
            >
              {/* Brillo sutil de fondo en el botón primario */}
              {destination.isPrimary && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#E05D44]/20 blur-3xl rounded-full pointer-events-none group-hover:bg-[#E05D44]/30 transition-colors"></div>
              )}

              <span className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] ${destination.isPrimary ? 'text-[#E05D44]' : 'text-[#7D9B8A]'}`}>
                {destination.number}
                <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 45 }}>
                  <ArrowUpRight className={`h-5 w-5 transition-transform duration-300 ${destination.isPrimary ? 'text-[#E05D44]' : 'text-ivory motion-safe:group-hover:text-[#7D9B8A]'}`} aria-hidden="true" />
                </motion.div>
              </span>
              <span className="font-display text-xl md:text-2xl font-semibold tracking-tight text-[#F4F1EA] group-hover:text-white relative z-10">
                {destination.title}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
