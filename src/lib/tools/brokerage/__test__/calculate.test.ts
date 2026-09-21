import assert from "node:assert/strict";
import test from "node:test";
import { FeeCalculationBasis, VerificationStatus } from "@prisma/client";
import { calculateBrokerage } from "../calculate";
import type { BrokerageRule } from "../types";

function rule(overrides: Partial<BrokerageRule>): BrokerageRule {
  return {
    feeId: "fee",
    offeringSlug: "test",
    offeringName: "Test",
    providerName: "Test Provider",
    marketCode: "ASX",
    marketName: "Australian Securities Exchange",
    channel: null,
    label: "Brokerage",
    calculationBasis: FeeCalculationBasis.FLAT,
    flatAmount: 3,
    percentage: null,
    currency: "AUD",
    displayValue: null,
    notes: null,
    sourceUrl: "https://example.com/pricing",
    verificationStatus: VerificationStatus.VERIFIED,
    verifiedAt: "2026-09-19T00:00:00.000Z",
    tiers: [],
    ...overrides,
  };
}

test("calculates greater-of pricing", () => {
  const r = rule({
    calculationBasis: FeeCalculationBasis.GREATER_OF,
    flatAmount: 3,
    percentage: 0.01,
  });
  assert.equal(calculateBrokerage(r, 20_000).amount, 3);
  assert.equal(calculateBrokerage(r, 40_000).amount, 4);
});

test("respects shared inclusive tier boundaries", () => {
  const r = rule({
    calculationBasis: FeeCalculationBasis.TIERED,
    flatAmount: null,
    tiers: [
      { minAmount: 0, maxAmount: 1000, flatAmount: 5, percentage: null },
      { minAmount: 1000, maxAmount: 3000, flatAmount: 10, percentage: null },
    ],
  });
  assert.equal(calculateBrokerage(r, 1000).amount, 5);
  assert.equal(calculateBrokerage(r, 1000.01).amount, 10);
});

test("respects cent-separated inclusive lower boundary", () => {
  const r = rule({
    calculationBasis: FeeCalculationBasis.TIERED,
    flatAmount: null,
    tiers: [
      { minAmount: 0, maxAmount: 9999.99, flatAmount: 29.95, percentage: null },
      { minAmount: 10000, maxAmount: null, flatAmount: null, percentage: 0.31 },
    ],
  });
  assert.equal(calculateBrokerage(r, 10000).amount, 31);
});

test("does not invent a result for unsupported variable pricing", () => {
  const r = rule({
    calculationBasis: FeeCalculationBasis.VARIES,
    flatAmount: null,
  });
  assert.equal(calculateBrokerage(r, 5000).status, "UNSUPPORTED");
});

test("rejects non-positive trade values", () => {
  assert.equal(calculateBrokerage(rule({}), 0).status, "UNSUPPORTED");
});
