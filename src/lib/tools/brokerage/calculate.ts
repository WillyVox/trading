import type {
  BrokerageCalculation,
  BrokerageRule,
  BrokerageTierRule,
} from "./types";

function percentageAmount(tradeAmount: number, percentage: number): number {
  return tradeAmount * (percentage / 100);
}

function matchingTier(
  tiers: BrokerageTierRule[],
  tradeAmount: number
): BrokerageTierRule | undefined {
  return tiers.find((tier, index) => {
    const previousMax = index > 0 ? tiers[index - 1]?.maxAmount : null;

    // When adjacent tiers share the same boundary, the prior tier owns the
    // inclusive boundary (for example, "up to $1,000" then "over $1,000").
    //
    // When there is a real gap between boundaries (for example,
    // 9,999.99 -> 10,000), the next tier's minimum is inclusive.
    const lowerMatches =
      index === 0 || previousMax == null || previousMax < tier.minAmount
        ? tradeAmount >= tier.minAmount
        : tradeAmount > tier.minAmount;

    const upperMatches =
      tier.maxAmount == null || tradeAmount <= tier.maxAmount;

    return lowerMatches && upperMatches;
  });
}

export function calculateBrokerage(
  rule: BrokerageRule,
  tradeAmount: number
): BrokerageCalculation {
  if (!Number.isFinite(tradeAmount) || tradeAmount <= 0) {
    return {
      status: "UNSUPPORTED",
      ruleLabel: rule.label,
      explanation: "Enter a trade amount greater than zero.",
    };
  }

  switch (rule.calculationBasis) {
    case "FLAT": {
      if (rule.flatAmount == null) {
        break;
      }

      return {
        status: "CALCULATED",
        amount: rule.flatAmount,
        currency: rule.currency ?? undefined,
        ruleLabel: rule.label,
        expression: `${rule.currency ?? ""} ${rule.flatAmount.toFixed(
          2
        )} flat brokerage`.trim(),
        explanation:
          "This published rule applies a flat brokerage amount to the selected scenario.",
      };
    }

    case "PERCENTAGE": {
      if (rule.percentage == null) {
        break;
      }

      const amount = percentageAmount(tradeAmount, rule.percentage);

      return {
        status: "CALCULATED",
        amount,
        currency: rule.currency ?? undefined,
        ruleLabel: rule.label,
        expression: `${tradeAmount.toFixed(2)} × ${
          rule.percentage
        }% = ${amount.toFixed(2)}`,
        explanation:
          "This published rule applies a percentage of the trade value.",
      };
    }

    case "GREATER_OF": {
      if (rule.flatAmount == null || rule.percentage == null) {
        break;
      }

      const percentage = percentageAmount(tradeAmount, rule.percentage);

      const amount = Math.max(rule.flatAmount, percentage);

      return {
        status: "CALCULATED",
        amount,
        currency: rule.currency ?? undefined,
        ruleLabel: rule.label,
        expression:
          `Greater of ${rule.flatAmount.toFixed(2)} or ` +
          `${tradeAmount.toFixed(2)} × ${rule.percentage}% ` +
          `(${percentage.toFixed(2)}) = ${amount.toFixed(2)}`,
        explanation:
          "The published rule charges whichever is greater: the minimum flat amount or the percentage of trade value.",
      };
    }

    case "TIERED": {
      const tier = matchingTier(rule.tiers, tradeAmount);

      if (!tier) {
        break;
      }

      if (tier.flatAmount != null) {
        return {
          status: "CALCULATED",
          amount: tier.flatAmount,
          currency: rule.currency ?? undefined,
          ruleLabel: rule.label,
          expression:
            `Trade value ${tradeAmount.toFixed(2)} ` +
            `falls in the applicable tier → ` +
            `${tier.flatAmount.toFixed(2)}`,
          explanation:
            "The trade value falls within a published brokerage tier with a flat fee.",
        };
      }

      if (tier.percentage != null) {
        const amount = percentageAmount(tradeAmount, tier.percentage);

        return {
          status: "CALCULATED",
          amount,
          currency: rule.currency ?? undefined,
          ruleLabel: rule.label,
          expression:
            `${tradeAmount.toFixed(2)} × ` +
            `${tier.percentage}% = ${amount.toFixed(2)}`,
          explanation:
            "The trade value falls within a published brokerage tier priced as a percentage of trade value.",
        };
      }

      break;
    }
  }

  return {
    status: "UNSUPPORTED",
    ruleLabel: rule.label,
    explanation:
      "We can't calculate this scenario from the verified structured pricing currently available.",
  };
}
