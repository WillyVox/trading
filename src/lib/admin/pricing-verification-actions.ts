"use server";

import { revalidatePath } from "next/cache";
import { VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

const REVIEW_DAYS = 45;

const PRICING_TOOL_PATHS = [
  "/admin/pricing-verification",
  "/tools",
  "/tools/brokerage-calculator",
  "/tools/fx-fee-calculator",
  "/tools/trading-cost-calculator",
  "/tools/regular-investing-calculator",
  "/tools/crypto-fee-calculator",
  "/tools/crypto-funding-withdrawal-fees",
  "/tools/crypto-cost-calculator",
] as const;

function revalidatePricingSurfaces() {
  for (const path of PRICING_TOOL_PATHS) revalidatePath(path);
}

export async function verifyOfferingFee(formData: FormData) {
  const session = await requireAdmin();
  const feeId = String(formData.get("feeId") ?? "");
  if (!feeId) throw new Error("feeId is required");

  const fee = await prisma.offeringFee.findUnique({
    where: { id: feeId },
    select: { sourceUrl: true },
  });
  if (!fee) throw new Error("Pricing record not found");
  if (!fee.sourceUrl)
    throw new Error("A source URL is required before pricing can be verified");

  const now = new Date();
  const reviewDueAt = new Date(now.getTime() + REVIEW_DAYS * 86400000);
  await prisma.offeringFee.update({
    where: { id: feeId },
    data: {
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: now,
      reviewDueAt,
      verifiedByUserId: session.user.id,
    },
  });
  revalidatePricingSurfaces();
}

export async function markOfferingFeeStale(formData: FormData) {
  await requireAdmin();
  const feeId = String(formData.get("feeId") ?? "");
  if (!feeId) throw new Error("feeId is required");
  await prisma.offeringFee.update({
    where: { id: feeId },
    data: { verificationStatus: VerificationStatus.STALE },
  });
  revalidatePricingSurfaces();
}
