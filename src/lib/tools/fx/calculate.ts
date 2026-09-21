import type { CalculationResult } from "@/lib/tools/types";

const MAX_AMOUNT = 1_000_000_000;
const MAX_PERCENTAGE = 100;

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateEducationalFxFee(
  amount: number,
  percentage: number
): CalculationResult {
  const inputs = [
    {
      label: "Amount",
      value: Number.isFinite(amount) ? String(amount) : "Invalid",
    },
    {
      label: "FX fee",
      value: Number.isFinite(percentage) ? `${percentage}%` : "Invalid",
    },
  ];

  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return {
      status: "UNSUPPORTED",
      inputs,
      steps: [],
      assumptions: [],
      exclusions: [],
      message: "Enter an amount greater than A$0 and no more than A$1 billion.",
    };
  }

  if (
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > MAX_PERCENTAGE
  ) {
    return {
      status: "UNSUPPORTED",
      inputs,
      steps: [],
      assumptions: [],
      exclusions: [],
      message: "Enter an FX fee from 0% to 100%.",
    };
  }

  const fee = roundCurrency(amount * (percentage / 100));

  return {
    status: "CALCULATED",
    amount: fee,
    currency: "AUD",
    inputs,
    applicableRule: {
      label: "Percentage fee",
      description: "Amount × fee percentage ÷ 100",
    },
    steps: [
      {
        label: "Convert the percentage to a decimal",
        expression: `${percentage}% ÷ 100`,
        result: String(percentage / 100),
      },
      {
        label: "Apply the percentage to the amount",
        expression: `A$${amount.toLocaleString("en-AU")} × ${percentage / 100}`,
        result: `A$${fee.toFixed(2)}`,
      },
    ],
    assumptions: [
      "The percentage entered is applied once to the full amount.",
      "This is an educational example using a fee rate you entered, not a provider quote.",
    ],
    exclusions: [
      "The exchange rate and any movement in that rate.",
      "FX spreads or mark-ups not represented by the percentage entered.",
      "Brokerage, market, deposit, withdrawal, tax and other transaction costs.",
      "Minimum, maximum, tiered or conditional provider pricing.",
    ],
  };
}
