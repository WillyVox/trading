import assert from "node:assert/strict";
import test from "node:test";
import { brokerageEligibility } from "../eligibility";
import type { BrokerageRule } from "../types";
const base: BrokerageRule = {
  feeId: "fee",
  offeringSlug: "stake",
  offeringName: "Stake",
  providerName: "Stakeshop Pty Ltd",
  marketCode: "ASX",
  marketName: "Australian Securities Exchange",
  channel: null,
  label: "Australian shares brokerage",
  calculationBasis: "GREATER_OF",
  flatAmount: 3,
  percentage: 0.01,
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
};
const now = new Date("2026-09-22T00:00:00Z");
test("accepts fresh verified deterministic rule", () =>
  assert.equal(brokerageEligibility(base, now).eligible, true));
test("withholds pricing after review window", () =>
  assert.equal(
    brokerageEligibility(base, new Date("2026-11-10T00:00:00Z")).eligible,
    false
  ));
test("rejects invalid or missing verification dates", () => {
  assert.equal(
    brokerageEligibility({ ...base, verifiedAt: null }, now).eligible,
    false
  );
  assert.equal(
    brokerageEligibility({ ...base, verifiedAt: "not-a-date" }, now).eligible,
    false
  );
});
test("rejects stale and unverified status", () => {
  assert.equal(
    brokerageEligibility({ ...base, verificationStatus: "STALE" }, now)
      .eligible,
    false
  );
  assert.equal(
    brokerageEligibility({ ...base, verificationStatus: "UNVERIFIED" }, now)
      .eligible,
    false
  );
});
test("requires HTTPS official evidence", () => {
  assert.equal(
    brokerageEligibility({ ...base, sourceUrl: null }, now).eligible,
    false
  );
  assert.equal(
    brokerageEligibility({ ...base, sourceUrl: "http://example.com" }, now)
      .eligible,
    false
  );
  assert.equal(
    brokerageEligibility({ ...base, sourceUrl: "not-a-url" }, now).eligible,
    false
  );
});
test("does not treat FREE or VARIES as calculator-ready", () => {
  assert.equal(
    brokerageEligibility(
      { ...base, calculationBasis: "FREE", flatAmount: null, percentage: null },
      now
    ).eligible,
    false
  );
  assert.equal(
    brokerageEligibility(
      {
        ...base,
        calculationBasis: "VARIES",
        flatAmount: null,
        percentage: null,
      },
      now
    ).eligible,
    false
  );
});
test("validates required values for flat, percentage and greater-of", () => {
  assert.equal(
    brokerageEligibility(
      { ...base, calculationBasis: "FLAT", flatAmount: null },
      now
    ).eligible,
    false
  );
  assert.equal(
    brokerageEligibility(
      { ...base, calculationBasis: "PERCENTAGE", percentage: null },
      now
    ).eligible,
    false
  );
  assert.equal(
    brokerageEligibility(
      { ...base, calculationBasis: "GREATER_OF", percentage: null },
      now
    ).eligible,
    false
  );
});
test("rejects malformed tiers", () => {
  assert.equal(
    brokerageEligibility(
      {
        ...base,
        calculationBasis: "TIERED",
        flatAmount: null,
        percentage: null,
        tiers: [],
      },
      now
    ).eligible,
    false
  );
  assert.equal(
    brokerageEligibility(
      {
        ...base,
        calculationBasis: "TIERED",
        flatAmount: null,
        percentage: null,
        tiers: [
          { minAmount: 100, maxAmount: 50, flatAmount: 5, percentage: null },
        ],
      },
      now
    ).eligible,
    false
  );
  assert.equal(
    brokerageEligibility(
      {
        ...base,
        calculationBasis: "TIERED",
        flatAmount: null,
        percentage: null,
        tiers: [
          { minAmount: 0, maxAmount: 100, flatAmount: 5, percentage: 0.1 },
        ],
      },
      now
    ).eligible,
    false
  );
});
