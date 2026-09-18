import type {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  FeeCalculationBasis,
  FeeCategory,
  InvestmentProductType,
} from "@prisma/client";

const PRODUCT_TYPE_LABELS: Record<InvestmentProductType, string> = {
  AU_SHARES: "Australian shares",
  INTERNATIONAL_SHARES: "International shares",
  ETF: "ETFs",
  OPTIONS: "Options",
  BONDS: "Bonds",
  MANAGED_FUNDS: "Managed funds",
  FUTURES: "Futures",
  WARRANTS: "Warrants",
  FOREX: "Forex",
  CFD: "CFDs",
  OTHER: "Other",
};

export function formatProductType(type: InvestmentProductType): string {
  return PRODUCT_TYPE_LABELS[type] ?? type;
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  INDIVIDUAL: "Individual",
  JOINT: "Joint",
  COMPANY: "Company",
  TRUST: "Trust",
  SMSF: "SMSF",
  MINOR: "Minor",
  ADVISER: "Adviser",
  PROFESSIONAL: "Professional/wholesale",
  OTHER: "Other",
};

export function formatAccountType(type: AccountType): string {
  return ACCOUNT_TYPE_LABELS[type] ?? type;
}

// Beginner-facing explanations, not just enum labels — see the master
// prompt's "Beginner First" principle: never show "CHESS: Yes" alone.
const CUSTODY_TYPE_COPY: Record<
  CustodyType,
  { label: string; explainer: string }
> = {
  CHESS_SPONSORED: {
    label: "CHESS-sponsored",
    explainer:
      "Your shares are registered directly in your name on the ASX under your own Holder Identification Number (HIN), rather than held by the broker on your behalf.",
  },
  ISSUER_SPONSORED: {
    label: "Issuer-sponsored",
    explainer:
      "Your holding is registered directly with the company's share registry under a Security Reference Number (SRN), not through a broker's HIN.",
  },
  CUSTODIAL: {
    label: "Custodial",
    explainer:
      "The broker (or its custodian) holds the legal title to these shares on your behalf. You retain beneficial ownership, but the holding isn't registered directly in your own name.",
  },
  DIRECT_REGISTRATION: {
    label: "Direct registration",
    explainer: "Your holding is registered directly in your own name.",
  },
  OMNIBUS: {
    label: "Omnibus/pooled",
    explainer:
      "Your holding is pooled together with other customers' holdings under one nominee account, rather than individually registered.",
  },
  MIXED: {
    label: "Mixed",
    explainer:
      "This offering uses more than one ownership structure depending on the market or account type — see the notes for this specific market.",
  },
  OTHER: {
    label: "Other",
    explainer: "See the notes and source for this specific market.",
  },
  UNKNOWN: {
    label: "Not yet confirmed",
    explainer:
      "We haven't been able to confirm the ownership structure for this market against an official source yet.",
  },
};

export function custodyTypeCopy(type: CustodyType) {
  return CUSTODY_TYPE_COPY[type] ?? CUSTODY_TYPE_COPY.OTHER;
}

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Available",
  UNAVAILABLE: "Not available",
  CONDITIONAL: "Conditional",
  LIMITED: "Limited",
  UNKNOWN: "Not yet confirmed",
};

export function formatAvailability(status: AvailabilityStatus): string {
  return AVAILABILITY_LABELS[status] ?? status;
}

const FEE_CATEGORY_LABELS: Record<FeeCategory, string> = {
  BROKERAGE: "Brokerage",
  FX_CONVERSION: "FX conversion",
  ACCOUNT_KEEPING: "Account-keeping",
  INACTIVITY: "Inactivity",
  WITHDRAWAL: "Withdrawal",
  DEPOSIT: "Deposit",
  EXCHANGE_TRANSFER: "Exchange transfer",
  OTHER: "Other",
};

export function formatFeeCategory(category: FeeCategory): string {
  return FEE_CATEGORY_LABELS[category] ?? category;
}

/** "$5" / "$29.95" — trims a bare ".00", never rounds away real cents. */
export function formatMoney(amount: number, currency?: string | null): string {
  const prefix = !currency || currency === "AUD" ? "$" : `${currency} $`;
  const formatted = amount.toFixed(2).replace(/\.00$/, "");
  return `${prefix}${formatted}`;
}

