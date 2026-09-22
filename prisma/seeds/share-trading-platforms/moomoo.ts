import {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  FeeCalculationBasis,
  FeeCategory,
  InvestmentProductType,
  OfferingFeatureType,
  OfferingProsConsType,
  OfferingType,
  VerificationStatus,
} from "@prisma/client";
import type { OfferingFeeSeed } from "../lib/types";

const CHECKED = new Date("2026-09-22");
const REVIEW_DUE = new Date("2026-11-06");
const PRICING = "https://www.moomoo.com/au/pricing";
const STOCKS = "https://www.moomoo.com/au/invest/stocks";
const CHESS = "https://www.moomoo.com/au/support/topic6_506";
const RECURRING = "https://www.moomoo.com/au/feature/recurring-investment";

const fees: OfferingFeeSeed[] = [
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Australian shares and ETFs brokerage",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 3,
    percentage: 0.03,
    currency: "AUD",
    displayValue: "A$3 or 0.03% of transaction value, whichever is greater",
    notes: "GST inclusive. Promotional brokerage offers are not modelled.",
    sourceUrl: PRICING,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: CHECKED,
    reviewDueAt: REVIEW_DUE,
  },
  ...(["NYSE", "NASDAQ"] as const).map((marketCode): OfferingFeeSeed => ({
    feeCategory: FeeCategory.BROKERAGE,
    marketCode,
    label: "US shares and ETFs standard order fee",
    calculationBasis: FeeCalculationBasis.FLAT,
    flatAmount: 0.99,
    currency: "USD",
    displayValue: "US$0.99 per standard order",
    notes:
      "Excludes FX, pass-through and other service fees. Fractional/recurring orders below one share can use a different capped percentage schedule and are deliberately not represented by this standard-order row.",
    sourceUrl: PRICING,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: CHECKED,
    reviewDueAt: REVIEW_DUE,
  })),
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Currency conversion",
    calculationBasis: FeeCalculationBasis.VARIES,
    displayValue: "Exchange rate shown before confirmation",
    notes:
      "Moomoo confirms currency conversion is available and displays the exchange rate before submission. A current fixed AUD/USD percentage was not sufficiently verified from the official AU sources reviewed, so Trading Guide does not infer one.",
    sourceUrl: "https://www.moomoo.com/au/learn/how-to-exchange-currency-on-moomoo",
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: CHECKED,
    reviewDueAt: REVIEW_DUE,
  },
];

export const Moomoo = {
  provider: {
    name: "Moomoo Securities Australia Ltd",
    slug: "moomoo-securities-australia",
    website: "https://www.moomoo.com/au",
    description:
      "Australian share-trading provider offering CHESS-sponsored Australian shares plus US and Hong Kong market access.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: CHECKED,
  },
  offering: {
    name: "moomoo",
    slug: "moomoo",
    website: "https://www.moomoo.com/au",
    description:
      "Moomoo's Australian share-trading platform with CHESS-sponsored ASX holdings by default for new accounts and access to US and Hong Kong stocks and ETFs.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: CHECKED,
    markets: [
      {
        marketCode: "ASX",
        availability: AvailabilityStatus.AVAILABLE,
        notes: "CHESS-sponsored Australian shares are supported.",
        sourceUrl: CHESS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        marketCode: "NYSE",
        availability: AvailabilityStatus.AVAILABLE,
        notes: "US shares and ETFs are supported; exact security availability varies.",
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        marketCode: "NASDAQ",
        availability: AvailabilityStatus.AVAILABLE,
        notes: "US shares and ETFs are supported; exact security availability varies.",
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        marketCode: "HKEX",
        availability: AvailabilityStatus.AVAILABLE,
        notes: "Hong Kong shares and ETFs are supported.",
        sourceUrl: PRICING,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        notes: "US and Hong Kong shares are advertised by Moomoo Australia.",
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        productType: InvestmentProductType.OPTIONS,
        availability: AvailabilityStatus.AVAILABLE,
        notes: "US options are supported; options fee schedules are not modelled in this share-brokerage seed.",
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
    ],
    custody: [
      {
        marketCode: "ASX",
        custodyType: CustodyType.CHESS_SPONSORED,
        hinSupported: true,
        custodianName: "FinClear Execution Limited",
        description:
          "New Moomoo AU clients are set up with a CHESS-sponsored account by default; ASX holdings are registered under the investor's name. A custodial account can be requested separately.",
        sourceUrl: CHESS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      ...(["NYSE", "NASDAQ"] as const).map((marketCode) => ({
        marketCode,
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        custodianName: "Futu Clearing Inc.",
        description: "US equities use an international custodial arrangement; CHESS/HIN does not apply.",
        sourceUrl: "https://www.moomoo.com/au/learn/is-stake-chess-sponsored",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      })),
      {
        marketCode: "HKEX",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description: "Hong Kong holdings use a custodial arrangement; CHESS/HIN does not apply.",
        sourceUrl: "https://www.moomoo.com/au/learn/is-stake-chess-sponsored",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
    ],
    accountTypes: [
      {
        accountType: AccountType.INDIVIDUAL,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.moomoo.com/au/support/categories/1549",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        accountType: AccountType.COMPANY,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.moomoo.com/au/support/categories/1549",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        accountType: AccountType.TRUST,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.moomoo.com/au/support/categories/1549",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        accountType: AccountType.SMSF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.moomoo.com/au/support/categories/1549",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
    ],
    fees,
    features: [
      { featureType: OfferingFeatureType.MOBILE_APP, available: true, sourceUrl: STOCKS, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.WEB_PLATFORM, available: true, sourceUrl: STOCKS, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.RECURRING_BUYS, available: true, sourceUrl: RECURRING, verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { featureType: OfferingFeatureType.ADVANCED_CHARTING, available: true, sourceUrl: "https://www.moomoo.com/au", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
    ],
    prosCons: [
      { type: OfferingProsConsType.PRO, label: "CHESS-sponsored ASX holdings are the default for new Australian accounts", sourceUrl: CHESS, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.PRO, label: "Australian, US and Hong Kong share-market access is available", sourceUrl: STOCKS, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.LIMITATION, label: "US$0.99 standard US order pricing excludes FX and pass-through/service fees", sourceUrl: PRICING, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
      { type: OfferingProsConsType.LIMITATION, label: "Fractional and recurring US orders can use a different capped percentage fee schedule", sourceUrl: RECURRING, jurisdiction: "AU", verificationStatus: VerificationStatus.VERIFIED, verifiedAt: CHECKED },
    ],
  },
};
