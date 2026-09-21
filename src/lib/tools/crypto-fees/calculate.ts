import type {
  CryptoFeeCalculation,
  CryptoFeeRule,
  CryptoFeeScenario,
  CryptoFeeTier,
} from "./types";

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function qualifies(tier: CryptoFeeTier, scenario: CryptoFeeScenario) {
  const hasVolume = tier.minRolling30DayVolume != null;
  const hasAssets = tier.minAssetsOnPlatform != null;
  if (!hasVolume && !hasAssets) return true;

  const volumeQualifies =
    hasVolume &&
    scenario.rolling30DayVolume != null &&
    scenario.rolling30DayVolume >= tier.minRolling30DayVolume!;
  const assetsQualify =
    hasAssets &&
    scenario.assetsOnPlatform != null &&
    scenario.assetsOnPlatform >= tier.minAssetsOnPlatform!;
  // When both are published on the same tier (Kraken), either route qualifies.
  return volumeQualifies || assetsQualify;
}

export function selectCryptoFeeTier(
  rule: CryptoFeeRule,
  scenario: CryptoFeeScenario
) {
  return [...rule.tiers]
    .sort((a, b) => b.position - a.position)
    .find((tier) => qualifies(tier, scenario));
}

export function calculateCryptoFee(
  rule: CryptoFeeRule,
  amountOrScenario: number | CryptoFeeScenario
): CryptoFeeCalculation {
  const scenario: CryptoFeeScenario =
    typeof amountOrScenario === "number"
      ? { amount: amountOrScenario }
      : amountOrScenario;
  const amount = scenario.amount;

  if (rule.verificationStatus === "STALE")
    return {
      status: "STALE",
      explanation:
        "This fee record is marked stale and needs review before it is used for an estimate.",
    };
  if (rule.verificationStatus !== "VERIFIED")
    return {
      status: "UNKNOWN",
      explanation:
        "This fee has not been verified, so Trading Guide will not turn it into an estimate.",
    };
  if (!Number.isFinite(amount) || amount <= 0)
    return {
      status: "UNSUPPORTED",
      explanation: "Enter an amount greater than zero.",
    };

  if (rule.calculationBasis === "FREE")
    return {
      status: "CALCULATED",
      amount: 0,
      currency: rule.currency ?? "AUD",
      expression: "Published fee = 0.00",
      explanation:
        "The selected published fee is recorded as free. Other costs may still apply.",
    };
  if (rule.calculationBasis === "PERCENTAGE" && rule.percentage != null) {
    const fee = roundCurrency((amount * rule.percentage) / 100);
    return {
      status: "CALCULATED",
      amount: fee,
      currency: rule.currency ?? "AUD",
      percentage: rule.percentage,
      expression: `${amount.toFixed(2)} × ${rule.percentage}% = ${fee.toFixed(2)}`,
      explanation:
        "The estimate applies the verified published percentage to the hypothetical transaction amount.",
    };
  }
  if (rule.calculationBasis === "FLAT" && rule.flatAmount != null) {
    return {
      status: "CALCULATED",
      amount: roundCurrency(rule.flatAmount),
      currency: rule.currency ?? "AUD",
      expression: `Published flat fee = ${rule.flatAmount}`,
      explanation:
        "The selected fee is a published flat amount. Check the unit/currency shown by the provider.",
    };
  }
  if (rule.calculationBasis === "TIERED") {
    if (rule.tiers.length === 0)
      return {
        status: "TIERED_NEEDS_INPUT",
        explanation:
          "This is a tiered fee, but its qualification thresholds have not yet been structured.",
      };
    const needsVolume = rule.tiers.some((t) => t.minRolling30DayVolume != null);
    const needsAssets = rule.tiers.some((t) => t.minAssetsOnPlatform != null);
    if (
      needsVolume &&
      scenario.rolling30DayVolume == null &&
      (!needsAssets || scenario.assetsOnPlatform == null)
    ) {
      return {
        status: "TIERED_NEEDS_INPUT",
        explanation: needsAssets
          ? "Enter your rolling 30-day trading volume or assets on platform to determine the applicable published tier."
          : "Enter your rolling 30-day trading volume to determine the applicable published tier.",
      };
    }
    const tier = selectCryptoFeeTier(rule, scenario);
    if (!tier)
      return {
        status: "TIERED_NEEDS_INPUT",
        explanation:
          "The supplied qualification inputs do not match a structured published tier.",
      };
    if (tier.percentage != null) {
      const fee = roundCurrency((amount * tier.percentage) / 100);
      return {
        status: "CALCULATED",
        amount: fee,
        currency: rule.currency ?? "AUD",
        percentage: tier.percentage,
        appliedTier: tier.position + 1,
        expression: `${amount.toFixed(2)} × ${tier.percentage}% = ${fee.toFixed(2)}`,
        explanation: `The estimate uses the published tier that matches the supplied qualification inputs.`,
      };
    }
    if (tier.flatAmount != null)
      return {
        status: "CALCULATED",
        amount: roundCurrency(tier.flatAmount),
        currency: rule.currency ?? "AUD",
        appliedTier: tier.position + 1,
        expression: `Published tier fee = ${tier.flatAmount}`,
        explanation:
          "The estimate uses the published flat fee for the matching tier.",
      };
    return {
      status: "UNSUPPORTED",
      explanation: "The matching tier does not contain a calculatable fee.",
    };
  }
  return {
    status: "VARIABLE",
    explanation:
      "This cost varies by asset, network, liquidity, payment method or market conditions and cannot be estimated reliably from this record alone.",
  };
}
