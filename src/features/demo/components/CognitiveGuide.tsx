"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, Search, ShieldCheck } from "lucide-react";
import { CojeevAgentState } from "@/components/ui/CojeevAgentState";
import { CognitiveFluidBackground } from "./CognitiveFluidBackground";
import { CojeevPictogram } from "@/components/ui/CojeevPictogram";
import { retrieveKnowledge, type RetrievalResult } from "../model/knowledge";

const prompts = [
  "¿Cómo reviso un caso?",
  "¿Quién toma la decisión?",
  "¿Qué datos se guardan?",
];

export function CognitiveGuide({
  compact = false,
  motionOff = false,
  onGuide,
}: {
  compact?: boolean;
  motionOff?: boolean;
  onGuide?: () => void;
}) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<RetrievalResult | null>(null);
  const ask = (value: string) => {
    setQuestion(value);
    setResult(retrieveKnowledge(value));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(question);
  };
  return (
    <div className={`demo-ai ${compact ? "demo-ai-compact" : ""}`}>
      <section className="demo-ai-hero">
        <CognitiveFluidBackground motionOff={motionOff} />
        <div className="demo-ai-hero-content">
          <p className="demo-eyebrow">Acompañante cognitivo · K8</p>
          <CojeevAgentState
            state={result ? (result.found ? "found" : "unknown") : "idle"}
            label="Comprender antes de actuar."
            description="Pregúntame por el flujo de trabajo, el criterio y los límites de esta práctica."
            motionOff={motionOff}
            compact={compact}
          />
          <span className="demo-ai-local">
            <ShieldCheck size={15} aria-hidden="true" /> Consulta documental
            local · sin API de IA
          </span>
        </div>
      </section>
      <div className="demo-ai-body demo-panel">
        <div className="demo-ai-intro">
          <div>
            <p className="demo-eyebrow">Consulta guiada</p>
            <h2>¿Qué necesitas comprender?</h2>
          </div>
          <CojeevPictogram name="brain" size={32} tone="sage" />
        </div>
        <form onSubmit={submit} className="demo-ai-form">
          <label htmlFor={compact ? "k8-question-modal" : "k8-question-page"}>
            Tu pregunta
          </label>
          <div>
            <Search size={19} aria-hidden="true" />
            <input
              id={compact ? "k8-question-modal" : "k8-question-page"}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Por ejemplo: ¿cómo reviso un caso?"
              maxLength={220}
            />
            <button type="submit" aria-label="Consultar documentos">
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </div>
        </form>
        <div className="demo-ai-prompts" aria-label="Preguntas sugeridas">
          {prompts.map((prompt) => (
            <button type="button" key={prompt} onClick={() => ask(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        <div className="demo-ai-answer" role="status" aria-live="polite">
          {result ? (
            <>
              <div className="demo-ai-answer-heading">
                <BookOpen size={18} aria-hidden="true" />
                <strong>
                  {result.found
                    ? "Respuesta de los documentos"
                    : "Sin respuesta documentada"}
                </strong>
              </div>
              <p>{result.answer}</p>
              {result.sources.length > 0 ? (
                <ul>
                  {result.sources.map((source) => (
                    <li key={source.id}>
                      <strong>{source.title}</strong>
                      <span>{source.source}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <p>
              Selecciona una pregunta o escribe la tuya. K8 mostrará la
              respuesta documentada y su fuente.
            </p>
          )}
        </div>
        <div className="demo-ai-foot">
          <span>
            Esta función busca entre respuestas curadas. No interpreta video ni
            decide por ti.
          </span>
          {onGuide ? (
            <button type="button" onClick={onGuide}>
              Abrir guía <ArrowRight size={15} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
