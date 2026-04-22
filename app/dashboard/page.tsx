import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import HomeUserMenu from "../HomeUserMenu";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .maybeSingle();

  const { data: attempts } = await supabase
    .from("simulation_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(3);

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || user.email || "User";

  return (
    <main
      className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(3,7,18,0.78), rgba(8,47,73,0.66), rgba(15,23,42,0.82)), url('/biosecurity-bg.png')",
      }}
    >
      <div className="flex h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-4 md:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Participant Dashboard
            </p>
          </div>

          <HomeUserMenu
            fullName={displayName}
            email={profile?.email || user.email || ""}
            role={profile?.role || "participant"}
          />
        </header>

        <section className="flex flex-1 items-center px-5 pb-5 md:px-8">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-md">
                Welcome back to your simulation workspace
              </div>

              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Continue your progress and review your recent response activity.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base md:leading-8">
                Access scenarios, continue simulation work, and monitor recent
                attempts, scores, and completion data from one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/scenario"
                  className="rounded-2xl border border-cyan-300/70 bg-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-400"
                >
                  Explore Scenarios
                </Link>

                {profile?.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="rounded-2xl border border-emerald-300/60 bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-950/30 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-emerald-500/30"
                  >
                    Admin Panel
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="rounded-[30px] border border-cyan-300/25 bg-slate-950/35 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                    Signed In
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="mt-2 break-all text-sm leading-6 text-slate-100">
                    {profile?.email || user.email}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-blue-200">
                    Access Level
                  </p>
                  <p className="mt-2 text-lg font-semibold capitalize text-white">
                    {profile?.role || "participant"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    Your account is connected to tracked simulation progress and
                    stored performance history.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                    Recent Attempts
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {attempts?.length || 0}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    Your most recent tracked attempts are shown below with score and
                    completion details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-5 md:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {!attempts?.length ? (
              <div className="md:col-span-3 rounded-[26px] border border-cyan-300/20 bg-slate-950/35 p-5 text-center shadow-2xl backdrop-blur-xl">
                <p className="text-sm text-slate-100">
                  No attempts recorded yet. Start your first simulation to see
                  progress here.
                </p>
              </div>
            ) : (
              attempts.map((attempt: any) => (
                <div
                  key={attempt.id}
                  className="rounded-[26px] border border-cyan-300/20 bg-slate-950/35 p-5 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {attempt.scenario_slug || "Scenario Attempt"}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {attempt.started_at
                          ? new Date(attempt.started_at).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        attempt.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {attempt.status || "in_progress"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 grid-cols-3">
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 p-3 text-center">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200">
                        Score
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {attempt.overall_score || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-300/15 bg-blue-400/10 p-3 text-center">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-blue-200">
                        Complete
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {attempt.completion_percentage || 0}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-3 text-center">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200">
                        Severity
                      </p>
                      <p className="mt-1 text-lg font-semibold capitalize text-white">
                        {attempt.overall_severity || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}