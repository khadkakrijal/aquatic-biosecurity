import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminSuccessAlert from "../../admin-success-alert";

interface PageProps {
  params: Promise<{ scenarioId: string }>;
  searchParams: Promise<{
    createdScenario?: string;
    createdStage?: string;
  }>;
}

export default async function ScenarioDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { scenarioId } = await params;
  const { createdScenario, createdStage } = await searchParams;

  const supabase = await createClient();

  const { data: scenario, error: scenarioError } = await supabase
    .from("scenarios")
    .select("*")
    .eq("id", scenarioId)
    .single();

  if (scenarioError || !scenario) {
    notFound();
  }

  const { data: stages, error: stagesError } = await supabase
    .from("scenario_stages")
    .select("*")
    .eq("scenario_id", scenarioId)
    .order("phase_number", { ascending: true })
    .order("sort_order", { ascending: true });

  if (stagesError) {
    return <main className="p-8">Failed to load scenario stages.</main>;
  }

  return (
    <div className="space-y-6">
      {createdScenario ? (
        <AdminSuccessAlert
          title="Scenario created"
          text="Your new scenario is ready. You can now add stages."
        />
      ) : null}

      {createdStage ? (
        <AdminSuccessAlert
          title="Stage created"
          text="The new stage has been added successfully."
        />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-cyan-600 text-white">Scenario Detail</Badge>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            {scenario.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            {scenario.overview || "No overview available."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Link: {scenario.slug}</Badge>
          <Badge variant="outline">Version {scenario.version ?? 1}</Badge>
          <Badge
            className={
              scenario.is_published
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }
          >
            {scenario.is_published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Stages</CardTitle>

            <Link href={`/admin/scenarios/${scenarioId}/stages/new`}>
              <Button className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700">
                Add Stage
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {!stages?.length ? (
            <p className="text-sm text-slate-600">
              No stages have been added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      Phase {stage.phase_number} — {stage.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {stage.timeframe || "No timeframe provided"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">Stage {index + 1}</Badge>

                      {stage.is_terminal ? (
                        <Badge className="bg-slate-100 text-slate-700">
                          Final Stage
                        </Badge>
                      ) : null}

                      {!stage.is_active ? (
                        <Badge className="bg-rose-100 text-rose-700">
                          Inactive
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <Link href={`/admin/scenarios/${scenarioId}/stages/${stage.id}`}>
                    <Button variant="outline" className="rounded-2xl">
                      Edit Stage
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}