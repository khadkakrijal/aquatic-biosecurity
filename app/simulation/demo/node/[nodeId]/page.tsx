"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";
import { getStoredSession, saveStoredSession } from "@/app/lib/session-storage";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NodePage() {
  const params = useParams<{ nodeId: string }>();
  const router = useRouter();

  const node = invasiveMusselScenario.nodes.find((n) => n.id === params.nodeId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [nextNodeId, setNextNodeId] = useState<string | null>(null);
  const [decision, setDecision] = useState<"pass" | "partial" | "fail" | null>(
    null
  );

  if (!node) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-3xl border-red-100 bg-white/80 shadow-sm backdrop-blur">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-semibold text-slate-900">
                Node not found
              </h1>
              <p className="mt-3 text-sm text-slate-600">
                The requested simulation step could not be loaded.
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push("/scenario/invasive-mussel")}>
                  Back to Scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const isSameNode = nextNodeId === node.id;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setFeedback("");
    setHasSubmitted(false);
    setNextNodeId(null);
    setDecision(null);

    const combinedAnswer = Object.values(answers)
      .map((answer) => answer.trim())
      .filter(Boolean)
      .join("\n\n");

    if (!combinedAnswer) {
      setError("Please enter your response before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/evaluate-node", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          node,
          userAnswer: combinedAnswer,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Failed to evaluate response.");
      }

      setFeedback(result.feedback || "");
      setNextNodeId(result.nextNodeId || null);
      setDecision(result.decision || null);
      setHasSubmitted(true);

      const session = getStoredSession();

      const updatedSession = {
        ...session,
        scenarioId: session?.scenarioId || invasiveMusselScenario.id,
        currentNodeId: node.id,
        startedAt: session?.startedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: {
          ...(session?.responses || {}),
          [node.id]: {
            nodeId: node.id,
            phaseNumber: node.phaseNumber,
            answers,
            combinedAnswer,
            evaluation: {
              score: result.score,
              matchedCriteriaIds: result.matchedCriteriaIds,
              missingRequiredCriteriaIds: result.missingRequiredCriteriaIds,
              feedback: result.feedback,
              decision: result.decision,
            },
            nextNodeId: result.nextNodeId,
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

  const handleContinue = () => {
    if (!nextNodeId) return;

    if (nextNodeId === node.id) {
      setError(
        "You are still in the current stage. Please revise your response using the feedback before continuing."
      );
      return;
    }

    const session = getStoredSession();

    const updatedSession = {
      ...session,
      currentNodeId: nextNodeId,
      updatedAt: new Date().toISOString(),
    };

    saveStoredSession(updatedSession);
    router.push(`/simulation/demo/node/${nextNodeId}`);
  };

  const handleRevise = () => {
    setFeedback("");
    setError("");
    setHasSubmitted(false);
    setNextNodeId(null);
    setDecision(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-cyan-600 text-white hover:bg-cyan-600">
              Simulation Node
            </Badge>
            <Badge variant="outline">Phase {node.phaseNumber}</Badge>
            <Badge
              className={`capitalize ${
                node.kind === "main"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                  : node.kind === "remedial"
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
              }`}
            >
              {node.kind}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
              {node.timeframe}
            </Badge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {node.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Review the situation carefully and describe what you would do next.
              Your response will be evaluated against key operational themes.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-white/60 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-900">Situation</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-sm leading-7 text-slate-700 sm:text-base">
                  {node.scenarioText}
                </p>
              </div>

              <div className="space-y-5">
                {node.questions.map((q, index) => (
                  <div key={q.id} className="space-y-2">
                    <label
                      htmlFor={q.id}
                      className="block text-sm font-medium text-slate-900"
                    >
                      Question {index + 1}
                    </label>
                    <p className="text-sm text-slate-600">{q.text}</p>
                    <textarea
                      id={q.id}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder={q.placeholder || "Write your response here..."}
                      rows={8}
                      disabled={isSubmitting}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:opacity-70 sm:text-base"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {feedback && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <h3 className="mb-2 font-semibold text-emerald-800">
                    AI Feedback
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-7 text-emerald-700">
                    {feedback}
                  </p>

                  {decision && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Badge
                        className={`capitalize ${
                          decision === "pass"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : decision === "partial"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        Result: {decision}
                      </Badge>
                    </div>
                  )}

                  {hasSubmitted && isSameNode && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      You have not met the requirements to move forward yet.
                      Please revise your response using the feedback above and
                      submit again.
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => router.push("/scenario/invasive-mussel")}
                  disabled={isSubmitting}
                >
                  Back to Scenario
                </Button>

                {!hasSubmitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-white hover:from-cyan-700 hover:to-blue-700"
                  >
                    {isSubmitting ? "Evaluating Response..." : "Submit Response"}
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={handleRevise}
                    >
                      Revise Response
                    </Button>

                    {!isSameNode && nextNodeId ? (
                      <Button
                        onClick={handleContinue}
                        className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-white hover:from-cyan-700 hover:to-blue-700"
                      >
                        Continue to Next Stage
                      </Button>
                    ) : (
                      <Button disabled className="rounded-2xl px-6">
                        Improve Response to Progress
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900">
                  Response Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  Focus on what you would do operationally at this stage of the
                  incident.
                </p>
                <p>
                  Consider themes such as reporting, surveillance, containment,
                  coordination, communication, and stakeholder engagement.
                </p>
                <p>
                  Use clear and practical actions rather than very short answers.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900">
                  How progression works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  Your answer is evaluated against key criteria for this phase.
                </p>
                <p>
                  Strong responses move you forward, while incomplete responses
                  may lead to review or escalation pathways.
                </p>
                <p>You will not see all future phases in advance.</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900">
                  Current phase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    Phase {node.phaseNumber}
                  </p>
                  <p className="mt-1">{node.title}</p>
                  <p className="mt-2 text-slate-600">{node.timeframe}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}