import type { OfferingFeatureType } from "@prisma/client";
import { featureGroup, type CryptoFeatureGroup } from "./features";
import type {
  CompareRow,
  CompareSection,
  CompareSubject,
} from "@/components/compare/types";

export type { CompareRow, CompareSection };

/**
 * Shape the Comparison Engine (Phase 5) needs from each Provider --
 * intentionally a subset of getProviderBySlug()'s full payload (facts/fees/
 * features only; no prosCons/sources/regulations/assets, which the table
 * doesn't render). Built live from getProvidersBySlugs() -- see
 * docs/IMPLEMENTATION-PLAN.md §4/§7: comparisons never duplicate Provider
 * data into compare-specific tables, so changing a fact/fee/feature updates
 * every comparison automatically.
 *
 * CompareRow/CompareSection now live in shared comparison UI types
 * (shared with the offering domain's compare engine, see
 * src/lib/share-trading/comparison.ts) -- re-exported here so existing imports
 * from this module keep working.
 */
export type CryptoComparisonEntry = {
  id: string;
  slug: string;
  name: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
  logo: string | null;
  website: string | null;
  facts: { label: string; value: string }[];
  fees: { label: string; displayValue: string | null }[];
  features: {
    featureType: OfferingFeatureType;
    label: string | null;
    value: string | null;
    available: boolean | null;
  }[];
};

/** Minimal shape toCompareSubjects needs from an affiliate link -- see
 * getActiveAffiliateLinksForProviderSlugs, whose Map is keyed by
 * Provider.slug (== AffiliateLink.partnerSlug by convention). */
type AffiliateLinkLookup = Map<string, { partnerSlug: string }>;

/**
 * Maps CryptoComparisonEntry rows to the domain-agnostic CompareSubject
 * shape CompareTable/CompareMobileCards render -- the one place that knows
 * a crypto exchange's profile lives at /crypto/exchanges/[slug].
 *
 * `cta` resolves in two tiers: an active AffiliateLink for this provider's
 * slug (routed through /go/[partner] so the click is recorded) wins;
 * otherwise the provider's own `website` is used directly; otherwise no
 * button renders at all -- see CompareSubject's comment on why a null
 * cta is preferred over a dead one. Takes the affiliate map as a separate
 * argument rather than looking it up here because that lookup is async
 * (getActiveAffiliateLinksForProviderSlugs hits the DB) and this function
 * stays sync and pure; callers fetch the map once and pass it in.
 */
export function toCompareSubjects(
  providers: CryptoComparisonEntry[],
  affiliateLinks?: AffiliateLinkLookup
): CompareSubject[] {
  return providers.map((p) => {
    const affiliateLink = affiliateLinks?.get(p.slug);
    const cta = affiliateLink
      ? { href: `/go/${p.slug}?placement=compare`, isAffiliate: true }
      : p.website
        ? { href: p.website, isAffiliate: false }
        : null;

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      verificationStatus: p.verificationStatus,
      profileHref: `/crypto/exchanges/${p.slug}`,
      logo: p.logo,
      cta,
    };
  });
}

/** Union of fact labels across all compared providers, in first-seen order, so a fact only one provider has still gets its own row (rendered "\u2014" for the rest) instead of being silently dropped. */
export function buildFactRows(
  providers: CryptoComparisonEntry[]
): CompareRow[] {
  const labels: string[] = [];
  for (const p of providers) {
    for (const f of p.facts) {
      if (!labels.includes(f.label)) labels.push(f.label);
    }
  }
  return labels.map((label) => ({
    key: `fact:${label}`,
    label,
    values: providers.map(
      (p) => p.facts.find((f) => f.label === label)?.value ?? null
    ),
  }));
}

export function buildFeeRows(providers: CryptoComparisonEntry[]): CompareRow[] {
  const labels: string[] = [];
  for (const p of providers) {
    for (const f of p.fees) {
      if (!labels.includes(f.label)) labels.push(f.label);
    }
  }
  return labels.map((label) => ({
    key: `fee:${label}`,
    label,
    values: providers.map(
      (p) =>
        p.fees.find((f) => f.label === label)?.displayValue ?? "Not verified"
    ),
  }));
}

/** One row per OfferingFeatureType seen across the compared providers, split into the same products/deposits/security groups the exchange profile page uses (see src/lib/crypto-exchanges/features.ts) so the two views stay consistent. */
export function buildFeatureSections(
  providers: CryptoComparisonEntry[]
): Record<CryptoFeatureGroup, CompareRow[]> {
  const types: OfferingFeatureType[] = [];
  for (const p of providers) {
    for (const f of p.features) {
      if (!types.includes(f.featureType)) types.push(f.featureType);
    }
  }

  const rows: Record<CryptoFeatureGroup, CompareRow[]> = {
    products: [],
    deposits: [],
    security: [],
  };
  for (const type of types) {
    const row: CompareRow = {
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

export function buildCompareSections(
  providers: CryptoComparisonEntry[]
): CompareSection[] {
  const featureSections = buildFeatureSections(providers);
  return [
    { title: "Facts", rows: buildFactRows(providers) },
    { title: "Fees", rows: buildFeeRows(providers) },
    { title: "Products & trading", rows: featureSections.products },
    { title: "Deposits & withdrawals", rows: featureSections.deposits },
    { title: "Security", rows: featureSections.security },
  ].filter((section) => section.rows.length > 0);
}

export async function getCryptoExchangeComparison(publicSlugs: string[]) {
  const { getCryptoExchangesByPublicSlugs } = await import("./service");
  const { getActiveAffiliateLinksForProviderSlugs } =
    await import("@/lib/affiliates/service");
  const offerings = await getCryptoExchangesByPublicSlugs(publicSlugs);
  if (offerings.length !== publicSlugs.length) return null;
  const rows: CryptoComparisonEntry[] = offerings.map((offering) => ({
    id: offering.id,
    slug: offering.provider.slug,
    name: offering.provider.name,
    verificationStatus: offering.verificationStatus,
    logo: offering.logo ?? offering.provider.logo,
    website: offering.website ?? offering.provider.website,
    facts: offering.provider.facts,
    fees: offering.fees.map((fee) => ({
      label: fee.label,
      displayValue: fee.displayValue,
    })),
    features: offering.features,
  }));
  const affiliateLinks = await getActiveAffiliateLinksForProviderSlugs(
    rows.map((row) => row.slug)
  );
  return {
    subjects: toCompareSubjects(rows, affiliateLinks),
    sections: buildCompareSections(rows),
  };
}
