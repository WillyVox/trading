import "server-only";
import { OfferingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CryptoFeeOffering, CryptoFeeRule } from "./types";

const categories = ["CRYPTO_TRADING", "MAKER", "TAKER", "INSTANT_BUY", "FIAT_DEPOSIT", "FIAT_WITHDRAWAL", "CRYPTO_WITHDRAWAL", "SPREAD", "OTHER"] as const;

export async function getCryptoFeeOfferings(): Promise<CryptoFeeOffering[]> {
  const fees = await prisma.offeringFee.findMany({
    where: { isPromotional: false, feeCategory: { in: [...categories] }, offering: { active: true, offeringType: OfferingType.CRYPTO_EXCHANGE } },
    include: { offering: { include: { provider: { select: { name: true } } } } },
    orderBy: [{ offering: { name: "asc" } }, { label: "asc" }],
  });

  const grouped = new Map<string, CryptoFeeOffering>();
  for (const fee of fees) {
    const status: CryptoFeeRule["verificationStatus"] = fee.verificationStatus === "VERIFIED" ? "VERIFIED" : fee.verificationStatus === "STALE" ? "STALE" : "UNVERIFIED";
    const rule: CryptoFeeRule = {
      feeId: fee.id, offeringSlug: fee.offering.slug, offeringName: fee.offering.name,
      providerName: fee.offering.provider.name, category: fee.feeCategory as CryptoFeeRule["category"],
      label: fee.label, calculationBasis: fee.calculationBasis as CryptoFeeRule["calculationBasis"],
      flatAmount: fee.flatAmount == null ? null : Number(fee.flatAmount), percentage: fee.percentage == null ? null : Number(fee.percentage),
      currency: fee.currency, displayValue: fee.displayValue, notes: fee.notes, sourceUrl: fee.sourceUrl,
      verificationStatus: status, verifiedAt: fee.verifiedAt?.toISOString() ?? null, reviewDueAt: fee.reviewDueAt?.toISOString() ?? null,
    };
    const current = grouped.get(rule.offeringSlug) ?? { slug: rule.offeringSlug, name: rule.offeringName, providerName: rule.providerName, rules: [] };
    current.rules.push(rule); grouped.set(rule.offeringSlug, current);
  }
  return [...grouped.values()].sort((a,b) => a.name.localeCompare(b.name));
}
