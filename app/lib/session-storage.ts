import { SimulationSession } from "@/app/types/simulation";

const STORAGE_KEY = "aquatic-biosecurity-simulation-session";

function getEmptySession(): SimulationSession {
  const now = new Date().toISOString();

  return {
    scenarioId: "invasive-mussel",
    currentStageId: "p1",
    responses: {},
    startedAt: now,
    updatedAt: now,
    overallSeverity: "manageable",
  };
}

export function getStoredSession(): SimulationSession {
  if (typeof window === "undefined") {
    return getEmptySession();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const fresh = getEmptySession();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }

    const parsed = JSON.parse(raw) as SimulationSession;

    return {
      ...getEmptySession(),
      ...parsed,
      responses: parsed.responses || {},
    };
  } catch {
    const fresh = getEmptySession();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveStoredSession(session: SimulationSession) {
  if (typeof window === "undefined") return;

  const updated: SimulationSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function resetStoredSession() {
  if (typeof window === "undefined") return;
  const fresh = getEmptySession();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
}