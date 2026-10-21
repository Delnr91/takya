"use client";

import { useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { SectionDivider } from "./HandDrawn";
import { type } from "./typography";

const AUDIENCES = [
  {
    title: "Centrales municipales",
    tag: "Prioridad\u00a01",
    pain: "Cientos de cámaras y pocas personas mirándolas.",
    gain: "TAKYA ordena lo que pasó y dice qué revisar primero.",
  },
  {
    title: "Seguridad privada y condominios",
    tag: "Prioridad\u00a01",
    pain: "Después de un hecho, buscar el minuto exacto toma horas.",
    gain: "Encuentra el momento y lo entrega listo para presentar.",
  },
  {
    title: "Comercio, industria y minería",
    tag: "Siguiente paso",
    pain: "Perímetros extensos y grabaciones largas.",
    gain: "Foco en lo que importa, sin mirar horas de video.",
  },
  {
    title: "Policías y fiscalía",
    tag: "Quien recibe",
    pain: "Videos grabados con el celular, sin huella ni registro.",
    gain: "Evidencia ordenada, explicada y que se puede verificar.",
  },
];

/**
 * «Pensado para»: paneles que se expanden al pasar, tocar o enfocar (idea de
 * acordeón animado de motion-primitives). Cada panel lleva su etiqueta arriba
 * y el nombre anclado abajo; el activo suma «Hoy» frente a «Con TAKYA».
 */
export function Audience() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 480, damping: 40, mass: 0.8 };

  return (
    <div className="max-w-6xl mx-auto mt-20">
      <SectionDivider />
      <SectionTitle
        lead=""
        accent="Pensado para"
        after=" quienes cuidan la ciudad."
        className="max-w-4xl"
      />
      <p className={`mt-5 max-w-2xl ${type.lead}`}>
        Nuestra prioridad: centrales y equipos que miran muchas cámaras y
        necesitan decidir rápido y entregar evidencia que se sostenga.
      </p>

      <LayoutGroup>
        <ul className="takya-audience">
          {AUDIENCES.map(({ title, tag, pain, gain }, index) => {
            const open = index === active;
            return (
              <motion.li
                key={title}
                layout={!reduce}
                transition={spring}
                className="takya-audience-panel"
                data-open={open}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
              >
                <button
                  type="button"
                  className="takya-audience-trigger"
                  aria-expanded={open}
                  aria-controls={`audiencia-${index}`}
                  onClick={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <span className="takya-audience-tag">{tag}</span>
                  <motion.span
                    layout={!reduce ? "position" : false}
                    transition={spring}
                    className="takya-audience-name"
                  >
                    {title}
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.dl
                      id={`audiencia-${index}`}
                      className="takya-audience-body"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { delay: 0.06, duration: 0.2 }
                      }
                    >
                      <div className="takya-audience-row">
                        <dt>Hoy</dt>
                        <dd>{pain}</dd>
                      </div>
                      <div className="takya-audience-row is-gain">
                        <dt>Con TAKYA</dt>
                        <dd>{gain}</dd>
                      </div>
                    </motion.dl>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </LayoutGroup>
    </div>
  );
}
