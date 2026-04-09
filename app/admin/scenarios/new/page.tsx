import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NewScenarioPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

function createSafeLinkName(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function createScenario(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const linkNameRaw = String(formData.get("link_name") || "").trim();
  const overview = String(formData.get("overview") || "").trim();
  const category = String(formData.get("category") || "").trim();

  if (!title) {
    redirect("/admin/scenarios/new?error=Please%20enter%20a%20scenario%20name");
  }

  const linkName = createSafeLinkName(linkNameRaw || title);

  if (!linkName) {
    redirect("/admin/scenarios/new?error=Please%20enter%20a%20valid%20link%20name");
  }

  const { data: existing } = await supabase
    .from("scenarios")
    .select("id")
    .eq("slug", linkName)
    .maybeSingle();

  if (existing) {
    redirect("/admin/scenarios/new?error=That%20link%20name%20is%20already%20being%20used");
  }

  const { data, error } = await supabase
    .from("scenarios")
    .insert({
      title,
      slug: linkName,
      overview,
      category,
      version: 1,
      is_active: true,
      is_published: false,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/admin/scenarios/new?error=Failed%20to%20create%20scenario");
  }

  redirect(`/admin/scenarios/${data.id}?createdScenario=1`);
}

export default async function NewScenarioPage({
  searchParams,
}: NewScenarioPageProps) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <Badge className="bg-cyan-600 text-white">New Scenario</Badge>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Create a New Scenario
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Add the main scenario details first. You can add stages after saving.
        </p>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Scenario Details</CardTitle>
        </CardHeader>

        <CardContent>
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </div>
          ) : null}

          <form action={createScenario} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Scenario Name
              </label>
              <Input
                name="title"
                placeholder="Example: Invasive Mussel Response Exercise"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Link Name
              </label>
              <Input
                name="link_name"
                placeholder="Leave blank to generate automatically from the title"
              />
              <p className="text-xs text-slate-500">
                This will be used in the page URL.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Category
              </label>
              <Input
                name="category"
                placeholder="Example: Aquatic Biosecurity"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Scenario Overview
              </label>
              <Textarea
                name="overview"
                placeholder="Write a short summary of the scenario..."
                className="min-h-[140px]"
              />
            </div>

            <Button
              type="submit"
              className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700"
            >
              Create Scenario
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}