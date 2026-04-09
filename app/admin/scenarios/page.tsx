import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function deleteScenario(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const scenarioId = String(formData.get("scenarioId") || "").trim();

  if (!scenarioId) return;

  const { error } = await supabase.from("scenarios").delete().eq("id", scenarioId);

  if (error) {
    console.error("Failed to delete scenario:", error);
    return;
  }

  revalidatePath("/admin/scenarios");
}

export default async function AdminScenariosPage() {
  const supabase = await createClient();

  const { data: scenarios, error } = await supabase
    .from("scenarios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Scenarios</h2>
        <p className="text-sm text-red-600">Failed to load scenarios.</p>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge className="bg-cyan-600 text-white">Scenarios</Badge>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Scenario Management
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage aquatic biosecurity simulation scenarios and their stages.
          </p>
        </div>

        <Link href="/admin/scenarios/new">
          <Button className="rounded-2xl bg-cyan-600 text-white hover:bg-cyan-700">
            New Scenario
          </Button>
        </Link>
      </div>

      {!scenarios?.length ? (
        <Card className="rounded-3xl">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-slate-600">
              No scenarios found yet. Create your first one to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="rounded-3xl shadow-sm">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">
                      Link: {scenario.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
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
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="max-w-3xl text-sm text-slate-600">
                  {scenario.overview || "No overview provided yet."}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/admin/scenarios/${scenario.id}`}>
                    <Button variant="outline" className="rounded-2xl">
                      Open Scenario
                    </Button>
                  </Link>

                  <form action={deleteScenario}>
                    <input type="hidden" name="scenarioId" value={scenario.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      className="rounded-2xl"
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}