import type {
  CompareRow,
  CompareSection,
  CompareSubject,
} from "@/components/compare/types";
import type { ShareTradingPlatformDetail } from "./service";
import { resolveProviderDestination } from "@/lib/affiliates/provider-destination";
import {
  formatAvailability,
  formatProductType,
  formatAccountType,
  formatFeeCategory,
  formatFeeValue,
  pickHeadlineFee,
  custodyTypeCopy,
} from "./labels";

/**
 * Mirrors src/lib/crypto-exchanges/comparison.ts's shape and structure exactly (see
 * shared comparison UI types for why the output shape is shared). The one
 * structural difference from the crypto builder, worth calling out: rows
 * here key off real enums (market code, InvestmentProductType,
 * AccountType) rather than matching free-text labels across offerings --
 * a real advantage of the typed offering schema, not just parity with the
 * crypto side.
 *
 * `null` in a row's values means "no row recorded for this offering" (the
 * fact hasn't been researched at all); a formatted "Not yet confirmed"
 * string means a row exists but its AvailabilityStatus is UNKNOWN. Those
 * are different signals and deliberately rendered differently -- same
 * distinction the crypto builder draws between a missing fact and an
 * unresolved boolean.
 */

/** Active links are keyed by Provider.slug, while the public comparison
 * identity remains the offering slug. This keeps commercial state attached to
 * the provider without changing the offering/profile model. */
type AffiliateEngagementLookup = Map<
  string,
  { offeringSlug: string; providerSlug: string }
>;

export function toCompareSubjects(
  offerings: ShareTradingPlatformDetail[],
  affiliateEngagements?: AffiliateEngagementLookup
): CompareSubject[] {
  return offerings.map((o) => {
    const destination = resolveProviderDestination({
      providerSlug: o.provider.slug,
      offeringSlug: o.slug,
      officialWebsite: o.website,
      hasActiveAffiliate: affiliateEngagements?.has(o.slug) ?? false,
      placement: "compare",
    });
    return {
      id: o.id,
      slug: o.slug,
      name: o.name,
      verificationStatus: o.verificationStatus,
      profileHref: `/share-trading/${o.slug}`,
      logo: o.logo,
      cta: destination
        ? {
            href: destination.href,
            isAffiliate: destination.isAffiliate,
            destinationType: destination.type,
            providerSlug: destination.providerSlug,
            placement: destination.placement,
          }
        : null,
    };
  });
}

export function buildMarketRows(
  offerings: ShareTradingPlatformDetail[]
): CompareRow[] {
  const seen = new Map<string, string>(); // code -> market name, first-seen order
  for (const o of offerings) {
    for (const m of o.markets) {
      if (!seen.has(m.market.code)) seen.set(m.market.code, m.market.name);
    }
  }
  return Array.from(seen.entries()).map(([code, name]) => ({
    key: `market:${code}`,
    label: name,
    values: offerings.map((o) => {
      const row = o.markets.find((m) => m.market.code === code);
      return row ? formatAvailability(row.availability) : null;
    }),
  }));
}

export function buildProductRows(
  offerings: ShareTradingPlatformDetail[]
): CompareRow[] {
  const seen: ShareTradingPlatformDetail["products"][number]["productType"][] =
    [];
  for (const o of offerings) {
    for (const p of o.products) {
      if (!seen.includes(p.productType)) seen.push(p.productType);
    }
  }
  return seen.map((productType) => ({
    key: `product:${productType}`,
    label: formatProductType(productType),
    values: offerings.map((o) => {
      const row = o.products.find((p) => p.productType === productType);
      return row ? formatAvailability(row.availability) : null;
    }),
  }));
}

export function buildAccountTypeRows(
  offerings: ShareTradingPlatformDetail[]
): CompareRow[] {
  const seen: ShareTradingPlatformDetail["accountTypes"][number]["accountType"][] =
    [];
  for (const o of offerings) {
    for (const a of o.accountTypes) {
      if (!seen.includes(a.accountType)) seen.push(a.accountType);
    }
  }
  return seen.map((accountType) => ({
    key: `accountType:${accountType}`,
    label: formatAccountType(accountType),
    values: offerings.map((o) => {
      const row = o.accountTypes.find((a) => a.accountType === accountType);
      return row ? formatAvailability(row.availability) : null;
    }),
  }));
}

/**
 * Keyed by market (or "_all" for an offering-wide row, marketId null --
 * see the OfferingCustody schema comment) since custody is genuinely
 * market-scoped, not a flat fact. Milestone 1's seed always sets marketId
 * explicitly, so the "_all" bucket is exercised by future data, not
 * today's -- included for correctness, not speculatively.
 */
