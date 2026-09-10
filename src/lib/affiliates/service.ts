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

// ---------------------------------------------------------------------------
// Admin read queries (Phase 6 — /admin/affiliates/partners, /links, /clicks).
// These are read-only lookups for the admin UI; mutations live in
// src/lib/affiliates/actions.ts so every write path goes through its own
// requireAdmin() check independently of the page/layout guard.
// ---------------------------------------------------------------------------

/** All partnerships, newest first, with the provider and each program's link count. */
export async function getPartnershipsAdmin() {
  return prisma.affiliatePartnership.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { id: true, name: true, slug: true } },
      programs: { include: { _count: { select: { links: true } } } },
    },
  });
}

/** Providers for the "new partnership" select — every provider, regardless of existing partnerships (a provider can have more than one program/partnership over time, e.g. re-applying after ENDED). */
export function getProvidersForPartnershipForm() {
  return prisma.provider.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

/** Partnerships for the "new link" select, with their existing programs so the form can reuse one instead of always creating a new program per link. */
export async function getPartnershipsForLinkForm() {
  return prisma.affiliatePartnership.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { name: true, slug: true } },
      programs: { select: { id: true, commissionType: true } },
    },
  });
}

/** All affiliate links with their program/partnership/provider chain and click counts. */
export async function getAffiliateLinksAdmin() {
  return prisma.affiliateLink.findMany({
    orderBy: { partnerSlug: "asc" },
    include: {
      _count: { select: { clicks: true } },
      program: {
        include: {
          partnership: { include: { provider: { select: { name: true, slug: true } } } },
        },
      },
    },
  });
}

/** Paginated click log, newest first, for the admin clicks view. */
export async function getAffiliateClicksAdmin(page = 1, pageSize = 50) {
  const [items, total] = await Promise.all([
    prisma.affiliateClick.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { link: { select: { partnerSlug: true } } },
    }),
    prisma.affiliateClick.count(),
  ]);
  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}