export type ThemeCategory =
  | "Protocols"
  | "Data"
  | "Stakeholders"
  | "Constraints"
  | "Communication"
  | "Expectations";

export type DecisionImpact = "strong" | "moderate" | "weak";

export interface Criterion {
  id: string;
  text: string;
  consequence: string;
  theme: ThemeCategory;
}

export interface ReflectionQuestion {
  id: string;
  text: string;
  theme: ThemeCategory;
  placeholder?: string;
}

export interface DecisionOption {
  id: string;
  text: string;
  impact: DecisionImpact;
  consequenceFlag: string;
}

export interface Phase {
  phaseNumber: number;
  title: string;
  timeframe: string;
  scenarioText: string;
  criteria: Criterion[];
  questions: ReflectionQuestion[];
  decisionOptions: DecisionOption[];
}

export interface Scenario {
  id: string;
  title: string;
  slug: string;
  overview: string;
  phases: Phase[];
}

export interface PhaseResponse {
  phaseNumber: number;
  selectedCriteriaIds: string[];
  answers: Record<string, string>;
  selectedDecisionId: string;
  missedConsequences: string[];
  impact: DecisionImpact;
  consequenceFlags: string[];
  score: number;
}

export interface SimulationSession {
  scenarioId: string;
  currentPhase: number;
  responses: Record<number, PhaseResponse>;
  startedAt: string;
  updatedAt: string;
}

export interface SummaryResult {
  totalScore: number;
  readinessLabel: string;
  strengths: string[];
  gaps: string[];
  consequenceFlags: string[];
  missedConsequences: string[];
  coveredThemes: ThemeCategory[];
}