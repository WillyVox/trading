import "server-only";
import { FeeCategory, OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fxEligibility } from "./eligibility";
import type { FxOfferingOption, FxRule } from "./types";

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
  return fees
    .map((fee) => {
      const rule: FxRule = {
        feeId: fee.id,
        offeringSlug: fee.offering.slug,
        offeringName: fee.offering.name,
        providerName: fee.offering.provider.name,
        label: fee.label,
        calculationBasis:
          fee.calculationBasis === "PERCENTAGE" ? "PERCENTAGE" : "VARIES",
        percentage: fee.percentage == null ? null : Number(fee.percentage),
        currency: fee.currency,
        displayValue: fee.displayValue,
        notes: fee.notes,
        sourceUrl: fee.sourceUrl,
        verificationStatus: mapStatus(fee.verificationStatus),
        verifiedAt: fee.verifiedAt?.toISOString() ?? null,
        reviewDueAt: fee.reviewDueAt?.toISOString() ?? null,
      };
      const check = fxEligibility(rule, now);
      return {
        slug: rule.offeringSlug,
        name: rule.offeringName,
        providerName: rule.providerName,
        rule,
        availability: check.status,
        reason: check.eligible ? undefined : check.reason,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
