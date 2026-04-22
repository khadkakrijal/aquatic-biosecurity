"use client";

import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterContent() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: error.message,
          confirmButtonColor: "#0891b2",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Please check your email if confirmation is required.",
        confirmButtonColor: "#0891b2",
      });

      router.push("/login");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoadingGoogle(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Google registration failed",
          text: error.message,
          confirmButtonColor: "#0891b2",
        });
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Create account
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Register to use the simulation platform.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {loadingEmail ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loadingGoogle}
          className="w-full rounded-xl bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {loadingGoogle ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="mt-6 text-sm">
          <Link href="/login" className="text-cyan-700 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
