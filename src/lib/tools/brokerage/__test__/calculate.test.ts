import assert from "node:assert/strict";
import test from "node:test";
import { calculateBrokerage } from "../calculate";
import type { BrokerageRule } from "../types";

function rule(overrides: Partial<BrokerageRule> = {}): BrokerageRule {
  return {
    feeId: "fee",
    offeringSlug: "test",
    offeringName: "Test",
    providerName: "Test Provider",
    marketCode: "ASX",
    marketName: "Australian Securities Exchange",
    channel: null,
    label: "Brokerage",
    calculationBasis: "FLAT",
    flatAmount: 3,
    percentage: null,
    currency: "AUD",
    displayValue: null,
    notes: null,
    sourceUrl: "https://example.com/pricing",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-19T00:00:00.000Z",
    tiers: [],
    pricingPlan: null,
    tradeSide: null,
    firstBuyPerSecurityPerDay: null,
    minTradeAmount: null,
    maxTradeAmount: null,
    maxTradeAmountInclusive: true,
    excludesMarginLoanSettlement: false,
    gstPercent: null,
    ...overrides,
  };
}

test("calculates flat pricing", () =>
  assert.equal(
    calculateBrokerage(rule({ flatAmount: 7.5 }), 2000).amount,
    7.5
  ));
test("calculates percentage pricing", () =>
  assert.equal(
    calculateBrokerage(
      rule({
        calculationBasis: "PERCENTAGE",
        flatAmount: null,
        percentage: 0.12,
      }),
      25000
    ).amount,
    30
  ));
test("calculates greater-of pricing on both sides of threshold", () => {
  const r = rule({
    calculationBasis: "GREATER_OF",
    flatAmount: 3,
    percentage: 0.01,
  });
  assert.equal(calculateBrokerage(r, 20000).amount, 3);
  assert.equal(calculateBrokerage(r, 40000).amount, 4);
});
test("respects shared inclusive tier boundaries one cent below, at and above", () => {
  const r = rule({
    calculationBasis: "TIERED",
    flatAmount: null,
    tiers: [
      { minAmount: 0, maxAmount: 1000, flatAmount: 5, percentage: null },
      { minAmount: 1000, maxAmount: 3000, flatAmount: 10, percentage: null },
    ],
  });
  assert.equal(calculateBrokerage(r, 999.99).amount, 5);
  assert.equal(calculateBrokerage(r, 1000).amount, 5);
  assert.equal(calculateBrokerage(r, 1000.01).amount, 10);
});
test("respects cent-separated inclusive lower boundary", () => {
  const r = rule({
    calculationBasis: "TIERED",
    flatAmount: null,
    tiers: [
      { minAmount: 0, maxAmount: 9999.99, flatAmount: 29.95, percentage: null },
      { minAmount: 10000, maxAmount: null, flatAmount: null, percentage: 0.31 },
    ],
  });
  assert.equal(calculateBrokerage(r, 9999.99).amount, 29.95);
  assert.equal(calculateBrokerage(r, 10000).amount, 31);
  assert.equal(calculateBrokerage(r, 10000.01).amount, 31.000031);
});
test("returns unsupported when required structured values are missing", () => {
  assert.equal(
    calculateBrokerage(rule({ flatAmount: null }), 1000).status,
    "UNSUPPORTED"
  );
  assert.equal(
    calculateBrokerage(
      rule({
        calculationBasis: "PERCENTAGE",
        flatAmount: null,
        percentage: null,
      }),
      1000
    ).status,
    "UNSUPPORTED"
  );
  assert.equal(
    calculateBrokerage(
      rule({ calculationBasis: "TIERED", flatAmount: null, tiers: [] }),
      1000
    ).status,
    "UNSUPPORTED"
  );
});
test("calculates verified FREE rules as zero and keeps VARIES non-numeric", () => {
  assert.equal(
    calculateBrokerage(
      rule({ calculationBasis: "FREE", flatAmount: null }),
      5000
    ).amount,
    0
  );
  assert.equal(
    calculateBrokerage(
      rule({ calculationBasis: "VARIES", flatAmount: null }),
      5000
    ).status,
    "VARIABLE"
  );
});
test("rejects invalid and non-positive trade values", () => {
  for (const amount of [0, -1, Number.NaN, Number.POSITIVE_INFINITY])
    assert.equal(calculateBrokerage(rule(), amount).status, "UNSUPPORTED");
  assert.equal(calculateBrokerage(rule(), 0.01).status, "CALCULATED");
});
test("preserves calculation precision and leaves display rounding to UI", () => {
  const r = rule({
    calculationBasis: "PERCENTAGE",
    flatAmount: null,
    percentage: 0.31,
  });
  assert.equal(calculateBrokerage(r, 10000.01).amount, 31.000031);
});
// Representative verified seed rules: these lock the engine semantics to the published structures seeded by Trading Guide.
test("Stake ASX representative rule: greater of A$3 or 0.01%", () => {
  const r = rule({
    offeringSlug: "stake",
    calculationBasis: "GREATER_OF",
    flatAmount: 3,
    percentage: 0.01,
  });
  assert.equal(calculateBrokerage(r, 30000).amount, 3);
  assert.equal(calculateBrokerage(r, 30000.01).amount, 3.000001);
});
test("CommSec ASX standard settlement representative tiers", () => {
  const r = rule({
    offeringSlug: "commsec",
    calculationBasis: "TIERED",
    flatAmount: null,
    tiers: [
      { minAmount: 0, maxAmount: 1000, flatAmount: 5, percentage: null },
      { minAmount: 1000, maxAmount: 3000, flatAmount: 10, percentage: null },
      {
        minAmount: 3000,
        maxAmount: 10000,
        flatAmount: 19.95,
        percentage: null,
      },
      {
        minAmount: 10000,
        maxAmount: 25000,
        flatAmount: 29.95,
        percentage: null,
      },
      { minAmount: 25000, maxAmount: null, flatAmount: null, percentage: 0.12 },
    ],
  });
  assert.equal(calculateBrokerage(r, 1000).amount, 5);
  assert.equal(calculateBrokerage(r, 1000.01).amount, 10);
  assert.equal(calculateBrokerage(r, 25000).amount, 29.95);
  assert.equal(calculateBrokerage(r, 25000.01).amount, 30.000012);
});
test("CommSec US representative rule: greater of US$5 or 0.12%", () => {
  const r = rule({
    marketCode: "NASDAQ",
    currency: "USD",
    calculationBasis: "GREATER_OF",
    flatAmount: 5,
    percentage: 0.12,
  });
  assert.equal(calculateBrokerage(r, 1000).amount, 5);
  assert.equal(calculateBrokerage(r, 5000).amount, 6);
});
test("surfaces stale and unverified rules instead of calculating them", () => {
  assert.equal(
    calculateBrokerage(rule({ verificationStatus: "STALE" }), 1000).status,
    "STALE"
  );
  assert.equal(
    calculateBrokerage(rule({ verificationStatus: "UNVERIFIED" }), 1000).status,
    "UNKNOWN"
  );
});

