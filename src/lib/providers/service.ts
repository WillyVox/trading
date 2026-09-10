import type { ProviderType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { providerRepository } from "@/lib/repository";

export function getProviders(opts: { page?: number; pageSize?: number; providerType?: ProviderType } = {}) {
  return providerRepository.paginate({
    where: opts.providerType ? { providerType: opts.providerType } : undefined,
    orderBy: { name: "asc" },
    page: opts.page,
    pageSize: opts.pageSize,
  });
}

const COMPARISON_INCLUDE = {
  facts: true,
  fees: true,
  features: true,
} as const;

export function getProviderBySlug(slug: string) {
  return providerRepository.findBySlug(slug, {
    include: {
      ...COMPARISON_INCLUDE,
      prosCons: { orderBy: { position: "asc" } },
      sources: true,
      regulations: true,
      assets: { include: { asset: true } },
    },
  });
}

/**
 * Batched provider lookup for the Comparison Engine (Phase 5) -- one query
 * for any number of slugs rather than N calls to getProviderBySlug(), and
 * only the facts/fees/features actually rendered in a comparison table
 * (see src/lib/providers/compare.ts). Returns providers in the same order
 * as the requested slugs (Prisma's `in` filter doesn't guarantee order),
 * dropping any slug that doesn't match a real Provider -- callers should
 * treat a shorter result than `slugs` as "at least one provider not found".
 */
export async function getProvidersBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const rows = await prisma.provider.findMany({
    where: { slug: { in: slugs } },
    include: COMPARISON_INCLUDE,
  });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return slugs.map((s) => bySlug.get(s)).filter((r): r is NonNullable<typeof r> => Boolean(r));
}

export function getProvidersForAsset(assetSlug: string) {
  return providerRepository.findMany({
    where: { assets: { some: { asset: { slug: assetSlug } } } },
    orderBy: { name: "asc" },
  });
}

/**
 * Guides and news that mention/compare/feature this provider (via the
 * ArticleProvider join, see prisma/schema.prisma "Article domain"), split
 * by the same `category` convention getPublishedArticles() and the
 * /crypto/guides and /news routes already use ("guide" / "news"). Never
 * duplicates article data into the Provider domain -- pulled live, per the
 * Phase 5 rule that comparisons/related content read from source domains
 * rather than copies.
 */
export async function getRelatedContentForProvider(providerId: string, limit = 4) {
  const links = await prisma.articleProvider.findMany({
    where: { providerId, article: { status: "PUBLISHED", noIndex: false } },
    include: {
      article: {
        select: { id: true, slug: true, title: true, excerpt: true, category: true, publishedAt: true },
      },
    },
    orderBy: { article: { publishedAt: "desc" } },
  });

  const guides = links
    .map((l) => l.article)
    .filter((a) => a.category === "guide")
    .slice(0, limit);
  const news = links
    .map((l) => l.article)
    .filter((a) => a.category === "news")
    .slice(0, limit);

  return { guides, news };
}
