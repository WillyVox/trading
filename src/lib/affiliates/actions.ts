"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { AffiliatePartnerStatus, CommissionType } from "@prisma/client";

/**
 * Phase 6 admin mutations for AffiliatePartnership / AffiliateProgram /
 * AffiliateLink. Every action independently calls requireAdmin() — the
 * admin layout already blocks unauthenticated/non-admin *page* access, but
 * per the cross-cutting rule in docs/IMPLEMENTATION-PLAN.md §8, a protected
 * page is not the same as a protected mutation.
 *
 * AffiliateClick rows are intentionally never mutated here — they're an
 * append-only log written by src/lib/affiliates/service.ts#recordAffiliateClick
 * from the /go/[partner] redirect, not edited from the admin UI.
 */

const PARTNER_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function createPartnership(formData: FormData) {
  await requireAdmin();

  const providerId = String(formData.get("providerId") ?? "");
  const status = String(formData.get("status") ?? "PROSPECT") as AffiliatePartnerStatus;
  if (!providerId) throw new Error("providerId is required");

  await prisma.affiliatePartnership.create({
    data: { providerId, status },
  });

  revalidatePath("/admin/affiliates/partners");
  revalidatePath("/admin/affiliates/links");
}

export async function updatePartnershipStatus(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as AffiliatePartnerStatus;
  if (!id || !status) throw new Error("id and status are required");

  await prisma.affiliatePartnership.update({
    where: { id },
    data: { status },
  });

  // Ending/pausing a partnership doesn't touch the Provider row or delete
  // any AffiliateLink — links are hidden from the public site by their own
  // `active` flag (see getActiveAffiliateLink), not by partnership status.
  // Provider profiles/comparisons stay fully intact either way.
  revalidatePath("/admin/affiliates/partners");
  revalidatePath("/admin/affiliates/links");
}

/**
 * Creates an AffiliateLink under the chosen partnership. Reuses the
 * partnership's existing AffiliateProgram with a matching commissionType if
 * one exists (so one program can back several links/placements), otherwise
 * creates a new program — done in a transaction so a link is never left
 * without a program.
 */
export async function createAffiliateLink(formData: FormData) {
  await requireAdmin();

  const partnershipId = String(formData.get("partnershipId") ?? "");
  const commissionType = String(formData.get("commissionType") ?? "NONE") as CommissionType;
  const partnerSlug = String(formData.get("partnerSlug") ?? "").trim().toLowerCase();
  const approvedUrl = String(formData.get("approvedUrl") ?? "").trim();
  const placement = String(formData.get("placement") ?? "").trim() || null;
  const campaign = String(formData.get("campaign") ?? "").trim() || null;

  if (!partnershipId) throw new Error("partnershipId is required");
  if (!PARTNER_SLUG_PATTERN.test(partnerSlug)) {
    throw new Error("partnerSlug must be lowercase letters/numbers separated by hyphens");
  }
  let approvedUrlParsed: URL;
  try {
    approvedUrlParsed = new URL(approvedUrl);
  } catch {
    throw new Error("approvedUrl must be a full, valid URL (https://...)");
  }
  if (approvedUrlParsed.protocol !== "https:") {
    throw new Error("approvedUrl must use https — /go/[partner] only redirects to trusted, stored URLs");
  }

  await prisma.$transaction(async (tx) => {
    let program = await tx.affiliateProgram.findFirst({
      where: { partnershipId, commissionType },
    });
    if (!program) {
      program = await tx.affiliateProgram.create({
        data: { partnershipId, commissionType },
      });
    }
    await tx.affiliateLink.create({
      data: {
        programId: program.id,
        partnerSlug,
        approvedUrl: approvedUrlParsed.toString(),
        placement,
        campaign,
      },
    });
  });

  revalidatePath("/admin/affiliates/links");
  revalidatePath("/admin/affiliates");
}

export async function toggleAffiliateLinkActive(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("id is required");

  const link = await prisma.affiliateLink.findUnique({ where: { id }, select: { active: true } });
  if (!link) throw new Error("Link not found");

  await prisma.affiliateLink.update({
    where: { id },
    data: { active: !link.active },
  });

  revalidatePath("/admin/affiliates/links");
  revalidatePath("/admin/affiliates");
}