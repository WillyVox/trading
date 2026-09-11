import { z } from "zod";
import { SLUG_PATTERN } from "@/lib/articles/slug";
import { urlField, SOURCE_TYPES, RELATIONSHIP_TYPES } from "@/lib/articles/import/schema";
import { IMPORT_REGIONS } from "@/lib/articles/import/types";

/**
 * Zod schemas backing the admin article editor's server actions
 * (src/lib/articles/actions.ts). Deliberately reuses the same slug/url
 * primitives as the importer (src/lib/articles/import/schema.ts) rather
 * than redefining them, since both are validating writes to the same
 * Article domain — see Req.md §2 "reuse these systems, don't duplicate."
 */

export const ARTICLE_TYPES = ["NEWS", "GUIDE"] as const;

export const SEARCH_INTENTS = [
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

/** Re-exported so existing imports of PROVIDER_RELATIONSHIPS/SOURCE_TYPES from this module keep
 * working — the canonical lists now live in import/schema.ts (see that file's comments) so the
 * admin editor and the importer can never drift apart on allowed enum values. */
export const PROVIDER_RELATIONSHIPS = RELATIONSHIP_TYPES;
export { SOURCE_TYPES };

const slugField = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200)
  .regex(SLUG_PATTERN, 'Slug must be lowercase, URL-safe, hyphen-separated (e.g. "how-to-buy-bitcoin")');

export const providerRelationshipField = z.object({
  providerId: z.string().trim().min(1),
  relationship: z.enum(PROVIDER_RELATIONSHIPS),
});

export const sourceEntryField = z.object({
  label: z.string().trim().min(1, "Source label is required"),
  url: urlField,
  sourceType: z.enum(SOURCE_TYPES).optional(),
});

/**
 * Full set of fields the article form can submit. Used for both create and
 * update — on create, `slug`/`title`/`articleType`/`content` are required;
 * on update every field is still validated the same way (this is a "save
 * the whole form" editor, not a PATCH-style partial-field API) but the
 * article's `id` comes from the route, not the body.
 */
export const articleFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title should be under 200 characters"),
  slug: slugField,
  articleType: z.enum(ARTICLE_TYPES, { message: "Choose NEWS or GUIDE" }),
  category: z.string().trim().max(120).optional(),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(1, "Content is required"),

  author: z.string().trim().max(120).optional(),
  reviewer: z.string().trim().max(120).optional(),
  lastReviewedAt: z.string().trim().optional(), // yyyy-mm-dd from <input type="date">

  keyTakeaways: z.array(z.string().trim().min(1)).max(20).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  searchIntent: z.enum(SEARCH_INTENTS).optional(),

  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(200).optional(),
  canonicalUrl: urlField.optional(),
  featuredImage: z.string().trim().max(1000).optional(),
  featuredImageAlt: z.string().trim().max(250).optional(),
  noIndex: z.boolean().optional(),

  affiliateDisclosureRequired: z.boolean().optional(),

  region: z.enum(IMPORT_REGIONS).optional(),
  canonicalArticleId: z.string().trim().optional(),

  // scheduledAt is stored but never acted on automatically — see the
  // "Scheduling" note in the Publishing panel and docs/ROADMAP.md.
  scheduledAt: z.string().trim().optional(),

  providerRelationships: z.array(providerRelationshipField).max(50).optional(),
  cryptoAssetIds: z.array(z.string().trim().min(1)).max(50).optional(),
  relatedGuideIds: z.array(z.string().trim().min(1)).max(20).optional(),
  sources: z.array(sourceEntryField).max(30).optional(),
});

export type ArticleFormInput = z.infer<typeof articleFormSchema>;

export interface ArticleFormValidation {
  ok: boolean;
  data?: ArticleFormInput;
  errors: string[];
}

export function validateArticleForm(raw: unknown): ArticleFormValidation {
  const result = articleFormSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join(".") || "(root)";
      return `${path}: ${issue.message}`;
    });
    return { ok: false, errors };
  }
  return { ok: true, data: result.data, errors: [] };
}