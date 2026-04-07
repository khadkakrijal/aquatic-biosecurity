import SessionLobbyListener from "@/app/components/session-lobby-listener";
import SessionMeetingBootstrap from "@/app/components/session-meeting-bootstrap";
import SessionInviteCard from "@/app/components/session-invite-card";
import StartSimulationButton from "@/app/components/start-simulation-button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface LobbyPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function SessionLobbyPage({
  params,
  searchParams,
}: LobbyPageProps) {
  const { code } = await params;
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: session, error: sessionError } = await supabase
    .from("simulation_sessions")
    .select("*")
    .eq("session_code", code.toUpperCase())
    .single();

  if (sessionError || !session) {
    redirect("/simulation/session/join");
  }

  const { data: participants } = await supabase
    .from("session_participants")
    .select("*")
    .eq("session_id", session.id)
    .order("joined_at", { ascending: true });

  const isHost = session.host_user_id === user.id;

  const currentParticipant = participants?.find(
    (participant) => participant.user_id === user.id
  );

  const displayName =
    currentParticipant?.participant_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    resolvedSearchParams.name ||
    user.email ||
    "Participant";

  return (
    <main className="min-h-screen bg-slate-50">
      <SessionLobbyListener
        sessionId={session.id}
        sessionCode={session.session_code}
        initialStatus={session.status}
        initialStageNumber={session.current_stage_number}
        isHost={isHost}
      />

      <SessionMeetingBootstrap
        sessionCode={session.session_code}
        userName={displayName}
        isHost={isHost}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">
              {isHost ? "Session Control Room" : "Session Viewer Lobby"}
            </h1>

            <div className="mt-4 space-y-2 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              <p>
                <strong>Session Title:</strong> {session.title}
              </p>
              <p>
                <strong>Session Code:</strong> {session.session_code}
              </p>
              <p>
                <strong>Status:</strong> {session.status}
              </p>
              <p>
                <strong>Joined As:</strong> {displayName}
              </p>
            </div>

            {isHost && (
              <div className="mt-6">
                <SessionInviteCard sessionCode={session.session_code} />
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Participants
              </h2>

              <div className="mt-3 space-y-3">
                {participants?.length ? (
                  participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="rounded-2xl border p-4"
                    >
                      <p className="font-medium text-slate-900">
                        {participant.participant_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {participant.participant_email || "No email"}
                      </p>
                      <p className="mt-1 text-xs uppercase text-slate-500">
                        {participant.role}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">
                    No participants have joined yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {isHost ? (
                <StartSimulationButton sessionCode={session.session_code} />
              ) : session.status === "active" ? (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                  The host has started the simulation. Please stay in the
                  meeting and watch the host walkthrough.
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  Waiting for the host to start the simulation.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Audio / Video Room
            </h2>

            <div className="space-y-4 rounded-2xl border bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-700">
                {isHost
                  ? "Share the invite link with participants. They can log in and join the session directly. After starting the simulation, use Share Screen inside the meeting so participants can follow along."
                  : "You joined from the invite/session link. Stay in the meeting and watch the host walkthrough."}
              </p>

              <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                <p>
                  <strong>Room Name:</strong> simulation-{session.session_code}
                </p>
                <p className="mt-2">
                  <strong>Your Display Name:</strong> {displayName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}