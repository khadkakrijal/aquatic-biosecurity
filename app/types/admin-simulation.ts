export interface AdminScenario {
  id: string;
  slug: string;
  title: string;
  overview: string;
  category?: string | null;
  version?: number;
  is_active?: boolean;
  is_published?: boolean;
}

export interface AdminStage {
  id: string;
  scenario_id: string;
  stage_id: string;
  phase_number: number;
  title: string;
  timeframe?: string | null;
  branch_family?: string | null;
  base_scenario_text: string;
  min_score: number;
  required_criteria_ids: string[];
  next_stage_map: Record<string, any>;
  sort_order: number;
  is_active?: boolean;
  is_terminal?: boolean;
  summary_category?: string | null;
}

export interface AdminCriterion {
  id: string;
  stage_ref_id: string;
  criterion_id: string;
  text: string;
  consequence?: string | null;
  theme: string;
  required: boolean;
  weight: number;
  keywords: string[];
  sort_order: number;
}

export interface AdminQuestion {
  id: string;
  stage_ref_id: string;
  question_id: string;
  text: string;
  theme: string;
  placeholder?: string | null;
  sort_order: number;
}