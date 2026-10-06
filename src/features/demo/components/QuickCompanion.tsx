"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Mic, Square, Volume2, Info, Compass } from "lucide-react";
import { CognitiveFluidBackground } from "./CognitiveFluidBackground";
import { useCognitiveChat } from "../hooks/useCognitiveChat";
import { useQuickVoice } from "../hooks/useQuickVoice";
import { getQuickGuidance } from "../data/quickGuidance";
import "./quick-companion.css";

/** A quick consultation surface, independent of the full dashboard chat. */
export function QuickCompanion({
  contextLabel,
  motionOff,
  supervisor = false,
  hasNextCase = true,
  hasPendingReferral = false,
}: {
  contextLabel: string;
  motionOff: boolean;
  supervisor?: boolean;
  hasNextCase?: boolean;
  hasPendingReferral?: boolean;
}) {
  const { turns, question, setQuestion, pending, error, ask, guide } =
    useCognitiveChat();
  const voice = useQuickVoice(setQuestion);
  const [privacy, setPrivacy] = useState(false);
  const reduced = useReducedMotion() || motionOff;
  const latest = turns.at(-1);
  const answer = latest?.response?.answer;
  const activity = voice.listening
    ? "listening"
    : pending
      ? "thinking"
      : voice.speaking
        ? "speaking"
        : "idle";
  const status = voice.listening
    ? "Te escucho"
    : pending
      ? "Estoy pensando"
      : voice.speaking
        ? "Te acompaño"
        : "Estoy contigo";
  function send(value: string) {
    if (pending || voice.listening) return;
    voice.stopListening();
    voice.stopReading();
    void ask(value);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(question);
  }
  return (
    <section
      className={`k8-quick ${reduced ? "k8-quick-still" : ""}`}
      aria-label="Consulta rápida con K8"
    >
      <div className="k8-quick-presence" data-activity={activity}>
        <div className="k8-quick-stage" aria-hidden="true">
          <CognitiveFluidBackground
            motionOff={Boolean(reduced)}
            activity={activity}
          />
        </div>
        <span className="k8-quick-state" role="status">
          <i aria-hidden="true" />
          {status}
        </span>
        <span className="k8-quick-context">{contextLabel}</span>
      </div>
      <div
        className="k8-quick-answer"
        role="log"
        aria-label="Respuesta de K8"
        aria-live="polite"
        aria-relevant="additions text"
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={latest?.id ?? "welcome"}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
          >
            {pending
              ? "Un momento, estoy preparando tu respuesta…"
              : (answer ?? "Cuéntame qué necesitas. Podemos ir paso a paso.")}
          </motion.p>
        </AnimatePresence>
      </div>
      {error || voice.voiceError ? (
        <p className="k8-quick-error" role="alert">
          {error || voice.voiceError}
        </p>
      ) : null}
      <form className="k8-quick-composer" onSubmit={submit}>
        <label className="sr-only" htmlFor="k8-quick-question">
          Tu consulta a K8
        </label>
        <input
          id="k8-quick-question"
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={voice.listening ? "Te escucho…" : "Escribe tu consulta…"}
          maxLength={600}
          autoComplete="off"
          aria-describedby="k8-quick-hint"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !question.trim() || voice.listening}
          aria-label="Enviar consulta"
          title="Enviar consulta"
        >
          <ArrowUp aria-hidden="true" />
          <span>Enviar</span>
        </button>
      </form>
      <p id="k8-quick-hint" className="k8-quick-hint">
        {voice.listening
          ? "Pulsa Terminar, revisa lo escrito y envía."
          : "Escribe o pulsa Hablar."}
      </p>
      <div className="k8-quick-actions">
        <button
          type="button"
          disabled={pending || !voice.canListen}
          aria-pressed={voice.listening}
          onClick={voice.listening ? voice.stopListening : voice.startListening}
        >
          {voice.listening ? (
            <Square aria-hidden="true" />
          ) : (
            <Mic aria-hidden="true" />
          )}
          {voice.listening ? "Terminar" : "Hablar"}
        </button>
        {answer && voice.canSpeak ? (
          <button
            type="button"
            onClick={() => voice.read(answer)}
            aria-pressed={voice.speaking}
          >
            {voice.speaking ? (
              <Square aria-hidden="true" />
            ) : (
              <Volume2 aria-hidden="true" />
            )}
            {voice.speaking ? "Detener" : "Escuchar"}
          </button>
        ) : (
          <button
            type="button"
            aria-label="Guíame aquí"
            disabled={pending || voice.listening}
            onClick={() => {
              voice.stopReading();
              const step = getQuickGuidance(contextLabel, {
                supervisor,
                hasNextCase,
                hasPendingReferral,
              });
              guide(step.question, step.answer);
            }}
          >
            <Compass aria-hidden="true" />
            Guíame
          </button>
        )}
        <button
          className="k8-quick-info"
          type="button"
          aria-label="Privacidad de la consulta"
          aria-expanded={privacy}
          aria-controls="k8-quick-privacy"
          onClick={() => setPrivacy(!privacy)}
        >
          <Info aria-hidden="true" />
        </button>
      </div>
      {!voice.canListen ? (
        <p className="k8-quick-hint">
          El dictado no está disponible aquí. Puedes escribir
          {voice.canSpeak ? " y escuchar la respuesta." : " tu consulta."}
        </p>
      ) : null}
      {privacy ? (
        <p id="k8-quick-privacy" className="k8-quick-privacy">
          El micrófono solo se activa al pulsar Hablar. El navegador puede usar
          su servicio de voz para transcribir. Revisa el texto antes de
          enviarlo. K8 envía tu consulta y conversación a Groq; no envía videos.
          Evita datos personales o claves. K8 puede equivocarse.
        </p>
      ) : null}
    </section>
  );
}
