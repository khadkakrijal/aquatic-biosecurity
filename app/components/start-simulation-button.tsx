"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StartSimulationButtonProps {
  sessionCode: string;
}

export default function StartSimulationButton({
  sessionCode,
}: StartSimulationButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/simulation/session/${sessionCode}/start`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to start simulation");
      }

      router.push(`/simulation/demo/stage/1?session=${sessionCode}`);
    } catch (error) {
      console.error("Start simulation error:", error);
      alert("Failed to start simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={loading}
      className="inline-flex rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-medium text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Starting..." : "Start Simulation"}
    </button>
  );
}