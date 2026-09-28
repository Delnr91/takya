import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  DraftingCompass,
  Laptop2,
} from "lucide-react";

const team = [
  {
    title: "Ingeniería civil",
    detail: "Operaciones y modelamiento de procesos de televigilancia.",
    count: "02 PERFILES",
    icon: DraftingCompass,
  },
  {
    title: "Ingeniería comercial",
    detail: "Modelo de negocio y validación con instituciones.",
    count: "01 PERFIL",
    icon: Building2,
  },
  {
    title: "Desarrollo e IA",
    detail:
      "Arquitectura del prototipo y explicabilidad de las decisiones sugeridas.",
    count: "01 PERFIL",
    icon: Laptop2,
  },
] as const;

export function LandingClosing() {
  return (
    <>
      <section
        id="equipo"
        className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28 lg:px-16"
      >
        <div className="mb-10 grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5F7D68]">
              04 / Equipo y territorio
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4.3vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-forest">
              Una mirada interdisciplinaria desde Antofagasta.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-[1.8] text-[#52695D] lg:pb-1">
            TAKYA se desarrolla en el marco del Programa Nómada UCN 2026,
            combinando visión operativa, negocio e ingeniería de software.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {team.map((member) => {
            const Icon = member.icon;
            return (
              <article
                key={member.title}
                className="flex min-h-[250px] flex-col justify-between rounded-[24px] border border-[#DCE7DE] bg-[#F8FAF7] p-7 text-forest"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6E8974]">
                    {member.count}
                  </span>
                  <Icon
                    className="h-5 w-5 text-[#54715E]"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.035em]">
                    {member.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#52695D]">
                    {member.detail}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="contacto"
        className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-5 pb-20 sm:px-10 sm:pb-28 lg:px-16"
      >
        <div className="grid gap-8 rounded-[28px] border border-[#DCE7DE] bg-[#F5F8F4] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5F7D68]">
              05 / Próxima conversación
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-[-0.05em] text-forest sm:text-4xl">
              Una propuesta para explorar con operadores e instituciones.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#52695D]">
              El canal institucional de contacto está en definición. Este sitio
              no recopila ni envía solicitudes; el siguiente paso es validar el
              flujo junto a quienes operan y toman decisiones.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-ivory transition-colors hover:bg-[#2D5940]"
          >
            Ver acceso a demo
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[#E5EBE6] bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-5 py-10 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16">
        <Link
          href="/home"
          className="w-fit"
          aria-label="TAKYA, volver al inicio"
        >
          <Image
            src="/brand/principal-bosque.svg"
            alt="TAKYA"
            width={154}
            height={30}
            className="h-auto w-36"
          />
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#668071]">
          Comprender antes de actuar · Prototipo conceptual
        </p>
        <a
          href="#inicio"
          className="text-xs font-semibold text-forest transition-colors hover:text-[#5A8067]"
        >
          Volver arriba ↑
        </a>
      </div>
    </footer>
  );
}
