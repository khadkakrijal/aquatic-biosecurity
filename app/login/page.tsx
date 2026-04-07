"use client";

import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();

  // Get ?next=... from URL (fallback to /admin)
  const next = searchParams.get("next") || "/admin";

  const handleGoogleLogin = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">
          Login
        </h1>

        <p className="mb-6 text-sm text-slate-600">
          Continue with Google to access your session.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-xl bg-black px-4 py-3 text-white hover:bg-gray-800 transition"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}