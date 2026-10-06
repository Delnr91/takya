"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Camera,
  ChevronDown,
  House,
  History,
  Bot,
  Eye,
  EyeOff,
  LogOut,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { useDemoSession } from "../hooks/useDemoSession";
import { useDemoNavigation, type DemoView } from "../hooks/useDemoNavigation";
import { useSimulationTicker } from "../hooks/useSimulationTicker";
import { scenarioOrder } from "../data/scenarios";
import { getMetrics, MAX_INCIDENTS } from "../model/simulation";
import type { Profile, Role } from "../schemas/simulation";
import { nextIncident, selectedIncident } from "../model/selectors";
import { endPractice } from "../model/profile";
import { downloadPracticeHistory } from "../model/exportPractice";
import { TurnOverview, PracticeGuide } from "./TurnOverview";
import { CaseList } from "./CaseList";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { CameraGallery } from "./CameraGallery";
import { AuditHistory } from "./AuditHistory";
import { SettingsPanel } from "./SettingsPanel";
import { Dialog } from "./DemoPrimitives";
import { K8Mascot } from "./K8Mascot";
import { CognitiveGuide } from "./CognitiveGuide";
import { QuickCompanion } from "./QuickCompanion";
import { CojeevDepthBackground } from "@/components/ui/CojeevDepthBackground";
import "./demo.css";
import "./incident-media.css";

const navigation = [
  { id: "turn", label: "Inicio", icon: House },
  { id: "cases", label: "Casos", icon: TriangleAlert },
  { id: "cameras", label: "Cámaras", icon: Camera },
  { id: "history", label: "Historial", icon: History },
  { id: "guide", label: "Guía", icon: BookOpen },
  { id: "ai", label: "K8 IA", icon: Bot },
  { id: "settings", label: "Ajustes", icon: Settings2 },
] satisfies { id: DemoView; label: string; icon: typeof House }[];

function profileForRole(profile: Profile, role: Role): Profile {
  const formerDefault =
    profile.role === "OPERATOR" ? "Operador 03" : "Supervisión 01";
  const nextDefault = role === "OPERATOR" ? "Operador 03" : "Supervisión 01";
  return {
    role,
    name: profile.name === formerDefault ? nextDefault : profile.name,
  };
}

