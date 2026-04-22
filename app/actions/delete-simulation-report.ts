"use server";

import { createClient } from "@/utils/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found.");
  }

  if (profile.role !== "admin") {
    throw new Error("Only admins can delete reports.");
  }

  return supabase;
}

export async function deleteSimulationAttemptAction(attemptId: string) {
  const supabase = await requireAdmin();

  const { error: deleteStagesError } = await supabase
    .from("simulation_stage_attempts")
    .delete()
    .eq("attempt_id", attemptId);

  if (deleteStagesError) {
    throw new Error(deleteStagesError.message);
  }

  const { error: deleteAttemptError } = await supabase
    .from("simulation_attempts")
    .delete()
    .eq("id", attemptId);

  if (deleteAttemptError) {
    throw new Error(deleteAttemptError.message);
  }

  return { success: true };
}