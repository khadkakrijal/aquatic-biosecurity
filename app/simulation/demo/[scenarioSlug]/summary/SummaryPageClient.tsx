"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  getStoredSession,
  resetStoredSession,
  saveStoredSession,
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
import { completeSimulationAttemptAction } from "@/app/actions/simulation-attempts";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

interface StageResponse {
  stageId: string;
  phaseNumber: number;
  answers: Record<string, string>;
  combinedAnswer: string;
  scenarioTextShown: string;
  submittedAt?: string;
  evaluation?: {
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

const BACKGROUND_STYLE = {
  backgroundImage:
    "linear-gradient(135deg, rgba(6,12,28,0.9), rgba(8,48,73,0.65), rgba(17,24,39,0.92)), url('/biosecurity-bg.png')",
};

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];
const THEME_BAR_COLOR = "#06b6d4";
const COVERAGE_BAR_COLOR = "#2563eb";

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
}

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
    <Card className="report-card rounded-3xl border-0 bg-white/95 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center overflow-x-auto">{children}</div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card className="report-card rounded-3xl border-0 bg-white/95 shadow-2xl">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function SummaryPageClient({
  scenario,
}: SummaryPageClientProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, StageResponse>>({});
  const [loading, setLoading] = useState(true);

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
        branchFamily: stage?.branchFamily || "main",
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

  const coverageTrend = useMemo(() => {
    return stageResponses.map((response) => ({
      phase: `P${response.phaseNumber}`,
      matched: response.evaluation?.matchedCriteriaIds?.length || 0,
      missed: response.evaluation?.missingRequiredCriteriaIds?.length || 0,
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

  const localSummary = useMemo(() => {
    const topGaps = repeatedGaps.slice(0, 3).map((gap) => gap.text);
    const topThemes = repeatedThemes.slice(0, 3).map((theme) => theme.theme);

    const decisionCounts = {
      strong:
        decisionBreakdown.find((item) => item.name === "Strong")?.value || 0,
      mixed:
        decisionBreakdown.find((item) => item.name === "Mixed")?.value || 0,
      limited:
        decisionBreakdown.find((item) => item.name === "Limited")?.value || 0,
    };

    let overallPerformance =
      "Overall, the exercise shows a mixed level of preparedness. Some responses included relevant actions, but there were also areas where the response needed clearer planning, stronger coordination, and more complete operational detail.";

    if (
      decisionCounts.strong > decisionCounts.mixed &&
      decisionCounts.strong > decisionCounts.limited
    ) {
      overallPerformance =
        "Overall, the exercise shows a strong level of preparedness. Most responses demonstrated clear thinking, relevant actions, and a practical understanding of how to manage the situation as it developed.";
    } else if (
      decisionCounts.limited >= decisionCounts.strong &&
      decisionCounts.limited >= decisionCounts.mixed
    ) {
      overallPerformance =
        "Overall, the exercise shows that preparedness needs further development. Several responses were too general or incomplete, which could create uncertainty during a real response situation.";
    }

    const criteriaSummary = `Across ${stageResponses.length} completed phase${
      stageResponses.length === 1 ? "" : "s"
    }, the response matched ${totalMatchedCriteria} expected criteria and missed ${totalMissedRequired} required criteria. The overall incident severity reached "${overallSeverity}", which indicates the level of pressure created by the decisions and gaps across the scenario.`;

    const gapSummary = topGaps.length
      ? `The most repeated gaps were: ${topGaps.join(", ")}. These areas should be reviewed because repeated gaps usually show where response planning, role clarity, or operational confidence may need improvement.`
      : "No repeated gaps were clearly identified across the completed phases, which suggests that missed criteria were either minimal or not repeated consistently.";

    const themeSummary = topThemes.length
      ? `The most affected themes were: ${topThemes.join(", ")}. These themes highlight the main areas where future training, planning, or discussion may be useful.`
      : "No repeated missed themes were clearly identified, which means there was no single theme that consistently appeared as a weakness.";

    const recommendation =
      "The main improvement priority is to make future responses more specific, structured, and action-focused. A stronger response should clearly explain what action will be taken, who should be involved, how information will be communicated, and how the situation will be monitored as it changes.";

    return `${overallPerformance}\n\n${criteriaSummary}\n\n${gapSummary}\n\n${themeSummary}\n\n${recommendation}`;
  }, [
    decisionBreakdown,
    overallSeverity,
    repeatedGaps,
    repeatedThemes,
    stageResponses.length,
    totalMatchedCriteria,
    totalMissedRequired,
  ]);

  useEffect(() => {
    const syncCompletion = async () => {
      try {
        const session = getStoredSession();

        if (!session.attemptId || session.completedAt) return;

        await completeSimulationAttemptAction({
          attemptId: session.attemptId,
          finalSummary: localSummary,
          overallSeverity,
        });

        saveStoredSession({
          ...session,
          completedAt: new Date().toISOString(),
          finalSummary: localSummary,
          overallSeverity,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to complete simulation attempt", error);
      }
    };

    if (!loading && stageResponses.length > 0) {
      syncCompletion();
    }
  }, [loading, localSummary, overallSeverity, stageResponses.length]);

  const firstStage = useMemo(() => {
    return scenario.stages
      .filter((item) => item.phaseNumber === 1)
      .sort((a, b) => a.id.localeCompare(b.id))[0];
  }, [scenario.stages]);

  const handleDownloadReport = async () => {
    const result = await Swal.fire({
      title: "Download report?",
      text: "A PDF report with summary and visual bars will be downloaded.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Download PDF",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0891b2",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      const addPageIfNeeded = (extraHeight = 10) => {
        if (y + extraHeight > pageHeight - margin) {
          pdf.addPage();
          y = 18;
        }
      };

      const addTitle = (text: string) => {
        addPageIfNeeded(14);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(text, margin, y);
        y += 10;
      };

      const addSectionTitle = (text: string) => {
        addPageIfNeeded(12);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(text, margin, y);
        y += 7;
      };

      const addParagraph = (text: string) => {
        if (!text?.trim()) return;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        const lines = pdf.splitTextToSize(text, contentWidth);

        lines.forEach((line: string) => {
          addPageIfNeeded(6);
          pdf.text(line, margin, y);
          y += 5;
        });

        y += 3;
      };

      const addKeyValue = (label: string, value: string | number) => {
        addPageIfNeeded(7);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text(`${label}:`, margin, y);

        pdf.setFont("helvetica", "normal");
        pdf.text(String(value), margin + 50, y);
        y += 6;
      };

      const addCriteriaBarChart = () => {
        addSectionTitle("Criteria Coverage Visual Summary");

        if (!coverageTrend.length) {
          addParagraph("No criteria coverage data was available.");
          return;
        }

        addParagraph(
          "The green bar shows matched criteria. The orange bar shows missed required criteria for each completed phase.",
        );

        const maxValue = Math.max(
          1,
          ...coverageTrend.map((item) => Math.max(item.matched, item.missed)),
        );

        const labelWidth = 25;
        const barMaxWidth = contentWidth - labelWidth - 35;
        const barHeight = 5;

        coverageTrend.forEach((item) => {
          addPageIfNeeded(22);

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text(item.phase, margin, y);

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);

          const matchedWidth = (item.matched / maxValue) * barMaxWidth;
          const missedWidth = (item.missed / maxValue) * barMaxWidth;

          pdf.text("Matched", margin + labelWidth, y);

          pdf.setFillColor(16, 185, 129);
          pdf.rect(
            margin + labelWidth + 22,
            y - 4,
            matchedWidth,
            barHeight,
            "F",
          );

          pdf.setTextColor(30, 41, 59);
          pdf.text(
            String(item.matched),
            margin + labelWidth + 25 + matchedWidth,
            y,
          );

          y += 8;

          pdf.text("Missed", margin + labelWidth, y);

          pdf.setFillColor(245, 158, 11);
          pdf.rect(
            margin + labelWidth + 22,
            y - 4,
            missedWidth,
            barHeight,
            "F",
          );

          pdf.setTextColor(30, 41, 59);
          pdf.text(
            String(item.missed),
            margin + labelWidth + 25 + missedWidth,
            y,
          );

          y += 10;
        });

        y += 3;
      };

      const addDecisionBreakdownBars = () => {
        addSectionTitle("Response Quality Visual Summary");

        if (!decisionBreakdown.length) {
          addParagraph("No response quality data was available.");
          return;
        }

        addParagraph(
          "This section shows how many responses were rated strong, mixed, or limited.",
        );

        const maxValue = Math.max(
          1,
          ...decisionBreakdown.map((item) => item.value),
        );
        const labelWidth = 25;
        const barMaxWidth = contentWidth - labelWidth - 30;
        const barHeight = 6;

        decisionBreakdown.forEach((item) => {
          addPageIfNeeded(14);

          const barWidth = (item.value / maxValue) * barMaxWidth;

          if (item.name === "Strong") pdf.setFillColor(16, 185, 129);
          else if (item.name === "Mixed") pdf.setFillColor(245, 158, 11);
          else pdf.setFillColor(239, 68, 68);

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(30, 41, 59);
          pdf.text(item.name, margin, y);

          pdf.rect(margin + labelWidth, y - 5, barWidth, barHeight, "F");

          pdf.setFont("helvetica", "normal");
          pdf.text(String(item.value), margin + labelWidth + barWidth + 4, y);

          y += 10;
        });

        y += 3;
      };

      const safeFileName = scenario.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      addTitle("Biosecurity Simulation Report");

      addKeyValue("Scenario", scenario.title);
      addKeyValue("Generated date", new Date().toLocaleString());
      addKeyValue("Completed phases", stageResponses.length);
      addKeyValue("Overall severity", overallSeverity);
      addKeyValue("Matched criteria", totalMatchedCriteria);
      addKeyValue("Missed required criteria", totalMissedRequired);
      addKeyValue("Final reflection", reflectionResponse ? "Yes" : "No");

      y += 4;

      addSectionTitle("Preparedness Summary");
      localSummary.split("\n\n").forEach((paragraph) => {
        addParagraph(paragraph);
      });

      addDecisionBreakdownBars();
      addCriteriaBarChart();

      addSectionTitle("Path Through the Exercise");

      if (visitedPath.length > 0) {
        visitedPath.forEach((item, index) => {
          addParagraph(
            `${index + 1}. Phase ${item.phaseNumber} — ${item.title} (${item.branchFamily}, ${item.decision})`,
          );
        });
      } else {
        addParagraph("No pathway data was recorded.");
      }

      if (repeatedGaps.length > 0) {
        addSectionTitle("Most Repeated Gaps");

        repeatedGaps.forEach((gap, index) => {
          addParagraph(
            `${index + 1}. ${gap.text}${gap.count > 1 ? ` (${gap.count} times)` : ""}`,
          );
        });
      }

      if (reflectionResponse) {
        addSectionTitle("Final Reflection");
        addParagraph(reflectionResponse.combinedAnswer);
      }

      addSectionTitle("Phase-by-Phase Details");

      stageResponses.forEach((response) => {
        const stage = scenario.stages.find(
          (item) => item.id === response.stageId,
        );

        addSectionTitle(
          `Phase ${response.phaseNumber} — ${stage?.title || response.stageId}`,
        );

        addKeyValue(
          "Decision",
          response.evaluation?.decision || "Not recorded",
        );
        addKeyValue(
          "Severity",
          response.evaluation?.scenarioSeverity || "Not recorded",
        );

        addParagraph(`Situation shown: ${response.scenarioTextShown}`);

        const stageQuestions = stage?.questions || [];

        if (stageQuestions.length > 0) {
          stageQuestions.forEach((question, index) => {
            addParagraph(
              `Question ${index + 1}: ${question.text}\nAnswer: ${
                response.answers?.[question.id]?.trim() || "No answer recorded."
              }`,
            );
          });
        } else {
          addParagraph(`Response: ${response.combinedAnswer}`);
        }

        if (response.evaluation?.feedback) {
          addParagraph(`Feedback: ${response.evaluation.feedback}`);
        }

        if (response.evaluation?.branchReason && response.phaseNumber > 1) {
          addParagraph(`Branch reason: ${response.evaluation.branchReason}`);
        }

        if (response.evaluation?.strengths?.length) {
          addParagraph(
            `What was covered well: ${response.evaluation.strengths.join(", ")}`,
          );
        }

        if (response.evaluation?.missedCriteriaTexts?.length) {
          addParagraph(
            `Main gaps: ${response.evaluation.missedCriteriaTexts.join(", ")}`,
          );
        }

        y += 3;
      });

      const pageCount = pdf.getNumberOfPages();

      for (let i = 1; i <= pageCount; i += 1) {
        pdf.setPage(i);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin - 25,
          pageHeight - 8,
        );
      }

      pdf.save(`${safeFileName || "biosecurity-simulation"}-report.pdf`);

      Swal.fire({
        title: "Downloaded!",
        text: "The report has been downloaded successfully.",
        icon: "success",
        confirmButtonColor: "#0891b2",
      });
    } catch (error) {
      console.error("PDF generation error:", error);

      Swal.fire({
        title: "Download failed",
        text: "The report could not be generated. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleRestart = () => {
    resetStoredSession();
    router.push("/scenario");
  };

  const handleBackToStart = () => {
    resetStoredSession();
    router.push("/scenario");
  };

  const getSeverityBadgeClass = (severity?: ScenarioSeverity) => {
    switch (severity) {
      case "manageable":
        return "border-0 bg-emerald-500 text-white";
      case "elevated":
        return "border-0 bg-orange-500 text-white";
      case "severe":
        return "border-0 bg-rose-600 text-white";
      default:
        return "border-0 bg-slate-200 text-slate-700";
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
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat p-8"
        style={BACKGROUND_STYLE}
      >
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/10 p-6 text-white backdrop-blur-md">
          <p className="text-sm text-slate-200">Loading summary...</p>
        </div>
      </main>
    );
  }

  if (!orderedResponses.length) {
    return (
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat p-8"
        style={BACKGROUND_STYLE}
      >
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-3xl border-0 bg-white/95 shadow-2xl">
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
                  className="rounded-2xl bg-cyan-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg"
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
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={BACKGROUND_STYLE}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
          }

          html,
          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          main {
            background: #ffffff !important;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            max-width: 100% !important;
            padding: 0 !important;
          }

          .print-header {
            background: #0f172a !important;
            color: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
          }

          .report-card {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            background: #ffffff !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .shadow-2xl,
          .shadow-lg,
          .shadow-md {
            box-shadow: none !important;
          }

          section,
          .rounded-3xl,
          .rounded-2xl {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          button {
            display: none !important;
          }
        }
      `}</style>

      <div className="print-container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="print-header mb-8 rounded-3xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border-0 bg-cyan-500 text-white">
              Simulation Summary
            </Badge>

            <Badge className="border border-white/20 bg-white/10 text-white">
              {scenario.title}
            </Badge>

            <Badge className={getSeverityBadgeClass(overallSeverity)}>
              Overall severity: {overallSeverity}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Final Exercise Summary
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
            This summary highlights response quality, repeated gaps, pathway
            progression, and the main learning points across the exercise.
          </p>

          <div className="no-print mt-5 flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadReport}
              className="rounded-2xl bg-cyan-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <SummaryCard title="Completed phases" value={stageResponses.length} />
          <SummaryCard title="Matched criteria" value={totalMatchedCriteria} />
          <SummaryCard
            title="Missed required criteria"
            value={totalMissedRequired}
          />
          <SummaryCard
            title="Final reflection"
            value={reflectionResponse ? "Yes" : "No"}
          />
        </section>

        <section className="grid items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="report-card h-full rounded-3xl border-0 bg-white/95 shadow-2xl">
            <CardHeader>
              <CardTitle>Preparedness Summary</CardTitle>
            </CardHeader>

            <CardContent className="h-full">
              <div className="h-full rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
                <div className="space-y-4 text-sm leading-7 text-slate-700">
                  {localSummary.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="report-card rounded-3xl border-0 bg-white/95 shadow-2xl">
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

              <div className="no-print flex flex-wrap gap-3 pt-3">
                <Button
                  variant="outline"
                  onClick={handleBackToStart}
                  className="rounded-2xl border-cyan-200 bg-white px-5 py-2.5 text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-50"
                >
                  Back to Start
                </Button>

                <Button
                  onClick={handleRestart}
                  className="rounded-2xl bg-cyan-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-lg"
                >
                  Restart Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
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
        </section>

        <section className="mt-6">
          <ChartCard
            title="Criteria Coverage by Phase"
            description="This chart compares matched criteria and missed required criteria across the completed phases."
          >
            {coverageTrend.length > 0 ? (
              <BarChart
                width={900}
                height={280}
                data={coverageTrend}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="matched"
                  fill={COVERAGE_BAR_COLOR}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="missed"
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <ChartEmptyState message="No criteria coverage data available yet." />
            )}
          </ChartCard>
        </section>

        {repeatedGaps.length > 0 && (
          <Card className="report-card mt-6 rounded-3xl border-0 bg-white/95 shadow-2xl">
            <CardHeader>
              <CardTitle>Most Repeated Gaps</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {repeatedGaps.map((gap, index) => (
                <div
                  key={`${gap.text}-${index}`}
                  className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4"
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
          <Card className="report-card mt-6 rounded-3xl border-0 bg-white/95 shadow-2xl">
            <CardHeader>
              <CardTitle>Final Reflection</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
                <p className="text-sm leading-7 text-slate-700">
                  {reflectionResponse.combinedAnswer}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mt-6 space-y-6">
          {stageResponses.map((response) => {
            const stage = scenario.stages.find(
              (item) => item.id === response.stageId,
            );

            const stageQuestions = stage?.questions || [];
            const shouldShowBranchReason =
              response.phaseNumber > 1 &&
              Boolean(response.evaluation?.branchReason);

            return (
              <Card
                key={response.stageId}
                className="report-card rounded-3xl border-0 bg-white/95 shadow-2xl"
              >
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

                    {stage?.branchFamily && (
                      <Badge className="bg-slate-100 text-slate-700">
                        {stage.branchFamily}
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
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
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
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
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
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
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
        </section>
      </div>
    </main>
  );
}
