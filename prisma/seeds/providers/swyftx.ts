import {
  FeeValueType,
  ProviderFeatureType,
  ProviderFeeType,
  ProviderProsConsType,
  ProviderSourceType,
  ProviderType,
  VerificationStatus,
} from "@prisma/client";

export const Swyftx = {
  name: "Swyftx",
  slug: "swyftx",
  website: "https://swyftx.com",
  logo: "/images/providers/swyftx.svg",
  description:
    "Australian cryptocurrency platform supporting AUD deposits and withdrawals, 410+ crypto assets, recurring purchases and tiered trading fees based on rolling 30-day trading volume.",
  providerType: ProviderType.CRYPTO_EXCHANGE,
  jurisdictions: ["AU"],
  verificationStatus: VerificationStatus.VERIFIED,
  lastVerifiedAt: new Date("2026-09-11"),
  assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
  facts: [
    {
      label: "Headquarters / Market",
      value: "Australia",
      jurisdiction: "AU",
      sourceUrl: "https://swyftx.com/au/features/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      label: "AUD Support",
      value: "Yes",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.swyftx.com/en/articles/11741112-deposit-australian-dollars",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      label: "Platform Type",
      value: "Centralised cryptocurrency trading platform",
      jurisdiction: "AU",
      sourceUrl: "https://swyftx.com/au/features/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      label: "Advertised crypto assets",
      value: "410+",
      jurisdiction: "AU",
      sourceUrl: "https://swyftx.com/au/features/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  fees: [
    {
      feeType: ProviderFeeType.TRADING,
      label: "Standard trading fee",
      valueType: FeeValueType.TIERED,
      percentage: 0.6,
      displayValue:
        "0.6% standard; tiered down to 0.1% based on rolling 30-day trading volume",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.SPREAD,
      label: "Trading spread",
      valueType: FeeValueType.VARIABLE,
      displayValue:
        "Variable by asset and market conditions; charged separately from the trading fee",
      jurisdiction: "AU",
      sourceUrl: "https://swyftx.com/spreads/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.FIAT_DEPOSIT,
      label: "AUD bank transfer / PayID deposit fee",
      valueType: FeeValueType.FREE,
      displayValue: "Free",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.FIAT_WITHDRAWAL,
      label: "AUD withdrawal fee",
      valueType: FeeValueType.FREE,
      displayValue: "Free",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.FIAT_DEPOSIT,
      label: "AUD card deposit via Stripe",
      valueType: FeeValueType.PERCENTAGE,
      percentage: 1.875,
      displayValue:
        "1.875% charged by Stripe; Swyftx does not charge an additional card-deposit fee",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  features: [
    {
      featureType: ProviderFeatureType.AUD_DEPOSITS,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.swyftx.com/en/articles/11741112-deposit-australian-dollars",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.AUD_WITHDRAWALS,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.PAYID,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.swyftx.com/en/articles/11741112-deposit-australian-dollars",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.BANK_TRANSFER,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.swyftx.com/en/articles/11741112-deposit-australian-dollars",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.CARD_DEPOSIT,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.swyftx.com/en/articles/11741112-deposit-australian-dollars",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.MOBILE_APP,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://swyftx.com/au/features/",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.RECURRING_BUYS,
      label: "Auto Invest",
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://swyftx.com/au/features/",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.TWO_FACTOR_AUTH,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://swyftx.com/facts/",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.COLD_STORAGE,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://swyftx.com/facts/",
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  prosCons: [
    {
      type: ProviderProsConsType.PRO,
      label:
        "Free AUD deposits via PayID and bank transfer, with free AUD withdrawals",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Tiered trading fee can decrease from 0.6% to 0.1% as 30-day trading volume increases",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.PRO,
      label: "Offers more than 410 crypto assets",
      sourceUrl: "https://swyftx.com/au/features/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Crypto trades incur a variable spread in addition to the trading fee",
      sourceUrl: "https://swyftx.com/spreads/",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "The lowest 0.1% trading-fee tier requires at least $6 million AUD of rolling 30-day trading volume",
      sourceUrl:
        "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  sources: [
    {
      label: "Official website",
      url: "https://swyftx.com",
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
    },
    {
      label: "Official fees",
      url: "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
      sourceType: ProviderSourceType.OFFICIAL_FEES,
    },
    {
      label: "Official deposit and withdrawal fees",
      url: "https://support.swyftx.com/en/articles/12004727-fees-for-deposits-and-withdrawals",
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
      status: "Registered cryptocurrency exchange",
      sourceUrl: "https://swyftx.com/au/features/",
      verifiedAt: new Date("2026-09-11"),
    },
  ],
};
