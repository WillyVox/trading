import {
  FeeCalculationBasis,
  FeeCategory,
  OfferingFeatureType,
  OfferingProsConsType,
  OfferingType,
  ProviderSourceType,
  VerificationStatus,
} from "@prisma/client";

export const BtcMarkets = {
  provider: {
    name: "BTC Markets",
    slug: "btc-markets",
    website: "https://www.btcmarkets.net",
    description:
      "Australian cryptocurrency exchange offering Advanced Trade/order-book markets and Quick Buy/Sell, with AUD funding, mobile trading and API access.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
    logo: "/images/providers/btc-markets.svg",
    facts: [
      {
        label: "Headquarters / Market",
        value: "Australia",
        jurisdiction: "AU",
        sourceUrl: "https://www.btcmarkets.net",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "Platform Type",
        value: "Centralised cryptocurrency exchange",
        jurisdiction: "AU",
        sourceUrl: "https://www.btcmarkets.net",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "Trading interfaces",
        value: "Advanced Trade/order book and Quick Buy/Sell",
        jurisdiction: "AU",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    sources: [
      {
        label: "Official website",
        url: "https://www.btcmarkets.net",
        sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
      },
      {
        label: "Official fee schedule",
        url: "https://www.btcmarkets.net/fees",
        sourceType: ProviderSourceType.OFFICIAL_FEES,
      },
      {
        label: "Official regulation information",
        url: "https://www.btcmarkets.net/regulation",
        sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
      },
    ],
    regulations: [
      {
        jurisdiction: "AU",
        regulator: "AUSTRAC",
        status:
          "Registered with AUSTRAC as a virtual asset service provider; BTC Markets also describes itself as a registered Digital Currency Exchange",
        sourceUrl: "https://www.btcmarkets.net/regulation",
        verifiedAt: new Date("2026-09-17"),
      },
    ],
  },
  offering: {
    name: "BTC Markets Crypto Exchange",
    slug: "btc-markets-exchange",
    offeringType: OfferingType.CRYPTO_EXCHANGE,
    jurisdiction: "AU",
    assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
    fees: [
      {
        feeCategory: FeeCategory.CRYPTO_TRADING,
        label: "AUD/USDT exchange trading fee",
        calculationBasis: FeeCalculationBasis.TIERED,
        percentage: 0.85,
        displayValue:
          "0.85% at the lowest volume tier, decreasing to 0.10% above $5m rolling 30-day volume",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        feeCategory: FeeCategory.MAKER,
        label: "BTC-pair maker fee",
        calculationBasis: FeeCalculationBasis.PERCENTAGE,
        percentage: -0.05,
        displayValue: "-0.05% maker rebate for supported BTC market pairs",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        feeCategory: FeeCategory.TAKER,
        label: "BTC-pair taker fee",
        calculationBasis: FeeCalculationBasis.PERCENTAGE,
        percentage: 0.2,
        displayValue: "0.20% for supported BTC market pairs",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        feeCategory: FeeCategory.SPREAD,
        label: "Quick Buy/Sell spread",
        calculationBasis: FeeCalculationBasis.VARIES,
        displayValue:
          "Variable spread included in quoted price; no additional Quick Buy/Sell trading fee",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    features: [
      {
        featureType: OfferingFeatureType.AUD_DEPOSITS,
        available: true,
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.MOBILE_APP,
        available: true,
        sourceUrl: "https://www.btcmarkets.net",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.API_ACCESS,
        available: true,
        sourceUrl: "https://docs.btcmarkets.net/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.TWO_FACTOR_AUTH,
        available: true,
        sourceUrl: "https://www.btcmarkets.net",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.COLD_STORAGE,
        available: true,
        sourceUrl: "https://www.btcmarkets.net/institutional",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    prosCons: [
      {
        type: OfferingProsConsType.PRO,
        label:
          "Offers Advanced Trade/order-book trading plus simpler Quick Buy/Sell pricing",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label: "Lowest-volume AUD/USDT exchange trading tier is 0.85%",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label:
          "Quick Buy/Sell pricing includes a variable spread rather than using the Advanced Trade fee schedule",
        sourceUrl: "https://www.btcmarkets.net/fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
  },
};
