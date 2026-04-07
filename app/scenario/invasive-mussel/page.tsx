import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
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
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                Scenario introduction
              </h2>
              <p className="text-sm leading-7 text-slate-600">
                This simulation places you in an aquatic biosecurity emergency
                involving a suspected invasive mussel incursion in a busy marina
                environment. The organism is not yet confirmed, but there is
                concern about rapid colonisation, larval dispersal, and spread
                through vessel movement and marine infrastructure.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                As the scenario progresses, you will be asked to respond to
                changing operational conditions using your own judgement. Your
                answers will be evaluated against key biosecurity themes such as
                reporting, surveillance, containment, coordination, and
                stakeholder engagement.
              </p>
              <p className="text-sm leading-7 text-slate-600">
                You will not see the full scenario pathway in advance. Progress
                through the simulation will depend on the quality and
                completeness of your responses at each stage.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
              <h3 className="font-semibold text-slate-900">What to expect</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Respond to the situation using free-text answers</li>
                <li>• Receive feedback based on key operational criteria</li>
                <li>• Progress through the scenario based on your response quality</li>
                <li>• Encounter recovery or escalation pathways where appropriate</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 text-white shadow-md hover:from-cyan-700 hover:to-blue-700"
          >
            <Link href="/simulation/demo/stage/p1">Begin Simulation</Link>
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