import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAttemptDetail } from "@/app/lib/simulation-reports";
import Link from "next/link";

interface PageProps {
  params: Promise<{ attemptId: string }>;
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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-5">
          <Link
            href="/admin/reports"
            className="bg-cyan-600 text-white rounded-xl px-3 text-sm"
          >
            ← Back to Reports
          </Link>
          <Badge className="bg-cyan-600 text-white">Attempt Report</Badge>
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
          <p>Scenario: {attempt.scenarios?.title || attempt.scenario_slug}</p>
          <p>Status: {attempt.status}</p>
          <p>Completion: {attempt.completion_percentage || 0}%</p>
          <p>Severity: {attempt.overall_severity || "N/A"}</p>
          <p>Started: {attempt.started_at || "N/A"}</p>
          <p>Completed: {attempt.completed_at || "N/A"}</p>
          <p>Duration: {attempt.total_time_seconds || 0} seconds</p>
          <p>
            Final Summary: {attempt.final_summary || "No final summary saved."}
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
                      Decision: {stage.decision || "N/A"}
                    </Badge>
                    <Badge variant="outline">
                      Severity: {stage.scenario_severity || "N/A"}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    <strong>Answer:</strong>{" "}
                    {stage.combined_answer || "No answer"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Feedback:</strong> {stage.feedback || "No feedback"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Branch Reason:</strong>{" "}
                    {stage.branch_reason || "No branch reason"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Matched Criteria:</strong>{" "}
                    {Array.isArray(stage.matched_criteria_ids)
                      ? stage.matched_criteria_ids.join(", ")
                      : "None"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Missing Required Criteria:</strong>{" "}
                    {Array.isArray(stage.missing_required_criteria_ids)
                      ? stage.missing_required_criteria_ids.join(", ")
                      : "None"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    <strong>Submitted:</strong> {stage.submitted_at || "N/A"}
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
