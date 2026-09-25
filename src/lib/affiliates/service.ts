import { prisma } from "@/lib/prisma";
import { LIVE_PARTNERSHIP_STATUSES } from "./status";

const now = () => new Date();

/** Canonical commercial lookup: Offering -> Engagement -> Partnership -> Provider. */
export async function getActiveAffiliateEngagement(offeringSlug: string) {
  const at = now();
  return prisma.affiliateEngagement.findFirst({
    where: {
      offering: { slug: offeringSlug, active: true },
      status: "ACTIVE",
      partnership: { status: { in: [...LIVE_PARTNERSHIP_STATUSES] } },
      AND: [
        { OR: [{ validFrom: null }, { validFrom: { lte: at } }] },
        { OR: [{ validUntil: null }, { validUntil: { gt: at } }] },
      ],
    },
    include: {
      offering: {
        select: { id: true, slug: true, providerId: true, name: true },
      },
      partnership: {
        include: { provider: { select: { id: true, slug: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveAffiliateEngagementsForOfferingSlugs(
  slugs: string[]
) {
  if (!slugs.length)
    return new Map<string, { offeringSlug: string; providerSlug: string }>();
  const at = now();
  const rows = await prisma.affiliateEngagement.findMany({
    where: {
      offering: { slug: { in: slugs }, active: true },
      status: "ACTIVE",
      partnership: { status: { in: [...LIVE_PARTNERSHIP_STATUSES] } },
      AND: [
        { OR: [{ validFrom: null }, { validFrom: { lte: at } }] },
        { OR: [{ validUntil: null }, { validUntil: { gt: at } }] },
      ],
    },
    include: {
      offering: { select: { slug: true } },
      partnership: { include: { provider: { select: { slug: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  const map = new Map<string, { offeringSlug: string; providerSlug: string }>();
  for (const row of rows)
    if (!map.has(row.offering.slug))
      map.set(row.offering.slug, {
        offeringSlug: row.offering.slug,
        providerSlug: row.partnership.provider.slug,
      });
  return map;
}

export async function recordAffiliateEvent(
  engagementId: string,
  meta: { sourcePage?: string; placement?: string; campaign?: string }
) {
  return prisma.affiliateEvent.create({
    data: { engagementId, eventType: "CLICK", ...meta },
  });
}

export async function getPartnershipsAdmin() {
  return prisma.affiliatePartnership.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { id: true, name: true, slug: true } },
      _count: { select: { engagements: true } },
    },
  });
}

export function getProvidersForPartnershipForm() {
  return prisma.provider.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export async function getPartnershipsForEngagementForm() {
  return prisma.affiliatePartnership.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          slug: true,
          offerings: {
            where: { active: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
  });
}

export async function getAffiliateEngagementsAdmin() {
  return prisma.affiliateEngagement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      offering: { select: { name: true, slug: true } },
      partnership: {
        include: { provider: { select: { name: true, slug: true } } },
      },
      _count: { select: { events: true } },
    },
  });
}

export async function getAffiliateEventsAdmin(page = 1, pageSize = 50) {
  const [items, total] = await Promise.all([
    prisma.affiliateEvent.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        engagement: {
          include: {
            offering: { select: { name: true, slug: true } },
            partnership: {
              include: { provider: { select: { name: true, slug: true } } },
            },
          },
        },
      },
    }),
    prisma.affiliateEvent.count(),
  ]);
  return {
    items,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}
