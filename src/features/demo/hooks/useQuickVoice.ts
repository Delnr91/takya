"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type VoiceResult = { isFinal: boolean; 0: { transcript: string } };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<VoiceResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionConstructor = new () => Recognition;
function recognitionConstructor(): RecognitionConstructor | undefined {
  const browser = window as typeof window & {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
}
const subscribe = () => () => {};
const noSupport = () => false;
const dictationSupported = () => Boolean(recognitionConstructor());
const readingSupported = () => "speechSynthesis" in window;

export function useQuickVoice(onTranscript: (text: string) => void) {
  const canListen = useSyncExternalStore(
    subscribe,
    dictationSupported,
    noSupport,
  );
  const canSpeak = useSyncExternalStore(subscribe, readingSupported, noSupport);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognition = useRef<Recognition | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback = useRef(onTranscript);
  useEffect(() => {
    callback.current = onTranscript;
  }, [onTranscript]);
  function clearTimer() {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
  }
  useEffect(
    () => () => {
      const active = recognition.current;
      if (active) {
        active.onresult = active.onerror = active.onend = null;
        active.abort();
      }
      if (timeout.current) clearTimeout(timeout.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );
  function stopReading() {
    if (canSpeak) window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function stopListening() {
    recognition.current?.stop();
    clearTimer();
  }
  function startListening() {
    if (recognition.current) return;
    const Constructor = recognitionConstructor();
    if (!Constructor) return;
    stopReading();
    setVoiceError("");
    const active = new Constructor();
    active.lang = "es-CL";
    active.continuous = false;
    active.interimResults = true;
    active.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .trim()
        .slice(0, 600);
      if (text) callback.current(text);
    };
    active.onerror = (event) => {
      if (event.error !== "aborted")
        setVoiceError(
          event.error === "not-allowed" || event.error === "service-not-allowed"
            ? "El micrófono no está disponible. Puedes permitirlo en el navegador o escribir."
            : event.error === "no-speech"
              ? "No alcancé a escucharte. Intenta otra vez o escribe."
              : "No pude escuchar ahora. Puedes escribir tu consulta.",
        );
    };
    active.onend = () => {
      clearTimer();
      recognition.current = null;
      setListening(false);
    };
    recognition.current = active;
    try {
      active.start();
      setListening(true);
      timeout.current = setTimeout(() => active.stop(), 20000);
    } catch {
      recognition.current = null;
      setListening(false);
      setVoiceError("No pude abrir el micrófono. Puedes escribir tu consulta.");
    }
  }
  function read(text: string) {
    if (!canSpeak) return;
    stopListening();
    if (speaking) {
      stopReading();
      return;
    }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "es-CL";
    speech.rate = 0.92;
    const voice = window.speechSynthesis
      .getVoices()
      .find((item) => item.lang.startsWith("es"));
    if (voice) speech.voice = voice;
    speech.onend = speech.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(speech);
  }
  return {
    canListen,
    canSpeak,
    listening,
    speaking,
    voiceError,
    startListening,
    stopListening,
    read,
    stopReading,
  };
}
