import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { invasiveMusselScenario } from "@/app/data/invasive-mussel-scenario";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge>Admin Prototype</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Scenario Content Overview
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This prototype admin view shows the aquatic scenario structure that
              will later connect to a database and editable forms.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/scenario/invasive-mussel">Back to scenario</Link>
          </Button>
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>{invasiveMusselScenario.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-muted-foreground">
              {invasiveMusselScenario.overview}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">6 phases</Badge>
              <Badge variant="secondary">Critical criteria tracking</Badge>
              <Badge variant="secondary">Decision impact scoring</Badge>
              <Badge variant="secondary">Embedded AI summary</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {invasiveMusselScenario.phases.map((phase) => (
            <Card key={phase.phaseNumber} className="rounded-3xl">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Phase {phase.phaseNumber}</Badge>
                  <Badge variant="outline">{phase.timeframe}</Badge>
                </div>
                <CardTitle className="pt-2">{phase.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-7 text-muted-foreground">
                  {phase.scenarioText}
                </p>

                <div>
                  <h3 className="mb-2 font-semibold">Criteria</h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {phase.criteria.map((criterion) => (
                      <li key={criterion.id}>
                        {criterion.text} — <span className="italic">{criterion.theme}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Questions</h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {phase.questions.map((question) => (
                      <li key={question.id}>{question.text}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Decision options</h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {phase.decisionOptions.map((option) => (
                      <li key={option.id}>
                        {option.text} — <span className="italic">{option.impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}