"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAnimate, useReducedMotion } from "framer-motion";
import { Eye } from "lucide-react";
import { LogIn, Moon, ShieldCheck, Sun } from "@/components/icons";
import { readTheme, subscribeTheme, writeTheme, type Theme } from "@/lib/theme";
import { profileSchema } from "@/features/demo/schemas/simulation";
import { beginPractice } from "@/features/demo/model/profile";
import { ACCESS_USER } from "@/lib/access-shared";
import "./login.css";

const OPERATOR_NAME = "Centinela";
const LOCK_SIZE = 112;

type Phase = "idle" | "checking" | "locking" | "locked" | "instant";

const PHASE_MESSAGE: Record<Phase, string> = {
  idle: "",
  checking: "Comprobando el acceso…",
  locking: "Asegurando tu sesión…",
  locked: "Listo. Abriendo la consola…",
  instant: "Abriendo la consola…",
};

const MAIN_CLASS: Record<Phase, string> = {
  idle: "takya-login",
  checking: "takya-login",
  locking: "takya-login is-locking",
  locked: "takya-login is-locking",
  instant: "takya-login is-instant",
};

/**
 * Acceso privado a la demo: usuario fijo «centinela» y una contraseña que
 * valida el servidor (/api/access), que emite una cookie HttpOnly. Sin
 * asistentes ni ayudas en esta pantalla (superficie mínima); los ajustes de
 * accesibilidad están dentro de la consola.
 */
export function OperatorLogin() {
  const router = useRouter();
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduceMotion = useReducedMotion();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  // Mismo modo día/noche que la consola (ver src/lib/theme.ts).
  const theme = useSyncExternalStore<Theme>(
    subscribeTheme,
    () => readTheme() ?? "day",
    () => "day",
  );
  const toggleTheme = () => writeTheme(theme === "night" ? "day" : "night");

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
    // El candado siempre se cierra al centro de la pantalla, venga la tarjeta
    // de la columna derecha (escritorio) o de abajo de la bienvenida (teléfono).
    const rect = card.getBoundingClientRect();

    await animate(
      ".takya-login-content, .takya-login-watermark, .takya-login-brand, .takya-login-tagline",
      { opacity: 0, scale: 0.96 },
      { duration: 0.16, ease: "easeIn" },
    );
    // La tarjeta sale del flujo en su mismo lugar y desde ahí viaja al centro.
    Object.assign(card.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      zIndex: "5",
    });
    // El candado aparece y se cierra mientras la tarjeta termina de asentarse:
    // no se espera el reposo del resorte.
    void animate(
      card,
      {
        width: LOCK_SIZE,
        height: LOCK_SIZE,
        borderRadius: 34,
        backgroundColor: "#1b3b2b",
        top: window.innerHeight / 2 - LOCK_SIZE / 2,
        left: window.innerWidth / 2 - LOCK_SIZE / 2,
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
    <main ref={scope} className={MAIN_CLASS[phase]} data-theme={theme}>
      <div className="takya-login-backdrop" aria-hidden="true">
        <Image
          key={theme}
          src={
            theme === "night"
              ? "/brand/login-guardian-noche.png"
              : "/brand/login-guardian-dia.png"
          }
          alt=""
          fill
          sizes="100vw"
          priority
        />
      </div>
      <button
        type="button"
        className="takya-login-theme"
        data-theme={theme}
        aria-pressed={theme === "night"}
        aria-label={
          theme === "night" ? "Cambiar a modo día" : "Cambiar a modo noche"
        }
        title={theme === "night" ? "Modo día" : "Modo noche"}
        onClick={toggleTheme}
      >
        <span key={theme} className="takya-login-theme-icon" aria-hidden="true">
          {theme === "night" ? <Moon size={22} /> : <Sun size={22} />}
        </span>
      </button>

      <BrandCorner />
      <div className="takya-login-layout">
        <section
          className="takya-login-card"
          aria-labelledby="takya-login-title"
        >
          <span className="takya-login-sweep" aria-hidden="true" />
          <div className="takya-login-watermark" aria-hidden="true">
            <Image
              src="/brand/01_maestros_svg/takya-a-simbolo-bosque.svg"
              alt=""
              width={194}
              height={210}
            />
          </div>

          <div
            className="takya-login-content"
            inert={
              phase === "locking" || phase === "locked" || phase === "instant"
            }
          >
            <div className="takya-login-intro">
              <p className="takya-login-eyebrow">
                Acceso privado <span>Demo</span>
              </p>
              <h1 id="takya-login-title">Bienvenido a TAKYA</h1>
              <p className="takya-login-lead">
                Tus cámaras vigilan. TAKYA te dice qué mirar, y tú decides.
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
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (phase !== "idle") return;
                  if (!password) {
                    setError("Escribe la contraseña para entrar.");
                    return;
                  }
                  setPhase("checking");
                  setError("");
                  try {
                    const response = await fetch("/api/access", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ username: ACCESS_USER, password }),
                    });
                    if (!response.ok) {
                      const body = (await response
                        .json()
                        .catch(() => null)) as {
                        message?: string;
                      } | null;
                      setError(
                        body?.message ?? "No se pudo validar el acceso.",
                      );
                      setPhase("idle");
                      return;
                    }
                  } catch {
                    setError("No se pudo conectar. Intenta de nuevo.");
                    setPhase("idle");
                    return;
                  }
                  setPassword("");
                  beginPractice(
                    profileSchema.parse({
                      name: OPERATOR_NAME,
                      role: "OPERATOR",
                    }),
                  );
                  void lockAndEnter();
                }}
              >
                <div className="takya-login-field">
                  <label htmlFor="takya-login-user">Usuario</label>
                  <input
                    id="takya-login-user"
                    type="text"
                    name="username"
                    value={ACCESS_USER}
                    readOnly
                    autoComplete="username"
                  />
                </div>
                <div className="takya-login-field">
                  <label htmlFor="takya-login-password">Contraseña</label>
                  <input
                    id="takya-login-password"
                    type="password"
                    name="password"
                    value={password}
                    maxLength={256}
                    autoComplete="current-password"
                    enterKeyHint="go"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={
                      error
                        ? "takya-login-error takya-login-demo-note"
                        : "takya-login-demo-note"
                    }
                    onChange={(event) => {
                      setPassword(event.target.value);
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
                  {phase === "checking" ? "Comprobando…" : "Iniciar sesión"}
                </button>
              </form>

              <p id="takya-login-demo-note" className="takya-login-note">
                <ShieldCheck size={18} aria-hidden="true" />
                Acceso privado del equipo TAKYA. La demo se presenta en persona
                o con una conexión autorizada.
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
      </div>

      <p className="takya-login-lock-caption" role="status">
        {PHASE_MESSAGE[phase]}
      </p>
    </main>
  );
}

/**
 * Marca del home del software: el logo en su cápsula de vidrio (como en la
 * landing, vuelve a /home) y el lema en grande en el espacio libre de la
 * imagen. El saludo y el acceso van juntos en la columna derecha.
 */
function BrandCorner() {
  return (
    <>
      <Link
        href="/home"
        className="takya-login-brand"
        aria-label="TAKYA, volver al inicio"
      >
        <Image
          src="/brand/01_maestros_svg/takya-a-principal-bosque.svg"
          alt=""
          width={148}
          height={36}
          priority
        />
      </Link>
      <p className="takya-login-tagline">
        Comprender
        <br />
        antes de
        <br />
        <span>actuar.</span>
      </p>
    </>
  );
}
