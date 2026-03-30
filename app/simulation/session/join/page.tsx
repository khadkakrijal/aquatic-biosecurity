import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface JoinSessionPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function JoinSessionPage({
  searchParams,
}: JoinSessionPageProps) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">
            Join Session
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Enter a session code to join an existing simulation.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </div>
          )}

          <form
            action="/simulation/session/join-session"
            method="post"
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Session Code
              </label>
              <input
                name="sessionCode"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Your Display Name
              </label>
              <input
                name="participantName"
                defaultValue={
                  user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  user.email ||
                  ""
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Join Session
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}