import type { OfferingFeatureType } from "@prisma/client";

/**
 * ProviderOffering keeps a single flat OfferingFeature list (see
 * docs/IMPLEMENTATION-PLAN.md §4) rather than separate tables per profile
 * section -- deposits/withdrawals, products/trading, and security are all
 * just different OfferingFeatureType values. This groups them for display
 * so the profile page can render three honest sections instead of one
 * undifferentiated list. Add new OfferingFeatureType values to exactly one
 * group; anything left unmapped falls into "products" by default so it's
 * never silently dropped from the page.
 *
 * Deliberately not generic: the repository layer's findBySlug(slug, extra)
 * takes an untyped `extra` include object (see src/lib/repository.ts), so
 * Prisma can't statically infer the OfferingFeature payload shape from
 * getCryptoExchangeByPublicSlug()'s include -- a generic here would have its
 * type parameter fall back to the bare constraint at the call site instead
 * of the real row shape. An explicit row type + a cast at the call site is
 * more reliable than fighting that inference.
 */
export type CryptoFeatureGroup = "deposits" | "security" | "products";

export type CryptoFeatureRow = {
  id: string;
  featureType: OfferingFeatureType;
  label: string | null;
  value: string | null;
  available: boolean | null;
};

const DEPOSIT_WITHDRAWAL_TYPES: OfferingFeatureType[] = [
  "AUD_DEPOSITS",
  "AUD_WITHDRAWALS",
  "PAYID",
  "BANK_TRANSFER",
  "CARD_DEPOSIT",
];

const SECURITY_TYPES: OfferingFeatureType[] = [
  "TWO_FACTOR_AUTH",
  "COLD_STORAGE",
];

export function featureGroup(
  featureType: OfferingFeatureType
): CryptoFeatureGroup {
  if (DEPOSIT_WITHDRAWAL_TYPES.includes(featureType)) return "deposits";
  if (SECURITY_TYPES.includes(featureType)) return "security";
  return "products";
}

export function groupFeatures(
  features: CryptoFeatureRow[]
): Record<CryptoFeatureGroup, CryptoFeatureRow[]> {
  const groups: Record<CryptoFeatureGroup, CryptoFeatureRow[]> = {
    deposits: [],
    security: [],
    products: [],
  };
  for (const feature of features) {
    groups[featureGroup(feature.featureType)].push(feature);
  }
  return groups;
}

/**
 * Human-readable label for a feature row. Prefers the admin-set `label`
 * override (e.g. Swyftx's RECURRING_BUYS -> "Auto Invest" in the seed) --
 * only falls back to formatting the raw enum name when no override is set.
 */
const FEATURE_TYPE_LABELS: Partial<Record<OfferingFeatureType, string>> = {
  AUD_DEPOSITS: "AUD deposits",
  AUD_WITHDRAWALS: "AUD withdrawals",
  PAYID: "PayID",
  BANK_TRANSFER: "Bank transfer",
  CARD_DEPOSIT: "Card deposit",
  MOBILE_APP: "Mobile app",
  WEB_PLATFORM: "Web platform",
  LIMIT_ORDERS: "Limit orders",
  MARKET_ORDERS: "Market orders",
  STOP_ORDERS: "Stop orders",
  RECURRING_BUYS: "Recurring buys",
  STAKING: "Staking",
  API_ACCESS: "API access",
  ADVANCED_CHARTING: "Advanced charting",
  TWO_FACTOR_AUTH: "Two-factor auth",
  COLD_STORAGE: "Cold storage",
  SMSF_SUPPORT: "SMSF support",
  OTC_DESK: "OTC desk",
};

export function formatFeatureLabel(
  featureType: OfferingFeatureType,
  label?: string | null
): string {
  return label || FEATURE_TYPE_LABELS[featureType] || featureType;
}
