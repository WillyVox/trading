import { cache } from "react";
import type { ArticleSearchIntent } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { articleRepository } from "@/lib/repository";

export function getPublishedArticles(opts: { page?: number; pageSize?: number; category?: string } = {}) {
  return articleRepository.paginate({
    where: { status: "PUBLISHED", ...(opts.category ? { category: opts.category } : {}) },
    orderBy: { publishedAt: "desc" },
    page: opts.page,
    pageSize: opts.pageSize,
  });
}

/**
 * Full family of regional variants for hreflang, regardless of whether the
 * given article is the global/default version or a regional variant
 * itself. Returns the global article plus every variant, each with its
 * region code (global has region: null).
 */
export const getRegionalFamily = cache(async (articleId: string, canonicalArticleId: string | null) => {
  const rootId = canonicalArticleId ?? articleId;
  const root = await prisma.article.findUnique({
    where: { id: rootId },
    select: {
      id: true,
      slug: true,
      region: true,
      regionalVariants: { select: { id: true, slug: true, region: true } },
    },
  });
  if (!root) return [];
  return [{ id: root.id, slug: root.slug, region: root.region }, ...root.regionalVariants];
});

export const getArticleBySlug = cache(async (slug: string) => {
  const article = await articleRepository.findBySlug(slug, {
    include: {
      tags: true,
      sources: true,
      providers: { include: { provider: true } },
      cryptoAssets: { include: { asset: true } },
      canonicalArticle: { select: { id: true, slug: true, title: true, region: true } },
      regionalVariants: { select: { id: true, slug: true, region: true } },
    },
  });
  if (!article || article.status !== "PUBLISHED") return null;
  return article;
});

export function getAdminArticles(opts: { page?: number; pageSize?: number } = {}) {
  return articleRepository.paginate({ orderBy: { updatedAt: "desc" }, page: opts.page, pageSize: opts.pageSize });
}

type RelatedGuideCandidate = {
  id: string;
  category: string | null;
  searchIntent: ArticleSearchIntent | null;
  tags: { tag: string }[];
};

/**
 * Related guides, ranked by the priority chain from the Guide spec:
 * curated (editor-picked, via ArticleRelated) -> same category/intent
 * (closest proxy to a "topic cluster" without a dedicated model) -> same
 * tags -> recent guides. Never returns the current article or duplicates.
 */
export async function getRelatedGuides(article: RelatedGuideCandidate, limit = 6) {
  const excludeIds = new Set<string>([article.id]);
  const results: Array<{ id: string; slug: string; title: string; excerpt: string | null; category: string | null }> = [];

  const curated = await prisma.articleRelated.findMany({
    where: { articleId: article.id, relatedArticle: { status: "PUBLISHED", noIndex: false } },
    orderBy: { position: "asc" },
    include: { relatedArticle: { select: { id: true, slug: true, title: true, excerpt: true, category: true } } },
  });
  for (const c of curated) {
    if (results.length >= limit) break;
    results.push(c.relatedArticle);
    excludeIds.add(c.relatedArticle.id);
  }

  const tagValues = article.tags.map((t) => t.tag);

  const topicOr = [
    article.category ? { category: article.category } : undefined,
    article.searchIntent ? { searchIntent: article.searchIntent } : undefined,
  ].filter((clause): clause is Record<string, unknown> => Boolean(clause));

  const tiers: Record<string, unknown>[] = [];
  if (topicOr.length > 0) tiers.push({ OR: topicOr });
  if (tagValues.length > 0) tiers.push({ tags: { some: { tag: { in: tagValues } } } });
  tiers.push({ category: "guide" });

  for (const tier of tiers) {
    if (results.length >= limit) break;
    const more = await prisma.article.findMany({
      where: { id: { notIn: Array.from(excludeIds) }, status: "PUBLISHED", noIndex: false, ...tier },
      orderBy: { publishedAt: "desc" },
      select: { id: true, slug: true, title: true, excerpt: true, category: true },
      take: limit - results.length,
    });
    for (const a of more) {
      results.push(a);
      excludeIds.add(a.id);
    }
  }

  return results.slice(0, limit);
}

/**
 * "New to crypto?" learning path. Only returns content when it's real and
 * curated (via ArticleRelated) for a BEGINNER/LEARN-intent guide -- there's
 * no dedicated learning-path model, so this never invents a sequence the
 * editor hasn't actually set up.
 */
export async function getNextSteps(article: { id: string; searchIntent: ArticleSearchIntent | null }, limit = 5) {
  if (article.searchIntent !== "BEGINNER" && article.searchIntent !== "LEARN") return [];

  const curated = await prisma.articleRelated.findMany({
    where: {
      articleId: article.id,
      relatedArticle: { status: "PUBLISHED", noIndex: false, category: "guide" },
    },
    orderBy: { position: "asc" },
    include: { relatedArticle: { select: { id: true, slug: true, title: true } } },
    take: limit,
  });

  return curated.map((c) => c.relatedArticle);
}
