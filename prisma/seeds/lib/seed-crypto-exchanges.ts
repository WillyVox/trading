import { PrismaClient } from "@prisma/client";

import { CRYPTO_EXCHANGES } from "../crypto-exchanges";

export async function seedCryptoExchanges(prisma: PrismaClient) {
  const knownAssets = new Map(
    (
      await prisma.cryptoAsset.findMany({
        select: {
          id: true,
          symbol: true,
        },
      })
    ).map((asset) => [asset.symbol, asset.id])
  );

  for (const seed of CRYPTO_EXCHANGES) {
    const {
      facts = [],
      sources = [],
      regulations = [],
      ...providerData
    } = seed.provider;

    const provider = await prisma.provider.upsert({
      where: {
        slug: providerData.slug,
      },

      update: {
        ...providerData,

        facts: {
          deleteMany: {},
          create: facts,
        },

        sources: {
          deleteMany: {},
          create: sources,
        },

        regulations: {
          deleteMany: {},
          create: regulations,
        },
      },

      create: {
        ...providerData,

        facts: {
          create: facts,
        },

        sources: {
          create: sources,
        },

        regulations: {
          create: regulations,
        },
      },
    });

    const {
      assetSymbols = [],
      fees = [],
      features = [],
      prosCons = [],
      ...offeringData
    } = {
      logo: provider.logo,
      website: provider.website,
      description: provider.description,
      verificationStatus: provider.verificationStatus,
      lastVerifiedAt: provider.lastVerifiedAt,
      ...seed.offering,
    };

    const offering = await prisma.providerOffering.upsert({
      where: {
        slug: offeringData.slug,
      },

      update: {
        providerId: provider.id,
        ...offeringData,
      },

      create: {
        providerId: provider.id,
        ...offeringData,
      },
    });

    const assetRows = assetSymbols.map((symbol) => {
      const assetId = knownAssets.get(symbol);

      if (!assetId) {
        throw new Error(
          `${offering.slug}: unknown crypto asset symbol "${symbol}".`
        );
      }

      return {
        offeringId: offering.id,
        assetId,
      };
    });

    await prisma.$transaction([
      prisma.offeringFeature.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      prisma.offeringProsCon.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      prisma.offeringCryptoAsset.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      prisma.offeringFee.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),
    ]);

    if (features.length > 0) {
      await prisma.offeringFeature.createMany({
        data: features.map((feature) => ({
          offeringId: offering.id,
          ...feature,
        })),
      });
    }

    if (prosCons.length > 0) {
      await prisma.offeringProsCon.createMany({
        data: prosCons.map((prosCon, position) => ({
          offeringId: offering.id,
          position,
          ...prosCon,
        })),
      });
    }

    if (assetRows.length > 0) {
      await prisma.offeringCryptoAsset.createMany({
        data: assetRows,
      });
    }

    if (fees.length > 0) {
      await prisma.offeringFee.createMany({
        data: fees.map((fee) => ({
          offeringId: offering.id,
          ...fee,
        })),
      });
    }

    console.log(`Seeded crypto exchange: ${provider.name} → ${offering.name}`);
  }
}
