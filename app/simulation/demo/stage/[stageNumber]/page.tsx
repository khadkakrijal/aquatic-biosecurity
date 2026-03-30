"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";
import { getStoredSession, saveStoredSession } from "@/app/lib/session-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DecisionType = "pass" | "partial" | "fail";

export default function StagePage() {
  const params = useParams<{ stageNumber: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionCode = searchParams.get("session");

  const stageNumber = Number(params.stageNumber);
  const stage = invasiveMusselScenario.stages.find(
    (s) =>
      s.phaseNumber === stageNumber ||
      (stageNumber === 7 && s.id === "complete"),
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [decision, setDecision] = useState<DecisionType | null>(null);
  const [nextScenarioText, setNextScenarioText] = useState("");
  const [scenarioTextShown, setScenarioTextShown] = useState("");

  useEffect(() => {
    if (!stage) return;

    const session = getStoredSession();
    const existing = session.responses?.[stage.phaseNumber];

    if (existing) {
      setAnswers(existing.answers || {});
      setFeedback(existing.evaluation?.feedback || "");
      setDecision(existing.evaluation?.decision || null);
      setNextScenarioText(existing.evaluation?.nextScenarioText || "");
      setScenarioTextShown(
        existing.scenarioTextShown || stage.baseScenarioText,
      );
      setHasSubmitted(Boolean(existing.evaluation));
    } else {
      const previous = session.responses?.[stage.phaseNumber - 1];
      setScenarioTextShown(
        previous?.evaluation?.nextScenarioText || stage.baseScenarioText,
      );
      setAnswers({});
      setFeedback("");
      setDecision(null);
      setNextScenarioText("");
      setHasSubmitted(false);
    }

    setError("");
  }, [stage]);

  const isCompletionStage = stage?.id === "complete";

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
      const previousDecision =
        session.responses?.[stage.phaseNumber - 1]?.evaluation?.decision ||
        "none";

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
        currentStageNumber: stage.phaseNumber,
        responses: {
          ...(session.responses || {}),
          [stage.phaseNumber]: {
            stageId: stage.id,
            phaseNumber: stage.phaseNumber,
            answers,
            combinedAnswer,
            scenarioTextShown,
            evaluation: {
              score: result.score,
              matchedCriteriaIds: result.matchedCriteriaIds,
              missingRequiredCriteriaIds: result.missingRequiredCriteriaIds,
              feedback: result.feedback,
              decision: result.decision,
              scenarioSeverity: result.scenarioSeverity,
              nextScenarioText: result.nextScenarioText,
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

    const nextStageNumber = stage.phaseNumber + 1;
    const session = getStoredSession();

    saveStoredSession({
      ...session,
      currentStageNumber: nextStageNumber,
    });

    const nextUrl =
      nextStageNumber <= 6
        ? sessionCode
          ? `/simulation/demo/stage/${nextStageNumber}?session=${sessionCode}`
          : `/simulation/demo/stage/${nextStageNumber}`
        : sessionCode
          ? `/simulation/demo/stage/7?session=${sessionCode}`
          : "/simulation/demo/stage/7";

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

                  {decision && (
                    <div className="mt-3">
                      <Badge className="capitalize">Result: {decision}</Badge>
                    </div>
                  )}
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
                  Your answer is evaluated against hidden key operational
                  criteria.
                </p>
                <p>
                  The next stage always continues, but the scenario may become
                  more stable, more pressured, or more severe depending on your
                  response.
                </p>
                <p>
                  Feedback is shown after each answer so you understand how your
                  response affected the simulation.
                </p>
                <p>
                   The meeting stays available in the g window while the
                  simulation continues.
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
