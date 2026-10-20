"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Download,
  FileCheck,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  downloadKey,
  downloadPackage,
  sealEvidence,
  tamperEvidence,
  verifyEvidence,
  type SealInput,
  type SealResult,
  type SealStep,
  type VerifyResult,
} from "../model/evidenceSeal";
import "./evidence-protection.css";

const STEPS: {
  id: Exclude<SealStep, "listo">;
  label: string;
  detail: string;
}[] = [
  {
    id: "huella",
    label: "Huella del video",
    detail: "Un código único que cambia si se altera un solo dato.",
  },
  {
    id: "firma",
    label: "Firma de TAKYA",
    detail: "Une la huella con el caso, la decisión y quién decidió.",
  },
  {
    id: "cifrado",
    label: "Cifrado",
    detail: "Solo quien tenga la clave puede abrir el video.",
  },
];

export type ProtectedEvidence = {
  fingerprint: string;
  signature: SealResult["pkg"]["firma"]["algoritmo"];
  bytes: number;
  clips: number;
};

/**
 * Paso «Proteger»: sella la evidencia de verdad en el navegador (huella,
 * firma y cifrado), la verifica, demuestra que detecta una alteración y
 * permite descargar el paquete y su clave por separado.
 */
export function EvidenceProtection({
  input,
  onProtected,
}: {
  input: SealInput;
  onProtected?: (evidence: ProtectedEvidence) => void;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<SealStep | null>(null);
  const [result, setResult] = useState<SealResult | null>(null);
  const [error, setError] = useState("");
  const [check, setCheck] = useState<{
    kind: "original" | "alterado";
    verdict: VerifyResult;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const running = step !== null && step !== "listo" && !result;

  async function protect() {
    setError("");
    setCheck(null);
    try {
      const sealed = await sealEvidence(input, setStep);
      setResult(sealed);
      onProtected?.({
        fingerprint: sealed.fingerprint,
        signature: sealed.pkg.firma.algoritmo,
        bytes: sealed.bytes,
        clips: sealed.pkg.manifiesto.clips.length,
      });
    } catch (problem) {
      setStep(null);
      setError(
        problem instanceof Error
          ? problem.message
          : "No se pudo proteger la evidencia.",
      );
    }
  }

  async function verify(kind: "original" | "alterado") {
    if (!result) return;
    setChecking(true);
    const pkg = kind === "original" ? result.pkg : tamperEvidence(result.pkg);
    const verdict = await verifyEvidence(pkg, result.key);
    setCheck({ kind, verdict });
    setChecking(false);
  }

  const doneIndex = result
    ? STEPS.length
    : step
      ? STEPS.findIndex((item) => item.id === step)
      : -1;

  return (
    <section className="evidence-protect" aria-labelledby="evidence-title">
      <div className="evidence-head">
        <motion.span
          className={`evidence-lock ${result ? "is-locked" : ""}`}
          aria-hidden="true"
          animate={result && !reduce ? { scale: [1, 0.9, 1.06, 1] } : undefined}
          transition={{ duration: 0.6 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <motion.path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ y: result ? 0 : -4 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            />
            <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
            <circle cx="12" cy="16.5" r="1.4" fill="currentColor" />
          </svg>
        </motion.span>
        <div>
          <p className="demo-eyebrow">Proteger la evidencia</p>
          <h2 id="evidence-title">
            {result ? "Evidencia protegida." : "Sella la evidencia del caso."}
          </h2>
          <p>
            {result
              ? "Nadie puede cambiarla sin que se note. Lista para entregar."
              : "TAKYA guarda el original intacto y lo sella para entregarlo."}
          </p>
        </div>
      </div>

      <ol className="evidence-steps">
        {STEPS.map((item, index) => {
          const state =
            index < doneIndex
              ? "done"
              : index === doneIndex
                ? "current"
                : "wait";
          return (
            <li key={item.id} data-state={running || result ? state : "wait"}>
              <span className="evidence-step-icon" aria-hidden="true">
                {index < doneIndex ? <Check /> : index + 1}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
            </li>
          );
        })}
      </ol>

      {error ? (
        <p className="evidence-error" role="alert">
          {error}
        </p>
      ) : null}

      {!result ? (
        <button
          type="button"
          className="demo-button demo-button-primary evidence-main"
          onClick={() => void protect()}
          disabled={running}
          aria-busy={running || undefined}
        >
          <Lock aria-hidden="true" />
          {running ? "Protegiendo…" : "Proteger evidencia"}
        </button>
      ) : (
        <>
          <dl className="evidence-facts">
            <div>
              <dt>Huella</dt>
              <dd title={result.fingerprint}>
                {result.fingerprint.slice(0, 16)}…
              </dd>
            </div>
            <div>
              <dt>Firma</dt>
              <dd>{result.pkg.firma.algoritmo}</dd>
            </div>
            <div>
              <dt>Cifrado</dt>
              <dd>AES-256-GCM</dd>
            </div>
            <div>
              <dt>Contenido</dt>
              <dd>
                {result.pkg.manifiesto.clips.length}{" "}
                {result.pkg.manifiesto.clips.length === 1 ? "video" : "videos"}{" "}
                · {(result.bytes / 1_048_576).toFixed(1)} MB
              </dd>
            </div>
          </dl>

          <div className="evidence-actions">
            <button
              type="button"
              className="demo-button demo-button-primary"
              onClick={() => void verify("original")}
              disabled={checking}
            >
              <ShieldCheck aria-hidden="true" /> Verificar integridad
            </button>
            <button
              type="button"
              className="demo-button demo-button-secondary"
              onClick={() => void verify("alterado")}
              disabled={checking}
            >
              <Wrench aria-hidden="true" /> Probar una alteración
            </button>
          </div>

          {check ? (
            <div
              className={`evidence-verdict ${check.verdict.ok ? "is-ok" : "is-bad"}`}
              role="status"
            >
              <span className="evidence-verdict-icon" aria-hidden="true">
                {check.verdict.ok ? <ShieldCheck /> : <ShieldAlert />}
              </span>
              <div>
                <strong>
                  {check.verdict.ok
                    ? "Íntegra: nadie la modificó."
                    : "Alterada: TAKYA detectó el cambio."}
                </strong>
                <small>
                  {check.kind === "alterado"
                    ? "Se cambió un solo byte del video para la prueba."
                    : "Se comprobó la firma, el contenido y cada huella."}
                </small>
                <ul>
                  {check.verdict.checks.map((item) => (
                    <li key={item.label} data-ok={item.ok}>
                      {item.ok ? "✓" : "✗"} {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="evidence-delivery">
            <p>
              <FileCheck aria-hidden="true" />
              <span>
                <strong>¿Qué se hace con la evidencia?</strong> Se entrega a
                Carabineros, PDI o Fiscalía. Quien la recibe comprueba con el
                verificador que nadie la modificó.
              </span>
            </p>
            <div className="evidence-actions">
              <button
                type="button"
                className="demo-button demo-button-secondary"
                onClick={() => downloadPackage(result)}
              >
                <Download aria-hidden="true" /> Descargar paquete
              </button>
              <button
                type="button"
                className="demo-button demo-button-secondary"
                onClick={() => downloadKey(result)}
              >
                <KeyRound aria-hidden="true" /> Descargar clave
              </button>
            </div>
            <small>La clave se entrega por un canal distinto al paquete.</small>
          </div>
        </>
      )}
    </section>
  );
}
