import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";

export default function ScenarioOverviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 space-y-4">
          <Badge className="bg-cyan-600 text-white">Aquatic Scenario</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            {invasiveMusselScenario.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            {invasiveMusselScenario.overview}
          </p>
        </div>

        <Card className="mb-8 rounded-3xl border-white/60 bg-white/75 shadow-sm backdrop-blur-md">
          <CardHeader>
            <CardTitle>Simulation phases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invasiveMusselScenario.phases.map((phase) => (
              <div
                key={phase.phaseNumber}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Phase {phase.phaseNumber}</Badge>
                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                    {phase.timeframe}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{phase.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {phase.scenarioText}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 text-white shadow-md hover:from-cyan-700 hover:to-blue-700"
          >
            <Link href="/simulation/demo/phase/1">Begin Phase 1</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl bg-white/70 px-8 py-6 backdrop-blur"
          >
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
