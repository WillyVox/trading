import "server-only";
import { FeeCategory, OfferingType, VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { BrokerageRule } from "./types";
import { brokerageEligibility } from "./eligibility";

export async function getBrokerageRules(): Promise<BrokerageRule[]> {
  const fees = await prisma.offeringFee.findMany({
    where: {
      feeCategory: FeeCategory.BROKERAGE,
      isPromotional: false,
      verificationStatus: VerificationStatus.VERIFIED,
      offering: { active: true, offeringType: OfferingType.SHARE_TRADING },
      marketId: { not: null },
    },
    include: {
      market: true,
      offering: { include: { provider: { select: { name: true } } } },
      tiers: { orderBy: { position: "asc" } },
    },
    orderBy: { label: "asc" },
  });

  const rules = fees.flatMap((fee): BrokerageRule[] => {
    if (!fee.market) return [];
    return [
      {
        feeId: fee.id,
        offeringSlug: fee.offering.slug,
        offeringName: fee.offering.name,
        providerName: fee.offering.provider.name,
        marketCode: fee.market.code,
        marketName: fee.market.name,
        channel: fee.channel as BrokerageRule["channel"],
        label: fee.label,
        calculationBasis: fee.calculationBasis as BrokerageRule["calculationBasis"],
        flatAmount: fee.flatAmount == null ? null : Number(fee.flatAmount),
        percentage: fee.percentage == null ? null : Number(fee.percentage),
        currency: fee.currency,
        displayValue: fee.displayValue,
        notes: fee.notes,
        sourceUrl: fee.sourceUrl,
        verificationStatus: fee.verificationStatus as BrokerageRule["verificationStatus"],
        verifiedAt: fee.verifiedAt?.toISOString() ?? null,
        tiers: fee.tiers.map((tier) => ({
          minAmount: Number(tier.minAmount),
          maxAmount: tier.maxAmount == null ? null : Number(tier.maxAmount),
          flatAmount: tier.flatAmount == null ? null : Number(tier.flatAmount),
          percentage: tier.percentage == null ? null : Number(tier.percentage),
        })),
      },
    ];
  });

  return rules
    .filter((rule) => brokerageEligibility(rule).eligible)
    .sort(
      (a, b) =>
        a.offeringName.localeCompare(b.offeringName) ||
        a.label.localeCompare(b.label)
    );
}
