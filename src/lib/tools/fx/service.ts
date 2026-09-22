import "server-only";
import { FeeCategory, OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fxEligibility } from "./eligibility";
import type { FxOfferingOption, FxRule } from "./types";
import { preferredFxRule } from "./selection";

function mapStatus(value: string): FxRule["verificationStatus"] {
  return value === "VERIFIED"
    ? "VERIFIED"
    : value === "STALE"
      ? "STALE"
      : "UNVERIFIED";
}

export async function getFxOfferings(): Promise<FxOfferingOption[]> {
  const fees = await prisma.offeringFee.findMany({
    where: {
      feeCategory: FeeCategory.FX_CONVERSION,
      isPromotional: false,
      offering: { active: true, offeringType: OfferingType.SHARE_TRADING },
    },
    include: {
      offering: { include: { provider: { select: { name: true } } } },
    },
    orderBy: { label: "asc" },
  });

  const now = new Date();
  const grouped = new Map<string, FxOfferingOption>();

  for (const fee of fees) {
    const calculationBasis: FxRule["calculationBasis"] =
      fee.calculationBasis === "PERCENTAGE"
        ? "PERCENTAGE"
        : fee.calculationBasis === "FREE"
          ? "FREE"
          : "VARIES";

    const rule: FxRule = {
      feeId: fee.id,
      offeringSlug: fee.offering.slug,
      offeringName: fee.offering.name,
      providerName: fee.offering.provider.name,
      marketCode: fee.marketCode,
      label: fee.label,
      calculationBasis,
      percentage: fee.percentage == null ? null : Number(fee.percentage),
      currency: fee.currency,
      displayValue: fee.displayValue,
      notes: fee.notes,
      sourceUrl: fee.sourceUrl,
      verificationStatus: mapStatus(fee.verificationStatus),
      verifiedAt: fee.verifiedAt?.toISOString() ?? null,
      reviewDueAt: fee.reviewDueAt?.toISOString() ?? null,
    };

    const existing = grouped.get(rule.offeringSlug);
    if (existing) {
      existing.rules.push(rule);
    } else {
      grouped.set(rule.offeringSlug, {
        slug: rule.offeringSlug,
        name: rule.offeringName,
        providerName: rule.providerName,
        rules: [rule],
        availability: "UNAVAILABLE",
      });
    }
  }

  return Array.from(grouped.values())
    .map((offering) => {
      const preferred = preferredFxRule(offering.rules, now);
      const check = preferred
        ? fxEligibility(preferred, now)
        : {
            status: "UNAVAILABLE" as const,
            eligible: false,
            reason: "No FX pricing rule is available.",
          };
      return {
        ...offering,
        availability: check.status,
        reason: check.eligible ? undefined : check.reason,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
