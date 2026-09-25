"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  AffiliateEngagementStatus,
  AffiliatePartnerStatus,
  CommissionType,
} from "@prisma/client";
import { isLivePartnershipStatus } from "./status";

function parseEnum<T extends string>(
  value: string,
  allowed: Record<string, T>,
  label: string
): T {
  const match = Object.values(allowed).find((candidate) => candidate === value);
  if (!match) throw new Error(`${label} is not a valid value`);
  return match;
}

export async function createPartnership(formData: FormData) {
  await requireAdmin();
  const providerId = String(formData.get("providerId") ?? "");
  const status = parseEnum(
    String(formData.get("status") ?? "PROSPECT"),
    AffiliatePartnerStatus,
    "status"
  );
  if (!providerId) throw new Error("providerId is required");
  await prisma.affiliatePartnership.create({ data: { providerId, status } });
  revalidatePath("/admin/affiliates/partners");
  revalidatePath("/admin/affiliates");
}

export async function updatePartnershipStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = parseEnum(
    String(formData.get("status") ?? ""),
    AffiliatePartnerStatus,
    "status"
  );
  if (!id) throw new Error("id is required");
  await prisma.affiliatePartnership.update({ where: { id }, data: { status } });
  revalidatePath("/admin/affiliates/partners");
  revalidatePath("/admin/affiliates/engagements");
  revalidatePath("/admin/affiliates");
}

export async function createAffiliateEngagement(formData: FormData) {
  await requireAdmin();
  const partnershipId = String(formData.get("partnershipId") ?? "");
  const offeringId = String(formData.get("offeringId") ?? "");
  const destinationUrl = String(formData.get("destinationUrl") ?? "").trim();
  const commissionType = parseEnum(
    String(formData.get("commissionType") ?? "NONE"),
    CommissionType,
    "commissionType"
  );
  if (!partnershipId || !offeringId)
    throw new Error("partnershipId and offeringId are required");
  let parsed: URL;
  try {
    parsed = new URL(destinationUrl);
  } catch {
    throw new Error("destinationUrl must be a valid https URL");
  }
  if (parsed.protocol !== "https:")
    throw new Error("destinationUrl must use https");
  await prisma.$transaction(async (tx) => {
    const partnership = await tx.affiliatePartnership.findUnique({
      where: { id: partnershipId },
      select: { providerId: true, status: true },
    });
    const offering = await tx.providerOffering.findUnique({
      where: { id: offeringId },
      select: { providerId: true },
    });
    if (!partnership || !offering)
      throw new Error("Partnership or Offering not found");
    if (partnership.providerId !== offering.providerId)
      throw new Error("Offering must belong to the Partnership Provider");
    await tx.affiliateEngagement.create({
      data: {
        partnershipId,
        offeringId,
        destinationUrl: parsed.toString(),
        commissionType,
        status: isLivePartnershipStatus(partnership.status)
          ? "ACTIVE"
          : "DRAFT",
      },
    });
  });
  revalidatePath("/admin/affiliates/engagements");
  revalidatePath("/admin/affiliates");
}

export async function updateAffiliateEngagementStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = parseEnum(
    String(formData.get("status") ?? ""),
    AffiliateEngagementStatus,
    "status"
  );
  if (!id) throw new Error("id is required");
  const engagement = await prisma.affiliateEngagement.findUnique({
    where: { id },
    select: { partnership: { select: { status: true } } },
  });
  if (!engagement) throw new Error("Engagement not found");
  if (
    status === "ACTIVE" &&
    !isLivePartnershipStatus(engagement.partnership.status)
  )
    throw new Error(
      "An engagement can only be ACTIVE under an APPROVED or ACTIVE partnership"
    );
  await prisma.affiliateEngagement.update({ where: { id }, data: { status } });
  revalidatePath("/admin/affiliates/engagements");
  revalidatePath("/admin/affiliates");
}
