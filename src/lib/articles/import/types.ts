import type { ArticleSearchIntent, ArticleType } from "@prisma/client";

/** Region codes the site currently knows how to serve. "GLOBAL" is stored as `region: null`. */
export const IMPORT_REGIONS = ["GLOBAL", "AU", "US", "UK", "NZ", "SG"] as const;
export type ImportRegion = (typeof IMPORT_REGIONS)[number];

/** Mirrors the Prisma `ArticleSourceType` enum — kept as a type alias (not imported from
 * @prisma/client) for the same pre-`prisma generate` reason as ImportRegion below. */
export type ImportSourceType =
  | "OFFICIAL_PROVIDER"
  | "REGULATOR"
  | "GOVERNMENT"
  | "OFFICIAL_DOCUMENTATION"
  | "NEWS"
  | "RESEARCH"
  | "OTHER";

export interface ImportSource {
  label: string;
  url: string;
  /** Stored on `ArticleSource.sourceType` (see prisma/schema.prisma — the column was added in
   * migration 20260911053226_add_article_layout). */
  sourceType?: ImportSourceType;
}

export type ProviderRelationshipInput =
  | string
  | { providerSlug: string; relationship?: "MENTIONED" | "COMPARED" | "FEATURED" };

/**
 * Fully parsed and validated representation of one article file, ready to
 * be handed to the importer (Phase 2). Field-level `undefined` means "not
 * present in the file" (update semantics leave it untouched); explicit
 * `null` is only used where the schema itself is nullable and the author
 * meant to clear it.
 */
export interface ArticleImportPayload {
  title: string;
  slug: string;
  content: string; // sanitized HTML, ready for storage
  /**
   * Required by the Article schema (see prisma/schema.prisma Block 1), but
   * kept optional here and defaulted at import time (parser.ts) rather than
   * making every existing import file a hard error — see
   * docs/article-import-format.md "articleType". Full import-format
   * validation of this field (unknown values, embed-aware checks, etc.) is
   * Article CMS Block 5 scope; this is the minimal compatibility fix.
   */
  articleType?: ArticleType;
  excerpt?: string;
  category?: string;
  tags?: string[];
  region?: ImportRegion;
  /** Slug of the GLOBAL/default article this is a regional variant of. */
  canonicalArticleSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  featuredImage?: string;
  /** Alt text for `featuredImage` — see prisma/schema.prisma comment on `Article.featuredImageAlt`. */
  featuredImageAlt?: string;
  author?: string;
  reviewer?: string;
  noIndex?: boolean;
  affiliateDisclosureRequired?: boolean;
  /** Advisory only — nothing reads this to auto-publish. See docs/ROADMAP.md "Scheduling". */
  scheduledAt?: string;
  /** Editorial "meaningfully reviewed" timestamp, distinct from the row's updatedAt. */
  lastReviewedAt?: string;
  keyTakeaways?: string[];
  searchIntent?: ArticleSearchIntent;
  providerRelationships?: { providerSlug: string; relationship: "MENTIONED" | "COMPARED" | "FEATURED" }[];
  /** Slugs of `CryptoAsset` rows this article is about — matched against `CryptoAsset.slug`,
   * never auto-created (same rule as `providerRelationships`/`relatedGuides`). */
  cryptoAssetSlugs?: string[];
  relatedGuides?: string[];
  sources?: ImportSource[];
  affiliateProviders?: string[];
}

export interface ParsedFile {
  /** Absolute path on disk. */
  filePath: string;
  fileName: string;
}

export type ImportOutcome = "CREATED" | "UPDATED" | "SKIPPED" | "FAILED";

export interface ImportWarning {
  message: string;
}

export interface ImportResult {
  fileName: string;
  slug?: string;
  outcome: ImportOutcome;
  warnings: string[];
  /** Present only when outcome is FAILED. */
  error?: string;
  dryRun: boolean;
  /** Set once the file has actually been moved into processed/. */
  movedTo?: string;
}