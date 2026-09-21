import {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  FeeCalculationBasis,
  FeeCategory,
  InvestmentProductType,
  OfferingType,
  VerificationStatus,
} from "@prisma/client";
import type { OfferingFeeSeed } from "../lib/types";

/**
 * Market/product/custody claims checked 19 Sep 2026 against IBKR's own
 * interactivebrokers.com.au pages. Fees checked the same day against the
 * GlobalTrader pricing summary and commissions-home comparison page. The
 * full research manifest -- including two documented schema seams
 * (OfferingPricingPlan for Fixed/Tiered/GlobalTrader, and per-share US
 * pricing not fitting FLAT/PERCENTAGE/GREATER_OF) -- is
 * prisma/seeds/offerings/interactive-brokers.md.
 *
 * This seed models IBKR Pro's FIXED plan only -- the plan most retail
 * comparisons assume -- not Tiered or GlobalTrader. NEVER source fee data
 * from a non-.com.au IBKR regional site (interactivebrokers.com, .co.uk,
 * etc. are separate entities/pricing).
 */
const COMMISSIONS_URL =
  "https://www.interactivebrokers.com.au/en/index.php?f=49808";
const GLOBALTRADER_URL =
  "https://www.interactivebrokers.com.au/en/trading/globaltrader/pricing.php";
const FEES_CHECKED = new Date("2026-09-22");

const fees: OfferingFeeSeed[] = [
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Australian shares brokerage (Fixed plan)",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 6,
    percentage: 0.08,
    currency: "AUD",
    pricingPlan: "Fixed",
    gstPercent: 10,
    notes:
      "IBKR publishes Fixed Australian stock commissions at 0.08% of trade value with a A$6 minimum per order, exclusive of GST. The calculator adds 10% GST. IBKR Tiered pricing and third-party fees are not included in this Fixed-plan estimate.",
    sourceUrl: COMMISSIONS_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
    reviewDueAt: new Date("2026-11-06"),
  },
  // US shares: priced per share (US$0.005/share, min US$1, max 1% of trade
  // value), which doesn't fit FLAT/PERCENTAGE/GREATER_OF (all value-based
  // in the current schema) -- seeded as VARIES rather than forced into a
  // shape that would misrepresent it. See the research manifest.
  ...(["NYSE", "NASDAQ"] as const).map((marketCode): OfferingFeeSeed => ({
    feeCategory: FeeCategory.BROKERAGE,
    marketCode,
    label: "US shares brokerage (IBKR Pro, Fixed plan)",
    calculationBasis: FeeCalculationBasis.VARIES,
    displayValue: "US$0.005/share (min US$1, max 1% of trade value)",
    currency: "USD",
    notes:
      "Priced per share, not per trade value -- doesn't fit this schema's value-based fee shapes. Tiered plan pricing (from US$0.0035/share for the lowest volume tier) not modelled.",
    sourceUrl: GLOBALTRADER_URL,
    verificationStatus: VerificationStatus.UNVERIFIED,
  })),
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Automated currency conversion",
    calculationBasis: FeeCalculationBasis.PERCENTAGE,
    percentage: 0.03,
    notes:
      "IBKR's automated currency conversion service rate, applied when a trade requires converting AUD to buy a foreign-currency security. A lower client-initiated standalone conversion rate of 0.002% (minimum US$2.00) is available if you convert currency manually ahead of time instead.",
    sourceUrl: COMMISSIONS_URL,
    verificationStatus: VerificationStatus.UNVERIFIED,
  },
];

export const InteractiveBrokers = {
  provider: {
    name: "Interactive Brokers Australia Pty. Ltd.",
    slug: "interactive-brokers-australia",
    website: "https://www.interactivebrokers.com.au",
    description:
      "Australian subsidiary of global broker Interactive Brokers, ASIC-regulated (AFSL 453554) and a participant of ASX, ASX 24 and Cboe Australia, offering share, ETF, options, futures and forex trading across 90+ international markets.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-19"),
  },
  offering: {
    name: "Interactive Brokers Australia",
    slug: "interactive-brokers-australia",
    website: "https://www.interactivebrokers.com.au",
    description:
      "IBKR Pro's Fixed-rate share trading plan for Australian investors: low per-trade commissions on ASX and US shares, a custodial (non-CHESS) holding model, and access to global markets beyond the ASX and US.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-19"),
    markets: [
      {
        marketCode: "ASX",
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: GLOBALTRADER_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        marketCode: "NYSE",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "IBKR advertises 90+ markets worldwide; exact per-exchange coverage for NYSE vs. Nasdaq not confirmed against an official breakdown in this pass.",
        sourceUrl: GLOBALTRADER_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "IBKR advertises 90+ markets worldwide; exact per-exchange coverage for NYSE vs. Nasdaq not confirmed against an official breakdown in this pass.",
        sourceUrl: GLOBALTRADER_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: GLOBALTRADER_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: GLOBALTRADER_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: GLOBALTRADER_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        productType: InvestmentProductType.OPTIONS,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Out of scope for this offering's seeded fees (share trading only).",
        sourceUrl: COMMISSIONS_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        productType: InvestmentProductType.FUTURES,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Out of scope for this offering's seeded fees (share trading only).",
        sourceUrl: COMMISSIONS_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        productType: InvestmentProductType.FOREX,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Out of scope for this offering's seeded fees (share trading only).",
        sourceUrl: COMMISSIONS_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        productType: InvestmentProductType.CFD,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Out of scope for this offering's seeded fees (share trading only).",
        sourceUrl: COMMISSIONS_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    custody: [
      {
        marketCode: "ASX",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "ASX holdings are held via a nominee/custodial model, not CHESS-sponsored; the client remains beneficial owner but does not hold a HIN directly. Reported consistently in third-party reviews; not yet confirmed against IBKR AU's own PDS/FSG.",
        sourceUrl:
          "https://psyfimoney.com/au/reviews/interactive-brokers-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NYSE",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description: "Standard US brokerage (street-name) custodial holding.",
        sourceUrl:
          "https://psyfimoney.com/au/reviews/interactive-brokers-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description: "Standard US brokerage (street-name) custodial holding.",
        sourceUrl:
          "https://psyfimoney.com/au/reviews/interactive-brokers-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    accountTypes: [
      {
        accountType: AccountType.SMSF,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Reported as supported in third-party reviews; confirm against IBKR AU's own account-opening documentation before publishing.",
        sourceUrl:
          "https://psyfimoney.com/au/reviews/interactive-brokers-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        accountType: AccountType.TRUST,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Reported as supported in third-party reviews; confirm against IBKR AU's own account-opening documentation before publishing.",
        sourceUrl:
          "https://psyfimoney.com/au/reviews/interactive-brokers-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees,
  },
};
