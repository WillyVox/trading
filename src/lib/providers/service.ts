import { prisma } from "@/lib/prisma";
import { providerRepository } from "@/lib/repository";

export function getProviders(opts: { page?: number; pageSize?: number } = {}) {
  return providerRepository.paginate({ orderBy: { name: "asc" }, page: opts.page, pageSize: opts.pageSize });
}

export function getProviderBySlug(slug: string) {
  return providerRepository.findBySlug(slug, {
    include: {
      facts: true,
      fees: true,
      features: true,
      prosCons: { orderBy: { position: "asc" } },
      sources: true,
      regulations: true,
      assets: { include: { asset: true } },
    },
  });
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
