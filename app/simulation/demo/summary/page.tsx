"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredSession, resetStoredSession } from "@/app/lib/session-storage";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";
import { SummaryReport } from "@/app/components/simulation/SummaryReport";

type StageDecision = "pass" | "partial" | "fail";

export default function SummaryPage() {
  const router = useRouter();
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const session = useMemo(() => getStoredSession(), []);

  const summaryData = useMemo(() => {
    const responseEntries = Object.values(session.responses || {}) as Array<{
      nodeId: string;
      phaseNumber: number;
      evaluation?: {
        score?: number;
        decision?: StageDecision;
        matchedCriteriaIds?: string[];
        missingRequiredCriteriaIds?: string[];
      };
    }>;

    const stageResults = responseEntries.map((response) => {
      const node = invasiveMusselScenario.nodes.find((n) => n.id === response.nodeId);

      return {
        nodeId: response.nodeId,
        title: node?.title || response.nodeId,
        phaseNumber: response.phaseNumber,
        decision: response.evaluation?.decision || "fail",
      };
    });

    const scores = responseEntries.map((r) => r.evaluation?.score || 0);
    const overallScore = scores.length
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

    const decisionCounts = {
      pass: stageResults.filter((s) => s.decision === "pass").length,
      partial: stageResults.filter((s) => s.decision === "partial").length,
      fail: stageResults.filter((s) => s.decision === "fail").length,
    };

    let outcomeLabel = "Needs Improvement";
    if (overallScore >= 80 && decisionCounts.fail === 0) {
      outcomeLabel = "Strong Operational Response";
    } else if (overallScore >= 60) {
      outcomeLabel = "Developing Operational Response";
    }

    const matchedCriteriaIds = responseEntries.flatMap(
      (r) => r.evaluation?.matchedCriteriaIds || []
    );
    const missingRequiredCriteriaIds = responseEntries.flatMap(
      (r) => r.evaluation?.missingRequiredCriteriaIds || []
    );

    const strengths: string[] = [];
    const gaps: string[] = [];

    if (matchedCriteriaIds.some((id) => id.includes("c1") || id.includes("r1"))) {
      strengths.push("You addressed important reporting, governance, or coordination actions.");
    }
    if (matchedCriteriaIds.some((id) => id.includes("c2") || id.includes("r2"))) {
      strengths.push("You considered surveillance, tracing, containment, or operational control measures.");
    }
    if (matchedCriteriaIds.some((id) => id.includes("c3") || id.includes("r3"))) {
      strengths.push("You considered communication, stakeholder engagement, or long-term planning.");
    }

    if (missingRequiredCriteriaIds.some((id) => id.startsWith("p1"))) {
      gaps.push("Early detection, reporting, or initial containment actions were not consistently addressed.");
    }
    if (missingRequiredCriteriaIds.some((id) => id.startsWith("p2") || id.startsWith("p3"))) {
      gaps.push("Investigation, tracing, escalation, or spread-control actions need further strengthening.");
    }
    if (missingRequiredCriteriaIds.some((id) => id.startsWith("p4") || id.startsWith("p5"))) {
      gaps.push("Operational planning, sustainability, or control coordination could be improved.");
    }
    if (missingRequiredCriteriaIds.some((id) => id.startsWith("p6"))) {
      gaps.push("Transition planning, proof of freedom, or long-term assurance needs stronger attention.");
    }

    if (strengths.length === 0) {
      strengths.push("You completed the simulation and engaged with the operational scenario.");
    }

    if (gaps.length === 0) {
      gaps.push("No major recurring gap was detected in this prototype summary.");
    }

    const uniqueBranchPath = Array.from(
      new Set(
        stageResults
          .sort((a, b) => a.phaseNumber - b.phaseNumber)
          .map((stage) => `Phase ${stage.phaseNumber}: ${stage.title}`)
      )
    );

    return {
      outcomeLabel,
      overallScore,
      strengths,
      gaps,
      branchPath: uniqueBranchPath,
      stageResults,
    };
  }, [session]);

  useEffect(() => {
    const runAi = async () => {
      try {
        setLoadingAi(true);

        const response = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioTitle:
              "Invasive Mussel Incursion — Response and Preparedness Exercise",
            summary: summaryData,
            responses: session.responses,
          }),
        });

        const data = await response.json();
        if (data?.feedback) {
          setAiFeedback(data.feedback);
        }
      } catch {
        setAiFeedback("");
      } finally {
        setLoadingAi(false);
      }
    };

    runAi();
  }, [session.responses, summaryData]);

  const handleRestart = () => {
    resetStoredSession();
    router.push("/scenario/invasive-mussel");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Simulation Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              This final report is built from your node-by-node responses, AI
              evaluations, and the pathway you followed through the simulation.
            </p>
            <p>
              {loadingAi
                ? "Generating embedded AI feedback..."
                : "Embedded AI feedback ready."}
            </p>
          </CardContent>
        </Card>

        <SummaryReport
          outcomeLabel={summaryData.outcomeLabel}
          overallScore={summaryData.overallScore}
          strengths={summaryData.strengths}
          gaps={summaryData.gaps}
          branchPath={summaryData.branchPath}
          stageResults={summaryData.stageResults}
          aiFeedback={aiFeedback}
        />

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