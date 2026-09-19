import { PrismaClient } from "@prisma/client";
import { CRYPTO_EXCHANGES } from "../crypto-exchanges";

export async function seedCryptoExchanges(prisma: PrismaClient) {
  const knownAssets = new Map(
    (
      await prisma.cryptoAsset.findMany({ select: { id: true, symbol: true } })
    ).map((a) => [a.symbol, a.id])
  );

  for (const seed of CRYPTO_EXCHANGES as any[]) {
    const {
      facts = [],
      sources = [],
      regulations = [],
      ...providerData
    } = seed.provider;
    const provider = await prisma.provider.upsert({
      where: { slug: providerData.slug },
      update: {
        ...providerData,
        facts: { deleteMany: {}, create: facts },
        sources: { deleteMany: {}, create: sources },
        regulations: { deleteMany: {}, create: regulations },
      },
      create: {
        ...providerData,
        facts: { create: facts },
        sources: { create: sources },
        regulations: { create: regulations },
      },
    });

    const {
      assetSymbols = [],
      fees = [],
      features = [],
      prosCons = [],
      ...offeringData
    } = seed.offering;
    const offering = await prisma.providerOffering.upsert({
      where: { slug: offeringData.slug },
      update: {
        providerId: provider.id,
        logo: offeringData.logo ?? provider.logo,
        website: offeringData.website ?? provider.website,
        description: offeringData.description ?? provider.description,
        verificationStatus:
          offeringData.verificationStatus ?? provider.verificationStatus,
        lastVerifiedAt: offeringData.lastVerifiedAt ?? provider.lastVerifiedAt,
        ...offeringData,
      },
      create: {
        providerId: provider.id,
        logo: offeringData.logo ?? provider.logo,
        website: offeringData.website ?? provider.website,
        description: offeringData.description ?? provider.description,
        verificationStatus:
          offeringData.verificationStatus ?? provider.verificationStatus,
        lastVerifiedAt: offeringData.lastVerifiedAt ?? provider.lastVerifiedAt,
        ...offeringData,
      },
    });

    const assetRows = assetSymbols.map((symbol: string) => {
      const assetId = knownAssets.get(symbol);
      if (!assetId)
        throw new Error(
          `${offering.slug}: unknown crypto asset symbol "${symbol}".`
        );
      return { offeringId: offering.id, assetId };
    });

    await prisma.$transaction([
      prisma.offeringFeature.deleteMany({ where: { offeringId: offering.id } }),
      prisma.offeringProsCon.deleteMany({ where: { offeringId: offering.id } }),
      prisma.offeringCryptoAsset.deleteMany({
        where: { offeringId: offering.id },
      }),
      prisma.offeringFee.deleteMany({ where: { offeringId: offering.id } }),
    ]);
    if (features.length)
      await prisma.offeringFeature.createMany({
        data: features.map((x: any) => ({ offeringId: offering.id, ...x })),
      });
    if (prosCons.length)
      await prisma.offeringProsCon.createMany({
        data: prosCons.map((x: any, position: number) => ({
          offeringId: offering.id,
          position,
          ...x,
        })),
      });
    if (assetRows.length)
      await prisma.offeringCryptoAsset.createMany({ data: assetRows });
    if (fees.length)
      await prisma.offeringFee.createMany({
        data: fees.map((x: any) => ({ offeringId: offering.id, ...x })),
      });
    console.log(`Seeded crypto exchange: ${provider.name} → ${offering.name}`);
  }
}
