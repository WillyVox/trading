import type { ProviderFeatureType } from "@prisma/client";
import { featureGroup, type ProviderFeatureGroup } from "./features";

/**
 * Shape the Comparison Engine (Phase 5) needs from each Provider --
 * intentionally a subset of getProviderBySlug()'s full payload (facts/fees/
 * features only; no prosCons/sources/regulations/assets, which the table
 * doesn't render). Built live from getProvidersBySlugs() -- see
 * docs/IMPLEMENTATION-PLAN.md §4/§7: comparisons never duplicate Provider
 * data into compare-specific tables, so changing a fact/fee/feature updates
 * every comparison automatically.
 */
export type ComparisonProvider = {
  id: string;
  slug: string;
  name: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
  facts: { label: string; value: string }[];
  fees: { label: string; displayValue: string | null }[];
  features: { featureType: ProviderFeatureType; label: string | null; value: string | null; available: boolean | null }[];
};

export type ComparisonRow = {
  key: string;
  label: string;
  /** One cell per provider, aligned to the same index/order as the ComparisonProvider[] passed in. `null` means "no data for this provider". */
  values: (string | null)[];
};

export type ComparisonSection = {
  title: string;
  rows: ComparisonRow[];
};

/** Union of fact labels across all compared providers, in first-seen order, so a fact only one provider has still gets its own row (rendered "\u2014" for the rest) instead of being silently dropped. */
export function buildFactRows(providers: ComparisonProvider[]): ComparisonRow[] {
  const labels: string[] = [];
  for (const p of providers) {
    for (const f of p.facts) {
      if (!labels.includes(f.label)) labels.push(f.label);
    }
  }
  return labels.map((label) => ({
    key: `fact:${label}`,
    label,
    values: providers.map((p) => p.facts.find((f) => f.label === label)?.value ?? null),
  }));
}

export function buildFeeRows(providers: ComparisonProvider[]): ComparisonRow[] {
  const labels: string[] = [];
  for (const p of providers) {
    for (const f of p.fees) {
      if (!labels.includes(f.label)) labels.push(f.label);
    }
  }
  return labels.map((label) => ({
    key: `fee:${label}`,
    label,
    values: providers.map((p) => p.fees.find((f) => f.label === label)?.displayValue ?? "Not verified"),
  }));
}

/** One row per ProviderFeatureType seen across the compared providers, split into the same products/deposits/security groups the exchange profile page uses (see src/lib/providers/features.ts) so the two views stay consistent. */
export function buildFeatureSections(providers: ComparisonProvider[]): Record<ProviderFeatureGroup, ComparisonRow[]> {
  const types: ProviderFeatureType[] = [];
  for (const p of providers) {
    for (const f of p.features) {
      if (!types.includes(f.featureType)) types.push(f.featureType);
    }
  }

  const rows: Record<ProviderFeatureGroup, ComparisonRow[]> = { products: [], deposits: [], security: [] };
  for (const type of types) {
    const row: ComparisonRow = {
      key: `feature:${type}`,
      label: type.replace(/_/g, " "),
      values: providers.map((p) => {
        const f = p.features.find((x) => x.featureType === type);
        if (!f) return null;
        if (f.value) return f.value;
        if (f.available === true) return "\u2713";
        if (f.available === false) return "\u2014";
        return "?";
      }),
    };
    rows[featureGroup(type)].push(row);
  }
  return rows;
}

export function buildComparisonSections(providers: ComparisonProvider[]): ComparisonSection[] {
  const featureSections = buildFeatureSections(providers);
  return [
    { title: "Facts", rows: buildFactRows(providers) },
    { title: "Fees", rows: buildFeeRows(providers) },
    { title: "Products & trading", rows: featureSections.products },
    { title: "Deposits & withdrawals", rows: featureSections.deposits },
    { title: "Security", rows: featureSections.security },
  ].filter((section) => section.rows.length > 0);
}
