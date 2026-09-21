import type { FxRule } from "./types";

export function fxEligibility(rule: FxRule, now: Date) {
  if (rule.verificationStatus !== "VERIFIED")
    return {
      eligible: false,
      status: "UNAVAILABLE" as const,
      reason: "This FX pricing has not been verified.",
    };
  if (!rule.sourceUrl?.startsWith("https://"))
    return {
      eligible: false,
      status: "UNAVAILABLE" as const,
      reason: "An official HTTPS pricing source is required.",
    };
  if (!rule.verifiedAt)
    return {
      eligible: false,
      status: "UNAVAILABLE" as const,
      reason: "The pricing does not have a verification date.",
    };
  if (rule.reviewDueAt && new Date(rule.reviewDueAt) < now)
    return {
      eligible: false,
      status: "STALE" as const,
      reason: "This FX pricing is due for reverification.",
    };
  if (rule.calculationBasis === "VARIES")
    return {
      eligible: false,
      status: "VARIABLE" as const,
      reason:
        rule.displayValue ?? "The provider publishes variable FX pricing.",
    };
  if (rule.calculationBasis !== "PERCENTAGE" || rule.percentage == null)
    return {
      eligible: false,
      status: "UNAVAILABLE" as const,
      reason:
        "This FX pricing cannot be represented safely by the current calculator.",
    };
  return { eligible: true, status: "CALCULATABLE" as const };
}
