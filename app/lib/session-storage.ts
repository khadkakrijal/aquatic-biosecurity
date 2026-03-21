
import { SimulationSession } from "../types/simulation";
import { createEmptySession } from "./simulation-engine";

const STORAGE_KEY = "aquatic-biosecurity-demo-session";

export function getStoredSession(): SimulationSession {
  if (typeof window === "undefined") return createEmptySession();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = createEmptySession();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    return JSON.parse(raw) as SimulationSession;
  } catch {
    const fresh = createEmptySession();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveStoredSession(session: SimulationSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function resetStoredSession() {
  if (typeof window === "undefined") return;
  const fresh = createEmptySession();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
}