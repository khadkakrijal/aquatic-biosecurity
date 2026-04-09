import { SimulationSession } from "@/app/types/simulation";

const STORAGE_KEY = "aquatic-biosecurity-simulation-session";

function getEmptySession(): SimulationSession {
  const now = new Date().toISOString();

  return {
    scenarioId: "",
    scenarioSlug: "",
    scenarioTitle: "",
    currentStageId: "",
    responses: {},
    startedAt: now,
    updatedAt: now,
    overallSeverity: "manageable",
  };
}

export function createFreshSession(options: {
  scenarioId: string;
  scenarioSlug: string;
  scenarioTitle: string;
  firstStageId: string;
}): SimulationSession {
  const now = new Date().toISOString();

  return {
    scenarioId: options.scenarioId,
    scenarioSlug: options.scenarioSlug,
    scenarioTitle: options.scenarioTitle,
    currentStageId: options.firstStageId,
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
      return getEmptySession();
    }

    const parsed = JSON.parse(raw) as SimulationSession;

    return {
      ...getEmptySession(),
      ...parsed,
      responses: parsed.responses || {},
    };
  } catch {
    return getEmptySession();
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
  window.localStorage.removeItem(STORAGE_KEY);
}