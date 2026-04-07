"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getScenarioStageById,
  invasiveMusselScenario,
} from "@/app/data/invasive-mussel-scenario";
import { getStoredSession, saveStoredSession } from "@/app/lib/session-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DecisionType = "strong" | "mixed" | "limited";
type SeverityType = "manageable" | "elevated" | "severe";

export default function StagePage() {
  const params = useParams<{ stageId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionCode = searchParams.get("session");
  const stageId = params.stageId;
  const stage = getScenarioStageById(stageId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [, setDecision] = useState<DecisionType | null>(null);
  const [, setNextScenarioText] = useState("");
  const [scenarioTextShown, setScenarioTextShown] = useState("");

  const orderedResponses = useMemo(() => {
    const session = getStoredSession();
    return Object.values(session.responses || {}).sort((a, b) => {
      if (a.phaseNumber !== b.phaseNumber) {
        return a.phaseNumber - b.phaseNumber;
      }
      return (a.submittedAt || "").localeCompare(b.submittedAt || "");
    });
  }, [stageId]);

  useEffect(() => {
    if (!stage) return;

    const session = getStoredSession();
    const existing = session.responses?.[stage.id];

    if (existing) {
      setAnswers(existing.answers || {});
      setFeedback(existing.evaluation?.feedback || "");
      setDecision(existing.evaluation?.decision || null);
      setNextScenarioText(existing.evaluation?.nextScenarioText || "");
      setScenarioTextShown(existing.scenarioTextShown || stage.baseScenarioText);
      setHasSubmitted(Boolean(existing.evaluation));
      setError("");
      return;
    }

    const previousLinkedResponse = orderedResponses.find(
      (response) => response.evaluation?.nextStageId === stage.id,
    );

    setScenarioTextShown(
      previousLinkedResponse?.evaluation?.nextScenarioText || stage.baseScenarioText,
    );
    setAnswers({});
    setFeedback("");
    setDecision(null);
    setNextScenarioText("");
    setHasSubmitted(false);
    setError("");
  }, [stage, orderedResponses]);

  const isCompletionStage = stage?.id === "complete";

  const mergeOverallSeverity = (
    current?: SeverityType,
    incoming?: SeverityType,
  ): SeverityType => {
    const rank: Record<SeverityType, number> = {
      manageable: 1,
      elevated: 2,
      severe: 3,
    };

    const safeCurrent = current || "manageable";
    const safeIncoming = incoming || "manageable";

    return rank[safeIncoming] > rank[safeCurrent] ? safeIncoming : safeCurrent;
  };

  const handleSubmit = async () => {
    if (!stage) return;

    const combinedAnswer = Object.values(answers)
      .map((answer) => answer.trim())
      .filter(Boolean)
      .join("\n\n");

    if (!combinedAnswer) {
      setError("Please enter your response before submitting.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const session = getStoredSession();
      const previousResponse = orderedResponses[orderedResponses.length - 1];
      const previousDecision = previousResponse?.evaluation?.decision || "none";

      const res = await fetch("/api/evaluate-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          userAnswer: combinedAnswer,
          previousOutcome: previousDecision,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Failed to evaluate response.");
      }

      setFeedback(result.feedback || "");
      setDecision(result.decision || null);
      setNextScenarioText(result.nextScenarioText || "");
      setHasSubmitted(true);

      const updatedSession = {
        ...session,
        scenarioId: session.scenarioId || invasiveMusselScenario.id,
        currentStageId: stage.id,
        overallSeverity: mergeOverallSeverity(
          session.overallSeverity,
          result.scenarioSeverity,
        ),
        responses: {
          ...(session.responses || {}),
          [stage.id]: {
            stageId: stage.id,
            phaseNumber: stage.phaseNumber,
            answers,
            combinedAnswer,
            scenarioTextShown,
            submittedAt: new Date().toISOString(),
            evaluation: {
              score: result.score,
              matchedCriteriaIds: result.matchedCriteriaIds,
              missingRequiredCriteriaIds: result.missingRequiredCriteriaIds,
              feedback: result.feedback,
              decision: result.decision,
              scenarioSeverity: result.scenarioSeverity,
              nextScenarioText: result.nextScenarioText,
              nextStageId: result.nextStageId,
              branchReason: result.branchReason,
              strengths: result.strengths || [],
              missedThemes: result.missedThemes || [],
              missedCriteriaTexts: result.missedCriteriaTexts || [],
            },
          },
        },
      };

      saveStoredSession(updatedSession);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStage = () => {
    if (!stage) return;

    if (isCompletionStage) {
      const summaryUrl = sessionCode
        ? `/simulation/demo/summary?session=${sessionCode}`
        : "/simulation/demo/summary";

      router.push(summaryUrl);
      return;
    }

    const session = getStoredSession();
    const currentResponse = session.responses?.[stage.id];
    const nextStageId = currentResponse?.evaluation?.nextStageId;

    if (!nextStageId) {
      const summaryUrl = sessionCode
        ? `/simulation/demo/summary?session=${sessionCode}`
        : "/simulation/demo/summary";

      router.push(summaryUrl);
      return;
    }

    saveStoredSession({
      ...session,
      currentStageId: nextStageId,
    });

    const nextUrl = sessionCode
      ? `/simulation/demo/stage/${nextStageId}?session=${sessionCode}`
      : `/simulation/demo/stage/${nextStageId}`;

    router.push(nextUrl);
  };

  if (!stage) {
    return <main className="p-8">Stage not found.</main>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="bg-cyan-600 text-white">Simulation</Badge>
            <Badge variant="outline">
              {isCompletionStage
                ? "Final Reflection"
                : `Phase ${stage.phaseNumber}`}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700">
              {stage.timeframe}
            </Badge>
            {sessionCode && (
              <Badge className="bg-indigo-100 text-indigo-700">
                Session: {sessionCode}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-semibold text-slate-900">
            {stage.title}
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>
                {isCompletionStage ? "Final Reflection" : "Situation"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-2xl border bg-slate-50/70 p-5">
                <p className="text-sm leading-7 text-slate-700">
                  {scenarioTextShown}
                </p>
              </div>

              {stage.questions.map((q, index) => (
                <div key={q.id} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900">
                    Question {index + 1}
                  </label>
                  <p className="text-sm text-slate-600">{q.text}</p>
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                    rows={8}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                    placeholder={q.placeholder}
                    disabled={isSubmitting || hasSubmitted}
                  />
                </div>
              ))}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {feedback && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <h3 className="mb-2 font-semibold text-emerald-800">
                    Feedback
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-700">
                    {feedback}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/scenario/invasive-mussel")}
                >
                  Back to Scenario
                </Button>

                {!hasSubmitted ? (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting
                      ? "Evaluating..."
                      : isCompletionStage
                        ? "Submit Final Reflection"
                        : "Submit Response"}
                  </Button>
                ) : (
                  <Button onClick={handleNextStage}>
                    {isCompletionStage ? "View Final Summary" : "Next Stage"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>How this works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  Your answer is evaluated against hidden operational criteria.
                </p>
                <p>
                  The simulation always moves forward, but the next stage can
                  branch into a more controlled or more pressured consequence
                  pathway depending on what your response covered.
                </p>
                <p>
                  Feedback is shown after each answer so you can understand what
                  was covered well and what important actions were missing.
                </p>
              </CardContent>
            </Card>

            {sessionCode && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Session Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  <p>
                    You are participating in shared session{" "}
                    <strong>{sessionCode}</strong>.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}