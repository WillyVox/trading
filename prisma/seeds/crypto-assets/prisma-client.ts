import { PrismaClient } from '@prisma/client';
import { cryptoAssets } from './crypto-assets';

const prisma = new PrismaClient();

export async function seedCryptoAssets() {
  for (const asset of cryptoAssets) {
    await prisma.cryptoAsset.upsert({
      where: { slug: asset.slug },
      update: asset,
      create: asset,
    });
  }
}
