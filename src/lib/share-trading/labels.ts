import type {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  FeeCalculationBasis,
  FeeCategory,
  InvestmentProductType,
} from "@prisma/client";
import { GLOSSARY, type GlossaryKey } from "@/lib/glossary/terms";

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
// The wording for the five real ownership structures lives in the glossary
// (src/lib/glossary/terms.ts) so the profile page, list cards and compare
// tables all say the same thing; only the labels and the catch-all
// MIXED/OTHER/UNKNOWN copy stay here because they aren't glossary terms.
const CUSTODY_TYPE_COPY: Record<
  CustodyType,
  { label: string; explainer: string }
> = {
  CHESS_SPONSORED: {
    label: "CHESS-sponsored",
    explainer: GLOSSARY["chess-sponsored"].plainEnglish,
  },
  ISSUER_SPONSORED: {
    label: "Issuer-sponsored",
    explainer: GLOSSARY["issuer-sponsored"].plainEnglish,
  },
  CUSTODIAL: {
    label: "Custodial",
    explainer: GLOSSARY.custodial.plainEnglish,
  },
  DIRECT_REGISTRATION: {
    label: "Direct registration",
    explainer: GLOSSARY["direct-registration"].plainEnglish,
  },
  OMNIBUS: {
    label: "Omnibus/pooled",
    explainer: GLOSSARY.omnibus.plainEnglish,
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

/**
 * Glossary entry that explains a custody type, or null for the catch-all
 * types (MIXED / OTHER / UNKNOWN) that have no single definition to give.
 */
const CUSTODY_TERM_KEYS: Partial<Record<CustodyType, GlossaryKey>> = {
  CHESS_SPONSORED: "chess-sponsored",
  ISSUER_SPONSORED: "issuer-sponsored",
  CUSTODIAL: "custodial",
  DIRECT_REGISTRATION: "direct-registration",
  OMNIBUS: "omnibus",
};

export function custodyTermKey(type: CustodyType): GlossaryKey | null {
  return CUSTODY_TERM_KEYS[type] ?? null;
}

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

/**
 * FeeCategory is shared across multiple product domains in Prisma.
 * This module is share-trading-specific, so it intentionally defines
 * labels only for fee categories relevant to share-trading.
 */
const FEE_CATEGORY_LABELS: Partial<Record<FeeCategory, string>> = {
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
  if (tier.flatAmount != null) {
    return formatMoney(Number(tier.flatAmount), currency);
  }

  if (tier.percentage != null) {
    return `${Number(tier.percentage)}%`;
  }

  return "\u2014";
}

/**
 * One display string for a fee row's cell.
 *
 * `displayValue` always wins when the seed explicitly provides one because
 * it can describe conditions that calculationBasis alone cannot express.
 *
 * TIERED shows the first and last tier values joined by an en dash.
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
  if (fee.displayValue) {
    return fee.displayValue;
  }

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
      if (fee.tiers.length === 0) {
        return "\u2014";
      }

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

/**
 * Preference order when more than one non-promotional fee matches the same
 * bucket for one share-trading platform.
 *
 * The standard online settlement channel is preferred because it is the
 * headline fee most retail users are likely to compare.
 */
export function pickHeadlineFee<T extends { channel: string | null }>(
  candidates: T[]
): T | null {
  if (candidates.length === 0) {
    return null;
  }

  return (
    candidates.find((fee) => fee.channel === "ONLINE_STANDARD_SETTLEMENT") ??
    candidates.find((fee) => fee.channel === null) ??
    candidates[0]
  );
}

/**
 * Chip-sized variant of formatFeeValue() for a share-trading platform's
 * headline brokerage figure.
 *
 * Only TIERED receives the "from <lowest tier>" treatment and caveat flag.
 */
export function formatHeadlineFee(fee: {
  calculationBasis: FeeCalculationBasis;
  flatAmount: unknown;
  percentage: unknown;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  tiers: { flatAmount: unknown; percentage: unknown }[];
}): {
  value: string;
  hasCaveat: boolean;
} {
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

  return {
    value: formatFeeValue(fee),
    hasCaveat: false,
  };
}
