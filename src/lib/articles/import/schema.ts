import { z } from "zod";
import { IMPORT_REGIONS } from "./types";

/** Mirrors the Prisma `ArticleSearchIntent` enum — see prisma/schema.prisma. Kept as a plain
 * literal list (not imported from @prisma/client) so this module stays usable before `prisma
 * generate` has run, e.g. in Phase 1 dry-runs against a fresh checkout. */
const SEARCH_INTENTS = [
  "LEARN",
  "HOW_TO",
  "BEGINNER",
  "COMPARISON",
  "PROVIDER_GUIDE",
  "FEES",
  "SECURITY",
  "WALLET",
  "REGULATION",
  "MARKET_EDUCATION",
] as const;

const RELATIONSHIP_TYPES = ["MENTIONED", "COMPARED", "FEATURED"] as const;

/** Mirrors the Prisma `ArticleType` enum — see prisma/schema.prisma. Kept as a plain literal
 * list for the same pre-`prisma generate` reason as SEARCH_INTENTS above. */
const ARTICLE_TYPES = ["NEWS", "GUIDE"] as const;

/** Lowercase, hyphen-separated, no leading/trailing/double hyphens — matches Article.slug and
 * Provider.slug conventions already used by the seed data. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugField = z
  .string()
  .trim()
  .min(1, "slug is required")
  .regex(SLUG_PATTERN, 'slug must be lowercase, URL-safe, hyphen-separated (e.g. "how-to-trade-crypto")');

const urlField = z.string().trim().refine(
  (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "must be a valid http(s) URL" }
);

const sourceField = z.object({
  label: z.string().trim().min(1, "source label is required"),
  url: urlField,
  type: z.string().trim().optional(),
});

const relatedProviderField = z.union([
  z.string().trim().min(1),
  z.object({
    slug: z.string().trim().min(1),
    relationship: z.enum(RELATIONSHIP_TYPES).optional(),
  }),
]);

/**
 * Raw frontmatter shape, before normalization. Mirrors docs/article-publishing-format.md.
 * `status` is accepted (so we can warn on it) but is never used to set the stored status —
 * see importer.ts / docs for the DRAFT-only import policy.
 */
export const articleFrontmatterSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200, "title should be under 200 characters"),
  slug: slugField,
  articleType: z.enum(ARTICLE_TYPES).optional(),
  excerpt: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  region: z.enum(IMPORT_REGIONS).optional(),
  canonicalArticleSlug: slugField.optional(),
  seoTitle: z.string().trim().min(1).optional(),
  seoDescription: z.string().trim().min(1).optional(),
  canonicalUrl: urlField.optional(),
  featuredImage: z.string().trim().min(1).optional(),
  author: z.string().trim().min(1).optional(),
  reviewer: z.string().trim().min(1).optional(),
  noIndex: z.boolean().optional(),
  keyTakeaways: z.array(z.string().trim().min(1)).optional(),
  searchIntent: z.enum(SEARCH_INTENTS).optional(),
  relatedProviders: z.array(relatedProviderField).optional(),
  relatedGuides: z.array(slugField).optional(),
  sources: z.array(sourceField).optional(),
  affiliateProviders: z.array(z.string().trim().min(1)).optional(),
  status: z.string().trim().optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export interface FrontmatterValidation {
  ok: boolean;
  data?: ArticleFrontmatter;
  errors: string[];
  /** Non-fatal issues — surfaced as WARN, do not block import. */
  warnings: string[];
}

/**
 * Validates raw frontmatter + body against the article contract. Returns both hard errors
 * (block import) and soft warnings (SEO length guidance, ignored `status`, etc.) — see
 * spec §9 "Do not silently accept malformed values" and §7 (DRAFT-only policy).
 */
export function validateFrontmatter(raw: unknown, body: string): FrontmatterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const result = articleFrontmatterSchema.safeParse(raw);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "(root)";
      errors.push(`${path}: ${issue.message}`);
    }
    return { ok: false, errors, warnings };
  }

  const data = result.data;

  if (!body || body.trim().length === 0) {
    errors.push("content: body must not be empty");
  }

  if (data.status && data.status.toUpperCase() !== "DRAFT") {
    warnings.push(`status "${data.status}" was ignored — imports are always created as DRAFT`);
  }

  if (!data.articleType) {
    warnings.push(
      'articleType not set — defaulted to "GUIDE". Add "articleType: NEWS" or "articleType: GUIDE" to frontmatter to be explicit.'
    );
  }

  if (data.seoTitle && data.seoTitle.length > 60) {
    warnings.push(`seoTitle is ${data.seoTitle.length} chars — recommended under 60`);
  }
  if (data.seoDescription && data.seoDescription.length > 160) {
    warnings.push(`seoDescription is ${data.seoDescription.length} chars — recommended under 160`);
  }

  if (data.sources) {
    for (const source of data.sources) {
      if (source.type) {
        warnings.push(
          `source "${source.label}" has type "${source.type}", which is not stored — ArticleSource has no type column yet`
        );
      }
    }
  }

  if (data.region && data.region !== "GLOBAL" && !data.canonicalArticleSlug) {
    warnings.push(
      `region "${data.region}" set without canonicalArticleSlug — this will import as a standalone article, not a regional variant`
    );
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  return { ok: true, data, errors, warnings };
}