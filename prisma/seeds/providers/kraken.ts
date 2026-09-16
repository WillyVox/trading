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
    "Global cryptocurrency exchange offering trading and custody, with an Australian-facing onramp.",
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
  ],
  regulations: [],
};
