import {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  InvestmentProductType,
  OfferingType,
  ProviderType,
  VerificationStatus,
} from '@prisma/client';

/**
 * Checked 17 Sep 2026 against CMC Invest's own stockbroking pages
 * (cmcmarkets.com/en-au/stockbroking) for market/product/custody claims
 * only -- no fee data is seeded here (see docs/ROADMAP.md, Milestone 1
 * deliberately excludes OfferingFee). The international-custody row is
 * UNVERIFIED: it's reported in third-party reviews, not stated directly on
 * CMC's own pages in what was checked -- confirm against CMC's PDS/FSG
 * before upgrading it.
 */
export const CmcInvest = {
  provider: {
    name: 'CMC Markets',
    slug: 'cmc-markets',
    website: 'https://www.cmcmarkets.com/en-au',
    description:
      'ASX-listed financial services group operating the CMC Invest share trading platform and a separate CFD/forex trading business in Australia.',
    providerType: ProviderType.BROKER,
    jurisdictions: ['AU'],
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date('2026-09-17'),
  },
  offering: {
    name: 'CMC Invest',
    slug: 'cmc-invest',
    website: 'https://www.cmcmarkets.com/en-au/stockbroking',
    description:
      "CMC Markets' CHESS-sponsored share investing platform for Australian and international shares and ETFs, separate from CMC's CFD/forex business.",
    offeringType: OfferingType.SHARE_TRADING,
    jurisdiction: 'AU',
    verificationStatus: VerificationStatus.UNVERIFIED,
    lastVerifiedAt: new Date('2026-09-17'),
    markets: [
      {
        marketCode: 'ASX',
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking',
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date('2026-09-17'),
      },
      {
        marketCode: 'NYSE',
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          'CMC Invest advertises access to the ASX plus 15 international markets, including the US; exact per-exchange coverage (NYSE vs. Nasdaq) not yet confirmed against an official breakdown.',
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking',
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: 'NASDAQ',
        availability: AvailabilityStatus.AVAILABLE,
        notes:
          'CMC Invest advertises access to the ASX plus 15 international markets, including the US; exact per-exchange coverage (NYSE vs. Nasdaq) not yet confirmed against an official breakdown.',
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking',
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
    products: [
      {
        productType: InvestmentProductType.AU_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking/products/asx',
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date('2026-09-17'),
      },
      {
        productType: InvestmentProductType.INTERNATIONAL_SHARES,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking',
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date('2026-09-17'),
      },
      {
        productType: InvestmentProductType.ETF,
        availability: AvailabilityStatus.AVAILABLE,
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking',
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date('2026-09-17'),
      },
    ],
    custody: [
      {
        marketCode: 'ASX',
        custodyType: CustodyType.CHESS_SPONSORED,
        hinSupported: true,
        sourceUrl: 'https://www.cmcmarkets.com/en-au/stockbroking',
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date('2026-09-17'),
      },
      {
        marketCode: 'NYSE',
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Reported as custodial in third-party reviews of CMC Invest; not yet confirmed against CMC's own PDS/FSG.",
        sourceUrl:
          'https://invezz.com/au/reviews/cmc-markets-review-australia/',
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
      {
        marketCode: 'NASDAQ',
        custodyType: CustodyType.CUSTODIAL,
        hinSupported: false,
        description:
          "Reported as custodial in third-party reviews of CMC Invest; not yet confirmed against CMC's own PDS/FSG.",
        sourceUrl:
          'https://invezz.com/au/reviews/cmc-markets-review-australia/',
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
          'https://www.investmatch.com.au/compare/cmc-invest-vs-sharesies',
        verificationStatus: VerificationStatus.UNVERIFIED,
      },
    ],
  },
};
