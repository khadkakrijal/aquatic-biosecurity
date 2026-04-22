"use client";

import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Request failed",
          text: error.message,
          confirmButtonColor: "#0891b2",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Reset link sent",
        text: "Please check your email.",
        confirmButtonColor: "#0891b2",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Forgot password
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleResetRequest} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-sm">
          <Link href="/login" className="text-cyan-700 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}