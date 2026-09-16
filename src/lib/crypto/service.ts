import { prisma } from "@/lib/prisma";

export function getCryptoAssets() {
  return prisma.cryptoAsset.findMany({ orderBy: { name: "asc" } });
}

export async function getCryptoAssetBySlug(slug: string) {
  return prisma.cryptoAsset.findUnique({
    where: { slug },
    include: {
      providers: { include: { provider: true } },
      articles: { include: { article: true } },
    },
  });
}
