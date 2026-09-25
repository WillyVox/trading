import assert from "node:assert/strict";
import test from "node:test";
import { compareRepresentativeAsxBrokerage } from "../compare";
import type { BrokerageOfferingOption, BrokerageRule } from "../types";

function rule(overrides: Partial<BrokerageRule>): BrokerageRule {
  return {
    feeId: "fee",
    offeringSlug: "platform",
    offeringName: "Platform",
    providerName: "Provider",
    marketCode: "ASX",
    marketName: "Australian Securities Exchange",
    channel: null,
    label: "ASX brokerage",
    calculationBasis: "GREATER_OF",
    flatAmount: 3,
    percentage: 0.01,
    currency: "AUD",
    displayValue: null,
    notes: null,
    sourceUrl: "https://example.com/pricing",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-26T00:00:00.000Z",
    reviewDueAt: "2026-11-10T00:00:00.000Z",
    tiers: [],
    pricingPlan: null,
    tradeSide: null,
    firstBuyPerSecurityPerDay: null,
    minTradeAmount: null,
    maxTradeAmount: null,
    maxTradeAmountInclusive: false,
    excludesMarginLoanSettlement: false,
    gstPercent: null,
    ...overrides,
  };
}

function offering(rules: BrokerageRule[]): BrokerageOfferingOption {
  return {
    slug: "platform",
    name: "Platform",
    providerName: "Provider",
    rules,
    availability: "CALCULATABLE",
  };
}

test("compares a greater-of ASX brokerage rule", () => {
  const results = compareRepresentativeAsxBrokerage(
    [offering([rule({})])],
    5000,
    new Date("2026-09-26T12:00:00Z")
  );
  assert.equal(results[0]?.status, "CALCULATED");
  assert.equal(results[0]?.amount, 3);
});

test("does not invent a number for variable pricing", () => {
  const variable = rule({
    calculationBasis: "VARIES",
    flatAmount: null,
    percentage: null,
    displayValue: "Varies by exchange",
  });
  const results = compareRepresentativeAsxBrokerage(
    [offering([variable])],
    5000,
    new Date("2026-09-26T12:00:00Z")
  );
  assert.equal(results[0]?.status, "UNAVAILABLE");
  assert.equal(results[0]?.amount, null);
});

test("applies a first-buy free rule before a generic fallback", () => {
  const free = rule({
    feeId: "free",
    calculationBasis: "FREE",
    flatAmount: null,
    percentage: null,
    label: "First eligible buy",
    firstBuyPerSecurityPerDay: true,
    tradeSide: "BUY",
    maxTradeAmount: 1000,
  });
  const fallback = rule({ feeId: "fallback", flatAmount: 11, percentage: 0.1 });
  const results = compareRepresentativeAsxBrokerage(
    [offering([free, fallback])],
    999,
    new Date("2026-09-26T12:00:00Z")
  );
  assert.equal(results[0]?.amount, 0);
  assert.equal(results[0]?.ruleLabel, "First eligible buy");
});
