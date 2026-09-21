import { OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getCryptoAssets() {
  return prisma.cryptoAsset.findMany({ orderBy: { name: "asc" } });
}

export async function getCryptoAssetBySlug(slug: string) {
  return prisma.cryptoAsset.findUnique({
    where: { slug },
    include: {
      // "Where to buy" now reads through ProviderOffering -- the legacy
      // Provider-level asset table (and CryptoAsset.providers) was removed
      // in 20260921000000_remove_legacy_provider_product_models.
      offerings: {
        where: {
          offering: {
            active: true,
            offeringType: OfferingType.CRYPTO_EXCHANGE,
          },
        },
        include: {
          offering: {
            include: {
              provider: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
      articles: { include: { article: true } },
    },
  });
}
