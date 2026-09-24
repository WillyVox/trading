import { OfferingType, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { providerOfferingRepository } from "@/lib/repository";

/**
 * Share trading platform domain (Milestone 1 — see docs/IMPLEMENTATION-PLAN.md
 * and ROADMAP.md "Offering foundation"). Mirrors src/lib/providers/service.ts
 * one for one: same repository-wrapper pattern, same include-then-cast
 * approach for payload typing (see the CryptoFeatureRow comment in
 * crypto-exchanges/features.ts for why a generic here would lose type inference).
 */

const OFFERING_LIST_INCLUDE = {
  provider: { select: { id: true, name: true, slug: true, verificationStatus: true, lastVerifiedAt: true } },
  // Widened from a provider-only include so the list page's row cards can
  // show market/product/custody/account-type chips without a second query
  // per offering. Mirrors OFFERING_DETAIL_INCLUDE below; kept as a
  // separate constant (rather than reusing it) in case the list view ever
  // needs to diverge again (e.g. a lighter include for a future infinite
  // scroll).
  markets: {
    include: { market: true },
    orderBy: { market: { name: "asc" as const } },
  },
  products: { orderBy: { productType: "asc" as const } },
  custody: { include: { market: true } },
  accountTypes: { orderBy: { accountType: "asc" as const } },
  // Phase 2 step 6: ShareTradingPlatformListCard's headline brokerage chip needs this.
  // Same shape as OFFERING_DETAIL_INCLUDE's fees block (deliberately, so
  // pickHeadlineFee()/formatFeeValue() work unchanged against either) --
  // not trimmed down further since an offering has at most a handful of
  // fee rows, so the extra payload per list row is negligible.
  fees: {
    include: {
      market: true,
      tiers: { orderBy: { position: "asc" as const } },
    },
    orderBy: { feeCategory: "asc" as const },
  },
} satisfies Prisma.ProviderOfferingInclude;

export type ShareTradingPlatformListItem = Prisma.ProviderOfferingGetPayload<{
  include: typeof OFFERING_LIST_INCLUDE;
}>;

export function getShareTradingPlatforms(
  opts: { page?: number; pageSize?: number } = {}
) {
  return providerOfferingRepository.paginate({
    where: { active: true, offeringType: OfferingType.SHARE_TRADING },
    orderBy: { name: "asc" },
    include: OFFERING_LIST_INCLUDE,
    page: opts.page,
    pageSize: opts.pageSize,
  }) as Promise<{
    items: ShareTradingPlatformListItem[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  }>;
}

const OFFERING_DETAIL_INCLUDE = {
  provider: { select: { id: true, name: true, slug: true, verificationStatus: true, lastVerifiedAt: true } },
  markets: {
    include: { market: true },
    orderBy: { market: { name: "asc" as const } },
  },
  products: { orderBy: { productType: "asc" as const } },
  custody: { include: { market: true } },
  accountTypes: { orderBy: { accountType: "asc" as const } },
  features: { orderBy: { featureType: "asc" as const } },
  prosCons: { orderBy: { position: "asc" as const } },
  // Phase 2 (fees). `market` is included per-fee so a market-scoped fee
  // (e.g. ASX brokerage) can show its market name without a second query;
  // a null here means an offering-wide fee (e.g. FX conversion). Tiers are
  // ordered by `position`, which the seed sets to array index -- see the
  // OfferingFeeTier schema comment and prisma-client.ts's seeding loop.
  fees: {
    include: {
      market: true,
      tiers: { orderBy: { position: "asc" as const } },
    },
    orderBy: { feeCategory: "asc" as const },
  },
} satisfies Prisma.ProviderOfferingInclude;

export type ShareTradingPlatformDetail = Prisma.ProviderOfferingGetPayload<{
  include: typeof OFFERING_DETAIL_INCLUDE;
}>;

export async function getShareTradingPlatformBySlug(
  slug: string
): Promise<ShareTradingPlatformDetail | null> {
  const row = await prisma.providerOffering.findUnique({
    where: { slug, active: true, offeringType: OfferingType.SHARE_TRADING },
    include: OFFERING_DETAIL_INCLUDE,
  });
  return row as ShareTradingPlatformDetail | null;
}

/**
 * Mirrors providers/service.ts's getProvidersBySlugs() exactly (see the
 * comment there): order-preserving, silently drops slugs that don't exist
 * rather than throwing, so the caller can detect a partial match by
 * comparing result.length to slugs.length. Used by the compare-engine
 * domain resolver (the domain-specific comparison route) to test whether a set of
 * slugs are all offerings.
 */
export async function getShareTradingPlatformsBySlugs(
  slugs: string[]
): Promise<ShareTradingPlatformDetail[]> {
  if (slugs.length === 0) return [];
  const rows = await prisma.providerOffering.findMany({
    where: {
      slug: { in: slugs },
      active: true,
      offeringType: OfferingType.SHARE_TRADING,
    },
    include: OFFERING_DETAIL_INCLUDE,
  });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return slugs
    .map((s) => bySlug.get(s))
    .filter((r): r is ShareTradingPlatformDetail =>
      Boolean(r)
    ) as ShareTradingPlatformDetail[];
}

/**
 * Every active, indexable offering with full compare-ready detail included
 * -- backs /compare/trading-platforms, the always-complete counterpart to
 * getShareTradingPlatforms() (which is include-light, for the list page). Mirrors how
 * /compare/crypto-exchanges queries prisma.provider directly rather than
 * going through the paginated list helper.
 */
export async function getAllShareTradingPlatformsForCompare(): Promise<
  ShareTradingPlatformDetail[]
> {
  const rows = await prisma.providerOffering.findMany({
    where: { active: true, offeringType: OfferingType.SHARE_TRADING },
    orderBy: { name: "asc" },
    include: OFFERING_DETAIL_INCLUDE,
  });
  return rows as ShareTradingPlatformDetail[];
}

/**
 * Lightweight pool for the compare selector -- id/slug/name only, so the
 * /compare/trading-platforms/[slug] page doesn't load every offering's markets,
 * fees and custody just to render a row of pills. The hub page derives its
 * own pool from data it already loaded; this is for pages that don't.
 * Alphabetical, matching the compare pages' "never ranked" rule.
 */
export async function getShareTradingSelectorOptions(): Promise<
  { id: string; slug: string; name: string }[]
> {
  return prisma.providerOffering.findMany({
    where: { active: true, offeringType: OfferingType.SHARE_TRADING },
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

// Mirrors FEATURED_CRYPTO_INCLUDE / getFeaturedCryptoExchanges in
// crypto-exchanges/service.ts one for one — same "verified provider +
// verified offering, alphabetical, capped chip list" shape — so the
// homepage's two featured-provider sections (crypto + share trading) come
// from parallel, independently cacheable queries rather than one shared
// helper that would need an offeringType branch at every call site.
const FEATURED_SHARE_TRADING_INCLUDE = {
  provider: true,
  products: {
    orderBy: { productType: "asc" as const },
    take: 2,
  },
} satisfies Prisma.ProviderOfferingInclude;

export type FeaturedShareTradingPlatform = Prisma.ProviderOfferingGetPayload<{
  include: typeof FEATURED_SHARE_TRADING_INCLUDE;
}>;

export function getFeaturedShareTradingPlatforms(
  limit = 3
): Promise<FeaturedShareTradingPlatform[]> {
  return prisma.providerOffering.findMany({
    where: {
      offeringType: OfferingType.SHARE_TRADING,
      active: true,
      verificationStatus: "VERIFIED",
      noIndex: false,
      provider: { verificationStatus: "VERIFIED", noIndex: false },
    },
    orderBy: { provider: { name: "asc" } },
    take: limit,
    include: FEATURED_SHARE_TRADING_INCLUDE,
  });
}
