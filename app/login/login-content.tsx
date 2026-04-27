"use client";

import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
          confirmButtonColor: "#0891b2",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Login successful",
        text: "Welcome back.",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push(next);
      router.refresh();
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            next,
          )}`,
        },
      });

      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Google login failed",
          text: error.message,
          confirmButtonColor: "#0891b2",
        });
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(6,12,28,0.9), rgba(8,48,73,0.65), rgba(17,24,39,0.92)), url('/biosecurity-bg.png')",
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-7 shadow-2xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 flex-col gap-1 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-[10px] font-bold tracking-wide leading-none">
              BIO
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in to continue to the biosecurity simulation platform.
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
          >
            {loadingEmail ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="w-full rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
        >
          {loadingGoogle ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            href="/register"
            className="font-medium text-cyan-700 transition hover:text-cyan-800 hover:underline"
          >
            Create account
          </Link>

          <Link
            href="/forgot-password"
            className="font-medium text-cyan-700 transition hover:text-cyan-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}
