import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "./config";
import { canonicalUrl } from "./canonical";
import type { SeoOverrides } from "./types";

interface BuildMetadataInput extends SeoOverrides {
  /** Fallback title, used when no seoTitle override is present. */
  title: string;
  /** Fallback description, used when no seoDescription override is present. */
  description: string;
  /** Site-relative path, e.g. "/crypto/guides/how-to-buy-bitcoin-australia" */
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | Date | null;
  modifiedTime?: string | Date | null;
  authors?: string[];
}

/**
 * The one function every page's generateMetadata (or static metadata
 * export) should call. Admin overrides win when present; otherwise falls
 * back to the page-type default. Centralizes title/description/canonical/
 * OG/Twitter/robots so none of it is duplicated in UI components.
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const title = input.seoTitle?.trim() || input.title;
  const description = input.seoDescription?.trim() || input.description;
  const url = canonicalUrl(input.path, input.canonicalUrl);
  const noIndex = Boolean(input.noIndex);
  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : absoluteUrl(input.image)
    : absoluteUrl("/og-default.png");

  const openGraphBase = {
    title,
    description,
    url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: image }],
  };

  const openGraph =
    input.type === "article"
      ? {
          ...openGraphBase,
          type: "article" as const,
          publishedTime: input.publishedTime
            ? new Date(input.publishedTime).toISOString()
            : undefined,
          modifiedTime: input.modifiedTime
            ? new Date(input.modifiedTime).toISOString()
            : undefined,
          authors: input.authors,
        }
      : { ...openGraphBase, type: "website" as const };

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
