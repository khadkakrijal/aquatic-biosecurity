import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReportsCharts from "./reportCharts";
import {
  getAttemptsReport,
  getDecisionBreakdownAcrossStages,
  getMostMissedThemes,
  getReportStats,
} from "@/app/lib/simulation-reports";
import DeleteReportButton from "./DeleteReportButton";

export default async function AdminReportsPage() {
  const stats = await getReportStats();
  const attempts = await getAttemptsReport();
  const decisionData = await getDecisionBreakdownAcrossStages();
  const missedThemesData = await getMostMissedThemes();

  const statusData = [
    { name: "Completed", value: stats.completedAttempts },
    { name: "In Progress", value: stats.inProgressAttempts },
  ].filter((item) => item.value > 0);

  const severityData = [
    { name: "Manageable", value: stats.severityCounts.manageable },
    { name: "Elevated", value: stats.severityCounts.elevated },
    { name: "Severe", value: stats.severityCounts.severe },
  ].filter((item) => item.value > 0);

  const completionData = (attempts || []).slice(0, 10).map((attempt: any) => ({
    name:
      attempt.profiles?.full_name || attempt.profiles?.email || "Unknown User",
    completion: Number(attempt.completion_percentage || 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-cyan-600 text-white">Reports</Badge>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Participant Reports
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Track who participated, how far they progressed, how long they spent,
          and what outcomes they reached.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Attempts
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.totalAttempts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Completed
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.completedAttempts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              In Progress
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.inProgressAttempts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Average Completion
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.avgCompletion}%
            </p>
          </CardContent>
        </Card>
      </div>

      <ReportsCharts
        statusData={statusData}
        severityData={severityData}
        completionData={completionData}
        decisionData={decisionData}
        missedThemesData={missedThemesData}
      />

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>All Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {!attempts?.length ? (
            <p className="text-sm text-slate-600">No attempts found yet.</p>
          ) : (
            <div className="space-y-4">
              {attempts.map((attempt: any) => (
                <div
                  key={attempt.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {attempt.profiles?.full_name || "Unknown User"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {attempt.profiles?.email || "No email"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Scenario:{" "}
                      {attempt.scenarios?.title || attempt.scenario_slug}
                    </p>
                    <p className="text-sm text-slate-600">
                      Completion: {attempt.completion_percentage || 0}% |
                      Status: {attempt.status} | Severity:{" "}
                      {attempt.overall_severity || "N/A"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Time Spent: {attempt.total_time_seconds || 0} seconds
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/reports/${attempt.id}`}
                      className="rounded-xl border px-4 py-2 text-sm"
                    >
                      View Report
                    </Link>

                    <DeleteReportButton attemptId={attempt.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
