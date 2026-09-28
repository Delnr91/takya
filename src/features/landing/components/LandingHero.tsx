import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Blocks,
  Eye,
  UserRound,
} from "lucide-react";

const principles = [
  { label: "Contexto", icon: Blocks },
  { label: "Evidencia", icon: Eye },
  { label: "Persona", icon: UserRound },
] as const;

export function LandingHero() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
      <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-12">
        <div className="flex flex-col justify-center pb-2 lg:py-10">
          <p className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.19em] text-[#54715E]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-sage"
              aria-hidden="true"
            />
            Inteligencia con criterio humano
          </p>
          <h1 className="mt-8 max-w-[740px] font-display text-[clamp(3rem,5.5vw,5.8rem)] font-semibold leading-[1.03] tracking-[-0.065em] text-forest">
            Claridad para decidir con contexto
            <span className="text-[#7D9B8A]">.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-[1.8] text-[#496258] sm:text-lg">
            TAKYA explora cómo reunir alertas relacionadas, explicar prioridades
            y apoyar a quienes observan cada señal. La última palabra sigue en
            la persona.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#propuesta"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-ivory transition-colors hover:bg-[#2D5940]"
            >
              Ver la propuesta
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#A8BCAF] px-6 text-sm font-semibold text-forest transition-colors hover:border-forest hover:bg-[#F4F7F4]"
            >
              Explorar demo
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.13em] text-[#6E867A]">
            Prototipo conceptual · sin conexión a cámaras reales
          </p>
        </div>

        <div className="relative min-h-[410px] overflow-hidden rounded-[28px] bg-forest sm:min-h-[510px] lg:min-h-[590px]">
          <Image
            src="/referencias/referencias/direccion-artistica-landing-a-v01.png"
            alt="Paisaje costero de referencia visual para TAKYA"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 47vw"
            className="object-cover object-[62%_center]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#081D18]/80 via-transparent to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5 text-ivory sm:bottom-8 sm:left-8 sm:right-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#DDE9DD]">
                Una mirada más clara
              </span>
              <p className="mt-2 max-w-xs font-display text-xl font-medium leading-snug sm:text-2xl">
                Menos señales aisladas. Más sentido para actuar.
              </p>
            </div>
            <ArrowDownRight className="h-7 w-7 shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid overflow-hidden rounded-2xl border border-[#DCE6DD] bg-[#F8FAF7] sm:grid-cols-3">
        {principles.map((principle, index) => {
          const Icon = principle.icon;
          return (
            <div
              key={principle.label}
              className={`flex items-center gap-4 px-6 py-5 ${index > 0 ? "border-t border-[#DCE6DD] sm:border-l sm:border-t-0" : ""}`}
            >
              <Icon
                className="h-5 w-5 text-[#476D55]"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-forest">
                {principle.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
