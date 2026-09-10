import {
  PrismaClient,
  VerificationStatus,
  ProviderType,
  ProviderFeeType,
  FeeValueType,
  ProviderFeatureType,
  ProviderSourceType,
  ProviderProsConsType,
  ArticleStatus,
  CommissionType,
  AffiliatePartnerStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

// Seed only facts that have actually been researched. Anything not
// independently verified stays UNVERIFIED with a sourceUrl attached so an
// editor can check it before publication -- never guessed values.
//
// CoinSpot and Independent Reserve below were researched against official
// sources (coinspot.com.au/fees, CoinSpot's own Zendesk help articles,
// independentreserve.com's FAQ) plus, where no official page states a
// figure directly, reputable third-party reviews -- those are marked
// UNVERIFIED with the reviewing source attached rather than upgraded to
// VERIFIED on secondhand reporting. Checked 11 Sep 2026. Australia's crypto
// licensing regime changed materially in 2026 (AUSTRAC's expanded VASP
// scope from 31 March 2026; ASIC's AFSL "no-action" deadline of 30 June
// 2026 under the Digital Assets Framework) -- re-verify regulatory facts on
// a short cycle rather than treating this seed as a one-time task.
const providers = [
  {
    name: "CoinSpot",
    slug: "coinspot",
    website: "https://www.coinspot.com.au",
    description:
      "Australian cryptocurrency platform (Casey Block Services Pty Ltd) offering Instant Buy/Sell/Swap, an order-book Markets product, and an OTC desk, with AUD deposits via PayID, POLi and bank transfer.",
    providerType: ProviderType.CRYPTO_EXCHANGE,
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: new Date("2026-09-11"),
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
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        label: "Platform Type",
        value: "Centralised cryptocurrency exchange",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Operating entity",
        value: "Casey Block Services Pty Ltd",
        jurisdiction: "AU",
        sourceUrl: "https://www.cryptonewsz.com/cryptocurrency-exchange/coinspot-review/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Founded",
        value: "2013",
        jurisdiction: "AU",
        sourceUrl: "https://coindaily.com.au/exchanges/coinspot/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees: [
      {
        feeType: ProviderFeeType.TRADING,
        label: "Markets order-book fee",
        valueType: FeeValueType.PERCENTAGE,
        percentage: 0.1,
        displayValue: "0.1%",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        feeType: ProviderFeeType.INSTANT_BUY,
        label: "Instant Buy / Sell / Swap fee",
        valueType: FeeValueType.PERCENTAGE,
        percentage: 1.0,
        displayValue: "1% (plus spread built into the quoted price)",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        feeType: ProviderFeeType.OTHER,
        label: "OTC desk fee (trades \u2265 $20,000 AUD)",
        valueType: FeeValueType.PERCENTAGE,
        percentage: 0.1,
        displayValue: "0.1%",
        jurisdiction: "AU",
        sourceUrl: "https://www.coinspot.com.au/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        feeType: ProviderFeeType.FIAT_DEPOSIT,
        label: "AUD deposit fee (PayID / POLi / bank transfer)",
        valueType: FeeValueType.FREE,
        displayValue: "Free",
        jurisdiction: "AU",
        sourceUrl: "https://coinspot.zendesk.com/hc/en-us/articles/360001426235-Pricing-FAQ",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        feeType: ProviderFeeType.WITHDRAWAL,
        label: "Crypto withdrawal fee",
        valueType: FeeValueType.FREE,
        displayValue: "No CoinSpot fee; standard blockchain network fee applies",
        jurisdiction: "AU",
        sourceUrl: "https://www.hollaex.com/blog/coinspot-review-features-deposit-methods-fees-assessed",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    features: [
      { featureType: ProviderFeatureType.AUD_DEPOSITS, available: true, verificationStatus: VerificationStatus.VERIFIED, sourceUrl: "https://www.coinspot.com.au/fees" },
      { featureType: ProviderFeatureType.AUD_WITHDRAWALS, available: true, verificationStatus: VerificationStatus.VERIFIED, sourceUrl: "https://www.coinspot.com.au/fees" },
      { featureType: ProviderFeatureType.PAYID, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.marketplacefairness.org/au/cryptocurrency/coinspot-review/" },
      { featureType: ProviderFeatureType.BANK_TRANSFER, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.marketplacefairness.org/au/cryptocurrency/coinspot-review/" },
      { featureType: ProviderFeatureType.MOBILE_APP, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.hollaex.com/blog/coinspot-review-features-deposit-methods-fees-assessed" },
      { featureType: ProviderFeatureType.RECURRING_BUYS, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.datawallet.com/crypto/coinspot-review" },
      { featureType: ProviderFeatureType.ADVANCED_CHARTING, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.hollaex.com/blog/coinspot-review-features-deposit-methods-fees-assessed" },
      { featureType: ProviderFeatureType.OTC_DESK, available: true, verificationStatus: VerificationStatus.VERIFIED, sourceUrl: "https://www.coinspot.com.au/fees", verifiedAt: new Date("2026-09-11") },
      { featureType: ProviderFeatureType.SMSF_SUPPORT, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://coindaily.com.au/exchanges/coinspot/" },
      { featureType: ProviderFeatureType.STAKING, available: null },
      { featureType: ProviderFeatureType.COLD_STORAGE, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.marketplacefairness.org/au/cryptocurrency/coinspot-review/" },
      { featureType: ProviderFeatureType.TWO_FACTOR_AUTH, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://www.cryptonewsz.com/cryptocurrency-exchange/coinspot-review/" },
    ],
    prosCons: [
      {
        type: ProviderProsConsType.PRO,
        label: "Widest coin selection of any Australian exchange (500+ listed)",
        sourceUrl: "https://www.datawallet.com/crypto/coinspot-review",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        type: ProviderProsConsType.PRO,
        label: "AUSTRAC-registered since 2018 and holds an ASIC AFSL with a non-cash payments authorisation",
        detail: "AFSL held as of 29 April 2026, per CoinSpot's own regulatory disclosure.",
        sourceUrl: "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        type: ProviderProsConsType.PRO,
        label: "Free AUD deposits and withdrawals via PayID, POLi and bank transfer",
        sourceUrl: "https://www.coinspot.com.au/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        type: ProviderProsConsType.LIMITATION,
        label: "Default Instant Buy/Sell/Swap costs a flat 1% plus spread \u2014 ten times the 0.1% Markets order-book rate",
        sourceUrl: "https://www.coinspot.com.au/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        type: ProviderProsConsType.LIMITATION,
        label: "Markets order book has thin liquidity outside major coins, so many listed pairs don't fill cheaply at size",
        sourceUrl: "https://coindaily.com.au/exchanges/coinspot/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    sources: [
      { label: "Official website", url: "https://www.coinspot.com.au", sourceType: ProviderSourceType.OFFICIAL_WEBSITE },
      { label: "Official fees", url: "https://www.coinspot.com.au/fees", sourceType: ProviderSourceType.OFFICIAL_FEES },
      {
        label: "CoinSpot support: AUSTRAC & ASIC regulatory status",
        url: "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
        sourceType: ProviderSourceType.OFFICIAL_SUPPORT,
      },
    ],
    regulations: [
      {
        jurisdiction: "AU",
        regulator: "AUSTRAC",
        status: "Registered Digital Currency Exchange (DCE) since 8 May 2018",
        sourceUrl: "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
        verifiedAt: new Date("2026-09-11"),
      },
      {
        jurisdiction: "AU",
        regulator: "ASIC",
        status: "Holds an Australian Financial Services Licence (AFSL) with a non-cash payments authorisation, as of 29 April 2026",
        sourceUrl: "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
        verifiedAt: new Date("2026-09-11"),
      },
    ],
  },
  {
    name: "Independent Reserve",
    slug: "independent-reserve",
    website: "https://www.independentreserve.com",
    description:
      "Australian cryptocurrency exchange operating since 2013, offering a maker/taker order book, OTC-scale trading and dedicated SMSF account types, with core infrastructure hosted in Sydney.",
    providerType: ProviderType.CRYPTO_EXCHANGE,
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-11"),
    assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
    facts: [
      {
        label: "Headquarters / Market",
        value: "Australia (core infrastructure hosted in Sydney)",
        jurisdiction: "AU",
        sourceUrl: "https://www.independentreserve.com/help/faq",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-11"),
      },
      {
        label: "Platform Type",
        value: "Centralised cryptocurrency exchange (maker/taker order book)",
        jurisdiction: "AU",
        sourceUrl: "https://www.independentreserve.com",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Founded",
        value: "2013",
        jurisdiction: "AU",
        sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Ownership",
        value: "IG Group (FTSE 250) acquired a 70% stake in January 2026; founding team retained 30%",
        jurisdiction: "AU",
        sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        label: "Listed cryptocurrencies",
        value: "Approximately 35\u201341 (narrower, blue-chip-focused selection; exact count varies over time)",
        jurisdiction: "AU",
        sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees: [
      {
        feeType: ProviderFeeType.MAKER,
        label: "Spot maker fee",
        valueType: FeeValueType.TIERED,
        percentage: 0.1,
        displayValue: "From 0.10%, tiered down on rolling 30-day volume",
        jurisdiction: "AU",
        sourceUrl: "https://tradingbrokers.com/independent-reserve-review/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        feeType: ProviderFeeType.TAKER,
        label: "Spot taker fee",
        valueType: FeeValueType.TIERED,
        percentage: 0.5,
        displayValue: "From 0.50% down to 0.02% for the highest-volume tier",
        jurisdiction: "AU",
        sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        feeType: ProviderFeeType.FIAT_DEPOSIT,
        label: "AUD deposit fee (bank transfer)",
        valueType: FeeValueType.VARIABLE,
        displayValue: "Typically free for standard AUD bank transfer; varies by method",
        jurisdiction: "AU",
        sourceUrl: "https://tradingbrokers.com/independent-reserve-review/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        feeType: ProviderFeeType.WITHDRAWAL,
        label: "Crypto withdrawal fee (Bitcoin)",
        valueType: FeeValueType.FIXED,
        fixedAmount: 0.0003,
        currency: "BTC",
        displayValue: "Fixed fee per asset (e.g. approx. 0.0003 BTC for Bitcoin); varies by asset",
        jurisdiction: "AU",
        sourceUrl: "https://tradingbrokers.com/independent-reserve-review/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    features: [
      { featureType: ProviderFeatureType.AUD_DEPOSITS, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://tradingbrokers.com/independent-reserve-review/" },
      { featureType: ProviderFeatureType.BANK_TRANSFER, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://tradingbrokers.com/independent-reserve-review/" },
      { featureType: ProviderFeatureType.API_ACCESS, available: true, verificationStatus: VerificationStatus.VERIFIED, sourceUrl: "https://www.independentreserve.com/help/faq", verifiedAt: new Date("2026-09-11") },
      { featureType: ProviderFeatureType.SMSF_SUPPORT, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html" },
      { featureType: ProviderFeatureType.COLD_STORAGE, available: true, verificationStatus: VerificationStatus.VERIFIED, sourceUrl: "https://www.independentreserve.com/help/faq", verifiedAt: new Date("2026-09-11") },
      { featureType: ProviderFeatureType.TWO_FACTOR_AUTH, available: true, verificationStatus: VerificationStatus.UNVERIFIED, sourceUrl: "https://cryptohead.io/independent-reserve-review/" },
    ],
    prosCons: [
      {
        type: ProviderProsConsType.PRO,
        label: "Tiered maker/taker fees fall as low as 0.02% for high-volume traders",
        sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        type: ProviderProsConsType.PRO,
        label: "Majority of customer crypto reported held in cold storage, with optional insurance on Premium accounts",
        sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        type: ProviderProsConsType.PRO,
        label: "Operating since 2013 with no publicly reported major security incident",
        sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        type: ProviderProsConsType.LIMITATION,
        label: "Narrower coin selection (roughly 35\u201341 assets) than AU brokerage-style competitors",
        sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        type: ProviderProsConsType.LIMITATION,
        label: "Standard 0.50% taker fee is higher than CoinSpot's 0.1% Markets rate for a typical retail-size trade",
        sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    sources: [
      { label: "Official website", url: "https://www.independentreserve.com", sourceType: ProviderSourceType.OFFICIAL_WEBSITE },
      { label: "Official FAQ", url: "https://www.independentreserve.com/help/faq", sourceType: ProviderSourceType.OFFICIAL_SUPPORT },
    ],
    regulations: [
      {
        jurisdiction: "AU",
        regulator: "AUSTRAC",
        status: "Registered Digital Currency Exchange; one of the first two AU exchanges to confirm AUSTRAC enrolment in 2018",
        sourceUrl: "https://www.gtlaw.com.au/knowledge/austrac-releases-amlctf-guide-digital-currency-exchange-providers",
      },
      {
        jurisdiction: "AU",
        regulator: "ASIC",
        status: "Not AFSL-licensed as of the last check; has received legal advice that an AFSL is not currently required and states it continues to monitor this position",
        sourceUrl: "https://www.forbes.com/advisor/au/investing/cryptocurrency/independent-reserve-review/",
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
    {
      providerSlug: "independent-reserve",
      partnerSlug: "independent-reserve",
      approvedUrl: "https://www.independentreserve.com",
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

  for (const p of providers as any[]) {
    const { facts, fees, features, prosCons, sources, regulations, assetSymbols, ...providerData } = p;

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

  console.log("Seeded crypto assets and three providers with structured facts/fees/features/prosCons/sources.");
  console.log(
    "CoinSpot and Independent Reserve carry real, sourced Australian data (official pages + cited third-party reviews) as of 11 Sep 2026 -- Kraken remains an UNVERIFIED placeholder. Re-verify regulatory facts before publishing given the 2026 AUSTRAC/ASIC framework changes.",
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
