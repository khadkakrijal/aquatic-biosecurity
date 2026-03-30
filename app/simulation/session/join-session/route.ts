import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const sessionCode = String(formData.get("sessionCode") || "")
    .trim()
    .toUpperCase();

  const participantName = String(formData.get("participantName") || "").trim();

  const { data: session, error: sessionError } = await supabase
    .from("simulation_sessions")
    .select("*")
    .eq("session_code", sessionCode)
    .single();

  if (sessionError || !session) {
    return NextResponse.redirect(
      new URL(
        `/simulation/session/join?error=${encodeURIComponent(
          "Session not found. Please check the session code."
        )}`,
        request.url
      )
    );
  }

  if (session.is_locked) {
    return NextResponse.redirect(
      new URL(
        `/simulation/session/join?error=${encodeURIComponent(
          "This session is locked."
        )}`,
        request.url
      )
    );
  }

  if (session.status === "completed" || session.status === "cancelled") {
    return NextResponse.redirect(
      new URL(
        `/simulation/session/join?error=${encodeURIComponent(
          "This session is no longer available."
        )}`,
        request.url
      )
    );
  }

  const displayName =
    participantName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Participant";

  const { error: joinError } = await supabase
    .from("session_participants")
    .upsert(
      {
        session_id: session.id,
        user_id: user.id,
        participant_name: displayName,
        participant_email: user.email,
        role: "participant",
        is_active: true,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "session_id,user_id",
      }
    );

  if (joinError) {
    return NextResponse.redirect(
      new URL(
        `/simulation/session/join?error=${encodeURIComponent(joinError.message)}`,
        request.url
      )
    );
  }

  return NextResponse.redirect(
    new URL(`/simulation/session/${session.session_code}/lobby`, request.url)
  );
}