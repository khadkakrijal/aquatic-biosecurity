import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface CreateSessionPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function CreateSessionPage({
  searchParams,
}: CreateSessionPageProps) {
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
            Create Session
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Start a shared aquatic biosecurity simulation session.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </div>
          )}

          <form
            action="/simulation/session/create-session"
            method="post"
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Session Title
              </label>
              <input
                name="title"
                defaultValue="Aquatic Biosecurity Demo Session"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-900">
                Host Display Name
              </label>
              <input
                name="hostName"
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
              Create Session
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}