import type { OfferingFeatureType } from "@prisma/client";
import { cryptoExchangePath } from "./routes";
import { resolveProviderDestination } from "@/lib/affiliates/provider-destination";
import { featureGroup, type CryptoFeatureGroup } from "./features";
import type {
  CompareRow,
  CompareSection,
  CompareSubject,
} from "@/components/compare/types";

export type { CompareRow, CompareSection };

/**
 * Shape the comparison engine needs from each crypto Offering --
 * intentionally a subset of getProviderBySlug()'s full payload (facts/fees/
 * features only; no prosCons/sources/regulations/assets, which the table
 * doesn't render). Built live from canonical Offering lookups -- see
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
  providerSlug: string;
  name: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
  logo: string | null;
  website: string | null;
  facts: { label: string; value: string }[];
  regulations: { regulator: string; status: string | null }[];
  fees: { feeCategory: string; label: string; displayValue: string | null }[];
  features: {
    featureType: OfferingFeatureType;
    label: string | null;
    value: string | null;
    available: boolean | null;
  }[];
};

/** Canonical adapter shared by all crypto comparison routes. */
type CryptoComparisonOffering = {
  id: string;
  slug: string;
  name: string;
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "STALE";
  logo: string | null;
  website: string | null;
  provider: {
    slug: string;
    logo: string | null;
    website: string | null;
    facts: { label: string; value: string }[];
    regulations: { regulator: string; status: string | null }[];
  };
  fees: { feeCategory: string; label: string; displayValue: string | null }[];
  features: {
    featureType: OfferingFeatureType;
    label: string | null;
    value: string | null;
    available: boolean | null;
  }[];
};

export function toCryptoComparisonEntry(
  offering: CryptoComparisonOffering
): CryptoComparisonEntry {
  return {
    id: offering.id,
    slug: offering.slug,
    providerSlug: offering.provider.slug,
    name: offering.name,
    verificationStatus: offering.verificationStatus,
    logo: offering.logo ?? offering.provider.logo,
    website: offering.website ?? offering.provider.website,
    facts: offering.provider.facts.map(({ label, value }) => ({ label, value })),
    regulations: offering.provider.regulations.map(({ regulator, status }) => ({
      regulator,
      status,
    })),
    fees: offering.fees.map(({ feeCategory, label, displayValue }) => ({
      feeCategory,
      label,
      displayValue,
    })),
    features: offering.features.map(
      ({ featureType, label, value, available }) => ({
        featureType,
        label,
        value,
        available,
      })
    ),
  };
}

/** Minimal shape toCompareSubjects needs from an affiliate engagement -- see
 * getActiveAffiliateEngagementsForOfferingSlugs, whose Map is keyed by
 * Offering.slug. */
type AffiliateEngagementLookup = Map<
  string,
  { offeringSlug: string; providerSlug: string }
>;

/**
 * Maps CryptoComparisonEntry rows to the domain-agnostic CompareSubject
 * shape CompareTable/CompareMobileCards render -- the one place that knows
 * a crypto exchange's profile lives at /crypto/exchanges/[slug].
 *
 * `cta` resolves in two tiers: an active AffiliateEngagement for this Offering slug (routed through /go/[offering] so the click is recorded) wins;
 * otherwise the provider's own `website` is used directly; otherwise no
 * button renders at all -- see CompareSubject's comment on why a null
 * cta is preferred over a dead one. Takes the affiliate map as a separate
 * argument rather than looking it up here because that lookup is async
 * (getActiveAffiliateEngagementsForOfferingSlugs hits the DB) and this function
 * stays sync and pure; callers fetch the map once and pass it in.
 */
export function toCompareSubjects(
  providers: CryptoComparisonEntry[],
  affiliateEngagements?: AffiliateEngagementLookup
): CompareSubject[] {
  return providers.map((p) => {
    const affiliateEngagement = affiliateEngagements?.get(p.slug);
    const destination = resolveProviderDestination({
      providerSlug: p.providerSlug,
      offeringSlug: p.slug,
      officialWebsite: p.website,
      hasActiveAffiliate: Boolean(affiliateEngagement),
      placement: "compare",
    });
    const cta = destination
      ? {
          href: destination.href,
          isAffiliate: destination.isAffiliate,
          destinationType: destination.type,
          providerSlug: destination.providerSlug,
          placement: destination.placement,
        }
      : null;

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      verificationStatus: p.verificationStatus,
      profileHref: cryptoExchangePath(p.slug),
      logo: p.logo,
      cta,
    };
  });
}

