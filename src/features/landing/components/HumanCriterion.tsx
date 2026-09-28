import { ClipboardCheck, SearchCheck, ShieldCheck } from "lucide-react";

const principles = [
  {
    title: "Contexto visible",
    description:
      "Las alertas relacionadas se presentan juntas para facilitar la revisión.",
    icon: SearchCheck,
  },
  {
    title: "Prioridad explicada",
    description: "Cada sugerencia muestra las señales que la sustentan.",
    icon: ShieldCheck,
  },
  {
    title: "Decisión registrada",
    description:
      "Verificar, escalar o descartar responde al criterio del operador.",
    icon: ClipboardCheck,
  },
] as const;

export function HumanCriterion() {
  return (
    <section
      id="criterio"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-5 py-12 sm:px-10 lg:px-16"
    >
      <div className="overflow-hidden rounded-[30px] bg-forest px-7 py-10 text-ivory sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#BED5C4]">
              03 / Nuestro criterio
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4.2vw,4.4rem)] font-semibold leading-[1.08] tracking-[-0.055em]">
              La tecnología orienta. La persona decide.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-[1.8] text-[#E0EBE2] lg:pb-1">
            La IA explicable tiene valor cuando hace más legible el contexto sin
            reemplazar el juicio operativo. TAKYA está diseñado alrededor de esa
            responsabilidad.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <article
                key={principle.title}
                className="min-h-[190px] rounded-[20px] border border-[#658C70] bg-[#244735] p-6"
              >
                <Icon
                  className="h-6 w-6 text-[#C5D9CA]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.03em]">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#D8E7DB]">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[#C5D9CA]">
          La experiencia presentada es una simulación conceptual; no analiza
          video de cámaras reales.
        </p>
      </div>
    </section>
  );
}
