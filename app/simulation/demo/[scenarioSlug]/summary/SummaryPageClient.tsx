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
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

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

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];
const THEME_BAR_COLOR = "#06b6d4";
const SCORE_BAR_COLOR = "#2563eb";

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
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
      const stage = scenario.stages.find(
        (item) => item.id === response.stageId,
      );

      return {
        stageId: response.stageId,
        phaseNumber: response.phaseNumber,
        title: stage?.title || response.stageId,
        branchFamily: (stage as any)?.branchFamily || "unknown",
        decision: response.evaluation?.decision || "mixed",
        branchReason: response.evaluation?.branchReason || "",
      };
    });
  }, [scenario.stages, stageResponses]);

  const decisionBreakdown = useMemo(() => {
    const counts = {
      strong: 0,
      mixed: 0,
      limited: 0,
    };

    stageResponses.forEach((response) => {
      const decision = response.evaluation?.decision;
      if (decision === "strong") counts.strong += 1;
      else if (decision === "mixed") counts.mixed += 1;
      else if (decision === "limited") counts.limited += 1;
    });

    return [
      { name: "Strong", value: counts.strong },
      { name: "Mixed", value: counts.mixed },
      { name: "Limited", value: counts.limited },
    ].filter((item) => item.value > 0);
  }, [stageResponses]);

  const scoreTrend = useMemo(() => {
    return stageResponses.map((response) => ({
      phase: `P${response.phaseNumber}`,
      score: response.evaluation?.score || 0,
    }));
  }, [stageResponses]);

  const totalMatchedCriteria = useMemo(() => {
    return stageResponses.reduce(
      (sum, item) => sum + (item.evaluation?.matchedCriteriaIds?.length || 0),
      0,
    );
  }, [stageResponses]);

  const totalMissedRequired = useMemo(() => {
    return stageResponses.reduce(
      (sum, item) =>
        sum + (item.evaluation?.missingRequiredCriteriaIds?.length || 0),
      0,
    );
  }, [stageResponses]);

  const fallbackSummary = useMemo(() => {
    const topGaps = repeatedGaps
      .slice(0, 3)
      .map((g) => g.text)
      .join(", ");
    const topThemes = repeatedThemes
      .slice(0, 3)
      .map((t) => t.theme)
      .join(", ");

    return `You completed ${stageResponses.length} phase${stageResponses.length === 1 ? "" : "s"} in this simulation. The overall incident severity reached ${overallSeverity}. Across the exercise, you matched ${totalMatchedCriteria} criteria and missed ${totalMissedRequired} required criteria. The most repeated gaps were ${topGaps || "not clearly repeated"}, and the most repeated themes were ${topThemes || "not clearly repeated"}. Overall, the clearest improvement area is building more consistent coverage of the key operational actions expected at each stage.`;
  }, [
    stageResponses.length,
    overallSeverity,
    totalMatchedCriteria,
    totalMissedRequired,
    repeatedGaps,
    repeatedThemes,
  ]);

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
            answers: item.answers,
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
                  missedCriteriaTexts:
                    item.evaluation.missedCriteriaTexts || [],
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

        let result: any = {};
        try {
          result = await res.json();
        } catch {
          throw new Error("Summary API returned an invalid response.");
        }

        if (!res.ok) {
          throw new Error(result?.error || "Failed to generate final summary.");
        }

        setAiFeedback(result.feedback || fallbackSummary);
      } catch (err: any) {
        setError(
          err?.message || "Something went wrong while generating the summary.",
        );
        setAiFeedback(fallbackSummary);
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
    fallbackSummary,
  ]);

  const firstStage = useMemo(() => {
    return scenario.stages
      .filter((item) => item.phaseNumber === 1)
      .sort((a, b) => a.id.localeCompare(b.id))[0];
  }, [scenario.stages]);

  const handleRestart = () => {
    resetStoredSession();

    if (!firstStage) return;

    router.push("/scenario");
  };

  const handleBackToStart = () => {
    if (!firstStage) return;
    router.push("/scenario");
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

  const getDecisionBadgeClass = (decision?: "strong" | "mixed" | "limited") => {
    switch (decision) {
      case "strong":
        return "bg-emerald-100 text-emerald-700";
      case "mixed":
        return "bg-amber-100 text-amber-700";
      case "limited":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getFeedbackCardClass = (decision?: "strong" | "mixed" | "limited") => {
    switch (decision) {
      case "strong":
        return "border-emerald-200 bg-emerald-50";
      case "mixed":
        return "border-amber-200 bg-amber-50";
      case "limited":
        return "border-red-200 bg-red-50";
      default:
        return "border-slate-200 bg-slate-50";
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
              {firstStage && (
                <Button
                  onClick={() =>
                    router.push(
                      `/simulation/demo/${scenario.slug}/stage/${firstStage.id}`,
                    )
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

  console.log("DEBUG", {
    decisionBreakdown,
    repeatedThemes,
    scoreTrend,
  });

  function ChartCard({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) {
    return (
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center overflow-x-auto">{children}</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </CardContent>
      </Card>
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
            This summary highlights response quality, repeated gaps, pathway
            progression, and the main learning points across the exercise.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="rounded-3xl">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Completed phases
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stageResponses.length}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Matched criteria
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {totalMatchedCriteria}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Missed required criteria
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {totalMissedRequired}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Final reflection
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {reflectionResponse ? "Yes" : "No"}
              </p>
            </CardContent>
          </Card>
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
              ) : (
                <div className="rounded-2xl border bg-slate-50/70 p-5">
                  <p className="text-sm leading-7 text-slate-700">
                    {aiFeedback || fallbackSummary}
                  </p>
                </div>
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

              <div className="flex flex-wrap gap-3 pt-3">
                <Button variant="outline" onClick={handleBackToStart}>
                  Back to Start
                </Button>
                <Button onClick={handleRestart}>Restart Simulation</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Response Quality Breakdown"
            description="This chart shows how often your responses were rated strong, mixed, or limited."
          >
            {decisionBreakdown.length > 0 ? (
              <PieChart width={420} height={280}>
                <Pie
                  data={decisionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                  isAnimationActive={false}
                >
                  {decisionBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <ChartEmptyState message="No response quality data available yet." />
            )}
          </ChartCard>

          <ChartCard
            title="Repeated Missed Themes"
            description="This chart highlights the themes that were missed most often."
          >
            {repeatedThemes.length > 0 ? (
              <BarChart
                width={500}
                height={280}
                data={repeatedThemes}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="theme" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill={THEME_BAR_COLOR}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <ChartEmptyState message="No repeated missed themes were recorded." />
            )}
          </ChartCard>
        </div>

        <div className="mt-6">
          <ChartCard
            title="Score Trend Across Phases"
            description="This shows how strongly each phase was covered based on matched criteria."
          >
            {scoreTrend.length > 0 ? (
              <BarChart
                width={900}
                height={280}
                data={scoreTrend}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="score"
                  fill={SCORE_BAR_COLOR}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <ChartEmptyState message="No score trend data available yet." />
            )}
          </ChartCard>
        </div>
        {repeatedGaps.length > 0 && (
          <Card className="mt-6 rounded-3xl">
            <CardHeader>
              <CardTitle>Most Repeated Gaps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {repeatedGaps.map((gap, index) => (
                <div
                  key={`${gap.text}-${index}`}
                  className="rounded-2xl border bg-slate-50/70 p-4"
                >
                  <p className="text-sm leading-7 text-slate-700">
                    {gap.text}
                    {gap.count > 1 ? ` (${gap.count} times)` : ""}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {reflectionResponse && (
          <Card className="mt-6 rounded-3xl">
            <CardHeader>
              <CardTitle>Final Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border bg-slate-50/70 p-5">
                <p className="text-sm leading-7 text-slate-700">
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

            const stageQuestions = stage?.questions || [];
            const shouldShowBranchReason =
              response.phaseNumber > 1 &&
              Boolean(response.evaluation?.branchReason);

            return (
              <Card key={response.stageId} className="rounded-3xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl">
                      Phase {response.phaseNumber} —{" "}
                      {stage?.title || response.stageId}
                    </CardTitle>

                    {response.evaluation?.decision && (
                      <Badge
                        className={getDecisionBadgeClass(
                          response.evaluation.decision,
                        )}
                      >
                        {response.evaluation.decision}
                      </Badge>
                    )}

                    {(stage as any)?.branchFamily && (
                      <Badge className="bg-slate-100 text-slate-700">
                        {(stage as any).branchFamily}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div>
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Situation shown
                    </h4>
                    <p className="text-sm leading-7 text-slate-600">
                      {response.scenarioTextShown}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">
                      Questions and your responses
                    </h4>

                    {stageQuestions.length > 0 ? (
                      stageQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="rounded-2xl border bg-slate-50/70 p-4"
                        >
                          <p className="mb-2 text-sm font-medium text-slate-900">
                            Question {index + 1}: {question.text}
                          </p>
                          <p className="text-sm leading-7 text-slate-600">
                            {response.answers?.[question.id]?.trim() ||
                              "No answer recorded for this question."}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border bg-slate-50/70 p-4">
                        <p className="text-sm leading-7 text-slate-600">
                          {response.combinedAnswer}
                        </p>
                      </div>
                    )}
                  </div>

                  {response.evaluation?.feedback && (
                    <div
                      className={`rounded-2xl border p-4 ${getFeedbackCardClass(
                        response.evaluation.decision,
                      )}`}
                    >
                      <h4 className="mb-2 font-semibold text-slate-900">
                        Feedback
                      </h4>
                      <p className="text-sm leading-7 text-slate-700">
                        {response.evaluation.feedback}
                      </p>
                    </div>
                  )}

                  {shouldShowBranchReason && (
                    <div className="rounded-2xl border bg-slate-50/70 p-4">
                      <h4 className="mb-2 font-semibold text-slate-900">
                        Why this branch happened
                      </h4>
                      <p className="text-sm leading-7 text-slate-600">
                        {response.evaluation?.branchReason}
                      </p>
                    </div>
                  )}

                  {!!response.evaluation?.strengths?.length && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <h4 className="mb-2 font-semibold text-emerald-900">
                        What you covered well
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {response.evaluation.strengths.map((item, index) => (
                          <Badge
                            key={`${item}-${index}`}
                            className="bg-emerald-100 text-emerald-700"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {!!response.evaluation?.missedCriteriaTexts?.length && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <h4 className="mb-2 font-semibold text-amber-900">
                        Main gaps at this stage
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {response.evaluation.missedCriteriaTexts.map(
                          (item, index) => (
                            <Badge
                              key={`${item}-${index}`}
                              className="bg-amber-100 text-amber-700"
                            >
                              {item}
                            </Badge>
                          ),
                        )}
                      </div>
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
