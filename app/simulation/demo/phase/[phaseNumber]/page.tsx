"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, ShieldCheck, Waves } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  buildPhaseResponse,
  getPhaseByNumber,
  updateSession,
} from "@/app/lib/simulation-engine";
import {
  getStoredSession,
  resetStoredSession,
  saveStoredSession,
} from "@/app/lib/session-storage";
import { CriticalCriteriaList } from "@/app/components/simulation/CriticalCriteriaList";
import { DecisionPanel } from "@/app/components/simulation/DecisionPanel";
import { PhaseHeader } from "@/app/components/simulation/PhaseHeader";
import { ReflectionQuestions } from "@/app/components/simulation/ReflectionQuestions";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";
import { ConsequenceAlert } from "@/app/components/simulation/ConsequenceAlert";

export default function PhasePage() {
  const params = useParams<{ phaseNumber: string }>();
  const router = useRouter();

  const phaseNumber = Number(params.phaseNumber);
  const phase = getPhaseByNumber(phaseNumber);

  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedDecisionId, setSelectedDecisionId] = useState("");
  const [submittedConsequences, setSubmittedConsequences] = useState<string[]>(
    [],
  );

  useEffect(() => {
    if (!phase) return;
    const session = getStoredSession();
    const existing = session.responses[phase.phaseNumber];

    if (existing) {
      setSelectedCriteriaIds(existing.selectedCriteriaIds);
      setAnswers(existing.answers);
      setSelectedDecisionId(existing.selectedDecisionId);
      setSubmittedConsequences(existing.missedConsequences);
    } else {
      setSelectedCriteriaIds([]);
      setAnswers({});
      setSelectedDecisionId("");
      setSubmittedConsequences([]);
    }
  }, [phase?.phaseNumber]);

  const progress = useMemo(() => (phaseNumber / 6) * 100, [phaseNumber]);

  if (!phase) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-sm backdrop-blur-md">
          <p className="text-lg font-medium text-slate-700">Phase not found.</p>
        </div>
      </main>
    );
  }

  const handleCriterionToggle = (criterionId: string, checked: boolean) => {
    setSelectedCriteriaIds((prev) =>
      checked
        ? [...prev, criterionId]
        : prev.filter((id) => id !== criterionId),
    );
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedDecisionId) return;

    const session = getStoredSession();

    const response = buildPhaseResponse({
      phase,
      selectedCriteriaIds,
      answers,
      selectedDecisionId,
    });

    const updated = updateSession(session, response);
    saveStoredSession(updated);
    setSubmittedConsequences(response.missedConsequences);

    if (phase.phaseNumber < 6) {
      router.push(`/simulation/demo/phase/${phase.phaseNumber + 1}`);
      return;
    }

    router.push("/simulation/demo/summary");
  };

  const handleReset = () => {
    resetStoredSession();
    router.push("/simulation/demo/phase/1");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-cyan-50">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-3xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Waves className="h-4 w-4 text-cyan-600" />
                Aquatic Biosecurity Emergency Simulation
              </div>
              <Progress value={progress} className="h-3" />
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <p>
                  Progress:{" "}
                  <span className="font-medium text-slate-900">
                    Phase {phaseNumber} of 6
                  </span>
                </p>
                <p className="font-medium text-cyan-700">
                  {Math.round(progress)}% completed
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-2xl border-slate-300 bg-white/80 px-5 py-5 shadow-sm backdrop-blur transition-all duration-300 hover:bg-white hover:shadow-md"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Demo
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-white/60 bg-white/75 shadow-sm backdrop-blur-md">
              <CardHeader>
                <PhaseHeader
                  phaseNumber={phase.phaseNumber}
                  title={phase.title}
                  timeframe={phase.timeframe}
                />
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl bg-slate-50/80 p-5">
                  <p className="text-sm leading-8 text-slate-600">
                    {phase.scenarioText}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/60 bg-white/75 shadow-sm backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Critical criteria participants should identify
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CriticalCriteriaList
                  criteria={phase.criteria}
                  selectedCriteriaIds={selectedCriteriaIds}
                  onToggle={handleCriterionToggle}
                />
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/60 bg-white/75 shadow-sm backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Guided reflection questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReflectionQuestions
                  questions={phase.questions}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-white/60 bg-white/80 shadow-sm backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl">Main action decision</CardTitle>
              </CardHeader>
              <CardContent>
                <DecisionPanel
                  options={phase.decisionOptions}
                  selectedDecisionId={selectedDecisionId}
                  onSelect={setSelectedDecisionId}
                />
                <div className="mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedDecisionId}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 py-6 text-base font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:from-blue-700 hover:via-cyan-600 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {phaseNumber === 6
                      ? "Finish simulation"
                      : "Save and continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ConsequenceAlert missedConsequences={submittedConsequences} />

            <Card className="rounded-3xl border-white/60 bg-gradient-to-br from-white to-blue-50/70 shadow-sm backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Phase notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-slate-600">
                <p>
                  • Missing criteria will appear as consequence risks in the
                  final report.
                </p>
                <p>• Decisions affect impact quality and preparedness score.</p>
                <p>
                  • This prototype uses fixed phase progression with consequence
                  accumulation.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/60 bg-gradient-to-br from-white to-cyan-50/70 shadow-sm backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl">Scenario title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-slate-600">
                  {invasiveMusselScenario.title}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
