import { Card } from "@/components/ui/Card";
import { VerificationBadge } from "@/components/trust/VerificationBadge";
import { custodyTypeCopy } from "@/lib/share-trading/labels";
import type { CustodyType, VerificationStatus } from "@prisma/client";

export type CustodyRow = {
  id: string;
  marketName: string | null;
  custodyType: CustodyType;
  custodianName: string | null;
  verificationStatus: VerificationStatus;
};

/**
 * Custody is called out as its own section (not folded into "Facts")
 * because it's the single most consequential, most misunderstood
 * beginner concept per the master prompt's Section 14/61 — a bare
 * "CHESS: Yes" tells a beginner nothing about what that means for them.
 * Every row is scoped to a specific market (see the OfferingCustody
 * schema comment on why `marketId` is nullable but Milestone 1's seed
 * always sets it) so CommSec's ASX-vs-international split renders as two
 * honestly different rows, not one averaged-out claim.
 */
export function CustodySection({ rows }: { rows: CustodyRow[] }) {
  return (
    <Card className="mt-4">
      <h2 className="font-display text-navy mb-4 text-lg font-bold">
        Custody &amp; ownership
      </h2>
      <ul className="space-y-4 text-sm">
        {rows.map((row) => {
          const copy = custodyTypeCopy(row.custodyType);
          return (
            <li key={row.id} className="border-border border-b pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {row.marketName ?? "All markets"} — {copy.label}
                </span>
                <VerificationBadge status={row.verificationStatus} />
              </div>
              <p className="text-muted mt-1 text-xs">{copy.explainer}</p>
              {row.custodianName && (
                <p className="text-muted mt-1 text-xs">
                  Custodian: {row.custodianName}
                </p>
              )}
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="text-muted">No custody data yet.</li>
        )}
      </ul>
    </Card>
  );
}
