import { useState, type FormEvent } from "react";
import {
  Activity,
  BrainCircuit,
  Download,
  LogOut,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Type,
  UserRound,
} from "lucide-react";
import {
  profileSchema,
  type Profile,
  type Simulation,
} from "../schemas/simulation";
import { MAX_INCIDENTS } from "../model/simulation";
import { downloadPracticeHistory } from "../model/exportPractice";
import { Pictogram } from "./DemoPrimitives";

type SettingsPanelProps = {
  state: Simulation;
  arrivals: boolean;
  intervalSeconds: number;
  onArrivalsChange: (active: boolean) => void;
  onIntervalChange: (seconds: number) => void;
  onPreferenceChange: (preference: keyof Simulation["preferences"]) => void;
  onProfileChange: (profile: Profile) => void;
  onReset: () => void;
  onLogout: () => void;
};

export function SettingsPanel({
  state,
  arrivals,
  intervalSeconds,
  onArrivalsChange,
  onIntervalChange,
  onPreferenceChange,
  onProfileChange,
  onReset,
  onLogout,
}: SettingsPanelProps) {
  const [name, setName] = useState(state.profile.name);
  const [feedback, setFeedback] = useState("");
  const atCapacity = state.incidents.length >= MAX_INCIDENTS;
  const saveName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = profileSchema.safeParse({ name, role: state.profile.role });
    if (!parsed.success) {
      setFeedback(parsed.error.issues[0]?.message ?? "Revisa el nombre.");
      return;
    }
    onProfileChange(parsed.data);
    setFeedback("Nombre de práctica actualizado.");
  };

  return (
    <>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">Centro de control</p>
          <h1>Ajustes de la práctica.</h1>
          <p>
            Configura tu espacio, el ritmo de casos y los datos de esta sesión.
          </p>
        </div>
        <Pictogram icon={Monitor} />
      </div>
      <div className="demo-settings-intro demo-panel">
        <Pictogram icon={BrainCircuit} tone="sage" small />
        <div>
          <strong>Copiloto de demostración activo</strong>
          <p>
            Agrupa señales de ejemplo y explica una prioridad predefinida. K8
            consulta documentos curados en este navegador. La decisión siempre
            es humana; esta versión no consulta un modelo de IA.
          </p>
        </div>
        <span className="demo-settings-chip">Motor local</span>
      </div>
      <div className="demo-settings-grid">
        <section className="demo-panel demo-settings-card">
          <div className="demo-settings-heading">
            <Pictogram icon={UserRound} small />
            <div>
              <p className="demo-eyebrow">01 · Identidad de práctica</p>
              <h2>Tu perfil</h2>
            </div>
          </div>
          <p>
            Actúas como{" "}
            <strong>
              {state.profile.role === "OPERATOR" ? "Operador" : "Supervisión"}
            </strong>
            . Puedes cambiar el rol en la cabecera para recorrer ambas vistas.
          </p>
          <form onSubmit={saveName} className="demo-settings-form">
            <label className="demo-field">
              Nombre visible en el historial
              <input
                type="text"
                value={name}
                maxLength={32}
                onChange={(event) => {
                  setName(event.target.value);
                  setFeedback("");
                }}
                autoComplete="off"
              />
            </label>
            <button type="submit" className="demo-button demo-button-secondary">
              Guardar nombre
            </button>
            <span role="status" className="demo-settings-feedback">
              {feedback}
            </span>
          </form>
        </section>
        <section className="demo-panel demo-settings-card">
          <div className="demo-settings-heading">
            <Pictogram icon={Type} small />
            <div>
              <p className="demo-eyebrow">02 · Accesibilidad</p>
              <h2>Visualización</h2>
            </div>
          </div>
          <p>
            Ajusta la lectura para trabajar con comodidad. Tus preferencias se
            guardan en este navegador.
          </p>
          <div className="demo-settings-toggles">
            <button
              type="button"
              className="demo-settings-toggle"
              aria-pressed={state.preferences.largeText}
              onClick={() => onPreferenceChange("largeText")}
            >
              <span>
                <strong>Texto grande</strong>
                <small>Aumenta el tamaño de toda la consola.</small>
              </span>
              <span className="demo-switch" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="demo-settings-toggle"
              aria-pressed={state.preferences.solid}
              onClick={() => onPreferenceChange("solid")}
            >
              <span>
                <strong>Paneles sólidos</strong>
                <small>Reduce la transparencia del fondo.</small>
              </span>
              <span className="demo-switch" aria-hidden="true" />
            </button>
            {(
              [
                [
                  "highContrast",
                  "Alto contraste",
                  "Refuerza los bordes y los textos.",
                ],
                [
                  "motionOff",
                  "Sin movimiento",
                  "Detiene la animación ambiental y de K8.",
                ],
                [
                  "backgroundOff",
                  "Fondo simple",
                  "Quita los elementos decorativos del fondo.",
                ],
              ] as const
            ).map(([key, title, description]) => (
              <button
                key={key}
                type="button"
                className="demo-settings-toggle"
                aria-pressed={state.preferences[key]}
                onClick={() => onPreferenceChange(key)}
              >
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <span className="demo-switch" aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="demo-settings-footnote">
            La animación de la secuencia respeta la preferencia de movimiento
            reducido de tu dispositivo.
          </p>
        </section>
        <section className="demo-panel demo-settings-card">
          <div className="demo-settings-heading">
            <Pictogram icon={Activity} small />
            <div>
              <p className="demo-eyebrow">03 · Simulación</p>
              <h2>Llegada de casos</h2>
            </div>
          </div>
          <p>
            Controla el ritmo durante la presentación. Las llegadas empiezan en
            pausa.
          </p>
          <label className="demo-field">
            Intervalo entre casos
            <select
              value={intervalSeconds}
              onChange={(event) => onIntervalChange(Number(event.target.value))}
            >
              <option value={15}>Cada 15 segundos</option>
              <option value={30}>Cada 30 segundos</option>
              <option value={60}>Cada 60 segundos</option>
            </select>
          </label>
          <button
            type="button"
            className="demo-button demo-button-secondary"
            disabled={atCapacity}
            onClick={() => onArrivalsChange(!arrivals)}
          >
            {arrivals ? (
              <Pause aria-hidden="true" />
            ) : (
              <Play aria-hidden="true" />
            )}
            {arrivals ? "Pausar llegadas" : "Activar llegadas"}
          </button>
          <p className="demo-settings-footnote">
            {state.incidents.length} de {MAX_INCIDENTS} casos posibles en esta
            práctica.
          </p>
        </section>
        <section className="demo-panel demo-settings-card">
          <div className="demo-settings-heading">
            <Pictogram icon={ShieldCheck} small />
            <div>
              <p className="demo-eyebrow">04 · Datos de práctica</p>
              <h2>Guardar o terminar</h2>
            </div>
          </div>
          <p>
            Los casos, motivos y nombres quedan solo en este navegador. Descarga
            el registro antes de borrarlo si quieres conservarlo.
          </p>
          <div className="demo-settings-actions">
            <button
              type="button"
              className="demo-button demo-button-secondary"
              onClick={() => downloadPracticeHistory(state)}
            >
              <Download aria-hidden="true" /> Descargar historial
            </button>
            <button
              type="button"
              className="demo-button demo-button-secondary"
              onClick={onReset}
            >
              <RotateCcw aria-hidden="true" /> Reiniciar práctica
            </button>
            <button
              type="button"
              className="demo-button demo-button-exit"
              onClick={onLogout}
            >
              <LogOut aria-hidden="true" /> Cerrar sesión
            </button>
          </div>
          <p className="demo-settings-footnote">
            Cerrar borra la sesión local y vuelve a la pantalla de acceso. No
            equivale a cerrar una cuenta real.
          </p>
        </section>
      </div>
    </>
  );
}
