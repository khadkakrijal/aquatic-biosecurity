
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SummaryResult } from "@/app/types/simulation";

interface Props {
  summary: SummaryResult;
  aiFeedback?: string;
}

export function SummaryReport({ summary, aiFeedback }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Preparedness Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{summary.readinessLabel}</Badge>
            <Badge variant="outline">Score: {summary.totalScore}%</Badge>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Strengths</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {summary.strengths.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Gaps</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {summary.gaps.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Themes and Consequences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Themes covered</h3>
            <div className="flex flex-wrap gap-2">
              {summary.coveredThemes.map((theme) => (
                <Badge key={theme} variant="secondary">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Missed consequences</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {summary.missedConsequences.slice(0, 8).map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          {aiFeedback ? (
            <div className="rounded-2xl border bg-muted/40 p-4">
              <h3 className="mb-2 font-semibold">Embedded AI feedback</h3>
              <p className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
                {aiFeedback}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}