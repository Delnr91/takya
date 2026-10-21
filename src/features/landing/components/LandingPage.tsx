"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { ArrowUpRight } from "@/components/icons";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ProblemMetrics } from "./ProblemMetrics";
import { PrinciplesMarquee } from "./PrinciplesMarquee";
import { HowItWorks } from "./HowItWorks";
import { TrustByDesign } from "./TrustByDesign";
import { ImpactODS } from "./ImpactODS";
import { Audience } from "./Audience";
import { PillarsCarousel } from "./PillarsCarousel";
import { HeroHeadline } from "./HeroHeadline";
import { HeroBenefits } from "./HeroBenefits";
import { GrainGradient } from "@/components/ui/GrainGradient";
import "./landing.css";
import { CojeevDepthBackground } from "@/components/ui/CojeevDepthBackground";
import { type } from "./typography";
import { SectionTitle } from "./SectionTitle";
import { SectionDivider } from "./HandDrawn";

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
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

  const moveBackground = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const x = (event.clientX / window.innerWidth - 0.5) * -28;
    const y = (event.clientY / window.innerHeight - 0.5) * -16;
    event.currentTarget.style.setProperty("--takya-pan-x", `${x.toFixed(1)}px`);
    event.currentTarget.style.setProperty("--takya-pan-y", `${y.toFixed(1)}px`);
  };

  const resetBackground = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--takya-pan-x", "0px");
    event.currentTarget.style.setProperty("--takya-pan-y", "0px");
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

  useEffect(() => {
    const page = pageRef.current;
    document.documentElement.classList.add("takya-landing-scroll");
    if (!page) {
      return () =>
        document.documentElement.classList.remove("takya-landing-scroll");
    }

    let frame = 0;
    const updateParallax = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const offset = reducedMotion ? 0 : Math.min(window.scrollY * 0.25, 160);
        page.style.setProperty("--takya-parallax-y", `${offset.toFixed(1)}px`);
        frame = 0;
      });
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateParallax);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("takya-landing-scroll");
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={pageRef}
        onPointerMove={moveBackground}
        onPointerLeave={resetBackground}
        className="relative min-h-screen font-sans selection:bg-[#E05D44]/20 overflow-x-clip scroll-smooth text-[#1B3B2B]"
        style={{ backgroundColor: "#F4F1EA" }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-clip"
          aria-hidden="true"
        >
          <div
            className="takya-scene absolute inset-0"
            style={{
              backgroundImage: 'url("/background2.png")',
              backgroundSize: "100% auto",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>

        {/* 
        GRADIENTE GLOBAL SUAVE:
        Disuelve la fotografía naturalmente hacia el color Marfil (#F4F1EA) justo después del Hero.
        Esto elimina la necesidad de tarjetas, cajas o fondos blancos en las secciones inferiores.
      */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F4F1EA]/80 to-[#F4F1EA] pointer-events-none z-0"></div>
        <div
          className="takya-ambient-glow pointer-events-none absolute inset-x-0 top-0 z-0 h-[900px]"
          aria-hidden="true"
        ></div>
        <div className="takya-grain" aria-hidden="true"></div>

        {/* ── NAVEGACIÓN SUPERIOR ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between w-full max-w-[1440px] mx-auto px-6 py-6 md:fixed md:px-12"
        >
          <div
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image
              src="/brand/02_png_transparentes/takya-a-principal-bosque-2048.png"
              alt="TAKYA"
              width={160}
              height={40}
              className="h-auto w-40 md:w-44 drop-shadow-sm"
              priority
            />
          </div>

          {/* Menú Píldora */}
          <nav className="hidden xl:flex items-center whitespace-nowrap space-x-8 rounded-full px-8 py-3 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(27,59,43,0.06)] text-xs font-mono uppercase tracking-wider text-[#1B3B2B]">
            <a
              href="#problema"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("problema");
              }}
              className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold"
            >
              El problema
            </a>
            <a
              href="#como-funciona"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("como-funciona");
              }}
              className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold"
            >
              Cómo funciona
            </a>
            <a
              href="#confianza"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("confianza");
              }}
              className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold"
            >
              Confianza
            </a>
            <a
              href="#impacto"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("impacto");
              }}
              className="hover:text-[#E05D44] transition-colors cursor-pointer font-bold"
            >
              Impacto
            </a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="#criterio"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("criterio");
              }}
              className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-[#E05D44] px-4 py-2.5 md:px-6 text-xs font-mono uppercase tracking-wider font-bold text-white shadow-md hover:bg-[#c94b34] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Conversemos <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </motion.header>

        {/* ── HERO SECTION ── */}
        <section className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-36 pb-20 flex flex-col min-h-[90vh] justify-center">
          <CojeevDepthBackground
            seed="takya-landing"
            density={0.45}
            intensity={0.38}
            className="takya-landing-depth"
          />

          {/* Metadato Científico Superior */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3 mb-8"
          >
            <span className="text-xs font-mono uppercase tracking-[0.14em] sm:tracking-[0.25em] text-[#1B3B2B]/80 font-bold">
              INTELIGENCIA CON CRITERIO HUMANO
            </span>
            <span className="hidden sm:inline text-xs font-mono text-[#7D9B8A]">
              &bull;
            </span>
            <span className="hidden sm:inline text-xs font-mono text-[#1B3B2B]/70 uppercase tracking-widest font-semibold">
              SISTEMA DE TELEVIGILANCIA COGNITIVA
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row w-full justify-between items-start mt-2">
            {/* Columna Izquierda: titular, propuesta de valor y acción */}
            <div className="max-w-3xl">
              <HeroHeadline />
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
              >
                <p className="text-xl md:text-2xl text-[#1B3B2B] mb-5 max-w-xs leading-snug font-bold">
                  Menos ruido.
                  <br />
                  Más contexto
                  <br />
                  para decidir.
                </p>
                <p className="mb-9 max-w-md text-base font-semibold leading-relaxed text-[#1B3B2B]/90 md:text-lg">
                  TAKYA recibe el video de tus cámaras, encuentra lo relevante,
                  te lo explica y sella la evidencia. La decisión es siempre
                  tuya.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#como-funciona"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("como-funciona");
                    }}
                    className="takya-hero-cta group"
                  >
                    <span className="takya-hero-cta-play" aria-hidden="true">
                      <Play size={16} fill="currentColor" />
                    </span>
                    Ver cómo funciona
                    <span className="takya-hero-cta-time">18 s</span>
                  </a>
                </div>
                <p className={`mt-4 ${type.note}`}>
                  Demostración en persona · con casos grabados
                </p>
              </motion.div>
            </div>

            {/* Columna Derecha: Editorial Flotante */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:flex flex-col items-end text-right mt-16 max-w-xs"
            >
              <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-[#1B3B2B] mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cde467] shadow-[0_0_10px_#cde467]"></span>
                <span>Antofagasta, Chile &mdash;</span>
              </div>
              <p className="text-[#1B3B2B] text-sm leading-relaxed font-bold">
                Tecnología para
                <br />
                personas más seguras
                <br />y comunidades
                <br />
                más informadas.
              </p>
            </motion.div>
          </div>

          {/* Barra de conceptos: cada uno lleva a la sección que lo explica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-20 flex justify-center w-full"
          >
            <HeroBenefits onNavigate={scrollTo} />
          </motion.div>
        </section>

        <PrinciplesMarquee />

        {/* ── SECCIÓN 01: EL PROBLEMA ── */}
        <section
          id="problema"
          className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28"
        >
          <SectionDivider />
          <motion.div
            initial="hidden"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUpVariants}
            className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-start gap-12"
          >
            {/* Título de Sección */}
            <div className="flex-1">
              <span className={type.eyebrow}>EL DOLOR OPERATIVO</span>
              <SectionTitle
                lead="Más cámaras no significan más"
                accent="claridad"
                after="."
              />
            </div>

            {/* Cuerpo Editorial Directo */}
            <div className="flex-1 max-w-xl">
              <p className={`${type.lead} mb-6`}>
                En Antofagasta, la central municipal pasó de 30 a 130 cámaras.
                Cada cámara nueva suma horas de video, pero no suma ojos para
                mirarlas.
              </p>
              <p className={`${type.body} text-[#1B3B2B]`}>
                Mirar pantallas por horas agota: la atención{""}
                <span className="font-extrabold text-[#E05D44]">
                  cae con el tiempo
                </span>
                {""}y una señal importante se pierde entre muchas. TAKYA ordena
                lo que pasó y explica qué revisar primero, para que la persona
                decida con contexto.
              </p>
            </div>
          </motion.div>
          <ProblemMetrics />
        </section>

        {/* ── SECCIÓN 02: LA PROPUESTA (FORMATO REVISTA / EDITORIAL - CERO CAJAS) ── */}
        <section
          id="propuesta"
          className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28"
        >
          {/* Encabezado Sistemático */}
          <motion.div
            initial="hidden"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUpVariants}
            className="flex flex-col md:flex-row justify-between items-end mb-20 max-w-6xl mx-auto gap-8 pt-6"
          >
            <div className="flex-1">
              <span className={type.eyebrow}>DE LA SEÑAL A LA REVISIÓN</span>
              <SectionTitle
                lead="La claridad cambia"
                accent="cómo miramos"
                after="."
              />
            </div>
            <div className="flex-1 flex justify-end">
              <p className={`${type.lead} max-w-md`}>
                TAKYA reúne alertas dispersas y explica las prioridades con
                evidencia clara, permitiendo al operador actuar con contexto
                inmediato y sin saturación.
              </p>
            </div>
          </motion.div>

          {/* 3 Columnas Tipográficas Revista Científica */}
          <PillarsCarousel />
          <Audience />
        </section>

        <HowItWorks />
        <TrustByDesign />
        <ImpactODS />

        {/* ── SECCIÓN 06: NUESTRO CRITERIO & CONTACTO DIRECTO ── */}
        <section
          id="criterio"
          className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-28 pb-40 scroll-mt-28"
        >
          <SectionDivider />
          <motion.div
            initial="hidden"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
            className="max-w-6xl mx-auto pt-6 flex flex-col items-center gap-12 text-center"
          >
            <div className="mx-auto max-w-xl">
              <span className={type.eyebrow}>CONVERSACIÓN DIRECTA</span>
              <SectionTitle
                lead="Conoce TAKYA"
                accent="en acción"
                after="."
                className="mb-6"
              />
              <p className={type.lead}>
                Agenda una demostración para tu central, empresa o institución.
                Te respondemos directamente.
              </p>
            </div>

            <div className="takya-gradient-panel relative w-full overflow-hidden rounded-[28px] p-3 pt-28 shadow-[0_24px_70px_rgba(27,59,43,0.18)] md:w-[440px]">
              <GrainGradient colors={["#E05D44", "#DBBA95", "#A5C8AE"]} />
              <div className="relative flex flex-col gap-4 rounded-[20px] border border-white/70 bg-[#F4F1EA]/85 p-6 backdrop-blur-xl">
                <p className={`${type.label} text-[#1B3B2B]`}>
                  Demostración en persona
                </p>
                <p className={`${type.body} text-[#1B3B2B]`}>
                  Te mostramos un turno de operador con casos grabados, en tu
                  central o en línea con un acceso autorizado. El sistema real
                  se instala en tu central.
                </p>
                <Link
                  href="https://wa.me/56900000000?text=Hola,%20quisiera%20agendar%20una%20demostración%20de%20TAKYA."
                  target="_blank"
                  className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full bg-[#25D366] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0b2e17] transition-colors hover:bg-[#20b858]"
                >
                  Contactar por WhatsApp
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    className="ml-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER INSTITUCIONAL ── */}
        <footer className="relative z-10 w-full bg-transparent">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Image
                src="/brand/02_png_transparentes/takya-a-principal-bosque-2048.png"
                alt="TAKYA"
                width={100}
                height={24}
                className="h-auto w-28 opacity-90"
              />
              <p className="text-xs font-mono text-[#1B3B2B]/70 uppercase tracking-wider font-semibold">
                &copy; 2026 TAKYA SpA &bull; Criterio Humano en Televigilancia
              </p>
            </div>
            <div className="flex items-center space-x-8 text-xs font-mono uppercase tracking-wider font-bold text-[#1B3B2B]/80">
              <span className="hover:text-[#E05D44] transition-colors cursor-pointer">
                Privacidad
              </span>
              <span className="hover:text-[#E05D44] transition-colors cursor-pointer">
                Términos
              </span>
              <a
                href="#criterio"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("criterio");
                }}
                className="hover:text-[#E05D44] transition-colors cursor-pointer"
              >
                Contacto
              </a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
