import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, MapPin } from "lucide-react";
import type { Incident } from "../schemas/simulation";
import { scenarios } from "../data/scenarios";
import { IncidentPoster } from "./IncidentPoster";
import { StatusBadge } from "./DemoPrimitives";

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
  function move(delta: number) {
    const next = incidents[index + delta];
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
        {!reduced
          ? [-1, 1].map((side) => {
              const item = incidents[index + side];
              return item ? (
                <motion.div
                  key={`preview-${side}`}
                  aria-hidden="true"
                  className="incident-carousel-preview"
                  initial={false}
                  animate={{
                    x: `${side * 34}%`,
                    rotateY: side * -22,
                    scale: 0.82,
                    opacity: 0.38,
                  }}
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
              x: reduced ? 0 : direction * 45,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: reduced ? 1 : 0,
              x: reduced ? 0 : direction * -45,
            }}
            transition={{ duration: reduced ? 0 : 0.2 }}
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
      <div className="incident-carousel-controls">
        <motion.button
          whileTap={reduced ? undefined : { scale: 0.96 }}
          type="button"
          className="demo-button demo-button-secondary"
          disabled={index === 0}
          onClick={() => move(-1)}
        >
          <ArrowLeft aria-hidden="true" />
          <span>Anterior</span>
        </motion.button>
        <span className="incident-carousel-counter">
          {index + 1} / {incidents.length}
        </span>
        <motion.button
          whileTap={reduced ? undefined : { scale: 0.96 }}
          type="button"
          className="demo-button demo-button-secondary"
          disabled={index === incidents.length - 1}
          onClick={() => move(1)}
        >
          <span>Siguiente</span>
          <ArrowRight aria-hidden="true" />
        </motion.button>
      </div>
      <p className="demo-hint">
        Usa los botones o las flechas del teclado para cambiar de caso.
      </p>
    </section>
  );
}
