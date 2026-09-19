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

export function getCryptoExchanges(): Promise<CryptoExchangeOffering[]> {
  return prisma.providerOffering.findMany({
    where: { offeringType: OfferingType.CRYPTO_EXCHANGE, active: true },
    include: CRYPTO_EXCHANGE_INCLUDE,
    orderBy: { name: "asc" },
  });
}

export function getCryptoExchangeByPublicSlug(
  providerSlug: string
): Promise<CryptoExchangeOffering | null> {
  return prisma.providerOffering.findFirst({
    where: {
      offeringType: OfferingType.CRYPTO_EXCHANGE,
      active: true,
      provider: { slug: providerSlug },
    },
    include: CRYPTO_EXCHANGE_INCLUDE,
  });
}

export async function getCryptoExchangesByPublicSlugs(
  slugs: string[]
): Promise<CryptoExchangeOffering[]> {
  if (!slugs.length) return [];
  const rows = await prisma.providerOffering.findMany({
    where: {
      offeringType: OfferingType.CRYPTO_EXCHANGE,
      active: true,
      provider: { slug: { in: slugs } },
    },
    include: CRYPTO_EXCHANGE_INCLUDE,
  });
  const bySlug = new Map(rows.map((row) => [row.provider.slug, row]));
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
      offeringType: OfferingType.CRYPTO_EXCHANGE,
      active: true,
      verificationStatus: "VERIFIED",
      noIndex: false,
      provider: { verificationStatus: "VERIFIED", noIndex: false },
    },
    orderBy: { provider: { name: "asc" } },
    take: limit,
    include: FEATURED_CRYPTO_INCLUDE,
  });
}