/**
 * Comparison policy is intentionally curated rather than a union of every
 * researched datum. Research can grow without making the comparison table
 * grow with it. Profile pages remain the place for exhaustive facts/fees.
 */
const CRYPTO_FACT_POLICY = [
  { key: "assets", label: "Cryptocurrencies", labels: ["Advertised crypto assets"] },
] as const;

const CRYPTO_FEE_POLICY = [
  { key: "spot", label: "Spot / standard trading fee", categories: ["CRYPTO_TRADING", "MAKER", "TAKER"], labelHints: ["Markets order-book fee", "Standard trading fee", "Trading fee", "Exchange fiat-pair taker fee", "Pro standard spot taker fee", "AUD/USDT exchange trading fee", "Crypto position opening fee"] },
  { key: "instant", label: "Instant buy / conversion fee", categories: ["INSTANT_BUY"], labelHints: ["Instant Buy / Sell / Swap fee", "Fiat-to-crypto conversion fee", "Instant Buy/Sell trading fee"] },
  { key: "spread", label: "Spread", categories: ["SPREAD"], labelHints: ["Trading spread", "Quick Buy/Sell spread"] },
  { key: "aud-deposit", label: "AUD bank / PayID deposit", categories: ["FIAT_DEPOSIT"], labelHints: ["AUD PayID / Direct Deposit fee", "AUD PayID / Osko / NPP deposit fee", "AUD bank transfer / PayID deposit fee", "AUD bank transfer / Osko deposit fee", "AUD deposit fee", "AUD bank transfer deposit", "AUD NPP/BECS funding"] },
  { key: "card", label: "Card funding", categories: ["FIAT_DEPOSIT"], labelHints: ["AUD card deposit fee", "AUD card deposit fee (Stripe)", "Australian card deposit fee", "Visa / Mastercard crypto purchase"] },
  { key: "aud-withdrawal", label: "AUD withdrawal", categories: ["FIAT_WITHDRAWAL"], labelHints: ["AUD bank withdrawal fee", "AUD bank transfer / Osko withdrawal fee", "AUD EFT withdrawal", "AUD account withdrawal"] },
  { key: "crypto-withdrawal", label: "Crypto withdrawal", categories: ["CRYPTO_WITHDRAWAL"], labelHints: ["Crypto withdrawal fee", "External cryptocurrency transfer fee", "Crypto withdrawal network fee", "External crypto send/receive network fee", "Bitcoin withdrawal fee", "Bitcoin withdrawal"] },
] as const;

const PRIMARY_CRYPTO_FEATURES: { type: OfferingFeatureType; label: string }[] = [
  { type: "PAYID", label: "PayID" },
  { type: "RECURRING_BUYS", label: "Recurring buys" },
  { type: "STAKING", label: "Staking" },
  { type: "API_ACCESS", label: "API access" },
  { type: "TWO_FACTOR_AUTH", label: "Two-factor authentication" },
  { type: "COLD_STORAGE", label: "Cold-storage controls" },
];

const SECONDARY_CRYPTO_FEATURES: { type: OfferingFeatureType; label: string }[] = [
  { type: "MOBILE_APP", label: "Mobile app" },
  { type: "WEB_PLATFORM", label: "Web platform" },
  { type: "ADVANCED_CHARTING", label: "Advanced charting" },
  { type: "OTC_DESK", label: "OTC desk" },
  { type: "SMSF_SUPPORT", label: "SMSF support" },
  { type: "COPY_TRADING", label: "Copy trading" },
];

function featureValue(provider: CryptoComparisonEntry, type: OfferingFeatureType) {
  const feature = provider.features.find((candidate) => candidate.featureType === type);
  if (!feature) return null;
  if (feature.value) return feature.value;
  if (feature.available === true) return "✓";
  if (feature.available === false) return "—";
  return null;
}

