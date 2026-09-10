import { prisma } from "@/lib/prisma";
import { affiliateLinkRepository } from "@/lib/repository";

export async function getActiveAffiliateLink(partnerSlug: string) {
  const link = await affiliateLinkRepository.findFirst({
    where: {
      partnerSlug,
      active: true,
    },
  });
  if (!link || !link.active) return null;
  return link;
}

/**
 * Batched lookup for pages that render several providers at once (e.g. a
 * Guide's "providers mentioned" section) so we don't issue one query per
 * provider. By convention AffiliateLink.partnerSlug matches Provider.slug
 * (see src/app/go/[partner]/route.ts and the exchange profile page).
 */
export async function getActiveAffiliateLinksForProviderSlugs(slugs: string[]) {
  if (slugs.length === 0) return new Map<string, { partnerSlug: string }>();
  const links = await prisma.affiliateLink.findMany({
    where: { partnerSlug: { in: slugs }, active: true },
  });
  return new Map(links.map((link) => [link.partnerSlug, link]));
}

export async function recordAffiliateClick(linkId: string, meta: { sourcePage?: string; placement?: string; campaign?: string }) {
  return prisma.affiliateClick.create({
    data: { linkId, sourcePage: meta.sourcePage, placement: meta.placement, campaign: meta.campaign },
  });
}
