import {
  FeeValueType,
  ProviderFeatureType,
  ProviderFeeType,
  ProviderProsConsType,
  ProviderSourceType,
  ProviderType,
  VerificationStatus,
} from "@prisma/client";

export const Kraken = {
  name: "Kraken",
  slug: "kraken",
  website: "https://www.kraken.com",
  logo: "/images/providers/kraken.svg",
  description:
    "Global cryptocurrency platform with Australian operations through Bit Trade Pty Ltd, offering Kraken and Kraken Pro spot trading and AUD funding; other products are subject to eligibility.",
  providerType: ProviderType.CRYPTO_EXCHANGE,
  jurisdictions: ["AU"],
  verificationStatus: VerificationStatus.VERIFIED,
  lastVerifiedAt: new Date("2026-09-17"),
  assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
  facts: [
    {
      label: "AUD Support",
      value: "Yes",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      label: "Platform Type",
      value: "Centralised cryptocurrency platform / exchange",
      jurisdiction: "AU",
      sourceUrl: "https://www.kraken.com",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      label: "Australian operating entity",
      value: "Bit Trade Pty Ltd (ACN 163 237 634)",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      label: "Founded",
      value: "2011",
      sourceUrl:
        "https://support.kraken.com/au/articles/360046261932-australia-faq",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
  ],
  fees: [
    {
      feeType: ProviderFeeType.MAKER,
      label: "Kraken Pro standard spot maker fee",
      valueType: FeeValueType.TIERED,
      percentage: 0.4,
      displayValue: "0.40% at Tier 1, tiered down to 0% from Tier 12",
      jurisdiction: "AU",
      sourceUrl: "https://www.kraken.com/features/fee-schedule",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      feeType: ProviderFeeType.TAKER,
      label: "Kraken Pro standard spot taker fee",
      valueType: FeeValueType.TIERED,
      percentage: 0.8,
      displayValue: "0.80% at Tier 1, tiered down to 0.05% at Pro 5",
      jurisdiction: "AU",
      sourceUrl: "https://www.kraken.com/features/fee-schedule",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      feeType: ProviderFeeType.INSTANT_BUY,
      label: "Instant Buy/Sell trading fee",
      valueType: FeeValueType.PERCENTAGE,
      percentage: 1.0,
      displayValue: "1% trading fee; payment fees may also apply",
      jurisdiction: "AU",
      sourceUrl: "https://www.kraken.com/features/fee-schedule",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
  ],
  features: [
    {
      featureType: ProviderFeatureType.AUD_DEPOSITS,
      available: true,
      sourceUrl:
        "https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      featureType: ProviderFeatureType.PAYID,
      available: true,
      sourceUrl:
        "https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      featureType: ProviderFeatureType.BANK_TRANSFER,
      available: true,
      sourceUrl:
        "https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      featureType: ProviderFeatureType.MOBILE_APP,
      available: true,
      sourceUrl: "https://www.kraken.com",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      featureType: ProviderFeatureType.API_ACCESS,
      available: true,
      sourceUrl: "https://docs.kraken.com",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      featureType: ProviderFeatureType.STAKING,
      available: null,
      sourceUrl: "https://support.kraken.com/au",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
  ],
  prosCons: [
    {
      type: ProviderProsConsType.PRO,
      label: "Supports AUD funding including PayID and bank transfer/Osko",
      sourceUrl:
        "https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Kraken Pro standard spot fees decrease with qualifying spot volume or Assets on Platform",
      sourceUrl: "https://www.kraken.com/features/fee-schedule",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Instant Buy/Sell uses a 1% trading fee and payment fees may also apply",
      sourceUrl: "https://www.kraken.com/features/fee-schedule",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-17"),
    },
  ],
  sources: [
    {
      label: "Official website",
      url: "https://www.kraken.com",
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
    },
    {
      label: "Official fees",
      url: "https://www.kraken.com/features/fee-schedule",
      sourceType: ProviderSourceType.OFFICIAL_FEES,
    },
    {
      label: "Australian licensing and regulation",
      url: "https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated",
      sourceType: ProviderSourceType.OFFICIAL_SUPPORT,
    },
  ],
  regulations: [
    {
      jurisdiction: "AU",
      regulator: "AUSTRAC",
      status:
        "Bit Trade Pty Ltd (ACN 163 237 634) is registered as a Digital Currency Exchange and Independent Remittance Dealer",
      sourceUrl:
        "https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated",
      verifiedAt: new Date("2026-09-17"),
    },
    {
      jurisdiction: "AU",
      regulator: "ASIC",
      status:
        "Kraken Derivatives are offered to eligible Australian wholesale clients through Beaufort Fiduciaries Pty Ltd (ACN 162 139 871), AFSL 545124",
      sourceUrl:
        "https://support.kraken.com/au/articles/where-is-kraken-licensed-or-regulated",
      verifiedAt: new Date("2026-09-17"),
    },
  ],
};
