import "server-only";
import { FeeCategory, OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { BrokerageOfferingOption, BrokerageRule } from "./types";
import { brokerageEligibility } from "./eligibility";

function mapStatus(value: string): BrokerageRule["verificationStatus"] {
  return value === "VERIFIED"
    ? "VERIFIED"
    : value === "STALE"
      ? "STALE"
      : "UNVERIFIED";
}
export async function getBrokerageRules(): Promise<BrokerageRule[]> {
  const fees = await prisma.offeringFee.findMany({
    where: {
      feeCategory: FeeCategory.BROKERAGE,
      isPromotional: false,
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
  return fees
    .flatMap((fee): BrokerageRule[] =>
      fee.market
        ? [
            {
              feeId: fee.id,
              offeringSlug: fee.offering.slug,
              offeringName: fee.offering.name,
              providerName: fee.offering.provider.name,
              marketCode: fee.market.code,
              marketName: fee.market.name,
              channel: fee.channel as BrokerageRule["channel"],
              label: fee.label,
              calculationBasis:
                fee.calculationBasis as BrokerageRule["calculationBasis"],
              flatAmount:
                fee.flatAmount == null ? null : Number(fee.flatAmount),
              percentage:
                fee.percentage == null ? null : Number(fee.percentage),
              currency: fee.currency,
              displayValue: fee.displayValue,
              notes: fee.notes,
              sourceUrl: fee.sourceUrl,
              verificationStatus: mapStatus(fee.verificationStatus),
              verifiedAt: fee.verifiedAt?.toISOString() ?? null,
              pricingPlan: fee.pricingPlan,
              tradeSide: fee.tradeSide as BrokerageRule["tradeSide"],
              firstBuyPerSecurityPerDay: fee.firstBuyPerSecurityPerDay,
              minTradeAmount:
                fee.minTradeAmount == null ? null : Number(fee.minTradeAmount),
              maxTradeAmount:
                fee.maxTradeAmount == null ? null : Number(fee.maxTradeAmount),
              maxTradeAmountInclusive: fee.maxTradeAmountInclusive,
              excludesMarginLoanSettlement: fee.excludesMarginLoanSettlement,
              gstPercent:
                fee.gstPercent == null ? null : Number(fee.gstPercent),
              tiers: fee.tiers.map((t) => ({
                minAmount: Number(t.minAmount),
                maxAmount: t.maxAmount == null ? null : Number(t.maxAmount),
                flatAmount: t.flatAmount == null ? null : Number(t.flatAmount),
                percentage: t.percentage == null ? null : Number(t.percentage),
              })),
            },
          ]
        : []
    )
    .sort(
      (a, b) =>
        a.offeringName.localeCompare(b.offeringName) ||
        a.label.localeCompare(b.label)
    );
}
export async function getBrokerageOfferings(): Promise<
  BrokerageOfferingOption[]
> {
  const rules = await getBrokerageRules();
  const groups = new Map<string, BrokerageOfferingOption>();
  for (const rule of rules) {
    let group = groups.get(rule.offeringSlug);
    if (!group) {
      group = {
        slug: rule.offeringSlug,
        name: rule.offeringName,
        providerName: rule.providerName,
        rules: [],
        availability: "UNAVAILABLE",
      };
      groups.set(rule.offeringSlug, group);
    }
    group.rules.push(rule);
  }
  for (const group of groups.values()) {
    const checks = group.rules.map((r) => brokerageEligibility(r));
    if (checks.some((c) => c.eligible)) {
      group.availability = group.rules.some(
        (r) =>
          r.firstBuyPerSecurityPerDay != null ||
          r.tradeSide != null ||
          r.pricingPlan != null
      )
        ? "NEEDS_INPUT"
        : "CALCULATABLE";
      delete group.reason;
    } else
      group.reason =
        checks.map((c) => (c.eligible ? null : c.reason)).find(Boolean) ??
        "Calculation unavailable for the current published data.";
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}
