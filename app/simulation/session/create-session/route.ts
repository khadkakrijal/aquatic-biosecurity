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
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const title = String(
    formData.get("title") || "Aquatic Biosecurity Demo Session"
  ).trim();
  const hostName = String(formData.get("hostName") || "").trim();

  const sessionCode = generateSessionCode();

  const displayName =
    hostName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Host";

  const dailyRoomName = `sim-${sessionCode.toLowerCase()}`;

  const dailyRes = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: dailyRoomName,
      privacy: "public",
      properties: {
        enable_chat: true,
        start_video_off: false,
        start_audio_off: false,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
      },
    }),
  });

  const dailyData = await dailyRes.json();

  if (!dailyRes.ok) {
    return NextResponse.redirect(
      new URL(
        `/simulation/session/create?error=${encodeURIComponent(
          dailyData?.info || dailyData?.error || "Failed to create Daily room."
        )}`,
        request.url
      )
    );
  }

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
      daily_room_name: dailyData.name,
      daily_room_url: dailyData.url,
    })
    .select()
    .single();

  if (sessionError || !session) {
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

  if (participantError) {
    return NextResponse.redirect(
      new URL(
        `/simulation/session/create?error=${encodeURIComponent(
          participantError.message
        )}`,
        request.url
      )
    );
  }

  return NextResponse.redirect(
    new URL(`/simulation/session/${session.session_code}/lobby`, request.url)
  );
}