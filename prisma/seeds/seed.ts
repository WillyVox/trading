import { PrismaClient, ArticleStatus, ArticleType } from "@prisma/client";
import { SEED_PROVIDERS } from "./providers/seed-providers";
import { affiliateSeeds } from "./affiliate-links";

const prisma = new PrismaClient();

const cryptoAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    slug: "bitcoin",
    description: "The original decentralised cryptocurrency, launched in 2009.",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    slug: "ethereum",
    description: "A programmable blockchain supporting smart contracts.",
  },
  {
    symbol: "SOL",
    name: "Solana",
    slug: "solana",
    description:
      "A high-throughput blockchain used for trading and applications.",
  },
  {
    symbol: "XRP",
    name: "XRP",
    slug: "xrp",
    description:
      "A digital asset associated with the XRP Ledger, used for payments.",
  },
];
async function seedAffiliateLinks() {
  for (const seed of affiliateSeeds) {
    const provider = await prisma.provider.findUnique({
      where: {
        slug: seed.providerSlug,
      },
    });

    if (!provider) {
      console.warn(
        `Affiliate seed skipped: provider "${seed.providerSlug}" does not exist.`
      );
      continue;
    }

    // Find an existing partnership for this provider.
    let partnership = await prisma.affiliatePartnership.findFirst({
      where: {
        providerId: provider.id,
      },
      include: {
        programs: true,
      },
    });

    // Create one if the provider does not have a partnership yet.
    if (!partnership) {
      partnership = await prisma.affiliatePartnership.create({
        data: {
          providerId: provider.id,
          status: seed.partnershipStatus,
        },
        include: {
          programs: true,
        },
      });
    }

    // For the seed, reuse the first existing program if one exists.
    // Otherwise create a default program.
    let program = partnership.programs[0];

    if (!program) {
      program = await prisma.affiliateProgram.create({
        data: {
          partnershipId: partnership.id,
          commissionType: seed.commissionType,
          notes: seed.notes,
        },
      });
    }

    await prisma.affiliateLink.upsert({
      where: {
        partnerSlug: seed.partnerSlug,
      },
      update: {
        programId: program.id,
        approvedUrl: seed.approvedUrl,
        placement: seed.placement,
        campaign: seed.campaign,
        active: seed.active,
      },
      create: {
        programId: program.id,
        partnerSlug: seed.partnerSlug,
        approvedUrl: seed.approvedUrl,
        placement: seed.placement,
        campaign: seed.campaign,
        active: seed.active,
      },
    });

    console.log(
      `Seeded affiliate link for ${provider.name} (${seed.partnerSlug})`
    );
  }
}

async function main() {
  for (const asset of cryptoAssets) {
    await prisma.cryptoAsset.upsert({
      where: { slug: asset.slug },
      update: asset,
      create: asset,
    });
  }

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

  // ---------------------------------------
  // Seed affiliate partnerships/programs/links
  // ---------------------------------------

  await seedAffiliateLinks();

  // One sample guide, linked to Bitcoin, so /crypto/bitcoin's "related
  // guides" section has something real to show rather than an empty state.
  const bitcoin = await prisma.cryptoAsset.findUnique({
    where: { slug: "bitcoin" },
  });
  if (bitcoin) {
    const guide = await prisma.article.upsert({
      where: { slug: "what-is-bitcoin" },
      update: {},
      create: {
        title: "What Is Bitcoin? A Beginner's Guide for Australians",
        slug: "what-is-bitcoin",
        excerpt:
          "An introduction to how Bitcoin works and how Australians can access it.",
        content:
          "<p>Placeholder guide content -- replace before publication.</p>",
        status: ArticleStatus.DRAFT,
        articleType: ArticleType.GUIDE,
        category: "guide",
      },
    });
    await prisma.articleCryptoAsset.upsert({
      where: {
        articleId_assetId: { articleId: guide.id, assetId: bitcoin.id },
      },
      update: {},
      create: { articleId: guide.id, assetId: bitcoin.id },
    });
  }

  console.log(
    "Seeded crypto assets and 6 providers with structured facts/fees/features/prosCons/sources."
  );
  console.log(
    "CoinSpot, Independent Reserve, Swyftx and BTC Markets carry researched Australian data as of 11 Sep 2026 -- Kraken remains an UNVERIFIED placeholder. Re-verify time-sensitive fees, regulatory facts and product availability before publishing."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
