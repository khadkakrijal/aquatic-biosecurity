"use client";

import { Criterion } from "@/app/types/simulation";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";





interface Props {
  criteria: Criterion[];
  selectedCriteriaIds: string[];
  onToggle: (criterionId: string, checked: boolean) => void;
}

export function CriticalCriteriaList({
  criteria,
  selectedCriteriaIds,
  onToggle,
}: Props) {
  return (
    <div className="space-y-4">
      {criteria.map((criterion) => {
        const checked = selectedCriteriaIds.includes(criterion.id);

        return (
          <div
            key={criterion.id}
            className="rounded-2xl border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={checked}
                onCheckedChange={(value) => onToggle(criterion.id, Boolean(value))}
                className="mt-1"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{criterion.text}</p>
                  <Badge variant="outline">{criterion.theme}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  If missed: {criterion.consequence}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}