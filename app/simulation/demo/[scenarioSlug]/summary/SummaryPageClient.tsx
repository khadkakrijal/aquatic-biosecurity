"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStoredSession,
  resetStoredSession,
} from "@/app/lib/session-storage";
import { Scenario, ScenarioSeverity } from "@/app/types/simulation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StageResponse {
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  scenarioTextShown: string;
  submittedAt?: string;
  evaluation?: {
    score?: number;
    feedback: string;
    decision?: "strong" | "mixed" | "limited";
    scenarioSeverity: ScenarioSeverity;
    matchedCriteriaIds?: string[];
    missingRequiredCriteriaIds?: string[];
    nextScenarioText?: string;
    nextStageId?: string;
    branchReason?: string;
    strengths?: string[];
    missedThemes?: string[];
    missedCriteriaTexts?: string[];
  };
}

interface SummaryPageClientProps {
  scenario: Scenario;
}

export default function SummaryPageClient({
  scenario,
}: SummaryPageClientProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, StageResponse>>({});
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
    return Object.values(responses).sort((a, b) => {
      if (a.phaseNumber !== b.phaseNumber) {
        return a.phaseNumber - b.phaseNumber;
      }
      return (a.submittedAt || "").localeCompare(b.submittedAt || "");
    });
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

  const overallSeverity = useMemo<ScenarioSeverity>(() => {
    const severities = stageResponses.map(
      (item) => item.evaluation?.scenarioSeverity,
    );

    if (severities.includes("severe")) return "severe";
    if (severities.includes("elevated")) return "elevated";
    return "manageable";
  }, [stageResponses]);

  const repeatedGaps = useMemo(() => {
    const gapMap = new Map<string, number>();

    stageResponses.forEach((response) => {
      const gaps = response.evaluation?.missedCriteriaTexts || [];
      gaps.forEach((gap) => {
        const key = gap.trim();
        if (!key) return;
        gapMap.set(key, (gapMap.get(key) || 0) + 1);
      });
    });

    return Array.from(gapMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([text, count]) => ({ text, count }));
  }, [stageResponses]);

  const repeatedThemes = useMemo(() => {
    const themeMap = new Map<string, number>();

    stageResponses.forEach((response) => {
      const themes = response.evaluation?.missedThemes || [];
      themes.forEach((theme) => {
        if (!theme) return;
        themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
      });
    });

    return Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([theme, count]) => ({ theme, count }));
  }, [stageResponses]);

  const visitedPath = useMemo(() => {
    return stageResponses.map((response) => {
      const stage = scenario.stages.find((item) => item.id === response.stageId);

      return {
        stageId: response.stageId,
        phaseNumber: response.phaseNumber,
        title: stage?.title || response.stageId,
        branchFamily: stage?.branchFamily || "unknown",
        decision: response.evaluation?.decision || "mixed",
        branchReason: response.evaluation?.branchReason || "",
      };
    });
  }, [scenario.stages, stageResponses]);

  useEffect(() => {
    if (!stageResponses.length || aiFeedback) return;

    const generateSummary = async () => {
      try {
        setSummaryLoading(true);
        setError("");

        const payload = {
          scenarioTitle: scenario.title,
          summary: {
            totalStages: stageResponses.length,
            overallSeverity,
            repeatedGaps,
            repeatedThemes,
            reflectionIncluded: Boolean(reflectionResponse),
            visitedPath,
          },
          responses: orderedResponses.map((item) => ({
            stageId: item.stageId,
            phaseNumber: item.phaseNumber,
            combinedAnswer: item.combinedAnswer,
            scenarioTextShown: item.scenarioTextShown,
            evaluation: item.evaluation
              ? {
                  score: item.evaluation.score,
                  feedback: item.evaluation.feedback,
                  decision: item.evaluation.decision,
                  scenarioSeverity: item.evaluation.scenarioSeverity,
                  matchedCriteriaIds: item.evaluation.matchedCriteriaIds || [],
                  missingRequiredCriteriaIds:
                    item.evaluation.missingRequiredCriteriaIds || [],
                  nextScenarioText: item.evaluation.nextScenarioText,
                  nextStageId: item.evaluation.nextStageId,
                  branchReason: item.evaluation.branchReason,
                  strengths: item.evaluation.strengths || [],
                  missedThemes: item.evaluation.missedThemes || [],
                  missedCriteriaTexts: item.evaluation.missedCriteriaTexts || [],
                }
              : undefined,
          })),
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
  }, [
    scenario.title,
    stageResponses,
    aiFeedback,
    orderedResponses,
    overallSeverity,
    repeatedGaps,
    repeatedThemes,
    reflectionResponse,
    visitedPath,
  ]);

  const firstStage = useMemo(() => {
    return scenario.stages
      .filter((item) => item.phaseNumber === 1)
      .sort((a, b) => a.id.localeCompare(b.id))[0];
  }, [scenario.stages]);

  const handleRestart = () => {
    resetStoredSession();

    if (!firstStage) return;

    router.push(`/simulation/demo/${scenario.slug}/stage/${firstStage.id}`);
  };

  const handleBackToStart = () => {
    if (!firstStage) return;

    router.push(`/simulation/demo/${scenario.slug}/stage/${firstStage.id}`);
  };

  const getSeverityBadgeClass = (severity?: ScenarioSeverity) => {
    switch (severity) {
      case "manageable":
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
                No saved simulation session was found. Please start the simulation first.
              </p>
              {firstStage && (
                <Button
                  onClick={() =>
                    router.push(`/simulation/demo/${scenario.slug}/stage/${firstStage.id}`)
                  }
                >
                  Go to Scenario
                </Button>
              )}
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
            <Badge variant="outline">{scenario.title}</Badge>
            <Badge className={getSeverityBadgeClass(overallSeverity)}>
              Overall incident severity: {overallSeverity}
            </Badge>
          </div>

          <h1 className="text-3xl font-semibold text-slate-900">
            Final Exercise Summary
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This summary focuses on the main capability gaps, operational pressures,
            branch pathway, and learning points across the exercise.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Preparedness Summary</CardTitle>
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
                  No final summary available.
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
            <CardContent className="space-y-5 text-sm text-slate-600">
              <p>
                Completed phases: <strong>{stageResponses.length}</strong>
              </p>
              <p>
                Final reflection included:{" "}
                <strong>{reflectionResponse ? "Yes" : "No"}</strong>
              </p>

              {visitedPath.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">
                    Path through the exercise
                  </h3>
                  <ul className="space-y-2">
                    {visitedPath.map((item, index) => (
                      <li
                        key={`${item.stageId}-${index}`}
                        className="leading-6"
                      >
                        {index + 1}. Phase {item.phaseNumber} — {item.title}{" "}
                        <span className="text-slate-400">
                          ({item.branchFamily}, {item.decision})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {repeatedGaps.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">
                    Repeated gaps noticed
                  </h3>
                  <ul className="space-y-2">
                    {repeatedGaps.map((gap, index) => (
                      <li key={`${gap.text}-${index}`} className="leading-6">
                        - {gap.text}
                        {gap.count > 1 ? ` (${gap.count} times)` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {repeatedThemes.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">
                    Repeated missed themes
                  </h3>
                  <ul className="space-y-2">
                    {repeatedThemes.map((theme, index) => (
                      <li key={`${theme.theme}-${index}`} className="leading-6">
                        - {theme.theme}
                        {theme.count > 1 ? ` (${theme.count} times)` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-3">
                <Button variant="outline" onClick={handleBackToStart}>
                  Back to Start
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
            const stage = scenario.stages.find(
              (item) => item.id === response.stageId,
            );

            return (
              <Card key={response.stageId} className="rounded-3xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl">
                      Phase {response.phaseNumber} — {stage?.title || response.stageId}
                    </CardTitle>

                    {response.evaluation?.decision && (
                      <Badge variant="outline" className="capitalize">
                        {response.evaluation.decision}
                      </Badge>
                    )}

                    {stage?.branchFamily && (
                      <Badge className="bg-slate-100 text-slate-700">
                        {stage.branchFamily}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Situation shown
                    </h4>
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {response.scenarioTextShown}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Your response
                    </h4>
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {response.combinedAnswer}
                    </p>
                  </div>

                  {response.evaluation?.feedback && (
                    <div>
                      <h4 className="mb-2 font-semibold text-slate-900">
                        Feedback
                      </h4>
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                        {response.evaluation.feedback}
                      </p>
                    </div>
                  )}

                  {response.evaluation?.branchReason && (
                    <div>
                      <h4 className="mb-2 font-semibold text-slate-900">
                        Why this branch happened
                      </h4>
                      <p className="text-sm leading-7 text-slate-600">
                        {response.evaluation.branchReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}