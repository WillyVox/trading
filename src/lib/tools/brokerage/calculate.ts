import type {
  BrokerageCalculation,
  BrokerageRule,
  BrokerageScenario,
  BrokerageTierRule,
} from "./types";

function percentageAmount(tradeAmount: number, percentage: number) {
  return tradeAmount * (percentage / 100);
}
function matchingTier(tiers: BrokerageTierRule[], tradeAmount: number) {
  return tiers.find((tier, index) => {
    const previousMax = index > 0 ? tiers[index - 1]?.maxAmount : null;
    const lower =
      index === 0 || previousMax == null || previousMax < tier.minAmount
        ? tradeAmount >= tier.minAmount
        : tradeAmount > tier.minAmount;
    const upper = tier.maxAmount == null || tradeAmount <= tier.maxAmount;
    return lower && upper;
  });
}
export function ruleMatchesScenario(
  rule: BrokerageRule,
  scenario: BrokerageScenario
) {
  if (
    rule.pricingPlan &&
    scenario.pricingPlan &&
    rule.pricingPlan !== scenario.pricingPlan
  )
    return false;
  if (
    rule.tradeSide &&
    rule.tradeSide !== "ANY" &&
    rule.tradeSide !== scenario.tradeSide
  )
    return false;
  if (
    rule.firstBuyPerSecurityPerDay != null &&
    rule.firstBuyPerSecurityPerDay !== scenario.firstBuyPerSecurityPerDay
  )
    return false;
  if (rule.excludesMarginLoanSettlement && scenario.marginLoanSettlement)
    return false;
  if (rule.minTradeAmount != null && scenario.tradeAmount < rule.minTradeAmount)
    return false;
  if (rule.maxTradeAmount != null) {
    if (
      rule.maxTradeAmountInclusive
        ? scenario.tradeAmount > rule.maxTradeAmount
        : scenario.tradeAmount >= rule.maxTradeAmount
    )
      return false;
  }
  return true;
}
export function selectBrokerageRule(
  rules: BrokerageRule[],
  scenario: BrokerageScenario
) {
  const matches = rules.filter((r) => ruleMatchesScenario(r, scenario));
  // Prefer the most constrained rule, so a first-buy concession wins over a generic fallback.
  const score = (r: BrokerageRule) =>
    [
      r.pricingPlan,
      r.tradeSide,
      r.firstBuyPerSecurityPerDay,
      r.minTradeAmount,
      r.maxTradeAmount,
      r.excludesMarginLoanSettlement ? 1 : null,
    ].filter((v) => v != null).length;
  return matches.sort((a, b) => score(b) - score(a))[0];
}
export function calculateBrokerage(
  rule: BrokerageRule,
  tradeAmount: number
): BrokerageCalculation {
  if (rule.verificationStatus === "STALE")
    return {
      status: "STALE",
      ruleLabel: rule.label,
      explanation:
        "This pricing is marked stale and must be reverified before it is used for an estimate.",
    };
  if (rule.verificationStatus !== "VERIFIED")
    return {
      status: "UNKNOWN",
      ruleLabel: rule.label,
      explanation:
        "This pricing has not been verified, so the calculator will not estimate a cost from it.",
    };
  if (!Number.isFinite(tradeAmount) || tradeAmount <= 0)
    return {
      status: "UNSUPPORTED",
      ruleLabel: rule.label,
      explanation: "Enter a trade amount greater than zero.",
    };
  let base: number | undefined;
  let expression: string | undefined;
  let explanation = "";
  switch (rule.calculationBasis) {
    case "FREE":
      base = 0;
      expression = "Published brokerage for this eligible scenario = 0.00";
      explanation =
        "The selected scenario satisfies the published conditions for zero brokerage. Other costs may still apply.";
      break;
    case "FLAT":
      if (rule.flatAmount != null) {
        base = rule.flatAmount;
        expression =
          `${rule.currency ?? ""} ${base.toFixed(2)} flat brokerage`.trim();
        explanation = "This published rule applies a flat brokerage amount.";
      }
      break;
    case "PERCENTAGE":
      if (rule.percentage != null) {
        base = percentageAmount(tradeAmount, rule.percentage);
        expression = `${tradeAmount.toFixed(2)} × ${rule.percentage}% = ${base.toFixed(2)}`;
        explanation =
          "This published rule applies a percentage of trade value.";
      }
      break;
    case "GREATER_OF":
      if (rule.flatAmount != null && rule.percentage != null) {
        const pct = percentageAmount(tradeAmount, rule.percentage);
        base = Math.max(rule.flatAmount, pct);
        expression = `Greater of ${rule.flatAmount.toFixed(2)} or ${tradeAmount.toFixed(2)} × ${rule.percentage}% (${pct.toFixed(2)}) = ${base.toFixed(2)}`;
        explanation =
          "The published rule charges whichever is greater: the minimum amount or the percentage of trade value.";
      }
      break;
    case "TIERED": {
      const tier = matchingTier(rule.tiers, tradeAmount);
      if (tier?.flatAmount != null) {
        base = tier.flatAmount;
        expression = `Trade value ${tradeAmount.toFixed(2)} falls in the applicable tier → ${base.toFixed(2)}`;
        explanation = "The trade value falls within a published flat-fee tier.";
      } else if (tier?.percentage != null) {
        base = percentageAmount(tradeAmount, tier.percentage);
        expression = `${tradeAmount.toFixed(2)} × ${tier.percentage}% = ${base.toFixed(2)}`;
        explanation =
          "The trade value falls within a published percentage tier.";
      }
      break;
    }
    case "VARIES":
      return {
        status: "VARIABLE",
        ruleLabel: rule.label,
        explanation:
          "This published pricing varies and cannot be calculated from this scenario alone.",
      };
  }
  if (base == null)
    return {
      status: "UNSUPPORTED",
      ruleLabel: rule.label,
      explanation:
        "We can't calculate this scenario from the verified structured pricing currently available.",
    };
  const tax = rule.gstPercent ? base * (rule.gstPercent / 100) : 0;
  const amount = base + tax;
  if (tax > 0)
    expression = `${expression}; + ${rule.gstPercent}% GST (${tax.toFixed(2)}) = ${amount.toFixed(2)}`;
  return {
    status: "CALCULATED",
    amount,
    preTaxAmount: base,
    taxAmount: tax || undefined,
    currency: rule.currency ?? undefined,
    ruleLabel: rule.label,
    expression,
    explanation,
  };
}
