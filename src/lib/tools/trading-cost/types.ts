import type { BrokerageCalculation } from "@/lib/tools/brokerage/types";
import type { CalculationResult } from "@/lib/tools/types";

export type TradingCostResult = {
  brokerage: BrokerageCalculation | null;
  fx: CalculationResult | null;
  totalAmount?: number;
  totalCurrency?: string;
  canTotal: boolean;
  message?: string;
};
