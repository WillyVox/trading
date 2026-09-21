import type { BrokerageCalculation, BrokerageRule } from "../brokerage/types";

export type InvestingFrequency = "MONTHLY" | "FORTNIGHTLY" | "WEEKLY";

export type RegularInvestingScenario = {
  contributionAmount: number;
  frequency: InvestingFrequency;
  years: number;
};

export type RegularInvestingResult = {
  status: BrokerageCalculation["status"];
  contributionAmount: number;
  contributionCount: number;
  totalContributions: number;
  brokeragePerContribution?: number;
  totalBrokerage?: number;
  effectiveBrokeragePercent?: number;
  currency?: string;
  ruleLabel?: string;
  expression?: string;
  explanation: string;
};

export type RegularInvestingRule = BrokerageRule;
