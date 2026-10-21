// Modo día/noche compartido entre el login y la consola. La consola borra su
// estado al cerrar sesión; esta preferencia queda para que ambos coincidan.
export type Theme = "day" | "night";

const THEME_KEY = "takya.theme";

export function readTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === "day" || value === "night" ? value : null;
  } catch {
    return null;
  }
}

const EVENT = "takya-theme";

export function writeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* La preferencia dura mientras la página esté abierta. */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Para useSyncExternalStore: avisa cuando cambia el modo (esta u otra pestaña). */
export function subscribeTheme(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
