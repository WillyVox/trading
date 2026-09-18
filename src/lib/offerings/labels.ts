import type {
  AccountType,
  AvailabilityStatus,
  CustodyType,
  InvestmentProductType,
} from '@prisma/client';

const PRODUCT_TYPE_LABELS: Record<InvestmentProductType, string> = {
  AU_SHARES: 'Australian shares',
  INTERNATIONAL_SHARES: 'International shares',
  ETF: 'ETFs',
  OPTIONS: 'Options',
  BONDS: 'Bonds',
  MANAGED_FUNDS: 'Managed funds',
  FUTURES: 'Futures',
  WARRANTS: 'Warrants',
  FOREX: 'Forex',
  CFD: 'CFDs',
  OTHER: 'Other',
};

export function formatProductType(type: InvestmentProductType): string {
  return PRODUCT_TYPE_LABELS[type] ?? type;
}

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  INDIVIDUAL: 'Individual',
  JOINT: 'Joint',
  COMPANY: 'Company',
  TRUST: 'Trust',
  SMSF: 'SMSF',
  MINOR: 'Minor',
  ADVISER: 'Adviser',
  PROFESSIONAL: 'Professional/wholesale',
  OTHER: 'Other',
};

export function formatAccountType(type: AccountType): string {
  return ACCOUNT_TYPE_LABELS[type] ?? type;
}

// Beginner-facing explanations, not just enum labels — see the master
// prompt's "Beginner First" principle: never show "CHESS: Yes" alone.
const CUSTODY_TYPE_COPY: Record<
  CustodyType,
  { label: string; explainer: string }
> = {
  CHESS_SPONSORED: {
    label: 'CHESS-sponsored',
    explainer:
      'Your shares are registered directly in your name on the ASX under your own Holder Identification Number (HIN), rather than held by the broker on your behalf.',
  },
  ISSUER_SPONSORED: {
    label: 'Issuer-sponsored',
    explainer:
      "Your holding is registered directly with the company's share registry under a Security Reference Number (SRN), not through a broker's HIN.",
  },
  CUSTODIAL: {
    label: 'Custodial',
    explainer:
      "The broker (or its custodian) holds the legal title to these shares on your behalf. You retain beneficial ownership, but the holding isn't registered directly in your own name.",
  },
  DIRECT_REGISTRATION: {
    label: 'Direct registration',
    explainer: 'Your holding is registered directly in your own name.',
  },
  OMNIBUS: {
    label: 'Omnibus/pooled',
    explainer:
      "Your holding is pooled together with other customers' holdings under one nominee account, rather than individually registered.",
  },
  MIXED: {
    label: 'Mixed',
    explainer:
      'This offering uses more than one ownership structure depending on the market or account type — see the notes for this specific market.',
  },
  OTHER: {
    label: 'Other',
    explainer: 'See the notes and source for this specific market.',
  },
  UNKNOWN: {
    label: 'Not yet confirmed',
    explainer:
      "We haven't been able to confirm the ownership structure for this market against an official source yet.",
  },
};

export function custodyTypeCopy(type: CustodyType) {
  return CUSTODY_TYPE_COPY[type] ?? CUSTODY_TYPE_COPY.OTHER;
}

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Not available',
  CONDITIONAL: 'Conditional',
  LIMITED: 'Limited',
  UNKNOWN: 'Not yet confirmed',
};

export function formatAvailability(status: AvailabilityStatus): string {
  return AVAILABILITY_LABELS[status] ?? status;
}
