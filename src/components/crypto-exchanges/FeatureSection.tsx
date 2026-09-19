import { Card } from "@/components/ui/Card";
import type { CryptoFeatureRow } from "@/lib/crypto-exchanges/features";

/**
 * One profile-page card for a single feature group (products/trading,
 * deposits & withdrawals, security). Shares the same tri-state rendering
 * the old flat "Features" card used (checkmark / dash / "?" for
 * available === true|false|null) so an unresearched feature still reads as
 * honestly unknown rather than silently missing -- see cross-cutting rule
 * against guessing provider facts.
 */
export function CryptoExchangeFeatureSection({
  title,
  emptyLabel,
  features,
}: {
  title: string;
  emptyLabel: string;
  features: CryptoFeatureRow[];
}) {
  return (
    <Card className="mt-4">
      <h2 className="font-display text-navy mb-4 text-lg font-bold">{title}</h2>
      <ul className="space-y-2 text-sm">
        {features.map((f) => (
          <li
            key={f.id}
            className="border-border flex justify-between border-b pb-2"
          >
            <span className="text-muted">
              {(f.label ?? f.featureType).toString().replace(/_/g, " ")}
            </span>
            <span>
              {f.value ??
                (f.available === false
                  ? "\u2014"
                  : f.available === true
                    ? "\u2713"
                    : "?")}
            </span>
          </li>
        ))}
        {features.length === 0 && <li className="text-muted">{emptyLabel}</li>}
      </ul>
    </Card>
  );
}
