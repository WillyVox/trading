import type { MetadataRoute } from "next";
import type { ArticleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "./config";
import { STATIC_GUIDES } from "@/lib/guides/static-guides";

/**
 * Note: domain-specific comparison routes is intentionally excluded from the sitemap for now
 * -- pages are noindex until indexing every possible provider combination
 * has had an SEO review (Phase 8). /crypto/exchanges/compare is different:
 * it's a single, deterministic, always-complete comparison (every
 * CRYPTO_EXCHANGE provider, no combinatorial URL to generate), so it's
 * both indexed and listed below rather than programmatically generating
 * every provider-pair/triple combination just to grow sitemap size (see
 * audit rule §34). /share-trading/compare is its share trading
 * counterpart and is listed for exactly the same reason.
 *
 * /crypto/[slug] is now backed by the CryptoAsset model (see cryptoAssetEntries).
 *
 * /share-trading/[slug] (offering foundation, Milestone 1) is the sibling
 * this file's own comment anticipated on providerEntries() below -- see
 * offeringEntries().
 */

export async function staticEntries(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "",
    "/crypto",
    "/crypto/exchanges",
    "/guides",
    "/crypto/exchanges/compare",
    "/share-trading/compare",
    "/share-trading",
    "/news",
    "/tools",
    "/methodology",
    "/methodology/editorial-policy",
    "/methodology/comparisons",
    "/affiliate-disclosure",
    "/how-we-get-paid",
    "/terms",
    "/privacy",
  ];
  return [
    ...paths.map((path) => ({ url: absoluteUrl(path) })),
    ...STATIC_GUIDES.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.updatedAt),
    })),
  ];
}

export async function guideEntries(): Promise<MetadataRoute.Sitemap> {
  // `articleType` (not `category`) is what actually scopes a listing to
  // guides — see lib/articles/service.ts. `category` is a free-text topic
  // filter that a GUIDE is never guaranteed to carry the literal value
  // "guide" in, so filtering the sitemap on it silently dropped any guide
  // whose category was e.g. "how-to" or "crypto-exchanges".
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      noIndex: false,
      articleType: "GUIDE" satisfies ArticleType,
      slug: { notIn: STATIC_GUIDES.map((guide) => guide.slug) },
    },
    select: { slug: true, lastReviewedAt: true, publishedAt: true },
  });
  return articles.map((a) => ({
    url: absoluteUrl(`/guides/${a.slug}`),
    lastModified: a.lastReviewedAt ?? a.publishedAt ?? undefined,
  }));
}

export async function newsEntries(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      noIndex: false,
      articleType: "NEWS" satisfies ArticleType,
    },
    select: { slug: true, lastReviewedAt: true, publishedAt: true },
  });
  return articles.map((a) => ({
    url: absoluteUrl(`/news/${a.slug}`),
    lastModified: a.lastReviewedAt ?? a.publishedAt ?? undefined,
  }));
}

export async function providerEntries(): Promise<MetadataRoute.Sitemap> {
  const offerings = await prisma.providerOffering.findMany({
    where: { active: true, noIndex: false, offeringType: "CRYPTO_EXCHANGE" },
    select: { updatedAt: true, provider: { select: { slug: true } } },
  });
  return offerings.map((o) => ({
    url: absoluteUrl(`/crypto/exchanges/${o.provider.slug}`),
    lastModified: o.updatedAt,
  }));
}

/**
 * Share trading platform profiles (offering foundation, Milestone 1) — the
 * sibling this file used to anticipate as a TODO on providerEntries()
 * above. Only active, indexable offerings, mirroring providerEntries()'s
 * noIndex filter.
 */
export async function offeringEntries(): Promise<MetadataRoute.Sitemap> {
  const offerings = await prisma.providerOffering.findMany({
    where: { active: true, noIndex: false, offeringType: "SHARE_TRADING" },
    select: { slug: true, updatedAt: true },
  });
  return offerings.map((o) => ({
    url: absoluteUrl(`/share-trading/${o.slug}`),
    lastModified: o.updatedAt,
  }));
}

export async function cryptoAssetEntries(): Promise<MetadataRoute.Sitemap> {
  const assets = await prisma.cryptoAsset.findMany({
    select: { slug: true, updatedAt: true },
  });
  return assets.map((a) => ({
    url: absoluteUrl(`/crypto/${a.slug}`),
    lastModified: a.updatedAt,
  }));
}
