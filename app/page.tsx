import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import StartSimulationButton from "./StartSimulationButton";
import HomeUserMenu from "./HomeUserMenu";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  let fullName: string | null = user?.user_metadata?.full_name || null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    role = profile?.role || null;
    fullName = profile?.full_name || fullName;
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(6,12,28,0.9), rgba(8,48,73,0.8), rgba(17,24,39,0.9)), url('/biosecurity-bg.png')",
      }}
    >
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-4 py-4 md:px-10">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Biosecurity Simulation Platform
          </p>

          <div className="flex items-center gap-3">
            {user && (
              <HomeUserMenu
                email={user.email || ""}
                fullName={fullName}
                role={role}
              />
            )}
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center px-4 py-8 md:px-10">
          <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
            <div className="py-5">
              <p className="mb-4 inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-md">
                Scenario-based incident response training
              </p>

              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Practice real-world biosecurity response through simulation.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                This platform provides structured training where participants
                respond to evolving biosecurity incidents. Each decision affects
                the direction of the simulation and helps build judgement,
                prioritisation, and operational response skills.
              </p>

              <div className="mt-14 flex flex-wrap gap-4">
                <StartSimulationButton isLoggedIn={!!user} />

                {!user && (
                  <>
                    <Link
                      href="/login"
                      className="rounded-2xl border border-blue-300/70 bg-blue-500/20 px-6 py-3 text-sm font-semibold text-blue-50 transition hover:bg-blue-500/35"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-2xl border border-emerald-300/70 bg-emerald-500/20 px-6 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-500/35"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/15 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-xl">
              <div className="grid gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                    How it works
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Participants progress through multiple scenario phases where
                    the next stage depends on the quality and completeness of
                    their response.
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
                    Decision-based learning
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    The platform uses free-text responses to support realistic
                    thinking and practical incident response planning.
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Training objective
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    Improve preparedness for biosecurity incidents in a safe,
                    guided, and structured simulation environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
