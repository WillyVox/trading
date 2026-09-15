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

/**
 * FAQPage schema — only ever build this from question/answer pairs that
 * are actually rendered as visible page copy (same rule as every other
 * builder in this file: no fabricated content). `answer` should be plain
 * text — strip any markup before passing it in.
 */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * HowTo schema for numbered step-by-step guides (see the "simple steps to
 * buy cryptocurrency" guide). `step.name` should mirror the on-page H2 for
 * that step so the schema never claims more than the visible content.
 */
export function howToSchema(input: {
  name: string;
  description?: string | null;
  image?: string | null;
  totalTime?: string; // ISO 8601 duration, e.g. "PT10M"
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: [input.image.startsWith("http") ? input.image : absoluteUrl(input.image)] } : {}),
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
