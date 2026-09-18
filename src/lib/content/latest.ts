import { getPublishedArticles } from "@/lib/articles/service";
import { getPublicGuides } from "@/lib/guides/service";

/**
 * Normalized shape for a "Latest in <category>" content module. Merges two
 * sources that otherwise live behind separate services and route prefixes:
 *
 * - Guides (via getPublicGuides, which itself merges DB-backed GUIDE
 *   articles with hand-authored STATIC_GUIDES) -> /guides/[slug]
 * - Published NEWS articles in the same category -> /news/[slug]
 *
 * This lives outside both src/lib/articles/service.ts and
 * src/lib/guides/service.ts (rather than inside either) because
 * guides/service.ts already imports from articles/service.ts -- adding the
 * reverse import there to reuse getPublicGuides would be circular.
 */

export interface LatestArticleSummary {
  id: string;
  href: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  articleType: "GUIDE" | "NEWS";
  featuredImage: string | null;
  featuredImageAlt: string | null;
  author: string | null;
  publishedAt: Date | string | null;
}

export async function getLatestArticlesForCategory(
  category: string,
  limit = 4
): Promise<LatestArticleSummary[]> {
  const [guides, newsResult] = await Promise.all([
    getPublicGuides(category),
    getPublishedArticles({
      articleType: "NEWS",
      category,
      pageSize: limit,
    }),
  ]);

  const combined: LatestArticleSummary[] = [
    ...guides.map(
      (guide): LatestArticleSummary => ({
        id: guide.id,
        href: `/guides/${guide.slug}`,
        title: guide.title,
        excerpt: guide.excerpt,
        category: guide.category,
        articleType: "GUIDE",
        featuredImage: guide.featuredImage,
        featuredImageAlt: guide.featuredImageAlt,
        author: guide.author,
        publishedAt: guide.publishedAt,
      })
    ),
    ...newsResult.items.map(
      (article: any): LatestArticleSummary => ({
        id: article.id,
        href: `/news/${article.slug}`,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        articleType: "NEWS",
        featuredImage: article.featuredImage,
        featuredImageAlt: article.featuredImageAlt,
        author: article.author,
        publishedAt: article.publishedAt,
      })
    ),
  ];

  return combined
    .sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime || a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}