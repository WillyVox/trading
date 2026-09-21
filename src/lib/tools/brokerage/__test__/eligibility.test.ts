import assert from "node:assert/strict";
import test from "node:test";
import { FeeCalculationBasis, VerificationStatus } from "@prisma/client";
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
  calculationBasis: FeeCalculationBasis.GREATER_OF,
  flatAmount: 3,
  percentage: 0.01,
  currency: "AUD",
  displayValue: null,
  notes: null,
  sourceUrl: "https://example.com/pricing",
  verificationStatus: VerificationStatus.VERIFIED,
  verifiedAt: "2026-09-19T00:00:00.000Z",
  tiers: [],
};

test("accepts a fresh verified deterministic rule", () => {
  assert.equal(
    brokerageEligibility(base, new Date("2026-09-22T00:00:00Z")).eligible,
    true
  );
});

test("withholds pricing after the review window", () => {
  assert.equal(
    brokerageEligibility(base, new Date("2026-11-10T00:00:00Z")).eligible,
    false
  );
});

test("does not treat conditional FREE pricing as calculator-ready", () => {
  assert.equal(
    brokerageEligibility({
      ...base,
      calculationBasis: FeeCalculationBasis.FREE,
      flatAmount: null,
      percentage: null,
    }).eligible,
    false
  );
});

test("requires a verified source", () => {
  assert.equal(
    brokerageEligibility({ ...base, sourceUrl: null }).eligible,
    false
  );
  assert.equal(
    brokerageEligibility({
      ...base,
      verificationStatus: VerificationStatus.UNVERIFIED,
    }).eligible,
    false
  );
});
