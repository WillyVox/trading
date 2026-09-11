import matter from "gray-matter";
import { validateFrontmatter, SOURCE_TYPES } from "./schema";
import { markdownToSafeHtml } from "./markdown";
import type { ArticleImportPayload, ImportRegion, ImportSourceType } from "./types";

export interface ParseSuccess {
  ok: true;
  payload: ArticleImportPayload;
  warnings: string[];
}

export interface ParseFailure {
  ok: false;
  errors: string[];
  warnings: string[];
}

export type ParseResult = ParseSuccess | ParseFailure;

/**
 * Parses one article file's raw text (frontmatter + body) into a validated
 * ArticleImportPayload. Used for both .md and .txt — per spec §5, the two
 * extensions share this exact parser; the file extension only affects which
 * glob picks the file up in scanner.ts, not how it's read.
 */
export function parseArticleFile(rawText: string): ParseResult {
  let frontmatter: unknown;
  let body: string;
  try {
    const parsed = matter(rawText);
    frontmatter = parsed.data;
    body = parsed.content.trim();
  } catch (err) {
    return { ok: false, errors: [`malformed frontmatter: ${(err as Error).message}`], warnings: [] };
  }

  const validation = validateFrontmatter(frontmatter, body);
  if (!validation.ok || !validation.data) {
    return { ok: false, errors: validation.errors, warnings: validation.warnings };
  }

  const data = validation.data;
  const html = markdownToSafeHtml(body);
  if (html.length === 0) {
    return {
      ok: false,
      errors: ["content: body produced no renderable content after sanitization"],
      warnings: validation.warnings,
    };
  }

  // Merge the current `providerRelationships` key with the deprecated
  // `relatedProviders` alias into one normalized list, keyed by provider
  // slug. `providerRelationships` wins on a slug collision — validation.ts
  // already warned about the deprecated key being present at all.
  const providerRelationshipsBySlug = new Map<string, "MENTIONED" | "COMPARED" | "FEATURED">();
  for (const entry of data.relatedProviders ?? []) {
    const slug = typeof entry === "string" ? entry : entry.slug;
    const relationship = typeof entry === "string" ? "MENTIONED" : entry.relationship ?? "MENTIONED";
    providerRelationshipsBySlug.set(slug, relationship);
  }
  for (const entry of data.providerRelationships ?? []) {
    const slug = typeof entry === "string" ? entry : entry.providerSlug;
    const relationship = typeof entry === "string" ? "MENTIONED" : entry.relationship ?? "MENTIONED";
    providerRelationshipsBySlug.set(slug, relationship);
  }
  const providerRelationships =
    data.relatedProviders !== undefined || data.providerRelationships !== undefined
      ? Array.from(providerRelationshipsBySlug, ([providerSlug, relationship]) => ({ providerSlug, relationship }))
      : undefined;

  // Same merge for `sources[].sourceType` vs the deprecated `sources[].type`
  // — `sourceType` wins when both are present on the same entry (already
  // warned about above in validateFrontmatter).
  const sources = data.sources?.map((s) => {
    let sourceType = s.sourceType;
    if (!sourceType && s.type) {
      const upper = s.type.toUpperCase();
      if ((SOURCE_TYPES as readonly string[]).includes(upper)) {
        sourceType = upper as ImportSourceType;
      }
    }
    return { label: s.label, url: s.url, sourceType };
  });

  const payload: ArticleImportPayload = {
    title: data.title,
    slug: data.slug,
    // Left undefined (not defaulted here) when absent from frontmatter, so
    // the importer's safe-merge rule can tell "not specified in this file"
    // apart from "explicitly GUIDE" -- an update must never silently flip
    // an existing article's type. importer.ts defaults to GUIDE only on
    // CREATE, mirroring how `status` is only ever set on CREATE.
    articleType: data.articleType as ArticleImportPayload["articleType"],
    content: html,
    excerpt: data.excerpt,
    category: data.category,
    tags: data.tags ? Array.from(new Set(data.tags.map((t) => t.toLowerCase()))) : undefined,
    region: data.region as ImportRegion | undefined,
    canonicalArticleSlug: data.canonicalArticleSlug,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    canonicalUrl: data.canonicalUrl,
    featuredImage: data.featuredImage,
    featuredImageAlt: data.featuredImageAlt,
    author: data.author,
    reviewer: data.reviewer,
    noIndex: data.noIndex,
    affiliateDisclosureRequired: data.affiliateDisclosureRequired,
    scheduledAt: data.scheduledAt,
    lastReviewedAt: data.lastReviewedAt,
    keyTakeaways: data.keyTakeaways,
    searchIntent: data.searchIntent as ArticleImportPayload["searchIntent"],
    providerRelationships,
    cryptoAssetSlugs: data.cryptoAssetSlugs,
    relatedGuides: data.relatedGuides,
    sources,
    affiliateProviders: data.affiliateProviders,
  };

  return { ok: true, payload, warnings: validation.warnings };
}
