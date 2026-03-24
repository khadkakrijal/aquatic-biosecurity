export type ThemeCategory =
  | "Protocols"
  | "Data"
  | "Stakeholders"
  | "Constraints"
  | "Communication"
  | "Expectations";

export type EvaluationDecision = "pass" | "partial" | "fail";
export type NodeKind = "main" | "remedial" | "failure";

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

export interface ScenarioNode {
  id: string;
  phaseNumber: number;
  kind: NodeKind;
  title: string;
  timeframe: string;
  scenarioText: string;
  criteria: Criterion[];
  questions: ReflectionQuestion[];
  passingRules: {
    minScore: number;
    requiredCriteriaIds: string[];
  };
  nextOnPass?: string;
  nextOnPartial?: string;
  nextOnFail?: string;
}

export interface Scenario {
  id: string;
  title: string;
  slug: string;
  overview: string;
  nodes: ScenarioNode[];
}

export interface NodeEvaluationResult {
  score: number;
  matchedCriteriaIds: string[];
  missingRequiredCriteriaIds: string[];
  feedback: string;
  decision: EvaluationDecision;
}

export interface NodeResponse {
  nodeId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  evaluation: NodeEvaluationResult;
  nextNodeId?: string;
}

export interface SimulationSession {
  scenarioId: string;
  currentNodeId: string;
  responses: Record<string, NodeResponse>;
  startedAt: string;
  updatedAt: string;
}