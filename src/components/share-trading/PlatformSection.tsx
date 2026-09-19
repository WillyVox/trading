import type { FeeCategory } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { formatFeeCategory } from "@/lib/share-trading/labels";
import { FeeDisplay, type FeeRowData } from "./FeeDisplay";

export type PromotionRow = {
  id: string;
  label: string;
  value: string;
  validFrom: string;
  validTo: string;
  terms: string | null;
};

/**
 * Fees section for a share trading platform's profile page (Phase 2 step
 * 6 — see the fee-schema doc's "Profile page" mockup). Standing fees are
 * grouped by category (Brokerage, FX conversion, etc.) exactly like the
 * mockup; active promotions render as their own callout above the
 * standing schedule, never folded into or replacing it — the direct fix
 * for the "headline $0 hides the real cost" trap the schema proposal
 * warned about. `promotions` is deliberately a flat list rather than
 * attached to one specific standing fee: a promo like CommSec's applies
 * to a whole category/channel, not to a single fee row, so a generic
 * per-fee association would be forcing a link the data doesn't actually
 * have.
 *
 * `fees` should already exclude promotional rows (isPromotional: true) --
 * the page is expected to have split them before building `promotions`,
 * matching how buildFeeRows() in offerings/compare.ts excludes them too.
 */
export function OfferingFeeSection({
  fees,
  promotions = [],
}: {
  fees: (FeeRowData & { category: FeeCategory })[];
  promotions?: PromotionRow[];
}) {
  if (fees.length === 0 && promotions.length === 0) return null;

  const groups = new Map<FeeCategory, FeeRowData[]>();
  for (const fee of fees) {
    const list = groups.get(fee.category) ?? [];
    list.push(fee);
    groups.set(fee.category, list);
  }

  return (
    <Card className="mt-4">
      <h2 className="font-display text-navy mb-4 text-lg font-bold">Fees</h2>

      {promotions.length > 0 && (
        <ul className="mb-5 space-y-3">
          {promotions.map((promo) => (
            <li
              key={promo.id}
              className="border-gold-soft bg-panel-secondary rounded-xl border p-3"
            >
              <p className="text-navy text-sm font-semibold">
                {"\u26a1"} Promotional: {promo.label} {"\u2014"} {promo.value}
              </p>
              <p className="text-muted mt-1 text-xs">
                Valid {promo.validFrom} {"\u2013"} {promo.validTo}. Standard
                schedule below applies outside this window.
              </p>
              {promo.terms && (
                <p className="text-muted mt-1 text-xs">{promo.terms}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-6">
        {Array.from(groups.entries()).map(([category, categoryFees]) => (
          <div key={category}>
            <h3 className="text-muted mb-2 text-xs font-bold tracking-wide uppercase">
              {formatFeeCategory(category)}
            </h3>
            <ul className="divide-border divide-y">
              {categoryFees.map((fee) => (
                <li key={fee.id} className="py-3 first:pt-0 last:pb-0">
                  <FeeDisplay fee={fee} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {fees.length === 0 && (
        <p className="text-muted text-sm">
          No standing fee schedule confirmed yet.
        </p>
      )}
    </Card>
  );
}
