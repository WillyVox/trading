import {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  FeeCalculationBasis,
  FeeCategory,
  FeeTradeSide,
  InvestmentProductType,
  OfferingType,
  VerificationStatus,
} from "@prisma/client";
import type { OfferingFeeSeed } from "../lib/types";

/**
 * Market/product/custody claims checked 17 Sep 2026 against CMC Invest's own
 * stockbroking pages. The international-custody row is UNVERIFIED: it's
 * reported in third-party reviews, not stated directly on CMC's own pages in
 * what was checked -- confirm against CMC's PDS/FSG before upgrading it.
 *
 * Fees added in Phase 2 and checked 19 Sep 2026 against CMC's Australian
 * pricing page (cmcmarkets.com/en-au/stockbroking/pricing) and overview page.
 * The full research manifest is docs/research/offerings/cmc-invest.md.
 *
 * NEVER source fee data from cmcinvest.com (the UK entity: Core/Enhanced/
 * Premium plans, Cash ISA, SIPP). It is a different company and product set;
 * every sourceUrl below must be on cmcmarkets.com/en-au/.
 */
const PRICING_URL = "https://www.cmcmarkets.com/en-au/stockbroking/pricing";
const FEES_CHECKED = new Date("2026-09-19");

const fees: OfferingFeeSeed[] = [
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Standard: first eligible buy under $1,000",
    calculationBasis: FeeCalculationBasis.FREE,
    displayValue: "$0 (first eligible buy under $1,000, per security, per day)",
    pricingPlan: "Standard",
    tradeSide: FeeTradeSide.BUY,
    firstBuyPerSecurityPerDay: true,
    maxTradeAmount: 1000,
    maxTradeAmountInclusive: false,
    excludesMarginLoanSettlement: true,
    currency: "AUD",
    notes:
      "Applies once per security, per day to an eligible buy under A$1,000. Margin-loan-settled trades are excluded.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Standard: buy fallback when the free-buy conditions are not met",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 11,
    percentage: 0.1,
    currency: "AUD",
    pricingPlan: "Standard",
    tradeSide: FeeTradeSide.BUY,
    notes:
      "Standard fallback for a buy that does not satisfy the published first-buy concession, including a margin-loan-settled trade.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Standard: other buys",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 11,
    percentage: 0.1,
    currency: "AUD",
    pricingPlan: "Standard",
    tradeSide: FeeTradeSide.BUY,
    firstBuyPerSecurityPerDay: false,
    notes:
      "For Standard pricing, other online buy orders are the greater of A$11 or 0.10% of trade value.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Standard: buy at or above $1,000",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 11,
    percentage: 0.1,
    currency: "AUD",
    pricingPlan: "Standard",
    tradeSide: FeeTradeSide.BUY,
    minTradeAmount: 1000,
    notes:
      "The first-buy concession applies only below A$1,000; this Standard rule applies at A$1,000 and above.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Standard: sell order",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 11,
    percentage: 0.1,
    currency: "AUD",
    pricingPlan: "Standard",
    tradeSide: FeeTradeSide.SELL,
    notes:
      "Standard online sell orders are the greater of A$11 or 0.10% of trade value.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  },
  ...(["NYSE", "NASDAQ"] as const).map((marketCode): OfferingFeeSeed => ({
    feeCategory: FeeCategory.BROKERAGE,
    marketCode,
    label: "International shares brokerage",
    calculationBasis: FeeCalculationBasis.FREE,
    currency: "USD",
    pricingPlan: "Standard",
    notes:
      "CMC Invest publishes $0 brokerage for US shares and ETFs. FX spreads and other applicable costs are separate.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  })),
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Foreign exchange conversion",
    calculationBasis: FeeCalculationBasis.VARIES,
    displayValue: "FX spread applies (no fixed % published)",
    notes:
      "CMC Invest states that FX spreads apply to international orders; this is not treated as zero by Trading Guide.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: new Date("2026-09-22"),
  },
];

export const CmcInvest = {
  provider: {
    name: "CMC Markets",
    slug: "cmc-markets",
    website: "https://www.cmcmarkets.com/en-au",
    description:
      "ASX-listed financial services group operating the CMC Invest share trading platform and a separate CFD/forex trading business in Australia.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
  },
  offering: {
    name: "CMC Invest",
    slug: "cmc-invest",
    website: "https://www.cmcmarkets.com/en-au/stockbroking",
    description:
      "CMC Markets' CHESS-sponsored share investing platform for Australian and international shares and ETFs, separate from CMC's CFD/forex business.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
    markets: [
      {
        marketCode: "ASX",
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        marketCode: "NYSE",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "CMC Invest advertises access to the ASX plus 15 international markets, including the US; exact per-exchange coverage (NYSE vs. Nasdaq) not yet confirmed against an official breakdown.",
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "CMC Invest advertises access to the ASX plus 15 international markets, including the US; exact per-exchange coverage (NYSE vs. Nasdaq) not yet confirmed against an official breakdown.",
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking/products/asx",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
    ],
    custody: [
      {
        marketCode: "ASX",
        custodyType: CustodyType.CHESS_SPONSORED,
        hinSupported: true,
        sourceUrl: "https://www.cmcmarkets.com/en-au/stockbroking",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        marketCode: "NYSE",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Reported as custodial in third-party reviews of CMC Invest; not yet confirmed against CMC's own PDS/FSG.",
        sourceUrl:
          "https://invezz.com/au/reviews/cmc-markets-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Reported as custodial in third-party reviews of CMC Invest; not yet confirmed against CMC's own PDS/FSG.",
        sourceUrl:
          "https://invezz.com/au/reviews/cmc-markets-review-australia/",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    accountTypes: [
      {
        accountType: AccountType.SMSF,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Reported as available in third-party comparisons; confirm against CMC Invest's own account-opening documentation before publishing.",
        sourceUrl:
          "https://www.investmatch.com.au/compare/cmc-invest-vs-sharesies",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees,
  },
};
