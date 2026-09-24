import { PrismaClient } from "@prisma/client";

import { SEED_MARKETS } from "../markets";
import { SHARE_TRADING_PLATFORMS } from "../share-trading-platforms";
import { assertValidFeeSeed } from "./types";

type OfferingMarketSeed = {
  marketCode: string;
  [key: string]: unknown;
};

type OfferingProductSeed = {
  [key: string]: unknown;
};

type OfferingCustodySeed = {
  marketCode?: string | null;
  [key: string]: unknown;
};

type OfferingAccountTypeSeed = {
  [key: string]: unknown;
};

type OfferingFeatureSeed = {
  [key: string]: unknown;
};

type OfferingProsConSeed = {
  [key: string]: unknown;
};

type FeeTierSeed = {
  minAmount: number;
  maxAmount?: number | null;
  flatAmount?: number;
  percentage?: number;
  minRolling30DayVolume?: number;
  minAssetsOnPlatform?: number;
  [key: string]: unknown;
};

/**
 * Seeds the reusable market catalogue first.
 *
 * OfferingMarket and OfferingCustody reference Market by database ID,
 * while the seed files intentionally use stable human-readable marketCode
 * values such as "ASX", "NYSE", and "NASDAQ".
 */
async function seedMarkets(prisma: PrismaClient) {
  console.log("Seeding markets...");

  for (const market of SEED_MARKETS) {
    await prisma.market.upsert({
      where: {
        code: market.code,
      },
      update: {
        name: market.name,
        countryCode: market.countryCode,
        exchangeCode: market.exchangeCode,
        currency: market.currency,
        region: market.region,
        active: true,
      },
      create: {
        ...market,
        active: true,
      },
    });
  }

  console.log(`Seeded ${SEED_MARKETS.length} markets.`);
}

/**
 * Seeds share-trading ProviderOfferings and their structured child data.
 *
 * Important:
 *
 * - Provider remains the brand/company.
 * - ProviderOffering is the product/service users compare.
 * - Seed files use marketCode instead of database IDs.
 * - This method resolves those codes to Market IDs.
 * - Child records are replaced on each seed run so seed.ts remains
 *   deterministic and idempotent.
 */
