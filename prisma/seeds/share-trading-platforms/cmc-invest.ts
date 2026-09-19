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
    label: "Australian shares brokerage: first buy per security, per day",
    calculationBasis: FeeCalculationBasis.FREE,
    displayValue: "$0 (first buy up to $1,000, per security, per day)",
    notes:
      'Applies once per security, per day, and excludes trades settled through a margin loan. CMC\'s own pages word the cap as both "under $1,000" and "up to $1,000". ALPHA accounts get the same $0 first buy.',
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Australian shares brokerage: all other buys and all sells",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 11,
    percentage: 0.1,
    currency: "AUD",
    notes:
      "Whichever amount is greater; online orders, GST-inclusive. ALPHA accounts pay the greater of $9.90 or 0.075%. Marked unverified because another CMC page quotes 0.11% instead of 0.10% \u2014 to be confirmed against CMC's Financial Services Guide.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.UNVERIFIED,
  },
  // $0 brokerage on US/UK/Canada/Japan. Only NYSE/NASDAQ exist in Market
  // today, so only those are seeded.
  ...(["NYSE", "NASDAQ"] as const).map((marketCode): OfferingFeeSeed => ({
    feeCategory: FeeCategory.BROKERAGE,
    marketCode,
    label: "US shares brokerage",
    calculationBasis: FeeCalculationBasis.FREE,
    notes:
      "CMC Invest also lists $0 brokerage on UK, Canadian and Japanese stocks and ETFs. FX spreads apply to all international orders.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  })),
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Foreign exchange conversion",
    calculationBasis: FeeCalculationBasis.VARIES,
    displayValue: "FX spread applies (no fixed % published)",
    notes:
      "CMC Invest states that FX spreads apply to all international orders. A fixed conversion percentage isn't published on its Australian pricing page \u2014 check the current Financial Services Guide.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
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
