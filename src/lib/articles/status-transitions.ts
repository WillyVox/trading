/**
 * The Article publishing lifecycle, as a plain data structure with no
 * Prisma/DB dependency — deliberately mirrors the pattern in
 * src/lib/articles/import/schema.ts (plain literals, not enums imported
 * from @prisma/client) so this module is importable and testable without
 * `prisma generate` having run.
 *
 *   DRAFT -> REVIEW -> PUBLISHED -> (back to) DRAFT
 *     \-------------------------> ARCHIVED -> DRAFT
 *
 * This is the single source of truth for which transitions are legal.
 * src/lib/articles/actions.ts's transitionStatus() calls
 * isValidArticleStatusTransition() rather than re-describing the same rules
 * as a second, parallel `from` array per action — see the six exported
 * actions there (submitArticleForReview, publishArticle, etc.), which are
 * now thin wrappers naming only their target status.
 */
export const ARTICLE_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;
export type ArticleLifecycleStatus = (typeof ARTICLE_STATUSES)[number];

/**
 * Keyed by current status -> the set of statuses it may move to directly.
 * PUBLISHED can only be reached from REVIEW (never directly from DRAFT) --
 * see Req.md's editorial-workflow requirement that every article passes
 * through review before going live. ARCHIVED is reachable from any
 * "live" state as an escape hatch, but only ever un-archives back to
 * DRAFT, never straight to PUBLISHED, so a restored article always goes
 * through review again.
 */
export const ARTICLE_STATUS_TRANSITIONS: Record<ArticleLifecycleStatus, ArticleLifecycleStatus[]> = {
  DRAFT: ["REVIEW", "ARCHIVED"],
  REVIEW: ["DRAFT", "PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

export function isValidArticleStatusTransition(
  from: ArticleLifecycleStatus,
  to: ArticleLifecycleStatus
): boolean {
  return ARTICLE_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * The Guide/News route-isolation rule from Article CMS Block 1, pulled out
 * as a pure predicate so it's testable without a database — the actual
 * lookup (getPublishedArticleBySlugAndType in service.ts) is a thin
 * wrapper: fetch by slug, then ask this function whether the result is
 * eligible to render at all. A NEWS article must never resolve under
 * /crypto/guides/[slug] and a GUIDE must never resolve under /news/[slug].
 */
export function isPubliclyVisibleArticle(
  article: { status: string; articleType: string } | null | undefined,
  requiredType: "NEWS" | "GUIDE"
): boolean {
  if (!article) return false;
  return article.status === "PUBLISHED" && article.articleType === requiredType;
}