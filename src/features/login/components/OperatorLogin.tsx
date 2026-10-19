"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { AArrowUp, ArrowLeft, LogIn, ShieldCheck } from "@/components/icons";
import { profileSchema } from "@/features/demo/schemas/simulation";
import { beginPractice } from "@/features/demo/model/profile";
import "./login.css";

const DEFAULT_NAME = "Operador 03";
const INSTRUCTIONS =
  "Acceso de práctica de TAKYA para operadores. Escribe tu nombre de práctica, " +
  "o deja el ejemplo Operador 03. Luego toca el botón Entrar como operador. " +
  "No necesitas contraseña.";

// Preferencia «Texto grande» (doc. 12 §3.5): persiste en este navegador y se lee
// sin desajuste de hidratación mediante useSyncExternalStore.
const LARGE_KEY = "takya.a11y.textoGrande";
const LARGE_EVENT = "takya:texto-grande";
let largeFallback = false;
function readLarge() {
  try {
    return window.localStorage.getItem(LARGE_KEY) === "1";
  } catch {
    return largeFallback;
  }
}
function writeLarge(value: boolean) {
  largeFallback = value;
  try {
    window.localStorage.setItem(LARGE_KEY, value ? "1" : "0");
  } catch {
    /* Sin almacenamiento, la preferencia dura mientras la página esté abierta. */
  }
  window.dispatchEvent(new Event(LARGE_EVENT));
}
function subscribeLarge(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LARGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LARGE_EVENT, onChange);
  };
}
const noSubscribe = () => () => {};
const speechSupported = () =>
  "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

/**
 * Acceso de demostración solo para operador. No es autenticación: abre la
 * práctica en esta pestaña. La supervisión se elige dentro de la consola.
 */
export function OperatorLogin() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [entering, setEntering] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const large = useSyncExternalStore(subscribeLarge, readLarge, () => false);
  const canSpeak = useSyncExternalStore(
    noSubscribe,
    speechSupported,
    () => false,
  );

  // La lectura en voz alta se detiene al salir del login.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function toggleSpeech() {
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(INSTRUCTIONS);
    utterance.lang = "es-CL";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  }

  return (
    <main className={large ? "takya-login is-large" : "takya-login"}>
      <div className="takya-login-backdrop" aria-hidden="true">
        <Image src="/background2.png" alt="" fill sizes="100vw" />
      </div>

      <section className="takya-login-card" aria-labelledby="takya-login-title">
        <div className="takya-login-watermark" aria-hidden="true">
          <Image
            src="/brand/01_maestros_svg/takya-a-simbolo-bosque.svg"
            alt=""
            width={194}
            height={210}
          />
        </div>

        <div className="takya-login-content">
          <div className="takya-login-intro">
            <div className="takya-login-top">
              <Image
                src="/brand/principal-bosque.svg"
                alt="TAKYA"
                width={148}
                height={36}
                className="takya-login-logo"
                loading="eager"
              />
              <Link href="/home" className="takya-login-back">
                <ArrowLeft size={20} aria-hidden="true" />
                Volver al inicio
              </Link>
            </div>

            <p className="takya-login-eyebrow">Acceso de práctica</p>
            <h1 id="takya-login-title">Tu turno, con más claridad.</h1>
            <p className="takya-login-lead">
              Revisa casos, compara fuentes y decide con un motivo.
            </p>

            <div className="takya-login-role">
              <span className="takya-login-pictogram" aria-hidden="true">
                <Eye size={24} className="takya-login-blink" />
              </span>
              <span>
                <strong>Entras como Operador</strong>
                <small>Observa, comprende y decide.</small>
              </span>
            </div>
          </div>

          <div className="takya-login-action">
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const result = profileSchema.safeParse({
                  name: name.trim() || DEFAULT_NAME,
                  role: "OPERATOR",
                });
                if (!result.success) {
                  setError(
                    result.error.issues[0]?.message ??
                      "Revisa tu nombre de práctica.",
                  );
                  return;
                }
                window.speechSynthesis?.cancel();
                setEntering(true);
                beginPractice(result.data);
                router.replace("/demo");
              }}
            >
              <label className="takya-login-field" htmlFor="takya-login-name">
                <span id="takya-login-name-label">
                  Nombre de práctica <em>(opcional)</em>
                </span>
                <input
                  id="takya-login-name"
                  type="text"
                  value={name}
                  maxLength={32}
                  placeholder={DEFAULT_NAME}
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  enterKeyHint="go"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "takya-login-error" : undefined}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                />
              </label>
              {error ? (
                <p
                  id="takya-login-error"
                  className="takya-login-error"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="takya-login-submit"
                disabled={entering}
                aria-busy={entering || undefined}
              >
                <LogIn size={22} aria-hidden="true" />
                {entering ? "Abriendo la consola…" : "Entrar como operador"}
              </button>
            </form>

            <div className="takya-login-aids" role="group" aria-label="Ayudas">
              {canSpeak ? (
                <button
                  type="button"
                  aria-pressed={speaking}
                  className={speaking ? "is-speaking" : undefined}
                  onClick={toggleSpeech}
                >
                  <span className="takya-login-k8" aria-hidden="true">
                    <Image
                      src="/brand/k8-robot.png"
                      alt=""
                      width={28}
                      height={42}
                    />
                  </span>
                  {speaking ? "Detener a K8" : "K8 te lo explica"}
                </button>
              ) : null}
              <button
                type="button"
                aria-pressed={large}
                onClick={() => writeLarge(!large)}
              >
                <AArrowUp size={18} aria-hidden="true" />
                Texto grande
              </button>
            </div>

            <p className="takya-login-note">
              <ShieldCheck size={18} aria-hidden="true" />
              Acceso simulado: no necesitas contraseña. La supervisión se activa
              dentro de la consola.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
