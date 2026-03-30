import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface EndRouteProps {
  params: Promise<{ code: string }>;
}

export async function POST(request: Request, { params }: EndRouteProps) {
  const { code } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: session, error: sessionError } = await supabase
    .from("simulation_sessions")
    .select("*")
    .eq("session_code", code.toUpperCase())
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.host_user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from("simulation_sessions")
    .update({
      status: "ended",
      is_locked: true,
    })
    .eq("id", session.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message || "Failed to end session" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}