import { SimulationSession } from "../types/simulation";
import { invasiveMusselScenario } from "../data/invasive-mussel-scenario";

const STORAGE_KEY = "aquatic-biosecurity-demo-session";

function createEmptySession(): SimulationSession {
  const now = new Date().toISOString();

  return {
    scenarioId: invasiveMusselScenario.id,
    currentStageNumber: 1,
    responses: {},
    startedAt: now,
    updatedAt: now,
  };
}

export function getStoredSession(): SimulationSession {
  if (typeof window === "undefined") return createEmptySession();

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const fresh = createEmptySession();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw) as SimulationSession;

    if (
      !parsed?.scenarioId ||
      typeof parsed?.currentStageNumber !== "number" ||
      !parsed?.responses
    ) {
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

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...session,
      updatedAt: new Date().toISOString(),
    })
  );
}

export function resetStoredSession() {
  if (typeof window === "undefined") return;
  const fresh = createEmptySession();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
}