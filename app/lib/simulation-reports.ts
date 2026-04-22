import { createClient } from "@/utils/supabase/server";

export async function getReportStats() {
  const supabase = await createClient();

  const { data: attempts, error } = await supabase
    .from("simulation_attempts")
    .select("id, completion_percentage, status, overall_severity");

  if (error) {
    throw new Error(error.message);
  }

  const totalAttempts = attempts.length;

  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed",
  ).length;

  const inProgressAttempts = attempts.filter(
    (attempt) => attempt.status === "in_progress",
  ).length;

  const avgCompletion =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce(
            (sum, attempt) => sum + Number(attempt.completion_percentage || 0),
            0,
          ) / totalAttempts,
        )
      : 0;

  const severityCounts = {
    manageable: 0,
    elevated: 0,
    severe: 0,
  };

  attempts.forEach((attempt) => {
    if (attempt.overall_severity === "manageable") {
      severityCounts.manageable += 1;
    } else if (attempt.overall_severity === "elevated") {
      severityCounts.elevated += 1;
    } else if (attempt.overall_severity === "severe") {
      severityCounts.severe += 1;
    }
  });

  return {
    totalAttempts,
    completedAttempts,
    inProgressAttempts,
    avgCompletion,
    severityCounts,
  };
}

export async function getAttemptsReport() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("simulation_attempts")
    .select(
      `
      *,
      profiles (
        full_name,
        email,
        role
      ),
      scenarios (
        title
      )
    `,
    )
    .order("started_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAttemptDetail(attemptId: string) {
  const supabase = await createClient();

  const { data: attempt, error: attemptError } = await supabase
    .from("simulation_attempts")
    .select(
      `
      *,
      profiles (
        full_name,
        email,
        role
      ),
      scenarios (
        title
      )
    `,
    )
    .eq("id", attemptId)
    .single();

  if (attemptError) {
    throw new Error(attemptError.message);
  }

  const { data: stages, error: stagesError } = await supabase
    .from("simulation_stage_attempts")
    .select("*")
    .eq("attempt_id", attemptId)
    .order("phase_number", { ascending: true });

  if (stagesError) {
    throw new Error(stagesError.message);
  }

  return { attempt, stages };
}

export async function getDecisionBreakdownAcrossStages() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("simulation_stage_attempts")
    .select("decision");

  if (error) {
    throw new Error(error.message);
  }

  const counts = {
    strong: 0,
    mixed: 0,
    limited: 0,
  };

  data.forEach((row) => {
    if (row.decision === "strong") counts.strong += 1;
    else if (row.decision === "mixed") counts.mixed += 1;
    else if (row.decision === "limited") counts.limited += 1;
  });

  return [
    { name: "Strong", value: counts.strong },
    { name: "Mixed", value: counts.mixed },
    { name: "Limited", value: counts.limited },
  ].filter((item) => item.value > 0);
}

export async function getMostMissedThemes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("simulation_stage_attempts")
    .select("missed_themes");

  if (error) {
    throw new Error(error.message);
  }

  const themeMap = new Map<string, number>();

  data.forEach((row) => {
    const themes = Array.isArray(row.missed_themes) ? row.missed_themes : [];

    themes.forEach((theme) => {
      if (!theme) return;
      themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
    });
  });

  return Array.from(themeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([theme, count]) => ({
      theme,
      count,
    }));
}