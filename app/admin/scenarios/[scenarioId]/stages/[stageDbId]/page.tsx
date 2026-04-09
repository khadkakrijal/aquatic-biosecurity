import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  BRANCH_FAMILY_OPTIONS,
  THEME_OPTIONS,
} from "@/app/lib/admin-simulation-options";

interface PageProps {
  params: Promise<{
    scenarioId: string;
    stageDbId: string;
  }>;
}

function parseCsvToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function updateStage(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");

  const stageId = String(formData.get("stage_id") || "").trim();
  const phaseNumber = Number(formData.get("phase_number") || 1);
  const title = String(formData.get("title") || "").trim();
  const timeframe = String(formData.get("timeframe") || "").trim();
  const branchFamily = String(formData.get("branch_family") || "main").trim();
  const baseScenarioText = String(formData.get("base_scenario_text") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);
  const summaryCategory = String(formData.get("summary_category") || "").trim();
  const minScore = Number(formData.get("min_score") || 0);

  const isActive = formData.get("is_active") === "on";
  const isTerminal = formData.get("is_terminal") === "on";

  const requiredCriteriaIds = formData
    .getAll("required_criteria_ids")
    .map(String)
    .filter(Boolean);

  const strongNext = String(formData.get("strong_next_stage") || "").trim();
  const mixedNext = String(formData.get("mixed_next_stage") || "").trim();
  const limitedNext = String(formData.get("limited_next_stage") || "").trim();
  const fallbackNext = String(formData.get("fallback_next_stage") || "").trim();

  const byMissingRequired: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("criterion_route_")) {
      const criterionId = key.replace("criterion_route_", "");
      const nextStage = String(value || "").trim();
      if (criterionId && nextStage) {
        byMissingRequired[criterionId] = nextStage;
      }
    }
  }

  const byMissingRequiredPriority = requiredCriteriaIds.filter((criterionId) =>
    Boolean(byMissingRequired[criterionId])
  );

  const nextStageMap = {
    ...(byMissingRequiredPriority.length ? { byMissingRequiredPriority } : {}),
    ...(Object.keys(byMissingRequired).length ? { byMissingRequired } : {}),
    ...(strongNext ? { strong: strongNext } : {}),
    ...(mixedNext ? { mixed: mixedNext } : {}),
    ...(limitedNext ? { limited: limitedNext } : {}),
    ...(fallbackNext ? { fallback: fallbackNext } : {}),
  };

  if (!stageId || !title || !baseScenarioText) return;

  await supabase
    .from("scenario_stages")
    .update({
      stage_id: stageId,
      phase_number: phaseNumber,
      title,
      timeframe,
      branch_family: branchFamily,
      base_scenario_text: baseScenarioText,
      min_score: minScore,
      required_criteria_ids: requiredCriteriaIds,
      next_stage_map: nextStageMap,
      sort_order: sortOrder,
      is_active: isActive,
      is_terminal: isTerminal,
      summary_category: summaryCategory || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", stageDbId);

  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
  revalidatePath(`/admin/scenarios/${scenarioId}`);
}

async function addCriterion(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");

  const criterionId = String(formData.get("criterion_id") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const consequence = String(formData.get("consequence") || "").trim();
  const theme = String(formData.get("theme") || "").trim();
  const weight = Number(formData.get("weight") || 1);
  const sortOrder = Number(formData.get("sort_order") || 0);
  const keywords = parseCsvToArray(String(formData.get("keywords") || ""));
  const required = formData.get("required") === "on";

  if (!criterionId || !text || !theme) return;

  await supabase.from("stage_criteria").insert({
    stage_ref_id: stageDbId,
    criterion_id: criterionId,
    text,
    consequence,
    theme,
    required,
    weight,
    keywords,
    sort_order: sortOrder,
  });

  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
}

async function updateCriterion(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");
  const criterionDbId = String(formData.get("criterionDbId") || "");

  const criterionId = String(formData.get("criterion_id") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const consequence = String(formData.get("consequence") || "").trim();
  const theme = String(formData.get("theme") || "").trim();
  const weight = Number(formData.get("weight") || 1);
  const sortOrder = Number(formData.get("sort_order") || 0);
  const keywords = parseCsvToArray(String(formData.get("keywords") || ""));
  const required = formData.get("required") === "on";

  await supabase
    .from("stage_criteria")
    .update({
      criterion_id: criterionId,
      text,
      consequence,
      theme,
      required,
      weight,
      keywords,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", criterionDbId);

  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
}

async function deleteCriterion(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");
  const criterionDbId = String(formData.get("criterionDbId") || "");

  await supabase.from("stage_criteria").delete().eq("id", criterionDbId);
  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
}

async function addQuestion(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");

  const questionId = String(formData.get("question_id") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const theme = String(formData.get("theme") || "").trim();
  const placeholder = String(formData.get("placeholder") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);

  if (!questionId || !text || !theme) return;

  await supabase.from("stage_questions").insert({
    stage_ref_id: stageDbId,
    question_id: questionId,
    text,
    theme,
    placeholder,
    sort_order: sortOrder,
  });

  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
}

async function updateQuestion(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");
  const questionDbId = String(formData.get("questionDbId") || "");

  const questionId = String(formData.get("question_id") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const theme = String(formData.get("theme") || "").trim();
  const placeholder = String(formData.get("placeholder") || "").trim();
  const sortOrder = Number(formData.get("sort_order") || 0);

  await supabase
    .from("stage_questions")
    .update({
      question_id: questionId,
      text,
      theme,
      placeholder,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", questionDbId);

  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
}

async function deleteQuestion(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");
  const questionDbId = String(formData.get("questionDbId") || "");

  await supabase.from("stage_questions").delete().eq("id", questionDbId);
  revalidatePath(`/admin/scenarios/${scenarioId}/stages/${stageDbId}`);
}

async function deleteStage(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "");
  const stageDbId = String(formData.get("stageDbId") || "");

  await supabase.from("scenario_stages").delete().eq("id", stageDbId);
  redirect(`/admin/scenarios/${scenarioId}`);
}

export default async function StageEditorPage({ params }: PageProps) {
  const { scenarioId, stageDbId } = await params;
  const supabase = await createClient();

  const { data: scenario, error: scenarioError } = await supabase
    .from("scenarios")
    .select("*")
    .eq("id", scenarioId)
    .single();

  if (scenarioError || !scenario) notFound();

  const { data: stage, error: stageError } = await supabase
    .from("scenario_stages")
    .select("*")
    .eq("id", stageDbId)
    .eq("scenario_id", scenarioId)
    .single();

  if (stageError || !stage) notFound();

  const { data: criteria } = await supabase
    .from("stage_criteria")
    .select("*")
    .eq("stage_ref_id", stageDbId)
    .order("sort_order", { ascending: true });

  const { data: questions } = await supabase
    .from("stage_questions")
    .select("*")
    .eq("stage_ref_id", stageDbId)
    .order("sort_order", { ascending: true });

  const { data: siblingStages } = await supabase
    .from("scenario_stages")
    .select("id, stage_id, title, phase_number")
    .eq("scenario_id", scenarioId)
    .order("phase_number", { ascending: true })
    .order("sort_order", { ascending: true });

  const nextStageMap = stage.next_stage_map || {};
  const requiredCriteriaIds: string[] = stage.required_criteria_ids || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-cyan-600 text-white">Stage Editor</Badge>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            {stage.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage stage content, questions, criteria, and branching for {scenario.title}.
          </p>
        </div>

        <form action={deleteStage}>
          <input type="hidden" name="scenarioId" value={scenarioId} />
          <input type="hidden" name="stageDbId" value={stageDbId} />
          <Button type="submit" variant="destructive" className="rounded-2xl">
            Delete Stage
          </Button>
        </form>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Stage Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={updateStage} className="space-y-6">
            <input type="hidden" name="scenarioId" value={scenarioId} />
            <input type="hidden" name="stageDbId" value={stageDbId} />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Phase Number</label>
                <Input
                  name="phase_number"
                  type="number"
                  min={1}
                  defaultValue={stage.phase_number}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Time Period</label>
                <Input name="timeframe" defaultValue={stage.timeframe || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Stage Title</label>
              <Input name="title" defaultValue={stage.title} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Stage Narrative</label>
              <Textarea
                name="base_scenario_text"
                defaultValue={stage.base_scenario_text}
                className="min-h-[220px]"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Minimum Score to Pass
                </label>
                <Input
                  name="min_score"
                  type="number"
                  min={0}
                  defaultValue={stage.min_score ?? 0}
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-8">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={Boolean(stage.is_active)}
                  />
                  Active Stage
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="is_terminal"
                    defaultChecked={Boolean(stage.is_terminal)}
                  />
                  Final Stage
                </label>
              </div>
            </div>

            <details className="rounded-2xl border bg-slate-50 p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                Advanced Stage Settings
              </summary>

              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Stage Reference
                  </label>
                  <Input name="stage_id" defaultValue={stage.stage_id} required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Path Type
                  </label>
                  <select
                    name="branch_family"
                    defaultValue={stage.branch_family || "main"}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    {BRANCH_FAMILY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Display Order
                  </label>
                  <Input
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={stage.sort_order ?? 0}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Outcome Group
                  </label>
                  <Input
                    name="summary_category"
                    defaultValue={stage.summary_category || ""}
                  />
                </div>
              </div>
            </details>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <h3 className="mb-3 font-semibold text-slate-900">Required Criteria</h3>

              {!criteria?.length ? (
                <p className="text-sm text-slate-500">
                  Add criteria below first. Then tick the ones that are required.
                </p>
              ) : (
                <div className="space-y-3">
                  {criteria.map((criterion) => (
                    <label
                      key={criterion.id}
                      className="flex items-start gap-3 rounded-2xl border bg-white p-3"
                    >
                      <input
                        type="checkbox"
                        name="required_criteria_ids"
                        value={criterion.criterion_id}
                        defaultChecked={requiredCriteriaIds.includes(criterion.criterion_id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-slate-900">
                          {criterion.criterion_id} — {criterion.text}
                        </p>
                        <p className="text-xs text-slate-500">Theme: {criterion.theme}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4 space-y-5">
              <div>
                <h3 className="font-semibold text-slate-900">Branching Paths</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the next stage based on answer quality or missed required criteria.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    If response is strong
                  </label>
                  <select
                    name="strong_next_stage"
                    defaultValue={nextStageMap.strong || ""}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select next stage</option>
                    {siblingStages?.map((item) => (
                      <option key={item.id} value={item.stage_id}>
                        Phase {item.phase_number} — {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    If response is mixed
                  </label>
                  <select
                    name="mixed_next_stage"
                    defaultValue={nextStageMap.mixed || ""}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select next stage</option>
                    {siblingStages?.map((item) => (
                      <option key={item.id} value={item.stage_id}>
                        Phase {item.phase_number} — {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    If response is weak
                  </label>
                  <select
                    name="limited_next_stage"
                    defaultValue={nextStageMap.limited || ""}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select next stage</option>
                    {siblingStages?.map((item) => (
                      <option key={item.id} value={item.stage_id}>
                        Phase {item.phase_number} — {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Default next stage
                  </label>
                  <select
                    name="fallback_next_stage"
                    defaultValue={nextStageMap.fallback || ""}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select next stage</option>
                    {siblingStages?.map((item) => (
                      <option key={item.id} value={item.stage_id}>
                        Phase {item.phase_number} — {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!!criteria?.length && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">
                    If a required criterion is missed, go to:
                  </h4>

                  {criteria.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="grid gap-3 rounded-2xl border bg-white p-3 md:grid-cols-[1.2fr_1fr]"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {criterion.criterion_id} — {criterion.text}
                        </p>
                        <p className="text-xs text-slate-500">
                          Theme: {criterion.theme}
                        </p>
                      </div>

                      <select
                        name={`criterion_route_${criterion.criterion_id}`}
                        defaultValue={
                          nextStageMap.byMissingRequired?.[criterion.criterion_id] || ""
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                      >
                        <option value="">No special route</option>
                        {siblingStages?.map((item) => (
                          <option key={item.id} value={item.stage_id}>
                            Phase {item.phase_number} — {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700"
              >
                Save Stage Details
              </Button>

              <Button asChild variant="outline" className="rounded-2xl">
                <a href={`/admin/scenarios/${scenarioId}`}>Go Back to Stage List</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Add Criterion</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={addCriterion} className="space-y-5">
            <input type="hidden" name="scenarioId" value={scenarioId} />
            <input type="hidden" name="stageDbId" value={stageDbId} />

            <div className="grid gap-5 md:grid-cols-2">
              <Input name="criterion_id" placeholder="Example: p1c1" required />
              <Input name="text" placeholder="Criterion text" required />
            </div>

            <Textarea
              name="consequence"
              placeholder="What could happen if this is missed?"
              className="min-h-[100px]"
            />

            <div className="grid gap-5 md:grid-cols-4">
              <select
                name="theme"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                defaultValue="Protocols"
              >
                {THEME_OPTIONS.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>

              <Input
                name="weight"
                type="number"
                min={1}
                defaultValue={1}
                placeholder="Priority Weight"
              />

              <Input
                name="sort_order"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="Display Order"
              />

              <label className="flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="required" />
                Required
              </label>
            </div>

            <div className="space-y-2">
              <Input name="keywords" placeholder="Comma-separated keywords" />
              <p className="text-xs text-slate-500">
                Example: report, notify, escalate, authority
              </p>
            </div>

            <Button type="submit" className="rounded-2xl">
              Add Criterion
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {criteria?.map((criterion) => (
          <Card key={criterion.id} className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg">
                Criterion — {criterion.criterion_id}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form action={updateCriterion} className="space-y-5">
                <input type="hidden" name="scenarioId" value={scenarioId} />
                <input type="hidden" name="stageDbId" value={stageDbId} />
                <input type="hidden" name="criterionDbId" value={criterion.id} />

                <div className="grid gap-5 md:grid-cols-2">
                  <Input name="criterion_id" defaultValue={criterion.criterion_id} required />
                  <Input name="text" defaultValue={criterion.text} required />
                </div>

                <Textarea
                  name="consequence"
                  defaultValue={criterion.consequence || ""}
                  className="min-h-[100px]"
                />

                <div className="grid gap-5 md:grid-cols-4">
                  <select
                    name="theme"
                    defaultValue={criterion.theme}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    {THEME_OPTIONS.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    name="weight"
                    type="number"
                    min={1}
                    defaultValue={criterion.weight ?? 1}
                  />

                  <Input
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={criterion.sort_order ?? 0}
                  />

                  <label className="flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="required"
                      defaultChecked={Boolean(criterion.required)}
                    />
                    Required
                  </label>
                </div>

                <Input
                  name="keywords"
                  defaultValue={(criterion.keywords || []).join(", ")}
                />

                <Button type="submit" className="rounded-2xl">
                  Save Criterion
                </Button>
              </form>

              <form action={deleteCriterion} className="mt-3">
                <input type="hidden" name="scenarioId" value={scenarioId} />
                <input type="hidden" name="stageDbId" value={stageDbId} />
                <input type="hidden" name="criterionDbId" value={criterion.id} />
                <Button type="submit" variant="destructive" className="rounded-2xl">
                  Delete Criterion
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={addQuestion} className="space-y-5">
            <input type="hidden" name="scenarioId" value={scenarioId} />
            <input type="hidden" name="stageDbId" value={stageDbId} />

            <div className="grid gap-5 md:grid-cols-2">
              <Input name="question_id" placeholder="Example: p1q1" required />
              <Input name="text" placeholder="Question text" required />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <select
                name="theme"
                defaultValue="Protocols"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              >
                {THEME_OPTIONS.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>

              <Input
                name="sort_order"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="Display Order"
              />
            </div>

            <Textarea
              name="placeholder"
              placeholder="Helper text for the person answering this question..."
              className="min-h-[100px]"
            />

            <Button type="submit" className="rounded-2xl">
              Add Question
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions?.map((question) => (
          <Card key={question.id} className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg">
                Question — {question.question_id}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form action={updateQuestion} className="space-y-5">
                <input type="hidden" name="scenarioId" value={scenarioId} />
                <input type="hidden" name="stageDbId" value={stageDbId} />
                <input type="hidden" name="questionDbId" value={question.id} />

                <div className="grid gap-5 md:grid-cols-2">
                  <Input name="question_id" defaultValue={question.question_id} required />
                  <Input name="text" defaultValue={question.text} required />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <select
                    name="theme"
                    defaultValue={question.theme}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    {THEME_OPTIONS.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={question.sort_order ?? 0}
                  />
                </div>

                <Textarea
                  name="placeholder"
                  defaultValue={question.placeholder || ""}
                  className="min-h-[100px]"
                />

                <Button type="submit" className="rounded-2xl">
                  Save Question
                </Button>
              </form>

              <form action={deleteQuestion} className="mt-3">
                <input type="hidden" name="scenarioId" value={scenarioId} />
                <input type="hidden" name="stageDbId" value={stageDbId} />
                <input type="hidden" name="questionDbId" value={question.id} />
                <Button type="submit" variant="destructive" className="rounded-2xl">
                  Delete Question
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}