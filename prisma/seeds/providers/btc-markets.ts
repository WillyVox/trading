import {
  FeeValueType,
  ProviderFeatureType,
  ProviderFeeType,
  ProviderProsConsType,
  ProviderSourceType,
  ProviderType,
  VerificationStatus,
} from "@prisma/client";

export const BtcMarkets = {
  name: "BTC Markets",
  slug: "btc-markets",
  website: "https://www.btcmarkets.net",
  description:
    "Australian cryptocurrency exchange offering AUD and USDT order-book markets, Simple Trade, AUD funding via PayID, bank transfer and card, mobile trading and API access.",
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
      sourceUrl: "https://www.btcmarkets.net",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      label: "AUD Support",
      value: "Yes",
      jurisdiction: "AU",
      sourceUrl:
        "https://support.btcmarkets.net/hc/en-us/articles/360026860233-How-to-deposit-AUD",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      label: "Platform Type",
      value: "Centralised cryptocurrency exchange",
      jurisdiction: "AU",
      sourceUrl: "https://www.btcmarkets.net",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      label: "Trading interfaces",
      value: "Exchange order book and Simple Trade",
      jurisdiction: "AU",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  fees: [
    {
      feeType: ProviderFeeType.TRADING,
      label: "AUD/USDT exchange trading fee",
      valueType: FeeValueType.TIERED,
      percentage: 0.85,
      displayValue:
        "0.85% at the lowest volume tier, decreasing to 0.10% above $5m rolling 30-day volume",
      jurisdiction: "AU",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.MAKER,
      label: "BTC-pair maker fee",
      valueType: FeeValueType.PERCENTAGE,
      percentage: -0.05,
      displayValue: "-0.05% maker rebate for supported BTC market pairs",
      jurisdiction: "AU",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.TAKER,
      label: "BTC-pair taker fee",
      valueType: FeeValueType.PERCENTAGE,
      percentage: 0.2,
      displayValue: "0.20% for supported BTC market pairs",
      jurisdiction: "AU",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.SPREAD,
      label: "Simple Trade spread",
      valueType: FeeValueType.VARIABLE,
      displayValue:
        "Variable spread included in quoted price; no additional Simple Trade trading fee",
      jurisdiction: "AU",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      feeType: ProviderFeeType.FIAT_DEPOSIT,
      label: "AUD PayID deposit fee",
      valueType: FeeValueType.FREE,
      displayValue: "Free",
      jurisdiction: "AU",
      sourceUrl:
        "https://www.btcmarkets.net/learn/get-started-with-btc-markets/how-to-fund-your-account/deposit-using-payid",
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
        "https://support.btcmarkets.net/hc/en-us/articles/360026860233-How-to-deposit-AUD",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.PAYID,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://www.btcmarkets.net/learn/get-started-with-btc-markets/how-to-fund-your-account/deposit-using-payid",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.BANK_TRANSFER,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.btcmarkets.net/hc/en-us/articles/19573488554777-Direct-deposits-using-BSB-and-account-number",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.CARD_DEPOSIT,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.btcmarkets.net/hc/en-us/articles/24952179952537-How-to-deposit-using-a-bank-card",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.MOBILE_APP,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.btcmarkets.net/products/mobile-app",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.API_ACCESS,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://docs.btcmarkets.net/",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.TWO_FACTOR_AUTH,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl:
        "https://support.btcmarkets.net/hc/en-us/articles/360001821168-Account-Security-on-BTC-Markets",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.COLD_STORAGE,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.btcmarkets.net/frequently-asked-questions",
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  prosCons: [
    {
      type: ProviderProsConsType.PRO,
      label:
        "Supports AUD funding through PayID, direct bank transfer and card deposits",
      sourceUrl:
        "https://support.btcmarkets.net/hc/en-us/articles/360026860233-How-to-deposit-AUD",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Offers both an exchange order book and a simpler fixed-quote Simple Trade interface",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Supports 2FA, off-site cold-wallet storage and full-reserve reconciliation",
      sourceUrl: "https://www.btcmarkets.net/frequently-asked-questions",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label: "Lowest-volume AUD/USDT exchange trading tier is 0.85%",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Simple Trade pricing includes a variable spread rather than using the exchange fee schedule",
      sourceUrl: "https://www.btcmarkets.net/fees",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date("2026-09-11"),
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
      label: "Official AUD deposit documentation",
      url: "https://support.btcmarkets.net/hc/en-us/articles/360026860233-How-to-deposit-AUD",
      sourceType: ProviderSourceType.OFFICIAL_SUPPORT,
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
        "Registered Digital Currency Exchange and subject to Australian AML/CTF requirements",
      sourceUrl: "https://www.btcmarkets.net/regulation",
      verifiedAt: new Date("2026-09-11"),
    },
  ],
  logo: "/images/providers/btc-markets.svg",
};
