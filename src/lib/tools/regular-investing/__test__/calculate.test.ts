import assert from "node:assert/strict";
import test from "node:test";
import { calculateRegularInvesting, contributionCount } from "../calculate";
import type { BrokerageRule } from "../../brokerage/types";

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
    verifiedAt: "2026-09-22T00:00:00.000Z",
    reviewDueAt: "2026-11-06T00:00:00.000Z",
    tiers: [],
    pricingPlan: null,
    tradeSide: "BUY",
    firstBuyPerSecurityPerDay: null,
    minTradeAmount: null,
    maxTradeAmount: null,
    maxTradeAmountInclusive: true,
    excludesMarginLoanSettlement: false,
    gstPercent: null,
    ...overrides,
  };
}

test("maps regular frequencies to deterministic annual contribution counts", () => {
  assert.equal(contributionCount("MONTHLY", 1), 12);
  assert.equal(contributionCount("FORTNIGHTLY", 1), 26);
  assert.equal(contributionCount("WEEKLY", 1), 52);
  assert.equal(contributionCount("MONTHLY", 5), 60);
});

test("calculates A$500 monthly for one year with A$3 brokerage", () => {
  const result = calculateRegularInvesting(rule(), {
    contributionAmount: 500,
    frequency: "MONTHLY",
    years: 1,
  });
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.contributionCount, 12);
  assert.equal(result.totalContributions, 6000);
  assert.equal(result.brokeragePerContribution, 3);
  assert.equal(result.totalBrokerage, 36);
  assert.equal(result.effectiveBrokeragePercent, 0.6);
});

test("repeats a percentage rule and rounds currency outputs", () => {
  const result = calculateRegularInvesting(
    rule({
      calculationBasis: "PERCENTAGE",
      flatAmount: null,
      percentage: 0.12,
    }),
    { contributionAmount: 25000, frequency: "MONTHLY", years: 1 }
  );
  assert.equal(result.brokeragePerContribution, 30);
  assert.equal(result.totalBrokerage, 360);
});

test("propagates stale and unverified pricing instead of estimating", () => {
  assert.equal(
    calculateRegularInvesting(rule({ verificationStatus: "STALE" }), {
      contributionAmount: 500,
      frequency: "MONTHLY",
      years: 1,
    }).status,
    "STALE"
  );
  assert.equal(
    calculateRegularInvesting(rule({ verificationStatus: "UNVERIFIED" }), {
      contributionAmount: 500,
      frequency: "MONTHLY",
      years: 1,
    }).status,
    "UNKNOWN"
  );
});

test("rejects invalid contribution amounts and periods", () => {
  assert.equal(
    calculateRegularInvesting(rule(), {
      contributionAmount: 0,
      frequency: "MONTHLY",
      years: 1,
    }).status,
    "UNSUPPORTED"
  );
  assert.equal(
    calculateRegularInvesting(rule(), {
      contributionAmount: 500,
      frequency: "MONTHLY",
      years: 1.5,
    }).status,
    "UNSUPPORTED"
  );
});
