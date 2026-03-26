export type ThemeCategory =
  | "Protocols"
  | "Data"
  | "Stakeholders"
  | "Constraints"
  | "Communication"
  | "Expectations";

export type EvaluationDecision = "pass" | "partial" | "fail";
export type ScenarioSeverity = "stable" | "elevated" | "severe";

export interface Criterion {
  id: string;
  text: string;
  consequence: string;
  theme: ThemeCategory;
  required?: boolean;
  weight?: number;
  keywords?: string[];
}

export interface ReflectionQuestion {
  id: string;
  text: string;
  theme: ThemeCategory;
  placeholder?: string;
}

export interface ScenarioStage {
  id: string;
  phaseNumber: number;
  title: string;
  timeframe: string;
  baseScenarioText: string;
  criteria: Criterion[];
  questions: ReflectionQuestion[];
  passingRules: {
    minScore: number;
    requiredCriteriaIds: string[];
  };
}

export interface Scenario {
  id: string;
  title: string;
  slug: string;
  overview: string;
  stages: ScenarioStage[];
}

export interface StageEvaluationResult {
  score: number;
  matchedCriteriaIds: string[];
  missingRequiredCriteriaIds: string[];
  feedback: string;
  decision: EvaluationDecision;
  scenarioSeverity: ScenarioSeverity;
  nextScenarioText?: string;
}

export interface StageResponse {
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  scenarioTextShown: string;
  evaluation: StageEvaluationResult;
}

export interface SimulationSession {
  scenarioId: string;
  currentStageNumber: number;
  responses: Record<number, StageResponse>;
  startedAt: string;
  updatedAt: string;
}