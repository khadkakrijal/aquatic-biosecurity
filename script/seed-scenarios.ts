import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { invasiveMusselScenario } from "../app/data/invasive-mussel-scenario";
import { wssvPrawnFarmScenario } from "../app/data/wssv-prawn-farm-scenario";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing env vars. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const scenarios = [invasiveMusselScenario, wssvPrawnFarmScenario];

type ExistingStageRow = {
  id: string;
};

function getStageSortOrderWithinPhase(
  phaseCounters: Map<number, number>,
  phaseNumber: number,
) {
  const current = phaseCounters.get(phaseNumber) ?? 0;
  const next = current + 1;
  phaseCounters.set(phaseNumber, next);
  return next;
}

async function deleteScenarioBySlug(slug: string) {
  const { data: existingScenario, error: existingScenarioError } = await supabase
    .from("scenarios")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingScenarioError) {
    throw existingScenarioError;
  }

  if (!existingScenario?.id) {
    return;
  }

  const scenarioId = existingScenario.id;

  const { data: existingStages, error: existingStagesError } = await supabase
    .from("scenario_stages")
    .select("id")
    .eq("scenario_id", scenarioId);

  if (existingStagesError) {
    throw existingStagesError;
  }

  const stageIds = ((existingStages || []) as ExistingStageRow[]).map(
    (stage) => stage.id,
  );

  if (stageIds.length > 0) {
    const { error: deleteQuestionsError } = await supabase
      .from("stage_questions")
      .delete()
      .in("stage_ref_id", stageIds);

    if (deleteQuestionsError) {
      throw deleteQuestionsError;
    }

    const { error: deleteCriteriaError } = await supabase
      .from("stage_criteria")
      .delete()
      .in("stage_ref_id", stageIds);

    if (deleteCriteriaError) {
      throw deleteCriteriaError;
    }

    const { error: deleteStagesError } = await supabase
      .from("scenario_stages")
      .delete()
      .eq("scenario_id", scenarioId);

    if (deleteStagesError) {
      throw deleteStagesError;
    }
  }

  const { error: deleteScenarioError } = await supabase
    .from("scenarios")
    .delete()
    .eq("id", scenarioId);

  if (deleteScenarioError) {
    throw deleteScenarioError;
  }

  console.log(`Deleted existing scenario with slug: ${slug}`);
}

async function seedOneScenario(scenario: any) {
  console.log(`\nSeeding scenario: ${scenario.title}`);

  await deleteScenarioBySlug(scenario.slug);

  const { data: insertedScenario, error: insertScenarioError } = await supabase
    .from("scenarios")
    .insert({
      title: scenario.title,
      slug: scenario.slug,
      overview: scenario.overview,
      version: scenario.version ?? 1,
      is_active: scenario.isActive ?? true,
      is_published: scenario.adminMeta?.isPublished ?? false,
      category: scenario.category ?? null,
    })
    .select("id")
    .single();

  if (insertScenarioError || !insertedScenario) {
    throw insertScenarioError || new Error(`Failed to insert scenario: ${scenario.title}`);
  }

  const scenarioId = insertedScenario.id;
  console.log(`Inserted scenario: ${scenario.title} -> ${scenarioId}`);

  const phaseCounters = new Map<number, number>();

  for (const stage of scenario.stages) {
    const sortOrder = getStageSortOrderWithinPhase(
      phaseCounters,
      stage.phaseNumber,
    );

    const { data: insertedStage, error: insertStageError } = await supabase
      .from("scenario_stages")
      .insert({
        scenario_id: scenarioId,
        stage_id: stage.id,
        phase_number: stage.phaseNumber,
        title: stage.title,
        timeframe: stage.timeframe ?? null,
        branch_family: stage.branchFamily ?? "main",
        base_scenario_text: stage.baseScenarioText,
        min_score: stage.passingRules?.minScore ?? 0,
        required_criteria_ids: stage.passingRules?.requiredCriteriaIds ?? [],
        next_stage_map: stage.nextStageMap ?? {},
        sort_order: sortOrder,
        is_active: true,
        is_terminal: stage.isTerminal ?? false,
        summary_category: stage.summaryCategory ?? null,
      })
      .select("id")
      .single();

    if (insertStageError || !insertedStage) {
      throw (
        insertStageError ||
        new Error(`Failed to insert stage: ${stage.id} in ${scenario.title}`)
      );
    }

    const stageDbId = insertedStage.id;
    console.log(`  Inserted stage: ${stage.id} -> ${stageDbId}`);

    if (stage.criteria?.length) {
      const criteriaPayload = stage.criteria.map((criterion: any, index: number) => ({
        stage_ref_id: stageDbId,
        criterion_id: criterion.id,
        text: criterion.text,
        consequence: criterion.consequence ?? null,
        theme: criterion.theme,
        required: criterion.required ?? false,
        weight: criterion.weight ?? 1,
        keywords: criterion.keywords ?? [],
        sort_order: criterion.sortOrder ?? index + 1,
      }));

      const { error: insertCriteriaError } = await supabase
        .from("stage_criteria")
        .insert(criteriaPayload);

      if (insertCriteriaError) {
        throw insertCriteriaError;
      }

      console.log(`    Added ${criteriaPayload.length} criteria`);
    }

    if (stage.questions?.length) {
      const questionsPayload = stage.questions.map((question: any, index: number) => ({
        stage_ref_id: stageDbId,
        question_id: question.id,
        text: question.text,
        theme: question.theme,
        placeholder: question.placeholder ?? null,
        sort_order: question.sortOrder ?? index + 1,
      }));

      const { error: insertQuestionsError } = await supabase
        .from("stage_questions")
        .insert(questionsPayload);

      if (insertQuestionsError) {
        throw insertQuestionsError;
      }

      console.log(`    Added ${questionsPayload.length} questions`);
    }
  }

  console.log(`Finished scenario: ${scenario.title}`);
}

async function seedAllScenarios() {
  for (const scenario of scenarios) {
    await seedOneScenario(scenario);
  }

  console.log("\nAll scenarios seeded successfully.");
}

seedAllScenarios()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nSeed failed:");
    console.error(error);
    process.exit(1);
  });