"use server";

import { revalidatePath } from "next/cache";
import { VerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

const REVIEW_DAYS = 45;

export async function verifyOfferingFee(formData: FormData) {
  const session = await requireAdmin();
  const feeId = String(formData.get("feeId") ?? "");
  if (!feeId) throw new Error("feeId is required");
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
  revalidatePath("/admin/pricing-verification");
  revalidatePath("/tools/brokerage-calculator");
}

export async function markOfferingFeeStale(formData: FormData) {
  await requireAdmin();
  const feeId = String(formData.get("feeId") ?? "");
  if (!feeId) throw new Error("feeId is required");
  await prisma.offeringFee.update({
    where: { id: feeId },
    data: { verificationStatus: VerificationStatus.STALE },
  });
  revalidatePath("/admin/pricing-verification");
  revalidatePath("/tools/brokerage-calculator");
}
