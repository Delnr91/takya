"use client";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { ArrowUp, RotateCcw, Volume2, Square, ArrowRight } from "lucide-react";
import { CognitiveFluidBackground } from "./CognitiveFluidBackground";
import {
  CojeevPictogram,
  type CojeevPictogramName,
} from "@/components/ui/CojeevPictogram";
import { useCognitiveChat } from "../hooks/useCognitiveChat";

const prompts: {
  label: string;
  question: string;
  icon: CojeevPictogramName;
}[] = [
  {
    label: "Ayúdame a empezar",
    question: "No sé por dónde empezar. Ayúdame con el primer paso.",
    icon: "eye",
  },
  {
    label: "Conocer TAKYA",
    question: "¿Qué es TAKYA y para qué sirve?",
    icon: "brain",
  },
  {
    label: "Leer con comodidad",
    question: "Me cuesta leer la pantalla. ¿Cómo puedo ajustarla?",
    icon: "settings",
  },
];
const subscribeSpeechSupport = () => () => {};
const speechSupported = () => "speechSynthesis" in window;
const serverSpeechSupport = () => false;
export function CognitiveGuide({
  compact = false,
  motionOff = false,
  onGuide,
  contextLabel,
}: {
  compact?: boolean;
  motionOff?: boolean;
  onGuide?: () => void;
  contextLabel?: string;
}) {
  const { turns, question, setQuestion, pending, error, ask, reset } =
    useCognitiveChat();
  const logRef = useRef<HTMLDivElement>(null);
  const canSpeak = useSyncExternalStore(
    subscribeSpeechSupport,
    speechSupported,
    serverSpeechSupport,
  );
  const [speaking, setSpeaking] = useState<string | null>(null);
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns, pending]);
  function read(id: string, text: string) {
    window.speechSynthesis.cancel();
    if (speaking === id) {
      setSpeaking(null);
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "es-CL";
    speech.rate = 0.92;
    const voice = window.speechSynthesis
      .getVoices()
      .find((item) => item.lang.startsWith("es"));
    if (voice) speech.voice = voice;
    speech.onend = speech.onerror = () => setSpeaking(null);
    setSpeaking(id);
    window.speechSynthesis.speak(speech);
  }
  function newConversation() {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeaking(null);
    reset();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }
  return (
    <div className={`demo-ai ${compact ? "demo-ai-compact" : ""}`}>
      {!compact ? (
        <section className="demo-ai-hero">
          <div className="demo-ai-hero-content">
            <p className="demo-eyebrow">Acompañante cognitivo · K8</p>
            <div className="demo-ai-organism" aria-hidden="true">
              <CognitiveFluidBackground motionOff={motionOff} />
            </div>
            <div className="demo-ai-presence-copy">
              <h2>Comprender antes de actuar.</h2>
              <p>Estoy aquí para ayudarte. Vamos paso a paso.</p>
            </div>
          </div>
        </section>
      ) : null}
      <section
        className="demo-ai-body demo-panel"
        aria-label="Conversación con K8"
      >
        <div className="demo-ai-intro">
          <div>
            <p className="demo-eyebrow">
              {compact
                ? `Ayuda rápida · ${contextLabel ?? "Consola"}`
                : "Conversa con K8"}
            </p>
            <h2>{compact ? "Vamos paso a paso." : "¿En qué te ayudo?"}</h2>
          </div>
          {turns.length > 0 && (
            <button
              className="k8-text-button"
              type="button"
              onClick={newConversation}
              disabled={pending}
            >
              <RotateCcw size={17} aria-hidden="true" /> Nueva conversación
            </button>
          )}
        </div>
        <div
          ref={logRef}
          className="k8-chat-log"
          role="log"
          aria-label="Mensajes de la conversación"
          aria-live="polite"
          aria-relevant="additions text"
          tabIndex={0}
        >
          <div className="k8-message k8-message-assistant">
            <strong>K8</strong>
            <p>
              Hola, soy K8. Puedo explicarte TAKYA y ayudarte a usar la consola.
              Elige una opción o cuéntame qué necesitas.
            </p>
          </div>
          {turns.map((turn) => (
            <div key={turn.id} className="k8-turn">
              <div className="k8-message k8-message-user">
                <strong>Tú</strong>
                <p>{turn.question}</p>
              </div>
              {turn.response && (
                <div className="k8-message k8-message-assistant">
                  <strong>K8</strong>
                  <p>{turn.response.answer}</p>
                  <div className="k8-message-tools">
                    {canSpeak && (
                      <button
                        type="button"
                        onClick={() => read(turn.id, turn.response!.answer)}
                        aria-pressed={speaking === turn.id}
                      >
                        {speaking === turn.id ? (
                          <Square size={16} aria-hidden="true" />
                        ) : (
                          <Volume2 size={16} aria-hidden="true" />
                        )}
                        {speaking === turn.id ? "Detener lectura" : "Escuchar"}
                      </button>
                    )}
                    {turn.response.sources.length > 0 ? (
                      <details>
                        <summary>Guías consultadas</summary>
                        <ul>
                          {turn.response.sources.map((title) => (
                            <li key={title}>{title}</li>
                          ))}
                        </ul>
                      </details>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))}
          {pending && (
            <p className="k8-chat-status" role="status">
              K8 está preparando tu respuesta…
            </p>
          )}
        </div>
        {error && (
          <p className="k8-chat-error" role="alert">
            {error}
          </p>
        )}
        {turns.length === 0 ? (
          <div className="k8-starters" aria-label="Elige cómo empezar">
            {(compact
              ? [
                  {
                    label: "Ayuda en esta pantalla",
                    question: `Estoy en ${contextLabel ?? "Inicio"} de TAKYA. Ayúdame con el primer paso.`,
                    icon: "eye" as const,
                  },
                  {
                    label: "Revisar un video",
                    question:
                      "¿Cómo reviso los clips de un caso en TAKYA? Dame el primer paso.",
                    icon: "brain" as const,
                  },
                  prompts[2]!,
                ]
              : prompts
            ).map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                disabled={pending}
                onClick={() => void ask(prompt.question)}
              >
                <CojeevPictogram name={prompt.icon} size={27} />
                <span>{prompt.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="demo-ai-prompts" aria-label="Ayuda para comprender">
            <button
              type="button"
              disabled={pending}
              onClick={() => void ask("Explícalo más fácil, por favor.")}
            >
              <CojeevPictogram name="message-circle" size={19} /> Explícalo más
              fácil
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                void ask("Guíame paso a paso. Dame solo el primer paso.")
              }
            >
              <CojeevPictogram name="arrow-up-right" size={19} /> Paso a paso
            </button>
          </div>
        )}
        <form onSubmit={submit} className="k8-composer">
          <label htmlFor={compact ? "k8-question-modal" : "k8-question-page"}>
            Escribe tu mensaje
          </label>
          <div>
            <textarea
              id={compact ? "k8-question-modal" : "k8-question-page"}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Por ejemplo: no sé cómo empezar"
              maxLength={600}
              rows={2}
              aria-describedby={compact ? "k8-help-modal" : "k8-help-page"}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void ask(question);
                }
              }}
            />
            <button type="submit" disabled={pending || !question.trim()}>
              <ArrowUp size={20} aria-hidden="true" />
              <span>Enviar</span>
            </button>
          </div>
          <span id={compact ? "k8-help-modal" : "k8-help-page"}>
            Enter para enviar · Mayús + Enter para otra línea
          </span>
        </form>
        <div className="demo-ai-foot">
          <span>K8 usa IA y puede equivocarse. Tú mantienes el control.</span>
          {onGuide && (
            <button type="button" onClick={onGuide}>
              Ver ayuda <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </div>
        <details className="k8-privacy">
          <summary>Tu privacidad en el chat</summary>
          <p>
            Para responder, enviamos tu mensaje y el contexto de la conversación
            a Groq. No se envían tus casos ni imágenes. Evita compartir datos
            personales o claves. Esta conversación no se guarda en una base de
            datos de TAKYA.
          </p>
        </details>
      </section>
    </div>
  );
}
