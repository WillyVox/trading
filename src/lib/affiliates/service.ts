import { prisma } from "@/lib/prisma";
import { affiliateLinkRepository } from "@/lib/repository";

export async function getActiveAffiliateLink(partnerSlug: string) {
  const link = await affiliateLinkRepository.findBySlug(partnerSlug);
  if (!link || !link.active) return null;
  return link;
}

export async function recordAffiliateClick(linkId: string, meta: { sourcePage?: string; placement?: string; campaign?: string }) {
  return prisma.affiliateClick.create({
    data: { linkId, sourcePage: meta.sourcePage, placement: meta.placement, campaign: meta.campaign },
  });
}
