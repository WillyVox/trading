import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { providerOfferingRepository } from "@/lib/repository";

/**
 * Share trading platform domain (Milestone 1 — see docs/IMPLEMENTATION-PLAN.md
 * and ROADMAP.md "Offering foundation"). Mirrors src/lib/providers/service.ts
 * one for one: same repository-wrapper pattern, same include-then-cast
 * approach for payload typing (see the ProviderFeatureRow comment in
 * providers/features.ts for why a generic here would lose type inference).
 */

const OFFERING_LIST_INCLUDE = {
  provider: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProviderOfferingInclude;

export type OfferingListItem = Prisma.ProviderOfferingGetPayload<{
  include: typeof OFFERING_LIST_INCLUDE;
}>;

export function getOfferings(
  opts: { page?: number; pageSize?: number } = {}
) {
  return providerOfferingRepository.paginate({
    where: { active: true },
    orderBy: { name: "asc" },
    include: OFFERING_LIST_INCLUDE,
    page: opts.page,
    pageSize: opts.pageSize,
  }) as Promise<{
    items: OfferingListItem[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  }>;
}

const OFFERING_DETAIL_INCLUDE = {
  provider: { select: { id: true, name: true, slug: true } },
  markets: {
    include: { market: true },
    orderBy: { market: { name: "asc" as const } },
  },
  products: { orderBy: { productType: "asc" as const } },
  custody: { include: { market: true } },
  accountTypes: { orderBy: { accountType: "asc" as const } },
} satisfies Prisma.ProviderOfferingInclude;

export type OfferingDetail = Prisma.ProviderOfferingGetPayload<{
  include: typeof OFFERING_DETAIL_INCLUDE;
}>;

export async function getOfferingBySlug(
  slug: string
): Promise<OfferingDetail | null> {
  const row = await prisma.providerOffering.findUnique({
    where: { slug },
    include: OFFERING_DETAIL_INCLUDE,
  });
  return row as OfferingDetail | null;
}

/**
 * Mirrors providers/service.ts's getProvidersBySlugs() exactly (see the
 * comment there): order-preserving, silently drops slugs that don't exist
 * rather than throwing, so the caller can detect a partial match by
 * comparing result.length to slugs.length. Used by the compare-engine
 * domain resolver (src/lib/compare/resolve.ts) to test whether a set of
 * slugs are all offerings.
 */
export async function getOfferingsBySlugs(
  slugs: string[]
): Promise<OfferingDetail[]> {
  if (slugs.length === 0) return [];
  const rows = await prisma.providerOffering.findMany({
    where: { slug: { in: slugs } },
    include: OFFERING_DETAIL_INCLUDE,
  });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return slugs
    .map((s) => bySlug.get(s))
    .filter((r): r is OfferingDetail => Boolean(r)) as OfferingDetail[];
}

/**
 * Every active, indexable offering with full compare-ready detail included
 * -- backs /compare/trading-platforms, the always-complete counterpart to
 * getOfferings() (which is include-light, for the list page). Mirrors how
 * /compare/crypto-exchanges queries prisma.provider directly rather than
 * going through the paginated list helper.
 */
export async function getAllOfferingsForCompare(): Promise<OfferingDetail[]> {
  const rows = await prisma.providerOffering.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    include: OFFERING_DETAIL_INCLUDE,
  });
  return rows as OfferingDetail[];
}