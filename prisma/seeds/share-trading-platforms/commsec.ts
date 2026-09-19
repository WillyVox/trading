import {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  FeeCalculationBasis,
  FeeCategory,
  FeeChannel,
  InvestmentProductType,
  OfferingType,
  VerificationStatus,
} from "@prisma/client";
import type { OfferingFeeSeed } from "../lib/types";

/**
 * Market/product/custody claims checked 17 Sep 2026 against commsec.com.au
 * and CommBank's official CommSec pages. Fees added in Phase 2 and checked
 * 19 Sep 2026 directly against CommSec's official rates page
 * (commsec.com.au/support/rates-and-fees.html), cross-checked against the
 * FSG for boundary wording. The full research manifest -- including what is
 * deliberately NOT seeded -- is docs/research/offerings/commsec.md.
 *
 * The $0-brokerage new-customer promo is seeded as its own row with
 * isPromotional + validFrom/validTo. It is an ADDITION to the standing
 * schedule, never a replacement: the standing tiers above it stay as their
 * own non-promotional rows, so an expired promo can't masquerade as the
 * everyday price. validFrom/validTo are the *sign-up* window (1-30 Sep 2026),
 * the only period in which a new visitor can actually obtain the offer; the
 * order window (1 Oct 2026 - 31 Mar 2027) lives in promotionalTerms.
 */
const RATES_URL = "https://www.commsec.com.au/support/rates-and-fees.html";
const FEES_CHECKED = new Date("2026-09-19");

const fees: OfferingFeeSeed[] = [
  // ---- Australian shares brokerage: four genuinely different schedules by
  // settlement channel ("up to and including" boundaries throughout) ----
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    channel: FeeChannel.ONLINE_STANDARD_SETTLEMENT,
    label:
      "Australian shares brokerage (online, settled to CDIA or Margin Loan)",
    calculationBasis: FeeCalculationBasis.TIERED,
    currency: "AUD",
    notes:
      "To be eligible you must trade online, be CHESS-sponsored with CommSec, and settle through a Commonwealth Direct Investment Account (CDIA) or a CommSec Margin Loan.",
    tiers: [
      { minAmount: 0, maxAmount: 1000, flatAmount: 5 },
      { minAmount: 1000, maxAmount: 3000, flatAmount: 10 },
      { minAmount: 3000, maxAmount: 10000, flatAmount: 19.95 },
      { minAmount: 10000, maxAmount: 25000, flatAmount: 29.95 },
      { minAmount: 25000, percentage: 0.12 },
    ],
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    channel: FeeChannel.ONLINE_OWN_BANK_SETTLEMENT,
    label:
      "Australian shares brokerage (online, settled to your own bank account)",
    calculationBasis: FeeCalculationBasis.TIERED,
    currency: "AUD",
    tiers: [
      { minAmount: 0, maxAmount: 9999.99, flatAmount: 29.95 },
      { minAmount: 10000, percentage: 0.31 },
    ],
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    channel: FeeChannel.PHONE_OR_ESTATE,
    label: "Australian shares brokerage (phone trades and deceased estates)",
    calculationBasis: FeeCalculationBasis.TIERED,
    currency: "AUD",
    notes:
      "Includes trades settling to CommSec Margin Loans or Commonwealth Bank Geared Investment Loans where the bank exercises its rights under the Margin Loan Terms and Conditions.",
    tiers: [
      { minAmount: 0, maxAmount: 10000, flatAmount: 59.95 },
      { minAmount: 10000, maxAmount: 25000, percentage: 0.52 },
      { minAmount: 25000, maxAmount: 1000000, percentage: 0.49 },
      { minAmount: 1000000, percentage: 0.11 },
    ],
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
  {
    feeCategory: FeeCategory.BROKERAGE,
    marketCode: "ASX",
    channel: FeeChannel.THIRD_PARTY_SETTLEMENT,
    label:
      "Australian shares brokerage (trades requiring third-party settlement)",
    calculationBasis: FeeCalculationBasis.TIERED,
    currency: "AUD",
    notes:
      "Includes trades settling to CommSec Margin Loans or Commonwealth Bank Geared Investment Loans where the bank exercises its rights under the Margin Loan Terms and Conditions.",
    tiers: [
      { minAmount: 0, maxAmount: 15000, flatAmount: 99.95 },
      { minAmount: 15000, percentage: 0.66 },
    ],
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },

  // ---- International brokerage: "greater of $X flat or Y%" per market.
  // Only the two markets that exist in Market today are seeded; the other
  // markets on the rates page are listed in the research manifest. The
  // International Shares Plus account is noted in text (OfferingPricingPlan
  // is deferred until IBKR is seeded). ----
  ...(["NYSE", "NASDAQ"] as const).map((marketCode): OfferingFeeSeed => ({
    feeCategory: FeeCategory.BROKERAGE,
    marketCode,
    label: "US shares brokerage (International Shares account)",
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 5,
    percentage: 0.12,
    currency: "USD",
    notes:
      "Whichever amount is greater. The International Shares Plus account is greater of USD $9.95 or 0.20%. US brokerage includes SEC and FINRA fees; taxes and third-party fees are put through at cost. A separate foreign exchange fee applies.",
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  })),

  // ---- FX: flat 0.55% layered on top of international brokerage ----
  {
    feeCategory: FeeCategory.FX_CONVERSION,
    label: "Foreign exchange conversion fee",
    calculationBasis: FeeCalculationBasis.PERCENTAGE,
    percentage: 0.55,
    notes:
      "Charged per currency conversion. Conversions happen automatically for each international trade unless the Plus foreign-currency wallet is active and funded. Currency pairs that can't be converted directly are charged for each leg.",
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },

  // ---- Other ----
  {
    feeCategory: FeeCategory.EXCHANGE_TRANSFER,
    marketCode: "ASX",
    label: "Off-market transfer fee",
    calculationBasis: FeeCalculationBasis.FLAT,
    flatAmount: 54,
    currency: "AUD",
    notes: "Per transfer, GST-inclusive.",
    sourceUrl: RATES_URL,
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },

  // ---- Promotion (checked 19 Sep 2026 at commsec.com.au/offer) ----
  {
    feeCategory: FeeCategory.BROKERAGE,
    channel: FeeChannel.ONLINE_STANDARD_SETTLEMENT,
    label: "New customer offer: $0 brokerage on your first 30 trades",
    calculationBasis: FeeCalculationBasis.FREE,
    isPromotional: true,
    // Sign-up window (see the comment at the top of this file).
    validFrom: new Date("2026-09-01T00:00:00+10:00"),
    validTo: new Date("2026-09-30T23:59:59+10:00"),
    promotionalTerms:
      "For new-to-CommSec customers who open an Australian Shares, International Shares or Exchange Traded Options account between 1 and 30 September 2026 and settle through a CommSec Margin Loan or CDIA. $0 brokerage applies to up to 30 online trades of up to $50,000 each, for orders placed between 1 October 2026 and 31 March 2027. Trades above $50,000 pay standard brokerage; taxes and fees, including FX, still apply to international trades. Not available to existing customers and doesn't apply to CommSec Pocket.",
    sourceUrl: "https://www.commsec.com.au/offer",
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: FEES_CHECKED,
  },
];

