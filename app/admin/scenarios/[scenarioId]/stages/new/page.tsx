import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AdminSuccessAlert from "@/app/admin/admin-success-alert";

interface PageProps {
  params: Promise<{
    scenarioId: string;
  }>;
  searchParams: Promise<{
    created?: string;
    error?: string;
  }>;
}

async function createStage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const scenarioId = String(formData.get("scenarioId") || "").trim();
  const phaseNumber = Number(formData.get("phase_number") || 1);
  const title = String(formData.get("title") || "").trim();
  const timeframe = String(formData.get("timeframe") || "").trim();
  const baseScenarioText = String(formData.get("base_scenario_text") || "").trim();
  const minScore = Number(formData.get("min_score") || 0);
  const actionType = String(formData.get("actionType") || "exit");

  const isActive = formData.get("is_active") === "on";
  const isTerminal = formData.get("is_terminal") === "on";

  if (!scenarioId) {
    redirect("/admin/scenarios?error=Missing%20scenario");
  }

  if (!title || !baseScenarioText) {
    redirect(
      `/admin/scenarios/${scenarioId}/stages/new?error=Please%20fill%20in%20all%20required%20fields`
    );
  }

  if (phaseNumber < 1) {
    redirect(
      `/admin/scenarios/${scenarioId}/stages/new?error=Phase%20number%20must%20be%201%20or%20higher`
    );
  }

  const { data: existingStages } = await supabase
    .from("scenario_stages")
    .select("id, stage_id, phase_number, sort_order")
    .eq("scenario_id", scenarioId)
    .order("sort_order", { ascending: true });

  const samePhaseStages = (existingStages || []).filter(
    (item) => item.phase_number === phaseNumber
  );

  const nextStageNumber = samePhaseStages.length + 1;
  const generatedStageId =
    nextStageNumber === 1 ? `p${phaseNumber}` : `p${phaseNumber}-${nextStageNumber}`;

  const maxSortOrder =
    Math.max(...(existingStages || []).map((item) => item.sort_order ?? 0), 0) + 1;

  const { error } = await supabase.from("scenario_stages").insert({
    scenario_id: scenarioId,
    stage_id: generatedStageId,
    phase_number: phaseNumber,
    title,
    timeframe,
    branch_family: "main",
    base_scenario_text: baseScenarioText,
    min_score: minScore,
    required_criteria_ids: [],
    next_stage_map: {},
    sort_order: maxSortOrder,
    is_active: isActive,
    is_terminal: isTerminal,
    summary_category: null,
  });

  if (error) {
    console.error(error);
    redirect(`/admin/scenarios/${scenarioId}/stages/new?error=Failed%20to%20create%20stage`);
  }

  if (actionType === "addAnother") {
    redirect(`/admin/scenarios/${scenarioId}/stages/new?created=1`);
  }

  redirect(`/admin/scenarios/${scenarioId}?createdStage=1`);
}

export default async function NewStagePage({
  params,
  searchParams,
}: PageProps) {
  const { scenarioId } = await params;
  const { created, error } = await searchParams;

  const supabase = await createClient();

  const { data: scenario, error: scenarioError } = await supabase
    .from("scenarios")
    .select("*")
    .eq("id", scenarioId)
    .single();

  if (scenarioError || !scenario) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {created ? (
        <AdminSuccessAlert
          title="Stage created"
          text="The stage was created successfully. You can add another one now."
        />
      ) : null}

      <div>
        <Badge className="bg-cyan-600 text-white">New Stage</Badge>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Add Stage to {scenario.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Keep this simple. Advanced branching and detailed routing can be adjusted
          after the stage is created.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Stage Details</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </div>
          ) : null}

          <form action={createStage} className="space-y-5">
            <input type="hidden" name="scenarioId" value={scenarioId} />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Phase Number
                </label>
                <Input
                  name="phase_number"
                  type="number"
                  min={1}
                  defaultValue={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Time Period
                </label>
                <Input
                  name="timeframe"
                  placeholder="Example: 0–24 Hours"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Stage Title
              </label>
              <Input
                name="title"
                placeholder="Example: Detection and Immediate Response"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Stage Narrative
              </label>
              <Textarea
                name="base_scenario_text"
                placeholder="Write the stage narrative here..."
                className="min-h-[220px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Minimum Score to Pass
              </label>
              <Input
                name="min_score"
                type="number"
                min={0}
                defaultValue={0}
              />
              <p className="text-xs text-slate-500">
                You can refine this later when adding criteria and branching.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="is_active" defaultChecked />
                Active Stage
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="is_terminal" />
                Final Stage
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                name="actionType"
                value="addAnother"
                className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700"
              >
                Save and Add Another Stage
              </Button>

              <Button
                type="submit"
                name="actionType"
                value="exit"
                variant="outline"
                className="rounded-2xl"
              >
                Save and Go Back
              </Button>

              <Button asChild variant="ghost" className="rounded-2xl">
                <a href={`/admin/scenarios/${scenarioId}`}>Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}