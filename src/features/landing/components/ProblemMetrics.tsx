import { AnimatedNumber } from "./AnimatedNumber";
import { type } from "./typography";

const cardBase =
  "takya-metric group relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-7 backdrop-blur-2xl transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1 sm:p-9";

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
          <p className={`relative ${type.label} text-[#B8CFBE]`}>
            Central municipal de Antofagasta
          </p>
          <div className="relative">
            <p className={type.stat}>
              <AnimatedNumber value={130} />
            </p>
            <p className={`mt-4 max-w-md ${type.body} text-[#F4F1EA]/90`}>
              cámaras vigila hoy la central municipal, que partió con 30. Opera
              de día y de noche.
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
          <p className={`${type.label} text-[#1B3B2B]`}>Una cámara, una hora</p>
          <div>
            <p className={type.stat}>
              <AnimatedNumber value={90000} />
            </p>
            <p className={`mt-4 max-w-sm ${type.body} text-[#1B3B2B]`}>
              imágenes genera una sola cámara en una hora. En un día son más de
              dos millones: nadie puede mirarlas todas.
            </p>
          </div>
        </article>

        <article
          className={`${cardBase} min-h-[270px] border-white/70 bg-[#7D9B8A]/30 text-[#0C1410] shadow-[0_20px_60px_rgba(27,59,43,0.07)] md:col-span-5`}
        >
          <p className={`${type.label} text-[#1B3B2B]`}>Límite humano</p>
          <div>
            <h3 className={`max-w-sm ${type.h3}`}>
              La atención no escala al ritmo de las pantallas.
            </h3>
            <p className={`mt-4 max-w-sm ${type.body} text-[#1B3B2B]`}>
              Después de horas de turno, distinguir lo importante entre muchas
              alertas se vuelve cada vez más difícil.
            </p>
          </div>
        </article>

        <article
          className={`${cardBase} min-h-[270px] border-white/80 bg-white/70 text-[#0C1410] shadow-[0_20px_60px_rgba(27,59,43,0.08)] md:col-span-7`}
        >
          <p className={`${type.label} text-[#1B3B2B]`}>
            Lo que cambia con TAKYA
          </p>
          <div className="my-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:gap-8">
            <p className={type.stat}>
              <AnimatedNumber value={1} />
            </p>
            <p className={`max-w-md ${type.lead} text-[#1B3B2B]`}>
              caso a la vez, explicado: qué se vio, qué no se sabe y quién
              decidió.{" "}
              <span className="text-[#E05D44]">
                Menos grilla, más contexto.
              </span>
            </p>
          </div>
        </article>
      </div>
      <p className={`mt-5 max-w-3xl ${type.note}`}>
        Fuentes: Municipalidad de Antofagasta (mayo de 2026) e investigación
        sobre vigilancia por cámaras. Imágenes calculadas a 25 cuadros por
        segundo.
      </p>
    </div>
  );
}
