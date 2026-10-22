import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, MapPin } from "@/components/icons";
import type { Incident } from "../schemas/simulation";
import { scenarios } from "../data/scenarios";
import { IncidentPoster } from "./IncidentPoster";
import { StatusBadge } from "./DemoPrimitives";
import { GrainGradient } from "@/components/ui/GrainGradient";

export function IncidentCarousel({
  incidents,
  onOpen,
  motionOff = false,
}: {
  incidents: Incident[];
  onOpen: (id: string) => void;
  motionOff?: boolean;
}) {
  const [activeId, setActiveId] = useState(incidents[0]?.id);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion() || motionOff;
  const index = Math.max(
    0,
    incidents.findIndex((item) => item.id === activeId),
  );
  const active = incidents[index];
  if (!active) return null;
  // Carrusel infinito: del último vuelve al primero y al revés.
  const wrap = (offset: number) =>
    incidents[(index + offset + incidents.length) % incidents.length];
  function move(delta: number) {
    const next = wrap(delta);
    if (next) {
      setDirection(delta);
      setActiveId(next.id);
    }
  }
  return (
    <section
      className="incident-carousel demo-panel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Explorar casos"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      {/* Fondo en movimiento, el de los pilares de la landing. */}
      <div className="incident-carousel-bg" aria-hidden="true">
        <GrainGradient
          colors={["#A5C8AE", "#DBBA95", "#E05D44"]}
          still={Boolean(reduced)}
        />
      </div>
      <div className="incident-carousel-heading">
        <div>
          <p className="demo-eyebrow">Explora la evidencia</p>
          <h2>Un caso. Una decisión informada.</h2>
        </div>
        <span aria-live="polite" aria-atomic="true">
          Caso {index + 1} de {incidents.length}
        </span>
      </div>
      <div className="incident-carousel-stage">
        {/* Flechas a los costados de la tarjeta. */}
        <button
          type="button"
          className="incident-carousel-side is-left"
          aria-label="Caso anterior"
          disabled={incidents.length < 2}
          onClick={() => move(-1)}
        >
          <ArrowLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="incident-carousel-side is-right"
          aria-label="Caso siguiente"
          disabled={incidents.length < 2}
          onClick={() => move(1)}
        >
          <ArrowRight aria-hidden="true" />
        </button>
        {!reduced
          ? [-1, 1].map((side) => {
              const item = incidents.length > 1 ? wrap(side) : undefined;
              return item ? (
                <motion.div
                  key={`preview-${side}`}
                  aria-hidden="true"
                  className="incident-carousel-preview"
                  initial={false}
                  animate={{
                    x: `${side * 38}%`,
                    rotateY: side * -28,
                    scale: 0.8,
                    opacity: 0.55,
                  }}
                  whileHover={{ opacity: 0.8, scale: 0.83 }}
                  onClick={() => move(side)}
                  transition={{ type: "spring", stiffness: 160, damping: 24 }}
                >
                  <IncidentPoster scenario={item.scenario} />
                </motion.div>
              ) : null;
            })
          : null}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.article
            key={active.id}
            className="incident-carousel-card"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${incidents.length}: ${scenarios[active.scenario].title}`}
            initial={{
              opacity: reduced ? 1 : 0,
              x: reduced ? 0 : direction * 120,
              rotateY: reduced ? 0 : direction * -18,
              scale: reduced ? 1 : 0.92,
            }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            exit={{
              opacity: reduced ? 1 : 0,
              x: reduced ? 0 : direction * -120,
              rotateY: reduced ? 0 : direction * 18,
              scale: reduced ? 1 : 0.92,
            }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 28 }
            }
          >
            <motion.div
              className="incident-carousel-image"
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 40)
                  move(info.offset.x < 0 ? 1 : -1);
              }}
            >
              <IncidentPoster scenario={active.scenario} />
            </motion.div>
            <div className="incident-carousel-copy">
              <StatusBadge incident={active} />
              <h3>{scenarios[active.scenario].title}</h3>
              <p>
                {scenarios[active.scenario].verdict ??
                  scenarios[active.scenario].summary}
              </p>
              <span>
                <MapPin size={15} aria-hidden="true" />
                {scenarios[active.scenario].place}
              </span>
              <motion.button
                whileTap={reduced ? undefined : { scale: 0.98 }}
                className="demo-button demo-button-primary"
                type="button"
                onClick={() => onOpen(active.id)}
              >
                <Eye aria-hidden="true" />
                Revisar este caso
                <ArrowRight aria-hidden="true" />
              </motion.button>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="incident-carousel-controls" aria-hidden="true">
        {incidents.map((item, dot) => (
          <i key={item.id} data-active={dot === index} />
        ))}
      </div>
      <p className="demo-hint">
        Usa las flechas de los costados, arrastra la imagen o las teclas ← →.
      </p>
    </section>
  );
}
