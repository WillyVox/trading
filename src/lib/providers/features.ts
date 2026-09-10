import type { ProviderFeatureType } from "@prisma/client";

/**
 * The Provider schema keeps a single flat ProviderFeature list (see
 * docs/IMPLEMENTATION-PLAN.md §4) rather than separate tables per profile
 * section -- deposits/withdrawals, products/trading, and security are all
 * just different ProviderFeatureType values. This groups them for display
 * so the profile page can render three honest sections instead of one
 * undifferentiated list. Add new ProviderFeatureType values to exactly one
 * group; anything left unmapped falls into "products" by default so it's
 * never silently dropped from the page.
 */
export type ProviderFeatureGroup = "deposits" | "security" | "products";

/** Fields the profile page needs to render a feature row. */
export type ProfileFeature = {
  id: string;
  featureType: ProviderFeatureType;
  label: string | null;
  value: string | null;
  available: boolean | null;
};

const DEPOSIT_WITHDRAWAL_TYPES: ProviderFeatureType[] = [
  "AUD_DEPOSITS",
  "AUD_WITHDRAWALS",
  "PAYID",
  "BANK_TRANSFER",
  "CARD_DEPOSIT",
];

const SECURITY_TYPES: ProviderFeatureType[] = ["TWO_FACTOR_AUTH", "COLD_STORAGE"];

export function featureGroup(featureType: ProviderFeatureType): ProviderFeatureGroup {
  if (DEPOSIT_WITHDRAWAL_TYPES.includes(featureType)) return "deposits";
  if (SECURITY_TYPES.includes(featureType)) return "security";
  return "products";
}

export function groupFeatures<T extends ProfileFeature>(features: T[]) {
  const groups: Record<ProviderFeatureGroup, T[]> = { deposits: [], security: [], products: [] };
  for (const feature of features) {
    groups[featureGroup(feature.featureType)].push(feature);
  }
  return groups;
}
