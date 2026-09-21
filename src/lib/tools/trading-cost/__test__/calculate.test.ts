import assert from "node:assert/strict";
import test from "node:test";
import { combineTradingCosts } from "../calculate";

test("combines calculated costs when currencies match", () => {
  const result = combineTradingCosts(
    {
      status: "CALCULATED",
      amount: 17.6,
      currency: "AUD",
      ruleLabel: "Fixed",
      explanation: "",
    },
    {
      status: "CALCULATED",
      amount: 60,
      currency: "AUD",
      inputs: [],
      steps: [],
      assumptions: [],
      exclusions: [],
    }
  );
  assert.equal(result.canTotal, true);
  assert.equal(result.totalAmount, 77.6);
  assert.equal(result.totalCurrency, "AUD");
});

test("does not add unlike currencies", () => {
  const result = combineTradingCosts(
    {
      status: "CALCULATED",
      amount: 5,
      currency: "USD",
      ruleLabel: "US brokerage",
      explanation: "",
    },
    {
      status: "CALCULATED",
      amount: 55,
      currency: "AUD",
      inputs: [],
      steps: [],
      assumptions: [],
      exclusions: [],
    }
  );
  assert.equal(result.canTotal, false);
  assert.match(result.message ?? "", /does not invent an exchange rate/);
});

test("does not present a combined total when a component is unavailable", () => {
  const result = combineTradingCosts(
    {
      status: "CALCULATED",
      amount: 3,
      currency: "AUD",
      ruleLabel: "Brokerage",
      explanation: "",
    },
    null
  );
  assert.equal(result.canTotal, false);
  assert.equal(result.totalAmount, undefined);
});
