import { PrismaClient } from "@prisma/client";
import { cryptoAssets } from "../crypto-assets";
export async function seedCryptoAssets(prisma: PrismaClient) {
  for (const asset of cryptoAssets)
    await prisma.cryptoAsset.upsert({
      where: { slug: asset.slug },
      update: asset,
      create: asset,
    });
  console.log(`Seeded ${cryptoAssets.length} crypto assets.`);
}
