import { SimulationSession, StageResponse } from "../types/simulation";
import { invasiveMusselScenario } from "../data/invasive-mussel-scenario";

const STORAGE_KEY = "aquatic-biosecurity-demo-session";

function createEmptySession(): SimulationSession {
  const now = new Date().toISOString();

  return {
    scenarioId: invasiveMusselScenario.id,
    currentStageId: "p1",
    responses: {},
    startedAt: now,
    updatedAt: now,
    overallSeverity: "manageable",
    completedAt: undefined,
    finalSummary: undefined,
  };
}

function mapLegacyStageNumberToStageId(stageNumber?: number | null): string {
  if (!stageNumber || Number.isNaN(stageNumber)) return "p1";

  const found = invasiveMusselScenario.stages.find(
    (stage) => stage.phaseNumber === stageNumber,
  );

  return found?.id || "p1";
}

function normalizeResponses(
  rawResponses: unknown,
): Record<string, StageResponse> {
  if (!rawResponses || typeof rawResponses !== "object") {
    return {};
  }

  const entries = Object.entries(rawResponses as Record<string, any>);
  const normalized: Record<string, StageResponse> = {};

  for (const [key, value] of entries) {
    if (!value || typeof value !== "object") continue;

    const possibleStageId =
      typeof value.stageId === "string" && value.stageId.trim()
        ? value.stageId.trim()
        : /^\d+$/.test(key)
          ? mapLegacyStageNumberToStageId(Number(key))
          : key;

    const matchedStage = invasiveMusselScenario.stages.find(
      (stage) => stage.id === possibleStageId,
    );

    if (!matchedStage) continue;

    if (!value.evaluation || typeof value.evaluation !== "object") continue;

    normalized[matchedStage.id] = {
      stageId: matchedStage.id,
      phaseNumber:
        typeof value.phaseNumber === "number"
          ? value.phaseNumber
          : matchedStage.phaseNumber,
      answers:
        value.answers && typeof value.answers === "object" ? value.answers : {},
      combinedAnswer:
        typeof value.combinedAnswer === "string" ? value.combinedAnswer : "",
      scenarioTextShown:
        typeof value.scenarioTextShown === "string"
          ? value.scenarioTextShown
          : matchedStage.baseScenarioText,
      evaluation: value.evaluation,
      submittedAt:
        typeof value.submittedAt === "string" ? value.submittedAt : undefined,
    };
  }

  return normalized;
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
    const parsed = JSON.parse(raw) as Partial<SimulationSession> & {
      currentStageNumber?: number;
      responses?: unknown;
    };

    const normalizedResponses = normalizeResponses(parsed.responses);

    const currentStageId =
      typeof parsed.currentStageId === "string" && parsed.currentStageId.trim()
        ? parsed.currentStageId
        : mapLegacyStageNumberToStageId(parsed.currentStageNumber);

    const safeCurrentStageId = invasiveMusselScenario.stages.some(
      (stage) => stage.id === currentStageId,
    )
      ? currentStageId
      : "p1";

    const migrated: SimulationSession = {
      ...createEmptySession(),
      ...parsed,
      currentStageId: safeCurrentStageId,
      responses: normalizedResponses,
      scenarioId: invasiveMusselScenario.id,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
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
    }),
  );
}

export function resetStoredSession() {
  if (typeof window === "undefined") return;

  const fresh = createEmptySession();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
}