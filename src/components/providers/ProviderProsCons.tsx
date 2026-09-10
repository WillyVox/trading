import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";

type ProsCon = {
  id: string;
  type: "PRO" | "LIMITATION";
  label: string;
  detail: string | null;
  sourceUrl: string | null;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
};

/**
 * Renders sourced pros/limitations, never bare marketing claims -- each
 * item carries the same verification badge as Facts/Fees so an "unverified"
 * pro reads with the same honesty as an unverified fee (see cross-cutting
 * rule in docs/IMPLEMENTATION-PLAN.md: never let commission or editorial
 * tone imply certainty the sourcing doesn't support).
 */
export function ProviderProsCons({ items }: { items: ProsCon[] }) {
  const pros = items.filter((i) => i.type === "PRO");
  const limitations = items.filter((i) => i.type === "LIMITATION");

  if (pros.length === 0 && limitations.length === 0) return null;

  return (
    <Card className="mt-4">
      <h2 className="mb-4 font-display text-lg font-bold text-navy">Pros &amp; limitations</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-green">Pros</h3>
          <ul className="mt-2 space-y-3 text-sm">
            {pros.map((p) => (
              <ProsConItem key={p.id} item={p} />
            ))}
            {pros.length === 0 && <li className="text-muted">None recorded yet.</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-red">Limitations</h3>
          <ul className="mt-2 space-y-3 text-sm">
            {limitations.map((l) => (
              <ProsConItem key={l.id} item={l} />
            ))}
            {limitations.length === 0 && <li className="text-muted">None recorded yet.</li>}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function ProsConItem({ item }: { item: ProsCon }) {
  const content = (
    <div>
      <div className="flex items-start justify-between gap-2">
        <span>{item.label}</span>
        <VerificationBadge status={item.verificationStatus} />
      </div>
      {item.detail && <p className="mt-1 text-xs text-muted">{item.detail}</p>}
    </div>
  );

  if (!item.sourceUrl) return <li>{content}</li>;

  return (
    <li>
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {content}
      </a>
    </li>
  );
}
