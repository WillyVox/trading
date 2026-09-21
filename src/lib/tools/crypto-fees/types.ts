export type CryptoFeeBasis = "FLAT" | "PERCENTAGE" | "FREE" | "TIERED" | "VARIES";
export type CryptoFeeCategory =
  | "CRYPTO_TRADING" | "MAKER" | "TAKER" | "INSTANT_BUY"
  | "FIAT_DEPOSIT" | "FIAT_WITHDRAWAL" | "CRYPTO_WITHDRAWAL" | "SPREAD" | "OTHER";
export type ToolVerificationStatus = "VERIFIED" | "STALE" | "UNVERIFIED";

export type CryptoFeeRule = {
  feeId: string;
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  category: CryptoFeeCategory;
  label: string;
  calculationBasis: CryptoFeeBasis;
  flatAmount: number | null;
  percentage: number | null;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  sourceUrl: string | null;
  verificationStatus: ToolVerificationStatus;
  verifiedAt: string | null;
  reviewDueAt: string | null;
};

export type CryptoFeeOffering = {
  slug: string;
  name: string;
  providerName: string;
  rules: CryptoFeeRule[];
};

export type CryptoFeeCalculation = {
  status: "CALCULATED" | "VARIABLE" | "TIERED_NEEDS_INPUT" | "UNKNOWN" | "STALE" | "UNSUPPORTED";
  amount?: number;
  currency?: string;
  percentage?: number;
  expression?: string;
  explanation: string;
};
