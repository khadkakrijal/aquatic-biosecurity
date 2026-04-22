import { createClient } from "@/utils/supabase/server";

export async function startSimulationAttempt({
  scenarioId,
  scenarioSlug,
  firstStageId,
  totalStages,
}: {
  scenarioId: string;
  scenarioSlug: string;
  firstStageId: string;
  totalStages: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { data, error } = await supabase
    .from("simulation_attempts")
    .insert({
      user_id: user.id,
      scenario_id: scenarioId,
      scenario_slug: scenarioSlug,
      started_at: new Date().toISOString(),
      current_stage_id: firstStageId,
      current_phase_number: 1,
      overall_score: null,
      overall_severity: null,
      completion_percentage: 0,
      status: "in_progress",
      total_stages: totalStages,
      completed_stages: 0,
      total_time_seconds: 0,
      final_summary: null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getLatestInProgressAttempt({
  scenarioId,
}: {
  scenarioId: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("simulation_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("scenario_id", scenarioId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveStageAttempt({
  attemptId,
  scenarioId,
  stageId,
  phaseNumber,
  answers,
  combinedAnswer,
  decision,
  feedback,
  branchReason,
  matchedCriteriaIds,
  missingRequiredCriteriaIds,
  strengths,
  missedThemes,
  missedCriteriaTexts,
}: {
  attemptId: string;
  scenarioId: string;
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  decision: string;
  feedback: string;
  branchReason?: string;
  matchedCriteriaIds?: string[];
  missingRequiredCriteriaIds?: string[];
  strengths?: string[];
  missedThemes?: string[];
  missedCriteriaTexts?: string[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { error } = await supabase.from("simulation_stage_attempts").insert({
    attempt_id: attemptId,
    user_id: user.id,
    scenario_id: scenarioId,
    stage_id: stageId,
    phase_number: phaseNumber,
    question_answers: answers,
    combined_answer: combinedAnswer,
    score: null,
    decision,
    feedback,
    branch_reason: branchReason || null,
    matched_criteria_ids: matchedCriteriaIds || [],
    missing_required_criteria_ids: missingRequiredCriteriaIds || [],
    strengths: strengths || [],
    missed_themes: missedThemes || [],
    missed_criteria_texts: missedCriteriaTexts || [],
    started_at: new Date().toISOString(),
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateSimulationAttemptProgress({
  attemptId,
  currentStageId,
  currentPhaseNumber,
  completedStages,
  totalStages,
  overallSeverity,
}: {
  attemptId: string;
  currentStageId: string;
  currentPhaseNumber: number;
  completedStages: number;
  totalStages: number;
  overallSeverity?: string;
}) {
  const supabase = await createClient();

  const completionPercentage =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const { error } = await supabase
    .from("simulation_attempts")
    .update({
      current_stage_id: currentStageId,
      current_phase_number: currentPhaseNumber,
      overall_score: null,
      overall_severity: overallSeverity || null,
      completed_stages: completedStages,
      completion_percentage: completionPercentage,
    })
    .eq("id", attemptId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeSimulationAttempt({
  attemptId,
  overallSeverity,
  completedStages,
  totalStages,
  finalSummary,
}: {
  attemptId: string;
  overallSeverity?: string;
  completedStages: number;
  totalStages: number;
  finalSummary?: string;
}) {
  const supabase = await createClient();

  const { data: attemptRow, error: attemptError } = await supabase
    .from("simulation_attempts")
    .select("started_at")
    .eq("id", attemptId)
    .single();

  if (attemptError) {
    throw new Error(attemptError.message);
  }

  const startedAt = attemptRow?.started_at
    ? new Date(attemptRow.started_at)
    : null;

  const now = new Date();
  const totalTimeSeconds = startedAt
    ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000))
    : 0;

  const completionPercentage =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 100;

  const { error } = await supabase
    .from("simulation_attempts")
    .update({
      completed_at: now.toISOString(),
      overall_score: null,
      overall_severity: overallSeverity || null,
      completed_stages: completedStages,
      completion_percentage: completionPercentage,
      total_time_seconds: totalTimeSeconds,
      final_summary: finalSummary || null,
      status: "completed",
    })
    .eq("id", attemptId);

  if (error) {
    throw new Error(error.message);
  }
}