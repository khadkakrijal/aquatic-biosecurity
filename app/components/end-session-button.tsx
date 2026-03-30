"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EndSessionButtonProps {
  sessionCode: string;
}

export default function EndSessionButton({
  sessionCode,
}: EndSessionButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEndSession = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/simulation/session/${sessionCode}/end`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to end session");
      }

      localStorage.removeItem("active-simulation-meeting");
      window.dispatchEvent(new Event("active-simulation-meeting-changed"));

      router.push("/scenario/invasive-mussel");
    } catch (error) {
      console.error("End session error:", error);
      alert("Failed to end session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEndSession}
      disabled={loading}
      className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
    >
      {loading ? "Ending..." : "End Session"}
    </button>
  );
}