import type { CalculationResult } from "@/lib/tools/types";
import type { FxRule } from "./types";

const MAX_AMOUNT = 1_000_000_000;
function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateFxFee(
  amount: number,
  rule: FxRule
): CalculationResult {
  const inputs = [
    {
      label: "Amount converted",
      value: Number.isFinite(amount)
        ? `A$${amount.toLocaleString("en-AU")}`
        : "Invalid",
    },
    {
      label: "Published FX rate",
      value:
        rule.percentage == null
          ? (rule.displayValue ?? "Unknown")
          : `${rule.percentage}%`,
    },
  ];
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT)
    return {
      status: "UNSUPPORTED",
      inputs,
      steps: [],
      assumptions: [],
      exclusions: [],
      message: "Enter an amount greater than A$0 and no more than A$1 billion.",
    };
  if (rule.calculationBasis === "VARIES")
    return {
      status: "VARIABLE",
      inputs,
      steps: [],
      assumptions: [],
      exclusions: [],
      evidence: rule.sourceUrl
        ? {
            sourceUrl: rule.sourceUrl,
            verifiedAt: rule.verifiedAt,
            verificationStatus: rule.verificationStatus,
          }
        : undefined,
      message:
        rule.displayValue ?? "The provider publishes variable FX pricing.",
    };
  if (rule.verificationStatus !== "VERIFIED" || rule.percentage == null)
    return {
      status: "UNSUPPORTED",
      inputs,
      steps: [],
      assumptions: [],
      exclusions: [],
      message: "This FX pricing is not currently calculator-ready.",
    };
  const percentage = rule.percentage;
  const fee = roundCurrency((amount * percentage) / 100);
  return {
    status: "CALCULATED",
    amount: fee,
    currency: "AUD",
    inputs,
    applicableRule: {
      label: rule.label,
      description: rule.notes ?? `Published FX rate of ${percentage}%.`,
    },
    steps: [
      { label: "Published FX rate", result: `${percentage}%` },
      {
        label: "Estimated FX cost",
        expression: `A$${amount.toLocaleString("en-AU")} × ${percentage}%`,
        result: `A$${fee.toFixed(2)}`,
      },
    ],
    assumptions: [
      "The published percentage is applied once to the full AUD amount entered.",
      "The amount entered is the amount being converted; this is not a live exchange-rate quote.",
    ],
    exclusions: [
      "Movement in the underlying exchange rate.",
      "Brokerage, taxes, market fees, deposit or withdrawal fees and other transaction costs.",
      "Any different rate, tier or manual-conversion method not represented by the selected published rule.",
    ],
    evidence: {
      sourceUrl: rule.sourceUrl!,
      verifiedAt: rule.verifiedAt,
      verificationStatus: rule.verificationStatus,
    },
  };
}

export function calculateEducationalFxFee(
  amount: number,
  percentage: number
): CalculationResult {
  const rule: FxRule = {
    feeId: "educational",
    offeringSlug: "educational",
    offeringName: "Educational example",
    providerName: "",
    label: "Percentage fee",
    calculationBasis: "PERCENTAGE",
    percentage,
    currency: "AUD",
    displayValue: null,
    notes: "Amount × fee percentage ÷ 100",
    sourceUrl: "https://example.invalid",
    verificationStatus: "VERIFIED",
    verifiedAt: new Date().toISOString(),
    reviewDueAt: null,
  };
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100)
    return {
      status: "UNSUPPORTED",
      inputs: [],
      steps: [],
      assumptions: [],
      exclusions: [],
      message: "Enter an FX fee from 0% to 100%.",
    };
  const fee =
    !Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT
      ? null
      : roundCurrency((amount * percentage) / 100);
  if (fee == null)
    return {
      status: "UNSUPPORTED",
      inputs: [],
      steps: [],
      assumptions: [],
      exclusions: [],
      message: "Enter an amount greater than A$0 and no more than A$1 billion.",
    };
  return {
    status: "CALCULATED",
    amount: fee,
    currency: "AUD",
    inputs: [
      { label: "Amount", value: String(amount) },
      { label: "FX fee", value: `${percentage}%` },
    ],
    applicableRule: { label: rule.label, description: rule.notes! },
    steps: [
      {
        label: "Apply the percentage",
        expression: `A$${amount.toLocaleString("en-AU")} × ${percentage}%`,
        result: `A$${fee.toFixed(2)}`,
      },
    ],
    assumptions: ["The percentage entered is applied once to the full amount."],
    exclusions: ["Live exchange rates and other transaction costs."],
  };
}