test("CMC conditional free-buy scenario selects free only when conditions match", async () => {
  const { selectBrokerageRule } = await import("../calculate");
  const free = rule({
    feeId: "free",
    offeringSlug: "cmc-invest",
    calculationBasis: "FREE",
    flatAmount: null,
    tradeSide: "BUY",
    firstBuyPerSecurityPerDay: true,
    maxTradeAmount: 1000,
    maxTradeAmountInclusive: false,
    excludesMarginLoanSettlement: true,
  });
  const fallback = rule({
    feeId: "paid",
    offeringSlug: "cmc-invest",
    calculationBasis: "GREATER_OF",
    flatAmount: 11,
    percentage: 0.1,
    tradeSide: "BUY",
  });
  assert.equal(
    selectBrokerageRule([free, fallback], {
      tradeAmount: 500,
      tradeSide: "BUY",
      firstBuyPerSecurityPerDay: true,
      marginLoanSettlement: false,
    })?.feeId,
    "free"
  );
  assert.equal(
    selectBrokerageRule([free, fallback], {
      tradeAmount: 1000,
      tradeSide: "BUY",
      firstBuyPerSecurityPerDay: true,
      marginLoanSettlement: false,
    })?.feeId,
    "paid"
  );
  assert.equal(
    selectBrokerageRule([free, fallback], {
      tradeAmount: 500,
      tradeSide: "BUY",
      firstBuyPerSecurityPerDay: true,
      marginLoanSettlement: true,
    })?.feeId,
    "paid"
  );
});

test("IBKR Fixed ASX estimate applies the published minimum and GST", () => {
  const r = rule({
    offeringSlug: "interactive-brokers-australia",
    calculationBasis: "GREATER_OF",
    flatAmount: 6,
    percentage: 0.08,
    gstPercent: 10,
  });
  assert.equal(calculateBrokerage(r, 2000).amount, 6.6);
  assert.equal(calculateBrokerage(r, 20000).amount, 17.6);
});
