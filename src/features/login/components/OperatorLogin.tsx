"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnimate, useReducedMotion } from "framer-motion";
import { Eye } from "lucide-react";
import { ArrowLeft, LogIn, ShieldCheck } from "@/components/icons";
import { profileSchema } from "@/features/demo/schemas/simulation";
import { beginPractice } from "@/features/demo/model/profile";
import "./login.css";

const DEFAULT_NAME = "Operador 03";
const LOCK_SIZE = 112;

type Phase = "idle" | "locking" | "locked" | "instant";

const PHASE_MESSAGE: Record<Phase, string> = {
  idle: "",
  locking: "Asegurando tu sesión…",
  locked: "Listo. Abriendo la consola…",
  instant: "Abriendo la consola…",
};

const MAIN_CLASS: Record<Phase, string> = {
  idle: "takya-login",
  locking: "takya-login is-locking",
  locked: "takya-login is-locking",
  instant: "takya-login is-instant",
};

/**
 * Acceso de demostración solo para operador: entra con el usuario, sin
 * contraseña. No es autenticación; abre la práctica en esta pestaña. Sin
 * asistentes ni ayudas en esta pantalla (superficie mínima); la supervisión y
 * los ajustes de accesibilidad están dentro de la consola.
 */
export function OperatorLogin() {
  const router = useRouter();
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState(DEFAULT_NAME);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  // La consola queda precargada para que aparezca apenas cierre el candado.
  useEffect(() => {
    router.prefetch("/demo");
  }, [router]);

  // Al entrar, la tarjeta se reduce a un candado que se cierra y da paso a la
  // consola. Con movimiento reducido se entra directo.
  async function lockAndEnter() {
    const main = scope.current;
    const card = main.querySelector<HTMLElement>(".takya-login-card");
    if (reduceMotion || !card) {
      setPhase("instant");
      router.replace("/demo");
      return;
    }
    setPhase("locking");
    // En pantallas bajas la tarjeta parte arriba: el candado baja al centro.
    const rect = card.getBoundingClientRect();
    const fromTop = getComputedStyle(main).alignItems === "start";
    const y = fromTop ? window.innerHeight / 2 - LOCK_SIZE / 2 - rect.top : 0;

    await animate(
      ".takya-login-content, .takya-login-watermark",
      { opacity: 0, scale: 0.96 },
      { duration: 0.16, ease: "easeIn" },
    );
    // El candado aparece y se cierra mientras la tarjeta termina de asentarse:
    // no se espera el reposo del resorte.
    void animate(
      card,
      {
        width: LOCK_SIZE,
        height: LOCK_SIZE,
        borderRadius: 34,
        backgroundColor: "#1b3b2b",
        y,
      },
      { type: "spring", stiffness: 260, damping: 28 },
    );
    await Promise.all([
      animate(
        ".takya-login-lock",
        { opacity: [0, 1], scale: [0.7, 1] },
        { duration: 0.18, delay: 0.3, ease: "easeOut" },
      ),
      animate(
        ".takya-login-lock-caption",
        { opacity: 1 },
        { duration: 0.18, delay: 0.3 },
      ),
    ]);
    await Promise.all([
      animate(
        ".takya-login-lock-shackle",
        { y: [-5, 0] },
        { type: "spring", stiffness: 600, damping: 22 },
      ),
      animate(
        ".takya-login-lock-body",
        { scale: [1, 0.9, 1] },
        { duration: 0.26, delay: 0.06 },
      ),
    ]);
    setPhase("locked");
    animate(
      ".takya-login-lock-ring",
      { opacity: [0.9, 0], scale: [1, 1.7] },
      { duration: 0.7, ease: "easeOut" },
    );
    router.replace("/demo");
  }

  return (
    <main ref={scope} className={MAIN_CLASS[phase]}>
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

        <div className="takya-login-content" inert={phase !== "idle"}>
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

            <p className="takya-login-eyebrow">
              Acceso de práctica <span>Demo</span>
            </p>
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
                  name: name.trim(),
                  role: "OPERATOR",
                });
                if (!result.success) {
                  setError("Escribe tu usuario para entrar.");
                  return;
                }
                if (phase !== "idle") return;
                beginPractice(result.data);
                void lockAndEnter();
              }}
            >
              <div className="takya-login-field">
                <label htmlFor="takya-login-user">Usuario</label>
                <input
                  id="takya-login-user"
                  type="text"
                  value={name}
                  maxLength={32}
                  // Usuario de práctica: que el navegador no lo guarde ni lo sugiera.
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  enterKeyHint="go"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    error
                      ? "takya-login-error takya-login-demo-note"
                      : "takya-login-demo-note"
                  }
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                />
              </div>
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
                disabled={phase !== "idle"}
              >
                <LogIn size={22} aria-hidden="true" />
                Iniciar sesión
              </button>
            </form>

            <p id="takya-login-demo-note" className="takya-login-note">
              <ShieldCheck size={18} aria-hidden="true" />
              Modo demo: entras solo con tu usuario, sin contraseña. Nada sale
              de este navegador.
            </p>
          </div>
        </div>

        <div className="takya-login-lock" aria-hidden="true">
          <span className="takya-login-lock-ring" />
          <svg
            viewBox="0 0 24 24"
            width="52"
            height="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="takya-login-lock-shackle"
              d="M7 11V7a5 5 0 0 1 10 0v4"
            />
            <g className="takya-login-lock-body">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <circle cx="12" cy="16.5" r="1.4" fill="currentColor" />
            </g>
          </svg>
        </div>
      </section>

      <p className="takya-login-lock-caption" role="status">
        {PHASE_MESSAGE[phase]}
      </p>
    </main>
  );
}
