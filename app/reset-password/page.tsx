"use client";

import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please enter the same password in both fields.",
        confirmButtonColor: "#0891b2",
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: error.message,
          confirmButtonColor: "#0891b2",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Password updated",
        text: "You can now sign in with your new password.",
        confirmButtonColor: "#0891b2",
      });

      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">
          Reset password
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
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