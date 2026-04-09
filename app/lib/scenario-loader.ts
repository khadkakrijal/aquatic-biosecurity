import "server-only";
import { createClient } from "@/utils/supabase/server";
import { Scenario, ScenarioStage } from "@/app/types/simulation";

type ScenarioRow = {
  id: string;
  title: string;
  slug: string;
  overview: string | null;
  version: number | null;
  is_active: boolean | null;
  is_published: boolean | null;
  category: string | null;
};

type ScenarioStageRow = {
  id: string;
  scenario_id: string;
  stage_id: string;
  phase_number: number;
  title: string;
  timeframe: string | null;
  branch_family: string | null;
  base_scenario_text: string;
  min_score: number | null;
  required_criteria_ids: string[] | null;
  next_stage_map: Record<string, any> | null;
  sort_order: number | null;
  is_active: boolean | null;
  is_terminal: boolean | null;
  summary_category: string | null;
};

type StageCriterionRow = {
  id: string;
  stage_ref_id: string;
  criterion_id: string;
  text: string;
  consequence: string | null;
  theme: string;
  required: boolean | null;
  weight: number | null;
  keywords: string[] | null;
  sort_order: number | null;
};

type StageQuestionRow = {
  id: string;
  stage_ref_id: string;
  question_id: string;
  text: string;
  theme: string;
  placeholder: string | null;
  sort_order: number | null;
};

export async function getScenarioBySlug(slug: string): Promise<Scenario | null> {
  const supabase = await createClient();

  const { data: scenario, error: scenarioError } = await supabase
    .from("scenarios")
    .select("*")
    .eq("slug", slug)
    .single<ScenarioRow>();

  if (scenarioError || !scenario) {
    return null;
  }

  const { data: stages, error: stagesError } = await supabase
    .from("scenario_stages")
    .select("*")
    .eq("scenario_id", scenario.id)
    .order("phase_number", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<ScenarioStageRow[]>();

  if (stagesError) {
    console.error("Failed to load stages:", stagesError);
    return null;
  }

  const stageDbIds = (stages || []).map((stage) => stage.id);

  let criteria: StageCriterionRow[] = [];
  let questions: StageQuestionRow[] = [];

  if (stageDbIds.length > 0) {
    const [{ data: criteriaData, error: criteriaError }, { data: questionsData, error: questionsError }] =
      await Promise.all([
        supabase
          .from("stage_criteria")
          .select("*")
          .in("stage_ref_id", stageDbIds)
          .order("sort_order", { ascending: true })
          .returns<StageCriterionRow[]>(),
        supabase
          .from("stage_questions")
          .select("*")
          .in("stage_ref_id", stageDbIds)
          .order("sort_order", { ascending: true })
          .returns<StageQuestionRow[]>(),
      ]);

    if (criteriaError) {
      console.error("Failed to load criteria:", criteriaError);
      return null;
    }

    if (questionsError) {
      console.error("Failed to load questions:", questionsError);
      return null;
    }

    criteria = criteriaData || [];
    questions = questionsData || [];
  }

  const mappedStages: ScenarioStage[] = (stages || []).map((stage) => ({
    id: stage.stage_id,
    phaseNumber: stage.phase_number,
    title: stage.title,
    timeframe: stage.timeframe || "",
    branchFamily: stage.branch_family || "main",
    baseScenarioText: stage.base_scenario_text,
    isTerminal: Boolean(stage.is_terminal),
    summaryCategory: stage.summary_category || undefined,
    criteria: criteria
      .filter((item) => item.stage_ref_id === stage.id)
      .map((item) => ({
        id: item.criterion_id,
        text: item.text,
        consequence: item.consequence || "",
        theme: item.theme as any,
        required: Boolean(item.required),
        weight: item.weight ?? 1,
        keywords: item.keywords || [],
        sortOrder: item.sort_order ?? 0,
      })),
    questions: questions
      .filter((item) => item.stage_ref_id === stage.id)
      .map((item) => ({
        id: item.question_id,
        text: item.text,
        theme: item.theme as any,
        placeholder: item.placeholder || "",
        sortOrder: item.sort_order ?? 0,
      })),
    passingRules: {
      minScore: stage.min_score ?? 0,
      requiredCriteriaIds: stage.required_criteria_ids || [],
    },
    nextStageMap: stage.next_stage_map || {},
  }));

  return {
    id: scenario.slug,
    title: scenario.title,
    slug: scenario.slug,
    overview: scenario.overview || "",
    version: scenario.version ?? 1,
    isActive: Boolean(scenario.is_active),
    category: scenario.category || "",
    adminMeta: {
      isPublished: Boolean(scenario.is_published),
      version: scenario.version ?? 1,
    },
    stages: mappedStages,
  };
}

export async function getScenarioStageById(
  scenarioSlug: string,
  stageId: string,
): Promise<{ scenario: Scenario; stage: ScenarioStage } | null> {
  const scenario = await getScenarioBySlug(scenarioSlug);

  if (!scenario) return null;

  const stage = scenario.stages.find((item) => item.id === stageId);

  if (!stage) return null;

  return { scenario, stage };
}