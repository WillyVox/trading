import { PrismaClient } from "@prisma/client";
import { SEED_PROVIDERS } from "./seed-providers";

const prisma = new PrismaClient();

export async function seedProviders() {
  for (const p of SEED_PROVIDERS as any[]) {
    const {
      facts,
      fees,
      features,
      prosCons,
      sources,
      regulations,
      assetSymbols,
      ...providerData
    } = p;

    const provider = await prisma.provider.upsert({
      where: { slug: providerData.slug },
      update: {
        ...providerData,
        facts: { deleteMany: {}, create: facts },
        fees: { deleteMany: {}, create: fees },
        features: { deleteMany: {}, create: features },
        prosCons: { deleteMany: {}, create: prosCons ?? [] },
        sources: { deleteMany: {}, create: sources },
        regulations: { deleteMany: {}, create: regulations },
      },
      create: {
        ...providerData,
        facts: { create: facts },
        fees: { create: fees },
        features: { create: features },
        prosCons: { create: prosCons ?? [] },
        sources: { create: sources },
        regulations: { create: regulations },
      },
    });

    await prisma.providerAsset.deleteMany({
      where: { providerId: provider.id },
    });
    for (const symbol of assetSymbols) {
      const asset = await prisma.cryptoAsset.findUnique({ where: { symbol } });
      if (!asset) continue;
      await prisma.providerAsset.create({
        data: { providerId: provider.id, assetId: asset.id },
      });
    }
  }
}
