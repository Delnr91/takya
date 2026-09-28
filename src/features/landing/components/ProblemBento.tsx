import { EyeOff, RadioTower } from "lucide-react";

export function ProblemBento() {
  return (
    <section
      id="problema"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28 lg:px-16"
    >
      <div className="mb-11 grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5F7D68]">
            01 / El problema
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4.3vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-forest">
            Más cámaras no significan más claridad.
          </h2>
        </div>
        <p className="max-w-lg text-base leading-[1.8] text-[#52695D] lg:pb-1">
          Cuando aumentan las fuentes de video, también crece la carga de
          atención. Alertas dispersas y repetidas obligan a decidir con menos
          contexto del necesario.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <article className="flex min-h-[350px] flex-col justify-between overflow-hidden rounded-[26px] bg-forest p-7 text-ivory md:col-span-7 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#C5D9CA]">
              Escala municipal documentada
            </span>
            <RadioTower
              className="h-5 w-5 text-[#B7CFBC]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="font-display text-[clamp(5rem,12vw,9rem)] font-semibold leading-none tracking-[-0.09em]">
              130
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#E5EFE6] sm:text-lg">
              cámaras alcanzó el sistema municipal de Antofagasta, tras crecer
              desde 30 según los antecedentes del proyecto.
            </p>
          </div>
        </article>

        <article className="flex min-h-[350px] flex-col justify-between rounded-[26px] border border-[#DCE7DE] bg-[#F5F8F4] p-7 text-forest md:col-span-5 sm:p-9">
          <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#54715E]">
            Escenario de expansión
          </span>
          <div>
            <p className="font-display text-[clamp(4.5rem,9vw,7rem)] font-semibold leading-none tracking-[-0.085em]">
              1.245
            </p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#496258] sm:text-lg">
              cámaras en la proyección regional citada en la documentación de
              TAKYA. Es una proyección, no una red operativa actual.
            </p>
          </div>
        </article>

        <article className="flex min-h-[290px] flex-col justify-between rounded-[26px] bg-[#EAF1E9] p-7 text-forest md:col-span-5 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#54715E]">
              Límite humano
            </span>
            <EyeOff
              className="h-5 w-5 text-[#476D55]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="max-w-sm font-display text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
              La atención no escala al ritmo de las pantallas.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#486052]">
              La fatiga cognitiva vuelve más difícil distinguir una señal
              relevante entre alertas concurrentes.
            </p>
          </div>
        </article>

        <article className="flex min-h-[290px] flex-col justify-between rounded-[26px] border border-[#DCE7DE] bg-white p-7 text-forest md:col-span-7 sm:p-9">
          <span className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#54715E]">
            Dato de referencia del PRD
          </span>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-9">
            <p className="font-display text-[clamp(4.5rem,9vw,7rem)] font-semibold leading-none tracking-[-0.085em]">
              50%
            </p>
            <p className="max-w-sm pb-1 text-base leading-relaxed text-[#496258]">
              es la cifra de eventos no detectados por fatiga visual citada en
              el PRD. TAKYA todavía no ha medido una reducción propia.
            </p>
          </div>
        </article>
      </div>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-[#66796B]">
        Cifras de contexto tomadas de la documentación interna del proyecto. La
        proyección regional y el dato de fatiga no son resultados de esta
        simulación.
      </p>
    </section>
  );
}
