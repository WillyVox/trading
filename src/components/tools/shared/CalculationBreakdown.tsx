export function CalculationBreakdown({ label, expression, explanation }: { label: string; expression?: string; explanation: string }) {
  return <div className="space-y-5">
    <div><h3 className="text-navy font-bold">Why this result</h3><p className="text-muted mt-1 leading-6">{explanation}</p></div>
    <div><h3 className="text-navy font-bold">Applicable pricing rule</h3><p className="text-muted mt-1 leading-6">{label}</p>{expression && <code className="bg-panel-secondary mt-2 block overflow-x-auto rounded-lg px-3 py-2 text-xs whitespace-normal break-words">{expression}</code>}</div>
  </div>;
}
