import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function generateSessionCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export async function POST(request: Request) {
  console.log("🚀 create-session: route hit");

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("👤 user check:", {
    userId: user?.id,
    email: user?.email,
    error: userError?.message,
  });

  if (userError || !user) {
    console.error("❌ No authenticated user");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const title = String(
    formData.get("title") || "Aquatic Biosecurity Demo Session"
  ).trim();
  const hostName = String(formData.get("hostName") || "").trim();

  console.log("📝 form data:", { title, hostName });

  const sessionCode = generateSessionCode();
  console.log("🔑 generated session code:", sessionCode);

  const displayName =
    hostName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Host";

  console.log("🎥 Jitsi room will be:", `simulation-${sessionCode}`);

  const { data: session, error: sessionError } = await supabase
    .from("simulation_sessions")
    .insert({
      session_code: sessionCode,
      scenario_id: "invasive-mussel",
      title,
      host_user_id: user.id,
      host_name: displayName,
      status: "waiting",
      current_stage_number: 1,
      is_locked: false,
    })
    .select()
    .single();

  console.log("📦 session insert:", {
    session,
    error: sessionError?.message,
  });

  if (sessionError || !session) {
    console.error("❌ session creation failed:", sessionError);
    return NextResponse.redirect(
      new URL(
        `/simulation/session/create?error=${encodeURIComponent(
          sessionError?.message || "Failed to create session."
        )}`,
        request.url
      )
    );
  }

  const { error: participantError } = await supabase
    .from("session_participants")
    .insert({
      session_id: session.id,
      user_id: user.id,
      participant_name: displayName,
      participant_email: user.email,
      role: "host",
      is_active: true,
    });

  console.log("👥 participant insert:", {
    error: participantError?.message,
  });

  if (participantError) {
    console.error("❌ participant insert failed:", participantError);
    return NextResponse.redirect(
      new URL(
        `/simulation/session/create?error=${encodeURIComponent(
          participantError.message
        )}`,
        request.url
      )
    );
  }

  console.log("✅ SUCCESS: redirecting to lobby", session.session_code);

  return NextResponse.redirect(
    new URL(`/simulation/session/${session.session_code}/lobby`, request.url)
  );
}