function formatTierBound(
  tier: { flatAmount: unknown; percentage: unknown },
  currency?: string | null
): string {
  if (tier.flatAmount != null)
    return formatMoney(Number(tier.flatAmount), currency);
  if (tier.percentage != null) return `${Number(tier.percentage)}%`;
  return "\u2014";
}

/**
 * One display string for a fee row's cell — used by buildFeeRows() in
 * offerings/compare.ts. `displayValue` always wins when the seed set one:
 * per the OfferingFeeSeed comment in prisma/seeds/offerings/types.ts, it's
 * there specifically to attach a short condition the calculationBasis
 * alone can't express (e.g. CMC's "$0 first buy up to $1,000, per
 * security, per day"). Only fall through to the calculationBasis switch
 * when the seed didn't need that override.
 *
 * TIERED shows the first and last tier's own values joined by "\u2013"
 * (e.g. "$5 \u2013 0.12%, tiered") rather than picking out only the flat
 * tiers — consistent regardless of whether a schedule's top tier happens
 * to be flat or percentage-based, rather than a rule that only reads
 * right for schedules shaped like CommSec's.
 */
export function formatFeeValue(fee: {
  calculationBasis: FeeCalculationBasis;
  flatAmount: unknown;
  percentage: unknown;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  tiers: { flatAmount: unknown; percentage: unknown }[];
}): string {
  if (fee.displayValue) return fee.displayValue;

  const flat = fee.flatAmount != null ? Number(fee.flatAmount) : null;
  const pct = fee.percentage != null ? Number(fee.percentage) : null;

  switch (fee.calculationBasis) {
    case "FREE":
      return "Free";
    case "FLAT":
      return flat != null ? formatMoney(flat, fee.currency) : "\u2014";
    case "PERCENTAGE":
      return pct != null ? `${pct}%` : "\u2014";
    case "GREATER_OF":
      return flat != null && pct != null
        ? `${formatMoney(flat, fee.currency)} or ${pct}%`
        : "\u2014";
    case "TIERED": {
      if (fee.tiers.length === 0) return "\u2014";
      const first = fee.tiers[0];
      const last = fee.tiers[fee.tiers.length - 1];
      const firstVal = formatTierBound(first, fee.currency);
      const lastVal = formatTierBound(last, fee.currency);
      return firstVal === lastVal
        ? `${firstVal}, tiered`
        : `${firstVal} \u2013 ${lastVal}, tiered`;
    }
    case "VARIES":
      return fee.notes ?? "Varies";
    default:
      return "\u2014";
  }
}

/** Preference order when more than one non-promotional fee matches the same
 *  bucket for one offering (e.g. CommSec's four ASX brokerage schedules by
 *  settlement channel): the plain online channel is what most retail
 *  readers are actually choosing between, so it's the headline value;
 *  anything channel-specific but non-standard falls back to first-seen.
 *  Generic over T so both offerings/compare.ts (OfferingDetail's fees) and
 *  OfferingListCard (OfferingListItem's identically-shaped fees) can share
 *  one selection rule rather than two copies that could drift apart. */
export function pickHeadlineFee<T extends { channel: string | null }>(
  candidates: T[]
): T | null {
  if (candidates.length === 0) return null;
  return (
    candidates.find((f) => f.channel === "ONLINE_STANDARD_SETTLEMENT") ??
    candidates.find((f) => f.channel === null) ??
    candidates[0]
  );
}

/**
 * Chip-sized variant of formatFeeValue() for OfferingListCard's headline
 * brokerage figure (see the list-card mockup: "AU brokerage from $5*").
 * Only TIERED gets the "from <lowest tier>" treatment with a caveat flag --
 * every other basis is already a single number/percentage, so the plain
 * formatFeeValue() string reads fine as a chip on its own with nothing to
 * caveat.
 */
export function formatHeadlineFee(fee: {
  calculationBasis: FeeCalculationBasis;
  flatAmount: unknown;
  percentage: unknown;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  tiers: { flatAmount: unknown; percentage: unknown }[];
}): { value: string; hasCaveat: boolean } {
  if (
    !fee.displayValue &&
    fee.calculationBasis === "TIERED" &&
    fee.tiers.length > 0
  ) {
    return {
      value: `from ${formatTierBound(fee.tiers[0], fee.currency)}`,
      hasCaveat: true,
    };
  }
  return { value: formatFeeValue(fee), hasCaveat: false };
}
