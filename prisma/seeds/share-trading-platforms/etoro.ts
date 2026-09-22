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
import { ETORO_AU_PROVIDER_BASE } from "../providers/etoro";
import type { OfferingFeeSeed } from "../lib/types";

const CHECKED = new Date("2026-09-22");
const REVIEW_DUE = new Date("2026-11-06");
const FEES = "https://www.etoro.com/au/trading/fees/";
const MARKETS = "https://www.etoro.com/au/trading/markets/";
const STOCKS = "https://www.etoro.com/au/stocks/";
const AUD_ACCOUNT = "https://www.etoro.com/au/trading/currency-accounts/";

const fees: OfferingFeeSeed[] = [
  ...(["ASX", "NYSE", "NASDAQ"] as const).map(
    (marketCode): OfferingFeeSeed => ({
      feeCategory: FeeCategory.BROKERAGE,
      marketCode,
      label: "Stock commission",
      calculationBasis: FeeCalculationBasis.VARIES,
      displayValue:
        "US$1 or US$2 may apply when opening and closing a stock position",
      notes:
        "The official AU fee page says the amount depends on country of residence and exchange, but its dynamic country table was not sufficiently machine-verifiable for a reliable per-exchange Australian mapping. ETFs, CFDs and some other eToro products have different treatment. Do not calculate this row until the exact AU mapping is verified.",
      sourceUrl: FEES,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: CHECKED,
      reviewDueAt: REVIEW_DUE,
    })
  ),
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    marketCode: "ASX",
    label: "AUD account to Australian stocks",
    calculationBasis: FeeCalculationBasis.FREE,
    displayValue: "0% FX fee when funding Australian stocks in AUD",
    notes: "Eligibility criteria for the AUD account apply.",
    sourceUrl: AUD_ACCOUNT,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: CHECKED,
    reviewDueAt: REVIEW_DUE,
  },
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Other currency conversion scenarios",
    calculationBasis: FeeCalculationBasis.VARIES,
    displayValue:
      "Varies by conversion scenario, location, payment method and Club level",
    sourceUrl: FEES,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: CHECKED,
    reviewDueAt: REVIEW_DUE,
  },
];

export const EtoroShareTrading = {
  provider: ETORO_AU_PROVIDER_BASE,
  offering: {
    name: "eToro Share Trading",
    slug: "etoro",
    website: "https://www.etoro.com/au/stocks/",
    description:
      "eToro's Australian stock and ETF investing service. Non-leveraged long stock/ETF positions are provided through the eToro Service managed investment scheme; leveraged positions are CFDs and are outside this share-trading offering.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.VERIFIED,
    lastVerifiedAt: CHECKED,
    markets: [
      {
        marketCode: "ASX",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Australian stocks are available through eToro's Australian offering.",
        sourceUrl: AUD_ACCOUNT,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        marketCode: "NYSE",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "US stocks are available; individual security availability varies.",
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
      {
        marketCode: "NASDAQ",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "US stocks are available; individual security availability varies.",
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: AUD_ACCOUNT,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: STOCKS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: MARKETS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
    ],
    custody: [
      ...(["ASX", "NYSE", "NASDAQ"] as const).map((marketCode) => ({
        marketCode,
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "For Australian clients, non-leveraged long stock/ETF investing is provided through the eToro Service managed investment scheme. The scheme has legal ownership and the investor has beneficial ownership; eToro states shares are non-transferable and investors do not receive voting rights through this structure.",
        sourceUrl: MARKETS,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
        reviewDueAt: REVIEW_DUE,
      })),
    ],
    accountTypes: [
      {
        accountType: AccountType.INDIVIDUAL,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.etoro.com/au/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
    ],
    fees,
    features: [
      {
        featureType: OfferingFeatureType.MOBILE_APP,
        available: true,
        sourceUrl: "https://www.etoro.com/au/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        featureType: OfferingFeatureType.WEB_PLATFORM,
        available: true,
        sourceUrl: "https://www.etoro.com/au/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        featureType: OfferingFeatureType.RECURRING_BUYS,
        available: true,
        sourceUrl: FEES,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        featureType: OfferingFeatureType.COPY_TRADING,
        available: true,
        sourceUrl: "https://www.etoro.com/au/copytrader/",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
    ],
    prosCons: [
      {
        type: OfferingProsConsType.PRO,
        label:
          "AUD accounts can fund Australian stock investing without an FX conversion fee",
        sourceUrl: AUD_ACCOUNT,
        jurisdiction: "AU",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        type: OfferingProsConsType.PRO,
        label: "CopyTrader is available on the eToro platform",
        sourceUrl: "https://www.etoro.com/au/copytrader/",
        jurisdiction: "AU",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label: "Australian stock holdings are not CHESS-sponsored",
        detail:
          "Non-leveraged long stock/ETF investing is through a managed investment scheme; the investor has beneficial rather than legal ownership of the underlying shares.",
        sourceUrl: MARKETS,
        jurisdiction: "AU",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
      {
        type: OfferingProsConsType.LIMITATION,
        label: "Stock commission can vary by exchange and circumstance",
        sourceUrl: FEES,
        jurisdiction: "AU",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: CHECKED,
      },
    ],
  },
};
