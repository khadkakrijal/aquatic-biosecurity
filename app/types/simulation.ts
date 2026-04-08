export type ThemeCategory =
  | "Protocols"
  | "Data"
  | "Stakeholders"
  | "Constraints"
  | "Communication"
  | "Expectations";

export type EvaluationDecision = "strong" | "mixed" | "limited";
export type ScenarioSeverity = "manageable" | "elevated" | "severe";

export interface EvaluationRules {
  minScore: number;
  requiredCriteriaIds: string[];
}

export interface AdminMeta {
  isPublished?: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  notes?: string;
}

export interface Criterion {
  id: string;
  text: string;
  consequence: string;
  theme: ThemeCategory;
  required?: boolean;
  weight?: number;
  keywords?: string[];
  sortOrder?: number;
}

export interface ReflectionQuestion {
  id: string;
  text: string;
  theme: ThemeCategory;
  placeholder?: string;
  sortOrder?: number;
}

export interface StageRoutingRules {
  strong?: string;
  mixed?: string;
  limited?: string;
  byMissingRequired?: Record<string, string>;
  byMissingRequiredPriority?: string[];
  fallback?: string;
}

export interface ScenarioStage {
  id: string;
  phaseNumber: number;
  title: string;
  timeframe: string;
  baseScenarioText: string;
  criteria: Criterion[];
  questions: ReflectionQuestion[];
  passingRules: EvaluationRules;
  nextStageMap?: StageRoutingRules;
  sortOrder?: number;
  isActive?: boolean;
  stageKey?: string;
  branchFamily?: string;
  isTerminal?: boolean;
  summaryCategory?: string;
  adminMeta?: AdminMeta;
}

export interface Scenario {
  id: string;
  title: string;
  slug: string;
  overview: string;
  stages: ScenarioStage[];
  version?: number;
  isActive?: boolean;
  category?: string;
  adminMeta?: AdminMeta;
}

export interface StageEvaluationResult {
  score: number;
  matchedCriteriaIds: string[];
  missingRequiredCriteriaIds: string[];
  feedback: string;
  decision: EvaluationDecision;
  scenarioSeverity: ScenarioSeverity;
  nextScenarioText?: string;
  nextStageId?: string;
  branchReason?: string;
  strengths?: string[];
  missedThemes?: ThemeCategory[];
  missedCriteriaTexts?: string[];
}

export interface StageResponse {
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  scenarioTextShown: string;
  submittedAt?: string;
  evaluation: StageEvaluationResult;
}

export interface SimulationSession {
  scenarioId: string;
  currentStageId: string;
  responses: Record<string, StageResponse>;
  startedAt: string;
  updatedAt: string;
  overallSeverity?: ScenarioSeverity;
  completedAt?: string;
  finalSummary?: string;
}