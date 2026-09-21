import type { BrokerageCalculation } from "@/lib/tools/brokerage/types";
import type { CalculationResult } from "@/lib/tools/types";
import type { TradingCostResult } from "./types";

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function combineTradingCosts(
  brokerage: BrokerageCalculation | null,
  fx: CalculationResult | null
): TradingCostResult {
  const brokerageCalculated =
    brokerage?.status === "CALCULATED" && brokerage.amount != null;
  const fxCalculated = fx?.status === "CALCULATED" && fx.amount != null;
  if (!brokerageCalculated && !fxCalculated) {
    return {
      brokerage,
      fx,
      canTotal: false,
      message:
        "No calculator-ready cost components are available for this scenario.",
    };
  }
  if (brokerageCalculated && fxCalculated) {
    const brokerageCurrency = brokerage.currency ?? "AUD";
    const fxCurrency = fx.currency ?? "AUD";
    if (brokerageCurrency === fxCurrency) {
      return {
        brokerage,
        fx,
        canTotal: true,
        totalAmount: roundCurrency(brokerage.amount! + fx.amount!),
        totalCurrency: brokerageCurrency,
      };
    }
    return {
      brokerage,
      fx,
      canTotal: false,
      message: `Brokerage is ${brokerageCurrency} while the FX estimate is ${fxCurrency}. Trading Guide does not invent an exchange rate to combine different currencies.`,
    };
  }
  return {
    brokerage,
    fx,
    canTotal: false,
    message:
      "Only one cost component is calculator-ready, so no combined total is shown.",
  };
}
