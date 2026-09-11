import matter from "gray-matter";
import { validateFrontmatter } from "./schema";
import { markdownToSafeHtml } from "./markdown";
import type { ArticleImportPayload, ImportRegion } from "./types";

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

  const relatedProviders = data.relatedProviders?.map((entry) =>
    typeof entry === "string"
      ? { slug: entry, relationship: "MENTIONED" as const }
      : { slug: entry.slug, relationship: entry.relationship ?? ("MENTIONED" as const) }
  );

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
    author: data.author,
    reviewer: data.reviewer,
    noIndex: data.noIndex,
    keyTakeaways: data.keyTakeaways,
    searchIntent: data.searchIntent as ArticleImportPayload["searchIntent"],
    relatedProviders,
    relatedGuides: data.relatedGuides,
    sources: data.sources?.map((s) => ({ label: s.label, url: s.url })),
    affiliateProviders: data.affiliateProviders,
  };

  return { ok: true, payload, warnings: validation.warnings };
}