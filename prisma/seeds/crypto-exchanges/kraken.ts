import {
  FeeCalculationBasis,
  FeeCategory,
  OfferingFeatureType,
  OfferingProsConsType,
  OfferingType,
  ProviderSourceType,
  VerificationStatus,
} from "@prisma/client";

export const Kraken = {
  provider: {
    name: "Kraken",
    slug: "kraken",
    website: "https://www.kraken.com",
    logo: "/images/providers/kraken.svg",
    description:
      "Global cryptocurrency platform with Australian operations through Bit Trade Pty Ltd, offering Kraken and Kraken Pro spot trading and AUD funding; other products are subject to eligibility.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
    facts: [
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
  },
  offering: {
    name: "Kraken Crypto Exchange",
    slug: "kraken-exchange",
    offeringType: OfferingType.CRYPTO_EXCHANGE,
    jurisdiction: "AU",
    assetSymbols: ["BTC", "ETH", "SOL", "XRP"],
    fees: [
      {
        feeCategory: FeeCategory.MAKER,
        label: "Kraken Pro standard spot maker fee",
        calculationBasis: FeeCalculationBasis.TIERED,
        percentage: 0.4,
        displayValue: "0.40% at Tier 1, tiered down to 0% from Tier 12",
        sourceUrl: "https://www.kraken.com/features/fee-schedule",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        feeCategory: FeeCategory.TAKER,
        label: "Kraken Pro standard spot taker fee",
        calculationBasis: FeeCalculationBasis.TIERED,
        percentage: 0.8,
        displayValue: "0.80% at Tier 1, tiered down to 0.05% at Pro 5",
        sourceUrl: "https://www.kraken.com/features/fee-schedule",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        feeCategory: FeeCategory.INSTANT_BUY,
        label: "Instant Buy/Sell trading fee",
        calculationBasis: FeeCalculationBasis.PERCENTAGE,
        percentage: 1.0,
        displayValue: "1% trading fee; payment fees may also apply",
        sourceUrl: "https://www.kraken.com/features/fee-schedule",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    features: [
      {
        featureType: OfferingFeatureType.AUD_DEPOSITS,
        available: true,
        sourceUrl:
          "https://support.kraken.com/au/articles/360045033231-how-do-i-deposit-aud-",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.PAYID,
        available: true,
        sourceUrl:
          "https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.BANK_TRANSFER,
        available: true,
        sourceUrl:
          "https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.MOBILE_APP,
        available: true,
        sourceUrl: "https://www.kraken.com",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.API_ACCESS,
        available: true,
        sourceUrl: "https://docs.kraken.com",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        featureType: OfferingFeatureType.STAKING,
        available: null,
        sourceUrl: "https://support.kraken.com/au",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    prosCons: [
      {
        type: OfferingProsConsType.PRO,
        label: "Supports AUD funding including PayID and bank transfer/Osko",
        sourceUrl:
          "https://support.kraken.com/articles/360045033651-aud-bank-transfers-with-osko-and-payid",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.PRO,
        label:
          "Kraken Pro standard spot fees decrease with qualifying spot volume or Assets on Platform",
        sourceUrl: "https://www.kraken.com/features/fee-schedule",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label:
          "Instant Buy/Sell uses a 1% trading fee and payment fees may also apply",
        sourceUrl: "https://www.kraken.com/features/fee-schedule",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
  },
};
