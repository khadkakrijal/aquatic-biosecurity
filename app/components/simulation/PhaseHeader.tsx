import { Badge } from "@/components/ui/badge";


interface Props {
  phaseNumber: number;
  title: string;
  timeframe: string;
}

export function PhaseHeader({ phaseNumber, title, timeframe }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>Phase {phaseNumber}</Badge>
        <Badge variant="outline">{timeframe}</Badge>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aquatic biosecurity response and preparedness exercise
        </p>
      </div>
    </div>
  );
}