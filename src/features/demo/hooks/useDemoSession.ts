"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import {
  createSimulation,
  restoreSimulation,
  STORAGE_KEY,
  transition,
  type DemoCommand,
  type DemoEvent,
} from "../model/simulation";
import { hasPracticeAccess, readProfile, saveProfile } from "../model/profile";
import type { Simulation } from "../schemas/simulation";

type Store = { simulation: Simulation | null; message: string; error: boolean };
type StoreAction =
  | { type: "LOAD"; state: Simulation; message: string }
  | { type: "EVENT"; event: DemoEvent };
function reducer(store: Store, action: StoreAction): Store {
  if (action.type === "LOAD")
    return { simulation: action.state, message: action.message, error: false };
  if (!store.simulation) return store;
  const result = transition(store.simulation, action.event);
  const messages: Partial<Record<DemoCommand["type"], string>> = {
    VIEW_EVIDENCE: "Vista observada. Tu avance quedó registrado.",
    READ_EXPLANATION: "Señales revisadas. Ya puedes decidir.",
    DECIDE: "Decisión registrada en el historial.",
    RECEIVE: "Derivación recibida en esta práctica.",
    ADD_INCIDENT: "Llegó un nuevo caso de práctica.",
    PROFILE: "Rol de práctica actualizado.",
  };
  return {
    simulation: result.state,
    message: result.error ?? messages[action.event.type] ?? "",
    error: result.error !== null,
  };
}

export function useDemoSession() {
  const [store, dispatch] = useReducer(reducer, {
    simulation: null,
    message: "",
    error: false,
  });
  const [storageUnavailable, setStorageUnavailable] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!hasPracticeAccess()) {
        window.location.replace("/login");
        return;
      }
      let raw: string | null = null;
      try {
        raw = window.localStorage.getItem(STORAGE_KEY);
      } catch {
        setStorageUnavailable(true);
      }
      const restored = restoreSimulation(raw);
      let state =
        restored ??
        createSimulation(
          Date.now(),
          crypto.randomUUID(),
          readProfile() ?? undefined,
        );
      const profile = readProfile();
      if (profile)
        state = transition(state, {
          type: "PROFILE",
          profile,
          id: crypto.randomUUID(),
          at: Date.now(),
        }).state;
      dispatch({
        type: "LOAD",
        state,
        message: restored
          ? "Retomamos tu práctica guardada."
          : raw
            ? "La práctica anterior no se pudo recuperar. Iniciamos una nueva."
            : "",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!store.simulation) return;
    saveProfile(store.simulation.profile);
    let frame = 0;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(store.simulation),
      );
    } catch {
      frame = window.requestAnimationFrame(() => setStorageUnavailable(true));
    }
    return () => window.cancelAnimationFrame(frame);
  }, [store.simulation]);

  const send = useCallback((command: DemoCommand) => {
    dispatch({
      type: "EVENT",
      event: { ...command, id: crypto.randomUUID(), at: Date.now() },
    });
  }, []);
  const restart = () => {
    const state = createSimulation(
      Date.now(),
      crypto.randomUUID(),
      store.simulation?.profile,
    );
    if (store.simulation) state.preferences = store.simulation.preferences;
    dispatch({
      type: "LOAD",
      state,
      message: "Nueva práctica preparada. Puedes empezar con el primer caso.",
    });
  };
  return { ...store, send, restart, storageUnavailable };
}
