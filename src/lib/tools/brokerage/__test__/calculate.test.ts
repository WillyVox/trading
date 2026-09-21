import type {
  BrokerageCalculation,
  BrokerageRule,
  BrokerageScenario,
  BrokerageTierRule,
} from "../types";

/**
 * Round a monetary value to two decimal places.
 *
 * JavaScript uses binary floating-point numbers, so calculations such as
 * 25,000 × 0.12% can internally produce 29.999999999999996 instead of 30.
 *
 * We keep full precision while determining the applicable fee/rule and only
 * round monetary outputs afterwards.
 */
function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate a percentage of the trade amount.
 *
 * This deliberately does NOT round because the raw value may be used when
 * deciding which side of a GREATER_OF rule applies.
 */
function percentageAmount(tradeAmount: number, percentage: number): number {
  return tradeAmount * (percentage / 100);
}

/**
 * Find the applicable tier for a trade amount.
 *
 * Tier upper bounds are inclusive. When two adjacent tiers share the same
 * boundary, the shared boundary belongs to the earlier tier and the next tier
 * begins immediately above it.
 */
function matchingTier(
  tiers: BrokerageTierRule[],
  tradeAmount: number
): BrokerageTierRule | undefined {
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

/**
 * Determine whether a structured brokerage rule applies to the selected
 * calculator scenario.
 */
export function ruleMatchesScenario(
  rule: BrokerageRule,
  scenario: BrokerageScenario
): boolean {
  if (
    rule.pricingPlan &&
    scenario.pricingPlan &&
    rule.pricingPlan !== scenario.pricingPlan
  ) {
    return false;
  }

  if (
    rule.tradeSide &&
    rule.tradeSide !== "ANY" &&
    rule.tradeSide !== scenario.tradeSide
  ) {
    return false;
  }

  if (
    rule.firstBuyPerSecurityPerDay != null &&
    rule.firstBuyPerSecurityPerDay !== scenario.firstBuyPerSecurityPerDay
  ) {
    return false;
  }

  if (rule.excludesMarginLoanSettlement && scenario.marginLoanSettlement) {
    return false;
  }

  if (
    rule.minTradeAmount != null &&
    scenario.tradeAmount < rule.minTradeAmount
  ) {
    return false;
  }

  if (rule.maxTradeAmount != null) {
    if (
      rule.maxTradeAmountInclusive
        ? scenario.tradeAmount > rule.maxTradeAmount
        : scenario.tradeAmount >= rule.maxTradeAmount
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Select the most specific applicable brokerage rule.
 *
 * More constrained rules win over generic fallbacks. This is important for
 * conditional pricing such as CMC's eligible first-buy concession.
 */
export function selectBrokerageRule(
  rules: BrokerageRule[],
  scenario: BrokerageScenario
): BrokerageRule | undefined {
  const matches = rules.filter((rule) => ruleMatchesScenario(rule, scenario));

  const score = (rule: BrokerageRule): number =>
    [
      rule.pricingPlan,
      rule.tradeSide,
      rule.firstBuyPerSecurityPerDay,
      rule.minTradeAmount,
      rule.maxTradeAmount,
      rule.excludesMarginLoanSettlement ? 1 : null,
    ].filter((value) => value != null).length;

  return matches.sort((a, b) => score(b) - score(a))[0];
}

/**
 * Calculate brokerage for a verified structured pricing rule.
 *
 * Calculation order:
 *
 * 1. Validate verification status and input.
 * 2. Calculate the raw brokerage amount.
 * 3. Determine minimum/tier/greater-of result using full precision.
 * 4. Calculate GST using the raw brokerage amount.
 * 5. Round monetary outputs to currency precision.
 *
 * This avoids floating-point values such as:
 *
 *   29.999999999999996
 *   30.000011999999995
 *   5.999999999999999
 *
 * leaking into the rest of the application.
 */
export function calculateBrokerage(
  rule: BrokerageRule,
  tradeAmount: number
): BrokerageCalculation {
  if (rule.verificationStatus === "STALE") {
    return {
      status: "STALE",
      ruleLabel: rule.label,
      explanation:
        "This pricing is marked stale and must be reverified before it is used for an estimate.",
    };
  }

  if (rule.verificationStatus !== "VERIFIED") {
    return {
      status: "UNKNOWN",
      ruleLabel: rule.label,
      explanation:
        "This pricing has not been verified, so the calculator will not estimate a cost from it.",
    };
  }

  if (!Number.isFinite(tradeAmount) || tradeAmount <= 0) {
    return {
      status: "UNSUPPORTED",
      ruleLabel: rule.label,
      explanation: "Enter a trade amount greater than zero.",
    };
  }

  let base: number | undefined;
  let expression: string | undefined;
  let explanation = "";

  switch (rule.calculationBasis) {
    case "FREE": {
      base = 0;

      expression = "Published brokerage for this eligible scenario = 0.00";

      explanation =
        "The selected scenario satisfies the published conditions for zero brokerage. Other costs may still apply.";

      break;
    }

    case "FLAT": {
      if (rule.flatAmount != null && rule.flatAmount != undefined) {
        base = rule.flatAmount;

        expression =
          `${rule.currency ?? ""} ${roundCurrency(base ?? 0).toFixed(2)} flat brokerage`.trim();

        explanation = "This published rule applies a flat brokerage amount.";
      }

      break;
    }

    case "PERCENTAGE": {
      if (rule.percentage != null) {
        base = percentageAmount(tradeAmount, rule.percentage);

        expression = `${tradeAmount.toFixed(2)} × ${rule.percentage}% = ${roundCurrency(base).toFixed(2)}`;

        explanation =
          "This published rule applies a percentage of trade value.";
      }

      break;
    }

    case "GREATER_OF": {
      if (rule.flatAmount != null && rule.percentage != null) {
        const percentageFee = percentageAmount(tradeAmount, rule.percentage);

        // Compare raw values first. Do not round before deciding which
        // component of the greater-of rule applies.
        base = Math.max(rule.flatAmount, percentageFee);

        expression =
          `Greater of ${rule.flatAmount.toFixed(2)} or ` +
          `${tradeAmount.toFixed(2)} × ${rule.percentage}% ` +
          `(${roundCurrency(percentageFee).toFixed(2)}) = ` +
          `${roundCurrency(base).toFixed(2)}`;

        explanation =
          "The published rule charges whichever is greater: the minimum amount or the percentage of trade value.";
      }

      break;
    }

    case "TIERED": {
      const tier = matchingTier(rule.tiers, tradeAmount);

      if (tier?.flatAmount != null) {
        base = tier.flatAmount;

        expression =
          `Trade value ${tradeAmount.toFixed(2)} falls in the applicable tier → ` +
          `${roundCurrency(base ?? 0).toFixed(2)}`;

        explanation = "The trade value falls within a published flat-fee tier.";
      } else if (tier?.percentage != null) {
        base = percentageAmount(tradeAmount, tier.percentage);

        expression =
          `${tradeAmount.toFixed(2)} × ${tier.percentage}% = ` +
          `${roundCurrency(base).toFixed(2)}`;

        explanation =
          "The trade value falls within a published percentage tier.";
      }

      break;
    }

    case "VARIES": {
      return {
        status: "VARIABLE",
        ruleLabel: rule.label,
        explanation:
          "This published pricing varies and cannot be calculated from this scenario alone.",
      };
    }
  }

  if (base == null) {
    return {
      status: "UNSUPPORTED",
      ruleLabel: rule.label,
      explanation:
        "We can't calculate this scenario from the verified structured pricing currently available.",
    };
  }

  /*
   * Keep the raw brokerage amount for GST calculation.
   *
   * Example:
   * IBKR:
   * A$20,000 × 0.08% = A$16 raw brokerage
   * GST = A$1.60
   * Total = A$17.60
   */
  const rawTax = rule.gstPercent != null ? base * (rule.gstPercent / 100) : 0;

  const rawTotal = base + rawTax;

  /*
   * Currency values exposed by the calculation engine are rounded to cents.
   */
  const preTaxAmount = roundCurrency(base);
  const taxAmount = roundCurrency(rawTax);
  const amount = roundCurrency(rawTotal);

  if (rawTax > 0 && rule.gstPercent != null) {
    expression =
      `${expression}; + ${rule.gstPercent}% GST ` +
      `(${taxAmount.toFixed(2)}) = ` +
      `${amount.toFixed(2)}`;
  }

  return {
    status: "CALCULATED",
    amount,
    preTaxAmount,
    taxAmount: rawTax > 0 ? taxAmount : undefined,
    currency: rule.currency ?? undefined,
    ruleLabel: rule.label,
    expression,
    explanation,
  };
}
