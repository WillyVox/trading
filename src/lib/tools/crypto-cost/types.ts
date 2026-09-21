import type { CryptoFeeCalculation } from "@/lib/tools/crypto-fees/types";

export type CryptoCostComponent = {
  label: string;
  calculation: CryptoFeeCalculation | null;
};

export type CryptoCostScenarioResult = {
  components: CryptoCostComponent[];
  canTotal: boolean;
  totalAmount?: number;
  totalCurrency?: string;
  message?: string;
};
