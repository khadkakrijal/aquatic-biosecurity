import Link from "next/link";
import { notFound } from "next/navigation";
import { getScenarioBySlug } from "@/app/lib/scenario-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ScenarioDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const scenario = await getScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  const firstStage = scenario.stages
    .filter((item) => item.phaseNumber === 1)
    .sort((a, b) => a.id.localeCompare(b.id))[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <Badge className="bg-cyan-600 text-white">Scenario Detail</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">
            {scenario.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {scenario.overview}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Scenario Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                This scenario contains{" "}
                <strong>{scenario.stages.length}</strong> stages across multiple
                phases.
              </p>
              <p>
                Your responses will shape the progression of the exercise through
                controlled, pressured, or recovery-focused pathways.
              </p>
              <p>
                Each stage is evaluated against operational criteria, and
                feedback is provided after every response.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {firstStage ? (
                <Button asChild className="w-full rounded-2xl">
                  <Link
                    href={`/simulation/demo/${scenario.slug}/stage/${firstStage.id}`}
                  >
                    Start Simulation
                  </Link>
                </Button>
              ) : (
                <p className="text-sm text-slate-600">
                  No starting stage found for this scenario.
                </p>
              )}

              <Button asChild variant="outline" className="w-full rounded-2xl">
                <Link href="/scenario">Back to Scenario List</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}