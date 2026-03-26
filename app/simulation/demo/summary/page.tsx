"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";
import {
  getStoredSession,
  resetStoredSession,
} from "@/app/lib/session-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DecisionType = "pass" | "partial" | "fail";
type SeverityType = "stable" | "elevated" | "severe";

interface StageResponse {
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  scenarioTextShown: string;
  evaluation?: {
    score: number;
    matchedCriteriaIds: string[];
    missingRequiredCriteriaIds: string[];
    feedback: string;
    decision: DecisionType;
    scenarioSeverity: SeverityType;
    nextScenarioText?: string;
  };
}

export default function SummaryPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<number, StageResponse>>({});
  const [aiFeedback, setAiFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getStoredSession();
    setResponses(session.responses || {});
    setLoading(false);
  }, []);

  const orderedResponses = useMemo(() => {
    return Object.values(responses).sort(
      (a, b) => a.phaseNumber - b.phaseNumber,
    );
  }, [responses]);

  const stageResponses = useMemo(() => {
    return orderedResponses.filter(
      (item) => item.phaseNumber >= 1 && item.phaseNumber <= 6,
    );
  }, [orderedResponses]);

  const reflectionResponse = useMemo(() => {
    return orderedResponses.find(
      (item) => item.stageId === "complete" || item.phaseNumber === 7,
    );
  }, [orderedResponses]);

  const summaryStats = useMemo(() => {
    const passCount = stageResponses.filter(
      (item) => item.evaluation?.decision === "pass",
    ).length;

    const partialCount = stageResponses.filter(
      (item) => item.evaluation?.decision === "partial",
    ).length;

    const failCount = stageResponses.filter(
      (item) => item.evaluation?.decision === "fail",
    ).length;

    const totalScore = stageResponses.reduce(
      (sum, item) => sum + (item.evaluation?.score || 0),
      0,
    );

    const averageScore =
      stageResponses.length > 0
        ? Math.round(totalScore / stageResponses.length)
        : 0;

    return {
      passCount,
      partialCount,
      failCount,
      totalScore,
      averageScore,
    };
  }, [stageResponses]);

  useEffect(() => {
    if (!stageResponses.length || aiFeedback) return;

    const generateSummary = async () => {
      try {
        setSummaryLoading(true);
        setError("");

        const payload = {
          scenarioTitle: invasiveMusselScenario.title,
          summary: {
            totalStages: stageResponses.length,
            passCount: summaryStats.passCount,
            partialCount: summaryStats.partialCount,
            failCount: summaryStats.failCount,
            totalScore: summaryStats.totalScore,
            averageScore: summaryStats.averageScore,
          },
          responses: orderedResponses,
        };

        const res = await fetch("/api/ai-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.error || "Failed to generate final summary.");
        }

        setAiFeedback(result.feedback || "No summary feedback was generated.");
      } catch (err: any) {
        setError(
          err?.message || "Something went wrong while generating the summary.",
        );
      } finally {
        setSummaryLoading(false);
      }
    };

    generateSummary();
  }, [stageResponses, aiFeedback, orderedResponses, summaryStats]);

  const handleRestart = () => {
    resetStoredSession();
    router.push("/scenario/invasive-mussel");
  };

  const handleBackToScenario = () => {
    router.push("/scenario/invasive-mussel");
  };

  const getDecisionBadgeClass = (decision?: DecisionType) => {
    switch (decision) {
      case "pass":
        return "bg-emerald-600 text-white";
      case "partial":
        return "bg-amber-500 text-white";
      case "fail":
        return "bg-red-600 text-white";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  const getSeverityBadgeClass = (severity?: SeverityType) => {
    switch (severity) {
      case "stable":
        return "bg-cyan-600 text-white";
      case "elevated":
        return "bg-orange-500 text-white";
      case "severe":
        return "bg-rose-600 text-white";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100 p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-slate-600">Loading summary...</p>
        </div>
      </main>
    );
  }

  if (!orderedResponses.length) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100 p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>No simulation data found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                No saved simulation session was found. Please start the
                simulation first.
              </p>
              <Button onClick={() => router.push("/scenario/invasive-mussel")}>
                Go to Scenario
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="bg-cyan-600 text-white">Simulation Summary</Badge>
            <Badge variant="outline">{invasiveMusselScenario.title}</Badge>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Final Exercise Summary
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This summary combines your responses across the aquatic biosecurity
            simulation and provides an overall preparedness view.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Passed Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">
                {summaryStats.passCount}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Partial Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-amber-500">
                {summaryStats.partialCount}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Failed Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-red-600">
                {summaryStats.failCount}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">
                {summaryStats.averageScore}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>AI Preparedness Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <p className="text-sm text-slate-600">
                  Generating final summary...
                </p>
              ) : aiFeedback ? (
                <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {aiFeedback}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  No final AI summary available.
                </p>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Exercise Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>
                Total scored phases: <strong>{stageResponses.length}</strong>
              </p>
              <p>
                Total score: <strong>{summaryStats.totalScore}</strong>
              </p>
              <p>
                Final reflection included:{" "}
                <strong>{reflectionResponse ? "Yes" : "No"}</strong>
              </p>
              <div className="flex flex-wrap gap-3 pt-3">
                <Button variant="outline" onClick={handleBackToScenario}>
                  Back to Scenario
                </Button>
                <Button onClick={handleRestart}>Restart Simulation</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {reflectionResponse && (
          <Card className="mt-6 rounded-3xl">
            <CardHeader>
              <CardTitle>Final Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border bg-slate-50/70 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {reflectionResponse.combinedAnswer}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 space-y-6">
          {stageResponses.map((response) => {
            const stage = invasiveMusselScenario.stages.find(
              (item) => item.phaseNumber === response.phaseNumber,
            );

            return (
              <Card key={response.phaseNumber} className="rounded-3xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl">
                      Phase {response.phaseNumber} –{" "}
                      {stage?.title || response.stageId}
                    </CardTitle>

                    <Badge
                      className={getDecisionBadgeClass(
                        response.evaluation?.decision,
                      )}
                    >
                      {response.evaluation?.decision || "not evaluated"}
                    </Badge>

                    <Badge
                      className={getSeverityBadgeClass(
                        response.evaluation?.scenarioSeverity,
                      )}
                    >
                      {response.evaluation?.scenarioSeverity || "unknown"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                      Situation shown
                    </h3>
                    <div className="rounded-2xl border bg-slate-50/70 p-4">
                      <p className="text-sm leading-7 text-slate-700">
                        {response.scenarioTextShown}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                      Your response
                    </h3>
                    <div className="rounded-2xl border bg-white p-4">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                        {response.combinedAnswer}
                      </p>
                    </div>
                  </div>

                  {response.evaluation?.feedback && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-slate-900">
                        Feedback
                      </h3>
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="whitespace-pre-line text-sm leading-7 text-emerald-800">
                          {response.evaluation.feedback}
                        </p>
                      </div>
                    </div>
                  )}

                  {response.evaluation?.nextScenarioText && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-slate-900">
                        Incident progression
                      </h3>
                      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                        <p className="text-sm leading-7 text-cyan-900">
                          {response.evaluation.nextScenarioText}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <span>
                      Score: <strong>{response.evaluation?.score ?? 0}</strong>
                    </span>
                    <span>
                      Matched criteria:{" "}
                      <strong>
                        {response.evaluation?.matchedCriteriaIds?.length ?? 0}
                      </strong>
                    </span>
                    <span>
                      Missing required:{" "}
                      <strong>
                        {response.evaluation?.missingRequiredCriteriaIds
                          ?.length ?? 0}
                      </strong>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
