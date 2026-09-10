import type { ArticleSearchIntent } from "@prisma/client";

/** Region codes the site currently knows how to serve. "GLOBAL" is stored as `region: null`. */
export const IMPORT_REGIONS = ["GLOBAL", "AU", "US", "UK", "NZ", "SG"] as const;
export type ImportRegion = (typeof IMPORT_REGIONS)[number];

export interface ImportSource {
  label: string;
  url: string;
  /**
   * Accepted for forward-compatibility with the article file contract, but
   * `ArticleSource` has no `type` column today — see docs/article-publishing-format.md
   * "Known limitations". Carried through parsing/validation and then dropped
   * (with a WARNING) rather than silently discarded without a trace.
   */
  type?: string;
}

export type RelatedProviderInput =
  | string
  | { slug: string; relationship?: "MENTIONED" | "COMPARED" | "FEATURED" };

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
  author?: string;
  reviewer?: string;
  noIndex?: boolean;
  keyTakeaways?: string[];
  searchIntent?: ArticleSearchIntent;
  relatedProviders?: { slug: string; relationship: "MENTIONED" | "COMPARED" | "FEATURED" }[];
  relatedGuides?: string[];
  sources?: { label: string; url: string }[];
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