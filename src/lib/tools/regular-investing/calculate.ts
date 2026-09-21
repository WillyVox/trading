import { calculateBrokerage } from "../brokerage/calculate";
import type { BrokerageRule } from "../brokerage/types";
import type {
  InvestingFrequency,
  RegularInvestingResult,
  RegularInvestingScenario,
} from "./types";

const CONTRIBUTIONS_PER_YEAR: Record<InvestingFrequency, number> = {
  MONTHLY: 12,
  FORTNIGHTLY: 26,
  WEEKLY: 52,
};

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundPercent(value: number): number {
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

export function contributionCount(
  frequency: InvestingFrequency,
  years: number
): number {
  if (!Number.isInteger(years) || years <= 0) return 0;
  return CONTRIBUTIONS_PER_YEAR[frequency] * years;
}

/**
 * Applies one verified brokerage rule to a repeated, equal-contribution
 * hypothetical scenario. It deliberately models brokerage only: returns,
 * taxes, FX, spreads and changing fee schedules are outside this estimate.
 */
export function calculateRegularInvesting(
  rule: BrokerageRule,
  scenario: RegularInvestingScenario
): RegularInvestingResult {
  const { contributionAmount, frequency, years } = scenario;
  const count = contributionCount(frequency, years);

  if (
    !Number.isFinite(contributionAmount) ||
    contributionAmount <= 0 ||
    count === 0
  ) {
    return {
      status: "UNSUPPORTED",
      contributionAmount,
      contributionCount: count,
      totalContributions: 0,
      explanation:
        "Enter a contribution amount greater than zero and a whole-number period of at least one year.",
    };
  }

  const perContribution = calculateBrokerage(rule, contributionAmount);
  const totalContributions = roundCurrency(contributionAmount * count);

  if (
    perContribution.status !== "CALCULATED" ||
    perContribution.amount == null
  ) {
    return {
      status: perContribution.status,
      contributionAmount,
      contributionCount: count,
      totalContributions,
      currency: perContribution.currency,
      ruleLabel: perContribution.ruleLabel,
      expression: perContribution.expression,
      explanation: perContribution.explanation,
    };
  }

  const brokeragePerContribution = roundCurrency(perContribution.amount);
  const totalBrokerage = roundCurrency(brokeragePerContribution * count);
  const effectiveBrokeragePercent =
    totalContributions > 0
      ? roundPercent((totalBrokerage / totalContributions) * 100)
      : undefined;

  return {
    status: "CALCULATED",
    contributionAmount,
    contributionCount: count,
    totalContributions,
    brokeragePerContribution,
    totalBrokerage,
    effectiveBrokeragePercent,
    currency: perContribution.currency,
    ruleLabel: perContribution.ruleLabel,
    expression: `${count} contributions × ${brokeragePerContribution.toFixed(2)} brokerage = ${totalBrokerage.toFixed(2)}`,
    explanation:
      "This repeats the same verified brokerage rule for each equal contribution in the hypothetical period.",
  };
}
