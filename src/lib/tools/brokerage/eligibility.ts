import type { BrokerageRule } from "./types";

export const BROKERAGE_REVIEW_WINDOW_DAYS = 45;

function isHttpsUrl(value: string | null): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function hasValidTier(rule: BrokerageRule) {
  return (
    rule.tiers.length > 0 &&
    rule.tiers.every((tier) => {
      const hasExactlyOnePrice =
        (tier.flatAmount != null) !== (tier.percentage != null);
      return (
        tier.minAmount >= 0 &&
        (tier.maxAmount == null || tier.maxAmount >= tier.minAmount) &&
        hasExactlyOnePrice
      );
    })
  );
}

export function brokerageEligibility(rule: BrokerageRule, now = new Date()) {
  if (rule.verificationStatus !== "VERIFIED" || !rule.verifiedAt) {
    return {
      eligible: false,
      reason: "Pricing is not currently verified.",
    } as const;
  }
  if (rule.reviewDueAt) {
    const reviewDueAt = new Date(rule.reviewDueAt);
    if (
      !Number.isFinite(reviewDueAt.getTime()) ||
      reviewDueAt.getTime() < now.getTime()
    ) {
      return {
        eligible: false,
        reason: "Pricing is due for verification review.",
      } as const;
    }
  }
  const verifiedAt = new Date(rule.verifiedAt);
  if (!Number.isFinite(verifiedAt.getTime())) {
    return {
      eligible: false,
      reason: "Pricing has no valid verification date.",
    } as const;
  }
  const ageMs = now.getTime() - verifiedAt.getTime();
  if (ageMs > BROKERAGE_REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000) {
    return {
      eligible: false,
      reason: "Pricing is due for review before it is used in a calculation.",
    } as const;
  }
  if (!isHttpsUrl(rule.sourceUrl)) {
    return {
      eligible: false,
      reason: "Pricing has no valid HTTPS evidence source.",
    } as const;
  }
  switch (rule.calculationBasis) {
    case "FLAT":
      return rule.flatAmount != null
        ? ({ eligible: true } as const)
        : ({ eligible: false, reason: "The flat amount is missing." } as const);
    case "PERCENTAGE":
      return rule.percentage != null
        ? ({ eligible: true } as const)
        : ({ eligible: false, reason: "The percentage is missing." } as const);
    case "GREATER_OF":
      return rule.flatAmount != null && rule.percentage != null
        ? ({ eligible: true } as const)
        : ({
            eligible: false,
            reason: "The minimum or percentage is missing.",
          } as const);
    case "TIERED":
      return hasValidTier(rule)
        ? ({ eligible: true } as const)
        : ({
            eligible: false,
            reason: "The published tiers are incomplete or invalid.",
          } as const);
    case "FREE":
      return { eligible: true } as const;
    case "VARIES":
      return {
        eligible: false,
        reason: "Variable pricing cannot be calculated from trade value alone.",
      } as const;
  }
}
