import { SimulationSession } from "../types/simulation";
import { invasiveMusselScenario } from "../data/invasive-mussel-scenario";

const STORAGE_KEY = "aquatic-biosecurity-demo-session";

function createEmptySession(): SimulationSession {
  const now = new Date().toISOString();

  return {
    scenarioId: invasiveMusselScenario.id,
    currentNodeId: "p1-main",
    responses: {},
    startedAt: now,
    updatedAt: now,
  };
}

export function getStoredSession(): SimulationSession {
  if (typeof window === "undefined") {
    return createEmptySession();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const fresh = createEmptySession();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as SimulationSession;

    if (!parsed?.scenarioId || !parsed?.currentNodeId || !parsed?.responses) {
      const fresh = createEmptySession();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }

    return parsed;
  } catch {
    const fresh = createEmptySession();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveStoredSession(session: SimulationSession) {
  if (typeof window === "undefined") return;

  const updatedSession: SimulationSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
}

export function resetStoredSession() {
  if (typeof window === "undefined") return;

  const fresh = createEmptySession();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
}