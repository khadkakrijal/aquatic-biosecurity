"use server";

import { createClient } from "@/utils/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  return { supabase, user };
}

async function getScenarioRowBySlug(supabase: Awaited<ReturnType<typeof createClient>>, scenarioSlug: string) {
  const { data, error } = await supabase
    .from("scenarios")
    .select("id, slug, title")
    .eq("slug", scenarioSlug)
    .single();

  if (error || !data) {
    throw new Error("Scenario not found in database.");
  }

  return data;
}

export async function startSimulationAttemptAction({
  scenarioSlug,
  firstStageId,
  totalStages,
}: {
  scenarioSlug: string;
  firstStageId: string;
  totalStages: number;
}) {
  const { supabase, user } = await getAuthenticatedUser();
  const scenarioRow = await getScenarioRowBySlug(supabase, scenarioSlug);

  const { data: existingAttempt, error: existingError } = await supabase
    .from("simulation_attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("scenario_id", scenarioRow.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingAttempt) {
    return existingAttempt;
  }

  const { data, error } = await supabase
    .from("simulation_attempts")
    .insert({
      user_id: user.id,
      scenario_id: scenarioRow.id,
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

export async function saveStageAttemptAction({
  attemptId,
  scenarioSlug,
  stageId,
  phaseNumber,
  answers,
  combinedAnswer,
  scenarioTextShown,
  decision,
  feedback,
  scenarioSeverity,
  nextScenarioText,
  nextStageId,
  branchReason,
  matchedCriteriaIds,
  missingRequiredCriteriaIds,
  strengths,
  missedThemes,
  missedCriteriaTexts,
}: {
  attemptId: string;
  scenarioSlug: string;
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  scenarioTextShown?: string;
  decision: string;
  feedback: string;
  scenarioSeverity?: string;
  nextScenarioText?: string;
  nextStageId?: string;
  branchReason?: string;
  matchedCriteriaIds?: string[];
  missingRequiredCriteriaIds?: string[];
  strengths?: string[];
  missedThemes?: string[];
  missedCriteriaTexts?: string[];
}) {
  const { supabase, user } = await getAuthenticatedUser();
  const scenarioRow = await getScenarioRowBySlug(supabase, scenarioSlug);

  const { data: existingStageAttempt, error: existingStageError } = await supabase
    .from("simulation_stage_attempts")
    .select("id")
    .eq("attempt_id", attemptId)
    .eq("stage_id", stageId)
    .maybeSingle();

  if (existingStageError) {
    throw new Error(existingStageError.message);
  }

  if (!existingStageAttempt) {
    const { error: insertError } = await supabase
      .from("simulation_stage_attempts")
      .insert({
        attempt_id: attemptId,
        user_id: user.id,
        scenario_id: scenarioRow.id,
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

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const { data: attemptRow, error: attemptError } = await supabase
    .from("simulation_attempts")
    .select("completed_stages, total_stages, overall_severity")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attemptRow) {
    throw new Error(attemptError?.message || "Attempt not found.");
  }

  const currentCompletedStages = Number(attemptRow.completed_stages || 0);
  const totalStages = Number(attemptRow.total_stages || 0);
  const nextCompletedStages = Math.min(currentCompletedStages + 1, totalStages || currentCompletedStages + 1);
  const completionPercentage =
    totalStages > 0 ? Math.round((nextCompletedStages / totalStages) * 100) : 0;

  const severityRank: Record<string, number> = {
    manageable: 1,
    elevated: 2,
    severe: 3,
  };

  const existingSeverity = attemptRow.overall_severity || "manageable";
  const incomingSeverity = scenarioSeverity || "manageable";

  const mergedSeverity =
    (severityRank[incomingSeverity] || 1) > (severityRank[existingSeverity] || 1)
      ? incomingSeverity
      : existingSeverity;

  const { error: updateError } = await supabase
    .from("simulation_attempts")
    .update({
      current_stage_id: nextStageId || stageId,
      current_phase_number: phaseNumber,
      overall_score: null,
      overall_severity: mergedSeverity,
      completed_stages: nextCompletedStages,
      completion_percentage: completionPercentage,
    })
    .eq("id", attemptId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

export async function completeSimulationAttemptAction({
  attemptId,
  finalSummary,
  overallSeverity,
}: {
  attemptId: string;
  finalSummary?: string;
  overallSeverity?: string;
}) {
  const { supabase } = await getAuthenticatedUser();

  const { data: attemptRow, error: attemptError } = await supabase
    .from("simulation_attempts")
    .select("started_at, total_stages")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attemptRow) {
    throw new Error(attemptError?.message || "Attempt not found.");
  }

  const startedAt = attemptRow.started_at ? new Date(attemptRow.started_at) : null;
  const now = new Date();

  const totalTimeSeconds = startedAt
    ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000))
    : 0;

  const { error } = await supabase
    .from("simulation_attempts")
    .update({
      completed_at: now.toISOString(),
      overall_score: null,
      overall_severity: overallSeverity || null,
      completion_percentage: 100,
      status: "completed",
      total_time_seconds: totalTimeSeconds,
      final_summary: finalSummary || null,
      completed_stages: attemptRow.total_stages || null,
    })
    .eq("id", attemptId);

  if (error) {
    throw new Error(error.message);
  }
}