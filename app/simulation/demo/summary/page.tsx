"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredSession, resetStoredSession } from "@/app/lib/session-storage";
import { buildSummary } from "@/app/lib/simulation-engine";
import { SummaryReport } from "@/app/components/simulation/SummaryReport";

export default function SummaryPage() {
  const router = useRouter();
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  const session = getStoredSession();
  const summary = buildSummary(session);

  useEffect(() => {
    const runAi = async () => {
      try {
        setLoadingAi(true);
        const response = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioTitle: "Invasive Mussel Incursion — Response and Preparedness Exercise",
            summary,
            responses: session.responses,
          }),
        });

        const data = await response.json();
        if (data?.feedback) setAiFeedback(data.feedback);
      } catch {
        setAiFeedback("");
      } finally {
        setLoadingAi(false);
      }
    };

    runAi();
  }, []);

  const handleRestart = () => {
    resetStoredSession();
    router.push("/scenario/invasive-mussel");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Simulation complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              This final report is built from your selected criteria, written responses,
              and main decisions across all six phases.
            </p>
            <p>
              {loadingAi
                ? "Generating embedded AI feedback..."
                : "Embedded AI feedback ready."}
            </p>
          </CardContent>
        </Card>

        <SummaryReport summary={summary} aiFeedback={aiFeedback} />

        <div className="flex flex-wrap gap-4">
          <Button onClick={handleRestart} className="rounded-2xl px-8">
            Restart simulation
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="rounded-2xl px-8"
          >
            Open admin view
          </Button>
        </div>
      </div>
    </main>
  );
}