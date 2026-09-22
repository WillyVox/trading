import assert from "node:assert/strict";
import test from "node:test";
import { selectFxRuleForMarket } from "../selection";
import type { FxRule } from "../types";

function rule(overrides: Partial<FxRule>): FxRule {
  return {
    feeId: "fee",
    offeringSlug: "etoro",
    offeringName: "eToro Share Trading",
    providerName: "eToro AUS Capital Limited",
    marketCode: null,
    label: "Other currency conversion scenarios",
    calculationBasis: "VARIES",
    percentage: null,
    currency: null,
    displayValue: "Varies",
    notes: null,
    sourceUrl: "https://example.com/fees",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-09-22T00:00:00.000Z",
    reviewDueAt: "2026-11-06T00:00:00.000Z",
    ...overrides,
  };
}

test("market-specific FX pricing wins over a generic rule", () => {
  const generic = rule({ feeId: "generic" });
  const asx = rule({
    feeId: "asx",
    marketCode: "ASX",
    label: "AUD account to Australian stocks",
    calculationBasis: "FREE",
    displayValue: "0% FX fee",
  });
  assert.equal(selectFxRuleForMarket([generic, asx], "ASX")?.feeId, "asx");
});

test("generic FX pricing is used when no market-specific rule exists", () => {
  const generic = rule({ feeId: "generic" });
  const asx = rule({
    feeId: "asx",
    marketCode: "ASX",
    calculationBasis: "FREE",
  });
  assert.equal(selectFxRuleForMarket([generic, asx], "NYSE")?.feeId, "generic");
});
