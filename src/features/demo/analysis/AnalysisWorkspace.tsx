"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { FileVideo, Focus } from "lucide-react";
import {
  ArrowLeft,
  Play,
  ShieldCheck,
  Upload,
  X,
  Download,
} from "@/components/icons";
import {
  api,
  exportSchema,
  incidentSchema,
  jobSchema,
  post,
  sourceSchema,
  terminal,
  type Source,
  type Job,
  type Incident,
  type Export,
} from "./contracts";
import { ZoneEditor, defaultZone } from "./ZoneEditor";
import type { Point } from "./zone";
import {
  candidatesFound,
  mebibytes,
  reviewStateLabels,
  seconds,
} from "./format";
import { ReviewCase } from "./ReviewCase";
import { hasPracticeAccess } from "../model/profile";
import "./analysis.css";

const sessionSchema = z.object({
  session_id: z.string(),
  expires_in_s: z.number(),
});
const stateSchema = sessionSchema.extend({
  sources: z.array(sourceSchema),
  jobs: z.array(jobSchema),
});
const stateLabels: Record<Job["state"], string> = {
  RECEIVING: "Recibiendo",
  VALIDATING: "Validando",
  READY: "Preparado",
  QUEUED: "En espera",
  ANALYZING: "Analizando tu archivo",
  COMPLETED: "Análisis completado",
  FAILED: "Análisis fallido",
  CANCELLED: "Análisis cancelado",
  EXPIRED: "Ejercicio caducado",
};

