import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function SessionInvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  const sessionCode = code.toUpperCase();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(
        `/simulation/session/${sessionCode}/invite`
      )}`
    );
  }

  const { data: session, error: sessionError } = await supabase
    .from("simulation_sessions")
    .select("*")
    .eq("session_code", sessionCode)
    .single();

  if (sessionError || !session) {
    redirect(
      `/simulation/session/join?error=${encodeURIComponent(
        "Session not found. Please check the invitation link."
      )}`
    );
  }

  if (session.is_locked || session.status === "ended") {
    redirect(
      `/simulation/session/join?error=${encodeURIComponent(
        "This session is no longer available."
      )}`
    );
  }

  if (session.status === "completed" || session.status === "cancelled") {
    redirect(
      `/simulation/session/join?error=${encodeURIComponent(
        "This session is no longer available."
      )}`
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Participant";

  const { error: joinError } = await supabase.from("session_participants").upsert(
    {
      session_id: session.id,
      user_id: user.id,
      participant_name: displayName,
      participant_email: user.email,
      role: session.host_user_id === user.id ? "host" : "participant",
      is_active: true,
      last_seen_at: new Date().toISOString(),
    },
    {
      onConflict: "session_id,user_id",
    }
  );

  if (joinError) {
    redirect(
      `/simulation/session/join?error=${encodeURIComponent(joinError.message)}`
    );
  }

  redirect(`/simulation/session/${session.session_code}/lobby`);
}