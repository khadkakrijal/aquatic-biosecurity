import SessionLobbyListener from "@/app/components/session-lobby-listener";
import SessionMeetingBootstrap from "@/app/components/session-meeting-bootstrap";
import StartSimulationButton from "@/app/components/start-simulation-button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
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

  const isHost = !!user && session.host_user_id === user.id;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    resolvedSearchParams.name ||
    user?.email ||
    "Participant";

  return (
    <main className="min-h-screen bg-slate-50">
      <SessionLobbyListener
        sessionId={session.id}
        sessionCode={session.session_code}
        initialStatus={session.status}
        initialStageNumber={session.current_stage_number}
      />

      <SessionMeetingBootstrap
        sessionCode={session.session_code}
        userName={displayName}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">
              Session Lobby
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
              <div className="mt-6">
                {isHost ? (
                  <StartSimulationButton sessionCode={session.session_code} />
                ) : (
                  <p className="text-sm text-slate-600">
                    Waiting for the host to start the simulation.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Audio / Video Room
            </h2>

            <div className="space-y-4 rounded-2xl border bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-700">
                This session uses one shared meeting room for the full
                simulation.
              </p>

              <p className="text-sm leading-7 text-slate-600">
                The floating meeting window should remain active from lobby
                until the final stage.
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
