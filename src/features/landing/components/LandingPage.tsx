"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  useEffect(() => {
    const handleInitialHash = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const id = window.location.hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    };

    handleInitialHash();
    window.addEventListener("hashchange", handleInitialHash);
    return () => window.removeEventListener("hashchange", handleInitialHash);
  }, []);

  return (
    <div 
      className="relative min-h-screen font-sans selection:bg-[#E05D44]/20 overflow-x-hidden scroll-smooth text-[#1B3B2B]"
      style={{ 
        backgroundImage: 'url("/background2.png")', 
        backgroundSize: '100% auto', 
        backgroundPosition: 'top center', 
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#F4F1EA'
      }}
    >
      
      {/* 
        GRADIENTE GLOBAL SUAVE:
        Disuelve la fotografía naturalmente hacia el color Marfil (#F4F1EA) justo después del Hero.
        Esto elimina la necesidad de tarjetas, cajas o fondos blancos en las secciones inferiores.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F4F1EA]/80 to-[#F4F1EA] pointer-events-none z-0"></div>

      {/* ── NAVEGACIÓN SUPERIOR ── */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full max-w-[1440px] mx-auto px-6 py-6 md:px-12"
      >
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Image 
            src="/brand/02_png_transparentes/takya-a-principal-bosque-2048.png" 
            alt="TAKYA" 
            width={160} 
            height={40} 
            className="h-8 md:h-9 w-auto drop-shadow-sm" 
            priority
          />
        </div>
        
        {/* Menú Píldora */}
        <nav className="hidden md:flex items-center space-x-8 rounded-full px-8 py-3 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(27,59,43,0.06)] text-xs font-mono uppercase tracking-wider text-[#1B3B2B]">
          <a href="#problema" onClick={(e) => { e.preventDefault(); scrollTo('problema'); }} className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold">El problema</a>
          <a href="#propuesta" onClick={(e) => { e.preventDefault(); scrollTo('propuesta'); }} className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold">La propuesta</a>
          <a href="#criterio" onClick={(e) => { e.preventDefault(); scrollTo('criterio'); }} className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold">Nuestro criterio</a>
        </nav>

        <div>
          <a href="#criterio" onClick={(e) => { e.preventDefault(); scrollTo('criterio'); }} className="hidden md:inline-flex items-center justify-center rounded-full bg-[#E05D44] px-6 py-2.5 text-xs font-mono uppercase tracking-wider font-bold text-white shadow-md hover:bg-[#c94b34] transition-all hover:scale-105 active:scale-95 cursor-pointer">
            Conversemos <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </motion.header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-36 pb-20 flex flex-col min-h-[90vh] justify-center">
        
        {/* Metadato Científico Superior */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center space-x-3 mb-8">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#1B3B2B]/80 font-bold">
            INTELIGENCIA CON CRITERIO HUMANO
          </span>
          <span className="hidden sm:inline text-xs font-mono text-[#7D9B8A]">&bull;</span>
          <span className="hidden sm:inline text-xs font-mono text-[#1B3B2B]/70 uppercase tracking-widest font-semibold">
            SISTEMA DE TELEVIGILANCIA COGNITIVA
          </span>
        </motion.div>

        <div className="flex flex-col md:flex-row w-full justify-between items-start mt-2">
          
          {/* Columna Izquierda: Gran Titular */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <h1 className="font-display text-[4.5rem] md:text-[7.5rem] font-extrabold leading-[0.85] tracking-tight text-[#1B3B2B] mb-8">
              Comprender<br />antes de<br />
              <span className="text-[#E05D44]">actuar<span className="text-[#cde467]">.</span></span>
            </h1>
            <p className="text-xl md:text-2xl text-[#1B3B2B] mb-10 max-w-xs leading-snug font-bold">
              Menos ruido.<br />Más contexto<br />para decidir.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#problema" onClick={(e) => { e.preventDefault(); scrollTo('problema'); }} className="rounded-full border border-[#1B3B2B] bg-transparent px-8 py-3.5 text-xs font-mono uppercase tracking-wider font-bold text-[#1B3B2B] hover:bg-[#1B3B2B] hover:text-white transition-all cursor-pointer">
                Conocer el problema
              </a>
              <a href="#propuesta" onClick={(e) => { e.preventDefault(); scrollTo('propuesta'); }} className="flex items-center rounded-full bg-[#E05D44] px-8 py-3.5 text-xs font-mono uppercase tracking-wider font-bold text-white shadow-md hover:bg-[#c94b34] transition-all cursor-pointer">
                Ver la propuesta <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
          
          {/* Columna Derecha: Editorial Flotante */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="hidden lg:flex flex-col items-end text-right mt-16 max-w-xs">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-[#1B3B2B] mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cde467] shadow-[0_0_10px_#cde467]"></span>
              <span>Antofagasta, Chile &mdash;</span>
            </div>
            <p className="text-[#1B3B2B] text-sm leading-relaxed font-bold">
              Tecnología para<br />personas más seguras<br />y comunidades<br />más informadas.
            </p>
          </motion.div>
        </div>

        {/* Submenú Píldora Inferior */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-28 flex justify-center w-full">
          <div className="flex items-center justify-between w-full max-w-5xl rounded-full bg-white/70 backdrop-blur-2xl border border-white/80 shadow-md px-10 py-5 text-xs font-mono tracking-widest">
            <div className="text-[#1B3B2B] font-bold uppercase flex items-center space-x-2">
              <span className="text-[#7D9B8A]">01 /</span> <span>Contexto</span>
            </div>
            <div className="w-px h-6 bg-[#1B3B2B]/20"></div>
            <div className="text-[#1B3B2B] font-bold uppercase flex items-center space-x-2">
              <span className="text-[#7D9B8A]">02 /</span> <span>Evidencia</span>
            </div>
            <div className="w-px h-6 bg-[#1B3B2B]/20"></div>
            <div className="text-[#1B3B2B] font-bold uppercase flex items-center space-x-2">
              <span className="text-[#7D9B8A]">03 /</span> <span>Prioridad</span>
            </div>
            <div className="w-px h-6 bg-[#1B3B2B]/20"></div>
            <div className="text-[#E05D44] font-bold uppercase flex items-center space-x-2">
              <span>04 /</span> <span>Persona</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── SECCIÓN 01: EL PROBLEMA (100% EDITORIAL - CERO CAJAS) ── */}
      <section id="problema" className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28">
        <motion.div 
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUpVariants}
          className="max-w-6xl mx-auto border-t-2 border-[#1B3B2B] pt-16 flex flex-col md:flex-row justify-between items-start gap-12"
        >
          {/* Título de Sección */}
          <div className="flex-1">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E05D44] font-extrabold block mb-4">
              [ SEC. 01 ] &mdash; EL DOLOR OPERATIVO
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#1B3B2B]">
              El volumen de alertas supera nuestra capacidad visual.
            </h2>
          </div>

          {/* Cuerpo Editorial Directo */}
          <div className="flex-1 max-w-xl">
            <p className="text-lg sm:text-xl font-bold leading-relaxed text-[#1B3B2B] mb-6">
              El crecimiento exponencial de la televigilancia en Antofagasta (de 130 a 1.245 cámaras) ha generado una sobrecarga visual insostenible.
            </p>
            <p className="text-base sm:text-lg leading-relaxed font-semibold text-[#1B3B2B]/90">
              La fatiga cognitiva en los centros de control provoca que hasta un <span className="font-extrabold text-[#E05D44]">50% de los eventos críticos</span> pasen desapercibidos en un mar de ruido visual. La tecnología actual genera alertas masivas; TAKYA genera respuestas operativas con contexto real.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── SECCIÓN 02: LA PROPUESTA (FORMATO REVISTA / EDITORIAL - CERO CAJAS) ── */}
      <section id="propuesta" className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28">
        
        {/* Encabezado Sistemático */}
        <motion.div 
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
          className="flex flex-col md:flex-row justify-between items-end mb-20 max-w-6xl mx-auto gap-8 border-t-2 border-[#1B3B2B] pt-16"
        >
          <div className="flex-1">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E05D44] font-extrabold block mb-4">
              [ SEC. 02 ] &mdash; DE LA SEÑAL A LA REVISIÓN
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#1B3B2B]">
              La claridad cambia<br />cómo miramos.
            </h2>
          </div>
          <div className="flex-1 flex justify-end">
            <p className="text-lg sm:text-xl font-bold leading-relaxed text-[#1B3B2B] max-w-md">
              TAKYA reúne alertas dispersas y explica las prioridades con evidencia clara, permitiendo al operador actuar con contexto inmediato y sin saturación.
            </p>
          </div>
        </motion.div>

        {/* 3 Columnas Tipográficas Revista Científica */}
        <motion.div 
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: { opacity: 0 }, whileInView: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto"
        >
          {/* Columna 1 */}
          <motion.div variants={fadeUpVariants} className="flex flex-col border-t border-[#1B3B2B]/30 pt-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#7D9B8A] font-bold block mb-4">
              Pilar I &bull; Correlación
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] mb-3 tracking-tight">
              Encontrar contexto.
            </h3>
            <p className="text-base text-[#1B3B2B] font-semibold leading-relaxed">
              Agrupamos señales dispersas y cámaras múltiples que pertenecen a un mismo evento de seguridad para eliminar duplicidad y entregar una historia continua.
            </p>
          </motion.div>

          {/* Columna 2 */}
          <motion.div variants={fadeUpVariants} className="flex flex-col border-t border-[#1B3B2B]/30 pt-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#7D9B8A] font-bold block mb-4">
              Pilar II &bull; Explicabilidad (XAI)
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] mb-3 tracking-tight">
              Entender la prioridad.
            </h3>
            <p className="text-base text-[#1B3B2B] font-semibold leading-relaxed">
              Desglosamos en lenguaje natural el porqué detrás de cada sugerencia antes de actuar. Cero cajas negras: la inteligencia debe ser comprensible y justificable.
            </p>
          </motion.div>

          {/* Columna 3 */}
          <motion.div variants={fadeUpVariants} className="flex flex-col border-t border-[#1B3B2B]/30 pt-8">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#7D9B8A] font-bold block mb-4">
              Pilar III &bull; Decisión Humana
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] mb-3 tracking-tight">
              Conservar el control.
            </h3>
            <p className="text-base text-[#1B3B2B] font-semibold leading-relaxed">
              La persona valida, decide y registra su criterio. La inteligencia artificial propone y sintetiza, pero el operador humano mantiene siempre la última palabra.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── SECCIÓN 03: NUESTRO CRITERIO & CONTACTO DIRECTO ── */}
      <section id="criterio" className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-28 pb-40 scroll-mt-28">
        <motion.div 
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="max-w-6xl mx-auto border-t-2 border-[#1B3B2B] pt-16 flex flex-col md:flex-row items-start justify-between gap-12"
        >
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E05D44] font-extrabold block mb-4">
              [ SEC. 03 ] &mdash; CONVERSACIÓN DIRECTA
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#1B3B2B] mb-6">
              Descubre TAKYA operando en vivo.
            </h2>
            <p className="text-lg sm:text-xl font-bold leading-relaxed text-[#1B3B2B]">
              Sin intermediarios ni formularios burocráticos. Agenda una sesión técnica directamente con nuestro equipo de desarrollo e ingeniería.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-start md:items-end justify-center pt-4">
            <Link 
              href="https://wa.me/56900000000?text=Hola,%20quisiera%20agendar%20una%20demostración%20de%20TAKYA." 
              target="_blank"
              className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-10 py-5 text-base font-mono uppercase tracking-wider font-bold text-white shadow-xl hover:bg-[#20b858] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Contactar por WhatsApp
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="ml-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER INSTITUCIONAL ── */}
      <footer className="relative z-10 w-full border-t border-[#1B3B2B]/20 bg-transparent">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Image 
              src="/brand/02_png_transparentes/takya-a-principal-bosque-2048.png" 
              alt="TAKYA" 
              width={100} 
              height={24} 
              className="h-6 w-auto opacity-90" 
            />
            <p className="text-xs font-mono text-[#1B3B2B]/70 uppercase tracking-wider font-semibold">
              &copy; 2026 TAKYA SpA &bull; Criterio Humano en Televigilancia
            </p>
          </div>
          <div className="flex items-center space-x-8 text-xs font-mono uppercase tracking-wider font-bold text-[#1B3B2B]/80">
            <span className="hover:text-[#E05D44] transition-colors cursor-pointer">Privacidad</span>
            <span className="hover:text-[#E05D44] transition-colors cursor-pointer">Términos</span>
            <a href="#criterio" onClick={(e) => { e.preventDefault(); scrollTo('criterio'); }} className="hover:text-[#E05D44] transition-colors cursor-pointer">Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
