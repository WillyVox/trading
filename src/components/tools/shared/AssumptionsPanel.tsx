export function AssumptionsPanel({ assumptions, exclusions }: { assumptions: string[]; exclusions: string[] }) {
  return <div className="space-y-5">
    {assumptions.length > 0 && <div><h3 className="text-navy font-bold">Assumptions and conditions</h3><ul className="text-muted mt-1 list-disc space-y-1 pl-5 leading-6">{assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div>}
    <div><h3 className="text-navy font-bold">Not included</h3><ul className="text-muted mt-1 list-disc space-y-1 pl-5 leading-6">{exclusions.map((item) => <li key={item}>{item}</li>)}</ul></div>
  </div>;
}
