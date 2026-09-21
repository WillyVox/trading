import assert from "node:assert/strict";
import test from "node:test";
import { combineCryptoCosts } from "../calculate";
import type { CryptoFeeCalculation } from "../../crypto-fees/types";

const calculated = (
  amount: number,
  currency = "AUD"
): CryptoFeeCalculation => ({
  status: "CALCULATED",
  amount,
  currency,
  explanation: "test",
});

test("adds calculator-ready crypto costs in the same currency", () => {
  const result = combineCryptoCosts([
    { label: "Deposit", calculation: calculated(5) },
    { label: "Trading", calculation: calculated(10) },
  ]);
  assert.equal(result.canTotal, true);
  assert.equal(result.totalAmount, 15);
  assert.equal(result.totalCurrency, "AUD");
});

test("does not combine AUD and crypto-unit fees", () => {
  const result = combineCryptoCosts([
    { label: "Trading", calculation: calculated(10, "AUD") },
    { label: "Withdrawal", calculation: calculated(0.0001, "BTC") },
  ]);
  assert.equal(result.canTotal, false);
  assert.match(result.message ?? "", /different currencies/i);
});

test("does not total when a selected component is variable", () => {
  const result = combineCryptoCosts([
    { label: "Trading", calculation: calculated(10) },
    {
      label: "Withdrawal",
      calculation: { status: "VARIABLE", explanation: "network" },
    },
  ]);
  assert.equal(result.canTotal, false);
  assert.match(result.message ?? "", /variable/i);
});
