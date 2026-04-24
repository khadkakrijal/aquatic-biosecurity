import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ScenarioListPage() {
  const supabase = await createClient();

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // get role
  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    role = profile?.role || null;
  }

  const { data: scenarios, error } = await supabase
    .from("scenarios")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(6,12,28,0.9), rgba(8,48,73,0.5), rgba(17,24,39,0.9)), url('/biosecurity-bg.png')",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/*  Header + Admin Button */}
        <div className="mb-10 text-center relative">
          <div className=" flex justify-between items-center gap-5">
            <Badge className="bg-cyan-600 text-white py-4">
              Simulation Scenarios
            </Badge>
            {role === "admin" && (
              <Button
                asChild
                className=" w-fit rounded-2xl bg-cyan-600 text-white py-4 text-xs"
              >
                <Link href="/admin">Go to Admin Panel</Link>
              </Button>
            )}
          </div>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            Choose a Scenario
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-white">
            Select a scenario to review its details and begin the simulation.
          </p>
        </div>

        {error ? (
          <Card className="rounded-3xl">
            <CardContent className="py-10 text-center text-red-600">
              Failed to load scenarios.
            </CardContent>
          </Card>
        ) : !scenarios?.length ? (
          <Card className="rounded-3xl">
            <CardContent className="py-10 text-center text-slate-600">
              No active scenarios found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="rounded-3xl border border-1 border-white bg-cyan-100 shadow-sm backdrop-blur"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl text-slate-900">
                        {scenario.title}
                      </CardTitle>
                      <p className="mt-2 text-sm text-slate-500">
                        {scenario.category || "Aquatic Biosecurity"}
                      </p>
                    </div>

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
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-slate-600">
                    {scenario.overview || "No overview available."}
                  </p>

                  <Button
                    asChild
                    className="rounded-2xl bg-cyan-600 px-5 py-2.5 text-white shadow-md transition-all duration-300 hover:bg-cyan-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Link href={`/scenario/${scenario.slug}`}>
                      View Scenario
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
