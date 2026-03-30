"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
    redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-xl bg-black px-4 py-3 text-white"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}