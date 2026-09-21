import type { CryptoFeeCalculation, CryptoFeeRule } from "./types";

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateCryptoFee(
  rule: CryptoFeeRule,
  amount: number
): CryptoFeeCalculation {
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
  if (rule.calculationBasis === "TIERED")
    return {
      status: "TIERED_NEEDS_INPUT",
      explanation:
        "This fee depends on a tier such as rolling trading volume or account status. The current structured record does not contain enough tier conditions to calculate it without guessing.",
    };
  return {
    status: "VARIABLE",
    explanation:
      "This cost varies by asset, network, liquidity, payment method or market conditions and cannot be estimated reliably from this record alone.",
  };
}
