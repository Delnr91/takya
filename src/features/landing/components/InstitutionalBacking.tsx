import Image from "next/image";
import { type } from "./typography";

/**
 * Franja de respaldo institucional sobre el fondo claro de la página:
 * UCN 70 años primero, a la izquierda; los demás a su derecha, a la misma
 * altura visual, centrados y separados por un filete. Los logos van tal cual,
 * sin vidrio, sombras ni filtros.
 *
 * El rol de USQAI («Apoya») debe confirmarse con su equipo de comunicaciones.
 */
export function InstitutionalBacking() {
  return (
    <section
      aria-labelledby="respaldo-titulo"
      className="takya-backing relative z-10 w-full"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-7 px-6 py-12 md:px-12">
        <h2
          id="respaldo-titulo"
          className={`${type.label} text-[#1B3B2B]/75`}
        >
          Respaldo institucional
        </h2>
        <ul className="takya-backing-row">
          <li>
            <a
              href="https://www.ucn.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="takya-backing-logo"
            >
              <Image
                src="/brand/aliados/ucn-70-color-claro.png"
                alt="Universidad Católica del Norte, 70 años"
                width={640}
                height={195}
                className="is-ucn"
              />
            </a>
          </li>
          <li>
            <span className="takya-backing-role">Apoya</span>
            <a
              href="https://usqai.ucn.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="takya-backing-logo"
            >
              <Image
                src="/brand/aliados/usqai-color-claro.png"
                alt="USQAI"
                width={640}
                height={263}
                className="is-usqai"
              />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
