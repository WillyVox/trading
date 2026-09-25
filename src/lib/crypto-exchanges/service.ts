import { OfferingType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const CRYPTO_EXCHANGE_INCLUDE = {
  provider: { include: { facts: true, sources: true, regulations: true } },
  fees: {
    include: { tiers: { orderBy: { position: "asc" as const } } },
    orderBy: { feeCategory: "asc" as const },
  },
  features: { orderBy: { featureType: "asc" as const } },
  prosCons: { orderBy: { position: "asc" as const } },
  cryptoAssets: { include: { asset: true } },
} satisfies Prisma.ProviderOfferingInclude;

export type CryptoExchangeOffering = Prisma.ProviderOfferingGetPayload<{
  include: typeof CRYPTO_EXCHANGE_INCLUDE;
}>;

const activeCryptoExchangeWhere = {
  offeringType: OfferingType.CRYPTO_EXCHANGE,
  active: true,
} as const;

export function getCryptoExchanges(): Promise<CryptoExchangeOffering[]> {
  return prisma.providerOffering.findMany({
    where: activeCryptoExchangeWhere,
    include: CRYPTO_EXCHANGE_INCLUDE,
    orderBy: { name: "asc" },
  });
}

/** Lightweight Offering identities for selectors and URL builders. */
export async function getCryptoExchangeSelectorOptions(): Promise<
  { id: string; slug: string; name: string }[]
> {
  return prisma.providerOffering.findMany({
    where: activeCryptoExchangeWhere,
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true },
  });
}

/** Canonical lookup: public crypto product identity is ProviderOffering.slug. */
export function getCryptoExchangeBySlug(
  offeringSlug: string
): Promise<CryptoExchangeOffering | null> {
  return prisma.providerOffering.findFirst({
    where: { ...activeCryptoExchangeWhere, slug: offeringSlug },
    include: CRYPTO_EXCHANGE_INCLUDE,
  });
}

/**
 * Resolve canonical Offering slugs in one query. Exact Offering slugs always
 * win. A legacy Provider slug is accepted only when that Provider identifies
 * exactly one active crypto Offering, so future multi-product Providers never
 * acquire an ambiguous compatibility URL. Returned values preserve input order.
 */
export async function resolveCryptoExchangeSlugs(
  slugs: string[]
): Promise<string[] | null> {
  if (!slugs.length) return [];
  const requested = [...new Set(slugs)];
  const rows = await prisma.providerOffering.findMany({
    where: {
      ...activeCryptoExchangeWhere,
      OR: [
        { slug: { in: requested } },
        { provider: { slug: { in: requested } } },
      ],
    },
    select: { slug: true, provider: { select: { slug: true } } },
  });

  const exact = new Set(rows.map((row) => row.slug));
  const byProvider = new Map<string, string[]>();
  for (const row of rows) {
    const values = byProvider.get(row.provider.slug) ?? [];
    values.push(row.slug);
    byProvider.set(row.provider.slug, values);
  }

  const resolved: string[] = [];
  for (const requestedSlug of slugs) {
    if (exact.has(requestedSlug)) {
      resolved.push(requestedSlug);
      continue;
    }
    const aliases = byProvider.get(requestedSlug) ?? [];
    if (aliases.length !== 1) return null;
    resolved.push(aliases[0]);
  }
  return resolved;
}

export async function resolveCryptoExchangeSlug(
  slug: string
): Promise<string | null> {
  const resolved = await resolveCryptoExchangeSlugs([slug]);
  return resolved?.[0] ?? null;
}

export async function getCryptoExchangeSlugMapForProviderSlugs(
  providerSlugs: string[]
): Promise<Map<string, string>> {
  if (!providerSlugs.length) return new Map();
  const rows = await prisma.providerOffering.findMany({
    where: {
      ...activeCryptoExchangeWhere,
      provider: { slug: { in: providerSlugs } },
    },
    select: { slug: true, provider: { select: { slug: true } } },
    orderBy: { slug: "asc" },
  });

  const grouped = new Map<string, string[]>();
  for (const row of rows) {
    const values = grouped.get(row.provider.slug) ?? [];
    values.push(row.slug);
    grouped.set(row.provider.slug, values);
  }

  const result = new Map<string, string>();
  for (const [providerSlug, offeringSlugs] of grouped) {
    if (offeringSlugs.length === 1) result.set(providerSlug, offeringSlugs[0]);
  }
  return result;
}

export async function getCryptoExchangesBySlugs(
  slugs: string[]
): Promise<CryptoExchangeOffering[]> {
  if (!slugs.length) return [];
  const rows = await prisma.providerOffering.findMany({
    where: { ...activeCryptoExchangeWhere, slug: { in: slugs } },
    include: CRYPTO_EXCHANGE_INCLUDE,
  });
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((row): row is CryptoExchangeOffering => Boolean(row));
}

const FEATURED_CRYPTO_INCLUDE = {
  provider: true,
  features: {
    where: { available: true, verificationStatus: "VERIFIED" as const },
    orderBy: { featureType: "asc" as const },
    take: 2,
  },
} satisfies Prisma.ProviderOfferingInclude;

export type FeaturedCryptoExchange = Prisma.ProviderOfferingGetPayload<{
  include: typeof FEATURED_CRYPTO_INCLUDE;
}>;

export function getFeaturedCryptoExchanges(
  limit = 3
): Promise<FeaturedCryptoExchange[]> {
  return prisma.providerOffering.findMany({
    where: {
      ...activeCryptoExchangeWhere,
      verificationStatus: "VERIFIED",
      noIndex: false,
      provider: { verificationStatus: "VERIFIED", noIndex: false },
    },
    orderBy: { name: "asc" },
    take: limit,
    include: FEATURED_CRYPTO_INCLUDE,
  });
}
