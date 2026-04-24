import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  Users,
  FileSpreadsheet,
  UserCog,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getAttemptsReport,
  getDecisionBreakdownAcrossStages,
  getMostMissedThemes,
  getReportStats,
} from "@/app/lib/simulation-reports";
import ReportsCharts from "./reports/reportCharts";

export default async function AdminDashboardPage() {
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

  const completionData = (attempts || []).slice(0, 8).map((attempt: any) => ({
    name:
      attempt.profiles?.full_name || attempt.profiles?.email || "Unknown User",
    completion: Number(attempt.completion_percentage || 0),
  }));

  const quickActions = [
    {
      title: "Scenario Management",
      description:
        "Create and manage scenarios, stages, questions, criteria, and branching pathways.",
      href: "/admin/scenarios",
      cta: "Manage Scenarios",
      icon: FolderKanban,
      badge: "Core",
      accent: "bg-cyan-500/10 border-cyan-200",
      button: "bg-cyan-600 hover:bg-cyan-700",
    },
    {
      title: "Simulation Sessions",
      description:
        "Create shared simulation sessions and manage multi-user exercises.",
      href: "/admin/session/create",
      cta: "Create Session",
      icon: Users,
      badge: "Live",
      accent: "bg-emerald-500/10 border-emerald-200",
      button: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Import Scenario",
      description:
        "Upload structured scenario content and publish it faster through the admin workflow.",
      href: "/admin/import",
      cta: "Import Now",
      icon: FileSpreadsheet,
      badge: "Import",
      accent: "bg-violet-500/10 border-violet-200",
      button: "bg-violet-600 hover:bg-violet-700",
    },
    {
      title: "User Management",
      description:
        "Review platform users and manage participant access across the simulation system.",
      href: "/admin/users",
      cta: "Manage Users",
      icon: UserCog,
      badge: "Access",
      accent: "bg-orange-500/10 border-orange-200",
      button: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  const recentAttempts = (attempts || []).slice(0, 5);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 p-8 text-white shadow-sm">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative">
          <Badge className="border-0 bg-white/15 text-white hover:bg-white/15">
            Admin Dashboard
          </Badge>

          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight">
            Manage scenarios, participants, sessions, and reporting from one
            place.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50">
            Monitor simulation activity, review response outcomes, and maintain
            the full platform workflow through a single admin control panel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/scenarios">
              <Button className="bg-cyan-600 text-white ">
                Manage Scenarios
              </Button>
            </Link>

            <Link href="/admin/reports">
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 py-5">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Attempts
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.totalAttempts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Completed Attempts
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.completedAttempts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              In Progress
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.inProgressAttempts}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Average Completion
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {stats.avgCompletion}%
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-cyan-600" />
          <h3 className="text-xl font-semibold text-slate-900">
            Platform Overview
          </h3>
        </div>

        <ReportsCharts
          statusData={statusData}
          severityData={severityData}
          completionData={completionData}
          decisionData={decisionData}
          missedThemesData={missedThemesData}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">
            Quick Actions
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 cursor-pointer">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.href}
                className={`rounded-3xl border shadow-sm ${item.accent}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </div>

                    <Badge variant="outline">{item.badge}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <Link href={item.href}>
                    <Button className={`${item.button} text-white cursor-pointer`}>
                      {item.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">
            Recent Attempt Activity
          </h3>

          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 hover:text-cyan-800"
          >
            View all reports
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="p-5">
            {!recentAttempts.length ? (
              <p className="text-sm text-slate-600">No attempt activity yet.</p>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt: any) => (
                  <div
                    key={attempt.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
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
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {attempt.completion_percentage || 0}% complete
                      </Badge>
                      <Badge
                        className={
                          attempt.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {attempt.status}
                      </Badge>
                      <Badge
                        className={
                          attempt.overall_severity === "severe"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : attempt.overall_severity === "elevated"
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : attempt.overall_severity === "manageable"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                        }
                      >
                        {attempt.overall_severity || "N/A"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
