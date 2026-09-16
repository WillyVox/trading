import {
  FeeValueType,
  ProviderFeatureType,
  ProviderFeeType,
  ProviderProsConsType,
  ProviderSourceType,
  ProviderType,
  VerificationStatus,
} from "@prisma/client";

export const IndependentReserve = {
  name: "Independent Reserve",
  slug: "independent-reserve",
  website: "https://www.independentreserve.com",
  logo: "/images/providers/independent-reserve.svg",
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
      value:
        "IG Group (FTSE 250) acquired a 70% stake in January 2026; founding team retained 30%",
      jurisdiction: "AU",
      sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      label: "Listed cryptocurrencies",
      value:
        "Approximately 35\u201341 (narrower, blue-chip-focused selection; exact count varies over time)",
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
      displayValue:
        "Typically free for standard AUD bank transfer; varies by method",
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
      displayValue:
        "Fixed fee per asset (e.g. approx. 0.0003 BTC for Bitcoin); varies by asset",
      jurisdiction: "AU",
      sourceUrl: "https://tradingbrokers.com/independent-reserve-review/",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
  ],
  features: [
    {
      featureType: ProviderFeatureType.AUD_DEPOSITS,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl: "https://tradingbrokers.com/independent-reserve-review/",
    },
    {
      featureType: ProviderFeatureType.BANK_TRANSFER,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl: "https://tradingbrokers.com/independent-reserve-review/",
    },
    {
      featureType: ProviderFeatureType.API_ACCESS,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.independentreserve.com/help/faq",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.SMSF_SUPPORT,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
    },
    {
      featureType: ProviderFeatureType.COLD_STORAGE,
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      sourceUrl: "https://www.independentreserve.com/help/faq",
      verifiedAt: new Date("2026-09-11"),
    },
    {
      featureType: ProviderFeatureType.TWO_FACTOR_AUTH,
      available: true,
      verificationStatus: VerificationStatus.UNVERIFIED,
      sourceUrl: "https://cryptohead.io/independent-reserve-review/",
    },
  ],
  prosCons: [
    {
      type: ProviderProsConsType.PRO,
      label:
        "Tiered maker/taker fees fall as low as 0.02% for high-volume traders",
      sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Majority of customer crypto reported held in cold storage, with optional insurance on Premium accounts",
      sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      type: ProviderProsConsType.PRO,
      label:
        "Operating since 2013 with no publicly reported major security incident",
      sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Narrower coin selection (roughly 35\u201341 assets) than AU brokerage-style competitors",
      sourceUrl: "https://comparecrypto.com.au/independent-reserve.html",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
    {
      type: ProviderProsConsType.LIMITATION,
      label:
        "Standard 0.50% taker fee is higher than CoinSpot's 0.1% Markets rate for a typical retail-size trade",
      sourceUrl: "https://cryptoreview.com.au/reviews/independent-reserve.html",
      verificationStatus: VerificationStatus.UNVERIFIED,
    },
  ],
  sources: [
    {
      label: "Official website",
      url: "https://www.independentreserve.com",
      sourceType: ProviderSourceType.OFFICIAL_WEBSITE,
    },
    {
      label: "Official FAQ",
      url: "https://www.independentreserve.com/help/faq",
      sourceType: ProviderSourceType.OFFICIAL_SUPPORT,
    },
  ],
  regulations: [
    {
      jurisdiction: "AU",
      regulator: "AUSTRAC",
      status:
        "Registered Digital Currency Exchange; one of the first two AU exchanges to confirm AUSTRAC enrolment in 2018",
      sourceUrl:
        "https://www.gtlaw.com.au/knowledge/austrac-releases-amlctf-guide-digital-currency-exchange-providers",
    },
    {
      jurisdiction: "AU",
      regulator: "ASIC",
      status:
        "Not AFSL-licensed as of the last check; has received legal advice that an AFSL is not currently required and states it continues to monitor this position",
      sourceUrl:
        "https://www.forbes.com/advisor/au/investing/cryptocurrency/independent-reserve-review/",
    },
  ],
};