export const CommSec = {
  provider: {
    name: "Commonwealth Bank of Australia",
    slug: "commonwealth-bank-of-australia",
    website: "https://www.commbank.com.au",
    description:
      "Australia's largest retail bank, operating the CommSec share trading platform.",
    jurisdictions: ["AU"],
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
  },
  offering: {
    name: "CommSec",
    slug: "commsec",
    website: "https://www.commsec.com.au",
    description:
      "Commonwealth Bank's CHESS-sponsored share trading platform for Australian and international shares, ETFs, and exchange-traded options.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: "AU",
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date("2026-09-17"),
    markets: [
      {
        marketCode: "ASX",
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.commsec.com.au",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        marketCode: "NYSE",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "CommSec advertises international share access; reviews differ on the exact number of international markets (12-25 depending on source), so an exact figure isn't seeded here -- exact per-exchange coverage not yet confirmed against an official breakdown.",
        sourceUrl:
          "https://www.commbank.com.au/investing/commsec-australian-shares.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "CommSec advertises international share access; reviews differ on the exact number of international markets (12-25 depending on source), so an exact figure isn't seeded here -- exact per-exchange coverage not yet confirmed against an official breakdown.",
        sourceUrl:
          "https://www.commbank.com.au/investing/commsec-australian-shares.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.commsec.com.au",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl:
          "https://www.commbank.com.au/investing/commsec-australian-shares.html",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: "https://www.commsec.com.au",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        productType: InvestmentProductType.OPTIONS,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Reported in third-party reviews as Exchange Traded Options; confirm against CommSec's own product pages before publishing.",
        sourceUrl:
          "https://www.commbank.com.au/investing/commsec-australian-shares.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    custody: [
      {
        marketCode: "ASX",
        custodyType: CustodyType.CHESS_SPONSORED,
        hinSupported: true,
        sourceUrl: "https://www.commsec.com.au",
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-09-17"),
      },
      {
        marketCode: "NYSE",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Reported in third-party materials as held via a custodial/nominee structure; the specific custodian named in some reviews (Interactive Brokers LLC) is not yet confirmed against CommSec's own FSG/PDS.",
        sourceUrl:
          "https://www.commbank.com.au/investing/commsec-australian-shares.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: "NASDAQ",
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Reported in third-party materials as held via a custodial/nominee structure; the specific custodian named in some reviews (Interactive Brokers LLC) is not yet confirmed against CommSec's own FSG/PDS.",
        sourceUrl:
          "https://www.commbank.com.au/investing/commsec-australian-shares.html",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    accountTypes: [
      {
        accountType: AccountType.SMSF,
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          "Widely reported as supported; confirm against CommSec's own account-opening documentation before publishing.",
        sourceUrl: "https://www.commsec.com.au",
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    fees,
  },
};
