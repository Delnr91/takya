const cardBase =
  "group relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-7 backdrop-blur-2xl transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 sm:p-9";

export function ProblemMetrics() {
  return (
    <div className="mx-auto mt-14 max-w-6xl">
      <div className="grid gap-4 md:grid-cols-12">
        <article
          className={`${cardBase} min-h-[320px] border-[#7D9B8A]/50 bg-[#1B3B2B]/90 text-[#F4F1EA] shadow-[0_24px_70px_rgba(27,59,43,0.18)] md:col-span-7`}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-28 size-64 rounded-full border border-[#7D9B8A]/35 shadow-[0_0_80px_rgba(125,155,138,0.15)]"
            aria-hidden="true"
          />
          <p className="relative font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8CFBE]">
            Escala municipal documentada
          </p>
          <div className="relative">
            <p className="font-display text-[clamp(5rem,11vw,9rem)] font-semibold leading-none tracking-[-0.09em]">
              130
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#F4F1EA]/90">
              cámaras alcanzó el sistema municipal de Antofagasta, tras crecer
              desde 30 según los antecedentes del proyecto.
            </p>
          </div>
        </article>

        <article
          className={`${cardBase} min-h-[320px] border-white/80 bg-[#F4F1EA]/75 text-[#0C1410] shadow-[0_20px_60px_rgba(27,59,43,0.08)] md:col-span-5`}
        >
          <div
            className="pointer-events-none absolute right-0 top-0 h-px w-2/3 bg-gradient-to-l from-[#E05D44]/70 to-transparent"
            aria-hidden="true"
          />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B3B2B]">
            Escenario de expansión
          </p>
          <div>
            <p className="font-display text-[clamp(4.5rem,9vw,7.5rem)] font-semibold leading-none tracking-[-0.09em]">
              1.245
            </p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#1B3B2B]">
              cámaras en la proyección regional citada por TAKYA. Es una
              proyección, no una red operativa actual.
            </p>
          </div>
        </article>

        <article
          className={`${cardBase} min-h-[270px] border-white/70 bg-[#7D9B8A]/30 text-[#0C1410] shadow-[0_20px_60px_rgba(27,59,43,0.07)] md:col-span-5`}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B3B2B]">
            Límite humano
          </p>
          <div>
            <h3 className="max-w-sm font-display text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
              La atención no escala al ritmo de las pantallas.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#1B3B2B]">
              La fatiga cognitiva dificulta distinguir una señal relevante entre
              alertas concurrentes.
            </p>
          </div>
        </article>

        <article
          className={`${cardBase} min-h-[270px] border-white/80 bg-white/70 text-[#0C1410] shadow-[0_20px_60px_rgba(27,59,43,0.08)] md:col-span-7`}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B3B2B]">
            Dato de referencia del PRD
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
            <p className="font-display text-[clamp(5rem,10vw,8rem)] font-semibold leading-none tracking-[-0.09em]">
              50<span className="text-[#E05D44]">%</span>
            </p>
            <p className="max-w-sm pb-1 text-base leading-relaxed text-[#1B3B2B]">
              es la cifra de eventos no detectados por fatiga visual citada en
              el PRD. TAKYA todavía no ha medido una reducción propia.
            </p>
          </div>
        </article>
      </div>
      <p className="mt-5 max-w-3xl font-mono text-[10px] leading-relaxed tracking-wide text-[#1B3B2B]/75">
        Cifras de contexto de la documentación interna. La proyección regional y
        el dato de fatiga no son resultados de esta simulación.
      </p>
    </div>
  );
}
