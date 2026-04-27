"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getStoredSession, saveStoredSession } from "@/app/lib/session-storage";
import {
  Scenario,
  ScenarioSeverity,
  ScenarioStage,
} from "@/app/types/simulation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  saveStageAttemptAction,
  startSimulationAttemptAction,
} from "@/app/actions/simulation-attempts";

type DecisionType = "strong" | "mixed" | "limited";

interface StagePageClientProps {
  scenario: Scenario;
  stage: ScenarioStage;
}

export default function StagePageClient({
  scenario,
  stage,
}: StagePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionCode = searchParams.get("session");

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
    return Object.values(session.responses || {}).sort((a: any, b: any) => {
      if (a.phaseNumber !== b.phaseNumber) {
        return a.phaseNumber - b.phaseNumber;
      }
      return (a.submittedAt || "").localeCompare(b.submittedAt || "");
    });
  }, [stage.id]);

  useEffect(() => {
    const initialiseAttempt = async () => {
      try {
        const session = getStoredSession();

        if (!session.attemptId) {
          const firstStage = scenario.stages
            .filter((item) => item.phaseNumber === 1)
            .sort((a, b) => a.id.localeCompare(b.id))[0];

          const attempt = await startSimulationAttemptAction({
            scenarioSlug: scenario.slug,
            firstStageId: firstStage?.id || stage.id,
            totalStages: 6,
          });

          saveStoredSession({
            ...session,
            attemptId: attempt.id,
            scenarioId: scenario.id,
            scenarioSlug: scenario.slug,
            scenarioTitle: scenario.title,
            currentStageId: session.currentStageId || stage.id,
            startedAt: session.startedAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            responses: session.responses || {},
          });
        }
      } catch (err) {
        console.error("Failed to initialise attempt", err);
      }
    };

    initialiseAttempt();
  }, [scenario, stage.id]);

  useEffect(() => {
    const session = getStoredSession();
    const existing = session.responses?.[stage.id];

    if (existing) {
      setAnswers(existing.answers || {});
      setFeedback(existing.evaluation?.feedback || "");
      setDecision(existing.evaluation?.decision || null);
      setNextScenarioText(existing.evaluation?.nextScenarioText || "");
      setScenarioTextShown(
        existing.scenarioTextShown || stage.baseScenarioText,
      );
      setHasSubmitted(Boolean(existing.evaluation));
      setError("");
      return;
    }

    const previousLinkedResponse = orderedResponses.find(
      (response: any) => response.evaluation?.nextStageId === stage.id,
    );

    setScenarioTextShown(
      previousLinkedResponse?.evaluation?.nextScenarioText ||
        stage.baseScenarioText,
    );
    setAnswers({});
    setFeedback("");
    setDecision(null);
    setNextScenarioText("");
    setHasSubmitted(false);
    setError("");
  }, [stage, orderedResponses]);

  const isCompletionStage = stage.id === "complete";

  const mergeOverallSeverity = (
    current?: ScenarioSeverity,
    incoming?: ScenarioSeverity,
  ): ScenarioSeverity => {
    const rank: Record<ScenarioSeverity, number> = {
      manageable: 1,
      elevated: 2,
      severe: 3,
    };

    const safeCurrent = current || "manageable";
    const safeIncoming = incoming || "manageable";

    return rank[safeIncoming] > rank[safeCurrent] ? safeIncoming : safeCurrent;
  };

  const handleSubmit = async () => {
    if (!stage || isSubmitting || hasSubmitted) return;

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
      const previousResponse = orderedResponses[
        orderedResponses.length - 1
      ] as any;
      const previousDecision = previousResponse?.evaluation?.decision || "none";

      const res = await fetch("/api/evaluate-stage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        scenarioId: scenario.id,
        scenarioSlug: scenario.slug,
        scenarioTitle: scenario.title,
        currentStageId: stage.id,
        updatedAt: new Date().toISOString(),
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

      if (session.attemptId) {
        await saveStageAttemptAction({
          attemptId: session.attemptId,
          scenarioSlug: scenario.slug,
          stageId: stage.id,
          phaseNumber: stage.phaseNumber,
          answers,
          combinedAnswer,
          scenarioTextShown,
          decision: result.decision,
          feedback: result.feedback,
          scenarioSeverity: result.scenarioSeverity,
          nextScenarioText: result.nextScenarioText,
          nextStageId: result.nextStageId,
          branchReason: result.branchReason,
          matchedCriteriaIds: result.matchedCriteriaIds || [],
          missingRequiredCriteriaIds: result.missingRequiredCriteriaIds || [],
          strengths: result.strengths || [],
          missedThemes: result.missedThemes || [],
          missedCriteriaTexts: result.missedCriteriaTexts || [],
        });
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStage = () => {
    const summaryUrl = sessionCode
      ? `/simulation/demo/${scenario.slug}/summary?session=${sessionCode}`
      : `/simulation/demo/${scenario.slug}/summary`;

    if (isCompletionStage || stage.isTerminal) {
      router.push(summaryUrl);
      return;
    }

    const session = getStoredSession();
    const currentResponse = session.responses?.[stage.id];
    const nextStageId = currentResponse?.evaluation?.nextStageId;

    if (!nextStageId) {
      router.push(summaryUrl);
      return;
    }

    saveStoredSession({
      ...session,
      scenarioId: scenario.id,
      scenarioSlug: scenario.slug,
      scenarioTitle: scenario.title,
      currentStageId: nextStageId,
      updatedAt: new Date().toISOString(),
    });

    const nextUrl = sessionCode
      ? `/simulation/demo/${scenario.slug}/stage/${nextStageId}?session=${sessionCode}`
      : `/simulation/demo/${scenario.slug}/stage/${nextStageId}`;

    router.push(nextUrl);
  };

  const handleBackToStart = () => {
    const firstStage = scenario.stages
      .filter((item) => item.phaseNumber === 1)
      .sort((a, b) => a.id.localeCompare(b.id))[0];

    if (!firstStage) return;

    const url = sessionCode
      ? `/simulation/demo/${scenario.slug}/stage/${firstStage.id}?session=${sessionCode}`
      : `/simulation/demo/${scenario.slug}/stage/${firstStage.id}`;

    router.push(url);
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(6,12,28,0.9), rgba(8,48,73,0.65), rgba(17,24,39,0.92)), url('/biosecurity-bg.png')",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border-0 bg-cyan-500 text-white max-w-full overflow-hidden whitespace-nowrap">
              <span className="inline-block animate-[marquee_20s_linear_infinite]">
                {scenario.title}
              </span>
            </Badge>

            <Badge className="border border-white/20 bg-white/10 text-white">
              {isCompletionStage
                ? "Final Reflection"
                : `Phase ${stage.phaseNumber}`}
            </Badge>

            {stage.timeframe && (
              <Badge className="border border-cyan-200/30 bg-cyan-500/20 text-cyan-100">
                {stage.timeframe}
              </Badge>
            )}

            {sessionCode && (
              <Badge className="border border-indigo-200/30 bg-indigo-500/20 text-indigo-100">
                Session: {sessionCode}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {stage.title}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
            Read the situation carefully and provide your response based on the
            operational priorities you would consider in this phase.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="rounded-3xl border-0 bg-white/95 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900">
                {isCompletionStage ? "Final Reflection" : "Situation"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
                <p className="text-sm leading-7 text-slate-700">
                  {scenarioTextShown}
                </p>
              </div>

              {stage.questions.map((q, index) => (
                <div key={q.id} className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Question {index + 1}
                  </label>

                  <p className="text-sm leading-6 text-slate-600">{q.text}</p>

                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                    rows={8}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:bg-slate-100"
                    placeholder={q.placeholder || "Write your response here..."}
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
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <h3 className="mb-2 font-semibold text-emerald-900">
                    Feedback
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-800">
                    {feedback}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleBackToStart}
                  className="rounded-2xl border-cyan-200 bg-white px-5 py-2.5 text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-50"
                >
                  Back to Start
                </Button>

                {!hasSubmitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-2xl bg-cyan-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Evaluating..."
                      : isCompletionStage
                        ? "Submit Final Reflection"
                        : "Submit Response"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextStage}
                    className="rounded-2xl bg-cyan-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg"
                  >
                    {isCompletionStage ? "View Final Summary" : "Next Stage"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-slate-900">How this works</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  Your response is evaluated against hidden operational
                  criteria.
                </div>

                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                  The simulation continues forward, but your response can guide
                  it into a more controlled or more pressured pathway.
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  Feedback is shown after submission so you can review strengths
                  and gaps before moving forward.
                </div>
              </CardContent>
            </Card>

            {sessionCode && (
              <Card className="rounded-3xl border-0 bg-white/95 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-slate-900">Session Info</CardTitle>
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
