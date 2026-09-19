import type { FeeCalculationBasis } from "@prisma/client";
import { formatFeeValue, formatMoney } from "@/lib/share-trading/labels";

export type FeeTierRow = {
  id: string;
  minAmount: number;
  maxAmount: number | null;
  flatAmount: number | null;
  percentage: number | null;
};

export type FeeRowData = {
  id: string;
  label: string;
  calculationBasis: FeeCalculationBasis;
  flatAmount: number | null;
  percentage: number | null;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  sourceUrl: string | null;
  tiers: FeeTierRow[];
};

/** "Up to $1,000" / "$1,000 \u2013 $3,000" / "Over $25,000" -- the tier's own
 *  bounds, not its flat/percentage value (see formatTierValue for that).
 *  Matches the OfferingFeeTier schema comment's "up to and including"
 *  wording, since every seeded bound is inclusive. */
function formatTierRange(tier: FeeTierRow, currency: string | null): string {
  const min = formatMoney(tier.minAmount, currency);
  if (tier.maxAmount == null) return `Over ${min}`;
  const max = formatMoney(tier.maxAmount, currency);
  return tier.minAmount === 0 ? `Up to ${max}` : `${min} \u2013 ${max}`;
}

function formatTierValue(tier: FeeTierRow, currency: string | null): string {
  if (tier.flatAmount != null) return formatMoney(tier.flatAmount, currency);
  if (tier.percentage != null) return `${tier.percentage}%`;
  return "\u2014";
}

/**
 * One fee, profile-page detail level (see the Phase 2 fee-schema doc's
 * "Profile page" mockup) -- a real tiers table when calculationBasis is
 * TIERED, otherwise just the formatted headline value, plus notes and a
 * source link. Renders nothing about promotions; OfferingFeeSection
 * layers the promotional callout on top of the standing fee it applies to,
 * since a promo is never shown as if it replaced the standing schedule.
 */
export function FeeDisplay({ fee }: { fee: FeeRowData }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-navy text-sm font-semibold">{fee.label}</span>
        {fee.calculationBasis !== "TIERED" && (
          <span className="text-navy text-sm font-bold">
            {formatFeeValue(fee)}
          </span>
        )}
      </div>

      {fee.calculationBasis === "TIERED" && fee.tiers.length > 0 && (
        <div className="border-border mt-2 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <tbody>
              {fee.tiers.map((tier) => (
                <tr
                  key={tier.id}
                  className="border-border border-b last:border-b-0"
                >
                  <td className="text-muted px-3 py-2">
                    {formatTierRange(tier, fee.currency)}
                  </td>
                  <td className="text-navy px-3 py-2 text-right font-semibold">
                    {formatTierValue(tier, fee.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fee.notes && <p className="text-muted mt-1.5 text-xs">{fee.notes}</p>}

      {fee.sourceUrl && (
        <a
          href={fee.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-blue hover:text-navy mt-1 inline-block text-xs underline underline-offset-2"
        >
          Source {"\u2197"}
        </a>
      )}
    </div>
  );
}
