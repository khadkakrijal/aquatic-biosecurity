interface Props {
  missedConsequences: string[];
}

export function ConsequenceAlert({ missedConsequences }: Props) {
  if (!missedConsequences.length) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <h3 className="font-semibold text-amber-900">Potential consequences triggered</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900/90">
        {missedConsequences.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}