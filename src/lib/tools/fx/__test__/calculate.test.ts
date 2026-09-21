import assert from "node:assert/strict";
import test from "node:test";
import { calculateEducationalFxFee } from "../calculate";

test("calculates a percentage FX fee", () => {
  const result = calculateEducationalFxFee(5000, 0.55);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.amount, 27.5);
  assert.equal(result.currency, "AUD");
});

test("rounds currency to cents", () => {
  const result = calculateEducationalFxFee(1234.56, 0.55);
  assert.equal(result.amount, 6.79);
});

test("allows a zero percentage without confusing it with unknown pricing", () => {
  const result = calculateEducationalFxFee(5000, 0);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.amount, 0);
});

test("rejects zero and negative amounts", () => {
  assert.equal(calculateEducationalFxFee(0, 0.55).status, "UNSUPPORTED");
  assert.equal(calculateEducationalFxFee(-1, 0.55).status, "UNSUPPORTED");
});

test("rejects invalid or excessive percentages", () => {
  assert.equal(calculateEducationalFxFee(5000, -0.1).status, "UNSUPPORTED");
  assert.equal(calculateEducationalFxFee(5000, 100.01).status, "UNSUPPORTED");
  assert.equal(
    calculateEducationalFxFee(5000, Number.NaN).status,
    "UNSUPPORTED"
  );
});

test("rejects non-finite and excessive amounts", () => {
  assert.equal(
    calculateEducationalFxFee(Number.POSITIVE_INFINITY, 0.55).status,
    "UNSUPPORTED"
  );
  assert.equal(
    calculateEducationalFxFee(1_000_000_001, 0.55).status,
    "UNSUPPORTED"
  );
});

import { calculateFxFee } from "../calculate";
import type { FxRule } from "../types";

function providerRule(percentage: number): FxRule {
  return {
    feeId: "fee",
    offeringSlug: "provider",
    offeringName: "Provider",
    providerName: "Provider Ltd",
    label: "FX conversion",
    calculationBasis: "PERCENTAGE",
    percentage,
    currency: "AUD",
    displayValue: null,
    notes: "Published percentage FX pricing.",
    sourceUrl: "https://provider.example/pricing",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-22T00:00:00.000Z",
    reviewDueAt: "2026-11-06T00:00:00.000Z",
  };
}

test("calculates CommSec/Stake-style 0.55% pricing", () => {
  assert.equal(calculateFxFee(5000, providerRule(0.55)).amount, 27.5);
});

test("calculates IBKR automated conversion 0.03% pricing", () => {
  assert.equal(calculateFxFee(20000, providerRule(0.03)).amount, 6);
});

test("calculates CMC 0.60% published international-order spread", () => {
  assert.equal(calculateFxFee(5000, providerRule(0.6)).amount, 30);
});
