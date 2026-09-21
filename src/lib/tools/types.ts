import type { VerificationStatus } from "@prisma/client";

export type ToolStatus = "AVAILABLE" | "COMING_SOON";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: "TRADING_COSTS" | "OWNERSHIP_CUSTODY";
  status: ToolStatus;
  href: string;
};

export type CalculationStatus =
  "CALCULATED" | "PARTIAL" | "VARIABLE" | "UNKNOWN" | "STALE" | "UNSUPPORTED";

export type CalculationInput = {
  label: string;
  value: string;
};

export type CalculationStep = {
  label: string;
  expression?: string;
  result?: string;
};

export type CalculationEvidence = {
  sourceUrl: string;
  verifiedAt?: Date | null;
  verificationStatus: VerificationStatus;
};

export type CalculationResult = {
  status: CalculationStatus;
  amount?: number;
  currency?: string;
  inputs: CalculationInput[];
  applicableRule?: { label: string; description: string };
  steps: CalculationStep[];
  assumptions: string[];
  exclusions: string[];
  evidence?: CalculationEvidence;
  message?: string;
};
