"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { type } from "./typography";

export type FlowStep = { title: string; text: string };

const STEP_MS = 3600;
// Zona y detección sobre el fotograma (coordenadas del viewBox 640 × 292).
const ZONE = "M300 36 L636 36 L636 288 L300 288 Z";
const BOX = { x: 326, y: 50, width: 302, height: 232 };

/**
 * «Cómo funciona» como una escena: un mismo fotograma recorre los cinco pasos
 * (recibir, delimitar, analizar, revisar y conservar). Avanza solo mientras
 * está a la vista, se pausa al pasar el puntero y cada paso se puede tocar.
 */
export function HowItWorksFlow({ steps }: { steps: FlowStep[] }) {
  const reduce = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduce;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active === 0 && inView && !reduce) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    } else {
      // La zona y la detección están dibujadas sobre el fotograma 0 (el
      // póster): al salir de «Recibir» el video vuelve ahí para calzar.
      video.pause();
      video.currentTime = 0;
    }
  }, [active, inView, reduce]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(
      () => setActive((current) => (current + 1) % steps.length),
      STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [playing, active, steps.length]);

  return (
    <div
      ref={ref}
      className="takya-flow"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={() => setPaused(false)}
    >
      <figure className="takya-flow-stage" aria-hidden="true">
        <motion.div
          className="takya-flow-frame"
          animate={
            active === 4
              ? { scale: 0.62, rotate: -2, filter: "saturate(0.5)" }
              : { scale: 1, rotate: 0, filter: "saturate(1)" }
          }
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        >
          {/* En «Recibir» corre el video real; en los demás pasos queda
              detenido, como el fotograma sobre el que se trabaja. */}
          <video
            ref={videoRef}
            className="takya-flow-video"
            src="/videos/incidents/residuos-descarga.mp4"
            poster="/videos/incidents/residuos-descarga.jpg"
            muted
            playsInline
            preload="metadata"
          />
          <svg viewBox="0 0 640 292" preserveAspectRatio="none">
            <defs>
              <mask id="takya-flow-mask">
                <rect width="640" height="292" fill="#fff" />
                <path d={ZONE} fill="#000" />
              </mask>
            </defs>
            {active >= 1 && active <= 3 ? (
              <>
                <motion.rect
                  width="640"
                  height="292"
                  fill="#0f2a1f"
                  mask="url(#takya-flow-mask)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                />
                <motion.path
                  key={`zone-${active === 1}`}
                  d={ZONE}
                  fill="none"
                  stroke="#f4f1ea"
                  strokeWidth="2.5"
                  strokeDasharray="10 8"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: active === 1 ? 0 : 1 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduce ? 0 : 1.1, ease: "easeInOut" }}
                />
              </>
            ) : null}
            {active === 2 ? (
              <motion.line
                x1="300"
                x2="636"
                stroke="#a5c8ae"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                initial={{ y1: 40, y2: 40 }}
                animate={{ y1: [40, 284, 40], y2: [40, 284, 40] }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              />
            ) : null}
            {active >= 2 && active <= 3 ? (
              <motion.rect
                {...BOX}
                rx="6"
                fill="none"
                stroke="#e05d44"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: active === 2 ? 1.2 : 0, duration: 0.4 }}
                style={{ transformOrigin: "477px 166px" }}
              />
            ) : null}
          </svg>

          <span className="takya-flow-chip is-rec">
            <i /> Cámara 12 · grabación
          </span>

          <AnimatePresence>
            {active === 0 ? (
              <motion.span
                key="hash"
                className="takya-flow-chip is-hash"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                Huella SHA-256 · 9f3a…c41e
              </motion.span>
            ) : null}
            {active === 1 ? (
              <motion.span
                key="zone"
                className="takya-flow-chip is-zone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8 }}
              >
                Zona marcada · acopio
              </motion.span>
            ) : null}
            {active === 2 ? (
              <motion.span
                key="found"
                className="takya-flow-chip is-found"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.4 }}
              >
                Candidato · posible descarga de residuos
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {active === 3 ? (
            <motion.div
              key="review"
              className="takya-flow-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <span className={type.label}>Qué se vio</span>
              <p>Una persona descarga bolsas junto al acopio.</p>
              <span className={type.label}>Qué no se sabe</span>
              <p>Quién es ni si tiene permiso.</p>
              <span className="takya-flow-actions">
                <b>Verificar</b>
                <motion.b
                  className="is-chosen"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                >
                  Derivar
                </motion.b>
                <b>Descartar</b>
              </span>
            </motion.div>
          ) : null}
          {active === 4 ? (
            <motion.div
              key="seal"
              className="takya-flow-seal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 240 }}
            >
              <svg viewBox="0 0 24 24" width="44" height="44">
                <motion.path
                  d="M7 11V7a5 5 0 0 1 10 0v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ y: -4 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 500 }}
                />
                <rect
                  x="4"
                  y="11"
                  width="16"
                  height="10"
                  rx="2"
                  fill="currentColor"
                />
              </svg>
              <strong>Evidencia sellada</strong>
              <span>Firmada · cifrada · íntegra</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </figure>

      <ol className="takya-flow-steps">
        {steps.map(({ title, text }, index) => {
          const isActive = index === active;
          return (
            <li key={title}>
              <button
                type="button"
                className="takya-flow-step"
                data-active={isActive}
                aria-current={isActive ? "step" : undefined}
                onClick={() => setActive(index)}
              >
                <span className="takya-flow-step-head">
                  <span className={`${type.h3} text-xl`}>{title}</span>
                </span>
                <span className="takya-flow-step-text">{text}</span>
                <span className="takya-flow-progress" aria-hidden="true">
                  {isActive ? (
                    <motion.i
                      key={`${active}-${playing}`}
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: playing ? STEP_MS / 1000 : 0,
                        ease: "linear",
                      }}
                    />
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
