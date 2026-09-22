import { fxEligibility } from "./eligibility";
import type { FxAvailability, FxRule } from "./types";

const AVAILABILITY_RANK: Record<FxAvailability, number> = {
  CALCULATABLE: 0,
  VARIABLE: 1,
  STALE: 2,
  UNAVAILABLE: 3,
};

export function preferredFxRule(rules: FxRule[], now = new Date()) {
  return [...rules].sort((a, b) => {
    const byStatus =
      AVAILABILITY_RANK[fxEligibility(a, now).status] -
      AVAILABILITY_RANK[fxEligibility(b, now).status];
    return byStatus || a.label.localeCompare(b.label);
  })[0];
}

/**
 * Choose an FX rule for a known market without guessing across scenarios.
 * A market-specific rule wins. A generic rule is only used when there is no
 * market-specific rule. If several remain, prefer calculator-ready evidence.
 */
export function selectFxRuleForMarket(
  rules: FxRule[],
  marketCode: string,
  now = new Date()
) {
  const exact = rules.filter((rule) => rule.marketCode === marketCode);
  if (exact.length > 0) return preferredFxRule(exact, now);
  return preferredFxRule(
    rules.filter((rule) => rule.marketCode == null),
    now
  );
}
