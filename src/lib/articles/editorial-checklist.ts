import { estimateReadingMinutes } from "@/lib/articles/content";

/**
 * Advisory editorial/SEO panel for the admin editor — Req.md §12: useful
 * warnings, never a fake "SEO score = guaranteed ranking" and never an
 * encouragement to stuff keywords. Every item here is computed from fields
 * that already exist on the article; nothing is fabricated.
 *
 * Two checks Req.md's example list mentions are deliberately NOT
 * implemented yet because the data they'd need doesn't exist until later
 * blocks: "broken/invalid embed references" needs the Block 4 ArticleEmbed
 * model, and per-image alt-text coverage needs the Block 3 ArticleRenderer
 * to know what images actually appear in rendered body content. Don't fake
 * either — add them when their underlying data exists.
 */

export type ChecklistLevel = "good" | "warning" | "info";

export interface ChecklistItem {
  level: ChecklistLevel;
  message: string;
}

export interface EditorialChecklistInput {
  title: string;
  excerpt?: string | null;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  author?: string | null;
  reviewer?: string | null;
  lastReviewedAt?: Date | string | null;
  keyTakeaways?: string[];
  sourceCount: number;
  // Raw relationships, not a pre-computed boolean — this function derives
  // `hasFeaturedOrComparedProvider` (and the count) itself so callers can't
  // forget the derivation step. Only `relationship` is read; pass whatever
  // shape the caller already has (form rows or ArticleProvider records).
  providerRelationships: Array<{ relationship: "MENTIONED" | "COMPARED" | "FEATURED" }>;
  cryptoAssetCount: number;
  noIndex?: boolean;
  affiliateDisclosureRequired?: boolean;
}

const STALE_REVIEW_DAYS = 180;

export function buildEditorialChecklist(input: EditorialChecklistInput): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const providerRelationshipCount = input.providerRelationships.length;
  const hasFeaturedOrComparedProvider = input.providerRelationships.some(
    (p) => p.relationship === "FEATURED" || p.relationship === "COMPARED"
  );

  items.push(
    input.excerpt && input.excerpt.trim().length > 0
      ? { level: "good", message: "Excerpt provided" }
      : { level: "warning", message: "Excerpt missing — used as the listing/summary description" }
  );

  if (!input.seoTitle) {
    items.push({ level: "warning", message: "SEO title missing — falls back to the article title" });
  } else if (input.seoTitle.length > 60) {
    items.push({ level: "warning", message: `SEO title is ${input.seoTitle.length} chars — recommended under 60` });
  } else {
    items.push({ level: "good", message: "SEO title provided" });
  }

  if (!input.seoDescription) {
    items.push({ level: "warning", message: "Meta description missing" });
  } else if (input.seoDescription.length > 160) {
    items.push({ level: "warning", message: `Meta description is ${input.seoDescription.length} chars — recommended under 160` });
  } else {
    items.push({ level: "good", message: "Meta description provided" });
  }

  if (!input.featuredImage) {
    items.push({ level: "warning", message: "No featured image" });
  } else if (!input.featuredImageAlt) {
    items.push({ level: "warning", message: "Featured image has no alt text" });
  } else {
    items.push({ level: "good", message: "Featured image with alt text" });
  }

  if (input.sourceCount === 0) {
    items.push({ level: "warning", message: "Article contains no sources — important for financial/crypto content" });
  } else {
    items.push({ level: "good", message: `${input.sourceCount} source${input.sourceCount === 1 ? "" : "s"}` });
  }

  items.push(
    input.author ? { level: "good", message: "Author present" } : { level: "warning", message: "No author set" }
  );
  items.push(
    input.reviewer ? { level: "good", message: "Reviewer present" } : { level: "warning", message: "No reviewer set" }
  );

  if (!input.lastReviewedAt) {
    items.push({ level: "warning", message: "Article has never been marked as fact-checked/reviewed" });
  } else {
    const lastReviewed = new Date(input.lastReviewedAt);
    const daysSince = Math.floor((Date.now() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > STALE_REVIEW_DAYS) {
      items.push({ level: "warning", message: `Last reviewed ${daysSince} days ago — consider a fact-check pass` });
    } else {
      items.push({ level: "good", message: `Last reviewed ${daysSince} day${daysSince === 1 ? "" : "s"} ago` });
    }
  }

  const takeawayCount = input.keyTakeaways?.length ?? 0;
  items.push(
    takeawayCount > 0
      ? { level: "good", message: `${takeawayCount} key takeaway${takeawayCount === 1 ? "" : "s"}` }
      : { level: "warning", message: "No key takeaways" }
  );

  items.push(
    providerRelationshipCount > 0
      ? { level: "good", message: `${providerRelationshipCount} related provider${providerRelationshipCount === 1 ? "" : "s"} configured` }
      : { level: "info", message: "No related providers configured" }
  );

  items.push(
    input.cryptoAssetCount > 0
      ? { level: "good", message: `${input.cryptoAssetCount} related crypto asset${input.cryptoAssetCount === 1 ? "" : "s"}` }
      : { level: "info", message: "No related crypto assets" }
  );

  if (hasFeaturedOrComparedProvider && !input.affiliateDisclosureRequired) {
    items.push({
      level: "warning",
      message: "Article features/compares a provider but affiliate disclosure is disabled",
    });
  }

  const words = input.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  items.push({ level: "info", message: `${words} words \u2022 ~${estimateReadingMinutes(input.content)} min read` });

  items.push({
    level: "info",
    message: input.noIndex ? "noindex is ON — excluded from search engines" : "noindex is off — indexable once published",
  });

  return items;
}