export async function seedShareTradingPlatforms(prisma: PrismaClient) {
  console.log("Seeding provider offerings...");

  // Offerings reference Market records, so markets must exist first.
  await seedMarkets(prisma);

  const markets = await prisma.market.findMany({
    select: {
      id: true,
      code: true,
    },
  });

  const marketIdByCode = new Map(
    markets.map((market) => [market.code, market.id])
  );

  const getMarketId = (marketCode: string) => {
    const marketId = marketIdByCode.get(marketCode);

    if (!marketId) {
      throw new Error(
        `Cannot seed offering: market "${marketCode}" does not exist.`
      );
    }

    return marketId;
  };

  for (const seed of SHARE_TRADING_PLATFORMS) {
    const { provider: providerSeed, offering: offeringSeed } = seed;

    /**
     * Upsert the provider/brand first.
     *
     * This is important because some trading providers may not exist in
     * SEED_PROVIDERS, which currently contains the crypto provider dataset.
     */
    const provider = await prisma.provider.upsert({
      where: {
        slug: providerSeed.slug,
      },
      update: {
        name: providerSeed.name,
        website: providerSeed.website,
        description: providerSeed.description,
        jurisdictions: providerSeed.jurisdictions,
        verificationStatus: providerSeed.verificationStatus,
        lastVerifiedAt: providerSeed.lastVerifiedAt,
      },
      create: {
        ...providerSeed,
      },
    });

    const {
      markets: offeringMarkets,
      products,
      custody,
      accountTypes,
      fees,
      features,
      prosCons,
      ...offeringData
    } = offeringSeed;

    /**
     * Upsert the actual comparable offering.
     *
     * Example:
     *
     * Provider: CMC Markets
     * Offering: CMC Invest
     */
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

    /**
     * Replace child data.
     *
     * This mirrors the approach already used by your crypto provider seeds:
     *
     * facts:    deleteMany + create
     * fees:     deleteMany + create
     * features: deleteMany + create
     *
     * Doing the same here makes repeated seed runs deterministic.
     */
    await prisma.$transaction([
      prisma.offeringMarket.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      prisma.offeringProduct.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      prisma.offeringCustody.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      prisma.offeringAccountType.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

      // OfferingFeeTier rows go with their fee (onDelete: Cascade).
      prisma.offeringFee.deleteMany({
        where: {
          offeringId: offering.id,
        },
      }),

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
    ]);

    /**
     * Markets
     */
    if (offeringMarkets.length > 0) {
      await prisma.offeringMarket.createMany({
        data: offeringMarkets.map(
          ({
            marketCode,
            ...market
          }: OfferingMarketSeed) => ({
            offeringId: offering.id,
            marketId: getMarketId(marketCode),
            ...market,
          })
        ),
      });
    }

    /**
     * Products
     */
    if (products.length > 0) {
      await prisma.offeringProduct.createMany({
        data: products.map((product: OfferingProductSeed) => ({
          offeringId: offering.id,
          ...product,
        })),
      });
    }

    /**
     * Custody
     */
    if (custody.length > 0) {
      await prisma.offeringCustody.createMany({
        data: custody.map(
          ({
            marketCode,
            ...custodyData
          }: OfferingCustodySeed) => ({
            offeringId: offering.id,
            marketId: marketCode ? getMarketId(marketCode) : null,
            ...custodyData,
          })
        ),
      });
    }

    /**
     * Account types
     */
    if (accountTypes.length > 0) {
      await prisma.offeringAccountType.createMany({
        data: accountTypes.map(
          (accountType: OfferingAccountTypeSeed) => ({
            offeringId: offering.id,
            ...accountType,
          })
        ),
      });
    }

    /**
     * Features and sourced pros/limitations.
     */
    if (features.length > 0) {
      await prisma.offeringFeature.createMany({
        data: features.map((feature: OfferingFeatureSeed) => ({
          offeringId: offering.id,
          ...feature,
        })),
      });
    }

    if (prosCons.length > 0) {
      await prisma.offeringProsCon.createMany({
        data: prosCons.map(
          (prosCon: OfferingProsConSeed, position: number) => ({
            offeringId: offering.id,
            position,
            ...prosCon,
          })
        ),
      });
    }

    /**
     * Fees (Phase 2)
     *
     * Created one at a time rather than with createMany: createMany can't
     * return IDs or nest OfferingFeeTier rows, and a fee and its tiers must
     * land together. The seed set is tiny, so the extra round-trips are
     * irrelevant. Tier `position` is the array index, so seed order is
     * display order.
     *
     * assertValidFeeSeed() throws on structurally incoherent data (e.g. a
     * TIERED fee with no tiers, non-contiguous tier bounds) so a typo fails
     * the seed run instead of reaching the public pages.
     */
    for (const fee of fees) {
      assertValidFeeSeed(offering.slug, fee);

      const { marketCode, tiers, ...feeData } = fee;

      await prisma.offeringFee.create({
        data: {
          offeringId: offering.id,
          marketId: marketCode ? getMarketId(marketCode) : null,
          ...feeData,
          tiers:
            tiers && tiers.length > 0
              ? {
                  create: tiers.map(
                    (tier: FeeTierSeed, position: number) => ({
                      ...tier,
                      position,
                    })
                  ),
                }
              : undefined,
        },
      });
    }

    console.log(
      `Seeded offering: ${provider.name} → ${offering.name} (${fees.length} fees)`
    );
  }

  console.log(
    `Seeded ${SHARE_TRADING_PLATFORMS.length} share-trading platforms.`
  );
}