import {
  PrismaClient,
  VerificationStatus,
  ProviderType,
  ProviderFeeType,
  FeeValueType,
  ProviderFeatureType,
  ProviderSourceType,
  ArticleStatus,
  CommissionType,
  AffiliatePartnerStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

// Seed only facts that have actually been researched. Anything not
// independently verified stays UNVERIFIED with a sourceUrl attached so an
// editor can check it before publication -- never guessed values.
const providers = [
  {
    name: "CoinSpot",
    slug: "coinspot",
    website: "https://www.coinspot.com.au",
    description:
      "Australian cryptocurrency platform offering buying, selling and trading of digital assets.",
    providerType: ProviderType.CRYPTO_EXCHANGE,
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    assetSymbols: ["BTC", "ETH", "SOL"],
    facts: [
      {
        label: "Headquarters / Market",
        value: "Australia",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "AUD Support",
        value: "Yes",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Platform Type",
        value: "Centralised cryptocurrency exchange",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees: [
      {
        feeType: ProviderFeeType.TRADING,
        label: "Market trading fee",
        valueType: FeeValueType.VARIABLE,
        displayValue: "Verify from official fee schedule",
        jurisdiction: "AU",
      },
      {
        feeType: ProviderFeeType.INSTANT_BUY,
        label: "Instant buy/sell fee",
        valueType: FeeValueType.VARIABLE,
        displayValue: "Verify from official fee schedule",
        jurisdiction: "AU",
      },
      {
        feeType: ProviderFeeType.FIAT_DEPOSIT,
        label: "AUD deposit fee",
        valueType: FeeValueType.VARIABLE,
        displayValue: "Verify by deposit method",
        jurisdiction: "AU",
      },
    ],
    features: [
      { featureType: ProviderFeatureType.AUD_DEPOSITS, available: true },
      { featureType: ProviderFeatureType.MOBILE_APP, available: true },
      { featureType: ProviderFeatureType.RECURRING_BUYS, available: true },
      { featureType: ProviderFeatureType.STAKING, available: null },
    ],
    sources: [
      { label: "Official website", url: "https://www.coinspot.com.au", sourceType: ProviderSourceType.OFFICIAL_WEBSITE },
      { label: "Official fees", url: "https://www.coinspot.com.au/fees", sourceType: ProviderSourceType.OFFICIAL_FEES },
    ],
    regulations: [
      {
        jurisdiction: "AU",
        regulator: "AUSTRAC",
        status: "Verify registration before publication",
      },
    ],
  },
  {
    name: "Kraken",
    slug: "kraken",
    website: "https://www.kraken.com",
    description: "Global cryptocurrency exchange offering trading and custody, with an Australian-facing onramp.",
    providerType: ProviderType.CRYPTO_EXCHANGE,
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
    facts: [
      {
        label: "AUD Support",
        value: "Yes",
        jurisdiction: "AU",
        sourceUrl: "https://www.kraken.com",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Platform Type",
        value: "Centralised cryptocurrency exchange",
        jurisdiction: "AU",
        sourceUrl: "https://www.kraken.com",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees: [
      {
        feeType: ProviderFeeType.MAKER,
        label: "Spot maker fee",
        valueType: FeeValueType.VARIABLE,
        displayValue: "Verify from official fee schedule",
        jurisdiction: "AU",
      },
      {
        feeType: ProviderFeeType.TAKER,
        label: "Spot taker fee",
        valueType: FeeValueType.VARIABLE,
        displayValue: "Verify from official fee schedule",
        jurisdiction: "AU",
      },
    ],
    features: [
      { featureType: ProviderFeatureType.AUD_DEPOSITS, available: true },
      { featureType: ProviderFeatureType.MOBILE_APP, available: true },
      { featureType: ProviderFeatureType.STAKING, available: true },
      { featureType: ProviderFeatureType.API_ACCESS, available: true },
    ],
    sources: [
      { label: "Official website", url: "https://www.kraken.com", sourceType: ProviderSourceType.OFFICIAL_WEBSITE },
      { label: "Official fees", url: "https://www.kraken.com/features/fee-schedule", sourceType: ProviderSourceType.OFFICIAL_FEES },
    ],
    regulations: [],
  },
];

const cryptoAssets = [
  { symbol: "BTC", name: "Bitcoin", slug: "bitcoin", description: "The original decentralised cryptocurrency, launched in 2009." },
  { symbol: "ETH", name: "Ethereum", slug: "ethereum", description: "A programmable blockchain supporting smart contracts." },
  { symbol: "SOL", name: "Solana", slug: "solana", description: "A high-throughput blockchain used for trading and applications." },
  { symbol: "XRP", name: "XRP", slug: "xrp", description: "A digital asset associated with the XRP Ledger, used for payments." },
];
async function seedAffiliateLinks() {
  const affiliateSeeds = [
    {
      providerSlug: "coinspot",
      partnerSlug: "coinspot",
      approvedUrl: "https://www.coinspot.com.au",
      placement: "PROVIDER_PROFILE",
      campaign: "default",
      commissionType: CommissionType.NONE,
      partnershipStatus: AffiliatePartnerStatus.PROSPECT,
      notes:
        "Placeholder affiliate configuration. Replace approvedUrl and activate only after an official affiliate agreement is approved.",
      active: false,
    },
    {
      providerSlug: "kraken",
      partnerSlug: "kraken",
      approvedUrl: "https://www.kraken.com",
      placement: "PROVIDER_PROFILE",
      campaign: "default",
      commissionType: CommissionType.NONE,
      partnershipStatus: AffiliatePartnerStatus.PROSPECT,
      notes:
        "Placeholder affiliate configuration. Replace approvedUrl and activate only after an official affiliate agreement is approved.",
      active: false,
    },
  ];

  for (const seed of affiliateSeeds) {
    const provider = await prisma.provider.findUnique({
      where: {
        slug: seed.providerSlug,
      },
    });

    if (!provider) {
      console.warn(
        `Affiliate seed skipped: provider "${seed.providerSlug}" does not exist.`,
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
      `Seeded affiliate link for ${provider.name} (${seed.partnerSlug})`,
    );
  }
}

async function main() {
  for (const asset of cryptoAssets) {
    await prisma.cryptoAsset.upsert({ where: { slug: asset.slug }, update: asset, create: asset });
  }

  for (const p of providers) {
    const { facts, fees, features, sources, regulations, assetSymbols, ...providerData } = p;

    const provider = await prisma.provider.upsert({
      where: { slug: providerData.slug },
      update: {
        ...providerData,
        facts: { deleteMany: {}, create: facts },
        fees: { deleteMany: {}, create: fees },
        features: { deleteMany: {}, create: features },
        sources: { deleteMany: {}, create: sources },
        regulations: { deleteMany: {}, create: regulations },
      },
      create: {
        ...providerData,
        facts: { create: facts },
        fees: { create: fees },
        features: { create: features },
        sources: { create: sources },
        regulations: { create: regulations },
      },
    });

    await prisma.providerAsset.deleteMany({ where: { providerId: provider.id } });
    for (const symbol of assetSymbols) {
      const asset = await prisma.cryptoAsset.findUnique({ where: { symbol } });
      if (!asset) continue;
      await prisma.providerAsset.create({ data: { providerId: provider.id, assetId: asset.id } });
    }
  }


  // ---------------------------------------
  // Seed affiliate partnerships/programs/links
  // ---------------------------------------

  await seedAffiliateLinks();

  // One sample guide, linked to Bitcoin, so /crypto/bitcoin's "related
  // guides" section has something real to show rather than an empty state.
  const bitcoin = await prisma.cryptoAsset.findUnique({ where: { slug: "bitcoin" } });
  if (bitcoin) {
    const guide = await prisma.article.upsert({
      where: { slug: "what-is-bitcoin" },
      update: {},
      create: {
        title: "What Is Bitcoin? A Beginner's Guide for Australians",
        slug: "what-is-bitcoin",
        excerpt: "An introduction to how Bitcoin works and how Australians can access it.",
        content: "<p>Placeholder guide content -- replace before publication.</p>",
        status: ArticleStatus.DRAFT,
        category: "guide",
      },
    });
    await prisma.articleCryptoAsset.upsert({
      where: { articleId_assetId: { articleId: guide.id, assetId: bitcoin.id } },
      update: {},
      create: { articleId: guide.id, assetId: bitcoin.id },
    });
  }

  console.log("Seeded crypto assets and two providers with structured facts/fees/features/sources.");
  console.log("All fee/regulation values are UNVERIFIED placeholders -- verify before publishing.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
