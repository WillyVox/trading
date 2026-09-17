import { Card } from "@/components/ui/Card";
import { AvailabilityBadge } from "@/components/offerings/AvailabilityBadge";
import type { AvailabilityStatus } from "@prisma/client";

export type AvailabilityRow = {
  id: string;
  label: string;
  availability: AvailabilityStatus;
  notes?: string | null;
};

/**
 * One profile-page card for a single dimension (Markets / Products /
 * Account types) — same shape across all three, so this is shared rather
 * than duplicated per section (mirrors ProviderFeatureSection's role on
 * the crypto profile page). `notes` renders as a beginner-facing
 * explanation line under the row, not just the raw availability enum —
 * see the master prompt's rule against showing "CONDITIONAL" with no
 * context.
 */
export function OfferingAvailabilitySection({
  title,
  emptyLabel,
  rows,
}: {
  title: string;
  emptyLabel: string;
  rows: AvailabilityRow[];
}) {
  return (
    <Card className="mt-4">
      <h2 className="font-display text-navy mb-4 text-lg font-bold">{title}</h2>
      <ul className="space-y-3 text-sm">
        {rows.map((row) => (
          <li key={row.id} className="border-border border-b pb-3">
            <div className="flex items-center justify-between gap-2">
              <span>{row.label}</span>
              <AvailabilityBadge status={row.availability} />
            </div>
            {row.notes && (
              <p className="text-muted mt-1 text-xs">{row.notes}</p>
            )}
          </li>
        ))}
        {rows.length === 0 && <li className="text-muted">{emptyLabel}</li>}
      </ul>
    </Card>
  );
}
