import type {
  FeeCalculationBasis,
  FeeChannel,
  VerificationStatus,
} from "@prisma/client";

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
  channel: FeeChannel | null;
  label: string;
  calculationBasis: FeeCalculationBasis;
  flatAmount: number | null;
  percentage: number | null;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  sourceUrl: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  tiers: BrokerageTierRule[];
};

export type BrokerageCalculation = {
  status: "CALCULATED" | "UNSUPPORTED";
  amount?: number;
  currency?: string;
  ruleLabel: string;
  expression?: string;
  explanation: string;
};
