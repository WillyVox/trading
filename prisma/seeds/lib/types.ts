import type {
  FeeCalculationBasis,
  FeeCategory,
  FeeChannel,
  FeeTradeSide,
  VerificationStatus,
} from "@prisma/client";

/**
 * Seed-file shapes for OfferingFee / OfferingFeeTier (Phase 2).
 *
 * Seed files use `marketCode` ("ASX", "NYSE", ...) rather than database IDs,
 * exactly like `markets` and `custody`; seedOfferings() resolves it to
 * `marketId`. Omit `marketCode` for an offering-wide fee (e.g. FX conversion).
 *
 * Units: `percentage` is in PERCENT POINTS (0.12 = 0.12%), matching the
 * OfferingFee schema comment. Tier bounds: `maxAmount` is an INCLUSIVE upper
 * bound (null = no upper bound); see the OfferingFeeTier schema comment.
 */
export type OfferingFeeTierSeed = {
  minAmount: number;
  maxAmount?: number | null;
  flatAmount?: number;
  percentage?: number;
};

export type OfferingFeeSeed = {
  feeCategory: FeeCategory;
  channel?: FeeChannel;
  marketCode?: string;
  label: string;
  calculationBasis: FeeCalculationBasis;

  flatAmount?: number;
  percentage?: number;
  currency?: string;
  /** Human-readable value. Required for VARIES; for any other basis it
   * overrides the auto-generated summary (used where the headline needs a
   * short condition attached, e.g. CMC's "$0 first buy up to $1,000"). */
  displayValue?: string;
  notes?: string;

  pricingPlan?: string;
  tradeSide?: FeeTradeSide;
  firstBuyPerSecurityPerDay?: boolean;
  minTradeAmount?: number;
  maxTradeAmount?: number;
  maxTradeAmountInclusive?: boolean;
  excludesMarginLoanSettlement?: boolean;
  gstPercent?: number;

  isPromotional?: boolean;
  validFrom?: Date;
  validTo?: Date;
  promotionalTerms?: string;

  sourceUrl?: string;
  verificationStatus?: VerificationStatus;
  verifiedAt?: Date;

  /** Only for calculationBasis === TIERED. Array order becomes `position`. */
  tiers?: OfferingFeeTierSeed[];
};

/**
 * Fails loudly at seed time on structurally incoherent fee data, so a typo
 * can't silently reach the profile or compare pages. Cheap on purpose: it
 * checks shape, not whether the numbers match the broker's site (that is the
 * research manifest's job -- docs/research/offerings/<slug>.md).
 */
export function assertValidFeeSeed(offeringSlug: string, fee: OfferingFeeSeed) {
  const where = `Fee seed "${fee.label}" (${offeringSlug})`;
  const fail = (msg: string): never => {
    throw new Error(`${where}: ${msg}`);
  };

  const hasTiers = (fee.tiers?.length ?? 0) > 0;

  switch (fee.calculationBasis) {
    case "FLAT":
      if (fee.flatAmount == null) fail("FLAT requires flatAmount.");
      break;
    case "PERCENTAGE":
      if (fee.percentage == null) fail("PERCENTAGE requires percentage.");
      break;
    case "GREATER_OF":
      if (fee.flatAmount == null || fee.percentage == null)
        fail("GREATER_OF requires both flatAmount and percentage.");
      break;
    case "TIERED":
      if (!hasTiers) fail("TIERED requires at least one tier.");
      break;
    case "VARIES":
      if (!fee.displayValue) fail("VARIES requires displayValue.");
      break;
    case "FREE":
      break;
  }

  if (fee.calculationBasis !== "TIERED" && hasTiers)
    fail("tiers are only allowed when calculationBasis is TIERED.");

  if (fee.isPromotional && (!fee.validFrom || !fee.validTo))
    fail("promotional fees must set validFrom and validTo.");

  if (fee.validFrom && fee.validTo && fee.validFrom > fee.validTo)
    fail("validFrom is after validTo.");

  if (hasTiers) {
    const tiers = fee.tiers!;
    tiers.forEach((tier, i) => {
      const isFlat = tier.flatAmount != null;
      const isPct = tier.percentage != null;
      if (isFlat === isPct)
        fail(`tier ${i} must have exactly one of flatAmount or percentage.`);
      if (tier.maxAmount != null && tier.maxAmount <= tier.minAmount)
        fail(`tier ${i} maxAmount must be greater than minAmount.`);
      if (i === 0 && tier.minAmount !== 0) fail("first tier must start at 0.");
      if (i > 0) {
        const prevMax = tiers[i - 1].maxAmount;
        if (prevMax == null)
          fail(`tier ${i - 1} has no upper bound but is followed by a tier.`);
        // Contiguous: either a shared edge ("over X up to Y") or a one-cent
        // gap ("up to $9,999.99" / "$10,000 and above").
        const gap = Math.round((tier.minAmount - (prevMax as number)) * 100);
        if (gap !== 0 && gap !== 1)
          fail(`tier ${i} is not contiguous with tier ${i - 1}.`);
      }
    });
    if (tiers[tiers.length - 1].maxAmount != null)
      fail("last tier must have no upper bound (maxAmount null/omitted).");
  }
}
