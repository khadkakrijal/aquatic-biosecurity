import { notFound } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAttemptDetail } from "@/app/lib/simulation-reports";
import DownloadAttemptReportButton from "./DownloadAttemptReportButton";

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

function formatLabel(value?: string | null) {
  if (!value) return "Not recorded";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "Not completed yet";

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

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return "Not recorded yet";

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

function getDisplayDuration(attempt: any) {
  if (attempt.total_time_seconds && attempt.total_time_seconds > 0) {
    return formatDuration(attempt.total_time_seconds);
  }

  if (attempt.status === "completed") {
    return "Not recorded";
  }

  return "In progress";
}
export default async function AttemptReportPage({ params }: PageProps) {
  const { attemptId } = await params;

  let detail;

  try {
    detail = await getAttemptDetail(attemptId);
  } catch {
    notFound();
  }

  const { attempt, stages } = detail;

  const displayDuration = getDisplayDuration(attempt);
  const isCompleted = attempt.status === "completed";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/reports"
            className="rounded-xl bg-cyan-600 px-3 py-2 text-sm text-white"
          >
            ← Back to Reports
          </Link>

          <DownloadAttemptReportButton
            attempt={attempt}
            stages={stages || []}
          />

          <Badge className="bg-cyan-600 text-white px-3 py-4 rounded-xl">
            Attempt Report
          </Badge>
        </div>

        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          {attempt.profiles?.full_name || "Unknown User"}
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {attempt.profiles?.email || "No email"}
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Attempt Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>
            <strong>Scenario:</strong>{" "}
            {attempt.scenarios?.title || attempt.scenario_slug}
          </p>

          <p>
            <strong>Status:</strong> {formatLabel(attempt.status)}
          </p>

          <p>
            <strong>Completion:</strong> {attempt.completion_percentage || 0}%
          </p>

          <p>
            <strong>Severity:</strong> {formatLabel(attempt.overall_severity)}
          </p>

          <p>
            <strong>Started:</strong> {formatDate(attempt.started_at)}
          </p>

          {isCompleted && (
            <p>
              <strong>Completed:</strong> {formatDate(attempt.completed_at)}
            </p>
          )}

          <p>
            <strong>Duration:</strong> {displayDuration}
          </p>

          <p>
            <strong>Final Summary:</strong>{" "}
            {attempt.final_summary || "No final summary saved yet."}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Stage Activity</CardTitle>
        </CardHeader>

        <CardContent>
          {!stages?.length ? (
            <p className="text-sm text-slate-600">No stage records found.</p>
          ) : (
            <div className="space-y-4">
              {stages.map((stage: any) => (
                <div key={stage.id} className="rounded-2xl border p-4">
                  <p className="font-medium text-slate-900">
                    Phase {stage.phase_number} — {stage.stage_id}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Decision: {formatLabel(stage.decision)}
                    </Badge>

                    <Badge variant="outline">
                      Severity: {formatLabel(stage.scenario_severity)}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    <strong>Answer:</strong>{" "}
                    {stage.combined_answer || "No answer recorded."}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Feedback:</strong>{" "}
                    {stage.feedback || "No feedback recorded."}
                  </p>

                  {stage.branch_reason && (
                    <p className="mt-2 text-sm text-slate-600">
                      <strong>Branch Reason:</strong> {stage.branch_reason}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Matched Criteria:</strong>{" "}
                    {Array.isArray(stage.matched_criteria_ids) &&
                    stage.matched_criteria_ids.length
                      ? stage.matched_criteria_ids.join(", ")
                      : "None recorded"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Missing Required Criteria:</strong>{" "}
                    {Array.isArray(stage.missing_required_criteria_ids) &&
                    stage.missing_required_criteria_ids.length
                      ? stage.missing_required_criteria_ids.join(", ")
                      : "None recorded"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Submitted:</strong> {formatDate(stage.submitted_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
