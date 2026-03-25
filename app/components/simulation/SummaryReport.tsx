import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StageResult {
  nodeId: string;
  title: string;
  phaseNumber: number;
  decision: "pass" | "partial" | "fail";
}

interface SummaryReportProps {
  outcomeLabel: string;
  overallScore?: number;
  strengths: string[];
  gaps: string[];
  branchPath: string[];
  stageResults: StageResult[];
  aiFeedback?: string;
}

export function SummaryReport({
  outcomeLabel,
  overallScore,
  strengths,
  gaps,
  branchPath,
  stageResults,
  aiFeedback,
}: SummaryReportProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Simulation Outcome</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{outcomeLabel}</Badge>
            {typeof overallScore === "number" ? (
              <Badge variant="outline">Score: {overallScore}%</Badge>
            ) : null}
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Strengths</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {strengths.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Key gaps</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {gaps.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Simulation Pathway</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <h3 className="mb-2 font-semibold">Branch path</h3>
            <div className="flex flex-wrap gap-2">
              {branchPath.map((step, index) => (
                <Badge key={`${step}-${index}`} variant="secondary">
                  {step}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Stage results</h3>
            <div className="space-y-3">
              {stageResults.map((stage) => (
                <div
                  key={stage.nodeId}
                  className="rounded-2xl border p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        Phase {stage.phaseNumber} - {stage.title}
                      </p>
                    </div>

                    <Badge
                      className={`capitalize ${
                        stage.decision === "pass"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : stage.decision === "partial"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {stage.decision}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {aiFeedback ? (
            <div className="rounded-2xl border bg-muted/40 p-4">
              <h3 className="mb-2 font-semibold">Final AI feedback</h3>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {aiFeedback}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}