"use client";

import { Download } from "lucide-react";
import Swal from "sweetalert2";
import { generateSimulationReportPdf } from "@/app/lib/simulation-report-pdf";

function formatLabel(value?: string | null) {
  if (!value) return "Not Recorded";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not recorded";

  return date.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds?: number | null, status?: string | null) {
  if (!seconds || seconds <= 0) {
    return status === "completed" ? "Not Recorded" : "In Progress";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes <= 0) return `${remainingSeconds} seconds`;

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}${
      remainingSeconds ? ` ${remainingSeconds} seconds` : ""
    }`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours} hour${hours === 1 ? "" : "s"}${
    remainingMinutes ? ` ${remainingMinutes} minutes` : ""
  }`;
}

export default function DownloadAttemptReportButton({
  attempt,
  stages,
}: {
  attempt: any;
  stages: any[];
}) {
  const handleDownload = async () => {
    const result = await Swal.fire({
      title: "Download report?",
      text: "A PDF report will be downloaded to your computer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Download PDF",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0891b2",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      generateSimulationReportPdf({
        reportTitle: "Biosecurity Simulation Attempt Report",
        participantName: attempt.profiles?.full_name || "Unknown User",
        participantEmail: attempt.profiles?.email || "No email",
        scenarioTitle: attempt.scenarios?.title || attempt.scenario_slug,

        status: formatLabel(attempt.status),
        completion: `${attempt.completion_percentage || 0}%`,
        overallSeverity: formatLabel(attempt.overall_severity),
        startedAt: formatDate(attempt.started_at),
        completedAt:
          attempt.status === "completed"
            ? formatDate(attempt.completed_at)
            : "Not completed yet",
        duration: formatDuration(attempt.total_time_seconds, attempt.status),

        finalSummary: attempt.final_summary || "No final summary saved yet.",

        stages: (stages || []).map((stage: any) => {
          const stageSeverity =
            stage.scenario_severity ||
            stage.scenarioSeverity ||
            stage.evaluation?.scenarioSeverity ||
            attempt.overall_severity ||
            "Not Recorded";

          const situationShown =
            stage.scenario_text_shown ||
            stage.scenarioTextShown ||
            stage.situation_shown ||
            stage.situationShown ||
            stage.scenario_text ||
            stage.base_scenario_text ||
            stage.stage_text ||
            stage.prompt ||
            "No situation text recorded.";

          return {
            phaseNumber: stage.phase_number || stage.phaseNumber,
            stageTitle: stage.stage_title || stage.title || stage.stage_id,
            stageId: stage.stage_id,

            decision: stage.decision || "not_recorded",
            severity: formatLabel(stageSeverity),

            situationShown,

            answer: stage.combined_answer || "No answer recorded.",
            feedback: stage.feedback || "No feedback recorded.",
            branchReason: stage.branch_reason || "",

            matchedCriteria: Array.isArray(stage.matched_criteria_ids)
              ? stage.matched_criteria_ids
              : [],

            missingCriteria: Array.isArray(stage.missing_required_criteria_ids)
              ? stage.missing_required_criteria_ids
              : [],

            matchedCount: Array.isArray(stage.matched_criteria_ids)
              ? stage.matched_criteria_ids.length
              : 0,

            missedCount: Array.isArray(stage.missing_required_criteria_ids)
              ? stage.missing_required_criteria_ids.length
              : 0,

            submittedAt: formatDate(stage.submitted_at),
          };
        }),

        fileName: `${attempt.profiles?.full_name || "participant"}-${
          attempt.scenario_slug || "simulation"
        }-report`,
      });

      await Swal.fire({
        title: "Downloaded!",
        text: "The report has been downloaded successfully.",
        icon: "success",
        confirmButtonColor: "#0891b2",
        timer: 1600,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Download report error:", error);

      await Swal.fire({
        title: "Download failed",
        text: "The report could not be generated.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
    >
      <Download className="h-4 w-4" />
      Download Report
    </button>
  );
}
