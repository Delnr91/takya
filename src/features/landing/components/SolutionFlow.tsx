import {
  ClipboardList,
  Layers3,
  ListFilter,
  Scan,
  UserCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Detectar",
    description:
      "Recibir señales de distintas cámaras y fuentes sin perder su origen.",
    icon: Scan,
  },
  {
    number: "02",
    title: "Agrupar",
    description: "Relacionar alertas que podrían pertenecer a un mismo evento.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Explicar",
    description:
      "Mostrar qué señales sostienen la prioridad sugerida por TAKYA.",
    icon: ListFilter,
  },
  {
    number: "04",
    title: "Verificar",
    description: "Permitir que el operador revise el contexto antes de actuar.",
    icon: UserCheck,
  },
  {
    number: "05",
    title: "Registrar",
    description: "Dejar trazabilidad de la decisión humana y su motivo.",
    icon: ClipboardList,
  },
] as const;

export function SolutionFlow() {
  return (
    <section
      id="propuesta"
      className="mx-auto w-full max-w-[1440px] scroll-mt-24 px-5 py-20 sm:px-10 sm:py-28 lg:px-16"
    >
      <div className="mb-11 grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5F7D68]">
            02 / La propuesta
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,4.3vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-forest">
            De muchas señales a una decisión informada.
          </h2>
        </div>
        <p className="max-w-lg text-base leading-[1.8] text-[#52695D] lg:pb-1">
          El flujo propuesto por TAKYA organiza la información en cinco pasos.
          La prioridad se explica; la decisión permanece bajo control humano.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const featured = index === 2;
          return (
            <article
              key={step.number}
              className={`flex min-h-[270px] flex-col justify-between rounded-[24px] border p-6 ${featured ? "border-forest bg-forest text-ivory" : "border-[#DCE7DE] bg-[#F8FAF7] text-forest"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`font-mono text-[11px] tracking-[0.16em] ${featured ? "text-[#BED5C4]" : "text-[#6E8974]"}`}
                >
                  {step.number} / 05
                </span>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${featured ? "bg-[#315741]" : "bg-[#E7F0E8]"}`}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-[-0.035em]">
                  {step.title}
                </h3>
                <p
                  className={`mt-3 text-sm leading-relaxed ${featured ? "text-[#E4EFE5]" : "text-[#52695D]"}`}
                >
                  {step.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.13em] text-[#6E867A]">
        Flujo conceptual · la demo utiliza incidentes simulados
      </p>
    </section>
  );
}
