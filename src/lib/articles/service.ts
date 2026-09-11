import { cache } from "react";
import type { ArticleSearchIntent, ArticleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { articleRepository } from "@/lib/repository";
import { isPubliclyVisibleArticle } from "@/lib/articles/status-transitions";

/**
 * `articleType` (not `category`) is what actually scopes a listing to
 * Guides vs News — see docs/IMPLEMENTATION-PLAN.md Article CMS Block 1.
 * `category` remains a free-text topic filter that can be combined with it
 * (e.g. GUIDE + category "crypto-exchanges"), but is never sufficient on
 * its own to determine content type.
 */
export function getPublishedArticles(opts: { page?: number; pageSize?: number; articleType?: ArticleType; category?: string } = {}) {
  return articleRepository.paginate({
    where: {
      status: "PUBLISHED",
      ...(opts.articleType ? { articleType: opts.articleType } : {}),
      ...(opts.category ? { category: opts.category } : {}),
    },
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

const articleDetailInclude = {
  tags: true,
  sources: true,
  providers: { include: { provider: true } },
  cryptoAssets: { include: { asset: true } },
  canonicalArticle: { select: { id: true, slug: true, title: true, region: true } },
  regionalVariants: { select: { id: true, slug: true, region: true } },
  // Curated related guides *from* this article — only actually consumed by
  // the admin editor's "related guides" picker today (public Guide pages
  // build their related-guides section via getRelatedGuides() instead, see
  // below), but kept on the shared include rather than a second query
  // shape so admin/public detail lookups stay structurally identical.
  relatedFrom: {
    orderBy: { position: "asc" as const },
    include: { relatedArticle: { select: { id: true, title: true, slug: true } } },
  },
} as const;

/**
 * ADMIN/PREVIEW USE ONLY. Looks up an article by slug regardless of status
 * or articleType. Public routes must never call this directly — use
 * `getPublishedArticleBySlugAndType` instead, which is the only lookup that
 * enforces both the PUBLISHED gate and Guide/News route isolation. This
 * function stays unfiltered because admin preview (`/admin/articles/[id]`
 * and its preview route) legitimately needs to see DRAFT/REVIEW content.
 */
export const getArticleBySlug = cache(async (slug: string) => {
  return articleRepository.findBySlug(slug, { include: articleDetailInclude });
});

/**
 * ADMIN/PREVIEW USE ONLY, by id rather than slug — the id-based counterpart
 * of `getArticleBySlug` for `/admin/articles/[id]` and its preview route,
 * where the slug may be mid-edit and shouldn't be relied on for lookup.
 */
export const getArticleById = cache(async (id: string) => {
  return prisma.article.findUnique({ where: { id }, include: articleDetailInclude });
});

/**
 * The only lookup public Guide/News routes should call. Enforces both
 * rules the old shared `getArticleBySlug` was missing: PUBLISHED-only, and
 * strict articleType isolation so a GUIDE can never resolve under
 * /news/[slug] and a NEWS article can never resolve under
 * /crypto/guides/[slug] — see docs/IMPLEMENTATION-PLAN.md Article CMS
 * Block 1.
 */
export const getPublishedArticleBySlugAndType = cache(async (slug: string, articleType: ArticleType) => {
  const article = await articleRepository.findBySlug(slug, { include: articleDetailInclude });
  return isPubliclyVisibleArticle(article, articleType) ? article : null;
});

export function getAdminArticles(opts: {
  page?: number;
  pageSize?: number;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  articleType?: ArticleType;
  category?: string;
  search?: string;
} = {}) {
  const where: Record<string, unknown> = {};
  if (opts.status) where.status = opts.status;
  if (opts.articleType) where.articleType = opts.articleType;
  if (opts.category) where.category = opts.category;
  if (opts.search) {
    where.OR = [
      { title: { contains: opts.search, mode: "insensitive" } },
      { slug: { contains: opts.search, mode: "insensitive" } },
    ];
  }
  return articleRepository.paginate({
    where,
    orderBy: { updatedAt: "desc" },
    page: opts.page,
    pageSize: opts.pageSize,
  });
}

/**
 * Every distinct `category` value currently in use, for the admin list
 * filter dropdown. `category` stays free-text (see Req.md §4 — it's a
 * topic, not a type), so this is populated from real data rather than a
 * hardcoded list that would drift from what editors actually type.
 */
export async function getAdminArticleCategories() {
  const rows = await prisma.article.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category).filter((c): c is string => Boolean(c));
}

/** Providers for the admin editor's provider-relationship picker — id/name/slug only, no fee/feature payload needed here. */
export function getProvidersForArticleForm() {
  return prisma.provider.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });
}

/** Crypto assets for the admin editor's asset-relationship picker. */
export function getCryptoAssetsForArticleForm() {
  return prisma.cryptoAsset.findMany({
    select: { id: true, name: true, symbol: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Candidate articles for the "related guides" and "regional canonical
 * article" pickers. Admin-only (any status — an editor may want to link to
 * a REVIEW article they're publishing together), capped at 200 so the
 * select stays usable; excludes the article currently being edited so it
 * can't reference itself.
 */
export function getArticlesForRelatedPicker(excludeArticleId?: string) {
  return prisma.article.findMany({
    where: excludeArticleId ? { id: { not: excludeArticleId } } : undefined,
    select: { id: true, title: true, slug: true, articleType: true, status: true },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });
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
  ].filter((clause): clause is NonNullable<typeof clause> => Boolean(clause));

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