export function buildCustodyRows(
  offerings: ShareTradingPlatformDetail[]
): CompareRow[] {
  const seen = new Map<string, string>(); // bucket key -> row label
  for (const o of offerings) {
    for (const c of o.custody) {
      const bucketKey = c.market?.code ?? "_all";
      if (!seen.has(bucketKey)) {
        seen.set(bucketKey, c.market ? c.market.name : "All markets");
      }
    }
  }
  return Array.from(seen.entries()).map(([bucketKey, label]) => ({
    key: `custody:${bucketKey}`,
    label,
    values: offerings.map((o) => {
      const row = o.custody.find(
        (c) => (c.market?.code ?? "_all") === bucketKey
      );
      if (!row) return null;
      const copy = custodyTypeCopy(row.custodyType);
      return row.custodianName
        ? `${copy.label} (${row.custodianName})`
        : copy.label;
    }),
  }));
}

type OfferingFeeRow = ShareTradingPlatformDetail["fees"][number];

/**
 * One row per (feeCategory, market) combination seen across offerings --
 * same "seen ordered" pattern as buildMarketRows/buildProductRows above,
 * bucketed like buildCustodyRows (market-scoped facts use the market as
 * part of the key, "_all" for an offering-wide fee like FX conversion).
 *
 * Promotional fees (isPromotional: true) are excluded entirely, not just
 * de-prioritized: a time-boxed new-customer offer isn't a standing cost to
 * compare providers on, and showing it here risks exactly the "headline $0
 * hides the real cost" trap the fee-schema proposal warned about. The
 * standing schedule is what belongs in a comparison; the promotion itself
 * is a profile-page detail (OfferingFeeSection, Phase 2 step 6/7).
 */
export function buildFeeRows(
  offerings: ShareTradingPlatformDetail[]
): CompareRow[] {
  const standingFees = offerings.map((o) =>
    o.fees.filter((f) => !f.isPromotional)
  );

  const seen = new Map<
    string,
    { category: OfferingFeeRow["feeCategory"]; marketName: string | null }
  >();
  for (const fees of standingFees) {
    for (const fee of fees) {
      const bucketKey = `${fee.feeCategory}:${fee.market?.code ?? "_all"}`;
      if (!seen.has(bucketKey)) {
        seen.set(bucketKey, {
          category: fee.feeCategory,
          marketName: fee.market?.name ?? null,
        });
      }
    }
  }

  return Array.from(seen.entries()).map(
    ([bucketKey, { category, marketName }]) => ({
      key: `fee:${bucketKey}`,
      label: marketName
        ? `${formatFeeCategory(category)} \u2014 ${marketName}`
        : formatFeeCategory(category),
      values: standingFees.map((fees) => {
        const candidates = fees.filter(
          (f) => `${f.feeCategory}:${f.market?.code ?? "_all"}` === bucketKey
        );
        const headline = pickHeadlineFee(candidates);
        return headline ? formatFeeValue(headline) : null;
      }),
    })
  );
}

export function buildFeatureRows(
  offerings: ShareTradingPlatformDetail[]
): CompareRow[] {
  const seen: ShareTradingPlatformDetail["features"][number]["featureType"][] =
    [];
  for (const offering of offerings) {
    for (const feature of offering.features) {
      if (!seen.includes(feature.featureType)) seen.push(feature.featureType);
    }
  }

  return seen.map((featureType) => ({
    key: `feature:${featureType}`,
    label: featureType
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase()),
    values: offerings.map((offering) => {
      const feature = offering.features.find(
        (candidate) => candidate.featureType === featureType
      );
      if (!feature) return null;
      if (feature.value) return feature.value;
      if (feature.available === true) return "✓";
      if (feature.available === false) return "—";
      return "Not yet confirmed";
    }),
  }));
}

function rowForMarketSummary(
  offerings: ShareTradingPlatformDetail[]
): CompareRow {
  return {
    key: "market:summary",
    label: "Markets",
    values: offerings.map((offering) => {
      const available = offering.markets
        .filter((row) => row.availability === "AVAILABLE")
        .map((row) => row.market.code);
      if (available.length === 0) return null;
      const hasUS = available.includes("NYSE") || available.includes("NASDAQ");
      const compact = [
        available.includes("ASX") ? "Australia" : null,
        hasUS ? "US" : null,
        available.includes("HKEX") ? "Hong Kong" : null,
      ].filter(Boolean);
      const represented = new Set([
        ...(available.includes("ASX") ? ["ASX"] : []),
        ...(hasUS ? ["NYSE", "NASDAQ"] : []),
        ...(available.includes("HKEX") ? ["HKEX"] : []),
      ]);
      const otherCount = available.filter(
        (code) => !represented.has(code)
      ).length;
      return `${compact.join(" · ")}${otherCount ? ` · +${otherCount} more` : ""}`;
    }),
  };
}

function rowForProduct(
  offerings: ShareTradingPlatformDetail[],
  productType: ShareTradingPlatformDetail["products"][number]["productType"],
  label: string
): CompareRow {
  return {
    key: `product:${productType}`,
    label,
    values: offerings.map((offering) => {
      const row = offering.products.find(
        (candidate) => candidate.productType === productType
      );
      return row ? formatAvailability(row.availability) : null;
    }),
  };
}

