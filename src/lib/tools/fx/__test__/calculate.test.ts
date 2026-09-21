import assert from "node:assert/strict";
import test from "node:test";

import { calculateEducationalFxFee, calculateFxFee } from "../calculate";
import type { FxRule } from "../types";

function providerRule(
  percentage: number | null,
  overrides: Partial<FxRule> = {}
): FxRule {
  return {
    feeId: "fee",
    offeringSlug: "provider",
    offeringName: "Provider",
    providerName: "Provider Ltd",
    label: "FX conversion",
    calculationBasis: percentage == null ? "VARIES" : "PERCENTAGE",
    percentage,
    currency: "AUD",
    displayValue: null,
    notes: "Published percentage FX pricing.",
    sourceUrl: "https://provider.example/pricing",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-22T00:00:00.000Z",
    reviewDueAt: "2026-11-06T00:00:00.000Z",
    ...overrides,
  };
}

test("calculates a percentage FX fee", () => {
  const result = calculateEducationalFxFee(5000, 0.55);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.amount, 27.5);
  assert.equal(result.currency, "AUD");
});

test("rounds FX currency results to cents", () => {
  assert.equal(calculateEducationalFxFee(1234.56, 0.55).amount, 6.79);
  assert.equal(calculateFxFee(1234.56, providerRule(0.55)).amount, 6.79);
});

test("allows a zero percentage without confusing it with unknown pricing", () => {
  const result = calculateEducationalFxFee(5000, 0);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.amount, 0);
});

test("rejects zero, negative, non-finite and excessive amounts", () => {
  for (const amount of [
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    1_000_000_001,
  ]) {
    assert.equal(
      calculateFxFee(amount, providerRule(0.55)).status,
      "UNSUPPORTED"
    );
  }
});

test("rejects invalid or excessive educational percentages", () => {
  assert.equal(calculateEducationalFxFee(5000, -0.1).status, "UNSUPPORTED");
  assert.equal(calculateEducationalFxFee(5000, 100.01).status, "UNSUPPORTED");
  assert.equal(
    calculateEducationalFxFee(5000, Number.NaN).status,
    "UNSUPPORTED"
  );
});

test("calculates representative CommSec/Stake-style 0.55% pricing", () => {
  assert.equal(calculateFxFee(1, providerRule(0.55)).amount, 0.01);
  assert.equal(calculateFxFee(1000, providerRule(0.55)).amount, 5.5);
  assert.equal(calculateFxFee(5000, providerRule(0.55)).amount, 27.5);
  assert.equal(calculateFxFee(20000, providerRule(0.55)).amount, 110);
});

test("calculates representative IBKR automated conversion 0.03% pricing", () => {
  assert.equal(calculateFxFee(1000, providerRule(0.03)).amount, 0.3);
  assert.equal(calculateFxFee(20000, providerRule(0.03)).amount, 6);
});

test("calculates representative CMC 0.60% published international-order spread", () => {
  assert.equal(calculateFxFee(1000, providerRule(0.6)).amount, 6);
  assert.equal(calculateFxFee(5000, providerRule(0.6)).amount, 30);
});

test("does not calculate variable pricing as zero", () => {
  const result = calculateFxFee(
    5000,
    providerRule(null, { displayValue: "Variable FX pricing" })
  );
  assert.equal(result.status, "VARIABLE");
  assert.equal(result.amount, undefined);
});

test("does not calculate stale or unverified pricing", () => {
  assert.equal(
    calculateFxFee(5000, providerRule(0.55, { verificationStatus: "STALE" }))
      .status,
    "UNSUPPORTED"
  );
  assert.equal(
    calculateFxFee(
      5000,
      providerRule(0.55, { verificationStatus: "UNVERIFIED" })
    ).status,
    "UNSUPPORTED"
  );
});
