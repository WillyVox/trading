import type { ToolVerificationStatus } from "@/lib/tools/types";

export type FxCalculationBasis = "PERCENTAGE" | "VARIES";

export type FxRule = {
  feeId: string;
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  label: string;
  calculationBasis: FxCalculationBasis;
  percentage: number | null;
  currency: string | null;
  displayValue: string | null;
  notes: string | null;
  sourceUrl: string | null;
  verificationStatus: ToolVerificationStatus;
  verifiedAt: string | null;
  reviewDueAt: string | null;
};

export type FxAvailability =
  "CALCULATABLE" | "VARIABLE" | "STALE" | "UNAVAILABLE";
export type FxOfferingOption = {
  slug: string;
  name: string;
  providerName: string;
  rule: FxRule;
  availability: FxAvailability;
  reason?: string;
};
