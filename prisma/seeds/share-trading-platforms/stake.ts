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
 * Market/product/custody claims checked 19 Sep 2026 against Stake's own
 * hellostake.com/au pages. Fees checked the same day against the official
 * AU pricing page (hellostake.com/au/pricing) and Stake's own brokerage-fees
 * explainer. The full research manifest -- including what is deliberately
 * NOT seeded (outgoing transfer fees, Stake Super, Stake Black) -- is
 * prisma/seeds/offerings/stake.md.
 *
 * NEVER source AU fee data from hellostake.com/nz (a related but separate
 * NZ-facing product/entity). Every sourceUrl below is on hellostake.com/au.
 */
const PRICING_URL = "https://hellostake.com/au/pricing";
const BROKERAGE_EXPLAINER_URL =
  "https://hellostake.com/au/blog/stake-academy/brokerage-fees";
const FEES_CHECKED = new Date("2026-09-19");

const fees: OfferingFeeSeed[] = [
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    label: "Australian shares brokerage",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 3,
    percentage: 0.01,
    currency: "AUD",
    notes:
      "Effectively a flat A$3 per trade up to A$30,000, then 0.01% of trade value above that. CHESS-sponsored, settled to your own HIN.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
  // US shares brokerage. Only NYSE/NASDAQ exist in Market today; Stake also
  // advertises OTC securities and government bonds on Wall St, not seeded.
  ...(["NYSE", "NASDAQ"] as const).map((marketCode): OfferingFeeSeed => ({
    feeCategory: FeeCategory.BROKERAGE,
    marketCode,
    label: "US shares brokerage (Wall St)",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 3,
    percentage: 0.01,
    currency: "USD",
    notes:
      "Effectively a flat US$3 per trade up to US$30,000, then 0.01% of trade value above that. Custodial model, not CHESS-sponsored. Fractional shares available from US$10.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  })),
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Foreign exchange conversion (AUD to USD funding)",
    calculationBasis: FeeCalculationBasis.PERCENTAGE,
    percentage: 0.55,
    currency: "USD",
    notes:
      "Charged when converting AUD to USD to fund Wall St trading, not on each individual trade. No separate per-trade FX fee for Wall St orders once funded.",
    sourceUrl: PRICING_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
];

export const Stake = {
  provider: {
    name: "Stakeshop Pty Ltd",
    slug: "stakeshop",
    website: "https://hellostake.com/au",
    description:
      "Sydney-founded fintech broker (trading as Stake) offering CHESS-sponsored ASX trading and US share/ETF investing for Australians.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-19"),
  },
  offering: {
    name: "Stake",
    slug: "stake",
    website: "https://hellostake.com/au",
    description:
      "Stake's CHESS-sponsored ASX share trading and custodial US (Wall St) share and ETF investing platform for Australians, with a flat low-dollar brokerage fee on both sides.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-19"),
    markets: [
      {
        marketCode: "ASX",
        availability: AvailabilityStatus.AVAILABLE,
        notes: "2,500+ ASX-listed securities across 77 industries.",
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        marketCode: "NYSE",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          'Stake advertises 11,000+ US stocks, ETFs, government bonds and OTC securities under one "Wall St" product; exact per-exchange coverage (NYSE vs. Nasdaq) not confirmed against an official breakdown.',
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          'Stake advertises 11,000+ US stocks, ETFs, government bonds and OTC securities under one "Wall St" product; exact per-exchange coverage (NYSE vs. Nasdaq) not confirmed against an official breakdown.',
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        notes: '"Wall St" product: US-listed stocks and ETFs only.',
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
      {
        productType: InvestmentProductType.BONDS,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Government bonds listed under the Wall St product on the official pricing page; not broken out further.",
        sourceUrl: PRICING_URL,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
    ],
    custody: [
      {
        marketCode: "ASX",
        custodyType: CustodyType.CHESS_SPONSORED,
        hinSupported: true,
        description:
          "Only whole shares supported on ASX (no fractional ASX shares); ASX minimum marketable parcel rules apply to the initial purchase.",
        sourceUrl: BROKERAGE_EXPLAINER_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NYSE",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Wall St holdings are held via a custodial structure, not CHESS/HIN; fractional shares are supported from US$10.",
        sourceUrl: BROKERAGE_EXPLAINER_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Wall St holdings are held via a custodial structure, not CHESS/HIN; fractional shares are supported from US$10.",
        sourceUrl: BROKERAGE_EXPLAINER_URL,
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    accountTypes: [
      {
        accountType: AccountType.SMSF,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Available via Stake Super, a separate SMSF administration product/entity (Stake SMSF Pty Ltd) layered on top of a standard Stake trading account; Stake Super's own annual fee (from $990) is not modelled as an OfferingFee here -- see the research manifest.",
        sourceUrl: "https://hellostake.com/au/pricing/super",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: FEES_CHECKED,
      },
    ],
    fees,
  },
};
