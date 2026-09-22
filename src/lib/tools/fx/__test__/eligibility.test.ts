import assert from "node:assert/strict";
import test from "node:test";

import { fxEligibility } from "../eligibility";
import type { FxRule } from "../types";

const NOW = new Date("2026-09-22T00:00:00.000Z");

function rule(overrides: Partial<FxRule> = {}): FxRule {
  return {
    feeId: "fee",
    offeringSlug: "provider",
    offeringName: "Provider",
    providerName: "Provider Ltd",
    marketCode: null,
    label: "FX conversion",
    calculationBasis: "PERCENTAGE",
    percentage: 0.55,
    currency: "AUD",
    displayValue: null,
    notes: "Published FX pricing.",
    sourceUrl: "https://provider.example/pricing",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-20T00:00:00.000Z",
    reviewDueAt: "2026-11-06T00:00:00.000Z",
    ...overrides,
  };
}

test("accepts verified percentage pricing with an HTTPS source inside its review window", () => {
  const result = fxEligibility(rule(), NOW);
  assert.equal(result.eligible, true);
  assert.equal(result.status, "CALCULATABLE");
});

test("rejects unverified pricing", () => {
  const result = fxEligibility(rule({ verificationStatus: "UNVERIFIED" }), NOW);
  assert.equal(result.eligible, false);
  assert.equal(result.status, "UNAVAILABLE");
});

test("rejects pricing without an official HTTPS source", () => {
  const result = fxEligibility(rule({ sourceUrl: "http://example.com" }), NOW);
  assert.equal(result.eligible, false);
  assert.equal(result.status, "UNAVAILABLE");
});

test("rejects pricing without a verification date", () => {
  const result = fxEligibility(rule({ verifiedAt: null }), NOW);
  assert.equal(result.eligible, false);
  assert.equal(result.status, "UNAVAILABLE");
});

test("marks pricing stale after its review due date", () => {
  const result = fxEligibility(
    rule({ reviewDueAt: "2026-09-21T23:59:59.000Z" }),
    NOW
  );
  assert.equal(result.eligible, false);
  assert.equal(result.status, "STALE");
});

test("keeps variable pricing visible without making it calculatable", () => {
  const result = fxEligibility(
    rule({
      calculationBasis: "VARIES",
      percentage: null,
      displayValue: "Variable FX pricing",
    }),
    NOW
  );
  assert.equal(result.eligible, false);
  assert.equal(result.status, "VARIABLE");
  assert.equal(result.reason, "Variable FX pricing");
});

test("accepts a verified FREE FX scenario as calculatable", () => {
  const result = fxEligibility(
    rule({
      calculationBasis: "FREE",
      percentage: null,
      displayValue: "0% FX fee",
    }),
    NOW
  );
  assert.equal(result.eligible, true);
  assert.equal(result.status, "CALCULATABLE");
});
