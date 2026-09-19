import {
  FeeCalculationBasis,
  FeeCategory,
  OfferingFeatureType,
  OfferingProsConsType,
  OfferingType,
  ProviderSourceType,
  VerificationStatus,
} from "@prisma/client";

export const Swyftx = {
  provider: {
    name: "Swyftx",
    slug: "swyftx",
    website: "https://swyftx.com",
    logo: "/images/providers/swyftx.svg",
    description:
      "Australian-owned and operated cryptocurrency platform supporting AUD funding, 410+ crypto assets, Auto Invest and tiered trading fees based on rolling 30-day trading volume.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
    facts: [
      {
        label: "Headquarters",
        value: "Milton, Brisbane, Queensland, Australia",
        jurisdiction: "AU",
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "Legal entity",
        value: "Swyftx Pty Ltd",
        jurisdiction: "AU",
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "ABN",
        value: "72 623 556 730",
        jurisdiction: "AU",
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "AUD Support",
        value: "Yes",
        jurisdiction: "AU",
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "Platform Type",
        value: "Centralised cryptocurrency trading platform",
        jurisdiction: "AU",
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        label: "Advertised crypto assets",
        value: "410+",
        jurisdiction: "AU",
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    sources: [
      {
        label: "Official website",
        url: "https://swyftx.com",
        sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
      },
      {
        label: "Official trading fees",
        url: "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
        sourceType: ProviderSourceType.OFFICIAL_FEES,
      },
      {
        label: "Official platform facts",
        url: "https://swyftx.com/facts/",
        sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
      },
    ],
    regulations: [
      {
        jurisdiction: "AU",
        regulator: "AUSTRAC",
        status:
          "Swyftx Pty Ltd is registered as a Digital Currency Exchange Provider",
        sourceUrl: "https://swyftx.com/facts/",
        verifiedAt: new Date("2026-09-17"),
      },
      {
        jurisdiction: "AU",
        regulator: "ASIC",
        status:
          "Swyftx Pty Ltd states it holds AFSL 568543; its disclosure separately states no AFSL for spot crypto, so licence scope must be displayed separately from spot-crypto services",
        sourceUrl: "https://swyftx.com/facts/",
        verifiedAt: new Date("2026-09-17"),
      },
    ],
  },
  offering: {
    name: "Swyftx Crypto Exchange",
    slug: "swyftx-exchange",
    offeringType: OfferingType.CRYPTO_EXCHANGE,
    jurisdiction: "AU",
    assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
    fees: [
      {
        feeCategory: FeeCategory.CRYPTO_TRADING,
        label: "Standard trading fee",
        calculationBasis: FeeCalculationBasis.TIERED,
        percentage: 0.6,
        displayValue:
          "0.60% below AUD $100,000 rolling 30-day volume, tiered down to 0.10% at AUD $6m+",
        sourceUrl:
          "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        feeCategory: FeeCategory.SPREAD,
        label: "Trading spread",
        calculationBasis: FeeCalculationBasis.VARIES,
        displayValue:
          "Variable by asset, liquidity and market conditions; separate from the trading fee",
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    features: [
      {
        featureType: OfferingFeatureType.AUD_DEPOSITS,
        available: true,
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.AUD_WITHDRAWALS,
        available: true,
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.BANK_TRANSFER,
        available: true,
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.CARD_DEPOSIT,
        available: true,
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.MOBILE_APP,
        available: true,
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.RECURRING_BUYS,
        label: "Auto Invest",
        available: true,
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.TWO_FACTOR_AUTH,
        available: true,
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.COLD_STORAGE,
        available: true,
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    prosCons: [
      {
        type: OfferingProsConsType.PRO,
        label:
          "Trading fees decrease from 0.60% to 0.10% as rolling 30-day volume increases",
        sourceUrl:
          "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.PRO,
        label: "Provider currently advertises more than 410 crypto assets",
        sourceUrl: "https://swyftx.com/au/features/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label:
          "Crypto trades incur a variable spread in addition to the trading fee",
        sourceUrl: "https://swyftx.com/facts/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label:
          "The 0.10% trading-fee tier requires at least AUD $6 million of rolling 30-day trading volume",
        sourceUrl:
          "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
  },
};
