import { siteConfig, absoluteUrl } from "./config";
import type { BreadcrumbItem } from "./types";

/**
 * All builders here only emit schema for information that is actually
 * rendered on the page. No fake Review/AggregateRating/Product/author —
 * see Phase 0 audit rules (§11).
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

interface ArticleSchemaInput {
  headline: string;
  description?: string | null;
  image?: string | null;
  author?: string | null;
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
  path: string;
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image
      ? { image: [input.image.startsWith("http") ? input.image : absoluteUrl(input.image)] }
      : {}),
    ...(input.author ? { author: { "@type": "Person", name: input.author } } : {}),
    ...(input.datePublished
      ? { datePublished: new Date(input.datePublished).toISOString() }
      : {}),
    ...(input.dateModified ? { dateModified: new Date(input.dateModified).toISOString() } : {}),
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: absoluteUrl(input.path),
  };
}

/** Only use for content that genuinely qualifies as news (see audit §O). */
export function newsArticleSchema(input: ArticleSchemaInput) {
  return { ...articleSchema(input), "@type": "NewsArticle" };
}
