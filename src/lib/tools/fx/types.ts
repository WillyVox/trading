import type { ToolVerificationStatus } from "@/lib/tools/types";

export type FxCalculationBasis = "PERCENTAGE" | "FREE" | "VARIES";

export type FxRule = {
  feeId: string;
  offeringSlug: string;
  offeringName: string;
  providerName: string;
  marketCode: string | null;
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

/** One platform option may legitimately have multiple FX pricing scenarios. */
export type FxOfferingOption = {
  slug: string;
  name: string;
  providerName: string;
  rules: FxRule[];
  availability: FxAvailability;
  reason?: string;
};
