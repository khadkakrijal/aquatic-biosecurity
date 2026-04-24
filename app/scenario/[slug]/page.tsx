import Link from "next/link";
import { notFound } from "next/navigation";
import { getScenarioBySlug } from "@/app/lib/scenario-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, ArrowLeft, ShieldCheck } from "lucide-react";

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
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(6,12,28,0.88), rgba(8,48,73,0.65), rgba(17,24,39,0.9)), url('/biosecurity-bg.png')",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* HERO */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
          <Badge className="bg-cyan-600 text-white border-0">
            Scenario Detail
          </Badge>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {scenario.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
            {scenario.overview}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-white">
              Multi-Phase Exercise
            </div>

            <div className="rounded-2xl bg-cyan-500/20 px-4 py-2 text-sm text-cyan-100">
              Branching Simulation
            </div>

            <div className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-100">
              Criteria Evaluation
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT CARD */}
          <Card className="rounded-3xl border-0 bg-white/95 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-5 w-5 text-cyan-600" />
                Scenario Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm leading-7 text-slate-600">
              <p>
                This scenario progresses through multiple operational phases
                based on your decisions and responses.
              </p>

              <p>
                Your responses shape the direction of the incident through
                controlled, escalated, or recovery-based pathways.
              </p>

              <p>
                Each stage is evaluated using operational criteria and
                synonym-aware response matching for realistic assessment.
              </p>

              <p>
                Immediate feedback is provided after each phase to guide
                learning outcomes and preparedness.
              </p>
            </CardContent>
          </Card>

          {/* RIGHT CARD */}
          <Card className="rounded-3xl border-0 bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900">Ready to Begin?</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {firstStage ? (
                <Button
                  asChild
                  className="w-full rounded-2xl bg-cyan-600 px-5 py-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-cyan-700 hover:shadow-cyan-500/30 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Link
                    href={`/simulation/demo/${scenario.slug}/stage/${firstStage.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    Start Simulation
                  </Link>
                </Button>
              ) : (
                <p className="text-sm text-slate-600">
                  No starting stage found for this scenario.
                </p>
              )}

              <Button
                asChild
                variant="outline"
                className="w-full rounded-2xl border-cyan-200 bg-white py-6 text-cyan-700 transition-all hover:bg-cyan-50 hover:border-cyan-400"
              >
                <Link
                  href="/scenario"
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Scenario List
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
