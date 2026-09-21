export type CryptoFeeBasis =
  "FLAT" | "PERCENTAGE" | "FREE" | "TIERED" | "VARIES";
export type CryptoFeeCategory =
  | "CRYPTO_TRADING"
  | "MAKER"
  | "TAKER"
  | "INSTANT_BUY"
  | "FIAT_DEPOSIT"
  | "FIAT_WITHDRAWAL"
  | "CRYPTO_WITHDRAWAL"
  | "SPREAD"
  | "OTHER";
export type ToolVerificationStatus = "VERIFIED" | "STALE" | "UNVERIFIED";

export type CryptoFeeTier = {
  position: number;
  percentage: number | null;
  flatAmount: number | null;
  minRolling30DayVolume: number | null;
  minAssetsOnPlatform: number | null;
};

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
  tierVolumeCurrency: string | null;
  tierAssetsCurrency: string | null;
  tiers: CryptoFeeTier[];
};

export type CryptoFeeOffering = {
  slug: string;
  name: string;
  providerName: string;
  rules: CryptoFeeRule[];
};

export type CryptoFeeScenario = {
  amount: number;
  rolling30DayVolume?: number | null;
  assetsOnPlatform?: number | null;
};

export type CryptoFeeCalculation = {
  status:
    | "CALCULATED"
    | "VARIABLE"
    | "TIERED_NEEDS_INPUT"
    | "UNKNOWN"
    | "STALE"
    | "UNSUPPORTED";
  amount?: number;
  currency?: string;
  percentage?: number;
  expression?: string;
  explanation: string;
  appliedTier?: number;
};
