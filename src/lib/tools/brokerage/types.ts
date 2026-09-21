import type { ToolVerificationStatus } from "../types";

export type BrokerageCalculationBasis =
  "FLAT" | "PERCENTAGE" | "GREATER_OF" | "TIERED" | "FREE" | "VARIES";
export type BrokerageFeeChannel =
  | "ONLINE_STANDARD_SETTLEMENT"
  | "ONLINE_OWN_BANK_SETTLEMENT"
  | "PHONE_OR_ESTATE"
  | "THIRD_PARTY_SETTLEMENT";
export type BrokerageTradeSide = "ANY" | "BUY" | "SELL";

export type BrokerageScenario = {
  tradeAmount: number;
  tradeSide: "BUY" | "SELL";
  firstBuyPerSecurityPerDay: boolean;
  marginLoanSettlement: boolean;
  pricingPlan?: string | null;
};

export type BrokerageTierRule = {
  minAmount: number;
  maxAmount: number | null;
  flatAmount: number | null;
  percentage: number | null;
};
export type BrokerageRule = {
  feeId: string;
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  marketCode: string;
  marketName: string;
  channel: BrokerageFeeChannel | null;
  label: string;
  calculationBasis: BrokerageCalculationBasis;
  flatAmount: number | null;
  percentage: number | null;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  sourceUrl: string | null;
  verificationStatus: ToolVerificationStatus;
  verifiedAt: string | null;
  tiers: BrokerageTierRule[];
  pricingPlan: string | null;
  tradeSide: BrokerageTradeSide | null;
  firstBuyPerSecurityPerDay: boolean | null;
  minTradeAmount: number | null;
  maxTradeAmount: number | null;
  maxTradeAmountInclusive: boolean;
  excludesMarginLoanSettlement: boolean;
  gstPercent: number | null;
};
export type BrokerageCalculation = {
  status: "CALCULATED" | "VARIABLE" | "UNKNOWN" | "STALE" | "UNSUPPORTED";
  amount?: number;
  preTaxAmount?: number;
  taxAmount?: number;
  currency?: string;
  ruleLabel: string;
  expression?: string;
  explanation: string;
};
export type BrokerageOfferingOption = {
  slug: string;
  name: string;
  providerName: string;
  rules: BrokerageRule[];
  availability: "CALCULATABLE" | "NEEDS_INPUT" | "UNAVAILABLE";
  reason?: string;
};