export function AnalysisWorkspace() {
  const [session, setSession] = useState<string | null>(null);
  const [ttl, setTtl] = useState(1800);
  const [source, setSource] = useState<Source | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [exported, setExported] = useState<Export | null>(null);
  const [level, setLevel] = useState<"E1" | "E2">("E2");
  const [ack, setAck] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [polygon, setPolygon] = useState<Point[] | null>(defaultZone);
  const [fps, setFps] = useState(2);
  const [dwell, setDwell] = useState(2500);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const keys = useRef(new Map<string, string>());
  const uploadAbort = useRef<AbortController | null>(null);
  const exportHeading = useRef<HTMLHeadingElement>(null);
  const incident = incidents.find((item) => item.id === selected) ?? null;
  const active = job !== null && !terminal(job);
  const exporting =
    exported !== null && ["PREPARING", "VERIFYING"].includes(exported.state);
  const validZone = polygon !== null;

  useEffect(() => {
    if (!hasPracticeAccess()) window.location.replace("/login");
    return () => uploadAbort.current?.abort();
  }, []);

  const run = useCallback((operation: () => Promise<void>) => {
    setBusy(true);
    setError("");
    void operation()
      .catch((e: unknown) =>
        setError(
          e instanceof Error ? e.message : "No se pudo completar la operación.",
        ),
      )
      .finally(() => setBusy(false));
  }, []);

  function key(payload: unknown) {
    const encoded = JSON.stringify(payload);
    let value = keys.current.get(encoded);
    if (!value) {
      value = crypto.randomUUID();
      keys.current.set(encoded, value);
    }
    return value;
  }

  useEffect(() => {
    if (!job || terminal(job)) return;
    const controller = new AbortController();
    const poll = async () => {
      try {
        const next = await api(`jobs/${job.id}`, jobSchema, {
          signal: controller.signal,
        });
        if (next.state === "COMPLETED" && next.result) {
          const items = await Promise.all(
            next.result.incident_ids.map((id) =>
              api(`incidents/${id}`, incidentSchema, {
                signal: controller.signal,
              }),
            ),
          );
          setIncidents(items);
          setSelected(items[0]?.id ?? null);
        }
        setJob(next);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(
            e instanceof Error
              ? e.message
              : "Se perdió la conexión con el análisis.",
          );
      }
    };
    const timer = setInterval(() => void poll(), 1500);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [job]);

  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    const timer = setInterval(() => {
      void api(`sessions/${session}`, stateSchema, {
        signal: controller.signal,
      })
        .then((s) => setTtl(s.expires_in_s))
        .catch((e: unknown) => {
          if (!controller.signal.aborted)
            setError(e instanceof Error ? e.message : "Sesión no disponible.");
        });
    }, 30000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [session]);

  useEffect(() => {
    if (!exported || !["PREPARING", "VERIFYING"].includes(exported.state))
      return;
    const controller = new AbortController();
    const timer = setInterval(() => {
      void api(`exports/${exported.export_id}`, exportSchema, {
        signal: controller.signal,
      })
        .then(setExported)
        .catch((e: unknown) => {
          if (!controller.signal.aborted)
            setError(
              e instanceof Error ? e.message : "Exportación no disponible.",
            );
        });
    }, 1000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [exported]);

  async function begin() {
    const s = await api("sessions", sessionSchema, { method: "POST" });
    setSession(s.session_id);
    const previous = await api(`sessions/${s.session_id}`, stateSchema);
    setTtl(previous.expires_in_s);
    const last = previous.sources.at(-1) ?? null;
    setSource(last);
    const recent =
      previous.jobs.filter((j) => j.source_id === last?.id).at(-1) ?? null;
    setJob(recent);
    if (recent?.result) {
      const items = await Promise.all(
        recent.result.incident_ids.map((id) =>
          api(`incidents/${id}`, incidentSchema),
        ),
      );
      setIncidents(items);
      setSelected(items[0]?.id ?? null);
    }
  }

  async function upload() {
    if (!file) return;
    if (file.size > 33554432 || file.size === 0)
      throw new Error("El archivo debe pesar entre 1 byte y 32 MiB.");
    const controller = new AbortController();
    uploadAbort.current = controller;
    try {
      const received = await api("uploads", sourceSchema, {
        method: "POST",
        body: file,
        signal: controller.signal,
        headers: {
          "Content-Type": "video/mp4",
          "X-Takya-Authorization-Ack": "true",
          "X-Takya-Filename": encodeURIComponent(file.name),
        },
      });
      setSource(received);
      setPolygon(defaultZone());
      setJob(null);
      setIncidents([]);
      setExported(null);
    } finally {
      uploadAbort.current = null;
    }
  }

  async function analyze() {
    if (!source || !polygon) return;
    const config = {
      source_id: source.id,
      polygon,
      fixed_camera_declared: fixed,
      rule: {
        type: "dwell_in_zone",
        reference_point: "bottom_center",
        dwell_ms: dwell,
        rule_version: "zone-rule-v1",
      },
      sample_fps: fps,
      min_detector_score: 0.45,
      zone_version: 1,
    };
    setIncidents([]);
    setExported(null);
    setJob(await api("jobs", jobSchema, post(config, key(config))));
  }

  async function prepareExport() {
    if (!source) return;
    const target = incident
      ? `incidents/${incident.id}`
      : `sources/${source.id}`;
    const data = { level, expected_revision: incident?.revision ?? 1 };
    setExported(
      await api(
        `${target}/export`,
        exportSchema,
        post(data, key({ target, ...data })),
      ),
    );
  }

  return (
    <div className="analysis-workspace">
      <a className="analysis-skip" href="#analysis-main">
        Ir al contenido
      </a>
      <header className="analysis-header">
        <Link href="/demo" className="analysis-back">
          <ArrowLeft aria-hidden="true" /> Práctica preparada
        </Link>
        <Link href="/home" className="analysis-brand">
          TAKYA<span>Comprender antes de actuar</span>
        </Link>
        <span className="analysis-badge">ANÁLISIS LOCAL</span>
      </header>
      <main id="analysis-main" className="analysis-main">
        <div className="analysis-intro">
          <div>
            <span className="analysis-eyebrow">
              UN ARCHIVO · UNA ZONA · TU CRITERIO
            </span>
            <h1>Del registro a una decisión.</h1>
            <p>
              Busca candidatos en un video autorizado. Revisa el contexto y
              conserva una copia verificable.
            </p>
          </div>
          <ShieldCheck size={52} aria-hidden="true" />
        </div>
        <ol className="analysis-steps" aria-label="Recorrido">
          <li>Cargar</li>
          <li>Delimitar</li>
          <li>Analizar</li>
          <li>Revisar</li>
          <li>Conservar</li>
        </ol>
        {error ? (
          <div role="alert" className="analysis-error">
            <strong>No se completó la operación</strong>
            <p>{error}</p>
            <button onClick={() => setError("")}>Cerrar aviso</button>
          </div>
        ) : null}
        {!session ? (
          <section className="analysis-card">
            <h2>Prepara un ejercicio temporal</h2>
            <p>
              MP4/H.264, hasta 60 segundos, 1280 × 720 y 32 MiB. Solo cámara
              fija. Procesamiento en este equipo.
            </p>
            <p>
              Los archivos se eliminan tras 30 minutos sin actividad, al cerrar
              o al reiniciar el servicio. Máximo dos horas por sesión. Guarda tu
              paquete y su recuperación antes de salir.
            </p>
            <p>
              La sesión separa ejercicios; no acredita identidad laboral. Los
              candidatos no confirman delitos.
            </p>
            <button
              className="analysis-primary"
              disabled={busy}
              onClick={() => run(begin)}
            >
              <Play aria-hidden="true" />{" "}
              {busy ? "Conectando…" : "Abrir o recuperar ejercicio"}
            </button>
          </section>
        ) : (
          <>
            <div className="analysis-session">
              <span>
                {ttl <= 300 ? "Atención: " : ""}Caducidad por inactividad:{" "}
                {Math.ceil(ttl / 60)} min. Máximo 2 h.
              </span>
              <button
                disabled={busy || active || exporting}
                onClick={() => setConfirmClose(true)}
              >
                Cerrar ejercicio
              </button>
            </div>
            {!source ? (
              <section className="analysis-card">
                <div className="analysis-section-heading">
                  <FileVideo aria-hidden="true" />
                  <h2>1. Cargar una fuente</h2>
                </div>
                <label className="analysis-file">
                  Video MP4
                  <input
                    type="file"
                    accept="video/mp4,.mp4"
                    disabled={busy}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <label className="analysis-check">
                  <input
                    type="checkbox"
                    checked={ack}
                    onChange={(e) => setAck(e.target.checked)}
                  />
                  Tengo autorización para usar este archivo y acepto los límites
                  y la pérdida de datos de este ejercicio temporal.
                </label>
                <button
                  className="analysis-primary"
                  disabled={busy || !file || !ack}
                  onClick={() => run(upload)}
                >
                  <Upload aria-hidden="true" />
                  {busy ? "Recibiendo y validando…" : "Cargar archivo"}
                </button>
                {busy ? (
                  <button onClick={() => uploadAbort.current?.abort()}>
                    <X aria-hidden="true" /> Cancelar carga
                  </button>
                ) : null}
              </section>
            ) : (
              <>
                <section className="analysis-card">
                  <div className="analysis-section-heading">
                    <Focus aria-hidden="true" />
                    <div>
                      <span className="analysis-eyebrow">
                        FUENTE PRESERVADA
                      </span>
                      <h2>{source.display_name}</h2>
                    </div>
                  </div>
                  <p>
                    {seconds(source.duration_ms)} s · {source.width} ×{" "}
                    {source.height} · {mebibytes(source.size_bytes)} MiB · Fecha
                    de captura desconocida
                  </p>
                  <details>
                    <summary>Integridad de los bytes recibidos</summary>
                    <code className="analysis-hash">
                      SHA-256: {source.sha256}
                    </code>
                    <p>
                      El hash permite comparar bytes desde su recepción. No
                      acredita autenticidad previa.
                    </p>
                  </details>
                  {!job || (terminal(job) && job.state !== "COMPLETED") ? (
                    <>
                      <h3>2. Delimitar una zona</h3>
                      <ZoneEditor
                        key={source.id}
                        source={source}
                        onChange={setPolygon}
                      />
                      <div className="analysis-fields">
                        <label>
                          Muestreo
                          <select
                            value={fps}
                            onChange={(e) => setFps(Number(e.target.value))}
                          >
                            <option value={1}>1 fotograma/s</option>
                            <option value={2}>2 fotogramas/s</option>
                          </select>
                        </label>
                        <label>
                          Permanencia mínima
                          <select
                            value={dwell}
                            onChange={(e) => setDwell(Number(e.target.value))}
                          >
                            <option value={2000}>2 segundos</option>
                            <option value={2500}>2,5 segundos</option>
                          </select>
                        </label>
                      </div>
                      <label className="analysis-check">
                        <input
                          type="checkbox"
                          checked={fixed}
                          onChange={(e) => setFixed(e.target.checked)}
                        />
                        Confirmo que la cámara permanece fija durante este
                        registro.
                      </label>
                      <p className="analysis-muted">
                        YOLOX-Nano CPU · umbral 0,45. El muestreo puede omitir
                        acciones breves. Su precisión en CCTV todavía requiere
                        evaluación.
                      </p>
                      <button
                        className="analysis-primary"
                        disabled={busy || !fixed || !validZone || exporting}
                        onClick={() => run(analyze)}
                      >
                        <Play aria-hidden="true" /> Analizar esta zona
                      </button>
                    </>
                  ) : null}
                </section>
                {job ? (
                  <section
                    className="analysis-card"
                    aria-label="Estado de análisis"
                  >
                    <h2>{stateLabels[job.state]}</h2>
                    <p role="status">
                      {active
                        ? `Etapa: ${job.progress.stage === "queue" ? "cola" : "detección"}. Tiempo de procesamiento informado: ${seconds(job.progress.elapsed_ms)} s.`
                        : (job.error?.message ??
                          (job.result
                            ? `${candidatesFound(job.result.candidate_count)}. Revisa el registro aunque no aparezcan candidatos.`
                            : "No se obtuvo un resultado de análisis."))}
                    </p>
                    {active ? (
                      <button
                        disabled={busy}
                        onClick={() =>
                          run(async () => {
                            setJob(
                              await api(`jobs/${job.id}/cancel`, jobSchema, {
                                method: "POST",
                              }),
                            );
                          })
                        }
                      >
                        <X aria-hidden="true" /> Cancelar análisis
                      </button>
                    ) : null}
                    {incidents.length > 0 ? (
                      <label>
                        Candidato
                        <select
                          value={selected ?? ""}
                          onChange={(e) => {
                            setSelected(e.target.value);
                            setExported(null);
                          }}
                        >
                          {incidents.map((item, index) => (
                            <option key={item.id} value={item.id}>
                              Candidato {index + 1} ·{" "}
                              {reviewStateLabels[item.review_state] ??
                                item.review_state}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </section>
                ) : null}
                {incident ? (
                  <ReviewCase
                    key={incident.id}
                    incident={incident}
                    update={(next) =>
                      setIncidents((old) =>
                        old.map((item) => (item.id === next.id ? next : item)),
                      )
                    }
                    run={run}
                    busy={busy}
                    onExport={() => {
                      exportHeading.current?.scrollIntoView({
                        behavior: "auto",
                      });
                      exportHeading.current?.focus();
                    }}
                  />
                ) : null}
                {!active ? (
                  <section className="analysis-card">
                    <div className="analysis-section-heading">
                      <ShieldCheck aria-hidden="true" />
                      <h2 ref={exportHeading} tabIndex={-1}>
                        Conservar evidencia
                      </h2>
                    </div>
                    <p>
                      {incident &&
                      ["VERIFIED", "DISMISSED", "ESCALATED"].includes(
                        incident.review_state,
                      )
                        ? "Incluye la decisión humana de esta revisión."
                        : "Se rotulará como fuente recibida sin decisión humana. No se inventará una revisión."}
                    </p>
                    <label>
                      Protección
                      <select
                        value={level}
                        onChange={(e) => {
                          setLevel(e.target.value as "E1" | "E2");
                          setExported(null);
                        }}
                        disabled={exporting}
                      >
                        <option value="E2">E2 · Firma y cifrado local</option>
                        <option value="E1">
                          E1 · Firma e integridad, contenido visible
                        </option>
                      </select>
                    </label>
                    <p>
                      La clave de recuperación se conserva mediante la utilidad
                      local del equipo. Guárdala por un canal separado antes de
                      cerrar. Si se pierde, E2 puede quedar irrecuperable.
                    </p>
                    <button
                      disabled={busy || exporting}
                      className="analysis-primary"
                      onClick={() => run(prepareExport)}
                    >
                      <ShieldCheck aria-hidden="true" />{" "}
                      {exporting
                        ? "Preparando y verificando…"
                        : "Preparar paquete"}
                    </button>
                    {exported ? (
                      <div role="status">
                        <p>
                          Estado:{" "}
                          {
                            {
                              PREPARING: "Preparando",
                              VERIFYING: "Verificando",
                              READY: "Verificado y listo",
                              DOWNLOADED: "Descarga registrada",
                              FAILED: "Falló la exportación",
                            }[exported.state]
                          }
                        </p>
                        {["READY", "DOWNLOADED"].includes(exported.state) ? (
                          <>
                            <a
                              className="analysis-download"
                              href={`/api/analysis/exports/${exported.export_id}?download=1`}
                              download
                            >
                              <Download aria-hidden="true" /> Descargar{" "}
                              {exported.level}
                            </a>
                            <p>
                              Identificador para conservar la recuperación:{" "}
                              <code>{exported.export_id}</code>
                            </p>
                            <details>
                              <summary>
                                Referencia pública y verificación independiente
                              </summary>
                              <code className="analysis-hash">
                                {exported.fingerprint_public_key}
                              </code>
                              <p>
                                Contrasta esta huella con la referencia pública
                                obtenida por la utilidad local. Verifica los
                                bytes descargados antes de confiar en la copia.
                              </p>
                            </details>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                    <p className="analysis-muted">
                      Descargar no acredita recepción institucional ni elimina
                      el ejercicio. El cifrado del paquete no cifra temporales
                      ni el disco del equipo.
                    </p>
                  </section>
                ) : null}
              </>
            )}
            {confirmClose ? (
              <section
                className="analysis-card analysis-confirm"
                role="alertdialog"
                aria-modal="false"
                aria-labelledby="close-heading"
              >
                <h2 id="close-heading">¿Cerrar y eliminar los temporales?</h2>
                <p>
                  La sesión y los archivos de trabajo se perderán. Conserva
                  primero la descarga y, si corresponde, su clave separada.
                </p>
                <button
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      await api(`sessions/${session}/close`, z.object({}), {
                        method: "POST",
                      });
                      setSession(null);
                      setSource(null);
                      setJob(null);
                      setIncidents([]);
                      setExported(null);
                      setConfirmClose(false);
                    })
                  }
                >
                  Sí, cerrar ejercicio
                </button>
                <button onClick={() => setConfirmClose(false)}>
                  Seguir revisando
                </button>
              </section>
            ) : null}
          </>
        )}
      </main>
      <footer className="analysis-footer">
        TAKYA · Candidatos para revisión humana · Sin despacho real
      </footer>
    </div>
  );
}
