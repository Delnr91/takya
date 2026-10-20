"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  BookOpen,
  Compass,
  Eye,
  Keyboard,
  Lock,
  Mic,
  ScanSearch,
  Square,
  Type,
  Volume2,
} from "lucide-react";
import { CognitiveFluidBackground } from "./CognitiveFluidBackground";
import { useCognitiveChat } from "../hooks/useCognitiveChat";
import { useQuickVoice } from "../hooks/useQuickVoice";
import { K8_ANSWERS } from "../data/k8Answers";
import "./k8-assistant.css";

const TILE_ICONS = {
  ahora: Compass,
  revisar: Eye,
  evidencia: Lock,
  analizar: ScanSearch,
  lectura: Type,
  takya: BookOpen,
} as const;

/**
 * K8 IA: el alma de K8 de fondo y una conversación pensada para lectura fácil
 * (como las apps para personas con TEA, pero para adultos): voz primero,
 * fichas grandes con pictograma, una idea por respuesta y nada que asuste.
 */
export function K8Assistant({ motionOff }: { motionOff: boolean }) {
  const reduce = Boolean(useReducedMotion()) || motionOff;
  const { turns, question, setQuestion, pending, ask, guide } =
    useCognitiveChat();
  const voice = useQuickVoice(setQuestion);
  const [typing, setTyping] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const lastRead = useRef<string | null>(null);
  const latest = turns.at(-1);
  const answer = latest?.response?.answer ?? null;
  const activity = voice.listening
    ? "listening"
    : pending
      ? "thinking"
      : voice.speaking
        ? "speaking"
        : "idle";
  const status = {
    listening: "Te escucho…",
    thinking: "Estoy pensando…",
    speaking: "Te lo estoy leyendo",
    idle: "Estoy contigo",
  }[activity];

  // Al llegar una respuesta nueva, K8 la lee en voz alta (si está activado).
  useEffect(() => {
    if (!answer || !latest || lastRead.current === latest.id) return;
    lastRead.current = latest.id;
    if (autoRead && voice.canSpeak) voice.read(answer);
  }, [answer, latest, autoRead, voice]);

  // Cuando termina el dictado, la pregunta se envía sola.
  const wasListening = useRef(false);
  useEffect(() => {
    if (wasListening.current && !voice.listening && question.trim())
      void ask(question);
    wasListening.current = voice.listening;
  }, [voice.listening, question, ask]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    voice.stopReading();
    void ask(question);
  }

  return (
    <div className="k8-assistant">
      <section
        className="k8-stage"
        data-activity={activity}
        aria-label="Conversación con K8"
      >
        <div className="k8-stage-soul" aria-hidden="true">
          <CognitiveFluidBackground motionOff={reduce} activity={activity} />
        </div>
        <div className="k8-stage-content">
          <span className="k8-status" role="status">
            <i aria-hidden="true" />
            {status}
          </span>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={latest?.id ?? "hola"}
              className="k8-bubble"
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              aria-live="polite"
            >
              {latest ? (
                <p className="k8-bubble-question">Tú: {latest.question}</p>
              ) : null}
              <p className="k8-bubble-answer">
                {pending
                  ? "Un momento…"
                  : (answer ??
                    "Hola, soy K8. Toca «Hablar» y pregúntame. O elige una ficha.")}
              </p>
              {answer && voice.canSpeak ? (
                <button
                  type="button"
                  className="k8-listen"
                  onClick={() => voice.read(answer)}
                  aria-pressed={voice.speaking}
                >
                  {voice.speaking ? <Square /> : <Volume2 />}
                  {voice.speaking ? "Detener" : "Escuchar"}
                </button>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="k8-controls">
            <motion.button
              type="button"
              className="k8-mic"
              aria-pressed={voice.listening}
              disabled={pending || !voice.canListen}
              onClick={
                voice.listening ? voice.stopListening : voice.startListening
              }
              whileTap={reduce ? undefined : { scale: 0.94 }}
            >
              <span className="k8-mic-rings" aria-hidden="true">
                <i />
                <i />
              </span>
              {voice.listening ? <Square /> : <Mic />}
              <span>{voice.listening ? "Terminar" : "Hablar"}</span>
            </motion.button>
            <button
              type="button"
              className="k8-secondary"
              aria-expanded={typing}
              onClick={() => setTyping(!typing)}
            >
              <Keyboard aria-hidden="true" /> Escribir
            </button>
            <button
              type="button"
              className="k8-secondary"
              aria-pressed={autoRead}
              onClick={() => setAutoRead(!autoRead)}
            >
              <Volume2 aria-hidden="true" />
              {autoRead ? "Voz activada" : "Voz apagada"}
            </button>
          </div>
          {!voice.canListen ? (
            <p className="k8-hint">
              Este navegador no permite hablar. Usa las fichas o «Escribir».
            </p>
          ) : null}

          {typing ? (
            <form className="k8-type" onSubmit={submit}>
              <label className="sr-only" htmlFor="k8-question">
                Tu pregunta
              </label>
              <input
                id="k8-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Escribe tu pregunta…"
                maxLength={600}
                autoComplete="off"
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending || !question.trim()}
                aria-label="Enviar"
              >
                <ArrowUp aria-hidden="true" />
              </button>
            </form>
          ) : null}
        </div>
      </section>

      <h2 className="k8-tiles-title">Toca una pregunta</h2>
      <div className="k8-tiles">
        {K8_ANSWERS.map((item) => {
          const Icon = TILE_ICONS[item.id as keyof typeof TILE_ICONS];
          return (
            <motion.button
              type="button"
              key={item.id}
              className="k8-tile"
              disabled={pending}
              whileHover={reduce ? undefined : { y: -4 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              onClick={() => {
                voice.stopReading();
                guide(item.question, item.answer);
              }}
            >
              <span className="k8-tile-icon" aria-hidden="true">
                <Icon />
              </span>
              <span>{item.question}</span>
            </motion.button>
          );
        })}
      </div>
      <p className="k8-privacy">
        K8 orienta; no decide por ti. Si usas «Hablar», el navegador puede usar
        su servicio de voz. No compartas datos personales.
      </p>
    </div>
  );
}