export function DemoShell() {
  const {
    simulation: state,
    send,
    restart,
    message,
    error,
    storageUnavailable,
  } = useDemoSession();
  const nav = useDemoNavigation();
  const [arrivals, setArrivals] = useState(false);
  const [interval, setIntervalSeconds] = useState(30);
  const [resetOpen, setResetOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const previousView = useRef(nav.view);
  const addIncident = useCallback(
    () =>
      send({
        type: "ADD_INCIDENT",
        scenario:
          scenarioOrder[Math.floor(Math.random() * scenarioOrder.length)] ??
          "smoke",
      }),
    [send],
  );
  const atCapacity = (state?.incidents.length ?? 0) >= MAX_INCIDENTS;
  useSimulationTicker(
    Boolean(state) && arrivals && !atCapacity && !resetOpen && !logoutOpen,
    interval,
    addIncident,
  );
  useEffect(() => {
    if (previousView.current !== nav.view)
      mainRef.current?.focus({ preventScroll: true });
    previousView.current = nav.view;
  }, [nav.view]);
  if (!state) return <DemoLoading />;
  const metrics = getMetrics(state);
  const selected = selectedIncident(
    state.incidents,
    nav.caseId,
    state.selectedId,
  );
  const openCase = (id: string, cameraId?: string) => {
    send({ type: "OPEN", incidentId: id });
    nav.update(
      {
        view: "review",
        case: id,
        camera: cameraId ?? "",
        inspect: cameraId ? "1" : "",
      },
      true,
    );
  };
  const openEvidence = (id: string, cameraId?: string) => {
    send({ type: "OPEN", incidentId: id });
    nav.update(
      { view: "review", case: id, camera: cameraId ?? "", inspect: "1" },
      true,
    );
  };
  const selectCase = (id: string) => {
    send({ type: "SELECT", incidentId: id });
    nav.update({ case: id, camera: "", inspect: "" });
  };
  const continuePractice = () => {
    const next = nextIncident(state.incidents);
    if (next && state.profile.role === "OPERATOR") openCase(next.id);
    else nav.navigate("turn");
  };
  return (
    <div
      className={`demo-shell ${state.preferences.largeText ? "demo-large" : ""} ${state.preferences.solid ? "demo-solid" : ""} ${state.preferences.highContrast ? "demo-high-contrast" : ""} ${state.preferences.motionOff ? "demo-motion-off" : ""} ${state.preferences.backgroundOff ? "demo-background-off" : ""}`}
    >
      <div className="demo-backdrop" aria-hidden="true">
        <Image src="/background2.png" alt="" fill sizes="100vw" />
        <div className="demo-backdrop-wash" />
        {!state.preferences.backgroundOff ? (
          <CojeevDepthBackground
            seed="takya-console"
            density={0.7}
            intensity={0.28}
            motionOff={state.preferences.motionOff}
          />
        ) : null}
      </div>
      <a className="demo-skip" href="#demo-main">
        Ir al contenido
      </a>
      <div className="demo-app">
        <header className="demo-header demo-panel">
          <Link href="/home" aria-label="TAKYA, volver al inicio">
            <Image
              src="/brand/principal-bosque.svg"
              alt="TAKYA"
              width={180}
              height={44}
              className="demo-logo"
              priority
            />
          </Link>
          <span className="demo-header-divider" />
          <div className="demo-header-title">
            <strong>Centro de operación</strong>
            <span>Comprender antes de actuar</span>
          </div>
          <span className="demo-practice-label">
            <ShieldCheck size={15} aria-hidden="true" />
            Modo práctica
          </span>
          <div className="demo-header-tools">
            <button
              type="button"
              className="demo-tool demo-mascot-toggle"
              aria-label={
                state.preferences.mascotHidden ? "Mostrar K8" : "Ocultar K8"
              }
              aria-pressed={!state.preferences.mascotHidden}
              onClick={() =>
                send({ type: "PREFERENCE", preference: "mascotHidden" })
              }
            >
              {state.preferences.mascotHidden ? (
                <Eye aria-hidden="true" />
              ) : (
                <EyeOff aria-hidden="true" />
              )}
              <span>
                {state.preferences.mascotHidden ? "Mostrar K8" : "Ocultar K8"}
              </span>
            </button>
            <button
              type="button"
              className="demo-tool"
              aria-current={nav.view === "settings" ? "page" : undefined}
              onClick={() => nav.navigate("settings")}
            >
              <Settings2 aria-hidden="true" />
              <span>Ajustes</span>
            </button>
            <button
              type="button"
              className="demo-tool"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut aria-hidden="true" />
              <span>Cerrar sesión</span>
            </button>
          </div>
          <label className="demo-profile">
            <UserRound aria-hidden="true" />
            <span>
              <small>Rol de práctica</small>
              <select
                aria-label="Rol de práctica"
                value={state.profile.role}
                onChange={(event) =>
                  send({
                    type: "PROFILE",
                    profile: profileForRole(
                      state.profile,
                      event.target.value === "SUPERVISOR"
                        ? "SUPERVISOR"
                        : "OPERATOR",
                    ),
                  })
                }
              >
                <option value="OPERATOR">Operador</option>
                <option value="SUPERVISOR">Supervisión</option>
              </select>
            </span>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
        </header>
        <div className="demo-body">
          <nav
            className="demo-nav demo-panel"
            aria-label="Secciones de la consola"
          >
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                data-view={id}
                onClick={() => nav.navigate(id)}
                aria-current={
                  nav.view === id || (id === "cases" && nav.view === "review")
                    ? "page"
                    : undefined
                }
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {id === "cases" && metrics.pending > 0 ? (
                  <small>{metrics.pending}</small>
                ) : null}
              </button>
            ))}
            <span className="demo-nav-mark" aria-hidden="true">
              T/
            </span>
          </nav>
          <main
            ref={mainRef}
            tabIndex={-1}
            id="demo-main"
            className="demo-main"
          >
            <div className="demo-simulation-toolbar">
              <span>
                <span
                  className={
                    arrivals && !atCapacity ? "demo-dot is-active" : "demo-dot"
                  }
                />
                {arrivals && !atCapacity
                  ? "Llegadas automáticas"
                  : "Llegadas en pausa"}
              </span>
              <div>
                <label className="demo-rate">
                  Ritmo
                  <select
                    aria-label="Ritmo de nuevos casos"
                    value={interval}
                    onChange={(event) =>
                      setIntervalSeconds(Number(event.target.value))
                    }
                  >
                    <option value={15}>Cada 15 s</option>
                    <option value={30}>Cada 30 s</option>
                    <option value={60}>Cada 60 s</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="demo-tool"
                  disabled={atCapacity}
                  onClick={() => setArrivals(!arrivals)}
                >
                  {arrivals && !atCapacity ? (
                    <Pause aria-hidden="true" />
                  ) : (
                    <Play aria-hidden="true" />
                  )}
                  <span>
                    {arrivals && !atCapacity
                      ? "Pausar llegadas"
                      : "Activar llegadas"}
                  </span>
                </button>
                <button
                  type="button"
                  className="demo-tool"
                  disabled={atCapacity}
                  onClick={addIncident}
                >
                  <Plus aria-hidden="true" />
                  <span>Nuevo caso</span>
                </button>
                <button
                  type="button"
                  className="demo-tool"
                  onClick={() => setResetOpen(true)}
                >
                  <RotateCcw aria-hidden="true" />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
            <p
              className={`demo-live-message ${error ? "demo-error" : ""}`}
              role={error ? "alert" : "status"}
              aria-live={error ? "assertive" : "polite"}
            >
              {message ||
                "Tú decides. Ninguna acción de esta práctica se envía a terreno."}
            </p>
            {storageUnavailable ? (
              <div className="demo-notice">
                Este navegador no permite guardar la práctica. Puedes continuar,
                pero el progreso se perderá al recargar.
              </div>
            ) : null}
            {atCapacity ? (
              <div className="demo-notice">
                Llegaste a 30 casos. Las llegadas se han detenido; puedes
                terminar las revisiones o reiniciar.
              </div>
            ) : null}
            {!state.incidents.some((incident) =>
              incident.cameras.some((camera) => camera.clipId),
            ) ? (
              <div className="demo-notice incident-upgrade-notice">
                <span>
                  Hay nuevos casos con video. Puedes conservar este historial o
                  comenzar una nueva práctica.
                </span>
                <button
                  type="button"
                  className="demo-button demo-button-secondary"
                  onClick={() => setResetOpen(true)}
                >
                  Cargar casos en video
                </button>
              </div>
            ) : null}
            {nav.view === "turn" || (nav.view === "review" && !selected) ? (
              <TurnOverview
                state={state}
                onOpen={openCase}
                navigate={nav.navigate}
                onSources={(id) => {
                  if (id) send({ type: "SELECT", incidentId: id });
                  nav.update(
                    {
                      view: "cameras",
                      case: id ?? selected?.id ?? "",
                      camera: "",
                      inspect: "",
                    },
                    true,
                  );
                }}
              />
            ) : null}
            {nav.view === "cases" ? (
              <CaseList
                motionOff={state.preferences.motionOff}
                incidents={state.incidents}
                severity={nav.severity}
                status={nav.status}
                query={nav.query}
                onFilter={nav.update}
                onOpen={openCase}
              />
            ) : null}
            {nav.view === "review" && selected ? (
              <ReviewWorkspace
                key={`${selected.id}-${state.profile.role}-${nav.cameraId ?? ""}-${nav.inspect}`}
                incident={selected}
                initialCameraId={nav.cameraId ?? undefined}
                inspect={nav.inspect}
                motionOff={state.preferences.motionOff}
                profile={state.profile}
                send={send}
                onBack={() => nav.navigate("cases")}
                onHistory={() => nav.navigate("history")}
                onNext={continuePractice}
              />
            ) : null}
            {nav.view === "cameras" && selected ? (
              <CameraGallery
                incident={selected}
                incidents={state.incidents}
                onSelect={selectCase}
                onOpen={openEvidence}
              />
            ) : null}
            {nav.view === "history" ? (
              <AuditHistory
                state={state}
                incidentId={selected?.id}
                onSelect={selectCase}
                onOpen={openEvidence}
              />
            ) : null}
            {nav.view === "guide" ? (
              <PracticeGuide
                completed={metrics.practiceCompleted}
                onStart={continuePractice}
              />
            ) : null}
            {nav.view === "ai" ? (
              <CognitiveGuide
                motionOff={state.preferences.motionOff}
                onGuide={() => nav.navigate("guide")}
              />
            ) : null}
            {nav.view === "settings" ? (
              <SettingsPanel
                key={state.profile.role}
                state={state}
                arrivals={arrivals}
                intervalSeconds={interval}
                onArrivalsChange={setArrivals}
                onIntervalChange={setIntervalSeconds}
                onPreferenceChange={(preference) =>
                  send({ type: "PREFERENCE", preference })
                }
                onProfileChange={(profile) =>
                  send({ type: "PROFILE", profile })
                }
                onReset={() => setResetOpen(true)}
                onLogout={() => setLogoutOpen(true)}
              />
            ) : null}
          </main>
        </div>
        <footer className="demo-footer">
          <span>
            <ShieldCheck size={15} aria-hidden="true" />
            Demo con evidencia grabada · las decisiones se registran aquí; no se
            despachan recursos.
          </span>
          <span>
            {state.profile.name} ·{" "}
            {storageUnavailable ? "Sin guardado" : "Guardado en este navegador"}
          </span>
        </footer>
      </div>
      {!state.preferences.mascotHidden ? (
        <K8Mascot
          onOpen={() => setAiOpen(true)}
          motionOff={
            state.preferences.motionOff || aiOpen || resetOpen || logoutOpen
          }
        />
      ) : null}
      {aiOpen ? (
        <Dialog
          title="K8 · Tu acompañante"
          className="k8-quick-dialog"
          onClose={() => setAiOpen(false)}
        >
          <QuickCompanion
            supervisor={state.profile.role === "SUPERVISOR"}
            hasNextCase={Boolean(nextIncident(state.incidents))}
            hasPendingReferral={state.incidents.some(
              (item) => item.status === "ESCALATED" && item.receivedAt === null,
            )}
            contextLabel={
              nav.view === "review"
                ? "Revisión de un caso"
                : (navigation.find((item) => item.id === nav.view)?.label ??
                  "Inicio")
            }
            motionOff={state.preferences.motionOff}
          />
        </Dialog>
      ) : null}
      {resetOpen ? (
        <Dialog
          title="¿Empezar una nueva práctica?"
          onClose={() => setResetOpen(false)}
        >
          <p>
            Se borrarán los casos, el progreso y el historial de esta práctica
            guardada en tu navegador. Puedes descargar el registro desde
            Historial antes de continuar.
          </p>
          <div className="demo-action-row">
            <button
              type="button"
              className="demo-button demo-button-secondary"
              autoFocus
              onClick={() => setResetOpen(false)}
            >
              Conservar mi práctica
            </button>
            <button
              type="button"
              className="demo-button demo-button-primary"
              onClick={() => {
                setArrivals(false);
                restart();
                setResetOpen(false);
                nav.navigate("turn");
              }}
            >
              <RotateCcw aria-hidden="true" />
              Empezar de nuevo
            </button>
          </div>
        </Dialog>
      ) : null}
      {logoutOpen ? (
        <Dialog
          title="¿Cerrar la sesión de práctica?"
          onClose={() => setLogoutOpen(false)}
        >
          <p>
            Se borrarán los casos y el historial guardados en este navegador.
            Puedes descargar el registro antes de salir.
          </p>
          <div className="demo-action-row demo-logout-actions">
            <button
              type="button"
              className="demo-button demo-button-secondary"
              onClick={() => downloadPracticeHistory(state)}
            >
              Descargar historial
            </button>
            <button
              type="button"
              className="demo-button demo-button-secondary"
              autoFocus
              onClick={() => setLogoutOpen(false)}
            >
              Seguir en la práctica
            </button>
            <button
              type="button"
              className="demo-button demo-button-exit"
              onClick={() => {
                setArrivals(false);
                endPractice();
                window.location.replace("/login");
              }}
            >
              <LogOut aria-hidden="true" /> Cerrar y borrar
            </button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export function DemoLoading() {
  return (
    <div className="demo-shell demo-loading" role="status">
      <ShieldCheck aria-hidden="true" />
      <p>Preparando tu práctica…</p>
    </div>
  );
}
