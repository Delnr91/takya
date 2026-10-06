"use client";
import { useEffect, useRef, useState } from "react";
import {
  chatResponseSchema,
  type ChatAnswer,
  type ChatMessage,
} from "../model/chat";
type ChatTurn = { id: string; question: string; response?: ChatAnswer };
export function useCognitiveChat() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => () => requestRef.current?.abort(), []);
  async function ask(value: string) {
    const content = value.trim();
    if (!content || content.length > 600 || requestRef.current) return;
    const previous: ChatMessage[] = turns
      .filter((turn) => turn.response)
      .slice(-4)
      .flatMap((turn) => [
        { role: "user", content: turn.question },
        { role: "assistant", content: turn.response!.answer },
      ]);
    const id = crypto.randomUUID();
    const controller = new AbortController();
    requestRef.current = controller;
    setError("");
    setQuestion("");
    setPending(true);
    setTurns((current) => [...current.slice(-19), { id, question: content }]);
    try {
      const response = await fetch("/api/k8/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...previous, { role: "user", content }],
        }),
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? "Hagamos una pausa. Puedes volver a preguntar en unos minutos."
            : "UNAVAILABLE",
        );
      const result = chatResponseSchema.parse(await response.json());
      setTurns((current) =>
        current.map((turn) =>
          turn.id === id ? { ...turn, response: result } : turn,
        ),
      );
    } catch (cause: unknown) {
      if (!controller.signal.aborted) {
        setTurns((current) => current.filter((turn) => turn.id !== id));
        setQuestion(content);
        setError(
          cause instanceof Error && cause.message.startsWith("Hagamos")
            ? cause.message
            : "No pude responder ahora. Tu pregunta sigue escrita para que puedas enviarla de nuevo.",
        );
      }
    } finally {
      if (!controller.signal.aborted) setPending(false);
      if (requestRef.current === controller) requestRef.current = null;
    }
  }
  function reset() {
    requestRef.current?.abort();
    requestRef.current = null;
    setTurns([]);
    setQuestion("");
    setError("");
    setPending(false);
  }
  function guide(prompt: string, answer: string) {
    if (requestRef.current) return;
    setError("");
    setQuestion("");
    setTurns((current) => [
      ...current.slice(-19),
      {
        id: crypto.randomUUID(),
        question: prompt,
        response: { answer, sources: ["Recorrido guiado de la consola"] },
      },
    ]);
  }
  return { turns, question, setQuestion, pending, error, ask, reset, guide };
}