function feeValue(provider: CryptoComparisonEntry, policy: (typeof CRYPTO_FEE_POLICY)[number]) {
  const exact = policy.labelHints
    .map((label) => provider.fees.find((fee) => fee.label === label))
    .find(Boolean);
  if (exact?.displayValue) return exact.displayValue;
  return null;
}

export function buildFactRows(providers: CryptoComparisonEntry[]): CompareRow[] {
  return CRYPTO_FACT_POLICY.map((policy) => ({
    key: `fact:${policy.key}`,
    label: policy.label,
    values: providers.map((provider) => {
      for (const label of policy.labels) {
        const fact = provider.facts.find((candidate) => candidate.label === label);
        if (fact) return fact.value;
      }
      return null;
    }),
  })).filter((row) => row.values.some((value) => value !== null));
}

export function buildFeeRows(providers: CryptoComparisonEntry[]): CompareRow[] {
  return CRYPTO_FEE_POLICY.map((policy) => ({
    key: `fee:${policy.key}`,
    label: policy.label,
    values: providers.map((provider) => feeValue(provider, policy)),
  })).filter((row) => row.values.some((value) => value !== null));
}

export function buildFeatureSections(providers: CryptoComparisonEntry[]): Record<CryptoFeatureGroup, CompareRow[]> {
  const rows: Record<CryptoFeatureGroup, CompareRow[]> = { products: [], deposits: [], security: [] };
  for (const { type, label } of [...PRIMARY_CRYPTO_FEATURES, ...SECONDARY_CRYPTO_FEATURES]) {
    const row: CompareRow = {
      key: `feature:${type}`,
      label,
      values: providers.map((provider) => featureValue(provider, type)),
    };
    if (row.values.some((value) => value !== null)) rows[featureGroup(type)].push(row);
  }
  return rows;
}

function buildFeatureRowsFromPolicy(
  providers: CryptoComparisonEntry[],
  policy: { type: OfferingFeatureType; label: string }[]
): CompareRow[] {
  return policy.map(({ type, label }) => ({
    key: `feature:${type}`,
    label,
    values: providers.map((provider) => featureValue(provider, type)),
  })).filter((row) => row.values.some((value) => value !== null));
}

export function buildCompareSections(providers: CryptoComparisonEntry[]): CompareSection[] {
  const facts = buildFactRows(providers);
  const austrac: CompareRow = {
    key: "regulation:austrac",
    label: "AUSTRAC",
    values: providers.map((provider) => provider.regulations.some((row) => row.regulator === "AUSTRAC") ? "Registered" : null),
  };
  const fees = buildFeeRows(providers);
  const primaryFeatures = buildFeatureRowsFromPolicy(providers, PRIMARY_CRYPTO_FEATURES);
  const secondaryFeatures = buildFeatureRowsFromPolicy(providers, SECONDARY_CRYPTO_FEATURES);
  return [
    { title: "Key costs", rows: fees.slice(0, 4) },
    { title: "Selection & access", rows: [...facts, ...primaryFeatures.slice(0, 3)] },
    { title: "Australian registration", rows: austrac.values.some((value) => value !== null) ? [austrac] : [] },
    { title: "Security & trading", rows: primaryFeatures.slice(3) },
    { title: "More costs", rows: fees.slice(4), secondary: true },
    { title: "More platform features", rows: secondaryFeatures, secondary: true },
  ].filter((section) => section.rows.length > 0);
}

export async function getCryptoExchangeComparison(offeringSlugs: string[]) {
  const { getCryptoExchangesBySlugs } = await import("./service");
  const { getActiveAffiliateEngagementsForOfferingSlugs } =
    await import("@/lib/affiliates/service");
  const offerings = await getCryptoExchangesBySlugs(offeringSlugs);
  if (offerings.length !== offeringSlugs.length) return null;
  const rows = offerings.map(toCryptoComparisonEntry);
  const affiliateEngagements =
    await getActiveAffiliateEngagementsForOfferingSlugs(
      rows.map((row) => row.slug)
    );
  return {
    subjects: toCompareSubjects(rows, affiliateEngagements),
    sections: buildCompareSections(rows),
  };
}
