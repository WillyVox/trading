import {
  FeeValueType,
  ProviderFeatureType,
  ProviderFeeType,
  ProviderProsConsType,
  ProviderSourceType,
  ProviderType,
  VerificationStatus,
} from "@prisma/client";

export const CoinSpot = {
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
      sourceUrl:
        "https://www.cryptonewsz.com/cryptocurrency-exchange/coinspot-review/",
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
      sourceUrl:
        "https://coinspot.zendesk.com/hc/en-us/articles/360001426235-Pricing-FAQ",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      feeType: ProviderFeeType.WITHDRAWAL,
      label: "Crypto withdrawal fee",
      valueType: FeeValueType.FREE,
      displayValue: "No CoinSpot fee; standard blockchain network fee applies",
      jurisdiction: "AU",
      sourceUrl:
        "https://www.hollaex.com/blog/coinspot-review-features-deposit-methods-fees-assessed",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
  ],
  features: [
    {
      featureType: ProviderFeatureType.AUD_DEPOSITS,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.coinspot.com.au/fees",
    },
    {
      featureType: ProviderFeatureType.AUD_WITHDRAWALS,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.coinspot.com.au/fees",
    },
    {
      featureType: ProviderFeatureType.PAYID,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl:
        "https://www.marketplacefairness.org/au/cryptocurrency/coinspot-review/",
    },
    {
      featureType: ProviderFeatureType.BANK_TRANSFER,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl:
        "https://www.marketplacefairness.org/au/cryptocurrency/coinspot-review/",
    },
    {
      featureType: ProviderFeatureType.MOBILE_APP,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl:
        "https://www.hollaex.com/blog/coinspot-review-features-deposit-methods-fees-assessed",
    },
    {
      featureType: ProviderFeatureType.RECURRING_BUYS,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl: "https://www.datawallet.com/crypto/coinspot-review",
    },
    {
      featureType: ProviderFeatureType.ADVANCED_CHARTING,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl:
        "https://www.hollaex.com/blog/coinspot-review-features-deposit-methods-fees-assessed",
    },
    {
      featureType: ProviderFeatureType.OTC_DESK,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.coinspot.com.au/fees",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.SMSF_SUPPORT,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl: "https://coindaily.com.au/exchanges/coinspot/",
    },
    { featureType: ProviderFeatureType.STAKING, available: null },
    {
      featureType: ProviderFeatureType.COLD_STORAGE,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl:
        "https://www.marketplacefairness.org/au/cryptocurrency/coinspot-review/",
    },
    {
      featureType: ProviderFeatureType.TWO_FACTOR_AUTH,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl:
        "https://www.cryptonewsz.com/cryptocurrency-exchange/coinspot-review/",
    },
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
      label:
        "AUSTRAC-registered since 2018 and holds an ASIC AFSL with a non-cash payments authorisation",
      detail:
        "AFSL held as of 29 April 2026, per CoinSpot's own regulatory disclosure.",
      sourceUrl:
        "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Free AUD deposits and withdrawals via PayID, POLi and bank transfer",
      sourceUrl: "https://www.coinspot.com.au/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Default Instant Buy/Sell/Swap costs a flat 1% plus spread \u2014 ten times the 0.1% Markets order-book rate",
      sourceUrl: "https://www.coinspot.com.au/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Markets order book has thin liquidity outside major coins, so many listed pairs don't fill cheaply at size",
      sourceUrl: "https://coindaily.com.au/exchanges/coinspot/",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
  ],
  sources: [
    {
      label: "Official website",
      url: "https://www.coinspot.com.au",
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
    },
    {
      label: "Official fees",
      url: "https://www.coinspot.com.au/fees",
      sourceType: ProviderSourceType.OFFICIAL_FEES,
    },
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
      sourceUrl:
        "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      jurisdiction: "AU",
      regulator: "ASIC",
      status:
        "Holds an Australian Financial Services Licence (AFSL) with a non-cash payments authorisation, as of 29 April 2026",
      sourceUrl:
        "https://coinspot.zendesk.com/hc/en-us/articles/360000148136-Who-is-AUSTRAC-and-is-CoinSpot-registered",
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  logo: "/images/providers/coinspot.svg",
};
