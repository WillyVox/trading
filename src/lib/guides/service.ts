import {
  getArticleCategories,
  getPublishedArticles,
} from "@/lib/articles/service";

import {
  getStaticGuideCategories,
  getStaticGuides,
  isStaticGuideSlug,
} from "./static-guides";

import type { GuideSummary } from "./types";

/**
 * Infer the individual database guide type directly from
 * getPublishedArticles().
 *
 * This keeps this service aligned with the article service if its
 * return type changes later.
 */
type PublishedArticlesResult = Awaited<
  ReturnType<typeof getPublishedArticles>
>;

type DatabaseGuide = PublishedArticlesResult["items"][number];

/**
 * Unified discovery layer for /guides.
 *
 * Rendering is intentionally NOT dispatched here:
 *
 * - Explicit /guides/<static-slug> routes render themselves.
 * - /guides/[slug] remains the database-backed fallback route.
 *
 * This service exists only to provide a unified discovery/listing model
 * for static and database-backed guides.
 */
export async function getPublicGuides(
  category?: string,
): Promise<GuideSummary[]> {
  const [{ items: databaseGuides }, staticGuides] = await Promise.all([
    getPublishedArticles({
      articleType: "GUIDE",
      category,
      pageSize: 48,
    }),
    Promise.resolve(getStaticGuides(category)),
  ]);

  const normalizedStatic: GuideSummary[] = staticGuides.map((guide) => ({
    id: `static:${guide.slug}`,
    ...guide,
  }));

  /**
   * If an existing DB article already uses a reserved static-guide slug,
   * the explicit static route owns that URL.
   *
   * Exclude the unreachable DB duplicate from discovery. Admin-side
   * reserved-slug validation prevents new collisions from being created.
   */
  const normalizedDatabase: GuideSummary[] = databaseGuides
    .filter(
      (guide: DatabaseGuide) => !isStaticGuideSlug(guide.slug),
    )
    .map(
      (guide: DatabaseGuide): GuideSummary => ({
        id: guide.id,
        slug: guide.slug,
        title: guide.title,
        excerpt: guide.excerpt,
        category: guide.category,
        featuredImage: guide.featuredImage,
        featuredImageAlt: guide.featuredImageAlt,
        author: guide.author,
        publishedAt: guide.publishedAt,
        updatedAt: guide.updatedAt,
        source: "DATABASE",
      }),
    );

  return [...normalizedStatic, ...normalizedDatabase].sort((a, b) => {
    const aTime = a.publishedAt
      ? new Date(a.publishedAt).getTime()
      : 0;

    const bTime = b.publishedAt
      ? new Date(b.publishedAt).getTime()
      : 0;

    return bTime - aTime || a.title.localeCompare(b.title);
  });
}

export async function getPublicGuideCategories(): Promise<string[]> {
  const [databaseCategories, staticCategories] = await Promise.all([
    getArticleCategories("GUIDE"),
    Promise.resolve(getStaticGuideCategories()),
  ]);

  return [
    ...new Set([...databaseCategories, ...staticCategories]),
  ].sort();
}