function rowForFeature(
  offerings: ShareTradingPlatformDetail[],
  featureType: ShareTradingPlatformDetail["features"][number]["featureType"],
  label: string
): CompareRow {
  return {
    key: `feature:${featureType}`,
    label,
    values: offerings.map((offering) => {
      const feature = offering.features.find(
        (candidate) => candidate.featureType === featureType
      );
      if (!feature) return null;
      if (feature.value) return feature.value;
      if (feature.available === true) return "✓";
      if (feature.available === false) return "—";
      return null;
    }),
  };
}

function rowForAccount(
  offerings: ShareTradingPlatformDetail[],
  accountType: ShareTradingPlatformDetail["accountTypes"][number]["accountType"],
  label: string
): CompareRow {
  return {
    key: `account:${accountType}`,
    label,
    values: offerings.map((offering) => {
      const row = offering.accountTypes.find(
        (candidate) => candidate.accountType === accountType
      );
      return row ? formatAvailability(row.availability) : null;
    }),
  };
}

function rowForCustody(
  offerings: ShareTradingPlatformDetail[],
  marketCode: string,
  label: string
): CompareRow {
  return {
    key: `custody:${marketCode}`,
    label,
    values: offerings.map((offering) => {
      const row = offering.custody.find(
        (candidate) => candidate.market?.code === marketCode
      );
      if (!row) return null;
      return custodyTypeCopy(row.custodyType).label;
    }),
  };
}

function rowForFee(
  offerings: ShareTradingPlatformDetail[],
  category: OfferingFeeRow["feeCategory"],
  marketCodes: string[] | null,
  label: string
): CompareRow {
  return {
    key: `fee:${category}:${marketCodes?.join("+") ?? "all"}`,
    label,
    values: offerings.map((offering) => {
      const candidates = offering.fees.filter((fee) => {
        if (fee.isPromotional || fee.feeCategory !== category) return false;
        if (marketCodes === null) return fee.market == null;
        return fee.market ? marketCodes.includes(fee.market.code) : false;
      });
      const headline = pickHeadlineFee(candidates);
      return headline ? formatFeeValue(headline) : null;
    }),
  };
}

function keepRows(rows: CompareRow[]) {
  return rows.filter((row) => row.values.some((value) => value !== null));
}

/**
 * Curated decision policy: the research model is deliberately richer than the
 * default comparison. Detailed exchange lists, every account type and every
 * fee variant remain on profiles / in seed evidence instead of becoming rows.
 */
export function buildShareTradingCompareSections(
  offerings: ShareTradingPlatformDetail[]
): CompareSection[] {
  const costs = keepRows([
    rowForFee(offerings, "BROKERAGE", ["ASX"], "ASX brokerage"),
    rowForFee(offerings, "BROKERAGE", ["NYSE", "NASDAQ"], "US brokerage"),
    rowForFee(offerings, "FX_CONVERSION", null, "FX conversion"),
    rowForFee(offerings, "ACCOUNT_KEEPING", null, "Account fee"),
    rowForFee(offerings, "INACTIVITY", null, "Inactivity fee"),
  ]);
  const ownership = keepRows([
    rowForCustody(offerings, "ASX", "ASX ownership"),
    rowForMarketSummary(offerings),
  ]);
  const investing = keepRows([
    rowForProduct(offerings, "ETF", "ETFs"),
    rowForFeature(offerings, "RECURRING_BUYS", "Recurring investing"),
    rowForFeature(offerings, "ADVANCED_CHARTING", "Advanced charting"),
    rowForAccount(offerings, "SMSF", "SMSF support"),
  ]);
  const more = keepRows([
    rowForProduct(offerings, "OPTIONS", "Options"),
    rowForProduct(offerings, "BONDS", "Bonds"),
    rowForProduct(offerings, "FUTURES", "Futures"),
    rowForProduct(offerings, "FOREX", "Forex"),
    rowForFeature(offerings, "MOBILE_APP", "Mobile app"),
    rowForFeature(offerings, "WEB_PLATFORM", "Web platform"),
  ]);
  return [
    { title: "Key costs", rows: costs },
    { title: "Ownership & access", rows: ownership },
    { title: "Investing features", rows: investing },
    { title: "More details", rows: more, secondary: true },
  ].filter((section) => section.rows.length > 0);
}

export async function getShareTradingComparison(slugs: string[]) {
  const { getShareTradingPlatformsBySlugs } = await import("./service");
  const platforms = await getShareTradingPlatformsBySlugs(slugs);
  if (platforms.length !== slugs.length) return null;
  return {
    subjects: toCompareSubjects(platforms),
    sections: buildShareTradingCompareSections(platforms),
  };
}
