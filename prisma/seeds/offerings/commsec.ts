import {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  InvestmentProductType,
  OfferingType,
  ProviderType,
  VerificationStatus,
} from "@prisma/client";

/**
 * Checked 17 Sep 2026 against commsec.com.au and CommBank's official
 * CommSec pages for market/product/custody claims only -- no fee data is
 * seeded here (see docs/ROADMAP.md, Milestone 1 deliberately excludes
 * OfferingFee). Note for a later fee milestone: CommSec currently runs a
 * time-boxed promotional $0-brokerage offer (Oct 2026-Mar 2027) layered on
 * top of its standard tiered schedule -- OfferingFee will need a
 * validFrom/validTo (or isPromotional) pair before this gets seeded, or a
 * promo will silently look like the standing price once it expires.
 */
export const CommSec = {
  provider: {
    name: "Commonwealth Bank of Australia",
    slug: "commonwealth-bank-of-australia",
    website: "https://www.commbank.com.au",
    description:
      "Australia's largest retail bank, operating the CommSec share trading platform.",
    providerType: ProviderType.BROKER,
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
  },
};
